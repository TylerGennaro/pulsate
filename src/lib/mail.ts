import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';
import { authOptions } from './auth';
import { Item, Location, Product } from '@prisma/client';

export async function sendMail(to: string, subject: string, message: string) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_PW,
		},
	});

	const mailOptions = {
		from: `Pulsate <${process.env.NODEMAILER_EMAIL}>`,
		to,
		subject,
		text: message,
		html: message,
	};

	await new Promise((res, rej) => {
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				rej(err);
				throw new Error(err.message);
			} else {
				res(info);
			}
		});
	});
}

export async function sendCheckoutEmail(
	email: string,
	product: Product & { location: Location },
	items: { id: string; quantity: number; expiration: Date | null }[]
) {
	const session = await getServerSession(authOptions);
	await sendMail(
		email,
		`[${product.location.name}] Checkout recorded`,
		`
				<html>
				<body>
					<h2>Checkout recorded</h2>
					<p>
						<strong>User:</strong> ${session?.user?.name ?? 'Guest'}<br>
						<strong>Product:</strong> ${product.name}<br>
						<strong>Quantity:</strong> ${items.reduce(
							(acc, item) => acc + item.quantity,
							0
						)}<br>
						<strong>Time:</strong> ${new Date().toLocaleString('en-US', {
							timeZone: 'America/New_York',
						})} EST<br>
					</p>
				</body>
			</html>
			`
	);
}
