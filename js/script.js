

/**Données */

const $ = (elem) => document.querySelector(elem)
const $a = (elem) => document.querySelectorAll(elem)

let form = $('form')

let conteneur = $('#conteneur-taches')
let liste_tache = []



/**Fonctions */
function afficher(){
    for (let i=0 ; i<=2; i++){
      conteneur.createElement('div')
    }
    
}
function ajouter(donnees) {

    liste_tache.push(donnees)

     for (doc in donnees){
        let div = document.createElement('div');
      conteneur.appendChild(div)
      $('#conteneur-taches div').textContent = donnees[doc]
    }

    //conteneur.textContent = liste_tache

}

function modifier() {

}

function supprimer() {

}

function filtrer() {

}

function rechercher() {

}

/** Fonctions principales */

form.addEventListener("submit", (e) => {

    e.preventDefault();

    let donees_form = {
        titre: $('#titre').value,
        description: $('#description').value,
        statut: $('#statut').value
    };

    localStorage.setItem('tache', JSON.stringify(donees_form));
    let data = JSON.parse(localStorage.getItem('tache'));
    console.log(data);

    ajouter([data.titre, data.description, data.statut])
})
