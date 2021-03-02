import { SelectItem } from '~/app/shared/models/select.model';

export const mapWithBezeich = (items, field): SelectItem[] =>
  mapWithField(items, field, 'bezeich');

export const mapWithField = (items, field, label?): SelectItem[] =>
  items
    ? items.map((item) => ({
        label: label
          ? `${item[field]} - ${getValue(item, label, '')}`
          : `${item[field]}`,
        value: getValue(item, field),
      }))
    : [];

const getValue = (item, field, fallback?) => {
  return field && item?.[field] ? item?.[field] : fallback;
};
export const mapLabelPrefixBezeich = (
  items: any[],
  prefix: string
): SelectItem[] =>
  items.map((item) => ({
    label: `${item[prefix]} - ${item.bezeich}`,
    value: item.bezeich,
  }));

export const mapSelectItems = (
  items: any[],
  valueKey: string,
  prefixKey?: string
): SelectItem[] =>
  items.map((item) => {
    let label = prefixKey ? `${item[prefixKey]} - ` : '';
    label += item[valueKey];

    return {
      label,
      value: item[valueKey],
    };
  });

export const mapWithadjustmain = (items, prefix) =>
  items
    ? items.map((item) => ({
        label: `${item[prefix]} - ${item.bezeich}`,
        value: item.endkum,
      }))
    : [];

export const mapWithadjuststore = (items, prefix) =>
  items
    ? items.map((item) => ({
        label: `${item[prefix]} - ${item.bezeich}`,
        value: item['lager-nr'],
      }))
    : [];

export const mapWithPrefix = (items, prefix): SelectItem[] =>
  items
    ? items.map((item) => ({
        label: `${item[prefix]} - ${item.bezeich}`,
        value: item[prefix],
      }))
    : [];

export const mapWithMeal = (items, prefix) =>
  items
    ? items.map((item) => ({
        label: `${item[prefix]} - ${item.depart}`,
        value: item.num,
      }))
    : [];
export const mapBaseDropdown = (
  items: any[],
  valueKey: string,
  labelKey: string
) =>
  items.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));

  export const mapWithNum = (items, prefix): SelectItem[] =>
  items
    ? items.map((item) => ({
        label: `${item.num} - ${item[prefix]}`,
        value: item.num,
      }))
    : [];

export const mapGroup = (items, name, prefix) =>
    items
      ? items.map((item) => ({ 
        label: `${item[prefix]}-${item[name]}`, 
        value: item[prefix] 
      }))
      : [];

export const mapOU = (items, prefix, name) =>
  items
    ? items.map((item) => ({
      label: `${item[prefix]} - ${item[name]}`,
      value: item[prefix],
    }))
    : [];
export const mapOU3Label = (items, prefix, name1, name2, name3) =>
  items
    ? items.map((item) => ({
      label: `${item[name1]} - ${item[name2]} - ${item[name3]}`,
      value: item[prefix],
    }))
    : [];

export const mapOU4Label = (items, prefix, name1, name2, name3, name4) =>
  items
    ? items.map((item) => ({
      label: `${item[name1]} - ${item[name2]} - ${item[name3]} - ${item[name4]}`,
      value: item[prefix],
    }))
    : [];