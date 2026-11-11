export type ProductCategory = "Necklaces" | "Earrings" | "Bangles" | "Rings" | "Bridal" | "Pendants";

export type JewelleryProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  metal: string;
  image: string;
  note: string;
};

const image = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const products: JewelleryProduct[] = [
  { id: "kundan-rani-haar", name: "Kundan Rani Haar", category: "Necklaces", description: "Uncut stones, set by hand", metal: "22K hallmarked gold", image: image("photo-1611652022419-a9419f74343d"), note: "A softly luminous heirloom, brought to life with traditional kundan setting." },
  { id: "polki-jhumka", name: "Polki Jhumka Pair", category: "Earrings", description: "Old-world polish, graceful movement", metal: "22K gold · Polki", image: image("photo-1535632066927-ab7c9ab60908"), note: "Individually finished to catch the light with every turn." },
  { id: "temple-lakshmi", name: "Temple Lakshmi Pendant", category: "Pendants", description: "Sculpted detail with a sacred motif", metal: "22K hallmarked gold", image: image("photo-1617038220319-276d3cfab638"), note: "A devotional motif rendered in fine, time-honoured detail." },
  { id: "filigree-cuff", name: "Filigree Cuff Bangle", category: "Bangles", description: "Fine openwork, gently sculptural", metal: "22K gold · Filigree", image: image("photo-1611591437281-460bfbe1220a"), note: "Delicate gold strands shaped and finished by an artisan's hand." },
  { id: "solitaire-ring", name: "Solitaire Heritage Ring", category: "Rings", description: "A considered setting for a lasting promise", metal: "18K hallmarked gold", image: image("photo-1605100804763-247f67b3557e"), note: "Made to order, with the stone and setting chosen together." },
  { id: "meenakari-choker", name: "Meenakari Choker", category: "Bridal", description: "Vivid enamel with a heritage silhouette", metal: "22K gold · Meenakari", image: image("photo-1599643478518-a784e5dc4c8f"), note: "A colourful expression of a craft passed down through generations." },
  { id: "pearl-mala", name: "Pearl Mala Necklace", category: "Necklaces", description: "Pearl and gold in a measured rhythm", metal: "22K gold · Freshwater pearls", image: image("photo-1599643477877-530eb83abc8e"), note: "Layered by hand for effortless elegance, from ceremony to celebration." },
  { id: "chandbali", name: "Jadau Chandbali", category: "Earrings", description: "A crescent silhouette in luminous detail", metal: "22K gold · Jadau", image: image("photo-1630019852942-f89202989a59"), note: "Traditional jadau work, balanced for a graceful, comfortable wear." },
  { id: "antique-kada", name: "Antique Nakshi Kada", category: "Bangles", description: "Hand-carved relief, quietly radiant", metal: "22K hallmarked gold", image: image("photo-1611652022419-a9419f74343d"), note: "Raised nakshi detail gives each surface its own depth and character." },
  { id: "navratna-band", name: "Navratna Signet Band", category: "Rings", description: "Nine stones, one enduring symbol", metal: "22K gold · Navratna", image: image("photo-1603561591411-07134e71a2a9"), note: "A personal piece shaped around colour, symbolism and a comfortable fit." },
  { id: "bridal-haar", name: "Swarna Bridal Haar", category: "Bridal", description: "A ceremonial heirloom for the next chapter", metal: "22K hallmarked gold", image: image("photo-1599643477877-530eb83abc8e"), note: "Created with patience, for a day and a family story that stay with you." },
  { id: "lotus-studs", name: "Lotus Granulation Studs", category: "Pendants", description: "A petite floral motif, finely finished", metal: "22K gold · Granulation", image: image("photo-1617038260897-41a1f14a8ca0"), note: "Minute gold granules are arranged and finished by hand." },
];

export const productCategories: Array<ProductCategory | "All"> = ["All", "Necklaces", "Earrings", "Bangles", "Rings", "Bridal", "Pendants"];
