import { AREA_PANELS, type AreaPanel } from "@/lib/homepage-content";

/**
 * Area pages: /areas/[slug].
 *
 * These are the core of the local SEO plan. A national portal can out rank us
 * on "flats in Borivali" forever, but it cannot say which side of the station
 * floods, so that is what these pages are for.
 *
 * WRITTEN 16 SEPTEMBER 2026
 *
 * The three pages were researched and written on the owner's instruction that
 * day ("do a deep research on these and figure out yourself"). Every place
 * fact, date, distance and figure below was collected with a source URL first
 * and written second; the sources are listed on each page under the text,
 * the way the articles do it, and the market figures carry the month and the
 * portal they came from because they go stale. Where a figure came from a
 * listing portal's own summary it is described as an asking rate, not a
 * price paid. Nothing about the firm's own dealings is invented: the checks
 * described are the ones on the homepage and the service pages.
 *
 * The photographs are Pexels, chosen for the place they show (the national
 * park, Mumbai's suburban roofscape, the western line, the beach at sunset)
 * and named for it; real photographs of the three suburbs should replace
 * them when the owner has them.
 *
 * WHAT A SECTION CAN CARRY
 *
 * Paragraphs, an optional photograph with a caption, and an optional
 * invitation: a hook sentence and a WhatsApp button with a pre written
 * message. The owner asked for "cliff hangers so that people would go ahead
 * and leave a lead". Each is placed where the reader has just learnt
 * something they would want the answer to for their own case, and each
 * offers that answer free, which is the honest version of a cliff hanger.
 *
 * The NEEDS_INPUT block type stays exported for the sitemap test and any
 * future page that is still being written; no page carries one today.
 */

export const NEEDS_INPUT = "NEEDS YOUR INPUT" as const;

/** A block only the user can write. `prompts` are the questions to answer. */
export type InputBlock = {
  kind: typeof NEEDS_INPUT;
  heading: string;
  prompts: string[];
};

export type AreaImage = { src: string; alt: string; caption?: string };

export type AreaInvite = {
  /** The sentence that makes somebody want the answer for their own case. */
  hook: string;
  /** Button label. */
  button: string;
  /** The WhatsApp message, pre written so the first message is easy. */
  message: string;
};

export type ProseSection = {
  heading: string;
  body: string[];
  image?: AreaImage;
  invite?: AreaInvite;
};

export type AreaSection = ProseSection | InputBlock;

export function isInputBlock(s: AreaSection): s is InputBlock {
  return (s as InputBlock).kind === NEEDS_INPUT;
}

export type AreaPage = {
  slug: string;
  name: string;
  /** Full name for headings and title tags, where the panel name is short. */
  longName: string;
  metaTitle: string;
  metaDescription: string;
  hero?: AreaImage;
  answer: string;
  intro: string[];
  sections: AreaSection[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  /** The month the figures on the page were read. */
  figuresAsOf: string;
};

const PAGES: Record<string, Omit<AreaPage, "slug" | "name">> = {
  "borivali-west": {
    longName: "Borivali",
    metaTitle: "Borivali property guide: pockets, prices, metro and what to check",
    metaDescription:
      "Borivali West and East, pocket by pocket: Chikoowadi, Shimpoli, I.C. Colony, Yogi Nagar, Eksar, Magathane and Kulupwadi, with mid 2026 asking rates, the metro lines, the national park and what an agent here since 1996 checks before you buy or rent.",
    hero: {
      src: "/areas/borivali-aerial.jpg",
      alt: "Mumbai's suburban rooftops and towers with trees between them, seen from above at sunset",
    },
    figuresAsOf: "mid 2026",
    answer:
      "Borivali is two markets at one price. The station belt is older, denser and better connected; the Link Road side is newer and quieter. Asking rates in the West cluster around 30,000 to 31,300 rupees per square foot and in the East around 32,000 to 34,750, with a wide spread inside each by pocket and by the age of the building. Choose the pocket for how you actually live, and the building for how it is run, and Borivali is one of the most liveable addresses in the western suburbs.",
    intro: [
      "We have worked Borivali since 1996 and from the shop in Chikoowadi since 2005. What follows is the Borivali we actually walk, pocket by pocket, with every figure dated so you know how fresh it is. For a specific building, ask us. That is the part no page can do.",
      "Borivali is the northern end of Mumbai's western suburbs, the last city stop for the long distance trains, and for a great many families the first place that felt like Mumbai and a garden at the same time. The national park is its back wall. The creek is its front door.",
    ],
    sections: [
      {
        heading: "The lie of the land",
        body: [
          "Borivali grew out of a ring of villages: Eksar, Poisar, Vazira, Shimpoli, Mandpeshwar, Dattapada, Kanheri, Tulsi, Magathane and Gorai. The British spelt it Berewlee, and the name itself comes from the bor, the Indian jujube, that once grew here. Much of that village geography survives as the names of today's pockets, and a few of the old village goddess temples still stand in Eksar, Shimpoli and Babhai.",
          "The Western Railway line splits the suburb into West and East, and the two sides have grown into different places. The West runs from the station down to Gorai Creek along S.V. Road and Link Road, and holds the shopping, the older cooperative societies and most of the new towers. The East runs from the station up to the Western Express Highway and the gates of Sanjay Gandhi National Park, with more room, more new large projects and a quieter feel.",
          "The people are Marathi and Gujarati in the main, with a long standing East Indian Catholic community around I.C. Colony and Mount Poinsur, and everybody else Mumbai has to offer. It is a suburb of families, of morning walkers, and of societies that know their members by name.",
        ],
        image: {
          src: "/areas/borivali-hills.jpg",
          alt: "Mumbai's suburbs seen from a hill, with towers and rooftops among green slopes",
          caption: "The western suburbs from the hills of the national park. Borivali sits between the forest and the creek.",
        },
      },
      {
        heading: "Borivali West, pocket by pocket",
        body: [
          "Chikoowadi is where our shop is, between Borivali and Kandivali near New Link Road: older cooperative societies alongside newer towers, close to the Shimpoli metro station and a little further from the railway station. It is a quiet, established pocket, and the one we know best. Shimpoli next door began as a village and has become a locality of high rises along Shimpoli Road, which runs from S.V. Road to Chikoowadi, about fifteen minutes on foot from the station.",
          "I.C. Colony takes its name from the Church of Our Lady of the Immaculate Conception, a parish that dates from 1547, was razed in 1739 and restored from 1912. Around it are Mount Poinsur, St. Francis D'Assisi High School (founded 1908 and one of the largest schools in Maharashtra) and the Mandapeshwar caves. It is Borivali's East Indian heart, and in December Brother Cyprian Street opposite the church becomes a Christmas market. Prices here vary more by the age of the building than anywhere else in Borivali.",
          "Yogi Nagar is dense and close to New Link Road. Eksar keeps its village core, its hero stones from the Shilahara era, and now its own metro station. Babhai Naka is the busy junction where S.V. Road meets Link Road, with markets and eateries around it. The station belt itself, along L.T. Road and Chandavarkar Road, is the old commercial heart: the municipal market, the shopping lanes, Veer Savarkar Udyan with its 1.5 kilometre jogging track, and a MHADA colony by the Borivali West metro station. Gorai Road runs out towards the creek and the ferry.",
          "What that means in money, on asking rates read in May 2026: Yogi Nagar around 27,000 to 33,800 rupees per square foot, Shimpoli 27,500 to 30,500, Chikoowadi 25,000 to 26,000, I.C. Colony anywhere from 19,000 to 31,500 depending on the building, Eksar Road 13,000 to 26,000, and the Gorai stretch 10,900 to 23,200. The same budget buys a very different flat two lanes apart.",
        ],
        invite: {
          hook: "Two of these pockets trade at the same rate and behave completely differently for a family with a school run. Tell us your budget and we will tell you which two to see this month.",
          button: "Ask which pocket fits",
          message: "Hi Shree Giriraj, I am looking at Borivali West. My budget is about ___ and I want to know which pocket fits us. Can you help?",
        },
      },
      {
        heading: "Borivali East",
        body: [
          "The East is where Borivali has room. Magathane sits along the Western Express Highway and hides sixth century Buddhist rock cut caves inside a chawl off Dattapada Road. Rajendra Nagar, Daulat Nagar and the Carter Road lanes are established residential pockets with a mix of older and newer buildings. Kulupwadi runs up to the national park, ten minutes from the gate, and holds Raheja Estate with its Ekta Woods societies.",
          "Dattapada Road is where the biggest new project in Borivali is rising: Oberoi Sky City, about 25 acres and eight towers of 3 and 4 BHK flats, roughly two kilometres from the station, with possession declared for December 2027 on its MahaRERA registration. Around it the East has a run of completed premium projects, which is why its asking rates now sit above the West's.",
          "On the figures: Square Yards put the East's average asking rate at 34,750 rupees per square foot in June 2026, with a spread from about 25,450 for older ready flats to 47,750 at the top end, and a government registration rate of 20,950. 99acres showed around 32,150. Ready to move stock averaged closer to 25,700, which is the number a family buying an older flat should have in mind rather than the headline.",
        ],
      },
      {
        heading: "Getting around",
        body: [
          "Borivali station is the reason the suburb exists. Ten platforms, a terminus for slow, semi fast and fast locals, and the last stop inside the city for every long distance train on the Western Railway. It handles around 2.87 lakh passengers a day, and in July 2026 the Rail Land Development Authority set out a redevelopment with new station buildings on both sides, elevated concourses and multi level parking. Andheri is about 23 minutes away by train.",
          "The metro changed the West and the East differently. Metro Line 2A along New Link Road serves the West with stations at Eksar, Borivali West, Shimpoli and Mandapeshwar in I.C. Colony, and connects to Line 1 at Andheri West. Metro Line 7 along the Western Express Highway serves the East at Ovaripada, Rashtriya Udyan, Devipada and Magathane, and its extension to the airport is due in December 2026. Both run every eight minutes at peak.",
          "By road, the Western Express Highway on the east and New Link Road on the west are the two spines, with S.V. Road between them. From Gorai Creek, a ten to fifteen minute ferry crosses to Gorai village and the Global Vipassana Pagoda.",
        ],
        image: {
          src: "/areas/train.jpg",
          alt: "A Mumbai suburban train stopped at a busy station platform with commuters",
          caption: "The western line is Borivali's spine. The station handles around 2.87 lakh passengers a day.",
        },
      },
      {
        heading: "Green, and why it matters to the price",
        body: [
          "Sanjay Gandhi National Park, once Borivali National Park, is 103.84 square kilometres of forest with its headquarters and main gate in Borivali East. It draws more than two million visitors a year and, on a normal morning, three to five thousand walkers from Borivali, Kandivali and Dahisar between half past five and half past seven. Inside are the 109 Kanheri caves, cut into basalt between the first and tenth centuries, and the catchments of Tulsi and Vihar lakes. A 2022 study found the leopard density here among the highest recorded anywhere.",
          "In the West, the Mandapeshwar caves near Mount Poinsur are a Shiva shrine cut from Buddhist viharas, with the ruins of a 1544 Portuguese church above them. Across the creek stands the Global Vipassana Pagoda, 99 metres tall, inaugurated in 2009, reached by ferry. Gorai beach is quieter and cleaner than most of Mumbai's, though the sea is not for swimming. The old EsselWorld park beside it has been closed since 2022.",
          "This is not scenery for its own sake. The buildings that back onto the park in Borivali East, and the lanes in the West within a walk of Veer Savarkar Udyan, hold their value across cycles because families choose them on purpose. When we say a pocket matters more than a building here, this is a large part of what we mean.",
        ],
        image: {
          src: "/areas/borivali-sgnp.jpg",
          alt: "Trees and ancient rock cut caves at Sanjay Gandhi National Park in Mumbai",
          caption: "Sanjay Gandhi National Park: 103.84 square kilometres, with its main gate in Borivali East.",
        },
      },
      {
        heading: "The buildings, and where redevelopment really stands",
        body: [
          "Much of Borivali's housing is the cooperative society stock of the 1960s to the 1990s, three to seven storeys, built well and now reaching the age where redevelopment is the natural next chapter. Madhumilan Society on S.V. Road, built around 1967 with some 218 families, spent 2025 choosing between developers. Industry estimates in early 2026 put more than 200 redevelopment projects underway across Borivali, and one report counted 176 redevelopment agreements signed here between 2020 and May 2025, the most of any Mumbai suburb.",
          "The larger schemes are cluster redevelopments: Arkade Developers' 865 crore rupee project for four Shreepal Nagar societies in Borivali West, announced in April 2025, is one. New towers of fifty and sixty storeys are appearing where five storey buildings stood.",
          "For a buyer this is the single most important thing to understand about a Borivali building. A flat in a society genuinely close to redevelopment is a different purchase from one in a society that has been \"going next year\" for a decade, and the price should be different too. We have watched these societies for thirty years, and we tell you plainly which stage yours is at.",
        ],
        invite: {
          hook: "Looking at a flat in a building that is \"going into redevelopment\"? Send us the building's name. We will tell you what stage it is genuinely at, free, usually the same day.",
          button: "Check a building",
          message: "Hi Shree Giriraj, I am looking at a flat in ___ society in Borivali. Can you tell me where its redevelopment really stands?",
        },
      },
      {
        heading: "What we check before you buy here",
        body: [
          "Water timing on the upper floors, because every building has water and not every building has pressure at the top at seven in the morning. The parking the society will actually allot, in writing. The society's no objection, lined up before a price is agreed. The conveyance position, especially in an older building, because it decides how smoothly redevelopment will go. And carpet area measured as RERA defines it, since loading in older Borivali buildings runs higher than the brochure suggests.",
          "Stamp duty here is 6 percent for a male buyer and 5 percent for a woman buying in her sole name, with registration at 1 percent capped at 30,000 rupees, all on the higher of the price and the ready reckoner value. We put those numbers in rupees in front of you before you commit, so nothing about the cost of buying in Borivali is a surprise at the sub registrar's desk.",
        ],
      },
      {
        heading: "Renting in Borivali",
        body: [
          "Borivali is a family rental market more than a bachelor one, and the societies here are particular about registering tenants, which we settle before your first visit. On asking rents read in 2026, a 1 BHK runs roughly 22,000 to 40,000 rupees a month, a 2 BHK 35,000 to 65,000 and a 3 BHK 55,000 to a lakh, with the pocket and the building's age setting where in the range you land.",
          "Deposits are two to three months' rent in the newer societies and more in some older buildings. Gross rental yields in Borivali West sit around 2.65 percent on Square Yards' mid 2026 figures, which is typical of an owner occupier suburb: people buy here to live, and the rent is steady rather than spectacular. For a landlord that means a tenant who stays.",
        ],
        invite: {
          hook: "If you are renting, the society's answer matters more than the listing. Tell us the budget and the move in date, and we will show you only the buildings that will register you.",
          button: "Find a flat that will take me",
          message: "Hi Shree Giriraj, I am looking to rent in Borivali from ___ with a budget of about ___. Can you help?",
        },
      },
    ],
    faqs: [
      {
        q: "Is Borivali West or East better to live in?",
        a: "They suit different people. West is denser, closer to the shopping and the older societies, and better served by Metro Line 2A. East is greener and quieter, with the national park, the highway and most of the large new projects, and Metro Line 7. Inside each side the pocket matters more than the side.",
      },
      {
        q: "What is a realistic budget for a 2 BHK in Borivali?",
        a: "Asking rates in mid 2026 ran around 25,000 to 31,000 rupees per square foot in most West pockets and 25,000 to 35,000 in the East, with older buildings below and new towers above. The range within one pocket is wide enough that we would rather quote you the current figure for the specific building than a suburb average.",
      },
      {
        q: "How far is Borivali from Andheri and the airport?",
        a: "About 23 minutes to Andheri by local train, and roughly 12 kilometres by road from Borivali East to the airport along the Western Express Highway. Metro Line 7's airport extension is due in December 2026.",
      },
      {
        q: "Is Borivali good for investment?",
        a: "It is an owner occupier suburb, so rents are steady and gross yields modest, around 2.65 percent in the West on mid 2026 figures. The investment case here is the building and the pocket rather than the headline yield, and redevelopment stage changes what a flat is worth. We do that arithmetic on the actual flat before you decide.",
      },
      {
        q: "Which are the well known schools and hospitals in Borivali?",
        a: "St. Francis D'Assisi High School at Mount Poinsur, founded in 1908, is one of the largest in the state; St. Francis Institute of Technology is in I.C. Colony; Don Bosco, Rustomjee Cambridge and Ryan also have Borivali campuses. Hospitals include the BMC's Bhagwati Hospital in the West, being rebuilt to more than 370 beds, Karuna Hospital in Jeevan Bima Nagar and Apex Hospital on Chandavarkar Road.",
      },
    ],
    sources: [
      { label: "Wikipedia, Borivali: the villages, the name and the population mix", url: "https://en.wikipedia.org/wiki/Borivali" },
      { label: "Wikipedia, Borivali railway station: platforms, terminus status and daily footfall", url: "https://en.wikipedia.org/wiki/Borivali_railway_station" },
      { label: "Free Press Journal, 17 July 2026, on the station's redevelopment plan", url: "https://www.freepressjournal.in/fpj-shorts/borivali-railway-station-set-for-massive-redevelopment-as-peak-hour-passenger-traffic-to-rise-fourfold-2" },
      { label: "Wikipedia, Mumbai Metro Line 2A and Line 7: stations and opening dates", url: "https://en.wikipedia.org/wiki/Line_2A_(Mumbai_Metro)" },
      { label: "Wikipedia, Sanjay Gandhi National Park: area, visitors, Kanheri caves", url: "https://en.wikipedia.org/wiki/Sanjay_Gandhi_National_Park" },
      { label: "Free Press Journal, 1 May 2026, on the park's morning walkers", url: "https://www.freepressjournal.in/mumbai/sgnps-10000-annual-morning-walk-fee-sparks-outrage-among-borivali-residents-regular-visitors" },
      { label: "Wikipedia, Our Lady of Immaculate Conception Church, Borivali", url: "https://en.wikipedia.org/wiki/Our_Lady_of_Immaculate_Conception_Church,_Borivali" },
      { label: "NoBroker, property rates in Borivali West by pocket, 25 May 2026", url: "https://www.nobroker.in/blog/property-rates-in-borivali-west" },
      { label: "Square Yards, Borivali East property rates, June 2026", url: "https://www.squareyards.com/property-rates/borivali-east-mumbai" },
      { label: "Square Yards, Borivali West property rates, June 2026", url: "https://www.squareyards.com/property-rates/borivali-west-mumbai" },
      { label: "Construction World, 9 April 2025, Arkade's Shreepal Nagar cluster redevelopment", url: "https://www.constructionworld.in/latest-construction-news/real-estate-news/arkade-secures-rs-8.65-bn-cluster-redevelopment-project-in-borivali/71720" },
      { label: "The Tribune, 17 June 2025, Madhumilan Society redevelopment", url: "https://www.tribuneindia.com/news/business/redevelopment-of-borivalis-madhumilan-society-in-limbo-senior-citizen-demands-gbr" },
      { label: "Free Press Journal, 3 October 2025, Bhagwati Hospital redevelopment", url: "https://www.freepressjournal.in/mumbai/mumbai-500-crore-bhagwati-hospital-in-borivali-to-open-by-december-after-delays" },
    ],
  },

  kandivali: {
    longName: "Kandivali",
    metaTitle: "Kandivali property guide: Mahavir Nagar, Charkop, Thakur Village and the new launches",
    metaDescription:
      "Kandivali West and East, pocket by pocket: Mahavir Nagar, Charkop's sectors, Dahanukarwadi, Thakur Village, Lokhandwala and Akurli Road, with 2026 asking rates, the two metro lines, and how to buy a new launch here well.",
    hero: {
      src: "/areas/kandivali-aerial.jpg",
      alt: "An aerial panorama of Mumbai with towers rising among dense residential blocks",
    },
    figuresAsOf: "mid 2026",
    answer:
      "Kandivali has the widest choice of new homes in this belt and two sides that feel like different suburbs. The West is the older, busier, more Gujarati and Maharashtrian market of Mahavir Nagar, Charkop and the station lanes, at asking rates around 25,000 to 27,000 rupees per square foot in mid 2026. The East is Thakur Village, Lokhandwala and the new Akurli Road towers along the national park, around 31,000. In a tall tower here the floor you choose moves the price more than the carpet area does.",
    intro: [
      "Kandivali is where most of the new launch activity in our patch sits, and it is also home to some of the most settled family pockets in the western suburbs. We have worked both sides of the tracks since 1996. What follows is the shape of the place as we know it, with the figures dated.",
      "The name comes from an old word for mangroves, and the mangroves are still there at the edge of Charkop. The rest of Kandivali has grown from villages and a MHADA layout into a suburb of a few lakh people, a railway station that opened in 1907, and two metro lines that arrived in 2022.",
    ],
    sections: [
      {
        heading: "The lie of the land",
        body: [
          "Kandivali sits between Malad to the south and Borivali to the north, in the BMC's R South ward. The Western Railway divides it. The West runs from the station past S.V. Road to New Link Road and on to the Charkop sectors and the creek. The East runs from the station to the Western Express Highway and beyond it to the edge of Sanjay Gandhi National Park, where Thakur Village and Lokhandwala Township sit against the forest.",
          "It began as Khandolee, a group of settlements including Kandol village, the four hundred year old Bunder Pakhadi Koliwada and Charkop, home to East Indians, Bhandaris and Kolis. Today it is Maharashtrian and Gujarati in the main, with every other community Mumbai has, and it has the reputation of a suburb where families settle and stay.",
        ],
      },
      {
        heading: "Kandivali West, pocket by pocket",
        body: [
          "Mahavir Nagar is the West's best known address: a largely Gujarati pocket between Kandivali West and Borivali West, about 450 metres from the Kandivali West metro station, with the MCA's Sachin Tendulkar Gymkhana and Kamla Vihar Sports Club, good schools, and a vegetarian Khau Galli that spreads across several lanes and draws people from across the suburbs in the evening. Its towers include Chandak Harmony and Bharat Asbury Park, and its asking rate, around 36,450 rupees per square foot on Square Yards' 2026 micro market figures, is the highest in the West.",
          "Charkop is the West's other great pocket and its most distinctive. In 1986 MHADA drained the marsh and laid out a sites and services scheme: sectors cut by twelve metre roads and six metre lanes, courtyard plots of thirty five households each, and ground floor structures that owners have added to for forty years. Addresses still read Sector 8, RSC 1, Plot 33. Sectors 1 to 9 are Maharashtrian first and Gujarati second, mostly middle class, with mangroves at the Sector 8 edge. The Chhatrapati Shivaji Raje Complex, 53 societies and about 3,488 families in small MHADA flats, is heading for cluster redevelopment that would roughly triple each owner's carpet area. Charkop sectors ask around 23,000 to 26,000 rupees per square foot.",
          "Dahanukarwadi has its own Metro 2A station on New Link Road and asks around 27,750. M.G. Road and Bhagat Colony, off the station, are the old commercial heart, with the Kala Hanuman temple and the lanes where Jaswanti Jewel by Ashray is rising: a single tower of 2 to 5 BHK flats near the New Link Road and the Dahanukarwadi metro. Poisar has one of BEST's oldest depots, the Poinsur Gymkhana on forty thousand square metres, and the church opposite. Shankar Lane, Kamla Nagar and Sai Baba Nagar fill in between.",
        ],
        image: {
          src: "/areas/kandivali-green.jpg",
          alt: "Residential buildings among dense green trees under a blue sky",
          caption: "Kandivali's older societies sit among mature trees. The floor, the society and the lane set the price more than the suburb does.",
        },
        invite: {
          hook: "Mahavir Nagar and Charkop are twenty minutes apart and a third apart in price. If you are choosing between a smaller flat in one and a larger one in the other, that is exactly the conversation we have every week.",
          button: "Talk through the West",
          message: "Hi Shree Giriraj, I am looking at Kandivali West with a budget of about ___. Which pockets should I be seeing?",
        },
      },
      {
        heading: "Kandivali East",
        body: [
          "The East is a planned suburb in a way the West is not. The Thakur Group began building here in the early 1980s and Thakur Complex and Thakur Village grew on both sides of the highway with their own schools, colleges, hospitals, a cinema, a bus depot, a fire station and a police station. Thakur Village today is about 50,000 people over two square kilometres, famous for its wide internal roads, its evening walkers and its towers, Thakur Jewel, Ekta Meadows and Gokul Gagan among them. Thakur College of Science and Commerce has been here since 1992. Asking rates run around 33,000 rupees per square foot.",
          "Lokhandwala Township on Akurli Road is a gated enclave against the national park, mixed in every way Mumbai can be, with the Lokhandwala Foundation School at its centre and Whispering Palms, about a thousand flats across 27 acres, as its largest complex. It is the East's premium address at around 43,700 rupees per square foot on HomeBazaar's May 2026 figures.",
          "Akurli Road is where the new Kandivali is being built. Mahindra's 63 acre plant has been here since 1948, and on land beside it Mahindra Lifespaces launched Mahindra Vista, with 599 units in its second phase in February 2025 and a further fifteen acre parcel announced in June 2026. Godrej Reserve, about 18.5 acres and six towers, is across the road, with Kalpataru and Lodha projects nearby. Growel's 101 mall sits at the highway end. Samata Nagar, a 1970s MHADA township, and Ashok Nagar, where nine societies signed a cluster redevelopment with Arkade in May 2026, are the established pockets between.",
          "Square Yards put the East's average asking rate at 30,950 rupees per square foot in September 2026, up from 29,350 a year before, with ready to move stock closer to 25,600 and under construction around 29,100. Rents average about 100 rupees per square foot and the gross yield about 3.2 percent.",
        ],
        image: {
          src: "/areas/kandivali-towers.jpg",
          alt: "An aerial view of Mumbai's urban landscape with high rise towers and residential areas",
          caption: "Kandivali East from above: planned townships against the national park, and the new towers of Akurli Road.",
        },
      },
      {
        heading: "Getting around",
        body: [
          "Kandivali station is a slow train stop on the Western line, which is the one thing to know before you fall for a flat here: fast trains do not halt, though Borivali's terminus is one stop north. Andheri is about twelve minutes by slow local. Regulars know the unscheduled pause between Kandivali and Borivali as Thambevali, a phantom station where trains wait for the signal.",
          "The metro is what has changed the suburb. Metro Line 2A runs along New Link Road with stations at Kandivali West and Dahanukarwadi, both open since April 2022, and joins Line 1 at Andheri West. Metro Line 7 runs along the Western Express Highway with stations at Poisar and Akurli in Kandivali East, and its airport extension is due in December 2026. Both run at eight minute peak frequency. The airport is about 16 kilometres from either side by road.",
          "Three roads carry the suburb: the Western Express Highway on the east, S.V. Road through the middle, and New Link Road on the west, with Akurli Road and the East West flyover joining them. Peak hour S.V. Road and Link Road are slow, and Akurli Road has had heavy vehicles barred since February 2026 after residents pressed the point.",
        ],
      },
      {
        heading: "Green, shopping and daily life",
        body: [
          "Sanjay Gandhi National Park forms the East's boundary, and Thakur Village and Lokhandwala back straight onto it. The Poisar river rises inside the park and runs seven kilometres to the creek through Kandivali; it is an urban stream today, and the BMC's cleanup works and flood wall are underway along it. Charkop's 136 hectares of mangroves are the West's flood barrier and its bird life.",
          "Growel's 101 on Akurli Road is the East's mall, with a PVR and more than a hundred brands. Raghuleela Mega Mall behind Poisar depot is the West's, 800 shops and an INOX since 2009. Schools include Thakur Public School, Children's Academy and Ryan in Thakur Complex, Lokhandwala Foundation School, and Kapol Vidyanidhi in Mahavir Nagar. Hospitals include the BMC's Shatabdi Hospital in the West, about to be rebuilt as a 325 bed super speciality hospital, Namaha Hospital on S.V. Road, and a cluster of private hospitals in Thakur Village.",
        ],
      },
      {
        heading: "Buying a new launch here, well",
        body: [
          "Kandivali is where most of our new project bookings happen, and new build buying is a different exercise from resale. You are buying a drawing and a promise. The drawing is checked against the sanctioned plan, the promise against the MahaRERA registration, which carries the declared possession date and is public, and the price is judged floor by floor. In a tall tower the floor band moves the price more than the carpet area does, so we show you the view from your floor, not the sample flat's.",
          "Since 2017 every project of this size has to be registered before it is sold, seventy percent of what buyers pay has to sit in that project's own construction account, carpet area has one legal meaning, and structural defects are the developer's to fix for five years after possession. We use every one of those before you book, and we deal with a small number of developers directly, which is what gets our clients into a launch early with the current price sheet.",
        ],
        invite: {
          hook: "Comparing two launches on brochure price? The floor, the payment plan and the possession date on the RERA page change the real number. Send us the two project names and we will do the comparison, free.",
          button: "Compare two launches",
          message: "Hi Shree Giriraj, I am comparing new launches in Kandivali: ___ and ___. Can you help me judge them?",
        },
      },
      {
        heading: "Renting in Kandivali",
        body: [
          "The West rents to families and to young professionals working along the metro; the East rents strongly to families who want Thakur Village's roads and schools. On 2026 asking rents, a 1 BHK in the West runs about 18,000 to 35,000 rupees a month, a 2 BHK 35,000 to 65,000 and a 3 BHK 60,000 to 95,000; a 2 BHK in Thakur Village asks around 35,000 to 50,000. Gross yields are around 3.9 percent in the West and 3.2 percent in the East on Square Yards' figures, among the better in this belt.",
          "Deposits are two to three months' rent in the newer societies. We settle the society's answer, the owner's identity and the going deposit before your first visit, and register the leave and licence agreement as part of every tenancy.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Kandivali West or East better?",
        a: "The West is older, busier and better for somebody who wants the station lanes, Mahavir Nagar's food and a Gujarati or Maharashtrian neighbourhood at a lower rate. The East is planned, greener and pricier, with Thakur Village, Lokhandwala and the new Akurli Road towers against the national park. Both have a metro line.",
      },
      {
        q: "Is Kandivali good for a first home?",
        a: "It has the widest spread of new stock in this belt, which gives a first time buyer the most to compare, and settled older pockets like Charkop at lower rates. New build buying carries different checks from resale, mostly around the MahaRERA registration and what is committed in writing, and we do them with you.",
      },
      {
        q: "What does property cost in Kandivali?",
        a: "Asking rates in mid 2026 averaged around 25,000 to 27,000 rupees per square foot in the West and about 31,000 in the East, with Charkop near 23,000 to 26,000, Mahavir Nagar around 36,000 and Lokhandwala above 43,000. Asking is not the registered price; the East's government registration rate was about 21,300.",
      },
      {
        q: "Does Kandivali have a metro?",
        a: "Two. Metro Line 2A along New Link Road stops at Kandivali West and Dahanukarwadi, and Metro Line 7 along the highway stops at Poisar and Akurli in the East. Both opened in April 2022 and connect to Line 1 for Andheri and the airport route.",
      },
      {
        q: "Does the floor make much difference to price in a new tower?",
        a: "Yes, often more than a small difference in carpet area does. Higher floors carry a floor rise and a different view and light. We show you what your specific floor looks out on rather than the sample flat, and read the RERA registration with you before you book.",
      },
    ],
    sources: [
      { label: "Wikipedia, Kandivali: origins, name, pockets and roads", url: "https://en.wikipedia.org/wiki/Kandivali" },
      { label: "Wikipedia, Kandivli railway station, opened 1907", url: "https://en.wikipedia.org/wiki/Kandivli_railway_station" },
      { label: "Wikipedia, Mahavir Nagar", url: "https://en.wikipedia.org/wiki/Mahavir_Nagar" },
      { label: "Charkop sites and services scheme, 1986, MHADA layout", url: "https://www.slideshare.net/slideshow/charkop-sector-1-sites-services-scheme-1/33065368" },
      { label: "Dwello, Chhatrapati Shivaji Raje Complex cluster redevelopment", url: "https://dwello.in/news/kandivalis-big-upgrade-53-residential-societies-eye-cluster-redevelopment-plans" },
      { label: "Thakur Group, about the company and Thakur Village", url: "https://www.thakurgroupofcos.com/about/index.html" },
      { label: "Wikipedia, Yellow Line (Metro 2A) stations and dates", url: "https://en.wikipedia.org/wiki/Yellow_Line_(Mumbai_Metro)" },
      { label: "Wikipedia, Line 7 (Mumbai Metro) stations and dates", url: "https://en.wikipedia.org/wiki/Line_7_(Mumbai_Metro)" },
      { label: "Square Yards, Kandivali West property rates, 2026", url: "https://www.squareyards.com/property-rates/kandivali-west-mumbai" },
      { label: "Square Yards, Kandivali East property rates, September 2026", url: "https://www.squareyards.com/property-rates/kandivali-east-mumbai" },
      { label: "HomeBazaar, property rates in Kandivali by pocket, 28 May 2026", url: "https://www.homebazaar.com/knowledge/latest-property-rates-in-kandivali/" },
      { label: "NoBroker, Kandivali West locality report, rents", url: "https://www.nobroker.in/locality-iq/kandivali-west-mumbai-liqlt" },
      { label: "Business Standard, 13 February 2025, Mahindra Vista phase 2 launch", url: "https://www.business-standard.com/content/press-releases-ani/mahindra-lifespaces-announces-phase-2-launch-of-mahindra-vista-in-kandivali-east-125021300912_1.html" },
      { label: "Realty and More, 27 May 2026, Arkade's Ashok Nagar cluster redevelopment", url: "https://realtynmore.com/arkade-developers-secure-project-in-kandivali-east/" },
      { label: "Mumbai Live, 16 September 2026, Shatabdi Hospital rebuild", url: "https://www.mumbailive.com/en/health/kandivali-shatabdi-hospital-will-be-a-super-speciality-60319" },
    ],
  },

  malad: {
    longName: "Malad",
    metaTitle: "Malad property guide: Mindspace, Orlem, Evershine Nagar, Malad East and the beaches",
    metaDescription:
      "Malad West and East, pocket by pocket: Mindspace, Evershine Nagar, Orlem, Marve Road, Rani Sati Marg, Kurar and Dindoshi, with 2026 asking rates and rents, the metro, the coastal road plans, and who really rents here.",
    hero: {
      src: "/areas/malad-towers.jpg",
      alt: "Modern high rise towers in Mumbai seen from a railway platform with greenery in the foreground",
    },
    figuresAsOf: "September 2026",
    answer:
      "Malad has more investor money in it than Borivali or Kandivali, and one reason: the Mindspace office district in Malad West keeps a large, steady population of renters within fifteen minutes of their desks. Asking rates in 2026 ran around 29,000 to 30,800 rupees per square foot in the West and 27,000 to 30,400 in the East, with a 2 BHK renting for roughly 45,000 to 82,000 a month. The suburb also has Mumbai's beaches, an East Indian village heart in Orlem, and two metro lines. Buy the pocket and the tenant, not the yield on the brochure.",
    intro: [
      "Malad is the most investor driven of the three suburbs we work in. That is not a warning, it is a different market: you are more often buying alongside people who will never live in the flat, and that shows in how quickly good stock moves and how the price is set. We have worked it since 1996, and the tenant profile is the thing we know best here.",
      "It is also a suburb of genuine variety. Within a few kilometres are an office district, a four hundred year old fishing village, Catholic parishes, a Monday market, mangroves, two beaches and a fort. The Western line divides it, the creek bounds it on the west and the national park on the east.",
    ],
    sections: [
      {
        heading: "The lie of the land",
        body: [
          "Malad sits in the BMC's P North ward, between Goregaon to the south and Kandivali to the north. The railway divides it into Malad West, PIN 400064, which stretches from the station past S.V. Road and Link Road to Mindspace and on down Marve Road to the creek, the beaches and Madh Island, and Malad East, PIN 400097, which climbs from the station to the Western Express Highway and Dindoshi at the park's edge.",
          "Marathi and Marwadi families are the largest communities, with a deep East Indian and Koli presence in Orlem, Marve and the coastal villages, and a large young professional population brought by the offices. Malad Creek to the west, fed by the Oshiwara river, still carries about 400 acres of mangroves.",
        ],
      },
      {
        heading: "Malad West: Mindspace and the Link Road belt",
        body: [
          "Mindspace is the reason Malad rents. Paradigm Mindspace Malad on the Goregaon Malad Link Road has been operating since 2004: two buildings on 4.2 acres, about 0.8 million square feet of leasable space, tenants including JP Morgan, Tech Mahindra, Concentrix and Firstsource, and 98.6 percent committed occupancy on the REIT's own figures. Intelenet, one of India's largest business process firms, is headquartered here. Inorbit Mall, open since 2004, and Infiniti Mall, since 2011, sit beside it. The Chincholi Bunder food strip serves the shifts: dosas from six in the morning to three at night, Irani chai till half past one.",
          "Evershine Nagar is the premium residential pocket that grew up next to the offices: complexes like Lodha Raj Infinia, Narang Vivenda and Arkade Eden, close to New Link Road and the Malad West metro station, asking around 32,000 rupees per square foot, with a 737 square foot flat renting for about 35,000 to 55,000 a month. Kanchpada, Liberty Garden, Sunder Nagar on S.V. Road and Ekta Nagar around the metro station are the settled middle of the West, and the Link Road corridor carries the large newer complexes: Auris Serenity, Marina Enclave, Sheth Irene.",
        ],
        image: {
          src: "/areas/malad-towers.jpg",
          alt: "Modern high rise towers in Mumbai seen across greenery from a railway platform",
          caption: "The Link Road belt in Malad West: towers within fifteen minutes of the Mindspace offices.",
        },
        invite: {
          hook: "Buying to let near Mindspace? The tenant is usually a specific kind of person, and the rent they pay is a specific number. Tell us the building and we will tell you who rents there and at what, before you commit.",
          button: "Ask who rents here",
          message: "Hi Shree Giriraj, I am looking at a flat to let out in Malad West, near ___. Who is the realistic tenant and what would it rent for?",
        },
      },
      {
        heading: "Malad West: Orlem, Marve Road and the coast",
        body: [
          "Orlem branches off Marve Road and was once Valnai, the village on the curving path. It is Malad's East Indian heart: Our Lady of Lourdes began as a private chapel in 1880 for a hamlet of a dozen families, became a parish in 1916, and was called the largest parish in the Archdiocese of Bombay in a 2004 census. More than 15,000 people attend its Christmas midnight mass, and the lanes glow with stars and cribs. St. Anne's High School has been here since 1916. Orlem is a hockey and football neighbourhood, and in the 2000s it filled with young professionals from the call centres.",
          "Marve Road runs out past Jankalyan Nagar and Malwani to the coast. Aksa Beach is one of Mumbai's cleanest, with about 15,000 visitors on a weekend and swimming prohibited because of the currents; Marve is quieter, with the ferry across to Manori; Madh Island has a seventeenth century Portuguese fort under Air Force control, resorts and bungalows the film industry has used for decades, and a five minute ferry to Versova. The Madh to Versova bridge, 2,064 metres and 2,395 crore rupees, was cleared by the Bombay High Court in September 2026 and is targeted for 2029; it would turn a 21 kilometre drive into a few minutes.",
          "Chincholi Bunder is the oldest native settlement in Malad, a Koli fishing village dating to 1845, and Somwar Bazaar beside it fills with the weekly Monday market. Malwani carries the BMC and MHADA colonies, where MHADA is redeveloping a transit camp at Gaikwad Nagar into 856 tenements.",
        ],
        image: {
          src: "/areas/malad-beach.jpg",
          alt: "A quiet sunset over a beach in Mumbai with a purple sky and calm waves",
          caption: "Aksa and Marve at the end of Marve Road. The sea is for watching, not swimming.",
        },
      },
      {
        heading: "Malad East",
        body: [
          "The East is compact and climbing. Rani Sati Marg is the arterial from the station to the Western Express Highway, a Marwari commercial spine and, since the metro, a residential hotspot. Daftary Road and Pushpa Park are the older, denser pockets nearest the station, and Daftary Road is known for its traffic. Upper Govind Nagar, near the highway, is the East's more upscale pocket, mostly ready flats by local builders. Kurar Village has its own Metro Line 7 station and new 1 BHK towers.",
          "Dindoshi, about 2.5 square kilometres and 50,000 people at the park's edge, holds Infinity IT Park, the Borivali Division civil court and one of BEST's largest depots, with MHADA colonies and Raheja's complexes around it. Raheja Residency's Tower T, twenty storeys with its occupancy certificate in hand, is six hundred metres from the IT park. L&T, Kanakia and Kabra have newer projects along the highway side.",
          "Square Yards put the East's average asking rate at 30,400 rupees per square foot in 2026, with most sales between 25,000 and 34,000 and rents averaging 97 rupees per square foot. NoBroker's April 2026 range was 18,100 to 34,300 per square foot, with a 1 BHK renting for 25,000 to 50,000 and a 2 BHK 45,000 to 82,000. Two bedroom flats make up almost half of the East's rental listings.",
        ],
      },
      {
        heading: "Getting around",
        body: [
          "Malad station is a Western line stop between Goregaon and Kandivali, about fourteen minutes from Andheri. Metro Line 2A along New Link Road serves the West at Valnai Meeth Chowky, Malad West (now carrying Motilal Oswal's name), Lower Malad and Bangur Nagar on the Goregaon side, and joins Line 1 at Andheri West; the line carried more than two lakh passengers a day within months of opening. Metro Line 7 along the highway serves the East at Kurar and Dindoshi, and its airport extension is due in December 2026.",
          "By road, Mindspace is about fifteen kilometres from both airport terminals, and Malad West about twelve kilometres from BKC. Two projects will change the map: the Coastal Road North from Versova to Dahisar, 20 kilometres and 16,621 crore rupees, with tunnels between Mindspace and Charkop creek and a December 2028 target, and the Madh to Versova bridge for 2029. Both run through or beside Malad West, and both are why investors are watching the Link Road belt.",
        ],
        image: {
          src: "/areas/train.jpg",
          alt: "A Mumbai suburban train at a busy station platform",
          caption: "Malad station on the Western line, fourteen minutes from Andheri. Two metro lines now add to it.",
        },
      },
      {
        heading: "Who really rents here, and what that means for a landlord",
        body: [
          "The Mindspace workforce is large, young and on shifts, and it wants to live within a short auto ride of the office. That keeps vacancy low across the Link Road belt and makes Malad West one of the easier places in this belt to find a tenant quickly. Ruparel's 2026 analysis of 99acres data put gross yields at three to four percent, higher than Borivali's owner occupier market, and Square Yards showed rents averaging 93 rupees per square foot in the West.",
          "The number to plan on is the net one, after society charges, property tax, a month or two of vacancy at tenant changes and the deposit convention of two to three months. That is where a yield that looked like four percent on the brochure settles, and it is the arithmetic we do on the actual flat before you buy. Our rental yield calculator does the first pass; we do the second with the building's real outgoings.",
        ],
        invite: {
          hook: "The difference between a flat that rents in a week and one that sits for two months in Malad is usually the lane and the floor, not the price. Tell us what you are looking at and we will tell you which it is.",
          button: "Check a flat's rentability",
          message: "Hi Shree Giriraj, I am considering a flat in ___ in Malad as an investment. How quickly would it rent and to whom?",
        },
      },
      {
        heading: "What we check before you buy here",
        body: [
          "Older Malad West buildings deserve a plain answer on redevelopment status, because rates swing sharply between neighbouring streets and a society's stage changes the value. We check the title, the society's no objection, the conveyance position and the occupancy certificate before a price is agreed, measure carpet area as RERA defines it, and put stamp duty and registration in rupees in front of you: 6 percent for a male buyer, 5 percent for a woman in her sole name, registration at 1 percent capped at 30,000 rupees.",
          "For a landlord, we add the questions that matter to a tenant: water timing, parking, the society's rules on tenants and pets, and how far the walk is to the office or the metro, because those decide how fast the flat lets.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Malad a good rental investment?",
        a: "The Mindspace corridor keeps demand steady, so vacancy is usually not the problem, and gross yields of three to four percent on 2026 figures are among the better in this belt. The thing to check is who the realistic tenant is and what they will pay over three years, net of outgoings, rather than the first year's headline. We do that on the actual flat.",
      },
      {
        q: "Is Malad more expensive than Borivali?",
        a: "They overlap. Malad West asked around 29,000 to 30,800 rupees per square foot in 2026 and Borivali West around 30,000 to 31,300, with Malad East a little below both. The pocket and the building's age matter far more than the suburb name.",
      },
      {
        q: "What is Mindspace?",
        a: "An office district in Malad West on the Goregaon Malad Link Road. Paradigm Mindspace Malad, part of Mindspace Business Parks REIT, has about 0.8 million square feet leased to firms including JP Morgan, Tech Mahindra and Concentrix, with Inorbit and Infiniti malls beside it. Its workforce is the largest single source of tenants in Malad.",
      },
      {
        q: "Which are Malad's beaches, and can you swim?",
        a: "Aksa and Marve at the end of Marve Road, and Madh Island beyond the ferry. Aksa is among Mumbai's cleanest but swimming is prohibited because of strong currents; Marve has swift currents and sinking sand. They are for evenings and sunsets.",
      },
      {
        q: "How is Malad East different from Malad West?",
        a: "The East is smaller, denser near the station and newer along the highway, with Rani Sati Marg as its spine and Metro Line 7 at Kurar and Dindoshi. It is more Marwari in character and a little cheaper. The West has the offices, the malls, the beaches, Orlem and Metro Line 2A.",
      },
    ],
    sources: [
      { label: "Wikipedia, Malad: ward, pin codes and communities", url: "https://en.wikipedia.org/wiki/Malad" },
      { label: "Wikipedia, Orlem: origins, parish and community", url: "https://en.wikipedia.org/wiki/Orlem" },
      { label: "Our Lady of Lourdes Church, Orlem, parish history", url: "https://www.ourladyoflourdeschurchorlem.com/history" },
      { label: "Mindspace Business Parks REIT, Paradigm Mindspace Malad", url: "https://www.mindspacereit.com/portfolio/mumbai-paradigm-mindspace-malad" },
      { label: "Wikipedia, Inorbit Mall and Infiniti Mall", url: "https://en.wikipedia.org/wiki/Inorbit_Mall" },
      { label: "Wikipedia, Aksa Beach", url: "https://en.wikipedia.org/wiki/Aksa_Beach" },
      { label: "Free Press Journal, 9 September 2026, Bombay High Court clears the Madh Versova bridge", url: "https://www.freepressjournal.in/mumbai/versova-madh-island-bridge-bombay-hc-clears-way-21-km-journey-to-shrink-to-15-km" },
      { label: "Free Press Journal, Coastal Road North: route, cost and timeline", url: "https://www.freepressjournal.in/mumbai/mumbai-coastal-road-north-project-bmc-fast-tracks-vdblr-land-acquisition-work-to-begin-outside-crz-zones" },
      { label: "Wikipedia, Line 2A (Mumbai Metro) and Malad West metro station", url: "https://en.wikipedia.org/wiki/Malad_West_metro_station" },
      { label: "Square Yards, Malad West overview and rates, 9 September 2026", url: "https://www.squareyards.com/malad-west-in-mumbai-overview-924" },
      { label: "Square Yards, Malad East overview and rates, 2026", url: "https://www.squareyards.com/malad-east-in-mumbai-overview-892" },
      { label: "NoBroker, Malad East locality report, April 2026", url: "https://www.nobroker.in/locality-iq/malad-east-malad-mumbai-liqlt" },
      { label: "Ruparel, is Malad West still a good location to buy in 2026, citing 99acres data", url: "https://ruparel.in/blog/is-malad-west-still-a-good-location-to-buy-a-flat-in-2026-or-has-it-peaked" },
      { label: "Dwello, Evershine Nagar overview and rents", url: "https://dwello.in/locations/evershine-nagar-malad-west-mumbai-overview" },
      { label: "MHADA, Gaikwad Nagar Malvani transit camp redevelopment", url: "https://www.mhada.gov.in/en/node/1582" },
      { label: "LBB, Orlem church at Christmas", url: "https://lbb.in/mumbai/orlem-church-malad-9f3405/" },
    ],
  },
};

export const AREAS: AreaPage[] = AREA_PANELS.map((p: AreaPanel) => ({
  slug: p.slug,
  name: p.name,
  ...PAGES[p.slug],
}));

export const AREA_SLUGS = AREAS.map((a) => a.slug);

export function getArea(slug: string): AreaPage | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getAreaPanel(slug: string): AreaPanel | undefined {
  return AREA_PANELS.find((p) => p.slug === slug);
}

/**
 * A page with no outstanding input block is finished and may be indexed.
 * Anything still carrying one is served noindex, so a half written page can be
 * reviewed on a preview without competing for the query it is aimed at.
 */
export function areaIsComplete(a: AreaPage): boolean {
  return !a.sections.some(isInputBlock);
}
