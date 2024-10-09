const pool = require("../database");

class Options {

    static async add(campaignId, name, minParticipants, maxParticipants) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
    
            const optionId = Campaigns.generateRandomId(16);  // Assurez-vous que cette méthode existe et est accessible
    
            const addOptionQuery = `
                INSERT INTO options (id, campaignId, name, minParticipants, maxParticipants)
                VALUES (?, ?, ?, ?, ?);
            `;
            await connection.query(addOptionQuery, [optionId, campaignId, name, minParticipants, maxParticipants]);
    
            await connection.commit();
            return { optionId, name, minParticipants, maxParticipants }; // Renvoie les détails de l'option ajoutée
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Sélectionne toutes les options associées à une campagne donnée.
     *
     * @param {Object} param - Un objet contenant l'identifiant de la campagne.
     * @param {Number} param.campaignId - L'identifiant de la campagne pour laquelle récupérer les options.
     * @returns {Array} Un tableau d'options pour la campagne spécifiée.
     * @throws {Error} En cas de problème avec la requête ou la connexion à la base de données.
     */
    static async getAll({ campaignId }) {
        let connection;
        try {
            connection = await pool.getConnection();
            let rows;
            if (campaignId) {
                const query = `SELECT * FROM options WHERE campaignId = ?`;
                [rows] = await connection.query(query, [campaignId]);
            }

            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection !== undefined) connection.release();
        }
    }

    /**
     * Récupère une option spécifique par `optionId`.
     *
     * @param {Number} optionId - L'identifiant unique de l'option.
     * @returns {Object} Un objet représentant les informations de l'option.
     * @throws {Error} En cas de problème avec la requête ou la connexion à la base de données.
     */
    static async getFromId(optionId) {
        let connection;
        try {
            connection = await pool.getConnection();
            const query = `SELECT * FROM options WHERE id = ?`;
            const [rows] = await connection.query(query, [optionId]);

            return rows[0]; // Retourne l'option sous forme d'objet (ou `undefined` si aucune option n'est trouvée)
        } catch (error) {
            throw error;
        } finally {
            if (connection !== undefined) connection.release();
        }
    }

    /**
     * Modifie les informations d'une option spécifique.
     *
     * @param {Object} optionData - Un objet contenant les informations à mettre à jour pour l'option.
     * @param {String} optionData.id - L'identifiant unique de l'option.
     * @param {String} optionData.name - Le nouveau nom de l'option.
     * @param {Number} optionData.minParticipants - Le nouveau nombre minimal de participants.
     * @param {Number} optionData.maxParticipants - Le nouveau nombre maximal de participants.
     * @returns {void} Ne retourne rien, mais applique les modifications dans la base de données.
     * @throws {Error} En cas d'erreur lors de la mise à jour de l'option.
     */
    static async edit(optionData) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const updateOptionQuery = `
                UPDATE options
                SET name = ?, minParticipants = ?, maxParticipants = ?
                WHERE id = ?;
            `;
            await connection.query(updateOptionQuery, [optionData.name, optionData.minParticipants, optionData.maxParticipants, optionData.id]);

            await connection.commit();
            
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Supprime une option spécifique en fonction de son `optionId`.
     *
     * @param {String} optionId - L'identifiant unique de l'option à supprimer.
     * @returns {void} Supprime l'option de la base de données.
     * @throws {Error} En cas d'erreur lors de la suppression.
     */
    static async delete(optionId) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Supprime les souhaits associés à cette option
            await connection.query("DELETE FROM participantWishes WHERE optionId = ?", [optionId]);

            // Supprime l'option
            await connection.query("DELETE FROM options WHERE id = ?", [optionId]);

            await connection.commit();
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

}

module.exports = Options;