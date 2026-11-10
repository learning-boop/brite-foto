/* Site photography. Unsplash images (free under the Unsplash licence).
   Every photo is chosen for a reason: each finish is shown on a subject
   that plays to that paper's strength, and each customer type is shown
   with the work it prints. Replace an `id` with your own shot, or swap
   `src` for a file in /public (for example '/hero/wedding.jpg'). */

const crop = (id, w, x = '') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w / 0.7)}&q=78${x}`;

// x: extra crop options, e.g. '&crop=faces' to keep a group's faces in a tall card
const photo = (id, alt, fallback, x = '') => ({
  id,
  x,
  src: crop(id, 340, x),
  srcSet: `${crop(id, 240, x)} 240w, ${crop(id, 340, x)} 340w, ${crop(id, 480, x)} 480w`,
  alt,
  fallback, // procedural scene (--img0..3) shown if the image cannot load
});

/* Hero wheel: 16 cards, two rounds of the 8 finishes in FINISH_ORDER.
   Card i is printed on FINISH_ORDER[i % 8], so photo i is picked to suit
   that finish. Keep this order in step with FINISH_ORDER. */
export const WHEEL_PHOTOS = [
  // round one
  photo('photo-1616435577207-ca90abc6b732', 'Pink lotus in full bloom', 1),                  // Glossy: vivid pinks pop
  photo('photo-1630305131239-c8df91783f10', 'Wide-eyed baby looking up', 3),                 // Luster: the classic portrait paper
  photo('photo-1780980301761-f6e0fa6f0bdf', 'Happy family portrait with two daughters', 3, '&crop=faces'), // Satin: rich skin tones, low glare
  photo('photo-1604917621956-10dfa7cce2e7', 'Baby in a knitted bunny hat', 3),               // Pearl: soft glow on skin tones
  photo('photo-1483347756197-71ef80e95f73', 'Northern lights above a pine forest', 1),        // Metallic: glowing colour
  photo('photo-1770831208183-92f98cf3845b', "Parent's hands cradling a newborn's tiny feet", 3), // Matte: gentle, no glare
  photo('photo-1472214103451-9374bd1c798e', 'Green valley under a golden sky', 2),            // Fine Art: painterly light
  photo('photo-1500530855697-b586d89ba3ee', 'Desert road toward red rock mountains', 2),      // Canvas: wall-sized scene
  // round two
  photo('photo-1777928163243-ce6f437c8ac7', 'Santorini village above the sea at sunset', 1), // Glossy: sunset colour
  photo('photo-1617331140180-e8262094733a', 'Smiling baby in a grey romper', 3),             // Luster
  photo('photo-1722952934708-749c22eb2e58', 'Bride and groom in traditional Indian wedding attire', 3), // Satin: the wedding album favourite
  photo('photo-1773243086631-962baefccd8a', 'Newborn sleeping on a soft blanket', 3),        // Pearl
  photo('photo-1490682143684-14369e18dce8', 'Golden sunrise over forested hills', 1),         // Metallic
  photo('photo-1447752875215-b2761acb3c5d', 'Wooden footbridge through a dense forest', 2),   // Matte
  photo('photo-1470071459604-3b5ec3a7fe05', 'Green cliffs beneath drifting clouds', 1),       // Fine Art
  photo('photo-1552788960-65fcafe071a5', 'Smiling baby with a yellow bow', 3),               // Canvas: nursery wall art
];

/* Shop by finish: one photograph per finish, chosen to suit what that
   paper is best at. `why` says so on the card. Cropped 4:5. */
const crop45 = (id, w, x = '') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 1.25)}&q=80${x}`;
const finPhoto = (id, alt, why) => ({
  id,
  src: crop45(id, 480),
  srcSet: `${crop45(id, 320)} 320w, ${crop45(id, 480)} 480w, ${crop45(id, 720)} 720w`,
  alt,
  why,
});

export const FINISH_PHOTOS = {
  'Glossy':   finPhoto('photo-1616902509409-a624c4f31a56', 'Scarlet macaw perched on a branch', 'Shown on a scarlet macaw: glossy makes bright colours pop.'),
  'Luster':   finPhoto('photo-1610173827043-9db50e0d8ef9', 'Indian bride in red and gold bridal jewellery', 'Shown on a bridal portrait: rich skin tones and fine detail, without hard glare.'),
  'Satin':    finPhoto('photo-1560707854-fb9a10eeaace', 'Mother holding her smiling baby close', 'Shown on a mother and baby: soft, gentle tones for family moments.'),
  'Pearl':    finPhoto('photo-1536514900905-0d5511b9d489', 'Peacock with its shimmering feathers', 'Shown on a peacock: the pearly sheen lifts shimmering feathers.'),
  'Metallic': finPhoto('photo-1605292356183-a77d0a9c9d1d', 'Lit Diwali diya held in cupped hands', 'Shown on a Diwali diya: glowing light that seems lit from within.'),
  'Matte':    finPhoto('photo-1482192596544-9eb780fc7f66', 'Mist drifting over a pine forest', 'Shown on misty forest: soft and readable from any angle.'),
  'Fine Art': finPhoto('photo-1587135941948-670b381f08ce', 'The Taj Mahal at sunrise', 'Shown on the Taj Mahal at sunrise: soft, painterly tones with a museum feel.'),
  'Canvas':   finPhoto('photo-1558788353-f76d92427f16', 'Golden retriever portrait', 'Shown on a pet portrait: a favourite for canvas wall art.'),
};

/* Papers by the job: what each kind of customer actually prints. */
const crop32 = (id, w) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w / 1.5)}&q=78`;
const jobPhoto = (id, alt) => ({
  src: crop32(id, 600),
  srcSet: `${crop32(id, 400)} 400w, ${crop32(id, 600)} 600w, ${crop32(id, 900)} 900w`,
  alt,
});

export const JOB_PHOTOS = {
  'Photo studios':              jobPhoto('photo-1768818928341-3b31b8965c6d', 'Photo studio with softbox lights and a white backdrop'),
  'Photo labs and DTP centres': jobPhoto('photo-1710857679450-ecd7945dd4bd', 'Inkjet printer printing a colourful photograph'),
  'Album designers':            jobPhoto('photo-1769021488255-c58d0b4748f0', 'Open photo book showing printed spreads'),
  'Commercial printers':        jobPhoto('photo-1790345835845-bda0548978b2', 'Printed brochure open on a wooden table'),
  'Artists and galleries':      jobPhoto('photo-1735605917461-4c1b77a6616f', 'Gallery hall with framed prints on the walls'),
  'Home and office':            jobPhoto('photo-1708793699492-5fa208f52dcb', 'Home printer with freshly printed photos beside it'),
};

/* Product page "On paper" view: three photos that suit a finish, as 4:5
   prints. The first is the Shop-by-finish photo (with its reason), then
   the two hero wheel photos printed on that finish. */
const WHEEL_ORDER = ['Glossy', 'Luster', 'Satin', 'Pearl', 'Metallic', 'Matte', 'Fine Art', 'Canvas'];
export function printPhotos(finish) {
  const i = WHEEL_ORDER.indexOf(finish);
  if (i < 0) return [];
  return [FINISH_PHOTOS[finish], WHEEL_PHOTOS[i], WHEEL_PHOTOS[i + 8]].map(ph => ({
    src: crop45(ph.id, 720, ph.x),
    srcSet: `${crop45(ph.id, 480, ph.x)} 480w, ${crop45(ph.id, 720, ph.x)} 720w, ${crop45(ph.id, 1000, ph.x)} 1000w`,
    thumb: crop45(ph.id, 160, ph.x),
    alt: ph.alt,
  }));
}

/* Homepage hero: four prints laid on a table, as in the design mockup.
   `ar` is the print's width / height; `x` adds crop options. */
const heroCrop = (id, w, ar, x = '') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w / ar)}&q=80${x}`;
const heroPrint = (key, id, alt, finish, ar, x = '') => ({
  key, alt, finish, ar,
  src: heroCrop(id, 900, ar, x),
  srcSet: `${heroCrop(id, 600, ar, x)} 600w, ${heroCrop(id, 900, ar, x)} 900w, ${heroCrop(id, 1300, ar, x)} 1300w`,
});
export const HERO_PRINTS = [
  heroPrint('family',  'photo-1780980301761-f6e0fa6f0bdf', 'Happy family portrait with two daughters', 'Satin', 4 / 3, '&crop=faces'),
  heroPrint('lotus',   'photo-1616435577207-ca90abc6b732', 'Pink lotus in full bloom', 'Glossy', 5 / 4),
  heroPrint('wedding', 'photo-1722952934708-749c22eb2e58', 'Bride and groom in traditional Indian wedding attire', 'Luster', 4 / 5),
  heroPrint('travel',  'photo-1777928163243-ce6f437c8ac7', 'Santorini village above the sea at sunset', 'Metallic', 3 / 2),
];
