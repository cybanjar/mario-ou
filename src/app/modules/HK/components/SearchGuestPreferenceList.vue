<template>
  <section class="mt-7">
    <div class="menu-box row q-pa-md">
      <div @click="$emit('add')" class="col-4 row items-center justify-center">
        <q-icon
          name="mdi-file-import"
          class="text-primary col-12"
          style="font-size: 32px"
        />
        <span class="col-12 text-center">New</span>
      </div>
      <div @click="$emit('edit')" class="col-4 row items-center justify-center">
        <q-icon
          name="mdi-file-edit"
          class="text-primary col-12"
          style="font-size: 32px"
        />
        <span class="col-12 text-center">Edit</span>
      </div>
      <div
        id="pref-delete"
        @click="$emit('delete')"
        class="col-4 row items-center justify-center"
      >
        <q-icon
          name="mdi-delete-forever"
          class="text-primary col-12"
          style="font-size: 32px"
        />
        <span class="col-12 text-center">Delete</span>
      </div>
    </div>
    <q-separator />
    <div class="search-box q-pa-md">
      <SInput
        v-model="searchRoom"
        ref="search"
        label-text="Search Room Number"
      />
      <q-btn
        block
        color="primary"
        max-height="28"
        label="Search"
        type="submit"
        @click="() => guestPrep.refetch(searchRoom)"
        class="q-mt-md full-width"
      />
    </div>
    <SRemarkLeftDrawer
      class="q-pa-md"
      label="GuestName"
      :value="guestPrep.data.raw.guestName"
    />
    <q-separator />
  </section>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const searchRoom = ref('');
    const guestPrep = usePrepare(
      false,
      (room) => {
        console.log(room);

        return $api.housekeeping.getGuestPreferenceQueryRooms({
          caseType: '11',
          zinr: room,
        });
      },
      (tempData: any) => {
        if (!tempData.guestName && tempData.msgStr) {
          $q.notify({
            type: 'negative',
            message: tempData.msgStr,
          });
        }
      },
      undefined,
      { guestName: '' }
    );

    return { guestPrep, searchRoom };
  },
});
</script>
