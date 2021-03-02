import { computed } from '@vue/composition-api';

type Emit = (event: string, ...args: any[]) => void;

export function useModelWrapper<
  T extends Record<string, any>,
  K extends keyof T
>(props: T, emit: Emit, name: K, sync = true) {
  return computed({
    get: () => props[name],
    set: (value) => emit(sync ? `update:${name}` : 'input', value),
  });
}
