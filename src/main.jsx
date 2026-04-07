import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import GmarketSansTTFBold from './fonts/GmarketSansTTFBold.ttf';
import GmarketSansTTFMedium from './fonts/GmarketSansTTFMedium.ttf';
import GmarketSansTTFLight from './fonts/GmarketSansTTFLight.ttf';
import MontHeavyDemo from "./fonts/FontsFree-Net-Mont-Heavy-DEMO.ttf";


import GmarketSansLight from './fonts/GmarketSansOTF/GmarketSansLight.otf';
import GmarketSansBold from './fonts/GmarketSansOTF/GmarketSansBold.otf';
import GmarketSansMedium from './fonts/GmarketSansOTF/GmarketSansMedium.otf';


import RobotoMedium from './fonts/Roboto/Roboto-Medium.woff2'
import RobotoLight from './fonts/Roboto/Roboto-Light.woff2'
import RobotoBold from './fonts/Roboto/Roboto-Bold.woff2'



// import NanumGorhic from './fonts/Nanum_Gothic/NanumGothic-Regular.ttf'

import NanumGorhicRegular from './fonts/Nanum_Gothic/NanumGothic-Regular.woff2'
import NanumGorhicBold from './fonts/Nanum_Gothic/NanumGothic-Bold.woff2'
import NanumGorhicExtraBold from './fonts/Nanum_Gothic/NanumGothic-ExtraBold.woff2'




import NotoSansKRLight from './fonts/Noto_Sans_KR/NotoSansKR-Light.otf'
import NotoSansKRRegular from './fonts/Noto_Sans_KR/NotoSansKR-Regular.otf'
import NotoSansKRMedium from './fonts/Noto_Sans_KR/NotoSansKR-Medium.otf'







import { BrowserRouter } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

const fontRangeRef = {
	kor:"U+AC00-D7A3",
	"eng&num":"U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E",
}


const createFontFace = (name, font, type, weight, range) => {
	const fontRange = fontRangeRef[range]
	return `
	@font-face {
		font-family: '${name}';
		src: url(${font}) format('${type}');	
		font-weight: ${weight};
		unicode-range:  ${fontRange};
	}
	`
}
// otf 'opentype'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: '한글';
    src: local('GmarketSansTTFBold'), local('GmarketSansTTFBold');
    font-style: normal;
    src: url(${GmarketSansTTFBold}) format('truetype');
    unicode-range: U+AC00-D7A3;
  }
  @font-face {
    font-family: '영어';
    src: local('GmarketSansTTFMedium'), local('GmarketSansTTFMedium');
    font-style: normal;
    src: url(${GmarketSansTTFMedium}) format('truetype');
    unicode-range: U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
  }
  @font-face {
    font-family: '숫자+특수문자';
    src: local('GmarketSansTTFLight'), local('GmarketSansTTFLight');
    font-style: normal;
    src: url(${GmarketSansTTFLight}) format('truetype');
    unicode-range: U+AC00-D7AF;
  }
  @font-face {
    font-family: "M";
    src: local("Mont Heavy Demo"),
    url(${MontHeavyDemo}) format('truetype');
    font-weight: 400;
    font-style: italic;
  }
	/* content */

	/* 한글 나눔 고딕 */
	${createFontFace('content', NotoSansKRLight, 'opentype', 'lighter', 'kor')}
	${createFontFace('content', NotoSansKRRegular, 'opentype', 400, 'kor')}
	${createFontFace('content', NotoSansKRMedium, 'opentype', 700, 'kor')}

/* 영문 숫자 특수문자 로보토 */
	${createFontFace('content', RobotoLight, 'woff2', 'lighter', 'eng&num')}
	${createFontFace('content', RobotoMedium, 'woff2', 400, 'eng&num')}
	${createFontFace('content', RobotoBold, 'woff2', 700, 'eng&num')}


	/* title */
	/* 한글 나눔 고딕 */
	${createFontFace('title', NotoSansKRRegular, 'opentype', 400, 'kor')}
	${createFontFace('title', NotoSansKRMedium, 'opentype', 700, 'kor')}

/* 영문 숫자 특수문자 로보토 */
	${createFontFace('title', RobotoLight, 'woff2', 'lighter', 'eng&num')}
	${createFontFace('title', RobotoMedium, 'woff2', 400, 'eng&num')}
	${createFontFace('title', RobotoBold, 'woff2', 700, 'eng&num')}

	`


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
		<GlobalStyle />
    <App />
  </BrowserRouter>
)

/* ${createFontFace('title', GmarketSansTTFLight, 'truetype', 'lighter', 'kor')}
	${createFontFace('title', GmarketSansTTFMedium, 'truetype', 400, 'kor')}
	${createFontFace('title', GmarketSansTTFBold, 'truetype', 700, 'kor')} */


const fontSizeRef = {
	kor:"U+AC00-D7A3",
	"eng&num":"U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E",
}

// @font-face {
// 	font-family: 'content';
// 	src: url(${GmarketSansTTFLight}) format('truetype');
// 	font-weight: lighter;
// 	unicode-range: U+AC00-D7A3;
// }

// @font-face {
// 	font-family: 'content';
// 	src: url(${GmarketSansTTFMedium}) format('truetype');
// 	font-weight: 400;
// 	unicode-range: U+AC00-D7A3;
// }

// @font-face {
// 	font-family: 'content';
// 	src: url(${GmarketSansTTFBold}) format('truetype');
// 	font-weight: 700;
// 	unicode-range: U+AC00-D7A3;
// }


	/* @font-face {
		font-family: 'content';
		src: url(${RobotoLight}) format('woff2');	
		font-weight: lighter;
		unicode-range:  U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
	}
	@font-face {
		font-family: 'content';
		src: url(${RobotoMedium}) format('woff2');	
		font-weight: 400;
		unicode-range:  U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
	}
	@font-face {
		font-family: 'content';
		src: url(${RobotoBold}) format('woff2');	
		font-weight: 700;
		unicode-range:  U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
	} */


	// /* title */
	// /* 한글 지마켓 */
	// @font-face {
	// 	font-family: 'title';
	// 	src: url(${GmarketSansTTFLight}) format('truetype');
	// 	font-weight: lighter;
	// 	unicode-range: U+AC00-D7A3;
	// }
	
	// @font-face {
	// 	font-family: 'title';
	// 	src: url(${GmarketSansTTFMedium}) format('truetype');
	// 	font-weight: 400;
	// 	unicode-range: U+AC00-D7A3;
	// }

	// @font-face {
	// 	font-family: 'title';
	// 	src: url(${GmarketSansTTFBold}) format('truetype');
	// 	font-weight: 700;
	// 	unicode-range: U+AC00-D7A3;
	// }

	// /* 영문 숫자 특수문자 로보토 */
	
	// @font-face {
	// 	font-family: 'title';
	// 	src: url(${RobotoLight}) format('woff2');	
	// 	font-weight: lighter;
	// 	unicode-range:  U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
	// }
	// @font-face {
	// 	font-family: 'title';
	// 	src: url(${RobotoMedium}) format('woff2');	
	// 	font-weight: 400;
	// 	unicode-range:  U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
	// }
	// @font-face {
	// 	font-family: 'title';
	// 	src: url(${RobotoBold}) format('woff2');	
	// 	font-weight: 700;
	// 	unicode-range:  U+0041-005A ,U+0061-007A, U+0030-0039, U+0020-002F, U+003A-0040, U+005B-0060, U+007B-007E;
	// }