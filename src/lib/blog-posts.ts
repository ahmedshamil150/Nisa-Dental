export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  coverIcon: string
  category: string
  date: string
  readMinutes: number
  content: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "root-canal-cost-sialkot",
    title: "Root Canal Treatment in Sialkot: Cost, Steps and What to Expect",
    excerpt:
      "Everything you need to know about root canal treatment at Nisa Dental — pricing in Sialkot, how many visits it takes, and how we keep it comfortable.",
    coverIcon: "dentist",
    category: "Treatments",
    date: "2026-08-01",
    readMinutes: 5,
    content: [
      "Root canal treatment is one of the most misunderstood dental procedures. In reality, it is a straightforward, pain-relieving treatment that saves a tooth that would otherwise need to be removed.",
      "At Nisa Dental in Sialkot, a root canal costs between PKR 6,000 and PKR 8,000 depending on the tooth. Front teeth are simpler and lower in cost, while molars — which have more roots — can take longer and cost more.",
      "The procedure is done under local anaesthesia, so you feel no pain during treatment. Our modern rotary instruments and clean, well-equipped operatories keep appointments efficient and comfortable.",
      "Most root canals are completed in one to two visits. After the treatment, a crown is usually recommended to protect the tooth so it can continue functioning normally for years.",
      "The classic sign that you may need a root canal is a severe, lingering toothache — especially pain that worsens when you bite, or wakes you up at night. If you are experiencing this, book an appointment for an examination and X-ray before the infection spreads.",
    ],
  },
  {
    slug: "scaling-polishing-importance",
    title: "Why Scaling and Polishing Should Be Part of Your Routine",
    excerpt:
      "Tartar can't be removed with a toothbrush. Here's why professional scaling and polishing every 6–12 months keeps your gums and teeth healthy.",
    coverIcon: "clean_hands",
    category: "Oral Health",
    date: "2026-07-20",
    readMinutes: 4,
    content: [
      "No matter how well you brush, plaque eventually hardens into tartar that only a dental professional can remove. Left in place, tartar causes gum inflammation, bleeding, bad breath and eventually gum disease and bone loss.",
      "Professional scaling and polishing at Nisa Dental removes tartar above and below the gum line, then polishes the teeth to leave them smooth and bright. It costs PKR 6,000 and takes about 30 minutes.",
      "For most people, a cleaning every six months is ideal. If you have had gum disease, your dentist may recommend a shorter interval, such as every four months.",
      "After a professional cleaning, your mouth feels fresh, your gums stop bleeding, and your smile looks noticeably brighter. It is one of the most cost-effective investments in your oral health.",
    ],
  },
  {
    slug: "braces-vs-implants-fixed-teeth",
    title: "Straighten Your Smile or Replace Missing Teeth: Your Options",
    excerpt:
      "Braces for misalignment and implants for missing teeth — understand your treatment options at Nisa Dental and what they cost in Sialkot.",
    coverIcon: "mood",
    category: "Treatments",
    date: "2026-07-10",
    readMinutes: 6,
    content: [
      "Two of the most common questions we hear are about straightening teeth and replacing missing teeth. Both are transformative, but they solve very different problems.",
      "Orthodontic braces at Nisa Dental start from PKR 50,000. Braces correct crowding, gaps, bite problems and crooked teeth. Modern brackets are smaller and more comfortable than ever, and most cases take 12 to 24 months.",
      "Dental implants start from PKR 60,000. An implant replaces the root of a missing tooth with a titanium post, onto which a natural-looking crown is placed. Unlike a bridge, an implant does not touch the neighbouring teeth and can last for decades with good care.",
      "If your concern is alignment, braces are the right conversation. If you have one or more missing teeth, an implant consultation will assess your bone and plan the treatment.",
      "Book a consultation at our Aimnabad Road clinic and we will assess your smile, take any needed X-rays, and give you a clear treatment plan with honest pricing.",
    ],
  },
  {
    slug: "when-see-dentist-immediately",
    title: "5 Warning Signs You Should See a Dentist Right Away",
    excerpt:
      "Tooth pain, bleeding gums, bad breath that won't go away — these signs shouldn't wait. Know when it's time to book a dental appointment.",
    coverIcon: "notification_important",
    category: "Oral Health",
    date: "2026-06-28",
    readMinutes: 4,
    content: [
      "Dental problems rarely get better on their own — they get worse. Recognising the warning signs early can save your tooth, your money and a lot of discomfort.",
      "1. Toothache that lingers. Pain that continues after you stop eating, or that wakes you at night, often means the nerve is involved and you may need a root canal.",
      "2. Bleeding gums. Gums that bleed when you brush are the earliest sign of gum disease. Caught early, it is completely reversible.",
      "3. Bad breath that won't improve. Persistent bad breath or a bad taste is frequently caused by decay or gum disease below the surface.",
      "4. Sensitivity to hot and cold. Sharp pain when drinking something hot or cold can indicate decay, a cracked tooth or an exposed root.",
      "5. A broken or loose tooth. Trauma or a cracked tooth needs prompt attention to prevent infection and further damage.",
      "At Nisa Dental, we see urgent cases quickly. Call 0334-1710086 or book an appointment and we will fit you in as soon as possible.",
    ],
  },
]

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}
