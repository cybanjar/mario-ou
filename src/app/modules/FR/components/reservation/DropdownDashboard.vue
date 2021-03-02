<template>
  <q-btn-dropdown
    color="primary"
    no-caps
    icon="mdi-speedometer"
    label="Dashboard"
    class="text-caption"
    size="md"
  >
    <q-list class="dropdown-content">
      <q-card-section>
        <div class="text-h6">Today's Birthday</div>
      </q-card-section>
      <q-separator />

      <q-card-section style="height: 150px">
        <q-item>
          <q-item-section avatar>
            <q-icon size="xs" name="mdi-gift" />
          </q-item-section>
          <q-item-section>Akhmad Rizki</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon size="xs" name="mdi-gift" />
          </q-item-section>
          <q-item-section>Akhmad Rizki</q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />

      <div class="dashboard-info q-pa-lg">
        <q-card>
          <q-item>
            <q-item-section avatar>
              <img :src="require('~/app/icons/FR/Icon-Bed.svg')" height="30" />
            </q-item-section>
            <q-item-section>
              <div class="flex justify-between text-h6">
                <q-item-label>Total Room</q-item-label>
                <q-item-label>{{ totalRoom }}</q-item-label>
              </div>
            </q-item-section>
          </q-item>
        </q-card>

        <q-card>
          <q-item>
            <q-item-section avatar top>
              <img
                :src="require('~/app/icons/FR/Icon-Paying.svg')"
                height="30"
              />
            </q-item-section>
            <q-item-section class="column q-col-gutter-y-xs">
              <div class="flex justify-between text-h6">
                <q-item-label>Paying Guest</q-item-label>
                <q-item-label>{{ payingGuest.total }}</q-item-label>
              </div>
              <div class="flex justify-between">
                <q-item-label>Adult</q-item-label>
                <q-item-label>{{ payingGuest.adult }}</q-item-label>
              </div>
              <div class="flex justify-between">
                <q-item-label>Child</q-item-label>
                <q-item-label>{{ payingGuest.child }}</q-item-label>
              </div>
              <div class="flex justify-between">
                <q-item-label>Infant</q-item-label>
                <q-item-label>{{ payingGuest.infact }}</q-item-label>
              </div>
            </q-item-section>
          </q-item>
        </q-card>

        <q-card>
          <q-item>
            <q-item-section avatar top>
              <img
                :src="require('~/app/icons/FR/Icon-Complimentary.svg')"
                height="25"
              />
            </q-item-section>
            <q-item-section class="column q-col-gutter-y-xs">
              <div class="flex justify-between text-h6">
                <q-item-label>Complimentary Guest</q-item-label>
                <q-item-label>{{ complimentaryGuest.total }}</q-item-label>
              </div>
              <div class="flex justify-between">
                <q-item-label>Adult</q-item-label>
                <q-item-label>{{ complimentaryGuest.adult }}</q-item-label>
              </div>
              <div class="flex justify-between">
                <q-item-label>Child</q-item-label>
                <q-item-label>{{ complimentaryGuest.child }}</q-item-label>
              </div>
            </q-item-section>
          </q-item>
        </q-card>

        <q-card>
          <q-item>
            <q-item-section avatar>
              <img
                :src="require('~/app/icons/FR/Icon-Keycard.svg')"
                height="25"
              />
            </q-item-section>
            <q-item-section>
              <div class="flex justify-between text-h6">
                <q-item-label>Keycard Used</q-item-label>
                <q-item-label>{{ keycardUsed }}</q-item-label>
              </div>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import { Reservation } from '../../models/reservation/reservation.model';

export default defineComponent({
  props: {
    data: { type: Array as PropType<Reservation[]>, default: [] },
  },
  setup(props) {
    const totalRoom = computed(() =>
      props.data.reduce((acc, curr) => acc + curr.zimmeranz, 0)
    );

    const payingGuest = computed(() => {
      const adult = props.data.reduce((acc, curr) => acc + curr.erwachs, 0);
      const child = props.data.reduce((acc, curr) => acc + curr.kind1, 0);
      const infact = props.data.reduce((acc, curr) => acc + curr.kind2, 0);
      const total = adult + child + infact;
      return { adult, child, infact, total };
    });

    const complimentaryGuest = computed(() => {
      const adult = props.data.reduce((acc, curr) => acc + curr.gratis, 0);
      const child = props.data.reduce(
        (acc, curr) => acc + curr['l-zuordnung4'],
        0
      );
      const total = adult + child;
      return { adult, child, total };
    });

    const keycardUsed = computed(() =>
      props.data.reduce((acc, curr) => acc + curr['betrieb-gast'], 0)
    );

    return {
      totalRoom,
      payingGuest,
      complimentaryGuest,
      keycardUsed,
    };
  },
});
</script>

<style lang="scss" scoped>
.dropdown-content {
  color: #333;
  width: 400px;
}

.dashboard-info > .q-card {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
