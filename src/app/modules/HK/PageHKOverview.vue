<template>
  <q-page padding>
    <q-inner-loading v-if="isFetching" showing color="primary" size="6em" />

    <template v-else>
      <div class="row q-col-gutter-lg q-mb-xl">
        <div v-for="cardItem in cardItems" :key="cardItem.icon" class="col-3">
          <q-card
            flat
            class="card-item text-white q-py-sm q-px-md"
            :class="cardItem.header.totalPax && 'with-pax'"
          >
            <div class="flex items-center">
              <img
                :src="require(`~/app/icons/HK/Icon-${cardItem.icon}.svg`)"
                height="40px"
                class="q-mr-md"
              />
              <span style="font-size: 1.5rem;">
                {{ cardItem.header.title }}
              </span>
            </div>
            <span class="totals">
              {{ cardItem.header.totalRooms }}
            </span>
            <span v-if="cardItem.header.totalPax" class="totals">
              {{ cardItem.header.totalPax }}
            </span>
            <span></span>
            <span>Rooms</span>
            <span v-if="cardItem.header.totalPax" style="justify-self: center;">
              Pax
            </span>
          </q-card>

          <div class="data-wrapper q-px-sm">
            <div
              v-for="data in cardItem.data"
              :key="data.title"
              class="card-content"
              :class="data.totalPax && 'with-pax'"
            >
              <span class="title">{{ data.title }}</span>
              <span :class="!data.totalPax && 'q-pr-sm'">
                {{ data.totalRooms }}
              </span>
              <span v-if="data.totalPax" class="q-pr-sm">
                {{ data.totalPax }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div v-for="table in tableData" :key="table.title" class="col-3">
          <span class="text-weight-medium q-md-sm">
            {{ table.title }}
          </span>

          <STable :columns="table.headers" :data="table.columns" hide-bottom />
        </div>
        <div class="col-3">
          <div id="pie-chart" />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { CardItems } from './models/overview.model';
import { cardItems, setTableData, TableData } from './tables/overview.table';
import Highcharts from 'highcharts';

interface State {
  isFetching: boolean;
  cardItems: CardItems[];
  tableData: TableData[];
}

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      isFetching: true,
      cardItems: [],
      tableData: [],
    });

    const fetchOverview = async () => {
      const [, res] = await $api.housekeeping.getOverview();

      if (res) {
        state.cardItems = cardItems(res);
        state.tableData = setTableData(res);
      }

      state.isFetching = false;
    };

    const renderChart = () => {
      const data = state.tableData[2].columns.map((col) => ({
        name: col.abbr,
        y: parseInt(col.percentage),
      }));

      Highcharts.chart('pie-chart', {
        credits: {
          enabled: false,
        },
        title: {
          text: '',
        },
        chart: {
          type: 'pie',
          height: 300,
        },
        series: [
          {
            type: 'pie',
            data,
            tooltip: {
              pointFormat: `<b>{point.y}%</b>`,
            },
          },
        ],
      });
    };

    onMounted(async () => {
      await fetchOverview();
      renderChart();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.card-item {
  background: $primary-grad;
  display: grid;
  grid-template-columns: 1fr 15%;
  grid-template-rows: 1fr;
  grid-column-gap: 8px;
  border-radius: 8px;

  &.with-pax {
    grid-template-columns: 1fr 15% 15%;
  }

  span {
    justify-self: center;
  }
}

.data-wrapper {
  border-radius: 0 0 4px 4px;
  border: 1px solid $primary;
  margin: 0 12px;
}

.card-content {
  display: grid;
  grid-template-columns: 1fr 15%;
  column-gap: 8px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
  }

  &.with-pax {
    grid-template-columns: 1fr 15% 15%;
  }

  span:not(.title) {
    justify-self: end;
  }
}

span.totals {
  font-size: 2rem;
}
</style>
