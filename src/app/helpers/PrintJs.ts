import printJS from 'print-js';
import {date, Cookies} from 'quasar'

const today = Date.now();
const formattedToday = date.formatDate(today, 'DD/MM/YYYY');
const creds = Cookies.get('userAuth');

const headerMaps = headerData => headerData
    .filter(items => 
    !['actions']
    .includes(
      items['field']))
    .map(items => 
    ({
      field: items['field'],
      displayName: items['label']
    }))

export function PrintJs(data, header, Name) {
  console.log('Data aja : ', data);
  
  for (let i = 0; i < data.length; i++) {
    var dataRow = data[i];

    let size = 0;
    for (let k in dataRow) {
      if (dataRow[k] === null || dataRow[k] === undefined || dataRow[k] === "undefined" || dataRow[k] === "null") {
        dataRow[k] = " ";
      }
      size++
    }
  }

  printJS({
        printable: data, 
        header: rawHeader(Name),
        properties:  headerMaps(header),
        type: 'json'
    })
}

function rawHeader(Name) {
    return `
    <table style=width:100%>
    <tr>
    <td align=left>` +
    creds['htlName'] +
  `</td>
    <td align=right>Date: ` +
  formattedToday +
  `</td>
    </tr>
    <tr>
    <td align=left>` +
    creds['htlAdr'] +
  `</td>
    </tr>
    <tr>
    <td align=left>Tel ` +
    creds['htlTel'] +
  `</td>
    </tr>
    </table>
    <center><h3 class="custom-h3">${Name}</h3></center>
  `;
  }