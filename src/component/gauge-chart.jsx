import React,{useState, useEffect, useRef, cloneElement, useContext} from 'react';
import styled from 'styled-components';
import { useThemeMode } from '../provider/MainProvider';
import { themeOptions, color4TextKeyDark, color4TextKeyLight } from '../ref/color';

import { PieChart as PieChartComponent, Pie, ResponsiveContainer, Cell, Label } from 'recharts';
import { KeyControl4MovePostion, KeyControl4ChangeMainSize, KeyControl4ChangeSubSize, KeyControl4Reset } from '../action/KeyControl';

import { config } from '../state';

export const ArcGauge = ({data, card, cardTxtColor, isSelected}) => {
    const maxGauge = 230;
    const overArea = (maxGauge - 180) / 2;

	const [value4Arc, setValue] = useState(0);
	const [persent, setPersent] = useState(0);
    const [arcGaugeSize, setArcGaugeSize] = useState(0);

	const [location, setLocation] = config(`${card.cardType}-location`, {xPos:0, yPos:0, fontSize:0, radiusSize:0});

    const { theme, mode } = useThemeMode();
    const colorList = themeOptions[theme]?.colorList;
    const colorList4key = themeOptions[theme]?.colorList4key;
	
    const arcGaugeRef = useRef();

	useEffect(()=>{
		if(!(data && data.top && data.bottom) )return;

		const top = +data.top;
		const bottom = +data.bottom;

		const persent  = (top / bottom) * 100;
		const value4ArcGauge = (maxGauge * persent)  / 100; 

		setValue(Math.round(value4ArcGauge));
		setPersent(Math.round(persent) + '%');
	},[data]);

    // TODO: ref size 변경 옵저버 부모에게 옮길필요?
	useEffect(() => {
        if(!arcGaugeRef.current)return;
        const resizeObserver = new ResizeObserver((entries) => {
            const { width = 0, height = 0 } = entries[0].contentRect;
            setArcGaugeSize(Math.min(width, height));
        });
        
        resizeObserver.observe(arcGaugeRef.current);
        return () => { resizeObserver.disconnect();}
  	}, [arcGaugeRef]);

	const xPos = 50 + (location.xPos || 0) + "%";
	const yPos = 64 + (location.yPos || 0) + "%";
	const fontSize = (arcGaugeSize * 0.15) + (location.fontSize || 0);
	const radiusSize = (location.radiusSize || 0);

	const handlerSetLoca = (loca) => {setLocation(loca);}
	const handlerReset = () => {setLocation({xPos:0, yPos:0, fontSize:0, radiusSize:0});}
	const options = card.options;
	let gaugeColor = (options && options.mainColor && colorList4key && colorList4key[options.mainColor]) ? colorList4key[options.mainColor] : "#8884d8";

	let textColor = (theme === "dark") ? "#ffffff" : "#333333";
	if(cardTxtColor)textColor = cardTxtColor;

	return (
		<_arc_gauge_ >
		<KeyControl4MovePostion isRunning={isSelected} setLocation={handlerSetLoca} location={location} />
		<KeyControl4ChangeMainSize isRunning={isSelected} dKey="radiusSize" setSize={handlerSetLoca} location={location} />
		<KeyControl4ChangeSubSize isRunning={isSelected} dKey="fontSize" setSize={handlerSetLoca} location={location} />
		<KeyControl4Reset isRunning={isSelected} reset={handlerReset} />
		<div className={"arcgauge-container"}  ref={arcGaugeRef} >
			<ResponsiveContainer >
				<PieChartComponent>
					
					<Pie data={[{uv:1}]} dataKey="uv" nameKey="arc_gauge" cx={xPos} cy={yPos}
						innerRadius={(arcGaugeSize * 0.4) + radiusSize} outerRadius={(arcGaugeSize * 0.48) + radiusSize} 
						cornerRadius={arcGaugeSize * 0.04}
						startAngle={0 - overArea} endAngle={180 + overArea}
						fill="lightgray" stroke="none"
						isAnimationActive={false}
						/>

					<Pie data={[{uv:1}]} dataKey="uv" nameKey="arc_gauge" cx={xPos} cy={yPos}
						innerRadius={(arcGaugeSize * 0.4) + radiusSize} outerRadius={(arcGaugeSize * 0.48) + radiusSize} 
						startAngle={180 + overArea} endAngle={180 + overArea - value4Arc }
						cornerRadius={arcGaugeSize * 0.04} stroke="none"
						fill={gaugeColor}  isAnimationActive={false} labelLine={false}
						label={() => (
							<svg
							width={arcGaugeRef.current?.clientWidth + "px"} height="100%"
							viewBox={`0 0 ${arcGaugeRef.current?.clientWidth || 300} ${arcGaugeRef.current?.clientHeight || 300}`}
							// viewBox="0 0 300 300"
							>
                            <text
								className='svg-text'
                                x={xPos} y={yPos}
								fill={textColor}
                                textAnchor="middle"
                                dominantBaseline="central"
								fontSize={fontSize}
                            >
								{data?.label}
                            </text>
							</svg>
                        )}
						>
					</Pie>
				</PieChartComponent>
			</ResponsiveContainer>
		</div>
		</_arc_gauge_>
	)
}

export const StatusGauge = ({data, card, cardTxtColor, isSelected}) => {
    const maxGauge = 200;
	const overArea = (maxGauge - 180) / 2;

	const [status, setStatus] = useState(0);
	const [sGSize, setSgSize] = useState(0);

	// const [textColor, setTextColor] = useState("#333333");

	const [location, setLocation] = config(`${card.cardType}-location`, {xPos:0, yPos:0, fontSize:0, radiusSize:0});

	const { theme, mode } = useThemeMode();
    const colorList = themeOptions[theme]?.colorList;
	
    const sgRef = useRef();

	useEffect(()=>{
		if(!(data && data.data))return setStatus(0);

		setStatus(data.data);
	},[data]);

	useEffect(() => {
        if(!sgRef.current)return;
        const resizeObserver = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            const height = entries[0].contentRect.height;
            let size = [width, height];
            let min = Math.min(...size);
            setSgSize(min);
        });
        
        resizeObserver.observe(sgRef.current);
        return () => { resizeObserver.disconnect();}
  	}, [sgRef]);

	const cells = [{uv:1},{uv:1},{uv:1},{uv:1},{uv:1}]

	const xPos = 50 + (location.xPos || 0) + "%";
	const yPos = 64 + (location.yPos || 0) + "%";
	const fontSize = (sGSize * 0.15) + (location.fontSize || 0);
	const radiusSize = (location.radiusSize || 0);

	const handlerSetLoca = (loca) => {setLocation(loca);}
	const handlerReset = () => {setLocation({xPos:0, yPos:0, fontSize:0, radiusSize:0});}

    let textColor = (theme === "dark") ? "#ffffff" : "#333333";
	if(cardTxtColor)textColor = cardTxtColor;
	
	return (
		<_status_gage_ fontSize={fontSize} >
		<KeyControl4MovePostion isRunning={isSelected} setLocation={handlerSetLoca} location={location} />
		<KeyControl4ChangeMainSize isRunning={isSelected} dKey="radiusSize" setSize={handlerSetLoca} location={location} />
		<KeyControl4ChangeSubSize isRunning={isSelected} dKey="fontSize" setSize={handlerSetLoca} location={location} />
		<KeyControl4Reset isRunning={isSelected} reset={handlerReset} />
		<div className="status-gauge-container" ref={sgRef}>
			<ResponsiveContainer >
				<PieChartComponent>

					<Pie data={cells} dataKey="uv" nameKey="status_gauge" cx={xPos} cy={yPos}  
					innerRadius={(sGSize*0.4) + radiusSize} outerRadius={(sGSize*0.48) + radiusSize}
					cornerRadius={sGSize*0.04} paddingAngle={5} stroke="none"
					endAngle={0 - overArea} startAngle={180 + overArea}
					fill="lightgray" 
					isAnimationActive={false} labelLine={false}
					label={() => (
						<svg
						width={sgRef.current?.clientWidth + "px"} height="100%"
						viewBox={`0 0 ${sgRef.current?.clientWidth || 300} ${sgRef.current?.clientHeight || 300}`}
						// viewBox="0 0 300 300"
						>
						<text
							className='svg-text'
							x={xPos} y={yPos}
							fill={textColor}
							textAnchor="middle"
							dominantBaseline="central"
							fontSize={fontSize}
						>
							{data?.label}
						</text>
						</svg>
					)}
					>
						{
							cells.map((entry, index) => {
								const color = colorList[index % colorList.length]
								const opacity = status === index + 1 ? "1" : "0.4";	

								return(<Cell key={`cell-${index}`} fill={color}  fillOpacity={opacity} style={{}}/>)
							})
						}
					</Pie>
				</PieChartComponent>
			</ResponsiveContainer>

		</div>
		</_status_gage_>
	)
}






const _arc_gauge_ = styled.div`
width: 100%;
height: 100%;
display:flex;

.arcgauge-container{
	width:100%;
	height:100%;
    position: relative;
}

.svg-text {
	font-family: Arial, sans-serif;
	font-size: ${p => p.fontSize + "px"};
	font-weight: bold;
	pointer-events: auto;
}
`



const _status_gage_ = styled.div`
	width: 100%;
	height: 100%;
	display:flex;

	.status-gauge-container{
		width:100%;
		height:100%;
	}
	.svg-text {
		font-family: Arial, sans-serif;
		/* font-size: ${p => p.fontSize + "px"}; */
		font-weight: bold;
	}
`
