import { ref } from '@vue/composition-api';

// display dialog
export function useDialog(init = false) {
  const status = ref(init);

  function hide() {
    status.value = false;
  }

  function show() {
    status.value = true;
  }

  return {
    status,
    hide,
    show,
  };
}
