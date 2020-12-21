<template>
    <section>
        <q-drawer :value="true" side="left" bordered :width="250" persistent>
            <section class="mt-7">
                <div class="q-pa-md">
                    <q-list padding class="rounded-borders text-primary">
                    <q-item
                        clickable
                        v-ripple
                        :active="tab === 0"
                        @click="onCLickSideCategory(tab = 0)"
                        active-class="my-menu-link">
                            <q-item-section>All</q-item-section>
                    </q-item>

                    <q-item
                        clickable
                        v-ripple
                        :active="tab === 1"
                        @click="onCLickSideCategory(tab = 1)"
                        active-class="my-menu-link">
                            <q-item-section>Food</q-item-section>
                    </q-item>

                    <q-item
                        clickable
                        v-ripple
                        :active="tab === 2"
                        @click="onCLickSideCategory(tab = 2)"
                        active-class="my-menu-link" >
                            <q-item-section>Beverage</q-item-section>
                    </q-item>

                    <q-item
                        clickable
                        v-ripple
                        :active="tab === 3"
                        @click="onCLickSideCategory(tab = 3)"
                        active-class="my-menu-link" >
                            <q-item-section>Other</q-item-section>
                    </q-item>
                    </q-list>
                </div>
            </section>
        </q-drawer>

        <div class="q-pa-lg">
            <div class="q-mb-md">
                <!-- <q-tabs
                    v-model="tabcategory"
                    dense
                    class="text-grey"
                    active-color="primary"
                    indicator-color="primary"
                    align="justify"
                    narrow-indicator >
                    <template v-for="datarow in datafilteredcategory">
                        <q-tab :name="datarow.nr" :label="datarow.name" />
                    </template>
                </q-tabs> -->
            </div>

            <STable
                grid
                hide-header
                :loading="isFetching"
                :data="datafilteredarticle"
                :columns="tableHeaders"
                separator="cell"
                :rows-per-page-options="[10, 13, 16]"
                :pagination.sync="pagination" />

            <q-drawer :value="true" side="right" bordered :width="250" persistent>
                <section class="mt-7">
                    <div class="q-pa-md">
                        <q-btn color="primary" label="Tes" class="q-mt-md full-width"/>
                    </div>
                </section>
            </q-drawer>
        </div>

        
    </section>
</template>

<script>
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';

export default defineComponent({
    setup(_, { root: { $api } }) {

    const state = reactive({
      isFetching: true,
      build: [],
      tab: 0,
      tabcategory: 0,
      datacategory: [{"name": "Cat 1" , "nr" : 0, "scat": 0}, {"name": "Cat 2" , "nr" : 1, "scat": 1}, {"name": "Cat 3" , "nr" : 2, "scat": 2}, {"name": "Cat 4" , "nr" : 3, "scat": 3}],
      datafilteredcategory: [{"name": "Cat 1" , "nr" : 0, "scat": 0}, {"name": "Cat 2" , "nr" : 1, "scat": 1}, {"name": "Cat 3" , "nr" : 2, "scat": 2}, {"name": "Cat 4" , "nr" : 3, "scat": 3}],
      dataarticle: [{"name": "Art 1" , "nr" : 0, "cat": 0}, {"name": "Art 2" , "nr" : 1, "cat": 1}, {"name": "Art 3" , "nr" : 2, "cat": 2}],
      datafilteredarticle: [{"name": "Art 1" , "nr" : 0, "cat": 0}, {"name": "Art 2" , "nr" : 1, "cat": 1}, {"name": "Art 3" , "nr" : 2, "cat": 2}]
    });

    const tableHeaders = [
      {
        label: 'Nr',
        field: 'nr',
        sortable: false,
        align: 'center',
        width: 120,
        divider: true,
      },
      {
        label: 'Name',
        field: 'name',
        sortable: false,
        align: 'right',
        width: 200,
        divider: true,
      },
    ];

    onMounted(async () => {      
        state.datafilteredcategory = [];
        state.datafilteredcategory = state.datacategory.filter(function(item){
            return item.scat == 0;         
        })
        state.tabcategory = state.datafilteredcategory[0]['nr'];

        state.datafilteredarticle = [];
        state.datafilteredarticle = state.dataarticle.filter(function (item) {
            return item.cat == state.tabcategory;
        })
    });

    const onCLickSideCategory = (cat) => {
        state.datafilteredcategory = [];
        state.datafilteredcategory = state.datacategory.filter(function(item){
            return item.scat == cat;         
        })
        state.tabcategory = state.datafilteredcategory[0]['nr'];

        state.datafilteredarticle = [];
        state.datafilteredarticle = state.dataarticle.filter(function (item) {
            return item.cat == state.tabcategory;
        })
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onCLickSideCategory,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
})
</script>

<style lang="scss">
.my-menu-link {
  color: white;
  background: $primary;
  border: 4px;
}
</style>