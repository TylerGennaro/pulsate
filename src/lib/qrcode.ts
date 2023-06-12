import { siteConfig } from '@config/siteconfig';
import QRCode from 'qrcode';

export interface CodeData {
	location: string;
	id: string;
	name: string;
}

const style = `
	<style>
		body {
			display: flex;
			flex-wrap: wrap;
		}
		div {
			page-break-inside: avoid;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 1px solid black;
		}
		div > span {
			font-family: Tahoma, sans-serif;
			font-size: 1.5rem;
			font-weight: 700;
		}
	</style>
`;

const urlTemplate = `${process.env.NEXT_PUBLIC_PROJECT_URL}/checkout/%item`;

export function getUrl(location: string, code: string) {
	return urlTemplate.replace('%location', location).replace('%item', code);
}

export async function printQRCode(code: CodeData) {
	const image = await QRCode.toDataURL(getUrl(code.location, code.id), {
		width: 256,
	});
	const content = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>QR Code</title>
				${style}
			</head>
			<body>
				<div>
					<img src="${image}" />
					<span>${code.name}</span>
				</div>
			</body>
		</html>
	`;
	const win = window.open('', 'width=340,height=260')!;
	win.document.write(content);
	win.document.close();
	setTimeout(() => win.print(), 200);
}

export async function printQRCodes(codes: CodeData[]) {
	const images = codes.map(async (code) => {
		return {
			image: await QRCode.toDataURL(getUrl(code.location, code.id), {
				width: 256,
			}),
			name: code.name,
		};
	});
	const imageContent = await Promise.all(images).then((images) =>
		images
			.map((image) => {
				return `<div>
					<img src="${image.image}" />
					<span>${image.name}</span>
				</div>`;
			})
			.join('')
	);
	const content = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>QR Code</title>
				${style}
			</head>
			<body>
				${imageContent}
			</body>
		</html>
	`;
	const win = window.open('', 'width=340,height=260')!;
	win.document.write(content);
	win.document.close();
	setTimeout(() => win.print(), 200);
}
