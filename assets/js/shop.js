/* ============================================================================
   ASB Gear — catalog renderer + category filter
   Reads window.ASBGEAR_CATALOG (catalog-data.js) and paints the shop grid.
   Depends on cart.js only for the two launch SKUs' add-to-cart wiring, which
   cart.js binds via the [data-add-sku] attribute after this renders.
   ========================================================================== */
(function () {
  "use strict";

  var catalog = window.ASBGEAR_CATALOG || [];

  function money(cents) { return "$" + (cents / 100).toFixed(2); }

  /* --- line-art icons, 64x64 viewBox, stroke-based to match the site ------ */
  var P = {
    dock: '<rect x="8" y="26" width="48" height="14" rx="3"/><path d="M14 33h4M22 33h4M30 33h5M39 33h5M48 33h3"/><path d="M12 26c-6 0-8 8-2 10"/>',
    "car-mount": '<rect x="22" y="12" width="20" height="30" rx="4"/><circle cx="32" cy="27" r="6"/><path d="M32 44v6M24 50h16"/>',
    charger: '<rect x="16" y="14" width="32" height="26" rx="4"/><path d="M26 40v6M38 40v6"/><circle cx="27" cy="24" r="1.5"/><circle cx="37" cy="24" r="1.5"/><path d="M27 30h10"/>',
    powerbank: '<rect x="18" y="12" width="28" height="40" rx="4"/><path d="M26 44h12"/><path d="M32 20v10M27 25h10"/>',
    "wireless-pad": '<ellipse cx="32" cy="34" rx="22" ry="8"/><path d="M32 18v8M27 22l5 4 5-4"/>',
    "wireless-stand": '<rect x="20" y="14" width="24" height="30" rx="3"/><path d="M18 44h28l-4 8H22z"/><path d="M32 24v8"/>',
    cable: '<path d="M16 20c0 12 32 12 32 24"/><rect x="10" y="14" width="10" height="8" rx="2"/><rect x="44" y="42" width="10" height="8" rx="2"/>',
    hub: '<rect x="10" y="28" width="44" height="10" rx="3"/><path d="M18 33h3M26 33h3M34 33h3M42 33h4"/><path d="M32 28v-8"/><rect x="27" y="12" width="10" height="8" rx="2"/>',
    ethernet: '<rect x="18" y="20" width="28" height="24" rx="3"/><path d="M24 44v4M40 44v4M22 26v6M28 26v6M36 26v6M42 26v6"/>',
    hdmi: '<path d="M14 28h36l-4 8H18z"/><path d="M20 32h24"/><path d="M32 20v8"/>',
    kvm: '<rect x="12" y="22" width="40" height="20" rx="3"/><circle cx="32" cy="32" r="5"/><path d="M32 12v10M24 47h16"/>',
    cardreader: '<rect x="16" y="18" width="20" height="28" rx="2"/><path d="M20 18v6h12v-6"/><rect x="40" y="30" width="8" height="12" rx="1"/>',
    adapter: '<rect x="12" y="26" width="18" height="12" rx="3"/><rect x="38" y="26" width="14" height="12" rx="3"/><path d="M30 32h8"/>',
    dac: '<rect x="20" y="14" width="16" height="24" rx="3"/><circle cx="44" cy="44" r="6"/><path d="M28 38v4M36 42l4 2"/>',
    speakerphone: '<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="7"/><path d="M32 12v6M32 46v6M12 32h6M46 32h6"/>',
    mic: '<rect x="26" y="12" width="12" height="24" rx="6"/><path d="M20 30a12 12 0 0 0 24 0"/><path d="M32 42v8M24 50h16"/>',
    "laptop-stand": '<path d="M16 40 24 22h16l8 18"/><rect x="12" y="40" width="40" height="4" rx="2"/><path d="M22 44l-2 6M42 44l2 6"/>',
    "monitor-light": '<rect x="14" y="18" width="36" height="6" rx="3"/><path d="M20 24l-3 8h30l-3-8"/><path d="M32 40v8M22 48h20"/>',
    "cable-tray": '<path d="M12 24v10a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V24"/><path d="M20 30h24"/><path d="M18 24v-6M46 24v-6"/>',
    deskmat: '<rect x="10" y="20" width="44" height="24" rx="3"/><path d="M10 27h44"/><circle cx="16" cy="23.5" r="1"/><circle cx="21" cy="23.5" r="1"/>',
    "phone-stand": '<rect x="22" y="14" width="20" height="28" rx="3"/><path d="M18 42h28"/><path d="M32 46l-8 4M32 46l8 4"/>',
    "vent-mount": '<circle cx="32" cy="30" r="10"/><path d="M32 24v12M26 30h12"/><path d="M22 44h20"/>',
    "dash-mount": '<circle cx="32" cy="22" r="9"/><path d="M32 31v9"/><ellipse cx="32" cy="46" rx="12" ry="5"/>',
    "travel-case": '<rect x="12" y="20" width="40" height="26" rx="4"/><path d="M12 30h40"/><path d="M26 20v-4h12v4"/>',
    stylus: '<path d="M18 46 L44 20 l4 4 L22 50 l-6 2z"/><path d="M40 16l4 4"/>',
    tracker: '<circle cx="32" cy="30" r="16"/><circle cx="32" cy="30" r="4"/><path d="M32 46v6"/>'
  };

  function iconSvg(key) {
    var body = P[key] || '<rect x="16" y="16" width="32" height="32" rx="4"/>';
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
           'style="width:96px;height:96px;color:hsl(var(--primary))">' + body + '</svg>';
  }

  var BASE = /\/products\//.test(location.pathname) ? "../" : "";

  function card(p) {
    var isLaunch = p.status === "launch";

    var media = p.img
      ? '<img src="' + BASE + p.img + '" alt="" width="300" height="195" loading="lazy" />'
      : iconSvg(p.icon);

    var badge = isLaunch
      ? '<span class="pill pill-live">Reserve now</span>'
      : '<span class="pill pill-soon">Coming soon</span>';

    var tags = (p.tags || []).slice(0, 4).map(function (t) {
      return '<span class="tag">' + t + '</span>';
    }).join("");

    var priceBlock = '<span class="price">' + money(p.price) +
      (p.was ? '<small>' + money(p.was) + '</small>' : '') + '</span>';

    var action = isLaunch
      ? '<span style="display:flex;gap:.5rem">' +
          (p.url ? '<a class="btn btn-ghost" href="' + BASE + p.url + '">Details</a>' : '') +
          '<button class="btn btn-primary" type="button" data-add-sku="' + p.sku + '">Add to cart</button>' +
        '</span>'
      : '<button class="btn btn-ghost" type="button" data-interest="' + p.name + '">Notify me</button>';

    var titleZone = (isLaunch && p.url)
      ? '<a href="' + BASE + p.url + '" class="card-title-link"><h3>' + p.short + '</h3></a>'
      : '<h3>' + p.short + '</h3>';

    return '<article class="card" data-category="' + p.category + '" data-status="' + p.status + '">' +
      '<div class="card-media">' + badge + media + '</div>' +
      '<div class="card-body">' +
        titleZone +
        '<p class="sku">' + p.name.replace(p.short + " ", "").replace(p.short, "") + ' · ' + p.sku + '</p>' +
        '<div class="tag-row">' + tags + '</div>' +
        '<p>' + p.blurb + '</p>' +
        '<div class="card-foot">' + priceBlock + action + '</div>' +
      '</div>' +
    '</article>';
  }

  function render(list) {
    var grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;
    grid.innerHTML = list.map(card).join("");
    // cart.js binds add-to-cart and notify handlers on DOMContentLoaded; this
    // grid renders during that same event, so re-run its binders if present.
    if (window.ASBGEAR_bindDynamic) window.ASBGEAR_bindDynamic(grid);
  }

  function wireFilters() {
    var bar = document.querySelector("[data-filter-bar]");
    if (!bar) return;

    var cats = ["All"].concat(
      catalog.map(function (p) { return p.category; })
        .filter(function (c, i, a) { return a.indexOf(c) === i; })
    );

    bar.innerHTML = cats.map(function (c, i) {
      return '<button type="button" class="chip' + (i === 0 ? ' active' : '') +
             '" data-cat="' + c + '">' + c +
             '<span class="chip-n">' + (c === "All" ? catalog.length :
               catalog.filter(function (p) { return p.category === c; }).length) + '</span>' +
             '</button>';
    }).join("");

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      bar.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.getAttribute("data-cat");
      render(cat === "All" ? catalog : catalog.filter(function (p) { return p.category === cat; }));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireFilters();
    render(catalog);

    // Homepage featured strip: first 3 launch/near-launch, if the host exists.
    var featured = document.querySelector("[data-featured-grid]");
    if (featured) {
      var pick = catalog.filter(function (p) { return p.status === "launch"; })
        .concat(catalog.filter(function (p) { return p.status !== "launch"; }).slice(0, 2));
      featured.innerHTML = pick.map(card).join("");
      if (window.ASBGEAR_bindDynamic) window.ASBGEAR_bindDynamic(featured);
    }
  });
})();
