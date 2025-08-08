// EmailJS 초기화 - 실제 User ID로 교체 필요
// Grovesoft!0601
(function(){
    emailjs.init("1MPr3PeWlgn9wPAQm"); // 여기에 실제 EmailJS User ID 입력
})();

// 실시간 유효성 검사
const validateField = (field) => {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (value === '') {
        field.classList.add('error');
        field.classList.remove('success');
        if (errorElement) errorElement.classList.add('show');
        return false;
    } else {
        field.classList.remove('error');
        field.classList.add('success');
        if (errorElement) errorElement.classList.remove('show');
        return true;
    }
};

// 입력 필드 실시간 검사
const participant = document.getElementById('nickname');
const ideaTitle = document.getElementById('ideaTitle');
const ideaDescription = document.getElementById('ideaDescription');
const expectedEffect = document.getElementById('expectedEffect');

participant.addEventListener('blur', () => validateField(participant));
ideaTitle.addEventListener('blur', () => validateField(ideaTitle));
ideaDescription.addEventListener('blur', () => validateField(ideaDescription));
expectedEffect.addEventListener('blur', () => validateField(expectedEffect));

// 입력 시 에러 상태 제거
participant.addEventListener('input', () => {
    if (participant.value.trim() !== '') {
        participant.classList.remove('error');
        document.getElementById('nicknameError').classList.remove('show');
    }
});

ideaTitle.addEventListener('input', () => {
    if (ideaTitle.value.trim() !== '') {
        ideaTitle.classList.remove('error');
        document.getElementById('titleError').classList.remove('show');
    }
});

ideaDescription.addEventListener('input', () => {
    if (ideaDescription.value.trim() !== '') {
        ideaDescription.classList.remove('error');
        document.getElementById('descriptionError').classList.remove('show');
    }
});

expectedEffect.addEventListener('input', () => {
    if (expectedEffect.value.trim() !== '') {
        expectedEffect.classList.remove('error');
        document.getElementById('effectError').classList.remove('show');
    }
});

// 체크박스 검사
const agree1 = document.getElementById('agree1');
const agree2 = document.getElementById('agree2');
const checkboxError = document.getElementById('checkboxError');

const validateCheckboxes = () => {
    if (!agree1.checked || !agree2.checked) {
        checkboxError.classList.add('show');
        return false;
    } else {
        checkboxError.classList.remove('show');
        return true;
    }
};

agree1.addEventListener('change', () => {
    if (agree1.checked && agree2.checked) {
        checkboxError.classList.remove('show');
    }
});

agree2.addEventListener('change', () => {
    if (agree1.checked && agree2.checked) {
        checkboxError.classList.remove('show');
    }
});

// 파일 업로드 처리
const fileUpload = document.getElementById('fileUpload');
const fileInfo = document.getElementById('fileInfo');

fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        if (fileSize > 10) {
            alert('파일 크기는 10MB를 초과할 수 없습니다.');
            e.target.value = '';
            fileInfo.style.display = 'none';
            return;
        }
        fileInfo.innerHTML = `📎 ${file.name} (${fileSize}MB)`;
        fileInfo.style.display = 'block';
    } else {
        fileInfo.style.display = 'none';
    }
});

// 파일 링크 처리
const fileUrl = document.getElementById('fileUrl');

// 폼 제출 처리
const form = document.getElementById('contestForm');
const submitBtn = document.getElementById('submitBtn');
const overlay = document.getElementById('overlay');
const successMessage = document.getElementById('successMessage');

// 제출 기간 체크 함수
function checkDeadline(showAlert = false) {
    const startTime = new Date('2025-07-16T13:00:00');
    const deadline = new Date('2025-08-04T23:59:59');
    const now = new Date();
    
    // 시작 전인 경우
    if (now < startTime) {
        submitBtn.disabled = true;
        submitBtn.textContent = '2025년 7월 16일 13:00부터 제출 가능';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.style.background = '#94a3b8';
        
        // 기존 메시지 제거
        const existingMessage = submitBtn.parentElement.querySelector('.deadline-message, .not-started-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 제출 버튼 클릭 시에만 알럿 표시
        if (showAlert) {
            alert('아직 제출 기간이 시작되지 않았습니다.\n\n제출 시작: 2025년 7월 16일 13시 00분');
        }
        
        return false;
    }
    
    // 마감된 경우
    if (now > deadline) {
        submitBtn.disabled = true;
        submitBtn.textContent = '제출 마감';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.style.background = '#94a3b8';
        
        // 기존 메시지 제거
        const existingMessage = submitBtn.parentElement.querySelector('.deadline-message, .not-started-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 제출 버튼 클릭 시에만 알럿 표시
        if (showAlert) {
            alert('제출 기간이 종료되었습니다.\n\n제출 마감: 2025년 8월 4일 23시 59분 59초');
        }
        
        return false;
    }
    
    // 제출 가능한 기간
    return true;
}


// EmailJS를 이용한 이메일 발송
const sendEmailViaEmailJS = async () => {
    try {
        const templateParams = {
            participant: participant.value.trim(),
            idea_title: ideaTitle.value.trim(),
            idea_description: ideaDescription.value.trim(),
            expected_effect: expectedEffect.value.trim(),
            submission_time: new Date().toLocaleString('ko-KR'),
            file_url: fileUrl.value.trim(),
            to_email: 'grove.ai.contest@gmail.com'
        };
        
        // 파일이 있는 경우
        if (fileUpload.files[0]) {
            const file = fileUpload.files[0];
            
            // EmailJS는 base64 첨부를 지원하지 않으므로 파일 정보만 포함
            templateParams.attachment_info = `파일명: ${file.name}, 크기: ${(file.size / 1024).toFixed(2)}KB`;
            templateParams.has_attachment = 'YES';
        } else {
            templateParams.has_attachment = 'NO';
        }
        
        // EmailJS로 이메일 발송 - 실제 Service ID와 Template ID로 교체 필요
        const response = await emailjs.send(
            'service_6l1n616',     // 실제 Service ID로 교체
            'template_thm9gba',    // 실제 Template ID로 교체
            templateParams
        );
        
        console.log('이메일 발송 성공:', response);
        showSuccessMessage();
        
    } catch (error) {
        console.error('이메일 발송 실패:', error);
        throw error;
    }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 마감 시간 체크 (알럿 표시)
    if (!checkDeadline(true)) {
        return;
    }
    
    // 모든 필드 유효성 검사
    let isValid = true;
    
    // 필드 검사
    if (!validateField(participant)) isValid = false;
    if (!validateField(ideaTitle)) isValid = false;
    if (!validateField(ideaDescription)) isValid = false;
    if (!validateField(expectedEffect)) isValid = false;
    
    // 체크박스 검사
    if (!validateCheckboxes()) isValid = false;
    
    if (!isValid) {
        // 에러가 있는 첫 번째 요소로 스크롤
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // 제출 버튼 비활성화
    submitBtn.disabled = true;
    submitBtn.textContent = '제출 중...';
    
    try {
        // EmailJS로 이메일 발송
        await sendEmailViaEmailJS();
        
    } catch (error) {
        console.error('제출 오류:', error);
        alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.\n\n오류 내용: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 제출하기';
    }
});

function showSuccessMessage() {
    overlay.style.display = 'block';
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        // 폼 초기화
        form.reset();
        fileInfo.style.display = 'none';
        overlay.style.display = 'none';
        successMessage.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 제출하기';
        
        // success 클래스 제거
        document.querySelectorAll('.success').forEach(el => {
            el.classList.remove('success');
        });
    }, 3000);
}

// 랜덤 배경 요소 생성 함수
function createRandomBackground() {
    const container = document.getElementById('floatingContainer');
    
    // 기존 요소들 제거
    container.innerHTML = '';
    
    // 랜덤 개수 설정
    const logoCount = Math.floor(Math.random() * 5) + 3; // 3~7개 로고
    const starCount = Math.floor(Math.random() * 15) + 10; // 10~24개 별
    
    console.log(`🎲 랜덤 생성: 로고 ${logoCount}개, 별 ${starCount}개`);
    
    // 색상 배열
    const colors = [
        'rgba(59, 130, 246, 0.6)',
        'rgba(139, 92, 246, 0.6)', 
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 101, 101, 0.6)',
        'rgba(251, 191, 36, 0.6)',
        'rgba(168, 85, 247, 0.6)',
        'rgba(236, 72, 153, 0.6)'
    ];
    
    // GROVE SVG 템플릿
    const createLogoSVG = (color) => `
        <svg viewBox="0 0 500 60" xmlns="http://www.w3.org/2000/svg">
            <text x="250" y="45" font-family="Arial, sans-serif" font-size="48" font-weight="700" text-anchor="middle" fill="${color}" letter-spacing="15" opacity="0.8">GROVE</text>
        </svg>
    `;
    
    // 로고 생성
    for (let i = 0; i < logoCount; i++) {
        const logo = document.createElement('div');
        logo.className = 'floating-logo';
        
        // 랜덤 색상
        const color = colors[Math.floor(Math.random() * colors.length)];
        logo.innerHTML = createLogoSVG(color);
        
        // 랜덤 위치와 애니메이션
        const top = Math.random() * 90 + 5; // 5%~95%
        const left = Math.random() * 90 + 5; // 5%~95%
        const rotation = Math.random() * 60 - 30; // -30도~30도
        const animDuration = Math.random() * 15 + 20; // 20~35초
        const size = Math.random() * 40 + 80; // 80~120px
        
        logo.style.top = top + '%';
        logo.style.left = left + '%';
        logo.style.transform = `rotate(${rotation}deg)`;
        logo.style.width = size + 'px';
        logo.style.height = (size * 0.25) + 'px'; // 가로세로 비율 유지
        logo.style.animation = `logoFloat1 ${animDuration}s infinite ease-in-out`;
        logo.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(logo);
    }
    
    // 별 생성
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'node';
        
        // 랜덤 색상
        const color = colors[Math.floor(Math.random() * colors.length)];
        const bgColor = color.replace('0.6)', '0.8)');
        const shadowColor = color.replace('0.6)', '0.9)');
        
        // 랜덤 속성
        const top = Math.random() * 95 + 2; // 2%~97%
        const left = Math.random() * 95 + 2; // 2%~97%
        const size = Math.random() * 6 + 4; // 4~10px
        const animDuration = Math.random() * 10 + 6; // 6~16초
        const animDelay = Math.random() * 5; // 0~5초 딜레이
        
        star.style.top = top + '%';
        star.style.left = left + '%';
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.background = bgColor;
        star.style.boxShadow = `0 0 ${size * 2.5}px ${shadowColor}`;
        star.style.animation = `twinkle1 ${animDuration}s infinite ease-in-out`;
        star.style.animationDelay = animDelay + 's';
        
        container.appendChild(star);
    }
}

// 페이지 로드 시 랜덤 배경 생성
document.addEventListener('DOMContentLoaded', () => {
    createRandomBackground();
    checkDeadline();
});

// 개발자를 위한 함수 (콘솔에서 호출 가능)
window.regenerateBackground = createRandomBackground;