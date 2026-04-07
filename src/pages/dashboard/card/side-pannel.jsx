import React, {useEffect, useState} from 'react';
import styled from 'styled-components';


import { useCardConfig } from '../../../hook/useCardConfig';
import { SettingSlider } from '../../setting-popup/slider';
import { config } from '../../../state';
import { contentRefTable, cardDefaultOptions } from '../../../ref/component';

import { stageCol } from '../../../ref/stage-setting';

// TODO: slider 렌더링시에 slider에 포커스가 걸림
// TODO: 전역설정중 같은컴포넌트 동시적용 임시로 삭제
export const SidePannel = ({card, padding, setPadding, cardUpdate, isGlobalPadding, onClose}) => {
    const { removePadding } = useCardConfig(card.cardType);
    const [isGlobal, setIsGlobal] = useState(card.options?.padding ? false : true);
	const [gPadding, setGPadding] = config(`${card.cardType}-padding`);

    useEffect(() => {
        isGlobalPadding.current = isGlobal ? "global" : "individual";
    },[isGlobal])

    const onChange = (key, value) => {
        if(isGlobal){
            setGPadding(value);
        }else{
            setPadding(value);
        }
    }

    const handlerCheckGlobal = (e) => {
        setIsGlobal(e.target.checked);
        if(e.target.checked) {
            gPadding ? setPadding(gPadding) : setPadding(cardDefaultOptions[card.cardType].padding);
            cardUpdate("padding", null);
        }
        
    }

    const handlerReset = () => {
        if(isGlobal){
            removePadding();
        }else{
            cardUpdate("padding", null);
        }
    }

    const isLeft = getPannelPosition(card);

	return (
        <>
            <_side_pannel_ isLeft={isLeft}>

                <div className='side_pannel'>
                    <div className='side_pannel_head'>
                        <div className='side_pannel_title'>Padding</div>
                        <div className='global-checkbox'>
                            <label htmlFor="isGlobal">컴포넌트 전체 설정 </label>
                            <input type="checkbox" id="isGlobal" checked={isGlobal} onChange={handlerCheckGlobal} />
                        </div>
                    </div>
                    <div className='side_pannel_content'>
                        <PaddingInputs onChange={onChange} init={padding} />
                    </div>
                    <div className='side_pannel_footer' >
                        {/* <button className='save-button btn' onClick={handlerSave} >
                            저장
                        </button> */}
                        <button className='reset-button btn' onClick={handlerReset} >
                            초기화
                        </button>
                    </div>
                </div>
            </_side_pannel_>
        </>
    );
};

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    width: 100%;
    height: 100%;
    z-index: 999; /* SidePannel보다 위에 위치 */
`;

const getPannelPosition = (card) => {
    const {w,h, x,y} =  card.cardLocation
    return x + (w / 2) > (stageCol / 2);
}

const _side_pannel_ = styled.div`
    position: absolute;
    top: 0;
    ${({isLeft}) => isLeft ? "right: 105%;" : "left: 105%;"}
    width: 300px;
    height: 100%;
    min-height: 300px;

    .side_pannel {
        width: 300px;
        /* max-height: 100%; */
        background-color: #ffffff;
        border-left: 1px solid #e5e5e5;
        border-radius: 10px;
        padding: 28px 30px;
        padding-bottom: 18px;

        overflow-y: scroll;

        ::-webkit-scrollbar {
            display: none; /* 스크롤바 숨기기 */
        }
    }
                    
    .side_pannel_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;

        .global-checkbox{
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .side_pannel_content {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .prop_input {
            display: flex;
            flex-direction: column;
            gap: 4px;

            label {
                font-size: 14px;
                color: #666;
            }

            .input_container {
                display: flex;
                align-items: center;
                gap: 5px;
            }
        }
    }

    .side_pannel_footer {
        text-align: center;
        margin-top: 25px;
        .btn{
            padding: 10px auto;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin: 0 4px;
            width: 75px;
        }
        .save-button {
            background-color: #007bff;
        }
        .reset-button {
            background-color: #666;
        }
    }
`;





const PaddingInputs = ({onChange, init}) => {
    const [padding, setPadding] = useState({top: 0, left: 0, right: 0, bottom: 0});
    // const [paddArray, setPaddArray] = useState([]);

    useEffect(() => {
        setPadding(init);
    },[init])

   

    const handlerChange = (key, value) => {
        setPadding({...padding, [key]: value});
        onChange("padding", {...padding, [key]: value});
    }


    return (
        <>
        
        <div className='prop_input input_container'>
            <SettingSlider label="Top" dKey="top" option={{min: 0, cap: 1, init: 0, max: 120}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        <div className='prop_input input_container'>
            <SettingSlider label="Right" dKey="right" option={{min: 0, cap: 1, init: 0, max: 120}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        <div className='prop_input input_container'>
            <SettingSlider label="Left" dKey="left" option={{min: 0, cap: 1, init: 0, max: 120}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        <div className='prop_input input_container'>
            <SettingSlider label="Bottom" dKey="bottom" option={{min: 0, cap: 1, init: 0, max: 120}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        </>
    )
}