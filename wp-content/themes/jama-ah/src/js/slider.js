document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    const slides = sliderContainer.querySelectorAll('.slide-item');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        // Hide current
        slides[currentSlide].classList.remove('block');
        slides[currentSlide].classList.add('hidden');

        // Calculate next
        currentSlide = (currentSlide + 1) % slides.length;

        // Show next
        slides[currentSlide].classList.remove('hidden');
        slides[currentSlide].classList.add('block');
    }

    setInterval(nextSlide, slideInterval);
});




