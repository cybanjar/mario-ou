<template>
    <q-dialog v-model="dialogConfirm.confirm" persistent>
      <q-card style="marginTop: -200px; width: 400px">
        <q-card-section class="row items-center">
          <div style="color: #e30202; marginRight: 20px"><span class="mdi mdi-alert-circle mdi-36px"></span></div>
            {{dialogConfirm.message}}
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn unelevated size="sm" label="Oke" color="primary" @click="onClickConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        dialogConfirm: {} as any
    },
    setup(_, { root: {$router}}){
      const onClickConfirm = () => {
        $router.push('/')
      }
      return{
        onClickConfirm
      }
    }
})
</script>