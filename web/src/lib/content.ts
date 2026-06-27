/**
 * All landing-page content for "Günbatar Şapagy", preserved 1:1 from the
 * original site. Text lives here so it's easy to edit without touching markup.
 */

export type NavItem = { label: string; href: string; icon: string }

/** Top navigation (same items/order as the original navbar). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Gerek maglumatlar', href: '#gerek-maglumatlar', icon: '/images/info.svg' },
  { label: 'Habarlaşmak', href: '#contact', icon: '/images/contact.svg' },
  { label: 'Okatýan derslerimiz', href: '#derslerimiz', icon: '/images/book_icon.png' },
  { label: 'Mümkinçiliklerimiz', href: '#mumkinchilik', icon: '/images/prices.png' },
  { label: 'Gallereýa & arhiw', href: '/galereya', icon: '/images/gallery.svg' },
  { label: 'Biz barada', href: '#contact', icon: '/images/about_us.png' },
]

export const HERO = {
  title: 'GÜNBATAR SHAPAGY',
  subtitle: '"Maksadymyz müňlerçe adamlaryň başarnyklaryny açmak"',
}

/**
 * "Gerek maglumatlaňyzy saýlaň" quick-link cards. `href` is either an in-page
 * anchor (#...), an SPA route (/...), or a path to an existing page on the
 * server. Targets are kept from the original; adjust freely if pages move.
 */
export type InfoCard = { label: string; icon: string; href: string }
export const INFO_CARDS: InfoCard[] = [
  { label: 'Synaglaryň jogaplary', icon: '/images/5833290.png', href: '/admin' },
  { label: 'Gallereýa & arhiw', icon: '/images/3321396.png', href: '#gallery-promo' },
  { label: 'Çäreler we dabaralar', icon: '/images/3476197.png', href: '/galereya' },
  { label: 'Mugallymlarymyz', icon: '/images/3373452.png', href: '/mugallymlar' },
  { label: 'Köp soralýan soraglar', icon: '/images/3240831.png', href: '#faq' },
  { label: 'Dürli mümkinçiliklerimiz', icon: '/images/1796835.png', href: '#mumkinchilik' },
  { label: 'Täzelikler', icon: '/images/5268696.png', href: '#gallery-promo' },
  { label: 'Myhmanlarymyz', icon: '/images/6543820.png', href: '/galereya' },
]

export type Course = { label: string; image: string; desc: string }
export const COURSES: Course[] = [
  {
    label: 'Iňlis dili',
    image: '/images/english-2.jpg',
    desc: 'Başlangyçdan ösen derejä çenli iňlis dili — gepleşik, grammatika we "TOEFL" taýýarlygy.',
  },
  {
    label: 'Rus dili',
    image: '/images/russian.jpg',
    desc: 'Kiçi we uly ýaşlar üçin rus dili, "Разговорный клуб" gepleşik tejribesi bilen.',
  },
  {
    label: 'Nemes dili',
    image: '/images/german.jpg',
    desc: 'Nemes dilini başlangyçdan öwreniň — gündelik gepleşik we berk grammatika esaslary.',
  },
  {
    label: 'Himiýa',
    image: '/images/chemistry.jpg',
    desc: 'Mekdep maksatnamasy hem-de olimpiada derejesinde himiýa sapaklary.',
  },
  {
    label: 'Biologiýa',
    image: '/images/biology.jpg',
    desc: 'Janly tebigaty öwreniň — synaglara we ýokary okuwa taýýarlyk.',
  },
  {
    label: 'Programmirleme',
    image: '/images/programming.jpg',
    desc: 'Programmirlemä giriş — kod ýazmagyň esaslary we logiki pikirlenme.',
  },
  {
    label: 'Wideografiýa',
    image: '/images/video.jpg',
    desc: 'Wideo düşürmegiň we professional montaž etmegiň tärleri.',
  },
  {
    label: 'Photoshop & Illustrator',
    image: '/images/photoshop.jpg',
    desc: 'Professional grafiki dizaýn — Photoshop we Illustrator programmalary.',
  },
  {
    label: 'Excel, MS office',
    image: '/images/excel.jpg',
    desc: 'Excel, Word we MS Office programmalaryny ussatlyk bilen ulanmak.',
  },
  {
    label: 'Suratkeşlik',
    image: '/images/art.jpg',
    desc: 'Surat çekmegiň tehnikalary we döredijilik ukyplaryny ösdürmek.',
  },
  {
    label: 'Mental arifmetika',
    image: '/images/math.jpg',
    desc: 'Çagalar üçin akyl hasaplama — çalt, takyk we ynamly pikirlenmek.',
  },
  {
    label: 'Zehin soraglary',
    image: '/images/zehin-sorag.jpg',
    desc: 'Logikany we zehini ösdürýän gyzykly soraglar we ýumuşlar.',
  },
]

export type FeatureBlock = { title: string; items: string[] }
export const FEATURES: FeatureBlock[] = [
  {
    title: 'Diňleýjilerimiz üçin ýeňilliklerimiz',
    items: [
      'Eger daş ýerden gatnaýan bolsa 50 manat ýeňillik',
      '1 maşgaladan 2 we ondan köp adam okaýan bolsa 50 manat ýeňillik',
      '2 we ondan köp kurslarda okaýan bolsa 50 manat ýeňillik',
      'Biologiýa kursyny okaýan bolsa himiýa kursy mugt!',
    ],
  },
  {
    title: 'Çagalar üçin täze mümkinçiliklerimiz bar:',
    items: [
      'Kurslarymyz (6-11) ýaş aralykdaky çagalar üçin',
      'Kurslarymyzyň ýany bilen MUGT lager mümkinçiligi bar',
      'Dürli sport çäreler',
      'Howuzda ýüzmek',
      'Akyl giňişligine degişli bäsleşikler',
      'Gözel şäherimize seýil etmek',
    ],
  },
  {
    title: 'Daşary ýurtda okasy gelýänler üçin mümkinçiliklerimiz bar',
    items: [
      '"Günbatar Şapagy" okuw merkezi Hytaý döwletiniň "Northwest" ýokary okuw jaýyna amatly bahadan ýerleşdirmäge ýardam edýär',
      'Amatly el ýeter bahalar',
      'Iňlis dilinden "TOEFL" synagyna taýynlyk',
      'Pro kurslar',
    ],
  },
]

/** Slides for the gallery-promo carousel; all link to the gallery page.
 *  Images preserved from the original (memory-img), optimized to WebP. */
export type PromoSlide = { title: string; image: string }
export const GALLERY_PROMO_SLIDES: PromoSlide[] = [
  { title: 'Gel biziň şatlykly pursatlarymyzyň agzasy bol', image: '/memory-img/1.webp' },
  { title: 'Dürli dabaralar & çäreler', image: '/memory-img/4.webp' },
  { title: 'Gyzykly we..', image: '/memory-img/13.webp' },
  { title: 'Ýatdan çykmajak pursatlar', image: '/memory-img/10.webp' },
  { title: 'Hemmesi bilelikde', image: '/memory-img/9.webp' },
  { title: 'Bir maşgala', image: '/memory-img/11.webp' },
]

export type FaqItem = { q: string; a: string }
export const FAQ: FaqItem[] = [
  {
    q: 'Siziň şahadatnamaňyz ýokary okuwa girmek üçin işe ýaraýarmy?',
    a: 'Elbetde, biziň şahadatnamamyz ýokary okuwa we işe girmek üçin ýokary mümkinçilikler döredýär.',
  },
  {
    q: 'Günbatar Şapagy okuw merkezi diňleýjiler nähili ýeňillikleriňiz bar?',
    a: 'Günbatar Şapagy okuw merkezi diňleýjilerimiz üçin dürli ýeňillikler döredýär:\n\nEger daş ýerden gatnaýan bolsa.\n1 maşgaladan 2 we ondan köp adam okaýan bolsa.\n2 we ondan köp kurslarda okaýan bolsa.',
  },
  {
    q: 'Günbatar Şapagy okuw merkezinde haýsy dersler okadylýar?',
    a: 'Bizde:\nIňlis dili kiçi ýaşlar üçin,\nIňlis dili uly ýaşlar üçin,\nIňlis dili "TOEFL"\n\nRus dili kiçi ýaşlar üçin,\nRus dili uly ýaşlar üçin\n\nKompýuter başlangyç\nExcel, Word, MS office\nWideografiýa\nPhotoshop & Illustrator\nProgrammirleme giriş\n\nNemes dili,\nHytaý dili,\nHimiýa we Biologiýa,\nÇagalar üçin mental arifmetika,\nMatematika,\nÇeperçilik-sungaty',
  },
  {
    q: 'Okadylýan derslerden daşary goşmaça nämeler bar?',
    a: 'Okadylýan derslerden daşary goşmaça sapaklarymyz bar:\n\nPro kurslar\nTizleşdirilen kurslar\nIňlis dili üçin "Speaking club",\nRus dili üçin "Разговорный клуб",\nMekdep olimpiýadalary üçin goşmaça taýýarlyklarymyz bar.',
  },
  {
    q: 'Daşary ýurt Uniwersitetlaryna diňleýjiler üçin nähili mümkinçilikleriňiz bar?',
    a: '"Günbatar Şapagy" okuw merkezi Hytaý döwletiniň "Northwest" ýokary okuw jaýyna amatly bahadan ýerleşdirmäge ýardam edýär\n\nGerekli resminalar:\n\n- Zagran pasport kopýa (perewod etmek gerekdäl)\n- Attestat (iňlis dilinde)\n- Med sprawka (Hytaý ýa-da iňlis dilinde)\n- Bir sany 3*4-lik surat\n- Häsiýetnama mekdepden (iňlis dilinde)',
  },
  {
    q: 'Çagalar üçin tomus paslynda nähili mümkinçilikleriňiz bar?',
    a: 'Derslerden daşary çagalar üçin tomus tapgyrynda lager bar:\n\n- akyl giňişligine degişli bäsleşikler\n- dürli sport çäreleri\n- gözel şäherimize seýil etmek\n- piknik\n- howuzda ýüzmek',
  },
]

export type Branch = { city: string; phones: string[]; address: string }
export const BRANCHES: Branch[] = [
  {
    city: 'Balkanabat şäheri',
    phones: ['+993 61-92-32-24', '+8(222) 6-97-92'],
    address: 'Balkanabat ş. 157-nji ÝJT',
  },
  {
    city: 'Türkmenbaşy şäheri',
    phones: ['+993 62-08-79-98', '5-00-27'],
    address: 'Türkmenbaşy "luç" krug',
  },
]

export const SOCIAL = {
  instagram: 'https://www.instagram.com/gunbatarshapagy?igsh=MWpnM2N4MDlncHpmNA==',
  tiktok: '#',
}

export const TAGLINE = '"Maksadymyz müňlerçe adamlaryň başarnyklaryny açmak"'
