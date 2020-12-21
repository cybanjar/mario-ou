<template>
  <div>
    <q-layout view="HHh LpR fFf">
      <LayoutMainHeader />
      <q-page-container
        :style="{ 'padding-right': hasReports ? '50px' : '0px' }"
      >
        <router-view />
      </q-page-container>
      <q-drawer
        v-model="rightDrawer"
        side="right"
        bordered
        :width="50"
        persistent
      >
        <div class="column full-height">
          <q-list padding>
            <q-item
              clickable
              v-ripple
              class="q-px-sm"
              @click="reportDrawer = true"
            >
              <q-item-section class="items-center">
                <img
                  :src="require('~/app/icons/Icon-Report-List.svg')"
                  height="30px"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <q-list padding v-for="(item, index) in menu" :key="index">
            <q-item clickable v-ripple class="q-px-sm" @click="item.handler">
              <q-item-section class="items-center">
                <img :src="item.icon" height="30px" />
              </q-item-section>
            </q-item>
          </q-list>

          <q-list padding class="q-mt-auto q-mb-lg">
            <q-item clickable v-ripple @click="rightDrawer = false">
              <q-item-section>
                <q-icon name="mdi-chevron-right" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-drawer>
    </q-layout>

    <q-layout v-if="hasReports">
      <LayoutReportDrawer :drawer.sync="reportDrawer" />

      <q-page-sticky position="bottom-right" :offset="[18, 28]">
        <q-btn
          v-if="!rightDrawer"
          fab
          icon="mdi-chevron-left"
          color="primary"
          @click="rightDrawer = true"
        />
      </q-page-sticky>
    </q-layout>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  provide,
  computed,
} from '@vue/composition-api';
import { store } from '~/store';

export const IconSymbol = Symbol('icons');

export default defineComponent({
  setup() {
    const rightDrawer = ref(true);
    const reportDrawer = ref(false);
    const reportItems = ref<any[]>([]);
    const hasReports = computed(() => reportItems.value.length !== 0);
    const currentModule = computed(() => store.state.layout.currentModule);
    const menu = ref([]);
    provide(IconSymbol, menu);

    watch(
      currentModule,
      () => {
        if (currentModule.value) {
          reportItems.value = currentModule.value.reports;

          if (hasReports.value) {
            rightDrawer.value = true;
          }
        } else {
          reportItems.value = [];
          rightDrawer.value = false;
        }
      },
      {
        immediate: true,
      }
    );

    return {
      rightDrawer,
      reportDrawer,
      hasReports,
      menu,
    };
  },
  components: {
    LayoutMainHeader: () => import('./components/LayoutMainHeader.vue'),
    LayoutReportDrawer: () => import('./components/LayoutReportDrawer.vue'),
  },
});
</script>
