'use client';

import { getUrl } from '@lib/qrcode';
import { cn } from '@lib/utils';
import { Printer } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { FC, useState } from 'react';
import ArrowButton from './ArrowButton';
import { Slider } from './ui/slider';

interface QRCodeProps {
	location: string;
	id: string;
	onPrint: (size: number) => void;
	style?: {
		container?: string;
		codeContainer?: string;
		button?: string;
	};
}

const QRCode: FC<QRCodeProps> = ({ location, id, onPrint, style }) => {
	const [size, setSize] = useState(160);
	return (
		<div className={style?.container || ''}>
			<div
				className={cn(
					'grid w-64 h-64 cursor-pointer place-content-center bg-zinc-100 dark:bg-zinc-900',
					style?.codeContainer
				)}
				onClick={() => onPrint(size)}
			>
				<QRCodeCanvas
					value={getUrl(location, id)}
					size={size}
					className='box-content border border-white cursor-pointer'
					color='#FF0000'
				/>
			</div>
			<div className='flex items-center w-full max-w-lg gap-2 mt-4'>
				<label>Size</label>
				<div className='grow'>
					<Slider
						min={64}
						max={256}
						step={4}
						defaultValue={[size]}
						onValueChange={(value) => setSize(value[0])}
					/>
				</div>
				<span>{size}px</span>
			</div>
			<ArrowButton
				onClick={() => onPrint(size)}
				className={cn('mt-4', style?.button)}
				Icon={Printer}
			>
				Print QR Code
			</ArrowButton>
		</div>
	);
};

export default QRCode;
