/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Font from '@ckeditor/ckeditor5-font/src/font';
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';

import HCardEditing from './plugin';

export default class ClassicEditor extends DecoupledEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	CloudServices,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	ListStyle,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	Alignment,
	Font,
	BlockQuote,
	FindAndReplace,
	HCardEditing
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
		    '|',
			'heading',
		    'bold',
		    'italic',
		  	'|',
		    'blockQuote',
		    'lineHeight',
		    'fontSize',
		    'fontFamily',
		    'fontColor',
		    'fontBackgroundColor',
			'|',
		    'FindAndReplace',
		    'alignment',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'uploadImage',
			'insertTable',
		    'tableColumn',
		    'tableRow',
		    'mergeTableCells',
			'mediaEmbed',
			'undo',
			'redo',
		    '|',
		    'ckfinder',
		    'selectAll',
		    'imageUpload'
		],
	    shouldNotGroupWhenFull: false
	},
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'toggleImageCaption',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	exportPdf: {
	  stylesheets: [ 'EDITOR_STYLES' ],
	  fileName: 'document.pdf',
	  converterUrl: 'https://pdf-converter.cke-cs.com/v1/convert',
	  converterOptions: {
			format: 'A4',
			margin_top: '0',
			margin_bottom: '0',
			margin_right: '0',
			margin_left: '0',
			page_orientation: 'portrait',
			header_html: undefined,
			footer_html: undefined,
			header_and_footer_css: undefined,
			wait_for_network: true,
			wait_time: 0
	  },
	  dataCallback: editor => editor.getData()
	},
	fontSize: {
	  options: [
	    10, 12, 14, 16, 18, 20, 22, 24
	  ],
	  supportAllValues: true
	},
	fontFamily: {
		options: [
		  'default',
		  'Arial, Helvetica, sans-serif',
		  'Courier New, Courier, monospace',
		  'Georgia, serif',
		  'Lucida Sans Unicode, Lucida Grande, sans-serif',
		  'Tahoma, Geneva, sans-serif',
		  'Times New Roman, Times, serif',
		  'Trebuchet MS, Helvetica, sans-serif',
		  'Verdana, Geneva, sans-serif',
		  'Calibri, sans-serif'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
