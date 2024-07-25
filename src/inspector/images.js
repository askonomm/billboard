import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';

export default function Images( { attributes, setAttributes } ) {
	return (
		<PanelBody title={ __( 'Images', 'billboard-slider' ) }>
			{ attributes.images.length > 0 && (
				<ul className={ 'askonth-billboard-inspector-images' }>
					{ attributes.images.map( ( image, index ) => (
						<li key={ index }>
							<img src={ image } alt={ '' } />
							<Button
								onClick={ () => {
									setAttributes( {
										...attributes,
										images: attributes.images.filter(
											( _, i ) => i !== index
										),
									} );
								} }
							>
								Remove
							</Button>
						</li>
					) ) }
				</ul>
			) }

			<MediaUpload
				onSelect={ ( media ) => {
					setAttributes( {
						...attributes,
						images: [
							...attributes.images,
							...media.map( ( { url } ) => url ),
						],
					} );
				} }
				multiple
				allowedTypes={ [ 'image' ] }
				render={ ( { open } ) => (
					<Button variant="secondary" onClick={ open }>
						{ __( 'Add images', 'billboard-slider' ) }
					</Button>
				) }
			/>
		</PanelBody>
	);
}
