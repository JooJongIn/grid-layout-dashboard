import { useEffect, useState } from 'react'


import { control4MainApis } from '../../../hook/useApi';
import { useStage } from '../../../hook/useStage';

import ListIcon from "../../../assets/svg/dashboard-icons/table-large.svg";
import BarChartIcon from "../../../assets/svg/dashboard-icons/chart-bar.svg";
import LineChartIcon from "../../../assets/svg/dashboard-icons/chart-line.svg";
import PieChartIcon from "../../../assets/svg/dashboard-icons/chart-pie.svg";
import numberGauge from "../../../assets/svg/dashboard-icons/text_gauge.svg";
import arcGauge from "../../../assets/svg/dashboard-icons/arc_gauge.svg";
import arcStatusIcon from "../../../assets/svg/dashboard-icons/arc_status.svg";
import radarchartIcon from "../../../assets/svg/dashboard-icons/ant-design_radar-chart-outlined.svg";
import divideIcon from "../../../assets/svg/dashboard-icons/divide.svg";
import mapIcon from "../../../assets/svg/dashboard-icons/map.svg";
import htmlIcon from "../../../assets/svg/dashboard-icons/text_gauge.svg";
import { cardDefaultOptions } from '../../../ref/component'
import { onPost } from '../../utils';

import {dashobardDBUrl} from "../../../ref/url";

const compoTypeObjs = [
    
    {id: "Line", icon: LineChartIcon, text: "차트(선)" },
    {id: "Bar", icon: BarChartIcon, text: "차트(막대)" },
    {id: "Pie", icon: PieChartIcon, text: "파이" },
    {id: "Radar", icon: radarchartIcon, text: "레이다" },
    {id: "List", icon: ListIcon, text: "리스트" },
    {id: "Gauge", icon: numberGauge, text: "숫자" },
    {id: "DivideGauge", icon: divideIcon, text: "분수" },
    {id: "Status", icon: arcStatusIcon, text: "스테이터스" },
    {id: "ArcGauge", icon: arcGauge, text: "아크게이지" },
    {id: "Map", icon: mapIcon, text: "지도" },
    {id: "Html", icon: htmlIcon, text: "HTML" },
]


export const ComponentPopover = ({}) => { 
    const [currentTab, setCurrentTab] = useState( "tab-1" );
    const [currentId4Type, setCurrentId4Type] = useState( false );
    const [currentId4Category, setCurrentId4Category] = useState( false );

    const [currentApiId, setCurrentApiId] = useState( false );
    
    const [apis, setApis] = useState( [] );
    const [apiList, setApiList] = useState( [] );
    const [apiList4Category, setApiList4Category] = useState( [] );

    const [categoryList, setCategoryList] = useState( [] );


    // const { domains, apis } = control4MainApis();
    const { appendCard, setNewCardType} = useStage();

    useEffect(() => {
        onPost(dashobardDBUrl + "/getCategory", {}).then(r => {

            if(r.row)setCategoryList(r.row);
            else setCategoryList([]);
        })
        onPost(dashobardDBUrl + "/getApis", {}).then(r => {
            if(r.row)setApis(r.row);
            else setApis([]);
        })
    },[])

    useEffect(() => {
        setApiList4Category([])
        setApiList([])
        setCurrentId4Type(false)
        setCurrentId4Category(false)
    },[currentTab])





    const tabHandler = (e) => {
        e.stopPropagation()
        setCurrentTab(e.target.dataset.tab)
    }

    const handlerSetTypeId = (id) => {
        setCurrentApiId(false)
        setCurrentId4Type(id)
    }

    const handlerSetCategoryId = (id) => {
        setCurrentApiId(false)
        setCurrentId4Category(id)
    }

    const handlerSetApi = (api) => {
        setCurrentApiId(api.id)
        if(api.compoType)setCurrentId4Type(api.compoType);
    }


    const handleCreateCard = () => {
        if(!(currentId4Type && currentApiId))return alert("카테고리 또는 API를 선택해주세요.");

        const cardDefaultOption = cardDefaultOptions[currentId4Type];
		const cardSize = cardDefaultOption.size;
		const isCardHead = cardDefaultOption.isHeader;
        
		// document.body.style.cursor = 'none';
		// setNewCardType();
        appendCard({...cardSize, type: currentId4Type, isHeader: isCardHead, urlId:currentApiId})
    }

    const handlerOpenApiWindow = (e) => {
        let url = window.location.origin + window.location.pathname;

		const {outerWidth, outerHeight, screenLeft, screenTop} = setNewWindowSize();
        
		window.open(
			url + "#api", '_blank',
			`width=${outerWidth},height=${outerHeight},left=${screenLeft},top=${screenTop}`
		);
    }

    const handlerOpenEditorWindow = (e) => {
        let url = window.location.origin + window.location.pathname;

		const {outerWidth, outerHeight, screenLeft, screenTop} = setNewWindowSize();
        
		window.open(
			url + "#editor", '_blank',
			`width=${outerWidth},height=${outerHeight},left=${screenLeft},top=${screenTop}`
		);
    }


    const setNewWindowSize = () =>{
        let outerWidth = window.outerWidth || 1200;
        let outerHeight = window.outerHeight || 800;
        let screenLeft = window.screenLeft || 200;
        let screenTop = window.screenTop || 200;
        return {outerWidth, outerHeight, screenLeft, screenTop};
    }

    return(
        <>
        <ControlApis4Components name="components" category={currentId4Type} apis={apis} setApiList={setApiList} />
        <ControlApis4ApiType name="category" category={currentId4Category} apis={apis} setApiList={setApiList4Category} />
        <div class="set_layer widget_setbox">
            <ul class="tab_all">
                <li class={"tab_link " + (currentTab === "tab-1" ? "current" : "")} data-tab="tab-1" onClick={tabHandler}>유형별 보기</li>
                <li class={"tab_link " + (currentTab === "tab-2" ? "current" : "")} data-tab="tab-2" onClick={tabHandler}>주제별 보기</li>
            </ul>
            <div class="cont_all">
                {currentTab === "tab-1" && <div id="tab-1" class={"tab_content " + (currentTab === "tab-1" ? "current" : "")}>
                    <ul class="tab_list">
                        {compoTypeObjs.map((item, index) => (
                            <CategoryItem key={index} {...item} onClick={handlerSetTypeId} current={currentId4Type} />
                        ))}
                    </ul>
                    <ul class="tab_sublist">
                        {apiList.map((api, index) => (
                            <ApiItem key={index} api={api} onClick={handlerSetApi} current={currentApiId} />
                        ))}
                    </ul>
                </div>}
                {currentTab === "tab-2" && <div id="tab-2" class={"tab_content " + (currentTab === "tab-2" ? "current" : "")}   >
                    <ul class="tab_list">
                        {categoryList.map((item, index) => (
                            <CategoryItem key={index} {...item} text={item.name} onClick={handlerSetCategoryId} current={currentId4Category} />
                        ))}
                    </ul>
                    <ul class="tab_sublist">
                        {apiList4Category.map((api, index) => (
                            <ApiItem key={index} api={api} onClick={handlerSetApi} 
                            current={currentApiId} current2={currentId4Type} />
                        ))}
                    </ul>
                </div>}
            </div>
            <div class="pop_subbtns">
                <button class="edit_btn b_gray" onClick={handlerOpenApiWindow}>API 생성/관리</button>
                <button class="edit_btn b_gray hide" onDoubleClick={handlerOpenEditorWindow}>API 생성/관리</button>
            </div>
            <div class="pop_btns"><button class="edit_btn b_blue bt_lm" onClick={handleCreateCard}>추가</button></div>
        </div>
        </>
    )
}

const CategoryItem = ({id, icon, text, onClick, current}) => {
    const handleClick = (e) => {
        e.stopPropagation()
        onClick(id)
    }


    return(<li className={current === id ? "current" : ""} onClick={handleClick}>
        <a href="#">{icon && <img src={icon} alt="" />}{text}</a>
    </li>)
}


const nameTypeObj = {
	"Line":"라인차트",
	"Bar":"바차트",
	"List":"테이블",
	"DivideGauge":"분수형",
	"Pie":"파이차트",
	"Status":"스테이터스게이지",
	"ArcGauge":"아크게이지",
	"Radar":"레이더차트",
	"Gauge":"숫자게이지",
	"Map":"지도",
	"Html":"HTML"
} 


const ApiItem = ({api, onClick, current, current2}) => {

    useEffect(() => {
        if(current2)console.log("current2 ", current2);
    },[current2])
    
    const handleClick = (e) => {
        e.stopPropagation()
        onClick(api)
    }
    

    return(<li className={(current === api.id && current2 === api.compoType) ? "current" : ""} onClick={handleClick} title={api.description} >
        <a href="#" 
        // title={api.name + (api.compoType ? ` - ( ${nameTypeObj[api.compoType]} )`: "")}
        >{api.name} {api.compoType && ` - ( ${nameTypeObj[api.compoType]} )`}</a>
    </li>)
}


const ControlApis4Components = ({name, category, apis, setApiList}) => {

    useEffect(() => {

    },[])
    
    useEffect(() => {     

        if(!(apis))return;
        let list = Object.values(apis);
        if(!Array.isArray(list))return;

        

        if(category === "all") {
            return setApiList(list)
        }
        const components = list.filter(api => api.components.includes(category));

        setApiList(components)
    },[category, apis])

    return(<>
    </>)
}


const ControlApis4ApiType = ({name, category, apis, setApiList}) => {

    useEffect(() => {
    },[])
    useEffect(() => {     
        if(!(apis))return;
        let list = Object.values(apis);
        if(!Array.isArray(list))return;

        if(category === "all") {
            return setApiList(list)
        }

        let components = [];

        list.map(api => {
            if(+api.category !== +category)return true;

            for (const compoType of api.components) {
                components.push({...api, compoType: compoType});
            }
        })

        setApiList(components)
    },[category, apis])

    return(<>
    </>)
}
