export const SELLER_TYPE_LABEL = {
  UN: 'UN',
  NON_UN: 'Non UN',
  ALL: 'All'
};

export const SELLER_TYPE = {
  UN: 1,
  NON_UN: 2,
  ALL: 3
};

export const STOCK_QUANTITY_OPTIONS = [
  { label: SELLER_TYPE_LABEL.UN, value: SELLER_TYPE.UN },
  { label: SELLER_TYPE_LABEL.NON_UN, value: SELLER_TYPE.NON_UN },
  { type: 'divider' },
  { label: SELLER_TYPE_LABEL.ALL, value: SELLER_TYPE.ALL }
];
