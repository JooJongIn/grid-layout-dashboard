import React, {useState, useEffect, useRef} from 'react';
import {_setting_popup_, _test_, _setting_content_ } from "../../styles/popup-style"

import { useStage } from '../../hook/useStage';
import { useMainSetting, usePages } from '../../hook/useMainSetting';

import { SettingSlider } from './slider'

import { store, useShared } from '../../store';

import { InputComponent } from '../../component/common';

export function SettingPopup({isOpendPopup, setPopupOpend}) {

	const closeHandler = () =>{
		setPopupOpend(false);
	}

	return (
		<>
		{isOpendPopup &&
		<_setting_popup_ wid={460} hig={675} >
			
			<div className='popup'>
                <div className='popup-head'>
                    <div className='title'>설정</div>
                    
                </div>
                <div className='popup-body'>
                    
                    <SettingContents closeHandler={closeHandler}/>
                </div>
			</div>


            <div className='dim' onClick={closeHandler}></div>
		</_setting_popup_>
		
		}
		
		</>
	);
}

const SettingContents = ({closeHandler}) => {
    const {currentPage, changePageOption} = usePages();
	const { userOpt4Local, saveUserOptLocal, uploadBackground } = useMainSetting();
	const [printSize4Dash, setSizeDash] = useShared("printSize4Dash", {})
	const [printSize4Print, setSizePrint] = useShared("printSize4Print", {})

	const [ pageOpt, setPageOpt ] = useState({});
	

	useEffect(() => {
		console.log("pageOpt", pageOpt);
	},[pageOpt])

	useEffect(() => {
		console.log("currentPage", currentPage);
		if(!currentPage)return setPageOpt({});
		const stageSize = currentPage.stageSize;
		const interval = currentPage.interval;
		const rollingInterval = currentPage.rollingInterval;
		const cardTitleSize = currentPage.cardTitleSize;

		setPageOpt({stageSize, interval, rollingInterval, cardTitleSize});
	},[currentPage])
	// useEffect(() => {
	// 	console.log("userOpt4Local", userOpt4Local);
	// },[userOpt4Local])

	const handlerSave = () => {
		changePageOption(pageOpt);
		closeHandler();
	}

    const handlerInputBlur = (key, val) => {
        setPageOpt({ ...pageOpt, [key]: val})
    }

	const handlerUpload = (key, file) => {
		uploadBackground(file, currentPage);
	}

	const handlerButtonSetObj = (key, val) => { setSizeDash({...val}) }

	const handlerInput4UserOpt = (key, val) => {
		console.log("set === ", key, val);
        saveUserOptLocal(key, val)
    }

    return(
    <_setting_content_>
        <div className='setting-subtitle'>화면크기 (px)</div>
		<SettingButtons dKey={"stageSize"} onChange={handlerInputBlur} current={pageOpt} list={stageSizeList} />
		<SettingSlider dKey={"stageSize"} onChange={handlerInputBlur} 
		current={pageOpt} option={{min:1200, max:4096, cap:10, init:1200 }}  suffix={"px"} customZero={"auto"} />
		<div className='divide-sub' />

		<div className='setting-subtitle'>새로고침 주기 (분)</div>
		<SettingButtons dKey={"interval"} onChange={handlerInputBlur} current={pageOpt} list={intervalList} />
		<SettingInput dKey={"interval"} label={"직접입력"} onBlur={handlerInputBlur} suffix={"분"}
		current={pageOpt} defaultVal={60} min={1} />
		<div className='divide-sub' />

		<div className='setting-subtitle'>롤링 주기 (초)</div>
		<SettingButtons dKey={"rollingInterval"} onChange={handlerInputBlur} current={pageOpt} list={rollingIntervalList} />
		<SettingInput dKey={"rollingInterval"} label={"직접입력"} onBlur={handlerInputBlur} suffix={"초"}
		current={pageOpt} defaultVal={20} min={10} max={300} />
		<div className='divide-sub' />

		<div className='setting-subtitle'>위젯 타이틀 사이즈 (px)</div>
		<SettingButtons dKey={"cardTitleSize"} onChange={handlerInputBlur} current={pageOpt} list={cardTitleFontList} />
		<SettingInput  dKey={"cardTitleSize"} label={"직접입력"} onBlur={handlerInputBlur} suffix={"px"}
		 current={pageOpt} defaultVal={16} min={14} max={64} />
		<div className='divide-sub' />




		<div className='btn-area'>
			<div className='text-btn blue' onClick={handlerSave}>
				확인
			</div>

			<div className='text-btn gray' onClick={closeHandler}>
				취소
			</div>
		</div>

		
		{/* <FileUploadButton  dKey={"backgroundImg"} onUpload={handlerUpload} /> */}


		{/* <SettingRadio dKey={"isLoadLocal"} onChange={handlerInput4UserOpt} current={userOpt4Local}
		defaultVal={'false'}
		list={[{val: 'true', text: "컴퓨터에 저장"},{val: 'false', text: "서버에 저장"}]}/> */}
		
		{/* <SettingSwitch dKey={"isServerSync"} onChange={handlerInput4UserOpt} current={userOpt4Local}
		defaultVal={false} label={"서버 싱크"}/> */}
		{/* <div>
		<div className='setting-subtitle'>프린트 사이즈 (mm) </div>
		<div></div>
		</div>
		
		<SettingButtons4ValIsObj dKey={"printSize4Dash"} onChange={handlerButtonSetObj} current={currentPage} list={printSizeList} />
		
		<div className='divide-sub' /> */}


    </_setting_content_>
    )
}


const stageSizeList = [
	{val: false, text: "auto"},
	{val: 1200, text: "1200px"},
	{val: 1920, text: "1920px"},
	{val: 2048, text: "2048px"},
	{val: 3840, text: "3840px"},
	{val: 4096, text: "4096px"}
]

const intervalList = [
	{val: 1, text: "1분"},
	{val: 5, text: "5분"},
	{val: 15, text: "15분"},
	{val: 30, text: "30분"},
	{val: 60, text: "1시간"}
	// {val: 60, text: "1분"},
	// {val: 300, text: "5분"},
	// {val: 900, text: "15분"},
	// {val: 1800, text: "30분"},
	// {val: 3600, text: "1시간"}
]


const rollingIntervalList = [
	{val: 10, text: "10초"},
	{val: 20, text: "20초"},
	{val: 30, text: "30초"},
	{val: 60, text: "1분"},
	{val: 120, text: "2분"},
	{val: 300, text: "5분"}
]

const cardTitleFontList = [
	{val: 14, text: "14px"},
	{val: 16, text: "16px"},
	{val: 18, text: "18px"},
	{val: 20, text: "20px"},
	{val: 24, text: "24px"},
	{val: 32, text: "32px"}
]

const printSizeList = [
	{val: {wid: 290, hig: 210}, text: "A4"},
	{val: {wid: 297, hig: 420}, text: "A3"},
	{val: {wid: 216, hig: 279}, text: "letter"},
]



const SettingButtons = ({dKey, onChange, current, list}) => {
	const handlerClick = (e, val) => {
		onChange(dKey, val)
	}

	return(
	<>
		<div className='btns-area'>
			{list.map(li => <div className='btn' onClick={(e)=>handlerClick(e, li.val)} > {li.text} </div>)}
		</div>
	</>)
}

const SettingButtons4ValIsObj = ({dKey, onChange, current, list}) => {
	

	const handlerClick = (e, val) => {
		onChange(dKey, val)
	}

	return(
	<>
		<div className='btns-area'>
			{list.map(li => <div className='btn' onClick={(e)=>handlerClick(e, li.val)} > {li.text} </div>)}
		</div>
	</>)
}


const SettingInput = ({label, dKey, onChange, onBlur, current, defaultVal, min, max, suffix}) => {
	const [value, setValue] = useState("");

    useEffect(() => {
        if(!(current && current[dKey]))return;
		
        setValue(current[dKey]);
    },[current])

	const handlerChange = (e) => {
		if(!e.target)return;
		let val = e.target.value;
		

		setValue(val);
		if(onChange)onChange(dKey, val);
	}

	const handlerBlur = (e) => {
		let val = e.target.value;
		if(!isNaN(val))val = +val;
		if(!isNaN(max) && val > max)val = max;
		if(!isNaN(min) && val < min)val = min;

		setValue(val);
		if(onBlur)onBlur(dKey, val);
	}


	return(
		<div className="input-container">
			{label && <label className="input-label">{label}</label>}
			<div className="input-box">
				<input value={value}  onBlur={handlerBlur} onChange={handlerChange} placeholder={defaultVal} /> 
				
			</div>
			{suffix && <div className='suffix'>
				{suffix}
			</div>}
	  	</div>
	)
}


const SettingSwitch = ({label, dKey, onChange, onBlur, current, defaultVal, list}) => {
	const [value, setValue] = useState(current[dKey] || defaultVal);

    useEffect(() => {
		console.log(current, dKey, list);
        if(!(current && current[dKey]))return;
		
        setValue(current[dKey]);
    },[current])

	const handlerChange = (e) => {
		if(!e.target)return;
		setValue(e.target.checked);
		if(onChange)onChange(dKey, e.target.checked);
	}


	return(
		<div className="input-container switch-container">
			<div className='input-label'>
				{label}
			</div>
			<label class="switch">
				
				<input type="checkbox" onChange={handlerChange} checked={value} />
				<span class="slider round"></span>
			</label>
	  	</div>
	)
}

const SettingRadio = ({label, dKey, onChange, onBlur, current, defaultVal, list}) => {
	const [value, setValue] = useState(current[dKey] || defaultVal);

    useEffect(() => {
		console.log(current, dKey, list);
        if(!(current && current[dKey]))return;
		
        setValue(current[dKey]);
    },[current])

	const handlerChange = (e) => {
		if(!e.target)return;
		setValue(e.target.value);
		if(onChange)onChange(dKey, e.target.value);
	}


	return(
		<div className="input-container">

			{list.map(li =>	<label>
				{li.text}
				<input type="radio" 
				onChange={handlerChange}
				defaultChecked={value === (li.val )}
				name={dKey} value={li.val} />
			</label>)}
	  	</div>
	)
}


const FileUploadButton = ({dKey, onUpload}) => {
	const [currentFile, setFile] = useState(null);
	// const [backgroundImg, setBackImg] = useShared("backgroundImg", null);

	useEffect(() => {
		
	},[])

	const handlerFileChange = (e) => {
		if(!(e.target && e.target.files && e.target.files[0]))return alert("파일을 선택해주세요.");		
		const targetFile = e.target.files[0];
		const fileType = targetFile.type;

		if(fileType.indexOf("image") === -1 && fileType.indexOf("video") === -1)return alert("이미지 또는 비디오 파일만 업로드 할 수 있습니다.");
		setFile(targetFile);
	}

	const handlerUpload = () => {
		if(!onUpload)return;
		onUpload(dKey, currentFile);
	}

	return(<>
		<div className='file-upload-container'>
			<label htmlFor="file-upload" className='file-btn'>파일 선택</label>
			<input id="file-upload" type="file" name="back" onChange={handlerFileChange} style={{display: 'none'}}/>
			{currentFile && <div className='file-name'> {currentFile.name} </div>}
			<button className='file-btn' onClick={handlerUpload}>업로드</button>
		</div>
	</>)

}


