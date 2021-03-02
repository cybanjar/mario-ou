<template>
    <q-dialog v-model="dialogConfirm.confirm" persistent>
      <q-card style="marginTop: -200px; width: 400px">
        <q-card-section class="row items-center">
          <div style="color: #188adb; marginRight: 20px"><span class="mdi mdi-help-circle-outline mdi-36px"></span></div>
            {{dialogConfirm.message}}
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn unelevated size="sm" label="No" color="primary" outline @click="dialogConfirm.confirm = false"/>
          <q-btn unelevated size="sm" label="Yes" color="primary" @click="onClickConfirm" />
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
    setup(props, { emit}){
      const onClickConfirm = () => {
        emit('onClickConfirm', props.dialogConfirm.data)
      }
      return{
        onClickConfirm
      }
    }
})
</script>