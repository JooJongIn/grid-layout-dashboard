import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components'

import {useMainSetting} from '../hook/useMainSetting'
import {useStage} from '../hook/useStage';
import {useDerived} from '../hook/useDerived';

import DataGrid, { Column, SearchPanel, FilterRow, HeaderFilter, GroupPanel, Scrolling, Paging, Pager } from 'devextreme-react/data-grid';

import { border, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useThemeMode } from '../provider/MainProvider';

import './style/data-grid.scss';
import { Svg4Color } from './svg-color';
import { setShared } from '../store';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export function List({data, card, isSwiper, cardTxtColor, apiObj}) {
	const { themeStyle, theme, mode } = useThemeMode();
	const setAlarmData = setShared("alarm-data");

	// 알람 체크
	useEffect(() => {
		if (!Array.isArray(data) || !card.options?.urlId) return;
		const alarms = data.filter(item => item._alarm_ === true);
		if (alarms.length > 0) {
			setAlarmData({ apiId: card.options.urlId, alarms, timestamp: Date.now() });
		}
	}, [data]);

	const {apiList, isPreview} = useMainSetting();
	const { derivedInfo, setDerivedInfo } = useDerived();


	const filter = card?.options?.filter;
	const filterOperator = card?.options?.filterOperator || "AND";
	const derive = apiObj?.derive || [];

	const deriveFromCellList = derive.filter(d => d.event_type === "cell_click");
	const deriveFromHeaderList = derive.filter(d => d.event_type === "column_click");

	const { columns, filteredData, linkMapping } = getCol(data, filter && filter.length > 0 ? (item) => {
		if (filterOperator === "OR") {
			return filter.some(fi => 
				Object.values(item).some(value => 
					String(value).toLowerCase().includes(fi.toLowerCase())
				)
			);
		} else {
			return filter.every(fi => 
				Object.values(item).some(value => 
					String(value).toLowerCase().includes(fi.toLowerCase())
				)
			);
		}
	} : false);

	let themeMode = theme;
	if(cardTxtColor)cardTxtColor === "white" ? themeMode = "dark" : themeMode = "light";

	const handleLink = (link) => {
		if(!link || !isPreview)return;
		window.open(link, '_blank');
	}


	const handleHeaderCellBtn = (e, col) => {
		e.stopPropagation();
		const deriveObj = deriveFromHeaderList.find(d => d.colName === col || d.colIdx === col);
		if(!deriveObj)return;
		// appendCard4Derive(deriveObj);
		const filterOperator = filter?.filterOperator || "AND";
		setDerivedInfo({...deriveObj, colName: col, filter: filter, filterOperator: filterOperator});
	}

	const handleCellClick = (e) => {
		if(e.rowIndex === -1)return;
		
		// cell 클릭 이벤트
		const data = e.data;  // 해당 행의 전체 데이터
		const columnIndex = e.columnIndex;  // 클릭된 컬럼의 인덱스

		const column = e.column.name;  // 클릭된 컬럼의 정보
		const value = e.value;  // 클릭된 셀의 값
		const values = e.values;  // 클릭된 셀의 값

		
		const deriveObj = deriveFromCellList.find(d => d.colName === column || ( d.colIdx !== '' &&  +d.colIdx === columnIndex));

		if(!deriveObj || !value)return;
		// appendCard4Derive({...deriveObj, data, value});
		setDerivedInfo({...deriveObj, data, value, colName: column, colIdx: columnIndex, values, filter: filter, filterOperator: filterOperator});
	}

	return (
		<>
		<DataGrid
			className={`custom-data-grid ${themeMode}`}
			dataSource={filteredData || []}
			remoteOperations={true}
			allowSorting={true} 
			columnAutoWidth={true}
			
			showBorders={false}    // 테두리 제거
			showColumnLines={false}  // 세로 선 제거
			showRowLines={true}     // 가로 선 제거
			
			// 페이징 관련 설정 제거
			paging={{
				enabled: false      // 페이징 비활성화
			}}
			
			// 또는
			// paging={false}         // 페이징 완전 제거
			
			// 스크롤 모드 설정 (선택사항)
			// scrolling={{ mode: 'virtual' }}  // 가상 스크롤링 사용
			
			// searchPanel={{ visible: true, width: 240, placeholder: '검색...' }}        
			
			onRowClick={(e) => {
				// 링크 처리
				const rowData = e.data;
				if(rowData._link_) {
					handleLink(rowData._link_);
					return;
				}
			}}
			onCellClick={handleCellClick}
		>
		
		{columns.map((col, idx) => (
			<Column key={idx} dataField={col} caption={col} 
			headerCellComponent={() => 
			<CustomHeaderCell col={col} colIdx={idx} derive={deriveFromHeaderList} handleHeaderCellBtn={handleHeaderCellBtn} />
			}
			cellComponent={(cellData) => (
				<ChartCell cellData={cellData} derive={deriveFromCellList} isDerive={deriveFromCellList.find(d => d.colName === col || +d.colIdx === idx)} colName={col} isPreview={isPreview}/>
			)}
			/>
		))}

		{/* 필요한 그리드 기능들 */}
		{/* <SearchPanel visible={true} width={240} placeholder="검색..."  className="drag-cancel" /> */}
		{/* <FilterRow visible={true} /> */}


		{/* <HeaderFilter visible={true} />
		<GroupPanel visible={true} />
		<Scrolling mode="virtual" />
		<Paging defaultPageSize={10} />
		<Pager
			showPageSizeSelector={true}
			allowedPageSizes={[5, 10, 20]}
			showInfo={true}
		/> */}
		</DataGrid>
		</>
	)
}

const CustomHeaderCell = ({col, colIdx, derive, handleHeaderCellBtn}) => {
	let isHaveEvent = derive.find(d => d.colName === col || d.colIdx === colIdx);
	let event = isHaveEvent ? (e) => handleHeaderCellBtn(e, col) : null;

	return(
		<>
			<div className={'header-cell ' + (isHaveEvent ? " underline drag-cancel": "")}>
				<div className='header-cell-text' onClick={event}>
					{col}
				</div>
			</div>
			{/* {false &&
				// derive.find(d => d.colName === col) && 
			<button className='header-cell-btn' >
				<Svg4Color svg={alert} color={themeMode === "dark" ? "white" : "black"} />
				
			</button>} */}
			</>
	)
}


const ChartCell = ({cellData, derive, isDerive, colName, isPreview}) => {
	const textRef = useRef(null);
	const [isTextTruncated, setIsTextTruncated] = useState(false);
  
	// 셀 데이터 값 추출
	const value = cellData.data.value;
	const displayValue = value;
	
	// 행 데이터에서 링크 확인 (프리뷰 모드일 때만)
	const rowData = cellData.data.data;
	const hasLink = isPreview && rowData && rowData._link_;

	useEffect(() => {
		// 텍스트가 실제로 잘렸는지 확인
		if (textRef.current && typeof value === 'string') {
			const element = textRef.current;
			const isOverflowing = element.scrollWidth > element.clientWidth;
			setIsTextTruncated(isOverflowing);
		}
	}, [value]);

	const renderCellValue = (val) => {
		if (val === undefined || val === null) return val;
		const normalized = String(val).toLowerCase();

		if (normalized === 'warning') {
			return <span className="cell-warning">{val}</span>;
		}
		if (normalized === 'critical') {
			return <span className="cell-critical">{val}</span>;
		}
		if (normalized === 'up') {
			return <div className="cell-icon-up"><ArrowUpwardIcon fontSize="small" /></div>;
		}
		if (normalized === 'down') {
			return <div className="cell-icon-down"><ArrowDownwardIcon fontSize="small" /></div>;
		}

		return val;
	};

	return(
		<div 
			ref={textRef}
			className={"chart-cell " + (isDerive ? " have-event  drag-cancel" : "")} 
			data-has-link={hasLink ? "true" : undefined}
			title={isTextTruncated && typeof value === 'string' ? value : ''}
			style={{
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				maxWidth: '400px',  // 셀의 최대 너비 제한
			}}
		>
			{renderCellValue(displayValue)}
		</div>
	)
}


const testHtml = () => {
	return(
		<div className="custom-data-grid">
		</div>
	)
}

const styleFunc = (custom, init) => {
	let styleObj = {...init};
	if(custom)styleObj ={...styleObj, ...custom};

	let result = '';

	const classNames =  Object.keys(styleObj);

	classNames.map(name => {
		const style = styleObj[name];
		result += "." + name + "{";
		result += style;
		result += "\n}\n";
	})

	return result
}

const getCol = (list, filterFn) => {
	if(!(Array.isArray(list) && list.length > 0)) return { columns: [], filteredData: [], linkMapping: [] }; 

	const filteredList = filterFn ? list.filter(item => {
		return filterFn(item);
	}) : list;

	if (filteredList.length === 0)return { columns: [], filteredData: [], linkMapping: [] };

	// _link_ 컬럼을 표시 컬럼에서 제외
	const allColumns = Object.keys(filteredList[0]);
	const displayColumns = allColumns.filter(col => !listRefTable[col]);
	
	// 각 행의 링크 정보 매핑 생성
	const linkMapping = filteredList.map((item, idx) => ({
		rowIndex: idx,
		link: item._link_ || null
	}));

	return { 
		columns: displayColumns, 
		filteredData: filteredList,
		linkMapping: linkMapping
	};
}

const SkeletonType = ({item, key}) => {
	const style = {
		width: "10%",
	}
	const rowStyle = {
		height: "30px",
		border: "0",
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


const listRefTable = {	
	_link_: true,
	_alarm_: true
}

const TextType = ({item, idx, columns, columnsStyle, themeStyle, handleLink}) => {
	let link = false;
	if(!item)return(<tr  />);

	const cells = (columns || []).map((col, colIdx) => {
		const cellText = item[col];
		let cellStyle = {};

		const colSty = columnsStyle[colIdx];
		cellStyle = {
			...cellStyle,
			...colSty
		}

		if(listRefTable[col]){
			if(col === "_link_") link = cellText;
			return <></>;
		}


		return(<td className='list-cell' key={colIdx} style={cellStyle}>{cellText}</td>)
	})

	


	return(<tr key={idx} onClick={link ? ()=>handleLink(link) : null} className={(link ? "link-row" : "") + ' list-row'}>{cells}</tr>)
}
