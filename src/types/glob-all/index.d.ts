declare module 'glob-all' {
    import { IOptions } from 'glob';
    export function sync(patterns: string[], options: IOptions): string[];
}