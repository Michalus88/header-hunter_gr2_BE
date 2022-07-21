import * as Papa from 'papaparse';
export function csvParse(csvString: string) {
    return Papa.parse(csvString);
}
