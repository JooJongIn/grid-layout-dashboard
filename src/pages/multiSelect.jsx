import { useEffect, useState } from 'react'

export class MultiSelectManager {
    constructor() {
        this.aInternal = [];
        this.aListener = ()=>{};
        this.opts = {};
        this.leftOffset = [];
        this.topOffset = [];
    }

    setGroup(val) {
        this.aInternal = val;
        this.aListener(val);
    }

    getGroup() {
      return this.aInternal;
    }

    
    registerListener = (listener) => {
        this.aListener = listener;
    }

}





