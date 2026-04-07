import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components'
import { onPost } from '../../utils';

import DataGrid, { SearchPanel, Column } from 'devextreme-react/data-grid';
import '../../../component/style/data-grid.scss';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import alert from '../../../assets/svg/dashboard-icons/alert.svg';
import { Svg4Color } from '../../../component/svg-color';

let tableDbUrl = "http://34.22.70.31:3000";

export default function Table({}) {
	const [gridData, setGridData] = useState([]);

    useEffect(() => {
        onPost(tableDbUrl + "/query", {
            query: "SELECT * FROM Customer"
        }).then(res => {
            setGridData(res.row);
        })
    },[])

    const columns = ["customer_id", "customer_name", "customer_street", "customer_city"];

    const renderCell = (cellData) => {
        const value = cellData.value;
        if (!value) return <span>{value}</span>;
        
        const normalized = String(value).toLowerCase();

        if (normalized === 'warning') {
            return <span className="cell-warning">{value}</span>;
        }
        if (normalized === 'critical') {
            return <span className="cell-critical">{value}</span>;
        }
        if (normalized === 'up') {
            return <div className="cell-icon-up"><ArrowUpwardIcon fontSize="small" /></div>;
        }
        if (normalized === 'down') {
            return <div className="cell-icon-down"><ArrowDownwardIcon fontSize="small" /></div>;
        }

        return <span>{value}</span>;
    };


	return (
		<>
            <DataGrid
                className="custom-data-grid"
                dataSource={gridData}
                remoteOperations={true}
                allowSorting={true} 
                columnAutoWidth={true}
                
    
                showBorders={false}    // 테두리 제거
                showColumnLines={false}  // 세로 선 제거
                showRowLines={true}     // 가로 선 제거
                // searchPanel={{ visible: true, width: 240, placeholder: '검색...' }}


            >

                <SearchPanel visible={true} width={240} placeholder="검색..."  className="drag-cancel" />

                {columns.map((col, idx) => (
                    <Column 
                        key={idx} 
                        dataField={col} 
                        caption={col} 
                        cellRender={renderCell}
                        headerCellComponent={() => 
                    <>
                    <div className='header-cell'>
                        <div className='header-cell-text'>
                            {col}
                        </div>
                        <button className='header-cell-btn'>
                            <Svg4Color svg={alert} color={"#000000"} />
                        </button>
                    </div>
                    </>
                    } />
                ))}
                {/* 필요한 그리드 기능들 */}
                {/* <SearchPanel visible={true} />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <GroupPanel visible={true} />
                <Scrolling mode="virtual" />
                <Paging defaultPageSize={10} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[5, 10, 20]}
                    showInfo={true}
                /> */}
            </DataGrid>
		</>
	)
}


// -- Customer 테이블 데이터
// INSERT INTO Customer (customer_id, customer_name, customer_street, customer_city) VALUES
// ('C001', '김철수', '강남대로 123', '서울'),
// ('C002', '이영희', '부산로 456', '부산'),
// ('C003', '박민수', '대전로 789', '대전'),
// ('C004', '정지원', '광주로 321', '광주'),
// ('C005', '한미영', '인천로 654', '인천');

// -- Loan 테이블 데이터
// INSERT INTO Loan (loan_number, amount) VALUES
// ('L001', 10000000),
// ('L002', 25000000),
// ('L003', 15000000),
// ('L004', 50000000),
// ('L005', 30000000);

// -- Account 테이블 데이터
// INSERT INTO Account (account_number, balance) VALUES
// ('A001', 5000000),
// ('A002', 12000000),
// ('A003', 8000000),
// ('A004', 15000000),
// ('A005', 3000000);

// -- Branch 테이블 데이터
// INSERT INTO Branch (branch_name, branch_city, assets) VALUES
// ('강남지점', '서울', 500000000),
// ('부산중앙', '부산', 300000000),
// ('대전지점', '대전', 250000000),
// ('광주지점', '광주', 200000000),
// ('인천지점', '인천', 350000000);

// -- Payment 테이블 데이터
// INSERT INTO Payment (loan_number, payment_number, payment_amount, payment_date) VALUES
// ('L001', 'P001', 1000000, '2024-01-15'),
// ('L001', 'P002', 1000000, '2024-02-15'),
// ('L002', 'P001', 2500000, '2024-01-20'),
// ('L003', 'P001', 1500000, '2024-01-25'),
// ('L004', 'P001', 5000000, '2024-01-10');

// -- Depositor 테이블 데이터
// INSERT INTO Depositor (customer_id, account_number, access_date) VALUES
// ('C001', 'A001', '2024-02-01'),
// ('C002', 'A002', '2024-02-02'),
// ('C003', 'A003', '2024-02-03'),
// ('C004', 'A004', '2024-02-04'),
// ('C005', 'A005', '2024-02-05');

// -- Loan_Branch 테이블 데이터
// INSERT INTO Loan_Branch (loan_number, branch_name) VALUES
// ('L001', '강남지점'),
// ('L002', '부산중앙'),
// ('L003', '대전지점'),
// ('L004', '광주지점'),
// ('L005', '인천지점');