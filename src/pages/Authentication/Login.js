import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert
} from 'reactstrap';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';

//redux
import { useSelector, useDispatch } from 'react-redux';

import { Link, redirect, useNavigate } from 'react-router-dom';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

//Social Media Imports
import { GoogleLogin } from 'react-google-login';
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// actions
// import { loginUser, socialLogin, resetLoginFlag } from "../../store/actions";

import logoLight from '../../assets/images/un-badge.png';
//Import config
import { facebook, google } from '../../config';
import { useLoginMutation } from '../../services/auth';
//import images

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show_password, toggleShowPassword] = useState(false);
  const [userLogin, setUserLogin] = useState([]);
  const [error, setError] = useState('');
  const [login, { loading: login_loading }] = useLoginMutation();
  const auth = useSelector((store) => store.auth);
  const token = auth.access_token || undefined;

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email.')
        .required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password')
    }),
    onSubmit: (values) => {
      submitLogin(values);
    }
  });

  const submitLogin = async (params) => {
    const xhr = await login(params);

    if (xhr?.error?.status >= 400) {
      if (xhr.error.status === 403) {
        setError('Incorrect password.');
      } else {
        setError(xhr.error.data.message);
      }
    }
  };

  document.title = 'UN IMS';

  useEffect(() => {
    if (!!token) {
      navigate('/app', { replace: true }); // redirect to profile temporarily since no landing page is created yet.
    }
  }, [navigate, token]);

  return (
    <React.Fragment>
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
                  <p className="mt-3 fs-15 fw-medium">
                    Lorem Ipsum is simply dummy text
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">
                        Sign in to continue to UN IMS.
                      </p>
                    </div>
                    {error && error ? (
                      <Alert color="danger"> {error} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ''}
                              type={show_password ? 'text' : 'password'}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              style={{ boxShadow: 'none' }}
                              onClick={() => toggleShowPassword(!show_password)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Remember me
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Sign In
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account ?{' '}
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {' '}
                      Signup{' '}
                    </Link>{' '}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;
