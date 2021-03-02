<template>
  <q-dialog v-model="amendment.active" persistent>
    <q-card style="min-width: 1200px; height: 400px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Amendment
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <div class="q-mb-md">
          <q-btn v-if="!active" flat round @click="add">
            <img :src="require('~/app/icons/Icon-Edit.svg')" height="30" />
          </q-btn>
          <q-btn v-else flat round @click="save">
            <img :src="require('~/app/icons/Icon-Save.svg')" height="30" />
          </q-btn>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <q-card class="my-card" bordered>
              <q-card-section class="bg-primary text-white" style="padding: 5">
                <div class="text-h6">Amendment 1</div>
              </q-card-section>
              <q-separator />

              <q-card-actions>
                <q-input
                  v-model="text"
                  filled
                  type="textarea"
                  style="width: 100%"
                  :disable="!active"
              /></q-card-actions>
            </q-card>
          </div>
          <div class="col">
            <q-card class="my-card" bordered>
              <q-card-section class="bg-primary text-white" style="padding: 5">
                <div class="text-h6">Amendment 2</div>
              </q-card-section>
              <q-separator />

              <q-card-actions>
                <q-input
                  v-model="text"
                  filled
                  type="textarea"
                  style="width: 100%"
                  :disable="!active"
              /></q-card-actions>
            </q-card>
          </div>
          <div class="col">
            <q-card class="my-card" bordered>
              <q-card-section class="bg-primary text-white" style="padding: 5">
                <div class="text-h6">Amendment 3</div>
              </q-card-section>
              <q-separator />

              <q-card-actions>
                <q-input
                  v-model="text"
                  filled
                  type="textarea"
                  style="width: 100%"
                  :disable="!active"
              /></q-card-actions>
            </q-card>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          unelevated
          size="sm"
          v-close-popup
          color="primary"
          outline
          label="Cancel"
        />
        <q-btn
          unelevated
          size="sm"
          color="primary"
          label="OK"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  onMounted,
} from '@vue/composition-api';

export default defineComponent({
  props: {
    amendment: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      data: [],
      text: '',
      active: false,
    });

    const add = () => {
      state.active = true;
    };

    const save = () => {
      state.active = false;
    };

    return {
      add,
      save,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
