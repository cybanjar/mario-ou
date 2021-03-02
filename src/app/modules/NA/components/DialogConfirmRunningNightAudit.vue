<template>
    <q-dialog v-model="dialog.confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div style="color: #1890FF; marginRight: 20px"><span class="mdi mdi-help-circle mdi-36px"></span></div>
          Do you really want to start Night Audit Program now ?
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn unelevated outline size="sm" label="Cancel" color="primary" v-close-popup />
          <q-btn unelevated size="sm" label="Oke" color="primary" @click="onClickConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';

export default defineComponent({
    props: {
        dialog: {} as any
    },
    setup(props, {emit}){
      const onClickConfirm = () => {
        emit('onClickConfirm', props)
      }
      return{
        onClickConfirm
      }
    }
})
</script>