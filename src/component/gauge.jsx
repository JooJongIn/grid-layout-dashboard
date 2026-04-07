import React,{useState, useEffect, useRef, cloneElement, useContext} from 'react';
import styled from 'styled-components';
import { MainContext, useThemeMode } from '../provider/MainProvider';
import { colorList1, setColor4PointColor, color4TextKeyLight,color4TextKeyDark } from '../ref/color';

import { PieChart as PieChartComponent, Pie, ResponsiveContainer, Cell } from 'recharts';

import { KeyControl4MovePostion, KeyControl4ChangeMainSize, KeyControl4Reset } from '../action/KeyControl';

import { config } from '../state';
import { useDerived } from '../hook/useDerived';
import { ChartSelect } from './chart-select';

export const Gauge = ({card, data, isSelected, cardTxtColor, apiObj, isPreview, setOption4Content}) => {
	const gaugeRef = useRef();

	const [ location, setLocation] = config(`${card.cardType}-location`, {xPos:0, yPos:0, fontSize:0});

	const [textColor, setTextColor] = useState("#333333");

	const { theme, mode } = useThemeMode();
	const { derivedInfo, setDerivedInfo } = useDerived();

	const derive = apiObj?.derive || [];

	useEffect(() => {
		const options = card?.options;
		const color = options?.mainColor;
		const colorList = theme === "dark" ? color4TextKeyDark : color4TextKeyLight;
		if(color)setTextColor(colorList[color]);
		else if(cardTxtColor)setTextColor(cardTxtColor);
		else if(theme === "dark")setTextColor("#ffffff");
		else setTextColor("#333333");
	},[theme, card])

	
	const deriveObj = derive.find(d => d.event_type === "click");
	const linkUrl = data?._link_;
	const hasLink = linkUrl && typeof linkUrl === 'string';


	const handlerSetLoca = (loca) => {setLocation(loca);}
	const handlerReset = () => {setLocation({xPos:0, yPos:0, fontSize:0});}

	const handleClick = () => {
		if (!isPreview) return; // 프리뷰 모드가 아니면 링크 동작 안함
		
		if (deriveObj) {
			// derive 이벤트가 있으면 우선 실행
			setDerivedInfo({...deriveObj, value: data?.data});
		} else if (hasLink) {
			// derive가 없을 때만 링크로 새 탭 이동
			window.open(linkUrl, '_blank', 'noopener,noreferrer');
		}
	}

	return (
	<GaugeContainer>
		<_gage_ fontSize={location.fontSize} > 
			<KeyControl4MovePostion isRunning={isSelected} setLocation={handlerSetLoca} location={location} />
			<KeyControl4ChangeMainSize isRunning={isSelected} dKey="fontSize" setSize={handlerSetLoca} location={location} />
			<KeyControl4Reset isRunning={isSelected} reset={handlerReset} />
			<div className='gauge-container' ref={gaugeRef}>
				<div className='gauge-number' id='container'>
				<svg width="100%" 
				height="100%"
				viewBox="0 0 300 300"
				>

					<text x={`${50 + location.xPos}%`} y={`${55 + location.yPos}%`} 
					textAnchor="middle" dominantBaseline="middle" className="svg-text" fill={textColor}
					onClick={(deriveObj || hasLink) && isPreview ? handleClick : null}
					style={{ cursor: (deriveObj || hasLink) && isPreview ? 'pointer' : 'default' }}
					>
						{data?.data || 0}
					</text>
				
				</svg>
				</div>
			</div>
		</_gage_>
	</GaugeContainer>
	)
}

const GaugeContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const _gage_ = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	color: black;
	justify-content: end;

	overflow: hidden;

	.gauge-container{
		width:100%; height:100%; max-height: 100%;
		.gauge-number{ width:100%;height:100%; }
		.gauge-difference{
			font-size: 18px;
			display: flex;
			align-items: center;
		}
	}
	.resizable-box {
		position: relative;
		width: 300px;
		height: 200px;
		min-width: 200px;
		min-height: 150px;
		background-color: #f0f0f0;
		border: 2px solid #666;
		border-radius: 4px;
		overflow: hidden;
		resize: both;
	}

	.svg-text {
		font-family: Arial, sans-serif;
		font-size: ${p => (220 + p.fontSize) + "px"};
		/* font-size: ${p => (180 + p.fontSize) + "px"}; */
		font-weight: bold;
		/* fill: #333; */
	}

	.divide-gauge{
		font-size: ${p => (160 + p.fontSize) + "px"};
	}
`


export const DivideGauge = ({card, cardTxtColor, data, isSelected, isPreview, apiObj, setOption4Content}) => {
	const gaugeRef = useRef();
	const [value, setValue] = useState({low:0, high:0});
	const [textColor, setTextColor] = useState("#333333");

	const [ location, setLocation] = config(`${card.cardType}-location`, {xPos:0, yPos:0, fontSize:0});

	const { theme, mode } = useThemeMode();

	useEffect(()=>{
		if(!(data && data.top && data.bottom))return;
		
		const top = data.top;
		const bottom = data.bottom;

		setValue({low:top, high:bottom});
	},[data]);

	useEffect(() => {
		const options = card?.options;
		const color = options?.mainColor;
		const colorList = theme === "dark" ? color4TextKeyDark : color4TextKeyLight;
		if(color)setTextColor(colorList[color]);
		else if(cardTxtColor)setTextColor(cardTxtColor);
		else if(theme === "dark")setTextColor("#ffffff");
		else setTextColor("#333333");
	},[theme, card])

	const linkUrl = data?._link_;
	const hasLink = linkUrl && typeof linkUrl === 'string';

	const handlerSetLoca = (loca) => {setLocation(loca);}
	const handlerReset = () => {setLocation({xPos:0, yPos:0, fontSize:0});}
	
	const handleClick = () => {
		if (!isPreview) return; // 프리뷰 모드가 아니면 링크 동작 안함
		
		if (hasLink) {
			// DivideGauge는 derive가 없으므로 링크만 처리
			window.open(linkUrl, '_blank', 'noopener,noreferrer');
		}
	}
	
	return (
	<GaugeContainer>
		<_gage_ fontSize={location.fontSize} >
			<KeyControl4MovePostion isRunning={isSelected} setLocation={handlerSetLoca} location={location} />
			<KeyControl4ChangeMainSize isRunning={isSelected} dKey="fontSize" setSize={handlerSetLoca} location={location} />
			<KeyControl4Reset isRunning={isSelected} reset={handlerReset} />
			<div className='gauge-container' ref={gaugeRef}>
				<div className='gauge-number' id='container'>
				<svg width="100%" 
				height="100%"
				viewBox="0 0 300 200"
				fill={textColor}
				>

					<text x={`${50 + location.xPos}%`} y={`${50 + location.yPos}%`} fill={textColor}
					textAnchor="middle" dominantBaseline="middle" className="divide-gauge svg-text"
					onClick={hasLink && isPreview ? handleClick : null}
					style={{ cursor: hasLink && isPreview ? 'pointer' : 'default' }}
					>
							<tspan>{value.low}</tspan>
							<tspan >/</tspan>
							<tspan >{value.high}</tspan>
					</text>
				
				</svg>
				</div>
			</div>
		</_gage_>
	</GaugeContainer>
	)
}

