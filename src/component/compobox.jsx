import { useState, useEffect, cloneElement, useRef, useCallback } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import styled from 'styled-components'
// import { Select, CloseButton } from '@chakra-ui/react'
import * as _ from "lodash";
import {IconButton} from './common'

import closeIcon from "../assets/svg/icons2/close_bold.svg";
import rollBackIcon from "../assets/svg/icons2/roll_back.svg";

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


export function Compobox({list, currentId, onSelect,  idKey, titleKey, children, onOrder}) {
	// const current = list[currentId]
	// const listArray = Object.values(list);

	const [isOpen, setOpen] = useState( false );

	const [listArray, setArray] = useState([]);
	const [isDrop, setIsDrop] = useState(false);
	const [current, setCurrent] = useState( false );

	const scrollRef = useRef();

	useEffect(() => {
		if(!isDrop)return;
		onOrder(listArray);
		setIsDrop(false);
	},[isDrop])


	useEffect(() => {
		if(!list)return;
		let newList = Object.values(list);
		newList = _.sortBy(newList, "order");
		setArray(newList);
	},[list])

	useEffect(() => {},[listArray])

	useEffect(() => {
		if(!list || !currentId)return;
		setCurrent(list[currentId]);
	},[list, currentId])

	const moveCard = useCallback((dragIndex, hoverIndex) => {
		setArray((prevCards) =>
		  update(prevCards, {
			$splice: [
			  [dragIndex, 1],
			  [hoverIndex, 0, prevCards[dragIndex]],
			],
		  }),
		)
	}, [])


	const currentText = current ? current[titleKey] : "선택해주세요"
	const handlerOrder = (dId, chIdx, item) => {
		setIsDrop(true);
	}


	const handlerClose = (e) => {
		setOpen(false);
	}


	const renderRow = useCallback((item, idx) => {
		const id = item[idKey];
		const text = item[titleKey];

		const selectHandler = (e) => {
			onSelect(id)
		}

		return (
			<ListItem onClick={selectHandler} id={id} key={id}  index={idx} moveCard={moveCard} doOrder={handlerOrder} >
				{ cloneElement(children, {id:id, text:text, item:item, close: handlerClose }) }
			</ListItem>
		)
	  }, [])

	// const handler

	
  return (
		<Menu >
			<MenuButton as={Button} 
			size='sm'
			_hover={{ bg: 'gray.400' }}
			_expanded={{ bg: 'gray.400' }}
			colorScheme='gray'
			onClick={()=>{setOpen(true)}}
			rightIcon={<IconButton onClick={()=>{}} Icon={arrowIcon}/>} 
			>

				<_compobox_btn_ >
					{currentText} 
				</_compobox_btn_>
			</MenuButton>
			<DndProvider backend={HTML5Backend}>
			<>
			{isOpen &&<MenuList>
			 	<_compobox_list_ >
					<div className='menu-list' ref={scrollRef} >
						{listArray.map((item, idx) => renderRow(item, idx))}
						<RestorList scrollRef={scrollRef} />
					</div>
				</_compobox_list_>
			</MenuList>}
			</>
			</DndProvider>
		</Menu>
		
  )
}




const ListItem = ({id, index, moveCard, onClick, children, doOrder}) => {
	const ref = useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return { handlerId: monitor.getHandlerId()}
        },

        hover(item, monitor) {
            if (!ref.current)return;
            
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex)return;
            
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

            moveCard(dragIndex, hoverIndex)
            item.index = hoverIndex
        },
    })

	const [{ isDragging }, drag, preview] = useDrag({
        type: 'card',
        item: () => { return { id, index } },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
		end: (item, monitor) => {
			const { id: droppedId, originalIndex, index } = item
			const didDrop = monitor.didDrop();
			if (didDrop) {
				doOrder(droppedId, index);
			  	// moveCard(droppedId, originalIndex)
			}
			if(!didDrop){
				// moveCard(droppedId, originalIndex)
			}
		},
    })
     
    const opacity = isDragging ? 0.3 : 1
    drag(drop(ref))

	return(
		<MenuItem onClick={onClick} >
			<div ref={preview}  style={{opacity: opacity, width: "100%"}} >
			{cloneElement(children,{handlerId:handlerId, dragRef:ref}) }
			</div>
		</MenuItem>
	)
}


const RestorList = ({scrollRef}) => {
	const { userInfo } = useMainSetting();
	const { getLayouts } = usePages();

	const [isOpen, setOpen] = useState(false);
	const [delList, setDelList] = useState([]);

	useEffect(() => {
		setOpen(false);
	},[])

	useEffect(() => {
		if(!isOpen)return setDelList([]);
		getDelList();
	},[isOpen])

	const openHandler = () => {
		let scrollHeight = scrollRef.current.scrollHeight;
		setOpen(true);
		setTimeout(() => {
			scrollRef.current.scrollTop = scrollHeight + 100;
		}, 500)
	}

	const getDelList = async () => {
		const result = await onPost(`${dashobardDBUrl}/snapshot_list_read`, {onlyDel : true, level: userInfo.roleId});

		if(result.ok === true)setDelList(result.snapshot);
	}

	const handlerRestore = async (itemId) => {
		const result = await onPost(`${dashobardDBUrl}/snapshot_restore`, {snapshot_id: itemId, level: userInfo.roleId});
		if(result.ok === true){
			getLayouts(itemId);
			refresh();
			getDelList();
		}
	}


	return (
		<>
		{!isOpen && <div className='menu-restore-button' onClick={openHandler}> <img src={rollBackIcon} alt="" /> </div>}
		{isOpen && <>

			<div className='divider' />
			<div className='menu-restore-button' onClick={()=>{setOpen(false)}}> <img src={closeIcon} alt="" /> </div>
			{delList.map((item, idx) => <MenuRestoreListItem item={item} key={idx} 
				handlerRestore={handlerRestore} refresh={getDelList} />)}
		
		</>}
		</>
	)
}



const MenuRestoreListItem = ({item, handlerRestore, refresh}) => {
	const [option, setOption] = useState({});

	useEffect(() => {
		if(!(item && item.option))return setOption({});
		let optionObj = JSON.parse(item.option);
		if(typeof optionObj === 'object')setOption(optionObj);
		else setOption({});
	},[item])

	const handlerClick = (e) => {
		handlerRestore(item.id);
	}

	return (
	<div className='menu-restore-list-item' onClick={handlerClick} > 
		<div className='item-title' >{option.title} </div>
		{/* <div className='item-buttons' >
			<IconButton Icon={closeIcon} />
			<IconButton Icon={closeIcon} />
		</div> */}
	</div>)
}



const people = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
]

export function MyListbox() {
  const [selectedPerson, setSelectedPerson] = useState(people[0])

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      <Listbox.Button className={"aaaa"}>{selectedPerson.name}</Listbox.Button>
			<Transition
				enter="transition duration-100 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
			>
      <Listbox.Options>
        {people.map((person) => (
          <Listbox.Option
            key={person.id}
            value={person}
            disabled={person.unavailable}
          >
            {person.name}
						<MenuButton>
							<div >
								{currentText}
							</div>
						</MenuButton>
          </Listbox.Option>
        ))}
      </Listbox.Options>
			</Transition>
    </Listbox>
  )
}


const _compobox_btn_ = styled.div`
	/* min-width: 180px; */
	display: flex;

	color: #414141;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 220px; font-size: 14px;
	
	/* border: 1px solid #555555;
	border-radius: 5px;
	
	padding: 2px 10px;

	display: flex;
	justify-content: space-between;
	align-items: center; */
	
`

const _compobox_list_ = styled.div`
	width: 300px; padding: -5px;
	font-size: 12px;
	color: black;
	padding-bottom: 20px;
	
	.close-btn{
		display: none !important;
	}

	.menu-restore-button{
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-item-content{
		
		&:hover{
			.close-btn{
				display: block !important;
			}
		}
	}

	.menu-list{
		display: flex; flex-direction: column;
		overflow-y: scroll; max-height: 500px;

		::-webkit-scrollbar {
			width: 4px;
		}
		::-webkit-scrollbar-thumb {
			background-color: lightgray;
			border-radius: 10px;
		}
		::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
			box-shadow: inset 0px 0px 5px white;
		}
	}


	.divider{
		width: 100%; height: 1px;
		border-top: 1px solid #8e8e8e;
		margin: 5px 0;
	}

	

	.menu-restore-button{
		position: absolute;
		right: 10px;bottom: 5px;

		cursor: pointer;
		padding: 5px;

		width: 30px; height: 30px;
		font-size: 9px;
		/* background-color: gray; color: white; */
		border-radius: 50%;
	}
	.menu-restore-list-item{
		height: 30px; min-height: 30px; padding-left: 35px;
		display: flex; align-items: center; justify-content: start;

		cursor: pointer;

		:hover{
			background-color: #f0f0f0;
		}
	}

`