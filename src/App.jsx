  import { useState, useEffect, useRef } from "react";

const SHEET_URL = "https://opensheet.elk.sh/18pEEgSp4mZ0x6vdd5N8gNuwcJTh_cZXV7kSSQwDT-gg/wbccards";
const ADMIN_EMAIL = "javier@wbccards.com";
const ADMIN_PASSWORD = "admin2026";
const LOGO_URI = "/Logo-f1.png";
const C = { black:"#080808", dark:"#0f0f0f", card:"#141414", border:"#1e1e1e", gold:"#c9a84c", red:"#cc0000", white:"#f5f5f5", gray:"#666" };
const DRIVERS = ["Verstappen","Hamilton","Leclerc","Alonso","Senna","Schumacher","Piastri","Norris","Russell","Sainz"];
const SETS = ["Topps Chrome F1","Topps Sapphire F1","Topps Dynasty","Turbo Attax"];
const RARITY_COLOR = { "1/1":"#ff0000","Auto":"#c9a84c","Patch":"#a78bfa","Relic":"#a78bfa","Ultra Rare":"#60a5fa","SSP":"#f59e0b","Rare":"#60a5fa","Common":"#666","Base":"#666" };
const DEFAULT_LEGAL = {
  aviso:`AVISO LEGAL\n\nTitular: WBC Cards F1\nEmail: javier@wbccards.com\n\nEn cumplimiento de la Ley 34/2002 LSSI, este sitio es propiedad de WBC Cards F1.`,
  privacidad:`POLÍTICA DE PRIVACIDAD\n\nRESPONSABLE: WBC Cards F1\nFINALIDAD: Gestión de pedidos\nDERECHOS: javier@wbccards.com`,
  cookies:`POLÍTICA DE COOKIES\n\nUsamos cookies técnicas para el funcionamiento del sitio.`,
  envios:`POLÍTICA DE ENVÍOS\n\nEspaña: 2-5 días laborables\nEuropa: 5-10 días laborables\nEnvíos con seguimiento y toploader.`,
  devoluciones:`POLÍTICA DE DEVOLUCIONES\n\n14 días naturales desde recepción.\nContacto: javier@wbccards.com`
};
const getLegal = () => { try { return JSON.parse(localStorage.getItem("wbc_legal")||"null")||DEFAULT_LEGAL; } catch { return DEFAULT_LEGAL; } };
const saveLegal = d => { try { localStorage.setItem("wbc_legal",JSON.stringify(d)); } catch {} };
const getOrders = () => { try { return JSON.parse(localStorage.getItem("wbc_orders")||"[]"); } catch { return []; } };
const saveOrders = d => { try { localStorage.setItem("wbc_orders",JSON.stringify(d)); } catch {} };

const Icon = {
  search:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  cart:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  user:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>,
  menu:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  back:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  zoom:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  ext:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  ig:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState({ set:"", piloto:"", numerada:false, auto:false, relic:false });
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderData, setOrderData] = useState({ nombre:"", email:"", tel:"", address:"" });
  const [orderError, setOrderError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminTab, setAdminTab] = useState("orders");
  const [activeLegal, setActiveLegal] = useState("aviso");
  const [legalPage, setLegalPage] = useState(null);
  const [legal, setLegal] = useState(getLegal());
  const [editingLegal, setEditingLegal] = useState({});
  const [legalSaved, setLegalSaved] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const searchRef = useRef(null);

  useEffect(() => { const r = () => setIsMobile(window.innerWidth < 1024); window.addEventListener("resize", r); return () => window.removeEventListener("resize", r); }, []);
  useEffect(() => {
    fetch(SHEET_URL).then(r => r.json()).then(data => { setProducts(data.map((row, i) => ({ _id: i + 1, ...row }))); setLoading(false); }).catch(() => setLoading(false));
    setOrders(getOrders());
  }, []);

  const cartItems = cart.map(c => ({ ...c, product: products.find(p => p._id === c.id) })).filter(c => c.product);
  const cartTotal = cartItems.reduce((s, c) => s + parseFloat(c.product.Precio || 0) * c.qty, 0).toFixed(2);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const inCart = id => cart.some(c => c.id === id);
  const getStock = p => parseInt(p?.Stock || 0);
  const addToCart = (id, e) => { e?.stopPropagation(); setCart(prev => { const ex = prev.find(c => c.id === id); return ex ? prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { id, qty: 1 }]; }); };
  const removeFromCart = id => setCart(prev => prev.filter(c => c.id !== id));
  const changeQty = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c));

  const filtered = products.filter(p => {
    if (filters.set && (p.Serie || "") !== filters.set) return false;
    if (filters.piloto && !(p.Piloto || "").toLowerCase().includes(filters.piloto.toLowerCase())) return false;
    if (filters.numerada && !p.Numeracion) return false;
    if (filters.auto && p.Auto !== "TRUE") return false;
    if (filters.relic && p.Relic !== "TRUE") return false;
    if (search) { const q = search.toLowerCase(); return ["Nombre","Piloto","Equipo","Año","Numeracion","Serie","Paralela","Grading","Nota_Grading"].some(k => (p[k]||"").toLowerCase().includes(q)); }
    return true;
  });

  const featured = products.filter(p => p.Destacada === "TRUE" || p.Destacada === "SI");
  const newArrivals = products.filter(p => p.Nueva_Llegada === "TRUE" || p.Nueva_Llegada === "SI" || p.Activa === "TRUE").slice(0, 8);
  const rareCards = products.filter(p => p.Auto === "TRUE" || p.Relic === "TRUE" || (p.Numeracion && ["1/1","/5","/10"].includes(p.Numeracion))).slice(0, 8);

  const doOrder = () => {
    if (!orderData.nombre.trim() || !orderData.email.trim() || !orderData.address.trim()) { setOrderError("Rellena nombre, email y dirección."); return; }
    if (!/\S+@\S+\.\S+/.test(orderData.email)) { setOrderError("Email no válido."); return; }
    const prods = cartItems.map(c => `- ${c.product.Nombre} x${c.qty} · ${(parseFloat(c.product.Precio||0)*c.qty).toFixed(2)}€`).join("\n");
    const newOrder = { id: Date.now(), ...orderData, items: [...cart], total: cartTotal, createdAt: Date.now(), status: "pending" };
    const updated = [...orders, newOrder]; setOrders(updated); saveOrders(updated);
    window.open(`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(`Pedido WBC Cards - ${orderData.nombre}`)}&body=${encodeURIComponent(`Cliente: ${orderData.nombre}\nEmail: ${orderData.email}\nTel: ${orderData.tel||"N/A"}\nDir: ${orderData.address}\n\n${prods}\n\nTotal: ${cartTotal}€`)}`);
    setOrderOpen(false); setOrderData({ nombre:"", email:"", tel:"", address:"" }); setOrderError(""); setCart([]);
    setSuccessMsg(`✓ Pedido confirmado · ${cartItems.length} carta${cartItems.length>1?"s":""} · ${cartTotal}€`);
    setTimeout(() => setSuccessMsg(""), 8000); setScreen("home");
  };

  const inp = { width:"100%", padding:"12px 14px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:14, outline:"none", background:"#1a1a1a", color:C.white, fontFamily:"inherit" };

  // PRODUCT CARD
  const ProductCard = ({ p, big }) => {
    const stock = getStock(p); const inC = inCart(p._id); const rc = RARITY_COLOR[p.Rareza] || C.gray;
    return (
      <div onClick={() => { setSelected(p); setActiveImg(0); setScreen("product"); window.scrollTo(0,0); }}
        style={{ background:C.card, borderRadius:12, overflow:"hidden", border:`1px solid ${inC?C.gold:C.border}`, cursor:"pointer", display:"flex", flexDirection:"column" }}>
        <div style={{ background:"#0a0a0a", position:"relative", paddingTop:big?"130%":"120%", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }} onError={e=>e.target.style.display="none"} /> : <div style={{ color:"#222", fontSize:32 }}>🏎</div>}
          </div>
          <div style={{ position:"absolute", top:8, left:8, display:"flex", flexDirection:"column", gap:4 }}>
            {p.Auto==="TRUE" && <span style={{ background:"rgba(201,168,76,0.9)", color:C.black, fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:3, textTransform:"uppercase", letterSpacing:1 }}>AUTO</span>}
            {p.Relic==="TRUE" && <span style={{ background:"rgba(167,139,250,0.9)", color:"#fff", fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:3, textTransform:"uppercase", letterSpacing:1 }}>RELIC</span>}
          </div>
          {p.Numeracion && <div style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.85)", border:`1px solid ${rc}`, borderRadius:4, padding:"3px 8px", fontSize:10, color:rc, fontWeight:800 }}>{p.Numeracion}</div>}
          {p.Grading==="TRUE" && p.Empresa_Grading && <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,0.85)", borderRadius:4, padding:"2px 8px", fontSize:9, color:C.gold, fontWeight:800 }}>{p.Empresa_Grading} {p.Nota_Grading}</div>}
          {stock===0 && <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"#555", fontSize:11, fontWeight:800, letterSpacing:2 }}>SOLD</span></div>}
        </div>
        <div style={{ padding:"12px 14px", flex:1, display:"flex", flexDirection:"column", gap:3 }}>
          <div style={{ fontSize:11, color:C.gray, textTransform:"uppercase", letterSpacing:1 }}>{p.Piloto}</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, lineHeight:1.3, minHeight:36 }}>{p.Nombre}</div>
          {p.Paralela && p.Paralela!=="Base" && <div style={{ fontSize:10, color:rc, fontWeight:600 }}>{p.Paralela}</div>}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto", paddingTop:10 }}>
            <div style={{ fontSize:18, fontWeight:900, color:C.gold }}>{parseFloat(p.Precio||0).toFixed(2)}€</div>
            <button onClick={e => { e.stopPropagation(); if(stock>0) addToCart(p._id,e); }}
              style={{ background:inC?"#16a34a":stock===0?"#1a1a1a":C.red, color:"#fff", border:"none", borderRadius:6, padding:"7px 14px", fontSize:11, fontWeight:800, cursor:stock===0?"default":"pointer", textTransform:"uppercase" }}>
              {inC?"✓":stock===0?"—":"Añadir"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // NAVBAR
  const Navbar = () => (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(8,8,8,0.97)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 20px", height:64, display:"flex", alignItems:"center", gap:12 }}>
        <div onClick={() => setScreen("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <img src={LOGO_URI} alt="WBC Cards F1" style={{ width:42, height:42, objectFit:"contain" }} />
          {!isMobile && <div><div style={{ color:C.gold, fontSize:13, fontWeight:900, letterSpacing:2 }}>WBC CARDS F1</div><div style={{ color:"#444", fontSize:9, letterSpacing:2 }}>PREMIUM TRADING CARDS</div></div>}
        </div>
        {!isMobile && (
          <div style={{ display:"flex", gap:2, marginLeft:12 }}>
            {SETS.map(s => <button key={s} onClick={() => { setFilters(f=>({...f,set:f.set===s?"":s})); setScreen("catalog"); }} style={{ background:filters.set===s?C.red:"transparent", color:filters.set===s?"#fff":C.gray, border:"none", borderRadius:6, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap" }}>{s.replace("Topps ","").replace(" F1","")}</button>)}
            <button onClick={() => { setFilters(f=>({...f,auto:!f.auto,relic:false})); setScreen("catalog"); }} style={{ background:filters.auto?C.gold:"transparent", color:filters.auto?C.black:C.gray, border:"none", borderRadius:6, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Autos</button>
            <button onClick={() => { setFilters(f=>({...f,relic:!f.relic,auto:false})); setScreen("catalog"); }} style={{ background:filters.relic?"#a78bfa":"transparent", color:filters.relic?"#fff":C.gray, border:"none", borderRadius:6, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Relics</button>
          </div>
        )}
        <div style={{ flex:1, maxWidth:isMobile?undefined:400, position:"relative" }}>
          {(searchOpen || !isMobile) ? (
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.gray }}>{Icon.search}</span>
              <input ref={searchRef} style={{ ...inp, paddingLeft:40, height:38, fontSize:13, background:"#1a1a1a", borderRadius:20 }} placeholder="Piloto, equipo, año, numeración..." value={search} onChange={e => { setSearch(e.target.value); if(e.target.value) setScreen("catalog"); }} onKeyDown={e => e.key==="Escape"&&(setSearchOpen(false),setSearch(""))} />
              {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.gray, cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>}
            </div>
          ) : (
            <button onClick={() => { setSearchOpen(true); setTimeout(()=>searchRef.current?.focus(),100); }} style={{ background:"none", border:"none", color:C.gray, cursor:"pointer", display:"flex", padding:6 }}>{Icon.search}</button>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          <button onClick={() => setScreen("cart")} style={{ position:"relative", background:"none", border:"none", color:C.gray, cursor:"pointer", display:"flex", padding:6 }}>
            {Icon.cart}
            {cartCount>0 && <span style={{ position:"absolute", top:0, right:0, background:C.red, color:"#fff", borderRadius:10, fontSize:9, fontWeight:800, padding:"1px 5px", minWidth:16, textAlign:"center" }}>{cartCount}</span>}
          </button>
          <button onClick={() => { setScreen("admin"); setAdminAuth(false); setAdminPass(""); }} style={{ background:"none", border:"none", color:C.gray, cursor:"pointer", display:"flex", padding:6 }}>{Icon.user}</button>
          {isMobile && <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background:"none", border:"none", color:C.gray, cursor:"pointer", display:"flex", padding:6 }}>{Icon.menu}</button>}
        </div>
      </div>
      {isMobile && mobileMenu && (
        <div style={{ background:C.dark, borderTop:`1px solid ${C.border}`, padding:"12px 20px" }}>
          {SETS.map(s => <div key={s} onClick={() => { setFilters(f=>({...f,set:s})); setScreen("catalog"); setMobileMenu(false); }} style={{ padding:"10px 0", color:C.gray, fontSize:13, fontWeight:700, cursor:"pointer", borderBottom:`1px solid ${C.border}`, textTransform:"uppercase", letterSpacing:1 }}>{s}</div>)}
          <div onClick={() => { setFilters(f=>({...f,auto:true,relic:false})); setScreen("catalog"); setMobileMenu(false); }} style={{ padding:"10px 0", color:C.gray, fontSize:13, fontWeight:700, cursor:"pointer", borderBottom:`1px solid ${C.border}`, textTransform:"uppercase" }}>Autos</div>
          <div onClick={() => { setFilters(f=>({...f,relic:true,auto:false})); setScreen("catalog"); setMobileMenu(false); }} style={{ padding:"10px 0", color:C.gray, fontSize:13, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Relics</div>
        </div>
      )}
    </nav>
  );

  const TrustBar = () => (
    <div style={{ background:"#0a0a0a", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"18px 0" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 20px", display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:16 }}>
        {[["🛡","Cartas Verificadas","100% auténticas"],["🚚","Envíos Internacionales","Europa y mundo"],["🔒","Pago Seguro","Protección total"],["⭐","+500 Ventas","Clientes satisfechos"]].map(([icon,title,sub]) => (
          <div key={title} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <div><div style={{ color:C.white, fontSize:12, fontWeight:700 }}>{title}</div><div style={{ color:"#555", fontSize:11 }}>{sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SectionHeader = ({ tag, title, tagColor, onMore }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:24 }}>
      <div>
        <div style={{ color:tagColor||C.red, fontSize:10, fontWeight:800, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>{tag}</div>
        <h2 style={{ color:C.white, fontSize:isMobile?22:28, fontWeight:900, margin:0 }}>{title}</h2>
      </div>
      {onMore && <button onClick={onMore} style={{ background:"none", border:`1px solid ${C.border}`, color:C.gray, borderRadius:6, padding:"7px 16px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>Ver todo</button>}
    </div>
  );

  const Grid = ({ items, min=200 }) => (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${isMobile?160:min}px, 1fr))`, gap:14 }}>
      {items.map(p => <ProductCard key={p._id} p={p} />)}
    </div>
  );

  const Footer = () => (
    <footer style={{ background:C.black, borderTop:`1px solid ${C.border}`, marginTop:60 }}>
      <svg viewBox="0 0 1440 50" style={{ display:"block", width:"100%", marginBottom:-1 }} preserveAspectRatio="none">
        <path d="M0,25 C360,50 720,0 1080,25 C1260,38 1380,12 1440,25 L1440,50 L0,50 Z" fill="#0f0f0f"/>
      </svg>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"40px 20px 60px" }}>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr 1fr 1fr", gap:32, marginBottom:40 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <img src={LOGO_URI} alt="WBC" style={{ width:44, height:44 }} />
              <div><div style={{ color:C.gold, fontWeight:900, fontSize:13, letterSpacing:2 }}>WBC CARDS F1</div><div style={{ color:"#444", fontSize:9, letterSpacing:2 }}>PREMIUM TRADING CARDS</div></div>
            </div>
            <p style={{ color:"#555", fontSize:12, lineHeight:1.8, marginBottom:16 }}>Especialistas en cartas F1 premium. Topps Chrome, Sapphire, Dynasty. Autos, Relics y numeradas.</p>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <a href="https://instagram.com/wildbono2011" target="_blank" rel="noreferrer" style={{ color:C.gray, display:"flex" }}>{Icon.ig}</a>
              <a href="https://www.cardmarket.com" target="_blank" rel="noreferrer" style={{ color:C.gray, fontSize:11, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>Cardmarket {Icon.ext}</a>
              <a href="https://www.ebay.es" target="_blank" rel="noreferrer" style={{ color:C.gray, fontSize:11, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>eBay {Icon.ext}</a>
            </div>
          </div>
          <div>
            <div style={{ color:C.white, fontWeight:700, fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Colecciones</div>
            {SETS.map(s => <div key={s} onClick={() => { setFilters(f=>({...f,set:s})); setScreen("catalog"); }} style={{ color:"#555", fontSize:12, marginBottom:8, cursor:"pointer" }}>{s}</div>)}
          </div>
          <div>
            <div style={{ color:C.white, fontWeight:700, fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Legal</div>
            {[["aviso","Aviso Legal"],["privacidad","Privacidad"],["cookies","Cookies"],["envios","Envíos"],["devoluciones","Devoluciones"]].map(([k,l]) => (
              <div key={k} onClick={() => setLegalPage(k)} style={{ color:"#555", fontSize:12, marginBottom:8, cursor:"pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color:C.white, fontWeight:700, fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Contacto</div>
            <div style={{ color:"#555", fontSize:12, marginBottom:8 }}>📧 javier@wbccards.com</div>
            <div style={{ color:"#555", fontSize:12, marginBottom:8 }}>📱 @wildbono2011</div>
            <div style={{ color:"#555", fontSize:12 }}>🌍 España · Europa</div>
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"#333", fontSize:11 }}>© 2025 WBC Cards F1 · Todos los derechos reservados</p>
          <div style={{ display:"flex", gap:8 }}>
            <span style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"4px 10px", fontSize:10, color:"#444" }}>🔒 Pago Seguro</span>
            <span style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"4px 10px", fontSize:10, color:"#444" }}>📦 Envío Asegurado</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // HOME
  const HomeScreen = () => (
    <div style={{ paddingTop:64 }}>
      <div style={{ background:"linear-gradient(135deg, #080808 0%, #140000 50%, #080808 100%)", minHeight:isMobile?420:500, display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse at 70% 50%, rgba(204,0,0,0.15) 0%, transparent 60%)" }} />
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"60px 20px", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-block", background:"rgba(204,0,0,0.15)", border:"1px solid rgba(204,0,0,0.3)", borderRadius:20, padding:"4px 14px", fontSize:10, color:C.red, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>WBC CARDS F1 · PREMIUM COLLECTION</div>
          <h1 style={{ fontSize:isMobile?32:56, fontWeight:900, color:C.white, lineHeight:1.1, marginBottom:14, maxWidth:700 }}>Premium Formula 1<br/><span style={{ color:C.gold }}>Trading Cards</span></h1>
          <p style={{ fontSize:isMobile?14:18, color:"#888", marginBottom:36, maxWidth:500, lineHeight:1.6 }}>Topps • Sapphire • Chrome • Numbered • Autos • Relics</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button onClick={() => setScreen("catalog")} style={{ background:C.red, color:"#fff", border:"none", borderRadius:6, padding:"14px 28px", fontSize:14, fontWeight:800, cursor:"pointer", letterSpacing:1, textTransform:"uppercase" }}>Explorar colección</button>
            <button onClick={() => setScreen("catalog")} style={{ background:"transparent", color:C.white, border:`1px solid ${C.border}`, borderRadius:6, padding:"14px 28px", fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:1, textTransform:"uppercase" }}>Últimas cartas</button>
          </div>
        </div>
      </div>
      <TrustBar />
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 20px" }}>
        {newArrivals.length > 0 && <div style={{ marginTop:60 }}><SectionHeader tag="Recién llegadas" title="Latest Arrivals" onMore={() => setScreen("catalog")} /><Grid items={newArrivals} /></div>}
        {featured.length > 0 && <div style={{ marginTop:60 }}><SectionHeader tag="Premium" title="Featured Cards" tagColor={C.gold} onMore={() => setScreen("catalog")} /><Grid items={featured.slice(0,6)} min={220} /></div>}
        <div style={{ marginTop:60 }}>
          <SectionHeader tag="Por piloto" title="Drivers Collection" />
          <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${isMobile?140:170}px, 1fr))`, gap:10 }}>
            {DRIVERS.map(driver => { const count = products.filter(p => (p.Piloto||"").toLowerCase().includes(driver.toLowerCase())).length; return (
              <div key={driver} onClick={() => { setFilters(f=>({...f,piloto:driver})); setScreen("catalog"); }} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"16px 14px", cursor:"pointer", textAlign:"center" }}>
                <div style={{ fontSize:26, marginBottom:8 }}>🏎</div>
                <div style={{ color:C.white, fontWeight:800, fontSize:13 }}>{driver}</div>
                <div style={{ color:C.gray, fontSize:11, marginTop:4 }}>{count} carta{count!==1?"s":""}</div>
              </div>
            ); })}
          </div>
        </div>
        {rareCards.length > 0 && <div style={{ marginTop:60 }}><SectionHeader tag="Exclusivas" title="Rare Cards" tagColor="#a78bfa" onMore={() => { setFilters(f=>({...f,numerada:true})); setScreen("catalog"); }} /><Grid items={rareCards} /></div>}
        {newArrivals.length===0 && featured.length===0 && !loading && (
          <div style={{ marginTop:60 }}>
            <SectionHeader tag="Colección completa" title="Catálogo F1" onMore={() => setScreen("catalog")} />
            <Grid items={products.slice(0,12)} />
            {products.length > 12 && <div style={{ textAlign:"center", marginTop:32 }}><button onClick={() => setScreen("catalog")} style={{ background:C.red, color:"#fff", border:"none", borderRadius:6, padding:"13px 32px", fontSize:13, fontWeight:800, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>Ver todas las cartas</button></div>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );

  // CATALOG
  const CatalogScreen = () => (
    <div style={{ paddingTop:64 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"80px 20px 60px" }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ color:C.white, fontSize:isMobile?24:32, fontWeight:900, marginBottom:6 }}>Catálogo F1</h1>
          <p style={{ color:C.gray, fontSize:13 }}>{filtered.length} carta{filtered.length!==1?"s":""} encontrada{filtered.length!==1?"s":""}</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
          <button onClick={() => setFilters({set:"",piloto:"",numerada:false,auto:false,relic:false})} style={{ background:(!filters.set&&!filters.piloto&&!filters.numerada&&!filters.auto&&!filters.relic)?C.red:"#1a1a1a", color:(!filters.set&&!filters.piloto&&!filters.numerada&&!filters.auto&&!filters.relic)?"#fff":C.gray, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Todo</button>
          {SETS.map(s => <button key={s} onClick={() => setFilters(f=>({...f,set:f.set===s?"":s}))} style={{ background:filters.set===s?C.red:"#1a1a1a", color:filters.set===s?"#fff":C.gray, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{s.replace("Topps ","").replace(" F1","")}</button>)}
          <button onClick={() => setFilters(f=>({...f,auto:!f.auto,relic:false}))} style={{ background:filters.auto?C.gold:"#1a1a1a", color:filters.auto?C.black:C.gray, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Autos</button>
          <button onClick={() => setFilters(f=>({...f,relic:!f.relic,auto:false}))} style={{ background:filters.relic?"#a78bfa":"#1a1a1a", color:filters.relic?"#fff":C.gray, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Relics</button>
          <button onClick={() => setFilters(f=>({...f,numerada:!f.numerada}))} style={{ background:filters.numerada?"#f59e0b":"#1a1a1a", color:filters.numerada?C.black:C.gray, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Numeradas</button>
          {DRIVERS.slice(0,6).map(d => <button key={d} onClick={() => setFilters(f=>({...f,piloto:f.piloto===d?"":d}))} style={{ background:filters.piloto===d?"#333":"transparent", color:filters.piloto===d?C.white:C.gray, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:600, cursor:"pointer" }}>{d}</button>)}
        </div>
        {loading && <div style={{ textAlign:"center", padding:60, color:C.gray }}>⏳ Cargando...</div>}
        {!loading && filtered.length===0 && <div style={{ textAlign:"center", padding:60, color:C.gray }}><div style={{ fontSize:40, marginBottom:12 }}>🏎</div><p>No hay cartas con estos filtros.</p><button onClick={() => setFilters({set:"",piloto:"",numerada:false,auto:false,relic:false})} style={{ marginTop:16, background:C.red, color:"#fff", border:"none", borderRadius:6, padding:"10px 24px", fontSize:13, fontWeight:800, cursor:"pointer" }}>Limpiar filtros</button></div>}
        <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${isMobile?160:200}px, 1fr))`, gap:14 }}>
          {filtered.map(p => <ProductCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );

  // PRODUCT
  const ProductScreen = () => {
    if (!selected) return null;
    const stock = getStock(selected); const inC = inCart(selected._id);
    const imgs = [selected.Imagen_URL, selected.Imagen2_URL, selected.Imagen3_URL].filter(Boolean);
    const similar = products.filter(p => p._id!==selected._id && (p.Piloto===selected.Piloto||p.Serie===selected.Serie)).sort(()=>Math.random()-0.5).slice(0,4);
    const rc = RARITY_COLOR[selected.Rareza] || C.gray;
    return (
      <div style={{ paddingTop:64 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"40px 20px 60px" }}>
          <button onClick={() => setScreen("catalog")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.gray, cursor:"pointer", marginBottom:24, fontSize:13 }}>{Icon.back} Volver al catálogo</button>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:40, alignItems:"start" }}>
            <div>
              <div style={{ background:"#0a0a0a", borderRadius:12, overflow:"hidden", position:"relative", paddingTop:"120%", marginBottom:12 }}>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {imgs[activeImg] && <img src={imgs[activeImg]} alt={selected.Nombre} style={{ maxWidth:"90%", maxHeight:"90%", objectFit:"contain" }} />}
                </div>
                {imgs[activeImg] && <button onClick={() => setZoomImg(imgs[activeImg])} style={{ position:"absolute", bottom:12, right:12, background:"rgba(0,0,0,0.7)", border:`1px solid ${C.border}`, borderRadius:6, color:C.gray, cursor:"pointer", padding:8, display:"flex" }}>{Icon.zoom}</button>}
              </div>
              {imgs.length > 1 && <div style={{ display:"flex", gap:8 }}>{imgs.map((img,i) => <div key={i} onClick={() => setActiveImg(i)} style={{ width:64, height:80, background:"#0a0a0a", borderRadius:6, overflow:"hidden", cursor:"pointer", border:`2px solid ${i===activeImg?C.gold:C.border}`, flexShrink:0 }}><img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} /></div>)}</div>}
            </div>
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                {selected.Auto==="TRUE" && <span style={{ background:"rgba(201,168,76,0.15)", border:`1px solid ${C.gold}`, color:C.gold, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:1 }}>AUTOGRAPH</span>}
                {selected.Relic==="TRUE" && <span style={{ background:"rgba(167,139,250,0.15)", border:"1px solid #a78bfa", color:"#a78bfa", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:1 }}>RELIC</span>}
                {selected.Numeracion && <span style={{ background:"rgba(100,100,100,0.15)", border:`1px solid ${rc}`, color:rc, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{selected.Numeracion}</span>}
              </div>
              <div style={{ color:C.gray, fontSize:12, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>{selected.Piloto} · {selected.Equipo}</div>
              <h1 style={{ color:C.white, fontSize:isMobile?22:28, fontWeight:900, marginBottom:8, lineHeight:1.2 }}>{selected.Nombre}</h1>
              {selected.Paralela && selected.Paralela!=="Base" && <div style={{ color:rc, fontWeight:700, fontSize:14, marginBottom:16 }}>{selected.Paralela}</div>}
              <div style={{ fontSize:isMobile?36:44, fontWeight:900, color:C.gold, marginBottom:24 }}>{parseFloat(selected.Precio||0).toFixed(2)}€</div>
              <button onClick={e => { if(stock>0) addToCart(selected._id,e); }} style={{ width:"100%", background:inC?"#16a34a":stock===0?"#1a1a1a":C.red, color:"#fff", border:"none", borderRadius:8, padding:16, fontSize:15, fontWeight:800, cursor:stock===0?"default":"pointer", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
                {inC?"✓ En la cesta":stock===0?"Sin stock":"Añadir a la cesta"}
              </button>
              {inC && <button onClick={() => setScreen("cart")} style={{ width:"100%", background:"transparent", color:C.gold, border:`1px solid ${C.gold}`, borderRadius:8, padding:13, fontSize:14, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1, marginBottom:24 }}>Ver cesta →</button>}
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
                {[["Piloto",selected.Piloto],["Equipo",selected.Equipo],["Año",selected.Año],["Serie",selected.Serie],["Subset",selected.Subset],["Paralela",selected.Paralela],["Numeración",selected.Numeracion],["Estado",selected.Estado],["Grading",selected.Grading==="TRUE"&&selected.Empresa_Grading?`${selected.Empresa_Grading} ${selected.Nota_Grading}`:null],["PSA Población",selected.PSA_Poblacion],["Stock",stock>0?`${stock} ud.`:"Sin stock"]].filter(r=>r[1]).map(([label,value]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid #0f0f0f`, fontSize:13 }}>
                    <span style={{ color:C.gray }}>{label}</span><span style={{ color:C.white, fontWeight:600 }}>{value}</span>
                  </div>
                ))}
              </div>
              {(selected.Cardmarket_URL || selected.eBay_URL) && (
                <div style={{ marginTop:20, display:"flex", gap:10 }}>
                  {selected.Cardmarket_URL && <a href={selected.Cardmarket_URL} target="_blank" rel="noreferrer" style={{ flex:1, background:"#1a1a1a", border:`1px solid ${C.border}`, color:C.gray, borderRadius:8, padding:10, fontSize:11, fontWeight:700, textDecoration:"none", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>Cardmarket {Icon.ext}</a>}
                  {selected.eBay_URL && <a href={selected.eBay_URL} target="_blank" rel="noreferrer" style={{ flex:1, background:"#1a1a1a", border:`1px solid ${C.border}`, color:C.gray, borderRadius:8, padding:10, fontSize:11, fontWeight:700, textDecoration:"none", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>eBay {Icon.ext}</a>}
                </div>
              )}
            </div>
          </div>
          {similar.length > 0 && <div style={{ marginTop:60 }}><h2 style={{ color:C.white, fontSize:22, fontWeight:900, marginBottom:20 }}>También te puede gustar</h2><div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${isMobile?160:200}px, 1fr))`, gap:14 }}>{similar.map(p => <ProductCard key={p._id} p={p} />)}</div></div>}
        </div>
        <Footer />
      </div>
    );
  };

  // CART
  const CartScreen = () => (
    <div style={{ paddingTop:64, maxWidth:900, margin:"0 auto", padding:"80px 20px 60px" }}>
      <h1 style={{ color:C.white, fontSize:28, fontWeight:900, marginBottom:24 }}>Tu cesta</h1>
      {cartItems.length===0 ? (
        <div style={{ textAlign:"center", padding:80, color:C.gray }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
          <p style={{ marginBottom:24, fontSize:15 }}>Tu cesta está vacía</p>
          <button onClick={() => setScreen("catalog")} style={{ background:C.red, color:"#fff", border:"none", borderRadius:6, padding:"13px 32px", fontSize:14, fontWeight:800, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>Ver catálogo</button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 360px", gap:24, alignItems:"start" }}>
          <div>
            {cartItems.map(c => (
              <div key={c.id} style={{ display:"flex", gap:16, padding:16, background:C.card, borderRadius:10, border:`1px solid ${C.border}`, marginBottom:12 }}>
                <div style={{ width:70, height:90, background:"#0a0a0a", borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                  {c.product.Imagen_URL && <img src={c.product.Imagen_URL} alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:C.gray, fontSize:10, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{c.product.Piloto}</div>
                  <div style={{ color:C.white, fontWeight:700, fontSize:14, marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.product.Nombre}</div>
                  <div style={{ color:C.gold, fontWeight:800, fontSize:16 }}>{(parseFloat(c.product.Precio||0)*c.qty).toFixed(2)}€</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  <button onClick={() => removeFromCart(c.id)} style={{ background:"none", border:"none", color:"#f87171", cursor:"pointer", fontSize:20, lineHeight:1 }}>×</button>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={() => changeQty(c.id,-1)} style={{ width:28, height:28, background:C.dark, border:`1px solid ${C.border}`, borderRadius:4, color:C.gray, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <span style={{ color:C.white, fontWeight:700, minWidth:20, textAlign:"center" }}>{c.qty}</span>
                    <button onClick={() => changeQty(c.id,1)} style={{ width:28, height:28, background:C.dark, border:`1px solid ${C.border}`, borderRadius:4, color:C.gray, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:C.card, borderRadius:12, padding:20, border:`1px solid ${C.border}`, position:isMobile?"static":"sticky", top:80 }}>
            <h3 style={{ color:C.white, fontWeight:800, marginBottom:16, fontSize:16, textTransform:"uppercase", letterSpacing:1 }}>Resumen</h3>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}><span style={{ color:C.gray }}>Subtotal ({cartCount} art.)</span><span style={{ color:C.white }}>{cartTotal}€</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, fontSize:13 }}><span style={{ color:C.gray }}>Envío</span><span style={{ color:"#4ade80" }}>A consultar</span></div>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, display:"flex", justifyContent:"space-between", marginBottom:20, fontSize:18, fontWeight:900 }}><span style={{ color:C.white }}>Total</span><span style={{ color:C.gold }}>{cartTotal}€</span></div>
            <button onClick={() => setOrderOpen(true)} style={{ width:"100%", background:C.red, color:"#fff", border:"none", borderRadius:8, padding:15, fontSize:15, fontWeight:800, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>Tramitar pedido →</button>
            <div style={{ textAlign:"center", marginTop:14, color:"#444", fontSize:10 }}>🔒 Pago seguro · 📦 Envío asegurado</div>
          </div>
        </div>
      )}
    </div>
  );

  // ADMIN
  const AdminScreen = () => {
    const legalKeys = [["aviso","Aviso Legal"],["privacidad","Privacidad"],["cookies","Cookies"],["envios","Envíos"],["devoluciones","Devoluciones"]];
    return (
      <div style={{ paddingTop:64, maxWidth:1200, margin:"0 auto", padding:"80px 20px 60px" }}>
        <h1 style={{ color:C.white, fontSize:24, fontWeight:900, marginBottom:24, textTransform:"uppercase", letterSpacing:2 }}>Panel Admin</h1>
        {!adminAuth ? (
          <div style={{ maxWidth:400, background:C.card, borderRadius:14, padding:32, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}><img src={LOGO_URI} alt="WBC" style={{ width:80, height:80 }} /></div>
            <h3 style={{ color:C.white, textAlign:"center", marginBottom:6, fontWeight:800 }}>Acceso Administrador</h3>
            <p style={{ color:C.gray, textAlign:"center", fontSize:12, marginBottom:20 }}>Solo uso interno</p>
            <input style={{ ...inp, marginBottom:10 }} type="password" placeholder="Contraseña" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => { if(e.key==="Enter"){adminPass===ADMIN_PASSWORD?(setAdminAuth(true),setAdminError("")):setAdminError("Contraseña incorrecta.");} }} />
            {adminError && <p style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{adminError}</p>}
            <button style={{ width:"100%", background:C.red, color:"#fff", border:"none", borderRadius:8, padding:13, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", textTransform:"uppercase" }} onClick={() => { adminPass===ADMIN_PASSWORD?(setAdminAuth(true),setAdminError("")):setAdminError("Contraseña incorrecta."); }}>Entrar</button>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {[["orders","Pedidos"],["legal","Textos Legales"]].map(([id,label]) => <button key={id} onClick={() => setAdminTab(id)} style={{ background:adminTab===id?C.red:"#1a1a1a", color:"#fff", border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 20px", fontSize:12, fontWeight:800, cursor:"pointer", textTransform:"uppercase" }}>{label}</button>)}
            </div>
            {adminTab==="orders" && (
              <>
                <p style={{ color:C.gray, fontSize:13, marginBottom:16 }}>{orders.length} pedido{orders.length!==1?"s":""}</p>
                {orders.length===0 ? <div style={{ textAlign:"center", padding:60, color:C.gray, background:C.card, borderRadius:12 }}>No hay pedidos</div> : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:12 }}>
                    {orders.map(order => {
                      const orderProds = order.items.map(c => { const p = products.find(x=>x._id===c.id); return p?`${p.Nombre} x${c.qty}`:""; }).filter(Boolean);
                      const statusColor = order.status==="paid"?"#4ade80":order.status==="sent"?"#60a5fa":C.red;
                      const statusLabel = order.status==="paid"?"Pagado":order.status==="sent"?"Enviado":"Pendiente";
                      return (
                        <div key={order.id} style={{ background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontWeight:800, color:C.white }}>{order.nombre}</span><span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, border:`1px solid ${statusColor}`, color:statusColor }}>{statusLabel}</span></div>
                          <p style={{ fontSize:12, color:C.gray }}>{order.email}</p>
                          {order.tel && <p style={{ fontSize:12, color:C.gray }}>📞 {order.tel}</p>}
                          <p style={{ fontSize:12, color:C.gray }}>📍 {order.address}</p>
                          <div style={{ background:"#0a0a0a", borderRadius:8, padding:"8px 10px", margin:"10px 0" }}>
                            {orderProds.map((p,i) => <div key={i} style={{ fontSize:11, color:"#555", marginBottom:2 }}>• {p}</div>)}
                            <div style={{ fontSize:14, fontWeight:800, color:C.gold, marginTop:6 }}>{order.total}€</div>
                          </div>
                          <div style={{ display:"flex", gap:6 }}>
                            {order.status==="pending" && <button onClick={() => { const u=orders.map(o=>o.id===order.id?{...o,status:"sent"}:o); setOrders(u); saveOrders(u); }} style={{ flex:2, background:"#1e3a5f", color:"#60a5fa", border:"1px solid #2563eb", borderRadius:6, padding:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>Marcar enviado</button>}
                            {order.status==="sent" && <button onClick={() => { const u=orders.map(o=>o.id===order.id?{...o,status:"paid"}:o); setOrders(u); saveOrders(u); }} style={{ flex:2, background:"#14532d", color:"#4ade80", border:"1px solid #16a34a", borderRadius:6, padding:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Pagado</button>}
                            <button onClick={() => { const u=orders.filter(o=>o.id!==order.id); setOrders(u); saveOrders(u); }} style={{ flex:1, background:"#1e0000", color:"#f87171", border:"1px solid #7f1d1d", borderRadius:6, padding:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>Eliminar</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {adminTab==="legal" && (
              <div>
                <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                  {legalKeys.map(([k,l]) => <button key={k} onClick={() => setActiveLegal(k)} style={{ background:activeLegal===k?C.red:"#1a1a1a", color:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 14px", fontSize:11, fontWeight:700, cursor:"pointer" }}>{l}</button>)}
                </div>
                <textarea style={{ ...inp, minHeight:320, resize:"vertical", lineHeight:1.7, fontSize:12 }} value={editingLegal[activeLegal]!==undefined?editingLegal[activeLegal]:legal[activeLegal]} onChange={e => setEditingLegal(prev=>({...prev,[activeLegal]:e.target.value}))} />
                <button onClick={() => { const u={...legal,...editingLegal}; setLegal(u); saveLegal(u); setLegalSaved(true); setTimeout(()=>setLegalSaved(false),2000); }} style={{ marginTop:12, background:legalSaved?"#16a34a":C.red, color:"#fff", border:"none", borderRadius:8, padding:"12px 24px", fontSize:13, fontWeight:800, cursor:"pointer", textTransform:"uppercase" }}>{legalSaved?"✓ Guardado":"Guardar"}</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:"-apple-system, 'Segoe UI', sans-serif", minHeight:"100vh", background:C.dark, color:C.white }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder, textarea::placeholder { color: #444; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; } a { color: inherit; } button { font-family: inherit; }`}</style>

      <Navbar />

      {/* LEGAL MODAL */}
      {legalPage && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:300, overflow:"auto" }}>
          <div style={{ maxWidth:680, margin:"0 auto", background:C.dark, minHeight:"100vh", paddingBottom:60 }}>
            <div style={{ background:C.black, padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0 }}>
              <button onClick={() => setLegalPage(null)} style={{ background:"none", border:"none", color:C.gold, fontSize:26, cursor:"pointer" }}>‹</button>
              <span style={{ color:C.gold, fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{{aviso:"Aviso Legal",privacidad:"Privacidad",cookies:"Cookies",envios:"Envíos",devoluciones:"Devoluciones"}[legalPage]}</span>
            </div>
            <div style={{ padding:"24px 20px" }}><pre style={{ color:"#aaa", fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"inherit" }}>{legal[legalPage]}</pre></div>
          </div>
        </div>
      )}

      {/* ORDER MODAL */}
      {orderOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setOrderOpen(false)}>
          <div style={{ background:"#141414", borderRadius:"20px 20px 0 0", padding:"0 24px 44px", width:"100%", maxWidth:560, maxHeight:"93vh", overflowY:"auto", borderTop:`1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div style={{ width:40, height:3, background:C.border, borderRadius:2, margin:"12px auto 24px" }} />
            <h2 style={{ color:C.red, fontSize:18, fontWeight:900, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Datos del pedido</h2>
            <p style={{ color:C.gray, fontSize:12, marginBottom:20 }}>Completa tus datos y te contactamos para el pago.</p>
            <div style={{ background:"#0a0a0a", borderRadius:10, padding:"10px 14px", marginBottom:20 }}>
              {cartItems.map(c => <div key={c.id} style={{ padding:"8px 0", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", fontSize:12 }}><span style={{ color:"#888" }}>{c.product.Nombre} x{c.qty}</span><span style={{ color:C.gold, fontWeight:700 }}>{(parseFloat(c.product.Precio||0)*c.qty).toFixed(2)}€</span></div>)}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, fontSize:16, fontWeight:900 }}><span style={{ color:C.gray }}>Total</span><span style={{ color:C.gold }}>{cartTotal}€</span></div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
              {[["Nombre *","text","Tu nombre completo","nombre"],["Email *","email","tu@email.com","email"],["Teléfono","tel","600 000 000","tel"],["Dirección de envío *","text","Calle, número, ciudad, CP","address"]].map(([label,type,ph,key]) => (
                <div key={key}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.gray, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                  <input style={inp} type={type} placeholder={ph} value={orderData[key]} onChange={e => setOrderData(d=>({...d,[key]:e.target.value}))} />
                </div>
              ))}
            </div>
            {orderError && <p style={{ color:"#f87171", fontSize:12, marginBottom:12 }}>{orderError}</p>}
            <button style={{ width:"100%", background:C.red, color:"#fff", border:"none", borderRadius:10, padding:15, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit", marginBottom:10, textTransform:"uppercase", letterSpacing:1 }} onClick={doOrder}>Confirmar pedido</button>
            <button style={{ width:"100%", background:"none", color:C.gray, border:`1px solid ${C.border}`, borderRadius:10, padding:13, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }} onClick={() => setOrderOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ZOOM */}
      {zoomImg && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.97)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="zoom" style={{ maxWidth:"90vw", maxHeight:"90vh", objectFit:"contain", borderRadius:8 }} />
          <button onClick={() => setZoomImg(null)} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", borderRadius:"50%", width:40, height:40, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
      )}

      {/* TOAST */}
      {successMsg && <div style={{ position:"fixed", bottom:isMobile?80:24, left:"50%", transform:"translateX(-50%)", background:"#14532d", color:"#86efac", padding:"12px 24px", borderRadius:8, fontSize:14, fontWeight:600, zIndex:500, whiteSpace:"nowrap", boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}>{successMsg}</div>}

      {/* SCREENS */}
      {loading && screen==="home" && <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", color:C.gray, fontSize:14 }}>⏳ Cargando colección...</div>}
      {!loading && screen==="home" && <HomeScreen />}
      {screen==="catalog" && <CatalogScreen />}
      {screen==="product" && <ProductScreen />}
      {screen==="cart" && <CartScreen />}
      {screen==="admin" && <AdminScreen />}

      {/* MOBILE NAV */}
      {isMobile && (
        <>
          <div style={{ paddingBottom:70 }} />
          <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.black, borderTop:`1px solid ${C.border}`, display:"flex", paddingBottom:"env(safe-area-inset-bottom, 16px)", paddingTop:10, zIndex:100 }}>
            {[["home","🏠","Inicio"],["catalog","🏎","Catálogo"],["cart","🛒","Cesta"],["admin","👤","Admin"]].map(([id,icon,label]) => (
              <div key={id} onClick={() => { setScreen(id); if(id==="admin"){setAdminAuth(false);setAdminPass("");} }} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"2px 0", position:"relative" }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                {id==="cart" && cartCount>0 && <span style={{ position:"absolute", top:0, right:"20%", background:C.red, color:"#fff", borderRadius:10, fontSize:8, fontWeight:800, padding:"1px 5px" }}>{cartCount}</span>}
                <span style={{ fontSize:9, fontWeight:700, color:screen===id?C.gold:C.gray, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
