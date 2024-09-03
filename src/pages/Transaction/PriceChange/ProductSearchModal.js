import PropTypes from 'prop-types';

import React, { useEffect, useState, useRef } from 'react';
import Switch from '../../../Components/Common/Switch';
import SimpleBar from 'simplebar-react';
import { CSSTransition } from 'react-transition-group';
import './TableAnimation.css';

import {
  Modal,
  Card,
  CardBody,
  ModalBody,
  ModalHeader,
  Button,
  Collapse,
  Col,
  Input,
  Form,
  Label,
  FormFeedback,
  Row,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const ProductSearchModal = ({
  show,
  alert,
  keywords,
  data,
  variants,
  status,
  handleChangeValue,
  isVisible,
  viewItem,
  populateItems,
  handleToggleVisibility,
  onCloseClick,
  onClickSearch
}) => {
  const [variantresults, setVariantResults] = useState({ variants: [] });

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      onClickSearch();
    }
  };
  const handleBack = (e) => {
    handleToggleVisibility(e);
    setVariantResults({
      variants: [],
      original_variants: [],
      title: '',
      images: '',
      category: '',
      product_type: ''
    });
  };
  const generateVariants = async (e, prod) => {
    let prod_variants = prod.variants.length > 0 ? prod.variants : [];
    const updatedVariants = prod_variants.map((pr) => ({
      ...pr,
      selected: false
    }));

    setVariantResults({
      variants: getUniqueArray(updatedVariants),
      original_variants: updatedVariants,
      title: prod.title,
      images: prod.images,
      category: prod.category,
      product_type: prod.type_name
    });

    await handleToggleVisibility(e);
  };
  const highlightRow = (rowData) => {
    const updatedVariants = variantresults.variants.map((pr) =>
      pr.generic_sku === rowData.generic_sku ? { ...pr, selected: true } : pr
    );

    setVariantResults({ ...variantresults, variants: updatedVariants });
  };
  const handleRowDoubleClick = (rowData) => {
    highlightRow(rowData);
    addToList(rowData);
  };

  const addToList = (items) => {
    highlightRow(items);
    toast.success('Item added to Stock Adjustment List', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });

    populateItems(
      items,
      variantresults.title,
      variantresults.original_variants
    );
  };
  const closeModal = () => {
    if (variantresults.title === '') {
      onCloseClick();
    }

    setVariantResults({
      variants: [],
      title: '',
      images: '',
      category: '',
      product_type: ''
    });
  };
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'Escape') {
        if (isVisible === false) {
          handleToggleVisibility(event);
        }
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [isVisible, handleToggleVisibility]);
  const getUniqueArray = (array) => {
    const uniqueMap = new Map();

    for (const item of array) {
      const key = `${item.generic_sku}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    return Array.from(uniqueMap.values());
  };
  return (
    <Modal isOpen={show} centered={true} size="xl" toggle={closeModal}>
      <div className=" g-1  p-2 flex row">
        <h5 className="modal-title">
          <div className="modal-title bg-light p-2 flex justify space-between row g-1 modal-header">
            <Col xxl={7}>
              <Input
                type="text"
                className="form-control"
                placeholder="Search By Product Title,Category or Brand"
                name="name"
                id="sizename"
                onKeyDown={handleKeyDown}
                onChange={(e) => handleChangeValue(e.target.value)}
                value={keywords || ''}
              />
            </Col>
            <Col xxl={3}>
              <button
                type="button"
                className="btn btn-success w-sm  ms-1"
                name="search"
                onClick={onClickSearch}
              >
                <i className=" ri-search-2-line align-bottom me-1"></i>
                Search
              </button>{' '}
              {/*           
              <button type="button" className="btn btn-info w-sm  me-2 ms-2">
                <i className=" ri-checkbox-circle-line align-bottom me-1"></i>
                Select
              </button>{' '} */}
            </Col>
            <button
              type="button"
              className="btn-close warning"
              onClick={onCloseClick}
              aria-label="Close"
            ></button>
          </div>
        </h5>
      </div>

      <div style={{ padding: '0.8rem' }}>
        <SimpleBar
          data-simplebar="auto-hide"
          style={{ maxHeight: '450px', minHeight: '450px' }}
        >
          <CSSTransition
            in={!isVisible}
            timeout={300}
            classNames="table-animation"
            unmountOnExit
          >
            <div>
              <div className="d-flex align-items-start text-muted mb-2">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-md bg-light rounded p-1 d-flex justify-content-center align-content-center">
                    {variantresults.images ? (
                      <img
                        src={variantresults.images}
                        alt={variantresults.title}
                        className="img-fluid d-block product-img"
                      />
                    ) : (
                      <i className="ri-image-line mt-2"></i>
                    )}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <button
                    type="button"
                    className="btn btn-secondary w-sm  ms-1 d-flex float-end"
                    name="search"
                    onClick={(e) => handleBack(e)}
                  >
                    <i className=" ri-arrow-left-s-line align-middle fs-14"></i>
                    Back
                  </button>
                  <h4 className="fs-14">
                    {variantresults.title !== undefined && variantresults.title}
                  </h4>
                  Brand:<b>{variantresults.product_type}</b>
                  <br />
                  Category:<b>{variantresults.category}</b>
                </div>
              </div>

              <table
                className="table  align-middle table-nowrap table-striped-columns  mt-1"
                id="sub-table"
              >
                <thead className="table-light bg-light  sticky-top  mt-10">
                  <tr>
                    <th scope="col" style={{ width: '40%' }} className="col-1">
                      Generic SKU
                    </th>
                    <th scope="col" style={{ width: '20%' }}>
                      Condition
                    </th>
                    <th scope="col" style={{ width: '10%' }}>
                      Size
                    </th>
                    <th scope="col" style={{ width: '5%' }}></th>
                  </tr>
                </thead>

                <tbody>
                  {variantresults?.variants.map((item) => (
                    <tr
                      className={item.selected ? 'table-success' : ''}
                      key={item.generic_sku}
                      onDoubleClick={() => handleRowDoubleClick(item)}
                    >
                      <td>{item.generic_sku}</td>
                      <td>{item.condition?.name}</td>
                      <td>{item.size}</td>
                      <td>
                        {' '}
                        <div className="align-right">
                          <Link
                            className="link-primary"
                            name="clickme"
                            onClick={(e) => addToList(item)}
                          >
                            <i className="ri-add-circle-fill align-middle fs-22"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CSSTransition>
          <CSSTransition
            in={isVisible}
            timeout={300}
            classNames="table-animation"
            unmountOnExit
          >
            <table className="table table-hover align-middle table-nowrap table-striped-columns  mt-1">
              <thead className="table-light bg-light  sticky-top  mt-10">
                <tr>
                  <th scope="col" style={{ width: '40%' }} className="col-1">
                    Title
                  </th>
                  <th scope="col" style={{ width: '20%' }}>
                    Product Type
                  </th>
                  <th scope="col" style={{ width: '20%' }}>
                    Category
                  </th>
                  <th scope="col" style={{ width: '5%' }}></th>
                </tr>
              </thead>

              <tbody>
                {data.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar-md bg-light rounded p-1 d-flex justify-content-center align-content-center">
                            {product.images ? (
                              <img
                                src={product.images}
                                alt={product.title}
                                className="img-fluid d-block product-img"
                              />
                            ) : (
                              <i className="ri-image-line mt-2"></i>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="fs-14 mb-1">
                            <Link className="text-dark">{product.title}</Link>
                          </h5>
                        </div>
                      </div>
                    </td>
                    <td>{product.type_name}</td>
                    <td>{product.category}</td>
                    <td>
                      {' '}
                      <div className="align-right">
                        <Link
                          className="link-primary"
                          onClick={(e) => generateVariants(e, product)}
                        >
                          <i className=" ri-arrow-right-s-line align-middle fs-24"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CSSTransition>
        </SimpleBar>
      </div>
    </Modal>
  );
};

ProductSearchModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default ProductSearchModal;
