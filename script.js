let cart = [];
let currentFilter = 'all';

const products = [
    {
        id: 1,
        name: "Elegant Evening Dress",
        category: "women",
        price: 299.99,
        originalPrice: 399.99,
        image: "👗",
        rating: 4.8,
        reviews: 124,
        onSale: true
    },
    {
        id: 2,
        name: "Classic Business Suit",
        category: "men",
        price: 599.99,
        originalPrice: 699.99,
        image: "👔",
        rating: 4.9,
        reviews: 89,
        onSale: true
    },
    {
        id: 3,
        name: "Designer Handbag",
        category: "accessories",
        price: 249.99,
        originalPrice: null,
        image: "👜",
        rating: 4.7,
        reviews: 156,
        onSale: false
    },
    {
        id: 4,
        name: "Premium Leather Shoes",
        category: "shoes",
        price: 179.99,
        originalPrice: 229.99,
        image: "👠",
        rating: 4.6,
        reviews: 93,
        onSale: true
    },
    {
        id: 5,
        name: "Casual Summer Dress",
        category: "women",
        price: 89.99,
        originalPrice: null,
        image: "👗",
        rating: 4.5,
        reviews: 67,
        onSale: false
    },
    {
        id: 6,
        name: "Sports Casual Wear",
        category: "men",
        price: 79.99,
        originalPrice: 99.99,
        image: "👕",
        rating: 4.4,
        reviews: 45,
        onSale: true
    },
    {
        id: 7,
        name: "Statement Necklace",
        category: "accessories",
        price: 129.99,
        originalPrice: null,
        image: "📿",
        rating: 4.8,
        reviews: 78,
        onSale: false
    },
    {
        id: 8,
        name: "Running Sneakers",
        category: "shoes",
        price: 159.99,
        originalPrice: 199.99,
        image: "👟",
        rating: 4.7,
        reviews: 112,
        onSale: true
    }
];

document.addEventListener('DOMContentLoaded', function(){
    displayProducts(products);
    updateCartUI();
    setupEventListeners();
});

function setupEventListeners(){
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCartBtn').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart); // Fixed: Added missing semicolon

    document.getElementById('checkoutBtn').addEventListener('click', checkout);

    // Fixed: Added missing dot before 'filter-btn'
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(){
            filterProducts(this.dataset.filter);
        });
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            filterProducts(this.dataset.category);
            document.getElementById('products').scrollIntoView({behavior: 'smooth'});
        });
    });

    // Fixed: 'inout' should be 'input'
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        // Fixed: 'products' should be 'product' and 'PerformanceResourceTiming.name' should be 'product.name'
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Fixed: 'a[href^-"#"]' should be 'a[href^="#"]'
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e){
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar.classList.contains('open')) {
                toggleCart();
            }
        }
    });
}

// Fixed: Moved displayProducts function outside of setupEventListeners
function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image}
                ${product.onSale ? '<div class="sale-badge">SALE</div>' : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</div>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // Add event listener to the add to cart button
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', function() {
            addToCart(parseInt(this.dataset.productId));
        });
        
        productGrid.appendChild(productCard);
    });
}

function filterProducts(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });

    // Filter products
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    displayProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification('Item added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-light);">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-product-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-product-id="${item.id}" data-change="1">+</button>
                        <button class="remove-item" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            
            // Add event listeners for quantity buttons
            const quantityBtns = cartItem.querySelectorAll('.quantity-btn');
            quantityBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    updateQuantity(parseInt(this.dataset.productId), parseInt(this.dataset.change));
                });
            });
            
            // Add event listener for remove button
            const removeBtn = cartItem.querySelector('.remove-item');
            removeBtn.addEventListener('click', function() {
                removeFromCart(parseInt(this.dataset.productId));
            });
            
            cartItems.appendChild(cartItem);
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Simulate checkout process
    showNotification('Redirecting to secure checkout...');
    
    setTimeout(() => {
        alert(`Checkout Summary:\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with Your Majesty's Fashion!\n\nIn a real store, this would redirect to a payment processor like Stripe or PayPal.`);
        
        // Clear cart after successful checkout
        cart = [];
        updateCartUI();
        toggleCart();
    }, 1500);
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});