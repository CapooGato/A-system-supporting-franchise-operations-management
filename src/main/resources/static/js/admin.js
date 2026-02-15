// Mock data dla panelu administratora
let mockProducts = [
    { id: 1, name: 'Ciasto czekoladowe premium', category: 'cakes', price: 45.99, description: 'Wyśmienite ciasto z czekoladą belgijską', image: 'https://picsum.photos/200/200?random=1', available: true },
    { id: 2, name: 'Chleb żytni tradycyjny', category: 'breads', price: 12.50, description: 'Chleb na zakwasie', image: 'https://picsum.photos/200/200?random=2', available: true },
    { id: 3, name: 'Ciastka maślane', category: 'pastries', price: 18.00, description: 'Kruche ciastka maślane', image: 'https://picsum.photos/200/200?random=3', available: true },
    { id: 4, name: 'Sernik klasyczny', category: 'cakes', price: 38.00, description: 'Tradycyjny sernik pieczony', image: 'https://picsum.photos/200/200?random=4', available: true },
    { id: 5, name: 'Bagietka francuska', category: 'breads', price: 8.50, description: 'Chrupiąca bagietka', image: 'https://picsum.photos/200/200?random=5', available: false }
];

let mockUsers = [
    { id: 1, email: 'partner1@example.com', firstName: 'Jan', lastName: 'Kowalski', role: 'franchisee', company: 'Piekarnia Kowalski', active: true, registrationDate: '2024-01-15' },
    { id: 2, email: 'partner2@example.com', firstName: 'Anna', lastName: 'Nowak', role: 'partner', company: 'Cukiernia Nowak', active: true, registrationDate: '2024-02-20' },
    { id: 3, email: 'admin@example.com', firstName: 'Piotr', lastName: 'Wiśniewski', role: 'admin', company: 'Our Shop HQ', active: true, registrationDate: '2023-12-01' },
    { id: 4, email: 'partner3@example.com', firstName: 'Maria', lastName: 'Zielińska', role: 'franchisee', company: 'Piekarnia Maria', active: false, registrationDate: '2024-03-10' }
];

let mockOrders = [
    { id: 'ORD001', partnerId: 1, partnerName: 'Jan Kowalski', partnerEmail: 'partner1@example.com', date: '2024-11-20', products: [{ name: 'Ciasto czekoladowe', quantity: 5 }, { name: 'Chleb żytni', quantity: 10 }], total: 354.95, status: 'delivered' },
    { id: 'ORD002', partnerId: 2, partnerName: 'Anna Nowak', partnerEmail: 'partner2@example.com', date: '2024-11-22', products: [{ name: 'Ciastka maślane', quantity: 20 }], total: 360.00, status: 'processing' },
    { id: 'ORD003', partnerId: 1, partnerName: 'Jan Kowalski', partnerEmail: 'partner1@example.com', date: '2024-11-25', products: [{ name: 'Sernik klasyczny', quantity: 3 }], total: 114.00, status: 'pending' },
    { id: 'ORD004', partnerId: 4, partnerName: 'Maria Zielińska', partnerEmail: 'partner3@example.com', date: '2024-11-26', products: [{ name: 'Bagietka francuska', quantity: 50 }], total: 425.00, status: 'shipped' },
    { id: 'ORD005', partnerId: 2, partnerName: 'Anna Nowak', partnerEmail: 'partner2@example.com', date: '2024-11-28', products: [{ name: 'Ciasto czekoladowe', quantity: 2 }, { name: 'Sernik', quantity: 2 }], total: 167.98, status: 'pending' }
];

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
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
}


// Admin Dashboard
if (document.getElementById('totalPartners')) {
    // Statystyki
    document.getElementById('totalPartners').textContent = mockUsers.filter(u => u.active).length;
    document.getElementById('totalProducts').textContent = mockProducts.filter(p => p.available).length;
    document.getElementById('monthlyOrders').textContent = mockOrders.filter(o => new Date(o.date).getMonth() === new Date().getMonth()).length;
    const monthlyRev = mockOrders
        .filter(o => new Date(o.date).getMonth() === new Date().getMonth())
        .reduce((sum, o) => sum + o.total, 0);
    document.getElementById('monthlyRevenue').textContent = monthlyRev.toFixed(2) + ' PLN';

    // Ostatnie zamówienia
    const recentOrders = mockOrders.slice(-5).reverse();
    const tbody = document.getElementById('recentOrdersTable');
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.partnerName}</td>
            <td>${formatDate(order.date)}</td>
            <td>${order.products.length} produktów</td>
            <td>${order.total.toFixed(2)} PLN</td>
            <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusText(order.status)}</span></td>
        </tr>
    `).join('');
}

// Admin Products Page
if (document.getElementById('productsTable')) {
    let currentProductId = null;

    function renderProducts(filter = '', category = '') {
        const filtered = mockProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(filter.toLowerCase());
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
                <td><span class="badge ${product.available ? 'badge-success' : 'badge-danger'}">${product.available ? 'Dostępny' : 'Niedostępny'}</span></td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="editProduct(${product.id})">Edytuj</button>
                    <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Usuń</button>
                </td>
            </tr>
        `).join('');
    }

    renderProducts();

    document.getElementById('searchProduct').addEventListener('input', (e) => {
        renderProducts(e.target.value, document.getElementById('categoryFilter').value);
    });

    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        renderProducts(document.getElementById('searchProduct').value, e.target.value);
    });

    // Modal
    const modal = document.getElementById('productModal');
    const addBtn = document.getElementById('addProductBtn');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('productForm');

    addBtn.onclick = () => {
        currentProductId = null;
        document.getElementById('modalTitle').textContent = 'Dodaj produkt';
        form.reset();
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => modal.style.display = 'none';
    cancelBtn.onclick = () => modal.style.display = 'none';

    window.editProduct = (id) => {
        const product = mockProducts.find(p => p.id === id);
        if (product) {
            currentProductId = id;
            document.getElementById('modalTitle').textContent = 'Edytuj produkt';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productAvailable').checked = product.available;
            modal.style.display = 'block';
        }
    };

    window.deleteProduct = (id) => {
        if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            mockProducts = mockProducts.filter(p => p.id !== id);
            renderProducts();
            alert('Produkt został usunięty');
        }
    };

    form.onsubmit = (e) => {
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value || 'https://picsum.photos/200/200',
            available: document.getElementById('productAvailable').checked
        };

        if (currentProductId) {
            const index = mockProducts.findIndex(p => p.id === currentProductId);
            mockProducts[index] = { ...mockProducts[index], ...productData };
            alert('Produkt został zaktualizowany');
        } else {
            const newId = Math.max(...mockProducts.map(p => p.id)) + 1;
            mockProducts.push({ id: newId, ...productData });
            alert('Produkt został dodany');
        }

        renderProducts();
        modal.style.display = 'none';
    };
}

// Admin Users Page
if (document.getElementById('usersTable')) {
    let currentUserId = null;

    function renderUsers(filter = '', role = '', status = '') {
        const filtered = mockUsers.filter(u => {
            const matchesSearch = u.email.toLowerCase().includes(filter.toLowerCase()) ||
                                  `${u.firstName} ${u.lastName}`.toLowerCase().includes(filter.toLowerCase());
            const matchesRole = !role || u.role === role;
            const matchesStatus = !status || (status === 'active' && u.active) || (status === 'blocked' && !u.active);
            return matchesSearch && matchesRole && matchesStatus;
        });

        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = filtered.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.role}</td>
                <td><span class="badge ${user.active ? 'badge-success' : 'badge-danger'}">${user.active ? 'Aktywny' : 'Zablokowany'}</span></td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="editUser(${user.id})">Edytuj</button>
                    <button class="btn btn-small ${user.active ? 'btn-warning' : 'btn-success'}" onclick="toggleUserStatus(${user.id})">${user.active ? 'Blokuj' : 'Aktywuj'}</button>
                </td>
            </tr>
        `).join('');
    }

    renderUsers();

    document.getElementById('searchUser').addEventListener('input', (e) => {
        renderUsers(e.target.value, document.getElementById('roleFilter').value, document.getElementById('statusFilter').value);
    });

    document.getElementById('roleFilter').addEventListener('change', (e) => {
        renderUsers(document.getElementById('searchUser').value, e.target.value, document.getElementById('statusFilter').value);
    });

    document.getElementById('statusFilter').addEventListener('change', (e) => {
        renderUsers(document.getElementById('searchUser').value, document.getElementById('roleFilter').value, e.target.value);
    });

    // Modal
    const modal = document.getElementById('userModal');
    const addBtn = document.getElementById('addUserBtn');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelUserBtn');
    const form = document.getElementById('userForm');

    addBtn.onclick = () => {
        currentUserId = null;
        document.getElementById('modalTitle').textContent = 'Dodaj partnera';
        form.reset();
        document.getElementById('userPassword').parentElement.style.display = 'block';
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => modal.style.display = 'none';
    cancelBtn.onclick = () => modal.style.display = 'none';

    window.editUser = (id) => {
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            currentUserId = id;
            document.getElementById('modalTitle').textContent = 'Edytuj partnera';
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userFirstName').value = user.firstName;
            document.getElementById('userLastName').value = user.lastName;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userCompany').value = user.company;
            document.getElementById('userActive').checked = user.active;
            document.getElementById('userPassword').parentElement.style.display = 'none';
            modal.style.display = 'block';
        }
    };

    window.toggleUserStatus = (id) => {
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            user.active = !user.active;
            renderUsers();
            alert(`Użytkownik został ${user.active ? 'aktywowany' : 'zablokowany'}`);
        }
    };

    form.onsubmit = (e) => {
        const userData = {
            email: document.getElementById('userEmail').value,
            firstName: document.getElementById('userFirstName').value,
            lastName: document.getElementById('userLastName').value,
            role: document.getElementById('userRole').value,
            company: document.getElementById('userCompany').value,
            active: document.getElementById('userActive').checked
        };

        if (currentUserId) {
            const index = mockUsers.findIndex(u => u.id === currentUserId);
            mockUsers[index] = { ...mockUsers[index], ...userData };
            alert('Partner został zaktualizowany');
        } else {
            const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
            mockUsers.push({
                id: newId,
                ...userData,
                registrationDate: new Date().toISOString().split('T')[0]
            });
            alert('Partner został dodany');
        }

        renderUsers();
        modal.style.display = 'none';
    };
}

// Admin Orders Page
if (document.getElementById('ordersTable')) {
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredOrders = [...mockOrders];

    function renderOrders() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageOrders = filteredOrders.slice(startIndex, endIndex);

        const tbody = document.getElementById('ordersTable');
        tbody.innerHTML = pageOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.partnerName}</td>
                <td>${formatDate(order.date)}</td>
                <td>${order.products.length} produktów</td>
                <td>${order.total.toFixed(2)} PLN</td>
                <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusText(order.status)}</span></td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">Szczegóły</button>
                </td>
            </tr>
        `).join('');

        document.getElementById('pageInfo').textContent = `Strona ${currentPage} z ${Math.ceil(filteredOrders.length / itemsPerPage)}`;
    }

    renderOrders();

    document.getElementById('applyFilters').addEventListener('click', () => {
        const search = document.getElementById('searchOrder').value.toLowerCase();
        const status = document.getElementById('statusFilter').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        filteredOrders = mockOrders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(search) || order.partnerName.toLowerCase().includes(search);
            const matchesStatus = !status || order.status === status;
            const matchesDateFrom = !dateFrom || order.date >= dateFrom;
            const matchesDateTo = !dateTo || order.date <= dateTo;
            return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
        });

        currentPage = 1;
        renderOrders();
    });



    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderOrders();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
            currentPage++;
            renderOrders();
        }
    });

    // Modal szczegółów
    const modal = document.getElementById('orderModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';

    window.viewOrderDetails = (orderId) => {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
            document.getElementById('orderIdDetail').textContent = order.id;
            document.getElementById('detailPartner').textContent = order.partnerName;
            document.getElementById('detailEmail').textContent = order.partnerEmail;
            document.getElementById('detailDate').textContent = formatDate(order.date);
            document.getElementById('detailStatus').innerHTML = `<span class="badge ${getStatusBadgeClass(order.status)}">${getStatusText(order.status)}</span>`;
            document.getElementById('detailProducts').innerHTML = order.products.map(p => `<li>${p.name} - ${p.quantity} szt.</li>`).join('');
            document.getElementById('detailTotal').textContent = order.total.toFixed(2) + ' PLN';
            document.getElementById('updateStatus').value = order.status;

            document.getElementById('saveStatusBtn').onclick = () => {
                order.status = document.getElementById('updateStatus').value;
                alert('Status zamówienia został zaktualizowany');
                renderOrders();
                modal.style.display = 'none';
            };

            modal.style.display = 'block';
        }
    };
}

// Wylogowanie
const logoutBtns = document.querySelectorAll('#logoutBtn');
logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (confirm('Czy na pewno chcesz się wylogować?')) {
            window.location.href = 'login.html';
        }
    });
});