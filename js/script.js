const CLES = {
    sombre: "modeSombre",
};

/* ==========================================
    MODE SOMBRE
=========================================== */
function appliquerModeSombre() {
    if (localStorage.getItem(CLES.sombre) === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("mode-sombre").checked = true;
    } else {
        document.body.classList.remove("dark-mode");
        document.getElementById("mode-sombre").checked = false;
    }
    document.documentElement.setAttribute(
        "data-bs-theme",
        localStorage.getItem(CLES.sombre) === "true" ? "dark" : "light",
    );
}

document.getElementById("mode-sombre").addEventListener("change", function () {
    localStorage.setItem(CLES.sombre, String(this.checked));
    appliquerModeSombre();
});

appliquerModeSombre();
/* ==========================================
    FORMULAIRE CONTACT
    validation et localStorage
========================================== */
const formulaireContact = document.querySelector(".formulaire-contact");

if (formulaireContact) {
    formulaireContact.noValidate = true;
    const prenom = document.getElementById("prenom");
    const nom = document.getElementById("nom");
    const courriel = document.getElementById("courriel");
    const telephone = document.getElementById("telephone");
    const message = document.getElementById("message");

    const raisons = formulaireContact.querySelectorAll('input[name="raison"]');
    const consentement = formulaireContact.querySelector(
        'input[name="consentement"]',
    );

    const champs = [prenom, nom, courriel, telephone, message];

    // ==========================================
    // afficher les erreurs
    // ==========================================

    function afficherErreur(champ, texte) {
        let erreur = champ.parentElement.querySelector(".erreur-js");
        if (!erreur) {
            erreur = document.createElement("small");
            erreur.classList.add("erreur-js");
            champ.parentElement.appendChild(erreur);
        }
        erreur.textContent = texte;
        erreur.style.color = "#e05252";
        erreur.style.display = "block";
        erreur.style.marginTop = "5px";
    }
    // ==========================================
    // effacer les erreurs
    // ==========================================

    function effacerErreur(champ) {
        const erreur = champ.parentElement.querySelector(".erreur-js");
        if (erreur) {
            erreur.remove();
        }
    }
    // ==========================================
    // valider un champ
    // ==========================================

    function validerChamp(champ) {
        const valeur = champ.value.trim();
        // champs obligatoires
        if (champ.required && valeur === "") {
            afficherErreur(champ, "Ce champ est obligatoire.");
            return false;
        }
        // prénom et nom
        if (champ === prenom || champ === nom) {
            if (valeur.length < 2) {
                afficherErreur(champ, "Entrez au moins 2 caractères.");
                return false;
            }
        }
        // courriel
        if (champ === courriel) {
            const formatCourriel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formatCourriel.test(valeur)) {
                afficherErreur(champ, "Entrez une adresse courriel valide.");
                return false;
            }
        }
        // téléphone (facultatif)
        if (champ === telephone && valeur !== "") {
            const chiffres = valeur.replace(/\D/g, "");

            if (chiffres.length !== 10) {
                afficherErreur(
                    champ,
                    "Entrez un numéro de téléphone à 10 chiffres.",
                );
                return false;
            }
        }
        // message
        if (champ === message && valeur.length < 10) {
            afficherErreur(
                champ,
                "Votre message doit contenir au moins 10 caractères.",
            );
            return false;
        }
        effacerErreur(champ);
        return true;
    }

    // ==========================================
    // PRÉ-REMPLISSAGE LOCALSTORAGE
    // ==========================================

    prenom.value = localStorage.getItem("contact_prenom") || "";
    nom.value = localStorage.getItem("contact_nom") || "";
    courriel.value = localStorage.getItem("contact_courriel") || "";
    telephone.value = localStorage.getItem("contact_telephone") || "";

    // ==========================================
    // VALIDATION EN TEMPS RÉEL
    // ==========================================

    champs.forEach(function (champ) {
        champ.addEventListener("input", function () {
            validerChamp(champ);
            // Sauvegarder les informations non sensibles
            if (champ === prenom) {
                localStorage.setItem("contact_prenom", champ.value);
            }
            if (champ === nom) {
                localStorage.setItem("contact_nom", champ.value);
            }
            if (champ === courriel) {
                localStorage.setItem("contact_courriel", champ.value);
            }
            if (champ === telephone) {
                localStorage.setItem("contact_telephone", champ.value);
            }
        });
    });

    // ==========================================
    // VALIDATION DU FORMULAIRE
    // ==========================================

    formulaireContact.addEventListener("submit", function (event) {
        event.preventDefault();
        let formulaireValide = true;

        // vérifier tous les champs
        champs.forEach(function (champ) {
            if (!validerChamp(champ)) {
                formulaireValide = false;
            }
        });

        // vérifier la raison du contact
        const raisonChoisie = formulaireContact.querySelector(
            'input[name="raison"]:checked',
        );
        const groupeRaison = formulaireContact.querySelector(".type-demande");
        if (!raisonChoisie) {
            afficherErreur(groupeRaison, "Veuillez sélectionner une raison.");
            formulaireValide = false;
        } else {
            effacerErreur(groupeRaison);
        }

        // vérifier le consentement
        if (!consentement.checked) {
            afficherErreur(
                consentement,
                "Vous devez accepter le consentement.",
            );
            formulaireValide = false;
        } else {
            effacerErreur(consentement);
        }

        // ==========================================
        // ENVOI VALIDE
        // ==========================================
        if (formulaireValide) {
            // Créer un objet avec les informations du formulaire
            const demande = {
                prenom: prenom.value.trim(),
                nom: nom.value.trim(),
                courriel: courriel.value.trim(),
                telephone: telephone.value.trim(),
                raison: raisonChoisie.value,
                race: document.getElementById("race").value,
                chiot: document.getElementById("chiot").value,
                message: message.value.trim(),
                date: new Date().toLocaleString("fr-CA"),
            };

            // récupérer les anciennes demandes
            const demandes = JSON.parse(
                localStorage.getItem("mesDemandes") || "[]",
            );
            // ajouter la nouvelle demande
            demandes.push(demande);
            // sauvegarder le tableau dans le localStorage
            localStorage.setItem("mesDemandes", JSON.stringify(demandes));

            // redirection vers merci.html
            // avec les informations du formulaire
            const donnees = new FormData(formulaireContact);
            const parametres = new URLSearchParams(donnees);
            window.location.href = "merci.html?" + parametres.toString();
        }
    });

    // effacer les erreurs lorsque les choix sont corrigés
    raisons.forEach(function (raison) {
        raison.addEventListener("change", function () {
            const groupeRaison =
                formulaireContact.querySelector(".type-demande");
            effacerErreur(groupeRaison);
        });
    });
    consentement.addEventListener("change", function () {
        if (consentement.checked) {
            effacerErreur(consentement);
        }
    });
}
