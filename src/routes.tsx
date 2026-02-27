import { Navigate, type RouteObject } from 'react-router-dom';
import { ENABLE_JOIN_GROUP } from './constants';
import { Layout } from './Layout';
import BooksPage from './pages/BooksPage';
import BooksLibraryPage from './pages/BooksLibraryPage';
import BookMergesPage from './pages/BookMergesPage';
import JoinPage from './pages/JoinPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LonelyLeaderboardPage from './pages/LonelyLeaderboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Navigate to="/leaderboard" replace />,
			},
			{
				path: 'leaderboard',
				element: <LeaderboardPage />,
			},
			{
				path: 'lonely-leaderboard',
				element: <LonelyLeaderboardPage />,
			},
			{
				path: 'books',
				element: <BooksPage />,
			},
			{
				path: 'books/library',
				element: <BooksLibraryPage />,
			},
			{
				path: 'book-merges',
				element: <BookMergesPage />,
			},
			{
				path: 'profile/:id',
				element: <ProfilePage />,
			},
			{
				path: 'profile/:id/lonely-books',
				element: <ProfilePage />,
			},
			{
				path: 'profile/:id/friends',
				element: <ProfilePage />,
			},
			...(ENABLE_JOIN_GROUP
				? [
						{
							path: 'join',
							element: <JoinPage />,
						},
					]
				: []),
			{
				path: 'login',
				element: <LoginPage />,
			},
		],
	},
];
