import React, {useState, useEffect, useRef} from 'react';
import {_setting_popup_, _test_ } from "../../styles/popup-style"

import { useStage } from '../../hook/useStage';
import { useMainSetting } from '../../hook/useMainSetting';

import { store } from '../../store';

import {Table} from '../../component/table'

import { DBTreeView } from '../../component/tree-view';

import { DataPreview} from './preivew';


import {$time, $ip, $contry, $int} from '../../component/types'

import { StyleWrap } from '../../component/common';

// import { Tune } from '@mui/icons-material';

export function SettingPopup({isOpendPopup, setPopupOpend}) {


	const closeHandler = () =>{
		setPopupOpend(false);
	}

	return (
		<>
		{isOpendPopup &&
		<_setting_popup_>
			<button onClick={closeHandler}>
				닫기
			</button>
			<div className='popup_content'>
				<DataSeting />
			</div>
		</_setting_popup_>
		
		}
		
		</>
	);
}

const mockApiList = [
	{
	 "apiName": "apiName chart",
	 "apiUrl": "https://626a2d88737b438c1c4335e4.mockapi.io/api/test/chart",
	 "id": "1"
	},
	{
	 "apiName": "apiName 2",
	 "apiUrl": "https://626a2d88737b438c1c4335e4.mockapi.io/api/test/chart2",
	 "id": "2"
	},
	{
	 "apiName": "apiName list",
	 "apiUrl": "https://626a2d88737b438c1c4335e4.mockapi.io/api/test/list",
	 "id": "3"
	},
	{
	 "apiName": "apiName list2",
	 "apiUrl": "https://634d1239acb391d34a92fc61.mockapi.io/list2",
	 "id": "4"
	}
 ]

// 다른 로우 클릭시 패스 삭제
const DataSeting = ({}) => {
	const {apiList} = useMainSetting()

	const [seletedRow, setSelectRow] = useState(null);
	const [selectedUrl, setApiUrl] = useState(null);
	const [dataFormat, setFormat] = useState({});
	const [dataPath, setPath] = useState(null);

	const [dataType, setType] = useState(null);


	useEffect(()=> {
		setFormat({})
		setPath(null);
		setType(null);
	},[seletedRow]);

	const setFormatHandler = (format) =>{
 		console.log("data format",format );
		 setFormat(format)
	}

	const setDataPathHandler = (path) =>{
		setPath(path)
	}

	


	return(
		<>
		<div className='api-list content-item'> 
			{apiList && 
				[...mockApiList , ...apiList].map((api, idx) => 
				<ApiSettingRow api={api} idx={idx} 
				dataType={dataType} setType={setType}
				seletedRow={seletedRow} setSelectRow={setSelectRow} 
				setApiUrl={setApiUrl} setFormatHandler={setFormatHandler} 
				dataPath={dataPath} setDataPathHandler={setDataPathHandler}
				/>)

			}
		
		</div>

		<div className='api-preview content-item'>
			<DataPreview dataUrl={selectedUrl} dataFormat={dataFormat} dataType={dataType} />
			{/* <_test_ obj={testObj} str={teststr}>
				test is test

			</_test_> */}

			<StyleWrap style={testObj} >
				<div>
					aaaa
				</div>
			</StyleWrap>
		</div>
		</>
	)
}

const testObj = {
	"background-color": "white",
	"color": "red",

}
const teststr = `
background-color: white;
color: blue;
`


// path
// viewResult/data/datalist

const ApiSettingRow = ({api, idx, seletedRow, setSelectRow, setApiUrl, setFormatHandler, dataPath, setDataPathHandler, dataType, setType }) => {
	const {apiName, apiUrl } = api;

	const urlsplits = apiUrl.split("/");
	const apiEndpoint = urlsplits[urlsplits.length -1];

	const selectRowHandler = () =>{

		if(idx === seletedRow){
			setSelectRow(null);
			setApiUrl(null)
		}
		if(idx !== seletedRow){
			setSelectRow(idx);
			setApiUrl(apiUrl);
		}
	}

	return(
		<>
		<div className='api-row' > 
			<div className='api-cell point' onClick={selectRowHandler}>{apiEndpoint}</div>
			{/* <div className='api-cell'>{apiName}</div>
			<div className='api-cell flex-2'>설명 설 명 </div> */}
			{/* <div className='api-cell'>
				<Input4Common />
				

			</div> */}

		</div>


		{idx === seletedRow  &&
		<ApiSubRow apiUrl={apiUrl} setFormatHandler={setFormatHandler} dataPath={dataPath} setDataPathHandler={setDataPathHandler} dataType={dataType} setType={setType}/>
		}
	
		</>
	)
}

const ApiSubRow = ({apiUrl, setFormatHandler, setDataPathHandler, dataPath,  dataType, setType}) => {
	const [data4Tree, setData4Tree] = useState({})
	const {all } = store(apiUrl);

	useEffect(()=>{
		let data = all;

		if(dataPath && dataPath.includes("/")){
			
			let temp = data;
			const paths = dataPath.split("/");
			for (const path of paths) {

				temp = temp[path] || {};

			}
			
			if(temp) data = temp;
		}
		setData4Tree(data)
	},[all, dataPath])


	return(
		<div className='api-subrow'>
			<div className='api-comment'>
				<TextField4Comment />
			</div>
			<div className='setting-bar'>
				<div className='setting-item'>
					<Select4DataType list={["차트", "리스트", "게이지"]} value={dataType} onChange={setType}/>
				</div>
				<div className='setting-item'>
					위젯 타입
				</div>
				
				<div className='setting-item'>
					<Input4Common setHandler={()=>{}}/>
				</div>

			</div>
			<div className='setting-bar'>
				<div className='setting-item'>
					templete tree view
				</div>
				<div className='setting-item'>
					<Input4Common setHandler={setDataPathHandler} value={dataPath} />
				</div>
				<div className='setting-item'>
					pre tree view
				</div>
			</div>

			<div className='api-json'>

				<DBTreeView data={data4Tree} setFormatHander={setFormatHandler}/>
			</div>
		</div>
	)
}

const Input4Common = ({setHandler, value}) => {
	const [isTyping, setTyping] = useState(false);
	const [titleText, setTitle] = useState(value || "edit...");

	const inputRef = useRef();

	useEffect(() => {
		if(!isTyping) return
		inputRef.current.focus();
	},[isTyping])

	useEffect(() => {
		if(!value)setTitle("edit...");
	},[value])


	const inputOnBlurHanddler = (e) => {
		const inputVal = e.target.value;
		setTitle(inputVal);
		setHandler(inputVal)
		setTyping(false);
		// setOption4Card(cardId, "cardTitle" ,inputVal);
	}

	const inputOnChangeHanddler = (e) => {
		const text = e.target.value;
		setTitle(text);
	}

	const titleClickHandler = ( ) => {		
		setTyping(true);

	}



 return(
	<div>
	{isTyping &&

		<input type="text" className='' value={titleText} 
		onChange={inputOnChangeHanddler} onBlur={inputOnBlurHanddler} 
		ref={inputRef}
		/>
	}

	{!isTyping &&
		<div onClick={titleClickHandler}>
			{titleText}
		</div>
	}
	</div>
 )
}

const TextField4Comment = ({}) => {
	return(
		<div className='comment-field' >

			설명 (개발자)
		</div>

	)
}


const Select4DataType = ({list, value, onChange}) => {

	const options = list.map( l =>  (<option value={l} > {l}</option>) );

	const changeHandler = (e) => {
		console.log(e.target.value);
		const val = e.target.value;
		onChange(val);
	}

	return(
		<div>
			<select onChange={changeHandler} value={value}>
				{options}
			</select>

		</div>
	)
}

// =========================================================================================================================================


