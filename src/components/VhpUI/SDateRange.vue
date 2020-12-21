<template>
  <SInput
    v-model="displayValue"
    v-bind="$attrs"
    v-on="forkListener"
    :rules="[dateRangeRule]"
    mask="####/##/## - ####/##/##"
    hide-bottom-space
  >
    <template v-slot:append>
      <q-icon name="mdi-calendar" class="cursor-pointer">
        <q-popup-proxy
          ref="popupElRef"
          transition-show="scale"
          transition-hide="scale"
        >
          <div class="row q-px-sm flex-p-center justify-center items-center">
            <div class="col">
              <q-input v-model="afterLabel" borderless :rules="['date']" />
            </div>
            <div class="col-1">-</div>
            <div class="col">
              <q-input v-model="beforeLabel" borderless :rules="['date']" />
            </div>
          </div>
          <q-date v-model="afterLabel" @input="onChange" minimal />
          <q-date @input="handleInput" v-model="beforeLabel" minimal />
        </q-popup-proxy>
      </q-icon>
    </template>
  </SInput>
</template>
<script lang="ts">
import { QPopupProxy, date } from 'quasar';
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed,
} from '@vue/composition-api';

type Range = {
  before: Date;
  after: Date;
};

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: Object as () => Range, required: true },
  },
  setup(props, { emit, listeners }) {
    const { input, ...forkListener } = listeners;
    const state = reactive({
      before: props.value.before,
      after: props.value.after,
    });

    const popupElRef = ref<QPopupProxy>();

    const beforeLabel = computed({
      get: () => date.formatDate(state.before, 'YYYY/MM/DD'),
      set: (val) => (state.before = new Date(val)),
    });
    const afterLabel = computed({
      get: () => date.formatDate(state.after, 'YYYY/MM/DD'),
      set: (val) => (state.after = new Date(val)),
    });

    const displayValue = computed({
      get: () =>
        date.formatDate(state.after, 'YYYY/MM/DD') +
        ' - ' +
        date.formatDate(state.before, 'YYYY/MM/DD'),
      set: (v) => {
        state.before = new Date(v.split(' - ')[1]);
        state.after = new Date(v.split(' - ')[0]);
        onChange();
      },
    });

    const dateRangeRule = (sDate) =>
      /^-?[\d]+\/[0-1]\d\/[0-3]\d\s-\s-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(sDate);

    function handleInput() {
      popupElRef.value?.hide();
      onChange();
    }

    function onChange() {
      const before = new Date(state.before);
      const after = new Date(state.after);
      emit('input', { before, after });
    }

    return {
      ...toRefs(state),
      handleInput,
      forkListener,
      onChange,
      popupElRef,
      displayValue,
      beforeLabel,
      afterLabel,
      dateRangeRule,
    };
  },
});
</script>
