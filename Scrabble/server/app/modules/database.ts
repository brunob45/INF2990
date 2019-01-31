import * as mongoose from 'mongoose';
import { User } from "../user";
import { Letter } from "./letterPouch";
import UserDoc from '../models/user.model';
import Words from '../models/words.model';
import Letters from '../models/letters.model';
import { Properties } from './properties';

export module Database
{
    let isConnected = false;
    export function getConnectionStatus(): boolean
    {
        return isConnected;
    }

    export function init(): void
    {
        mongoose.connect(Properties.URL.mongoDB, (err) =>
        {
            if (err)
            {
                console.log("Couldn't connect to Mongo.");
                console.log(err);
            }
            else
            {
                console.log("Connected to Mongo.");
                isConnected = true;
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
                    let currentUser = new User(usr.username);
                    currentUser.setPasswordHash(usr.password);
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

    export function singleWordExist(wordToFind: string): Promise<boolean>
    {
        let p: Promise<boolean> = new Promise((resolve, reject) =>
        {
            Words.findOne({word: wordToFind.toUpperCase()}, (err, word) =>
            {
                if (word)
                {
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            });
        });
        return p;
    }

    export function multipleWordsExist(wordsToFind: string[]): Promise<boolean>
    {
        let upperWordsToFind: string[] = [];
        for (let i = 0; i < wordsToFind.length; i++)
        {
            upperWordsToFind[i] = wordsToFind[i].toUpperCase();
        }
        let p: Promise<boolean> = new Promise((resolve, reject) =>
        {
            Words.find({word: {$in: upperWordsToFind}}, (err, words) =>
            {

                if (words)
                {
                    for (let w of upperWordsToFind)
                    {
                        if (!(words.find((x) => x.word === w)))
                        {
                            resolve(false);
                        }
                    }
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            });
        });
        return p;
    }

    export function getLetters(): Promise<Letter[]>
    {
        let p: Promise<Letter[]> = new Promise((resolve, reject) =>
        {
            Letters.find( {}, (err, letters) =>
            {
                let list: Letter[] = [];
                for (let l of letters)
                {
                    for (let i = 0; i < l.quantity; i++)
                    {
                        let newLetter = { letter: l.letter, value: l.value};
                        list.push(newLetter);
                    }
                }
                resolve(list);
            });
        });
        return p;
    }
}
