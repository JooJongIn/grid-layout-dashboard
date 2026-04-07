import styled from 'styled-components'

export const _component_pannel_ = styled.div`
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
	/* display: flex;
	justify-content: center;
	align-items: center; */
	/* padding: 0 auto; */

	/* margin: auto auto; */
	
	
	.grid{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		
		
		.grid-item{
			width: 35px;
			height: 35px;
			margin: 6px 0;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			position: relative;

			:hover{
				.grid-item-blur{
					background-color: rgba(255, 255, 255, 0.5);
					filter: blur(2px);
					-webkit-filter: blur(2px);
				}
			}

			.grid-item-blur{
				position: absolute;
				width: 100%;
				height: 100%;
			}

			

			.grid-item-icon{
				max-width: 20px;
				max-height: 20px;
				z-index: 1;
			}
			
		}
	}


	.divider{
		width: 1px;
		height: 80%;
		margin: 0 20px;
		padding: 15px 0;
		border-left: 0.5px solid black;
	}

	.appbar-icons{ flex: 1; }

	.btn-group{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin:  6px 0;
		
		.icon-button{
			width: 35px;
			height: 35px;
			cursor: pointer;
			img{
				max-width: 20px;
				max-height: 20px;

			}
		}
	}

`

export const _prop_pannel_ =  styled.div`

.bottom-pannel{
	position: fixed;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 250px;
	background-color: white;

	border-top: 1px solid black;
	border-radius: 17px;
	padding: 0.5rem ;
	.pannel-header{
		display: flex;
		
		justify-content: flex-end;
		
	}
	.pannel-content{
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		.pannel-container{
			padding: 2rem;
			border-right: 1px solid black;
			height: 100%;
		
		}
	}
	.pannel-input{
	display: flex;
	flex-direction: row;
	padding: 0.5rem;
	.pannel-input-title{
		width: 20%;

	}
	.pannel-input-content{
		input{
			background-color: transparent;
			border: 1px solid black;
			margin-left: 0.5rem;
			margin-right: 0.5rem;
		}
	}

	}
}
`