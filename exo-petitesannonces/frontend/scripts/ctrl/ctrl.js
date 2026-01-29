/* 
    Auteur: Nicolas Rouiller
    Description: Contrôleur de la page index.html
*/

import { IndexService } from "../wrk/indexService.js";

/**
 * Classe de contrôle pour gérer les interactions de l'utilisateur avec l'interface.
 */
export class Ctrl {
    #indexService;

    /**
     * Constructeur de la classe Ctrl.
     * Initialise le service d'annonces et charge toutes les annonces.
     */
    constructor() {
        this.#indexService = new IndexService();
        this.#afficherToutesLesAnnonces();

        // Gestionnaire d'événements pour le formulaire d'ajout d'annonce
        document.getElementById('addAnnonceForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const titre = document.getElementById('annonceTitle').value;
            const description = document.getElementById('annonceDescription').value;
            await this.#indexService.addAnnonce(titre, description);
            // Vider le conteneur et recharger les annonces après l'ajout
            document.getElementById('annonces-container').innerHTML = '';
            bootstrap.Modal.getInstance(document.getElementById('addAnnonceModal')).hide();
            document.getElementById('annonceTitle').value = ''; // Réinitialiser le champ titre
            document.getElementById('annonceDescription').value = ''; // Réinitialiser le champ description
            // Recharger toutes les annonces après l'ajout
            await this.#afficherToutesLesAnnonces();
        });

    }

    /**
     * Affiche toutes les annonces dans le conteneur d'annonces.
     * Vide le conteneur avant d'ajouter les annonces.
     */
    async #afficherToutesLesAnnonces() {
        let annonces = await this.#indexService.getAllAnnonces();
        let annoncesContainer = document.getElementById('annonces-container');
        annoncesContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les annonces

        for (let annonce of annonces) {
            let annonceDiv = document.createElement('div');
            annonceDiv.className = 'col-md-4 mb-4';
            annonceDiv.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${annonce.id}</h5>
                            <p class="card-text">${annonce.titre}</p>
                            <p class="card-text text-primary fw-bold">${annonce.description}</p>
                            <a class="link link-danger delete-annonce-link" data-id="${annonce.id}" href="#">Supprimer</a>
                        </div>
                    </div>
                `;
            annoncesContainer.appendChild(annonceDiv);
        }

        // Ajouter un gestionnaire d'événements pour les liens de suppression
        let deleteLinks = document.querySelectorAll('.delete-annonce-link');
        deleteLinks.forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault(); // Empêcher le comportement par défaut du lien
                let annonceId = link.getAttribute('data-id');
                await this.#indexService.deleteAnnonce(annonceId);
                // Vider le conteneur et recharger les annonces après la suppression
                annoncesContainer.innerHTML = '';
                await this.#afficherToutesLesAnnonces();
            });
        });

    };

}