<template>
  <div>
    <STable
      row-key="key"
      :loading="loading"
      :columns="transactionColumns"
      :data="data"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      virtual-scroll
      fixed-header
      fixed-width
      v-on="$listeners"
      class="my-sticky-header-column-table"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="$emit('update:selected', [props.row.billName])"
        >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <STooltip
              :key="col.name"
              v-if="col.name !== 'actions'"
              :value="col.value"
              :spacing="2"
              @set:tip="updateTooltip"
            />
            <q-icon v-else name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon
                        class="inline"
                        name="mdi-account-outline"
                        color="gray"
                      />
                    </q-item-section>

                    <q-item-section @click="onView(props.row)">
                      View Bill</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </q-tr>
      </template>
    </STable>
    <q-tooltip
      :target="tooltip.target"
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
    >
      <strong>{{ tooltip.value }}</strong>
    </q-tooltip>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  nextTick,
} from '@vue/composition-api';
import { transactionColumns } from '../tables/transaction.table';

export default defineComponent({
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
  },
  setup(props, { emit }) {
    const selected = ref([]);
    const pagination = ref();
    const tooltip = reactive({
      target: false,
      value: null,
    });

    function onView(transaction) {
      if (transaction.billNumber) {
        emit('view:bill', { billNumber: transaction.billNumber });
      }
    }

    function updateTooltip({ selector, text }) {
      tooltip.target = selector;
      tooltip.value = text;
      console.log(selector, text);
    }

    return {
      transactionColumns,
      selected,
      updateTooltip,
      pagination,
      onView,
      tooltip: toRefs(tooltip),
    };
  },
});
</script>
<style lang="scss">
@mixin shadow($element: 'before', $spacing: 0, $origin: 'left') {
  &:#{$element},
  &::#{$element} {
    display: block;
    content: '';
    position: absolute;
    width: 8px;
    height: 100%;
    top: 0px;
    @if $element == 'before' {
      #{$origin}: ($spacing * -1) + px;
      background: linear-gradient(
        to left,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      );
    }
    @if $element == 'after' {
      #{$origin}: ($spacing * -1) + px;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      );
    }
  }
}
.my-sticky-header-column-table {
  tr th {
    position: sticky;
    /* higher than z-index for td below */
    z-index: 3;
    /* bg color is important; just specify one */
    background: #fff;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
    /* highest z-index */
    z-index: 300;
  }

  thead tr:nth-child(1) th {
    top: 0;
    z-index: 1;
  }

  tr:nth-child(1) th:nth-child(1),
  table > thead > tr > th:nth-child(2),
  tr:last-child th:last-child {
    /* highest z-index */
    z-index: 13;
  }

  td:nth-child(2),
  td:last-child,
  td:nth-child(1) {
    z-index: 10;
  }

  td:nth-child(1),
  th:nth-child(1) {
    position: sticky;
    left: 0;
  }

  td:last-child,
  th:last-child {
    position: sticky;
    right: 0;
    @include shadow('before', 8);
  }

  td:nth-child(2),
  th:nth-child(2) {
    position: sticky;
    left: 250px;
    @include shadow('after', -120, 'left');
  }
}
</style>
