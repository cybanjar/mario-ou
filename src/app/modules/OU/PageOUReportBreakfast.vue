<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchBreakfast :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        :loading="isFetching"
        dense
        :data="build"
        :columns="tableHeaders"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
        @row-click="onRowClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, toRefs, reactive} from '@vue/composition-api';
import { date, Notify } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts = [] as any;

    const state = reactive({
      isFetching: true,
      build: [],
      dataPrepare:{},
      searches: {
        date: {start: (new Date()), end: (new Date())},
        reservationDetail: '',
        reservationComments: '',
        adult: 0,
        child: 0,
        comp: 0
      },
    });

    const resStatus = [
      {
        resname: 'Guaranted',
        resnr: 1
      },{
        resname: '6 PM',
        resnr: 2
      },{
        resname: 'Tentative',
        resnr: 3
      },{
        resname: 'WaitList',
        resnr: 4
      },{
        resname: 'VerbalConfirm',
        resnr: 5
      },{
        resname: 'Inhouse',
        resnr: 6
      },{
        resname: ' ',
        resnr: 7
      },{
        resname: 'Departed',
        resnr: 8
      },{
        resname: 'Cancelled',
        resnr: 9
      },{
        resname: 'NoShow',
        resnr: 10
      },{
        resname: 'ShareRes',
        resnr: 11
      },{
        resname: ' ',
        resnr: 12
      },{
        resname: 'RmSharer',
        resnr: 13
      },
    ];

    const tableHeaders = [
        {
            label: "Room No",
            field: "zinr",
            align: "left",
        },{
            label: "Guest Name", 
            field: "NAME",
            align: "left",
        }, {
            label: "Segment Code", 
            field: "segmentcode",
            align: "right",
        }, {
            label: "Arrival", 
            field: "ankunft",
            align: "center",
        },{
            label: "Nights", 
            field: "anztage",
            align: "right",
        }, {
            label: "Depart", 
            field: "abreise",
            align: "center",
        },{
            label: "Cat", 
            field: "kurzbez",
            align: "left",
        }, {
            label: "Argt Code", 
            field: "arrangement",
            align: "left",
        },  {
            label: "Adult", 
            field: "erwachs",
            align: "right",
        },  {
            label: "Ch", 
            field: "kind1",
            align: "right",
        },  {
            label: "Compl", 
            field: "gratis",
            align: "right",
        },  {
            label: "Qty", 
            field: "zimmeranz",
            align: "right",
        },  {
            label: "Res Status", 
            field: "resstatusstr",
            align: "left",
        },  {
            label: "Res No", 
            field: "resnr",
            align: "left",
        },  {
            label: "Nationality", 
            field: "nation1",
            align: "left",
        },  {
            label: "Comments", 
            field: "bemerk",
            align: "left",
        }
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('abfListPrepare', { }),
      ]);

      if (data) {
        responsePrepare = data || [];
        const okFlag = responsePrepare['outputOkFlag'];
        if (!okFlag ) {
          Notify.create({
            message: 'Failed when retrive data, please try again',
            color: 'red',
          });
          state.isFetching = false;
          return false;
        }
        state.dataPrepare = responsePrepare; 
        
        const date = new Date(responsePrepare.ciDate);
        state.searches.date.start = date;
        state.searches.date.end = date;
        
        state.isFetching = false;
      } else {
        Notify.create({
          message: 'Please check your internet connection',
          color: 'red',
        });
        state.isFetching = false;
        return false;
      }
    });

    const onSearch = (state2) => {
      state.isFetching = true;
        
      async function asyncCall() {
        const [dataResponse] = await Promise.all([
          $api.outlet.getOUTableList('abfList', {
            fdate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            tdate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            bfastArtnr: state.dataPrepare['bfastArtnr'],
            bfastDept	: state.dataPrepare['bfastDept']
          }),
        ]); 

        if (dataResponse) {
          const data  = dataResponse || [];
          const okFlag = data ['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }
          state.build = [];
          charts = data['abfList']['abf-list'];

          let erwachs = 0;
          let gratis = 0;
          let kind = 0;
          for (let i = 0; i<charts.length; i++) {
            const zimmeranz = charts[i]['zimmeranz'];
            const tempErwachs = charts[i]['erwachs'] * zimmeranz;
            const tempGratis = charts[i]['gratis'] * zimmeranz;
            const tempKind = charts[i]['kind1'] * zimmeranz;

            erwachs = erwachs + tempErwachs;
            gratis = gratis + tempGratis;
            kind = kind + tempKind;

            const tempResnr = charts[i]['resstatus'];
            for(let x = 0; x<resStatus.length; x++) {
              if (tempResnr == resStatus[x]['resnr']) {
                charts[i]['resstatusstr'] = resStatus[x]['resname'];
                break;
              }
            }
          }
          state.searches.adult = (erwachs);
          state.searches.child = (kind);
          state.searches.comp = (gratis);
          state.build = charts;
          state.isFetching = false;
        } else {
          Notify.create({
            message: 'Please check your internet connection',
            color: 'red',
          });
          state.isFetching = false;
          return false;
        }
      }
      asyncCall();
    };

    const onRowClick = (_, dataRow) => {
      state.searches.reservationDetail = dataRow.resname + '\n' + dataRow.address + '\n' + dataRow.city;
      state.searches.reservationComments = dataRow.comments;
    };

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      onRowClick,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    searchBreakfast: () => import('./components/SearchBreakfast.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
