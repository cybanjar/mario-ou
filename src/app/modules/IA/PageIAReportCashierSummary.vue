<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="235" persistent>
    <SearchCashierSummary/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
      >
        <template v-slot:header="props">
            <q-tr style="height: 40px" :props="props">
                <q-th
                :props="props"
                v-for="col in props.cols"
                :key="col.name"
                >
                    {{col.label}}
                </q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" @click="onRowClick(props.row)" >
           <q-td 
           :key="col.name" 
           :props="props" 
           v-for="col in props.cols">
              {{col.value}} 
           </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
  watch
} from '@vue/composition-api';
import {tableHeaders} from './Tables/CashierSummary.table'

export default defineComponent({
    setup(){
        const state = reactive({
            isFetching: false,
            hide_bottom: false,
            data: [],
        })

        const onRowClick = () => {
            alert()
        }

        return {
            pagination: {
              rowsPerPage: 10,
            },
            tableHeaders,
            ...toRefs(state)
        }
    },
    components: {
        SearchCashierSummary: () => import('./components/SearchCashierSummary.vue')
    }
})
</script>
