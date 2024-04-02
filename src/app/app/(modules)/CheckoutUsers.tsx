const data = [
	{
		name: 'John Doe',
		email: 'johndoe@example.com',
		items: 4,
	},
	{
		name: 'John Doe',
		email: 'johndoe@example.com',
		items: 4,
	},
	{
		name: 'John Doe',
		email: 'johndoe@example.com',
		items: 4,
	},
];

export default function CheckoutUsers() {
	return (
		<ul className='mt-8'>
			{data.map((user, i) => (
				<li
					key={i}
					className='flex items-center justify-between py-4 border-b last-of-type:border-none'
				>
					<div className='flex items-center gap-4'>
						<div className='w-12 rounded-full aspect-square bg-muted' />
						<div>
							<p>{user.name}</p>
							<p className='text-muted-foreground'>{user.email}</p>
						</div>
					</div>
					<p>{user.items} items</p>
				</li>
			))}
		</ul>
	);
}
