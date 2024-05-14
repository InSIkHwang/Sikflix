# Sikflix

- Movie & Tv Shows
  - React-Query 를 사용하여 themoviedb API 패치
  - 카테고리 별 슬라이드 구현
  - 인기 콘텐츠 슬라이드 구현
  - 상세 내용 모달 구현

- Search
  - React-Hook-Form 을 사용한 검색 기능 구현
  - 헤더 내의 서치바 구현

---

[Sikflix ➡](https://insikhwang.github.io/Sikflix)

### 🚀 개발환경

- 언어 : ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- 프론트 : ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- 배포 : ![Github Pages](https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white)
- 라이브러리 : ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

---

### 📁 폴더 구조

-📂[src]  
  └── [assets] - 로고 이미지
  └── [Components] ― 리액트 컴포넌트 폴더
      └── Detail.tsx - 상세 내용 모달
      └── Footer.tsx
      └── Header.tsx
      └── PopSlider.tsx - Popular 카테고리 슬라이드
      └── Slider.tsx - 일반 슬라이드
  └── [Routes]/_ ― 리액트 라우터 폴더  
      └── Home.tsx - 메인 페이지 (영화)
      └── Tv.tsx - TV 시리즈 페이지
      └── Search.tsx - 검색 페이지
  └── api.ts ― API 패치 관련 인터페이스 및 함수 정의
  └── utils.ts ― 이미지 경로 생성 함수
  └── App.tsx ― 컴포넌트 라우팅
  └── index.tsx
  └── styled.d.ts ― 컬러 인터페이스 설정
  └── theme.tsx ― 컬러값 정의
