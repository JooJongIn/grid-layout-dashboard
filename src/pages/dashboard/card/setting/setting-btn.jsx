import { useEffect, useState } from 'react'
import {Svg4Color} from '../../../../component/svg-color'
import selectArrow from '../../../../assets/images/select_arrow.svg'

export const SettingsInput = ({name, options, onBlur, icon}) => {
	const [isTyping, setType] = useState( false );
	const [text, setText] = useState( "" );

	useEffect(() => {
		if(!(options && options[name]))return setText("");
		setText(options[name]);
	},[options])

	const setOption = (e) => {
		setType(false)
		if(onBlur)onBlur(name, e.target.value)
	}

	const handlerOnChange = (e) => {
		setText(e.target.value)
	}

	const handlerClick = (e) => {
		setType(true)
	}

	const handlerKeyDown = (e) => {
		if (e.keyCode !== 13)return; 
		setType(false)
		if(onBlur)onBlur(name, e.target.value)
	}

	return (
		<>
		<div className={'setting-button '} onClick={handlerClick}>
			<button>
				<Svg4Color icon={icon}  />
			</button>
		</div>
		
		{isTyping && 
		<div className='setting-input '>
			<input type="text" value={text} onBlur={setOption} onChange={handlerOnChange} onKeyDown={handlerKeyDown} />
			<button className='enter-icon' onClick={setOption}>
				<Svg4Color icon={enterIcon}  />
			</button>
		</div>}
		</>

	)
}

export const SettingSelect2 = ({options, name, list, onChange, defaultText}) => {
	const [currentValue, setVal] = useState( options[name] || false );
	

	const setOption = (e) => {
		let {value, name } = e.target;
		value = value === "" ? null : value;
		onChange(name, value );
		setVal(value);
	}

	return(
		<>
		<div className='setting-select'>
			<select name={name}  onChange={setOption} value={currentValue}>
				<option selected value={""} > {defaultText || "선택해주세요"}</option>
				{
					list.map((obj)=>{
						const {val, text} = obj;
						const title = text;
						const value = val;

						return <option value={value} key={title + value}>{title}</option>
					})
				}

			</select>
		</div>
		
		</>
	)
}


export const SettingSelect = ({options, name, list, onChange, defaultText}) => {
	// const [currentValue, setVal] = useState( options[name] || false );
	const [currentText, setText] = useState( false );
	const currentValue = options[name] || false;

	const [isOpen, setOpen] = useState(false);

	

	useEffect(()=> {
		if(!(currentValue))return setText(false);
		const obj = list.find(obj => obj.val === currentValue);
		if(!(obj))return setText(false);
		setText(obj.text);
	},[currentValue])

	useEffect(()=> {
		if(isOpen){
			document.addEventListener("click",  closeHandler);

			return () => {
				document.removeEventListener("click", closeHandler);
			}
		}

	},[isOpen])

	const openHandler = (e) => {e.stopPropagation(); setOpen(!isOpen)}
	const closeHandler = (e) => {e.stopPropagation(); setOpen(false)}

	const setOption = (value) => {
		// let {value, name } = e.target;
		value = value === "" ? null : value;
		onChange(name, value );
		// setVal(value);
	}



	return(
		<>
		<div className='setting-select'>
			<div className='select-box-wrap'>
			<div className={'select-box' + (isOpen ? ' open-box' : '')}>
				<div className='select-btn' onClick={openHandler}>
					{currentValue ? currentText : defaultText}
					<div className='select-icon'>
						<Svg4Color icon={selectArrow} />
					</div>
				</div>
				{isOpen && <div className='select-divider' />}
				{isOpen && <div className='select-list'>
					{list.map((obj)=>{
						const {val, text} = obj;
						return <div className='select-item' key={text + val} onClick={()=>setOption(val)}>{text}</div>
					})}
				</div>}
			</div>
			</div>
		</div>
		{/* {isOpen && <div className='select-dim' onClick={()=>setOpen(false)} />} */}
		</>
	)
}



export const MarkButtonOnOff = ({iconOn, iconOff, clickHandler, options, name ,val}) => {
	const current = options[name] || false;
	const isActive = val ? val === current : current;

	const onClick = () => {
		if(val){
			if(val === current) clickHandler(name, false)
			if(val !== current) clickHandler(name, val)
			
		}
		else{
			clickHandler(name, !isActive)
		}
		
	}
	
	return(
		<div className={'setting-button '} onClick={onClick}>
			<button>
				<Svg4Color icon={!isActive ? iconOn : iconOff} />
			</button>
		</div>
	)
}


export const MarkButton = ({icon, clickHandler, options, name ,val}) => {
	const current = options[name] || false;


	const isActive = val ? val === current : current;

	const onClick = (e) => {
		e.preventDefault();
		if(val){
			if(val === current) clickHandler(name, false, e)
			if(val !== current) clickHandler(name, val, e)
			
		}
		else{
			clickHandler(name, !isActive, e)
		}
		
	}




	const opacity = !isActive ? 0.9 : 0.2
	
	return(
		<div className={'setting-button '} onClick={onClick}>
			<button>
				<Svg4Color icon={icon} opacity={opacity} />
			</button>
		</div>
	)
}


export const SettingButton = ({onClick, icon, value}) => {
	const handlerClick = (e) => {
		if(onClick)onClick(value, e);
	}
	
	return (
		<div className='setting-button' onClick={handlerClick}>
			<button>
				<Svg4Color icon={icon}  />
			</button>
		</div>

	)
}

export const SettingButton4Text = ({onClick, name, options, icon, whiteIcon, list}) => {
	const [textColor, setColor] = useState( "#000000" );
	
	useEffect(() => {
		if(!(options && options[name]))return setColor("#000000");
		let colorKey = options[name];
		let color = list[colorKey];
		setColor(color);
		
	},[options])

	const handlerClick = (e) => {
		if(onClick)onClick(name, e);
	}
	const textStyle = {
		// fontWeight :800,
		// // color: textColor
	}
	return (
		<div className='setting-button' onClick={handlerClick}>
			<button style={textStyle}>
			<Svg4Color icon={ textColor === "#ffffff" ? whiteIcon : icon} hex={textColor}  />
			</button>
		</div>

	)
}

export const SettingButton4BorderColor = ({onClick, name, options}) => {
	const [borderColor, setColor] = useState( "#dcdcdc" );

	useEffect(() => {
		console.log('options', options);
		if(!(options && options[name]))return setColor("#b5b5b5");
		let val = options[name];
		setColor(val);
	},[options])

	const handlerClick = (e) => {
		if(onClick)onClick(name, e);
	}
    const borderStyle = {
        border: "4px solid " + borderColor
    }
    
	
	return (
		<div className='setting-button border-btn' onClick={handlerClick}>
			<button  >
                <div className='border-img' style={borderStyle}>

                </div>
			</button>
		</div>

	)
}

export const SettingButton4BackgroundColor = ({onClick, name, options, icon, whiteIcon}) => {
	const [backgroundColor, setColor] = useState( "#dcdcdc" );

	useEffect(() => {
		if(!(options && options[name]))return setColor("#b5b5b5");
		let val = options[name];
		setColor(val);
	},[options])

	const handlerClick = (e) => {
		if(onClick)onClick(name, e);
	}
    
	return (
		<div className='setting-button background-btn' onClick={handlerClick}>
			<button  >
				<Svg4Color icon={backgroundColor === "#ffffff" ? whiteIcon : icon} hex={backgroundColor}  />
                {/* <div className='background-img' style={backgroundStyle}>

                </div> */}
			</button>
		</div>

	)
}
