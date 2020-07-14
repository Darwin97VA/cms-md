const findBlockQuotes = require( './converter-utilities/blockquotes' )
const setCodeType = require( './converter-utilities/code-blocks' )
const {getParagraphs, convertToObject} = require( './converter-utilities/deassembling' )
const convertText = require( './converter-utilities/inline-elements' )
const findLineBreaks = require( './converter-utilities/line-breaks' )
const convertLinks = require( './converter-utilities/links' )
const {findListIndexes, markListItems, findOrderedListItems} = require( './converter-utilities/lists' )
const {addContainerDivs, combineText} = require( './converter-utilities/reassembling' )

module.exports = function convertToHTML(markdownText){

	let paragraphs = getParagraphs(markdownText); 

	let paragraphObjects = paragraphs.map(paragraph => convertToObject(paragraph));

	paragraphObjects = setCodeType(paragraphObjects);
	paragraphObjects = findLineBreaks(paragraphObjects);
	paragraphObjects = findBlockQuotes(paragraphObjects);

	let indexes = findListIndexes(paragraphObjects);
	paragraphObjects = markListItems(paragraphObjects, indexes);
	paragraphObjects = findOrderedListItems(paragraphObjects);

	paragraphObjects = convertLinks(paragraphObjects);

	paragraphObjects = paragraphObjects.map(paragraph => {
		return {
			type: paragraph.type,
			content: convertText(paragraph.content + " ").trim()  // this hack is needed because if not styling at the end of a paragraph will not be counted 
		} 
	}); 

	paragraphObjects = addContainerDivs(paragraphObjects);
	let arrayOfHTML = combineText(paragraphObjects); 

	return arrayOfHTML.join("\n"); 
}
