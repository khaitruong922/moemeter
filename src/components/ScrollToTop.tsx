import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		// If there's a hash in the URL, scroll to that element
		if (hash) {
			const element = document.querySelector(hash);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
				return;
			}
		}

		// Otherwise scroll to top with a small delay to ensure content is rendered
		const timeoutId = setTimeout(() => {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'instant',
			});
		}, 0);

		return () => clearTimeout(timeoutId);
	}, [pathname, hash]);

	return null;
}
