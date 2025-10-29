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
    
    // Tizen TV 리모컨 지원 (있는 경우)
    if (typeof tizen !== 'undefined') {
        setupTizenControls();
    }
    
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
    // 모든 화면 숨기기
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // 선택한 화면 표시
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
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

// Tizen 리모컨 컨트롤 설정
function setupTizenControls() {
    try {
        // 리모컨 키 등록
        const keys = ['MediaPlay', 'MediaPause', 'MediaStop', 'MediaRewind', 
                     'MediaFastForward', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        keys.forEach(key => {
            try {
                tizen.tvinputdevice.registerKey(key);
            } catch (e) {
                console.warn(`키 등록 실패: ${key}`);
            }
        });
        
        // 키 이벤트 리스너
        document.addEventListener('keydown', handleTizenKeyDown);
        
        console.log('Tizen 리모컨 컨트롤 설정 완료');
    } catch (error) {
        console.error('Tizen 리모컨 설정 오류:', error);
    }
}

// Tizen 키 이벤트 핸들러
function handleTizenKeyDown(event) {
    switch (event.keyCode) {
        case 13: // Enter - 선택
            handleEnterKey();
            break;
        case 37: // Left
            handleLeftKey();
            break;
        case 38: // Up
            handleUpKey();
            break;
        case 39: // Right
            handleRightKey();
            break;
        case 40: // Down
            handleDownKey();
            break;
        case 10009: // Return/Back
            handleBackKey();
            event.preventDefault();
            break;
        case 415: // Play
            if (currentScreen === 'game-screen') {
                toggleMicrophone();
            }
            break;
        case 19: // Pause
            if (currentScreen === 'game-screen') {
                pauseGame();
            }
            break;
    }
}

// 리모컨 키 핸들러들
function handleEnterKey() {
    // 현재 포커스된 버튼 클릭
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName === 'BUTTON') {
        focusedElement.click();
    }
}

function handleLeftKey() {
    // 포커스 이동 로직
}

function handleUpKey() {
    // 포커스 이동 로직
}

function handleRightKey() {
    // 포커스 이동 로직
}

function handleDownKey() {
    // 포커스 이동 로직
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
