import { SHEET_ID } from '../constants';
import type { Task, GoogleSheetData, GoogleSheetRow } from '../types';

// A parser to transform Google Sheet row data into our Task type.
const parseTask = (row: GoogleSheetRow): Task => {
  const cells = row.c;
  return {
    date: cells[0]?.f ?? cells[0]?.v?.toString() ?? '',
    id: cells[1]?.v?.toString() ?? '',
    status: cells[2]?.v?.toString() ?? '',
    workType: cells[3]?.v?.toString() ?? '',
    details: cells[4]?.v?.toString() ?? '',
    owner: cells[5]?.v?.toString() ?? '',
    deadline: cells[6]?.f ?? cells[6]?.v?.toString() ?? '',
    sentDate: cells[7]?.f ?? cells[7]?.v?.toString() ?? '',
    round: cells[8]?.v?.toString() ?? '',
    fileLink: cells[9]?.v?.toString() ?? '',
  };
};

export const fetchSheetData = async (gid: string): Promise<Task[]> => {
  const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    
    // Google Sheets gviz API returns JSONP. We need to strip the wrapper to get the JSON.
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    
    const data: GoogleSheetData = JSON.parse(jsonString);

    if (!data.table || !data.table.rows) {
        throw new Error("Invalid Google Sheet data format.");
    }
    
    // Filter out potential empty rows where the first cell is null or empty
    const filteredRows = data.table.rows.filter(row => row.c && row.c[0] && (row.c[0].v !== null || row.c[0].f !== null));

    // The first row in the provided sheet is a header ("วันเดือนปี"), so we skip it.
    return filteredRows.slice(1).map(parseTask);
    
  } catch (error) {
    console.error(`Failed to fetch or parse data for GID ${gid}:`, error);
    throw new Error('Could not fetch data from the Google Sheet. Please check the sheet permissions, GID, or network connection.');
  }
};