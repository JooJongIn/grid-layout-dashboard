import React, {useEffect,useRef, useState} from 'react';
import { getShared } from '../../../store';
import { Pagenation } from '../../../component/table';
import {Search} from '../../../component/form'
import magnifyingIcon from "../../../assets/icons/magnifying-glass.png";

import { useStage } from '../../../hook/useStage';
import { useMainSetting } from '../../../hook/useMainSetting';

import { InputComponent } from '../../../component/common';
import { SettingSelect } from './setting/setting-btn';


export function Header({card, isPrint, apiObj, options}) {
	const { setOption4Card, setOption4Content } = useStage(isPrint);
	const {cardId, cardTitle, children} = card;
	const [title, setTitle] = useState( false );
	const [paramArr, setParamArr] = useState( [] );

	const swiperIdx = getShared(`${cardId}-swiperIdx`, false);
	const paramsObj = options?.params || {};

	useEffect(() => {
		const newTitle = apiObj?.querys?.length && swiperIdx !== undefined
			? (apiObj.querys[swiperIdx]?.name || apiObj.title || apiObj.name || cardTitle)
			: (apiObj?.title || apiObj?.name || cardTitle);
		setTitle(newTitle);
	}, [apiObj, swiperIdx, cardTitle]);

	useEffect(() => {
		const paramObj = apiObj?.params;
		if(!(paramObj && typeof paramObj === 'object' ))return setParamArr([]);
        let newArray = []
        for (const key in paramObj) {
            const val = paramObj[key];
			let list = Object.keys(val).map(k =>  ({text:k, val:val[k]}));
			if(list.length !== 0) newArray.push({label: key,  list:list });
        }

        setParamArr(newArray);
	},[apiObj])



	const handlerBlurInputText = (newName) => {
		if(!newName || newName === "")return setOption4Card(cardId, "cardTitle" , cardId);
		setOption4Card(cardId, "cardTitle" ,newName);
	}

	const handlerChangeTypingMode = (target, isTyping) => {
		setOption4Card(cardId, "isFixed" ,isTyping);
		if(!isTyping) return
		target.focus();
		let text = target.value
		let result = (text.length + 5) * 8 ;
		target.style.width = (result > 120 ? result : 120) + 'px'
	}

	const handlerChangeInputText = (target) => {
		const text = target.value;
		let result = (text.length + 5) * 8 ;

		target.style.width = (result > 120 ? result : 120) + 'px'
	}


	const handlerChangeParamSelect = (name, value) => {
		let newParam = {...paramsObj, [name]: value};
		if(value === "")delete newParam[name];
		console.log(name, value, newParam);

		setOption4Content(card.cardId, "params", newParam);
	}
	
	
	
	return (
		<>
		<div className={'card-controller draggable' }>
		<div className={'controller-bar' }>
			<InputComponent value={title || cardTitle} setInputText={handlerBlurInputText} onChangeTypingMode={handlerChangeTypingMode}
			 onChangeText={handlerChangeInputText}  doClose={false} classAdd={["card-title"]} readOnly ={true} />
			{options?.seeHeaderSelect &&<div className='controller-select'>
			 <> 
				{paramArr.map(paramInfo => <ParamSelect name={paramInfo.label} list={paramInfo.list} options={paramsObj} onChange={handlerChangeParamSelect} defaultText={paramInfo.label}/>)}
			</>
			</div>}
			{/* {paramArr.map(paramInfo => <SettingSelect />	) } */}
			
			{/* <div className='card-title' style={titleStyle} onClick={titleClickHandler}
			 
			 >
				{!isTyping && 
					<div >
						{titleText}
					</div>
				}
				{isTyping && 
					<input ref={inputRef} onBlur={inputOnBlurHanddler} value={titleText || ""} 
					onChange={inputOnChangeHanddler}   onDoubleClick={dbClickHandler}/>
				}

			</div> */}
		</div>
		</div>
		</>
	);
}


const ParamSelect = ({name, list, options, onChange, defaultText}) => {
	let value = options[name] || "";

	const handlerChange = (e) => {
		let newValue = e.target.value;
		newValue = isNaN(newValue) ? newValue : newValue;
		onChange(name, newValue);
	}

	return (
		<div className='param-select'>
			<div className='param-select-item'>
				<select name={name} id={name} onChange={handlerChange} value={value} defaultValue={defaultText}>
					<option value="">{value ?  "비우기" : defaultText}</option>
					{list.map(item => <option value={item.val}>{item.text}</option>)}
				</select>
			</div>
		</div>
	)
}




const calLimit = (h) => {
	return (h - 11) / 3;
}