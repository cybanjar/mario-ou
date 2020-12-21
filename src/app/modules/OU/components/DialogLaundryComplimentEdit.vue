<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
       <SSelect
        label-text="Article"
        :options="dataArticle"
        v-model="article" />

        <SInput
          label-text="Name"
          placeholder="Name"
          v-model="name"/>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onCancel()" />
        <q-btn color="primary" label="Save" @click="onSave()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import {displayTime} from '../utilsOU/utils';
import { date, Notify } from 'quasar';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';

interface State {
  isLoading: boolean;
  dataArticle: [];
  // eslint-disable-next-line @typescript-eslint/ban-types
  article: {};
  name: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataRowSelected: {};
}

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    dataSelected: {type: Object, required: true},
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      dataArticle: [],
      dataRowSelected: {},
      article: {},
      name: '',
      title: '',
    });

    const onCancel = () => {
        emit('onDialog', false, false);
    }

    const onSave = () => {
      const artNrSameFlag = (state.dataRowSelected['p-artnr'] == state.article['value']);
      const nameSameFlag = (state.dataRowSelected['name'] == state.name);

      if (!artNrSameFlag) {
        async function asyncCall() {
          const [responseSaveArticle] = await Promise.all([
            $api.outlet.getOUAction('loundryCompArtnr', {
              artnr: state.article['value'],
              cListDept: state.dataRowSelected['dept'], 
              cListDatum: date.formatDate(state.dataRowSelected['dbilldate'], 'MM/DD/YYYY'),
              cListRechnr: state.dataRowSelected['rechnr']
            }),
          ]);

          if (responseSaveArticle) {
            const flagSave = responseSaveArticle['flag'];
            if (flagSave == 2) {
              // console.log("save success", responseSaveArticle);

              if (!nameSameFlag) {
                async function asyncCall() {
                  const [responseSaveName] = await Promise.all([
                    $api.outlet.getOUAction('loundryCompName', {
                      gname: state.name,
                      cListDept: state.dataRowSelected['dept'], 
                      cListRechnr: state.dataRowSelected['rechnr']
                    }),
                  ]);

                  if (responseSaveName) {
                    if (responseSaveName.outputOkFlag) {
                      emit('onDialog', false, true);
                    } else {
                      Notify.create({
                        message: "Saving name failed",
                        color: 'red',
                      });
                      state.isLoading = false;
                      emit('onDialog', false, false);
                      return false;
                    }
                  } else {
                    Notify.create({
                      message: "Please check your internet connection",
                      color: 'red',
                    });
                    state.isLoading = false;
                    emit('onDialog', false, false);
                    return false;
                  }
                }
                asyncCall();
              } else {
                emit('onDialog', false, true);
              }
            } else {
              Notify.create({
                message: "Article not found",
                color: 'red',
              });
              state.isLoading = false;
              emit('onDialog', false, false);
              return false;
            }
          } else {
            Notify.create({
              message: "Please check your internet connection",
              color: 'red',
            });
            state.isLoading = false;
            emit('onDialog', false, false);
            return false;
          }
        }
        asyncCall();
      } else {
        if (!nameSameFlag) {
          async function asyncCall() {
            const [responseSaveName] = await Promise.all([
              $api.outlet.getOUAction('loundryCompName', {
                gname: state.name,
                cListDept: state.dataRowSelected['dept'], 
                cListRechnr: state.dataRowSelected['rechnr']
              }),
            ]);

            if (responseSaveName) {
              if (responseSaveName.outputOkFlag) {
                console.log("save success", responseSaveName);
                emit('onDialog', false, true);
              } else {
                Notify.create({
                  message: "Saving name failed",
                  color: 'red',
                });
                state.isLoading = false;
                emit('onDialog', false, false);
                return false;
              }
            } else {
              Notify.create({
                  message: "Please check your internet connection",
                  color: 'red',
                });
              state.isLoading = false;
              emit('onDialog', false, false);
              return false;
            }
          }
          asyncCall();
        } else {
          emit('onDialog', false, false);
        }
      }   
    }

    const getDataDetailPrepare = (dataSelected) => {
      state.isLoading = true;

      async function asyncCall() {
        const [responseArticle] = await Promise.all([
          $api.outlet.getCommonOutletUserList('loadHArtikel', {
            caseType: 1,
            dept: dataSelected.dept, 
            artType: 11
          }),
        ]);
              
        if (responseArticle) {
          const responseDataArt = responseArticle || [];
          const okFlag = responseDataArt['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          const artList = responseDataArt.tHArtikel['t-h-artikel'];
          state.dataArticle = mapOU(artList, 'artnr', 'bezeich');
            
          for(let i = 0; i<state.dataArticle.length; i++) {
            const artnr = state.dataArticle[i]['value'];

            if (dataSelected['p-artnr'] == artnr) {
              state.article = state.dataArticle[i];
              break;
            }
          }

          const [responsePrepareHelp] = await Promise.all([
            $api.outlet.getOUPrepare('loundryCompBtnHelp', {
              artnr: dataSelected['p-artnr'],
              cListDept: dataSelected.dept, 
              cListDatum: date.formatDate(dataSelected['dbilldate'], 'MM/DD/YYYY'),
              cListRechnr: dataSelected.rechnr
            }),
          ]);
            
          if (responsePrepareHelp) {
            // console.log("response help : ", responsePrepareHelp);
          }
        } else {
          Notify.create({
            message: 'Please check your internet connection',
            color: 'red',
          });
          state.isLoading = false;
          return false;
        }
        state.isLoading = false;
      }
      asyncCall();
    }

    watch(
      () => props.dialog, (show) => {
        if ((props.dialog) && (props.dataSelected != undefined)) {
          state.title = 'Edit Compliment Bill No #' + String(props.dataSelected.rechnr);
            state.dataRowSelected = props.dataSelected;
                
            if (props.dataSelected.name != undefined) {
              state.name = props.dataSelected.name;
            }
            getDataDetailPrepare(state.dataRowSelected);
        }
      }
    );

    const dialogModel = computed({        
        get: () => props.dialog,
        set: (val) => {
            emit('onDialog', val);
        },
    });

    return {
      dialogModel,
      onSave,
      onCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

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
