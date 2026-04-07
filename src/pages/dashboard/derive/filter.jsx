import React, { useEffect, useState, useRef } from 'react';

import {
	Tag,
	TagLabel,
	TagCloseButton,
	HStack,
	Button,
	ButtonGroup,
} from '@chakra-ui/react'
import { Svg4Color } from '../../../component/svg-color';
import "../../../styles/stage/stage-card.scss";
import plusIcon from '../../../assets/icons/plus-icon.png';


export const FilterTags = ({filter, onFilterChange, filterOperator, handleConditionChange}) => {
	const [filterItems, setFilterItems] = useState([]);
	const [addMode, setMode] = useState(false);
	const inputRef = useRef(null);
	const iconHex = "#666666";

	useEffect(() => {
		if(filter) setFilterItems(filter);
	}, [filter]);

	useEffect(() => {
		// addMode가 true가 되면 input에 자동 포커스
		if (addMode && inputRef.current) {
			inputRef.current.focus();
		}
	}, [addMode]);

	const appendFilterHandler = (e) => {
		const value = e.target.value.trim();
		if (value) {
			const newFilterItems = [...filterItems, value];
			setFilterItems(newFilterItems);
			onFilterChange(newFilterItems);
		}
		setMode(false);
		e.target.value = '';
	};

	const removeFilterHandler = (itemToRemove) => {
		const newFilterItems = filterItems.filter(item => item !== itemToRemove);
		setFilterItems(newFilterItems);
		onFilterChange(newFilterItems);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			appendFilterHandler(e);
		} else if (e.key === 'Escape') {
			setMode(false);
			e.target.value = '';
		}
	};

	return (
		<div className='card-filter'>
			<HStack spacing={4} alignItems="center">
				{!addMode && 
				<button className='filter-add-button' onClick={()=>setMode(true)}>
					<Svg4Color icon={plusIcon} hex={iconHex} />
				</button>
				}

				{addMode && 
				<Tag size={"md"} key={"add"} variant='subtle' colorScheme='gray'>
					<input 
						type="text" 
						className='filter-input' 
						style={{width:"80px"}} 
						onBlur={appendFilterHandler}
						onKeyDown={handleKeyPress}
						ref={inputRef}
					/>
					<TagCloseButton onClick={()=>setMode(false)}/>
				</Tag>
				}
				
				{filterItems && filterItems.map((item, idx) => (
					<Tag size={"md"} key={idx} variant='subtle' colorScheme='gray'>
						<TagLabel>{item}</TagLabel>
						<TagCloseButton onClick={()=>{removeFilterHandler(item)}}/>
					</Tag>
				))}

				{filterItems && filterItems.length > 1 && (
					<Button
						size='xs'
						variant='outline'
						colorScheme='blue'
						onClick={() => handleConditionChange(filterOperator === 'AND' ? 'OR' : 'AND')}
					>
						{filterOperator}
					</Button>
				)}
			</HStack>
		</div>
	)
}