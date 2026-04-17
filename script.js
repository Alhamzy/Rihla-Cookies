const toast = document.createElement('div');
toast.className = 'site-toast';
toast.innerHTML = '<div class="site-toast-card"><strong>Coming soon</strong><p>This action is part of the prototype flow and is not fully wired yet.</p><button type="button">Got it</button></div>';
document.body.appendChild(toast);

const toastButton = toast.querySelector('button');
const closeToast = () => toast.classList.remove('show');
toastButton.addEventListener('click', closeToast);

const heroConfigs = {
  nyc: {
    pill: 'World Tour Edition',
    title: 'A World of <em>Flavor</em> in Every Bite',
    text: "Curated gourmet cookies inspired by the heritage, spices, and stories of the world's most iconic cities.",
    image: 'assets/new-yorker.jpg',
    alt: 'New Yorker cookie',
    badgeTitle: 'Top Rated',
    badgeText: 'Voted "Most Authentic" by the Global Baker\'s Guild 2023.'
  },
  strawberry: {
    pill: 'London This Week',
    title: 'A World of <em>Berry</em> Softness in Every Bite',
    text: 'Bright strawberry notes, creaminess, and a softer travel-journal mood inspired by London tea rituals.',
    image: 'assets/strawberry.jpg',
    alt: 'Strawberry Shorty cookie',
    badgeTitle: 'Fresh Drop',
    badgeText: 'This week\'s softest, fruit-forward arrival from the rotation.'
  },
  oman: {
    pill: 'Muscat This Week',
    title: 'A World of <em>Golden</em> Warmth in Every Bite',
    text: 'Saffron, pistachio, and cardamom layered into a warmer hero moment inspired by the Majlis Gold profile.',
    image: 'assets/oman.jpg',
    alt: 'Majlis Gold cookie',
    badgeTitle: 'House Favorite',
    badgeText: 'An Omani signature with saffron warmth and a richer, heritage-led profile.'
  }
};

const heroKeys = ['nyc', 'strawberry', 'oman'];
let currentHeroIndex = 0;
let heroAutoplayStopped = false;
let heroInterval = null;
let isHeroAnimating = false;

const heroImage = document.getElementById('hero-image');
const heroTitle = document.getElementById('hero-title');
const heroText = document.getElementById('hero-text');
const heroPill = document.getElementById('hero-pill');
const heroBadgeTitle = document.getElementById('hero-badge-title');
const heroBadgeText = document.getElementById('hero-badge-text');
const heroButtons = document.querySelectorAll('.hero-toggle-btn');
const heroCopyWrap = document.getElementById('hero-copy-wrap');
const heroArtWrap = document.getElementById('hero-art-wrap');

const applyHeroContent = (key) => {
  const config = heroConfigs[key];
  if (!config || !heroImage) return;
  currentHeroIndex = heroKeys.indexOf(key);
  heroPill.textContent = config.pill;
  heroTitle.innerHTML = config.title;
  heroText.textContent = config.text;
  heroImage.src = config.image;
  heroImage.alt = config.alt;
  heroBadgeTitle.textContent = config.badgeTitle;
  heroBadgeText.textContent = config.badgeText;
  heroButtons.forEach((button) => button.classList.toggle('active', button.dataset.hero === key));
};

const animateHeroTo = (key) => {
  if (isHeroAnimating || !heroCopyWrap || !heroArtWrap) {
    applyHeroContent(key);
    return;
  }

  isHeroAnimating = true;
  heroCopyWrap.classList.add('slide-out-left');
  heroArtWrap.classList.add('slide-out-right');

  window.setTimeout(() => {
    applyHeroContent(key);
    heroCopyWrap.classList.remove('slide-out-left');
    heroArtWrap.classList.remove('slide-out-right');
    heroCopyWrap.classList.add('slide-in-right');
    heroArtWrap.classList.add('slide-in-left');

    window.setTimeout(() => {
      heroCopyWrap.classList.remove('slide-in-right');
      heroArtWrap.classList.remove('slide-in-left');
      isHeroAnimating = false;
    }, 260);
  }, 180);
};

const startHeroAutoplay = () => {
  if (!heroImage || heroAutoplayStopped) return;
  clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroKeys.length;
    animateHeroTo(heroKeys[currentHeroIndex]);
  }, 5000);
};

heroButtons.forEach((button) => {
  button.addEventListener('click', () => {
    heroAutoplayStopped = true;
    clearInterval(heroInterval);
    animateHeroTo(button.dataset.hero);
  });
});

applyHeroContent(heroKeys[currentHeroIndex]);
startHeroAutoplay();

const orderItems = {
  'earl-grey': { id: 'earl-grey', name: 'Earl Grey Chunk', region: 'London, UK', price: 4.5 },
  'big-apple': { id: 'big-apple', name: 'The Big Apple Levain', region: 'New York, USA', price: 5.5 },
  'saffron-jewel': { id: 'saffron-jewel', name: 'The Saffron Jewel', region: 'Muscat, Oman', price: 6.0 }
};

let selectedPack = 4;
let orderBag = ['earl-grey', 'saffron-jewel'];

const packButtons = document.querySelectorAll('.pack-btn');
const addButtons = document.querySelectorAll('.add-order-btn');
const boxItems = document.getElementById('box-items');
const boxTotal = document.getElementById('box-total');
const boxProgressText = document.getElementById('box-progress-text');
const boxProgressFill = document.getElementById('box-progress-fill');
const whatsappLink = document.getElementById('whatsapp-order');
const instagramLink = document.getElementById('instagram-order');

const getBagCounts = () => {
  const counts = {};
  orderBag.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });
  return counts;
};

const getSubtotal = () => orderBag.reduce((sum, id) => sum + (orderItems[id]?.price || 0), 0);
const getFilledBoxes = Math.floor(orderBag.length / selectedPack);
const getCurrentBoxCount = orderBag.length % selectedPack;

const buildOrderMessage = () => {
  const counts = getBagCounts();
  const lines = Object.entries(counts).map(([id, qty]) => {
    const item = orderItems[id];
    return `- ${item.name} x${qty} (${item.region}) - $${(item.price * qty).toFixed(2)}`;
  });
  return `Hi Rihla Cookies, I want to place an order.%0A%0APack size: ${selectedPack}%0ATotal cookies selected: ${orderBag.length}%0AFull boxes: ${getFilledBoxes()}%0A%0AOrder summary:%0A${lines.join('%0A')}%0A%0ASubtotal: $${getSubtotal().toFixed(2)}`;
};

const flashAddedState = (button) => {
  const original = button.innerHTML;
  button.classList.add('added');
  button.innerHTML = 'Added <span class="material-symbols-outlined">check</span>';
  setTimeout(() => {
    button.classList.remove('added');
    button.innerHTML = original;
  }, 650);
};

const renderOrderBox = () => {
  if (!boxItems || !boxTotal || !boxProgressText || !boxProgressFill) return;

  const counts = getBagCounts();
  const rows = Object.entries(counts)
    .map(([id, qty]) => {
      const item = orderItems[id];
      return `<div><strong>${item.name}${qty > 1 ? ` x${qty}` : ''}</strong><p>${item.region}</p></div><button type="button" class="remove-order-btn" data-id="${id}" data-live>close</button>`;
    })
    .join('');

  boxItems.innerHTML = rows || '<div><strong>No cookies yet</strong><p>Add your first cookie to begin.</p></div><button type="button" disabled>close</button>';
  boxTotal.textContent = `$${getSubtotal().toFixed(2)}`;

  const currentCount = getCurrentBoxCount();
  const displayCount = currentCount === 0 && orderBag.length > 0 ? selectedPack : currentCount;
  boxProgressText.textContent = `${displayCount}/${selectedPack} Selected`;
  boxProgressFill.style.width = `${(displayCount / selectedPack) * 100}%`;

  const message = buildOrderMessage();
  if (whatsappLink) whatsappLink.href = `https://wa.me/?text=${message}`;
  if (instagramLink) instagramLink.href = `https://ig.me/m/rihlacookies`;
};

packButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedPack = Number(button.dataset.pack);
    packButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderOrderBox();
  });
});

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('[data-item]');
    if (!card) return;
    const id = card.dataset.item;
    orderBag.push(id);
    flashAddedState(button);
    renderOrderBox();
  });
});

document.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-order-btn');
  if (removeButton) {
    const id = removeButton.dataset.id;
    const idx = orderBag.lastIndexOf(id);
    if (idx >= 0) orderBag.splice(idx, 1);
    renderOrderBox();
    return;
  }

  const target = event.target.closest('button, a');
  if (!target) return;

  const href = target.getAttribute('href');
  const allowNav = href && !href.startsWith('#') && (/\.(html)?$/.test(href) || href.startsWith('https://wa.me/') || href.startsWith('https://ig.me/'));
  const explicitWork = target.matches('[data-live]') || target.closest('[data-live]');

  if (allowNav || explicitWork) return;

  if (target.closest('.nav-links, .tour-nav-links, .footer-links, .tour-footer-links') && href === '#') {
    event.preventDefault();
    toast.classList.add('show');
    return;
  }

  if (target.tagName === 'BUTTON') {
    event.preventDefault();
    toast.classList.add('show');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeToast();
});

renderOrderBox();
