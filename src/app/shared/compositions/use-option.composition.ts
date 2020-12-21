import { mapWithField } from '~/app/helpers/mapSelectItems.helpers';
import { reactive, computed } from '@vue/composition-api';

export function useOption(resLabel) {
  const state = reactive({
    prepareOptions: [],
    options: [],
  });

  const filterOptions = (val) => {
    state.options = state.prepareOptions.filter(
      (v: any) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
    );
  };

  const filter = (val, update) => {
    update(() => {
      filterOptions(val);
    });
  };

  const options = computed({
    get: () => state.options,
    set: (v) => (state.prepareOptions = mapWithField(v, resLabel, resLabel)),
  });

  return { options, filter };
}
