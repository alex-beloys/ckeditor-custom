import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';

export default class HCardEditing extends Plugin {
  static get requires() {
	return [ Widget ];
  }

  static get pluginName() {
	return 'Test plugin'
  }

  init() {
	this._defineSchema();
	this._defineConverters();
	this._defineClipboardInputOutput();

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

	conversion.for( 'upcast' ).elementToElement( {
	  view: {
		name: 'span',
		classes: [ 'slot-item' ]
	  },
	  model: ( viewElement, { writer } ) => {
		return writer.createElement( 'slot-item', getCardDataFromViewElement( viewElement ) );
	  }
	} );

	conversion.for( 'dataDowncast' ).elementToElement( {
	  model: 'slot-item',
	  view: ( modelItem, { writer: viewWriter } ) => createCardView( modelItem, viewWriter )
	} );

	conversion.for( 'editingDowncast' ).elementToElement( {
	  model: 'slot-item',
	  view: ( modelItem, { writer: viewWriter } ) => toWidget( createCardView( modelItem, viewWriter ), viewWriter )
	} );

	function createCardView( modelItem, viewWriter ) {
	  const alias = modelItem.getAttribute( 'alias' );

	  const cardView = viewWriter.createContainerElement( 'span', { class: 'slot-item' } );
	  const phoneView = viewWriter.createContainerElement( 'span', { class: 'p-alias' } );

	  viewWriter.insert( viewWriter.createPositionAt( phoneView, 0 ), viewWriter.createText( alias ) );
	  viewWriter.insert( viewWriter.createPositionAt( cardView, 0 ), phoneView );

	  return cardView;
	}
  }

  _defineClipboardInputOutput() {
	const view = this.editor.editing.view;
	const viewDocument = view.document;

	this.listenTo( viewDocument, 'clipboardInput', ( evt, data ) => {
	  if ( data.content ) {
		return;
	  }

	  const slotData = data.dataTransfer.getData( 'slot-alias' );

	  if ( !slotData ) {
		return;
	  }

	  const slot = JSON.parse( slotData );

	  const writer = new UpcastWriter( viewDocument );
	  const fragment = writer.createDocumentFragment();

	  writer.appendChild(
		writer.createElement( 'span', { class: 'slot-item' }, [
		  writer.createElement( 'span', { class: 'p-alias' }, slot.alias )
		] ),
		fragment
	  );

	  data.content = fragment;
	} );

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

function getCardDataFromViewElement( viewElement ) {
  const children = Array.from( viewElement.getChildren() );
  const aliasElement = children.find( element => element.is( 'element', 'span' ) && element.hasClass( 'p-alias' ) );

  return {
	alias: getText( aliasElement ),
  };
}

function getText( viewElement ) {
  return Array.from( viewElement.getChildren() )
	.map( node => node.is( '$text' ) ? node.data : '' )
	.join( '' );
}
