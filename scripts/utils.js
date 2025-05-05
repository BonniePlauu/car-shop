function parseCarData(xml) {
    const cars = [];
    const carNodes = xml.querySelectorAll('car');
    
    carNodes.forEach(car => {
        cars.push({
            id: car.getAttribute('id'),
            brand: car.querySelector('brand').textContent,
            model: car.querySelector('model').textContent,
            year: car.querySelector('year').textContent,
            price: car.querySelector('price').textContent,
            mileage: car.querySelector('mileage').textContent,
            transmission: car.querySelector('transmission').textContent,
            fuel: car.querySelector('fuel').textContent,
            engine: car.querySelector('engine').textContent,
            city: car.querySelector('city').textContent,
            image: car.querySelector('image').textContent,
            description: car.querySelector('description')?.textContent || '',
            description2: car.querySelector('description2')?.textContent || '',
            owner: car.querySelector('owner')?.textContent || 'Unknown',
            phone: car.querySelector('phone')?.textContent || 'N/A',
            power: car.querySelector('power')?.textContent || 'N/A',
            drive: car.querySelector('drive')?.textContent || 'N/A'
        });
    });
    
    return cars;
}

function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
    card.innerHTML = `
        <a href="car-details.html?id=${car.id}" class="car-card__link">
            <div class="car-card__image">
                <img src="images/${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
            </div>
            <div class="car-card__info">
                <h3>${car.brand} ${car.model}</h3>
                <div class="price">${formatPrice(car.price)} $</div>
                <div class="details">
                    <span>${car.year} г.</span>
                    <span>${car.mileage} км</span>
                    <span>${car.engine} л</span>
                </div>
                <div class="description">${car.description}</div>
            </div>
        </a>
    `;
    
    return card;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function initBrandModelFilters(cars, brandSelectId, modelSelectId) {
    const brandSelect = document.getElementById(brandSelectId);
    const modelSelect = document.getElementById(modelSelectId);
    
    if (!brandSelect || !modelSelect) return;
    
    // Заполнение марок
    const brands = [...new Set(cars.map(car => car.brand))];
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
    
    // Обновление моделей при выборе марки
    brandSelect.addEventListener('change', function() {
        modelSelect.innerHTML = '<option value="">Все модели</option>';
        modelSelect.disabled = !this.value;
        
        if (this.value) {
            const models = [...new Set(cars
                .filter(car => car.brand === this.value)
                .map(car => car.model))];
            
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    });
}