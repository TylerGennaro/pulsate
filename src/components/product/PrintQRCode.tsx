'use client';

import QRCode from '@components/QRCode';
import { printQRCode } from '@lib/qrcode';

export default function PrintQRCode({
	location,
	id,
	name,
}: {
	location: string;
	id: string;
	name: string;
}) {
	return (
		<QRCode
			location={location}
			id={id}
			onPrint={(size) =>
				printQRCode(size, {
					location,
					id,
					name,
				})
			}
			style={{
				container: 'flex flex-col items-center',
			}}
		/>
	);
}
