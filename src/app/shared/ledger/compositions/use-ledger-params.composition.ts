import { reactive, ref, watch } from '@vue/composition-api';
import { date } from 'quasar';

export enum LedgerParamType {
  GL = 'gl',
  NonGL = 'non-gl',
}

type State = {
  form: {
    date: {
      before?: Date;
      after?: Date;
    };
    from?: string;
    to?: string;
    display: number;
    excludeOther: boolean;
    includeOther: boolean;
    mainAccount?: number;
    deptAccount?: number;
    sortType: number;
    number?: number;
    closeYear: string;
    currYr: string;
    journalType: number;
    summaryPerDate: boolean;
  };
};

const dateFormatToBL = 'MM/DD/YY';
const dateFormatFromBL = 'YYYY-MM-DD';

// formdata and state data
export function useLedgerParams(module: LedgerParamType) {
  // prepare data

  const state: State = reactive({
    form: {
      date: {
        before: new Date(),
        after: new Date(),
      },
      display: 2,
      excludeOther: false,
      includeOther: false,
      sortType: 2,
      journalType: 0,
      currYr: '',
      closeYear: '2017',
      summaryPerDate: false,
    },
  });
  const disableRef = ref(true);
  const paramsRef = ref({});

  // watch change and assign it into request param

  watch(
    () => state.form,
    (state) => {
      if (!disableRef.value) {
        paramsRef.value = stateToParams({ form: state });
      }
    }
  );

  watch(
    () => disableRef.value,
    (nVal, oVal) => {
      // init when enable
      if (oVal && !nVal) {
        paramsRef.value = stateToParams({ form: state.form });
      }
    }
  );

  function enable() {
    disableRef.value = false;
  }

  function stateToParams({ form: formValue }: State) {
    const closeYear = date.extractDate(formValue.closeYear, dateFormatFromBL);
    const baseParams = {
      fromDate: date.formatDate(formValue.date.before, dateFormatToBL),
      toDate: date.formatDate(formValue.date.after, dateFormatToBL),
      last2Yr: parseInt(formValue.currYr) - 2,
      closeYear: date.formatDate(closeYear, dateFormatToBL),
      // journalType: formValue.journalType,
      summDate: formValue.summaryPerDate ? 'yes' : 'no',
      fromFibu:
        formValue.from === undefined || formValue.from === ''
          ? '00000000'
          : formValue.from.replace(/-/g, ''),
      toFibu:
        formValue.to === undefined || formValue.to === ''
          ? '99999999'
          : formValue.to.replace(/-/g, ''),
      sorttype: formValue.sortType,
      fromDept:
        formValue.deptAccount === undefined ? '' : formValue.deptAccount,
      journaltype1: formValue.journalType === 3 ? 6 : formValue.journalType,
      cashflow: 'no',
    };
    switch (module) {
      case LedgerParamType.GL:
        return {
          ...baseParams,
          exclOther: formValue.excludeOther ? 'yes' : 'no',
        };
      case LedgerParamType.NonGL:
        return {
          ...baseParams,
          otherDept: formValue.includeOther ? 'yes' : 'no',
        };
    }
  }

  return { state, disableRef, enable, paramsRef };
}
