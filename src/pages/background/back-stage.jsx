import React, {useEffect, useRef, useState } from 'react';
import {_back_} from '../../styles/back-style';
import {useMainSetting} from '../../hook/useMainSetting';
import bockLogo from "../../assets/logo/bockgun-logo.png"
import { getShared } from '../../store';
import { dashobardDBUrl } from '../../ref/url'

import {MapComponent} from '../../component/map';
// import "./hologram/style.css"

// random Timeout
// setTimeout(() => {
//   window.alert("Done waiting");
// }, Math.floor(Math.random() * 10000));

export const BackStage = () => {
	const {isDarkMode, pageTheme, currentPage} = useMainSetting();
	const [backgroundObj, setBackgroundObj] = useState(null);
	const [backgroundMode, setBackgroundMode] = useState(null);

	
	const isPrint = false;

	useEffect(() => {
		if(!(currentPage && currentPage.background))return setBackgroundObj(null);
		const background = currentPage.background;

		setBackgroundObj(background);
	},[currentPage])

	useEffect(() => {
		if(!(currentPage && currentPage.backgroundMode))return setBackgroundMode(null);
		const backMode = currentPage.backgroundMode;

		setBackgroundMode(backMode);
	},[currentPage])

	const seeEarth = backgroundMode === 'earth';
	const seeMap = backgroundMode === 'map';

	// themeStyle

	let theme = isDarkMode ? "dark" : "light";
	theme = pageTheme ? "white" : theme;
	theme = isPrint ? "print" : theme;
	
	const isgradation = pageTheme ?  false  : !seeEarth;

	return(
		<_back_ isDarkMode={isDarkMode}>
			<div className={theme + ((isgradation && !isPrint) ? " gradation" :" ")} >
				{backgroundObj && <BackgroundAtServer {...backgroundObj} />}
				{!backgroundObj && <>

					{(seeEarth) &&
					<div id="glow" >
						<BackEarth />
					</div>}
					
					{(seeMap) && <BackMap />}
				</>}
			</div>
		</_back_>
	)
}


const BackMap = () => {
	return (
		<>
		<div>
			<MapComponent />
		</div>
		
		</>
	)
}


const BackgroundAtServer = ({path, fileType}) => {
	const [url, setUrl] = useState("");
	const [contentType, setContentType] = useState(false);
	
	useEffect(() => {
		console.log("path, fileType", path, fileType)
		if(!(path && fileType))return;
		setUrl(dashobardDBUrl + path);

		if(fileType.indexOf("image") !== -1) setContentType("image");
		else if(fileType.indexOf("video") !== -1) setContentType("video");

		
	},[path, fileType])




	return <div className='back-img'>
		{contentType === "image" && <img src={url} alt="" />}
		{contentType === "video" && <video src={url} alt=""  autoPlay muted loop>
			<source src={url} type={fileType} />
		</video>}
	</div>
}

export const BackEarth = () => {
	// var myearth;
	const [myearth, setearth] = useState();
	const [lines, setLines]= useState([]);
	const [isPulsReady, readyPuls] = useState();

	const {isDarkMode, seeEarth} = useMainSetting();

	const attakTimer = getShared("attakTimer");
	const contryIndex = getShared("contryIndex");

	const earthRef = useRef();

	useEffect(() =>{
		if(myearth) return;
		if(!seeEarth){

		}
		let earth = new Earth( 'myearth', {
			location : { lat: 20, lng : 20 },
			light: 'none',

			mapImage: 'hologram/hologram-map.svg',
			
			transparent: true,
			autoRotate : false,
			autoRotateSpeed: 1.2,
			autoRotateDelay: 100,
			autoRotateStart: 2000,				
		});

		earth.animate( 'zoom', earth.zoom - 0.1 );
		setearth(earth);
	},[seeEarth])

	useEffect(()=>{
		if(!myearth)return ;
		if(!attakTimer)return;

		drawLine(attakTimer);
		removeLine();
	},[contryIndex])

	useEffect(() =>{
		if(!myearth)return ;
		if(isPulsReady)return ;

		setPulseDot(myearth);

		readyPuls(true);
	},[myearth])


	useEffect(() =>{
		if(!myearth)return ;
		let newLines = [];
		lines.map(line =>{
			line.options.color = isDarkMode ? 'white': "#e02020";
			line.remove()
			const newLine = myearth.addLine({...line.options})
			let clip = newLine.options.clip;
			if(clip != 1) newLine.animate('clip', 1,{duration: 1000})
			newLines.push(newLine);
		})
		setLines([...newLines]);
	},[isDarkMode])

	

	

	const lineModel = {
		// color : 'white',
		// color : 'rgb(2,0,36)',
		opacity: 0.5,
		// 두께
		width: 0.1,
		// endWidth: 1,
		hairline: false,
		offset: 0,
		offsetFlow: 0.5,

		clip:0,

		// dash
		dashed: true,
		// dash 그려지는 크기
		// dashSize: 1, 
		dashSize: 0.05,
		// dash 사이 크기
		// dashRatio : 0,
		dashRatio : 0.5,
		// dashOffset : 1,
	};
	

	let sprites = []


	function pulse( index ) {
		// var random_location = connections[ getRandomInt(0, connections.length-1) ];
		var random_location = countries[index].loca;
		sprites[index].location = { lat: random_location[0] , lng: random_location[1] };
		
		sprites[index].animate( 'scale', 0.4, { duration: 320, complete : function(){
			this.animate( 'scale', 0.03, { duration: 320, complete : function(){
				setTimeout( function(){ pulse( index ); }, getRandomInt(100, 400) );
			} });
		} });
	}

	const lineReDraw = () => {
		// removeLine();
		drawLine();
		
	}

	const setPulseDot = (target) => {
		for ( var i=0; i < countries.length; i++ ) {
			sprites[i] = target.addSprite( {
				image: 'hologram/hologram-shine.svg',
				scale: 0.4,
				offset: 0,
				opacity: 0.5
			} );
			pulse( i );
		}
	}



	const drawLine = (time) => {
		if(!myearth)return;
		var line = { ...lineModel, 
			color : isDarkMode ? 'white': "#e02020",
			width: isDarkMode ? 0.2 : 0.3
		}

		const randomContry = attackers[contryIndex || 0];
		if(!randomContry)return console.log("err === ", randomContry, contryIndex);
		const startLoca = randomContry.loca;
		// const endLocaList = randomLocaArray(randomLines);
		myearth.animate( 'zoom', myearth.zoom - 0.1, { 
			easing: "out-quad",
			duration: 500,
			complete:function () {
			

				myearth.goTo({ lat: startLoca[0] , lng: startLoca[1]  }, { 
					duration: 1000, approachAngle: 20, 
					easing: "out-quart",
					complete:function () {
								 
					}});
				
				const zoomplus = 0.9 - myearth.zoom

				myearth.animate( 'zoom', myearth.zoom + zoomplus, {
					easing: "out-quad",
					duration: 1000,
					complete:function () {
						
					}});

		}});
		
		// myearth.goTo({ lat: startLoca[0] , lng: startLoca[1]  }, { duration: 1000, approachAngle: 20,});
		
		let newLines = [];
		for (const cont of countries) {
			
			const endLoca = cont.loca;
			line.locations = [ { lat: startLoca[0], lng: startLoca[1] }, { lat: endLoca[0], lng: endLoca[1] } ];
			let newLine = myearth.addLine( line );
			

			// newLine.animate( 'color', "red", { duration: 11000});
			// newLine.animate( 'dashSize', 0.4, { duration: 11000});
			// newLine.animate( 'dashRatio', 0.2, { duration: 11000});

			const randomInt =  getRandomInt(5, 25);
			newLine.animate( 'opacity', 1, { duration: 500 , complete: function(){
				newLine.animate( 'clip', 1, { duration: randomInt * 100});
			}});


			
			newLines.push(newLine);
		}

		setLines([...newLines]);
	}
	

	const removeLine = () => {
		lines.map((line, idx)=>{ 
			line.remove()
		});
		// setLines([])
	}

	const gotoHandler = () => {
		
	}

	return (<div id="myearth" ref={earthRef} />);
}




function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}


// 
function randomLocaArray(count){
	let newArray = [];
	for(let i = 0; i < count; i++){
		let val1 = (Math.random() * 100) * (Math.random() < 0.5 ? -1 : 1);
		let val2 = (Math.random() * 100) * (Math.random() < 0.5 ? -1 : 1);
		newArray.push([val1, val2])
	}
	return newArray;
}

// function getRandomRocationArray(count){

// 	new Array(count).map( i => {
// 		getRandomInt

// 	})
// }

const attackers = [
	{contry: "Ru", loca: [55.5807481,36.8251451] },
	{contry: "ES", loca: [40.4380638,-3.749576] },
	{contry: "US", loca: [40.7127837, -74.0059413] },
	{contry: "GB", loca: [51.5287718,-0.2416792] },
	{contry: "AU", loca: [-35.2812958,149.124822] },
]



const countries = [
	{contry: "NK", loca: [39.0291173,125.6720721] },
	{contry: "SA", loca: [-2.034115,-14.7513874] },
	{contry: "BR", loca: [-15.7217175,-48.0774427] },
	{contry : 'ARN', loca : [59.651901245117,17.918600082397]},
	{contry : 'BKK', loca : [13.681099891662598,100.74700164794922]},
	{contry : 'CAI', loca : [30.12190055847168,31.40559959411621]},
	{contry : 'CGK', loca : [-6.1255698204,106.65599823]},
	{contry : 'CMB', loca : [7.180759906768799,79.88410186767578]},
	{contry : 'CPT', loca : [-33.9648017883,18.6016998291]},
	{contry : 'CUR', loca : [12.1889,-68.959801]},
	{contry : 'DEL', loca : [28.566499710083008,77.10310363769531]},
	{contry : 'DXB', loca : [25.2527999878,55.3643989563]},
	{contry : 'EZE', loca : [-34.8222,-58.5358]},
	{contry : 'FCO', loca : [41.8002778,12.2388889]},
	{contry : 'HKG', loca : [22.3089008331,113.915000916]},
	{contry : 'HND', loca : [35.552299,139.779999]},
	{contry : 'HNL', loca : [21.318700790405273,-157.9219970703125]},
	{contry : 'JFK', loca : [40.63980103,-73.77890015]},
	{contry : 'KEF', loca : [63.985000610352,-22.605600357056]},
	{contry : 'LAX', loca : [33.94250107,-118.4079971]},
	{contry : 'LIM', loca : [-12.0219,-77.114304]},
	{contry : 'LHR', loca : [51.4706,-0.461941]},
	{contry : 'LPA', loca : [27.931900024414062,-15.38659954071045]},
	{contry : 'MAD', loca : [40.471926,-3.56264]},
	{contry : 'MEX', loca : [9.4363,-99.072098]},
	{contry : 'MIA', loca : [25.79319953918457,-80.29060363769531]},
	{contry : 'NBO', loca : [-1.31923997402,36.9277992249]},
	{contry : 'ORD', loca : [41.97859955,-87.90480042]},
	{contry : 'PEK', loca : [40.080101013183594,116.58499908447266]},
	{contry : 'PVG', loca : [31.143400192260742,121.80500030517578]},
	{contry : 'SIN', loca : [1.35019,103.994003]},
	{contry : 'SYD', loca : [33.94609832763672,151.177001953125]},
	{contry : 'SCL', loca : [-33.393001556396484,-70.78579711914062]},
	{contry : 'SDU', loca : [-22.910499572799996,-43.1631011963]},
	{contry : 'VKO', loca : [55.5914993286,37.2615013123]},
	{contry : 'WLG', loca : [-41.3272018433,174.804992676]},
	{contry : 'YVR', loca : [49.193901062,-123.183998108]},
	



]


const connections = [
	[59.651901245117,17.918600082397,	41.8002778,12.2388889],
	[59.651901245117,17.918600082397,	51.4706,-0.461941],
	
	[13.681099891662598,100.74700164794922,	-6.1255698204,106.65599823],
	[13.681099891662598,100.74700164794922,	28.566499710083008,77.10310363769531],
	
	[30.12190055847168,31.40559959411621, -1.31923997402,36.9277992249],
	[30.12190055847168,31.40559959411621, 25.2527999878,55.3643989563],
	[30.12190055847168,31.40559959411621, 41.8002778,12.2388889],

	[28.566499710083008,77.10310363769531,	7.180759906768799,79.88410186767578],
	[28.566499710083008,77.10310363769531,	40.080101013183594,116.58499908447266],
	[28.566499710083008,77.10310363769531,	25.2527999878,55.3643989563],

	[-33.9648017883,18.6016998291, -1.31923997402,36.9277992249],
	
	[-1.31923997402,36.9277992249, 25.2527999878,55.3643989563],
	
	[41.8002778,12.2388889, 51.4706,-0.461941],
	[41.8002778,12.2388889, 40.471926,-3.56264],

	[19.4363,-99.072098,	25.79319953918457,-80.29060363769531],
	[19.4363,-99.072098,	33.94250107,-118.4079971],
	[19.4363,-99.072098,	-12.0219,-77.114304],
	
	[-12.0219,-77.114304,	-33.393001556396484,-70.78579711914062],
	[-12.0219,-77.114304, -34.8222,-58.5358],
	[-12.0219,-77.114304, -22.910499572799996,-43.1631011963],
	
	[-34.8222,-58.5358, -33.393001556396484,-70.78579711914062],
	[-34.8222,-58.5358, -22.910499572799996,-43.1631011963],
	
	[22.3089008331,113.915000916, 13.681099891662598,100.74700164794922],
	[22.3089008331,113.915000916, 40.080101013183594,116.58499908447266],
	[22.3089008331,113.915000916, 31.143400192260742,121.80500030517578],
	
	[35.552299,139.779999, 40.080101013183594,116.58499908447266],
	[35.552299,139.779999, 31.143400192260742,121.80500030517578],
	
	[33.94250107,-118.4079971,	40.63980103,-73.77890015],
	[33.94250107,-118.4079971,	25.79319953918457,-80.29060363769531],
	[33.94250107,-118.4079971,	49.193901062,-123.183998108],
	
	[40.63980103,-73.77890015, 25.79319953918457,-80.29060363769531],
	[40.63980103,-73.77890015, 51.4706,-0.461941],
	
	[51.4706,-0.461941, 40.471926,-3.56264],
	
	[40.080101013183594,116.58499908447266,	31.143400192260742,121.80500030517578],
	
	[-33.94609832763672,151.177001953125,	-41.3272018433,174.804992676],
	[-33.94609832763672,151.177001953125,	-6.1255698204,106.65599823],
	
	[55.5914993286,37.2615013123, 59.651901245117,17.918600082397],
	[55.5914993286,37.2615013123, 41.8002778,12.2388889],
	[55.5914993286,37.2615013123, 40.080101013183594,116.58499908447266],
	[55.5914993286,37.2615013123, 25.2527999878,55.3643989563],
];


	