import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './context/userContext';

type Props = {
	children: React.ReactNode;
	title?: string;
};

export const Layout: React.FC<Props> = ({ children, title }: Props) => {
	const location = useLocation();
	const { user, logout } = useUser();

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
		px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2
		${
			isActiveTab(path)
				? 'text-white border-white'
				: 'text-white/80 hover:text-white border-transparent hover:border-white/50'
		}
	`;

	return (
		<>
			<Helmet>
				<title>{title ? `${title} | 読書メーター Plus` : '読書メーター Plus'}</title>
			</Helmet>
			<div className="min-h-screen flex flex-col relative">
				<header className="bookmeter-green text-white shadow-md fixed w-full top-0 z-50">
					<div className="container mx-auto px-4">
						<nav className="flex justify-between items-center h-14">
							<div className="flex items-center">
								<h1 className="text-xl font-bold text-white pr-4">📚</h1>
								<Link to="/leaderboard" className={tabStyle('/leaderboard')}>
									読書ランキング
								</Link>
								<Link to="/books" className={tabStyle('/books')}>
									みんなの本棚
								</Link>
								<Link to="/reads" className={tabStyle('/reads')}>
									共読
								</Link>
							</div>
							<div className="flex items-center space-x-4">
								{user ? (
									<div className="flex items-center space-x-4">
										<div className="flex items-center space-x-2">
											<img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
											<span className="text-sm font-medium">{user.name}</span>
										</div>
										<button
											onClick={logout}
											className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer"
										>
											ログアウト
										</button>
									</div>
								) : (
									<div className="flex items-center space-x-6">
										<Link
											to="/signin"
											className="text-white hover:text-white/80 transition-colors duration-200"
										>
											サインイン
										</Link>
										<Link
											to="/join"
											className="text-white hover:text-white/80 transition-colors duration-200"
										>
											グループに参加
										</Link>
									</div>
								)}
							</div>
						</nav>
					</div>
				</header>
				<main className="flex-grow bg-[#f5f5f5] pt-14">{children}</main>
			</div>
		</>
	);
};
