import React,{useContext} from 'react';
import { useToast } from '@chakra-ui/react'
/**
 * 데이타 검증 - MilliSecond 여부 전달
 * @returns 
 */
export const isMilliSecond = (key, val) => {
  const numFormat = /^[0-9]+$/;
  // MilliSecond 전달된 값은 숫자와 구별이 안돼 key 값에 date가 있으면 date 정보라 판단함.
//   const dateKeyChk = new RegExp("date", "i");
  
  return numFormat.test(val)  ? true : false;
}


export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}


export const loadLocalData = (key) => {
	let ls ;		
	try {
		ls = window.localStorage.getItem(key) || null;
		return ls
	} catch (e) {
		/*Ignore*/
	}
}
export const loadLocalDataJson = (key) => {
	let ls ;		
	try {
		ls = JSON.parse(window.localStorage.getItem(key)) || null;
		return ls
	} catch (e) {
		/*Ignore*/
	}
}

export const saveLocalData = (key, value) => {
	if (!window.localStorage) return;
	window.localStorage.setItem(key, value);
}

export const saveLocalDataJson = (key, value) => {
	if (!window.localStorage) return;
	window.localStorage.setItem(key, JSON.stringify(value));
}

export const removeLocalData = (key) => {
	window.localStorage.removeItem(key)
}


export const onPost = async (url, option, headers) => {
    let res;
    
    res = await fetch(url,{
        method: 'POST', 
        mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: headers || {
            'Content-Type': 'application/json'
        },
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

export const onPostImage = async (url, formData, customPath) => {
	let res;
	let pathName = "images";
	if(customPath){pathName = customPath}
	let options = {
		method: 'POST', 
		mode: 'cors', 
		// headers: {
		// 	// 'Content-Type': 'application/x-www-form-urlencoded'
		// 	'Content-Type': 'multipart/form-data'
		// },
		body: formData,
		[pathName]: formData
	}
	
	
	res = await fetch(url, options);
	
  
	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.')
		error.info = await res.json()
		error.status = res.status
		throw error
	}

	return res.json()
}

export const onPostWithToken = async (url, token, bodyObj) => {
	let header= {
		'Content-Type': 'application/json',
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "*",
		"Access-Control-Allow-Headers": "*" 
	}

	let body = "";

	if(token){
		header['jwt-auth-token'] = token;
	}

	if(bodyObj){
		body = JSON.stringify(bodyObj);

	}


	let option ={
		method: 'POST', 
		mode: 'cors', 
		cache: 'no-cache', 
		credentials: 'same-origin', 
		headers: header,
		redirect: 'follow', 
		referrerPolicy: 'no-referrer', 
		body: body,
	}
	
	let res = await fetch(url, option);
	
	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.')
		error.info = await res.json()
		error.status = res.status
		throw error
	}

	return res.json();
}

export const onGet = async (url, params, headers) => {
    // params 객체가 있으면 쿼리스트링으로 변환
    let query = '';
    if (params && typeof params === 'object') {
        const esc = encodeURIComponent;
        query =
            '?' +
            Object.keys(params)
                .map(k => esc(k) + '=' + esc(params[k]))
                .join('&');
    }
    let res = await fetch(url + query, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: headers || {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
}