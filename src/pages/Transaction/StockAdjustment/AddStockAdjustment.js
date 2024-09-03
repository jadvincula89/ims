import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from 'react';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import SimpleBar from 'simplebar-react';
import ProductSearchModal from './ProductSearchModal';
import ConsignorSearchModal from './ConsignorSearchModal';
import FPLoader from '../../../Components/Common/FPLoader';
import { UncontrolledAlert as Alert, Spinner } from 'reactstrap';
import BModal from '../../../Components/Common/Modal';
import {
  Card,
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
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
  UncontrolledTooltip,
  Progress
} from 'reactstrap';

import * as Yup from 'yup';

import { Link, useNavigate, useParams } from 'react-router-dom';

import Flatpickr from 'react-flatpickr';

import { useSellertypeQuery } from '../../../services/seller_type';

import BInput from '../../../Components/Common/BInput';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import './add_product.scss';

import { useLocationListAsOptionsQuery } from '../../../services/location';
import {
  useLazyListQuery,
  useLazyConsignorsQuery
} from '../../../services/product';
import {
  useLazyVariantsQuery,
  useLazyGetsadjlogsQuery,
  useLazyGetsingleQuery,
  useLazyGetdropdownQuery,
  useLazyGetconfigQuery,
  useStockadjustmentcreateMutation,
  useStockadjustmentupdateMutation,
  useSaveSADJItemsMutation,
  useProgressQuery,
  useGetSADJItemsQuery,
  useLazyGetSADJItemslistQuery,
  useGetdropdownQuery
} from '../../../services/stockadjustment';

import { toast } from 'react-toastify';
import { XHR_MAX_ITEMS_PER_REQUEST } from '../../../common/constants/config';
import { constrainPoint } from '@fullcalendar/react';
import { useGetconfigQuery } from '../../../services/auth';
import ProductTitle from '../../../Components/Common/ProductTitle';
import { useAsyncDebounce } from 'react-table';
const AddStockAdjustment = () => {
  const navigate = useNavigate();
  const { sadj_id } = useParams();
  const [tooltipStates, setTooltipStates] = useState(Array(0).fill(false));
  const [logs, setLogs] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [total_quantity, setQuantity] = useState(0);

  const [startindex, setStartIndex] = useState(0);
  const [modalLogs, setModalLogs] = useState(false);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const toggleTooltip = (index) => {
    const newTooltipStates = [...tooltipStates];
    newTooltipStates[index] = !newTooltipStates[index];
    setTooltipStates(newTooltipStates);
  };
  const [form, setForm] = useState({
    id: ' ',
    transaction_date: new Date(),
    transaction_no: '',
    remarks: ' ',
    status: 0,
    sync_to_cm: true,
    reference: ' ',
    seller_type: 1,
    entry: []
  });
  const [stop, setStop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saveSADJItems] = useSaveSADJItemsMutation();

  const [locked, setLocked] = useState(false);
  const [stockadjustmentcreate] = useStockadjustmentcreateMutation();
  const [
    stockadjustmentupdate,
    { data: update_data, isSuccess: update_success }
  ] = useStockadjustmentupdateMutation();
  const [showConsignor, setConsignorModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [items_loading, setItemLoading] = useState(false);
  const { data: seller_type, isProcessing, isFetching } = useSellertypeQuery();
  const { data: config_data, isSuccess: config_loaded } = useGetconfigQuery();
  const [barcode, setBarcode] = useState(undefined);
  const [deleteList, setDelete] = useState([]);
  const [logs_loading, setLogsLoading] = useState(false);
  const [default_consignor, setDefaultConsignor] = useState([]);
  const [variants, { data: v_data }] = useLazyVariantsQuery();
  const [getsingle, { data: single_data, isLoading: single_data_loading }] =
    useLazyGetsingleQuery();
  const [getList, { data: list_data, isLoading: list_data_loading }] =
    useLazyGetSADJItemslistQuery();
  const [getlogs, { data: log_data, isLoading: log_data_loading }] =
    useLazyGetsadjlogsQuery();
  const is_completed = single_data?.status === 1;
  const { data: progress_data } = useProgressQuery(
    { transaction_no: form.transaction_no },
    {
      skip: !single_data?.transaction_no || single_data?.status !== 1,
      pollingInterval: 1000 * 60 * 1,
      skipPollingIfUnfocused: true
    }
  );
  // const {
  //   data: items_data,
  //   isLoading: items_loading,
  //   isSuccess: items_success
  // } = useGetSADJItemsQuery(
  //   { transaction_no: single_data?.transaction_no },
  //   { skip: !single_data?.transaction_no }
  // );
  const [selected_variants, setVariants] = useState([]);
  const [tempList, setTempList] = useState([]);
  const [inputCount, setInputCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [consignorList, setConsignors] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [sellertype, setSellerType] = useState(0);
  const [status, setStatus] = useState(1);
  const [params, setParams] = useState({});
  const [remarks_active, setRemarksActive] = useState(0);
  const [page, setPage] = useState(1);
  const [isStake, setStockTake] = useState(0);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [keywords, setKeywords] = useState('');
  const [keywords2, setKeywords2] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [consignor, setConsignor] = useState('');
  const [list, { data: product_list }] = useLazyListQuery({
    ...params,
    keywords,
    page,
    per_page,
    status
  });
  const [consignors, { data: consignor_list, isLoading }] =
    useLazyConsignorsQuery();
  const { data: location_options } = useLocationListAsOptionsQuery({
    per_page: 1000
  });
  const [filter_status, setFilterStatus] = useState('Pending');
  const inputBarcodeRef = useRef();
  const sellerTypeRef = useRef();
  const f_status = useMemo(() => {
    return {
      0: 'Pending',
      1: 'Completed'
    };
  }, []);
  const handleGlobalPaste = async (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text/plain');
    if (remarks_active === 0) {
      setBarcode(pastedText);
      setKeywords(pastedText);
    } else {
      setForm({ ...form, remarks: pastedText });
    }
  };

  const onChangeDebounced = useAsyncDebounce((value) => {
    setKeywords(value);
  }, 1500);

  useEffect(() => {
    if (sadj_id !== undefined && stop === false) {
      getStockAdj(sadj_id);
      setItemLoading(true);
      loadList(sadj_id, startindex);
    } else {
      setStop(true);
    }

    /* eslint-disable */
  }, []);
  useEffect(() => {
    // if (remarks_active === 0) {
    document.addEventListener('paste', handleGlobalPaste);
    // }

    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [remarks_active]);

  useEffect(() => {
    if (!!config_loaded) loadConfig();
  }, [config_data, config_loaded]);

  useEffect(() => {
    inputBarcodeRef.current.focus();
  }, [stop, sadj_id]);

  // useEffect(() => {
  //   if (items_data?.data) {
  //     populateItems(items_data.data, 'old', []);
  //   }
  // }, [items_success, items_data]);

  useEffect(() => {
    if (!!update_success) {
      toast.success(update_data.message, {
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
  }, [update_success, update_data]);

  const handleChangeStatus = (value) => {
    setForm({ ...form, status: value });
    setFilterStatus(f_status[value]);
  };
  const loadList = async (id, skip) => {
    const response = await getList({
      id: id,
      start: skip
    });
    if (response) {
      setItemLoading(false);

      const newVariants = (response?.data?.data || []).map((d, index) => ({
        ...d,
        product_id: d.product_id,
        quantity: d.quantity,
        available_qty: loadOnHandQuantity(
          d.product_variants || [],
          index,
          d.to,
          d.generic_sku
        ),
        remarks: d.remarks,
        title: d.title,
        to: d.to,
        from: d.from,
        hasError: false,
        isCheck: false,
        id: d.id,
        dropdown: d.product_variants || [],
        type: 'old'
      }));

      setLoading(false);
      let index = inputCount + 1;
      setInputCount(index);
      setVariants((prevVariants) => [...prevVariants, ...newVariants]);

      if (
        parseInt(response?.data?.start) <
        parseInt(response?.data?.total_quantity)
      ) {
        setTimeout(
          function () {
            loadList(id, response?.data?.start);
          },

          3000
        );
      }

      //  }
    }
  };
  const handleSynctoCM = () => {
    setForm({ ...form, sync_to_cm: !form.sync_to_cm });
  };

  const handleDateChange = (selectedDates, dateStr, instance) => {
    setSelectedDate(dateStr);
  };

  const toggle = () => setTooltipOpen(!tooltipOpen);

  const handleChangeSellerType = (e) => {
    const tempVal = e.target.value;
    let newArray = tempVal.split('_');
    setSellerType(parseInt(newArray[0]));
    setKeywords2('');
    if (parseInt(newArray[1]) === 1) {
      setForm({
        ...form,
        consignor_id: default_consignor.defaultuser?.id,
        consignor_name: default_consignor.defaultuser?.name,
        seller_type: newArray[0]
      });
      setKeywords2(default_consignor.defaultuser.name);
    } else {
      setForm({
        ...form,
        seller_type: newArray[0],
        consignor_id: '',
        consignor_name: ''
      });
    }
  };

  const handleSearchConsignor = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (form.seller_type === 2 || form.seller_type === 3) {
        setConsignorModal(true);
        searchConsignor();
      }
    }
  };
  const handleBtnSearchConsignor = async (e) => {
    if (sellertype > 1) {
      await setConsignorModal(true);
      setKeywords2('');
      await searchConsignor();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      searchBarcode();
    }
  };

  const handleKeyDown2 = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      searchConsignor();
    }
  };

  const handleToggleVisibility = (e, prod) => {
    setIsVisible(!isVisible);
  };

  const viewItem = async (e) => {
    setIsVisible(!isVisible);
  };

  const populateItems = useCallback(
    (data, type, cmb) => {
      const newVariants = (data || []).map((d, index) => ({
        ...d,
        product_id: type === 'new' ? d.product?.reference : d.product_id,
        quantity: type === 'new' ? 0 : d.quantity,
        available_qty:
          type === 'new'
            ? ''
            : loadOnHandQuantity(
                d.product_variants || [],
                index,
                d.to,
                d.generic_sku
              ),
        remarks: type === 'new' ? '' : d.remarks,
        title: type === 'new' ? d.product?.title : d.title,
        to: type === 'new' ? 0 : d.to,
        from: type === 'new' ? 0 : d.from,
        hasError: false,
        isCheck: false,
        id: type === 'new' ? 0 : d.id,
        dropdown: d.product_variants || [],
        type: type
      }));

      if (selected_variants.length === 0) {
        setLoading(false);
        let index = inputCount + 1;
        setInputCount(index);
        setVariants(newVariants);
      } else {
        let index = inputCount + 1;
        setInputCount(index);
        setLoading(false);
        setVariants((prevVariants) => [...prevVariants, ...newVariants]);
      }
    },
    [inputCount, selected_variants]
  );

  const populateItems3 = useCallback(
    (data, type, cmb) => {
      const newVariants = (data || []).map((d, index) => ({
        ...d,
        product_id: d.product_id,
        quantity: d.quantity,
        available_qty: loadOnHandQuantity(
          d.product_variants || [],
          index,
          d.to,
          d.generic_sku
        ),
        remarks: d.remarks,
        title: d.title,
        to: d.to,
        from: d.from,
        hasError: false,
        isCheck: false,
        id: d.id,
        dropdown: d.product_variants || [],
        type: type
      }));

      if (selected_variants.length === 0) {
        setLoading(false);
        let index = inputCount + 1;
        setInputCount(index);
        setVariants(newVariants);
      } else {
        let index = inputCount + 1;
        setInputCount(index);
        setLoading(false);
        setVariants((prevVariants) => [...prevVariants, ...newVariants]);
      }
    },
    [inputCount, selected_variants]
  );

  const getStockAdj = useCallback(
    async (id) => {
      const { data, isSuccess } = await getsingle({ id: id });
      if (isSuccess) {
        if (data.status === 1) {
          setLocked(true);
        } else {
          setLocked(false);
        }
        if (data?.reference?.includes('STAKE-')) {
          setStockTake(1);
        } else {
          setStockTake(0);
        }
        setFilterStatus(f_status[data.status]);

        setKeywords2(data?.consignor_name);

        setSellerType(data?.seller_type);

        setForm({
          ...form,
          ...data,
          transaction_date: new Date(data.transaction_date)
        });

        setStop(true);
      }
    },
    /* eslint-disable */
    [setFilterStatus, populateItems, getsingle, f_status, setForm, form]
  );

  const loadVariants = async (sku = '') => {
    const { data, isSuccess } = await variants({
      keywords: sku,
      consignor_id: form.consignor_id
    });

    setLoading(true);
    setKeywords(barcode);
    if (isSuccess) {
      if (data.dropdown.length > 0) {
        populateItems(data.list.data, 'new', []);
      }
      if (data.list.data.length < 1) {
        setShowModal(true);
      }
    }
  };
  const loadConfig = async () => {
    if (!default_consignor.length) {
      const data_value = config_data.DEFAULT_SELLER_FOR_INVENTORY || '';

      let res = JSON.parse(data_value);
      if (res.id) {
        if (!!data_value) {
          setDefaultConsignor({ defaultuser: res });
          if (sadj_id === undefined) {
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
  };

  const loadOnHandQuantity = (objects, index, location, generic_sku) => {
    if (objects.length > 0) {
      let qtySum = (objects || [])
        .filter((item) => {
          return (
            String(item.generic_sku) === String(generic_sku) &&
            parseInt(item.location) === parseInt(location)
          );
        })
        .map((item) => item.quantity)
        .reduce((acc, cur) => acc + cur, 0);
      return qtySum;
    } else return '';
  };
  const toggleViewLog = () => {
    setModalLogs(!modalLogs);
  };
  const handleViewLog = async (e, obj) => {
    setSelectedItem(obj);
    setLogsLoading(true);
    const { data, isSuccess } = await getlogs({ id: obj.id });
    if (isSuccess) {
      setLogsLoading(false);
      setLogs(data);
    }
    setModalLogs(true);
  };
  const handleVariantChanges = (i, type, params = []) => {
    setVariants((prevVariants) => {
      const id = i.target.id.split('_');
      const index = id[1];

      if (index !== -1) {
        const updatedVariants = [...prevVariants];
        if (type === 'quantity') {
          const value = i.target.value.replace(/[^-0-9]/g, '');
          updatedVariants[index] = {
            ...updatedVariants[index],
            quantity: value,
            touch: true
          };
        }
        if (type === 'remarks') {
          updatedVariants[index] = {
            ...updatedVariants[index],
            remarks: i.target.value,
            touch: true
          };
        }
        if (type === 'physical_count') {
          updatedVariants[index] = {
            ...updatedVariants[index],
            physical_count: i.target.value,
            touch: true
          };
        }

        return updatedVariants;
      }

      return prevVariants;
    });
  };

  const handleLocationOnChange = (e, i, name) => {
    setVariants((prev_selected_variants) => {
      const new_variants = [...prev_selected_variants];

      new_variants[i] = { ...new_variants[i], [name]: e.target.value };

      return [...new_variants];
    });
  };
  const handleBlur = () => {
    setRemarksActive(0);
  };

  const handleFocus = () => {
    setRemarksActive(5);
  };

  const populateItems2 = async (d) => {
    setBarcode(d.generic_sku);
    loadVariants(d.generic_sku);
  };

  const searchProduct = async () => {
    const datas = await list({ keywords: keywords });

    if (datas.data) {
      setResults(datas.data.data);
      setIsVisible(true);
    }
  };

  const searchConsignor = async () => {
    setLoading(true);
    setConsignors([]);
    const datas = await consignors({
      keywords: keywords2,
      seller_type: sellertype
    });

    if (datas.data) {
      setLoading(false);

      setConsignors(datas.data);
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

  const searchBarcode = async () => {
    if (barcode === undefined || barcode === '' || barcode.trim() === '') {
      searchProduct();
      setShowModal(true);
    } else {
      loadVariants(barcode);
    }
  };

  const selectedConsignor = async (jsondata) => {
    setKeywords2(jsondata.first_name + ' ' + jsondata.last_name);
    setForm({
      ...form,
      consignor_id: jsondata.id,
      consignor_name: jsondata.first_name + ' ' + jsondata.last_name
    });
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
      if (obj.to === obj.from && obj.to === 0) {
        error = 1;
        return { ...obj, hasError: true, isCheck: false };
      }
      if (obj.to === obj.from) {
        error = 1;
        return { ...obj, hasError: true, isCheck: false };
      }
      if (obj.from !== 0 && obj.to === 0) {
        error = 1;
        return { ...obj, hasError: true, isCheck: false };
      } else {
        return { ...obj, hasError: false, isCheck: true };
      }
    });

    setVariants(updatedArray);

    // if (keywords2 === '' || (!form.consignor_id && form.seller_type !== 0)) {
    //   error = 2;
    //   toast.error('Please select consignor first', {
    //     position: 'top-right',
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: 'light'
    //   });

    //   setButtonDisabled(false);
    // }
    if (error === 1) {
      setButtonDisabled(false);
      toast.error('Destination location is required.', {
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

    if (error === 0) {
      let sync = !!form.sync_to_cm ? 1 : 0;

      let updateStatus = { ...form, isSync: sync };

      if (selectedDate !== undefined) {
        updateStatus.transaction_date = selectedDate;
      }

      if (deleteList.length > 0) {
        updateStatus.delete = deleteList;
      }

      if (updateStatus.transaction_no === '') {
        response = await stockadjustmentcreate(updateStatus);

        if (response.data) {
          await saveItems(
            updatedArray,
            response.data.transaction_no,
            updateStatus.status,
            updateStatus.remarks
          );
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
        if (updateStatus.status === 0) {
          await saveItems(
            updatedArray,
            updateStatus.transaction_no,
            updateStatus.status,
            updateStatus.remarks
          );
        }
        await stockadjustmentupdate({
          id: updateStatus.id,
          seller_type: updateStatus.seller_type,
          sync_to_cm: updateStatus.sync_to_cm,
          status: updateStatus.status,
          transaction_no: updateStatus.transaction_no,
          remarks: updateStatus.remarks,
          consignor_id: updateStatus.consignor_id,
          consignor_name: updateStatus.consignor_name,
          transaction_date: updateStatus.transaction_date
        });
        if (updateStatus.status === 0) {
          setButtonDisabled(false);
        }
      }
    }
  };

  const saveItems = async (updated_array, transaction_no, status, remarks) => {
    const promises = [];
    let found = 0;
    for (
      let i = 0, pages = updated_array.length / XHR_MAX_ITEMS_PER_REQUEST;
      i < pages;
      i++
    ) {
      const start = i * XHR_MAX_ITEMS_PER_REQUEST;
      found = 1;
      let end =
        start +
        (i === pages - 1
          ? updated_array.length % XHR_MAX_ITEMS_PER_REQUEST
          : XHR_MAX_ITEMS_PER_REQUEST);

      const entry = updated_array.slice(start, end).map((x) => ({
        from: x.from,
        to: x.to,
        generic_sku: x.generic_sku,
        physical_count: x.physical_count,
        id: x.id,
        product_id: x.product_id,
        quantity: x.quantity !== null ? x.quantity : '0',
        remarks: x.remarks
      }));

      promises.push(
        saveSADJItems({
          status: status,
          transaction_no: transaction_no,
          remarks: remarks,
          entry,
          delete: deleteList
        })
      );
    }
    if (found === 0 && deleteList.length > 0) {
      promises.push(
        saveSADJItems({
          status: status,
          transaction_no: transaction_no,
          remarks: remarks,
          entry: [],
          delete: deleteList
        })
      );
    }
  };

  document.title = `${
    !!sadj_id ? 'Edit' : 'Create'
  } Stock Adjustments | UN IMS`;

  return (
    <div className="page-content" id="AddProduct">
      <FPLoader open={single_data_loading} />
      <SyncLogsModal
        modalLogs={modalLogs}
        selectedItem={selectedItem}
        logs={logs}
        toggleViewLog={toggleViewLog}
      />
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
      <ConsignorSearchModal
        show={showConsignor}
        data={consignorList}
        selectedConsignor={selectedConsignor}
        keywords={keywords2}
        seller_type={form.seller_type || ''}
        viewItem={viewItem}
        handleKeyDown2={handleKeyDown2}
        loading={loading}
        handleChangeValue={setKeywords2}
        onClickSearch={searchConsignor}
        onCloseClick={() => setConsignorModal(false)}
      />
      <Container fluid>
        <BreadCrumb
          title={
            !!sadj_id ? 'STOCK ADJUSTMENT - UPDATE' : 'NEW STOCK ADJUSTMENT'
          }
          pageTitle="Create Stock Adjustment"
        >
          {is_completed && (
            <Col lg={6} className="mb-3">
              <h6 className=" text-start">
                {single_data.status === 1 &&
                ((progress_data?.in_progress || 0) /
                  (progress_data?.all || 0)) *
                  100 >=
                  100
                  ? 'Completed'
                  : 'Processing...'}
              </h6>
              <Progress
                animated
                color="info"
                value={
                  ((progress_data?.in_progress || 0) /
                    (progress_data?.all || 0)) *
                  100
                }
              >
                {`${progress_data?.in_progress || 0} / ${
                  progress_data?.all || 0
                }`}
              </Progress>
            </Col>
          )}
          <div className="text-end">
            <ButtonGroup className="material-shadow me-2">
              <UncontrolledDropdown disabled={locked || is_completed}>
                <DropdownToggle
                  tag="button"
                  disabled={locked || form.transaction_no === ''}
                  className="btn btn-light material-shadow-none"
                >
                  {filter_status || 'Pending'}{' '}
                  <i className="mdi mdi-chevron-down"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      handleChangeStatus(1);
                    }}
                  >
                    Completed
                  </DropdownItem>

                  {sadj_id !== undefined && (
                    <DropdownItem
                      onClick={() => {
                        handleChangeStatus(0);
                      }}
                    >
                      Pending
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
                onClick={handleSubmit}
              >
                Save
              </button>
            }
            <Link to="/app/sadj" className="btn w-sm" color="light">
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
                      {form?.reference?.includes('STAKE-') && (
                        <Alert
                          color="secondary"
                          closeClassName={'visually-hidden'}
                          className="alert alert-warning alert-dismissible fade show"
                        >
                          This Stock Adjustment was automatically generated from
                          Stocktake <strong>{form.reference}.</strong> Please
                          review all items and its Adjust QTY prior completing
                        </Alert>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={2} md={6} className="mb-2">
                    <BInput
                      label="Transaction No."
                      placeholder="System Generated"
                      value={form.transaction_no}
                      readOnly="readonly"
                    />
                  </Col>
                  <Col lg={2} md={6} className="mb-2">
                    <Label htmlFor="transaction_date" className="form-label">
                      Transaction Date
                    </Label>
                    {sadj_id !== undefined && form.status === 1 && (
                      <Flatpickr
                        value={new Date(form.transaction_date)}
                        //onChange={handleDateChange}

                        className="form-control"
                        disabled={true}
                        options={{
                          minDate: sadj_id === undefined && 'today',
                          dateFormat: 'Y-m-d'
                        }}
                      />
                    )}
                    {form.status === 0 && (
                      <Flatpickr
                        value={new Date(form.transaction_date)}
                        //onChange={handleDateChange}
                        onChange={(date) => {
                          const value = date[0];
                          setSelectedDate(value);
                          setForm({ ...form, transaction_date: value });
                        }}
                        className="form-control"
                        disabled={sadj_id !== undefined && form.status === 1}
                        options={{
                          minDate: sadj_id === undefined && 'today',
                          dateFormat: 'Y-m-d'
                        }}
                      />
                    )}
                  </Col>
                  <Col lg={2} md={6} className="mb-2">
                    {isStake === 1 ? (
                      <>
                        <Label
                          htmlFor="transaction_date"
                          className="form-label"
                        >
                          Reference
                        </Label>
                        <div
                          style={{
                            height: '60px',
                            width: 'auto',
                            overflow: 'auto'
                          }}
                          className={'form-control'}
                        >
                          {form.reference
                            .split(';')
                            .filter((tag) => tag)
                            .map((t, i) => (
                              <span
                                key={i + t}
                                className="badge bg-info"
                                style={{
                                  marginRight: '3px',
                                  position: 'relative'
                                }}
                              >
                                {t}
                              </span>
                            ))}
                        </div>
                      </>
                    ) : (
                      <BInput
                        label="Reference"
                        placeholder="Reference"
                        disabled={is_completed}
                        value={form.reference}
                        onChange={(e) =>
                          setForm({ ...form, reference: e.target.value })
                        }
                      />
                    )}
                  </Col>
                  <Col lg={2} md={6} className="mb-2">
                    <Label htmlFor="seller_type" className="form-label">
                      Seller Types
                    </Label>
                    <select
                      ref={sellerTypeRef}
                      className="form-select"
                      name="seller_type"
                      id="seller_type"
                      onChange={(e) => handleChangeSellerType(e)}
                      disabled={is_completed}
                    >
                      {form?.seller_type === 0 && <option value="0_0"></option>}
                      {seller_type?.data &&
                        seller_type.data.map((item) => {
                          const shouldRender =
                            sadj_id === undefined
                              ? item.track_inventory === 1 ||
                                item.track_inventory < 1
                              : item.id === form.seller_type;

                          if (shouldRender) {
                            return (
                              <option
                                key={item.id}
                                value={item.id + '_' + item.track_inventory}
                                selected={item.id === form.seller_type}
                              >
                                {item.name}
                              </option>
                            );
                          }

                          return (
                            <option
                              key={item.id}
                              value={item.id + '_' + item.track_inventory}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      {form?.seller_type > 0 ? (
                        <option value="0_0"></option>
                      ) : (
                        <option value="0_0"></option>
                      )}
                    </select>
                  </Col>
                  <Col lg={4} md={12} className="mb-2">
                    <label>&nbsp;</label>
                    <div className="input-group flex-nowrap  mb-1">
                      <span className="input-group-text" id="addon-wrapping">
                        <i className="ri-user-2-fill align-bottom me-1"></i>
                      </span>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Enter firstname,lastname or email"
                        aria-label="Username"
                        disabled={true}
                        aria-describedby="addon-wrapping"
                        onChange={(e) => setKeywords2(e.target.value)}
                        value={keywords2}
                      />
                      <button
                        type="button"
                        disabled={form.status === 1}
                        className="btn btn-success w-sm  "
                        onClick={handleBtnSearchConsignor}
                      >
                        <i className=" ri-search-2-line align-bottom me-1"></i>
                      </button>{' '}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <BInput
                      style={{ height: '17px' }}
                      type="textarea"
                      label="Remarks"
                      placeholder="Remarks"
                      disabled={is_completed}
                      value={form.remarks}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onChange={(e) =>
                        setForm({ ...form, remarks: e.target.value })
                      }
                    />
                  </Col>
                  <Col lg={2} className="mt-4">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="sync_to_cm"
                      onChange={handleSynctoCM}
                      checked={form.sync_to_cm}
                      disabled={is_completed}
                    />
                    <Label className="form-check-label ms-1" for="sync_to_cm">
                      Sync to CM Admin
                    </Label>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Card
              className={`items-card position-relative ${
                items_loading && !single_data_loading ? 'opacity-50' : ''
              }`}
            >
              {items_loading && !single_data_loading && (
                <div className="d-flex justify-content-center align-items-center items-table-loading">
                  <Spinner color="primary" size="lg">
                    Loading...
                  </Spinner>
                </div>
              )}
              <CardBody className="">
                <Row>
                  <Col lg={6}>
                    <div className="input-group flex-nowrap  mb-1">
                      <span className="input-group-text" id="addon-wrapping">
                        <i className=" ri-barcode-line align-bottom me-1"></i>
                      </span>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Scan Barcode to add"
                        aria-label="Username"
                        value={barcode || ''}
                        aria-describedby="addon-wrapping"
                        ref={inputBarcodeRef}
                        autoFocus
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={items_loading}
                      />
                      <button
                        type="button"
                        className="btn btn-success w-sm  me-2"
                        onClick={searchBarcode}
                      >
                        <i className=" ri-search-2-line align-bottom me-1"></i>
                        {loading ? 'Loading...' : 'Browse Product'}
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
                            <th scope="col">Product</th>
                            <th scope="col" className="text-center">
                              From
                            </th>
                            <th scope="col" className="text-center">
                              To
                            </th>
                            {isStake === 0 ? (
                              <th
                                scope="col"
                                className="text-center"
                                style={{ width: '80px' }}
                              >
                                <span>
                                  <Tooltip
                                    placement="bottom"
                                    isOpen={tooltipOpen}
                                    target="tooltip_info"
                                    toggle={toggle}
                                  >
                                    {
                                      'The value for Adjust Qty will be added or deducted to the On Hand Qty'
                                    }
                                  </Tooltip>
                                  <span>Adjust Qty </span>
                                  <span>
                                    <Link
                                      id="tooltip_info"
                                      style={{ position: 'relative' }}
                                    >
                                      <i className=" ri-question-line align-middle fs-12"></i>
                                    </Link>
                                  </span>
                                </span>
                              </th>
                            ) : (
                              <th scope="col" className="text-center">
                                {' '}
                                <span>Physical Count</span>
                              </th>
                            )}
                            <th scope="col" className="text-center">
                              {isStake === 0 ? 'Remarks' : 'CM QTY'}
                            </th>
                            {isStake === 1 && (
                              <th scope="col" className="text-center">
                                {' '}
                                <span>
                                  CM QTY <br />
                                  Adjustment
                                </span>
                              </th>
                            )}
                            {isStake === 1 && (
                              <th scope="col" className="text-center">
                                {' '}
                                <span>
                                  IMS QTY <br />
                                  Adjustment
                                </span>
                              </th>
                            )}
                            {isStake === 1 && (
                              <th scope="col" className="text-center">
                                {' '}
                                <span>Remarks</span>
                              </th>
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {selected_variants.length > 0 &&
                            selected_variants.map((row, rowIndex) => (
                              <RowItem
                                hasStockTake={isStake}
                                key={rowIndex}
                                row={row}
                                rowIndex={rowIndex}
                                location_options={location_options}
                                is_completed={is_completed}
                                handleViewLog={handleViewLog}
                                handleVariantChanges={handleVariantChanges}
                                handleRemoveExistingItem={
                                  handleRemoveExistingItem
                                }
                                handleRemoveItem={handleRemoveItem}
                                handleLocationOnChange={handleLocationOnChange}
                                logs_loading={logs_loading}
                              />
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

const RowItem = React.memo(
  ({
    hasStockTake,
    row,
    rowIndex,
    location_options,
    handleViewLog,
    handleVariantChanges,
    handleRemoveExistingItem,
    handleRemoveItem,
    handleLocationOnChange,
    is_completed,
    logs_loading,
    ...props
  }) => {
    return (
      <tr
        key={rowIndex}
        className={row.hasError ? 'table-danger' : 'table-light'}
      >
        <td>
          <ProductTitle
            generic_sku={row.generic_sku}
            title={row?.title}
            style={{ maxWidth: '350px' }}
          />
        </td>
        <td>
          <LocationOptions
            id={'from_' + rowIndex}
            value={row.from}
            onChange={(e) => handleLocationOnChange(e, rowIndex, 'from')}
            location_options={location_options}
            disabled_value={row.to}
            disabled={is_completed}
          />
        </td>
        <td>
          <LocationOptions
            id={'to_' + rowIndex}
            value={row.to}
            onChange={(e) => handleLocationOnChange(e, rowIndex, 'to')}
            location_options={location_options}
            disabled_value={row.from}
            disabled={is_completed}
          />
        </td>
        <td>
          {hasStockTake === 0 && (
            <input
              type="text"
              className="form-control text-center "
              placeholder="Qty"
              id={'qty_' + rowIndex}
              onChange={(e) => handleVariantChanges(e, 'quantity')}
              value={row.quantity || ''}
              aria-describedby="addon-wrapping"
              disabled={is_completed}
            />
          )}
          {hasStockTake === 1 && (
            <div className="d-flex flex-row justify-content-center">
              <input
                type="text"
                className="form-control text-center "
                id={'qty_' + rowIndex}
                value={row.physical_count || ''}
                onChange={(e) => handleVariantChanges(e, 'physical_count')}
                aria-describedby="addon-wrapping"
                disabled={is_completed}
              />
            </div>
          )}
        </td>
        <td>
          <div className="d-flex flex-row justify-content-center">
            {hasStockTake === 0 && (
              <input
                type="text"
                className="form-control"
                style={{ minWidth: '200px' }}
                placeholder="Remarks"
                id={'remarks_' + rowIndex}
                value={row.remarks || ''}
                onChange={(e) => handleVariantChanges(e, 'remarks')}
                aria-describedby="addon-wrapping"
                disabled={is_completed}
              />
            )}
            {hasStockTake === 1 && (
              <div className="row">
                <div className="col-sm-9">
                  <input
                    type="text"
                    style={{ Width: '50px' }}
                    className="form-control text-center"
                    id={'cm_' + rowIndex}
                    value={row?.cm_quantity}
                  />
                </div>
                <div className="col-sm-3">
                  <Button
                    size="sm"
                    color="primary"
                    className="btn-icon rounded-pill"
                    onClick={(e) => handleViewLog(e, row)}
                  >
                    {logs_loading === true ? (
                      <Spinner size="sm" className="flex-shrink-0">
                        {' '}
                        Loading...{' '}
                      </Spinner>
                    ) : (
                      <i className=" ri-file-text-line" color="primary" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </td>
        {hasStockTake === 1 && (
          <td>
            <input
              type="text"
              className="form-control text-center "
              id={'remarks_' + rowIndex}
              value={row?.cm_qty_adjustment}
              aria-describedby="addon-wrapping"
              disabled={true}
            />
          </td>
        )}
        {hasStockTake === 1 && (
          <td>
            <input
              type="text"
              className="form-control text-center "
              id={'remarks_' + rowIndex}
              value={row.ims_qty_adjustment}
              aria-describedby="addon-wrapping"
              disabled={true}
            />
          </td>
        )}
        <td>
          <div className="d-flex flex-row justify-content-center">
            {row.id > 0 ? (
              <Link
                className="link-danger"
                onClick={(e) => handleRemoveExistingItem(e, row.id, rowIndex)}
              >
                <i className="ri-delete-bin-5-line align-middle fs-22"></i>
              </Link>
            ) : (
              <Link
                className="link-danger"
                onClick={(e) => handleRemoveItem(e, rowIndex)}
              >
                <i className="ri-delete-bin-5-line align-middle fs-22"></i>
              </Link>
            )}
          </div>
        </td>
      </tr>
    );
  },
  (pp, cp) => pp == cp && cp.is_completed === pp.is_completed
);
const SyncLogsModal = React.memo(
  ({ modalLogs, selectedItem, logs, toggleViewLog, ...props }) => {
    const close = () => {
      toggleViewLog();
    };
    return (
      <BModal
        show={modalLogs}
        title={
          'Item Sync Logs for: ' +
          selectedItem?.title +
          ' |  ' +
          selectedItem?.generic_sku
        }
        onCloseClick={() => close()}
        id="ViewLedger"
        classes={{
          body: 'p-0',
          container: 'ledger-modal',
          footer: 'pb-0 pt-0 justify-content-start'
        }}
        size="xl"
        scrollable
        centered
      >
        <div
          className="table-responsive col-xl-12"
          style={{ marginLeft: '2px' }}
        >
          <table className=" table table-striped table-nowrap align-middle mb-0 ">
            <thead>
              <tr>
                <th scope="col">SKU</th>
                <th scope="col">Status</th>
                <th scope="col">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {logs?.length > 0 &&
                logs.map((item) => (
                  <tr>
                    <td>{item.sku}</td>
                    <td>
                      {item.status === 1 ? (
                        <span className="badge bg-success">Accepted</span>
                      ) : (
                        <span className="badge bg-danger">Pending</span>
                      )}
                    </td>
                    <td>
                      {selectedItem?.cm_qty_adjustment > 0 ? '+' : '-'}
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              {logs?.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <center>No Logs Found...</center>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </BModal>
    );
  }
);
const LocationOptions = React.memo(
  ({ location_options, disabled_value, ...props }) => {
    return (
      <select className="form-select" {...props}>
        <option value={0}></option>
        {location_options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={disabled_value == option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  },
  (p, c) =>
    p.disabled_value === c.disabled_value &&
    p.value === c.value &&
    p.disabled === c.disabled
);

export default AddStockAdjustment;
