import React, { useEffect } from 'react';
import { Redirect, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthProtected = (props) => {
  const navigate = useNavigate();

  const { access_token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!access_token) {
      navigate('/login');
    }
  }, [access_token, navigate]);

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {' '}
            <Component {...props} />{' '}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
