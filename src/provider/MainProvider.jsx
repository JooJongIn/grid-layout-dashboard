import React, { createContext, useEffect, useContext, useState } from 'react';
import {useMainSetting} from '../hook/useMainSetting'
import { getShared } from '../store';
import { themeOptions } from '../ref/color';

export const MainContext = createContext();

export function MainProvider({children, isPrint}) {
	const {isDarkMode, pageTheme, userInfo} = useMainSetting();
	const [theme, setTheme] = useState(isDarkMode ? "dark" : "light");
	const [mode, setMode] = useState(isPrint ? "print" : "dash");

	useEffect(() => {
		let newTheme = isDarkMode ? "dark" : "light";
		newTheme = pageTheme ? pageTheme : newTheme;
		newTheme = isPrint ? "light" : newTheme;
		setTheme(newTheme);
	},[isDarkMode]);

	const themeStyle = themeOptions[theme] || themeOptions["default"];

	return (
		<MainContext.Provider value={{themeStyle:themeStyle, theme:theme, mode:mode}}>
			{children}
		</MainContext.Provider>
	);
}

export const useThemeMode = () => {
	const context = useContext(MainContext)
	if (context === undefined) throw new Error('useThemeMode must be used within a ThemeModeProvider')

	return context;
}
  










