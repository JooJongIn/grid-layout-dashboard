import React,{ useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { isMilliSecond } from '../pages/utils';

import { 
	AreaChart as AreaChartComponent, Area,
	LineChart as LineChartComponent, Line,
	BarChart as BarChartComponent, Bar,
	PieChart as PieChartComponent, Pie,
	RadarChart as RadarChartComponent, Radar,
	XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell,
	PolarGrid, PolarAngleAxis, PolarRadiusAxis, Label
} from 'recharts';

import { MainContext, useThemeMode } from '../provider/MainProvider';

import {yAxisConfig4Line, xAxisConfig4Line, areaConfig4Line, yAxisConfig4Bar, xAxisConfig4Bar} from '../ref/chartRef';

import { KeyControl4MovePostion, KeyControl4ChangeMainSize, KeyControl4ChangeSubSize, KeyControl4Reset } from '../action/KeyControl';
import { config } from '../state';

import { setColor4PointColor } from '../ref/color';

import { usePages } from '../hook/usePage';
import { useDerived } from '../hook/useDerived';
import { transformData } from '../utils/dataTransform';

const renderLegend = (props) => {
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

const _legend_ = styled.ul`
	.legend-list{
		display: flex;
		justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
		padding-left: 10%;
		
		margin-top: 10px;

		flex-wrap: wrap;
		text-overflow: ellipsis;
		text-wrap: nowrap;

		li{
			margin-right: 10px; font-size: 12px; display: flex;
			.legend-label{ display: flex; align-items: center; }
			.circle{ font-size: 20px; line-height: 20px; }
		}
		&.pie{
			flex-wrap: nowrap;
		}
	}

	

`
const _back_ = styled.div`
	position: absolute;
	width:100%;
	height: 73%;
	display: flex;
	justify-content: space-between;
	padding-left: 25px;
	padding-right: 15px;

	.stripe{
		width: 15%;
		height: 100%;
	}
`
const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9])/;


const filterChartDataFormat = (format) => {
	if(!(format && typeof format === 'object'))return {};
	let newFormat = {};
	let xAsix = {}
	
	for (const key in format) {
		const val = format[key];
		if(key === 'label' && (typeof val === 'string' ||  typeof val === 'number'))xAsix = { 
			dataKey: xasixKey,
			// key: xasixKey
		};
		else if(typeof +val === 'number')newFormat[key] = val;
	}
	return [newFormat, xAsix];
}

const xasixKey = 'label';

// 차트 공통 훅
function useChart(data, layout, card, refWidth) {
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
		tickColor: false
	});

	const [options, setOptions] = useState({});

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
		setChartState(prev => ({
			...prev,
			isSmallChart: isSmall
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

// LineChart 컴포넌트
export function LineChart({data, layout, card}) {
	// 원본 데이터가 [{label, nm, cnt}] 형식인 경우 변환
	const transformedData = useMemo(() => {
		// 데이터 형식 확인 (첫 번째 항목에 label, nm, cnt가 모두 있는지 확인)
		if (data && data.length > 0 && data[0].label && data[0].nm && 'cnt' in data[0]) {
			// transformData 함수를 사용하여 데이터 변환
			return transformData(data);
		}
		// 이미 변환된 형식이거나 다른 형식인 경우 원본 데이터 사용
		return data;
	}, [data]);
	
	const refWidth = card?.options?.color ? 40 : 36;
	const { chartState, options, themeStyle } = useChart(transformedData, layout, card, refWidth);
	
	const colorList = themeStyle?.colorList || [];
	const colorListLength = colorList.length;
	const seeChartGradient = options.seeChartGradient;
	const seeChartLegend = options.seeChartLegend;

	// 축 포맷터
	const formatYAxis = useCallback((val, idx) => {
		return idx === 0 ? "" : val;
	}, []);

	const formatXAxis = useCallback((val) => {
		if (!chartState.data?.[0]) return "";
		
		const result = dateRegex.test(val);
		const xKey = Object.keys(chartState.data[0])[0];
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
	}, [chartState.data]);

	// 축 설정
	const axisConfig = {
		yAxis: {
			...yAxisConfig4Line,
			tick: { fill: chartState.tickColor },
			hide: chartState.isSmallChart,
			tickFormatter: formatYAxis
		},
		xAxis: {
			...xAxisConfig4Line,
			tick: { fill: chartState.tickColor },
			label: { fill: "red" },
			tickFormatter: formatXAxis
		}
	};

	// 그라데이션 설정
	const gradientStartOpacity = seeChartGradient ? 0.2 : 0;
	const renderGradients = useCallback(() => (
		colorList.map(color => (
			<linearGradient key={color} id={`${color}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="5%" stopColor={color} stopOpacity={gradientStartOpacity}/>
				<stop offset="95%" stopColor={color} stopOpacity={0}/>
			</linearGradient>
		))
	), [colorList, gradientStartOpacity]);

	// 라인 렌더링
	const renderLines = useCallback(() => (
		Object.keys(chartState.columns).map((key, idx) => {
			const value = chartState.columns[key];
			if (typeof value !== 'number') return null;

			const color = colorList[idx % colorListLength];
			const colorId = `url(#${color})`;
			
			return (
				<Area
					key={key}
					{...areaConfig4Line}
					dataKey={key}
					stroke={color}
					fill={colorId}
					dot={{ stroke: color, strokeWidth: 1, r: 1, strokeDasharray: '' }}
				/>
			);
		})
	), [chartState.columns, colorList, colorListLength]);

	if (chartState.isNotFormat) {
		return (
			<div style={{height: "100%", display: "flex", alignItems: "center"}}>
				잘못된 데이터 형식입니다
			</div>
		);
	}

	return (
		<div style={{width: "100%", height: "100%"}}>
			<ResponsiveContainer>
				<AreaChartComponent
					data={chartState.isEmpty ? sample : chartState.data}
					margin={{left: chartState.isSmallChart ? 0 : -20, bottom: 0, top: 5}}
				>
					<defs>
						{renderGradients()}
						<linearGradient id="skeleton" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="gray" stopOpacity={1}/>
							<stop offset="95%" stopColor="gray" stopOpacity={0}/>
						</linearGradient>
					</defs>

					{!chartState.isEmpty && renderLines()}
					{!chartState.isEmpty && !chartState.isSmallChart && (
						<XAxis {...axisConfig.xAxis} {...chartState.xAxis} background={{ fill: '#eee' }} />
					)}
					{chartState.isEmpty && (
						<Area
							type="monotone"
							stroke="gray"
							strokeWidth={3}
							dataKey="uv"
							fill="url(#skeleton)"
						/>
					)}

					{seeChartLegend && (
						<Legend type="line" content={renderLegend} />
					)}
					<YAxis {...axisConfig.yAxis} />
				</AreaChartComponent>
			</ResponsiveContainer>
		</div>
	);
}

// 굵기 끝 라운드 조절
// 띄어진거 붙이기
// skeleton bar ?

export function BarChart({layout, data, children, card, apiObj}){ 
	// 원본 데이터가 [{label, nm, cnt}] 형식인 경우 변환
	const transformedData = useMemo(() => {
		// 데이터 형식 확인 (첫 번째 항목에 label, nm, cnt가 모두 있는지 확인)
		if (data && data.length > 0 && data[0].label && data[0].nm && 'cnt' in data[0]) {
			// transformData 함수를 사용하여 데이터 변환
			return transformData(data);
		}
		// 이미 변환된 형식이거나 다른 형식인 경우 원본 데이터 사용
		return data;
	}, [data]);

	const refWidth = card?.options?.color ? 40 : 36;
	const { chartState, options, themeStyle } = useChart(transformedData, layout, card, refWidth);
	const { derivedInfo, setDerivedInfo } = useDerived();

	const colorList = themeStyle?.colorList || [];
	const colorListLength = colorList.length;
	const seeChartGradient = options.seeChartGradient;
	const seeChartLegend = options.seeChartLegend;

	const dx = 3;

	const derive = apiObj?.derive || [];

	const deriveFromBarList = derive.filter(d => d.event_type === "bar_click");

	const deriveFromLegendList = derive.filter(d => d.event_type === "legend_click");

	const handleBarClick = (key, data, columnIndex, deriveObj, t) => {
		const payload = data.payload;

		setDerivedInfo({...deriveObj, data: payload, value: payload[key], colName: key, colIdx: columnIndex});
	};

	// 축 포맷터
	const formatYAxis = useCallback((val, idx) => {
		return idx === 0 ? "" : val;
	}, []);

	// 축 설정
	const axisConfig = {
		yAxis: {
			...yAxisConfig4Bar,
			tick: { fill: chartState.tickColor },
			hide: chartState.isSmallChart,
			dx: dx,
			tickFormatter: formatYAxis
		},
		xAxis: {
			...xAxisConfig4Bar,
			tick: { fill: chartState.tickColor }
		}
	};

	// 바 렌더링
	const renderBars = useCallback(() => {
		return Object.keys(chartState.columns).map((key, idx) => {
			const value = chartState.columns[key];
			if (typeof value !== 'number') return null;

			const color = colorList[idx % colorList.length];
			const deriveObj = deriveFromBarList.find(d => d.colName === key || d.colIdx === idx);
			

			return (
				<Bar
					key={key}
					type="monotone"
					dataKey={key}
					barSize={6}
					stroke={color}
					fill={color}
					radius={[6, 6, 0, 0]}
					onClick={deriveObj ? (data, index, t) => handleBarClick(key,data, index, deriveObj, t) : undefined}
					cursor={deriveObj ? 'pointer' : 'default'}
				/>
			);
		});
	}, [chartState.columns, colorList]);

	if (chartState.isNotFormat) {
		return (
			<div style={{height: "100%", display: "flex", alignItems: "center"}}>
				잘못된 데이터 형식입니다
			</div>
		);
	}


	const SampleBar = () => <Bar type="monotone" dataKey="uv" barSize={6} stroke="gray" fill="gray" radius={[6, 6, 0, 0]}/>
	

	return (
		<div style={{width: "100%", height: "100%"}}>
			<ResponsiveContainer>
				<BarChartComponent
					data={chartState.isEmpty ? sample : chartState.data}
					margin={{left: chartState.isSmallChart ? 0 : -20, bottom: 5, top: 5}}
				>
					{!chartState.isEmpty && (
						<>
							{renderBars()}
							{!chartState.isSmallChart && (
								<XAxis {...axisConfig.xAxis} {...chartState.xAxis} />
							)}
							<CartesianGrid
								strokeDasharray="3"
								vertical={false}
								horizontalPoints={[]}
								x={40} opacity={0.3}
							/>
						</>
					)}

					{chartState.isEmpty && (<SampleBar />)}

					{seeChartLegend && (
						<Legend 
							type="bar" 
							content={(props) => renderLegend({
								...props, 
								deriveFromLegendList,
								setDerivedInfo
							})} 
						/>
					)}

					<YAxis {...axisConfig.yAxis} />
				</BarChartComponent>
			</ResponsiveContainer>
		</div>
	);
}



const renderPieLegend = (props) => {
	const { payload, align, type, deriveFromLegendList, setDerivedInfo } = props;
	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};
	const colorList = themeStyle?.colorList;

	const handleLegendClick = (entry, index) => {
		const deriveObj = deriveFromLegendList?.find(
			d => d.colName === entry.payload.name || d.colIdx === index
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

const pieRefTable = { _link_: true };

export function PieChart({ data, card, isSelected, apiObj }) {
	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};
	const colorList = themeStyle?.colorList;
	const pieRef = useRef();

	const [chartState, setChartState] = useState({
		data: [],
		label: '',
		pieSize: 0,
		options: { seeChartLegend: false }
	});

	const [location, setLocation] = config(`${card.cardType}-location`, {
		xPos: 0, yPos: 0, fontSize: 0, radiusSize: 0
	});

	const { derivedInfo, setDerivedInfo } = useDerived();
	

	const derive = apiObj?.derive || [];

	useEffect(() => {
		if (!data) return initPie();
		const realData = Array.isArray(data) ? data[0] : data;
		if (!realData) return initPie();

		const filterData = Object.entries(realData)
			.filter(([key, value]) => !pieRefTable[key] && !isNaN(+value))
			.map(([key, value]) => ({
				name: key,
				value: +value
			}));

		setChartState(prev => ({
			...prev,
			data: filterData,
			label: realData.label || ''
		}));
	}, [data]);

	useEffect(() => {
		const min = Math.min(pieRef.current?.offsetWidth || 0, pieRef.current?.offsetHeight || 0);
		setChartState(prev => ({ 
			...prev, 
			pieSize: prev.options.seeChartLegend ? min - 20 : min 
		}));
	}, [card.cardLocation, card.options, card.isCardHeader, chartState.options.seeChartLegend]);

	useEffect(() => {
		if (card?.options) {
			setChartState(prev => ({ ...prev, options: card.options }));
		}
	}, [card]);

	const initPie = () => {
		setChartState(prev => ({ ...prev, data: [], label: '' }));
	};

	const styles = {
		position: {
			x: `${50 + (location.xPos || 0)}%`,
			y: `${55 + (location.yPos || 0)}%`
		},
		size: {
			font: (chartState.pieSize * 0.15) + (location.fontSize || 0),
			radius: location.radiusSize || 0
		}
	};

	const nonZeroCount = chartState.data.filter(item => item.value !== 0).length;

	const deriveFromPieList = derive.filter(d => d.event_type === "pie_click");
	const deriveFromLegendList = derive.filter(d => d.event_type === "legend_click");

	const handlePieClick = (name, data, index, deriveObj) => {
		const payload = data.payload || data;
		
		setDerivedInfo({
			...deriveObj,
			data: payload,
			value: payload.value,
			colName: name,
			colIdx: index
		});
	};


	return (
		<_pie_gauge_ fontSize={styles.size.font} ref={pieRef}>
			<KeyControl4MovePostion isRunning={isSelected} setLocation={setLocation} location={location} />
			<KeyControl4ChangeMainSize isRunning={isSelected} dKey="radiusSize" setSize={setLocation} location={location} />
			<KeyControl4ChangeSubSize isRunning={isSelected} dKey="fontSize" setSize={setLocation} location={location} />
			<KeyControl4Reset isRunning={isSelected} reset={() => setLocation({xPos:0, yPos:0, fontSize:0, radiusSize:0})} />

			<ResponsiveContainer>
				<PieChartComponent>
					<Pie
						data={chartState.data} dataKey="value" nameKey="test" 
						cx={styles.position.x} cy={styles.position.y}
						innerRadius={chartState.pieSize * 0.37 + styles.size.radius} 
						outerRadius={chartState.pieSize * 0.45 + styles.size.radius}
						startAngle={0} endAngle={360} paddingAngle={nonZeroCount >= 2 ? 6 : 0}
						cornerRadius={10}
						fill="#8884d8" stroke="none"
						isAnimationActive={false} labelLine={false}
						label={({ cx, cy }) => (
							<text
								className='svg-text'
								x={cx}
								y={cy}
								fill={themeStyle?.titleText || "#000"}
								textAnchor="middle"
								dominantBaseline="central"
								fontSize={styles.size.font}
							>
								{data?.label}
							</text>
						)}
						onClick={(data, index) => {
							const deriveObj = deriveFromPieList.find( d => d.colName === data.name || d.colIdx === index);
							if (deriveObj) {
								handlePieClick(data.name, data, index, deriveObj);
							}
						}}
						cursor={deriveFromPieList.length ? 'pointer' : 'default'}
					>
						{chartState.data.map((entry, index) => (
							<Cell 
								key={`cell-${index}`} 
								fill={colorList[index % colorList.length]}
							/>
						))}
					</Pie>
					
					{chartState.options.seeChartLegend && (
						<Legend
							align="right"
							type="pie"
							content={(props)=>renderPieLegend({
								...props, 
								deriveFromLegendList,
								setDerivedInfo
							})}
							wrapperStyle={{
								position: 'absolute',
								right: '0px',
								bottom: '-5px',
								fontSize: '0.8em'
							}}
						/>
					)}
				</PieChartComponent>
			</ResponsiveContainer>
		</_pie_gauge_>
	);
}

const _pie_gauge_ = styled.div`
width: 100%;
height: 100%;
display:flex;

.svg-text {
	font-family: Arial, sans-serif;
	font-size: ${p => p.fontSize + "px"};
	font-weight: bold;
}
`

const radarsample = [
	{ label: 'Math', A: 120, B: 110, domain: [0, 150] },
    { label: 'Chinese', A: 98, B: 130, domain: [0, 150] },
    { label: 'English', A: 86, B: 130, domain: [0, 150] },
    { label: 'Geography', A: 99, B: 100, domain: [0, 100] },
    { label: 'Physics', A: 85, B: 90, domain: [0, 100] },
    { label: 'History', A: 65, B: 85, domain: [0, 100] },
]

const radarRefTable = {
	min: true, 
	max: true,
	label: true,
	_link_: true
}

export function RadarChart({layout, data, isSelected, card}){
	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};

	const {theme} = useThemeMode();

	const [chartData, setData] = useState([]);
	const [isEmpty, setIsEmpty] = useState(true);
	const [options, setOptions] = useState( {} );

	const [chartDomain, setDomain] = useState( [] );
	const [tickColor, setTickColor] = useState(false);

	const [location, setLocation] = config(`${card.cardType}-location`, {xPos:0, yPos:0, fontSize:0, mainSize:0});

	const radarRef = useRef();
	// const seeChartLegend = true;
	const seeChartLegend = options.seeChartLegend;
	
	useEffect(() => {
		if(!(data && typeof data === 'object')){
			setData([]);
			setIsEmpty(true);
			return
		}

		let dataArray = [];
		let data4RadarFormat;
		let newData = []

		if((Array.isArray(data))){
			dataArray = data;
			data4RadarFormat = data[0];
		}else if(typeof data === 'object'){
			dataArray = [data];
			data4RadarFormat = data;
		}

		let dataKeys = Object.keys(data4RadarFormat).filter(k => !radarRefTable.hasOwnProperty(k));


		if(data4RadarFormat.max && data4RadarFormat.min)setDomain([+data4RadarFormat.min, +data4RadarFormat.max]);
		else if(data4RadarFormat.max)setDomain([0, +data4RadarFormat.max]);

		

		for (const [idx, dItem] of dataArray.entries()) {
			const dataKey = dItem.label || idx;
			
			if(idx === 0){
				dataKeys.map((key, idx2) =>{
					const value = dItem[key];
					newData[idx2] = {label: key, [dataKey]: value }
				}
			)}else{
				dataKeys.map((key, idx2) =>{
					const value = dItem[key];
					newData[idx2] = { ...newData[idx2], [dataKey]: value}
				})
			}
		}
		
		setData(newData)
		setIsEmpty(false);
	},[data])

	useEffect(() => {
		if(!(card && card.options))return;
		setOptions(card.options);
	},[card])

	useEffect(() => {
		const tickColor = themeStyle?.axisText;
		const options = card?.options;

		if(typeof options.bgColor === 'string')setColor4PointColor(options, setTickColor);
		else if(tickColor)setTickColor(tickColor);
	},[card, themeStyle]);

	const colorList = themeStyle?.colorList || [];
	// const tickColor = themeStyle?.axisText;


	const xaxisStyle = { tick: { fill: tickColor, fontSize: '0.8em' }}


	const Radars = !isEmpty ? Object.keys(chartData[0]).filter(k => !radarRefTable.hasOwnProperty(k)).map((key, idx)=> {
		const sampleData = chartData[0];
		const value = +sampleData[key];
		
		if(!isNaN(value) && !radarRefTable[key] ){
			const color = colorList[idx % colorList.length];
			let radarOption = {
				name: key,
				dataKey: key,
				stroke:color,
				fill:color,
				fillOpacity:0.6,
				
			}

				//  리미트 설정 필요 체크
			    // {
				// 	data.map((entry, index) => (
				// 	<Cell domain={[0, entry.fullMark]} key={`cell-${index}`}/>
				// 	))
				// }


			return (<Radar {...radarOption} />	)
		}

		return (<></>);
	}) : null;

	const handlerSetLoca = (loca) => {setLocation(loca);}
	const handlerReset = () => {setLocation({xPos:0, yPos:0, fontSize:0, radiusSize:0});}

	const sampleColor = theme === 'dark' ? "lightgray" : "gray";

	return(
		<>
		<KeyControl4MovePostion isRunning={isSelected} setLocation={handlerSetLoca} location={location} />
		<KeyControl4ChangeMainSize isRunning={isSelected} dKey="mainSize" setSize={handlerSetLoca} location={location} />
		<KeyControl4Reset isRunning={isSelected} reset={handlerReset} />

		<ResponsiveContainer >
		 <RadarChartComponent
		 	data={!isEmpty ? chartData : radarsample}
			margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
			cx={`${50 + location.xPos}%`} cy={`${50 + location.yPos}%`} 
			outerRadius={`${80 + location.mainSize}%`}
			>
		 	<PolarGrid stroke={tickColor} />
		 	{/* <PolarRadiusAxis /> */}
			<PolarAngleAxis dataKey={"label"} {...xaxisStyle}   />
			<PolarRadiusAxis angle={30} domain={chartDomain} tick={false} axisLine={false} />

		 	{!isEmpty && Radars}
			{(isEmpty ) && 
				<>
					<Radar 
					dataKey={"A"} 
					fillOpacity={0.8}
					stroke={'lightgray'}
					fill={sampleColor}
					
					/>	
				</>
			}
			{seeChartLegend && <Legend type="radar" content={renderLegend} wrapperStyle={{ fontSize: '0.8em', paddingTop: '10px' }} /> }
    	 </RadarChartComponent>
		 </ResponsiveContainer>
		</>
	)
}




const sample = [
  {
    "name": "Representative",
    "uv": 492,
    "pv": 65810,
    "id": "1"
  },
  {
    "name": "Architect",
    "uv": 435,
    "pv": 31400,
    "id": "2"
  },
  {
    "name": "Agent",
    "uv": 673,
    "pv": 99664,
    "id": "3"
  },
  {
    "name": "Producer",
    "uv": 752,
    "pv": 29531,
    "id": "4"
  },
  {
    "name": "Strategist",
    "uv": 800,
    "pv": 6938,
    "id": "5"
  }

 
]