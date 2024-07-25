import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	InspectorControls,
} from '@wordpress/block-editor';
import './editor.scss';
import {
	Button,
	PanelBody,
	RangeControl,
	CheckboxControl,
	TextControl,
} from '@wordpress/components';
import Billboard from './billboard';
import Images from './inspector/images';

export default function Edit( { attributes, setAttributes } ) {
	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<Images
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
				<PanelBody title={ __( 'Settings' ) }>
					<TextControl
						label={ __( 'Height', 'billboard-slider' ) }
						value={ attributes.height }
						onChange={ ( height ) =>
							setAttributes( { ...attributes, height } )
						}
					/>
					<RangeControl
						label={ __( 'Boards', 'billboard-slider' ) }
						value={ attributes.boardsCount }
						min={ 1 }
						max={ 100 }
						onChange={ ( boardsCount ) =>
							setAttributes( { ...attributes, boardsCount } )
						}
					/>
					<RangeControl
						label={ __( 'Animation speed', 'billboard-slider' ) }
						value={ attributes.animationSpeed }
						min={ 1000 }
						max={ 10000 }
						onChange={ ( animationSpeed ) =>
							setAttributes( { ...attributes, animationSpeed } )
						}
					/>
					<CheckboxControl
						label={ __( 'Show navigation', 'billboard-slider' ) }
						checked={ attributes.showNavigation }
						onChange={ ( showNavigation ) =>
							setAttributes( { ...attributes, showNavigation } )
						}
					/>
					<CheckboxControl
						label={ __(
							'Move automatically',
							'billboard-slider'
						) }
						checked={ attributes.moveAutomatically }
						onChange={ ( moveAutomatically ) =>
							setAttributes( {
								...attributes,
								moveAutomatically,
							} )
						}
					/>
					{ attributes.moveAutomatically && (
						<RangeControl
							label={ __(
								'Move automatically interval',
								'billboard-slider'
							) }
							value={ attributes.moveAutomaticallyInterval }
							min={ 500 }
							max={ 10000 }
							onChange={ ( moveAutomaticallyInterval ) =>
								setAttributes( {
									...attributes,
									moveAutomaticallyInterval,
								} )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ attributes.images.length > 0 ? (
				<Billboard
					key={ JSON.stringify( attributes ) }
					images={ attributes.images }
					boardsCount={ attributes.boardsCount }
					height={ attributes.height }
					animationSpeed={ attributes.animationSpeed }
					showNavigation={ attributes.showNavigation }
					moveAutomatically={ attributes.moveAutomatically }
					moveAutomaticallyInterval={
						attributes.moveAutomaticallyInterval
					}
				/>
			) : (
				<div className={ 'upload-area' }>
					<MediaUpload
						onSelect={ ( media ) => {
							setAttributes( {
								...attributes,
								images: [ ...media.map( ( { url } ) => url ) ],
							} );
						} }
						multiple
						allowedTypes={ [ 'image' ] }
						render={ ( { open } ) => (
							<Button onClick={ open }>
								{ __( 'Add Images', 'billboard-slider' ) }
							</Button>
						) }
					/>
				</div>
			) }
		</div>
	);
}
