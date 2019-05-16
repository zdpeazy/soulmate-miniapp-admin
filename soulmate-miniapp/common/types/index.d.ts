export declare class ZegoMediaElement extends HTMLVideoElement {
    captureStream(): MediaStream;
}
export declare class ZegoMediaDevices extends MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
}
