<template>
<div class="column">
    <div class="column" style="height: 856px">
      <div class="col-8">
        <div style="margin: 20px">
            <div class="row" style="marginLeft: 33px">
                 <SInput
                 :key="i.name"
                 v-for="i in use_input"
                 :label-text="i.name"
                 :style="{width: i.width, marginRight: i.right}"
                 v-model="i.value"
            />
        </div>
        <div class="row" style="marginLeft: 33px">
             <STable
                 style="width: 467px; marginRight:20px"
                 :loading="isFetching"
                 :columns="tableHeaders1"
                 :data="data"
                 :rows-per-page-options="[0]"
                 :pagination.sync="pagination"
                 :hide-bottom="hide_bottom"
                 class="table-accounting-date"
                 flat bordered
             />
             <STable
                 style="width: 735px"
                 :loading="isFetching"
                 :columns="tableHeaders2"
                 :data="data"
                 :rows-per-page-options="[0]"
                 :pagination.sync="pagination"
                 :hide-bottom="hide_bottom"
                 class="table-accounting-date"
                 flat bordered
             />
        </div>
        </div>
      </div>
      <div class="col-4">    
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          size="sm"
          outline
          color="primary"
          label="Cancel"
          style="width: 100px; height: 25px; marginRight: 2px; marginTop: -4px"
        />
        <q-btn
          size="sm"
          color="primary"
          label="save"
          style="width: 100px; height: 25px; marginTop: -4px"
          @click="saveReturn"
        />
      </q-card-actions>
        </div>
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
} from '@vue/composition-api';
import {tableHeaders1, tableHeaders2, use_input} from './tables/IncomingoutPO'
export default defineComponent({
    setup(_, { root: { $api } }) {
        const state = reactive({
          data: [],
          isFetching: false
        });
        return {
      ...toRefs(state),
      tableHeaders1,
      tableHeaders2,
      use_input
        }
    }
})
</script>
<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
</style>
