import { useEffect, useState } from 'react'
import useSWR from "swr";
import axios from 'axios'
import { dashobardDBUrl } from './ref/url';
import { onPost } from './pages/utils';
import { useMainSetting } from './hook/useMainSetting';

export const fetcher = async url => {
    const res = await fetch(url)
    
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.info = await res.json()
      error.status = res.status
      throw error
    }
  
    return res.json()
}

export const fetcher4Post = async (url, option) => {
  let headers = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*" 
  }

  if(!url)return;
	const res = await fetch(url,{
		method: 'POST', 
		mode: 'cors', 
		cache: 'no-cache', 
		credentials: 'same-origin',  
		headers: headers,
		redirect: 'follow', 
		referrerPolicy: 'no-referrer', 
		body: JSON.stringify(option)
	});
	
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

const useShared = (key, initVal) => {
	const { data: state, mutate: setState } = useSWR(key, {fallbackData: initVal});
  return [state , setState];
}

export const config = useShared;
export const shared = useShared;


export const store = (url, id, interval, postParam, apiObj) => {
  const { globalInterval } = useMainSetting();
  const finalInterval = interval || globalInterval || 60;
  const options4Swr = { refreshInterval: finalInterval * 60 * 1000 };
  
  let tokenName = apiObj.token;
  let body = apiObj.body;
  const postFetch = !tokenName 
    ? (ep) => { return fetcher4Post(ep, postParam) }
    : (ep) => { return fetcherWithToken(ep, tokenName, body) };

  const { data: all, error, mutate } = useSWR(
    [url + `#${id}`, postParam], 
    url ? postFetch : null,
    options4Swr
  );

  return { all, error, mutate };
}

const tokenOptions = {
  "SMCore": {id: "cianmon@1885471626.iam.panserviceaccount.com", pw: "652a8018-684a-4518-81a9-7f75e13f909e", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
  "TechVDI": {id: "cianmon@1150339157.iam.panserviceaccount.com", pw: "2852986d-7938-4811-a6eb-4d25c9ab6836", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
  "SKinc": {id: "cianmon@1642267532.iam.panserviceaccount.com", pw: "a92292a3-d1a1-416a-963a-05b42afd4a03", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
  "SKincChina": {id: "cianmon@1516153402.iam.panserviceaccount.com", pw: "f4630f0e-5148-4cb6-a76d-46c6321ae8b9", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
  "SKNexilis": {id: "cianmon@1809903857.iam.panserviceaccount.com", pw: "9ae6d87c-4912-4a7e-9305-0068c25e3595", url: "https://auth.apps.paloaltonetworks.com/oauth2/access_token"},
}


const fetcherWithToken = async (url, tokenName, body) => {

  let token = await getToken(tokenName);
  let result = await callWithToken(url, token, body)
  return result
}

const getToken = async (tokenKey) => {
  const tokenInfo = tokenOptions[tokenKey];
  try {
    // 방법 1: 백엔드 프록시 API를 통해 요청 (권장)
    // 백엔드에 프록시 엔드포인트를 구현해야 합니다
    const proxyResult = await axios.post(dashobardDBUrl + '/proxy/paloalto/token', {
      tokenUrl: tokenInfo.url,
      credentials: {
          id: tokenInfo.id,
          password: tokenInfo.pw
      },
      grantType: 'client_credentials'
  }, {
      headers: {
          'Content-Type': 'application/json'
      }
  });
    
    console.log('token via proxy', proxyResult);
    return "Bearer " + proxyResult.data.access_token;

} catch (error) {
    console.error('Token fetch error:', error);
    throw error;
}
}

const callWithToken = async (url, token, customBody) => {

  // 기본 URL이 없는 경우 서비스 연결 목록 엔드포인트 사용
  const apiUrl = url;
  const tenantId = "1150339157";
  
  const headers = {
      'Content-Type': 'application/json',
      'Prisma-Tenant': tenantId,
      'Authorization': token
  };
  
  // API 요청 본문 구성
  const body = customBody ? customBody : {
      "filter": {
          "operator": "AND",
          "rules": [
              {
                  "property": "node_type",
                  "operator": "equals",
                  "values": [51]
              },
              {
                  "property": "event_time",
                  "operator": "last_n_days",
                  "values": [30]
              }
          ]
      },
      "count": 100
  };

  const result = await onPost(apiUrl, body, headers);
  return result;
}