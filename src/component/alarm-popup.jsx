import { useState, useEffect, useMemo } from 'react';
import { useShared } from '../store';
import { _popup_ } from '../styles/popup-style';
import styled from 'styled-components';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import './style/data-grid.scss';

// 쿠키 관리 유틸리티 함수
const setCookie = (name, value, maxAge) => {
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const AlarmPopupStyled = styled(_popup_)`
    .alarm-popup {
        width: 800px !important;
        height: auto !important;
        max-height: 600px !important;
        min-height: 300px !important;

        .popup-body {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 0;
        }

        .alarm-grid-wrapper {
            flex: 1;
            overflow: hidden;
            padding: 0 0px;


            .dx-datagrid {


                .dx-header-row {
                    /* background-color: #f5f5f5 !important; */

                }

                .dx-datagrid-headers {
                }

                .dx-datagrid-content {

                }

                td {
                    color: #000 !important;
                    padding: 8px;
                }

                /* 스크롤바 스타일 */
                .dx-scrollable-container {
                    border-top: 0px solid red !important;
                    &::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }

                    &::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                    }

                    &::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 4px;

                        &:hover {
                            background: #555;
                        }
                    }

                    /* Firefox */
                    scrollbar-width: thin;
                    scrollbar-color: #888 transparent;
                }
            }
        }

        .hide-checkbox-container {
            display: flex;
            justify-content: start;
            align-items: center;
            width: 100%;
            gap: 8px;
            padding: 12px;
            margin-top: 10px;
            /* background: #f8f9fa; */
            border-radius: 6px;
            user-select: none;

            input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: #3498db;
            }

            label {
                font-size: 14px;
                font-weight: 500;
                color: #333;
                cursor: pointer;
                margin: 0;
            }
        }
    }
`;

export const AlarmPopup = () => {
    const [alarmData] = useShared("alarm-data", null);

    // 팝업 열림/닫힘 상태
    const [isOpen, setIsOpen] = useState(false);

    // API ID별로 이미 표시한 알람 리스트 관리
    // 구조: { "api_123": [alarm1_json, alarm2_json], "api_456": [...] }
    const [shownAlarmsByApi, setShownAlarmsByApi] = useState({});

    // 현재 표시할 알람 리스트
    const [currentAlarms, setCurrentAlarms] = useState([]);

    // 하루 동안 보지 않기 체크박스 상태
    const [hideForADay, setHideForADay] = useState(false);

    // 동적 컬럼 추출 (특정 키 제외)
    const dynamicColumns = useMemo(() => {
        if (!currentAlarms || currentAlarms.length === 0) {
            return [];
        }
        const excludeKeys = ['_alarm_', '_link_'];
        return Object.keys(currentAlarms[0]).filter(key => !excludeKeys.includes(key));
    }, [currentAlarms]);

    useEffect(() => {
        if (!alarmData) return;

        // 하루 동안 보지 않기 쿠키 체크
        const hideAlarm = getCookie('hideAlarmPopup');
        if (hideAlarm === 'true') return;

        const { apiId, alarms } = alarmData;
        if (!alarms || !Array.isArray(alarms)) return;

        setShownAlarmsByApi(prevShown => {
            const shownList = prevShown[apiId] || [];
            const newAlarms = [];
            const newShownList = [...shownList];

            alarms.forEach(alarm => {
                const alarmJson = JSON.stringify(alarm);
                if (!shownList.includes(alarmJson)) {
                    newAlarms.push(alarm);
                    newShownList.push(alarmJson);
                }
            });

            if (newAlarms.length > 0) {
                setCurrentAlarms(prev => [...prev, ...newAlarms]);
                setIsOpen(true);
                return { ...prevShown, [apiId]: newShownList };
            }
            return prevShown;
        });
    }, [alarmData]);

    const handleClose = () => {
        // 체크박스가 체크되어 있으면 쿠키 저장
        if (hideForADay) {
            // 오늘 자정까지의 시간 계산
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(23, 59, 59, 999);
            const secondsUntilMidnight = Math.floor((midnight - now) / 1000);

            setCookie('hideAlarmPopup', 'true', secondsUntilMidnight);
        }
        setIsOpen(false);
        setCurrentAlarms([]);
        setHideForADay(false);
    };

    if (!isOpen || currentAlarms.length === 0) return null;

    return (
        <AlarmPopupStyled>
            <div className="popup alarm-popup">
                <div className="popup-head">
                    <div> 시스템 알람</div>
                    <button onClick={handleClose}>✕</button>
                </div>
                <div className="popup-body">
                    <div className="alarm-grid-wrapper">
                        <DataGrid
                            className="custom-data-grid dark"
                            dataSource={currentAlarms}
                            showBorders={false}
                            showColumnLines={false}
                            showRowLines={true}
                            columnAutoWidth={true}
                            paging={{ enabled: false }}
                            showColumnHeaders={true}
                            height={400}
                            scrolling={{ mode: 'standard' }}
                        >
                            {dynamicColumns.map(key => (
                                <Column 
                                    key={key}
                                    dataField={key} 
                                    caption={key}
                                />
                            ))}
                        </DataGrid>
                    </div>
                    <div className="hide-checkbox-container ">
                        <input
                            type="checkbox"
                            id="hideAlarmCheckbox"
                            checked={hideForADay}
                            onChange={(e) => setHideForADay(e.target.checked)}
                        />
                        <label htmlFor="hideAlarmCheckbox">하루 동안 보지 않기</label>
                    </div>
                </div>
            </div>
            <div className="dim" onClick={handleClose}></div>
        </AlarmPopupStyled>
    );
};
