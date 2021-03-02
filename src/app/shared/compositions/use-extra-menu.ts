import {
  inject,
  InjectionKey,
  onMounted,
  onUnmounted,
} from '@vue/composition-api';

export interface ExtraMenuItem {
  handler: (evt: Event) => void;
  icon: string;
}

export type ExtraMenuProvider = {
  SET_EXTRA_MENU: (items: ExtraMenuItem[]) => void;
  RESET_EXTRA_MENU: () => void;
};

export const extraMenuKey: InjectionKey<ExtraMenuProvider> = Symbol(
  'extraMenuKey'
);

export function useExtraMenu(extraMenuItems: ExtraMenuItem[]) {
  const { SET_EXTRA_MENU, RESET_EXTRA_MENU } = inject(extraMenuKey);
  onMounted(() => SET_EXTRA_MENU(extraMenuItems));
  onUnmounted(() => RESET_EXTRA_MENU());
}
