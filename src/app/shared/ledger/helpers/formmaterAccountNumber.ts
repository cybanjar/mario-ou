export function formatterAccountNumber(
  value: string,
  parameterForAccountNumber: string[]
) {
  // console.log("PARAMETER", parameterForAccountNumber);
  /**
   * https://coderamblings.wordpress.com/2012/07/09/insert-a-string-at-a-specific-index/
   **/

  const insert = (target, index, string) => {
    if (index > 0)
      return (
        target.substring(0, index) +
        string +
        target.substring(index, target.length)
      );
    else return string + target;
  };

  let temp = value;

  /**
   * LOOP PARAMETER, BENTUK ASLINYA STRING, GUNAKAN [...NAME]
   **/
  [...parameterForAccountNumber].forEach((item, index) => {
    /**
     * UBAH ITEM KE NUMBER, JUMLAHKAN DENGAN ANGKA 1
     **/
    const el = parseInt(item) + 1;
    /**
     * JIKA HASIL PENJUMLAHAN MENGHASILKAN NaN,
     * MAKA ELEMEN TERSEBUT BUKAN NUMBER
     **/
    if (isNaN(el)) {
      /**
       * JIKA ELEMEN ADALAH NAN, MAKA SISIPKAN SYMBOL SESUAI DENGAN INDEX PARAM
       **/
      const symbol = item;
      temp = insert(temp, index, symbol);
    }
  });

  // console.log('fomatterAccountNumber', temp);

  return temp;
}
