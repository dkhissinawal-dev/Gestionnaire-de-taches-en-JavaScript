/** Raccourcis */

const $ = (elem) => document.querySelector(elem)
const $a = (elem) => document.querySelectorAll(elem)


/** Données */

const STATUTS = ['à faire', 'en cours', 'terminée', 'bloquée']

const COULEURS = {
    'à faire': 'bleu',
    'en cours': 'orange',
    'terminée': 'vert',
    'bloquée': 'rouge'
}

// Couleur réelle (code CSS) de chaque couleur, pour le badge de statut
const CODES_COULEURS = {
    'bleu': '#2563eb',
    'orange': '#ea580c',
    'vert': '#16a34a',
    'rouge': '#dc2626'
}

let form = $('#form-tache')
let conteneur = $('#conteneur-taches')

// Désactive la bulle d'erreur du navigateur (required) pour afficher notre propre message
form.noValidate = true

// On recharge ce qui a été sauvegardé (ou on part d'un tableau vide)
let liste_tache = chargerDepuisStockage()

// null = on ajoute une tâche ; sinon = id de la tâche en cours de modification
let idEnModification = null


/** Stockage */

function chargerDepuisStockage() {
    try {
        const data = JSON.parse(localStorage.getItem('tache'))
        return Array.isArray(data) ? data : []
    } catch (erreur) {
        return []
    }
}

function sauvegarder() {
    localStorage.setItem('tache', JSON.stringify(liste_tache))
}


/** Validation */

function valider(titre, statut) {
    if (titre.trim() === '') {
        return 'Le titre est obligatoire.'
    }
    if (!STATUTS.includes(statut)) {
        return 'Le statut choisi n\'est pas autorisé.'
    }
    return ''   // chaîne vide = tout est valide
}

function afficherErreur(message) {
    $('#message-erreur').textContent = message
}


/** Fonctions */

// Affiche un tableau de tâches sous forme de cartes
function afficher(donnees) {
    conteneur.innerHTML = ''

    donnees.forEach((tache) => {
        const carte = document.createElement('article')
        carte.classList.add('carte-tache')

        // En-tête : titre + badge de statut
        const entete = document.createElement('div')
        entete.classList.add('entete-carte')

        const titre = document.createElement('h3')
        titre.textContent = tache.titre

        const badge = document.createElement('span')
        badge.classList.add('badge-statut')
        badge.textContent = tache.statut
        badge.style.backgroundColor = CODES_COULEURS[tache.couleur]

        entete.append(titre, badge)

        // Description
        const description = document.createElement('p')
        description.classList.add('description-tache')
        description.textContent = tache.description || 'Aucune description.'

        // Date
        const date = document.createElement('p')
        date.classList.add('date-tache')
        date.textContent = 'Créée le ' + new Date(tache.createdAt).toLocaleDateString('fr-FR')

        // Boutons
        const actions = document.createElement('div')
        actions.classList.add('actions-carte')

        const btnModifier = document.createElement('button')
        btnModifier.type = 'button'
        btnModifier.textContent = 'Modifier'
        btnModifier.addEventListener('click', () => preparerModification(tache.id))

        const btnSupprimer = document.createElement('button')
        btnSupprimer.type = 'button'
        btnSupprimer.classList.add('bouton-supprimer')
        btnSupprimer.textContent = 'Supprimer'
        btnSupprimer.addEventListener('click', () => supprimer(tache.id))

        actions.append(btnModifier, btnSupprimer)
        carte.append(entete, description, date, actions)
        conteneur.appendChild(carte)
    })

    // Message quand il n'y a rien à afficher
    const messageVide = $('#message-vide')
    if (donnees.length === 0) {
        messageVide.textContent = liste_tache.length === 0
            ? 'Aucune tâche pour le moment.'
            : 'Aucune tâche ne correspond à votre recherche.'
        messageVide.style.display = 'block'
    } else {
        messageVide.style.display = 'none'
    }

    mettreAJourStatistiques()
}

function ajouter(donnees) {
    liste_tache.push(donnees)
    sauvegarder()
    appliquerFiltres()
}

function modifier(id, nouvellesDonnees) {
    const index = liste_tache.findIndex((t) => t.id === id)
    if (index === -1) return

    // On garde les anciennes valeurs et on remplace celles qui ont changé
    liste_tache[index] = { ...liste_tache[index], ...nouvellesDonnees }

    sauvegarder()
    appliquerFiltres()
}

function supprimer(id) {
    const index = liste_tache.findIndex((t) => t.id === id)
    if (index === -1) return

    if (!confirm('Supprimer cette tâche ?')) return

    liste_tache.splice(index, 1)

    // Si on supprime la tâche qu'on était en train de modifier, on remet le formulaire à zéro
    if (id === idEnModification) {
        reinitialiserFormulaire()
    }

    sauvegarder()
    appliquerFiltres()
}

// Garde seulement les tâches du statut choisi dans le menu
function filtrer(liste) {
    const statut = $('#filtre-statut').value
    if (statut === 'toutes') return liste
    return liste.filter((t) => t.statut === statut)
}

// Garde seulement les tâches dont le titre ou la description contient le texte
function rechercher(liste) {
    const mot = $('#recherche').value.trim().toLowerCase()
    if (mot === '') return liste

    return liste.filter((t) =>
        t.titre.toLowerCase().includes(mot) ||
        t.description.toLowerCase().includes(mot)
    )
}

// Applique le filtre ET la recherche, puis affiche le résultat
function appliquerFiltres() {
    afficher(rechercher(filtrer(liste_tache)))
}


/** Modification : remplir le formulaire */

function preparerModification(id) {
    const tache = liste_tache.find((t) => t.id === id)
    if (!tache) return

    idEnModification = id
    $('#titre').value = tache.titre
    $('#description').value = tache.description
    $('#statut').value = tache.statut

    $('#titre-formulaire').textContent = 'Modifier la tâche'
    $('#bouton-ajouter').textContent = 'Enregistrer les modifications'
    $('#bouton-annuler').hidden = false
    afficherErreur('')

    $('#titre').focus()
    form.scrollIntoView({ behavior: 'smooth' })
}

function reinitialiserFormulaire() {
    idEnModification = null
    form.reset()
    $('#titre-formulaire').textContent = 'Ajouter une tâche'
    $('#bouton-ajouter').textContent = 'Ajouter une tâche'
    $('#bouton-annuler').hidden = true
    afficherErreur('')
}


/** Statistiques */

function mettreAJourStatistiques() {
    const compter = (statut) => liste_tache.filter((t) => t.statut === statut).length

    $('#total-taches').textContent = liste_tache.length
    $('#nombre-a-faire').textContent = compter('à faire')
    $('#nombre-en-cours').textContent = compter('en cours')
    $('#nombre-terminees').textContent = compter('terminée')
    $('#nombre-bloquees').textContent = compter('bloquée')
}


/** Fonctions principales */

form.addEventListener('submit', (e) => {

    e.preventDefault()

    const titre = $('#titre').value
    const description = $('#description').value
    const statut = $('#statut').value

    const erreur = valider(titre, statut)
    if (erreur) {
        afficherErreur(erreur)
        return
    }

    if (idEnModification === null) {
        ajouter({
            id: Date.now(),
            titre: titre.trim(),
            description: description.trim(),
            statut: statut,
            createdAt: new Date().toISOString(),
            couleur: COULEURS[statut]
        })
    } else {
        modifier(idEnModification, {
            titre: titre.trim(),
            description: description.trim(),
            statut: statut,
            couleur: COULEURS[statut]
        })
    }

    reinitialiserFormulaire()
})

$('#bouton-annuler').addEventListener('click', reinitialiserFormulaire)
$('#filtre-statut').addEventListener('change', appliquerFiltres)
$('#recherche').addEventListener('input', appliquerFiltres)


/** Démarrage */
appliquerFiltres()