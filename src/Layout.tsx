import { Outlet, ScrollRestoration } from 'react-router-dom';
import { NavBar } from './components/NavBar';

export const Layout: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col relative">
			<NavBar />
			<main className="flex-grow bg-[#f5f5f5] pt-14">
				<ScrollRestoration />
				<Outlet />
			</main>
		</div>
	);
};
