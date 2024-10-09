const Campaigns = require("../models/campaigns");
const Participants = require("../models/participants");
const Options = require("../models/options");
const Joi = require('joi');


// Schéma pour la validation lors de l'ajout d'une nouvelle campagne.
const campaignSchema = Joi.object({
    name: Joi.string().min(1).max(32).required(),  // Nom de la campagne, requis, entre 1 et 32 caractères.
    start: Joi.date().iso().required(),            // Date de début de la campagne, au format ISO, requise.
    end: Joi.date().iso().min(Joi.ref('start')).required()  // Date de fin, au format ISO, doit être après la date de début, requise.
});

// Schéma pour la validation lors de la modification d'une campagne.
const editCampaignSchema = Joi.object({
    name: Joi.string().min(1).max(32),  // Nom de la campagne, optionnel, entre 1 et 32 caractères.
    start: Joi.date().iso(),            // Date de début, optionnelle, au format ISO.
    end: Joi.date().iso().min(Joi.ref('start')),  // Date de fin, optionnelle, au format ISO, doit être après la date de début si fournie.
    totalMinPlaces: Joi.number().integer().min(1),  // Nombre minimum de places, optionnel, doit être un entier positif.
    totalMaxPlaces: Joi.number().integer().min(Joi.ref('totalMinPlaces')).required()  // Nombre maximum de places, optionnel, doit être superieur a min.
});

// Schéma pour la validation lors de l'ajout d'un nouveau participant.
const participantSchema = Joi.object({
    name: Joi.string().min(1).max(32).required(),  // Nom du participant, requis.
    email: Joi.string().email().required()  // Email du participant, requis, doit être une adresse email valide.
});

// Schéma pour la validation lors de l'ajout d'une nouvelle option à une campagne.
const optionSchema = Joi.object({
    name: Joi.string().min(1).max(32).required(),  // Nom de l'option, requis, entre 1 et 32 caractères.
    minParticipants: Joi.number().integer().min(1).required(),  // Nombre minimum de participants, requis, entier positif.
    maxParticipants: Joi.number().integer().min(Joi.ref('minParticipants')).required()  // Nombre maximum de participants, requis, doit être au moins égal au minimum.
});

// Schéma pour la validation lors de la modification d'une option.
const editOptionSchema = Joi.object({
    name: Joi.string().min(1).max(32),  // Nom de l'option, optionnel, entre 1 et 32 caractères.
    minParticipants: Joi.number().integer().min(1),  // Nombre minimum de participants, optionnel, entier positif.
    maxParticipants: Joi.number().integer().min(Joi.ref('minParticipants'))  // Nombre maximum de participants, optionnel, doit être au moins égal au minimum si fourni.
});

// Schéma pour la validation lors de la modification des informations d'un participant.
const participantEditSchema = Joi.object({
    name: Joi.string().min(1).max(32),  // Nom du participant, optionnel, entre 3 et 100 caractères.
    email: Joi.string().email()  // Email du participant, optionnel, doit être une adresse email valide.
}).min(1);  // Au moins une des propriétés doit être fournie pour effectuer une mise à jour.

class CampaignController {

    //---------------------------- CAMPAIGNS ------------------------------------------------

    /**
     * Récupère toutes les campagnes associées à l'utilisateur connecté.
     *
     * @param {Object} req - L'objet requête Express.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne la liste des campagnes sous forme JSON.
     */
    static async getCampaigns(req, res) {
        const campaigns = await Campaigns.getAll({ userId: req.session.userId });
        res.json(campaigns);
    }

    /**
     * Ajoute une nouvelle campagne dans la base de données.
     *
     * @param {Object} req - L'objet requête Express avec les détails de la campagne dans `req.body`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou une erreur si la campagne n'a pas pu être créée.
     */
    static async addCampaign(req, res) {
        const { error, value } = campaignSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }

        try {
            const { name, start, end } = value;
            const creatorId = req.session.userId;
    
            await Campaigns.add({ name, creatorId, start, end });
    
            res.status(201).json({ message: "The campaign was successfully created !" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened during the creation of the campaign", details: error.message });
        }
    }
    
    /**
     * Récupère les informations d'une campagne à partir de son ID.
     *
     * @param {Object} req - L'objet requête Express avec `campaignId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne les informations de la campagne sous forme JSON ou un message d'erreur.
     */
    static async getCampaignInfo(req, res) {
        try {
            const infos = await Campaigns.getFromId(req.params.campaignId);
            res.json(infos);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while retrieving campaigns", details: error.message });
        }
    }


    /**
     * Modifie les informations d'une campagne spécifique.
     *
     * @param {Object} req - L'objet requête Express avec les nouvelles informations dans `req.body` et l'ID de la campagne dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou un message d'erreur.
     */
    static async editCampaign(req, res) {
        const { error, value } = editCampaignSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }

        try {
            const { name, start, end, totalMinPlaces, totalMaxPlaces } = value;
            const { campaignId } = req.params;
            
            await Campaigns.edit({ 
                id: campaignId,
                name,
                start,
                end,
                totalMinPlaces,
                totalMaxPlaces
            });

            res.status(200).json({ message: "The campaign was successfully edited." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened during the edition of the campaign !", details: error.message });
        }
    }

    /**
     * Supprime une campagne spécifique.
     *
     * @param {Object} req - L'objet requête Express avec `campaignId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou un message d'erreur.
     */
    static async deleteCampaign(req, res) {
        try {
            const { campaignId } = req.params;
            await Campaigns.delete(campaignId);
            res.status(200).json({ message: "The campaign was successfully deleted." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened during the suppression of the campaign !", details: error.message });
        }
    }

    //---------------------------- PARTICIPANTS ------------------------------------------------


    /**
     * Récupère la liste des participants d'une campagne donnée.
     *
     * @param {Object} req - L'objet requête Express avec `campaignId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne la liste des participants sous forme JSON ou un message d'erreur.
     */
    static async getParticipants(req, res) {
        try {
            const participants = await Participants.getParticipants(req.params.campaignId);
            if (participants && participants.length > 0) {
                res.json(participants);
            } else {
                res.status(404).json({ message: "No participant was found." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while retrieving participants !", details: error.message });
        }
    }

    /**
     * Récupère les informations d'un participant à partir de son `participantId`.
     *
     * @param {Object} req - L'objet requête Express avec `participantId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne les informations du participant sous forme JSON ou un message d'erreur.
     */
    static async getParticipant(req, res) {
        try {
            const participant = await Participants.getFromId(req.params.participantId);
            if (participant) {
                res.json(participant);
            } else {
                res.status(404).json({ message: "Participant not found." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while retrieving participant.", details: error.message });
        }
    }

    /**
     * Modifie les informations d'un participant.
     *
     * @param {Object} req - L'objet requête Express avec les nouvelles informations du participant dans `req.body`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne les nouvelles informations du participant sous forme JSON.
     */
    static async editParticipant(req, res) {
        const { error, value } = participantEditSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }

        try {
            const { participantId } = req.params;
            const updatedParticipant = await Participants.edit(participantId, value);
            if (!updatedParticipant) {
                return res.status(404).json({ message: "Participant not found." });
            }
            res.status(200).json({ message: "Participant updated successfully", participant: updatedParticipant });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred during the update of the participant", details: error.message });
        }
    }

    /**
     * Supprime un participant spécifique d'une campagne.
     *
     * @param {Object} req - L'objet requête Express avec `campaignId` et `participantId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou un message d'erreur.
     */
    static async deleteParticipant(req, res) {
        try {
            const { participantId } = req.params;
            await Participants.delete(participantId);
            res.status(200).json({ message: "The participant was successfully deleted." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened during the suppression of the campaign !", details: error.message });
        }
    }


    /**
     * Ajoute un nouveau participant à une campagne.
     *
     * @param {Object} req - L'objet requête Express avec les détails du participant dans `req.body` et `campaignId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou une erreur si le participant n'a pas pu être ajouté.
     */
    static async addParticipant(req, res) {
        const { error, value } = participantSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }

        try {
            const { name, email } = value;
            const { campaignId } = req.params;

            await Participants.add({ campaignId, name, email });
            res.status(201).json({ message: "The participant was successfully created." });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happend during the creation of the participant !", details: error.message });
        }
    }

    //---------------------------- OPTIONS ------------------------------------------------


/**
 * Ajoute une nouvelle option à une campagne.
 *
 * @param {Object} req - L'objet requête Express avec les détails de l'option dans `req.body` et `campaignId` dans `req.params`.
 * @param {Object} res - L'objet réponse Express.
 * @returns {void} Retourne un message de succès ou une erreur si l'option n'a pas pu être créée.
 */
static async addOption(req, res) {
    const { error, value } = optionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Validation error", details: error.details });
    }

    try {
        const { name, minParticipants, maxParticipants } = value;
        const { campaignId } = req.params;
        const newOption = await Options.add(campaignId, name, minParticipants, maxParticipants);

        res.status(201).json({ message: "The option was successfully created.", option: newOption });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error happened during the creation of the option", details: error.message });
    }
}


    /**
     * Récupère la liste des options d'une campagne donnée.
     *
     * @param {Object} req - L'objet requête Express avec `campaignId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne la liste des options sous forme JSON.
     */
    static async getOptions(req, res) {
        try {
            const options = await Options.getAll({ campaignId: req.params.campaignId });
            res.json(options);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened while retrieving options !", details: error.message });
        }
    }

    /**
     * Récupère une option spécifique à partir de son `optionId`.
     *
     * @param {Object} req - L'objet requête Express avec `optionId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne les informations de l'option sous forme JSON ou un message d'erreur.
     */
    static async getOption(req, res) {
        try {
            const option = await Options.getFromId(req.params.optionId);
            if (option) {
                res.json(option);
            } else {
                res.status(404).json({ message: "Option not found." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened while retrieving the campaign !", details: error.message });
        }
    }

    /**
     * Modifie les informations d'une option spécifique.
     *
     * @param {Object} req - L'objet requête Express avec les nouvelles informations dans `req.body` et l'ID de l'option dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou un message d'erreur.
     */
    static async editOption(req, res) {
        const { error, value } = editOptionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }
        try {
            const { name, minParticipants, maxParticipants } = value;
            const { optionId } = req.params;
            
            await Options.edit({ 
                id: optionId,
                name,
                minParticipants,
                maxParticipants
            });

            res.status(200).json({ message: "The option was successfully edited." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened while editing the option !", details: error.message });
        }
    }


    /**
     * Supprime une option spécifique d'une campagne.
     *
     * @param {Object} req - L'objet requête Express avec `campaignId` et `optionId` dans `req.params`.
     * @param {Object} res - L'objet réponse Express.
     * @returns {void} Retourne un message de succès ou un message d'erreur.
     */
    static async deleteOption(req, res) {
        try {
            const { optionId } = req.params;
            await Options.delete(optionId);
            res.status(200).json({ message: "The option was successfully deleted." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error happened during the suppression of the option !", details: error.message });
        }
    }



}

module.exports = CampaignController;