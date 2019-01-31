import UserDoc from "./models/user.model";
import { Md5 } from 'ts-md5/dist/md5';

export class User{

    private username: string;
    private password: string;
    private bestTimeSudokuEasy: number;
    private bestTimeSudokuHard: number;
    private bestScoreEasy = 0;
    private bestScoreHard = 0;

    static fromDoc(src: {username: string,
                         password: string,
                         bestTimeSudokuEasy: number,
                         bestTimeSudokuHard: number,
                         bestScoreCurlingEasy: number,
                         bestScoreCurlingHard: number}): User
    {
        let usr = new User(src.username);
        usr.setPasswordHash(src.password);
        usr.bestTimeSudokuEasy = src.bestTimeSudokuEasy ? src.bestTimeSudokuEasy : 0;
        usr.bestTimeSudokuHard = src.bestTimeSudokuHard ? src.bestTimeSudokuHard : 0;
        usr.bestScoreEasy = src.bestScoreCurlingEasy ? src.bestScoreCurlingEasy : 0;
        usr.bestScoreHard = src.bestScoreCurlingHard ? src.bestScoreCurlingHard : 0;
        return usr;
    }

    getName(): string
    {
        return this.username;
    }

    getBestScore(isHard = false): number
    {
        return isHard ? this.bestScoreHard : this.bestScoreEasy;
    }

    setBestScore(score: number, isHard = false): void
    {
        if (!score)
        {
            score = 0;
        }
        if (isHard)
        {
            this.bestScoreHard = score;
        }
        else
        {
            this.bestScoreEasy = score;
        }
    }

    setPasswordHash(hash: string): void
    {
        this.password = hash;
    }

    constructor(n?: string, p?: string)
    {
        this.username = n;
        if (p)
        {
            this.password = String(Md5.hashStr(p));
        }
        else
        {
            this.password = null;
        }
    }

    verifyPassword(pass: string): boolean
    {
        return String(Md5.hashStr(pass)) === this.password;
    }

    save(): void
    {
        let userToSave = new UserDoc({username: this.username,
                                      password: this.password,
                                      bestTimeSudokuEasy: this.bestTimeSudokuEasy,
                                      bestTimeSudokuHard: this.bestTimeSudokuHard,
                                      bestScoreCurlingEasy: this.bestScoreEasy,
                                      bestScoreCurlingHard: this.bestScoreHard});
        UserDoc.findOneAndRemove({username: this.username}, function() {
            userToSave.save();
        });
    }

    toDoc(): { username: string,
               password: string}
    {
        return { username: this.username,
                 password: this.password };
    }
}
