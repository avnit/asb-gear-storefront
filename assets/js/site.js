/* ASB Gear — minimal progressive enhancement. No dependencies, no build step. */
(function () {
  "use strict";

  // --- mobile navigation -----------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- mark the current page in the nav ---------------------------------
  var here = location.pathname.split("/").pop() || "index.html";
  Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
    var href = a.getAttribute("href") || "";
    if (href.split("/").pop() === here && !a.classList.contains("btn")) {
      a.setAttribute("aria-current", "page");
      a.style.color = "hsl(var(--primary))";
    }
  });

  // --- interest capture -------------------------------------------------
  // No checkout is wired up yet, so "Notify me" composes a pre-filled mail
  // to sales@ with the product context attached.
  Array.prototype.forEach.call(document.querySelectorAll("[data-interest]"), function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var product = el.getAttribute("data-interest");
      var subject = "Pre-order interest: " + product;
      var body = [
        "Hi ASB Gear team,",
        "",
        "I'd like to be notified when the " + product + " is available to order.",
        "",
        "Quantity interested in: ",
        "Name: ",
        "Ship-to city / country: ",
        "",
        "Thanks!"
      ].join("\n");

      window.location.href =
        "mailto:sales@asbsolutionsgroup.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  });

  // --- footer year ------------------------------------------------------
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
