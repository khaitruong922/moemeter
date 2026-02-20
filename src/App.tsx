import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './context/UserProvider';
import { routes } from './routes';

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

const router = createBrowserRouter(routes);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<RouterProvider router={router} />
			</UserProvider>
		</QueryClientProvider>
	);
}

export default App;
