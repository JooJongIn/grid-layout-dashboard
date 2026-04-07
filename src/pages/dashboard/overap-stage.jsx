import React, {useEffect, useState, useRef} from 'react';
import Card4Stage from './card';

import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);


export const OverLapStagecontent = ({cards, removeCard, selectedCard, setSelectedCard, newCardType, appendCard, stageCardsLayoutChange}) => {
	// grid layout location list
	const [stageCardArrays, setCardVals] = useState([]);

	// layout ids List
	const [stageCardIds, setCardIds] = useState([]);

	const [lastLayout , setLastLayout ] = useState([]);

	const ref= useRef();
	
	useEffect(()=>{
		console.log("useEffect",cards);
		const cardsValues = Object.values(cards);
		const cardsIds = Object.keys(cards);
		const locationArr = cardsValues.map(card => card.cardLocation);
		setCardVals(locationArr);
		setCardIds(cardsIds);
	},[cards]);


	const isOverlap =  false;

	
	// 외부에서 드래그하여 드롭시 호출 
	const onDrop = (layout, layoutItem, _event) => {
		console.log("onDrop",layout,layoutItem);
		stageCardsLayoutChange(layout);
		appendCard(layoutItem);

  };

	// 윈도우 리사이즈시에 호출
	const onBreakpointChange = (breakpoint)=>{
		console.log("onBreakpointChange",breakpoint);	
	}

	const onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
		if(!(placeholder.x ===  newItem.x )){
			// console.log("onDrag",layout, oldItem, newItem, placeholder, e, element);
			console.log("onDrag", newItem,placeholder);
			placeholder.x= newItem.x;
		}
		placeholder.placeholder =false;

		// setLastLayout(layout)

		// if(newItem.i === "__dropping-elem__" ){
		// 	let windowWidth = window.innerWidth;
		// 	const oneWid = windowWidth/12;
		// 	const layoutYPosition = ref.current.getBoundingClientRect().y;

		// 	const x = e.clientX;
		// 	const y = e.pageY;

		// 	newItem.x = Math.floor(x / oneWid);
		// 	newItem.y = Math.floor((y-layoutYPosition) / 50);

		// 	placeholder.x = newItem.x;
		// 	placeholder.y = newItem.y;
		// }
	}

	// 카드 이동 끝날시 호출
	const onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
		console.log("onDragStop",layout, oldItem, newItem, placeholder, e, element);
		stageCardsLayoutChange(layout);
	}

	// 레이아웃 변경시 호출
	const onLayoutChange = (layout, layouts, event)=>{
		

		// const dropItem = layout.find((card)=>card.i === "__dropping-elem__" );
		
		// // 레이아웃 cards 기준으로 위치 고정
		// layout.map((card)=>{
		// 	const cardId = card.i;
		// 	if(cardId === "__dropping-elem__")return;
		// 	const objLocation = cards[cardId].cardLocation;
		// 	const {x, y} = objLocation;
		// 	card.x = x;
		// 	card.y = y;
		// 	if(dropItem ){
		// 		card.static = true;	
		// 	}else{
		// 		card.static = false;
		// 	}
			
			
		// })

		// const gridLayout = ref.current;
		// console.log("onLayoutChange ref",gridLayout.style.height);
		// gridLayout.style.height = `${height}px`
	}


	return (
		<>
		<ResponsiveReactGridLayout 
		className= "layout"
		
    rowHeight= {50}
		layout={stageCardArrays}
		// window 크기에 따른 변화
    cols= {{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}

		currentBreakpoint= "lg"
    mounted = {false} 
		
		// 리사이즈 손잡이
		resizeHandles= {["se"]}

		// event handlers
		onBreakpointChange={onBreakpointChange}
		onLayoutChange={onLayoutChange}
		onDrop={onDrop}
		onDrag={onDrag}
		onDragStop={onDragStop}
		onResizeStop={()=>{console.log("onResizeStop");}}
		// 드랍 추가시에 크기 조절
		onDropDragOver={(e)=>{
			const cardSize = sizeList[newCardType];
			const {w, h} = cardSizeObjList[cardSize];
			return{w:w,h:h};
		}}


		measureBeforeMount={false}

		useCSSTransforms={false}

		// 가로 세로
		compactType="vertical"
		// 겹치기 가능 (이게 자동정렬 막아줌)
		allowOverlap = {false}
		// drag 시에 다른 카드 위치 변동 막는걱
		preventCollision={false}
		// draw apppend option
		isDroppable={true}

		isResizable={true}
		// 경계를 넘지 않음
		isBounded={false}
		// ref 
		innerRef={ref}

		autoSize={true}
		>
		
		
		{stageCardIds.map(cardId => {
				const card = cards[cardId];

				if(!card) return;

				const cardLocation = card.cardLocation;
				
				const {x,y,w,h} = cardLocation;
				
				return (
					
				<div key={cardId} data-grid={{x:x,y:y,w:w,h:h}} >
				
				<Card4Stage card={card}  selectedCard= {selectedCard} setSelectedCard ={setSelectedCard}
					removeCard= {removeCard}  key ={cardId} />
				</div>);

			})}

		</ResponsiveReactGridLayout>
			
		</>
	)
}



// 해당컴포넌트의 카드 종류
const sizeList = {
	Text: "basicCard",
	TextField: "bigCard",
	Number: "basicCard",
	Bar : "bigCard",
	Pie : "bigCard",
	Line : "bigCard",
	Table : "exLargeCard",
	List: "bigCard",
	Data: "basicCard",
	H1: "lineCard",
	H2: "lineCard",
	H3: "lineCard",
	Gauge: "smallCard"
}	

// 카드의 크기
const cardSizeObjList = {
	smallCard:{w:2,h:2},
	basicCard: {w:3,h:4},
	bigCard:{w:4,h:6},
	exLargeCard:{w:6,h:8},
	lineCard:{w:12,h:1},
}
