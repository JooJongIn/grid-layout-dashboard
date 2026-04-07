import React, {useState, useEffect, cloneElement} from 'react';
import styled from 'styled-components'
import { Divider } from '@chakra-ui/react'

export const DBTreeView = ({data, setFormatHander}) => {
	const [templeteData, setTempleteData] = useState([]);

	useEffect(() => {	
		let useData = data;
		if(Array.isArray(data)){
			useData = { 0 : data[0]}
		}

		if(!useData)return
		let treeList = []
		Object.keys(useData).map(key => {
			const val = data[key];
			const type = typeof val;

			if(type === "object" || type === "array")treeList.push(dataToTree4Templete(val, key, 1 ,{}));
			else treeList.push( {val : val, key: key, depth: 1});
		})
		setTempleteData(treeList);
	},[data])

	useEffect(() => {
		console.log("=====change data", templeteData);
		if(templeteData.length === 0)return;
		setFormatHander(templeteData)
	},[templeteData])


	const setOption4Templete = (key, value, maps) => {
		console.log("set option",key, value, maps, templeteData);
		let temp = templeteData[0];
		let tempList = [temp]
		
		Object.values(maps).map((m, idx) => {
			if(idx === 0)return;
			const child = temp.val;
			temp = child[m];
			tempList.push(child[m]);
		})

		
		let newdata = {
			...temp, [key]:value
		}

		for(let i = tempList.length - 2; i >= 0; i--){
			const val = tempList[i]
			const child = val.val;
			newdata = {...val, val:{...child, [newdata.key]: newdata } }
		}

		setTempleteData([newdata])
	}

	return (
		<_tree_view_>
			<div className='templet treeview'>
				<TreeView data={templeteData}>
					<TreeRow4Input setOption={setOption4Templete}/>
				</TreeView>
			</div>
			<div className='preview treeview'>
				<TreeView data={templeteData} >
					<TreeRow   />
				</TreeView>
			</div>
			
		</_tree_view_>
	);
}

const TreeView = ({data, children}) => {

	return(
		<>
		{data.length !== 0 &&
			data.map(node => cloneElement(children,{node:node }))
		}
		</>
	)
}


const TreeRow = ({node}) => {
	const {val, key, depth, parent, isUseing, type, subOpened, format} = node;
	console.log();

	// const [subOpened, setOpen] = useState(false);
		
	const isArray = typeof val ==="object";

	const marginStyle = {
		marginLeft: `${depth * 20}px`,
		cursor: isArray ? "pointer" : "",
	}

	const openHandler = () =>{
		// setOpen(!subOpened);
	}

	const arrow = subOpened ? "|":">"

	if(!isUseing)return(<></>)

	// if(!isNaN(+key)) console.log(key, "====",node);
	if(format)console.log("treeview format", format);


	return (
	<>
	<div className='tree-row' style={marginStyle} onClick={openHandler}>
		
		<div className='tree-cell'>{key}</div>
		{!isArray &&
		<div className='tree-cell'>{val}</div>
		}
		{isArray &&
			<div className='tree-cell'>{arrow}</div>
		}
	</div>
	{isArray && <div style={{marginLeft: `${depth * 20}px`}}><Divider /></div>}
	{ (isArray && subOpened) &&
		Object.values(val).map(v => 
		<TreeRow node={v} />
		)
	}
	</>
	)
}

const TreeRow4Input = ({node, setOption}) => {
	const {val, key, depth, isUseing, parent, subOpened, format} = node;
	const [titleText, setTitle] = useState(format);

	const isArray = typeof val === "object";

	const marginStyle = {
		marginLeft: `${depth * 20}px`,
		cursor: isArray ? "pointer" : "",
	}

	const openHandler = () =>{
		setOption("subOpened", !subOpened,  {...parent, [depth] : key})
	}

	const useItemHandler = (e) =>{
		const checked = e.target.checked;
		setOption("isUseing", checked,  {...parent, [depth] : key})
	}

	const inputChangedHandler = (e) =>{
		const format = e.target.value
		setTitle(format);
	}

	const setFormatHandler = (e) => {
		const format = e.target.value
		setOption("format", format,  {...parent, [depth] : key})
	}


	
	const arrow = subOpened ? "|":">"



	return (
	<>
	<div className='tree-row' style={marginStyle} >
		<div className='tree-cell w-20 '>
			<input type="checkbox" checked={isUseing} onChange={useItemHandler}/>
		</div>
		<div className='tree-cell' onClick={openHandler}>{key}</div>
		
		{!isArray &&
			<div className='tree-cell'>
				<input onBlur={setFormatHandler} onChange={inputChangedHandler}  value={titleText} />
			</div>
		}
		{isArray &&
		<div className='tree-cell' onClick={openHandler}>{arrow}</div>
		}
	</div>

	{ (subOpened && isArray ) &&
		Object.values(val).map(v => 
			<TreeRow4Input node={v} setOption={setOption}/>
		)
	}

	</>
	)
}



function obj_to_tree(obj, parantkey, depth, parents) {
	let treeList = [];
	

	Object.keys(obj).map(key => {
		const val = obj[key];
		const type = typeof val;
		if(type === "object" || type === "array") treeList.push(obj_to_tree(val, key, depth + 1, [...parents, key] ));
		else treeList.push( createNode( val,  key, depth + 1, [...parents, key]))
	})


	return createNode( treeList, parantkey, depth, parents)
}


const createNode = (val, key, depth, parents) => {

	let type = typeof val;

	return {
		val : val,
		key: key,
		depth: depth,
		type: type,
		parent: parents,
	}
}


function dataToTree4Templete(obj, parentKey, depth, parents) {
	let treeList = {};


	Object.keys(obj).map(key => {
		const val = obj[key];
		const type = typeof val;

		if(Array.isArray(obj) && key !== "0") {
			// 리스트 하나만
			return;
		}
		

		
		if(type === "object" )return treeList[key] = dataToTree4Templete(val, key, depth + 1, {...parents, [depth]: parentKey});

		treeList[key] = createNode4Templete( val,  key, depth + 1, {...parents, [depth]: parentKey})
	})


	return createNode4Templete( treeList,  parentKey, depth, parents)
}



const createNode4Templete = (val, key, depth, parents) => {
	const type = Array.isArray(val) ? "array"  :typeof val;

	return {
		val : val,
		key: key,
		depth: depth,
		isUseing: true,
		type: type,
		format: "",
		parent: parents,
		subOpened: true,
	}
}

const _tree_view_ = styled.div`
	display: flex;
	
	.treeview{
		padding: 10px;
		border: 1px solid;
		min-height: 300px;
		min-width: 300px;
	}
	
	.tree-row{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 320px;
		height: 30px;
		padding: 5px 0;
	}

	.have-child{
		cursor: pointer;
	}

	.tree-cell{
		width: 80px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.w-20{
		width: 20px;
	}
`