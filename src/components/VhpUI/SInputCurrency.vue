<template>
  <div>
    <label v-if="labelText" class="inline-block q-mb-xs">
      {{ labelText }}
    </label>
    <q-input
      dense
      outlined
      :value="formattedValue"
      @input="onInput"
      @onChange="onChange"
      :class="inputClasses"
      class="s-input currency-input"
      ref="input"
      v-currency="currency"
      :disable="disable"
    >
      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="scope"
      >
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { CurrencyDirective, setValue, getValue } from 'vue-currency-input';

export default Vue.extend({
  name: 'SInputCurrency',
  props: {
    value: { type: String, default: null },
    labelText: { type: String, default: null },
    disable: { type: Boolean, default: false },
    inputClasses: { type: String, default: 'q-mb-md' },
    currency: { type: Object, default: () => ({} as any) },
  },
  directives: {
    currency: CurrencyDirective,
  },
  data() {
    return {
      formattedValue: null,
    };
  },
  watch: {
    value(value) {
      this.setValue(value);
    },
  },
  mounted() {
    this.setValue(this.value);
  },
  methods: {
    setValue(value) {
      setValue(this.$refs.input as HTMLInputElement, value);
    },
    onInput(value) {
      this.$emit('input', getValue(this.$refs.input as HTMLInputElement));
      this.formattedValue = value;
    },
    onChange(value) {
      this.$emit('change', getValue(this.$refs.input as HTMLInputElement));
      this.formattedValue = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.currency-input ::v-deep input {
  text-align: right !important;
}
</style>
