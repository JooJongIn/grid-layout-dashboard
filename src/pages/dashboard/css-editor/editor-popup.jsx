import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { compoClasses } from '../../../ref/component'

import {CssEditor} from './css-editor'

import { useStage } from '../../../hook/useStage';
import { useMainSetting, usePages} from '../../../hook/useMainSetting';


export const CssEditorPopup = () => {
    const {selectedCard, selectedCardId, setMultiOptions, setChildMultiOptions} = useStage();

    if(!selectedCard)return(<></>);
    if(true)return(<></>);
    const { cardType, options } = selectedCard;
    const customStyle = options?.style || {};

    const initClassesObj = compoClasses[cardType] || {};
    const initStyle = initClassesObj.styles || {};

    const compoStyle = {...initStyle, ...customStyle};
    const classes = Object.keys(compoStyle);

    const handlerSetStyle = (clnm, style) => {
        let newStyle = {}
        newStyle[clnm] = style;
        setMultiOptions(selectedCardId, {
            style: {...compoStyle, ...newStyle}
        })
    }

    return(
    <>
        <_css_popup_>
            <>
            <div className='popup-head'>head</div>
            <div className='popup-content'>
            {
                classes.map((className)=>{
                    const classStyle = compoStyle[className] || null;
                    return(<CssEditor classObj={{ className: className, initStyle: initStyle[className], style: classStyle }} setStyle={handlerSetStyle} />)
                })
            }

            {/* <button className='add-btn' onClick={handlerAddClass}>
                추가
            </button> */}
            </div>
            </>
        </_css_popup_>
        
    </>
    )
}




const _css_popup_ = styled.div`
    width: 600px;
    height: 80%;

    background-color: white;

    position: absolute;
    top: 10%;
    right: 0;

    border-radius: 20px;
    border: 1px solid #00000050;
    box-shadow :0px 100px 80px rgba(108, 73, 172, 0.07), 0px 22.3363px 17.869px rgba(108, 73, 172, 0.0417275), 0px 12.5216px 10.0172px rgba(108, 73, 172, 0.035), 0px 6.6501px 5.32008px rgba(108, 73, 172, 0.0282725), 0px 2.76726px 2.21381px rgba(108, 73, 172, 0.0196802);

    padding: 10px;

    
    z-index: 1;

    .popup-head{
        height: 5%;
        padding: 20px;
    }
    .popup-content{
        height: 90%;
        padding: 20px;
        overflow-y: scroll;
    }

    .add-btn{
        width: 100%;
        border-radius: 5px;

        margin:  20px 0;
        padding: 13px 0;
        border: 1px solid #00000050;

        cursor: pointer;
    }

    .editor{
        height: 500px;
        display: flex;
        flex-direction: column;
    }

    .editor-head{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .editor-title{
        font-weight: 700;
        font-size: 20px;
    }

    .init-btn{
        cursor: pointer;
        font-size: 13px;
    }

    .editor-content{
        flex: 1;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #00000050;
    }
`



