import { FormEvent, useMemo, useState } from 'react';

type Product = { id: number; name: string; blurb: string; category: string; size: string };
const packImage = `${import.meta.env.BASE_URL}sri-jothi-packaging.png`;
const products: Product[] = [
  { id: 1, name: 'Classic Plain Appalam', blurb: 'A familiar, crisp companion for everyday South Indian meals.', category: 'Classic', size: '200 g' },
  { id: 2, name: 'Masala Appalam', blurb: 'A flavourful option with a warm, spiced character.', category: 'Flavoured', size: '200 g' },
  { id: 3, name: 'Special Appalam', blurb: 'A special table-ready selection for gatherings and celebrations.', category: 'Special', size: '250 g' },
  { id: 4, name: 'Bulk & Wholesale Packs', blurb: 'Flexible supply options for food and retail businesses.', category: 'Wholesale', size: 'Enquire' },
];

const Icon = ({ name }: { name: 'bag' | 'menu' | 'search' | 'arrow' | 'close' | 'minus' | 'plus' }) => {
  const paths: Record<string, React.ReactNode> = {
    bag: <><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    minus: <path d="M6 12h12"/>,
    plus: <><path d="M6 12h12M12 6v12"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
};

function Brand() {
  return <button className="brand" onClick={() => location.hash = 'home'} aria-label="Sri Jothi Appalam home">
    <span className="brand-mark"><span>ஜோ</span></span>
    <span><b>SRI JOTHI</b><small>APPALAM</small></span>
  </button>;
}

function Button({ children, kind = 'primary', onClick, type = 'button' }: { children: React.ReactNode; kind?: string; onClick?: () => void; type?: 'button' | 'submit' }) {
  return <button type={type} className={`btn ${kind}`} onClick={onClick}>{children}</button>;
}

function ProductCard({ product, add, open }: { product: Product; add: (p: Product) => void; open: (p: Product) => void }) {
  return <article className="product-card">
    <button className="product-image" onClick={() => open(product)} aria-label={`View ${product.name}`}>
      <img src={packImage} alt="Sri Jothi Appalam packaging" />
      <span>{product.category}</span>
    </button>
    <div className="product-info">
      <small>{product.category}</small>
      <h3>{product.name}</h3>
      <p>{product.blurb}</p>
      <div className="card-bottom"><span className="pack">{product.size}</span><Button onClick={() => add(product)}>Add <Icon name="plus" /></Button></div>
    </div>
  </article>;
}

function Field({ label, name, type = 'text', required = true, children }: { label: string; name: string; type?: string; required?: boolean; children?: React.ReactNode }) {
  return <label><span>{label}{required && ' *'}</span>{children || <input name={name} type={type} required={required} />}</label>;
}

export default function App() {
  const [view, setView] = useState(location.hash.slice(1) || 'home');
  const [mobile, setMobile] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Product | null>(null);
  const [sent, setSent] = useState('');
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const go = (next: string) => { setView(next); setMobile(false); setSelected(null); location.hash = next; window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const add = (p: Product) => setCart(c => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
  const visible = useMemo(() => products.filter(p => (filter === 'All' || p.category === filter) && p.name.toLowerCase().includes(search.toLowerCase())), [filter, search]);
  const submit = (e: FormEvent, type: string) => { e.preventDefault(); setSent(type); };

  const Header = () => <header>
    <div className="nav shell">
      <Brand />
      <nav className={mobile ? 'open' : ''}>
        {['Home', 'Our Story', 'Products', 'Wholesale', 'Contact'].map(x => <button key={x} onClick={() => go(x === 'Our Story' ? 'about' : x.toLowerCase())}>{x}</button>)}
      </nav>
      <div className="nav-actions">
        <button className="icon-btn search-btn" aria-label="Search" onClick={() => go('products')}><Icon name="search" /></button>
        <button className="icon-btn bag" aria-label={`Cart with ${count} items`} onClick={() => go('cart')}><Icon name="bag" />{count > 0 && <b>{count}</b>}</button>
        <Button onClick={() => go('products')}>Shop now</Button>
        <button className="icon-btn menu" aria-label="Toggle menu" onClick={() => setMobile(!mobile)}><Icon name={mobile ? 'close' : 'menu'} /></button>
      </div>
    </div>
  </header>;

  const Footer = () => <footer>
    <div className="shell footer-grid"><div><Brand /><p>A beloved South Indian tradition, made for everyday tables and shared meals.</p></div>
      <div><h4>Explore</h4><button onClick={() => go('about')}>Our story</button><button onClick={() => go('products')}>Products</button><button onClick={() => go('wholesale')}>Wholesale</button></div>
      <div><h4>Help</h4><button onClick={() => go('contact')}>Contact</button><button>Privacy policy</button><button>Terms & conditions</button></div>
      <div><h4>Get in touch</h4><p>Phone number to be confirmed<br/>Email address to be confirmed<br/>Business address to be confirmed</p></div>
    </div><div className="shell copyright">© Sri Jothi Appalam. All rights reserved. <span>Made with tradition, served with joy.</span></div>
  </footer>;

  const Home = () => <main>
    <section className="hero"><div className="shell hero-grid">
      <div className="hero-copy"><div className="eyebrow">A South Indian favourite</div><h1>A Taste of <em>Tradition</em> in Every Crunch</h1>
        <p>Discover the timeless taste of appalam with Sri Jothi Appalam. A familiar favourite for everyday meals, family gatherings, and special occasions.</p>
        <div className="actions"><Button onClick={() => go('products')}>Explore our products <Icon name="arrow" /></Button><Button kind="secondary" onClick={() => go('wholesale')}>Wholesale enquiry</Button></div>
        <small className="support">Bringing a beloved South Indian tradition to your table.</small>
      </div>
      <div className="hero-art"><div className="sun"/><img src={packImage} alt="Sri Jothi Appalam traditional round packaging" /><div className="seal">CRISP<br/><b>&</b><br/>CLASSIC</div><div className="leaf"/></div>
    </div></section>
    <section className="highlights shell">{['A South Indian Favourite', 'Quality-Focused Products', 'For Homes & Businesses', 'Customer-Focused Service'].map((x,i)=><div key={x}><span>{['✦','◇','⌂','○'][i]}</span><p>{x}</p></div>)}</section>
    <section className="section shell"><div className="section-head"><div><div className="eyebrow">From our range</div><h2>Discover Our Appalam</h2><p>Find the right appalam for your table or business.</p></div><Button kind="text" onClick={() => go('products')}>View all products <Icon name="arrow"/></Button></div>
      <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} add={add} open={setSelected}/>)}</div>
    </section>
    <section className="story shell"><div className="story-image"><img src={packImage} alt="Sri Jothi Appalam packs with traditional artwork"/></div><div className="story-copy"><div className="eyebrow">Our story</div><h2>Tradition That Belongs on <em>Every Table</em></h2><p>At Sri Jothi Appalam, we celebrate the timeless taste of a South Indian favourite. Our goal is to bring appalam to everyday meals, family gatherings, and special occasions, while building lasting relationships with our customers.</p><Button kind="secondary" onClick={() => go('about')}>Discover our story <Icon name="arrow"/></Button></div></section>
    <section className="meal"><div className="shell meal-inner"><div><div className="eyebrow">A delicious companion</div><h2>Make Every Meal More Enjoyable</h2><p>From sambar rice and rasam rice to a traditional South Indian lunch, appalam adds a satisfying crunch to your meal.</p></div><div className="meal-art"><span className="plate"/><span className="appalam one"/><span className="appalam two"/></div></div></section>
    <WholesaleBand />
    <ContactBlock />
  </main>;

  const WholesaleBand = () => <section className="wholesale-band"><div className="shell band-grid"><div><div className="eyebrow">For business</div><h2>Your Appalam Supply Partner</h2><p>Are you a retailer, grocery store, hotel, restaurant, or distributor? Tell us about your requirements and explore supply options with Sri Jothi Appalam.</p><div className="actions"><Button kind="gold" onClick={() => go('wholesale')}>Enquire about wholesale <Icon name="arrow"/></Button><Button kind="outline" onClick={() => go('contact')}>Contact our team</Button></div></div><img src={packImage} alt="Sri Jothi Appalam wholesale product"/></div></section>;

  const ContactBlock = () => <section className="section shell contact"><div><div className="eyebrow">Contact us</div><h2>Let's Connect</h2><p>Have a product question or business enquiry? We'd love to hear from you.</p><div className="contact-note"><b>Official details coming soon</b><span>Phone, email, address and WhatsApp details will be added after verification.</span></div></div>
    <form onSubmit={e => submit(e, 'contact')}><div className="form-grid"><Field label="Full name" name="name"/><Field label="Phone number" name="phone" type="tel"/><Field label="Email address" name="email" type="email"/><Field label="Enquiry type" name="type"><select name="type" required><option>Product Enquiry</option><option>Wholesale Enquiry</option><option>Distribution Partnership</option><option>General Enquiry</option></select></Field></div><Field label="Message" name="message"><textarea name="message" rows={4} required placeholder="How can we help?"/></Field><Button type="submit">Submit enquiry <Icon name="arrow"/></Button>{sent === 'contact' && <p className="success">Demo submitted. Connect a form service to send real enquiries.</p>}</form>
  </section>;

  const Products = () => <main className="page shell"><div className="page-title"><div className="eyebrow">Shop the range</div><h1>Our Appalam Collection</h1><p>Explore appalam options for your home, retail store, or food business.</p></div>
    <div className="catalog-tools"><label className="searchbox"><Icon name="search"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products"/></label><div className="filters">{['All','Classic','Flavoured','Special','Wholesale'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div>
    {visible.length ? <div className="product-grid">{visible.map(p=><ProductCard key={p.id} product={p} add={add} open={setSelected}/>)}</div> : <div className="empty"><h2>No products found</h2><p>Try a different search or category.</p><Button onClick={()=>{setSearch('');setFilter('All')}}>Clear filters</Button></div>}
  </main>;

  const Detail = ({ p }: { p: Product }) => <main className="page shell detail"><div className="detail-image"><img src={packImage} alt={p.name}/></div><div><button className="back" onClick={()=>setSelected(null)}>← Back to products</button><div className="eyebrow">{p.category}</div><h1>{p.name}</h1><p className="lead">{p.blurb}</p><div className="facts"><span>Pack size <b>{p.size}</b></span><span>Availability <b>Confirm before ordering</b></span></div><p className="disclaimer">Pricing, ingredients, allergens, nutrition and storage details will appear here once verified from the product label.</p><Button onClick={()=>add(p)}>Add to cart <Icon name="bag"/></Button></div></main>;

  const Cart = () => <main className="page shell"><div className="page-title"><div className="eyebrow">Your order</div><h1>Shopping Cart</h1></div>{count===0?<div className="empty"><h2>Your cart is waiting</h2><p>Add an appalam option to begin your order.</p><Button onClick={()=>go('products')}>Explore products</Button></div>:<div className="cart-layout"><div>{products.filter(p=>cart[p.id]).map(p=><div className="cart-row" key={p.id}><img src={packImage} alt=""/><div><h3>{p.name}</h3><p>{p.size} · Pricing to be confirmed</p><button className="remove" onClick={()=>setCart(c=>{const n={...c};delete n[p.id];return n})}>Remove</button></div><div className="qty"><button onClick={()=>setCart(c=>({...c,[p.id]:Math.max(1,c[p.id]-1)}))}><Icon name="minus"/></button><b>{cart[p.id]}</b><button onClick={()=>add(p)}><Icon name="plus"/></button></div></div>)}</div><aside className="summary"><h2>Order summary</h2><p><span>Items</span><b>{count}</b></p><p><span>Subtotal</span><b>Calculated when pricing is configured</b></p><Button onClick={()=>go('checkout')}>Proceed to demo checkout <Icon name="arrow"/></Button></aside></div>}</main>;

  const Checkout = () => <main className="page shell"><div className="page-title"><div className="eyebrow">Demo checkout</div><h1>Delivery Details</h1><p>No payment will be taken. Live pricing and payment are not yet configured.</p></div><form className="checkout" onSubmit={e=>submit(e,'order')}><div className="form-grid"><Field label="Full name" name="name"/><Field label="Phone" name="phone"/><Field label="Email" name="email" type="email"/><Field label="PIN code" name="pin"/></div><Field label="Delivery address" name="address"><textarea name="address" required rows={4}/></Field><Button type="submit">Place demo order</Button>{sent==='order'&&<p className="success">Demo order recorded in this preview only. No payment was taken and no real order was sent.</p>}</form></main>;

  const Wholesale = () => <main><section className="wholesale-hero"><div className="shell"><div className="eyebrow">Wholesale partnerships</div><h1>Appalam Supply for Your Business</h1><p>Looking for appalam for your store, hotel, restaurant, or distribution business? Share your requirements with Sri Jothi Appalam.</p></div></section><section className="section shell wholesale-form"><div><h2>Tell us about your requirements</h2><p>Complete the form and our team can review your business needs once a submission service is connected.</p></div><form onSubmit={e=>submit(e,'wholesale')}><div className="form-grid"><Field label="Buyer type" name="buyer"><select required><option value="">Select buyer type</option><option>Retailer / Grocery</option><option>Hotel / Restaurant</option><option>Distributor</option></select></Field><Field label="Business name" name="business"/><Field label="Contact person" name="contact"/><Field label="Phone number" name="phone" type="tel"/><Field label="Email" name="email" type="email"/><Field label="Business location" name="location"/><Field label="Product category" name="category"/><Field label="Estimated quantity" name="quantity"/><Field label="Order frequency" name="frequency"><select required><option value="">Select frequency</option><option>One time</option><option>Weekly</option><option>Monthly</option></select></Field></div><Field label="Additional requirements" name="message" required={false}><textarea rows={4}/></Field><Button type="submit">Request wholesale pricing <Icon name="arrow"/></Button>{sent==='wholesale'&&<p className="success">Demo enquiry validated. Connect a form service before using this for real submissions.</p>}</form></section></main>;

  const About = () => <main><section className="about-hero shell"><div><div className="eyebrow">Our story</div><h1>Made for the Meals That Bring Us Together</h1><p>We celebrate appalam as a familiar part of South Indian food culture—simple, joyful and welcome at the table.</p></div><img src={packImage} alt="Sri Jothi Appalam brand packaging"/></section><section className="section shell prose"><h2>Tradition, thoughtfully presented</h2><p>Our goal is to bring appalam to everyday meals, family gatherings and special occasions, while building lasting relationships with our customers. Verified details about our history, location and process will be added as the brand story develops.</p></section><WholesaleBand/></main>;

  let content = selected ? <Detail p={selected}/> : view==='products'?<Products/>:view==='cart'?<Cart/>:view==='checkout'?<Checkout/>:view==='wholesale'?<Wholesale/>:view==='about'?<About/>:view==='contact'?<main className="page"><ContactBlock/></main>:<Home/>;
  return <><Header/>{content}<Footer/></>;
}
