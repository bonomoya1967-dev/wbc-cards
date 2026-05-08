import { useState, useEffect } from “react”;

const SHEET_URL = “https://opensheet.elk.sh/18pEEgSp4mZ0x6vdd5N8gNuwcJTh_cZXV7kSSQwDT-gg/wbccards”;
const ADMIN_EMAIL = “tu@email.com”;
const ADMIN_PASSWORD = “admin2026”;
const BLACK = “#0a0a0a”;
const DARK = “#141414”;
const CARD_BG = “#1a1a1a”;
const GOLD = “#c9a84c”;
const RED = “#dc2626”;
const LIGHT = “#f5f5f5”;
const LOGO_URI = “data:image/png;base64,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”;

const getLang = () => (navigator.language || “es”).toLowerCase().startsWith(“es”) ? “es” : “en”;

// ── COLECCIONES F1 ────────────────────────────────────────────────────────────
const F1_COLLECTIONS = [
{ key: “all”, label: “Todo”, emoji: “🏁” },
{ key: “Topps Chrome 2020”, label: “Chrome 2020”, emoji: “🔴” },
{ key: “Topps Chrome 2021”, label: “Chrome 2021”, emoji: “🔴” },
{ key: “Topps Chrome 2022”, label: “Chrome 2022”, emoji: “🔴” },
{ key: “Topps Chrome 2023”, label: “Chrome 2023”, emoji: “🔴” },
{ key: “Topps Chrome 2024”, label: “Chrome 2024”, emoji: “🔴” },
{ key: “Turbo Attax 2020”, label: “Turbo Attax 2020”, emoji: “⚡” },
{ key: “Turbo Attax 2021”, label: “Turbo Attax 2021”, emoji: “⚡” },
{ key: “Turbo Attax 2022”, label: “Turbo Attax 2022”, emoji: “⚡” },
{ key: “Turbo Attax 2023”, label: “Turbo Attax 2023”, emoji: “⚡” },
{ key: “Turbo Attax 2024”, label: “Turbo Attax 2024”, emoji: “⚡” },
{ key: “Otros”, label: “Otros F1”, emoji: “🏎” },
];

const RARITY_COLORS = {
“Common”: “#888”, “Uncommon”: “#4ade80”, “Rare”: “#60a5fa”,
“Ultra Rare”: “#a78bfa”, “Secret Rare”: “#f59e0b”, “Holo”: “#ec4899”,
“Autograph”: RED, “Special”: GOLD,
};

// ── LEGAL ─────────────────────────────────────────────────────────────────────
const DEFAULT_LEGAL = {
aviso: `AVISO LEGAL\n\nTitular: WBC Cards F1\nDomicilio: España\nEmail: contacto@wbccards.com\n\nEn cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI), se informa que este sitio web es propiedad de WBC Cards F1.\n\nEl acceso y uso de este sitio web implica la aceptación plena de las condiciones de uso aquí establecidas.`,
privacidad: `POLÍTICA DE PRIVACIDAD\n\nEn cumplimiento del RGPD y la LOPDGDD:\n\nRESPONSABLE: WBC Cards F1\nFINALIDAD: Gestión de pedidos y comunicaciones\nLEGITIMACIÓN: Ejecución de contrato y consentimiento\nDESTINATARIOS: No se ceden datos a terceros\nDERECHOS: Acceso, rectificación, supresión escribiendo a contacto@wbccards.com`,
cookies: `POLÍTICA DE COOKIES\n\nEste sitio utiliza cookies técnicas necesarias para su funcionamiento y cookies analíticas para mejorar la experiencia.\n\nPuedes rechazar las cookies desde la configuración de tu navegador.`,
envios: `POLÍTICA DE ENVÍOS\n\nPLAZOS:\n- España peninsular: 2-5 días laborables\n- Islas y Portugal: 3-7 días laborables\n- Europa: 5-10 días laborables\n\nLas cartas se envían con funda, toploader y embalaje acolchado con número de seguimiento.`,
devoluciones: `POLÍTICA DE DEVOLUCIONES\n\nDerecho de desistimiento: 14 días naturales desde la recepción.\n\nEl producto debe estar en el mismo estado recibido. Los gastos de devolución corren a cargo del comprador salvo producto defectuoso.\n\nContacto: contacto@wbccards.com`
};

const getLegal = () => { try { return JSON.parse(localStorage.getItem(“wbcf1_legal”) || “null”) || DEFAULT_LEGAL; } catch { return DEFAULT_LEGAL; } };
const saveLegal = (d) => { try { localStorage.setItem(“wbcf1_legal”, JSON.stringify(d)); } catch {} };
const getOrders = () => { try { return JSON.parse(localStorage.getItem(“wbcf1_orders”) || “[]”); } catch { return []; } };
const saveOrders = (d) => { try { localStorage.setItem(“wbcf1_orders”, JSON.stringify(d)); } catch {} };

const T = {
es: {
splash_sub: “Cartas F1 · Topps Chrome · Turbo Attax”, splash_btn: “Ver colecciones →”,
catalog: “Catálogo”, cart_nav: “Cesta”, admin: “Admin”,
search_ph: “Buscar carta, piloto, equipo…”,
loading: “⏳ Cargando…”, error: “Error al cargar productos.”, no_products: “No hay cartas disponibles”,
add_cart: “Añadir”, added: “✓ Añadida”, out_stock: “Sin stock”,
series: “Colección”, stock_label: “Stock”, price: “Precio”,
cart_title: “Tu cesta”, cart_empty_msg: “Añade cartas del catálogo”, see_catalog: “Ver catálogo”,
checkout: “Tramitar pedido →”, total: “Total”,
order_title: “Datos del pedido”, order_sub: “Completa tus datos y te contactamos para el pago.”,
name_l: “Nombre *”, email_l: “Email *”, tel_l: “Teléfono”, address_l: “Dirección de envío *”,
name_ph: “Tu nombre completo”, email_ph: “tu@email.com”, tel_ph: “600 000 000”, address_ph: “Calle, número, ciudad, CP”,
confirm: “Confirmar pedido”, cancel: “Cancelar”,
err_fields: “Rellena nombre, email y dirección.”, err_email: “Email no válido.”,
success: (n, t) => `✓ Pedido confirmado · ${n} carta${n > 1 ? "s" : ""} · ${t}€. Te contactamos en breve.`,
access_admin: “Acceso Admin”, internal: “Solo uso interno.”,
enter: “Entrar”, wrong_pass: “Contraseña incorrecta.”, password: “Contraseña”,
no_orders: “No hay pedidos”, pending: “Pendiente”, sent: “Enviado”, paid: “Pagado”,
mark_sent: “Marcar enviado”, mark_paid: “✓ Pagado”, delete_btn: “Eliminar”,
orders_count: (n) => `${n} pedido${n !== 1 ? "s" : ""}`, panel_admin: “Panel Admin”,
detail: “Detalle carta”, select_detail: “Selecciona una carta”, in_cart: “✓ En cesta”,
also_like: “También te puede gustar”,
footer_rights: “© 2025 WBC Cards F1 · Todos los derechos reservados”,
legal_aviso: “Aviso Legal”, legal_privacidad: “Privacidad”, legal_cookies: “Cookies”,
legal_envios: “Envíos”, legal_devoluciones: “Devoluciones”,
legal_tab: “Textos Legales”, orders_tab: “Pedidos”, save: “Guardar”, saved: “✓ Guardado”,
collections: “Colecciones”,
email_subject: (n) => `Nuevo pedido F1 - ${n}`,
email_body: (o, prods, total) => `Nuevo pedido\n\nCliente: ${o.nombre}\nEmail: ${o.email}\nTeléfono: ${o.tel || "No indicado"}\nDirección: ${o.address}\n\nCartas:\n${prods}\nTotal: ${total}€\n\nID: ${o.id}`,
},
en: {
splash_sub: “F1 Cards · Topps Chrome · Turbo Attax”, splash_btn: “View collections →”,
catalog: “Catalogue”, cart_nav: “Cart”, admin: “Admin”,
search_ph: “Search card, driver, team…”,
loading: “⏳ Loading…”, error: “Error loading products.”, no_products: “No cards available”,
add_cart: “Add”, added: “✓ Added”, out_stock: “Out of stock”,
series: “Collection”, stock_label: “Stock”, price: “Price”,
cart_title: “Your cart”, cart_empty_msg: “Add cards from the catalogue”, see_catalog: “View catalogue”,
checkout: “Checkout →”, total: “Total”,
order_title: “Order details”, order_sub: “Fill in your details and we’ll contact you for payment.”,
name_l: “Name *”, email_l: “Email *”, tel_l: “Phone”, address_l: “Shipping address *”,
name_ph: “Your full name”, email_ph: “you@email.com”, tel_ph: “+34 600 000 000”, address_ph: “Street, number, city, postcode”,
confirm: “Confirm order”, cancel: “Cancel”,
err_fields: “Please fill in name, email and address.”, err_email: “Invalid email.”,
success: (n, t) => `✓ Order confirmed · ${n} card${n > 1 ? "s" : ""} · €${t}. We'll contact you shortly.`,
access_admin: “Admin Access”, internal: “Internal use only.”,
enter: “Sign in”, wrong_pass: “Wrong password.”, password: “Password”,
no_orders: “No orders yet”, pending: “Pending”, sent: “Shipped”, paid: “Paid”,
mark_sent: “Mark shipped”, mark_paid: “✓ Mark paid”, delete_btn: “Delete”,
orders_count: (n) => `${n} order${n !== 1 ? "s" : ""}`, panel_admin: “Admin Panel”,
detail: “Card detail”, select_detail: “Select a card”, in_cart: “✓ In cart”,
also_like: “You may also like”,
footer_rights: “© 2025 WBC Cards F1 · All rights reserved”,
legal_aviso: “Legal Notice”, legal_privacidad: “Privacy”, legal_cookies: “Cookies”,
legal_envios: “Shipping”, legal_devoluciones: “Returns”,
legal_tab: “Legal Texts”, orders_tab: “Orders”, save: “Save”, saved: “✓ Saved”,
collections: “Collections”,
email_subject: (n) => `New F1 order - ${n}`,
email_body: (o, prods, total) => `New order\n\nClient: ${o.nombre}\nEmail: ${o.email}\nPhone: ${o.tel || "Not provided"}\nAddress: ${o.address}\n\nCards:\n${prods}\nTotal: €${total}\n\nID: ${o.id}`,
}
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
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
const F1Icon = ({ size = 24, color = RED }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
<path d="M2 12c0 0 3-5 10-5s10 5 10 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
<circle cx="7" cy="15" r="2" fill={color} />
<circle cx="17" cy="15" r="2" fill={color} />
<path d="M5 13h14" stroke={color} strokeWidth="1.5" />
</svg>
);

// ── LOGO COMPONENT ─────────────────────────────────────────────────────────────
const Logo = ({ size = 48 }) => (
<img src={LOGO_URI} alt=“WBC Cards F1” style={{ width: size, height: size, objectFit: “contain” }} />
);

// ── WAVE FOOTER ───────────────────────────────────────────────────────────────
const WaveFooter = ({ t, onLegal }) => (

  <div style={{ marginTop: 40 }}>
    <svg viewBox="0 0 1440 80" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
      <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#1a1200" />
      <path d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,80 L0,80 Z" fill="#0a0a0a" opacity="0.6" />
    </svg>
    <div style={{ background: BLACK, padding: "24px 20px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        <Logo size={40} />
        <div>
          <div style={{ color: GOLD, fontSize: 14, fontWeight: 900, letterSpacing: 2 }}>WBC CARDS F1</div>
          <div style={{ color: "#555", fontSize: 9, letterSpacing: 1 }}>TOPPS CHROME · TURBO ATTAX</div>
        </div>
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
            style={{ background: "none", border: "none", color: "#555", fontSize: 11, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
            {item.label}
          </button>
        ))}
      </div>
      <p style={{ color: "#333", fontSize: 10, textAlign: "center" }}>{t.footer_rights}</p>
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
const [colFilter, setColFilter] = useState(“all”);
const [cart, setCart] = useState([]);
const [orderOpen, setOrderOpen] = useState(false);
const [orderData, setOrderData] = useState({ nombre: “”, email: “”, tel: “”, address: “” });
const [orderError, setOrderError] = useState(””);
const [successMsg, setSuccessMsg] = useState(””);
const [adminPass, setAdminPass] = useState(””);
const [adminAuth, setAdminAuth] = useState(false);
const [adminError, setAdminError] = useState(””);
const [adminTab, setAdminTab] = useState(“orders”);
const [activeLegal, setActiveLegal] = useState(“aviso”);
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
const matchCol = colFilter === “all” || (p.Serie || “”).toLowerCase() === colFilter.toLowerCase();
return matchSearch && matchCol;
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

// ── LEGAL MODAL ──────────────────────────────────────────────────────────────
const LegalModal = () => {
if (!legalPage) return null;
const titles = { aviso: t.legal_aviso, privacidad: t.legal_privacidad, cookies: t.legal_cookies, envios: t.legal_envios, devoluciones: t.legal_devoluciones };
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.95)”, zIndex: 300, overflow: “auto” }}>
<div style={{ maxWidth: 680, margin: “0 auto”, background: DARK, minHeight: “100vh”, paddingBottom: 60 }}>
<div style={{ background: BLACK, padding: “16px 20px”, display: “flex”, alignItems: “center”, gap: 12, borderBottom: “1px solid #222”, position: “sticky”, top: 0 }}>
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
<div style={{ width: 240, background: BLACK, minHeight: “100vh”, display: “flex”, flexDirection: “column”, flexShrink: 0, position: “sticky”, top: 0, borderRight: “1px solid #1e1e1e” }}>
<div style={{ padding: “20px 16px”, borderBottom: “1px solid #1e1e1e”, display: “flex”, alignItems: “center”, gap: 12 }}>
<Logo size={52} />
<div>
<div style={{ color: GOLD, fontSize: 13, fontWeight: 900, letterSpacing: 1 }}>WBC CARDS F1</div>
<div style={{ color: “#444”, fontSize: 9, letterSpacing: 1 }}>TOPPS CHROME · TURBO ATTAX</div>
</div>
</div>
<nav style={{ padding: “12px 10px”, flex: 1, overflow: “auto” }}>
{[
{ id: “catalog”, icon: <F1Icon size={16} color={screen === “catalog” ? RED : “#555”} />, label: t.catalog },
{ id: “cart”, icon: <CartIcon size={16} color={screen === “cart” ? GOLD : “#555”} />, label: t.cart_nav, badge: cartCount },
{ id: “admin”, icon: <UserIcon size={16} color={screen === “admin” ? GOLD : “#555”} />, label: t.admin },
].map(item => (
<div key={item.id} onClick={() => { setScreen(item.id); if (item.id === “admin”) { setAdminAuth(false); setAdminPass(””); } }}
style={{ display: “flex”, alignItems: “center”, gap: 10, padding: “10px 12px”, borderRadius: 8, marginBottom: 4, cursor: “pointer”, background: screen === item.id ? “#1a1a1a” : “transparent”, borderLeft: screen === item.id ? `2px solid ${RED}` : “2px solid transparent” }}>
{item.icon}
<span style={{ color: screen === item.id ? “#fff” : “#555”, fontSize: 13, fontWeight: screen === item.id ? 700 : 400 }}>{item.label}</span>
{item.badge > 0 && <span style={{ marginLeft: “auto”, background: GOLD, color: BLACK, borderRadius: 10, fontSize: 10, fontWeight: 800, padding: “1px 7px” }}>{item.badge}</span>}
</div>
))}

```
    {/* Colecciones */}
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #1e1e1e" }}>
      <div style={{ color: "#444", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", marginBottom: 6 }}>{t.collections}</div>
      {F1_COLLECTIONS.map(col => (
        <div key={col.key} onClick={() => setColFilter(col.key)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 6, marginBottom: 2, cursor: "pointer", background: colFilter === col.key ? "#1a1a1a" : "transparent" }}>
          <span style={{ fontSize: 12 }}>{col.emoji}</span>
          <span style={{ color: colFilter === col.key ? GOLD : "#555", fontSize: 11, fontWeight: colFilter === col.key ? 700 : 400 }}>{col.label}</span>
        </div>
      ))}
    </div>
  </nav>
  <div style={{ padding: "10px 14px", borderTop: "1px solid #1e1e1e" }}>
    {[{ key: "envios", label: t.legal_envios }, { key: "devoluciones", label: t.legal_devoluciones }, { key: "privacidad", label: t.legal_privacidad }].map(item => (
      <button key={item.key} onClick={() => setLegalPage(item.key)} style={{ display: "block", background: "none", border: "none", color: "#333", fontSize: 9, cursor: "pointer", fontFamily: "inherit", marginBottom: 3, textAlign: "left", padding: 0 }}>{item.label}</button>
    ))}
    <div style={{ color: "#222", fontSize: 8, marginTop: 6 }}>© 2025 WBC Cards F1</div>
  </div>
</div>
```

);

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
const ProductCard = ({ p }) => {
const stock = getStock(p);
const inC = inCart(p._id);
const rarityColor = RARITY_COLORS[p.Rareza] || GOLD;
const isChrome = (p.Serie || “”).toLowerCase().includes(“chrome”);
return (
<div onClick={() => setSelected(p)} style={{ background: CARD_BG, borderRadius: 12, overflow: “hidden”, border: `1px solid ${inC ? GOLD : "#222"}`, cursor: “pointer”, display: “flex”, flexDirection: “column” }}>
<div style={{ height: 200, background: “#0d0d0d”, overflow: “hidden”, position: “relative”, flexShrink: 0 }}>
{p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} style={{ width: “100%”, height: “100%”, objectFit: “contain”, padding: 8 }} onError={e => e.target.style.display = “none”} /> : (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, height: “100%”, gap: 8 }}>
<F1Icon size={40} color="#333" />
<span style={{ color: “#333”, fontSize: 9, textTransform: “uppercase”, letterSpacing: 1 }}>{isChrome ? “Topps Chrome” : “Turbo Attax”}</span>
</div>
)}
{p.Rareza && <div style={{ position: “absolute”, top: 8, right: 8, background: “rgba(0,0,0,0.85)”, border: `1px solid ${rarityColor}`, borderRadius: 4, padding: “2px 7px”, fontSize: 9, color: rarityColor, fontWeight: 700, textTransform: “uppercase” }}>{p.Rareza}</div>}
{p.Serie && <div style={{ position: “absolute”, bottom: 8, left: 8, background: isChrome ? “rgba(220,38,38,0.85)” : “rgba(201,168,76,0.85)”, borderRadius: 4, padding: “2px 7px”, fontSize: 8, color: “#fff”, fontWeight: 700, textTransform: “uppercase” }}>{p.Serie}</div>}
{stock === 0 && <div style={{ position: “absolute”, inset: 0, background: “rgba(0,0,0,0.7)”, display: “flex”, alignItems: “center”, justifyContent: “center” }}><span style={{ color: “#666”, fontSize: 12, fontWeight: 700, textTransform: “uppercase” }}>{t.out_stock}</span></div>}
</div>
<div style={{ padding: “12px 14px”, flex: 1, display: “flex”, flexDirection: “column”, gap: 4 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: “#eee”, lineHeight: 1.3 }}>{p.Nombre}</div>
{p.Serie && <div style={{ fontSize: 10, color: “#555” }}>{p.Serie}</div>}
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginTop: “auto”, paddingTop: 8 }}>
<div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>{parseFloat(p.Precio || 0).toFixed(2)}€</div>
<button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
style={{ background: inC ? “#16a34a” : stock === 0 ? “#222” : RED, color: “#fff”, border: “none”, borderRadius: 6, padding: “6px 12px”, fontSize: 11, fontWeight: 800, cursor: stock === 0 ? “default” : “pointer”, textTransform: “uppercase” }}>
{inC ? t.added : stock === 0 ? t.out_stock : t.add_cart}
</button>
</div>
</div>
</div>
);
};

// ── DETAIL PANEL ─────────────────────────────────────────────────────────────
const DetailPanel = () => (
<div style={{ width: 300, background: DARK, borderLeft: “1px solid #222”, overflow: “auto”, flexShrink: 0 }}>
{!selected ? (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, height: “100%”, color: “#333”, padding: 32, textAlign: “center” }}>
<F1Icon size={48} color="#333" /><p style={{ marginTop: 16, fontSize: 13 }}>{t.select_detail}</p>
</div>
) : (
<div style={{ padding: 20 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 16 }}>
<span style={{ color: RED, fontSize: 11, fontWeight: 700, textTransform: “uppercase”, letterSpacing: 1 }}>{t.detail}</span>
<button onClick={() => setSelected(null)} style={{ background: “none”, border: “none”, color: “#555”, fontSize: 18, cursor: “pointer” }}>×</button>
</div>
{selected.Imagen_URL && <div style={{ height: 220, background: “#0d0d0d”, borderRadius: 10, overflow: “hidden”, marginBottom: 16, display: “flex”, alignItems: “center”, justifyContent: “center” }}><img src={selected.Imagen_URL} alt={selected.Nombre} style={{ maxHeight: “100%”, maxWidth: “100%”, objectFit: “contain” }} /></div>}
<h2 style={{ fontSize: 16, fontWeight: 800, color: “#fff”, marginBottom: 4 }}>{selected.Nombre}</h2>
{selected.Rareza && <div style={{ display: “inline-block”, border: `1px solid ${GOLD}`, borderRadius: 4, padding: “2px 8px”, fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 12, textTransform: “uppercase” }}>{selected.Rareza}</div>}
<div style={{ borderTop: “1px solid #222”, paddingTop: 12 }}>
{[[“Precio”, `${parseFloat(selected.Precio || 0).toFixed(2)}€`], [t.series, selected.Serie], [“Categoría”, selected.Categoria], [t.stock_label, selected.Stock]].filter(r => r[1]).map(([label, value]) => (
<div key={label} style={{ display: “flex”, justifyContent: “space-between”, padding: “9px 0”, borderBottom: “1px solid #1e1e1e”, fontSize: 13 }}>
<span style={{ color: “#555” }}>{label}</span><span style={{ fontWeight: 600, color: “#ddd” }}>{value}</span>
</div>
))}
</div>
<button onClick={e => { if (getStock(selected) > 0) addToCart(selected._id, e); }}
style={{ width: “100%”, marginTop: 16, background: inCart(selected._id) ? “#16a34a” : getStock(selected) === 0 ? “#222” : RED, color: “#fff”, border: “none”, borderRadius: 8, padding: “13px”, fontSize: 13, fontWeight: 800, cursor: getStock(selected) === 0 ? “default” : “pointer”, textTransform: “uppercase” }}>
{inCart(selected._id) ? t.in_cart : getStock(selected) === 0 ? t.out_stock : t.add_cart}
</button>
</div>
)}
</div>
);

// ── CATALOG CONTENT ───────────────────────────────────────────────────────────
const CatalogContent = () => (
<div style={{ flex: 1, overflow: “auto”, background: DARK }}>
<div style={{ padding: “16px 20px”, background: BLACK, borderBottom: “1px solid #1e1e1e”, position: “sticky”, top: 0, zIndex: 10 }}>
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
{filteredProducts.length === 0 && <div style={{ gridColumn: “1/-1”, textAlign: “center”, padding: 60, color: “#444” }}><F1Icon size={48} color="#333" /><p style={{ marginTop: 12, fontSize: 14 }}>{t.no_products}</p></div>}
</div>
<WaveFooter t={t} onLegal={setLegalPage} />
</>
)}
</div>
);

// ── CART CONTENT ──────────────────────────────────────────────────────────────
const CartContent = () => (
<div style={{ flex: 1, overflow: “auto”, background: DARK, padding: 20 }}>
<h2 style={{ fontSize: 18, fontWeight: 800, color: GOLD, marginBottom: 16, letterSpacing: 1, textTransform: “uppercase” }}>{t.cart_title}</h2>
{cartItems.length === 0 ? (
<div style={{ textAlign: “center”, padding: 60, color: “#444” }}>
<CartIcon size={48} color="#333" />
<p style={{ marginTop: 16, fontSize: 14, marginBottom: 20 }}>{t.cart_empty_msg}</p>
<button onClick={() => setScreen(“catalog”)} style={{ background: RED, color: “#fff”, border: “none”, borderRadius: 8, padding: “11px 24px”, fontSize: 13, fontWeight: 800, cursor: “pointer”, textTransform: “uppercase” }}>{t.see_catalog}</button>
</div>
) : (
<>
<div style={{ background: CARD_BG, borderRadius: 12, overflow: “hidden”, marginBottom: 16, border: “1px solid #222” }}>
{cartItems.map((c, i) => (
<div key={c.id} style={{ display: “flex”, alignItems: “center”, gap: 12, padding: “14px 16px”, borderBottom: i < cartItems.length - 1 ? “1px solid #1e1e1e” : “none” }}>
{c.product.Imagen_URL ? <img src={c.product.Imagen_URL} alt={c.product.Nombre} style={{ width: 44, height: 44, objectFit: “contain”, borderRadius: 6, background: “#111”, flexShrink: 0 }} /> : <div style={{ width: 44, height: 44, background: “#111”, borderRadius: 6, display: “flex”, alignItems: “center”, justifyContent: “center”, flexShrink: 0 }}><F1Icon size={22} color="#333" /></div>}
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
<button onClick={() => setOrderOpen(true)} style={{ width: “100%”, background: RED, color: “#fff”, border: “none”, borderRadius: 10, padding: “15px”, fontSize: 15, fontWeight: 800, cursor: “pointer”, textTransform: “uppercase”, letterSpacing: 1 }}>{t.checkout}</button>
</>
)}
</div>
);

// ── ADMIN CONTENT ─────────────────────────────────────────────────────────────
const AdminContent = () => {
const legalKeys = [
{ key: “aviso”, label: t.legal_aviso }, { key: “privacidad”, label: t.legal_privacidad },
{ key: “cookies”, label: t.legal_cookies }, { key: “envios”, label: t.legal_envios },
{ key: “devoluciones”, label: t.legal_devoluciones },
];
return (
<div style={{ flex: 1, overflow: “auto”, background: DARK, padding: 20 }}>
<h2 style={{ fontSize: 18, fontWeight: 800, color: GOLD, marginBottom: 16, letterSpacing: 1, textTransform: “uppercase” }}>{t.panel_admin}</h2>
{!adminAuth ? (
<div style={{ maxWidth: 380, background: CARD_BG, borderRadius: 14, padding: 28, border: “1px solid #222” }}>
<div style={{ display: “flex”, justifyContent: “center”, marginBottom: 20 }}>
<Logo size={80} />
</div>
<h3 style={{ fontSize: 16, fontWeight: 800, color: “#ddd”, textAlign: “center”, marginBottom: 6 }}>{t.access_admin}</h3>
<p style={{ fontSize: 12, color: “#555”, textAlign: “center”, marginBottom: 20 }}>{t.internal}</p>
<input style={{ …inp, marginBottom: 10 }} type=“password” placeholder={t.password} value={adminPass} onChange={e => setAdminPass(e.target.value)}
onKeyDown={e => { if (e.key === “Enter”) { adminPass === ADMIN_PASSWORD ? (setAdminAuth(true), setAdminError(””)) : setAdminError(t.wrong_pass); }}} />
{adminError && <p style={{ color: “#f87171”, fontSize: 12, marginBottom: 10 }}>{adminError}</p>}
<button style={{ width: “100%”, background: RED, color: “#fff”, border: “none”, borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 800, cursor: “pointer”, fontFamily: “inherit”, textTransform: “uppercase” }}
onClick={() => { adminPass === ADMIN_PASSWORD ? (setAdminAuth(true), setAdminError(””)) : setAdminError(t.wrong_pass); }}>{t.enter}</button>
</div>
) : (
<>
<div style={{ display: “flex”, gap: 8, marginBottom: 20 }}>
{[{ id: “orders”, label: t.orders_tab }, { id: “legal”, label: t.legal_tab }].map(tab => (
<button key={tab.id} onClick={() => setAdminTab(tab.id)}
style={{ background: adminTab === tab.id ? RED : “#222”, color: “#fff”, border: “none”, borderRadius: 8, padding: “9px 18px”, fontSize: 12, fontWeight: 800, cursor: “pointer”, textTransform: “uppercase” }}>
{tab.label}
</button>
))}
</div>
{adminTab === “orders” && (
<>
<p style={{ fontSize: 12, color: “#555”, marginBottom: 16 }}>{t.orders_count(orders.length)}</p>
{orders.length === 0 ? <div style={{ textAlign: “center”, padding: 48, color: “#444”, background: CARD_BG, borderRadius: 12 }}>{t.no_orders}</div> : (
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fill, minmax(320px, 1fr))”, gap: 12 }}>
{orders.map(order => {
const orderProds = order.items.map(c => { const p = products.find(x => x._id === c.id); return p ? `${p.Nombre} x${c.qty}` : “”; }).filter(Boolean);
const statusColor = order.status === “paid” ? “#4ade80” : order.status === “sent” ? “#60a5fa” : RED;
const statusLabel = order.status === “paid” ? t.paid : order.status === “sent” ? t.sent : t.pending;
return (
<div key={order.id} style={{ background: CARD_BG, borderRadius: 12, padding: 16, border: “1px solid #222” }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 6 }}>
<span style={{ fontWeight: 800, fontSize: 14, color: “#ddd” }}>{order.nombre}</span>
<span style={{ fontSize: 10, fontWeight: 700, padding: “3px 8px”, borderRadius: 20, background: “rgba(0,0,0,0.5)”, border: `1px solid ${statusColor}`, color: statusColor }}>{statusLabel}</span>
</div>
<p style={{ fontSize: 12, color: “#555” }}>{order.email}</p>
{order.tel && <p style={{ fontSize: 12, color: “#555” }}>📞 {order.tel}</p>}
<p style={{ fontSize: 12, color: “#555” }}>📍 {order.address}</p>
<div style={{ background: “#111”, borderRadius: 8, padding: “8px 10px”, margin: “10px 0” }}>
{orderProds.map((p, i) => <div key={i} style={{ fontSize: 11, color: “#666”, marginBottom: 2 }}>• {p}</div>)}
<div style={{ fontSize: 13, fontWeight: 800, color: GOLD, marginTop: 6 }}>{order.total}€</div>
</div>
<div style={{ display: “flex”, gap: 6 }}>
{order.status === “pending” && <button onClick={() => updateStatus(order.id, “sent”)} style={{ flex: 2, background: “#1e3a5f”, color: “#60a5fa”, border: “1px solid #2563eb”, borderRadius: 6, padding: 8, fontSize: 11, fontWeight: 700, cursor: “pointer” }}>{t.mark_sent}</button>}
{order.status === “sent” && <button onClick={() => updateStatus(order.id, “paid”)} style={{ flex: 2, background: “#14532d”, color: “#4ade80”, border: “1px solid #16a34a”, borderRadius: 6, padding: 8, fontSize: 11, fontWeight: 700, cursor: “pointer” }}>{t.mark_paid}</button>}
<button onClick={() => deleteOrder(order.id)} style={{ flex: 1, background: “#1e0000”, color: “#f87171”, border: “1px solid #7f1d1d”, borderRadius: 6, padding: 8, fontSize: 11, fontWeight: 700, cursor: “pointer” }}>{t.delete_btn}</button>
</div>
</div>
);
})}
</div>
)}
</>
)}
{adminTab === “legal” && (
<div>
<div style={{ display: “flex”, gap: 6, marginBottom: 16, flexWrap: “wrap” }}>
{legalKeys.map(lk => (
<button key={lk.key} onClick={() => setActiveLegal(lk.key)}
style={{ background: activeLegal === lk.key ? RED : “#222”, color: “#fff”, border: “none”, borderRadius: 6, padding: “6px 12px”, fontSize: 11, fontWeight: 700, cursor: “pointer” }}>
{lk.label}
</button>
))}
</div>
<textarea style={{ …inp, minHeight: 320, resize: “vertical”, lineHeight: 1.6, fontSize: 12 }}
value={editingLegal[activeLegal] !== undefined ? editingLegal[activeLegal] : legal[activeLegal]}
onChange={e => setEditingLegal(prev => ({ …prev, [activeLegal]: e.target.value }))} />
<button onClick={saveLegalTexts}
style={{ marginTop: 12, background: legalSaved ? “#16a34a” : RED, color: “#fff”, border: “none”, borderRadius: 8, padding: “12px 24px”, fontSize: 13, fontWeight: 800, cursor: “pointer”, textTransform: “uppercase” }}>
{legalSaved ? t.saved : t.save}
</button>
</div>
)}
</>
)}
</div>
);
};

// ── RENDER ────────────────────────────────────────────────────────────────────
return (
<div style={{ fontFamily: “‘Segoe UI’, -apple-system, sans-serif”, minHeight: “100vh”, background: DARK, color: LIGHT }}>
<style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder, textarea::placeholder { color: #444; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; } .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: flex-end; justify-content: center; } .modal-sheet { background: #141414; border-radius: 20px 20px 0 0; padding: 0 20px 44px; width: 100%; max-width: 560px; max-height: 93vh; overflow-y: auto; border-top: 1px solid #222; } .handle { width: 40px; height: 3px; background: #333; border-radius: 2px; margin: 12px auto 20px; } .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #0a0a0a; border-top: 1px solid #1e1e1e; display: flex; padding-bottom: env(safe-area-inset-bottom, 16px); padding-top: 10px; z-index: 100; } .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px; } .nav-label { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; } .cart-bar { position: fixed; bottom: 80px; left: 0; right: 0; background: ${RED}; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 90; }`}</style>

```
  <LegalModal />

  {/* SPLASH */}
  {screen === "splash" && (
    <div style={{ minHeight: "100vh", background: BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ marginBottom: 24 }}><Logo size={140} /></div>
      <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${RED}, ${GOLD})`, marginBottom: 16 }} />
      <p style={{ color: "#555", fontSize: 13, marginBottom: 56, textAlign: "center", letterSpacing: 1 }}>{t.splash_sub}</p>
      <button onClick={() => setScreen("catalog")} style={{ background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "16px 40px", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2, textTransform: "uppercase" }}>{t.splash_btn}</button>
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
      <div style={{ background: BLACK, paddingTop: "env(safe-area-inset-top, 44px)", paddingBottom: 10, paddingLeft: 16, paddingRight: 16, borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={40} />
            <div>
              <div style={{ color: GOLD, fontSize: 13, fontWeight: 900, letterSpacing: 1 }}>WBC CARDS F1</div>
              <div style={{ color: "#444", fontSize: 8, letterSpacing: 1 }}>TOPPS CHROME · TURBO ATTAX</div>
            </div>
          </div>
          {cartCount > 0 && (
            <div onClick={() => setScreen("cart")} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <CartIcon size={22} /><span style={{ background: RED, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 800, padding: "2px 7px" }}>{cartCount}</span>
            </div>
          )}
        </div>
      </div>

      {screen === "catalog" && (
        <>
          <div style={{ padding: "10px 16px", background: BLACK, borderBottom: "1px solid #1e1e1e" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#444" }}>🔍</span>
              <input style={{ ...inp, paddingLeft: 36, background: "#0f0f0f" }} placeholder={t.search_ph} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {/* Colecciones scroll horizontal */}
          <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: BLACK, borderBottom: "1px solid #1e1e1e" }}>
            {F1_COLLECTIONS.map(col => (
              <button key={col.key} onClick={() => setColFilter(col.key)}
                style={{ flexShrink: 0, background: colFilter === col.key ? (col.emoji === "⚡" ? GOLD : RED) : "#1a1a1a", color: colFilter === col.key ? "#fff" : "#555", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 10, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.3 }}>
                {col.emoji} {col.label}
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
                  const isChrome = (p.Serie || "").toLowerCase().includes("chrome");
                  return (
                    <div key={p._id} onClick={() => setSelected(p)} style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden", border: `1px solid ${inC ? GOLD : "#222"}`, cursor: "pointer", display: "flex", flexDirection: "column" }}>
                      <div style={{ background: "#0d0d0d", position: "relative", paddingTop: "110%", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} onError={e => e.target.style.display = "none"} /> : <F1Icon size={36} color="#333" />}
                        </div>
                        {p.Rareza && <div style={{ position: "absolute", top: 5, left: 5, background: "rgba(0,0,0,0.85)", border: `1px solid ${RARITY_COLORS[p.Rareza] || GOLD}`, borderRadius: 3, padding: "1px 5px", fontSize: 7, color: RARITY_COLORS[p.Rareza] || GOLD, fontWeight: 700, textTransform: "uppercase" }}>{p.Rareza}</div>}
                        {p.Serie && <div style={{ position: "absolute", bottom: 5, left: 5, background: isChrome ? "rgba(220,38,38,0.85)" : "rgba(201,168,76,0.85)", borderRadius: 3, padding: "1px 5px", fontSize: 7, color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>{p.Serie}</div>}
                        {stock === 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#666", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>{t.out_stock}</span></div>}
                      </div>
                      <div style={{ padding: "9px 10px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#eee", lineHeight: 1.3, marginBottom: 6, minHeight: 28 }}>{p.Nombre}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: GOLD }}>{parseFloat(p.Precio || 0).toFixed(2)}€</div>
                          <button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
                            style={{ background: inC ? "#16a34a" : stock === 0 ? "#222" : RED, color: "#fff", border: "none", borderRadius: 6, width: 30, height: 30, fontSize: 16, fontWeight: 800, cursor: stock === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {inC ? "✓" : stock === 0 ? "−" : "+"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#444" }}><F1Icon size={48} color="#333" /><p style={{ marginTop: 12, fontSize: 14 }}>{t.no_products}</p></div>}
              </div>
              <WaveFooter t={t} onLegal={setLegalPage} />
            </>
          )}

          {cartCount > 0 && (
            <div className="cart-bar">
              <div>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{cartCount} carta{cartCount > 1 ? "s" : ""} · {cartTotal}€</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, textTransform: "uppercase" }}>{t.cart_nav}</p>
              </div>
              <button onClick={() => setScreen("cart")} style={{ background: BLACK, color: RED, border: `1px solid ${RED}`, borderRadius: 6, padding: "9px 18px", fontWeight: 800, fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>{t.checkout}</button>
            </div>
          )}

          {selected && (
            <div style={{ position: "fixed", inset: 0, background: DARK, zIndex: 150, overflow: "auto", paddingBottom: 80 }}>
              <div style={{ background: BLACK, paddingTop: "env(safe-area-inset-top, 44px)", paddingLeft: 16, paddingRight: 16, paddingBottom: 12, borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 6 }}>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: RED, fontSize: 26, cursor: "pointer" }}>‹</button>
                  <span style={{ color: RED, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{t.detail}</span>
                </div>
              </div>
              {selected.Imagen_URL && (
                <div style={{ width: "100%", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <img src={selected.Imagen_URL} alt={selected.Nombre} style={{ maxWidth: "85%", maxHeight: 420, objectFit: "contain", borderRadius: 8 }} />
                </div>
              )}
              <div style={{ padding: "20px 16px" }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{selected.Nombre}</h1>
                {selected.Rareza && <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{selected.Rareza}</div>}
                {selected.Serie && <div style={{ display: "inline-block", marginLeft: 6, border: `1px solid ${RED}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: RED, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{selected.Serie}</div>}
                <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, marginBottom: 16 }}>{parseFloat(selected.Precio || 0).toFixed(2)}€</div>
                <button style={{ width: "100%", background: inCart(selected._id) ? "#16a34a" : getStock(selected) === 0 ? "#222" : RED, color: "#fff", border: "none", borderRadius: 10, padding: "15px", fontSize: 15, fontWeight: 800, cursor: getStock(selected) === 0 ? "default" : "pointer", marginBottom: 20, textTransform: "uppercase" }}
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
                            <div style={{ background: "#0d0d0d", paddingTop: "100%", position: "relative" }}>
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} /> : <F1Icon size={28} color="#333" />}
                              </div>
                            </div>
                            <div style={{ padding: "8px 10px" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#ddd", lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.Nombre}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 13, fontWeight: 900, color: GOLD }}>{parseFloat(p.Precio || 0).toFixed(2)}€</span>
                                <button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
                                  style={{ background: inC ? "#16a34a" : stock === 0 ? "#222" : RED, color: "#fff", border: "none", borderRadius: 5, width: 26, height: 26, fontSize: 14, fontWeight: 800, cursor: stock === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        <F1Icon size={22} color={screen === "catalog" ? RED : "#444"} />
        <span className="nav-label" style={{ color: screen === "catalog" ? RED : "#444" }}>{t.catalog}</span>
      </div>
      <div className="nav-item" onClick={() => setScreen("cart")}>
        <div style={{ position: "relative" }}>
          <CartIcon size={22} color={screen === "cart" ? GOLD : "#444"} />
          {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -8, background: RED, color: "#fff", borderRadius: 10, fontSize: 8, fontWeight: 800, padding: "1px 5px" }}>{cartCount}</span>}
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
        <h2 style={{ fontSize: 18, fontWeight: 800, color: RED, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.order_title}</h2>
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
        <button style={{ width: "100%", background: RED, color: "#fff", border: "none", borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }} onClick={doOrder}>{t.confirm}</button>
        <button style={{ width: "100%", background: "none", color: "#555", border: "1px solid #222", borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setOrderOpen(false)}>{t.cancel}</button>
      </div>
    </div>
  )}
</div>
```

);
}
