const API_BASE_URL = 'http://localhost:8080/api';

let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('usersTable')) {
        loadUsers();
    }
});

async function loadUsers() {
    try {
        console.log("Próba pobrania użytkowników z:", `${API_BASE_URL}/users`);
        const response = await fetch(`${API_BASE_URL}/users`);

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        allUsers = await response.json();
        console.log("Pobrani użytkownicy:", allUsers);
        renderUsers();
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
        const tbody = document.querySelector('#usersTable tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6">Błąd połączenia z bazą danych.</td></tr>';
    }
}

function renderUsers() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;

    if (allUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Brak partnerów w bazie danych.</td></tr>';
        return;
    }

    tbody.innerHTML = allUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName || ''} ${user.lastName || ''}</td>
            <td>${user.email}</td>
            <td>${user.company || '-'}</td>
            <td>
                <span class="badge ${user.active ? 'badge-success' : 'badge-danger'}">
                    ${user.active ? 'Aktywny' : 'Nieaktywny'}
                </span>
            </td>
            <td>
                <button class="btn btn-small btn-primary" onclick="editUser(${user.id})">Edytuj</button>
            </td>
        </tr>
    `).join('');
}
// Funkcje pomocnicze
function getStatusBadgeClass(status) {
    const statusMap = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'shipped': 'badge-primary',
        'delivered': 'badge-success',
        'cancelled': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Oczekujące',
        'processing': 'W realizacji',
        'shipped': 'Wysłane',
        'delivered': 'Dostarczone',
        'cancelled': 'Anulowane'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if(!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
}

// --- ADMIN DASHBOARD ---
if (document.getElementById('totalPartners')) {
    loadDashboardStats();
}

async function loadDashboardStats() {
    try {
        const [resUsers, resProducts, resOrders] = await Promise.all([
            fetch(`${API_BASE_URL}/users`),
            fetch(`${API_BASE_URL}/products`),
            fetch(`${API_BASE_URL}/orders`)
        ]);

        const users = await resUsers.json();
        const products = await resProducts.json();
        const orders = await resOrders.json();

        document.getElementById('totalPartners').textContent = users.filter(u => u.active).length;
        document.getElementById('totalProducts').textContent = products.length;

        const currentMonth = new Date().getMonth();
        const monthlyOrders = orders.filter(o => new Date(o.date).getMonth() === currentMonth);

        document.getElementById('monthlyOrders').textContent = monthlyOrders.length;
        const monthlyRev = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
        document.getElementById('monthlyRevenue').textContent = monthlyRev.toFixed(2) + ' PLN';

        // Ostatnie zamówienia (tabela)
        const recentOrders = orders.slice(-5).reverse();
        const tbody = document.getElementById('recentOrdersTable');
        if (tbody) {
            tbody.innerHTML = recentOrders.map(order => `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.partnerName}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>${order.productNames ? order.productNames.length : 0} poz.</td>
                    <td>${order.total.toFixed(2)} PLN</td>
                    <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusText(order.status)}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Błąd ładowania statystyk:', error);
    }
}

// --- ADMIN PRODUCTS PAGE ---
if (document.getElementById('productsTable')) {
    let currentProductId = null;
    let allProducts = [];

    async function loadProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            allProducts = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Błąd pobierania produktów:', error);
        }
    }

    function renderProducts() {
        const filter = document.getElementById('searchProduct').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;

        const filtered = allProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(filter);
            const matchesCategory = !category || p.category === category;
            return matchesSearch && matchesCategory;
        });

        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = filtered.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price.toFixed(2)} PLN</td>
                <td><span class="badge ${product.available ? 'badge-success' : 'badge-danger'}">
                    ${product.available ? 'Dostępny' : 'Niedostępny'}</span>
                </td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="editProduct(${product.id})">Edytuj</button>
                    <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Usuń</button>
                </td>
            </tr>
        `).join('');
    }

    // Eventy dla filtrów
    document.getElementById('searchProduct').addEventListener('input', renderProducts);
    document.getElementById('categoryFilter').addEventListener('change', renderProducts);

    // Obsługa Modala Produktu
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');

    document.getElementById('addProductBtn').onclick = () => {
        currentProductId = null;
        document.getElementById('modalTitle').textContent = 'Dodaj produkt';
        form.reset();
        modal.style.display = 'block';
    };

    window.editProduct = (id) => {
        const product = allProducts.find(p => p.id === id);
        if (product) {
            currentProductId = id;
            document.getElementById('modalTitle').textContent = 'Edytuj produkt';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productAvailable').checked = product.available;
            modal.style.display = 'block';
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
            loadProducts();
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            available: document.getElementById('productAvailable').checked
        };

        const method = currentProductId ? 'PUT' : 'POST';
        const url = currentProductId ? `${API_BASE_URL}/products/${currentProductId}` : `${API_BASE_URL}/products`;

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        modal.style.display = 'none';
        loadProducts();
    };

    loadProducts();
}

// --- ADMIN ORDERS PAGE ---
// 1. Zmienna globalna (musi być POZA ifem, żeby viewOrderDetails ją widziało)
let allAdminOrders = [];

if (document.getElementById('ordersTable')) {
    // 2. Wywołujemy funkcję od razu
    renderOrders();

    async function renderOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`);
            allAdminOrders = await response.json(); // Zapisujemy do zmiennej globalnej

            const table = document.getElementById('ordersTable');
            const tbody = table.querySelector('tbody') || table; // Zabezpieczenie na wypadek braku tagu tbody

            tbody.innerHTML = allAdminOrders.map(order => `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.partnerName || 'Brak danych'}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>${order.productNames ? order.productNames.length : 0} poz.</td>
                    <td>${order.total ? order.total.toFixed(2) : '0.00'} PLN</td>
                    <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusText(order.status)}</span></td>
                    <td><button class="btn btn-small btn-primary" onclick="viewOrderDetails(${order.id})">Szczegóły</button></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Błąd ładowania zamówień:', error);
        }
    }

    // 3. Obsługa szczegółów (teraz widzi allAdminOrders)
    window.viewOrderDetails = (orderId) => {
        const order = allAdminOrders.find(o => o.id == orderId);
        if (order) {
            document.getElementById('orderIdDetail').textContent = order.id;
            document.getElementById('detailPartner').textContent = order.partnerName;
            document.getElementById('detailEmail').textContent = order.partnerEmail;
            document.getElementById('detailDate').textContent = formatDate(order.date);
            document.getElementById('detailStatus').innerHTML = `<span class="badge ${getStatusBadgeClass(order.status)}">${getStatusText(order.status)}</span>`;
            document.getElementById('detailTotal').textContent = (order.total || 0).toFixed(2) + ' PLN';

            const productsList = document.getElementById('detailProducts');
            productsList.innerHTML = (order.productNames || []).map(p => `<li>${p}</li>`).join('');

            const modal = document.getElementById('orderModal');
            document.getElementById('updateStatus').value = order.status;

            document.getElementById('saveStatusBtn').onclick = async () => {
                const newStatus = document.getElementById('updateStatus').value;
                try {
                    // Upewnij się, że Twój backend obsługuje PATCH /api/orders/{id}/status
                    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${newStatus}`, {
                        method: 'PATCH'
                    });
                    if(response.ok) {
                        modal.style.display = 'none';
                        renderOrders(); // Odśwież listę po zmianie
                    } else {
                        alert("Błąd podczas aktualizacji statusu.");
                    }
                } catch (e) {
                    console.error("Błąd PATCH:", e);
                }
            };

            modal.style.display = 'block';
        }
    };
}

// --- LOGOUT ---
document.querySelectorAll('#logoutBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz się wylogować?')) {
            window.location.href = 'login.html';
        }
    });
});

// Zamykanie modali
window.onclick = (event) => {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
};
document.querySelectorAll('.close, #cancelBtn').forEach(btn => {
    btn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});