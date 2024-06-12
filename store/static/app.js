function createFilterElement(filterName, filterType, filterValues = []) {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'form-group';
    filterContainer.classList.add("mt-2");

    const filterLabel = document.createElement('label');
    filterLabel.classList.add("form-check-label");
    filterLabel.textContent = filterName;
    filterContainer.appendChild(filterLabel);

    switch (filterType) {
        case 0:
            // Нет сортировки (ничего не добавляем)
            break;
        case 1:
            // Сортировка по возрастанию или убыванию
            const selectField = document.createElement('select');
            selectField.classList.add('form-select'); // Добавляем класс form-select для Bootstrap
            selectField.classList.add('mt-2');
            selectField.name = filterName;
            ['Не задано', 'Сортировать по возрастанию', 'Сортировать по убыванию'].forEach(value => {
                const option = document.createElement('option');
                option.value = value.toLowerCase();
                option.textContent = value;
                selectField.appendChild(option);
            });
            filterContainer.appendChild(selectField);
            break;
        case 2:
            filterContainer.classList.add("d-flex");
            filterContainer.classList.add("align-items-center");
            // Поле для галочки (True или False)
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('form-check-input'); // Добавляем класс form-check-input для Bootstrap
            checkbox.classList.add('ms-2');
            checkbox.name = filterName;
            filterContainer.appendChild(checkbox);
            break;
        case 3:
            // Поиск по названию
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('form-control'); // Добавляем класс form-control для Bootstrap
            input.classList.add('mt-2');
            input.name = filterName;
            filterContainer.appendChild(input);
            break;
        case 4:
            // Выбор значения из списка
            const selectFieldVals = document.createElement('select');
            selectFieldVals.classList.add('form-select'); // Добавляем класс form-select для Bootstrap
            selectFieldVals.classList.add('mt-2');
            selectFieldVals.name = filterName;
            ["Не задано", ...filterValues].forEach(value => {
                const option = document.createElement('option');
                option.value = value.toLowerCase();
                option.textContent = value;
                selectFieldVals.appendChild(option);
            });
            filterContainer.appendChild(selectFieldVals);
            break;
        default:
            console.warn('Неизвестный тип фильтра: ' + filterType);
    }

    return filterContainer;
}

async function initializeFilters(filters, products) {
    const filtersContainer = document.getElementById('filtersContainer');

    for (const [filterName, filterData] of Object.entries(filters)) {
        const filterType = filterData[0];
        const filterValues = filterData.slice(1, filterData.length);
        const filterElement = createFilterElement(filterName, filterType, filterValues);
        filtersContainer.appendChild(filterElement);
    }

    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        applyFilters(filters, products);
    });


    displayProducts(products);
}

function filterPrice(product) {
    let priceMin = document.getElementById("price_min").value;
    let priceMax = document.getElementById("price_max").value;

    if (!priceMin) {
        priceMin = 0;
    }

    if (!priceMax) {
        priceMax = Infinity;
    }
    return priceMin <= product.price && product.price <= priceMax;
}

function filterName(product) {
    let filterName = document.getElementById("search_input").value;
    return product.product_name.toLowerCase().includes(filterName.toLowerCase());
}

async function applyFilters(filters, products) {
    const formData = new FormData(document.getElementById('filterForm'));
    let filteredProducts = products;

    filteredProducts = filteredProducts.filter(filterPrice);
    filteredProducts = filteredProducts.filter(filterName);

    const sortOption = formData.get('sort_by_price');
    if (sortOption === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    for (const [filterName, filterData] of Object.entries(filters)) {
        const filterType = filterData[0];
        const filterValue = formData.get(filterName);

        try {
            if (filterValue) {
                switch (filterType) {
                    case 1:
                        if (filterValue === 'сортировать по возрастанию') {
                            filteredProducts.sort((a, b) => a.specifications[filterName] - b.specifications[filterName]);
                        } else if (filterValue === 'сортировать по убыванию') {
                            filteredProducts.sort((a, b) => b.specifications[filterName] - a.specifications[filterName]);
                        }
                        break;
                    case 2:
                        filteredProducts = filteredProducts.filter(product => product.specifications[filterName] === Boolean(filterValue));
                        break;
                    case 3:
                        filteredProducts = filteredProducts.filter(product => product.specifications[filterName].toLowerCase().includes(filterValue.toLowerCase()));
                        break;
                    case 4:
                        if (filterValue != 'не задано') {
                            filteredProducts = filteredProducts.filter(product => product.specifications[filterName].toLowerCase().includes(filterValue.toLowerCase()));
                            break;
                        }
                }
            }
        } catch(e) {
            console.log("Произошла ошибка, возможно для некоторых товаров не указаны все фильтры.")
        }
    }

    displayProducts(filteredProducts);
}

function parseValue(value) {
    if (value === true) {
        return 'Да';
    } else if (value === false) {
        return 'Нет';
    } else {
        return value;
    }
}

async function loadBasket() {
    try {
        const response = await fetch('/get_basket/');
        const data = await response.json();
        return data.products_in_basket || [];
    } catch (error) {
        console.error('Error loading basket:', error);
        return []; // Вернуть пустой массив в случае ошибки
    }
}

async function addToBasket(productId) {
    try {
        const response = await fetch(`/product/add/${productId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Товар добавлен в корзину');
            document.querySelector(`#btn-${productId}`).textContent = 'Убрать из корзины';
            document.querySelector(`#btn-${productId}`).onclick = () => removeFromBasket(productId);
            document.querySelector(`#btn-${productId}`).classList.remove('btn-primary');
            document.querySelector(`#btn-${productId}`).classList.add('btn-danger');
        }
    } catch (error) {
        console.error('Error adding to basket:', error);
    }
}

async function removeFromBasket(productId) {
    try {
        const response = await fetch(`/product/delete/${productId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Товар убран из корзины');
            document.querySelector(`#btn-${productId}`).textContent = 'Добавить в корзину';
            document.querySelector(`#btn-${productId}`).onclick = () => addToBasket(productId);
            document.querySelector(`#btn-${productId}`).classList.remove('btn-danger');
            document.querySelector(`#btn-${productId}`).classList.add('btn-primary');
        }
    } catch (error) {
        console.error('Error removing from basket:', error);
    }
}

async function displayProducts(products) {
    const authDataDiv = document.getElementById('authData');
    const isAuthenticated = authDataDiv.dataset.isAuthenticated === 'True';
    let productsInBasket = [];

    if (isAuthenticated) {
        productsInBasket = await loadBasket();
    }

    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const inBasket = isAuthenticated && productsInBasket.some(item => item.product_id === product.product_id);
        const buttonText = inBasket ? 'Убрать из корзины' : 'Добавить в корзину';
        const buttonAction = inBasket ? `removeFromBasket(${product.product_id})` : `addToBasket(${product.product_id})`;
        const buttonClass = inBasket ? 'btn-danger' : 'btn-primary';
        const buttonHTML = isAuthenticated ? `<button class="btn ${buttonClass} mt-3" id="btn-${product.product_id}" onclick="${buttonAction}">${buttonText}</button>` : '';

        const productCard = `
            <div class="col-md-4 d-flex align-items-stretch">
                <div class="card mb-4" style="width: 18rem;">
                    <div class="card-img-top" style="height: 200px; overflow: hidden;">
                        <img src="${product.product_image}" class="w-100 h-100" style="object-fit: cover;" alt="${product.product_name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.product_name}</h5>
                        <p class="card-text">Цена: ${product.price}Р</p>
                        <ul class="list-group list-group-flush">
                            ${Object.entries(product.specifications).map(([key, value]) => `<li class="list-group-item"><strong>${key}:</strong> ${parseValue(value)}</li>`).join('')}
                        </ul>
                        ${buttonHTML}
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
