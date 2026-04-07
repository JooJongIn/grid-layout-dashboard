import React, { useEffect, useState, useRef, useContext } from 'react';
import { MainContext } from '../../../../provider/MainProvider';
import { _color_picker_ } from '../../../../styles/stage-style';


const titleObj = {
	mainColor:"글자색 선택",
	bgColor:"배경색 선택",
}

// let textColor = ["#292929", "#fff", "#b1b0b0" ];
let sampleColorBackground = ["blue", "green", "hotpink", "yellow", "purple", "navy" ];
let sampleColorText = ["yellow","blue","hotpink","orange","green","purple"];

export const ColorPalette = ({dKey, setOption,  onClose, list, settingbarRef}) => {
	const [paletList, setPaletList] = useState([]);
	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};
	// const colorList = themeStyle?.colorList;
	const colorList4key = themeStyle?.colorList4key;
	const backgroundColorList = themeStyle?.backgroundColorList;

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutSide)

		return () => {
			document.removeEventListener('mousedown', handleClickOutSide)
		}
	})

	useEffect(() => {
		if(!dKey)return setPaletList(sampleColor);
		if("mainColor" === dKey)setPaletList(sampleColorText);
		if("bgColor" === dKey)setPaletList(backgroundColorList);
	},[dKey])

	const paletteRef = useRef();

	const handleClickOutSide = (e) => {
		if (paletteRef.current.contains(e.target))return;
		if (settingbarRef.current.contains(e.target))return;
		onClose()
		e.stopPropagation();
	}


	const handlerOnClick = (color) => {
		if(dKey)setOption(dKey, color);
	}
	
	const palettes = paletList.map((color, index) =>{	
		let realColor = "mainColor" === dKey ? colorList4key[color] :  color;

		// if(index === 0)return (
		// 	<div className='palette-item' onClick={()=>{handlerOnClick(color)}} >
		// 		<div  className='palette-color' style={{ height: "100%" }} >
		// 			<img src={cancelIcon} style={{ height: "100%" }} />
		// 		</div>
		// 	</div>
		// )

		return(
			<div className='palette-item' onClick={()=>{handlerOnClick(color)}} >
				<div className='palette-color' style={{backgroundColor: realColor, height: "100%" }} />
			</div>
		)
	})

	let titleText = titleObj[dKey] ;
	
	return(
		<_color_picker_>
			<div className='palette'  ref={paletteRef}>
			<div className='palette-title'>
				{titleText}
			</div>
			<div className='palettes-items half'>
				<div className='palette-item' onClick={()=>{handlerOnClick("mainColor" === dKey ? "white" : "#ffffff")}} >
					<div className='palette-color' style={{backgroundColor: "white", height: "100%" }} />
				</div>
				<div className='palette-item' onClick={()=>{handlerOnClick("mainColor" === dKey ? "black" : "#000000")}} >
					<div className='palette-color' style={{backgroundColor: "black", height: "100%" }} />
				</div>
			</div>
			<div className='palettes-items'>
			{palettes}
			</div>
			<div className='palette-foot' >
				<button className='palette-null-btn' onClick={()=>{handlerOnClick(null)}}>
					모드 기본 사용
				</button>
			</div>
			</div>
		</_color_picker_>
	)
}

