import React, {useState, useEffect, cloneElement} from "react";
import styled from 'styled-components'
import { _popup_ } from "../../../styles/popup-style"

import { onPost } from '../../utils'
import { dashobardDBUrl } from '../../../ref/url'
import { usePages, useMainSetting } from '../../../hook/useMainSetting'

import { onPostImage } from '../../utils'

import { Svg4Color } from '../../../component/svg-color'
import xCloseIcon from '../../../assets/svg/dashboard-icons/x_close.svg'
import undoIcon from "../../../assets/svg/dashboard-icons/undo-circle.svg";
import redoIcon from "../../../assets/svg/dashboard-icons/redo-circle.svg";
import gridIcon from "../../../assets/svg/dashboard-icons/f7_grid.svg";
import imageRemoveIcon from "../../../assets/svg/dashboard-icons/gridicons_image-remove.svg";

import UploadIcon from "../../../assets/images/ico_upload.svg";
import CheckedIcon from "../../../assets/images/ico_checked.svg";

import videoIcon from "../../../assets/svg/dashboard-icons/lets-icons_video-fill.svg";
// import videoIcon from "../../../assets/svg/dashboard-icons/lets-icons_video-light.svg";



export const BackgroundPopover = ({ close}) => {
    const {currentPage, getLayouts, refreshCurrentPage} = usePages();
    const [selectedId, setSelect] = useState( null );


    const [isChecked4DarkMode, setChecked4DarkMode] = useState( false );
    const [isChecked4EarthMode, setChecked4EarthMode] = useState( false );

    useEffect(() => {
        if(currentPage && currentPage.isDarkMode) setChecked4DarkMode('true');
        else setChecked4DarkMode('false');
    },[currentPage])

    useEffect(() => {
        if(currentPage && currentPage.backgroundMode) setChecked4EarthMode(currentPage.backgroundMode);
        else setChecked4EarthMode(false);
    },[currentPage])

    const updateBackground = async () => {
        let body = {
            snapshotId: currentPage.id,
            isDarkMode: isChecked4DarkMode === 'true' ? true : false,
        }

        if(isChecked4EarthMode) body["backgroundMode"] = isChecked4EarthMode;
        if(selectedId)body["backgroundId"] = selectedId;
        else delete body.backgroundId;
        const result = await onPost(dashobardDBUrl + '/selectBackground', body);
        refreshCurrentPage();
        close();
    }

    const selectBackImg= (id) => {
        setSelect(id);
        setChecked4EarthMode(false);
    }

    const handlerChangeMode4DarkMode = (name, val) => { setChecked4DarkMode( val);}
    const handlerChangeMode4EarthMode = (name, val) => { setChecked4EarthMode(val); setSelect(null);}

    return(
        <>
        <div class="set_layer bg_setbox">
        
        <div class="setting_box bd_bottom">
            <RadioGroup name="isDarkMode" title="텍스트 컬러모드" current={isChecked4DarkMode} onChange={handlerChangeMode4DarkMode}>
                <RadioItem value={'false'} label="라이트모드"/>
                <RadioItem value={'true'} label="다크모드"/>
            </RadioGroup>

            <RadioGroup name="backgroundMode" title="지도 모드" current={isChecked4EarthMode} onChange={handlerChangeMode4EarthMode} isPossibleEmpty={true} >
                <RadioItem value={'earth'} label="지구본"/>
                <RadioItem value={'map'} label="지도"/>
            </RadioGroup>


            {/* <p class="setting_title">텍스트 컬러모드</p>
            <ul class="rdo_list">
                <li><input type="radio" id="mode_chg1" name={"isDarkMode"} class="rdo_header" value={"light"} onChange={handlerChangeMode} checked={!isChecked} /> <label for="mode_chg1">라이트모드</label></li>
                <li><input type="radio" id="mode_chg2" name={"isDarkMode"} class="rdo_header" value={"dark"} onChange={handlerChangeMode} checked={isChecked} /> <label for="mode_chg2">다크모드</label></li>
            </ul>
            <p class="setting_title">지구 모드</p>
            <ul class="rdo_list">
                <li><input type="radio" id="mode_chg1" name={"isDarkMode"} class="rdo_header" value={"light"} onChange={handlerChangeMode} checked={!isChecked} /> <label for="mode_chg1">라이트모드</label></li>
                <li><input type="radio" id="mode_chg2" name={"isDarkMode"} class="rdo_header" value={"dark"} onChange={handlerChangeMode} checked={isChecked} /> <label for="mode_chg2">다크모드</label></li>
            </ul> */}
        </div>
        <div class="setting_box mt16">
            
            <BackgroundList currentPage={currentPage} getLayouts={getLayouts} refreshCurrentPage={refreshCurrentPage} 
            selectedId={selectedId} setSelect={selectBackImg}  />
        </div>
        <div class="pop_btns">
            <button class="edit_btn b_blue" onClick={updateBackground}>확인</button>
            <button class="edit_btn b_gray" onClick={close}>취소</button>
        </div>
        
    </div>
        </>
    )
}

const RadioGroup = ({name, title, children, current, onChange, isPossibleEmpty}) => {
    const handlerChangeMode = (e) => {
        onChange(name, e.target.value);
    }

    const handlerCancel = (e) => {
        if(isPossibleEmpty && current === e.target.value)onChange(name, false);
    }

    return(<>
    <p class="setting_title">{title}</p>
    {children &&<ul class="rdo_list">
         {Array.isArray(children) ? children.map((child, index) => (
            cloneElement(child, {
                onChange: handlerChangeMode,
                current: current,
                name: name,
                onClick: isPossibleEmpty ? handlerCancel : null,
                index: index,
            })
         )) : children}
    </ul>}
    </>)
}


const RadioItem = ({name, value, label, onChange, current, onClick, index}) => {
    const clickEvent = (e) => {
        if(onClick)onClick(e);
    }

    return(<>
    <li>
        <input type="radio" id={name + index} name={name} class="rdo_header" value={value} onChange={onChange} onClick={clickEvent} checked={ current === value} /> 
        <label htmlFor={name + index}>{label}</label>
    </li>
    </>)
}



const MenuButton = ({text, icon, onClick}) => {
    return(
        <>
        
        {text && <div>{text}</div>}
        {icon && <img src={icon} alt="" />}
        </>
    )
}



const BackgroundList = ({selectedId, setSelect, currentPage, getLayouts, refreshCurrentPage}) => {
    const [backgrounds, setBackgrounds] = useState( [] );
    const [isLoading, setLoading] = useState( false );
    const {userInfo} = useMainSetting();

    const  {roleId} = userInfo;
    const isSuperUser = roleId <= 3;
    // 수정시 리프레시 필요

    useEffect(() => {
        if(currentPage && currentPage.background) setSelect(currentPage.background.id);
    },[currentPage])

    useEffect(() => { getBackgrounds();}, []);

    const getBackgrounds = async () => {
        setLoading(true);
        const result = await onPost(dashobardDBUrl + '/getBackgrounds', {});
        setLoading(false);
        if(!(result && result.row))return
        setBackgrounds(result.row);
    }

    

    const addBackground = () => {
        const fileInput = document.createElement('input');
        fileInput.name = 'backgroundUpload';
        fileInput.type = 'file';
        fileInput.accept = 'image/*, video/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            const data = await uploadImage(file, currentPage);
            getBackgrounds();
        };
        fileInput.click();
    }

    const handlerDel = async (e) => {
        const target = backgrounds.find(back => back.id === selectedId);
        if(!target)return;
        let body = {
            backgroundId: selectedId,
            path: target.path,
            thumbnail_path: target.thumbnail_path,
        }

        const result = await onPost(dashobardDBUrl + '/deleteBackground', body);
        getBackgrounds();
    }

    const handlerUnselect = () => {
        setSelect(null);
    }

    return(<>
    <p class="setting_title">
        배경 이미지 선택
        <span class="align_right">
            <button class="btn_upload b_blue" onClick={addBackground}><img src={UploadIcon} alt="" />업로드</button>
            <button class="btn_delete line_gray" onClick={handlerDel} >삭제</button>
        </span>
    </p>
    <div className="bg_selector">
        {backgrounds.map((background) => (
            <BackgroundItem key={background.id} background={background}
             selectedId={selectedId} setSelect={setSelect}
             />
        ))}
        {isLoading && <BackgroundItem key={"add"} background={{}} selectedId={selectedId} setSelect={()=>{} }/>}
        {!isLoading && <BackgroundUnselect onCLick={handlerUnselect}/>}

        {/* {isSuperUser && <BackgroundAdd currentPage={currentPage} refresh={getBackgrounds} />} */}
    </div>
    </>)
}

const BackgroundItem = ({background, selectedId, setSelect}) => {
    const [isSelected, setSelected] = useState( false );

    const [bPath, setPath] = useState( false );
    const [bFileType, setFileType] = useState( false );
    const [bFileName, setFileName] = useState( "" );

    useEffect(() => {
        if(selectedId === background.id) setSelected(true);
        else setSelected(false);
    },[selectedId])
    
    useEffect(() => {
        if(!background)return;
        const { id, path, file_type, thumbnail_path, file_name } = background;
        if(path && file_type === "image"){ setPath(dashobardDBUrl + thumbnail_path);}
        if(path && file_type === "video"){ setPath(dashobardDBUrl + path);}
        if(file_type){ setFileType(file_type);}
        if(file_name){ setFileName(file_name);}
        
    }, [background]);

    // useEffect(() => {
    //     if(!(currentPage && currentPage.background && background))return;
    //     let currentBack = currentPage.background;
    //     setSelected(currentBack.id === background.id);
    // },[currentPage, background]);

    const handlerClickItem = async (e) => {
        setSelect(background.id);
    }



    return(<>
    <dl className={"bg_unit" + (isSelected ? " checked_on" : "")} onClick={handlerClickItem} >
        <dt className="base_bg1">
        {bFileType === "video" && <div style={{right: "10px", top: "2px",  position:'absolute', width: "20px", height: "20px"}}> 
            <Svg4Color icon={videoIcon} hex={"#fff"} opacity={1} className={"icon-img"}   />
        </div>}
        {bPath && (<>
        {bFileType === "image" && <img src={bPath} alt="background" />}
        {bFileType === "video" && <video src={bPath} alt="background" />}
        </>)}
        </dt>
        <dd>{bFileName}</dd>
    </dl>
    </>)
}
const BackgroundUnselect = ({onCLick}) => {




    return(<>
    <dl className={"bg_unit" } onClick={onCLick} >
        <dt className="base_bg1" style={{background: "none"}}>
            <img src={imageRemoveIcon} alt="background" style={{width: "100%", height: "100%", opacity: 0.3}} />
        </dt>
    </dl>
    </>)
}

const BackgroundAdd = ({currentPage, refresh}) => {

    const addBackground = () => {
        const fileInput = document.createElement('input');
        fileInput.name = 'backgroundUpload';
        fileInput.type = 'file';
        fileInput.accept = 'image/*, video/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            const data = await uploadImage(file, currentPage);
            refresh();
        };
        fileInput.click();
    }

    return(<>
    <div className="background-item background-add" onClick={addBackground}>
        add
    </div>
    </>)
}

const uploadImage = async (file, currentPage) => {
	const formData = new FormData();

	const fileType = file.type.split('/')[0];
	formData.append("backgroundUpload", file);
	// formData.append("snapshotId", currentPage.id);
	formData.append("fileType", fileType);
	console.log("img upload", file);

	return await onPostImage(dashobardDBUrl + "/uploadBackground", formData, "background");
}