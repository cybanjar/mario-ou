import { AuthState } from './store.model';

export interface ResLogin extends AuthState {
  errMess?: string;
  errorCode?: number;
  languagesList?: {
    ['languages-list']: any;
  };
  iResult: number;
}
