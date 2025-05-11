import { type ReactNode } from 'react';

const KeyboardAwareScrollView = ({ children }: { children: ReactNode }) => children;
const listenToKeyboardEvents = () => KeyboardAwareScrollView;
export { KeyboardAwareScrollView, listenToKeyboardEvents };
