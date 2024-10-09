const pool = require("../database");
const crypto = require('crypto');

class Participants {

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
     * Récupère tous les participants d'une campagne donnée par `campaignId`.
     *
     * @param {Number} campaignId - L'identifiant de la campagne.
     * @returns {Array} Un tableau d'objets représentant les participants de la campagne.
     * @throws {Error} En cas de problème avec la requête ou la connexion à la base de données.
     */
    static async getAll(campaignId) {
        let connection;
        try {
            connection = await pool.getConnection();
            const query = `SELECT * FROM participants WHERE campaignId = ?`;
            const [rows] = await connection.query(query, [campaignId]);

            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection !== undefined) connection.release();
        }
    }

    /**
     * Récupère des informations détaillées sur un participant à partir de son identifiant.
     * Cela inclut l'identifiant du participant, son nom, et une liste de tous ses souhaits liés à la campagne en cours.
     * Les souhaits sont organisés selon leur classement et les souhaits non classés sont ajoutés à la fin.
     *
     * @param {Number} participantId - L'identifiant unique du participant.
     * @returns {Object} Un objet contenant l'identifiant du participant, son nom, et un tableau des souhaits organisés selon le classement spécifié.
     * @throws {Error} En cas d'erreur lors de la récupération des informations du participant ou de ses souhaits.
     */
    static async getFromId(participantId) {
        let connection;
        try {
            connection = await pool.getConnection();
            // Infos basiques sur le participant
            const participantQuery = `SELECT id, name FROM participants WHERE id = ?`;
            const [participantRows] = await connection.query(participantQuery, [participantId]);

            // Récupération de toutes les options liées à la campagne actuelle du participant, avec le classement des vœux
            const wishesQuery = `
            SELECT 
                o.id, 
                o.name, 
                o.minParticipants, 
                o.maxParticipants,
                pw.rank
            FROM options o
            LEFT JOIN participantWishes pw ON o.id = pw.optionId AND pw.participantId = ?
            WHERE o.campaignId = (SELECT campaignId FROM participants WHERE id = ?)
            `;
            const [wishesRows] = await connection.query(wishesQuery, [participantId, participantId]);

            // Initialisation d'un tableau pour le classement des souhaits
            let maxRank = wishesRows.reduce((max, { rank }) => rank ? Math.max(max, rank) : max, 0);
            const wishRanking = Array.from({ length: maxRank }).fill(null);

            // Placement des vœux classés dans leur position spécifique
            for (const wish of wishesRows) {
                if (wish.rank) {
                    wishRanking[wish.rank - 1] = {
                        id: wish.id,
                        name: wish.name,
                        minParticipants: wish.minParticipants,
                        maxParticipants: wish.maxParticipants
                    };
                }
            }

            // Ajout des options non classées à la fin ou dans les trous laissés
            let currentIndex = 0;
            for (const wish of wishesRows.filter(w => !w.rank)) { //prend uniquement les options qui n’ont pas de rang
                while (wishRanking[currentIndex]) { //saute les indices qui contiennent déjà un vœu classé
                    currentIndex++;
                }
                if (currentIndex < wishRanking.length) {
                    wishRanking[currentIndex] = {
                        id: wish.id,
                        name: wish.name,
                        minParticipants: wish.minParticipants,
                        maxParticipants: wish.maxParticipants
                    };
                } else {
                    wishRanking.push({
                        id: wish.id,
                        name: wish.name,
                        minParticipants: wish.minParticipants,
                        maxParticipants: wish.maxParticipants
                    });
                }
                currentIndex++;
            }

            // Filtration pour enlever les éventuels null restants
            const filteredWishRanking = wishRanking.filter(w => w);

            // Structuration de la réponse JSON
            const response = {
                id: participantRows[0]?.id,
                name: participantRows[0]?.name,
                wishRanking: filteredWishRanking
            };

            return response;
        } catch (error) {
            throw error;
        } finally {
            if (connection !== undefined) connection.release();
        }
    }

    /**
     * Modifie les informations d'un participant, y compris ses souhaits (vœux) et son nom.
     *
     * @param {Object} participant - Un objet contenant les informations du participant à modifier.
     * @param {Number} participant.id - L'identifiant unique du participant.
     * @param {String} participant.name - Le nouveau nom du participant.
     * @param {Array} participant.wishRanking - Un tableau des souhaits classés du participant, avec chaque élément contenant `id` de l'option et son rang.
     * @returns {void} Ne retourne rien, mais applique les modifications dans la base de données.
     * @throws {Error} En cas d'erreur lors de la modification des informations ou des souhaits du participant.
     */
    static async edit(participant) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
    
            // change le nom
            const updateNameQuery = `
                UPDATE participants
                SET name = ?
                WHERE id = ?;
            `;
            await connection.query(updateNameQuery, [participant.name, participant.id]);
    
            // supprime les choix de la bdd
            const deleteWishesQuery = `
                DELETE FROM participantWishes
                WHERE participantId = ?;
            `;
            await connection.query(deleteWishesQuery, [participant.id]);
    
            // ajoute les nv choix
            const addWishQuery = `
                INSERT INTO participantWishes (participantId, optionId, rank)
                VALUES (?, ?, ?);
            `;
            for (let i = 0; i < participant.wishRanking.length; i++) {
                let optionId = participant.wishRanking[i].id;
                let rank = i + 1;
                await connection.query(addWishQuery, [participant.id, optionId, rank]);
            }
    
            await connection.commit();
    
        } catch (error) {
            if (connection) {
                await connection.rollback(); // annule les changements
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }


    /**
     * Ajoute un nouveau participant dans la base de données.
     *
     * @param {Object} participantData - Un objet contenant les informations du participant à ajouter.
     * @param {Number} participantData.campaignId - L'identifiant de la campagne à laquelle le participant est ajouté.
     * @param {String} participantData.name - Le nom du participant.
     * @returns {void} Ne retourne rien, mais ajoute le participant dans la base de données.
     * @throws {Error} En cas d'erreur lors de l'ajout du participant.
     */
    static async add(participantData) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const participantId = Participants.generateRandomId(16);

            const addParticipantQuery = `
                INSERT INTO participants (id, campaignId, name)
                VALUES (?, ?, ?);
            `;

            const { campaignId, name } = participantData;
            await connection.query(addParticipantQuery, [participantId, campaignId, name]);

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
     * Supprime un participant spécifique en fonction de son `participantId`.
     *
     * @param {String} participantId - L'identifiant unique du participant à supprimer.
     * @returns {void} Supprime le participant de la base de données.
     * @throws {Error} En cas d'erreur lors de la suppression.
     */
    static async delete(participantId) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Supprime le participant et ses vœux
            await connection.query("DELETE FROM participantWishes WHERE participantId = ?", [participantId]);
            await connection.query("DELETE FROM participants WHERE id = ?", [participantId]);

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

module.exports = Participants;