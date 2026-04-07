import React,{ useState , useEffect, useRef, useCallback} from 'react';

import { getShared } from '../../../store';
import { useStage } from '../../../hook/useStage';
import { useMainSetting } from '../../../hook/useMainSetting';

import {_popover_, _user_info_popover_} from '../../../styles/stage-style'

import {_appbar_} from '../../../styles/appbar-style'
import {_component_pannel_, _prop_pannel_ } from '../../../styles/pannel-style'

import { SnapshotPagenation } from './snapshot-pagenation'
import { Svg4Color } from '../../../component/svg-color'

import undoIcon from "../../../assets/svg/dashboard-icons/undo-circle.svg";
import redoIcon from "../../../assets/svg/dashboard-icons/redo-circle.svg";
import gridIcon from "../../../assets/svg/dashboard-icons/f7_grid.svg";
import settingIcon from "../../../assets/svg/dashboard-icons/uil_setting.svg";
import UserIcon from "../../../assets/svg/dashboard-icons/account.svg"

import prevIcon from "../../../assets/images/ico_prev.svg";
import nextIcon from "../../../assets/images/ico_next.svg";

import { ComponentButtons } from './component-for-appbar'

import { MenuButtons } from './menu-pannel'

import "../../../styles/appbar-style.css"

export default function Appbar({setPopupOpend,  unSelect}) {
    const [currentPopover, setPopoverOpen] = useState(false);

    const closePopover = () => {
        setPopoverOpen(false);
    }



	return (
	<_appbar_>
        <div className='header' id='header'>
            <div className=' appbar-left header_left'>
                <ul>
                    <SnapshotPagenation unSelect={unSelect}/>
                </ul>
            </div>
            <div className=' appbar-right header_right'>
                <ul>
                    <HistoryButtons unSelect={unSelect} />
                    <GridButton />
                    <ComponentButtons currentPopover={currentPopover} setPopoverOpen={setPopoverOpen} />
                    <MenuButtons unSelect={unSelect} setPopupOpend={setPopupOpend} currentPopover={currentPopover} setPopoverOpen={setPopoverOpen}  />
                </ul>
            </div>
        </div>
        {currentPopover !== false && <div className='dim' onClick={closePopover} />}
	</_appbar_>
	);
}

const HistoryButtons = ({unSelect}) => {
    const history = getShared( "layout-history" );
    const { setStageCards } = useStage();

    const handlerClickUndo = (e) => {
		unSelect();
		const newLayout = history.undo();
		if(!newLayout)return;
		setStageCards(newLayout)
	}
	const handlerClickRedo = (e) => {
		unSelect();
		const newLayout = history.redo()
		if(!newLayout)return;
		setStageCards(newLayout)
	}


    return (
        <>
        <li><button className="edit_btn non_text" onClick={handlerClickUndo}><img src={prevIcon} alt="" /></button></li>
        <li><button className="edit_btn non_text" onClick={handlerClickRedo}><img src={nextIcon} alt="" /></button></li>
        </>
    )
}

const GridButton = ({}) => {
    const {isGrid, onChangeGrid} = useMainSetting();
    

    const changeGridMode = () => {
        onChangeGrid();
    }

    return (
        <li>
            <label className="btn_toggle">
                <span className="toggle_text">Grid</span>
                <input role="switch" type="checkbox" className="chk_toggle" checked={isGrid} onChange={changeGridMode} />
            </label>
        </li>
    )
}

