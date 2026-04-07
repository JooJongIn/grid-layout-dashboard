import React from 'react';

export const colorList1 = ["#5EFF5A", "#023AFF", "#8855E8", "#FFA63F" , "#FF2069" ];
// export const colorList1 = ["#53CA43", "#FA6298", "#F9D33D" , "#FF2069", "#416BFF", "#FAA24B" ];

`
background: #6A6A9F;
background: #191932;
background: #023AFF;

background: #FFA63F;
background: #5EFF5A;
background: #FF2D2E;

background: #05050F;
background: #991BFA;
background: #01F1E3;

background: #FFFFFF;
background: #3506EF;
background: #FF2069;

background: #8855E8;
background: #73BE03;

background: linear-gradient(184.88deg, #E323FF 7.87%, #7517F8 97.56%);
`

export const setColor4PointColor = (options, setColor) => {

	const bgColor = options?.bgColor;

	const isBlack = ["#6FD1A2", "#F379B2", "#EEEF70"].includes(bgColor);
	const isWhite = ["#686DFF", "#9537D5", "#3F3CE5"].includes(bgColor);

	if(isBlack || isWhite)setColor(isBlack ? "black" : "white");
}


const backgroundColorList = ["#686DFF", "#6FD1A2", "#F379B2", "#EEEF70", "#9537D5", "#3F3CE5" ];

export const ColorListLight = [
	"#3CC9B3",
	"#FF7784",
	"#FFBB54",
	"#717EEE",
	"#FF9358",
	"#CFCFCF",
	"#A6C33F",
	"#46BFFF",
	// "#339FF1"
]

export const ColorListDark = [
	"#44DDC5",
	"#FF5C6C",
	"#FFE954",
	"#9578FF",
	"#FF8941",
	"#D9D9D9",
	"#BEE23C",
	"#2DC6FF",
	// "#009CFF"
]

export const color4TextKeyLight = {
	yellow :"#ffba00",
	blue :"#2127b1",
	hotpink :"#ff00ae",
	orange :"#f77400",
	green :"#26912b",
	purple :"#9e00e7",
	black :"#292929",
	white :"#ffffff",
}

export const color4TextKeyDark = {
	yellow :"#ffd200",
	blue :"#00e4ff",
	hotpink :"#ff3ac0",
	orange :"#ff9600",
	green :"#00ff0c",
	purple :"#d235ff",
	black :"#292929",
	white :"#ffffff",
}

export const themeOptions = {
	light:{
		colorList4key:color4TextKeyLight,
		backgroundColorList: backgroundColorList,
		listLine:"#333",
		gaugeText:"#282828",
		contentText:"#393939",
		axisText:"#393939",
		titleText:"#000",
		colorList: ColorListLight,
		// colorList:["#53CA43", "#FA6298", "#F9D33D" , "#FF2069", "#416BFF", "#FAA24B" ],
		listHighLightColor:"#46434316",
		iconColor:null,
		skeleton:"#bbbbbb6f",

		backGradient:"radial-gradient(at 50% 40%,#fff,transparent 80%),radial-gradient(at 50% -47%,rgb(151,203,245),transparent 80%),radial-gradient(at 100% 0,#b8c8e7 0,transparent 32%),radial-gradient(at 100% 98%,rgb(158 106 226 / 37%),transparent),radial-gradient(at 0 97%,rgb(178,138,253),transparent)",
		glowWid:"114vh",

		lineColor:"#e02020",
		lineWid:0.3,
		theme:"light"
	},

	dark:{
		colorList4key:color4TextKeyDark,
		backgroundColorList: backgroundColorList,
		listLine:"#d2cece50",
		gaugeText:"white",
		// contentText:"rgb(177, 175, 205)",
		contentText:"white",
		axisText:"white",
		titleText:"white",
		colorList: ColorListDark,
		// colorList:["#53CA43", "#FA6298", "#F9D33D" , "#FF2069", "#416BFF", "#FAA24B" ],
		listHighLightColor:"#dbd3d32a",
		iconColor:"#cccccc",
		skeleton:"#d3d3d333",

		backGradient:"linear-gradient(to left bottom, #830089, #6f1b8b, #5b278b, #462d88, #303183, #273083, #1b3082, #072f82, #092c88, #11288d, #1b2292, #251b96)",
		glowWid:"100vh",

		lineColor:"white",
		lineWid:0.2,

		theme:"dark",
	}
};