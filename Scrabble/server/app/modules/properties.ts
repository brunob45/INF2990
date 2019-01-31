export module Properties
{
    export const URL = {
        mongoDB: 'mongodb://projet2:projet2@ds149329.mlab.com:49329/projet2'
    };
    export const messages = {
        newGameMessage: JSON.stringify({name: "Serveur",
            text: "Joyeux Scrabble, et puisse le sort vous être favorable!"}),
        welcomeMessage: (room: number) => JSON.stringify({"name": "Serveur",
            "text": "Bienvenue dans la salle d'attente #" + room}),
        notifyPlayerTurn: JSON.stringify({ name: "Serveur", text: "C'est a votre tour de jouer!" }),
        notifyPlayerTurnEnd: JSON.stringify({ name: "Serveur", text: "Votre tour est terminé!" }),
        aNewPlayerJoinedRoom: (name: string) => JSON.stringify({"name": "Serveur", "text": name + " connecté."}),
        aPlayerLeftRoom: (name: string) => JSON.stringify({"name": "Serveur", "text": name + " déconnecté."}),
        help: JSON.stringify({name: "Serveur", text: "Menu d'aide  Commandes possibles :  "
        + "'placer' <ligne><colonne>(h/v)"
        + " <mot> pour placer un mot, 'changer' <lettre> pour changer une lettre, 'passer' pour passer son tour "}),

        changerNotEnoughLetterInPouch: (name: string) => JSON.stringify({"name": "Serveur",
                                        "text": name + ": Il n'y a plus asser de lettres disponibles!"}),
        playerDoesNotHaveRequiredLetters: (name: string) => JSON.stringify({"name": "Serveur",
                                          "text": name + " n'a pas les lettres qu'il a de besoin!"}),
        syntaxError: (name: string) => JSON.stringify({"name": "Serveur",
                                       "text": name + " a fait une erreur de syntaxe dans sa commande!"}),
        invalidTurn: (name: string) => JSON.stringify({"name": "Serveur",
                                       "text": name + ": Ce n'est pas a votre tour de jouer!"}),
        invalidWord: (name: string, word: string) => JSON.stringify({"name": "Serveur",
                                                     "text": name + ": Le mot " + word + " n'existe pas!"}),
        cannotPlace: (name: string) => JSON.stringify({"name": "Serveur",
                                                    "text": name + ": Le mot ne peut pas être placé!"}),
        gameIsOver: (name: string) => JSON.stringify({"name": "Serveur",
                                                    "text": name + ": Vous ne pouvez pas effectuer de commande " +
                                                                      "car la partie est terminée!"})
    };

    export const socketEvent = {
        aNewClientIsConnected: "connection",
        theClientHasSuccefullyConnected: "connected",
        aNewPlayerIsConnected: "userConnect",
        thePlayerDisconnected: "disconnect",
        aPlayerDisconnected: "playerDisconnect",
        thePlayerChoosesAWaitingRoom: "enterRoom",
        thePlayerLeavesTheWaitingRoom: "leaveRoom",
        messageToClient: "messageToClient",
        messageFromClient: "message",
        commandFromClient: "command",
        ping: "allo",
        gameCreated: "gameIsReady",
        gameUpdate: "gameUpdate",
        sendLettersToPlayer: "sendDeck",
        updateRemainingWaitingPlayerNumber: "waitingRemainingPlayer",
        endGame: "endGame"
    };
}
