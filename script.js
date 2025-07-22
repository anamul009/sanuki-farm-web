 document.addEventListener('DOMContentLoaded', () => {
    // --- PRODUCT SLIDER LOGIC ---
    const productsData = [ { pretitle: '贅沢な一粒をどうぞ。', name: 'シャインマスカット', description: '果汁たっぷりで濃厚な甘さが特徴です。 一粒食べれば口いっぱいに広がる芳醇な香りとジューシーな味わい。', image: 'img/a (2).jpg' }, { pretitle: 'とろけるような甘さと香り。', name: '贅沢な桃', description: 'ひと口食べれば、上品な香りとジューシーな味わいが口いっぱいに広がります。その美しさと繊細な風味は、まさに夏のごちそう', image: 'img/a (1).jpg' }, ];
    const pretitleEl = document.getElementById('product-pretitle');
    if (pretitleEl) {
      let currentProductIndex = 0;
      const nameEl=document.getElementById('product-name'); const descriptionEl=document.getElementById('product-description'); const imageEl=document.getElementById('product-image'); const textContainer=document.getElementById('product-text-container'); const imageContainer=document.getElementById('product-image-container'); const prevBtn=document.getElementById('prev-product'); const nextBtn=document.getElementById('next-product'); const dotsContainer=document.getElementById('pagination-dots');
      function displayProduct(index) { const product=productsData[index]; textContainer.style.opacity=0; imageContainer.style.opacity=0; setTimeout(() => { pretitleEl.textContent=product.pretitle; nameEl.textContent=product.name; descriptionEl.textContent=product.description; imageEl.src=product.image; imageEl.alt=product.name; textContainer.style.opacity=1; imageContainer.style.opacity=1; }, 300); updateDots(index); }
      function updateDots(activeIndex) { dotsContainer.innerHTML=''; productsData.forEach((_, index) => { const dot=document.createElement('a'); dot.href='#'; dot.classList.add('block', 'h-2', 'w-2', 'rounded-full', 'transition-colors'); if (index===activeIndex) { dot.classList.add('bg-white'); } else { dot.classList.add('bg-white/40'); } dot.addEventListener('click', (e) => { e.preventDefault(); currentProductIndex=index; displayProduct(currentProductIndex); }); dotsContainer.appendChild(dot); }); }
      nextBtn.addEventListener('click', (e) => { e.preventDefault(); currentProductIndex=(currentProductIndex + 1) % productsData.length; displayProduct(currentProductIndex); });
      prevBtn.addEventListener('click', (e) => { e.preventDefault(); currentProductIndex=(currentProductIndex - 1 + productsData.length) % productsData.length; displayProduct(currentProductIndex); });
      displayProduct(currentProductIndex);
    }

    // --- Auto-close mobile menu on link click ---
    const mobileMenuLinks = document.querySelectorAll('.fullscreen-menu a');
    const menuToggleCheckbox = document.getElementById('menu-toggle');
    mobileMenuLinks.forEach(link => { link.addEventListener('click', () => { menuToggleCheckbox.checked=false; }); });

    // --- SHOPPING CART LOGIC ---
    let cart=[]; const cartBadge=document.getElementById('cart-badge'); const addToCartButtons=document.querySelectorAll('.add-to-cart-btn'); const cartItemsContainer=document.getElementById('cart-items-container'); const cartSubtotalEl=document.getElementById('cart-subtotal');
    function updateCart() { updateCartIcon(); displayCartItems(); }
    function updateCartIcon() { const totalItems=cart.reduce((sum, item) => sum + item.quantity, 0); if (totalItems > 0) { cartBadge.textContent=totalItems; cartBadge.classList.remove('hidden'); } else { cartBadge.classList.add('hidden'); } }
    function displayCartItems() {
      cartItemsContainer.innerHTML=''; if (cart.length===0) { cartItemsContainer.innerHTML='<p class="text-stone-400">Your cart is empty.</p>'; cartSubtotalEl.textContent='¥0'; return; }
      let subtotal=0; cart.forEach(item => { const itemEl=document.createElement('div'); itemEl.className='flex items-center gap-4 py-2 text-white'; itemEl.innerHTML=`
          <div class="flex-grow">
            <p class="font-bold">${item.name}</p>
            <p class="text-sm text-stone-400">Quantity: ${item.quantity}</p>
          </div>
          <p class="font-semibold">¥${parseInt(item.price.replace(/,/g, '') * item.quantity).toLocaleString()}</p>
          <button class="remove-from-cart-btn btn btn-xs btn-ghost text-red-500" data-name="${item.name}">✕</button>
        `; cartItemsContainer.appendChild(itemEl); const price=parseFloat(item.price.replace(/,/g, '')); subtotal+=price * item.quantity; });
      cartSubtotalEl.textContent=`¥${subtotal.toLocaleString()}`; addRemoveEventListeners();
    }
    function removeFromCart(productName) { cart=cart.filter(item => item.name !== productName); updateCart(); }
    function addRemoveEventListeners() { const removeButtons=document.querySelectorAll('.remove-from-cart-btn'); removeButtons.forEach(button => { button.addEventListener('click', (e) => { const nameToRemove=e.currentTarget.dataset.name; removeFromCart(nameToRemove); }); }); }
    addToCartButtons.forEach(button => { button.addEventListener('click', () => { const name=button.dataset.name; const price=button.dataset.price; const existingItem=cart.find(item => item.name===name); if (existingItem) { existingItem.quantity++; } else { cart.push({ name, price, quantity: 1 }); }
      updateCart(); button.innerHTML='<i class="fa-solid fa-check"></i>'; button.classList.add('bg-green-500'); setTimeout(() => { button.innerHTML='<i class="fa-solid fa-plus"></i>'; button.classList.remove('bg-green-500'); }, 1500); }); });
    updateCart();
    
    // --- Scroll Animation Logic ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach((section) => {
        observer.observe(section);
    });
  });