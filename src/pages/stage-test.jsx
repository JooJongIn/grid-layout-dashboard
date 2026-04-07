import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function DragFromOutsideLayout ()  {
	const [gridLayout, setGridLayout] = useState();
	const [mounted, setMounted] = useState();

  useEffect(() => {
  },[]);

  const onBreakpointChange = (breakpoint) => {
    
  };

  const onLayoutChange = (layout, layouts) => {
		console.log(layout, layouts);
    // this.props.onLayoutChange(layout, layouts);
  };

  const onDrop = (layout, layoutItem, _event) => {
    alert(`Dropped element props:\n${JSON.stringify(layoutItem, ['x', 'y', 'w', 'h'], 2)}`);
  };

  
    return (
      <div>
        
        <div
          className="droppable-element"
          draggable={true}
          unselectable="on"
          // this is a hack for firefox
          // Firefox requires some kind of initialization
          // which we can do by adding this attribute
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
          onDragStart={e => e.dataTransfer.setData("text/plain", "")}
        >
          Droppable Element (Drag me!)
        </div>
        <ResponsiveReactGridLayout
					className= "layout"
					rowHeight= {30}
					cols= {{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
					currentBreakpoint= "lg"
    			compactType= "vertical"
          layouts={gridLayout}
          onBreakpointChange={onBreakpointChange}
          onLayoutChange={onLayoutChange}
          onDrop={onDrop}
          // WidthProvider option
          measureBeforeMount={false}
					
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={mounted}
          preventCollision={ "vertical"}
          isDroppable={true}
        >
          
        </ResponsiveReactGridLayout>
      </div>
    );
  
}

