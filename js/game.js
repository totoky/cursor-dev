/**
 * 게임 로직 클래스
 * 게임의 핵심 로직, 점수 계산, 라운드 관리 등
 */

class CharadesGame {
    constructor() {
        // 게임 상태
        this.currentRound = 1;
        this.maxRounds = 5;
        this.score = 0;
        this.timeLimit = 30; // 초
        this.currentTime = this.timeLimit;
        this.isPaused = false;
        this.isPlaying = false;
        
        // 현재 단어
        this.currentWord = null;
        this.usedWords = new Set();
        
        // 통계
        this.stats = {
            correct: 0,
            wrong: 0,
            skipped: 0,
            hintsUsed: 0
        };
        
        // 타이머
        this.timerInterval = null;
        
        // 점수 설정
        this.baseScore = 100;
        this.timeBonus = 10; // 남은 시간당 추가 점수
        this.hintPenalty = 10;
    }
    
    // 게임 시작
    startGame() {
        this.reset();
        this.isPlaying = true;
        this.currentRound = 1;
        this.startRound();
    }
    
    // 게임 초기화
    reset() {
        this.currentRound = 1;
        this.score = 0;
        this.isPaused = false;
        this.isPlaying = false;
        this.usedWords.clear();
        this.stats = {
            correct: 0,
            wrong: 0,
            skipped: 0,
            hintsUsed: 0
        };
        this.stopTimer();
    }
    
    // 라운드 시작
    startRound() {
        if (this.currentRound > this.maxRounds) {
            this.endGame();
            return;
        }
        
        // 새로운 단어 선택
        this.currentWord = this.getNewWord();
        this.currentTime = this.timeLimit;
        this.startTimer();
        
        return this.currentWord;
    }
    
    // 다음 라운드로
    nextRound() {
        this.stopTimer();
        this.currentRound++;
        
        if (this.currentRound <= this.maxRounds) {
            // 짧은 딜레이 후 다음 라운드 시작
            setTimeout(() => {
                this.startRound();
            }, 1000);
        } else {
            this.endGame();
        }
    }
    
    // 새로운 단어 가져오기 (중복 제거)
    getNewWord() {
        let word;
        let attempts = 0;
        const maxAttempts = 50;
        
        do {
            word = WordDatabase.getRandomWord();
            attempts++;
            
            // 모든 단어를 사용했거나 너무 많이 시도한 경우 리셋
            if (attempts >= maxAttempts) {
                this.usedWords.clear();
                attempts = 0;
            }
        } while (this.usedWords.has(word.word) && attempts < maxAttempts);
        
        this.usedWords.add(word.word);
        return word;
    }
    
    // 타이머 시작
    startTimer() {
        this.stopTimer();
        this.currentTime = this.timeLimit;
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.currentTime--;
                
                if (this.onTimerUpdate) {
                    this.onTimerUpdate(this.currentTime);
                }
                
                if (this.currentTime <= 0) {
                    this.timeUp();
                }
            }
        }, 1000);
    }
    
    // 타이머 정지
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    // 시간 초과
    timeUp() {
        this.stopTimer();
        this.stats.wrong++;
        
        if (this.onTimeUp) {
            this.onTimeUp();
        }
        
        // 자동으로 다음 라운드로
        setTimeout(() => {
            this.nextRound();
        }, 2000);
    }
    
    // 정답 체크
    checkAnswer(userAnswer) {
        if (!this.currentWord || !this.isPlaying) {
            return { isCorrect: false, message: '게임이 진행 중이 아닙니다.' };
        }
        
        const correctAnswer = this.currentWord.word;
        
        // 음성 인식기를 통한 유사도 검사
        const speechRecognizer = new SpeechRecognizer();
        const result = speechRecognizer.checkAnswer(userAnswer, correctAnswer);
        
        if (result.isCorrect) {
            this.correctAnswer();
            return {
                isCorrect: true,
                message: '정답입니다!',
                similarity: result.similarity,
                score: this.calculateScore()
            };
        } else {
            return {
                isCorrect: false,
                message: '틀렸습니다. 다시 시도해보세요!',
                similarity: result.similarity
            };
        }
    }
    
    // 정답 처리
    correctAnswer() {
        this.stopTimer();
        this.stats.correct++;
        
        const earnedScore = this.calculateScore();
        this.score += earnedScore;
        
        if (this.onCorrectAnswer) {
            this.onCorrectAnswer(earnedScore);
        }
        
        // 다음 라운드로
        setTimeout(() => {
            this.nextRound();
        }, 2000);
    }
    
    // 점수 계산
    calculateScore() {
        let score = this.baseScore;
        
        // 남은 시간에 따른 보너스
        const timeBonus = this.currentTime * this.timeBonus;
        score += timeBonus;
        
        return Math.max(0, score);
    }
    
    // 힌트 사용
    useHint() {
        if (!this.currentWord) {
            return null;
        }
        
        this.stats.hintsUsed++;
        this.score = Math.max(0, this.score - this.hintPenalty);
        
        if (this.onHintUsed) {
            this.onHintUsed();
        }
        
        return this.currentWord.hint;
    }
    
    // 건너뛰기
    skip() {
        this.stopTimer();
        this.stats.skipped++;
        
        if (this.onSkip) {
            this.onSkip();
        }
        
        this.nextRound();
    }
    
    // 일시정지
    pause() {
        this.isPaused = true;
        
        if (this.onPause) {
            this.onPause();
        }
    }
    
    // 재개
    resume() {
        this.isPaused = false;
        
        if (this.onResume) {
            this.onResume();
        }
    }
    
    // 게임 종료
    endGame() {
        this.stopTimer();
        this.isPlaying = false;
        
        const results = {
            score: this.score,
            stats: this.stats,
            message: this.getResultMessage()
        };
        
        if (this.onGameEnd) {
            this.onGameEnd(results);
        }
        
        return results;
    }
    
    // 결과 메시지 생성
    getResultMessage() {
        const correctRate = (this.stats.correct / this.maxRounds) * 100;
        
        if (correctRate === 100) {
            return '🎉 완벽합니다! 모든 문제를 맞추셨네요!';
        } else if (correctRate >= 80) {
            return '👏 대단해요! 정말 잘하셨어요!';
        } else if (correctRate >= 60) {
            return '😊 좋아요! 계속 연습하면 더 잘할 수 있어요!';
        } else if (correctRate >= 40) {
            return '💪 괜찮아요! 다음엔 더 잘할 수 있을 거예요!';
        } else {
            return '😅 아쉬워요! 하지만 포기하지 마세요!';
        }
    }
    
    // 게임 상태 가져오기
    getGameState() {
        return {
            currentRound: this.currentRound,
            maxRounds: this.maxRounds,
            score: this.score,
            currentTime: this.currentTime,
            isPaused: this.isPaused,
            isPlaying: this.isPlaying,
            currentWord: this.currentWord,
            stats: this.stats
        };
    }
    
    // 콜백 설정
    onTimerUpdate = null;
    onTimeUp = null;
    onCorrectAnswer = null;
    onHintUsed = null;
    onSkip = null;
    onPause = null;
    onResume = null;
    onGameEnd = null;
}

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharadesGame;
}
