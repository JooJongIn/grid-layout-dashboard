import { useEffect, useState } from 'react'
import { config } from '../../store';

import { SettingSlider } from '../setting-popup/slider';

import "./component_devtool.scss";

export const ComponentDevtool = () => { 
    const [cardProps, setCardProps] = config("card_props");

    useEffect(() => {
        
    },[])


    const onChange = (key, value) => {
        setCardProps({...cardProps, [key]: value});
    }


    return(
        <div className='component_devtool'>
            <div className='props_title'>
                카드
            </div>
            <div>
                <PaddingInputs onChange={onChange} />
            </div>

            <div className='props_title'>
                컴포넌트
            </div>
            <div>
                
            </div>
        </div>
    )
}




const PaddingInputs = ({onChange}) => {
    const [padding, setPadding] = useState({top: 0, left: 0, right: 0, bottom: 0});
    // const [paddArray, setPaddArray] = useState([]);

   

    const handlerChange = (key, value) => {
        setPadding({...padding, [key]: value});
        onChange("padding", {...padding, [key]: value});
    }


    return (
        <>
        
        <div className='prop_input input_container'>
            <label>Top</label>
            <SettingSlider label="Top" dKey="top" option={{min: 0, cap: 1, init: 0}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        <div className='prop_input input_container'>
            <label>Right</label>
            <SettingSlider label="Right" dKey="right" option={{min: 0, cap: 1, init: 0}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        <div className='prop_input input_container'>
            <label>Left</label>
            <SettingSlider label="Left" dKey="left" option={{min: 0, cap: 1, init: 0}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        <div className='prop_input input_container'>
            <label>Bottom</label>
            <SettingSlider label="Bottom" dKey="bottom" option={{min: 0, cap: 1, init: 0}} onChange={handlerChange} current={padding} suffix="px"/>
        </div>
        </>
    )
}