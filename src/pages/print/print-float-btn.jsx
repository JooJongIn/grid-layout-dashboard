import { useEffect, useState, useContext } from 'react'
import moment from 'moment';

import { MainContext } from "../../provider/MainProvider";
import { Svg4Color } from '../../component/svg-color';

import { useReactToPrint } from "react-to-print";

import dashboardIcon from '../../assets/svg/dashboard-icons/material-symbols_dashboard.svg'
// import printIcon from '../../assets/svg/dashboard-icons/mdi_printer-outline.svg'
import pdfIcon from '../../assets/svg/dashboard-icons/tabler_pdf.svg'
import backIcon from '../../assets/svg/dashboard-icons/icon-park-solid_back.svg'
import printIcon from '../../assets/images/ico_pdf.svg'

export const FlaotBtn4Print = ({stageRef, currentPage, bodyRef, unSelect}) => {
    const mainContext = useContext(MainContext);
	const themeStyle = mainContext?.themeStyle || {};
	const {theme} = themeStyle;
    
    // const handlerBtnClick = () => setPrintMode(!isPrint);

    const date = moment();
    const dStr = date.format('YYMMDD-');
    let name = currentPage ? dStr + (currentPage?.title || "") : dStr;
    name += "-dashboard";

    const handlePrint = useReactToPrint({
		content: () => stageRef.current,
		documentTitle:  name,
		// onAfterPrint: () => alert("파일 다운로드 후 알림창 생성 가능")
	});

    const handlePrint3 = useReactToPrint({
		content: () => bodyRef.current,
		documentTitle:  name,
		// onAfterPrint: () => alert("파일 다운로드 후 알림창 생성 가능")
		onBeforePrint: () => unSelect()
	});

    const handlePrint2 = () => {
        window.print();
    }
    return(
        <div className='float-area'>

            <div className="btn_report">
                <a href="#" onClick={handlePrint3}>
                    <img src={printIcon} alt="" />
                    <div>PDF</div>
                    <div>Report</div>
                </a>
            </div>
        </div>
    )
}