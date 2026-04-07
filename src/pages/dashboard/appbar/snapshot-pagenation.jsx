import { useEffect, useState } from 'react'

import { useMainSetting, usePages } from '../../../hook/useMainSetting'
import { useToast } from '@chakra-ui/react'
import { Compobox, MyListbox } from '../../../component/compobox'
import { Svg4Color } from '../../../component/svg-color'

import undoIcon from "../../../assets/svg/dashboard-icons/undo-circle.svg";
import redoIcon from "../../../assets/svg/dashboard-icons/redo-circle.svg";

import handleIcon from "../../../assets/images/ico_move.svg";
import linkIcon from "../../../assets/images/ico_link.svg";
import settingIcon from "../../../assets/images/ico_pen.svg";
import xCloseIcon from "../../../assets/images/ico_x.svg";

// import res

import newIcon from "../../../assets/images/ico_new.svg";
import copyIcon from "../../../assets/images/ico_copy.svg";
import copyBlackIcon from "../../../assets/images/ico_copy-black.svg";

import {Form, Text, Select, Submit} from '../../../component/form'
import { _popup_ } from '../../../styles/popup-style';

import styled from 'styled-components'

import { ToastNode } from '../../../component/toast'

{/* <button class="btn_snap"><img src="images/ico_move.svg" alt="이동" /></button>
<a href="#" class="snap_text">통합보안관제서비스샘플통합보안관제서비스샘플11111111</a>
<button class="btn_snap"><img src="images/ico_link.svg" alt="이동" /></button>
<button class="btn_snap"><img src="images/ico_pen.svg" alt="이동" /></button>
<button class="btn_snap"><img src="images/ico_x.svg" alt="이동" /></button> */}


export const SnapshotPagenation = ({unSelect}) => { 
    const {userInfo } = useMainSetting();
    const { pages, currentPageId, changePage,  orderPage, appendPage, appendNewPage, updatePage, deletePage } = usePages();
	

	const [isModalopen, openModal] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const handlerAppendPage = (formData) => {
		unSelect();
		if(isModalopen === "copy")appendPage(formData)
		else if(isModalopen === "new")appendNewPage(formData)

		else updatePage(formData, isModalopen)
	}

	const handlerCloseModal = () => {
		openModal(false);
	}



    const pageChangeHandler = (id) => { 
        unSelect();
        changePage(id);
    }

    const handlerOrder = (arr) => {
		orderPage(arr);
	}

	return(
		<>
		 <li>
			
		<Compobox list={pages} currentId={currentPageId} onSelect={pageChangeHandler} idKey={"id"} titleKey={"title"} onOrder={handlerOrder}  >
			<CompoboxItem onOpenPopup={(info) => {if(info)openModal(info);}} onDelete={(idx) => setDeleteModalOpen(idx)} />
		</Compobox>

		</li>
		<li><button className="edit_btn b_blue" onClick={() => {openModal("new");}} ><img src={newIcon} alt="" /> <div className='btn_text'>New Dashboard </div></button></li>
		<li><button className="edit_btn line_white" onClick={() => {openModal("copy");}} ><img src={copyIcon} alt="" /> <div className='btn_text'>복사</div></button></li>
   
		{isModalopen && <SnapshotAddModal info={isModalopen} addSnapshot={handlerAppendPage} closeModal={handlerCloseModal} />}
		{isDeleteModalOpen && (
			<DeleteConfirmModal
				target={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onDelete={deletePage}
			/>
		)}
		</>
	)
}


const CompoboxItem = ({id, text, onDelete, onOpenPopup, dragRef, handlerId, item, close}) => {
	const toast = useToast();

	useEffect(() => {
	},[handlerId])

	const handlerClickLinkCopy = (e) => {
		e.stopPropagation()
		console.log('window.location', window.location);
		let url =  window.location.href;
		const newUrl = new URL(url);
		newUrl.searchParams.set("id", id);

		
		// let text = window.location.origin + window.location.pathname + `?id=${id}`;
		// console.log("id", id, window.navigator, window.navigator.clipboard);
		// window.navigator.clipboard.writeText(text);

		const textArea = document.createElement("textarea");
        textArea.value = newUrl.href;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

		

        try {
            document.execCommand('copy');

			toast({
				position: 'top',
				description: "URL을 복사하였습니다.",
				status: 'loading',
				variant: "subtle",
				duration: 3000,
				isClosable: true,
				render: (p) => <ToastNode {...p} />
			});
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
	}

	const openHandler = (e) => {
		e.stopPropagation()
		onOpenPopup(item);
		close();
	}

	const delHandler = (e) => {
		e.stopPropagation()
		onDelete(id);
		close();
	}

	return(
		<li className='compobox-item' key={id} style={{display:"flex" ,justifyContent: 'space-between', width:"100%", alignItems: "center" }}>
			<button className="move-handle btn_snap" data-handler-id={handlerId} ref={dragRef}><img src={handleIcon} alt="이동" /></button>
			<a href="#" className="snap_text">{text}</a>
			<button className="btn_snap" onClick={handlerClickLinkCopy}>
				<Svg4Color icon={copyBlackIcon} hex={"#060505"} />
			</button>
			<button className="btn_snap" onClick={openHandler}><img src={settingIcon} alt="이동" /></button>
			<button className="btn_snap" onClick={delHandler}><img src={xCloseIcon} alt="이동" /></button>
		</li>
	)
}





const SnapshotAddModal = ({info, addSnapshot, closeModal}) => {
	const [formData, setForm  ] = useState({
		title : "",
		level : 3,
	})
	const [titleText, setTitle] = useState( "" );


	useEffect(() => {
		if(info && typeof info === "object"){
			const currentId = info.id;
			let text = `스냅샷 수정 ( ${currentId} )`
			setTitle(text)
			setForm({
				title: info.title ,
				level: 3
			})
		}else if(info === "new"){
			setTitle("스냅샷 생성");
		}else if(info === "copy"){
			setTitle("스냅샷 복사");
		}
	},[info])


	const handlerFormChange = (key, value) => {
		setForm({...formData, [key]: value});
	}


	const handlerAddSnapshot = (e) => {
		const {title } = formData;
		if(!title || title === "") return alert("타이틀을 입력해주세요");

		addSnapshot(formData);
		closeModal();
	}

	return(
		<>
		<_popup_ wid={300} hig={180} >
		<div className='popup'>
			<div className='popup-head title'>
				{titleText}
			</div>
			<div className='popup-body'>
				<_snapshot_popup_content_>
				<Form onSubmit={handlerAddSnapshot} initValues={formData}>
					<Text name="title" placeholder="입력해주세요" label={"제목"} onChange={handlerFormChange}  required/>
					{/* <Submit> 등록 </Submit> */}
				</Form>
				<div className='btn-area'>
					<div className='text-btn blue' onClick={handlerAddSnapshot}>
						등록
					</div>

					<div className='text-btn gray' onClick={closeModal}>
						취소
					</div>
				</div>
				</_snapshot_popup_content_>
			</div>
		</div>
		<div className='dim' onClick={closeModal}></div>
		
		
		</_popup_>
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

				<div className='btn-area sm'>
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


	.btn-area{
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
