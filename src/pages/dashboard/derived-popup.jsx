import { useEffect, useState, cloneElement } from 'react'
import { useDerived } from '../../hook/useDerived'
import { useMainSetting } from '../../hook/useMainSetting'
import { useThemeMode } from '../../provider/MainProvider'
import { control4MainApis } from '../../hook/useApi'

import { store } from '../../state'

import styled from 'styled-components'
import { cardDefaultOptions, contentRefTable } from '../../ref/component'

import { dashobardDBUrl } from '../../ref/url'
import closeIcon from '../../assets/svg/dashboard-icons/x_close.svg'

import { List } from './derive/derive-table'

import { FilterTags } from './derive/filter'

const _derived_popup_ = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    .background-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .derived-popup-content {
        position: relative;
        background-color: #fff;
        width: 800px;
        height: 700px;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: popupFadeIn 0.3s ease-out;
        z-index: 1;
        
        .derived-popup-header {
            height: 40px;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 8px;

            .title {
                font-size: 18px;
                font-weight: 500;
                user-select: none;
            }

            .close-button {
                width: 32px;
                height: 32px;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                
                &:hover {
                    opacity: 1;
                }

                img {
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-drag: none;
                }
            }
        }
        
        .derived-popup-body {
            height: calc(100% - 60px);
            overflow-y: hidden;
            
            &::-webkit-scrollbar {
                width: 8px;
            }
            
            &::-webkit-scrollbar-thumb {
                background-color: #ddd;
                border-radius: 4px;
            }
            
            &::-webkit-scrollbar-track {
                background-color: transparent;
            }

            .content{
                height: 100%;
                font-size: 14px;  
            }
        }
    }

    @keyframes popupFadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    &.dark {
        .derived-popup-content {
            background-color: #2d2d2d;
            color: #fff;
            
            .derived-popup-header {
                border-bottom-color: #444;
                
                .title {
                    color: #fff;
                }
                
                .close-button {
                    filter: invert(1);
                }
            }
        }
    }
`;

export const DerivedPopup = () => { 
    const {derivedInfo, setDerivedInfo} = useDerived();
    const {apis} = control4MainApis();
    const [apiObj, setApiObj] = useState(null);
    const [title, setTitle] = useState("");
    

    const handleClose = () => {
        setDerivedInfo(null);
    };

    useEffect(() => {
        const apiName = derivedInfo.apiName;
        const clickValue = derivedInfo.value;
        if(!apis) return;
        const foundApi = Object.values(apis).find(api => api.name === apiName);
        if(!foundApi) return console.log('해당 API가 없습니다.', apiName);

        const newCardType = foundApi.components[0];
                             
        setApiObj({
            ...foundApi,
            componetType: newCardType,
        });
        
    },[derivedInfo]);

    useEffect(() => {
        const replaceData = {...derivedInfo.data, colValue: derivedInfo.value, colKey: derivedInfo.colName, ...derivedInfo.values};
        
        if(apiObj?.title) {
            let newTitle = apiObj.title;
            // replaceData의 모든 키를 순회하면서 ${key} 패턴을 찾아 대체
            Object.entries(replaceData).forEach(([key, value]) => {
                newTitle = newTitle.replace(`{$${key}}`, value);
            });
            setTitle(newTitle);
        }

        else if(derivedInfo.event_type === "column_click") setTitle(derivedInfo.colName);
        else if(derivedInfo.event_type === "label_click") setTitle(derivedInfo.colName);
        
        else if(derivedInfo.event_type === "cell_click") setTitle(`Parameter : ${derivedInfo.value}`);
    },[apiObj])

    return (
        <_derived_popup_ >
            <div className="background-overlay" onClick={handleClose} />
            <div className='derived-popup-content'>
                <div className='derived-popup-header'>
                    <div className='title'>
                        {title}
                    </div>
                    <button className='close-button' onClick={handleClose}>
                        <img src={closeIcon} alt="close" />
                    </button>
                </div>
                <div className='derived-popup-body'>
                    {apiObj && <Content derivedInfo={derivedInfo} apiObj={apiObj} />}
                </div>
            </div>
        </_derived_popup_>
    );
}

const Content = ({derivedInfo, apiObj}) => {
    const [cardOptions, setCardOptions] = useState({
        options: {
            filter: derivedInfo.filter || false,
            filterOperator: derivedInfo.filterOperator || "AND"
        }
    });


    const handleFilterChange = (newFilter) => {
        setCardOptions(prev => ({
            ...prev,
            options: {
                ...prev.options,
                filter: newFilter
            }
        }));
    };

    const handleConditionChange = (newCondition) => {
        setCardOptions(prev => ({
            ...prev,
            options: {
                ...prev.options,
                filterOperator: newCondition
            }
        }));
    };

    return(
        <div className='content'>
            <FilterTags 
                filter={cardOptions.options.filter} 
                onFilterChange={handleFilterChange}
                filterOperator={cardOptions.options.filterOperator}
                handleConditionChange={handleConditionChange}
            />
            
            <DataProv derivedInfo={derivedInfo} apiObj={apiObj}>
                {cloneElement(<List />, { 
                    card: cardOptions, 
                    layout: {w: 100, h: 100}
                })}
            </DataProv>
        </div>
    );
}




export const DataProv = ({children, apiObj, derivedInfo}) => {
	const [url, setUrl] = useState(false);
	const [postParam, setPostParam] = useState({});
	const {all, mutate} = store(url, "derived-popup", 20, postParam);
	const [data, setData] = useState([]);


	useEffect(() => {
        // console.log('all', all, derivedInfo);
        if(all && Array.isArray(all?.row)){
            setData(all.row[0]);
        }
	},[all])

    useEffect(() => {
        return () => {setData([]);}
    },[derivedInfo])
	

	useEffect(() => {
		const full = dashobardDBUrl + (apiObj.api_type === "REST" ? apiObj.endpoint : "/querys");
		let newPostParam = {...postParam, querys: apiObj.querys};
		if(derivedInfo.data)newPostParam.cardParam = {...derivedInfo.data, colValue: derivedInfo.value, colKey: derivedInfo.colName, ...derivedInfo.values};

		setUrl(full);
		setPostParam(newPostParam);
	}, [apiObj])

   
	
	return (
		<>
		{cloneElement(children, {data, apiObj})}
		</>
	)
}

