// Mock data - replace with actual API calls to your Spring Boot backend
const mockProducts = [
    { id: 1, name: 'Mąka Tortowa Premium', category: 'cakes', price: 45.99, unit: 'kg', description: 'Idealna do ciast biszkoptowych', stock: 150 },
    { id: 2, name: 'Mieszanka Brownie', category: 'cakes', price: 38.50, unit: 'kg', description: 'Gotowa mieszanka do brownie', stock: 80 },
    { id: 3, name: 'Mąka Uniwersalna', category: 'cakes', price: 32.00, unit: 'kg', description: 'Do wszystkich rodzajów ciast', stock: 200 },
    { id: 4, name: 'Mieszanka Ciasteczkowa', category: 'cookies', price: 42.00, unit: 'kg', description: 'Kruche ciasteczka maślane', stock: 120 },
    { id: 5, name: 'Mąka Chlebowa', category: 'bread', price: 28.00, unit: 'kg', description: 'Do pieczywa i bułek', stock: 180 },
    { id: 6, name: 'Mieszanka Sernik Royal', category: 'cakes', price: 55.00, unit: 'kg', description: 'Premium sernik tradycyjny', stock: 60 },
    { id: 7, name: 'Mąka Bezglutenowa', category: 'special', price: 68.00, unit: 'kg', description: 'Specjalna receptura bez glutenu', stock: 45 },
    { id: 8, name: 'Mieszanka Muffin', category: 'cakes', price: 36.50, unit: 'kg', description: 'Puszyste muffiny', stock: 95 }
];

const mockOrders = [
    {
        id: 1001,
        date: '2024-11-25',
        status: 'delivered',
        total: 456.80,
        items: [
            { productName: 'Mąka Tortowa Premium', quantity: 5, price: 45.99 },
            { productName: 'Mieszanka Brownie', quantity: 3, price: 38.50 }
        ]
    },
    {
        id: 1002,
        date: '2024-11-26',
        status: 'shipped',
        total: 672.00,
        items: [
            { productName: 'Mąka Uniwersalna', quantity: 10, price: 32.00 },
            { productName: 'Mieszanka Sernik Royal', quantity: 6, price: 55.00 }
        ]
    },
    {
        id: 1003,
        date: '2024-11-27',
        status: 'processing',
        total: 294.50,
        items: [
            { productName: 'Mieszanka Ciasteczkowa', quantity: 7, price: 42.00 }
        ]
    },
    {
        id: 1004,
        date: '2024-11-28',
        status: 'pending',
        total: 840.00,
        items: [
            { productName: 'Mąka Chlebowa', quantity: 15, price: 28.00 },
            { productName: 'Mąka Tortowa Premium', quantity: 10, price: 45.99 }
        ]
    }
];

const mockMaterials = [
    { id: 1, name: 'Etykiety Premium - Mąka Tortowa', category: 'labels', type: 'PDF', size: '2.3 MB', date: '2024-11-20', downloads: 45 },
    { id: 2, name: 'Instrukcja użytkowania - Mieszanka Brownie', category: 'instructions', type: 'PDF', size: '1.8 MB', date: '2024-11-18', downloads: 32 },
    { id: 3, name: 'Plakat promocyjny - Sezon zimowy', category: 'marketing', type: 'PDF', size: '5.2 MB', date: '2024-11-15', downloads: 28 },
    { id: 4, name: 'Certyfikat jakości', category: 'documents', type: 'PDF', size: '890 KB', date: '2024-11-10', downloads: 67 },
    { id: 5, name: 'Etykiety - Produkty bezglutenowe', category: 'labels', type: 'PDF', size: '1.9 MB', date: '2024-11-08', downloads: 41 },
    { id: 6, name: 'Instrukcja magazynowania', category: 'instructions', type: 'PDF', size: '1.2 MB', date: '2024-11-05', downloads: 53 },
    { id: 7, name: 'Banner online - Promocja', category: 'marketing', type: 'PNG', size: '3.1 MB', date: '2024-11-01', downloads: 22 },
    { id: 8, name: 'Umowa franczyzowa', category: 'documents', type: 'PDF', size: '4.5 MB', date: '2024-10-28', downloads: 89 }
];

const mockTickets = [
    { id: 101, date: '2024-11-27', type: 'technical', subject: 'Problem z logowaniem', status: 'resolved', priority: 'medium' },
    { id: 102, date: '2024-11-26', type: 'order', subject: 'Opóźnienie w dostawie', status: 'in-progress', priority: 'high' },
    { id: 103, date: '2024-11-25', type: 'product', subject: 'Pytanie o składniki', status: 'resolved', priority: 'low' }
];


// Cart management
let cart = [];

// Status translations
const statusTranslations = {
    'pending': 'Oczekujące',
    'processing': 'W realizacji',
    'shipped': 'Wysłane',
    'delivered': 'Dostarczone',
    'cancelled': 'Anulowane'
};

const statusColors = {
    'pending': '#FFA500',
    'processing': '#3B82F6',
    'shipped': '#8B5CF6',
    'delivered': '#10B981',
    'cancelled': '#EF4444'
};

// Products page
if (document.getElementById('productsList')) {
    loadProducts();

    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('search-filter').addEventListener('input', filterProducts);
}

function loadProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = mockProducts.map(product => `
        <div class="product-card card" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
            <div class="product-header">
                <h3 class="card-title">${product.name}</h3>
                <span class="badge">${getCategoryName(product.category)}</span>
            </div>
            <p class="card-text">${product.description}</p>
            <div class="product-details">
                <div class="product-price">${product.price.toFixed(2)} zł/${product.unit}</div>
                <div class="product-stock">Stan: ${product.stock} ${product.unit}</div>
            </div>
            <a href="order.html" class="btn-primary" style="text-align: center; margin-top: 1rem;">Zamów</a>
        </div>
    `).join('');
}

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const search = document.getElementById('search-filter').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productName = product.dataset.name;

        const matchesCategory = category === 'all' || productCategory === category;
        const matchesSearch = productName.includes(search);

        product.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
    });
}

function getCategoryName(category) {
    const categories = {
        'cakes': 'Ciasta',
        'cookies': 'Ciastka',
        'bread': 'Pieczywo',
        'special': 'Specjalne'
    };
    return categories[category] || category;
}

// Order page
if (document.getElementById('orderProductsList')) {
    loadOrderProducts();
    updateOrderSummary();

    document.getElementById('submitOrder').addEventListener('click', submitOrder);
}

function loadOrderProducts() {
    const container = document.getElementById('orderProductsList');
    container.innerHTML = mockProducts.map(product => `
        <div class="order-product-item">
            <div class="order-product-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <span class="order-product-price">${product.price.toFixed(2)} zł/${product.unit}</span>
            </div>
            <div class="order-product-controls">
                <button class="order-btn-minus" onclick="updateQuantity(${product.id}, -1)">-</button>
                <input type="number"
                       id="qty-${product.id}"
                       class="order-quantity-input"
                       value="0"
                       min="0"
                       max="${product.stock}"
                       onchange="updateCart(${product.id}, this.value)">
                <button class="order-btn-plus" onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
}

function updateQuantity(productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    const newValue = Math.max(0, parseInt(input.value) + change);
    const product = mockProducts.find(p => p.id === productId);

    if (newValue <= product.stock) {
        input.value = newValue;
        updateCart(productId, newValue);
    }
}

function updateCart(productId, quantity) {
    quantity = parseInt(quantity);
    const product = mockProducts.find(p => p.id === productId);

    if (quantity > 0 && quantity <= product.stock) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cart.push({ ...product, quantity });
        }
    } else {
        cart = cart.filter(item => item.id !== productId);
    }

    updateOrderSummary();
}

function updateOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    const totalElement = document.getElementById('orderTotal');

    if (cart.length === 0) {
        summaryContainer.innerHTML = '<p class="order-empty-message">Dodaj produkty do zamówienia</p>';
        totalElement.textContent = '0.00 zł';
        return;
    }

    let total = 0;
    summaryContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="order-summary-item">
                <div>
                    <strong>${item.name}</strong>
                    <div>${item.quantity} ${item.unit} × ${item.price.toFixed(2)} zł</div>
                </div>
                <div class="order-item-total">${itemTotal.toFixed(2)} zł</div>
            </div>
        `;
    }).join('');

    totalElement.textContent = total.toFixed(2) + ' zł';
}

function submitOrder() {
    if (cart.length === 0) {
        showToast('Dodaj produkty do zamówienia');
        return;
    }

    const notes = document.getElementById('orderNotes').value;

    // Send to backend
    const orderData = {
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        })),
        notes: notes,
        timestamp: new Date().toISOString()
    };

    console.log('Sending order to backend:', orderData);

    // Simulate successful order
    showToast('Zamówienie zostało złożone pomyślnie!');

    cart = [];
    document.getElementById('orderNotes').value = '';
    document.querySelectorAll('.order-quantity-input').forEach(input => input.value = '0');
    updateOrderSummary();

    setTimeout(() => {
        window.location.href = 'my-orders.html';
    }, 2000);
}

// My Orders page
if (document.getElementById('ordersList')) {
    loadOrders();

    document.getElementById('status-filter').addEventListener('change', filterOrders);
    document.getElementById('date-from').addEventListener('change', filterOrders);
    document.getElementById('date-to').addEventListener('change', filterOrders);
}

function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = mockOrders.map(order => `
        <div class="order-card card" data-status="${order.status}" data-date="${order.date}">
            <div class="order-card-header">
                <div>
                    <h3 class="order-card-title">Zamówienie #${order.id}</h3>
                    <p class="order-card-date">${formatDate(order.date)}</p>
                </div>
                <span class="order-status-badge" style="background-color: ${statusColors[order.status]}">
                    ${statusTranslations[order.status]}
                </span>
            </div>
            <div class="order-items-list">
                ${order.items.map(item => `
                    <div class="order-item-row">
                        <span>${item.productName}</span>
                        <span>${item.quantity} szt. × ${item.price.toFixed(2)} zł</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-card-footer">
                <span class="order-card-total">Suma: ${order.total.toFixed(2)} zł</span>
                <button class="btn-outline" style="color: hsl(35, 65%, 45%); border-color: hsl(35, 65%, 45%);" onclick="viewOrderDetails(${order.id})">
                    Szczegóły
                </button>
            </div>
        </div>
    `).join('');
}

function filterOrders() {
    const status = document.getElementById('status-filter').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const orders = document.querySelectorAll('.order-card');

    orders.forEach(order => {
        const orderStatus = order.dataset.status;
        const orderDate = order.dataset.date;

        const matchesStatus = status === 'all' || orderStatus === status;
        const matchesDateFrom = !dateFrom || orderDate >= dateFrom;
        const matchesDateTo = !dateTo || orderDate <= dateTo;

        order.style.display = matchesStatus && matchesDateFrom && matchesDateTo ? 'block' : 'none';
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function viewOrderDetails(orderId) {
    // Fetch from backend
    console.log('Viewing order details:', orderId);
    showToast('Szczegóły zamówienia (funkcja do implementacji)');
}

// Dashboard page
if (document.getElementById('recentOrders')) {
    loadDashboard();
}

function loadDashboard() {
    // Load recent orders
    const recentOrdersContainer = document.getElementById('recentOrders');
    const recentOrders = mockOrders.slice(0, 3);

    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item">
            <div>
                <strong>Zamówienie #${order.id}</strong>
                <div style="font-size: 0.875rem; color: #666;">${formatDate(order.date)}</div>
            </div>
            <span class="order-status-badge" style="background-color: ${statusColors[order.status]}; font-size: 0.75rem;">
                ${statusTranslations[order.status]}
            </span>
        </div>
    `).join('');

    // Load recent materials
    const recentMaterialsContainer = document.getElementById('recentMaterials');
    const recentMaterials = mockMaterials.slice(0, 3);

    recentMaterialsContainer.innerHTML = recentMaterials.map(material => `
        <div class="recent-material-item">
            <div>
                <strong>${material.name}</strong>
                <div style="font-size: 0.875rem; color: #666;">${material.type} • ${material.size}</div>
            </div>
        </div>
    `).join('');
}

// Materials page
if (document.getElementById('materialsList')) {
    loadMaterials();

    document.getElementById('material-category-filter').addEventListener('change', filterMaterials);
    document.getElementById('material-search-filter').addEventListener('input', filterMaterials);
}

function loadMaterials() {
    const materialsList = document.getElementById('materialsList');
    materialsList.innerHTML = mockMaterials.map(material => `
        <div class="material-card card" data-category="${material.category}" data-name="${material.name.toLowerCase()}">
            <div class="material-header">
                <h3 class="card-title">${material.name}</h3>
                <span class="badge">${getMaterialCategoryName(material.category)}</span>
            </div>
            <div class="material-info">
                <div class="material-detail">
                    <span class="material-label">Typ:</span>
                    <span>${material.type}</span>
                </div>
                <div class="material-detail">
                    <span class="material-label">Rozmiar:</span>
                    <span>${material.size}</span>
                </div>
                <div class="material-detail">
                    <span class="material-label">Data:</span>
                    <span>${formatDate(material.date)}</span>
                </div>
                <div class="material-detail">
                    <span class="material-label">Pobrania:</span>
                    <span>${material.downloads}</span>
                </div>
            </div>
            <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="downloadMaterial(${material.id})">
                Pobierz
            </button>
        </div>
    `).join('');
}

function filterMaterials() {
    const category = document.getElementById('material-category-filter').value;
    const search = document.getElementById('material-search-filter').value.toLowerCase();
    const materials = document.querySelectorAll('.material-card');

    materials.forEach(material => {
        const materialCategory = material.dataset.category;
        const materialName = material.dataset.name;

        const matchesCategory = category === 'all' || materialCategory === category;
        const matchesSearch = materialName.includes(search);

        material.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
    });
}

function getMaterialCategoryName(category) {
    const categories = {
        'labels': 'Etykiety',
        'instructions': 'Instrukcje',
        'marketing': 'Marketing',
        'documents': 'Dokumenty'
    };
    return categories[category] || category;
}

function downloadMaterial(materialId) {
    // Here you would download from your Spring Boot backend
    const material = mockMaterials.find(m => m.id === materialId);
    console.log('Downloading material:', material);
    showToast(`Pobieranie: ${material.name}`);
}

// Support page
if (document.getElementById('supportForm')) {
    document.getElementById('supportForm').addEventListener('submit', submitSupportTicket);
    loadTickets();
}

function switchTab(tab) {
    const tabs = document.querySelectorAll('.support-tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'report') {
        tabs[0].classList.add('active');
        document.getElementById('reportTab').style.display = 'block';
        document.getElementById('historyTab').style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('reportTab').style.display = 'none';
        document.getElementById('historyTab').style.display = 'block';
    }
}

function submitSupportTicket(e) {

    const ticketData = {
        type: document.getElementById('issueType').value,
        subject: document.getElementById('issueSubject').value,
        description: document.getElementById('issueDescription').value,
        priority: document.getElementById('issuePriority').value,
        timestamp: new Date().toISOString()
    };

    // Send to backend
    console.log('Submitting ticket:', ticketData);

    showToast('Zgłoszenie zostało wysłane pomyślnie!');
    document.getElementById('supportForm').reset();

    // Switch to history tab after 2 seconds
    setTimeout(() => {
        switchTab('history');
    }, 2000);
}

function loadTickets() {
    const ticketsList = document.getElementById('ticketsList');
    if (!ticketsList) return;

    const statusTranslationsTickets = {
        'resolved': 'Rozwiązany',
        'in-progress': 'W trakcie',
        'pending': 'Oczekujący'
    };

    const priorityTranslations = {
        'low': 'Niski',
        'medium': 'Średni',
        'high': 'Wysoki',
        'urgent': 'Pilny'
    };

    ticketsList.innerHTML = mockTickets.map(ticket => `
        <div class="ticket-card card">
            <div class="ticket-header">
                <div>
                    <h3 class="ticket-title">Zgłoszenie #${ticket.id}</h3>
                    <p class="ticket-subject">${ticket.subject}</p>
                </div>
                <span class="ticket-status" style="background-color: ${ticket.status === 'resolved' ? '#10B981' : ticket.status === 'in-progress' ? '#3B82F6' : '#FFA500'}">
                    ${statusTranslationsTickets[ticket.status]}
                </span>
            </div>
            <div class="ticket-details">
                <span>Data: ${formatDate(ticket.date)}</span>
                <span>Priorytet: ${priorityTranslations[ticket.priority]}</span>
                <span>Typ: ${ticket.type}</span>
            </div>
        </div>
    `).join('');
}

// Dashboard page
if (document.getElementById('recentOrders')) {
    loadDashboard();
}

function loadDashboard() {
    // Load recent orders
    const recentOrdersContainer = document.getElementById('recentOrders');
    const recentOrders = mockOrders.slice(0, 3);

    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item">
            <div>
                <strong>Zamówienie #${order.id}</strong>
                <div style="font-size: 0.875rem; color: #666;">${formatDate(order.date)}</div>
            </div>
            <span class="order-status-badge" style="background-color: ${statusColors[order.status]}; font-size: 0.75rem;">
                ${statusTranslations[order.status]}
            </span>
        </div>
    `).join('');

    // Load recent materials
    const recentMaterialsContainer = document.getElementById('recentMaterials');
    const recentMaterials = mockMaterials.slice(0, 3);

    recentMaterialsContainer.innerHTML = recentMaterials.map(material => `
        <div class="recent-material-item">
            <div>
                <strong>${material.name}</strong>
                <div style="font-size: 0.875rem; color: #666;">${material.type} • ${material.size}</div>
            </div>
        </div>
    `).join('');
}

// Materials page
if (document.getElementById('materialsList')) {
    loadMaterials();

    document.getElementById('material-category-filter').addEventListener('change', filterMaterials);
    document.getElementById('material-search-filter').addEventListener('input', filterMaterials);
}

function loadMaterials() {
    const materialsList = document.getElementById('materialsList');
    materialsList.innerHTML = mockMaterials.map(material => `
        <div class="material-card card" data-category="${material.category}" data-name="${material.name.toLowerCase()}">
            <div class="material-header">
                <h3 class="card-title">${material.name}</h3>
                <span class="badge">${getMaterialCategoryName(material.category)}</span>
            </div>
            <div class="material-info">
                <div class="material-detail">
                    <span class="material-label">Typ:</span>
                    <span>${material.type}</span>
                </div>
                <div class="material-detail">
                    <span class="material-label">Rozmiar:</span>
                    <span>${material.size}</span>
                </div>
                <div class="material-detail">
                    <span class="material-label">Data:</span>
                    <span>${formatDate(material.date)}</span>
                </div>
                <div class="material-detail">
                    <span class="material-label">Pobrania:</span>
                    <span>${material.downloads}</span>
                </div>
            </div>
            <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="downloadMaterial(${material.id})">
                Pobierz
            </button>
        </div>
    `).join('');
}

function filterMaterials() {
    const category = document.getElementById('material-category-filter').value;
    const search = document.getElementById('material-search-filter').value.toLowerCase();
    const materials = document.querySelectorAll('.material-card');

    materials.forEach(material => {
        const materialCategory = material.dataset.category;
        const materialName = material.dataset.name;

        const matchesCategory = category === 'all' || materialCategory === category;
        const matchesSearch = materialName.includes(search);

        material.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
    });
}

function getMaterialCategoryName(category) {
    const categories = {
        'labels': 'Etykiety',
        'instructions': 'Instrukcje',
        'marketing': 'Marketing',
        'documents': 'Dokumenty'
    };
    return categories[category] || category;
}

function downloadMaterial(materialId) {
    // Download from backend
    const material = mockMaterials.find(m => m.id === materialId);
    console.log('Downloading material:', material);
    showToast(`Pobieranie: ${material.name}`);
}

// Support page
if (document.getElementById('supportForm')) {
    document.getElementById('supportForm').addEventListener('submit', submitSupportTicket);
    loadTickets();
}

function switchTab(tab) {
    const tabs = document.querySelectorAll('.support-tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'report') {
        tabs[0].classList.add('active');
        document.getElementById('reportTab').style.display = 'block';
        document.getElementById('historyTab').style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('reportTab').style.display = 'none';
        document.getElementById('historyTab').style.display = 'block';
    }
}

function submitSupportTicket(e) {

    const ticketData = {
        type: document.getElementById('issueType').value,
        subject: document.getElementById('issueSubject').value,
        description: document.getElementById('issueDescription').value,
        priority: document.getElementById('issuePriority').value,
        timestamp: new Date().toISOString()
    };

    // Send to backend
    console.log('Submitting ticket:', ticketData);

    showToast('Zgłoszenie zostało wysłane pomyślnie!');
    document.getElementById('supportForm').reset();

    // Switch to history tab after 2 seconds
    setTimeout(() => {
        switchTab('history');
    }, 2000);
}

function loadTickets() {
    const ticketsList = document.getElementById('ticketsList');
    if (!ticketsList) return;

    const statusTranslationsTickets = {
        'resolved': 'Rozwiązany',
        'in-progress': 'W trakcie',
        'pending': 'Oczekujący'
    };

    const priorityTranslations = {
        'low': 'Niski',
        'medium': 'Średni',
        'high': 'Wysoki',
        'urgent': 'Pilny'
    };

    ticketsList.innerHTML = mockTickets.map(ticket => `
        <div class="ticket-card card">
            <div class="ticket-header">
                <div>
                    <h3 class="ticket-title">Zgłoszenie #${ticket.id}</h3>
                    <p class="ticket-subject">${ticket.subject}</p>
                </div>
                <span class="ticket-status" style="background-color: ${ticket.status === 'resolved' ? '#10B981' : ticket.status === 'in-progress' ? '#3B82F6' : '#FFA500'}">
                    ${statusTranslationsTickets[ticket.status]}
                </span>
            </div>
            <div class="ticket-details">
                <span>Data: ${formatDate(ticket.date)}</span>
                <span>Priorytet: ${priorityTranslations[ticket.priority]}</span>
                <span>Typ: ${getMaterialCategoryName(ticket.type)}</span>
            </div>
        </div>
    `).join('');
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}