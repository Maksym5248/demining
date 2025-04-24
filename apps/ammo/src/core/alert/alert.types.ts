export interface IAlertProps {
    title: string;
    subTitle: string;
    cancel?: {
        title?: string;
        onPress?: () => void;
    };
    confirm?: {
        title?: string;
        onPress: () => void;
        isLoading?: boolean;
    };
}
