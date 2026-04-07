import { useEffect, useState } from 'react'
import { SettingsInput, SettingMultiSelect, SettingSelect, SettingsArea } from '../common/input'
import { Select4Crud } from '../../../component/select'
import { ParamInputs } from './param-inputs'
import { QureysAreas } from './query-areas'
import { DeriveAreas } from './derive-inputs'
import { compoArr, componentOptions, qureySample4Component } from '../../../constants/component-constants'


const tokenList = [
    {title: "SMCore", value: "SMCore"},
    {title: "TechVDI", value: "TechVDI"},
    {title: "SKinc", value: "SKinc"},
    {title: "SKincChina", value: "SKincChina"},
    {title: "SKNexilis", value: "SKNexilis"},
]


export const ApiForm = ({formState, onUpdate, curTap, categoryList, params, handlerSave, setPopupItem, setDelPopupItem, databases = []}) => {
    const [isSample, setIsSample] = useState(false);
    
    // databases를 SettingSelect에 맞는 형식으로 변환
    const databaseOptions = databases
        .filter(db => db.connected) // 연결된 DB만 표시
        .map(db => ({
            title: `${db.label} (${db.type})`,
            value: db.id
        }));

    useEffect(() => {
        console.log('formState', formState);
        let cate = formState.category;

        if( cate && +cate === 22)setIsSample(true);
        else setIsSample(false);
    },[formState])

    // useEffect(() => {
    //     return;
    //     console.log('formState', formState);
    //     if(!isSample)return;
    //     let components = formState.components || [];
    //     const first = components[0];
    //     if(!first)return;
    //     let sampleQuery = qureySample4Component[first];
    //     let newArray = [{name: "", query: sampleQuery}];
    //     onUpdate({...formState, querys: newArray});
    // },[formState])


    useEffect(() => {
        if(!isSample)return;
        let components = formState.components || [];
        if(components.length <= 1)return;
        onUpdate({...formState, components: components.slice(1)});
    },[isSample])


    const handlerUpdate = (name, val) => { onUpdate({...formState, [name]:val});}

    const handlerSetCategory = (name, val) => {
        let cate = formState.category;
        if( cate && +val === 22){
            // setIsSample(true);
            let newFormState = {...formState, [name]: val};
            setSampleQurey(newFormState);
        }
        else{
            let newFormState = {...formState, [name]: val};
            onUpdate(newFormState);
            // setSampleQurey(newFormState);
            // setIsSample(false);
        }

        
    }

    const handlerSetComponents = (newFormState) => {
        if(isSample)setSampleQurey(newFormState);
        else onUpdate(newFormState);
    }

    const setSampleQurey = (newFormState) => {
        let components = newFormState.components || [];
        const first = components[0];
        if(!first)return;
        let sampleQuery = qureySample4Component[first];
        let newArray = [{name: "", query: sampleQuery}];
        onUpdate({...newFormState, querys: newArray});
    }

    return(<>
    
    <div className='api-form' >
            <div className='input-row'>
                <div className='api-input'>
                    <div className='label'>API</div>
                    <SettingsInput name={"name"} options={formState} onBlur={handlerUpdate} />
                </div>
        
                {/* {curTap === "REST" && <div className='api-input'>
                    <div className='label'>endpoint</div>
                    <SettingsInput name={"endpoint"} options={formState} onBlur={handlerUpdate} />
                </div>} */}

            </div>
            
            {/* QUERY 탭일 때 Database 선택 UI */}
            {curTap === "QUERY" && (
                <div className='api-input'>
                    <div className='label'>Database</div>
                    <SettingSelect 
                        name={"dataSource"} 
                        options={formState} 
                        onChange={handlerUpdate} 
                        list={databaseOptions} 
                    />
                </div>
            )}
 
            {curTap === "REST" && <>
            <div className='api-input '>
                <div className='label'>token</div>
                <SettingSelect name={"token"} options={formState} onChange={handlerUpdate} list={tokenList} />
            </div>
            <div className='api-input'>
                <div className='label'>URL</div>
                <SettingsInput name={"url"} options={formState} onBlur={handlerUpdate} />
            </div>
            </>}
            <div className='api-input'>
                <div className='label'>제목</div>
                <SettingsInput name={"title"} options={formState} onBlur={handlerUpdate} />
            </div>

            <div className='api-input'>
                <div className='label'>설명</div>
                <SettingsInput name={"description"} options={formState} onBlur={handlerUpdate} />
            </div>

            <ParamInputs paramObj={params} setParam={handlerUpdate} />
            
            <div className='api-input use-z-index'>
                <div className='label'>caegory</div>
                <Select4Crud name={"category"} options={formState} onChange={handlerSetCategory} list={categoryList} 
                onAdd={(item)=>setPopupItem(item)} onDel={(item)=>setDelPopupItem(item)} onEdit={(item)=>setPopupItem(item)}
                
                />

            </div>

            {curTap === "REST" && <>
                <BodyInput formState={formState} onUpdate={handlerUpdate} />
            </>}

            <SelecteIfSample formState={formState} onUpdate={handlerSetComponents} isSample={isSample} />
            
            {curTap === "QUERY" && <QureysAreas querys={formState.querys} onUpdate={handlerUpdate} />}
            
            <DeriveAreas formState={formState} onUpdate={handlerUpdate} />

            <div className='btn-area'>
                <button className='form-btn save' onClick={handlerSave}>저장</button>
            </div>
        </div>
    </>)
} 
const body = {

  "filter": {

    "operator": "AND",

    "rules": [

      {

        "property": "node_type",

        "operator": "equals",

        "values": [51]

      },

      {

        "property": "event_time",

        "operator": "last_n_days",

        "values": [30]

      }

    ]

  },

  "count": 100

}

const BodyInput = ({formState, onUpdate}) => {

    
    const handlerUpdate = (name, val) => {
        try {
            // 비어있는 경우는 허용
            if (val === "") {
                onUpdate(name, val);
                return;
            }

            // JSON 형식 검증
            let json = JSON.parse(val);

            onUpdate(name, json);
        } catch (e) {
            console.log('e', e);
            // 오류가 있더라도 값은 유지 (사용자가 수정할 수 있도록)
            // onUpdate(name, val);
        }
    }

    return <div className='api-input'>
        <div className='label'>body</div>
        <SettingsArea json name={"body"} options={formState} onBlur={handlerUpdate} />
    </div>
}

const SelecteIfSample = ({formState, onUpdate, isSample}) => {
    const handlerUpdate = (name, val) => {
        onUpdate({...formState, [name]:val});
    }

    const handlerSelectArr = (name, value) => {
        onUpdate({...formState, [name]: [value]});
    }


    return(<>
   {!isSample &&  <div className='api-input'>
        <div className='label'>component</div>
        <SettingMultiSelect name={"components"} options={formState}  onChange={handlerUpdate} list={componentOptions} />
    </div>}


    {isSample && <div className='api-input '>
        <div className='label'>component</div>
        <SettingSelect name={"components"} options={formState} onChange={handlerSelectArr} list={compoArr} />
    </div>} 
    </>)
}

