import React, {useEffect, useState, useRef, useContext} from 'react';
import Card4Stage from './card/card';

import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { useStage } from '../../hook/useStage';
import { useMainSetting, usePages } from '../../hook/useMainSetting';

import resizeIcon  from '../../assets/svg/dashboard-icons/resize-bottom-right.svg'

import {Svg4Color} from '../../component/svg-color'
import {MainContext} from '../../provider/MainProvider'
import { ArcGaugeSize, StatusSize, DivideGaugeSize, GaugeSize } from '../constants'
import { stageCol, cellHeight } from '../../ref/stage-setting'
import { getShared, useShared } from '../../store';
import "../print/horizontal-print.css"

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const Stagecontent = ({ stageSize, uploadImage, stageRef }) => {
	const {
		selectedCardId, resizeCard, selectedIds, setZIndex, stageCards,
		stageCardsLayoutChange, newCardType, appendCard4Image, appendCard4Text, grouping4Move, unGrouping4Move, moveGroupItem
	} = useStage(false);
	const {userInfo, isPreview} = useMainSetting();
	const {currentPage, currentPageId} = usePages();

	const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};

	const [isStatic, setStatic ] = useState(false);
	const [movedCard, setMoved] = useState(false);

	const stageLayouts = Object.values(stageCards).map(card => card.cardLocation);

	const [groups, setGroups] = useShared("main-groups" ,[] );
	const [groupLoca, setGroupLoca] = useShared("main-groups-loca", null );
	const [printSize4Dash, setSizeDash] = useShared("printSize4Dash", {wid: 290, hig: 210})

	
	
	// const [stageCol, set] = useState(  );

	// const [stageLayouts, setStLayout] = useState([]);

	useEffect(() => {},[printSize4Dash])

	useEffect(()=> {
		if(!selectedCardId)return;
		setZIndex(selectedCardId);
	},[selectedCardId])

    useEffect(() => {

		if((selectedIds.length !== 0)){
			if(equals([...selectedIds, selectedCardId], groups))return;
			setGroups([...selectedIds, selectedCardId]);
			setGroupLocation([...selectedIds, selectedCardId]);
		}
		if((selectedIds.length === 0 && groups.length !== 0)){
			unGrouping4Move(groupLoca, groups);
			setGroups([]);
			setGroupLocation([]);
		}
	},[selectedCardId, selectedIds])

	useEffect(()=> {
		
		// urlId와 cardType만 추출
		const cardInfos = Object.values(stageCards)
			.filter(card => card && card.options && card.options.urlId)
			.map(card => ({
				cardId: card.cardId,
				urlId: card.options.urlId,
				cardType: card.cardType
			}));
		
		console.log("========== Card urlId and cardType:", cardInfos);
		
	},[stageCards])


	const setGroupLocation = (groupList) => {
		let  minLoca = {x: 10000,y: 10000};
		let  maxLoca = {x: 0,y: 0};

		if(groupList.length === 0){
			setGroupLoca(null);
			return 
		}

		groupList.map(gid => {
			const target = stageCards[gid];
			if(!(target && target.cardLocation))return;
			const loca = target.cardLocation;
			if(loca.x < minLoca.x)minLoca.x = loca.x;
			if(loca.y < minLoca.y)minLoca.y = loca.y;

			if(loca.x + loca.w > maxLoca.x)maxLoca.x = loca.x + loca.w;
			if(loca.y + loca.h > maxLoca.y)maxLoca.y = loca.y + loca.h;
		})
		
		if(groupList.length !== 0){
			const groupItem = {
				...testL,
				x: minLoca.x, y: minLoca.y, w: maxLoca.x - minLoca.x, h: maxLoca.y - minLoca.y
			}
			grouping4Move({...groupItem}, null);
			setGroupLoca({...groupItem});
		}
	}


	const appendImgCompo4drop = async (layoutItem, file) => {
		const result = await uploadImage(file, currentPage);
		console.log("result", result, layoutItem);
		appendCard4Image({...layoutItem, w:20, h:20}, result);
	}
	
	// 외부에서 드래그하여 드롭시 호출 
	const onDrop = (layout, layoutItem, _event) => {
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

		stageCardsLayoutChange(layout);
  	};

	// 드래그 도중 호출
	const onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
	}	

	// 카드 이동 끝날시 호출
	const onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {

		if(newItem.i === "group"){
			setMoved(false);
			moveGroupItem(groupLoca, {...newItem}, groups);
			setGroupLoca({...newItem})
			// unGrouping4Move(groupLoca, groups);
			return
		}

		let newLayout = layout.map(l => {
			if(newItem.i === l.i)return {...newItem}
			else return { ...l, static:false}
		})
		setMoved(false);
		if(JSON.stringify(oldItem) === JSON.stringify(newItem)) return;
		stageCardsLayoutChange(newLayout);
	}

	const onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
		// console.log("onDragStart",layout, oldItem, newItem, placeholder, e, element);
		const dropItem = layout.find((item)=>item.i ==="__dropping-elem__");
		if(!dropItem){
			// selectCard(newItem.i)
			setMoved(true);
			setZIndex(newItem.i)
		}
		
	}

	// 레이아웃 변경시 호출
	const onLayoutChange = (layout)=>{		
		// console.log("onLayoutChange", layout);

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
		

		// if(!dropItem && !movedCard ) stageCardsLayoutChange(newLayout, true);
	}

	const onResize = ( layout, oldItem, newItem, placeholder, event, element) => {
		console.log('onResize', layout, oldItem, newItem, placeholder, event, element);
		let classes = element.className.split("react-resizable-handle-");
		let arrow =  classes[1];
		const [newWid, newXPos] = calcLayoutSize(arrow, oldItem, newItem)

		newItem.w = newWid;
		newItem.x = newXPos;
		placeholder.w = newWid;
		placeholder.x = newXPos;

		// newItem = {...oldItem};
		// const id = newItem.i
		// const type = stageCards[id].cardType;
		// const curW = newItem.w;
		// const curH = newItem.h;
		
		// if(type ==="Pie"){
		// 	const cw = newItem.w - oldItem.w;
		// 	newItem.h = oldItem.h + cw;
		// 	placeholder.h = oldItem.h + cw;
		// }else if(type ==="Table"){
		// 	newItem.w = oldItem.w;
		// 	placeholder.w = oldItem.w;
		// }else if(type === "Status"){
		// 	const defaultH = StatusSize.h;
		// 	const defaultW = StatusSize.w;

		// 	if(curW < defaultW  || curH < defaultH){
		// 		newItem.w = defaultW;
		// 		newItem.h = defaultH;
		// 		placeholder.h = defaultH;
		// 	}
		// }


		resizeCard(newItem);
	}

	return (
		<>
		<div className='stage-scroll'>
		<PrintStyleTag stageSize={stageSize}/>
		<div className='stage' ref={stageRef}>
		<GridLayout 
		className= "layout"
		layout={!groupLoca ? [...stageLayouts] : [...stageLayouts, groupLoca]}
    	rowHeight= {cellHeight}
		cols= {stageCol}
    	// cols= {{ lg: stageCol, md: stageCol, sm: stageCol/2, xs: stageCol/2, xxs: stageCol/2 }}
		// breakpoints={{ lg: 2400, md: 1400, sm: 768, xs: 480, xxs: 0 }}
		// currentBreakpoint={"lg"}
		// onBreakpointChange={handlerBreakPoint}

		width={stageSize}
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
		onResizeStop={()=>{}}
		onResizeStart={()=>{}}
		onResize={onResize}
		
		// 드랍 추가시에 크기 조절
		onDropDragOver={(e)=>{
			return newCardType;
		}}

		// measureBeforeMount={true}
		useCSSTransforms={true}

		// 가로 세로
		compactType={null}
		// 겹치기 가능 (이게 자동정렬 막아줌)
		allowOverlap = {true}
		// drag 시에 다른 카드 위치 변동 막는걱
		preventCollision={false}

		// verticalCompact={false}
		// preventCollision={true}

		// draw apppend option
		isDroppable={!isPreview}
		isDraggable={!isPreview}
		isResizable={!isPreview}
		
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
			if(cardId === "group" || cardId === "null") return;
			// if(cardId === "Bar1") console.log(isStatic, card.cardLocation);
			
			const isFixed =  isPreview;
			// const isFixed = card?.isFixed || false;
			const isSelected = selectedCardId === cardId;

			let layout = {...card.cardLocation, static: isStatic };


			const zIndex = card?.zIndex ? card?.zIndex : 1;
			const selectedZIndex = isSelected ? 10000 : 1;

			const isHidden = groups.find(g => g === cardId);
			return (
			<div className={(isSelected ? "selected-card": "")+ (isFixed ? " drag-cancel":"")} key={cardId} data-grid={{...layout}}  
			style={{zIndex: zIndex * selectedZIndex, display: isHidden ? "none" : "block"}}>
				<Card4Stage card={card}  key ={cardId} selectedCardId={selectedCardId}
				layout={{...layout}} selectableKey={cardId} isPreview={isPreview}/>
			</div>
			);
		})}

		{(groups.length !== 0 && groupLoca) &&  <div key={"group"} style={{ zIndex:1}} className='draggable'   >
			{groups.map(cardId => {
				let groupCard = stageCards["group"] || {...testL};
				const card = stageCards[cardId];
				if(!groupCard)groupCard = {...testL};
				else groupCard = groupCard.cardLocation;

				if(!card) return;

				const isFixed = card?.isFixed || false;
				
				const isSelected = selectedCardId === cardId;
				const isResizable = isSelected;

				let layout = {...card.cardLocation,moved: true};
				
				const {x: cx, y: cy} = {...groupCard};
				const {x: ox, y: oy} = {...groupLoca};
				const {x, y, w, h} = layout;

				const cellSize = stageSize / stageCol;
				const style = {
					position: "absolute",
					left: ((x - cx - (ox - cx)) * cellSize) + "px",
					top: ((y - cy - (oy - cy)) * 10) + "px",
					width: (w * cellSize) + "px",
					height: (h * 10) + "px",
					// backgroundColor: "beige"
				}

				return (
					<div className={(isResizable ? "selected-card": "")+ (isFixed ? " drag-cancel":"")} key={cardId} data-grid={{...layout}}  
					style={{...style  }}
					>
						<Card4Stage card={card}  key ={cardId} 
							layout={{...layout}}
							/>
					</div>);
			})}
		</div>}
		</GridLayout>
		</div>
		</div>
		</>
	)
}

const PrintStyleTag = ({stageSize}) => {
	const [printScale, setPrintScale] = useState( 1 );

	useEffect(()=> {
		if(!stageSize)return;
		// let scale = 1680 / stageSize;
		let scale = 1680 / stageSize;
		if(scale > 1)scale = 1;
		setPrintScale(scale)
	},[stageSize])


	return (
		<style type='text/css' media='print'>
		{" @page { size: A4 landscape;} "}
		{`@media print { 
			.stage { transform: scale(${printScale}); }
		}`}
		</style>
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


const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);