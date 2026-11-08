/* ============================================================
   Vos Cura — main.js
   Navigation, Scroll-Effekte, Formular (ohne externe Abhängigkeiten)
   ============================================================ */
(function () {
  "use strict";

  /* ---- Jahr im Footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header: Schatten/Hintergrund beim Scrollen ---- */
  var header = document.querySelector(".header");
  var onScroll = function () {
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobiles Menü ---- */
  var toggle = document.querySelector(".nav__toggle");
  var closeMenu = function () {
    document.body.classList.remove("menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  };
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".mobile-menu a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Reveal beim Scrollen ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Kontaktformular ---- */
  /* Hinweis: Ohne Server-Backend wird die Anfrage per mailto an das
     Postfach übergeben. Für den Produktivbetrieb kann hier ein echter
     Endpunkt (z. B. eigenes Backend oder Formular-Dienst) angebunden werden. */
  var EMPFAENGER = "kontakt@voscura.de"; // TODO: echte Adresse eintragen
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var get = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };

      var topic = get("topic") || "Anfrage";
      var betreff = "Vos Cura – " + topic + " von " + (get("name") || "Website");
      var body =
        "Name: " + get("name") + "\n" +
        "Einrichtung / Rolle: " + (get("org") || "-") + "\n" +
        "E-Mail: " + get("email") + "\n" +
        "Telefon: " + (get("phone") || "-") + "\n" +
        "Anliegen: " + topic + "\n\n" +
        "Nachricht:\n" + get("message") + "\n";

      var href =
        "mailto:" + EMPFAENGER +
        "?subject=" + encodeURIComponent(betreff) +
        "&body=" + encodeURIComponent(body);

      window.location.href = href;

      if (note) {
        note.textContent = "Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Bitte nur noch absenden – wir melden uns schnell.";
        note.style.color = "var(--violet-700)";
      }
    });
  }
})();
