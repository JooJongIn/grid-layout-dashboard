import { useEffect, useState, useRef } from 'react'
import {
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
    Box
} from '@chakra-ui/react'

export const SettingSlider = ({label, dKey, option, onChange, current, suffix, customZero}) => { 
    const {min, max, cap, init} = option;
    const [valueStr, setValue] = useState( init );

    useEffect(() => {
        if(!(current && current[dKey]))return setValue(0);
        setValue(+current[dKey]);
    },[current])

    const handlerChange = (value) => {
        setValue(value);
    }
    
    const handlerSetValue = (value) => {
        setValue(value);
        onChange(dKey, value);
    }

    let zeroText = customZero ? customZero : "0";

    return (
        <>
        <div style={style1}>
            <div>{label}</div>
            {valueStr !== 0 && <div> {valueStr}{suffix}</div>}
            {valueStr === 0 && <div> {zeroText} </div>}
        </div>
        <div>
            {/* <input type="text" onBlur={handlerSetValue} /> */}
            <Slider aria-label='slider-ex-1' value={valueStr} min={min} max={max} step={cap}
            colorScheme='gray' 
            onChange={handlerChange} onChangeEnd={handlerSetValue} >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={3} >
                    <Box bg='gray' />
                </SliderThumb>
            </Slider>
        </div>
        {/* <div style={{...style1, fontSize: "10px"}}>
            <div>{min}</div>
            <div> {max}</div>
        </div> */}
       
        </>
    )
}
 
const style1 = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px"
}