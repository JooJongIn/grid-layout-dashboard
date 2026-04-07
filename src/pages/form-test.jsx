import React,{useState} from 'react';
import {_form_} from '../styles/form-style';

import { Form, Form4Shared, Text, Submit, Select, Email, Tel, DateBox, Checks, Radio, LinkButton, Search } from '../component/form';


export const FormTest = () => {

	const onSubmit = (data) => {
		alert(JSON.stringify(data));
	};

	return (
		<_form_>
		<div className='form-container'>
			<Form onSubmit={onSubmit}>
				<Text name="name" kr required label="이름"/>
				<Text name="address" label="주소"/>
				<Email name="email" label="이메일" />
				<div className='form-button-area'>
					<Submit >수정</Submit>
				</div>
				
			</Form>
			
			<Form onSubmit={onSubmit}>
				<Select name="isAccept"  label="동의">
				{{"동의":true,"비동의":false}}
				</Select>
				<Checks name="class" label="과목"> 
				{{kor:"국어", eng:"영어", mat:"수학"}}
				</Checks>
				<Radio name="email" label="성별" >
				{{남자:"man", 여자:"female"}}
				</Radio>
				<div className='form-button-area'>
					<Submit >수정</Submit>
				</div>
				
			</Form>

			<Form4Shared onSubmit={onSubmit} id="shard-form">
				<Text name="name" label="이름"/>
				<Tel name="phoneNum" label="번호" required />
				<DateBox name="date" label="날자" required />
				<div className='form-button-area'>
					<Submit >수정</Submit>
				</div>
				
			</Form4Shared>

		</div>
		
		</_form_>
 
    
		
	);
}
