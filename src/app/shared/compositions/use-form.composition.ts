import { reactive, toRaw } from '@vue/composition-api';

const setAll = (obj, val) => Object.keys(obj).forEach((k) => (obj[k] = val));
const setNull = (obj) => setAll(obj, '');
type Validator<T> = (field: T, value: string) => boolean | string;

// eslint-disable-next-line @typescript-eslint/ban-types
export function useForm<T extends object>(
  fields: T,
  requiredFields = [],
  disableFields = [],
  validator: Validator<keyof T>[] = []
) {
  // if ((typeof fields !== 'object' || isReactive(fields)) && fields === null)
  //   throw Error('is not object');
  const formData = reactive({ ...fields });

  function reset(fields) {
    setNull(formData); // reset
    Object.assign(formData, fields); // setup
    Object.assign(validators, initValidator());
  }
  const initValidator = () =>
    Object.keys(fields).reduce((prev, key) => {
      return {
        ...prev,
        [key]: {
          error: false,
          msg: '',
        },
      };
    }, {});
  const validators = reactive(initValidator());
  function setValue(key: keyof T) {
    let error = {
      error: false,
      msg: '',
    };
    return (data: any) => {
      console.log(key, data);
      if (!!~requiredFields.indexOf(key)) {
        if (!data && key !== 'type') {
          error = {
            error: true,
            msg: `${key} is required`,
          };
        } else {
          for (let index = 0; index < validator.length; index++) {
            const verify = validator[index];
            const valid = verify(key, data);

            // not valid
            if (~valid === -1) {
              error = {
                error: true,
                msg: typeof valid === 'string' ? valid : `${key} is not valid`,
              };
              break;
            }
          }
        }
        Object.assign(validators, { [key]: error });
      }
      Object.assign(formData, { [key]: data });
    };
  }

  const toProp = (key, value) => ({
    [key]: {
      attrs: {
        get value() {
          return formData[key];
        },
        set value(data) {
          formData[key] = data;
        },
        error: validators[key].error,
        'error-message': validators[key].msg,
        disable: disableFields.includes(key),
      },
      listeners: {
        input: (value) => setValue(key as keyof T)(value),
        blur: () => setValue(key as keyof T)(formData[key]),
      },
    },
  });

  const buildFields = Object.entries(formData).reduce(
    (prev, [key, value]) => ({
      ...prev,
      ...toProp(key, value),
    }),
    {}
  );

  const setField = (key, value?: string) => {
    const field = buildFields[key];
    field.attrs.value = value || field.attrs.value;
    return field;
  };

  const getFields = () => toRaw(formData);

  return { setField, reset, getFields, formData };
}
