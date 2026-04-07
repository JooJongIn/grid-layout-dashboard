import React from 'react';
import {Svg4Color} from '../../../../component/svg-color';
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate';



export const MarkButton4TextFiled = ({ format, icon }) => {
	// const editor = useSlate()
	// const isActive= isMarkActive(editor, format);
	let isActive = false;

	const opacity = isActive ? 0.7 : 0.5;

	return (
		<div className={'setting-button '} >
		<button
			// className={isActive ? "activeBtn":""}
			onMouseDown={event => {
				event.preventDefault()
				// toggleMark(editor, format)
			}}
		>
			<Svg4Color icon={icon}  opacity={opacity}/>
		</button>
		</div>
	)
}

export const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor)
	return marks ? marks[format] === true : false
}

export const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}


const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


export const BlockButton4TextFiled = ({ format, icon }) => {
	// const editor = useSlate()
	// const isActive = isBlockActive(editor,format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')
	let isActive = false;

	const opacity = isActive ? 0.7 : 0.5;

	return (
		<div className={'setting-button '} >
		<button
		className={isActive ? "activeBtn":""}
			onMouseDown={event => {
				event.preventDefault()
				// toggleBlock(editor, format)
			}}
		>
			<Svg4Color icon={icon}  opacity={opacity} />
		</button>
		</div>
)
}

export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}


export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )

	
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

	let newProperties 
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}
