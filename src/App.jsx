 import { useState, useEffect } from “react”;

const SHEET_URL = “https://opensheet.elk.sh/18pEEgSp4mZ0x6vdd5N8gNuwcJTh_cZXV7kSSQwDT-gg/wbccards”;
const ADMIN_EMAIL = “tu@email.com”;
const ADMIN_PASSWORD = “admin2026”;
const BLACK = “#0a0a0a”;
const DARK = “#141414”;
const CARD_BG = “#1a1a1a”;
const GOLD = “#c9a84c”;
const LIGHT = “#f5f5f5”;

const getLang = () => (navigator.language || “es”).toLowerCase().startsWith(“es”) ? “es” : “en”;

// ── DEFAULT LEGAL TEXTS ────────────────────────────────────────────────────────
const DEFAULT_LEGAL = {
aviso: `AVISO LEGAL

Titular: WBC Cards
Domicilio: España
Email: contacto@wbccards.com

En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI), se informa que este sitio web es propiedad de WBC Cards.

El acceso y uso de este sitio web implica la aceptación plena de las condiciones de uso aquí establecidas. WBC Cards se reserva el derecho a modificar estas condiciones sin previo aviso.

Todo el contenido de este sitio web (textos, imágenes, diseño) es propiedad de WBC Cards y está protegido por las leyes de propiedad intelectual.`,

privacidad: `POLÍTICA DE PRIVACIDAD

En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD):

RESPONSABLE: WBC Cards
FINALIDAD: Gestión de pedidos y comunicaciones comerciales
LEGITIMACIÓN: Ejecución de contrato y consentimiento del interesado
DESTINATARIOS: No se ceden datos a terceros salvo obligación legal
DERECHOS: Acceso, rectificación, supresión, oposición, portabilidad y limitación escribiendo a contacto@wbccards.com

Los datos recabados se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se recabaron.`,

cookies: `POLÍTICA DE COOKIES

Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia de navegación.

TIPOS DE COOKIES:

- Cookies técnicas: necesarias para el funcionamiento del sitio
- Cookies analíticas: para analizar el uso del sitio (Google Analytics)
- Cookies de personalización: para recordar preferencias

Puedes configurar o rechazar las cookies en cualquier momento desde la configuración de tu navegador. El rechazo de cookies técnicas puede afectar al funcionamiento del sitio.

Base legal: Ley 34/2002 LSSI y RGPD.`,

envios: `POLÍTICA DE ENVÍOS

PLAZOS DE ENTREGA:

- España peninsular: 2-5 días laborables
- Islas y Portugal: 3-7 días laborables
- Europa: 5-10 días laborables

GASTOS DE ENVÍO:

- España: desde 3,50€ (gratuito a partir de 50€)
- Europa: desde 8€

Todos los envíos se realizan con número de seguimiento. WBC Cards no se hace responsable de los retrasos ocasionados por causas ajenas a nuestra empresa (aduanas, huelgas, etc.).

Las cartas se envían correctamente protegidas con fundas, toploader y embalaje acolchado.`,

devoluciones: `POLÍTICA DE DEVOLUCIONES

De acuerdo con el Real Decreto Legislativo 1/2007 y la Directiva Europea 2011/83/UE:

DERECHO DE DESISTIMIENTO:
Dispones de 14 días naturales desde la recepción del pedido para ejercer el derecho de desistimiento sin necesidad de justificación.

CONDICIONES:

- El producto debe estar en el mismo estado en que fue recibido
- Se reembolsará el precio del producto y los gastos de envío originales
- Los gastos de devolución corren a cargo del comprador salvo producto defectuoso

PRODUCTOS DEFECTUOSOS:
Si recibes un producto en mal estado, contáctanos en 48h con fotografías a contacto@wbccards.com y gestionaremos la devolución o sustitución sin coste.

Para iniciar una devolución: contacto@wbccards.com`
};

const getLegal = () => { try { return JSON.parse(localStorage.getItem(“wbc_legal”) || “null”) || DEFAULT_LEGAL; } catch { return DEFAULT_LEGAL; } };
const saveLegal = (d) => { try { localStorage.setItem(“wbc_legal”, JSON.stringify(d)); } catch {} };

const T = {
es: {
splash_sub: “Cartas TCG · Pokémon · F1 · Más”, splash_btn: “Ver catálogo →”,
products: “Catálogo”, cart_nav: “Cesta”, admin: “Admin”,
search_ph: “Buscar carta o producto…”,
all: “Todo”, pokemon: “Pokémon”, f1: “F1”, magic: “Magic”, yugioh: “Yu-Gi-Oh”, other: “Otros”,
loading: “⏳ Cargando…”, error: “Error al cargar productos.”, no_products: “No hay productos disponibles”,
add_cart: “Añadir”, added: “✓ Añadido”, out_stock: “Sin stock”,
series: “Serie”, stock_label: “Stock”, price: “Precio”,
cart_title: “Tu cesta”, cart_empty_msg: “Añade productos del catálogo”, see_catalog: “Ver catálogo”,
checkout: “Tramitar pedido →”, total: “Total”,
order_title: “Datos del pedido”, order_sub: “Completa tus datos y te contactamos para el pago.”,
name_l: “Nombre *”, email_l: “Email *”, tel_l: “Teléfono”, address_l: “Dirección de envío *”,
name_ph: “Tu nombre completo”, email_ph: “tu@email.com”, tel_ph: “600 000 000”, address_ph: “Calle, número, ciudad, CP”,
confirm: “Confirmar pedido”, cancel: “Cancelar”,
err_fields: “Rellena nombre, email y dirección.”, err_email: “Email no válido.”,
success: (n, t) => `✓ Pedido confirmado · ${n} producto${n > 1 ? "s" : ""} · ${t}€. Te contactamos en breve.`,
access_admin: “Acceso Admin”, internal: “Solo uso interno.”,
enter: “Entrar”, wrong_pass: “Contraseña incorrecta.”, password: “Contraseña”,
no_orders: “No hay pedidos”, pending: “Pendiente”, sent: “Enviado”, paid: “Pagado”,
mark_sent: “Marcar enviado”, mark_paid: “✓ Pagado”, delete_btn: “Eliminar”,
orders_count: (n) => `${n} pedido${n !== 1 ? "s" : ""}`, panel_admin: “Panel Admin”,
detail: “Detalle del producto”, select_detail: “Selecciona un producto”, in_cart: “✓ En cesta”,
also_like: “También te puede gustar”,
footer_rights: “© 2025 WBC Cards · Todos los derechos reservados”,
legal_aviso: “Aviso Legal”, legal_privacidad: “Privacidad”, legal_cookies: “Cookies”,
legal_envios: “Envíos”, legal_devoluciones: “Devoluciones”,
legal_tab: “Textos Legales”, orders_tab: “Pedidos”, save: “Guardar”, saved: “✓ Guardado”,
email_subject: (n) => `Nuevo pedido - ${n}`,
email_body: (o, prods, total) => `Nuevo pedido\n\nCliente: ${o.nombre}\nEmail: ${o.email}\nTeléfono: ${o.tel || "No indicado"}\nDirección: ${o.address}\n\nProductos:\n${prods}\nTotal: ${total}€\n\nID: ${o.id}`,
},
en: {
splash_sub: “TCG Cards · Pokémon · F1 · More”, splash_btn: “View catalogue →”,
products: “Catalogue”, cart_nav: “Cart”, admin: “Admin”,
search_ph: “Search cards or products…”,
all: “All”, pokemon: “Pokémon”, f1: “F1”, magic: “Magic”, yugioh: “Yu-Gi-Oh”, other: “Other”,
loading: “⏳ Loading…”, error: “Error loading products.”, no_products: “No products available”,
add_cart: “Add”, added: “✓ Added”, out_stock: “Out of stock”,
series: “Series”, stock_label: “Stock”, price: “Price”,
cart_title: “Your cart”, cart_empty_msg: “Add products from the catalogue”, see_catalog: “View catalogue”,
checkout: “Checkout →”, total: “Total”,
order_title: “Order details”, order_sub: “Fill in your details and we’ll contact you for payment.”,
name_l: “Name *”, email_l: “Email *”, tel_l: “Phone”, address_l: “Shipping address *”,
name_ph: “Your full name”, email_ph: “you@email.com”, tel_ph: “+34 600 000 000”, address_ph: “Street, number, city, postcode”,
confirm: “Confirm order”, cancel: “Cancel”,
err_fields: “Please fill in name, email and address.”, err_email: “Invalid email.”,
success: (n, t) => `✓ Order confirmed · ${n} product${n > 1 ? "s" : ""} · €${t}. We'll contact you shortly.`,
access_admin: “Admin Access”, internal: “Internal use only.”,
enter: “Sign in”, wrong_pass: “Wrong password.”, password: “Password”,
no_orders: “No orders yet”, pending: “Pending”, sent: “Shipped”, paid: “Paid”,
mark_sent: “Mark shipped”, mark_paid: “✓ Mark paid”, delete_btn: “Delete”,
orders_count: (n) => `${n} order${n !== 1 ? "s" : ""}`, panel_admin: “Admin Panel”,
detail: “Product detail”, select_detail: “Select a product”, in_cart: “✓ In cart”,
also_like: “You may also like”,
footer_rights: “© 2025 WBC Cards · All rights reserved”,
legal_aviso: “Legal Notice”, legal_privacidad: “Privacy”, legal_cookies: “Cookies”,
legal_envios: “Shipping”, legal_devoluciones: “Returns”,
legal_tab: “Legal Texts”, orders_tab: “Orders”, save: “Save”, saved: “✓ Saved”,
email_subject: (n) => `New order - ${n}`,
email_body: (o, prods, total) => `New order\n\nClient: ${o.nombre}\nEmail: ${o.email}\nPhone: ${o.tel || "Not provided"}\nAddress: ${o.address}\n\nProducts:\n${prods}\nTotal: €${total}\n\nID: ${o.id}`,
}
};

const getOrders = () => { try { return JSON.parse(localStorage.getItem(“wbc_orders”) || “[]”); } catch { return []; } };
const saveOrders = (d) => { try { localStorage.setItem(“wbc_orders”, JSON.stringify(d)); } catch {} };

const CardIcon = ({ size = 24, color = GOLD }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
<rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="1.8" fill="none" />
<path d="M3 9h18" stroke={color} strokeWidth="1.8" />
<path d="M7 15h4M7 12h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
<circle cx="17" cy="13.5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
</svg>
);
const CartIcon = ({ size = 24, color = GOLD }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
<path d="M3 6h18" stroke={color} strokeWidth="1.8" />
<path d="M16 10a4 4 0 01-8 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
</svg>
);
const UserIcon = ({ size = 24, color = GOLD }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
<circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" fill="none" />
<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
</svg>
);

const CATEGORIES = (t) => [
{ key: “all”, label: t.all, emoji: “✦” },
{ key: “Pokemon”, label: t.pokemon, emoji: “⚡” },
{ key: “F1”, label: t.f1, emoji: “🏎” },
{ key: “Magic”, label: t.magic, emoji: “🔮” },
{ key: “Yu-Gi-Oh”, label: t.yugioh, emoji: “⚔️” },
{ key: “Otros”, label: t.other, emoji: “◈” },
];

const RARITY_COLORS = {
“Common”: “#888”, “Uncommon”: “#4ade80”, “Rare”: “#60a5fa”,
“Ultra Rare”: “#a78bfa”, “Secret Rare”: “#f59e0b”, “Holo”: “#ec4899”, “Special”: GOLD,
};

// ── WAVE FOOTER ───────────────────────────────────────────────────────────────
const WaveFooter = ({ t, onLegal }) => (

  <div style={{ marginTop: 40 }}>
    <svg viewBox="0 0 1440 80" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
      <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#1a1200" />
      <path d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,80 L0,80 Z" fill="#0a0a0a" opacity="0.6" />
    </svg>
    <div style={{ background: BLACK, padding: "24px 20px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
        <CardIcon size={20} color={GOLD} />
        <span style={{ color: GOLD, fontSize: 16, fontWeight: 900, letterSpacing: 3 }}>WBC CARDS</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", marginBottom: 16 }}>
        {[
          { key: "aviso", label: t.legal_aviso },
          { key: "privacidad", label: t.legal_privacidad },
          { key: "cookies", label: t.legal_cookies },
          { key: "envios", label: t.legal_envios },
          { key: "devoluciones", label: t.legal_devoluciones },
        ].map(item => (
          <button key={item.key} onClick={() => onLegal(item.key)}
            style={{ background: "none", border: "none", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
            {item.label}
          </button>
        ))}
      </div>
      <p style={{ color: "#333", fontSize: 10, textAlign: "center", letterSpacing: 0.5 }}>{t.footer_rights}</p>
    </div>
  </div>
);

export default function App() {
const [screen, setScreen] = useState(“splash”);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [loadError, setLoadError] = useState(false);
const [selected, setSelected] = useState(null);
const [orders, setOrders] = useState([]);
const [search, setSearch] = useState(””);
const [catFilter, setCatFilter] = useState(“all”);
const [cart, setCart] = useState([]);
const [orderOpen, setOrderOpen] = useState(false);
const [orderData, setOrderData] = useState({ nombre: “”, email: “”, tel: “”, address: “” });
const [orderError, setOrderError] = useState(””);
const [successMsg, setSuccessMsg] = useState(””);
const [adminPass, setAdminPass] = useState(””);
const [adminAuth, setAdminAuth] = useState(false);
const [adminError, setAdminError] = useState(””);
const [adminTab, setAdminTab] = useState(“orders”);
const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
const [lang] = useState(getLang());
const [legalPage, setLegalPage] = useState(null);
const [legal, setLegal] = useState(getLegal());
const [editingLegal, setEditingLegal] = useState({});
const [legalSaved, setLegalSaved] = useState(false);
const t = T[lang];

useEffect(() => {
const r = () => setIsMobile(window.innerWidth < 1024);
window.addEventListener(“resize”, r);
return () => window.removeEventListener(“resize”, r);
}, []);

useEffect(() => {
fetch(SHEET_URL)
.then(r => r.json())
.then(data => { setProducts(data.map((row, i) => ({ _id: i + 1, …row }))); setLoading(false); })
.catch(() => { setLoadError(true); setLoading(false); });
setOrders(getOrders());
}, []);

const filteredProducts = products.filter(p => {
const matchSearch = !search || JSON.stringify(p).toLowerCase().includes(search.toLowerCase());
const matchCat = catFilter === “all” || (p.Categoria || “”).toLowerCase() === catFilter.toLowerCase();
return matchSearch && matchCat;
});

const cartItems = cart.map(c => ({ …c, product: products.find(p => p._id === c.id) })).filter(c => c.product);
const cartTotal = cartItems.reduce((sum, c) => sum + (parseFloat(c.product.Precio || 0) * c.qty), 0).toFixed(2);
const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

const addToCart = (id, e) => {
e && e.stopPropagation();
setCart(prev => {
const ex = prev.find(c => c.id === id);
if (ex) return prev.map(c => c.id === id ? { …c, qty: c.qty + 1 } : c);
return […prev, { id, qty: 1 }];
});
};

const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
const changeQty = (id, delta) => setCart(prev => prev.map(c => c.id === id ? { …c, qty: Math.max(1, c.qty + delta) } : c));
const inCart = (id) => cart.some(c => c.id === id);
const getStock = (p) => parseInt(p.Stock || 0);

const doOrder = () => {
if (!orderData.nombre.trim() || !orderData.email.trim() || !orderData.address.trim()) { setOrderError(t.err_fields); return; }
if (!/\S+@\S+.\S+/.test(orderData.email)) { setOrderError(t.err_email); return; }
const prods = cartItems.map(c => `- ${c.product.Nombre} x${c.qty} · ${(parseFloat(c.product.Precio) * c.qty).toFixed(2)}€`).join(”\n”);
const newOrder = { id: Date.now(), …orderData, items: […cart], total: cartTotal, createdAt: Date.now(), status: “pending” };
const updated = […orders, newOrder];
setOrders(updated); saveOrders(updated);
window.open(`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(t.email_subject(orderData.nombre))}&body=${encodeURIComponent(t.email_body(orderData, prods, cartTotal))}`);
setOrderOpen(false); setOrderData({ nombre: “”, email: “”, tel: “”, address: “” }); setOrderError(””);
setCart([]);
setSuccessMsg(t.success(cartItems.length, cartTotal));
setTimeout(() => setSuccessMsg(””), 8000);
setScreen(“catalog”);
};

const updateStatus = (id, status) => { const u = orders.map(o => o.id === id ? { …o, status } : o); setOrders(u); saveOrders(u); };
const deleteOrder = (id) => { const u = orders.filter(o => o.id !== id); setOrders(u); saveOrders(u); };

const saveLegalTexts = () => {
const updated = { …legal, …editingLegal };
setLegal(updated); saveLegal(updated); setLegalSaved(true);
setTimeout(() => setLegalSaved(false), 2000);
};

const inp = { width: “100%”, padding: “11px 14px”, border: “1px solid #333”, borderRadius: 8, fontSize: 13, outline: “none”, background: “#1e1e1e”, fontFamily: “inherit”, color: “#fff” };

// ── LEGAL PAGE MODAL ─────────────────────────────────────────────────────────
const LegalModal = () => {
if (!legalPage) return null;
const titles = { aviso: t.legal_aviso, privacidad: t.legal_privacidad, cookies: t.legal_cookies, envios: t.legal_envios, devoluciones: t.legal_devoluciones };
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.9)”, zIndex: 300, overflow: “auto” }}>
<div style={{ maxWidth: 680, margin: “0 auto”, background: DARK, minHeight: “100vh”, padding: “0 0 60px” }}>
<div style={{ background: BLACK, padding: “16px 20px”, display: “flex”, alignItems: “center”, gap: 12, borderBottom: “1px solid #222”, position: “sticky”, top: 0, zIndex: 10 }}>
<button onClick={() => setLegalPage(null)} style={{ background: “none”, border: “none”, color: GOLD, fontSize: 26, cursor: “pointer” }}>‹</button>
<span style={{ color: GOLD, fontSize: 13, fontWeight: 700, textTransform: “uppercase”, letterSpacing: 1 }}>{titles[legalPage]}</span>
</div>
<div style={{ padding: “24px 20px” }}>
<pre style={{ color: “#aaa”, fontSize: 13, lineHeight: 1.8, whiteSpace: “pre-wrap”, fontFamily: “inherit” }}>{legal[legalPage]}</pre>
</div>
</div>
</div>
);
};

// ── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = () => (
<div style={{ width: 230, background: BLACK, minHeight: “100vh”, display: “flex”, flexDirection: “column”, flexShrink: 0, position: “sticky”, top: 0, borderRight: “1px solid #222” }}>
<div style={{ padding: “28px 20px 20px”, borderBottom: “1px solid #222” }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<CardIcon size={30} />
<div>
<div style={{ color: GOLD, fontSize: 18, fontWeight: 800, letterSpacing: 1 }}>WBC</div>
<div style={{ color: “#555”, fontSize: 10, letterSpacing: 2, textTransform: “uppercase” }}>Cards</div>
</div>
</div>
</div>
<nav style={{ padding: “16px 12px”, flex: 1 }}>
{[
{ id: “catalog”, icon: <CardIcon size={18} color={screen === “catalog” ? GOLD : “#555”} />, label: t.products },
{ id: “cart”, icon: <CartIcon size={18} color={screen === “cart” ? GOLD : “#555”} />, label: t.cart_nav, badge: cartCount },
{ id: “admin”, icon: <UserIcon size={18} color={screen === “admin” ? GOLD : “#555”} />, label: t.admin },
].map(item => (
<div key={item.id} onClick={() => { setScreen(item.id); if (item.id === “admin”) { setAdminAuth(false); setAdminPass(””); } }}
style={{ display: “flex”, alignItems: “center”, gap: 10, padding: “11px 14px”, borderRadius: 8, marginBottom: 4, cursor: “pointer”, background: screen === item.id ? “#1e1e1e” : “transparent”, borderLeft: screen === item.id ? `2px solid ${GOLD}` : “2px solid transparent” }}>
{item.icon}
<span style={{ color: screen === item.id ? GOLD : “#666”, fontSize: 13, fontWeight: screen === item.id ? 700 : 400 }}>{item.label}</span>
{item.badge > 0 && <span style={{ marginLeft: “auto”, background: GOLD, color: BLACK, borderRadius: 10, fontSize: 10, fontWeight: 800, padding: “1px 7px” }}>{item.badge}</span>}
</div>
))}
<div style={{ marginTop: 20, paddingTop: 16, borderTop: “1px solid #222” }}>
{CATEGORIES(t).map(cat => (
<div key={cat.key} onClick={() => setCatFilter(cat.key)}
style={{ display: “flex”, alignItems: “center”, gap: 8, padding: “8px 14px”, borderRadius: 8, marginBottom: 2, cursor: “pointer”, background: catFilter === cat.key ? “#1e1e1e” : “transparent” }}>
<span style={{ fontSize: 14 }}>{cat.emoji}</span>
<span style={{ color: catFilter === cat.key ? GOLD : “#555”, fontSize: 12, fontWeight: catFilter === cat.key ? 700 : 400 }}>{cat.label}</span>
</div>
))}
</div>
</nav>
{/* Footer links en sidebar */}
<div style={{ padding: “12px 16px”, borderTop: “1px solid #222” }}>
{[{ key: “aviso”, label: t.legal_aviso }, { key: “privacidad”, label: t.legal_privacidad }, { key: “envios”, label: t.legal_envios }, { key: “devoluciones”, label: t.legal_devoluciones }].map(item => (
<button key={item.key} onClick={() => setLegalPage(item.key)}
style={{ display: “block”, background: “none”, border: “none”, color: “#444”, fontSize: 10, cursor: “pointer”, fontFamily: “inherit”, marginBottom: 4, textAlign: “left”, padding: 0 }}>
{item.label}
</button>
))}
<div style={{ color: “#2a2a2a”, fontSize: 9, marginTop: 8 }}>© 2025 WBC Cards</div>
</div>
</div>
);

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
const ProductCard = ({ p }) => {
const stock = getStock(p);
const inC = inCart(p._id);
const rarityColor = RARITY_COLORS[p.Rareza] || GOLD;
return (
<div onClick={() => setSelected(p)} style={{ background: CARD_BG, borderRadius: 12, overflow: “hidden”, border: `1px solid ${inC ? GOLD : "#222"}`, cursor: “pointer”, display: “flex”, flexDirection: “column” }}>
<div style={{ height: 180, background: “#111”, overflow: “hidden”, position: “relative”, flexShrink: 0 }}>
{p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} style={{ width: “100%”, height: “100%”, objectFit: “contain”, padding: 8 }} onError={e => e.target.style.display = “none”} /> : <div style={{ display: “flex”, alignItems: “center”, justifyContent: “center”, height: “100%” }}><CardIcon size={48} color="#333" /></div>}
{p.Rareza && <div style={{ position: “absolute”, top: 8, right: 8, background: “rgba(0,0,0,0.8)”, border: `1px solid ${rarityColor}`, borderRadius: 4, padding: “2px 7px”, fontSize: 9, color: rarityColor, fontWeight: 700, textTransform: “uppercase” }}>{p.Rareza}</div>}
{stock === 0 && <div style={{ position: “absolute”, inset: 0, background: “rgba(0,0,0,0.7)”, display: “flex”, alignItems: “center”, justifyContent: “center” }}><span style={{ color: “#666”, fontSize: 12, fontWeight: 700, textTransform: “uppercase” }}>{t.out_stock}</span></div>}
</div>
<div style={{ padding: “12px 14px”, flex: 1, display: “flex”, flexDirection: “column”, gap: 4 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: “#eee”, lineHeight: 1.3 }}>{p.Nombre}</div>
{p.Serie && <div style={{ fontSize: 11, color: “#555” }}>{p.Categoria} · {p.Serie}</div>}
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginTop: “auto”, paddingTop: 8 }}>
<div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>{parseFloat(p.Precio || 0).toFixed(2)}€</div>
<button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
style={{ background: inC ? “#16a34a” : stock === 0 ? “#222” : GOLD, color: inC ? “#fff” : stock === 0 ? “#444” : BLACK, border: “none”, borderRadius: 6, padding: “6px 12px”, fontSize: 11, fontWeight: 800, cursor: stock === 0 ? “default” : “pointer”, textTransform: “uppercase” }}>
{inC ? t.added : stock === 0 ? t.out_stock : t.add_cart}
</button>
</div>
</div>
</div>
);
};

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
const DetailPanel = () => (
<div style={{ width: 300, background: DARK, borderLeft: “1px solid #222”, overflow: “auto”, flexShrink: 0 }}>
{!selected ? (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, height: “100%”, color: “#333”, padding: 32, textAlign: “center” }}>
<CardIcon size={48} color="#333" /><p style={{ marginTop: 16, fontSize: 13 }}>{t.select_detail}</p>
</div>
) : (
<div style={{ padding: 20 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 16 }}>
<span style={{ color: GOLD, fontSize: 11, fontWeight: 700, textTransform: “uppercase”, letterSpacing: 1 }}>{t.detail}</span>
<button onClick={() => setSelected(null)} style={{ background: “none”, border: “none”, color: “#555”, fontSize: 18, cursor: “pointer” }}>×</button>
</div>
{selected.Imagen_URL && <div style={{ height: 200, background: “#111”, borderRadius: 10, overflow: “hidden”, marginBottom: 16, display: “flex”, alignItems: “center”, justifyContent: “center” }}><img src={selected.Imagen_URL} alt={selected.Nombre} style={{ maxHeight: “100%”, maxWidth: “100%”, objectFit: “contain” }} /></div>}
<h2 style={{ fontSize: 16, fontWeight: 800, color: “#fff”, marginBottom: 4 }}>{selected.Nombre}</h2>
{selected.Rareza && <div style={{ display: “inline-block”, background: “rgba(201,168,76,0.1)”, border: `1px solid ${GOLD}`, borderRadius: 4, padding: “2px 8px”, fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 12, textTransform: “uppercase” }}>{selected.Rareza}</div>}
<div style={{ borderTop: “1px solid #222”, paddingTop: 12 }}>
{[[t.price, `${parseFloat(selected.Precio || 0).toFixed(2)}€`], [t.series, selected.Serie], [“Categoría”, selected.Categoria], [t.stock_label, selected.Stock]].filter(r => r[1]).map(([label, value]) => (
<div key={label} style={{ display: “flex”, justifyContent: “space-between”, padding: “9px 0”, borderBottom: “1px solid #1e1e1e”, fontSize: 13 }}>
<span style={{ color: “#555” }}>{label}</span><span style={{ fontWeight: 600, color: “#ddd” }}>{value}</span>
</div>
))}
</div>
<button onClick={e => { if (getStock(selected) > 0) addToCart(selected._id, e); }}
style={{ width: “100%”, marginTop: 16, background: inCart(selected._id) ? “#16a34a” : getStock(selected) === 0 ? “#222” : GOLD, color: inCart(selected._id) ? “#fff” : getStock(selected) === 0 ? “#444” : BLACK, border: “none”, borderRadius: 8, padding: “13px”, fontSize: 13, fontWeight: 800, cursor: getStock(selected) === 0 ? “default” : “pointer”, textTransform: “uppercase” }}>
{inCart(selected._id) ? t.in_cart : getStock(selected) === 0 ? t.out_stock : t.add_cart}
</button>
</div>
)}
</div>
);

// ── CATALOG ───────────────────────────────────────────────────────────────────
const CatalogContent = () => (
<div style={{ flex: 1, overflow: “auto”, background: DARK }}>
<div style={{ padding: “16px 20px”, background: BLACK, borderBottom: “1px solid #222”, position: “sticky”, top: 0, zIndex: 10 }}>
<div style={{ position: “relative” }}>
<span style={{ position: “absolute”, left: 14, top: “50%”, transform: “translateY(-50%)”, color: “#444”, fontSize: 14 }}>🔍</span>
<input style={{ …inp, paddingLeft: 40, background: “#111” }} placeholder={t.search_ph} value={search} onChange={e => setSearch(e.target.value)} />
</div>
</div>
{successMsg && <div style={{ background: “#14532d”, color: “#86efac”, padding: “10px 20px”, fontSize: 13 }}>{successMsg}</div>}
{loading && <div style={{ textAlign: “center”, padding: 48, color: “#555” }}>{t.loading}</div>}
{loadError && <div style={{ background: “#1e0000”, color: “#f87171”, margin: 16, borderRadius: 10, padding: 14, textAlign: “center”, fontSize: 13 }}>{t.error}</div>}
{!loading && !loadError && (
<>
<div style={{ padding: “16px 20px”, display: “grid”, gridTemplateColumns: “repeat(auto-fill, minmax(200px, 1fr))”, gap: 14 }}>
{filteredProducts.map(p => <ProductCard key={p._id} p={p} />)}
{filteredProducts.length === 0 && <div style={{ gridColumn: “1/-1”, textAlign: “center”, padding: 60, color: “#444” }}><CardIcon size={48} color="#333" /><p style={{ marginTop: 12, fontSize: 14 }}>{t.no_products}</p></div>}
</div>
<WaveFooter t={t} onLegal={setLegalPage} />
</>
)}
</div>
);

// ── CART ──────────────────────────────────────────────────────────────────────
const CartContent = () => (
<div style={{ flex: 1, overflow: “auto”, background: DARK, padding: 20 }}>
<h2 style={{ fontSize: 18, fontWeight: 800, color: GOLD, marginBottom: 16, letterSpacing: 1, textTransform: “uppercase” }}>{t.cart_title}</h2>
{cartItems.length === 0 ? (
<div style={{ textAlign: “center”, padding: 60, color: “#444” }}>
<CartIcon size={48} color="#333" />
<p style={{ marginTop: 16, fontSize: 14, marginBottom: 20 }}>{t.cart_empty_msg}</p>
<button onClick={() => setScreen(“catalog”)} style={{ background: GOLD, color: BLACK, border: “none”, borderRadius: 8, padding: “11px 24px”, fontSize: 13, fontWeight: 800, cursor: “pointer”, textTransform: “uppercase” }}>{t.see_catalog}</button>
</div>
) : (
<>
<div style={{ background: CARD_BG, borderRadius: 12, overflow: “hidden”, marginBottom: 16, border: “1px solid #222” }}>
{cartItems.map((c, i) => (
<div key={c.id} style={{ display: “flex”, alignItems: “center”, gap: 12, padding: “14px 16px”, borderBottom: i < cartItems.length - 1 ? “1px solid #1e1e1e” : “none” }}>
{c.product.Imagen_URL ? <img src={c.product.Imagen_URL} alt={c.product.Nombre} style={{ width: 44, height: 44, objectFit: “contain”, borderRadius: 6, background: “#111”, flexShrink: 0 }} /> : <div style={{ width: 44, height: 44, background: “#111”, borderRadius: 6, display: “flex”, alignItems: “center”, justifyContent: “center”, flexShrink: 0 }}><CardIcon size={22} color="#333" /></div>}
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: “#ddd”, marginBottom: 2, whiteSpace: “nowrap”, overflow: “hidden”, textOverflow: “ellipsis” }}>{c.product.Nombre}</div>
<div style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>{(parseFloat(c.product.Precio || 0) * c.qty).toFixed(2)}€</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 6 }}>
<button onClick={() => changeQty(c.id, -1)} style={{ width: 26, height: 26, background: “#222”, border: “1px solid #333”, borderRadius: 4, color: “#aaa”, fontSize: 16, cursor: “pointer”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>−</button>
<span style={{ color: “#fff”, fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: “center” }}>{c.qty}</span>
<button onClick={() => changeQty(c.id, 1)} style={{ width: 26, height: 26, background: “#222”, border: “1px solid #333”, borderRadius: 4, color: “#aaa”, fontSize: 16, cursor: “pointer”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>+</button>
<button onClick={() => removeFromCart(c.id)} style={{ width: 26, height: 26, background: “#1e0000”, border: “1px solid #330000”, borderRadius: 4, color: “#f87171”, fontSize: 14, cursor: “pointer”, display: “flex”, alignItems: “center”, justifyContent: “center”, marginLeft: 4 }}>×</button>
</div>
</div>
))}
</div>
<div style={{ background: CARD_BG, borderRadius: 12, padding: “14px 16px”, border: “1px solid #222”, marginBottom: 16 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, fontSize: 16, fontWeight: 800 }}>
<span style={{ color: “#888” }}>{t.total}</span><span style={{ color: GOLD }}>{cartTotal}€</span>
</div>
</div>
<button onClick={() => setOrderOpen(true)} style={{ width: “100%”, background: GOLD, color: BLACK, border: “none”, borderRadius: 10, padding: “15px”, fontSize: 15, fontWeight: 800, cursor: “pointer”, textTransform: “uppercase”, letterSpacing: 1 }}>{t.checkout}</button>
</>
)}
</div>
);

// ── ADMIN ─────────────────────────────────────────────────────────────────────
const AdminContent = () => {
const legalKeys = [
{ key: “aviso”, label: t.legal_aviso },
{ key: “privacidad”, label: t.legal_privacidad },
{ key: “cookies”, label: t.legal_cookies },
{ key: “envios”, label: t.legal_envios },
{ key: “devoluciones”, label: t.legal_devoluciones },
];
const [activeLegal, setActiveLegal] = useState(“aviso”);

```
return (
  <div style={{ flex: 1, overflow: "auto", background: DARK, padding: 20 }}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: GOLD, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>{t.panel_admin}</h2>
    {!adminAuth ? (
      <div style={{ maxWidth: 380, background: CARD_BG, borderRadius: 14, padding: 28, border: "1px solid #222" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}><UserIcon size={44} color={GOLD} /></div>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#ddd", textAlign: "center", marginBottom: 6 }}>{t.access_admin}</h3>
        <p style={{ fontSize: 12, color: "#555", textAlign: "center", marginBottom: 20 }}>{t.internal}</p>
        <input style={{ ...inp, marginBottom: 10 }} type="password" placeholder={t.password} value={adminPass} onChange={e => setAdminPass(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { adminPass === ADMIN_PASSWORD ? (setAdminAuth(true), setAdminError("")) : setAdminError(t.wrong_pass); }}} />
        {adminError && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 10 }}>{adminError}</p>}
        <button style={{ width: "100%", background: GOLD, color: BLACK, border: "none", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}
          onClick={() => { adminPass === ADMIN_PASSWORD ? (setAdminAuth(true), setAdminError("")) : setAdminError(t.wrong_pass); }}>{t.enter}</button>
      </div>
    ) : (
      <>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[{ id: "orders", label: t.orders_tab }, { id: "legal", label: t.legal_tab }].map(tab => (
            <button key={tab.id} onClick={() => setAdminTab(tab.id)}
              style={{ background: adminTab === tab.id ? GOLD : "#222", color: adminTab === tab.id ? BLACK : "#666", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* PEDIDOS TAB */}
        {adminTab === "orders" && (
          <>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>{t.orders_count(orders.length)}</p>
            {orders.length === 0 ? <div style={{ textAlign: "center", padding: 48, color: "#444", background: CARD_BG, borderRadius: 12 }}>{t.no_orders}</div> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                {orders.map(order => {
                  const orderProds = order.items.map(c => { const p = products.find(x => x._id === c.id); return p ? `${p.Nombre} x${c.qty}` : ""; }).filter(Boolean);
                  const statusColor = order.status === "paid" ? "#4ade80" : order.status === "sent" ? "#60a5fa" : GOLD;
                  const statusLabel = order.status === "paid" ? t.paid : order.status === "sent" ? t.sent : t.pending;
                  return (
                    <div key={order.id} style={{ background: CARD_BG, borderRadius: 12, padding: 16, border: "1px solid #222" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "#ddd" }}>{order.nombre}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(0,0,0,0.5)", border: `1px solid ${statusColor}`, color: statusColor }}>{statusLabel}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#555" }}>{order.email}</p>
                      {order.tel && <p style={{ fontSize: 12, color: "#555" }}>📞 {order.tel}</p>}
                      <p style={{ fontSize: 12, color: "#555" }}>📍 {order.address}</p>
                      <div style={{ background: "#111", borderRadius: 8, padding: "8px 10px", margin: "10px 0" }}>
                        {orderProds.map((p, i) => <div key={i} style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>• {p}</div>)}
                        <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, marginTop: 6 }}>{order.total}€</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {order.status === "pending" && <button onClick={() => updateStatus(order.id, "sent")} style={{ flex: 2, background: "#1e3a5f", color: "#60a5fa", border: "1px solid #2563eb", borderRadius: 6, padding: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t.mark_sent}</button>}
                        {order.status === "sent" && <button onClick={() => updateStatus(order.id, "paid")} style={{ flex: 2, background: "#14532d", color: "#4ade80", border: "1px solid #16a34a", borderRadius: 6, padding: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t.mark_paid}</button>}
                        <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, background: "#1e0000", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, padding: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t.delete_btn}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TEXTOS LEGALES TAB */}
        {adminTab === "legal" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {legalKeys.map(lk => (
                <button key={lk.key} onClick={() => setActiveLegal(lk.key)}
                  style={{ background: activeLegal === lk.key ? GOLD : "#222", color: activeLegal === lk.key ? BLACK : "#666", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {lk.label}
                </button>
              ))}
            </div>
            <textarea
              style={{ ...inp, minHeight: 320, resize: "vertical", lineHeight: 1.6, fontSize: 12 }}
              value={editingLegal[activeLegal] !== undefined ? editingLegal[activeLegal] : legal[activeLegal]}
              onChange={e => setEditingLegal(prev => ({ ...prev, [activeLegal]: e.target.value }))}
            />
            <button onClick={saveLegalTexts}
              style={{ marginTop: 12, background: legalSaved ? "#16a34a" : GOLD, color: BLACK, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
              {legalSaved ? t.saved : t.save}
            </button>
            <p style={{ fontSize: 11, color: "#555", marginTop: 8 }}>Los cambios se guardan en este dispositivo. El texto aparece en el footer.</p>
          </div>
        )}
      </>
    )}
  </div>
);
```

};

// ── RENDER ────────────────────────────────────────────────────────────────────
return (
<div style={{ fontFamily: “‘Segoe UI’, -apple-system, sans-serif”, minHeight: “100vh”, background: DARK, color: LIGHT }}>
<style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder, textarea::placeholder { color: #444; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; } .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: flex-end; justify-content: center; } .modal-sheet { background: #141414; border-radius: 20px 20px 0 0; padding: 0 20px 44px; width: 100%; max-width: 560px; max-height: 93vh; overflow-y: auto; border-top: 1px solid #222; } .handle { width: 40px; height: 3px; background: #333; border-radius: 2px; margin: 12px auto 20px; } .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #0a0a0a; border-top: 1px solid #1e1e1e; display: flex; padding-bottom: env(safe-area-inset-bottom, 16px); padding-top: 10px; z-index: 100; } .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px; } .nav-label { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; } .cart-bar { position: fixed; bottom: 80px; left: 0; right: 0; background: ${GOLD}; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 90; }`}</style>

```
  <LegalModal />

  {/* SPLASH */}
  {screen === "splash" && (
    <div style={{ minHeight: "100vh", background: BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ marginBottom: 24 }}><CardIcon size={72} /></div>
      <span style={{ color: GOLD, fontSize: 42, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>WBC</span>
      <div style={{ color: "#333", fontSize: 12, letterSpacing: 6, textTransform: "uppercase", marginBottom: 12 }}>CARDS</div>
      <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 16 }} />
      <p style={{ color: "#555", fontSize: 13, marginBottom: 56, textAlign: "center", letterSpacing: 1 }}>{t.splash_sub}</p>
      <button onClick={() => setScreen("catalog")} style={{ background: GOLD, color: BLACK, border: "none", borderRadius: 4, padding: "16px 40px", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2, textTransform: "uppercase" }}>{t.splash_btn}</button>
    </div>
  )}

  {/* DESKTOP */}
  {screen !== "splash" && !isMobile && (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: "100vh" }}>
        {screen === "catalog" && <><CatalogContent /><DetailPanel /></>}
        {screen === "cart" && <CartContent />}
        {screen === "admin" && <AdminContent />}
      </div>
    </div>
  )}

  {/* MOBILE */}
  {screen !== "splash" && isMobile && (
    <div style={{ paddingBottom: 80, background: DARK, minHeight: "100vh" }}>
      <div style={{ background: BLACK, paddingTop: "env(safe-area-inset-top, 44px)", paddingBottom: 12, paddingLeft: 16, paddingRight: 16, borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CardIcon size={26} />
            <div>
              <span style={{ color: GOLD, fontSize: 18, fontWeight: 900, letterSpacing: 3 }}>WBC</span>
              <span style={{ color: "#444", fontSize: 9, letterSpacing: 3, marginLeft: 6, textTransform: "uppercase" }}>CARDS</span>
            </div>
          </div>
          {cartCount > 0 && (
            <div onClick={() => setScreen("cart")} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <CartIcon size={22} /><span style={{ background: GOLD, color: BLACK, borderRadius: 10, fontSize: 10, fontWeight: 800, padding: "2px 7px" }}>{cartCount}</span>
            </div>
          )}
        </div>
      </div>

      {screen === "catalog" && (
        <>
          <div style={{ padding: "10px 16px", background: BLACK, borderBottom: "1px solid #1e1e1e" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: 14 }}>🔍</span>
              <input style={{ ...inp, paddingLeft: 36, background: "#0f0f0f" }} placeholder={t.search_ph} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: BLACK, borderBottom: "1px solid #1e1e1e" }}>
            {CATEGORIES(t).map(cat => (
              <button key={cat.key} onClick={() => setCatFilter(cat.key)}
                style={{ flexShrink: 0, background: catFilter === cat.key ? GOLD : "#1a1a1a", color: catFilter === cat.key ? BLACK : "#555", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          {successMsg && <div style={{ background: "#14532d", color: "#86efac", padding: "10px 16px", fontSize: 13 }}>{successMsg}</div>}
          {loading && <div style={{ textAlign: "center", padding: 48, color: "#555" }}>{t.loading}</div>}
          {loadError && <div style={{ background: "#1e0000", color: "#f87171", margin: 16, borderRadius: 10, padding: 14, textAlign: "center", fontSize: 13 }}>{t.error}</div>}

          {!loading && !loadError && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "14px 12px" }}>
                {filteredProducts.map(p => {
                  const stock = getStock(p);
                  const inC = inCart(p._id);
                  return (
                    <div key={p._id} onClick={() => setSelected(p)} style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden", border: `1px solid ${inC ? GOLD : "#222"}`, cursor: "pointer", display: "flex", flexDirection: "column" }}>
                      <div style={{ background: "#111", position: "relative", paddingTop: "100%", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} onError={e => e.target.style.display = "none"} /> : <CardIcon size={40} color="#333" />}
                        </div>
                        {p.Rareza && <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.85)", border: `1px solid ${RARITY_COLORS[p.Rareza] || GOLD}`, borderRadius: 4, padding: "2px 6px", fontSize: 8, color: RARITY_COLORS[p.Rareza] || GOLD, fontWeight: 700, textTransform: "uppercase" }}>{p.Rareza}</div>}
                        {stock === 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#666", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{t.out_stock}</span></div>}
                      </div>
                      <div style={{ padding: "10px 10px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#eee", lineHeight: 1.3, marginBottom: 6, minHeight: 32 }}>{p.Nombre}</div>
                        {p.Serie && <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>{p.Serie}</div>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 15, fontWeight: 900, color: GOLD }}>{parseFloat(p.Precio || 0).toFixed(2)}€</div>
                          <button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
                            style={{ background: inC ? "#16a34a" : stock === 0 ? "#222" : GOLD, color: inC ? "#fff" : stock === 0 ? "#444" : BLACK, border: "none", borderRadius: 6, width: 32, height: 32, fontSize: 18, fontWeight: 800, cursor: stock === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {inC ? "✓" : stock === 0 ? "−" : "+"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#444" }}><CardIcon size={48} color="#333" /><p style={{ marginTop: 12, fontSize: 14 }}>{t.no_products}</p></div>}
              </div>
              {/* WAVE FOOTER MOBILE */}
              <WaveFooter t={t} onLegal={setLegalPage} />
            </>
          )}

          {cartCount > 0 && (
            <div className="cart-bar">
              <div>
                <p style={{ color: BLACK, fontWeight: 800, fontSize: 13 }}>{cartCount} {lang === "en" ? `item${cartCount > 1 ? "s" : ""}` : `producto${cartCount > 1 ? "s" : ""}`} · {cartTotal}€</p>
                <p style={{ color: "rgba(0,0,0,0.6)", fontSize: 10, textTransform: "uppercase" }}>{t.cart_nav}</p>
              </div>
              <button onClick={() => setScreen("cart")} style={{ background: BLACK, color: GOLD, border: "none", borderRadius: 6, padding: "9px 18px", fontWeight: 800, fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>{t.checkout}</button>
            </div>
          )}

          {selected && (
            <div style={{ position: "fixed", inset: 0, background: DARK, zIndex: 150, overflow: "auto", paddingBottom: 80 }}>
              <div style={{ background: BLACK, paddingTop: "env(safe-area-inset-top, 44px)", paddingLeft: 16, paddingRight: 16, paddingBottom: 14, borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8 }}>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: GOLD, fontSize: 26, cursor: "pointer" }}>‹</button>
                  <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{t.detail}</span>
                </div>
              </div>
              {selected.Imagen_URL && (
                <div style={{ width: "100%", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <img src={selected.Imagen_URL} alt={selected.Nombre} style={{ maxWidth: "85%", maxHeight: 400, objectFit: "contain", borderRadius: 8 }} />
                </div>
              )}
              <div style={{ padding: "20px 16px" }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{selected.Nombre}</h1>
                {selected.Rareza && <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{selected.Rareza}</div>}
                <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, marginBottom: 16 }}>{parseFloat(selected.Precio || 0).toFixed(2)}€</div>
                <button style={{ width: "100%", background: inCart(selected._id) ? "#16a34a" : getStock(selected) === 0 ? "#222" : GOLD, color: inCart(selected._id) ? "#fff" : getStock(selected) === 0 ? "#444" : BLACK, border: "none", borderRadius: 10, padding: "15px", fontSize: 15, fontWeight: 800, cursor: getStock(selected) === 0 ? "default" : "pointer", marginBottom: 20, textTransform: "uppercase" }}
                  onClick={e => { if (getStock(selected) > 0) addToCart(selected._id, e); }}>
                  {inCart(selected._id) ? t.in_cart : getStock(selected) === 0 ? t.out_stock : t.add_cart}
                </button>
                {[["Precio", `${parseFloat(selected.Precio || 0).toFixed(2)}€`], [t.series, selected.Serie], ["Categoría", selected.Categoria], [t.stock_label, selected.Stock]].filter(r => r[1]).map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #1e1e1e", fontSize: 14 }}>
                    <span style={{ color: "#555" }}>{l}</span><span style={{ fontWeight: 600, color: "#ddd" }}>{v}</span>
                  </div>
                ))}
                {products.filter(p => p._id !== selected._id).length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 16, textAlign: "center" }}>{t.also_like}</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {products.filter(p => p._id !== selected._id).sort(() => Math.random() - 0.5).slice(0, 4).map(p => {
                        const inC = inCart(p._id);
                        const stock = getStock(p);
                        return (
                          <div key={p._id} onClick={() => setSelected(p)} style={{ background: CARD_BG, borderRadius: 10, overflow: "hidden", border: "1px solid #222", cursor: "pointer" }}>
                            <div style={{ background: "#111", paddingTop: "100%", position: "relative" }}>
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} /> : <CardIcon size={32} color="#333" />}
                              </div>
                            </div>
                            <div style={{ padding: "8px 10px" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#ddd", lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.Nombre}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 13, fontWeight: 900, color: GOLD }}>{parseFloat(p.Precio || 0).toFixed(2)}€</span>
                                <button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
                                  style={{ background: inC ? "#16a34a" : stock === 0 ? "#222" : GOLD, color: inC ? "#fff" : stock === 0 ? "#444" : BLACK, border: "none", borderRadius: 5, width: 26, height: 26, fontSize: 16, fontWeight: 800, cursor: stock === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {inC ? "✓" : stock === 0 ? "−" : "+"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {screen === "cart" && <div style={{ padding: 16 }}><CartContent /></div>}
      {screen === "admin" && <div style={{ padding: 16 }}><AdminContent /></div>}
    </div>
  )}

  {/* MOBILE NAV */}
  {screen !== "splash" && isMobile && (
    <div className="bottom-bar">
      <div className="nav-item" onClick={() => setScreen("catalog")}>
        <CardIcon size={22} color={screen === "catalog" ? GOLD : "#444"} />
        <span className="nav-label" style={{ color: screen === "catalog" ? GOLD : "#444" }}>{t.products}</span>
      </div>
      <div className="nav-item" onClick={() => setScreen("cart")}>
        <div style={{ position: "relative" }}>
          <CartIcon size={22} color={screen === "cart" ? GOLD : "#444"} />
          {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -8, background: GOLD, color: BLACK, borderRadius: 10, fontSize: 8, fontWeight: 800, padding: "1px 5px" }}>{cartCount}</span>}
        </div>
        <span className="nav-label" style={{ color: screen === "cart" ? GOLD : "#444" }}>{t.cart_nav}</span>
      </div>
      <div className="nav-item" onClick={() => { setScreen("admin"); setAdminAuth(false); setAdminPass(""); }}>
        <UserIcon size={22} color={screen === "admin" ? GOLD : "#444"} />
        <span className="nav-label" style={{ color: screen === "admin" ? GOLD : "#444" }}>{t.admin}</span>
      </div>
    </div>
  )}

  {/* ORDER MODAL */}
  {orderOpen && (
    <div className="modal-overlay" onClick={() => setOrderOpen(false)}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="handle" />
        <h2 style={{ fontSize: 18, fontWeight: 800, color: GOLD, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.order_title}</h2>
        <p style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>{t.order_sub}</p>
        <div style={{ background: "#111", borderRadius: 10, padding: "8px 14px", marginBottom: 16 }}>
          {cartItems.map(c => (
            <div key={c.id} style={{ padding: "7px 0", borderBottom: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#888" }}>{c.product.Nombre} x{c.qty}</span>
              <span style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>{(parseFloat(c.product.Precio || 0) * c.qty).toFixed(2)}€</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontSize: 14, fontWeight: 800 }}>
            <span style={{ color: "#666" }}>{t.total}</span><span style={{ color: GOLD }}>{cartTotal}€</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[[t.name_l, "text", t.name_ph, "nombre"], [t.email_l, "email", t.email_ph, "email"], [t.tel_l, "tel", t.tel_ph, "tel"], [t.address_l, "text", t.address_ph, "address"]].map(([label, type, ph, key]) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
              <input style={inp} type={type} placeholder={ph} value={orderData[key]} onChange={e => setOrderData(d => ({ ...d, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
        {orderError && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{orderError}</p>}
        <button style={{ width: "100%", background: GOLD, color: BLACK, border: "none", borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }} onClick={doOrder}>{t.confirm}</button>
        <button style={{ width: "100%", background: "none", color: "#555", border: "1px solid #222", borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setOrderOpen(false)}>{t.cancel}</button>
      </div>
    </div>
  )}
</div>
```

);
}
