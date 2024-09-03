import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
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

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProductTypeQuery } from '../../../../services/category';

const Add = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, isSuccess } = useProductTypeQuery({ id: params.id });
  const [form, setForm] = useState({
    id: params.id,
    name: ''
  });

  useEffect(() => {
    if (!!isSuccess) {
      setForm({
        id: data[0].id,
        name: data[0].label
      });
    }
    /* eslint-disable */
  }, [isSuccess]);

  document.title = `Add New Category | ${
    params.id ? 'Update' : 'New'
  } Category`;

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={`${params.id ? 'Update' : 'New'} Product Category`}
          pageTitle="Categories"
        />
        <Row>
          <Col lg={12}>
            <form>
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

export default Add;
