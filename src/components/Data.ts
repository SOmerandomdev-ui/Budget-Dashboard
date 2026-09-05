import * as Papa from 'papaparse';


export default function ProcessData(file: File) {
    Papa.parse(file, {
        complete: (results: any) => {
      console.log(results.data); // array of row objects
    },
    })
}