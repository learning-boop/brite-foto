/* Britefoto catalogue: finishes, sizes, thickness bands and products. */

export const FIN = {
  "Glossy":   {cls:"f-glossy",  band:"#00aeef", bt:"#15172e", img:0, base:"RC (resin coated)", blurb:"Shiny and vivid, like a classic photo print", long:"High shine with the most vivid colour and sharp detail. Best for bright, colourful photos and lab prints.", hero:"Britefoto High Glossy, 270 GSM"},
  "Luster":   {cls:"f-luster",  band:"#ec008c", bt:"#ffffff", img:3, base:"RC (resin coated)", blurb:"Slight sheen, the classic choice for portraits", long:"A fine pebble texture with a soft sheen between glossy and matte. The studio choice for portraits and albums.", hero:"Britefoto Luster, 260 GSM"},
  "Satin":    {cls:"f-satin",   band:"#7fdbff", bt:"#15172e", img:1, base:"RC (resin coated)", blurb:"Smooth, low-shine finish with rich colour", long:"A silky finish close to luster that keeps colour rich without strong glare. Good for weddings and framed prints.", hero:"Britefoto Satin, 260 GSM"},
  "Pearl":    {cls:"f-pearl",   band:"#ff9bdb", bt:"#15172e", img:3, base:"RC (resin coated)", blurb:"Soft pearly shimmer that adds depth", long:"A subtle pearl-like sheen that adds depth and elegance, especially to skin tones and soft light.", hero:"Britefoto Pearl, 270 GSM"},
  "Metallic": {cls:"f-metallic",band:"linear-gradient(120deg,#c9cdd9,#ffffff 35%,#aeb3c4 60%,#eceef4)", bt:"#15172e", img:0, base:"Metallic RC", blurb:"Mirror-like shine that makes colours pop", long:"A high-gloss metallic shine that makes colour pop and gives photos a dramatic look.", hero:"Britefoto Metallic, 260 GSM"},
  "Matte":    {cls:"f-matte",   band:"#15172e", bt:"#ffffff", img:2, base:"Coated paper", blurb:"No shine, no glare, no fingerprints", long:"A smooth, non-shiny finish that reduces glare and fingerprints. Great for portraits, framing and text.", hero:"Britefoto Premium Matte, 230 GSM"},
  "Fine Art": {cls:"f-fine-art",band:"#fff68f", bt:"#15172e", img:2, base:"Cotton rag", blurb:"Thick and textured, like museum art paper", long:"Thick, textured, cotton-based paper for gallery-quality and exhibition prints.", hero:"Britefoto Fine Art Cotton Rag, 300 GSM"},
  "Canvas":   {cls:"f-canvas",  band:"#fff200", bt:"#15172e", img:1, base:"Poly-cotton canvas", blurb:"Woven fabric texture, made for wall art", long:"A woven, fabric-like texture made for wall art and large photo enlargements.", hero:"Britefoto Photo Canvas, 380 GSM"},
  "Mixed":    {cls:"f-mixed",   band:"linear-gradient(90deg,#00aeef 0 12.5%,#ec008c 0 25%,#7fdbff 0 37.5%,#ff9bdb 0 50%,#c3c7d4 0 62.5%,#15172e 0 75%,#fff68f 0 87.5%,#fff200 0)", bt:"#15172e", img:0, base:"Assorted", blurb:"", long:"", hero:""}
};

export const FINISH_ORDER = ["Glossy","Luster","Satin","Pearl","Metallic","Matte","Fine Art","Canvas"];

export const SIZES = [
  {k:"4R",  inch:"4 × 6 in",  mm:[102,152], use:"Lab prints, events and ID photos"},
  {k:"5R",  inch:"5 × 7 in",  mm:[127,178], use:"Gifts and desk frames"},
  {k:"A4",  inch:"8.3 × 11.7 in", mm:[210,297], use:"Home printers, portfolios and certificates"},
  {k:"A3",  inch:"11.7 × 16.5 in", mm:[297,420], use:"Posters and album spreads"},
  {k:"A3+", inch:"13 × 19 in", mm:[329,483], use:"Exhibition prints with a border"},
  {k:"Roll",inch:"24 in and 44 in wide", mm:null, use:"Large-format printers"}
];

export const GSM = [
  {k:"130", feel:"Light, like a brochure page", label:"130 GSM", lo:130, hi:130, t:5,  use:"Brochures, menus and double-sided handouts"},
  {k:"180", feel:"Medium, like a greeting card", label:"180 to 200 GSM", lo:180, hi:200, t:8,  use:"Everyday prints and school projects"},
  {k:"230", feel:"Firm, like a postcard", label:"230 GSM", lo:230, hi:230, t:11, use:"Studio prints and certificates"},
  {k:"260", feel:"Thick, like a pro lab print", label:"260 to 270 GSM", lo:260, hi:270, t:14, use:"Albums, portraits and pro lab work"},
  {k:"300", feel:"Extra thick, like art card", label:"300 GSM and up", lo:300, hi:999, t:22, use:"Fine art, gallery and canvas prints"}
];

// packs: [sheets or rolls, price, mrp]
export const PRODUCTS = [
  {id:"glossy-270-4r", name:"High Glossy Photo Paper", finish:"Glossy", gsm:270, size:"4R", packs:[[100,349,499],[500,1599,2290]], best:1, uses:["Lab prints","Event photos","Passport photos"]},
  {id:"glossy-180-a4", name:"Glossy Photo Paper", finish:"Glossy", gsm:180, size:"A4", packs:[[50,249,350],[100,449,650]], best:1, uses:["Home printing","School projects","Everyday photos"]},
  {id:"glossy-230-a4", name:"High Glossy Photo Paper", finish:"Glossy", gsm:230, size:"A4", packs:[[20,159,220],[50,349,480],[100,649,900]], uses:["Studio prints","Certificates","Portfolios"]},
  {id:"glossy-200-a3", name:"Glossy Photo Paper", finish:"Glossy", gsm:200, size:"A3", packs:[[50,749,1050],[100,1399,1990]], uses:["Posters","Calendars","Display prints"]},
  {id:"glossy-roll-24", name:"Glossy Photo Roll", finish:"Glossy", gsm:260, size:"Roll", roll:"24 in × 30 m", unit:"roll", packs:[[1,3850,4990]], best:1, uses:["Large-format printers","Posters","Photo enlargements"]},
  {id:"luster-260-a4", name:"Luster Photo Paper", finish:"Luster", gsm:260, size:"A4", packs:[[20,249,340],[50,579,790]], best:1, uses:["Portraits","Wedding albums","Client proofs"]},
  {id:"luster-260-a3plus", name:"Luster Photo Paper", finish:"Luster", gsm:260, size:"A3+", packs:[[25,1190,1590]], uses:["Exhibition prints","Album spreads","Portfolios"]},
  {id:"luster-roll-44", name:"Luster Photo Roll", finish:"Luster", gsm:260, size:"Roll", roll:"44 in × 30 m", unit:"roll", packs:[[1,6990,8990]], uses:["Large-format studio prints","Exhibitions","Wall portraits"]},
  {id:"satin-260-a4", name:"Satin Photo Paper", finish:"Satin", gsm:260, size:"A4", packs:[[50,599,820]], uses:["Wedding prints","Framed photos","Portraits"]},
  {id:"satin-260-5r", name:"Satin Photo Paper", finish:"Satin", gsm:260, size:"5R", packs:[[100,549,750]], best:1, uses:["Gift prints","Desk frames","Event packages"]},
  {id:"pearl-270-a4", name:"Pearl Photo Paper", finish:"Pearl", gsm:270, size:"A4", packs:[[20,349,480],[50,799,1090]], uses:["Bridal portraits","Fashion","Premium albums"]},
  {id:"metallic-260-a4", name:"Metallic Photo Paper", finish:"Metallic", gsm:260, size:"A4", packs:[[20,449,620]], best:1, uses:["Showpiece prints","Cars and products","Night scenes"]},
  {id:"matte-130-a4", name:"Double-Sided Matte Paper", finish:"Matte", gsm:130, size:"A4", sides:"Both sides", packs:[[100,299,420]], uses:["Brochures","Menus","Handouts"]},
  {id:"matte-230-a4", name:"Premium Matte Photo Paper", finish:"Matte", gsm:230, size:"A4", packs:[[50,379,520],[100,699,980]], best:1, uses:["Portraits","Framing","Text and graphics"]},
  {id:"fineart-300-a4", name:"Fine Art Cotton Rag", finish:"Fine Art", gsm:300, size:"A4", packs:[[25,1450,1890]], uses:["Gallery prints","Art reproductions","Limited editions"]},
  {id:"fineart-300-a3plus", name:"Fine Art Textured Paper", finish:"Fine Art", gsm:300, size:"A3+", packs:[[25,2790,3490]], uses:["Exhibitions","Fine art photography","Illustration prints"]},
  {id:"canvas-380-a4", name:"Photo Canvas Sheets", finish:"Canvas", gsm:380, size:"A4", packs:[[10,599,790]], uses:["Canvas frames","Gifts","Wall art"]},
  {id:"canvas-380-roll", name:"Photo Canvas Roll", finish:"Canvas", gsm:380, size:"Roll", roll:"24 in × 18 m", unit:"roll", packs:[[1,4990,6490]], uses:["Gallery wraps","Wall art","Large enlargements"]},
  {id:"sampler-kit", name:"Finish Sampler Kit", finish:"Mixed", gsm:null, gsmLabel:"180 to 380", size:"A4", kind:"kit", unit:"sheet", packs:[[16,299,399]], best:1, uses:["Testing finishes","Choosing album paper","Printer profiling"]}
];
PRODUCTS.forEach((p, i) => { p.order = i; p.kind = p.kind || (p.size === "Roll" ? "roll" : "sheet"); });

export const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

export const BEST_SELLERS = ["glossy-270-4r","luster-260-a4","glossy-180-a4","matte-230-a4","metallic-260-a4","satin-260-5r","sampler-kit","glossy-roll-24"];

export const FREE_SHIP = 1499;
export const SHIP_FEE = 79;

export const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];

// Contact details used in the footer, contact page and WhatsApp button.
// Replace with the real number; WHATSAPP must be digits only, with country code.
export const PHONE = "+91 00000 00000";
export const WHATSAPP = PHONE.replace(/\D/g, "");
export const WHATSAPP_READY = !/^910+$/.test(WHATSAPP); // false while the number is a placeholder
