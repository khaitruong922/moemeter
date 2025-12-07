import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBooks } from '../api/books';
import { getGroups } from '../api/groups';
import { getMetadata } from '../api/metadata';
import { BookList } from '../components/BookList';
import { formatDatetime } from '../utils/datetime';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../context/useUser';

const getPlaceholder = (field: string) => {
	switch (field) {
		case 'title':
			return 'タイトルで検索';
		case 'author':
			return '著者名で検索';
		default:
			return 'タイトル・著者名';
	}
};

type PeriodButtonProps = {
	period: string;
	currentPeriod: string;
	label: string;
	searchInput: string;
	searchField: string;
	setPeriodFilter: (period: string) => void;
	setSearchParams: (params: any) => void;
	borderClass?: string;
};

const PeriodButton = ({
	period,
	currentPeriod,
	label,
	searchInput,
	searchField,
	setPeriodFilter,
	setSearchParams,
	borderClass = '',
}: PeriodButtonProps) => {
	const handleClick = () => {
		setPeriodFilter(period);
		const params: { q?: string; field?: string; period?: string } = {};
		if (searchInput.trim()) {
			params.q = searchInput.trim();
			if (searchField !== 'all') {
				params.field = searchField;
			}
		}
		if (period !== 'all') {
			params.period = period;
		}
		setSearchParams(params);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`flex-1 text-sm py-2 px-4 font-medium transition-colors cursor-pointer ${borderClass} ${
				currentPeriod === period
					? 'bookmeter-green text-white'
					: 'bg-white text-[#5ba865] hover:bg-[#f0fae8]'
			}`}
		>
			{label}
		</button>
	);
};

const BooksPage = () => {
	const currentDate = new Date();
	const currentMonth = currentDate.getUTCMonth() + 1; // 1-12
	const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
	const currentYear = currentDate.getUTCFullYear();
	const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

	useDocumentTitle('みんなの本棚 | 萌メーター');
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
	const [searchField, setSearchField] = useState(searchParams.get('field') || 'all');
	const [periodFilter, setPeriodFilter] = useState(searchParams.get('period') || 'all');
	const searchQuery = searchParams.get('q') || '';
	const fieldQuery = searchParams.get('field') || 'all';
	const periodQuery = searchParams.get('period') || 'all';

	// Sync state with URL parameters
	useEffect(() => {
		setSearchInput(searchParams.get('q') || '');
		setSearchField(searchParams.get('field') || 'all');
		setPeriodFilter(searchParams.get('period') || 'all');
	}, [searchParams]);

	const {
		data,
		isLoading: isBooksLoading,
		error: booksError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books', searchQuery, fieldQuery, periodQuery],
		queryFn: ({ pageParam = 1 }) => getBooks(pageParam, searchQuery, fieldQuery, periodQuery),
		getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
		initialPageParam: 1,
	});

	const { data: groupsData } = useQuery({
		queryKey: ['groups'],
		queryFn: getGroups,
	});
	const { data: metadata } = useQuery({ queryKey: ['metadata'], queryFn: getMetadata });

	const { user } = useUser();
	const currentUserId = user?.id;

	const groupName = groupsData?.[0]?.name || 'グループ';

	// Combine all books from all pages and get users
	const books = data?.pages.flatMap((page) => page.books) || [];
	// Aggregate users from all pages
	const users = data?.pages.reduce((acc, page) => ({ ...acc, ...page.users }), {}) || {};
	const totalCount = data?.pages[0]?.total_count || 0;
	const totalReadsCount = data?.pages[0]?.total_reads_count || 0;

	// Handle search input
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params: { q?: string; field?: string; period?: string } = {};

		if (searchInput.trim()) {
			params.q = searchInput.trim();
			if (searchField !== 'all') {
				params.field = searchField;
			}
		}

		if (periodFilter !== 'all') {
			params.period = periodFilter;
		}

		setSearchParams(params);
	};

	const clearSearch = () => {
		setSearchInput('');
		setSearchField('all');
		const params: { period?: string } = {};
		if (periodFilter !== 'all') {
			params.period = periodFilter;
		}
		setSearchParams(params);
	};

	// Infinite scroll implementation
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
			threshold: 0.1,
		});

		observer.observe(element);

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [handleObserver]);

	const renderContent = () => {
		if (isBooksLoading) {
			return (
				<div className="flex flex-col justify-center items-center min-h-[50vh]">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
					<div className="text-gray-400 text-sm">みんなの本棚を読み込み中...</div>
				</div>
			);
		}

		if (booksError) {
			return (
				<div className="flex justify-center items-center min-h-[50vh]">
					<div className="text-red-600 bg-red-50 p-4 rounded-lg">
						<p className="font-medium">エラーが発生しました</p>
						<p className="text-sm mt-1">
							{booksError instanceof Error ? booksError.message : '本の一覧を取得できませんでした'}
						</p>
					</div>
				</div>
			);
		}

		if (!data || books.length === 0) {
			return (
				<div className="flex justify-center items-start min-h-[30vh] pt-8">
					<div className="text-center">
						<p className="text-gray-600 text-lg mb-4">
							{searchQuery ? '検索結果が見つかりませんでした' : 'まだ本が登録されていません'}
						</p>
						{searchQuery && (
							<p className="text-sm text-gray-500">別のキーワードで検索してください</p>
						)}
					</div>
				</div>
			);
		}

		return (
			<div className="w-full px-4">
				<BookList books={books} users={users} currentUserId={currentUserId} />
				{isFetchingNextPage && (
					<div className="flex justify-center my-4">
						<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
					</div>
				)}
				<div ref={observerTarget} className="h-4" />
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="mb-4 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">みんなの本棚</h2>
				<p className="mt-1 text-center text-xs text-gray-400">
					最終更新: {formatDatetime(metadata?.last_updated)}
					{typeof metadata?.total_users === 'number' &&
						typeof metadata?.failed_users === 'number' && (
							<span className="ml-2">
								同期済み: {metadata.total_users - metadata.failed_users}/{metadata.total_users}人
							</span>
						)}
				</p>
				<p className="mt-2 text-gray-600">{groupName}のメンバーが読んだ本の一覧です。</p>
				<p className="text-sm text-gray-500 mt-1">
					{searchQuery ? `「${searchQuery}」の検索結果: ` : ''}
					{isBooksLoading ? '検索中...' : `${totalCount}冊 | ${totalReadsCount}読破`}
					{searchQuery && !isBooksLoading && (
						<button
							onClick={clearSearch}
							className="ml-2 text-[#5ba865] hover:underline cursor-pointer"
						>
							検索をクリア
						</button>
					)}
				</p>
			</div>

			<div className="w-full max-w-xl px-4 mb-6">
				<form onSubmit={handleSearch} className="flex flex-col w-full gap-2">
					<div className="flex w-full">
						<select
							value={searchField}
							onChange={(e) => setSearchField(e.target.value)}
							className="cursor-pointer h-[40px] sm:h-[48px] px-2 bg-[#f0f0f0] border border-r-0 border-gray-300 rounded-l focus:outline-none text-xs text-gray-800 w-[90px]"
						>
							<option value="all">すべて</option>
							<option value="title">タイトル</option>
							<option value="author">著者</option>
						</select>
						<div className="flex-1 flex min-w-0">
							<input
								type="search"
								id="moemeter-q"
								name="moemeter-q"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								placeholder={getPlaceholder(searchField)}
								className="w-full h-[40px] sm:h-[48px] px-2 sm:px-3 bg-white border border-gray-300 focus:outline-none text-sm"
							/>
						</div>
						<button
							type="submit"
							className="w-[48px] h-[40px] sm:h-[48px] flex items-center justify-center bookmeter-green text-white rounded-r cursor-pointer shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</button>
					</div>
					<div className="flex w-full rounded-lg overflow-hidden border border-[#5ba865]/20">
						<PeriodButton
							period="all"
							currentPeriod={periodFilter}
							label="全期間"
							searchInput={searchInput}
							searchField={searchField}
							setPeriodFilter={setPeriodFilter}
							setSearchParams={setSearchParams}
						/>
						<PeriodButton
							period="this_year"
							currentPeriod={periodFilter}
							label={`${currentYear}年`}
							searchInput={searchInput}
							searchField={searchField}
							setPeriodFilter={setPeriodFilter}
							setSearchParams={setSearchParams}
							borderClass="border-l border-[#5ba865]/20"
						/>
						<PeriodButton
							period="this_month"
							currentPeriod={periodFilter}
							label={`${currentYear}年${currentMonth}月`}
							searchInput={searchInput}
							searchField={searchField}
							setPeriodFilter={setPeriodFilter}
							setSearchParams={setSearchParams}
							borderClass="border-l border-[#5ba865]/20"
						/>
						<PeriodButton
							period="last_month"
							currentPeriod={periodFilter}
							label={`${lastMonthYear}年${lastMonth}月`}
							searchInput={searchInput}
							searchField={searchField}
							setPeriodFilter={setPeriodFilter}
							setSearchParams={setSearchParams}
							borderClass="border-l border-[#5ba865]/20"
						/>
					</div>
				</form>
			</div>

			{renderContent()}
		</div>
	);
};

export default BooksPage;
