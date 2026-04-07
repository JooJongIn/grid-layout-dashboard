import { useState, useEffect,  } from 'react';
import {onPost} from '../utils';
import axios from 'axios';
import {load} from 'cheerio';


const list = [
    {id: "text", name: "text", data: "test"},
    {id: "table", name: "table", data: [
        {name: "name", age: 20},
        {name: "name", age: 20},
        {name: "name", age: 20},
        {name: "name", age: 20},
        {name: "name", age: 20},
    ]},
    {id: "line-chart", name: "lineChart", data: [
        {label: "name", a: 20, b:30},
        {label: "name2", a: 20, b:30},
        {label: "name3", a: 20, b:30},
        {label: "name4", a: 20, b:30},
        {label: "name5", a: 20, b:30},
    ], options:{
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }
        ]
    }},
    {id: "test", name: "test", data: [
        {label: "name", a: 20, b:30},
        {label: "name2", a: 20, b:30},
        {label: "name3", a: 20, b:30},
        {label: "name4", a: 20, b:30},
        {label: "name5", a: 20, b:30},
    ], options:{
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }
        ]
    }}
];


const ComponentSelect = ({setCompo}) => {
    useEffect(() => {
        
    }, []);

    const handleChange = (e) => {
        let target = list.find(item => item.id === e.target.value);
        if(target)setCompo(target);
    }

    return (
        <div>
            <select onChange={handleChange}>
                {list.map((item, index) => (
                    <option key={index} value={item.id}>{item.name}</option>
                ))}
            </select>
        </div>
    );
};

export default ComponentSelect; 