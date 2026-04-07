import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw } from 'draft-js'
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
// import '@draft-js-plugins/static-toolbar/lib/plugin.css';
// import 'draft-js/dist/Draft.css';



import { shared } from '../state';
import { stageCol, cellHeight } from '../ref/stage-setting';

const staticToolbarPlugin = createToolbarPlugin();

export function TextArea({card, setCardOption, isSelected}) {
  const [editorState, setEditorState] = shared(`${card.cardId}-editorState`, EditorState.createEmpty())
  const editorRef = useRef();
  // TODO: 포커스 필요?

  // useEffect(() => {
  // },[editorState])

  useEffect(() => {
    const text = card?.value || false;
    
    if(text){
      let row = JSON.parse(text);
      const content = convertFromRaw(row);
      setEditorState(EditorState.createWithContent(content))
    }else{
      setEditorState(EditorState.createWithText("내용을 입력해 주세요."))
    }
  },[])

  const onChange = useCallback((state) => {
    setEditorState(state)
  }, [])

  const handleKeyCommand = useCallback((command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }, [onChange])


  const handleBlur = (e) => {
    const cardLoca = card.cardLocation;
    const newHei = editorRef.current.scrollHeight;
    let newHeiCell = Math.floor(newHei / cellHeight + 4);
    const cardHei = cardLoca.h;
    const newLayout = {...cardLoca, h : cardHei > newHeiCell ? cardHei : newHeiCell}

    const rows = convertToRaw(editorState.getCurrentContent());
    const text = JSON.stringify(rows);
    setCardOption({cardLocation: newLayout, value: text})
  }

  
  
  const blockStyleFn = (block) => {
    let alignment = 'left';
    block.findStyleRanges((e) => {
      if (e.hasStyle('center')) {alignment = 'center';}
      if (e.hasStyle('right')) {alignment = 'right';}
    });
    return `editor-alignment-${alignment}`;
  };



  const handleBoldToggle = useCallback(() => {
    const newState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    setEditorState(newState);
  }, [editorState]);


  return (
    <_editor_>
      {/* <button onMouseDown={(event) => {event.preventDefault(); handleBoldToggle()}}>Bold</button> */}
    <div className={isSelected ? "drag-cancel editor-container" : "editor-container" } ref={editorRef} >

    <Editor
      readOnly={!isSelected}
      className={isSelected ? "drag-cancel" : ""}
      editorState={editorState}
      onChange={onChange}
      onBlur={handleBlur}
      handleKeyCommand={handleKeyCommand}
      customStyleMap={customStyleMap}
      blockStyleFn={blockStyleFn}
      plugins={[staticToolbarPlugin]}
      />
    </div>
    </_editor_>
  )
}


  const _editor_ = styled.div`

  .editor-alignment-left {
    text-align: left;
  }

  .editor-alignment-center {
    text-align: center;
  }

  .editor-alignment-right {
    text-align: right;
  }
  `
const customStyleMap = {
  'color-yellow': { color: '#ffba00' },
  'color-blue': { color: '#2127b1' },
  'color-hotpink': { color: '#ff00ae' },
  'color-orange': { color: '#f77400' },
  'color-green': { color: '#26912b' },
  'color-purple': { color: '#9e00e7' },
}

// export default function EditorMenu({ 
//   fontSize, 
//   onFontSizeChange, 
//   onBoldClick, 
//   onItalicClick, 
//   onColorSelect,
//   onAlignClick 
// }) {
//   const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32]

//   return (
//     <div className="flex items-center space-x-4 mb-4 drag-cancel">
      
//       <Button variant="outline" size="icon" onClick={onBoldClick}>
//         <img src={boldIcon} alt="bold" className="h-4 w-4" />
//       </Button>
//       <Button variant="outline" size="icon" onClick={onItalicClick}>
//         <img src={italicIcon} alt="italic" className="h-4 w-4" />
//       </Button>
//       {/* <ColorPalette onColorSelect={onColorSelect} /> */}
//       <Button variant="outline" size="icon" onClick={() => onAlignClick('left')}>
//         <img src={leftAlignIcon} alt="left" className="h-4 w-4" />
//       </Button>
//       <Button variant="outline" size="icon" onClick={() => onAlignClick('center')}>
//         <img src={centerAlignIcon} alt="center" className="h-4 w-4" />
//       </Button>
//       <Button variant="outline" size="icon" onClick={() => onAlignClick('right')}>
//         <img src={rightAlignTextIcon} alt="right" className="h-4 w-4" />
//       </Button>
//       <Button variant="outline" size="icon" onClick={() => onAlignClick('justify')}>
//         <img src={centerAlignIcon} alt="justify" className="h-4 w-4" />
//       </Button>
//     </div>
//   )
// }

// const Button = ({ children, onClick }) => {
//   return <button onClick={onClick}>{children}</button>
// }


// function TextArea({card, setCardOption}) {
//   const [editorState, setEditorState] = React.useState(
//     () => EditorState.createEmpty(),
//   );
  
//   useEffect(() => {
//     console.log("tf== card", card);
//     const options = card?.options || {};
// 		const textRow = options?.textRow;
//     if(textRow){
//       let row = JSON.parse(textRow);
//       const content = convertFromRaw(row);
//       setEditorState(EditorState.createWithContent(content))
//     }else{
//       setEditorState(EditorState.createWithText("test..."))
//     }
    
//   },[card])

//   const handlerFocus = (e) => {
//     console.log("tf== handlerFocus", e, e.target);
//   }

//   const handlerBlur = (e) => {
//     const json =  editorState.getCurrentContent().getBlocksAsArray();
//     const rows = convertToRaw(editorState.getCurrentContent());
//     // console.log("tf== handlerBlur", editorState.getCurrentContent().getEntity());
//     console.log("tf== handlerBlur", editorState.getCurrentContent().getBlocksAsArray());
//     console.log("tf== handlerBlur", editorState.getCurrentContent().getBlockMap());
//     console.log("tf== handlerBlur", editorState.getCurrentContent().getEntityMap());
//     // console.log("tf== handlerBlur", JSON.stringify(json));
//     console.log("tf== handlerBlur", rows);
//     console.log("tf== handlerBlur", JSON.stringify(rows));

//     const options = card?.options || {};
//     setCardOption({options: {...options, textRow: JSON.stringify(rows)}});
//     // setCardOption({isFixed: false, options: {...options, paragraph: texts}});
//     // console.log("tf== handlerBlur", editorState.getCurrentContent().getPlainText('\u0001') );
//   }

//   return( 
//     <div className='container'>
//     <Editor editorState={editorState} onChange={setEditorState} onFocus={handlerFocus} onBlur={handlerBlur}/>
//     </div>
//   )
// }