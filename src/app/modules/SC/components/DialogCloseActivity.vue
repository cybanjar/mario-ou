<template>
  <q-dialog v-model="closedialog.show" persistent>
    <q-card style="min-width: 600px; height: 550px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Close Activity
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="q-pt-none">
        <div class="row q-gutter-md">
          <div class="col">
            <SInput
              label-text="Type"
              v-model="closedialog.rowdata['datum']"
              disable
            />
          </div>
          <div class="col">
            <SInput
              label-text="Contact"
              v-model="closedialog.rowdata['f-cost']"
              disable
            />
          </div>
          <div class="col">
            <SInput
              label-text="Company"
              v-model="closedialog.rowdata['b-betrag']"
              disable
            />
          </div>
        </div>
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          dense
          align="left"
          narrow-indicator
        >
          <q-tab name="detail" label="Activity Detail" />
          <q-tab name="result" label="Result" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="detail">
            <div class="row q-gutter-md">
              <div class="col">
                <SDateInput
                  placeholder="Select Date"
                  v-model="date"
                  label-text="Date"
                />
              </div>
              <div class="col">
                <SInput
                  v-for="items in sinput.filter((x) =>
                    ['Start Time'].includes(x.label)
                  )"
                  v-model="items.value"
                  :label-text="items.label"
                  :style="{ width: '150px', marginRight: items.right }"
                  type="time"
                />
              </div>
            </div>
            <SInput label-text="Regarding" v-model="regarding" />
            <span>Detail</span>
            <q-input v-model="text" filled type="textarea" />
            <SFile
              v-for="items in sinput.filter((x) =>
                ['Attachment'].includes(x.label)
              )"
              v-model="items.value"
              :label-text="items.label"
            />
          </q-tab-panel>

          <q-tab-panel name="result">
            <q-btn-toggle
              v-model="model"
              toggle-color="primary"
              class="q-mb-md"
              :options="[
                { label: 'Clear', value: 'Clear' },
                { label: 'Erase', value: 'Erase' },
              ]"
            />
            <div v-if="model == 'Clear'">
              <SInput label-text="" v-model="input" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions
        align="right"
        class="bg-white text-teal"
        style="position: absolute; right: 0; bottom: 0"
      >
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
  computed,
} from '@vue/composition-api';
import { sinput } from '../utils/SalesActivity';

export default defineComponent({
  props: {
    closedialog: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      sinput: sinput,
      editor: '',
      tab: 'detail',
      date: '',
      model: 'Clear',
      regarding: '',
      input: '',
    });

    return {
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
