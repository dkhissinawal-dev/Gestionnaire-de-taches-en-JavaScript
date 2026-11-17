

/**Données */

const $ = (elem) => document.querySelector(elem)
const $a = (elem) => document.querySelectorAll(elem)

let form = $('form')

let conteneur = $('#conteneur-taches')
let liste_tache = []



/**Fonctions */
function afficher(donnees){

    for (doc in donnees){
       console.log(doc);
       
       let div = document.createElement('div');
       //div.style.backgroundColor = "blue"
       div.textContent = donnees[doc]
    
       conteneur.appendChild(div)
    }
    
    //conteneur.textContent = liste_tache
    
}
function ajouter(donnees) {

    liste_tache.push(donnees)

    /// loca set
      localStorage.setItem('tache', JSON.stringify(liste_tache));
    let data = JSON.parse(localStorage.getItem('tache'));

    afficher(donnees);

}

function modifier(id, nouvellesDonnees) {
    const index = liste_tache.findIndex((t) => t.id === id)
    if (index === -1) return

    // modifier anciennes valeurs par nouvelles
    liste_tache[index] = { ...liste_tache[index], ...nouvellesDonnees }

    localStorage.setItem('tache', JSON.stringify(liste_tache))
    afficher(liste_tache)
}


function supprimer(id) {
    const index = liste_tache.findIndex((t) => t.id === id)
    if (index === -1) return

    liste_tache.splice(index, 1)

    localStorage.setItem('tache', JSON.stringify(liste_tache))
    afficher(liste_tache)
}

function filtrer(statut) {
    if (statut === 'toutes') {
        afficher(liste_tache)
        return
    }
    const resultat = liste_tache.filter((t) => t.statut === statut)
    afficher(resultat)
}


function rechercher(texte) {
    const mot = texte.trim().toLowerCase()

    const resultat = liste_tache.filter((t) =>
        t.titre.toLowerCase().includes(mot) ||
        t.description.toLowerCase().includes(mot)
    )
    afficher(resultat)
}

/** Fonctions principales */

form.addEventListener("submit", (e) => {

    e.preventDefault();

    let donnees_form = {
        titre: $('#titre').value,
        description: $('#description').value,
        statut: $('#statut').value
    };

    
    console.log(donnees_form);
    

    ajouter(donnees_form)
})