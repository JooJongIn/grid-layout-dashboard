import React,{useState, useEffect} from 'react';
import RangeSlider, { Tooltip, Label } from 'devextreme-react/range-slider';
import 'devextreme/dist/css/dx.light.css';
import styled from 'styled-components';
import moment from 'moment';

export const Range = ({ card, setMultiOptions, setChildMultiOptions, isCardId }) =>{

	const [value, setValue] = new useState([]);
	const [minAndMax, setMinAndMax] = new useState([]);
	const [rangeState, setRangeState] = new useState(false);
	const [rangeType, setRangeType] = new useState();
	const {cardId, options} = card;
	const rangeData = options.range;

	useEffect(() =>{
		if(rangeData){
			let dMin = Number(rangeData.dMin);
			let dMax = Number(rangeData.dMax);
			let min = Number(rangeData.min);
			let max = Number(rangeData.max);

			setMinAndMax([dMin, dMax]);
			setValue([min, max]);
			setRangeState(true);
			setRangeType(rangeData.type);
		}

		return () => {
			setMinAndMax("");
			setValue("");
			setRangeState("");
			setRangeType("");
		}
	},[rangeData]);

	const rangeSliderAttributes = {
    class: 'rangeSlider'
	}

	const format = (value) => {
		let val = value.toString();
		
		if(rangeType === "HH:mm:ss"){
			val?.length !== 6 ? val = `0`+ val : val;
			val = val.substr(0, 2)+ ":"+val.substr(2, 2)+ ":"+val.substr(4, 2);
		}else if(rangeType === "HH:mm"){
			val?.length !== 4 ? val = `0`+ val : val;
			val = val.substr(0, 2)+ ":"+val.substr(2, 2);
		}else if(rangeType === "MM-DD"){
			val?.length !== 4 ? val = `0`+ val : val;
			val = val.substr(0, 2)+ "-"+val.substr(2, 2);
		}else if(rangeType === "YYYY-MM-DD HH"){
			val = val.substr(0, 4)+ "-"+val.substr(4, 2)+ "-"+val.substr(6, 2) + " "+val.substr(8, 2);
		}else if (rangeType === "YYYY-MM-DD HH:mm:ss"){
			val = moment(Number(val)).format(rangeType);
		}else if (rangeType === "YYYY-MM-DDHH:mm:ss"){
			val = val.substr(0, 4)+ "-"+val.substr(4, 2)+ "-"+val.substr(6, 2) + " "+val.substr(8, 2)+ ":"+val.substr(10, 2)+ ":"+val.substr(12, 2);
		}

    return val;
  }

	const onRangeChanged = (e) => {
		const val = e.value;
		setValue(e.value);
		
		let rangeObj ={range: {...rangeData, min:val[0], max:val[1]}}
		isCardId ? setMultiOptions(cardId, rangeObj) : setChildMultiOptions(cardId, rangeObj);	
  }

	return(
		<>
			<_range_>
				{ rangeState &&
				<RangeSlider elementAttr={rangeSliderAttributes} min={minAndMax[0]} max={minAndMax[1]}  start={value[0]} end={value[1]} onValueChanged={onRangeChanged}>
					<Tooltip enabled={true} format={format} showMode="onHover" position="bottom" />
				</RangeSlider>
				}
			</_range_>
		</>
	)
}

const _range_ = styled.div`
.rangeSlider{
	.dx-slider-bar {
		margin: 14px 7px;
		height: 4px;
		background: #ccc;
		border-radius: 2px;
	}
	.dx-slider-handle{
		position: absolute;
		top: 0;
		right: 0;
		pointer-events: auto;
		-webkit-user-drag: none;
		margin-top: -7px;
		margin-right: -7px;
		width: 14px;
		height: 14px;
		border: 1px solid #fff;
		background-color: #337ab7;
		border-radius: 50%;
		-webkit-box-sizing: content-box;
		box-sizing: content-box;
	}
	.dx-slider-range.dx-slider-range-visible{
		order: 1px solid #337ab7;
		background: #337ab7;
		border-radius: 2px;
	}
}
`