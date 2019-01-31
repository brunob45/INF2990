
export class Player
{
    _name: string;
    _socket: SocketIOClient.Socket;

    constructor(name: string, socket: SocketIOClient.Socket)
    {
        this._name = name;
        this._socket = socket;
    }

    get name() { return this._name; }
    get socket() { return this._socket; }
}
