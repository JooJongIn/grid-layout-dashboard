import React, {useRef, useState, useEffect, cloneElement} from 'react';
import styled from 'styled-components'
import { Grid as ChakraGrid, GridItem } from '@chakra-ui/react'

import {IconButton} from "./common"
import settingIcon from "../assets/svg/dashboard-icons/setting.svg";

import infoIcon from "../assets/icons/information-button.png";


export function Grid({template, row, col, name,  children}) {
	const rowStyStr = makeGridColStyle(row);
	const colStyStr = makeGridColStyle(col);
	
	const layoutStyle = {
		"gridArea": name,
	}


	const area = Array.isArray(children) ? children.map((child, idx) => cloneElement(child,{idx: idx})) : cloneElement(contents,{idx: 0});


	return (
			<ChakraGrid
			style={layoutStyle}
			w={"100%"}
			h={'100%'}
			gridTemplateRows={rowStyStr}
			gridTemplateColumns={colStyStr}
			gap={4}
			gridTemplateAreas={template}
			
			>
				{/* {children.map((child, idx) => cloneElement(child,{idx: idx}))}
				 */}
				 {area}
				{/* {children} */}
			</ChakraGrid>

	);
}


 




const makeGridColStyle = (layout) => {
	const colStyleArr = layout.map(r => {
		if(r === "_") return `1fr `

		if(r.includes("?")) {
			const result = r.replaceAll("?","");
			return `minmax(${result}, max-content) `
		}

		return `${r} `;
	})
	return ' '.concat(...colStyleArr);
}




const _layout_ = styled.div`
	width: 100%;
	height: 100%;
	max-height: 100%;
	.item{
		width: 100%;
		height: 100%;
		
	}
	.scroll{
		overflow-y: scroll;
	}

`


export const Area = ({
	name, children, idx, id, 
	top, middle, bottom, center,  left, right, scroll,

} ) => {

	let vertical  
	let horizental 

	if(top)horizental = "start"
	if(middle)horizental = "center"
	if(bottom)horizental = "end"
	if(center)vertical = "center"
	if(left)vertical = "start"
	if(right)vertical = "end"
	

	const style = {
		"gridArea": name,
		display: "flex",
		flexDirection: "column",
		"justifyContent": vertical,
		"alignItems": horizental,
		"overflow": scroll ? "hidden":"",
		position: "relative",
	}

	return(
		<>
		<div className='item' style={style} key={idx}>
			{children}
		</div>
		</>
	)
}
