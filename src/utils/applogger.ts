/**
 * AppLogger Utility
 * Safe for production (no-op when not in __DEV__).
 */

export class AppLogger {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    static d = (message: string, ...args: any[]) => {
        if (__DEV__) {
            console.log(`(🪲) ∼ ${message}`, ...args);
        }
    };

    static warn = (message: string, ...args: any[]) => {
        if (__DEV__) {
            console.warn(`(⚠️) ∼ ${message}`, ...args);
        }
    };

    static info = (message: string, ...args: any[]) => {
        if (__DEV__) {
            console.log(`(ℹ) ∼ ${message}`, ...args);
        }
    };

    static error = (message: string, ...args: any[]) => {
        if (__DEV__) {
            console.error(`(❌) ∼ ${message}`, ...args);
        }
    };

    /**
     * Static log for quick one-off logging
     */
    static log = (message: string, ...args: any[]) => {
        if (__DEV__) {
            console.log(`(🪵) ∼ ${message}`, ...args);
        }
    };

    /**
     * Debug log (🪲)
     */
    d = (message: string, ...args: any[]) => {
        if (__DEV__) {
            const tag = `${this.name} (🪲)`;
            console.log(`${tag} ∼ ${message}`, ...args);
        }
    };

    /**
     * Warning log (⚠️)
     */
    warn = (message: string, ...args: any[]) => {
        if (__DEV__) {
            const tag = `${this.name} (⚠️)`;
            console.warn(`${tag} ∼ ${message}`, ...args);
        }
    };

    /**
     * Info log (ℹ)
     */
    info = (message: string, ...args: any[]) => {
        if (__DEV__) {
            const tag = `${this.name} (ℹ)`;
            console.log(`${tag} ∼ ${message}`, ...args);
        }
    };

    /**
     * Error log (❌)
     */
    error = (message: string, ...args: any[]) => {
        if (__DEV__) {
            const tag = `${this.name} (❌)`;
            console.error(`${tag} ∼ ${message}`, ...args);
        }
    };
}