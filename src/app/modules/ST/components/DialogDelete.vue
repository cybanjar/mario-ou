<template>
  <q-dialog v-model="dialogDelete.confirm" persistent>
    <q-card style="marginTop: -200px; width: 400px">
      <q-card-section class="row items-center">
        <div style="color: #1e68c9; marginright: 20px">
          <span class="mdi mdi-help-circle-outline mdi-36px"></span>
        </div>
        <span v-html="dialogDelete.message" style="marginLeft: 10px; color: grey; fontWeight: 500">
        </span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          unelevated
          size="sm"
          label="Cancel"
          color="primary"
          outline
          @click="dialogDelete.confirm = false"
        />
        <q-btn
          unelevated
          size="sm"
          label="Oke"
          color="primary"
          @click="onClickOke"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    dialogDelete: {} as any,
  },
  setup(props, { root: { $router }, emit }) {
    const onClickOke = () => {
      emit('onClickOke', props.dialogDelete.value)
    };
    return {
      onClickOke,
    };
  },
});
</script>
