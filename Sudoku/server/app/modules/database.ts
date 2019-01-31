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

    function isNewHighScore(usr: User, newTime: number, isHard = false): boolean
    {
      return usr.getBestTime(isHard) === 0 || newTime < usr.getBestTime(isHard);
    }

    export function setHighScores(username: string, password: string,
                                  time: number, isHard: boolean): Promise<boolean>
    {
        let p = new Promise((resolve, reject) => {
            importUser({username: username, password: password})
            .then((usr) => {
                if (usr)
                {
                    if (isNewHighScore(usr, time, isHard))
                    {
                        console.log(usr);
                        usr.setBestTime(time, isHard);
                        usr.save();
                    }
                }
            });
        });
        return p;
    }

    export function getHighScores(): Promise<{usersEasy: { username: string,
                                                           bestTimeSudokuEasy: number }[],
                                              usersHard: { username: string,
                                                           bestTimeSudokuHard: number }[]}>
    {
        let p = new Promise((resolve, reject) => {
            UserDoc.find({bestTimeSudokuEasy: {$gt: 0}})
                .sort('bestTimeSudokuEasy')
                .limit(3)
                .select('username bestTimeSudokuEasy')
                .exec((errEasy, usersEasy) => {
                    resolve(usersEasy);
                });
            })
            .then((usersEasy) => {
                return new Promise((resolve, reject) => {
                    UserDoc.find({bestTimeSudokuHard: {$gt: 0}})
                    .sort('bestTimeSudokuHard')
                    .limit(3)
                    .select('username bestTimeSudokuHard')
                    .exec((errHard, usersHard) => {
                        resolve({easy: usersEasy, hard: usersHard});
                    });
            });
        });
        return p;
    }
}
