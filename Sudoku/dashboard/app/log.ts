export module Log
{
    const SIZE_MAX = 30;
    export let data: string[] = [];


    function getTime(): string
    {
        let now: Date = new Date();
        let ret = "[";
        let hours: number = now.getHours();
        if (hours < 10)
        {
            ret += '0';
        }
        ret += hours + ":";

        let minutes: number = now.getMinutes();
        if (minutes < 10)
        {
            ret += '0';
        }
        ret += minutes + ":";

        let seconds: number = now.getSeconds();
        if (seconds < 10)
        {
            ret += "0";
        }
        ret += seconds + "] ";

        return ret;
    }

    export function push(s: string): void
    {
        if (data.length >= SIZE_MAX)
        {
            data.shift();
        }

        data.push(getTime() + s);
    }

    export function get(): string
    {
        let ret = "";
        for (let s of data)
        {
            ret += s;
        }
        return ret;
    }
}
