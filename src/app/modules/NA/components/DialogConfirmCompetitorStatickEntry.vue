<template>
    <q-dialog v-model="dialogConfirm.confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div style="color: #1890FF; marginRight: 20px"><span class="mdi mdi-help-circle mdi-36px"></span></div>
          Are you sure want to store this record(s)?
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn unelevated size="sm" label="Oke" color="primary" @click="onClickConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';

export default defineComponent({
    props: {
        dialogConfirm: {} as any
    },
    setup(props, {emit}){
      const onClickConfirm = () => {
        emit('onClickConfirmSave', props)
      }
      return{
        onClickConfirm
      }
    }
})
</script>