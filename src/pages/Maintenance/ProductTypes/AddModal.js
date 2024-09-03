import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import BModal from '../../../Components/Common/Modal';
import { FormGroup, Input, Label, ModalFooter } from 'reactstrap';
import Select from 'react-select/async-creatable';
import * as Yup from 'yup';
import BInput from '../../../Components/Common/BInput';
import Alerts from '../../../Components/Common/Alerts';
import {
  useCreateMutation,
  useLazySearchQuery,
  useUpdateMutation
} from '../../../services/product_type';
import { toast } from 'react-toastify';
import { MODAL_TYPE } from '.';

const AddModal = ({
  show,
  setShowModal,
  data: modal_data,
  type: modal_type,
  ...props
}) => {
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
  const [search] = useLazySearchQuery();
  const [form, setForm] = useState({
    name: '',
    vendor: '',
    status: 1,
    reference: 0
  });
  const [active, setActive] = useState(undefined);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...form
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name Field is Required')
    }),
    onSubmit: (values) => {
      handleSubmit();
    }
  });

  useEffect(() => {
    if (modal_type === MODAL_TYPE.UPDATE) {
      setForm({
        name: modal_data?.name,
        vendor: modal_data?.vendor,
        status: modal_data?.status,
        reference: modal_data?.reference
      });

      setActive({
        label: modal_data?.vendor,
        value: modal_data?.vendor
      });
    }
  }, [modal_data, modal_type]);

  useEffect(() => {
    if (!!create_success || !!update_success) {
      setForm({
        name: '',
        vendor: '',
        status: 1
      });
      setActive(undefined);
      setShowModal(false);
      toast.success(
        `Product type ${create_success ? 'created' : 'updated'} successfully!`,
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
    } else if (MODAL_TYPE.UPDATE && !!modal_data.id) {
      const xhr = await update({ id: modal_data.id, body });
    }
  };

  const loadOptions = async (value) => {
    const search_xhr = await search({ keywords: value });
    const { data } = search_xhr;

    return new Promise((resolve) => {
      resolve(data);
    });
  };

  const handleOnCancel = () => {
    setForm({
      name: '',
      vendor: '',
      status: 1
    });
    setActive(undefined);
    setShowModal(false);
  };

  return (
    <BModal
      show={show}
      title={modal_type === MODAL_TYPE.CREATE ? 'New Brand' : 'Update Brand'}
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
            label="Brand Name"
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
          <Label className="form-label text-nowrap">Vendor</Label>
          <Select
            value={active || undefined}
            onChange={(option) => {
              setActive(option);
              setForm({ ...form, vendor: option?.value || '' });
            }}
            onInputChange={(vendor, am) => {
              if (am.action === 'input-change') {
                setForm({ ...form, vendor });
              }
            }}
            placeholder="Select Vendor"
            loadOptions={loadOptions}
            backspaceRemovesValue
            isClearable
            createOptionPosition="first"
            noOptionsMessage={(_) => 'No other matches'}
            defaultInputValue={modal_data?.vendor || form.vendor}
            isValidNewOption={(str) => modal_data?.vendor !== str && !!str}
          />
        </div>
        <div>
          <label htmlFor="symbol" className="form-label">
            Reference
          </label>
          <Input
            type="text"
            className="form-control"
            name="reference"
            id="reference"
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            value={form?.reference || ''}
          />
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
              disabled={loading_create || loading_update}
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
