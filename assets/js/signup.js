(function () {
  "use strict";

  var cfg = window.HSP || {};
  var endpoint = cfg.signupEndpoint || "";
  var contact = cfg.contactEmail || "";

  document.querySelectorAll("a[data-contact]").forEach(function (a) {
    if (!contact) return;
    a.href = "mailto:" + contact;
    if (a.dataset.contact === "show") a.textContent = contact;
  });

  document.querySelectorAll("form[data-signup]").forEach(function (form) {
    var field = form.querySelector('input[type="email"]');
    var button = form.querySelector("button");
    var status = form.parentNode.querySelector("[data-signup-status]");
    var trap = form.querySelector('input[name="website"]');
    var buttonLabel = button ? button.textContent : "";

    function say(message, state) {
      if (!status) return;
      status.textContent = message;
      status.setAttribute("data-state", state || "info");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (trap && trap.value) return;            // bot filled the hidden field

      var email = (field.value || "").trim();
      if (!email || !field.checkValidity()) {
        say("That address does not look complete. Please check it and try again.", "error");
        field.focus();
        return;
      }

      if (!endpoint) {
        // No backend connected yet — hand the reader off to their mail client.
        window.location.href =
          "mailto:" + contact +
          "?subject=" + encodeURIComponent("Rising and Falling — notify me") +
          "&body=" + encodeURIComponent("Please let me know when the book is published.\n\n" + email);
        say("Opening your email app. Send the message and we will add you to the list.", "info");
        return;
      }

      if (button) { button.disabled = true; button.textContent = "Sending"; }
      say("", "info");

      var body = new URLSearchParams({
        email: email,
        source: document.title,
        page: window.location.pathname
      });

      // text/plain keeps the request simple so Apps Script answers without a
      // CORS preflight it cannot handle.
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: body.toString()
      })
        .then(function (res) { if (!res.ok) throw new Error(res.status); return res.text(); })
        .then(function () {
          form.hidden = true;
          say("Thank you. We will write to you once Rising and Falling is published.", "done");
        })
        .catch(function () {
          if (button) { button.disabled = false; button.textContent = buttonLabel; }
          say("We could not reach the list just now. Please write to " + contact + " instead.", "error");
        });
    });
  });
})();
