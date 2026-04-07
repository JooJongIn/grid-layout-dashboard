import { useEffect, useState, useRef } from 'react'
import { SettingsInput, SettingsInputJson, SettingSelect, SettingMultiSelect, SettingsArea, SettingCheckbox } from './common/input'

import styled from 'styled-components';
import closeImg from "../../assets/svg/icons2/close_btn.svg";
import copyIcon from "../../assets/images/ico_copy-black.svg";


import ListIcon from "../../assets/svg/dashboard-icons/table-large.svg";
import BarChartIcon from "../../assets/svg/dashboard-icons/chart-bar.svg";
import LineChartIcon from "../../assets/svg/dashboard-icons/chart-line.svg";
import PieChartIcon from "../../assets/svg/dashboard-icons/chart-pie.svg";
import numberGauge from "../../assets/svg/dashboard-icons/text_gauge.svg";
import arcGauge from "../../assets/svg/dashboard-icons/arc_gauge.svg";
import arcStatusIcon from "../../assets/svg/dashboard-icons/arc_status.svg";
import radarchartIcon from "../../assets/svg/dashboard-icons/ant-design_radar-chart-outlined.svg";
import divideIcon from "../../assets/svg/dashboard-icons/divide.svg";
import mapIcon from "../../assets/svg/dashboard-icons/map.svg";
import moment from 'moment';

import { background } from '@chakra-ui/react';

import { dashobardDBUrl } from '../../ref/url'

import { onPost } from '../utils'
import { _popup_ } from '../../styles/popup-style';

const iconUrls = {
    Line: LineChartIcon,
    Bar: BarChartIcon,
    Pie: PieChartIcon,
    Radar: radarchartIcon,
    List: ListIcon,
    Gauge: numberGauge,
    DivideGauge: divideIcon,
    Status: arcStatusIcon,
    ArcGauge: arcGauge,
    Map: mapIcon,
}



const btnColorObj = {
    "QUERY" : "#FF2069",
    "REST" : "#023AFF",
}


export const ApiCards = ({domainInfo, selectApi, openId, setOpen, apiInfos, searchResult, setApis, onDelete, sortCol, categoryList, copyApi}) => {
    const [mainDomain, setDomain] = useState( null );
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if(!(domainInfo &&  domainInfo.url))return setApis([]);
        let body = { dimainId: domainInfo.id, sort:sortCol }
        getApis(body, (result) => {
            const apisResult = result.row;
            if(apisResult && Array.isArray(apisResult))setApis(apisResult);
        })
        const domain = domainInfo.url;
        setDomain(domain);
    },[domainInfo, sortCol])

    useEffect(() => {
        if(!openId)return selectApi(false) 
        let target = apiInfos.find(info => info.id === openId);
        if(target)selectApi(target);
    },[openId])

    useEffect(() => {
        console.log('delete', isDeleteModalOpen);
    },[isDeleteModalOpen])

    const handlerCopyApi = (item) => {
        copyApi(item);
    }


    const Apis = (searchResult ? searchResult : apiInfos).map((info, idx) => <ApiCard key={info.name + idx} item={info} idx={idx} openDeleteModal={setDeleteModalOpen}
        onDelete={onDelete} openId={openId} setOpen={setOpen} categoryList={categoryList} handlerCopyApi={handlerCopyApi} />)

    return(
        <>
        <div className='api-forms scroll-bar'>
        {/* {(domainInfo && domainInfo.id)  &&<>
            
            {isAddformOpen &&  <AddApiForm onInsert={handlerApiInsert} close={handlerCloseAddForm}/>}
        </>} */}
        {Apis}

        </div>
        { isDeleteModalOpen && (
			<DeleteConfirmModal
				target={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onDelete={onDelete}
			/>
		)}
        </>
    )
}

const DeleteConfirmModal = ({target, onClose, onDelete}) => {

	const handlerDelete = () => {
		onDelete(target);
		onClose();
	}


	return(
		<>
		<_popup_ wid={320} hig={180} >
		<div className='popup'>

			<div className='popup-body'>
				<_snapshot_popup_content_>
				<div className='popup-content  del-text'>
					삭제하시겠습니까?
				</div>

				<div className='btn-area2 sm'>
					<div className='text-btn blue' onClick={handlerDelete}>
						삭제
					</div>

					<div className='text-btn gray' onClick={onClose}>
						취소
					</div>
				</div>
				</_snapshot_popup_content_>
			</div>
		</div>
		<div className='dim' onClick={onClose}></div>
		</_popup_>
		</>
	)
}

const _snapshot_popup_content_ = styled.div`
	width: 100%; height: 100%;
	
	
	input:focus,
	select:focus,
	textarea:focus,
	button:focus { outline: none;}

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.form{ width: 100%; }	

	.input-container{
		width: 100%;
		padding-bottom: 10px;
		.input-main{	
			display: flex; flex-direction: column;
			
			.input-label{
				padding: 5px;
				font-size: 14px;
				display: flex; align-items: center;
			}
			.input-box{
				flex: 1; padding: 5px; font-size: 13px;
				border: 1px solid #dedede;
				border-radius: 6px;
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


	.btn-area2{
		display: flex;
		width: 100%;
		justify-content: center;
		
		/* padding: 10px 20px; */
		padding-top: 10px;
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
	
	.popup-content{
		flex: 1;
		display: flex; align-items: center; justify-content: center;
		font-size: 28px;
	}
`


export const ApiCard = ({setOpen, item, openId, onDelete, categoryList, handlerCopyApi, openDeleteModal}) => {
    const [compoents, setComponents] = useState([]);
    const [dateStr, setDate] = useState("");
    const [category, setCategory] = useState(false);
    useEffect(() => {
        if(item && item.components && Array.isArray(item.components))setComponents(item.components);
        if(item && item.update_date ){
            const date = moment(item.update_date);
            const str = date.format('MM/DD HH:mm');
            setDate(str);
        }
        
    },[item])


    useEffect(() => {
        const category = item.category;
        if(!category)return setCategory(false);
        const target = categoryList.find(c => +c.id === category);
        if(target)setCategory(target.name);
    },[item])

    const handlerClick = (e) => { setOpen(item.id); }

    const handlerCopy = (e) => {
        e.stopPropagation();
        handlerCopyApi({...item, apiType: item.api_type, name: item.name + "_copy"});
    }


    const handlerDel = (e) => {
        e.stopPropagation();
        openDeleteModal(+item.id);
    }

    const btnStyle = {
        backgroundColor: btnColorObj[item.apiType] || "gray"
    }

    const isSelect = item.id === openId;

    return(<>
     <div onClick={handlerClick} className={'card ' + (isSelect ? "selected" : "")}>
        <div className='row'>
            <div className='title' title={item.name}>{item.name}</div>
            <div className='row-divider' >|</div>
            <div className='category' >{category || "N/A"}</div>
            <div className='api-type' style={btnStyle}>{item.apiType}</div>
            <div className='icons'>
            <CompoIcons list={compoents} />
            </div>
            <div className='divider' />
            <div className='dsc' title={item.description}>
                {item.description}
            </div>
            <div className='icons icons-sm'>
                <img className='close_btn' src={copyIcon} onClick={handlerCopy} alt="" srcset="" />
                <img className='close_btn' src={closeImg} onClick={handlerDel} alt="" srcset="" />
            </div>
        </div>
    </div>
    </>)
}


const CompoIcons = ({list}) => {
    const Icons = list.map(li => (<div className='compoent-icon'><img src={iconUrls[li]} alt="" srcset="" /></div>))

    return(<>{Icons}</>)
}

const getApis = async (option, callback) => {
    let body = {
        ...option
    };
    const result = await onPost(dashobardDBUrl + "/getApis", body);
    if(callback)callback(result);
}