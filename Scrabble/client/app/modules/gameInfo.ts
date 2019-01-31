import { Chat } from '../classes/chat';

export module GameInfo
{
    export let nbPlayer = 0;
    export let username = "";
    export let score = 0;
    export let nbLetters = 7;
    export let chat: Chat;

    export function init()
    {
        chat = new Chat();
    }
}
