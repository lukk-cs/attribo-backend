const pool = require("../database");
const crypto = require('crypto');

class Campaigns {

    /**
     * Génère un identifiant alphanumérique aléatoire d'une longueur spécifiée.
     *
     * @param {Number} length - La longueur de l'ID à générer. Par défaut 16.
     * @returns {String} Un identifiant alphanumérique aléatoire.
     */
    static generateRandomId(length = 16) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

/**
 * Récupère toutes les campagnes créées par un utilisateur donné, avec des détails supplémentaires.
 *
 * @param {Object} param - Un objet contenant l'identifiant de l'utilisateur.
 * @param {Number} param.userId - L'identifiant de l'utilisateur créateur des campagnes.
 * @returns {Array} Un tableau d'objets représentant les campagnes avec des détails étendus.
 * @throws {Error} En cas de problème avec la requête ou la connexion à la base de données.
 */
static async getAll({ userId }) {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
        SELECT 
            campaigns.id,
            campaigns.name,
            campaigns.start,
            campaigns.end,
            (SELECT COUNT(DISTINCT participants.id) FROM participants WHERE participants.campaignId = campaigns.id) AS participants,
            (SELECT COUNT(*) FROM options WHERE options.campaignId = campaigns.id) AS options,
            CASE 
                WHEN NOW() < campaigns.start THEN 'pending'
                WHEN NOW() BETWEEN campaigns.start AND campaigns.end THEN 'active'
                WHEN NOW() > campaigns.end THEN 'finished'
            END AS status
        FROM campaigns
        WHERE campaigns.creatorId = ?
        `;
        const [rows] = await connection.query(query, [userId]);

        return rows;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
    

/**
 * Récupère les informations d'une campagne à partir de son identifiant.
 *
 * @param {String} id - L'identifiant unique de la campagne.
 * @returns {Object} Un objet contenant les détails de la campagne :
 * - name : Le nom de la campagne.
 * - start : La date de début de la campagne.
 * - end : La date de fin de la campagne.
 * - status : Statut de la campagne ("pending", "ongoing", ou "finished").
 * - minParticipants : Le nombre total de places minimales disponibles pour les options.
 * - maxParticipants : Le nombre total de places maximales disponibles pour les options.
 * - participants : Le nombre total de participants inscrits à la campagne.
 * - wishRankings : Le nombre de participants qui ont des vœux classés.
 * @throws {Error} Si la campagne n'existe pas ou en cas d'erreur lors de la récupération des informations.
 */
static async getFromId(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
        SELECT 
            campaigns.name,
            campaigns.start,
            campaigns.end,
            CASE 
                WHEN NOW() < campaigns.start THEN 'pending'
                WHEN NOW() BETWEEN campaigns.start AND campaigns.end THEN 'active'
                WHEN NOW() > campaigns.end THEN 'finished'
            END AS status,
            SUM(options.minParticipants) AS minParticipants,
            SUM(options.maxParticipants) AS maxParticipants,
            COUNT(DISTINCT participants.id) AS participants,
            COUNT(DISTINCT participantWishes.participantId) AS wishRankings

        FROM campaigns
        LEFT JOIN options
            ON options.campaignId = campaigns.id
        LEFT JOIN participants
            ON participants.campaignId = campaigns.id
        LEFT JOIN participantWishes
            ON participantWishes.participantId = participants.id
        WHERE campaigns.id = ?

        GROUP BY campaigns.id
        `;
        const [rows] = await connection.query(query, [id]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            throw new Error("Cette campagne n'existe pas !");
        }
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


    /**
     * Ajoute une nouvelle campagne dans la base de données.
     *
     * @param {Object} campaignData - Un objet contenant les informations de la campagne.
     * @param {String} campaignData.name - Le nom de la campagne.
     * @param {Number} campaignData.creatorId - L'identifiant de l'utilisateur qui crée la campagne.
     * @param {String} campaignData.start - La date de début de la campagne (format YYYY-MM-DD).
     * @param {String} campaignData.end - La date de fin de la campagne (format YYYY-MM-DD).
     * @returns {void} Ne retourne rien, mais crée la campagne dans la base de données.
     * @throws {Error} En cas d'erreur lors de la création de la campagne dans la base de données.
     */
    static async add(campaignData) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const campaignId = Campaigns.generateRandomId(16);

            const addCampaignQuery = `
                INSERT INTO campaigns (id, name, creatorId, start, end)
                VALUES (?, ?, ?, ?, ?);
            `;
            const { name, creatorId, start, end } = campaignData;
            await connection.query(addCampaignQuery, [campaignId, name, creatorId, start, end]);

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
     * Modifie les informations d'une campagne, y compris son nom, les dates de début et de fin.
     *
     * @param {Object} campaignData - Un objet contenant les informations à mettre à jour pour la campagne.
     * @param {String} campaignData.id - L'identifiant unique de la campagne.
     * @param {String} campaignData.name - Le nouveau nom de la campagne.
     * @param {String} campaignData.start - La nouvelle date de début de la campagne (format YYYY-MM-DD).
     * @param {String} campaignData.end - La nouvelle date de fin de la campagne (format YYYY-MM-DD).
     * @returns {void} Ne retourne rien, mais applique les modifications dans la base de données.
     * @throws {Error} Si la campagne n'existe pas ou en cas d'erreur lors de la mise à jour.
     */
    static async edit(campaignData) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const updateCampaignQuery = `
                UPDATE campaigns
                SET name = ?, start = ?, end = ?
                WHERE id = ?;
            `;
            await connection.query(updateCampaignQuery, [campaignData.name, campaignData.start, campaignData.end, campaignData.id]);

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
     * Supprime une campagne en fonction de son `campaignId`.
     *
     * @param {String} campaignId - L'identifiant unique de la campagne à supprimer.
     * @returns {void} Supprime la campagne de la base de données.
     * @throws {Error} En cas d'erreur lors de la suppression.
     */
    static async delete(campaignId) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Supprime les options liées à la campagne
            await connection.query("DELETE FROM options WHERE campaignId = ?", [campaignId]);

            // Supprime les participants liés à la campagne
            await connection.query("DELETE FROM participants WHERE campaignId = ?", [campaignId]);

            // Supprime la campagne
            await connection.query("DELETE FROM campaigns WHERE id = ?", [campaignId]);

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

module.exports = Campaigns;