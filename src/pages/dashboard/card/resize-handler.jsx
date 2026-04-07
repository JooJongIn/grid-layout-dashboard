import { useEffect, useState } from 'react'

import { useStage } from '../../../hook/useStage';

import styled from 'styled-components'

import resizeIcon  from '../../../assets/svg/dashboard-icons/resize-bottom-right.svg'
import { Svg4Color } from '../../../component/svg-color'

import { stageCol, cellHeight } from '../../../ref/stage-setting'

export const ResizeHandles = ({card, themeStyle, isPrint}) => { 
    return(
        <>
        <_resize_handler_  >
            {points.map( (p, idx) => <ResizeHandle key={idx} {...p} card={card} isPrint={isPrint} />) }
        </_resize_handler_>
        </>
    )
}


const ResizeHandle = ({name, makeNewLoca, card, isPrint}) => {
    const {resizeCard, addHistory} = useStage(isPrint);
    const [isDragging, setDrag] = useState(false);


    useEffect(() => {
        if(!isDragging)return 
        window.addEventListener("mousemove", handlerResize);
        window.addEventListener("mouseup", clearEvent);
    },[isDragging])

    const handlerResize = (e) => {
        let loca = card?.cardLocation || null;
        const {pageX: x1, pageY: y1} = isDragging;
        const {pageX: x2, pageY: y2} = e;
        
        const x = x2 - x1; 
        const y = y2 - y1; 

        const widCell = window.innerWidth / stageCol;
        const heiCell = cellHeight;

        const cw = x / widCell;
        const ch = y / heiCell;


        const newItem = makeNewLoca(cw, ch, loca);

        if(JSON.stringify(newItem) !== JSON.stringify(loca))resizeCard(newItem);
        
    }

    const clearEvent = () => {
        window.removeEventListener("mousemove", handlerResize);
        window.removeEventListener("mouseup", clearEvent);
        addHistory()
    }

    const handlerMouseDown = (e) => setDrag(e);

    return (
        <div onMouseDown={handlerMouseDown} className={'handle ' + name} >
            
        </div>
    )
}






const _resize_handler_ = styled.div`
    .handle{
        position: absolute;
        background-color: white;
        border: 1px solid black;

        width: 14px; height: 14px;
    }

    .se{
        bottom: 0px;
        right: 0px;
        transform: translate(45%, 45%);
        cursor: se-resize;
    }

    .sw{
        bottom: 0px;
        left: 0px;
        transform: translate(-45%, 45%);
        cursor: sw-resize;
    }

    .nw{
        top: 0px;
        left: 0px;
        transform: translate(-45%, -45%);
        cursor: nw-resize;
    }

    .ne{
        top: 0px;
        right: 0px;
        transform: translate(45%, -45%);
        cursor: ne-resize;
    }

`

const makeNewLoca4se = (cw, ch, loca) => {
    const wid =  +(loca.w + cw).toFixed(0);
    const hei =  +(loca.h + ch).toFixed(0);

    let newItem = {
        ...loca,
        w: wid,
        h: hei
    }

    return newItem;
}

const makeNewLoca4sw = (cw, ch, loca) => {
    const wid =  +(loca.w - cw).toFixed(0);
    const hei =  +(loca.h + ch).toFixed(0);
    const xPos =  +(loca.x + cw).toFixed(0);

    let newItem = {
        ...loca,
        w: wid,
        h: hei,
        x: xPos,
        
    }

    return newItem;
}

const makeNewLoca4nw = (cw, ch, loca) =>{
    const wid =  +(loca.w - cw).toFixed(0);
    const hei =  +(loca.h - ch).toFixed(0);
    const xPos =  +(loca.x + cw).toFixed(0);
    const yPos =  +(loca.y + ch).toFixed(0);

    let newItem = {
        ...loca,
        w: wid,
        h: hei,
        x: xPos,
        y: yPos,
        
    }

    return newItem;
}

const makeNewLoca4ne = (cw, ch, loca) =>{
    const wid =  +(loca.w + cw).toFixed(0);
    const hei =  +(loca.h - ch).toFixed(0);
    const yPos =  +(loca.y + ch).toFixed(0);

    let newItem = {
        ...loca,
        w: wid,
        h: hei,
        y: yPos,
        
    }

    return newItem;
}


const points =  [
    {
        name: "se",
        makeNewLoca :makeNewLoca4se
    },
    {
        name: "sw",
        makeNewLoca :makeNewLoca4sw
    },
    {
        name: "nw",
        makeNewLoca :makeNewLoca4nw
    },
    {
        name: "ne",
        makeNewLoca :makeNewLoca4ne
    }
]