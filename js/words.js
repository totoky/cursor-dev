/**
 * 단어 데이터베이스
 * 다양한 카테고리의 한국어 단어와 각 단어에 대한 제스처 애니메이션 정보
 */

const WordDatabase = {
    // 동물 (구체적인 명사)
    animals: [
        { word: '토끼', hint: '긴 귀를 가지고 깡충깡충 뛰는 동물', gestures: ['hop', 'ear-wiggle', 'nose-twitch'] },
        { word: '코끼리', hint: '긴 코와 큰 귀를 가진 회색 동물', gestures: ['trunk-swing', 'stomp', 'trumpet'] },
        { word: '원숭이', hint: '긴 팔과 꼬리로 나무를 잘 타는 동물', gestures: ['scratch', 'jump', 'climb'] },
        { word: '펭귄', hint: '턱시도처럼 흑백으로 뒤뚱뒤뚱 걷는 남극 새', gestures: ['waddle', 'flap', 'slide'] },
        { word: '강아지', hint: '꼬리를 흔들며 짖는 귀여운 반려동물', gestures: ['tail-wag', 'pant', 'sit'] },
        { word: '고양이', hint: '수염이 길고 야옹하며 우는 동물', gestures: ['stretch', 'paw', 'purr'] },
        { word: '사자', hint: '갈기를 가진 정글의 왕 동물', gestures: ['roar', 'mane-shake', 'prowl'] },
        { word: '곰', hint: '겨울잠을 자고 꿀을 좋아하는 큰 동물', gestures: ['walk', 'scratch', 'stand'] },
        { word: '캥거루', hint: '뱃속 주머니에 새끼를 넣고 깡충 뛰는 동물', gestures: ['hop', 'box', 'pouch'] },
        { word: '물고기', hint: '지느러미로 헤엄치며 물속에 사는 생물', gestures: ['swim', 'float', 'bubble'] }
    ],
    
    // 스포츠 (구체적인 명사)
    sports: [
        { word: '축구공', hint: '발로 차는 흑백 무늬의 둥근 공', gestures: ['kick', 'dribble', 'roll'] },
        { word: '농구공', hint: '바구니에 넣는 주황색 큰 공', gestures: ['dribble', 'shoot', 'bounce'] },
        { word: '야구', hint: '배트로 공을 치고 베이스를 도는 운동', gestures: ['swing', 'throw', 'catch'] },
        { word: '수영장', hint: '물을 가득 채운 큰 네모난 곳', gestures: ['swim', 'dive', 'splash'] },
        { word: '테니스', hint: '라켓으로 노란 공을 주고받는 운동', gestures: ['serve', 'forehand', 'backhand'] },
        { word: '골프', hint: '작은 흰 공을 클럽으로 쳐서 구멍에 넣는 운동', gestures: ['swing', 'putt', 'celebrate'] },
        { word: '배구', hint: '네트 너머로 양팀이 공을 주고받는 운동', gestures: ['spike', 'block', 'set'] },
        { word: '권투', hint: '글러브를 끼고 주먹으로 싸우는 운동', gestures: ['jab', 'uppercut', 'dodge'] },
        { word: '태권도', hint: '흰색 도복을 입고 하는 한국 무술', gestures: ['kick', 'punch', 'bow'] },
        { word: '스키', hint: '긴 판을 신고 눈 위를 미끄러지는 운동', gestures: ['glide', 'turn', 'poles'] }
    ],
    
    // 직업
    jobs: [
        { word: '의사', hint: '청진기로 환자를 진찰하는 병원 선생님', gestures: ['examine', 'stethoscope', 'write'] },
        { word: '선생님', hint: '칠판에 글씨를 쓰고 학생들을 가르치는 사람', gestures: ['write', 'point', 'explain'] },
        { word: '요리사', hint: '하얀 모자를 쓰고 맛있는 음식을 만드는 사람', gestures: ['chop', 'stir', 'taste'] },
        { word: '소방관', hint: '빨간 소방차를 타고 불을 끄는 사람', gestures: ['spray', 'climb', 'rescue'] },
        { word: '경찰', hint: '교통을 정리하고 나쁜 사람을 잡는 사람', gestures: ['direct', 'chase', 'arrest'] },
        { word: '가수', hint: '무대에서 마이크를 잡고 노래하는 사람', gestures: ['sing', 'dance', 'bow'] },
        { word: '화가', hint: '붓과 물감으로 아름다운 그림을 그리는 사람', gestures: ['paint', 'brush', 'observe'] },
        { word: '조종사', hint: '비행기 조종간을 잡고 하늘을 나는 사람', gestures: ['steer', 'check', 'salute'] },
        { word: '우주인', hint: '우주복을 입고 우주를 탐험하는 사람', gestures: ['float', 'wave', 'helmet'] },
        { word: '농부', hint: '논밭에서 곡식과 채소를 기르는 사람', gestures: ['plant', 'harvest', 'water'] }
    ],
    
    // 물건/사물 (구체적인 명사)
    objects: [
        { word: '자동차', hint: '네 개의 바퀴로 굴러가는 탈것', gestures: ['steer', 'vroom', 'honk'] },
        { word: '비행기', hint: '하늘을 나는 큰 탈것', gestures: ['fly', 'wings', 'takeoff'] },
        { word: '기차', hint: '철로 위를 달리는 긴 탈것', gestures: ['choo-choo', 'whistle', 'move'] },
        { word: '로봇', hint: '기계로 만든 사람 모양의 기계', gestures: ['robot-walk', 'mechanical', 'beep'] },
        { word: '텔레비전', hint: '영상과 소리가 나오는 네모난 화면', gestures: ['watch', 'rectangle', 'channel'] },
        { word: '컴퓨터', hint: '키보드와 마우스로 조작하는 전자기기', gestures: ['type', 'click', 'screen'] },
        { word: '시계', hint: '시간을 알려주는 동그란 물건', gestures: ['tick-tock', 'round', 'point'] },
        { word: '카메라', hint: '사진을 찍는 기계', gestures: ['click', 'pose', 'flash'] },
        { word: '우산', hint: '비올 때 쓰는 접었다 폈다 하는 물건', gestures: ['open', 'hold', 'rain'] },
        { word: '공', hint: '동그랗게 생긴 던지고 차는 물건', gestures: ['throw', 'catch', 'bounce'] }
    ],
    
    // 음식 (구체적인 명사)
    food: [
        { word: '피자', hint: '동그란 모양에 치즈가 늘어나는 이탈리아 음식', gestures: ['slice', 'eat', 'stretch'] },
        { word: '햄버거', hint: '빵 사이에 고기 패티가 들어간 음식', gestures: ['stack', 'bite', 'hold'] },
        { word: '라면', hint: '뜨거운 물에 끓여먹는 꼬불꼬불한 면', gestures: ['slurp', 'blow', 'chopsticks'] },
        { word: '치킨', hint: '바삭하게 튀긴 황금색 닭고기', gestures: ['bite', 'lick', 'drumstick'] },
        { word: '김밥', hint: '검은 김으로 밥과 재료를 말아 만든 한국 음식', gestures: ['roll', 'cut', 'eat'] },
        { word: '아이스크림', hint: '콘에 담긴 차갑고 달콤한 얼린 디저트', gestures: ['lick', 'cold', 'melt'] },
        { word: '케이크', hint: '생일에 먹는 초가 꽂힌 달콤한 빵', gestures: ['blow', 'cut', 'celebrate'] },
        { word: '사과', hint: '빨갛고 동그란 달콤한 과일', gestures: ['bite', 'crunch', 'round'] },
        { word: '바나나', hint: '노란색 긴 초승달 모양 과일', gestures: ['peel', 'eat', 'curved'] },
        { word: '빵', hint: '밀가루로 만든 부드러운 먹거리', gestures: ['tear', 'eat', 'smell'] }
    ],
    
    // 모든 카테고리를 합친 배열 반환
    getAllWords() {
        return [
            ...this.animals,
            ...this.sports,
            ...this.jobs,
            ...this.objects,
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
        return ['animals', 'sports', 'jobs', 'objects', 'food'];
    }
};

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordDatabase;
}
