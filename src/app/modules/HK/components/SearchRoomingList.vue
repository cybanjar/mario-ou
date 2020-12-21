<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="Display"
        :options="displayStatuses"
        v-model="filterItems.status"
        clearable
      />
    </div>

    <q-separator />

    <div class="q-pa-md">
      <SInput
        v-model="filterItems.roomNumber"
        label-text="Search Room Number"
      />

      <SInput v-model="filterItems.floor" label-text="Floor" />

      <label class="inline-block q-mb-xs">
        Room
      </label>
      <div class="row">
        <div class="col">
          <SInput v-model="filterItems.roomFrom" placeholder="From" />
        </div>
        <div class="col">
          <SInput v-model="filterItems.roomTo" placeholder="To" />
        </div>
      </div>

      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
      />
    </div>

    <q-separator />

    <div class="q-pa-md">
      <p class="q-mb-sm">
        Reservation Comment
      </p>

      <div class="room-selected q-pa-sm q-mr-sm">
        {{ comment }}
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from '@vue/composition-api';
import { displayStatuses } from '../models/roomList.model';

export default defineComponent({
  props: {
    selectedRoom: { type: Object, default: null },
  },
  setup(props, { emit }) {
    const filterItems = ref({
      status: 'All',
      roomNumber: '',
      floor: '',
      roomFrom: '',
      roomTo: '',
    });

    const comment = computed(() => props.selectedRoom?.bemerk || 'None');

    watch(filterItems, (filters) => {
      emit('onFilterChange', filters);
    });

    return {
      displayStatuses,
      filterItems,
      comment,
    };
  },
});
</script>

<style lang="scss" scoped>
.room-selected {
  overflow-x: scroll;
  color: #2887d2;
  border: 1px dashed #2887d2;
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
