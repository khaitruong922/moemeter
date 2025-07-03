import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LeaderboardPage from './pages/LeaderboardPage';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<LeaderboardPage />
		</QueryClientProvider>
	);
}

export default App;
