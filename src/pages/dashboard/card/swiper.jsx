import React, { cloneElement, useEffect, useState, useRef, useCallback, useMemo, useContext } from 'react';
import {store, newUseStore, useStore4Post, getShared, setShared, Control4Post, Control4Get, Control4Mqtt } from '../../../store';
import moment from 'moment';
import { useMainSetting } from '../../../hook/useMainSetting';

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
// import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { contentRefTable } from "../../../ref/component";

import { Component } from "./content";
import {_card_} from "../../../styles/stage-style";

const componentArrCheckObj = {
	"List":true,
	"Line":true,
	"Bar":true,
	"Pie":true,
	"Gauge":false,
	"DBGauge":false,
	"DivideGauge":false,
	"Status":false,
	"ArcGauge":false,
	"Map":true,
  }
  
export const Contents = ({card, data, apiObj, children, padding}) => {
	const id = card.cardId
	const isCardHeader = card.isCardHeader;
	const [pageNum, setPageNum] = useState(0);
	const [swiperIns, setSwiper] = useState(null);

	const [isRunning, setIsRunning] = useState(false);
	const [currentIdx, setCurrentIdx] = useState(0);

    const swiperInterval = getShared("swiperInterval", false);
	const setSwiperIdx4Card = setShared(`${id}-swiperIdx`);

	useEffect(() => {
		let qureyLength = apiObj?.querys?.length;
		if(qureyLength && qureyLength > 1)setIsRunning(true);
		else setIsRunning(false);
	},[apiObj])

	// 스와이퍼 자동 슬라이드
    useEffect(()=>{
		if(!isRunning)return;
        if(!(swiperInterval && swiperIns ))return;
        let nextResult = swiperIns.slideNext();
		let newIdx = swiperIns.activeIndex;
        if(!nextResult){
			swiperIns.slideTo(0);
			newIdx = 0;
		}

		setCurrentIdx(newIdx);
		setSwiperIdx4Card(newIdx);
		// console.log('nextResult', nextResult, swiperIns.activeIndex, newIdx);
    },[swiperInterval])

	// 페이지 번호 클릭 이벤트
	const handlerPagenationClick = (idx) => {
		setCurrentIdx(idx);
		setSwiperIdx4Card(idx);
		swiperIns.slideTo(idx);
	}

	useEffect(()=>{
		if(!data || data.length === 0)return setPageNum(1);
		let len = data.length;
		setPageNum(len);
	},[data])


    return (
	<>
	{isRunning && <> <SwiperPagenation pageNum={pageNum} currentIdx={currentIdx} onClick={handlerPagenationClick} isCardHeader={isCardHeader} /> </>}
    <Swiper
		className='draggable'
      	modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
		centeredSlides={true}
		
		onSwiper={(swiper) => setSwiper(swiper)}

		pagination={{ clickable: true }}
		navigation={{
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		}}
    >
        { pageNum && Array(pageNum).fill(0).map((content, idx) => {
			let item = data[idx] || false;
			let isArr = componentArrCheckObj[card.cardType];
			
			return (
				<>
				<SwiperSlide key={card.cardId + idx} >
					<SwiperItem data={isArr ? item : item[0]} idx={idx} isSwiper={isRunning} component={children} apiObj={apiObj} />
				</SwiperSlide>
				</>
			)
		})}
	</Swiper>	
	</>
	)
}

const SwiperPagenation = ({pageNum, currentIdx, onClick, isCardHeader}) => {

	const swiperClickHandler = (idx) => {
		onClick(idx);
	}

	return(<>
	<div className={ "c-swiper-pagination " + (isCardHeader ? "is-have-header" : "")}>
		{Array(pageNum).fill(0).map((content, idx) => {
			return(<div className={"c-swiper-point" + (idx === currentIdx ? " active" : "")} key={idx} onClick={()=>swiperClickHandler(idx)}  ></div>)
		})}
	</div>
	</>)


}
const SwiperItem = ({idx, component, ...props}) => {

	return (
		<div className='draggable swiper-item swiper-no-swiping noSwiping'>
			{cloneElement(component, {...props})}
		</div>
	)
}


export const Control4Swiper = ({}) => {
	const {currentPage} = useMainSetting();
	const [interval, setInterval4Swiper] = useState(false);
	const setSwiperInterval = setShared("swiperInterval");
  
  let second = currentPage.rollingInterval || 20;

  useEffect(() => {
    let interval4Swiper = setInterval(() => {
        setSwiperInterval((a)=>!a);
    }, second * 1000);

    setInterval4Swiper(interval4Swiper);

    return () => clearInterval(interval4Swiper);
  }, [second]);

};
