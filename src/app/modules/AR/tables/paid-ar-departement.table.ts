import { TableActionHeader } from '~/components/VhpUI/typings';

export const deptartementListColumns: TableActionHeader<any>[] = [
  {
    label: 'Room Number',
    field: 'roomNumber',
    name: 'roomNumber',
    headerClasses: 'nowrap text-capitalize',
    sort: (a, b) => a.room_number - b.room_number,
    sortable: true,
    style: 'width: 100px',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Guest Name',
    field: 'guestName',
    name: 'guestName',
    headerClasses: 'nowrap text-capitalize',
    sort: (a, b) => a.guest_name - b.guest_name,
    sortable: true,
  },
  {
    label: 'Inhouse',
    field: 'inhouse',
    name: 'inhouse',
    headerClasses: 'nowrap text-capitalize',
    sort: (a, b) => a.inhouse - b.inhouse,
    sortable: true,
    // render: (text, record) => (
    //   <Switch
    //     defaultChecked
    //     onChange={e => onChangeSwitch(e, record)}
    //     checkedChildren="Yes"
    //     unCheckedChildren="No"
    //   />
    // ),
    style: 'width: 50px',
    headerStyle: 'width: 50px',
  },
];
