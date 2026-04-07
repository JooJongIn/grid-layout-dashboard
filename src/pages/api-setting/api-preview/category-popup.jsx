import { useEffect, useState } from 'react'
import { SettingsInput } from '../common/input'
import { _popup_ } from '../../../styles/popup-style'

import styled from 'styled-components'
// import { _popup_content_ } from './popup-content-style'

export const CategoryPopup = ({onFunc, item, close}) => {
    const [formState, setFormState] = useState({});
    const [funcType, setFuncType] = useState(false);
    

    useEffect(() => {
        if(!item)return setFormState({});
        setFuncType(item.type);
        setFormState({...item});
    },[item])

    const handlerBlur = (name, value) => {
        setFormState({...formState, [name]: value});
        // if(onFunc)onFunc(result);
        // close()
    }

    const handlerSave = () => {
        if(onFunc)onFunc(formState);
        close()
    }

    return (
        <_popup_ width={350} hig={200}>
        <div className='popup'>
            <div className='popup-head'>
                <div>{funcType === "add" ? "카테고리 추가" : "카테고리 수정"}</div>
            </div>
            <div className='popup-body'>
                <_popup_content_>
                <div className='popup-content'>
                    <div className='api-input'>
                        <div className='label'>카테고리 이름</div>
                        <SettingsInput name={"name"} options={formState} onBlur={handlerBlur} />
                    </div>
                </div>
                <div className='btn-area2'>
                    <div className='text-btn blue' onClick={handlerSave}>
                        등록
                    </div>

                    <div className='text-btn gray' onClick={close}>
                        취소
                    </div>
                </div>
                </_popup_content_>
            </div>
        </div>
        <div className='dim' onClick={close} />
        </_popup_>
    )
}


export const CategoryPopupDel = ({onFunc, item, close}) => {
    const [formState, setFormState] = useState({});
    

    useEffect(() => {
        console.log('item', item);
        if(item)setFormState({...item});
    },[item])

    const handlerBlur = (name, value) => {
        setFormState({...formState, [name]: value});
        // if(onFunc)onFunc(result);
        // close()
    }

    const handlerSave = () => {
        if(onFunc)onFunc(formState);
        close()
    }

    return (
        <_popup_ wid={200} hig={140}>
        <div className='popup'>
            <div className='popup-head'>
                <div>카테고리 삭제</div>
            </div>
            <div className='popup-body'>
                <_popup_content_>
 
                <div className='btn-area2 bottom'>
                    <div className='text-btn blue' onClick={handlerSave}>
                        삭제
                    </div>

                    <div className='text-btn gray' onClick={close}>
                        취소
                    </div>
                </div>
                </_popup_content_>
            </div>
        </div>
        <div className='dim' onClick={close} />
        </_popup_>
    )
}


export const _popup_content_ = styled.div`
    width: 100%; height: 100%;
    display: flex; flex-direction: column;

    .popup-content{
        flex: 1; padding: 10px;
        .api-input{
            width: 100%;
            .label{ padding-bottom: 5px; font-size: 14px; }

            .setting-input{
                flex: 1; padding: 5px; font-size: 13px;
				border: 1px solid #dedede;
				border-radius: 6px;
                /* input{ border-bottom: 1px solid #000; } */
            }
        }

    }
    .btn-area2{
        display: flex;
        justify-content: center; 

        &.bottom{
            margin-top: 35px;
        }

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
`