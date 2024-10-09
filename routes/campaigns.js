const express = require("express");
const CampaignController = require("../controllers/campaigns");

const campaignRouter = express.Router();

// Les données reçues dans les requêtes POST sont converties en JSON
campaignRouter.use(express.json());

// Vérifier si l'utilisateur est connecté avant de procéder
campaignRouter.use("/", (req, res, next) => {
    req.session.userId = "abcdef0123456789"; //temporaire pour pas avoir a se co

    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: "You have to log in." })
    }
});

// Routes
campaignRouter.get("/", CampaignController.getCampaigns);
campaignRouter.get("/:campaignId", CampaignController.getCampaignInfo);
campaignRouter.post("/add", CampaignController.addCampaign);
campaignRouter.put("/:campaignId", CampaignController.editCampaign);
campaignRouter.delete("/:campaignId", CampaignController.deleteCampaign);

campaignRouter.get("/:campaignId/participants", CampaignController.getParticipants);
campaignRouter.get("/:campaignId/participants/:participantId", CampaignController.getParticipant);
campaignRouter.post("/:campaignId/participants/add", CampaignController.addParticipant);
campaignRouter.put("/:campaignId/participants/:participantId", CampaignController.editParticipant);
campaignRouter.delete("/:campaignId/participants/:participantId", CampaignController.deleteParticipant);


campaignRouter.get("/:campaignId/options", CampaignController.getOptions);
campaignRouter.get("/:campaignId/options/:optionId", CampaignController.getOption);
campaignRouter.post("/:campaignId/options/add", CampaignController.addOption);
campaignRouter.put("/:campaignId/options/:optionId", CampaignController.editOption);
campaignRouter.delete("/:campaignId/options/:optionId", CampaignController.deleteOption);




module.exports = campaignRouter;