import { getNotionPage } from './client';
import { prepareRecordMap } from './prepareRecordMap';

export const getPostBlocks = async (id: string) => {
  return prepareRecordMap(await getNotionPage(id));
};
