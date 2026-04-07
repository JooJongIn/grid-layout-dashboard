import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useStage } from '../hook/useStage';
import { useMainSetting } from '../hook/useMainSetting';
import { stageCol } from '../ref/stage-setting';

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


const Title = ({ card, setCardOption,  type, isSelected}) => {
	const inputRef = useRef();
	const divRef = useRef();
	const { resizeCard } = useStage() || {};
	const { stageSize } = useMainSetting();

	const [titleText, setTitle] = useState( card?.value || "");
	const [color, setColor] = useState(false);
	const [align, setAlign] = useState("");
	// const [isTyping, setTyping] = useState(false);
	const isTyping = isSelected;

	const cellSize = stageSize / stageCol;

	useEffect(() =>{
		if(isTyping){inputRef.current.focus();}
	},[isTyping]);

	useEffect(() => {
		const options = card?.options;
		
		if(options?.align)setAlign(options.align);
		else setAlign("");

		if(options?.mainColor)setColor(options.mainColor);
		else setColor(false);
	},[card])

	// 타이틀 변경에 따라 카드 사이즈 변경
	useEffect(() => {
		if(!isTyping)return;
		const cardLoca = card.cardLocation;

		const newWid = divRef.current.scrollWidth;
		let newWidCell = Math.floor(newWid / cellSize + 10);
		if(newWidCell > 160) newWidCell = 160;
		const newLayout = {...cardLoca, w : +newWidCell}
		resizeCard(newLayout);
	},[titleText]);

	const handlerClickTitle = (e) => {
		// if(isSelected)setTyping(true);
	}


	const inputOnChangeHanddler = (e) => {
		setTitle(e.target.value);
	}

	const inputOnBlurHanddler = ( ) => {
		
		if(card?.value !== titleText)setCardOption({value : titleText});
		// setTyping(false);
	}

	return (
		<_head_ color={color ? color : "inherit"}>
			<div className={type + " title " + align + ((isTyping && isSelected) ? " drag-cancel" : "")} draggable="false">
				<div ref={divRef} className={"head-text" + (isTyping ? " hidden" : "")}
					onClick={handlerClickTitle}
				>
					{titleText || "제목을 입력해 주세요."}
				</div>
				{isTyping && <input className="drag-cancel" placeholder={"제목을 입력해 주세요."} value={titleText}
				ref={inputRef} onChange={inputOnChangeHanddler} onBlur={inputOnBlurHanddler} />}
			</div>
		</_head_>
	)
}
 
const Title2 = ({ card, setCardOption,  type, isSelected}) => {
	const { isPreview, userInfo } = useMainSetting();
	const { resizeCard } = useStage();
	const [options, setOptions] = useState( {} );
	const value = card?.value;

	const isEdit = !isPreview && userInfo.roleId < 4;
	

	const [titleText, setTitle] = useState( value || "");
	const [isTyping, setTyping] = useState(false);

	const inputRef = useRef();

	useEffect(() =>{
		if(isTyping){inputRef.current.focus();}
	},[isTyping]);

	useEffect(() =>{
		if(value)setTitle(value);
	},[value])

	useEffect(() =>{
		if(!isSelected){
			setCardOption({isFixed: false});
		 	setTyping(false);
		}
	},[isSelected]);

	useEffect(() => {
		if(card && card.options)setOptions(card.options);
		else setOptions({});
	},[card])

	const inputOnBlurHanddler = ( ) => {
		const inputVal = inputRef.current.value;
		const newResult = {
			isFixed : false,
			value : inputVal,
		}
		
		setTyping(false);
		setCardOption(newResult);
	}

	const inputOnChangeHanddler = (e) => {
		setTitle(e.target.value)
	}

	const titleClickHandler = ( ) => {
		if(!isEdit)return;
		setCardOption({isFixed: true});
		setTyping(true);
	}

	// 더블클릭시에 텍스트 선택
	const dbClickHandler = (e) => { e.target.select();}

	// 엔터키 눌렀을때 텍스트 선택 해제
	const handlerPressEnter = (e) => {
		if(e.keyCode !== 13)return;
		setCardOption({isFixed: false});
		setTyping(false);
	}

	const align = options?.align || "";
	const mainColor = options?.mainColor || "";

	const style = { color: mainColor || "inherit" }

	return (
		<_head_>
			<div className={type +" title " + align} onDoubleClick={titleClickHandler} >
			{!isTyping && 
				<div  className="head-text">
					{titleText || samples[type]}
				</div>
			}

			{isTyping && 
				<input ref={inputRef} onBlur={inputOnBlurHanddler} value={titleText || ""} 
				onChange={inputOnChangeHanddler} onDoubleClick={dbClickHandler} onKeyDown={handlerPressEnter}/>
			 }
			</div>
		</_head_>
	)
}
// =================================================================================================


const _head_ = styled.div`
	width: 100%; height: 100%;
	font-family: "title";
	display: flex; align-items: center;
	color: ${props => props.color || "inherit"};
	
	.head1{font-size: 48px; 
		.head-text{
			font-size: 48px;
			height: 48px;
		}
		input{
			height: 48px;
		}
	}
	.head2{font-size: 36px; 
		.head-text{
			font-size: 36px;
			height: 36px;
		}
		input{
			height: 36px;
		}
	}
	.head3{font-size: 18px; 
		.head-text{
			font-size: 18px;
			height: 18px;
		}
		input{
			height: 18px;
		}
	}

	.left{text-align: left; justify-content: flex-start; input{text-align: left;} }
	.right{text-align: right; justify-content: flex-end; input{text-align: right;} }
	.center{text-align: center; justify-content: center; input{text-align: center;} }

	.title{
		width: 100%;
		/* min-height: 24px; */
		display: flex;
		align-items: center;

		.head-text{
			width: min-content;
			white-space: nowrap;
		}

		.hidden{
			position: absolute;
			top: -50px;
			opacity: 0;
			height: 0;
		}
		/* input letter-spacing div과 적용이 다른거 같음*/
		input{
			letter-spacing: -0.02em;
			width: 100%;
			background-color: transparent;
			border: none;
			outline: none;
			cursor: text;
		}
	}
`