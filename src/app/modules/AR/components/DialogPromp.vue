<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :persistent="persistent"
    transition-show="scale"
    transition-hide="scale"
  >
    <div class="dialog">
      <div class="dialog__header">
        <div class="dialog__title">{{ title }}</div>
      </div>
      <div class="bg-white q-pa-md">
        <div class="q-pa-sm">
          <SInput :label-text="message" v-model="input" :type="prompt.type" />
        </div>
      </div>
      <div class="dialog__footer q-pa-md q-gutter-sm">
        <q-btn
          unelevated
          outline
          v-close-popup
          label="Cancel"
          color="white"
          text-color="gray"
          @click="onCancelClick"
        />
        <q-btn unelevated color="primary" label="Save" @click="onOKClick" />
      </div>
    </div>
  </q-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
export default defineComponent({
  props: {
    title: { type: String, required: true },
    message: { type: String, required: false },
    persistent: { type: Boolean, required: false, default: false },
    prompt: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const dialog = ref(null);
    const input = ref(props.prompt.model);
    // following method is REQUIRED
    // (don't change its name --> "show")
    function show() {
      dialog.value.show();
    }

    // following method is REQUIRED
    // (don't change its name --> "hide")
    function hide() {
      dialog.value.hide();
    }

    function onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      emit('hide');
    }

    function onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      emit('ok', unref(input));
      // or with payload: emit('ok', { ... })

      // then hiding dialog
      hide();
    }

    function onCancelClick() {
      // we just need to hide dialog
      hide();
    }

    return {
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick,
      dialog,
      input,
    };
  },
});
</script>
