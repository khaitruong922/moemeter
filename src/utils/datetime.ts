export const formatDatetime = (dateString?: string) => {
	if (!dateString) return '---';
	const d = new Date(dateString);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const h = String(d.getHours()).padStart(2, '0');
	const min = String(d.getMinutes()).padStart(2, '0');
	const s = String(d.getSeconds()).padStart(2, '0');
	return `${y}/${m}/${day} ${h}:${min}:${s}`;
};
