/**
 * Gestionnaire des routes pour les annonces.
 * 
 * @author Les enseignants EMF du module 324
 * @version 1.0
 */

const express = require('express');
const annonceService = require('../services/annonceService');

const router = express.Router();

/**
 * Route pour récupérer toutes les annonces.
 * @route GET /read
 * @group Annonces - Opérations sur les annonces
 * @returns {Array.<Annonce>} 200 - Liste des annonces
 * @returns {Error} 500 - Erreur serveur
 */
router.get('/read', async (req, res) => {
    try {
        const annonces = await annonceService.getAllAnnonces();
        res.status(200).json(annonces);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

/**
 * Route pour récupérer une annonce par ID.
 * @route GET /read/:id
 * @group Annonces - Opérations sur les annonces
 * @param {string} id.path.required - ID de l'annonce
 * @returns {Annonce.model} 200 - Annonce trouvée
 * @returns {Error} 404 - Annonce non trouvée
 * @returns {Error} 500 - Erreur serveur
 */
router.get('/read/:id', async (req, res) => {
    try {
        const annonce = await annonceService.getAnnonceById(req.params.id);
        if (annonce === null) {
            res.status(404).json({ message: "Annonce non trouvée" });
            return;
        }
        res.status(200).json(annonce);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;