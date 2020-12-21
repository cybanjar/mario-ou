<template>
  <div class="q-mb-md">
    <q-btn
      v-for="btnAction in btnActions"
      :key="btnAction.name"
      flat
      round
      class="q-mr-lg"
    >
      <img
        :src="require(`~/app/icons/Icon-${btnAction.name}.svg`)"
        height="30"
        @click="btnAction.listener"
      />
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
        {{ btnAction.name }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

interface ActionProps {
  name: string;
  position: string | number;
}

interface Props {
  actions: ActionProps[] | string[];
}

export default defineComponent<Props>({
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const btnActions: any[] = [];

    ['Refresh', 'Print', ...props.actions].forEach((action: any) => {
      let name;
      if (typeof action === 'string') {
        name = action;
      } else {
        name = action.name;
      }

      const actionItem = {
        name,
        listener: () => {
          emit('onActions', `on${name}`);
        },
      };
      if (typeof action !== 'string' && action.position === 'prefix') {
        btnActions.unshift(actionItem);
      } else {
        btnActions.push(actionItem);
      }
    });

    return {
      btnActions,
    };
  },
});
</script>
