// User authentication system

// Default users
const defaultUsers = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@propertyhub.com',
        password: 'admin123',
        phone: '+1 (555) 123-4567',
        role: 'admin',
        joinedDate: '2024-01-01'
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'user@example.com',
        password: 'user123',
        phone: '+1 (555) 987-6543',
        role: 'user',
        joinedDate: '2024-06-15'
    }
];

// Initialize users in localStorage if not exists
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

// Get all users
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Clear current user
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// Login function
function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        return { success: true, user };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

// Register function
function register(userData) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: 'user',
        joinedDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    
    return { success: true, user: newUser };
}

// Logout function
function logout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Update authentication UI
function updateAuthUI() {
    const user = getCurrentUser();
    const loginLinks = document.querySelectorAll('#loginLink, #mobileLoginLink');
    const profileLinks = document.querySelectorAll('#profileLink, #mobileProfileLink');
    const logoutBtns = document.querySelectorAll('#logoutBtn, #mobileLogoutBtn');
    
    if (user) {
        // User is logged in
        loginLinks.forEach(link => link.classList.add('hidden'));
        profileLinks.forEach(link => link.classList.remove('hidden'));
        logoutBtns.forEach(btn => btn.classList.remove('hidden'));
    } else {
        // User is not logged in
        loginLinks.forEach(link => link.classList.remove('hidden'));
        profileLinks.forEach(link => link.classList.add('hidden'));
        logoutBtns.forEach(btn => btn.classList.add('hidden'));
    }
}

// Initialize authentication system
function initAuth() {
    initializeUsers();
    updateAuthUI();
    
    // Add logout event listeners
    document.querySelectorAll('#logoutBtn, #mobileLogoutBtn').forEach(btn => {
        btn.addEventListener('click', logout);
    });
}

// Login form handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const loginFormContainer = document.getElementById('loginForm');
    const registerFormContainer = document.getElementById('registerForm');
    
    // Switch between login and register forms
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            registerFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = login(email, password);
            
            if (result.success) {
                // Redirect based on user role
                if (result.user.role === 'admin') {
                    window.location.href = 'profile.html';
                } else {
                    window.location.href = 'profile.html';
                }
            } else {
                alert(result.message);
            }
        });
    }
    
    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            const result = register({ name, email, phone, password });
            
            if (result.success) {
                window.location.href = 'profile.html';
            } else {
                alert(result.message);
            }
        });
    }
});

// Protect admin routes
function protectAdminRoute() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'profile.html';
        return false;
    }
    
    return true;
}

// Protect authenticated routes
function protectAuthenticatedRoute() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

export {
    initAuth,
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    updateAuthUI,
    protectAdminRoute,
    protectAuthenticatedRoute,
    getUsers,
    saveUsers
};