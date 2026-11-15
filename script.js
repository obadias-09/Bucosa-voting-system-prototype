
const steps = document.querySelectorAll(".step");          // les 5 etapes
const progressItems = document.querySelectorAll("#progress li");
const positions = ["president", "vice", "secretary"];      // les 3 postes du vote
const positionNames = ["President", "Vice President", "Secretary"];
 
/* ---------- 2. Afficher une etape (numero 1 a 5) ---------- */
function showStep(number) {
  // On parcourt chaque etape : on montre seulement la bonne
  steps.forEach(function (step, index) {
    step.classList.toggle("visible", index === number - 1);
  });
  // On met a jour la barre de progression
  progressItems.forEach(function (item, index) {
    item.classList.toggle("active", index === number - 1);
    item.classList.toggle("done", index < number - 1);
  });
  window.scrollTo(0, 0);                                    // retour en haut de page
}
 
/* ---------- 3. Boutons de navigation (ceux qui ont data-go="...") ---------- */
document.querySelectorAll("[data-go]").forEach(function (button) {
  button.addEventListener("click", function () {
    showStep(Number(button.dataset.go));                    // lit le numero dans le HTML
  });
});
 
/* ---------- 4. ETAPE 2 : verifier l'electeur ---------- */
document.getElementById("btn-verify").addEventListener("click", function () {
  const studentId = document.getElementById("student-id").value.trim();
  const email = document.getElementById("email").value.trim();   // NOUVEAU : on lit l'email
  const code = document.getElementById("access-code").value.trim();
  const message = document.getElementById("error-verify");
 
  if (studentId.length < 4) {
    message.textContent = "Enter your student ID.";
    return;                                                 // on s'arrete ici
  }
  // NOUVEAU : un email valide contient un "@" suivi d'un "." plus loin (ex. nom@site.com)
  if (!email.includes("@") || !email.includes(".") || email.indexOf("@") > email.lastIndexOf(".")) {
    message.textContent = "Enter a valid email address.";
    return;
  }
  if (code.length < 6) {
    message.textContent = "The access code has 6 characters.";
    return;
  }
  message.textContent = "";                                 // pas d'erreur
  showStep(3);
});
 
/* ---------- 5. ETAPE 3 : verifier que tous les postes sont remplis ---------- */
document.getElementById("btn-review").addEventListener("click", function () {
  const message = document.getElementById("error-ballot");
 
  for (let i = 0; i < positions.length; i++) {
    const chosen = document.querySelector('input[name="' + positions[i] + '"]:checked');
    if (!chosen) {                                          // rien de coche ?
      message.textContent = "Choose an option for: " + positionNames[i] + ".";
      return;
    }
  }
  message.textContent = "";
  buildReview();
  showStep(4);
});
 
/* ---------- 6. ETAPE 4 : construire le recapitulatif ---------- */
function buildReview() {
  const list = document.getElementById("review-list");
  list.innerHTML = "";                                      // on vide la liste
 
  for (let i = 0; i < positions.length; i++) {
    const chosen = document.querySelector('input[name="' + positions[i] + '"]:checked');
    const line = document.createElement("li");              // on cree une ligne
    line.textContent = positionNames[i] + ": " + chosen.dataset.name;
    list.appendChild(line);                                 // on l'ajoute a la liste
  }
}
 
/* ---------- 7. ETAPE 5 : envoyer le vote et creer le recu ---------- */
document.getElementById("btn-submit").addEventListener("click", function () {
  // Dans la vraie version, c'est ICI qu'on enverrait le vote au serveur.
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let receipt = "";
  for (let i = 0; i < 8; i++) {
    receipt += letters[Math.floor(Math.random() * letters.length)];
  }
  document.getElementById("receipt").textContent = receipt.slice(0, 4) + "-" + receipt.slice(4);
  showStep(5);
});
 
/* ---------- 8. Recommencer l'apercu ---------- */
document.getElementById("btn-restart").addEventListener("click", function () {
  document.querySelectorAll('input[type="radio"]').forEach(function (r) { r.checked = false; });
  document.getElementById("student-id").value = "";
  document.getElementById("email").value = "";
  document.getElementById("access-code").value = "";
  showStep(1);
});
 
/* ---------- 9. ADMIN : afficher / cacher le tableau de bord ---------- */
const adminButton = document.getElementById("btn-admin");
const adminArea = document.getElementById("admin-area");
const voterArea = document.getElementById("voter-area");
 
adminButton.addEventListener("click", function () {
  const showingAdmin = !adminArea.classList.contains("hidden");
  adminArea.classList.toggle("hidden", showingAdmin);       // inverse l'etat
  voterArea.classList.toggle("hidden", !showingAdmin);
  adminButton.textContent = showingAdmin ? "Admin view" : "Voter view";
});
 
/* ---------- 10. ADMIN : ouvrir / fermer le scrutin ---------- */
const pollsButton = document.getElementById("btn-polls");
const pollsState = document.getElementById("polls-state");
let pollsOpen = true;
 
pollsButton.addEventListener("click", function () {
  pollsOpen = !pollsOpen;
  pollsState.textContent = pollsOpen ? "Open" : "Closed";
  pollsState.className = pollsOpen ? "status-open" : "status-closed";
  pollsButton.textContent = pollsOpen ? "Close polls" : "Reopen polls";
});
 
/* ---------- 11. Demarrage : on affiche l'etape 1 ---------- */
showStep(1);