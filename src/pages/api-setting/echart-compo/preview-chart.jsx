import { useEffect, useState, useRef } from 'react'
import * as echarts from "echarts"
import { ColorListLight } from '../../../ref/color';

const typeObj = {
  Line: "line",
  Bar: "bar",
  Radar: "radar",
}

export const LineChart = ({data, type}) => { 
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState( null );
  const [options, setOptions] = useState({
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'line'
      }
    ]
  });


  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(options);
      setMyChart(chart);
    }
  }, [options, chartRef]);

  useEffect(() => {
    window.addEventListener('resize', function(e){
      if(myChart)myChart.resize({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight
      });
    });
    return window.removeEventListener('resize', function(){
      if(myChart)myChart.resize({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight
      });
    });
  },[myChart])

//   resize
  useEffect(() => {
    
  },[chartRef.current])

  useEffect(() => {
    if(!(data && Array.isArray(data) && data[0]))return ;
    const first = data[0];
    let keys = Object.keys(first);
    let result = {}
    let labels = [];
    // keys.map(k => k === "label" ? false :result[k] = []);
    keys.map(k => {
        let re = data.map(d => d[k]);
        k === "label" ? labels = re : result[k] = re;
    });

    setChartData(result, labels)
  },[data, myChart, type])



  const setChartData = (datas, labels) => {
    let chartOption = { ...options}
    let series = [];

    

    if(labels && labels[0]){

      if(type === "Radar"){
        chartOption.radar = {
          indicator: labels.map(l => ({name: l}))
        }
      }
      else chartOption.xAxis = {
        type: 'category',
        data: labels
      }
    }

    Object.keys(datas).map((key, idx) => {
      series[idx] =    {
        data: datas[key],
        type: typeObj[type]
      }
    })

    chartOption.series = series;
    if(myChart)myChart.setOption(chartOption);
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  )
}


export const RadarChart = ({data, type}) => { 
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState( null );
  const [options, setOptions] = useState({
    color: ColorListLight,
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'line'
      }
    ]
  });


  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(options);
      setMyChart(chart);
    }
  }, [options, chartRef]);

  useEffect(() => {
    window.addEventListener('resize', function(e){
      if(myChart)myChart.resize({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight
      });
    });
    return window.removeEventListener('resize', function(){
      if(myChart)myChart.resize({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight
      });
    });
  },[myChart])

//   resize
  useEffect(() => {
    
  },[chartRef.current])

  useEffect(() => {
    if(!(data && Array.isArray(data) && data[0]))return ;
    const first = data[0];
    let keys = Object.keys(first);
    let labels = [];
    // keys.map(k => k === "label" ? false :result[k] = []);
    labels = keys.filter(k => {
      const v = first[k];
      if(!v)return false;
      if(typeof +v === "number" && !isNaN(+v))return true;
      return false;
    });

    const result = data.map((dObj, idx) => {
      let name = dObj.label;
      let values = labels.map(l => +dObj[l]);
      let filtered = values.filter(v => typeof v === "number");
      return {name, value: filtered, areaStyle: {
        color: ColorListLight[idx]
      }};
    });

    setChartData(result, labels)
  },[data, myChart, type])



  const setChartData = (datas, labels) => {
    let chartOption = { ...options}
    let series = [];

    if(labels && labels[0]){
      if(type === "Radar"){
        chartOption.radar = {
          indicator: labels.map(l => ({name: l}))
        }
      }

    }
    series[0] = {
      data: datas,
      type: typeObj[type]
    }
    
    chartOption.series = series;
    if(myChart)myChart.setOption(chartOption);
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  )
}
