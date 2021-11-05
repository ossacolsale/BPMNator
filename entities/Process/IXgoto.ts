export class IXgoto {
    
    private _if: string;
    private _then: string;

    public constructor (aIf?: string, aThen?: string) {

        this._if = aIf;
        this._then = aThen;
    }

    public get if (): string { return this._if; }
    public set if (aIf: string) { this._if = aIf; }
    public get then (): string { return this._then; }
    public set then (aThen: string) { this._then = aThen; }
    
}