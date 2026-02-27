import { useState } from 'react';

type TooltipProps = {
	children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
	const [show, setShow] = useState(false);

	return (
		<>
			<button
				type="button"
				onMouseEnter={() => setShow(true)}
				onMouseLeave={() => setShow(false)}
				onClick={() => setShow(!show)}
				className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs border border-white rounded-full hover:bg-white/20 transition-colors"
			>
				?
			</button>
			{show && (
				<div className="absolute top-full right-0 mt-2 w-64 p-3 bg-white text-gray-700 text-xs text-left rounded-lg shadow-lg border border-gray-200 z-10">
					{children}
				</div>
			)}
		</>
	);
};
