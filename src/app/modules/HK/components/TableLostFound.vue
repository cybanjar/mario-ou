<template>
  <STable
    row-key="key"
    v-bind="$attrs"
    :columns="columns"
    :data="data"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    class="payment-list-table"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template :set="(expanded = undefined)" v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            dense
            flat
            @click="expanded = toggleExpand(expanded, props.key)"
            :icon="
              props.key !== expanded
                ? 'mdi-arrow-down-drop-circle-outline'
                : 'mdi-arrow-up-drop-circle-outline'
            "
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          @click="col.name === 'actions' || $emit('row-click', props)"
        >
          <template v-if="col.name === 'actions'">
            <img :src="require(`~/app/icons/Icon-Delete.svg`)" height="20" />
            <q-popup-proxy :offset="[-40, -30]">
              <q-banner
                inline-actions
                rounded
                class="banner-alert bg-white text-black"
              >
                <template v-slot:avatar>
                  <q-icon
                    name="mdi-information"
                    size="sm"
                    class="text-yellow"
                  />
                </template>
                <div>Delete this row ?</div>
                <template v-slot:action>
                  <div class="row q-gutter-sm">
                    <q-btn
                      outline
                      color="gray"
                      v-close-popup
                      size="sm"
                      label="No"
                    />
                    <q-btn
                      color="primary"
                      unelevated
                      v-close-popup
                      size="sm"
                      label="Yes"
                      @click="$emit('delete', props.row.key)"
                    />
                  </div>
                </template>
              </q-banner>
            </q-popup-proxy>
          </template>
          <template v-else>
            <div>{{ col.value }}</div>
          </template>
        </q-td>
      </q-tr>
      <!-- <q-tr v-show="props.key === expanded" :props="props">
        <q-td colspan="100%">
          <div class="text-left">This is expand slot for row above</div>
        </q-td> -->
      <q-tr
        class="table-expanded-row"
        :class="{ expanded: props.key === expanded }"
        :props="props"
        data-row-key="1-extra-row"
      >
        <td class=""></td>
        <td class="" colspan="9">
          <table width="100%" class="expandLostFound">
            <tbody>
              <tr>
                <td>
                  <strong class="text-capitalize">phone</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{ getValue(props.key, 'phone') }}</span
                  ><br /><strong class="text-capitalize">submitted to</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{
                      getValue(props.key, 'submitted')
                    }}</span
                  ><br />
                </td>
                <td>
                  <strong class="text-capitalize">reported by</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{ getValue(props.key, 'report') }}</span
                  ><br /><strong class="text-capitalize">claimed by</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{ getValue(props.key, 'claim') }}</span
                  ><br />
                </td>
                <td>
                  <strong class="text-capitalize">reported date</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{
                      getValue(props.key, 'report_date') | sDate
                    }}</span
                  ><br /><strong class="text-capitalize">claim date</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{
                      getValue(props.key, 'claim_date') | sDate
                    }}</span
                  ><br />
                </td>
              </tr>
              <tr>
                <td class="last">
                  <strong class="text-capitalize">reference</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{ getValue(props.key, 'ref') }}</span
                  >
                </td>
                <td class="last">
                  <strong class="text-capitalize">found by</strong
                  ><span
                    >&nbsp;&nbsp;&nbsp;{{ getValue(props.key, 'found') }}</span
                  ><br />
                </td>
                <td class="last"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </q-tr>
      <!-- </q-tr> -->
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { mainColumns } from '../tables/mainLostFound.table';

export default defineComponent({
  inheritAttrs: true,
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const expanded = ref();

    function toggleExpand(key, target) {
      if (key === target) {
        return undefined;
      }
      return target;
    }

    function getValue(key, field) {
      if (props.data.length <= 0) {
        return '-';
      }
      const item = props.data.find((it: any) => it.key === key);
      const value = item[field];
      return value ? value : '-';
    }

    return { columns: mainColumns, expanded, toggleExpand, getValue };
  },
});
</script>
<style lang="scss">
.banner-alert {
  max-width: 180px;
  .q-banner {
    &__avatar,
    &__actions,
    &__content {
      font-size: 10px;
    }
    &__actions {
      width: 100%;
    }
  }
}
</style>
