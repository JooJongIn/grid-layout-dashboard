import { useEffect, useState } from 'react'
import { SettingsArea, SettingsInput, SettingSelect } from '../common/input'
import { CustomTitle } from './param-inputs'

import plusIcon from "../../../assets/svg/dashboard-icons/+.svg"
import delIcon from "../../../assets/svg/dashboard-icons/del-x-btn.svg"

export const DeriveAreas = ({formState, onUpdate}) => {
    const [deriveList, setList] = useState([]);
    
    useEffect(() => { return ()=> {setList([])}; },[])

    useEffect(()=>{
        let deriveList = formState.derive;
        if(!deriveList)return setList([]);
        setList(deriveList);
    }, [formState]);

    const handlerUpdate = (index, item) => {
        let newList = [...deriveList];
        newList[index] = item;
        onUpdate("derive", newList);
    }

    const handlerAdd = () => {
        let newList = [...deriveList];
        newList.push({});
        onUpdate("derive", newList);
    }

    const handlerDel = (idx) => {
        let newList = [...deriveList];
        newList.splice(idx, 1);
        onUpdate("derive", newList);
    }

    return(<div className='query-form derive-form'>
    
        <div className={'query-title' + (deriveList.length > 1 ? " multi-query" : "") }>
            {deriveList.length > 1 ? "Derives" : "Derive"}
        </div>
        <div className='query-list'>
            { deriveList.map((item, idx) => <DeriveItem item={item} idx={idx} update={handlerUpdate} del={handlerDel} formState={formState} />)}
            <div className='add-btn-area'>
                <button className='form-btn add' onClick={handlerAdd}>
                    <img className='icon' src={plusIcon} />
                </button>
            </div>
        </div>
    </div>)
}


const DeriveItem = ({item, idx, update, del, formState}) => {
    
    const handlerDel = () => {
        del(idx);
    }

    const handlerUpdate = (name, val) => {
        const trimmedVal = typeof val === 'string' ? val.trim() : val;
        update(idx, {...item, [name]: trimmedVal});
    }

    const eventList = formState.components.reduce((acc, item) => {
        const componentEvents = eventObj[item] || [];
        
        return componentEvents.reduce((events, event) => {
            // value가 중복되지 않은 경우만 추가
            const isDuplicate = events.some(e => e.value === event.value);
            if (!isDuplicate) {
                events.push(event);
            }
            return events;
        }, acc);
    }, []);

    return(<>
    <div className='input-row'>

        <div className='api-input md'>
            <div className='label'>event</div>
            <SettingSelect name={"event_type"} options={item} onChange={handlerUpdate} list={eventList} />
        </div>
        <div className='api-input'>
            <div className='label'>컬럼명</div>
            <SettingsInput name={"colName"} options={item} onBlur={handlerUpdate} />
        </div>
        <div className='api-input sm'>
            <div className='label'>컬럼인덱스</div>
            <SettingsInput name={"colIdx"} options={item} onBlur={handlerUpdate} />
        </div>
         <div className='api-input'>
            <div className='label'>api 이름</div>
            <SettingsInput name={"apiName"} options={item} onBlur={handlerUpdate} />
        </div>
        <div className='del-btn-area'>
            <button className='form-btn del' onClick={handlerDel}>
                <img className='icon' src={delIcon} />
            </button>
        </div>
    </div>
    </>)
}

const getEventList = (components) => {
    let eventList = [];
    components.map(item => {
        
        let obj = eventObj[item];
        if(obj)eventList = [...eventList, ...obj];
    })

    return eventList;

}



const eventList4List = [
    {title:"cell click", value:"cell_click"},
    {title:"컬럼 click", value:"column_click"},
]

const eventList4Gauge = [
    {title:"click", value:"click"},
    
]

const eventList4Bar = [
    {title:"바 click", value:"bar_click"},
    {title:"레전드 click", value:"legend_click"},
]

const eventList4Pie = [
    {title:"파이 click", value:"pie_click"},
    {title:"레전드 click", value:"legend_click"},
]

const eventObj = {
    List: eventList4List,
    Gauge: eventList4Gauge,
    Bar: eventList4Bar,
    Pie: eventList4Pie,
}


