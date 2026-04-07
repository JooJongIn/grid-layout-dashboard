import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useStage } from '../../../hook/useStage';
    
import { stageCol } from '../../../ref/stage-setting'

import plusIcon from "../../../assets/svg/icons2/simple_plus.svg";

export const CopyButtons = ({isPrint}) => { 
    const { selectedCard, copyCard } = useStage(isPrint);
    const cardLocation = selectedCard.cardLocation;
    const {x,y,w,h} = cardLocation;

    const isLeft = x >= w;
    const isRight = (x + w + w) <= stageCol ;


    return(
        <_copy_handler_>
            {/* {points.map( (p, idx) =>  <Copybutton key={idx} {...p} cardLocation={cardLocation} copyCard={copyCard} />)} */}
            <Copybutton name={"bottom"} makeNewLoca={makeNewLoca4bottom} cardLocation={cardLocation} copyCard={copyCard} />
            {isLeft &&< Copybutton name={"left"} makeNewLoca={makeNewLoca4left} cardLocation={cardLocation} copyCard={copyCard} />}
            {isRight && <Copybutton name={"right"} makeNewLoca={makeNewLoca4right} cardLocation={cardLocation} copyCard={copyCard} />}
        </_copy_handler_>
    )
}


const Copybutton = ({name, makeNewLoca, cardLocation, copyCard}) => {
    
    const handlerCopy = () => {
        let originLoca = cardLocation;
        let newLoca = makeNewLoca(originLoca)

        copyCard(newLoca)
    }

    return(
        <div className={'copy-btn ' + name} onClick={handlerCopy}>
            <img src={plusIcon} alt={name} />
        </div>
    )
}



const _copy_handler_ = styled.div`
    .copy-btn{
        position: absolute;

        width: 14px; height: 14px;
        display: flex; justify-content: center; align-items: center;
        padding: 1px;
        color: black;
        border: 1px solid black;
        background-color: white;
    }

    .copy-btn-text{
        /* font-size: 18px; */
        

        width: 14px; height: 14px;
        /* padding-top: 3px;
        line-height: 15px; */
    }

    .bottom{
        /* padding-left: 1px; */
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 40%);
        cursor: pointer;
    }

    .left{
        left: 0;
        top: 50%;
        transform: translate(-40%, -50%);
        cursor: pointer;
    }

    .right{
        right: 0;
        top: 50%;
        transform: translate(40%, -50%);
        cursor: pointer;
    }
`


const makeNewLoca4bottom = (originLoca) => ({...originLoca, y: originLoca.y + originLoca.h})
const makeNewLoca4left = (originLoca) => ({...originLoca, x: originLoca.x - originLoca.w})
const makeNewLoca4right = (originLoca) => ({...originLoca, x: originLoca.x + originLoca.w})

const points =  [
    {
        name: "bottom",
        makeNewLoca :makeNewLoca4bottom
    },
    {
        name: "left",
        makeNewLoca :makeNewLoca4left
    },
    {
        name: "right",
        makeNewLoca :makeNewLoca4right
    }
]