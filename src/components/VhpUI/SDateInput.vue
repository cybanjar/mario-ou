<template>
  <SInput
    v-bind="pAttrs"
    v-on="pListeners"
    mask="##/##/####"
    :value="fValue"
    @input="iInput"
  >
    <template v-slot:append>
      <q-icon name="mdi-calendar" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date :value="fValue" @input="iInput" mask="DD/MM/YYYYYY">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </SInput>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  inheritAttrs: true,
  props: {
    value: { type: Date, required: true },
    format: { type: String, required: false, default: 'DD/MM/YYYYYY' },
  },
  setup(props, { attrs, listeners }) {
    const { value, ...pAttrs } = attrs;
    const { input, ...pListeners } = listeners;

    const fValue = computed(() => {
      return date.formatDate(props.value, props.format);
    });

    function isValid(sDate: string): boolean {
      const [day, month, year] = sDate.split('/');

      return date.isValid(`${month}/${day}/${year}`);
    }

    function dateRule(sDate: string): true | string {
      return isValid(sDate) || 'InvalidDate';
    }

    function iInput(params: string) {
      input(date.extractDate(params, props.format));
    }

    return {
      fValue,
      iInput,
      pAttrs,
      pListeners,
      dateRule,
    };
  },
});
</script>
