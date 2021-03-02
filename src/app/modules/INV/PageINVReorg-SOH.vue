<template>
    <div>
        <q-dialog v-model="alert" persistent>
          <q-card>
            <q-card-section style="marginTop: 20px" class="q-pt-none">
              This program will reorganize current inventory onhands. Press OK-button to confirm Or Press cancel-button to cancel
            </q-card-section>
            <q-separator/>  
            <q-card-actions align="right">
              <q-btn @click="cancel" outline size="sm" style="height: 25px" label="CANCEL" v-close-popup color="primary" />
              <q-btn @click="onClickParrent" size="sm" style="height: 25px" label="OK" color="primary" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog
          v-model="small"
          persistent
        >
          <q-card style="width: 300px; height: 220px">
            <q-card-section>
              <div>Type of Inventory Main Group</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-card flat bordered class="my-card">
                    <q-option-group
                    v-model="group"
                    :options="options"
                    color="primary"
                    size="sm"
                    />
                </q-card>

            </q-card-section>

            <q-separator/>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn @click="cancel" outline size="sm" style="height: 25px" label="CANCEL" v-close-popup color="primary" />
              <q-btn @click="onClick" size="sm" style="height: 25px" label="OK" color="primary" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="loading">
            <div class="container">
                <div class="loading-br">
                    <div class="percentage" :style="{'width' : percentage + '%' }">
                    </div>
                </div>
            </div>
            <h5 class="number" :style="{'color' : colorNumber}">{{percentage+'%'}}</h5>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';
import { paramsReorg } from './utils/params.inv'
import { Notify } from 'quasar';

export default defineComponent({
    setup(_, { root: { $api }, root }) {
        const state = reactive({
            small: false,
            loading: false,
            alert: true,
            group: 1,
            percentage: 0,
            data: '',
            colorNumber: '#0a0a0a',
            options: [
                {
                label: 'FOOD Articles',
                value: 1
                },
                {
                label: 'BERVERAGE Articles',
                value: 2
                },
                {
                label: 'MATERIAL Articles',
                value: 3
                }
            ]
        })

    const NotifyCreate = (mess, col?, type?) => Notify
      .create({
          message: mess,
          type: 'positive'
    });

        // Fetch Api
        const FETCH_API = async (api) => {
            const [GET_DATA, GET_DATACOMMON] = await Promise.all([
                $api.inventory.FetchAPIINV(api, {
                    artType: 12345
            }),
            $api.inventory.FetchCommon('checkPermission', paramsReorg(state.group))
            ])
            if (GET_DATACOMMON.zugriff == 'true') {
                if (GET_DATA.outputOkFlag == 'true') {
                    if (state.percentage == 0) {                        
                        const interval = setInterval(() => {
                            if (state.percentage < 25) {
                                state.percentage += 1
                                if (state.percentage == 25) {
                                    state.data = GET_DATA.outputOkFlag
                                }
                            } else {
                                clearInterval(interval)
                            }
                        },100)
                    } else {
                        state.data = GET_DATA.outputOkFlag
                    }
                }
            } else {
                alert('User not found.')
            }
        }


        watch(() => state.data,
        (data) => {
            if (data = 'true') {
                if (state.percentage == 25) {
                    const interval = setInterval(() => {
                        if (state.percentage < 50){
                            state.percentage += 1
                            if (state.percentage == 50) {
                                state.data = ''
                                FETCH_API('reorgMonhandUpdEingang')
                            }
                        } else {
                            clearInterval(interval)
                        }
                    }, 100)
                } else if (state.percentage == 50) {
                    state.colorNumber = '#ffffff'
                    const interval = setInterval(() => {
                        if (state.percentage < 75) {
                            state.percentage += 1
                            if (state.percentage == 75) {
                                state.data = ''
                                FETCH_API('reorgMonhandUpdAusgang')
                                }
                        } else {
                            clearInterval(interval)
                        }
                    },100)
                } else {
                    const interval = setInterval(() => {
                        if (state.percentage < 100) {
                            state.percentage += 1
                            if (state.percentage == 100) {
                                FETCH_API('reorgMonhandUpdAverage')
                            }
                        } else {
                            clearInterval(interval)
                            state.small= false
                            state.loading = false
                            // window.history.back();
                            // root.$router.push('/inv/incoming-journalizing')
                        }
                    },100)
                }
            } else {
                alert('error')
            }
        })

        watch(() => state.loading,
        (loading) => {
            if (!loading) {
                NotifyCreate('Sukses')
                setTimeout(() => {
                    root.$router.push('/inv/incoming-journalizing')
                },200)
            }
        })


        const onClick = () => {
        state.loading = true
        FETCH_API('reorgMonhandInit')
        }
        const cancel = () => {
            // window.history.back();
            root.$router.push('/inv/incoming-journalizing')
            state.small= false
            state.loading = false
            state.alert = false
        }
        const onClickParrent = () => {
            state.small = true
            state.alert = false
        }

    return {
    ...toRefs(state),
    onClick,
    cancel,
    onClickParrent
    }
    }
})
</script>

<style lang="scss" scoped>
#group {
  height: 130px;
  justify-content: 'center'
}
    .container {
        background-color: #ffffff;
        border-radius: 20px
    }
    .number {
        position: absolute;
        
    }
    .loading-br {
        position: relative;
        width: 400px;
        height: 30px;
        overflow: hidden;
        border-bottom: 1px solid #ddd;
        border-top-left-radius: 10%;
        box-shadow: inset 0 1px 2px rgba($color: #fff , $alpha: .4), 
                            0 -1px 1px #fff, 0 1px 0 #fff
    }
    .percentage {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        display: block;
        height: 100%;
        background-color: #0799e8;
        background-size: 30px, 30px;
        background-image: linear-gradient(135deg, rgba($color: #fff , $alpha: .15) 25%, transparent 25%,
                                        transparent 50%, rgba($color: #fff , $alpha: .15) 50%,
                                        rgba($color: #fff , $alpha: .15) 75%, transparent 75%,
                                        transparent);
        animation: animate-stripes 3s linear infinite
    }
@keyframes animate-stripes {
    0% { background-position: 0 0;}
    100% {background-position: 60% 0}
}
</style>