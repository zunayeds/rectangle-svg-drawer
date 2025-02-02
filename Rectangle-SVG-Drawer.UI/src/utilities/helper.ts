import { toast } from "react-toastify";

export function getPerimeter(width: number, height: number): number {
    return 2 * (width + height);
}

export function showSuccessMessage(message: string): void {
    toast(message, {
        type: 'success',
        autoClose: 3000,
        hideProgressBar: true
    });
}

export function showErrorMessage(error: string): void {
    toast(error, {
        type: 'error',
        autoClose: 3000,
        hideProgressBar: true
    });
}

export function isValidFileFormat(file: File): boolean {
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
    return extension == 'json';
}