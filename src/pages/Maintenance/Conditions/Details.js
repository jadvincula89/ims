import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Tooltip } from 'reactstrap';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVendorQuery } from '../../../services/category';

function Details(props) {
  const [ttop, setttop] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { data: xhr_data, isSuccess } = useVendorQuery(
    { id: params.id },
    { skip: !params.id }
  );
  const [data, setData] = useState({
    id: params.id,
    name: '',
    status: ''
  });

  useEffect(() => {
    if (!!isSuccess) {
      setData({
        id: xhr_data[0].id,
        name: xhr_data[0].name,
        status: xhr_data[0].visible === 1 ? 'Enabled' : 'Disabled'
      });
    }
  }, [isSuccess, xhr_data]);

  document.title = 'Vendor | Details';
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Vendor Details" pageTitle="Vendor Details" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col lg={12}>
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <div className="mb-3">
                          <div className="text-muted">
                            ID :{' '}
                            <span className="text-body fw-medium">
                              {data.id}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-muted">
                            Name :{' '}
                            <span className="text-body fw-medium">
                              {data.name}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-muted">
                            Status :{' '}
                            <span className="text-body fw-medium">
                              {data.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div>
                          <Tooltip
                            placement="top"
                            isOpen={ttop}
                            target="TooltipTop"
                            toggle={() => {
                              setttop(!ttop);
                            }}
                          >
                            Edit
                          </Tooltip>
                          <Link
                            to={`/app/categories/vendors/${params.id}/edit`}
                            id="TooltipTop"
                            className="btn btn-light"
                          >
                            <i className="ri-pencil-fill align-bottom"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Details;
