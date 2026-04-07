import React, { useContext, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { PieChart as PieChartComponent, Pie, Legend, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { MainContext } from '../../provider/MainProvider';
import { KeyControl4MovePostion, KeyControl4ChangeMainSize, KeyControl4ChangeSubSize, KeyControl4Reset } from '../../action/KeyControl';
import { config } from '../../state';
import { useDerived } from '../../hook/useDerived';
import { ChartSelect } from '../chart-select';

const pieRefTable = { _link_: true };

// 레전드 컴포넌트
const PieLegend = React.memo(({ payload, align, type, deriveFromLegendList, setDerivedInfo }) => {
	const { themeStyle } = useContext(MainContext);
	const colorList = themeStyle?.colorList;

	const handleLegendClick = useCallback((entry, index) => {
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
	}, [deriveFromLegendList, setDerivedInfo]);

	return (
		<_legend_ align={align}>
			<ul className={`legend-list ${type || ''}`}>
				{payload.map((entry, index) => (
					<li 
						className="drag-cancel"
						key={`item-${index}`} 
						onClick={() => handleLegendClick(entry, index)}
						style={{ cursor: deriveFromLegendList?.length ? 'pointer' : 'default' }}
					> 
						<div className='circle' style={{ color: colorList[index] }}>•</div>
						<div className='legend-label'>{entry.value}</div>
					</li>
				))}
			</ul>
		</_legend_>
	);
});

// 키 컨트롤 컴포넌트
const KeyControls = React.memo(({ isSelected, location, setLocation }) => (
	<>
		<KeyControl4MovePostion isRunning={isSelected} setLocation={setLocation} location={location} />
		<KeyControl4ChangeMainSize isRunning={isSelected} dKey="radiusSize" setSize={setLocation} location={location} />
		<KeyControl4ChangeSubSize isRunning={isSelected} dKey="fontSize" setSize={setLocation} location={location} />
		<KeyControl4Reset isRunning={isSelected} reset={() => setLocation({xPos:0, yPos:0, fontSize:0, radiusSize:0})} />
	</>
));

// 커스텀 툴팁 컴포넌트
const CustomTooltip = React.memo(({ active, payload }) => {
	if (!active || !payload || !payload.length) return null;

	return (
		<div 
			style={{ 
				backgroundColor: 'rgba(255, 255, 255, 0.9)',
				padding: '5px 10px',
				border: '1px solid #ccc',
				borderRadius: '4px',
				color: '#000'
			}}
		>
			<p style={{ margin: 0 }}>
				<strong>{payload[0].payload.name}</strong>: {payload[0].value}
			</p>
		</div>
	);
});

// 파이 라벨 컴포넌트
const PieLabel = React.memo(({ cx, cy, label, fontSize, fill }) => (
	<text
		className='svg-text'
		x={cx}
		y={cy}
		fill={fill}
		textAnchor="middle"
		dominantBaseline="central"
		fontSize={fontSize}
	>
		{label}
	</text>
));

const dataFormat = [
	{label: '미처리', value: 72},
	{label: '진행중', value: 43},
	{label: '완료', value: 126},
]


// 메인 파이차트 컴포넌트
export function PieChart({ data, card, isSelected, apiObj, setOption4Content }) {
	const { themeStyle } = useContext(MainContext);
	const colorList = themeStyle?.colorList;
	const pieRef = useRef();
	const { setDerivedInfo } = useDerived();
	const [location, setLocation] = config(`${card.cardType}-location`, {
		xPos: 0, yPos: 0, fontSize: 0, radiusSize: 0
	});

	// 파생 이벤트
	const deriveEvents = useMemo(() => ({
		pie: (apiObj?.derive || []).filter(d => d.event_type === "pie_click"),
		legend: (apiObj?.derive || []).filter(d => d.event_type === "legend_click")
	}), [apiObj?.derive]);

	// 데이터 처리
	const { chartData, label } = useMemo(() => {
		if (!data) return { chartData: [], label: '' };
		const realData = Array.isArray(data) ? data : [data];
		if (!realData.length) return { chartData: [], label: '' };

		let status = '';

		const processedData = realData.map(item => {
			// label을 제외한 첫 번째 숫자 값을 찾음
			const numericValue = Object.entries(item)
				.find(([key, val]) => key !== 'label' && !isNaN(Number(val)));


			if(item.status && typeof item.status === 'string') {
				status = item.status;
			}
			
			return {
				name: item.label,
				value: numericValue ? Number(numericValue[1]) : 0
			};
		});

		// 모든 value 값의 합계 계산
		const total = processedData.reduce((sum, item) => sum + item.value, 0);

		let label = status ? `${status}` : `총 ${total}건`;

		return {
			chartData: processedData,
			label: label // 라벨 형식 변경
		};
	}, [data]);

	// 파이 크기 계산
	const pieSize = useMemo(() => {
		const min = Math.min(pieRef.current?.offsetWidth || 0, pieRef.current?.offsetHeight || 0);
		return card.options?.seeChartLegend ? min - 20 : min;
	}, [card.options?.seeChartLegend, pieRef.current?.offsetWidth, pieRef.current?.offsetHeight]);

	// 스타일 계산
	const styles = useMemo(() => ({
		position: {
			x: `${50 + (location.xPos || 0)}%`,
			y: `${55 + (location.yPos || 0)}%`
		},
		size: {
			font: (pieSize * 0.15) + (location.fontSize || 0),
			radius: location.radiusSize || 0
		}
	}), [location, pieSize]);

	// 클릭 핸들러
	const handlePieClick = useCallback((data, index) => {
		console.log('data', data, deriveEvents);
		const deriveObj = deriveEvents.pie.find(
			d => d.colName === data.name || d.colIdx === index
		);
		if (deriveObj) {
			setDerivedInfo({
				...deriveObj,
				data: data,
				value: data.value,
				colName: data.name,
				colIdx: index
			});
		}
	}, [deriveEvents.pie, setDerivedInfo]);

	const nonZeroCount = useMemo(() => 
		chartData.filter(item => item.value !== 0).length,
	[chartData]);

	return (
		<PieContainer>
			<_pie_gauge_ fontSize={styles.size.font} ref={pieRef}>
				<KeyControls isSelected={isSelected} location={location} setLocation={setLocation} />
				<ResponsiveContainer>
				<PieChartComponent>
					<Tooltip content={<CustomTooltip />} />
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						cx={styles.position.x} cy={styles.position.y}
						innerRadius={pieSize * 0.37 + styles.size.radius}
						outerRadius={pieSize * 0.45 + styles.size.radius}
						startAngle={0}endAngle={360}
						paddingAngle={nonZeroCount >= 2 ? 6 : 0}
						cornerRadius={10}
						fill="#8884d8"
						stroke="none"
						isAnimationActive={false}
						labelLine={false}
						label={({ cx, cy }) => (
							<PieLabel 
								cx={cx}
								cy={cy}
								label={label}
								fontSize={styles.size.font}
								fill={themeStyle?.titleText || "#000"}
							/>
						)}
						onClick={(data, index) => handlePieClick(data, index)}
						cursor={deriveEvents.pie.length ? 'pointer' : 'default'}
					>
						{chartData.map((entry, index) => (
							<Cell 
								key={`cell-${index}`}
								fill={colorList[index % colorList.length]}
							/>
						))}
					</Pie>
					
					{card.options?.seeChartLegend && (
						<Legend
							align="right"
							type="pie"
							content={props => (
								<PieLegend
									{...props}
									deriveFromLegendList={deriveEvents.legend}
									setDerivedInfo={setDerivedInfo}
								/>
							)}
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
		</PieContainer>
	);
}

// 파이차트 컨테이너 (Map과 동일한 구조)
const PieContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const _pie_gauge_ = styled.div`
	width: 100%;
	height: 100%;
	display: flex;

	.svg-text {
		font-family: Arial, sans-serif;
		font-size: ${p => p.fontSize + "px"};
		font-weight: bold;
	}
`;

const _legend_ = styled.ul`
	.legend-list {
		display: flex;
		justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
		padding-left: 10%;
		margin-top: 10px;
		flex-wrap: wrap;
		text-overflow: ellipsis;
		text-wrap: nowrap;

		li {
			margin-right: 10px;
			font-size: 12px;
			display: flex;
			.legend-label { display: flex; align-items: center; }
			.circle { font-size: 20px; line-height: 20px; }
		}
		&.pie {
			flex-wrap: nowrap;
		}
	}
`;

// 파이차트용 셀렉트 스타일 컴포넌트들 제거됨 (chart-select.jsx로 이동)
