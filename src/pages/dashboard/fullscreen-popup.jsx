import React, { cloneElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFullScreen } from '../../hook/useFullScreen';
import { useThemeMode } from '../../provider/MainProvider';
import { contentRefTable } from '../../ref/component';
import { Wrapper, DataProv } from './card/content';
import closeIcon from '../../assets/svg/dashboard-icons/x_close.svg';

const _fullscreen_popup_ = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;

    .background-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .fullscreen-popup-content {
        position: relative;
        background-color: #fff;
        width: 95vw;
        height: 90vh;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 1;
        display: flex;
        flex-direction: column;
        
        .fullscreen-popup-header {
            height: 40px;
            margin-bottom: 10px;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .close-button {
                width: 32px;
                height: 32px;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: none;
                border: none;
                
                &:hover {
                    opacity: 1;
                }

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        
        .fullscreen-popup-body {
            flex: 1;
            overflow: hidden;
            position: relative;
        }
    }

    &.dark {
        .fullscreen-popup-content {
            background-color: #1a1a1a;
            color: #fff;
            
            .close-button {
                filter: invert(1);
            }
        }
    }
`;

export const FullScreenPopup = () => { 
    const { fullScreenInfo, setFullScreenInfo } = useFullScreen();
    const { theme, mode, themeStyle } = useThemeMode();
    
    if (!fullScreenInfo) return null;

    const { card, apiObj, padding } = fullScreenInfo;
    const ContentComponent = contentRefTable[card.cardType];

    const handleClose = () => {
        setFullScreenInfo(null);
    };

    const componentConfig = {
        card, 
        layout: { w: 160, h: 120 },
        themeStyle: themeStyle,
        apiObj, 
        isCardHeader: card.isCardHeader, 
        isSelected: false,
        isPreview: true,
        setCardOption: () => {},
        setOption4Content: () => {}
    };

    return (
        <_fullscreen_popup_ className={theme === 'dark' ? 'dark' : ''}>
            <div className="background-overlay" onClick={handleClose} />
            <div className='fullscreen-popup-content'>
                <div className='fullscreen-popup-header'>
                    <button className='close-button' onClick={handleClose}>
                        <img src={closeIcon} alt="close" />
                    </button>
                </div>
                <div className='fullscreen-popup-body'>
                    <div className="stage" style={{ width: '100%', height: '100%' }}>
                        <div className={`card ${theme}`} style={{ borderRadius: 0, border: 'none', background: 'none' }}>
                            <Wrapper padding={padding || {top:0, left:0, right:0, bottom:0}}>
                                {apiObj ? (
                                    <DataProv card={card} isSwiper={true} apiObj={apiObj} setCardLink={() => {}} padding={padding || {top:0, left:0, right:0, bottom:0}}>
                                        {cloneElement(ContentComponent, componentConfig)}
                                    </DataProv>
                                ) : (
                                    cloneElement(ContentComponent, componentConfig)
                                )}
                            </Wrapper>
                        </div>
                    </div>
                </div>
            </div>
        </_fullscreen_popup_>
    );
}
