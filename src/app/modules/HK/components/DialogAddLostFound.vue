<template>
  <SDialog
    v-bind="$attrs"
    v-on="$listeners"
    @show="initFormData"
    class="q-m-md"
  >
    <template #title> New Record </template>
    <template #body>
      <div class="row vhp-inline-container justify-center q-col-gutter-lg">
        <div class="col-6 q-pl-xl">
          <div class="vhp-inline-input">
            <SSelect
              map-options
              emit-value
              :options="types"
              :value="type"
              @input="(value) => setValue('type')(value)"
              @blur="setValue('type')(type)"
              hide-bottom-space
              :error="validators.type.error"
              :error-message="validators.type.msg"
              label-text="Type"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="vhp-inline-input">
            <SInput
              :value="room"
              @input="(value) => setValue('room')(value)"
              @blur="setValue('room')(room)"
              hide-bottom-space
              label-text="Room"
              :error="validators.room.error"
              :error-message="validators.room.msg"
            />
          </div>
          <div class="vhp-inline-input multi row flex-wrap">
            <SDateInput
              class="col-8"
              hide-bottom-space
              :disable="date > Date.now()"
              @input="(value) => setValue('date')(value)"
              @blur="setValue('date')(date)"
              :value="date"
              label-text="Date"
              :error="validators.date.error"
              :error-message="validators.date.msg"
            />
            <STimeInput
              class="col-4 q-pl-sm"
              @input="(value) => setValue('time')(value)"
              @blur="setValue('time')(time)"
              hide-bottom-space
              :value="time"
              :error="validators.time.error"
              :error-message="validators.time.msg"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="vhp-inline-input">
            <SDateInput
              :value="exp"
              :error="validators.exp.error"
              :error-message="validators.exp.msg"
              :disable="exp > Date.now() || type === 0"
              @input="(value) => setValue('exp')(value)"
              @blur="setValue('exp')(exp)"
              label-text="Expired"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input multi row flex-wrap">
            <SInputLimit
              :limit="32"
              :error="validators.claim.error"
              :error-message="validators.claim.msg"
              :disable="!recid"
              class="col-8"
              :value="claim"
              @input="(value) => setValue('claim')(value)"
              @blur="setValue('claim')(claim)"
              label-text="Claimed By"
              hide-bottom-space
            />
            <SDateInput
              class="col-4 q-pl-sm"
              :disable="!recid"
              :error="validators.claim_date.error"
              :error-message="validators.claim_date.msg"
              @input="(value) => setValue('claim_date')(value)"
              @blur="setValue('claim_date')(claim_date)"
              :value="claim_date"
              hide-bottom-space
            />
          </div>
        </div>
        <div class="col-6 offset-6">
          <div class="vhp-inline-input">
            <SInputLimit
              :limit="32"
              :error="validators.desc.error"
              :error-message="validators.desc.msg"
              @input="(value) => setValue('desc')(value)"
              @blur="setValue('desc')(desc)"
              :value="desc"
              label-text="Item"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input multi row flex-wrap">
            <SInputLimit
              :limit="32"
              :error="validators.report.error"
              :error-message="validators.report.msg"
              class="col-8"
              :disable="type === 1"
              :value="report"
              @input="(value) => setValue('report')(value)"
              @blur="setValue('report')(report)"
              label-text="Report By"
              hide-bottom-space
            />
            <SDateInput
              class="col-4 q-pl-sm"
              :error="validators.report_date.error"
              :error-message="validators.report_date.msg"
              :disable="type === 1"
              @input="(value) => setValue('report_date')(value)"
              @blur="setValue('report_date')(report_date)"
              :value="report_date"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input">
            <SInputLimit
              :limit="32"
              :error="validators.found.error"
              :error-message="validators.found.msg"
              :disable="type === 0"
              @input="(value) => setValue('found')(value)"
              @blur="setValue('found')(found)"
              :value="found"
              label-text="Found By"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input">
            <SInputLimit
              :limit="32"
              :error="validators.submitted.error"
              :error-message="validators.submitted.msg"
              :disable="type === 0"
              @input="(value) => setValue('submitted')(value)"
              @blur="setValue('submitted')(submitted)"
              :value="submitted"
              label-text="Submitted By"
              hide-bottom-space
            />
          </div>
        </div>
        <div class="col-6">
          <div class="vhp-inline-input">
            <SInputLimit
              :value="remark"
              :error="validators.remark.error"
              :error-message="validators.remark.msg"
              @input="(value) => setValue('remark')(value)"
              @blur="setValue('remark')(remark)"
              label-text="Remark"
              :limit="32"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input">
            <SInputLimit
              :value="phone"
              :error="validators.phone.error"
              :error-message="validators.phone.msg"
              :disable="type === 1"
              @input="(value) => setValue('phone')(value)"
              @blur="setValue('phone')(phone)"
              label-text="Phone"
              :limit="32"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input">
            <SInputLimit
              :value="location"
              :error="validators.location.error"
              :error-message="validators.location.msg"
              @input="(value) => setValue('location')(value)"
              @blur="setValue('location')(location)"
              label-text="Location"
              :limit="32"
              hide-bottom-space
            />
          </div>
          <div class="vhp-inline-input">
            <SInputLimit
              :value="ref"
              @input="(value) => setValue('ref')(value)"
              @blur="setValue('ref')(ref)"
              :error="validators.ref.error"
              :error-message="validators.ref.msg"
              label-text="Reference"
              :limit="32"
              hide-bottom-space
            />
          </div>
        </div>
      </div>
    </template>
    <template #action-cancel>
      <q-btn auto-close label="Cancel" color="primary" flat class="q-mr-sm" />
    </template>
    <template #action-ok>
      <q-btn ref="okBtn" @click="addRecord" label="Save" color="primary" />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

let setAll = (obj, val) => Object.keys(obj).forEach((k) => (obj[k] = val));
let setNull = (obj) => setAll(obj, '');

export default defineComponent({
  inheritAttrs: true,
  props: {
    record: { type: Object, default: null },
  },
  setup(props, { root: { $api }, emit, refs }) {
    const formData = reactive({ ...props.record });
    const types = [
      { value: 0, label: 'Lost' },
      { value: 1, label: 'Found' },
    ];

    function initFormData() {
      setNull(formData); // reset
      Object.assign(formData, { ...props.record }); // setup
      Object.assign(validators, initValidator());
    }

    const roomInfo = usePrepare(
      false,
      (room) => $api.housekeeping.getRoomAddLostFound(room),
      (tempData: any) => {
        const error = {
          error: tempData.msgStr !== '',
          msg: tempData.msgStr,
        };
        Object.assign(validators, { room: error });
      }
    );
    [].reduce;
    const initValidator = () =>
      Object.keys(props.record).reduce((prev, key) => {
        return {
          ...prev,
          [key]: {
            error: false,
            msg: '',
          },
        };
      }, {});
    const validators = reactive(initValidator());

    function addRecord() {
      for (const [key, val] of Object.entries(formData)) {
        if (validators[key].error === false) {
          if (
            requiredFields.includes(key) &&
            !ignoreFields[formData.type].includes(key)
          ) {
            if (key !== 'type' && (!val || val.length === 0)) {
              const error = {
                error: true,
                msg: `${key} is required`,
              };
              Object.assign(validators, { [key]: error });
              return false;
            }
          }
        } else {
          return false;
        }
      }
      emit('add-record', formData);
    }

    const requiredFields = [
      'type',
      'date',
      'exp',
      'claim',
      'desc',
      'report',
      'found',
      'submitted',
      'remark',
      'phone',
      'location',
      'ref',
    ];
    // lost [0] and found[1]
    const ignoreFields = [
      ['exp', 'found', 'submitted'],
      ['report', 'report_date', 'phone'],
    ];

    function setValue(key: string) {
      return (data: any) => {
        if (!!~requiredFields.indexOf(key)) {
          let error = null;
          if (!data && key !== 'type') {
            error = {
              error: true,
              msg: `${key} is required`,
            };
          } else {
            error = {
              error: false,
              msg: '',
            };
          }
          Object.assign(validators, { [key]: error });
        }
        if (key === 'room') {
          roomInfo.refetch(data);
        }
        Object.assign(formData, { [key]: data });
      };
    }

    return {
      ...toRefs(formData),
      types,
      addRecord,
      setValue,
      roomInfo,
      initFormData,
      validators: toRefs(validators),
    };
  },
});
</script>
<style lang="scss">
.vhp-inline-input {
  &.multi *:first-child label:nth-child(2) {
    flex: 1;
  }
  & > div:first-child {
    display: flex;
    justify-content: flex-start;
    label:first-child {
      flex: 1;
      margin-right: 8px;
    }
    label:nth-child(2) {
      flex: 2;
    }
  }
}
.vhp-inline-container {
  & > div:first-child {
    margin-right: 50%;
  }
  & > div:last-child {
    margin-right: 50%;
  }
  > *:not(:first-child) {
    padding: 0;
    padding-left: 48px;
  }
}
</style>
