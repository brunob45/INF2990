import * as mongoose from 'mongoose';
import { User } from "../user";
import UserDoc from '../models/user.model';


const MONGO_URL = 'mongodb://projet2:projet2@ds149329.mlab.com:49329/projet2';

export module Database
{
    export function init(): void
    {
        mongoose.connect(MONGO_URL, (err) =>
        {
            if (err)
            {
                console.log("Couldn't connect to Mongo.");
                console.log(err);
            }
            else
            {
                console.log("Connected to Mongo.");
            }
        });
    }

    export function importUser(credidentials: {username: string,
                                               password: string}): Promise<User>
    {
        let p: Promise<User> = new Promise((resolve, reject) =>
        {
            UserDoc.findOne({username: credidentials.username}, (err, usr) =>
            {
                if (usr)
                {
                    let currentUser = User.fromDoc(usr);
                    if (currentUser.verifyPassword(credidentials.password))
                    {
                        resolve(currentUser);
                    }
                    else
                    {
                        resolve(null);
                    }
                }
                else
                {
                    resolve(null);
                }
            });
        });
        return p;
    }

    export function createNewUser(credidentials: {username: string,
                                                  password: string }): Promise<boolean>
    {
        let p: Promise<boolean> = new Promise((resolve, reject) =>
        {
            UserDoc.findOne({username: credidentials.username}, (err, usr) =>
            {
                if (usr)
                {
                    resolve(false);
                }
                else
                {
                    let user = new User(credidentials.username, credidentials.password);
                    new UserDoc(user.toDoc()).save();
                    resolve(true);
                }
            });
        });
        return p;
    }

    export function setHighScores(username: string, password: string,
                                  score: number, isHard: boolean): Promise<boolean>
    {
        let p = new Promise((resolve, reject) => {
            importUser({username: username, password: password})
            .then((usr) => {
                if (usr)
                {
                    if (score > usr.getBestScore(isHard))
                    {
                        usr.setBestScore(score, isHard);
                        usr.save();
                    }
                }
            });
        });
        return p;
    }

    export function getHighScores(): Promise<{usersEasy: { username: string,
                                                           bestScoreCurlingEasy: number }[],
                                              usersHard: { username: string,
                                                           bestScoreCurlingHard: number }[]}>
    {
        let p = new Promise((resolve, reject) => {
            UserDoc.find({bestScoreCurlingEasy: {$gt: 0}})
                .sort(-'bestScoreCurlingEasy')
                .limit(3)
                .select('username bestScoreCurlingEasy')
                .exec((errEasy, usersEasy) => {
                    resolve(usersEasy);
                });
            })
            .then((usersEasy) => {
                return new Promise((resolve, reject) => {
                    UserDoc.find({bestScoreCurlingHard: {$gt: 0}})
                    .sort(-'bestScoreCurlingHard')
                    .limit(3)
                    .select('username bestScoreCurlingHard')
                    .exec((errHard, usersHard) => {
                        resolve({easy: usersEasy, hard: usersHard});
                    });
            });
        });
        return p;
    }
}
