// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #dc2626, #991b1b)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #D4AF37, #B8941F)';
    }

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        // Walidacja podstawowa
        if (!email || !password) {
            showToast('Wypełnij wszystkie pola', 'error');
            return;
        }

        // Symulacja logowania (bez backendu)
        console.log('Login attempt:', { email });

        // Zapisz "zalogowanego" użytkownika w localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        showToast('Zalogowano pomyślnie!');

        // Przekierowanie po 1 sekundzie
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
}

// Register form handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {

        const formData = new FormData(registerForm);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Walidacja
        if (!fullName || !email || !password || !confirmPassword) {
            showToast('Wypełnij wszystkie pola', 'error');
            return;
        }

        if (password.length < 8) {
            showToast('Hasło musi mieć minimum 8 znaków', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Hasła nie są identyczne', 'error');
            return;
        }

        // Symulacja rejestracji (bez backendu)
        console.log('Registration attempt:', { fullName, email });

        showToast('Konto utworzone pomyślnie!');

        // Przekierowanie do logowania po 1 sekundzie
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}
