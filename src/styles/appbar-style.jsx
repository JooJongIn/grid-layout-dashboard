import styled from 'styled-components'


export const _appbar_ = styled.div`
	height: 45px;
	width: 100%;
	
	z-index: 7;

	li{list-style-type: none;}
	color: white;
	min-width: 1680px;
	.appbar{
		height: 100%;
		width: 100%;

		min-width: 1680px;

		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0 auto;
		background-color: rgba( 255, 255, 255, 0.5 );
		box-shadow: 1px 1px 25px 5px rgba( 31, 38, 135, 0.25 );
		z-index: 10;
		
	}

	.dim{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba( 0, 0, 0, 0.2 );
	}

	label.btn_toggle {display:inline-flex;align-items:center;gap:3px;cursor:pointer;height:32px;margin:0 7px}
	.toggle_text {font-size:14px;font-weight:500;padding-left:2px}
	.chk_toggle[type="checkbox"] {appearance: none;position: relative;border: 0 none;background-color:rgba(255,255,255,0.4);border-radius: 14px;width: 35px;height: 14px;}
	.chk_toggle[type="checkbox"]::before {content: "";position: absolute;top:2px;left: 3px;width: 10px;height: 10px;border-radius: 50%;transform: scale(0.8);background-color: #fff;transition: left 250ms linear;}
	.chk_toggle[type="checkbox"]:checked {background-color: #00aeff;}
	.chk_toggle[type="checkbox"]:checked::before {background-color:white;left: 23px;}

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

	.history-btn-area{
		display: flex;
		align-items: center;
        
        .icon-btn{
            margin: 0 5px;
			cursor: pointer;
        }
	}

	.appbar-component-buttons{
		display: flex;
		align-items: center;
	}
    
    .appbar-button{
        margin: 0 3px;
        cursor: pointer;
        border: 1px solid lightgray;
        border-radius: 5px;
        padding: 5px 10px; padding-top: 8px;
        background-color: white;
    }

	.top-pannel-area{
		z-index: 2;

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

	:root {
	--text-black: #333;
    --text-white: #fff;
    --white-box: rgba(255,255,255,0.75);
    --black-box: rgba(0,0,0,0.75);
    --bg-color: #154fd9;
}



`