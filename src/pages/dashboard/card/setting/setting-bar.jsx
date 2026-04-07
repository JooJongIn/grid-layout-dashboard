import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
import {
	boldIcon,
	italicIcon,
	underlineIcon,
	rightAlignTextIcon,
	leftAlignTextIcon,
	centerAlignIcon,
	unLinkIcon,
	colorPickerIcon,
	titleOnIcon,
	titleOffIcon,
	paintIcon,
	bgOffIcon,
	bgOnIcon,
	textIcon,
	trwashIcon,
	settingIcon,
	chartBackOnIcon,
	chartBackOffIcon,
	chartLegendOnIcon,
	chartLegendOffIcon,
	leftAlignIcon,
	topAlignIcon,
	linkIcon,
	lineIcon,
	samplePickerIcon,
	sampleDataIcon,
	paddingIcon,
	fullScreenIcon,
	paintWhiteIcon,
	textWhiteIcon,
	filterIcon,
	selectIcon,
	paramIcon,
} from "../../../../ref/icons.jsx";

import { Editor, EditorState, RichUtils, Modifier } from 'draft-js'
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';


import { useStage } from '../../../../hook/useStage';
import { useMainSetting } from '../../../../hook/useMainSetting';

import { _color_picker_ } from '../../../../styles/stage-style';
import { colorList1, color4TextKeyLight, color4TextKeyDark } from '../../../../ref/color';

import {SettingsInput,SettingSelect,MarkButton, SettingButton,SettingButton4Text, SettingButton4BorderColor, SettingButton4BackgroundColor, MarkButtonOnOff} from './setting-btn.jsx';
import { MarkButton4TextFiled, BlockButton4TextFiled, toggleBlock, toggleMark, isBlockActive } from './editor-btn';

import {dataTypes4component, intervalList, divLineWidthList} from './setting-const';

import { ColorPalette } from './color-palette';

import { _setting_bar_ } from '../../../../styles/stage-style'

import { shared } from '../../../../state';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

import { useFullScreen } from '../../../../hook/useFullScreen';

export function SettingBar({card, apiObj, isOpenSidePannel, setOpenSidePannel}) {
	const options = card.options;
	const { setOption4Content, setOption4Card, removeCard}  = useStage();
	const { setFullScreenInfo } = useFullScreen();

	const {userInfo, currentPage } = useMainSetting();

	const settingbarRef = useRef();
	const [currentOptions, setCurrentOptions] = useState( options );
	const [isOpenPalette, setOpenPalette] = useState(false);

	const [paramArr, setParamArr] = useState( [] );

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

	useEffect(() => {
		if(!options)return setCurrentOptions(options);
		setCurrentOptions(options);
	},[options])


	const contentType = card.cardType
	const paramsObj = currentOptions?.params || {};

	const removeCardHandler = () =>{ removeCard(card.cardId); }

	const setCardOptionHandler = (name, value) => { setOption4Card(card.cardId, {[name]:value});}
	const setContentOptionHandler = (name, value) => { setOption4Content(card.cardId, name, value);}
	const setCardParamHandler = (name, value) => {
		let newParam = {...paramsObj, [name]: value};
		setOption4Content(card.cardId, "params", newParam);
	}

	const openColorPalette = (value, e) => { 
		if(value === isOpenPalette)setOpenPalette(false);
		else setOpenPalette(value);
	}

	const moveApiSettingHandler = () => {
		if(!apiObj && !apiObj.id)return;
		let searchParams = new URLSearchParams();
		searchParams.append("domain_id", apiObj.domain_id);
		searchParams.append("api_id", apiObj.id);
		let search =  "?" + searchParams.toString();
        let url = window.location.origin + window.location.pathname;
		
		const {outerWidth, outerHeight, screenLeft, screenTop} = getNewWindowSize();
		
		window.open(
			url + search + "#api", '_blank',
			`width=${outerWidth},height=${outerHeight},left=${screenLeft},top=${screenTop}`
		);
	}

	const isUseData = Object.keys(dataTypes4component).find(type => contentType === type) ;
	const isUseEditor = ["TextField"].find(type => contentType === type);
	const isTitle = ["H1","H2","H3"].find(type => contentType === type);
	const isUsingColor = ["Gauge","DivideGauge","ArcGauge", "H1","H2","H3"].find(type => contentType === type);
	const isLineChart = ["Line"].find(type => contentType === type);
	const isList = ["List"].find(type => contentType === type);

	const isSpace = contentType === "Space";
	const isImg = contentType === "Image";
	const isGraph = contentType === "Bar" || contentType === "Line" || contentType === "Radar" || contentType === "Pie";

	const {settingbarStyle, settingbarAreaStyle} = getSettingBarLocation(card, isUseData, isUseEditor, isTitle);

	const isDarkMode = currentPage?.isDarkMode;
	const color4TextKey = isDarkMode ? color4TextKeyDark : color4TextKeyLight;


	return (
		<>
		<div className='bar-pos-area' style={settingbarAreaStyle}>
			<div className='bar-pos' style={settingbarStyle} ref={settingbarRef}>
			<_setting_bar_>

			<div className='setting-bar'>
				<div className='bar-menu'>
					{isUseEditor && <> <TextEditBar card={card} setOption={setCardOptionHandler} /> </>}

					{isSpace && <Buttons4Space options={options} setContentOptionHandler={setContentOptionHandler} openColorPalette={openColorPalette} />}
					{isTitle && <Buttons4Title options={options} setContentOptionHandler={setContentOptionHandler} openColorPalette={openColorPalette} />}

					{ !( isSpace) && <>
						<DefaultButtons card={card} options={options} setCardOptionHandler={setCardOptionHandler} setContentOptionHandler={setContentOptionHandler} openColorPalette={openColorPalette} isTitle={isTitle} />
					</>}
					{(isUsingColor ) && <> <SettingButton4Text name={"mainColor"} icon={textIcon} whiteIcon={textWhiteIcon} onClick={openColorPalette} options={options} list={color4TextKey} /></>} 

					{isImg &&<> <SettingsInput name="linkUrl" icon={linkIcon} options={currentOptions} onBlur={setContentOptionHandler} /></>}
					{isLineChart && <MarkButtonOnOff name="seeChartGradient" iconOn={chartBackOnIcon} iconOff={chartBackOffIcon} options={currentOptions} clickHandler={setContentOptionHandler} />}
					{isGraph && <MarkButtonOnOff name="seeChartLegend" iconOn={chartLegendOnIcon} iconOff={chartLegendOffIcon} options={currentOptions} clickHandler={setContentOptionHandler} />}
					{isList && <MarkButton name="seeFilter" icon={filterIcon} options={options} clickHandler={setContentOptionHandler}  />}

					{paramArr.length > 0 && <MarkButton name="seeHeaderSelect" icon={paramIcon} options={options} clickHandler={setContentOptionHandler}  />}
					{paramArr.map(paramInfo => <SettingSelect name={paramInfo.label} list={paramInfo.list} options={paramsObj} onChange={setCardParamHandler} defaultText={paramInfo.label}/>	) }
					{isUseData && <SettingSelect name="interval" list={intervalList} options={currentOptions} onChange={setContentOptionHandler} defaultText={"새로고침 주기"}/>}
					
					<div className='bar-divider' />		
					{isUseData && <MarkButton name={"isSampleData"} icon={sampleDataIcon} options={options} clickHandler={setContentOptionHandler} />}
					{apiObj && <SettingButton onClick={ moveApiSettingHandler} icon={settingIcon} />}
					<MarkButton name={"isOpenSidePannel"} icon={fullScreenIcon} options={{isOpenSidePannel:isOpenSidePannel}} clickHandler={(name, value)=>setOpenSidePannel(value)} />
					<SettingButton onClick={removeCardHandler} icon={trwashIcon} />
				</div>
			</div>
			
			{isOpenPalette &&  <ColorPalette dKey={isOpenPalette}  setOption={setContentOptionHandler} onClose={()=>{setOpenPalette(false)}} settingbarRef={settingbarRef} /> }
			</_setting_bar_>
		</div>
		</div>
		
		</>
	);
}


const Buttons4Space = ({options, setContentOptionHandler, openColorPalette, }) =>{




	return(
		<>
		<MarkButton name={"dividingLine"} val={"vertical"} icon={lineIcon} options={options} clickHandler={setContentOptionHandler}  />
		<MarkButton name={"dividingLine"} val={"horizontal"} icon={rightAlignTextIcon} options={options} clickHandler={setContentOptionHandler}  />
		<SettingSelect name="divLineWid" list={divLineWidthList} options={options} onChange={setContentOptionHandler} defaultText={"선 굵기"} />
		<SettingButton value={"mainColor"} icon={colorPickerIcon} onClick={openColorPalette}  />
		</>
	)
}


const Buttons4Title = ({options, setContentOptionHandler}) =>{
	return(
		<>
		<MarkButton name="align" icon={leftAlignTextIcon} options={options} clickHandler={setContentOptionHandler}   val={"left"} />
		<MarkButton name="align" icon={centerAlignIcon} options={options} clickHandler={setContentOptionHandler} val={"center"}  />
		<MarkButton name="align" icon={rightAlignTextIcon} options={options} clickHandler={setContentOptionHandler}  val={"right"} />
		</>
	)
}

const DefaultButtons = ({card, options, setCardOptionHandler, setContentOptionHandler, openColorPalette, isTitle}) =>{
	let seeHeaderSelect = options?.seeHeaderSelect;
	return(
		<>
		<MarkButtonOnOff name="color" iconOn={bgOnIcon} iconOff={bgOffIcon} options={options} clickHandler={setContentOptionHandler} />
		{ (!isTitle && !seeHeaderSelect)  && <MarkButtonOnOff name="isCardHeader" iconOn={titleOnIcon} iconOff={titleOffIcon} options={card} clickHandler={setCardOptionHandler} />}
		{(options  && options.color) && <SettingButton4BackgroundColor name={"bgColor"} icon={paintIcon} whiteIcon={paintWhiteIcon} options={options} onClick={openColorPalette} />}
		</>
	)
}



const TextEditBar = ({card, setOption}) =>{
	const [editorState, setEditorState] = shared(`${card.cardId}-editorState`)
	const [isOpenPalette, setOpenPalette] = useState(false);

	
	const toggleInlineStyle = useCallback((inlineStyle) => {
		const newEditorState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
		// onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
		const selection = newEditorState.getSelection();
		setEditorState(EditorState.forceSelection(newEditorState, selection));
	}, [editorState])

	const alignmentStyles = ['left', 'right', 'center'];
	const applyAlignment = useCallback((newStyle) => {
		let styleForRemove = alignmentStyles.filter(style => style !== newStyle);
		let currentContent = editorState.getCurrentContent();
		let selection = editorState.getSelection();
		let focusBlock = currentContent.getBlockForKey(selection.getFocusKey());
		let anchorBlock = currentContent.getBlockForKey(selection.getAnchorKey());
		let isBackward = selection.getIsBackward();
		let selectionMerge = {
			anchorOffset: 0,
			focusOffset: focusBlock.getLength(),
		};

		if (isBackward) {
			selectionMerge.anchorOffset = anchorBlock.getLength();
		}
		let finalSelection = selection.merge(selectionMerge);
		let finalContent = styleForRemove.reduce((content, style) => Modifier.removeInlineStyle(content, finalSelection, style), currentContent);
		let modifiedContent = Modifier.applyInlineStyle(finalContent, finalSelection, newStyle);
		const nextEditorState = EditorState.push(editorState, modifiedContent, 'change-inline-style');
		// setEditorState(nextEditorState);
		setEditorState(EditorState.forceSelection(nextEditorState, finalSelection));
	}, [editorState]);

	const applyColor = useCallback((name, color) => {
		const selection = editorState.getSelection()
		const nextContentState = Modifier.applyInlineStyle(
		  editorState.getCurrentContent(),
		  selection,
		  `color-${color}`
		)
		setOpenPalette(false);
		const nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
		setEditorState(EditorState.forceSelection(nextEditorState, selection));
	}, [editorState])

	return(<>
	<Toolbar>
    {
      (externalProps) => (
        <div className='icons-toolbar' style={{display: 'flex', alignItems: 'center', height: '100%', color: 'black'}}>
          	<MarkButton name="bold" icon={boldIcon} clickHandler={(name, val, e)=>{ e.preventDefault(); toggleInlineStyle('BOLD')}} options={{}} val={"bold"} />
			<MarkButton name="italic" icon={italicIcon} clickHandler={(e)=>{ toggleInlineStyle('ITALIC')}}  options={{}} val={"italic"} />
			<MarkButton name="underline" icon={underlineIcon} clickHandler={(e)=>{ toggleInlineStyle('UNDERLINE')}}  options={{}} val={"underline"} />

			<MarkButton name="left" icon={leftAlignTextIcon} clickHandler={(e)=>{ applyAlignment('left')}} options={{}} val={"left"} />
			<MarkButton name="center" icon={centerAlignIcon} clickHandler={(e)=>{ applyAlignment('center')}} options={{}} val={"center"} />
			<MarkButton name="right" icon={rightAlignTextIcon} clickHandler={(e)=>{ applyAlignment('right')}} options={{}} val={"right"} />

			<MarkButton name="color" icon={colorPickerIcon} clickHandler={(e)=>{ setOpenPalette("mainColor")}} options={{}} val={"color"} />
			{isOpenPalette &&  <ColorPalette dKey={isOpenPalette}  setOption={applyColor} onClose={()=>{setOpenPalette(false)}} /> }
        </div>
      )
    }
    </Toolbar>
		
		<div className='bar-divider' />	
	</>)
}



const getSettingBarLocation = (card, isUseData, isUseEditor, isTitle) =>{
	const {w,h, x,y} =  card.cardLocation
	
	const barSize = (isUseData ? 3 : 0) + (isUseEditor? 4 : 0) + (isTitle ? -4 : 0);
	
	const positionTop = y < 5 ;
	const positionLeft = x < barSize;
	const positionRight = x + w > (160 - barSize);

	const settingbarStyle = {
		left: (positionLeft && !positionRight) ? "0" : "",
		right: (positionRight && !positionLeft) ? "0" : "",
		top: positionTop ? "3px" : "-43px",
	}

	const settingbarAreaStyle = {
		bottom: positionTop ? "0" : "",
	}

	return {settingbarStyle, settingbarAreaStyle};
}

const getNewWindowSize = () =>{
	let outerWidth = window.outerWidth || 1200;
	let outerHeight = window.outerHeight || 800;
	let screenLeft = window.screenLeft || 200;
	let screenTop = window.screenTop || 200;
	return {outerWidth, outerHeight, screenLeft, screenTop};
}