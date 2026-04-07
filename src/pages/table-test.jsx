import React, { useEffect, useState } from 'react';
import { Table,Pagenation } from '../component/table';
import {store} from '../store';
import { _table_ } from '../styles/table-style';
import { _container_,_horizontal_flex_items_ } from '../styles/layout';
import { Route, Routes, Link } from 'react-router-dom';


const url = "https://626a2d88737b438c1c4335e4.mockapi.io/api/test/search"

export const TableTest = () => {
	const {
		findeOne, row,
		page, limit,
		onPaging,
		searched, onSearch,
		onEdit,
		onPost,
		all
	} = store(url)

	useEffect(()=>{
		console.log("use effect alll is",all);
	},[all])


	const LivePageTable = () =>{
		return(
			<_container_ >
			<div className='container-title'>page live</div>
			<Table data={ Array.isArray(searched) ? searched : []} columns={columns4Table}>
				<Header />
				<Row />
			</Table>
			<Pagenation length={100} onpage={(a,b)=>{onPaging(a,b);}}/>
		</_container_>
		)
	}
	const UnLivePageTable = () =>{
		return(
			<_container_ >
					<div className='container-title'>page unlive</div>
					<Table page data={all} columns={columns4Table}>
						<Header />
						<Row />
					</Table>
				</_container_>
		)
	}
	const VirtualTable = () =>{
		return(
			<_container_ >
			<div className='container-title'>virtualizing</div>
			<Table virtualizing data={all} columns={columns4Table} length={100} onPage={()=>{}}>
				<Header />
				<Row />
			</Table>
		</_container_>
		)
	}
	const InfinteTable = () =>{
		return(
			<_container_ >
					<div className='container-title'>Infinte</div>
					<Table Infinte data={all} columns={columns4Table} length={100} page={0} limit={10}  onMore={()=>{}}>
						<Header />
						<Row />
					</Table>
				</_container_>
		)
	}

   return (
      <_horizontal_flex_items_>
				<div>


				<Link to="/table-test/page-live">page-live</Link>
				<Link to="/table-test/page-unlive">page-unlive</Link>
				<Link to="/table-test/virtual">virtual</Link>
				<Link to="/table-test/infinte">Infinte</Link>

				</div>

				
				<Routes >
					<Route path='table-test' element={<LivePageTable/>} />
					<Route path='page-live' element={<LivePageTable/>} />
					
					<Route path='page-unlive' element={<UnLivePageTable/>} />
					<Route path='virtual' element={<VirtualTable/>} />
					<Route path='infinte' element={<InfinteTable/>} />

				</Routes>
			
      </_horizontal_flex_items_>
   );
}

const Header = () => {
	return(
		<div className="table-header">
			<div className="table-head-cell">이메일</div>
			<div className="table-head-cell">생일</div>
			<div className="table-head-cell">전화번호</div>
			<div className="table-head-cell">이름</div>
		</div>
	)
}

const Row = (props) => {
	const {email,birthDay, phoneNum, name,  idx, length } = props;

	return(
		<>
		<div className='table-row'>
			<div className='table-cell'>{email}</div>
			<div className='table-cell'>{birthDay}</div>
			<div className='table-cell'>{phoneNum}</div>
			<div className='table-cell'>{name}</div>

		</div>
		</>
	)

}


const columns4Table = [
	{ accessor: 'email', title: '내선번호' },
	{ accessor: 'birthDay', title: 'IP' },
	{ accessor: 'phoneNum', title: '시간' },
	{ accessor: 'name', title: 'ID' },
]