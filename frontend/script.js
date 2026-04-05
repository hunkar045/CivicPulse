// ══════════════════ CIVIC PULSE — script.js ══════════════════
// Change this URL to your deployed backend URL when live!
const API = "https://civicpulse-4u8q.onrender.com/api";

// ── STATE ──────────────────────────────────────────────────
let token = localStorage.getItem("cp_token") || null;
let user  = JSON.parse(localStorage.getItem("cp_user") || "null");
let priority = "medium";
let userLat = 21.1458, userLng = 79.0882; // Nagpur default
let formMapInstance = null, formMarker = null;
let liveMapInstance = null, liveMarkerLayer = null;
let generatedId = "";

// ── CATEGORIES DATA ──────────────────────────────────────────
const CATS = [
  {icon:"💧",name:"Water Supply",count:"342"},
  {icon:"🛣️",name:"Roads & Potholes",count:"218"},
  {icon:"⚡",name:"Electricity",count:"187"},
  {icon:"🗑️",name:"Garbage & Sanitation",count:"156"},
  {icon:"🚰",name:"Sewage & Drainage",count:"134"},
  {icon:"💡",name:"Street Lighting",count:"98"},
  {icon:"🚌",name:"Public Transport",count:"76"},
  {icon:"🌳",name:"Parks & Recreation",count:"65"},
  {icon:"📢",name:"Noise Pollution",count:"54"},
  {icon:"😮‍💨",name:"Air Pollution",count:"43"},
  {icon:"🏗️",name:"Building Violations",count:"38"},
  {icon:"🚦",name:"Traffic Signal",count:"31"},
  {icon:"🏥",name:"Healthcare",count:"28"},
  {icon:"🐕",name:"Stray Animals",count:"22"},
  {icon:"🏛️",name:"Encroachment",count:"19"},
  {icon:"⚠️",name:"Corruption",count:"14"},
];

const STATUS_COLORS = {
  pending:"#ffd166","in-progress":"#00aaff",resolved:"#00e5a0",rejected:"#ff6b6b"
};

// ══════════════════ INIT ══════════════════
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  renderCategories();
  animateCounters();
  initLiveMap();
  loadDashboardStats();
  loadComplaints();
  loadLeaderboard();
});

// ══════════════════ AUTH ══════════════════
function updateAuthUI() {
  const btn = document.getElementById("authBtn");
  if (user) {
    btn.textContent = `👤 ${user.name.split(" ")[0]}`;
    btn.onclick = logoutUser;
  } else {
    btn.textContent = "Login";
    btn.onclick = openAuth;
  }
}

function openAuth() { document.getElementById("authOverlay").classList.add("open"); }
function closeAuth() { document.getElementById("authOverlay").classList.remove("open"); }

function switchAuth(mode) {
  document.getElementById("loginForm").style.display   = mode === "login" ? "block" : "none";
  document.getElementById("registerForm").style.display = mode === "register" ? "block" : "none";
  document.getElementById("loginTab").classList.toggle("active", mode === "login");
  document.getElementById("regTab").classList.toggle("active", mode === "register");
}

async function doLogin() {
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;
  if (!email || !password) return showToast("⚠️", "Enter email & password");
  try {
    const res  = await fetch(`${API}/auth/login`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return showToast("❌", data.message);
    token = data.token; user = data.user;
    localStorage.setItem("cp_token", token);
    localStorage.setItem("cp_user", JSON.stringify(user));
    closeAuth(); updateAuthUI();
    showToast("✅", `Welcome back, ${user.name}!`);
  } catch { showToast("❌", "Cannot connect to server."); }
}

async function doRegister() {
  const name     = document.getElementById("regName").value.trim();
  const phone    = document.getElementById("regPhone").value.trim();
  const email    = document.getElementById("regEmail").value.trim();
  const area     = document.getElementById("regArea").value.trim();
  const password = document.getElementById("regPass").value;
  if (!name || !email || !password) return showToast("⚠️", "Fill required fields");
  try {
    const res  = await fetch(`${API}/auth/register`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name, phone, email, area, password }),
    });
    const data = await res.json();
    if (!res.ok) return showToast("❌", data.message);
    token = data.token; user = data.user;
    localStorage.setItem("cp_token", token);
    localStorage.setItem("cp_user", JSON.stringify(user));
    closeAuth(); updateAuthUI();
    showToast("✅", `Account created! Welcome, ${user.name}`);
  } catch { showToast("❌", "Cannot connect to server."); }
}

function logoutUser() {
  token = null; user = null;
  localStorage.removeItem("cp_token"); localStorage.removeItem("cp_user");
  updateAuthUI(); showToast("👋", "Logged out.");
}

// ══════════════════ CATEGORIES ══════════════════
function renderCategories() {
  const g = document.getElementById("catsGrid");
  g.innerHTML = CATS.map(c => `
    <div class="cat-card" onclick="selectCat('${c.name}')">
      <span class="cat-icon">${c.icon}</span>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${c.count} open</div>
    </div>`).join("");
}

function selectCat(name) {
  document.getElementById("fCat").value = name;
  nav("report");
  showToast("✅", `Category: ${name}`);
}

// ══════════════════ PRIORITY ══════════════════
function setPri(p, el) {
  priority = p;
  document.querySelectorAll(".pri-btn").forEach(b => {
    b.className = "pri-btn";
  });
  el.classList.add("active-" + p);
}
window.setPri = setPri;

// ══════════════════ LOCATION ══════════════════
function detectLocation() {
  const lbl = document.getElementById("locLabel");
  lbl.textContent = "Detecting...";
  navigator.geolocation.getCurrentPosition(pos => {
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;
    lbl.textContent = `✓ ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
    showFormMap(userLat, userLng);
    showToast("📍", "Live location captured!");
  }, () => {
    lbl.textContent = "Detect My Live Location";
    showToast("❌", "Location denied. Enable GPS.");
  });
}
window.detectLocation = detectLocation;

function showFormMap(lat, lng) {
  document.getElementById("formMapWrap").style.display = "block";
  if (!formMapInstance) {
    formMapInstance = L.map("formMap").setView([lat, lng], 15);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:"© OpenStreetMap © CARTO", maxZoom:19,
    }).addTo(formMapInstance);
    setTimeout(() => formMapInstance.invalidateSize(), 300);
  }
  if (formMarker) formMapInstance.removeLayer(formMarker);
  const icon = L.divIcon({
    html:`<div style="width:16px;height:16px;background:#ff6b6b;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px rgba(255,107,107,.6)"></div>`,
    className:"", iconAnchor:[8,8],
  });
  formMarker = L.marker([lat, lng], { icon }).addTo(formMapInstance);
  formMapInstance.setView([lat, lng], 15);
}

// ══════════════════ PHOTOS PREVIEW ══════════════════
function previewFiles(e) {
  const row = document.getElementById("previewRow");
  Array.from(e.target.files).slice(0, 5).forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.createElement("img");
      img.src = ev.target.result;
      img.className = "prev-img";
      row.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}
window.previewFiles = previewFiles;

// ══════════════════ SUBMIT COMPLAINT ══════════════════
async function submitComplaint() {
  if (!token) {
    showToast("⚠️", "Please login to file a complaint");
    openAuth(); return;
  }
  const cat   = document.getElementById("fCat").value;
  const ward  = document.getElementById("fWard").value.trim();
  const title = document.getElementById("fTitle").value.trim();
  const desc  = document.getElementById("fDesc").value.trim();
  if (!cat || !ward || !title || !desc) {
    showToast("⚠️", "Fill all required fields (*)"); return;
  }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  document.getElementById("submitBtnText").style.display = "none";
  document.getElementById("submitSpinner").style.display = "block";

  try {
    const fd = new FormData();
    fd.append("category",    cat);
    fd.append("ward",        ward);
    fd.append("title",       title);
    fd.append("description", desc);
    fd.append("priority",    priority);
    fd.append("address",     document.getElementById("fAddress").value.trim());
    fd.append("lat",         userLat);
    fd.append("lng",         userLng);
    fd.append("isAnonymous", document.getElementById("fAnon").checked);

    const files = document.getElementById("photoInput").files;
    Array.from(files).slice(0, 5).forEach(f => fd.append("photos", f));

    const res  = await fetch(`${API}/complaints`, {
      method:"POST",
      headers:{ Authorization:`Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();

    if (!res.ok) {
      showToast("❌", data.message); return;
    }

    generatedId = data.complaintId;
    document.getElementById("cIdBox").textContent = generatedId;
    document.getElementById("successOverlay").classList.add("open");
    resetForm();
  } catch {
    // Fallback for demo (no backend running)
    generatedId = "CP-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);
    document.getElementById("cIdBox").textContent = generatedId;
    document.getElementById("successOverlay").classList.add("open");
    resetForm();
  } finally {
    btn.disabled = false;
    document.getElementById("submitBtnText").style.display = "inline";
    document.getElementById("submitSpinner").style.display = "none";
  }
}
window.submitComplaint = submitComplaint;

function resetForm() {
  ["fCat","fWard","fTitle","fDesc","fAddress"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("previewRow").innerHTML = "";
  document.getElementById("fAnon").checked = false;
}

function closeSuccess() { document.getElementById("successOverlay").classList.remove("open"); }
window.closeSuccess = closeSuccess;

function copyId() {
  navigator.clipboard.writeText(generatedId)
    .then(() => showToast("📋", "Complaint ID copied!"))
    .catch(() => showToast("❌", "Copy failed"));
}
window.copyId = copyId;

// ══════════════════ LIVE MAP ══════════════════
function initLiveMap() {
  liveMapInstance = L.map("liveMap").setView([21.1458, 79.0882], 13);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:"© OpenStreetMap © CARTO", maxZoom:19,
  }).addTo(liveMapInstance);

  liveMarkerLayer = L.layerGroup().addTo(liveMapInstance);

  // User location marker
  const userIcon = L.divIcon({
    html:`<div style="width:18px;height:18px;background:#00e5a0;border-radius:50%;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 12px rgba(0,229,160,.6)"></div>`,
    className:"", iconAnchor:[9,9],
  });
  L.marker([21.1458, 79.0882], { icon:userIcon })
    .addTo(liveMapInstance).bindPopup("📍 You are here");

  loadMapPins("all");
}

async function loadMapPins(filter) {
  if (!liveMapInstance) return;
  liveMarkerLayer.clearLayers();

  // Demo pins (replace with real API call when backend is running)
  const demoPins = [
    {lat:21.152,lng:79.088,title:"No water for 4 days",category:"Water Supply",status:"pending",priority:"high"},
    {lat:21.138,lng:79.095,title:"Pothole on MG Road",category:"Roads & Potholes",status:"in-progress",priority:"medium"},
    {lat:21.161,lng:79.075,title:"Power outage resolved",category:"Electricity",status:"resolved",priority:"low"},
    {lat:21.143,lng:79.105,title:"Garbage not collected",category:"Garbage & Sanitation",status:"pending",priority:"high"},
    {lat:21.158,lng:79.098,title:"Street light dead",category:"Street Lighting",status:"in-progress",priority:"medium"},
    {lat:21.132,lng:79.081,title:"Sewage overflow near school",category:"Sewage & Drainage",status:"pending",priority:"high"},
    {lat:21.148,lng:79.071,title:"Park bench broken",category:"Parks & Recreation",status:"resolved",priority:"low"},
    {lat:21.165,lng:79.091,title:"Road cave-in",category:"Roads & Potholes",status:"pending",priority:"high"},
  ];

  let pins = demoPins;
  if (filter !== "all") pins = demoPins.filter(p => p.status === filter);

  // Try real API
  try {
    const res = await fetch(`${API}/complaints/map`);
    if (res.ok) pins = await res.json();
    if (filter !== "all") pins = pins.filter(p => p.status === filter);
  } catch {}

  pins.forEach(p => {
    const lat = p.lat || p.location?.lat;
    const lng = p.lng || p.location?.lng;
    if (!lat || !lng) return;

    const color = p.priority === "high" ? "#ff6b6b" : STATUS_COLORS[p.status] || "#ffd166";
    const icon = L.divIcon({
      html:`<div style="width:13px;height:13px;background:${color};border-radius:50%;border:2px solid rgba(0,0,0,.4);box-shadow:0 0 7px ${color}88"></div>`,
      className:"", iconAnchor:[6,6],
    });
    L.marker([lat, lng], { icon }).addTo(liveMarkerLayer)
      .bindPopup(`<b>${p.title||"Complaint"}</b><br><small>${p.category} — ${p.status}</small>`);
  });
}

function filterMap(f, el) {
  document.querySelectorAll(".mf-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  loadMapPins(f);
}
window.filterMap = filterMap;

// ══════════════════ DASHBOARD ══════════════════
async function loadDashboardStats() {
  try {
    const res = await fetch(`${API}/complaints/stats`);
    if (!res.ok) return setDemoStats();
    const d = await res.json();
    document.getElementById("dTotal").textContent    = d.pending + d.inProgress;
    document.getElementById("dResolved").textContent = d.resolved;
    document.getElementById("dProgress").textContent = d.inProgress;
    document.getElementById("dHigh").textContent     = d.highPriority;
    renderCharts(d.categoryStats);
  } catch { setDemoStats(); }
}

function setDemoStats() {
  document.getElementById("dTotal").textContent    = "1,247";
  document.getElementById("dResolved").textContent = "3,847";
  document.getElementById("dProgress").textContent = "412";
  document.getElementById("dHigh").textContent     = "89";
  renderCharts([
    {_id:"Water Supply",count:342},{_id:"Roads",count:218},
    {_id:"Electricity",count:187},{_id:"Garbage",count:156},
    {_id:"Sewage",count:134},{_id:"Lights",count:98},
  ]);
}

async function loadComplaints() {
  try {
    const res = await fetch(`${API}/complaints?limit=10`);
    if (!res.ok) return renderDemoComplaints();
    const data = await res.json();
    renderComplaints(data.complaints);
  } catch { renderDemoComplaints(); }
}

function renderComplaints(list) {
  const b = document.getElementById("tblBody");
  if (!list || list.length === 0) { b.innerHTML = `<div class="tbl-empty">No complaints yet.</div>`; return; }
  b.innerHTML = list.map(c => `
    <div class="tbl-row">
      <span style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.title}</span>
      <span style="color:var(--muted);font-size:.8rem">${c.category}</span>
      <span><span class="sbadge s-${c.status}">${c.status === "in-progress" ? "In Progress" : capitalize(c.status)}</span></span>
      <span style="color:${c.priority==="high"?"#ff6b6b":c.priority==="medium"?"#ffd166":"#00e5a0"}">${capitalize(c.priority)}</span>
      <span style="color:var(--muted)">${formatDate(c.createdAt)}</span>
    </div>`).join("");
}

function renderDemoComplaints() {
  const demo = [
    {title:"No water for 4 days",category:"Water Supply",status:"in-progress",priority:"high",createdAt:"2024-12-12"},
    {title:"Giant pothole on Ring Road",category:"Roads & Potholes",status:"pending",priority:"medium",createdAt:"2024-12-11"},
    {title:"Street light dead for 2 weeks",category:"Street Lighting",status:"resolved",priority:"low",createdAt:"2024-12-10"},
    {title:"Garbage pile for 5 days",category:"Garbage & Sanitation",status:"pending",priority:"medium",createdAt:"2024-12-10"},
    {title:"Sewage overflow near school",category:"Sewage & Drainage",status:"in-progress",priority:"high",createdAt:"2024-12-09"},
  ];
  renderComplaints(demo);
}

function renderCharts(stats) {
  const max = stats?.[0]?.count || 342;
  const b = document.getElementById("chartBars");
  b.innerHTML = (stats || []).map(s => {
    const pct = Math.round(((s.count || s.val) / max) * 100);
    const colors = ["#0af","#ffd166","#ffd166","#ff6b6b","#00e5a0","#0af","#ff6b6b","#00e5a0"];
    const color = colors[stats.indexOf(s) % colors.length];
    return `
      <div class="cbar">
        <div class="cbar-label">${(s._id||s.label||"").slice(0,10)}</div>
        <div class="cbar-track"><div class="cbar-fill" style="width:0;background:${color}" data-pct="${pct}"></div></div>
        <div class="cbar-val">${s.count || s.val}</div>
      </div>`;
  }).join("");
  setTimeout(() => {
    document.querySelectorAll(".cbar-fill").forEach(el => {
      el.style.width = el.dataset.pct + "%";
    });
  }, 300);
}

async function loadLeaderboard() {
  try {
    const res = await fetch(`${API}/auth/leaderboard`);
    if (!res.ok) return renderDemoLeaderboard();
    const data = await res.json();
    renderLeaderboard(data);
  } catch { renderDemoLeaderboard(); }
}

function renderLeaderboard(list) {
  const b = document.getElementById("leaderboardList");
  const rc = ["gold","silver","bronze","","","","","","",""];
  const emojis = ["👩","👨","👩","👨","👩"];
  b.innerHTML = (list||[]).map((l,i) => `
    <div class="lb-row">
      <div class="lb-rank ${rc[i]}">#${i+1}</div>
      <div class="lb-ava">${emojis[i%emojis.length]}</div>
      <div class="lb-inf">
        <div class="lb-name">${l.name}</div>
        <div class="lb-area">${l.area||"Nagpur"}</div>
      </div>
      <div class="lb-pts">${l.points} pts</div>
    </div>`).join("");
}

function renderDemoLeaderboard() {
  renderLeaderboard([
    {name:"Priya Sharma",area:"Dharampeth, Nagpur",points:412},
    {name:"Rajan Verma",area:"Sitabuldi, Nagpur",points:387},
    {name:"Meena Joshi",area:"Civil Lines, Nagpur",points:356},
    {name:"Arjun Patil",area:"Gandhibagh, Nagpur",points:298},
    {name:"Sunita Rao",area:"Sadar, Nagpur",points:271},
  ]);
}

// ══════════════════ TRACK ══════════════════
async function trackComplaint() {
  const id = document.getElementById("trackInput").value.trim();
  if (!id) return showToast("⚠️", "Enter a Complaint ID");

  const result = document.getElementById("trackResult");
  result.innerHTML = `<div style="text-align:center;color:var(--muted);padding:1rem">Searching...</div>`;
  result.style.display = "block";

  try {
    const res  = await fetch(`${API}/complaints/track/${id}`);
    if (!res.ok) throw new Error("Not found");
    const c = await res.json();
    renderTrackResult(c);
  } catch {
    // Demo fallback
    renderTrackResult({
      complaintId:id,
      title:"Road pothole near bus stop",
      category:"Roads & Potholes",
      status:"in-progress",
      timeline:[
        {title:"Complaint Filed",description:"Your complaint is received.",date:"2024-12-12T10:42:00Z",done:true},
        {title:"Verified by Officer",description:"NMC officer verified the issue.",date:"2024-12-12T14:15:00Z",done:true},
        {title:"Work Order Issued",description:"Repair work order raised.",date:"2024-12-13T09:00:00Z",done:true},
        {title:"Repair Team Dispatched",description:"Team en route.",date:"2024-12-14T08:30:00Z",done:false},
        {title:"Resolved & Closed",description:"Estimated completion.",date:"2024-12-16T00:00:00Z",done:false},
      ]
    });
  }
}
window.trackComplaint = trackComplaint;

function renderTrackResult(c) {
  const result = document.getElementById("trackResult");
  const tl = (c.timeline||[]).map((t,i,arr) => {
    const done = t.done !== undefined ? t.done : true;
    const color = done ? "#00e5a0" : "#3a3f55";
    return `
      <div class="tl-item">
        <div style="position:relative">
          <div class="tl-dot" style="background:${done?"#00e5a0":"var(--bg3)"};border:2px solid ${done?"#00e5a0":"var(--border2)"}"></div>
          ${i<arr.length-1?`<div class="tl-line" style="background:${done?"var(--accent)":"var(--border2)"}"></div>`:""}
        </div>
        <div>
          <div class="tl-ttl" style="color:${done?"var(--text)":"var(--muted)"}">${t.title}</div>
          <div class="tl-time">${t.description||""} · ${formatDate(t.date)}</div>
        </div>
      </div>`;
  }).join("");

  result.innerHTML = `
    <div class="track-result-box">
      <div class="track-meta">
        <div>
          <div class="track-ttl">${c.title}</div>
          <div class="track-sub">${c.category} · ID: ${c.complaintId}</div>
        </div>
        <span class="sbadge s-${c.status}">${c.status==="in-progress"?"In Progress":capitalize(c.status||"pending")}</span>
      </div>
    </div>
    <div class="timeline">${tl}</div>
    <div style="margin-top:1.5rem">
      <div style="font-weight:600;font-size:.9rem">Rate this response</div>
      <div class="stars" id="starRow">
        ${[1,2,3,4,5].map(n=>`<span class="star" onclick="rateStar(${n},'${c._id||''}')">★</span>`).join("")}
      </div>
    </div>`;
}

function rateStar(n, id) {
  document.querySelectorAll(".star").forEach((s,i) => s.classList.toggle("lit", i < n));
  if (token && id) {
    fetch(`${API}/complaints/${id}/rate`, {
      method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
      body:JSON.stringify({ rating:n }),
    });
  }
  showToast("⭐", `Rated ${n} star${n > 1 ? "s" : ""}!`);
}
window.rateStar = rateStar;

// ══════════════════ TABS ══════════════════
function switchTab(name, el) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}
window.switchTab = switchTab;

// ══════════════════ COUNTERS ══════════════════
function animateCounters() {
  document.querySelectorAll(".hstat-num").forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toLocaleString() + "+";
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

// ══════════════════ NOTIFY FAB ══════════════════
function toggleNotif() {
  showToast("🔔", "3 new updates on your complaints!");
  document.getElementById("fabBadge").style.display = "none";
}
window.toggleNotif = toggleNotif;

// ══════════════════ NAV ══════════════════
function nav(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:"smooth" });
  document.getElementById("navLinks").classList.remove("open");
}
window.nav = nav;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.switchAuth = switchAuth;
window.doLogin = doLogin;
window.doRegister = doRegister;

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}
window.toggleMenu = toggleMenu;

// ══════════════════ TOAST ══════════════════
function showToast(icon, msg) {
  const t = document.getElementById("toast");
  document.getElementById("toastIcon").textContent = icon;
  document.getElementById("toastMsg").textContent  = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

// ══════════════════ HELPERS ══════════════════
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}
