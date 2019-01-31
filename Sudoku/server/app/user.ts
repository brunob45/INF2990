import UserDoc from "./models/user.model";
import { Md5 } from 'ts-md5/dist/md5';

export class User{

    private username: string;
    private password: string;
    private bestTimeEasy = 0;
    private bestTimeHard = 0;
    private bestScoreCurlingEasy: number;
    private bestScoreCurlingHard: number;

    static fromDoc(src: {username: string,
                         password: string,
                         bestTimeSudokuEasy: number,
                         bestTimeSudokuHard: number,
                         bestScoreCurlingEasy: number,
                         bestScoreCurlingHard: number}): User
    {
        let usr = new User(src.username);
        usr.setPasswordHash(src.password);
        usr.bestScoreCurlingEasy = src.bestScoreCurlingEasy ? src.bestScoreCurlingEasy : 0;
        usr.bestScoreCurlingHard = src.bestScoreCurlingHard ? src.bestScoreCurlingHard : 0;
        usr.bestTimeEasy = src.bestTimeSudokuEasy ? src.bestTimeSudokuEasy : 0;
        usr.bestTimeHard = src.bestTimeSudokuHard ? src.bestTimeSudokuHard : 0;
        return usr;
    }

    getName(): string
    {
        return this.username;
    }

    getBestTime(isHard = false): number
    {
        return isHard ? this.bestTimeHard : this.bestTimeEasy;
    }

    setBestTime(time: number, isHard = false): void
    {
        if (!time)
        {
            time = 0;
        }
        if (isHard)
        {
            this.bestTimeHard = time;
        }
        else
        {
            this.bestTimeEasy = time;
        }
    }

    setPasswordHash(hash: string): void
    {
        this.password = hash;
    }

    constructor(n: string, p?: string)
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
                                      bestTimeSudokuEasy: this.bestTimeEasy,
                                      bestTimeSudokuHard: this.bestTimeHard,
                                      bestScoreCurlingEasy: this.bestScoreCurlingEasy,
                                      bestScoreCurlingHard: this.bestScoreCurlingHard});
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
