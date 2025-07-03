import { Helmet } from 'react-helmet';

type Props = {
	children: React.ReactNode;
	title?: string;
};

export const Layout: React.FC<Props> = ({ children, title }: Props) => {
	return (
		<>
			<Helmet>
				<title>{title} | 読書メーター追加機能</title>
			</Helmet>
			<header className="bookmeter-green text-white py-4 shadow-md">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between flex-row">
						<h1 className="text-xl font-bold text-white">📚 読書メーター追加機能</h1>
						<div className="flex items-center space-x-4">
							<a href="/join" className="join-button">
								グループに参加
							</a>
						</div>
					</div>
				</div>
			</header>
			<div className="container mx-auto">{children}</div>
		</>
	);
};
