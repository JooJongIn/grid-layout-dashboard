import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

// ChartSelect 컴포넌트 (PieChart, Gauge 등에서 공통 사용)
export const ChartSelect = ({ options, apiObj, setOption4Content }) => {
	const [selectedValues, setSelectedValues] = useState({});
	const [openSelects, setOpenSelects] = useState({});
	const [selectOptions, setSelectOptions] = useState([]);

	const paramsObj = useMemo(() => {
		return options?.params || {};
	}, [options?.params]);

	useEffect(() => {
		if (!options) return;
		// options가 배열인 경우와 객체인 경우 모두 대응
		if (Array.isArray(options)) {
			setSelectOptions(options);
		}
	}, [options]);

	useEffect(() => {
		const paramObj = apiObj?.params;
		if (!(paramObj && typeof paramObj === 'object')) return;
		
		let newArray = [];
		for (const key in paramObj) {
			const val = paramObj[key];
			if (val && typeof val === 'object') {
				let list = Object.keys(val).map(k => ({ text: k, val: val[k] }));
				if (list.length !== 0) newArray.push({ label: key, list: list });
			}
		}
		// 기존 options와 apiObj.params를 합치거나 우선순위 결정 (여기서는 apiObj.params 우선)
		if (newArray.length > 0) {
			setSelectOptions(newArray);
		}
	}, [apiObj]);

	useEffect(() => {
		setSelectedValues(paramsObj);
	}, [paramsObj]);

	const handleSelectChange = (selectKey, value) => {
		setSelectedValues(prev => ({
			...prev,
			[selectKey]: value
		}));
		setOpenSelects(prev => ({
			...prev,
			[selectKey]: false
		}));
		setCardParamHandler(selectKey, value);
	};

	const toggleSelect = (selectKey) => {
		setOpenSelects(prev => ({
			...prev,
			[selectKey]: !prev[selectKey]
		}));
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest('.chart-select-container')) {
				setOpenSelects({});
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const setCardParamHandler = (name, value) => {
		let newParam = { ...paramsObj, [name]: value };
		setOption4Content("params", newParam);
	};

	return (
		<>
			{selectOptions.length > 0 && (
				<SelectWrapper>
					{selectOptions.map((selectGroup) => {
						const selectKey = selectGroup.label;
						const isOpen = openSelects[selectKey] || false;
						const selectedValue = selectedValues[selectKey] || '';
						const selectedOption = selectGroup.list.find(opt => opt.val === selectedValue);

						return (
							<SelectContainer key={selectKey} className="chart-select-container">
								<SelectButton onClick={() => toggleSelect(selectKey)} $isOpen={isOpen}>
									<SelectText>
										{selectedOption ? selectedOption.text : `${selectGroup.label} 선택`}
									</SelectText>
									<SelectArrow $isOpen={isOpen}>▼</SelectArrow>
								</SelectButton>
								{isOpen && (
									<SelectDropdown>
										{selectGroup.list.map((option) => (
											<SelectOption
												key={option.val}
												onClick={() => handleSelectChange(selectKey, option.val)}
												$isSelected={selectedValue === option.val}
											>
												{option.text}
											</SelectOption>
										))}
									</SelectDropdown>
								)}
							</SelectContainer>
						);
					})}
				</SelectWrapper>
			)}
		</>
	);
};

const SelectWrapper = styled.div`
	z-index: 1000;
	display: flex;
	flex-direction: row;
	gap: 8px;
	width: auto;
`;

const SelectContainer = styled.div`
	position: relative;
	min-width: 150px;
`;

const SelectButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	background: #ffffff;
	border: 1px solid ${props => props.$isOpen ? '#4A90E2' : '#dcdcdc'};
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	color: #333;
	transition: all 0.2s ease;
	min-height: 36px;

	&:hover {
		border-color: #4A90E2;
		box-shadow: 0 2px 4px rgba(74, 144, 226, 0.1);
	}
`;

const SelectText = styled.span`
	flex: 1;
	text-align: left;
	color: #333;
`;

const SelectArrow = styled.span`
	font-size: 12px;
	color: #666;
	transition: transform 0.2s ease;
	transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SelectDropdown = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: #ffffff;
	border: 1px solid #dcdcdc;
	border-top: none;
	border-radius: 0 0 6px 6px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	max-height: 200px;
	overflow-y: auto;
	z-index: 1001;
`;

const SelectOption = styled.div`
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;
	color: #333;
	background: ${props => props.$isSelected ? '#f0f8ff' : '#ffffff'};
	border-bottom: 1px solid #f5f5f5;

	&:hover {
		background: #f0f8ff;
		color: #4A90E2;
	}

	&:last-child {
		border-bottom: none;
	}
`;
