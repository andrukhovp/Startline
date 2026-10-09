// Fills in the operator's details on the privacy and terms pages from config.js.
(() => {
  const C = window.STARTLINE_CONFIG || {};
  const who = (C.operatorName || "").trim(), mail = (C.contactEmail || "").trim();
  document.querySelectorAll("[data-operator]").forEach((n) => { n.textContent = who || "the person or organisation that runs this copy of Startline"; });
  document.querySelectorAll("[data-contact]").forEach((n) => {
    if (mail) { const a = document.createElement("a"); a.href = "mailto:" + mail; a.textContent = mail; n.replaceChildren(a); }
    else n.textContent = "No contact address has been added yet.";
  });
  document.querySelectorAll("[data-if-accounts]").forEach((n) => { n.hidden = !(C.supabaseUrl && C.supabaseAnonKey); });
  document.querySelectorAll("[data-if-google]").forEach((n) => { n.hidden = !C.googleSignIn; });
  document.querySelectorAll("[data-if-analytics]").forEach((n) => { n.hidden = !(C.analytics && C.analytics.provider); });
  document.querySelectorAll("[data-analytics-name]").forEach((n) => { n.textContent = ({ goatcounter: "GoatCounter", cloudflare: "Cloudflare Web Analytics" })[C.analytics && C.analytics.provider] || "a visitor-statistics service"; });
})();
