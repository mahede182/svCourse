import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

type ShowToastParams = {
    type?: ToastType;
    title: string;
    message?: string;
};

export const showToast = ({ type = "info", title, message }: ShowToastParams) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
    });
};