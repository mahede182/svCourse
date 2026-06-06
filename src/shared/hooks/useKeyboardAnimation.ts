import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
    AndroidSoftInputModes,
    KeyboardController,
    useKeyboardContext,
} from "react-native-keyboard-controller";

export function useKeyboardAnimation() {
    useFocusEffect(
        useCallback(() => {
            KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);

            return () => KeyboardController.setDefaultMode();
        }, []),
    );

    const context = useKeyboardContext();

    return context.animated;
}