/* Britefoto catalogue: RC (resin coated) photo paper, from the client's
   product note: cut sheets in 270 GSM and rolls in 240 GSM, each in
   Glossy, Satin and Matt.

   PRICES ARE PLACEHOLDERS until Britefoto sends its price list, and so are
   the pack sizes for 5x7, 8x12, 10x15 and 12x18 (the note gives packs only
   for 4x6: 100 and 400 sheets). */

export const FIN = {
  "Glossy": {cls:"f-glossy", band:"#00aeef", bt:"#15172e", img:0, base:"RC (resin coated)", blurb:"Shiny and vivid, like a classic photo print", long:"High shine with the most vivid colour and sharp detail. Best for bright, colourful photos and lab prints.", hero:"Britefoto Glossy, 270 GSM"},
  "Satin":  {cls:"f-satin",  band:"#7fdbff", bt:"#15172e", img:1, base:"RC (resin coated)", blurb:"Soft sheen, low glare, rich colour", long:"A silky, low-glare finish that keeps colour rich. The studio choice for portraits, weddings and albums.", hero:"Britefoto Satin, 270 GSM"},
  "Matte":  {cls:"f-matte",  band:"#15172e", bt:"#ffffff", img:2, base:"RC (resin coated)", blurb:"No shine, no glare, no fingerprints", long:"A smooth, non-shiny finish that reduces glare and fingerprints. Great for framing, portraits and prints with text.", hero:"Britefoto Matte, 270 GSM"},
  "Mixed":  {cls:"f-mixed",  band:"linear-gradient(90deg,#00aeef 0 33.3%,#7fdbff 0 66.6%,#15172e 0)", bt:"#15172e", img:0, base:"Assorted", blurb:"", long:"", hero:""}
};

export const FINISH_ORDER = ["Glossy","Satin","Matte"];

export const SIZES = [
  {k:"4R",    label:"4R", inch:"4 × 6 in",   mm:[102,152], use:"Lab prints, events and ID photos"},
  {k:"5R",    label:"5R", inch:"5 × 7 in",   mm:[127,178], use:"Gifts and desk frames"},
  {k:"8x12",  label:"8×12", inch:"8 × 12 in",  mm:[203,305], use:"Album pages and portraits"},
  {k:"10x15", label:"10×15", inch:"10 × 15 in", mm:[254,381], use:"Framed prints and enlargements"},
  {k:"12x18", label:"12×18", inch:"12 × 18 in", mm:[305,457], use:"Posters and exhibition prints"},
  {k:"Roll",  label:"Rolls", inch:"12 to 42 in wide, 30 m long", mm:null, use:"Large-format printers, on a 2 in or 3 in core"}
];

export const GSM = [
  {k:"240", feel:"Thick, made to feed smoothly from a roll", label:"240 GSM", lo:240, hi:240, t:12, use:"Rolls for large-format printers"},
  {k:"270", feel:"Thick, like a pro lab print", label:"270 GSM", lo:270, hi:270, t:14, use:"Cut sheets for photos, albums and framing"}
];

/* packs: [quantity, price, mrp, label?]; a roll's label is its width */
const SHEETS = [
  // size, packs, uses
  ["4R",    [[100, 349, 499], [400, 1299, 1790]], ["Lab prints", "Event photos", "Passport photos"]],
  ["5R",    [[100, 549, 750]],                    ["Gift prints", "Desk frames", "Event packages"]],
  ["8x12",  [[50, 799, 1090]],                    ["Album pages", "Portraits", "Wedding prints"]],
  ["10x15", [[50, 1199, 1590]],                   ["Framed prints", "Enlargements", "Studio portraits"]],
  ["12x18", [[50, 1690, 2250]],                   ["Posters", "Exhibition prints", "Wall photos"]],
];
const WIDTHS = [[12, 1950], [14, 2250], [20, 3200], [24, 3850], [30, 4790], [36, 5750], [42, 6690]];
const rollPacks = WIDTHS.map(([w, price]) => [1, price, Math.round(price * 1.3 / 10) * 10, w + ' in wide × 30 m']);
const NAME = { Glossy: "Glossy", Satin: "Satin", Matte: "Matte" };
const BEST = new Set(["glossy-270-4r", "satin-270-8x12", "matte-270-4r", "glossy-roll-3in", "satin-270-5r", "glossy-270-12x18", "satin-roll-3in", "matte-270-10x15"]);

export const PRODUCTS = [
  ...FINISH_ORDER.flatMap(f => SHEETS.map(([size, packs, uses]) => ({
    id: `${f.toLowerCase()}-270-${size.toLowerCase()}`, name: `${NAME[f]} RC Photo Paper`, finish: f, gsm: 270, size, packs, uses,
  }))),
  ...FINISH_ORDER.flatMap(f => ["3in", "2in"].map(core => ({
    id: `${f.toLowerCase()}-roll-${core}`, name: `${NAME[f]} RC Photo Roll`, finish: f, gsm: 240, size: "Roll",
    roll: `${core.replace('in', ' in')} core`, core: core.replace('in', ' in'), unit: "roll", packs: rollPacks,
    uses: ["Large-format printers", "Posters", "Photo enlargements"],
  }))),
];
PRODUCTS.forEach((p, i) => { p.order = i; p.kind = p.kind || (p.size === "Roll" ? "roll" : "sheet"); if (BEST.has(p.id)) p.best = 1; });

export const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

export const BEST_SELLERS = [...BEST].filter(id => byId[id]);

export const FREE_SHIP = 1499;
export const SHIP_FEE = 79;

export const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];

// Contact details used in the footer, contact page and WhatsApp button.
// Replace with the real number; WHATSAPP must be digits only, with country code.
export const PHONE = "+91 00000 00000";
export const WHATSAPP = PHONE.replace(/\D/g, "");
export const WHATSAPP_READY = !/^910+$/.test(WHATSAPP); // false while the number is a placeholder
