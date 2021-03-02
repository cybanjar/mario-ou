<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :persistent="persistent"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section class="row items-center q-pa-md q-pb-lg">
        <q-avatar
          v-if="icon"
          :icon="icon"
          text-color="warning"
          style="font-size: 4rem"
        />
        <div class="col">
          <div class="text-h6">{{ title }}</div>
          <div v-if="message" class="text-subtitle2">{{ message }}</div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-if="cancel"
          outline
          unelevated
          color="white"
          text-color="black"
          label="No"
          @click="onCancelClick"
        />
        <q-btn unelevated color="primary" :label="okLable" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  props: {
    icon: { type: String, required: false },
    title: { type: String, required: true },
    message: { type: String, required: false },
    okLable: { type: String, required: false, default: 'Yes' },
    cancel: { type: Boolean, required: false, default: false },
    persistent: { type: Boolean, required: false, default: false },
  },
  setup(props, { emit }) {
    const dialog = ref(null);
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
      emit('ok');
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
    };
  },
});
</script>
