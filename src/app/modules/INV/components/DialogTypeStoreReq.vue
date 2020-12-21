<template>
  <div>
    <q-dialog v-model="dialog.dialog" persistent>
      <q-card style="width: 500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">Type Of Store Requisition</q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <div class="actualQuantity">Actual Quantity</div>
          <div class="q-pa-md">
            <q-option-group
              size="xs"
              :options="options"
              label="Notifications"
              type="radio"
              v-model="group"
              @input="onClickgroup"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="primary" outline size="sm" v-close-popup label="Cancel" />
          <q-btn unelevated size="sm" @click="onClick" color="primary" label="Select" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <AddInterStoreTransfer 
    @trans_code="trans_code" 
    :child_dialog="child_dialog"
    :dialog="dialog"
    />
  </div>
</template>

<script lang="ts">
    import {
      defineComponent,
      computed,
      reactive,
      onMounted,
      toRefs,
      watch,
    } from '@vue/composition-api';

    export default defineComponent({
        props: {
            dialog: {} as any ,
        },
        setup(props,{emit}){
            const state = reactive({
                options: [
                  { label: 'Transfer To Other Storage', value: '1' },
                  { label: 'Outgoing / Consumed', value: '2', color: 'bat' },
                ],
                group: '1',
                child_dialog : {
                    dialog : false,
                    actual : ['From Store', 'To Store'], 
                    actual1 : ['Total Amount']
                }
            })

            const onClick = () => {
              state.child_dialog.dialog = true
              props.dialog.dialog = false
            }

            const trans_code = (val) => {
              emit('trans_code', val, state.group)
            }

            const onClickgroup = () => {
              if (state.group == '1') {
                state.child_dialog.actual = ['From Store', 'To Store']
              } else {
                state.child_dialog.actual = ['From Store']
                state.child_dialog.actual1 = ['Account', 'Total Amount']
              }
            }

            return {
                ...toRefs(state),
                onClick,
                trans_code,
                onClickgroup
            }
        },
        components: {
            AddInterStoreTransfer: () => import('./ChildComponent/AddInterStoreTransfer.vue')
        }
    })
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
.actualQuantity {
  margin-left: 28px;
}
</style>
