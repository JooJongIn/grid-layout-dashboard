import { useEffect, useState } from 'react'
import { ApiForm } from './api-form'
import { CategoryPopup, CategoryPopupDel } from './category-popup'
import { onPost, onGet } from '../../utils'
import { dashobardDBUrl } from '../../../ref/url'
import { useToast } from '@chakra-ui/react'

import { ToastNode } from '../../../component/toast'

const paramsSample = {
    param1: {},
    param2: {}
}

export const ApiFormArea = ({item, categoryList, onUpdate, refreshCategory, refreshApis}) => {
    const toast = useToast();

    const [params, setParams] = useState( {} );
    const [formState, setFormState] = useState({});

    const [curTap, setTap] = useState("QUERY");
    const [popupItem, setPopupItem] = useState(false); 
    const [delPopupItem, setDelPopupItem] = useState(false);
    
    // databases 목록 상태
    const [databases, setDatabases] = useState([]);

    // databases 목록 가져오기
    useEffect(() => {
        onGet(dashobardDBUrl + "/api/databases").then(r => {
            if(r.success && r.databases) {
                setDatabases(r.databases);
            }
        });
    }, []);

    useEffect(() => {
        if(!formState)return;
        console.log('formState', formState);
    },[formState])

    useEffect(() => {
        if(!item)return;
        if(item.api_type)setTap(item.api_type);
        if(item.params)setParams(item.params);
        else setParams(paramsSample);
        
        setFormState({...item});
    },[item])

    useEffect(() => {
        if(formState.params)setParams(formState.params);
    },[formState])

    const handlerUpdate = (name, val) => {
        // onUpdate(idx, {...item, [name]:val});
        
        setFormState({...formState, [name]:val});
    }

    const handlerSave = async (e) => {

        if(curTap === "QUERY")await onUpdate({...formState, apiType: curTap, endpoint:"/querys"});
        // else if(curTap === "Sample"){
        //     let components = formState.components || [];
        //     if(components.length > 1)components = [components[0]];
        //     await onUpdate({...formState, apiType: curTap, components: components});
        // }
        else await onUpdate({...formState, apiType: curTap});
        toast({
            position: 'top',
            description: "저장을 성공하였습니다.",
            status: 'loading',
            variant: "subtle",
            duration: 3000,
            isClosable: true,
            render: (p) => <ToastNode {...p} />
        });
    }


    const handlerChangeTap = (e) => {
        setTap(e.target.value)
    }

    const handlerCategoryFunc = async (formData) => {
		let funcType = formData.type;
        let body = {...formData};
        let result = false;

		if(funcType === "add")await onAdd(body)
		else if(funcType === "edit")await onEdit(body)
		else if(funcType === "del")await onDel(body );
        else return;

        refreshCategory();
	}
    
    
    const onAdd = (body) => { onPost(dashobardDBUrl + "/addCategory", body)}
    const onEdit = (body) => { onPost(dashobardDBUrl + "/editCategory", body)}
    const onDel = (body) => { 
        // console.log('onDel', body);
        let id = body.id;

        onPost(dashobardDBUrl + "/deleteCategory", body).then(r => {
            // console.log('onDel', r, formState, id);
            refreshApis();

            if(r.success && +formState.category === +id){
                setFormState({...formState, category: null});
            }
        })
    }


    
    return(
    <>
    <div className='taps'>
        <Tap onClick={handlerChangeTap} value={"REST"} seletedTap={curTap} />
        <Tap onClick={handlerChangeTap} value={"QUERY"} seletedTap={curTap} />
        {/* <Tap onClick={handlerChangeTap} value={"Sample"} seletedTap={curTap} /> */}
    </div>

    <ApiForm formState={formState} onUpdate={setFormState} curTap={curTap} categoryList={categoryList} params={params} 
    handlerSave={handlerSave} setPopupItem={setPopupItem} setDelPopupItem={setDelPopupItem}
    databases={databases}
    />
    {popupItem && <CategoryPopup onFunc={handlerCategoryFunc} item={popupItem} close={()=>setPopupItem(false)} />}
    {delPopupItem && <CategoryPopupDel onFunc={handlerCategoryFunc} item={delPopupItem} close={()=>setDelPopupItem(false)} />}

    </>)
}


const Tap = ({onClick, value, seletedTap}) => {
    const isSelted = value === seletedTap;

    return(<>
    <div className={'tap' + (isSelted ? " selected-tap" : "") }><button onClick={onClick} value={value}>{value}</button></div> 
    
    </>)
}




export const AddApiForm = ({onInsert, domain, close}) => {
    const [params, setParams] = useState( paramsSample );
    const [formState, setFormState] = useState({params: params, querys: [{name: "", query: ""}], derive: [], domainId: 1 });
    const [curTap, setTap] = useState("QUERY");
    const [categoryList, setCategoryList] = useState( [] );

    const [popupItem, setPopupItem] = useState(false);
    const [delPopupItem, setDelPopupItem] = useState(false);
    
    // databases 목록 상태
    const [databases, setDatabases] = useState([]);

    useEffect(() => {
        return ()=>{setFormState({})}
    },[])


    useEffect(() => {
        onPost(dashobardDBUrl + "/getCategory", {}).then(r => {
            if(!r.row)return setCategoryList([]);
            let list = r.row;
            list = list.map(item => {

                return {...item, title: item.name, value: item.id};
            })
            setCategoryList(list);
        })
    },[])
    
    // databases 목록 가져오기
    useEffect(() => {
        onGet(dashobardDBUrl + "/api/databases").then(r => {
            if(r.success && r.databases) {
                setDatabases(r.databases);
            }
        });
    }, [])

    useEffect(() => {
        console.log('domain', domain);
        // if(!domain)return;
        // setFormState({...formState, domain_id: domain.id});
    },[domain])

    const handlerSave = () => {
        if(!(formState && formState.name ))return alert("데이터 입력");
        if((curTap !== "QUERY" && !formState.endpoint && curTap !== "Sample"))return alert("데이터 입력");

        if(curTap === "QUERY")onInsert({...formState, apiType: curTap, endpoint:"/querys"});
        else onInsert({...formState, apiType: curTap});
        close()
    }


    const handlerChangeTap = (e) => {
        setTap(e.target.value)
    }

    const handlerCategoryFunc = async (formData) => {
		let funcType = formData.type;
        let body = {...formData};
        let result = false;

		if(funcType === "add")await onAdd(body)
		else if(funcType === "edit")await onEdit(body)
		else if(funcType === "del")await onDel(body );
        else return;

        refreshCategory();
	}
    
    
    const onAdd = (body) => { onPost(dashobardDBUrl + "/addCategory", body)}
    const onEdit = (body) => { onPost(dashobardDBUrl + "/editCategory", body)}
    const onDel = (body) => { 
        // console.log('onDel', body);
        let id = body.id;
        setFormState({...formState, category: null});
        onPost(dashobardDBUrl + "/deleteCategory", body).then(r => {
            // console.log('onDel', r, formState, id);
            if(r.success && +formState.category === +id){
                setFormState({...formState, category: null});
            }
        })
    }

    return( 
        <>
        <div className='taps'>
            <Tap onClick={handlerChangeTap} value={"REST"} seletedTap={curTap} />
            <Tap onClick={handlerChangeTap} value={"QUERY"} seletedTap={curTap} />
            {/* <Tap onClick={handlerChangeTap} value={"Sample"} seletedTap={curTap} /> */}
        </div>

        <ApiForm formState={formState} onUpdate={setFormState} curTap={curTap} categoryList={categoryList} params={params} 
        handlerSave={handlerSave} setPopupItem={setPopupItem} setDelPopupItem={setDelPopupItem}
        databases={databases}
        />


        {popupItem && <CategoryPopup onFunc={handlerCategoryFunc} item={popupItem} close={()=>setPopupItem(false)} />}
        {delPopupItem && <CategoryPopupDel onFunc={handlerCategoryFunc} item={delPopupItem} close={()=>setDelPopupItem(false)} />}
        </>
    )

}