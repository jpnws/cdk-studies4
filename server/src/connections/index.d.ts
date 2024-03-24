export declare const init: () => void;
export declare const execute: <T>(query: string, params: string[] | Record<string, unknown>) => Promise<T>;
