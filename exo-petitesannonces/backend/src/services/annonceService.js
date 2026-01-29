/**
 * Service pour les manipulations CRUD des annonces.
 * 
 * @author ROU
 * @version 1.0
 */
const db = require('../utils/db_pool');

/**
 * Récupère toutes les annonces.
 * @returns {Promise<Array<Annonce>>} - Liste des annonces.
 */
const getAllAnnonces = async () => {
    const annonces = (await db.request('SELECT * FROM t_annonce', []))[0];
    const results = [];
    annonces.forEach(annonce => {
        results.push({id: annonce.pk_annonce, titre: annonce.titre, description: annonce.description});
    });
    return results;
};

/**
 * Récupère une annonce par ID.
 * @param {number} id - L'identifiant de l'annonce.
 * @returns {Annonce|null} - L'annonce trouvée ou null si non trouvée.
 */
const getAnnonceById = async (id) => {
    const annonce = (await db.request('SELECT * FROM t_annonce WHERE pk_annonce = ?', [id]))[0];
    if (annonce && annonce.length > 0) {
        return {id: annonce[0].pk_annonce, titre: annonce[0].titre, description: annonce[0].description};
    } else {
        return null;
    }
};

module.exports = {
    getAllAnnonces,
    getAnnonceById
};