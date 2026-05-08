import { useState, useEffect, useRef } from "react";

const SHEET_URL = "https://opensheet.elk.sh/18pEEgSp4mZ0x6vdd5N8gNuwcJTh_cZXV7kSSQwDT-gg/wbccards";
const ADMIN_EMAIL = "info@wbccards.com";
const ADMIN_PASSWORD = "admin2026";
const LOGO_URI = "/Logo-f1.png";
const INSTAGRAM_URL = "https://instagram.com/wbccardsf1";
const EBAY_STORE = "https://www.ebay.es/str/wildbonocards";
const CARDMARKET_URL = "https://www.cardmarket.com/es/Pokemon/Users/WBCcards";

const C = {
  black: "#080808", dark: "#0f0f0f", card: "#141414",
  border: "#1e1e1e", gold: "#c9a84c", red: "#cc0000",
  white: "#f5f5f5", gray: "#666",
};

const DRIVERS = ["Verstappen","Hamilton","Leclerc","Alonso","Senna","Schumacher","Piastri","Norris","Russell","Sainz"];
const SETS = ["Topps Chrome F1","Topps Sapphire F1","Topps Dynasty","Turbo Attax"];
const RARITY_COLOR = {
  "1/1":"#ff0000","Auto":"#c9a84c","Patch":"#a78bfa","Relic":"#a78bfa",
  "Ultra Rare":"#60a5fa","SSP":"#f59e0b","Rare":"#60a5fa","Common":"#666","Base":"#666",
};
const DEFAULT_LEGAL = {
  aviso: "LEGAL NOTICE\n\nOwner: WBC Cards F1\nEmail: info@wbccards.com\n\nIn compliance with Law 34/2002 on Information Society Services, this website is owned by WBC Cards F1.",
  privacidad: "PRIVACY POLICY\n\nRESPONSIBLE: WBC Cards F1\nPURPOSE: Order management\nRIGHTS: Contact info@wbccards.com",
  cookies: "COOKIES POLICY\n\nWe use technical cookies necessary for the operation of this site.",
  envios: "SHIPPING POLICY\n\nSpain: 2-5 business days\nEurope: 5-10 business days\nAll shipments include tracking number and toploader protection.",
  devoluciones: "RETURNS POLICY\n\n14 calendar days from receipt.\nContact: info@wbccards.com"
};

const getLegal = () => { try { return JSON.parse(localStorage.getItem("wbc_legal") || "null") || DEFAULT_LEGAL; } catch { return DEFAULT_LEGAL; } };
const saveLegal = d => { try { localStorage.setItem("wbc_legal", JSON.stringify(d)); } catch {} };
const getOrders = () => { try { return JSON.parse(localStorage.getItem("wbc_orders") || "[]"); } catch { return []; } };
const saveOrders = d => { try { localStorage.setItem("wbc_orders", JSON.stringify(d)); } catch {} };

const LogoImg = ({ size = 48 }) => {
  const [err, setErr] = useState(false);
  return err ? (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", flexShrink: 0 }}>
      <span style={{ color: "#c9a84c", fontSize: size * 0.32, fontWeight: 900, letterSpacing: -1 }}>WBC</span>
    </div>
  ) : (
    <img src={LOGO_URI} alt="WBC Cards F1" style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} onError={() => setErr(true)} />
  );
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
  const [filters, setFilters] = useState({ set: "", piloto: "", numerada: false, auto: false, relic: false });
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderData, setOrderData] = useState({ nombre: "", email: "", tel: "", address: "" });
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

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  useEffect(() => {
    fetch(SHEET_URL).then(r => r.json()).then(data => { setProducts(data.map((row, i) => ({ _id: i + 1, ...row }))); setLoading(false); }).catch(() => setLoading(false));
    setOrders(getOrders());
  }, []);

  const cartItems = cart.map(c => ({ ...c, product: products.find(p => p._id === c.id) })).filter(c => c.product);
  const cartTotal = cartItems.reduce((s, c) => s + parseFloat(c.product.Precio || 0) * c.qty, 0).toFixed(2);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const inCart = id => cart.some(c => c.id === id);
  const getStock = p => parseInt(p?.Stock || 0);
  const addToCart = (id, e) => { e && e.stopPropagation(); setCart(prev => { const ex = prev.find(c => c.id === id); return ex ? prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { id, qty: 1 }]; }); };
  const removeFromCart = id => setCart(prev => prev.filter(c => c.id !== id));
  const changeQty = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c));

  const filtered = products.filter(p => {
    if (filters.set && (p.Serie || "") !== filters.set) return false;
    if (filters.piloto && !(p.Piloto || "").toLowerCase().includes(filters.piloto.toLowerCase())) return false;
    if (filters.numerada && !p.Numeracion) return false;
    if (filters.auto && p.Auto !== "TRUE") return false;
    if (filters.relic && p.Relic !== "TRUE") return false;
    if (search) { const q = search.toLowerCase(); return ["Nombre","Piloto","Equipo","Año","Numeracion","Serie","Paralela","Grading","Nota_Grading"].some(k => (p[k] || "").toLowerCase().includes(q)); }
    return true;
  });

  const featured = products.filter(p => p.Destacada === "TRUE" || p.Destacada === "SI");
  const newArrivals = products.filter(p => p.Nueva_Llegada === "TRUE" || p.Nueva_Llegada === "SI" || p.Activa === "TRUE").slice(0, 8);
  const rareCards = products.filter(p => p.Auto === "TRUE" || p.Relic === "TRUE" || (p.Numeracion && ["1/1","/5","/10"].includes(p.Numeracion))).slice(0, 8);

  const doOrder = () => {
    if (!orderData.nombre.trim() || !orderData.email.trim() || !orderData.address.trim()) { setOrderError("Please fill in name, email and address."); return; }
    if (!/\S+@\S+\.\S+/.test(orderData.email)) { setOrderError("Invalid email."); return; }
    const prods = cartItems.map(c => `- ${c.product.Nombre} x${c.qty} · ${(parseFloat(c.product.Precio || 0) * c.qty).toFixed(2)}€`).join("\n");
    const newOrder = { id: Date.now(), ...orderData, items: [...cart], total: cartTotal, createdAt: Date.now(), status: "pending" };
    const updated = [...orders, newOrder]; setOrders(updated); saveOrders(updated);
    window.open(`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent("WBC Cards Order - " + orderData.nombre)}&body=${encodeURIComponent("Client: " + orderData.nombre + "\nEmail: " + orderData.email + "\nPhone: " + (orderData.tel || "N/A") + "\nAddress: " + orderData.address + "\n\n" + prods + "\n\nTotal: " + cartTotal + "€")}`);
    setOrderOpen(false); setOrderData({ nombre: "", email: "", tel: "", address: "" }); setOrderError(""); setCart([]);
    setSuccessMsg("✓ Order confirmed · " + cartItems.length + " card" + (cartItems.length > 1 ? "s" : "") + " · " + cartTotal + "€");
    setTimeout(() => setSuccessMsg(""), 8000); setScreen("home");
  };

  const inp = { width: "100%", padding: "12px 14px", border: "1px solid " + C.border, borderRadius: 8, fontSize: 14, outline: "none", background: "#1a1a1a", color: C.white, fontFamily: "inherit" };

  const ProductCard = ({ p }) => {
    const stock = getStock(p); const inC = inCart(p._id);
    const rc = RARITY_COLOR[p.Rareza] || C.gray;
    const isAuto = p.Auto === "TRUE"; const isRelic = p.Relic === "TRUE";
    const isGraded = p.Grading === "TRUE" && p.Empresa_Grading;
    const isParallel = p.Paralela && p.Paralela !== "Base";
    const glow = isGraded ? "0 0 18px rgba(201,168,76,0.4), 0 4px 14px rgba(0,0,0,0.6)"
      : isAuto ? "0 0 14px rgba(201,168,76,0.25), 0 4px 14px rgba(0,0,0,0.6)"
      : isRelic ? "0 0 14px rgba(167,139,250,0.3), 0 4px 14px rgba(0,0,0,0.6)"
      : p.Numeracion ? "0 0 10px rgba(204,0,0,0.2), 0 4px 14px rgba(0,0,0,0.6)"
      : "0 4px 12px rgba(0,0,0,0.4)";
    const border = inC ? C.gold : isGraded ? C.gold : isAuto ? "rgba(201,168,76,0.5)" : isRelic ? "rgba(167,139,250,0.5)" : p.Numeracion ? "rgba(204,0,0,0.35)" : C.border;
    return (
      <div onClick={() => { setSelected(p); setActiveImg(0); setScreen("product"); window.scrollTo(0, 0); }}
        style={{ background: "linear-gradient(180deg, #1c1c1c 0%, #111 100%)", borderRadius: 12, overflow: "hidden", border: "1px solid " + border, cursor: "pointer", display: "flex", flexDirection: "column", boxShadow: glow }}>
        <div style={{ background: "#0a0a0a", position: "relative", paddingTop: "140%", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
            {p.Imagen_URL ? <img src={p.Imagen_URL} alt={p.Nombre} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => e.target.style.display = "none"} /> : <div style={{ color: "#1a1a1a", fontSize: 40 }}>🏎</div>}
          </div>
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {isGraded && <span style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)", color: "#000", fontSize: 10, fontWeight: 900, padding: "3px 9px", borderRadius: 4, letterSpacing: 1, boxShadow: "0 2px 8px rgba(201,168,76,0.6)" }}>{p.Empresa_Grading} {p.Nota_Grading}</span>}
            {isAuto && !isGraded && <span style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "#000", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase", boxShadow: "0 2px 8px rgba(201,168,76,0.5)" }}>AUTO</span>}
            {isRelic && <span style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase", boxShadow: "0 2px 8px rgba(167,139,250,0.5)" }}>RELIC</span>}
          </div>
          {p.Numeracion && <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.92)", border: "1px solid " + rc, borderRadius: 6, padding: "4px 9px", fontSize: 11, color: rc, fontWeight: 900, boxShadow: "0 0 10px " + rc + "55" }}>{p.Numeracion}</div>}
          {isParallel && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, " + rc + ", transparent)" }} />}
          {stock === 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#555", fontSize: 12, fontWeight: 900, letterSpacing: 3, border: "1px solid #333", padding: "5px 14px", borderRadius: 4 }}>SOLD OUT</span></div>}
        </div>
        <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.5 }}>{p.Piloto}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.white, lineHeight: 1.3, minHeight: 30 }}>{p.Nombre}</div>
          {isParallel && <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: rc, display: "inline-block" }} /><span style={{ fontSize: 10, color: rc, fontWeight: 700 }}>{p.Paralela}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.gold }}>{parseFloat(p.Precio || 0).toFixed(2)}€</div>
            <button onClick={e => { e.stopPropagation(); if (stock > 0) addToCart(p._id, e); }}
              style={{ background: inC ? "#16a34a" : stock === 0 ? "#222" : C.red, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 800, cursor: stock === 0 ? "default" : "pointer", textTransform: "uppercase" }}>
              {inC ? "✓" : stock === 0 ? "—" : "Add"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Navbar = () => {
    const [searchFocused, setSearchFocused] = useState(false);
    const searchResults = search.length > 1
      ? products.filter(p => ["Nombre","Piloto","Equipo","Año","Numeracion","Serie","Paralela","Grading","Nota_Grading"].some(k => (p[k]||"").toLowerCase().includes(search.toLowerCase()))).slice(0, 6)
      : [];
    const QUICK_FILTERS = [
      { label: "All", icon: "⊞", action: () => setFilters({ set:"", piloto:"", numerada:false, auto:false, relic:false }) },
      { label: "Drivers", icon: "🏎", action: () => {} },
      { label: "Sets", icon: "📦", action: () => {} },
      { label: "Autos", icon: "✍", action: () => setFilters(f => ({...f, auto:true, relic:false})) },
      { label: "Relics", icon: "🔷", action: () => setFilters(f => ({...f, relic:true, auto:false})) },
      { label: "Numbered", icon: "#", action: () => setFilters(f => ({...f, numerada:true})) },
      { label: "PSA 10", icon: "🏆", action: () => { setSearch("PSA 10"); setScreen("catalog"); } },
    ];
    return (
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(6,6,6,0.98)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg, " + C.red + " 0%, " + C.gold + " 50%, " + C.red + " 100%)" }} />
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px", height: isMobile ? 54 : 66, display: "flex", alignItems: "center", gap: 14 }}>
          <div onClick={() => { setScreen("home"); setSearch(""); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <LogoImg size={isMobile ? 40 : 52} />
            {!isMobile && <div>
              <div style={{ color: C.gold, fontSize: 14, fontWeight: 900, letterSpacing: 3, lineHeight: 1 }}>WBC CARDS F1</div>
              <div style={{ color: "#444", fontSize: 8, letterSpacing: 3, marginTop: 2 }}>PREMIUM TRADING CARDS</div>
            </div>}
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#111", border: "1px solid " + (searchFocused ? C.gold : "#2a2a2a"), borderRadius: 8, overflow: "visible", transition: "border-color 0.2s", height: 42 }}>
              <span style={{ padding: "0 14px", color: searchFocused ? C.gold : "#555", fontSize: 16, flexShrink: 0 }}>🔍</span>
              <input ref={searchRef}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.white, fontSize: 13, fontFamily: "inherit", height: "100%" }}
                placeholder={isMobile ? "Search cards..." : "Search driver, team, year, /10, PSA 10, auto..."}
                value={search}
                onChange={e => { setSearch(e.target.value); if (e.target.value) setScreen("catalog"); }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onKeyDown={e => e.key === "Escape" && (setSearch(""), setSearchFocused(false))} />
              {search && <button onClick={() => setSearch("")} style={{ padding: "0 12px", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 18 }}>×</button>}
              {!isMobile && <button onClick={() => { if (search) setScreen("catalog"); }} style={{ background: C.red, border: "none", color: "#fff", padding: "0 18px", height: "100%", cursor: "pointer", fontSize: 14, fontWeight: 800, borderRadius: "0 7px 7px 0", flexShrink: 0 }}>🔍</button>}
            </div>
            {searchFocused && search.length > 1 && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#111", border: "1px solid #222", borderRadius: 10, zIndex: 200, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.8)" }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: "16px 20px", color: "#555", fontSize: 13 }}>No results for "{search}"</div>
                ) : (
                  <>
                    {searchResults.map(p => {
                      const isAuto = p.Auto === "TRUE"; const isGraded = p.Grading === "TRUE" && p.Empresa_Grading;
                      return (
                        <div key={p._id} onClick={() => { setSelected(p); setActiveImg(0); setScreen("product"); setSearch(""); window.scrollTo(0,0); }}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #1a1a1a" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <div style={{ width: 40, height: 52, background: "#0a0a0a", borderRadius: 6, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {p.Imagen_URL ? <img src={p.Imagen_URL} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 18 }}>🏎</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: C.white, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.Nombre}</div>
                            <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{p.Piloto} · {p.Serie}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            {p.Numeracion && <span style={{ background: "rgba(204,0,0,0.2)", border: "1px solid rgba(204,0,0,0.5)", color: "#ff6666", fontSize: 10, fontWeight: 900, padding: "2px 7px", borderRadius: 4 }}>{p.Numeracion}</span>}
                            {isAuto && <span style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.5)", color: C.gold, fontSize: 10, fontWeight: 900, padding: "2px 7px", borderRadius: 4 }}>AUTO</span>}
                            {isGraded && <span style={{ background: "rgba(201,168,76,0.9)", color: "#000", fontSize: 10, fontWeight: 900, padding: "2px 7px", borderRadius: 4 }}>{p.Empresa_Grading} {p.Nota_Grading}</span>}
                            <span style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{parseFloat(p.Precio||0).toFixed(0)}€</span>
                          </div>
                        </div>
                      );
                    })}
                    <div onClick={() => { setScreen("catalog"); setSearchFocused(false); }} style={{ padding: "12px 20px", color: C.red, fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center", borderTop: "1px solid #1a1a1a" }}>
                      View all results for "{search}" →
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <button onClick={() => setScreen("cart")} style={{ position: "relative", background: cartCount > 0 ? "rgba(204,0,0,0.15)" : "transparent", border: cartCount > 0 ? "1px solid rgba(204,0,0,0.3)" : "1px solid transparent", color: C.white, cursor: "pointer", fontSize: 18, padding: "6px 10px", borderRadius: 8 }}>
              🛒
              {cartCount > 0 && <span style={{ position: "absolute", top: -2, right: -2, background: C.red, color: "#fff", borderRadius: 10, fontSize: 9, fontWeight: 900, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>{cartCount}</span>}
            </button>
            <button onClick={() => { setScreen("admin"); setAdminAuth(false); setAdminPass(""); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 18, padding: "6px 8px" }}>👤</button>
            {isMobile && <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 22, padding: "6px 8px" }}>☰</button>}
          </div>
        </div>
        {!isMobile && (
          <div style={{ borderTop: "1px solid #151515", background: "rgba(0,0,0,0.5)" }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px", height: 38, display: "flex", alignItems: "center", gap: 4 }}>
              {QUICK_FILTERS.map(f => (
                <button key={f.label} onClick={() => { f.action(); setScreen("catalog"); }}
                  style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", padding: "4px 12px", fontSize: 11, fontWeight: 700, borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", fontFamily: "inherit" }}>
                  <span style={{ fontSize: 12 }}>{f.icon}</span> {f.label}
                </button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {SETS.map(s => (
                  <button key={s} onClick={() => { setFilters(flt => ({...flt, set: flt.set===s?"":s})); setScreen("catalog"); }}
                    style={{ background: filters.set===s ? C.red : "transparent", color: filters.set===s ? "#fff" : "#555", border: filters.set===s ? "none" : "1px solid #222", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                    {s.replace("Topps ","").replace(" F1","")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {isMobile && mobileMenu && (
          <div style={{ background: "#0a0a0a", borderTop: "1px solid " + C.border, padding: "12px 20px" }}>
            {SETS.map(s => <div key={s} onClick={() => { setFilters(f => ({...f, set:s})); setScreen("catalog"); setMobileMenu(false); }} style={{ padding: "10px 0", color: C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", borderBottom: "1px solid " + C.border, textTransform: "uppercase", letterSpacing: 1 }}>{s}</div>)}
            <div onClick={() => { setFilters(f => ({...f,auto:true,relic:false})); setScreen("catalog"); setMobileMenu(false); }} style={{ padding: "10px 0", color: C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", borderBottom: "1px solid " + C.border, textTransform: "uppercase" }}>Autos</div>
            <div onClick={() => { setFilters(f => ({...f,relic:true,auto:false})); setScreen("catalog"); setMobileMenu(false); }} style={{ padding: "10px 0", color: C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>Relics</div>
          </div>
        )}
      </nav>
    );  const TrustBar = () => (
    <div style={{ background: "#0a0a0a", borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "18px 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16 }}>
        {[["🛡","Verified Cards","100% authentic"],["🚚","International Shipping","Europe & worldwide"],["🔒","Secure Payment","Full protection"],["⭐","+500 Sales","Happy collectors"]].map(([icon,title,sub]) => (
          <div key={title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div><div style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>{title}</div><div style={{ color: "#555", fontSize: 11 }}>{sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  const Footer = () => (
    <footer style={{ background: C.black, borderTop: "1px solid " + C.border, marginTop: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <LogoImg size={44} />
              <div><div style={{ color: C.gold, fontWeight: 900, fontSize: 13, letterSpacing: 2 }}>WBC CARDS F1</div><div style={{ color: "#444", fontSize: 9, letterSpacing: 2 }}>PREMIUM TRADING CARDS</div></div>
            </div>
            <p style={{ color: "#555", fontSize: 12, lineHeight: 1.8, marginBottom: 16 }}>Specialists in premium F1 cards. Topps Chrome, Sapphire, Dynasty. Autos, Relics and numbered cards.</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" style={{ color: C.gray, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>📷 @wbccardsf1</a>
              <a href={EBAY_STORE} target="_blank" rel="noreferrer" style={{ color: C.gray, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>eBay Store ↗</a>
              <a href={CARDMARKET_URL} target="_blank" rel="noreferrer" style={{ color: C.gray, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Cardmarket ↗</a>
            </div>
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Collections</div>
            {SETS.map(s => <div key={s} onClick={() => { setFilters(f => ({...f,set:s})); setScreen("catalog"); }} style={{ color: "#555", fontSize: 12, marginBottom: 8, cursor: "pointer" }}>{s}</div>)}
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
            {[["aviso","Legal Notice"],["privacidad","Privacy"],["cookies","Cookies"],["envios","Shipping"],["devoluciones","Returns"]].map(([k,l]) => (
              <div key={k} onClick={() => setLegalPage(k)} style={{ color: "#555", fontSize: 12, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Contact</div>
            <div style={{ color: "#555", fontSize: 12, marginBottom: 8 }}>📧 info@wbccards.com</div>
            <div style={{ color: "#555", fontSize: 12, marginBottom: 8 }}>📷 @wbccardsf1</div>
            <div style={{ color: "#555", fontSize: 12 }}>🌍 Spain · Europe</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid " + C.border, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#333", fontSize: 11 }}>© 2025 WBC Cards F1 · All rights reserved</p>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 4, padding: "4px 10px", fontSize: 10, color: "#444" }}>🔒 Secure Payment</span>
            <span style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 4, padding: "4px 10px", fontSize: 10, color: "#444" }}>📦 Insured Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );

  const HomeScreen = () => (
    <div style={{ paddingTop: isMobile ? 56 : 106 }}>
      <div style={{ minHeight: isMobile ? 340 : 440, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/hero-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", backgroundRepeat: "no-repeat" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.35) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, " + C.red + ", " + C.gold + ", " + C.red + ")" }} />
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "50px 20px 40px" : "60px 40px 50px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(204,0,0,0.15)", border: "1px solid rgba(204,0,0,0.35)", borderRadius: 4, padding: "4px 14px", fontSize: 9, color: "#ff6666", fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.red, display: "inline-block" }} />
            WBC CARDS F1 · PREMIUM COLLECTION
          </div>
          <h1 style={{ fontSize: isMobile ? 38 : 70, fontWeight: 900, color: C.white, lineHeight: 0.92, marginBottom: 14, maxWidth: 700, textTransform: "uppercase", letterSpacing: -1, textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>
            PREMIUM<br />FORMULA 1<br /><span style={{ color: C.gold }}>TRADING CARDS</span>
          </h1>
          <p style={{ fontSize: isMobile ? 13 : 15, color: "#888", marginBottom: 14, maxWidth: 460, lineHeight: 1.5 }}>The finest F1 cards in one place.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
            {["Topps Chrome","Sapphire","Numbered","Autos","Relics","NBA","Champions"].map(tag => (
              <span key={tag} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "3px 10px", fontSize: 10, color: "#777", fontWeight: 600, letterSpacing: 0.5 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setScreen("catalog")} style={{ background: C.red, color: "#fff", border: "none", borderRadius: 6, padding: isMobile ? "12px 22px" : "13px 30px", fontSize: isMobile ? 12 : 13, fontWeight: 900, cursor: "pointer", letterSpacing: 2, textTransform: "uppercase", boxShadow: "0 4px 20px rgba(204,0,0,0.45)" }}>🏎 EXPLORE COLLECTION</button>
            <button onClick={() => { setFilters(f => ({...f,auto:true})); setScreen("catalog"); }} style={{ background: "transparent", color: C.gold, border: "1px solid rgba(201,168,76,0.4)", borderRadius: 6, padding: isMobile ? "12px 22px" : "13px 30px", fontSize: isMobile ? 12 : 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2, textTransform: "uppercase" }}>✦ AUTOS & RELICS</button>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: 32, marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[["500+","Cards sold"],["100%","Authentic"],["48h","Fast shipping"],["PSA·BGS","Graded available"]].map(([num,label]) => (
                <div key={num}><div style={{ color: C.gold, fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{num}</div><div style={{ color: "#555", fontSize: 11, marginTop: 3 }}>{label}</div></div>
              ))}
            </div>
          )}
        </div>
      </div>
      <TrustBar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px" }}>
        {newArrivals.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <div><div style={{ color: C.red, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>New arrivals</div><h2 style={{ color: C.white, fontSize: isMobile ? 22 : 28, fontWeight: 900, margin: 0 }}>Latest Arrivals</h2></div>
              <button onClick={() => setScreen("catalog")} style={{ background: "none", border: "1px solid " + C.border, color: C.gray, borderRadius: 6, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>View all</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(" + (isMobile?160:200) + "px, 1fr))", gap: 14 }}>
              {newArrivals.map(p => <ProductCard key={p._id} p={p} />)}
            </div>
          </div>
        )}
        {featured.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <div><div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Premium</div><h2 style={{ color: C.white, fontSize: isMobile ? 22 : 28, fontWeight: 900, margin: 0 }}>Featured Cards</h2></div>
              <button onClick={() => setScreen("catalog")} style={{ background: "none", border: "1px solid " + C.border, color: C.gray, borderRadius: 6, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>View all</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(" + (isMobile?160:220) + "px, 1fr))", gap: 14 }}>
              {featured.slice(0,6).map(p => <ProductCard key={p._id} p={p} />)}
            </div>
          </div>
        )}
        <div style={{ marginTop: 60 }}>
          <div style={{ marginBottom: 24 }}><div style={{ color: C.red, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>By driver</div><h2 style={{ color: C.white, fontSize: isMobile ? 22 : 28, fontWeight: 900, margin: 0 }}>Drivers Collection</h2></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(" + (isMobile?140:170) + "px, 1fr))", gap: 10 }}>
            {DRIVERS.map(driver => {
              const count = products.filter(p => (p.Piloto||"").toLowerCase().includes(driver.toLowerCase())).length;
              return (
                <div key={driver} onClick={() => { setFilters(f => ({...f,piloto:driver})); setScreen("catalog"); }} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "16px 14px", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>🏎</div>
                  <div style={{ color: C.white, fontWeight: 800, fontSize: 13 }}>{driver}</div>
                  <div style={{ color: C.gray, fontSize: 11, marginTop: 4 }}>{count} card{count!==1?"s":""}</div>
                </div>
              );
            })}
          </div>
        </div>
        {rareCards.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <div><div style={{ color: "#a78bfa", fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Exclusive</div><h2 style={{ color: C.white, fontSize: isMobile ? 22 : 28, fontWeight: 900, margin: 0 }}>Rare Cards</h2></div>
              <button onClick={() => { setFilters(f => ({...f,numerada:true})); setScreen("catalog"); }} style={{ background: "none", border: "1px solid " + C.border, color: C.gray, borderRadius: 6, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>View all</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(" + (isMobile?160:200) + "px, 1fr))", gap: 14 }}>
              {rareCards.map(p => <ProductCard key={p._id} p={p} />)}
            </div>
          </div>
        )}
        {newArrivals.length===0 && featured.length===0 && !loading && products.length>0 && (
          <div style={{ marginTop: 60 }}>
            <div style={{ marginBottom: 24 }}><div style={{ color: C.red, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Full collection</div><h2 style={{ color: C.white, fontSize: isMobile?22:28, fontWeight: 900, margin: 0 }}>F1 Catalogue</h2></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(" + (isMobile?160:200) + "px, 1fr))", gap: 14 }}>
              {products.slice(0,12).map(p => <ProductCard key={p._id} p={p} />)}
            </div>
            {products.length > 12 && <div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => setScreen("catalog")} style={{ background: C.red, color: "#fff", border: "none", borderRadius: 6, padding: "13px 32px", fontSize: 13, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>View all cards</button></div>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );

  const CatalogScreen = () => (
    <div style={{ paddingTop: isMobile ? 56 : 106 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: C.white, fontSize: isMobile?24:32, fontWeight: 900, marginBottom: 6 }}>F1 Catalogue</h1>
          <p style={{ color: C.gray, fontSize: 13 }}>{filtered.length} card{filtered.length!==1?"s":""} found</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <button onClick={() => setFilters({set:"",piloto:"",numerada:false,auto:false,relic:false})} style={{ background:(!filters.set&&!filters.piloto&&!filters.numerada&&!filters.auto&&!filters.relic)?C.red:"#1a1a1a", color:(!filters.set&&!filters.piloto&&!filters.numerada&&!filters.auto&&!filters.relic)?"#fff":C.gray, border:"1px solid "+C.border, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>All</button>
          {SETS.map(s => <button key={s} onClick={() => setFilters(f=>({...f,set:f.set===s?"":s}))} style={{ background:filters.set===s?C.red:"#1a1a1a", color:filters.set===s?"#fff":C.gray, border:"1px solid "+C.border, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{s.replace("Topps ","").replace(" F1","")}</button>)}
          <button onClick={() => setFilters(f=>({...f,auto:!f.auto,relic:false}))} style={{ background:filters.auto?C.gold:"#1a1a1a", color:filters.auto?C.black:C.gray, border:"1px solid "+C.border, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Autos</button>
          <button onClick={() => setFilters(f=>({...f,relic:!f.relic,auto:false}))} style={{ background:filters.relic?"#a78bfa":"#1a1a1a", color:filters.relic?"#fff":C.gray, border:"1px solid "+C.border, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Relics</button>
          <button onClick={() => setFilters(f=>({...f,numerada:!f.numerada}))} style={{ background:filters.numerada?"#f59e0b":"#1a1a1a", color:filters.numerada?C.black:C.gray, border:"1px solid "+C.border, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>Numbered</button>
          {DRIVERS.slice(0,6).map(d => <button key={d} onClick={() => setFilters(f=>({...f,piloto:f.piloto===d?"":d}))} style={{ background:filters.piloto===d?"#333":"transparent", color:filters.piloto===d?C.white:C.gray, border:"1px solid "+C.border, borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:600, cursor:"pointer" }}>{d}</button>)}
        </div>
        {loading && <div style={{ textAlign:"center", padding:60, color:C.gray }}>⏳ Loading...</div>}
        {!loading && filtered.length===0 && <div style={{ textAlign:"center", padding:60, color:C.gray }}><div style={{ fontSize:40, marginBottom:12 }}>🏎</div><p>No cards match these filters.</p><button onClick={() => setFilters({set:"",piloto:"",numerada:false,auto:false,relic:false})} style={{ marginTop:16, background:C.red, color:"#fff", border:"none", borderRadius:6, padding:"10px 24px", fontSize:13, fontWeight:800, cursor:"pointer" }}>Clear filters</button></div>}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax("+(isMobile?160:200)+"px, 1fr))", gap:14 }}>
          {filtered.map(p => <ProductCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );

  const ProductScreen = () => {
    if (!selected) return null;
    const stock = getStock(selected); const inC = inCart(selected._id);
    const imgs = [selected.Imagen_URL, selected.Imagen2_URL, selected.Imagen3_URL].filter(Boolean);
    const similar = products.filter(p => p._id!==selected._id && (p.Piloto===selected.Piloto||p.Serie===selected.Serie)).sort(()=>Math.random()-0.5).slice(0,4);
    const rc = RARITY_COLOR[selected.Rareza] || C.gray;
    return (
      <div style={{ paddingTop: isMobile ? 56 : 106 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"40px 20px 60px" }}>
          <button onClick={() => setScreen("catalog")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.gray, cursor:"pointer", marginBottom:24, fontSize:13 }}>← Back to catalogue</button>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:40, alignItems:"start" }}>
            <div>
              <div style={{ background:"#0a0a0a", borderRadius:12, overflow:"hidden", position:"relative", paddingTop:"120%", marginBottom:12 }}>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {imgs[activeImg] && <img src={imgs[activeImg]} alt={selected.Nombre} style={{ maxWidth:"90%", maxHeight:"90%", objectFit:"contain" }} />}
                </div>
                {imgs[activeImg] && <button onClick={() => setZoomImg(imgs[activeImg])} style={{ position:"absolute", bottom:12, right:12, background:"rgba(0,0,0,0.7)", border:"1px solid "+C.border, borderRadius:6, color:C.gray, cursor:"pointer", padding:8, fontSize:16 }}>🔍</button>}
              </div>
              {imgs.length > 1 && <div style={{ display:"flex", gap:8 }}>{imgs.map((img,i) => <div key={i} onClick={() => setActiveImg(i)} style={{ width:64, height:80, background:"#0a0a0a", borderRadius:6, overflow:"hidden", cursor:"pointer", border:"2px solid "+(i===activeImg?C.gold:C.border), flexShrink:0 }}><img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} /></div>)}</div>}
            </div>
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                {selected.Auto==="TRUE" && <span style={{ background:"rgba(201,168,76,0.15)", border:"1px solid "+C.gold, color:C.gold, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:1 }}>AUTOGRAPH</span>}
                {selected.Relic==="TRUE" && <span style={{ background:"rgba(167,139,250,0.15)", border:"1px solid #a78bfa", color:"#a78bfa", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:1 }}>RELIC</span>}
                {selected.Numeracion && <span style={{ background:"rgba(100,100,100,0.15)", border:"1px solid "+rc, color:rc, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{selected.Numeracion}</span>}
              </div>
              <div style={{ color:C.gray, fontSize:12, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>{selected.Piloto} · {selected.Equipo}</div>
              <h1 style={{ color:C.white, fontSize:isMobile?22:28, fontWeight:900, marginBottom:8, lineHeight:1.2 }}>{selected.Nombre}</h1>
              {selected.Paralela && selected.Paralela!=="Base" && <div style={{ color:rc, fontWeight:700, fontSize:14, marginBottom:16 }}>{selected.Paralela}</div>}
              <div style={{ fontSize:isMobile?36:44, fontWeight:900, color:C.gold, marginBottom:24 }}>{parseFloat(selected.Precio||0).toFixed(2)}€</div>
              <button onClick={e => { if(stock>0) addToCart(selected._id,e); }} style={{ width:"100%", background:inC?"#16a34a":stock===0?"#1a1a1a":C.red, color:"#fff", border:"none", borderRadius:8, padding:16, fontSize:15, fontWeight:800, cursor:stock===0?"default":"pointer", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
                {inC?"✓ In cart":stock===0?"Out of stock":"Add to cart"}
              </button>
              {inC && <button onClick={() => setScreen("cart")} style={{ width:"100%", background:"transparent", color:C.gold, border:"1px solid "+C.gold, borderRadius:8, padding:13, fontSize:14, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1, marginBottom:24 }}>View cart →</button>}
              <div style={{ borderTop:"1px solid "+C.border, paddingTop:20 }}>
                {[["Driver",selected.Piloto],["Team",selected.Equipo],["Year",selected.Año],["Series",selected.Serie],["Subset",selected.Subset],["Parallel",selected.Paralela],["Numbered",selected.Numeracion],["Condition",selected.Estado],["Grading",selected.Grading==="TRUE"&&selected.Empresa_Grading?selected.Empresa_Grading+" "+selected.Nota_Grading:null],["PSA Population",selected.PSA_Poblacion],["Stock",stock>0?stock+" units":"Out of stock"]].filter(r=>r[1]).map(([label,value]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #0f0f0f", fontSize:13 }}>
                    <span style={{ color:C.gray }}>{label}</span><span style={{ color:C.white, fontWeight:600 }}>{value}</span>
                  </div>
                ))}
              </div>
              {(selected.Cardmarket_URL||selected.eBay_URL) && (
                <div style={{ marginTop:20, display:"flex", gap:10 }}>
                  {selected.Cardmarket_URL && <a href={selected.Cardmarket_URL} target="_blank" rel="noreferrer" style={{ flex:1, background:"#1a1a1a", border:"1px solid "+C.border, color:C.gray, borderRadius:8, padding:10, fontSize:11, fontWeight:700, textDecoration:"none", textAlign:"center" }}>Cardmarket ↗</a>}
                  {selected.eBay_URL && <a href={selected.eBay_URL} target="_blank" rel="noreferrer" style={{ flex:1, background:"#1a1a1a", border:"1px solid "+C.border, color:C.gray, borderRadius:8, padding:10, fontSize:11, fontWeight:700, textDecoration:"none", textAlign:"center" }}>eBay ↗</a>}
                </div>
              )}
            </div>
          </div>
          {similar.length>0 && <div style={{ marginTop:60 }}><h2 style={{ color:C.white, fontSize:22, fontWeight:900, marginBottom:20 }}>You may also like</h2><div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax("+(isMobile?160:200)+"px, 1fr))", gap:14 }}>{similar.map(p => <ProductCard key={p._id} p={p} />)}</div></div>}
        </div>
        <Footer />
      </div>
    );
  };

  const CartScreen = () => (
    <div style={{ paddingTop: isMobile ? 56 : 106, maxWidth:900, margin:"0 auto", padding:"80px 20px 60px" }}>
      <h1 style={{ color:C.white, fontSize:28, fontWeight:900, marginBottom:24 }}>Your cart</h1>
      {cartItems.length===0 ? (
        <div style={{ textAlign:"center", padding:80, color:C.gray }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
          <p style={{ marginBottom:24, fontSize:15 }}>Your cart is empty</p>
          <button onClick={() => setScreen("catalog")} style={{ background:C.red, color:"#fff", border:"none", borderRadius:6, padding:"13px 32px", fontSize:14, fontWeight:800, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>View catalogue</button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 360px", gap:24, alignItems:"start" }}>
          <div>
            {cartItems.map(c => (
              <div key={c.id} style={{ display:"flex", gap:16, padding:16, background:C.card, borderRadius:10, border:"1px solid "+C.border, marginBottom:12 }}>
                <div style={{ width:70, height:90, background:"#0a0a0a", borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                  {c.product.Imagen_URL && <img src={c.product.Imagen_URL} alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:C.gray, fontSize:10, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{c.product.Piloto}</div>
                  <div style={{ color:C.white, fontWeight:700, fontSize:14, marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.product.Nombre}</div>
                  <div style={{ color:C.gold, fontWeight:800, fontSize:16 }}>{(parseFloat(c.product.Precio||0)*c.qty).toFixed(2)}€</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  <button onClick={() => removeFromCart(c.id)} style={{ background:"none", border:"none", color:"#f87171", cursor:"pointer", fontSize:20 }}>×</button>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={() => changeQty(c.id,-1)} style={{ width:28, height:28, background:C.dark, border:"1px solid "+C.border, borderRadius:4, color:C.gray, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <span style={{ color:C.white, fontWeight:700, minWidth:20, textAlign:"center" }}>{c.qty}</span>
                    <button onClick={() => changeQty(c.id,1)} style={{ width:28, height:28, background:C.dark, border:"1px solid "+C.border, borderRadius:4, color:C.gray, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:C.card, borderRadius:12, padding:20, border:"1px solid "+C.border, position:isMobile?"static":"sticky", top:120 }}>
            <h3 style={{ color:C.white, fontWeight:800, marginBottom:16, fontSize:16, textTransform:"uppercase", letterSpacing:1 }}>Summary</h3>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}><span style={{ color:C.gray }}>Subtotal ({cartCount} items)</span><span style={{ color:C.white }}>{cartTotal}€</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, fontSize:13 }}><span style={{ color:C.gray }}>Shipping</span><span style={{ color:"#4ade80" }}>To be confirmed</span></div>
            <div style={{ borderTop:"1px solid "+C.border, paddingTop:16, display:"flex", justifyContent:"space-between", marginBottom:20, fontSize:18, fontWeight:900 }}><span style={{ color:C.white }}>Total</span><span style={{ color:C.gold }}>{cartTotal}€</span></div>
            <button onClick={() => setOrderOpen(true)} style={{ width:"100%", background:C.red, color:"#fff", border:"none", borderRadius:8, padding:15, fontSize:15, fontWeight:800, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>Checkout →</button>
            <div style={{ textAlign:"center", marginTop:14, color:"#444", fontSize:10 }}>🔒 Secure payment · 📦 Insured shipping</div>
          </div>
        </div>
      )}
    </div>
  );

  const AdminScreen = () => (
    <div style={{ paddingTop: isMobile ? 56 : 106, maxWidth:1200, margin:"0 auto", padding:"80px 20px 60px" }}>
      <h1 style={{ color:C.white, fontSize:24, fontWeight:900, marginBottom:24, textTransform:"uppercase", letterSpacing:2 }}>Admin Panel</h1>
      {!adminAuth ? (
        <div style={{ maxWidth:400, background:C.card, borderRadius:14, padding:32, border:"1px solid "+C.border }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}><LogoImg size={80} /></div>
          <h3 style={{ color:C.white, textAlign:"center", marginBottom:6, fontWeight:800 }}>Admin Access</h3>
          <p style={{ color:C.gray, textAlign:"center", fontSize:12, marginBottom:20 }}>Internal use only</p>
          <input style={{ ...inp, marginBottom:10 }} type="password" placeholder="Password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"){if(adminPass===ADMIN_PASSWORD){setAdminAuth(true);setAdminError("");}else{setAdminError("Wrong password.");}}}} />
          {adminError && <p style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{adminError}</p>}
          <button style={{ width:"100%", background:C.red, color:"#fff", border:"none", borderRadius:8, padding:13, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", textTransform:"uppercase" }}
            onClick={() => { if(adminPass===ADMIN_PASSWORD){setAdminAuth(true);setAdminError("");}else{setAdminError("Wrong password.");} }}>Sign in</button>
        </div>
      ) : (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            {[["orders","Orders"],["legal","Legal Texts"]].map(([id,label]) => <button key={id} onClick={() => setAdminTab(id)} style={{ background:adminTab===id?C.red:"#1a1a1a", color:"#fff", border:"1px solid "+C.border, borderRadius:8, padding:"9px 20px", fontSize:12, fontWeight:800, cursor:"pointer", textTransform:"uppercase" }}>{label}</button>)}
          </div>
          {adminTab==="orders" && (
            <div>
              <p style={{ color:C.gray, fontSize:13, marginBottom:16 }}>{orders.length} order{orders.length!==1?"s":""}</p>
              {orders.length===0 ? <div style={{ textAlign:"center", padding:60, color:C.gray, background:C.card, borderRadius:12 }}>No orders yet</div> : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:12 }}>
                  {orders.map(order => {
                    const orderProds = order.items.map(c => { const p=products.find(x=>x._id===c.id); return p?p.Nombre+" x"+c.qty:""; }).filter(Boolean);
                    const statusColor = order.status==="paid"?"#4ade80":order.status==="sent"?"#60a5fa":C.red;
                    const statusLabel = order.status==="paid"?"Paid":order.status==="sent"?"Shipped":"Pending";
                    return (
                      <div key={order.id} style={{ background:C.card, borderRadius:12, padding:16, border:"1px solid "+C.border }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontWeight:800, color:C.white }}>{order.nombre}</span><span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, border:"1px solid "+statusColor, color:statusColor }}>{statusLabel}</span></div>
                        <p style={{ fontSize:12, color:C.gray }}>{order.email}</p>
                        {order.tel && <p style={{ fontSize:12, color:C.gray }}>📞 {order.tel}</p>}
                        <p style={{ fontSize:12, color:C.gray }}>📍 {order.address}</p>
                        <div style={{ background:"#0a0a0a", borderRadius:8, padding:"8px 10px", margin:"10px 0" }}>
                          {orderProds.map((p,i) => <div key={i} style={{ fontSize:11, color:"#555", marginBottom:2 }}>• {p}</div>)}
                          <div style={{ fontSize:14, fontWeight:800, color:C.gold, marginTop:6 }}>{order.total}€</div>
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          {order.status==="pending" && <button onClick={() => { const u=orders.map(o=>o.id===order.id?{...o,status:"sent"}:o); setOrders(u); saveOrders(u); }} style={{ flex:2, background:"#1e3a5f", color:"#60a5fa", border:"1px solid #2563eb", borderRadius:6, padding:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>Mark shipped</button>}
                          {order.status==="sent" && <button onClick={() => { const u=orders.map(o=>o.id===order.id?{...o,status:"paid"}:o); setOrders(u); saveOrders(u); }} style={{ flex:2, background:"#14532d", color:"#4ade80", border:"1px solid #16a34a", borderRadius:6, padding:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Paid</button>}
                          <button onClick={() => { const u=orders.filter(o=>o.id!==order.id); setOrders(u); saveOrders(u); }} style={{ flex:1, background:"#1e0000", color:"#f87171", border:"1px solid #7f1d1d", borderRadius:6, padding:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {adminTab==="legal" && (
            <div>
              <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                {[["aviso","Legal Notice"],["privacidad","Privacy"],["cookies","Cookies"],["envios","Shipping"],["devoluciones","Returns"]].map(([k,l]) => <button key={k} onClick={() => setActiveLegal(k)} style={{ background:activeLegal===k?C.red:"#1a1a1a", color:"#fff", border:"1px solid "+C.border, borderRadius:6, padding:"7px 14px", fontSize:11, fontWeight:700, cursor:"pointer" }}>{l}</button>)}
              </div>
              <textarea style={{ ...inp, minHeight:320, resize:"vertical", lineHeight:1.7, fontSize:12 }} value={editingLegal[activeLegal]!==undefined?editingLegal[activeLegal]:legal[activeLegal]} onChange={e => setEditingLegal(prev=>({...prev,[activeLegal]:e.target.value}))} />
              <button onClick={() => { const u={...legal,...editingLegal}; setLegal(u); saveLegal(u); setLegalSaved(true); setTimeout(()=>setLegalSaved(false),2000); }} style={{ marginTop:12, background:legalSaved?"#16a34a":C.red, color:"#fff", border:"none", borderRadius:8, padding:"12px 24px", fontSize:13, fontWeight:800, cursor:"pointer", textTransform:"uppercase" }}>{legalSaved?"✓ Saved":"Save"}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily:"-apple-system, 'Segoe UI', sans-serif", minHeight:"100vh", background:C.dark, color:C.white }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder, textarea::placeholder { color: #444; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; } a { color: inherit; } button { font-family: inherit; }`}</style>
      <Navbar />
      {legalPage && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:300, overflow:"auto" }}>
          <div style={{ maxWidth:680, margin:"0 auto", background:C.dark, minHeight:"100vh", paddingBottom:60 }}>
            <div style={{ background:C.black, padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid "+C.border, position:"sticky", top:0 }}>
              <button onClick={() => setLegalPage(null)} style={{ background:"none", border:"none", color:C.gold, fontSize:26, cursor:"pointer" }}>‹</button>
              <span style={{ color:C.gold, fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{{aviso:"Legal Notice",privacidad:"Privacy",cookies:"Cookies",envios:"Shipping",devoluciones:"Returns"}[legalPage]}</span>
            </div>
            <div style={{ padding:"24px 20px" }}><pre style={{ color:"#aaa", fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"inherit" }}>{legal[legalPage]}</pre></div>
          </div>
        </div>
      )}
      {orderOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setOrderOpen(false)}>
          <div style={{ background:"#141414", borderRadius:"20px 20px 0 0", padding:"0 24px 44px", width:"100%", maxWidth:560, maxHeight:"93vh", overflowY:"auto", borderTop:"1px solid "+C.border }} onClick={e => e.stopPropagation()}>
            <div style={{ width:40, height:3, background:C.border, borderRadius:2, margin:"12px auto 24px" }} />
            <h2 style={{ color:C.red, fontSize:18, fontWeight:900, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Order details</h2>
            <p style={{ color:C.gray, fontSize:12, marginBottom:20 }}>Fill in your details and we will contact you for payment.</p>
            <div style={{ background:"#0a0a0a", borderRadius:10, padding:"10px 14px", marginBottom:20 }}>
              {cartItems.map(c => <div key={c.id} style={{ padding:"8px 0", borderBottom:"1px solid "+C.border, display:"flex", justifyContent:"space-between", fontSize:12 }}><span style={{ color:"#888" }}>{c.product.Nombre} x{c.qty}</span><span style={{ color:C.gold, fontWeight:700 }}>{(parseFloat(c.product.Precio||0)*c.qty).toFixed(2)}€</span></div>)}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, fontSize:16, fontWeight:900 }}><span style={{ color:C.gray }}>Total</span><span style={{ color:C.gold }}>{cartTotal}€</span></div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
              {[["Full name *","text","Your full name","nombre"],["Email *","email","your@email.com","email"],["Phone","tel","+34 600 000 000","tel"],["Shipping address *","text","Street, number, city, postcode","address"]].map(([label,type,ph,key]) => (
                <div key={key}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.gray, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                  <input style={inp} type={type} placeholder={ph} value={orderData[key]} onChange={e => setOrderData(d=>({...d,[key]:e.target.value}))} />
                </div>
              ))}
            </div>
            {orderError && <p style={{ color:"#f87171", fontSize:12, marginBottom:12 }}>{orderError}</p>}
            <button style={{ width:"100%", background:C.red, color:"#fff", border:"none", borderRadius:10, padding:15, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit", marginBottom:10, textTransform:"uppercase", letterSpacing:1 }} onClick={doOrder}>Confirm order</button>
            <button style={{ width:"100%", background:"none", color:C.gray, border:"1px solid "+C.border, borderRadius:10, padding:13, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }} onClick={() => setOrderOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {zoomImg && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.97)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="zoom" style={{ maxWidth:"90vw", maxHeight:"90vh", objectFit:"contain", borderRadius:8 }} />
          <button onClick={() => setZoomImg(null)} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", borderRadius:"50%", width:40, height:40, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
      )}
      {successMsg && <div style={{ position:"fixed", bottom:isMobile?80:24, left:"50%", transform:"translateX(-50%)", background:"#14532d", color:"#86efac", padding:"12px 24px", borderRadius:8, fontSize:14, fontWeight:600, zIndex:500, whiteSpace:"nowrap", boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}>{successMsg}</div>}
      {loading && screen==="home" && <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", color:C.gray, fontSize:14 }}>⏳ Loading collection...</div>}
      {!loading && screen==="home" && <HomeScreen />}
      {screen==="catalog" && <CatalogScreen />}
      {screen==="product" && <ProductScreen />}
      {screen==="cart" && <CartScreen />}
      {screen==="admin" && <AdminScreen />}
      {isMobile && (
        <>
          <div style={{ paddingBottom:70 }} />
          <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.black, borderTop:"1px solid "+C.border, display:"flex", paddingBottom:"env(safe-area-inset-bottom, 16px)", paddingTop:10, zIndex:100 }}>
            {[["home","🏠","Home"],["catalog","🏎","Catalogue"],["cart","🛒","Cart"],["admin","👤","Admin"]].map(([id,icon,label]) => (
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

     
  };
 
