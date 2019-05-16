export interface MediaRecorderErrorEvent extends Event {
    name: string;
}
export interface MediaRecorderDataAvailableEvent extends Event {
    data: any;
}
export interface MediaRecorderEventMap {
    'dataavailable': MediaRecorderDataAvailableEvent;
    'error': MediaRecorderErrorEvent;
    'pause': Event;
    'resume': Event;
    'start': Event;
    'stop': Event;
    'warning': MediaRecorderErrorEvent;
}
export declare class MediaRecorder extends EventTarget {
    readonly mimeType: string;
    readonly state: 'inactive' | 'recording' | 'paused';
    readonly stream: MediaStream;
    ignoreMutedMedia: boolean;
    videoBitsPerSecond: number;
    audioBitsPerSecond: number;
    ondataavailable: (event: MediaRecorderDataAvailableEvent) => void;
    onerror: (event: MediaRecorderErrorEvent) => void;
    onpause: () => void;
    onresume: () => void;
    onstart: () => void;
    onstop: (ev: Event) => void;
    constructor(stream: MediaStream, option?: {
        mimeType: string;
    });
    start(duration?: Number): any;
    stop(): any;
    resume(): any;
    pause(): any;
    static isTypeSupported(type: string): boolean;
    requestData(): any;
    addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaStream, ev: MediaRecorderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaStream, ev: MediaRecorderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
