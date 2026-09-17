import { AREA_PANELS, type AreaPanel } from "@/lib/homepage-content";
import type { AreaMapSpec } from "@/components/motion/LitMap";

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
  /** A motion scene rendered after this section. */
  scene?: "map" | "pockets" | "commute" | "landmarks" | "rents" | "redevelopment";
};

export type AreaSection = ProseSection | InputBlock;

export function isInputBlock(s: AreaSection): s is InputBlock {
  return (s as InputBlock).kind === NEEDS_INPUT;
}

/**
 * The motion data for an area page: the hero clip, the commute counters,
 * the metro line that draws itself, the pocket bars, the pocket scenes that
 * change on their own, the landmark strip and the rent bars. All figures are
 * the ones in the prose and sources below; the scenes show them moving.
 */
export type AreaMotion = {
  video: { src: string; poster: string };
  /** The schematic that lights up under "The lie of the land". */
  map: AreaMapSpec;
  commute: { value?: number; text?: string; prefix?: string; suffix?: string; label: string }[];
  metro: { label: string; stops: { name: string; here?: boolean }[] }[];
  pockets: { label: string; value: number; note?: string }[];
  pocketsNote: string;
  pocketScenes: { kicker?: string; title: string; text: string; image?: { src: string; alt: string; credit?: string } }[];
  landmarks: { kicker?: string; title: string; text: string; image?: { src: string; alt: string; credit?: string } }[];
  rents: { label: string; value: number; note: string }[];
  rentsNote: string;
};

export type AreaPage = {
  slug: string;
  name: string;
  motion: AreaMotion;
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
    motion: {
      video: { src: "/areas/video/borivali.mp4", poster: "/areas/video/borivali-poster.jpg" },
      map: {
        station: { label: "Borivali station", y: 330 },
        edges: { west: "creek", east: "forest" },
        metroWest: { label: "Metro Line 2A", stops: [{ label: "Mandapeshwar", y: 120 }, { label: "Eksar", y: 210 }, { label: "Borivali West", y: 330 }, { label: "Shimpoli", y: 470 }, { label: "Kandivali West", y: 585 }] },
        metroEast: { label: "Metro Line 7", stops: [{ label: "Ovaripada", y: 120 }, { label: "Rashtriya Udyan", y: 230 }, { label: "Devipada", y: 330 }, { label: "Magathane", y: 470 }, { label: "Poisar", y: 585 }] },
        pockets: [
          { label: "Chikoowadi", x: 300, y: 520, here: true },
          { label: "Shimpoli", x: 400, y: 470 },
          { label: "I.C. Colony", x: 320, y: 130 },
          { label: "Yogi Nagar", x: 300, y: 400 },
          { label: "Eksar", x: 330, y: 240 },
          { label: "Babhai Naka", x: 310, y: 268, muted: true },
          { label: "L.T. Road belt", x: 430, y: 235, muted: true },
          { label: "Gorai stretch", x: 125, y: 390, muted: true },
          { label: "Kulupwadi", x: 690, y: 170 },
          { label: "Rajendra Nagar", x: 640, y: 330 },
          { label: "Magathane", x: 700, y: 480 },
        ],
      },
      commute: [
        { value: 23, suffix: " min", label: "to Andheri by local" },
        { value: 12, suffix: " km", label: "to the airport by road" },
        { value: 2.87, decimals: 2, suffix: " lakh", label: "passengers a day at the station" } as never,
        { value: 10, label: "platforms at Borivali" },
      ],
      metro: [
        { label: "Metro Line 2A, west side", stops: [{ name: "Dahisar East" }, { name: "Mandapeshwar" }, { name: "Eksar" }, { name: "Borivali West", here: true }, { name: "Shimpoli" }, { name: "Kandivali West" }, { name: "Andheri West" }] },
        { label: "Metro Line 7, east side", stops: [{ name: "Dahisar East" }, { name: "Ovaripada" }, { name: "Rashtriya Udyan", here: true }, { name: "Devipada" }, { name: "Magathane" }, { name: "Poisar" }, { name: "Gundavali" }] },
      ],
      pockets: [
        { label: "Yogi Nagar", value: 30400, note: "27,000 to 33,800" },
        { label: "Shimpoli", value: 29000, note: "27,500 to 30,500" },
        { label: "Chikoowadi", value: 25500, note: "25,000 to 26,000" },
        { label: "I.C. Colony", value: 25250, note: "19,000 to 31,500, by building age" },
        { label: "Eksar Road", value: 19500, note: "13,000 to 26,000" },
        { label: "Gorai stretch", value: 17050, note: "10,900 to 23,200" },
      ],
      pocketsNote: "Midpoints of asking rate ranges per square foot, NoBroker, May 2026. Asking is not the registered price.",
      pocketScenes: [
        { kicker: "West · the shop's own pocket", title: "Chikoowadi", text: "Older cooperative societies alongside newer towers, near the Shimpoli metro and a little further from the station. Quiet, established, and the pocket we know best.", image: { src: "/premium/u/complex-04.jpg", alt: "A marble entrance hall with a chandelier and a curved stair" } },
        { kicker: "West · East Indian heart", title: "I.C. Colony", text: "A parish from 1547, Mount Poinsur, St. Francis school, the Mandapeshwar caves, and a Christmas market on Brother Cyprian Street. Prices vary more by building age here than anywhere in Borivali.", image: { src: "/premium/u/tower-11.jpg", alt: "A grand tower in a classical style against a dramatic sky" } },
        { kicker: "West · the station belt", title: "L.T. Road and Chandavarkar Road", text: "The old commercial heart: the municipal market, the shopping lanes, Veer Savarkar Udyan's 1.5 kilometre track, and a MHADA colony by the Borivali West metro.", image: { src: "/premium/metro-elevated.jpg", alt: "A modern train arriving on elevated tracks" } },
        { kicker: "East · against the forest", title: "Kulupwadi and Dattapada Road", text: "Ten minutes from the national park gate, Raheja Estate's societies, and Oberoi Sky City rising on 25 acres with possession declared for December 2027.", image: { src: "/premium/u/tower-01.jpg", alt: "The city skyline lit at night across still water" } },
      ],
      landmarks: [
        { kicker: "Borivali East", title: "Sanjay Gandhi National Park", text: "103.84 square kilometres, more than two million visitors a year, three to five thousand morning walkers, and the 109 Kanheri caves inside.", image: { src: "/premium/forest-mist.jpg", alt: "Dense green forest with mist over the hills" } },
        { kicker: "Borivali West", title: "Mandapeshwar caves", text: "A Shiva shrine cut from Buddhist viharas near Mount Poinsur, with the ruins of a 1544 Portuguese church above them.", image: { src: "/premium/cave-carvings.jpg", alt: "Ancient figures carved into a rock cut cave wall" } },
        { kicker: "Across the creek", title: "Gorai and the pagoda", text: "A ten to fifteen minute ferry from Gorai jetty to the village and the 99 metre Global Vipassana Pagoda, inaugurated in 2009.", image: { src: "/premium/pagoda-gold.jpg", alt: "The golden spire of the pagoda against a clear sky" } },
        { kicker: "Inside the park", title: "Kanheri caves", text: "109 caves cut into the basalt between the first and tenth centuries, a short drive in from the Borivali East gate.", image: { src: "/areas/borivali-sgnp.jpg", alt: "A path and old trees beside the rock cut caves in the national park" } },
      ],
      rents: [
        { label: "1 BHK", value: 31000, note: "22,000 to 40,000 a month" },
        { label: "2 BHK", value: 50000, note: "35,000 to 65,000" },
        { label: "3 BHK", value: 77500, note: "55,000 to 1 lakh" },
      ],
      rentsNote: "Midpoints of asking rents, NoBroker 2026. Deposits run two to three months in newer societies.",
    },
    figuresAsOf: "mid 2026",
    answer:
      "Borivali is two markets at one price. The station belt is older, denser and better connected; the Link Road side is newer and quieter. Asking rates in the West cluster around 30,000 to 31,300 rupees per square foot and in the East around 32,000 to 34,750, with a wide spread inside each by pocket and by the age of the building. Choose the pocket for how you actually live, and the building for how it is run, and Borivali is one of the most liveable addresses in the western suburbs.",
    intro: [
      "We have worked Borivali since 1996 and from the shop in Chikoowadi since 2005. What follows is the Borivali we actually walk, pocket by pocket, with every figure dated so you know how fresh it is. For a specific building, ask us. That is the part no page can do.",
    ],
    sections: [
      {
        heading: "The lie of the land",
        scene: "map",
        body: [
          "The Western Railway splits Borivali in two. The West runs from the station down to Gorai Creek along S.V. Road and Link Road, and holds the shopping, the older societies and most of the new towers. The East runs up to the highway and the gates of Sanjay Gandhi National Park, with more room and a quieter feel.",
        ],
      },
      {
        heading: "Borivali, pocket by pocket",
        scene: "pockets",
        body: [
          "The same budget buys a very different flat two lanes apart. In the West, Yogi Nagar and Shimpoli ask the most, Chikoowadi sits in the middle, and I.C. Colony swings with the age of the building. In the East, asking rates averaged about 34,750 rupees per square foot in June 2026, while older ready flats sat closer to 25,700, which is the number a family buying resale should plan on.",
        ],
        invite: {
          hook: "Two of these pockets trade at the same rate and behave completely differently for a family with a school run. Tell us your budget and we will tell you which two to see this month.",
          button: "Ask which pocket fits",
          message: "Hi Shree Giriraj, I am looking at Borivali. My budget is about ___ and I want to know which pocket fits us. Can you help?",
        },
      },
      {
        heading: "Getting around",
        scene: "commute",
        body: [
          "Borivali station is a terminus for slow and fast locals and the last city stop for long distance trains. Metro Line 2A serves the West along New Link Road and Line 7 serves the East along the highway, both every eight minutes at peak, with the airport extension of Line 7 due in December 2026.",
        ],
      },
      {
        heading: "Green, and why it matters to the price",
        scene: "landmarks",
        body: [
          "The national park is Borivali's back wall and the creek its front door. Buildings that back onto the park, and lanes within a walk of Veer Savarkar Udyan, hold their value across cycles because families choose them on purpose.",
        ],
      },
      {
        heading: "What we check before you buy here",
        body: [
          "Water pressure on the upper floors at seven in the morning. The parking the society will allot, in writing. The society's no objection before a price is agreed. Carpet area as RERA defines it. And in an older building, the stage its redevelopment has really reached, because that changes what the flat is worth. Stamp duty and registration go in front of you in rupees before you commit.",
        ],
        invite: {
          hook: "Looking at a flat in a building that is \"going into redevelopment\"? Send us the building's name. We will tell you what stage it is at, free, usually the same day.",
          button: "Check a building",
          message: "Hi Shree Giriraj, I am looking at a flat in ___ society in Borivali. Can you tell me where its redevelopment really stands?",
        },
      },
      {
        heading: "Renting in Borivali",
        scene: "rents",
        body: [
          "Borivali is a family rental market, and its societies are particular about registering tenants, which we settle before your first visit. Deposits are two to three months' rent in the newer societies. For a landlord, the rent is steady rather than spectacular, and the tenant usually stays.",
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
    motion: {
      video: { src: "/areas/video/kandivali.mp4", poster: "/areas/video/kandivali-poster.jpg" },
      map: {
        station: { label: "Kandivali station", y: 330 },
        edges: { west: "creek", east: "forest" },
        metroWest: { label: "Metro Line 2A", stops: [{ label: "Shimpoli", y: 120 }, { label: "Kandivali West", y: 330 }, { label: "Dahanukarwadi", y: 470 }, { label: "Valnai", y: 585 }] },
        metroEast: { label: "Metro Line 7", stops: [{ label: "Magathane", y: 120 }, { label: "Poisar", y: 230 }, { label: "Akurli", y: 330 }, { label: "Kurar", y: 470 }, { label: "Dindoshi", y: 585 }] },
        pockets: [
          { label: "Charkop sectors", x: 150, y: 230 },
          { label: "Dahanukarwadi", x: 320, y: 250 },
          { label: "Mahavir Nagar", x: 300, y: 420 },
          { label: "Link Road towers", x: 310, y: 545, muted: true },
          { label: "Poisar", x: 440, y: 470, muted: true },
          { label: "Thakur Village", x: 740, y: 170 },
          { label: "Samata Nagar", x: 640, y: 300 },
          { label: "Akurli Road", x: 620, y: 420, muted: true },
          { label: "Lokhandwala, East", x: 700, y: 520 },
        ],
      },
      commute: [
        { value: 12, suffix: " min", label: "to Andheri by slow local" },
        { value: 16, suffix: " km", label: "to the airport by road" },
        { value: 2, label: "metro lines, one each side" },
        { value: 1907, label: "the year the station opened" },
      ],
      metro: [
        { label: "Metro Line 2A, west side", stops: [{ name: "Borivali West" }, { name: "Shimpoli" }, { name: "Kandivali West", here: true }, { name: "Dahanukarwadi", here: true }, { name: "Valnai" }, { name: "Malad West" }, { name: "Andheri West" }] },
        { label: "Metro Line 7, east side", stops: [{ name: "Magathane" }, { name: "Poisar", here: true }, { name: "Akurli", here: true }, { name: "Kurar" }, { name: "Dindoshi" }, { name: "Aarey" }, { name: "Gundavali" }] },
      ],
      pockets: [
        { label: "Lokhandwala, East", value: 43700, note: "HomeBazaar, May 2026" },
        { label: "Mahavir Nagar, West", value: 36450, note: "Square Yards, 2026" },
        { label: "Thakur Village, East", value: 33050, note: "HomeBazaar, May 2026" },
        { label: "Samata Nagar, East", value: 29554, note: "HomeBazaar, May 2026" },
        { label: "Dahanukarwadi, West", value: 27750, note: "Square Yards, 2026" },
        { label: "Charkop sectors, West", value: 24750, note: "23,350 to 26,150, Square Yards" },
      ],
      pocketsNote: "Asking rates per square foot as reported, with the portal and month. Asking is not the registered price.",
      pocketScenes: [
        { kicker: "West · Gujarati heart", title: "Mahavir Nagar", text: "About 450 metres from the Kandivali West metro, the MCA gymkhana, good schools and a vegetarian Khau Galli across several lanes. The highest asking rate in the West.", image: { src: "/premium/metro-entrance.jpg", alt: "The concourse of a modern metro station" } },
        { kicker: "West · the MHADA grid", title: "Charkop", text: "Sectors cut by twelve metre roads and six metre lanes since 1986, mangroves at Sector 8, and a 53 society complex heading for cluster redevelopment that would triple each owner's carpet area.", image: { src: "/premium/mumbai-aerial-green.jpg", alt: "Towers of the western suburbs among trees, with the creek and mangroves beyond" } },
        { kicker: "East · against the forest", title: "Thakur Village and Lokhandwala", text: "Thakur Village is about 50,000 people over two square kilometres with wide internal roads and Thakur College since 1992. Lokhandwala Township beside it is the East's premium gated address.", image: { src: "/premium/u/tower-03.jpg", alt: "The city's towers glowing at night, seen from above" } },
        { kicker: "East · the new Kandivali", title: "Akurli Road", text: "Mahindra's plant since 1948, and beside it Mahindra Vista, Godrej Reserve on 18.5 acres, Kalpataru and Lodha, with Growel's 101 at the highway end.", image: { src: "/premium/u/tower-14.jpg", alt: "A large residential complex with its windows lit at night" } },
      ],
      landmarks: [
        { kicker: "Kandivali East", title: "Growel's 101", text: "The East's mall on Akurli Road off the highway, with a PVR and more than a hundred brands.", image: { src: "/premium/towers-night-aerial.jpg", alt: "Residential towers lit at night beside the glowing line of the highway" } },
        { kicker: "Kandivali West", title: "Raghuleela Mega Mall", text: "Behind Poisar depot since 2009: 800 shops and an INOX, the West's mall.", image: { src: "/premium/u/commercial-04.jpg", alt: "A bright modern office with rows of desks" } },
        { kicker: "Kandivali East", title: "The national park's edge", text: "Sanjay Gandhi National Park forms the East's boundary, and Thakur Village and Lokhandwala back straight onto it.", image: { src: "/premium/towers-dusk-aerial.jpg", alt: "Towers and societies rising out of dense green cover at dusk" } },
      ],
      rents: [
        { label: "1 BHK", value: 26500, note: "18,000 to 35,000 a month, West" },
        { label: "2 BHK", value: 50000, note: "35,000 to 65,000" },
        { label: "3 BHK", value: 77500, note: "60,000 to 95,000" },
      ],
      rentsNote: "Midpoints of asking rents, NoBroker 2026. Gross yields around 3.9 percent West and 3.2 percent East on Square Yards' figures.",
    },
    figuresAsOf: "mid 2026",
    answer:
      "Kandivali has the widest choice of new homes in this belt and two sides that feel like different suburbs. The West is the older, busier, more Gujarati and Maharashtrian market of Mahavir Nagar, Charkop and the station lanes, at asking rates around 25,000 to 27,000 rupees per square foot in mid 2026. The East is Thakur Village, Lokhandwala and the new Akurli Road towers along the national park, around 31,000. In a tall tower here the floor you choose moves the price more than the carpet area does.",
    intro: [
      "Kandivali is where most of the new launch activity in our patch sits, and it is also home to some of the most settled family pockets in the western suburbs. We have worked both sides of the tracks since 1996. What follows is the shape of the place as we know it, with the figures dated.",
    ],
    sections: [
      {
        heading: "The lie of the land",
        scene: "map",
        body: [
          "Kandivali sits between Malad and Borivali, divided by the railway. The West runs past S.V. Road and New Link Road to the Charkop sectors and the creek. The East runs to the highway and on to the edge of the national park, where Thakur Village and Lokhandwala Township sit against the forest.",
        ],
      },
      {
        heading: "Kandivali, pocket by pocket",
        scene: "pockets",
        body: [
          "Mahavir Nagar is the West's best known address and its highest asking rate, with the metro 450 metres away and a Khau Galli people cross suburbs for. Charkop's MHADA sectors cost about a third less. In the East, Thakur Village is the planned suburb with wide roads and its own schools, Lokhandwala is the premium gated address, and Akurli Road is where the new towers are rising.",
        ],
        invite: {
          hook: "Mahavir Nagar and Charkop are twenty minutes apart and a third apart in price. If you are choosing between a smaller flat in one and a larger one in the other, that is exactly the conversation we have every week.",
          button: "Talk through the pockets",
          message: "Hi Shree Giriraj, I am looking at Kandivali with a budget of about ___. Which pockets should I be seeing?",
        },
      },
      {
        heading: "Getting around",
        scene: "commute",
        body: [
          "Kandivali is a slow train stop, so fast locals do not halt here; Borivali's terminus is one stop north. The metro is what changed the suburb: Line 2A along New Link Road in the West, Line 7 along the highway in the East, both at eight minute peak frequency.",
        ],
      },
      {
        heading: "Green, shopping and daily life",
        scene: "landmarks",
        body: [
          "The national park forms the East's boundary and Charkop's mangroves the West's. Each side has its own mall, its own schools and its own hospitals, which is why families who settle in Kandivali tend to stay.",
        ],
      },
      {
        heading: "Buying a new launch here, well",
        body: [
          "Most of our new project bookings happen in Kandivali. We check the drawing against the sanctioned plan and the promise against the MahaRERA registration, which carries the declared possession date. In a tall tower the floor band moves the price more than the carpet area does, so we show you the view from your floor, not the sample flat's.",
        ],
        invite: {
          hook: "Comparing two launches on brochure price? The floor, the payment plan and the possession date on the RERA page change the real number. Send us the two project names and we will do the comparison, free.",
          button: "Compare two launches",
          message: "Hi Shree Giriraj, I am comparing new launches in Kandivali: ___ and ___. Can you help me judge them?",
        },
      },
      {
        heading: "Renting in Kandivali",
        scene: "rents",
        body: [
          "The West rents to families and to professionals working along the metro; the East rents to families who want Thakur Village's roads and schools. Deposits are two to three months' rent in the newer societies, and we settle the society's answer and register the leave and licence agreement as part of every tenancy.",
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
    motion: {
      video: { src: "/areas/video/malad.mp4", poster: "/areas/video/malad-poster.jpg" },
      map: {
        station: { label: "Malad station", y: 330 },
        edges: { west: "sea", east: "hills" },
        metroWest: { label: "Metro Line 2A", stops: [{ label: "Dahanukarwadi", y: 120 }, { label: "Valnai", y: 230 }, { label: "Malad West", y: 330 }, { label: "Lower Malad", y: 450 }, { label: "Bangur Nagar", y: 580 }] },
        metroEast: { label: "Metro Line 7", stops: [{ label: "Akurli", y: 120 }, { label: "Kurar", y: 230 }, { label: "Dindoshi", y: 400 }, { label: "Aarey", y: 560 }] },
        pockets: [
          { label: "Mindspace", x: 215, y: 250 },
          { label: "Link Road belt", x: 260, y: 340 },
          { label: "Evershine Nagar", x: 320, y: 460 },
          { label: "Orlem", x: 300, y: 140 },
          { label: "Marve Road", x: 130, y: 385, muted: true },
          { label: "Jankalyan Nagar", x: 135, y: 500, muted: true },
          { label: "Malad East", x: 630, y: 330 },
          { label: "Kurar", x: 700, y: 200, muted: true },
          { label: "Dindoshi", x: 720, y: 470 },
        ],
      },
      commute: [
        { value: 14, suffix: " min", label: "to Andheri by local" },
        { value: 15, suffix: " km", label: "from Mindspace to the airport" },
        { value: 12, suffix: " km", label: "from Malad West to BKC" },
        { value: 0.8, decimals: 1, suffix: " mn sq ft", label: "leased at Paradigm Mindspace" } as never,
      ],
      metro: [
        { label: "Metro Line 2A, west side", stops: [{ name: "Kandivali West" }, { name: "Dahanukarwadi" }, { name: "Valnai" , here: true }, { name: "Malad West", here: true }, { name: "Lower Malad", here: true }, { name: "Bangur Nagar" }, { name: "Andheri West" }] },
        { label: "Metro Line 7, east side", stops: [{ name: "Poisar" }, { name: "Akurli" }, { name: "Kurar", here: true }, { name: "Dindoshi", here: true }, { name: "Aarey" }, { name: "Goregaon East" }, { name: "Gundavali" }] },
      ],
      pockets: [
        { label: "Evershine Nagar, West", value: 32000, note: "Dwello, 2026" },
        { label: "Malad West average", value: 30800, note: "Square Yards, September 2026" },
        { label: "Malad East average", value: 30400, note: "Square Yards, 2026" },
        { label: "Dindoshi, East", value: 37500, note: "25,000 to 50,000, NoBroker" },
        { label: "Jankalyan Nagar, West", value: 14543, note: "10,666 to 23,846, NoBroker" },
      ],
      pocketsNote: "Asking rates per square foot as reported, with the portal and month. Asking is not the registered price.",
      pocketScenes: [
        { kicker: "West · the office district", title: "Mindspace and the Link Road belt", text: "Paradigm Mindspace since 2004: 0.8 million square feet leased to JP Morgan, Tech Mahindra and Concentrix at 98.6 percent occupancy, with Inorbit and Infiniti beside it. The workforce is Malad's largest source of tenants.", image: { src: "/premium/u/commercial-05.jpg", alt: "A minimalist showroom behind a full glass front" } },
        { kicker: "West · the premium pocket", title: "Evershine Nagar", text: "Lodha Raj Infinia, Narang Vivenda and Arkade Eden near New Link Road and the Malad West metro, asking around 32,000 rupees per square foot.", image: { src: "/premium/apartments-palms.jpg", alt: "An elegant residential building with balconies and palm trees" } },
        { kicker: "West · the village heart", title: "Orlem and Marve Road", text: "Once Valnai, the village on the curving path. The largest parish in the archdiocese by a 2004 census, St. Anne's since 1916, hockey and football, and 15,000 at the Christmas midnight mass.", image: { src: "/premium/highrise-clear.jpg", alt: "High rise towers on the skyline under a clear sky" } },
        { kicker: "East · at the park's edge", title: "Rani Sati Marg and Dindoshi", text: "The arterial from the station to the highway, now a metro hotspot, and Dindoshi's Infinity IT Park, civil court and one of BEST's largest depots.", image: { src: "/premium/u/commercial-06.jpg", alt: "A domed glass commercial building in landscaped grounds" } },
      ],
      landmarks: [
        { kicker: "Marve Road", title: "Aksa Beach", text: "One of Mumbai's cleanest, about 15,000 visitors on a weekend, INS Hamla at one end. For sunsets, not swimming.", image: { src: "/areas/malad-beach.jpg", alt: "A purple sunset over a quiet Mumbai beach" } },
        { kicker: "Madh Island", title: "Madh Fort and the Versova ferry", text: "A seventeenth century Portuguese watchtower under Air Force control, a five minute ferry to Versova, and a bridge cleared in September 2026 for 2029.", image: { src: "/premium/boats-harbour.jpg", alt: "Brightly painted fishing boats moored in a harbour under a blue sky" } },
        { kicker: "Marve Road", title: "Marve and Manori", text: "Marve is the quieter beach, with the ferry across the creek to Manori.", image: { src: "/premium/palms-shore.jpg", alt: "Surf running up a quiet beach lined with coconut palms" } },
      ],
      rents: [
        { label: "1 BHK", value: 37500, note: "25,000 to 50,000 a month, East" },
        { label: "2 BHK", value: 63500, note: "45,000 to 82,000, East" },
        { label: "3 BHK", value: 80000, note: "60,000 to 1 lakh, West" },
      ],
      rentsNote: "Midpoints of asking rents, NoBroker April 2026 and Broker Network July 2026. Yields reported at 3 to 4 percent gross.",
    },
    figuresAsOf: "September 2026",
    answer:
      "Malad has more investor money in it than Borivali or Kandivali, and one reason: the Mindspace office district in Malad West keeps a large, steady population of renters within fifteen minutes of their desks. Asking rates in 2026 ran around 29,000 to 30,800 rupees per square foot in the West and 27,000 to 30,400 in the East, with a 2 BHK renting for roughly 45,000 to 82,000 a month. The suburb also has Mumbai's beaches, an East Indian village heart in Orlem, and two metro lines. Buy the pocket and the tenant, not the yield on the brochure.",
    intro: [
      "Malad is the most investor driven of the three suburbs we work in. That is not a warning, it is a different market: you are more often buying alongside people who will never live in the flat, and that shows in how quickly good stock moves and how the price is set. We have worked it since 1996, and the tenant profile is the thing we know best here.",
    ],
    sections: [
      {
        heading: "The lie of the land",
        scene: "map",
        body: [
          "The railway divides Malad. The West stretches from the station past Link Road to Mindspace and on down Marve Road to the beaches and Madh Island. The East climbs from the station to the highway and Dindoshi at the park's edge.",
        ],
      },
      {
        heading: "Malad, pocket by pocket",
        scene: "pockets",
        body: [
          "Mindspace is the reason Malad rents: an office district at 98.6 percent occupancy on the REIT's own figures, whose workforce wants to live a short auto ride away. Evershine Nagar is the premium pocket beside it, the Link Road belt carries the large newer complexes, and in the East, Rani Sati Marg and Dindoshi have become metro hotspots.",
        ],
        invite: {
          hook: "Buying to let near Mindspace? The tenant is usually a specific kind of person, and the rent they pay is a specific number. Tell us the building and we will tell you who rents there and at what, before you commit.",
          button: "Ask who rents here",
          message: "Hi Shree Giriraj, I am looking at a flat to let out in Malad West, near ___. Who is the realistic tenant and what would it rent for?",
        },
      },
      {
        heading: "Orlem, Marve Road and the coast",
        scene: "landmarks",
        body: [
          "Orlem is Malad's East Indian heart, and Marve Road runs on past it to Aksa, Marve and Madh Island. The Madh to Versova bridge, cleared by the Bombay High Court in September 2026 and targeted for 2029, would turn a 21 kilometre drive into a few minutes.",
        ],
      },
      {
        heading: "Getting around",
        scene: "commute",
        body: [
          "Malad station is about fourteen minutes from Andheri. Metro Line 2A serves the West and Line 7 the East. The Coastal Road North, targeted for December 2028, and the Madh to Versova bridge both run through or beside Malad West, which is why investors are watching the Link Road belt.",
        ],
      },
      {
        heading: "Who really rents here, and what that means for a landlord",
        scene: "rents",
        body: [
          "Vacancy stays low across the Link Road belt, and gross yields of three to four percent on 2026 figures are among the better in this belt. The number to plan on is the net one, after society charges, property tax and a month of vacancy at tenant changes. Our rental yield calculator does the first pass; we do the second with the building's real outgoings.",
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
          "Title, the society's no objection, the conveyance position and the occupancy certificate, before a price is agreed. Carpet area as RERA defines it. Stamp duty and registration in rupees. And for a landlord, the things a tenant asks about: water timing, parking, the society's rules on tenants, and the walk to the office or the metro.",
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
