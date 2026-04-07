import { useEffect, useState, useRef } from 'react'
import {Svg4Color} from "../../../component/svg-color"


import enterIcon from "../../../assets/svg/dashboard-icons/enter.svg";

export const SettingsInput = ({name, options, onBlur}) => {
	const [text, setText] = useState( "" );
    const inputRef = useRef();

	useEffect(() => {
		if(!(options && options[name]))return setText("");
		setText(options[name]);
	},[options])

	const setOption = (e) => {
		if(onBlur)onBlur(name, e.target.value)
	}

	const handlerOnChange = (e) => {
		setText(e.target.value)
	}

	const handlerKeyDown = (e) => {
		if (e.keyCode !== 13)return;
        inputRef.current.blur()
		if(onBlur)onBlur(name, e.target.value)
	}

	return (
		<>
		
		<div className='setting-input '>
			<input type="text" value={text} onBlur={setOption} inputRef={inputRef} onChange={handlerOnChange} onKeyDown={handlerKeyDown} />
			{/* <button className='enter-icon' onClick={setOption}>
				<Svg4Color icon={enterIcon}  />
			</button> */}
		</div>
		</>

	)
}


export const SettingsInputJson = ({name, options, onBlur}) => {
	const [text, setText] = useState( "" );
    const inputRef = useRef();

	useEffect(() => {
		if(!(options ))return setText("{}");
		const json = options;
		if(!(json && JSON.stringify(json)))return setText("{}");
		const str = JSON.stringify(json);
		if(!str)return setText("{}");

		setText(str);
	},[options])

	const setOption = (e) => {
		const val = e.target.value;
		if(!(val && IsJsonString(val)))return alert("구조 틀림");
		
		const json = JSON.parse(val);
		if(onBlur)onBlur(name, json)
	}

	const handlerOnChange = (e) => {
		setText(e.target.value)
	}

	const handlerKeyDown = (e) => {
		if (e.keyCode !== 13)return;
		if(!(val && IsJsonString(val)))return alert("구조 틀림");
        inputRef.current.blur()
		if(onBlur)onBlur(name, e.target.value)
	}

	return (
		<>
		
		<div className='setting-input '>
			<input type="text" value={text} onBlur={setOption} inputRef={inputRef} onChange={handlerOnChange} onKeyDown={handlerKeyDown} />
			{/* <button className='enter-icon' onClick={setOption}>
				<Svg4Color icon={enterIcon}  />
			</button> */}
		</div>
		</>

	)
}

function IsJsonString(str) {
	try {
	  var json = JSON.parse(str);
	  return (typeof json === 'object');
	} catch (e) {
	  return false;
	}
}
export const SettingsArea = ({name, options, onBlur, json}) => {
	const [text, setText] = useState("");
    const inputRef = useRef();
    const textareaRef = useRef();

    useEffect(() => {
        if(!(options && options[name]))return setText("");


		if(json && JSON.stringify(options[name]))setText(JSON.stringify(options[name]));
		else setText(options[name]);

    },[options])

	useEffect(() => {
		
		adjustHeight();
	},[text])

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 20 + 'px';
        }
    }

    const setOption = (e) => {
        if(onBlur)onBlur(name, e.target.value);
    }

    const handlerOnChange = (e) => {
        setText(e.target.value);
    }

    const handlerKeyDown = (e) => {
        if (e.keyCode !== 13)return;
        inputRef.current.blur();
        if(onBlur)onBlur(name, e.target.value);
    }

    return (
        <>
        <div className='setting-input'>
            <textarea 
                ref={textareaRef}
                type="text" 
                value={text} 
                onBlur={setOption}
                inputRef={inputRef}
                onChange={handlerOnChange} 
                onKeyDown={handlerKeyDown}
                rows={1}
                // style={{ resize: 'none', minHeight: '60px' }}
            />
        </div>
        </>
    )
}


export const SettingSelect = ({name, options, list, onChange}) => {
	const [text, setText] = useState(false);
    const [optArr, setArr] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
		console.log('SettingSelect list', list);
        if(!(list && Array.isArray(list)))return setArr([]);
        setArr(list)
    },[list])

	useEffect(() => {
		if(!(options && options[name]))return setText("");
		let val = options[name];
		if(Array.isArray(val))setText(val[0]);
		else setText(val);
	},[options])


	const handlerOnChange = (e) => {
		if(onChange)onChange(name, e.target.value);
		setText(e.target.value);
	}

	return (
		<>
		
		<div className='setting-input '>
			<select value={text} inputRef={inputRef} onChange={handlerOnChange}>
                <option value="">선택해주세요</option>
                {
					optArr.map((obj)=>{
						const title = obj.title;
						const value = obj.value;

						return <option value={value} key={title + value}>{title}</option>
					})
				}
            </select>
			{/* <button className='enter-icon'>
				<Svg4Color icon={enterIcon}  />
			</button> */}
		</div>
		</>

	)
}

const options = {
	"Line":"라인차트",
	"Bar":"바차트",
	"List":"테이블",
	"DivideGauge":"분수형",
	"Pie":"파이차트",
	"Status":"스테이터스게이지",
	"ArcGauge":"아크게이지",
	"Radar":"레이더차트",
	"Gauge":"숫자게이지"
}

export const SettingMultiSelect = ({name, options, list, onChange}) => {
	const [text, setText] = useState("");
    const [optArr, setArr] = useState([]);
	const [checkObj, setCheck] = useState({});

	const [isOpen, setOpen] = useState( false );
    const selectRef = useRef();

    useEffect(() => {
		if(!list)return;
		let keys = Object.keys(list);
		const opts = keys.map(k => {
			const text = list[k];
			return {key: k, text: text};
		})
		setArr(opts);
    },[list])

	useEffect(() => {
		if( !(options && options.components) )return;
		const compos = options.components;
		let newCheck = {};
		
		compos.map((k, idx) => {
			
			
			newCheck[k] = true;
		})

		
		setCheck(newCheck);
	},[options])

	useEffect(() => {
		if(!checkObj)return;
		let newStr = "";
		Object.keys(checkObj).map((k, idx)=> {
			const text = list[k];
			const isTrue = checkObj[k];
			if(!isTrue)return;
			if(idx !== 0)newStr += ', '
			newStr += text;
			
		})
		setText(newStr);
	},[checkObj])

	const handlerOpen = (e) => {setOpen(true);}
	const handlerClose = (e) => {

		setValue()
		setOpen(false);
	}

	const handlerOnChange = (e) => {}
	const setValue = () => {
		let newArr = [];
		Object.keys(checkObj).map((k, idx)=> {
			const isTrue = checkObj[k];
			if(isTrue)newArr.push(k);
		})
		onChange(name, newArr)
	}
	
	const handlerCheck = (name, val) => {
		setCheck({ ...checkObj, [name]: val});
	}

	const optinonContent = optArr.map((opt) => {
		const {key, text} = opt
		const isCheck = checkObj[key];
		return <MultiSelectItem key={key} text={text} id={key} onChange={handlerCheck} checkInit={isCheck} />
	})

	return (
		<>
		
		<div className='multi-select '>
			<div className={'multi-select-box' + (isOpen ? " pocus": "")} ref={selectRef} onClick={handlerOpen}>
				{text}
			</div>
			{isOpen && <div className='multi-select-popover' >
				{/* <div onClick={handlerClose}> close</div> */}
				{optinonContent}
			</div>}

			{isOpen && <div className='multi-select-dim' onClick={handlerClose} />}
		</div>
	
		</>

	)
}

const MultiSelectItem = ({id, text, checkInit, onChange}) => {
	const [isCheck, setCheck] = useState(checkInit);

	useEffect(() => {
		
	},[])

	const handlerChange = (e) => {
		onChange(id, e.target.checked);
		setCheck(e.target.checked);
	}

	return(
		<>
		<label className="select-item">
			<input type="checkbox" onChange={handlerChange} checked={isCheck} />
			<div className='select-label'>{text}</div>
		</label>
		</>
	)
}




export const SettingMultiSelect2 = ({name, options, list, onChange}) => {
	const [text, setText] = useState(false);
    const [optArr, setArr] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
        if(!(list && Array.isArray(list)))return setArr([]);
        setArr(list)
    },[list])

	useEffect(() => {
		console.log("options",options);
		if(!(options && options[name]))return setText("");
		const compos = options[name];
		let newText = '';
		compos.map((item, idx) => {
			if(idx !== 0)newText += ", "
			newText += item;
		})
		setText(newText);
	},[options])


	


	const handlerOnChange = (e) => {
		setText(e.target.value);
	}

	const handlerBlur = (e) => {
		const newText = e.target.value;
		const newArray = newText.split(", ");
		if(!(newArray && Array.isArray(newArray)))return onChange(name, []);
		onChange(name, newArray);
	}

	return (
		<>
		
		<div className='setting-input '>
		<input type="text" value={text} onBlur={handlerBlur} inputRef={inputRef} onChange={handlerOnChange}  />
		</div>
		</>

	)
}



export const SettingCheckbox = ({name, options, onChange}) => {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		if (options && options[name] !== undefined) {
			setIsChecked(options[name]);
		}
	}, [options, name]);

	const handleChange = (e) => {
		const newValue = e.target.checked;
		setIsChecked(newValue);
		if (onChange) {
			onChange(name, newValue);
		}
	};

	return (
		<div className='setting-checkbox'>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleChange}
				id={`checkbox-${name}`}
			/>
		</div>
	);
};


export const SettingSelect4Crud = ({name, options, list, onChange}) => {
	const [text, setText] = useState(false);
    const [optArr, setArr] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
		
        if(!(list && Array.isArray(list)))return setArr([]);
        setArr(list)
    },[list])

	useEffect(() => {
		if(!(options && options[name]))return setText("");
		setText(options[name]);
	},[options])


	const handlerOnChange = (e) => {
		if(onChange)onChange(name, e.target.value);
		setText(e.target.value);
	}

	return (
		<>
		
		<div className='setting-input '>
			<div className='input-box'>
				{text || "선택해주세요"}
			</div>
			<div inputRef={inputRef} className='select-list'>
                <div className='select-item' > 선택해주세요</div>
                {
					optArr.map((obj)=>{
						const title = obj.title;
						const value = obj.value;

						return <div className='select-item' value={value} key={title + value}>{title}</div>
					})
				}
            </div>
			{/* <button className='enter-icon'>
				<Svg4Color icon={enterIcon}  />
			</button> */}
		</div>
		</>

	)
}

