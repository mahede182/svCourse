import { KeyboardProvider as KeyboardControllerProvider } from "react-native-keyboard-controller";

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
    return (
        <KeyboardControllerProvider>
            {children}
        </KeyboardControllerProvider>
    );
}
