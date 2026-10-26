/* WomenBiz — sahifa mantiqi */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const som = (n) => Math.round(n).toLocaleString("ru-RU").replace(/ /g, " ") + " so'm";
  const makerOf = (id) => MAKERS.find((m) => m.id === id);
  const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || "";
  /* surat; yuklanmasa SVG illyustratsiyaga qaytadi */
  window.__artFallback = (img) => { const id = +img.dataset.pid; const p = PRODUCTS.find((x) => x.id === id); img.outerHTML = productArt(p); };
  const pic = (p, w = 800, alt = "") => p.image
    ? `<img src="${p.image.replace(/w=\d+/, "w=" + w)}" alt="${alt}" loading="lazy" decoding="async" data-pid="${p.id}" onerror="__artFallback(this)">`
    : productArt(p);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* xavfsiz localStorage */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("womenbiz:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("womenbiz:" + k, JSON.stringify(v)); } catch {} }
  };

  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove("show"), 2600);
  };

  /* ---------- Header ---------- */
  const burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Hero ---------- */
  heroRosette($("#heroRosette"));
  const countUp = (el, to) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  countUp($("#statMakers"), 340);
  countUp($("#statItems"), 2150);

  /* ---------- Katalog ---------- */
  let state = { cat: "all", q: "", sort: "popular" };
  const chips = $("#chips");
  chips.innerHTML = CATEGORIES.map((c) => {
    const n = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === c.id).length;
    return `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="${c.id === "all"}">${c.name}<small>${n}</small></button>`;
  }).join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.cat = b.dataset.cat;
    $$(".chip", chips).forEach((c) => c.setAttribute("aria-selected", c === b));
    renderGrid();
  });
  let qTimer;
  $("#search").addEventListener("input", (e) => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); renderGrid(); }, 150); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

  function cardHTML(p) {
    const m = makerOf(p.maker);
    const badge = p.added <= 4 ? `<span class="card__badge card__badge--new">Yangi</span>` : p.pop >= 95 ? `<span class="card__badge">Ko'p sotilgan</span>` : "";
    return `<button class="card" data-id="${p.id}" aria-label="${esc(p.title)}, ${som(p.price)}">
      <div class="card__art">${pic(p, 600)}${badge}</div>
      <div class="card__body">
        <div class="card__title">${esc(p.title)}</div>
        <div class="card__maker">${esc(m.name)}, ${esc(m.city)}</div>
        <div class="card__row"><span class="card__price">${som(p.price)}</span><span class="card__rating"><b>★</b> ${p.rating} (${p.reviews})</span></div>
      </div>
    </button>`;
  }

  function renderGrid() {
    let list = PRODUCTS.filter((p) => state.cat === "all" || p.cat === state.cat);
    if (state.q) list = list.filter((p) => (p.title + " " + p.desc + " " + makerOf(p.maker).name + " " + catName(p.cat)).toLowerCase().includes(state.q));
    const sorters = { popular: (a, b) => b.pop - a.pop, cheap: (a, b) => a.price - b.price, expensive: (a, b) => b.price - a.price, new: (a, b) => a.added - b.added };
    list.sort(sorters[state.sort]);
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
  }
  renderGrid();
  $("#grid").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openProduct(+c.dataset.id); });

  /* ---------- Mahsulot oynasi ---------- */
  const modal = $("#productModal");
  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id), m = makerOf(p.maker);
    let qty = 1;
    $("#pmBody").innerHTML = `
      <div class="pm__art">${pic(p, 1000, esc(p.title))}</div>
      <div class="pm__info">
        <span class="pm__cat">${catName(p.cat)}</span>
        <h2 id="pmTitle">${esc(p.title)}</h2>
        <div class="pm__maker">Usta: <b>${esc(m.name)}</b>, ${esc(m.city)} · ★ ${p.rating}, ${p.reviews} ta sharh</div>
        <div class="pm__price">${som(p.price)}</div>
        <p class="pm__desc">${esc(p.desc)}</p>
        <dl>
          <div><dt>O'lchami</dt><dd>${esc(p.size)}</dd></div>
          <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
          <div><dt>Tayyorlash</dt><dd>${esc(p.time)}</dd></div>
        </dl>
        <div class="pm__buy">
          <div class="qty" aria-label="Soni"><button type="button" data-q="-1" aria-label="Kamaytirish">−</button><span id="pmQty">1</span><button type="button" data-q="1" aria-label="Ko'paytirish">+</button></div>
          <button class="btn btn--primary" id="pmAdd">Savatga qo'shish</button>
        </div>
      </div>`;
    $$("[data-q]", modal).forEach((b) => b.addEventListener("click", () => { qty = Math.max(1, Math.min(20, qty + +b.dataset.q)); $("#pmQty").textContent = qty; }));
    $("#pmAdd").addEventListener("click", () => { addToCart(p.id, qty); modal.close(); toast(`"${p.title}" savatga qo'shildi`); });
    modal.showModal();
  }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });

  /* ---------- Savat ---------- */
  let cart = store.get("cart", []);
  const drawer = $("#drawer"), back = $("#drawerBack");
  let checkoutMode = false;

  function saveCart() { store.set("cart", cart); updateCount(); }
  function updateCount() {
    const n = cart.reduce((s, l) => s + l.qty, 0);
    const el = $("#cartCount");
    el.textContent = n;
    const btn = $("#cartOpen");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  }
  function addToCart(id, qty = 1) {
    const l = cart.find((x) => x.id === id);
    if (l) l.qty = Math.min(20, l.qty + qty); else cart.push({ id, qty });
    saveCart();
  }
  const subtotal = () => cart.reduce((s, l) => s + PRODUCTS.find((p) => p.id === l.id).price * l.qty, 0);
  const deliveryFee = (sub) => (sub >= 500000 || sub === 0 ? 0 : 25000);

  function renderCart() {
    const body = $("#cartBody"), foot = $("#cartFoot");
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><p>Savat hozircha bo'sh. Katalogdan yoqqan buyumni tanlang.</p><a href="#katalog" class="btn btn--primary" data-closecart>Katalogga o'tish</a></div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = cart.map((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id), m = makerOf(p.maker);
      return `<div class="line">
        <div class="line__art">${pic(p, 160)}</div>
        <div><div class="line__title">${esc(p.title)}</div><div class="line__meta">${esc(m.name)}</div>
          <div class="qty" style="margin-top:6px"><button data-dec="${p.id}" aria-label="Kamaytirish">−</button><span>${l.qty}</span><button data-inc="${p.id}" aria-label="Ko'paytirish">+</button></div></div>
        <div class="line__right"><b>${som(p.price * l.qty)}</b><button class="line__remove" data-rm="${p.id}">Olib tashlash</button></div>
      </div>`;
    }).join("");
    const sub = subtotal(), fee = deliveryFee(sub);
    const sum = `<div class="sum"><div><span>Buyumlar</span><span>${som(sub)}</span></div><div><span>Yetkazib berish</span><span>${fee ? som(fee) : "Bepul"}</span></div><div><span>Jami</span><span>${som(sub + fee)}</span></div></div>`;
    if (!checkoutMode) {
      foot.innerHTML = sum + (fee ? `<p class="note" style="margin:0 0 12px">500 000 so'mdan ortiq buyurtmada yetkazib berish bepul.</p>` : "") + `<button class="btn btn--primary" id="toCheckout">Rasmiylashtirish</button>`;
    } else {
      foot.innerHTML = sum + `<form class="checkout" id="checkout" novalidate>
        <label>Ism<input name="name" required autocomplete="name"></label>
        <label>Telefon<input name="phone" required inputmode="tel" autocomplete="tel" placeholder="+998 __ ___ __ __"></label>
        <label>Manzil<input name="address" required autocomplete="street-address" placeholder="Shahar, ko'cha, uy"></label>
        <label>To'lov usuli<select name="pay"><option>Click</option><option>Payme</option><option>Uzcard / Humo karta</option><option>Yetkazilganda naqd</option></select></label>
        <p class="form-msg" id="coMsg" role="status"></p>
        <button class="btn btn--primary" type="submit">Buyurtma berish</button>
      </form>`;
    }
  }

  function openCart() {
    checkoutMode = false; renderCart();
    back.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    setTimeout(() => $("#cartClose").focus(), 50);
  }
  function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); back.hidden = true; }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  back.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });

  drawer.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-closecart]")) return closeCart();
    const inc = t.dataset.inc, dec = t.dataset.dec, rm = t.dataset.rm;
    if (inc) { cart.find((l) => l.id == inc).qty = Math.min(20, cart.find((l) => l.id == inc).qty + 1); }
    else if (dec) { const l = cart.find((x) => x.id == dec); l.qty--; if (l.qty < 1) cart = cart.filter((x) => x !== l); }
    else if (rm) { cart = cart.filter((x) => x.id != rm); }
    else if (t.id === "toCheckout") { checkoutMode = true; renderCart(); $("#checkout input").focus(); return; }
    else return;
    saveCart(); renderCart();
  });

  drawer.addEventListener("submit", (e) => {
    if (e.target.id !== "checkout") return;
    e.preventDefault();
    const f = e.target;
    if (!validate(f, $("#coMsg"))) return;
    const order = { no: "MH-" + String(Date.now()).slice(-6), items: cart, total: subtotal() + deliveryFee(subtotal()), ...Object.fromEntries(new FormData(f)), at: new Date().toISOString() };
    const orders = store.get("orders", []); orders.push(order); store.set("orders", orders);
    cart = []; saveCart();
    $("#cartFoot").innerHTML = "";
    $("#cartBody").innerHTML = `<div class="done"><div class="done__icon">✓</div><h3>Buyurtma qabul qilindi</h3>
      <p>Buyurtma raqami: <b>${order.no}</b>. Usta 30 daqiqa ichida ${esc(order.phone)} raqamiga qo'ng'iroq qilib, yetkazish vaqtini kelishadi.</p>
      <button class="btn btn--ghost" data-closecart style="margin-top:20px">Xaridni davom ettirish</button></div>`;
  });

  /* ---------- Forma tekshiruvi ---------- */
  function validate(form, msgEl) {
    let ok = true;
    $$("[required]", form).forEach((el) => {
      let bad = !el.value.trim();
      if (!bad && el.name === "phone") bad = el.value.replace(/\D/g, "").length < 9;
      el.classList.toggle("invalid", bad);
      el.setAttribute("aria-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      msgEl.className = "form-msg err";
      msgEl.textContent = "Belgilangan maydonlarni to'ldiring. Telefon raqam kamida 9 ta raqamdan iborat bo'lsin.";
      $(".invalid", form)?.focus();
    }
    return ok;
  }
  document.addEventListener("input", (e) => { if (e.target.classList.contains("invalid") && e.target.value.trim()) { e.target.classList.remove("invalid"); e.target.removeAttribute("aria-invalid"); } });

  /* ---------- Ustalar ---------- */
  $("#makers").innerHTML = MAKERS.slice(0, 4).map((m) => `
    <article class="maker">
      <div class="maker__ava" style="background:${m.color}" aria-hidden="true">${m.name[0]}</div>
      <h3>${esc(m.name)}</h3>
      <div class="maker__meta">${esc(m.city)} · ${esc(m.craft)}</div>
      <p>${esc(m.bio)}</p>
      <div class="maker__stats"><span><b>${m.sales}</b>sotuv</span><span><b>★ ${m.rating}</b>reyting</span><span><b>${m.since}</b>yildan beri</span></div>
    </article>`).join("");

  /* ---------- Moliya: tablar ---------- */
  const tabs = $$(".tab");
  function selectTab(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(n); n.focus();
    });
  });

  /* Kreditlar */
  $("#loanOffers").innerHTML = LOANS.map((l, i) => `
    <article class="offer">
      <h3>${esc(l.title)}</h3>
      <div class="offer__rate">${l.rate}%<small>yillik</small></div>
      <div class="offer__org">${esc(l.org)} · ${som(l.max)} gacha · ${l.term} oygacha</div>
      <ul>${l.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="offer__foot">
        <button class="btn btn--primary btn--small" data-apply-loan="${i}">Ariza berish</button>
        <button class="use" data-use-loan="${i}">Kalkulyatorda hisoblash</button>
      </div>
    </article>`).join("");

  const amount = $("#amount"), term = $("#term"), rate = $("#rate");
  function calc() {
    const P = +amount.value, n = +term.value, r = +rate.value / 1200;
    const m = r ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
    $("#amountOut").textContent = som(P);
    $("#termOut").textContent = n + " oy";
    $("#rateOut").textContent = rate.value + "%";
    $("#monthly").textContent = som(m);
    $("#total").textContent = som(m * n);
    $("#overpay").textContent = som(m * n - P);
  }
  [amount, term, rate].forEach((el) => el.addEventListener("input", calc));
  calc();

  $("#loanOffers").addEventListener("click", (e) => {
    const use = e.target.dataset.useLoan, ap = e.target.dataset.applyLoan;
    if (use !== undefined) {
      const l = LOANS[use];
      rate.value = l.rate;
      amount.max = l.max; if (+amount.value > l.max) amount.value = l.max;
      term.max = l.term; if (+term.value > l.term) term.value = l.term;
      calc();
      $("#calc").scrollIntoView({ behavior: "smooth", block: "center" });
      toast(`${l.title}: ${l.rate}% stavka qo'yildi`);
    }
    if (ap !== undefined) goApply(`Kredit: ${LOANS[ap].title}`);
  });

  /* Darslar */
  const enrolled = store.get("courses", []);
  function renderCourses() {
    $("#courses").innerHTML = COURSES.map((c, i) => {
      const done = enrolled.includes(i);
      const seats = c.seats - (done ? 1 : 0);
      return `<li class="course">
        <div class="course__date"><b>${c.day}</b><span>${c.month}</span></div>
        <div><h3>${esc(c.title)}</h3><p>${esc(c.who)} · ${esc(c.hours)}</p>
          <div class="course__seats ${seats <= 3 ? "low" : ""}">${seats} ta joy qoldi</div></div>
        <button class="btn ${done ? "btn--ghost" : "btn--primary"} btn--small" data-course="${i}" ${done ? "disabled" : ""}>${done ? "Yozildingiz" : "Bepul yozilish"}</button>
      </li>`;
    }).join("");
  }
  renderCourses();
  $("#courses").addEventListener("click", (e) => {
    const i = e.target.dataset.course;
    if (i === undefined) return;
    enrolled.push(+i); store.set("courses", enrolled); renderCourses();
    toast(`"${COURSES[i].title}" darsiga yozildingiz. Eslatma SMS orqali keladi.`);
  });

  /* Grantlar */
  const daysLeft = (d) => Math.ceil((new Date(d + "T23:59:59") - new Date()) / 864e5);
  const fmtDate = (d) => { const [y, m, dd] = d.split("-"); const months = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentyabr","oktyabr","noyabr","dekabr"]; return `${+dd}-${months[+m - 1]}, ${y}`; };
  $("#grants").innerHTML = GRANTS.map((g, i) => {
    const left = daysLeft(g.deadline);
    const dl = left < 0 ? "Qabul yakunlangan" : `Muddat: ${fmtDate(g.deadline)} (${left} kun qoldi)`;
    return `<li class="grant">
      <h3>${esc(g.title)}</h3>
      <div class="grant__sum">${(g.sum / 1e6).toLocaleString("ru-RU")} mln<small>so'mgacha</small></div>
      <p>${esc(g.text)}</p>
      <div class="grant__foot"><span class="deadline ${left >= 0 && left <= 30 ? "soon" : ""}">${dl}<br><small style="font-weight:500;color:var(--muted)">${esc(g.from)}</small></span>
        <button class="btn btn--primary btn--small" data-grant="${i}" ${left < 0 ? "disabled" : ""}>Grantga ariza</button></div>
    </li>`;
  }).join("");
  $("#grants").addEventListener("click", (e) => { const i = e.target.dataset.grant; if (i !== undefined) goApply(`Grant: ${GRANTS[i].title}`); });

  function goApply(note) {
    const f = $("#apply");
    f.querySelector("[name=needFinance]").checked = true;
    const about = f.querySelector("[name=about]");
    if (!about.value.includes(note)) about.value = (about.value ? about.value + "\n" : "") + note;
    $("#sotuvchi").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => f.querySelector("[name=name]").focus({ preventScroll: true }), 600);
  }

  /* ---------- Mentorlar ---------- */
  const avatar = (m) => `<svg viewBox="0 0 96 96" aria-hidden="true"><rect width="96" height="96" fill="${m.color}"/>
    <circle cx="48" cy="40" r="17" fill="#f3d9c4"/><path d="M28 38 q0 -26 20 -26 q20 0 20 26 q-4 -12 -20 -14 q-16 2 -20 14z" fill="#2b1d18"/>
    <path d="M30 34 q-8 30 4 46 M66 34 q8 30 -4 46" stroke="#9b1d3a" stroke-width="5" fill="none" opacity=".0"/>
    <path d="M16 96 q4 -32 32 -32 q28 0 32 32z" fill="#1a2452"/><path d="M26 30 q22 -24 44 0 q0 -10 -22 -14 q-22 4 -22 14z" fill="#9b1d3a"/></svg>`;
  $("#mentors").innerHTML = MENTORS.map((m) => `
    <article class="mentor">
      <div class="mentor__ava">${avatar(m)}</div>
      <div><div class="mentor__role">${esc(m.role)}</div><h3>${esc(m.name)}</h3><p>${esc(m.text)}</p>
        <ul>${m.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
      <div class="mentor__exp"><span><b>${m.years} yil</b>tajriba</span><span><b>${m.clients}+</b>tadbirkor ayolga yordam bergan</span>
        <button class="btn btn--saffron btn--small" style="margin-left:auto" data-book="${m.id}">Yozilish</button></div>
    </article>`).join("");
  $("#bMentor").innerHTML = MENTORS.map((m) => `<option value="${m.id}">${esc(m.role)} — ${esc(m.name)}</option>`).join("");
  $("#mentors").addEventListener("click", (e) => {
    const id = e.target.dataset.book;
    if (!id) return;
    $("#bMentor").value = id; renderSlots();
    $("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* sana: ertadan boshlab, yakshanba yo'q */
  const bDate = $("#bDate");
  const iso = (d) => d.toISOString().slice(0, 10);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
  bDate.min = iso(tomorrow); bDate.value = iso(tomorrow);
  const maxD = new Date(); maxD.setDate(maxD.getDate() + 30); bDate.max = iso(maxD);

  const TIMES = ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
  const bookings = store.get("bookings", []);
  function renderSlots() {
    const mentor = $("#bMentor").value, date = bDate.value;
    const sunday = date && new Date(date + "T12:00").getDay() === 0;
    // namunaviy band vaqtlar — sana va mentorga qarab o'zgaradi
    const seed = (date.replace(/-/g, "") * 1 + mentor.length) % 6;
    $("#slots").innerHTML = sunday
      ? `<p class="note" style="margin:0">Yakshanba dam olish kuni. Boshqa sanani tanlang.</p>`
      : TIMES.map((t, i) => {
          const taken = i === seed || i === (seed + 3) % 6 || bookings.some((b) => b.mentor === mentor && b.date === date && b.time === t);
          return `<label class="slot"><input type="radio" name="time" value="${t}" ${taken ? "disabled" : ""}><span>${t}</span></label>`;
        }).join("");
  }
  $("#bMentor").addEventListener("change", renderSlots);
  bDate.addEventListener("change", renderSlots);
  renderSlots();

  $("#booking").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, msg = $("#bookingMsg");
    if (!validate(f, msg)) return;
    const time = f.querySelector("[name=time]:checked");
    if (!time) { msg.className = "form-msg err"; msg.textContent = "Konsultatsiya vaqtini tanlang."; return; }
    const data = Object.fromEntries(new FormData(f));
    bookings.push(data); store.set("bookings", bookings);
    const m = MENTORS.find((x) => x.id === data.mentor);
    msg.className = "form-msg ok";
    msg.textContent = `Yozildingiz: ${m.name}, ${fmtDate(data.date)} soat ${data.time}. Bir kun oldin SMS eslatma yuboramiz.`;
    f.reset(); bDate.value = data.date; $("#bMentor").value = data.mentor; renderSlots();
  });

  /* ---------- Sotuvchi arizasi ---------- */
  $("#aCat").innerHTML = `<option value="">Tanlang</option>` + CATEGORIES.slice(1).map((c) => `<option>${c.name}</option>`).join("") + `<option>Boshqa</option>`;
  $("#apply").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, msg = $("#applyMsg");
    if (!validate(f, msg)) return;
    const data = Object.fromEntries(new FormData(f));
    const apps = store.get("applications", []); apps.push({ ...data, at: new Date().toISOString() }); store.set("applications", apps);
    msg.className = "form-msg ok";
    msg.textContent = `Rahmat, ${data.name.split(" ")[0]}! Arizangiz qabul qilindi. Ertaga soat 18:00 gacha ${data.phone} raqamiga qo'ng'iroq qilamiz.`;
    f.reset();
  });

  /* ---------- FAQ ---------- */
  $("#faq").innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

  updateCount();
  $("#cartOpen").classList.remove("bump");
})();
