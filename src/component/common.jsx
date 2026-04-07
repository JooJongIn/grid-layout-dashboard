import { Svg4Color } from "./svg-color";
import styled from 'styled-components'
import { cloneElement, createElement, useState, useRef, useEffect } from "react";



export const IconButton = ({Icon, onClick, opacity, hex}) => {
	return(
		<button onClick={onClick} className='icon-button'>
			<Svg4Color icon={Icon} opacity={opacity} hex={hex}/>
		</button>
	)
}




export const ButtonGroup = ({ align, dir,  children}) => {
	const buttons = Array.isArray(children) ? children : [children];

	const justin = justifyObj[align ];



 return( 
		<_button_group_ dir={dir} align={justin}>
			{children}
		</_button_group_>
	)
}



const _button_group_ = styled.div`
	display: flex;
	flex-direction: ${props => props.dir};
	justify-content: ${props => props.align};
	height: 35px;

	.grid-item{
		width: 35px;
		height: 35px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		margin: 0 3px;

		position: relative;

		:hover{
			.grid-item-blur{
				background-color: rgba(255, 255, 255, 0.5);
				filter: blur(2px);
				-webkit-filter: blur(2px);
			}
		}

		.grid-item-blur{
			position: absolute;
			width: 100%;
			height: 100%;
		}

		

		.grid-item-icon{
			max-width: 20px;
			max-height: 20px;
			z-index: 1;
		}
		
	}

	.turnoff{
		opacity: 0.5;
	}

	
	.disabled{
		cursor: default;
		opacity: 0.5;
		:hover{
			.grid-item-blur{
				background-color: transparent;
				filter: blur(0);
				-webkit-filter: blur(0);
			}
		}
	}

	.icon-button{
		width: 35px;
		height: 35px;
		cursor: pointer;
		img{
			max-width: 20px;
			max-height: 20px;

		}
	}

`
const justifyObj = {
	start : "flex-start",
	end : "flex-end",
	center : "center",
	between : "space-between",
	around : "space-around",
}


export const InputComponent = ({value, setInputText, initText, doClose, classAdd, readOnly, onChangeTypingMode, onChangeText }) => {
	const [text, setText] = useState((value && value !== "") ? value : (initText || "입력해주세요"));
	const [isTyping, setTyping] = useState(false);
	const inputRef = useRef();

	useEffect(()=>{
		
		// if(isTyping)onChangeTypingMode(inputRef.current, isTyping)
	},[isTyping])

	useEffect(() =>{
		if(value)setText(value);
	},[value])

	useEffect(() =>{
		if(doClose)setTyping(false);
	},[doClose])


	const handlerSetTypingMode = () => {
		if(readOnly)return;
		setTyping(true);
		onChangeTypingMode(inputRef.current, true)
	}

	const handlerDbClick = (e) => {
		e.target.select()
	}


	const handlerOnBlurInput = ( ) => {
		setTyping(false);
		const inputVal = inputRef.current.value;
		setInputText(inputVal);
		onChangeTypingMode(inputRef.current, false)
	}

	const handdlerOnChangeInput = (e) => {
		setText(e.target.value)
		onChangeText(e.target)
	}

	const handlerPressEnter = (e) => {
		if(e.keyCode !== 13)return;
		setTyping(false);
		onChangeTypingMode(inputRef.current, false)
	}

	const customClassName = classAdd.map(c => " " + c);


	return(
		<div className={"input-component " + customClassName}   onClick={handlerSetTypingMode}>
			{!isTyping && 
			<div className="input-div">
				{text}
			</div>
			}

			{isTyping && 
			 <input className="input-box" ref={inputRef} onBlur={handlerOnBlurInput} value={text || ""} 
			 onChange={handdlerOnChangeInput} onDoubleClick={handlerDbClick} onKeyDown={handlerPressEnter}/>
			}
		</div>
	)
}


























const TestCompo = () => {
	return (
		<div >
			srsrsr
		</div>
	)
}

const SignupForm = ({ className }) => (
  <form className={className}>
    <input className="input" />
    <button className="button">Button</button>
  </form>
);

export const StyleWrap = ({style, children} ) => {
	const [styleStr, setStyle] = useState(parseObjToStr(style));
	if(!children || Array.isArray(children) )return (<></>)
	const CustomCompo = cloneElement(children);
	console.log(CustomCompo);
	// const styleStr = parseObjToStr(style);
	const Form = styled(SignupForm)`
		${styleStr}
		.input {
			background-color: palegreen;
		}
		.button {
			background-color: palevioletred;
		}
	`;

	const CustomStyledTag = styled(`div`)`
	display: flex;
	${styleStr}
	`


	const clickHandler = () => {
		const newStyle = parseObjToStr({
			"background-color": "gray",
			"color": "blue",
		})
		setStyle(newStyle);
	}

	return (
		<>
		<button onClick={clickHandler}>click </button>
		<Form />
		<CustomStyledTag >
			{children}
		</CustomStyledTag>
		</>
	)

}
// withComponent 체크 
const parseObjToStr = (obj) => {
	let styleStr = ""
	if(!obj|| Object.keys(obj).length === 0 )return styleStr;
	for (const styleKey in obj) {
		const styleVal = obj[styleKey]
		styleStr += `${styleKey} : ${styleVal};`
	}

	return styleStr;
}