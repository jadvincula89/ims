import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//import Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { layoutModeTypes, layoutTypes } from '../Components/constants/layout';
import { Outlet } from 'react-router-dom';

import './index.scss';
import SettingsModal from './SettingsModal';
import { useGetconfigQuery } from '../services/auth';

const Layout = (props) => {
  const { data: config_data } = useGetconfigQuery();
  const [headerClass, setHeaderClass] = useState('');
  const layoutType = layoutTypes.VERTICAL;

  useEffect(() => {
    document.documentElement.setAttribute('data-layout', 'vertical');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-sidebar', 'dark');
  }, []);

  // class add remove in header
  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation, true);
  });

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass('topbar-shadow');
    } else {
      setHeaderClass('');
    }
  }

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header
          headerClass={headerClass}
          layoutModeType={layoutModeTypes.DARKMODE}
          onChangeLayoutMode={() => {}}
        />
        <Sidebar layoutType={layoutType} />
        <div className="main-content">
          <Outlet />
        </div>
        <SettingsModal />
      </div>
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.object
};

export default Layout;
