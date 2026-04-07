import { useEffect, useState } from 'react'

export class HistoryManager {
    constructor() {
        this.historys = [];
        this.index = false;
    }

    addHistroy(cards) {
        let newHistory = [...this.historys];
        console.log("history is new ", this.index, newHistory.length, newHistory);

        if (this.index === false) {
            this.index = 0;
            this.historys = [cards];
        } else {
            newHistory = newHistory.slice(0, this.index + 1); // 현재 인덱스 이후의 히스토리 삭제
            newHistory.push(cards);
            if (newHistory.length > 20) newHistory.shift(); // 최대 20개 유지
            this.historys = newHistory;
            this.index = newHistory.length - 1; // 새로 추가된 카드의 인덱스
        }
    }

    undo() {
        const newIdx = this.index - 1;
        console.log("history undo", this.index, newIdx, this.historys);
        if (newIdx < 0) return null; // 유효성 체크
        this.index = newIdx;
        return this.historys[newIdx];
    }

    redo() {
        const newIdx = this.index + 1;
        console.log("history redo", this.historys, this.index);
        if (newIdx >= this.historys.length) return null; // 수정된 부분
        this.index = newIdx;
        return this.historys[newIdx];
    }

    getHistory() {
        if (this.index < 0 || this.index >= this.historys.length) return null; // 유효성 체크
        return this.historys[this.index];
    }

    emptyHistory() {
        console.log("history empty ==== ", this.historys);
        this.historys = [];
        this.index = false; // 초기화 시 false로 설정
    }
}





