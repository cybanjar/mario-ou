<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <div class="dialog__title">Select Guest</div>
      </div>
      <div class="bg-white q-pa-md">
        <div class="q-px-sm">
          <SInput
            v-model="searchQuery"
            placeholder="Search Guest"
            type="string"
          />

          <STable
            row-key="gastnr"
            :loading="isLoading"
            class="dialog-header-table virtual-scroll-sticky-header"
            :columns="displayPaymentColumns"
            :data="displayList"
            virtual-scroll
            :virtual-scroll-sticky-size-start="28"
            :rows-per-page-options="[0]"
            selection="single"
            :selected.sync="selected"
          ></STable>
          <div class="q-my-md column items-center">
            <q-option-group
              v-model="catgoryFilter"
              :options="optionCategory"
              inline
            ></q-option-group>
          </div>
        </div>
      </div>
      <div class="dialog__footer q-pa-md q-gutter-sm">
        <q-btn
          @click="cancel"
          label="Cancel"
          color="white"
          text-color="gray"
          outline
          v-close-popup
        />
        <q-btn @click="save" label="Ok" color="primary" v-close-popup />
      </div>
    </div>
  </q-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  unref,
} from '@vue/composition-api';
import { displayPaymentColumns } from '../tables/guest-billing.table';
import { ResDispDebitor } from '~/app/modules/AR/models/debitor.model';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    caseType: { type: Number, required: false, default: 1 },
    sortType: { type: Number, required: false, default: 0 },
  },
  setup(props, { emit, root: { $api } }) {
    const hide = () => emit('hide');
    const state = reactive({
      searchQuery: '',
      selected: [] as ResDispDebitor[],
      catgoryFilter: 1,
    });

    // TODO: Debounce Function Call
    const displayList = computed(() =>
      unref(guestPrep.result).filter((dat) => {
        const target = dat.gname.toLowerCase();
        const matcher = state.searchQuery.toLowerCase();
        return target.includes(matcher) && dat.gtype === state.catgoryFilter;
      })
    );

    const guestPrep = usePrepare<ResDispDebitor[]>(
      true,
      (name = ' ') =>
        $api.accountReceivable.getAllGuestList({
          caseType: props.caseType,
          sorttype: props.sortType,
          fname: name,
          lname: name,
        }),
      undefined,
      undefined,
      []
    );

    const optionCategory = [
      {
        label: 'Individual',
        value: 0,
      },
      {
        label: 'Company',
        value: 1,
      },
      {
        label: 'Travel Agent',
        value: 2,
      },
    ];

    function save() {
      emit('save', state.selected[0]);
    }

    function cancel() {
      emit('cancel');
    }

    return {
      ...toRefs(state),
      ...toRefs(guestPrep.data),
      hide,
      optionCategory,
      displayPaymentColumns,
      displayList,
      save,
      cancel,
    };
  },
});
</script>
<style lang="scss" scoped>
.dialog {
  max-width: 800px !important;
  &-header-table {
    height: 260px;
    thead tr th {
      position: sticky;
      z-index: 1;
      thead tr:first-child th {
        top: 0;
      }
    }
  }
}
</style>
