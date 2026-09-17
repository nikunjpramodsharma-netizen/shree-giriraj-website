/**
 * Photographs of the three suburbs, all from Wikimedia Commons under free
 * licences that ask for the photographer to be named. Each entry carries the
 * name, the licence and the page the file came from; the area pages list them
 * on the photo credits page, linked from the footer. Resized and recompressed, not otherwise altered.
 */
export type PhotoCredit = { src: string; artist: string; license: string; licenseUrl: string; page: string };

export const AREA_PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "bor-mount-poinsur": { src: "/areas/real/bor-mount-poinsur.jpg", artist: "Kartik Chandramouli", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Mandapeshwar_Sacromonte,_Watch_Tower_at_Mount_Poinsur_01.jpg" },
  "bor-station": { src: "/areas/real/bor-station.jpg", artist: "Gannu03", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Borivali_railwaystation_Mumbai_2024.jpg" },
  "bor-sgnp": { src: "/areas/real/bor-sgnp.jpg", artist: "Rana.p.s", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Sanjay_Gandhi_National_Park,_Mumbai.jpg" },
  "bor-mandapeshwar": { src: "/areas/real/bor-mandapeshwar.jpg", artist: "Kartik Chandramouli", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Mandapeshwar_Caves.jpg" },
  "bor-pagoda": { src: "/areas/real/bor-pagoda.jpg", artist: "Joe Ravi", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Global_Vipassana_Pagoda_1.jpg" },
  "bor-kanheri": { src: "/areas/real/bor-kanheri.jpg", artist: "Jawahar Soneji", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Kenheri_Caves_Borivali.jpg" },
  "kan-metro-west": { src: "/areas/real/kan-metro-west.jpg", artist: "Rupturestriker", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Kandivali_(West)_metro_station_signboard.jpg" },
  "kan-lokhandwala": { src: "/areas/real/kan-lokhandwala.jpg", artist: "Ask27", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Mumbai,_Kandivali_Lokhandwala_suburbs_in_2014.JPG" },
  "kan-akurli": { src: "/areas/real/kan-akurli.jpg", artist: "Rupturestriker", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Akurli_metro_station.jpg" },
  "kan-creek": { src: "/areas/real/kan-creek.jpg", artist: "Trinidade", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Gorai_Creek.jpg" },
  "kan-sgnp": { src: "/areas/real/kan-sgnp.jpg", artist: "Ninad Bhosale", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", page: "https://commons.wikimedia.org/wiki/File:Shilonda_stream_in_Sanjay_Gandhi_National_Park,_Mumbai-_NinadVBhosale.jpg" },
  "mal-palm-court": { src: "/areas/real/mal-palm-court.jpg", artist: "Rakesh Krishna Kumar", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", page: "https://commons.wikimedia.org/wiki/File:Palm_Court_Malad.jpg" },
  "mal-dindoshi": { src: "/areas/real/mal-dindoshi.jpg", artist: "Raghav Sethupathy (brother)", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Dindoshi_metro_station_(Jan_%2723).jpg" },
  "mal-aksa": { src: "/areas/real/mal-aksa.jpg", artist: "E Siva Subramaniam Iyer", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", page: "https://commons.wikimedia.org/wiki/File:Sunset_at_the_Aksa_Beach.JPG" },
  "mal-madh-fort": { src: "/areas/real/mal-madh-fort.jpg", artist: "KartikMistry", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Madh_Fort_from_Versova_side.jpg" },
  "mal-manori": { src: "/areas/real/mal-manori.jpg", artist: "Sanjaybhagwat", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:MANORI-3.jpg" },
};

export function creditsFor(prefix: string): PhotoCredit[] {
  return Object.entries(AREA_PHOTO_CREDITS).filter(([k]) => k.startsWith(prefix)).map(([, v]) => v);
}

/** The credits for a given list of image paths, in order, without repeats. */
export function creditsForSources(srcs: string[]): PhotoCredit[] {
  const all = Object.values(AREA_PHOTO_CREDITS);
  return srcs.filter((x, i) => srcs.indexOf(x) === i).map((src) => all.find((c) => c.src === src)).filter((c): c is PhotoCredit => !!c);
}
