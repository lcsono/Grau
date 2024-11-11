import { CONSTANTS } from './constants.js';
import { CookieManager } from './cookie-manager.js';

export function getUser() {
	const cookieManager = new CookieManager();

	const token = cookieManager.getCookie(CONSTANTS.COOKIE_ACCESS_TOKEN_KEY);

	if (!token) return;

	const userData = sessionStorage.getItem(
		CONSTANTS.SESSION_STORAGE_USER_DATA_KEY
	);

	if (userData) return JSON.parse(userData);
}
