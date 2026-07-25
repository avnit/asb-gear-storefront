/* ============================================================================
   ASB Gear — cart + reservation flow
   ----------------------------------------------------------------------------
   IMPORTANT — READ BEFORE WIRING UP PAYMENTS
   ----------------------------------------------------------------------------
   This flow deliberately collects NO payment information. There are no card
   number, expiry, CVV, or billing-card fields anywhere in this codebase, and
   none should be added until a real payment processor is integrated.

   Reason: a form that accepts card details but has no processor behind it is
   worse than no form at all. Customers would hand real card numbers to a page
   that cannot charge them, cannot store them safely, and (in this build) would
   push them into a mailto: body in plain text. That is a data-breach vector and
   would put the business outside PCI-DSS scope requirements.

   What this flow does instead: takes a *reservation* — contact details, ship-to
   address, and quantities — and hands off to email. Nothing is charged.

   TO GO LIVE WITH REAL CHECKOUT, replace submitReservation() below with one of:
     - Stripe Payment Links / Stripe Checkout (hosted, no PCI burden)
     - Shopify Buy Button or headless Storefront API
     - Paddle / Lemon Squeezy (merchant of record, handles sales tax)
   In every case the card fields live on the processor's hosted page, not here.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "asbgear.cart.v1";
  var ORDER_KEY = "asbgear.reservation.v1";
  var SALES_EMAIL = "sales@asbsolutionsgroup.com";

  // Prices are in whole USD cents to avoid floating-point drift.
  //
  // The ORDERABLE catalog is derived from window.ASBGEAR_CATALOG (catalog-data.js)
  // and contains ONLY status:"launch" items — the two real SKUs. Everything else
  // in the catalog is a "coming-soon" concept that cannot be added to a cart, so
  // it deliberately never lands here. If catalog-data.js hasn't loaded (e.g. a
  // page that doesn't include it), we fall back to the two launch SKUs inline so
  // the cart still works. This keeps launch prices in ONE place: catalog-data.js.
  var FALLBACK = {
    "ASB-NX9-001": { sku: "ASB-NX9-001", name: "Nexus 9 USB-C Docking Station", short: "Nexus 9", price: 8900, was: 10900, img: "assets/img/nexus-9-dock.svg", url: "products/nexus-9-usb-c-dock.html" },
    "ASB-DL15-001": { sku: "ASB-DL15-001", name: "DriveLink 15 Magnetic Car Charger Mount", short: "DriveLink 15", price: 4900, was: 5900, img: "assets/img/drivelink-15-mount.svg", url: "products/drivelink-15-car-mount.html" }
  };

  var CATALOG = (function () {
    var src = window.ASBGEAR_CATALOG;
    if (!src || !src.length) return FALLBACK;
    var out = {};
    src.forEach(function (p) {
      if (p.status === "launch") {
        out[p.sku] = { sku: p.sku, name: p.name, short: p.short, price: p.price, was: p.was, img: p.img, url: p.url };
      }
    });
    return Object.keys(out).length ? out : FALLBACK;
  })();

  // Pages under /products/ need to climb one level for shared assets.
  var BASE = /\/products\//.test(location.pathname) ? "../" : "";

  function money(cents) {
    return "$" + (cents / 100).toFixed(2);
  }

  // ---------------------------------------------------------------- storage
  function readCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      var clean = {};
      // Drop anything that isn't a known SKU with a sane quantity.
      Object.keys(parsed).forEach(function (sku) {
        var qty = parseInt(parsed[sku], 10);
        if (CATALOG[sku] && qty > 0) clean[sku] = Math.min(qty, 99);
      });
      return clean;
    } catch (e) {
      return {};
    }
  }

  function writeCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      /* private browsing / storage disabled — cart simply won't persist */
    }
    paintBadge();
  }

  function itemCount(cart) {
    return Object.keys(cart).reduce(function (n, sku) { return n + cart[sku]; }, 0);
  }

  function subtotal(cart) {
    return Object.keys(cart).reduce(function (n, sku) {
      return n + CATALOG[sku].price * cart[sku];
    }, 0);
  }

  // ---------------------------------------------------------------- cart nav
  function paintBadge() {
    var n = itemCount(readCart());
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count]"), function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  // The cart link is injected rather than duplicated into every page's header.
  function injectCartLink() {
    var nav = document.querySelector(".nav");
    if (!nav || nav.querySelector(".cart-link")) return;

    var a = document.createElement("a");
    a.className = "cart-link";
    a.href = BASE + "cart.html";
    a.setAttribute("aria-label", "Cart");
    a.innerHTML =
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
      '<path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>' +
      '<span class="cart-badge" data-cart-count hidden>0</span>';

    var cta = nav.querySelector(".btn");
    nav.insertBefore(a, cta || null);
  }

  // ---------------------------------------------------------------- add to cart
  // Delegated on document so it works for cards rendered dynamically by shop.js
  // (the catalog grid re-renders on every category filter). No per-element
  // binding, so re-rendering never leaves dead buttons or double-fires.
  function wireAddButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add-sku]");
      if (!btn) return;
      e.preventDefault();

      var sku = btn.getAttribute("data-add-sku");
      if (!CATALOG[sku]) return; // not an orderable launch SKU — ignore

      var cart = readCart();
      cart[sku] = Math.min((cart[sku] || 0) + 1, 99);
      writeCart(cart);

      // Deliberately not disabled: clicking twice should add two units, not
      // swallow the second click behind a confirmation animation.
      var original = btn.getAttribute("data-label") || btn.textContent;
      btn.setAttribute("data-label", original);
      btn.textContent = "Added ✓ (" + cart[sku] + ")";

      clearTimeout(btn._resetTimer);
      btn._resetTimer = setTimeout(function () {
        btn.textContent = original;
      }, 1600);
    });
  }

  // ---------------------------------------------------------------- cart page
  function renderCart() {
    var host = document.querySelector("[data-cart-lines]");
    if (!host) return;

    var cart = readCart();
    var skus = Object.keys(cart);
    var empty = document.querySelector("[data-cart-empty]");
    var filled = document.querySelector("[data-cart-filled]");

    if (!skus.length) {
      if (empty) empty.hidden = false;
      if (filled) filled.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (filled) filled.hidden = false;

    host.innerHTML = skus.map(function (sku) {
      var p = CATALOG[sku];
      var qty = cart[sku];
      return '' +
        '<div class="line">' +
          '<img class="line-img" src="' + BASE + p.img + '" alt="" width="96" height="62" />' +
          '<div class="line-main">' +
            '<a href="' + BASE + p.url + '"><strong>' + p.short + '</strong></a>' +
            '<span class="line-sku">' + p.sku + '</span>' +
            '<span class="line-unit">' + money(p.price) + ' each</span>' +
          '</div>' +
          '<div class="qty" role="group" aria-label="Quantity for ' + p.short + '">' +
            '<button type="button" data-qty="-1" data-sku="' + sku + '" aria-label="Decrease quantity">&minus;</button>' +
            '<span aria-live="polite">' + qty + '</span>' +
            '<button type="button" data-qty="1" data-sku="' + sku + '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<div class="line-total">' + money(p.price * qty) + '</div>' +
          '<button type="button" class="line-remove" data-remove="' + sku + '" aria-label="Remove ' + p.short + '">Remove</button>' +
        '</div>';
    }).join("");

    var sub = subtotal(cart);
    setText("[data-subtotal]", money(sub));
    setText("[data-count]", itemCount(cart) + (itemCount(cart) === 1 ? " item" : " items"));

    host.querySelectorAll("[data-qty]").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = readCart();
        var s = b.getAttribute("data-sku");
        c[s] = (c[s] || 0) + parseInt(b.getAttribute("data-qty"), 10);
        if (c[s] < 1) delete c[s];
        writeCart(c);
        renderCart();
      });
    });

    host.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = readCart();
        delete c[b.getAttribute("data-remove")];
        writeCart(c);
        renderCart();
      });
    });
  }

  function setText(sel, text) {
    var el = document.querySelector(sel);
    if (el) el.textContent = text;
  }

  // ---------------------------------------------------------------- checkout
  function renderCheckoutSummary() {
    var host = document.querySelector("[data-checkout-summary]");
    if (!host) return;

    var cart = readCart();
    var skus = Object.keys(cart);

    if (!skus.length) {
      // Nothing to reserve — send them back rather than showing an empty form.
      window.location.replace(BASE + "cart.html");
      return;
    }

    host.innerHTML = skus.map(function (sku) {
      var p = CATALOG[sku];
      return '<li><span class="k">' + p.short + ' &times; ' + cart[sku] + '</span>' +
             '<span class="v">' + money(p.price * cart[sku]) + '</span></li>';
    }).join("") +
    '<li class="sum"><span class="k">Subtotal</span><span class="v">' + money(subtotal(cart)) + '</span></li>' +
    '<li><span class="k">Shipping</span><span class="v">Quoted at launch</span></li>' +
    '<li><span class="k">Tax</span><span class="v">Calculated at launch</span></li>';
  }

  function wireReservationForm() {
    var form = document.querySelector("[data-reservation-form]");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var cart = readCart();
      var skus = Object.keys(cart);
      if (!skus.length) return;

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });

      var lines = skus.map(function (sku) {
        return "  - " + CATALOG[sku].name + " (" + sku + ") x " + cart[sku] +
               "  =  " + money(CATALOG[sku].price * cart[sku]);
      }).join("\n");

      var body = [
        "RESERVATION REQUEST — ASB Gear",
        "(No payment has been taken. This is a launch-allocation hold.)",
        "",
        "ITEMS",
        lines,
        "",
        "Subtotal (excl. shipping and tax): " + money(subtotal(cart)),
        "",
        "CONTACT",
        "  Name:    " + (data.name || ""),
        "  Email:   " + (data.email || ""),
        "  Phone:   " + (data.phone || "not provided"),
        "",
        "SHIP TO",
        "  " + (data.address1 || ""),
        "  " + (data.address2 || ""),
        "  " + (data.city || "") + ", " + (data.region || "") + " " + (data.postal || ""),
        "  " + (data.country || ""),
        "",
        "NOTES",
        "  " + (data.notes || "none"),
        ""
      ].join("\n");

      // Stash for the confirmation page, then clear the cart.
      try {
        sessionStorage.setItem(ORDER_KEY, JSON.stringify({
          items: skus.map(function (s) {
            return { sku: s, name: CATALOG[s].name, qty: cart[s], total: CATALOG[s].price * cart[s] };
          }),
          subtotal: subtotal(cart),
          email: data.email || ""
        }));
      } catch (err) { /* non-fatal */ }

      window.location.href =
        "mailto:" + SALES_EMAIL +
        "?subject=" + encodeURIComponent("Reservation request — ASB Gear (" + itemCount(cart) + " items)") +
        "&body=" + encodeURIComponent(body);

      writeCart({});
      setTimeout(function () {
        window.location.href = BASE + "order-confirmation.html";
      }, 700);
    });
  }

  // ---------------------------------------------------------------- confirmation
  function renderConfirmation() {
    var host = document.querySelector("[data-confirmation]");
    if (!host) return;

    var raw;
    try { raw = sessionStorage.getItem(ORDER_KEY); } catch (e) { raw = null; }

    if (!raw) {
      host.innerHTML = '<p class="lead">No recent reservation found in this browser session. ' +
        'If you already sent your reservation email, it is on its way to us — nothing further is needed.</p>';
      return;
    }

    var o = JSON.parse(raw);
    host.innerHTML =
      '<ul class="spec-list">' +
        o.items.map(function (i) {
          return '<li><span class="k">' + i.name + ' &times; ' + i.qty + '</span>' +
                 '<span class="v">' + money(i.total) + '</span></li>';
        }).join("") +
        '<li class="sum"><span class="k"><strong>Subtotal</strong></span>' +
        '<span class="v"><strong>' + money(o.subtotal) + '</strong></span></li>' +
      '</ul>' +
      (o.email ? '<p class="note-line">We\'ll confirm to <strong>' + o.email + '</strong>.</p>' : "");
  }

  // ---------------------------------------------------------------- init
  document.addEventListener("DOMContentLoaded", function () {
    injectCartLink();
    paintBadge();
    wireAddButtons();
    renderCart();
    renderCheckoutSummary();
    wireReservationForm();
    renderConfirmation();
  });
})();
