import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components'

import {useMainSetting} from '../../../hook/useMainSetting'
import {useStage} from '../../../hook/useStage';
import {useDerived} from '../../../hook/useDerived';

import DataGrid, { Column, SearchPanel, FilterRow, HeaderFilter, GroupPanel, Scrolling, Paging, Pager } from 'devextreme-react/data-grid';

import { border, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useThemeMode } from '../../../provider/MainProvider';	

import analyze from '../../../assets/svg/dashboard-icons/ix_analyze.svg';
import alert from '../../../assets/svg/dashboard-icons/alert.svg';

import './derive-data-grid.scss';
import { Svg4Color } from '../../../component/svg-color';

export function List({card,data, apiObj}) {
	const { themeStyle, theme, mode } = useThemeMode();
	const {apiList, isPreview} = useMainSetting();


	const filter = card?.options?.filter;
	const filterOperator = card?.options?.filterOperator || "AND";
	const { columns, filteredData } = getCol(data, filter && filter.length > 0 ? (item) => {
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


	return (
		<>
		<DataGrid
			className={`custom-data-grid derive-table light`}
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
			
			
		>
	
		</DataGrid>
		</>
	)
}


const getCol = (list, filterFn) => {
	if(!(Array.isArray(list) && list.length > 0))return { columns: [], filteredData: [] }; 

	const filteredList = filterFn ? list.filter(filterFn) : list;
	// 필터링된 리스트가 비어있을 경우 빈 배열 반환
	if (filteredList.length === 0) { return { columns: [], filteredData: [] };}

	return { columns: Object.keys(filteredList[0]), filteredData: filteredList }; // 컬럼과 필터된 데이터 반환
}

const listRefTable = {	
	_link_: true
}
