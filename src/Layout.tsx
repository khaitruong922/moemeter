import { Link, useLocation } from 'react-router-dom';
import { useUser } from './context/useUser';
import { ENABLE_JOIN_GROUP } from './constants';

type Props = {
	children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }: Props) => {
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
		px-2 py-4 text-xs lg:text-sm font-medium transition-colors duration-200 border-b-2 lg:px-6
		${
			isActiveTab(path)
				? 'text-white border-white'
				: 'text-white/80 hover:text-white border-transparent hover:border-white/50'
		}
	`;

	return (
		<div className="min-h-screen flex flex-col relative">
			<header className="bookmeter-green text-white shadow-md fixed w-full top-0 z-50">
				<div className="container mx-auto px-2 md:px-4">
					<nav className="flex justify-between items-center h-14">
						<div className="flex items-center">
							<img src="/bookmeter.svg" alt="萌メーター" className="w-5 h-5 md:w-6 md:h-6" />
							<span className="hidden md:block text-lg font-bold ml-2">萌メーター</span>
							<div className="ml-4 md:ml-6 flex items-center">
								<Link to="/leaderboard" className={tabStyle('/leaderboard')}>
									読書ランキング
								</Link>
								<Link to="/books" className={tabStyle('/books')}>
									みんなの本棚
								</Link>
								<Link to="/reads" className={tabStyle('/reads')}>
									共読
								</Link>
								<Link to="/lonely-books" className={tabStyle('/lonely-books')}>
									ひとりぼっち本
								</Link>
							</div>
						</div>
						<div className="flex items-center space-x-2 md:space-x-4">
							{user ? (
								<div className="flex items-center space-x-2 md:space-x-4">
									<div className="flex items-center space-x-2">
										<Link to="/profile" className="flex items-center space-x-2 group">
											<img
												src={user.avatar_url}
												alt={user.name}
												className="w-6 h-6 md:w-8 md:h-8 rounded-full"
											/>
											<span className="hidden md:inline text-xs md:text-sm font-medium">
												{user.name}
											</span>
										</Link>
									</div>
									<button
										onClick={logout}
										className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer text-xs md:text-sm flex items-center"
									>
										<span className="hidden max-[500px]:inline">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M18 12H9m0 0l3-3m-3 3l3 3"
												/>
											</svg>
										</span>
										<span className="inline max-[500px]:hidden">ログアウト</span>
									</button>
								</div>
							) : (
								<div className="flex items-center space-x-3 md:space-x-6">
									<Link
										to="/login"
										className="text-white hover:text-white/80 transition-colors duration-200 text-xs md:text-sm flex items-center"
									>
										ログイン
									</Link>
									{ENABLE_JOIN_GROUP && (
										<Link
											to="/join"
											className="text-white hover:text-white/80 transition-colors duration-200 text-xs md:text-sm"
										>
											グループに参加
										</Link>
									)}
								</div>
							)}
						</div>
					</nav>
				</div>
			</header>
			<main className="flex-grow bg-[#f5f5f5] pt-14">{children}</main>
		</div>
	);
};
