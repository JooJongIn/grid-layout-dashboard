import React from 'react';


export const yAxisConfig4Line = {
    style:{ fontSize: '0.6rem' },
    axisLine:false, 
    tickLine:false, 
    // domain:['dataMin - 1' , 'dataMax + 1' ],
    allowDataOverflow:true,
}

export const xAxisConfig4Line = {
    style: { fontSize: '0.6rem' },
    tickLine: false, 
    padding:{ left: 5, right: 5 },
    label:{ fill: "red" },
}
export const areaConfig4Line = {
    type:"monotone",
    strokeWidth: 3,
}


export const yAxisConfig4Bar = {
    style:{ fontSize: '0.6rem' },
    // domain:[0 , 'dataMax' ],
    allowDataOverflow:true,
    axisLine:false, 
    tickLine:false, 
}

export const xAxisConfig4Bar = {
    style: { fontSize: '0.6rem' },
    tickLine: false, 
}