/**
 * 메인 애플리케이션 스크립트
 * UI 컨트롤, 이벤트 핸들링, 게임 흐름 관리
 */

// 전역 변수
let game = null;
let characterAnimator = null;
let speechRecognizer = null;
let currentScreen = 'main-screen';

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    console.log('앱 초기화 시작');
    console.log('실행 환경:', typeof tizen !== 'undefined' ? 'Tizen TV' : 'Web Browser');
    
    // 게임 인스턴스 생성
    game = new CharadesGame();
    
    // 캐릭터 애니메이터 생성
    characterAnimator = new CharacterAnimator('character-canvas');
    
    // 음성 인식기 생성
    speechRecognizer = new SpeechRecognizer();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 게임 콜백 설정
    setupGameCallbacks();
    
    // 음성 인식 콜백 설정
    setupSpeechCallbacks();
    
    // 키보드 이벤트 리스너 설정 (항상 등록)
    setupKeyboardControls();
    
    // Tizen TV 리모컨 지원 (있는 경우)
    if (typeof tizen !== 'undefined') {
        setupTizenControls();
    }
    
    // 초기 포커스 설정
    setInitialFocus('main-screen');
    
    console.log('앱 초기화 완료');
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 메인 화면
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('help-btn').addEventListener('click', showHelp);
    
    // 게임 화면
    document.getElementById('mic-btn').addEventListener('click', toggleMicrophone);
    document.getElementById('hint-btn').addEventListener('click', useHint);
    document.getElementById('skip-btn').addEventListener('click', skipQuestion);
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
    
    // 결과 화면
    document.getElementById('replay-btn').addEventListener('click', startGame);
    document.getElementById('home-btn').addEventListener('click', goHome);
    
    // 오버레이
    document.getElementById('resume-btn').addEventListener('click', resumeGame);
    document.getElementById('quit-btn').addEventListener('click', quitGame);
    document.getElementById('close-help-btn').addEventListener('click', closeHelp);
}

// 게임 콜백 설정
function setupGameCallbacks() {
    game.onTimerUpdate = (time) => {
        updateTimer(time);
    };
    
    game.onTimeUp = () => {
        showFeedback('시간 초과!', false);
    };
    
    game.onCorrectAnswer = (earnedScore) => {
        showFeedback(`정답! +${earnedScore}점`, true);
    };
    
    game.onHintUsed = () => {
        showNotification('힌트 사용 (-10점)');
    };
    
    game.onSkip = () => {
        showNotification('건너뛰기');
    };
    
    game.onGameEnd = (results) => {
        showResults(results);
    };
}

// 음성 인식 콜백 설정
function setupSpeechCallbacks() {
    if (!speechRecognizer.supported) {
        console.warn('음성 인식이 지원되지 않습니다.');
        return;
    }
    
    speechRecognizer.onStart(() => {
        console.log('음성 인식 시작');
        document.getElementById('mic-indicator').classList.add('listening');
        document.getElementById('voice-text').textContent = '듣고 있습니다...';
    });
    
    speechRecognizer.onInterim((transcript) => {
        console.log('중간 결과:', transcript);
        document.getElementById('voice-text').textContent = transcript;
    });
    
    speechRecognizer.onResult((transcript, confidence, alternatives) => {
        console.log('최종 결과:', transcript, '신뢰도:', confidence);
        document.getElementById('voice-text').textContent = `"${transcript}"`;
        
        // 정답 체크
        const result = game.checkAnswer(transcript);
        
        if (result.isCorrect) {
            showFeedback(`정답! "${transcript}"`, true);
        } else {
            // 대안 결과들도 체크
            let foundCorrect = false;
            for (const alt of alternatives) {
                const altResult = game.checkAnswer(alt.transcript);
                if (altResult.isCorrect) {
                    showFeedback(`정답! "${alt.transcript}"`, true);
                    foundCorrect = true;
                    break;
                }
            }
            
            if (!foundCorrect) {
                showFeedback(`"${transcript}" - 다시 시도해보세요!`, false);
            }
        }
    });
    
    speechRecognizer.onEnd(() => {
        console.log('음성 인식 종료');
        document.getElementById('mic-indicator').classList.remove('listening');
        document.getElementById('voice-text').textContent = '마이크 버튼을 눌러 정답을 말하세요';
    });
    
    speechRecognizer.onError((errorMessage) => {
        console.error('음성 인식 오류:', errorMessage);
        document.getElementById('mic-indicator').classList.remove('listening');
        document.getElementById('voice-text').textContent = errorMessage;
    });
}

// 게임 시작
function startGame() {
    console.log('게임 시작');
    
    game.startGame();
    switchScreen('game-screen');
    
    // 게임 UI 업데이트
    updateGameUI();
    
    // 캐릭터 애니메이션 시작
    if (game.currentWord) {
        startCharacterAnimation(game.currentWord);
    }
}

// 화면 전환
function switchScreen(screenId) {
    console.log(`화면 전환: ${currentScreen} -> ${screenId}`);
    
    // 모든 화면 숨기기
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // 선택한 화면 표시
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // 화면 전환 후 첫 번째 버튼에 자동 포커스
        setTimeout(() => {
            setInitialFocus(screenId);
        }, 100);
    }
}

// 화면별 초기 포커스 설정
function setInitialFocus(screenId) {
    console.log(`초기 포커스 설정: ${screenId}`);
    
    let focusTarget = null;
    
    switch (screenId) {
        case 'main-screen':
            focusTarget = document.getElementById('start-btn');
            break;
        case 'game-screen':
            focusTarget = document.getElementById('mic-btn');
            break;
        case 'result-screen':
            focusTarget = document.getElementById('replay-btn');
            break;
    }
    
    if (focusTarget) {
        focusTarget.focus();
        console.log(`포커스 설정 완료: ${focusTarget.id}`);
    } else {
        console.warn(`포커스 대상을 찾을 수 없습니다: ${screenId}`);
    }
}

// 게임 UI 업데이트
function updateGameUI() {
    const state = game.getGameState();
    
    document.getElementById('score').textContent = state.score;
    document.getElementById('timer').textContent = state.currentTime;
    document.getElementById('round').textContent = `${state.currentRound}/${state.maxRounds}`;
    
    // 캐릭터 상태 텍스트
    if (state.currentWord) {
        document.getElementById('character-status').textContent = 
            `라운드 ${state.currentRound}: 이 단어는 무엇일까요?`;
    }
}

// 타이머 업데이트
function updateTimer(time) {
    document.getElementById('timer').textContent = time;
    
    // 시간이 5초 이하면 색상 변경
    const timerElement = document.getElementById('timer');
    if (time <= 5) {
        timerElement.style.color = '#ff4444';
        timerElement.style.animation = 'pulse 0.5s ease-in-out infinite';
    } else {
        timerElement.style.color = '';
        timerElement.style.animation = '';
    }
}

// 캐릭터 애니메이션 시작
function startCharacterAnimation(wordData) {
    console.log('캐릭터 애니메이션 시작:', wordData.word);
    
    if (characterAnimator) {
        characterAnimator.startGesture(wordData.gestures);
    }
}

// 마이크 토글
function toggleMicrophone() {
    if (!speechRecognizer.supported) {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
        return;
    }
    
    if (speechRecognizer.isListening) {
        speechRecognizer.stop();
    } else {
        speechRecognizer.start();
    }
}

// 힌트 사용
function useHint() {
    const hint = game.useHint();
    if (hint) {
        const hintSection = document.getElementById('hint-section');
        const hintText = document.getElementById('hint-text');
        
        hintText.textContent = hint;
        hintSection.classList.remove('hidden');
        
        updateGameUI();
    }
}

// 건너뛰기
function skipQuestion() {
    if (confirm('이 문제를 건너뛰시겠습니까?')) {
        game.skip();
        
        // 힌트 숨기기
        document.getElementById('hint-section').classList.add('hidden');
        
        // 다음 라운드 UI 업데이트는 게임 콜백에서 처리됨
        setTimeout(() => {
            updateGameUI();
            if (game.currentWord) {
                startCharacterAnimation(game.currentWord);
            }
        }, 500);
    }
}

// 일시정지
function pauseGame() {
    game.pause();
    document.getElementById('pause-overlay').classList.remove('hidden');
}

// 재개
function resumeGame() {
    game.resume();
    document.getElementById('pause-overlay').classList.add('hidden');
}

// 게임 그만하기
function quitGame() {
    if (confirm('게임을 종료하시겠습니까?')) {
        game.endGame();
        goHome();
    }
}

// 메인으로
function goHome() {
    if (characterAnimator) {
        characterAnimator.stopGesture();
        // 메인 화면으로 돌아가면 다시 idle 애니메이션 시작
        setTimeout(() => {
            characterAnimator.startIdleAnimation();
        }, 100);
    }
    
    // 오버레이 숨기기
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('hint-section').classList.add('hidden');
    
    switchScreen('main-screen');
}

// 결과 표시
function showResults(results) {
    console.log('결과 표시:', results);
    
    // 애니메이션 정지
    if (characterAnimator) {
        characterAnimator.stopGesture();
    }
    
    // 결과 화면으로 전환
    switchScreen('result-screen');
    
    // 결과 데이터 표시
    document.getElementById('final-score').textContent = results.score;
    document.getElementById('correct-count').textContent = results.stats.correct;
    document.getElementById('wrong-count').textContent = results.stats.wrong;
    document.getElementById('skip-count').textContent = results.stats.skipped;
    document.getElementById('result-message').textContent = results.message;
}

// 피드백 표시
function showFeedback(message, isCorrect) {
    const voiceText = document.getElementById('voice-text');
    voiceText.textContent = message;
    
    // 배경 플래시 효과
    const gameScreen = document.getElementById('game-screen');
    gameScreen.classList.add(isCorrect ? 'correct-flash' : 'wrong-flash');
    
    setTimeout(() => {
        gameScreen.classList.remove('correct-flash', 'wrong-flash');
    }, 1000);
    
    // 점수 업데이트
    updateGameUI();
}

// 알림 표시
function showNotification(message) {
    const voiceText = document.getElementById('voice-text');
    voiceText.textContent = message;
    
    setTimeout(() => {
        voiceText.textContent = '마이크 버튼을 눌러 정답을 말하세요';
    }, 2000);
}

// 설정 화면 (추후 구현)
function showSettings() {
    alert('설정 기능은 곧 추가될 예정입니다.');
}

// 도움말 표시
function showHelp() {
    document.getElementById('help-overlay').classList.remove('hidden');
}

// 도움말 닫기
function closeHelp() {
    document.getElementById('help-overlay').classList.add('hidden');
}

// 기본 키보드 컨트롤 설정 (항상 동작)
function setupKeyboardControls() {
    console.log('키보드 이벤트 리스너 등록 중...');
    
    document.addEventListener('keydown', (event) => {
        console.log(`키 입력 감지: keyCode=${event.keyCode}, key=${event.key}, code=${event.code}`);
        handleKeyDown(event);
    });
    
    console.log('키보드 이벤트 리스너 등록 완료');
}

// Tizen 리모컨 컨트롤 설정
function setupTizenControls() {
    console.log('Tizen 환경 감지, 리모컨 키 등록 시작...');
    
    try {
        // 리모컨 키 등록
        const keys = ['MediaPlay', 'MediaPause', 'MediaStop', 'MediaRewind', 
                     'MediaFastForward', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                     'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'];
        
        let registeredKeys = [];
        let failedKeys = [];
        
        keys.forEach(key => {
            try {
                tizen.tvinputdevice.registerKey(key);
                registeredKeys.push(key);
                console.log(`✓ 키 등록 성공: ${key}`);
            } catch (e) {
                failedKeys.push(key);
                console.warn(`✗ 키 등록 실패: ${key}`, e);
            }
        });
        
        console.log(`Tizen 키 등록 완료: 성공 ${registeredKeys.length}개, 실패 ${failedKeys.length}개`);
        
        if (registeredKeys.length > 0) {
            console.log('등록된 키:', registeredKeys.join(', '));
        }
        if (failedKeys.length > 0) {
            console.log('실패한 키:', failedKeys.join(', '));
        }
        
    } catch (error) {
        console.error('Tizen 리모컨 설정 오류:', error);
    }
}

// 통합 키 이벤트 핸들러
function handleKeyDown(event) {
    console.log(`키 처리: keyCode=${event.keyCode}, 현재 화면=${currentScreen}`);
    
    const handled = handleKeyAction(event.keyCode);
    
    if (handled) {
        event.preventDefault();
        event.stopPropagation();
    }
}

// 키 액션 처리 (Tizen과 일반 키보드 모두 지원)
function handleKeyAction(keyCode) {
    switch (keyCode) {
        case 13: // Enter - 선택
            handleEnterKey();
            return true;
            
        case 37: // Left
            handleLeftKey();
            return true;
            
        case 38: // Up
            handleUpKey();
            return true;
            
        case 39: // Right
            handleRightKey();
            return true;
            
        case 40: // Down
            handleDownKey();
            return true;
            
        case 10009: // Tizen Return/Back
        case 27: // ESC (일반 키보드)
            handleBackKey();
            return true;
            
        case 415: // Tizen Play
        case 179: // 일반 미디어 Play/Pause
            if (currentScreen === 'game-screen') {
                toggleMicrophone();
                return true;
            }
            break;
            
        case 19: // Tizen Pause
        case 80: // P 키 (일반 키보드)
            if (currentScreen === 'game-screen') {
                pauseGame();
                return true;
            }
            break;
            
        case 72: // H 키 - 힌트
            if (currentScreen === 'game-screen') {
                useHint();
                return true;
            }
            break;
            
        case 83: // S 키 - 건너뛰기
            if (currentScreen === 'game-screen') {
                skipQuestion();
                return true;
            }
            break;
            
        default:
            console.log(`처리되지 않은 키: ${keyCode}`);
            return false;
    }
    
    return false;
}

// 리모컨 키 핸들러들
function handleEnterKey() {
    console.log('Enter 키 처리');
    
    // 현재 포커스된 버튼 클릭
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName === 'BUTTON') {
        console.log('포커스된 버튼 클릭:', focusedElement.id);
        focusedElement.click();
    } else {
        // 포커스된 요소가 없으면 화면에 따라 기본 동작
        if (currentScreen === 'main-screen') {
            console.log('메인 화면에서 Enter - 게임 시작');
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                startBtn.focus();
                startBtn.click();
            }
        }
    }
}

function handleLeftKey() {
    console.log('Left 키 처리');
    moveFocus('left');
}

function handleUpKey() {
    console.log('Up 키 처리');
    moveFocus('up');
}

function handleRightKey() {
    console.log('Right 키 처리');
    moveFocus('right');
}

function handleDownKey() {
    console.log('Down 키 처리');
    moveFocus('down');
}

// 포커스 이동 로직
function moveFocus(direction) {
    const currentFocused = document.activeElement;
    const currentScreenElement = document.querySelector('.screen.active');
    
    if (!currentScreenElement) {
        console.warn('활성화된 화면을 찾을 수 없습니다');
        return;
    }
    
    // 현재 화면의 모든 포커스 가능한 요소들
    const focusableElements = Array.from(
        currentScreenElement.querySelectorAll('button:not([disabled]), a, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    if (focusableElements.length === 0) {
        console.log('포커스 가능한 요소가 없습니다');
        return;
    }
    
    let currentIndex = focusableElements.indexOf(currentFocused);
    
    // 현재 포커스된 요소가 없으면 첫 번째 요소로
    if (currentIndex === -1) {
        console.log('첫 번째 요소로 포커스 이동');
        focusableElements[0].focus();
        return;
    }
    
    let nextIndex = currentIndex;
    
    switch (direction) {
        case 'left':
        case 'up':
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = focusableElements.length - 1;
            break;
        case 'right':
        case 'down':
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusableElements.length) nextIndex = 0;
            break;
    }
    
    console.log(`포커스 이동: ${currentIndex} -> ${nextIndex}`);
    focusableElements[nextIndex].focus();
}

function handleBackKey() {
    if (currentScreen === 'game-screen') {
        pauseGame();
    } else if (currentScreen === 'result-screen') {
        goHome();
    } else if (document.getElementById('pause-overlay').classList.contains('hidden') === false) {
        resumeGame();
    } else if (document.getElementById('help-overlay').classList.contains('hidden') === false) {
        closeHelp();
    } else {
        // 앱 종료 확인
        if (typeof tizen !== 'undefined') {
            tizen.application.getCurrentApplication().exit();
        }
    }
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (game) {
        game.stopTimer();
    }
    if (characterAnimator) {
        characterAnimator.stopGesture();
    }
    if (speechRecognizer) {
        speechRecognizer.abort();
    }
});
