import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import {InputSearch} from '../Input/IncominStockIssuidwithPO'
 const data_table = (data) => {
    return data.tLArtikel['t-l-artikel'].map(x => ({
        alkoholgrad: x.alkoholgrad,
        anzverbrauch: x.anzverbrauch,
        artnr: x.artnr,
        bestellt: x.bestellt,
        betriebsnr: x.betriebsnr,
        bezeich: x.bezeich,
        'ek-aktuell': x['ek-aktuell'],
        'ek-letzter': x['ek-letzter'],
        endkum: x.endkum,
        'erfass-art': x['erfass-art'],
        fibukonto: x.fibukonto,
        herkunft: x.herkunft,
        inhalt: x.inhalt,
        jahrgang: x.jahrgang,
        'letz-ausgang': x['letz-ausgang'],
        'letz-eingang':x['letz-eingang'],
        'lief-artnr': x['lief-artnr'],
        'lief-einheit': x['lief-einheit'],
        'lief-nr1': x['lief-nr1'],
        'lief-nr2':x['lief-nr2'],
        'lief-nr3': x['lief-nr3'],
        lieferfrist: x.lieferfrist,
        masseinheit: x.masseinheit,
        'min-bestand': x['min-bestand'],
        traubensorte: x.traubensorte,
        'vk-preis': formatterMoney(x['vk-preis']),
        'wert-verbrau': x['wert-verbrau'],
        zwkum: x.zwkum
    }))
}   

// const data_suplier = (data) => {
//     return data.supplyList['supply-list'].map(x => ({
//         PLZ: x.PLZ,
//         adresse1: x.adresse1,
//         adresse2: x.adresse2,
//         adresse3: x.adresse3,
//         anrede1: x.anrede1,
//         anredefirma: x.anredefirma,
//         bank: x.bank,
//         betriebsnr: x.betriebsnr,
//         blz: x.blz,
//         fax: x.fax,
//         firma: x.firma,
//         kontonr: x.kontonr,
//         land: x.land,
//         'lief-nr': x['lief-nr'],
//         lieferdatum: x.lieferdatum,
//         namekontakt: x.namekontakt,
//         notizen: x.notizen,
//         rabatt: x.rabatt,
//         segment1: x.segment1,
//         skonto: x.skonto,
//         't-recid': x['t-recid'],
//         telefon : x.telefon,
//         telex : x.telex,
//         vorname1 :x.vorname1,
//         wohnort : x.wohnort,
//         'z-code' : x['z-code'],
//         ziel : x.ziel
//     }))
// }

export const map_articelnumber = (data) => {
    const xi = data_table(data)
    return xi.map(x => ({
        label: `${x.artnr} - ${x.bezeich}`,
        value: x.artnr,
        data : x
    }))
}

export const suppliernumber = (data) => {
    const xi = data.supplyList['supply-list'].map(x => ({
        label: `${x['lief-nr']} - ${x['firma']}`,
        value: x['lief-nr'],
        data: x
    }))
    InputSearch[0].options = xi
}