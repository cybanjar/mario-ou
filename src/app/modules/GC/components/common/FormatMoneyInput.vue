<template>
  <div>
    <div class="label-layout">
      <label v-if="labelText" class="inline-block q-mb-xs">
        {{ labelText }}
      </label>
    </div>
    <q-input
      dense
      outlined
      v-bind="$attrs"
      v-on="$listeners"
      v-model="value"
      @change="onChange"
      class="s-input currency-input"
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
import { defineComponent, watch} from '@vue/composition-api';
export default defineComponent({
  props: {
    value: { type: String, required: true },
    labelText: { type: String, required: true },
    disable: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    function Money( amount, value, decimalCount = 2, thousands = ',',  decimal = '.'){
      
      decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        amount = amount.replace(/,/g,'')
        amount = Math.abs(Number(amount) || 0);
        const i = parseInt(amount.toFixed(decimalCount)).toString();
        const j = i.length > 3 ? i.length % 3 : 0;        
        return (j ? i.substr(0, j) + thousands : '') +
          i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
    }

    watch(() => props.value,
    (value) => {
        props.value = Money(value, 'watch') 
    })

    const onChange = (event) => {
        Money(props.value, 'onChange')
        emit('input', event.target.value);
    };
    return {
        onChange
    }
  },
});
</script>

<style lang="scss" scoped>
.currency-input ::v-deep input {
  text-align: right !important;
}
</style>
