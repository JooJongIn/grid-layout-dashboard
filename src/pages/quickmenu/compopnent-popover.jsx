import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Popover from '@mui/material/Popover';

import {Svg4Color} from '../../component/svg-color'

import { cardDefaultOptions } from '../../ref/component'

import { useStage } from '../../hook/useStage';


import ListIcon from "../../assets/svg/dashboard-icons/table-large.svg";
import BarChartIcon from "../../assets/svg/dashboard-icons/chart-bar.svg";
import LineChartIcon from "../../assets/svg/dashboard-icons/chart-line.svg";
import PieChartIcon from "../../assets/svg/dashboard-icons/chart-pie.svg";
import numberGauge from "../../assets/svg/dashboard-icons/text_gauge.svg";
import arcGauge from "../../assets/svg/dashboard-icons/arc_gauge.svg";
import arcStatusIcon from "../../assets/svg/dashboard-icons/arc_status.svg";
import radarchartIcon from "../../assets/svg/dashboard-icons/ant-design_radar-chart-outlined.svg";
import divideIcon from "../../assets/svg/dashboard-icons/divide.svg";

import closeImg from "../../assets/svg/icons2/close_btn.svg";

import { control4MainApis } from '../../hook/useApi';

import { dashobardDBUrl } from '../../ref/url'

import { onPost } from '../utils'

const domainServerUrl = "http://localhost:3000"
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
}

export const ComponentPopver = ({isPopoverOpen, popoverAnchor, closeModal, isPrint}) => {
    const [apiInfos, setApis] = useState( [] );
    // const [domains, setDomains] = useState( [] );
    const [currentDomain, setcurDomain] = useState( false );
    const { appendCard, setNewCardType} = useStage();
    const { domains, apis } = control4MainApis();

    useEffect(()=>{
        // getDomain((result) => {
        //     const domainsResult = result.row;
        //     if(domainsResult && Array.isArray(domainsResult))setDomains(domainsResult);
        //     if(domainsResult && Array.isArray(domainsResult))setcurDomain(domainsResult[0]);
        // })
    },[])
    
    useEffect(() => {
        // let body = {domainId: 5}
        // getApis(body, (result) => {
        //     const apisResult = result.row;
        //     if(apisResult && Array.isArray(apisResult))setApis(apisResult);
        // })
    },[])


    useEffect(() => {
        if(!apis)return;

        setApis(Object.values(apis));
        
    },[apis])

    const Forms = apiInfos.map((info, idx) => <ApiCard key={info.name + idx} onClose={closeModal}
     item={info} idx={idx} setNewCardType={setNewCardType} domain={currentDomain} />)

    return(
        <_component_popover_>
            <div className='popover'>
                {/* <div className='close-btn' onClick={closeModal}>
                    <img src={closeImg} alt="" srcset="" />
                </div> */}
                {Forms}
            </div>
            <div className='dim' onClick={closeModal}></div>
        </_component_popover_>
    )
}

const ApiCard = ({item, domain, setNewCardType, onClose}) => {
    const {name, components, endpoint, id} = item;

    useEffect(() => {
    },[])

    const icons = components.map((compo) => {
        const icon = iconUrls[compo];
        // let url = domain.url + endpoint;
        return(
        <>
            <GridItem icon={icon} title={compo} setNewCardType={setNewCardType} urlId={id} onClose={onClose} />
        </>)
    })

    return(
        <>
        <div className='apiCard'>
            <div className='api-name' title={name}>
            {name}
            </div>
            <div className='icons' draggable={false}>
            {icons}
            </div>
        </div>
        </>
    )
}

// title={'Status'} icon={arcStatusIcon} appendCard={appendCard} setNewCardType={setNewCardType}
const GridItem = ({title, icon, urlId, setNewCardType, disabled, onClose}) =>{
    useEffect(() => {
        
    },[])

	// 클릭하거나 
	const onMouseDown = (e) =>{	}
    

	const dragStart = (e)=> {
        const cardDefaultOption = cardDefaultOptions[title];
		const cardSize = cardDefaultOption.size;
		const isCardHead = cardDefaultOption.isHeader;
		setNewCardType({...cardSize, type: title, isHeader: isCardHead, urlId:urlId});
        setTimeout(onClose, 100);

		e.dataTransfer.setData("text", e.target.id);
		e.dataTransfer.effectAllowed = "move";
		e.target.style.cursor = "none";
		
	}

	const dragEnd = (e)=> {
		e.target.style.cursor = "pointer";
	}


	return(
		<>
		<div className='grid-item' onMouseDown={onMouseDown} 
			draggable={!disabled} onDragStart={dragStart} onDragEnd={dragEnd}
		>
			<div className='grid-item-icon' draggable={false}>
				<Svg4Color icon ={icon} draggable={false}/>
			</div>
			<div className="grid-item-blur" draggable={false}></div>
		</div>
		</>
		
	)
}



export const _component_popover_ = styled.div`
    z-index: 1;
    
    .popover{
        z-index: 1;
        position: absolute;
        top: 45px;left: 2%;
        width: 220px; max-height: 90%;
        /* height: 320px; */
        background-color: rgba(255, 255, 255, 0.90);
        padding: 10px;
        /* padding-top: 20px; */
        box-shadow: 1px 1px 25px 5px rgba( 31, 38, 135, 0.25 );
         
        overflow-y: scroll;
        ::-webkit-scrollbar {
			width: 5px; 
		}
		::-webkit-scrollbar-thumb {
			background: #E2E1E1;
			border-radius: 10px;
		}

		::-webkit-scrollbar-track {
			display : none;
		}
    }
    .close-btn{ position:absolute; right:5px; top:5px;}
    
    .dim{
        width: 100%;height: 100%;
        position: fixed;left: 0;top: 0;
        
    }

    .apiCard{
        /* display: flex; justify-content: space-between; */
        padding: 12px 10px; height: 65px;
        border-bottom: 1px solid rgba(0,0,0,0.2);

        :last-child{
            border-bottom: 0;
        }
        .api-name{
            overflow: hidden;white-space: nowrap; text-overflow: ellipsis;font-size: 14px;
        }
        .icons{
            display: flex; justify-content: flex-start;
            padding-top: 3px;
        }

        .grid-item{
            position: relative; width: 16px;
            cursor: pointer; margin-right: 5px;

            :hover{
                .grid-item-blur{
                    background-color: rgba(255, 255, 255, 0.5);
                    filter: blur(2px);
                    -webkit-filter: blur(2px);
                }
            }

            .grid-item-blur{
                position: absolute; left: 0;top: 0;
                width: 100%;height: 100%;
            }
        }

    }
`

const getDomain = async (callback) => {
    let body = {};
    const result = await onPost(dashobardDBUrl + "/getDomain", body);
    if(callback)callback(result);
}
const getApis = async (option, callback) => {
    let body = {
        ...option
    };
    const result = await onPost(dashobardDBUrl + "/getApis", body);
    if(callback)callback(result);
}