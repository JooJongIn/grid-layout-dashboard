import { useEffect, useState, useMemo, useCallback } from 'react'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { withHistory } from 'slate-history'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from 'slate'


const initialValue = [
    {
      type: 'paragraph',
      children: [
        { text: '.box{ \n' },
        { text: '\tbackground-color: red;\n' },
        { text: '\twidth: 90%;\n' },
        { text: '\theight: 300px;\n' },
        { text: '\tborder: 1px solid  black;\n' },
        { text: '\tmargin: 10px;\n' },
        { text: '}\n' },
    ],
    },
]


export const CssEditor = ({classObj, setStyle: setStyle4Class}) => { 
    const {className, style: classStyle, initStyle } = classObj;
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);
    const [style4Editor, setStyle4Editor] = useState(null);


    useEffect(() => {
      let newStyleStr = classStyle ? classStyle : initStyle;
      let styleLines = newStyleStr.split("\n");
      let newChild = [];

      styleLines.map(line => {
        newChild.push({text: line + "\n"});
      })

      const newEditObj = {
        type: 'paragraph',
        children: newChild
      }
      
      setStyle4Editor([newEditObj]);
    },[classStyle]);

    const onBlur = (e) => {
      const style = toString(editor.children);
      setStyle4Class(className, style);
    }

    const handlerCssInit = () => {
      setStyle4Editor(null);
      setStyle4Class(className, initStyle);
    }

  return(
    <>
    <div className='editor'>
      <div className='editor-head'>
        <div className='editor-title'>{className}</div>
        <div className='init-btn' onClick={handlerCssInit}>초기화</div>
      </div>
      
      <div className='editor-content'>
        {style4Editor &&  <Slate editor={editor} 
        value={style4Editor}
        >
          <Editable
          // onFocus={onFoucs}
          onBlur={onBlur}
          onKeyDown={event => {
            const keyCode = event.code;
            if("Tab" === keyCode)  event.preventDefault();
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          />
        </Slate>}
      </div>
    </div>
    </>
  )
}

const toString = (obj) => {
    let str = ``;
    if(Array.isArray(obj)){
        for (const child of obj) {
            str += toString(child);
        }
        
    }
    if(obj.children){
        const children = obj.children;

        for (const child of children) {
            console.log('child', child);
            str += child.text;
        }
    }

    return str;
}


const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
  
    if (leaf.code) {
      children = <code>{children}</code>
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>
    }
  
    if (leaf.underline) {
      children = <u>{children}</u>
    }
  
    return <span {...attributes}>{children}</span>
  }
  
  
  const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align }
      
    switch (element.type) {
      case 'block-quote':
        return (
          <blockquote style={style} {...attributes}>
            {children}
          </blockquote>
        )
      case 'bulleted-list':
        return (
          <ul style={style} {...attributes}>
            {children}
          </ul>
        )
      case 'heading-one':
        return (
          <h1 style={style} {...attributes}>
            {children}
          </h1>
        )
      case 'heading-two':
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        )
      case 'list-item':
        return (
          <li style={style} {...attributes}>
            {children}
          </li>
        )
      case 'numbered-list':
        return (
          <ol style={style} {...attributes}>
            {children}
          </ol>
        )
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        )
    }
  }