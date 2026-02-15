const API_BASE_URL = 'http://localhost:8080/api';
let allProducts = [];
let allMaterials = []; // Tablica na materiały z bazy

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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsGrid')) {
        loadProducts();
        document.getElementById('category-filter')?.addEventListener('change', filterProducts);
        document.getElementById('search-filter')?.addEventListener('input', filterProducts);
    }

    if (document.getElementById('orderProductsList')) {
        loadOrderProducts();
        updateOrderSummary();
        document.getElementById('submitOrder')?.addEventListener('click', submitOrder);
    }

    if (document.getElementById('ordersList')) {
        loadOrders();
        document.getElementById('status-filter')?.addEventListener('change', filterOrders);
        document.getElementById('date-from')?.addEventListener('change', filterOrders);
        document.getElementById('date-to')?.addEventListener('change', filterOrders);
    }

    if (document.getElementById('recentOrders') || document.getElementById('recentMaterials')) {
        loadDashboard();
    }

    if (document.getElementById('materialsList')) {
        loadMaterials();
        document.getElementById('material-category-filter')?.addEventListener('change', filterMaterials);
        document.getElementById('material-search-filter')?.addEventListener('input', filterMaterials);
    }

    if (document.getElementById('supportForm')) {
        document.getElementById('supportForm').addEventListener('submit', submitSupportTicket);
        loadTickets();
    }
});

// --- PRODUCTS ---
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        allProducts = await response.json();

        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = allProducts.map(product => `
            <div class="product-card card" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-footer">
                        <span class="price">${product.price.toFixed(2)} PLN / ${product.unit || 'szt'}</span>
                        <button class="btn-primary" onclick="addToCart(${product.id})">Dodaj</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd pobierania produktów:', error);
    }
}

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const search = document.getElementById('search-filter').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const matchesCategory = category === 'all' || product.dataset.category === category;
        const matchesSearch = product.dataset.name.includes(search);
        product.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
    });
}

// --- ORDERING SYSTEM ---
async function loadOrderProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        allProducts = await response.json();

        const container = document.getElementById('orderProductsList');
        if (!container) return;

        container.innerHTML = allProducts.map(product => `
            <div class="order-product-item">
                <div class="order-product-info">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <span class="order-product-price">${product.price.toFixed(2)} zł/${product.unit || 'szt'}</span>
                </div>
                <div class="order-product-controls">
                    <button class="order-btn-minus" onclick="updateQuantity(${product.id}, -1)">-</button>
                    <input type="number" id="qty-${product.id}" class="order-quantity-input" value="0" min="0" onchange="updateCart(${product.id}, this.value)">
                    <button class="order-btn-plus" onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania produktów do zamówienia:', error);
    }
}

function updateQuantity(productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    const newValue = Math.max(0, parseInt(input.value) + change);
    input.value = newValue;
    updateCart(productId, newValue);
}

function updateCart(productId, quantity) {
    quantity = parseInt(quantity);
    const product = allProducts.find(p => p.id === productId);

    if (product && quantity > 0) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) existingItem.quantity = quantity;
        else cart.push({ ...product, quantity });
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    updateOrderSummary();
}

function updateOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    const totalElement = document.getElementById('orderTotal');
    if (!summaryContainer) return;

    let total = 0;
    summaryContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="order-summary-item">
                <div><strong>${item.name}</strong><div>${item.quantity} x ${item.price.toFixed(2)} zł</div></div>
                <div class="order-item-total">${itemTotal.toFixed(2)} zł</div>
            </div>`;
    }).join('') || '<p class="order-empty-message">Dodaj produkty do zamówienia</p>';

    totalElement.textContent = total.toFixed(2) + ' zł';
}

async function submitOrder() {
    if (cart.length === 0) { showToast('Koszyk jest pusty!'); return; }

    const orderData = {
        partnerName: "Jan Kowalski",
        partnerEmail: "partner1@example.com",
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        productNames: cart.map(item => `${item.name} (${item.quantity} szt.)`)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            showToast('Zamówienie złożone!');
            cart = [];
            setTimeout(() => window.location.href = 'my-orders.html', 1500);
        }
    } catch (error) { alert('Błąd połączenia z serwerem.'); }
}

// --- MY ORDERS ---
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        const orders = await response.json();
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card card" data-status="${order.status}" data-date="${order.date}">
                <div class="order-card-header">
                    <div><h3>Zamówienie #${order.id}</h3><p>${formatDate(order.date)}</p></div>
                    <span class="order-status-badge" style="background-color: ${statusColors[order.status]}">${statusTranslations[order.status]}</span>
                </div>
                <div class="order-items-list">${(order.productNames || []).map(n => `<div class="order-item-row">${n}</div>`).join('')}</div>
                <div class="order-card-footer"><span class="order-card-total">Suma: ${order.total.toFixed(2)} zł</span></div>
            </div>
        `).join('');
    } catch (error) { console.error(error); }
}

function filterOrders() {
    const status = document.getElementById('status-filter').value;
    const from = document.getElementById('date-from').value;
    const to = document.getElementById('date-to').value;

    document.querySelectorAll('.order-card').forEach(card => {
        const matchesStatus = status === 'all' || card.dataset.status === status;
        const matchesDate = (!from || card.dataset.date >= from) && (!to || card.dataset.date <= to);
        card.style.display = matchesStatus && matchesDate ? 'block' : 'none';
    });
}

// --- MATERIALS ---
async function loadMaterials() {
    try {
        const response = await fetch(`${API_BASE_URL}/materials`);
        allMaterials = await response.json();
        const materialsList = document.getElementById('materialsList');
        if (!materialsList) return;

        materialsList.innerHTML = allMaterials.map(material => `
            <div class="material-card card" data-category="${material.category}" data-name="${material.name.toLowerCase()}">
                <div class="material-header"><h3>${material.name}</h3><span class="badge">${getMaterialCategoryName(material.category)}</span></div>
                <div class="material-info">
                    <div class="material-detail">Typ: ${material.type}</div>
                    <div class="material-detail">Rozmiar: ${material.size}</div>
                    <div class="material-detail">Data: ${formatDate(material.date)}</div>
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="downloadMaterial(${material.id})">Pobierz</button>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

function filterMaterials() {
    const cat = document.getElementById('material-category-filter').value;
    const search = document.getElementById('material-search-filter').value.toLowerCase();
    document.querySelectorAll('.material-card').forEach(card => {
        const matchesCat = cat === 'all' || card.dataset.category === cat;
        const matchesSearch = card.dataset.name.includes(search);
        card.style.display = matchesCat && matchesSearch ? 'block' : 'none';
    });
}

function getMaterialCategoryName(category) {
    const cats = { 'labels': 'Etykiety', 'instructions': 'Instrukcje', 'marketing': 'Marketing', 'documents': 'Dokumenty' };
    return cats[category] || category;
}

function downloadMaterial(id) {
    const mat = allMaterials.find(m => m.id === id);
    if (mat) showToast(`Pobieranie: ${mat.name}...`);
}

// --- DASHBOARD ---
async function loadDashboard() {
    try {
        const [ordersRes, materialsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/orders`),
            fetch(`${API_BASE_URL}/materials`)
        ]);
        const orders = await ordersRes.json();
        const materials = await materialsRes.json();

        const recentOrders = document.getElementById('recentOrders');
        if (recentOrders) {
            recentOrders.innerHTML = orders.slice(-3).reverse().map(o => `
                <div class="recent-order-item">
                    <div><strong>#${o.id}</strong><div style="font-size:0.8rem">${formatDate(o.date)}</div></div>
                    <span class="order-status-badge" style="background-color:${statusColors[o.status]}; font-size:0.7rem">${statusTranslations[o.status]}</span>
                </div>
            `).join('');
        }

        const recentMaterials = document.getElementById('recentMaterials');
        if (recentMaterials) {
            recentMaterials.innerHTML = materials.slice(-3).reverse().map(m => `
                <div class="recent-material-item"><strong>${m.name}</strong><div style="font-size:0.8rem">${m.type} • ${m.size}</div></div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

// --- SUPPORT TICKETS ---
async function loadTickets() {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets`);
        const tickets = await response.json();
        const ticketsList = document.getElementById('ticketsList');
        if (!ticketsList) return;

        const ticketStatusColors = { 'resolved': '#10B981', 'in-progress': '#3B82F6', 'pending': '#FFA500' };

        ticketsList.innerHTML = tickets.map(t => `
            <div class="ticket-card card">
                <div class="ticket-header">
                    <div><h3>#${t.id}</h3><p>${t.subject}</p></div>
                    <span class="ticket-status" style="background-color: ${ticketStatusColors[t.status]}">${t.status}</span>
                </div>
                <div class="ticket-details"><span>${formatDate(t.date)}</span><span>${t.priority}</span><span>${t.type}</span></div>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function submitSupportTicket(e) {
    e.preventDefault();
    const data = {
        type: document.getElementById('issueType').value,
        subject: document.getElementById('issueSubject').value,
        priority: document.getElementById('issuePriority').value,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };

    try {
        const res = await fetch(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showToast('Zgłoszenie wysłane!');
            e.target.reset();
            loadTickets();
        }
    } catch (e) { console.error(e); }
}

// --- UTILS ---
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function switchTab(tab) {
    document.querySelectorAll('.support-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'report') {
        document.querySelector('.support-tab:nth-child(1)').classList.add('active');
        document.getElementById('reportTab').style.display = 'block';
        document.getElementById('historyTab').style.display = 'none';
    } else {
        document.querySelector('.support-tab:nth-child(2)').classList.add('active');
        document.getElementById('reportTab').style.display = 'none';
        document.getElementById('historyTab').style.display = 'block';
    }
}