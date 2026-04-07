import styled from 'styled-components'

export const _form_ = styled.div`
	margin: 10rem auto;
	width: 50%;

	.form-container{
		/* border: 1px black solid; */
		border-radius: 20px;
		padding: 5rem;
		.input-container{
			margin: 2rem 0;
			.input-main{
				display: flex;
				flex-direction: row;

				.input-label{
					width: 10%;
					height: 35px;
					display: flex;
					place-items: center;

				}
				.input-box{
					flex: 1;
					border-bottom: 1px solid black;
					height: 35px;
					input{
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.form-button-area{
			display: flex;
			justify-content: end;
			.form-submit{
				margin-top: 1rem;
				margin-bottom: 2rem;
				
				width: 60px;
				height: 30px;
				border: 1px solid black;
				border-radius: 5px;
				cursor: pointer;
				
			}
		}



	}
   
`