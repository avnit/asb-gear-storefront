/* ============================================================================
   ASB Gear — product catalog (single source of truth)
   ----------------------------------------------------------------------------
   STATUS FIELD — read before editing:
     "launch"      = a real SKU with sourcing/compliance work in motion. Only
                     these are orderable (reservable). Currently exactly two:
                     ASB-NX9-001 and ASB-DL15-001.
     "coming-soon" = a catalog/roadmap concept. Realistic and on-brand, but NOT
                     yet sourced, certified, priced against a supplier quote, or
                     orderable. Shows a "Notify me" waitlist button, never a cart
                     button. Prices are indicative planning figures.

   CERTIFICATION RULE (applies to every entry, forever):
     Do NOT write "Qi2", "Qi", "MagSafe", "USB-IF certified", "Find My", "MFi",
     or any other certification/compatibility mark unless that specific product
     has actually been certified and you can produce the record. Wireless
     charging is described as "15W magnetic wireless charging". USB-C power is
     described functionally ("100W USB-C power delivery"), not as certified.
     See asb-gear-ops for the full rationale.

   Prices are in whole USD cents. `was` is an optional pre-discount figure.
   ========================================================================== */
(function () {
  "use strict";

  window.ASBGEAR_CATALOG = [

    /* ============================ LAUNCH SKUs ============================ */
    {
      sku: "ASB-NX9-001", name: "Nexus 9 USB-C Docking Station", short: "Nexus 9",
      category: "Connectivity", icon: "dock", status: "launch",
      price: 8900, was: 10900, url: "products/nexus-9-usb-c-dock.html",
      img: "assets/img/nexus-9-dock.svg",
      tags: ["9 ports", "Dual 4K", "100W PD", "Gigabit LAN"],
      blurb: "One cable to your laptop, nine connections on the other side. A milled aluminium shell that sheds heat instead of trapping it."
    },
    {
      sku: "ASB-DL15-001", name: "DriveLink 15 Magnetic Car Charger Mount", short: "DriveLink 15",
      category: "Charging", icon: "car-mount", status: "launch",
      price: 4900, was: 5900, url: "products/drivelink-15-car-mount.html",
      img: "assets/img/drivelink-15-mount.svg",
      tags: ["15W magnetic", "N52 magnets", "Vent + dash", "Active cooling"],
      blurb: "A magnet array strong enough for a cased phone on a bad road, and a fan-assisted coil that keeps charging in a hot car."
    },

    /* ========================= CHARGING (concept) ======================= */
    {
      sku: "ASB-VLT100", name: "Volt 100 GaN 3-Port Charger", short: "Volt 100",
      category: "Charging", icon: "charger", status: "coming-soon", price: 6900,
      tags: ["100W total", "GaN", "2×USB-C + USB-A"],
      blurb: "A 100W gallium-nitride wall charger small enough to travel with, sized to run a laptop and two phones at once without slowing to a crawl."
    },
    {
      sku: "ASB-VLT65", name: "Volt 65 GaN Travel Charger", short: "Volt 65",
      category: "Charging", icon: "charger", status: "coming-soon", price: 3900,
      tags: ["65W", "GaN", "Foldable pins"],
      blurb: "A single-port 65W charger with folding pins. Enough to fast-charge most 14-inch laptops from one pocket-sized brick."
    },
    {
      sku: "ASB-RSV10K", name: "Reserve 10K Magnetic Power Bank", short: "Reserve 10K",
      category: "Charging", icon: "powerbank", status: "coming-soon", price: 4500,
      tags: ["10,000mAh", "15W magnetic", "Snap-on"],
      blurb: "A 10,000mAh pack that snaps magnetically to the back of a phone and tops it up wirelessly, or faster over USB-C."
    },
    {
      sku: "ASB-RSV20K", name: "Reserve 20K USB-C Power Bank", short: "Reserve 20K",
      category: "Charging", icon: "powerbank", status: "coming-soon", price: 5900,
      tags: ["20,000mAh", "65W output", "Laptop-capable"],
      blurb: "Two full phone-days or a laptop top-up, with a 65W USB-C output that actually charges a laptop rather than just trickling it."
    },
    {
      sku: "ASB-PCK15", name: "Puck 15 Wireless Charging Pad", short: "Puck 15",
      category: "Charging", icon: "wireless-pad", status: "coming-soon", price: 2900,
      tags: ["15W magnetic", "Aluminium", "Non-slip"],
      blurb: "A flat magnetic charging puck for the nightstand or desk. Weighted aluminium base so it stays put when you lift the phone off."
    },
    {
      sku: "ASB-TRI3", name: "Tri-Dock 3-in-1 Charging Stand", short: "Tri-Dock",
      category: "Charging", icon: "wireless-stand", status: "coming-soon", price: 6500,
      tags: ["Phone + watch + buds", "15W", "Folds flat"],
      blurb: "Phone, watch, and earbuds on one base. Folds flat for travel, and the phone arm angles for use as a bedside or desk clock."
    },
    {
      sku: "ASB-DWV15", name: "DeskWave Charging Stand", short: "DeskWave",
      category: "Charging", icon: "wireless-stand", status: "coming-soon", price: 3500,
      tags: ["15W magnetic", "Adjustable angle", "Desk"],
      blurb: "An angled magnetic stand that keeps your phone upright and charging where you can still glance at it during the day."
    },
    {
      sku: "ASB-LPC2", name: "Loop-C 100W Braided Cable (2-pack)", short: "Loop-C",
      category: "Charging", icon: "cable", status: "coming-soon", price: 1900,
      tags: ["100W", "USB-C to USB-C", "2m braided"],
      blurb: "Two 2-metre braided USB-C cables rated for 100W and 480Mbps data. Nylon jacket and reinforced strain relief where cables usually fail."
    },
    {
      sku: "ASB-LPM6", name: "Loop-Multi 6-in-1 Cable", short: "Loop-Multi",
      category: "Charging", icon: "cable", status: "coming-soon", price: 2200,
      tags: ["6 tips", "USB-C + USB-A", "Charge everything"],
      blurb: "One cable, USB-C and USB-A on the wall side, USB-C, Lightning, and micro-USB on the device side. The tangle-drawer, solved."
    },

    /* ======================= CONNECTIVITY (concept) ===================== */
    {
      sku: "ASB-NX5", name: "Nexus 5 USB-C Hub", short: "Nexus 5",
      category: "Connectivity", icon: "hub", status: "coming-soon", price: 3900,
      tags: ["5-in-1", "4K HDMI", "100W passthrough"],
      blurb: "The Nexus 9's smaller sibling: HDMI, two USB-A, USB-C data, and 100W pass-through in something that lives in a laptop bag."
    },
    {
      sku: "ASB-NXM4", name: "Nexus Mini 4-Port Data Hub", short: "Nexus Mini",
      category: "Connectivity", icon: "hub", status: "coming-soon", price: 2500,
      tags: ["4×USB-A", "5Gbps", "Bus-powered"],
      blurb: "Four USB-A 3.2 ports from one USB-C, no wall adapter needed. Aluminium slab with a captive cable that tucks under a monitor."
    },
    {
      sku: "ASB-LP25G", name: "LinkPort 2.5G Ethernet Adapter", short: "LinkPort 2.5G",
      category: "Connectivity", icon: "ethernet", status: "coming-soon", price: 3200,
      tags: ["2.5GbE", "USB-C", "Plug-and-play"],
      blurb: "Wired 2.5-gigabit networking from a USB-C port, for when Wi-Fi is the bottleneck and the router finally isn't."
    },
    {
      sku: "ASB-CL2H", name: "CastLink Dual HDMI Adapter", short: "CastLink",
      category: "Connectivity", icon: "hdmi", status: "coming-soon", price: 3500,
      tags: ["2×HDMI", "Dual display", "USB-C"],
      blurb: "Drive two external displays from a single USB-C port. Honest refresh-rate specs published per configuration, as always."
    },
    {
      sku: "ASB-KVM2", name: "SwitchBox 2 USB-C KVM Switch", short: "SwitchBox 2",
      category: "Connectivity", icon: "kvm", status: "coming-soon", price: 7900,
      tags: ["2 devices", "One keyboard + mouse", "4K"],
      blurb: "One monitor, keyboard, and mouse shared between two machines, switched by a button on the desk instead of a cable swap."
    },
    {
      sku: "ASB-SDP2", name: "SD Pro UHS-II Card Reader", short: "SD Pro",
      category: "Connectivity", icon: "cardreader", status: "coming-soon", price: 2900,
      tags: ["UHS-II", "SD + microSD", "312MB/s"],
      blurb: "A UHS-II reader that offloads a shoot at the card's real speed, not the throttled rate cheaper readers quietly impose."
    },
    {
      sku: "ASB-BRA2", name: "Bridge-A USB-C to USB-A Adapter (2-pack)", short: "Bridge-A",
      category: "Connectivity", icon: "adapter", status: "coming-soon", price: 1200,
      tags: ["USB-C to USB-A", "10Gbps", "2-pack"],
      blurb: "The little adapter you always need and can never find, in a machined shell that won't crack. Two in the box on purpose."
    },

    /* =========================== AUDIO (concept) ======================== */
    {
      sku: "ASB-DAC1", name: "Clarity DAC Headphone Adapter", short: "Clarity DAC",
      category: "Audio", icon: "dac", status: "coming-soon", price: 4500,
      tags: ["Hi-res", "32-bit", "USB-C to 3.5mm"],
      blurb: "A proper little digital-to-analogue converter for wired headphones, not the flat dongle in the box. Cleaner, louder, quieter floor."
    },
    {
      sku: "ASB-CNF360", name: "Confer 360 Conference Speakerphone", short: "Confer 360",
      category: "Audio", icon: "speakerphone", status: "coming-soon", price: 8900,
      tags: ["360° mics", "USB + Bluetooth", "Echo cancel"],
      blurb: "A desktop speakerphone with all-directional pickup and hardware echo cancellation, for meetings a laptop mic can't carry."
    },
    {
      sku: "ASB-MIC1", name: "StreamMic USB-C Desk Microphone", short: "StreamMic",
      category: "Audio", icon: "mic", status: "coming-soon", price: 6900,
      tags: ["Cardioid", "USB-C", "Zero-latency monitor"],
      blurb: "A cardioid desk mic with a headphone monitor jack and a physical mute. Sounds like you meant to be heard, on calls or a stream."
    },

    /* ===================== DESK & WORKSPACE (concept) =================== */
    {
      sku: "ASB-RSP", name: "Riser Pro Aluminium Laptop Stand", short: "Riser Pro",
      category: "Workspace", icon: "laptop-stand", status: "coming-soon", price: 4500,
      tags: ["Aluminium", "Ventilated", "Screen at eye level"],
      blurb: "Lifts a laptop to eye level and lets air under it. Single-piece aluminium, no wobble, holds up to a 16-inch machine."
    },
    {
      sku: "ASB-RSF", name: "Riser Fold Travel Laptop Stand", short: "Riser Fold",
      category: "Workspace", icon: "laptop-stand", status: "coming-soon", price: 2900,
      tags: ["Folds flat", "80g", "Two heights"],
      blurb: "A laptop stand that folds to the thickness of a phone and disappears into a bag, for the days your desk is a café table."
    },
    {
      sku: "ASB-LMB", name: "LumaBar Monitor Light", short: "LumaBar",
      category: "Workspace", icon: "monitor-light", status: "coming-soon", price: 5500,
      tags: ["No screen glare", "Auto-dim", "USB-powered"],
      blurb: "A light bar that clips over your monitor and lights the desk without throwing glare at the screen. Warm-to-cool, dimmable."
    },
    {
      sku: "ASB-ANC", name: "Anchor Under-Desk Cable Tray", short: "Anchor",
      category: "Workspace", icon: "cable-tray", status: "coming-soon", price: 2500,
      tags: ["Clamp-on", "No drilling", "Hides the mess"],
      blurb: "A steel tray that clamps under the desk and swallows the power strip and cable spaghetti. No screws into the desktop."
    },
    {
      sku: "ASB-DPD", name: "Dock Pad Desk Mat", short: "Dock Pad",
      category: "Workspace", icon: "deskmat", status: "coming-soon", price: 3500,
      tags: ["Cable channel", "Stitched edge", "Water-resistant"],
      blurb: "A large desk mat with a hidden channel along the top edge that routes your charging cables to exactly where your hand lands."
    },
    {
      sku: "ASB-PRCH", name: "Perch Phone & Tablet Stand", short: "Perch",
      category: "Workspace", icon: "phone-stand", status: "coming-soon", price: 2200,
      tags: ["Phone to tablet", "Adjustable", "Aluminium"],
      blurb: "A weighted aluminium stand that holds anything from a phone to a 13-inch tablet at whatever angle you set, and stays there."
    },

    /* ===================== MOBILE & TRAVEL (concept) ==================== */
    {
      sku: "ASB-GMV", name: "GripMount Vent Phone Mount", short: "GripMount Vent",
      category: "Travel", icon: "vent-mount", status: "coming-soon", price: 1900,
      tags: ["Magnetic", "Vent clip", "No charging"],
      blurb: "The DriveLink's hold without the charging — a plain magnetic vent mount for drivers who charge on a cable and just want the grip."
    },
    {
      sku: "ASB-GMD", name: "GripMount Dash Suction Mount", short: "GripMount Dash",
      category: "Travel", icon: "dash-mount", status: "coming-soon", price: 2200,
      tags: ["Suction base", "Dash or glass", "Magnetic head"],
      blurb: "A gel-suction mount for the dashboard or windscreen with the same magnetic head, for cars where the vents won't take a clip."
    },
    {
      sku: "ASB-VYG", name: "Voyager Tech Organiser Case", short: "Voyager",
      category: "Travel", icon: "travel-case", status: "coming-soon", price: 2900,
      tags: ["Cables + chargers", "Elastic loops", "Water-resistant"],
      blurb: "A structured case that keeps chargers, cables, and dongles in their own loops instead of a knotted heap at the bottom of a bag."
    },
    {
      sku: "ASB-STY1", name: "Stylus One Active Stylus", short: "Stylus One",
      category: "Travel", icon: "stylus", status: "coming-soon", price: 3900,
      tags: ["Fine tip", "Tilt", "Palm rejection"],
      blurb: "A fine-point active stylus for note-taking tablets, with tilt shading and a magnetic side that clings to the tablet edge."
    },
    {
      sku: "ASB-TRK2", name: "TrackTag Item Finder (2-pack)", short: "TrackTag",
      category: "Travel", icon: "tracker", status: "coming-soon", price: 3500,
      tags: ["Bluetooth", "Companion app", "Year-long battery"],
      blurb: "Small Bluetooth tags for keys and bags, tracked through the ASB Gear companion app, with a replaceable year-long battery."
    }

  ];
})();
