import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import BModal from '../../../Components/Common/Modal';
import {
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  FormText,
  Input,
  Label,
  ModalFooter,
  UncontrolledDropdown
} from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import * as Yup from 'yup';
import * as moment from 'moment';
import BInput from '../../../Components/Common/BInput';
import Alerts from '../../../Components/Common/Alerts';
import Switch from '../../../Components/Common/Switch';
import { useUpdateMutation } from '../../../services/product_type';
import { toast } from 'react-toastify';
import { useLocationListAsOptionsQuery } from '../../../services/location';
import { useCategoryQuery } from '../../../services/category';
import { useCreateMutation } from '../../../services/stocktake';
import { useSellertypeQuery } from '../../../services/seller_type';
import { useNavigate } from 'react-router-dom';

const PreCreateModal = ({ show, setShowModal, data: modal_data, ...props }) => {
  const navigate = useNavigate();
  const [
    create,
    {
      isLoading: loading_create,
      data,

      error,
      isSuccess: create_success,
      isError: create_error,
      reset
    }
  ] = useCreateMutation();
  const { data: seller_types, isProcessing, isFetching } = useSellertypeQuery();
  const { data: categoryList } = useCategoryQuery({});
  const { data: location_options, isLoading: loading_location } =
    useLocationListAsOptionsQuery({
      per_page: 1000
    });
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
  const [location, setLocation] = useState(undefined);
  const [category, setCategory] = useState(undefined);
  const [seller_type, setSellerType] = useState(undefined);
  const [isfreeze_qty, setFreeze] = useState(1);
  const [transaction_date, setTransactionDate] = useState(moment.now());
  const [form, setForm] = useState({
    location: undefined,
    seller_type: 0,
    category: 0,
    transaction_date: moment.now()
  });
  const asterisk = { color: '#FF0000', fontWeight: 'bold' };
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...form
    },
    validationSchema: Yup.object({
      transaction_date: Yup.string().required(
        'Transaction Date Field is Required'
      ),

      location: Yup.string().required('Location Field is Required')
    }),
    onSubmit: (values) => {
      handleSubmit();
    }
  });

  useEffect(() => {
    if (!!create_success || !!update_success) {
      setForm({
        name: '',
        vendor: '',
        status: 1
      });
      setLocation(undefined);

      setTransactionDate(moment.now());
      validation.resetForm();
      setShowModal(false);
    }
    if (seller_types?.data) {
      setForm({ ...form, seller_type: seller_types.data[0].id });
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
    const body = {
      ...form,
      seller_type: seller_type === undefined ? 0 : seller_type.value,
      transaction_no: '',
      category: category === undefined ? 0 : category.value,
      remarks: '',
      status: 1,
      isfreeze_qty: isfreeze_qty,
      transaction_date: moment(form.transaction_date).format('YYYY-MM-DD')
    };

    try {
      const xhr = await create(body);

      if (!!xhr?.data?.id) {
        setShowModal(false);
        navigate(`${xhr.data.id}/new`);
      }
    } catch (e) {}
  };
  const handleChangeSellerType = (e) => {
    setForm({ ...form, seller_type: e.target.value });
  };
  const handleChangeCategory = (e) => {
    setForm({ ...form, category: e.target.value });
  };
  const handleSwitch = (e) => {
    const freeze = e.target.checked ? 1 : 0;
    setFreeze(freeze);
  };
  const handleOnCancel = () => {
    setForm({
      location: undefined,
      seller_type: undefined,
      transaction_date: moment.now()
    });
    setLocation(undefined);

    setTransactionDate(moment.now());
    validation.resetForm();
    reset();
    setShowModal(false);
  };

  return (
    <BModal
      show={show}
      title="New Stocktake Transaction"
      onCloseClick={handleOnCancel}
      id="PreCreateModal"
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
          <div className="mb-3">
            <Alerts
              msg={error?.data?.message}
              color="danger"
              icon="ri-error-warning-line"
            />
          </div>
        )}
        <div className="mb-3">
          <Label htmlFor="transaction_date" className="form-label">
            Effectivity Date <span style={asterisk}>*</span>
          </Label>
          <Flatpickr
            value={transaction_date}
            onChange={(date) => {
              const value = date[0];
              setTransactionDate(value);
              setForm({ ...form, transaction_date: value });
            }}
            className="form-control"
            options={{
              dateFormat: 'Y-m-d',
              minDate: 'today'
            }}
          />
          <FormText color="danger">
            {validation.errors.transaction_date || ''}
          </FormText>
        </div>
        <div className="mb-3">
          <FormGroup>
            <Label htmlFor="category" className="form-label">
              Category <span style={asterisk}>*</span>
            </Label>

            <Select
              id="category"
              placeholder="Select Category"
              options={[
                { value: 0, label: 'All' },
                ...(categoryList?.data.map((r) => ({
                  label: r.name,
                  value: r.id
                })) || [])
              ]}
              value={category || { value: 0, label: 'All' }}
              onChange={(option) => {
                setCategory(option);
                setForm({ ...form, category: option.value });
              }}
              isLoading={loading_location}
            />
          </FormGroup>
        </div>

        <div className="mb-3">
          <FormGroup>
            <Label htmlFor="location" className="form-label">
              Location <span style={asterisk}>*</span>
            </Label>
            <Select
              id="location"
              placeholder="Select Location"
              options={location_options || []}
              value={location || undefined}
              onChange={(option) => {
                setLocation(option);
                setForm({ ...form, location: option.value });
              }}
              isLoading={loading_location}
            />
            <FormText color="danger">
              {validation.errors.location || ''}
            </FormText>
          </FormGroup>
        </div>
        <div className="mb-3">
          <FormGroup>
            <Label htmlFor="seller_type" className="form-label">
              Seller Type
            </Label>

            <Select
              id="seller_type"
              placeholder="Select Seller Type"
              options={[
                { value: 0, label: 'All' },
                ...(seller_types?.data.map((r) => ({
                  label: r.name,
                  value: r.id
                })) || [])
              ]}
              value={seller_type || { value: 0, label: 'All' }}
              onChange={(option) => {
                setSellerType(option);

                setForm({ ...form, seller_type: option.value });
              }}
              isLoading={loading_location}
            />

            <FormText color="danger">
              {validation.errors.seller_type || ''}
            </FormText>
          </FormGroup>
        </div>
        <div className="mb-3">
          <FormGroup>
            <Switch
              title="Freeze Quantity on hand"
              onChange={handleSwitch}
              checked={isfreeze_qty === 1}
            />
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

export default PreCreateModal;
