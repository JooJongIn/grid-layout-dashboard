import { useState, useEffect, useRef } from 'react';

import { SettingsInputJson, SettingsArea } from '../common/input';


import editIcon from "../../../assets/svg/dashboard-icons/tdesign_edit.svg";

export const ParamInputs = ({paramObj, setParam}) => {
    const [paramArray, setParamArray] = useState( [] );

    useEffect(() => {
        console.log("paramObj",paramObj);
        if(!(paramObj && typeof paramObj === 'object' ))return;
        let newArray = []
        for (const key in paramObj) {
            const val = paramObj[key];
            newArray.push({label: key,  option:val });
        }
        setParamArray(newArray);
    },[paramObj])


    const handlerSetTitle = (originKey, newKey) => {
        if(originKey === newKey)return;
        if(paramArray.find(item => item.label === newKey))return;

        let targetParam = paramObj[originKey];
        let newParam = {...paramObj, [newKey]: targetParam}
        delete newParam[originKey];

        setParam("params",newParam)
    }

    const handlerSetParam = (key, value) => {
        let newParam = {...paramObj, [key]: value}
        setParam("params",newParam)
    }


    return (<>
    {paramArray.map(p => <ParamInput key={p.label} {...p} setParam={handlerSetParam} setTitle={handlerSetTitle} />)}
    </>)
}

const ParamInput = ({label, option, setParam, setTitle }) => {
    useEffect(() => {
        // console.log(label, option);
    },[label, option])

    const handlerSetTitle = (newKey) => {
        setTitle(label, newKey)
    }

    const handlerUpdate = (name, val) => {
        setParam(name, val);
    }

    return(<>
    <div className='api-input'>
        <CustomTitle label={label} setTitle={handlerSetTitle}/>
        <SettingsInputJson name={label} options={option} onBlur={handlerUpdate} />
    </div>
    </>)
}


export const QueryAreas = ({queryObj, setQuery}) => {
    const [queryArray, setQueryArray] = useState( [] );

    useEffect(() => {
        if(!(queryObj && typeof queryObj === 'object' ))return;
        let newArray = []
        for (const key in queryObj) {
            const val = queryObj[key];
            newArray.push({label: key,  option:val });
        }
        setQueryArray(newArray);
    },[queryObj])


    const handlerSetTitle = (originKey, newKey) => {
        if(originKey === newKey)return;
        if(queryArray.find(item => item.label === newKey))return;

        let targetQuery = queryObj[originKey];
        let newQuery = {...queryObj, [newKey]: targetQuery}
        delete newQuery[originKey];

        setQuery("queries",newQuery)
    }

    const handlerSetQuery = (key, value) => {
        let newQuery = {...queryObj, [key]: value}
        setQuery("queries",newQuery)
    }


    return (<>
    {queryArray.map(q => <QueryArea key={q.label} {...q} setQuery={handlerSetQuery} setTitle={handlerSetTitle} />)}
    </>)
}

const QueryArea = ({label, setParam}) => {
    
	return (
		<>
		<CustomTitle label={label} setTitle={handlerSetTitle}/>
		<SettingsArea />
		</>

	)
}


export const CustomTitle = ({label, setTitle, placeholder}) => {
    const [isTyping, setIsTyping] = useState( false );
    const [text, setText] = useState( label );
    const inputRef = useRef();

    useEffect(() => {
        if(text !== label)setText(label)
    },[label])

    useEffect(() => {
        if(isTyping)inputRef.current.focus();
    },[isTyping])
    

    const handlerChange = (e) => {
        setText(e.target.value);
    }

    const handlerBlur = (e) => {
        setTitle(e.target.value);
        setIsTyping(false);
    }

    const handlerPressKey = (e) => {
        if (e.keyCode !== 13)return;
        inputRef.current.blur();
    }


    return(
        <>
        {!isTyping && <>
        <img className='small-icon' src={editIcon} />

        <div className='label clickable' title={text} onClick={()=>{setIsTyping(true)}}  >    
            {text || placeholder}
        </div>
        </>}
        {isTyping && <input type="text" ref={inputRef} className='label' value={text} 
        onChange={handlerChange} onBlur={handlerBlur} onKeyDown={handlerPressKey} placeholder={placeholder}/> }
        </>
    )
}