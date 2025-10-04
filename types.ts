export interface Task {
  date: string;
  id: string;
  status: string;
  workType: string;
  details: string;
  owner: string;
  deadline: string;
  sentDate: string;
  round: string;
  fileLink: string;
}

export type SortKey = keyof Task;
export type SortDirection = 'ascending' | 'descending';

export interface GoogleSheetRow {
  c: (GoogleSheetCell | null)[];
}

export interface GoogleSheetCell {
  v: string | number | null;
  f?: string | null;
}

export interface GoogleSheetData {
  table: {
    cols: any[];
    rows: GoogleSheetRow[];
  };
}