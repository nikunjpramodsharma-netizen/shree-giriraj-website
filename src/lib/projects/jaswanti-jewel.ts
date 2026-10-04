/**
 * Jaswanti Jewel, the first project built to the project page plan
 * (plan/10-project-page-plan.md). Live at /projects/jaswanti-jewel since
 * 4 October 2026, approved by the owner, with the developer's permission to
 * use its images. Sizes 788, 795 and 1,055 sq ft kept at the owner's word.
 *
 * Every fact carries its source in a comment. Sources:
 *   BROCHURE  Ashray's printed brochure, scanned, shared by the owner 3 Oct 2026
 *   NOTES     the developer's WhatsApp notes and price list, shared 3 Oct 2026
 *   OWNER     confirmed by the owner in chat, 3 Oct 2026
 *   SITE      jaswantijewel.in, Ashray's own site, read 3 Oct 2026
 *   EC        Environmental Clearance EC22B038MH122204 and the SRA compliance
 *             report of June 2026, both published on jaswantijewel.in
 *
 * Images are the developer's own (web sized, from SITE, and crops of the
 * brochure scan) and stills from the sample flat video. They are placeholders
 * for the originals requested from Ashray.
 */

const IMG = "/projects/jaswanti-jewel";

export type Img = { src: string; alt: string; note?: string };

export const JJ = {
  slug: "jaswanti-jewel",
  name: "Jaswanti Jewel",
  // No developer name, company, address, map pin or contact anywhere on the
  // page (owner, 3 Oct 2026): every enquiry has to come to Shree Giriraj.
  // The MahaRERA number stays because the law requires it on project ads.
  locality: "Off M. G. Road, Kandivali West",
  rera: "P51800048817", // BROCHURE, SITE
  reraUrl: "https://maharera.maharashtra.gov.in",
  /** The neighbourhood, centred on the metro station: no pin on the plot. */
  mapEmbed: "https://www.google.com/maps?q=Dahanukarwadi+Metro+Station,+Kandivali+West,+Mumbai&z=15&output=embed",

  possession: {
    developer: "March 2027", // OWNER: handover within about six months
    rera: "December 2027", // OWNER; EC report Part A: planned completion 31.12.2027
    amenitiesReady: "March 2027", // OWNER: all amenities ready at possession
  },

  priceAsOf: "October 2026",
  startingPrice: "₹2.92 Cr", // NOTES
  heroLine: "A 37 storey tower off M. G. Road, with a club in the sky and possession from March 2027.",

  glance: [
    { value: 37, prefix: "G+", label: "storey single tower" }, // BROCHURE
    { value: 390, suffix: " ft", label: "club and sky deck above the street" }, // NOTES
    { text: "2, 3, 4, 5", label: "BHK, with Jodi homes" }, // BROCHURE
    { value: 3, label: "lifts on every floor" }, // BROCHURE floor plans: lift 1, 2, 3
    { text: "Mar 2027", label: "possession, developer's target" }, // OWNER
  ],

  /** DRAFT for the owner to correct: Shree Giriraj's own view. */
  view: {
    suits:
      "Families upgrading within Kandivali West who want a new tower, real amenities and the metro at the door, without waiting years for possession.",
    standsOut: [
      "Possession from March 2027, with every amenity ready at handover",
      "A club on the 37th floor and a rooftop infinity pool, 390 feet above the street",
      "Six foot balconies, three lifts per floor and an automated car parking tower",
      "Dahanukarwadi Metro a few minutes away",
    ],
    worthKnowing:
      "Jaswanti Jewel is the sale building of a slum rehabilitation scheme, with the residents rehoused in their own separate building on the plot. We walk you through the scheme's approvals and the MahaRERA record before you book.",
  },

  /** A day at Jaswanti Jewel: the pinned picture story. */
  story: [
    { img: { src: `${IMG}/tower-night.webp`, alt: "Jaswanti Jewel tower lit up at dusk", note: "Artist's impression" }, title: "Arrive home", text: "A single 37 storey tower off M. G. Road, reached along a landscaped pathway." },
    { img: { src: `${IMG}/project-hallmark.webp`, alt: "Double height arrival lobby with a grand piano", note: "Artist's impression" }, title: "A double height welcome", text: "A magnificent arrival lobby before the lifts take you up." },
    { img: { src: `${IMG}/jewel-gallery-6.webp`, alt: "Sample flat living room with a long sofa and full height curtains", note: "Sample flat, shot on location" }, title: "Your living room", text: "Well planned layouts with natural light, opening onto a six foot balcony." },
    { img: { src: `${IMG}/club-terrace.webp`, alt: "Club terrace bar with pergola and city views at dusk", note: "Artist's impression" }, title: "The club on the 37th floor", text: "A private club with a gym, yoga studio, spa, steam room and games arena." },
    { img: { src: `${IMG}/infinity-pool.webp`, alt: "Rooftop infinity pool looking over the Mumbai skyline", note: "Artist's impression" }, title: "Sunset from the rooftop", text: "An infinity pool and jacuzzi above the city, ready from March 2027." },
  ],

  amenityGroups: [
    {
      title: "The club, 37th floor",
      items: [
        { name: "Global styled gym", img: { src: `${IMG}/gym.webp`, alt: "Gym with treadmills and city windows", note: "Artist's impression" } },
        { name: "Yoga studio", img: { src: `${IMG}/yoga-meditation-zone.webp`, alt: "Yoga studio with mats and glass walls", note: "Artist's impression" } },
        { name: "Spa", img: { src: `${IMG}/spa.webp`, alt: "Spa treatment room in warm wood", note: "Artist's impression" } },
        { name: "Salon", img: { src: `${IMG}/salon.webp`, alt: "Salon chairs facing lit mirrors", note: "Artist's impression" } },
        { name: "AV room", img: { src: `${IMG}/av-room.webp`, alt: "Private theatre with recliner seats", note: "Artist's impression" } },
      ],
    },
    {
      title: "Sky life, rooftop",
      items: [
        { name: "Infinity pool", img: { src: `${IMG}/infinity-pool.webp`, alt: "Infinity pool over the skyline", note: "Artist's impression" } },
        { name: "Sky cafe", img: { src: `${IMG}/sky-cafe.webp`, alt: "Rooftop cafe counter with a day bed", note: "Artist's impression" } },
        { name: "Food and juice serving area", img: { src: `${IMG}/gourmet-serving-area.webp`, alt: "Dining tables beside the rooftop pool", note: "Artist's impression" } },
      ],
    },
    {
      title: "Ground level",
      items: [
        { name: "Multipurpose court", img: { src: `${IMG}/multipurpose-court.webp`, alt: "Netted multipurpose sports court", note: "Artist's impression" } },
        { name: "Arrival lobby", img: { src: `${IMG}/project-hallmark.webp`, alt: "Double height lobby", note: "Artist's impression" } },
      ],
    },
  ],
  alsoIncluded: ["Jacuzzi", "Steam room", "Games arena", "Zen garden", "Senior citizen area", "Open air theatre", "Landscaped pathway", "Automated car parking tower"], // BROCHURE

  sampleFlat: {
    video: `${IMG}/sample-flat-walkthrough.mp4`,
    poster: `${IMG}/walkthrough-poster.webp`,
    stills: [
      { src: `${IMG}/flat-balcony.webp`, alt: "Balcony with a wooden deck and green views", note: "Sample flat, shot on location" },
      { src: `${IMG}/flat-bedroom.webp`, alt: "Bedroom with a padded headboard", note: "Sample flat, shot on location" },
      { src: `${IMG}/flat-kitchen.webp`, alt: "Galley kitchen with a full height fridge", note: "Sample flat, shot on location" },
      { src: `${IMG}/flat-dresser.webp`, alt: "Marble topped dresser under a wall TV", note: "Sample flat, shot on location" },
    ] as Img[],
    gallery: [1, 2, 3, 4, 5, 7, 8, 9, 10].map((n) => ({
      src: `${IMG}/jewel-gallery-${n}.webp`,
      alt: "Sample flat interior",
      note: "Sample flat, shot on location" as const,
    })),
  },

  /** NOTES. Sizes 788, 795 and 1,055 sq ft are still to be confirmed as RERA carpet. */
  prices: [
    { config: "2 BHK", carpet: 766, floor: "1st floor", price: "₹2.92 Cr", status: "Available" },
    { config: "2 BHK", carpet: 788, floor: "26th floor", price: "₹3.36 Cr", status: "Available", confirm: true },
    { config: "2 BHK", carpet: 795, floor: "26th floor", price: "₹3.38 Cr", status: "Available", confirm: true },
    { config: "3 BHK", carpet: 1006, floor: "1st floor", price: "₹3.80 Cr", status: "Available" },
    { config: "3 BHK", carpet: 1055, floor: "28th floor", price: "₹4.48 Cr", status: "Available", confirm: true },
    { config: "4 and 5 BHK, Jodi", carpet: null, floor: "On request", price: "On request", status: "Ask us" },
  ],
  rates: {
    lower: "₹32,400 per sq ft on lower floors",
    upper: "₹36,000 per sq ft above the 20th floor",
    floorRise: "₹108 per sq ft for each floor from the 2nd floor",
  },

  floorPlans: [
    {
      key: "2-3",
      label: "2 and 3 BHK",
      img: { src: `${IMG}/plan-2-3-bhk.webp`, alt: "Typical floor plan with two 2 BHK and two 3 BHK homes", note: "Artist's impression" as const },
      units: [
        { name: "2 BHK, flat 1", carpet: "728.29 sq ft" },
        { name: "2 BHK, flat 4", carpet: "766.50 sq ft" },
        { name: "3 BHK, flats 2 and 3", carpet: "1,006 sq ft" },
      ],
      rooms: ["Living room 19 ft x 10 to 11 ft", "6 ft wide balcony", "Bedrooms 12 to 13 ft x 10 ft", "Kitchen with dry balcony"],
    },
    {
      key: "4",
      label: "4 BHK",
      img: { src: `${IMG}/plan-4-bhk.webp`, alt: "Floor plan with two 4 BHK homes and a study", note: "Artist's impression" as const },
      units: [
        { name: "4 BHK, flat 1", carpet: "1,801.89 sq ft" },
        { name: "4 BHK, flat 2", carpet: "1,785 sq ft" },
      ],
      rooms: ["Living and dining 19 ft x 21 ft 5 in", "6 ft wide balcony", "Study room", "Walk in wardrobes"],
    },
    {
      key: "5",
      label: "5 BHK, Jodi",
      img: { src: `${IMG}/plan-5-bhk.webp`, alt: "Floor plan with two 5 BHK homes", note: "Artist's impression" as const },
      units: [{ name: "Areas", carpet: "To be confirmed with the developer" }],
      rooms: ["Living and dining 19 ft x 21 ft 5 in", "Two balconies", "Walk in wardrobe", "Five bedrooms"],
    },
  ],

  location: {
    times: [
      { place: "Dahanukarwadi Metro", min: 5 }, // NOTES (SITE says 3)
      { place: "Kandivali station", min: 12 }, // NOTES
      { place: "Western Express Highway", min: 15 }, // NOTES
      { place: "Mumbai airport", min: 25 }, // NOTES (SITE says 30)
    ],
    nearby: [
      { group: "Schools", items: ["Thakur International School", "Ryan International School", "Kapol Vidyanidhi International School", "Billabong High International School", "Witty International School"] },
      { group: "Hospitals", items: ["Lotus Multispeciality Hospital", "Oscar Hospital", "Namaha Healthcare", "Thunga Hospital"] },
      { group: "Shopping", items: ["Infiniti Mall", "Raghuleela Mall", "Inorbit Mall", "Growel's 101 Mall", "Oberoi Mall"] },
    ], // BROCHURE map page
  },

  progress: [
    { when: "August 2022", what: "Construction begins" }, // EC report
    { when: "March 2026", what: "29,284 of 29,490 sq m of construction complete" }, // EC report
    { when: "March 2027", what: "Developer's handover target, amenities ready" }, // OWNER
    { when: "December 2027", what: "MahaRERA possession date" }, // OWNER, EC report
  ],

  developerFacts: [
    { value: 30, suffix: "+", label: "years in Mumbai real estate" },
    { value: 14, suffix: " lakh+", label: "sq ft delivered" },
    { value: 1603, label: "families" },
  ], // BROCHURE (SITE says 17 lakh sq ft; to confirm)

  faqs: [
    { q: "What is the price of Jaswanti Jewel?", a: "2 BHK homes start from ₹2.92 Cr all inclusive on the 1st floor and 3 BHK homes from ₹3.80 Cr, as of October 2026. Base rates are ₹32,400 per sq ft on lower floors and ₹36,000 above the 20th, plus a floor rise of ₹108 per sq ft per floor from the 2nd." },
    { q: "When is possession?", a: "The developer is handing over from March 2027. The MahaRERA possession date is December 2027." },
    { q: "Will the amenities be ready at possession?", a: "Yes. The developer has confirmed that all amenities will be ready by March 2027, at handover." },
    { q: "What is the MahaRERA number?", a: "P51800048817. You can check the record on the MahaRERA website." },
    { q: "What configurations are available?", a: "2, 3, 4 and 5 BHK homes, with Jodi options that combine adjoining flats. 2 BHK carpet areas start at 728 sq ft and 3 BHK homes are 1,006 sq ft." },
    { q: "Is a payment plan available?", a: "Yes, the developer offers a flexible payment plan. Tell us what suits you and we will share the options." },
    { q: "How far is the metro?", a: "Dahanukarwadi Metro Station is about five minutes away, and Kandivali station about twelve." },
    { q: "Can I visit the sample flat?", a: "Yes. Message us on WhatsApp and we will arrange the visit and come with you." },
  ],
};
