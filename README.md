# ASB Gear — storefront

Pre-launch product-showcase site for **ASB Gear**, the hardware product line of
**ASB Solutions Group Inc.**

The catalog shows **32 products**, but only **two are real launch SKUs** with
sourcing and compliance work in motion. The other 30 are on-brand roadmap
concepts — see "Catalog" below.

| Real launch SKU | SKU | Intro price | Page |
| :--- | :--- | :--- | :--- |
| Nexus 9 — 9-in-1 USB-C docking station | `ASB-NX9-001` | $89 (reg. $109) | [`products/nexus-9-usb-c-dock.html`](products/nexus-9-usb-c-dock.html) |
| DriveLink 15 — 15W magnetic car charger mount | `ASB-DL15-001` | $49 (reg. $59) | [`products/drivelink-15-car-mount.html`](products/drivelink-15-car-mount.html) |

## Stack

Deliberately none. Hand-written HTML, one CSS file, one small JS file — no build
step, no dependencies, no framework. It deploys to GitHub Pages, Cloudflare
Pages, Netlify, S3, or an nginx container by copying the directory.

```
index.html                       landing page — hero, featured products, trust, FAQ
shop.html                        full catalog grid with category filter
about.html                       company / product philosophy
contact.html                     contact routes + general FAQ
products/
  nexus-9-usb-c-dock.html        PDP: specs, box contents, product FAQ
  drivelink-15-car-mount.html    PDP: specs, box contents, product FAQ
cart.html                        cart with quantity controls
checkout.html                    reservation form (see "Checkout" below)
order-confirmation.html          post-reservation confirmation
terms.html                       terms of sale & use          ⚠ needs legal review
privacy.html                     privacy policy               ⚠ needs legal review
returns.html                     returns & 2-year warranty    ⚠ needs legal review
shipping.html                    shipping rates & policy      ⚠ rates not contracted
assets/css/site.css              full design system (light + dark)
assets/js/catalog-data.js        SINGLE SOURCE OF TRUTH for all 32 products
assets/js/shop.js                catalog grid renderer + category filter + line-art icons
assets/js/site.js                mobile nav, active-link marking, mailto capture
assets/js/cart.js                cart state, reservation flow; derives prices from catalog-data.js
assets/img/                      logo, favicon, product SVG illustrations (launch SKUs only)
.github/workflows/pages.yml      auto-deploy to GitHub Pages on push to main
```

## Catalog: 2 real SKUs + 30 roadmap concepts

The store shows **32 products**, but only **two are real** — the Nexus 9 dock
and the DriveLink 15 mount, the SKUs with actual sourcing, compliance, GTIN, and
trademark work in motion (tracked in the private `asb-gear-ops` repo). The other
**30 are catalog/roadmap content**: realistic, on-brand product concepts with
plausible planning prices, not yet sourced, certified, or orderable.

All 32 live in **`assets/js/catalog-data.js`** — one array, one `status` field:

- `status: "launch"` → orderable. Shows "Reserve now" + Add to cart. Only the two real SKUs. These are the only entries `cart.js` will accept into a cart.
- `status: "coming-soon"` → not orderable. Shows "Coming soon" + a "Notify me" mailto. This is every concept.

`shop.js` renders the grid and draws a category line-icon for concepts (the two
launch SKUs use their real SVG illustrations). `cart.js` derives its orderable
catalog and its launch prices from the same file, so **prices live in exactly
one place now** — edit `catalog-data.js`, nowhere else.

**To promote a concept to a real product:** flip its `status` to `"launch"`,
give it verified specs, a real image, a `url` to a detail page, and complete the
sourcing/compliance workup. Do not flip it on marketing enthusiasm alone.

**The certification rule applies to every concept too.** No "Qi2", "Qi",
"MagSafe", "USB-IF certified", "Find My", or "MFi" on any product — real or
roadmap — unless it's actually been certified. The rule is restated at the top
of `catalog-data.js` so nobody adds a concept that quietly violates it. Wireless
chargers are "15W magnetic wireless charging"; USB-C power is described
functionally, not as certified.

## Checkout — read this before adding a payment processor

There is a working cart and a working checkout, but **it takes reservations, not
payments**, and there are deliberately **no card fields anywhere in this
codebase** — no card number, expiry, CVV, or billing-card input exists on any
page.

That is a design decision, not an oversight. A checkout that accepts card
details with no processor behind it cannot charge them, cannot store them
safely, and in this build would have pushed them into a `mailto:` body in plain
text. That is a data-breach vector and would drag the business into PCI-DSS
scope for no benefit.

What the flow does instead: cart → contact and shipping details → generates a
pre-filled reservation email to `sales@` → confirmation page. Nothing is
charged, and the customer-facing copy says so at every step.

**To go live with real payments**, replace `submitReservation()` in
`assets/js/cart.js` with one of:

| Option | Card data handled by | Sales tax |
| :--- | :--- | :--- |
| Stripe Payment Links / Checkout | Stripe's hosted page | You (or Stripe Tax) |
| Shopify Buy Button | Shopify | Shopify |
| Paddle / Lemon Squeezy | Them (merchant of record) | Them |

In every case the card fields live on the processor's hosted page. Do not
reintroduce them here.

Prices live in one place — the `CATALOG` object at the top of
`assets/js/cart.js` — and are stored in integer cents. The product pages and
`index.html` display prices as static text, so **update both** when pricing
changes.

## Run it locally

Any static file server works. From the repo root:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>.

Alternatives — `npx serve .` or `php -S localhost:8080`. Opening `index.html`
directly via `file://` also works, though relative links behave better over HTTP.

## Deploy

The included workflow publishes the repo root to GitHub Pages on every push to
`main`. Enable it once, under **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

For Cloudflare Pages or Netlify: build command empty, publish directory `/`.

## Branding

Palette and typography are inherited from `asbsolutionsgroup.com` so the two
properties read as one company:

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--primary` | `hsl(200 98% 39%)` | `hsl(198 93% 59%)` |
| `--background` | `hsl(209 40% 96%)` | `hsl(222 47% 11%)` |
| `--foreground` | `hsl(222 47% 11%)` | `hsl(210 40% 98%)` |

Typeface is Inter throughout. Dark mode follows `prefers-color-scheme`.
The logo and favicon are the corporate ASB marks.

## Current limitations — read before launch

- **No checkout.** There is no cart, no payment processing, and no Shopify
  account behind this. Every "Notify me" / "Join the launch list" control opens a
  pre-filled `mailto:` to `sales@asbsolutionsgroup.com`. Swapping that for a
  hosted form, Shopify Buy Button, or Stripe Payment Link is a change to
  `assets/js/site.js` plus the button markup.
- **Product imagery is illustrative.** The two product graphics are hand-drawn
  SVGs, not photographs. Replace `assets/img/*.svg` with real product photography
  before launch.
- **Copy is placeholder-grade in one respect:** the specifications, prices, and
  box contents were written to be internally consistent and plausible for this
  product class. They are **not** confirmed against a supplier quote or a real
  bill of materials — verify every figure against the actual sourced units before
  this page is public, particularly the 100 W PD figures, the sustained 15 W
  charging claim, and the magnet holding force.

  **Certification marks:** this site deliberately makes **no** Qi2, Qi, or
  MagSafe claim. Those are third-party certification marks (Wireless Power
  Consortium and Apple respectively) and may not be used on an uncertified
  product. The DriveLink is described as a "15W magnetic wireless charger"
  throughout. Do not reintroduce those terms unless certification is actually
  obtained — see `asb-gear-ops/amazon/00-compliance-matrix.md`.
- **Legal pages are drafts, not advice.** Terms, privacy, returns, and shipping
  now exist and are internally consistent with how the site actually behaves, but
  they have not been reviewed by counsel and each carries a visible draft banner.
  They contain `[BRACKETED]` placeholders that only you can fill: state of
  incorporation, registered address, governing-law venue, and the fulfilment
  return address. Search the repo for `[` to find them all.
- **Shipping rates are not contracted.** The table in `shipping.html` is an
  intended structure, not a carrier quote.
- **Email addresses** (`sales@`, `support@`, `privacy@`) are assumed to exist on
  the `asbsolutionsgroup.com` domain — confirm all three are routed. `privacy@`
  is referenced from the privacy policy as the rights-request channel, so it
  needs to work before that page is relied on.

## License

© ASB Solutions Group Inc. All rights reserved.

<!-- ARCH-DIAGRAM:START -->

## Architecture

> Auto-generated architecture diagram. See [`docs/context-map.md`](docs/context-map.md) for the full context map (core application, containers/cloud, and database connections).

```mermaid
flowchart TD
  User([User / Client])
  App["asb-gear-storefront"]
  SVC0["Cloudflare Workers"]
  Deploy["GitHub Pages"]
  User --> App
  App --> SVC0
  App -.deploy.-> Deploy
```

<!-- ARCH-DIAGRAM:END -->
