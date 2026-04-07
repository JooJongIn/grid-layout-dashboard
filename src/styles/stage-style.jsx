import styled from 'styled-components'

const appbar_height =  "80px"
const left_pannel_width =  "4rem";

/* #ffffffee */
export const _dashboard_ = styled.div`
	width: 100%;
	height: 100%;

	position: relative;
 
	display: flex;
	flex-direction: row;

	/* text selected 숨기기 (drag) */
	-webkit-user-select:none;
	-moz-user-select:none;
	-ms-user-select:none;
	user-select:none;

	.main-page{
		width: 100%;height: 100%;

		display: flex;flex-direction: column;
		position: relative;

		z-index: 1;
		flex: 1;
		.float-area{
			/* position: absolute; left: calc(100% - 80px); bottom: 40px; */
			position: absolute; right: 20px; bottom: 20px;
			display: flex; flex-direction: column;
			z-index: 10;
		}

		.btn_report {position:absolute;right:20px;bottom:20px;}
		.btn_report a {display:inline-block;width:95px;height:95px;background:linear-gradient(120deg, rgba(26,26,223,1) 0%, rgba(44,29,143,1) 100%);border-radius:50%;text-align:center;color:#fff;padding-top:14px;transition:1s}
		.btn_report a {display: flex; flex-direction: column; align-items: center;}
		.btn_report a img {width:24px;height:24px;margin-bottom:2px}
		.btn_report a:hover {border-radius:22px;transition:1s}

		.float-btn{
			width: 50px;height: 50px; border-radius: 50%;
			.icon-img{width: 30px;height: 30px}
			background-color: white; 
			display: flex; justify-content: center; align-items: center;
			position: relative;
			margin-bottom: 10px;
			box-shadow: 0px 12px 10px -6px rgba(0,0,0,0.4);
			
			
			font-size: 17px; font-weight: 800;

			&.white {background-color: #fff;}
			&.blue {background-color: #255DEF;}

			/* &.btn-on {background-color: blue;}
			&.btn-off {} */
		}

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
		position: relative;

		overflow-y: scroll;
		overflow-x: hidden;
		::-webkit-scrollbar {
			width: 0px;
			height: 0px;
		}

	}

	.stage{
		min-width: ${props => props.stageSize + "px"};
		width: ${props => props.stageSize + "px"};
		height: 100%;
		z-index: 1;
		

		/* border-left:  ${props => props.isBorder ? "2px dashed gray": ""};
		border-right:  ${props => props.isBorder ? "2px dashed gray": ""}; */
		.layout{
			min-height: 100%;
			/* max-height: 100%; */
			z-index: 1;
			/* min-width: ${props => props.stageSize + "px"};
			width: ${props => props.stageSize + "px"}; */
		}

	}
	
	.border-for-stage{
		position: absolute;
		top: 30px;
		min-width: ${props => props.stageSize + "px"};
		width: ${props => props.stageSize + "px"};
		height: calc(100% - 30px);
		z-index: 0;
	}

	/* .grid-line{
		background-size: ${p => (p.stageSize / p.stageCol) * 5}px 50px;
		background-color: transparent;
		background-position: 5px 0;
		background-image: 
		linear-gradient(0deg, transparent 9%, rgba(90, 90, 90, 0.15) 10%, rgba(90, 90, 90, 0.15) 11%,
		transparent 12%, transparent 29%, rgba(90, 90, 90, 0.15) 30%, rgba(90, 90, 90, 0.15) 31%, 
		transparent 32%, transparent 49%, rgba(90, 90, 90, 0.15) 50%, rgba(90, 90, 90, 0.15) 51%,
		transparent 52%, transparent 69%, rgba(90, 90, 90, 0.15) 70%, rgba(90, 90, 90, 0.15) 71%, 
		transparent 72%, transparent 89%, rgba(90, 90, 90, 0.15) 90%, rgba(90, 90, 90, 0.15) 91%, 
		transparent 92%, transparent),
		linear-gradient(90deg, transparent 9%, rgba(90, 90, 90, 0.15) 10%, rgba(90, 90, 90, 0.15) 11%, 
		transparent 13%, transparent 29%, rgba(90, 90, 90, 0.15) 30%, rgba(90, 90, 90, 0.15) 31%,
		transparent 32%, transparent 49%,rgba(90, 90, 90, 0.15) 50%, rgba(90, 90, 90, 0.15) 51%, 
		transparent 52%, transparent 69%,rgba(90, 90, 90, 0.15) 70%, rgba(90, 90, 90, 0.15) 71%, 
		transparent 72%, transparent 89%,rgba(90, 90, 90, 0.15) 90%, rgba(90, 90, 90, 0.15) 91%, 
		transparent 92%, transparent) ;
	} */
	.grid-line{
		margin-top: 0;
		margin-left: -1px;
		margin-right: 0px;
		background-size: ${p => p.cellSize.wid}px ${p => p.cellSize.hig}px;
		
		background-image:
		linear-gradient(to right, rgba(0, 0, 0, .1) 1px, transparent 0px),
    	linear-gradient(to bottom, rgba(0, 0, 0, .1) 1px, transparent 0px);


		&.dark-mode{
			background-image:
			linear-gradient(to right, rgba(255, 255, 255, .1) 1px, transparent 0px),
    		linear-gradient(to bottom, rgba(255, 255, 255, .1) 1px, transparent 0px);
		}
		

		border-left: ${props => props.isBorder ? "2px dashed gray": ""};;
		border-right: ${props => props.isBorder ? "2px dashed gray": ""};

		/* display: grid;
		grid-template-columns: repeat(auto, 50px);
		grid-template-rows: repeat(auto, 50px); */
    
    



		/* background-size: ${p => (p.stageSize / p.stageCol) * 5}px 50px;
		background-color: transparent;
		background-position: 5px 0;
		background-image: 
		linear-gradient(0deg, transparent 9%, rgba(255, 255, 255, .1) 10%, rgba(255, 255, 255, .1) 11%,
		transparent 12%, transparent 29%, rgba(255, 255, 255, .1) 30%, rgba(255, 255, 255, .1) 31%, 
		transparent 32%, transparent 49%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .1) 51%,
		transparent 52%, transparent 69%, rgba(255, 255, 255, .1) 70%, rgba(255, 255, 255, .1) 71%, 
		transparent 72%, transparent 89%, rgba(255, 255, 255, .1) 90%, rgba(255, 255, 255, .1) 91%, 
		transparent 92%, transparent),
		linear-gradient(90deg, transparent 9%, rgba(255, 255, 255, .1) 10%, rgba(255, 255, 255, .1) 11%, 
		transparent 13%, transparent 29%, rgba(255, 255, 255, .1) 30%, rgba(255, 255, 255, .1) 31%,
		transparent 32%, transparent 49%,rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .1) 51%, 
		transparent 52%, transparent 69%,rgba(255, 255, 255, .1) 70%, rgba(255, 255, 255, .1) 71%, 
		transparent 72%, transparent 89%,rgba(255, 255, 255, .1) 90%, rgba(255, 255, 255, .1) 91%, 
		transparent 92%, transparent) ; */
	}

	.print-back-border{
		height: 44px;
		/* height: 1670px; */
	}



	.float-btn{
		position: absolute;z-index: 5;
		top: 20px;left: 20px;
		width: 35px;
		cursor: pointer;
		
	}

	.react-grid-item.cssTransforms {
		transition-property: none !important;
	}
	.animated .react-grid-item.cssTransforms {
		transition-property: none !important;
		/* transition-property: transform; */
	}

	.react-grid-layout {
		/* position: relative; */
		transition: none;
	}
	.react-grid-item {
		transition: none;
		transition-property: none;
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
		
		:after{
			display: none;
		}
	}



	.selected-card{
		.react-resizable-handle{
			display: flex;
			justify-content: flex-end;
			align-items: flex-end;
			margin: 2px;
			img{
				width: 25px;
				
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
	
	@media screen and (max-width: 1200px) {
		.stage-scroll{
			overflow-x: scroll;
			::-webkit-scrollbar {
				width: 6px;
				height: 12px;
			}
			::-webkit-scrollbar-track {
				background-color: transparent;
			}
			::-webkit-scrollbar-thumb { 
				background-color: rgba(33,33,33, 0.45);
				&:hover{
					background-color: rgba(33,33,33, 1);
				}
			}
			::-webkit-scrollbar-button {
				display: none;
			}
			::-webkit-scrollbar-track,
			::-webkit-scrollbar-thumb {
				border-radius: 5px;
			}
			::-webkit-scrollbar-horizontal {
				height:6px;
			}
		}
	}
`

export const _card_ = styled.div`
	width: 100%;
	height: 100%;
	
	

	.card{
		&.have-box{
			background-color: ${props => props.bgColor ? props.bgColor + "77" + " !important" : ""};
			color: ${props => props.txtColor4Bg ? props.txtColor4Bg + " !important" : ""};

			:hover{
				background-color: ${props => props.bgColor ? props.bgColor + " !important" : ""};
			}
		}

	}
	.controller-bar{
		margin-top: ${p => p.cardTitleSize}px;
		margin-left: ${p => p.cardTitleSize }px;
		margin-right: ${p => p.cardTitleSize}px;
	}
	.card-title{
		/* width: 100%; */
		
		display: flex;
		align-items: end;
		/* height: ${p => p.cardTitleSize * 2}px; */


		.input-div{
			width: 100%;
			white-space:nowrap;
			overflow : hidden;
			text-overflow : ellipsis;
			font-size : ${p => p.cardTitleSize}px;
			font-weight : 600;
			/* letter-spacing: -2px; */
		}
	}

	.wrapper{
		max-height: ${p => !p.isHeader ? "100%" : `calc(100% - ${p.cardTitleSize * 2 + (p.filter ? 45 : 0)}px)`};
	}

	.c-swiper-pagination{
        display: flex;
        justify-content: flex-end;
        position: absolute; 
        /* width: 100%; */

		top: ${p => (-p.padding.top + 5) - (p.filter ? 45 : 0)}px;
		right: -3px;
		
        &.is-have-header{
            top: ${p => (-p.padding.top - (p.cardTitleSize / 2 ) - 5) - (p.filter ? 45 : 0)}px;
        }
        
        .c-swiper-point{
            background-color: gray;
            border-radius: 50%;
            width: 10px; height: 10px;
            margin: 0 3px;
            cursor: pointer;
        }

        .active{
            background-color: #154fd9;
        }
    }
`

export const _setting_bar_ = styled.div`
	.setting-bar{
		height: 40px;
		
		border: 0.8px solid lightgray;
		border-radius: 5px;

		background-color: white;
		color: #555555;
		font-size : 15px;

		padding-left: 4px;
		padding-right: 4px;

		box-shadow: 0px 100px 80px rgba(108, 73, 172, 0.07), 0px 22.3363px 17.869px rgba(108, 73, 172, 0.0417275), 0px 12.5216px 10.0172px rgba(108, 73, 172, 0.035), 0px 6.6501px 5.32008px rgba(108, 73, 172, 0.0282725), 0px 2.76726px 2.21381px rgba(108, 73, 172, 0.0196802);

		
		.bar-menu{
			height: 100%;

			display: flex;
			flex-direction: row;

			justify-content: flex-start;

			.bar-divider{
				height: calc(100% - 16px);
				width: 0.5px;

				border-left: 1px solid lightgray;
				margin: 8px 2px;
				margin-left: 6px;
			}		
		}


		.setting-button{
			width: 32px;
			padding: 8px;

			display: flex;
			justify-content: center;
			align-items: center;

			
			img{
				width: 100%;
				height: 100%;
			}
			:hover{
				
				cursor: pointer;
			}

		}

		.active-btn{
			background-color: lightgray;
		}

		.setting-select{
			min-width: 100px;
			margin: 0 5px;
			/* margin-left: 2px;
			margin-right: 6px; */
			
			position: relative;
			
			display: flex;
			justify-content: center;
			align-items: center;

			.select-box-wrap{
				display: flex; height: 22px;
				justify-content: center;
				align-items: start;
			}

			.select-box{
				border: 1px solid #DEDEDE; background-color: white;
				border-radius: 6px;
				width: 100%; font-size: 13px;
				/* height: 22px; */
				&.open-box{
					
					border: 1px solid black;

					
				}

				.select-btn{
					min-width: 100px;
					width: 100%; height: 22px; padding: 0 10px;
					display: flex; align-items: center; justify-content: space-between;
					cursor: pointer;
					.select-icon{
						width: 9px; height: 6px;
						/* margin-left: 5px; */
					}
				}

				.select-divider{
					margin: 0 8px;
					width: auto; height: 1px; background-color: lightgray;
				}

				.select-list{
					/* position: absolute;
					top: 22px; */
				}

				.select-item{
					width: 100%; height: 22px; padding: 0 10px;
					display: flex; align-items: center; 
					cursor: pointer;
					:hover{
						background-color: #E7F7FF;
						&:last-child{
							border-bottom-left-radius: 6px;
							border-bottom-right-radius: 6px;
						}
					}
				}
			}


		}	
		.select-dim{
			/* position: fixed;
			top: 0; left: 0;
			width: 100%; height: 100%;
			background-color: rgba(0, 0, 0, 0.5); */
		}	
		
		.setting-input{
			min-width: 120px;
			padding: 0 10px;
			position: relative;
			
			display: flex;
			justify-content: center;
			align-items: center;
			
			input{
				background-color: #D9D9D9;
				padding: 0 5px;
			}
			.enter-icon{
				width: 12px;

				position: absolute;
				right: 15px;

			}
		}

	}

	.border-btn{
		.border-img{
			background-color: white;
			
			border-radius: 50%;
			width: 16px; height: 16px;
		}
	}
	.background-btn{
		.background-img{
			background-color: white;
			
			border-radius: 50%;
			width: 16px; height: 16px;
		}
	}
	
`

export const _appbar_ = styled.div`
	height: 45px;
	width: 100%;
	
	z-index: 2;

	.appbar{
		height: 100%;
		width: 100%;

		min-width: 1680px;

		display: flex;
		align-items: center;

		padding: 0 auto;
		background-color: rgba( 255, 255, 255, 0.5 );
		box-shadow: 1px 1px 25px 5px rgba( 31, 38, 135, 0.25 );
		.modal{
			position: absolute;
			background-color: white;

			width: 180px;
			height: 100px;
			right: 0;
			top: 55px;
			padding: 10px 20px;
			box-shadow: 5px 5px 5px 0 rgb(31 38 135 / 25%);
		}

		.modal-2{
			position: absolute;
			top: 45%;
			left: 50%;
			transform: translate(-50%, -50%);

			background-color: white;

			width: 600px;
			min-width: 600px;
			height: 350px;
			padding: 40px 50px;
			z-index: 1;

			border-radius: 30px;
			box-shadow: 5px 5px 5px 0 rgb(31 38 135 / 25%);

			display: flex;
			flex-direction:column;
			justify-content: space-between;

			.modal-head{
				width: 100%;
				/* height: 40px; */

				margin-bottom: 20px;
				padding-bottom: 8px;

				border-bottom: 1px solid lightgray;

				font-family: 'title';
				font-weight: 700;
				font-size: 26px;

			}

			.modal-content{
				padding: 0 10px;
				input:focus,
				select:focus,
				textarea:focus,
				button:focus {
						outline: none;
				}
				
				.input-container{
					width: 100%;
					padding: 7px 0;
					.input-main{	
						display: flex;
						justify-content: space-between;
						.input-label{
							width: 20%;
							padding: 5px;
							display: flex;
							align-items: center;
						}
						.input-box{
							flex: 1;
							padding: 5px;
							border-bottom: 1px solid ;
						}
					}

				}
				.form-submit{
					margin-top: 20px;
					/* margin: 20px; */
					height: 50px;
					font-size: 20px;

					width: 100%;
					background-color: white;

					cursor: pointer;
				}
			}

			.btn-area{
				display: flex;
				width: 100%;
				justify-content: center;
				
				padding: 10px 20px;
				padding-top: 40px;
				.text-btn{
					font-family: content;
					margin: 0 5px;
					padding: 5px 12px ;

					font-size: 17px;
					background-color: white;

					display: flex;
					align-items: center;
					
					cursor: pointer; 
				}

				.gray{

					border: 1px solid white;
					border-radius: 15px;
					background-color: #aba7a7;
					color: white;

				}
				.blue{
					border: 1px solid white;
					border-radius: 15px;
					background-color: #2652f3;
					color: white;
				}
			}


		}

		.modal-del{
			width: 180px;
			height: 300px;
		}

		.modal-dim{
			left: 0;
			top: 0;
			position: fixed;
			width: 100%;
			height: 100%;
			
			background-color: #373a3d;
			opacity: 0.5;
		}
	}

	.snapshot-area{
		flex: 1;
		padding-right: 20px;
		
		.snapshot-pagination{
			display: flex;
			align-items: center;
		}
		
		
		.icon-btn{
			margin: 0 10px;
			cursor: pointer;
		}
		.move-handle{
			width: 24px;
			display: flex;
			align-items: center;
			margin-left: -9px;
		}
		.close-btn{
			width: 16px;
			display: flex;
			align-items: center;
			margin-left: 7px;
		}
		.isSelect{
			background-color: lightgray;
		}

		.page-append{
			display: flex;
			align-items: center;
			/* margin: 5px; */
			margin: 0 20px;
			input.middle:focus {
				outline-width: 0;
			}
			input:focus{
				outline: none;
			}
	
			.page-append-input{
				background-color: transparent;
				border-bottom: 1px solid lightgray;
				padding: 0 5px;
				margin: 5px 0;
			}
			.page-append-btn{
				height: 30px;
				padding: 6px 15px;
			}

			.icon-button{
				width: 20px;
			}
		}
	}

	.content{
		width: 96%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top-pannel-area{
		z-index: 2;

		
		/* flex:1; */
		/* min-width: 280px; */
		height: 100%;

		position: relative;
		display: flex; align-items: center;

	}

	.page-name-area{
		flex:1;
		padding-top: 20px;
		width: 280px;

		display: flex;
		align-items: center;

		font-size: 30px;
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

	.preview-bar{
		padding: 0 auto;

		.content{
			width: 1600px;
			margin: 0 auto;
			display: flex;
			justify-content: end;

			position: relative;
		}

		.icon-button{
			border-radius: 50%;
			margin: 5px;

			display: flex;
			justify-content: center;
			align-items: center;

			width: 30px;
			height: 30px;

			/* opacity: 0.5; */
			box-shadow: 2px 2px 2px 0 rgba( 31, 38, 135, 0.37 ) ;

		}
		.dark{
			.icon-button{
				background-color: white;
			}
		}
		.light{
			.icon-button{
				background-color: white;
			}
		}


	}

	#wigdet-btn {
		height: 28px;
	}
	.text-btn{
		font-family: content;
		margin: 0 5px;
		padding: 5px 12px;

		font-size: 12px;

		display: flex;
		align-items: center;
		
		white-space: nowrap;
		
		cursor: pointer; 
		
		border-radius: 8px;
		background-color: #a09b9b;
		color: white;

		.btn-icon{
			margin-right: 3px;
		}
	}

	.blue{
		background-color: #2652f3;
	}
	.orange{
		background-color: #FFA63F;
	}
	
	.green{
		background-color: #5EFF5A;
	}
	.blue2{
		background-color: #023AFF;
	}
	.biolet{
		background-color: #8855E8;
	}
	.red{
		background-color: #FF2069;
	}



`
export const _non_user_btns_ = styled.div`
	height: 45px; width: 100%; position: relative;

	.non-user-btns{
		position: absolute; right: 16px; top:18px;
		z-index: 3;
		display: flex; align-items: center;
		.icon-btn{
			margin: 0 7px;
			cursor: pointer;
		}


		img{
			width: 17px; height: 17px;
		}
	}
	.switch-container {
		display: flex; flex-direction: row;
		align-items: center; 
		color: white;
		padding-right: 20px;
		.input-label{
			font-size: 14px;padding-right: 20px; line-height:15px;
		}
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 26px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: #2196F3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196F3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(24px);
		-ms-transform: translateX(24px);
		transform: translateX(24px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
`

export const _version_btns_ = styled.div`
	position: absolute; right: 10px; top: 70px;
	z-index: 5;

	.version-btn{
		font-size: 12px;
	}

	a{
		color: ${props => props.dark ? 'white' : 'black'};
	}
`

export const _user_info_popover_ = styled.div`
	width: 100%;
	height: 100%;
	
	.user-info{
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.popover-btn{
			cursor: pointer;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.text-btn{
				padding: 0 5px;
				vertical-align: middle;
			}
			img{
				width: 20px;
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


export const _color_picker_ = styled.div`
	width: 160px;
	height: 200px;
	padding: 12px;

	background-color: white;

	border-radius: 5px;
	/* padding: 2px 8px; */

	position: absolute;
	left: 0;
	top: 40px;
	font-size: 13px;
	

	.palette-title{
		padding-bottom: 12px;
	}
	.palettes-items{
		width: 100%;
		height: 80px;
		
		display:flex; flex-direction:row; flex-flow:wrap; overflow-y:auto;
		gap: 20px; row-gap: 3px;
		/* justify-content: space-around;
		align-items: center; */
	}
	.half{
		height: 40px;
	}

	.palette-foot{
		padding-top: 7px; 
		border-top: 1px solid #dedede;

		display: flex; justify-content: center; align-items: center;
	}
	.palette-null-btn{
		width: 120px; height: 20px;
		border: 1px solid #B3B3B3; border-radius: 6px;
	}

	

	.palette-item{
		width: 30px;
		height: 30px;
		cursor: pointer;
		border: 1px solid #dedede;
		border-radius: 50%;
	}

	.palette-color{
		border-radius: 50%;
	}


`