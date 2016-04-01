var fs = require('fs');

function getNthWord(string, n)
{
    var words = string.split(" ");
    return words[n-1];
}

function isBroadcaster(channel, user)
{
	return isBroadcaster = channel.replace('#', '') == user.username;
}

function removeFromArray(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function containsASCII(data)
{
    if (data.indexOf('▓') > -1 || data.indexOf('░') > -1) {
        return true;
    }
    return false;
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

function getFilesizeInMegabytes(filepath)
{
	var stats = fs.statSync(filepath);
	var fileSizeInBytes = stats["size"];
	var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
 	return fileSizeInMegabytes;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFilesizeInKilobytes(filepath)
{
	var stats = fs.statSync(filepath);
	var fileSizeInBytes = stats["size"];
	var fileSizeInMegabytes = fileSizeInBytes / 1000.0;
 	return fileSizeInMegabytes;
}

function fileExists(filePath)
{
    if (fs.existsSync(filePath)){
        return true;
    }
    return false;
}

function secsToTime(sec_num)
{
    sec_num     = Math.round(sec_num);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function lineCount(file)
{
    filePath = process.argv[2];
    fileBuffer =  fs.readFileSync(file);
    to_string = fileBuffer.toString();
    split_lines = to_string.split("\n");
    var lineCount = split_lines.length-1;
    return lineCount;
}

function countWords(str) {
  return str.split(/\s+/).length;
}

function stringContainsUrl(inputString)
{
    if (inputString.match(/(\.AAA)|(\.AARP)|(\.ABB)|(\.ABBOTT)|(\.ABOGADO)|(\.AC)|(\.ACADEMY)|(\.ACCENTURE)|(\.ACCOUNTANT)|(\.ACCOUNTANTS)|(\.ACO)|(\.ACTIVE)|(\.ACTOR)|(\.AD)|(\.ADAC)|(\.ADS)|(\.ADULT)|(\.AE)|(\.AEG)|(\.AERO)|(\.AF)|(\.AFL)|(\.AG)|(\.AGENCY)|(\.AI)|(\.AIG)|(\.AIRFORCE)|(\.AIRTEL)|(\.AL)|(\.ALIBABA)|(\.ALIPAY)|(\.ALLFINANZ)|(\.ALLY)|(\.ALSACE)|(\.AM)|(\.AMICA)|(\.AMSTERDAM)|(\.ANALYTICS)|(\.ANDROID)|(\.ANQUAN)|(\.AO)|(\.APARTMENTS)|(\.APP)|(\.APPLE)|(\.AQ)|(\.AQUARELLE)|(\.AR)|(\.ARAMCO)|(\.ARCHI)|(\.ARMY)|(\.ARPA)|(\.ARTE)|(\.AS)|(\.ASIA)|(\.ASSOCIATES)|(\.AT)|(\.ATTORNEY)|(\.AU)|(\.AUCTION)|(\.AUDI)|(\.AUDIO)|(\.AUTHOR)|(\.AUTO)|(\.AUTOS)|(\.AVIANCA)|(\.AW)|(\.AWS)|(\.AX)|(\.AXA)|(\.AZ)|(\.AZURE)|(\.BA)|(\.BAIDU)|(\.BAND)|(\.BANK)|(\.BAR)|(\.BARCELONA)|(\.BARCLAYCARD)|(\.BARCLAYS)|(\.BAREFOOT)|(\.BARGAINS)|(\.BAUHAUS)|(\.BAYERN)|(\.BB)|(\.BBC)|(\.BBVA)|(\.BCG)|(\.BCN)|(\.BD)|(\.BE)|(\.BEATS)|(\.BEER)|(\.BENTLEY)|(\.BERLIN)|(\.BEST)|(\.BET)|(\.BF)|(\.BG)|(\.BH)|(\.BHARTI)|(\.BI)|(\.BIBLE)|(\.BID)|(\.BIKE)|(\.BING)|(\.BINGO)|(\.BIO)|(\.BIZ)|(\.BJ)|(\.BLACK)|(\.BLACKFRIDAY)|(\.BLOOMBERG)|(\.BLUE)|(\.BM)|(\.BMS)|(\.BMW)|(\.BN)|(\.BNL)|(\.BNPPARIBAS)|(\.BO)|(\.BOATS)|(\.BOEHRINGER)|(\.BOM)|(\.BOND)|(\.BOO)|(\.BOOK)|(\.BOOTS)|(\.BOSCH)|(\.BOSTIK)|(\.BOT)|(\.BOUTIQUE)|(\.BR)|(\.BRADESCO)|(\.BRIDGESTONE)|(\.BROADWAY)|(\.BROKER)|(\.BROTHER)|(\.BRUSSELS)|(\.BS)|(\.BT)|(\.BUDAPEST)|(\.BUGATTI)|(\.BUILD)|(\.BUILDERS)|(\.BUSINESS)|(\.BUY)|(\.BUZZ)|(\.BV)|(\.BW)|(\.BY)|(\.BZ)|(\.BZH)|(\.CA)|(\.CAB)|(\.CAFE)|(\.CAL)|(\.CALL)|(\.CAMERA)|(\.CAMP)|(\.CANCERRESEARCH)|(\.CANON)|(\.CAPETOWN)|(\.CAPITAL)|(\.CAR)|(\.CARAVAN)|(\.CARDS)|(\.CARE)|(\.CAREER)|(\.CAREERS)|(\.CARS)|(\.CARTIER)|(\.CASA)|(\.CASH)|(\.CASINO)|(\.CAT)|(\.CATERING)|(\.CBA)|(\.CBN)|(\.CC)|(\.CD)|(\.CEB)|(\.CENTER)|(\.CEO)|(\.CERN)|(\.CF)|(\.CFA)|(\.CFD)|(\.CG)|(\.CH)|(\.CHANEL)|(\.CHANNEL)|(\.CHASE)|(\.CHAT)|(\.CHEAP)|(\.CHLOE)|(\.CHRISTMAS)|(\.CHROME)|(\.CHURCH)|(\.CI)|(\.CIPRIANI)|(\.CIRCLE)|(\.CISCO)|(\.CITIC)|(\.CITY)|(\.CITYEATS)|(\.CK)|(\.CL)|(\.CLAIMS)|(\.CLEANING)|(\.CLICK)|(\.CLINIC)|(\.CLINIQUE)|(\.CLOTHING)|(\.CLOUD)|(\.CLUB)|(\.CLUBMED)|(\.CM)|(\.CN)|(\.CO)|(\.COACH)|(\.CODES)|(\.COFFEE)|(\.COLLEGE)|(\.COLOGNE)|(\.COM)|(\.COMMBANK)|(\.COMMUNITY)|(\.COMPANY)|(\.COMPARE)|(\.COMPUTER)|(\.COMSEC)|(\.CONDOS)|(\.CONSTRUCTION)|(\.CONSULTING)|(\.CONTACT)|(\.CONTRACTORS)|(\.COOKING)|(\.COOL)|(\.COOP)|(\.CORSICA)|(\.COUNTRY)|(\.COUPON)|(\.COUPONS)|(\.COURSES)|(\.CR)|(\.CREDIT)|(\.CREDITCARD)|(\.CREDITUNION)|(\.CRICKET)|(\.CROWN)|(\.CRS)|(\.CRUISES)|(\.CSC)|(\.CU)|(\.CUISINELLA)|(\.CV)|(\.CW)|(\.CX)|(\.CY)|(\.CYMRU)|(\.CYOU)|(\.CZ)|(\.DABUR)|(\.DAD)|(\.DANCE)|(\.DATE)|(\.DATING)|(\.DATSUN)|(\.DAY)|(\.DCLK)|(\.DE)|(\.DEALER)|(\.DEALS)|(\.DEGREE)|(\.DELIVERY)|(\.DELL)|(\.DELOITTE)|(\.DELTA)|(\.DEMOCRAT)|(\.DENTAL)|(\.DENTIST)|(\.DESI)|(\.DESIGN)|(\.DEV)|(\.DIAMONDS)|(\.DIET)|(\.DIGITAL)|(\.DIRECT)|(\.DIRECTORY)|(\.DISCOUNT)|(\.DJ)|(\.DK)|(\.DM)|(\.DNP)|(\.DO)|(\.DOCS)|(\.DOG)|(\.DOHA)|(\.DOMAINS)|(\.DOWNLOAD)|(\.DRIVE)|(\.DUBAI)|(\.DURBAN)|(\.DVAG)|(\.DZ)|(\.EARTH)|(\.EAT)|(\.EC)|(\.EDEKA)|(\.EDU)|(\.EDUCATION)|(\.EE)|(\.EG)|(\.EMAIL)|(\.EMERCK)|(\.ENERGY)|(\.ENGINEER)|(\.ENGINEERING)|(\.ENTERPRISES)|(\.EPSON)|(\.EQUIPMENT)|(\.ER)|(\.ERNI)|(\.ES)|(\.ESQ)|(\.ESTATE)|(\.ET)|(\.EU)|(\.EUROVISION)|(\.EUS)|(\.EVENTS)|(\.EVERBANK)|(\.EXCHANGE)|(\.EXPERT)|(\.EXPOSED)|(\.EXPRESS)|(\.EXTRASPACE)|(\.FAGE)|(\.FAIL)|(\.FAIRWINDS)|(\.FAITH)|(\.FAMILY)|(\.FAN)|(\.FANS)|(\.FARM)|(\.FASHION)|(\.FAST)|(\.FEEDBACK)|(\.FERRERO)|(\.FI)|(\.FILM)|(\.FINAL)|(\.FINANCE)|(\.FINANCIAL)|(\.FIRESTONE)|(\.FIRMDALE)|(\.FISH)|(\.FISHING)|(\.FIT)|(\.FITNESS)|(\.FJ)|(\.FK)|(\.FLICKR)|(\.FLIGHTS)|(\.FLORIST)|(\.FLOWERS)|(\.FLSMIDTH)|(\.FLY)|(\.FM)|(\.FO)|(\.FOO)|(\.FOOTBALL)|(\.FORD)|(\.FOREX)|(\.FORSALE)|(\.FORUM)|(\.FOUNDATION)|(\.FOX)|(\.FR)|(\.FRESENIUS)|(\.FRL)|(\.FROGANS)|(\.FRONTIER)|(\.FUND)|(\.FURNITURE)|(\.FUTBOL)|(\.FYI)|(\.GA)|(\.GAL)|(\.GALLERY)|(\.GALLO)|(\.GALLUP)|(\.GAME)|(\.GARDEN)|(\.GB)|(\.GBIZ)|(\.GD)|(\.GDN)|(\.GE)|(\.GEA)|(\.GENT)|(\.GENTING)|(\.GF)|(\.GG)|(\.GGEE)|(\.GH)|(\.GI)|(\.GIFT)|(\.GIFTS)|(\.GIVES)|(\.GIVING)|(\.GL)|(\.GLASS)|(\.GLE)|(\.GLOBAL)|(\.GLOBO)|(\.GM)|(\.GMAIL)|(\.GMBH)|(\.GMO)|(\.GMX)|(\.GN)|(\.GOLD)|(\.GOLDPOINT)|(\.GOLF)|(\.GOO)|(\.GOOG)|(\.GOOGLE)|(\.GOP)|(\.GOT)|(\.GOV)|(\.GP)|(\.GQ)|(\.GR)|(\.GRAINGER)|(\.GRAPHICS)|(\.GRATIS)|(\.GREEN)|(\.GRIPE)|(\.GROUP)|(\.GS)|(\.GT)|(\.GU)|(\.GUCCI)|(\.GUGE)|(\.GUIDE)|(\.GUITARS)|(\.GURU)|(\.GW)|(\.GY)|(\.HAMBURG)|(\.HANGOUT)|(\.HAUS)|(\.HDFCBANK)|(\.HEALTH)|(\.HEALTHCARE)|(\.HELP)|(\.HELSINKI)|(\.HERE)|(\.HERMES)|(\.HIPHOP)|(\.HITACHI)|(\.HIV)|(\.HK)|(\.HM)|(\.HN)|(\.HOCKEY)|(\.HOLDINGS)|(\.HOLIDAY)|(\.HOMEDEPOT)|(\.HOMES)|(\.HONDA)|(\.HORSE)|(\.HOST)|(\.HOSTING)|(\.HOTELES)|(\.HOTMAIL)|(\.HOUSE)|(\.HOW)|(\.HR)|(\.HSBC)|(\.HT)|(\.HU)|(\.HYUNDAI)|(\.IBM)|(\.ICBC)|(\.ICE)|(\.ICU)|(\.ID)|(\.IE)|(\.IFM)|(\.IINET)|(\.IL)|(\.IM)|(\.IMMO)|(\.IMMOBILIEN)|(\.IN)|(\.INDUSTRIES)|(\.INFINITI)|(\.INFO)|(\.ING)|(\.INK)|(\.INSTITUTE)|(\.INSURANCE)|(\.INSURE)|(\.INT)|(\.INTERNATIONAL)|(\.INVESTMENTS)|(\.IO)|(\.IPIRANGA)|(\.IQ)|(\.IR)|(\.IRISH)|(\.IS)|(\.ISELECT)|(\.IST)|(\.ISTANBUL)|(\.IT)|(\.ITAU)|(\.IWC)|(\.JAGUAR)|(\.JAVA)|(\.JCB)|(\.JCP)|(\.JE)|(\.JETZT)|(\.JEWELRY)|(\.JLC)|(\.JLL)|(\.JM)|(\.JMP)|(\.JO)|(\.JOBS)|(\.JOBURG)|(\.JOT)|(\.JOY)|(\.JP)|(\.JPMORGAN)|(\.JPRS)|(\.JUEGOS)|(\.KAUFEN)|(\.KDDI)|(\.KE)|(\.KERRYHOTELS)|(\.KERRYLOGISTICS)|(\.KERRYPROPERTIES)|(\.KFH)|(\.KG)|(\.KH)|(\.KI)|(\.KIA)|(\.KIM)|(\.KINDER)|(\.KITCHEN)|(\.KIWI)|(\.KM)|(\.KN)|(\.KOELN)|(\.KOMATSU)|(\.KP)|(\.KPN)|(\.KR)|(\.KRD)|(\.KRED)|(\.KUOKGROUP)|(\.KW)|(\.KY)|(\.KYOTO)|(\.KZ)|(\.LA)|(\.LACAIXA)|(\.LAMBORGHINI)|(\.LAMER)|(\.LANCASTER)|(\.LAND)|(\.LANDROVER)|(\.LANXESS)|(\.LASALLE)|(\.LAT)|(\.LATROBE)|(\.LAW)|(\.LAWYER)|(\.LB)|(\.LC)|(\.LDS)|(\.LEASE)|(\.LECLERC)|(\.LEGAL)|(\.LEXUS)|(\.LGBT)|(\.LI)|(\.LIAISON)|(\.LIDL)|(\.LIFE)|(\.LIFEINSURANCE)|(\.LIFESTYLE)|(\.LIGHTING)|(\.LIKE)|(\.LIMITED)|(\.LIMO)|(\.LINCOLN)|(\.LINDE)|(\.LINK)|(\.LIVE)|(\.LIVING)|(\.LIXIL)|(\.LK)|(\.LOAN)|(\.LOANS)|(\.LOCUS)|(\.LOL)|(\.LONDON)|(\.LOTTE)|(\.LOTTO)|(\.LOVE)|(\.LR)|(\.LS)|(\.LT)|(\.LTD)|(\.LTDA)|(\.LU)|(\.LUPIN)|(\.LUXE)|(\.LUXURY)|(\.LV)|(\.LY)|(\.MA)|(\.MADRID)|(\.MAIF)|(\.MAISON)|(\.MAKEUP)|(\.MAN)|(\.MANAGEMENT)|(\.MANGO)|(\.MARKET)|(\.MARKETING)|(\.MARKETS)|(\.MARRIOTT)|(\.MBA)|(\.MC)|(\.MD)|(\.ME)|(\.MED)|(\.MEDIA)|(\.MEET)|(\.MELBOURNE)|(\.MEME)|(\.MEMORIAL)|(\.MEN)|(\.MENU)|(\.MEO)|(\.MG)|(\.MH)|(\.MIAMI)|(\.MICROSOFT)|(\.MIL)|(\.MINI)|(\.MK)|(\.ML)|(\.MM)|(\.MMA)|(\.MN)|(\.MO)|(\.MOBI)|(\.MOBILY)|(\.MODA)|(\.MOE)|(\.MOI)|(\.MOM)|(\.MONASH)|(\.MONEY)|(\.MONTBLANC)|(\.MORMON)|(\.MORTGAGE)|(\.MOSCOW)|(\.MOTORCYCLES)|(\.MOV)|(\.MOVIE)|(\.MOVISTAR)|(\.MP)|(\.MQ)|(\.MR)|(\.MS)|(\.MT)|(\.MTN)|(\.MTPC)|(\.MTR)|(\.MU)|(\.MUSEUM)|(\.MUTUELLE)|(\.MV)|(\.MW)|(\.MX)|(\.MY)|(\.MZ)|(\.NA)|(\.NADEX)|(\.NAGOYA)|(\.NAME)|(\.NATURA)|(\.NAVY)|(\.NC)|(\.NE)|(\.NEC)|(\.NET)|(\.NETBANK)|(\.NETWORK)|(\.NEUSTAR)|(\.NEW)|(\.NEWS)|(\.NEXUS)|(\.NF)|(\.NG)|(\.NGO)|(\.NHK)|(\.NI)|(\.NICO)|(\.NIKON)|(\.NINJA)|(\.NISSAN)|(\.NISSAY)|(\.NL)|(\.NO)|(\.NOKIA)|(\.NORTON)|(\.NOWRUZ)|(\.NP)|(\.NR)|(\.NRA)|(\.NRW)|(\.NTT)|(\.NU)|(\.NYC)|(\.NZ)|(\.OBI)|(\.OFFICE)|(\.OKINAWA)|(\.OM)|(\.OMEGA)|(\.ONE)|(\.ONG)|(\.ONL)|(\.ONLINE)|(\.OOO)|(\.ORACLE)|(\.ORANGE)|(\.ORG)|(\.ORGANIC)|(\.ORIGINS)|(\.OSAKA)|(\.OTSUKA)|(\.OVH)|(\.PA)|(\.PAGE)|(\.PAMPEREDCHEF)|(\.PANERAI)|(\.PARIS)|(\.PARS)|(\.PARTNERS)|(\.PARTS)|(\.PARTY)|(\.PASSAGENS)|(\.PE)|(\.PET)|(\.PF)|(\.PG)|(\.PH)|(\.PHARMACY)|(\.PHILIPS)|(\.PHOTO)|(\.PHOTOGRAPHY)|(\.PHOTOS)|(\.PHYSIO)|(\.PIAGET)|(\.PICS)|(\.PICTET)|(\.PICTURES)|(\.PID)|(\.PIN)|(\.PING)|(\.PINK)|(\.PIZZA)|(\.PK)|(\.PL)|(\.PLACE)|(\.PLAY)|(\.PLAYSTATION)|(\.PLUMBING)|(\.PLUS)|(\.PM)|(\.PN)|(\.POHL)|(\.POKER)|(\.PORN)|(\.POST)|(\.PR)|(\.PRAXI)|(\.PRESS)|(\.PRO)|(\.PROD)|(\.PRODUCTIONS)|(\.PROF)|(\.PROMO)|(\.PROPERTIES)|(\.PROPERTY)|(\.PROTECTION)|(\.PS)|(\.PT)|(\.PUB)|(\.PW)|(\.PWC)|(\.PY)|(\.QA)|(\.QPON)|(\.QUEBEC)|(\.QUEST)|(\.RACING)|(\.RE)|(\.READ)|(\.REALTOR)|(\.REALTY)|(\.RECIPES)|(\.RED)|(\.REDSTONE)|(\.REDUMBRELLA)|(\.REHAB)|(\.REISE)|(\.REISEN)|(\.REIT)|(\.REN)|(\.RENT)|(\.RENTALS)|(\.REPAIR)|(\.REPORT)|(\.REPUBLICAN)|(\.REST)|(\.RESTAURANT)|(\.REVIEW)|(\.REVIEWS)|(\.REXROTH)|(\.RICH)|(\.RICOH)|(\.RIO)|(\.RIP)|(\.RO)|(\.ROCHER)|(\.ROCKS)|(\.RODEO)|(\.ROOM)|(\.RS)|(\.RSVP)|(\.RU)|(\.RUHR)|(\.RUN)|(\.RW)|(\.RWE)|(\.RYUKYU)|(\.SA)|(\.SAARLAND)|(\.SAFE)|(\.SAFETY)|(\.SAKURA)|(\.SALE)|(\.SALON)|(\.SAMSUNG)|(\.SANDVIK)|(\.SANDVIKCOROMANT)|(\.SANOFI)|(\.SAP)|(\.SAPO)|(\.SARL)|(\.SAS)|(\.SAXO)|(\.SB)|(\.SBS)|(\.SC)|(\.SCA)|(\.SCB)|(\.SCHAEFFLER)|(\.SCHMIDT)|(\.SCHOLARSHIPS)|(\.SCHOOL)|(\.SCHULE)|(\.SCHWARZ)|(\.SCIENCE)|(\.SCOR)|(\.SCOT)|(\.SD)|(\.SE)|(\.SEAT)|(\.SECURITY)|(\.SEEK)|(\.SELECT)|(\.SENER)|(\.SERVICES)|(\.SEVEN)|(\.SEW)|(\.SEX)|(\.SEXY)|(\.SFR)|(\.SG)|(\.SH)|(\.SHARP)|(\.SHAW)|(\.SHELL)|(\.SHIA)|(\.SHIKSHA)|(\.SHOES)|(\.SHOUJI)|(\.SHOW)|(\.SHRIRAM)|(\.SI)|(\.SINA)|(\.SINGLES)|(\.SITE)|(\.SJ)|(\.SK)|(\.SKI)|(\.SKIN)|(\.SKY)|(\.SKYPE)|(\.SL)|(\.SM)|(\.SMILE)|(\.SN)|(\.SNCF)|(\.SO)|(\.SOCCER)|(\.SOCIAL)|(\.SOFTBANK)|(\.SOFTWARE)|(\.SOHU)|(\.SOLAR)|(\.SOLUTIONS)|(\.SONG)|(\.SONY)|(\.SOY)|(\.SPACE)|(\.SPIEGEL)|(\.SPOT)|(\.SPREADBETTING)|(\.SR)|(\.SRL)|(\.ST)|(\.STADA)|(\.STAR)|(\.STARHUB)|(\.STATEFARM)|(\.STATOIL)|(\.STC)|(\.STCGROUP)|(\.STOCKHOLM)|(\.STORAGE)|(\.STORE)|(\.STREAM)|(\.STUDIO)|(\.STUDY)|(\.STYLE)|(\.SU)|(\.SUCKS)|(\.SUPPLIES)|(\.SUPPLY)|(\.SUPPORT)|(\.SURF)|(\.SURGERY)|(\.SUZUKI)|(\.SV)|(\.SWATCH)|(\.SWISS)|(\.SX)|(\.SY)|(\.SYDNEY)|(\.SYMANTEC)|(\.SYSTEMS)|(\.SZ)|(\.TAB)|(\.TAIPEI)|(\.TALK)|(\.TAOBAO)|(\.TATAMOTORS)|(\.TATAR)|(\.TATTOO)|(\.TAX)|(\.TAXI)|(\.TC)|(\.TCI)|(\.TD)|(\.TEAM)|(\.TECH)|(\.TECHNOLOGY)|(\.TEL)|(\.TELECITY)|(\.TELEFONICA)|(\.TEMASEK)|(\.TENNIS)|(\.TF)|(\.TG)|(\.TH)|(\.THD)|(\.THEATER)|(\.THEATRE)|(\.TICKETS)|(\.TIENDA)|(\.TIFFANY)|(\.TIPS)|(\.TIRES)|(\.TIROL)|(\.TJ)|(\.TK)|(\.TL)|(\.TM)|(\.TMALL)|(\.TN)|(\.TO)|(\.TODAY)|(\.TOKYO)|(\.TOOLS)|(\.TOP)|(\.TORAY)|(\.TOSHIBA)|(\.TOTAL)|(\.TOURS)|(\.TOWN)|(\.TOYOTA)|(\.TOYS)|(\.TR)|(\.TRADE)|(\.TRADING)|(\.TRAINING)|(\.TRAVEL)|(\.TRAVELERS)|(\.TRAVELERSINSURANCE)|(\.TRUST)|(\.TRV)|(\.TT)|(\.TUBE)|(\.TUI)|(\.TUNES)|(\.TUSHU)|(\.TV)|(\.TVS)|(\.TW)|(\.TZ)|(\.UA)|(\.UBS)|(\.UG)|(\.UK)|(\.UNICOM)|(\.UNIVERSITY)|(\.UNO)|(\.UOL)|(\.US)|(\.UY)|(\.UZ)|(\.VA)|(\.VACATIONS)|(\.VANA)|(\.VC)|(\.VE)|(\.VEGAS)|(\.VENTURES)|(\.VERISIGN)|(\.VERSICHERUNG)|(\.VET)|(\.VG)|(\.VI)|(\.VIAJES)|(\.VIDEO)|(\.VIKING)|(\.VILLAS)|(\.VIN)|(\.VIP)|(\.VIRGIN)|(\.VISION)|(\.VISTA)|(\.VISTAPRINT)|(\.VIVA)|(\.VLAANDEREN)|(\.VN)|(\.VODKA)|(\.VOLKSWAGEN)|(\.VOTE)|(\.VOTING)|(\.VOTO)|(\.VOYAGE)|(\.VU)|(\.VUELOS)|(\.WALES)|(\.WALTER)|(\.WANG)|(\.WANGGOU)|(\.WATCH)|(\.WATCHES)|(\.WEATHER)|(\.WEATHERCHANNEL)|(\.WEBCAM)|(\.WEBER)|(\.WEBSITE)|(\.WED)|(\.WEDDING)|(\.WEIR)|(\.WF)|(\.WHOSWHO)|(\.WIEN)|(\.WIKI)|(\.WILLIAMHILL)|(\.WIN)|(\.WINDOWS)|(\.WINE)|(\.WME)|(\.WOLTERSKLUWER)|(\.WORK)|(\.WORKS)|(\.WORLD)|(\.WS)|(\.WTC)|(\.WTF)|(\.XBOX)|(\.XEROX)|(\.XIHUAN)|(\.XIN)|(\.XPERIA)|(\.XXX)|(\.XYZ)|(\.YACHTS)|(\.YAHOO)|(\.YAMAXUN)|(\.YANDEX)|(\.YE)|(\.YODOBASHI)|(\.YOGA)|(\.YOKOHAMA)|(\.YOU)|(\.YOUTUBE)|(\.YT)|(\.YUN)|(\.ZA)|(\.ZARA)|(\.ZERO)|(\.ZIP)|(\.ZM)|(\.ZONE)|(\.ZUERICH)|(\.ZW)/i)) {
        return true;
    }
    return false;
}

function numberFormatted(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function stringIsLongerThan(inputString, lengthToCheck)
{
    if (inputString.length > lengthToCheck) {
        return true;
    }
    return false;
}

module.exports =
{
    getNthWord,
    getFilesizeInKilobytes,
    getFilesizeInMegabytes,
    isBroadcaster,
    stringContainsUrl,
    stringIsLongerThan,
    fileExists,
    numberFormatted,
    secsToTime,
    getRandomInt,
    countWords,
    containsASCII,
    removeFromArray,
    countProperties
};
