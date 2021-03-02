<template>
  <q-dialog v-model="dialog.show" persistent>
    <q-card style="min-width: 300px; height: 600px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Insert Task
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section style="max-height: 60vh;margin: 10px" class="scroll">
        <div class="row q-gutter-md">
          <div class="col">
            <SSelect
              label-text="Text Type"
              :options="[]"
              v-model="todepartment"
            />
            <SDateInput
              placeholder="Select Date"
              v-model="date"
              label-text="Deposit Date"
            />
          </div>
          <div class="col">
            <SSelect label-text="Status" :options="[]" v-model="todepartment" />
            <div class="row q-gutter-md">
              <div class="col">
                <SInput
                  v-for="items in sinput.filter((x) =>
                    ['Start Time'].includes(x.label)
                  )"
                  v-model="items.value"
                  :label-text="items.label"
                  :style="{ 'width': '100%', marginRight: items.right }"
                  type="time"
                />
              </div>
              <div class="col">
                <SInput
                  v-for="items in sinput.filter((x) =>
                    ['End Time'].includes(x.label)
                  )"
                  v-model="items.value"
                  :label-text="items.label"
                  :style="{ 'width': '100%', marginRight: items.right }"
                  type="time"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <SSelect
              label-text="Priority"
              :options="[]"
              v-model="todepartment"
            />
          </div>
          <div class="col"></div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <SSelect
              label-text="Customer"
              :options="[]"
              v-model="todepartment"
            />
          </div>
          <div class="col">
            <SSelect
              label-text="Schedule With"
              :options="[]"
              v-model="todepartment"
            />
          </div>
        </div>
        <SInput label-text="Regarding" v-model="Company" />
        <SInput label-text="Location" v-model="Company" />
        <SFile
          v-for="items in sinput.filter((x) =>
            ['Attachment'].includes(x.label)
          )"
          v-model="items.value"
          :label-text="items.label"
        />
        <span>Detail</span>
        <br />
        <q-input v-model="text" filled type="textarea" />
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
    dialog: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      sinput: sinput,
      editor: '',
      date: '',
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
