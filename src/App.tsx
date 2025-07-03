import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LeaderboardPage from './pages/LeaderboardPage';
import BooksPage from './pages/BooksPage';
import { Layout } from './Layout';

const queryClient = new QueryClient();

const UnderConstructionPage = ({ title }: { title: string }) => (
	<div className="flex flex-col items-center justify-center min-h-[70vh]">
		<h1 className="text-2xl font-bold mb-4">{title}</h1>
		<p className="text-gray-600">🚧 準備中です... 🚧</p>
	</div>
);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Layout title="読書ランキング">
					<Routes>
						<Route path="/leaderboard" element={<LeaderboardPage />} />
						<Route path="/books" element={<BooksPage />} />
						<Route path="/reads" element={<UnderConstructionPage title="共読" />} />
						<Route path="/" element={<Navigate to="/leaderboard" replace />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
