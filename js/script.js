

/**Données */

const $ = (elem) => document.querySelector(elem)
const $a = (elem) => document.querySelectorAll(elem)

let donees = {
titre: $(''),
descriptiion: $(''),
statut: $()
};

localStorage.setItem('tache', JSON.stringify(donees));
let data = JSON.parse(localStorage.getItem('tache'));
console.log(data.titre);

/**Fonctions */

function ajouter {

}

function modifier{

}

function supprimer{

}

function filtrer {

}

function rechercher{

}

/** Fonctions principales */

