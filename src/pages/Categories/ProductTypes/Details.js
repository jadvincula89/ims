import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Tooltip } from 'reactstrap';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { Link, useParams } from 'react-router-dom';
import { useProductTypeQuery } from '../../../services/category';

function Details(props) {
  const params = useParams();
  const { data: xhr_data, isSuccess } = useProductTypeQuery({ id: params.id });
  const [data, setData] = useState(undefined);
  const [ttop, setttop] = useState(false);

  useEffect(() => {
    if (!!isSuccess) {
      setData(xhr_data[0]);
    }
  }, [isSuccess, xhr_data]);

  document.title = 'Product Category | Details';
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Category Details" pageTitle="Category Details" />
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
                              {data?.id || ''}
                            </span>
                          </div>
                        </div>
                        <div className="">
                          <div className="text-muted">
                            Name :{' '}
                            <span className="text-body fw-medium">
                              {data?.label || ''}
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
                            to={`/app/categories/${params.id}/edit`}
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
