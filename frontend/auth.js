document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authError = document.getElementById('authError');

    // Dummy users for demo (stored in localStorage)
    let users = JSON.parse(localStorage.getItem('healthGuardUsers')) || [];

    function showError(msg) {
        if (authError) {
            authError.textContent = msg;
            authError.classList.remove('hidden');
            setTimeout(() => authError.classList.add('hidden'), 4000);
        }
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Check if user exists
            if (users.find(u => u.email === email)) {
                showError('User with this email already exists!');
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('healthGuardUsers', JSON.stringify(users));
            
            // Auto-login after signup
            localStorage.setItem('healthGuardActiveUser', JSON.stringify(newUser));
            window.location.href = 'index.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                // If remember me is checked, we could set a flag or use localStorage instead of sessionStorage.
                // We use localStorage here to keep it simple.
                localStorage.setItem('healthGuardActiveUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                showError('Invalid email or password.');
            }
        });
    }
});
