export class CookieManager {
	#cookies;
	#ttl = 24 * 60 * 60 * 1000; // 24h

	#loadCookies() {
		const { cookie: cookies } = document;

		let parsedCookies = {};

		for (const cookie of cookies.split(';')) {
			const [key, value] = cookie.split('=');

			parsedCookies[key] = value;
		}

		this.#cookies = parsedCookies;

		return parsedCookies;
	}

	getCookies() {
		if (this.#cookies) return this.#cookies;
		else return this.#loadCookies();
	}

	setCookie(key, value) {
		const expirationDate = new Date();
		expirationDate.setTime(expirationDate.getTime() + this.#ttl);

		document.cookie = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=/`;

		this.#loadCookies();
	}

	deleteCookie(key) {
		document.cookie = `${key}=; expires=${new Date(0).toUTCString()}; path=/`;

		this.#loadCookies();
	}
}
