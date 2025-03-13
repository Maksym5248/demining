export interface IFieldRangeProps {
    label: string;
    value?: { max: number | null; min: number | null } | (string | number | null | undefined)[] | null;
    info?: string;
    require?: boolean;
}
