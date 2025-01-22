export interface IMessageParams {
    delay?: number;
    time?: number;
}

export interface IMessage {
    error: (text: string, params?: IMessageParams) => void;
    success: (text: string, params?: IMessageParams) => void;
    info: (text: string, params?: IMessageParams) => void;
}
