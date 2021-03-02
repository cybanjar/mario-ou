<template>
  <section class="mt-7 q-pa-md">
    <div v-if="initPrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <SDateInput
          v-model="fromDate"
          label-text="From Date"
          disabled
          readonly
        />
        <SDateInput
          label-text="To Date"
          v-model="toDate"
          :options="options"
          :rules="[(val) => !!val || 'Please Input Since Date']"
        />
        <SInput
          label-text="Reference Number"
          v-model="refNum"
          :rules="[(val) => !!val || 'Please Input Reference Number']"
        />
        <SInput
          label-text="Description"
          v-model="description"
          :rules="[(val) => !!val || 'Please Input Description']"
        />

        <div class="q-px-sm q-py-md">
          <q-btn
            icon="mdi-magnify"
            label="Display"
            type="submit"
            class="full-width"
            color="primary"
          />
        </div>
        <q-separator spaced />
        <SRemarkLeftDrawer label="Debit" :value="debit | money" />
        <SRemarkLeftDrawer label="Credit" :value="credit | money" />
        <div class="q-px-sm q-py-md">
          <q-btn
            icon="mdi-content-save"
            label="Save"
            color="primary"
            unelevated
            class="full-width"
            :disabled="noSave"
          >
            <q-popup-proxy :offset="[0, 10]">
              <q-banner
                inline-actions
                rounded
                class="banner-alert bg-white text-black"
              >
                <template v-slot:avatar>
                  <q-icon
                    name="mdi-information"
                    size="sm"
                    class="text-yellow"
                  />
                </template>
                <div>
                  {{ confirmTransfer }}
                </div>
                <template v-slot:action>
                  <div class="row q-gutter-sm">
                    <q-btn
                      outline
                      color="gray"
                      v-close-popup
                      size="sm"
                      label="No"
                    />
                    <q-btn
                      color="primary"
                      unelevated
                      v-close-popup
                      size="sm"
                      @click="onSave"
                      label="Yes"
                    />
                  </div>
                </template>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
      </q-form>
    </template>
  </section>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import { date } from 'quasar';
import { formatToOB } from '~/app/helpers/formatterDate.helper';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

type State = {
  toDate: Date | string; // this is hardcode
  fromDate: Date | string;
  refNum: string;
  description: string;
  confirmTransfer: string;
};

export default defineComponent({
  props: {
    debit: { type: Number, required: false, default: 0 },
    credit: { type: Number, required: false, default: 0 },
    noSave: { type: Boolean, required: false, default: true },
  },
  setup(props, { emit, root: { $api } }) {
    const filter = reactive<State>({
      toDate: '2019-01-14', // this is hardcode
      fromDate: '2019-01-14',
      refNum: '',
      description: '',
      confirmTransfer: '',
    });
    const options = ref([]);
    const initPrep = usePrepare(
      true,
      () =>
        Promise.all([
          $api.common.getGeneralParam(2, 1014), // fdate
          $api.accountReceivable.transferGLCheckBL({
            pvILanguage: 1,
            userInit: '01',
            arrayNr: 30,
            expectedNr: 2,
          }),
          $api.accountReceivable.transferGLPrepare({}),
        ]),
      ([stateBillDate, stateCheck, statePrepare]) => {
        let today = new Date();
        // ( Date according to Pramater number 1014 + 1 Day)
        let billDate = stateBillDate.fdate
          ? date.addToDate(stateBillDate.fdate, { days: 1 })
          : '';
        let confirmTransfer = stateCheck.msgStr
          ? stateCheck.msgStr
          : `confirm_transfer_msg`;
        // debugger;
        let fromDate = statePrepare.fromDate ? statePrepare.fromDate : '';
        let toDate = statePrepare.acctDate ? statePrepare.acctDate : '';

        let terkecil: string | Date = null;
        terkecil =
          new Date(toDate) > today
            ? date.formatDate(today, 'YYYY-MM-DD')
            : toDate;
        terkecil = new Date(terkecil) > billDate ? billDate : terkecil;

        filter.fromDate = terkecil;
        filter.toDate = fromDate; // to date
        filter.confirmTransfer = confirmTransfer;
        options.value = [date.formatDate(fromDate, 'YYYY/MM/DD')];
        // debugger;
      }
    );

    function onSubmit() {
      const params = {
        fromDate: formatToOB(new Date(filter.fromDate)),
        refno: filter.refNum,
        toDate: formatToOB(new Date(filter.toDate)),
        description: filter.description,
      };
      emit('search', params);
    }

    function onSave() {
      emit('save');
    }

    return {
      ...toRefs(filter),
      onSubmit,
      onSave,
      initPrep,
      options,
    };
  },
  components: {
    DialogSelectGuest: () => import('./DialogSelectGuest.vue'),
  },
});
</script>
<style lang="scss">
.banner-alert {
  max-width: 240px;
  .q-banner {
    &__avatar,
    &__actions,
    &__content {
      font-size: 10px;
    }
    &__actions {
      width: 100%;
    }
  }
}
</style>
