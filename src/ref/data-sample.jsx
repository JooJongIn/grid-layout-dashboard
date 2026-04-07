import {} from "react";



const statusText = ["정상", "주의", "경고", "위험", "중단"];
// {
//     "row": [
//         {
//             "label": "Directory Traversal(디렉토리접근)",
//             "jun": 91,
//             "jul": 99,
//             "aug": 9,
//             "sep": 27,
//             "oct": 53
//         },
//         {
//             "label": "AminPage Access(관리자페이지접근)",
//             "jun": 91,
//             "jul": 98,
//             "aug": 78,
//             "sep": 77,
//             "oct": 76
//         },
//         {
//             "label": "인젝션",
//             "jun": 14,
//             "jul": 79,
//             "aug": 87,
//             "sep": 42,
//             "oct": 94
//         },
//         {
//             "label": "취약한 인증/세션",
//             "jun": 21,
//             "jul": 77,
//             "aug": 15,
//             "sep": 77,
//             "oct": 56
//         },
//         {
//             "label": "XSS",
//             "jun": 44,
//             "jul": 24,
//             "aug": 14,
//             "sep": 32,
//             "oct": 53
//         }
//     ]
// }
export const getSampleData = (type) => {
    let status = Math.floor(Math.random() * (5 - 1) + 1);
    const samplData ={
        "Line":  [
            {
                "label": "2024-06-06",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-07",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-08",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-09",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-10",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-11",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-12",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            },
            {
                "label": "2024-06-13",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10),
                "etc": Math.round(Math.random() * (90 - 10) + 10),
                "solved": Math.round(Math.random() * (90 - 10) + 10)
            }
        ],
        "Bar": [
            {
                "label": "2024-06-06",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-07",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-08",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-09",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-10",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-11",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-12",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            },
            {
                "label": "2024-06-13",
                "cirtical": Math.round(Math.random() * (120 - 90) + 90),
                "high": Math.round(Math.random() * (90 - 70) + 70),
                "medium": Math.round(Math.random() * (70 - 40) + 40),
                "low": Math.round(Math.random() * (40 - 10) + 10)
            }
        ],
        "Pie": [
            {
                "label": "A",
                "미처리": Math.floor(Math.random() * 12) + 1,
                "부분적합": Math.floor(Math.random() * 12) + 1,
                "부적합": Math.floor(Math.random() * 12) + 1,
                "적합": Math.floor(Math.random() * 12) + 1,
                "Na": Math.floor(Math.random() * 12) + 1,
            }
        ],
        "Radar":[
            {
                "label": "Directory Traversal(디렉토리접근)",
                "jun": 91,
                "jul": 99,
                "aug": 9,
                "sep": 27,
                "oct": 53
            },
            {
                "label": "AminPage Access(관리자페이지접근)",
                "jun": 91,
                "jul": 98,
                "aug": 78,
                "sep": 77,
                "oct": 76
            },
            {
                "label": "인젝션",
                "jun": 14,
                "jul": 79,
                "aug": 87,
                "sep": 42,
                "oct": 94
            },
            {
                "label": "취약한 인증/세션",
                "jun": 21,
                "jul": 77,
                "aug": 15,
                "sep": 77,
                "oct": 56
            },
            {
                "label": "XSS",
                "jun": 44,
                "jul": 24,
                "aug": 14,
                "sep": 32,
                "oct": 53
            }
        ],
        "List": [
            {
                "No": 1,
                "지역": "Zhuxi",
                "접속자수": 6169,
                "IP": "159.225.11.108"
            },
            {
                "No": 2,
                "지역": "Omaruru",
                "접속자수": 9422,
                "IP": "0.3.92.28"
            },
            {
                "No": 3,
                "지역": "Spring",
                "접속자수": 2585,
                "IP": "57.222.106.76"
            },
            {
                "No": 4,
                "지역": "Pridraga",
                "접속자수": 9340,
                "IP": "18.195.19.221"
            },
            {
                "No": 5,
                "지역": "Cachoeiras de Macacu",
                "접속자수": 6887,
                "IP": "188.228.221.83"
            },
            {
                "No": 6,
                "지역": "Normanton",
                "접속자수": 5722,
                "IP": "252.35.180.245"
            },
            {
                "No": 7,
                "지역": "Votuporanga",
                "접속자수": 5293,
                "IP": "47.213.145.136"
            },
            {
                "No": 8,
                "지역": "Tetebatu",
                "접속자수": 8427,
                "IP": "65.21.160.80"
            },
            {
                "No": 9,
                "지역": "Sabang",
                "접속자수": 4306,
                "IP": "188.42.143.127"
            },
            {
                "No": 10,
                "지역": "San Francisco",
                "접속자수": 5303,
                "IP": "195.212.37.201"
            },
            {
                "No": 11,
                "지역": "Al Maşlūb",
                "접속자수": 6254,
                "IP": "159.252.94.51"
            },
            {
                "No": 12,
                "지역": "Manukaka",
                "접속자수": 9100,
                "IP": "61.97.231.255"
            },
            {
                "No": 13,
                "지역": "Stockholm",
                "접속자수": 1869,
                "IP": "185.95.227.158"
            },
            {
                "No": 14,
                "지역": "Gontar",
                "접속자수": 3263,
                "IP": "48.78.77.61"
            }
        ],
        "Gauge": [{data: Math.floor(Math.random() * (300 - 10) + 10)}],
        "DivideGauge": [{top: Math.floor(Math.random() * (100 - 50) + 50), bottom: Math.floor(Math.random() * (150 - 100) + 100)}],
        "Status": [{label: statusText[status], data: status}],
        "ArcGauge": [{label: "적합도",top: Math.floor(Math.random() * (100 - 5) + 5), bottom: 100}]
    }

    
    return samplData[type];
}



// export default {getSampleData};