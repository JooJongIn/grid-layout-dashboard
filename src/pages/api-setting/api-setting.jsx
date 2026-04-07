import React, {useState, useEffect, useRef} from 'react';
import {_setting_popup_api_, _test_, _setting_content_ } from "../../styles/popup-style"

import { useMainSetting, usePages } from '../../hook/useMainSetting';
import { ApiPreview } from './api-preview/api-preview';
import { SettingsInput, SettingSelect, SettingMultiSelect } from './common/input'

import { control4MainApis } from '../../hook/useApi';

// import { ApiCard, AddApiForm, ApiFormArea } from './api-setting-from';
import { ApiCards } from './api-card';

import { dashobardDBUrl } from '../../ref/url'

import plusImg from "../../assets/svg/icons2/zondicons_add-outline.svg";
import closeImg from "../../assets/svg/icons2/close_btn.svg";
import searchIcon from "../../assets/svg/icons2/search.svg";
import { onPost } from '../utils';

import ApiListHead from './ApiListHead';


export function ApiSettingPopup({ initApi }) {
    const [isFirst, setIsFirst] = useState( true );

    const [selectedId, setId] = useState( 0 );
    const [targetDomain, selectDomain] = useState(null);
    const [targetApi, selectApi] = useState(null);
    const [openId, setOpen] = useState( false );
    const [domains, setDomains] = useState({});

    // const [selectedInfo, setSelect] = useState(false);
    const [isAddformOpen, setAddOpen] = useState( false );
    const [apiInfos, setApis] = useState( [] );

    const [sortCol, setSort] = useState( "name" );

    const [categoryList, setCategoryList] = useState( [] );
    const [cateObj , setCateObj] = useState( {} );

    const [searchText, setSearch] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(false);

    const [searchResult, setSearchResult] = useState(false);

    useEffect(() => {
        refreshCategory();
    },[])

    useEffect(() => {
        refreshDomain();
    },[]);

    useEffect(() => {
        if(!(initApi && isFirst))return;
        if(!(domains && Object.keys(domains).length !== 0))return;
        if(!(apiInfos && Array.isArray(apiInfos) && apiInfos.length !== 0))return;

        const {domainId, apiId} = initApi;
        // setId(domainId);
        // selectDomain(domains[domainId]);
        let target = apiInfos.find(apiItem => apiItem.id === +apiId);
        selectApi(target);
        setOpen(target.id);
        setIsFirst(false);
    },[initApi, domains, apiInfos])

    useEffect(() => {
        if(!selectedId && selectedId !== 0){
            selectDomain(null);
            selectApi(null);
            return ;
        }

        const tdomain = domains[selectedId];
        selectDomain(tdomain);
        selectApi(null);
    },[selectedId])

    useEffect(() => {},[targetDomain]);

    useEffect(() => {
        if(!(searchText || selectedCategory))return setSearchResult(false);

        // const result = apiInfos.filter(api => api.name.includes(searchText))
        let result = [...apiInfos];
        if(searchText)result = result.filter(api => includeByCho(searchText, api.name))
        if(selectedCategory)result = result.filter(api => +api.category === +selectedCategory)
        if(!(result && Array.isArray(result)))return setSearchResult(false);

        setSearchResult(result);
    },[searchText, selectedCategory, apiInfos]);





    useEffect(() => {
        if(!(categoryList && Array.isArray(categoryList)))return;
        let newObj = {};
        categoryList.map(item => newObj[item.id] = item.name);
        setCateObj(newObj);
    },[categoryList])


    const refreshCategory = () => {
        onPost(dashobardDBUrl + "/getCategory", {}).then(r => {
            if(!r.row)return setCategoryList([]);
            let list = r.row;
            list = list.map(item => {

                return {...item, title: item.name, value: item.id};
            })
            setCategoryList(list);
        })
    }

    const refreshDomain = () => {
        getDomain((r)=>{
            if(!(r && r.row))return setDomains({});
            let newObj = {}
            const rows = r.row;
            const firstRow = rows[0];
            if(firstRow)setId(firstRow.id)
            rows.map(row => newObj[row.id] = {...row});
            setDomains(newObj);
        });
    }

    const addDomain = (dom) => {
        insertDomain(dom, (r)=>{console.log("result",r);})
    }



    const handlerOpenAddForm = (e) => {
        setOpen(false);
        setAddOpen(true);
    }

    const handlerApiUpdate = (item) => {
        if(!(targetDomain && targetDomain.id))return;
        updateApis({...item, domainId: targetDomain.id}, (r)=>{
            refreshApis();
        })
    }

    const handlerApiInsert = (item) => {
        if(!(item && targetDomain && targetDomain.id))return;
        insertApis({...item, domainId: targetDomain.id}, (r)=>{
            if(!r.id)return;
            const newId = r.id;
            setOpen(newId);
            refreshApis(newId);
        })
    }

    const handlerApiDelete = (targetId) => {        
        if(!(targetId && targetDomain && targetDomain.id))return;
        let body = {
            id: targetId,
            domainId: targetDomain.id
        }
        deleteApis({...body }, (r)=>{
            refreshApis();
        })
    }

    const refreshApis = (newId) => {
        let body = { dimainId: targetDomain.id, sort:sortCol }
        getApis(body, (result) => {
            const apisResult = result.row;
            if(!(apisResult && Array.isArray(apisResult)))return;

            setApis(apisResult);
            if(openId){
                let target = apisResult.find(apiItem => apiItem.id === openId);
                selectApi(target);
            }
            if(newId){
                let target = apisResult.find(apiItem => apiItem.id === newId);
                selectApi(target);
            }
        })

    }

    const handlerClickSort = (col) => {
        setSort(col);
    }

    const handlerCloseApiForm = (e) => {
        setOpen(false);
    }

    const handlerCloseAddForm = (e) => {
        setAddOpen(false);
    }

    const handlerApiOpen = (id) => {
        setOpen(id);
        setAddOpen(false);
    }

    const handlerSearch = (text) => {
        setSearch(text);
    }

	return (
		<>
		<_setting_popup_api_>
			<div className='api-manager-popup'>
                <div className='popup-head'>
                    <div className='head-left'>
                        <div className='title'>API Manager</div>
                        <DomainSelect domainObjs={domains} selectDomainId={setId} />
                    </div>
                    {/* <button onClick={closeHandler}> 
                        <img className='close_btn' src={closeImg} alt="" srcset="" />
                    </button> */}
                </div>
                <div className='popup-body'>
                    <div className='content1 constent'>
                        <ApiListHead 
                            sortCol={sortCol} 
                            handlerClickSort={handlerClickSort} 
                            handlerOpenAddForm={handlerOpenAddForm} 
                            handlerSearch={handlerSearch} 
                            categoryList={categoryList}

                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                        <ApiCards domainInfo={targetDomain} selectApi={selectApi} apiInfos={apiInfos} searchResult={searchResult} setApis={setApis}
                         isAddformOpen={isAddformOpen} setAddOpen={setAddOpen} openId={openId} setOpen={handlerApiOpen}
                         onDelete={handlerApiDelete} sortCol={sortCol} categoryList={categoryList} copyApi={handlerApiInsert}
                         />
                    </div>

                    <div className='content2 constent'>
                        <ApiPreview targetApi={targetApi} isAddformOpen={isAddformOpen} handlerCloseApiForm={handlerCloseApiForm}
                         handlerApiUpdate={handlerApiUpdate} handlerCloseAddForm={handlerCloseAddForm} handlerApiInsert={handlerApiInsert}
                         targetDomain={targetDomain} categoryList={categoryList} refreshCategory={refreshCategory} refreshApis={refreshApis}
                        />
                    </div>
                </div>
			</div>
            {/* <div className='dim' onClick={closeHandler}></div> */}
		</_setting_popup_api_>
		
		
		</>
	);
}







const DomainSelect = ({domainObjs, selectDomainId}) => {
    const [domainOptions, setOptions] = useState([]);

    useEffect(() => {
        if(!(domainObjs && typeof domainObjs === "object"))return;
        const domainArray = Object.values(domainObjs);
        // if(!(domainArray && Array.isArray(domainArray)))return;
        let options = [];
        domainArray.map(domainObj => {
            const { id, name, url } = domainObj;
            const selectText = `${name}  (${url})`
            options.push({id: id, text: selectText});
        })

        setOptions(options)
    },[domainObjs]);


    const handlerChangeDomain = (e) => {
        const newId = e.target.value;
        selectDomainId(newId)
    }

    const Options = domainOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.text}</option>)

    return( 
    <>
    <div className='domain-select'>
        <div className='label'>
           site 
        </div>
        <select  name="" onChange={handlerChangeDomain}>
            {Options}
        </select>
    </div>
    </>)
}





const domainServerUrl = "http://localhost:3000"


const insertDomain = async (option, callback) => {
    const {apis} = option;
    let body = {
        ...option,
        apis: JSON.stringify(apis),
    }
    const result = await onPost(dashobardDBUrl + "/insertDomain", body);
    if(callback)callback(result);
}

const getDomain = async (callback) => {
    let body = {};
    const result = await onPost(dashobardDBUrl + "/getDomain", body);
    if(callback)callback(result);
}

const updateDomain = async (option, callback) => {
    const {apis} = option;
    let body = {
        ...option,
        apis: JSON.stringify(apis)
    };
    const result = await onPost(dashobardDBUrl + "/updateDomain", body);
    if(callback)callback(result);
}

const deleteDomain = async () => {
    
}


const getApis = async (option, callback) => {
    let body = {
        ...option
    };
    const result = await onPost(dashobardDBUrl + "/getApis", body);
    if(callback)callback(result);
}


const updateApis = async (option, callback) => {
    let body = {
        ...option
    };
    const result = await onPost(dashobardDBUrl + "/updateApis", body);
    if(callback)callback(result);
}

const insertApis = async (option, callback) => {
    let body = { ...option };
    const result = await onPost(dashobardDBUrl + "/insertApis", body);
    if(callback)callback(result);
}

const deleteApis = async (option, callback) => {
    let body = { ...option };
    const result = await onPost(dashobardDBUrl + "/deleteApis", body);
    if(callback)callback(result);
}





const samples ={ 
    "1": {id:1, apiName: "test", endpoint: "/list", component: "list" },
    "2": {id:2, apiName: "chart", endpoint: "/chart", component: "chart" }
}

const samples2 = {
    "1": {id:1, apiName: "gauge", endpoint: "/gauge", component: "gauge" },
    "2": {id:2, apiName: "chart", endpoint: "/chart", component: "chart" }
}

const compoSample = [
    {
        title: "chart",
        value: "chart",
    },
    {
        title: "list",
        value: "list",
    },
    {
        title: "gauge",
        value: "gauge",
    }
]

const domainObjs = {
    1: {
        id: 1,
        name: "mockarooApis",
        url: "https://626a2d88737b438c1c4335e4.mockapi.io/api/test",
        apis:samples
    },
    2: {
        id: 2,
        name: "test",
        url: "http://localhost:3002",
        apis:samples2
    }
}


const CHO_HANGUL = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
    'ㄹ', 'ㅁ', 'ㅂ','ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
    'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];
  
  const HANGUL_START_CHARCODE = "가".charCodeAt();
  
  const CHO_PERIOD = Math.floor("까".charCodeAt() - "가".charCodeAt());
  const JUNG_PERIOD = Math.floor("개".charCodeAt() - "가".charCodeAt());
  
  function combine(cho, jung, jong) {
    return String.fromCharCode(
      HANGUL_START_CHARCODE + cho * CHO_PERIOD + jung * JUNG_PERIOD + jong
    );
  }
  
  // 특수문자를 escape 처리하는 함수
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  function makeRegexByCho(search = "") {
    const regex = CHO_HANGUL.reduce(
      (acc, cho, index) => {
        // 초성 자체도 특수문자일 수 있으므로 escape 처리
        const escapedCho = escapeRegExp(cho);
        return acc.replace(
          new RegExp(escapedCho, "g"),
          `[${combine(index, 0, 0)}-${combine(index + 1, 0, -1)}]`
        );
      },
      escapeRegExp(search) // 검색어도 특수문자 escape 처리
    );
    
    return new RegExp(`(${regex})`, "g");
  }
  
  function includeByCho(search, targetWord) {
    let text1 = (search + "").toLowerCase()
    let text2 = (targetWord + "").toLowerCase()
    return makeRegexByCho(text1).test(text2);
  }