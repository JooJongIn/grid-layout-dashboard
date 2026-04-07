import { useEffect, useRef, useState, useMemo } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Fill, Stroke, Circle, Text } from 'ol/style';
import styled from 'styled-components'
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';

import {defaults as defaultInteractions, DragPan, MouseWheelZoom, KeyboardPan, KeyboardZoom} from 'ol/interaction';

// 이동과 확대/축소 관련 인터랙션을 제거한 인터랙션 세트 생성  
const interactions = defaultInteractions({  
	dragPan: false,          // 드래그 이동 비활성화  
	mouseWheelZoom: false,   // 마우스 휠 확대/축소 비활성화  
	doubleClickZoom: false,  // 더블클릭 확대 비활성화  
	dragRotate: false,       // 드래그 회전 비활성화  
	pinchZoom: false,        // 터치 확대/축소 비활성화  
	keyboardPan: false,      // 키보드 이동 비활성화  
	keyboardZoom: false,     // 키보드 확대/축소 비활성화  
	dragZoom: false          // 박스 확대 비활성화  
  });  

// const coordsMap = {  
//     "France North": [2.3522, 48.8566],    // 파리 좌표  
//     "Japan Central": [136.9066, 35.1815], // 나고야 좌표  
//     "Malaysia": [101.6869, 3.1390],       // 쿠알라룸푸르 좌표  
//     "Poland": [19.1451, 51.9194],         // 폴란드 중앙 좌표  
//     "South Korea": [127.7669, 35.9078],   // 한국 중심 좌표  
//     "US East": [-74.0059, 40.7128],       // 뉴욕 좌표  
//     "US Southeast": [-84.3880, 33.7490],  // 애틀랜타 좌표  
//     "US West": [-122.4194, 37.7749],      // 샌프란시스코 좌표  
//     "Vietnam": [105.854444, 21.028511]    // 하노이 좌표  
// };  


export const MapComponent = ({ 
	center = [150, 20], 
	zoom = 1,
	data = [],
	card,
	apiObj,
	setOption4Content
  }) => {
	const mapRef = useRef(null); 
	const mapInstanceRef = useRef(null);
	const markerLayerRef = useRef(null);

	const options = card?.options || {};
  
	// 지도 초기화
	useEffect(() => {
	  	if (!mapRef.current || mapInstanceRef.current) return;
		// 마커 레이어 생성
		canvasInit();
  
	  	// 컴포넌트 언마운트 시 지도 인스턴스 제거
		return () => {
			if (mapInstanceRef.current) {
			mapInstanceRef.current.setTarget(null);
			mapInstanceRef.current = null;
			}
		};
	}, []);
  
  
	// 마커 업데이트
	useEffect(() => {
		if(!(data && Array.isArray(data)))return;
		if (!markerLayerRef.current) return;
		const source = markerLayerRef.current.getSource();
		source.clear();
		// 마커 추가
		data.forEach((marker) => {
			const position = [marker.x_val, marker.y_val];
			// const position = [139.7495, 35.6812 + 30];
			const feature = new Feature({
				geometry: new Point(fromLonLat(position)),
				name: marker.nm,
				type: 'marker',
				data: marker,
			});
	
			// 마커 스타일 설정
			feature.setStyle(createMarkerStyle(marker));
		
			source.addFeature(feature);
		});
  
	}, [data]);

	useEffect(() => {
		if(!card || !mapInstanceRef.current) return;
		mapInstanceRef.current.setView(new View({
			center: fromLonLat(center),
			zoom: zoom,
		}));

	},[card])


	const canvasInit = () => {
		markerLayerRef.current = new VectorLayer({
			source: new VectorSource(),
		});

		// 바다 영역 레이어 추가 (GeoJSON)
		const oceanLayer = new VectorLayer({
			source: new VectorSource({
				url: './ocean.geojson',
				format: new GeoJSON(),
			}),
			style: new Style({
				fill: new Fill({
					color: '#cad2d3' // 바다색 #333, 투명도 0.6
				}),
				stroke: new Stroke({
					color: 'rgba(51, 51, 51, 0.1)',
					width: 1
				})
			}),
			zIndex: 0 // OSM 타일 위, 마커 아래
		});

		// 지도 인스턴스 생성
		mapInstanceRef.current = new Map({
			target: mapRef.current,
			layers: [
				new TileLayer({ source: new OSM()}),
				oceanLayer,
				markerLayerRef.current,

			],
			view: new View({
				center: fromLonLat(center),
				zoom: zoom,
			}),
			interactions: interactions,
			controls: []
		});
	}
	
    
  	return (
		<MapContainer>
			<MapWrapper 
				ref={mapRef} 
				$borderRadius={options.color ? '12px' : '0px'}
			/>
			<Select options={options} apiObj={apiObj} setOption4Content={setOption4Content} />
		</MapContainer>
	);
};
  

  
function createMarkerStyle(marker) {
	 // 원형 마커를 위한 캔버스 생성
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	
	// 텍스트 측정을 위한 설정
	context.font = 'bold 12px Arial';
	const textWidth = context.measureText(marker.nm).width;

	const fCnt = marker.f_cnt  || 0;
	
	// 원형 마커 크기 설정
	const circleRadius = 18;
	const textPadding = 5;
	const canvasWidth = Math.max(textWidth + textPadding * 2, circleRadius * 2 + 10);
	const canvasHeight = circleRadius * 2 + 22; // 라벨 텍스트 공간 추가
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	
	// 지역명 텍스트 그리기 (상단)
	context.fillStyle = '#808080';
	context.textAlign = 'center';
	context.textBaseline = 'top';
	context.font = '500 12px Arial';
	context.letterSpacing = '0.1px';
	context.fillText(marker.nm, canvasWidth / 2, 0);
	
	// 원형 마커 그리기
	const centerX = canvasWidth / 2;
	const centerY = circleRadius + 14; // 텍스트 아래
	
	// 배경 원 그리기
	context.beginPath();
	context.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
	context.fillStyle = fCnt > 0 ? '#FF5C6C' : '#717EEE'; // 파란색 배경
	context.fill();
	

	// cnt 값이 있으면 표시, 없으면 0 표시
	let displayText = fCnt > 0 ? fCnt + ' / ' + marker.cnt.toString() : marker.cnt.toString() || '0';

	

	// 카운트 텍스트 그리기
	context.fillStyle = 'white';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = displayText.length < 4 ? '600 18px Arial' : '500 12px Arial';
	 
	context.fillText(displayText, centerX, centerY + 1);
	
	return new Style({
		image: new Icon({
			img: canvas,
			imgSize: [canvas.width, canvas.height],
			anchor: [0.5, 1],
			anchorXUnits: 'fraction',
			anchorYUnits: 'fraction'
		})
	});
}

const _map_style_ = styled.div`

`

// 06afff
// "#3CC9B3",
// "#FF7784",
// "#46BFFF",
// "#FFBB54",
// "#717EEE",
// "#FF9358",
// "#CFCFCF",
// "#A6C33F",
// "#339FF1"

// Select 컴포넌트
const Select = ({options, apiObj, setOption4Content}) => {
	// 셀렉트 상태 관리 - 각 셀렉트별로 관리
	const [selectedValues, setSelectedValues] = useState({});
	const [openSelects, setOpenSelects] = useState({});
	const [selectOptions, setSelectOptions] = useState([]);

	const paramsObj = useMemo(() => {
		return options?.params || {};
	}, [options?.params]);

	useEffect(() => {
		if(!options || !Array.isArray(options)) return;
		setSelectOptions(options);
	},[options])

	useEffect(() => {
		const paramObj = apiObj?.params;
		if(!(paramObj && typeof paramObj === 'object' ))return setSelectOptions([]);
        let newArray = []
        for (const key in paramObj) {
            const val = paramObj[key];
			let list = Object.keys(val).map(k =>  ({text:k, val:val[k]}));
			if(list.length !== 0) newArray.push({label: key,  list:list });
        }
		setSelectOptions(newArray);
        
	},[apiObj])


	useEffect(() => {
		setSelectedValues(paramsObj);
	},[paramsObj])

	// 셀렉트 변경 핸들러
	const handleSelectChange = (selectKey, value, label) => {
		setSelectedValues(prev => ({
			...prev,
			[selectKey]: value
		}));
		setOpenSelects(prev => ({
			...prev,
			[selectKey]: false
		}));
		setCardParamHandler(selectKey, value);
	};

	// 셀렉트 토글 핸들러
	const toggleSelect = (selectKey) => {
		setOpenSelects(prev => ({
			...prev,
			[selectKey]: !prev[selectKey]
		}));
	};

	// 외부 클릭시 셀렉트 닫기
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest('.map-select')) {
				setOpenSelects({});
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const setCardParamHandler = (name, value) => {
		let newParam = {...paramsObj, [name]: value};
		setOption4Content("params", newParam);
	}
	
	return (
		<>
		{selectOptions.length > 0 && (
			<SelectWrapper>
				{selectOptions.map((selectGroup, index) => {
					const selectKey = selectGroup.label;
					const isOpen = openSelects[selectKey] || false;
					const selectedValue = selectedValues[selectKey] || '';
					const selectedOption = selectGroup.list.find(opt => opt.val === selectedValue);
					
					return (
						<SelectContainer key={selectKey} className="map-select">
							<SelectButton onClick={() => toggleSelect(selectKey)} $isOpen={isOpen}>
								<SelectText>
									{selectedOption ? selectedOption.text : `${selectGroup.label} 선택`}
								</SelectText>
								<SelectArrow $isOpen={isOpen}>▼</SelectArrow>
							</SelectButton>
							{isOpen && (
								<SelectDropdown>
									{selectGroup.list.map((option) => (
										<SelectOption 
											key={option.val}
											onClick={() => handleSelectChange(selectKey, option.val, option.text)}
											$isSelected={selectedValue === option.val}
										>
											{option.text}
										</SelectOption>
									))}
								</SelectDropdown>
							)}
						</SelectContainer>
					);
				})}
			</SelectWrapper>
		)}
		</>
	);
};

// Styled Components
const MapContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const SelectWrapper = styled.div`
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 1000;
	display: flex;
	flex-direction: row;
	gap: 8px;
	width: auto;
`;

const SelectContainer = styled.div`
	position: relative;
	min-width: 150px;
`;

const SelectButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	background: #ffffff;
	border: 1px solid ${props => props.$isOpen ? '#4A90E2' : '#dcdcdc'};
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	color: #333;
	transition: all 0.2s ease;
	min-height: 36px;

	&:hover {
		border-color: #4A90E2;
		box-shadow: 0 2px 4px rgba(74, 144, 226, 0.1);
	}
`;

const SelectText = styled.span`
	flex: 1;
	text-align: left;
	color: #333;
`;

const SelectArrow = styled.span`
	font-size: 12px;
	color: #666;
	transition: transform 0.2s ease;
	transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SelectDropdown = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: #ffffff;
	border: 1px solid #dcdcdc;
	border-top: none;
	border-radius: 0 0 6px 6px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	max-height: 200px;
	overflow-y: auto;
	z-index: 1001;
`;

const SelectOption = styled.div`
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;
	color: #333;
	background: ${props => props.$isSelected ? '#f0f8ff' : '#ffffff'};
	border-bottom: 1px solid #f5f5f5;

	&:hover {
		background: #f0f8ff;
		color: #4A90E2;
	}

	&:last-child {
		border-bottom: none;
	}
`;

const MapWrapper = styled.div`
	flex: 1;
	width: 100%;
	border: 1px solid #ccc;
	border-radius: ${props => props.$borderRadius};
	overflow: hidden;
`;