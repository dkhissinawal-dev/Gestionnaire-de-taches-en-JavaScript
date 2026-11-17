const form = document.querySelector("#form-tache");
const champTitre = document.querySelector("#titre");
const champDescription = document.querySelector("#description");
const champStatut = document.querySelector("#statut");
const champRecherche = document.querySelector("#recherche");
const filtreStatut = document.querySelector("#filtre-statut");
const conteneurTaches = document.querySelector("#conteneur-taches");
const messageErreur = document.querySelector("#message-erreur");
const messageVide = document.querySelector("#message-vide");
const titreFormulaire = document.querySelector("#titre-formulaire");
const boutonAjouter = document.querySelector("#bouton-ajouter");
const boutonAnnuler = document.querySelector("#bouton-annuler");

const cleStockage = "taches";
const couleursStatut = {
    "à faire": "#2563eb",
    "en cours": "#f97316",
    "terminée": "#16a34a",
    "bloquée": "#dc2626"
};
const statuts = Object.keys(couleursStatut);

let taches = chargerTaches();
let idEnCoursDeModification = null;

function chargerTaches() {
    try {
        const donnees = localStorage.getItem(cleStockage);
        if (donnees === null) {
            return [];
        }

        const tachesEnregistrees = JSON.parse(donnees);
        const formatValide = Array.isArray(tachesEnregistrees)
            && tachesEnregistrees.every((tache) =>
                tache
                && (typeof tache.id === "number" || typeof tache.id === "string")
                && typeof tache.titre === "string"
                && typeof tache.description === "string"
                && statuts.includes(tache.statut)
                && typeof tache.createdAt === "string"
            );

        if (!formatValide) {
            throw new Error("Les tâches enregistrées ont un format invalide.");
        }

        return tachesEnregistrees.map((tache) => ({
            ...tache,
            couleur: couleursStatut[tache.statut]
        }));
    } catch (erreur) {
        messageErreur.textContent = "Impossible de charger les tâches enregistrées.";
        console.error(erreur);
        return [];
    }
}

function sauvegarderTaches() {
    try {
        localStorage.setItem(cleStockage, JSON.stringify(taches));
        return true;
    } catch (erreur) {
        messageErreur.textContent = "Impossible de sauvegarder les tâches dans le navigateur.";
        console.error(erreur);
        return false;
    }
}

function afficherTaches() {
    const recherche = champRecherche.value.trim().toLocaleLowerCase("fr-FR");
    const statutChoisi = filtreStatut.value;
    const tachesAffichees = taches.filter((tache) => {
        const correspondAuStatut = statutChoisi === "toutes"
            || tache.statut === statutChoisi;
        const texteTache = `${tache.titre} ${tache.description}`
            .toLocaleLowerCase("fr-FR");
        const correspondALaRecherche = texteTache.includes(recherche);

        return correspondAuStatut && correspondALaRecherche;
    });

    conteneurTaches.replaceChildren();

    tachesAffichees.forEach((tache) => {
        conteneurTaches.appendChild(creerCarteTache(tache));
    });

    messageVide.hidden = tachesAffichees.length > 0;
    if (taches.length === 0) {
        messageVide.textContent = "Aucune tâche pour le moment.";
    } else {
        messageVide.textContent = "Aucune tâche ne correspond à la recherche ou au filtre.";
    }

    afficherStatistiques();
}

function creerCarteTache(tache) {
    const carte = document.createElement("article");
    carte.className = "carte-tache";

    const entete = document.createElement("div");
    entete.className = "entete-carte";

    const titre = document.createElement("h3");
    titre.textContent = tache.titre;

    const badge = document.createElement("span");
    badge.className = "badge-statut";
    badge.textContent = tache.statut;
    badge.style.backgroundColor = tache.couleur;

    entete.append(titre, badge);
    carte.appendChild(entete);

    if (tache.description) {
        const description = document.createElement("p");
        description.className = "description-tache";
        description.textContent = tache.description;
        carte.appendChild(description);
    }

    const date = document.createElement("small");
    date.className = "date-tache";
    date.textContent = `Créée le ${new Date(tache.createdAt).toLocaleDateString("fr-FR")}`;
    carte.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "actions-carte";

    const boutonModifier = document.createElement("button");
    boutonModifier.type = "button";
    boutonModifier.className = "bouton-modifier";
    boutonModifier.textContent = "Modifier";
    boutonModifier.addEventListener("click", () => commencerModification(tache));

    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.type = "button";
    boutonSupprimer.className = "bouton-supprimer";
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.addEventListener("click", () => supprimerTache(tache.id));

    actions.append(boutonModifier, boutonSupprimer);
    carte.appendChild(actions);

    return carte;
}

function afficherStatistiques() {
    document.querySelector("#total-taches").textContent = taches.length;
    document.querySelector("#nombre-a-faire").textContent =
        taches.filter((tache) => tache.statut === "à faire").length;
    document.querySelector("#nombre-en-cours").textContent =
        taches.filter((tache) => tache.statut === "en cours").length;
    document.querySelector("#nombre-terminees").textContent =
        taches.filter((tache) => tache.statut === "terminée").length;
    document.querySelector("#nombre-bloquees").textContent =
        taches.filter((tache) => tache.statut === "bloquée").length;
}

function creerNouvelId() {
    let id = Date.now();
    while (taches.some((tache) => tache.id === id)) {
        id += 1;
    }
    return id;
}

function commencerModification(tache) {
    idEnCoursDeModification = tache.id;
    champTitre.value = tache.titre;
    champDescription.value = tache.description;
    champStatut.value = tache.statut;

    titreFormulaire.textContent = "Modifier une tâche";
    boutonAjouter.textContent = "Enregistrer les modifications";
    boutonAnnuler.hidden = false;
    champTitre.focus();
}

function annulerModification() {
    idEnCoursDeModification = null;
    form.reset();
    titreFormulaire.textContent = "Ajouter une tâche";
    boutonAjouter.textContent = "Ajouter une tâche";
    boutonAnnuler.hidden = true;
}

function supprimerTache(id) {
    taches = taches.filter((tache) => tache.id !== id);

    if (idEnCoursDeModification === id) {
        annulerModification();
    }

    sauvegarderTaches();
    afficherTaches();
}

form.addEventListener("submit", (evenement) => {
    evenement.preventDefault();
    messageErreur.textContent = "";

    const titre = champTitre.value.trim();
    if (!titre) {
        messageErreur.textContent = "Le titre de la tâche est obligatoire.";
        champTitre.focus();
        return;
    }

    const statut = champStatut.value;
    const donneesTache = {
        titre,
        description: champDescription.value.trim(),
        statut,
        couleur: couleursStatut[statut]
    };

    if (idEnCoursDeModification === null) {
        taches.push({
            id: creerNouvelId(),
            ...donneesTache,
            createdAt: new Date().toISOString()
        });
    } else {
        const tacheAModifier = taches.find(
            (tache) => tache.id === idEnCoursDeModification
        );
        if (tacheAModifier) {
            Object.assign(tacheAModifier, donneesTache);
        }
    }

    sauvegarderTaches();
    annulerModification();
    afficherTaches();
});

boutonAnnuler.addEventListener("click", annulerModification);
champRecherche.addEventListener("input", afficherTaches);
filtreStatut.addEventListener("change", afficherTaches);

afficherTaches();
