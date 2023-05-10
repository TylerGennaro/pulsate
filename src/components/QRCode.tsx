'use client';

import { FC } from 'react';
import { Button } from './ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { getUrl, printQRCode } from '@lib/qrcode';

interface QRCodeProps {
	location: string;
	uid: string;
	name: string;
}

const QRCode: FC<QRCodeProps> = ({ location, uid, name }) => {
	return (
		<>
			<QRCodeCanvas
				value={getUrl(location, uid)}
				size={256}
				onClick={() => printQRCode({ location, uid, name })}
				className='cursor-pointer'
			/>
			<Button
				onClick={() => printQRCode({ location, uid, name })}
				className='mt-4'
			>
				Print QR Code
			</Button>
		</>
	);
};

export default QRCode;
