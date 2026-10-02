import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock3,
  Coffee,
  ExternalLink,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { ProductModal, type CartItem, type ModalConfig } from '@/components/ProductModal';
import { InstagramFeed } from '@/components/InstagramFeed';

const WHATSAPP_NUMBER = '56948904804';
const WHATSAPP_LINK = 'https://wa.link/ulu3i2';
const INSTAGRAM_LINK = 'https://www.instagram.com/mundo_gelato';
const PEDIDOSYA_LINK = 'https://www.pedidosya.cl/restaurantes/chillan/mundo-gelato-menu';
const HERO_IMAGE = 'https://images.pexels.com/photos/3631/summer-dessert-sweet-ice-cream.jpg?auto=compress&cs=tinysrgb&h=1200&w=1600';
const GELATO_IMAGE = 'https://images.pexels.com/photos/15811723/pexels-photo-15811723.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const DESSERT_IMAGE = 'https://images.pexels.com/photos/684968/pexels-photo-684968.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHURROS_IMAGE = 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const COFFEE_IMAGE = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHURROS_6_IMAGE = 'https://images.pexels.com/photos/3774212/pexels-photo-3774212.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHURROS_8_IMAGE = 'https://images.pexels.com/photos/35093310/pexels-photo-35093310.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHURROS_12_IMAGE = 'https://images.pexels.com/photos/36361402/pexels-photo-36361402.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const MINI_CHURROS_IMAGE = 'https://images.pexels.com/photos/18675243/pexels-photo-18675243.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHURRO_NUTELLA_IMAGE = 'https://images.pexels.com/photos/9501468/pexels-photo-9501468.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHURRO_MANJAR_IMAGE = 'https://images.pexels.com/photos/9501470/pexels-photo-9501470.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CAFE_GRANO_IMAGE = 'https://images.pexels.com/photos/11429424/pexels-photo-11429424.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const MOKACHINO_IMAGE = 'https://images.pexels.com/photos/236288/pexels-photo-236288.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CAPUCHINO_IMAGE = 'https://images.pexels.com/photos/11385490/pexels-photo-11385490.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const AMERICANO_IMAGE = 'https://images.pexels.com/photos/7855562/pexels-photo-7855562.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CAFE_LECHE_IMAGE = 'https://images.pexels.com/photos/20066366/pexels-photo-20066366.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const TE_IMAGE = 'https://images.pexels.com/photos/34835064/pexels-photo-34835064.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CHOCOLATE_CALIENTE_IMAGE = 'https://images.pexels.com/photos/10406759/pexels-photo-10406759.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const WAFFLE_IMAGE = 'https://images.pexels.com/photos/5659302/pexels-photo-5659302.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const BROWNIE_IMAGE = 'https://images.pexels.com/photos/33312980/pexels-photo-33312980.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const MILKSHAKE_IMAGE = 'https://images.pexels.com/photos/28525197/pexels-photo-28525197.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const CAFE_HELADO_IMAGE = 'https://images.pexels.com/photos/4312366/pexels-photo-4312366.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const AGUA_SIN_GAS_IMAGE = 'https://images.pexels.com/photos/1540235/pexels-photo-1540235.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const AGUA_CON_GAS_IMAGE = 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const BEBIDAS_IMAGE = 'https://images.pexels.com/photos/4113632/pexels-photo-4113632.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';

type MenuCategory = 'todos' | 'helados' | 'churros' | 'cafe' | 'especiales' | 'bebidas';
type Product = { id: string; name: string; category: Exclude<MenuCategory, 'todos'>; price: number; image?: string; description?: string };

const flavorGroups = [
  { title: 'Helados a la crema', tone: 'pink', items: ['Algodón de azúcar', 'Mora crema', 'Chocolate', 'Nutella', 'Trufa', 'Chirimoya alegre', 'Prestigio', 'Vainilla', 'Frutilla', 'Arándano', 'Frambuesa', 'Menta chip', 'Snicker', 'Chocolate suizo', 'Pistacho', 'Tres leche', 'Pasas al ron', 'Lúcuma', 'Coco', 'Manjar', 'Plátano manjar', 'Banana Split'] },
  { title: 'Helados Stevia', tone: 'mint', items: ['Pistacho', 'Chocolate', 'Frambuesa', 'Frutilla', 'Vainilla'] },
  { title: 'Helados al agua', tone: 'yellow', items: ['Papaya', 'Frutilla', 'Frambuesa', 'Limón', 'Piña', 'Mango', 'Chirimoya alegre', 'Arándano', 'Maracuyá'] },
  { title: 'Helados premium', tone: 'blue', items: ['Pingüinito', 'Súper 8', 'Bon o Bon', 'Mokaccino', 'Chocokita', 'Oreo', 'Cheesecake', 'Pie de limón', 'Tres leches', 'Brownie', 'Gansito', 'Chocman'] },
];

const gelatoSizes = [
  { id: 'simple', name: 'Helado simple', label: 'Simple · 1 bola', normalPrice: 2500, steviaPrice: 3500 },
  { id: 'doble', name: 'Helado doble', label: 'Doble · 2 bolas', normalPrice: 3500, steviaPrice: 4500 },
  { id: 'triple', name: 'Helado triple', label: 'Triple · 3 bolas', normalPrice: 3500, steviaPrice: 5000 },
  { id: 'medio-litro', name: 'Medio litro', label: 'Medio litro', normalPrice: 6000, steviaPrice: 7000 },
  { id: 'litro', name: '1 litro', label: '1 litro', normalPrice: 9000, steviaPrice: 11000 },
];

const churrosSizes = [
  { id: 'churros-6', label: '6 unidades', price: 3500 },
  { id: 'churros-8', label: '8 unidades', price: 4900 },
  { id: 'churros-12', label: '12 unidades', price: 6500 },
];

const products: Product[] = [
  { id: 'churros-6', name: 'Churros españoles', category: 'churros', price: 3500, description: '6 unidades · 2 salsas a elección', image: CHURROS_6_IMAGE },
  { id: 'churros-8', name: 'Churros españoles', category: 'churros', price: 4900, description: '8 unidades · 2 salsas a elección', image: CHURROS_8_IMAGE },
  { id: 'churros-12', name: 'Churros españoles', category: 'churros', price: 6500, description: '12 unidades · 2 salsas a elección', image: CHURROS_12_IMAGE },
  { id: 'relleno-nutella', name: 'Churro relleno de Nutella', category: 'churros', price: 1500, image: CHURRO_NUTELLA_IMAGE },
  { id: 'relleno-manjar', name: 'Churro relleno de Manjar', category: 'churros', price: 1000, image: CHURRO_MANJAR_IMAGE },
  { id: 'mini-churros', name: 'Mini churros en vasos', category: 'churros', price: 4500, description: 'Azúcar flor o canela + 1 salsa', image: MINI_CHURROS_IMAGE },
  { id: 'cafe-grano', name: 'Café en grano', category: 'cafe', price: 3000, image: CAFE_GRANO_IMAGE },
  { id: 'mokachino', name: 'Mokachino', category: 'cafe', price: 2500, image: MOKACHINO_IMAGE },
  { id: 'capuchino', name: 'Capuchino', category: 'cafe', price: 2500, image: CAPUCHINO_IMAGE },
  { id: 'americano', name: 'Café americano', category: 'cafe', price: 1000, image: AMERICANO_IMAGE },
  { id: 'cafe-leche', name: 'Café con leche', category: 'cafe', price: 2000, image: CAFE_LECHE_IMAGE },
  { id: 'te', name: 'Té', category: 'cafe', price: 1000, image: TE_IMAGE },
  { id: 'chocolate-caliente', name: 'Chocolate caliente', category: 'cafe', price: 2500, image: CHOCOLATE_CALIENTE_IMAGE },
  { id: 'waffle', name: 'Waffle con helado', category: 'especiales', price: 4800, image: WAFFLE_IMAGE },
  { id: 'brownie', name: 'Brownie con helado', category: 'especiales', price: 4500, image: BROWNIE_IMAGE },
  { id: 'milkshake', name: 'Milkshake', category: 'especiales', price: 4500, image: MILKSHAKE_IMAGE },
  { id: 'cafe-helado', name: 'Café helado', category: 'especiales', price: 4500, image: CAFE_HELADO_IMAGE },
  { id: 'agua-sin-gas', name: 'Agua sin gas', category: 'bebidas', price: 1500, image: AGUA_SIN_GAS_IMAGE },
  { id: 'agua-con-gas', name: 'Agua con gas', category: 'bebidas', price: 1500, image: AGUA_CON_GAS_IMAGE },
  { id: 'bebidas-general', name: 'Bebidas en general', category: 'bebidas', price: 1500, image: BEBIDAS_IMAGE },
];

const LOGO_IMAGE = `${import.meta.env.BASE_URL}Gemini_Generated_Image_qra34aqra34aqra3.jpg`;

const formatPrice = (price: number) => `$${price.toLocaleString('es-CL')}`;

function Logo({ variant = 'navbar' }: { variant?: 'navbar' | 'footer' | 'contacto' }) {
  return <a href="#inicio" className="brand" aria-label="Mundo Gelato, volver al inicio">
    <img src={LOGO_IMAGE} alt="Mundo Gelato" className={`brand-logo logo-${variant}`} />
  </a>;
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
    {children}
  </div>;
}

function App() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('todos');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('mundo-gelato-cart') || '[]') as CartItem[]; } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleGroups, setVisibleGroups] = useState(4);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [toast, setToast] = useState<string>('');

  useEffect(() => { localStorage.setItem('mundo-gelato-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const showHelados = activeCategory === 'todos' || activeCategory === 'helados';
  const showChurros = activeCategory === 'todos' || activeCategory === 'churros';
  const showCoffee = activeCategory === 'todos' || activeCategory === 'cafe';
  const showSpecials = activeCategory === 'todos' || activeCategory === 'especiales';
  const showDrinks = activeCategory === 'todos' || activeCategory === 'bebidas';

  const showToast = (message: string) => setToast(message);
  const addToCart = (item: CartItem) => {
    setCart((current) => {
      const found = current.find((cartItem) => cartItem.id === item.id);
      return found ? current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem) : [...current, item];
    });
    setModalConfig(null);
    setCartOpen(true);
    showToast(`${item.icon} ¡${item.name} agregado al carrito!`);
  };
  const addDirect = (id: string, name: string, price: number, icon: string) => {
    addToCart({ id, name, icon, price, quantity: 1, details: [] });
  };
  const changeQuantity = (id: string, amount: number) => setCart((current) => current.flatMap((item) => item.id === id ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item]));

  const makeWhatsAppOrder = () => {
    if (!cart.length) { showToast('🍦 Tu carrito está vacío'); setCartOpen(true); return; }
    const lines = cart.map((item) => {
      const header = `${item.icon} ${item.quantity}x ${item.name}`;
      const detailLines = item.details.map((d) => `   ${d.label}: ${d.value}`);
      const subtotalLine = `   Subtotal: ${formatPrice(item.price * item.quantity)}`;
      return [header, ...detailLines, subtotalLine].join('\n');
    });
    const message = `¡Hola! 👋 Quiero realizar un pedido en Mundo Gelato.\n\n🛒 MI PEDIDO:\n\n${lines.join('\n\n')}\n\n────────────────\n\n💰 TOTAL: ${formatPrice(total)}\n\n¿Me pueden confirmar el pedido? 😊`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const openGelatoModal = (sizeId: string) => setModalConfig({ kind: 'gelato', sizeId });
  const openChurrosModal = (sizeId: string) => setModalConfig({ kind: 'churros', sizeId });
  const openMiniChurrosModal = () => setModalConfig({ kind: 'minichurros' });
  const openFilledChurroModal = (product: Product) => setModalConfig({ kind: 'filledChurro', productId: product.id, productName: product.name, price: product.price });
  const openCafeModal = (product: Product) => setModalConfig({ kind: 'cafe', productId: product.id, productName: product.name, basePrice: product.price });
  const openSpecialModal = (product: Product) => {
    if (product.id === 'milkshake') setModalConfig({ kind: 'milkshake', product: { productId: product.id, productName: product.name, price: product.price, icon: '🥤' } });
    else if (product.id === 'cafe-helado') setModalConfig({ kind: 'icedCoffee', product: { productId: product.id, productName: product.name, price: product.price, icon: '☕' } });
    else if (product.id === 'waffle' || product.id === 'brownie') setModalConfig({ kind: 'singleFlavor', product: { productId: product.id, productName: product.name, price: product.price, icon: '🍨' } });
    else if (product.id === 'chocolate-caliente') setModalConfig({ kind: 'hotChocolate', product: { productId: product.id, productName: product.name, price: product.price, icon: '☕' } });
    else setModalConfig({ kind: 'beverage', product: { productId: product.id, productName: product.name, price: product.price, icon: '🥤' } });
  };

  const navTo = (id: string) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  const modalImage = modalConfig ? (() => {
    switch (modalConfig.kind) {
      case 'gelato': return GELATO_IMAGE;
      case 'churros': return products.find((p) => p.id === modalConfig.sizeId)?.image ?? CHURROS_IMAGE;
      case 'minichurros': return products.find((p) => p.id === 'mini-churros')?.image ?? CHURROS_IMAGE;
      case 'filledChurro': return products.find((p) => p.id === modalConfig.productId)?.image ?? CHURROS_IMAGE;
      case 'cafe': return products.find((p) => p.id === modalConfig.productId)?.image ?? COFFEE_IMAGE;
      case 'hotChocolate': return products.find((p) => p.id === 'chocolate-caliente')?.image ?? COFFEE_IMAGE;
      default: return products.find((p) => p.id === modalConfig.product.productId)?.image ?? CHURROS_IMAGE;
    }
  })() : CHURROS_IMAGE;

  const categories: { id: MenuCategory; label: string; icon: ReactNode }[] = [
    { id: 'todos', label: 'Todos', icon: <Sparkles size={15} /> },
    { id: 'helados', label: 'Helados', icon: <span className="dot-icon" /> },
    { id: 'churros', label: 'Churros', icon: <UtensilsCrossed size={15} /> },
    { id: 'cafe', label: 'Café', icon: <Coffee size={15} /> },
    { id: 'especiales', label: 'Especiales', icon: <Star size={15} /> },
    { id: 'bebidas', label: 'Bebidas', icon: <span className="dot-icon dot-icon--blue" /> },
  ];

  return <div className="site-shell">
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container nav-inner"><Logo variant="navbar" />
        <nav className={`desktop-nav ${mobileOpen ? 'desktop-nav--open' : ''}`} aria-label="Navegación principal">
          {['inicio', 'menu', 'cafe-bebidas', 'churros', 'ubicacion'].map((id, index) => <button key={id} onClick={() => navTo(id)}>{['Inicio', 'Menú', 'Café & bebidas', 'Churros', 'Ubicación'][index]}</button>)}
        </nav>
        <div className="nav-actions"><button className="nav-whatsapp" onClick={makeWhatsAppOrder}>Pedir por WhatsApp <ArrowRight size={15} /></button><button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label="Abrir carrito"><ShoppingBag size={19} /><span>{itemCount}</span></button><button className="menu-trigger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menú">{mobileOpen ? <X /> : <Menu />}</button></div>
      </div>
    </header>

    <main>
      <section id="inicio" className="hero">
        <div className="hero-image" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="hero-overlay" />
        <div className="container hero-content"><span className="hero-kicker"><span /> Hecho con cariño en Chillán</span><h1>Helados<br /><em>artesanales</em><br /><span>y churros</span></h1><p>Un mundo de sabor en el corazón de Chillán.</p><div className="hero-actions"><button className="button button--primary" onClick={() => navTo('menu')}>Ver menú <ArrowRight size={17} /></button><button className="button button--light" onClick={makeWhatsAppOrder}>Pedir por WhatsApp <ArrowRight size={17} /></button></div><div className="hero-details"><span><MapPin size={15} /> Av. Argentina 141, Chillán</span><span><Phone size={15} /> 948 90 4804</span></div></div>
        <div className="hero-sticker"><span>Sabores</span><strong>que se<br />comparten</strong><Sparkles size={22} /></div>
      </section>

      <section className="intro-strip"><div className="container intro-grid"><div><span className="eyebrow">Una pausa deliciosa</span><h2>Pequeños momentos,<br /><em>grandes sabores.</em></h2></div><p>Desde un helado artesanal hasta unos churros recién hechos: en Mundo Gelato cada visita se convierte en tu parte favorita del día.</p><div className="strip-stat"><strong>100%</strong><span>Artesanal</span></div></div></section>

      <section id="menu" className="menu-section section"><div className="container"><SectionHeading eyebrow="La carta" title="Nuestro menú"><div className="menu-note"><span className="note-dot" /> Endulzados con Stevia</div></SectionHeading>
        <div className="filter-row" role="tablist" aria-label="Filtrar menú">{categories.map((category) => <button key={category.id} className={activeCategory === category.id ? 'filter-button active' : 'filter-button'} onClick={() => setActiveCategory(category.id)}>{category.icon}{category.label}</button>)}</div>
        {showHelados && <section className="gelato-feature"><div className="gelato-copy"><span className="eyebrow">La especialidad de la casa</span><h3>Helados<br /><em>artesanales</em></h3><p>Elige tus sabores favoritos y disfruta la textura cremosa de nuestras recetas, también en opciones endulzadas con Stevia.</p><div className="gelato-price-list">{gelatoSizes.map((size) => <button key={size.id} onClick={() => openGelatoModal(size.id)}><span>{size.label}</span><strong>{formatPrice(size.normalPrice)} / Stevia {formatPrice(size.steviaPrice)}</strong><Plus size={16} /></button>)}</div></div><div className="gelato-photo" style={{ backgroundImage: `url(${GELATO_IMAGE})` }} /></section>}
        {showHelados && <div className="flavor-area"><div className="flavor-heading"><h3>Sabores para elegir</h3><p>Los clásicos que ya conoces, más tus próximos favoritos.</p></div><div className="flavor-grid">{flavorGroups.slice(0, visibleGroups).map((group) => <div className={`flavor-card flavor-card--${group.tone}`} key={group.title}><div className="flavor-card-head"><span className="flavor-icon">{group.title === 'Helados al agua' ? '◒' : group.title === 'Helados premium' ? '✦' : '●'}</span><h4>{group.title}</h4><ChevronRight size={17} /></div><div className="flavors">{group.items.map((flavor) => <span key={flavor}>{flavor}</span>)}</div></div>)}</div>{visibleGroups < flavorGroups.length && <button className="text-button" onClick={() => setVisibleGroups(visibleGroups + 2)}>Ver todos los sabores <ChevronDown size={16} /></button>}</div>}

        {showChurros && <section id="churros" className="churros-block"><div className="churros-intro"><span className="eyebrow">Recién hechos</span><h3>Churros<br /><em>españoles</em><br />veganos</h3><p>Sin leche ni huevo. Personaliza tu pedido eligiendo azúcar y salsas.</p></div><div className="churros-options">{products.filter((product) => product.category === 'churros' && product.id.startsWith('churros-')).map((product) => <article className="product-line" key={product.id}><div><span className="product-tag">Clásicos</span><h4>Churros españoles</h4><p>{product.description}</p></div><div className="product-buy"><strong>{formatPrice(product.price)}</strong><button onClick={() => openChurrosModal(product.id)}><Plus size={16} /> Agregar</button></div></article>)}<article className="product-line"><div><span className="product-tag">Vaso</span><h4>Mini churros en vasos</h4><p>Azúcar flor o canela + 1 salsa</p></div><div className="product-buy"><strong>{formatPrice(4500)}</strong><button onClick={openMiniChurrosModal}><Plus size={16} /> Agregar</button></div></article>{products.filter((product) => product.category === 'churros' && product.id.startsWith('relleno')).map((product) => <article className="product-line" key={product.id}><div><span className="product-tag">Rellenos</span><h4>{product.name}</h4><p>Una unidad</p></div><div className="product-buy"><strong>{formatPrice(product.price)}</strong><button onClick={() => openFilledChurroModal(product)}><Plus size={16} /> Agregar</button></div></article>)}</div></section>}

        {showCoffee && <section id="cafe-bebidas" className="coffee-section"><div className="coffee-heading"><span className="eyebrow">Para acompañar</span><h3>Café &<br /><em>bebidas</em></h3><p>Elige tu tamaño y disfruta el momento.</p></div><div className="coffee-list"><div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.45, textAlign: 'right', marginBottom: '0.4rem', paddingRight: '3rem' }}>Precios: 8 oz · 12 oz</div>{products.filter((product) => product.category === 'cafe').map((product) => <div className="coffee-row" key={product.id}><span>{product.name}</span><strong>{product.id === 'chocolate-caliente' ? formatPrice(product.price) : `${formatPrice(product.price)} · ${formatPrice(product.price + 500)}`}</strong><button onClick={() => openCafeModal(product)}><Plus size={16} /></button></div>)}</div></section>}

        {showSpecials && <section className="specials-section"><div className="section-mini-head"><div><span className="eyebrow">Algo especial</span><h3>Antojos de la casa</h3></div><span>Preparados para disfrutar</span></div><div className="special-grid">{products.filter((product) => product.category === 'especiales').map((product) => <article className="special-card" key={product.id}><div className="special-image" style={{ backgroundImage: `url(${product.image})` }} /><div className="special-info"><h4>{product.name}</h4><strong>{formatPrice(product.price)}</strong><button onClick={() => openSpecialModal(product)}>Agregar <Plus size={16} /></button></div></article>)}</div></section>}

        {showDrinks && <section className="drinks-section"><div><span className="eyebrow">Para refrescar</span><h3>Bebidas</h3></div><div className="drink-list">{products.filter((product) => product.category === 'bebidas').map((product) => <div className="drink-row" key={product.id}><span>{product.name}</span><strong>{formatPrice(product.price)}</strong><button onClick={() => product.id === 'bebidas-general' ? openSpecialModal(product) : addDirect(product.id, product.name, product.price, '🥤')}><Plus size={16} /></button></div>)}</div></section>}
        {!showHelados && !showChurros && !showCoffee && !showSpecials && showDrinks === false && <div className="empty-state">No encontramos productos en esta categoría.</div>}
      </div></section>

      <section className="online-section"><div className="container online-inner"><div><span className="eyebrow">También puedes</span><h2>Haz tu pedido<br /><em>online</em></h2><p>Elige cómo quieres disfrutar Mundo Gelato.</p></div><div className="delivery-buttons"><a href={PEDIDOSYA_LINK} target="_blank" rel="noreferrer" className="delivery-card delivery-card--pink"><span className="delivery-logo">P<span>!</span></span><div><strong>PedidosYa</strong><small>Ordena en línea</small></div><ExternalLink size={17} /></a></div></div></section>

      <section className="instagram-section"><div className="container"><div className="instagram-head"><span className="eyebrow">Síguenos</span><h2>Últimas <em>publicaciones</em></h2><p>Mantente al día con nuestros sabores y novedades en Instagram.</p></div><InstagramFeed instagramLink={INSTAGRAM_LINK} /></div></section>

      <section id="ubicacion" className="visit-section section"><div className="container"><SectionHeading eyebrow="Ven a visitarnos" title="Aquí te esperamos"><a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="instagram-link"><Instagram size={18} /> @mundo_gelato <ArrowRight size={15} /></a></SectionHeading><div className="visit-grid"><div className="visit-info"><Logo variant="contacto" /><p>Un mundo de sabor en el corazón de Chillán.</p><div className="contact-list"><span><MapPin size={18} /><b>Dirección</b><small>Av. Argentina 141<br />Chillán, Chile</small></span><span><Phone size={18} /><b>Teléfono</b><small>948 90 4804</small></span><span><Clock3 size={18} /><b>Horario</b><small>Lunes a Domingo de 14:30- 19:30hrs</small></span></div><button className="button button--primary" onClick={makeWhatsAppOrder}>Escríbenos por WhatsApp <ArrowRight size={17} /></button></div><div className="map-wrap"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.92171290911!2d-72.091092!3d-36.6041945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9668d74966ef877f%3A0x9e9067e97fede3d3!2sMundo%20Gelato!5e0!3m2!1ses-419!2sco!4v1788122823570!5m2!1ses-419!2sco" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="Mapa de Mundo Gelato" /></div></div></div></section>
    </main>

    <footer><div className="container footer-inner"><Logo variant="footer" /><span>Helados artesanales, churros y momentos dulces.</span><a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer"><Instagram size={17} /> Síguenos en Instagram</a><small>© {new Date().getFullYear()} Mundo Gelato</small></div></footer>

    {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="cart-head"><div><span className="eyebrow">Tu selección</span><h2>Mi carrito <span>{itemCount}</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><X /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div className="cart-item-info"><h4><span className="cart-item-icon">{item.icon}</span> {item.name}</h4>{item.details.map((d) => <small key={d.label}>{d.label}: {d.value}</small>)}<strong>{formatPrice(item.price * item.quantity)}</strong></div><div className="cart-item-actions"><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)}><Plus size={13} /></button></div><button className="remove" onClick={() => setCart((current) => current.filter((cartItem) => cartItem.id !== item.id))}><Trash2 size={15} /></button></div></div>)}</div><div className="cart-foot"><div className="cart-total"><span>Total</span><strong>{formatPrice(total)}</strong></div><button className="button button--primary full" onClick={makeWhatsAppOrder}><Phone size={17} /> Pedir por WhatsApp</button><button className="clear-button" onClick={() => setCart([])}>Vaciar carrito</button><p><Truck size={14} /> Tu pedido se coordina directamente por WhatsApp.</p></div></> : <div className="cart-empty"><ShoppingBag size={38} /><h3>Tu carrito está vacío 🍦</h3><p>Agrega tus favoritos y vuelve aquí para preparar tu pedido.</p><button className="button button--primary" onClick={() => { setCartOpen(false); navTo('menu'); }}>Explorar menú</button></div>}</aside></div>}

    {modalConfig && <ProductModal config={modalConfig} flavorGroups={flavorGroups} gelatoSizes={gelatoSizes} churrosSizes={churrosSizes} image={modalImage} onClose={() => setModalConfig(null)} onAdd={addToCart} />}

    {toast && <div className="toast">{toast}</div>}

    <a className="whatsapp-float" href="https://wa.me/56948904804" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </div>;
}

export default App;
