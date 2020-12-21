<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <q-form @submit="submit">
        <div class="dialog__header">
          <div class="dialog__title">A/R Payment Comment</div>
        </div>
        <div class="bg-white q-pa-md">
          <div class="q-px-sm">
            <SInput v-model="fieldComment" type="string"></SInput>
          </div>
        </div>
        <div class="dialog__footer q-pa-md q-gutter-sm">
          <q-btn
            label="Cancel"
            color="white"
            text-color="gray"
            outline
            v-close-popup
          />
          <q-btn label="Ok" color="primary" type="submit" />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>
<script lang="ts">
import { defineComponent, toRef } from '@vue/composition-api';
export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    remark: { type: String },
  },
  setup(props, { emit }) {
    const hide = () => emit('hide');
    const fieldComment = toRef(props, 'remark');

    function submit() {
      emit('submit', fieldComment.value);
    }

    return {
      fieldComment,
      submit,
      hide,
    };
  },
});
</script>
