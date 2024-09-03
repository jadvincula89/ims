export const getLocationNameByReference = (reference, list = []) => {
  if (!list?.length) return '';
  /* eslint-disable */
  const filter_location = (list || []).filter(
    (ld) => ld.reference == reference
  );

  if (!filter_location.length) return '';

  return filter_location[0].name;
};

export const getLocationById = (id, list = []) => {
  if (!list?.length) return '';
  /* eslint-disable */
  const filter_location = (list || []).filter((ld) => ld.id == id);

  if (!filter_location.length) return undefined;

  return filter_location[0];
};

export const getConditionNameByReference = (reference, list = []) => {
  if (!list?.length) return '';
  /* eslint-disable */
  const filter_condition = (list || []).filter(
    (ld) => ld.reference == reference
  );

  if (!filter_condition.length) return '';

  return filter_condition[0].name;
};

export const getConditionNameByID = (id, list = []) => {
  if (!list?.length) return '';
  /* eslint-disable */
  const filter_condition = (list || []).filter((ld) => ld.id == id);

  if (!filter_condition.length) return '';

  return filter_condition[0].name;
};

export const getTransactionType = (type) => {};

export const genericSKUBreakdown = (generic_sku) => {
  const pattern = /^UN(\d+)-(\w+|\d+)(BN|MA|RB|FW)$/gi;
  const matches = [...generic_sku.matchAll(pattern)]['0'];

  if (!matches) return false;

  return {
    shopify_id: matches[1],
    size: matches[2].replace('D', '.'),
    condition: matches[3]
  };
};

export const getItemById = (id, list = []) => {
  if (!list?.length) return '';
  /* eslint-disable */
  const filter = (list || []).filter((ld) => ld.value == id);

  if (!filter.length) return undefined;

  return filter[0];
};
