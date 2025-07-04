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
					<Layout>
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
