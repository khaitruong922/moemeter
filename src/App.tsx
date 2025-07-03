import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LeaderboardPage from './pages/LeaderboardPage';
import BooksPage from './pages/BooksPage';
import ReadsPage from './pages/ReadsPage';
import JoinPage from './pages/JoinPage';
import SignInPage from './pages/SignInPage';
import { Layout } from './Layout';
import { UserProvider } from './context/UserProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
			gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
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
					<Layout title="読書ランキング">
						<Routes>
							<Route path="/leaderboard" element={<LeaderboardPage />} />
							<Route path="/books" element={<BooksPage />} />
							<Route path="/reads" element={<ReadsPage />} />
							<Route path="/join" element={<JoinPage />} />
							<Route path="/signin" element={<SignInPage />} />
							<Route path="/" element={<Navigate to="/leaderboard" replace />} />
						</Routes>
					</Layout>
				</BrowserRouter>
			</UserProvider>
		</QueryClientProvider>
	);
}

export default App;
