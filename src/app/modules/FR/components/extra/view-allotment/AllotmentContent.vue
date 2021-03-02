<template>
  <div>
    <div
      class="q-gutter-y-md q-mb-lg"
      v-if="!data.totalAllotment && searchData.showDetail"
    >
      <div class="row">
        <div class="col-2">Company / Agent Name</div>
        <div class="col-10 text-bold">{{ data.companyName }}</div>
      </div>
      <div class="row">
        <div class="col-2">Address</div>
        <div class="col-4 text-bold">{{ data.address }}</div>

        <div class="col-2-half">City</div>
        <div class="col-1 text-bold">{{ data.city }}</div>

        <div class="col-1">Rate Code</div>
        <div class="col text-bold">{{ data.ratecode }}</div>
      </div>
      <div class="row">
        <div class="col-2">Allotment Code</div>
        <div class="col-2 text-bold">{{ data.allotmCode }}</div>

        <div class="col-1">Pax</div>
        <div class="col-1 text-bold">{{ data.pax }}</div>

        <div class="col-2-half">Confirmation Days</div>
        <div class="col-1 text-bold">{{ data.confirmdays }}</div>

        <div class="col-1">Overbooking</div>
        <div class="col-1 text-bold">{{ data.overbooking }}</div>

        <div class="col-1">Created ID</div>
        <div class="col-1-half text-bold">{{ data.id }}</div>
      </div>
      <div class="row">
        <div class="col-2">Allotment Date Period</div>
        <div class="col-2 text-bold">{{ data.start }} - {{ data.ending }}</div>

        <div class="col-1">Room Type</div>
        <div class="col-1 text-bold">{{ data.rmcat }}</div>

        <div class="col-2-half">Arrangement</div>
        <div class="col-1 text-bold">{{ data.arg }}</div>

        <div class="col-1">Current Date</div>
        <div class="col-1 text-bold">{{ data.date }}</div>

        <div class="col-1">Changed ID</div>
        <div class="col-1-half text-bold">{{ data.chgid }}</div>
      </div>
    </div>

    <div
      class="row q-col-gutter-y-md q-col-gutter-x-lg q-mb-md"
      v-else-if="!data.totalAllotment && !searchData.showDetail"
    >
      <div class="q-gutter-x-md">
        <span>Company / Agent Name</span>
        <span class="text-bold">{{ data.companyName }}</span>
      </div>

      <div class="q-gutter-x-md">
        <span>Allotment Code</span>
        <span class="text-bold">{{ data.code }}</span>
      </div>

      <div class="q-gutter-x-md">
        <span>Room Type</span>
        <span class="text-bold">{{ data.rmtype }}</span>
      </div>

      <div class="q-gutter-x-md">
        <span>Pax</span>
        <span class="text-bold">{{ data.pax }}</span>
      </div>
    </div>

    <STable :data="tableData" no-pagination>
      <template #header="props">
        <q-tr :props="props">
          <q-th class="fixed-col left text-left">Date</q-th>
          <q-th v-for="({ date, day }, idx) in dateCols" :key="idx">
            <div class="text-center text-uppercase">
              {{ date }}<br />{{ day }}
            </div>
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td class="fixed-col left">{{ props.row.name }}</q-td>
          <q-td
            class="text-center"
            v-for="(value, idx) in props.row.values"
            :key="idx"
          >
            {{ value }}
          </q-td>
        </q-tr>
      </template>
    </STable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import { date } from 'quasar';
import { SearchViewAllotment } from './SearchViewAllotment.vue';

export default defineComponent({
  props: {
    data: { type: Object as PropType<Record<string, string>>, required: true },
    searchData: {
      type: Object as PropType<SearchViewAllotment>,
      required: true,
    },
    page: { type: Number, required: true },
  },
  setup(props) {
    const dateCols = computed(() => {
      const startDate =
        props.page === 1
          ? props.searchData.date.start
          : date.addToDate(props.searchData.date.start, { days: 20 });

      const diff = date.getDateDiff(
        props.searchData.date.end,
        startDate,
        'days'
      );
      const dateRange = diff + 1;
      const length = props.page === 1 && dateRange > 20 ? 20 : dateRange;
      return [...Array(length)].map((_, idx) => {
        const currentDate = date.addToDate(startDate, { days: idx });
        return {
          date: currentDate.getDate(),
          day: date.formatDate(currentDate, 'ddd'),
        };
      });
    });

    const tableData = computed(() => {
      const data = [];

      if (props.data.allotmentRoom !== undefined) {
        const values = mapToArray(props.data.allotmentRoom);
        data.push({ name: 'Allotment Room', values });
      }

      if (props.data.totalAllotment !== undefined) {
        const values = mapToArray(props.data.totalAllotment);
        data.push({ name: 'Total Allotment', values });
      }

      if (props.data.usedAllotment !== undefined) {
        const values = mapToArray(props.data.usedAllotment);
        data.push({ name: 'Used Allotment', values });
      }

      if (props.data.notUsed !== undefined) {
        const values = mapToArray(props.data.notUsed);
        data.push({ name: 'Not Used', values });
      }

      if (props.data.availAllotment !== undefined) {
        const values = mapToArray(props.data.availAllotment);
        data.push({ name: 'Avail Allotment', values });
      }

      if (props.data.available !== undefined) {
        const values = mapToArray(props.data.available);
        data.push({ name: 'Available', values });
      }

      if (props.data.reservations !== undefined) {
        const values = mapToArray(props.data.reservations);
        data.push({ name: 'Reservation', values });
      }

      if (props.data.residents !== undefined) {
        const values = mapToArray(props.data.residents);
        data.push({ name: 'In-house', values });
      }

      if (props.data.cancelled !== undefined) {
        const values = mapToArray(props.data.cancelled);
        data.push({ name: 'Cancelled', values });
      }

      return data;
    });

    function mapToArray(str: string) {
      const arr = str
        .split(' ')
        .filter((e) => e.length > 0)
        .map((e) => parseInt(e, 10));

      if (props.page === 1 && arr.length > 20) {
        return arr.slice(0, 20);
      } else if (props.page === 2) {
        return arr.slice(20);
      } else {
        return arr;
      }
    }

    return {
      dateCols,
      tableData,
    };
  },
});
</script>

<style lang="scss" scoped>
.col-1-half {
  width: 4.16666667%;
}

.col-2-half {
  width: 12.5%;
}
</style>
