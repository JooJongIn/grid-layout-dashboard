import { useEffect, useState, useRef } from 'react'
import * as echarts from "echarts"

export default function LineChart({data, layout, containerRef, options}) { 
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState( null );
  // const options = {
  //   xAxis: {},
  //   yAxis: { type: 'value'},
  //   series: []
  // };

// 초기 차트 생성
  useEffect(() => {
    if (chartRef.current ) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(options);
      setMyChart(chart);
    }
  }, [chartRef]);

// 차트 옵션 변화
  useEffect(() => {
    if(myChart)myChart.setOption(options);
  }, [options])

// 부모에 따른 크기 변화
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      let rect = entries[0].contentRect;
      if(myChart)myChart.resize({
        width: rect.width,
        height: rect.height
      });
    })
    observer.observe(containerRef.current)
    return () => containerRef.current && observer.unobserve(containerRef.current)
  }, [containerRef, myChart])

// 데이터 변화
//   useEffect(() => {
//     return;
//     if(!(data && Array.isArray(data) && data[0]))return ;
//     const first = data[0];
//     let keys = Object.keys(first);
//     let result = {}, labels = [];
    
//     keys.map(k => {
//         let re = data.map(d => d[k]);
//         k === "label" ? labels = re : result[k] = re;
//     });

//     setChartData(result, labels)
//   },[data, myChart])

// // 차트 데이터 설정
//   const setChartData = (datas, labels) => {
//     let chartOption = { ...options}
//     let series = [];
//     if(!(labels && labels[0]))return;

//     chartOption.xAxis = {
//       type: 'category',
//       data: labels
//     }

//     Object.keys(datas).map((key, idx) => {
//       series[idx] = {
//         data: datas[key],
//         type: "line"
//       }
//     })

//     chartOption.series = series;
//     if(myChart)myChart.setOption(chartOption);
//   }

  return (
    <div
      ref={chartRef}
      style={{}}
    />
  )
}