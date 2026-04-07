-- Line 차트 테이블
CREATE TABLE LineTable (
    label VARCHAR(100),
    cirtical INTEGER,
    high INTEGER,
    medium INTEGER,
    low INTEGER,
    etc INTEGER,
    solved INTEGER
);

-- Bar 차트 테이블
CREATE TABLE BarTable (
    label VARCHAR(100),
    cirtical INTEGER,
    high INTEGER,
    medium INTEGER,
    low INTEGER
);

-- Pie 차트 테이블
CREATE TABLE PieTable (
    label VARCHAR(100),
    미처리 INTEGER,
    부분적합 INTEGER,
    부적합 INTEGER,
    적합 INTEGER,
    Na INTEGER
);

-- Radar 차트 테이블
CREATE TABLE RadarTable (
    label VARCHAR(100),
    jun INTEGER,
    jul INTEGER,
    aug INTEGER,
    sep INTEGER,
    oct INTEGER
);

-- List 테이블
CREATE TABLE ListTable (
    No INTEGER,
    지역 VARCHAR(100),
    접속자수 INTEGER,
    IP VARCHAR(50)
);

-- Gauge 테이블
CREATE TABLE GaugeTable (
    data INTEGER
);

-- DivideGauge 테이블
CREATE TABLE DivideGaugeTable (
    top INTEGER,
    bottom INTEGER
);

-- Status 테이블
CREATE TABLE StatusTable (
    label VARCHAR(100),
    data INTEGER
);

-- ArcGauge 테이블
CREATE TABLE ArcGaugeTable (
    label VARCHAR(100),
    top INTEGER,
    bottom INTEGER
);

-- 샘플 데이터 삽입
INSERT INTO LineTable (label, cirtical, high, medium, low, etc, solved) VALUES
('2024-06-06', 95, 75, 55, 25, 50, 50),
('2024-06-07', 105, 85, 45, 15, 45, 60),
('2024-06-08', 110, 80, 60, 30, 55, 45),
('2024-06-09', 100, 72, 50, 20, 40, 55),
('2024-06-10', 98, 78, 52, 28, 48, 52),
('2024-06-11', 92, 82, 58, 22, 52, 48),
('2024-06-12', 108, 76, 48, 18, 58, 42),
('2024-06-13', 96, 74, 56, 32, 44, 58),
('2024-06-14', 102, 88, 42, 12, 62, 38),
('2024-06-15', 94, 70, 54, 24, 46, 54);

INSERT INTO BarTable (label, cirtical, high, medium, low) VALUES
('2024-06-06', 95, 75, 55, 25),
('2024-06-07', 105, 85, 45, 15),
('2024-06-08', 110, 80, 60, 30),
('2024-06-09', 100, 72, 50, 20),
('2024-06-10', 98, 78, 52, 28),
('2024-06-11', 92, 82, 58, 22),
('2024-06-12', 108, 76, 48, 18),
('2024-06-13', 96, 74, 56, 32),
('2024-06-14', 102, 88, 42, 12),
('2024-06-15', 94, 70, 54, 24);

INSERT INTO ListTable (No, 지역, 접속자수, IP) VALUES
(1, 'Zhuxi', 6169, '159.225.11.108'),
(2, 'Omaruru', 9422, '0.3.92.28'),
(3, 'Spring', 2585, '57.222.106.76'),
(4, 'Pridraga', 9340, '18.195.19.221'),
(5, 'Cachoeiras', 6887, '188.228.221.83'),
(6, 'Normanton', 5722, '252.35.180.245'),
(7, 'Votuporanga', 5293, '47.213.145.136'),
(8, 'Tetebatu', 8427, '65.21.160.80'),
(9, 'Sabang', 4306, '188.42.143.127'),
(10, 'San Francisco', 5303, '195.212.37.201');

INSERT INTO GaugeTable (data)
VALUES (155);

INSERT INTO DivideGaugeTable (top, bottom)
VALUES (75, 125);

INSERT INTO StatusTable (label, data)
VALUES ('정상', 1); 

INSERT INTO PieTable (label, 미처리, 부분적합, 부적합, 적합, Na)
VALUES ('A', 6, 6, 6, 6, 6);

INSERT INTO RadarTable (label, jun, jul, aug, sep, oct) VALUES
('디렉토리접근', 91, 99, 9, 27, 53),
('관리자페이지접근', 91, 98, 78, 77, 76),
('인젝션', 14, 79, 87, 42, 94),
('취약한 인증/세션', 21, 77, 15, 77, 56),
('XSS', 44, 24, 14, 32, 53);

CREATE TABLE ArcGaugeTable (
    label VARCHAR(100),
    top INTEGER,
    bottom INTEGER
);

INSERT INTO ArcGaugeTable (label, top, bottom) 
VALUES ('적합도', 75, 100);