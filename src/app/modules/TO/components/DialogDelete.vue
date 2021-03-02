<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 400px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Question</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
       Delete the phone list:  {{ dataSelected.name }} - {{dataSelected.telephone}}
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn size="sm" @click="$emit('onDeleted', false)" color="primary" outline label="Cancel" />
        <q-btn
        size="sm" 
        :loading="loading2"
        :disable="disableButtonSave" 
        color="primary" 
        @click="$emit('onDeleted', false)"
        label="Delete"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from '@vue/composition-api';

export default defineComponent({
  props: {
    deleted: { type: Boolean, required: true },
    dataSelected: { type: Object, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const data = reactive({
      title: '',
      dataSelected: {},
    });

    const dialogModel = computed({
      get: () => props.deleted,
      set: (val) => {
        emit('onDeleted', val);
      },
    });

    return {
      dialogModel,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
