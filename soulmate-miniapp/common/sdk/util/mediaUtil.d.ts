export declare class SoundMeter {
    instant: number;
    slow: number;
    clip: number;
    private context;
    private script;
    private mic;
    constructor();
    connectToSource(stream: MediaStream, callback: (param: any) => void): SoundMeter;
    stop(): void;
}
