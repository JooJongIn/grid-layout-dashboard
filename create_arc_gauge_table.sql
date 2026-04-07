CREATE TABLE ArcGaugeTable (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    top INTEGER NOT NULL,
    bottom INTEGER NOT NULL
);

-- 샘플 데이터 삽입 (Math.random() * (100 - 5) + 5 범위의 예시값 사용)
INSERT INTO ArcGaugeTable (label, top, bottom) 
VALUES ('적합도', 75, 100); 