<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">
          Allotment Administration - {{ guestName }}
        </span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-pa-lg">
          <div>
            <q-btn flat round @click="triggerAddButton">
              <img
                :src="
                  require(`~/app/icons/${
                    disableStatus ? 'Icon-Add' : 'Icon-AddDisable'
                  }.svg`)
                "
                height="25"
              />
            </q-btn>
            <q-btn flat round class="q-ml-md">
              <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
            </q-btn>
            <q-btn flat round class="q-ml-md">
              <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
            </q-btn>
          </div>

          <q-form @submit="isEdit ? onEdit() : onSubmit()">
            <div class="row q-mt-md q-col-gutter-x-lg">
              <div class="col-2">
                <SInput
                  v-model="formData.code"
                  label-text="Allotment Code"
                  :disable="disableStatus"
                  :rules="[(val) => !!val || 'Field is required']"
                  :lazy-rules="true"
                  :key="disableStatus"
                />
              </div>
              <div class="col-2">
                <DateRangeInput
                  v-model="formData.datePeriod"
                  label-text="Date Period"
                  placement="auto"
                  :disable="disableStatus"
                  :rules="[(val) => !!val || 'Field is required']"
                  :lazy-rules="true"
                  :key="disableStatus"
                />
              </div>
              <div class="col-2">
                <SInput
                  v-model.number="formData.cutoffDays"
                  label-text="Cutoff Days"
                  :disable="disableStatus"
                />
              </div>
              <div class="col-2">
                <DateInput
                  v-model="formData.cutoffDate"
                  label-text="Cutoff Date"
                  placement="auto"
                  :disable="disableStatus"
                />
              </div>
            </div>

            <div class="row q-mt-sm q-col-gutter-x-lg">
              <div class="col-2">
                <SSelect
                  label-text="Room Type Code"
                  emit-value
                  v-model.number="formData.roomType"
                  :options="roomTypeOptions"
                  :disable="disableStatus"
                  :rules="[(val) => !!val || 'Field is required']"
                  :lazy-rules="true"
                  :key="disableStatus"
                />
              </div>
              <div class="col-4">
                <SSelect
                  label-text="Arrangement"
                  emit-value
                  map-options
                  v-model="formData.arrangement"
                  :options="arrangementOptions"
                  :disable="disableStatus"
                  :rules="[(val) => !!val || 'Field is required']"
                  :lazy-rules="true"
                  :key="disableStatus"
                />
              </div>
              <div class="col-2">
                <SInput
                  v-model.number="formData.roomQuantity"
                  :disable="disableStatus"
                  label-text="Room Quantity"
                  :rules="[(val) => val > 0 || 'Must be higher than 0']"
                  :lazy-rules="true"
                  :key="disableStatus"
                />
              </div>
              <div class="col-4">
                <div class="row q-col-gutter-x-lg">
                  <div class="col-3">
                    <SInput
                      :disable="disableStatus"
                      v-model.number="formData.adult"
                      label-text="Adult"
                      :rules="[(val) => val > 0 || 'Must be higher than 0']"
                      :lazy-rules="true"
                      :key="disableStatus"
                    />
                  </div>
                  <div class="col-3">
                    <SInput
                      v-model.number="formData.child"
                      :disable="disableStatus"
                      label-text="Child"
                    />
                  </div>
                  <div class="col-6 q-mt-lg">
                    <q-btn
                      :disable="guestContactSelectedRow === null"
                      color="primary"
                      label="Global Allotment"
                      size="sm"
                      @click="dialogGlobalAllotment.open()"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-my-sm q-col-gutter-x-lg">
              <div class="col-2">
                <SInput
                  v-model.number="formData.overbooking"
                  label-text="Overbooking"
                  :disable="disableStatus"
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.contact"
                  label-text="Contact"
                  :disable="disableStatus"
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.remark"
                  label-text="Remark"
                  type="textarea"
                  rows="2"
                  :disable="disableStatus"
                />
              </div>
              <div class="col-2 self-end">
                <div class="row justify-between q-mb-md">
                  <q-btn
                    color="primary"
                    text-color="primary"
                    label="Cancel"
                    outline
                    size="sm"
                    :disable="disableStatus"
                    @click="disableStatus = true"
                  />

                  <q-btn
                    color="primary"
                    label="Save"
                    type="submit"
                    size="sm"
                    :disable="disableStatus"
                  />
                </div>
              </div>
            </div>
          </q-form>

          <STable
            row-key="$_index"
            :columns="tableHeaderCreateAllotment"
            :data="rowsWithIndex"
            :selected.sync="selected"
            @row-click="onRowClick"
            no-data-text="No Data"
            class="dialog__table sticky-header"
          >
            <template #header-cell-actions="props" class="sticky-header">
              <q-th :props="props" class="fixed-col right">
                {{ props.col.label }}
              </q-th>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="fixed-col right">
                <q-icon
                  name="mdi-dots-vertical"
                  size="16px"
                  class="cursor-pointer"
                >
                  <q-menu auto-close anchor="bottom right" self="top right">
                    <q-list>
                      <q-item clickable v-ripple @click="disableStatus = false">
                        <q-item-section>Modify</q-item-section>
                      </q-item>
                      <q-item clickable v-ripple @click="onDelete">
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-td>
            </template>
          </STable>
        </div>
        <DialogGlobalAllotment
          :show.sync="dialogGlobalAllotment.state.show"
          :key="dialogGlobalAllotment.state.key"
          :guest-number="guestNumber"
          :allotment-code="
            guestContactSelectedRow && guestContactSelectedRow.kontcode
          "
        />
      </div>

      <div class="dialog__footer">
        <q-btn label="OK" color="primary" v-close-popup />
      </div>
      <q-inner-loading :showing="isFetching" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import DateInput from '../common/DateInput.vue';
import DateRangeInput, { DateRangeValue } from '../common/DateRangeInput.vue';
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';
import { date } from 'quasar';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import {
  AllotmentList,
  CreateAllotment,
} from '../../models/guest-profile/createAllotment.model';
import { SelectItem } from '~/app/shared/models/select.model';
import { TableHeader } from '~/components/VhpUI/typings';
import { useDirectSelectedRow } from '../../composables/selectedRow';
import { useDisposableDialog } from '../../composables/disposableDialog';

const tableHeaderCreateAllotment: TableHeader<AllotmentList>[] = [
  { label: 'Allotment Code', align: 'left', field: 'kontcode' },
  {
    label: 'Start Date',
    align: 'left',
    field: 'ankunft',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'End Date',
    align: 'left',
    field: 'abreise',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Room Type', align: 'left', field: 'kurzbez' },
  { label: 'Arrangement Code', align: 'left', field: 'arrangement' },
  { label: 'Room Quantity', field: 'zimmeranz' },
  { label: 'Adult', field: 'erwachs' },
  { label: 'Child', field: 'kind1' },
  { label: 'Overbook', field: 'overbooking' },
  { label: 'Cutoff Day', field: 'ruecktage' },
  {
    label: 'Cutoff Date',
    field: 'rueckdatum',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Created ID', align: 'left', field: 'userinit' },
  { label: 'Changed ID', align: 'left', field: 'userinit' },
  {
    label: 'Created Date',
    align: 'left',
    field: 'resdat',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Contact', align: 'left', field: 'ansprech' },
  { label: 'Remark', align: 'left', field: 'bemerk' },
  { label: 'Allotment Number', align: 'left', field: 'kontignr' },
  { name: 'actions' },
];

const defaultFormValues = {
  code: '',
  datePeriod: { start: new Date(), end: new Date() } as DateRangeValue,
  cutoffDays: 0,
  cutoffDate: null as Date | null,
  roomType: null as number | null,
  arrangement: '',
  roomQuantity: 0,
  child: 0,
  adult: 0,
  overbooking: 0,
  contact: '',
  remark: '',
};

export default defineComponent({
  components: {
    DialogGlobalAllotment: () => import('./DialogGlobalAllotment.vue'),
    DateInput,
    DateRangeInput,
  },
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, default: null },
    guestName: { type: String, default: '' },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const formData = reactive({ ...defaultFormValues });
    const state = reactive({
      isFetching: false,
      roomTypeOptions: [] as SelectItem<number>[],
      arrangementOptions: [] as SelectItem<string>[],
    });
    const allotmentData = ref<AllotmentList[]>([]);
    const disableStatus = ref(true);
    const isEdit = ref(false);

    if (showDialog.value && props.guestNumber) {
      getData();
    }

    async function getData() {
      state.isFetching = true;
      resetForm();

      const [
        resAllotment,
        resRoomTypeOptions,
        resArrangementOptions,
      ] = await Promise.all([
        $api.frontOfficeReception.prepareCreateAllotment(props.guestNumber),
        $api.frontOfficeReception.getRoomType(),
        $api.frontOfficeReception.getArrangement(),
      ]);

      allotmentData.value = resAllotment;
      state.roomTypeOptions = resRoomTypeOptions.map((value) => ({
        label: `${value.zikatnr} - ${value.kurzbez}`,
        value: value.zikatnr,
      }));
      state.arrangementOptions = resArrangementOptions.map((value) => ({
        label: `${value.arrangement} - ${value['argt-bez']}`,
        value: value.arrangement,
      }));

      state.isFetching = false;
    }

    watch(
      () => formData.cutoffDays,
      (newDays) => {
        if (newDays) {
          formData.cutoffDate = null;
        }
      }
    );

    watch(
      () => formData.cutoffDate,
      (newDate) => {
        if (newDate) {
          formData.cutoffDays = 0;
        }
      }
    );

    async function onSubmit() {
      $q.loading.show();

      const requestData: CreateAllotment = {
        currMode: 'NEW',
        gastnr: props.guestNumber,
        zikatnr1: formData.roomType,
        argt: formData.arrangement,
        ansprech: formData.contact,
        comments: formData.remark,
        kontcode: formData.code,
        ankunft: date.formatDate(formData.datePeriod.start, 'MM/DD/YY'),
        abreise: date.formatDate(formData.datePeriod.end, 'MM/DD/YY'),
        zikatnr: formData.roomType,
        zimmeranz: formData.roomQuantity,
        erwachs: formData.adult,
        kind1: formData.child,
        overbooking: formData.overbooking,
        ruecktage: formData.cutoffDays,
        rueckdatum: date.formatDate(formData.cutoffDate, 'MM/DD/YY'),
        kontignr: 0,
      };

      await $api.frontOfficeReception.createAllotment(requestData);

      $q.loading.hide();
      disableStatus.value = true;
      getData();
    }

    const guestContactSelectedRow = ref<AllotmentList>(null);
    const { rowsWithIndex, selected, onRowClick } = useDirectSelectedRow(
      allotmentData,
      guestContactSelectedRow,
      true
    );
    watch(guestContactSelectedRow, (newValue) => {
      if (newValue) {
        isEdit.value = true;
        disableStatus.value = true;

        formData.code = newValue.kontcode;
        formData.datePeriod.start = new Date(newValue.ankunft);
        formData.datePeriod.end = new Date(newValue.abreise);
        formData.cutoffDays = newValue.ruecktage;
        formData.cutoffDate = new Date(newValue.rueckdatum);
        formData.roomType = newValue.zikatnr;
        formData.roomQuantity = newValue.zimmeranz;
        formData.child = newValue.kind1;
        formData.adult = newValue.erwachs;
        formData.overbooking = newValue.overbooking;
        formData.contact = newValue.ansprech;
        formData.remark = newValue.bemerk;
        formData.arrangement = newValue.arrangement;
      }
    });

    async function onEdit() {
      $q.loading.show();

      const requestData: CreateAllotment = {
        currMode: 'CHG',
        gastnr: props.guestNumber,
        zikatnr1: formData.roomType,
        argt: formData.arrangement,
        ansprech: formData.contact,
        comments: formData.remark,
        kontcode: formData.code,
        ankunft: date.formatDate(formData.datePeriod.start, 'MM/DD/YY'),
        abreise: date.formatDate(formData.datePeriod.end, 'MM/DD/YY'),
        zikatnr: formData.roomType,
        zimmeranz: formData.roomQuantity,
        erwachs: formData.adult,
        kind1: formData.child,
        overbooking: formData.overbooking,
        ruecktage: formData.cutoffDays,
        rueckdatum: date.formatDate(formData.cutoffDate, 'MM/DD/YY'),
        kontignr: guestContactSelectedRow.value.kontignr,
      };

      await $api.frontOfficeReception.createAllotment(requestData);

      $q.loading.hide();
      disableStatus.value = true;
      getData();
    }

    async function onDelete() {
      $q.loading.show();

      const deleteStatus = await $api.frontOfficeReception.checkResline(
        guestContactSelectedRow.value.kontcode,
        guestContactSelectedRow.value.kontignr
      );

      if (deleteStatus.itExist === 'true') {
        $q.loading.hide();
        $q.dialog({
          title: 'Alert',
          message: `
          Reservation exist, Delete Not Possible.<br>
          Reservation Number: ${deleteStatus.resLineResnr}<br>
          Guest Name: ${deleteStatus.resLineName}<br>
          Arrival: ${deleteStatus.resLineAnkunft}<br>
          Departure: ${deleteStatus.resLineAbreise}
          `,
          html: true,
        });
      } else {
        $q.loading.hide();
        $q.dialog({
          title: 'Question',
          message: `Delete allotment: Code = ${
            guestContactSelectedRow.value.kontcode
          } Starting/Ending: ${date.formatDate(
            guestContactSelectedRow.value.ankunft,
            'DD/MM/YY'
          )} / ${date.formatDate(
            guestContactSelectedRow.value.abreise,
            'DD/MM/YY'
          )} ?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          $q.loading.show();

          await $api.frontOfficeReception.deleteAllotment(
            guestContactSelectedRow.value.kontcode,
            guestContactSelectedRow.value.kontignr,
            props.guestNumber
          );

          $q.loading.hide();
          getData();
        });
      }
    }

    function triggerAddButton() {
      resetForm();
      disableStatus.value = false;
      guestContactSelectedRow.value = null;
    }

    function resetForm() {
      Object.entries(defaultFormValues).forEach(([key, value]) => {
        formData[key] = value;
      });
      disableStatus.value = true;
      isEdit.value = false;
    }

    return {
      ...toRefs(state),
      tableHeaderCreateAllotment,
      showDialog,
      formData,
      disableStatus,
      guestContactSelectedRow,

      onSubmit,
      onEdit,
      isEdit,
      onDelete,
      triggerAddButton,

      rowsWithIndex,
      selected,
      onRowClick,

      dialogGlobalAllotment: useDisposableDialog(),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 988px !important;
  &__body {
    max-height: 460px !important;
    overflow: auto;
  }
  &__search-btn {
    margin-right: -12px;
  }
  &__btn-action {
    margin-top: 86px;
  }
  &__table {
    max-height: 260px;
  }
}
</style>
