pour le test :

curl -X DELETE http://localhost:4000/campaigns/ \
-H "Content-Type: application/json" \
-d '{"campaignId": ""}'

pour lancer le serveur :

npm run-script start:dev
