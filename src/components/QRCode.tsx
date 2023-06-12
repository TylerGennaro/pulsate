'use client';

import { FC } from 'react';
import { Button } from './ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { getUrl, printQRCode } from '@lib/qrcode';

interface QRCodeProps {
	location: string;
	id: string;
	name: string;
}

const QRCode: FC<QRCodeProps> = ({ location, id, name }) => {
	return (
		<>
			<QRCodeCanvas
				value={getUrl(location, id)}
				size={256}
				onClick={() => printQRCode({ location, id, name })}
				className='cursor-pointer'
			/>
			<Button
				onClick={() => printQRCode({ location, id, name })}
				className='mt-4'
			>
				Print QR Code
			</Button>
		</>
	);
};

export default QRCode;
