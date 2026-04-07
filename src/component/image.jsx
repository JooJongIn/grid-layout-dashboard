import React, {useRef, useState, useEffect, cloneElement} from 'react';
import styled from 'styled-components'

import bockLogo from "../assets/logo/bockgun-logo.png"

import { dashobardDBUrl } from '../ref/url';

export function ImageComponent({card}) {
    const [url, setUrl] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    useEffect(() => {
        if(!(card && card.options))return;
        const options = card.options
        if(options.imgPath) setUrl(dashobardDBUrl + options.imgPath);
        if(options.linkUrl) setLinkUrl(options.linkUrl);

    },[card])

    // useEffect(() => {
    //     if(!(options && options.imgPath))return;

    //     setUrl("http://127.0.0.1:3000" + options.imgPath);
    // },[options])

    // useEffect(() => {
    //     if(!(options && options.linkUrl))return;

    //     setLinkUrl(options.linkUrl);
    // },[options])

    const handlerClick = (e) => {
        
        if(!linkUrl)return;
        window.open(linkUrl, '_blank');
    }
    
    return(
        <_image_ linkUrl={linkUrl}>
            <div onDoubleClick={handlerClick} className='img-area'>
            <img className='image' src={url} alt=""  />
            </div>
        </_image_>
    )
}



const _image_ = styled.div`
	width: 100%;
	height: 100%;
	max-height: 100%;
    .img-area{
        width: 100%;
	    height: 100%;
        cursor: ${p => p.linkUrl !== "" ? "pointer" : ""};
    }
    .image{
        width: 100%;
	    height: 100%;
        object-fit: contain;
    }
    
`
