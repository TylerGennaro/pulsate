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
				placeholder='Enter product name'
				required
				defaultValue={defaultValues?.name}
			/>
			<InputGroup
				label='Min Quantity'
				name='min'
				placeholder='Enter the minimum quantity'
				defaultValue={defaultValues?.min || 5}
				type='number'
				desc="When the product's quantity reaches this number, it will be marked as low quantity. Default: 5"
			/>
			<InputGroup
				label='Max Quantity'
				name='max'
				placeholder='Enter the maximum quantity'
				defaultValue={defaultValues?.max}
				type='number'
				desc='The maximum number of this product that can be stored in this location.'
			/>
			<div className='grid grid-cols-4 items-center gap-y-1'>
				<label className='col-span-1 text-right mr-4'>
					Packaging<span className='text-red-500 ml-1'>*</span>
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
		</div>
	);
}
