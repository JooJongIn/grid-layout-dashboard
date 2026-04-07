import React from 'react';
import { ApiFormArea } from './api-setting-from';
import { AddApiForm } from './api-setting-from';
import { DataPreview } from './data-preview';

export function ApiPreview({ targetApi, isAddformOpen, handlerCloseApiForm, handlerApiUpdate, handlerCloseAddForm, handlerApiInsert, targetDomain, categoryList, refreshCategory, refreshApis }) {
    return (
        <>
            <div className='form-area'>
                {targetApi && <ApiFormArea item={targetApi} categoryList={categoryList} close={handlerCloseApiForm} onUpdate={handlerApiUpdate} refreshCategory={refreshCategory} refreshApis={refreshApis} />}
                {isAddformOpen && <AddApiForm domain={targetDomain} close={handlerCloseAddForm} onInsert={handlerApiInsert} refreshApis={refreshApis} />}
            </div>
            
            {targetApi && <DataPreview domain={targetDomain} api={targetApi} />}
        </>
    );
}