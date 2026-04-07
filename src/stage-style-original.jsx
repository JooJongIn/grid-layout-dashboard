import styled from 'styled-components'

const appbar_height =  "80px"
const left_pannel_width =  "4rem";

export const _dashboard_ = styled.div`
	width: 100%;
	height: 100%;

	position: relative;
 
	display: flex;
	flex-direction: row;
	.main-page{
		width: 100%;
		/* height: calc( 100% - ${appbar_height}); */
		height: 100%;

		display: flex;
		flex-direction: column;

		flex: 1;

		/* background: radial-gradient(closest-side, #3f87a6, #ebf8e1, #f69d3c); */
		/* background-color: rgb(243,243,243); */

		/* background-image: url("../assets/stage-bg.png"); */
		
	}

	.left-pannel-area{
		width: ${left_pannel_width};
		height: 100%;
		display: flex;
		align-items: center;
		margin-left: 1px;
	}


	#stage-main-contant{
		width: 100%;
		flex: 1;
		padding-top: 30px;

		display: flex;
		flex-direction: row;	

		justify-content: center;

		overflow-y: scroll;
		overflow-x: hidden;
	}

	.stage{
		width: 1600px;
		height: 100%;
		z-index: 1;
		.layout{
			min-height: 100%;
			/* max-height: 100%; */
			z-index: 1;
		}

	}

	/*  for stage grid placehold */
	.react-grid-item.react-grid-placeholder {
		background: transparent;
		border: 3px dashed gray;
		opacity: 0.2;
		transition-duration: 100ms;
		z-index: 2;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
	}

	.react-resizable-handle{
		background-image: none;
		display: none;
	}



	.selected-card{
		.react-resizable-handle{
			display: flex;
			justify-content: flex-end;
			align-items: flex-end;
			padding: 5px;
			img{
				width: 10px;
				
			}
		}
		.react-resizable-handle::after{
			/* background-color: azure;
			content: "";
			position: absolute;
			right: 3px;
			bottom: 3px;
			width: 5px;
			height: 5px;
			border-right: 2px solid rgba(0, 0, 0, 0.4);
			border-bottom: 2px solid rgba(0, 0, 0, 0.4); */
		}
	}
	
`

export const _card_ = styled.div`
	width: 100%;
	height: 100%;
	

	display: flex;
	flex-direction: column;
	justify-content: start;

	/* border-radius: 14px; */
	border-radius: ${props => props.isSelected ? "0" : "14px" };
	/* border: 1px solid black; */
	/* border: ${props => props.isSelected ? "1px solid rgba( 255, 255, 255, 0.5 )" : "" }; */
	border: ${props => props.isSelected ? "1px dashed black" : "" };
	

	box-shadow: ${props => props.bgColor ? "1px 1px 25px 5px rgba( 31, 38, 135, 0.25 )" : "" };
	background-color: ${props => props.bgColor ? "rgba( 255, 255, 255, 0.4 )": ""};
	-webkit-backdrop-filter: ${props => props.bgColor ? "blur( 5px )": ""};
	backdrop-filter: ${props => props.bgColor ? "blur( 5px )": ""};

	position: relative;

	padding: ${props=>props.bgColor ? "20px 27px" : ""};

	


	:hover{
		/* 테두리 있으면 마우스 오버시에 색변경 */
		/* border: ${props => props.border ? "1px solid blue" : "" }; */
		/* 테두리 없으면 마우스 오버시에 밑줄 생성 */
		/* border-bottom: ${props => !props.border ? "1px solid blue" : "" }; */
	}

	.bar-pos-area{
		position: relative;
		display: flex;
		justify-content: center;
		

		width: 100%;
		height: 1px;
		.bar-pos{
			position: absolute;
			top: -80px;
		}
	}

	.setting-bar{
		
		height: 40px;

		
		border: 0.8px solid lightgray;
		border-radius: 5px;

		background-color: white;

		box-shadow: 3px 3px 5px 0 rgba( 31, 38, 135, 0.37 ) ;

		
		
		.bar-menu{
			height: 100%;

			display: flex;
			flex-direction: row;

			justify-content: flex-start;

			.bar-divider{
				height: 100%;
				width: 0.5px;

				border-left: 1px solid lightgray;
				/* margin: 0 2px; */
			}		
		}


		.setting-button{
			width: 40px;

			padding: 12px;

			display: flex;
			justify-content: center;
			align-items: center;

			

			:hover{
				
				cursor: pointer;
			}

		}

		.active-btn{
			background-color: lightgray;
		}

		.setting-select{
			min-width: 120px;
			padding: 0 10px;
			
			display: flex;
			justify-content: center;
			align-items: center;
			
		}

	}


	.card-controller{
		/* padding-bottom: ${props => props.bgColor ? "20px" : "0"}; */
		input{
				max-width: 100%;
				background-color: transparent;
		}
		
		.controller-bar{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		
			.card-title{
				font-size: 16px;
				color: #333333;
				font-family: title;
				
			}
			.controller-content{
				flex: 1;
			}
			.controller-end{
				width: 100px;
			}
			.search-container{
				position: relative;
				height: 100%;
				border-bottom: 1px solid lightgray;
				.search-input{
					width: 100%;
				}
				.search-button{
					position: absolute;
					right: 2px;
					top: 5px;
					height: 15px;
					width: 15px;
				}
			}
		}

		
		.controller-content{
			flex: 1;
		}
		
	}
	
	.card-filter{
		width: 100%;
		height: 30px;

		input{
			background-color: transparent;
			border-bottom: 1px solid lightgray;
		}

		/* background-color: tan; */

		display: flex;
	}



	.card-content{
		display: flex;
		flex-direction: column;
		padding-top: ${props => props.haveHeader ? props.contentPadding: "0"};
		flex:1;
		.card-chart{
			flex:1;
		}
		
	}
	
	.react-resizable-handle{

	}
`

export const _appbar_ = styled.div`
	height: 80px;
	width: 100%;
	

	


	z-index: 2;
	/* position: fixed; */

	
	/* justify-content: flex-end; */

	margin: 0 auto;

	/* border-bottom: 1px solid black; */
	background-color: white;
	box-shadow: 1px 1px 25px 5px rgba( 31, 38, 135, 0.25 );

	.content{
		width: 1600px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
	}



	
	

	.top-pannel-area{
		z-index: 2;

		
		flex:1;
		/* min-width: 280px; */
		height: 100%;
		


	}

	.page-name-area{
		flex:1;
		padding-top: 20px;
		width: 280px;

		display: flex;
		align-items: center;

		font-size: 36px;
		.title-area{
			flex: 1;
		}
		input{
			background-color: transparent;
			border: 1px solid lightgray;
			:focus{
				outline-width: 0;
				border: 0;
			}
		}
		
	}
`


export const _popover_ = styled.div`
	width: 120px;
	.items{
		display: flex;
		flex-direction: column;
		padding: 10px 5px;

	}
	.item{
		display: flex;
		justify-content: space-between;
		height: 40px;
		.name{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.swatch{
			 width: 60px;
			 cursor: pointer;
			 .color{
					margin: 10px 10px;
					width: 40px;
					height: 20px;
			 }
		}
	}
`