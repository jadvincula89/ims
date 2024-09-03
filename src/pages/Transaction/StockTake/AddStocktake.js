import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from 'react';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import SimpleBar from 'simplebar-react';
import FPLoader from '../../../Components/Common/FPLoader';
import { XHR_MAX_ITEMS_PER_REQUEST } from '../../../common/constants/config';
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  Progress
} from 'reactstrap';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { useCategoryQuery } from '../../../services/category';

import BInput from '../../../Components/Common/BInput';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import './add_product.scss';

import { useLocationListAsOptionsQuery } from '../../../services/location';
import { useLazyListQuery } from '../../../services/product';
import { useLazyVariantsQuery } from '../../../services/stockadjustment';
import {
  useLazyGetsingleQuery,
  useLazyGetdraftsadjQuery,
  useUpdateMutation,
  useGenerateMutation,
  useSaveSTAKEItemsMutation,
  useCounterMutation,
  useScanBarcodeMutation
} from '../../../services/stocktake';
import { toast } from 'react-toastify';
import Switch from '../../../Components/Common/Switch';
import { numberWithCommas } from '../../../common/helpers';
import Cleave from 'cleave.js/react';
import SaveConfirmationModal from './SaveConfirmationModal';
import Select from 'react-select';
import { useSellertypeQuery } from '../../../services/seller_type';
import { useGetconfigQuery } from '../../../services/auth';
import ProductTitle from '../../../Components/Common/ProductTitle';
import usePusher from '../../../hooks/usePusher';
import {
  STAKE_BARCODE_SCAN_EVENT,
  STAKE_CHANNEL
} from '../../../common/constants/transaction';
import BModal from '../../../Components/Common/Modal';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const AddStocktake = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_no: '',
    remarks: '',

    status: 0,
    sync_to_cm: true,
    reference: '',
    seller_type: '',
    isfreeze_qty: 0,
    entry: []
  });
  const [stop, setStop] = useState(false);
  const [counterStop, setCounterStop] = useState(false);
  const [show_modal, setShowModal] = useState(false);
  const [sadj_id, setSADJ] = useState('');
  const [locked, setLocked] = useState(false);
  const [saveSTAKEItems] = useSaveSTAKEItemsMutation();
  const [update, { isLoading: update_loading }] = useUpdateMutation();
  const [generate, { isLoading: generate_loading }] = useGenerateMutation();
  const [counter, { isLoading: counter_loading }] = useCounterMutation();
  const { data: seller_type, isProcessing, isFetching } = useSellertypeQuery();
  const [sadjOptions, setSADJOptions] = useState([]);
  const { data: config_data, isSuccess: config_loaded } = useGetconfigQuery();
  const [scanned_barcode, setScannedBarcode] = useState('');
  const [barcode, setBarcode] = useState(undefined);
  const [deleteList, setDelete] = useState([]);
  const [default_consignor, setDefaultConsignor] = useState([]);
  const [variants, { data: v_data }] = useLazyVariantsQuery();

  const { data: category } = useCategoryQuery({});
  const [getsingle, { data: single_data, isSuccess: single_success }] =
    useLazyGetsingleQuery();
  const [getdraftsadj, { data: sadj_data, isSuccess: sadj_success }] =
    useLazyGetdraftsadjQuery();
  const [selected_variants, setVariants] = useState([]);
  const [inputCount, setInputCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modal_link, setModalLink] = useState(false);
  const [modal_link2, setModalLink2] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(0);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [complete, setComplete] = useState(1);
  const [variance_filter, setVarianceFilter] = useState({
    with_variance: true,
    no_variance: true,
    missing_physical_count: true
  });
  const [status, setStatus] = useState(1);
  const [params, setParams] = useState({});
  const [countermessage, setCounterMessage] = useState('');
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [keywords, setKeywords] = useState('');
  const [keywords2, setKeywords2] = useState('');
  const [list, { data: product_list }] = useLazyListQuery({
    ...params,
    keywords,
    page,
    per_page,
    status
  });
  const invalidFeedbackStyle = {
    color: '#f06548',

    display: 'none',
    fontSize: '.875em',
    marginTop: '.25rem',
    width: '100%'
  };
  const showInvalidFeedbackStyle = {
    ...invalidFeedbackStyle,
    display: 'block'
  };
  const { data: location_options, isLoading: loading_location } =
    useLocationListAsOptionsQuery({
      per_page: 1000
    });
  const [filter_status, setFilterStatus] = useState('Pending');
  const sellerTypeRef = useRef();
  const f_status = useMemo(() => {
    return {
      0: 'Completed',
      1: 'Pending'
    };
  }, []);

  const [scanBarcode] = useScanBarcodeMutation();
  const { pusher, channel } = usePusher({
    channel_name: STAKE_CHANNEL,
    event: STAKE_BARCODE_SCAN_EVENT
  });

  useEffect(() => {
    if (selected_variants.length > 0) {
      if (channel) {
        channel.bind(STAKE_BARCODE_SCAN_EVENT, function (data) {
          const item = data.d;
          const b = (item.g_sku || '').trim();
          let find_index = -1;

          for (
            let i = 0, l = selected_variants.length;
            find_index === -1 && i < l;
            i++
          ) {
            if (b === selected_variants[i].generic_sku) find_index = i;
          }

          if (find_index !== -1) {
            setVariants((prev_variants) => {
              const updated_variants = [...prev_variants];
              let current_qty = item.qty;

              updated_variants[find_index] = {
                ...updated_variants[find_index],
                stock_take_quantity: current_qty
              };

              return updated_variants;
            });
            scrollToQuantityIndex(find_index);
          }
        });
      }
    }
  }, [channel, selected_variants]);

  const handleChangeStatus = (value) => {
    setForm({ ...form, status: value });
    setFilterStatus(f_status[value]);
  };
  const closeModal = () => {
    setModalLink(!modal_link);
  };
  const closeModal2 = () => {
    setModalLink2(!modal_link2);
  };
  const handleClose = (e) => {
    setSelected(0);

    setBarcode('');
    const rows = document.querySelectorAll('.searchable');

    rows.forEach((row) => {
      row.classList.add('table-lights');
      row.classList.remove('table-warning');
    });

    const tableContainer = document.getElementById('table_stocktake');
    tableContainer.scrollTop = 0;
  };

  const handleMoveDown = (e) => {
    if (results.length > 0) {
      let currentselected = selected;
      let currentID = results[currentselected - 1];
      let nextID = results[selected];
      const row = document.querySelector('#' + currentID);
      row.classList.add('table-lights');
      row.classList.remove('table-warning');
      const row2 = document.querySelector('#' + nextID);
      row2.classList.remove('table-lights');
      row2.classList.add('table-warning');
      row2.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSelected(currentselected + 1);

      const qty_input = row2.querySelector('input');
      qty_input.focus();
    }
  };

  const handleMoveUp = (e) => {
    if (results.length > 0) {
      let currentselected = selected - 1;
      let currentID = results[currentselected];
      let prevID = results[currentselected - 1];
      const row = document.querySelector('#' + currentID);
      row.classList.add('table-lights');
      row.classList.remove('table-warning');
      const row2 = document.querySelector('#' + prevID);
      row2.classList.remove('table-lights');
      row2.classList.add('table-warning');
      row2.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const qty_input = row2.querySelector('input');
      qty_input.focus();
      setSelected(currentselected);
    }
  };

  const searchItem = (pastestring = '') => {
    let searchkeyword =
      pastestring === '' ? barcode.trim() : pastestring.trim();
    setSelected(0);
    setResults([]);
    const resultsArray = [];
    let matchedRow = null;
    let countResult = 0;
    const rows = document.querySelectorAll('.searchable');
    rows.forEach((row, i) => {
      let matchFound = false;
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const text = cell.innerHTML;
        const index = text.toLowerCase().indexOf(searchkeyword.toLowerCase());
        if (index !== -1 && searchkeyword.length > 0) {
          matchFound = true;
          countResult++;
        }
      });
      if (!matchFound || searchkeyword.length === 0) {
        row.classList.add('table-lights');
        row.classList.remove('table-warning');
      } else {
        matchedRow = row;
        resultsArray.push(row.id);
        if (countResult === 1) {
          setSelected(countResult);
          row.classList.add('table-warning');
          row.classList.remove('table-lights');

          matchedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById(`qty_${i}`).focus();
        }
      }
    });
    setResults(resultsArray);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      handleBarcodeScan(event.target.value);
      event.target.value = '';
    }
  };
  const getdraftSADJ = async () => {
    const { data, isSuccess } = await getdraftsadj({ status: 0 });

    if (isSuccess) {
      const options = data?.data.map((d) => ({
        value: d.id,
        label: d.transaction_no
      }));
      setSADJOptions(options);
    }
  };

  const handleOnChangeQty = async (generic_sku, value) => {
    await scanBarcode({ generic_sku, id, qty: value });
  };

  const getStockAdj = useCallback(
    async (id) => {
      const { data, isSuccess } = await getsingle({ id: id });

      if (isSuccess) {
        setVariants(data.items);

        scrollToEmptyQuantityOnLoad(data.items || []);
        if (data.status === 0) {
          setLocked(true);
        } else {
          setLocked(false);
        }

        setFilterStatus(f_status[data.status]);
        setComplete(data.status);

        setForm({
          ...form,
          transaction_no: data.transaction_no,
          id: data.id,
          remarks: data.remarks,
          reference: data.reference,
          category: data?.category,
          seller_type: data?.seller_type,
          isfreeze_qty: data?.isfreeze_qty,
          location: data?.location,
          transaction_date:
            data?.transaction_date?.length > 0
              ? data.transaction_date.split(' ')[0]
              : '',
          status: data.status
        });
      }
    },
    [setFilterStatus, getsingle, f_status, setForm, form]
  );

  const loadConfig = useCallback(async () => {
    if (default_consignor.length === 0) {
      const data_value = config_data.DEFAULT_SELLER_FOR_INVENTORY || '';

      let res = JSON.parse(data_value);

      if (res?.id) {
        if (!!data_value) {
          setDefaultConsignor({ defaultuser: res });
          if (id === undefined) {
            setKeywords2(res.name);
            let tempholder = sellerTypeRef.current.value;
            let newValue = tempholder.split('_');
            setForm({
              ...form,
              seller_type: newValue[0],
              consignor_id: res?.id,
              consignor_name: res?.name
            });
          }
          if (res?.id === form.consignor_id) {
            setKeywords2(res.name);
          }
        }
      }
    }
  }, [default_consignor, form, id, config_data]);

  useEffect(() => {
    if (id !== undefined && stop === false) {
      if (counterStop === false) {
        Counter(id);
      }

      setStop(true);
    }

    /* eslint-disable */
  }, [id, stop]);

  useEffect(() => {
    if (!!config_loaded) loadConfig();
  }, [config_data, config_loaded]);

  useEffect(() => {
    if (!!scanned_barcode) {
      handleBarcodeScan(scanned_barcode);
    }
  }, [scanned_barcode]);

  const handleGlobalPaste = async (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text/plain');

    if ((pastedText || '').includes('\n')) {
      setScannedBarcode(pastedText);
      return;
    }

    setBarcode(pastedText);
    searchItem(pastedText);
  };

  const handleBarcodeScan = async (barcode) => {
    const b = (barcode || '').trim();
    let find_index = -1;

    for (
      let i = 0, l = selected_variants.length;
      find_index === -1 && i < l;
      i++
    ) {
      if (b === selected_variants[i].generic_sku) find_index = i;
    }

    if (find_index !== -1) {
      await scanBarcode({ generic_sku: b, id });
      setVariants((prev_variants) => {
        const updated_variants = [...prev_variants];
        let current_qty = +(
          updated_variants[find_index].stock_take_quantity || 0
        );

        updated_variants[find_index] = {
          ...updated_variants[find_index],
          stock_take_quantity: current_qty + 1
        };

        return updated_variants;
      });
      scrollToQuantityIndex(find_index);
    } else {
      toast.error('Barcode not found!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
    setScannedBarcode('');
    setBarcode('');
  };

  const handleVariantChanges = (i, type, params = []) => {
    setVariants((prevVariants) => {
      const id = i.target.id.split('_');
      const index = id[1];

      if (index !== -1) {
        const updatedVariants = [...prevVariants];
        if (type === 'quantity') {
          const value = i.target.value.replace(/[^-0-9]*/g, '');
          handleOnChangeQty(updatedVariants[index]['generic_sku'], value);
          updatedVariants[index] = {
            ...updatedVariants[index],
            stock_take_quantity: value,
            touch: true
          };
        }

        return updatedVariants;
      }

      return prevVariants;
    });
  };
  const Counter = async (id) => {
    let response = '';
    response = await counter({ id: id });
    if (response.data) {
      try {
        setCounterMessage(
          ' ' +
            response.data.stock_take_quantity +
            ' out of ' +
            response.data.on_hand_quantity +
            ' items'
        );
        if (response.data.status === 'stop') {
          setCounterStop(true);
          setCounterMessage('');
          setStop(false);

          await getStockAdj(id);
          return;
        } else {
          setStop(true);
          if (counterStop === false) {
            Counter(id);
          }

          console.log('loop here');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
  };

  const handleGenerateSADJ = async () => {
    let response = '';
    setButtonDisabled(true);

    response = await generate({ id: form.id });
    if (response?.error?.status === 400) {
      toast.error(response.error.data.error, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
      setButtonDisabled(false);
    }
    if (response.data) {
      setForm({ ...form, reference: response.data.transaction_no });

      toast.success(response.data.message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });

      setButtonDisabled(false);
    }
  };
  const handleConfirm = async (as_pending = false, force_complete = false) => {
    setModalLink(true);
  };
  const handleYes = () => {
    setModalLink(false);
    setModalLink2(true);
    getdraftSADJ();
  };
  const handleNo = () => {
    setModalLink(false);
    handleSubmit(false, true);
  };
  const handlePreSubmit = async (
    as_pending = false,
    force_complete = false
  ) => {
    setModalLink2(false);

    setShowModal(false);

    handleSubmit(as_pending, force_complete);
  };

  const handleSubmit = async (as_pending = false, force_complete = false) => {
    let error = 0;

    let response = '';
    setButtonDisabled(true);
    let updateStatus = { id: form.id, status: form.status };
    let sadjId = 0;
    if (deleteList.length > 0) {
      updateStatus.delete = deleteList;
    }
    const filteredItems = selected_variants
      .filter((item) => item.touch)
      .map((item) => ({
        quantity: item.stock_take_quantity,
        generic_sku: item.generic_sku,
        shopify_id: item.shopify_id
      }));
    if (filteredItems) {
      updateStatus.entry = filteredItems;
    }

    if (!!as_pending) {
      updateStatus.status = 1;
    }

    if (sadj_id !== '') {
      sadjId = sadj_id?.value;
      updateStatus.sadj_id = sadjId;
    }
    if (!!force_complete) {
      updateStatus.status = 0;
    }

    response = await update(updateStatus);
    setStop(true);
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
        navigate('/app/stocktake');
      }
    }
  };

  const getPopulatedPhysicalCount = (data) => {
    return (data || []).filter((d) =>
      (d.stock_take_quantity + '').match(/^[0-9]+/)
    ).length;
  };

  const handleQuantityKeyup = (e, index) => {
    if (e.which === 13 || e.key === 'Enter') {
      let next_index = +index;

      if (e.shiftKey) {
        next_index--;
      } else {
        next_index++;
      }

      const next_qty = document.getElementById(`qty_${+next_index}`);

      next_qty.focus();
    }
  };

  const scrollToEmptyQuantityOnLoad = (list) => {
    setTimeout(() => {
      let empty_qty_index = -1;
      for (let i = 0; i < list.length && empty_qty_index === -1; i++) {
        if (!list[i].stock_take_quantity) {
          empty_qty_index = i;
        }
      }

      if (empty_qty_index !== -1) {
        const qty_elem = document.getElementById(`qty_${empty_qty_index}`);
        if (!!qty_elem) {
          qty_elem.scrollIntoView({ behavior: 'smooth', block: 'center' });

          setTimeout(() => {
            qty_elem.focus();
          }, 1000);
        }
      }
    }, 200);
  };

  const scrollToQuantityIndex = (index) => {
    const qty_elem = document.getElementById(`qty_${index}`);
    if (!!qty_elem) {
      qty_elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleVarianceSelectAllOnClick = () => {
    const { no_variance, with_variance, missing_physical_count } =
      variance_filter;

    if (!!no_variance && !!with_variance && !!missing_physical_count) {
      setVarianceFilter({
        no_variance: false,
        with_variance: false,
        missing_physical_count: false
      });
    } else {
      setVarianceFilter({
        no_variance: true,
        with_variance: true,
        missing_physical_count: true
      });
    }
  };

  document.title = `${!!id ? 'Edit' : 'Create'} Stocktake | UN IMS`;

  return (
    <div className="page-content" id="AddProduct">
      <FPLoader
        open={stop && (form.transaction_no === '' || countermessage != '')}
        message={'Loading' + countermessage}
      />
      <ConfirmModal
        modal_link={modal_link}
        closeModal={closeModal}
        handleNo={handleNo}
        handleYes={handleYes}
      />
      <SADJModal
        modal_link2={modal_link2}
        closeModal2={closeModal2}
        showInvalidFeedbackStyle={showInvalidFeedbackStyle}
        handleNo={handleNo}
        handleYes={handleYes}
        handleSubmit={handlePreSubmit}
        setSADJ={setSADJ}
        sadjOptions={sadjOptions}
        sadj_id={sadj_id}
      />

      <SaveConfirmationModal
        show={show_modal}
        setShowModal={setShowModal}
        onSavePending={() => handleSubmit(true)}
        onSubmit={() => handleConfirm()}
        data={(selected_variants || []).filter((d) => !d.stock_take_quantity)}
      />
      <Container fluid>
        <BreadCrumb title={`STOCKTAKE`} pageTitle="Create Stocktake">
          <div className="text-end">
            <ButtonGroup className="material-shadow me-2">
              <UncontrolledDropdown disabled={single_data?.status === 0}>
                <DropdownToggle
                  tag="button"
                  className="btn btn-light material-shadow-none"
                >
                  {filter_status}
                  <i className="mdi mdi-chevron-down"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      handleChangeStatus(1);
                    }}
                  >
                    Pending
                  </DropdownItem>
                  {!!id && (
                    <DropdownItem
                      onClick={() => {
                        handleChangeStatus(0);
                      }}
                    >
                      Completed
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </ButtonGroup>
            {complete === 1 ? (
              <button
                type="submit"
                className="btn btn-success w-sm  me-2"
                disabled={update_loading || single_data?.status === 0}
                onClick={(e) => {
                  e.preventDefault();
                  const with_physical_count =
                    getPopulatedPhysicalCount(selected_variants);

                  if (
                    form.status === 1 ||
                    with_physical_count === selected_variants.length
                  ) {
                    if (form.status === 1) {
                      handleSubmit();
                    }
                    if (
                      with_physical_count === selected_variants.length &&
                      form.status === 0
                    ) {
                      setModalLink(true);
                    }
                  } else if (with_physical_count < selected_variants.length) {
                    setShowModal(true);
                  }
                }}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-info w-sm  me-2"
                disabled={isButtonDisabled || form?.reference?.length > 0}
                onClick={(e) => {
                  e.preventDefault();
                  handleGenerateSADJ();
                }}
              >
                {!isButtonDisabled ? 'Create Stock Adjustment' : 'Loading'}
              </button>
            )}
            <Link to="/app/stocktake" className="btn w-sm" color="light">
              Close
            </Link>
          </div>
        </BreadCrumb>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col lg={1}>
                    <h5 className="card-title mb-0">Details</h5>
                  </Col>
                  <Col lg={11}>
                    <div className="float-end">
                      <Switch
                        title="Freeze Quantity on hand"
                        checked={form.isfreeze_qty === 1}
                        readOnly
                      />
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={2} md={3} className="mb-3">
                    <div>
                      <BInput
                        label="Transaction No."
                        placeholder="System Generated"
                        value={form.transaction_no}
                        readOnly="readonly"
                      />
                    </div>
                  </Col>
                  <Col lg={2} md={3} className="mb-3">
                    <BInput
                      label="Transaction Date."
                      placeholder="System Generated"
                      value={form.transaction_date}
                      readOnly="readonly"
                    />
                  </Col>
                  <Col lg={2} md={3} className="mb-3">
                    <Label htmlFor="seller_type" className="form-label">
                      Seller Type
                    </Label>
                    <select disabled className="form-control form-select">
                      {form?.seller_type === 0 && <option>All</option>}
                      {seller_type?.data
                        .filter((item) => item.id === form?.seller_type)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </Col>

                  <Col lg={2} md={3}>
                    <div className="mb-3">
                      <FormGroup>
                        <Label htmlFor="seller_type" className="form-label">
                          Location
                        </Label>
                        <div style={{ minWidth: '100%' }}>
                          <select disabled className="form-select">
                            {location_options
                              ?.filter(
                                (option) => option.value === form.location
                              )
                              .map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </FormGroup>
                    </div>
                  </Col>
                  <Col lg={2} md={3} className="mb-3">
                    <Label htmlFor="seller_type" className="form-label">
                      Category
                    </Label>
                    <select disabled className="form-control form-select">
                      {form?.category === 0 && <option>All</option>}
                      {category?.data
                        .filter((item) => item.id === form?.category)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>
                <Row>
                  <Col lg={2} md={3} className="mb-3">
                    <div>
                      <BInput
                        label="Reference."
                        placeholder="System Generated"
                        value={form?.reference}
                        readOnly="readonly"
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <BInput
                      type="text"
                      disabled={complete === 0}
                      label="Remarks"
                      placeholder="Remarks"
                      value={form.remarks}
                      onChange={(e) =>
                        setForm({ ...form, remarks: e.target.value })
                      }
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Card className="">
              <CardBody>
                <Row>
                  <Col lg={4} sm={9}>
                    <div className="search-box flex-nowrap product-search mb-3 position-relative ">
                      <Input
                        type="text"
                        className="form-control bg-light border-0"
                        placeholder="Search Product"
                        aria-describedby="addon-wrapping"
                        onKeyDown={handleKeyDown}
                      />
                      <i className="ri-search-line search-icon"></i>
                      {selected !== 0 && (
                        <div className="actions-wrapper">
                          <div className="px-2">
                            {`${selected}/${results?.length}`}
                          </div>
                          <Button
                            color="light"
                            className="btn-icon"
                            onClick={() => {
                              handleMoveUp();
                            }}
                          >
                            {' '}
                            <i className="ri-align-right ri-arrow-up-s-line" />
                          </Button>
                          <Button
                            color="light"
                            className="btn-icon"
                            onClick={() => {
                              handleMoveDown();
                            }}
                          >
                            {' '}
                            <i className="ri-align-center  ri-arrow-down-s-line" />
                          </Button>
                          <Button
                            color="light"
                            className="btn-icon"
                            onClick={() => {
                              handleClose();
                            }}
                          >
                            {' '}
                            <i className="ri-align-center  ri-close-line" />
                          </Button>{' '}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={2} sm={3}>
                    <ButtonGroup className="">
                      <UncontrolledDropdown className="">
                        <DropdownToggle
                          tag="button"
                          className="btn btn-primary btn-label right border-0"
                        >
                          <i className="ri-filter-fill label-icon fs-16"></i>{' '}
                          Filters
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-md">
                          <DropdownItem disabled className="text-center mb-1">
                            <span className=" text-black fw-bold">
                              Variance
                            </span>
                          </DropdownItem>
                          <Container fluid>
                            <div>
                              <div className="mb-2">
                                <Button
                                  color="secondary"
                                  size="sm"
                                  type="button"
                                  onClick={handleVarianceSelectAllOnClick}
                                >
                                  Select All
                                </Button>
                              </div>
                              <div className="mb-2">
                                <Input
                                  className="form-check-input"
                                  checked={variance_filter.with_variance}
                                  type="checkbox"
                                  name="variance_with"
                                  id="variance_with"
                                  onChange={(e) =>
                                    setVarianceFilter({
                                      ...variance_filter,
                                      with_variance: e.target.checked
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label ms-1"
                                  htmlFor="variance_with"
                                >
                                  &nbsp;With Variance
                                </Label>
                              </div>
                              <div className="mb-2">
                                <Input
                                  className="form-check-input"
                                  checked={variance_filter.no_variance}
                                  type="checkbox"
                                  name="variance_none"
                                  id="variance_none"
                                  onChange={(e) =>
                                    setVarianceFilter({
                                      ...variance_filter,
                                      no_variance: e.target.checked
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label ms-1"
                                  htmlFor="variance_none"
                                >
                                  &nbsp;No Variance
                                </Label>
                              </div>
                              {(single_data?.status === 1 ||
                                (single_data?.status === 0 &&
                                  getPopulatedPhysicalCount(
                                    selected_variants
                                  ) !== selected_variants.length)) && (
                                <div className="mb-2">
                                  <Input
                                    className="form-check-input"
                                    checked={
                                      variance_filter.missing_physical_count
                                    }
                                    type="checkbox"
                                    name="variance_missing_count"
                                    id="variance_missing_count"
                                    onChange={(e) =>
                                      setVarianceFilter({
                                        ...variance_filter,
                                        missing_physical_count: e.target.checked
                                      })
                                    }
                                  />
                                  <Label
                                    className="form-check-label ms-1"
                                    htmlFor="variance_missing_count"
                                  >
                                    &nbsp;Missing Physical Count
                                  </Label>
                                </div>
                              )}
                            </div>
                          </Container>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </ButtonGroup>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <h6 className=" text-start">Inventory Progress</h6>
                    <Progress
                      animated
                      color="info"
                      value={
                        (getPopulatedPhysicalCount(selected_variants) /
                          selected_variants.length) *
                        100
                      }
                    >
                      {getPopulatedPhysicalCount(selected_variants)}/
                      {selected_variants.length}
                    </Progress>
                  </Col>
                </Row>
                <Row>
                  <SimpleBar style={{ maxHeight: '500px' }}>
                    <Col lg={12}>
                      <table
                        className="table align-middle table-nowrap table-striped-columns"
                        id="table_stocktake"
                      >
                        <thead className="table-light bg-light sticky-top">
                          <tr>
                            <th scope="col" style={{ width: '23 %' }}>
                              Product
                            </th>
                            {/* <th scope="col" style={{ width: '1%' }}>
                              SKU
                            </th> */}
                            <th
                              scope="col"
                              style={{ width: '1%' }}
                              className="text-center"
                            >
                              Quantity on Hand
                            </th>
                            <th scope="col">Variances</th>
                            <th scope="col">Physical Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected_variants.length > 0 &&
                            selected_variants
                              .filter((row) => {
                                let variance = '';

                                if (
                                  row.stock_take_quantity - row?.quantity !==
                                    0 &&
                                  row.stock_take_quantity > 0
                                ) {
                                  variance =
                                    row.stock_take_quantity - row?.quantity;
                                } else if (row.stock_take_quantity !== 0) {
                                  variance =
                                    row.stock_take_quantity !== '' &&
                                    +row?.quantity - row.stock_take_quantity;
                                }

                                if (variance_filter.with_variance === true) {
                                  if (
                                    row.stock_take_quantity &&
                                    row?.quantity
                                  ) {
                                    if (
                                      row.stock_take_quantity !== row?.quantity
                                    ) {
                                      return true;
                                    }
                                  }
                                }

                                if (variance_filter.no_variance) {
                                  if (
                                    row?.quantity - row.stock_take_quantity ===
                                      0 &&
                                    row.stock_take_quantity
                                  )
                                    return true;
                                }

                                if (variance_filter.missing_physical_count) {
                                  if (!row.stock_take_quantity) return true;
                                }

                                return false;
                              })
                              .map((row, rowIndex) => {
                                let variance = '';

                                if (
                                  row.stock_take_quantity - row?.quantity !==
                                    0 &&
                                  row.stock_take_quantity > 0
                                ) {
                                  variance =
                                    row.stock_take_quantity - row?.quantity;
                                } else if (row.stock_take_quantity !== 0) {
                                  variance =
                                    row.stock_take_quantity !== '' &&
                                    +row?.quantity - row.stock_take_quantity;
                                }

                                if (!!variance) {
                                  variance = numberWithCommas(variance);
                                }

                                return (
                                  <tr
                                    key={rowIndex}
                                    id={`tr_row_${rowIndex}`}
                                    className="searchable"
                                  >
                                    <td className="col-1">
                                      <ProductTitle
                                        generic_sku={row?.generic_sku}
                                        title={row?.title}
                                        style={{ maxWidth: '350px' }}
                                      />
                                    </td>
                                    <td className="col-1 text-center">
                                      {numberWithCommas(row?.quantity || 0)}
                                    </td>

                                    <td className="col-1">
                                      {row.stock_take_quantity -
                                        row?.quantity !==
                                        0 && row.stock_take_quantity > 0 ? (
                                        <span
                                          className={
                                            row.stock_take_quantity -
                                              row?.quantity >=
                                            0
                                              ? 'badge bg-secondary-subtle fs-14 text-secondary'
                                              : 'badge bg-danger-subtle fs-14 text-danger'
                                          }
                                        >
                                          {variance}
                                        </span>
                                      ) : row.stock_take_quantity !== null ? (
                                        <span className="badge bg-success-subtle fs-14 text-success">
                                          {variance}
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                    </td>
                                    <td className="col-1">
                                      <div className="col-5  text-center">
                                        <Cleave
                                          disabled={single_data?.status === 0}
                                          tabIndex={rowIndex}
                                          type="text"
                                          className="form-control text-center "
                                          placeholder="Qty"
                                          id={'qty_' + rowIndex}
                                          onChange={(e) =>
                                            handleVariantChanges(e, 'quantity')
                                          }
                                          value={row.stock_take_quantity}
                                          aria-describedby="addon-wrapping"
                                          onKeyDown={(e) =>
                                            handleQuantityKeyup(e, rowIndex)
                                          }
                                          options={{
                                            numeral: true,
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: '.',
                                            numeralThousandsGroupStyle:
                                              'thousand',
                                            rawValueTrimPrefix: true,
                                            delimiter: ',',
                                            numeralPositiveOnly: true
                                          }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
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
const ConfirmModal = React.memo(
  ({
    modal_link,
    closeModal,
    handleNo,
    handleYes,
    setSADJ,
    sadj_id,
    sadjOptions,
    ...props
  }) => {
    const close = async () => {
      await closeModal();
    };

    const handleChoice = (x = 1) => {
      if (x === 1) {
        handleNo();
      }
      if (x === 2) {
        handleYes();
      }
    };
    return (
      <React.Fragment key={1212}>
        {modal_link && (
          <Modal isOpen={modal_link} id="firstmodal" centered>
            <ModalHeader className="bg-light p-3" toggle={close}>
              Confirmation
            </ModalHeader>
            <ModalBody className="text-center p-0">
              <div className="mt-1 pt-4 mb-2">
                <h4>
                  Do you want to save the entries in an existing draft Stock
                  Adjustment?
                </h4>
                <p className="text-muted">
                  {' '}
                  It will append the entries to draft stock adjustment upon the
                  clicking "Create Stock Adjustment" button
                </p>

                <div className="hstack gap-3 justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-link link-success fw-medium"
                    onClick={() => handleChoice(1)}
                  >
                    {' '}
                    No, Create New Stock Adjustment
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-success"
                    onClick={() => handleChoice(2)}
                  >
                    Yes
                  </Link>
                </div>
              </div>
            </ModalBody>
          </Modal>
        )}
      </React.Fragment>
    );
  }
);
const SADJModal = React.memo(
  ({
    closeModal2,
    modal_link2,
    showInvalidFeedbackStyle,
    handleSubmit,

    setSADJ,
    sadj_id,
    sadjOptions,
    ...props
  }) => {
    const close = () => {
      closeModal2();
    };
    const [error, setError] = useState('');
    const handlePrepSubmit = () => {
      if (!sadj_id) {
        setError('This field is required');
      } else {
        setError(false);
        handleSubmit(false, true);
      }
    };

    return (
      <React.Fragment key={1212}>
        {modal_link2 && (
          <Modal isOpen={modal_link2} id="secondmodal" centered>
            <ModalHeader className="bg-light p-3" toggle={close}>
              Choose Draft Stock Adjustment
            </ModalHeader>
            <ModalBody className=" p-0">
              <div className="mt-1 pt-1 mb-2">
                <div className="col-lg-11 col-md-11 col-sm-11 mb-3 mt-1 ms-3 me-3">
                  <label htmlFor="sadj_id" className="form-label">
                    Transaction No.
                  </label>
                  <Select
                    placeholder="Transaction No."
                    id="sadj_id"
                    value={sadj_id}
                    onChange={setSADJ}
                    options={sadjOptions}
                    name="choices-publish-status-input"
                    classNamePrefix="select2-selectio aa n form-select"
                    backspaceRemovesValue
                    isClearable
                  />
                  {error && <div style={showInvalidFeedbackStyle}>{error}</div>}
                </div>

                <div className="hstack gap-3 justify-content-center">
                  <button
                    className="btn  link-success fw-medium"
                    onClick={() => close()}
                  >
                    No
                  </button>
                  <button
                    onClick={() => handlePrepSubmit()}
                    className="btn btn-success"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        )}
      </React.Fragment>
    );
  }
);
export default AddStocktake;
