import { Construction } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

export default function Page() {
	return (
		<main className='w-full h-[100vh] grid place-content-center'>
			<div className='flex flex-col items-center max-w-screen-sm text-center'>
				<Construction size={64} className='mb-6' />
				<Balancer className='text-5xl font-bold leading-tight tracking-tight'>
					We are currently undergoing maintenance.{' '}
					<span className='italic text-primary'>Yuck!</span>
				</Balancer>
				<Balancer className='mt-4 text-lg leading-relaxed tracking-wide text-muted-foreground'>
					We&apos;ll be back before you can say{' '}
					<a
						className='italic underline break-all'
						href='https://en.wikipedia.org/w/index.php?title=Lopado%C2%ADtemacho%C2%ADselacho%C2%ADgaleo%C2%ADkranio%C2%ADleipsano%C2%ADdrim%C2%ADhypo%C2%ADtrimmato%C2%ADsilphio%C2%ADkarabo%C2%ADmelito%C2%ADkatakechy%C2%ADmeno%C2%ADkichl%C2%ADepi%C2%ADkossypho%C2%ADphatto%C2%ADperister%C2%ADalektryon%C2%ADopte%C2%ADkephallio%C2%ADkigklo%C2%ADpeleio%C2%ADlagoio%C2%ADsiraio%C2%ADbaphe%C2%ADtragano%C2%ADpterygon&diffonly=true'
						target='_blank'
					>
						Lopadotemachoselachogaleokranioleipsanodrimhypotrimmatosilphiokarabomelitokatakechymenokichlepikossyphophattoperisteralektryonoptekephalliokigklopeleiolagoiosiraiobaphetraganopterygon
					</a>
					.
				</Balancer>
			</div>
		</main>
	);
}
