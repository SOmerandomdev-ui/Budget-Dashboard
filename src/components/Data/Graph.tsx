import { useState, useEffect } from "react";
import Plot from "react-plotly.js"
import type { Transaction } from "./Table"

export default function Graph({data}: {data: Transaction[]}) {
    console.log(data)
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: {text: 'A Fancy Plot'}} }
      />
    );
}