export default async function Page({
	params,
}: {
	params: { session_id: string };
}) {
	const session = await fetch(
		`${process.env.NEXT_PUBLIC_PROJECT_URL}/api/purchase?id=${params.session_id}`,
		{
			next: {
				revalidate: 10,
			},
		}
	).then((res) => res.json());

	return (
		<div>
			<h1>Session {params.session_id}</h1>
			<p>Session data: {JSON.stringify(session)}</p>
			<p>Status: {session.status === 'complete' ? 'Complete' : 'loading...'}</p>
		</div>
	);
}
