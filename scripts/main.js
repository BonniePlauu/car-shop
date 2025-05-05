// Загрузка футера
fetch('footer.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = data;
        } else {
            console.error('Footer container not found');
        }
    })
    .catch(error => console.error('Error loading footer:', error));

// Инициализация бургер-меню
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    
    if (burger && nav) {
        burger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Загрузка и отображение рекомендуемых автомобилей на главной
    if (document.getElementById('featuredCars')) {
        fetch('cars.xml')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                const cars = parseCarData(data);
                initBrandModelFilters(cars, 'brand', 'model');
                displayFeaturedCars(cars);
            })
            .catch(error => console.error('Error loading cars:', error));
    }
});

function displayFeaturedCars(cars) {
    const featuredContainer = document.getElementById('featuredCars');
    if (!featuredContainer) return;

    const shuffled = [...cars].sort(() => 0.5 - Math.random());
    const featuredCars = shuffled.slice(0, 6);
    
    featuredCars.forEach(car => {
        featuredContainer.appendChild(createCarCard(car));
    });
}