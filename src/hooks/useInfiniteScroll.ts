import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
	threshold?: number;
	rootMargin?: string;
}

export const useInfiniteScroll = ({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	threshold = 0.1,
	rootMargin = '1000px',
}: UseInfiniteScrollOptions) => {
	const observerTarget = useRef<HTMLDivElement>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage]
	);

	useEffect(() => {
		const element = observerTarget.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			threshold,
			rootMargin,
		});

		observer.observe(element);

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [handleObserver, threshold, rootMargin]);

	return { observerTarget };
};
