import { lazy, useState, useEffect } from 'react';
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { Card } from "./component_card";

;
const Stage4Editor = ({ component, setComponent }) => {
    const [layout, setLayout] = useState( [] );

    useEffect(() => {
        setLayout([ {i: 'a', x: 0, y: 0, w: 12, h: 12},]);
    }, []);


    return (
        <div>
            <Stage layout={layout} component={component} setLayout={setLayout} setComponent={setComponent} />
        </div>
    );
};

const Stage = ({layout, component, setLayout, setComponent	}) => {

    return (
        <>
        <GridLayout 
		className= "layout"
		layout={layout}
    	rowHeight= {20}
		cols= {60}

		width={1200}
    	mounted = {false} 
		
		// 리사이즈 손잡이
		resizeHandles= {["se"]}
		// resizeHandles= {["s", "w", "e", "n", "sw", "nw", "se", "ne"]}

		// 카드간이 간격
		margin ={ [0, 0]}

		// measureBeforeMount={true}
		useCSSTransforms={true}

		// 가로 세로
		compactType={null}
		// 겹치기 가능 (이게 자동정렬 막아줌)
		allowOverlap = {true}
		// drag 시에 다른 카드 위치 변동 막는걱
		preventCollision={false}

		// verticalCompact={false}
		// preventCollision={true}

		// draw apppend option

		onResizeStop={(layout) => {
			setLayout(layout);
		}}
		isDroppable={false}
		isDraggable={true}
		isResizable={true}
		
		// 경계를 넘지 않음
		isBounded={false}

		draggableCancel ={".drag-cancel"}
		draggableHandle={".draggable"}

		>
            {layout.map((item, index) => (
                <div key={item.i + index}  data-grid={item}>
                    <Card layout={item} component={component} setComponent={setComponent} />
                </div>
            ))}


		</GridLayout>
        </>
    );
}




export default Stage4Editor; 