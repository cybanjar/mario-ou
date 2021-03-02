<template>
    <div class="row">
      <div class="col">

        <div class="row">
          <div class="col q-pr-md">
            <SInput  label-text="Number" />            
          </div>
          <div class="col">
              <SInput label-text="Code Intruction">
                <template v-slot:append>
                    <!-- <q-icon v-if="text !== ''" name="mdi-close" @click="text = ''" class="cursor-pointer" /> -->
                    <q-icon @click="onClickSearch = true" name="mdi-magnify" />
                </template>
              </SInput>
          </div>
        </div>
        <SInput label-text="Default Intruction" />
        
      </div>
     
        
      <!-- Button save cancel -->
      <div class="col self-end q-mb-md">
          <div class="row justify-end">
            <q-btn
              block
              :color="colors"
              label="Cancel"
              type="submit"
              size="sm"
              :outline="colors == 'grey'? false: true"
              unelevated
              class="q-btn-cancel"
            />
            <q-btn
              block
              :color="colors"
              label="Save"
              type="submit"
              size="sm"
              unelevated
              class="q-btn-save"
            />
          </div>
        </div>

        <q-dialog v-model="onClickSearch" persistent>
          <q-card style="width: 1000px">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium"
                >Select Intruction</q-toolbar-title
              >
            </q-toolbar>

            <q-card-section class="q-ma-sm">
              <div>
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
                              <q-item
                                @click="deleteDataRow(props.row)"
                                clickable
                                v-ripple
                              >
                                <q-item-section>Delete</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-icon>
                      </q-td>
                    </q-tr>
                  </template>
                </STable>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" color="primary" v-close-popup />
              <q-btn label="Save" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  onMounted,
  reactive,
} from '@vue/composition-api';
import { tableHeaders } from '../tables/ModalDefaultIntructionSetup.table';
// import {use_input} from '../utils/DailyReportSetup'
import { use_input, table_input, dataTable } from '../utils/DailyReportSetup';
export default defineComponent({
    props: {
      colors: {} as any
    },
    setup(_, { emit, root: { $api } }) {
        const state = reactive({
            data: [],
            isFetching: false,
            hide_bottom: false,
            colors: 'grey',
            use_input: use_input,
            onClickSearch: false
        });

        const onRowClick = (datarow) => {
      let disable;
      for (const items of use_input.filter(
        (x) => !['File Number', 'Category'].includes(x.label)
      )) {
        if (items.disable) {
          disable = true;
        } else {
          disable = false;
        }
      }
      if (disable) {
        for (const i of state.data) {
          i.selected = false;
        }
        datarow['selected'] = true;
        for (const index in table_input) {
          use_input[index].value = datarow[table_input[index]];
        }
      }
    };

    onMounted(() => {
      console.log('halo');
      
    });

    const onAdd = () => {
      for (const items of use_input.filter(
        (x) => !['File Number', 'Category'].includes(x.label)
      )) {
        items.disable = false;
        items.value = '';
      }
      state.colors = 'primary';
    };
    const onClickEdit = () => {
      for (const items of use_input.filter(
        (x) => !['File Number', 'Category'].includes(x.label)
      )) {
        items.disable = false;
      }
      state.colors = 'primary';
    };

    const onClickDialogIntruction = () => {
      console.log("emit intruction")
    }

        // const onClickSearch = () => {
        //     emit('onClickDialogIntruction');
        // }
        return {
          ...toRefs(state),
          tableHeaders,
          onRowClick,
          onAdd,
          onClickEdit,
          // onClickSearch
        }
    },
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

</style>