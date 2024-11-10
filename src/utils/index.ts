
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
