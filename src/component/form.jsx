import { cloneElement, forwardRef, useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import React from 'react'
import styled from 'styled-components';
// import { _terminal_ } from './styles';
import { control, useShared } from '../store';
import {  Link } from 'react-router-dom'
import Calendar from 'react-calendar';

// 테스트용 아이콘
// import { ConstructionOutlined } from '@mui/icons-material';


export const Linker = ({children, target, payload} ) => {

	return(
		<>
		<Link to={target + '/' + payload}>
			<button >
				{children}
			</button>
			</Link>
		</>
	)
}



export const Control = ({children, target, onLoad, payload}) =>{
   
   
   const {open} = control(target)
   
   function handle(){
     
     open()
     onLoad(payload+1)
   }

  return (
    <>
        <button onClick={handle}> {children}---{payload}</button>
      </>
  )

}


export const Form4Shared = ({children, onSubmit, id}) => {
	const { register,  formState: { errors }, handleSubmit, control } = useForm({mode: "onBlur"});
	const [form_data, set_form_data] = useShared(id,{});
	const [formData, setFormData] = useState({});
	const [formError, setError] = useState(false);
	
	useEffect(() =>{
		if(!form_data)return
		setFormData({...form_data});
	},[])

	useEffect(() => {
		
  }, [errors]);

	const addFormData = (name, value)=>{
		let newObj = {...formData}
		newObj[name] = value;
		setFormData(newObj);
	}

	const onSuccess = (data,temp) => {
		setError(false);
		let newData = { ...formData,...data}

		console.log("onSuccess", data , newData, formData);
		onSubmit(newData, temp)
		set_form_data(newData)
	}
	const onError = () => {	
		setError(true);
	};

	let formContent
  

	if(Array.isArray(children)){
		formContent = children.map((c, idx)=> {
			let componentProps = { reg : register, errors:errors, control:control, id:idx, setData:addFormData};
			
			if(form_data && form_data.hasOwnProperty(c.props.name)){
				componentProps.initValue = form_data[c.props.name];
			}
	
			return cloneElement(c, componentProps);
		})
	}
	else{
		let componentProps = { reg : register, errors:errors, control:control, setData:setFormData };
		if(form_data && form_data.hasOwnProperty(children.props.name)){
			componentProps.initValue = form_data[children.props.name];
		}
		
		formContent = cloneElement(children, componentProps);
	}


  return (
    <>

    <form onSubmit={handleSubmit(onSuccess, onError)} id={id} className="form">
			{formContent}

			{(formError && Object.keys(errors).length > 0) && <p>error</p>}

    </form>
    </>
  )
}



 export const Form  = ({children, initValues ,onSubmit, id, onChange}) => {
  	const { register,  formState: { errors }, handleSubmit, control, setValue, getValues } = useForm({mode: "onBlur"});
	const [formError, setError] = useState(false);

	useEffect(() => {
		setTimeout(() => console.log(getValues()), 1000);
	},[])

	useEffect(() => {
  	}, [errors]);

	useEffect(() => {
		if(!initValues)return;
		Object.keys(initValues).map(key => {
			let val = initValues[key];
			setValue(key, val);
		})
	},[initValues])

	const onSuccess = (data,temp) => {
		setError(false);
		onSubmit(data, temp)
	}

	const onError = () => {	
		setError(true);
	};

	let childs = []
	let formContent;


//  const { register, handleSubmit, formState } = useForm({mode: 'onBlur', reValidateMode:'onBlur'})
  

	if(Array.isArray(children))childs = [...children];
	else childs = [children];

	formContent = childs.map((fcon, idx) => {
		let componentProps = { reg : register, errors:errors, control:control, id:idx, setValue:setValue };
		componentProps.key = "form-input" + idx;
		return cloneElement(fcon, componentProps);
	})


  return (
    <>

    <form onSubmit={handleSubmit(onSuccess, onError)} id={id} className="form" >
			{formContent}

			{/* {(formError && Object.keys(errors).length > 0) && <p>error</p>} */}

    </form>
    </>
  )
 }


 export const Password = ({reg, label, name, required, placeholder, errors}) => {
	const error = (errors && errors[name] ) ? errors[name] : null;

	return(
		<>
		<div className="input-container">
			<div className="input-main">
				{label &&
					<div className="input-label">
					{label && <label className="form-label">{label}</label>}
					</div>
				}
				
				<div className="input-box">
					<input className="input-content" type='password' 
					{...reg(name, { required:{value:required, message:errorMessage.required}})} 
					placeholder={placeholder}/> 
				</div>
			</div>
			
			<div className="input-error">
				{error &&<p>{error.message}</p>}
			</div>
			
  	</div>

		</>
	)
}



  export const Hidden = ({ label, value, reg, target }) => {
    return(
    <>
      <input type='hidden'  {...reg(label, {value})} />
    </>
    )
  };
  


 export const Form4Table = ({children}) => {
	const { register,  formState: { errors }, handleSubmit, control } = useForm({mode: "onBlur"})

	let inputTagList = [];

	const a = children.map(child =>{
		let childType = child.type;
		if(childType && childType === "td"){ 
			return cloneElement(child);
		}

		inputTagList.push(child);

		return (
			<td role="cell" className="table-input-cell" >
				{cloneElement(child,{ reg:register })}
			</td>
		)
	})

	return(
	<>
		{a}
		<form >
		{inputTagList}
		</form>
	</>
		
			
		
	
	
)}

export const Input4Table=({update}) => {
	const inputRef = useRef();
	const [beforeValue, setValue] = useState();
	
	const onDoubleClickEvent = () => {
		inputRef.current.readOnly = false;
		let value = inputRef.current.value;
		setValue(value);
	}

	const onBlurEvent = () => {
		const isEditing = inputRef.current.readOnly;
		if(isEditing)return;
		inputRef.current.readOnly = true;

		let value = inputRef.current.value;
		if(value === beforeValue)return;
		
		update(value);
	}

	return(
		<>
			<input type="text" ref={inputRef} readOnly onDoubleClick={onDoubleClickEvent} onBlur={onBlurEvent} />
		</>
	)
}

const errorMessage = {
	max : "최대 글자수를 초과했습니다.",
	min : "글자수가 너무 작습니다.",
	value : "형식이 다릅니다",
	required: "입력값이 없습니다."
}









export const Text = ({ reg, initValue, errors, onChange, setValue,
		label, name, required, asset, pos, placeholder,
		en, kr, special, num ,min ,max }) => {
	
	const inputRef = useRef();

	
	useEffect(() => {
		// setTimeout(() => {
		// 	if(!inputRef.current.matches(':autofill'))return;
		// 	console.log("=== inputRef.current ===",inputRef.current);
		// 	let val = inputRef.current.value
			
		// 	if(val)setValue(name, val);
		//  }, 1000);
	},[])

	const error = (errors && errors[name] ) ? errors[name] : null;
	let defaultValue = initValue || null;

	let languagePattern = {};
	let patternStrin;
	let msg;

	let maxLength = null;
	let minLength = null;

	if(kr){
		patternStrin = /^[ㄱ-ㅎ가-힣]*$/;
		msg = kr;
		if(num){
			patternStrin = /^[ㄱ-ㅎ가-힣1-9]*$/;
			if(special){
				patternStrin = /^[ㄱ-ㅎ가-힣1-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]*$/;
			}
		}
		if(special){
			patternStrin = /^[ㄱ-ㅎ가-힣!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]*$/;
		}
	}

	if(en){
		patternStrin = /^[a-zA-Z]*$/;
		msg = en;

		if(num){
			patternStrin = /^[a-zA-Z1-9]*$/;
			if(special){
				patternStrin = /^[a-zA-Z1-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]*$/;
			}
		}
		if(special){
			patternStrin = /^[a-zA-Z!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]*$/;
		}
	}
	// 	patternArray.push("1-9");
	// 	patternArray.push("!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩");

	if( kr || en){
		let pattenReg =new RegExp(patternStrin);
		languagePattern = {
			value: pattenReg,
			message: errorMessage.value,
		};
	}


	if(max){
		maxLength = {
			value: max,
			message: errorMessage.max,
		}
	}

	if(min){
		minLength = {
			value: min,
			message: errorMessage.min,
		}
	}

	const handlerInputChange = (e) => {
		// console.log("e", e.target, e.target.value);
		if(onChange)onChange(name, e.target.value);
	}

	const {ref, ...rest} = reg(name, { required:{
		value:required, message: errorMessage.required}, value: defaultValue,
		pattern:languagePattern, maxLength: maxLength, minLength: minLength});
	
	return(
		<div className="input-container">
			<div className="input-main">
				<div className="input-label">
					{label && <label className="form-label">{label}</label>}
					{/* {required && <>*</>} */}
				</div>
				<div className="input-box">
					{(pos && pos === "front") && 
					<div className="input-icon"></div>}
					<input className="input-content" {...rest} 
						 placeholder={placeholder} 
						 onChange={handlerInputChange}
						 ref={(e) => {
							ref(e);
							inputRef.current = e;
						  }}
					/> 
					{/* {(pos && pos === "end") && <ConstructionOutlined/>} */}
				</div>
			</div>
			
			<div className="input-error">
				{error &&<p>{error.message}</p>}
			</div>
			
  	</div>
	)
};

export const Email = ({ label, name ,reg, initValue, required, errors }) => {
	const tagName = name || "email";
	const error = (errors && errors[name] ) ? errors[tagName] : null;
	let defaultValue = initValue || null;

	return(
		<div className="input-container">
			<div className="input-main">
				{label && <label className="input-label">{label}</label>}
				<div className="input-box">
						<input {...reg(name, { required, value: defaultValue, pattern: 
						{value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						, message: "invalid email address" } })} /> 
				</div>
			</div>
			{error &&<p>error</p>}
  	</div>
	)
};

export const Tel = ({label, name ,reg, initValue, required, errors}) => {
	const tagName = name || "tel";
	const error = (errors && errors[name] ) ? errors[tagName] : null;
	const defaultValue = initValue || "";

	return(
	<div className="input-container">
		<div className="input-main">
			{label && <label className="input-label">{label}</label>}
			<div className="input-box">
			<input {...reg(tagName, { required,value : defaultValue,  pattern: 
			{value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
			, message: "invalid phone number"} })} /> 
			</div>
		</div>
		{error &&<p>error</p>}
	</div>
	)
}

// 캘린더 css 테스트
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  max-width: 600px;
  margin: auto;
  background-color: #d4f7d4;
  padding: 10px;
  border-radius: 3px;
	button {
    margin: 3px;
    background-color: #6f876f;
    border: 0;
    border-radius: 3px;
    color: white;
    padding: 5px 0;

    &:hover {
      background-color: #556b55;
    }

    &:active {
      background-color: #a5c1a5;
    }
  }
	.react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%; 

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;


export const DateBox = ({ label, name ,reg, initValue , required, errors }) => {
	const [isOpen , setOpen] = useState(false);
	const [date, setDate] = useState('');
	
	const tagName = name || "date"
	const error = (errors && errors[tagName] ) ? errors[tagName] : null;

	let defaultValue = initValue || null;

	const {onBlur, ref } = reg(tagName,{required, value:defaultValue}); 

	let inputEvent;

	const openCalendar = (event) =>{
		setOpen(true);
	}

	const closeCalendar = () => {
		setOpen(false);
	}

	const setInputValue = (value, event) => {
		setOpen(false);
		setDate(value);
		event.target = inputEvent.target;
		inputEvent.target.value = value;
		onBlur(inputEvent);
	}

	return (
		<>
		<div className="input-container">
			<div className="input-main">
			{label && <label className="input-label">{label}</label>}
				<div className="input-box">
				<input type="text"  name={tagName} ref={ref}  value={date} onFocus={openCalendar} onBlur={(event)=>{ inputEvent = event;}} />
				</div>
				<div>
				{isOpen &&
				<>
				<div className="modal">
					{/* <CalendarContainer>
					<Calendar  onChange={setInputValue} />
					</CalendarContainer> */}
					<Calendar  onChange={setInputValue} />
				</div>
				<div className="dim" onClick={closeCalendar} />
				</>}
				</div>
			</div>
		
		{error &&<p>error</p>}
		</div>
		
		</>
	
	)				
}



const people = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
]

function MyListbox() {
  const [selectedPerson, setSelectedPerson] = useState(people[0])

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      <Listbox.Button>{selectedPerson.name}</Listbox.Button>
      <Listbox.Options>
        {people.map((person) => (
          <Listbox.Option
            key={person.id}
            value={person}
            disabled={person.unavailable}
          >
            {person.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}

export const Select = ({ children , name, label, reg, onChange }) => {
	const optionObject = children;
	const optionKeys = Object.keys(optionObject); 

	const optinonContent = optionKeys.map((key) => {
		return <option value={optionObject[key]}>{key}</option>
	})

	const handlerInputChange = (e) => {
		
		onChange(name, e.target.value);
	}

	return (
		<div className="input-container">
			<div className="input-main">

				{ label && <label className="input-label">{label}</label>}
				

					<select className="input-box"  {...reg(name)} onChange={handlerInputChange} >
						{optinonContent}
					</select>
				
			</div>
	</div>)
}

export const Checks = ({ children, label, reg }) => {
	const optionObject = children;
	const optionKeys = Object.keys(optionObject); 
	
	const optinonContent = optionKeys.map((key) => {
		const {ref,name, onChange } = reg(key);
		let labelText = optionObject[key];

		return (
			<div className="input-item">
				<label className="input-item-label">{labelText}</label>
				<input type="checkbox" ref={ref} name={name} onChange={onChange} />
			</div>
		)
	})
	
	return(
		<div className="input-container">
			{ label && <label>{label}</label>}
			<div className="input-row" >
				{optinonContent}
			</div>
		</div>
	)
}

export const Radio = ({ children, name, label, reg, control }) => {
	const optionObject = children;
	const optionKeys = Object.keys(optionObject); 
	const {ref, onChange } = reg(name);
	
	const optinonContent = optionKeys.map((key) => {
		return (
			<div className="input-item">
				<label className="input-item-label">{key}</label>
				<input type="radio" name={name} value={optionObject[key]} onChange={onChange} />
			</div>
		)
	})

	return (
		<div className="input-container">
			{label && <label>{label}</label>}
			<div className="input-row">
			{optinonContent}
			</div>
		</div>
	)
}

export const Search = ({ children, name, label, reg, control, icon }) => {
	const inputRef = useRef();
	const onSearch = () => {
		control(inputRef.current.value)
	}
	return (
		<>
		<div className="search-container">
			{reg && <input  {...reg(name)}/>}
			{!reg && <input className='search-input' ref={inputRef} />}
			<button type="submit" className="search-button" onClick={onSearch}>
				<img src={icon} alt="" />

			</button>
		</div>
		
		</>
	)
}




export const Submit = ({children}) => (
  <>
  {/* {children} */}
    <input type='submit' className="form-submit" value={children}/>
  </>
)

export const LinkButton = ({children, url} ) => {

	return(
		<>
			<Link to={url}>
				<button >
					{children}
				</button>
			</Link>
		</>
	)
}

