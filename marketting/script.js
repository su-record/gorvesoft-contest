let currentSlide = 1;
const totalSlides = 9;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    
    // 범위 체크
    if (n > totalSlides) currentSlide = totalSlides;
    else if (n < 1) currentSlide = 1;
    else currentSlide = n;
    
    // 모든 슬라이드 숨기기
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 현재 슬라이드 표시
    if (slides[currentSlide - 1]) {
        slides[currentSlide - 1].classList.add('active');
    }
    
    // 인디케이터 업데이트
    document.getElementById('current').textContent = currentSlide;
    
    // 버튼 상태 업데이트
    document.getElementById('prevBtn').disabled = currentSlide === 1;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides;
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSlide > 1) changeSlide(-1);
    if (e.key === 'ArrowRight' && currentSlide < totalSlides) changeSlide(1);
});

// 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    showSlide(1);
});