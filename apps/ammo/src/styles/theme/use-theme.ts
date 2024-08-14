import { useThemeName } from './use-theme-name';

export function useTheme() {
    const name = useThemeName();
    return name;
}
