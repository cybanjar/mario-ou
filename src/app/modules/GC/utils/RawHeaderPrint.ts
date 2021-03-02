import {
    getHtlName,
    getHtlAdr,
    getHtlTel,
  } from '~/app/helpers/getCredentials.helpers';
  import { Notify, date } from 'quasar';

const today = Date.now();
const formattedToday = date.formatDate(today, 'DD/MM/YYYY');

export function rawHeader(Name) {
  return `
  <table style=width:100%>
  <tr>
  <td align=left>` +
getHtlName +
`</td>
  <td align=right>Date: ` +
formattedToday +
`</td>
  </tr>
  <tr>
  <td align=left>` +
getHtlAdr +
`</td>
  </tr>
  <tr>
  <td align=left>Tel ` +
getHtlTel +
`</td>
  </tr>
  </table>
  <center><h3 class="custom-h3">${Name} (Receiving Report by Suppliers)</h3></center>
`;
}