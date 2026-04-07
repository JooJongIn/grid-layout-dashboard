import styled from 'styled-components'

export const _basic_menu_ = styled.div`
      width: 100%;
      font-size: xx-large;
      display: flex;
      justify-content: space-around;
   		height: 50px;
`

export const _sub_menu_ = styled.div`
      width: 100%;
      font-size: large;
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #eee;
   
`


export const _popover_menu_ = styled.div`
	width: 100%;
	/* max-width: 180px; */
	height: 100%;
	overflow-y: scroll;
	.popover-menu{
		width: 100%;
		height: 100%;
		padding: 0.5rem 0.8rem;

		
		
		.popover-menu-item{
			border-bottom: 1px solid #eee;
			padding: 5px;
			display: flex;
			flex-direction: row;
			font-size: 12px;
			justify-content: space-between;
			:hover {
				background-color: #bfbfc8;
			}

			select{
				width: 100%;
				background-color: transparent;
			}
			

		}
	}
`

export const _multi_api_menu_ = styled.div`
	width: 100%;
	height: 100%;
	
	.list-item {
		display: flex;
		justify-content: space-between;
		padding: 5px 0;
		margin: 0 3px;
		border-bottom: 1px lightgray solid;
		.item-title{
			max-width: 120px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.item-select{

		}

	}
`