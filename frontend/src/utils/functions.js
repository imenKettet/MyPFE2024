import { jwtDecode } from "jwt-decode";

export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}
export function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export const isExpiredToken = (token) => {
    const decoded = jwtDecode(token);
    return Math.floor(new Date().getTime() / 1000) >= decoded.exp
}

export const decodeToken = (token) => {
    return token ? jwtDecode(token) : {}
}