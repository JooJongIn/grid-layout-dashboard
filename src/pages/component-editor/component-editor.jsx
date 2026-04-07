import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Stage4Editor from './Stage4Editor';
import ComponentSelect from './ComponentSelect';
import DataView from './DataView';
import { ComponentDevtool } from './component-devtool';

import "./component-editor.scss";



export function ComponentEditor({ }) {
    const [currentComponent, setCurrentComponent] = useState({id: "text", name: "text", data: "test"});

	return (
		<div className='component_editor'>
			<div className="left_container">
				<Stage4Editor component={currentComponent} setComponent={setCurrentComponent}/>
			</div>
			<div className="right_container">
				<div className="right_top_container">
					<ComponentSelect setCompo={setCurrentComponent}/>
					<ComponentDevtool/>
				</div>
				<div className="right_bottom_container">
					<DataView/>
				</div>
			</div>
		</div>
	);
}
