document.addEventListener("DOMContentLoaded", function() {
    const pages = document.querySelectorAll('.form-page');
    let currentPage = 0;

    pages[currentPage].classList.add('active');

    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', () => {
            pages[currentPage].classList.remove('active');
            currentPage++;
            pages[currentPage].classList.add('active');
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', () => {
            pages[currentPage].classList.remove('active');
            currentPage--;
            pages[currentPage].classList.add('active');
        });
    });
});