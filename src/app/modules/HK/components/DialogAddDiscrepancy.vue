<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 510px; overflow: visible;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          New Record
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row q-col-gutter-sm items-center q-mb-md">
          <div class="col-3 text-right">Room</div>
          <div class="col-3">
            <SInput v-model="roomNumber" input-classes="" debounce="500" />
          </div>
          <div class="col-6">
            <q-spinner
              v-if="isFetching"
              color="primary"
              size="1.5em"
              :thickness="4"
            />

            <span
              v-if="errorMsg !== ''"
              class="text-red"
              style="font-size: 10px;"
            >
              {{ errorMsg }}
            </span>
          </div>
        </div>

        <div class="row q-col-gutter-sm items-center q-mb-md">
          <div class="col-3 text-right">Front Office</div>
          <div class="col-3">
            <SInput
              v-model="statusFO"
              input-classes=""
              placeholder="Status"
              disable
            />
          </div>
          <div class="col-3">
            <SInput
              type="number"
              v-model.number="adultFO"
              input-classes=""
              :disable="invalidRoom"
              min="0"
            >
              <template v-slot:prepend>
                <div class="left-box">
                  Adult
                </div>
              </template>
            </SInput>
          </div>
          <div class="col-3">
            <SInput
              type="number"
              v-model.number="childFO"
              input-classes=""
              :disable="invalidRoom"
              min="0"
            >
              <template v-slot:prepend>
                <div class="left-box">
                  Child
                </div>
              </template>
            </SInput>
          </div>
        </div>

        <div class="row q-col-gutter-sm items-center q-mb-md">
          <div class="col-3 text-right">Housekeeping</div>
          <div class="col-3">
            <SSelect
              v-model="statusHK"
              :options="['Vacant', 'Sleep Out']"
              input-classes=""
              :clearable="false"
              :disable="invalidRoom"
            />
          </div>
          <div class="col-3">
            <SInput
              type="number"
              v-model.number="adultHK"
              input-classes=""
              :disable="invalidRoom"
              min="0"
            >
              <template v-slot:prepend>
                <div class="left-box">
                  Adult
                </div>
              </template>
            </SInput>
          </div>
          <div class="col-3">
            <SInput
              type="number"
              v-model.number="childHK"
              input-classes=""
              :disable="invalidRoom"
              min="0"
            >
              <template v-slot:prepend>
                <div class="left-box">
                  Child
                </div>
              </template>
            </SInput>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-3 text-right">
            <p style="margin-top: 2px;">Comment</p>
          </div>
          <div class="col-9">
            <SInput
              v-model="comment"
              counter
              maxlength="30"
              :disable="invalidRoom"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          dense
          outline
          color="primary"
          label="Cancel"
          @click="onCancel"
          class="q-mr-sm"
        />

        <q-btn
          dense
          color="primary"
          label="Save"
          :loading="isAdding"
          :disable="isAdding"
          @click="onClickAdd"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  watch,
} from '@vue/composition-api';

interface State {
  isFetching: boolean;
  isAdding: boolean;
  invalidRoom: boolean;
  roomNumber: string;
  statusFO: string;
  adultFO: number;
  childFO: number;
  statusHK: string;
  adultHK: number;
  childHK: number;
  comment: string;
  errorMsg: string;
}

const initialForm = {
  roomNumber: '',
  statusFO: '',
  adultFO: 0,
  childFO: 0,
  statusHK: 'Status',
  adultHK: 0,
  childHK: 0,
  comment: '',
  errorMsg: '',
};

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isFetching: false,
      isAdding: false,
      invalidRoom: true,
      ...initialForm,
    });

    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('update:dialog', val);
      },
    });

    function resetState() {
      for (const key in initialForm) {
        state[key] = initialForm[key];
      }
    }

    watch(
      () => state.roomNumber,
      async (roomNumber) => {
        state.errorMsg = '';
        if (roomNumber !== '') {
          state.isFetching = true;
          const [, res] = await $api.housekeeping.getStoreRoomDiscrepancyList({
            caseType: 'of-zinr',
            zinNo: roomNumber,
          });

          if (res) {
            if (res.msgStr !== '') {
              state.errorMsg = res.msgStr;
            } else {
              state.statusFO = res.foStat;
              state.statusHK = 'Vacant';
              state.invalidRoom = false;
            }
          }

          state.isFetching = false;
        }
      }
    );

    function onCancel() {
      state.isAdding = false;
      dialogModel.value = false;
      resetState();
    }

    async function onClickAdd() {
      state.isAdding = true;

      await $api.housekeeping.getStoreRoomDiscrepancyList({
        zinNo: state.roomNumber,
        caseType: 'of-exit',
        fstat: state.statusFO,
        hkStat: state.statusHK,
        comment: state.comment,
        fadult: state.adultFO,
        fchild: state.childFO,
        hkadult: state.adultHK,
        hkchild: state.childHK,
      });

      onCancel();
      emit('onAddDiscrepancy');
    }

    return {
      ...toRefs(state),
      dialogModel,
      onCancel,
      onClickAdd,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.left-box {
  // background-color: #fafafa;
  border-right: 1px solid $primary;
  font-size: 14px;
  padding-right: 12px;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
