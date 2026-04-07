import React, {useEffect, useState, useRef} from 'react';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { _dashboard_, _appbar_, _non_user_btns_, _version_btns_ } from '../styles/stage-style';
import { _leftpannel_layout_ }  from '../styles/layout'

import { useStage } from '../hook/useStage';
import { useLayoutData } from '../hook/useLayoutData';
import { useMainSetting, Control4Earth, usePages } from '../hook/useMainSetting';
import { control4MainApis, Control4Apis } from '../hook/useApi'
import { Control4CardConfigRefresh, Controls4CardConfig } from '../hook/useCardConfig'
import { useDerived } from '../hook/useDerived'

import Appbar from './dashboard/appbar/appbar';
import { Stagecontent } from './dashboard/stage';
import { SettingPopup } from './setting-popup/main-setting'
import { CssEditorPopup } from './dashboard/css-editor/editor-popup';
import { BackEarth, BackStage } from './background/back-stage';

import { ApiSettingPopup } from './api-setting/api-setting'
import {Svg4Color} from '../component/svg-color'


import { HistoryManager } from './history'

import { getShared, useShared,  } from '../store';

import floatBtnImg from '../assets/img/float-btn.png'
import logoutIcon from '../assets/svg/dashboard-icons/logout.svg'
import loadIcon from '../assets/svg/dashboard-icons/heroicons-outline_save.svg'
import PreviewIcon from "../assets/svg/dashboard-icons/presentation.svg";
import PenIcon from "../assets/svg/dashboard-icons/pen-to-square.svg";

import { ComponentPopver } from './quickmenu/compopnent-popover'

import { stageCol, cellHeight } from '../ref/stage-setting'

import { saveLocalData } from './utils'

import { FlaotBtn4Print } from './print/print-float-btn'
import { PrintStage } from './print/print-stage'

import { Control4Swiper } from './dashboard/card/swiper'

import { onPost,onPostImage } from './utils'

import { useThemeMode } from '../provider/MainProvider'

import { dashobardDBUrl } from '../ref/url'

import { DerivedPopup } from './dashboard/derived-popup'
import { FullScreenPopup } from './dashboard/fullscreen-popup'
import { AlarmPopup } from '../component/alarm-popup'


export function Dashboard() {
	const {currentPageId, currentPage, getLayouts} = usePages();
	const { userInfo, stageSize, isPreview, setSize, changeCurrentPage } = useMainSetting();
	const { theme, mode } = useThemeMode();
	
	const { selectCard, setStageCards, multiSelectCard } = useStage();
	const { loadSnapshot } = useLayoutData();

	const {derivedInfo} = useDerived();
	const [fullScreenInfo] = useShared("fullScreenInfo", false);

	const [isOpendPopup , setPopupOpend  ] = useState(false);

	const [stageIsStatic, setStatic] = useState(true);
	const [isShow, setShow] = useState( false );


	const historyObj = getShared("layout-history" );

	const stageRef = useRef();
	const bodyRef = useRef();

	const {roleId} = userInfo;

	const [cellSize, setCellSize] = useState({wid:20, hig:cellHeight})
	useEffect(() => {
		if(!stageSize)return;
		setCellSize({wid: stageSize/ stageCol, hig: cellHeight})
	},[stageSize])

	useEffect(()=>{ getLayouts();},[userInfo])

	useEffect(()=>{
		if(!(currentPage && Object.keys(currentPage).length !== 0))return;
		const currentStageSize = currentPage["stageSize"];

		if(currentStageSize){
			setSize(+currentStageSize)
			setStatic( true );
		}else{ setStatic( false );}
	},[currentPage])

	useEffect(() => {
		if(currentPageId)setShow(true)
		else return setShow(false)
		// getImage(currentPageId);
		setStageCards({});

		let cardPromise = loadSnapshot();
		changeCurrentPage(currentPageId);
		

		if(historyObj){
			historyObj.emptyHistory();
			cardPromise.then(cards => {
				historyObj.addHistroy(cards);
			})
		}
		saveLocalData("currentPageId", currentPageId);
	},[currentPageId]);

	const onClickBackStage = (event) => {
		const targetClassName = event.target.className;
		if(typeof targetClassName !== 'string')	return
		const result = targetClassName.search("react-grid-layout");
		const result2 = targetClassName.search("dark");
		const result3 = targetClassName.search("light");
		const result4 = targetClassName.search("stage-content");
		
		if(result >= 0 || result2 >= 0 || result3 >= 0 || result4 >= 0 ){
			unSelect();
		}
	}

	const unSelect = () =>{
		selectCard(null)
		multiSelectCard(null);
	}
	
	const isSuperUser = (roleId && roleId <= 3);
	const isShowAppbar = ( !isPreview);


	return (
	<>
		<div id='main' className={'main-container ' + theme} ref={bodyRef} >
		<Control4History historyId={"layout-history"} setStageCards={setStageCards} />
		{/* <PasteHandler appendCard4Html={appendCard4Html} /> */}
		{currentPage && <Control4CardConfigRefresh />}
		{currentPage && <Controls4CardConfig />}
		<Control4Swiper />

		{isShow && <_dashboard_ stageSize={stageSize} isBorder={(stageIsStatic)} stageCol={stageCol} cellSize={cellSize} >
			<Control4Earth />
			<Control4Apis />
			{isOpendPopup && <SettingPopup isOpendPopup={isOpendPopup} setPopupOpend={setPopupOpend} />}
			

			<div className='main-page'  onClick={onClickBackStage}  >
				<BackStage />
				{isShowAppbar && <Appbar setPopupOpend={setPopupOpend} unSelect={unSelect} />}
				{!isShowAppbar && <NomalUserBtns unSelect={unSelect} isSuperUser={isSuperUser} />}
				{/* <VersionButton  /> */}
				<MainContent stageRef={stageRef} stageIsStatic={stageIsStatic} currentPage={currentPage} bodyRef={bodyRef} unSelect={unSelect} />
			</div>

			<CssEditorPopup />
	
		</_dashboard_>}

		{derivedInfo && <DerivedPopup />}
		{fullScreenInfo && <FullScreenPopup />}
		<AlarmPopup />
		</div>
	</>
	);
}


const MainContent = ({stageRef, stageIsStatic, currentPage, bodyRef, unSelect}) => {
	const { stageSize, isGrid, setSize } = useMainSetting();
	const { selectedCardId, removeCard } = useStage();

	const [isPrint, setPrintMode] = useShared( "isPrint", false );
	

	// stage resize
	useEffect(()=>{
		const handlerResize = () => {
			let windowWid = Math.max(window.innerWidth, 1600);
			const size = Math.round(windowWid);
			setSize(size);
		}

		if(!stageIsStatic){
			handlerResize();
			window.addEventListener("resize", handlerResize)
		}

		return () => window.removeEventListener("resize",handlerResize);
	},[stageIsStatic]);




	useEffect(() => {
		window.addEventListener("keydown", deleteCard)

		return () => window.removeEventListener("keydown",deleteCard);
	},[selectedCardId])
	
	const deleteCard = (e) => {
		if(!(e.code === "Delete" ))return;
		if(!selectedCardId)return;
		removeCard(selectedCardId)
	}

	const isDarkMode = currentPage?.isDarkMode;


	return (
	<>
	<FlaotBtn4Print stageRef={stageRef} currentPage={currentPage} bodyRef={bodyRef} unSelect={unSelect} />

	<div id='stage-main-contant' className='stage-content'>
		<Stagecontent stageRef={stageRef} 
		stageSize={stageSize} uploadImage={uploadImage}
		/>
		<div className={'border-for-stage' + (isDarkMode ? ' dark-mode' : '') + (isGrid ? ' grid-line' : '') + (isPrint ? ' print-back-border' : '')}></div>
		{/* <div className={'border-for-stage' + (isPreview ? ' grid-line' : '') }></div> */}
	</div>
	</>
	)
}


const NomalUserBtns = ({unSelect, isSuperUser}) => {
	const { logout, userOpt4Local, userInfo, saveUserOptLocal, onChangePreview } = useMainSetting();
	const { loadSnapshot } = useLayoutData();
	const { theme, mode } = useThemeMode();

	const dataLoad = () => {
		unSelect();
		loadSnapshot();
	}

	const handlerInput4UserOpt = (key, val) => {
		console.log("set === ", key, val);
        saveUserOptLocal(key, val)
    }

	const handlerPreview = () => {
		onChangePreview();
	}
	 
	useEffect(() => {
		console.log("userInfo", userInfo);
	},[userInfo])

	let hex = theme === "dark" ? "#fff" : "#000";



	return(
	<>
		<_non_user_btns_ >
			<div className='non-user-btns'>
			{/* <SettingSwitch dKey={"isServerSync"} onChange={handlerInput4UserOpt} current={userOpt4Local}
			defaultVal={false} label={"서버 싱크"}/> */}
			<div onClick={handlerPreview} className='icon-btn'>
				<Svg4Color icon={PenIcon} hex={hex} />
			</div>
			{/* <IconBtn onClick={dataLoad} icon={loadIcon} />  */}
			{/* <IconBtn onClick={logout} icon={logoutIcon} />  */}
				<div onClick={logout} className='icon-btn'>
					<Svg4Color icon={logoutIcon} hex={hex} />
				</div>
			</div>
		</_non_user_btns_>
	</>
	)
}

const VersionButton = ({}) => {
	const { currentPage } = useMainSetting();
	

	return(
		<_version_btns_ dark={currentPage?.isDarkMode}>
			<div className='version-btn' >
				<a target="_blank" href="https://docs.google.com/spreadsheets/d/12Hg_dOqnb7V8k2oGaI7-QqWBmK4jt5C3bX4NnqLXCvc/edit?gid=1209147597#gid=1209147597">
				v3.3e.0512
				</a>
			</div>
		</_version_btns_>
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

const ComponentQuickMenu = ({}) => {
	const [isOpen, setOpen] = useState(false);

	const handlerClose = (e) => { setOpen(false)}
	const handlerOpen = (e) => { setOpen(true)}

	return(
		<>
			{!isOpen && <div className='float-btn' onClick={handlerOpen}>
				<img src={floatBtnImg} alt="" />
			</div>}
			{isOpen && <ComponentPopver closeModal={handlerClose} isPopoverOpen={isOpen} />}
		</>
	)
}

const Control4History = ({historyId, setStageCards}) => {
	const [history, setHistoryObj] = useShared(historyId);
	
	useEffect(() => {
		const historyObj = new HistoryManager();
		setHistoryObj(historyObj);
	},[]);

	useEffect(() => {
		if(!history)return;

		const handlerKeydown = (e) => {
			if(e.ctrlKey && e.key === "z"){
				const newLayout = history.undo();
				if(newLayout)setStageCards(newLayout);
			}else if(e.ctrlKey && e.key === "y"){						
				const newLayout = history.redo();
				if(newLayout) setStageCards(newLayout);
			}
		}

		window.addEventListener("keydown", handlerKeydown);

		return () => {
			window.removeEventListener("keydown", handlerKeydown);
		}
	},[history, setStageCards]);

	return null;
}



// const registerEvent = function() {
// 	// 만일 textarea요소에 해당 클래스명이 있으면 리턴
//     if ($textarea.classList.contains('once1')) return; 

//     $textarea.classList.add('once1');

//     // 이벤트 핸들러 등록
//     $textarea.addEventListener('drop', handleDrop);
//     $textarea.addEventListener('paste', handlePaste);
// }

// ==============================================================================================================================
// ==============================================================================================================================
// ==============================================================================================================================


var global = {
	aInternal: 10,
	aListener: function(val) {},
	set group(val) {
		this.aInternal = val;
		this.aListener(val);
	},
	get group() {
	  return this.aInternal;
	},
	registerListener: function(listener) {
		this.aListener = listener;
	}
};

const uploadImage = async (file, currentPage) => {
	const formData = new FormData();
	formData.append("images", file);
	formData.append("snapshotId", currentPage.id);
	console.log("img upload", file);

	return await onPostImage(`${dashobardDBUrl}/uploadImage`, formData)
}

const getImage = async (currentPageId) => {
	let body = {
		snapshotId: currentPageId
	};

	const result = await onPost(`${dashobardDBUrl}/getImage`, body);
	return result
}