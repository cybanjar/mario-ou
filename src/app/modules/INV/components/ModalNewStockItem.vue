<template>
  <q-dialog v-model="dataDialog.dialog" persistent position="top">
    <q-card style="width: 950px; max-width: 90vw; height: 470px; marginTop: 32px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Add</q-toolbar-title>
      </q-toolbar>
      <q-card-section style="height: auto;">
        <SInput 
        v-for="input in inputCategory.filter(i => ['Name'
        ].includes(i.label))"
        :label-text="input.label"
        :key="input.label"
        :style="{width: input.width, marginLeft: input.marginLeft}" 
        v-model="input.value" />
        <q-splitter v-model="splitterModel" style="height: 290px;">
          <template v-slot:before>
            <q-tabs v-model="tab" 
            vertical active-color="primary" 
            dense
            no-caps
            inline-label
            indicator-color="primary">
              <q-tab style="marginLeft: 37px" name="category" label="Category" />
              <q-tab style="marginLeft: 19px" align="right" name="UnitPrice" label="Unit & Price" />
              <q-tab name="Additional" label="Additional Info" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="category" style="marginTop: -20px">
                <SSelect
                  :key="input.label"
                  v-for="input in inputCategory.filter(x => [
                  'Main Group', 'Sub Group'].includes(x.label))"
                  :label-text="input.label"
                  :options="input.options"
                  v-model="input.value"
                  :style="{width: input.width}"
                  @input="clickMainGrup(input)"
                />
                <div class="row">
                  <SInput
                  :key="input.label" 
                  v-for="input in inputCategory.filter(x => ![
                  'Main Group', 'Sub Group', 'Name'].includes(x.label))"
                  :label-text="input.label"
                  :style="{width: input.width, marginTop: input.mt, marginLet: input.mL}" 
                  v-model="input.value" 
                  disable>              
                    <div v-if="input.label == ''"
                    style="marginLeft: -10px" 
                    >
                      <span v-if="result" class="mdi mdi-refresh mdi-24px mdi-spin"/>
                      <span v-else class="mdi mdi-refresh mdi-24px"/>
                    </div>
                  </SInput>
                </div>
                <div>
                Daily Market
                </div>
                <q-btn-toggle
                  class="my-custom-toggle"
                  v-model="model"
                  size="sm"
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="black"
                  :options="[
                    {label: 'No', value: 'no'},
                    {label: 'Yes', value: 'yes'}
                  ]"
                />
              </q-tab-panel>

              <q-tab-panel name="UnitPrice" style="marginTop: -20px">
                <div class="row">
                  <SInput
                    bg-radius="red"
                    :key="input.label"
                    v-for="input in UnitPrice.filter(x => [
                    'Delivery Unit', 'Mess Unit',
                    'Recipe Unit', 'Recipe Number'].includes(x.label))"
                    :style="{width: input.width, marginRight: input.mR}"
                    :label-text="input.label"
                    v-model="input.value"
                    :placeholder="input.placeholder"
                    @click="modalRecipe(input.onClick)"
                    @keyup="valueDelUnit(input)"
                  />
                  <span 
                  :key="i.label" 
                  v-for="i in inputUnitPrice" 
                  id="judul" 
                  :style="{marginRight: i.mR}"> {{i.label}}
                   <span class="mdi mdi-alert-circle-outline mdi-18px">
                      <q-tooltip anchor="center right" self="top left" :offset="[10, 10]">
                        <div :key="val" v-for="val in i.value">{{val}}<br/></div> 
                      </q-tooltip>
                   </span>
                  </span>
                  <div 
                  :key="input.label" 
                   v-for="input in UnitPrice.filter(x => ![
                  'Delivery Unit', 'Mess Unit', 
                  'Recipe Unit', 'Recipe Number'].includes(x.label))">
                  <div :style="{marginTop: input.top, marginLeft: input.mL1}">{{input.label}}</div>                    
                  <SInput
                    :key="input.label"
                    :style="
                    {
                    width: input.width, 
                    marginRight: input.mR,
                    marginLeft: input.mL
                    }"
                    v-model="input.value"
                    :placeholder="input.placeholder"
                    :disable="input.disable"
                  />
                    </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="Additional" style="marginTop: -20px">
                <div class="row">
                  <SInput
                   :key="input.label"
                   v-for="input in inputAdditional"
                   :style="{
                   width: input.width,
                   marginRight: input.mR,
                   marginLeft: input.mL,
                   marginTop: input.mT}"
                   :label-text="input.label"
                   v-model="input.value"
                   :disable="input.disable"
                   @click="noRekening(input.onClick)"
                  />
                </div>
                <q-btn-toggle
                  class="my-custom-toggle"
                  v-model="model"
                  size="sm"
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="black"
                  :options="[
                    {label: 'No', value: 'no'},
                    {label: 'Yes', value: 'yes'}
                  ]"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card-section>
      <q-separator style="marginTop: -18px" />
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn size="sm" outline color="primary" label="Cancel" v-close-popup />
        <q-btn unelevated size="sm" @click="saveData" color="primary" label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
    <ModalRecipeNumber :dataRecipe="dataRecipe" @onClickNumber="onClickNumber"/>
    <dialogAcountNumber :dataAccount="dataAccount" @onClickAccount="onClickAccount" />
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  computed,
  reactive,
  toRefs,
  watch,
} from '@vue/composition-api';
import {
inputCategory, 
inputAdditional,

UnitPrice, 
inputUnitPrice} from '../tables/stockItem.table'
import {dataArticel, dataAccount} from '../utils/params.stockItem'

export default defineComponent({
  props: {
    dataDialog: {type: Object, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      isLoading: false,
      inputCategory: inputCategory,
      splitterModel: 20,
      totalBudget: 0,
      columns: [],
      model: 'no',
      model2: 'no',
      tab: 'category',
      modelRecipeNumber: '',
      modelAccountNumber: '',
      inputName: '',
      result: false,
      dataRecipe: {
        data: [],
        dialogArticel: false,
        hide_bottom: false
      },
      dataAccount: {
        dialog: false,
        data: []
      }
    });

    // helper
    const MAP_DATA = (data) => {
      return data.map(items => ({
        label: `${items.zwkum} - ${items.bezeich}`,
        value: items.zwkum
      }))
    }

    const FETCH_API = async (api, body) => {
      const [GET_DATA, GET_AR] = await Promise.all([
        $api.inventory.FetchAPIINV(api, body),
        $api.inventory.FetchAPIAR(api, body)
        ])
      switch (api) {
        case 'getInvSubGroup':
          const data = GET_DATA.szwkumList['szwkum-list']
          inputCategory[1].options = MAP_DATA(data)
          break;
        case 'getInvArtNo':
          setTimeout(() => {
            inputCategory[2].value = GET_DATA.outInt
            if(inputCategory[2].value !== null){
              state.result = false
            }
          }, 2000)
          break;
        case 'getInvRecipe':
          const x = GET_DATA.tHRezept['t-h-rezept']
          state.dataRecipe.data = dataArticel(x)
          if (state.dataRecipe.data.length !== 0) {
            state.dataRecipe.hide_bottom = true
          }
          break;
        default:
          const dataacct = GET_AR.glacctList['glacct-list']
          state.dataAccount.data = dataAccount(dataacct)
          break;
      }
    }

    onMounted(()=> {
      FETCH_API('getPrepareSelectGLAcct',{
        currDept: 0
      })
      FETCH_API('getInvRecipe', {
        caseType: 2,
        int1: '',
        int2: '',
        int3: '',
        char1: '',
        date1: '',
      })
    })

    const onClickAccount = (params) => {
      state.dataAccount.dialog = false
      inputAdditional[4].value = params

    }

    const valueDelUnit = (value) => {
      if (value.label == 'Delivery Unit') {
        const x = UnitPrice.filter(x => ['1'].includes(x.key))
        for(const i of x){
          if (i.label !== '') {
            if(value.value !== ''){
               i.value = `1 ${value.value}=`
            } else {
              i.value = '1 Unit='
            }
          } else {
            if(value.value !== ''){
              i.value = `@ ${value.value}`
            } else {
              i.value = `@ Unit`
            }
          }
        }
      } 
      if(value.label == 'Mess Unit'){
        const x = UnitPrice.filter(x => ['2'].includes(x.key))
        const xi = inputAdditional.filter(x => ['2'].includes(x.off))
        for(const i of x){
          if (i.label !== '') {
            if (value.value !== '') {
              i.value = `1 ${value.value}=`
            } else {
              i.value = '1 Mess='
            }
          } else {
            if(value.value !== ''){
              i.value = value.value
            } else {
              i.value = 'Mess'
            }
          }
        }
        for(const i of xi){
          if (value.value !== '') {
            i.value = `@${value.value}`
          } else {
            i.value = '@ mess'
          }
        }
      } 
      if(value.label == 'Recipe Unit'){
        if (value.value !== '') {
          UnitPrice[11].value = value.value
        } else {
          UnitPrice[11].value = 'Recipe'
        }
      }
      const xi = UnitPrice.filter(x => [
      'Delivery Unit', 'Mess Unit', 'Recipe Unit'
      ].includes(x.label))
      const xii = UnitPrice.filter(x => ['1'].includes(x.off))
      const ix = inputAdditional.filter(x => ['1'].includes(x.off))
        if (
        xi[0].value !== '' && 
        xi[1].value !== '' && 
        xi[2].value !== ''){
          for(const i of ix.concat(xii as any))
          {
            i.disable = false
          }
        } else {
          for(const i of ix.concat(xii as any))
          {
            i.disable = true
          }
        }
    }

    const modalRecipe = (value) => {
      if (value) {
        state.dataRecipe.dialogArticel = true;
      }
    }

    const clickMainGrup = (value) => {
      if (value.label == 'Main Group') {
        FETCH_API('getInvSubGroup', {
          mainNr: value.value.value
        })
      } else {
        state.result = true
        const x = {
          pvILanguage: 1,
            caseType: 2, 
            inpInt: inputCategory[1].value.value, 
            inpInt2: inputCategory[0].value.value,
            inpChar: ' ',
          }
        FETCH_API('getInvArtNo', x)

      }
    }

    const onClickNumber = (value) => {
      UnitPrice[3].value = value.artnrrezept
      state.dataRecipe.dialogArticel = false
    }

    const noRekening = (value) => {
      if (value) {
        state.dataAccount.dialog = true
      }
    }

    const saveData = () => {
      FETCH_API('addInvArticle', {
        
      })
    }
    const data = () => {



    // function saveData() {
    //   async function saveData() {
    //     const saveData = await Promise.all([
    //       $api.inventory.apiStockItem('addInvArticle', {
    //         artnr: state.totalBudget.toString(),
    //         bezAend: state.model,
    //         dmlArt: state.model2,
    //         fibukonto: state.modelAccountNumber,
    //         pvILanguage: 1,
    //         sUnit: state.unitPrice.recipeUnit,
    //         lArt: {
    //           'l-art': [
    //             {
    //               alkoholgrad: undefined,
    //               anzverbrauch: state.additional.maxStock,
    //               artnr: state.totalBudget.toString(),
    //               betriebsnr: state.modelRecipeNumber,
    //               bezeich: state.inputName,
    //               'ek-aktuell': state.unitPrice.unitPrice1,
    //               'ek-letzter': state.unitPrice.unitPrice2,
    //               endkum: state.subMain.mains.value,
    //               fibukonto: state.modelAccountNumber,
    //               inhalt: state.unitPrice.UnitConvertion2,
    //               jahrgang: state.model == 'no' ? '0' : '1',
    //               'lief-artnr[1]': '?',
    //               'lief-artnr[2]': '?',
    //               'lief-artnr[3]': '?',
    //               'lief-einheit': state.unitPrice.UnitConvertion1,
    //               'lief-nr1': '?',
    //               'lief-nr2': '?',
    //               'lief-nr3': '?',
    //               masseinheit: state.unitPrice.messUnit,
    //               'min-bestand': state.additional.minStock,
    //               traubensorte: state.unitPrice.DeliveryUnit,
    //               'vk-preis': state.unitPrice.unitPrice3,
    //               'wert-verbrau': '0',
    //               zwkum: state.subGroup.subs.value,
    //             },
    //           ],
    //         },
    //         ttArtnr: {
    //           'tt-artnr': [],
    //         },
    //         ttContent: {
    //           'tt-content': [],
    //         },
    //       }),
    //     ]);
    //   }
    //   saveData();
    // }
    }



    return {
      valueDelUnit,
      modalRecipe,
      UnitPrice,
      onClickAccount,
      noRekening,
      onClickNumber,
      clickMainGrup,
      inputUnitPrice,
      inputAdditional,
      saveData,
      ...toRefs(state),
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },

  components: {
    ModalRecipeNumber: () => import('./ChildComponent/ModalRecipeNumber.vue'),
    dialogAcountNumber: () => import('./ChildComponent/ModalChileStockItme.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.my-custom-toggle {
  border: 1px solid #027be3;
  height: 30px;
}

.inputName {
  width: 500px;
  margin-left: 200px;

}

#judul {
 font-weight: bold
}
.UnitConvertion {
  border-radius: 4px;
  border: 1px solid $primary;
  width: 200px;
  span {
    display: inline-block;
    padding: 3px 25px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
