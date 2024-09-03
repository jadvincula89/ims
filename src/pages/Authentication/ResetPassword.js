import React, { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { Alert, Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import logoLight from '../../assets/images/un-badge.png';
import { useResetPasswordMutation } from '../../services/auth';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [search_params, setSearchParams] = useSearchParams();
  const token = search_params.get('token');
  const navigate = useNavigate();
  const [error_message, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [show_password, toggleShowPassword] = useState(false);
  const [show_confirm_password, toggleShowConfirmPassword] = useState(false);
  const [is_invalid, setIsInvalid] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  if (!(token || '').trim()) {
    navigate('not-found');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm_password) {
      setErrorMessage('Please fill out all fields');
      return;
    }

    if (password !== confirm_password) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const xhr = await resetPassword({
        token,
        password
      });

      if (xhr?.error?.status >= 400) {
        throw xhr;
      }

      toast.success(xhr?.data?.message || 'Success!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (e) {
      const message =
        e?.error?.data?.message || 'An error occurred. Please try again.';
      toast.error(message);
      console.error(e);
    }
  };

  document.title = 'Create New Password | UN Inventory Management System';
  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="100" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">Reset your password here</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Create new password</h5>
                    {/* <p className="text-muted">
                      Your new password must be different from previous used
                      password.
                    </p> */}
                  </div>

                  {error_message && (
                    <Alert color="danger" style={{ marginTop: '13px' }}>
                      {error_message}
                    </Alert>
                  )}

                  <div className="p-2">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="password-input">
                          Password
                        </label>
                        <div className="position-relative auth-pass-inputgroup">
                          <input
                            type={!show_password ? 'password' : 'text'}
                            className="form-control pe-5 password-input"
                            placeholder="Enter password"
                            id="password-input"
                            aria-describedby="passwordInput"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            required
                            value={password}
                            onChange={(e) => {
                              setIsInvalid(false);
                              setErrorMessage('');
                              setPassword(e.target.value);
                            }}
                            onInvalid={(e) => {
                              e.preventDefault();
                              console.log('invalid ', { ...e });
                              setIsInvalid(true);
                            }}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            style={{ boxShadow: 'none' }}
                            onClick={() => toggleShowPassword(!show_password)}
                            tabIndex={-1}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                        <div
                          id="passwordInput"
                          className={`form-text ${
                            is_invalid ? 'text-danger' : ''
                          }`}
                        >
                          Must be at least 8 characters with an uppercase,
                          lowercase and number.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="confirm-password-input"
                        >
                          Confirm Password
                        </label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <input
                            type={!show_confirm_password ? 'password' : 'text'}
                            className="form-control pe-5 password-input"
                            placeholder="Confirm password"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            id="confirm-password-input"
                            required
                            value={confirm_password}
                            onChange={(e) => {
                              setIsInvalid(false);
                              setErrorMessage('');
                              setConfirmPassword(e.target.value);
                            }}
                            onInvalid={(e) => {
                              e.preventDefault();
                              console.log('invalid ', { ...e });
                              setIsInvalid(true);
                            }}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            style={{ boxShadow: 'none' }}
                            onClick={() =>
                              toggleShowConfirmPassword(!show_confirm_password)
                            }
                            tabIndex={-1}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>

                      <div
                        id="password-contain"
                        className="p-3 bg-light mb-2 rounded"
                      >
                        <h5 className="fs-13">Password must contain:</h5>
                        <p id="pass-length" className="invalid fs-12 mb-2">
                          Minimum <b>8 characters</b>
                        </p>
                        <p id="pass-lower" className="invalid fs-12 mb-2">
                          At <b>lowercase</b> letter (a-z)
                        </p>
                        <p id="pass-upper" className="invalid fs-12 mb-2">
                          At least <b>uppercase</b> letter (A-Z)
                        </p>
                        <p id="pass-number" className="invalid fs-12 mb-0">
                          A least <b>number</b> (0-9)
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button
                          color="success"
                          className="w-100"
                          type="submit"
                          disabled={isLoading}
                        >
                          Reset Password
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Wait, I remember my password...{' '}
                  <Link
                    to="/"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {' '}
                    Click here{' '}
                  </Link>{' '}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default ResetPassword;
