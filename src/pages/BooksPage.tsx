import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getBooks } from '../api/books';
import { BookList } from '../components/BookList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FilterButton, FilterGroup } from '../components/FilterButton';
import { SectionHeader } from '../components/SectionHeader';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../context/useUser';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

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

const BooksPage = () => {
	const currentDate = new Date();
	const currentMonth = currentDate.getUTCMonth() + 1; // 1-12
	const currentYear = currentDate.getUTCFullYear();

	useDocumentTitle('みんなの本棚 | 萌メーター');
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
	const [searchField, setSearchField] = useState(searchParams.get('field') || 'all');
	const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
	const searchQuery = searchParams.get('q') || '';
	const fieldQuery = searchParams.get('field') || 'all';
	const filterQuery = searchParams.get('filter') || 'all';
	const isLonely = filterQuery === 'lonely';
	const periodQuery = isLonely ? 'all' : filterQuery;

	// Sync state with URL parameters
	useEffect(() => {
		setSearchInput(searchParams.get('q') || '');
		setSearchField(searchParams.get('field') || 'all');
		setFilter(searchParams.get('filter') || 'all');
	}, [searchParams]);

	const {
		data,
		isLoading: isBooksLoading,
		error: booksError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books', searchQuery, fieldQuery, periodQuery, isLonely],
		queryFn: ({ pageParam = 1 }) =>
			getBooks(pageParam, searchQuery, fieldQuery, periodQuery, undefined, isLonely),
		getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
		initialPageParam: 1,
	});

	const { user } = useUser();
	const currentUserId = user?.id;

	const { observerTarget } = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	});

	// Combine all books from all pages and get users
	const books = data?.pages.flatMap((page) => page.books) || [];
	// Aggregate users from all pages
	const users = data?.pages.reduce((acc, page) => ({ ...acc, ...page.users }), {}) || {};
	const totalCount = data?.pages[0]?.total_count || 0;
	const totalReadsCount = data?.pages[0]?.total_reads_count || 0;

	// Handle search input
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params: { q?: string; field?: string; filter?: string } = {};

		if (searchInput.trim()) {
			params.q = searchInput.trim();
			if (searchField !== 'all') {
				params.field = searchField;
			}
		}

		if (filter !== 'all') {
			params.filter = filter;
		}

		setSearchParams(params);
	};

	const handleFilterChange = (newFilter: string) => {
		setFilter(newFilter);
		const params: { q?: string; field?: string; filter?: string } = {};
		if (searchInput.trim()) {
			params.q = searchInput.trim();
			if (searchField !== 'all') {
				params.field = searchField;
			}
		}
		if (newFilter !== 'all') {
			params.filter = newFilter;
		}
		setSearchParams(params);
	};

	const clearSearch = () => {
		setSearchInput('');
		setSearchField('all');
		const params: { filter?: string } = {};
		if (filter !== 'all') {
			params.filter = filter;
		}
		setSearchParams(params);
	};

	const renderContent = () => {
		if (isBooksLoading) {
			return (
				<div className="min-h-[50vh] pt-8">
					<LoadingSpinner message="みんなの本棚を読み込み中..." />
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
				<BookList books={books} users={users} currentUserId={currentUserId} isLonely={isLonely} />
				{isFetchingNextPage && (
					<div className="my-4">
						<LoadingSpinner size="sm" />
					</div>
				)}
				<div ref={observerTarget} className="h-4" />
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<SectionHeader
				title="みんなの本棚"
				count={
					isBooksLoading
						? undefined
						: `${searchQuery ? `「${searchQuery}」の検索結果: ` : ''}${totalCount}冊 | ${totalReadsCount}読破`
				}
				isLoading={isBooksLoading}
				loadingMessage={searchQuery ? '検索中...' : '読み込み中...'}
				footer={
					searchQuery && !isBooksLoading ? (
						<button
							onClick={clearSearch}
							className="ml-2 bookmeter-green-text hover:underline cursor-pointer text-sm"
						>
							検索をクリア
						</button>
					) : undefined
				}
			/>

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
					<FilterGroup>
						<FilterButton
							value="all"
							currentValue={filter}
							label="全期間"
							onClick={handleFilterChange}
						/>
						<FilterButton
							value="this_year"
							currentValue={filter}
							label={`${currentYear}年`}
							onClick={handleFilterChange}
							borderClass="border-l border-[#77b944]/20"
						/>
						<FilterButton
							value="this_month"
							currentValue={filter}
							label={`${currentYear}年${currentMonth}月`}
							onClick={handleFilterChange}
							borderClass="border-l border-[#77b944]/20"
						/>
						<FilterButton
							value="lonely"
							currentValue={filter}
							label="ひとりぼっち"
							onClick={handleFilterChange}
							borderClass="border-l border-[#77b944]/20"
						/>
					</FilterGroup>
				</form>
			</div>

			{renderContent()}
		</div>
	);
};

export default BooksPage;
