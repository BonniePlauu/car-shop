document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get('id');

    if (!carId) {
        displayError('Автомобиль не найден');
        return;
    }

    fetch('cars.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const cars = parseCarData(data); // Используем parseCarData из utils.js
            const car = cars.find(car => car.id === carId);
            if (car) {
                displayCarDetails(car);
                displaySimilarCars(cars, car);
            } else {
                displayError('Автомобиль не найден');
            }
        })
        .catch(error => {
            console.error('Error loading car details:', error);
            displayError('Ошибка загрузки данных');
        });
});

function displayCarDetails(car) {
    const detailsContainer = document.getElementById('carDetails');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="car-details__content">
            <h2>${car.brand} ${car.model}, ${car.year} г. в ${car.city}</h2>
            <div class="car-details__layout">
                <div class="car-details__left">
                    <div class="car-details__image">
                        <img src="images/${car.image}" alt="${car.brand} ${car.model}" loading="lazy" onerror="this.src='images/placeholder.jpg';">
                    </div>
                    <div class="car-details__description">
                        <h3>Описание</h3>
                        <p>${car.description2 || car.description}</p>
                        <div class="car-details__seller">
                            <h4>Продавец</h4>
                            <p><strong>Имя:</strong> ${car.owner}</p>
                            <p><strong>Телефон:</strong> <a href="tel:${car.phone}">${car.phone}</a></p>
                        </div>
                    </div>
                </div>
                <div class="car-details__right">
                    <div class="car-details__price-container"><div class="car-details__price">${formatPrice(car.price)} $</div></div>
                    <div class="car-details__specs">
                        <h3>Технические характеристики</h3>
                        <ul>
                            <li><strong>Мощность:</strong> ${car.power} л.с.</li>
                            <li><strong>Тип двигателя:</strong> ${car.fuel}</li>
                            <li><strong>Объём двигателя:</strong> ${car.engine} л</li>
                            <li><strong>Коробка передач:</strong> ${car.transmission}</li>
                            <li><strong>Пробег:</strong> ${formatPrice(car.mileage)} км</li>
                            <li><strong>Привод:</strong> ${car.drive}</li>
                            <li><strong>Город:</strong> ${car.city}</li>
                        </ul>
                    </div>
                    <div class="similar-cars">
                        <h2>Похожие объявления</h2>
                        <div class="similar-cars-grid" id="similarCars"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displaySimilarCars(cars, currentCar) {
    const similarCarsContainer = document.getElementById('similarCars');
    if (!similarCarsContainer) return;

    const similarCars = cars.filter(car => car.brand === currentCar.brand && car.id !== currentCar.id);
    if (similarCars.length === 0) {
        similarCarsContainer.innerHTML = '<p class="no-results">Похожие автомобили не найдены</p>';
        return;
    }

    const displayedCars = similarCars.slice(0, 4);
    displayedCars.forEach(car => {
        similarCarsContainer.appendChild(createCarCard(car));
    });
}

function displayError(message) {
    const detailsContainer = document.getElementById('carDetails');
    if (detailsContainer) {
        detailsContainer.innerHTML = `<p class="error">${message}</p>`;
    }
}
