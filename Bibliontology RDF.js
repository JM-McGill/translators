{
	"translatorID": "14763d25-8ba0-45df-8f52-b8d1108e7ac9",
	"translatorType": 3,
	"label": "Bibliontology RDF",
	"creator": "Simon Kornblith",
	"target": "rdf",
	"minVersion": "2.0",
	"maxVersion": "",
	"priority": 50,
	"inRepository": false,
	"browserSupport": "gcs",
	"configOptions":{"getCollections":"true", "dataMode":"rdf/xml"},
	"displayOptions":{"exportNotes":true},
	"inRepository":false,
	"lastUpdated":"2015-01-02 03:33:15"
}

var n = {
	address:"http://schemas.talis.com/2005/address/schema#",	// could also use vcard?
	bibo:"http://purl.org/ontology/bibo/",
	ctag:"http://commontag.org/ns#",
	dcterms:"http://purl.org/dc/terms/",
	doap:"http://usefulinc.com/ns/doap#",
	foaf:"http://xmlns.com/foaf/0.1/",
	link:"http://purl.org/rss/1.0/modules/link/",
	po:"http://purl.org/ontology/po/",
	rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rel:"http://www.loc.gov/loc.terms/relators/",
	res:"http://purl.org/vocab/resourcelist/schema#",
	sc:"http://umbel.org/umbel/sc/",
	sioct:"http://rdfs.org/sioc/types#",
	mlz:"http://citationstylist.org/rdfschema/temp/",
	z:"http://www.zotero.org/namespaces/export#"
};

/**
   Types should be in the form
   
   <ZOTERO_TYPE>: [<ITEM_CLASS>, <SUBCONTAINER_CLASS>, <CONTAINER_CLASS>]
   
   Item classes should be in the form
   
   [[<PREDICATE>, <OBJECT>]+]
   
   This generates the triples
   
   (ITEM		<PREDICATE>				<OBJECT>)+
   
   Subcontainer and container classes should be in the form
   
   [<ALWAYS_INCLUDE>, <ITEM_PREDICATE>, [<CONTAINER_PREDICATE>, <CONTAINER_OBJECT>]*] | null
   
   If there is a property to be applied to the container, or if <ALWAYS_INCLUDE> is true, then this
   generates
   
   ITEM			<ITEM_PREDICATE>		CONTAINER
   (CONTAINER	<CONTAINER_PREDICATE>	<CONTAINER_OBJECT>)*
 **/
 
//	ZOTERO TYPE				ITEM CLASS											SUBCONTAINER CLASS					CONTAINER CLASS
var TYPES = {
	"artwork":				[[[n.rdf+"type", n.bibo+"Image"]], 					null, 								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Website"]]]],
    "attachment":           [[[n.rdf+"type", n.z+"Attachment"]],                null, 								null],
	"audioRecording":		[[[n.rdf+"type", n.bibo+"AudioDocument"]],			null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"CollectedDocument"]]]],
	"bill":					[[[n.rdf+"type", n.bibo+"Bill"]],					null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Code"]]]],					
	"blogPost":				[[[n.rdf+"type", n.sioct+"BlogPost"],
							  [n.rdf+"type", n.bibo+"Article"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.sioct+"Weblog"],
							   																						[n.rdf+"type", n.bibo+"Website"]]]],
	"book":					[[[n.rdf+"type", n.bibo+"Book"]],					null,								null],
	"bookSection":			[[[n.rdf+"type", n.bibo+"BookSection"]],			null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"EditedBook"]]]],
	"case":					[[[n.rdf+"type", n.bibo+"LegalCaseDocument"]],		null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"CourtReporter"]]]],
	"computerProgram":		[[[n.rdf+"type", n.sc+"ComputerProgram_CW"],
							  [n.rdf+"type", n.bibo+"Document"]], 				null,								null],
	"conferencePaper":		[[[n.rdf+"type", n.bibo+"Article"]],				null,								[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Proceedings"]]]],
	"dictionaryEntry":		[[[n.rdf+"type", n.bibo+"Article"]], 				null,								[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.sc+"Dictionary"],
																													[n.rdf+"type", n.bibo+"ReferenceSource"]]]],
	"document":				[[[n.rdf+"type", n.bibo+"Document"]],				null,								null],
	"email":				[[[n.rdf+"type", n.bibo+"Email"]],					null,								null],
	"encyclopediaArticle":	[[[n.rdf+"type", n.bibo+"Article"]], 				null,								[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.sc+"Encyclopedia"],
																													[n.rdf+"type", n.bibo+"ReferenceSource"]]]],
	"forumPost":			[[[n.rdf+"type", n.sioct+"BoardPost"],
							  [n.rdf+"type", n.bibo+"Article"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.sioct+"MessageBoard"],
							 																					 	[n.rdf+"type", n.bibo+"Website"]]]],
	"film":					[[[n.rdf+"type", n.bibo+"Film"]],					null,								null],
	"gazette":				[[[n.rdf+"type", n.bibo+"Gazette"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Code"]]]],
	"hearing":				[[[n.rdf+"type", n.bibo+"Hearing"]],				null,								[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Proceedings"]]]],
	"instantMessage":		[[[n.rdf+"type", n.sioct+"InstantMessage"],
							  [n.rdf+"type", n.bibo+"PersonalCommunication"]], 	null,								null],
	"interview":			[[[n.rdf+"type", n.bibo+"Interview"]],				null,								null],
	"journalArticle":		[[[n.rdf+"type", n.bibo+"AcademicArticle"]], 		[true, n.dcterms+"isPartOf",
																				 [[n.rdf+"type", n.bibo+"Issue"]]], 	[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Journal"]]]],
	"letter":				[[[n.rdf+"type", n.bibo+"Letter"]],					null,								null],
	"magazineArticle":		[[[n.rdf+"type", n.bibo+"Article"]], 				[true, n.dcterms+"isPartOf",
																				[[n.rdf+"type", n.bibo+"Issue"]]], 	[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Magazine"]]]],
	"manuscript":			[[[n.rdf+"type", n.bibo+"Manuscript"]],				null,								null],
	"classic":				[[[n.rdf+"type", n.bibo+"Classic"]],				null,								null],
	"map":					[[[n.rdf+"type", n.bibo+"Map"]],					null,								null],
	"newspaperArticle":		[[[n.rdf+"type", n.bibo+"Article"]], 				[true, n.dcterms+"isPartOf",
																				[[n.rdf+"type", n.bibo+"Issue"]]], 	[true, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Newspaper"]]]],
	"note":					[[[n.rdf+"type", n.bibo+"Note"]],					null,								null],
	"patent":				[[[n.rdf+"type", n.bibo+"Patent"]],					null,								null],
	"podcast":				[[[n.rdf+"type", n.z+"Podcast"],
							  [n.rdf+"type", n.bibo+"AudioDocument"]],			null,								null],
	"periodical":			[[[n.rdf+"type", n.bibo+"Journal"]],				null,								null],
	"presentation":			[[[n.rdf+"type", n.bibo+"Slideshow"]],				null,								null],
	"radioBroadcast":		[[[n.rdf+"type", n.po+"AudioDocument"],
							  [n.rdf+"type", n.po+"Episode"],
							  [n.po+"broadcast_on", n.po+"Radio"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.po+"Programme"]]]],
	"regulation":			[[[n.rdf+"type", n.bibo+"Regulation"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Code"]]]],
	"report":				[[[n.rdf+"type", n.bibo+"Report"]],					null,								null],
	"statute":				[[[n.rdf+"type", n.bibo+"Statute"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Code"]]]],
	"thesis":				[[[n.rdf+"type", n.bibo+"Thesis"]],					null,								null],
	"treaty":				[[[n.rdf+"type", n.bibo+"Treaty"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Code"]]]],
	"tvBroadcast":			[[[n.rdf+"type", n.bibo+"AudioVisualDocument"],
							  [n.rdf+"type", n.po+"Episode"],
							  [n.po+"broadcast_on", n.po+"TV"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.po+"Programme"]]]],
	"videoRecording":		[[[n.rdf+"type", n.bibo+"AudioVisualDocument"]], 	null,								null],
	"webpage":				[[[n.rdf+"type", n.bibo+"Webpage"]],				null,								[false, n.dcterms+"isPartOf", [[n.rdf+"type", n.bibo+"Website"]]]]
};

/**
 * This is just a map of un-namespaced BIBO item types to Zotero item types
 */
var BIBO_TYPES = {
	"Article":							"magazineArticle",
	"Brief":							"case",
	"Chapter":							"bookSection",
	"CollectedDocument":				"document",
	"DocumentPart":						"document",
	"EditedBook":						"book",
	"Excerpt":							"note",
	"Quote":							"note",
	"Film":								"videoRecording",
	"LegalDecision":					"case",
	"LegalDocument":					"case",
	"Legislation":						"bill",
	"Manual":							"book",
	"Performance":						"presentation",
	"PersonalCommunication":			"letter",
	"PersonalCommunicationDocument":	"letter",
	"Slide":							"presentation",
	"Standard":							"report",
	"Website":							"webpage"
};

var USERITEM = 1;
var ITEM = 2;
var SUBCONTAINER = 3;
var CONTAINER = 4;
var ITEM_SERIES = 5;
var SUBCONTAINER_SERIES = 6; 	// not used
var CONTAINER_SERIES = 7;

/**
    Fields should be in the form
    
    <ZOTERO_FIELD>: ([<SUBJECT>, <PREDICATE>] | <FUNCTION>)
    
    If a <FUNCTION> is specified, then it is passed the item and should return a set of triples in
    the form
    
    [[<SUBJECT>, <PREDICATE>, <OBJECT>, <LITERAL>]*]
    
    where <SUBJECT> refers to one of the constants defined above. If <LITERAL> is true, then
    <OBJECT> is treated as a literal.
    
    If a <FUNCTION> is not used and <PREDICATE> is a string, then the parameters generate a triple
    in the form
    
    <SUBJECT> 		<PREDICATE>				FIELD_CONTENT
    
    where <SUBJECT> refers to one of the constants defined above. Alternatively, <PREDICATE> may be
    an array in the form
    
	[<ITEM_PREDICATE>, [<BLANK_NODE_PREDICATE>, <BLANK_NODE_OBJECT>]*, <PREDICATE>]
	
	This generates the triples
	
	<SUBJECT>		<ITEM_PREDICATE>		<BLANK_NODE>
	(<BLANK_NODE>	<BLANK_NODE_PREDICATE>	<BLANK_NODE_OBJECT>)*
	<BLANK_NODE>	<PREDICATE>				FIELD_CONTENT
**/
var FIELDS = {
	"url":					[ITEM, 			n.bibo+"uri"],
	"rights":				[USERITEM,		n.dcterms+"rights"],
	"series":				[CONTAINER_SERIES,	n.dcterms+"title"],
	"volume":				[SUBCONTAINER,	n.bibo+"volume"],
	"yearAsVolume":			[SUBCONTAINER,	n.mlz+"yearAsVolume"],
	"issue" :				[SUBCONTAINER,	n.bibo+"issue"],
	"edition":				[SUBCONTAINER,	n.bibo+"edition"],
	"place":				[CONTAINER,		[n.dcterms+"publisher", [[n.rdf+"type", n.foaf+"Organization"]], n.address+"localityName"]],
	"country":				[CONTAINER,		[n.dcterms+"publisher", [[n.rdf+"type", n.foaf+"Organization"]], n.address+"countryName"]],
	"publisher":			[CONTAINER,		[n.dcterms+"publisher", [[n.rdf+"type", n.foaf+"Organization"]], n.foaf+"name"]],
	"pages":				[ITEM,			n.bibo+"pages"],
	"firstPage":			[ITEM,			n.bibo+"pageStart"],
	"ISBN":					[function(item) {
		var isbns = item.ISBN.split(/, ?| /g);
		var triples = [];
		for each(var isbn in isbns) {
			if(isbn.length == 10) {
				triples.push([CONTAINER, n.bibo+"isbn10", isbn, true]);
			} else {
				triples.push([CONTAINER, n.bibo+"isbn13", isbn, true]);
			}
		}
		return triples;
	}, function(nodes) {
		var isbns = [];
		for each(var prop in [n.bibo+"isbn13", n.bibo+"isbn10"]) {
			var statements = Zotero.RDF.getStatementsMatching(nodes[CONTAINER], prop, null);
			if(statements) {
				for each(var statement in statements) {
					isbns.push(statement[2]);
				}
			}
		}
		if(!isbns.length) return false;
		return isbns.join(", ");
	}],
	"publicationTitle":		[CONTAINER,		n.dcterms+"title"],
	"ISSN":					[CONTAINER,		n.bibo+"issn"],
	"date":					[SUBCONTAINER,	n.dcterms+"date"],
	"openingDate":			[ITEM,	n.mlz+"openingDate"],
	"adoptionDate":			[ITEM,	n.mlz+"adoptonDate"],
	"signingDate":			[ITEM,	n.mlz+"signingDate"],
	"signingDate":			[ITEM,	n.mlz+"signingDate"],
	"publicationDate":		[ITEM,	n.mlz+"publicationDate"],
	"originalDate":			[ITEM,	n.mlz+"originalDate"],
	"priorityDate":			[ITEM,	n.mlz+"priorityDate"],
	"newsCaseDate":			[ITEM,	n.mlz+"newsCaseDate"],
	"jurisdiction":			[ITEM,	n.mlz+"jurisdiction"],
	"reign":				[ITEM,	n.mlz+"reign"],
	"regnalYear":			[ITEM,	n.mlz+"regnalYear"],
	"opus":					[ITEM,	n.mlz+"opus"],
	"supplementName":		[ITEM,	n.mlz+"supplementName"],
	"meetingNumber":		[ITEM,		n.mlz+"meetingNumber"],
	"resolutionLabel":		[ITEM,		n.mlz+"resolutionLabel"],
	"assemblyNumber":		[ITEM,		n.mlz+"assemblyNumber"],
	"section":				[ITEM,			n.bibo+"section"],
	"callNumber":			[SUBCONTAINER,	n.bibo+"lccn"],
	"archiveLocation":		[ITEM,			n.dcterms+"source"],
	"distributor":			[SUBCONTAINER,	n.bibo+"distributor"],
	"extra":				[ITEM,			n.z+"extra"],
	"journalAbbreviation":	[CONTAINER,		n.bibo+"shortTitle"],
	"DOI":					[ITEM,			n.bibo+"doi"],
	"accessDate":			[USERITEM,		n.z+"accessDate"],
	"seriesTitle":			[CONTAINER_SERIES,	n.dcterms+"title"],
	"seriesText":			[CONTAINER_SERIES,	n.dcterms+"description"],
	"seriesNumber":			[CONTAINER_SERIES,		n.bibo+"number"],
	"code":					[CONTAINER,		n.dcterms+"title"],
	"session":				[ITEM,			[n.bibo+"presentedAt", [[n.rdf+"type", n.bibo+"Conference"]], n.dcterms+"title"]],
	"legislativeBody":		[ITEM,			[n.bibo+"organizer", [[n.rdf+"type", n.sc+"LegalGovernmentOrganization"], [n.rdf+"type", n.foaf+"Organization"]], n.foaf+"name"]],
	"history":				[ITEM,			n.z+"history"],
	"reporter":				[CONTAINER,		n.dcterms+"title"],
	"court":				[CONTAINER,		n.bibo+"court"],
	"numberOfVolumes":		[CONTAINER_SERIES,		n.bibo+"numberOfVolumes"],
	"committee":			[ITEM,			[n.bibo+"organizer", [[n.rdf+"type", n.sc+"Committee_Organization"], [n.rdf+"type", n.foaf+"Organization"]], n.foaf+"name"]],
	"assignee":				[ITEM, 			n.z+"assignee"],			// TODO
	"priorityNumbers": 		[function(item) {							// TODO
		var priorityNumbers = item.priorityNumbers.split(/, ?| /g);
		var returnNumbers = [];
		for each(var number in priorityNumbers) {
			returnNumbers.push([ITEM, n.z+"priorityNumber", number, true]);
		}
		return returnNumbers;
	}, function(nodes) {
		var statements = Zotero.RDF.getStatementsMatching(nodes[ITEM], n.z+"priorityNumber", null);
		if(!statements) return false;
		var predicates = [];
		for each(var statement in statements) {
			predicates.push(statement[2]);
		}
		return predicates.join(", ");
	}],
	"references":			[ITEM,			n.z+"references"],
	"legalStatus":			[ITEM,			n.bibo+"status"],
	"codeNumber":			[CONTAINER,		n.bibo+"number"],
	"number":				[ITEM,			n.bibo+"number"],
	"artworkSize":			[ITEM,			n.dcterms+"extent"],
	"libraryCatalog":		[USERITEM,		n.z+"repository"],
	"archive":				[ITEM,			n.z+"repository"],
	"scale":				[ITEM,			n.z+"scale"],
	"meetingName":			[ITEM,			[n.bibo+"presentedAt", [[n.rdf+"type", n.bibo+"Conference"]], n.dcterms+"title"]],
	"runningTime":			[ITEM,			n.po+"duration"],
	"version":				[ITEM,			n.doap+"revision"],
	"system":				[ITEM, 			n.doap+"os"],
	"conferenceName":		[ITEM,			[n.bibo+"presentedAt", [[n.rdf+"type", n.bibo+"Conference"]], n.dcterms+"title"]],
	"language":				[ITEM,			n.dcterms+"language"],
	"programmingLanguage":	[ITEM,			n.doap+"programming-language"],
	"abstractNote":			[ITEM,			n.dcterms+"abstract"],
	"type":					[ITEM,			n.dcterms+"type"],
	"medium":				[ITEM,			n.dcterms+"medium"],
	"mimeType":				[ITEM,			n.link+"type"],
	"charset":				[ITEM,			n.link+"charset"],
	"path":					[ITEM,			n.rdf+"resource"],
	"title":				[ITEM,			n.dcterms+"title"],
	"shortTitle":			[ITEM,			n.bibo+"shortTitle"],
	"numPages":				[ITEM,			n.bibo+"numPages"],
	"applicationNumber":	[ITEM,			n.z+"applicationNumber"],
	"issuingAuthority":		[ITEM,			[n.bibo+"issuer", [[n.rdf+"type", n.foaf+"Organization"]], n.foaf+"name"]],
	"filingDate":			[ITEM,			n.dcterms+"dateSubmitted"]
};

// Zotero.RDF.addStatement(nodes[USERITEM], n.link+"link", "#item_"+attachment.itemID, false);

var AUTHOR_LIST = 1;
var EDITOR_LIST = 2;
var CONTRIBUTOR_LIST = 3;
var CREATOR_LISTS = {
	1:n.bibo+"authorList",
	2:n.bibo+"editorList",
	3:n.bibo+"contributorList"
};

var CREATORS = {
	"author":			[ITEM,			AUTHOR_LIST,		n.dcterms+"creator"],
	"attorneyAgent":	[ITEM,			CONTRIBUTOR_LIST,	n.z+"attorneyAgent"],
	"bookAuthor":		[CONTAINER,		AUTHOR_LIST,		n.dcterms+"creator"],
	"castMember":		[ITEM,			CONTRIBUTOR_LIST,	n.rel+"ACT"],
	"commenter":		[ITEM,			CONTRIBUTOR_LIST,	[n.sioct+"has_reply", [[n.rdf+"type", n.sioct+"Comment"]], n.dcterms+"creator"]],
	"composer":			[ITEM,			CONTRIBUTOR_LIST,	n.rel+"CMP"],
	"contributor":		[ITEM,			CONTRIBUTOR_LIST,	n.dcterms+"contributor"],
	"cosponsor":		[ITEM,			CONTRIBUTOR_LIST,	n.rel+"SPN"],
	"counsel":			[ITEM,			CONTRIBUTOR_LIST,	n.z+"counsel"],
	"director":			[ITEM,			CONTRIBUTOR_LIST,	n.bibo+"director"],
	"editor":			[SUBCONTAINER,	EDITOR_LIST,		n.bibo+"editor"],
	"guest":			[ITEM,			CONTRIBUTOR_LIST,	n.po+"participant"],
	"interviewer":		[ITEM,			CONTRIBUTOR_LIST,	n.bibo+"interviewer"],
	"interviewee":		[ITEM,			CONTRIBUTOR_LIST,	n.bibo+"interviewee"],
	"performer":		[ITEM,			CONTRIBUTOR_LIST,	n.bibo+"performer"],
	"producer":			[ITEM,			CONTRIBUTOR_LIST,	n.bibo+"producer"],
	"recipient":		[ITEM,			CONTRIBUTOR_LIST,	n.bibo+"recipient"],
	"reviewedAuthor":	[ITEM,			CONTRIBUTOR_LIST,	[n.bibo+"reviewOf", [], n.dcterms+"creator"]],
	"scriptwriter":		[ITEM,			CONTRIBUTOR_LIST,	n.rel+"AUS"],
	"seriesEditor":		[CONTAINER_SERIES,		EDITOR_LIST,		n.bibo+"editor"],
	"translator":		[SUBCONTAINER,	CONTRIBUTOR_LIST,	n.bibo+"translator"],
	"wordsBy":			[ITEM,			CONTRIBUTOR_LIST,	n.rel+"LYR"]
};

var SAME_ITEM_RELATIONS = [n.dcterms+"isPartOf", n.dcterms+"isVersionOf", n.bibo+"affirmedBy",
						   n.bibo+"presentedAt", n.bibo+"presents", n.bibo+"reproducedIn",
						   n.bibo+"reviewOf", n.bibo+"translationOf", n.bibo+"transcriptOf"];

var ATTACHMENT_FIELDS = ["title", "mimeType", "url", "charset", "path"];

/** COMMON FUNCTIONS **/

var BIBO_NS_LENGTH = n.bibo.length;
var RDF_TYPE = n.rdf+"type";

function getBlankNode(attachToNode, itemPredicate, blankNodePairs, create) {
	// check if a node with the same relation and properties already exists
	var blankNode = null;
	// look for blank node
	var statements1 = Zotero.RDF.getStatementsMatching(attachToNode, itemPredicate, undefined);
	for each(var statement1 in statements1) {
		// look for appropriate statements on the blank node
		var testNode = statement1[2];
		var statements2 = true;
		for each(var pair in blankNodePairs) {
			statements2 = Zotero.RDF.getStatementsMatching(testNode, pair[0], pair[1], false, true);
			if(!statements2) break;
		}
		if(statements2) {
			// if statements are good, then this is our node
			blankNode = testNode;
			break;
		}
	}
	
	// if no suitable node exists, generate a new one and add blank node statements
	if(!blankNode && create) {
		blankNode = Zotero.RDF.newResource();
		Zotero.RDF.addStatement(attachToNode, itemPredicate, blankNode, false);
		for each(var pair in blankNodePairs) {
			Zotero.RDF.addStatement(blankNode, pair[0], pair[1], false);
		}
	}
	
	return blankNode;
}

/**
 * A class representing a Zotero-to-BIBO type mapping
 * @property zoteroType {String} The corresponding Zotero type name
 */
Type = function(type, typeDefinition) {
	this.zoteroType = type;
	this[ITEM] = {"pairs":typeDefinition[0]};
	this[SUBCONTAINER] = typeDefinition[1] ? {"alwaysAdd":typeDefinition[1][0],
		"predicate":typeDefinition[1][1],
		"pairs":typeDefinition[1][2]} : null;
	this[CONTAINER] = typeDefinition[2] ? {"alwaysAdd":typeDefinition[2][0],
		"predicate":typeDefinition[2][1],
		"pairs":typeDefinition[2][2]} : null;
}

/**
 * Score a node to determine how well it matches our type definition
 * @returns {[Integer, Object]} The score, and an object containing ITEM, SUBCONTAINER, and 
 *                              CONTAINER nodes
 */
Type.prototype.getMatchScore = function(node) {
	var nodes = {2:node};
	
	// check item (+2 for each match, -1 for each nonmatch)
	var score = -this[ITEM].pairs.length;
	for each(var pair in this[ITEM].pairs) {
		if(Zotero.RDF.getStatementsMatching(node, pair[0], pair[1])) score += 3;
	}
	
	// check subcontainer
	var sub = this._scoreNodeRelationship(node, this[SUBCONTAINER], score);
	score = sub[0];
	nodes[SUBCONTAINER] = sub[1];
	// check container
	sub = this._scoreNodeRelationship(
		(nodes[SUBCONTAINER] ? nodes[SUBCONTAINER] : nodes[ITEM]),
		this[CONTAINER], score
	);
	score = sub[0];
	nodes[CONTAINER] = sub[1];
	
	if(!nodes[CONTAINER]) nodes[CONTAINER] = nodes[ITEM];
	if(!nodes[SUBCONTAINER]) nodes[SUBCONTAINER] = nodes[CONTAINER];
	
	return [score, nodes];
}

/**
 * Score a CONTAINER/SUBCONTAINTER node
 * @returns {[Integer, Object]} The score, and the node (if it existed)
 */
Type.prototype._scoreNodeRelationship = function(node, definition, score) {
	var subNode = null;
	if(definition) {
		statements = Zotero.RDF.getStatementsMatching(node, definition.predicate, null);
		if(statements) {
			var bestScore = -9999;
			for each(var statement in statements) {
				// +2 for each match, -1 for each nonmatch
				var testScore = -definition.pairs.length;
				for each(var pair in definition.pairs) {
					if(Zotero.RDF.getStatementsMatching(statement[2], pair[0], pair[1])) testScore += 3;
				}
				
				if(testScore > bestScore) {
					subNode = statement[2];
					bestScore = testScore;
				}
			}
			score += bestScore;
		} else if(definition.alwaysAdd) {
			score -= definition.pairs.length;
		}
	}
	return [score, subNode];
}

/**
 * Get USERITEM and SERIES nodes for this type
 */
Type.prototype.getItemSeriesNodes = function(nodes) {
	const seriesDefinition = {"alwaysAdd":true, "predicate":n.dcterms+"isPartOf", "pairs":[[n.rdf+"type", n.bibo+"Series"]]};
	
	// get user item node
	var stmt = Zotero.RDF.getStatementsMatching(null, n.res+"resource", nodes[ITEM]);
	nodes[USERITEM] = stmt ? stmt[0][0] : nodes[ITEM];
	
	// get ITEM_SERIES node
	var tmp = this._scoreNodeRelationship(nodes[ITEM], seriesDefinition, 0);
	var score = tmp[0];
	var subNode = tmp[1];
	
	//Zotero.debug("got itemSeries with score "+score);
	if(score >= 1) nodes[ITEM_SERIES] = subNode;
	
	// get SUBCONTAINER_SERIES node
	tmp = this._scoreNodeRelationship(nodes[SUBCONTAINER], seriesDefinition, 0);
	score = tmp[0];
	subNode = tmp[1];
	
	//Zotero.debug("got subcontainerSeries with score "+score);
	if(score >= 1) nodes[CONTAINER_SERIES] = subNode;
	
	// get CONTAINER_SERIES node
	tmp = this._scoreNodeRelationship(nodes[CONTAINER], seriesDefinition, 0);
	score = tmp[0];
	subNode = tmp[1];
	
	//Zotero.debug("got containerSeries with score "+score);
	if(score >= 1) nodes[CONTAINER_SERIES] = subNode;
}

/**
 * Add triples to relate nodes. Called after all properties have been added, so we know which nodes
 * need to be related.
 */
Type.prototype.addNodeRelations = function(nodes) {
	// add node relations
	for each(var i in [ITEM_SERIES, SUBCONTAINER_SERIES, CONTAINER_SERIES]) {
		// don't add duplicate nodes
		if(!this[i-3]) continue;
		// don't add nodes with no arcs
		if(!Zotero.RDF.getArcsOut(nodes[i])) continue;
		Zotero.RDF.addStatement(nodes[i], RDF_TYPE, n.bibo+"Series", false);
		Zotero.RDF.addStatement(nodes[i-3], n.dcterms+"isPartOf", nodes[i], false);
	}
	
	for each(var i in [ITEM, SUBCONTAINER, CONTAINER]) {
		if(nodes[i]) {
			// find predicate
			if(i == ITEM) {
				var j = 1;
				var predicate = n.res+"resource";
			} else if(i == SUBCONTAINER || i == CONTAINER) {
				// don't add duplicate nodes
				if(!this[i]) continue;
				// don't add nodes with no arcs
				if(!this[i][0] && !Zotero.RDF.getArcsOut(nodes[i])) {
					nodes[i] = nodes[i-1];
					continue;
				}
				
				var predicate = this[i].predicate;
			}
			
			// add type
			for each(var pair in this[i].pairs) {
				Zotero.RDF.addStatement(nodes[i], pair[0], pair[1], false)
			}
			
			// add relation to parent
			for(var j = i-1; j>1; j--) {
				if(Zotero.RDF.getResourceURI(nodes[j]) != Zotero.RDF.getResourceURI(nodes[i])) {
					Zotero.RDF.addStatement(nodes[j], predicate, nodes[i], false);
					break;
				}
			}
		}
	}
}

/**
 * Create USERITEM/ITEM/CONTAINER/SUBCONTAINER nodes for this type
 * @returns {Object} The created nodes
 */
Type.prototype.createNodes = function(item) {
	var nodes = {};
	nodes[USERITEM] = (item.uri ? item.uri : "#item_"+item.itemID);
	
	// come up with an item node URI
	nodes[ITEM] = null;
	// try the URL as URI
	if(item.url) {
		nodes[ITEM] = encodeURI(item.url);
		if(usedURIs[nodes[ITEM]]) nodes[ITEM] = null;
	}
	// try the DOI as URI
	if(!nodes[ITEM] && item.DOI) {
		var doi = item.DOI;
		if(doi.substr(0, 4) == "doi:") {
			doi = doi.substr(4);
		} else if(doi.substr(0, 8) == "urn:doi:") {
			doi = doi.substr(8);
		} else if(doi.substr(0, 9) == "info:doi/") {
			doi = doi.substr(9);
		} else if(doi.substr(0, 18) == "http://dx.doi.org/") {
			doi = doi.substr(18);
		}
		nodes[ITEM] = "info:doi/"+encodeURI(doi);
		if(usedURIs[nodes[ITEM]]) nodes[ITEM] = null;
	}
	// try the ISBN as URI
	if(!nodes[ITEM] && item.ISBN) {
		var isbn = item.ISBN.split(/, ?| /g)[0];
		nodes[ITEM] = "urn:isbn:"+encodeURI(isbn);
		if(usedURIs[nodes[ITEM]]) nodes[ITEM] = null;
	}
	// no suitable item URI; fall back to a blank node
	if(!nodes[ITEM]) nodes[ITEM] = Zotero.RDF.newResource();
	usedURIs[Zotero.RDF.getResourceURI(nodes[ITEM])] = true;
	
	// attach item node to user item node
	Zotero.RDF.addStatement(nodes[USERITEM], RDF_TYPE, n.z+"UserItem", false);
	Zotero.RDF.addStatement(nodes[USERITEM], n.res+"resource", nodes[ITEM], false);
	
	// container node
	nodes[CONTAINER] = (this[CONTAINER] ? Zotero.RDF.newResource() : nodes[ITEM]);
	
	// subcontainer node
	nodes[SUBCONTAINER] = (this[SUBCONTAINER] ? Zotero.RDF.newResource() : nodes[CONTAINER]);
	
	// series nodes
	nodes[ITEM_SERIES] = Zotero.RDF.newResource();
	nodes[CONTAINER_SERIES] = (this[CONTAINER] ? Zotero.RDF.newResource() : nodes[ITEM_SERIES]);
	nodes[SUBCONTAINER_SERIES] = (this[SUBCONTAINER] ? Zotero.RDF.newResource() : nodes[CONTAINER_SERIES]);
	
	return nodes;
}

/**
 * A class representing a BIBO-to-Zotero literal property mapping
 */
LiteralProperty = function(field) {
	this.field = field;
	this.mapping = FIELDS[field];
	if(!this.mapping) {
		//Zotero.debug("WARNING: unrecognized field "+field+" in Bibliontology RDF; mapping to Zotero namespace");
		this.mapping = [ITEM, n.z+field];
	}
}

/**
 * Maps property from a set of RDF nodes to an item
 */
LiteralProperty.prototype.mapToItem = function(newItem, nodes) {
	if(typeof this.mapping[0] == "function") {		// function case: triples returned
		// check function case
		var content = this.mapping[1](nodes);
		if(!content) return false;
		newItem[this.field] = content;
	} else {
		var node = nodes[this.mapping[0]];
		if(!node) return false;
		var statements = getStatementsByDefinition(this.mapping[1], node);
		if(!statements) return false;
		
		var main = [];
		var keylist = [];
		var variants = {};
		for each(var stmt in statements) {
			if (stmt[3]) {
				if (!variants[stmt[3]]) {
					keylist.push(stmt[3]);
					variants[stmt[3]] = [];
				}
 				variants[stmt[3]].push(stmt[2].toString());
			} else {
				main.push(stmt[2].toString());
			}
		}
		main = main.join(",");
		for (var lang in variants) {
			variants[lang] = variants[lang].join(",");
		}
		newItem[this.field] = main;
		newItem.multi._lsts[this.field] = keylist;
		newItem.multi._keys[this.field] = variants;
	}
	return true;
}

/**
 * Sets multilingual elements on an ordinary field
 */
LiteralProperty.prototype.setMulti = function(node, mapping, item) {
	if (item.multi) {
		if (item.multi.main[this.field]) {
			Zotero.RDF.addStatement(node,
			  mapping, item.uniqueFields[this.field], true, item.multi.main[this.field]);
		}
		if (item.multi._lsts && item.multi._lsts[this.field]) {
			for (var i=0, ilen=item.multi._lsts[this.field].length; i<ilen; i += 1) {
				var lang = item.multi._lsts[this.field][i];
				Zotero.RDF.addStatement(node,
					  mapping, item.multi._keys[this.field][lang], true, lang);
			}
		}
	}
}

/**
 * Maps property from an item to a set of RDF nodes
 */
LiteralProperty.prototype.mapFromItem = function(item, nodes) {
	if(typeof this.mapping[0] == "function") {				// function case: triples returned
		// check function case
		for each(var triple in this.mapping[0](item)) {
			Zotero.RDF.addStatement(nodes[triple[0]], triple[1], triple[2], triple[3])
		}
	} else if(typeof this.mapping[1] == "string") {		// string case: simple predicate
		Zotero.RDF.addStatement(nodes[this.mapping[0]],
								this.mapping[1], item.uniqueFields[this.field], true);
		this.setMulti(nodes[this.mapping[0]], this.mapping[1], item);
	} else {										// array case: complex predicate
		var blankNode = getBlankNode(nodes[this.mapping[0]],
			this.mapping[1][0], this.mapping[1][1], true);
		Zotero.RDF.addStatement(blankNode, this.mapping[1][2], item.uniqueFields[this.field], true);
		this.setMulti(blankNode, this.mapping[1][2], item);
	}
}

/**
 * A class representing a BIBO-to-Zotero creator mapping
 */
CreatorProperty = function(field) {
	this.field = field;
	this.mapping = CREATORS[field];
}

/**
 * Maps creator from an foaf:Agent
 */
CreatorProperty.prototype.mapToCreator = function(creatorNode, zoteroType) {
	//Zotero.debug("mapping "+Zotero.RDF.getResourceURI(creatorNode)+" to a creator");
	var creator = {};
	creator.multi = {};
	creator.multi._lst = [];
	creator.multi._key = {};
	var variants = {};
	var keylist = [];
	var nameMap = {
		surname:"lastName",
		givenname:"firstName",
		name:"lastName"
	}
	for each(var part in ["surname", "givenname", "name"]) {
		var nameStmts = Zotero.RDF.getStatementsMatching(creatorNode, n.foaf+part, null);
		for each(var stmt in nameStmts) {
			if (stmt[3]) {
				if (!variants[stmt[3]]) {
					keylist.push(stmt[3]);
					variants[stmt[3]] = {};
				}
 				variants[stmt[3]][nameMap[part]] = stmt[2].toString();
			} else {
				creator[nameMap[part]] = stmt[2].toString();
			}
		}
	}
	creator.multi._lst = keylist;
	creator.multi._key = variants;

	// birthYear and shortName
	var birthStmt = Zotero.RDF.getStatementsMatching(creatorNode, n.foaf+"birthday", null, true);
	if(birthStmt) creator.birthYear = birthStmt[2].toString();
	var nickStmt = Zotero.RDF.getStatementsMatching(creatorNode, n.foaf+"nick", null, true);
	if(nickStmt) creator.shortName = nickStmt[2].toString();
	
	if(this.field == "author") {
		// could be another primary creator
		var creatorsForType = Zotero.Utilities.getCreatorsForType(zoteroType);
		if(creatorsForType.indexOf("author") == -1) {
			creator.creatorType = creatorsForType[0];
		}
	} else {
		creator.creatorType = this.field;
	}
	// XXX still needs cleanup, after default language is known.
	return creator;
}

/**
 * Maps creators from a top-level (ITEM/SUBCONTAINER/CONTAINER/SERIES) node to a list
 */
CreatorProperty.prototype.mapToCreators = function(node, zoteroType) {
	var creators = [];
	var creatorNodes = [];
	var statements = getStatementsByDefinition(this.mapping[2], node);
	if(statements) {
		for each(var stmt in statements) {
			var creator = this.mapToCreator(stmt[2], zoteroType);
			if(creator) {
				creators.push(creator);
				creatorNodes.push(stmt[2]);
			}
		}
	}
	return [creators, creatorNodes];
}

/**
 * Maps property from a Zotero creator array to a set of RDF nodes
 */
CreatorProperty.prototype.mapFromCreator = function(item, creator, nodes) {
	var creatorsForType = Zotero.Utilities.getCreatorsForType(item.itemType);
	var isPrimary = creatorsForType[0] == this.field;
	if(this.mapping) {
		var mapping = this.mapping;
	} else {
		if(isPrimary && creatorsForType.indexOf("author") == -1) {
			// treat other primary creators as dcterms:creators
			var mapping = CREATORS["author"];
		} else {
			//Zotero.debug("WARNING: unrecognized creator type "+this.field+" in Bibliontology RDF; mapping to Zotero namespace");
			var mapping = [ITEM, AUTHOR_LIST, n.z+this.field];
		}
	}

	var setCreator = function (mode, node, creator, lang) {
		if(mode == 1) {
			if(creator.lastName) Zotero.RDF.addStatement(node, n.foaf+"name", creator.lastName, true, lang);
		} else {
			if(creator.firstName) Zotero.RDF.addStatement(node, n.foaf+"givenname", creator.firstName, true, lang);
			if(creator.lastName) Zotero.RDF.addStatement(node, n.foaf+"surname", creator.lastName, true, lang);
		}
	}
	
	var creatorNode = Zotero.RDF.newResource();
	setCreator(creator.fieldMode, creatorNode, creator);
	if (creator.fieldMode === 1) {
		Zotero.RDF.addStatement(creatorNode, RDF_TYPE, n.foaf+"Organization");
	} else {
		Zotero.RDF.addStatement(creatorNode, RDF_TYPE, n.foaf+"Person");
	}

	if (creator.multi) {
		if (creator.multi.main) {
			setCreator(creator.fieldMode, creatorNode, creator, creator.multi.main);
		}
		if (creator.multi._lst) {
			for (var i=0, ilen=creator.multi._lst.length; i<ilen; i += 1) {
				var lang = creator.multi._lst[i];
				setCreator(creator.fieldMode, creatorNode, creator.multi._key[lang], lang);
			}
		}
	}
	if(creator.birthYear) Zotero.RDF.addStatement(creatorNode, n.foaf+"birthday", creator.birthYear, true);
	if(creator.shortName) Zotero.RDF.addStatement(creatorNode, n.foaf+"nick", creator.shortName, true);
	
	// attach creator node
	var attachTo = nodes[mapping[0]];
	if(typeof mapping[2] == "string") {
		var relation = mapping[2];
	} else {
		var relation = mapping[2][2];
		var attachTo = getBlankNode(attachTo, mapping[2][0], mapping[2][1], true);
	}
	Zotero.RDF.addStatement(attachTo, relation, creatorNode, false);
	
	// get appropriate creator list
	var list = mapping[1];
	if(list == CONTRIBUTOR_LIST && isPrimary) {
		// always attach primary to author list instead of contributor list
		list = AUTHOR_LIST;
	}
	
	// add to creator list
	var creatorList = Zotero.RDF.getStatementsMatching(nodes[mapping[0]], CREATOR_LISTS[list], null);
	if(creatorList) {
		var creatorList = creatorList[0][2];
	} else {
		var creatorList = Zotero.RDF.newResource();
		Zotero.RDF.newContainer("seq", creatorList);
		Zotero.RDF.addStatement(nodes[mapping[0]], CREATOR_LISTS[list], creatorList, false);
	}
	Zotero.RDF.addContainerElement(creatorList, creatorNode, false);
}

/** IMPORT FUNCTIONS **/

/**
 * Gets statements matching a statement definition, if it exists
 */
function getStatementsByDefinition(definition, node) {
	var statements = null;
	if(typeof definition == "string") {		// string case: simple predicate
		statements = Zotero.RDF.getStatementsMatching(node, definition, null);
	} else {								// array case: complex 
		var blankNode = getBlankNode(node, definition[0], definition[1], false);
		if(blankNode) {
			statements = Zotero.RDF.getStatementsMatching(blankNode, definition[2], null);
		}
	}
	return statements;
}

function detectImport() {
	// look for a bibo item type
	var rdfTypes = Zotero.RDF.getStatementsMatching(null, RDF_TYPE, null);
	if(rdfTypes) {
		for each(var rdfType in rdfTypes) {
			if(typeof rdfType[2] === "object" && Z.RDF.getResourceURI(rdfType[2]).substr(0, BIBO_NS_LENGTH) == n.bibo) return true;
		}
	}
	return false;
}

function doImport() {
	// collapse list of BIBO-only types
	var collapsedTypes = {};
	for(var unprefixedBiboType in BIBO_TYPES) {
		var biboType = n.bibo+unprefixedBiboType;
		var type = new Type(BIBO_TYPES[unprefixedBiboType], [[[RDF_TYPE, n.bibo+biboType]], null, null]);
		if(!collapsedTypes[biboType]) {
			collapsedTypes[biboType] = [type];
		} else {
			collapsedTypes[biboType].push(type);
		}
	}
	
	// collapse Zotero-to-BIBO type mappings
	for(var zoteroType in TYPES) {
        if (zoteroType === "attachment") {
            continue;
        }
		var type = new Type(zoteroType, TYPES[zoteroType]);
		for each(var pair in TYPES[zoteroType][0]) {
			if(!collapsedTypes[pair[1]]) {
				collapsedTypes[pair[1]] = [type];
			} else {
				collapsedTypes[pair[1]].push(type);
			}
		}
	}
	
	// collapse list of field mappings
	var collapsedProperties = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}};
	var functionProperties = {};
	for(var zoteroField in FIELDS) {
		if(typeof FIELDS[zoteroField][0] == "function") {
			functionProperties[zoteroField] = new LiteralProperty(zoteroField);
		} else {
			var domain = FIELDS[zoteroField][0];
			var predicate = FIELDS[zoteroField][1];
			if(typeof predicate == "object") predicate = predicate[0];
			var prop = new LiteralProperty(zoteroField);
		
			if(collapsedProperties[domain][predicate]) {
				collapsedProperties[domain][predicate].push(prop);
			} else {
				collapsedProperties[domain][predicate] = [prop];
			}
		}
	}
	
	// collapse list of creators
	for(var creatorType in CREATORS) {
		var domain = CREATORS[creatorType][0];
		var predicate = CREATORS[creatorType][2];
		if(typeof predicate == "object") predicate = predicate[0];
		var prop = new CreatorProperty(creatorType);
		
		if(collapsedProperties[domain][predicate]) {
			collapsedProperties[domain][predicate].unshift(prop);
		} else {
			collapsedProperties[domain][predicate] = [prop];
		}
	}
	
	// Go through all type arcs to find items
	var itemNode, predicateNode, objectNode;
	var rdfTypes = Zotero.RDF.getStatementsMatching(null, RDF_TYPE, null);
	var itemNodes = {}, tmp;
	for each(var rdfType in rdfTypes) {
		tmp = rdfType;
		itemNode = tmp[0];
		predicateNode = tmp[1];
		objectNode = tmp[2];
		if(typeof objectNode !== "object") continue;
		var uri = Zotero.RDF.getResourceURI(itemNode);
		if(!uri) continue;
		itemNodes[uri] = itemNode;
	}
	
	// Look through found items to see if their rdf:type matches a Zotero item type URI, and if so,
	// subject to further processing
	for each(var itemNode in itemNodes) {
		// check whether the relationship to another item precludes us from extracting this as
		// top-level
		var skip = false;
		for each(var arc in Zotero.RDF.getArcsIn(itemNode)) {
			if(SAME_ITEM_RELATIONS.indexOf(arc) !== -1) {
				skip = true;
				break;
			}
		}
		if(skip) continue;
		
		var itemRDFTypes = Zotero.RDF.getStatementsMatching(itemNode, RDF_TYPE, null);

		// score types by the number of triples they share with our types
		var bestTypeScore = -9999;
		var bestType, score, nodes, bestNodes;
		for each(var rdfType in itemRDFTypes) {
			if(typeof rdfType[2] !== "object") continue;
			
			var collapsedTypesForItem = collapsedTypes[Z.RDF.getResourceURI(rdfType[2])];
			if(!collapsedTypesForItem) continue;
			
			for each(var type in collapsedTypesForItem) {
				tmp = type.getMatchScore(itemNode);
				score = tmp[0];
				nodes = tmp[1];
				//Zotero.debug("Type "+type.zoteroType+" has score "+score);
				
				// check if this is the best we can do

				// Aha, maybe. The highest-scoring node set between parent and child trumps.
				// So the child (Journal) goes through, and the parent (Issue) is dropped.
				// Better if we catenate?

				if(score > bestTypeScore) {
					bestTypeScore = score;
					bestType = type;
					bestNodes = nodes;
				}
			}
		}

		Zotero.debug("bestTypeScore: "+bestTypeScore);
		
		// skip if this doesn't fit any type very well
		if(bestTypeScore < 1) {
			continue;
		}
		
		if (bestType) {
			Zotero.debug("Got item of type "+bestType.zoteroType+" with score "+bestTypeScore);
		}

		nodes = bestNodes;
		bestType.getItemSeriesNodes(nodes);
		
		// create item
		var zoteroType = bestType.zoteroType;
		var newItem = new Zotero.Item(zoteroType);
		newItem.multi = {};
		newItem.multi.main = {};
		newItem.multi._lsts = {};
		newItem.multi._keys = {};
		
		// handle ordinary properties
		var allCreators = {}
		for(var i in nodes) {
			var propertiesHandled = {};
			var properties = Zotero.RDF.getArcsOut(nodes[i]);
			for each(var property in properties) {
				// XXXXX Not getting volume etc. in properties for journalArticle type
				// only handle each property once
				if(propertiesHandled[property]) continue;
				propertiesHandled[property] = true;
				//Zotero.debug("handling "+property);
				
				var propertyMappings = collapsedProperties[i][property];
				if(propertyMappings) {
					for each(var propertyMapping in propertyMappings) {
						if(propertyMapping.mapToItem) {				// LiteralProperty
							propertyMapping.mapToItem(newItem, nodes);
						} else if(propertyMapping.mapToCreator) {	// CreatorProperty
							var creators, creatorNodes;
							tmp = propertyMapping.mapToCreators(nodes[i], zoteroType);
							creators = tmp[0];
							creatorNodes = tmp[1];
							if(creators.length) {
								for(var j in creators) {
									var creatorNodeURI = Zotero.RDF.getResourceURI(creatorNodes[j]);
									if(!allCreators[creatorNodeURI]) {
										allCreators[creatorNodeURI] = creators[j];
									}
								}
							}
						}
					}
				}
			}
		}
		
		// handle function properties
		for each(var functionProperty in functionProperties) {
			functionProperty.mapToItem(newItem, nodes);
		}
		
		// handle creators and tags
		var creatorLists = {};
		var creatorsAdded = {};
		for(var i in nodes) {
			// take DC subjects as tags
			var statements = Zotero.RDF.getStatementsMatching(nodes[i], n.dcterms+"subject", null);
			for each(var stmt in statements) {
				// if attached to the user item, it's a user tag; otherwise, an automatic tag
				newItem.tags.push({tag:stmt[2], type:(i == USERITEM ? 0 : 1)});
			}
			
			// also take ctags as tags
			var statements = Zotero.RDF.getStatementsMatching(nodes[i], n.ctag+"tagged", null);
			for each(var stmt in statements) {
				var tag = {type:0};
				
				// AutoTags are automatic tags
				var types = Zotero.RDF.getStatementsMatching(stmt[2], n.rdf+"type", null);
				for each(var type in types) {
					var uri = Zotero.RDF.getResourceURI(type[2]);
					if([n.ctag+"AutoTag", n.ctag+"AuthorTag"].indexOf(uri) != -1) tag.type = 1;
					break;
				}
				
				// labels are tag content
				var labels = Zotero.RDF.getStatementsMatching(stmt[2], n.ctag+"label", null);
				if(labels.length) {
					tag.tag = labels[0][2];
					newItem.tags.push(tag);
				}
			}
			
			for(var j in CREATOR_LISTS) {
				var statements = Zotero.RDF.getStatementsMatching(nodes[i], CREATOR_LISTS[j], null);
				for each(var stmt in statements) {
					var creatorListURI = Zotero.RDF.getResourceURI(stmt[2]);
					if(creatorLists[creatorListURI]) continue;
					creatorLists[creatorListURI] = true;
					var creatorNodes = Zotero.RDF.getContainerElements(stmt[2]);
					for each(var creatorNode in creatorNodes) {
						var creatorNodeURI = Zotero.RDF.getResourceURI(creatorNode);
						if(!creatorsAdded[creatorNodeURI]) {
							creatorsAdded[creatorNodeURI] = true;
							if(allCreators[creatorNodeURI]) {
								// just add to creators list
								newItem.creators.push(allCreators[creatorNodeURI]);
							} else {
								// creator not already processed, use default for this list type
								if(j == AUTHOR_LIST) {
									//Zotero.debug("WARNING: creator in authorList lacks relationship to item in Bibliontology RDF; treating as primary creator");
									var prop = new CreatorProperty("author");
								} else if(j == EDITOR_LIST) {
									//Zotero.debug("WARNING: creator in editorList lacks relationship to item in Bibliontology RDF; treating as editor");
									var prop = new CreatorProperty("editor");
								} else {
									//Zotero.debug("WARNING: creator in contributorList lacks relationship to item in Bibliontology RDF; treating as contributor");
									var prop = new CreatorProperty("contributor");
								}							
								var creator = prop.mapToCreator(creatorNode, zoteroType);
								if(creator) newItem.creators.push(creator);
							}
						}
					}
				}
			}
		}
		
		for(var creatorNodeURI in allCreators) {
			if(!creatorsAdded[creatorNodeURI]) {
				newItem.creators.push(allCreators[creatorNodeURI]);
			}
		}
		
		// Fix multilingual fields if necessary
		for (var field in newItem.multi._keys) {
			if (newItem[field]) {
				for (var i=0, ilen=newItem.multi._lsts[field].length; i<ilen; i += 1) {
					var lang = newItem.multi._lsts[field][i];
					if (newItem[field] === newItem.multi._keys[field][lang]) {
						// If there is a field value, look for a match, then give up
						newItem.multi.main[field] = lang;
						newItem.multi._lsts[field] = newItem.multi._lsts[field].slice(0, i).concat(newItem.multi._lsts[field].slice(i + 1));
						delete newItem.multi._keys[field][lang];
						break;
					}
				}
			} else {
				var itemLanguage;
				if (newItem.language) {
					// If there is none, but there is an item language, look for a match there
					var itemLanguage = newItem.language.split(/[; ]+/)[0];
					var itemLanguageLst = itemLanguage.split("-");
					for (var i=0, ilen=newItem.multi._lsts[field].length; i<ilen; i += 1) {
						var lang = newItem.multi._lsts[field][i];
						var langLst = lang.split("-");
						if (itemLanguageLst.slice(0, langLst.length).join("-") === lang) {
							newItem[field] = newItem.multi._keys[field][lang];
							newItem.multi.main[field] = lang;
							newItem.multi._lsts[field] = newItem.multi._lsts[field].slice(0, i).concat(newItem.multi._lsts[field].slice(i + 1));
							delete newItem.multi._keys[field][lang];
							break;
						}
					}
				}
				// If there is none and the above has failed, just take the first
				if (!newItem[field]) {
					var lang = newItem.multi._lsts[field][0];
					newItem[field] = newItem.multi._keys[field][lang];
					newItem.multi.main[field] = lang;
					newItem.multi._lsts[field] = newItem.multi._lsts[field].slice(1);
					delete newItem.multi._keys[field][lang];
				}
			}
		}

		// Fix multilingual creators if necessary
		for (var j=0,jlen=newItem.creators.length; j<jlen;j += 1) {
			var creator = newItem.creators[j];
			if (creator.lastName) {
				for (var i=0, ilen=creator.multi._lst.length; i<ilen; i += 1) {
					var lang = creator.multi._lst[i];
					if (creator.lastName === creator.multi._key[lang].lastName 
						&& ((!creator.firstName && !creator.multi._key[lang].firstName)
							|| creator.firstName === creator.firstName)) {

						creator.multi.main = lang;
						creator.multi._lst = creator.multi._lst.slice(0, i).concat(creator.multi._lst.slice(i + 1));
						delete creator.multi._key[lang];
						break;
					}
				}
			} else {
				var itemLanguage;
				if (creator.language) {
					var itemLanguage = newItem.language.split(/[; ]+/)[0];
					var itemLanguageLst = itemLanguage.split("-");
					for (var i=0, ilen=creator.multi._lst.length; i<ilen; i += 1) {
						var lang = creator.multi._lst[i];
						var langLst = lang.split("-");
						if (itemLanguageLst.slice(0, langLst.length).join("-") === lang) {
							for (var key in creator.multi._key[lang]) {
								creator[key] = creator.multi._key[lang][key];
							}
							creator.multi.main = lang;
							creator.multi._lst = creator.multi._lst.slice(0, i).concat(creator.multi._lst.slice(i + 1));
							delete creator.multi._key[lang];
							break;
						}
					}
				}
				if (!creator.lastName) {
					var lang = creator.multi._lst[0];
					for (var key in creator.multi._key[lang]) {
						creator[key] = creator.multi._key[lang][key];
					}
					creator = creator.multi._key[lang];
					creator.multi.main = lang;
					creator.multi._lst = creator.multi._lst.slice(1);
					delete creator.multi._key[lang];
				}
			}
			// Add attachments
			// The kindest thing than can be said about this is that it works.
			var linkStmts = Zotero.RDF.getStatementsMatching(nodes[ITEM], n.link+"link", null);
			for each(var linkStmt in linkStmts) {
				var linkURI = Zotero.RDF.getResourceURI(linkStmt[2]);
				var attachmentStmts = Zotero.RDF.getStatementsMatching(linkURI, n.rdf+"type", n.z+"Attachment");
				if (attachmentStmts) {
					var attachmentNode = attachmentStmts[0][0];
					var attachment = {};
					for each(var key in ATTACHMENT_FIELDS) {
						var field = FIELDS[key];
						var stmt = Zotero.RDF.getStatementsMatching(attachmentNode, field[1], null, true);
						if (stmt) {
							attachment[key] = stmt[0][2];
						}
					}
					newItem.attachments.push(attachment);
				}
			}
		}
		// Push to an array of items instead, so attachments can be added.
		newItem.complete();
	}
}

/** EXPORT FUNCTIONS **/

var usedURIs = {};

function doExport() {
	// add namespaces
	for(var i in n) Zotero.RDF.addNamespace(i, n[i]);
	
	// compile references and create URIs
	var item;
	var items = {};
	while(item = Zotero.nextItem()) {
		items[item.itemID] = item;
	}
	var autoTags = {};
	var userTags = {};
	var attachments = {};

	// now that we've collected our items, start building the RDF
	for each(var item in items) {
		// set type on item node
		var type = new Type(item.itemType, TYPES[item.itemType]);
		var nodes = type.createNodes(item);
		
		// add fields
		for(var field in item.uniqueFields) {
			if(!item.uniqueFields[field] && item.uniqueFields[field] !== 0) continue;
			
			var property = new LiteralProperty(field);
			property.mapFromItem(item, nodes);
		}
		//Zotero.debug("fields added");
		for each(var attachment in item.attachments) {
            Zotero.debug("PPP hello attachment!");
			var attachmentNode = "#item_"+attachment.itemID;
			Zotero.RDF.addStatement(attachmentNode, RDF_TYPE, n.z+"Attachment", false);
			// Only attached files export correctly at the moment.
			if (attachment.defaultPath) {
				Zotero.RDF.addStatement(attachmentNode, n.rdf+"resource", attachment.defaultPath, true);
                if (attachment.saveFile) {
			        attachment.saveFile(attachment.defaultPath, true);
                }
			}
			if (attachment.title) {
				Zotero.RDF.addStatement(attachmentNode, n.dcterms+"title", attachment.title, true);
			}
			if (attachment.mimeType) {
				Zotero.RDF.addStatement(attachmentNode, n.link+"type", attachment.mimeType, true);
			}
			Zotero.RDF.addStatement(nodes[ITEM], n.link+"link", attachmentNode);
		}
		
		// add creators
		var creatorLists = [];
		for each(var creator in item.creators) {
			// create creator
			var property = new CreatorProperty(creator.creatorType);
			property.mapFromCreator(item, creator, nodes);
		}
		//Zotero.debug("creators added");

		// add tags
		for each(var tag in item.tags) {
			var tagCollection = tag.type == 0 ? userTags : autoTags;
			
			if(tagCollection[tag.tag]) {
				var tagNode = tagCollection[tag.tag];
			} else {
				var tagNode = Zotero.RDF.newResource();
				Zotero.RDF.addStatement(tagNode, n.rdf+"type",
					(tag.type == 0 ? n.ctag+"UserTag" : n.ctag+"AutoTag"), false);
				Zotero.RDF.addStatement(tagNode, n.ctag+"label", tag.tag, true);
				tagCollection[tag.tag] = tagNode;
			}
			
			Zotero.RDF.addStatement(nodes[USERITEM], n.ctag+"tagged", tagNode, false);
		}
		
		type.addNodeRelations(nodes);
		//Zotero.debug("relations added");

	}
}
