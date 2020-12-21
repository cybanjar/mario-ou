import { ResChartOfAccounts } from '../models/responses/chartOfAccount.response';

export function filterTable(rows: ResChartOfAccounts[], terms) {
  if (Object.keys(terms).length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    const { accountNumber, main, category, department } = terms;
    const hasAccount =
      ['', null].includes(accountNumber) ||
      row.fibukonto.indexOf(accountNumber) !== -1;
    const hasMain = main === null || main.value === row['glmain-bezeich'];
    const hasCategory =
      category === null || category.value === row['glfstype-bezeich'];
    const hasDepartment =
      department === null || department.value === row['gldepartment-bezeich'];

    return hasAccount && hasMain && hasCategory && hasDepartment;
  });
}
