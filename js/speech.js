/**
 * 음성 인식 클래스
 * Web Speech API를 사용하여 사용자의 음성을 인식
 */

class SpeechRecognizer {
    constructor() {
        // Web Speech API 지원 확인
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!this.SpeechRecognition) {
            console.error('Web Speech API를 지원하지 않는 브라우저입니다.');
            this.supported = false;
            return;
        }
        
        this.supported = true;
        this.recognition = new this.SpeechRecognition();
        this.isListening = false;
        
        // 음성 인식 설정
        this.recognition.lang = 'ko-KR'; // 한국어
        this.recognition.continuous = false; // 한 번만 인식
        this.recognition.interimResults = true; // 중간 결과도 받기
        this.recognition.maxAlternatives = 3; // 최대 3개의 대안 결과
        
        // 콜백 함수들
        this.onResultCallback = null;
        this.onErrorCallback = null;
        this.onStartCallback = null;
        this.onEndCallback = null;
        this.onInterimCallback = null;
        
        this.setupEventListeners();
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        if (!this.recognition) return;
        
        // 음성 인식 시작
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('음성 인식 시작');
            if (this.onStartCallback) {
                this.onStartCallback();
            }
        };
        
        // 음성 인식 결과
        this.recognition.onresult = (event) => {
            const results = event.results;
            const lastResult = results[results.length - 1];
            
            // 중간 결과 처리
            if (!lastResult.isFinal) {
                const interimTranscript = lastResult[0].transcript;
                console.log('중간 결과:', interimTranscript);
                if (this.onInterimCallback) {
                    this.onInterimCallback(interimTranscript);
                }
                return;
            }
            
            // 최종 결과 처리
            const transcript = lastResult[0].transcript.trim();
            const confidence = lastResult[0].confidence;
            
            // 대안 결과들도 수집
            const alternatives = [];
            for (let i = 0; i < lastResult.length; i++) {
                alternatives.push({
                    transcript: lastResult[i].transcript.trim(),
                    confidence: lastResult[i].confidence
                });
            }
            
            console.log('최종 결과:', transcript, '신뢰도:', confidence);
            
            if (this.onResultCallback) {
                this.onResultCallback(transcript, confidence, alternatives);
            }
        };
        
        // 음성 인식 종료
        this.recognition.onend = () => {
            this.isListening = false;
            console.log('음성 인식 종료');
            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };
        
        // 오류 처리
        this.recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            this.isListening = false;
            
            let errorMessage = '음성 인식 중 오류가 발생했습니다.';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = '음성이 감지되지 않았습니다.';
                    break;
                case 'audio-capture':
                    errorMessage = '마이크를 사용할 수 없습니다.';
                    break;
                case 'not-allowed':
                    errorMessage = '마이크 권한이 거부되었습니다.';
                    break;
                case 'network':
                    errorMessage = '네트워크 오류가 발생했습니다.';
                    break;
            }
            
            if (this.onErrorCallback) {
                this.onErrorCallback(errorMessage);
            }
        };
    }
    
    // 음성 인식 시작
    start() {
        if (!this.supported) {
            console.error('음성 인식이 지원되지 않습니다.');
            return false;
        }
        
        if (this.isListening) {
            console.log('이미 음성 인식 중입니다.');
            return false;
        }
        
        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('음성 인식 시작 실패:', error);
            return false;
        }
    }
    
    // 음성 인식 중지
    stop() {
        if (!this.isListening) {
            return;
        }
        
        try {
            this.recognition.stop();
        } catch (error) {
            console.error('음성 인식 중지 실패:', error);
        }
    }
    
    // 음성 인식 취소
    abort() {
        if (!this.isListening) {
            return;
        }
        
        try {
            this.recognition.abort();
        } catch (error) {
            console.error('음성 인식 취소 실패:', error);
        }
    }
    
    // 콜백 설정
    onResult(callback) {
        this.onResultCallback = callback;
    }
    
    onError(callback) {
        this.onErrorCallback = callback;
    }
    
    onStart(callback) {
        this.onStartCallback = callback;
    }
    
    onEnd(callback) {
        this.onEndCallback = callback;
    }
    
    onInterim(callback) {
        this.onInterimCallback = callback;
    }
    
    // 정답 판정 (유사도 검사)
    checkAnswer(userAnswer, correctAnswer) {
        // 공백과 특수문자 제거 후 소문자로 변환
        const normalizedUser = userAnswer.replace(/\s+/g, '').toLowerCase();
        const normalizedCorrect = correctAnswer.replace(/\s+/g, '').toLowerCase();
        
        // 완전 일치
        if (normalizedUser === normalizedCorrect) {
            return { isCorrect: true, similarity: 1.0 };
        }
        
        // 포함 여부
        if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
            return { isCorrect: true, similarity: 0.9 };
        }
        
        // 레벤슈타인 거리 계산
        const similarity = this.calculateSimilarity(normalizedUser, normalizedCorrect);
        
        // 유사도 80% 이상이면 정답으로 인정
        if (similarity >= 0.8) {
            return { isCorrect: true, similarity };
        }
        
        return { isCorrect: false, similarity };
    }
    
    // 레벤슈타인 거리 기반 유사도 계산
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) {
            return 1.0;
        }
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }
    
    // 레벤슈타인 거리 계산
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
}

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechRecognizer;
}
