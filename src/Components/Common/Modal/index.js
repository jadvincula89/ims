import PropTypes from 'prop-types';
import React from 'react';

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const BModal = ({
  show,
  size = 'md',
  title,
  title_component,
  onCloseClick,
  children,
  centered = true,
  classes,
  footer,
  ...props
}) => {
  return (
    <Modal
      isOpen={show}
      size={size}
      toggle={onCloseClick}
      centered={centered}
      {...props}
      className={classes?.container}
      contentClassName={classes?.modal_content}
    >
      <ModalHeader className="bg-light p-3" toggle={onCloseClick}>
        {title_component || title}
      </ModalHeader>
      <ModalBody className={classes?.body}>{children}</ModalBody>
      {!!footer && (
        <ModalFooter className={classes.footer}>{footer}</ModalFooter>
      )}
    </Modal>
  );
};

BModal.propTypes = {
  onCloseClick: PropTypes.func,
  title: PropTypes.string,
  show: PropTypes.any
};

export default BModal;
