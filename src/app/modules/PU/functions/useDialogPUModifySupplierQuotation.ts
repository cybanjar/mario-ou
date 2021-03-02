import { defineComponent, computed, ref, watch } from '@vue/composition-api';
import { store } from '~/store';
import { DatePicker } from 'v-calendar';
import TablePUNewPurchaseOrder from '../components/TablePUNewPurchaseOrder.vue';
import { date } from 'quasar';

export default defineComponent({
  components: {
    'v-date-picker': DatePicker,
    TablePUNewPurchaseOrder,
  },

  props: {
    value: { type: Boolean, required: true },
    row: { type: Object, default: null },
  },

  setup(props, { emit, root: { $api } }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val);
      },
    });
    const isPreparing = ref(false);
    const currencyOptions = ref([]);

    (async function () {
      isPreparing.value = true;

      const res = await $api.common.readCurrency();
      currencyOptions.value = res;

      isPreparing.value = false;
    })();

    function setItem() {
      if (props.row !== null) {
        return {
          ...props.row,
          validity: {
            start: props.row['from-date'],
            end: props.row['to-Date'], // TODO: why the upper 'D'
          },
        };
      }

      return {};
    }

    const item = ref<any>(setItem());

    watch(
      () => props.row,
      () => {
        item.value = setItem();
      }
    );

    const dialogCancel = ref(false);
    const dialogConfirm = ref(false);

    function onCancel() {
      dialogCancel.value = true;
    }

    function onSave() {
      dialogConfirm.value = true;
    }

    function onCancelAction(val) {
      dialogCancel.value = false;
      if (val) {
        dialog.value = false;
      }
    }

    const isSaving = ref(false);

    async function onConfirmAction(val) {
      isSaving.value = true;

      const payload = {
        artnr: item.value.artnr,
        'lief-nr': item.value['lief-nr'],
        supName: item.value.supName,
        artName: item.value.artName,
        devUnit: item.value.devUnit,
        content: item.value.content,
        unitprice: item.value.unitprice,
        curr: item.value.curr,
        'from-date': date.formatDate(item.value.validity.start, 'YY/MM/DD'),
        'to-date': date.formatDate(item.value.validity.end, 'YY/MM/DD'),
        remark: item.value.remark,
        filename: ' ',
        activeflag: item.value.activeFlag,
        'docu-nr': item.value['docu-nr'],
        minQty: item.value.minQty,
        delivDay: item.value.delivDay,
        disc: item.value.disc,
        avl: item.value.avl,
      };

      await $api.purchasing.quoteListSave({
        PvILanguage: '1',
        currType: 'chg',
        userInit: store.state.auth.user.userInit,
        tQuote: {
          ['t-Quote']: [payload],
        },
      });

      emit('modified', payload);

      isSaving.value = false;

      dialogConfirm.value = false;

      if (val) {
        dialog.value = false;
      }
    }

    return {
      isPreparing,
      dialog,
      item,
      currencyOptions,
      onCancel,
      onSave,

      dialogCancel,
      dialogConfirm,
      onCancelAction,
      isSaving,
      onConfirmAction,
    };
  },
});
