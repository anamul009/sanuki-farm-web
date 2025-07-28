document.addEventListener('DOMContentLoaded', () => {

    // --- SHARED SHOPPING CART LOGIC (USES localStorage) ---
    let cart = JSON.parse(localStorage.getItem('sanukiFarmCart')) || [];
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');

    function saveCart() {
        localStorage.setItem('sanukiFarmCart', JSON.stringify(cart));
    }

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price: parseFloat(price) || 0, quantity: 1 });
        }
        saveCart();
        updateCartUI();
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        saveCart();
        updateCartUI();
    }

    function updateCartUI() {
        updateCartIcon();
        if (cartItemsContainer) {
            displayCartItems();
        }
    }

    function updateCartIcon() {
        if (!cartBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }

    function displayCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-stone-400">Your cart is empty.</p>';
            cartSubtotalEl.textContent = '¥0';
            return;
        }
        let subtotal = 0;
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'flex items-center gap-4 py-2 text-white';
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            itemEl.innerHTML = `
              <div class="flex-grow"> <p class="font-bold">${item.name}</p> <p class="text-sm text-stone-400">Quantity: ${item.quantity}</p> </div>
              <p class="font-semibold">¥${itemTotal.toLocaleString()}</p>
              <button class="remove-from-cart-btn btn btn-xs btn-ghost text-red-500" data-name="${item.name}">✕</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
        cartSubtotalEl.textContent = `¥${subtotal.toLocaleString()}`;
        addRemoveEventListeners();
    }

    function addRemoveEventListeners() {
        const removeButtons = document.querySelectorAll('.remove-from-cart-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const nameToRemove = e.currentTarget.dataset.name;
                removeFromCart(nameToRemove);
            });
        });
    }

    const allAddToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    allAddToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = button.dataset.price;
            addToCart(name, price);
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
            button.classList.add('bg-green-500');
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('bg-green-500');
            }, 1500);
        });
    });
    
    updateCartUI();

    // --- LOGIC FOR index.html ---
    const mainPageHero = document.getElementById('product-pretitle');
    if (mainPageHero) {
        const productsData = [
            { pretitle: "贅沢な一粒をどうぞ。", name: "シャインマスカット", description: "果汁たっぷりで濃厚な甘さが特徴です。 一粒食べれば口いっぱいに広がる芳醇な香りとジューシーな味わい。", image: "img/img (2).png", backgrounds: ["img/bg-1-01.jpg", "img/bg-3-01.jpg"], detailsPage: "shine-muscat.html" },
            { pretitle: "とろけるような甘さと香り。", name: "贅沢な桃", description: "ひと口食べれば、上品な香りとジューシーな味わいが口いっぱいに広がります。その美しさと繊細な風味は、まさに夏のごちそう", image: "img/img (4).png", backgrounds: ["img/bg-5-01.jpg", "img/bg-6-01.jpg"], detailsPage: "luxury-peach.html" },
        ];
        const backgroundPanes = document.querySelectorAll(".background-slideshow div");
        let backgroundInterval;
        function startBackgroundSlideshow(images) {
            clearInterval(backgroundInterval);
            backgroundPanes.forEach((pane) => { pane.style.opacity = 0; });
            let currentBgIndex = 0;
            if (images && images.length > 0) {
                backgroundPanes[0].style.backgroundImage = `url('${images[currentBgIndex]}')`;
                backgroundPanes[0].style.opacity = 1;
                if (images.length > 1) {
                    backgroundInterval = setInterval(() => {
                        let visiblePaneIndex = Array.from(backgroundPanes).findIndex((p) => p.style.opacity == 1);
                        if (visiblePaneIndex === -1) visiblePaneIndex = 0;
                        backgroundPanes[visiblePaneIndex].style.opacity = 0;
                        const nextPaneIndex = (visiblePaneIndex + 1) % backgroundPanes.length;
                        currentBgIndex = (currentBgIndex + 1) % images.length;
                        backgroundPanes[nextPaneIndex].style.backgroundImage = `url('${images[currentBgIndex]}')`;
                        backgroundPanes[nextPaneIndex].style.opacity = 1;
                    }, 4000);
                }
            }
        }
        let currentProductIndex = 0;
        const nameEl = document.getElementById("product-name");
        const descriptionEl = document.getElementById("product-description");
        const imageEl = document.getElementById("product-image");
        const textContentContainer = document.getElementById("product-text-container");
        const imageContainer = document.getElementById("product-image-container");
        const prevBtn = document.getElementById("prev-product");
        const nextBtn = document.getElementById("next-product");
        const dotsContainer = document.getElementById("pagination-dots");
        function displayProduct(index) {
            const product = productsData[index];
            if(textContentContainer) textContentContainer.style.opacity = 0;
            if(imageContainer) imageContainer.style.opacity = 0;
            setTimeout(() => {
                mainPageHero.textContent = product.pretitle;
                nameEl.textContent = product.name;
                descriptionEl.textContent = product.description;
                imageEl.src = product.image;
                imageEl.alt = product.name;
                document.getElementById('more-info-link').href = product.detailsPage;
                if(textContentContainer) textContentContainer.style.opacity = 1;
                if(imageContainer) imageContainer.style.opacity = 1;
            }, 300);
            startBackgroundSlideshow(product.backgrounds);
            updateDots(index);
        }
        function updateDots(activeIndex) {
            dotsContainer.innerHTML = "";
            productsData.forEach((_, index) => {
                const dot = document.createElement("a");
                dot.href = "#";
                dot.classList.add("block", "h-2", "w-2", "rounded-full", "transition-colors");
                if (index === activeIndex) { dot.classList.add("bg-white"); } else { dot.classList.add("bg-white/40"); }
                dot.addEventListener("click", (e) => { e.preventDefault(); currentProductIndex = index; displayProduct(currentProductIndex); });
                dotsContainer.appendChild(dot);
            });
        }
        nextBtn.addEventListener("click", (e) => { e.preventDefault(); currentProductIndex = (currentProductIndex + 1) % productsData.length; displayProduct(currentProductIndex); });
        prevBtn.addEventListener("click", (e) => { e.preventDefault(); currentProductIndex = (currentProductIndex - 1 + productsData.length) % productsData.length; displayProduct(currentProductIndex); });
        displayProduct(currentProductIndex);
    }

    // --- LOGIC FOR product-detail.html pages ---
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.style.opacity = 0;
                setTimeout(() => {
                    mainImage.src = thumb.src;
                    mainImage.style.opacity = 1;
                }, 300);
            });
        });
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.add('hidden'));
                button.classList.add('active');
                const targetPanel = document.getElementById(button.dataset.target);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');
                }
            });
        });
    }
    
    // --- SHARED LOGIC FOR ALL PAGES ---
    const mobileMenuLinks = document.querySelectorAll(".fullscreen-menu a");
    const menuToggleCheckbox = document.getElementById("menu-toggle");
    mobileMenuLinks.forEach((link) => { link.addEventListener("click", () => { menuToggleCheckbox.checked = false; }); });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, { threshold: 0.1 });
    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach((section) => { observer.observe(section); });

    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if(scrollToTopBtn){
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.remove('opacity-0', 'invisible');
                scrollToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                scrollToTopBtn.classList.remove('opacity-100', 'visible');
                scrollToTopBtn.classList.add('opacity-0', 'invisible');
            }
        });
    }
});