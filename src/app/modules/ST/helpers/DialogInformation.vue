<template>
  <q-dialog v-model="dialogInformation.confirm" persistent>
    <q-card style="marginTop: -200px; width: 400px">
      <q-card-section class="row items-center">
        <div style="color: #1e68c9; marginright: 20px">
          <span class="mdi mdi-information-outline mdi-36px"></span>
        </div>
        <span v-html="dialogInformation.message" style="marginLeft: 10px; color: grey; fontWeight: 500">
        </span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          unelevated
          size="sm"
          label="Oke"
          color="primary"
          @click="dialogInformation.confirm = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    dialogInformation: {} as any,
  },
});
</script>
