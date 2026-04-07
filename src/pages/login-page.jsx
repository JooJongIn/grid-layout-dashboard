import React, { useEffect } from 'react';
import styled from 'styled-components'

import { Form, Password,Text,Submit } from '../component/form';

import {useMainSetting  } from "../hook/useMainSetting";

import { onPostWithToken, onGet } from './utils'
import { Buffer } from "buffer";

import { userDBUrl } from '../ref/url'

import cinamonLogo from '../assets/logo/cinamon_logo.png'
import paloaltoLogo from '../assets/logo/paloalto_logo.png'

export function LoginPage() {
	const {login, setNewToken} = useMainSetting();

	// 🧪 테스트 계정 (주석 해제하면 자동 로그인)
	// useEffect(() => {
	// 	// 슈퍼관리자 테스트
	// 	testLogin("admin", 1);
		
	// 	// 일반 사용자 테스트
	// 	// testLogin("user", 5);
	// },[])

	const testLogin = (type, roleId) => {
		const testAccounts = {
			"admin": {
				userId: "test_admin",
				userNm: "테스트관리자",
				roleId: roleId,
				custId: "1",
				custNm: "테스트회사"
			},
			"user": {
				userId: "test_user",
				userNm: "테스트사용자",
				roleId: roleId,
				custId: "1",
				custNm: "테스트회사"
			}
		};
		login(testAccounts[type]);
	}

	// 0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c
	// edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9
	const loginHandler =  async  (e) => {
		const userName = e?.username;
		const password = e?.password;

		const pwSha = sha256_digest(password);
		const result = await onGet(`${userDBUrl}/getToken.do` + `?userId=${userName}&userPw=${pwSha}`);
		
		if(!(result.data && result.data.msg))return alert("실패");
		if(result.data.msg !== "로그인 성공")return alert("실패");
		const token = result.data["jwt-auth-token"];
		getUserInfo(token);
	}

	const getUserInfo = async (token) => {
		const result = await onPostWithToken(`${userDBUrl}/getUser.do`, token, {});
		if(result.result !== "success")return alert("실패");
		const info = result.data['user'];
		setNewToken(token)
		login({...info});
	}	


	return (
		<_login_>
		<div className='main-login-page'>
			<div className='main-login-area'>
				<div className='login-title'>security portal</div>
				
				<Form onSubmit={loginHandler}>
					<Text name="username" placeholder="Username"  required/>
					<Password name="password" placeholder="Password" required/>
					<Submit>
						로그인
					</Submit>
				</Form>

				{/* 🧪 테스트 계정 빠른 로그인 */}
				{/* <div className='test-login-buttons'>
					<button onClick={() => testLogin("admin", 1)}>
						🔑 슈퍼관리자 (roleId: 1)
					</button>
					<button onClick={() => testLogin("user", 5)}>
						👤 일반사용자 (roleId: 5)
					</button>
				</div> */}
				
			</div>
			<div className='logo-area'><img className='img1' src={paloaltoLogo} /> 
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <img className='img2' src={cinamonLogo} /></div>
		</div>
		</_login_>
	);
}

const _login_ = styled.div`
.main-login-page{
	width: 100%;
	height: 100%;

	.logo-area{
		margin: auto;
		display: flex;
		// margin: 30px 50px 30px;
		padding: 0 1rem;
		align-items: center;
		justify-content: center;
		
		.img1{
			width: 12rem;
		}

		.img2{
			width: 10rem;
		}
	}
	.main-login-area{
		margin: auto;
		width: 500px;
		height: 100%;

		padding-top:15rem;
		padding-bottom: 5rem;
		.login-title{
			font-size: 48px;
			text-align: center;
			margin-bottom: 3.0rem;
		}

		form{
			.input-main{
				width: 100%;
				padding: 1rem 0;
			}
			.input-box{
				border: 0.5px solid black;
				width: 100%;
				height: 3.5rem;
				input{
					
					padding: 0.5rem;
					width: calc(100% - 1rem); height: calc(100% - 1rem);
					
					border: 0; background-color: transparent;
				}
			}

			.input-error{
				font-size: 12px;
			}

		}

		.form-submit{
			margin-top: 1.1rem;
			height: 3.5rem;
			font-size: 20px;
			border: 1px solid black;
			width: 100%;
			padding: 0.7rem;
			/* font-family: 700; */
			background-color: white;
			cursor: pointer;
		}

		.test-login-buttons{
			margin-top: 2rem;
			display: flex;
			gap: 1rem;
			
			button{
				flex: 1;
				padding: 0.8rem;
				border: 1px solid #ddd;
				background-color: #f5f5f5;
				cursor: pointer;
				font-size: 13px;
				border-radius: 4px;
				transition: all 0.2s;

				&:hover{
					background-color: #e0e0e0;
					border-color: #999;
				}
			}
		}
	}
	
	
}
input{
	:-webkit-autofill,
	:-webkit-autofill:hover,
	:-webkit-autofill:focus,
	:-webkit-autofill:active {
		transition: background-color 5000s ease-in-out 0s;
		-webkit-transition: background-color 9999s ease-out;
		-webkit-box-shadow: 0 0 0px 1000px white inset !important;
		box-shadow: 0 0 0px white inset !important;
		/* -webkit-text-fill-color: #fff !important; */
	}
}

`




const userInfos = {
	"skt": {
		auth: "S",
		defaultPage: "page0",
	},
	"admin1": {
		auth: "A",
		pw:"admin",
		defaultPage: "page1",
	},

	"admin2": {
		auth: "A",
		pw:"admin",
		defaultPage: "page2",
	},

	"admin3": {
		auth: "A",
		pw:"admin",
		defaultPage: "page3",
	},

}







/*
* A JavaScript implementation of the SHA256 hash function.
*
* FILE:	sha256.js
* VERSION:	0.8
* AUTHOR:	Christoph Bichlmeier <informatik@zombiearena.de>
*
* NOTE: This version is not tested thoroughly!
*
* Copyright (c) 2003, Christoph Bichlmeier
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions
* are met:
* 1. Redistributions of source code must retain the above copyright
*    notice, this list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright
*    notice, this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of contributors
*    may be used to endorse or promote products derived from this software
*    without specific prior written permission.
*
* ======================================================================
*
* THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY EXPRESS
* OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
* BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
* WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
* OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
* EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* SHA256 logical functions */
function rotateRight(n,x) {
	return ((x >>> n) | (x << (32 - n)));
}
function choice(x,y,z) {
	return ((x & y) ^ (~x & z));
}
function majority(x,y,z) {
	return ((x & y) ^ (x & z) ^ (y & z));
}
function sha256_Sigma0(x) {
	return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
}
function sha256_Sigma1(x) {
	return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
}
function sha256_sigma0(x) {
	return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
}
function sha256_sigma1(x) {
	return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
}
function sha256_expand(W, j) {
	return (W[j&0x0f] += sha256_sigma1(W[(j+14)&0x0f]) + W[(j+9)&0x0f] + 
sha256_sigma0(W[(j+1)&0x0f]));
}

/* Hash constant words K: */
var K256 = new Array(
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
	0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
	0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
	0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
	0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
	0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
	0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
);

/* global arrays */
var ihash, count, buffer;
var sha256_hex_digits = "0123456789abcdef";

/* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters: 
overflow) */
function safe_add(x, y)
{
	var lsw = (x & 0xffff) + (y & 0xffff);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xffff);
}

/* Initialise the SHA256 computation */
function sha256_init() {
	ihash = new Array(8);
	count = new Array(2);
	buffer = new Array(64);
	count[0] = count[1] = 0;
	ihash[0] = 0x6a09e667;
	ihash[1] = 0xbb67ae85;
	ihash[2] = 0x3c6ef372;
	ihash[3] = 0xa54ff53a;
	ihash[4] = 0x510e527f;
	ihash[5] = 0x9b05688c;
	ihash[6] = 0x1f83d9ab;
	ihash[7] = 0x5be0cd19;
}

/* Transform a 512-bit message block */
function sha256_transform() {
	var a, b, c, d, e, f, g, h, T1, T2;
	var W = new Array(16);

	/* Initialize registers with the previous intermediate value */
	a = ihash[0];
	b = ihash[1];
	c = ihash[2];
	d = ihash[3];
	e = ihash[4];
	f = ihash[5];
	g = ihash[6];
	h = ihash[7];

        /* make 32-bit words */
	for(var i=0; i<16; i++)
		W[i] = ((buffer[(i<<2)+3]) | (buffer[(i<<2)+2] << 8) | (buffer[(i<<2)+1] 
<< 16) | (buffer[i<<2] << 24));

        for(var j=0; j<64; j++) {
		T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
		if(j < 16) T1 += W[j];
		else T1 += sha256_expand(W, j);
		T2 = sha256_Sigma0(a) + majority(a, b, c);
		h = g;
		g = f;
		f = e;
		e = safe_add(d, T1);
		d = c;
		c = b;
		b = a;
		a = safe_add(T1, T2);
        }

	/* Compute the current intermediate hash value */
	ihash[0] += a;
	ihash[1] += b;
	ihash[2] += c;
	ihash[3] += d;
	ihash[4] += e;
	ihash[5] += f;
	ihash[6] += g;
	ihash[7] += h;
}

/* Read the next chunk of data and update the SHA256 computation */
function sha256_update(data, inputLen) {
	var i, index, curpos = 0;
	/* Compute number of bytes mod 64 */
	index = ((count[0] >> 3) & 0x3f);
        var remainder = (inputLen & 0x3f);

	/* Update number of bits */
	if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
	count[1] += (inputLen >> 29);

	/* Transform as many times as possible */
	for(i=0; i+63<inputLen; i+=64) {
                for(var j=index; j<64; j++)
			buffer[j] = data.charCodeAt(curpos++);
		sha256_transform();
		index = 0;
	}

	/* Buffer remaining input */
	for(var j=0; j<remainder; j++)
		buffer[j] = data.charCodeAt(curpos++);
}

/* Finish the computation by operations such as padding */
function sha256_final() {
	var index = ((count[0] >> 3) & 0x3f);
        buffer[index++] = 0x80;
        if(index <= 56) {
		for(var i=index; i<56; i++)
			buffer[i] = 0;
        } else {
		for(var i=index; i<64; i++)
			buffer[i] = 0;
                sha256_transform();
                for(var i=0; i<56; i++)
			buffer[i] = 0;
	}
        buffer[56] = (count[1] >>> 24) & 0xff;
        buffer[57] = (count[1] >>> 16) & 0xff;
        buffer[58] = (count[1] >>> 8) & 0xff;
        buffer[59] = count[1] & 0xff;
        buffer[60] = (count[0] >>> 24) & 0xff;
        buffer[61] = (count[0] >>> 16) & 0xff;
        buffer[62] = (count[0] >>> 8) & 0xff;
        buffer[63] = count[0] & 0xff;
        sha256_transform();
}

/* Split the internal hash values into an array of bytes */
function sha256_encode_bytes() {
        var j=0;
        var output = new Array(32);
	for(var i=0; i<8; i++) {
		output[j++] = ((ihash[i] >>> 24) & 0xff);
		output[j++] = ((ihash[i] >>> 16) & 0xff);
		output[j++] = ((ihash[i] >>> 8) & 0xff);
		output[j++] = (ihash[i] & 0xff);
	}
	return output;
}

/* Get the internal hash as a hex string */
function sha256_encode_hex() {
	var output = new String();
	for(var i=0; i<8; i++) {
		for(var j=28; j>=0; j-=4)
			output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
	}
	return output;
}

/* Main function: returns a hex string representing the SHA256 value of the 
given data */
function sha256_digest(data) {
	sha256_init();
	sha256_update(data, data.length);
	sha256_final();
        return sha256_encode_hex();
}

/* test if the JS-interpreter is working properly */
function sha256_self_test()
{
	return sha256_digest("message digest") == 
"f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650";
}