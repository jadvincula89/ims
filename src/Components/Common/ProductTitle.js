import React from 'react';

const ProductTitle = ({ title, generic_sku, ...props }) => {
  return (
    <div {...props}>
      <span className="fw-bold">{generic_sku}</span>
      <div className="text-nowrap text-truncate" style={{ fontSize: '12px' }}>
        {title}
      </div>
    </div>
  );
};

export default ProductTitle;
