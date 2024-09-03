import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from 'react';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import SimpleBar from 'simplebar-react';
import Cleave from 'cleave.js/react';

import ProductSearchModal from '../StockAdjustment/ProductSearchModal';
import {
  Card,
  Badge,
  CardBody,
  Col,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormText,
  Button,
  Tooltip,
  Progress
} from 'reactstrap';

import * as Yup from 'yup';

import { Link, useNavigate, useParams } from 'react-router-dom';

import Flatpickr from 'react-flatpickr';

import BInput from '../../../Components/Common/BInput';
import { DEFAULT_PER_PAGE } from '../../../common/constants';

import { useLocationListAsOptionsQuery } from '../../../services/location';
import { useLazyListQuery } from '../../../services/product';
import {
  useLazyVariantsQuery,
  useLazyGetsingleQuery,
  usePricechangecreateMutation,
  usePricechangedeleteMutation,
  usePricechangeupdateMutation
} from '../../../services/pricechange';

import { toast } from 'react-toastify';

const AddPriceAdjustment = () => {
  const navigate = useNavigate();

  const { sadjId } = useParams();
  const [tooltipStates, setTooltipStates] = useState(Array(0).fill(false));

  const toggleTooltip = (index) => {
    const newTooltipStates = [...tooltipStates];
    newTooltipStates[index] = !newTooltipStates[index];
    setTooltipStates(newTooltipStates);
  };
  const [form, setForm] = useState({
    id: '',
    transaction_date: new Date(),
    effectivity_date: new Date(),
    transaction_no: '',
    remarks: '',
    status: 0,
    reference: '',
    entry: []
  });
  const [showModal, setShowModal] = useState(false);
  const [locked, setLocked] = useState(false);
  const [stockadjustmentcreate] = usePricechangecreateMutation();
  const [stockadjustmentupdate] = usePricechangeupdateMutation();
  const [isVisible, setIsVisible] = useState(true);
  let timer = '';
  const [barcode, setBarcode] = useState(undefined);
  const [deleteList, setDelete] = useState([]);
  const [typeList, setTypes] = useState([
    { id: 1, label: 'Cost' },
    { id: 2, label: 'Price' }
  ]);
  const [variants, { data: v_data }] = useLazyVariantsQuery();
  const [getsingle] = useLazyGetsingleQuery();
  const [selected_variants, setVariants] = useState(undefined);
  const [inputCount, setInputCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [effectivity_date, setEffectiveDate] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const [status, setStatus] = useState(1);
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const [stop, setStop] = useState(false);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [keywords, setKeywords] = useState('');

  const [list, { data: product_list, isLoading }] = useLazyListQuery({
    ...params,
    keywords,
    page,
    per_page,
    status
  });
  const { data: location_options, isLoading: loading_location } =
    useLocationListAsOptionsQuery({ per_page: 1000 });
  const [filter_status, setFilterStatus] = useState('Draft');
  const inputBarcodeRef = useRef();
  const f_status = useMemo(() => {
    return {
      0: 'Draft',
      1: 'Completed'
    };
  }, []);
  const memoizedFStatus = useMemo(() => f_status, [f_status]);
  const handleChangeStatus = (value) => {
    setForm({ ...form, status: value });
    setFilterStatus(f_status[value]);
  };
  const handleDateChange = (selectedDates, dateStr, instance) => {
    setSelectedDate(dateStr);
  };
  const handleEffectiveDateChange = (selectedDates, dateStr, instance) => {
    setEffectiveDate(dateStr);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      searchBarcode();
    }
  };
  const handleToggleVisibility = (e, prod) => {
    setIsVisible(!isVisible);
  };

  const viewItem = async (e) => {
    await setIsVisible(!isVisible);
  };
  const populateItems2 = async (d) => {
    setBarcode(d.generic_sku);
    loadVariants(d.generic_sku);
  };

  const populateItems = useCallback(
    (data, type, cmb) => {
      const newVariants = (data || []).map((d) => ({
        generic_sku: d.generic_sku,
        product_id: d.shopify_id,
        amount: type === 'new' ? 0 : d.amount,
        display_amount: type === 'new' ? 0 : d.amount,
        available_qty: 0,
        remarks: type === 'new' ? '' : d.remarks,
        title: d.title,
        type: type === 'new' ? 1 : d.type,
        hasError: false,
        isCheck: false,
        id: type === 'new' ? 0 : d.id,
        dropdown: cmb
      }));
      setLoading(false);
      let index = inputCount + 1;
      setInputCount(index);

      setVariants((prevVariants) => {
        if (Array.isArray(prevVariants)) {
          return [...prevVariants, ...newVariants];
        } else {
          return [...newVariants];
        }
      });
    },
    [inputCount]
  );
  const getPriceAdj = useCallback(
    async (id) => {
      const { data, isSuccess } = await getsingle({ id: id });
      if (isSuccess) {
        populateItems(data.items, 'old', data.dropdown);
        if (data.status === 1) {
          setLocked(true);
        } else {
          setLocked(false);
        }
        setFilterStatus(f_status[data.status]);
        setForm({
          ...form,
          transaction_no: data.transaction_no,
          id: data.id,
          remarks: data.remarks,
          reference: data.reference,
          transaction_date: data.transaction_date,
          effectivity_date: data.effectivity_date,
          status: data.status
        });
      }
    },
    [
      populateItems,
      getsingle,
      setLocked,
      setFilterStatus,
      setForm,
      form,
      f_status
    ]
  );

  useEffect(() => {
    if (sadjId !== undefined && stop === false) {
      getPriceAdj(sadjId);
      setStop(true);
    }
    inputBarcodeRef.current.focus();
    return () => {
      // Clean up logic, if needed
    };
  }, [getPriceAdj, sadjId, form, stop]);

  const handleVariantBlur = (i, type, params = []) => {
    const regExp = /^\d{1,3}(,\d{3})*(\.\d+)?$/;

    if (i.target.value.match(regExp)) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setVariants((prevVariants) => {
          const id = i.target.id.split('_');
          const index = id[1];

          if (index !== -1) {
            const updatedVariants = [...prevVariants];

            if (type === 'amount') {
              let temp = i.target.value;
              if (temp.includes('.') === false) {
                temp = temp + '.00';
              }
              updatedVariants[index] = {
                ...updatedVariants[index],
                amount: i.target.value.replaceAll(',', ''),
                display_amount: temp
              };
            }

            return updatedVariants;
          }

          return prevVariants;
        });
      }, 800);
    }
  };
  const handleVariantChanges = (i, type, params = []) => {
    const regExp = '^\\d+(\\.\\d+)?$';
    //  if(i.target.value.match(regExp)){

    setVariants((prevVariants) => {
      const id = i.target.id.split('_');
      const index = id[1];

      if (index !== -1) {
        const updatedVariants = [...prevVariants];

        if (type === 'remarks') {
          updatedVariants[index] = {
            ...updatedVariants[index],
            remarks: i.target.value
          };
        }
        if (type === 'amount') {
          let temp = '';

          temp = i.target.value;

          updatedVariants[index] = {
            ...updatedVariants[index],
            amount: i.target.value.replaceAll(',', ''),
            display_amount: temp
          };
        }
        if (type === 'type') {
          updatedVariants[index] = {
            ...updatedVariants[index],
            type: parseInt(i.target.value)
          };
        }

        return updatedVariants;
      }

      return prevVariants;
    });
    //  }
  };

  const searchProduct = async () => {
    const datas = await list({ keywords: keywords });
    setIsVisible(true);
    if (datas.data) {
      setResults(datas.data.data);
    }
  };
  const handleRemoveExistingItem = async (e, id, index) => {
    let temp_array = deleteList;
    temp_array.push(id);
    setDelete(temp_array);

    let temp_selected_variants = selected_variants;
    temp_selected_variants.splice(index, 1);
    setVariants(temp_selected_variants);
  };
  const handleRemoveItem = async (e, index) => {
    let temp_selected_variants = selected_variants;
    temp_selected_variants.splice(index, 1);
    setVariants(temp_selected_variants);
  };
  const loadVariants = async (sku = '') => {
    const { data, isSuccess } = await variants({
      keywords: sku,
      consignor_id: form.consignor_id
    });

    await setLoading(true);
    setKeywords(barcode);
    if (isSuccess) {
      await populateItems(data.list.data, 'new', data.dropdown);

      if (data.list.data.length < 1) {
        setShowModal(true);
      }
    }
  };
  const searchBarcode = async () => {
    if (barcode === undefined || barcode === '' || barcode.trim() === '') {
      setShowModal(true);
      searchProduct();
    }

    if (barcode !== undefined && barcode !== '') {
      const { data, isSuccess } = await variants({ keywords: barcode });
      await setLoading(true);

      setKeywords(barcode);
      if (isSuccess) {
        await populateItems(data.list.data, 'new', []);

        if (data.list.data.length < 1) {
          setShowModal(true);
        }
      } else {
        searchProduct();
        setIsVisible(true);
      }
    }
  };

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const handleSubmit = async (values) => {
    let error = 0;
    let response = '';
    setButtonDisabled(true);

    const updatedArray = selected_variants.map((obj) => {
      return { ...obj, hasError: false, isCheck: true };
    });

    setVariants(updatedArray);

    if (error === 0 || error === 1) {
      let updateStatus =
        error === 1
          ? { ...form, status: 0, entry: updatedArray }
          : { ...form, entry: updatedArray };
      if (selectedDate !== undefined) {
        updateStatus.transaction_date = selectedDate;
      }
      if (effectivity_date !== undefined) {
        updateStatus.effectivity_date = effectivity_date;
      }
      if (deleteList.length > 0) {
        updateStatus.delete = deleteList;
      }
      if (updateStatus.transaction_no === '') {
        response = await stockadjustmentcreate(updateStatus);
        if (response.data) {
          toast.success(response.data.message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          });
          setForm({
            ...form,
            transaction_no: response.data.transaction_no,
            id: response.data.id
          });
          setButtonDisabled(false);
        }
      } else {
        response = await stockadjustmentupdate(updateStatus);
        if (response.data) {
          toast.success(response.data.message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          });
          setForm({ ...form, transaction_no: response.data.transaction_no });
          setButtonDisabled(false);

          if (error === 0) {
            navigate('/app/price-adj');
          }
        }
      }
    }
  };

  document.title = `${!!sadjId ? 'Edit' : 'Create'} Price Adjustment | UN IMS`;

  return (
    <div className="page-content" id="AddProduct">
      <ProductSearchModal
        show={showModal}
        keywords={keywords}
        data={results}
        populateItems={populateItems2}
        isVisible={isVisible}
        handleToggleVisibility={handleToggleVisibility}
        viewItem={viewItem}
        handleChangeValue={setKeywords}
        onClickSearch={searchProduct}
        onCloseClick={() => setShowModal(false)}
      />
      <Container fluid>
        <BreadCrumb
          title={`PRICE ADJUSTMENT`}
          pageTitle="Create Price Adjustment"
        >
          <div className="text-end">
            <ButtonGroup className="material-shadow me-2">
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="button"
                  className="btn btn-light material-shadow-none"
                >
                  {filter_status || 'All'}{' '}
                  <i className="mdi mdi-chevron-down"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      handleChangeStatus(0);
                    }}
                  >
                    Draft
                  </DropdownItem>
                  {sadjId !== undefined && (
                    <DropdownItem
                      onClick={() => {
                        handleChangeStatus(1);
                      }}
                    >
                      Completed
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </ButtonGroup>
            {
              <button
                type="submit"
                className="btn btn-success w-sm  me-2"
                disabled={isButtonDisabled || locked}
                onClick={(e) => {
                  handleSubmit();
                }}
              >
                Save
              </button>
            }
            <Link to="/app/price-adj" className="btn w-sm" color="light">
              Close
            </Link>
          </div>
        </BreadCrumb>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Details</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={2}>
                    <BInput
                      label="Transaction No."
                      placeholder="System Generated"
                      value={form.transaction_no}
                      readOnly="readonly"
                    />
                  </Col>
                  <Col lg={2}>
                    <Label htmlFor="transaction_date" className="form-label">
                      Transaction Date
                    </Label>
                    <Flatpickr
                      value={
                        selectedDate === undefined
                          ? form.transaction_date
                          : selectedDate
                      }
                      onChange={handleDateChange}
                      className="form-control"
                      disabled={sadjId !== undefined && form.status === 1}
                      options={{
                        minDate: 'today',
                        dateFormat: 'Y-m-d' // Customize the date format if needed
                      }}
                    />
                  </Col>
                  <Col lg={2}>
                    <Label htmlFor="transaction_date" className="form-label">
                      Effectivity Date
                    </Label>
                    <Flatpickr
                      value={
                        effectivity_date === undefined
                          ? form.effectivity_date
                          : effectivity_date
                      }
                      onChange={handleEffectiveDateChange}
                      className="form-control"
                      disabled={sadjId !== undefined && form.status === 1}
                      options={{
                        minDate: 'today',
                        dateFormat: 'Y-m-d' // Customize the date format if needed
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-3 mb-2">
                  <Col lg={2}>
                    <BInput
                      label="Reference"
                      placeholder="Reference"
                      value={form.reference}
                      onChange={(e) =>
                        setForm({ ...form, reference: e.target.value })
                      }
                    />
                  </Col>
                  <Col lg={6}>
                    <BInput
                      type="textarea"
                      label="Remarks"
                      placeholder="Remarks"
                      value={form.remarks}
                      onChange={(e) =>
                        setForm({ ...form, remarks: e.target.value })
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={4}>
                    <div className="input-group flex-nowrap  mt-1 mb-2">
                      <span className="input-group-text" id="addon-wrapping">
                        <i className=" ri-barcode-line align-bottom me-1"></i>
                      </span>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Scan Barcode"
                        aria-label="Username"
                        value={barcode || ''}
                        aria-describedby="addon-wrapping"
                        ref={inputBarcodeRef}
                        autoFocus
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        type="button"
                        className="btn btn-success w-sm  me-2"
                        onClick={searchBarcode}
                      >
                        <i className=" ri-search-2-line align-bottom me-1"></i>
                        {loading ? 'Loading...' : 'Search'}
                      </button>{' '}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <SimpleBar style={{ maxHeight: '480px' }}>
                    <Col lg={12}>
                      <table className="table align-middle table-nowrap table-striped-columns mt-1">
                        <thead className="table-light bg-light sticky-top">
                          <tr>
                            <th scope="col" style={{ width: '1%' }}></th>
                            <th scope="col" style={{ width: '1%' }}>
                              {' '}
                              SKU
                            </th>
                            <th scope="col" style={{ width: '20%' }}>
                              Product Title
                            </th>
                            <th scope="col" style={{ width: '11%' }}>
                              Type
                            </th>
                            <th
                              scope="col"
                              style={{ width: '11%' }}
                              className="text-center"
                            >
                              Value
                            </th>

                            <th
                              scope="col"
                              style={{ width: '15%' }}
                              className="text-center"
                            >
                              Remarks
                            </th>
                            <th
                              scope="col"
                              className="text-center"
                              style={{ width: '2%' }}
                            ></th>
                          </tr>
                        </thead>

                        <tbody>
                          {selected_variants?.length > 0 &&
                            selected_variants.map((row, rowIndex) => (
                              <tr key={rowIndex} className="table-light">
                                <td>
                                  {row.hasError && (
                                    <div>
                                      <Tooltip
                                        placement="right"
                                        isOpen={tooltipStates[rowIndex]}
                                        target={'tooltip_' + rowIndex}
                                        toggle={() => toggleTooltip(rowIndex)}
                                      >
                                        {/* {row.to === 0 &&
                                          row.from === 0 &&
                                          'Unable to transfer item with the same location'}
                                        {row.from !== 0 &&
                                          row.to === 0 &&
                                          'Unable to transfer item with no destination location'} */}
                                      </Tooltip>
                                      <Link
                                        className="link-danger"
                                        id={'tooltip_' + rowIndex}
                                      >
                                        <i className="ri-error-warning-line align-middle fs-22"></i>
                                      </Link>
                                    </div>
                                  )}
                                </td>
                                <td className="col-1">{row.generic_sku}</td>
                                <td className="col-2">{row.title}</td>

                                <td className="col-1">
                                  {
                                    <select
                                      className="form-select form-select-md"
                                      id={'to_' + rowIndex}
                                      value={row.status}
                                      onChange={(e) =>
                                        handleVariantChanges(e, 'type', row)
                                      }
                                    >
                                      {typeList
                                        .filter(
                                          (option) => option.id === row.type
                                        )
                                        .map((option) => (
                                          <option
                                            key={option.id}
                                            value={option.id}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      {typeList
                                        .filter(
                                          (option) => option.id !== row.type
                                        )
                                        .map((option) => (
                                          <option
                                            key={option.id}
                                            value={option.id}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                    </select>
                                  }
                                </td>

                                <td>
                                  <div className="col-11  text-center">
                                    <Cleave
                                      placeholder="Enter value"
                                      id={'qty_' + rowIndex}
                                      className="form-control text-center "
                                      options={{
                                        numeral: true,
                                        numeralDecimalScale: 2,
                                        numeralDecimalMark: '.',
                                        numeralThousandsGroupStyle: 'thousand',
                                        rawValueTrimPrefix: true,
                                        delimiter: ',',
                                        numeralPositiveOnly: true
                                      }}
                                      onChange={(e) =>
                                        handleVariantChanges(e, 'amount')
                                      }
                                      onBlur={(e) =>
                                        handleVariantBlur(e, 'amount')
                                      }
                                      value={row.display_amount}
                                    />

                                    {/* <input
                                      type="text"
                                      className="form-control text-center "
                                      placeholder="Qty"
                                      id={'qty_' + rowIndex}
                                      onKeyUp={(e) =>
                                        handleVariantBlur(e, 'amount')
                                      }
                                      onChange={(e) =>
                                        handleVariantChanges(e, 'amount')
                                      }
                                      value={
                                        sadjId !== undefined
                                          ? row.amount
                                          : row.amount
                                      }
                                      aria-describedby="addon-wrapping"
                                    /> */}
                                  </div>
                                </td>
                                <td className="col-2">
                                  <div>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Remarks"
                                      id={'remarks_' + rowIndex}
                                      defaultValue={row.remarks || ''}
                                      onChange={(e) =>
                                        handleVariantChanges(e, 'remarks')
                                      }
                                      aria-describedby="addon-wrapping"
                                    />
                                  </div>
                                </td>

                                <td>
                                  <div className="col-6">
                                    {row.id > 0 ? (
                                      <Link
                                        className="link-danger"
                                        onClick={(e) =>
                                          handleRemoveExistingItem(
                                            e,
                                            row.id,
                                            rowIndex
                                          )
                                        }
                                      >
                                        <i className="ri-delete-bin-5-line align-middle fs-22"></i>
                                      </Link>
                                    ) : (
                                      <Link
                                        className="link-danger"
                                        onClick={(e) =>
                                          handleRemoveItem(e, rowIndex)
                                        }
                                      >
                                        <i className="ri-delete-bin-5-line align-middle fs-22"></i>
                                      </Link>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </Col>{' '}
                  </SimpleBar>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddPriceAdjustment;
