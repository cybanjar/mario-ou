<template>
  <q-dialog v-model="event.show" persistent>
    <DialogInsertEvent :insert="insert" />
    <DialogEdit :modal="modal" />
    <q-card style="min-width: 1200px; height: 550px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Event
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <div class="col">
          <div class="q-mb-md">
            <q-btn flat round class="q-mr-lg">
              <img :src="require('~/app/icons/Icon-Add.svg')" height="25" />
            </q-btn>
            <q-btn flat round class="q-mr-lg">
              <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
            </q-btn>
            <q-btn flat round class="q-mr-lg">
              <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
            </q-btn>
            <q-btn flat round @click="onClickInsert">
              <q-icon name="mdi-calendar" color="primary" height="25" />
            </q-btn>
          </div>
        </div>
        <!-- <div class="col">
          <SearchEvent :searches="searches" />
        </div> -->
        <div class="col">
          <STable
            flat
            bordered
            :loading="isFetching"
            :columns="tableHeaders"
            :data="data"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            :hide-bottom="hide_bottom"
            class="table-accounting-date"
          >
            <template #header="props">
              <q-tr style="height: 40px" :props="props">
                <q-th
                  :props="props"
                  v-for="col in props.cols"
                  :key="col.name"
                  :style="col.style"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr
                :props="props"
                @click="onRowClick(props.row)"
                :class="{
                  selected: props.row.selected,
                }"
              >
                <q-td
                  :key="col.name"
                  :props="props"
                  v-for="col in props.cols.filter(
                    (x) => !['actions'].includes(x.name)
                  )"
                >
                  {{ col.value }}
                </q-td>
                <q-td :props="props" key="actions">
                  <q-icon name="mdi-dots-vertical" size="16px">
                    <q-menu
                      :props="props"
                      auto-close
                      anchor="bottom right"
                      self="top right"
                    >
                      <q-list :props="props">
                        <q-item
                          :props="props"
                          @click="onClickEdit"
                          clickable
                          v-ripple
                        >
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple @click="onClickDelete">
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </q-td>
              </q-tr>
            </template>
          </STable>
          <q-dialog v-model="modaldelete" persistent>
            <q-card style="min-width: 350px">
              <q-toolbar>
                <q-toolbar-title class="text-white text-weight-medium">
                  Question
                </q-toolbar-title>
              </q-toolbar>

              <q-card-section class="q-pt-none">
                <div style="margin: 20px">
                  Do You Want To Delete This Event?
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="No" v-close-popup />
                <q-btn flat label="Yes" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
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
} from '@vue/composition-api';
import { tableHeaders } from '../tables/Event.table';

export default defineComponent({
  props: {
    event: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      data: [],
      insert: {
        active: false,
      },
      modal: {
        active: false,
      },
      modaldelete: false
    });

    const onClickInsert = () => {
      state.insert.active = true;
    };

    const onClickEdit = () => {
      state.modal.active = true;
    };

    const onClickDelete = () => {
      state.modaldelete = true;
    };

    onMounted(() => {
      state.data = [
        {
          fdatum: '27/05/2018',
          tdatum: '29/05/2018',
          description: 'Meeting',
          amount: '350000',
          venue: 'GIYANTI',
          setup: '',
          pax: '0',
          fttime: '',
          ttime: '',
          sortable: 'SU',
        },
      ];
    });

    return {
      onClickInsert,
      onClickEdit,
      onClickDelete,
      tableHeaders,
      ...toRefs(state),
    };
  },
  components: {
    DialogInsertEvent: () => import('./DialogInsertEvent.vue'),
    DialogEdit: () => import('./DialogEdit.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
