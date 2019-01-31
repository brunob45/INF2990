
import { Md5 } from 'ts-md5/dist/md5';

export class User{

    private username: string;
    private password: string;

    getName(): string
    {
        return this.username;
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

    toDoc(): {username: string, password: string}
    {
        return {username: this.username, password: this.password};
    }
}
