import { useEffect, useState } from 'react'
import { SettingsArea } from '../common/input'
import { CustomTitle } from './param-inputs'
import { useShared } from '../../../store'
import plusIcon from "../../../assets/svg/dashboard-icons/+.svg"
import delIcon from "../../../assets/svg/dashboard-icons/del-x-btn.svg"

export const QureysAreas = ({querys, onUpdate}) => {
    const [qureyArray, setQureyArray] = useState( [] );
    const [isAddMode, setIsAddMode] = useState(false);
    const [queryId, setQueryId] = useShared("queryId", 0);

    useEffect(() => {
        if(!(querys && Array.isArray(querys)))return setQureyArray([]);
        setQureyArray(querys);
    },[querys]);

    const handlerUpdate = (name, idx, val) => {
        let newArray = [...qureyArray];
        let target = newArray[idx] || {};
        newArray[idx] = {...target, [name]: val};
        setQureyArray(newArray);
        onUpdate("querys", newArray);
    }

    const handlerAdd = () => {
        let newArray = [...qureyArray];
        newArray.push({});
        setQureyArray(newArray);
    }

    const handlerDel = (idx) => {
        let newArray = [...qureyArray];
        newArray.splice(idx, 1);
        setQureyArray(newArray);
    }


    return(<div className='query-form'>
    
    <div className={'query-title' + (qureyArray.length > 1 ? " multi-query" : "") }>
        {qureyArray.length > 1 ? "Queries" : "Query"}
    </div>
    <div className='query-list'>
    { qureyArray.map((item, idx) => <div className={'api-input' + (queryId === idx ? " selected-query" : "") } key={idx} onClick={()=>setQueryId(idx)} >
        {qureyArray.length > 1 && <div className='query-head'>
        <CustomTitle label={item.name} setTitle={(val)=>handlerUpdate("name", idx, val)} placeholder={"qurey"} />
        <button className='form-btn del' onClick={()=>handlerDel(idx)}>
            <img className='icon' src={delIcon} />
        </button>
        </div>}
        <SettingsArea name={"query"} options={item} onBlur={(name, val)=> handlerUpdate("query", idx, val)} />
    </div>)}
    <div className='add-btn-area'>
        <button className='form-btn add' onClick={handlerAdd}>
            <img className='icon' src={plusIcon} />
        </button>
    </div>
    </div>
    {/* {isAddMode && <> <div className='api-input'>
        <CustomTitle label={"추가"} setTitle={(val)=>handlerUpdate("name", qureyArray.length, val)} />
        <SettingsArea name={"query"} options={{}} onBlur={(name, val)=> handlerUpdate("query", qureyArray.length, val)} />
    </div>
    <button className='form-btn add' onClick={()=>setIsAddMode(false)}>추가</button>
    <button className='form-btn add' onClick={()=>setIsAddMode(false)}>취소</button>

    </>
    } */}
    </div>)
} 