import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

type Props = {
	children: React.ReactNode;
	title?: string;
};

export const Layout: React.FC<Props> = ({ children, title }: Props) => {
	const location = useLocation();

	const isActiveTab = (path: string) => {
		if (
			path === '/leaderboard' &&
			(location.pathname === '/' || location.pathname === '/leaderboard')
		) {
			return true;
		}
		return location.pathname === path;
	};

	const tabStyle = (path: string) => `
		px-6 py-4 text-sm font-medium transition-colors duration-200
		${
			isActiveTab(path)
				? 'text-white border-b-2 border-white'
				: 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/50'
		}
	`;

	return (
		<>
			<Helmet>
				<title>{title ? `${title} | 読書メーター Plus` : '読書メーター Plus'}</title>
			</Helmet>
			<header className="bookmeter-green text-white shadow-md">
				<div className="container mx-auto px-4">
					<nav className="flex justify-between items-center">
						<div className="flex items-center">
							<h1 className="text-xl font-bold text-white pr-4">📚</h1>
							<Link to="/leaderboard" className={tabStyle('/leaderboard')}>
								読書ランキング
							</Link>
							<Link to="/books" className={tabStyle('/books')}>
								本一覧
							</Link>
							<Link to="/reads" className={tabStyle('/shared')}>
								共読
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<Link to="/join" className="join-button">
								グループに参加
							</Link>
						</div>
					</nav>
				</div>
			</header>
			{children}
		</>
	);
};
