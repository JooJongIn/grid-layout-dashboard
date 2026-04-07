import React from 'react';

import { List } from '../component/list'
import { PieChart } from '../component/chart/pie-chart';
import { RadarChart } from '../component/chart';
import { LineChart } from '../component/chart/LineChart';
import { BarChart } from '../component/chart/BarChart';



import { LineChart as LineChart2 } from '../component/echart';
import {Table} from '../component/table'
import {H1Title, H2Title, H3Title} from '../component/title';
import { Gauge, DivideGauge } from '../component/gauge';
import { StatusGauge, ArcGauge } from '../component/gauge-chart';
import { TextArea } from '../component/textarea';
import { MapComponent } from '../component/map';
import { ImageComponent } from '../component/image'
import { Space } from '../component/space'
import { HtmlRenderer } from '../component/html-renderer';

const TextFieldSize = {w:42,h:28};
const BarSize = {w:42,h:28};
const PieSize = {w:24,h:24};
const RadarSize = {w:38,h:38};
const LineSize = {w:42,h:28};
const TableSize = {w:50,h:30};
const ListSize = {w:42,h:28};
const H1Size = {w:37,h:9};
const H2Size = {w:30,h:7};
const H3Size = {w:19,h:5};
const GaugeSize = {w:26,h:22};
const DivideGaugeSize = {w:26,h:22};
const StatusSize = {w:26,h:28};
const ArcGaugeSize = {w:26,h:28};
const ProgressSize = {w:46,h:68};
const MapSize = {w:76,h:52};
const ImageSize = {w:52,h:42};
const HtmlSize = {w:42,h:28};


const TextFieldPadding = {top:0, left:0, right:0, bottom:0};
const BarPadding = {top:0, left:0, right:0, bottom:0};
const PiePadding = {top:0, left:0, right:0, bottom:0};
const RadarPadding = {top:0, left:0, right:0, bottom:0};
const LinePadding = {top:0, left:0, right:0, bottom:0};
const TablePadding = {top:0, left:0, right:0, bottom:0};
const ListPadding = {top:0, left:0, right:0, bottom:0};
const H1Padding = {top:0, left:0, right:0, bottom:0};
const H2Padding = {top:0, left:0, right:0, bottom:0};
const H3Padding = {top:0, left:0, right:0, bottom:0};
const GaugePadding = {top:0, left:0, right:0, bottom:0};
const DivideGaugePadding = {top:0, left:0, right:0, bottom:0};
const StatusPadding = {top:0, left:0, right:0, bottom:0};
const ArcGaugePadding = {top:0, left:0, right:0, bottom:0};
const ProgressPadding = {top:0, left:0, right:0, bottom:0};
const MapPadding = {top:10, left:10, right:10, bottom:10};
const ImagePadding = {top:0, left:0, right:0, bottom:0};
const HtmlPadding = {top:10, left:10, right:10, bottom:10};

[
    {
        "w": 37,
        "h": 9,
        "x": 0,
        "y": 1,
        "i": "H11",
        "moved": true,
        "static": false
    },
    {
        "w": 30,
        "h": 14,
        "x": 0,
        "y": 11,
        "i": "H21",
        "moved": true,
        "static": false
    },
    {
        "w": 19,
        "h": 5,
        "x": 0,
        "y": 26,
        "i": "H31",
        "moved": true,
        "static": false
    }
]



export const cardDefaultOptions = {
	
	TextField: {size:TextFieldSize, isHeader: false, padding: TextFieldPadding},
	Bar : {size:BarSize, isHeader: true, padding: BarPadding},
	Pie : {size:PieSize, isHeader: false, padding: PiePadding},
	Radar : {size:RadarSize, isHeader: true, padding: RadarPadding},
	Line : {size:LineSize, isHeader: true, padding: LinePadding},
	Table : {size:TableSize, isHeader: true, padding: TablePadding},
	List: {size:ListSize, isHeader: true, padding: ListPadding},
	H1: {size:H1Size, isHeader: false, padding: H1Padding},
	H2: {size:H2Size, isHeader: false, padding: H2Padding},
	H3: {size:H3Size, isHeader: false, padding: H3Padding},
	Gauge: {size:GaugeSize, isHeader: true, padding: GaugePadding},
	DivideGauge: {size:DivideGaugeSize, isHeader: true, padding: DivideGaugePadding},
	Status: {size:StatusSize, isHeader: true, padding: StatusPadding},
	ArcGauge: {size:ArcGaugeSize, isHeader: true, padding: ArcGaugePadding},
	Progress: {size:ProgressSize, isHeader: true, padding: ProgressPadding},
	Map: {size:MapSize, isHeader: false, padding: MapPadding},
	Image: {size:ImageSize, isHeader: true, padding: ImagePadding},
	Space: {size:ImageSize, isHeader: false, padding: ImagePadding},
	Html: {size:HtmlSize, isHeader: true, padding: HtmlPadding},

}	

export const contentRefTable = {
	TextField:<TextArea />,
	Line : <LineChart />,
	Bar : <BarChart />,
	Pie : <PieChart />,
	Radar : <RadarChart />,
	List: <List />,
	H1: <H1Title />,
	H2: <H2Title />,
	H3: <H3Title />,
	Gauge: <Gauge/>,
	DivideGauge: <DivideGauge/>,
	ArcGauge: <ArcGauge/>,
	Status: <StatusGauge/>,
	Map: <MapComponent />,
	Image: <ImageComponent />,
	Space: <Space />,
	Html: <HtmlRenderer />,
}


export const contentRefTablePadding = component_padding_options;




// export const TypeTexts = ["TextField","Bar","Pie","Radar","Line","Table","List","H1","H2","H3","Gauge","DivideGauge","Status","ArcGauge","Progress","Map","Image"];

const list_rowStyle = `
    width: 100%;
    padding: 2px;
`



const list_cellStyle = `
    

    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

`

export const compoClasses = {
	List: {
		styles : {
			"list-row" : list_rowStyle,
			"list-cell" : list_cellStyle,
		},

		classes: ["list-row","list-cell"]
	}
	
}