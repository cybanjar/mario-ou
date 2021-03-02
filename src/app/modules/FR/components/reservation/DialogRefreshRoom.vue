<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Refresh Room And Reservation Status</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-py-lg q-px-xl row q-col-gutter-x-lg">
          <div class="col-4">
            <q-btn
              label="Information"
              no-caps
              outline
              color="primary"
              class="full-width"
              @click="showInformation"
            />
            <q-btn
              label="Refresh"
              color="primary"
              no-caps
              class="q-mt-md full-width"
              @click="refresh"
              :disable="refreshDisabled"
            />
          </div>

          <div class="col-8">
            <STable
              :columns="tableHeaders"
              :data="tableRows"
              no-data-text="Press refresh button to start"
            />
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn label="Ok" color="primary" v-close-popup class="q-mr-md" />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { date } from 'quasar';
import { displayTime } from '~/app/helpers/displayTime.helper';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import {
  RefreshRoom,
  ReqRefreshRoom,
} from '../../models/reservation/reservation.model';

const tableHeaders: TableHeader<RefreshRoom>[] = [
  { label: 'Number', field: 'reihenfolge', name: 'reihenfolge' },
  { label: 'Flag', field: 'flag', name: 'flag' },
  { label: 'Descrition', align: 'left', field: 'bezeich', name: 'bezeich' },
  { label: 'Total', field: 'anz', name: 'anz' },
];

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const state = reactive({
      tableRows: [] as RefreshRoom[],
      refreshDisabled: false,
    });

    async function showInformation() {
      $q.loading.show();
      const readHtparam = await $api.frontOfficeReception.readHtparam({
        caseType: 1,
        paramNo: 592,
        paramGrup: 0,
      });
      $q.loading.hide();

      if (readHtparam?.fdate) {
        const usedDate = date.formatDate(readHtparam.fdate, 'DD/MM/YY');
        const usedTime = displayTime(readHtparam.finteger);
        $q.dialog({
          title: 'Information',
          message: `Last Running on ${usedDate} - ${usedTime} by ${readHtparam.fchar}`,
        });
      } else {
        $q.dialog({
          title: 'Information',
          message: 'No user has run this program',
        });
      }
    }

    function refresh() {
      $q.dialog({
        title: 'Question',
        message: 'Do you really want to refresh room and reservation status?',
        ok: 'Yes',
        cancel: 'No',
      }).onOk(async () => {
        $q.loading.show();
        const { flogical } = await $api.frontOfficeReception.readHtparam({
          caseType: 1,
          paramNo: 592,
          paramGrup: 0,
        });
        if (flogical) {
          $q.loading.hide();
          $q.dialog({
            title: 'Information',
            message: 'This program is being executed by another user.',
          });
          return;
        }

        const { fdate } = await $api.frontOfficeReception.getHTParam0({
          casetype: 2,
          inpParam: 87,
        });
        const ciDate = date.formatDate(fdate, 'MM/DD/YY');

        await getRefreshRoomData({
          path: 'delRoomplan',
          ciDate,
          data: {
            reihenfolge: 1,
            flag: 3,
            bezeich: 'Deleting Roomplan Records',
            anz: 0,
          },
        });

        await getRefreshRoomData({
          path: 'createRoomplan',
          ciDate,
          data: {
            reihenfolge: 2,
            flag: 3,
            bezeich: 'Creating Roomplan records',
            anz: 0,
          },
        });

        await getRefreshRoomData({
          path: 'updateRmstatus',
          ciDate,
          data: {
            reihenfolge: 3,
            flag: 3,
            bezeich: 'Updating Room Status',
            anz: 0,
          },
        });

        $q.loading.hide();
        state.refreshDisabled = true;
        $q.notify({
          type: 'positive',
          message: 'Refreshing Room and Reservation Status Finished.',
        });
      });
    }

    async function getRefreshRoomData(req: ReqRefreshRoom) {
      const data = await $api.frontOfficeReception.refreshRoom(req);
      if (data) state.tableRows.push(data);
    }

    return {
      showDialog: useModelWrapper(props, emit, 'show'),
      tableHeaders,
      ...toRefs(state),
      showInformation,
      refresh,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 776px !important;
}
</style>
