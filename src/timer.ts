type TimeData = [number, number];

export class Timer
{
    private _initTime : TimeData;
    private _endTime  : TimeData;
    private _deltaTime : number;
    private _isRunning : boolean;

    constructor()
    {
        this._initTime = process.hrtime();
        this._isRunning = true;
    }

    restart() : TimeData
    {
        this._endTime = undefined;
        this._initTime = process.hrtime();
        this._isRunning = true;

        return this._initTime;
    }

    end() : number
    {
        this._endTime = process.hrtime(this._initTime);
        this._isRunning = false;

        return this._endTime[1] / 1000000;
    }

    get isRunning()
    {
        return this._isRunning;
    }
}