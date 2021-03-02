<template>
    <q-dialog v-model="DeletedRow.confirm" persistent>
      <q-card style="marginTop: -200px; width: 400px">
        <q-card-section class="row items-center">
          <div class="col col-md-2">
            <div style="color: #ff0d0d; marginRight: 20px"><span class="mdi mdi-delete mdi-36px"></span></div>
          </div>
          <div class="col col-md-10">
           Delete the phone list: {{DeletedRow.message}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup unelevated size="sm" label="Cancel" outline color="primary" />
          <q-btn unelevated size="sm" label="Oke" color="primary" @click="onClickDeletedData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        DeletedRow: {} as any
    },
    setup(_, {emit}){
      const onClickDeletedData = () => {
        emit('onClickDeletedData')
      }
      return{
        onClickDeletedData
      }
    }
})
</script>