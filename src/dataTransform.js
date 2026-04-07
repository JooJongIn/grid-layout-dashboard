


/**
 * 원본 데이터를 label 기준으로 그룹화하는 함수
 * @param {Array} data - 원본 데이터 배열
 * @returns {Array} - 변환된 데이터 배열
 */
export function transformData(data) {
  // 결과를 저장할 객체 생성
  const groupedByLabel = {};

  // 데이터를 label 기준으로 그룹화
  data.forEach(item => {
    const { label, nm, cnt } = item;
    
    // 해당 label이 없으면 초기화
    if (!groupedByLabel[label]) {
      groupedByLabel[label] = {
        label
      };
    }
    
    // nm을 직접 키로 사용하여 cnt 값을 저장
    groupedByLabel[label][nm] = cnt;
  });

  // 객체를 배열로 변환
  return Object.values(groupedByLabel);
}

// 사용 예시
const sampleData = [
  { label: "2025-02-27", nm: "침해", cnt: 2 },
  { label: "2025-02-28", nm: "침해", cnt: 2 },
  { label: "2025-03-01", nm: "침해", cnt: 2 },
  { label: "2025-03-02", nm: "침해", cnt: 2 },
  { label: "2025-03-03", nm: "침해", cnt: 2 },
  { label: "2025-03-04", nm: "침해", cnt: 2 },
  { label: "2025-03-05", nm: "침해", cnt: 2 },
  { label: "2025-02-27", nm: "탐지", cnt: 1 },
  { label: "2025-02-28", nm: "탐지", cnt: 2 },
  { label: "2025-03-01", nm: "탐지", cnt: 3 },
  { label: "2025-03-02", nm: "탐지", cnt: 4 },
  { label: "2025-03-03", nm: "탐지", cnt: 5 },
  { label: "2025-03-04", nm: "탐지", cnt: 6 },
  { label: "2025-03-05", nm: "탐지", cnt: 7 }
];

// 변환 결과 예시
/*
결과:
[
  {
    label: "2025-02-27",
    "침해": 2,
    "탐지": 1
  },
  {
    label: "2025-02-28",
    "침해": 2,
    "탐지": 2
  },
  ...
]
*/ 