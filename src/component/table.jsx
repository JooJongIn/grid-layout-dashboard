import React,{useMemo,useState,useEffect,cloneElement,useRef, createElement} from 'react';
import { useExpanded, useTable, useRowSelect, usePagination, useBlockLayout} from 'react-table';

import { FixedSizeList } from 'react-window'

import { _table_, _pagnation_ , _virtual_table_ } from '../styles/table-style';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function SimpleTable({ columns, data, name, isCard, length, children }) {
	useEffect(() => {
		// if(!name) return;
		console.log("table useEffect",  data );
	},[data])


	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable(
    {
      columns: useMemo(()=>columns,[]),
      data: data,
    },
		useBlockLayout,
  );

	let customHeader = Array.isArray(children) ? children[0]  : null;
	let customRow = Array.isArray(children)? children[1]  : children ;

	const tableHeader = !customHeader ? headerGroups.map((headerGroup)=>{
		const headers = headerGroup.headers;

		return(
		<>
			<div className='table-header'>
				{headers.map(column => (
					<div className="table-head-cell">{column.render('Header')}</div>
				))}
			</div>
		</>	
		)
	}): null;

	const tableRow = !customRow ? ({row}) => {
		const {cells} = row;
		return(
			<div className='table-row' >
				{cells.map(cell=>( <div className='table-cell' role="cell">{cell.value}</div>))}
			</div>
		)
	}: null;

	const tableBody = rows.map((row, i) => {
		prepareRow(row);
		
		if(!tableRow) return (cloneElement(customRow, { ...row.original, row:row, role:'cell', id:i , length:length}));
		if(tableRow) return (createElement(tableRow, { ...row.original, row:row, role:'cell', id:i , length:length}));
	});

	

	return (
		<_table_>
		<table {...getTableProps()} className={"table " + (isCard ? "card" : "default")}>
			<thead>
				{customHeader && customHeader}
				{tableHeader && tableHeader}
			</thead>
			<tbody {...getTableBodyProps()}>
				{tableBody}
				{/* {sampleRow} */}
			</tbody>
		</table>
		</_table_>
	);
}


// ===========================================================

export function Pagenation({onpage, length, notNumber, pageSizeList, initLimit}){
	// hook에서 관리 예정
	const [pageSize , setPageSize] = useState( initLimit || 10);
	const [pageNum, setPage] = useState(1);
	const [pageCount, setPageCount ] = useState(Math.ceil(length / pageSize));

	useEffect(() => {
		setPageSize(initLimit);
	},[initLimit]);

	useEffect(() =>{},[length]);

	useEffect(() =>{
		setPageCount(Math.ceil(length / pageSize));
		onpage(pageNum, pageSize);
	},[pageSize, pageNum, length]);
	

	const pageSizeoptions = pageSizeList || [5, 10, 15, 20];

	return(
		<_pagnation_>
		<div className='pagnation'>
			<div className='page-count'>
			{pageCount !== 0 &&<div>
				{pageNum} / {pageCount}
			</div>}
			</div>
			
			<div className='page-controls'>
			<PageButtons page={pageNum} maxPage={pageCount}  setPage={setPage} notNumber/>
			</div>
			
			<div>
				{/* <SelectPageSize pageSize={pageSize} setPageSize={setPageSize} pageSizeList={pageSizeoptions} /> */}
				 
			</div>
			
		</div>
		</_pagnation_>
	)
}

function PageButtons({page, maxPage, notNumber, setPage}){
	let stPage = pageValidationCheck(page, maxPage);
	const pageButtons = createEmptyArray(5).map((a, idx)=>{
		
		if(stPage + idx - 1 >= maxPage) return; 
		return(
			<button className={'numbur-btn ' + (page === (stPage + idx) ? 'select-btn' : '')} onClick={(e)=>{ setPage(stPage + idx); }} value={stPage + idx} >{stPage + idx}</button>
		)
	})

	const previousBtnHandler = () => {
		if(maxPage === 0) return;
		if(page === 1) return;
		setPage(page - 1);
	}
	const nextBtnHandler = () => {
		if(maxPage === 0) return;
		if(page === maxPage) return;
		setPage(page + 1);
	}



	return(
		<>
			<button className={'arrow-btn' + (page === 1 ? " disable" : "") } onClick={previousBtnHandler}>
				{/* <ArrowBackIosNewIcon fontSize={"small"} /> */}
				{"<"}
			</button>

			
			{ !notNumber && pageButtons}

			<button className={'arrow-btn' + (page === maxPage ? " disable" : "")} onClick={nextBtnHandler}>
				{/* <ArrowForwardIosIcon fontSize={"small"}/>	 */}
				{">"}
			</button>
		</>
	)
}

function pageValidationCheck(page,maxPage){
	let resultPage = page;
	if(page === 2) resultPage = 1;
	if(page - 2 > 0) resultPage = page - 2;
	if(maxPage < page) resultPage = maxPage;
	return resultPage;
}

function SelectPageSize({pageSize,setPageSize, pageSizeList}){
	function onSelectSize(event){
		setPageSize(event.target.value);
	}

	const options = pageSizeList.map((size)=>{
		return( <option value={size}>{size}</option> )
	})

	return(
		<select value={pageSize} onChange={onSelectSize}>
			{options}
		</select>
	)
}

function createEmptyArray(num){
	let newArray = []
	for (let index = 0; index < num; index++) {
		newArray.push("");
	}
	return newArray;
}

// ===========================================================

export const VirtualTable = ({data, columns, length, onPage,children  }) => {
	const [renderStartIdx , setStartIdx ] = useState(0);
	const [renderData, setRenderData] = useState([]);
	const [tableWidth, setWidth] = useState(null);
	const [page,setPage] = useState(0);
	const tableRef = useRef();


	let customHeader = Array.isArray(children) ? children[0]  : null;
	let customRow = Array.isArray(children)? children[1]  : children ;

	useEffect(() => {
		if(!tableWidth)window.addEventListener('resize', ()=>{setWidth(tableRef.current.offsetWidth);});
		setWidth(tableRef.current.offsetWidth);
	},[]);

	useEffect(() => {
		setRenderData(data);
	},[data, renderData]);
	


	return(
		<_virtual_table_>
		<div className="VirtualTable" ref={tableRef}>
			<div className='thead'>
				{customHeader}
			</div>
			<FixedSizeList 
			height={400}
			itemCount={length}
			itemSize={35}
			width= {tableWidth}
			onScroll={()=>{
				
			}}
			
			onItemsRendered={({overscanStartIndex, overscanStopIndex})=>{
				setRenderData([]);
				onPage(overscanStartIndex, overscanStopIndex);
				setStartIdx(overscanStartIndex);
			} }
			>
				{({ index, style }) => {
					if(!renderData ||renderData.length === 0){
						return(
							<div style={style}>loading</div>
							)
						}
						const rowData = renderData[index - renderStartIdx];
						return(
							<div style={style}>
							{cloneElement(customRow, {...rowData})}
						</div>
					)}
				}
			</FixedSizeList>
		</div>
		</_virtual_table_>
	)
}

export const InfiniteScroll = ({children, data, length, page, limit, onMore}) =>{
	const [renderData, setRenderData] = useState([]);
	const [dataLength, setLength] = useState(limit);
	const [dataPage, setPage] = useState(page);
	const [isLoading, setLoading] = useState(true);
	const [tableWidth, setWidth] = useState(null);
	const tableRef = useRef();

	let customHeader = Array.isArray(children) ? children[0]  : null;
	let customRow = Array.isArray(children)? children[1]  : children ;

	useEffect(() => {
		if(!tableWidth)window.addEventListener('resize', ()=>{
			setWidth(tableRef.current.offsetWidth);
		});
		setWidth(tableRef.current.offsetWidth);
	},[]);

	useEffect(() => {
		if(!data)return;
		appendData(data);
		setLoading(false);
	},[data]);


	const appendData = (extra) =>{
		console.log("func add Data ", extra);
		const appendedData = renderData.concat(extra);
		setLength(appendedData.length);
		setRenderData(appendedData);
	}


	return(
		<_virtual_table_>
		<div className="VirtualTable" ref={tableRef}>
			<div className='thead'>
				{customHeader}
			</div>
		
		<FixedSizeList 
		height={400}
		itemCount={dataLength}
		itemSize={35}
		width= {tableWidth}
		onScroll={()=>{
			
		}}

		onItemsRendered={({visibleStopIndex})=>{
			if(length === dataLength){
				console.log("item rendered in max length");
				return;
			}

			if((visibleStopIndex + 1) === dataLength){
				setLoading(true);
				setPage(dataPage+1);
				onMore(dataPage+1, limit);
			}

		} }
		>
			{({ index, style }) => {
				if(dataLength < index &&isLoading){
					return(
						<div style={style}>loading</div>
					)
				}
				const rowData = renderData[index];
				
				return(
					<div style={style}>
						{cloneElement(customRow, {...rowData})}
					</div>
				)}
			}
		</FixedSizeList>
		</div>
		</_virtual_table_>
	)
}

export const PageTable = ({data, name, children, columns}) => {
	const [tableData, setData] = useState([]);
	const [dataLength, setLength] = useState(0);


	useEffect(() => {
		if(!data)return;
		if(name)console.log("page table useEffect", name, data, data.length);
		
		setLength(data.length);
	},[data]);

	const onPage = (page, limit) =>{
		
		if(!data)return;
		let stIdx = (page - 1) * limit;
		let edIdx = page * limit < dataLength ? page * limit : dataLength;
		let viewData = data.slice(stIdx, edIdx);
		let ct = 0;
		viewData.map((d)=> {
			
			d.idx = stIdx + ct; ct++;
		})
		setData(viewData);
		
	}

	return (
		<>
		<_table_>
			{createElement(SimpleTable,{ data:tableData, children:children, columns:columns, name:name, length:dataLength })}
			<Pagenation length={dataLength} onpage={onPage} />
		</_table_>
			
			{/* <CutomPagination length={dataLength} onpage={onPage} pageComponent={pageComponent}/> */}
		</>
	)
}


export const Table = (props) => {
	
	if(props.Infinte)return createElement(InfiniteScroll,{ ...props});
	if(props.virtualizing)return createElement(VirtualTable,{ ...props}); 
	if(props.page)return createElement(PageTable,{ ...props}); 
	
	return createElement(SimpleTable,{ ...props});
	
}



