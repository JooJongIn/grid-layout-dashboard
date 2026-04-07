import { useEffect, useState } from 'react'
import styled from 'styled-components';

export const Space = ({card}) => { 
    const [lineDirection, setDirection] = useState( null );
    const [lineWidth, setWidth] = useState( 1 );
    const [lineColor, setColor] = useState( "black" );

    useEffect(() => {
        const options = card.options;
		if(!(options && options.dividingLine)) setDirection(null);
        else setDirection(options.dividingLine);
        
        if(!(options && options.divLineWid)) setWidth(1);
        else setWidth(options.divLineWid);

        if(!(options && options.mainColor)) setColor("black");
        else setColor(options.mainColor);
    },[card])

    return(
        <>
        <_space_ dir={lineDirection} wid={lineWidth} color={lineColor}>
            <div className='dividing-line'  />
        </_space_>
        </>
    )
}


const _space_ = styled.div`
    width: 100%;
    height: 100%;
    display:flex; align-items: center; justify-content: center;

    .dividing-line{
        width: ${p => p.dir === "vertical" ? "100%" : 0};
        height: ${p => p.dir === "horizontal" ? "100%" : 0};
        border-left: ${ p =>p.dir === "horizontal" ? p.wid+"px solid " + p.color : "0"};
        border-bottom: ${ p =>p.dir === "vertical" ? p.wid+"px solid " + p.color : "0"};
    }
`