import React, { useCallback, useMemo } from 'react';
import {
  BarChart as BarChartComponent, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { transformData } from '../../utils/dataTransform';
import { useDerived } from '../../hook/useDerived';
import {
  useChart, renderLegend, formatYAxis,
  yAxisConfig4Bar, xAxisConfig4Bar
} from './ChartCommon';

/**
 * BarChart 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.layout - 차트 레이아웃 설정
 * @param {Array} props.data - 차트 데이터
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @param {Object} props.card - 차트 카드 설정
 * @param {Object} props.apiObj - API 객체
 * @returns {JSX.Element} BarChart 컴포넌트
 */
export function BarChart({ layout, data, children, card, apiObj }) {
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
  const { derivedInfo, setDerivedInfo } = useDerived();

  const colorList = themeStyle?.colorList || [];
  const colorListLength = colorList.length;
  const seeChartGradient = options.seeChartGradient;
  const seeChartLegend = options.seeChartLegend;

  const dx = 3;

  const derive = apiObj?.derive || [];

  const deriveFromBarList = derive.filter(d => d.event_type === "bar_click");

  const deriveFromLegendList = derive.filter(d => d.event_type === "legend_click");

  const handleBarClick = (key, data, columnIndex, deriveObj, t) => {
    const payload = data.payload;

    setDerivedInfo({...deriveObj, data: payload, value: payload[key], colName: key, colIdx: columnIndex});
  };

  // 축 설정
  const axisConfig = {
    yAxis: {
      ...yAxisConfig4Bar,
      tick: { fill: chartState.tickColor },
      hide: chartState.isSmallChart,
      dx: dx,
      tickFormatter: formatYAxis
    },
    xAxis: {
      ...xAxisConfig4Bar,
      tick: { fill: chartState.tickColor }
    }
  };

  // 바 렌더링
  const renderBars = useCallback(() => {
    return Object.keys(chartState.columns).map((key, idx) => {
      const value = chartState.columns[key];
      if (typeof value !== 'number') return null;

      const color = colorList[idx % colorList.length];
      const deriveObj = deriveFromBarList.find(d => d.colName === key || d.colIdx === idx);
      

      return (
        <Bar
          key={key}
          type="monotone"
          dataKey={key}
          barSize={6}
          stroke={color}
          fill={color}
          radius={[6, 6, 0, 0]}
          onClick={deriveObj ? (data, index, t) => handleBarClick(key, data, index, deriveObj, t) : undefined}
          cursor={deriveObj ? 'pointer' : 'default'}
        />
      );
    });
  }, [chartState.columns, colorList, deriveFromBarList, handleBarClick]);

  if (chartState.isNotFormat) {
    return <div>No data</div>;
  }

  // 샘플 바 컴포넌트
  const SampleBar = () => <Bar type="monotone" dataKey="uv" barSize={6} stroke="gray" fill="gray" radius={[6, 6, 0, 0]}/>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChartComponent
          data={chartState.data}
          margin={chartState.margin}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <CartesianGrid
                strokeDasharray="3"
                vertical={false}
                horizontalPoints={[]}
                x={40} opacity={0.3}
            />
          <XAxis dataKey="label" {...axisConfig.xAxis} />
          {/* <Tooltip /> */}
          {seeChartLegend && (
            <Legend
              content={(props) => renderLegend({...props, deriveFromLegendList, setDerivedInfo})}
              align="center"
              verticalAlign="bottom"
              height={36}
            />
          )}
          {children || renderBars() || <SampleBar />}
          <YAxis {...axisConfig.yAxis} />
        </BarChartComponent>
      </ResponsiveContainer>
    </div>
  );
} 