document.addEventListener('DOMContentLoaded', function() {
    let allCars = []; // Храним все автомобили для последующей фильтрации и сортировки

    // Загрузка и отображение автомобилей
    fetch('cars.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            allCars = parseCarData(data);
            displayAllCars(allCars);
            initCatalogFilters(allCars);
            applyInitialFilters(allCars);
        })
        .catch(error => console.error('Error loading cars:', error));
});

function displayAllCars(cars) {
    const resultsContainer = document.getElementById('catalogResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (cars.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">Автомобили не найдены</p>';
        return;
    }
    
    cars.forEach(car => {
        resultsContainer.appendChild(createCarCard(car));
    });
}

function initCatalogFilters(cars) {
    const filterForm = document.getElementById('catalogFilter');
    const sortSelect = document.getElementById('sortOrder');
    
    if (filterForm) {
        initBrandModelFilters(cars, 'catalogBrand', 'catalogModel');
        
        // Применение фильтров
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters(cars);
        });
    }

    // Обновление результатов при изменении сортировки
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters(cars);
        });
    }
}

function applyInitialFilters(cars) {
    const params = new URLSearchParams(window.location.search);
    let filteredCars = [...cars];

    if (params.has('brand')) {
        filteredCars = filteredCars.filter(car => car.brand === params.get('brand'));
        document.getElementById('catalogBrand').value = params.get('brand');
        updateModels(cars, params.get('brand'));
    }

    if (params.has('model')) {
        filteredCars = filteredCars.filter(car => car.model === params.get('model'));
        document.getElementById('catalogModel').value = params.get('model');
    }

    if (params.has('minPrice')) {
        filteredCars = filteredCars.filter(car => parseInt(car.price) >= parseInt(params.get('minPrice')));
        document.getElementById('catalogMinPrice').value = params.get('minPrice');
    }

    if (params.has('maxPrice')) {
        filteredCars = filteredCars.filter(car => parseInt(car.price) <= parseInt(params.get('maxPrice')));
        document.getElementById('catalogMaxPrice').value = params.get('maxPrice');
    }

    if (params.has('minYear')) {
        filteredCars = filteredCars.filter(car => parseInt(car.year) >= parseInt(params.get('minYear')));
        document.getElementById('catalogMinYear').value = params.get('minYear');
    }

    if (params.has('maxYear')) {
        const maxYear = parseInt(params.get('maxYear'));
        if (maxYear <= 2025) {
            filteredCars = filteredCars.filter(car => parseInt(car.year) <= maxYear);
            document.getElementById('catalogMaxYear').value = params.get('maxYear');
        }
    }

    // Применение сортировки, если параметр присутствует
    if (params.has('sort')) {
        document.getElementById('sortOrder').value = params.get('sort');
        filteredCars = sortCars(filteredCars, params.get('sort'));
    }

    displayAllCars(filteredCars);
}

function updateModels(cars, brand) {
    const modelSelect = document.getElementById('catalogModel');
    modelSelect.innerHTML = '<option value="">Все модели</option>';
    modelSelect.disabled = !brand;
    
    if (brand) {
        const models = [...new Set(cars
            .filter(car => car.brand === brand)
            .map(car => car.model))];
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

function applyFilters(cars) {
    const formData = new FormData(document.getElementById('catalogFilter'));
    const filters = Object.fromEntries(formData.entries());
    const sortOrder = document.getElementById('sortOrder')?.value || '';
    
    let filteredCars = [...cars];
    
    if (filters.brand) {
        filteredCars = filteredCars.filter(car => car.brand === filters.brand);
    }
    
    if (filters.model) {
        filteredCars = filteredCars.filter(car => car.model === filters.model);
    }
    
    if (filters.minPrice) {
        filteredCars = filteredCars.filter(car => parseInt(car.price) >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
        filteredCars = filteredCars.filter(car => parseInt(car.price) <= parseInt(filters.maxPrice));
    }
    
    if (filters.minYear) {
        filteredCars = filteredCars.filter(car => parseInt(car.year) >= parseInt(filters.minYear));
    }
    
    if (filters.maxYear) {
        const maxYear = parseInt(filters.maxYear);
        if (maxYear <= 2025) {
            filteredCars = filteredCars.filter(car => parseInt(car.year) <= maxYear);
        }
    }
    
    // Применение сортировки
    if (sortOrder) {
        filteredCars = sortCars(filteredCars, sortOrder);
    }
    
    displayAllCars(filteredCars);
}

function sortCars(cars, sortOrder) {
    const sortedCars = [...cars];
    
    switch (sortOrder) {
        case 'price-asc':
            return sortedCars.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        case 'price-desc':
            return sortedCars.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        case 'year-asc':
            return sortedCars.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        case 'year-desc':
            return sortedCars.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        case 'alphabetical':
            return sortedCars.sort((a, b) => {
                const nameA = `${a.brand} ${a.model}`.toLowerCase();
                const nameB = `${b.brand} ${b.model}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        default:
            return sortedCars; // Без сортировки
    }
}