import { 
    initAuth, 
    getCurrentUser, 
    protectAdminRoute,
    getUsers,
    saveUsers
} from './auth.js';
import { 
    getAllProperties, 
    saveProperties, 
    addProperty, 
    formatPrice 
} from './properties.js';

// Protect this route - require admin access
if (!protectAdminRoute()) {
    // Will redirect if not admin
}

// Initialize auth
initAuth();

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active', 'border-primary-600', 'text-primary-600'));
            tabButtons.forEach(btn => btn.classList.add('border-transparent', 'text-gray-500'));
            
            // Add active class to clicked button
            button.classList.add('active', 'border-primary-600', 'text-primary-600');
            button.classList.remove('border-transparent', 'text-gray-500');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show selected tab content
            const selectedTab = document.getElementById(`${tabName}-tab`);
            if (selectedTab) {
                selectedTab.classList.remove('hidden');
            }
            
            // Load appropriate data
            if (tabName === 'properties') {
                loadPropertiesTable();
            } else if (tabName === 'users') {
                loadUsersTable();
            }
        });
    });
}

// Load admin statistics
function loadAdminStats() {
    const properties = getAllProperties();
    const users = getUsers();
    
    const totalPropertiesCount = document.getElementById('totalPropertiesCount');
    const activeUsersCount = document.getElementById('activeUsersCount');
    const pendingApprovalsCount = document.getElementById('pendingApprovalsCount');
    
    if (totalPropertiesCount) totalPropertiesCount.textContent = properties.length;
    if (activeUsersCount) activeUsersCount.textContent = users.length;
    if (pendingApprovalsCount) pendingApprovalsCount.textContent = properties.filter(p => p.status === 'pending').length;
}

// Load properties table
function loadPropertiesTable() {
    const properties = getAllProperties();
    const propertiesTable = document.getElementById('propertiesTable');
    const statusFilter = document.getElementById('propertyStatusFilter');
    
    if (!propertiesTable) return;
    
    let filteredProperties = properties;
    
    // Apply status filter
    if (statusFilter && statusFilter.value) {
        filteredProperties = properties.filter(p => p.status === statusFilter.value);
    }
    
    if (filteredProperties.length === 0) {
        propertiesTable.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No properties found
                </td>
            </tr>
        `;
        return;
    }
    
    propertiesTable.innerHTML = filteredProperties.map(property => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <img src="${property.image || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=100'}" 
                         alt="${property.title}" class="w-12 h-12 rounded-lg object-cover mr-3">
                    <div>
                        <div class="font-medium text-gray-900">${property.title}</div>
                        <div class="text-sm text-gray-500">${property.location}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 capitalize">${property.type}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${formatPrice(property.price)}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${property.owner}</td>
            <td class="px-6 py-4">
                <span class="badge ${property.status === 'active' ? 'badge-success' : property.status === 'pending' ? 'badge-warning' : 'badge-danger'}">
                    ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="approveProperty(${property.id})" class="text-green-600 hover:text-green-900" title="Approve">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="editAdminProperty(${property.id})" class="text-blue-600 hover:text-blue-900" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAdminProperty(${property.id})" class="text-red-600 hover:text-red-900" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load users table
function loadUsersTable() {
    const users = getUsers();
    const usersTable = document.getElementById('usersTable');
    const roleFilter = document.getElementById('userRoleFilter');
    
    if (!usersTable) return;
    
    let filteredUsers = users;
    
    // Apply role filter
    if (roleFilter && roleFilter.value) {
        filteredUsers = users.filter(u => u.role === roleFilter.value);
    }
    
    if (filteredUsers.length === 0) {
        usersTable.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No users found
                </td>
            </tr>
        `;
        return;
    }
    
    usersTable.innerHTML = filteredUsers.map(user => {
        const userProperties = getAllProperties().filter(p => p.ownerId === user.id);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fas fa-user text-primary-600"></i>
                        </div>
                        <div class="font-medium text-gray-900">${user.name}</div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${user.email}</td>
                <td class="px-6 py-4">
                    <span class="badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}">
                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${userProperties.length}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${user.joinedDate}</td>
                <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="toggleUserRole(${user.id})" class="text-blue-600 hover:text-blue-900" title="Toggle Role">
                            <i class="fas fa-user-cog"></i>
                        </button>
                        <button onclick="viewUserProperties(${user.id})" class="text-green-600 hover:text-green-900" title="View Properties">
                            <i class="fas fa-home"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Property management functions
window.approveProperty = function(propertyId) {
    const properties = getAllProperties();
    const property = properties.find(p => p.id === propertyId);
    
    if (property) {
        property.status = 'active';
        saveProperties(properties);
        loadPropertiesTable();
        loadAdminStats();
        alert('Property approved successfully!');
    }
};

window.editAdminProperty = function(propertyId) {
    alert('Edit functionality will be implemented in a future update.');
};

window.deleteAdminProperty = function(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        const properties = getAllProperties();
        const filteredProperties = properties.filter(p => p.id !== propertyId);
        saveProperties(filteredProperties);
        loadPropertiesTable();
        loadAdminStats();
        alert('Property deleted successfully!');
    }
};

// User management functions
window.toggleUserRole = function(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user && user.id !== 1) { // Don't allow changing the main admin
        user.role = user.role === 'admin' ? 'user' : 'admin';
        saveUsers(users);
        loadUsersTable();
        alert(`User role changed to ${user.role}!`);
    } else {
        alert('Cannot change the main admin role.');
    }
};

window.viewUserProperties = function(userId) {
    const properties = getAllProperties().filter(p => p.ownerId === userId);
    const user = getUsers().find(u => u.id === userId);
    
    if (properties.length === 0) {
        alert(`${user.name} has no properties listed.`);
        return;
    }
    
    const propertyList = properties.map(p => `• ${p.title} - ${formatPrice(p.price)} (${p.status})`).join('\n');
    alert(`${user.name}'s Properties:\n\n${propertyList}`);
};

// Add property modal for admin
function initializeAdminAddPropertyModal() {
    const addAdminPropertyBtn = document.getElementById('addAdminPropertyBtn');
    const addAdminPropertyModal = document.getElementById('addAdminPropertyModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const cancelAdminAdd = document.getElementById('cancelAdminAdd');
    const addAdminPropertyForm = document.getElementById('addAdminPropertyForm');
    
    if (addAdminPropertyBtn) {
        addAdminPropertyBtn.addEventListener('click', () => {
            addAdminPropertyModal.classList.remove('hidden');
            addAdminPropertyModal.classList.add('flex');
        });
    }
    
    [closeAdminModal, cancelAdminAdd].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                addAdminPropertyModal.classList.add('hidden');
                addAdminPropertyModal.classList.remove('flex');
                addAdminPropertyForm.reset();
            });
        }
    });
    
    if (addAdminPropertyForm) {
        addAdminPropertyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(addAdminPropertyForm);
            const propertyData = {
                title: formData.get('title'),
                type: formData.get('type'),
                price: parseInt(formData.get('price')),
                area: parseInt(formData.get('area')),
                bedrooms: parseInt(formData.get('bedrooms')),
                bathrooms: parseInt(formData.get('bathrooms')),
                parking: parseInt(formData.get('parking')),
                location: formData.get('location'),
                description: formData.get('description'),
                image: formData.get('image') || '',
                status: formData.get('status')
            };
            
            const newProperty = addProperty(propertyData);
            
            if (newProperty) {
                alert('Property added successfully!');
                addAdminPropertyModal.classList.add('hidden');
                addAdminPropertyModal.classList.remove('flex');
                addAdminPropertyForm.reset();
                loadPropertiesTable();
                loadAdminStats();
            } else {
                alert('Error adding property. Please try again.');
            }
        });
    }
}

// Initialize filters
function initializeFilters() {
    const propertyStatusFilter = document.getElementById('propertyStatusFilter');
    const userRoleFilter = document.getElementById('userRoleFilter');
    
    if (propertyStatusFilter) {
        propertyStatusFilter.addEventListener('change', loadPropertiesTable);
    }
    
    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', loadUsersTable);
    }
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', () => {
    loadAdminStats();
    initializeTabs();
    initializeAdminAddPropertyModal();
    initializeFilters();
    
    // Load initial data
    loadPropertiesTable();
});