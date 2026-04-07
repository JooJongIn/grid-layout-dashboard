import styled from 'styled-components'

export const _table_ = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	/* margin: 10rem auto; */
	.default{
		.table-header{
			height: 3rem;
			margin-bottom: 1rem;
		}
		.table-row{
			height: 2.8rem;
			padding: 0 7px;
		}
	}
	.card{
		.table-header{
			height: 1.8rem;
			margin-bottom: 0.7rem;
		}
		.table-row{
			height: 1.6rem;		
			padding: 0 7px;
		}
	}
	table{
		width: 100%;
		display: table;
		.table-header{
			background: rgb(238, 238, 238);
			

			color: #838489;
			font-size: 15px;
			font-weight: 400;

			border-radius: 5px;
			
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			
			.table-head-cell{
				font-weight: 400;
				flex: 1;
				text-align: center;
				/* min-width: 8rem; */
			}

		}
		.table-row{
		font-size: 13px;
		color: #838489;

		display: flex;
		flex-direction: row;
		align-items: center;

		/* height: 2.8rem;		 */

		.table-cell{
			text-align : center;

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			flex: 1;

			vertical-align: middle;
		}
		}
	}
	


`

export const _pagnation_  = styled.div`
	.pagnation{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		/* margin-top: 1.5rem; */

		font-size: 12px;
		background-color: transparent;
		.page-controls{
			display: flex;
		}

		button{
			
			width: 1.5rem;
			height: 1.5rem;

		}
		.numbur-btn{
			// border: 1px solid rgba(0, 0, 0, 0.2);
			// border-radius: 25px;
		}

		.select-btn{
			// border: 1px solid rgba(0, 0, 0, 0.2);
			color: white;
			border-radius: 9px;
			background-color: #FF6904;
		}
		.arrow-btn{
			
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin: 0 1rem;
		}
		.disable{
			color: gray;
		}
	}
`



export const _virtual_table_  = styled.div`
	.table-header{
			background: rgb(238, 238, 238);
			height: 3rem;
			margin-bottom: 1rem;

			color: #838489;
			font-size: 15px;
			font-weight: 400;

			border-radius: 5px;
			
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			
			.table-head-cell{
				font-weight: 400;
				flex: 1;
				text-align: center;
				/* min-width: 8rem; */
			}

		}
		.table-row{
		font-size: 13px;
		color: #838489;

		display: flex;
		flex-direction: row;
		align-items: center;

		height: 2.8rem;		

		.table-cell{
			text-align : center;

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			flex: 1;

			vertical-align: middle;
		}
		}
`