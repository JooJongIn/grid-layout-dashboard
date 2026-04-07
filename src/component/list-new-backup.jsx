import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components'
import { StatusGauge2 } from './gauge';

import {useMainSetting} from '../hook/useMainSetting'

import { compoClasses } from '../ref/component'

// import Skeleton from '@mui/material/Skeleton';
// import Stack from '@mui/material/Stack';

import kisaImg from '../assets/logo/kisa.png'
import sansImg from '../assets/logo/sans.png'

import blackLinkimg from '../assets/icons/link-black.png'
import whiteLinkimg from '../assets/icons/link-white.png'

import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

import { colorList1 } from '../ref/color';
import { Svg4Color } from "./svg-color";
import { MainContext } from '../provider/MainProvider';	

export function List({dataList, options, dataHeader}) {
	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};
	const {seeEarth, apiList} = useMainSetting();

	const [data4List, setData] = useState([]);
	const [apiOptions ,setApiOptions] = useState({});

	const { itemType, columns: customCol, isHaveHeader, isHaveLine, columnsStyle } = apiOptions;

	const {style: customStyle} = options;

	const initStyleObj = compoClasses.List;
	const initStyle = initStyleObj.styles
	const classStyles = customStyle ? customStyle : initStyle;
	
	useEffect(() => {
		// console.log(_custom_list_.componentStyle.rules );
		if(!dataList) return;
		let newList = [];

		if(isHaveHeader)newList.push(dataHeader);

		newList = [ ...newList, ...dataList];
		setData(newList);
	},[dataList, apiOptions]);


	useEffect(() => {
		if(!options) return;
		let dataPath = options?.dataPath;
		if(!dataPath)return;
		const apiObj = apiList.find(obj => obj.apiUrl === dataPath) || {};
		if(!apiObj)return;
		setApiOptions(apiObj);
	},[options]);
	
	const listItem =  listItemTypes[itemType] ||  <TextType />
	
	const lineColor = themeStyle?.listLine;

	let columns = customCol ? customCol : getCol(data4List);
	
	return (
		<>
		
		<_list_ isHaveHeader={isHaveHeader} isHaveLine={isHaveLine} lineColor={lineColor} classStyles={(classStyles || {})} initStyle={initStyle}>
			{(dataList &&  dataList.length !== 0) && 
			<table>
				{[...data4List].map((item,idx)=>{
					return React.cloneElement(listItem, {item:item, idx:idx, columns:columns, themeStyle:themeStyle, columnsStyle:columnsStyle || {} } )
				})}
			</table>}

			{!dataList && 
			["","","",""].map((item,idx)=>{
				return React.cloneElement(<SkeletonType />, {item:item, key:idx } )
			})
			}

		</_list_>
		

		{(dataList &&  dataList.length === 0) && 
		<>
			데이터 없음 
		</>
		}
		</>
	)
}

const getCol = (list) => {
	if(list.length === 0) return [];
	for (const item of list) {
		if(!item)continue;

		return Object.keys(item);
	}
}



const SkeletonType = ({item, key}) => {
	const style = {
		width: "10%",
	}
	const rowStyle = {
		height: "30px"
	}

	return(
		<div className='list-row' style={rowStyle}>
			<div className='list-cell'>
				<Skeleton height={"15px"}  />
			</div>
			<div className='space' style={style}></div>
			<div className='list-cell flex-2'>
				<Skeleton height={"15px"}  /> 
			</div>
			
		</div>
	)
}

const TextType = ({item, idx, columns, columnsStyle, themeStyle}) => {
	if(!item)return(<div  />);
	const cells = (columns || []).map((col, colIdx) => {
		const cellText = item[col];
		let cellStyle = {};

		const colSty = columnsStyle[colIdx];

		cellStyle = {
			...cellStyle,
			...colSty
		}

		return(<td className='list-cell' style={cellStyle}>{cellText}</td>)
	})
	return(<tr className='list-row'>{cells}</tr>)
}

const imgList = [ kisaImg, sansImg ];

const StatusType = ({item, idx, columns}) => {
	const values = Object.values(item);
	const color = colorList1[idx % 5];


	return(
		<div className='list-row row-status'>
			<div className='list-cell'>
				<div className='list-subcell img-cell'>
					<img src={imgList[idx]} />
				</div>
			</div>
			<div className='list-cell'>
				<div className='list-subcell'>
					<div>{values[2]}</div>
					{/* <div className='list-date'>web attack {hours}:{minite}:{second}</div> */}
					<div>{values[0]}</div>
				</div>
				<div className='list-subcell'><StatusGauge2 data={{...item}}/></div>
			</div>		
		</div>
	)

}

const IconType = ({item, idx, columns, themeStyle, columnsStyle}) => {
	if(!item)return(<div  />);
	const colorList = themeStyle.colorList;
	const cells = (columns || []).map((col, colIdx) => {
		let cellText = item[col];
		let cellStyle = {};
		if(col === "dot"){
			let color = colorList[idx % colorList.length];
			cellStyle = {
				...cellStyle,
				"text-shadow": color + " 0px 0px 0px",
				"font-size":"30px",
				"line-height":"14px",
				"display":"flex",
				"-webkit-box-align":"center",
				"align-items":"center",
				"max-width":"25px",
				"color":"transparent",
			}
			cellText = "•";
		}

		if(col === "difference"){
			const arrow = item.arrow;

			const imoji = arrow === "up" ? "▲": "▼";
	
			const arrowColor = arrow === "down" ? "#20d587" : "#ff0040" 
			
			cellStyle = {
				...cellStyle,
				"color":arrowColor,
			}

			cellText = imoji + cellText;
		}

		if(col === "linkurl"){
			cellText = (
				<a href={item[col]} className='list-img'>
					<img src={blackLinkimg} />
				</a> 
			)
		}

		const colSty = columnsStyle[colIdx];

		cellStyle = {
			...cellStyle,
			// ...colSty
		}

		return(<td className='list-cell' style={cellStyle}>{cellText}</td>)
	})

	return(
		<tr className='list-row icon-type'>
			{cells}
		</tr>
	)
}

const GaugeType = ({item, idx, columns, themeStyle, columnsStyle}) => {
	const {id, cnt, difference, arrow} = item;
	const imoji = arrow === "up" ? "▲": "▼";
	
	const arrowColor = {color: arrow === "down" ? "#20d587" : "#ff0040" }

	return(
		<div className='list-row gauge-type'>
			<div className='list-cell text-big'>{id}</div>
			<div className='list-cell'>
				<div className='list-subcell text-small'>daily</div>
				<div className='list-subcell'>
					<div className='text-pad'>{cnt}  </div>
					<div style={arrowColor}>{imoji}</div>
					<div style={arrowColor}>{difference}%</div>
				</div>
			</div>
		</div>
	)
}

const ProgressType = ({item, idx, columns, themeStyle}) => {
	const [titleKey, endValKey, ingValKey] = columns;
	const endVal = item[endValKey];
	const ingVal = item[ingValKey];
	const title = item[titleKey];
	console.log('title', endValKey, ingValKey, titleKey);

	const colorList = themeStyle.colorList;
	const color = colorList[idx % 5];

	let progressVal = ingVal / endVal * 100;
	progressVal = progressVal > 100 ? 100 : progressVal;

	const grayColor = themeStyle?.skeleton;

	const emptyStyle ={
		backgroundColor: grayColor
	}
	const barStyle ={
		width: `${progressVal}%`,
		backgroundColor: color
	}

	

	return(
	<div className='list-row progress-type'>
		<div className='list-cell'>
			<div className='list-subcell bold'>
			{title}
			</div>
			<div className='list-subcell'>
			{ingVal} / {endVal}
			</div>
		</div>
		<div className='list-cell progress-area'>
			<div className='progress-empty'style={emptyStyle} ></div>
			<div className='progress-bar' style={barStyle}></div>
		</div>
		
	</div>
	)

}

const listItemTypes = {
	StatusType:<StatusType />,
	IconType:<IconType />,
	GaugeType:<GaugeType />,
	ProgressType:<ProgressType />,

}




const _list_ = styled.div`
	width: ${props => !props.isPadding ? "100%" : "calc(100% + 15px)"};
	height: 100%;
	
	overflow-y: scroll;
	font-size: 14px;

	table{
		width: 100%;
	}

		/* width */
	::-webkit-scrollbar {
		/* 세로 */
		width: 4px;
		/* 가로 */
		height: 4px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: transparent;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #BFBFBF;
		border-radius: 3px;
	}

	/*  상하+좌우 스크롤이 만나는 공간   */
	::-webkit-scrollbar-corner {
      background-color: transparent;
	}
	

	${props =>  props.isHaveHeader &&  `
	.list-row:first-child{
		border-bottom: 1px solid ${props.lineColor};
	}`}

	${props =>  props.isHaveHeader &&  `
	.list-row{
		border-bottom: 1px solid ${props.lineColor};
	}
	.list-row:last-child{
		border-bottom: 1px solid transparent ;
	}`
	}


	.list-row{
		${props => props.classStyles["list-row"] || 
			props.initStyle["list-row"]
		}
		/* display: flex;
		width: 100%;
		justify-content: space-between;
		
		padding: 2px; */
	}

	

	.list-cell{
		${props => props.classStyles["list-cell"] ||
		props.initStyle["list-cell"]
		}
		/* flex: 1;
		display:flex;
		justify-content: center; */

		overflow:hidden;
		text-overflow: ellipsis;
    	white-space: nowrap;
	}



	/*  another type */
	.row-status{
		margin-bottom: 1rem;
		.img-cell{
			display: flex;
			align-items: center;
			img{
				width: 50px;
				min-width: 50px;
				border-radius: 12px;
			}
		}

		.list-cell{
			margin-right: 2rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			.list-subcell{
				display: flex;
				justify-content: space-between;
				padding: 1px;

				font-size: 16px;
				font-weight: 700;
			}
			.bold{
				font-weight: 700;
			}
			:last-child{
				flex:1;
			}
		}
	}
	
	.gauge-type{
		flex-direction: column;
		font-size: 16px;
		padding: 3px 0px;

		
		border-bottom: 1px solid ${props =>  props.lineColor};
		:last-child{
			border-bottom: 1px solid transparent;
		}

		.list-cell{
		width: 100%;
		
		display: flex;
		flex-direction: column;
		
		.list-subcell{
			display: flex;
			flex-direction: row;
		}
		}
		.text-big{
			font-size: 20px;
		}
		.text-small{
			font-size: 10px;
		}
		.pad-left{
			padding-left: 20px;
		}
		.text-pad{
			padding-right: 10px;
		}
	}

	.progress-type{
		flex-direction: column;
		height: 50px;
		.list-cell{
			width: 100%;

			display: flex;
			justify-content: space-between;
			font-size: 15px;

		}
		.progress-area{
			width: 100%;
			margin: 3px 0;
			position: relative;

			.progress-bar{
				position: absolute;
				left: 0;
				top: 0;
				height: 7px;
				border-radius: 10px;
			}
			.progress-empty{
				position: absolute;
				right: 0;
				top: 0;

				width: 100%;
				height: 7px;

				border-radius: 5px;
			}
		}
	}

`


const _custom_list_ = styled.div`
	.list-row{
		display: flex;
		width: 100%;
		justify-content: space-between;
		
		padding: 2px;
	}

	

	.list-cell{
		flex: 1;
		display:flex;
		justify-content: center;

		overflow:hidden;
		text-overflow: ellipsis;
    	white-space: nowrap;
	}

`