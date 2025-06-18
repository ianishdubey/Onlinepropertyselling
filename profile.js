import { 
    initAuth, 
    getCurrentUser, 
    isAdmin, 
    protectAuthenticatedRoute 
} from './auth.js';
import { 
    getPropertiesByUser, 
    addProperty, 
    formatPrice, 
    getAllProperties 
} from './properties.js';

// Protect this route - require authentication
if (!protectAuthenticatedRoute()) {
    // Will redirect to login if not authenticated
}

// Initialize auth
initAuth();

// Load user profile data
function loadUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update profile display
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    
    if (userNameDisplay) userNameDisplay.textContent = user.name;
    if (userEmailDisplay) userEmailDisplay.textContent = user.email;
    if (userRoleDisplay) userRoleDisplay.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    
    // Show admin panel if user is admin
    if (isAdmin()) {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.remove('hidden');
            loadAdminStats();
        }
    }
    
    // Load user's properties
    loadUserProperties();
    loadRecentActivity();
}

// Load admin statistics
function loadAdminStats() {
    const properties = getAllProperties();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const totalProperties = document.getElementById('totalProperties');
    const activeUsers = document.getElementById('activeUsers');
    const pendingApprovals = document.getElementById('pendingApprovals');
    
    if (totalProperties) totalProperties.textContent = properties.length;
    if (activeUsers) activeUsers.textContent = users.length;
    if (pendingApprovals) pendingApprovals.textContent = properties.filter(p => p.status === 'pending').length;
}

// Load user's properties
function loadUserProperties() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userProperties = getPropertiesByUser(user.id);
    const propertiesContainer = document.getElementById('userProperties');
    const propertyCount = document.getElementById('userPropertyCount');
    
    if (propertyCount) propertyCount.textContent = userProperties.length;
    
    if (!propertiesContainer) return;
    
    if (userProperties.length === 0) {
        propertiesContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-home text-4xl mb-4"></i>
                <p>You haven't listed any properties yet.</p>
                <p class="text-sm">Click "Add Property" to get started.</p>
            </div>
        `;
        return;
    }
    
    propertiesContainer.innerHTML = userProperties.map(property => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">${property.title}</h3>
                    <p class="text-gray-600 text-sm">${property.location}</p>
                    <p class="text-primary-600 font-semibold">${formatPrice(property.price)}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="badge ${property.status === 'active' ? 'badge-success' : property.status === 'pending' ? 'badge-warning' : 'badge-danger'}">
                        ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                    <button onclick="editProperty(${property.id})" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUserProperty(${property.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
                <span><i class="fas fa-bed mr-1"></i>${property.bedrooms} bed</span>
                <span><i class="fas fa-bath mr-1"></i>${property.bathrooms} bath</span>
                <span><i class="fas fa-expand-arrows-alt mr-1"></i>${property.area} sq ft</span>
            </div>
        </div>
    `).join('');
}

// Load recent activity
function loadRecentActivity() {
    const user = getCurrentUser();
    if (!user) return;
    
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    // Mock recent activity data
    const activities = [
        {
            type: 'property_added',
            message: 'You listed a new property',
            date: '2 days ago',
            icon: 'fas fa-plus-circle text-green-600'
        },
        {
            type: 'inquiry_received',
            message: 'You received an inquiry for Modern Family Home',
            date: '3 days ago',
            icon: 'fas fa-envelope text-blue-600'
        },
        {
            type: 'profile_updated',
            message: 'You updated your profile information',
            date: '1 week ago',
            icon: 'fas fa-user-edit text-orange-600'
        }
    ];
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <i class="${activity.icon} text-xl"></i>
            <div class="flex-1">
                <p class="text-gray-900">${activity.message}</p>
                <p class="text-sm text-gray-500">${activity.date}</p>
            </div>
        </div>
    `).join('');
}

// Add property modal functionality
function initializeAddPropertyModal() {
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const addPropertyModal = document.getElementById('addPropertyModal');
    const closeModal = document.getElementById('closeModal');
    const cancelAdd = document.getElementById('cancelAdd');
    const addPropertyForm = document.getElementById('addPropertyForm');
    
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', () => {
            addPropertyModal.classList.remove('hidden');
            addPropertyModal.classList.add('flex');
        });
    }
    
    [closeModal, cancelAdd].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                addPropertyModal.classList.add('hidden');
                addPropertyModal.classList.remove('flex');
                addPropertyForm.reset();
            });
        }
    });
    
    if (addPropertyForm) {
        addPropertyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(addPropertyForm);
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
                image: formData.get('image') || ''
            };
            
            const newProperty = addProperty(propertyData);
            
            if (newProperty) {
                alert('Property added successfully!');
                addPropertyModal.classList.add('hidden');
                addPropertyModal.classList.remove('flex');
                addPropertyForm.reset();
                loadUserProperties();
                
                // Update admin stats if admin
                if (isAdmin()) {
                    loadAdminStats();
                }
            } else {
                alert('Error adding property. Please try again.');
            }
        });
    }
}

// Delete property function
window.deleteUserProperty = function(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const filteredProperties = properties.filter(p => p.id !== propertyId);
        localStorage.setItem('properties', JSON.stringify(filteredProperties));
        
        loadUserProperties();
        
        // Update admin stats if admin
        if (isAdmin()) {
            loadAdminStats();
        }
        
        alert('Property deleted successfully!');
    }
};

// Edit property function (placeholder)
window.editProperty = function(propertyId) {
    alert('Edit functionality will be implemented in a future update.');
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initializeAddPropertyModal();
});