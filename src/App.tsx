import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LeaderboardPage from './pages/LeaderboardPage';
import BooksPage from './pages/BooksPage';
import ReadsPage from './pages/ReadsPage';
import { Layout } from './Layout';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Layout title="読書ランキング">
					<Routes>
						<Route path="/leaderboard" element={<LeaderboardPage />} />
						<Route path="/books" element={<BooksPage />} />
						<Route path="/reads" element={<ReadsPage />} />
						<Route path="/" element={<Navigate to="/leaderboard" replace />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
