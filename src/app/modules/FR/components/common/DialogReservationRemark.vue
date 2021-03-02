<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Remark</span>
      </div>

      <q-form @submit="onSubmit">
        <div class="bg-white q-px-xl q-py-lg column">
          <SInput
            label-text="Guest Remark"
            type="textarea"
            rows="3"
            v-model="formData.guestRemark"
          />
          <SInput
            label-text="Reservation Remark"
            type="textarea"
            rows="3"
            v-model="formData.reservationRemark"
          />
          <SInput
            label-text="Reservation Member Remark"
            type="textarea"
            rows="3"
            v-model="formData.memberRemark"
          />
          <SInput
            label-text="Online Check-in Preference"
            type="textarea"
            rows="3"
            disable
            :value="formData.onlinePreference"
          />
        </div>
        <div class="dialog__footer">
          <q-btn
            label="Cancel"
            color="primary"
            flat
            class="q-mr-sm"
            v-close-popup
          />
          <q-btn label="OK" type="submit" color="primary" />
        </div>
      </q-form>

      <q-inner-loading :showing="isFetching" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { store } from '~/store';
import { ReservationRemarkMethod } from '../../models/common/dialogReservationRemark.model';

export default defineComponent({
  props: {
    show: { type: Boolean, default: false },
    resnr: { type: Number, default: null },
    reslinnr: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const isFetching = ref(true);
    const formData = reactive({
      guestRemark: '',
      reservationRemark: '',
      memberRemark: '',
      onlinePreference: '',
    });

    if (showDialog.value && props.resnr && props.reslinnr) {
      (async () => {
        const data = await $api.frontOfficeReception.reservationRemark({
          icase: ReservationRemarkMethod.Get,
          resno: props.resnr,
          reslinno: props.reslinnr,
          userInit: store.state.auth.user.userInit,
          resCom: '',
          reslCom: '',
          gCom: '',
          webCom: '',
        });

        formData.guestRemark = data.gCom;
        formData.reservationRemark = data.resCom;
        formData.memberRemark = data.reslCom;
        formData.onlinePreference = data.webCom;
        isFetching.value = false;
      })();
    }

    async function onSubmit() {
      $q.loading.show();

      const data = await $api.frontOfficeReception.reservationRemark({
        icase: ReservationRemarkMethod.Update,
        resno: props.resnr,
        reslinno: props.reslinnr,
        userInit: store.state.auth.user.userInit,
        resCom: formData.reservationRemark,
        reslCom: formData.memberRemark,
        gCom: formData.guestRemark,
        webCom: formData.onlinePreference,
      });

      emit('newData', data);
      $q.loading.hide();
      showDialog.value = false;
    }

    return {
      showDialog,
      isFetching,
      formData,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  width: 400px;
}
</style>
