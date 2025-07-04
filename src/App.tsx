import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { ENABLE_JOIN_GROUP } from './constants';
import { UserProvider } from './context/UserProvider';
import BooksPage from './pages/BooksPage';
import JoinPage from './pages/JoinPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import ReadsPage from './pages/ReadsPage';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 15, // Data is considered fresh for 15 minutes
			gcTime: 1000 * 60 * 60, // Cache is kept for 60 minutes
			refetchOnWindowFocus: false, // Don't refetch when window regains focus
			retry: 0, // Disable automatic retries on failure
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
