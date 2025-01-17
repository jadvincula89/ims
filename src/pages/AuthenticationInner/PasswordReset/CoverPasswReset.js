import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Container, Row } from 'reactstrap';

import AuthSlider from '../authCarousel';

const CoverPasswReset = () => {
  document.title = 'Reset Password | UN Inventory Management System';
  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <Card className="overflow-hidden">
                  <Row className="justify-content-center g-0">
                    <AuthSlider />

                    <Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <h5 className="text-primary">Forgot Password?</h5>
                        <p className="text-muted">Reset password with velzon</p>

                        <div className="mt-2 text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/rhvddzym.json"
                            trigger="loop"
                            colors="primary:#0ab39c"
                            className="avatar-xl"
                            style={{ width: '120px', height: '120px' }}
                          ></lord-icon>
                        </div>

                        <div
                          className="alert alert-borderless alert-warning text-center mb-2 mx-2"
                          role="alert"
                        >
                          Enter your email and instructions will be sent to you!
                        </div>
                        <div className="p-2">
                          <form>
                            <div className="mb-4">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email address"
                              />
                            </div>

                            <div className="text-center mt-4">
                              <Button
                                color="success"
                                className="w-100"
                                type="submit"
                              >
                                Send Reset Link
                              </Button>
                            </div>
                          </form>
                        </div>

                        <div className="mt-5 text-center">
                          <p className="mb-0">
                            Wait, I remember my password...{' '}
                            <Link
                              to="/auth-signin-cover"
                              className="fw-semibold text-primary text-decoration-underline"
                            >
                              {' '}
                              Click here{' '}
                            </Link>{' '}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <footer className="footer">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Velzon. Crafted with{' '}
                    <i className="mdi mdi-heart text-danger"></i> by Themesbrand
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default CoverPasswReset;
