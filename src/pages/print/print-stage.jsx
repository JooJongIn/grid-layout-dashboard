import React, {useEffect, useState, useRef, useContext} from 'react';
import Card4Stage from '../dashboard/card/card';
import styled from 'styled-components';

import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { useStage } from '../../hook/useStage';
import { useMainSetting, usePages } from '../../hook/useMainSetting';

import Popover from '@mui/material/Popover';

import resizeIcon  from '../../assets/svg/dashboard-icons/resize-bottom-right.svg'
import resizeBlckIcon  from '../../assets/icons/resize-black.png'
import resizeWhiteIcon  from '../../assets/icons/resize-white.png'

import {Svg4Color} from '../../component/svg-color'
import {MainContext} from '../../provider/MainProvider'
import { ArcGaugeSize, StatusSize, DivideGaugeSize, GaugeSize } from '../constants'
import { stageCol, cellHeight } from '../../ref/stage-setting'
import { getShared, useShared } from '../../store';

// import './print.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const PrintStage = ({ stageSize, uploadImage, stageRef }) => {
	const {
		selectedCardId, resizeCard, selectedIds, setZIndex, stageCards,
		stageCardsLayoutChange, newCardType, appendCard4Image, grouping4Move, unGrouping4Move, moveGroupItem
	} = useStage(true);
	const {userInfo} = useMainSetting();
	const {currentPage} = usePages();
	const isSuperUser = userInfo.roleId <= 4;

	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};

	const [isStatic, setStatic ] = useState(false);
	const [movedCard, setMoved] = useState(false);
	const [printPageNum, setPrintPage] = useState( 1 );


	const stageLayouts = Object.values(stageCards).map(card => card.cardLocation);

	useEffect(() => {
		console.log('stageCards', stageCards);
	},[stageCards])


	useEffect(()=> {
		if(!selectedCardId)return;
		setZIndex(selectedCardId);
	},[selectedCardId])

	useEffect(() => {
		if(!stageRef)return;
		
		const offHig = stageRef.current.offsetHeight;
		let pageNum = Math.ceil( (offHig / 1680 - 1)); 
		console.log("==================" , stageRef.current.offsetHeight, (offHig / 1680 - 1));
		setPrintPage(pageNum + 1);
	},[stageRef?.current?.offsetHeight])



	const appendImgCompo4drop = async (layoutItem, file) => {
		const result = await uploadImage(file, currentPage);
		console.log("result", result, layoutItem);
		appendCard4Image({...layoutItem, w:20, h:20}, result);
	}
	
	
	// 외부에서 드래그하여 드롭시 호출 
	const onDrop = (layout, layoutItem, _event) => {
		console.log("onDrop",layout);
		setStatic(true);
		// file 이벤트 확인
		const files = _event.dataTransfer.files;
		let newLayout = [];
		layout.map((item)=>{
			let tCard = stageCards[item.i]
			let clayout = tCard?.cardLocation;

			if(clayout) {
				item = { ...item, x: clayout.x, y: clayout.y, h: clayout.h, w: clayout.w };
				newLayout.push(item);
			}
		});
		
		if(files.length !== 0){
			const file = files[0];
			stageCardsLayoutChange(newLayout);
			return appendImgCompo4drop(layoutItem, file);
		}
		
		if(!newCardType)return;

		// setStatic(false)
		stageCardsLayoutChange(layout);
  	};

	// 드래그 도중 호출
	const onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
		// console.log(layout, oldItem, newItem, placeholder, e, element);
		// const xmove = oldItem.x - newItem.x;
		// const ymove = oldItem.y - newItem.y;
		// const newLayouts =layout.map((l)=> {
			
		// 	let target = selectedIds.find(id => id === l.i);
		// 	if(target){
		// 		l = { ...l, x: l.x + xmove, y: l.y  + ymove };
		// 		console.log(target, l, xmove, ymove);
		// 	}
		// 	return l;
		// })
		// stageCardsLayoutChange(newLayouts, true);
		// console.log(newLayouts);
	}	

	// 카드 이동 끝날시 호출
	const onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
		console.log("onDragStop",layout, newItem);

		let newLayout = layout.map(l => {
			if(newItem.i === l.i)return {...newItem}
			else return { ...l, static:false}
		})
		setMoved(false);
		stageCardsLayoutChange(newLayout);
	}

	const onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
		console.log("onDragStart",layout, oldItem, newItem, placeholder, e, element);
		const dropItem = layout.find((item)=>item.i ==="__dropping-elem__");
		if(!dropItem){
			// selectCard(newItem.i)
			setMoved(true);
			setZIndex(newItem.i)
		}
		
	}

	// 레이아웃 변경시 호출
	const onLayoutChange = (layout)=>{		
		console.log("onLayoutChange",layout);
		
		// layout.map( item => {
		// 	let layoutItem = stageLayouts.find(clayout => clayout.i === item.i);
		// 	if(!layoutItem) return;
		// 	item.x = layoutItem.x;
		// 	item.y = layoutItem.y;
		// })

		// drop item append
		const dropItem = layout.find((item)=>item.i ==="__dropping-elem__");

		let newLayout = layout.map((item)=>{
			let tcard = stageCards[item.i] || {};
			let clayout = tcard?.cardLocation;
			
			if(clayout) item = { ...item, x: clayout.x, y: clayout.y, h: clayout.h, w: clayout.w, static:isStatic };
			return item;
		})

		if(dropItem)setStatic(true);
		if(!dropItem)setStatic(false);

		// let newLayout = stageLayouts.map(l => ({...l, static:true}));
		

		if(!dropItem && !movedCard ) stageCardsLayoutChange(newLayout, true);
	}

	const onResize = ( layout, oldItem, newItem, placeholder, event, element) => {
		let classes = element.className.split("react-resizable-handle-");
		let arrow =  classes[1];
		const [newWid, newXPos] = calcLayoutSize(arrow, oldItem, newItem)

		newItem.w = newWid;
		newItem.x = newXPos;
		placeholder.w = newWid;
		placeholder.x = newXPos;

		// newItem = {...oldItem};
		const id = newItem.i
		const type = stageCards[id].cardType;
		const curW = newItem.w;
		const curH = newItem.h;
		
		if(type ==="Pie"){
			const cw = newItem.w - oldItem.w;
			newItem.h = oldItem.h + cw;
			placeholder.h = oldItem.h + cw;
		}else if(type ==="Table"){
			newItem.w = oldItem.w;
			placeholder.w = oldItem.w;
		}else if(type === "Status"){
			const defaultH = StatusSize.h;
			const defaultW = StatusSize.w;

			if(curW < defaultW  || curH < defaultH){
				newItem.w = defaultW;
				newItem.h = defaultH;
				placeholder.h = defaultH;
			}
		}


		resizeCard(newItem);
	}

	const handlerBreakPoint = (e) => {
		console.log(e);
	}


	return (
		<_print_stage_ printNum={printPageNum}>
		<Dividers stageRef={stageRef} printNum={printPageNum} />
		<div className='stage print-stage' id='stage' ref={stageRef} style={{width: "1200px" }}>
		
		<GridLayout 
		className= "layout"
		layout={[...stageLayouts]}
    	rowHeight= {cellHeight}
		cols= {stageCol}
    	// cols= {{ lg: stageCol, md: stageCol, sm: stageCol/2, xs: stageCol/2, xxs: stageCol/2 }}
		// breakpoints={{ lg: 2400, md: 1400, sm: 768, xs: 480, xxs: 0 }}
		// currentBreakpoint={"lg"}
		// onBreakpointChange={handlerBreakPoint}

		// width={2480}
		width={1200}
    	mounted = {false} 
		
		// 리사이즈 손잡이
		resizeHandles= {[]}
		// resizeHandles= {["s", "w", "e", "n", "sw", "nw", "se", "ne"]}

		// 카드간이 간격
		margin ={ [0, 0]}

		// event handlers
		onLayoutChange={onLayoutChange}
		onDrop={onDrop}
		onDrag={onDrag}
		onDragStop={onDragStop}
		onDragStart={onDragStart}
		onResize={onResize}
		
		// 드랍 추가시에 크기 조절
		onDropDragOver={(e)=>{
			return newCardType;
		}}

		// measureBeforeMount={true}
		useCSSTransforms={true}

		// 가로 세로
		compactType="vertical"
		// 겹치기 가능 (이게 자동정렬 막아줌)
		allowOverlap = {true}
		// drag 시에 다른 카드 위치 변동 막는걱
		preventCollision={true}

		// draw apppend option
		isDroppable={true}
		isDraggable={true}
		isResizable={true}
		
		// 경계를 넘지 않음
		isBounded={false}

		draggableCancel ={".drag-cancel"}
		draggableHandle={".draggable"}
		// innerRef={ref}

		// autoSize={true}
		// resizeHandle ={
		// <div className='react-resizable-handle '>
		// 	<Svg4Color icon={resizeIcon} hex={themeStyle.iconColor}/>
		// </div>
		// }

		resizeHandle ={(eightPoint, ref) =>{
            let arrclass = 'react-resizable-handle react-resizable-handle-' + eightPoint;
			
            return(
                <div className={arrclass} ref={ref} >
                    <Svg4Color icon={resizeIcon} hex={themeStyle.iconColor}/>
                </div>
            )
        }}
		>
		{ Object.keys(stageCards).map(cardId => {
				
			const card = stageCards[cardId];

			if(!(card && card.cardId)) return;
			if(cardId === "group") return;
			// if(cardId === "Bar1") console.log(isStatic, card.cardLocation);
			
			const isFixed = card?.isFixed || false;
			const isSelected = selectedCardId === cardId;
			let layout = {...card.cardLocation, static: isStatic };


			const zIndex = card?.zIndex ? card?.zIndex : 1;
			const selectedZIndex = isSelected ? 10000 : 1;
			
			return (
				<div className={(isSelected ? "selected-card": "")+ (isFixed ? " drag-cancel":"")} key={cardId} data-grid={{...layout}}  
				style={{zIndex: zIndex * selectedZIndex}}
				>
					<Card4Stage card={card}  key ={cardId}
						layout={{...layout}} history={history} selectableKey={cardId}
					/>
				</div>);
		})}
		</GridLayout>
		</div>
		</_print_stage_>
	)
}

const testL = {
	"w": 20,
	"h": 10,
	"x": 10,
	"y": 10,
	"i": "group",
	"moved": true,
	"static": false,
	"isDraggable": true
}


const calcLayoutSize = (arrow, oldItem, newItem) => {
	let newWid = newItem.w;
	let newXPos = newItem.x;

	switch(arrow){
		case "w":
			newWid = newItem.w;
			newXPos = oldItem.x + oldItem.w - newItem.w

	}

	return [newWid, newXPos];
}


const Dividers = ({stageRef, printNum}) => {
	const [divArr, setDivArr] = useState( [] );

	useEffect(() => {
		if(!(printNum && !isNaN(printNum)))return;
		let arr = Array(printNum).fill("");
		
		setDivArr(arr);
	},[printNum])
	
	const dividerStyle = {
		borderBottom: "2px dashed gray",
		position: "absolute",
		width: "1200px", height: "1px"
	}

	return (
		<>
		{divArr.map((a, idx)=> {
			console.log('idx', idx);
			return (<div className='divider-for-print' style={{...dividerStyle, top: 1680 * (idx + 1) + "px"}} > </div> )
		})}
		</>
	)
}


const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

export const _print_stage_ = styled.div`
	@page {
		size:210mm 297mm; margin:0mm;
	}
	@media print {
		div{color: black;}
		.card{ 
			/* border: 2px solid black; box-shadow: 0;
			width: 100%;height: 100%; */
			/* background-color: gray; */

			
			
		}

		
	}
	@media screen {
		.print-stage{ height: fit-content !important; }
		
		.layout{
			
			min-height: ${p => (p.printNum * 1680)}px !important;
			border-left: 2px dashed gray;
			border-right: 2px dashed gray;
		}
	}

`

// @page {
//     size:210mm 297mm; /*A4*/
//     margin:0mm
// }

// @media print {
//     .stage {
//         height: 100%;
//         /* background :rgba(221, 221, 221, 0.855); */
//     }
//     /* div{color: black;} */
//     /* .isBorder{
//         border: 1px solid black;
//     } */
//     .card{ 
//         box-shadow: 0;
//         width: 100%;height: 100%;
//     }

//     .react-grid-item.react-grid-placeholder {
// 		background: transparent;
// 		border: 0;
// 		opacity: 0;
// 		transition-duration: 100ms;
// 		z-index: 2;
// 		-webkit-user-select: none;
// 		-moz-user-select: none;
// 		-ms-user-select: none;
// 		-o-user-select: none;
// 		user-select: none;
// 	}

//     .setting-bar{
//         display: none;
//     }
    
// }
