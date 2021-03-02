<template>
  <q-dialog
    v-bind="$attrs"
    v-on="$listeners"
    content-class="modal-alert"
    persistent
  >
    <q-card class="ant-modal-body">
      <q-card-section class="row items-center modal-alert-body">
        <div class="row">
          <q-icon
            name="mdi-alert-circle-outline"
            class="modal-alert-body-icon col-0"
          />
          <div class="col-auto row">
            <div v-if="title" class="q-ml-sm modal-alert-body-title col-12">
              {{ title }}
            </div>
            <span class="q-ml-sm col-12">{{ message }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Ok"
          color="primary"
          style=""
          size="md"
          dense
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: true,
  props: {
    message: { type: String, required: true },
    title: { type: String, required: false },
  },
});
</script>
<style lang="scss">
.modal-alert {
  &-body {
    padding: 32px 32px 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    &-icon {
      color: #faad14;
      margin-right: 16px;
      font-size: 22px;
      display: inline-block;
      font-style: normal;
      align-self: start;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    &-title {
      display: block;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      text-transform: capitalize;
      font-size: 16px;
      line-height: 1.4;
    }
  }
}
</style>
