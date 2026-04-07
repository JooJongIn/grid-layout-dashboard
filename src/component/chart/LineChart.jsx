import React, { useMemo } from 'react';
import {
  AreaChart as AreaChartComponent, Area,
  XAxis, YAxis, Legend, ResponsiveContainer
} from 'recharts';
import { transformData } from '../../utils/dataTransform';
import {
  useChart, renderLegend, formatXAxis,
  yAxisConfig4Line, xAxisConfig4Line, areaConfig4Line
} from './ChartCommon';

/**
 * LineChart 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.layout - 차트 레이아웃 설정
 * @param {Array} props.data - 차트 데이터
 * @param {Object} props.card - 차트 카드 설정
 * @returns {JSX.Element} LineChart 컴포넌트
 */
export function LineChart({ data, layout, card }) {
  // 원본 데이터가 [{label, nm, cnt}] 형식인 경우 변환
  const transformedData = useMemo(() => {
    // 데이터 형식 확인 (첫 번째 항목에 label, nm, cnt가 모두 있는지 확인)
    if (data && data.length > 0 && data[0].label && data[0].nm && 'cnt' in data[0]) {
      // transformData 함수를 사용하여 데이터 변환
      return transformData(data);
    }
    // 이미 변환된 형식이거나 다른 형식인 경우 원본 데이터 사용
    return data;
  }, [data]);
  
  const refWidth = card?.options?.color ? 40 : 36;
  const { chartState, options, themeStyle } = useChart(transformedData, layout, card, refWidth);
  
  const colorList = themeStyle?.colorList || [];
  const colorListLength = colorList.length;
  const seeChartGradient = options.seeChartGradient;
  const seeChartLegend = options.seeChartLegend;

  // 그라데이션 설정
  const gradientStartOpacity = seeChartGradient ? 0.2 : 0;
  const renderGradients = () => (
    colorList.map(color => (
      <linearGradient key={color} id={`${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={gradientStartOpacity}/>
        <stop offset="95%" stopColor={color} stopOpacity={0}/>
      </linearGradient>
    ))
  );

  // 라인 렌더링
  const renderLines = () => (
    Object.keys(chartState.columns).map((key, idx) => {
      const value = chartState.columns[key];
      if (typeof value !== 'number') return null;

      const color = colorList[idx % colorListLength];
      const colorId = `url(#${color})`;
      
      return (
        <Area
          key={key}
          {...areaConfig4Line}
          dataKey={key}
          stroke={color}
          fill={colorId}
          dot={{ stroke: color, strokeWidth: 1, r: 1, strokeDasharray: '' }}
        />
      );
    })
  );

  if (chartState.isNotFormat) {
    return <div>No data</div>;
  }

  // 샘플 라인 컴포넌트
  const SampleLine = () => (
    <Area
      type="monotone"
      stroke="gray"
      strokeWidth={3}
      dataKey="uv"
      fill="url(#skeleton)"
    />
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChartComponent
          data={chartState.data}
          margin={chartState.margin}
        >
          <defs>
            {renderGradients()}
            <linearGradient id="skeleton" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="gray" stopOpacity={1}/>
              <stop offset="95%" stopColor="gray" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <XAxis 
            {...xAxisConfig4Line} 
            {...chartState.xAxis} 
            tick={{ fill: chartState.tickColor }}
            hide={chartState.isSmallChart}
            tickFormatter={(val) => formatXAxis(val, chartState.data)}
          />
          <YAxis 
            {...yAxisConfig4Line}
            tick={{ fill: chartState.tickColor }}
            hide={chartState.isSmallChart}
          />

          {renderLines() || <SampleLine />}

          {seeChartLegend && (
            <Legend content={renderLegend} />
          )}
        </AreaChartComponent>
      </ResponsiveContainer>
    </div>
  );
} 