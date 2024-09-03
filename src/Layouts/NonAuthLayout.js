import React, { useEffect } from 'react';

//redux
import { useSelector } from 'react-redux';

const NonAuthLayout = ({ children }) => {
  const layoutModeType = 'light';

  useEffect(() => {
    if (layoutModeType === 'dark') {
      document.body.setAttribute('data-layout-mode', 'dark');
    } else {
      document.body.setAttribute('data-layout-mode', 'light');
    }
  }, [layoutModeType]);
  return <div>{children}</div>;
};

export default NonAuthLayout;
