import { computed, Ref } from '@vue/composition-api';

interface RequiredProps<T> {
  rows: T[];
  selectedRow: T;
}
type Emit = (event: string, ...args: any[]) => void;

export type RowWithIndex<T> = { $_index: number } & T;

export function useSelectedRow<T>(
  props: RequiredProps<T>,
  emit: Emit,
  persistent = false
) {
  const rowsWithIndex = computed(() =>
    props.rows.map<RowWithIndex<T>>((row, index) => ({
      $_index: index,
      ...row,
    }))
  );

  const selected = computed({
    get: () => {
      const selectedRow = props.selectedRow as RowWithIndex<T>;
      return selectedRow ? [selectedRow] : [];
    },
    set: (value) => emit('update:selectedRow', value.length ? value[0] : null),
  });

  function onRowClick(_: MouseEvent, row: RowWithIndex<T>) {
    if (persistent) {
      selected.value = [row];
      return;
    }

    const currentSelected = selected.value[0] as RowWithIndex<T> | undefined;
    if (row.$_index === currentSelected?.$_index) selected.value = [];
    else selected.value = [row];
  }

  return { selected, rowsWithIndex, onRowClick };
}

export function useDirectSelectedRow<T>(
  rowsRef: Ref<T[]>,
  selectedRowRef: Ref<T>,
  persistent = false
) {
  const rowsWithIndex = computed(() =>
    rowsRef.value.map<RowWithIndex<T>>((row, index) => ({
      $_index: index,
      ...row,
    }))
  );

  const selected = computed({
    get: () => {
      const selectedRow = selectedRowRef.value as RowWithIndex<T>;
      return selectedRow ? [selectedRow] : [];
    },
    set: (value) => (selectedRowRef.value = value.length ? value[0] : null),
  });

  function onRowClick(_: MouseEvent, row: RowWithIndex<T>) {
    if (persistent) {
      selected.value = [row];
      return;
    }

    const currentSelected = selected.value[0] as RowWithIndex<T> | undefined;
    if (row.$_index === currentSelected?.$_index) selected.value = [];
    else selected.value = [row];
  }

  return { selected, rowsWithIndex, onRowClick };
}

export function useCustomSelectedRow<T, K extends keyof T>(
  selectedRowRef: Ref<T>,
  rowKey: K,
  persistent = false
) {
  const selected = computed({
    get: () => {
      const selectedRow = selectedRowRef.value;
      return selectedRow ? [selectedRow] : [];
    },
    set: (value) => (selectedRowRef.value = value.length ? value[0] : null),
  });

  function onRowClick(_: MouseEvent, row: T) {
    if (persistent) {
      selected.value = [row];
      return;
    }

    const currentSelected = selected.value[0];
    if (row[rowKey] === currentSelected?.[rowKey]) selected.value = [];
    else selected.value = [row];
  }

  return { selected, onRowClick };
}
