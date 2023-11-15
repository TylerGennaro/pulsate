import Loader from './ui/loader';

export default function Loading() {
	return (
		<div className='w-full h-[50vh] flex justify-center items-end'>
			<Loader className='text-blue-700' />
		</div>
	);
}
