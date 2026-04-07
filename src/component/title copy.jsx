import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useStage } from '../hook/useStage';
import { useMainSetting } from '../hook/useMainSetting';

export const H1Title = (props) => {
	

	return (
		<Title {...props} type="head1"/>
	)
}

export const H2Title = (props) => {

	return (
		<Title {...props} type="head2"/>
	)
}

export const H3Title = (props) => {
	
	return (
		<Title {...props} type="head3"/>
	)
}
const samples ={
	head1:"대제목",
	head2:"중제목",
	head3:"소제목",
}

const fontsWidX ={
	head1:48,
	head2:36,
	head3:18,
}
// const fontsWidX ={
// 	head1:2.3,
// 	head2:1.8,
// 	head3:0.8,
// }
// .head1{font-size: 48px;}
// 	 .head2{font-size: 36px;}
// 	 .head3{font-size: 18px;}


const Title = ({ card, options, setCardOption, setOption, type, isSelected, layout}) => {
	const { resizeCard} = useStage();
	const { stageSize } = useMainSetting();
	const value = card?.value;

	// const 
	const isBackground = options.color;

	const [titleText ,  setTitle] = useState( (value && value !== "") ?value : samples[type]);
	const [isTyping, setTyping] = useState(true);

	const inputRef = useRef();

	useEffect(() =>{
		setCardOption( "isFixed" ,isTyping);
		if(isTyping){
			inputRef.current.focus();
			inputRef.current.innerText = titleText;
		}
	},[isTyping]);

	// snapshot 바뀔시 데이터 리프레쉬
	useEffect(() =>{
		if(value)setTitle(value);
	},[value])


	useEffect(() =>{
		if(!isSelected && isTyping)setTyping(false);
	},[isSelected]);

	const inputOnBlurHanddler = ( ) => {
		setTyping(false);
		const inputVal = inputRef.current.innerText;
		setCardOption("value", inputVal);
	}

	const inputOnChangeHanddler = (e) => {
		const target = e.target;
		const stageWidUnit = stageSize / 160
		let textSpace = isBackground ?  30 : 10;
		let newWid = ((target.offsetWidth + textSpace ) / stageWidUnit  ).toFixed();
		console.log('change text', target.offsetWidth, newWid );
		if(newWid < 20) newWid = 20;
		if(newWid > 160) newWid = 160;
		const newLayout = {...layout, w : +newWid}
		setTitle(e.target.value)
		resizeCard(newLayout);

	}

	const titleClickHandler = ( ) => {		
		setTyping(true);
	}

	const handlerPressEnter = (e) => {
		if(e.keyCode !== 13)return;
		setTyping(false);
	}

	const align = options?.align || "";

	return (
		<_head_>
			<div className={type +" title " + align} onClick={titleClickHandler}>
			{!isTyping && 
			<div  className="head-text">
				{titleText}
			</div>
			}
			{isTyping && 
			<>
			<Input contentEditable onInput={inputOnChangeHanddler} onBlur={inputOnBlurHanddler} ref={inputRef} onKeyDown={handlerPressEnter}  />
			</>
			//  <input ref={inputRef} onBlur={inputOnBlurHanddler} value={titleText || ""} 
			//  onChange={inputOnChangeHanddler} onDoubleClick={dbClickHandler} onKeyDown={handlerPressEnter}/>
			}
			</div>
		</_head_>
	)
}
 

// =================================================================================================

const Input = styled.span`
  display: inline-block;
  font-weight: lighter;
  border-bottom: 1px solid #232323;
  /* font-size: 34px; */
  max-width: 100%;
  /* max-width: calc(100% - 32px); */
  min-width: 50px;
`


const _head_ = styled.div`
   height: 100%;
		/* color: #333333; */

		font-family: "title";
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: flex;
		align-items: center;

		.title{
			width: auto;
		}

	 .head1{font-size: 48px;}
	 .head2{font-size: 36px;}
	 .head3{font-size: 18px;}

	 .left{text-align: left}
	 .right{text-align: right}
	 .center{text-align: center}
	 
	 input{
		width: max-content;
		min-width: max-content;
		height: 100%;
		background-color: transparent;
		vertical-align: middle;
		
		
		/* border-bottom: 1px solid gray; */
	 }

	 input:focus{outline:none}

	 .head-text{
		min-width: fit-content;
		width: 100%;
		height: 100%;
		
		/* overflow: hidden; */


		padding-right: 10px;
		:hover{
			/* border-bottom: 1px solid gray; */
		}
	 }
   
`
const _head2_ = styled.div`
   display: flex;
   place-items: center;
   text-align: center;
   
`
const _head3_ = styled.div`
   display: flex;
   place-items: center;
   text-align: center;
   
`