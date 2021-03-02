const fse = require('fs-extra');

const FA = [
  'PageFAFixedAssetItem',
  'PageFAFixedAssetPurchaseOrder',
  'PageFAFixedAssetIncoming',
  'PageFADepreciationJournalizing',
  'PageFAJournal',
  'PageFALedger',
  'PageFAReportFixedAssetValuation',
  'PageFAReportFixedAssetCancelledIncoming',
];

FA.forEach((page) => {
  fse
    .outputFile(
      `src/app/modules/FA/${page}.vue`,
      `<template>
  <div>${page}</div>
</template>
`
    )
    .then(() => {
      console.log('The file was saved!');
    })
    .catch((err) => {
      console.error(err);
    });
});
