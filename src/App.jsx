import React, {useState, useEffect} from 'react';
import {ChakraProvider, position} from '@chakra-ui/react'

import { Dashboard } from './pages/dashboard';
import { LoginPage } from './pages/login-page';

import { _basic_menu_ } from './styles/menu';
import { _body_ } from './styles/layout';
// import Hello from'./manual/Hello.mdx'

import {useMainSetting } from "./hook/useMainSetting"

import {MainProvider} from './provider/MainProvider';

import {ApiSettingPopup} from './pages/api-setting/api-setting';
import {ComponentEditor} from './pages/component-editor/component-editor';
// import './App.css';

export const ThemeContext = React.createContext();

function App() {
	const {userInfo, login, getTokenToLocalStorage} = useMainSetting();
	const [isLoading, setLoading] = useState( true );
	const [isOtherPage , setApiPopupOpend  ] = useState(false);

	useEffect(() => {
		initGetToken();
	},[])

    useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const token = searchParams.get('token');
		if(!token) return setLoading(false);
		const tokenInfo = parseJwt(token);
		login({...tokenInfo.user});
		setLoading(false);
	},[]);

	useEffect(() => {
		const hash = window.location.hash;
		if((hash && hash.includes("#api")))return setApiPopupOpend("api");
		if((hash && hash.includes("#editor")))return setApiPopupOpend("editor");
	},[])

	

    function parseJwt(token) {
		var base64Payload = token.split('.')[1];
		var payload = Buffer.from(base64Payload, 'base64');
		return JSON.parse(payload.toString());
	}
	
	const initGetToken = async () => {
		await getTokenToLocalStorage();
		setLoading(false);
	}

  	return (
    <>	{!isLoading && <>
			{(!userInfo) && <LoginPage />}
			{(userInfo ) &&  
			<>
			<MainProvider>
				<ChakraProvider>				
				{isOtherPage === "api" && <ApiSettingPage />}
				{isOtherPage === "editor" && <ApiEditorPage />}
				{isOtherPage === false && <Dashboard/>}
				</ChakraProvider>
			</MainProvider>
			</>
			}
			
		</>}
    </>)
}

const ApiSettingPage = ({}) => {
	const [initApi, setInitApi] = useState( false );	

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const domainId = searchParams.get('domain_id');
		const apiId = searchParams.get('api_id');
		if(!(domainId && apiId))return setInitApi(false);

		setInitApi({domainId, apiId});
	},[])

	return(<ApiSettingPopup initApi={initApi} />)
}

const ApiEditorPage = ({}) => {

	useEffect(() => {},[])

	return(<ComponentEditor />)
}


export default App
