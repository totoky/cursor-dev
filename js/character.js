/**
 * 캐릭터 애니메이션 클래스
 * Canvas를 이용하여 라이센스 프리 스틱맨 캐릭터를 그리고 애니메이션 처리
 */

class CharacterAnimator {
    constructor(canvasId) {
        console.log('[CharacterAnimator] 초기화 시작, canvasId:', canvasId);
        this.canvas = document.getElementById(canvasId);
        
        if (!this.canvas) {
            console.error('[CharacterAnimator] 캔버스를 찾을 수 없습니다:', canvasId);
            return;
        }
        
        console.log('[CharacterAnimator] 캔버스 찾음:', this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        console.log('[CharacterAnimator] 캔버스 크기:', this.width, 'x', this.height);
        
        // 캐릭터 기본 설정
        this.character = {
            x: this.width / 2,
            y: this.height / 2,
            scale: 1,
            rotation: 0,
            color: '#667eea'
        };
        
        // 애니메이션 상태
        this.currentGesture = null;
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.isAnimating = false;
        
        // 초기 idle 애니메이션 시작
        console.log('[CharacterAnimator] idle 애니메이션 시작 호출');
        this.startIdleAnimation();
    }
    
    // 캔버스 초기화
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    // 스틱맨 그리기
    drawStickman(x, y, scale, pose) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = this.character.color;
        ctx.fillStyle = this.character.color;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 머리
        ctx.beginPath();
        ctx.arc(0, -60, 30, 0, Math.PI * 2);
        ctx.fillStyle = this.character.color;
        ctx.fill();
        ctx.stroke();
        
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
        console.log('[CharacterAnimator] startIdleAnimation 호출됨');
        if (!this.canvas || !this.ctx) {
            console.error('[CharacterAnimator] 캔버스가 초기화되지 않음');
            return;
        }
        this.currentGesture = null;
        this.animationFrame = 0;
        this.isAnimating = true;
        console.log('[CharacterAnimator] animate() 호출 시작');
        this.animate();
    }
    
    // 제스처 애니메이션 시작
    startGesture(gestures) {
        this.currentGesture = gestures;
        this.animationFrame = 0;
        this.isAnimating = true;
        if (!this.animationRequestId) {
            this.animate();
        }
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
    
    // 애니메이션 루프
    animate() {
        if (this.animationFrame === 0) {
            console.log('[CharacterAnimator] 첫 번째 animate() 호출, isAnimating:', this.isAnimating);
        }
        
        if (!this.isAnimating) {
            console.log('[CharacterAnimator] 애니메이션 중지됨');
            this.animationRequestId = null;
            return;
        }
        
        if (!this.ctx) {
            console.error('[CharacterAnimator] ctx가 없음, 애니메이션 중지');
            return;
        }
        
        this.clear();
        
        if (this.currentGesture && this.currentGesture.length > 0) {
            const gestureName = this.currentGesture[Math.floor(this.animationFrame / 60) % this.currentGesture.length];
            const pose = this.getGesturePose(gestureName, this.animationFrame % 60);
            this.drawStickman(this.character.x, this.character.y, this.character.scale, pose);
            
            if (this.animationFrame % 60 === 0) {
                console.log('[CharacterAnimator] 제스처 애니메이션:', gestureName);
            }
        } else {
            const pose = this.getIdlePose(this.animationFrame);
            this.drawStickman(this.character.x, this.character.y, this.character.scale, pose);
            
            if (this.animationFrame % 120 === 0) {
                console.log('[CharacterAnimator] idle 애니메이션 프레임:', this.animationFrame);
            }
        }
        
        this.animationFrame++;
        this.animationRequestId = requestAnimationFrame(() => this.animate());
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
    
    // 제스처별 포즈 반환
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
            'trunk-swing': {
                leftArmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 3,
                rightArmAngle: Math.sin(t * Math.PI * 2) * Math.PI / 3,
                leftForearmAngle: 0,
                rightForearmAngle: 0,
                leftLegAngle: -Math.PI / 8,
                rightLegAngle: Math.PI / 8,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
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
            
            // 감정 제스처
            'clap': {
                leftArmAngle: -Math.PI / 3,
                rightArmAngle: Math.PI / 3,
                leftForearmAngle: t < 0.5 ? -Math.PI / 3 : -Math.PI / 2,
                rightForearmAngle: t < 0.5 ? Math.PI / 3 : Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'happy'
            },
            'dance': {
                leftArmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 3 - Math.PI / 4,
                rightArmAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 3 + Math.PI / 4,
                leftForearmAngle: Math.sin(t * Math.PI * 4) * Math.PI / 4,
                rightForearmAngle: -Math.sin(t * Math.PI * 4) * Math.PI / 4,
                leftLegAngle: Math.sin(t * Math.PI * 2) * Math.PI / 4,
                rightLegAngle: -Math.sin(t * Math.PI * 2) * Math.PI / 4,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'excited'
            },
            'think': {
                leftArmAngle: -Math.PI / 4,
                rightArmAngle: Math.PI / 2,
                leftForearmAngle: 0,
                rightForearmAngle: -Math.PI / 2,
                leftLegAngle: -Math.PI / 12,
                rightLegAngle: Math.PI / 12,
                leftKneeAngle: 0,
                rightKneeAngle: 0,
                expression: 'normal'
            },
            
            // 기타 제스처 - 기본 동작으로 폴백
            'run': this.getRunPose(t),
            'wave': this.getWavePose(t),
            'celebrate': this.getCelebratePose(t)
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
}

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterAnimator;
}
