{
	"translatorID": "093ad11d-291f-4ed4-a406-23fd2a4de95f",
	"label": "Legislation of Mongolia",
	"creator": "Frank Bennett",
	"target": "https?://(www.)*legalinfo.mn/law",
	"minVersion": "1.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "g",
	"lastUpdated": "2013-07-24 08:59:33"
}

// Chimgee -- the list of phrases is at the end.

function Engine () {
    this.makeMaps();
    this.makeReverseInputMap();
    this.info = {};
}

Engine.prototype.makeReverseInputMap = function () {
    this.reverseInputMap = {};
    for (var key in this.inputmap) {
        this.reverseInputMap[this.inputmap[key].code] = key;
        for (var subkey in this.inputmap[key].children) {
            this.reverseInputMap[this.inputmap[key].children[subkey]] = subkey;
        }
    }
}

Engine.prototype.detectWeb = function (doc, url) {
    var m = url.match(/https?:\/\/(?:www\.)*legalinfo\.mn\/law(\/details)*.*/);
    if (m) {
        if (m[1]) {

            // Just ignore single docs. Can't be made to work, unfortunately.

            //return this.getInfoFromDocument(doc).cat.type;

        } else {
            return "multiple";
        }
    }
}

Engine.prototype.getInfo = function (doc, url) {
    var m = url.match(/https?:\/\/(?:www\.)*legalinfo\.mn\/law(?:(\/details)|.*[^b]cat=([0-9]+))*.*/);
    if (m) {
        if (m[1]) {
            this.info = this.getInfoFromDocument(doc);
        } else if (m[2]) {
            this.info.cat = this.reverseInputMap[m[2]];
            this.info.type = this.inputmap[this.info.cat].type;
            var mm = url.match(/https?:\/\/(?:www\.)*legalinfo\.mn\/law.*subcat=([0-9]*)*.*/);
            if (mm) {
                this.info.subcat = this.reverseInputMap[mm[1]];
            }
        }
    }
    return this.info.type;
}

Engine.prototype.getInfoFromDocument = function (doc) {
    var category;
    var subcategory;
    var crumbs = ZU.xpath(doc,'//h2[@class="crumbs"]/a');
    var ret;
    if (crumbs.length > 1) {
        ret = {};
        category = crumbs.slice(1,2)[0].textContent.replace(/^\s*(.*?)\s*$/, "$1");
        ret.cat = this.inputmap[category];
        Zotero.debug("XXX category: "+category);
        ret.title = crumbs.slice(-1)[0].textContent;
    }
    if (crumbs.length > 2) {
        subcategory = crumbs.slice(2,3)[0].textContent.replace(/^\s*(.*?)\s*$/, "$1");
        Zotero.debug("XXX subcategory: "+subcategory);
        ret.subcat = this.inputmap[category].children[subcategory];
        for (var key in this.inputmap[category].children) {
            Zotero.debug("XXX   --> "+key);
        }
        Zotero.debug("XXX   ("+ret.cat + ") (" + ret.subcat + ")");
    }
    return ret;
}

Engine.prototype.getFullURL = function (doc,url) {
    if (url.slice(0,1) === "/") {
        var base = doc.location.href;
        base = base.replace(/^(https?:\/\/[^\/]*).*/,"$1")
        url = base + url;
    }
    return url;
}

Engine.prototype.getItemData = function (doc) {
    //   * The URL of the doc (from chosen)
    //   * The title (from chosen or from supp)
    //   * The number (optional, from supp)
    //   * The enactment date (from supp)
    //   * The effective date (optional, from supp)
    //   * The category (preset from index page)
    //   * The subcategory (optional, from index page)
    //   * The type (derived from index page)
    var rows = ZU.xpath(doc, '//div[@id="page-container"]//div[@id="datagrid"]//div[contains(@class,"tbd")]/div[contains(@class,"row")]');
    var items = {};
    var supp = {};
    for (i=0,ilen=rows.length;i<ilen;i+=1) {
        var cells = rows[i].childNodes;
        // The width of the list varies, with drop-outs on both sides of
        // title. So we sniff the position of title, and then infer the
        // position of other cells from there.
        pos = {
            title: 0,
            number: 0,
            enactedDate: 0,
            effectiveDate: 0
        }
        for (var j=0,jlen=cells.length;j<jlen;j+=1) {
            if (cells[j].getElementsByTagName("a").length) {
                pos.title = j;
                break;
            }
        }
        if (pos.title) {
            if (pos.title === 1) {
                pos.enactedDate = 2;
                pos.effectiveDate = 3;
            } else if (pos.title === 2) {
                pos.number = 1;
                pos.enactedDate = 3;
                pos.effectiveDate = 4;
            }

            var u = cells[pos.title].childNodes[0].getAttribute("href");
            u = this.getFullURL(doc,u);
            var t = cells[pos.title].childNodes[0].textContent;
            items[u] = t;
            if (t) {
                t = t.replace(/^\s*[0-9]+\.\s*/,"")
                var lst = t.split(/\s+/);
                for (var j=0,jlen=lst.length;j<jlen;j+=1) {
                    lst[j] = lst[j].slice(0,1).toUpperCase() + lst[j].slice(1).toLowerCase();
                }
                t = lst.join(" ");
            }

            supp[u] = { type: this.info.type, cat: this.info.cat, subcat: this.info.subcat, title: t };
            
            if (cells[pos.enactedDate].textContent.replace(/^\s*(.*?)\s*$/, "$1")) {
                supp[u].enactedDate = cells[pos.enactedDate].textContent;
            }

            if (cells[pos.effectiveDate].textContent.replace(/^\s*(.*?)\s*$/, "$1")) {
                supp[u].effectiveDate = cells[pos.effectiveDate].textContent;
            }

            if (pos.number && cells[pos.number].textContent.replace(/^\s*(.*?)\s*$/, "$1")) {
                supp[u].number = cells[pos.number].textContent;
            }
        }
    }
    return { items: items, supp: supp };
}

Engine.prototype.selectedItemsCallback = function (fieldmap, urls, supp) {
    ZU.processDocuments(urls, function (doc) {
		var url = doc.documentURI;
        var type = supp[url].type;
        var item = new Zotero.Item(type);
        item.url = url;
        item.jurisdiction = "mn";
        for (var key in fieldmap[type]) {
            item[fieldmap[type][key]] = supp[url][key];
        }
        // Extract page content for save here.
        var content = doc.getElementsByClassName("content_field");
        if (content && content.length) {
            content = content[0];
            // Delete word processor and download icons, they're not part of content
            var anchors = content.getElementsByTagName("a");
            for (var i=anchors.length-1;i>-1;i+=-1) {
                var href = anchors[i].getAttribute("href");
                if (href && href.match(/(?:showPrint|downloadDoc)/)) {
                    anchors[i].parentNode.removeChild(anchors[i]);
                }
            }
            var title = supp[url].title;
            var myns = "http://www.w3.org/1999/xhtml"
            var head = doc.createElementNS(myns, "head");
            var titlenode = doc.createElementNS(myns, "title");
            head.appendChild(titlenode)
            titlenode.appendChild(doc.createTextNode(title));
            var style = doc.createElementNS(myns, "style");
            head.appendChild(style)
            style.setAttribute("type", "text/css")
            
            var css = "*{margin:0;padding:0;}table, div{width: 60em;margin:0 auto;text-align:left;margin-top:1em;margin-bottom:1em;}body{text-align:center;}";
            
            style.appendChild(doc.createTextNode(css));
            var newDoc = ZU.composeDoc(doc, head, content);
            
            item.attachments.push({ url:item.url, mimeType: "text/html", document: newDoc, snapshot: true })
        }
        item.complete();
    }, function(){Zotero.done();});
}

// This didn't work out. API does not seem to permit acquisition of a list
// containing metadata for exactly one instrument.
/*
Engine.prototype.scrapeFromDocument = function (doc) {
    // Cobble together URL for a listing containing only the target item
    var info = this.getInfoFromDocument(doc);
    var title = info.title.replace(" ","%20","g");
    if (info.subcat) {
        var url = "/law?cat=" + info.cat.code + "&subcat=" + info.subcat.code + "&l_name=" + title;
    } else {
        var url = "/law?cat=" + info.cat.code + "&l_name=" + title;
    }
    // Run processDocuments() on target URL as a way of getting the DOM of the target listing
    var engine = this;
    Zotero.debug("XXX ADDRESS: "+url);
    ZU.processDocuments([url], function(doc) {
        // Inside processDocuments() gather metadata from all rows (should be only one ...)
        var data = engine.getItemData(doc);
        // Run selectedItemsCallback with our original URL to fetch the item to MLZ
        var urls = [];
        for (var u in data.items) {
            urls.push(u);
        }
        Zotero.debug("XXX URLS: "+urls);
        engine.selectedItemsCallback(engine.fieldmap, urls, data.supp);;
    }, function(){});
}
*/


function detectWeb(doc,url) {
    var engine = new Engine();
    return engine.detectWeb(doc, url);
}
    
function doWeb(doc, url) {
    var engine = new Engine();
    engine.getInfo(doc, url);
    var displayType = engine.detectWeb(doc, url);
    if (displayType === "multiple") {
        var callback = engine.selectedItemsCallback;
        //   * The category (preset from index page)
        //   * The subcategory (optional, from index page)
        //   * The type (derived from index page)
        var data = engine.getItemData(doc);
        var items = [];
        var selectedItemsCallback = engine.selectedItemsCallback;
        var fieldmap = engine.fieldmap;
        Zotero.selectItems(data.items, function (chosen) {
	        for (var j in chosen) {
		        items.push(j);
	        }
	        selectedItemsCallback(fieldmap, items, data.supp);
        });
    }
// Nevermind
/*
    else {
        engine.scrapeFromDocument(doc);
    }
*/
}

// Static data

Engine.prototype.makeMaps = function () {
    this.inputmap = {
        "Монгол Улсын хууль": {
            code: "27",
            type: "statute",
            english: "Statutes",
            boilerplate: {},
            children: {}
        },
        "Улсын Их Хурлын тогтоол": {
            code: "28",
            english: "Resolutions of the state Great Khural",
            type: "bill",
            boilerplate: {
                resolutionLabel: {
                    mn: "Улсын Их Хурлын тогтоол [??? -- singular form -- ???]",
                    en: "Resolution of the state Great Khural"
                }
            },
            children: {}
        },
        "Монгол Улсын олон улсын гэрээ": {
            code: "29",
            english: "Mongolian international treaties",
            type: "treaty",
            boilerplate: {},
            children: {
                "Гадаад харилцааг зохион байгуулах": {
                    code: "138",
                    english: "[Organizing International Relations]"
                },
                
                "Гэмт хэрэг болон терроризмтай хийх олон улсын тэмцэл": {
                    code: "139",
                    english: "[International Fight Against Terrorism and Crime]"
                },
                
                "Дипломат болон консулын эрх зүй": {
                    code: "140",
                    english: "[Diplomatic and Consular Law]"
                },
                
                "Зэвсэгт мөргөлдөөн ба олон улсын эрх зүй": {
                    code: "141",
                    english: "[Armed Conflict and International Law]"
                },
                
                "Нийгэм-соёлын салбарын олон улсын хамтын ажиллагаа": {
                    code: "142",
                    english: "[International Cooperation on Social-Cultural Issues]"
                },
                
                "Нутаг дэвсгэр": {
                    code: "143",
                    english: "[Territory]"
                },
                
                "Олон улсын агаарын эрх зүй": {
                    code: "144",
                    english: "[International Air Law]"
                },
                
                "Олон улсын аюулгүй байдлын эрх зүй": {
                    code: "145",
                    english: "[International Security Law ]"
                },
                
                "Олон улсын байгууллага ба холбоо": {
                    code: "146",
                    english: "[International Organizations and Associations]"
                },
                
                "Олон улсын гэрээний эрх зүй": {
                    code: "147",
                    english: "[International Treaty Law]"
                },
                
                "Олон улсын далайн эрх зүй": {
                    code: "148",
                    english: "International Law of the Sea"
                },
                
                "Олон улсын сансрын эрх зүй": {
                    code: "149",
                    english: "[International Law of Space]"
                },
                
                "Олон улсын харилцааны нийтлэг асуудал": {
                    code: "150",
                    english: "[Issues and Problems of International Relations]"
                },
                
                "Олон улсын шинжлэх ухаан техникийн хамтын ажиллагаа": {
                    code: "151",
                    english: "[International Cooperation in Science and Technology]"
                },
                
                "Олон улсын эдийн засгийн хамтын ажиллагаа": {
                    code: "152",
                    english: "[International Economic Cooperation]"
                },
                
                "Улсын эрх залгамжлал": {
                    code: "153",
                    english: "[Succession of State]"
                },
                
                "Хүн ам": {
                    code: "154",
                    english: "[Population]"
                },
                
                "Хүний эрхийн олон улсын хамгаалалт": {
                    code: "155",
                    english: "[International Protection of Human Rights]"
                },
                
                "Хүрээлэн буй орчны олон улсын эрх зүйн хамгаалалт": {
                    code: "156",
                    english: "[International Law Protecting the Environment]"
                },
                
                "Цэрэг, дайны асуудлаархи хамтын ажиллагаа": {
                    code: "157",
                    english: "[Military Cooperation and War]"
                }
            }
        },
        "Ерөнхийлөгчийн зарлиг": {
            code: "30",
            english: "Decrees of the president",
            type: "regulation",
            boilerplate: {
                regulatoryBody: {
                    mn: "Ерөнхийлөгч",
                    en: "President"
                },
                regulationType: {
                    mn: "Ерөнхийлөгчийн зарлиг",
                    en: "Presidential Decree"
                }
            },
            children: {}
        },
        "Үндсэн хуулийн цэцийн шийдвэр": {
            code: "31",
            english: "Decisions of the Constitutional Tsets",
            type: "case",
            boilerplate: {},
            children: {
                "Тогтоол": {
                    code: "тогтоол",
                    english: "Resolution",
                    boilerplate: {}
                },
                
                "Дүгнэлт": {
                    code: "дүгнэлт",
                    english: "Decision",
                    boilerplate: {}
                }
            }
        },
        "Улсын дээд шүүхийн тогтоол": {
            code: "32",
            english: "Resolutions of the Supreme Court",
            type: "bill",
            boilerplate: {},
            children: {}
        },
        "Засгийн газрын тогтоол": {
            code: "33",
            english: "Resolutions of the government",
            type: "bill",
            boilerplate: {},
            children: {}
        },
        "Сайдын тушаал": {
            code: "34",
            english: "Ministerial ordinances",
            type: "regulation",
            boilerplate: {},
            children: {
                "Гадаад харилцааны яам": {
                    code: "95",
                    english: "[Ministry of Foreign Affairs]",
                    boilerplate: {}
                },

                "Сангийн яам": {
                    code: "96",
                    english: "[Ministry of Finance]",
                    boilerplate: {}
                },

                "Хууль зүй, дотоод хэргийн яам": {
                    code: "97",
                    english: "[Ministry of Justice]",
                    boilerplate: {},
                    changes: {
                        "2012": {
                            variant: "Хууль зүйн яам",
                            boilerplate: {}
                        }
                    }
                },

                "Байгаль орчин, аялал жуулчлалын яам": {
                    code: "98",
                    english: "[Ministry of Nature, Environment and Green Development]",
                    boilerplate: {},
                    changes: {
                        "2012": {
                            variant: "Байгаль орчин, ногоон хөгжлийн яам",
                            boilerplate: {}
                        }
                    }
                },

                "Боловсрол, соёл шинжлэх ухааны яам": {
                    code: "99",
                    english: "[Ministry of Defence]",
                    boilerplate: {},
                    changes: {
                        "2012": {
                            variant: "Батлан хамгаалах яам",
                            boilerplate: {}
                        }
                    }
                },

                "Боловсрол, шинжлэх ухааны яам": {
                    code: "100",
                    english: "[Ministry of Education and Science]",
                    boilerplate: {}
                },

                "Зам тээвэр, аялал жуулчлалын яам": {
                    code: "101",
                    english: "[Ministry of Road and Transportation]",
                    boilerplate: {},
                    changes: {
                        "2012": {
                            variant: "Зам тээвэрийн яам",
                            boilerplate: {}
                        }
                    }
                },

                "Нийгмийн хамгаалал, хөдөлмөрийн яам": {
                    code: "102",
                    english: "[Ministry of Labor]",
                    boilerplate: {},
                    changes: {
                        "2012": {
                            variant: "Хөдөлмөрийн яам",
                            boilerplate: {}
                        }
                    }
                },

                "Эрдэс баялаг, эрчим хүчний яам": {
                    code: "103",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хүнс, хөдөө аж ахуй, хөнгөн үйлдвэрийн яам": {
                    code: "104",
                    english: "[???]",
                    boilerplate: {}
                },

                "Барилга, хот байгуулалтын яам": {
                    code: "105",
                    english: "[???]",
                    boilerplate: {}
                },

                "Түлш, эрчим хүчний яам": {
                    code: "106",
                    english: "[???]",
                    boilerplate: {}
                },

                "Эрүүл мэндийн яам": {
                    code: "107",
                    english: "[???]",
                    boilerplate: {}
                },

                "Дэд бүтцийн яам": {
                    code: "158",
                    english: "[???]",
                    boilerplate: {}
                },

                "Зам тээвэр, барилга, хот байгуулалтын яам": {
                    code: "159",
                    english: "[???]",
                    boilerplate: {}
                },

                "Байгаль орчны яам": {
                    code: "160",
                    english: "[???]",
                    boilerplate: {}
                },

                "Гадаад хэргийн яам": {
                    code: "161",
                    english: "[???]",
                    boilerplate: {}
                },

                "Үйлдвэр, худалдааны яам": {
                    code: "162",
                    english: "[???]",
                    boilerplate: {}
                },

                "Санхүү, эдийн засгийн яам": {
                    code: "163",
                    english: "[???]",
                    boilerplate: {}
                },

                "Гэгээрлийн яам": {
                    code: "164",
                    english: "[???]",
                    boilerplate: {}
                }
            }
        },
        "Засгийн газрын агентлагийн даргын тушаал": {
            code: "35",
            english: "Ordinances of administrative agency chiefs",
            type: "regulation",
            boilerplate: {},
            children: {
                "Биеийн тамир, спортын хороо": {
                    code: "137",
                    english: "[???]",
                    boilerplate: {}
                },

                "Мэдээлэл, харилцаа холбоо, технологийн газар": {
                    code: "108",
                    english: "[???]",
                    boilerplate: {}
                },

                "Тагнуулын ерөнхий газар": {
                    code: "109",
                    english: "[???]",
                    boilerplate: {}
                },

                "Төрийн өмчийн хороо": {
                    code: "110",
                    english: "[???]",
                    boilerplate: {}
                },

                "Стандартчилал, хэмжил зүйн төв": {
                    code: "111",
                    english: "[???]",
                    boilerplate: {}
                },

                "Шударга бус өрсөлдөөнийг хянан зохицуулах газар": {
                    code: "112",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хил хамгаалах ерөнхий газар": {
                    code: "113",
                    english: "[???]",
                    boilerplate: {}
                },

                "Цагдаагийн ерөнхий газар": {
                    code: "114",
                    english: "[???]",
                    boilerplate: {}
                },

                "Газрын харилцаа, геодези, зураг зүйн газар": {
                    code: "115",
                    english: "[???]",
                    boilerplate: {}
                },

                "Зэвсэгт хүчний жанжин штаб": {
                    code: "116",
                    english: "[???]",
                    boilerplate: {}
                },

                "Улсын мэргэжлийн хяналтын газар": {
                    code: "117",
                    english: "[???]",
                    boilerplate: {}
                },

                "Онцгой байдлын ерөнхий газар": {
                    code: "118",
                    english: "[???]",
                    boilerplate: {}
                },

                "Оюуны өмчийн газар": {
                    code: "119",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хүүхдийн төлөө үндэсний газар": {
                    code: "120",
                    english: "[???]",
                    boilerplate: {}
                },

                "Удирдлагын академи": {
                    code: "121",
                    english: "[???]",
                    boilerplate: {}
                },

                "Төр, засгийн үйлчилгээ, аж ахуйг эрхлэх газар": {
                    code: "122",
                    english: "[???]",
                    boilerplate: {}
                },

                "Дипломат байгууллагын үйлчилгээ, аж ахуйн газар": {
                    code: "123",
                    english: "[???]",
                    boilerplate: {}
                },

                "Улсын гаалийн ерөнхий газар": {
                    code: "124",
                    english: "[???]",
                    boilerplate: {}
                },

                "Үндэсний татварын ерөнхий газар": {
                    code: "125",
                    english: "[???]",
                    boilerplate: {}
                },

                "Иргэний бүртгэл мэдээллийн улсын төв": {
                    code: "126",
                    english: "[???]",
                    boilerplate: {}
                },

                "Үндэсний архивын газар": {
                    code: "127",
                    english: "[???]",
                    boilerplate: {}
                },

                "Шүүхийн шийдвэр гүйцэтгэх ерөнхий газар": {
                    code: "128",
                    english: "[???]",
                    boilerplate: {}
                },

                "Усны хэрэг эрхлэх газар": {
                    code: "129",
                    english: "[???]",
                    boilerplate: {}
                },

                "Цаг уур, орчны шинжилгээний газар": {
                    code: "130",
                    english: "[???]",
                    boilerplate: {}
                },

                "Иргэний нисэхийн ерөнхий газар": {
                    code: "131",
                    english: "[???]",
                    boilerplate: {}
                },

                "Төмөр замын Хэрэг эрхлэх газар": {
                    code: "132",
                    english: "[???]",
                    boilerplate: {}
                },

                "Ашигт малтмал, газрын тосны Хэрэг эрхлэх газар": {
                    code: "133",
                    english: "[???]",
                    boilerplate: {}
                },

                "Гадаадын хөрөнгө оруулалтын газар": {
                    code: "134",
                    english: "[???]",
                    boilerplate: {}
                },

                "Улсын нийгмийн даатгалын ерөнхий газар": {
                    code: "135",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хөдөлмөр, халамжийн үйлчилгээний газар": {
                    code: "136",
                    english: "[???]",
                    boilerplate: {}
                }
            }
        },
        "УИХ-аас томилогддог байгууллагын дарга, түүнтэй адилтгах албан тушаалтны шийдвэр": {
            code: "36",
            english: "Ordinances of chiefs of organizations established by the state Great Khural",
            type: "regulation",
            boilerplate: {},
            children: {
                "Монгол банк": {
                    code: "87",
                    english: "[???]",
                    boilerplate: {}
                },

                "Төрийн албаны зөвлөл": {
                    code: "88",
                    english: "[???]",
                    boilerplate: {}
                },

                "Сонгуулийн ерөнхий хороо": {
                    code: "89",
                    english: "[???]",
                    boilerplate: {}
                },

                "Авилгатай тэмцэх газар": {
                    code: "90",
                    english: "[???]",
                    boilerplate: {}
                },

                "Үндэсний статистикийн газар": {
                    code: "91",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хүний эрхийн үндэсний комисс": {
                    code: "92",
                    english: "[???]",
                    boilerplate: {}
                },

                "Үндэсний аудитын газар": {
                    code: "93",
                    english: "[???]",
                    boilerplate: {}
                },

                "Санхүүгийн зохицуулах хороо": {
                    code: "94",
                    english: "[???]",
                    boilerplate: {}
                }
            }
        },
        "Аймаг, нийслэлийн ИТХ-ын шийдвэр": {
            code: "37",
            english: "Decisions of aimag and capital city representative khurals",
            type: "case",
            boilerplate: {},
            children: {
                "Архангай аймаг": {
                    code: "65",
                    english: "[???]",
                    boilerplate: {}
                },

                "Баян-Өлгий аймаг": {
                    code: "66",
                    english: "[???]",
                    boilerplate: {}
                },

                "Баянхонгор аймаг": {
                    code: "67",
                    english: "[???]",
                    boilerplate: {}
                },

                "Булган аймаг": {
                    code: "68",
                    english: "[???]",
                    boilerplate: {}
                },

                "Говь-Алтай аймаг": {
                    code: "69",
                    english: "[???]",
                    boilerplate: {}
                },

                "Говьсүмбэр аймаг": {
                    code: "70",
                    english: "[???]",
                    boilerplate: {}
                },

                "Дархан-Уул аймаг": {
                    code: "71",
                    english: "[???]",
                    boilerplate: {}
                },

                "Дорноговь аймаг": {
                    code: "72",
                    english: "[???]",
                    boilerplate: {}
                },

                "Дорнод аймаг": {
                    code: "73",
                    english: "[???]",
                    boilerplate: {}
                },

                "Дундговь аймаг": {
                    code: "74",
                    english: "[???]",
                    boilerplate: {}
                },

                "Завхан аймаг": {
                    code: "75",
                    english: "[???]",
                    boilerplate: {}
                },

                "Орхон аймаг": {
                    code: "76",
                    english: "[???]",
                    boilerplate: {}
                },

                "Сэлэнгэ аймаг": {
                    code: "77",
                    english: "[???]",
                    boilerplate: {}
                },

                "Сүхбаатар аймаг": {
                    code: "78",
                    english: "[???]",
                    boilerplate: {}
                },

                "Төв аймаг": {
                    code: "79",
                    english: "[???]",
                    boilerplate: {}
                },

                "Увс аймаг": {
                    code: "80",
                    english: "[???]",
                    boilerplate: {}
                },

                "Улаанбаатар": {
                    code: "81",
                    english: "[???]",
                    boilerplate: {}
                },

                "Ховд аймаг": {
                    code: "82",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хэнтий аймаг": {
                    code: "83",
                    english: "[???]",
                    boilerplate: {}
                },

                "Хөвсгөл аймаг": {
                    code: "84",
                    english: "[???]",
                    boilerplate: {}
                },

                "Өвөрхангай аймаг": {
                    code: "85",
                    english: "[???]",
                    boilerplate: {}
                },

                "Өмнөговь аймаг": {
                    code: "86",
                    english: "[???]",
                    boilerplate: {}
                }
            }
        },
        "Аймаг, нийслэлийн Засаг даргын захирамж": {
            code: "38",
            english: "Ordinances of aimag and capital city governors",
            type: "regulation",
            boilerplate: {},
            children: {
                "Архангай аймаг": {
                    code: "39",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Баян-Өлгий аймаг": {
                    code: "40",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Баянхонгор аймаг": {
                    code: "41",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Булган аймаг": {
                    code: "46",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Говь-Алтай аймаг": {
                    code: "47",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Говьсүмбэр аймаг": {
                    code: "48",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Дархан-Уул аймаг": {
                    code: "49",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Дорноговь аймаг": {
                    code: "50",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Дорнод аймаг": {
                    code: "51",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Дундговь аймаг": {
                    code: "52",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Завхан аймаг": {
                    code: "53",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Орхон аймаг": {
                    code: "54",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Сэлэнгэ аймаг": {
                    code: "55",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Сүхбаатар аймаг": {
                    code: "56",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Төв аймаг": {
                    code: "57",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Увс аймаг": {
                    code: "58",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Улаанбаатар": {
                    code: "59",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Ховд аймаг": {
                    code: "60",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Хэнтий аймаг": {
                    code: "61",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Хөвсгөл аймаг": {
                    code: "62",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Өвөрхангай аймаг": {
                    code: "63",
                    english: "[???]",
                    boilerplate: {}                
                },

                "Өмнөговь аймаг": {
                    code: "64",
                    english: "[???]",
                    boilerplate: {}
                }
            }
        }
    };

    this.fieldmap = {
        "case": {
            title: "caseName",
            number: "docketNumber",
            enactedDate: "dateDecided"
        },
        regulation: {
            title: "nameOfAct",
            number: "publicLawNumber",
            enactedDate: "dateEnacted",
            effectiveDate: "extra"
        },
        statute: {
            title: "nameOfAct",
            number: "publicLawNumber",
            enactedDate: "dateEnacted",
            effectiveDate: "extra"
        },
        treaty: {
            title: "title",
            enactedDate: "signingDate",
            effectiveDate: "date"
        }
    }
}
