import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

export default function Text ({data, layout, containerRef}) {
	const [svgSize, setSvgSize] = useState({w:0, h:0});
  	const [fontSize, setFontSize] = useState();
	const gaugeRef = useRef();
	const textRef = useRef();

	// 부모에 따른 크기 변화
	useEffect(() => {
		const observer = new ResizeObserver(entries => {
		  let rect = entries[0].contentRect;
		  setSvgSize({w: rect.width, h: rect.height});
		})
		observer.observe(containerRef.current)
		return () => containerRef.current && observer.unobserve(containerRef.current)
	  }, [containerRef])


	const calcGaugeFont = (w, h) => {}


	return (
	<_gage_ >
		<div className='gauge-container' ref={gaugeRef}>
			<div className='gauge-number' id='container'>
			<svg width="100%" height="100%" viewBox="0 0 300 200">
			<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" className="svg-text">
				100,000
			</text>
			
			</svg>
			</div>
		</div>
	</_gage_>
	)
}

const _gage_ = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	color: black;
	justify-content: end;

	overflow: hidden;

	.gauge-container{
		width:100%;
		height:100%;
		.gauge-number{
			width:100%;
			height:100%;
		}
		.gauge-difference{
			font-size: 18px;
			display: flex;
			align-items: center;
		}
	}
	.resizable-box {
		position: relative;
		width: 300px;
		height: 200px;
		min-width: 200px;
		min-height: 150px;
		background-color: #f0f0f0;
		border: 2px solid #666;
		border-radius: 4px;
		overflow: hidden;
		resize: both;
	}

	.svg-text {
		font-family: Arial, sans-serif;
		font-size: 48px;
		font-weight: bold;
		fill: #333;
	}




`