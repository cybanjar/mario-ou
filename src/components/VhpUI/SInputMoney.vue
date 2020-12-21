<template>
  <SInput
    ref="wrapper"
    :value="value"
    :label-text="labelText"
    :input-classes="inputClasses"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from '@vue/composition-api';
import Inputmask from 'inputmask';

/**
 * Insert Mask into input 1 will be masked into 1.00
 */
export default defineComponent({
  props: {
    value: { required: false },
    labelText: { type: String, default: null },
    inputClasses: { type: String, default: 'q-mb-md' },
  },
  setup(props, { emit, listeners: baseListener }) {
    const wrapper = ref();

    onMounted(() => {
      const inputSelector: any = wrapper.value?.$el.querySelector('input');

      Inputmask({
        alias: 'numeric',
        groupSeparator: ',',
        digits: '2',
        positionCaretOnTab: false,
        allowMinus: false,
        unmaskAsNumber: true,
        digitsOptional: true,
        prefix: '',
        placeholder: '0',
        clearMaskOnLostFocus: false,
        oncomplete: () => {
          emit('input', (inputSelector as any).inputmask.unmaskedvalue());
        },
      }).mask(inputSelector);
    });

    const forkListener = computed(() => {
      const { input, ...listeners } = baseListener;
      return listeners;
    });

    return {
      wrapper,
      forkListener,
    };
  },
});
</script>
