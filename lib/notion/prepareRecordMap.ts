import type { ExtendedRecordMap } from 'notion-types';

// Notion's editor history is large and is unused by the read-only renderer.
// Clone while stripping it so the shared server cache retains the original data.
export const prepareRecordMap = (recordMap: ExtendedRecordMap): ExtendedRecordMap =>
  JSON.parse(
    JSON.stringify(recordMap, (key, value: unknown) =>
      key === 'crdt_data' || key === 'crdt_format_version' ? undefined : value,
    ),
  );
