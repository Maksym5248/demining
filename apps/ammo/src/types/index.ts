export type ISharedValue = { value: number };
export interface ViewModel {
    unmount?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init?: (...args: any[]) => void;
}
export type ViewModelGeneric<T> = T extends ViewModel ? T : T & ViewModel;
