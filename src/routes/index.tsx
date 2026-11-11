import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { products, productCategories, type JewelleryProduct, type ProductCategory } from "@/data/products";
import { buildWhatsAppLink, bespokeEnquiryMessage, generalEnquiryMessage, productEnquiryMessage } from "@/lib/whatsapp";

const instagramUrl = "https://www.instagram.com/deepa_jeweller/";
const image = (id: string, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=90`;
const navigation = [
  { label: "Collections", href: "#collections" },
  { label: "Craft", href: "#craft" },
  { label: "Heritage", href: "#heritage" },
  { label: "Visit", href: "#visit" },
];

const craftChapters = [
  { number: "01", title: "Design", text: "Every piece begins with a conversation. We listen for the feeling, the occasion and the story you want your jewellery to hold." },
  { number: "02", title: "Hand-finishing", text: "Our artisans shape, set and polish with a patient eye. The smallest details are given the same care as the whole." },
  { number: "03", title: "Assurance", text: "Purity and provenance matter. Each creation is carefully checked, with hallmarking and guidance you can trust." },
];

const testimonials = [
  { quote: "The care in every detail made choosing our wedding jewellery feel as special as the day itself.", name: "A cherished family", location: "Jaipur" },
  { quote: "A beautiful balance of tradition and something that felt entirely my own. I will treasure it always.", name: "A happy client", location: "Delhi" },
  { quote: "Patient, thoughtful guidance — and a piece that already feels like it belongs in our family story.", name: "A returning client", location: "Mumbai" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deepa Jewellers | Handcrafted Gold & Fine Jewellery" },
      { name: "description", content: "Discover handcrafted gold and fine jewellery at Deepa Jewellers. Heirloom pieces, bespoke craftsmanship and a legacy of trust." },
      { property: "og:title", content: "Deepa Jewellers | Handcrafted Gold & Fine Jewellery" },
      { property: "og:description", content: "Handcrafted gold and fine jewellery, made with honesty and finished with devotion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      name: "Deepa Jewellers",
      description: "Handcrafted gold and fine jewellery, made with honesty and finished with devotion.",
      sameAs: [instagramUrl],
    }) }],
  }),
  component: HomePage,
});

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [filter, setFilter] = useState<ProductCategory | "All">("All");
  const [selectedProduct, setSelectedProduct] = useState<JewelleryProduct | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [floatingVisible, setFloatingVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const visibleProducts = useMemo(() => filter === "All" ? products : products.filter((product) => product.category === filter), [filter]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
        setScrolled(window.scrollY > 60);
        const hero = document.getElementById("home");
        setFloatingVisible(Boolean(hero && hero.getBoundingClientRect().bottom < 0));
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [filter]);

  useEffect(() => {
    if (!mobileMenu) return;
    const menu = document.querySelector<HTMLElement>(".mobile-menu");
    const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenu]);

  useEffect(() => {
    const sections = navigation.map(({ href }) => document.querySelector(href)).filter((item): item is Element => item !== null);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveSection(`#${current.target.id}`);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.4] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [visibleProducts]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedProduct && !dialog.open) dialog.showModal();
    if (!selectedProduct && dialog.open) dialog.close();
  }, [selectedProduct]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setTestimonialIndex((index) => (index + 1) % testimonials.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const closeMenu = () => setMobileMenu(false);
  const shiftTestimonial = (direction: number) => setTestimonialIndex((index) => (index + direction + testimonials.length) % testimonials.length);

  return (
    <main>
      <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
        <a className="wordmark" href="#home" onClick={closeMenu} aria-label="Deepa Jewellers home">
          <span>Deepa Jewellers</span><small>FINE JEWELLERY</small>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.href} className={activeSection === item.href ? "nav-link nav-link--active" : "nav-link"} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="nav-enquire" href={buildWhatsAppLink(generalEnquiryMessage)} target="_blank" rel="noopener noreferrer">Enquire <ArrowUpRight size={13} strokeWidth={1.5} /></a>
        <button ref={menuButtonRef} className="menu-toggle" type="button" onClick={() => setMobileMenu(true)} aria-label="Open navigation menu"><Menu size={22} strokeWidth={1.4} /></button>
        <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      </header>

      {mobileMenu && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="mobile-menu__top"><a className="wordmark" href="#home" onClick={closeMenu}><span>Deepa Jewellers</span><small>FINE JEWELLERY</small></a><button type="button" className="icon-button" onClick={closeMenu} aria-label="Close navigation menu"><X size={24} strokeWidth={1.4} /></button></div>
        <nav aria-label="Mobile navigation">{navigation.map((item, index) => <a key={item.href} href={item.href} onClick={closeMenu}><span className="mobile-menu__number">0{index + 1}</span>{item.label}<ArrowUpRight size={19} strokeWidth={1.3} /></a>)}
          <a href={buildWhatsAppLink(generalEnquiryMessage)} target="_blank" rel="noopener noreferrer" onClick={closeMenu}><span className="mobile-menu__number">05</span>Enquire<ArrowUpRight size={19} strokeWidth={1.3} /></a>
        </nav>
        <a className="mobile-menu__instagram" href={instagramUrl} target="_blank" rel="noopener noreferrer">Follow @deepa_jeweller <ArrowUpRight size={15} /></a>
      </div>}

      <section className="hero" id="home">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow">HEIRLOOMS, MADE BY HAND</span>
          <h1>Heirlooms, crafted for the moments <em>you’ll remember.</em></h1>
          <p>Handcrafted gold &amp; fine jewellery, made with honesty, finished with devotion.</p>
          <div className="hero__actions">
            <a className="button-outline" href={buildWhatsAppLink(generalEnquiryMessage)} target="_blank" rel="noopener noreferrer">Enquire <ArrowUpRight size={15} strokeWidth={1.5} /></a>
            <a className="text-link" href="#collections">Explore the collections <ArrowDown size={14} strokeWidth={1.4} /></a>
          </div>
          <a className="hero__instagram" href={instagramUrl} target="_blank" rel="noopener noreferrer"><span>FOLLOW OUR JOURNEY</span>@deepa_jeweller <ArrowUpRight size={13} /></a>
        </div>
        <div className="hero__visual">
          <div className="hero__image-arch"><img src={image("photo-1611652022419-a9419f74343d", 1200)} alt="Intricate gold jewellery, handcrafted with fine detail" fetchPriority="high" /></div>
          <figure className="hero__image-inset"><img src={image("photo-1617038220319-276d3cfab638", 650)} alt="A close detail of traditional gold jewellery" /><figcaption>GOLD, WITH A STORY TO TELL</figcaption></figure>
          <span className="hero__image-index">01 <i /> 12</span>
        </div>
        <a className="hero__edge-link" href={instagramUrl} target="_blank" rel="noopener noreferrer">@deepa_jeweller</a>
        <a className="hero__scroll" href="#collections" aria-label="Scroll to collections"><span>SCROLL TO DISCOVER</span><ArrowDown size={15} /></a>
      </section>

      <section className="trust-strip" aria-label="Our commitments"><p>Certified purity</p><p>Hallmarked gold</p><p>Bespoke craftsmanship</p><p>Generations of trust</p></section>

      <section className="collections section-pad" id="collections">
        <div className="section-heading reveal"><div><span className="eyebrow">A CURATED COLLECTION</span><h2>Pieces to <em>keep close.</em></h2></div><p>Made to mark a moment, or to become part of all the ones that follow.</p></div>
        <div className="collection-filters" role="group" aria-label="Filter jewellery by category">
          {productCategories.map((category) => <button key={category} type="button" className={filter === category ? "filter-button filter-button--active" : "filter-button"} onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>)}
        </div>
        <div className="product-grid" aria-live="polite">
          {visibleProducts.map((product, index) => <ProductTile key={product.id} product={product} index={index} onOpen={() => setSelectedProduct(product)} />)}
        </div>
      </section>

      <section className="craft-section" id="craft">
        <div className="craft-inner section-pad">
          <div className="craft-image reveal"><img src={image("photo-1617038220319-276d3cfab638", 1100)} alt="Artisan jewellery with intricate traditional workmanship" loading="lazy" /><span className="image-caption">THE ART OF MAKING, HELD IN EVERY DETAIL</span></div>
          <div className="craft-copy"><span className="eyebrow reveal">THE HAND BEHIND THE HEIRLOOM</span><h2 className="reveal">Crafted with <em>intention.</em></h2>
            {craftChapters.map((chapter) => <article className="craft-chapter reveal" key={chapter.number}><span className="craft-chapter__number">{chapter.number}</span><div><h3>{chapter.title}</h3><p>{chapter.text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="heritage section-pad" id="heritage">
        <div className="heritage__quote reveal"><span className="eyebrow">A LEGACY IN GOLD</span><blockquote>“The most beautiful things are not simply worn. They are <em>remembered.</em>”</blockquote></div>
        <div className="heritage__story reveal"><p>For generations, Deepa Jewellers has believed that a piece of jewellery should mean more than the gold it holds. It should carry a moment, a promise, a little of the person who chose it.</p><p>We bring together time-honoured artistry and a deeply personal way of doing things — with honest guidance, patient hands and care that lasts long after the occasion.</p><p className="signature">— Deepa Jewellers</p></div>
        <div className="heritage-stats reveal"><div><strong>25<span>+</span></strong><p>YEARS OF CRAFT</p></div><div><strong>10,000<span>+</span></strong><p>FAMILIES ADORNED</p></div><div><strong>100<span>%</span></strong><p>HALLMARKED GOLD</p></div></div>
      </section>

      <section className="testimonials" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStartX.current !== null && end !== undefined && Math.abs(end - touchStartX.current) > 45) shiftTestimonial(end < touchStartX.current ? 1 : -1); touchStartX.current = null; }} aria-roledescription="carousel" aria-label="Client words">
        <span className="eyebrow reveal">WORDS FROM OUR FAMILIES</span>
        <div className="testimonial-content" aria-live="polite" aria-atomic="true"><blockquote>“{testimonials[testimonialIndex]?.quote ?? ""}”</blockquote><p>{testimonials[testimonialIndex]?.name ?? ""} <span>·</span> {testimonials[testimonialIndex]?.location ?? ""}</p></div>
        <div className="testimonial-controls"><button className="icon-button" type="button" onClick={() => shiftTestimonial(-1)} aria-label="Previous testimonial"><ArrowLeft size={18} strokeWidth={1.4} /></button><span>0{testimonialIndex + 1} <i /> 0{testimonials.length}</span><button className="icon-button" type="button" onClick={() => shiftTestimonial(1)} aria-label="Next testimonial"><ArrowRight size={18} strokeWidth={1.4} /></button></div>
      </section>

      <section className="bespoke-band"><span className="eyebrow">SOMETHING PERSONAL</span><div><h2>Have a design in mind? <em>Let’s bring it to life.</em></h2><a className="button-light" href={buildWhatsAppLink(bespokeEnquiryMessage)} target="_blank" rel="noopener noreferrer">Enquire about bespoke <ArrowUpRight size={15} strokeWidth={1.5} /></a></div><span className="bespoke-band__ornament" aria-hidden="true">D</span></section>

      <section className="visit-section section-pad" id="visit">
        <div className="visit-info reveal"><span className="eyebrow">COME BY, SAY HELLO</span><h2>We’d love to <em>meet you.</em></h2><p>Good things are best seen in person. Visit us to discover the details, try on a favourite, and take your time.</p><div className="visit-detail"><span>FIND US</span><p>Deepa Jewellers<br />Address to be confirmed</p></div><div className="visit-detail"><span>VISITING HOURS</span><p>Tuesday – Sunday<br />Hours to be confirmed</p></div><a className="text-link" href={buildWhatsAppLink(generalEnquiryMessage)} target="_blank" rel="noopener noreferrer">Plan your visit <ArrowUpRight size={14} /></a></div>
        <div className="instagram-block reveal"><span className="eyebrow">A GLIMPSE INTO OUR WORLD</span><a className="instagram-handle" href={instagramUrl} target="_blank" rel="noopener noreferrer">@deepa_jeweller <ArrowUpRight size={18} /></a><div className="instagram-grid">{["photo-1611652022419-a9419f74343d", "photo-1617038220319-276d3cfab638", "photo-1599643478518-a784e5dc4c8f", "photo-1535632066927-ab7c9ab60908", "photo-1611591437281-460bfbe1220a", "photo-1605100804763-247f67b3557e"].map((photo, index) => <a href={instagramUrl} target="_blank" rel="noopener noreferrer" key={photo} aria-label={`Visit Deepa Jewellers on Instagram — jewellery photograph ${index + 1}`}><img src={image(photo, 500)} alt="" loading="lazy" /></a>)}</div><a className="text-link" href={instagramUrl} target="_blank" rel="noopener noreferrer">Follow on Instagram <ArrowUpRight size={14} /></a></div>
      </section>

      <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><a className="wordmark wordmark--light" href="#home"><span>Deepa Jewellers</span><small>FINE JEWELLERY</small></a><p>Handcrafted gold &amp; fine jewellery.<br />Made with honesty, finished with devotion.</p></div><div className="footer-column"><span className="eyebrow">EXPLORE</span>{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><span className="eyebrow">KEEP IN TOUCH</span><a href={instagramUrl} target="_blank" rel="noopener noreferrer">@deepa_jeweller <ArrowUpRight size={12} /></a><a href={buildWhatsAppLink(generalEnquiryMessage)} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <ArrowUpRight size={12} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Deepa Jewellers. All rights reserved.</span><span>MADE TO BE CHERISHED</span></div></footer>

      {floatingVisible && <a className="floating-enquire" href={buildWhatsAppLink(generalEnquiryMessage)} target="_blank" rel="noopener noreferrer"><span className="floating-enquire__dot" />Enquire on WhatsApp <ArrowUpRight size={14} /></a>}

      <dialog ref={dialogRef} className="product-dialog" onClose={() => setSelectedProduct(null)} onClick={(event) => { if (event.target === dialogRef.current) setSelectedProduct(null); }}>
        {selectedProduct && <div className="product-dialog__content"><button type="button" className="icon-button product-dialog__close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><X size={20} strokeWidth={1.4} /></button><div className="product-dialog__image"><img src={selectedProduct.image.replace("w=1000", "w=1200")} alt={selectedProduct.name} /></div><div className="product-dialog__details"><span className="eyebrow">{selectedProduct.category.toUpperCase()} · MADE WITH CARE</span><h2>{selectedProduct.name}</h2><p className="product-dialog__description">{selectedProduct.description}</p><div className="product-dialog__spec"><span>METAL &amp; CRAFT</span><p>{selectedProduct.metal}</p></div><p className="product-dialog__note">{selectedProduct.note}</p><p className="product-dialog__made">Made to order available</p><a className="button-outline" href={buildWhatsAppLink(productEnquiryMessage(selectedProduct.name, selectedProduct.category))} target="_blank" rel="noopener noreferrer">Enquire about this piece <ArrowUpRight size={15} /></a></div></div>}
      </dialog>
    </main>
  );
}

function ProductTile({ product, index, onOpen }: { product: JewelleryProduct; index: number; onOpen: () => void }) {
  return <article className={`product-tile product-tile--${index % 6} reveal`}>
    <button className="product-tile__image" type="button" onClick={onOpen} aria-label={`View ${product.name} details`}><img src={product.image} alt={`${product.name} — ${product.description}`} loading="lazy" /><span className="product-tile__view">VIEW PIECE <ArrowUpRight size={14} /></span></button>
    <div className="product-tile__meta"><div><button className="product-tile__name" type="button" onClick={onOpen}>{product.name}</button><p>{product.description}</p></div><a className="product-tile__enquire" href={buildWhatsAppLink(productEnquiryMessage(product.name, product.category))} target="_blank" rel="noopener noreferrer">Enquire Now <ArrowRight size={13} /></a></div>
  </article>;
}
