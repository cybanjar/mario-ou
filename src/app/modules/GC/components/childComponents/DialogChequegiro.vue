<template>
    <q-dialog v-model="dialogcheck_giro.dialog" persistent>
      <q-card style="marginTop: -90px">
        <q-toolbar>
           <q-toolbar-title 
            class="text-white text-weight-medium">
              New
           </q-toolbar-title>
        </q-toolbar>

        <q-card-section style="marginTop: 20px" class="q-pt-none">
            <div class="row justify-center">
            <SInput 
              v-for="x in use_input.filter(x => [
                'Bank Name', 'To Name'
              ].includes(x.name))"
              :label-text="x.name"
              :key="x.name"
              :style="{marginRight: x.right, marginLeft: x.left}"
              v-model="x.value"
              />
            <SSelect 
              v-for="x in use_input.filter(x => [
                'Account Number'
              ].includes(x.name))"
              :label-text="x.name"
              :key="x.name"
              :options="x.options"
              v-model="x.value"
              :style="{marginRight: x.right, marginLeft: x.left, width: '180px'}"
              />
            <SInput 
              v-for="x in use_input.filter(x => [
                'Giro Number'
              ].includes(x.name))"
              :label-text="x.name"
              :key="x.name"
              v-model="x.value"
              :style="{marginRight: x.right, marginLeft: x.left}"
              />
            </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn unelevated size="sm" v-close-popup color="primary" outline label="Cancel" />
          <q-btn :loading="loading" @click="save" unelevated size="sm" color="primary"  label="OK" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs} from '@vue/composition-api';
import { input_giro } from '../../Input/cheque_giro'
export default defineComponent({
    props: {
        dialogcheck_giro: {} as any
    },
    setup(_, {root: { $api }, emit}){
        const state = reactive({
            use_input: input_giro,
            loading: false
        })

        const FETCH_DATA =  async (api, body) => {
            const GET_DATA = await $api.generalCashier.FetchAPI(api, body)
        }
        const save = () => {
            state.loading = true
            setTimeout(() => {
            state.loading = false
                emit('savecheckgiro')
            },3000)
        }
        return {
            ...toRefs(state),
            save
        }
    }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>