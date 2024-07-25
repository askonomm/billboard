import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	return (
		<div { ...useBlockProps.save() }>
			<div data-attributes={ JSON.stringify( attributes ) }></div>
		</div>
	);
}
