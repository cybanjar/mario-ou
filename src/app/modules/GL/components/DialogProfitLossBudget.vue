<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Update Account Budget
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-5">
            <SInput
              label-text="Account Number"
              :value="budget.fibukonto"
              readonly
            />
          </div>
          <div class="col-7">
            <SInput
              label-text="Account Name"
              :value="budget.bezeich"
              readonly
            />
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <div
          class="row justify-end items-center q-col-gutter-md q-mb-md"
          v-for="(month, idx) in monthsString"
          :key="month"
        >
          <span>{{ month }}</span>
          <div class="col-7">
            <SInput
              v-model.number="monthsModel[idx]"
              input-classes=""
              suffix=".00"
              input-class="text-right"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-lg justify-center">
        <q-btn
          dense
          outline
          color="primary"
          label="Cancel"
          @click="onCancel"
          style="width: 125px;"
          class="q-mr-md"
        />

        <q-btn
          dense
          color="primary"
          label="OK"
          @click="onUpdateBudget"
          style="width: 125px;"
          :loading="isUpdating"
          :disable="isUpdating"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  reactive,
  toRefs,
} from '@vue/composition-api';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    year: { type: String, required: true },
    budget: { type: Object, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive<any>({
      monthsModel: [],
      isUpdating: false,
    });

    watch(
      () => props.budget,
      (budget) => {
        state.monthsModel = [...Object.values(budget.months)];
      }
    );

    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialog', val);
      },
    });

    const onCancel = () => {
      state.isUpdating = false;
      emit('onDialog', false);
    };

    const onUpdateBudget = async () => {
      state.isUpdating = true;
      const body = { ...props.budget, [props.year]: state.monthsModel };
      delete body.months;
      const sorttype = props.year === 'budget' ? 1 : 2;
      const [, res] = await $api.generalLedger.glCOABudgetUpdateBudget(
        [body],
        sorttype
      );
      if (res) {
        emit('onUpdate', body);
      }
      state.isUpdating = false;
    };

    return {
      dialogModel,
      monthsString: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'November',
        'December',
      ],
      onUpdateBudget,
      onCancel,
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
