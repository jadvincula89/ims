import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Redirect, useNavigate } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setToken, logout } from '../../store/slice/auth';

const Logout = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { access_token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!!access_token) {
      dispatch(logout());
    } else navigate('/login');
  }, [dispatch, access_token, navigate]);

  return <></>;
};

export default Logout;
