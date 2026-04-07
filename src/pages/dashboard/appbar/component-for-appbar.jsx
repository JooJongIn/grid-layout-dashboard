import { useEffect, useState, cloneElement } from 'react'
import styled from 'styled-components'

import { useStage } from '../../../hook/useStage';
import { useShared } from '../../../store';

import H1TitleIcon from "/src/assets/svg/format-header-1.svg";
import H2TitleIcon from "../../../assets/svg/dashboard-icons/format-header-2.svg";
import H3TitleIcon from "../../../assets/svg/dashboard-icons/format-header-3.svg";
import TextIconB from "../../../assets/svg/setting-icon/text-icon.svg";

import WidgetIcon from "../../../assets/images/ico_widget.svg";
import TextIcon from "../../../assets/images/ico_text.svg";
import AlignIcon from "../../../assets/images/ico_align.svg";

import AlignLeftIcon from "../../../assets/images/ico_align_left.svg";
import AlignCenterIcon from "../../../assets/images/ico_align_center.svg";
import AlignRightIcon from "../../../assets/images/ico_align_right.svg";
import AlignTopIcon from "../../../assets/images/ico_align_top.svg";
import AlignMiddleIcon from "../../../assets/images/ico_align_middle.svg";
import AlignBottomIcon from "../../../assets/images/ico_align_bottom.svg";
import AlignDeleteIcon from "../../../assets/images/ico_align_delete.svg";



// ico_widget
// images/ico_text.svg
// images/ico_align.svg

import LineImg from "../../../assets/img/divide_line.svg"
import HorizonLineImg from "../../../assets/img/horizon_line.svg"

import { ComponentPopover } from './component-popover'

import { cardDefaultOptions } from '../../../ref/component'

export const ComponentButtons = ({currentPopover, setPopoverOpen}) => { 
    const {  selectedIds } = useStage();

    return(
        <>
        <PopoverButton text={"Widget추가"} icon={WidgetIcon} id={"widget"} currentPopover={currentPopover} setPopoverOpen={setPopoverOpen} >
            <ComponentPopover />
        </PopoverButton>
        <PopoverButton text={"Text추가"} icon={TextIcon} id={"text"} currentPopover={currentPopover} setPopoverOpen={setPopoverOpen} >
            <TextCompoPopover />
        </PopoverButton>
        <PopoverButton text={"정렬"} icon={AlignIcon} id={"sort"} currentPopover={currentPopover} setPopoverOpen={setPopoverOpen} isDisable={selectedIds.length < 1} >
            <SortPopover setOpen={setPopoverOpen} />
        </PopoverButton>
        </>
    )
}


const PopoverButton = ({text, children, currentPopover, setPopoverOpen, id ,icon, isDisable }) => {
    const openHandler = (e) => {
        e.stopPropagation();
        if(currentPopover === id)return setPopoverOpen(false);
        setPopoverOpen(id);
    }

    return(
        <>

        <li>
        <button className={"edit_btn" + (isDisable ? " disable" : "")} id="btn_pop" onClick={isDisable ? null : openHandler}>
            {icon && <img src={icon} alt=""/>}
            <div className='btn_text'>{text || ""}</div>
        </button>
        {(children && currentPopover === id) && cloneElement(children, { close: ()=>setPopoverOpen(false) })}
        </li>
        </>
    )
}






const TextCompoPopover = () => {
    const { appendCard, setNewCardType} = useStage();
    
    useEffect(()=>{

    },[])

    const onClickHandler = (id) => {
        const cardDefaultOption = cardDefaultOptions[id];
		const cardSize = cardDefaultOption.size;
		const isCardHead = cardDefaultOption.isHeader;
        
		// document.body.style.cursor = 'none';
		// setNewCardType();
        appendCard({...cardSize, type: id, isHeader: isCardHead})
    }

    const ListItem = ({icon, text, onClick, id}) => {

        return(
            <>
            <li><button class="select_btn" onClick={()=>onClick(id)}><img src={icon} alt="" /> <div className='select-text'> {text} </div></button></li>
            </>
        )
    }

    return(
        <>
        <div class="set_layer txt_setbox">
            <ul class="set_setlect">
                <ListItem icon={H1TitleIcon} text={"제목1"} id={"H1"} onClick={onClickHandler} />  
                <ListItem icon={H2TitleIcon} text={"제목2"} id={"H2"} onClick={onClickHandler} />
                <ListItem icon={H3TitleIcon} text={"제목3"} id={"H3"} onClick={onClickHandler} />
                
                <li class="horizon_line">
                    <img src={HorizonLineImg} alt="" />
                </li>
                <ListItem icon={TextIconB} text={"텍스트상자"} id={"TextField"} onClick={onClickHandler} />
            </ul>
        </div>
        </>
    )
}




const SortPopover = ({setOpen}) => {
    const [groups, setGroups] = useShared("main-groups" ,[] );
	const [groupLoca, setGroupLoca] = useShared("main-groups-loca", {} );

	const { selectedCardId, selectedIds, alignCards, alignCards4If,removeCard, alignSpaceCards } = useStage();

    const alignCards4LeftHandler = (e) => {
		const {x, y, h, w} = groupLoca;
		alignCards({x},groups)
	}

	const alignCards4TopHandler = () => {
		const {x, y, h, w} = groupLoca;
		alignCards({y},groups)
	}

	const alignCards4RightHandler = () => {
		const {x, y, h, w} = groupLoca;
		alignCards4If("right", {x: x + w}, groups)
	}

	const alignCards4BottomHandler = () => {
		const {x, y, h, w} = groupLoca;
		alignCards4If("bottom", {y: y + h},groups)
	}

	const alignCards4HoriCenterHandler = () => {
		const {x, y, h, w} = groupLoca;
		alignCards4If("hori", {x: x + (w / 2)},groups)
	}

	const alignCards4VertCenterHandler = () => {
		const {x, y, h, w} = groupLoca;
		alignCards4If("vert", {y: y + (h / 2)},groups)
	}

	
	const alignSpace4HoriHandler = () => {
		alignSpaceCards("x", "w", groupLoca, groups)
	}
	const alignSpace4VertHandler = () => {
		alignSpaceCards("y", "h", groupLoca, groups)
	}



	const deleteCards = () => {
        setOpen(false);
		removeCard(selectedCardId)
	}

    return(
        <>
        <div class="set_layer align_setbox">
            <ul class="set_setlect">
                <li><button class="select_btn" onClick={alignCards4LeftHandler} ><img src={AlignLeftIcon} alt="" /> <div className='select-text'> 좌측 정렬</div></button></li>
                
                <li><button class="select_btn" onClick={alignCards4HoriCenterHandler} ><img src={AlignCenterIcon} alt="" /> <div className='select-text'>가운데 정렬</div></button></li>
                <li><button class="select_btn" onClick={alignCards4RightHandler} ><img src={AlignRightIcon} alt="" /> <div className='select-text'> 우측 정렬</div></button></li>
                <li class="horizon_line"><img src={HorizonLineImg} alt="" /></li>
                <li><button class="select_btn" onClick={alignCards4TopHandler} ><img src={AlignTopIcon} alt="" /> <div className='select-text'>상단 정렬</div></button></li>
                
                
                <li><button class="select_btn" onClick={alignCards4VertCenterHandler} ><img src={AlignMiddleIcon} alt="" /> <div className='select-text'>중간 정렬</div></button></li>
                <li><button class="select_btn" onClick={alignCards4BottomHandler} ><img src={AlignBottomIcon} alt="" /> <div className='select-text'>하단 정렬</div></button></li>
                <li class="horizon_line"><img src={HorizonLineImg} alt="" /></li>
                <li><button class="select_btn"  onClick={deleteCards}><img src={AlignDeleteIcon} alt="" /> <div className='select-text'> 삭제</div></button></li>
            </ul>
        </div>
        </>
    )
}

export const _popover_ = styled.div`
    position: relative;


    /* .select_btn {width:100%;height:25px; padding:0 12px; text-align:left; color:#5e5e5e; font-size:14px;  display: flex; align-items: center; justify-content: start; vertical-align: middle;}
    .select-text { padding-top: 2px;} */
`