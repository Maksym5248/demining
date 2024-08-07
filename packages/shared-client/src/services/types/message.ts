export interface IMessage {
    error: (text: string) => void;
    success: (text: string) => void;
    info: (text: string) => void;
}
