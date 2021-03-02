<template>
  <section class="mt-7">
    <template>
      <div class="q-pa-md">
        <div class="q-mb-md">
            <div class="label-layout">
              <p class="q-mb-sm">
                Total Rooms
              </p>
            </div>
        
            <div style="height: 100px" class="remark q-pa-xs" :class="[right && 'text-right']">
              {{ data.length }}
            </div>
          </div>
      </div>

      <q-separator class="q-my-md" />

    </template>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
} from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  props: {
    data: {} as any
  },
});
</script>

<style lang="scss" scoped>
.label-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remark {
  overflow-x: scroll;
  color: #2887d2;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
