import { toBoolean } from '~/app/helpers/typeConverter.helper';

export interface ModifyConfig {
  recordUse: boolean;
  initTime: number;
  initDate: Date;
}

export function mapModifyConfig(data: Record<string, any>): ModifyConfig {
  return {
    recordUse: toBoolean(data.recordUse),
    initTime: data.initTime,
    initDate: new Date(data.initDate),
  };
}

export interface ReqCheckTime {
  caseType: number;
  idTable: number;
  idTable1: number;
  nameTable: string;
  initTime2: number;
  initDate2: string;
}
