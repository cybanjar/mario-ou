<template>
  <div class="q-py-xl q-mx-xl">
    <div class="module-grid">
      <q-card
        v-for="moduleItem in moduleList"
        :key="moduleItem.path"
        class="module-card"
      >
        <HomeModuleItem :item="moduleItem" />
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { moduleList } from './models/HomeModule';

export default defineComponent({
  setup() {
    return {
      moduleList,
    };
  },
  components: {
    HomeModuleItem: () => import('~/app/home/components/HomeModuleItem.vue'),
  },
});
</script>

<style lang="scss" scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 160px);
  grid-gap: 24px 5%;
  justify-content: space-between;
}

.module-card {
  border: 1px solid #c8c8c8;
  border-radius: 20px;
  height: 110px;
}
</style>
