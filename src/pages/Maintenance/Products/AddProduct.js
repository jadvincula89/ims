import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormText,
  Button
} from 'reactstrap';

import * as Yup from 'yup';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
// Import React FilePond
import { registerPlugin } from 'react-filepond';
import SelectAsync from 'react-select/async';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import BInput from '../../../Components/Common/BInput';
import Switch from '../../../Components/Common/Switch';

import './scss/add_product.scss';
import { useFormik } from 'formik';
import {
  useCategoryQuery,
  useLazyCategoryQuery
} from '../../../services/category';
import {
  useLazyListQuery,
  useListQuery as useProductTypeListQuery
} from '../../../services/product_type';

import { useLazyProductSizeQuery } from '../../../services/size';
import {
  useCreateMutation,
  useLazySkuListQuery,
  useListQuery,
  useUpdateMutation
} from '../../../services/product';
import { toast } from 'react-toastify';
import { SketchPicker } from 'react-color';
import FPLoader from '../../../Components/Common/FPLoader';
import { useLocationListQuery } from '../../../services/location';
import {
  getConditionNameByID,
  getConditionNameByReference,
  getLocationNameByReference
} from '../../../common/helpers/product';
import { useConditionsQuery } from '../../../services/condition';
import { useImageUploadMutation } from '../../../services/file';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [form, setForm] = useState({
    product_id: '0',
    category_id: '',
    type_id: '',
    title: '',
    style_id: '',
    description: '',
    images: '',
    status: 1,
    display_text: '',
    unit_price: '',
    track_inventory: 1,
    replenishment: '',
    replenishments: [],
    track_replenishment: 1,
    reference: '',
    tags: '',
    sizes: undefined
  });
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...form
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Product name is Required'),
      category_id: Yup.string().required('Product category is Required'),
      type_id: Yup.string().required('Product type is Required'),
      sizes: Yup.array().required('Product sizes is Required'),
      unit_price: Yup.number().required('Unit price is Required')
    }),
    onSubmit: (values) => {
      // TODO: submit
      handleSubmit(values);
    }
  });
  const { data, isSuccess } = useListQuery(
    { id: params.id },
    { skip: !params.id }
  );
  const [uploadImage] = useImageUploadMutation();
  const [
    update,
    {
      isLoading: update_loading,
      isSuccess: update_success,
      isError: update_error
    }
  ] = useUpdateMutation();
  const [
    create,
    {
      data: create_data,
      isLoading: create_loading,
      isSuccess: create_success,
      isError: create_error,
      error
    }
  ] = useCreateMutation();
  const [categories, { data: c_data }] = useLazyCategoryQuery();
  const [types] = useLazyListQuery();
  const { data: all_tyles, isSuccess: is_success_all_types } =
    useProductTypeListQuery({ per_page: 10000 });
  const [skuList, { data: sku_sync_data, isLoading: sku_sync_loading }] =
    useLazySkuListQuery();
  const [sizes] = useLazyProductSizeQuery();
  const { data: locations_data } = useLocationListQuery({ per_page: 1000 });
  const { data: conditions_data } = useConditionsQuery({ per_page: 1000 });

  const [category_keywords, setCategoryKeywords] = useState('');
  const [selected_files, setSelectedFiles] = useState(undefined);
  const [selected_category, setSelectedCategory] = useState(undefined);
  const [selected_type, setSelectedType] = useState(undefined);
  const [selected_sizes, setSelectedSizes] = useState(undefined);
  const [selected_colors, setSelectedColors] = useState([]);
  const [replenish, setReplenish] = useState([]);

  useEffect(() => {
    if (!!isSuccess && data?.data?.length > 0) {
      const product = data.data[0];
      setFormData(product);

      if (product?.reference) fetchSkuList(product.reference);
    }

    /* eslint-disable */
  }, [isSuccess]);

  useEffect(() => {
    if (!!create_success || update_success) {
      toast.success(
        `Product ${create_success ? 'created' : 'updated'} successfully!`,
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
      resetForms();
      navigate('/app/products');
    } else if (!!update_error || !!create_error) {
      toast.error(`An error occurred.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  }, [create_success, update_success, update_error]);

  const resetForms = () => {
    setForm({
      product_id: '0',
      category_id: '',
      type_id: '',
      title: '',
      style_id: '',
      description: '',
      images: '',
      status: 1,
      display_text: '',
      unit_price: '',
      track_inventory: 1,
      track_replenishment: '',
      reference: '',
      tags: '',
      sizes: undefined
    });
    setSelectedFiles(undefined);
    setSelectedCategory(undefined);
    setSelectedType(undefined);
    setSelectedSizes(undefined);
  };

  const initializeDefaultColors = (colors) => {
    if (!colors) return;

    const c = (colors || '').split(',');

    if (c.length > 0) {
      const sc = c.map((color) => color);
      setSelectedColors(sc);
      setTimeout(() => {
        c.map((color, i) => {
          document.getElementById(`color_${i}`).value = color;
        });
      }, 50);
    }
  };
  const handleChangeReplenishment = (e, id) => {
    const tempArray = [...replenish];

    const index = tempArray.findIndex((item) => item.id === id);

    if (index !== -1) {
      tempArray[index] = {
        location_id: id,
        quantity: e.target.value,
        shopify_id: form.reference
      };
    } else {
      tempArray.push({
        location_id: id,
        quantity: e.target.value,
        shopify_id: form.reference
      });
    }
    setReplenish(tempArray);
  };
  const setFormData = (data) => {
    setForm({
      product_id: '0',
      category_id: data.category_id,
      type_id: data.type_id,
      title: data.title,
      style_id: data.style_id,
      description: data.description,
      images: data.images,
      status: data.status,
      display_text: data.display_text,
      unit_price: data.unit_price,
      track_inventory: data.track_inventory,
      track_replenishment: data.track_replenishment,
      replenishment: data.replenishment,
      replenishments: data.replenishments,
      reference: data.reference,
      tags: data.tags,
      sizes: data.sizes.map((o) => ({
        id: o.id
      }))
    });
    setSelectedCategory({ label: data.category, value: data.category_id });
    setSelectedType({
      label: data?.type?.name || '',
      value: data?.type?.id || ''
    });
    setSelectedSizes(
      data.sizes.map((o) => ({
        value: o.id,
        label: o.name
      }))
    );
    initializeDefaultColors(data.colors);
  };

  const handleAcceptedFiles = async (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    );

    setSelectedFiles(files[0]);

    const image_form = new FormData();

    image_form.append('image', files[0]);

    const xhr = await uploadImage(image_form);

    if (!!xhr?.data?.url) {
      const url = xhr?.data?.url;

      setForm({ ...form, images: url });
    } else {
      toast.error('Error uploading image.');
    }
  };

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const loadCategoryOptions = _.debounce(async (input_str, callback) => {
    const { data, isSuccess } = await categories({
      keywords: input_str,
      status: 1
    });
    let items = [];

    if (isSuccess) {
      items = (data?.data || []).map((d) => ({ label: d.name, value: d.id }));
    }

    return callback(items);
  }, 500);

  const loadTypeOptions = _.debounce(async (input_str, callback) => {
    const { data, isSuccess } = await types({ keywords: input_str, status: 1 });
    let items = [];

    if (isSuccess) {
      items = (data?.data || []).map((d) => ({ label: d.name, value: d.id }));
    }

    return callback(items);
  }, 500);

  const loadSizeOptions = async (input_str, callback) => {
    const { data, isSuccess } = await sizes({ keywords: input_str, status: 1 });
    let items = [];

    if (isSuccess) {
      items = (data?.data || []).map((d) => ({ label: d.name, value: d.id }));
    }

    return callback(items);
  };

  const handleOnSelectCategory = async (category_option) => {
    let sizes = undefined;
    let category_id = category_option?.value || undefined;
    setSelectedCategory(category_option);

    if (!!c_data && !!c_data?.data.length > 0) {
      const category = c_data?.data?.filter(
        (d) => d.id === category_option.value
      )[0];
      const init_options = category.sizes
        .filter((s) => !!s.selected)
        .map((d) => ({
          label: d.name,
          value: d.id
        }));
      sizes = init_options.map((io) => ({ id: io.value }));

      setSelectedSizes(init_options);
    }

    setForm({ ...form, sizes, category_id });
  };

  const handleSubmit = async (values) => {
    let colors = '';

    if (selected_colors.length > 0) {
      colors = selected_colors
        .map((color, i) => document.getElementById(`color_${i}`).value)
        .join(',');
    }

    let product_skus = [];
    let replenishments = replenish;
    if (!!sku_sync_data?.data && sku_sync_data?.data.length) {
      product_skus = [...(sku_sync_data?.data || [])];
    }

    if (!!params.id) {
      await update({
        ...values,
        colors,
        id: params.id,
        product_skus,
        replenishments
      });
    } else {
      const xhr = await create({
        ...values,
        colors,
        product_skus,
        replenishments
      });

      if (xhr?.error) {
        const errors = xhr.error.data.error;

        if (errors) {
          validation.setErrors(errors);
        }
      }
    }
  };

  const handleAddColor = () => {
    if (selected_colors.at.length > 3) return;

    const new_colors = [...selected_colors, ''];
    setSelectedColors(new_colors);
  };

  const handleRemoveColor = (i) => {
    const new_colors = [...selected_colors];
    new_colors.splice(i, 1);
    setSelectedColors(new_colors);
  };

  const handleColorOnChange = (e, i) => {
    const value = e.target.value;
    const new_colors = [...selected_colors];
    new_colors[i] = value;

    setSelectedColors(new_colors);
  };

  const handleSKUSynckOnClick = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    fetchSkuList(form.reference, 1);
  };

  const fetchSkuList = async (reference, is_sync = 0) => {
    if (!reference) return;

    try {
      const xhr = await skuList({ shopify_id: reference, is_sync });
    } catch (e) {}
  };

  document.title = `${!!params.id ? 'Edit' : 'Create'} Product | UN IMS`;

  return (
    <div className="page-content" id="AddProduct">
      <FPLoader open={create_loading || update_loading} />
      <Container fluid>
        <BreadCrumb
          title={`Add Product${!!params.id ? ' - Update' : ''}`}
          pageTitle="Product"
        >
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-success w-sm mx-2"
              disabled={update_loading || create_loading}
              onClick={(e) => {
                e.preventDefault();

                validation.handleSubmit();
              }}
            >
              {!!params.id ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-info w-sm"
              onClick={(e) => {
                e.preventDefault();

                navigate('/app/products');
              }}
            >
              Cancel
            </button>
          </div>
        </BreadCrumb>
        <Row>
          <Col lg={8}>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                validation.handleSubmit();
              }}
            >
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Product Details</h5>
                </CardHeader>
                <CardBody>
                  <div className="row mb-3">
                    <div className="col-4">
                      <BInput
                        label="Name"
                        placeholder="Name"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        invalid={
                          !!(
                            validation.touched.title && validation.errors.title
                          )
                        }
                        error={
                          validation.touched.title
                            ? validation.errors.title
                            : ''
                        }
                      />
                    </div>
                    <div className="col-4">
                      <BInput
                        label="Style ID"
                        placeholder="Style ID"
                        value={form.style_id}
                        onChange={(e) =>
                          setForm({ ...form, style_id: e.target.value })
                        }
                        invalid={
                          !!(
                            validation.touched.style_id &&
                            validation.errors.style_id
                          )
                        }
                        error={
                          validation.touched.style_id
                            ? validation.errors.style_id
                            : ''
                        }
                      />
                    </div>
                    <div className="col-4">
                      <BInput
                        label="Display Text"
                        placeholder="Display Text"
                        value={form.display_text}
                        onChange={(e) =>
                          setForm({ ...form, display_text: e.target.value })
                        }
                        invalid={
                          !!(
                            validation.touched.display_text &&
                            validation.errors.display_text
                          )
                        }
                        error={
                          validation.touched.display_text
                            ? validation.errors.display_text
                            : ''
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <BInput
                        type="textarea"
                        label="Description"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        invalid={
                          !!(
                            validation.touched.description &&
                            validation.errors.description
                          )
                        }
                        error={
                          validation.touched.description
                            ? validation.errors.description
                            : ''
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <Label className="form-label">Category</Label>
                      <SelectAsync
                        value={selected_category}
                        onChange={handleOnSelectCategory}
                        loadOptions={loadCategoryOptions}
                        placeholder="Select Category"
                        backspaceRemovesValue
                        isClearable
                      />
                      <FormText color="danger">
                        {validation.errors.category_id || ''}
                      </FormText>
                    </div>
                    <div className="col-4">
                      <Label className="form-label">Type</Label>
                      <SelectAsync
                        value={selected_type}
                        onChange={(option) => {
                          setSelectedType(option);
                          setForm({
                            ...form,
                            type_id: option?.value || undefined
                          });
                        }}
                        loadOptions={loadTypeOptions}
                        placeholder="Select Type"
                        backspaceRemovesValue
                        isClearable
                      />
                      <FormText color="danger">
                        {validation.errors.type_id || ''}
                      </FormText>
                    </div>
                    <div className="col-4">
                      <BInput
                        label="Unit Price"
                        placeholder="Unit Price"
                        type="number"
                        disabled={!!params.id}
                        value={form.unit_price}
                        onChange={(e) =>
                          setForm({ ...form, unit_price: e.target.value })
                        }
                        invalid={
                          !!(
                            validation.touched.unit_price &&
                            validation.errors.unit_price
                          )
                        }
                        error={
                          validation.touched.unit_price
                            ? validation.errors.unit_price
                            : ''
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-8">
                      <div className="col-12 mb-3">
                        <Label className="form-label">Size</Label>
                        <SelectAsync
                          value={selected_sizes}
                          onChange={(option) => {
                            setSelectedSizes(option);

                            if (!!option && !!option.length) {
                              const sizes = option.map((o) => ({
                                id: o.value
                              }));
                              setForm({ ...form, sizes });
                            } else {
                              setForm({ ...form, sizes: undefined });
                            }
                          }}
                          loadOptions={loadSizeOptions}
                          placeholder="Select Sizes"
                          backspaceRemovesValue
                          isClearable
                          isMulti
                        />
                        <FormText color="danger">
                          {validation.errors.sizes || ''}
                        </FormText>
                      </div>
                      <div className="col-12">
                        <BInput
                          label="Tags"
                          placeholder="Tags"
                          value={form.tags}
                          onChange={(e) =>
                            setForm({ ...form, tags: e.target.value })
                          }
                          invalid={
                            !!(
                              validation.touched.tags && validation.errors.tags
                            )
                          }
                          error={
                            validation.touched.tags
                              ? validation.errors.tags
                              : ''
                          }
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="col-12 mb-3">
                        <BInput
                          label="Replenishment"
                          placeholder="Replenishment"
                          type="number"
                          value={form.replenishment}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              replenishment: e.target.value
                            })
                          }
                          invalid={
                            !!(
                              validation.touched.replenishment &&
                              validation.errors.replenishment
                            )
                          }
                          error={
                            validation.touched.replenishment
                              ? validation.errors.replenishment
                              : ''
                          }
                        />
                      </div>
                      <div className="col-12">
                        <BInput
                          label="Reference"
                          placeholder="Reference"
                          value={form.reference}
                          onChange={(e) =>
                            setForm({ ...form, reference: e.target.value })
                          }
                          invalid={
                            !!(
                              validation.touched.reference &&
                              validation.errors.reference
                            )
                          }
                          error={
                            validation.touched.reference
                              ? validation.errors.reference
                              : ''
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center ">
                    <h5 className="card-title mb-0">SKU</h5>
                    <Button
                      color="success"
                      className="btn btn-icon"
                      onClick={handleSKUSynckOnClick}
                      disabled={sku_sync_loading || !form.reference}
                    >
                      <i
                        className={`ri-refresh-line ${
                          sku_sync_loading ? 'animate rotate' : ''
                        }`}
                      ></i>
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <table className="table align-middle table-nowrap  ">
                      <thead className="table-light bg-light sticky-top mt-60">
                        <tr>
                          <th>Generic SKU</th>
                          <th>Condition</th>
                          <th>Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(sku_sync_data?.data || [])?.map((ssd, i) => (
                          <tr key={i}>
                            <td>{ssd.generic_sku}</td>
                            <td>
                              {getConditionNameByReference(
                                ssd.main_condition,
                                conditions_data?.data || []
                              )}
                            </td>
                            <td>{ssd.size}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center ">
                    <h5 className="card-title mb-0">
                      Replenishment per Location
                    </h5>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <table className="table align-middle table-nowrap  ">
                      <thead className="table-light bg-light sticky-top mt-60">
                        <tr>
                          <th>Location</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(locations_data?.data || [])?.map((ssd, i) => (
                          <tr key={i}>
                            <td>{ssd.name}</td>
                            <td>
                              <div className="col-2">
                                <BInput
                                  defaultValue={
                                    form.replenishments?.length > 0
                                      ? form?.replenishments
                                          .filter(
                                            (r) => r.location_id == ssd.id
                                          )
                                          .map((r) => r.quantity)
                                      : ''
                                  }
                                  onChange={(e) =>
                                    handleChangeReplenishment(e, ssd.id)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </form>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Image</h5>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-12">
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className={`dropzone dz-clickable img-upload-wrapper ${
                            !!form.images ? 'with-img' : ''
                          }`}
                        >
                          {!!form.images && <img src={form.images} />}
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>Drop files here or click to upload.</h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Tracking</h5>
              </CardHeader>

              <CardBody>
                <div>
                  <div className="row">
                    <div className="col-12 d-flex flex-row justify-content-between align-items-center mb-1">
                      <span className="px-2">Status</span>
                      <Switch
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.checked ? 1 : 0 })
                        }
                        checked={!!form.status}
                      />
                    </div>
                    <div className="col-12 d-flex flex-row justify-content-between align-items-center mb-1">
                      <span className="px-2">Track Inventory</span>
                      <Switch
                        onChange={(e) =>
                          setForm({
                            ...form,
                            track_inventory: e.target.checked ? 1 : 0
                          })
                        }
                        checked={!!form.track_inventory}
                      />
                    </div>
                    <div className="col-12 d-flex flex-row justify-content-between align-items-center mb-1">
                      <span className="px-2">Track Replenishment</span>
                      <Switch
                        onChange={(e) =>
                          setForm({
                            ...form,
                            track_replenishment: e.target.checked ? 1 : 0
                          })
                        }
                        checked={!!form.track_replenishment}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center ">
                  <h5 className="card-title mb-0">Colors</h5>
                  <Button
                    disabled={selected_colors.length >= 3}
                    onClick={handleAddColor}
                  >
                    + Add Color
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="row">
                  {selected_colors.map((color, i) => {
                    return (
                      <div
                        key={color + i}
                        className="col-4 d-flex justify-content-center  align-items-center "
                      >
                        <BInput
                          type="color"
                          className="p-0"
                          id={`color_${i}`}
                        />
                        <i
                          className=" ri-close-line fs-3"
                          onClick={() => handleRemoveColor(i)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddProduct;
