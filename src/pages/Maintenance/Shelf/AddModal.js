import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import BModal from '../../../Components/Common/Modal';
import {
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  ModalFooter
} from 'reactstrap';
import Select from 'react-select';
import * as Yup from 'yup';
import BInput from '../../../Components/Common/BInput';
import Alerts from '../../../Components/Common/Alerts';
import { useCreateMutation, useUpdateMutation } from '../../../services/shelf';
import { toast } from 'react-toastify';
import { MODAL_TYPE } from '.';
import { useLocationListAsOptionsQuery } from '../../../services/location';

const AddModal = ({
  show,
  setShowModal,
  data: modal_data,
  type: modal_type,
  ...props
}) => {
  const { data: location_options, isLoading: loading_location } =
    useLocationListAsOptionsQuery({ per_page: 1000 });
  const [
    create,
    {
      isLoading: loading_create,
      data,
      error,
      isSuccess: create_success,
      isError: create_error
    }
  ] = useCreateMutation();

  const [
    update,
    {
      isLoading: loading_update,
      data: update_data,
      error: update_error_data,
      isSuccess: update_success,
      isError: update_error
    }
  ] = useUpdateMutation();

  const [form, setForm] = useState({
    name: '',
    location: undefined,
    status: 1
  });
  const [location, setLocation] = useState(undefined);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...form
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name Field is Required'),
      location: Yup.string().required('Location Field is Required')
    }),
    onSubmit: (values) => {
      handleSubmit();
    }
  });

  useEffect(() => {
    if (modal_type === MODAL_TYPE.UPDATE) {
      setForm({
        name: modal_data?.name,
        location: modal_data?.location,
        status: modal_data?.status
      });

      setLocation({
        label: modal_data?.location_name,
        value: modal_data?.location
      });
    }
  }, [modal_data, modal_type]);

  useEffect(() => {
    if (!!create_success || !!update_success) {
      setForm({
        name: '',
        location: '',
        status: 1
      });
      setLocation(undefined);
      setShowModal(false);
      toast.success(
        `Shelf ${create_success ? 'created' : 'updated'} successfully!`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        }
      );
    }

    if (!!create_error || !!update_error) {
      if (error?.data?.error) {
        validation.setErrors(error?.data?.error);
      } else if (update_error_data?.data.error) {
        validation.setErrors(update_error_data?.data?.error);
      }
    }
    /* eslint-disable */
  }, [create_success, create_error, update_success, update_error]);

  const handleSubmit = async () => {
    const body = { ...form };
    if (modal_type === MODAL_TYPE.CREATE) {
      await create(body);
    } else if (modal_type === MODAL_TYPE.UPDATE) {
      await update({ body, id: modal_data?.id });
    }
  };

  const handleOnCancel = () => {
    setForm({
      name: '',
      location: '',
      status: 1
    });
    setLocation(undefined);
    setShowModal(false);
  };

  return (
    <BModal
      show={show}
      title={
        modal_type === MODAL_TYPE.CREATE ? 'Create New Shelf' : 'Update Shelf'
      }
      onCloseClick={handleOnCancel}
      id="AddModal"
    >
      <form
        className="needs-validation"
        onSubmit={(e) => {
          e.preventDefault();

          validation.handleSubmit();
          return false;
        }}
      >
        {create_error && error?.data?.message && (
          <Alerts
            msg={error?.data?.message}
            color="danger"
            icon="ri-error-warning-line"
          />
        )}
        <div className="mb-3">
          <BInput
            label="Type Name"
            placeholder="Enter Name"
            type="text"
            id="type_name"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            invalid={!!(validation.touched.name && validation.errors.name)}
            error={validation.touched.name ? validation.errors.name : ''}
          />
        </div>
        <div className="mb-3">
          <FormGroup>
            <Select
              placeholder="Select Location"
              options={location_options || []}
              value={location || undefined}
              onChange={(option) => {
                setForm({ ...form, location: option.value });
                setLocation(option);
              }}
              isLoading={loading_location}
            />
            <FormText color="danger">
              {validation.errors.location || ''}
            </FormText>
          </FormGroup>
        </div>
        <div className="mb-3">
          <FormGroup switch>
            <Input
              type="switch"
              role="switch"
              name="type_status"
              checked={!!form.status}
              onChange={() => {
                setForm({ ...form, status: !form.status ? 1 : 0 });
              }}
            />
            <Label className="type-status" for="type_status">
              Status
            </Label>
          </FormGroup>
        </div>
        <ModalFooter className="p-0">
          <div className="hstack gap-2 justify-content-end">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading_create}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={handleOnCancel}
            >
              {' '}
              Cancel{' '}
            </button>
          </div>
        </ModalFooter>
      </form>
    </BModal>
  );
};

export default AddModal;
