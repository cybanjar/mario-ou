<template>
  <SInput
    v-bind="attrs"
    v-on="pListeners"
    :mask="mask"
    :value="fValue"
    @focus="() => $refs.qDateProxy.show()"
    @input="iInput"
  >
    <template #append>
      <q-icon name="mdi-calendar" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            :value="fValue"
            :options="options"
            @input="iInput"
            mask="DD/MM/YYYY"
          >
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
import { defineComponent, computed, ref } from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  inheritAttrs: true,
  props: {
    value: { type: [Date, String], required: true },
    format: { type: String, required: false, default: 'DD/MM/YYYY' },
    options: { type: [Array, Function], required: false },
  },
  computed: {
    attrs() {
      const { value, ...pAttrs } = (this as any).$attrs;
      return pAttrs;
    },
  },
  setup(props, { listeners }) {
    const { input, ...pListeners } = listeners;
    const qDateProxy = ref();

    const fValue = computed(() => {
      return date.formatDate(props.value, props.format);
    });

    const mask = props.format.replace(/\w/g, '#');

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
      pListeners,
      qDateProxy,
      dateRule,
      mask,
    };
  },
});
</script>
