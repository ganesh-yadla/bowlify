import { SIGNATURE_BOWLS, BUILDER_DATA, PROMO_CODES } from './data/products.js';

// Application State
const state = {
  cart: JSON.parse(localStorage.getItem('bowlify_cart') || '[]'),
  appliedPromo: null,
  activeFilter: 'all',
  searchQuery: '',
  builder: {
    activeStep: 'bases',
    base: BUILDER_DATA.bases[0],
    fruits: [BUILDER_DATA.fruits[0], BUILDER_DATA.fruits[2]],
    crunches: [BUILDER_DATA.crunches[0]],
    drizzle: BUILDER_DATA.drizzles[0]
  },
  trackingInterval: null
};

// Natural culinary shades for base card preview
const BASE_COLORS = {
  b1: '#3b1458', // Organic Açaí
  b2: '#b82352', // Wild Pitaya
  b3: '#6b6357', // Coconut Chia
  b4: '#1f4330', // Ceremonial Matcha
  b5: '#3f495a'  // Strained Greek Yogurt
};

// INR Currency Formatter
function formatINR(amount) {
  return `₹${Math.round(amount)}`;
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initBuilder();
  renderBuilder();
  updateCartUI();
  setupEventListeners();
});

/* ==========================================================================
   PRODUCT CATALOG
   ========================================================================== */
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const filtered = SIGNATURE_BOWLS.filter(bowl => {
    const matchesCategory = state.activeFilter === 'all' || bowl.category === state.activeFilter;
    const matchesSearch = !state.searchQuery || 
      bowl.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      bowl.tagline.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      bowl.ingredients.some(ing => ing.toLowerCase().includes(state.searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 6px;">No recipes match your search</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Try searching for mango, açaí, berries, or protein.</p>
        <button class="btn btn-secondary btn-sm" id="btn-reset-filters" style="margin-top: 14px;">Reset Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.activeFilter = 'all';
        state.searchQuery = '';
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.tab-btn').forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
        renderProducts();
      });
    }
    return;
  }

  grid.innerHTML = filtered.map(bowl => `
    <article class="product-card" data-id="${bowl.id}">
      <div class="card-media">
        <img src="${bowl.image}" alt="${bowl.name}" class="card-img" loading="lazy" />
        <span class="card-badge">${bowl.badge}</span>
        <span class="card-rating">★ ${bowl.rating}</span>
      </div>

      <div class="card-body">
        <h3 class="card-title">${bowl.name}</h3>
        <p class="card-tagline">${bowl.tagline}</p>

        <div class="card-nutrients">
          <span class="nutrient-tag"><strong>${bowl.calories}</strong> kcal</span>
          <span class="nutrient-tag"><strong>${bowl.protein}</strong> protein</span>
          <span class="nutrient-tag"><strong>${bowl.fiber}</strong> fiber</span>
        </div>

        <div class="card-footer">
          <span class="card-price">${formatINR(bowl.price)}</span>
          <button class="btn-card-add" data-bowl-id="${bowl.id}">
            <span>+ Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Attach card add event listeners
  grid.querySelectorAll('.btn-card-add').forEach(button => {
    button.addEventListener('click', (e) => {
      const bowlId = e.currentTarget.dataset.bowlId;
      const bowl = SIGNATURE_BOWLS.find(b => b.id === bowlId);
      if (bowl) {
        addToCart({
          id: bowl.id,
          name: bowl.name,
          price: bowl.price,
          image: bowl.image,
          subtitle: `${bowl.calories} kcal • ${bowl.badge}`,
          isCustom: false
        });
        showToast(`Added ${bowl.name} to bag`);
      }
    });
  });
}

/* ==========================================================================
   CUSTOM BOWL BUILDER
   ========================================================================== */
function initBuilder() {
  const tabs = document.querySelectorAll('.step-nav-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.builder.activeStep = tab.dataset.step;
      renderBuilderOptions();
    });
  });

  const addCustomBtn = document.getElementById('btn-add-custom-bowl');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', addCustomBowlToCart);
  }
}

function renderBuilder() {
  renderBuilderOptions();
  updateVisualBowlPreview();
}

function renderBuilderOptions() {
  const container = document.getElementById('builder-options-grid');
  if (!container) return;

  const step = state.builder.activeStep;
  const items = BUILDER_DATA[step] || [];

  container.innerHTML = items.map(item => {
    let isSelected = false;
    if (step === 'bases') {
      isSelected = state.builder.base?.id === item.id;
    } else if (step === 'fruits') {
      isSelected = state.builder.fruits.some(f => f.id === item.id);
    } else if (step === 'crunches') {
      isSelected = state.builder.crunches.some(c => c.id === item.id);
    } else if (step === 'drizzles') {
      isSelected = state.builder.drizzle?.id === item.id;
    }

    return `
      <div class="option-card ${isSelected ? 'selected' : ''}" data-step="${step}" data-item-id="${item.id}">
        <div class="option-check">✓</div>
        <div class="option-card-top">
          <span class="option-icon">${item.icon}</span>
          <div>
            <h4 class="option-title">${item.name}</h4>
            <p class="option-desc">${item.desc || ''}</p>
          </div>
        </div>
        <div class="option-card-bottom">
          <span class="option-cal">${item.cal} kcal</span>
          <span class="option-price">+${item.price > 0 ? formatINR(item.price) : 'Included'}</span>
        </div>
      </div>
    `;
  }).join('');

  // Handle selection click
  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const stepType = card.dataset.step;
      const itemId = card.dataset.itemId;
      const item = BUILDER_DATA[stepType].find(i => i.id === itemId);
      if (!item) return;

      if (stepType === 'bases') {
        state.builder.base = item;
      } else if (stepType === 'fruits') {
        const index = state.builder.fruits.findIndex(f => f.id === item.id);
        if (index > -1) {
          if (state.builder.fruits.length > 1) {
            state.builder.fruits.splice(index, 1);
          } else {
            showToast('Please keep at least 1 fruit in your bowl');
            return;
          }
        } else {
          state.builder.fruits.push(item);
        }
      } else if (stepType === 'crunches') {
        const index = state.builder.crunches.findIndex(c => c.id === item.id);
        if (index > -1) {
          state.builder.crunches.splice(index, 1);
        } else {
          state.builder.crunches.push(item);
        }
      } else if (stepType === 'drizzles') {
        if (state.builder.drizzle?.id === item.id) {
          state.builder.drizzle = null;
        } else {
          state.builder.drizzle = item;
        }
      }

      renderBuilder();
    });
  });
}

function updateVisualBowlPreview() {
  const dish = document.getElementById('bowl-dish-preview');
  const baseLabel = document.getElementById('bowl-base-label');
  const pillsContainer = document.getElementById('dish-ingredients-pills');

  if (dish && state.builder.base) {
    dish.style.background = BASE_COLORS[state.builder.base.id] || '#183b2b';
    if (baseLabel) baseLabel.textContent = state.builder.base.name;
  }

  if (pillsContainer) {
    const allSelected = [
      ...state.builder.fruits.map(f => f.name),
      ...state.builder.crunches.map(c => c.name),
      state.builder.drizzle ? state.builder.drizzle.name : null
    ].filter(Boolean);

    pillsContainer.innerHTML = allSelected.map(name => `
      <span class="ingredient-pill">${name}</span>
    `).join('');
  }

  // Calculate totals in INR
  let totalCal = (state.builder.base?.cal || 0);
  let totalPrice = (state.builder.base?.price || 0);
  let totalCount = 1;

  state.builder.fruits.forEach(f => {
    totalCal += f.cal;
    totalPrice += f.price;
    totalCount++;
  });

  state.builder.crunches.forEach(c => {
    totalCal += c.cal;
    totalPrice += c.price;
    totalCount++;
  });

  if (state.builder.drizzle) {
    totalCal += state.builder.drizzle.cal;
    totalPrice += state.builder.drizzle.price;
    totalCount++;
  }

  // Update UI Elements
  document.getElementById('builder-calories').textContent = totalCal;
  document.getElementById('builder-ingredients-count').textContent = totalCount;
  document.getElementById('builder-price').textContent = formatINR(totalPrice);
  document.getElementById('builder-cta-price').textContent = formatINR(totalPrice);

  // Summary breakdown
  const summary = document.getElementById('builder-summary-list');
  if (summary) {
    const fruitNames = state.builder.fruits.map(f => f.name).join(', ') || 'None';
    const crunchNames = state.builder.crunches.map(c => c.name).join(', ') || 'None';
    const drizzleName = state.builder.drizzle ? state.builder.drizzle.name : 'None';

    summary.innerHTML = `
      <div><strong>Base:</strong> ${state.builder.base ? state.builder.base.name : 'None'}</div>
      <div><strong>Fruits:</strong> ${fruitNames}</div>
      <div><strong>Crunch:</strong> ${crunchNames}</div>
      <div><strong>Drizzle:</strong> ${drizzleName}</div>
    `;
  }
}

function addCustomBowlToCart() {
  let totalPrice = state.builder.base.price;
  state.builder.fruits.forEach(f => totalPrice += f.price);
  state.builder.crunches.forEach(c => totalPrice += c.price);
  if (state.builder.drizzle) totalPrice += state.builder.drizzle.price;

  const customTitle = `Custom: ${state.builder.base.name.split(' ')[0]} Bowl`;
  const itemsSummary = [
    ...state.builder.fruits.map(f => f.name),
    ...state.builder.crunches.map(c => c.name),
    state.builder.drizzle ? state.builder.drizzle.name : null
  ].filter(Boolean).join(', ');

  addToCart({
    id: `custom-${Date.now()}`,
    name: customTitle,
    price: totalPrice,
    image: '/images/hero_bowl.jpg',
    subtitle: itemsSummary,
    isCustom: true
  });

  showToast('Custom bowl added to your bag');
}

/* ==========================================================================
   CART & CHECKOUT
   ========================================================================== */
function addToCart(item) {
  const existing = state.cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...item, qty: 1 });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

function updateQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('bowlify_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const countBadge = document.getElementById('cart-item-count');
  const drawerCount = document.getElementById('drawer-items-count');
  const itemsContainer = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const discountRow = document.getElementById('discount-row');
  const discountValEl = document.getElementById('cart-discount');
  const discountLabelEl = document.getElementById('discount-label');
  const deliveryEl = document.getElementById('cart-delivery');
  const checkoutBtn = document.getElementById('btn-proceed-checkout');
  const shippingProgress = document.getElementById('shipping-progress-fill');
  const trackerMsg = document.getElementById('tracker-msg');

  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) countBadge.textContent = totalCount;
  if (drawerCount) drawerCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  // Subtotal
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);

  // Free delivery tracker (₹499 threshold)
  const freeThreshold = 499;
  if (subtotal >= freeThreshold) {
    if (shippingProgress) shippingProgress.style.width = '100%';
    if (trackerMsg) trackerMsg.innerHTML = 'Unlocked <strong>FREE Insulated Delivery</strong>';
  } else {
    const diff = freeThreshold - subtotal;
    const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
    if (shippingProgress) shippingProgress.style.width = `${pct}%`;
    if (trackerMsg) trackerMsg.innerHTML = `Add <strong>₹${Math.ceil(diff)}</strong> more for <strong>FREE Delivery</strong>`;
  }

  // Delivery Fee
  const deliveryFee = (subtotal === 0 || subtotal >= freeThreshold) ? 0 : 49;
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee);

  // Discount
  let discountAmount = 0;
  if (state.appliedPromo && subtotal > 0) {
    if (state.appliedPromo.type === 'percent') {
      discountAmount = subtotal * state.appliedPromo.discount;
    } else if (state.appliedPromo.type === 'fixed') {
      discountAmount = state.appliedPromo.discount;
    }
  }

  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountValEl.textContent = `-${formatINR(discountAmount)}`;
      discountLabelEl.textContent = state.appliedPromo.label;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  if (totalEl) totalEl.textContent = formatINR(finalTotal);

  if (checkoutBtn) {
    checkoutBtn.disabled = state.cart.length === 0;
  }

  // Items List
  if (itemsContainer) {
    if (state.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">🥣</div>
          <h4>Your bag is currently empty</h4>
          <p>Select any of our freshly blended açaí bowls or build your own recipe.</p>
          <button class="btn btn-dark btn-sm" id="btn-empty-explore">View Menu</button>
        </div>
      `;
      const exploreBtn = document.getElementById('btn-empty-explore');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          closeCartDrawer();
          const menuSection = document.getElementById('menu');
          if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
        });
      }
    } else {
      itemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item-card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-sub">${item.subtitle || ''}</p>
            <span class="cart-item-price">${formatINR(item.price * item.qty)}</span>
          </div>
          <div class="cart-qty-ctrls">
            <button class="btn-qty btn-minus" data-id="${item.id}">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      `).join('');

      itemsContainer.querySelectorAll('.btn-minus').forEach(b => {
        b.addEventListener('click', () => updateQty(b.dataset.id, -1));
      });
      itemsContainer.querySelectorAll('.btn-plus').forEach(b => {
        b.addEventListener('click', () => updateQty(b.dataset.id, 1));
      });
    }
  }
}

function openCartDrawer() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-backdrop')?.classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-backdrop')?.classList.remove('open');
}

/* ==========================================================================
   EVENT LISTENERS & CHECKOUT MODAL
   ========================================================================== */
function setupEventListeners() {
  // Drawer open / close
  document.getElementById('btn-open-cart')?.addEventListener('click', openCartDrawer);
  document.getElementById('btn-close-cart')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);

  // City selector prompt
  document.getElementById('btn-change-address')?.addEventListener('click', () => {
    const newAddr = prompt('Select your delivery neighborhood/city:', 'Indiranagar, Bengaluru');
    if (newAddr && newAddr.trim()) {
      const cityLabel = document.getElementById('current-city-label');
      if (cityLabel) cityLabel.textContent = newAddr.trim();
      showToast(`Delivering to ${newAddr.trim()}`);
    }
  });

  // Hero Quick Add
  document.getElementById('btn-hero-add-signature')?.addEventListener('click', () => {
    const heroBowl = SIGNATURE_BOWLS[0];
    addToCart({
      id: heroBowl.id,
      name: heroBowl.name,
      price: heroBowl.price,
      image: heroBowl.image,
      subtitle: `${bowlCalories(heroBowl)} • Best Seller`,
      isCustom: false
    });
    showToast(`Added ${heroBowl.name} to bag`);
  });

  function bowlCalories(b) {
    return `${b.calories} kcal`;
  }

  // Category Filter Pills
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeFilter = tab.dataset.category;
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Promo code apply
  document.getElementById('btn-apply-promo')?.addEventListener('click', () => {
    const input = document.getElementById('promo-input');
    const msg = document.getElementById('promo-status-msg');
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      state.appliedPromo = PROMO_CODES[code];
      msg.textContent = `Applied "${code}": ${PROMO_CODES[code].label}`;
      msg.className = 'promo-feedback success';
      updateCartUI();
      showToast(`Promo ${code} applied successfully`);
    } else {
      msg.textContent = `Invalid coupon "${code}". Try FRESH50.`;
      msg.className = 'promo-feedback error';
    }
  });

  // Checkout modal controls
  const checkoutBtn = document.getElementById('btn-proceed-checkout');
  const checkoutModalBackdrop = document.getElementById('checkout-modal-backdrop');
  const closeCheckoutBtn = document.getElementById('btn-close-checkout');
  const orderForm = document.getElementById('order-form');

  checkoutBtn?.addEventListener('click', () => {
    closeCartDrawer();
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    const totalEl = document.getElementById('cart-total');

    document.getElementById('checkout-items-summary').textContent = `${count} bowl${count > 1 ? 's' : ''}`;
    document.getElementById('checkout-amount-summary').textContent = totalEl ? totalEl.textContent : '₹0';

    document.getElementById('checkout-form-screen').style.display = 'block';
    document.getElementById('order-tracking-screen').style.display = 'none';

    checkoutModalBackdrop?.classList.add('open');
  });

  closeCheckoutBtn?.addEventListener('click', () => {
    checkoutModalBackdrop?.classList.remove('open');
    if (state.trackingInterval) clearInterval(state.trackingInterval);
  });

  document.getElementById('btn-close-tracking')?.addEventListener('click', () => {
    checkoutModalBackdrop?.classList.remove('open');
    if (state.trackingInterval) clearInterval(state.trackingInterval);
  });

  // Order Submission & Live Simulation
  orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    document.getElementById('checkout-form-screen').style.display = 'none';
    document.getElementById('order-tracking-screen').style.display = 'block';

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('tracking-order-id').innerHTML = `Order #BWL-${orderNum} • Estimated Arrival: <strong>26 mins</strong>`;

    state.cart = [];
    saveCart();
    updateCartUI();

    startLiveTrackingSimulation();
  });

  // Subscriptions
  document.querySelectorAll('.btn-subscribe').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.currentTarget.dataset.plan;
      const planName = plan === '7day' ? 'Everyday Glow 7-Day Pass' : 'Weekday 5-Day Breakfast Pass';
      const planPrice = plan === '7day' ? 1599 : 1245;

      addToCart({
        id: `sub-${plan}`,
        name: planName,
        price: planPrice,
        image: '/images/pitaya_bowl.jpg',
        subtitle: 'Delivered at 8:00 AM daily • Zero delivery fees',
        isCustom: false
      });

      showToast(`Selected "${planName}"`);
    });
  });
}

function startLiveTrackingSimulation() {
  if (state.trackingInterval) clearInterval(state.trackingInterval);

  let minutes = 25;
  let seconds = 59;
  const countdownEl = document.getElementById('driver-countdown');
  const step3 = document.getElementById('step-3');
  const line2 = document.getElementById('line-2');
  const step4 = document.getElementById('step-4');
  const line3 = document.getElementById('line-3');

  // Step 2 is active. After 5s, courier dispatches
  setTimeout(() => {
    if (step3) step3.classList.add('active');
    if (line2) line2.classList.add('active');
    showToast('Rider Rahul Sharma is out for delivery with your cold pack');
  }, 5000);

  state.trackingInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(state.trackingInterval);
        if (countdownEl) countdownEl.textContent = '00:00';
        if (step4) step4.classList.add('active');
        if (line3) line3.classList.add('active');
        showToast('Your bowl has arrived! Enjoy fresh.');
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    if (countdownEl) {
      countdownEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }, 1000);
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}
