import React, { useContext, useEffect, useState, useCallback } from 'react';
import { MainContext } from '../../provider/MainProvider';
import { isMilliSecond } from '../../pages/utils';
import moment from 'moment';
import styled from 'styled-components';
import { setColor4PointColor } from '../../ref/color';

// 차트 설정 import
// import {
//   yAxisConfig4Line, xAxisConfig4Line, areaConfig4Line,
//   yAxisConfig4Bar, xAxisConfig4Bar
// } from '../../ref/chartRef';

// 차트 축 설정
export const yAxisConfig4Line = {
  style: { fontSize: '0.6rem' },
  axisLine: false, 
  tickLine: false, 
  allowDataOverflow: true,
};

export const xAxisConfig4Line = {
  style: { fontSize: '0.6rem' },
  tickLine: false, 
  padding: { left: 5, right: 5 },
  label: { fill: "red" },
};

export const areaConfig4Line = {
  type: "monotone",
  strokeWidth: 3,
};

export const yAxisConfig4Bar = {
  style: { fontSize: '0.6rem' },
  allowDataOverflow: true,
  axisLine: false, 
  tickLine: false, 
};

export const xAxisConfig4Bar = {
  style: { fontSize: '0.6rem' },
  tickLine: false, 
};

// 날짜 정규식
const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9])/;

// 차트 데이터 포맷 필터링
const filterChartDataFormat = (format) => {
  if (!(format && typeof format === 'object')) return [{}, {}];
  let newFormat = {};
  let xAsix = {};
  
  for (const key in format) {
    const val = format[key];
    if (key === 'label' && (typeof val === 'string' || typeof val === 'number')) {
      xAsix = { 
        dataKey: 'label',
      };
    } else if (typeof +val === 'number') {
      newFormat[key] = val;
    }
  }
  return [newFormat, xAsix];
};

// 범례 렌더링
export const renderLegend = (props) => {
  const { payload, align, type, deriveFromLegendList, setDerivedInfo } = props;
  const mainContext = useContext(MainContext);
  const themeStyle = mainContext?.themeStyle || {};
  const colorList = themeStyle?.colorList;

  const handleLegendClick = (entry, index) => {
    const deriveObj = deriveFromLegendList?.find(
      d => d.colName === entry.dataKey || d.colIdx === index
    );

    if (deriveObj) {
      setDerivedInfo({
        ...deriveObj,
        data: entry,
        value: entry.value,
        colName: entry.dataKey,
        colIdx: index
      });
    }
  };

  const renderLegendItem = (entry, index) => {
    const listStyle = {
      color: colorList[index],
      cursor: deriveFromLegendList?.length ? 'pointer' : 'default'
    };

    return (
      <li 
        className="drag-cancel"
        key={`item-${index}`} 
        onClick={() => handleLegendClick(entry, index)}
      > 
        <div className='circle' style={listStyle}>
          •
        </div>
        <div className='legend-label'>
          {entry.value}
        </div>
      </li>
    );
  };

  return (
    <_legend_ align={align}>
      <ul className={`legend-list ${type || ''}`}>
        {payload.map(renderLegendItem)}
      </ul>
    </_legend_>
  );
};

// 스타일 컴포넌트
const _legend_ = styled.ul`
  .legend-list {
    display: flex;
    justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
    padding-left: 10%;
    margin-top: 10px;
    flex-wrap: wrap;
    text-overflow: ellipsis;
    text-wrap: nowrap;

    li {
      margin-right: 10px; 
      font-size: 12px; 
      display: flex;
      .legend-label { 
        display: flex; 
        align-items: center; 
      }
      .circle { 
        font-size: 20px; 
        line-height: 20px; 
      }
    }
    &.pie {
      flex-wrap: nowrap;
    }
  }
`;

// 차트 공통 훅
export function useChart(data, layout, card, refWidth) {
  const mainContext = useContext(MainContext);
  const themeStyle = mainContext?.themeStyle || {};
  
  // State 관리
  const [chartState, setChartState] = useState({
    data: [],
    columns: {},
    xAxis: {},
    isEmpty: true,
    isSmallChart: true,
    isNotFormat: false,
    tickColor: false,
    height: '100%',
    margin: { left: 0, right: 0, top: 5, bottom: 0 }
  });

  const [options, setOptions] = useState({
    seeChartGradient: false,
    seeChartLegend: false
  });

  // 차트 초기화
  const cleanChartData = useCallback(() => {
    setChartState(prev => ({
      ...prev,
      data: [],
      columns: {},
      xAxis: {},
      isEmpty: true
    }));
  }, []);

  // 데이터 처리
  useEffect(() => {
    if (!(data && Array.isArray(data) && data.length !== 0)) {
      return cleanChartData();
    }

    const first = data[0];
    if (!(first && typeof first === 'object')) {
      return cleanChartData();
    }

    const [format, xAxis] = filterChartDataFormat(first);
    const hasValidFormat = Object.keys(format).length !== 0;

    if (!hasValidFormat) {
      return setChartState(prev => ({ ...prev, isNotFormat: true }));
    }

    setChartState(prev => ({
      ...prev,
      data: data,
      columns: format,
      xAxis: xAxis,
      isEmpty: false,
      isNotFormat: false
    }));
  }, [data, cleanChartData]);

  // 레이아웃 처리
  useEffect(() => {
    if (!(layout?.w)) return;
    
    const isSmall = layout.w <= refWidth;
    const margin = isSmall 
      ? { left: 0, right: 0, top: 5, bottom: 0 }
      : { left: -20, right: 0, top: 5, bottom: 0 };
      
    setChartState(prev => ({
      ...prev,
      isSmallChart: isSmall,
      margin: margin,
    }));
  }, [layout, refWidth]);

  // 옵션 및 테마 처리
  useEffect(() => {
    if (card?.options) {
      setOptions(card.options);
    }

    const newTickColor = themeStyle?.axisText;
    if (typeof card?.options?.bgColor === 'string') {
      setColor4PointColor(card.options, color => 
        setChartState(prev => ({ ...prev, tickColor: color }))
      );
    } else if (newTickColor) {
      setChartState(prev => ({ ...prev, tickColor: newTickColor }));
    }
  }, [card, themeStyle]);

  return {
    chartState,
    options,
    themeStyle
  };
}

// Y축 포맷터
export const formatYAxis = (val, idx) => {
  return idx === 0 ? "" : val;
};

// X축 포맷터
export const formatXAxis = (val, chartData) => {
  if (!chartData?.[0]) return "";
  
  const result = dateRegex.test(val);
  const xKey = Object.keys(chartData[0])[0];
  const chkMilliSecond = isMilliSecond(xKey, val);

  if (result) {
    const strArr = val.split(/-| /);
    if (strArr.length <= 2) return val;
    return `${strArr[1]}-${strArr[2]}`;
  }
  
  if (chkMilliSecond) {
    return moment(Number(val)).format("YYYY-MM-DD HH:mm:ss");
  }
  
  return val;
};