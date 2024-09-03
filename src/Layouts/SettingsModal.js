import react, { useEffect, useRef, useState } from 'react';
import BModal from '../Components/Common/Modal';
import {
  ButtonGroup,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  ModalFooter,
  Row,
  UncontrolledDropdown
} from 'reactstrap';
import { STOCK_QUANTITY_OPTIONS } from '../common/constants/options';
import { useDispatch } from 'react-redux';
import { setAndClose, setSellerType, toggleShow } from '../store/slice/config';
import { useSelector } from 'react-redux';
import BInput from '../Components/Common/BInput';

const SettingsModal = (props) => {
  const config = useSelector((store) => store.config);
  const dispatch = useDispatch();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!!config.show) {
      setForm({ ...config });
    } else {
      setForm({});
    }
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(setAndClose({ seller_type: form.seller_type }));
  };

  return (
    <BModal
      show={config.show}
      title="Settings"
      onCloseClick={() => dispatch(toggleShow(false))}
      id="Settings"
      classes={{ modal_content: 'h-75' }}
      scrollable
      centered
      footer={
        <div className="hstack gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => dispatch(toggleShow(false))}
          >
            {' '}
            Close{' '}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            {' '}
            Save{' '}
          </button>
        </div>
      }
    >
      <div>
        <Row>
          <Col lg={6}>
            <div className="mb-3">
              <Label htmlFor="firstnameInput" className="form-label">
                Seller Type
              </Label>
              <BInput
                name="status"
                type="select"
                className="form-select"
                id="status-field"
                onChange={(e) =>
                  setForm({ ...form, seller_type: +e.target.value })
                }
                value={form.seller_type || 1}
              >
                {STOCK_QUANTITY_OPTIONS.filter((f) => f.type !== 'divider').map(
                  (item, key) => (
                    <option value={item.value} key={key}>
                      {item.label}
                    </option>
                  )
                )}
              </BInput>
            </div>
          </Col>
        </Row>
      </div>
    </BModal>
  );
};

export default SettingsModal;
