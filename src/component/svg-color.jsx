import React from 'react';
import { hexToCSSFilter } from 'hex-to-css-filter';



export const Svg4Color = ({icon, hex, opacity, draggable, className ,  customStyle}) => {
	const cssFilter = hexToCSSFilter(hex || '#000000');
	const opacityStyle = opacity ? `opacity(${opacity})` : "opacity(1)";

	let style = {
		filter: hex ? cssFilter.filter.replaceAll(";", "") + " " + opacityStyle : opacityStyle,
		
	}

	if(customStyle)style = {...style, ...customStyle}

	return (<img className={className ? className : ""} src={icon} style={style} draggable={false}/> );
}
