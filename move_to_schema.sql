-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS sample_table;

-- 테이블들을 새로운 스키마로 이동
ALTER TABLE LineTable SET SCHEMA sample_table;
ALTER TABLE BarTable SET SCHEMA sample_table;
ALTER TABLE PieTable SET SCHEMA sample_table;
ALTER TABLE RadarTable SET SCHEMA sample_table;
ALTER TABLE ListTable SET SCHEMA sample_table;
ALTER TABLE GaugeTable SET SCHEMA sample_table;
ALTER TABLE DivideGaugeTable SET SCHEMA sample_table;
ALTER TABLE StatusTable SET SCHEMA sample_table;
ALTER TABLE ArcGaugeTable SET SCHEMA sample_table;


-- 기본 테이블 이름 변경 구문
ALTER TABLE 스키마명.현재테이블명 RENAME TO 새테이블명;

-- 예시: cinamon 스키마의 테이블들 이름 변경
-- 예시: cinamon 스키마의 테이블들 이름 변경
ALTER TABLE sample_table.LineTable RENAME TO sample_line_table;
ALTER TABLE sample_table.BarTable RENAME TO sample_bar_table;
ALTER TABLE sample_table.PieTable RENAME TO sample_pie_table;
ALTER TABLE sample_table.RadarTable RENAME TO sample_radar_table;
ALTER TABLE sample_table.ListTable RENAME TO sample_list_table;
ALTER TABLE sample_table.GaugeTable RENAME TO sample_gauge_table;
ALTER TABLE sample_table.DivideGaugeTable RENAME TO sample_divide_gauge_table;
ALTER TABLE sample_table.StatusTable RENAME TO sample_status_table;
ALTER TABLE sample_table.ArcGaugeTable RENAME TO sample_arc_gauge_table;

-- cinamon 스키마로 테이블 이동
ALTER TABLE sample_table.sample_line_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_bar_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_pie_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_radar_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_list_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_gauge_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_divide_gauge_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_status_table SET SCHEMA cinamon;
ALTER TABLE sample_table.sample_arc_gauge_table SET SCHEMA cinamon;


-- 테이블 참조를 위한 쿼리 수정 예시 (필요한 경우)
-- 기존: SELECT * FROM LineTable
-- 변경: SELECT * FROM sample_table.LineTable

-- 권한 설정 (필요한 경우)
GRANT USAGE ON SCHEMA sample_table TO cinamon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA sample_table TO cinamon;

-- 추가 권한 설정
-- 1. 스키마에 대한 모든 권한
GRANT ALL ON SCHEMA sample_table TO cinamon;

-- 2. 시퀀스 권한 설정 (SERIAL 타입을 사용하는 경우)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA sample_table TO cinamon;

-- 3. 향후 생성될 테이블에 대한 권한 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA sample_table
GRANT ALL ON TABLES TO cinamon;

-- 4. 모든 테이블에 대한 개별 권한 명시적 부여
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA sample_table TO cinamon;

-- 5. 스키마 검색 경로 설정 (선택사항)
ALTER USER cinamon SET search_path TO sample_table, public;


SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'sample_table';