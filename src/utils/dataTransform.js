/**
 * 메모이제이션 함수 - 동일한 입력에 대한 결과를 캐싱
 */
function memoize(fn) {
  const cache = new Map();
  return function(data) {
    // 데이터의 해시 생성 (간단한 방법)
    const key = JSON.stringify(data);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(data);
    cache.set(key, result);
    return result;
  };
}

/**
 * 데이터 변환 함수 - label 기준으로 그룹화하고 nm을 키로 사용
 * @param {Array} data - 원본 데이터 배열 [{label, nm, cnt}, ...]
 * @returns {Array} - 변환된 데이터 배열 [{label, [nm1]: cnt1, [nm2]: cnt2, ...}, ...]
 */
const transformData = memoize(function(data) {
  // Map 객체 사용 (일반 객체보다 성능 좋음)
  const groupedByLabel = new Map();
  
  // for 루프 사용 (forEach보다 약간 빠름)
  for (let i = 0; i < data.length; i++) {
    const { label, nm, cnt } = data[i];
    
    if (!groupedByLabel.has(label)) {
      groupedByLabel.set(label, { label });
    }
    
    const labelObj = groupedByLabel.get(label);
    labelObj[nm] = cnt;
  }

  // 결과 반환
  return Array.from(groupedByLabel.values());
});

/**
 * 차트 데이터 형식으로 변환하는 함수
 * @param {Array} data - 원본 데이터 배열
 * @returns {Object} - 차트 라이브러리에 맞는 데이터 형식
 */
const transformToChartData = memoize(function(data) {
  const transformed = transformData(data);
  
  // 모든 고유한 nm 값(시리즈 이름) 추출
  const allSeries = new Set();
  for (const item of data) {
    allSeries.add(item.nm);
  }
  
  // 차트 데이터 형식으로 변환
  return {
    data: transformed,
    series: Array.from(allSeries)
  };
});

/**
 * 변환된 데이터에서 시리즈 이름 목록을 추출하는 함수
 * @param {Array} data - 원본 데이터 배열 [{label, nm, cnt}, ...]
 * @returns {Array} - 시리즈 이름 배열 ['침해', '탐지', ...]
 */
const extractSeriesNames = memoize(function(data) {
  const seriesSet = new Set();
  
  for (let i = 0; i < data.length; i++) {
    seriesSet.add(data[i].nm);
  }
  
  return Array.from(seriesSet);
});

/**
 * 차트 컴포넌트에서 사용할 수 있는 데이터 및 시리즈 정보를 생성하는 함수
 * @param {Array} data - 원본 데이터 배열 [{label, nm, cnt}, ...]
 * @param {Function} renderSeries - 시리즈 렌더링 함수 (예: (name, index, color) => <Line ... />)
 * @param {Array} colors - 색상 배열
 * @returns {Object} - { transformedData, seriesNames, seriesComponents }
 */
const prepareChartData = memoize(function(data, renderSeries, colors = []) {
  if (!data || data.length === 0) {
    return { transformedData: [], seriesNames: [], seriesComponents: [] };
  }
  
  // 데이터 변환
  const transformedData = transformData(data);
  
  // 시리즈 이름 추출
  const seriesNames = extractSeriesNames(data);
  
  // 시리즈 컴포넌트 생성
  const seriesComponents = seriesNames.map((name, index) => {
    const color = colors[index % colors.length] || '#000';
    return renderSeries(name, index, color);
  });
  
  return {
    transformedData,
    seriesNames,
    seriesComponents
  };
});

export { transformData }; 