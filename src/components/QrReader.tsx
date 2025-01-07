import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';

type QrReaderProps = {
	onScanSuccess?: (result: string) => void;
	onScanFail?: (err: string | Error) => void;
};

export default function QrReader({
	onScanSuccess = () => {},
	onScanFail = () => {},
}: QrReaderProps) {
	const scanner = useRef<QrScanner>();
	const videoRef = useRef<HTMLVideoElement>(null);
	const qrBoxRef = useRef<HTMLDivElement>(null);
	const [qrOn, setQrOn] = useState<boolean>(true);

	useEffect(() => {
		if (videoRef?.current && !scanner.current) {
			scanner.current = new QrScanner(
				videoRef?.current,
				(result: QrScanner.ScanResult) => onScanSuccess(result?.data),
				{
					onDecodeError: onScanFail,
					preferredCamera: 'environment',
					highlightScanRegion: true,
					highlightCodeOutline: true,
					overlay: qrBoxRef?.current || undefined,
				}
			);

			scanner?.current
				?.start()
				.then(() => setQrOn(true))
				.catch((err) => {
					if (err) setQrOn(false);
				});
		}

		return () => {
			if (!videoRef?.current) {
				scanner?.current?.stop();
			}
		};
	}, []);

	useEffect(() => {
		if (!qrOn)
			alert(
				'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.'
			);
	}, [qrOn]);

	return (
		<div className='w-full sm:max-w-sm h-[50vh] mx-auto my-0 relative'>
			<video ref={videoRef} className='object-cover w-full h-full' />
			<div ref={qrBoxRef} className='!w-full !left-0'>
				<img
					src='/qrframe.svg'
					alt='Qr Frame'
					width={256}
					height={256}
					className='absolute transform -translate-x-1/2 -translate-y-1/2 fill-none left-1/2 top-1/2'
				/>
			</div>
		</div>
	);
}
