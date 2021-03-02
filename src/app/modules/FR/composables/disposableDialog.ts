import { reactive, UnwrapRef } from '@vue/composition-api';

interface DefaultState {
  show: boolean;
  key: string;
}

type WithDataState<T> = DefaultState & { data: T };

interface WithDataDisposableDialog<T> {
  state: UnwrapRef<WithDataState<T>>;
  open: (data: UnwrapRef<T>) => void;
}

interface NoDataDisposableDialog {
  state: UnwrapRef<DefaultState>;
  open: () => void;
}

/**
 * Overload #1: Disposable dialog without data getter setter.
 *
 * Use this overload when you don't need to pass data, or when using your own logic for the data.
 */
export function useDisposableDialog(): NoDataDisposableDialog;

/**
 * Overload #2: Disposable dialog with initial data and getter setter for the data.
 *
 * Use this overload when you need to pass data. It supports any data types that are supported by Vue's Reactivity.
 */
export function useDisposableDialog<T>(
  initialData: T
): WithDataDisposableDialog<T>;

export function useDisposableDialog<T>(initialData?: T) {
  // Need to specify the undefined checker, because null value is valid initialData.
  if (initialData !== undefined) {
    const state = reactive<WithDataState<T>>({
      show: false,
      key: generateRandomKey(),
      data: initialData,
    });
    const open = (newData: UnwrapRef<T>) => {
      state.data = newData;
      state.key = generateRandomKey();
      state.show = true;
    };
    return { state, open };
  } else {
    const state = reactive<DefaultState>({
      show: false,
      key: generateRandomKey(),
    });
    const open = () => {
      state.key = generateRandomKey();
      state.show = true;
    };
    return { state, open };
  }
}

// Ref: https://gist.github.com/gordonbrander/2230317#gistcomment-2362659
function generateRandomKey() {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);

  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
  }
  return str;
}
