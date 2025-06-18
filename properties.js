import { initAuth, getCurrentUser } from './auth.js';

// Initialize auth on page load
initAuth();

// Sample property data
const sampleProperties = [
    {
        id: 1,
        title: 'Modern Family Home',
        type: 'house',
        price: 750000,
        area: 2500,
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        location: 'Beverly Hills, CA',
        description: 'Beautiful modern family home with spacious rooms, updated kitchen, and large backyard. Perfect for growing families.',
        image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        owner: 'Admin User',
        ownerId: 1,
        status: 'active',
        featured: true,
        dateAdded: '2024-12-15'
    },
    {
        id: 2,
        title: 'Downtown Luxury Apartment',
        type: 'apartment',
        price: 450000,
        area: 1200,
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
        location: 'Downtown Los Angeles, CA',
        description: 'Stunning luxury apartment in the heart of downtown with city views, modern amenities, and walking distance to everything.',
        image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
        owner: 'Admin User',
        ownerId: 1,
        status: 'active',
        featured: true,
        dateAdded: '2024-12-14'
    },
    {
        id: 3,
        title: 'Beachfront Condo',
        type: 'condo',
        price: 850000,
        area: 1800,
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
        location: 'Santa Monica, CA',
        description: 'Exclusive beachfront condo with panoramic ocean views, private balcony, and access to beach. Resort-style living.',
        image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        owner: 'John Doe',
        ownerId: 2,
        status: 'active',
        featured: true,
        dateAdded: '2024-12-13'
    },
    {
        id: 4,
        title: 'Commercial Office Space',
        type: 'commercial',
        price: 1200000,
        area: 3500,
        bedrooms: 0,
        bathrooms: 4,
        parking: 5,
        location: 'Century City, CA',
        description: 'Prime commercial office space in prestigious Century City. Perfect for corporate headquarters or medical practice.',
        image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800',
        owner: 'Admin User',
        ownerId: 1,
        status: 'active',
        featured: false,
        dateAdded: '2024-12-12'
    },
    {
        id: 5,
        title: 'Cozy Studio Apartment',
        type: 'apartment',
        price: 280000,
        area: 600,
        bedrooms: 1,
        bathrooms: 1,
        parking: 0,
        location: 'West Hollywood, CA',
        description: 'Charming studio apartment perfect for young professionals. Modern fixtures, efficient layout, great location.',
        image: 'https://images.pexels.com/photos/2980955/pexels-photo-2980955.jpeg?auto=compress&cs=tinysrgb&w=800',
        owner: 'John Doe',
        ownerId: 2,
        status: 'active',
        featured: false,
        dateAdded: '2024-12-11'
    },
    {
        id: 6,
        title: 'Suburban Family House',
        type: 'house',
        price: 550000,
        area: 2200,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        location: 'Pasadena, CA',
        description: 'Beautiful suburban home with large yard, updated interiors, and quiet neighborhood. Great schools nearby.',
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        owner: 'Admin User',
        ownerId: 1,
        status: 'active',
        featured: false,
        dateAdded: '2024-12-10'
    }
];

// Initialize properties in localStorage
function initializeProperties() {
    if (!localStorage.getItem('properties')) {
        localStorage.setItem('properties', JSON.stringify(sampleProperties));
    }
}

// Get all properties
function getAllProperties() {
    return JSON.parse(localStorage.getItem('properties') || '[]');
}

// Save properties
function saveProperties(properties) {
    localStorage.setItem('properties', JSON.stringify(properties));
}

// Get property by ID
function getPropertyById(id) {
    const properties = getAllProperties();
    return properties.find(p => p.id === parseInt(id));
}

// Add new property
function addProperty(propertyData) {
    const properties = getAllProperties();
    const user = getCurrentUser();
    
    const newProperty = {
        id: Date.now(),
        ...propertyData,
        owner: user.name,
        ownerId: user.id,
        status: user.role === 'admin' ? (propertyData.status || 'active') : 'pending',
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    properties.push(newProperty);
    saveProperties(properties);
    
    return newProperty;
}

// Update property
function updateProperty(id, updateData) {
    const properties = getAllProperties();
    const index = properties.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
        properties[index] = { ...properties[index], ...updateData };
        saveProperties(properties);
        return properties[index];
    }
    
    return null;
}

// Delete property
function deleteProperty(id) {
    const properties = getAllProperties();
    const filteredProperties = properties.filter(p => p.id !== parseInt(id));
    saveProperties(filteredProperties);
}

// Get properties by user
function getPropertiesByUser(userId) {
    const properties = getAllProperties();
    return properties.filter(p => p.ownerId === userId);
}

// Get featured properties
function getFeaturedProperties() {
    const properties = getAllProperties();
    return properties.filter(p => p.featured && p.status === 'active').slice(0, 6);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Create property card HTML
function createPropertyCard(property) {
    const priceFormatted = formatPrice(property.price);
    const imageUrl = property.image || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';
    
    return `
        <div class="property-card" data-id="${property.id}">
            <div class="relative overflow-hidden">
                <img src="${imageUrl}" alt="${property.title}" class="property-image w-full h-48 object-cover">
                <div class="absolute top-4 left-4">
                    <span class="badge ${property.status === 'active' ? 'badge-success' : property.status === 'pending' ? 'badge-warning' : 'badge-danger'}">
                        ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                </div>
                ${property.featured ? '<div class="absolute top-4 right-4"><span class="badge badge-info">Featured</span></div>' : ''}
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold text-gray-900 line-clamp-1">${property.title}</h3>
                    <span class="price-highlight">${priceFormatted}</span>
                </div>
                <p class="text-gray-600 mb-3 flex items-center">
                    <i class="fas fa-map-marker-alt mr-2"></i>${property.location}
                </p>
                <p class="text-gray-600 mb-4 line-clamp-2">${property.description}</p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span><i class="fas fa-bed mr-1"></i>${property.bedrooms} bed</span>
                    <span><i class="fas fa-bath mr-1"></i>${property.bathrooms} bath</span>
                    <span><i class="fas fa-car mr-1"></i>${property.parking} parking</span>
                    <span><i class="fas fa-expand-arrows-alt mr-1"></i>${property.area} sq ft</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">by ${property.owner}</span>
                    <button onclick="contactOwner(${property.id})" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        <i class="fas fa-envelope mr-2"></i>Contact
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Contact owner function
window.contactOwner = function(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to contact property owners.');
        window.location.href = 'login.html';
        return;
    }
    
    // Create contact message
    const message = `Hi ${property.owner},\n\nI'm interested in your property "${property.title}" listed at ${formatPrice(property.price)}.\n\nCould you please provide more information?\n\nThanks,\n${user.name}\n${user.email}\n${user.phone}`;
    
    // Create mailto link
    const subject = encodeURIComponent(`Inquiry about ${property.title}`);
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:admin@propertyhub.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
};

// Load featured properties for home page
function loadFeaturedProperties() {
    initializeProperties();
    const featuredContainer = document.getElementById('featuredProperties');
    if (!featuredContainer) return;
    
    const featured = getFeaturedProperties();
    
    if (featured.length === 0) {
        featuredContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">No featured properties available.</p>';
        return;
    }
    
    featuredContainer.innerHTML = featured.map(createPropertyCard).join('');
}

// Filter and search properties
function filterProperties(filters) {
    let properties = getAllProperties().filter(p => p.status === 'active');
    
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        properties = properties.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.location.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }
    
    if (filters.type) {
        properties = properties.filter(p => p.type === filters.type);
    }
    
    if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        properties = properties.filter(p => p.price >= min && p.price <= max);
    }
    
    if (filters.bedrooms) {
        const bedrooms = parseInt(filters.bedrooms);
        properties = properties.filter(p => {
            if (bedrooms === 4) {
                return p.bedrooms >= 4;
            }
            return p.bedrooms === bedrooms;
        });
    }
    
    return properties;
}

// Sort properties
function sortProperties(properties, sortBy) {
    switch (sortBy) {
        case 'price-low':
            return properties.sort((a, b) => a.price - b.price);
        case 'price-high':
            return properties.sort((a, b) => b.price - a.price);
        case 'newest':
        default:
            return properties.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
}

// Load and display properties on properties page
function loadProperties() {
    initializeProperties();
    const propertiesGrid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (!propertiesGrid) return;
    
    // Get current filters
    const filters = {
        search: document.getElementById('searchInput')?.value || '',
        type: document.getElementById('typeFilter')?.value || '',
        priceRange: document.getElementById('priceFilter')?.value || '',
        bedrooms: document.getElementById('bedroomFilter')?.value || ''
    };
    
    // Get sort option
    const sortBy = document.getElementById('sortFilter')?.value || 'newest';
    
    // Filter and sort properties
    let properties = filterProperties(filters);
    properties = sortProperties(properties, sortBy);
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `Showing ${properties.length} properties`;
    }
    
    // Display properties or no results message
    if (properties.length === 0) {
        propertiesGrid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
    } else {
        if (noResults) noResults.classList.add('hidden');
        propertiesGrid.innerHTML = properties.map(createPropertyCard).join('');
    }
}

// Initialize properties page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on properties page
    if (document.getElementById('propertiesGrid')) {
        loadProperties();
        
        // Add event listeners for filters
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const priceFilter = document.getElementById('priceFilter');
        const bedroomFilter = document.getElementById('bedroomFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', loadProperties);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loadProperties();
                }
            });
        }
        
        [typeFilter, priceFilter, bedroomFilter, sortFilter].forEach(element => {
            if (element) {
                element.addEventListener('change', loadProperties);
            }
        });
    }
});

export {
    initializeProperties,
    getAllProperties,
    saveProperties,
    getPropertyById,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByUser,
    getFeaturedProperties,
    loadFeaturedProperties,
    formatPrice,
    createPropertyCard
};