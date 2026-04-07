import { useEffect, useState, useRef } from 'react'
import * as echarts from "echarts"


export default function PieChart({containerRef }) { 
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      // 실제 데이터 대신 fake data 사용
      const fakeData = [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ];
      // 이메일의 value를 가운데에 표시
      chart.setOption({
        series: [{
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: '{name}%)',
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '40',
                fontWeight: 'bold'
              }
            }
          },
          data: fakeData
        }]
      });
      setMyChart(chart);
    }
  }, []);

  useEffect(() => {
    if (myChart) {
      myChart.resize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, [containerRef, myChart]);



  return(
    <div ref={chartRef}></div>
  )
}