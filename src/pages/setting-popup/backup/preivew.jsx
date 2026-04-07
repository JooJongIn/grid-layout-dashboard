import React, {useState, useEffect, useRef} from 'react';
import {_setting_popup_ } from "../../styles/popup-style"

import { useStage } from '../../hook/useStage';
import { useMainSetting } from '../../hook/useMainSetting';

import { store } from '../../store';

import {Table} from '../../component/table'

import {$time, $ip, $contry, $int} from '../../component/types'

export const DataPreview = ({dataUrl, dataFormat, dataType}) => {
	if(!dataUrl) return(<>no data</>)
	const { all } = store(dataUrl);
	
	const [dataColumn, setColumn ] = useState([]);

	const [sampleValue, setSample ] = useState(null);

	const isDataArray = dataType !== "게이지"


	useEffect(()=> {
		if(Object.keys(dataFormat).length === 0)return;


		setColumn(dataFormat[0].val)

	},[dataFormat])

	useEffect(() => {
		if(!dataColumn|| typeof dataColumn !== "object" )return;

		const columnoptions = Object.values(dataColumn).map(col => {
			const {format, isUseing, val, type, key } = col;

			return {key: key ,value: val, type: type, }
		})


	},[dataColumn])


	useEffect(() => {
		if(!sampleValue)return;
		const sample1 = all[1]
		const sample2 = all[2]
		Object.keys(sampleValue).map(key => {
			let vals = [sampleValue[key]];
			if(sample1 && sample1[key]) vals.push(sample1[key]);
			if(sample2 && sample2[key]) vals.push(sample2[key]);
			evaluateType(key, vals);
		})
		

	},[sampleValue])



	return(
		<div>
			{isDataArray &&
				<SampleList data4Sample={all}/>
			}

			<div>
				
			</div>
		
		</div>
	)
}

const SampleList = ({data4Sample}) => {

	const [dataList , setDataList] = useState([]);

	useEffect(() => {
		if(!data4Sample)return;
		const data4List = Array.isArray(data4Sample) ? data4Sample : data4Sample?.viewResult?.data?.datalist;

		
		if(!data4List)return setDataList([])
		
		setDataList(data4List);


	},[data4Sample])

	const List = dataList.map(data => {
		return <div className=''>{Object.values(data).map(val => val + "|")} </div>;
	});



	return (
		<div>
		{dataList.length !== 0 &&
			<div>
				{List}
			</div>
		}
		{dataList.length === 0 &&
			<div>no data list</div>
		}
		</div>
	)
}





const evaluateType =  (key,  vals) => {
	
	const keyType  = keyTable[key];
	if(keyType)return keyType;
	let val = vals[0];

	if(!isNaN(val)) return(<$int />)

	for (const regObj of regs) {
		const reg = new RegExp(regObj.reg);
		const result = vals.find(v =>  reg.test(v))
		if(result)return regObj.tag;
	}

	for (const val of vals) {
		contrys.find(c => c === val );
	}

	return "string"
}



// ref table

const keyTable = {
	"time":"time",
	"ip":"ip",
	"contry":"contry",
	"nation":"contry",
}



const regs = [
	{"tag":"time", reg:"/^(0[0-9]|1[0-9]|2[0-3]):(0[1-9]|[0-5][0-9]):(0[1-9]|[0-5][0-9])$/" },
	{"tag":"time", reg:"/^(0[0-9]|1[0-9]|2[0-3]):(0[1-9]|[0-5][0-9])$/" },
	{"tag":"time", reg:"/^(0[1-9]|[0-5][0-9]):(0[1-9]|[0-5][0-9])$/" },
	{"tag":"ip", reg:"/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/"},

] 

const contrys = [
	"US",
	"ES",
	"AU",
	"GE",
]

