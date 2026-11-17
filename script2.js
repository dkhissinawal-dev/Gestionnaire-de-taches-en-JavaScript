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