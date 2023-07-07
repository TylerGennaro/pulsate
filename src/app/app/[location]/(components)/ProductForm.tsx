import InputGroup from '@components/FormGroup';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { PackageType } from '@lib/enum';

interface Props {
	name?: string;
	min?: number;
	max?: number;
	packageType?: PackageType;
	position?: string;
}

export default function ProductForm({
	defaultValues,
}: {
	defaultValues?: Props;
}) {
	return (
		<div className='grid gap-4 py-4 min-w-fit'>
			<InputGroup
				label='Name'
				name='name'
				placeholder='Product name'
				required
				defaultValue={defaultValues?.name}
			/>
			<InputGroup
				label='Min Quantity'
				name='min'
				placeholder='Minimum quantity'
				defaultValue={defaultValues?.min || 5}
				type='number'
				desc="When the product's quantity goes below this number, it will be marked as low quantity. Default: 5"
			/>
			<InputGroup
				label='Max Quantity'
				name='max'
				placeholder='Maximum quantity'
				defaultValue={defaultValues?.max}
				type='number'
				desc='The maximum number of this product that can be stored in this location. This does not limit the quantity.'
			/>
			<div className='grid items-center grid-cols-4 gap-y-1'>
				<label className='col-span-1 mr-4 text-right'>
					Packaging<span className='ml-1 text-red-500'>*</span>
				</label>
				<div className='col-span-3'>
					<Select
						name='packageType'
						defaultValue={defaultValues?.packageType as string}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select the packaging' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value='single'>Single Item</SelectItem>
								<SelectItem value='pack'>Pack</SelectItem>
								<SelectItem value='box'>Box</SelectItem>
								<SelectItem value='case'>Case</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
			<InputGroup
				label='Position'
				name='position'
				placeholder='Shelf position'
				defaultValue={defaultValues?.position}
			/>
		</div>
	);
}
