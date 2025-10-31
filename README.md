# 몸으로 말해요 - AI 기반 Charades 게임

Samsung Tizen TV용 AI 기반 "몸으로 말해요" 게임 웹앱입니다.

## 🎮 게임 소개

AI 캐릭터가 몸짓으로 단어를 표현하면, 사용자가 마이크를 통해 정답을 맞추는 인터랙티브 게임입니다.

## ✨ 주요 기능

### 1. AI 캐릭터 애니메이션
- 라이센스 프리 스틱맨 캐릭터 (Canvas 기반)
- 다양한 제스처 애니메이션 (동물, 스포츠, 직업, 감정, 음식)
- 실시간 애니메이션 렌더링

### 2. 음성 인식
- Web Speech API 활용
- 한국어 음성 인식
- 유사도 기반 정답 판정 (레벤슈타인 거리 알고리즘)
- 중간 결과 실시간 표시

### 3. 게임 시스템
- 총 5라운드 진행
- 라운드당 30초 제한시간
- 점수 시스템 (기본 100점 + 시간 보너스)
- 힌트 기능 (10점 감점)
- 건너뛰기 기능

### 4. 단어 데이터베이스
- 5개 카테고리: 동물, 스포츠, 직업, 감정, 음식
- 각 카테고리별 10개 단어
- 총 50개의 다양한 단어

## 🗂️ 프로젝트 구조

```
/workspace/
├── config.xml              # Tizen 앱 설정 파일
├── index.html              # 메인 HTML 파일
├── css/
│   └── style.css          # 스타일시트
├── js/
│   ├── main.js            # 메인 애플리케이션 로직
│   ├── game.js            # 게임 로직
│   ├── character.js       # 캐릭터 애니메이션
│   ├── speech.js          # 음성 인식
│   └── words.js           # 단어 데이터베이스
└── README.md              # 프로젝트 문서
```

## 🎯 게임 방법

1. **게임 시작**: 메인 화면에서 "게임 시작" 버튼 클릭
2. **관찰**: AI 캐릭터가 몸짓으로 단어를 표현
3. **답변**: 마이크 버튼을 눌러 정답 발화
4. **점수 획득**: 정답을 맞추면 점수 획득
5. **반복**: 5라운드 진행 후 최종 점수 확인

### 게임 규칙
- 라운드당 30초 제한시간
- 정답 시: 100점 + (남은 시간 × 10점)
- 힌트 사용 시: -10점
- 시간 초과 또는 건너뛰기: 0점

## 🛠️ 기술 스택

- **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
- **그래픽**: Canvas API
- **음성 인식**: Web Speech API
- **플랫폼**: Samsung Tizen TV (Web API)

## 📱 Tizen TV 지원

### 리모컨 조작
- **Enter**: 버튼 선택
- **방향키**: 메뉴 이동
- **Play**: 마이크 시작
- **Pause**: 일시정지
- **Back**: 이전 화면/일시정지

### 필요 권한
- `http://tizen.org/privilege/tv.inputdevice` - 리모컨 입력
- `http://tizen.org/privilege/internet` - 네트워크 (음성 인식)

## 🚀 설치 및 실행

### Tizen Studio를 이용한 설치

1. **Tizen Studio 설치**
   - [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download) 다운로드 및 설치

2. **프로젝트 임포트**
   ```bash
   File > Open Projects from File System
   ```

3. **TV에 연결**
   - TV의 개발자 모드 활성화
   - Tizen Studio에서 TV 연결

4. **빌드 및 실행**
   ```bash
   Run > Run As > Tizen Web Application
   ```

### 로컬 테스트 (웹 브라우저)

1. **웹 서버 실행**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

2. **브라우저 접속**
   ```
   http://localhost:8000
   ```

   **주의**: 음성 인식은 HTTPS 또는 localhost에서만 작동합니다.

## 🎨 캐릭터 애니메이션

### 구현된 제스처
- **동물**: hop, trunk-swing, waddle, tail-wag, stretch 등
- **스포츠**: kick, jump, swim, run, dance 등
- **감정**: clap, think, wave, celebrate 등

### 애니메이션 시스템
- Canvas 2D API 기반
- 60 FPS 애니메이션
- 부드러운 전환 효과
- 표정 변화 (happy, excited, surprised, normal)

## 🔊 음성 인식

### 지원 기능
- 한국어 음성 인식 (ko-KR)
- 실시간 중간 결과 표시
- 다중 대안 결과 처리
- 유사도 기반 정답 판정 (80% 이상)

### 정답 판정 알고리즘
1. 완전 일치 검사
2. 부분 일치 검사
3. 레벤슈타인 거리 기반 유사도 계산
4. 유사도 80% 이상 시 정답 처리

## 📊 점수 시스템

- **기본 점수**: 100점
- **시간 보너스**: 남은 시간 × 10점
- **힌트 사용**: -10점
- **최대 점수**: 400점 (30초 남았을 때)

## 🎯 향후 개발 계획

- [ ] 난이도 선택 (쉬움/보통/어려움)
- [ ] 멀티플레이어 모드
- [ ] 추가 카테고리 및 단어
- [ ] 사용자 지정 단어 추가
- [ ] 리더보드 시스템
- [ ] 소리 효과 및 배경 음악
- [ ] 다국어 지원 (영어, 일본어 등)
- [ ] AI 기반 동적 난이도 조정

## 📝 라이센스

이 프로젝트는 라이센스 프리 리소스만을 사용합니다:
- 스틱맨 캐릭터: Canvas로 직접 구현 (라이센스 프리)
- 모든 애니메이션: 자체 제작
- 아이콘: 이모지 사용 (유니코드 표준)

## 🤝 기여

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

## 📧 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.

---

**Made with ❤️ for Samsung Tizen TV**
