/// <reference types="dom-mediacapture-record" />
import { E_CLIENT_TYPE, MediaStreamConstraints, PlayOption } from "../common/zego.entity";
import { ZegoStreamCenterWeb } from "./zego.streamCenter.web";
import { BaseCenter } from "../common/clientBase/index";
import { SoundMeter } from "../util/mediaUtil";
import { ZegoMediaElement } from "../../types/index";
export declare class ZegoClient extends BaseCenter {
    streamCenter: ZegoStreamCenterWeb;
    constructor();
    static screenShotReady: boolean;
    static mediaRecorder: MediaRecorder;
    static recordedBlobs: Blob[];
    getSocket(server: string): WebSocket;
    enableCamera(localVideo: HTMLElement, enable: boolean): boolean;
    enableMicrophone(localVideo: HTMLElement, enable: boolean): boolean;
    setLocalAudioOutput(localVideo: HTMLElement, audioOutput: string): boolean;
    setPlayAudioOutput(streamid: string, audioOutput: string): boolean;
    setCustomSignalUrl(signalUrl: string): boolean;
    setQualityMonitorCycle(timeInMs: number): void;
    startPlayingStream(streamid: string, remoteVideo: HTMLElement, audioOutput?: string, playOption?: PlayOption): boolean;
    stopPlayingStream(streamid: string): boolean;
    startPreview(localVideo: HTMLElement, mediaStreamConstraints: MediaStreamConstraints, success: Function, error: Function): boolean;
    stopPreview(localVideo: HTMLElement): boolean;
    startPublishingStream(streamid: string, localVideo: HTMLElement, extraInfo?: any, playOption?: PlayOption): boolean;
    stopPublishingStream(streamid: string): boolean;
    startScreenShotChrome(callBack: (suc: boolean, stream: MediaStream, err?: string) => void): boolean;
    startScreenSharingChrome(callBack: (suc: boolean, stream: MediaStream, err?: string) => void): void;
    startScreenShotFirFox(mediaSource: 'screen' | 'application' | 'window', audio: any, callBack: (suc: boolean, stream: MediaStream) => void): void;
    stopScreenShot(): void;
    WebrtcOnPublishStateUpdateHandle(type: 0 | 1 | 2, streamid: string, error: {
        code: string;
        msg: string;
    }): void;
    setCDNInfo(streamInfo: {
        urls_https_flv: string;
        urls_https_hls: string;
        urls_flv: string;
        urls_hls: string;
        urls_rtmp: string;
    }, streamItem: {
        urls_flv: string;
        urls_m3u8: string;
        urls_rtmp: string;
        urls_https_flv: string;
        urls_https_m3u8: string;
    }): void;
    loginBodyData(): {
        "id_name": string;
        "nick_name": string;
        "role": 1 | 2;
        "token": string;
        "version": any;
        "room_name": string;
        "user_state_flag": number;
        "room_create_flag": number;
        "client_type": E_CLIENT_TYPE;
        third_token: string;
    };
    screenStreamFrom(streamId: string, canRequestAudioTrack: boolean, callBack: Function): void;
    filterStreamList(streamId?: string): any[];
    static isSupportWebrtc(): boolean;
    static isSupportH264(sucCall: any, errCall: any): void;
    enumDevices(deviceInfoCallback: any, error: any): void;
    static enumDevices(deviceInfoCallback: any, error: any): void;
    static getAudioInfo(el: HTMLVideoElement | HTMLAudioElement, errCallBack: (param: any) => void): false | SoundMeter;
    private static handleDataAvailable;
    static startRecord(el: ZegoMediaElement): void;
    static stopRecord(): void;
    static resumeRecord(): void;
    static pauseRecord(): void;
    static saveRecord(name: string): void;
    static takeSnapShot(el: HTMLVideoElement, img: HTMLImageElement): void;
    static saveSnapShot(el: HTMLVideoElement, name: string): void;
    bindWindowListener(): void;
}
