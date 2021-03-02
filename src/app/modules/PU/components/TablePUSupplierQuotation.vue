<template>
  <div>
    <STable :loading="isSearching" :columns="tableHeaders" :data="rows">
      <template #header-cell-actions="props">
        <q-th :props="props" class="fixed-col right">
          {{ props.col.label }}
        </q-th>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" class="fixed-col right">
          <q-icon name="mdi-dots-vertical" size="16px">
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="onClickModify(props.row, props.rowIndex)"
                >
                  <q-item-section>Modify Supplier Quotation</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="onClickDelete(props.row, props.rowIndex)"
                >
                  <q-item-section>Delete Supplier Quotation</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>

    <DialogPUModifySupplierQuotation
      v-model="dialog.modify"
      :row="selectedRow"
      @modified="(item) => $emit('modified', { item, selectedIdx })"
    />

    <q-dialog v-model="dialog.delete" persistent>
      <q-card style="width: 424px" class="q-pa-md">
        <q-card-section>
          <div class="row">
            <q-icon
              name="mdi-comment-question-outline"
              size="21px"
              class="q-mt-sm q-mr-md"
              color="orange"
            />
            <div class="column">
              <p class="text-h6 q-mb-xs">Question</p>
              <p>Do you really want to DELETE this supplier quotation?</p>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="white"
            text-color="black"
            label="No"
            @click="onCancelDelete"
            class="q-mr-lg"
          />

          <q-btn
            color="primary"
            label="Yes"
            @click="onConfirmDelete"
            :loading="isDeleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from '@vue/composition-api';
import { tableHeaders } from '../tables/supplierQuotation.table';
import DialogPUModifySupplierQuotation from './DialogPUModifySupplierQuotation.vue';
import { date } from 'quasar';
import { store } from '~/store';

export default defineComponent({
  components: {
    DialogPUModifySupplierQuotation,
  },

  props: {
    isSearching: { type: Boolean, default: false },
    rows: { type: Array, required: true },
  },

  setup(_, { emit, root: { $api } }) {
    const selectedRow = ref(null);
    const selectedIdx = ref(-1);

    const dialog = reactive({
      modify: false,
      delete: false,
    });

    function onClickModify(row, rowIndex) {
      selectedIdx.value = rowIndex;
      selectedRow.value = row;
      dialog.modify = true;
    }

    function onClickDelete(row, rowIndex) {
      selectedIdx.value = rowIndex;
      selectedRow.value = row;
      dialog.delete = true;
    }

    function onCancelDelete() {
      dialog.delete = false;
    }

    const isDeleting = ref(false);

    async function onConfirmDelete() {
      isDeleting.value = true;

      const payload = {
        artnr: selectedRow.value.artnr,
        'lief-nr': selectedRow.value['lief-nr'],
        supName: selectedRow.value.supName,
        artName: selectedRow.value.artName,
        devUnit: selectedRow.value.devUnit,
        content: selectedRow.value.content,
        unitprice: selectedRow.value.unitprice,
        curr: selectedRow.value.curr,
        'from-date': date.formatDate(
          selectedRow.value.validity.start,
          'YY/MM/DD'
        ),
        'to-date': date.formatDate(selectedRow.value.validity.end, 'YY/MM/DD'),
        remark: selectedRow.value.remark,
        filename: ' ',
        activeflag: selectedRow.value.activeFlag,
        'docu-nr': selectedRow.value['docu-nr'],
        minQty: selectedRow.value.minQty,
        delivDay: selectedRow.value.delivDay,
        disc: selectedRow.value.disc,
        avl: selectedRow.value.avl,
      };

      await $api.purchasing.quoteListSave({
        PvILanguage: '1',
        currType: 'del',
        userInit: store.state.auth.user.userInit,
        tQuote: {
          ['t-Quote']: [payload],
        },
      });

      emit('delete', selectedIdx.value);

      isDeleting.value = false;

      dialog.delete = false;
    }

    return {
      tableHeaders,
      pagination: { rowsPerPage: 10 },
      selectedIdx,

      onClickModify,
      onClickDelete,
      onCancelDelete,
      onConfirmDelete,
      isDeleting,
      dialog,
      selectedRow,
    };
  },
});
</script>
