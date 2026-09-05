import * as Papa from 'papaparse';
import Table from "./Table"

export default function ProcessData(file: File) {
    Papa.parse(file, {
        complete: (results: any) => {
          Table(results.data)

    },
  })
  
}