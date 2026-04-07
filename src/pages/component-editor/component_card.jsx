import { lazy, useState, useEffect, Suspense, useRef, cloneElement } from 'react';
import { config } from '../../store';

import settingIcon from '../../assets/images/ico_setting_black.svg';

export const Card = ({layout, component, setComponent}) => {
    // const Component  = lazy(() => import(`./componets4lazy/${component.id}`));
    // const isSelected = false;

    // const handlerDrop = async (e) => {
    //     e.preventDefault();
    //     const componentSorceUrl = e.dataTransfer.getData('text/uri-list');
    //     if(!componentSorceUrl) return;

    //     const url = new URL(componentSorceUrl);
    //     const name = url.searchParams.get('c');
        
    //     const res = await fetch("http://127.0.0.1:3000/crawl?url=" + componentSorceUrl)
    //     let optStringArr = await res.json();
    //     optStringArr.push("return option;")
    //     const optString = optStringArr.join(' \n');
    //     const options = new Function(optString)();
    //     setComponent({id: "line-chart", name: name, data: [], options: options})
    // }

    // const handlerDragOver = (e) => {e.preventDefault();}

    // return (<>
    //     <div className="card" onDrop={handlerDrop} onDragOver={handlerDragOver} >
    //     <Header id={component.id} />


    //     {/* <Title title={component.name} /> */}
    //     <Suspense fallback="Loading...">
    //         <Wrapper4Content >
    //             <Component layout={layout} data={component.data} options={component.options} />
    //         </Wrapper4Content>
    //     </Suspense>
    //     </div>
    // </>)
}





const Header = ({id}) => {
    const [showSettingPrompt, setShowSettingPrompt] = useState(false);

    const handleSetting = () => {
        setShowSettingPrompt(!showSettingPrompt);
    }


    return (
        <>
        <div className="header">
            <button className="setting_button" onClick={handleSetting}>
                <img src={settingIcon} alt="setting" />
            </button>
            {showSettingPrompt && <PromptArea />}
        </div>
        </>
    );
}



const PromptArea = () => {
    const [prompt, setPrompt] = useState('');

    const handleChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('YOUR_SERVER_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="prompt_area">
            <textarea 
                value={prompt} 
                onChange={handleChange} 
                placeholder="Enter your prompt here..." 
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

const Wrapper4Content = ({children}) => {
    const containerRef = useRef(null);
    const [padding, setPadding] = useState({});
    const [cardProps, setCardProps] = config("card_props");

    useEffect(() => {
        if(!(cardProps && cardProps.padding))return;
        setPadding(cardProps.padding)
    },[cardProps])

    return (
        <>
        <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
        <Top padding={padding.top}/>
        <div style={{display: "flex", flexDirection: "row", flex: 1, height: `calc(100% - ${padding.top || 0}px - ${padding.bottom || 0}px)`}}>
            <Left padding={padding.left}/>
            <div style={{flex: 1, width: `calc(100% - ${padding.left || 0}px - ${padding.right || 0}px)`, height: "100%" }} ref={containerRef}>
                {cloneElement(children, {containerRef: containerRef})}
            </div>
            
            <Right padding={padding.right}/>
        </div>
        <Bottom padding={padding.bottom}/>
        </div>
        </>
    );
}


const Top = ({padding}) => (<div className="top padding" style={{height: padding ? padding :'0', minHeight: padding ? padding :'0',  }} />)
const Left = ({padding}) => (<div className="left padding" style={{width: padding ? padding :'0', minWidth: padding ? padding :'0',  }} />)
const Right = ({padding}) => (<div className="right padding" style={{width: padding ? padding :'0',minWidth: padding ? padding :'0',  }} />)
const Bottom = ({padding}) => (<div className="bottom padding" style={{height: padding ? padding :'0', minHeight: padding ? padding :'0',  }} />)

// const {} = global("color_table")


