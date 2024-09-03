import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';

const DateRangePicker = ({ placeholder, onChange }) => {
  const dateRangePickerRef = useRef(null);

  useEffect(() => {
    const options = {
      mode: 'range',
      dateFormat: 'M j, Y',
      minDate: new Date(new Date().getFullYear(), 0, 1),
      maxDate: new Date().fp_incr(363),
      onChange: (selectedDates) => {
        if (onChange) {
          onChange(selectedDates);
        }
      }
    };

    const flatpickrInstance = flatpickr(dateRangePickerRef.current, options);

    // Cleanup on component unmount
    return () => {
      flatpickrInstance.destroy();
    };
    /* eslint-disable */
  }, []);

  return (
    <input
      type="text"
      className="form-control"
      id="dateRangePicker"
      placeholder={placeholder || 'Select date range'}
      ref={dateRangePickerRef}
    />
  );
};

export default DateRangePicker;
