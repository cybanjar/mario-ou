<template>
  <q-dialog v-model="showDialog" persistent>
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Guest History {{ titleName }}</span>
      </div>

      <q-form @submit="guestProfileHistoryData ? onEdit() : onSubmit()">
        <div class="dialog__body">
          <div class="bg-white q-pa-lg">
            <div class="row q-col-gutter-x-lg q-mt-md">
              <div class="col-4">
                <DateInput
                  label-text="Arrival"
                  v-model="formData.arrival"
                  placement="auto"
                  :rules="[(val) => !!val || 'Field is required']"
                  hide-bottom-space
                />
              </div>
              <div class="col-4">
                <DateInput
                  label-text="Depature"
                  v-model="formData.depature"
                  placement="auto"
                  :rules="[(val) => !!val || 'Field is required']"
                  hide-bottom-space
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model.number="formData.quantity"
                  label-text="Quantity"
                  input-class="text-right"
                  :rules="[(val) => val > 0 || 'Field is required']"
                  type="number"
                  hide-bottom-space
                />
              </div>
              <div class="col-4">
                <SSelect
                  :options="roomTypeOptions"
                  v-model="formData.roomType"
                  label-text="Room Type"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model.number="formData.adult"
                  label-text="Adult"
                  input-class="text-right"
                  :rules="[(val) => val > 0 || 'Field is required']"
                  type="number"
                  hide-bottom-space
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.compliment"
                  label-text="Compliment"
                  input-class="text-right"
                  :rules="[(val) => val >= 0 || 'Minimum value is 0']"
                  type="number"
                  hide-bottom-space
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.roomNumber"
                  label-text="Room Number"
                />
              </div>
              <div class="col-4">
                <SInput v-model="formData.roomRate" label-text="Room Rate" />
              </div>
              <div class="col-4">
                <SSelect
                  :options="segmentCodeOptions"
                  v-model="formData.segmentCode"
                  label-text="Segment Code"
                  emit-value
                  map-options
                />
              </div>

              <q-separator inset class="q-my-lg" />

              <div class="col-4">
                <SInput
                  v-model="formData.roomTurnover"
                  label-text="Room Turnover"
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.arrangementTurnover"
                  label-text="Arrangement Turnover"
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.foodTurnover"
                  label-text="Food & Beferage Turnover"
                />
              </div>

              <div class="col-4">
                <SInput
                  v-model="formData.miscellaneousTurnover"
                  label-text="Miscellaneous Turnover"
                />
              </div>
              <div class="col-4">
                <SInput
                  v-model="formData.totalTurnover"
                  label-text="Total Turnover"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="dialog__footer">
          <q-btn
            label="Cancel"
            color="primary"
            flat
            v-close-popup
            class="q-mr-sm"
          />
          <q-btn type="submit" label="Save" color="primary" no-caps />
        </div>
      </q-form>

      <q-inner-loading :showing="isFetching" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
} from '@vue/composition-api';
import DateInput from '../../common/DateInput.vue';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { SelectItem } from '~/app/shared/models/select.model';
import {
  CreateGuestProfileHistory,
  GuestProfileHistory,
} from '../../../models/extra/guest-profile-guest-history/guestProfileGuestHistory.model';
import { date } from 'quasar';
import { toNumber } from '~/app/helpers/typeConverter.helper';

const defaultFormValues = {
  arrival: null as Date,
  depature: null as Date,
  quantity: 1,
  roomType: '',
  adult: 1,
  compliment: 0,
  roomNumber: '',
  roomRate: '' as number | string,
  segmentCode: '' as number | string,
  roomTurnover: '' as number | string,
  arrangementTurnover: '' as number | string,
  foodTurnover: '' as number | string,
  miscellaneousTurnover: '' as number | string,
  totalTurnover: '' as number | string,
  tempRecid: 0,
};

export default defineComponent({
  components: {
    DateInput,
  },
  props: {
    show: { type: Boolean, required: true },
    guestProfileHistoryData: {
      type: Object as PropType<GuestProfileHistory>,
      default: null,
    },
    titleName: { type: String, default: '' },
  },
  setup(props, { emit, root: { $api, $q, $route } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const formData = reactive({ ...defaultFormValues });
    const state = reactive({
      isFetching: false,
      roomTypeOptions: [] as SelectItem<string>[],
      segmentCodeOptions: [] as SelectItem<number>[],
    });

    if (showDialog.value) {
      getData();
    }

    async function getData() {
      state.isFetching = true;
      const [resRoomTypeOptions, resSegmentOptions] = await Promise.all([
        $api.frontOfficeReception.getRoomType(),
        $api.frontOfficeReception.selectSegment(),
      ]);
      state.roomTypeOptions = resRoomTypeOptions.map((value) => ({
        label: `${value.kurzbez} - ${value.bezeichnung}`,
        value: value.kurzbez,
      }));
      state.segmentCodeOptions = resSegmentOptions.map((value) => ({
        label: `${value.code} - ${value.remark}`,
        value: value.code,
      }));
      state.isFetching = false;
    }

    async function onSubmit() {
      const reqData: CreateGuestProfileHistory = {
        gastnr: Number($route.params.id),
        ankunft: formData.arrival
          ? date.formatDate(formData.arrival, 'YY/MM/DD')
          : null,
        abreise: formData.depature
          ? date.formatDate(formData.depature, 'YY/MM/DD')
          : null,
        zimmeranz: formData.quantity,
        zikateg: formData.roomType ?? '',
        zinr: formData.roomNumber,
        erwachs: formData.adult,
        kind: [0, 0],
        gratis: formData.compliment,
        zipreis: toNumber(formData.roomRate),
        arrangement: 0,
        gesamtumsatz: toNumber(formData.totalTurnover),
        bemerk: '',
        logisumsatz: toNumber(formData.roomTurnover),
        argtumsatz: toNumber(formData.arrangementTurnover),
        'f-b-umsatz': toNumber(formData.foodTurnover),
        'sonst-umsatz': toNumber(formData.miscellaneousTurnover),
        gastinfo: '',
        zahlungsart: 0,
        'com-logis': 0,
        'com-argt': 0,
        'com-f-b': 0,
        'com-sonst': 0,
        guestnrcom: 0,
        abreisezeit: '',
        segmentcode: String(formData.segmentCode ?? ''),
        'zi-wechsel': false,
        resnr: 0,
        'ums-kurz': 0,
        'ums-lang': 0,
        reslinnr: 0,
        betriebsnr: 0,
      };

      $q.loading.show();
      await $api.frontOfficeReception.createGuestProfileHistory(reqData);
      showDialog.value = false;
      $q.loading.hide();
    }

    if (props.guestProfileHistoryData) {
      formData.arrival = new Date(props.guestProfileHistoryData.ankunft);
      formData.depature = new Date(props.guestProfileHistoryData.abreise);
      formData.quantity = props.guestProfileHistoryData.zimmeranz;
      formData.roomType = props.guestProfileHistoryData.zikateg;
      formData.adult = props.guestProfileHistoryData.erwachs;
      formData.compliment = props.guestProfileHistoryData.gratis;
      formData.roomNumber = props.guestProfileHistoryData.zinr;
      formData.roomRate = props.guestProfileHistoryData.zipreis;
      formData.segmentCode = props.guestProfileHistoryData.segmentcode;
      formData.roomTurnover = props.guestProfileHistoryData.logisumsatz;
      formData.arrangementTurnover = props.guestProfileHistoryData.argtumsatz;
      formData.foodTurnover = props.guestProfileHistoryData['f-b-umsatz'];
      formData.totalTurnover = props.guestProfileHistoryData.gesamtumsatz;
      formData.miscellaneousTurnover =
        props.guestProfileHistoryData['sonst-umsatz'];
      formData.tempRecid = props.guestProfileHistoryData['s-recid'];
    }

    async function onEdit() {
      const reqData: CreateGuestProfileHistory = {
        gastnr: Number($route.params.id),
        ankunft: formData.arrival
          ? date.formatDate(formData.arrival, 'YY/MM/DD')
          : null,
        abreise: formData.depature
          ? date.formatDate(formData.depature, 'YY/MM/DD')
          : null,
        zimmeranz: formData.quantity,
        zikateg: formData.roomType ?? '',
        zinr: formData.roomNumber,
        erwachs: formData.adult,
        kind: [0, 0],
        gratis: formData.compliment,
        zipreis: toNumber(formData.roomRate),
        arrangement: 0,
        gesamtumsatz: toNumber(formData.totalTurnover),
        bemerk: '',
        logisumsatz: toNumber(formData.roomTurnover),
        argtumsatz: toNumber(formData.arrangementTurnover),
        'f-b-umsatz': toNumber(formData.foodTurnover),
        'sonst-umsatz': toNumber(formData.miscellaneousTurnover),
        gastinfo: '',
        zahlungsart: 0,
        'com-logis': 0,
        'com-argt': 0,
        'com-f-b': 0,
        'com-sonst': 0,
        guestnrcom: 0,
        abreisezeit: '',
        segmentcode: String(formData.segmentCode ?? ''),
        'zi-wechsel': false,
        resnr: 0,
        'ums-kurz': 0,
        'ums-lang': 0,
        reslinnr: 0,
        betriebsnr: 0,
      };

      $q.loading.show();
      await $api.frontOfficeReception.editGuestProfileHistory(
        formData.tempRecid,
        reqData
      );

      showDialog.value = false;
      $q.loading.hide();
      emit('refetch');
    }

    return {
      ...toRefs(state),
      showDialog,
      formData,
      onSubmit,
      onEdit,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 780px !important;

  &__body {
    max-height: 450px !important;
    overflow: auto;
  }
}
</style>
