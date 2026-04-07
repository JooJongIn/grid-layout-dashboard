import React from 'react';
import styled from 'styled-components'

import { Route, Routes, Link } from 'react-router-dom';
import { _sub_menu_ } from './../styles/menu';
import { _body_ } from './../styles/layout';

export const _spacer_ = styled.span`
   background-color: #b94545;
	width: 4rem;
`

export const _menu = styled.div`
   background-color: #b94545;
	width: 4rem;
`


const A = ()=>(<div>A</div>)
const B = ()=>(<div>B</div>)
const C = ()=>(<div>C</div>)

export const MdxTest = () => {
   return (
      <>

<_sub_menu_>
<Link to="/mdx-test/a">a</Link>
      <Link to="/mdx-test/b">b</Link>
      <Link to="/mdx-test/c">c</Link>
      </_sub_menu_>

      <Routes>
         <Route index element={<C/>} />
         <Route path='/a' element={<A/>} />
         <Route path='/b' element={<B/>} />
         <Route path='/c' element={<C/>} />
      </Routes>
      
      </>
   );
}

