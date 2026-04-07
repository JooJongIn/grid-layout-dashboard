import { useEffect, useState } from 'react'
import { useMainSetting } from '../../../hook/useMainSetting';
import { LineChart, RadarChart } from '../echart-compo/preview-chart'
import moment from 'moment';

import ListIcon from "../../../assets/svg/dashboard-icons/table-large.svg";
import BarChartIcon from "../../../assets/svg/dashboard-icons/chart-bar.svg";
import LineChartIcon from "../../../assets/svg/dashboard-icons/chart-line.svg";
import PieChartIcon from "../../../assets/svg/dashboard-icons/chart-pie.svg";
import numberGauge from "../../../assets/svg/dashboard-icons/text_gauge.svg";
import arcGauge from "../../../assets/svg/dashboard-icons/arc_gauge.svg";
import arcStatusIcon from "../../../assets/svg/dashboard-icons/arc_status.svg";
import radarchartIcon from "../../../assets/svg/dashboard-icons/ant-design_radar-chart-outlined.svg";
import divideIcon from "../../../assets/svg/dashboard-icons/divide.svg";

import { onPost } from '../../utils';
import { useShared } from '../../../store';

import {getSampleData} from "../../../ref/data-sample";

import loadingIcon from "../../../assets/svg/dashboard-icons/loading.svg";
import { dashobardDBUrl } from '../../../ref/url';

import axios from 'axios';
const iconUrls = {
    Line: LineChartIcon,
    Bar: BarChartIcon,
    Pie: PieChartIcon,
    Radar: radarchartIcon,
    List: ListIcon,
    Gauge: numberGauge,
    DivideGauge: divideIcon,
    Status: arcStatusIcon,
    ArcGauge: arcGauge,
}


const tokenOptions = {
    "SMCore": {id: "cianmon@1885471626.iam.panserviceaccount.com", pw: "652a8018-684a-4518-81a9-7f75e13f909e", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
    "TechVDI": {id: "cianmon@1150339157.iam.panserviceaccount.com", pw: "2852986d-7938-4811-a6eb-4d25c9ab6836", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
    "SKinc": {id: "cianmon@1642267532.iam.panserviceaccount.com", pw: "a92292a3-d1a1-416a-963a-05b42afd4a03", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
    "SKincChina": {id: "cianmon@1516153402.iam.panserviceaccount.com", pw: "f4630f0e-5148-4cb6-a76d-46c6321ae8b9", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
    "SKNexilis": {id: "cianmon@1809903857.iam.panserviceaccount.com", pw: "9ae6d87c-4912-4a7e-9305-0068c25e3595", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
}


export const DataPreview = ({ domain, api }) => {
    const { userInfo } = useMainSetting();
    const [apiState, setApiState] = useState({
        url: false,
        compoType: null,
        errorText: null,
        apiTime: null,
        isLoading: false
    });

    const [apiData, setApiData] = useState(null);
    const [rawApiData, setRawApiData] = useState(null); // 전체 응답 데이터 저장
    const [selectedRowIndex, setSelectedRowIndex] = useState(0); // 선택된 row 인덱스
    const [apiParams, setApiParams] = useState({});
    const [queryId, setQueryId] = useShared("queryId", 0);

    // URL 설정
    useEffect(() => {
        if (!(domain && api)) {
            setApiState(prev => ({ ...prev, url: false }));
            return;
        }
        let url = "";
        if(api.apiType === "QUERY")url = dashobardDBUrl + "/querys";
        else url = domain.url + api.endpoint;
        console.log('url', url, dashobardDBUrl);
        setApiState(prev => ({ ...prev, url: url}));
    }, [domain, api]);

    // API 변경 시 상태 초기화
    useEffect(() => {
        setApiState(prev => ({
            ...prev,
            param: {},
            errorText: null,
            compoType: null,
            apiTime: null
        }));
        setApiData(null);
        setRawApiData(null);
        setSelectedRowIndex(0);
    }, [api]);

    // 데이터 헤더 처리
    useEffect(() => {
        if (!(apiData && Array.isArray(apiData))) {
            setApiState(prev => ({ ...prev }));
            return;
        }

        const firstRow = apiData[0];
        if (!firstRow) {
            setApiState(prev => ({ ...prev, errorText: ""}));
            return;
        }

        setApiState(prev => ({ ...prev}));
    }, [apiData]);

    // 데이터 fetch
    useEffect(() => {
        if (!(apiState.url && api)) {
            setApiData(null);
            return;
        }

        fetchData();
    }, [apiState.url, apiState.param, queryId]);

    const fetchData = async () => {
        if (!(apiState.url && api)) { 
            return setApiState(prev => ({ ...prev, data: null }));
        }

        setApiState(prev => ({ ...prev, isLoading: true }));

        console.log('api', api);

        let tokenName = api.token;
        let tokenInfo = tokenOptions[tokenName];

        try {
            // 토큰이 있는 REST API
            if (tokenInfo && api.apiType === "REST") {
                const token = await getToken(tokenInfo);
                
                // prismaaccess.com 호출인 경우 특별 처리
                if (api.url && api.url.includes("prismaaccess.com")) {
                    await callPaloPost(api, token);
                } 
                // 일반 토큰 인증 API
                else {
                    await fetchPostWithToken(token);
                }
            }
            // 토큰이 있는 PALO_ALTO API
            else if (tokenInfo && api.apiType === "PALO_ALTO") {
                const token = await getToken(tokenInfo);
                await callPaloPost(api, token);
            }
            // 일반 REST/QUERY API (토큰 없음)
            else if (api.apiType === "REST" || api.apiType === "QUERY") {
                await fetchPostData();
            } 
            // 기타 케이스 - 샘플 데이터
            else {
                fetchSampleData();
            }
        } finally {
            setApiState(prev => ({ ...prev, isLoading: false }));
        }
    };

    // 토큰을 사용한 REST API 호출
    const fetchPostWithToken = async (token) => {
        const body = {
            user: userInfo,
            ...(Object.keys(apiState.param || {}).length > 0 && { params: apiState.param })
        };

        // Authorization 헤더 추가
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const timestampBefore = moment();
        try {
            const result = await onPost(api.url || apiState.url, body, headers);
            const runningTime = moment().diff(timestampBefore) / 1000;
            
            setApiState(prev => ({
                ...prev,
                errorText: null,
                apiTime: runningTime
            }));
            
            setApiData(result.data || result);
        } catch (error) {
            console.error('토큰 API 호출 오류:', error);
            setApiState(prev => ({
                ...prev,
                errorText: error.message || "API 호출 중 오류가 발생했습니다.",
                apiTime: moment().diff(timestampBefore) / 1000
            }));
            setApiData(null);
        }
    };


    // API 호출 함수
    const fetchPostData = async () => {
        if (api.apiType === "QUERY" && !(api.querys && Array.isArray(api.querys))) return;
        console.log('apiState.param', apiState);
        

        let body = {
            
            params: { ...apiState.param },
            user: userInfo,
            ...(api.apiType === "QUERY" && { querys: api.querys }),
            ...(api.dataSource && { dataSource: api.dataSource })
        };

        
        const timestampBefore = moment();
        const result = await onPost(apiState.url, body);
        const runningTime = moment().diff(timestampBefore) / 1000;

        if (!(result && (result.row || result.data))) {
            setApiState(prev => ({
                ...prev,
                errorText: getErrorMessage(result),
                apiTime: runningTime
            }));
            setApiData(null);
            
            return;
        }

        setApiState(prev => ({
            ...prev,
            errorText: null,
            apiTime: runningTime
        }));
        
        // 전체 응답 데이터 저장
        setRawApiData(result);
        
        // row가 배열인 경우 선택된 인덱스의 데이터 사용
        let displayData = result.data || result.row;
        if (result.row && Array.isArray(result.row) && result.row.length > 0) {
            displayData = result.row[selectedRowIndex] || result.row[0];
        }
        setApiData(displayData);
    };

    const getToken = async (tokenInfo) => {
        try {
            // 방법 1: 백엔드 프록시 API를 통해 요청 (권장)
            // 백엔드에 프록시 엔드포인트를 구현해야 합니다

            const tokenUrl = tokenInfo.url;
            console.log('tokenInfo', tokenInfo);

            const response = await axios({
                method: 'post',
                url: 'https://auth.apps.paloaltonetworks.com/oauth2/access_token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic Y2lhbm1vbkAxMTUwMzM5MTU3LmlhbS5wYW5zZXJ2aWNlYWNjb3VudC5jb206Mjg1Mjk4NmQtNzkzOC00ODExLWE2ZWItNGQyNWM5YWI2ODM2'
                },
                data: 'grant_type=client_credentials'
            });
            // const proxyResult = await onPost(domain.url + '/proxy/paloalto/token', {
            //     tokenUrl: tokenInfo.url,
            //     credentials: {
            //         id: tokenInfo.id,
            //         password: tokenInfo.pw
            //     },
            //     grantType: 'client_credentials'
            // });
            
            console.log('token via proxy', response);
            return proxyResult.access_token;

        } catch (error) {
            console.error('Token fetch error:', error);
            throw error;
        }
    }

    const callPaloPost = async (api, token) => {
        if(!api.url)return;
        console.log('api', api);

        const apiUrl = api.url
        // 'https://pa-sg01.api.prismaaccess.com/api/sase/v2.0/resource/custom/query/serviceconnections/sc_list';
        const tenantId = "1150339157";
        
        const headers = {
            'Content-Type': 'application/json',
            'Prisma-Tenant': tenantId,
            'Authorization': `Bearer ${token}`
        };

        // API 요청 본문 구성
        const body = api.body  
        // {
        //     "filter": {
        //         "operator": "AND",
        //         "rules": [
        //             {
        //                 "property": "node_type",
        //                 "operator": "equals",
        //                 "values": [51]
        //             },
        //             {
        //                 "property": "event_time",
        //                 "operator": "last_n_days",
        //                 "values": [30]
        //             }
        //         ]
        //     },
        //     "count": 100
        // };

        console.log('body', body);
        const result = await onPost(apiUrl, body, headers);
            
        setApiData(result.data);   
    }

    // 샘플 데이터 처리
    const fetchSampleData = () => {
        const compo = api.components[0];
        if (!compo) return;
        setApiState(prev => ({ ...prev, data: getSampleData(compo) }));
    };

    // 에러 메시지 생성
    const getErrorMessage = (result) => {
        if (!result) return "서버 전송 실패";
        if (result.success === false && result.msg) return result.msg;
        return null;
    };

    // 파라미터 설정
    const handleSetParam = (key, value) => {
        setApiState(prev => ({
            ...prev,
            param: { ...prev.param, [key]: value }
        }));
    };

    // row 선택 변경 핸들러
    const handleRowSelection = (index) => {
        setSelectedRowIndex(index);
        
        // 선택된 row의 데이터로 업데이트
        if (rawApiData && rawApiData.row && Array.isArray(rawApiData.row)) {
            const selectedData = rawApiData.row[index];
            setApiData(selectedData);
        }
    };

    return (
        <>
            <ParamsArea 
                apiInfo={api} 
                setParam={handleSetParam} 
                rawData={rawApiData}
                selectedRowIndex={selectedRowIndex}
                onRowSelect={handleRowSelection}
            />
            <div className='middle-row'>
                <ComponentSelect 
                    apiInfo={api} 
                    type={apiState.compoType} 
                    setType={(type) => setApiState(prev => ({ ...prev, compoType: type }))} 
                />
                {apiState.apiTime && <>{apiState.apiTime}s</>}
            </div>
            
            <div className='text-area preview scroll-bar'>
                {apiState.isLoading ? (
                    <div className="loading-spinner" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'start',
                        height: '100%',
                        width: '100%',
                        paddingTop: "20px"
                    }}>
                        <img 
                            src={loadingIcon} 
                            alt="loading" 
                            style={{
                                width: '50px',
                                height: '50px'
                            }}
                        />
                    </div>
                ) : (
                    <>
                        {apiState.errorText && <ErrorArea text={apiState.errorText} />}
                        {!apiState.errorText && (
                            <>
                                {!apiState.compoType && <Table4Data data={apiData} />}
                                {(apiState.compoType && apiState.compoType !== "Radar") && 
                                    <LineChart data={apiData} type={apiState.compoType} />}
                                {apiState.compoType === "Radar" && 
                                    <RadarChart data={apiData} type={apiState.compoType} head={apiState.head} />}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const ParamsArea = ({apiInfo, setParam, rawData, selectedRowIndex, onRowSelect}) => {
    const [paramArray, setParamArray] = useState( [] );
    
    useEffect(() => {
        if(!apiInfo)return initParams();
        const params = apiInfo.params;

        let newArray = []
        for (const key in params) {
            const val = params[key];
            console.log(key, val);
            newArray.push({name: key,  list:val });
        }

        setParamArray(newArray);
    },[apiInfo])

    const initParams = () => {
        setParamArray([]);
    }


    return(<>
    <div className='param-selects'>
        {paramArray.map(p => <ParamSelect key={p.name} {...p} setParam={setParam}/> )}
        <RowSelector 
            rawData={rawData}
            selectedIndex={selectedRowIndex}
            onRowSelect={onRowSelect}
        />
    </div>
    </>)
}

const ParamSelect = ({list, name, setParam }) => {
    const [optList, setOpts] = useState( [] );

    useEffect(() => {
        if(!list)return setOpts([]);
        let newArr = Object.keys(list).map((k, idx)=> {
			const val = list[k];
			
			return({key:k, value:val});
		})
        setOpts(newArr);
    },[list])

    const handlerChange = (e) => {
        let val = e.target.value;
        val = val === "" ? null : val;
        // console.log("checkParamType", checkParamType("select * from list_exam where 지역 = {param1} and 접속자수 > {param2}"));;
        setParam(name, val)
    }

    
    const checkParamType = (whereStr) => {
        const pattern = /^select/i;
        let str = whereStr.replaceAll(" ", "");
        return pattern.test(str);
    }


    const opts = optList.map(li => <option value={li.value}>{li.key}</option>)

    return(<>

    <div className='param-select'>
        <div className='label'>{name}</div>
        <select name={name} onChange={handlerChange}>
            <option value={""}>값 없음</option>
            {opts}
        </select>
    </div>
    </>)
}

const ComponentSelect = ({apiInfo, type, setType}) => {
    const [compoArr, setCompoArr] = useState( [] );

    useEffect(() => {
        if(!(apiInfo && apiInfo.components && Array.isArray(apiInfo.components)))return setCompoArr([]);
        const components = apiInfo.components;
        const result = components.filter(c => ["Line", "Bar", "Radar"].find(i => c === i ));
        setCompoArr(result);
    },[apiInfo])

    const handlerClickBtn = (newType) => {
        setType(newType);
    }

    return (<>
    <div className='icons-flex'>
        <div className={'compoent-icon' + (!type ? " selected" : "")} onClick={()=>handlerClickBtn(null)}><img src={iconUrls["List"]} alt="" srcset="" /></div>
        {compoArr.map(compo => (
            <div className={'compoent-icon' + (type === compo ? " selected" : "")} onClick={()=>handlerClickBtn(compo)}><img src={iconUrls[compo]} alt="" srcset="" /></div>))
        }
    </div>
    </>)
}


const ErrorArea = ({text}) => {


    return(<>
        <div>
        {text}
        </div>
    
    </>)
}


const Table4Data = ({data, head}) => {
    const [dataList, setList] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if(!(data && Array.isArray(data))) {
            setList([]);
            setColumns([]);
            return;
        }

        setList(data);
        // 첫 번째 데이터 행에서 컬럼 정보 추출
        if(data.length > 0) {
            const columnKeys = Object.keys(data[0]);
            setColumns(columnKeys);
        }
    },[data])

    const Rows = dataList.map((d, idx) => <Row rowData={d} key={idx} columns={columns} />) 

    return(<>
    <table>
        <thead>
        {columns && <Head columns={columns} />}
        </thead>
        <tbody>
        {Rows}
        </tbody>
    </table>
    </>)
}

const Head = ({columns}) => {
    return(<>
    <tr className='row'>
        {columns.map((column, idx) => <th className='cell' key={idx}>{column}</th>)}
    </tr>
    </>)
}

const Row = ({rowData, columns}) => {
    const [cells, setCells] = useState([]);

    useEffect(() => {
        if(!rowData || !columns)return;
        
        // 컬럼 순서에 맞춰 데이터 매핑
        const orderedCells = columns.map(column => rowData[column]);
        setCells(orderedCells);
    },[rowData, columns])

    return(<>
    <tr className='row'>
        {cells.map((cell, idx) => (
            <td key={idx} className='cell'>
                {(typeof cell === "string" || typeof cell === "number") ? cell : ""}
            </td>
        ))}
    </tr>
    </>)
}

const RowSelector = ({ rawData, selectedIndex, onRowSelect }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (!rawData || !rawData.row || !Array.isArray(rawData.row)) {
            setOptions([]);
            return;
        }

        const rowOptions = rawData.row.map((_, index) => ({
            value: index,
            label: `Row ${index + 1}`
        }));
        
        setOptions(rowOptions);
    }, [rawData]);

    const handleChange = (e) => {
        const index = parseInt(e.target.value);
        onRowSelect(index);
    };

    if (options.length <= 1) {
        return null; // row가 1개 이하면 셀렉트 박스 표시 안함
    }

    return (
        <div className='param-select'>
            <div className='label'>Row</div>
            <select value={selectedIndex} onChange={handleChange}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

const setVar2Qry = (queryStr, param) => {
    // 변수가 있는지 체크
    if(!queryStr.includes("{"))return queryStr;

    const querySplit = queryStr.split("where");
    const exeQuery = querySplit[0];
    const whereStr = querySplit[1];
    
    let newWhereArr = [];
    let newWhereStr = "";

    // and or 둘다 가능하게 코드 
    const whereSplit = whereStr.split(/and|or/);
    let arr = whereStr.split(" ");
    let filterAndOR = arr.filter(str => str.match( /(and)|(or)/)  );
    const paramKeys = Object.keys(param);

    whereSplit.map(whItem => {
        // param 가변으로 숫자 변경 유의
        const dKey = paramKeys.find(pKey => whItem.includes(`{${pKey}}`));
        
        if(!dKey)return;
        const val = param[dKey];
        whItem = whItem.replaceAll(`{${dKey}}`, checkParamType(val));
        newWhereArr.push(whItem);
    })

    newWhereArr.map((whItem, idx) => {
        newWhereStr += idx === 0 ? "where" : filterAndOR[idx - 1]
        newWhereStr += whItem;
    })

    return exeQuery + newWhereStr;
}

const checkParamType = (r) => r;