import {useState, useRef, useEffect} from 'react';

import plusImg from "../../assets/svg/icons2/zondicons_add-outline.svg";
import closeImg from "../../assets/svg/icons2/close_btn.svg";
import searchIcon from "../../assets/svg/icons2/search.svg";


const ApiListHead = ({ sortCol, handlerClickSort, handlerOpenAddForm, handlerSearch, categoryList, selectedCategory, setSelectedCategory }) => {
    return (
        <div className='api-list-head'>
            <div className='api-list-head-left'>
                <div className='sort-btns'>
                    <div className={'sort-btn' + ("name" === sortCol ? " selected" : "" )} onClick={()=>handlerClickSort("name")}> 이름순 </div>    
                    <div className='divider'/>
                    <div className={'sort-btn' + ("time" === sortCol ? " selected" : "" )} onClick={()=>handlerClickSort("time")}> 등록순 </div>
                    <div className='divider'/>
                    <div className={'sort-btn' + ("category" === sortCol ? " selected" : "" )} onClick={()=>handlerClickSort("category")}> 카테고리순 </div>
                </div>
                <div className='divider-lg' />
                <ApiSearch onSearch={handlerSearch} />
                <CategorySelect categoryList={categoryList} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </div>
            <div className='add-btn' onClick={handlerOpenAddForm}>
                <img src={plusImg} alt="" srcset="" />
                <div>API 추가</div>
            </div>
        </div>
    );
}


const ApiSearch = ({onSearch}) => {
    const [searchText, setSearch] = useState("");

    const searchRef = useRef(null);

    useEffect(() => {
        if(searchText === "")return onSearch(null);
        onSearch(searchText);
    },[searchText])

    const handlerSearch = (e) => {
        setSearch(e.target.value);
    } 

    const handlerSearchBtn = () => {
        searchRef.current.focus();
    }

    const handlerCloseSearch = () => {
        setSearch("");
    }

    return (<div className='api-search search-area'>
        {/* <div className='search-label'>검색</div> */}
        <div className='search-box'>
            <img className='search-btn' src={searchIcon} alt="" onClick={handlerSearchBtn} />
            <input type="text" placeholder='검색어를 입력하세요' onChange={handlerSearch} value={searchText} ref={searchRef} />
            <img className='close-btn' src={closeImg} alt="" onClick={handlerCloseSearch} />
        </div>
    </div>)
}


const CategorySelect = ({categoryList, selectedCategory, setSelectedCategory}) => {
    const [category, setCategory] = useState("");

    const handlerCategoryChange = (e) => {
        const val = e.target.value;
        if(val === "")setSelectedCategory(false);
        else setSelectedCategory(val);

        setCategory(val);
    }

    return (
        <div className='category-select search-area'>
            <div className='search-box'>
                <select  name="" onChange={handlerCategoryChange} value={category}>
                    <option value="">전체</option>
                    
                    {categoryList.map((category, index) => (
                        <option value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}


export default ApiListHead; 