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
  Label
} from 'reactstrap';

import Select from 'react-select';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useProductTypeQuery,
  useVendorCreateMutation,
  useVendorQuery,
  useVendorUpdateMutation
} from '../../../services/category';
import MsgToast from '../../../Components/Common/MsgToast';

const VENDOR_STATUS = [
  {
    options: [
      { label: 'Enabled', value: 1 },
      { label: 'Disabled', value: 0 }
    ]
  }
];

const AddType = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, isSuccess } = useVendorQuery(
    { id: params.id },
    { skip: !params.id }
  );
  const [vendorUpdate, { update_data, isLoading, isSuccess: update_success }] =
    useVendorUpdateMutation();
  const [vendorCreate, { create_data, isSuccess: create_success }] =
    useVendorCreateMutation();
  const [form, setForm] = useState({
    id: params.id,
    name: ''
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!!isSuccess) {
      const status_find = VENDOR_STATUS[0].options.find(
        (x) => x.value === data.visible
      );
      setStatus(status_find);
      setForm({
        id: data.id,
        name: data.name
      });
    }
  }, [isSuccess, data]);

  useState(() => {
    if (update_success || create_success) {
      const id = update_data.id || create_data.id;

      navigate(`/app/categories/vendors/${id}`);
    }
  }, [update_success, create_success]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!params.id) {
      submitCreate();
    } else {
      submitUpdate();
    }
  };

  const submitUpdate = async () => {
    const xhr = await vendorUpdate({
      ...form,
      visible: status.value || 0,
      parent_id: 0
    });
  };

  const submitCreate = async () => {
    const xhr = await vendorCreate({
      ...form,
      visible: status.value || 0,
      parent_id: 0
    });
  };

  document.title = `Categories | ${params.id ? 'Update' : 'New'} Vendor`;

  return (
    <div className="page-content">
      {update_success || create_success ? (
        <MsgToast
          msg={`${params.id ? 'Update' : 'Created'} Successfully`}
          color="success"
          icon="ri-checkbox-circle-line"
        />
      ) : null}
      <Container fluid>
        <BreadCrumb
          title={`${params.id ? 'Update' : 'New'} Product Vendor`}
          pageTitle="Categories"
        />
        <Row>
          <Col lg={12}>
            <form onSubmit={onSubmit}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      ID
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="product-title-input"
                      placeholder="Enter ID"
                      value={form.id || ''}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="product-title-input"
                      placeholder="Enter name"
                      value={form.name || ''}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-publish-status-input"
                      className="form-label"
                    >
                      Status
                    </Label>

                    <Select
                      value={status}
                      onChange={setStatus}
                      options={VENDOR_STATUS}
                      name="choices-publish-status-input"
                      classNamePrefix="select2-selection form-select"
                    />
                  </div>
                </CardBody>
              </Card>
              <div className="text-end mb-3">
                <button
                  className="btn w-sm me-3"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-success w-sm">
                  Submit
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddType;
