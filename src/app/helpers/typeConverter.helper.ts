/**
 * This function is useful when you need to convert an input value.
 *
 * Even if you're using `v-model.number` and input[type="number"], the value still can be a string.
 *
 * Ref:
 * - https://stackoverflow.com/questions/42111991/validating-input-with-vue-js-what-does-v-model-number-really-mean
 * - https://github.com/vuejs/vue/issues/4742
 *
 * This function is strict, it ALWAYS returns a number. If your value isn't a number, it will return 0.
 */
export function toNumber(val: string | number): number {
  if (typeof val === 'number') return val;

  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

/**
 * This function is useful when you need to convert a string boolean value from API.
 *
 * Sometimes, the API sends a boolean as a string. Eg. "true", "false".
 * We need to be careful when that value from API changes to a real boolean, it will break our typing (and might be our app).
 * This function ensures, even though the API use string or boolean, everything will be working fine.
 *
 * This function is strict, it ALWAYS returns a boolean.
 */
export function toBoolean(val: string | boolean): boolean {
  if (typeof val === 'boolean') return val;

  return val === 'true';
}
