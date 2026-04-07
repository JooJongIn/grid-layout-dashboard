import styled from 'styled-components'


export const _popup_ = styled.div`
    width: 100%; height: 100%; position: fixed; left: 0; top: 0;
	color: #000; z-index: 100;
    .popup{
        position: fixed;
        top: 45%;left: 50%;
        transform: translate(-50%, -50%);
        width: ${p => p.wid ? p.wid : 550 }px !important; height: ${p => p.hig ? p.hig : 600 }px !important;
        background-color: #fff;
		padding: 20px;

		display: flex; flex-direction: column;
		z-index: 3;

		border-radius: 30px;
        box-shadow: 5px 5px 5px 0 rgb(31 38 135 / 25%);

		.popup-head{
			padding-bottom: 10px; display: flex; justify-content: space-between;
			font-size: 20px; font-weight:400;
			.btn{
				cursor: pointer;
			}
		}

		.popup-body{
			display: flex; justify-content: center;align-items:center; flex: 1;
			width: 100%;
		}
	}

    .dim{
        position: fixed; left: 0;top: 0;
        width: 100%;height: 100%;
		background-color: #333;
		opacity: 0.3;
    }


`

export const _setting_popup_ = styled.div`
	z-index: 3;
	
	.popup:after {border-top:0px solid transparent;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #fff;content:"";position: absolute;
		top: -6px;
		left: 420px;
	
	}
	.popup{
		position: absolute;right: 30px;top: 54px;transform: translate(0, 0);
		width: ${p => p.wid ? p.wid : 550 }px; height: ${p => p.hig ? p.hig : 600 }px; background-color: rgba(255, 255, 255, 1);
		padding: 20px; 
		display: flex; flex-direction: column;
		z-index: 4;

		border-radius: 11px;
		
		.popup-head{
			display: flex; justify-content: space-between; align-items: end;
			padding-bottom: 20px;
			.title{font-size: 20px;font-weight:400;}
			.update-link{font-size: 14px;font-weight:400; cursor: pointer; text-decoration: underline}
		}

		.popup-body{
			display: flex; justify-content: center;align-items:center;
			flex: 1;
		}
		
	}


	.dim{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #333;
		opacity: 0.3;
	}
	


`
export const _setting_content_ = styled.div`
	width: 100%;height: 100%; 
	.switch-container {
		padding-top: 20px;
		display: flex; flex-direction: row;
		align-items: center;
	}

	.input-container{
		display: flex; justify-content: end;
	}

	.setting-subtitle{
		font-size: 16px;
	}

	.input-label{
		display: flex; align-items: center;
		padding-right: 8px; font-size: 13px;
	}

	.input-box{
		border: 1px solid #DEDEDE; border-radius: 6px;
		max-width: 220px; height: 32px; flex: 1;
		padding: 0px 6px; font-size: 13px; line-height: 32px;

		input {width: 100%; background-color: transparent;}
	}

	.suffix{
		font-size: 13px; padding-left: 4px;
		display: flex; align-items: center;
	}

	.btns-area{
		padding-top: 10px;
		padding-bottom: 20px;
		display: flex;
		justify-content: space-between;
		font-size: 13px;
		.btn{
			flex: 1; margin-right: 6px;
			height: 22px;
			font-size: 13px;
			
			text-align: center;
			vertical-align: middle;
			line-height: 22px;
			border-radius: 6px;
			background-color: #EFEFEF;
			/* background-color: #D9D9D9; */
			color: black;

			:last-child{ margin-right: 0; }
		}
	}


	.divide-sub{
		/* padding: 20px 0; */
		margin: 30px -30px;
	
		/* border-bottom: 1px solid rgba(0,0,0,0.2); */
	}

	.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 30px;
	}

	/* Hide default HTML checkbox */
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
	height: 22px;
	width: 22px;
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
	-webkit-transform: translateX(29px);
	-ms-transform: translateX(29px);
	transform: translateX(29px);
	}

	/* Rounded sliders */
	.slider.round {
	border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}


	.file-upload-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-top: 20px;
	}

	.file-btn {
		padding: 8px 16px;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.3s;

		&:hover {
			background-color: #e0e0e0;
		}
	}

	.file-name {
		font-size: 14px;
		color: #888;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.btn-area{
		display: flex;
		width: 100%;
		justify-content: center;
		
		/* padding: 10px 20px; */
		padding-top: 45px;
		.text-btn{
			width: 50px; height: 32px;
			font-family: content;
			/* margin: 0 5px; */
			padding: 0px auto ;
			border-radius: 6px;
			font-size: 14px;
			background-color: white;

			display: flex;
			justify-content: center;
			align-items: center;
			
			cursor: pointer; 
		}

		.gray{

			border: 1px solid white;
			/* border-radius: 15px; */
			background-color: #aba7a7;
			color: white;

		}
		.blue{
			border: 1px solid white;
			/* border-radius: 15px; */
			background-color: #00AEFF;
			color: white;
		}
	}

`

export const _test_ = styled.div`
	/* ${props => {
		console.log(props);
		let styleStr = "";
		const styleObj = props.obj;
		for (const styleKey in styleObj) {
			const styleVal = styleObj[styleKey]
			styleStr += `${styleKey} : ${styleVal};`
		}

		return styleStr;
	}} */

	${props => {
		return props.str;
	}}

	

`


export const _setting_popup_api_ = styled.div`
	z-index: 10;

	.api-manager-popup{
		position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);
		min-width: 1200px; width: 100%;height: 100%;background-color: white;
		padding: 50px;
		display: flex; flex-direction: column;
		z-index: 4;
		
		.popup-head{
			display: flex; justify-content: space-between; 
			.title{font-size: 64px;font-weight:500; text-wrap:nowrap; margin-right:92px}
			.close_btn{width:60px; margin-top: -30px;}
			.head-left{display:flex;}
			.domain-select{ padding-top: 22px;}
		}

		.popup-body{
			display: flex; justify-content: center;align-items:center;
			flex: 1; width: 100%; height: calc(100% - 246px);
			
			
			.constent{
				height: 100%;
				display: flex; flex-direction: column;
				align-items: start; justify-content: start;
				padding: 0 50px; 
				font-size: 14px;
			}

			.content1{
				padding-right: 100px; justify-content: start;align-items:end;
				
			}

			.content2{
				flex: 1;
				/* padding-left: 100px; */
				position: relative; min-width: 1000px;
				overflow-y: scroll;
			}
			.form-area{
				width:100%;
				min-width: fit-content;
			}
		}
		
	}
	
	.dim{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #333;
		opacity: 0.3;
	}

	.domain-select{
		display: flex;width: 100%;
		margin-top: 20px;margin-bottom: 60px;
		.label{ font-size: 24px; margin-right:30px;}

		select{
			flex: 1;
			border: 1px solid lightgray;
		}
	}

	.api-list-head{
		width: 100%; height: 30px; min-width: 825px;
		margin-bottom: 30px;
		display: flex; align-items: center; justify-content: space-between;

		.api-list-head-left{
			height: 20px;
			display: flex; align-items: center;
			min-width: 500px;

			.divider-lg{
				width: 1px; height: 100%;
				border-right: 1px solid black;
				margin: -1px 10px;
			}
		}

		.sort-btns{
			display: flex; min-width: 205px;
			.sort-btn{font-size:15px;  cursor: pointer; color:#aaa}
			.divider{ border-right:1px solid lightgray; margin: -1px 10px; }
			.selected{ color: black;}
		}

		/* .api-search{ */
		.search-area{
			display: flex; align-items: center;
			margin-left: 25px;
			font-size: 14px;

			.search-label{
				width: 40px;
				margin-right: 10px;
			}

			.search-box{
				width: 100%; height: 20px; min-width: 200px;
				display: flex; justify-content: center; align-items: center;
				position: relative;
				border-bottom: 1px solid lightgray;

				input, select{
					width: 100%;
					outline: none;

					background-color: transparent;
				}


				.close-btn, .search-btn{
					position: absolute;
					right: -16px; top: 50%;
					transform: translate(0, -50%);
					width: 15px;
					opacity: 0.6;
					cursor: pointer;
					&:hover{
						opacity: 1;
					}
				}

				.search-btn{
					left: -16px;
				}
			}
		}

	}

	.add-btn{
		display: flex; margin-right: 4px;
		color: white; background-color: black;
		width: 126px; padding: 2px 10px;
		font-size: 20px; cursor: pointer;
		img{
			padding-right: 10px;
		}
	}

	.api-form{
		width: 100%; position: relative;
		padding: 20px ;
		background-color: #E8E8E8;
		.form-head{
			display: flex; justify-content: end; margin: 0 -10px; margin-top: -5px; margin-bottom: 5px;
			
			img{
				cursor: pointer;
				width: 24px;
			}
		}

		.use-z-index{ z-index: 1; }
		.input-row{
			display: flex;
		}



		.api-input{
			display: flex; flex: 1;
			position: relative;
			padding: 10px 0;
			min-height: 40px;

			
			.setting-input{
				flex: 1;
				input, select, textarea{width:100%}
			}
			.label{
				/* width: 20%;  */
				min-width: 120px; position: relative;
				white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
				/* padding-left: 20px; */
				padding: 0 10px;
				&.clickable{ cursor: pointer; }
			}

			.small-icon{
				position: absolute; left: -10px; top: 13px;
				width: 12px;
			}
			.del{
				position: relative; width: 20px; height: 20px;
				.icon{
					width: 12px;
				}
			}
		}

		.selected-query{
				
			.label{
				text-decoration: underline dotted;
			}
		}


		.query-form{
			display: flex; flex-direction: row;
		}	

		.query-title{
			min-width: 120px; position: relative;
			/* width: 20%;  */
			white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
			padding: 0 10px; padding-top: 10px;
			display: flex; align-items: start;
			&.multi-query{ align-items: center; }
		}
		.query-list{
			flex: 1; display: flex; flex-direction: column;
			justify-content: start;
			.api-input{
				flex-direction: column; flex: 5;
				min-height: min-content;

				input, select{
					border-radius: 4px;
				}
			}

			.md{
				max-width: 160px;
				.label{
					max-width: 100%;
				}
				.setting-input{
					min-width: 0;
					input, select{
						width: 100%;
						min-width: 0;
					}
				}
			}
			.sm{
				max-width: 100px;
				.label{
					max-width: 100%;
				}
				.setting-input{
					min-width: 0;
					input{
						width: 100%;
						min-width: 0;
					}
				}
			}
			.query-head{ 
				display: flex; justify-content: space-between;
				height: 22px;

				position: relative; margin-left: 8px;
				.small-icon{ top: 3px; }
			}
			.del{ }
		}
		.add-btn-area{
			display: flex; justify-content: end;
			margin-right: 20px;
			.add{
			}
		}
		.del-btn-area{
			display: flex; justify-content: end; align-items: center;
			margin-right: 20px;
			.del{
				width: 24px;
			}
		}
		.derive-form{
			.multi-query{
				padding-bottom: 30px;
			}
			.label{
				padding-bottom: 5px;
			}
			.del{
				margin-top: 10px;
			}
		}

	}
	
	.api-forms{
		.selected{background-color: #cfcfcf;}
	}
	.card{
		width: 100%;
		height: 42px;
		/* border: 1px solid black; */
		border-bottom: 1px solid black;
		padding: 10px;
		min-width: 700px;
		max-width: 820px;
		
		:hover{ background-color: #cfcfcf; }
		:last-child{ border-bottom: 0; }
		.main-row{
			height: 100%;
		}
		.row{
			display: flex; cursor: pointer; 
			
			.col-1{
				padding-right: 12px;
				margin-right: 12px;
				border-right: 1px solid;
			}

			.title{
				width: 220px; 
				margin-right: 5px; 
				overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
			}

			.row-divider{
				
				margin: 0 10px;
			}

			.category{
				width: 120px; 
				margin-right: 5px; 
				overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
			}

			.dsc{
				display: flex; align-items: center;
			}
						
			.api-type{
				background-color: black; color: white;
				text-align: center; width: 40px; 
				font-size: 10px;font-weight: 700;
				padding: 0 auto; padding-top: 4px; margin-right: 10px;
			}
			.icons{
				width: 110px; overflow: hidden; display: flex;
				.compoent-icon{ display:flex; width:18px; margin-right:5px}
				
			}

			.icons-sm{
				width: auto;
			}

			.close_btn{
				width: 22px;
				padding: 2px;
				margin-left: 3px;
				opacity: 0;
				:hover{
					opacity: 1 !important;
				}	
			}
			:hover{
				.close_btn{
					opacity: 0.6;
				}
			}
			/* .divider{
				border-right: 1px solid black;
				margin: -7px 5px;
				margin-top: -9px;
			} */

			.dsc{
				/* height: 100%; */
				/* display: flex; */
				margin-right: 5px;
				flex:1; white-space: nowrap;

				
				overflow: hidden; text-overflow: ellipsis;
			}
		}
	}




	.setting-input{
		min-width: 120px;
		padding: 0 10px;
		/* position:  */
		
		display: flex;
		justify-content: center;
		align-items: center;

		
		input, select, .input-box, .select-btn{
			/* width: 180px; */
			min-width: 180px;
			background-color: white;
			padding: 0 5px;
			flex: 1;


			height: 20px; border-radius: 0;
			
		}

		select{
			padding: 0;
		}
		.select-btn{
			padding-top: 3px; flex: 1;
		}

		/* select{
			padding: 3px 5px;
		} */
		.enter-icon{
			width: 12px;

			position: absolute;
			right: 15px;

		}
	}

	.multi-select{
		min-width: 120px;
		padding: 0 10px;
		position: relative;
		flex: 1;


		.multi-select-box{
			width: 100%; height: 100%;
			background-color: white;
			padding: 3px 5px; cursor: pointer;
		}
		.pocus{
			/* outline: 1px solid blue; */
			 box-shadow: 0 0 5px rgba(81, 203, 238, 1);
			 /* border: 1px solid gray; */
		}

		.multi-select-dim{
			width: 100%;height: 100%;
			left: 0;top:0;
			position: fixed;
			background-color: transparent;
		}
		
		.multi-select-popover{
			z-index: 1000;
			margin-top: 3px;position: absolute;
			background-color: white; box-shadow: 1px 1px 25px 5px rgba( 31, 38, 135, 0.25 );
			border: 1px solid rgba(0, 0, 0, 0.15);
			width: calc(100% - 20px);
			padding: 10px;
		}

		.select-item{
			display: flex;
			padding: 3px 5px; cursor: pointer;
			input[type=checkbox]{
				width: 12px;
				margin-right: 5px;
			}

			.select-label{
				padding-top: 3px;
			}
			:hover{
				background-color: lightgray;
			}

			font-size: 14px;
			color: #838489;
		}
	}



	.taps{
		
		display: flex;
		.tap{
			width: 120px;
			padding: 1px 10px;
			background-color: #DBDBDB;
			color: white;
			font-size: 20px;
			text-align: center;
		}
		.selected-tap{
			color: black;
			background-color: #E8E8E8;
		}
	}

	.param-selects{
		width: 100%;
		display: flex;
		align-items: center;
		
		margin: 20px 0;
		

		.param-select{
			display: flex;
			margin-right: 20px;
			font-size: 14px;
			.label{
				margin-right: 20px;font-size: 16px;
				white-space: nowrap;
				

				display: flex; align-items: center;
			}
			select{
				min-width: 150px;
				border: 1px solid black;
			}
		}
	}

	.setting-checkbox {
		min-width: 120px;
		padding: 0 10px;
		/* position:  */
		
		display: flex;
		justify-content: start;
		align-items: center;

	}

	.setting-input{
		position: relative;

	}

	.select-list{
		position: absolute;
		left: 10px; top: 20px;
		background-color: white;
		width: calc(100% - 20px);
		padding: 10px;
	}

	.select-item{
		padding: 3px 5px; cursor: pointer;
	}


	.middle-row{
		width: 100%;
		display: flex; align-items: center; justify-content: space-between;

		margin: 20px 0;
		margin-bottom: 40px;
	}

	.icons-flex{
		display: flex; 
		.compoent-icon{
			margin-right: 10px; cursor: pointer;
			opacity: 0.5;
		}
		.selected{ opacity: 1;}
	}

	.preview{
		overflow-y: scroll;
		width: 100%;flex: 1;
		min-height: 200px;
		
		.row{
			width: 100%;
			/* display: flex; */
			border: 0 solid black;
			border-width: 0 0 0 1px;
			/* :first-child{
				.cell{background-color:#E2E1E1}
			} */
			:last-child{
				border-width: 0 0 1px 1px;
			}
		}
		.cell{
			/* flex: 1; */
			border: 0 solid black;border-width: 1px 1px 0 0;
			padding: 5px;  
			
		}
	}

	.btn-area{
		position: absolute;
		top: -50px; right: -8px;
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;

		.form-btn{
			background: violet;
			width: 75px;
			padding: 2px 0;
			padding-top: 6px;
			color: white;
			font-size: 16px;
			margin: 0px 8px;
		}
		.save{
			background-color: #545454;
		}
		.delete{
			background-color: #BC4949;
		}
	}

	.scroll-bar{
		width: 100%;
		overflow-y: scroll;
		
		::-webkit-scrollbar {
			width: 5px; 
		}
		::-webkit-scrollbar-thumb {
			background: #E2E1E1;
			border-radius: 10px;
		}

		::-webkit-scrollbar-track {
			display : none;
		}
	}
`