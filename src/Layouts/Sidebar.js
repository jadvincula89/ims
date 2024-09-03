import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
//import logo
import logoSm from '../assets/images/un-badge.png';
import logoDark from '../assets/images/un-badge.png';
import logoLight from '../assets/images/un-badge.png';

//Import Components
import VerticalLayout from './VerticalLayouts';
import { Container } from 'reactstrap';
import { layoutTypes } from '../Components/constants/layout';
import Footer from './Footer';

const Sidebar = ({ layoutType }) => {
  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName('vertical-overlay');
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener('click', function () {
        document.body.classList.remove('vertical-sidebar-enable');
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (
      document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover'
    ) {
      document.documentElement.setAttribute(
        'data-sidebar-size',
        'sm-hover-active'
      );
    } else if (
      document.documentElement.getAttribute('data-sidebar-size') ===
      'sm-hover-active'
    ) {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };
  return (
    <React.Fragment>
      <div className="app-menu navbar-menu d-flex flex-column  p-0">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="24" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height="17" />
            </span>
          </Link>
        </div>
        <SimpleBar id="scrollbar" className="">
          <Container fluid>
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              <VerticalLayout layoutType={layoutType} />
            </ul>
          </Container>
        </SimpleBar>
        <div className="sidebar-background"></div>
        <div className="d-flex flex-grow-1 flex-column justify-content-end align-items-center ">
          <Footer />
        </div>
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
