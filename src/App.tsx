import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ENABLE_JOIN_GROUP } from './constants';
import { UserProvider } from './context/UserProvider';
import BooksPage from './pages/BooksPage';
import JoinPage from './pages/JoinPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import ReadsPage from './pages/ReadsPage';
import { Layout } from './Layout';
import { ScrollToTop } from './components/ScrollToTop';
import LonelyBooksPage from './pages/LonelyBooksPage';
import BookMergesPage from './pages/BookMergesPage';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 60, // Data is considered fresh for 1 hour
			gcTime: 1000 * 60 * 180, // Cache is kept for 3 hours
			refetchOnWindowFocus: false, // Don't refetch when window regains focus
			retry: 1, // Only retry failed requests once
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<BrowserRouter>
					<ScrollToTop />
					<Layout>
						<Routes>
							<Route path="/leaderboard" element={<LeaderboardPage />} />
							<Route path="/books" element={<BooksPage />} />
							<Route path="/reads" element={<ReadsPage />} />
							<Route path="/lonely-books" element={<LonelyBooksPage />} />
							<Route path="/book_merges" element={<BookMergesPage />} />
							{ENABLE_JOIN_GROUP && <Route path="/join" element={<JoinPage />} />}
							<Route path="/login" element={<LoginPage />} />
							<Route path="/" element={<Navigate to="/leaderboard" replace />} />
						</Routes>
					</Layout>
				</BrowserRouter>
			</UserProvider>
		</QueryClientProvider>
	);
}

export default App;
