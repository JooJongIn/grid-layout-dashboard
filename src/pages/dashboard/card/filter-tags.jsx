import React, { cloneElement, useEffect, useState, useRef, useCallback, useMemo, useContext } from 'react';
import {_card_} from "../../../styles/stage-style";


import {
	Tag,
	TagLabel,
	TagLeftIcon,
	TagRightIcon,
  	TagCloseButton,
	HStack,
	ChakraProvider,
	Button
} from '@chakra-ui/react'

import "../../../styles/stage/stage-card.scss";
import { Svg4Color } from '../../../component/svg-color';

import plusIcon from '../../../assets/icons/plus-icon.png';

export const FilterTags = ({options, setOptions, theme, color}) => {
	const [filterItems, setFilterItems] = useState( [] );
	const [addMode, setMode] = useState(false);
	const [filterOperator, setFilterOperator] = useState('AND');
	const inputRef = useRef();

	useEffect(()=>{
		if(options?.filter)setFilterItems(options.filter);
		if(options?.filterOperator)setFilterOperator(options.filterOperator);
	},[options?.filter, options?.filterOperator])

	useEffect(()=>{
		if(addMode) inputRef.current.focus();
	},[addMode])
	//
	const handleConditionChange = (newOperator) => {
		setFilterOperator(newOperator);

		setOptions("filterOperator", newOperator);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			appendFilterHandler(e);
		} else if (e.key === 'Escape') {
			setMode(false);
			e.target.value = '';
		}
	};

	const appendFilterHandler = (e) => {
        const newVal = e.target.value?.trim();
        if(!newVal) return;

		if(filterItems.includes(newVal)) {
			alert("중복된 태그입니다");
			return;
		}

		setOptions("filter", [...filterItems, newVal]);
		setMode(false);
		e.target.value = "";
	}

	const removeFilterHandler = (removeItem) => {
		setOptions("filter", filterItems.filter(v => v !== removeItem));
	}
    const iconHex = color || (theme === "dark" ? "#ffffff" : "#000000");

	return (
		<>
		<div className='card-filter'>
			<HStack spacing={4}>
				{!addMode && 
				<button className='filter-add-button' onClick={()=>setMode(true)}>
					<Svg4Color icon={plusIcon} hex={iconHex} />
				</button>
				}

				{addMode && 
				<Tag size={"md"} key={"add"} variant='subtle' colorScheme='gray'>
					<input type="text" className='filter-input' style={{width:"80px"}} 
                    onBlur={appendFilterHandler} onKeyDown={handleKeyPress} ref={inputRef} />
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
		</>
	)
}