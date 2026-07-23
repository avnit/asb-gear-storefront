# ASB Gear — storefront

Pre-launch product-showcase site for **ASB Gear**, the hardware product line of
**ASB Solutions Group Inc.**

Two products are in the catalogue:

| Product | SKU | Intro price | Page |
| :--- | :--- | :--- | :--- |
| Nexus 9 — 9-in-1 USB-C docking station | `ASB-NX9-001` | $89 (reg. $109) | [`products/nexus-9-usb-c-dock.html`](products/nexus-9-usb-c-dock.html) |
| DriveLink 15 — Qi2 magnetic car charger mount | `ASB-DL15-001` | $49 (reg. $59) | [`products/drivelink-15-car-mount.html`](products/drivelink-15-car-mount.html) |

## Stack

Deliberately none. Hand-written HTML, one CSS file, one small JS file — no build
step, no dependencies, no framework. It deploys to GitHub Pages, Cloudflare
Pages, Netlify, S3, or an nginx container by copying the directory.

```
index.html                       landing page — hero, both products, trust, FAQ
about.html                       company / product philosophy
products/
  nexus-9-usb-c-dock.html        PDP: specs, box contents, product FAQ
  drivelink-15-car-mount.html    PDP: specs, box contents, product FAQ
assets/css/site.css              full design system (light + dark)
assets/js/site.js                mobile nav, active-link marking, mailto capture
assets/img/                      logo, favicon, product SVG illustrations
.github/workflows/pages.yml      auto-deploy to GitHub Pages on push to main
```

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
  this page is public, particularly the Qi2 certification claim, the 100 W PD
  figures, and the magnet holding force.
- **No legal pages.** Terms, privacy policy, returns policy, and shipping policy
  are all absent and will be required before selling.
- **Email addresses** (`sales@`, `support@`) are assumed to exist on the
  `asbsolutionsgroup.com` domain — confirm they're routed.

## License

© ASB Solutions Group Inc. All rights reserved.
