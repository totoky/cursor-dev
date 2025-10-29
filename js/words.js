/**
 * 단어 데이터베이스
 * 다양한 카테고리의 한국어 단어와 각 단어에 대한 제스처 애니메이션 정보
 */

const WordDatabase = {
    // 동물
    animals: [
        { word: '토끼', hint: '깡충깡충 뛰는 동물', gestures: ['hop', 'ear-wiggle', 'nose-twitch'] },
        { word: '코끼리', hint: '코가 긴 동물', gestures: ['trunk-swing', 'stomp', 'trumpet'] },
        { word: '원숭이', hint: '나무를 잘 타는 동물', gestures: ['scratch', 'jump', 'climb'] },
        { word: '펭귄', hint: '남극에 사는 새', gestures: ['waddle', 'flap', 'slide'] },
        { word: '강아지', hint: '충성스러운 반려동물', gestures: ['tail-wag', 'pant', 'sit'] },
        { word: '고양이', hint: '야옹하는 동물', gestures: ['stretch', 'paw', 'purr'] },
        { word: '사자', hint: '백수의 왕', gestures: ['roar', 'mane-shake', 'prowl'] },
        { word: '곰', hint: '겨울잠을 자는 동물', gestures: ['walk', 'scratch', 'stand'] },
        { word: '캥거루', hint: '주머니가 있는 동물', gestures: ['hop', 'box', 'pouch'] },
        { word: '물고기', hint: '물 속에 사는 생물', gestures: ['swim', 'float', 'bubble'] }
    ],
    
    // 스포츠
    sports: [
        { word: '축구', hint: '발로 공을 차는 운동', gestures: ['kick', 'run', 'celebrate'] },
        { word: '농구', hint: '골대에 공을 넣는 운동', gestures: ['dribble', 'shoot', 'jump'] },
        { word: '야구', hint: '배트로 공을 치는 운동', gestures: ['swing', 'throw', 'catch'] },
        { word: '수영', hint: '물에서 하는 운동', gestures: ['freestyle', 'dive', 'breathe'] },
        { word: '테니스', hint: '라켓으로 공을 치는 운동', gestures: ['serve', 'forehand', 'backhand'] },
        { word: '골프', hint: '클럽으로 공을 치는 운동', gestures: ['swing', 'putt', 'celebrate'] },
        { word: '배구', hint: '네트 너머로 공을 치는 운동', gestures: ['spike', 'block', 'dig'] },
        { word: '권투', hint: '주먹으로 싸우는 운동', gestures: ['jab', 'uppercut', 'dodge'] },
        { word: '태권도', hint: '한국 전통 무술', gestures: ['kick', 'punch', 'block'] },
        { word: '스키', hint: '눈 위를 타는 운동', gestures: ['glide', 'turn', 'jump'] }
    ],
    
    // 직업
    jobs: [
        { word: '의사', hint: '환자를 치료하는 사람', gestures: ['examine', 'write', 'stethoscope'] },
        { word: '선생님', hint: '학생을 가르치는 사람', gestures: ['write', 'point', 'explain'] },
        { word: '요리사', hint: '음식을 만드는 사람', gestures: ['chop', 'stir', 'taste'] },
        { word: '소방관', hint: '불을 끄는 사람', gestures: ['spray', 'climb', 'rescue'] },
        { word: '경찰', hint: '범죄를 막는 사람', gestures: ['direct', 'chase', 'arrest'] },
        { word: '가수', hint: '노래를 부르는 사람', gestures: ['sing', 'dance', 'bow'] },
        { word: '화가', hint: '그림을 그리는 사람', gestures: ['paint', 'brush', 'observe'] },
        { word: '조종사', hint: '비행기를 운전하는 사람', gestures: ['steer', 'check', 'wave'] },
        { word: '프로그래머', hint: '코드를 작성하는 사람', gestures: ['type', 'think', 'debug'] },
        { word: '건축가', hint: '건물을 설계하는 사람', gestures: ['draw', 'measure', 'plan'] }
    ],
    
    // 감정/행동
    emotions: [
        { word: '행복', hint: '기분이 좋은 상태', gestures: ['smile', 'jump', 'clap'] },
        { word: '슬픔', hint: '눈물이 나는 상태', gestures: ['cry', 'wipe', 'sigh'] },
        { word: '화남', hint: '짜증나는 상태', gestures: ['stomp', 'cross-arms', 'frown'] },
        { word: '놀람', hint: '갑자기 깜짝 놀란 상태', gestures: ['jump', 'gasp', 'wide-eyes'] },
        { word: '피곤', hint: '잠이 오는 상태', gestures: ['yawn', 'stretch', 'rub-eyes'] },
        { word: '춤', hint: '음악에 맞춰 몸을 움직이기', gestures: ['dance', 'spin', 'groove'] },
        { word: '박수', hint: '손뼉을 치기', gestures: ['clap', 'cheer', 'celebrate'] },
        { word: '달리기', hint: '빠르게 이동하기', gestures: ['run', 'sprint', 'pant'] },
        { word: '점프', hint: '높이 뛰어오르기', gestures: ['jump', 'land', 'repeat'] },
        { word: '생각', hint: '머리를 굴리기', gestures: ['think', 'ponder', 'hmm'] }
    ],
    
    // 음식
    food: [
        { word: '피자', hint: '이탈리아 음식', gestures: ['slice', 'eat', 'stretch'] },
        { word: '햄버거', hint: '패티가 들어간 음식', gestures: ['stack', 'bite', 'hold'] },
        { word: '라면', hint: '끓여먹는 면 요리', gestures: ['slurp', 'blow', 'chopsticks'] },
        { word: '치킨', hint: '튀긴 닭고기', gestures: ['bite', 'lick', 'flap'] },
        { word: '김밥', hint: '김으로 싼 한국 음식', gestures: ['roll', 'cut', 'eat'] },
        { word: '아이스크림', hint: '차가운 디저트', gestures: ['lick', 'cold', 'melt'] },
        { word: '스파게티', hint: '긴 면 요리', gestures: ['twirl', 'slurp', 'sauce'] },
        { word: '스테이크', hint: '고기를 구운 요리', gestures: ['cut', 'chew', 'grill'] },
        { word: '초밥', hint: '일본 음식', gestures: ['roll', 'dip', 'eat'] },
        { word: '도넛', hint: '구멍 뚫린 빵', gestures: ['dunk', 'bite', 'round'] }
    ],
    
    // 모든 카테고리를 합친 배열 반환
    getAllWords() {
        return [
            ...this.animals,
            ...this.sports,
            ...this.jobs,
            ...this.emotions,
            ...this.food
        ];
    },
    
    // 랜덤 단어 선택
    getRandomWord() {
        const allWords = this.getAllWords();
        const randomIndex = Math.floor(Math.random() * allWords.length);
        return allWords[randomIndex];
    },
    
    // 특정 카테고리에서 랜덤 단어 선택
    getRandomWordFromCategory(category) {
        if (!this[category] || !Array.isArray(this[category])) {
            return this.getRandomWord();
        }
        const words = this[category];
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    },
    
    // 카테고리 목록 반환
    getCategories() {
        return ['animals', 'sports', 'jobs', 'emotions', 'food'];
    }
};

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordDatabase;
}
