/**
 * 캐릭터 애니메이션 클래스
 * Canvas를 이용하여 라이센스 프리 스틱맨 캐릭터를 그리고 애니메이션 처리
 */

class CharacterAnimator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // requestAnimationFrame 폴리필 (TV 브라우저 호환성)
        this.setupAnimationPolyfill();
        
        // 캐릭터 기본 설정 (3D 효과용)
        this.character = {
            x: this.width / 2,
            y: this.height / 2,
            scale: 1,
            rotation: 0,
            color: '#667eea',
            shadowColor: '#4a5fb5',
            highlightColor: '#8a9ff5'
        };
        
        // 애니메이션 상태
        this.currentGesture = null;
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.isAnimating = false;
        this.animationRequestId = null;
        
        // 강제 시작 플래그 (TV 환경에서 애니메이션 시작 보장)
        this.forceStart = true;
        
        console.log('CharacterAnimator 초기화 완료');
        
        // 초기 idle 애니메이션 시작 (지연 없이)
        setTimeout(() => {
            this.startIdleAnimation();
            console.log('Idle 애니메이션 시작됨');
        }, 100);
    }
    
    // requestAnimationFrame 폴리필 설정 (TV 브라우저 호환성)
    setupAnimationPolyfill() {
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = 
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = 
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                function(id) {
                    window.clearTimeout(id);
                };
        }
    }
    
    // 캔버스 초기화
    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    // 2.5D 스틱맨 그리기 (입체감 추가)
    drawStickman(x, y, scale, pose) {
        const ctx = this.ctx;
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        // 3D 효과를 위한 그림자 먼저 그리기
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        ctx.strokeStyle = this.character.color;
        ctx.fillStyle = this.character.color;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 머리 (3D 효과)
        // 그림자 부분
        ctx.beginPath();
        ctx.arc(3, -57, 30, Math.PI * 0.2, Math.PI * 1.8);
        ctx.fillStyle = this.character.shadowColor;
        ctx.fill();
        
        // 메인 부분
        ctx.beginPath();
        ctx.arc(0, -60, 30, 0, Math.PI * 2);
        ctx.fillStyle = this.character.color;
        ctx.fill();
        ctx.strokeStyle = this.character.color;
        ctx.stroke();
        
        // 하이라이트
        ctx.beginPath();
        ctx.arc(-8, -68, 12, 0, Math.PI * 2);
        ctx.fillStyle = this.character.highlightColor;
        ctx.fill();
        
        // 몸통
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(0, 50);
        ctx.stroke();
        
        // 팔 (포즈에 따라 각도 조정)
        this.drawArms(pose);
        
        // 다리 (포즈에 따라 각도 조정)
        this.drawLegs(pose);
        
        // 표정
        this.drawFace(pose);
        
        ctx.restore();
    }
    
    // 팔 그리기
    drawArms(pose) {
        const ctx = this.ctx;
        const { leftArmAngle, rightArmAngle, leftForearmAngle, rightForearmAngle } = pose;
        
        // 왼쪽 팔
        ctx.save();
        ctx.translate(0, -10);
        ctx.rotate(leftArmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 50);
        ctx.stroke();
        
        // 왼쪽 팔뚝
        ctx.translate(0, 50);
        ctx.rotate(leftForearmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 40);
        ctx.stroke();
        ctx.restore();
        
        // 오른쪽 팔
        ctx.save();
        ctx.translate(0, -10);
        ctx.rotate(rightArmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 50);
        ctx.stroke();
        
        // 오른쪽 팔뚝
        ctx.translate(0, 50);
        ctx.rotate(rightForearmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 40);
        ctx.stroke();
        ctx.restore();
    }
    
    // 다리 그리기
    drawLegs(pose) {
        const ctx = this.ctx;
        const { leftLegAngle, rightLegAngle, leftKneeAngle, rightKneeAngle } = pose;
        
        // 왼쪽 다리
        ctx.save();
        ctx.translate(0, 50);
        ctx.rotate(leftLegAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 60);
        ctx.stroke();
        
        // 왼쪽 무릎
        ctx.translate(0, 60);
        ctx.rotate(leftKneeAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 50);
        ctx.stroke();
        ctx.restore();
        
        // 오른쪽 다리
        ctx.save();
        ctx.translate(0, 50);
        ctx.rotate(rightLegAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 60);
        ctx.stroke();
        
        // 오른쪽 무릎
        ctx.translate(0, 60);
        ctx.rotate(rightKneeAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 50);
        ctx.stroke();
        ctx.restore();
    }
    
    // 표정 그리기
    drawFace(pose) {
        const ctx = this.ctx;
        const { expression } = pose;
        
        // 눈
        ctx.fillStyle = '#ffffff';
        if (expression === 'happy' || expression === 'excited') {
            ctx.beginPath();
            ctx.arc(-12, -65, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(12, -65, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (expression === 'surprised') {
            ctx.beginPath();
            ctx.arc(-12, -65, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(12, -65, 7, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(-12, -65, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(12, -65, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 입
        if (expression === 'happy') {
            ctx.beginPath();
            ctx.arc(0, -50, 15, 0, Math.PI);
            ctx.stroke();
        } else if (expression === 'excited') {
            ctx.beginPath();
            ctx.arc(0, -50, 12, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // idle 애니메이션 시작
    startIdleAnimation() {
        console.log('startIdleAnimation 호출됨');
        
        // 기존 애니메이션이 있다면 중지
        if (this.animationRequestId) {
            cancelAnimationFrame(this.animationRequestId);
            this.animationRequestId = null;
        }
        
        this.currentGesture = null;
        this.animationFrame = 0;
        this.isAnimating = true;
        
        console.log('애니메이션 시작 준비 완료, animate() 호출');
        this.animate();
    }
    
    // 제스처 애니메이션 시작
    startGesture(gestures) {
        console.log('startGesture 호출됨:', gestures);
        
        // 기존 애니메이션이 있다면 중지
        if (this.animationRequestId) {
            cancelAnimationFrame(this.animationRequestId);
            this.animationRequestId = null;
        }
        
        if (!gestures || gestures.length === 0) {
            console.warn('제스처가 비어있습니다, idle로 대체');
            this.startIdleAnimation();
            return;
        }
        
        this.currentGesture = gestures;
        this.animationFrame = 0;
        this.isAnimating = true;
        
        console.log('제스처 애니메이션 시작');
        this.animate();
    }
    
    // 애니메이션 중지
    stopGesture() {
        this.isAnimating = false;
        this.currentGesture = null;
        if (this.animationRequestId) {
            cancelAnimationFrame(this.animationRequestId);
            this.animationRequestId = null;
        }
    }
    
    // 애니메이션 루프 (TV 호환성 강화)
    animate() {
        if (!this.isAnimating) {
            this.animationRequestId = null;
            console.log('애니메이션 중지됨');
            return;
        }
        
        // Canvas와 context 확인
        if (!this.canvas || !this.ctx) {
            console.error('Canvas 또는 Context가 없습니다');
            return;
        }
        
        try {
            this.clear();
            
            if (this.currentGesture && this.currentGesture.length > 0) {
                const gestureIndex = Math.floor(this.animationFrame / 60) % this.currentGesture.length;
                const gestureName = this.currentGesture[gestureIndex];
                const pose = this.getGesturePose(gestureName, this.animationFrame % 60);
                this.drawStickman(this.character.x, this.character.y, this.character.scale, pose);
            } else {
                const pose = this.getIdlePose(this.animationFrame);
                this.drawStickman(this.character.x, this.character.y, this.character.scale, pose);
            }
            
            this.animationFrame++;
            
            // requestAnimationFrame 호출
            this.animationRequestId = requestAnimationFrame(() => this.animate());
        } catch (error) {
            console.error('애니메이션 렌더링 오류:', error);
            // 오류 발생 시에도 계속 시도
            this.animationRequestId = requestAnimationFrame(() => this.animate());
        }
    }
    
    // 기본 대기 포즈
    getIdlePose(frame) {
        const breathe = Math.sin(frame * 0.05) * 0.1;
        return {
            leftArmAngle: -Math.PI / 6 + breathe,
            rightArmAngle: Math.PI / 6 - breathe,
            leftForearmAngle: 0,
            rightForearmAngle: 0,
            leftLegAngle: -Math.PI / 12,
            rightLegAngle: Math.PI / 12,
            leftKneeAngle: Math.PI / 12,
            rightKneeAngle: Math.PI / 12,
            expression: 'normal'
        };
    }
    
    // 제스처별 포즈 반환 (더 상세한 동작)
    getGesturePose(gestureName, frame) {
        const t = frame / 60; // 0 to 1
        const poses = {
            // 동물 제스처
            'hop': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 4,
                rightForearmAngle: Math.PI / 4,
                leftLegAngle: -Math.PI / 3 + Math.sin(t * Math.PI * 4) * 0.5,
                rightLegAngle: Math.PI / 3 + Math.sin(t * Math.PI * 4) * 0.5,
                leftKneeAngle: Math.sin(t * Math.PI * 4) * 0.5,
                rightKneeAngle: Math.sin(t * Math.PI * 4) * 0.5,
                expression: 'happy'
            },
            'ear-wiggle': {
                leftArmAngle: -Math.PI / 2 - Math.PI / 6,
                rightArmAngle: Math.PI / 2 + Math.PI / 6,
                leftForearmAngle: Math.sin(t * Math.PI * 6) * Math.PI / 8,
                rightForearmAngle: -Math.sin(t * Math.PI * 6) * Math.PI / 8,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'happy'
            },
            'nose-twitch': {
                leftArmAngle: -Math.PI / 6,
                rightArmAngle: Math.PI / 6,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'trunk-swing': {
                leftArmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 3,
                rightArmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 3,
                leftForearmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 6,
                rightForearmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 6,
                leftLegAngle: -Math.PI / 8,
                rightLegAngle: Math.PI / 8,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'stomp': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: t < 0.5 ? Math.PI / 4 : -Math.PI / 12,
                rightLegAngle: t < 0.5 ? -Math.PI / 12 : Math.PI / 4,
                leftKneeAngle: t < 0.5 ? -Math.PI / 6 : 0,
                rightKneeAngle: t < 0.5 ? 0 : -Math.PI / 6,
                expression: 'excited'
            },
            'trumpet': {
                leftArmAngle: -Math.PI / 2,
                rightArmAngle: Math.PI / 2,
                leftForearmAngle: -Math.PI / 3,
                rightForearmAngle: Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'waddle': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: -Math.PI / 6,
                rightForearmAngle: Math.PI / 6,
                leftLegAngle: Math.sin(t * Math.PI * 2) * Math.PI / 6,
                rightLegAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 6,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'flap': {
                leftArmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 3 - Math.PI / 2,
                rightArmAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 3 + Math.PI / 2,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'tail-wag': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: Math.sin(t * Math.PI * 6) * Math.PI / 8,
                expression: 'happy'
            },
            'pant': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: -Math.PI / 4,
                rightForearmAngle: Math.PI / 4,
                leftLegAngle: -Math.PI / 6,
                rightLegAngle: Math.PI / 6,
                leftKneeAngle: Math.PI / 8,
                rightKneeAngle: Math.PI / 8,
                expression: 'excited'
            },
            'sit': {
                leftArmAngle: -Math.PI / 6,
                rightArmAngle: Math.PI / 6,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: -Math.PI / 3,
                rightLegAngle: Math.PI / 3,
                leftKneeAngle: Math.PI / 2,
                rightKneeAngle: Math.PI / 2,
                expression: 'normal'
            },
            'stretch': {
                leftArmAngle: -Math.PI / 2 - Math.PI / 4,
                rightArmAngle: Math.PI / 2 + Math.PI / 4,
                leftForearmAngle: Math.sin(t * Math.PI) * Math.PI / 6,
                rightForearmAngle: -Math.sin(t * Math.PI) * Math.PI / 6,
                leftLegAngle: -Math.PI / 4,
                rightLegAngle: Math.PI / 4,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'paw': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 3,
                rightForearmAngle: t < 0.5 ? 0 : -Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'roar': {
                leftArmAngle: -Math.PI / 2,
                rightArmAngle: Math.PI / 2,
                leftForearmAngle: -Math.PI / 4,
                rightForearmAngle: Math.PI / 4,
                leftLegAngle: -Math.PI / 6,
                rightLegAngle: Math.PI / 6,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'scratch': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: -Math.PI / 2,
                leftForearmAngle: 0,
                rightForearmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 4 - Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'climb': {
                leftArmAngle: -Math.PI / 2 - Math.sin(t * Math.PI * 2) * Math.PI / 6,
                rightArmAngle: Math.PI / 2 + Math.sin(t * Math.PI * 2) * Math.PI / 6,
                leftForearmAngle: -Math.PI / 4,
                rightForearmAngle: Math.PI / 4,
                leftLegAngle: Math.sin(t * Math.PI * 2) * Math.PI / 4,
                rightLegAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 4,
                leftKneeAngle: Math.PI / 6,
                rightKneeAngle: Math.PI / 6,
                expression: 'normal'
            },
            
            // 스포츠 제스처
            'kick': {
                leftArmAngle: -Math.PI / 2,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: Math.PI / 4,
                rightLegAngle: t < 0.5 ? -Math.PI / 6 : Math.PI / 2,
                leftKneeAngle: 0,
                rightKneeAngle: t < 0.5 ? 0 : -Math.PI / 4,
                expression: 'excited'
            },
            'dribble': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 3,
                leftForearmAngle: 0,
                rightForearmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 4,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: Math.sin(t * Math.PI * 2) * Math.PI / 12,
                rightKneeAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 12,
                expression: 'normal'
            },
            'shoot': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: t < 0.5 ? Math.PI / 4 : -Math.PI / 2 - Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: t < 0.5 ? -Math.PI / 3 : Math.PI / 6,
                leftLegAngle: -Math.PI / 6,
                rightLegAngle: Math.PI / 6,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'jump': {
                leftArmAngle: -Math.PI / 2 - Math.PI / 4,
                rightArmAngle: Math.PI / 2 + Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: -Math.PI / 4,
                rightLegAngle: Math.PI / 4,
                leftKneeAngle: t < 0.5 ? -Math.PI / 3 : 0,
                rightKneeAngle: t < 0.5 ? -Math.PI / 3 : 0,
                expression: 'excited'
            },
            'swim': {
                leftArmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 2,
                rightArmAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 2,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: Math.sin(t * Math.PI * 2 + Math.PI) * Math.PI / 6,
                rightLegAngle: Math.sin(t * Math.PI * 2) * Math.PI / 6,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'swing': {
                leftArmAngle: -Math.PI / 2 - Math.sin(t * Math.PI * 2) * Math.PI / 3,
                rightArmAngle: Math.PI / 2 - Math.sin(t * Math.PI * 2) * Math.PI / 3,
                leftForearmAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 4,
                rightForearmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 4,
                leftLegAngle: -Math.PI / 6,
                rightLegAngle: Math.PI / 6,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'throw': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: t < 0.5 ? -Math.PI / 2 : Math.PI / 2 + Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: t < 0.5 ? -Math.PI / 3 : Math.PI / 6,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            
            // 직업 제스처
            'examine': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: -Math.PI / 2,
                rightForearmAngle: Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'stethoscope': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: -Math.PI / 3,
                rightForearmAngle: -Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'write': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 3,
                rightForearmAngle: Math.sin(t * Math.PI * 3) * Math.PI / 12 - Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'point': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: -Math.PI / 3,
                leftForearmAngle: 0,
                rightForearmAngle: -Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'chop': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.sin(t * Math.PI * 4) > 0 ? -Math.PI / 2 : Math.PI / 4,
                leftForearmAngle: -Math.PI / 2,
                rightForearmAngle: Math.sin(t * Math.PI * 4) > 0 ? 0 : -Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'stir': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 2,
                rightForearmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 6 - Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'spray': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: -Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: -Math.PI / 2,
                leftLegAngle: -Math.PI / 6,
                rightLegAngle: Math.PI / 6,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'sing': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 3,
                rightForearmAngle: -Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'paint': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.sin(t * Math.PI * 3) * Math.PI / 6,
                leftForearmAngle: -Math.PI / 2,
                rightForearmAngle: Math.sin(t * Math.PI * 3) * Math.PI / 4 - Math.PI / 4,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'steer': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: -Math.PI / 4,
                rightForearmAngle: Math.PI / 4,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'type': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: Math.sin(t * Math.PI * 8) * Math.PI / 12 - Math.PI / 3,
                rightForearmAngle: -Math.sin(t * Math.PI * 8) * Math.PI / 12 - Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: Math.PI / 6,
                rightKneeAngle: Math.PI / 6,
                expression: 'normal'
            },
            
            // 물건/사물 제스처
            'vroom': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: -Math.PI / 4 + Math.sin(t * Math.PI * 4) * Math.PI / 12,
                rightForearmAngle: Math.PI / 4 - Math.sin(t * Math.PI * 4) * Math.PI / 12,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'fly': {
                leftArmAngle: -Math.PI / 2 - Math.PI / 6,
                rightArmAngle: Math.PI / 2 + Math.PI / 6,
                leftForearmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 12,
                rightForearmAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 12,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'happy'
            },
            'robot-walk': {
                leftArmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 4 - Math.PI / 4,
                rightArmAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 4 + Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: Math.sin(t * Math.PI * 2) * Math.PI / 4,
                rightLegAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 4,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'click': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 2,
                rightForearmAngle: t < 0.5 ? -Math.PI / 3 : -Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            
            // 음식 제스처
            'slice': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: t < 0.5 ? Math.PI / 4 : -Math.PI / 6,
                leftForearmAngle: -Math.PI / 2,
                rightForearmAngle: t < 0.5 ? -Math.PI / 3 : -Math.PI / 4,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            'eat': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: 0,
                rightForearmAngle: Math.sin(t * Math.PI * 2) > 0 ? -Math.PI / 2 : -Math.PI / 3,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'happy'
            },
            'slurp': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: -Math.PI / 3,
                rightForearmAngle: -Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'happy'
            },
            'lick': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 4,
                leftForearmAngle: 0,
                rightForearmAngle: -Math.PI / 2 + Math.sin(t * Math.PI * 3) * Math.PI / 12,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'happy'
            },
            
            // 기타 제스처
            'run': this.getRunPose(t),
            'wave': this.getWavePose(t),
            'celebrate': this.getCelebratePose(t),
            'clap': this.getClapPose(t),
            'dance': this.getDancePose(t)
        };
        
        return poses[gestureName] || this.getIdlePose(frame);
    }
    
    getRunPose(t) {
        return {
            leftArmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 3 - Math.PI / 6,
            rightArmAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 3 + Math.PI / 6,
            leftForearmAngle: 0,
            rightForearmAngle: 0,
            leftLegAngle: Math.sin(t * Math.PI * 4) * Math.PI / 3,
            rightLegAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 3,
            leftKneeAngle: Math.abs(Math.sin(t * Math.PI * 4)) * Math.PI / 4,
            rightKneeAngle: Math.abs(Math.sin(t * Math.PI * 4)) * Math.PI / 4,
            expression: 'normal'
        };
    }
    
    getWavePose(t) {
        return {
            leftArmAngle: -Math.PI / 4,
            rightArmAngle: -Math.PI / 2,
            leftForearmAngle: 0,
            rightForearmAngle: Math.sin(t * Math.PI * 6) * Math.PI / 6,
            leftLegAngle: -Math.PI / 12,
            rightLegAngle: Math.PI / 12,
            leftKneeAngle: 0,
            rightKneeAngle: 0,
            expression: 'happy'
        };
    }
    
    getCelebratePose(t) {
        return {
            leftArmAngle: -Math.PI / 2 - Math.PI / 4,
            rightArmAngle: Math.PI / 2 + Math.PI / 4,
            leftForearmAngle: Math.sin(t * Math.PI * 8) * Math.PI / 6,
            rightForearmAngle: -Math.sin(t * Math.PI * 8) * Math.PI / 6,
            leftLegAngle: -Math.PI / 6,
            rightLegAngle: Math.PI / 6,
            leftKneeAngle: Math.sin(t * Math.PI * 4) * Math.PI / 12,
            rightKneeAngle: Math.sin(t * Math.PI * 4) * Math.PI / 12,
            expression: 'excited'
        };
    }
    
    getClapPose(t) {
        return {
            leftArmAngle: -Math.PI / 3,
            rightArmAngle: Math.PI / 3,
            leftForearmAngle: t < 0.5 ? -Math.PI / 3 : -Math.PI / 2,
            rightForearmAngle: t < 0.5 ? Math.PI / 3 : Math.PI / 2,
            leftLegAngle: -Math.PI / 12,
            rightLegAngle: Math.PI / 12,
            leftKneeAngle: 0,
            rightKneeAngle: 0,
            expression: 'happy'
        };
    }
    
    getDancePose(t) {
        return {
            leftArmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 3 - Math.PI / 4,
            rightArmAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 3 + Math.PI / 4,
            leftForearmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 4,
            rightForearmAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 4,
            leftLegAngle: Math.sin(t * Math.PI * 2) * Math.PI / 4,
            rightLegAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 4,
            leftKneeAngle: 0,
            rightKneeAngle: 0,
            expression: 'excited'
        };
    }
}

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterAnimator;
}
