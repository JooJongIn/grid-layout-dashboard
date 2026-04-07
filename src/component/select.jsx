import { useState, useEffect, cloneElement, useRef, useCallback } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import styled from 'styled-components'
// import { Select, CloseButton } from '@chakra-ui/react'
import * as _ from "lodash";
import {IconButton} from './common'
import copyIcon from "../assets/images/ico_copy-black.svg";
import closeIcon from '../assets/icons/close.png'
import editIcon from "../assets/svg/dashboard-icons/tdesign_edit.svg";
// import plusImg from "../assets/svg/icons2/zondicons_add-outline_black.svg";
import plusImg from "../assets/svg/icons2/simple_plus.svg";

import btmArrowIcon from '../assets/svg/icons2/bottom_arrow.svg'
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	CloseButton
} from '@chakra-ui/react'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd'
import update from 'react-addons-update'

import { onPost } from '../pages/utils';

import { dashobardDBUrl } from '../ref/url';
import { useMainSetting } from '../hook/useMainSetting';
import { usePages } from '../hook/useMainSetting';

import arrowIcon from '../assets/images/select_arrow.svg'



export function Select4Crud({name, options, onChange, onAdd, onDel, onEdit, list}) {
	const [isOpen, setIsOpen] = useState(false);
	const [current, setCurrent] = useState( false );
	const [currentText, setCurrentText] = useState(false);

	const [optList, setOptList] = useState([]);

	const wrapperRef = useRef(null);

	// 외부 클릭 감지를 위한 useEffect
	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [wrapperRef]);

	useEffect(() => {
		if(!(current && list)) return setCurrentText(false);

		const item = list.find(item => item.value === current + "");

		if(!item) return setCurrentText(false);
		setCurrentText(item.title);
	}, [current]);

	useEffect(() => {
		if(!(options && options[name])) return setCurrent(false);
		setCurrent(options[name]);
	},[options, options[name]])


	useEffect(() => {		
		if(list){
			setOptList(list);
			if(current && !list.find(item => item.value === current + "")){setCurrent(false);}
		}
		else setOptList([]);
	}, [list]);



	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (value) => {
		setCurrent(value);
		onChange(name, value);
		setIsOpen(false);
	};

	const handleAdd = () => {
		if(onAdd) onAdd({type: "add"});
		setIsOpen(false);
	};

	const handleEdit = (value) => {
		if(onEdit) onEdit({ ...value, type: "edit" });
		setIsOpen(false);
	}

	const handleDel = (value) => {
		if(onDel) onDel({type: "del", id:value});
		setIsOpen(false);
	}
	
	return (
		<_select_crud_ ref={wrapperRef}>
			<div onClick={handleOpen}> 
				{currentText || "선택해주세요"} 
				<img className='arrow-icon' src={arrowIcon} alt="arrow" />
			</div>

			{isOpen && <>
				<div className="popover">
					<div className="popover-content">
						<ul>
							{onAdd && <AddItem onClick={handleAdd} />}

							{optList.map((option, index) => (
								<ListItem key={index} option={option} 
								isDel={onDel ? true : false} isEdit={onEdit ? true : false}
								onClick={handleSelect} handleDel={handleDel} handleEdit={handleEdit}/>
							))}
							{optList.length === 0 && <li>옵션이 없습니다.</li>}
						</ul>
					</div>
				</div>
			</>}
		</_select_crud_>
	)
}

const ListItem = ({option, onClick, handleDel, handleEdit, isDel, isEdit}) => {

	const handlerDel = (e) => {
		e.stopPropagation();
		handleDel(option.value);
	}

	const handlerEdit = (e) => {
		e.stopPropagation();
		handleEdit(option);
	}


	return (<li onClick={() => onClick(option.value)}>
		{option.title} 
		<div className='btns'>
			{isEdit && <div className='edit-btn' onClick={handlerEdit}>
				<img src={editIcon} alt="수정" />
			</div>}
			{isDel && <div className='del-btn' onClick={handlerDel}>
				<img src={closeIcon} alt="삭제" />
			</div>}
		</div>
	</li>)
}

const AddItem = ({onClick}) => {

	return (<li onClick={onClick} className='add-item'>
		<img src={plusImg} alt="추가" /> 추가
	</li>)
}

export const _select_crud_ = styled.div`
	position: relative;
	flex: 1;
	/* width: 100%; */
	min-width: 120px;
	cursor: pointer;
	user-select: none;

	padding: 0 10px;

	.arrow-icon {
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		margin-left: 5px;
	}
	
	> div:first-child {
		padding: 4px 8px;
		/* border: 1px solid #ddd; */
		/* border-radius: 4px; */
		background: #fff;
		font-size: 14px;
		color: #333;
		
		&:hover {
			border-color: #999;
		}
	}

	.popover {
		position: absolute;
		top: 100%;
		left: 0;
		width: calc(100% - 20px);
		margin: 0 10px;
		margin-top: 4px;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.15);
		z-index: 1000;
	}

	.popover-content {
		max-height: 250px;
		overflow-y: auto;
		/* overflow-y: scroll; */

		::-webkit-scrollbar-thumb {
			opacity: 0; display: none;
			
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				padding: 8px 12px;
				font-size: 14px;
				color: #333;
				cursor: pointer;

				display: flex;
				align-items: center;
				justify-content: space-between;

				.btns {
					display: flex;
				}
			
				.del-btn, .edit-btn {
					opacity: 0;
					width: 20px; height: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					
					


					&:hover {
						opacity: 1 !important;
						/* background: #a2a2a2; */
					}
				}

				.edit-btn {
					img {
						width: 12px;
					}
				}


				&:hover {
					background: #f5f5f5;

					.del-btn, .edit-btn {
						opacity: 0.6;
					}
				}
			}

			.add-item {
				display: flex;
				align-items: center;
				justify-content: start;

				border: 1px solid #ddd;

				img {
					margin-right: 2px;
					width: 20px;
				}
			}
		}
	}
`