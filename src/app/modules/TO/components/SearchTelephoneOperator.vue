<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SSelect label-text="Sorting" :options="searches.sorting" v-model="sorting" />
      <SSelect style="marginTop: -10px" label-text="Display" :options="searches.display" v-model="display" />
      <SInput 
      style="marginTop: -5px"
      v-if="name" 
      label-text="Name" 
      v-model="dataInput.valName" />
      <SInput 
      style="marginTop: -5px"
      v-if="nationRoom"
      :label-text="sorting.value == '3' ? 'Nation' : 'Room'" 
      v-model="dataInput.NationdanRomm" />
      <SInput 
      style="marginTop: -5px"
      v-if="resNo" 
      label-text="ResNo" 
      v-model="dataInput.ResNo" />
      
      <v-date-picker 
      v-if="valDate"
      mode="range"
      v-model="date" 
      :popover="{ visibility: 'click' }">
        <SInput
          style="marginTop: -5px"
          label-text="Date"
          slot-scope="{ inputProps }"
          placeholder="Select Date"
          readonly
          v-bind="inputProps"
          clearable
        ></SInput>
      </v-date-picker>

      <q-btn
        block
        color="primary"
        size="sm"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        @click="onSearch"
      />

      <q-separator style="border-width: 1px;" class="q-my-md" />

      <SRemarkLeftDrawer 
      style="marginTop: -10px" 
      label="Main Reservation" 
      :value="searches.bemark['reser-name']" 
      />

      <SRemarkLeftDrawer 
      style="marginTop: -10px" 
      label="Reservation Comment" 
      :value="searches.bemark['bemerk']" 
      />

      <div class="q-mb-md" style="marginTop: -10px">
        <p class="q-mb-sm">
          Total
        </p>
    
        <div style="height: 50px" class="remark q-pa-xs" :class="[right && 'text-right']">
            <p>Room:  {{searches.data.troom}}</p>
            <p style="marginTop: -15px">Pax:  {{searches.data.tpax}}</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs,watch } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';
import { log } from 'util';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    let reservation = 2, guestname = 1
    const state = reactive({
      date: {
        start: new Date(2019, 0, 14),
        end: new Date(2019, 0, 14)
      },
      sorting: 'Guest Name' as any,
      display: 'In-house Guest',
      ReqNumber: ref(''),
      valDate: false,
      name : true,
      nationRoom : true,
      resNo: false,

      dataInput : {
        valName : '',
        NationdanRomm: '',
        ResNo: ''
      }
    });

    const sortDis = (name, nation, res, date) => {
        state.name = name
        state.nationRoom = nation
        state.resNo = res
        state.valDate = date
    }

    watch(() => state.sorting,
          (sorting, prev) => {
            if (sorting && sorting !== prev) {
              guestname = sorting['value']
              if (sorting['value'] == 4) {                
                sortDis(false, false, true, false)
              } 
              if (sorting['value'] == 1 || sorting['value'] == 2 ) {
                switch (reservation.toString()) {
                  case '1':
                    sortDis(true, false, false, true)
                    break;
                  case '2':
                  case '3':
                  case '5':
                    sortDis(true, true, false, false)
                    break;                
                  default:
                    sortDis(true, true, false, true)
                    break;
                }
              }
              if (sorting['value'] == 3) {
                switch (reservation.toString()) {
                  case '1':
                    sortDis(true, true, false, true)
                    break;
                  case '2':
                  case '3':
                  case '5':
                    sortDis(true, true, false, false)
                    break;
                  default:
                    sortDis(true, true, false, true)
                    break;
                }                
              }
            }
          }
    )

    watch(() => state.display,
          (display, prev) => {
            if(display && display !== prev){
              reservation = display['value']
              if (display['value'] == 1) {
                switch (guestname.toString()) {
                  case '1':
                  case '2':
                    sortDis(true, false, false, true)
                    break;
                  case '3':
                    sortDis(true, true, false, true)
                    break;
                  default:
                    break;
                }
              }
              if (display['value'] == 2 || display['value'] == 3 || display['value'] == 5) {
                switch (guestname.toString()) {
                  case '1':
                  case '2':
                      sortDis(true, true, false, false)
                    break;
                  case '3':
                    sortDis(true, true, false, false)
                    break;
                  default:
                    break;
                }
              }
              if (display['value'] == 4) {
                switch (guestname.toString()) {
                  case '1':
                  case '2':
                  sortDis(true, true, false, true)
                break;
                  case '3':
                  sortDis(true, true, false, true)
                break;
              default:
                break;
                }
              }
            }
          }
    )

    const onSearch = () => {
      emit('onSearch', { ...state, guestname, reservation });
    };

    return {
      ...toRefs(state),
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>

<style lang="scss" scoped>
#input {
  width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#radio {
  margin-left: -9px;
}

.remark {
  overflow-x: scroll;
  color: #2887d2;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
