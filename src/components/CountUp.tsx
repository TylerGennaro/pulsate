import { useEffect, useState } from 'react';

type CountUpProps = {
	duration?: number;
	value: number;
	formatThousands?: boolean;
};

export default function CountUp({
	duration = 2000,
	value,
	formatThousands = true,
}: CountUpProps) {
	const frameDuration = 1000 / 60;
	const totalFrames = Math.round(duration / frameDuration);
	const easeFn = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

	const [currentCount, setCurrentCount] = useState(0);

	let frame = 0;
	useEffect(() => {
		const interval = setInterval(() => {
			frame++;
			const progress = easeFn(frame / totalFrames);
			const currentCount = Math.round(value * progress);
			setCurrentCount(currentCount);
			if (frame >= totalFrames) {
				clearInterval(interval);
				setCurrentCount(value);
			}
		}, frameDuration);
		return () => clearInterval(interval);
	}, []);

	return (
		<span>
			{formatThousands ? currentCount.toLocaleString('en-us') : currentCount}
		</span>
	);
}
