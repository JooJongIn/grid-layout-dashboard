import { useEffect, useState } from 'react'

export const KeyControl4MovePostion = ({isRunning, setLocation, location}) => {
    const keyMapping = {
        'ArrowUp': () => setLocation(() => ({...location, yPos:location.yPos - 2})),
		'ArrowDown': () => setLocation(() => ({...location, yPos:location.yPos + 2})),
		'ArrowLeft': () => setLocation(() => ({...location, xPos:location.xPos - 2})),
		'ArrowRight': () => setLocation(() => ({...location, xPos:location.xPos + 2})),
    }

    return (isRunning && <KeyControl keyMapping={keyMapping} location={location} />)
}

export const KeyControl4ChangeMainSize = ({isRunning, dKey, setSize, location}) => {
    const keyMapping = {
        'ArrowUp_Shift': () => setSize(() => ({...location, [dKey]:location[dKey] + 4})),
		'ArrowDown_Shift': () => setSize(() => ({...location, [dKey]:location[dKey] - 4})),
    }
    
    return (isRunning && <KeyControl keyMapping={keyMapping} />)
}

export const KeyControl4ChangeSubSize = ({isRunning, dKey, setSize, location}) => {
    const keyMapping = {
        'ArrowUp_Shift_Alt': () => setSize(() => ({...location, [dKey]:location[dKey] + 4})),
		'ArrowDown_Shift_Alt': () => setSize(() => ({...location, [dKey]:location[dKey] - 4})),
    }
    
    return (isRunning && <KeyControl keyMapping={keyMapping} />)
}

export const KeyControl4Reset = ({isRunning, reset}) => {
    const keyMapping = {
        'r_Ctrl': () => reset(),
    }
    
    return (isRunning && <KeyControl keyMapping={keyMapping} />)
}

export const KeyControl = ({keyMapping}) => {

    const handleKeyDownEvent = (key, event) => {
        const {shiftKey, ctrlKey, altKey} = event;
		let keybutton = key + (shiftKey ? "_Shift" : "") + (ctrlKey ? "_Ctrl" : "") + (altKey ? "_Alt" : "");
		let func = keyMapping[keybutton];
		if(!func)return;
        event.preventDefault();
        func();
        
	}

    useEffect(() => {
        const handleKeyDown = (event) => { 
            handleKeyDownEvent(event.key, event);
        };

        window.addEventListener('keydown', handleKeyDown);
    
        return () => { window.removeEventListener('keydown', handleKeyDown);};
    }, [keyMapping]);

}