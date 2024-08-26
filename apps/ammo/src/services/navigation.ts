import { type NavigationContainerRef, getPathFromState } from '@react-navigation/core';
import {
    CommonActions,
    StackActions,
    type PartialState,
    type NavigationState,
    type EventListenerCallback,
    type NavigationContainerEventMap,
} from '@react-navigation/native';

export class NavigationClass {
    private nav: NavigationContainerRef<any> = {} as NavigationContainerRef<any>;

    init = (navigatorRef: NavigationContainerRef<any>) => {
        this.nav = navigatorRef;
    };

    getPath = () => {
        return getPathFromState(this.nav.getRootState());
    };

    navigate = (routeName: string, params = {}) => {
        this.nav.dispatch(CommonActions.navigate(routeName, params));
    };

    popToTop = () => {
        this.nav.dispatch(StackActions.popToTop());
    };

    goBack = () => {
        this.nav.dispatch(CommonActions.goBack());
    };

    reset = (state: PartialState<NavigationState>) => {
        this.nav.dispatch(CommonActions.reset(state));
    };

    resetOn = (name: string, params?: object) => {
        this.nav.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name, params }],
            }),
        );
    };

    replace = (name: string, params?: object | undefined) => {
        this.nav.dispatch(StackActions.replace(name, params));
    };

    onChange = (name: keyof NavigationContainerEventMap, callBack: EventListenerCallback<NavigationContainerEventMap, any>) => {
        this.nav.addListener(name, callBack);

        return () => this.nav.removeListener(name, callBack);
    };
}
