<template>
  <SInput
    v-bind="$attrs"
    :value="value"
    v-on="$listeners"
    hide-bottom-space
    @focus="() => $refs.qDateProxy.show()"
  >
    <template v-slot:append>
      <q-icon name="mdi-clock-outline" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-time with-seconds format24h :value="value" v-on="$listeners">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>
  </SInput>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: true,
  props: {
    value: { type: String, required: true },
  },
});
</script>
<style lang="scss">
.vp-input-limit {
  .q-field__control {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .q-field__after {
    padding: 0 !important;
  }
  .vp-input-hint {
    position: relative;
    padding: 0 11px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
    font-size: 14px;
    text-align: center;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 100%;
  }
}
</style>
