<template>
  <!-- not using STable due to the expanded is not working -->
  <q-table
    class="s-table table sticky-header"
    separator="cell"
    dense
    :loading="isFetching"
    :columns="tableHeaders"
    :data="rowsWithIndex"
    row-key="index"
    hide-pagination
    :rows-per-page-options="[0]"
    :pagination="{ page: 1, rowsPerPage: 0 }"
  >
    <template #header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th><div>Show Details</div></q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td auto-width class="text-center">
          <q-btn
            v-if="props.row.details.length > 0"
            size="md"
            flat
            round
            padding="none"
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'mdi-menu-up' : 'mdi-menu-down'"
          />
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props" no-hover class="expanded">
        <q-td colspan="100%" no-hover class="detail">
          <div class="q-gutter-y-md">
            <div
              class="row"
              v-for="(item, index) in props.row.details"
              :key="index"
            >
              <template v-if="item.datum === ' - '">
                <div class="col-2">{{ item['str-aci'] }}</div>
                <div class="col-2 text-bold">
                  {{ item.aci.split(':')[0].trim() }} :
                </div>
                <div class="col-1 text-right">
                  {{ item.aci.split(':')[1].trim() }}
                </div>
                <div class="col-1"></div>
                <div class="col-6">
                  <b>{{ item['str-rate-aci'].split(':')[0].trim() }}</b> :
                  {{ item['str-rate-aci'].split(':')[1].trim() }}
                  &emsp;

                  <b>{{ item['adult-rate'].split(':')[0].trim() }}</b> :
                  {{ item['adult-rate'].split(':')[1].trim() }}
                  &emsp;

                  <b>{{ item['child-rate'].split(':')[0].trim() }}</b> :
                  {{ item['child-rate'].split(':')[1].trim() }}
                  &emsp;

                  <b>{{ item['infant-rate'].split(':')[0].trim() }}</b> :
                  {{ item['infant-rate'].split(':')[1].trim() }}
                </div>
              </template>
              <template v-else>
                <div class="col-2">{{ item.datum }}</div>
                <div class="col-2 text-bold">{{ item['str-aci'] }}</div>
                <div class="col-1 text-right">{{ item.aci }}</div>
                <div class="col-1"></div>
                <div class="col-3 text-bold">
                  {{ item['str-rate-aci'] }}
                </div>
                <div class="col-1 text-right">{{ item['adult-rate'] }}</div>
                <div class="col-1 text-right">{{ item['child-rate'] }}</div>
                <div class="col-1 text-right">{{ item['infant-rate'] }}</div>
              </template>
            </div>
          </div>
        </q-td>
      </q-tr>
      <!-- hack for the striped rows -->
      <q-tr style="height: 0"></q-tr>
    </template>

    <template #loading>
      <div style="z-index: 5">
        <q-inner-loading showing color="primary" />
      </div>
    </template>

    <template #no-data>
      <div class="full-width column flex-center text-grey q-pa-lg">
        <q-icon size="2em" name="mdi-alert-circle-outline" />
        <span>No contract rates defined for this guest file.</span>
      </div>
    </template>
  </q-table>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import { TableHeader } from '~/components/VhpUI/typings';
import { TableViewRates } from '../../../models/extra/guest-profile-view-rates/guestProfileViewRates.model';

const tableHeaders: TableHeader<TableViewRates>[] = [
  {
    label: 'Rate Code',
    field: 'prcode',
    name: 'prcode',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Rate Code Description',
    field: 'desc-prcode',
    name: 'desc-prcode',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Currency',
    field: 'currency',
    name: 'currency',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Market Segment',
    field: 'market',
    name: 'market',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Arrangement',
    field: 'argt',
    name: 'argt',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Room Type',
    field: 'rmtype',
    name: 'rmtype',
    sortable: true,
    align: 'left',
  },
];

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: { type: Array as PropType<TableViewRates[]>, required: true },
  },
  setup(props) {
    const rowsWithIndex = computed(() =>
      props.rows.map((row, index) => ({ index, ...row }))
    );

    return {
      tableHeaders,
      rowsWithIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.s-table .q-table tr th:last-child {
  text-align: left;
  white-space: normal;

  div {
    width: 40px;
  }
}

.table {
  max-height: 572px;
}

.detail {
  background-color: $grey-4;
  padding-right: 65px !important;
}
</style>
