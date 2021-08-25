import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';

export default class HCardEditing extends Plugin {
  static get requires() {
	return [ Widget ];
  }

  static get pluginName() {
    return 'Slot alias items'
  }

  init() {
	this._defineSchema();
	this._defineConverters();
	this._defineClipboardInputOutput();

	// View-to-model position mapping is needed because an h-card element in the model is represented by a single element,
	// but in the view it is a more complex structure.
	this.editor.editing.mapper.on(
	  'viewToModelPosition',
	  viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'slot-item' ) )
	);
  }

  _defineSchema() {
	this.editor.model.schema.register( 'slot-item', {
	  allowWhere: '$text',
	  isInline: true,
	  isObject: true,
	  allowAttributes: [ 'alias' ]
	} );
  }

  _defineConverters() {
	const conversion = this.editor.conversion;

	// Data-to-model conversion.
	conversion.for( 'upcast' ).elementToElement( {
	  view: {
		name: 'span',
		classes: [ 'slot-item' ]
	  },
	  model: ( viewElement, { writer } ) => {
		return writer.createElement( 'h-card', getCardDataFromViewElement( viewElement ) );
	  }
	} );

	// Model-to-data conversion.
	conversion.for( 'dataDowncast' ).elementToElement( {
	  model: 'slot-item',
	  view: ( modelItem, { writer: viewWriter } ) => createCardView( modelItem, viewWriter )
	} );

	// Model-to-view conversion.
	conversion.for( 'editingDowncast' ).elementToElement( {
	  model: 'slot-item',
	  view: ( modelItem, { writer: viewWriter } ) => toWidget( createCardView( modelItem, viewWriter ), viewWriter )
	} );

	// Helper method for both downcast converters.
	function createCardView( modelItem, viewWriter ) {
	  const alias = modelItem.getAttribute( 'alias' ); //

	  const cardView = viewWriter.createContainerElement( 'span', { class: 'slot-item' } );

	  const aliasView = viewWriter.createContainerElement( 'span', { class: 'slot-alias' }) //

	  viewWriter.insert( viewWriter.createPositionAt( aliasView, 0 ), viewWriter.createText( alias ) );

	  viewWriter.insert( viewWriter.createPositionAt( cardView, 0 ), aliasView );

	  return cardView;
	}
  }

  // Integration with the clipboard pipeline.
  _defineClipboardInputOutput() {
	const view = this.editor.editing.view;
	const viewDocument = view.document;

	// Processing pasted or dropped content.
	this.listenTo( viewDocument, 'clipboardInput', ( evt, data ) => {
	  // The clipboard content was already processed by the listener on the higher priority
	  // (for example while pasting into the code block).
	  if ( data.content ) {
		return;
	  }

	  const slotData = data.dataTransfer.getData( 'slot-alias' );

	  if ( !slotData ) {
		return;
	  }

	  // Use JSON data encoded in the DataTransfer.
	  const slot = JSON.parse( slotData );

	  // Translate the h-card data to a view fragment.
	  const writer = new UpcastWriter( viewDocument );
	  const fragment = writer.createDocumentFragment();

	  writer.appendChild(
		writer.createElement( 'span', { class: 'h-card' }, [
		  writer.createElement( 'span', { class: 'slot-alias' }, slot.alias )
		] ),
		fragment
	  );

	  // Provide the content to the clipboard pipeline for further processing.
	  data.content = fragment;
	} );

	// Processing copied, pasted or dragged content.
	this.listenTo( document, 'clipboardOutput', ( evt, data ) => {
	  if ( data.content.childCount != 1 ) {
		return;
	  }

	  const viewElement = data.content.getChild( 0 );

	  if ( viewElement.is( 'element', 'span' ) && viewElement.hasClass( 'slot-item' ) ) {
		data.dataTransfer.setData( 'slot-alias', JSON.stringify( getCardDataFromViewElement( viewElement ) ) );
	  }
	} );
  }
}

//
// H-Card helper functions.
//

function getCardDataFromViewElement( viewElement ) {
  const children = Array.from( viewElement.getChildren() );
  const aliasElement = children.find( element => element.is( 'element', 'span') && element.hasClass('alias'))

  return {
    alias: getText(alias),
  };
}

function getText( viewElement ) {
  return Array.from( viewElement.getChildren() )
	.map( node => node.is( '$text' ) ? node.data : '' )
	.join( '' );
}
