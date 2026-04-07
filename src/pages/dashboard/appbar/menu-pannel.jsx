import React,{ useState , useEffect, useRef, useCallback, cloneElement } from 'react';

import styled from 'styled-components'

import { getShared } from '../../../store';
import { useStage } from '../../../hook/useStage';
import { useMainSetting, usePages } from '../../../hook/useMainSetting';
import { useLayoutData } from '../../../hook/useLayoutData';

import { onPost, onPostImage } from '../../utils'
import { dashobardDBUrl } from '../../../ref/url'

import {_popover_} from '../../../styles/stage-style'

import {_appbar_} from '../../../styles/appbar-style'
import {_component_pannel_, _prop_pannel_ } from '../../../styles/pannel-style'

import { SnapshotPagenation } from './snapshot-pagenation'
import { Svg4Color } from '../../../component/svg-color'

// import undoIcon from "../../../assets/svg/dashboard-icons/undo-circle.svg";
// import redoIcon from "../../../assets/svg/dashboard-icons/redo-circle.svg";
// import gridIcon from "../../../assets/svg/dashboard-icons/f7_grid.svg";
// import settingIcon from "../../../assets/svg/dashboard-icons/uil_setting.svg";
// import UserIcon from "../../../assets/svg/dashboard-icons/account.svg"
// import xCloseIcon from '../../../assets/svg/dashboard-icons/x_close.svg'

import { ComponentButtons } from './component-for-appbar'
import { BackgroundPopover } from './back-modal'

import radioUncheckedIcon from '../../../assets/img/radio_unchecked.svg'
import radioCheckedIcon from '../../../assets/img/radio_checked.svg'
import logoutIcon from "../../../assets/svg/dashboard-icons/logout-new.svg";

import BackgroundIcon from "../../../assets/images/ico_background.svg";
import UploadIcon from "../../../assets/images/ico_upload.svg";
import CheckedIcon from "../../../assets/images/ico_checked.svg";
import SaveIcon from "../../../assets/images/ico_save.svg";
import RefreshIcon from "../../../assets/images/ico_refresh.svg";
import settingIcon from "../../../assets/images/ico_setting.svg";
import UserIcon from "../../../assets/images/ico_user.svg";
import PreviewIcon from "../../../assets/svg/dashboard-icons/presentation.svg";

import { Divider, Center } from '@chakra-ui/react'

export const MenuButtons = ({ unSelect, setPopupOpend, currentPopover, setPopoverOpen }) => {
    const { userInfo, isPreview, onChangePreview } = useMainSetting();
    const { pages, currentPageId, changePage,  orderPage, appendPage, appendNewPage, updatePage, currentPage } = usePages();

    
    const openSettingPopupHandler = () => { 
        setPopoverOpen(false);
        setPopupOpend(true);
    }

	const openHandler = (e) => {
		e.stopPropagation()
		// onOpenPopup(item);
		// close();
	}

    const handlerPreview = () => {
        onChangePreview();
    }

    return(
        <>
        <PopoverButton text={"배경"} icon={BackgroundIcon} id={"background"} currentPopover={currentPopover} setPopoverOpen={setPopoverOpen} >
            <BackgroundPopover currentPage={currentPage} />
        </PopoverButton>
        <SnapshotSaveLoadButtons unSelect={unSelect} />




        <MenuButton icon={settingIcon} onClick={openSettingPopupHandler} isSetting={true}   />
        {/* <PopoverButton icon={settingIcon} >
            <SettingPopover />
        </PopoverButton> */}
        {/* <div className='icon-btn' onClick={openSettingPopupHandler}> 
            <Svg4Color icon={settingIcon} />
        </div> */}

        <li class="non_line">
            <button className="set_btn" onClick={handlerPreview}>
                <Svg4Color icon={PreviewIcon} className="custom-preview-icon" hex={ "#fff"} />
            </button>
        </li>

        <PopoverButton icon={UserIcon} id={"user"} currentPopover={currentPopover} setPopoverOpen={setPopoverOpen}  isSetting={true}>
            <UserPopover />
        </PopoverButton>
        {/* <div className='icon-btn' onClick={openHandler}> 
            <Svg4Color icon={UserIcon} />
        </div> */}
        
        
        </>
    )
}

const MenuButton = ({text, icon, onClick, isSetting}) => {
    const openHandler = (e) => {
        e.stopPropagation()
        if(onClick)onClick();
    }

    return(
        <>
        <li className={isSetting ? "non_line" : ""}>
        <button className={isSetting ? "set_btn" : "edit_btn"} id="btn_pop" onClick={openHandler}>
            {icon && <img src={icon} alt=""/>}
            <div className='btn_text'>{text || ""}</div>
        </button>
        </li>
        </>
    )
}

const PopoverButton = ({text, icon, children, id, currentPopover, setPopoverOpen, isSetting}) => {
    const openHandler = (e) => {
        e.stopPropagation();
        if(currentPopover === id)return setPopoverOpen(false);
        setPopoverOpen(id);
    }


    return(
        <>
        <li className={isSetting ? "non_line" : ""}>
        <button className={isSetting ? "set_btn" : "edit_btn"} id="btn_pop" onClick={openHandler}>
            
            {icon && <img src={icon} alt=""/>}
            <div className='btn_text'>{text || ""}</div>
        </button>
        {(children && currentPopover === id) && cloneElement(children, { close: ()=>setPopoverOpen(false) })}
        </li>
        </>
    )
}



const SnapshotSaveLoadButtons = ({unSelect}) => { 
    const { loadSnapshot, saveSnapshot } = useLayoutData();
    
    
	const handlerSaveSnpashot = async () => {
		unSelect();
		saveSnapshot();
	}

	const handlerLoadSnpashot = async () => {
		unSelect();
		loadSnapshot();
	}

    return(
        <>
        <li><button className="edit_btn" onClick={handlerSaveSnpashot}><img src={SaveIcon} alt="" /> <div className='btn_text'>저장</div></button></li>
        <li className="non_line"><button className="set_btn" onClick={handlerLoadSnpashot}><img src={RefreshIcon} alt="" /></button></li>
        </>
    )
}

const SettingPopover = () => {




    return(
        <>
        <div class="set_layer bg_setbox">
        

        
        </div>
        </>
    )
}



const UserPopover = () => {
    const {userInfo, logout} = useMainSetting();
    const [isSuperUser, setIsSuperUser] = useState( false );
    useEffect(() => {
        if(!userInfo?.roleId)return setIsSuperUser(false);

        if(userInfo.roleId <= 3) setIsSuperUser(true);
        else setIsSuperUser(false);
    },[userInfo])


    const logoutHandler = () =>{
		logout();
	}

	const handlerClick = (e) => {
		e.preventDefault();
	}

    const style = {
        width: "140px", height: "100px",
        position: "absolute", left: "-80px"
        
    }

    return(
        <>
        <_user_info_popover_>
            
        
        <div className='user-info' onClick={handlerClick}>
            <div className='user-info-title'>
                <div className='user-info-name'>{userInfo.userNm}</div>
                님, 반갑습니다!
            </div>

            <div className='user-info-divider' />
            {/* {isSuperUser && <ComponentStatus4User />} */}

            <div className={"popover-btn"} onClick={logoutHandler}>
                <Svg4Color className={"logout-icon"}  icon={logoutIcon} hex={"#999999"}/>
                <div className='logout-btn'>
                    로그아웃
                </div>
            </div>
        </div>
            
        </_user_info_popover_>
        </>
    )
}

const ComponentStatus4User = () => {
    const handlerSelectChange = (e) => {
        console.log(e, e.target);
    }

    return(
        <>
        <div className='user-status'>
            <div className='user-status-select'>
                <div className='user-status-select-title'>  </div>

                <div className='user-status-select-content'>
                    <div className='user-status-select-label'>
                        선택컴포넌트
                    </div>
                    <Select name="userStatus" onChange={handlerSelectChange}>
                        {{"대시보드 관리자 (role_id: 3)":3,"관제요원1 (role_id: 6)":6, "관제요원2 (role_id: 9)":9}}
                    </Select>
                </div>


            </div>
            <div className='user-status-gauges'>
                <div className='user-status-gauge complete'>
                    <div className='gauge-title'>
                        업무
                    </div>
                    <div className='gauge-content'>
                        <div className='gauge-num'>{0}</div>
                        건
                    </div>
                </div>
                <div className='user-info-divider-hori' />
                <div className='user-status-gauge incomplete'>
                    <div className='gauge-title'>
                        미진행
                    </div>
                    <div className='gauge-content'>
                        <div className='gauge-num'>{0}</div>
                        건
                    </div>
                </div>

            </div>
        </div>

        <div className='user-info-divider' />
        </>
    )
}   

export const Select = ({ children , name, label, onChange }) => {
	const optionObject = children;
	const optionKeys = Object.keys(optionObject); 

	const optinonContent = optionKeys.map((key) => {
		return <option value={optionObject[key]}>{key}</option>
	})

	const handlerInputChange = (e) => {
		
		onChange(name, e.target.value);
	}

	return (
		<div className="input-container">
			<div className="input-main">

				{ label && <label className="input-label">{label}</label>}
				

					<select className="input-box" onChange={handlerInputChange} >
						{optinonContent}
					</select>
				
			</div>
	</div>)
}


const _user_info_popover_ = styled.div`
    width: 160px; 
    position: absolute; left: -125px;
    background-color:#fff;border-radius:11px;box-shadow:5px 9px 29px rgba(0,0,0,0.1);
    padding: 15px; font-weight: 500;

    :after {border-top:0px solid transparent;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #fff;content:"";position: absolute;
		top: -6px;
		left: 133px;
	
	}
    .user-info-divider{ width: 100%;height: 1px;background-color: #e0e0e0;margin: 10px 0;}
    .user-info-divider-hori{ width: 1px; height: 100%;background-color: #e0e0e0;margin: 0 10px;}
	.user-info{
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
        color: #333;

        .user-info-title{ font-size: 14px; display: flex; margin-bottom: 5px; }
        .user-info-name{ font-weight: bold; }
        

        .user-status{
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .user-status-select{
                display: flex; flex-direction: column; justify-content: space-between;
                font-weight: 500; padding-bottom: 13px;

                .user-status-select-label{
                    font-size: 13px;
                    padding-bottom: 5px;
                }

                .input-main{	
                    display: flex; flex-direction: column;
                    
                    .input-label{
                        padding: 5px;
                        font-size: 14px;
                        display: flex; align-items: center;
                    }
                    .input-box{
                        flex: 1; padding: 5px; font-size: 13px;
                        border: 1px solid #dedede;
                        border-radius: 6px;
                    }
                }
            }
        }
        .user-status-gauges{
            display: flex;justify-content: space-between;
            height: 38px;
            font-size: 13px;
        }
        .user-status-gauge{
            display: flex;
            flex: 1;



            .gauge-title{
                display: flex;  align-items: start;
            }
            .gauge-content{
                display: flex; justify-content: space-between; align-items: end;
            }
            
            .gauge-num{  font-weight: 700; }
        }


        .incomplete{ .gauge-num{color: #ff0000;} }
        .complete{ .gauge-num{color: #000000;} }





		.popover-btn{
			cursor: pointer;
			display: flex; justify-content: flex-start; align-items: center;
            margin-left: 10px;

            .logout-icon{
                width: 14px;
            }
            
			.logout-btn{
				padding: 0 8px; height: 24px;
				display: flex; align-items: center;
			}
			img{
				width: 20px;
			}
		}
	}

`