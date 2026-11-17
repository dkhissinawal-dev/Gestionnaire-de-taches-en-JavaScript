

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

    let donnees_form = {
        titre: $('#titre').value,
        description: $('#description').value,
        statut: $('#statut').value
    };

    
    console.log(donnees_form);
    

    ajouter(donnees_form)
})
