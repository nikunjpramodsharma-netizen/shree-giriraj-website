/**
 * Photographs of the three suburbs, all from Wikimedia Commons under free
 * licences that ask for the photographer to be named. Each entry carries the
 * name, the licence and the page the file came from; the area pages list them
 * and every card shows its own credit. Resized and recompressed, not otherwise altered.
 */
export type PhotoCredit = { src: string; artist: string; license: string; licenseUrl: string; page: string };

export const AREA_PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "bor-west-skyline": { src: "/areas/real/bor-west-skyline.jpg", artist: "Aziz", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", page: "https://commons.wikimedia.org/wiki/File:%E0%A6%AC%E0%A7%8B%E0%A6%B0%E0%A6%BF%E0%A6%AC%E0%A6%BE%E0%A6%B2%E0%A6%BF_(%E0%A6%AA%E0%A6%83)_%E0%A6%8F%E0%A6%B0_%E0%A6%A6%E0%A7%83%E0%A6%B6%E0%A7%8D%E0%A6%AF.jpg" },
  "bor-mount-poinsur": { src: "/areas/real/bor-mount-poinsur.jpg", artist: "Kartik Chandramouli", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Mandapeshwar_Sacromonte,_Watch_Tower_at_Mount_Poinsur_01.jpg" },
  "bor-station": { src: "/areas/real/bor-station.jpg", artist: "Gannu03", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Borivali_railwaystation_Mumbai_2024.jpg" },
  "bor-east": { src: "/areas/real/bor-east.jpg", artist: "Rakesh from Bangalore", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", page: "https://commons.wikimedia.org/wiki/File:Borivali_East_(246242748).jpg" },
  "bor-sgnp": { src: "/areas/real/bor-sgnp.jpg", artist: "Rana.p.s", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Sanjay_Gandhi_National_Park,_Mumbai.jpg" },
  "bor-mandapeshwar": { src: "/areas/real/bor-mandapeshwar.jpg", artist: "Kartik Chandramouli", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Mandapeshwar_Caves.jpg" },
  "bor-pagoda": { src: "/areas/real/bor-pagoda.jpg", artist: "Joe Ravi", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Global_Vipassana_Pagoda_1.jpg" },
  "bor-kanheri": { src: "/areas/real/bor-kanheri.jpg", artist: "Jawahar Soneji", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Kenheri_Caves_Borivali.jpg" },
  "kan-metro-west": { src: "/areas/real/kan-metro-west.jpg", artist: "Rupturestriker", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Kandivali_(West)_metro_station_signboard.jpg" },
  "kan-metro-train": { src: "/areas/real/kan-metro-train.jpg", artist: "Mumbaimetro", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Mumbai_Mero,_yellow_line_metro.jpg" },
  "kan-lokhandwala": { src: "/areas/real/kan-lokhandwala.jpg", artist: "Ask27", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Mumbai,_Kandivali_Lokhandwala_suburbs_in_2014.JPG" },
  "kan-mahindra": { src: "/areas/real/kan-mahindra.jpg", artist: "Ask27", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Mahindra_%26_Mahindra_Kandivali_Plant_2015.JPG" },
  "kan-akurli": { src: "/areas/real/kan-akurli.jpg", artist: "Rupturestriker", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Akurli_metro_station.jpg" },
  "kan-station": { src: "/areas/real/kan-station.jpg", artist: "Superfast1111", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Kandivali_railway_station_-_Overview.jpg" },
  "kan-creek": { src: "/areas/real/kan-creek.jpg", artist: "Trinidade", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Gorai_Creek.jpg" },
  "kan-sgnp": { src: "/areas/real/kan-sgnp.jpg", artist: "Ninad Bhosale", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", page: "https://commons.wikimedia.org/wiki/File:Shilonda_stream_in_Sanjay_Gandhi_National_Park,_Mumbai-_NinadVBhosale.jpg" },
  "mal-inorbit": { src: "/areas/real/mal-inorbit.jpg", artist: "Rakesh Krishna Kumar", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", page: "https://commons.wikimedia.org/wiki/File:Inorbit_Mall.jpg" },
  "mal-palm-court": { src: "/areas/real/mal-palm-court.jpg", artist: "Rakesh Krishna Kumar", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", page: "https://commons.wikimedia.org/wiki/File:Palm_Court_Malad.jpg" },
  "mal-st-annes": { src: "/areas/real/mal-st-annes.jpg", artist: "J maroon5 2308", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:St.Anne%27s_High_School.jpg" },
  "mal-dindoshi": { src: "/areas/real/mal-dindoshi.jpg", artist: "Raghav Sethupathy (brother)", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Dindoshi_metro_station_(Jan_%2723).jpg" },
  "mal-aksa": { src: "/areas/real/mal-aksa.jpg", artist: "E Siva Subramaniam Iyer", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", page: "https://commons.wikimedia.org/wiki/File:Sunset_at_the_Aksa_Beach.JPG" },
  "mal-madh-fort": { src: "/areas/real/mal-madh-fort.jpg", artist: "KartikMistry", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:Madh_Fort_from_Versova_side.jpg" },
  "mal-manori": { src: "/areas/real/mal-manori.jpg", artist: "Sanjaybhagwat", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:MANORI-3.jpg" },
  "svc-weh-metro": { src: "/areas/real/svc-weh-metro.jpg", artist: "Pratishkhedekar", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Dahisar_Metro_station_and_Western_Expressway.jpeg" },
  "svc-eksar-metro": { src: "/areas/real/svc-eksar-metro.jpg", artist: "Bramhesh Patil", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", page: "https://commons.wikimedia.org/wiki/File:An_under-construction_Pahadi_Eksar_metro_station_in_Borivali,_as_of_February_2022.jpg" },
  "svc-bor-station-entrance": { src: "/areas/real/svc-bor-station-entrance.jpg", artist: "Superfast1111", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Borivali_Station_entrance_-_east.jpg" },
};

export function creditsFor(prefix: string): PhotoCredit[] {
  return Object.entries(AREA_PHOTO_CREDITS).filter(([k]) => k.startsWith(prefix)).map(([, v]) => v);
}

/** The credits for a given list of image paths, in order, without repeats. */
export function creditsForSources(srcs: string[]): PhotoCredit[] {
  const all = Object.values(AREA_PHOTO_CREDITS);
  return srcs.filter((x, i) => srcs.indexOf(x) === i).map((src) => all.find((c) => c.src === src)).filter((c): c is PhotoCredit => !!c);
}
