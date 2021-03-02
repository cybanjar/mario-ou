<template>
  <SDialog
    v-bind="$attrs"
    @show="reset(record)"
    content-class="auto-width"
    v-on="$listeners"
  >
    <template #title>{{ name }}</template>
    <template #body>
      <div class="flex vhp-inline-container justify-center">
        <div>
          <div class="vhp-inline-input">
            <div class="col-12">
              <div class="vhp-inline-input">
                <SInput
                  :set="(target = setField('room'))"
                  v-bind="target.attrs"
                  v-on="target.listeners"
                  hide-bottom-space
                  label-text="Room No"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="vhp-inline-input">
                <SDateInput
                  :set="(target = setField('date'))"
                  v-bind="target.attrs"
                  v-on="target.listeners"
                  hide-bottom-space
                  label-text="Date"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="vhp-inline-input">
                <STimeInput
                  :set="(target = setField('time'))"
                  v-bind="target.attrs"
                  v-on="target.listeners"
                  hide-bottom-space
                  label-text="Time"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="vhp-inline-input">
                <SInput
                  :set="(target = setField('remark'))"
                  v-bind="target.attrs"
                  v-on="target.listeners"
                  hide-bottom-space
                  type="textarea"
                  label-text="Remark"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #action-cancel>
      <q-btn label="Cancel" color="primary" flat class="q-mr-sm" />
    </template>
    <template #action-ok>
      <q-btn label="Save" @click="saveData" color="primary" />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useForm } from '~/app/shared/compositions/use-form.composition';

export default defineComponent({
  inheritAttrs: true,
  props: {
    name: { type: String, required: true },
    record: { type: Object, default: null },
  },
  setup(props, { emit }) {
    const { setField, reset, getFields, formData } = useForm(props.record);
    function saveData() {
      emit('save', formData);
    }
    return {
      setField,
      reset,
      getFields,
      formData,
      saveData,
    };
  },
});
</script>
<style lang="scss">
.vhp-inline-input {
  &.multi *:first-child label:nth-child(2) {
    flex: 1;
  }
  & > div:first-child {
    display: flex;
    justify-content: flex-start;
    label:first-child {
      flex: 1;
      margin-right: 8px;
    }
    label:nth-child(2) {
      flex: 2;
    }
  }
}
.vhp-inline-container {
  > *:not(:first-child) {
    padding: 0;
    padding-left: 48px;
  }
}
.dialog.auto-width {
  width: auto;
}
</style>
