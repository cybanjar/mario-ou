<template>
    <q-dialog v-model="dialogDelete.confirm" persistent>
      <q-card >
        <q-card-section class="row items-center">
          <div style="color: #de9802; marginRight: 20px"><span class="mdi mdi-help-circle-outline mdi-36px"></span></div>
          <div>
            <span style="fontWeight: 600">Delete</span>  
            <br/>
            <span style="color: grey">{{dialogDelete.message}}</span>
          </div> 
        </q-card-section>
        <q-card-actions align="right">
          <q-btn unelevated size="sm" label="no" outline color="grey" v-close-popup @click="onClickCancel"/>
          <q-btn 
          :loading="dialogDelete.isLoading" 
          unelevated 
          size="sm" 
          label="Yes" 
          style="backgroundColor: #e63766; color: #fff" 
          @click="onClickDelete"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        dialogDelete: {} as any
    },
    setup(props, {emit}){
      const onClickDelete = () => {
        emit('onClickDelete', props.dialogDelete)
      }

      const onClickCancel = () => {
        emit('onClickCancel', props.dialogDelete)
      }
      return{
        onClickDelete,
        onClickCancel
      }
    }
})
</script>