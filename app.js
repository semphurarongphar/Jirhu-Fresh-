const WHATSAPP_NUMBER = "916002810234"; // India country code + shop number
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
let cart = {};
let activeCategory = "All";
let deferredInstallPrompt = null;

const $ = id => document.getElementById(id);
const categories = ["All", ...new Set(PRODUCTS.map(p=>p.category))];

function renderCategories(){
  $("categories").innerHTML = categories.map(c=>`<button class="category-btn ${c===activeCategory?"active":""}" data-category="${c}">${c}</button>`).join("");
  document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;renderCategories();renderProducts()}));
}
function renderProducts(){
  const q=$("searchInput").value.trim().toLowerCase();
  const list=PRODUCTS.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));
  $("productCount").textContent=`${list.length} products`;
  $("productGrid").innerHTML=list.length?list.map(p=>`<article class="product-card">
    <div class="product-visual" aria-hidden="true">${p.emoji}</div>
    <div class="product-info"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p>
    <div class="product-action"><span class="price">${money(p.price)} <small>/ ${escapeHtml(p.unit)}</small></span><button class="add-btn" data-add="${p.id}">+ Add</button></div></div>
  </article>`).join(""):`<div class="empty">No products found. Try another search.</div>`;
  document.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.add)));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function addToCart(id){cart[id]=(cart[id]||0)+1;renderCart();$("cartFab").animate?.([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:220});}
function changeQty(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];renderCart();}
function cartEntries(){return Object.entries(cart).map(([id,qty])=>({product:PRODUCTS.find(p=>p.id===id),qty})).filter(x=>x.product);}
function subtotal(){return cartEntries().reduce((sum,x)=>sum+x.product.price*x.qty,0);}
function renderCart(){
  const entries=cartEntries(),count=entries.reduce((s,x)=>s+x.qty,0);
  $("cartCount").textContent=count;$("checkoutBtn").disabled=!count;
  $("cartSubtotal").textContent=money(subtotal());$("checkoutSubtotal").textContent=money(subtotal());
  $("cartItems").innerHTML=entries.length?entries.map(({product:p,qty})=>`<div class="cart-line">
    <div class="cart-emoji">${p.emoji}</div><div><strong>${escapeHtml(p.name)}</strong><small>${money(p.price)} / ${escapeHtml(p.unit)}</small>
    <div class="qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease ${p.name}">−</button><span>${qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase ${p.name}">+</button></div></div>
    <span class="line-price">${money(p.price*qty)}</span></div>`).join(""):`<div class="empty">Your cart is empty.<br>Add some fresh products to get started.</div>`;
  document.querySelectorAll("[data-qty]").forEach(btn=>btn.addEventListener("click",()=>changeQty(btn.dataset.qty,Number(btn.dataset.delta))));
}
function openCart(){ $("cartPanel").hidden=false;$("cartBackdrop").hidden=false; }
function closeCart(){ $("cartPanel").hidden=true;$("cartBackdrop").hidden=true; }
function openCheckout(){if(!cartEntries().length)return;closeCart();$("checkoutModal").hidden=false;$("checkoutBackdrop").hidden=false;updateAddressField();}
function closeCheckout(){ $("checkoutModal").hidden=true;$("checkoutBackdrop").hidden=true; }
function updateAddressField(){
  const delivery=document.querySelector('input[name="fulfilment"]:checked').value==="Home delivery";
  $("addressField").hidden=!delivery;
  $("checkoutForm").elements.address.required=delivery;
}
$("searchInput").addEventListener("input",renderProducts);
$("cartFab").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("cartBackdrop").addEventListener("click",closeCart);
$("checkoutBtn").addEventListener("click",openCheckout);
$("closeCheckout").addEventListener("click",closeCheckout);
$("checkoutBackdrop").addEventListener("click",closeCheckout);
document.querySelectorAll('input[name="fulfilment"]').forEach(r=>r.addEventListener("change",updateAddressField));
$("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cartEntries().length)return;
  const form=new FormData(e.currentTarget);
  const name=String(form.get("customerName")).trim();
  const phone=String(form.get("customerPhone")).trim();
  const fulfilment=form.get("fulfilment");
  const address=String(form.get("address")||"").trim();
  const notes=String(form.get("notes")||"").trim();
  if(!name||!phone||(fulfilment==="Home delivery"&&!address)){alert("Please complete the required details.");return;}
  const lines=cartEntries().map(({product:p,qty})=>`• ${p.name} — ${qty} × ${p.unit} = ${money(p.price*qty)}`);
  const message=[
    "Hello JIRHU fresh! I would like to place an order.",
    "",
    `Customer: ${name}`,
    `Customer phone: ${phone}`,
    `Order type: ${fulfilment}`,
    ...(fulfilment==="Home delivery"?[`Delivery address: ${address}`]:[]),
    "",
    "ORDER ITEMS",
    ...lines,
    "",
    `Cart subtotal: ${money(subtotal())}`,
    "Delivery: Free initially (please confirm)",
    ...(notes?[`Instructions: ${notes}`]:[]),
    "",
    "Please confirm product availability and final amount. Thank you!"
  ].join("\n");
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener,noreferrer");
});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installBtn").hidden=false;});
$("installBtn").addEventListener("click",async()=>{
  if(!deferredInstallPrompt){alert("To install: open Chrome menu ⋮ and choose Install app or Add to Home screen.");return;}
  deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$("installBtn").hidden=true;
});
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.warn("Service worker registration failed",err)));
}
renderCategories();renderProducts();renderCart();
