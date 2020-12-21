import { StoreItem, MenuItem } from '~/router/pageList';

export interface LayoutState {
  currentModule: StoreItem & {
    subModules: MenuItem[];
  };
}
