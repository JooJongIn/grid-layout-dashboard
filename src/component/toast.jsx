import { useToast } from '@chakra-ui/react'

import xCloseIcon from '../assets/images/ico_x_white.svg'


export const openToast = (description, options) => {
    const toast = useToast();
    if(!description) return console.log("description is required");

    let toastProps = {
        description: description,
        ...options,

        position: 'top',
        duration: 3000,
        isClosable: true,
        render: (p) => <ToastNode {...p} />
    }

	toast(toastProps)
}




export const ToastNode = ({ description,  onClose, ...props}) => {

	return (
		<div class="toast_wrap">
			<span>{description}</span>
			<button class="spacing_none" onClick={onClose} ><img src={xCloseIcon} alt="닫기" /></button>
		</div>
	)
}