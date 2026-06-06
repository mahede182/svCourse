/* eslint-disable no-console */
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth_tokens";

export const getItem = async (key: string) => {
    try {
        const res = await AsyncStorage.getItem(key);
        if (!res) return "";
        return JSON.parse(res);
    } catch {
    }
};

export const saveItem = async (key: string, value: unknown) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
};

export const multiGetAsyncStore = async (keyList: string[], callback: (arg0: unknown) => void) => {
    await AsyncStorage.multiGet(keyList).then((data) => {
        callback(data);
    });
};

export const saveTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken, refreshToken }));
};

export const getTokens = async (): Promise<{
    accessToken: string;
    refreshToken: string;
} | null> => {
    try {
        const raw = await AsyncStorage.getItem(TOKEN_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const clearTokens = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
};