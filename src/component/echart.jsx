import { useEffect, useState, useRef } from 'react'
import * as echarts from "echarts"


export const LineChart = ({data, card}) => { 

  return(<>
  <DefaultChart {...{data, card}} type={"line"} />
  </>)
}







const DefaultChart = ({data, card, type}) => {
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
        type: type
      }
    ]
  });

  // init
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(options);
      setMyChart(chart);
    }
  }, [options, chartRef]);

  // resize
  useEffect(() => {
    if(myChart)myChart.resize({
      width: chartRef.current.offsetWidth,
      height: chartRef.current.offsetHeight
    });
  },[card])

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
  },[data])



  const setChartData = (datas, labels) => {
    let chartOption = { ...options}
    let series = [];

    if(labels && labels[0])chartOption.xAxis = {
        type: 'category',
        data: labels
    }

    Object.keys(datas).map((key, idx) => {
        series[idx] =    {
            data: datas[key],
            type: type
        }
    })

    chartOption.series = series;
    myChart.setOption(chartOption);
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