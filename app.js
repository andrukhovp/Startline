(() => {
  "use strict";
  const claudeUse = (name) => (window.claude && window.claude.use ? window.claude.use(name).catch(() => null) : Promise.resolve(null));
  // The same app runs inside claude.ai and as a stand-alone web app. The web
  // app's platform layer (platform.js) adds sign-up, sign-in and installing.
  const PLAT = window.startlinePlatform || null;
  const WEB = !!PLAT, ACCOUNTS = !!(PLAT && PLAT.accounts);
  // ---------------------------------------------------------------------------
  // Sources. Every fact in the guide links back to one of these.
  // Prices and rules were checked in October 2026.
  // ---------------------------------------------------------------------------
  const CHECKED = "October 2026";
  const S = {
    shopPricing: ["Shopify: pricing", "https://www.shopify.com/pricing"],
    shopTrial: ["Shopify: free trial", "https://www.shopify.com/free-trial-offer"],
    shopPolicies: ["Shopify Help: store policies", "https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos"],
    shopLaunch: ["Shopify Help: prepare to launch", "https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-prepare-for-launch"],
    shopTest: ["Shopify Help: test orders", "https://help.shopify.com/en/manual/checkout-settings/test-orders"],
    shopPayouts: ["Shopify Help: payout timing", "https://help.shopify.com/en/manual/payments/shopify-payments/payouts/payout-timing"],
    shopDrop: ["Shopify Help: dropshipping legal considerations", "https://help.shopify.com/en/manual/compliance/legal/dropshipping"],
    shopSuppliers: ["Shopify Help: choosing suppliers", "https://help.shopify.com/en/manual/products/dropshipping/creating-a-product-line/choosing-suppliers"],
    shopIP: ["Shopify Help: intellectual property", "https://help.shopify.com/en/manual/compliance/intellectual-property"],
    shopGoogle: ["Shopify Help: free listings on Google", "https://help.shopify.com/en/manual/online-sales-channels/marketplaces/google/shopping-on-google/google-listings"],
    shopCollective: ["Shopify Help: Collective requirements", "https://help.shopify.com/en/manual/online-sales-channels/shopify-collective/retailers/requirements-and-considerations"],
    shopCourse: ["Shopify Learn: Dropshipping 101", "https://www.shopify.com/learn/course/dropshipping-101-build-your-first-online-store/sign-up-for-shopify"],
    shopDigital: ["Shopify App Store: Digital Downloads", "https://apps.shopify.com/digital-downloads"],
    dsers: ["DSers: pricing", "https://www.dsers.com/pricing"],
    dsersApp: ["DSers on the Shopify App Store", "https://apps.shopify.com/dsers"],
    cj: ["CJdropshipping: Shopify integration", "https://cjdropshipping.com/integrations/shopify"],
    spocket: ["Spocket: pricing", "https://www.spocket.co/pricing"],
    autods: ["AutoDS on the Shopify App Store", "https://apps.shopify.com/autods"],
    collective: ["Shopify Collective", "https://www.shopify.com/collective"],
    printful: ["Printful: pricing", "https://www.printful.com/pricing"],
    printfulAcademy: ["Printful Academy", "https://www.printful.com/academy"],
    printfulDesign: ["Printful Academy: design courses", "https://www.printful.com/academy/design"],
    printify: ["Printify: pricing", "https://printify.com/pricing/"],
    etsyDrop: ["Etsy Help: drop shipping and reselling", "https://help.etsy.com/hc/en-us/articles/23948763872151-Does-Etsy-Allow-Drop-Shipping-or-Reselling"],
    etsyFees: ["Etsy: Fees & Payments Policy", "https://www.etsy.com/legal/fees/"],
    etsySell: ["Etsy: sell on Etsy", "https://www.etsy.com/sell"],
    etsyHandbook: ["Etsy Seller Handbook", "https://www.etsy.com/seller-handbook"],
    etsyDigital: ["Etsy Seller Handbook: how to sell digital downloads", "https://www.etsy.com/seller-handbook/article/47330319230"],
    etsySellerPolicy: ["Etsy: Seller Policy", "https://www.etsy.com/legal/sellers"],
    ebayDrop: ["eBay: dropshipping and product sourcing", "https://www.ebay.com/help/selling/posting-items/setting-postage-options/drop-shipping?id=4176"],
    ebayFees: ["eBay: selling fees", "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822"],
    ebayStart: ["eBay: start selling", "https://www.ebay.com/help/selling/selling-guides-tips/selling?id=4081"],
    amzDrop: ["Amazon: what is dropshipping", "https://sell.amazon.com/learn/what-is-dropshipping"],
    amzPricing: ["Amazon: selling plans and fees", "https://sell.amazon.com/pricing"],
    amzAssoc: ["Amazon Associates", "https://affiliate-program.amazon.com/"],
    amzAssocPart: ["Amazon Associates: participation requirements", "https://affiliate-program.amazon.com/help/operating/participation/"],
    amzAssocAgree: ["Amazon Associates: Operating Agreement", "https://affiliate-program.amazon.com/help/operating/agreement"],
    amzAssocUpdates: ["Amazon Associates: Operating Agreement updates", "https://affiliate-program.amazon.com/help/operating/compare"],
    ttsHome: ["TikTok Shop US: sell on TikTok Shop", "https://seller.tiktok.com/"],
    ttsFulfill: ["TikTok Shop US: Fulfillment Policy", "https://seller-us.tiktok.com/university/essay?knowledge_id=3995852763301633&lang=en"],
    ttsIndividual: ["TikTok Shop US: register as an individual", "https://seller-us.tiktok.com/university/essay?knowledge_id=6837894379964161&lang=en"],
    ttsCreator: ["TikTok Shop US: before becoming a TikTok Shop creator", "https://seller-us.tiktok.com/university/essay?knowledge_id=7608640301074219&lang=en"],
    ttsAcademy: ["TikTok Shop Academy", "https://seller-us.tiktok.com/university/home?default_language=en"],
    ttAcademy: ["TikTok Academy", "https://ads.tiktok.com/business/en-US/academy"],
    ttBudget: ["TikTok Ads Help: budget", "https://ads.tiktok.com/help/article/budget"],
    ttTop: ["TikTok Creative Center: Top Products", "https://ads.tiktok.com/business/creativecenter/top-products/pc/en"],
    ttTopHelp: ["TikTok Ads Help: about Top Products", "https://ads.tiktok.com/help/article/top-products?lang=en"],
    awinJoin: ["Awin: how to join as a publisher", "https://success.awin.com/s/article/How-do-I-join-Awin-as-a-Publisher?language=en_US"],
    awinGuide: ["Awin: how to start affiliate marketing", "https://www.awin.com/us/how-to-use-awin/awin-guide-on-how-to-start-affiliate-marketing"],
    impact: ["impact.com: affiliate partners", "https://impact.com/partners/affiliate-partners/"],
    impactAcademy: ["impact.com: Partnerships Experience Academy", "https://impact.com/partnerships-experience-academy/"],
    cjAff: ["CJ: content publishers", "https://www.cj.com/content-publishers"],
    pinterestRules: ["Pinterest: Commercial and Branded Content Guidelines", "https://policy.pinterest.com/en/commercial-and-branded-content-guidelines"],
    ftcInfluencer: ["FTC: Disclosures 101 for social media influencers", "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers"],
    ftcEndorse: ["FTC: Endorsement Guides, what people are asking", "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking"],
    gumroad: ["Gumroad: pricing", "https://gumroad.com/pricing"],
    payhip: ["Payhip: pricing", "https://payhip.com/pricing"],
    mercariFees: ["Mercari: fees", "https://www.mercari.com/us/help_center/article/169/"],
    poshFees: ["Poshmark: selling fees", "https://support.poshmark.com/s/article/297755057?language=en_US"],
    poshStart: ["Poshmark: get started", "https://poshmark.com/posh_guide/get_started_on_poshmark"],
    irs1099k: ["IRS: understanding your Form 1099-K", "https://www.irs.gov/businesses/understanding-your-form-1099-k"],
    irs1099kFaq: ["IRS: Form 1099-K threshold reverts to $20,000", "https://www.irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000"],
    metaLib: ["Meta Ad Library", "https://www.facebook.com/adlibrary"],
    metaLibHelp: ["Meta Help: the Ad Library", "https://www.facebook.com/help/259468828226154"],
    metaBudget: ["Meta Help: minimum budgets", "https://www.facebook.com/business/help/203183363050448"],
    metaCourse1: ["Meta Blueprint: Get started with advertising on Facebook and Instagram", "https://www.facebookblueprint.com/student/path/211543-meta-advertising-course"],
    metaCourse2: ["Meta Blueprint: Getting started with Meta Ads Manager", "https://www.facebookblueprint.com/student/path/219703-ads-manager-basics"],
    skillshop: ["Google Skillshop: Google Ads training", "https://skillshop.withgoogle.com/googleads/"],
    trends: ["Google Trends", "https://trends.google.com/trends/explore"],
    trendsHelp: ["Google Trends Help: compare terms", "https://support.google.com/trends/answer/4359550?hl=en"],
    googleApp: ["Google & YouTube app for Shopify", "https://apps.shopify.com/google"],
    canva: ["Canva: pricing", "https://www.canva.com/pricing/"],
    canvaLicense: ["Canva: licensing explained", "https://www.canva.com/licensing-explained/"],
    ftcMail: ["FTC: business guide to the Mail, Internet, or Telephone Order Merchandise Rule", "https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule"],
    ftcScam: ["FTC: when a business offer or coaching program is a scam", "https://consumer.ftc.gov/articles/when-business-offer-or-coaching-program-scam"],
    irsEin: ["IRS: get an employer identification number", "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number"],
    sbaLicense: ["SBA: apply for licenses and permits", "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits"],
    sbaStructure: ["SBA: choose a business structure", "https://www.sba.gov/starting-business/choose-your-business-structure"],
    hmrcAllow: ["GOV.UK: tax-free trading allowance", "https://www.gov.uk/guidance/tax-free-allowances-on-property-and-trading-income"],
    hmrcOnline: ["GOV.UK: income from online platforms", "https://www.gov.uk/guidance/check-if-you-need-to-tell-hmrc-about-your-income-from-online-platforms"],
    fiverrHow: ["Fiverr Help: how Fiverr works for freelancers", "https://help.fiverr.com/hc/en-us/articles/34069565843985-How-Fiverr-works-for-freelancers"],
    fiverrOrders: ["Fiverr Help: managing your orders", "https://help.fiverr.com/hc/en-us/articles/360010639617-Managing-your-orders-A-freelancer-s-guide-to-the-Fiverr-order-process"],
    fiverrVsUpwork: ["Fiverr: Fiverr vs. Upwork", "https://www.fiverr.com/resources/guides/business/fiverr-vs-upwork"],
    upworkFee: ["Upwork Help: the freelancer service fee", "https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee"],
    upworkConnects: ["Upwork Help: understanding Connects", "https://support.upwork.com/hc/en-us/articles/211062898-Understanding-and-using-Connects"],
    upworkFree: ["Upwork: is Upwork free to join?", "https://www.upwork.com/resources/is-upwork-free"],
    upworkRates: ["Upwork: how to set your freelance rate", "https://www.upwork.com/resources/how-to-set-your-freelance-rate"],
    ytYpp: ["YouTube Help: Partner Program overview and eligibility", "https://support.google.com/youtube/answer/72851?hl=en"],
    ytYppJoin: ["YouTube: join the YouTube Partner Program", "https://www.youtube.com/creators/earn/youtube-partner-program/"],
    ytBlog: ["YouTube Blog: the Partner Program, explained", "https://blog.youtube/creator-and-artist-stories/youtube-partner-program-explained/"],
    ttRewards: ["TikTok Support: Creator Rewards Program", "https://support.tiktok.com/en/business-and-creator/creator-rewards-program/creator-rewards-program"],
    ttRewardsAcademy: ["TikTok Creator Academy: Creator Rewards Program", "https://www.tiktok.com/creator-academy/article/creator-rewards-program"],
    ttRewardsTerms: ["TikTok: Creator Rewards Program terms (US)", "https://www.tiktok.com/legal/page/global/creator-rewards-program-us/en"],
    teachable: ["Teachable: pricing", "https://www.teachable.com/pricing"],
    teachableFees: ["Teachable Help: fees", "https://support.teachable.com/en/articles/11682553-teachable-fees"],
    thinkific: ["Thinkific: pricing", "https://www.thinkific.com/pricing/"],
    thinkificFaq: ["Thinkific: FAQ", "https://www.thinkific.com/faq/"],
    thinkificCourse: ["Thinkific: The Fast Track (free course)", "https://training.thinkific.com/courses/fast-track"],
    kdp: ["Amazon Kindle Direct Publishing", "https://kdp.amazon.com/"],
    kdpEarn: ["KDP: self-publishing", "https://kdp.amazon.com/en_US/earn"],
    kdpEbook: ["KDP Help: eBook royalties", "https://kdp.amazon.com/en_US/help/topic/G200644210"],
    kdpPaper: ["KDP Help: paperback royalty", "https://kdp.amazon.com/en_US/help/topic/G201834330"],
    kdpPrint: ["KDP Help: paperback printing cost", "https://kdp.amazon.com/en_US/help/topic/G201834340"],
    kdpContent: ["KDP Help: content guidelines", "https://kdp.amazon.com/en_US/help/topic/G200672390"],
    substackCost: ["Substack Help: how much does Substack cost?", "https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost"],
    beehiivPlans: ["beehiiv Help: plan types and pricing", "https://www.beehiiv.com/support/article/23874462928663-plan-types-and-subscriber-plan-tier-pricing"],
    beehiivPricing: ["beehiiv: pricing", "https://www.beehiiv.com/pricing"],
    canSpam: ["FTC: CAN-SPAM Act compliance guide for business", "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business"],
    fba: ["Amazon: Fulfillment by Amazon", "https://sell.amazon.com/fulfillment-by-amazon"],
    fbaGuide: ["Amazon: a guide to FBA fees", "https://sell.amazon.com/blog/fba-fees-guide"],
    fbaCalc: ["Amazon: estimate fees and costs", "https://sell.amazon.com/pricing/estimate"],
    brandRegistry: ["Amazon Brand Registry", "https://sell.amazon.com/brand-registry"],
    irsSE: ["IRS: self-employment tax", "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes"],
    irsEst: ["IRS: Form 1040-ES estimated tax", "https://www.irs.gov/pub/irs-pdf/f1040es.pdf"],
    etsyCreativity: ["Etsy: Creativity Standards", "https://www.etsy.com/legal/creativity/"],
    etsyPartners: ["Etsy Help: working with production partners", "https://help.etsy.com/hc/en-us/articles/360000336547-Working-with-Production-Partners-on-Etsy"],
    cpscCpc: ["CPSC: Children's Product Certificate", "https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate"],
    cpscSmall: ["CPSC: small batch manufacturers and third-party testing", "https://www.cpsc.gov/Business--Manufacturing/Small-Business-Resources/Small-Batch-Manufacturers-and-Third-Party-"],
    cpscOnline: ["CPSC: online sellers safety guide FAQs", "https://www.cpsc.gov/FAQ/Online-Sellers-Safety-Guide-FAQs"],
    cpscGcc: ["CPSC: General Certificate of Conformity", "https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/General-Certificate-of-Conformity"],
    shopifyAdmin: ["Shopify admin", "https://admin.shopify.com/"],
    metaAds: ["Meta Ads Manager", "https://adsmanager.facebook.com/"],
    ttAds: ["TikTok Ads Manager", "https://ads.tiktok.com/"],
  };
  const link = (k, label) => ({ label: label || S[k][0], url: S[k][1] });

  const AREAS = [
    ["learning", "Learning"], ["legal", "Business & legal"], ["research", "Research"], ["suppliers", "Suppliers & sourcing"],
    ["store", "Store or account setup"], ["listings", "Listings"], ["content", "Content"], ["marketing", "Marketing & ads"],
    ["orders", "Orders & shipping"], ["support", "Customer service"], ["finance", "Money"],
  ];
  const AREA = Object.fromEntries(AREAS);
  const STATUSES = [["todo", "To do"], ["doing", "In progress"], ["waiting", "Waiting on someone"], ["done", "Done"]];
  const PRIO_RANK = { high: 0, med: 1, low: 2 };

  // Ways to make money, and where each one happens.
  const MODELS = [
    ["supplier", "Dropshipping", "Sell products a supplier ships for you"],
    ["pod", "Print-on-demand", "Your designs, printed and shipped per order"],
    ["affiliate", "Affiliate marketing", "Earn commission recommending other brands' products"],
    ["digital", "Digital products", "Templates, printables, guides: nothing to ship"],
    ["resell", "Reselling", "Buy secondhand or on clearance, sell for more"],
    ["freelance", "Freelancing", "Sell a skill: design, writing, editing, admin"],
    ["creator", "Content creator", "Videos that earn from platforms and sponsors"],
    ["courses", "Online courses", "Teach what you know"],
    ["books", "Self-publishing books", "eBooks and paperbacks on Amazon KDP"],
    ["newsletter", "Newsletter", "Paid subscriptions and sponsorships"],
    ["fba", "Amazon FBA (own brand)", "Buy stock, Amazon stores and ships it"],
    ["handmade", "Handmade products", "Things you make yourself"],
  ];
  const ADS_MODELS = ["supplier", "pod", "digital", "courses", "fba", "handmade"];
  const MODEL_NAME = Object.fromEntries(MODELS.map(([k, v]) => [k, v]));
  const CHANNEL_NAME = {
    shopify: "Shopify", etsy: "Etsy", tiktok: "TikTok Shop", ebay: "eBay", amazon: "Amazon",
    aff_amazon: "Amazon Associates", aff_tiktok: "TikTok Shop affiliate", aff_network: "Affiliate networks",
    gumroad: "Gumroad", payhip: "Payhip", mercari: "Mercari", poshmark: "Poshmark",
    fiverr: "Fiverr", upwork: "Upwork", direct: "Own clients", yt: "YouTube", tt_creator: "TikTok Creator Rewards",
    teachable: "Teachable", thinkific: "Thinkific", kdp: "Amazon KDP", substack: "Substack", beehiiv: "beehiiv", amz_fba: "Amazon FBA",
  };
  const CHANNELS = {
    supplier: [["shopify", "My own store (Shopify)", "Your website and checkout"], ["tiktok", "TikTok Shop", "US rules, fast shipping"], ["ebay", "eBay", "Wholesale supplier needed"], ["amazon", "Amazon", "You're seller of record"]],
    pod: [["shopify", "My own store (Shopify)", "Your website and checkout"], ["etsy", "Etsy", "Your own designs only"], ["tiktok", "TikTok Shop", "US rules"]],
    affiliate: [["aff_amazon", "Amazon Associates", "Links to Amazon products"], ["aff_tiktok", "TikTok Shop affiliate", "Promote products in TikTok videos"], ["aff_network", "Brand programs", "Awin, impact.com, CJ"]],
    digital: [["etsy", "Etsy", "Made or designed by you"], ["shopify", "My own store (Shopify)", "With a downloads app"], ["gumroad", "Gumroad", "No monthly fee"], ["payhip", "Payhip", "Free plan available"]],
    resell: [["ebay", "eBay", "Huge audience"], ["mercari", "Mercari", "No listing fees"], ["poshmark", "Poshmark", "Clothing and more"]],
    freelance: [["fiverr", "Fiverr", "Clients buy your packages"], ["upwork", "Upwork", "You send proposals"], ["direct", "My own clients", "Referrals, social, your own site"]],
    creator: [["yt", "YouTube", "Partner Program from 500 subscribers"], ["tt_creator", "TikTok Creator Rewards", "10,000 followers needed"]],
    courses: [["teachable", "Teachable", "7-day free trial"], ["thinkific", "Thinkific", "30-day free trial"], ["payhip", "Payhip", "Free plan available"]],
    books: [["kdp", "Amazon KDP", "eBooks and paperbacks"]],
    newsletter: [["substack", "Substack", "Free; 10% of paid revenue"], ["beehiiv", "beehiiv", "Free up to 2,500 subscribers"]],
    fba: [["amz_fba", "Amazon FBA", "Professional plan needed"]],
    handmade: [["etsy", "Etsy", "Made by you, your own photos"], ["shopify", "My own store (Shopify)", "Your website and checkout"]],
  };
  const SHIP = (p) => p.model === "supplier" || p.model === "pod";
  const isMarket = (p) => p.channel !== "shopify";

  // ---------------------------------------------------------------------------
  // The 7-day guide. Each step becomes a task when it applies to your answers.
  // when(p): p = {level, model, channel, country, ads}
  // ---------------------------------------------------------------------------
  const ul = (items) => "<ul>" + items.filter(Boolean).map((i) => "<li>" + i + "</li>").join("") + "</ul>";
  const checked = `<p class="small muted">Prices and limits checked ${CHECKED}. They change; confirm on the linked page before you pay.</p>`;

  const RULES = {
    shopify: {
      text: ul([
        "Shopify allows dropshipping, but you're held to the same rules as any retailer. If a product fails the safety standards where it's shipped, you can be liable, and you must remove recalled products.",
        "Listings that infringe a trademark or copyright are taken down, and repeated infringement can get a store closed. Shopify Payments won't process sales of counterfeit goods.",
        "Shopify advises telling customers when a third party ships from another location.",
      ]),
      src: ["shopDrop", "shopIP"],
    },
    etsy: {
      text: ul([
        "Etsy doesn't allow drop shipping, apart from craft and party supplies, and doesn't allow reselling mass-produced items.",
        "Print-on-demand is allowed through a production partner <b>only</b> when the design is your original or the buyer personalises it.",
        "You must disclose that a production partner makes the item and say accurately where it ships from.",
      ]),
      src: ["etsyDrop"],
    },
    tiktok: {
      text: ul([
        "TikTok Shop US regular orders must be marked In Transit within 2 business days and Delivered within 6 business days of Awaiting Shipment. An order that isn't moved to Awaiting Collection within 5 business days is cancelled automatically.",
        "Carrier delays still count against you. Pick suppliers that can meet these deadlines, which in practice means stock shipping from inside the US.",
        "Business days exclude weekends and US federal holidays.",
      ]),
      src: ["ttsFulfill"],
    },
    ebay: {
      text: ul([
        "Dropshipping is allowed only if you own the items before listing or have an agreement with a wholesale supplier to list and sell their items.",
        "Listing an item you don't have and then buying it from another retailer or marketplace that ships to your buyer isn't allowed. Another site's user agreement doesn't count as a supplier agreement.",
        "You stay responsible for delivery within the time you state and for the buyer's satisfaction. Breaking the rules can lead to hidden listings, lower seller ratings or suspension.",
      ]),
      src: ["ebayDrop"],
    },
    amazon: {
      text: ul([
        "You must be the seller of record: the only seller named on packing slips, invoices and packaging.",
        "Remove any supplier or third-party seller information before an order ships, and handle returns yourself.",
        "Buying from another online retailer and having it ship to your customer breaks the policy if you aren't identified as the seller of record.",
      ]),
      src: ["amzDrop"],
    },
  };

  const FEE_TEXT = {
    shopify: "Shopify Payments on Basic (US online cards): 2.9% + 30¢ per order. With another payment provider, Shopify adds 2% on Basic on top of that provider's fees.",
    etsy: "Etsy (US): 6.5% transaction fee on the order total including shipping, plus 3% + $0.25 payment processing, plus $0.20 per listing.",
    ebay: "eBay, most categories: 13.6% of the total sale up to $7,500 (shipping and sales tax included), plus $0.30 per order of $10 or less or $0.40 per order over $10.",
    tiktok: "TikTok Shop US: its seller page lists a 6% commission per sale; check your category's rate in Seller Center.",
    amazon: "Amazon: referral fee by category (most are 8% to 15%, with a minimum, often $0.30), plus $0.99 per unit on the Individual plan or $39.99 a month on Professional.",
    gumroad: "Gumroad: 10% + 50¢ per direct sale with no monthly fee; 30% on sales to new customers who find you through Gumroad Discover.",
    payhip: "Payhip: Free plan takes 5% per sale, Plus ($29/month) 2%, Pro ($99/month) 0%. PayPal or Stripe processing is charged on top at their standard rates.",
    mercari: "Mercari: no listing fee; a 10% selling fee on the item price plus any shipping the buyer pays.",
    poshmark: "Poshmark (US): a flat $2.95 on sales under $15, and 20% on sales of $15 or more. No listing or monthly fees.",
  };
  const FEE_SRC = { shopify: "shopPricing", etsy: "etsyFees", ebay: "ebayFees", tiktok: "ttsHome", amazon: "amzPricing", gumroad: "gumroad", payhip: "payhip", mercari: "mercariFees", poshmark: "poshFees" };

  const DISCLOSE_TEXT = (p) => ul([
    "Put the disclosure next to the recommendation, where people can't miss it. A note only in your bio or profile, at the end of a post, or behind a “more” tap isn't enough.",
    "Use plain words such as “ad”, “sponsored” or “I earn a commission if you buy through my links”. Tags like “#sp” or “#partner” aren't clear enough.",
    "In videos, say it out loud and show it on screen, not only in the description. In live streams, repeat it from time to time.",
    "A platform's own disclosure tool doesn't take the responsibility off you; add your own disclosure too.",
    p.channel === "aff_amazon" ? "Amazon also requires this exact statement on your site or account: “As an Amazon Associate I earn from qualifying purchases.”" : "",
    "On Pinterest, affiliate Pins must be your own original content, links should be used in moderation, and some link shorteners are blocked.",
  ]);

  const GUIDE = [
    // ======== Shared: business basics (every way of making money)
    { id: "d1-legal-us", day: 1, area: "legal", prio: "med", when: (p) => p.level === "new" && p.country === "us",
      title: "Sort out the business basics (US)",
      body: () => ul([
        "If you don't register another kind of business, you're a sole proprietor automatically and don't need to register the business with your state.",
        "Many states require a DBA (“doing business as”) filing if you trade under a name other than your own.",
        "Licenses and permits depend on your state, county and city. Your Secretary of State's website is the place to start.",
        "An EIN is free from the IRS and is issued online in minutes. Sole proprietors don't always need one, but you may need one to open a business bank account. Never pay a third-party site for it.",
        "Payment apps and marketplaces must send you a Form 1099-K when you pass $20,000 and 200 transactions in a year, and may send one below that. Either way, you must report all your income.",
        "Once your net self-employment earnings reach $400 in a year, you owe self-employment tax (15.3% on 92.35% of net earnings) and file Schedule SE. If you expect to owe $1,000 or more, pay estimated tax quarterly.",
      ]) + '<p class="small muted">General information from the SBA and IRS, not legal or tax advice.</p>',
      links: [link("sbaLicense", "Licenses and permits (SBA)"), link("irsEin", "Get an EIN (IRS)"), link("irsSE", "Self-employment tax")], src: ["sbaStructure", "sbaLicense", "irsEin", "irs1099kFaq", "irs1099k", "irsSE", "irsEst"] },

    { id: "d1-legal-uk", day: 1, area: "legal", prio: "med", when: (p) => p.level === "new" && p.country === "uk",
      title: "Check what HMRC needs from you (UK)",
      body: () => ul([
        "The trading allowance lets you earn up to £1,000 of gross trading income a year tax-free. It's measured before costs, not on profit, and covers all your side-hustle income together.",
        "If your gross trading income goes over £1,000 in a tax year, you must register for Self Assessment, by 5 October after that tax year ends.",
        "Buying goods to resell for a profit is usually treated as trading.",
      ]) + '<p class="small muted">General information from GOV.UK, not tax advice.</p>',
      links: [link("hmrcOnline", "Check if you need to tell HMRC"), link("hmrcAllow", "Trading allowance")], src: ["hmrcAllow", "hmrcOnline"] },

    { id: "d1-legal-other", day: 1, area: "legal", prio: "med", when: (p) => p.level === "new" && p.country === "other",
      title: "Check your country's rules for selling online",
      body: () => "<p>Look up how your country handles registering a small business and paying tax on online income. If you sell into the EU, VAT rules can differ from normal retail. Shopify recommends talking to a lawyer about the laws where you operate and sell.</p>",
      links: [link("shopDrop", "Shopify's legal notes")], src: ["shopDrop"] },

    // ======== Dropshipping and print-on-demand
    { id: "d1-how", day: 1, area: "learning", prio: "high", when: (p) => p.level === "new" && SHIP(p),
      title: "Read: how dropshipping works and what you're responsible for",
      body: () => "<p>A short lesson in this app. It explains who carries the risk when a supplier ships for you, and where your money goes on each order.</p>",
      action: { label: "Open the lesson", go: "lesson:how" }, src: ["shopDrop", "ftcMail"] },

    { id: "d1-shopify", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "shopify",
      title: "Start your Shopify store on the free trial",
      body: () => ul([
        "Shopify offers a 3-day free trial with no credit card. After the trial, most plans cost $1 a month for the first 3 months.",
        "After that, Basic costs $39 a month billed monthly, or $29 a month billed yearly (US prices).",
        "Basic's online card rate with Shopify Payments is 2.9% + 30¢ in the US. If you use another payment provider, Shopify charges an extra 2% on Basic.",
      ]) + checked,
      links: [link("shopTrial", "Start the free trial"), link("shopPricing", "Compare plans")], src: ["shopPricing", "shopTrial"] },

    { id: "d1-etsy", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "etsy",
      title: "Open your Etsy shop",
      body: () => ul([
        "Listing fee: $0.20 per listing, charged whether or not it sells. Listings last 4 months and renew for another $0.20 if auto-renew is on.",
        "Transaction fee: 6.5% of the order total, including shipping and gift wrap.",
        "Payment processing (US bank account): 3% + $0.25 per order.",
        "Etsy may charge a one-time shop setup fee; it shows during sign-up.",
      ]) + checked,
      links: [link("etsySell", "Open Etsy's seller sign-up")], src: ["etsyFees"] },

    { id: "d1-tiktok", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "tiktok",
      title: "Register as a TikTok Shop seller",
      body: (p) => ul([
        "Individual sellers must be 18 or older and live in the US.",
        "You need a US passport or passport card, driver's license, state ID or permanent resident card, plus the last 4 digits of your SSN (or an ITIN) and a bank account for payouts.",
        "Business sellers (LLCs, corporations, partnerships) need a US business address and an EIN.",
        "TikTok Shop's US page lists no setup fee and a 6% commission per sale.",
        p.country !== "us" ? "<b>These are TikTok Shop US rules.</b> If you live elsewhere, use your country's TikTok Shop Seller Center; requirements differ." : "",
      ]) + checked,
      links: [link("ttsHome", "Open TikTok Shop sign-up"), link("ttsIndividual", "Registration guide")], src: ["ttsHome", "ttsIndividual"] },

    { id: "d1-ebay", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "ebay",
      title: "Create your eBay seller account",
      body: () => ul([
        "Most categories: final value fee of 13.6% on the total sale up to $7,500, plus $0.30 per order of $10 or less, or $0.40 per order over $10.",
        "Without an eBay Store subscription, your first 250 listings each month have no insertion fee; after that it's $0.35 per listing.",
        "Payment processing is included in eBay's fees.",
      ]) + checked,
      links: [link("ebayStart", "eBay's start-selling guide"), link("ebayFees", "Fee details")], src: ["ebayFees", "ebayStart"] },

    { id: "d1-amazon", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "amazon",
      title: "Choose an Amazon selling plan",
      body: () => ul([
        "Individual: $0.99 per unit sold plus a referral fee. Professional: $39.99 a month plus referral fees.",
        "Referral fees depend on the category; most are 8% to 15%, with a per-item minimum.",
        "Amazon suggests the Individual plan if you expect to sell fewer than 40 items a month. Switching plans is free.",
      ]) + checked,
      links: [link("amzPricing", "Amazon selling plans")], src: ["amzPricing"] },

    { id: "d1-rules", day: 1, area: "legal", prio: "high", when: (p) => SHIP(p) && !!RULES[p.channel],
      title: (p) => "Read " + CHANNEL_NAME[p.channel] + "'s dropshipping rules",
      body: (p) => RULES[p.channel].text,
      links: (p) => RULES[p.channel].src.map((k) => link(k)), src: (p) => RULES[p.channel].src },

    { id: "d1-course", day: 1, area: "learning", prio: "med", when: (p) => p.level === "new" && SHIP(p),
      title: (p) => ({ shopify: "Start Shopify's Dropshipping 101 course", etsy: "Skim Etsy's Seller Handbook", tiktok: "Start the TikTok Shop Academy registration course", ebay: "Read eBay's start-selling guide", amazon: "Read Amazon's dropshipping guide" })[p.channel],
      body: (p) => ({
        shopify: "<p>Shopify Learn's <i>Dropshipping 101: Build your first online store</i> runs about 2 hours. It covers product research, choosing suppliers, building the store, Facebook ads, fulfilment and refunds. Some lessons name the Oberlo app; check any app it mentions is still offered before following those steps.</p>",
        etsy: "<p>Etsy's Seller Handbook collects advice from Etsy staff and sellers, sorted by how far along your shop is.</p>",
        tiktok: "<p>TikTok Shop Academy is TikTok's learning site for sellers. Its registration course explains business types, the documents you need and each sign-up step.</p>",
        ebay: "<p>eBay's guide walks through creating a seller account, listing, and shipping your first order.</p>",
        amazon: "<p>Amazon's seller-education page explains how dropshipping works in its store and links to its Drop Shipping Policy.</p>",
      })[p.channel],
      links: (p) => [link(({ shopify: "shopCourse", etsy: "etsyHandbook", tiktok: "ttsAcademy", ebay: "ebayStart", amazon: "amzDrop" })[p.channel], "Open it")],
      src: (p) => [({ shopify: "shopCourse", etsy: "etsyHandbook", tiktok: "ttsAcademy", ebay: "ebayStart", amazon: "amzDrop" })[p.channel]] },

    { id: "d2-research", day: 2, area: "research", prio: "high", when: (p) => p.model === "supplier" && p.level !== "selling",
      title: "Shortlist 3 to 5 product ideas",
      body: () => "<p>Use free tools to see what's already being advertised and searched for:</p>" + ul([
        "<b>TikTok Creative Center, Top Products</b>: ranks products by how often they're advertised and how well they convert, by country and category. Desktop only, and you need to sign in.",
        "<b>Meta Ad Library</b>: search a keyword to see ads running now on Facebook and Instagram. It doesn't show spend or sales for normal product ads.",
        "<b>Google Trends</b>: compare search interest over time. Scores run from 0 to 100 and show relative popularity, not search volume.",
        "The trend and demand check in this app opens all of these with your keywords filled in.",
        "Skip anything with a brand name, logo or character you don't own. Shopify and the marketplaces remove infringing listings.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" },
      links: [link("ttTop", "Top Products"), link("metaLib", "Meta Ad Library"), link("trends", "Google Trends")],
      src: ["ttTopHelp", "metaLibHelp", "trendsHelp", "shopIP"] },

    { id: "d2-designs", day: 2, area: "research", prio: "high", when: (p) => p.model === "pod" && p.level !== "selling",
      title: "Make 3 to 5 designs you own",
      body: () => ul([
        "Canva's Free plan costs $0 and includes templates and stock photos. Premium (Pro) content in a free design carries a watermark unless you license it or upgrade. Check Canva's licensing rules before selling products that use its elements.",
        "Use only artwork you made or have the rights to. Etsy allows print-on-demand only for your original designs or buyer personalisation, and Shopify removes listings that infringe trademarks or copyrights.",
        "Printful Academy has free design and trends courses (sign in with a free Printful account).",
      ]) + checked,
      links: [link("canva", "Canva plans"), link("canvaLicense", "Canva licensing"), link("printfulDesign", "Printful design courses")], src: ["canva", "canvaLicense", "etsyDrop", "shopIP", "printfulAcademy"] },

    { id: "d2-supplier-app", day: 2, area: "suppliers", prio: "high", when: (p) => p.model === "supplier" && p.channel === "shopify" && p.level !== "selling",
      title: "Connect one supplier app to your store",
      body: () => "<p>Pick one to start:</p>" + ul([
        "<b>DSers</b>: free plan for up to 3 stores and 3,000 products; paid plans come with a 14-day trial. Imports AliExpress products and places orders for you.",
        "<b>CJdropshipping</b>: free Shopify app; you pay for products, shipping and any optional services. CJ says it has US warehouses.",
        "<b>Spocket</b>: suppliers in the US and EU; paid plans from $39.99 a month after a free trial.",
        "<b>AutoDS</b>: paid plans with a trial. Its product research tools are a separate paid add-on.",
        "<b>Shopify Collective</b>: sell products from other Shopify brands. Free, but your store must be in a supported country (the US is one), use Shopify Payments and pass Shopify's checks.",
      ]) + checked,
      links: [link("dsersApp", "DSers"), link("cj", "CJdropshipping"), link("spocket", "Spocket"), link("autods", "AutoDS"), link("collective", "Shopify Collective")],
      src: ["dsers", "cj", "spocket", "autods", "shopCollective"] },

    { id: "d2-supplier-mkt", day: 2, area: "suppliers", prio: "high", when: (p) => p.model === "supplier" && ["ebay", "amazon", "tiktok"].includes(p.channel) && p.level !== "selling",
      title: (p) => "Find a supplier that meets " + CHANNEL_NAME[p.channel] + "'s rules",
      body: (p) => ({
        ebay: ul(["You need an agreement with a wholesale supplier to list their items. Buying from a retailer or marketplace after the sale isn't allowed.", "Shopify's guidance applies here too: a supplier that sells to the public while advertising wholesale prices is probably another dropshipper reselling at a markup.", "Real wholesalers usually don't charge monthly fees."]),
        amazon: ul(["Your supplier agreement must make you the only seller named on packing slips, invoices and packaging.", "The supplier must remove its own details before shipping, and you handle returns.", "Ask a supplier to confirm this in writing before you list."]),
        tiktok: ul(["Regular orders must be delivered within 6 business days of Awaiting Shipment, so stock needs to ship from inside the US.", "CJdropshipping and Spocket both advertise US-based stock."]),
      })[p.channel],
      src: (p) => ({ ebay: ["ebayDrop", "shopSuppliers"], amazon: ["amzDrop"], tiktok: ["ttsFulfill", "cj", "spocket"] })[p.channel] },

    { id: "d2-pod-app", day: 2, area: "suppliers", prio: "high", when: (p) => p.model === "pod" && p.level !== "selling",
      title: "Connect Printful or Printify",
      body: () => ul([
        "<b>Printful</b>: no monthly fee to create products or connect a store; you pay production costs when a customer orders. An optional Growth plan gives product discounts.",
        "<b>Printify</b>: Free plan with no monthly fee and up to 5 connected stores. Premium is $39 a month or $299 a year and gives up to 20% off most products.",
        "Both connect to Shopify, Etsy and other channels. Check each one's list for your channel before you start.",
      ]) + checked,
      links: [link("printful", "Printful"), link("printify", "Printify")], src: ["printful", "printify"] },

    { id: "d3-vet", day: 3, area: "suppliers", prio: "high", when: (p) => p.model === "supplier",
      title: "Check your supplier before you list anything",
      body: () => ul([
        "Shopify's checklist: read the supplier's reviews and policies, message them with questions, and order a sample.",
        "Write down the delivery estimate to your customers' country. That's the delivery time you'll promise.",
        "Real wholesalers usually don't charge monthly fees. A “supplier” selling retail while claiming wholesale prices is probably another dropshipper.",
      ]),
      action: { label: "Open the product evaluator", go: "tools:evaluate" },
      src: ["shopSuppliers"] },

    { id: "d3-sample", day: 3, area: "suppliers", prio: "med", when: (p) => SHIP(p) && p.level !== "selling",
      title: "Order a sample to see the quality yourself",
      body: () => "<p>Shopify recommends ordering a sample to judge quality. A sample shipped from overseas may arrive after this week. Until it does, describe the product only with facts the supplier documents, and don't claim things you haven't checked.</p>",
      src: ["shopSuppliers"] },

    { id: "d3-price", day: 3, area: "finance", prio: "high", when: (p) => SHIP(p),
      title: "Set your price and find your break-even",
      body: (p) => "<p>Before you list or advertise, know what each order earns you after costs.</p>" + ul([
        FEE_TEXT[p.channel],
        "Profit per order = price − product cost − shipping − platform and payment fees − ad cost per order.",
        "Your break-even ad cost is everything left before ads. If ads cost more than that per order, every sale loses money.",
      ]) + checked,
      action: { label: "Open the profit calculator", go: "tools:profit" }, src: (p) => [FEE_SRC[p.channel]] },

    { id: "d4-build", day: 4, area: "store", prio: "high", when: (p) => p.channel === "shopify" && p.level === "new" && SHIP(p),
      title: "Build the store and your first product page",
      body: () => ul([
        "Pick a free theme and add your logo (Canva's free plan works).",
        "Product page: a clear title, the specs your supplier documents, photos you have the right to use, and the delivery time.",
        "Add a store address in Settings › General, under Business details. Shopify requires it before launch.",
        "Make a contact method easy to find. Shopify's terms expect a public contact method.",
      ]),
      action: { label: "Write the description with AI", go: "tools:describe" },
      links: [link("shopifyAdmin", "Open Shopify admin")], src: ["shopLaunch", "shopPolicies"] },

    { id: "d4-audit", day: 4, area: "store", prio: "high", when: (p) => p.channel === "shopify" && p.level !== "new" && SHIP(p),
      title: "Check your store like a first-time customer",
      body: () => ul([
        "Can a shopper find how to contact you, your refund policy and your delivery time before they pay?",
        "Policies you add in Settings › Policies are linked in the checkout footer automatically; link them in your store's footer too.",
        "Place a test order after any change to payments or checkout settings.",
      ]),
      links: [link("shopifyAdmin", "Open Shopify admin")], src: ["shopPolicies", "shopTest"] },

    { id: "d4-list", day: 4, area: "listings", prio: "high", when: (p) => SHIP(p) && isMarket(p) && p.level !== "selling",
      title: "Create your first listing",
      body: (p) => ul([
        "Use photos you have the right to use and only specs the supplier documents.",
        ({ etsy: "Say the item is made with a production partner, and state the real ships-from location.",
           ebay: "Set a handling time you can meet. You're responsible for delivery within the time you state.",
           tiktok: "Your shop-level handling time for regular orders is 1 to 2 business days by default.",
           amazon: "List yourself as the seller of record; your supplier's name must not appear anywhere on the order." })[p.channel],
      ]),
      action: { label: "Write the description with AI", go: "tools:describe" },
      src: (p) => ({ etsy: ["etsyDrop"], ebay: ["ebayDrop"], tiktok: ["ttsFulfill"], amazon: ["amzDrop"] })[p.channel] },

    { id: "d4-policies", day: 4, area: "store", prio: "high", when: (p) => p.channel === "shopify" && p.level === "new",
      title: "Publish refund, privacy, terms and shipping policies",
      body: (p) => ul([
        "Go to Settings › Policies. Shopify can generate templates, but you're responsible for following what you publish.",
        "Refund policy: the return window, the return address, who pays return shipping, and how to reach you if a refund is late.",
        p.model === "digital" ? "For downloads, say how the file is delivered and what happens if it doesn't arrive or won't open." : "Shipping policy: realistic delivery times. For cross-border orders, tell customers about shipping times and any import or customs charges before they buy.",
        "Refunds through Shopify Payments don't give back the original card processing fee.",
      ]),
      links: [link("shopifyAdmin", "Open Shopify admin")], src: ["shopPolicies"] },

    { id: "d4-delivery", day: 4, area: "orders", prio: "high", when: (p) => SHIP(p),
      title: "Promise only delivery times you can keep",
      body: (p) => ul([
        p.country === "us" || p.channel === "tiktok" ? "US law (the FTC's Mail Order Rule): when you take an order you must have a reasonable basis to expect shipping within the time you state, or within 30 days if you don't state one. It applies even when a supplier ships for you." : "If you sell to US customers, the FTC's Mail Order Rule applies: you need a reasonable basis to ship within the time you state, or 30 days if you state none.",
        "If you can't ship on time, you must tell the customer before the promised date, give a new date, and offer to cancel with a full, prompt refund.",
        p.channel === "tiktok" ? "TikTok Shop's own deadline is stricter: in transit within 2 business days, delivered within 6." : "",
      ]),
      action: { label: "Work out your delivery dates", go: "tools:delivery" }, src: (p) => (p.channel === "tiktok" ? ["ftcMail", "ttsFulfill"] : ["ftcMail"]) },

    { id: "d5-payments", day: 5, area: "finance", prio: "high", when: (p) => p.channel === "shopify" && p.level === "new",
      title: "Turn on payments and know when you'll be paid",
      body: (p) => ul([
        "Set up Shopify Payments in Settings › Payments and add your bank account. Payouts are delayed until setup is complete.",
        "US payouts usually reach your bank 3 to 5 business days after a payment. New merchants start with a longer settlement time, and higher-risk accounts can wait 5 to 20 business days.",
        SHIP(p) ? "You pay your supplier when you place each order, so plan for that money going out before your first payout arrives." : "",
      ]),
      links: [link("shopifyAdmin", "Open Shopify admin")], src: ["shopPayouts"] },

    { id: "d5-test", day: 5, area: "store", prio: "high", when: (p) => p.channel === "shopify" && p.level === "new",
      title: "Place a test order, then open the store",
      body: () => "<ol><li>Turn off any app that fulfils orders automatically.</li><li>Turn on test mode for your payment provider (or the Bogus Gateway) in Settings › Payments, and buy something as a customer would.</li><li>Don't fulfil test orders; shipping labels you buy for them are charged.</li><li>Turn test mode off so real payments go through.</li><li>In the Store access section, turn off Private mode so customers can see the store.</li></ol>",
      links: [link("shopifyAdmin", "Open Shopify admin")], src: ["shopTest", "shopLaunch"] },

    { id: "d5-google", day: 5, area: "marketing", prio: "med", when: (p) => p.channel === "shopify" && p.country === "us" && SHIP(p),
      title: "List your products free on Google",
      body: () => ul([
        "Install Shopify's Google & YouTube app and create or connect a Merchant Center account. Products from accounts created through the app are enrolled in free listings.",
        "Eligible US stores can show products on Google's Shopping tab for free. Showing isn't guaranteed.",
        "Fill in the required product details; apparel, for example, needs age group, gender, colour and size.",
      ]),
      links: [link("googleApp", "Google & YouTube app")], src: ["shopGoogle", "googleApp"] },

    { id: "d5-check", day: 5, area: "listings", prio: "high", when: (p) => SHIP(p) && isMarket(p),
      title: "Preview your listing as a buyer would",
      body: () => "<p>Open the live listing on your phone and check the price, the shipping cost, the delivery estimate and the return policy. Fix anything that doesn't match what your supplier can actually do.</p>" },

    { id: "d6-organic", day: 6, area: "marketing", prio: "high", when: (p) => SHIP(p),
      title: "Post your first short videos",
      body: (p) => ul([
        "Free option: post short videos of the product in use on TikTok, Instagram Reels or YouTube Shorts, and link to your " + (p.channel === "shopify" ? "store" : "listing") + ".",
        "Use footage you filmed or have written permission to use.",
        isMarket(p) ? "Marketplaces also sell ads inside their own sites (Etsy Ads, eBay Promoted Listings, Amazon Sponsored Products, TikTok Shop ads). Check the cost in your seller dashboard before you switch one on." : "",
      ]),
      action: { label: "Draft hooks and captions with AI", go: "tools:hooks" } },

    { id: "d6-ads-learn", day: 6, area: "learning", prio: "med", when: (p) => p.ads === "some" && p.channel === "shopify",
      title: "Learn the ads basics (about 35 minutes)",
      body: () => ul([
        "Meta Blueprint: <i>Get started with advertising on Facebook and Instagram</i> (15 minutes, beginner).",
        "Meta Blueprint: <i>Getting started with Meta Ads Manager</i> (20 minutes, beginner).",
        "TikTok Academy has free courses and learning paths if you'd rather advertise on TikTok.",
      ]),
      links: [link("metaCourse1", "Meta: get started"), link("metaCourse2", "Meta: Ads Manager basics"), link("ttAcademy", "TikTok Academy")],
      src: ["metaCourse1", "metaCourse2", "ttAcademy"] },

    { id: "d6-ads", day: 6, area: "marketing", prio: "high", when: (p) => p.ads === "some" && p.channel === "shopify",
      title: "Run one small test ad with a hard spending cap",
      body: () => ul([
        "Meta: most advertisers charged per impression need at least $1 a day per ad set. Meta suggests a daily budget of at least 10 times the average cost of the result you optimise for, such as a purchase.",
        "TikTok: the campaign budget must be over $50 and each ad group's daily budget over $20.",
        "Decide the most you can afford to lose on this test before you start, and set it as the budget.",
        "Compare cost per purchase with your break-even from the calculator. Stop or change the ad if it's higher.",
      ]) + checked,
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: [link("metaAds"), link("ttAds")], src: ["metaBudget", "ttBudget"] },

    { id: "d7-fulfill", day: 7, area: "orders", prio: "high", when: (p) => SHIP(p),
      title: "Send each new order to your supplier the same day",
      body: (p) => ul([
        p.model === "pod" ? "Printful and Printify receive orders from a connected store automatically; check each order went through." : "Place the order through your supplier app and make sure the tracking number syncs back.",
        p.channel === "tiktok" ? "TikTok Shop cancels an order automatically if it isn't moved to Awaiting Collection within 5 business days." : "",
        "If an order will be late, tell the customer before the promised date, give a new date and offer to cancel for a full refund.",
      ]),
      action: { label: "Open message templates", go: "tools:messages" },
      src: (p) => (p.channel === "tiktok" ? ["ftcMail", "ttsFulfill"] : ["ftcMail"]) },

    { id: "d7-support", day: 7, area: "support", prio: "med", when: (p) => SHIP(p),
      title: "Reply to every customer message",
      body: () => ul([
        "Answer delivery questions with the tracking link and the honest estimate.",
        "Under the FTC's Mail Order Rule, a refund for an order you can't ship must be prompt and in money; the FTC has said gift cards don't count.",
      ]),
      action: { label: "Open message templates", go: "tools:messages" },
      src: ["ftcMail"] },

    { id: "d7-review", day: 7, area: "finance", prio: "high", when: (p) => SHIP(p),
      title: "Review the week's numbers and decide what to change",
      body: () => ul([
        "Add up orders, revenue, product and shipping costs, fees, ad spend and refunds.",
        "Profit = revenue − all of those costs. Compare cost per order from ads with your break-even.",
        "If you're below break-even, change one thing at a time (price, video or ad, or product) before spending more.",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" } },

    // ======== Affiliate marketing
    { id: "af1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "affiliate" && p.level === "new",
      title: "Read: how affiliate marketing works",
      body: () => "<p>A short lesson in this app: how commission is earned, what it takes to get approved, and why the disclosure rules matter.</p>",
      action: { label: "Open the lesson", go: "lesson:affiliate" }, src: ["ftcInfluencer"] },

    { id: "af1-join", day: 1, area: "store", prio: "high", when: (p) => p.model === "affiliate" && p.level === "new",
      title: (p) => ({ aff_amazon: "Sign up for Amazon Associates", aff_tiktok: "Check you qualify for TikTok Shop affiliate", aff_network: "Join one affiliate network" })[p.channel],
      body: (p) => ({
        aff_amazon: ul([
          "Your account is reviewed after you make at least 3 qualifying sales within 180 days. Your own purchases don't count.",
          "Your site or account must be public, owned by you, with recent content. Amazon's rule of thumb is at least 10 posts of original content.",
          "Commission rates are fixed by product category, from 0% to 10%; categories that aren't listed earn 4%. Commission is based on what Amazon receives, not counting shipping, tax and similar charges, and is paid about 60 days after the end of the month.",
          "From April 14, 2026, purchases from customers who arrive through paid or boosted ads linking to Amazon don't earn commission.",
        ]),
        aff_tiktok: ul([
          "You must be 18 or older, based in the US, and have at least 1,000 followers.",
          "Accounts under 5,000 followers start in a 30-day Creator Pilot with limits, such as up to 3 product videos a day.",
          "Promoting other sellers' products from the TikTok Shop marketplace needs at least 5,000 followers.",
          "You must verify your identity and age before posting shoppable videos, going LIVE or withdrawing earnings.",
          p.country !== "us" ? "<b>These are TikTok Shop US rules.</b> Other countries have their own requirements." : "",
        ]),
        aff_network: ul([
          "<b>Awin</b>: free to join, with a small refundable deposit at sign-up (the amount depends on your region; it's returned with your first payment).",
          "<b>impact.com</b>: free for partners; apply to its marketplace to work with several brands.",
          "<b>CJ Affiliate</b>: a free publisher account. CJ expects basic HTML or JavaScript knowledge to install tracking.",
          "Joining a network isn't the same as being approved: you then apply to each brand's program, and each brand sets its own commission.",
        ]),
      })[p.channel] + checked,
      links: (p) => ({ aff_amazon: [link("amzAssoc", "Amazon Associates"), link("amzAssocPart", "Requirements")], aff_tiktok: [link("ttsCreator", "TikTok Shop creator requirements")], aff_network: [link("awinJoin", "Awin"), link("impact", "impact.com"), link("cjAff", "CJ")] })[p.channel],
      src: (p) => ({ aff_amazon: ["amzAssocPart", "amzAssocAgree", "amzAssocUpdates"], aff_tiktok: ["ttsCreator"], aff_network: ["awinJoin", "impact", "cjAff"] })[p.channel] },

    { id: "af1-disclose", day: 1, area: "legal", prio: "high", when: (p) => p.model === "affiliate",
      title: "Learn the disclosure rules for affiliate links",
      body: DISCLOSE_TEXT,
      action: { label: "Open the disclosure lesson", go: "lesson:disclose" },
      src: (p) => ["ftcInfluencer", "ftcEndorse", "pinterestRules"].concat(p.channel === "aff_amazon" ? ["amzAssocAgree"] : []) },

    { id: "af2-niche", day: 2, area: "research", prio: "high", when: (p) => p.model === "affiliate" && p.level !== "selling",
      title: "Pick one niche and 10 products you'd honestly recommend",
      body: (p) => ul([
        "Choose a topic you can make content about every week, such as home office, pets or fitness gear.",
        "Use the trend and demand check to compare ideas, and look at what's already selling.",
        p.channel === "aff_amazon" ? "Check each product's category rate in Amazon's commission table; some categories pay 0%." : "Check each program's commission and cookie terms before you commit.",
        "Prefer products you've used or can show honestly. Your recommendations need to reflect what you actually think.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" }, src: (p) => (p.channel === "aff_amazon" ? ["amzAssocAgree", "ftcEndorse"] : ["ftcEndorse"]) },

    { id: "af2-channel", day: 2, area: "store", prio: "high", when: (p) => p.model === "affiliate" && p.level === "new",
      title: "Set up the place you'll post",
      body: (p) => ({
        aff_amazon: "<p>A public website, blog or social account that you own. Amazon reviews it when your account is checked.</p>",
        aff_tiktok: "<p>A TikTok account with a clear topic. Keep to TikTok Shop's content policy and Community Guidelines; e-commerce permissions can be removed for breaking them.</p>",
        aff_network: "<p>A website, blog or social channel. For CJ's content certification, a blog or social channel must be your main way of reaching people.</p>",
      })[p.channel],
      src: (p) => ({ aff_amazon: ["amzAssocPart"], aff_tiktok: ["ttsCreator"], aff_network: ["cjAff"] })[p.channel] },

    { id: "af3-calc", day: 3, area: "finance", prio: "med", when: (p) => p.model === "affiliate",
      title: "Work out what each sale and each click earns you",
      body: () => "<p>Commission × price gives you earnings per sale. Multiply by your conversion rate to see what 100 clicks are worth, and how many clicks you'd need for a monthly goal.</p>",
      action: { label: "Open the affiliate calculator", go: "tools:affiliate" } },

    { id: "af4-content", day: 4, area: "content", prio: "high", when: (p) => p.model === "affiliate",
      title: "Make your first 3 pieces of content",
      body: () => ul([
        "Good starting formats: an honest review, a how-to that uses the product, and a comparison of two options.",
        "Put the disclosure in the content itself: on screen and spoken in videos, near the link in posts.",
        "Use your own footage and photos, or ones you have permission to use.",
      ]),
      action: { label: "Draft hooks and captions with AI", go: "tools:hooks" }, src: ["ftcInfluencer"] },

    { id: "af5-links", day: 5, area: "content", prio: "high", when: (p) => p.model === "affiliate",
      title: "Add your tracked links with a disclosure next to them",
      body: (p) => ul([
        "Create links in your program's dashboard so sales are tracked to you.",
        p.channel === "aff_amazon" ? "Add “As an Amazon Associate I earn from qualifying purchases” to your site or account." : "",
        "If you post on Pinterest, some link shorteners are blocked; use the full link if a Pin's link is rejected.",
      ]),
      src: (p) => (p.channel === "aff_amazon" ? ["amzAssocAgree", "pinterestRules"] : ["pinterestRules"]) },

    { id: "af6-post", day: 6, area: "marketing", prio: "high", when: (p) => p.model === "affiliate",
      title: "Publish, then answer every comment",
      body: (p) => ul([
        "Publish your content and reply to questions; replies often lead to clicks.",
        p.channel === "aff_amazon" ? "Don't send paid or boosted ads straight to your Amazon links: since April 14, 2026 those purchases don't earn commission." : "",
        p.channel === "aff_tiktok" ? "During the Creator Pilot you can post up to 3 product videos a day." : "",
      ]),
      src: (p) => (p.channel === "aff_amazon" ? ["amzAssocUpdates"] : p.channel === "aff_tiktok" ? ["ttsCreator"] : []) },

    { id: "af7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "affiliate",
      title: "Check clicks, orders and earnings in your dashboard",
      body: () => ul([
        "Note which pieces of content got clicks and which got sales.",
        "Make more of what worked; change the hook or format of what didn't.",
        "Replace your guessed conversion rate in the calculator with your real one.",
      ]),
      action: { label: "Open the affiliate calculator", go: "tools:affiliate" } },

    // ======== Digital products
    { id: "dg1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "digital" && p.level === "new",
      title: "Read: selling digital products",
      body: () => "<p>A short lesson in this app on what sells as a download, the platform rules, and the licences you need for anything you didn't make.</p>",
      action: { label: "Open the lesson", go: "lesson:digital" } },

    { id: "dg1-platform", day: 1, area: "store", prio: "high", when: (p) => p.model === "digital" && p.level === "new" && ["gumroad", "payhip"].includes(p.channel),
      title: (p) => "Create your " + CHANNEL_NAME[p.channel] + " account",
      body: (p) => "<p>" + FEE_TEXT[p.channel] + "</p>" + checked,
      links: (p) => [link(p.channel)], src: (p) => [p.channel] },

    { id: "dg1-shopify-app", day: 1, area: "store", prio: "med", when: (p) => p.model === "digital" && p.channel === "shopify",
      title: "Install Shopify's Digital Downloads app",
      body: () => "<p>Shopify's own Digital Downloads app is free and lets you sell files such as e-books, art and graphics from your store.</p>",
      links: [link("shopDigital", "Digital Downloads app")], src: ["shopDigital"] },

    { id: "dg1-etsy-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "digital" && p.channel === "etsy",
      title: "Read Etsy's rules for digital items",
      body: () => ul([
        "Digital items must be made or designed by you. Reselling other people's files isn't allowed.",
        "If you used AI to create an item, you must say so in the listing.",
        "Listing photos must be your own, not stock photos or images used by other sellers.",
        "Instant downloads can include up to 5 files of up to 20MB each.",
        "Etsy collects and pays VAT on digital items bought by customers in certain countries.",
      ]),
      links: [link("etsyDigital", "Etsy: selling digital downloads")], src: ["etsySellerPolicy", "etsyDigital"] },

    { id: "dg2-idea", day: 2, area: "research", prio: "high", when: (p) => p.model === "digital" && p.level !== "selling",
      title: "Pick one product that solves a specific problem",
      body: () => ul([
        "Common types: planners and trackers, templates, printable wall art, checklists, guides.",
        "Search your platform for the idea and note what already exists, its price and what buyers say in reviews.",
        "Compare ideas in the trend and demand check.",
        "Don't copy another seller's design. Listings that infringe copyright or trademarks get removed.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" }, src: ["shopIP"] },

    { id: "dg3-make", day: 3, area: "content", prio: "high", when: (p) => p.model === "digital" && p.level !== "selling",
      title: "Make the product",
      body: (p) => ul([
        "Canva's Free plan costs $0. Check Canva's licensing rules before you sell anything that uses its templates, photos or graphics.",
        "Check the licence of every font and graphic you use for commercial use.",
        p.channel === "etsy" ? "If you used AI, note it for your Etsy listing." : "",
        "Export in the formats buyers expect, such as PDF or PNG, and name the files clearly.",
      ]),
      links: [link("canvaLicense", "Canva licensing")], src: (p) => ["canva", "canvaLicense"].concat(p.channel === "etsy" ? ["etsySellerPolicy"] : []) },

    { id: "dg4-list", day: 4, area: "listings", prio: "high", when: (p) => p.model === "digital",
      title: "Write the listing and set the price",
      body: (p) => ul([
        "Say exactly what's included: file type, size, number of pages and how it's delivered.",
        p.channel === "etsy" ? "Use your own preview images. Etsy doesn't allow stock photos as listing photos." : "Show real previews of the product.",
        "Use the price calculator with a product cost of zero: platform fees are your main cost.",
      ]),
      action: { label: "Open the price calculator", go: "tools:price" }, src: (p) => (p.channel === "etsy" ? ["etsySellerPolicy", FEE_SRC[p.channel]] : [FEE_SRC[p.channel]]) },

    { id: "dg5-test", day: 5, area: "store", prio: "high", when: (p) => p.model === "digital",
      title: "Check the download works on a phone and a computer",
      body: () => "<p>Use your platform's preview or a test purchase, open every file on a phone and a computer, and check links inside the files work.</p>" },

    { id: "dg6-promote", day: 6, area: "marketing", prio: "high", when: (p) => p.model === "digital",
      title: "Share it where your buyers already look",
      body: () => ul([
        "Post previews and short videos showing the product in use.",
        "On Pinterest, content must be original and links used in moderation.",
      ]),
      action: { label: "Draft hooks and captions with AI", go: "tools:hooks" }, src: ["pinterestRules"] },

    { id: "dg7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "digital",
      title: "Review views, sales and fees",
      body: () => "<p>Compare views and sales for each listing. If people look but don't buy, test a new preview image, title or price.</p>",
      action: { label: "Open the profit calculator", go: "tools:profit" } },

    // ======== Reselling
    { id: "rs1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "resell" && p.level === "new",
      title: "Read: reselling basics",
      body: () => "<p>A short lesson in this app on finding items, pricing from what has actually sold, and the fees on each marketplace.</p>",
      action: { label: "Open the lesson", go: "lesson:resell" } },

    { id: "rs1-account", day: 1, area: "store", prio: "high", when: (p) => p.model === "resell" && p.level === "new" && ["mercari", "poshmark"].includes(p.channel),
      title: (p) => "Create your " + CHANNEL_NAME[p.channel] + " seller account",
      body: (p) => "<p>" + FEE_TEXT[p.channel] + "</p>" + (p.channel === "mercari" ? "<p>Buyers pay a separate buyer protection fee on top.</p>" : "") + checked,
      links: (p) => [link(p.channel === "mercari" ? "mercariFees" : "poshStart")], src: (p) => [FEE_SRC[p.channel]] },

    { id: "rs2-research", day: 2, area: "research", prio: "high", when: (p) => p.model === "resell",
      title: "Learn what actually sells, and for how much",
      body: () => ul([
        "Search eBay and filter for sold items: sold prices are what buyers really paid, not what sellers hope for.",
        "Write down 10 items you could find locally, with their recent sold prices.",
        "The trend and demand check opens eBay sold listings for each keyword.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "rs3-maxbuy", day: 3, area: "finance", prio: "high", when: (p) => p.model === "resell",
      title: "Set the most you'll pay for each item",
      body: (p) => "<p>" + (FEE_TEXT[p.channel] || "") + "</p><p>Work back from the sold price: take off the fees, shipping, supplies and the profit you want. What's left is the most you should pay.</p>",
      action: { label: "Open the max buy price calculator", go: "tools:maxbuy" }, src: (p) => [FEE_SRC[p.channel]] },

    { id: "rs3-source", day: 3, area: "suppliers", prio: "high", when: (p) => p.model === "resell" && p.level !== "selling",
      title: "Find your first 5 to 10 items",
      body: () => ul([
        "Places to look: thrift stores, yard and estate sales, and store clearance sections.",
        "Check condition carefully: stains, missing parts, whether it works.",
        "Skip anything that might be fake. Selling counterfeit goods breaks marketplace rules and the law.",
      ]) },

    { id: "rs4-list", day: 4, area: "listings", prio: "high", when: (p) => p.model === "resell",
      title: "Photograph and list your items",
      body: () => ul([
        "Use daylight and a plain background; show every side, labels and any flaws.",
        "Measure the item and give the real condition.",
        "Put brand, item type, size and colour in the title.",
      ]),
      action: { label: "Write the description with AI", go: "tools:describe" } },

    { id: "rs5-ship", day: 5, area: "orders", prio: "med", when: (p) => p.model === "resell",
      title: "Get shipping ready before your first sale",
      body: () => "<p>Have mailers or boxes and a small scale ready. Check the shipping options and labels your marketplace offers so you can ship quickly when something sells.</p>" },

    { id: "rs6-offers", day: 6, area: "support", prio: "med", when: (p) => p.model === "resell",
      title: "Answer questions and offers quickly",
      body: () => "<p>Reply to messages and offers the same day. Know your lowest acceptable price for each item before an offer comes in.</p>",
      action: { label: "Open message templates", go: "tools:messages" } },

    { id: "rs7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "resell",
      title: "Review what sold, what didn't, and what to buy next",
      body: () => "<p>Compare your profit on sold items with your target. Lower the price or improve photos on items with views but no sales, and buy more of what sold fastest.</p>",
      action: { label: "Open the profit calculator", go: "tools:profit" } },

    // ======== Freelancing
    { id: "fr1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "freelance" && p.level === "new",
      title: "Read: how freelancing online works",
      body: () => "<p>A short lesson in this app: what platforms charge, when you get paid, and how to set a rate that covers tax and quiet weeks.</p>",
      action: { label: "Open the lesson", go: "lesson:freelance" } },

    { id: "fr1-account", day: 1, area: "store", prio: "high", when: (p) => p.model === "freelance" && p.level === "new",
      title: (p) => ({ fiverr: "Create your Fiverr seller profile", upwork: "Create your Upwork profile", direct: "Set up how clients will find and pay you" })[p.channel],
      body: (p) => ({
        fiverr: ul([
          "Fiverr keeps 20% of every order, including extras and tips. On a $100 order you receive $80.",
          "Earnings become available 14 days after an order is completed (7 days for Top Rated, Pro and Seller Plus freelancers).",
          "An order counts as completed when the buyer accepts it, or when the 3-day response window ends without a reply.",
        ]),
        upwork: ul([
          "Joining is free. Upwork's freelancer service fee varies from 0% to 15% per contract; you see the rate before you send a proposal or accept an offer, and it's charged only when you're paid.",
          "Proposals cost Connects. Basic accounts may get 10 free Connects a month; extra Connects cost $0.15 each (minimum 10). New freelancers may get up to 50 free Connects once.",
          "Freelancer Plus costs $19.99 a month and includes 100 Connects.",
        ]),
        direct: ul([
          "No platform fee, but you find every client yourself.",
          "You need: one page that shows your work and how to contact you, a simple written agreement for each job, and a way to send invoices and take payment.",
          "Card payments through processors such as Stripe cost money too (for US cards, Stripe charges 2.9% + 30¢).",
        ]),
      })[p.channel] + checked,
      links: (p) => ({ fiverr: [link("fiverrHow", "How Fiverr works")], upwork: [link("upworkFee", "Upwork fees"), link("upworkConnects", "Connects")], direct: [] })[p.channel],
      src: (p) => ({ fiverr: ["fiverrVsUpwork", "fiverrOrders", "fiverrHow"], upwork: ["upworkFee", "upworkConnects", "upworkFree"], direct: ["substackCost"] })[p.channel] },

    { id: "fr2-offer", day: 2, area: "research", prio: "high", when: (p) => p.model === "freelance" && p.level !== "selling",
      title: "Choose one service and package it",
      body: () => ul([
        "Pick one service you can deliver well now, such as logo design, video editing, bookkeeping or copywriting.",
        "Define the package: what the client gets, how many revisions, and the delivery time.",
        "Look at what other freelancers offer for the same service and how they describe it, so yours is clearly different.",
      ]) },

    { id: "fr2-rate", day: 2, area: "finance", prio: "high", when: (p) => p.model === "freelance",
      title: "Set a rate that covers costs, fees and tax",
      body: (p) => ul([
        ({ fiverr: "Fiverr keeps 20% of each order.", upwork: "Upwork's fee is 0% to 15% per contract.", direct: "Card processing takes a few percent of each payment." })[p.channel],
        p.country === "us" ? "US self-employment tax is 15.3% on 92.35% of your net earnings, on top of income tax. Set money aside from every payment." : "Set money aside from every payment for tax; check your country's rules for self-employed income.",
        "Billable hours are fewer than working hours: pitching, admin and learning aren't paid.",
      ]),
      action: { label: "Open the freelance rate calculator", go: "tools:rate" }, src: (p) => (p.country === "us" ? ["irsSE", "upworkRates"] : ["upworkRates"]) },

    { id: "fr3-portfolio", day: 3, area: "content", prio: "high", when: (p) => p.model === "freelance" && p.level !== "selling",
      title: "Make 3 portfolio samples",
      body: () => ul([
        "Create 3 samples that show exactly the service you're selling.",
        "Only show client work you have permission to share.",
        "Write one line under each: the problem, what you did, and the result.",
      ]) },

    { id: "fr4-profile", day: 4, area: "listings", prio: "high", when: (p) => p.model === "freelance",
      title: (p) => (p.channel === "fiverr" ? "Write and publish your first gig" : p.channel === "upwork" ? "Finish your profile and write a proposal template" : "Write your service page"),
      body: () => ul([
        "Lead with the outcome the client gets, then what's included, delivery time and price.",
        "Add your 3 samples.",
        "The description writer can draft it from your notes; check every claim before you publish.",
      ]),
      action: { label: "Draft it with AI", go: "tools:describe" } },

    { id: "fr5-outreach", day: 5, area: "marketing", prio: "high", when: (p) => p.model === "freelance",
      title: "Reach your first clients",
      body: (p) => ul([
        ({ fiverr: "Share your gig link with people you know and in communities where your clients are; reply to buyer messages quickly.",
           upwork: "Send 5 tailored proposals to jobs that match your package. The Connects each proposal costs depends on the job.",
           direct: "Contact 10 people or businesses you could help, starting with people you know." })[p.channel],
        p.country === "us" ? "If you email businesses to offer your service, follow the CAN-SPAM rules: honest subject line, your postal address, and an easy way to opt out that you honour within 10 business days." : "",
      ]),
      src: (p) => (p.country === "us" ? ["canSpam"] : []).concat(p.channel === "upwork" ? ["upworkConnects"] : []) },

    { id: "fr6-deliver", day: 6, area: "orders", prio: "high", when: (p) => p.model === "freelance",
      title: "Deliver on time, then ask for a review",
      body: () => "<p>Confirm the brief in writing before you start, deliver on or before the date you promised, and ask happy clients for a review or testimonial you can show.</p>" },

    { id: "fr7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "freelance",
      title: "Review income, hours and your rate",
      body: () => "<p>Compare what you earned with the hours you really worked. If your effective hourly rate is below your target, raise prices or tighten the package.</p>",
      action: { label: "Open the freelance rate calculator", go: "tools:rate" } },

    // ======== Content creator
    { id: "cr1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "creator" && p.level === "new",
      title: "Read: how creators get paid",
      body: () => "<p>A short lesson in this app: platform payout programs, sponsorships, affiliate links and the rules for each.</p>",
      action: { label: "Open the lesson", go: "lesson:creator" } },

    { id: "cr1-program", day: 1, area: "legal", prio: "high", when: (p) => p.model === "creator",
      title: (p) => (p.channel === "yt" ? "Know the YouTube Partner Program requirements" : "Know the TikTok Creator Rewards requirements"),
      body: (p) => (p.channel === "yt" ? ul([
        "First tier (fan funding and Shopping): 500 subscribers, 3 public uploads in the last 90 days, and either 3,000 watch hours in 12 months or 3 million Shorts views in 90 days.",
        "Ad revenue tier: 1,000 subscribers and either 4,000 watch hours in 12 months or 10 million Shorts views in 90 days.",
        "You also need 2-Step Verification, no active Community Guidelines strikes, an AdSense account, and to live where the program is available. Every channel is reviewed before it's accepted.",
        "YouTube shares 55% of ad revenue on long videos and 45% on Shorts.",
        "From February 1, 2027 YouTube is changing some activity and Shorts payout rules; accept the new terms in YouTube Studio by January 31, 2027.",
      ]) : ul([
        "You need at least 10,000 followers and 100,000 video views in the last 30 days, a personal account in good standing, and to be 18 or older in an eligible country.",
        "Only original videos at least 1 minute long, posted after you join, can earn. Duets, Stitches, Photo Mode and paid or sponsored posts don't count.",
        "A video starts earning after 1,000 qualified For You views. Payment is monthly once you pass $50 (US terms).",
        p.country !== "us" && p.country !== "uk" ? "Check TikTok's list of eligible countries for where you live." : "",
      ])) + checked,
      links: (p) => (p.channel === "yt" ? [link("ytYppJoin", "YouTube Partner Program")] : [link("ttRewardsAcademy", "Creator Rewards Program")]),
      src: (p) => (p.channel === "yt" ? ["ytYpp", "ytBlog"] : ["ttRewards", "ttRewardsAcademy", "ttRewardsTerms"]) },

    { id: "cr2-niche", day: 2, area: "research", prio: "high", when: (p) => p.model === "creator" && p.level !== "selling",
      title: "Pick a topic and a format you can repeat every week",
      body: () => ul([
        "Choose a topic you can make many videos about, and one repeatable format, such as reviews, tutorials or day-in-the-life.",
        "Use the trend and demand check to compare topics, and watch the most popular recent videos in your topic.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "cr3-batch", day: 3, area: "content", prio: "high", when: (p) => p.model === "creator",
      title: "Plan and film 5 videos in one session",
      body: (p) => ul([
        "Write a hook, three points and an ending for each video, then film them together.",
        p.channel === "tt_creator" ? "For Creator Rewards, make them at least 1 minute long and fully your own." : "Mix Shorts with at least one longer video; Shorts-feed views don't count towards the 4,000 watch hours.",
        "Use only music, clips and images you have the rights to use.",
      ]),
      action: { label: "Draft hooks with AI", go: "tools:hooks" }, src: (p) => (p.channel === "tt_creator" ? ["ttRewards"] : ["ytYpp"]) },

    { id: "cr4-post", day: 4, area: "marketing", prio: "high", when: (p) => p.model === "creator",
      title: "Post on a schedule you can keep",
      body: () => "<p>Pick posting days you can keep for months, not just this week. Reply to comments in the first hours after posting.</p>" },

    { id: "cr5-deals", day: 5, area: "legal", prio: "med", when: (p) => p.model === "creator",
      title: "Know the rules for sponsorships and affiliate links",
      body: DISCLOSE_TEXT,
      action: { label: "Open the disclosure lesson", go: "lesson:disclose" }, src: ["ftcInfluencer", "ftcEndorse"] },

    { id: "cr6-income", day: 6, area: "finance", prio: "med", when: (p) => p.model === "creator",
      title: "Map out where income could come from",
      body: () => "<p>Platform payouts, sponsorships, affiliate links and your own products (digital products, courses, merch) all add up. The creator income calculator shows how they combine.</p>",
      action: { label: "Open the creator income calculator", go: "tools:creator" } },

    { id: "cr7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "creator",
      title: "Read your analytics and decide what to make next",
      body: (p) => "<p>In " + (p.channel === "yt" ? "YouTube Studio" : "TikTok Studio") + ", find which videos kept viewers watching longest and which brought followers. Make more of those.</p>" },

    // ======== Online courses and coaching
    { id: "co1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "courses" && p.level === "new",
      title: "Read: selling online courses",
      body: () => "<p>A short lesson in this app on platform costs, checking demand before you build, and keeping promises you can back up.</p>",
      action: { label: "Open the lesson", go: "lesson:courses" } },

    { id: "co1-platform", day: 1, area: "store", prio: "high", when: (p) => p.model === "courses" && p.level === "new",
      title: (p) => "Set up " + CHANNEL_NAME[p.channel],
      body: (p) => ({
        teachable: ul([
          "Annual-billing prices: Starter $29/month, Builder $69/month, Growth $139/month. Every self-serve plan has a 7-day free trial.",
          "Starter adds a 7.5% transaction fee on each sale (on the price including tax). Builder and Growth have 0% transaction fees with Teachable Payments.",
          "Card processing is separate: 2.9% + 30¢ for US cards, 3.9% + 30¢ for international cards.",
        ]),
        thinkific: ul([
          "There's no free plan, but there's a 30-day free trial.",
          "Basic costs $54 a month billed monthly, or $40 a month billed yearly.",
          "No transaction fees when you use Thinkific Payments; card processing is about 2.9%.",
        ]),
        payhip: "<p>" + FEE_TEXT.payhip + " Payhip can sell courses as well as downloads.</p>",
      })[p.channel] + checked,
      links: (p) => [link(p.channel === "teachable" ? "teachable" : p.channel === "thinkific" ? "thinkific" : "payhip")],
      src: (p) => ({ teachable: ["teachable", "teachableFees"], thinkific: ["thinkific", "thinkificFaq"], payhip: ["payhip"] })[p.channel] },

    { id: "co2-validate", day: 2, area: "research", prio: "high", when: (p) => p.model === "courses" && p.level !== "selling",
      title: "Check people want it before you build it",
      body: () => ul([
        "Write the course promise in one sentence: who it's for and what they'll be able to do afterwards.",
        "Ask 10 people in your audience whether they'd buy it, or open a waitlist.",
        "Read reviews of similar courses to see what buyers wish had been included.",
      ]) },

    { id: "co3-outline", day: 3, area: "content", prio: "high", when: (p) => p.model === "courses" && p.level !== "selling",
      title: "Outline 5 to 10 short lessons",
      body: () => "<p>Each lesson should get the student one step closer to the promised result. Cut anything that doesn't.</p>",
      action: { label: "Ask AI to review your outline", go: "tools:helper" } },

    { id: "co4-record", day: 4, area: "content", prio: "high", when: (p) => p.model === "courses",
      title: "Record the first module",
      body: () => "<p>Clear sound matters more than video quality. Add captions, and keep each lesson short and focused.</p>" },

    { id: "co5-sales", day: 5, area: "listings", prio: "high", when: (p) => p.model === "courses",
      title: "Write the sales page and set the price",
      body: (p) => ul([
        "Say who it's for, what's inside, and what students can do afterwards.",
        "Only promise results you can back up, and never guarantee income.",
        "Use the price calculator with your platform's fees.",
      ]),
      action: { label: "Open the price calculator", go: "tools:price" }, src: ["ftcScam"] },

    { id: "co6-launch", day: 6, area: "marketing", prio: "high", when: (p) => p.model === "courses",
      title: "Open enrolment to a small first group",
      body: (p) => ul([
        "Invite your waitlist first and ask the first students for feedback.",
        p.country === "us" ? "Marketing emails must follow CAN-SPAM: clearly identified as an ad unless people asked for them, your postal address, and a working opt-out honoured within 10 business days." : "",
      ]),
      src: (p) => (p.country === "us" ? ["canSpam"] : []) },

    { id: "co7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "courses",
      title: "Review sign-ups and student feedback",
      body: () => "<p>Note where people stopped on the sales page and what students found hardest. Fix those first.</p>" },

    // ======== Self-publishing books (Amazon KDP)
    { id: "bk1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "books" && p.level === "new",
      title: "Read: self-publishing with Amazon KDP",
      body: () => "<p>A short lesson in this app on royalties, printing costs and KDP's content rules.</p>",
      action: { label: "Open the lesson", go: "lesson:books" } },

    { id: "bk1-account", day: 1, area: "store", prio: "high", when: (p) => p.model === "books" && p.level === "new",
      title: "Create your KDP account and learn the royalty options",
      body: () => ul([
        "eBooks earn 35% or 70%. On Amazon.com the 70% option needs a list price from $2.99 to $12.99 (since July 7, 2026), and a delivery cost of $0.15 per MB is taken off first.",
        "Paperbacks on Amazon.com earn 60% of the list price at $9.99 and up (50% below that), minus the printing cost.",
        "Royalties are paid about 60 days after the end of the month of the sale.",
        "Public domain works can only use the 35% option.",
      ]) + checked,
      links: [link("kdp", "Open KDP")], src: ["kdpEbook", "kdpPaper", "kdpPrint"] },

    { id: "bk1-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "books",
      title: "Read KDP's rules on AI and content",
      body: () => ul([
        "You must tell KDP about AI-generated content (text, images or translations), including cover and interior art, when you publish or republish.",
        "Content an AI tool created counts as AI-generated even if you edited it a lot. Writing you did yourself that AI only helped edit or brainstorm is “AI-assisted” and doesn't need to be disclosed.",
        "You're responsible for making sure everything follows KDP's content guidelines and respects other people's rights.",
      ]),
      links: [link("kdpContent", "KDP content guidelines")], src: ["kdpContent"] },

    { id: "bk2-idea", day: 2, area: "research", prio: "high", when: (p) => p.model === "books" && p.level !== "selling",
      title: "Pick a topic and a reader",
      body: () => ul([
        "Search Amazon for your topic and read the 1- to 3-star reviews of popular books: they show what readers still want.",
        "Write one sentence on who the book is for and what it gives them.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "bk3-write", day: 3, area: "content", prio: "high", when: (p) => p.model === "books",
      title: "Outline the book and write the first chapter",
      body: () => "<p>A chapter-by-chapter outline keeps you moving. Set a daily word count you can keep.</p>" },

    { id: "bk4-cover", day: 4, area: "content", prio: "med", when: (p) => p.model === "books",
      title: "Plan the cover and interior",
      body: () => ul([
        "The cover needs to read clearly as a small thumbnail.",
        "For paperbacks, page count, trim size, ink and paper type set the printing cost, which comes off your royalty.",
        "Disclose any AI-generated cover or interior images.",
      ]),
      src: ["kdpPrint", "kdpContent"] },

    { id: "bk5-price", day: 5, area: "finance", prio: "high", when: (p) => p.model === "books",
      title: "Set your prices from the royalty numbers",
      body: () => "<p>Work out the royalty per copy at a few prices for the eBook and paperback, and pick prices that fit your genre.</p>",
      action: { label: "Open the book royalty calculator", go: "tools:royalty" }, src: ["kdpEbook", "kdpPaper"] },

    { id: "bk6-launch", day: 6, area: "marketing", prio: "med", when: (p) => p.model === "books",
      title: "Write the description and tell your first readers",
      body: () => "<p>The book description sells the book. Share the launch with people who asked for it, and keep writing the next one.</p>",
      action: { label: "Draft the description with AI", go: "tools:describe" } },

    { id: "bk7-review", day: 7, area: "finance", prio: "med", when: (p) => p.model === "books",
      title: "Check your progress and set next week's writing target",
      body: () => "<p>Most self-published income comes from several books over time. Plan the next one while this one is fresh.</p>" },

    // ======== Newsletters
    { id: "nl1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "newsletter" && p.level === "new",
      title: "Read: making money from a newsletter",
      body: () => "<p>A short lesson in this app on paid subscriptions, sponsorships, platform fees and email rules.</p>",
      action: { label: "Open the lesson", go: "lesson:newsletter" } },

    { id: "nl1-platform", day: 1, area: "store", prio: "high", when: (p) => p.model === "newsletter" && p.level === "new",
      title: (p) => "Start your newsletter on " + CHANNEL_NAME[p.channel],
      body: (p) => (p.channel === "substack" ? ul([
        "Publishing is free at any size.",
        "If you turn on paid subscriptions, Substack keeps 10% of subscription revenue and Stripe charges processing (for US cards 2.9% + 30¢ per payment, plus 0.7% for recurring billing).",
        "Apple takes its own fee on subscriptions bought through Substack's iOS app.",
      ]) : ul([
        "The Free plan costs nothing, needs no card and covers up to 2,500 subscribers across all your publications.",
        "Paid subscriptions are on paid plans, with 0% platform fees according to beehiiv; check the pricing page for current plan prices and payment processing.",
      ])) + checked,
      links: (p) => [link(p.channel === "substack" ? "substackCost" : "beehiivPricing")],
      src: (p) => (p.channel === "substack" ? ["substackCost"] : ["beehiivPlans", "beehiivPricing"]) },

    { id: "nl1-email", day: 1, area: "legal", prio: "high", when: (p) => p.model === "newsletter",
      title: "Learn the email rules",
      body: (p) => ul([
        p.country === "us" ? "US CAN-SPAM rules for commercial email: include a valid postal address, an opt-out that works for at least 30 days after you send, and honour opt-outs within 10 business days." : "If you email people in the US, the CAN-SPAM rules apply: postal address, a working opt-out, and opt-outs honoured within 10 business days. Check your own country's rules too.",
        "Opting out can't cost anything or ask for more than an email address.",
        "Sponsored sections and affiliate links need a clear disclosure.",
        "Buying email lists is risky: they can include people who already opted out.",
      ]),
      src: ["canSpam", "ftcInfluencer"] },

    { id: "nl2-topic", day: 2, area: "research", prio: "high", when: (p) => p.model === "newsletter" && p.level !== "selling",
      title: "Write your newsletter's promise and schedule",
      body: () => "<p>One sentence: who it's for, what they get and how often. Pick a schedule you can keep for a year.</p>",
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "nl3-issues", day: 3, area: "content", prio: "high", when: (p) => p.model === "newsletter",
      title: "Write your first 3 issues before you launch",
      body: () => "<p>Having issues ready lets you keep the schedule while you focus on finding readers.</p>",
      action: { label: "Ask AI for issue ideas", go: "tools:helper" } },

    { id: "nl4-signup", day: 4, area: "store", prio: "high", when: (p) => p.model === "newsletter",
      title: "Make your sign-up page",
      body: () => "<p>Say what readers get and how often. A small free download (a checklist or guide you made) can help people decide to sign up.</p>" },

    { id: "nl5-promote", day: 5, area: "marketing", prio: "high", when: (p) => p.model === "newsletter",
      title: "Share it where your readers already are",
      body: () => "<p>Post your best idea from each issue on social media with a link to subscribe, and ask other newsletter writers in your topic about recommending each other.</p>",
      action: { label: "Draft posts with AI", go: "tools:hooks" } },

    { id: "nl6-money", day: 6, area: "finance", prio: "med", when: (p) => p.model === "newsletter",
      title: "Work out what paid subscriptions could earn",
      body: () => "<p>Subscribers × the share who pay × price, minus platform and payment fees. The subscription income calculator does the maths.</p>",
      action: { label: "Open the subscription income calculator", go: "tools:recurring" } },

    { id: "nl7-review", day: 7, area: "finance", prio: "med", when: (p) => p.model === "newsletter",
      title: "Check sign-ups and opens",
      body: () => "<p>See which posts brought subscribers and which issues were opened most, and do more of that.</p>" },

    // ======== Amazon FBA (private label)
    { id: "fb1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "fba" && p.level === "new",
      title: "Read: how Amazon FBA works, and the money it takes",
      body: () => "<p>A short lesson in this app on FBA fees, storage, Brand Registry and the upfront cost of inventory.</p>",
      action: { label: "Open the lesson", go: "lesson:fba" } },

    { id: "fb1-account", day: 1, area: "store", prio: "high", when: (p) => p.model === "fba" && p.level === "new",
      title: "Open a Professional seller account",
      body: () => ul([
        "Professional costs $39.99 a month plus selling fees, and includes access to Brand Registry tools.",
        "You'll need a business email, a chargeable credit card, government ID, tax information and a bank account. Identity verification must be finished before you can list.",
      ]) + checked,
      links: [link("amzPricing", "Amazon selling plans")], src: ["amzPricing", "brandRegistry"] },

    { id: "fb2-research", day: 2, area: "research", prio: "high", when: (p) => p.model === "fba" && p.level !== "selling",
      title: "Research products you could improve and brand",
      body: () => ul([
        "Read 1- to 3-star reviews of best-selling products in a category: they show problems you could fix.",
        "Avoid anything protected by someone else's trademark, patent or design.",
        "Use the trend and demand check to compare ideas.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" }, src: ["shopIP"] },

    { id: "fb3-fees", day: 3, area: "finance", prio: "high", when: (p) => p.model === "fba",
      title: "Estimate every fee before you order stock",
      body: () => ul([
        "Referral fee (by category) + FBA fulfilment fee (by size and weight) + monthly storage (by cubic foot, higher in holiday months) + an inbound placement fee.",
        "Items stored more than 181 days are charged an extra aged-inventory fee.",
        "New sellers who send eligible products to FBA within 90 days of their first listing get FBA New Selection benefits such as free monthly storage and fee discounts.",
        "Use Amazon's revenue calculator for the real fees, then enter them in the profit calculator.",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" },
      links: [link("fbaCalc", "Amazon's fee estimator")], src: ["fbaGuide", "fbaCalc"] },

    { id: "fb3-supplier", day: 3, area: "suppliers", prio: "high", when: (p) => p.model === "fba",
      title: "Find a manufacturer and order samples",
      body: (p) => ul([
        "Compare at least 3 manufacturers on samples, price and minimum order.",
        p.country === "us" ? "As the importer you're responsible for product safety. Children's products (for ages 12 and under) need a Children's Product Certificate backed by third-party lab testing." : "As the importer you're responsible for meeting product safety rules where you sell.",
        "Only invest in inventory you can afford to lose.",
      ]),
      src: (p) => (p.country === "us" ? ["cpscCpc", "shopDrop"] : ["shopDrop"]) },

    { id: "fb4-brand", day: 4, area: "legal", prio: "med", when: (p) => p.model === "fba",
      title: "Plan your brand and Brand Registry",
      body: () => ul([
        "Brand Registry is free. Amazon's page says you need an active registered trademark or a pending application, as a word mark or a design mark with words, letters or numbers.",
        "Your brand name must appear on the product or its packaging.",
      ]),
      links: [link("brandRegistry")], src: ["brandRegistry"] },

    { id: "fb5-listing", day: 5, area: "listings", prio: "high", when: (p) => p.model === "fba",
      title: "Draft the listing and images",
      body: () => "<p>Title, bullet points and images should answer buyers' questions and fix the complaints you found in reviews. Only claim what your samples show.</p>",
      action: { label: "Draft the listing with AI", go: "tools:describe" } },

    { id: "fb6-ship", day: 6, area: "orders", prio: "med", when: (p) => p.model === "fba",
      title: "Plan your first FBA shipment",
      body: () => "<p>Inventory has to be labelled, packed and sent to Amazon before it can sell. Check Amazon's shipment requirements and the inbound placement fee options when you create the shipment in Seller Central.</p>",
      src: ["fbaGuide"] },

    { id: "fb7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "fba",
      title: "Check your numbers before you place the order",
      body: () => "<p>Re-check profit per unit with real quotes and fees. FBA takes weeks to set up; this week is about making sure the numbers work before you spend on stock.</p>",
      action: { label: "Open the profit calculator", go: "tools:profit" } },

    // ======== Handmade products
    { id: "hm1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "handmade" && p.level === "new",
      title: "Read: selling handmade products",
      body: () => "<p>A short lesson in this app on pricing your time, Etsy's handmade rules and product safety.</p>",
      action: { label: "Open the lesson", go: "lesson:handmade" } },

    { id: "hm1-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "handmade" && p.channel === "etsy",
      title: "Read Etsy's rules for handmade items",
      body: () => ul([
        "“Made by a seller” means made by you by hand or with your own tools (including 3D printers, laser cutters and Cricut machines).",
        "Listing photos must be your own photos of the finished item, not stock photos or renderings.",
        "Reselling items you didn't make or design isn't allowed in the handmade category. Assembling a kit or adding a sticker to a bought item doesn't count as making it.",
        "If you used AI to create an item, say so in the listing.",
      ]),
      links: [link("etsyCreativity", "Etsy's Creativity Standards")], src: ["etsyCreativity", "etsySellerPolicy"] },

    { id: "hm1-safety", day: 1, area: "legal", prio: "high", when: (p) => p.model === "handmade" && p.country === "us",
      title: "Check product safety rules (US)",
      body: () => ul([
        "Products made mainly for children 12 and under need a Children's Product Certificate, based on testing by a CPSC-accepted lab. Selling only on your own website doesn't change that.",
        "Registering as a Small Batch Manufacturer can reduce some testing, but lead in paint, small parts and some other rules always need lab testing.",
        "Products for adults may need a General Certificate of Conformity if a CPSC rule applies to them.",
      ]) + '<p class="small muted">General information from the CPSC, not legal advice.</p>',
      links: [link("cpscCpc", "Children's Product Certificate"), link("cpscSmall", "Small batch rules")], src: ["cpscCpc", "cpscSmall", "cpscGcc"] },

    { id: "hm2-product", day: 2, area: "research", prio: "high", when: (p) => p.model === "handmade" && p.level !== "selling",
      title: "Choose 1 to 3 products to start with",
      body: () => "<p>Pick items you can make consistently well. Search your platform to see similar items, their prices and what reviewers praise or complain about.</p>",
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "hm3-price", day: 3, area: "finance", prio: "high", when: (p) => p.model === "handmade",
      title: "Price materials and your time",
      body: (p) => ul([
        "Add up materials per item, then add your time at an hourly rate you'd accept (put it in “Other costs”).",
        FEE_TEXT[p.channel] || "",
        "Use the price calculator to reach your target margin after fees.",
      ]),
      action: { label: "Open the price calculator", go: "tools:price" }, src: (p) => [FEE_SRC[p.channel]].filter(Boolean) },

    { id: "hm4-photos", day: 4, area: "content", prio: "high", when: (p) => p.model === "handmade",
      title: "Photograph your items",
      body: () => "<p>Use daylight and a plain background, and show scale, detail and the item in use. On Etsy these must be your own photos of the finished item.</p>", src: ["etsyCreativity"] },

    { id: "hm5-list", day: 5, area: "listings", prio: "high", when: (p) => p.model === "handmade",
      title: "Create your first listings",
      body: () => "<p>Give materials, size, care instructions and how long it takes you to make and ship.</p>",
      action: { label: "Draft the description with AI", go: "tools:describe" } },

    { id: "hm6-promote", day: 6, area: "marketing", prio: "high", when: (p) => p.model === "handmade",
      title: "Show your process on social media",
      body: () => "<p>Short videos of you making the item are original content only you can post. Link to your shop.</p>",
      action: { label: "Draft hooks with AI", go: "tools:hooks" } },

    { id: "hm7-review", day: 7, area: "finance", prio: "med", when: (p) => p.model === "handmade",
      title: "Review views, sales and time spent",
      body: () => "<p>Check whether your price really pays for your time. Raise prices or simplify the item if it doesn't.</p>",
      action: { label: "Open the profit calculator", go: "tools:profit" } },

    // ======== Ongoing (repeat)
    { id: "on-orders", day: 7, ongoing: true, repeat: "daily", area: "orders", prio: "high", when: (p) => SHIP(p) || p.model === "resell" || p.model === "handmade",
      title: "Process new orders and add tracking", body: () => "<p>Ship or send new orders, confirm tracking, and follow up on any order without movement.</p>" },
    { id: "on-inbox", day: 7, ongoing: true, repeat: "daily", area: "support", prio: "med", when: (p) => !["affiliate", "creator", "books", "newsletter", "freelance"].includes(p.model),
      title: "Answer customer messages", body: () => "<p>Reply to every message. For late orders, send a delay notice with a new date and the option to cancel for a full refund.</p>", action: { label: "Open message templates", go: "tools:messages" }, src: ["ftcMail"] },
    { id: "on-post", day: 7, ongoing: true, repeat: "daily", area: "content", prio: "high", when: (p) => p.model === "affiliate",
      title: "Post one piece of content with a clear disclosure", body: DISCLOSE_TEXT, src: ["ftcInfluencer"] },
    { id: "on-list", day: 7, ongoing: true, repeat: "daily", area: "listings", prio: "med", when: (p) => p.model === "resell",
      title: "List 3 new items", body: () => "<p>Consistent listing is how a reselling shop grows. Price each item from recent sold listings.</p>" },
    { id: "on-pitch", day: 7, ongoing: true, repeat: "daily", area: "marketing", prio: "high", when: (p) => p.model === "freelance",
      title: "Reply to clients and send new proposals or pitches", body: () => "<p>Reply to every client message the same day, and spend some time each day finding the next job.</p>" },
    { id: "on-create", day: 7, ongoing: true, repeat: "daily", area: "content", prio: "high", when: (p) => ["creator", "newsletter", "books", "courses"].includes(p.model),
      title: (p) => ({ creator: "Make or post today's video", newsletter: "Work on the next issue", books: "Write today's words", courses: "Make one piece of course or marketing content" })[p.model],
      body: () => "<p>Small, steady output beats occasional big pushes. Keep to the schedule you chose.</p>" },
    { id: "on-make", day: 7, ongoing: true, repeat: "weekly", area: "content", prio: "med", when: (p) => p.model === "digital" || p.model === "pod" || p.model === "handmade",
      title: "Add or improve one product", body: () => "<p>Add a new design or product, or improve the listing of one that gets views but few sales.</p>" },
    { id: "on-week", day: 7, ongoing: true, repeat: "weekly", area: "finance", prio: "med", when: () => true,
      title: "Weekly check: income, costs and profit", body: () => "<p>Re-run the calculators with this week's real numbers.</p>", action: (p) => ({ label: "Open the calculator", go: "tools:" + ({ affiliate: "affiliate", freelance: "rate", books: "royalty", newsletter: "recurring", creator: "creator", resell: "maxbuy" }[p.model] || "profit") }) },
    { id: "on-supplier", day: 7, ongoing: true, repeat: "weekly", area: "suppliers", prio: "low", when: (p) => SHIP(p),
      title: "Check supplier stock, prices and delivery times", body: () => "<p>Update your prices and the delivery time you show customers if anything changed.</p>" },
  ];
  const STEP = Object.fromEntries(GUIDE.map((s) => [s.id, s]));
  const val = (v, p) => (typeof v === "function" ? v(p) : v);

  // ---------------------------------------------------------------------------
  // Lessons and courses
  // ---------------------------------------------------------------------------
  const LESSONS = [
    { id: "how", title: "How dropshipping works and who is responsible", mins: 4, fit: (p) => SHIP(p),
      body: () => "<p>You list a product, a customer pays you, and you pay a supplier to make or ship it straight to the customer. You never hold stock.</p><p>The customer bought from you, so the responsibility stays with you:</p>" + ul([
        "Shopify's guidance: if a product fails the safety standards where it's shipped, you can be liable. You must remove recalled products and may need to tell buyers. Dropshipping doesn't lower the rules that apply to a retailer.",
        "In the US, the FTC's Mail Order Rule covers your delivery promises whether you ship orders yourself or someone else does.",
        "On marketplaces, the platform decides whether dropshipping is allowed at all. See “Where each model is allowed”.",
      ]) + "<p><b>Where the money goes.</b> Each order pays for the product, shipping, platform and payment fees and any advertising. What's left is your profit. Monthly costs such as your store plan and apps come out of the total.</p>",
      src: ["shopDrop", "ftcMail"] },
    { id: "affiliate", title: "How affiliate marketing works", mins: 4, fit: (p) => p.model === "affiliate",
      body: () => "<p>You recommend another company's product with a tracked link. When someone buys through your link, the company pays you a commission. You don't handle products, payments or shipping.</p>" + ul([
        "<b>Amazon Associates</b>: commission by category, 0% to 10% (4% for unlisted categories). Your account is reviewed after 3 qualifying sales within 180 days.",
        "<b>TikTok Shop affiliate (US)</b>: 18+, US-based, at least 1,000 followers; under 5,000 followers you start in a 30-day pilot with limits.",
        "<b>Affiliate networks</b> (Awin, impact.com, CJ): free or nearly free to join; you then apply to each brand's program.",
        "<b>The law</b>: in the US you must clearly disclose that you earn from your links, close to each recommendation.",
      ]) + "<p>Income depends on how many people see your content, click and buy. Programs pay only on completed sales, often weeks later.</p>",
      src: ["amzAssocPart", "amzAssocAgree", "ttsCreator", "awinJoin", "impact", "cjAff", "ftcInfluencer"] },
    { id: "disclose", title: "Disclosure rules for affiliate links and sponsored posts", mins: 3, fit: (p) => p.model === "affiliate",
      body: (p) => DISCLOSE_TEXT(p || {}) + '<p class="small muted">Summary of FTC guidance and platform rules, not legal advice.</p>',
      src: ["ftcInfluencer", "ftcEndorse", "amzAssocAgree", "pinterestRules"] },
    { id: "digital", title: "Selling digital products", mins: 4, fit: (p) => p.model === "digital",
      body: () => "<p>You make a file once, such as a planner, template, printable or guide, and sell it again and again. There's nothing to ship, so platform fees are the main cost on each sale.</p>" + ul([
        "<b>Etsy</b>: digital items must be made or designed by you, AI use must be disclosed, and listing photos must be your own. Fees are the same as physical items.",
        "<b>Gumroad</b>: 10% + 50¢ per direct sale; 30% for sales through its Discover marketplace.",
        "<b>Payhip</b>: Free plan 5% per sale, Plus $29/month with 2%, Pro $99/month with 0%, plus payment processing.",
        "<b>Shopify</b>: your own store plan, plus Shopify's free Digital Downloads app.",
        "<b>Licences</b>: anything you didn't make yourself (fonts, graphics, templates) needs a licence that allows commercial use.",
      ]) + checked,
      src: ["etsySellerPolicy", "etsyFees", "gumroad", "payhip", "shopDigital", "canvaLicense"] },
    { id: "resell", title: "Reselling basics", mins: 4, fit: (p) => p.model === "resell",
      body: () => "<p>You buy items you can sell for more (secondhand, clearance), list them and ship them yourself. Because you own the items, this isn't dropshipping, and eBay allows it.</p>" + ul([
        "<b>Price from sold listings</b>, not asking prices: they show what buyers actually paid.",
        "<b>Know your maximum buy price</b> before you shop: sold price − fees − shipping − supplies − the profit you want.",
        "<b>Fees</b>: eBay 13.6% + $0.30/$0.40 per order in most categories; Mercari 10%; Poshmark $2.95 under $15, 20% at $15 or more.",
        "<b>Taxes (US)</b>: marketplaces send a Form 1099-K when you pass $20,000 and 200 sales in a year, and may send one below that. Report all income either way.",
      ]) + checked,
      src: ["ebayFees", "ebayDrop", "mercariFees", "poshFees", "irs1099kFaq"] },
    { id: "freelance", title: "How freelancing online works", mins: 4, fit: (p) => p.model === "freelance",
      body: () => "<p>You sell your skills, such as design, writing, editing, admin or coding, by the project or by the hour. There's no stock, but your time is the limit.</p>" + ul([
        "<b>Fiverr</b>: clients buy your packaged gigs. Fiverr keeps 20% of every order, including tips. Earnings clear 14 days after completion (7 days for some seller levels).",
        "<b>Upwork</b>: you send proposals to jobs. The service fee is 0% to 15% per contract, shown upfront; proposals cost Connects ($0.15 each beyond your free ones).",
        "<b>Your own clients</b>: no platform fee, but you find every client and handle contracts and payment.",
        "<b>Tax (US)</b>: self-employment tax is 15.3% on 92.35% of net earnings, owed once those earnings reach $400 in a year, on top of income tax. If you'll owe $1,000 or more, pay estimated tax quarterly.",
        "<b>Rate</b>: only some hours are billable. Price so billable hours cover your target income, costs, fees and tax.",
      ]) + checked,
      src: ["fiverrVsUpwork", "fiverrOrders", "upworkFee", "upworkConnects", "irsSE", "irsEst"] },
    { id: "creator", title: "How creators get paid", mins: 4, fit: (p) => p.model === "creator",
      body: () => ul([
        "<b>YouTube Partner Program</b>: from 500 subscribers (with 3 recent uploads and 3,000 watch hours or 3 million Shorts views) for fan funding and Shopping; from 1,000 subscribers (with 4,000 watch hours or 10 million Shorts views) for ad revenue. YouTube shares 55% of ad revenue on long videos and 45% on Shorts.",
        "<b>TikTok Creator Rewards</b>: 10,000 followers and 100,000 views in 30 days, 18+, original videos at least 1 minute long. Paid monthly once you pass $50 (US).",
        "<b>Sponsorships</b>: brands pay for a mention or video. You must disclose them clearly, in the video itself.",
        "<b>Affiliate links and your own products</b>: often steadier than platform payouts.",
      ]) + "<p>Meeting a threshold starts a review; it doesn't guarantee approval or income.</p>" + checked,
      src: ["ytYpp", "ytBlog", "ttRewards", "ttRewardsTerms", "ftcInfluencer"] },
    { id: "courses", title: "Selling online courses", mins: 4, fit: (p) => p.model === "courses",
      body: () => ul([
        "<b>Check demand first</b>: a waitlist or pre-sale tells you whether people will pay before you record hours of video.",
        "<b>Teachable</b>: Starter $29/month (annual billing) with a 7.5% transaction fee; Builder $69 and Growth $139 with 0% on Teachable Payments. Card processing is extra (2.9% + 30¢ for US cards).",
        "<b>Thinkific</b>: no free plan, 30-day trial; Basic from $40/month billed yearly; no transaction fees on Thinkific Payments.",
        "<b>Payhip</b>: a free plan with a 5% fee per sale, plus processing.",
        "<b>Promises</b>: describe what students will learn; don't promise income or results you can't back up.",
        "<b>Email (US)</b>: marketing emails must follow CAN-SPAM, including an opt-out and your postal address.",
      ]) + checked,
      src: ["teachable", "teachableFees", "thinkific", "thinkificFaq", "payhip", "ftcScam", "canSpam"] },
    { id: "books", title: "Self-publishing with Amazon KDP", mins: 4, fit: (p) => p.model === "books",
      body: () => ul([
        "<b>eBook royalties</b>: 35% of the list price, or 70% of the list price minus a delivery cost ($0.15 per MB on Amazon.com). The 70% option needs a list price from $2.99 to $12.99 on Amazon.com.",
        "<b>Paperback royalties</b>: 60% of the list price at $9.99 and up on Amazon.com (50% below), minus the printing cost. Printing cost depends on page count, trim size, ink and paper.",
        "<b>Payment</b>: about 60 days after the end of the month of the sale.",
        "<b>AI</b>: AI-generated text, images or translations must be disclosed to KDP; AI-assisted editing of your own writing doesn't need to be.",
        "<b>Rights</b>: you're responsible for everything in the book respecting other people's rights.",
      ]) + checked,
      src: ["kdpEbook", "kdpPaper", "kdpPrint", "kdpContent"] },
    { id: "newsletter", title: "Making money from a newsletter", mins: 4, fit: (p) => p.model === "newsletter",
      body: () => ul([
        "<b>Income</b>: paid subscriptions, sponsorships and affiliate links. Most readers stay on the free tier, so growth comes first.",
        "<b>Substack</b>: free to publish; 10% of paid subscription revenue plus Stripe processing.",
        "<b>beehiiv</b>: Free plan up to 2,500 subscribers; paid subscriptions on paid plans.",
        "<b>Email rules (US CAN-SPAM)</b>: a valid postal address, a working opt-out, and opt-outs honoured within 10 business days. Sponsored content and affiliate links need a clear disclosure.",
      ]) + checked,
      src: ["substackCost", "beehiivPlans", "canSpam", "ftcInfluencer"] },
    { id: "fba", title: "How Amazon FBA works, and what it costs", mins: 5, fit: (p) => p.model === "fba",
      body: () => "<p>You buy inventory, usually your own brand, and send it to Amazon's warehouses. Amazon stores it, ships each order and handles customer service and returns for those orders.</p>" + ul([
        "<b>Fees</b>: Professional plan $39.99/month; a referral fee by category; an FBA fulfilment fee by size and weight; monthly storage by cubic foot (higher in holiday months); an aged-inventory fee after 181 days; and an inbound placement fee.",
        "<b>New sellers</b>: FBA New Selection gives benefits such as free monthly storage and fee discounts if you send eligible products to FBA within 90 days of your first listing.",
        "<b>Brand Registry</b>: free; Amazon's page says you need a registered trademark or a pending application.",
        "<b>Risk</b>: unlike dropshipping, you pay for stock before you sell anything, and unsold stock keeps costing storage.",
        "<b>Safety</b>: as the importer you're responsible for product safety; US children's products need lab testing and a Children's Product Certificate.",
      ]) + checked,
      src: ["fbaGuide", "fba", "fbaCalc", "brandRegistry", "amzPricing", "cpscCpc"] },
    { id: "handmade", title: "Selling handmade products", mins: 4, fit: (p) => p.model === "handmade",
      body: () => ul([
        "<b>Price your time</b>: materials + your time at a rate you'd accept + fees + profit. Many makers undercharge by leaving their time out.",
        "<b>Etsy's rules</b>: made by you by hand or with your own tools; your own photos of the finished item; no reselling in the handmade category; disclose AI use.",
        "<b>Safety (US)</b>: children's products (12 and under) need lab testing and a Children's Product Certificate. Small Batch registration reduces some testing, but not lead in paint or small parts.",
        "<b>Scale</b>: your hours limit how much you can sell, so price for profit from day one.",
      ]),
      src: ["etsyCreativity", "etsySellerPolicy", "cpscCpc", "cpscSmall"] },
    { id: "where", title: "Where each model is allowed", mins: 4, fit: () => true,
      body: () => '<div class="tablewrap"><table><thead><tr><th>Where</th><th>What the rules say</th></tr></thead><tbody>' +
        "<tr><td>Shopify</td><td>Dropshipping, print-on-demand and digital products allowed; retail rules apply</td></tr>" +
        "<tr><td>Etsy</td><td>No dropshipping (craft and party supplies aside). Print-on-demand and digital items only if you designed them</td></tr>" +
        "<tr><td>eBay</td><td>Dropshipping only with your own stock or a wholesale supplier agreement. Reselling items you own is fine</td></tr>" +
        "<tr><td>Amazon</td><td>Dropshipping only as the sole seller of record, supplier details removed, you handle returns</td></tr>" +
        "<tr><td>TikTok Shop US</td><td>Orders must be delivered within 6 business days</td></tr>" +
        "<tr><td>Affiliate links</td><td>Clear disclosure next to every recommendation (FTC); Amazon requires its own statement</td></tr>" +
        "<tr><td>Etsy handmade</td><td>Made by you, with your own photos of the finished item; no reselling</td></tr>" +
        "<tr><td>Amazon KDP</td><td>AI-generated text, images or translations must be disclosed</td></tr>" +
        "<tr><td>Sponsored videos and newsletters</td><td>Clear disclosure; marketing emails must follow CAN-SPAM (US)</td></tr>" +
        "</tbody></table></div>",
      src: ["shopDrop", "etsyDrop", "etsySellerPolicy", "ebayDrop", "amzDrop", "ttsFulfill", "ftcInfluencer"] },
    { id: "costs", title: "What it costs to start", mins: 5, fit: () => true,
      body: () => '<div class="tablewrap"><table><thead><tr><th>What</th><th>Cost</th></tr></thead><tbody>' +
        "<tr><td>Shopify</td><td>3-day free trial, then most plans $1/month for 3 months; Basic $39/month (or $29/month billed yearly). Shopify Payments: 2.9% + 30¢ per US online card order on Basic</td></tr>" +
        "<tr><td>Etsy</td><td>$0.20 per listing, 6.5% transaction fee, 3% + $0.25 processing (US); possible one-time setup fee</td></tr>" +
        "<tr><td>eBay</td><td>13.6% of the sale in most categories + $0.30 or $0.40 per order; 250 free listings a month</td></tr>" +
        "<tr><td>Amazon</td><td>$0.99 per unit (Individual) or $39.99/month (Professional), plus referral fees (most 8–15%)</td></tr>" +
        "<tr><td>TikTok Shop US</td><td>No setup fee; 6% commission per sale</td></tr>" +
        "<tr><td>Mercari</td><td>No listing fee; 10% of item price + buyer-paid shipping</td></tr>" +
        "<tr><td>Poshmark</td><td>$2.95 under $15; 20% at $15 or more</td></tr>" +
        "<tr><td>Gumroad</td><td>10% + 50¢ per direct sale; 30% via Discover</td></tr>" +
        "<tr><td>Payhip</td><td>Free plan 5%; Plus $29/month + 2%; Pro $99/month + 0%; plus processing</td></tr>" +
        "<tr><td>Amazon Associates, impact.com, CJ</td><td>Free to join</td></tr>" +
        "<tr><td>Awin</td><td>Small refundable deposit at sign-up</td></tr>" +
        "<tr><td>Fiverr</td><td>20% of every order, including tips</td></tr>" +
        "<tr><td>Upwork</td><td>0% to 15% per contract; extra Connects $0.15 each</td></tr>" +
        "<tr><td>Teachable</td><td>From $29/month (annual billing); 7.5% transaction fee on Starter</td></tr>" +
        "<tr><td>Thinkific</td><td>From $40/month billed yearly; no transaction fees on Thinkific Payments</td></tr>" +
        "<tr><td>Amazon KDP</td><td>Free to publish; royalties 35% or 70% (eBooks), 50–60% minus printing (paperbacks)</td></tr>" +
        "<tr><td>Substack</td><td>Free; 10% of paid subscription revenue plus Stripe processing</td></tr>" +
        "<tr><td>beehiiv</td><td>Free plan up to 2,500 subscribers</td></tr>" +
        "<tr><td>Amazon FBA</td><td>$39.99/month Professional plan + referral + fulfilment + storage fees, plus your inventory</td></tr>" +
        "<tr><td>DSers</td><td>Free plan; paid plans with a 14-day trial</td></tr>" +
        "<tr><td>CJdropshipping</td><td>Free app; pay for products, shipping and optional services</td></tr>" +
        "<tr><td>Spocket</td><td>From $39.99/month after a free trial</td></tr>" +
        "<tr><td>Printful</td><td>No monthly fee; pay per order</td></tr>" +
        "<tr><td>Printify</td><td>Free plan; Premium $39/month or $299/year</td></tr>" +
        "<tr><td>Canva</td><td>Free plan at $0</td></tr>" +
        "<tr><td>Meta ads</td><td>About $1/day minimum per ad set for most advertisers</td></tr>" +
        "<tr><td>TikTok ads</td><td>Campaign budget over $50; ad group over $20/day</td></tr>" +
        "</tbody></table></div>" + checked,
      src: ["shopPricing", "etsyFees", "ebayFees", "amzPricing", "ttsHome", "mercariFees", "poshFees", "gumroad", "payhip", "amzAssoc", "impact", "cjAff", "awinJoin", "fiverrVsUpwork", "upworkFee", "upworkConnects", "teachable", "thinkific", "kdpEbook", "kdpPaper", "substackCost", "beehiivPlans", "fbaGuide", "dsers", "cj", "spocket", "printful", "printify", "canva", "metaBudget", "ttBudget"] },
    { id: "price", title: "Pricing for profit", mins: 3, fit: () => true,
      body: () => "<p>Work backwards from what each sale costs you:</p>" + ul([
        "<b>Costs per sale</b>: product, shipping you pay, packaging, and the platform and payment fees (a percentage of the price plus a fixed amount).",
        "<b>Profit before ads</b> = price − costs per sale. This is also your <b>break-even ad cost</b>: the most you can pay in advertising for one sale without losing money.",
        "<b>Profit after ads</b> = profit before ads − ad spend per sale.",
        "<b>Monthly costs</b> (store plan, apps) need enough sales to cover them: monthly costs ÷ profit per sale.",
      ]) + "<p>The calculators in Tools do this with your own numbers and the fee rates for your platform.</p>",
      go: "tools:profit" },
    { id: "delivery", title: "Delivery promises and refunds (US law)", mins: 4, fit: (p) => SHIP(p) || p.model === "resell",
      body: () => ul([
        "When you take an order you need a reasonable basis to expect shipping within the time you state, or within 30 days if you don't state one.",
        "If you can't ship on time, send a delay notice before the promised date. It must give a new ship date (or say you can't give one), say the customer can cancel for a full, prompt refund, and give a free way to cancel. Email is fine.",
        "Silence can count as agreement only for a first delay of 30 days or less, and only if the notice says so. Longer delays and any second delay need the customer's actual consent.",
        "You must cancel and refund if the customer cancels before shipping, if you miss the notice deadlines, or if you'll never be able to ship. Gift cards don't count as refunds.",
        "The rule applies whether you ship orders yourself or someone else does.",
      ]) + '<p class="small muted">Summary of the FTC business guide, not legal advice.</p>',
      src: ["ftcMail"] },
    { id: "research", title: "Finding ideas with free tools", mins: 4, fit: () => true,
      body: () => ul([
        "<b>TikTok Creative Center, Top Products</b>: products ranked by how often they appear in TikTok ads and how well they convert, by region and category. Desktop only; sign in first.",
        "<b>Meta Ad Library</b>: search by keyword or advertiser to see ads live on Facebook and Instagram. New ads appear within 24 hours. It doesn't show spend or reach for ordinary product ads.",
        "<b>Google Trends</b>: compare up to 5 groups of terms on the classic Explore page. Values are scaled 0 to 100 and show relative interest, not volume. Pick a topic rather than a search term when one exists.",
        "<b>eBay sold listings</b>: show what actually sold recently and for how much.",
        "Avoid products that use someone else's brand, logo or characters; those listings get removed.",
      ]),
      src: ["ttTopHelp", "metaLibHelp", "trendsHelp", "shopIP"] },
    { id: "scams", title: "Spotting get-rich-quick courses and coaches", mins: 3, fit: () => true,
      body: () => "<p>The FTC lists warning signs for business coaching and “make money online” offers:</p>" + ul([
        "Promises of guaranteed income, big returns or a “proven system”.",
        "Income figures that can't be checked, and testimonials that may be fake.",
        "Vague answers about what you'd sell, how customers would find you and what it would cost.",
        "Pressure to decide now, and asks for card details before you've had time to check.",
        "Upsells: paying more for mentoring “to make it work”.",
      ]) + "<p>That's why this app doesn't promise income by the end of the week. It gets you set up and selling, and shows your real numbers so you can decide what to change.</p>",
      src: ["ftcScam"] },
  ];
  const LESSON = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

  const COURSES = [
    { id: "c-fiverr", title: "How Fiverr works for freelancers", by: "Fiverr Help Center", len: "Article", fit: (p) => p.channel === "fiverr", url: S.fiverrHow[1], note: "Gigs, orders, delivery and getting paid." },
    { id: "c-uprates", title: "How to set your freelance rate", by: "Upwork", len: "Guide", fit: (p) => p.model === "freelance", url: S.upworkRates[1], note: "Ways to price hourly and fixed-price work." },
    { id: "c-ypp", title: "YouTube Partner Program", by: "YouTube", len: "Guide", fit: (p) => p.channel === "yt", url: S.ytYppJoin[1], note: "How the program works and how to apply." },
    { id: "c-ttrewards", title: "Creator Rewards Program", by: "TikTok Creator Academy", len: "Article", fit: (p) => p.channel === "tt_creator", url: S.ttRewardsAcademy[1], note: "Eligibility, qualified views and how to join." },
    { id: "c-thinkific", title: "The Thinkific Fast Track", by: "Thinkific", len: "Free course", fit: (p) => p.model === "courses", url: S.thinkificCourse[1], note: "Thinkific's free course on getting started with an online course." },
    { id: "c-kdp", title: "Self-publishing with KDP", by: "Amazon KDP", len: "Guide", fit: (p) => p.model === "books", url: S.kdpEarn[1], note: "How publishing and royalties work on KDP." },
    { id: "c-canspam", title: "CAN-SPAM Act: a compliance guide for business", by: "FTC", len: "Guide", fit: (p) => ["newsletter", "courses", "freelance"].includes(p.model), url: S.canSpam[1], note: "The rules for marketing emails in the US." },
    { id: "c-fba", title: "A guide to Amazon FBA fees", by: "Amazon", len: "Article", fit: (p) => p.model === "fba", url: S.fbaGuide[1], note: "Fulfilment, storage and other FBA fees explained." },
    { id: "c-cpsc", title: "Online sellers safety guide", by: "CPSC", len: "FAQ", fit: (p) => ["handmade", "fba"].includes(p.model), url: S.cpscOnline[1], note: "US product safety basics for online sellers." },
    { id: "c-etsycreative", title: "Etsy's Creativity Standards", by: "Etsy", len: "Policy", fit: (p) => p.model === "handmade" && p.channel === "etsy", url: S.etsyCreativity[1], note: "What counts as made or designed by you." },
    { id: "c-shopify", title: "Dropshipping 101: Build your first online store", by: "Shopify Learn", len: "About 2 hours", fit: (p) => SHIP(p) && p.channel === "shopify", url: S.shopCourse[1],
      note: "Product research, suppliers, store building, Facebook ads, fulfilment and refunds. Some lessons name the Oberlo app; check apps are still offered." },
    { id: "c-ftc", title: "Disclosures 101 for social media influencers", by: "FTC", len: "Guide", fit: (p) => p.model === "affiliate", url: S.ftcInfluencer[1],
      note: "When and how to disclose affiliate links, free products and sponsorships." },
    { id: "c-awin", title: "How to start affiliate marketing with Awin", by: "Awin", len: "Tutorial", fit: (p) => p.channel === "aff_network", url: S.awinGuide[1],
      note: "Signing up, choosing programs and creating tracking links." },
    { id: "c-impact", title: "Partnerships Experience Academy", by: "impact.com", len: "Self-paced", fit: (p) => p.channel === "aff_network", url: S.impactAcademy[1],
      note: "Courses on partnerships and affiliate marketing." },
    { id: "c-amzassoc", title: "Amazon Associates participation requirements", by: "Amazon", len: "Help page", fit: (p) => p.channel === "aff_amazon", url: S.amzAssocPart[1],
      note: "What Amazon checks when it reviews your account." },
    { id: "c-etsydigital", title: "How to sell digital downloads on Etsy", by: "Etsy Seller Handbook", len: "Article", fit: (p) => p.model === "digital" && p.channel === "etsy", url: S.etsyDigital[1],
      note: "Setting up instant and made-to-order downloads." },
    { id: "c-posh", title: "Get started on Poshmark", by: "Poshmark", len: "Guide", fit: (p) => p.channel === "poshmark", url: S.poshStart[1],
      note: "Listing, sharing and shipping on Poshmark." },
    { id: "c-meta1", title: "Get started with advertising on Facebook and Instagram", by: "Meta Blueprint", len: "15 minutes", fit: (p) => p.ads === "some", url: S.metaCourse1[1],
      note: "Free beginner course: ads from a Page, from Instagram and in Ads Manager." },
    { id: "c-meta2", title: "Getting started with Meta Ads Manager", by: "Meta Blueprint", len: "20 minutes", fit: (p) => p.ads === "some", url: S.metaCourse2[1],
      note: "Free beginner course: campaign, ad set and ad settings, and reporting." },
    { id: "c-tta", title: "TikTok Academy", by: "TikTok for Business", len: "Self-paced", fit: (p) => p.ads === "some" || p.channel === "tiktok", url: S.ttAcademy[1],
      note: "Free courses, videos and webinars on TikTok ads, grouped into learning paths." },
    { id: "c-tts", title: "TikTok Shop Academy", by: "TikTok Shop", len: "Self-paced", fit: (p) => p.channel === "tiktok" || p.channel === "aff_tiktok", url: S.ttsAcademy[1],
      note: "Courses, feature guides and the policy centre for sellers and creators." },
    { id: "c-skillshop", title: "Google Ads training", by: "Google Skillshop", len: "Self-paced", fit: (p) => p.ads === "some" && p.channel === "shopify", url: S.skillshop[1],
      note: "Free courses for Search, Shopping and other campaign types. Foundational certifications are free." },
    { id: "c-printful", title: "Printful Academy", by: "Printful", len: "Self-paced", fit: (p) => p.model === "pod" || p.model === "digital", url: S.printfulAcademy[1],
      note: "Free video courses on print-on-demand, marketing, design and trends. Needs a free Printful login." },
    { id: "c-etsy", title: "Etsy Seller Handbook", by: "Etsy", len: "Articles", fit: (p) => p.channel === "etsy", url: S.etsyHandbook[1],
      note: "Advice from Etsy staff and sellers, sorted by your shop's stage." },
    { id: "c-ebay", title: "Start selling on eBay", by: "eBay", len: "Guide", fit: (p) => p.channel === "ebay", url: S.ebayStart[1],
      note: "Account setup, listing and shipping your first order." },
    { id: "c-amazon", title: "What is dropshipping?", by: "Amazon", len: "Article", fit: (p) => p.channel === "amazon", url: S.amzDrop[1],
      note: "How dropshipping works in Amazon's store and the policy you must follow." },
  ];

  // ---------------------------------------------------------------------------
  // Sites: the directory, the launcher and the tools list share this data.
  // ---------------------------------------------------------------------------
  const ALL = () => true;
  const TOOLS = [
    { cat: "Sell", name: "Shopify", url: S.shopTrial[1], cost: "3-day free trial; Basic $39/mo", desc: "Your own online store with checkout and payments.", fit: (p) => p.channel === "shopify" },
    { cat: "Sell", name: "Shopify admin", url: "https://admin.shopify.com/", cost: "", desc: "Manage your Shopify store.", fit: (p) => p.channel === "shopify", dash: true },
    { cat: "Sell", name: "Etsy", url: S.etsySell[1], cost: "$0.20/listing + 6.5% + 3% + $0.25", desc: "Marketplace; only your own designs for print-on-demand and digital.", fit: (p) => p.channel === "etsy" },
    { cat: "Sell", name: "TikTok Shop US", url: S.ttsHome[1], cost: "No setup fee; 6% per sale", desc: "Sell inside TikTok. Strict US delivery deadlines.", fit: (p) => p.channel === "tiktok" },
    { cat: "Sell", name: "TikTok Shop Seller Center", url: "https://seller-us.tiktok.com/", cost: "", desc: "Manage your TikTok Shop.", fit: (p) => p.channel === "tiktok", dash: true },
    { cat: "Sell", name: "eBay", url: S.ebayStart[1], cost: "13.6% + $0.30/$0.40 per order", desc: "Marketplace for new and used items.", fit: (p) => p.channel === "ebay" },
    { cat: "Sell", name: "eBay Seller Hub", url: "https://www.ebay.com/sh/ovw", cost: "", desc: "Manage your eBay listings and orders.", fit: (p) => p.channel === "ebay", dash: true },
    { cat: "Sell", name: "Amazon", url: S.amzPricing[1], cost: "$0.99/unit or $39.99/mo + referral", desc: "Marketplace; you must be the seller of record.", fit: (p) => p.channel === "amazon" },
    { cat: "Sell", name: "Amazon Seller Central", url: "https://sellercentral.amazon.com/", cost: "", desc: "Manage your Amazon seller account.", fit: (p) => p.channel === "amazon", dash: true },
    { cat: "Sell", name: "Mercari", url: "https://www.mercari.com/", cost: "10% selling fee", desc: "Marketplace for secondhand items.", fit: (p) => p.channel === "mercari" },
    { cat: "Sell", name: "Poshmark", url: "https://poshmark.com/", cost: "$2.95 under $15; 20% from $15", desc: "Marketplace for clothing, shoes and more.", fit: (p) => p.channel === "poshmark" },
    { cat: "Affiliate programs", name: "Amazon Associates", url: S.amzAssoc[1], cost: "Free to join", desc: "Earn commission on Amazon purchases from your links.", fit: (p) => p.channel === "aff_amazon" },
    { cat: "Affiliate programs", name: "TikTok Shop creator rules", url: S.ttsCreator[1], cost: "Free; 1,000+ followers", desc: "Requirements for TikTok Shop affiliate creators (US).", fit: (p) => p.channel === "aff_tiktok" },
    { cat: "Affiliate programs", name: "Awin", url: S.awinJoin[1], cost: "Refundable deposit", desc: "Affiliate network with thousands of brands.", fit: (p) => p.channel === "aff_network" },
    { cat: "Affiliate programs", name: "impact.com", url: S.impact[1], cost: "Free for partners", desc: "Partnership platform used by many brands.", fit: (p) => p.channel === "aff_network" },
    { cat: "Affiliate programs", name: "CJ Affiliate", url: S.cjAff[1], cost: "Free publisher account", desc: "Affiliate network; basic HTML knowledge helps.", fit: (p) => p.channel === "aff_network" },
    { cat: "Digital products", name: "Gumroad", url: S.gumroad[1], cost: "10% + 50¢ per sale", desc: "Sell downloads with no monthly fee.", fit: (p) => p.model === "digital" },
    { cat: "Digital products", name: "Payhip", url: S.payhip[1], cost: "Free plan 5% per sale", desc: "Sell downloads, courses and memberships.", fit: (p) => p.model === "digital" },
    { cat: "Digital products", name: "Shopify Digital Downloads", url: S.shopDigital[1], cost: "Free app", desc: "Shopify's own app for selling files.", fit: (p) => p.model === "digital" && p.channel === "shopify" },
    { cat: "Freelancing", name: "Fiverr", url: "https://www.fiverr.com/", cost: "20% of each order", desc: "Sell packaged services to buyers.", fit: (p) => p.model === "freelance" },
    { cat: "Freelancing", name: "Upwork", url: "https://www.upwork.com/", cost: "0–15% per contract", desc: "Send proposals to client jobs.", fit: (p) => p.model === "freelance" },
    { cat: "Creators", name: "YouTube Partner Program", url: S.ytYppJoin[1], cost: "Free to apply", desc: "Monetisation from 500 or 1,000 subscribers.", fit: (p) => p.model === "creator" || p.model === "affiliate" },
    { cat: "Creators", name: "TikTok Creator Rewards", url: S.ttRewardsAcademy[1], cost: "Free to apply", desc: "Earn from qualified views on 1-minute+ videos.", fit: (p) => p.model === "creator" },
    { cat: "Courses and newsletters", name: "Teachable", url: S.teachable[1], cost: "From $29/mo (annual)", desc: "Host and sell online courses.", fit: (p) => p.model === "courses" },
    { cat: "Courses and newsletters", name: "Thinkific", url: S.thinkific[1], cost: "From $40/mo (annual)", desc: "Host and sell online courses.", fit: (p) => p.model === "courses" },
    { cat: "Courses and newsletters", name: "Substack", url: "https://substack.com/", cost: "Free; 10% of paid revenue", desc: "Newsletter with paid subscriptions.", fit: (p) => p.model === "newsletter" },
    { cat: "Courses and newsletters", name: "beehiiv", url: S.beehiivPricing[1], cost: "Free up to 2,500 subscribers", desc: "Newsletter platform.", fit: (p) => p.model === "newsletter" },
    { cat: "Books", name: "Amazon KDP", url: S.kdp[1], cost: "Free to publish", desc: "Self-publish eBooks and paperbacks.", fit: (p) => p.model === "books" },
    { cat: "Books", name: "KDP printing cost", url: S.kdpPrint[1], cost: "", desc: "How paperback printing costs are worked out.", fit: (p) => p.model === "books" },
    { cat: "Amazon FBA", name: "Fulfillment by Amazon", url: S.fba[1], cost: "Fees by size, weight and storage", desc: "Amazon stores and ships your stock.", fit: (p) => p.model === "fba" },
    { cat: "Amazon FBA", name: "Amazon fee estimator", url: S.fbaCalc[1], cost: "Free", desc: "Estimate referral and FBA fees for a product.", fit: (p) => p.model === "fba" },
    { cat: "Amazon FBA", name: "Amazon Brand Registry", url: S.brandRegistry[1], cost: "Free; trademark needed", desc: "Protect and manage your brand on Amazon.", fit: (p) => p.model === "fba" },
    { cat: "Suppliers", name: "DSers", url: S.dsersApp[1], cost: "Free plan; paid with 14-day trial", desc: "Imports AliExpress products and places orders.", fit: (p) => p.model === "supplier" && p.channel === "shopify" },
    { cat: "Suppliers", name: "CJdropshipping", url: S.cj[1], cost: "Free app; pay per order", desc: "Supplier and fulfilment, including US warehouses.", fit: (p) => p.model === "supplier" },
    { cat: "Suppliers", name: "Spocket", url: S.spocket[1], cost: "From $39.99/mo after trial", desc: "US and EU suppliers.", fit: (p) => p.model === "supplier" },
    { cat: "Suppliers", name: "AutoDS", url: S.autods[1], cost: "Paid plans with a trial", desc: "Supplier imports and order automation.", fit: (p) => p.model === "supplier" },
    { cat: "Suppliers", name: "Shopify Collective", url: S.collective[1], cost: "Free for eligible stores", desc: "Sell products from other Shopify brands in your country.", fit: (p) => p.model === "supplier" && p.channel === "shopify" },
    { cat: "Print-on-demand", name: "Printful", url: S.printful[1], cost: "No monthly fee", desc: "Prints and ships your designs per order.", fit: (p) => p.model === "pod" },
    { cat: "Print-on-demand", name: "Printify", url: S.printify[1], cost: "Free; Premium $39/mo", desc: "Network of print providers for your designs.", fit: (p) => p.model === "pod" },
    { cat: "Research", name: "Google Trends", url: S.trends[1], cost: "Free", desc: "Relative search interest over time.", fit: ALL },
    { cat: "Research", name: "TikTok Top Products", url: S.ttTop[1], cost: "Free (sign-in, desktop)", desc: "Products trending in TikTok ads by country.", fit: (p) => p.model !== "resell" },
    { cat: "Research", name: "Meta Ad Library", url: S.metaLib[1], cost: "Free", desc: "Ads running now on Facebook and Instagram.", fit: (p) => p.model !== "resell" },
    { cat: "Research", name: "eBay sold listings", url: "https://www.ebay.com/sch/i.html?_nkw=&LH_Sold=1&LH_Complete=1", cost: "Free", desc: "What actually sold, and for how much.", fit: ALL },
    { cat: "Design and content", name: "Canva", url: "https://www.canva.com/", cost: "Free plan", desc: "Logos, product images, printables and video edits.", fit: ALL },
    { cat: "Design and content", name: "TikTok", url: "https://www.tiktok.com/", cost: "Free", desc: "Short videos.", fit: ALL },
    { cat: "Design and content", name: "Instagram", url: "https://www.instagram.com/", cost: "Free", desc: "Photos, Reels and Stories.", fit: ALL },
    { cat: "Design and content", name: "YouTube Studio", url: "https://studio.youtube.com/", cost: "Free", desc: "Upload and manage YouTube videos and Shorts.", fit: ALL },
    { cat: "Design and content", name: "Pinterest", url: "https://www.pinterest.com/", cost: "Free", desc: "Pins that link to products and posts.", fit: ALL },
    { cat: "Ads", name: "Meta Ads Manager", url: S.metaAds[1], cost: "~$1/day minimum per ad set", desc: "Facebook and Instagram ads.", fit: (p) => p.ads === "some" },
    { cat: "Ads", name: "TikTok Ads Manager", url: S.ttAds[1], cost: "$50 campaign / $20 ad group daily min", desc: "TikTok ads.", fit: (p) => p.ads === "some" },
    { cat: "Ads", name: "Google & YouTube app", url: S.googleApp[1], cost: "Free app; ads billed separately", desc: "Free product listings on Google (eligible US stores).", fit: (p) => p.channel === "shopify" && SHIP(p) },
    { cat: "AI assistants", name: "ChatGPT", url: "https://chatgpt.com/", cost: "Free and paid plans", desc: "OpenAI's assistant.", fit: ALL },
    { cat: "AI assistants", name: "Claude", url: "https://claude.ai/new", cost: "Free and paid plans", desc: "Anthropic's assistant.", fit: ALL },
    { cat: "AI assistants", name: "Gemini", url: "https://gemini.google.com/app", cost: "Free and paid plans", desc: "Google's assistant.", fit: ALL },
    { cat: "AI assistants", name: "Microsoft Copilot", url: "https://copilot.microsoft.com/", cost: "Free and paid plans", desc: "Microsoft's assistant.", fit: ALL },
    { cat: "AI assistants", name: "Perplexity", url: "https://www.perplexity.ai/", cost: "Free and paid plans", desc: "AI search with sources.", fit: ALL },
    { cat: "Business & legal", name: "IRS: get an EIN", url: S.irsEin[1], cost: "Free", desc: "US tax ID, issued online in minutes.", fit: (p) => p.country === "us" },
    { cat: "Business & legal", name: "IRS: Form 1099-K", url: S.irs1099k[1], cost: "Free guide", desc: "How marketplace and payment-app income is reported.", fit: (p) => p.country === "us" },
    { cat: "Business & legal", name: "SBA: licenses and permits", url: S.sbaLicense[1], cost: "Free guide", desc: "What your state and city may require.", fit: (p) => p.country === "us" },
    { cat: "Business & legal", name: "FTC: Mail Order Rule", url: S.ftcMail[1], cost: "Free guide", desc: "US rules for delivery promises and refunds.", fit: (p) => SHIP(p) || p.model === "resell" },
    { cat: "Business & legal", name: "FTC: disclosures for influencers", url: S.ftcInfluencer[1], cost: "Free guide", desc: "How to disclose affiliate links and sponsorships.", fit: (p) => p.model === "affiliate" },
    { cat: "Business & legal", name: "IRS: self-employment tax", url: S.irsSE[1], cost: "Free guide", desc: "Tax on self-employment income in the US.", fit: (p) => p.country === "us" },
    { cat: "Business & legal", name: "FTC: CAN-SPAM guide", url: S.canSpam[1], cost: "Free guide", desc: "US rules for marketing emails.", fit: (p) => ["newsletter", "courses", "freelance"].includes(p.model) },
    { cat: "Business & legal", name: "CPSC: children's products", url: S.cpscCpc[1], cost: "Free guide", desc: "Testing and certificates for children's products.", fit: (p) => ["handmade", "fba", "pod"].includes(p.model) && p.country === "us" },
    { cat: "Business & legal", name: "HMRC: online selling", url: S.hmrcOnline[1], cost: "Free guide", desc: "When to tell HMRC about online income.", fit: (p) => p.country === "uk" },
  ];

  const FEES = {
    shopify: { label: "Shopify Payments, Basic (US online card)", pct: 2.9, fixed: 0.3 },
    shopify3p: { label: "Shopify Basic + another payment provider", pct: 2, fixed: 0, hint: "Shopify's 2% only. Add your provider's own fees." },
    etsy: { label: "Etsy (US)", pct: 9.5, fixed: 0.25, hint: "6.5% transaction + 3% + $0.25 processing. Add $0.20 per listing to other costs." },
    ebay: { label: "eBay, most categories", pct: 13.6, fixed: null, hint: "$0.30 per order of $10 or less, $0.40 over $10." },
    tiktok: { label: "TikTok Shop US", pct: 6, fixed: 0, hint: "Check your category's rate in Seller Center." },
    amazonI: { label: "Amazon, Individual plan", pct: null, fixed: 0.99, hint: "Enter your category's referral fee %." },
    amazonP: { label: "Amazon, Professional plan", pct: null, fixed: 0, hint: "Enter your category's referral fee %. Add $39.99 to monthly costs." },
    mercari: { label: "Mercari", pct: 10, fixed: 0, hint: "10% of the item price plus buyer-paid shipping." },
    poshmark: { label: "Poshmark (US)", pct: 20, fixed: 0, hint: "Under $15 it's a flat $2.95 instead; the calculators apply that automatically." },
    gumroad: { label: "Gumroad, direct sales", pct: 10, fixed: 0.5, hint: "30% instead on sales through Gumroad Discover." },
    payhipFree: { label: "Payhip, Free plan", pct: 5, fixed: 0, hint: "Add PayPal or Stripe processing at their standard rates." },
    payhipPlus: { label: "Payhip, Plus plan", pct: 2, fixed: 0, hint: "Add $29 to monthly costs, and PayPal or Stripe processing." },
    payhipPro: { label: "Payhip, Pro plan", pct: 0, fixed: 0, hint: "Add $99 to monthly costs, and PayPal or Stripe processing." },
    fiverr: { label: "Fiverr (freelancer side)", pct: 20, fixed: 0, hint: "Fiverr keeps 20% of every order, including tips." },
    upwork: { label: "Upwork (enter your contract's fee)", pct: null, fixed: 0, hint: "Between 0% and 15%; Upwork shows it before you accept." },
    stripeUS: { label: "Card payment via Stripe (US)", pct: 2.9, fixed: 0.3, hint: "Stripe's standard US card rate." },
    substack: { label: "Substack paid subscription (US cards)", pct: 13.6, fixed: 0.3, hint: "10% Substack + 2.9% + 30¢ Stripe + 0.7% Stripe Billing." },
    teachableStarter: { label: "Teachable Starter (US card)", pct: 10.4, fixed: 0.3, hint: "7.5% Teachable fee + 2.9% + 30¢ card processing. Add the plan to monthly costs." },
    teachablePaid: { label: "Teachable Builder or Growth (US card)", pct: 2.9, fixed: 0.3, hint: "0% Teachable fee with Teachable Payments + 2.9% + 30¢ card processing." },
    thinkific: { label: "Thinkific Payments", pct: 2.9, fixed: 0, hint: "No transaction fee; about 2.9% card processing. Check for a per-payment amount." },
    amazonFBA: { label: "Amazon FBA (enter your fees)", pct: null, fixed: null, hint: "Fee % = referral fee; fixed = FBA fulfilment fee per unit from Amazon's estimator." },
    custom: { label: "Custom", pct: null, fixed: null, hint: "" },
  };
  const DEFAULT_FEE = { shopify: "shopify", etsy: "etsy", ebay: "ebay", tiktok: "tiktok", amazon: "amazonI", mercari: "mercari", poshmark: "poshmark", gumroad: "gumroad", payhip: "payhipFree", aff_amazon: "custom", aff_tiktok: "custom", aff_network: "custom", fiverr: "fiverr", upwork: "upwork", direct: "stripeUS", yt: "custom", tt_creator: "custom", teachable: "teachableStarter", thinkific: "thinkific", kdp: "custom", substack: "substack", beehiiv: "custom", amz_fba: "amazonFBA" };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const html = (tag, cls, markup) => { const e = el(tag, cls); e.innerHTML = markup; return e; };
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => iso(new Date());
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const addMonth = (s) => { const d = parse(s); d.setMonth(d.getMonth() + 1); return iso(d); };
  const fmtDay = (s) => parse(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const fmtDue = (s) => {
    if (!s) return "";
    const t = today();
    if (s === t) return "Today";
    if (s === addDays(t, 1)) return "Tomorrow";
    if (s === addDays(t, -1)) return "Yesterday";
    return parse(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  const money = (n, cur = "USD") => { try { return n.toLocaleString(undefined, { style: "currency", currency: cur }); } catch { return n.toFixed(2); } };
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const CHECK_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
  const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

  function sourcesBlock(keys) {
    if (!keys || !keys.length) return null;
    const box = el("div", "sources");
    box.append(el("span", "label", "Sources"));
    const list = el("ul");
    keys.forEach((k) => { const li = el("li"); const a = el("a", null, S[k][0]); a.href = S[k][1]; a.target = "_blank"; a.rel = "noopener"; li.append(a); list.append(li); });
    box.append(list);
    return box;
  }
  function showNote(msg) { const n = $("#note"); n.textContent = msg || ""; n.hidden = !msg; }
  const strip = (t) => { const { id, ...rest } = t; return rest; };
  // Toasts. Frequent, low-stakes changes (done, delete, remove) get an Undo
  // button instead of a confirmation step; Ctrl+Z / Cmd+Z works too.
  let toastTimer, toastUndo = null;
  function toast(msg, opts = {}) {
    // A save that just failed keeps its warning on screen instead of a "done" message.
    if (!opts.error && sync.failAt && Date.now() - sync.failAt < 1500) return;
    const t = $("#toast"); t.textContent = "";
    // A modal window makes the rest of the page inert, so the notice (and its
    // Undo button) lives inside whichever window is open.
    const host = [...document.querySelectorAll("dialog[open]")].pop() || document.body;
    if (t.parentNode !== host) host.append(t);
    t.append(el("span", null, msg));
    toastUndo = opts.undo || null;
    if (toastUndo) {
      const b = el("button", "btn sm", "Undo"); b.type = "button";
      b.onclick = () => runUndo();
      t.append(b);
    }
    t.hidden = false; clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; toastUndo = null; }, toastUndo ? 7000 : 2800);
  }
  document.addEventListener("close", (e) => { const t = $("#toast"); if (t && e.target !== document && e.target.contains(t)) document.body.append(t); }, true);
  async function runUndo() {
    const fn = toastUndo; if (!fn) return false;
    toastUndo = null; clearTimeout(toastTimer); $("#toast").hidden = true;
    await fn(); toast("Undone.");
    return true;
  }

  // ---------------------------------------------------------------------------
  // Accounts and storage. Each person's data is private to them:
  // signed-in viewers who can save get their own subtree in the artifact's
  // database (data/users/<their id>/...); everyone else saves in this browser.
  //   account                  name, businesses, current business, milestones
  //   account/saves/<id>       saved copies of a business, for restoring later
  //   profile, desk/<kind>     the first business ("desk")
  //   profile-b_x, b_x/<kind>  any other business
  // ---------------------------------------------------------------------------
  const st = {
    tab: lsGet("dd-tab6", "today"),
    profile: null, profileLoaded: false,
    tasks: [], tasksLoaded: false,
    learn: {}, products: [], links: [],
    editingProfile: false,
    biz: "desk", account: null, accountLoaded: false, saves: [], savesLoaded: false,
    ui: Object.assign({ area: "all", view: "list", quick: null, q: "", showDone: false, allTools: false }, lsGet("dd-ui", {}), { quick: null, q: "" }),
  };
  const saveUi = () => lsSet("dd-ui", { area: st.ui.area, view: st.ui.view, showDone: st.ui.showDone, allTools: st.ui.allTools });
  const readOnly = false;
  let db = null, uid = null, mode = "local", unsubs = [], accUnsubs = [], gen = 0, viewerName = "", signedIn = false;
  const LOCAL = { tasks: "dd-local-tasks", profile: "dd-local-profile", learn: "dd-local-learn", products: "dd-local-products", links: "dd-local-links" };
  const ACC_LOCAL = "dd-local-account", SAVES_LOCAL = "dd-local-saves";
  const KINDS = ["tasks", "learn", "products", "links"];
  const base = () => "data/users/" + uid;
  const bizDoc = () => (st.biz === "desk" ? "desk" : st.biz);
  const profPath = () => base() + "/" + (st.biz === "desk" ? "profile" : "profile-" + st.biz);
  const lkey = (kind) => LOCAL[kind] + (st.biz === "desk" ? "" : ":" + st.biz);
  const col = (kind) => db.doc(base() + "/" + bizDoc()).collection(kind);

  // ----- Save status in the header
  const sync = { pending: 0, last: null, error: false, failAt: 0 };
  function drawSync() {
    const box = $("#saveMode"); if (!box) return;
    box.classList.toggle("saving", sync.pending > 0); box.classList.toggle("error", sync.error && !sync.pending);
    $("#syncText").textContent = sync.pending > 0 ? "Saving…" : sync.error ? "Not saved" : mode === "db" ? "Saved to your account" : "Saved in this browser";
    box.title = (mode === "db" ? (WEB ? "Private to you, on every device where you sign in." : "Private to you, on every device where you're signed in to claude.ai.") : WEB ? (ACCOUNTS ? "Kept only in this browser. Create an account to keep it safe and use it on your other devices." : "Kept only in this browser.") : "Kept only in this browser. Sign in to claude.ai to keep it in your account.") + (sync.last ? " Last saved at " + new Date(sync.last).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + "." : "");
    if ($("#acctDlg") && $("#acctDlg").open) drawAcctStatus();
  }
  const noteLocalSave = () => { sync.last = Date.now(); sync.error = false; drawSync(); };

  function loadLocal() {
    st.tasks = lsGet(lkey("tasks"), []); st.profile = lsGet(lkey("profile"), null);
    st.learn = lsGet(lkey("learn"), {}); st.products = lsGet(lkey("products"), []); st.links = lsGet(lkey("links"), []);
    st.tasksLoaded = st.profileLoaded = true;
  }
  function saveLocalAll() {
    KINDS.concat("profile").forEach((k) => lsSet(lkey(k), st[k]));
    lsSet(ACC_LOCAL, st.account); lsSet(SAVES_LOCAL, st.saves);
  }
  function stopSubs() { unsubs.concat(accUnsubs).forEach((u) => { try { u(); } catch {} }); unsubs = []; accUnsubs = []; }
  function switchToLocal(why) {
    if (mode === "local") return;
    mode = "local"; stopSubs(); saveLocalAll(); drawSync(); drawHeader();
    if (why) toast(why);
  }
  async function dbTry(fn) {
    sync.pending++; drawSync();
    try { await fn(); sync.error = false; return true; }
    catch (e) {
      if (e && (e.code === "invalid_argument" || e.code === "not_granted" || e.code === "revoked")) { switchToLocal("This view can't save to an account, so your progress is kept in this browser."); return false; }
      sync.error = true; sync.failAt = Date.now();
      if (e && e.code === "quota_exceeded") toast("Storage is full. Delete some old saves or finished tasks, then try again.", { error: true });
      else toast("That change didn't save. Check your connection and try again.", { error: true });
      return null;
    } finally { sync.pending--; sync.last = Date.now(); drawSync(); }
  }
  function localPut(kind, id, data) {
    if (kind === "learn") { if (data) st.learn[id] = data; else delete st.learn[id]; }
    else { const arr = st[kind]; const i = arr.findIndex((x) => x.id === id); if (data == null) { if (i >= 0) arr.splice(i, 1); } else if (i >= 0) arr[i] = { id, ...data }; else arr.push({ id, ...data }); }
    lsSet(lkey(kind), st[kind]); noteLocalSave(); onData(kind);
  }
  async function putDoc(kind, id, data) {
    if (mode === "db") { const ok = await dbTry(() => col(kind).doc(id).set(data)); if (ok !== false) return; }
    localPut(kind, id, data);
  }
  async function delDoc(kind, id) {
    if (mode === "db") { const ok = await dbTry(() => col(kind).doc(id).delete()); if (ok !== false) return; }
    localPut(kind, id, null);
  }
  const putTask = (id, data) => putDoc("tasks", id, data);
  const delTask = (id) => delDoc("tasks", id);
  async function clearProfile() {
    if (mode === "db") { const ok = await dbTry(() => db.doc(profPath()).delete()); if (ok !== false) return; }
    st.profile = null; lsSet(lkey("profile"), null); noteLocalSave(); onData("profile");
  }
  async function saveProfile(p) {
    if (mode === "db") { const ok = await dbTry(() => db.doc(profPath()).set(p)); if (ok !== false) { noteBizPlan(p); return; } }
    st.profile = p; lsSet(lkey("profile"), p); noteLocalSave(); onData("profile"); noteBizPlan(p);
  }
  const setLearn = (id, done) => (done ? putDoc("learn", id, { done: true, at: today() }) : delDoc("learn", id));
  const saveProduct = (id, data) => putDoc("products", id, data);
  const deleteProduct = (id) => delDoc("products", id);

  // ----- Account: your name, your businesses, milestones
  const newBizEntry = (id, name) => ({ id, name, createdAt: today(), model: "", channel: "" });
  function normAccount(a) {
    const out = { name: "", current: "desk", businesses: [], badges: [] };
    if (a && typeof a === "object") {
      out.name = typeof a.name === "string" ? a.name.trim().slice(0, 60) : "";
      out.badges = Array.isArray(a.badges) ? a.badges.filter((x) => typeof x === "string").slice(0, 50) : [];
      out.businesses = (Array.isArray(a.businesses) ? a.businesses : []).filter((b) => b && typeof b.id === "string" && /^(desk|b_[\w-]{4,40})$/.test(b.id))
        .map((b) => ({ id: b.id, name: String(b.name || "Business").trim().slice(0, 60) || "Business", createdAt: /^\d{4}-\d{2}-\d{2}$/.test(b.createdAt || "") ? b.createdAt : today(), model: MODEL_NAME[b.model] ? b.model : "", channel: typeof b.channel === "string" ? b.channel.slice(0, 30) : "" }));
      out.current = typeof a.current === "string" ? a.current : "desk";
    }
    if (!out.businesses.length) out.businesses.push(newBizEntry("desk", "My business"));
    if (!out.businesses.some((b) => b.id === out.current)) out.current = out.businesses[0].id;
    return out;
  }
  const curBiz = () => (st.account && st.account.businesses.find((b) => b.id === st.biz)) || newBizEntry(st.biz, "My business");
  async function saveAccount(a) {
    st.account = normAccount(a); drawHeader();
    if (mode === "db") { const ok = await dbTry(() => db.doc(base() + "/account").set(st.account)); if (ok !== false) return; }
    lsSet(ACC_LOCAL, st.account); noteLocalSave();
  }
  function noteBizPlan(p) {
    if (!st.account) return;
    const b = curBiz(); const model = (p && p.model) || "", channel = (p && p.channel) || "";
    if (b.model === model && b.channel === channel) return;
    saveAccount({ ...st.account, businesses: st.account.businesses.map((x) => (x.id === st.biz ? { ...x, model, channel } : x)) });
  }
  function initials(name) { const w = String(name || "").trim().split(/\s+/).filter(Boolean); return w.length ? (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase() : "?"; }
  const displayName = () => (st.account && st.account.name) || viewerName || "";
  const PERSON_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="7" r="3.2"/><path d="M4 17c.8-3.2 3.2-4.8 6-4.8s5.2 1.6 6 4.8"/></svg>';
  function drawHeader() {
    const b = curBiz();
    const bn = $("#bizName"); if (bn) bn.textContent = b.name;
    const bm = $("#bizMark"); if (bm) bm.textContent = initials(b.name).slice(0, 1);
    const bb = $("#bizBtn"); if (bb) bb.setAttribute("aria-label", "Business: " + b.name + ". Switch or add a business");
    const av = $("#avatar"); if (av) { if (displayName()) av.textContent = initials(displayName()); else av.innerHTML = PERSON_SVG; }
    const ab = $("#acctBtn"); if (ab) ab.setAttribute("aria-label", (displayName() ? displayName() + ": " : "") + "your account and saves");
  }

  function subscribeBiz() {
    unsubs.forEach((u) => { try { u(); } catch {} }); unsubs = [];
    const my = ++gen;
    const sub = (ref, fn) => { const u = ref.onSnapshot((snap) => { if (mode !== "db" || my !== gen) return; fn(snap); }, (e) => { if (e && e.code === "revoked") switchToLocal(); }); unsubs.push(u); };
    sub(col("tasks"), (snap) => { st.tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() })); st.tasksLoaded = true; onData("tasks"); });
    sub(col("learn"), (snap) => { st.learn = Object.fromEntries(snap.docs.map((d) => [d.id, d.data()])); onData("learn"); });
    sub(col("products"), (snap) => { st.products = snap.docs.map((d) => ({ id: d.id, ...d.data() })); onData("products"); });
    sub(col("links"), (snap) => { st.links = snap.docs.map((d) => ({ id: d.id, ...d.data() })); onData("links"); });
    sub(db.doc(profPath()), (snap) => {
      const p = snap.exists ? snap.data() : null;
      const changed = JSON.stringify(p) !== JSON.stringify(st.profile) || !st.profileLoaded;
      st.profile = p; st.profileLoaded = true; if (changed) onData("profile");
    });
  }
  function subscribeAccount() {
    const sub = (ref, fn) => accUnsubs.push(ref.onSnapshot((snap) => { if (mode === "db") fn(snap); }, () => {}));
    sub(db.doc(base() + "/account"), (snap) => {
      if (!snap.exists) return;
      const a = normAccount(snap.data()); a.current = st.biz; st.account = a; drawHeader(); onData("account");
    });
    sub(db.doc(base() + "/account").collection("saves"), (snap) => {
      st.saves = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((x, y) => (y.at || 0) - (x.at || 0)); st.savesLoaded = true; onData("saves");
    });
  }
  async function startStorage() {
    db = await claudeUse("db");
    const user = await claudeUse("user");
    try { uid = user && user.id ? await user.id() : null; } catch { uid = null; }
    try { const me = user && user.me ? await user.me() : null; viewerName = (me && me.name) || ""; } catch { viewerName = ""; }
    signedIn = !!uid;
    let canWrite = true;
    if (user && user.can) { try { if ((await user.can("data.write")) === false) canWrite = false; } catch {} }
    if (!db || !uid || !canWrite) {
      mode = "local"; st.account = normAccount(lsGet(ACC_LOCAL, null)); st.biz = st.account.current; st.accountLoaded = true;
      st.saves = lsGet(SAVES_LOCAL, []); st.savesLoaded = true; loadLocal(); afterStart(); return;
    }
    mode = "db";
    let acc = null; try { const snap = await db.doc(base() + "/account").get(); acc = snap && snap.exists ? snap.data() : null; } catch {}
    st.account = normAccount(acc); st.biz = st.account.current; st.accountLoaded = true;
    subscribeAccount(); subscribeBiz(); afterStart();
  }
  function afterStart() { drawSync(); drawHeader(); updateTabBadge(); render(true); if (mode === "db" && WEB) setTimeout(offerBrowserWork, 900); }

  // ----- Businesses
  const whenLoaded = () => new Promise((res) => { const t0 = Date.now(); const tick = () => ((st.tasksLoaded && st.profileLoaded) || Date.now() - t0 > 4000 ? res() : setTimeout(tick, 40)); tick(); });
  async function switchBiz(id, opts = {}) {
    if (!st.account || !st.account.businesses.some((b) => b.id === id)) return;
    st.biz = id;
    st.tasks = []; st.learn = {}; st.products = []; st.links = []; st.profile = null; st.tasksLoaded = st.profileLoaded = false;
    startSetup(false); st.editingProfile = false; ev.aiText = ""; ev.aiPrompt = "";
    if (mode === "db") subscribeBiz(); else loadLocal();
    await saveAccount({ ...st.account, current: id });
    updateTabBadge();
    if (!opts.quiet) { setTab("today"); toast("Switched to " + curBiz().name + "."); }
  }
  async function createBiz(name) {
    const id = "b_" + newId();
    await saveAccount({ ...st.account, businesses: st.account.businesses.concat(newBizEntry(id, name.trim().slice(0, 60) || "New business")) });
    await switchBiz(id, { quiet: true });
    setTab("today"); toast("Created " + curBiz().name + ". Answer five questions to build its plan.");
  }
  async function renameBiz(id, name) {
    const n = name.trim().slice(0, 60); if (!n) return;
    await saveAccount({ ...st.account, businesses: st.account.businesses.map((b) => (b.id === id ? { ...b, name: n } : b)) });
  }
  async function deleteBiz(id) {
    const list = st.account.businesses; if (list.length < 2) return;
    const back = st.biz === id ? list.find((b) => b.id !== id).id : st.biz;
    if (st.biz !== id) await switchBiz(id, { quiet: true });
    await whenLoaded(); await resetAll();
    await saveAccount({ ...st.account, businesses: st.account.businesses.filter((b) => b.id !== id), current: back });
    await switchBiz(back, { quiet: true });
    render(true);
  }

  // ----- Saves: copies of a business you can restore later
  const SAVE_MAX = 30, SAVE_MAX_LOCAL = 10;
  function saveSummary() { return { tasks: st.tasks.length, done: st.tasks.filter((t) => t.status === "done").length, products: st.products.length, links: st.links.length, model: (st.profile && st.profile.model) || "" }; }
  async function makeSave(name, auto) {
    const data = JSON.stringify(exportData());
    if (data.length > 800000) { toast("This business is too big to keep a copy here. Use Export a backup instead."); return null; }
    if (st.saves.length >= (mode === "db" ? SAVE_MAX : SAVE_MAX_LOCAL)) {
      const oldAuto = st.saves.slice().reverse().find((x) => x.auto);
      if (oldAuto) await removeSave(oldAuto.id); else { toast("You have the most saves allowed. Delete an old one first."); return null; }
    }
    const id = "s" + newId();
    const when = new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const doc = { name: String(name || "").trim().slice(0, 80) || "Saved " + when, at: Date.now(), biz: st.biz, bizName: curBiz().name, auto: !!auto, summary: saveSummary(), data };
    if (mode === "db") { const ok = await dbTry(() => db.doc(base() + "/account").collection("saves").doc(id).set(doc)); if (ok === true) return id; if (ok === null) return null; }
    const next = [{ id, ...doc }].concat(st.saves).slice(0, SAVE_MAX_LOCAL);
    if (!lsSet(SAVES_LOCAL, next)) { toast("This browser's storage is full. Delete an old save, or export a backup instead."); return null; }
    st.saves = next; noteLocalSave(); onData("saves"); return id;
  }
  async function removeSave(id) {
    if (mode === "db") { const ok = await dbTry(() => db.doc(base() + "/account").collection("saves").doc(id).delete()); if (ok !== false) return; }
    st.saves = st.saves.filter((x) => x.id !== id); lsSet(SAVES_LOCAL, st.saves); noteLocalSave(); onData("saves");
  }
  async function putSaveBack(s) {
    const { id, ...doc } = s;
    if (mode === "db") { const ok = await dbTry(() => db.doc(base() + "/account").collection("saves").doc(id).set(doc)); if (ok !== false) return; }
    st.saves = [s].concat(st.saves.filter((x) => x.id !== id)).sort((x, y) => (y.at || 0) - (x.at || 0)); lsSet(SAVES_LOCAL, st.saves); noteLocalSave(); onData("saves");
  }
  async function restoreSave(s) {
    let data; try { data = JSON.parse(s.data); } catch { toast("That save couldn't be read."); return false; }
    if (!(await makeSave("Before restoring “" + s.name + "”", true))) return false;
    await whenLoaded(); await resetAll();
    await importData(data);
    render(true); toast("Restored “" + s.name + "”. Your work from before is kept as a save.");
    return true;
  }
  async function deleteEverything() {
    for (const b of st.account.businesses.slice()) { await switchBiz(b.id, { quiet: true }); await whenLoaded(); await resetAll(); }
    for (const s of st.saves.slice()) await removeSave(s.id);
    st.biz = "desk";
    if (mode === "db") { await dbTry(() => db.doc(base() + "/account").delete()); st.account = normAccount(null); }
    else { st.account = normAccount(null); lsSet(ACC_LOCAL, null); }
    await switchBiz("desk", { quiet: true });
    drawHeader(); render(true);
  }

  // ---------------------------------------------------------------------------
  // AI: Claude inside the app (each viewer's own claude.ai account), or the
  // viewer's own AI app (ChatGPT, Gemini, Copilot, Perplexity, Claude, other).
  // ---------------------------------------------------------------------------
  let sample = null;
  const AI_APPS = {
    chatgpt: ["ChatGPT", "https://chatgpt.com/"],
    claude: ["Claude", "https://claude.ai/new"],
    gemini: ["Gemini", "https://gemini.google.com/app"],
    copilot: ["Microsoft Copilot", "https://copilot.microsoft.com/"],
    perplexity: ["Perplexity", "https://www.perplexity.ai/"],
    custom: ["Other AI", ""],
  };
  const aiPref = Object.assign({ mode: "auto", app: "chatgpt", customName: "", customUrl: "" }, lsGet("dd-ai", {}));
  const saveAi = () => lsSet("dd-ai", aiPref);
  function aiMode() { if (aiPref.mode === "app") return "app"; if (aiPref.mode === "builtin") return sample ? "builtin" : "app"; return sample ? "builtin" : "app"; }
  function aiApp() {
    if (aiPref.app === "custom") return [aiPref.customName || "your AI app", safeUrl(aiPref.customUrl) || ""];
    return AI_APPS[aiPref.app] || AI_APPS.chatgpt;
  }
  function aiLabel() { return aiMode() === "builtin" ? "Claude in this app" : aiApp()[0]; }
  function updateAiBtn() { const b = $("#aiBtn"); if (!b) return; b.textContent = "AI"; b.append(el("span", "hide-sm", ": " + aiLabel())); b.setAttribute("aria-label", "AI: " + aiLabel() + ". Change"); }
  function safeUrl(u) {
    if (!u) return null; let s = String(u).trim(); if (!/^https?:\/\//i.test(s)) s = "https://" + s;
    try { const x = new URL(s); return x.protocol === "https:" || x.protocol === "http:" ? x.href : null; } catch { return null; }
  }
  function copyText(text, ta) {
    return navigator.clipboard.writeText(text).then(() => true, () => { if (ta) { ta.focus(); ta.select(); } return false; });
  }
  function openAiSettings() {
    const box = $("#aiBody"); box.textContent = "";
    box.append(el("h2", null, "Choose your AI"));
    box.append(el("p", "small muted", "The AI tools (description writer, video hooks, second opinions, Ask AI) can use either option. Your choice is saved in this browser."));
    const form = el("div"); form.style.display = "grid"; form.style.gap = "10px";
    const opt = (value, title, desc, disabled) => {
      const w = el("div", "opt"); const i = el("input"); i.type = "radio"; i.name = "aiMode"; i.value = value; i.id = "ai-" + value; i.disabled = !!disabled;
      i.checked = (aiPref.mode === value) || (aiPref.mode === "auto" && value === (sample ? "builtin" : "app"));
      const l = el("label"); l.htmlFor = i.id; l.append(el("span", null, title), el("small", null, desc)); w.append(i, l); form.append(w); return i;
    };
    if (!WEB) opt("builtin", "Claude, inside this app", sample ? "Uses your own claude.ai account and plan. You'll be asked to allow it the first time." : "Not available in this view. Sign in to claude.ai and open the app there to use it.", !sample);
    opt("app", "My own AI account (ChatGPT, Gemini, Copilot, Perplexity, Claude or another)", "The app writes the prompt and copies it; you paste it into your AI and paste the answer back.");
    const appF = el("div", "field"); const al = el("label", "label", "My AI app"); al.htmlFor = "aiApp";
    const as = el("select"); as.id = "aiApp"; fill(as, Object.entries(AI_APPS).map(([k, v]) => [k, v[0]])); as.value = aiPref.app;
    appF.append(al, as); form.append(appF);
    const cn = el("div", "field"); const cnl = el("label", "label", "Name of your AI app"); cnl.htmlFor = "aiCName"; const cni = el("input"); cni.type = "text"; cni.id = "aiCName"; cni.value = aiPref.customName; cn.append(cnl, cni);
    const cu = el("div", "field"); const cul = el("label", "label", "Its web address"); cul.htmlFor = "aiCUrl"; const cui = el("input"); cui.type = "url"; cui.id = "aiCUrl"; cui.value = aiPref.customUrl; cui.placeholder = "https://"; cu.append(cul, cui);
    form.append(cn, cu);
    const showCustom = () => { cn.hidden = cu.hidden = as.value !== "custom"; };
    as.onchange = showCustom; showCustom();
    box.append(form);
    box.append(html("p", "small muted", "<b>Why there's no API key field:</b> web pages like this one can't keep a key secret, so the app never asks for one. AI runs through " + (WEB ? "your own AI app" : "your claude.ai account or your own AI app") + " instead. Never paste an API key or password into a website you don't trust."));
    const act = el("div", "actions"); act.append(el("span"));
    const right = el("div");
    const cancel = el("button", "btn", "Cancel"); cancel.type = "button"; cancel.onclick = () => $("#aiDlg").close();
    const save = el("button", "btn primary", "Save"); save.type = "button";
    save.onclick = () => {
      const m = (form.querySelector('input[name="aiMode"]:checked') || {}).value || "auto";
      if (as.value === "custom" && m === "app" && !safeUrl(cui.value)) { toast("Enter a valid web address for your AI app."); cui.focus(); return; }
      aiPref.mode = m; aiPref.app = as.value; aiPref.customName = cni.value.trim(); aiPref.customUrl = cui.value.trim(); saveAi(); updateAiBtn();
      $("#aiDlg").close(); toast("AI set to " + aiLabel() + "."); if (st.tab === "tools") renderTool();
    };
    right.append(cancel, save); act.append(right); box.append(act);
    $("#aiDlg").showModal();
  }
  // Renders the "use your own AI" steps for a prompt: copy, open, paste back.
  function externalSteps(prompt, intro) {
    const [name, url] = aiApp();
    const box = el("div", "ext-steps");
    box.append(el("span", "label", intro || ("Using " + name)));
    const ol = el("ol", "small");
    ol.append(el("li", null, "Copy the prompt (the button below copies it and opens " + name + ")."), el("li", null, "Paste it into " + name + " and send it."), el("li", null, "Paste the answer into the box below."));
    box.append(ol);
    const ta = el("textarea"); ta.rows = 5; ta.readOnly = true; ta.value = prompt; ta.className = "prompt-box"; ta.setAttribute("aria-label", "Prompt to copy");
    const row = el("div", "row-gap");
    if (url) {
      const a = el("a", "btn primary sm ext", "Copy prompt and open " + name); a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.addEventListener("click", () => { copyText(prompt, ta).then((ok) => toast(ok ? "Prompt copied. Paste it into " + name + "." : "Select the prompt and copy it, then paste it into " + name + ".")); });
      row.append(a);
    }
    const c = el("button", "btn sm", "Copy prompt"); c.type = "button"; c.onclick = () => copyText(prompt, ta).then((ok) => toast(ok ? "Prompt copied." : "Press Ctrl+C or Cmd+C to copy."));
    const s = el("button", "btn sm", "Change AI"); s.type = "button"; s.onclick = openAiSettings;
    row.append(c, s);
    box.append(ta, row);
    return box;
  }
  function sampleErrCopy(e) {
    switch (e && e.code) {
      case "cancelled": return "";
      case "not_granted": case "sampling_disabled": case "not_declared": case "capability_disabled": case "capability_removed": return "Claude isn't available for this page in this view. Choose your own AI app in AI settings instead.";
      case "rate_limited": return "Too many requests right now. Try again in a little while.";
      case "session_expired": return "Sign in to claude.ai again, then retry.";
      case "refused": return "Claude declined this request. Change the details and try again.";
      default: return "Claude didn't finish. Try again.";
    }
  }

  // ---------------------------------------------------------------------------
  // Opening other websites. Pages can't show other sites inside them, so every
  // site opens in a new tab; the Sites tab keeps favourites and recent sites.
  // ---------------------------------------------------------------------------
  const recent = lsGet("dd-recent", []);
  function noteRecent(name, url) {
    const i = recent.findIndex((r) => r.url === url); if (i >= 0) recent.splice(i, 1);
    recent.unshift({ name, url }); recent.splice(10); lsSet("dd-recent", recent);
  }
  function extLink(l, cls = "btn sm") {
    const a = el("a", cls + " ext", l.label); a.href = l.url; a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", () => noteRecent(l.name || l.label, l.url));
    return a;
  }
  // ---------------------------------------------------------------------------
  // Plan generation
  // ---------------------------------------------------------------------------
  const applicable = (p) => GUIDE.filter((s) => s.when(p));
  function stepTask(s, p, start) {
    return {
      title: val(s.title, p), area: s.area, prio: s.prio || "med",
      due: addDays(start, s.day - 1), status: "todo", product: "", supplier: "", ref: "", notes: "",
      repeat: s.repeat || "none", createdAt: Date.now(), doneAt: null, source: "plan", step: s.id, day: s.day,
    };
  }
  async function syncPlan(p) {
    const steps = applicable(p);
    const wanted = new Set(steps.map((s) => s.id));
    const have = new Set(st.tasks.filter((t) => t.source === "plan").map((t) => t.step));
    for (const s of steps) if (!have.has(s.id)) await putTask("plan-" + s.id + "-" + newId(), stepTask(s, p, p.start));
    for (const t of st.tasks) if (t.source === "plan" && !wanted.has(t.step) && t.status !== "done") await delTask(t.id);
    // Titles that depend on answers (e.g. the platform name) follow the current answers.
    for (const t of st.tasks) {
      if (t.source !== "plan" || !STEP[t.step] || !wanted.has(t.step)) continue;
      const title = val(STEP[t.step].title, p);
      if (t.title !== title && t.status !== "done") await putTask(t.id, { ...strip(t), title });
    }
  }
  async function restartPlan() {
    const p = { ...st.profile, start: today() };
    await saveProfile(p);
    for (const t of st.tasks) if (t.source === "plan" && t.status !== "done") await putTask(t.id, { ...strip(t), due: addDays(p.start, (t.day || 1) - 1) });
    toast("Plan dates now start today.");
  }

  // ---------------------------------------------------------------------------
  // Tasks: status changes and repeats
  // ---------------------------------------------------------------------------
  function nextDue(t) {
    const base = t.due && t.due > today() ? t.due : today();
    if (t.repeat === "daily") return addDays(base, 1);
    if (t.repeat === "weekly") return addDays(base, 7);
    if (t.repeat === "monthly") return addMonth(base);
    return null;
  }
  async function setStatus(t, status, opts = {}) {
    if (readOnly) return;
    const was = t.status;
    const before = strip(st.tasks.find((x) => x.id === t.id) || t);
    await putTask(t.id, { ...strip(t), status, doneAt: status === "done" ? today() : null });
    if (status === "done" && was !== "done") maybeCelebrate(t);
    let spawned = null, due = null;
    if (status === "done" && was !== "done" && t.repeat && t.repeat !== "none") {
      due = nextDue(t);
      spawned = (t.source === "plan" ? "plan-" + t.step + "-" : "custom-") + newId();
      await putTask(spawned, { ...strip(t), status: "todo", due, doneAt: null, createdAt: Date.now() });
    }
    const undo = async () => { await putTask(t.id, before); if (spawned) await delTask(spawned); };
    if (opts.quiet) return undo;
    if (spawned) toast("Done. The next one is due " + fmtDue(due).toLowerCase() + ".", { undo });
    else if (status === "done") toast("Marked done.", { undo });
    else if (was === "done") toast("Moved back to your open tasks.", { undo });
    else if (opts.toastMsg) toast(opts.toastMsg, { undo });
    return undo;
  }
  const toggleDone = (t) => setStatus(t, t.status === "done" ? "todo" : "done");

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function onData(kind) {
    updateTabBadge();
    if (kind === "account" || kind === "saves") { if ($("#acctDlg") && $("#acctDlg").open) drawAccount(); if (kind === "account" && st.tab === "today") render(); return; }
    scheduleBadges();
    const t = st.tab;
    if (kind === "tasks" && (t === "plan" || t === "tasks" || t === "today")) render();
    else if (kind === "learn" && (t === "learn" || t === "plan" || t === "today")) render();
    else if (kind === "profile" && t !== "tools" && t !== "sites") render();
    else if (kind === "profile" && t === "tools") renderToolsDirectory();
    else if (kind === "products") drawSaved();
    else if (kind === "links" && t === "sites") render();
  }
  function updateTabBadge() {
    const td = today();
    const due = st.tasks.filter((x) => x.status !== "done" && x.due && x.due <= td).length;
    const b = $("#tabTaskN"); b.textContent = due; b.hidden = !due; b.title = due + " due today or overdue";
  }
  const TABS = ["today", "plan", "tasks", "learn", "tools", "sites"];
  const TAB_NAME = { today: "Today", plan: "Plan", tasks: "Tasks", learn: "Learn", tools: "Tools", sites: "Sites" };
  function setTab(tab) {
    if (!TABS.includes(tab)) tab = "today";
    st.tab = tab; lsSet("dd-tab6", tab);
    document.querySelectorAll("#tabs button").forEach((b) => { b.setAttribute("aria-selected", String(b.dataset.tab === tab)); b.tabIndex = b.dataset.tab === tab ? 0 : -1; });
    document.querySelectorAll("#bnav button").forEach((b) => { if (b.dataset.tab === tab || (b.dataset.tab === "more" && !["today", "plan", "tasks", "tools"].includes(tab))) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    $("#out").setAttribute("aria-labelledby", "tab-" + tab);
    render(true);
    positionInk();
    window.scrollTo({ top: 0 });
  }
  function go(target) {
    ["guideDlg", "readDlg", "moreDlg", "palDlg", "setDlg", "acctDlg"].forEach((id) => { const d = $("#" + id); if (d && d.open) d.close(); });
    if (target.startsWith("lesson:")) { openLesson(target.slice(7)); return; }
    if (target.startsWith("tools:")) { openTool(target.slice(6)); return; }
    setTab(target);
  }
  // Re-rendering keeps whatever someone is typing in the main inputs.
  const KEEP = ["quickAdd", "addTitle", "taskSearch", "siteQ"];
  let renderAnimate = false;
  function render(animate = false) {
    renderAnimate = !!animate;
    const out = $("#out");
    const a = document.activeElement;
    const keep = a && KEEP.includes(a.id) ? { id: a.id, v: a.value, s: a.selectionStart, e: a.selectionEnd } : null;
    const drafts = KEEP.map((id) => { const x = $("#" + id); return x ? [id, x.value] : null; }).filter(Boolean);
    out.textContent = "";
    if (st.tab === "today") out.append(renderToday());
    else if (st.tab === "plan") out.append(renderPlan());
    else if (st.tab === "tasks") out.append(renderTasks());
    else if (st.tab === "learn") out.append(renderLearn());
    else if (st.tab === "tools") out.append(renderTools());
    else if (st.tab === "sites") out.append(renderSites());
    const root = out.firstElementChild;
    if (animate && root && !calm()) { root.classList.add("enter"); [...root.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 8))); }
    drafts.forEach(([id, v]) => { const x = $("#" + id); if (x && !x.value && v && id !== "siteQ" && id !== "taskSearch") { x.value = v; x.dispatchEvent(new Event("input")); } });
    if (keep) { const x = $("#" + keep.id); if (x) { x.focus(); try { x.setSelectionRange(keep.s, keep.e); } catch {} } }
  }

  // ----- Setup questions
  const QUESTIONS = [
    { key: "level", q: "How far along are you?", opts: () => [["new", "Haven't started", "Nothing set up yet"], ["store", "Set up, no sales yet", "Account or shop exists"], ["selling", "Already earning", "Getting orders or commissions"]] },
    { key: "model", q: "How do you want to make money?", opts: () => MODELS },
    { key: "channel", q: "Where will you do it?", opts: (a) => CHANNELS[a.model] || [] },
    { key: "country", q: "Where do you live?", opts: () => [["us", "United States", ""], ["uk", "United Kingdom", ""], ["other", "Somewhere else", ""]] },
    { key: "ads", q: "Will you pay for ads this week?", opts: () => [["none", "No", "Free methods only"], ["some", "Yes", "I have a budget I can afford to lose"]], show: (a) => ADS_MODELS.includes(a.model) },
  ];
  function labelFor(key, value, p) {
    const q = QUESTIONS.find((x) => x.key === key); if (!q) return "";
    const o = q.opts(p || {}).find((x) => x[0] === value); return o ? o[1] : "";
  }

  // ----- Setup: one question at a time, then a review screen.
  // Facts for comparing the ways to earn (what you sell, who ships, stock).
  const MODEL_FACTS = {
    supplier: ["Products from a supplier", "Your supplier ships each order", "No"],
    pod: ["Your designs on products", "A print partner prints and ships each order", "No"],
    affiliate: ["Other brands' products, through your links", "The brand or store ships", "No"],
    digital: ["Files people download", "Nothing to ship", "No"],
    resell: ["Secondhand or clearance items", "You ship each order", "Yes: the items you buy"],
    freelance: ["Your skills and time", "You deliver the work", "No"],
    creator: ["Content: payouts, sponsors and links", "Nothing to ship", "No"],
    courses: ["Lessons you teach", "Delivered online", "No"],
    books: ["eBooks and paperbacks", "KDP prints paperbacks on demand and delivers eBooks", "No"],
    newsletter: ["Paid subscriptions and sponsorships", "Sent by email", "No"],
    fba: ["Your own branded products", "Amazon stores and ships them", "Yes: you buy stock first"],
    handmade: ["Things you make", "You make and ship each order", "Materials"],
  };
  const MODEL_FILTERS = [
    ["", "All"],
    ["nostock", "No stock to buy", (k) => MODEL_FACTS[k][2] === "No"],
    ["noship", "Nothing to ship", (k) => ["affiliate", "digital", "freelance", "creator", "courses", "newsletter"].includes(k)],
    ["physical", "Physical products", (k) => ["supplier", "pod", "resell", "fba", "handmade"].includes(k)],
    ["skill", "Uses a skill you have", (k) => ["pod", "freelance", "creator", "courses", "books", "newsletter", "handmade", "digital"].includes(k)],
  ];
  const setup = { step: 0, draft: null, compare: false, filter: "", back: false };
  function startSetup(editing) { setup.draft = null; setup.step = editing ? 99 : 0; setup.compare = false; setup.filter = ""; setup.back = false; st.editingProfile = !!editing; }
  // After changing one answer from the review screen, go straight back to it.
  const advance = () => { setup.step = setup.back ? 99 : setup.step + 1; };
  function setupWarnings(a) {
    const msgs = [];
    if (a.channel === "tiktok" && a.country && a.country !== "us") msgs.push("<b>The TikTok Shop steps follow TikTok Shop US rules.</b> Sellers elsewhere should check their own country's Seller Center.");
    if (a.channel === "aff_tiktok" && a.country && a.country !== "us") msgs.push("<b>The TikTok Shop affiliate steps follow US rules.</b> Other countries have their own requirements.");
    if (a.model === "fba") msgs.push("<b>Amazon FBA means paying for stock before you sell anything.</b> Only invest what you can afford to lose; the plan has you check every fee first.");
    if (a.ads === "some" && ADS_MODELS.includes(a.model)) msgs.push("<b>Only spend what you can afford to lose.</b> The plan has you work out your break-even before any ad runs.");
    return msgs;
  }
  function compareTable(onPick) {
    const tw = el("div", "tablewrap"); const t = el("table", "compare");
    t.innerHTML = "<caption class=\"small muted\" style=\"text-align:left;padding-bottom:6px\">The 12 ways to earn, side by side</caption><thead><tr><th scope=\"col\">Way to earn</th><th scope=\"col\">What you sell</th><th scope=\"col\">Who makes or ships it</th><th scope=\"col\">Stock to buy first</th><th scope=\"col\">Where (in this app)</th><th scope=\"col\"></th></tr></thead>";
    const tb = el("tbody");
    MODELS.forEach(([k, name]) => {
      const f = MODEL_FACTS[k]; const tr = el("tr");
      const th = el("th", null, name); th.scope = "row"; th.style.textTransform = "none"; th.style.letterSpacing = "0"; th.style.font = "600 0.88rem/1.4 var(--body)"; th.style.color = "var(--fg)";
      tr.append(th, el("td", null, f[0]), el("td", null, f[1]), el("td", null, f[2]), el("td", "small", (CHANNELS[k] || []).map((c) => c[1]).join(", ")));
      const td = el("td"); const b = el("button", "btn sm", "Choose"); b.type = "button"; b.setAttribute("aria-label", "Choose " + name); b.onclick = () => onPick(k); td.append(b); tr.append(td);
      tb.append(tr);
    });
    t.append(tb); tw.append(t); return tw;
  }
  function renderSetup() {
    if (!setup.draft) setup.draft = Object.assign({ level: "", model: "", channel: "", country: "", ads: "" }, st.profile || {});
    const a = setup.draft;
    // Count questions that could still apply, so the total doesn't jump.
    const qs = QUESTIONS.filter((q) => !q.show || !a.model || q.show(a));
    const total = qs.length;
    if (setup.step > total) setup.step = total;
    // A changed model can leave a later answer empty: send people back to it.
    if (setup.step === total) { const gap = qs.findIndex((q) => !a[q.key]); if (gap >= 0) setup.step = gap; }
    const card = el("form", "card"); card.id = "setupForm"; card.noValidate = true;
    const head = el("div", "setup-head");
    const onReview = setup.step === total;
    head.append(el("span", "label", onReview ? "Review" : "Question " + (setup.step + 1) + " of " + total));
    head.append(el("h2", null, onReview ? (st.profile ? "Your answers" : "Check your answers") : qs[setup.step].q));
    const m = el("div", "meter"); m.setAttribute("role", "progressbar"); m.setAttribute("aria-label", "Setup progress"); m.setAttribute("aria-valuemin", "0"); m.setAttribute("aria-valuemax", String(total)); m.setAttribute("aria-valuenow", String(setup.step));
    const mi = el("i"); mi.style.width = Math.round((setup.step / total) * 100) + "%"; m.append(mi); head.append(m);
    card.append(head);
    const redraw = () => { render(); const f = $("#setupForm"); if (f) { const target = f.querySelector("input:checked") || f.querySelector("input, button.primary"); if (target) target.focus({ preventScroll: true }); } };
    const nav = el("div", "setup-nav");
    const back = el("button", "btn", st.profile && (onReview || setup.step === 0) ? "Cancel" : "Back"); back.type = "button";
    back.hidden = setup.step === 0 && !st.profile;
    back.onclick = () => { if (st.profile && (onReview || setup.step === 0)) { st.editingProfile = false; setup.draft = null; render(); return; } setup.step = Math.max(0, setup.step - 1); redraw(); };

    if (!onReview) {
      const q = qs[setup.step];
      if (!q.opts(a).length) { setup.step = qs.findIndex((x) => x.key === "model"); return renderSetup(); }
      if (setup.step === 0 && !st.profile) card.append(el("p", "muted", "Five quick questions. Your 7-day plan, tasks, lessons and tools follow your answers, and you can change them any time."));
      if (q.key === "model") {
        const bar = el("div", "row-gap");
        const chips = el("div", "chips"); chips.setAttribute("role", "group"); chips.setAttribute("aria-label", "Narrow the list");
        MODEL_FILTERS.forEach(([k, l]) => { const b = el("button", "chip", l); b.type = "button"; b.setAttribute("aria-pressed", String(setup.filter === k)); b.onclick = () => { setup.filter = k; render(); }; chips.append(b); });
        const cmp = el("button", "btn sm", setup.compare ? "Hide comparison" : "Compare them side by side"); cmp.type = "button"; cmp.setAttribute("aria-expanded", String(setup.compare));
        cmp.onclick = () => { setup.compare = !setup.compare; render(); };
        bar.append(chips, cmp); card.append(bar);
        if (setup.compare) card.append(compareTable((k) => { a.model = k; if (!(CHANNELS[k] || []).some((c) => c[0] === a.channel)) a.channel = ""; setup.compare = false; advance(); redraw(); }));
      }
      const fs = el("fieldset", "q"); fs.style.border = "0"; fs.style.padding = "0"; fs.style.margin = "0";
      const lg = el("legend", "sr-only", q.q); lg.style.position = "absolute"; lg.style.width = "1px"; lg.style.height = "1px"; lg.style.overflow = "hidden"; lg.style.clip = "rect(0 0 0 0)"; fs.append(lg);
      const wrap = el("div", "opts");
      const filt = q.key === "model" && setup.filter ? MODEL_FILTERS.find((f) => f[0] === setup.filter)[2] : null;
      q.opts(a).filter(([v]) => !filt || filt(v)).forEach(([v, l, hint]) => {
        const w = el("div", "opt");
        const i = el("input"); i.type = "radio"; i.name = q.key; i.value = v; i.id = "q-" + q.key + "-" + v; i.checked = a[q.key] === v;
        let ptr = false;
        w.addEventListener("pointerdown", () => (ptr = true));
        i.onchange = () => {
          a[q.key] = v;
          if (q.key === "model" && !(CHANNELS[v] || []).some((c) => c[0] === a.channel)) a.channel = "";
          next.disabled = false;
          const warn = setupWarnings(a); warnBox.innerHTML = warn.join("<br>"); warnBox.hidden = !warn.length;
          // Pointer picks move on by themselves; keyboard users press Next.
          if (ptr) { ptr = false; setTimeout(() => { if ($("#setupForm") === card) { advance(); redraw(); } }, 160); }
        };
        const lab = el("label"); lab.htmlFor = i.id; lab.append(el("span", null, l)); if (hint) lab.append(el("small", null, hint));
        w.append(i, lab); wrap.append(w);
      });
      fs.append(wrap); card.append(fs);
      const warnBox = el("div", "note"); const warn = setupWarnings(a); warnBox.innerHTML = warn.join("<br>"); warnBox.hidden = !warn.length; card.append(warnBox);
      const next = el("button", "btn primary", setup.back || setup.step === total - 1 ? "Review answers" : "Next"); next.type = "submit"; next.disabled = !a[q.key];
      nav.append(back, next); card.append(nav);
      card.addEventListener("submit", (e) => { e.preventDefault(); if (!a[q.key]) return; advance(); redraw(); });
      return card;
    }

    // Review
    const list = el("div", "review");
    qs.forEach((q, idx) => {
      const r = el("div", "review-row");
      r.append(el("span", "label", q.q), el("b", null, labelFor(q.key, a[q.key], a) || "Not answered"));
      const c = el("button", "btn sm", "Change"); c.type = "button"; c.setAttribute("aria-label", "Change: " + q.q); c.onclick = () => { setup.step = idx; setup.back = true; redraw(); };
      r.append(c); list.append(r);
    });
    card.append(list);
    const warn = setupWarnings(a);
    if (warn.length) { const n = el("div", "note"); n.innerHTML = warn.join("<br>"); card.append(n); }
    const save = el("button", "btn primary", st.profile ? "Update my plan" : "Build my plan"); save.type = "submit";
    nav.append(back, save); card.append(nav);
    card.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!a.level || !a.model || !a.channel || !a.country) { toast("Answer each question first."); return; }
      if (!ADS_MODELS.includes(a.model) || !a.ads) a.ads = "none";
      const prof = { level: a.level, model: a.model, channel: a.channel, country: a.country, ads: a.ads, start: (st.profile && st.profile.start) || today(), choices: (st.profile && st.profile.choices) || {} };
      save.disabled = true; save.textContent = "Building…";
      const first = !st.profile;
      await saveProfile(prof);
      st.profile = prof; st.editingProfile = false; setup.draft = null;
      await syncPlan(prof);
      ensureFeeDefaults(true);
      toast(first ? "Your plan is ready. Here's your first step." : "Your plan is updated.");
      if (first) setTab("today"); else render();
    });
    return card;
  }

  const PLAN_INTRO = {
    ship: "Days 1–5 get you to a shop that can take orders; days 6–7 put your product in front of buyers.",
    affiliate: "Days 1–3 set up your accounts and learn the disclosure rules; days 4–7 publish content with your links. Programs pay only on completed sales, usually weeks later.",
    digital: "Days 1–5 take you from an idea to a listed product; days 6–7 get it in front of buyers.",
    resell: "Days 1–3 set up and learn what sells; days 3–5 buy and list your first items; days 6–7 sell and ship.",
    freelance: "Days 1–4 set up your offer, rate and profile; days 5–7 find and serve your first clients.",
    creator: "Days 1–3 learn the program rules and plan your content; days 4–7 post on a schedule. Platform payouts start only after you qualify and are approved.",
    courses: "Days 1–3 set up and check demand; days 4–7 build the first module and open enrolment to a small group.",
    books: "Days 1–3 set up KDP and plan the book; days 4–7 work on the cover, pricing and description. Writing a book takes longer than a week; this sets you up.",
    newsletter: "Days 1–4 set up, learn the email rules and write ahead; days 5–7 find your first readers.",
    fba: "This week is research and numbers: account, fees, samples and brand. Stock usually takes weeks to make and ship, so don't order until the numbers work.",
    handmade: "Days 1–3 check the rules and price your work; days 4–7 photograph, list and promote.",
  };
  function renderPlan() {
    const wrap = el("div"); wrap.style.display = "grid"; wrap.style.gap = "18px";
    if (!st.profileLoaded || !st.tasksLoaded) { wrap.append(skeleton()); return wrap; }
    if (!st.profile || st.editingProfile) { wrap.append(renderSetup()); return wrap; }
    const p = st.profile;
    const planTasks = st.tasks.filter((t) => t.source === "plan");
    const oneOff = planTasks.filter((t) => !STEP[t.step] || !STEP[t.step].ongoing);
    const done = oneOff.filter((t) => t.status === "done").length;

    const head = el("section", "card plan-head");
    const left = el("div"); left.style.display = "grid"; left.style.gap = "10px";
    left.append(el("h2", null, "Your 7-day plan"));
    const chips = el("div", "chips");
    [MODEL_NAME[p.model], CHANNEL_NAME[p.channel], labelFor("level", p.level), labelFor("country", p.country), !ADS_MODELS.includes(p.model) ? null : p.ads === "some" ? "Paid ads" : "No paid ads"].filter(Boolean).forEach((c) => chips.append(el("span", "chip", c)));
    left.append(chips);
    left.append(html("p", "small muted", (SHIP(p) ? PLAN_INTRO.ship : PLAN_INTRO[p.model] || "") + " <b>No guide can promise income in a week</b>: that depends on what you sell, your price and whether people buy. Each step shows where its facts come from, and the calculators show your numbers before you spend money."));
    const btns = el("div", "row-gap");
    const edit = el("button", "btn sm", "Change answers"); edit.type = "button"; edit.onclick = () => { startSetup(true); render(); };
    const restart = el("button", "btn sm", "Restart dates from today"); restart.type = "button"; restart.onclick = restartPlan;
    if (!readOnly) btns.append(edit, restart);
    left.append(btns);
    const prog = el("div", "prog");
    prog.append(el("span", "label", "Progress"));
    const b = el("b", null, `${done}/${oneOff.length}`); prog.append(b);
    const m = el("div", "meter"); const i = el("i"); i.style.width = (oneOff.length ? Math.round((done / oneOff.length) * 100) : 0) + "%"; m.append(i); prog.append(m);
    prog.append(el("span", "small muted", "Started " + fmtDay(p.start)));
    head.append(left, prog);
    wrap.append(head);
    const tc = toolsCard(p); if (tc) wrap.append(tc);

    if (!planTasks.length) {
      const e = el("div", "empty"); e.append(el("h3", null, "No plan tasks yet"), el("p", null, "Rebuild the plan from your answers."));
      const r = el("button", "btn primary", "Rebuild plan"); r.type = "button"; r.onclick = () => syncPlan(p); e.append(r);
      wrap.append(e); return wrap;
    }

    const days = el("div", "days");
    const td = today();
    for (let d = 1; d <= 7; d++) {
      const items = oneOff.filter((t) => t.day === d).sort((a, b) => GUIDE.indexOf(STEP[a.step]) - GUIDE.indexOf(STEP[b.step]));
      if (!items.length) continue;
      const date = addDays(p.start, d - 1);
      const sec = el("section", "day" + (date === td ? " today" : "")); sec.id = "day-" + d;
      const tag = el("div", "day-tag"); tag.append(el("b", null, "Day " + d), el("span", "small muted", date === td ? "Today" : fmtDay(date)));
      const list = el("div", "steps");
      items.forEach((t) => list.append(stepRow(t)));
      sec.append(tag, list); days.append(sec);
    }
    const ongoing = planTasks.filter((t) => STEP[t.step] && STEP[t.step].ongoing && t.status !== "done").sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    if (ongoing.length) {
      const sec = el("section", "day");
      const tag = el("div", "day-tag"); tag.append(el("b", null, "Every week"), el("span", "small muted", "Repeats"));
      const list = el("div", "steps"); ongoing.forEach((t) => list.append(stepRow(t, true)));
      sec.append(tag, list); days.append(sec);
    }
    wrap.append(days);
    return wrap;
  }

  function stepRow(t, showDue) {
    const r = el("div", "step" + (t.status === "done" ? " done" : ""));
    const c = el("button", "check"); c.type = "button"; c.setAttribute("role", "checkbox");
    c.setAttribute("aria-checked", String(t.status === "done")); c.setAttribute("aria-label", "Mark done: " + t.title);
    c.innerHTML = CHECK_SVG; c.disabled = readOnly; c.onclick = () => { if (t.status !== "done") { burst(c); c.classList.add("pop"); } toggleDone(t); };
    const main = el("button", "main"); main.type = "button";
    main.append(el("span", "t", t.title));
    const meta = el("span", "meta");
    meta.append(el("span", "tag", AREA[t.area] || "Other"));
    if (t.repeat && t.repeat !== "none") meta.append(el("span", null, "↻ " + t.repeat));
    if (showDue && t.due) meta.append(el("span", "ref", "Next: " + fmtDue(t.due)));
    const cg = choiceFor(t.step, st.profile); const ci = cg && chosenItem(cg); if (ci) meta.append(el("span", "tag use", "Using " + ci.name));
    if (t.status === "doing") meta.append(el("span", "pill doing", "In progress"));
    if (t.status === "waiting") meta.append(el("span", "pill waiting", "Waiting on supplier"));
    main.append(meta);
    main.onclick = () => openGuide(t);
    r.append(c, main);
    return r;
  }

  // ---------------------------------------------------------------------------
  // Choices for each step: other websites and platforms that do the same job.
  // Each entry is [name, link, what it is, region]. Region "us" or "uk" marks
  // services for that country only. Prices change often, so none are listed
  // here; check each site before signing up.
  // ---------------------------------------------------------------------------
  const O = {
    // store builders
    shopify: ["Shopify", S.shopTrial[1], "Online store builder with its own checkout and app store."],
    woocommerce: ["WooCommerce", "https://woocommerce.com/", "Free plugin that adds a store to a WordPress site; you arrange the hosting."],
    wix: ["Wix", "https://www.wix.com/", "Website builder with built-in online store features."],
    squarespace: ["Squarespace", "https://www.squarespace.com/", "Website builder with built-in selling."],
    bigcommerce: ["BigCommerce", "https://www.bigcommerce.com/", "Online store platform."],
    // where to sell, payments and free sales channels
    ttShop: ["TikTok Shop", S.ttsHome[1], "Sell inside TikTok; strict US delivery deadlines."],
    amazonSell: ["Amazon", "https://sell.amazon.com/pricing", "Sell on Amazon's marketplace."],
    shopPayments: ["Shopify Payments", "https://www.shopify.com/payments", "Shopify's own payment processing, built into checkout."],
    googleApp: ["Google & YouTube app", "https://apps.shopify.com/google", "Free product listings on Google, plus Google and YouTube ads."],
    fbApp: ["Facebook & Instagram app", "https://apps.shopify.com/facebook", "Sync your products to Facebook and Instagram shops."],
    pinApp: ["Pinterest app", "https://apps.shopify.com/pinterest", "Turns your products into Product Pins with a daily catalog refresh."],
    tiktokApp: ["TikTok app", "https://apps.shopify.com/tiktok", "TikTok ads and TikTok Shop orders from your Shopify admin."],
    // supplier apps
    dsers: ["DSers", S.dsersApp[1], "Imports AliExpress products to your store and places the orders with suppliers."],
    cj: ["CJdropshipping", S.cj[1], "Supplier catalog with its own warehouses that packs and ships orders."],
    spocket: ["Spocket", S.spocket[1], "Supplier catalog with many suppliers based in the US and Europe."],
    autods: ["AutoDS", S.autods[1], "Imports products, watches supplier prices and stock, and automates orders."],
    zendrop: ["Zendrop", "https://www.zendrop.com/", "Supplier catalog and order fulfilment app for online stores."],
    collective: ["Shopify Collective", S.collective[1], "Sell other Shopify brands' products; each brand ships its own orders. Your store must be in a supported country."],
    // print-on-demand
    printful: ["Printful", S.printful[1], "Prints and ships your designs from its own production centres."],
    printify: ["Printify", S.printify[1], "Network of print providers; you pick one for each product."],
    gelato: ["Gelato", "https://www.gelato.com/", "Prints orders locally through production partners in many countries."],
    gooten: ["Gooten", "https://www.gooten.com/", "Print-on-demand network for apparel and home products."],
    // design, mockups and photos
    canva: ["Canva", "https://www.canva.com/", "Design in the browser or app, with a free plan."],
    adobeExpress: ["Adobe Express", "https://www.adobe.com/express/", "Adobe's quick design and video tool, with a free plan."],
    kittl: ["Kittl", "https://www.kittl.com/", "Design tool built for logos, T-shirts and print designs."],
    photopea: ["Photopea", "https://www.photopea.com/", "Free photo editor in the browser that opens Photoshop files."],
    placeit: ["Placeit", "https://placeit.net/", "Mockup templates that show your design on products."],
    printfulMockup: ["Printful mockup generator", "https://www.printful.com/mockup-generator", "Makes product mockups for Printful's catalog."],
    photoroom: ["Photoroom", "https://www.photoroom.com/", "App that removes backgrounds and makes clean product photos."],
    removebg: ["remove.bg", "https://www.remove.bg/", "Removes image backgrounds automatically."],
    lightroom: ["Adobe Lightroom", "https://lightroom.adobe.com/", "Adobe's photo editor for phone, desktop and web."],
    // research
    googleTrends: ["Google Trends", S.trends[1], "Free. Shows search interest over time, relative to the peak."],
    ttTop: ["TikTok Top Products", S.ttTop[1], "TikTok's list of products doing well in ads."],
    metaLib: ["Meta Ad Library", S.metaLib[1], "Search every active ad on Facebook and Instagram."],
    pinTrends: ["Pinterest Trends", "https://trends.pinterest.com/", "What people search for on Pinterest, month by month."],
    amzBest: ["Amazon Best Sellers", "https://www.amazon.com/gp/bestsellers/", "Amazon's best-selling products by category."],
    ebaySold: ["eBay sold listings", "https://www.ebay.com/sch/i.html?_nkw=&LH_Sold=1&LH_Complete=1", "What items actually sold for recently."],
    explodingTopics: ["Exploding Topics", "https://explodingtopics.com/", "Topics with fast-growing search interest."],
    youtube: ["YouTube", "https://www.youtube.com/", "Search a topic to see what people watch and ask about."],
    answerPublic: ["AnswerThePublic", "https://answerthepublic.com/", "The questions people search for around a topic."],
    reddit: ["Reddit", "https://www.reddit.com/", "Communities where people discuss specific topics and problems."],
    etsySearch: ["Etsy search", "https://www.etsy.com/", "See what similar sellers offer and what they charge."],
    erank: ["eRank", "https://erank.com/", "Keyword and listing research for Etsy sellers."],
    ebayResearch: ["eBay Product Research", "https://www.ebay.com/help/selling/selling-tools/terapeak?id=4853", "Formerly Terapeak: up to 3 years of eBay sold data, free in Seller Hub."],
    goodreads: ["Goodreads", "https://www.goodreads.com/", "Readers' ratings, reviews and lists by genre."],
    kindleBest: ["Kindle Store best sellers", "https://www.amazon.com/gp/bestsellers/digital-text/", "Amazon's best-selling eBooks by category."],
    jungleScout: ["Jungle Scout", "https://www.junglescout.com/", "Paid Amazon product research and sales estimates."],
    helium10: ["Helium 10", "https://www.helium10.com/", "Paid Amazon product and keyword research tools."],
    keepa: ["Keepa", "https://keepa.com/", "Price and sales-rank history for Amazon products."],
    // video and recording
    capcut: ["CapCut", "https://www.capcut.com/", "Video editor for phone and desktop, with a free plan."],
    davinci: ["DaVinci Resolve", "https://www.blackmagicdesign.com/products/davinciresolve", "Professional editor with a free version for Windows, Mac and Linux."],
    descript: ["Descript", "https://www.descript.com/", "Edit video and audio by editing the transcript."],
    imovie: ["iMovie", "https://www.apple.com/imovie/", "Apple's free video editor for Mac, iPhone and iPad."],
    loom: ["Loom", "https://www.loom.com/", "Record your screen and camera from the browser."],
    obs: ["OBS Studio", "https://obsproject.com/", "Free, open-source screen recording and streaming."],
    // ads
    metaAds: ["Meta Ads Manager", S.metaAds[1], "Ads on Facebook and Instagram."],
    ttAds: ["TikTok Ads Manager", S.ttAds[1], "Ads on TikTok."],
    googleAds: ["Google Ads", "https://ads.google.com/", "Ads on Google Search, YouTube and Shopping."],
    pinAds: ["Pinterest Ads", "https://ads.pinterest.com/", "Ads in Pinterest feeds and search."],
    // customer messages
    shopInbox: ["Shopify Inbox", "https://apps.shopify.com/inbox", "Shopify's free chat and messaging app."],
    gorgias: ["Gorgias", "https://www.gorgias.com/", "Customer service helpdesk built for online stores."],
    tidio: ["Tidio", "https://www.tidio.com/", "Live chat and chatbot for websites."],
    // money
    sheets: ["Google Sheets", "https://www.google.com/sheets/about/", "Free spreadsheet; enough for a simple log of income and costs."],
    wave: ["Wave", "https://www.waveapps.com/", "Accounting and invoicing for small businesses in the US and Canada."],
    quickbooks: ["QuickBooks", "https://quickbooks.intuit.com/", "Accounting software from Intuit."],
    xero: ["Xero", "https://www.xero.com/", "Online accounting software."],
    freeagent: ["FreeAgent", "https://www.freeagent.com/", "Accounting software for UK freelancers and small businesses.", "uk"],
    freshbooks: ["FreshBooks", "https://www.freshbooks.com/", "Invoicing and accounting for freelancers and small businesses."],
    stripeInv: ["Stripe Invoicing", "https://stripe.com/invoicing", "Send invoices that clients can pay by card."],
    paypalBiz: ["PayPal Business", "https://www.paypal.com/business", "Send invoices and accept PayPal and card payments."],
    // affiliate programs
    amzAssoc: ["Amazon Associates", S.amzAssoc[1], "Amazon's affiliate program."],
    ttsAff: ["TikTok Shop affiliate", "https://seller-us.tiktok.com/university/essay?knowledge_id=7608640301074219&lang=en", "Earn commission promoting TikTok Shop products.", "us"],
    awin: ["Awin", S.awinJoin[1], "Affiliate network with thousands of brands."],
    cjAff: ["CJ Affiliate", S.cjAff[1], "Affiliate network for brands and publishers."],
    impact: ["impact.com", S.impact[1], "Platform many brands use to run their affiliate programs."],
    rakuten: ["Rakuten Advertising", "https://rakutenadvertising.com/", "Affiliate network for retail brands."],
    ebayPN: ["eBay Partner Network", "https://partnernetwork.ebay.com/", "eBay's own affiliate program."],
    // where to post
    tiktok: ["TikTok", "https://www.tiktok.com/", "Short videos."],
    instagram: ["Instagram", "https://www.instagram.com/", "Photos, Reels and Stories."],
    ytStudio: ["YouTube", "https://studio.youtube.com/", "Long videos and Shorts."],
    pinterest: ["Pinterest", "https://www.pinterest.com/", "Pins people save and search, often for shopping and ideas."],
    facebook: ["Facebook", "https://www.facebook.com/", "Pages, groups and Marketplace."],
    wordpress: ["WordPress.com", "https://wordpress.com/", "Start a blog or website, with a free plan."],
    // scheduling and link pages
    metaSuite: ["Meta Business Suite", "https://business.facebook.com/", "Free scheduling for Facebook and Instagram posts."],
    buffer: ["Buffer", "https://buffer.com/", "Schedule posts to several networks, with a free plan."],
    later: ["Later", "https://later.com/", "Visual planner and scheduler for social posts."],
    hootsuite: ["Hootsuite", "https://www.hootsuite.com/", "Social media scheduling and inbox."],
    linktree: ["Linktree", "https://linktr.ee/", "One link page for your bio, with a free plan."],
    beacons: ["Beacons", "https://beacons.ai/", "Link page with a built-in store and media kit."],
    stan: ["Stan", "https://stan.store/", "Link-in-bio storefront for selling digital products."],
    carrd: ["Carrd", "https://carrd.co/", "Simple one-page websites, with a free plan."],
    // digital products
    etsy: ["Etsy", S.etsySell[1], "Marketplace for handmade, vintage and digital items."],
    gumroad: ["Gumroad", S.gumroad[1], "Sell downloads, courses and memberships from your own page."],
    payhip: ["Payhip", S.payhip[1], "Sell downloads, courses and memberships, with a free plan."],
    shopDigital: ["Shopify Digital Downloads", S.shopDigital[1], "Free Shopify app that delivers files after purchase."],
    kofi: ["Ko-fi", "https://ko-fi.com/", "Creator page with tips, memberships and a shop."],
    lemon: ["Lemon Squeezy", "https://www.lemonsqueezy.com/", "Sells digital products and software and handles sales tax for you; owned by Stripe."],
    gdocs: ["Google Docs", "https://www.google.com/docs/about/", "Free online documents."],
    notion: ["Notion", "https://www.notion.com/", "Notes and docs; also used to make templates people sell."],
    msword: ["Microsoft Word", "https://www.microsoft.com/microsoft-365/word", "Microsoft's word processor."],
    // reselling
    ebay: ["eBay", S.ebayStart[1], "Marketplace for new and used items, with auctions and fixed prices."],
    mercari: ["Mercari", "https://www.mercari.com/", "Marketplace app for secondhand items.", "us"],
    poshmark: ["Poshmark", "https://poshmark.com/", "Marketplace for secondhand clothing, shoes and home goods.", "us"],
    depop: ["Depop", "https://www.depop.com/", "Resale app popular for clothing."],
    fbMarket: ["Facebook Marketplace", "https://www.facebook.com/marketplace/", "Buy and sell locally through Facebook."],
    vinted: ["Vinted", "https://www.vinted.com/", "Secondhand clothing marketplace (vinted.co.uk in the UK)."],
    grailed: ["Grailed", "https://www.grailed.com/", "Marketplace for menswear and streetwear."],
    shopgoodwill: ["ShopGoodwill", "https://shopgoodwill.com/", "Online auctions of items donated to Goodwill.", "us"],
    estatesales: ["EstateSales.net", "https://www.estatesales.net/", "Find estate sales near you.", "us"],
    craigslist: ["Craigslist", "https://www.craigslist.org/", "Local classified ads."],
    gumtree: ["Gumtree", "https://www.gumtree.com/", "Local classified ads.", "uk"],
    vendoo: ["Vendoo", "https://www.vendoo.co/", "List one item on several marketplaces at once; paid plans."],
    listPerfectly: ["List Perfectly", "https://listperfectly.com/", "Cross-listing and inventory tool for resellers; paid plans."],
    // shipping
    pirateship: ["Pirate Ship", "https://www.pirateship.com/", "Discounted USPS and UPS labels, free to use.", "us"],
    usps: ["USPS Click-N-Ship", "https://cns.usps.com/", "Buy and print USPS labels online.", "us"],
    ups: ["UPS", "https://www.ups.com/", "UPS shipping and labels."],
    clickDrop: ["Royal Mail Click & Drop", "https://www.royalmail.com/business/shipping/ways-pay/click-drop", "Royal Mail's label tool; no monthly fee.", "uk"],
    evri: ["Evri", "https://www.evri.com/", "Parcel delivery with drop-off shops and lockers.", "uk"],
    parcel2go: ["Parcel2Go", "https://www.parcel2go.com/", "Compare UK couriers and book labels.", "uk"],
    // freelancing
    fiverr: ["Fiverr", "https://www.fiverr.com/", "Clients buy your packaged services (gigs)."],
    upwork: ["Upwork", "https://www.upwork.com/", "Send proposals to jobs clients post."],
    freelancer: ["Freelancer.com", "https://www.freelancer.com/", "Bid on projects that clients post."],
    pph: ["PeoplePerHour", "https://www.peopleperhour.com/", "Freelance marketplace, popular in the UK."],
    contra: ["Contra", "https://contra.com/", "Freelance profile and portfolio that clients hire from directly."],
    linkedin: ["LinkedIn", "https://www.linkedin.com/", "Professional network for finding and messaging clients."],
    behance: ["Behance", "https://www.behance.net/", "Adobe's portfolio site for creative work."],
    dribbble: ["Dribbble", "https://dribbble.com/", "Portfolio community for designers."],
    // courses and email
    teachable: ["Teachable", S.teachable[1], "Course platform with your own school site."],
    thinkific: ["Thinkific", S.thinkific[1], "Course platform with your own school site."],
    kajabi: ["Kajabi", "https://kajabi.com/", "Courses, email and website in one."],
    podia: ["Podia", "https://www.podia.com/", "Courses, downloads and email in one."],
    udemy: ["Udemy", "https://www.udemy.com/teaching/", "Course marketplace with its own students; your share depends on how the student found you."],
    gforms: ["Google Forms", "https://www.google.com/forms/about/", "Free surveys and sign-up forms."],
    typeform: ["Typeform", "https://www.typeform.com/", "Conversational forms and surveys, with a free plan."],
    tally: ["Tally", "https://tally.so/", "Simple online forms, with a free plan."],
    kit: ["Kit", "https://kit.com/", "Email newsletters and automations for creators (formerly ConvertKit)."],
    mailerlite: ["MailerLite", "https://www.mailerlite.com/", "Email marketing with a free plan."],
    mailchimp: ["Mailchimp", "https://mailchimp.com/", "Email marketing with a free plan."],
    // books
    kdp: ["Amazon KDP", S.kdp[1], "Publish eBooks and print-on-demand paperbacks and hardcovers on Amazon."],
    ingram: ["IngramSpark", "https://www.ingramspark.com/", "Print and eBook distribution to bookstores and libraries."],
    d2d: ["Draft2Digital", "https://www.draft2digital.com/", "Distributes eBooks and print books to many stores."],
    kobo: ["Kobo Writing Life", "https://www.kobo.com/writinglife", "Publish eBooks and audiobooks to Kobo."],
    appleBooks: ["Apple Books for Authors", "https://authors.apple.com/", "Publish eBooks and audiobooks to Apple Books."],
    bnPress: ["Barnes & Noble Press", "https://press.barnesandnoble.com/", "Publish eBooks and print books to Barnes & Noble.", "us"],
    scrivener: ["Scrivener", "https://www.literatureandlatte.com/scrivener/overview", "Writing app for long projects (Mac, Windows, iPhone and iPad)."],
    reedsy: ["Reedsy Studio", "https://reedsy.com/studio", "Free online writing and book formatting tool."],
    kindleCreate: ["Kindle Create", "https://kdp.amazon.com/en_US/help/topic/G93BCLJGZFGK39BT", "Free KDP app for PC and Mac that formats eBooks and simple paperbacks."],
    coverCreator: ["KDP Cover Creator", "https://kdp.amazon.com/en_US/help/topic/G201113520", "KDP's free cover tool with layouts and fonts."],
    atticus: ["Atticus", "https://www.atticus.io/", "Book writing and formatting software that runs on any computer."],
    vellum: ["Vellum", "https://vellum.pub/", "Book formatting software for Mac."],
    // newsletters
    substack: ["Substack", "https://substack.com/", "Free to publish; Substack takes 10% of paid subscriptions."],
    beehiiv: ["beehiiv", S.beehiivPricing[1], "Newsletter platform with a free plan up to 2,500 subscribers."],
    ghost: ["Ghost", "https://ghost.org/", "Publishing platform for newsletters and paid memberships."],
    // book promotion
    authorCentral: ["Amazon Author Central", "https://kdp.amazon.com/en_US/help/topic/G200644310", "Free author page on Amazon with your bio and all your books; needs a published book."],
    goodreadsAuthor: ["Goodreads Author Program", "https://www.goodreads.com/author/program", "Free. Claim your author profile once your book is on Goodreads."],
    kdpPromo: ["KDP promotion guide", "https://kdp.amazon.com/en_US/help/topic/GQSKV8L8EM6APYHN", "KDP's own list of ways to promote your book."],
    // Amazon FBA
    alibaba: ["Alibaba", "https://www.alibaba.com/", "Marketplace of manufacturers and wholesalers, mostly in China."],
    globalSources: ["Global Sources", "https://www.globalsources.com/", "Supplier directory and trade shows in Asia."],
    madeInChina: ["Made-in-China.com", "https://www.made-in-china.com/", "Directory of manufacturers in China."],
    thomasnet: ["Thomasnet", "https://www.thomasnet.com/", "Directory of North American manufacturers."],
    // handmade
    amzHandmade: ["Amazon Handmade", "https://sell.amazon.com/programs/handmade", "Amazon's store for handmade goods; you apply first."],
    bigcartel: ["Big Cartel", "https://www.bigcartel.com/", "Simple store builder for artists and makers."],
    folksy: ["Folksy", "https://folksy.com/", "UK marketplace for handmade crafts.", "uk"],
    noths: ["Not On The High Street", "https://www.notonthehighstreet.com/", "UK marketplace for small creative brands; you apply to join.", "uk"],
  };
  // def: the option this plan's own steps are written for. channel: the
  // choice overlaps the "Where will you do it?" answer.
  const DEF_BY_CHANNEL = { shopify: "shopify", etsy: "etsy", gumroad: "gumroad", payhip: "payhip", ebay: "ebay", mercari: "mercari", poshmark: "poshmark", fiverr: "fiverr", upwork: "upwork", teachable: "teachable", thinkific: "thinkific", kdp: "kdp", substack: "substack", beehiiv: "beehiiv", aff_amazon: "amzAssoc", aff_tiktok: "ttsAff", aff_network: "awin", tiktok: "ttShop", amazon: "amazonSell" };
  const byChannel = (p) => DEF_BY_CHANNEL[p.channel] || null;
  const CHOICES = {
    store: { title: "Store builder", ask: "Which store builder will you use?", items: ["shopify", "woocommerce", "wix", "squarespace", "bigcommerce"], def: () => "shopify", note: "This plan's steps are written for Shopify. The others do the same job, but their menus and apps differ, so follow their own setup guides." },
    sellDrop: { title: "Where you'll sell", ask: "Where will you sell?", items: ["shopify", "ttShop", "ebay", "amazonSell"], def: byChannel, channel: true, note: "eBay and Amazon don't allow filling orders by buying from another retailer, so use a real wholesale supplier there." },
    sellPod: { title: "Where you'll sell", ask: "Where will you sell your designs?", items: ["shopify", "etsy", "ttShop"], def: byChannel, channel: true },
    payments: { title: "Payments", ask: "How will customers pay?", items: ["shopPayments", "paypalBiz"], note: "If you use a payment provider other than Shopify Payments, Shopify adds its own fee to each sale. The profit calculator has a preset for it." },
    salesChannels: { title: "Free sales channels", ask: "Where else will you show your products?", items: ["googleApp", "fbApp", "pinApp", "tiktokApp"], note: "All four are free to install from the Shopify App Store; any ads you run through them cost extra." },
    bookPromo: { title: "Book promotion", ask: "Where will you tell readers about your book?", items: ["authorCentral", "goodreadsAuthor", "kdpPromo", "kit", "mailerlite"] },
    supplierApp: { title: "Supplier app", ask: "Which supplier app will you use?", items: ["dsers", "cj", "spocket", "autods", "zendrop", "collective"], note: "Whichever you pick, vet the supplier and order a sample before you list anything." },
    pod: { title: "Print partner", ask: "Which print-on-demand partner will you use?", items: ["printful", "printify", "gelato", "gooten"], note: "Check that it connects to where you sell, and order a sample before you list." },
    design: { title: "Design tool", ask: "What will you design with?", items: ["canva", "adobeExpress", "kittl", "photopea"], note: "Check each tool's licence lets you sell designs that use its fonts and graphics." },
    mockups: { title: "Product images", ask: "How will you make product images and mockups?", items: ["printfulMockup", "placeit", "canva", "photopea"] },
    photos: { title: "Photo editing", ask: "What will you edit product photos with?", items: ["photoroom", "removebg", "lightroom", "canva"], note: "A phone camera and daylight by a window are enough to start." },
    productResearch: { title: "Product research", ask: "Where will you research products?", items: ["googleTrends", "ttTop", "metaLib", "pinTrends", "amzBest", "ebaySold", "explodingTopics"], note: "Use two or three together: one source alone can mislead." },
    contentResearch: { title: "Topic research", ask: "Where will you look for topics people want?", items: ["googleTrends", "youtube", "answerPublic", "reddit", "pinTrends", "explodingTopics"] },
    etsyResearch: { title: "Demand research", ask: "Where will you check demand?", items: ["etsySearch", "erank", "pinTrends", "googleTrends"] },
    resellResearch: { title: "Price research", ask: "Where will you check what items sell for?", items: ["ebaySold", "ebayResearch"], note: "Look at sold prices, not asking prices." },
    fbaResearch: { title: "Amazon research", ask: "Where will you research Amazon products?", items: ["amzBest", "keepa", "jungleScout", "helium10"], note: "Paid tools give estimates, not Amazon's own sales figures." },
    bookResearch: { title: "Book research", ask: "Where will you check what readers want?", items: ["kindleBest", "goodreads", "googleTrends", "reddit"] },
    video: { title: "Video editor", ask: "What will you edit videos with?", items: ["capcut", "adobeExpress", "canva", "davinci", "descript", "imovie"] },
    recording: { title: "Recording", ask: "What will you record lessons with?", items: ["loom", "obs", "descript", "davinci"] },
    ads: { title: "Ad platform", ask: "Where will you run your first test ad?", items: ["metaAds", "ttAds", "googleAds", "pinAds"], note: "Start with one platform and a hard spending cap." },
    support: { title: "Customer messages", ask: "Where will you answer customers?", items: ["shopInbox", "gorgias", "tidio"] },
    bookkeeping: { title: "Bookkeeping", ask: "Where will you track income and costs?", items: ["sheets", "wave", "quickbooks", "xero", "freeagent", "freshbooks"], note: "A simple spreadsheet is enough to start. Keep receipts for every business cost." },
    affiliate: { title: "Affiliate program", ask: "Which program will you start with?", items: ["amzAssoc", "ttsAff", "awin", "cjAff", "impact", "rakuten", "ebayPN"], def: byChannel, channel: true, note: "Each program has its own approval rules, commission rates and payment terms." },
    postWhere: { title: "Where you'll post", ask: "Where will you post first?", items: ["tiktok", "instagram", "ytStudio", "pinterest", "facebook", "reddit", "wordpress"], note: "Pick one or two and post consistently rather than everywhere at once." },
    scheduler: { title: "Post scheduling", ask: "What will you schedule posts with?", items: ["metaSuite", "buffer", "later", "hootsuite"], note: "TikTok, YouTube and Instagram also let you schedule inside their own apps." },
    linkInBio: { title: "Link page", ask: "Where will your links live?", items: ["linktree", "beacons", "stan", "carrd"], note: "Keep the disclosure next to affiliate links on the page too." },
    digitalPlatform: { title: "Where you'll sell", ask: "Where will you sell your digital product?", items: ["etsy", "gumroad", "payhip", "shopDigital", "kofi", "lemon", "stan"], def: (p) => (p.channel === "shopify" ? "shopDigital" : byChannel(p)), channel: true },
    digitalMake: { title: "Making tool", ask: "What will you make the product with?", items: ["canva", "gdocs", "sheets", "notion", "adobeExpress"], note: "Use only fonts, images and templates whose licence allows reselling." },
    resellMarket: { title: "Marketplace", ask: "Where will you list items?", items: ["ebay", "mercari", "poshmark", "depop", "vinted", "fbMarket", "grailed"], def: byChannel, channel: true, note: "Fees differ between marketplaces; compare them in Tools › Compare platforms." },
    sourcing: { title: "Where to find stock", ask: "Where will you find items to resell?", items: ["fbMarket", "shopgoodwill", "estatesales", "craigslist", "gumtree"], note: "Thrift and charity shops, yard sales and car boot sales work too." },
    listingTools: { title: "Listing tools", ask: "What will help you list faster?", items: ["photoroom", "removebg", "vendoo", "listPerfectly"] },
    shipping: { title: "Shipping labels", ask: "Where will you buy shipping labels?", items: ["pirateship", "usps", "ups", "clickDrop", "evri", "parcel2go"], note: "Marketplaces like eBay also sell labels inside their own site." },
    freelancePlatform: { title: "Where you'll find clients", ask: "Where will you find clients?", items: ["fiverr", "upwork", "freelancer", "pph", "contra", "linkedin"], def: byChannel, channel: true },
    portfolio: { title: "Portfolio", ask: "Where will your portfolio live?", items: ["behance", "dribbble", "contra", "carrd", "notion"] },
    invoicing: { title: "Getting paid", ask: "How will direct clients pay you?", items: ["stripeInv", "paypalBiz", "wave", "freshbooks"], note: "Only for clients outside platforms like Fiverr and Upwork, which handle payment for you." },
    coursePlatform: { title: "Course platform", ask: "Where will you host your course?", items: ["teachable", "thinkific", "kajabi", "podia", "payhip", "udemy"], def: byChannel, channel: true },
    forms: { title: "Waitlist or survey", ask: "What will you collect interest with?", items: ["gforms", "tally", "typeform", "carrd"] },
    writing: { title: "Writing tool", ask: "Where will you write?", items: ["gdocs", "msword", "notion", "scrivener", "reedsy"] },
    emailTool: { title: "Email tool", ask: "What will you send emails with?", items: ["kit", "mailerlite", "mailchimp", "beehiiv"], note: "US marketing emails need an unsubscribe link and your postal address (CAN-SPAM)." },
    bookPlatform: { title: "Where you'll publish", ask: "Where will you publish?", items: ["kdp", "ingram", "d2d", "kobo", "appleBooks", "bnPress"], def: () => "kdp", note: "If you enrol an eBook in KDP Select, it must be exclusive to Amazon while it's enrolled." },
    bookFormat: { title: "Cover and formatting", ask: "What will you format the book and make the cover with?", items: ["kindleCreate", "coverCreator", "canva", "reedsy", "atticus", "vellum"], note: "Check KDP's cover size for your trim size and page count before you design." },
    newsletter: { title: "Newsletter platform", ask: "Where will you publish your newsletter?", items: ["substack", "beehiiv", "kit", "ghost", "mailerlite"], def: byChannel, channel: true },
    manufacturers: { title: "Finding a manufacturer", ask: "Where will you look for a manufacturer?", items: ["alibaba", "globalSources", "madeInChina", "thomasnet"], note: "Get samples from more than one, and check certifications before you pay for stock." },
    handmadeSell: { title: "Where you'll sell", ask: "Where will you sell your handmade items?", items: ["etsy", "amzHandmade", "shopify", "bigcartel", "folksy", "noths"], def: byChannel, channel: true },
  };
  // Which choice each guide step offers. Functions pick by plan.
  const STEP_CHOICE = {
    "d1-shopify": "store", "d2-research": "productResearch", "d2-supplier-app": "supplierApp", "d2-supplier-mkt": "supplierApp",
    "d2-designs": "design", "d2-pod-app": "pod", "d4-build": (p) => (p.model === "pod" ? "mockups" : "photos"), "d4-list": (p) => (p.model === "pod" ? "mockups" : "photos"),
    "d6-organic": "video", "d6-ads": "ads", "d7-support": (p) => (p.channel === "shopify" ? "support" : null), "on-inbox": (p) => (p.channel === "shopify" ? "support" : null),
    "d7-review": "bookkeeping", "on-week": "bookkeeping",
    "d1-etsy": (p) => (p.model === "handmade" ? "handmadeSell" : p.model === "digital" ? "digitalPlatform" : p.model === "pod" ? "sellPod" : null),
    "d1-ebay": (p) => (p.model === "resell" ? "resellMarket" : p.model === "supplier" ? "sellDrop" : null),
    "d1-tiktok": (p) => (p.model === "pod" ? "sellPod" : "sellDrop"), "d1-amazon": "sellDrop",
    "d5-payments": "payments", "d5-google": "salesChannels",
    "d7-fulfill": (p) => (p.model === "pod" ? "pod" : "supplierApp"), "on-supplier": (p) => (p.model === "pod" ? "pod" : "supplierApp"),
    "on-orders": (p) => (p.model === "pod" ? "pod" : p.model === "supplier" ? "supplierApp" : "shipping"),
    "on-make": (p) => (p.model === "pod" ? "design" : p.model === "digital" ? "digitalMake" : "photos"),
    "fr4-profile": "freelancePlatform", "bk6-launch": "bookPromo",
    "af1-join": "affiliate", "af2-niche": "contentResearch", "af2-channel": "postWhere", "af4-content": "video", "af5-links": "linkInBio", "af6-post": "scheduler", "on-post": "scheduler",
    "dg1-platform": "digitalPlatform", "dg1-shopify-app": "digitalPlatform", "dg2-idea": "etsyResearch", "dg3-make": "digitalMake", "dg4-list": "mockups", "dg6-promote": "postWhere", "dg7-review": "bookkeeping",
    "rs1-account": "resellMarket", "rs2-research": "resellResearch", "rs3-source": "sourcing", "rs4-list": "listingTools", "on-list": "listingTools", "rs5-ship": "shipping", "rs7-review": "bookkeeping",
    "fr1-account": "freelancePlatform", "fr3-portfolio": "portfolio", "fr5-outreach": "freelancePlatform", "fr6-deliver": "invoicing", "fr7-review": "bookkeeping", "on-pitch": "freelancePlatform",
    "cr2-niche": "contentResearch", "cr3-batch": "video", "on-create": "video", "cr4-post": "scheduler", "cr6-income": "linkInBio",
    "co1-platform": "coursePlatform", "co2-validate": "forms", "co3-outline": "writing", "co4-record": "recording", "co6-launch": "emailTool",
    "bk1-account": "bookPlatform", "bk2-idea": "bookResearch", "bk3-write": "writing", "bk4-cover": "bookFormat",
    "nl1-platform": "newsletter", "nl3-issues": "writing", "nl4-signup": "newsletter", "nl5-promote": "postWhere",
    "fb2-research": "fbaResearch", "fb3-supplier": "manufacturers", "fb5-listing": "photos",
    "hm2-product": "etsyResearch", "hm4-photos": "photos", "hm5-list": "handmadeSell", "hm6-promote": "postWhere", "hm7-review": "bookkeeping",
  };
  function choiceFor(stepId, p) { const c = STEP_CHOICE[stepId]; const g = typeof c === "function" ? c(p || {}) : c; return g && CHOICES[g] ? g : null; }
  function optItems(g, p) {
    const country = (p && p.country) || "other";
    return CHOICES[g].items.map((id) => ({ id, name: O[id][0], url: O[id][1], desc: O[id][2], region: O[id][3] || null }))
      .filter((it) => !it.region || country === "other" || it.region === country);
  }
  const chosen = (g) => { const c = st.profile && st.profile.choices && st.profile.choices[g]; return c && CHOICES[g] && CHOICES[g].items.includes(c) ? c : null; };
  const chosenItem = (g) => { const c = chosen(g); return c ? { id: c, name: O[c][0], url: O[c][1] } : null; };
  async function setChoice(g, id) {
    if (!st.profile) return;
    const choices = Object.assign({}, st.profile.choices || {});
    if (id) choices[g] = id; else delete choices[g];
    const p = { ...st.profile, choices };
    st.profile = p; // show it straight away; the saved copy follows
    await saveProfile(p);
  }
  // Groups this plan uses, in the order its steps come up.
  function planChoiceGroups(p) {
    const seen = new Set(), out = [];
    applicable(p).slice().sort((a, b) => (a.day - b.day) || GUIDE.indexOf(a) - GUIDE.indexOf(b)).forEach((s) => { const g = choiceFor(s.id, p); if (g && !seen.has(g)) { seen.add(g); out.push(g); } });
    return out;
  }
  // The list of options with Open and Use buttons. after() redraws whatever holds it.
  function choiceList(g, p, after) {
    const grp = CHOICES[g]; const cur = chosen(g); const def = grp.def ? grp.def(p) : null;
    const wrap = el("div", "choice"); wrap.setAttribute("role", "group"); wrap.setAttribute("aria-label", grp.ask);
    optItems(g, p).forEach((it) => {
      const row = el("div", "choice-row" + (cur === it.id ? " picked" : ""));
      const info = el("div", "choice-info");
      const top = el("div", "row-gap"); top.style.gap = "6px";
      top.append(el("b", null, it.name));
      if (cur === it.id) top.append(el("span", "pill ok", "Your choice"));
      if (def === it.id) top.append(el("span", "pill neutral", "This plan's steps use it"));
      if (it.region) top.append(el("span", "tag", it.region === "us" ? "US only" : "UK only"));
      info.append(top, el("span", "small muted", it.desc));
      const act = el("div", "row-gap");
      act.append(extLink({ label: "Open", url: it.url, name: it.name }));
      if (!readOnly && st.profile) {
        const on = cur === it.id;
        const b = el("button", "btn sm" + (on ? "" : " primary"), on ? "Chosen" : "Use this"); b.type = "button";
        b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-label", (on ? "Chosen: " : "Use ") + it.name + (on ? ". Press to clear" : ""));
        b.onclick = async () => {
          const prev = cur;
          await setChoice(g, on ? null : it.id);
          toast(on ? "Cleared your choice." : "Saved: you'll use " + it.name + ".", { undo: async () => { await setChoice(g, prev); if (after) after(); } });
          if (after) after();
        };
        act.append(b);
      }
      row.append(info, act); wrap.append(row);
    });
    const notes = [];
    if (grp.note) notes.push(grp.note);
    if (grp.channel && cur && def && cur !== def) notes.push("Your plan's steps are written for " + O[def][0] + ". To get steps for " + O[cur][0] + " instead, change your answers.");
    if (notes.length) {
      const n = el("div", "small muted choice-note"); notes.forEach((t) => n.append(el("p", null, t)));
      if (grp.channel && cur && def && cur !== def && MODEL_CHANNEL_HAS(p, cur)) { const b = el("button", "btn sm", "Change answers"); b.type = "button"; b.onclick = () => { ["guideDlg", "readDlg"].forEach((id) => { if ($("#" + id).open) $("#" + id).close(); }); startSetup(true); setTab("plan"); }; n.append(b); }
      wrap.append(n);
    }
    return wrap;
  }
  // Is the chosen option also one of this model's "Where will you do it?" answers?
  const CHANNEL_OF = Object.fromEntries(Object.entries(DEF_BY_CHANNEL).map(([k, v]) => [v, k]));
  const MODEL_CHANNEL_HAS = (p, optId) => { const ch = optId === "shopDigital" ? "shopify" : CHANNEL_OF[optId]; return !!ch && (CHANNELS[p.model] || []).some((c) => c[0] === ch); };
  function openChoice(g) {
    const p = st.profile || {};
    const box = $("#readBody"); box.textContent = "";
    box.append(el("span", "label", "Your tools · " + CHOICES[g].title));
    const h = el("h2", null, CHOICES[g].ask); h.tabIndex = -1; box.append(h);
    box.append(el("p", "small muted", "Pick the one you'll use; the plan's steps will show it. Sites open in a new tab."));
    box.append(choiceList(g, p, () => openChoice(g)));
    const act = el("div", "actions"); act.append(el("span"));
    const c = el("button", "btn", "Close"); c.type = "button"; c.onclick = () => $("#readDlg").close(); act.append(c); box.append(act);
    if (!$("#readDlg").open) { $("#readDlg").showModal(); h.focus({ preventScroll: true }); }
  }
  function toolsCard(p) {
    const groups = planChoiceGroups(p); if (!groups.length) return null;
    const card = el("details", "card tools-card"); card.open = lsGet("dd-tools-open", true);
    card.addEventListener("toggle", () => lsSet("dd-tools-open", card.open));
    const n = groups.filter((g) => chosen(g)).length;
    const sum = el("summary"); sum.append(el("b", null, "Your tools and sites"), el("span", "small muted", " · " + n + " of " + groups.length + " chosen"));
    card.append(sum);
    card.append(el("p", "small muted", "Each step can be done with different sites and platforms. Choose the ones you'll use and the steps will point to them."));
    const list = el("div", "tool-choices");
    groups.forEach((g) => {
      const r = el("div", "tool-choice");
      const it = chosenItem(g);
      const left = el("div"); left.append(el("span", "label", CHOICES[g].title));
      if (it) { const d = el("div"); d.append(extLink({ label: it.name, url: it.url, name: it.name }, "site-link")); left.append(d); }
      else left.append(el("div", "small muted", "Not chosen yet"));
      const b = el("button", "btn sm", it ? "Change" : "Choose"); b.type = "button"; b.setAttribute("aria-label", (it ? "Change " : "Choose ") + CHOICES[g].title.toLowerCase()); b.onclick = () => openChoice(g);
      r.append(left, b); list.append(r);
    });
    card.append(list);
    return card;
  }

  // ----- Today: the home screen. One clear next step (like a setup guide),
  // what's due, a quick add, and shortcuts for the plan.
  const MODEL_TOOLS = {
    supplier: ["profit", "evaluate", "trends", "ads"], pod: ["profit", "price", "describe", "trends"], affiliate: ["affiliate", "hooks", "trends"],
    digital: ["profit", "price", "describe"], resell: ["maxbuy", "compare", "profit"], freelance: ["rate", "compare", "helper"],
    creator: ["creator", "hooks", "trends"], courses: ["recurring", "price", "describe"], books: ["royalty", "describe", "trends"],
    newsletter: ["recurring", "hooks", "helper"], fba: ["profit", "evaluate", "price"], handmade: ["profit", "price", "describe"],
  };
  const TOOL_NAME = () => Object.fromEntries(TOOL_LIST.map((t) => [t.id, t.name]));
  function renderToday() {
    const wrap = el("div"); wrap.style.display = "grid"; wrap.style.gap = "18px";
    if (!st.profileLoaded || !st.tasksLoaded) { wrap.append(skeleton()); return wrap; }
    const p = st.profile;
    if (!p) { wrap.append(welcomeCard()); return wrap; }
    const td = today();
    const order = planOrder();
    const oneOff = order.filter((t) => !STEP[t.step].ongoing);
    const done = oneOff.filter((t) => t.status === "done").length;
    const dayN = Math.floor((parse(td) - parse(p.start)) / 864e5) + 1;

    const head = el("div", "hello");
    const h = el("div"); h.style.display = "grid"; h.style.gap = "4px";
    const nm = displayName().split(/\s+/)[0];
    h.append(el("h2", null, greeting() + (nm ? ", " + nm : "")), el("span", "small muted", parse(td).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + " · " + curBiz().name + " · " + MODEL_NAME[p.model] + " on " + (CHANNEL_NAME[p.channel] || "")));
    head.append(h); wrap.append(head);
    wrap.append(trackCard(p, oneOff, dayN, renderAnimate));

    const grid = el("div", "today-grid");
    const left = el("div", "col-stack"), right = el("div", "col-stack");

    // Up next
    const n = oneOff.find((t) => t.status !== "done");
    const next = el("section", "card next");
    if (n) {
      const s = STEP[n.step];
      next.append(el("span", "up-tag", "Up next · Day " + n.day), el("span", "label", AREA[n.area] || ""));
      next.append(el("h3", null, n.title));
      const plain = el("div"); plain.innerHTML = val(s.body, p) || "";
      plain.querySelectorAll("p, li, br, tr, h3, h4").forEach((x) => x.append(" "));
      const txt = (plain.textContent || "").replace(/\s+/g, " ").trim();
      if (txt) next.append(el("p", "small muted", txt.length > 180 ? txt.slice(0, 177).replace(/\s+\S*$/, "") + "…" : txt));
      const row = el("div", "row-gap");
      const open = el("button", "btn primary", "Start this step"); open.type = "button"; open.onclick = () => openGuide(n);
      const dn = el("button", "btn", "Mark done"); dn.type = "button"; dn.onclick = () => { burst(dn); setStatus(n, "done"); };
      row.append(open, dn);
      const ng = choiceFor(n.step, p);
      if (ng) {
        const it = chosenItem(ng);
        if (it) row.append(extLink({ label: "Open " + it.name, url: it.url, name: it.name }, "btn"));
        else { const cb = el("button", "btn", "Choose what you'll use"); cb.type = "button"; cb.setAttribute("aria-label", CHOICES[ng].ask); cb.onclick = () => openGuide(n, { toChoice: true, focusChoice: true, refresh: false }); row.append(cb); }
      }
      if (n.due && n.due < td) row.append(el("span", "pill late", "Planned for " + fmtDue(n.due)));
      next.append(row);
    } else {
      next.append(el("span", "label", "7-day plan"), el("h3", null, oneOff.length ? "You've finished every step of your plan" : "Your plan has no steps yet"));
      next.append(el("p", "small muted", oneOff.length ? "Keep the weekly tasks going, check your numbers in Tools, and add your own tasks as the work grows." : "Rebuild it from your answers on the Plan tab."));
      const row = el("div", "row-gap");
      const b = el("button", "btn primary", oneOff.length ? "See weekly tasks" : "Open Plan"); b.type = "button"; b.onclick = () => setTab("plan"); row.append(b);
      next.append(row);
    }
    left.append(next);

    // Due today and overdue
    const dueSec = el("section", "card");
    const todays = dayN >= 1 && dayN <= 7 ? oneOff.filter((t) => t.day === dayN && (!n || t.id !== n.id)) : [];
    const shownIds = new Set(todays.map((t) => t.id).concat(n ? [n.id] : []));
    const dueList = st.tasks.filter((t) => t.status !== "done" && t.due && t.due <= td && !shownIds.has(t.id)).sort(sortTasks);
    const dh = el("div", "section-head"); dh.append(el("h3", null, "Due today"), el("span", "small muted", dueList.length ? dueList.length + " open" : ""));
    dueSec.append(dh);
    if (dueList.length) { const rows = el("div", "rows"); dueList.slice(0, 8).forEach((t) => rows.append(row(t))); dueSec.append(rows); if (dueList.length > 8) { const more = el("button", "btn sm", "See all " + dueList.length); more.type = "button"; more.onclick = () => { st.ui.quick = null; setTab("tasks"); }; dueSec.append(more); } }
    else dueSec.append(el("p", "small muted", todays.length ? "Nothing else is due. Your plan steps for today are below." : "Nothing else is due today. Work on the next step above, or add something below."));
    // Quick add
    const qf = el("form", "quick"); qf.autocomplete = "off";
    const qi = el("input"); qi.type = "text"; qi.id = "quickAdd"; qi.placeholder = "Add a task: “call supplier tomorrow !high”"; qi.setAttribute("aria-label", "Add a task"); qi.setAttribute("aria-describedby", "quickPreview"); qi.setAttribute("aria-keyshortcuts", "N");
    const qb = el("button", "btn primary", "Add"); qb.type = "submit";
    qf.append(qi, qb);
    const qp = el("div", "preview small quick-hint"); qp.id = "quickPreview"; qp.setAttribute("aria-live", "polite");
    const upd = () => { const r = parseQuick(qi.value); quickPreview(qp, r, { due: td }); if (!qi.value.trim()) { qp.textContent = ""; qp.append(el("span", "muted", "Due today unless you type a day: tomorrow, fri, next week, in 3 days, oct 20. Add !high or #orders.")); } };
    qi.addEventListener("input", upd); upd();
    qf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = parseQuick(qi.value); if (!r.title) { qi.focus(); return; }
      qi.value = ""; upd();
      const id = "custom-" + newId();
      const due = r.due || td;
      await putTask(id, { title: r.title, area: r.area || lsGet("dd-lastArea", "orders"), prio: r.prio || "med", due, status: "todo", product: "", supplier: "", ref: "", notes: "", repeat: "none", createdAt: Date.now(), doneAt: null, source: "custom" });
      toast("Added, due " + fmtDue(due).toLowerCase() + ".", { undo: () => delTask(id) });
      setTimeout(() => { const x = $("#quickAdd"); if (x) x.focus(); }, 0);
    });
    dueSec.append(qf, qp);
    left.append(dueSec);

    // Rest of today's plan steps (checklist)
    if (todays.length) {
      const cl = el("section", "card");
      const left2 = todays.filter((t) => t.status !== "done").length;
      const ch = el("div", "section-head"); ch.append(el("h3", null, "Also on day " + dayN + " of your plan"), el("span", "small muted", left2 ? left2 + " to do" : "All done"));
      cl.append(ch);
      const list = el("div", "checklist"); todays.forEach((t) => list.append(stepRow(t))); cl.append(list);
      left.append(cl);
    }

    // This week: activity, gentle (no streak to lose)
    const wk = el("section", "card");
    wk.append(el("h3", null, "Your last 7 days"));
    const doneDays = {}; st.tasks.forEach((t) => { if (t.status === "done" && t.doneAt) doneDays[t.doneAt] = (doneDays[t.doneAt] || 0) + 1; });
    const dots = el("div", "dots"); let active = 0;
    for (let i = 6; i >= 0; i--) {
      const d = addDays(td, -i); const c = doneDays[d] || 0; if (c) active++;
      const dot = el("div", "dot" + (c ? " on" : "") + (i === 0 ? " now" : ""));
      const label = parse(d).toLocaleDateString(undefined, { weekday: "short" });
      dot.setAttribute("role", "img"); dot.setAttribute("aria-label", fmtDay(d) + ": " + (c ? c + " task" + (c > 1 ? "s" : "") + " done" : "nothing marked done"));
      dot.title = dot.getAttribute("aria-label");
      dot.append(el("i"), el("span", null, label.slice(0, 2)));
      dots.append(dot);
    }
    wk.append(dots, el("p", "small muted", active ? "You finished tasks on " + active + " of the last 7 days. Any day you finish one counts." : "Finish any task and today lights up. Small steps add up."));
    right.append(wk);

    // Shortcuts for this plan
    const sc = el("section", "card");
    sc.append(el("h3", null, "Shortcuts for your plan"));
    const tn = TOOL_NAME();
    const tg = el("div", "shortcut-grid");
    (MODEL_TOOLS[p.model] || ["profit"]).forEach((id) => { const b = el("button", "btn sm", tn[id]); b.type = "button"; b.onclick = () => openTool(id); tg.append(b); });
    sc.append(tg);
    const sites = TOOLS.filter((t) => t.fit(p)).slice(0, 4);
    if (sites.length) { const sg = el("div", "shortcut-grid"); sites.forEach((t) => sg.append(extLink({ label: t.name, url: t.url, name: t.name }))); sc.append(sg); }
    const nextGo = n ? val(STEP[n.step].action, p) : null;
    const lesson = LESSONS.find((l) => l.fit(p) && !st.learn["lesson-" + l.id] && !(nextGo && nextGo.go === "lesson:" + l.id));
    if (lesson) { const lb = el("button", "btn sm", "Read: " + lesson.title); lb.type = "button"; lb.onclick = () => openLesson(lesson.id); sc.append(el("span", "label", "Lesson for your plan"), lb); }
    right.append(sc);

    const tip = el("p", "small muted"); tip.innerHTML = "Press <kbd>Ctrl</kbd> <kbd>K</kbd> (<kbd>⌘</kbd> <kbd>K</kbd> on Mac) to jump anywhere, or <kbd>N</kbd> to add a task.";
    tip.classList.add("hide-sm"); right.append(tip);

    grid.append(left, right); wrap.append(grid);
    return wrap;
  }
  function welcomeCard() {
    const c = el("section", "card welcome");
    c.append(el("span", "up-tag", "Welcome to Startline"));
    c.append(el("h2", null, "Start making money online, one step at a time"));
    c.append(el("p", null, "Answer five quick questions and you'll get a 7-day plan for how you want to earn: dropshipping, print-on-demand, affiliate marketing, digital products, reselling, freelancing, content, courses, books, newsletters, Amazon FBA or handmade. Each step explains what to do, links to the right site and shows its sources."));
    c.append(el("p", "small muted", "No guide can promise income in a week. What this app can do is show you the real steps, the real fees and your numbers before you spend money."));
    const row = el("div", "row-gap");
    const go1 = el("button", "btn primary", "Build my plan"); go1.type = "button"; go1.onclick = () => { startSetup(false); setTab("plan"); };
    const go2 = el("button", "btn", "Compare the 12 ways to earn"); go2.type = "button"; go2.onclick = () => { startSetup(false); setup.step = 1; setup.compare = true; setTab("plan"); };
    const go3 = el("button", "btn", "Just open the calculators"); go3.type = "button"; go3.onclick = () => openTool("profit");
    row.append(go1, go2, go3); c.append(row);
    const steps = el("ol", "small"); steps.style.margin = "0"; steps.style.paddingLeft = "1.2em";
    ["Pick how you'll earn and where.", "Follow one step at a time; each opens a short guide with the official links.", "Use the calculators to check profit before you spend.", "Track your own tasks alongside the plan."].forEach((t) => steps.append(el("li", null, t)));
    c.append(steps);
    return c;
  }

  // ----- Guide dialog
  // Plan steps in the order the plan shows them: day by day, then the weekly ones.
  function planOrder() {
    const planTasks = st.tasks.filter((t) => t.source === "plan" && STEP[t.step]);
    const oneOff = planTasks.filter((t) => !STEP[t.step].ongoing).sort((a, b) => (a.day - b.day) || GUIDE.indexOf(STEP[a.step]) - GUIDE.indexOf(STEP[b.step]));
    const ongoing = planTasks.filter((t) => STEP[t.step].ongoing && t.status !== "done").sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    return oneOff.concat(ongoing);
  }
  const nextStep = () => planOrder().find((t) => t.status !== "done" && !STEP[t.step].ongoing) || null;
  function openGuide(t, opts = {}) {
    const s = STEP[t.step]; const p = st.profile || {};
    if (!s) { openEdit(t); return; }
    const order = planOrder(); const idx = order.findIndex((x) => x.id === t.id);
    const one = order.filter((x) => !STEP[x.step].ongoing); const oi = one.findIndex((x) => x.id === t.id);
    const box = $("#guideBody"); box.textContent = "";
    const top = el("div", "row-gap"); top.style.justifyContent = "space-between";
    top.append(el("span", "label", (s.ongoing ? "Weekly · repeats " + s.repeat : "Day " + s.day) + " · " + (AREA[s.area] || "") + (oi >= 0 ? " · Step " + (oi + 1) + " of " + one.length : "")));
    if (t.status === "done") top.append(el("span", "pill ok", "Done"));
    box.append(top);
    box.append(el("h2", null, t.title));
    box.append(html("div", "prose", val(s.body, p) || ""));
    const action = val(s.action, p);
    const g = choiceFor(s.id, p);
    // Links that are also listed as choices below are shown only there.
    const optUrls = new Set(g ? optItems(g, p).map((x) => x.url) : []);
    const links = (val(s.links, p) || []).filter((x) => !optUrls.has(x.url));
    const mine = g ? chosenItem(g) : null;
    if (action || links.length || mine) {
      const l = el("div", "links");
      if (mine) l.append(extLink({ label: "Open " + mine.name, url: mine.url, name: mine.name }, "btn primary sm"));
      if (action) { const b = el("button", "btn sm" + (mine ? "" : " primary"), action.label); b.type = "button"; b.onclick = () => go(action.go); l.append(b); }
      links.forEach((x) => l.append(extLink(x)));
      box.append(l);
      if (links.length || mine) box.append(el("p", "small muted", "Outside sites open in a new tab; they can't be shown inside this page."));
    }
    if (g) {
      const ch = el("section", "choice-head"); ch.id = "guideChoice";
      ch.append(el("h3", null, CHOICES[g].ask), el("span", "small muted", "Other sites and platforms that do this step. Choose the one you'll use and your plan will point to it."));
      ch.append(choiceList(g, p, () => { const x = st.tasks.find((y) => y.id === t.id) || t; openGuide(x, { toChoice: true }); }));
      box.append(ch);
    }
    const src = sourcesBlock(val(s.src, p)); if (src) box.append(src);
    const act = el("div", "actions");
    const left = el("div");
    const prev = el("button", "btn", "← Previous"); prev.type = "button"; prev.disabled = idx <= 0; prev.onclick = () => openGuide(order[idx - 1]);
    const nxt = el("button", "btn", "Next →"); nxt.type = "button"; nxt.disabled = idx < 0 || idx >= order.length - 1; nxt.onclick = () => openGuide(order[idx + 1]);
    left.append(prev, nxt);
    if (!readOnly) { const ed = el("button", "btn", "Edit"); ed.type = "button"; ed.onclick = () => { $("#guideDlg").close(); openEdit(t); }; left.append(ed); }
    const right = el("div");
    const close = el("button", "btn", "Close"); close.type = "button"; close.onclick = () => $("#guideDlg").close();
    right.append(close);
    if (!readOnly) {
      if (t.status === "done") {
        const un = el("button", "btn", "Mark not done"); un.type = "button"; un.onclick = () => { $("#guideDlg").close(); toggleDone(t); }; right.append(un);
      } else {
        const dn = el("button", "btn primary", "Done & next"); dn.type = "button";
        dn.onclick = async () => {
          const steps = planOrder().filter((x) => !STEP[x.step].ongoing);
          const i2 = steps.findIndex((x) => x.id === t.id);
          const n = steps.slice(i2 + 1).concat(steps.slice(0, Math.max(0, i2))).find((x) => x.id !== t.id && x.status !== "done");
          const undo = await setStatus(t, "done", { quiet: true });
          if (n && !s.ongoing) { toast("Marked done. Next: " + n.title, { undo }); openGuide(st.tasks.find((x) => x.id === n.id) || n); }
          else { $("#guideDlg").close(); toast(s.ongoing ? "Marked done." : "Marked done. That was the last step of your 7-day plan.", { undo }); }
        };
        right.append(dn);
      }
    }
    act.append(left, right); box.append(act);
    const keep = $("#guideDlg").scrollTop;
    if (!$("#guideDlg").open) $("#guideDlg").showModal();
    if (opts.toChoice && $("#guideChoice")) { if (opts.refresh !== false) $("#guideDlg").scrollTop = keep; if (opts.focusChoice) { $("#guideChoice").scrollIntoView({ block: "start" }); const b = $("#guideChoice button.primary") || $("#guideChoice a"); if (b) b.focus({ preventScroll: true }); } return; }
    box.scrollTop = 0; $("#guideDlg").scrollTop = 0;
    const h = box.querySelector("h2"); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }

  // ----- Quick add: natural dates, priority and area in the task text.
  // "email supplier tomorrow !high #orders" → due tomorrow, high, Orders.
  const WD = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };
  const MON = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  function parseQuick(raw) {
    let s = " " + String(raw || "").replace(/\s+/g, " ") + " ";
    const r = { title: "", due: null, prio: null, area: null };
    const td = today();
    const take = (re, fn) => { const m = s.match(re); if (!m) return false; if (fn(m) === false) return false; s = s.slice(0, m.index) + " " + s.slice(m.index + m[0].length); return true; };
    take(/\s(?:!(high|hi|h|medium|med|m|low|lo|l|1|2|3)|p([123]))(?=\s)/i, (m) => {
      const v = (m[1] || m[2]).toLowerCase();
      r.prio = /^(1|h|hi|high)$/.test(v) ? "high" : /^(3|l|lo|low)$/.test(v) ? "low" : "med";
    });
    take(/\s#([a-z&-]{2,})(?=\s)/i, (m) => {
      const w = m[1].toLowerCase();
      const hit = AREAS.find(([k, l]) => k.startsWith(w) || l.toLowerCase().startsWith(w));
      if (!hit) return false; r.area = hit[0];
    });
    const pre = "\\s(?:(?:by|on|due)\\s+)?";
    const dateRules = [
      [new RegExp(pre + "(\\d{4})-(\\d{2})-(\\d{2})(?=\\s)"), (m) => { const d = new Date(+m[1], +m[2] - 1, +m[3]); if (d.getMonth() !== +m[2] - 1) return false; r.due = iso(d); }],
      [/\s(?:in\s+)(\d{1,3})\s*(d|days?|w|wks?|weeks?)(?=\s)/i, (m) => { const n = +m[1]; r.due = addDays(td, /^w/i.test(m[2]) ? n * 7 : n); }],
      [/\snext\s+week(?=\s)/i, () => { const d = parse(td); const k = (8 - d.getDay()) % 7 || 7; r.due = addDays(td, k); }],
      [new RegExp(pre + "(today|tonight|tod)(?=\\s)", "i"), () => { r.due = td; }],
      [new RegExp(pre + "(tomorrow|tmrw|tmr)(?=\\s)", "i"), () => { r.due = addDays(td, 1); }],
      [new RegExp(pre + "(?:next\\s+)?(sunday|sun|monday|mon|tuesday|tues|tue|wednesday|wed|thursday|thurs|thur|thu|friday|fri|saturday|sat)(?=\\s)", "i"), (m) => {
        const want = WD[m[1].toLowerCase()]; const cur = parse(td).getDay(); r.due = addDays(td, ((want - cur + 7) % 7) || 7);
      }],
      [new RegExp(pre + "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?=\\s)", "i"), (m) => monthDay(m[1], m[2])],
      [new RegExp(pre + "(\\d{1,2})(?:st|nd|rd|th)?\\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?=\\s)", "i"), (m) => monthDay(m[2], m[1])],
    ];
    function monthDay(mon, day) {
      const mi = MON.indexOf(mon.slice(0, 3).toLowerCase()), dd = +day, y = parse(td).getFullYear();
      let d = new Date(y, mi, dd); if (d.getMonth() !== mi) return false;
      if (iso(d) < td) d = new Date(y + 1, mi, dd);
      r.due = iso(d);
    }
    for (const [re, fn] of dateRules) if (take(re, fn)) break;
    r.title = s.replace(/\s+/g, " ").trim();
    return r;
  }
  function quickPreview(box, r, fallback = {}) {
    box.textContent = "";
    const bits = [];
    const due = r.due || fallback.due; const prio = r.prio || fallback.prio; const area = r.area || fallback.area;
    if (due) bits.push(["Due " + fmtDue(due).replace(/^(Today|Tomorrow|Yesterday)$/, (x) => x.toLowerCase()), !!r.due]);
    if (prio) bits.push([{ high: "High", med: "Medium", low: "Low" }[prio] + " priority", !!r.prio]);
    if (area) bits.push([AREA[area], !!r.area]);
    bits.forEach(([t, fromText]) => box.append(el("span", fromText ? "pill doing" : "pill neutral", t)));
  }

  // ----- Tasks tab
  function matches(t) {
    const u = st.ui;
    if (u.area !== "all" && t.area !== u.area) return false;
    if (u.q) {
      const hay = [t.title, t.product, t.supplier, t.ref, t.notes].join(" ").toLowerCase();
      if (!hay.includes(u.q.toLowerCase())) return false;
    }
    const td = today();
    if (u.quick === "late") return t.status !== "done" && t.due && t.due < td;
    if (u.quick === "today") return t.status !== "done" && t.due === td;
    if (u.quick === "waiting") return t.status === "waiting";
    if (u.quick === "doneweek") return t.status === "done" && t.doneAt && t.doneAt >= addDays(td, -6);
    return true;
  }
  const sortTasks = (a, b) => (a.due || "9999").localeCompare(b.due || "9999") || (PRIO_RANK[a.prio] ?? 1) - (PRIO_RANK[b.prio] ?? 1) || (a.createdAt || 0) - (b.createdAt || 0);

  function renderTasks() {
    const u = st.ui; const td = today();
    const wrap = el("div"); wrap.style.display = "grid"; wrap.style.gap = "16px";
    const open = st.tasks.filter((t) => t.status !== "done");
    const stats = el("section", "stats"); stats.setAttribute("aria-label", "Summary");
    [["late", "late", "Overdue", open.filter((t) => t.due && t.due < td).length],
     ["today", "warn", "Due today", open.filter((t) => t.due === td).length],
     ["waiting", "", "Waiting on supplier", st.tasks.filter((t) => t.status === "waiting").length],
     ["doneweek", "ok", "Done last 7 days", st.tasks.filter((t) => t.status === "done" && t.doneAt && t.doneAt >= addDays(td, -6)).length]]
      .forEach(([k, cls, label, n]) => {
        const b = el("button", "stat " + cls); b.type = "button"; b.setAttribute("aria-pressed", String(u.quick === k));
        b.append(el("span", "label", label), el("b", null, String(n)));
        b.onclick = () => { u.quick = u.quick === k ? null : k; if (k === "waiting") u.view = "list"; render(); };
        stats.append(b);
      });
    wrap.append(stats);

    if (!readOnly) {
      const f = el("form", "add"); f.autocomplete = "off";
      const ti = el("input"); ti.type = "text"; ti.id = "addTitle"; ti.placeholder = "Add a task, e.g. “email supplier fri !high”"; ti.setAttribute("aria-label", "Task"); ti.setAttribute("aria-describedby", "addPreview"); ti.setAttribute("aria-keyshortcuts", "N");
      const ar = el("select"); ar.id = "addArea"; ar.setAttribute("aria-label", "Area"); fill(ar, AREAS); ar.value = lsGet("dd-lastArea", "orders");
      const pr = el("select"); pr.id = "addPrio"; pr.setAttribute("aria-label", "Priority"); fill(pr, [["high", "High"], ["med", "Medium"], ["low", "Low"]]); pr.value = "med";
      const du = el("input"); du.type = "date"; du.id = "addDue"; du.setAttribute("aria-label", "Due date");
      const sb = el("button", "btn primary", "Add"); sb.type = "submit";
      const pv = el("div", "preview small"); pv.id = "addPreview"; pv.style.gridColumn = "1 / -1"; pv.setAttribute("aria-live", "polite");
      f.append(ti, ar, pr, du, sb, pv);
      const upd = () => { const q = parseQuick(ti.value); quickPreview(pv, q); if (!pv.children.length) pv.append(el("span", "muted", "Tip: type a day (today, fri, next week, oct 20), !high or #listings and they're filled in.")); };
      ti.addEventListener("input", upd); upd();
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const q = parseQuick(ti.value);
        if (!q.title) { ti.focus(); return; }
        const area = q.area || ar.value, prio = q.prio || pr.value, due = q.due || du.value || null;
        lsSet("dd-lastArea", ar.value);
        ti.value = ""; upd();
        const id = "custom-" + newId();
        await putTask(id, { title: q.title, area, prio, due, status: "todo", product: "", supplier: "", ref: "", notes: "", repeat: "none", createdAt: Date.now(), doneAt: null, source: "custom" });
        toast("Added" + (due ? ", due " + fmtDue(due).toLowerCase() : "") + ".", { undo: () => delTask(id) });
        setTimeout(() => { const x = $("#addTitle"); if (x) x.focus(); }, 0);
      });
      wrap.append(f);
    }

    const bar = el("div", "bar");
    const chips = el("div", "chips"); chips.setAttribute("role", "group"); chips.setAttribute("aria-label", "Filter by area");
    const counts = {}; open.forEach((t) => (counts[t.area] = (counts[t.area] || 0) + 1));
    [["all", "All", open.length], ...AREAS.filter(([k]) => counts[k]).map(([k, v]) => [k, v, counts[k]])].forEach(([k, v, n]) => {
      const b = el("button", "chip"); b.type = "button"; b.setAttribute("aria-pressed", String(u.area === k));
      b.append(el("span", null, v), el("span", "n", String(n)));
      b.onclick = () => { u.area = k; saveUi(); render(); };
      chips.append(b);
    });
    const tools = el("div", "tools");
    const sea = el("input"); sea.type = "search"; sea.className = "search"; sea.id = "taskSearch"; sea.placeholder = "Search tasks"; sea.value = u.q; sea.setAttribute("aria-label", "Search tasks");
    let qt; sea.oninput = () => { clearTimeout(qt); qt = setTimeout(() => { u.q = sea.value.trim(); const pos = sea.selectionStart; render(); const s2 = $("#taskSearch"); if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); } }, 200); };
    const seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "View");
    [["list", "List"], ["board", "Board"]].forEach(([k, l]) => { const b = el("button", null, l); b.type = "button"; b.setAttribute("aria-pressed", String(u.view === k)); b.onclick = () => { u.view = k; saveUi(); render(); }; seg.append(b); });
    const sd = el("label", "toggle"); const cb = el("input"); cb.type = "checkbox"; cb.id = "showDone"; cb.checked = u.showDone; cb.onchange = () => { u.showDone = cb.checked; saveUi(); render(); }; sd.append(cb, document.createTextNode("Show done"));
    tools.append(sea, seg, sd);
    bar.append(chips, tools);
    wrap.append(bar);

    if (!st.tasksLoaded) { wrap.append(el("p", "muted", "Loading tasks…")); return wrap; }
    if (!st.tasks.length) {
      const e = el("div", "empty");
      e.append(el("h3", null, "No tasks yet"), el("p", null, "Answer five questions on the Plan tab to get your step-by-step tasks, or add your own above."));
      const b = el("button", "btn primary", "Go to Plan"); b.type = "button"; b.onclick = () => setTab("plan"); e.append(b);
      wrap.append(e); return wrap;
    }
    const visible = st.tasks.filter(matches).sort(sortTasks);
    wrap.append(u.view === "board" ? board(visible) : list(visible));
    return wrap;
  }

  function list(visible) {
    const td = today(), wk = addDays(td, 7);
    const shown = visible.filter((t) => st.ui.showDone || st.ui.quick === "doneweek" || t.status !== "done");
    const buckets = [
      ["late", "Overdue", (t) => t.status !== "done" && t.due && t.due < td],
      ["today", "Today", (t) => t.status !== "done" && t.due === td],
      ["week", "Next 7 days", (t) => t.status !== "done" && t.due > td && t.due <= wk],
      ["later", "Later", (t) => t.status !== "done" && t.due > wk],
      ["none", "No date", (t) => t.status !== "done" && !t.due],
      ["done", "Done", (t) => t.status === "done"],
    ];
    const wrap = el("div", "groups");
    buckets.forEach(([key, name, fn]) => {
      const items = shown.filter(fn);
      if (key === "done") items.sort((a, b) => (b.doneAt || "").localeCompare(a.doneAt || ""));
      if (!items.length) return;
      const g = el("section", "group " + key);
      const h = el("h3"); h.append(el("span", null, name), el("span", "n", String(items.length)));
      const rows = el("div", "rows"); items.forEach((t) => rows.append(row(t)));
      g.append(h, rows); wrap.append(g);
    });
    if (!wrap.children.length) {
      const e = el("div", "empty"); e.append(el("p", null, "Nothing matches these filters."));
      const b = el("button", "btn", "Clear filters"); b.type = "button";
      b.onclick = () => { st.ui.area = "all"; st.ui.quick = null; st.ui.q = ""; saveUi(); render(); };
      e.append(b); return e;
    }
    return wrap;
  }
  function metaLine(t) {
    const m = el("div", "meta");
    const p = el("span", "prio " + (t.prio || "med")); p.title = "Priority: " + ({ high: "High", med: "Medium", low: "Low" }[t.prio] || "Medium"); m.append(p);
    m.append(el("span", "tag", AREA[t.area] || "Other"));
    if (t.source === "plan") m.append(el("span", "tag guide", t.day && !(STEP[t.step] && STEP[t.step].ongoing) ? "Plan · Day " + t.day : "Plan"));
    if (t.status === "doing") m.append(el("span", "pill doing", "In progress"));
    if (t.status === "waiting") m.append(el("span", "pill waiting", "Waiting on supplier"));
    if (t.product) m.append(el("span", "ref", t.product));
    if (t.ref) m.append(el("span", "ref", t.ref));
    if (t.supplier) m.append(el("span", null, t.supplier));
    if (t.repeat && t.repeat !== "none") m.append(el("span", null, "↻ " + t.repeat));
    return m;
  }
  function dueEl(t) {
    const td = today(); const d = el("span", "due", fmtDue(t.due));
    if (t.status !== "done" && t.due && t.due < td) d.classList.add("late");
    else if (t.status !== "done" && t.due === td) d.classList.add("today");
    return d;
  }
  function row(t) {
    const r = el("div", "row" + (t.status === "done" ? " done" : ""));
    const c = el("button", "check"); c.type = "button"; c.setAttribute("role", "checkbox");
    c.setAttribute("aria-checked", String(t.status === "done")); c.setAttribute("aria-label", "Mark done: " + t.title);
    c.innerHTML = CHECK_SVG; c.disabled = readOnly; c.onclick = () => { if (t.status !== "done") { burst(c); c.classList.add("pop"); } toggleDone(t); };
    const main = el("button", "main"); main.type = "button";
    main.append(el("span", "title", t.title), metaLine(t));
    main.onclick = () => (t.source === "plan" && STEP[t.step] ? openGuide(t) : openEdit(t));
    r.append(c, main, dueEl(t));
    return r;
  }
  function board(visible) {
    const wrap = el("div", "board");
    STATUSES.forEach(([key, name]) => {
      let items = visible.filter((t) => t.status === key);
      if (key === "done") items = items.sort((a, b) => (b.doneAt || "").localeCompare(a.doneAt || "")).slice(0, 15);
      const c = el("section", "col");
      const h = el("h3"); h.append(el("span", null, name), el("span", "n", String(items.length))); c.append(h);
      items.forEach((t) => {
        const card = el("button", "kcard"); card.type = "button"; card.draggable = !readOnly;
        card.append(el("span", "title", t.title));
        const f = el("div", "foot"); f.append(metaLine(t), dueEl(t)); card.append(f);
        card.onclick = () => (t.source === "plan" && STEP[t.step] ? openGuide(t) : openEdit(t));
        card.ondragstart = (e) => e.dataTransfer.setData("text/plain", t.id);
        c.append(card);
      });
      c.ondragover = (e) => { e.preventDefault(); c.classList.add("over"); };
      c.ondragleave = () => c.classList.remove("over");
      c.ondrop = (e) => {
        e.preventDefault(); c.classList.remove("over");
        const t = st.tasks.find((x) => x.id === e.dataTransfer.getData("text/plain"));
        if (t && t.status !== key) setStatus(t, key);
      };
      wrap.append(c);
    });
    return wrap;
  }

  // ----- Edit dialog
  const fill = (sel, pairs) => pairs.forEach(([k, v]) => { const o = el("option", null, v); o.value = k; sel.append(o); });
  fill($("#fArea"), AREAS); fill($("#fStatus"), STATUSES);
  let editing = null;
  function openEdit(t) {
    editing = t;
    $("#editTitle").textContent = readOnly ? "Task" : "Edit task";
    $("#fTitle").value = t.title || ""; $("#fArea").value = t.area || "orders"; $("#fStatus").value = t.status || "todo";
    $("#fPrio").value = t.prio || "med"; $("#fDue").value = t.due || ""; $("#fProduct").value = t.product || "";
    $("#fSupplier").value = t.supplier || ""; $("#fRef").value = t.ref || ""; $("#fRepeat").value = t.repeat || "none";
    $("#fNotes").value = t.notes || "";
    $("#editDlg").querySelectorAll("input,select,textarea").forEach((x) => (x.disabled = readOnly));
    const del = $("#delBtn"); del.hidden = readOnly; del.classList.remove("armed"); del.textContent = "Delete";
    $("#editDlg").showModal();
  }
  $("#cancelBtn").onclick = () => $("#editDlg").close();
  $("#editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editing || readOnly) { $("#editDlg").close(); return; }
    const t = editing; const status = $("#fStatus").value;
    const data = { ...strip(t), title: $("#fTitle").value.trim() || t.title, area: $("#fArea").value, prio: $("#fPrio").value,
      due: $("#fDue").value || null, product: $("#fProduct").value.trim(), supplier: $("#fSupplier").value.trim(),
      ref: $("#fRef").value.trim(), repeat: $("#fRepeat").value, notes: $("#fNotes").value };
    $("#editDlg").close();
    if (status !== t.status) await setStatus({ id: t.id, ...data }, status);
    else { await putTask(t.id, data); toast("Saved."); }
  });
  $("#delBtn").onclick = async () => {
    const t = editing; $("#editDlg").close();
    if (!t) return;
    const data = strip(st.tasks.find((x) => x.id === t.id) || t);
    await delTask(t.id);
    toast("Task deleted.", { undo: () => putTask(t.id, data) });
  };

  // ----- Learn tab
  function openLesson(id) {
    const l = LESSON[id]; if (!l) return;
    const box = $("#readBody"); box.textContent = "";
    box.append(el("span", "label", "Lesson · about " + l.mins + " min"));
    box.append(el("h2", null, l.title));
    box.append(html("div", "prose", l.body(st.profile)));
    if (l.go) { const b = el("button", "btn primary sm", "Open the profit calculator"); b.type = "button"; b.onclick = () => go(l.go); box.append(b); }
    const src = sourcesBlock(l.src); if (src) box.append(src);
    const act = el("div", "actions"); act.append(el("span"));
    const right = el("div");
    const close = el("button", "btn", "Close"); close.type = "button"; close.onclick = () => $("#readDlg").close();
    right.append(close);
    if (!readOnly) {
      const isDone = !!st.learn["lesson-" + id];
      const d = el("button", "btn primary", isDone ? "Mark unread" : "Mark as read"); d.type = "button";
      d.onclick = () => { $("#readDlg").close(); setLearn("lesson-" + id, !isDone); };
      right.append(d);
    }
    act.append(right); box.append(act);
    $("#readDlg").showModal();
  }

  function renderLearn() {
    const p = st.profile;
    const wrap = el("div"); wrap.style.display = "grid"; wrap.style.gap = "22px";
    const s1 = el("section"); s1.style.display = "grid"; s1.style.gap = "10px";
    const h1 = el("div", "section-head");
    const readN = LESSONS.filter((l) => st.learn["lesson-" + l.id]).length;
    h1.append(el("h2", null, "Lessons in this app"), el("span", "small muted", `${readN} of ${LESSONS.length} read`));
    s1.append(h1, el("p", "small muted", "Short reads with the facts sourced. Open one, then mark it read."));
    const g1 = el("div", "grid");
    const lp = st.profile;
    LESSONS.slice().sort((a, b) => (lp ? (b.fit(lp) ? 1 : 0) - (a.fit(lp) ? 1 : 0) : 0)).forEach((l) => {
      const isDone = !!st.learn["lesson-" + l.id];
      const c = el("article", "item" + (isDone ? " isdone" : ""));
      const top = el("div", "meta"); top.append(el("span", "label", "About " + l.mins + " min")); if (lp && l.fit(lp)) top.append(el("span", "pill doing", "For your plan"));
      c.append(top, el("h3", null, l.title));
      const f = el("div", "foot");
      const b = el("button", "btn sm" + (isDone ? "" : " primary"), isDone ? "Read again" : "Read"); b.type = "button"; b.onclick = () => openLesson(l.id);
      f.append(b); if (isDone) f.append(el("span", "pill ok", "Read"));
      c.append(f); g1.append(c);
    });
    s1.append(g1); wrap.append(s1);

    const s2 = el("section"); s2.style.display = "grid"; s2.style.gap = "10px";
    const h2 = el("div", "section-head"); h2.append(el("h2", null, "Free official courses"));
    s2.append(h2, el("p", "small muted", "Run by the platforms themselves. They open in a new tab; mark them done here to keep track."));
    const sorted = COURSES.slice().sort((a, b) => (p ? (b.fit(p) ? 1 : 0) - (a.fit(p) ? 1 : 0) : 0));
    const g2 = el("div", "grid");
    sorted.forEach((c) => {
      const isDone = !!st.learn[c.id];
      const card = el("article", "item" + (isDone ? " isdone" : ""));
      const top = el("div", "meta"); top.append(el("span", "label", c.by + " · " + c.len));
      if (p && c.fit(p)) top.append(el("span", "pill doing", "For your plan"));
      card.append(top, el("h3", null, c.title), el("p", "small muted", c.note));
      const f = el("div", "foot");
      f.append(extLink({ label: "Open course", url: c.url }));
      if (!readOnly) {
        const lab = el("label", "toggle"); const cb = el("input"); cb.type = "checkbox"; cb.id = "course-" + c.id; cb.checked = isDone;
        cb.onchange = () => setLearn(c.id, cb.checked); lab.append(cb, document.createTextNode("Done")); f.append(lab);
      }
      card.append(f); g2.append(card);
    });
    s2.append(g2); wrap.append(s2);
    return wrap;
  }

  // ----- Tools tab: calculators, research tools and AI writers
  const TOOL_LIST = [
    { id: "profit", group: "Calculators", name: "Profit per sale" },
    { id: "price", group: "Calculators", name: "Price from a target" },
    { id: "maxbuy", group: "Calculators", name: "Max buy price (reselling)" },
    { id: "affiliate", group: "Calculators", name: "Affiliate earnings" },
    { id: "rate", group: "Calculators", name: "Freelance rate" },
    { id: "royalty", group: "Calculators", name: "Book royalties (KDP)" },
    { id: "recurring", group: "Calculators", name: "Subscription income" },
    { id: "creator", group: "Calculators", name: "Creator income" },
    { id: "compare", group: "Calculators", name: "Compare platforms" },
    { id: "ads", group: "Calculators", name: "Ads break-even and budget" },
    { id: "discount", group: "Calculators", name: "Discount impact" },
    { id: "evaluate", group: "Research", name: "Product evaluator" },
    { id: "trends", group: "Research", name: "Trend and demand check" },
    { id: "delivery", group: "Shipping", name: "Delivery dates and holiday deadlines" },
    { id: "messages", group: "Customers", name: "Customer message templates" },
    { id: "helper", group: "AI", name: "Ask AI about your plan" },
    { id: "describe", group: "AI", name: "Description writer" },
    { id: "hooks", group: "AI", name: "Video hooks and captions" },
    { id: "directory", group: "Directory", name: "Sites and apps" },
  ];
  const TOOL_IDS = new Set(TOOL_LIST.map((t) => t.id));
  let currentTool = TOOL_IDS.has(lsGet("dd-tool", "profit")) ? lsGet("dd-tool", "profit") : "profit";
  let toolBody = null;

  // Shared numbers: a price or cost typed in one calculator is there in the others.
  const CV = lsGet("dd-calc2", {});
  const cvSet = (k, v) => { CV[k] = v; lsSet("dd-calc2", CV); };
  const nv = (k) => (CV[k] === undefined || CV[k] === null || CV[k] === "" || isNaN(Number(CV[k])) ? null : Number(CV[k]));
  function ensureFeeDefaults(force) {
    if (force || !CV.fee || !FEES[CV.fee]) {
      CV.fee = (st.profile && DEFAULT_FEE[st.profile.channel]) || "shopify";
      const f = FEES[CV.fee]; CV.pct = f.pct == null ? "" : f.pct; CV.fixed = f.fixed == null ? "" : f.fixed;
      lsSet("dd-calc2", CV);
    }
  }
  const FEE_SRC_KEY = { fiverr: "fiverrVsUpwork", upwork: "upworkFee", stripeUS: "substackCost", substack: "substackCost", teachableStarter: "teachableFees", teachablePaid: "teachableFees", thinkific: "thinkific", amazonFBA: "fbaCalc", shopify: "shopPricing", shopify3p: "shopPricing", etsy: "etsyFees", ebay: "ebayFees", tiktok: "ttsHome", amazonI: "amzPricing", amazonP: "amzPricing", mercari: "mercariFees", poshmark: "poshFees", gumroad: "gumroad", payhipFree: "payhip", payhipPlus: "payhip", payhipPro: "payhip" };
  function feeOf(price, key = CV.fee, pct = nv("pct"), fixed = nv("fixed")) {
    if (key === "poshmark" && price < 15) return 2.95;
    if (key === "ebay" && fixed == null) fixed = price > 10 ? 0.4 : 0.3;
    return (price * (pct || 0)) / 100 + (fixed || 0);
  }
  const costsOf = () => (nv("cost") || 0) + (nv("ship") || 0) + (nv("other") || 0);

  function numField(form, key, label, opts = {}) {
    const f = el("div", "field" + (opts.full ? " full" : ""));
    const id = "n-" + key + (opts.suffix || "");
    const l = el("label", "label", label); l.htmlFor = id;
    const i = el("input"); i.type = "number"; i.id = id; i.step = opts.step || "0.01"; i.min = opts.min ?? "0"; i.inputMode = "decimal";
    if (CV[key] != null && CV[key] !== "") i.value = CV[key];
    i.addEventListener("input", () => cvSet(key, i.value));
    f.append(l, i); if (opts.hint) f.append(el("span", "small muted", opts.hint));
    form.append(f); return i;
  }
  function feeFields(form, onPreset) {
    ensureFeeDefaults();
    const field = el("div", "field full");
    const lab = el("label", "label", "Platform and payment fees"); lab.htmlFor = "n-fee";
    const sel = el("select"); sel.id = "n-fee"; fill(sel, Object.entries(FEES).map(([k, v]) => [k, v.label])); sel.value = CV.fee;
    const hint = el("span", "small muted");
    field.append(lab, sel, hint); form.append(field);
    const pct = numField(form, "pct", "Fee %", { step: "0.1" });
    const fixed = numField(form, "fixed", "Fixed fee per sale");
    const showHint = () => {
      hint.textContent = FEES[sel.value].hint || "";
      const k = FEE_SRC_KEY[sel.value];
      if (k) { const a = el("a", null, " Source: " + S[k][0]); a.href = S[k][1]; a.target = "_blank"; a.rel = "noopener"; hint.append(a); }
    };
    sel.onchange = () => {
      const f = FEES[sel.value]; cvSet("fee", sel.value);
      pct.value = f.pct == null ? "" : f.pct; fixed.value = f.fixed == null ? "" : f.fixed;
      cvSet("pct", pct.value); cvSet("fixed", fixed.value); showHint(); onPreset && onPreset();
    };
    showHint();
    return sel;
  }
  function outBox() { const o = el("div", "out"); o.setAttribute("aria-live", "polite"); return o; }
  function oLine(box, k, v, cls) { const d = el("div", "line"); d.append(el("span", null, k)); d.append(el("b", cls || "", v)); box.append(d); }
  function oBig(box, k, v, cls) { const d = el("div", "big"); d.append(el("span", null, k), el("b", cls || "", v)); box.append(d); }
  const pct1 = (x) => (isFinite(x) ? x.toFixed(1) + "%" : "—");
  function toolCard(title, intro, src) {
    const sec = el("section", "card");
    sec.append(el("h2", null, title));
    if (intro) sec.append(el("p", "small muted", intro));
    if (src) { const s = sourcesBlock(src); if (s) sec._src = s; }
    return sec;
  }
  function finish(sec) { if (sec._src) sec.append(sec._src); return sec; }
  function calcLayout(sec) { const g = el("div", "calc"); const form = el("div", "fields"); const out = outBox(); g.append(form, out); sec.append(g); return { form, out }; }

  function renderTools() {
    const wrap = el("div", "hub");
    const nav = el("nav", "hub-nav"); nav.setAttribute("aria-label", "Tools");
    const sel = el("select", "hub-select"); sel.id = "toolSelect"; sel.setAttribute("aria-label", "Choose a tool");
    let group = null, og = null;
    TOOL_LIST.forEach((t) => {
      if (t.group !== group) {
        group = t.group; nav.append(el("span", "label hub-group", group));
        og = el("optgroup"); og.label = group; sel.append(og);
      }
      const b = el("button", "hub-link", t.name); b.type = "button"; b.dataset.tool = t.id; b.setAttribute("aria-current", String(t.id === currentTool));
      b.onclick = () => openTool(t.id);
      nav.append(b);
      const o = el("option", null, t.name); o.value = t.id; og.append(o);
    });
    sel.value = currentTool; sel.onchange = () => openTool(sel.value);
    const body = el("div", "hub-body"); toolBody = body;
    wrap.append(sel, nav, body);
    renderTool();
    return wrap;
  }
  function openTool(id) {
    if (!TOOL_IDS.has(id)) id = "profit";
    currentTool = id; lsSet("dd-tool", id);
    if (st.tab !== "tools") { setTab("tools"); return; }
    document.querySelectorAll(".hub-link").forEach((b) => b.setAttribute("aria-current", String(b.dataset.tool === id)));
    const s = $("#toolSelect"); if (s) s.value = id;
    renderTool();
  }
  function renderTool() {
    if (!toolBody) return;
    toolBody.textContent = "";
    const fn = { profit: toolProfit, price: toolPrice, maxbuy: toolMaxBuy, affiliate: toolAffiliate, rate: toolRate, royalty: toolRoyalty, recurring: toolRecurring, creator: toolCreator, compare: toolCompare, ads: toolAds, discount: toolDiscount, evaluate: toolEvaluate,
      trends: toolTrends, delivery: toolDelivery, messages: toolMessages, helper: toolHelper, describe: toolDescribe, hooks: toolHooks, directory: toolDirectory }[currentTool] || toolProfit;
    toolBody.append(fn());
  }
  function renderToolsDirectory() { if (st.tab === "tools" && ["directory", "evaluate", "helper"].includes(currentTool)) renderTool(); }

  // --- Profit per order
  function toolProfit() {
    const sec = toolCard("Profit per sale", "Enter your own numbers. Fee rates fill in for the platform you pick; change them if your rate differs.");
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "price", "Price the customer pays", { hint: "Include any shipping you charge." });
    numField(form, "cost", "Product cost");
    numField(form, "ship", "Shipping you pay the supplier");
    numField(form, "other", "Other costs per order", { hint: "Packaging, branding, listing fees." });
    numField(form, "ads", "Ad spend per order", { hint: "Leave empty if you're not running ads." });
    numField(form, "refund", "Refund rate %", { step: "0.1", hint: "Share of orders you expect to refund in full." });
    numField(form, "monthly", "Monthly costs", { hint: "Store plan and apps." });
    const calc = () => {
      out.textContent = "";
      const P = nv("price");
      if (P == null || nv("cost") == null) { out.append(el("p", "muted", "Enter a price and a product cost to see your profit per order.")); return; }
      const fees = feeOf(P), costs = costsOf(), before = P - costs - fees;
      const ad = nv("ads"), r = (nv("refund") || 0) / 100;
      const after = before - (ad || 0) - r * P;
      oLine(out, "Price", money(P));
      oLine(out, "Product, shipping and other costs", "−" + money(costs));
      oLine(out, "Platform and payment fees", "−" + money(fees));
      oBig(out, "Profit before ads", money(before), before >= 0 ? "pos" : "neg");
      oLine(out, "Break-even ad cost per order", money(Math.max(0, before)));
      if (ad != null || r) {
        if (ad != null) oLine(out, "Ad spend per order", "−" + money(ad));
        if (r) oLine(out, "Expected refunds per order", "−" + money(r * P));
        oBig(out, "Profit per order", money(after), after >= 0 ? "pos" : "neg");
        oLine(out, "Margin", pct1((after / P) * 100));
      }
      const per = ad != null || r ? after : before, M = nv("monthly");
      if (M) oLine(out, "Orders a month to cover monthly costs", per > 0 ? String(Math.ceil(M / per)) : "Not reachable at this price", per > 0 ? "" : "neg");
      // Where each dollar of the price goes
      const parts = [["s-cost", "Product", nv("cost") || 0], ["s-ship", "Shipping", nv("ship") || 0], ["s-fee", "Fees", fees], ["s-other", "Other, ads and refunds", (nv("other") || 0) + (ad || 0) + r * P], ["s-profit", "Profit", Math.max(0, per)]];
      const tot = parts.reduce((a2, x) => a2 + Math.max(0, x[2]), 0) || 1;
      const bar = el("div", "split"); bar.setAttribute("role", "img"); bar.setAttribute("aria-label", "Where the price goes: " + parts.filter((x) => x[2] > 0).map((x) => x[1] + " " + money(x[2])).join(", "));
      parts.forEach(([cls, , v]) => { if (v > 0) { const i = el("i", cls); i.style.flexGrow = String(v / tot); bar.append(i); } });
      const lg = el("div", "legend"); parts.forEach(([cls, label, v]) => { if (v > 0) { const sp = el("span"); sp.append(el("i", cls), label + " " + Math.round((v / tot) * 100) + "%"); lg.append(sp); } });
      out.append(el("span", "label", "Where the price goes"), bar, lg);
      // Try other prices without retyping
      const sl = el("div", "slider"); const sid = "priceTry"; const lab = el("label", "small muted", "Try a different price: " + money(P)); lab.htmlFor = sid;
      const rg = el("input"); rg.type = "range"; rg.id = sid; rg.min = String(Math.max(0, Math.floor(costs + fees * 0.5))); rg.max = String(Math.max(Math.ceil(P * 2), 10)); rg.step = P >= 50 ? "1" : "0.5"; rg.value = String(P);
      rg.oninput = () => { cvSet("price", rg.value); const inp = $("#n-price"); if (inp) inp.value = rg.value; const keepFocus = document.activeElement === rg; calc(); if (keepFocus) { const r2 = $("#" + sid); if (r2) r2.focus(); } };
      sl.append(lab, rg); out.append(sl);
      if (r) out.append(el("p", "small muted", "Refunds assume you refund the full price, don't resell the item, and don't get fees back (Shopify Payments keeps the original processing fee)."));
      if (before < 0) out.append(el("p", "small neg", "This price loses money on every order before any advertising."));
      else if (ad != null && after < 0) out.append(el("p", "small neg", "Your costs per order are above your break-even. Raise the price, lower costs, or improve the ad before spending more."));
    };
    form.addEventListener("input", calc); calc();
    return sec;
  }

  // --- Price from a target margin or profit
  function toolPrice() {
    const sec = toolCard("Price from a target", "Work backwards from the profit you want to the price you need. Fees that are a percentage of the price are included.");
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "cost", "Product cost");
    numField(form, "ship", "Shipping you pay the supplier");
    numField(form, "other", "Other costs per order");
    numField(form, "ads", "Ad spend per order", { hint: "Optional." });
    numField(form, "margin", "Target margin %", { step: "1", hint: "Profit as a share of the price." });
    numField(form, "target", "Or target profit per order", { hint: "Used instead of the margin if filled." });
    const calc = () => {
      out.textContent = "";
      if (nv("cost") == null) { out.append(el("p", "muted", "Enter a product cost and a target margin or profit.")); return; }
      const pct = (nv("pct") || 0) / 100, fixedRaw = nv("fixed"), A = nv("ads") || 0, C = costsOf();
      const solve = (fixed) => {
        if (nv("target") != null) return (C + fixed + A + nv("target")) / (1 - pct);
        if (nv("margin") != null) { const d = 1 - pct - nv("margin") / 100; return d > 0 ? (C + fixed + A) / d : null; }
        return null;
      };
      let price = solve(fixedRaw == null && CV.fee === "ebay" ? 0.4 : fixedRaw || 0);
      if (price != null && CV.fee === "ebay" && fixedRaw == null && price <= 10) price = solve(0.3);
      if (price == null) { out.append(el("p", nv("margin") != null ? "neg" : "muted", nv("margin") != null ? "That margin isn't reachable: fees and margin add up to 100% or more." : "Enter a target margin or a target profit.")); return; }
      const rounded = Math.ceil(price) - 0.01 >= price ? Math.ceil(price) - 0.01 : Math.ceil(price) + 0.99;
      oBig(out, "Price you need", money(price));
      oLine(out, "Rounded to .99", money(rounded));
      const fees = feeOf(rounded), profit = rounded - C - fees - A;
      oLine(out, "Fees at the rounded price", money(fees));
      oLine(out, "Profit per order at the rounded price", money(profit), profit >= 0 ? "pos" : "neg");
      oLine(out, "Margin at the rounded price", pct1((profit / rounded) * 100));
      const b = el("button", "btn sm", "Use this price in the other calculators"); b.type = "button";
      b.onclick = () => { cvSet("price", rounded.toFixed(2)); toast("Price set to " + money(rounded) + "."); };
      out.append(b);
    };
    form.addEventListener("input", calc); calc();
    return sec;
  }

  // --- Ads break-even and budget
  function toolAds() {
    const sec = toolCard("Ads break-even and budget", "How much an ad can cost per sale before you lose money, and what a test budget looks like on Meta and TikTok.", ["metaBudget", "ttBudget"]);
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "price", "Price the customer pays");
    numField(form, "cost", "Product cost");
    numField(form, "ship", "Shipping you pay the supplier");
    numField(form, "other", "Other costs per order");
    numField(form, "target", "Profit you want per order after ads", { hint: "Optional." });
    numField(form, "daily", "Daily ad budget", { hint: "For the test plan." });
    numField(form, "days", "Days in the test", { step: "1" });
    const calc = () => {
      out.textContent = "";
      const P = nv("price");
      if (P == null || nv("cost") == null) { out.append(el("p", "muted", "Enter a price and product cost first.")); return; }
      const before = P - costsOf() - feeOf(P);
      if (before <= 0) { out.append(el("p", "neg", "This product loses money before ads, so no ad cost can break even. Raise the price or lower costs.")); return; }
      oBig(out, "Break-even cost per purchase", money(before));
      oLine(out, "Break-even ROAS (sales ÷ ad spend)", (P / before).toFixed(2));
      const T = nv("target");
      if (T != null) {
        const cpa = before - T;
        if (cpa > 0) { oLine(out, "Target cost per purchase", money(cpa)); oLine(out, "Target ROAS", (P / cpa).toFixed(2)); }
        else oLine(out, "Target cost per purchase", "Not possible at this price", "neg");
      }
      oLine(out, "Meta: suggested daily budget at break-even", money(before * 10) + "/day");
      out.append(el("p", "small muted", "Meta suggests a daily budget of at least 10× the average cost of the result you optimise for. Most advertisers charged per impression need at least $1 a day per ad set."));
      oLine(out, "TikTok minimums", "Ad group over $20/day; campaign over $50");
      const D = nv("daily"), N = nv("days");
      if (D && N) {
        oBig(out, "Total test spend", money(D * N));
        oLine(out, "Purchases needed to break even", String(Math.ceil((D * N) / before)));
        if (T != null && before - T > 0) oLine(out, "Purchases needed to hit your target", String(Math.ceil((D * N) / (before - T))));
      }
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Discount impact
  function toolDiscount() {
    const sec = toolCard("Discount impact", "What a sale price does to your profit, and how many more orders you'd need to earn the same total.");
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "price", "Normal price");
    numField(form, "cost", "Product cost");
    numField(form, "ship", "Shipping you pay the supplier");
    numField(form, "other", "Other costs per order");
    numField(form, "discount", "Discount %", { step: "1" });
    const calc = () => {
      out.textContent = "";
      const P = nv("price"), d = nv("discount");
      if (P == null || nv("cost") == null || d == null) { out.append(el("p", "muted", "Enter a price, a product cost and a discount.")); return; }
      const P2 = P * (1 - d / 100), C = costsOf();
      const p1 = P - C - feeOf(P), p2 = P2 - C - feeOf(P2);
      oLine(out, "Profit per order now", money(p1), p1 >= 0 ? "pos" : "neg");
      oLine(out, "Sale price", money(P2));
      oBig(out, "Profit per order on sale", money(p2), p2 >= 0 ? "pos" : "neg");
      if (p1 > 0 && p2 > 0) oLine(out, "More orders needed for the same total profit", "+" + pct1((p1 / p2 - 1) * 100));
      else if (p2 <= 0) out.append(el("p", "small neg", "At this discount every order loses money."));
    };
    form.addEventListener("input", calc); calc();
    return sec;
  }

  // --- Max buy price (reselling)
  function toolMaxBuy() {
    const sec = toolCard("Max buy price", "For reselling: the most you can pay for an item and still make the profit you want. Start from a recent sold price, not an asking price.", ["ebayFees", "mercariFees", "poshFees"]);
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "soldPrice", "Expected sale price", { hint: "From recent sold listings." });
    numField(form, "shipOut", "Shipping you pay", { hint: "Leave empty if the buyer pays shipping." });
    numField(form, "supplies", "Supplies per item", { hint: "Mailer, tape, cleaning." });
    numField(form, "wantProfit", "Profit you want per item");
    const calc = () => {
      out.textContent = "";
      const P = nv("soldPrice");
      if (P == null) { out.append(el("p", "muted", "Enter the price similar items have actually sold for.")); return; }
      const fees = feeOf(P), ship = nv("shipOut") || 0, sup = nv("supplies") || 0, want = nv("wantProfit") || 0;
      const maxBuy = P - fees - ship - sup - want;
      oLine(out, "Sale price", money(P));
      oLine(out, "Fees", "−" + money(fees));
      if (ship) oLine(out, "Shipping", "−" + money(ship));
      if (sup) oLine(out, "Supplies", "−" + money(sup));
      if (want) oLine(out, "Your profit", "−" + money(want));
      oBig(out, "Pay no more than", money(Math.max(0, maxBuy)), maxBuy > 0 ? "pos" : "neg");
      if (maxBuy <= 0) out.append(el("p", "small neg", "At this sale price there's no room for the profit you want."));
      else if (want) oLine(out, "Return on what you pay", pct1((want / maxBuy) * 100));
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Affiliate earnings
  function toolAffiliate() {
    const sec = toolCard("Affiliate earnings", "What a sale, 100 clicks and a month of clicks are worth. Your conversion rate is a guess until your program's dashboard shows real numbers.", ["amzAssocAgree"]);
    const { form, out } = calcLayout(sec);
    numField(form, "affPrice", "Product price");
    numField(form, "affRate", "Commission %", { step: "0.1", hint: "Amazon: fixed by category, 0% to 10%. Other programs set their own." });
    numField(form, "affConv", "Clicks that buy %", { step: "0.1", hint: "Your estimate, then your real rate." });
    numField(form, "affClicks", "Clicks per month", { step: "1" });
    numField(form, "affGoal", "Monthly goal", { hint: "Optional." });
    const calc = () => {
      out.textContent = "";
      const P = nv("affPrice"), r = nv("affRate");
      if (P == null || r == null) { out.append(el("p", "muted", "Enter a product price and the commission rate.")); return; }
      const perSale = (P * r) / 100;
      oBig(out, "You earn per sale", money(perSale));
      out.append(el("p", "small muted", "Amazon pays commission on what it receives, not counting shipping, tax and similar charges."));
      const c = nv("affConv");
      if (c != null) {
        oLine(out, "Per 100 clicks", money(perSale * c));
        const clicks = nv("affClicks");
        if (clicks != null) oBig(out, "Per month", money((clicks * c * perSale) / 100));
        const g = nv("affGoal");
        if (g && perSale * c > 0) oLine(out, "Clicks needed for your goal", Math.ceil(g / ((perSale * c) / 100)).toLocaleString());
      }
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Freelance rate
  function toolRate() {
    const sec = toolCard("Freelance rate", "The hourly rate you need so your billable hours cover the pay you want, your costs, platform fees and tax.", ["fiverrVsUpwork", "upworkFee", "irsSE"]);
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "rGoal", "Take-home pay you want per month");
    numField(form, "rCosts", "Business costs per month", { hint: "Software, equipment, subscriptions." });
    numField(form, "rTax", "Tax to set aside %", { step: "0.1", hint: "US self-employment tax is 15.3% on 92.35% of net earnings, plus income tax. Ask a tax professional for your rate." });
    numField(form, "rHours", "Billable hours per month", { step: "1", hint: "Only hours clients pay for." });
    numField(form, "rProj", "Hours in a typical project", { step: "0.5", hint: "Optional." });
    const calc = () => {
      out.textContent = "";
      const G = nv("rGoal"), H = nv("rHours");
      if (G == null || !H) { out.append(el("p", "muted", "Enter the pay you want and your billable hours.")); return; }
      const costs = nv("rCosts") || 0, tax = (nv("rTax") || 0) / 100, pct = (nv("pct") || 0) / 100;
      if (tax >= 1 || pct >= 1) { out.append(el("p", "neg", "Tax and fee percentages must be under 100%.")); return; }
      const beforeTax = (G + costs) / (1 - tax);
      const billed = beforeTax / (1 - pct);
      const hourly = billed / H;
      oBig(out, "Charge at least", money(hourly) + "/hour");
      oLine(out, "Bill per month", money(billed));
      oLine(out, "Platform and payment fees", "−" + money(billed - beforeTax));
      oLine(out, "Tax set aside", "−" + money(beforeTax - (G + costs)));
      oLine(out, "Business costs", "−" + money(costs));
      oLine(out, "Take-home", money(G));
      const P = nv("rProj"); if (P) oLine(out, "Price for a " + P + "-hour project", money(hourly * P));
      out.append(el("p", "small muted", "Fixed per-payment fees aren't included; add them to business costs if you have them."));
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Book royalties (Amazon KDP, Amazon.com)
  function toolRoyalty() {
    const sec = toolCard("Book royalties (KDP)", "Royalty per copy on Amazon.com for eBooks and paperbacks. Prices exclude sales tax and VAT. Get the printing cost from KDP's printing cost calculator.", ["kdpEbook", "kdpPaper", "kdpPrint"]);
    const { form, out } = calcLayout(sec);
    numField(form, "bkEbook", "eBook list price");
    numField(form, "bkMB", "eBook file size (MB)", { step: "0.1" });
    numField(form, "bkPaper", "Paperback list price");
    numField(form, "bkPrint", "Paperback printing cost", { hint: "From KDP's printing cost calculator." });
    numField(form, "bkGoal", "Monthly royalty goal", { hint: "Optional." });
    const calc = () => {
      out.textContent = "";
      const E = nv("bkEbook"), MB = nv("bkMB") || 0, Pp = nv("bkPaper"), Pc = nv("bkPrint"), goal = nv("bkGoal");
      if (E == null && Pp == null) { out.append(el("p", "muted", "Enter an eBook price, a paperback price, or both.")); return; }
      let best = null;
      if (E != null) {
        out.append(el("span", "label", "eBook"));
        const r35 = E * 0.35;
        const delivery = Math.max(0.01, 0.15 * MB);
        const in70 = E >= 2.99 && E <= 12.99;
        const r70 = 0.7 * (E - delivery);
        oLine(out, "35% option", money(r35));
        oLine(out, "70% option", in70 ? money(r70) + " (after " + money(delivery) + " delivery)" : "Not available at this price", in70 ? "" : "neg");
        if (!in70) out.append(el("p", "small muted", "On Amazon.com the 70% option needs a list price from $2.99 to $12.99."));
        const min35 = MB >= 10 ? 2.99 : MB >= 3 ? 1.99 : 0.99;
        if (E < min35) out.append(el("p", "small neg", "Below the 35% minimum of " + money(min35) + " for this file size."));
        best = in70 ? Math.max(r35, r70) : r35;
        if (goal && best > 0) oLine(out, "eBooks a month for your goal", Math.ceil(goal / best).toLocaleString());
      }
      if (Pp != null) {
        out.append(el("span", "label", "Paperback"));
        const rate = Pp >= 9.99 ? 0.6 : 0.5;
        if (Pc == null) out.append(el("p", "small muted", "Enter the printing cost to see the royalty."));
        else {
          const roy = rate * Pp - Pc;
          oLine(out, "Royalty rate", Math.round(rate * 100) + "%");
          oBig(out, "Royalty per copy", money(roy), roy > 0 ? "pos" : "neg");
          oLine(out, "Lowest list price KDP allows", money(Pc / rate));
          if (goal && roy > 0) oLine(out, "Paperbacks a month for your goal", Math.ceil(goal / roy).toLocaleString());
        }
      }
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Subscription income (newsletters, memberships, course subscriptions)
  function toolRecurring() {
    const sec = toolCard("Subscription income", "Monthly income from paid subscribers or members, after platform and payment fees.", ["substackCost", "teachableFees", "payhip"]);
    const { form, out } = calcLayout(sec);
    feeFields(form, () => calc());
    numField(form, "sAud", "Free subscribers or followers", { step: "1" });
    numField(form, "sConv", "Share who pay %", { step: "0.1", hint: "Your estimate until you have real numbers." });
    numField(form, "sPrice", "Monthly price");
    numField(form, "sGoal", "Monthly income goal", { hint: "Optional." });
    const calc = () => {
      out.textContent = "";
      const A = nv("sAud"), c = nv("sConv"), P = nv("sPrice");
      if (P == null) { out.append(el("p", "muted", "Enter a monthly price.")); return; }
      const net = P - feeOf(P);
      oLine(out, "Fees per payment", "−" + money(P - net));
      oBig(out, "You keep per subscriber", money(net), net > 0 ? "pos" : "neg");
      if (A != null && c != null) {
        const members = Math.floor((A * c) / 100);
        oLine(out, "Paying subscribers", members.toLocaleString());
        oBig(out, "Monthly income", money(members * net));
        oLine(out, "Yearly income", money(members * net * 12));
      }
      const g = nv("sGoal");
      if (g && net > 0) { const need = Math.ceil(g / net); oLine(out, "Paying subscribers for your goal", need.toLocaleString()); if (c) oLine(out, "Free subscribers that takes at your rate", Math.ceil(need / (c / 100)).toLocaleString()); }
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Creator income
  function toolCreator() {
    const sec = toolCard("Creator income", "Adds up income from platform payouts, sponsorships and affiliate links. Use your own RPM from YouTube Studio or your rate from TikTok Studio once you're in a program: rates vary widely by topic and country.", ["ytBlog", "ttRewards"]);
    const { form, out } = calcLayout(sec);
    numField(form, "cViews", "Monetised views per month", { step: "1" });
    numField(form, "cRpm", "Your earnings per 1,000 views", { hint: "Your RPM, after the platform's share." });
    numField(form, "cSpons", "Sponsored posts per month", { step: "1" });
    numField(form, "cSponsFee", "Average fee per sponsored post");
    numField(form, "cAff", "Affiliate earnings per month");
    numField(form, "cProd", "Own product sales per month", { hint: "Profit after costs." });
    const calc = () => {
      out.textContent = "";
      const v = nv("cViews"), r = nv("cRpm");
      const payouts = v != null && r != null ? (v / 1000) * r : 0;
      const spons = (nv("cSpons") || 0) * (nv("cSponsFee") || 0);
      const aff = nv("cAff") || 0, prod = nv("cProd") || 0;
      if (!payouts && !spons && !aff && !prod) { out.append(el("p", "muted", "Enter at least one income source.")); return; }
      if (payouts) oLine(out, "Platform payouts", money(payouts));
      if (spons) oLine(out, "Sponsorships", money(spons));
      if (aff) oLine(out, "Affiliate links", money(aff));
      if (prod) oLine(out, "Your own products", money(prod));
      oBig(out, "Total per month", money(payouts + spons + aff + prod));
      out.append(el("p", "small muted", "Before tax. Sponsorships and affiliate links need clear disclosures."));
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Compare platforms
  function toolCompare() {
    const p = st.profile || {};
    const kind = CV.cmpKind || (p.model === "digital" ? "digital" : p.model === "resell" ? "resale" : p.model === "freelance" ? "services" : "physical");
    const sec = toolCard("Compare platforms", "The same item at the same price on each platform, after its fees. Rules differ too: check the notes before you choose.",
      ["shopPricing", "etsyFees", "ebayFees", "ttsHome", "amzPricing", "mercariFees", "poshFees", "gumroad", "payhip", "fiverrVsUpwork", "upworkFee"]);
    const { form, out } = calcLayout(sec);
    const kf = el("div", "field full"); const kl = el("label", "label", "Compare for"); kl.htmlFor = "cmpKind";
    const ks = el("select"); ks.id = "cmpKind"; fill(ks, [["physical", "Products you ship (dropshipping, print-on-demand)"], ["digital", "Digital products"], ["resale", "Reselling"], ["services", "Freelance services"]]); ks.value = kind;
    ks.onchange = () => { cvSet("cmpKind", ks.value); renderTool(); };
    kf.append(kl, ks); form.append(kf);
    numField(form, "price", kind === "services" ? "Project price" : "Price the customer pays");
    if (kind === "services") numField(form, "upFee", "Upwork fee for this contract %", { step: "0.1", hint: "0% to 15%; Upwork shows it before you accept." });
    if (kind !== "digital" && kind !== "services") numField(form, "cost", kind === "resale" ? "What you paid for the item" : "Product cost");
    if (kind !== "digital" && kind !== "services") numField(form, "ship", "Shipping you pay");
    if (kind === "physical") numField(form, "referral", "Amazon referral fee % for your category", { step: "0.1", hint: "Most categories are 8% to 15%." });
    numField(form, "volume", "Sales a month", { step: "1", hint: "Spreads monthly plan costs over your sales." });
    const ref = () => nv("referral");
    const ROWS = {
      physical: [
        { name: "Shopify (Basic, Shopify Payments)", fee: (P) => P * 0.029 + 0.3, monthly: 39, note: "Basic billed monthly; $29/mo billed yearly." },
        { name: "Etsy (US)", fee: (P) => P * 0.095 + 0.25 + 0.2, monthly: 0, note: "Assumes one $0.20 listing fee per sale. Print-on-demand of your own designs only." },
        { name: "eBay (most categories)", fee: (P) => P * 0.136 + (P > 10 ? 0.4 : 0.3), monthly: 0, note: "Dropshipping needs a wholesale supplier agreement." },
        { name: "TikTok Shop US", fee: (P) => P * 0.06, monthly: 0, note: "Delivery within 6 business days required." },
        { name: "Amazon (Individual)", fee: (P) => (ref() == null ? null : Math.max((P * ref()) / 100, 0.3) + 0.99), monthly: 0, note: "Referral fee has a minimum, often $0.30; you must be seller of record." },
        { name: "Amazon (Professional)", fee: (P) => (ref() == null ? null : Math.max((P * ref()) / 100, 0.3)), monthly: 39.99, note: "Amazon suggests it from about 40 sales a month." },
      ],
      digital: [
        { name: "Etsy (US)", fee: (P) => P * 0.095 + 0.25 + 0.2, monthly: 0, note: "Assumes one $0.20 listing fee per sale. Must be made or designed by you." },
        { name: "Gumroad (direct sale)", fee: (P) => P * 0.1 + 0.5, monthly: 0, note: "30% instead for sales through Gumroad Discover." },
        { name: "Payhip Free", fee: (P) => P * 0.05, monthly: 0, note: "Plus PayPal or Stripe processing." },
        { name: "Payhip Plus", fee: (P) => P * 0.02, monthly: 29, note: "Plus PayPal or Stripe processing." },
        { name: "Payhip Pro", fee: () => 0, monthly: 99, note: "Plus PayPal or Stripe processing." },
        { name: "Shopify (Basic, Shopify Payments)", fee: (P) => P * 0.029 + 0.3, monthly: 39, note: "With Shopify's free Digital Downloads app." },
      ],
      services: [
        { name: "Fiverr", fee: (P) => P * 0.2, monthly: 0, note: "20% of every order, including tips. Paid 14 days after completion." },
        { name: "Upwork", fee: (P) => (nv("upFee") == null ? null : (P * nv("upFee")) / 100), monthly: 0, note: "Proposals also cost Connects ($0.15 each beyond free ones)." },
        { name: "Own clients, card via Stripe (US)", fee: (P) => P * 0.029 + 0.3, monthly: 0, note: "No platform fee; you find the clients." },
      ],
      resale: [
        { name: "eBay (most categories)", fee: (P) => P * 0.136 + (P > 10 ? 0.4 : 0.3), monthly: 0, note: "250 free listings a month." },
        { name: "Mercari", fee: (P) => P * 0.1, monthly: 0, note: "Also charged on buyer-paid shipping." },
        { name: "Poshmark (US)", fee: (P) => (P < 15 ? 2.95 : P * 0.2), monthly: 0, note: "$2.95 under $15; 20% from $15." },
      ],
    };
    const calc = () => {
      out.textContent = "";
      const P = nv("price");
      const noCost = kind === "digital" || kind === "services";
      if (P == null || (!noCost && nv("cost") == null)) { out.append(el("p", "muted", noCost ? "Enter a price to compare." : "Enter a price and a cost to compare.")); return; }
      const C = noCost ? 0 : (nv("cost") || 0) + (nv("ship") || 0), vol = nv("volume");
      const tw = el("div", "tablewrap"); const t = el("table");
      t.innerHTML = "<thead><tr><th>Platform</th><th>Fees / sale</th><th>Profit / sale</th>" + (vol ? "<th>Monthly profit</th>" : "") + "</tr></thead>";
      const tb = el("tbody");
      ROWS[kind].forEach((r) => {
        const tr = el("tr"); const f = r.fee(P);
        const name = el("td"); name.append(el("span", null, r.name), el("br"), el("span", "small muted", r.note));
        tr.append(name);
        if (f == null) { tr.append(el("td", "muted", kind === "services" ? "Enter fee %" : "Enter referral %"), el("td", null, "—")); if (vol) tr.append(el("td", null, "—")); }
        else {
          const per = P - C - f;
          tr.append(el("td", null, money(f)), el("td", per >= 0 ? "pos" : "neg", money(per)));
          if (vol) { const m = per * vol - r.monthly; tr.append(el("td", m >= 0 ? "pos" : "neg", money(m) + (r.monthly ? " (after " + money(r.monthly) + " plan)" : ""))); }
        }
        tb.append(tr);
      });
      t.append(tb); tw.append(t); out.append(tw);
      out.append(el("p", "small muted", "Estimates before ads and sales tax. Some platforms charge fees on totals that include shipping or tax, so real fees can be slightly higher. Fees checked " + CHECKED + "."));
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Product evaluator
  const ev = { facts: null, aiText: "", aiBusy: false, aiErr: "", aiPrompt: "", brandOk: false, sampleOk: false };
  const RETAIL_SITES = { ebay: "eBay", amazon: "Amazon", walmart: "Walmart", etsy: "Etsy", aliexpress: "AliExpress", temu: "Temu", cj: "CJdropshipping", web: "another online store" };
  function siteFromUrl(u) {
    try {
      const h = new URL(u).hostname.replace(/^www\./, "");
      if (h.includes("aliexpress")) return "aliexpress";
      if (h.includes("amazon.")) return "amazon";
      if (h.includes("ebay.")) return "ebay";
      if (h.includes("etsy.")) return "etsy";
      if (h.includes("temu.")) return "temu";
      if (h.includes("walmart.")) return "walmart";
      if (h.includes("cjdropshipping")) return "cj";
      return "web";
    } catch { return null; }
  }
  function evNum(k) { const v = CV[k]; return v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v); }
  function evaluate() {
    const p = st.profile || {};
    const ch = SHIP(p) ? p.channel : "shopify";
    const price = evNum("evPrice"), cost = evNum("evCost"), ship = evNum("evShip") || 0, ads = evNum("evAds");
    const maxD = evNum("evMax") ?? evNum("evMin"), minD = evNum("evMin") ?? evNum("evMax");
    const from = (CV.evFrom || "").toUpperCase().trim();
    const source = siteFromUrl(CV.evLink || "") || "";
    const checks = [];
    const add = (level, title, text, src) => checks.push({ level, title, text, src });
    let profit = null, margin = null, before = null;
    if (price != null && cost != null) {
      before = price - cost - ship - feeOf(price);
      profit = before - (ads || 0);
      margin = (profit / price) * 100;
      if (before <= 0) add("bad", "Loses money on every order", `After product, shipping and ${FEES[CV.fee] ? FEES[CV.fee].label : "platform"} fees you'd make ${money(before)} per order before ads.`, [FEE_SRC_KEY[CV.fee]].filter(Boolean));
      else if (ads != null && profit <= 0) add("bad", "Ads cost more than the product earns", `You'd make ${money(before)} before ads, so ${money(ads)} per order in ads leaves ${money(profit)}.`);
      else add("ok", "Profit per order: " + money(profit), `Margin ${pct1(margin)}. Break-even ad cost: ${money(before)} per order. Following Meta's guidance (daily budget at least 10× cost per result), testing at that cost means about ${money(before * 10)} a day.`, ["metaBudget"]);
    } else add("info", "Profit not checked yet", "Enter the supplier price and your selling price.");
    if (maxD != null) {
      if (ch === "tiktok" && maxD > 6) add("bad", "Too slow for TikTok Shop US", `Supplier shipping is up to ${maxD} days. TikTok Shop US regular orders must be delivered within 6 business days of Awaiting Shipment.`, ["ttsFulfill"]);
      else if (ch === "tiktok") add("ok", "Fits TikTok Shop's delivery window", `Up to ${maxD} days of shipping, if that's business days and you ship within your handling time. Check it in the delivery planner.`, ["ttsFulfill"]);
      if (maxD > 30) add("warn", "Very long delivery", `Up to ${maxD} days. In the US, if you don't state a shipping time you must have a reasonable basis to ship within 30 days, so state the real time on the product page.`, ["ftcMail"]);
      else add("info", `Promise ${minD === maxD ? maxD : minD + "–" + maxD} days of shipping, plus your handling time`, "Show this on the product page and in your shipping policy. If an order will be late, send a delay notice before the promised date.", ["ftcMail"]);
    } else add("info", "Delivery time not entered", "Copy the delivery estimate to your customers' country from the supplier listing.");
    const home = p.country === "uk" ? "UK" : p.country === "us" ? "US" : null;
    if (from && from !== "ALL" && home && from !== home) {
      if (ch === "tiktok" && home === "US") add("bad", "Ships from outside the US", `Ships from ${from}. TikTok Shop US delivery deadlines make US stock the practical choice.`, ["ttsFulfill"]);
      else add("warn", `Ships from ${from}`, "For cross-border orders, tell customers about shipping times and any import or customs charges before they buy.", ["shopPolicies"]);
    }
    if (source && ["ebay", "amazon", "walmart", "etsy", "web"].includes(source)) {
      const where = RETAIL_SITES[source];
      if (ch === "ebay") add("bad", `Sourced from ${where}`, "eBay doesn't allow buying from another retailer or marketplace to fill an eBay order. You need a wholesale supplier agreement.", ["ebayDrop"]);
      else if (ch === "amazon") add("bad", `Sourced from ${where}`, "Amazon prohibits buying from another online retailer and having it ship to your customer unless you're identified as the seller of record.", ["amzDrop"]);
      else add("warn", `Listed by ${where}`, "This looks like a retail listing. Shopify notes that a supplier selling retail while claiming wholesale prices is probably another dropshipper reselling at a markup.", ["shopSuppliers"]);
    }
    if (source === "aliexpress" && ch === "ebay") add("bad", "Sourced from AliExpress", "AliExpress is a marketplace. eBay doesn't allow buying from another marketplace to fill an eBay order.", ["ebayDrop"]);
    if (ch === "etsy") add(p.model === "pod" ? "info" : "warn", "Etsy rules", "Only your original designs (or buyer personalisation) made by a production partner, disclosed on the listing.", ["etsyDrop"]);
    if (!ev.brandOk) add("warn", "Check for brands, logos and characters", "Tick the box once you've confirmed the product and photos use no brand, logo or character you don't own.", ["shopIP"]);
    if (!ev.sampleOk) add("info", "No sample yet", "Shopify recommends ordering a sample to judge quality before you sell.", ["shopSuppliers"]);
    return { checks, profit, margin, before, price, cost, ship, maxD, minD, source };
  }
  function toolEvaluate() {
    const p = st.profile;
    const sec = toolCard("Product evaluator", "For products you'd sell and ship. Paste the product link and copy the numbers from the listing; each check says where its rule comes from.");
    if (p && !SHIP(p)) sec.append(el("p", "small muted", "Your plan is " + MODEL_NAME[p.model].toLowerCase() + "; these checks use Shopify's rules for products you ship."));
    else if (p) sec.append(el("p", "small", "Checking against your plan: " + CHANNEL_NAME[p.channel] + ", " + (p.country === "us" ? "United States" : p.country === "uk" ? "United Kingdom" : "outside the US/UK") + "."));
    const grid = el("div", "calc"); const form = el("div", "fields"); const right = el("div"); right.style.display = "grid"; right.style.gap = "10px"; right.style.alignContent = "start";
    grid.append(form, right); sec.append(grid);
    const text = (key, label, opts = {}) => {
      const f = el("div", "field" + (opts.full ? " full" : ""));
      const l = el("label", "label", label); l.htmlFor = "e-" + key;
      const i = el("input"); i.type = opts.type === "url" ? "text" : opts.type || "text"; if (opts.type === "url") i.inputMode = "url"; i.id = "e-" + key; i.value = CV[key] || ""; if (opts.ph) i.placeholder = opts.ph;
      if (opts.type === "number") { i.step = "0.01"; i.min = "0"; i.inputMode = "decimal"; }
      i.addEventListener("input", () => cvSet(key, i.value));
      f.append(l, i); if (opts.hint) f.append(el("span", "small muted", opts.hint)); form.append(f); return i;
    };
    const linkIn = text("evLink", "Product link", { full: true, type: "url", ph: "https://" });
    const linkRow = el("div", "row-gap field full"); form.append(linkRow);
    const drawLinkRow = () => {
      linkRow.textContent = "";
      const u = safeUrl(CV.evLink);
      if (u) { linkRow.append(extLink({ label: "Open the listing", url: u })); const n = CV.evName ? encodeURIComponent(CV.evName) : ""; if (n) { linkRow.append(extLink({ label: "eBay sold prices", url: "https://www.ebay.com/sch/i.html?_nkw=" + n + "&LH_Sold=1&LH_Complete=1" }), extLink({ label: "Amazon", url: "https://www.amazon.com/s?k=" + n })); } }
      linkRow.append(el("span", "small muted", "This page can't read other websites, so copy the price and delivery time from the listing."));
    };
    linkIn.addEventListener("input", drawLinkRow);
    text("evName", "Product name", { full: true }).addEventListener("input", drawLinkRow);
    drawLinkRow();
    text("evCost", "Supplier price", { type: "number" });
    text("evShip", "Supplier shipping cost", { type: "number" });
    text("evMin", "Shipping time from (days)", { type: "number" });
    text("evMax", "Shipping time to (days)", { type: "number" });
    text("evFrom", "Ships from (country code)", { ph: "US, CN…" });
    text("evPrice", "Your selling price", { type: "number" });
    text("evAds", "Expected ad cost per order", { type: "number", hint: "Optional." });
    feeFields(form, () => draw());
    const tick = (label, prop, id) => { const l = el("label", "toggle field full"); const c = el("input"); c.type = "checkbox"; c.id = id; c.checked = ev[prop]; c.onchange = () => { ev[prop] = c.checked; draw(); }; l.append(c, document.createTextNode(label)); form.append(l); };
    tick("I checked: no brand, logo or character I don't own", "brandOk", "evBrand");
    tick("I've ordered or received a sample", "sampleOk", "evSample");
    const draw = () => {
      right.textContent = "";
      const res = evaluate();
      const sc = el("div", "score");
      const counts = { bad: 0, warn: 0, ok: 0, info: 0 }; res.checks.forEach((c) => counts[c.level]++);
      const head = el("div", "score-head");
      head.append(el("b", null, counts.bad ? `${counts.bad} problem${counts.bad > 1 ? "s" : ""} to fix` : counts.warn ? `${counts.warn} thing${counts.warn > 1 ? "s" : ""} to check` : "No problems found"));
      head.append(el("span", "small muted", "Based on what you entered; nothing here predicts sales."));
      sc.append(head);
      res.checks.forEach((c) => {
        const r = el("div", "check-row");
        const icon = el("span", "lvl lv-" + c.level, { bad: "Fix", warn: "Check", ok: "OK", info: "Note" }[c.level]);
        const body = el("div"); body.append(el("b", null, c.title), el("p", "small", c.text));
        if (c.src && c.src.length) { const s = el("span", "small"); c.src.forEach((k, i) => { if (!S[k]) return; const a = el("a", null, S[k][0]); a.href = S[k][1]; a.target = "_blank"; a.rel = "noopener"; if (i) s.append(" · "); s.append(a); }); body.append(s); }
        r.append(icon, body); sc.append(r);
      });
      right.append(sc);
      const act = el("div", "row-gap");
      const save = el("button", "btn primary sm", "Save to compare"); save.type = "button";
      save.onclick = async () => {
        if (!CV.evName) { toast("Add a product name first."); return; }
        const data = { name: CV.evName, link: safeUrl(CV.evLink) || "", source: res.source || "", price: res.price, cost: res.cost, ship: res.ship, minDays: res.minD, maxDays: res.maxD, shipsFrom: CV.evFrom || "", profit: res.profit, margin: res.margin, breakEven: res.before, bad: counts.bad, warn: counts.warn, fee: CV.fee, savedAt: today() };
        await saveProduct("p-" + uid2(), data); toast("Saved. It's in the list below.");
      };
      const aiB = el("button", "btn sm", ev.aiBusy ? "Thinking…" : "Get an AI second opinion"); aiB.type = "button"; aiB.disabled = ev.aiBusy;
      aiB.onclick = () => aiSecondOpinion(res, draw);
      act.append(save, aiB); right.append(act);
      if (ev.aiPrompt && aiMode() === "app") right.append(externalSteps(ev.aiPrompt));
      if (ev.aiText || ev.aiErr || (ev.aiPrompt && aiMode() === "app")) {
        const box = el("div", "ai");
        box.append(el("span", "label", "Second opinion · AI, check before relying on it"));
        if (aiMode() === "app") { const ta = el("textarea"); ta.rows = 6; ta.id = "evAiPaste"; ta.placeholder = "Paste the answer from your AI here."; ta.value = ev.aiText; ta.oninput = () => (ev.aiText = ta.value); ta.setAttribute("aria-label", "AI answer"); box.append(ta); }
        else box.append(el("div", "ai-text", ev.aiText));
        if (ev.aiErr) box.append(el("p", "small neg", ev.aiErr));
        right.append(box);
      }
    };
    form.addEventListener("input", draw);
    draw();
    sec.append(savedProductsBlock());
    return sec;
  }
  function evPrompt(res) {
    const p = st.profile || {};
    const facts = {
      product: CV.evName || "(not given)", link: CV.evLink || "(none)", sourceSite: res.source || "unknown",
      supplierPrice: res.cost, supplierShipping: res.ship, shippingDays: [res.minD, res.maxD], shipsFrom: CV.evFrom || "unknown",
      sellingPrice: res.price, platform: CHANNEL_NAME[p.channel] || "Shopify", sellerCountry: p.country || "unknown", model: MODEL_NAME[p.model] || "unknown",
      profitPerOrderAfterFees: res.before, checksAlreadyShown: res.checks.map((c) => c.level + ": " + c.title),
    };
    return "You are helping a beginner decide whether to sell one product. Use ONLY the data below. Do not invent statistics, prices, sales figures, trends or facts about the product or market; if something would matter but isn't in the data, say it's unknown and how to check it.\n\n" +
      "Write plain text, no markdown headings, under 220 words, in three short parts:\n1. Biggest risks (2-4 bullets starting with '- ')\n2. What to verify before listing (2-4 bullets)\n3. Questions to ask the supplier (2-3 bullets)\n\nDATA:\n" + JSON.stringify(facts, null, 1);
  }
  async function aiSecondOpinion(res, draw) {
    const prompt = evPrompt(res);
    ev.aiPrompt = prompt; ev.aiErr = "";
    if (aiMode() === "app") { ev.aiText = ""; draw(); return; }
    ev.aiBusy = true; ev.aiText = ""; draw();
    try {
      await sample(prompt, { onText: ({ text }) => { ev.aiText = text; const t = document.querySelector(".ai-text"); if (t) t.textContent = text; else draw(); } });
    } catch (e) { ev.aiText = e.text || ""; ev.aiErr = sampleErrCopy(e); }
    ev.aiBusy = false; draw();
  }
  const uid2 = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // Saved products
  const savedBox = { el: null };
  function savedProductsBlock() { const box = el("div"); box.style.display = "grid"; box.style.gap = "8px"; box.style.marginTop = "8px"; savedBox.el = box; drawSaved(); return box; }
  function drawSaved() {
    const box = savedBox.el; if (!box) return; box.textContent = "";
    box.append(el("h3", null, "Saved products"));
    const list = (st.products || []).slice().sort((a, b) => (b.profit ?? -1e9) - (a.profit ?? -1e9));
    if (!list.length) { box.append(el("p", "small muted", "Products you save appear here so you can compare them side by side.")); return; }
    const tw = el("div", "tablewrap"); const t = el("table");
    t.innerHTML = "<thead><tr><th>Product</th><th>Price</th><th>Profit / order</th><th>Margin</th><th>Shipping</th><th>Checks</th><th></th></tr></thead>";
    const tb = el("tbody");
    list.forEach((x) => {
      const tr = el("tr");
      const n = el("td"); const u = safeUrl(x.link); if (u) { const a = el("a", null, x.name); a.href = u; a.target = "_blank"; a.rel = "noopener"; n.append(a); } else n.textContent = x.name;
      n.append(el("br"), el("span", "small muted", "Saved " + fmtDay(x.savedAt)));
      tr.append(n, el("td", null, x.price != null ? money(x.price) : "—"), el("td", x.profit == null ? "" : x.profit >= 0 ? "pos" : "neg", x.profit != null ? money(x.profit) : "—"),
        el("td", null, x.margin != null ? pct1(x.margin) : "—"), el("td", null, x.maxDays != null ? (x.minDays !== x.maxDays && x.minDays != null ? x.minDays + "–" : "") + x.maxDays + " days" : "—"));
      const c = el("td"); if (x.bad) c.append(el("span", "pill late", x.bad + " to fix")); if (x.warn) c.append(" ", el("span", "pill waiting", x.warn + " to check")); if (!x.bad && !x.warn) c.append(el("span", "pill ok", "OK"));
      tr.append(c);
      const a = el("td");
      const load = el("button", "btn sm", "Open"); load.type = "button";
      load.onclick = () => { cvSet("evName", x.name); cvSet("evLink", x.link || ""); cvSet("evCost", x.cost ?? ""); cvSet("evShip", x.ship ?? ""); cvSet("evMin", x.minDays ?? ""); cvSet("evMax", x.maxDays ?? ""); cvSet("evFrom", x.shipsFrom || ""); cvSet("evPrice", x.price ?? ""); ev.aiText = ""; ev.aiPrompt = ""; renderTool(); window.scrollTo({ top: 0 }); };
      const d = el("button", "btn sm danger", "Delete"); d.type = "button"; d.setAttribute("aria-label", "Delete " + x.name); d.onclick = async () => { const data = strip(x); await deleteProduct(x.id); toast("Deleted " + x.name + ".", { undo: () => saveProduct(x.id, data) }); };
      a.append(load, " ", d); tr.append(a); tb.append(tr);
    });
    t.append(tb); tw.append(t); box.append(tw);
  }

  // --- Trend and demand check
  const GEOS = [["US", "United States"], ["GB", "United Kingdom"], ["CA", "Canada"], ["AU", "Australia"], ["", "Worldwide"]];
  function toolTrends() {
    const sec = toolCard("Trend and demand check", "Compare up to 5 ideas. Each search opens in a new tab with your keywords filled in, because other sites can't be shown inside this page.",
      ["trendsHelp", "metaLibHelp", "ttTopHelp"]);
    const form = el("form", "trend-form");
    const fld = (label, input) => { const d = el("div", "field"); const l = el("label", "label", label); l.htmlFor = input.id; d.append(l, input); form.append(d); return input; };
    const q = el("input"); q.type = "text"; q.id = "trQ"; q.value = CV.trQ || ""; q.placeholder = "Separate ideas with commas";
    fld("Keywords (up to 5)", q);
    const g = el("select"); g.id = "trGeo"; fill(g, GEOS); g.value = CV.trGeo ?? (st.profile && st.profile.country === "uk" ? "GB" : "US"); fld("Country", g);
    const go2 = el("button", "btn primary", "Show searches"); go2.type = "submit"; form.append(go2);
    sec.append(form);
    form.addEventListener("submit", (e) => { e.preventDefault(); cvSet("trQ", q.value); cvSet("trGeo", g.value); renderTool(); });
    const ts = (CV.trQ || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5); const geo = CV.trGeo ?? "US";
    if (ts.length) {
      const enc = (s) => encodeURIComponent(s);
      const box = el("div", "card-sub");
      const row = el("div", "links");
      row.append(extLink({ label: "Google Trends: compare all, past 12 months", url: "https://trends.google.com/trends/explore?date=today%2012-m" + (geo ? "&geo=" + geo : "") + "&q=" + ts.map(enc).join(",") }, "btn sm primary"));
      row.append(extLink({ label: "Google Trends: past 5 years", url: "https://trends.google.com/trends/explore?date=today%205-y" + (geo ? "&geo=" + geo : "") + "&q=" + ts.map(enc).join(",") }));
      row.append(extLink({ label: "TikTok Top Products", url: S.ttTop[1] }));
      box.append(row);
      const tw = el("div", "tablewrap"); const t = el("table");
      t.innerHTML = "<thead><tr><th>Keyword</th><th>Ads running now</th><th>Videos and posts</th><th>What sold</th><th>Marketplaces</th></tr></thead>";
      const tb = el("tbody");
      const cell = (items) => { const td = el("td"); items.forEach(([l, u], i) => { if (i) td.append(el("br")); td.append(extLink({ label: l, url: u }, "small")); }); return td; };
      ts.forEach((k) => {
        const r = el("tr"); r.append(el("td", null, k));
        r.append(
          cell([["Meta Ad Library", "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=" + (geo || "ALL") + "&q=" + enc(k) + "&search_type=keyword_unordered"]]),
          cell([["TikTok", "https://www.tiktok.com/search?q=" + enc(k)], ["YouTube", "https://www.youtube.com/results?search_query=" + enc(k)], ["Pinterest", "https://www.pinterest.com/search/pins/?q=" + enc(k)]]),
          cell([["eBay sold listings", "https://www.ebay.com/sch/i.html?_nkw=" + enc(k) + "&LH_Sold=1&LH_Complete=1"]]),
          cell([["Amazon", "https://www.amazon.com/s?k=" + enc(k)], ["Etsy", "https://www.etsy.com/search?q=" + enc(k)]]),
        );
        tb.append(r);
      });
      t.append(tb); tw.append(t); box.append(tw);
      box.append(el("p", "small muted", "Reading Google Trends: scores run 0–100 and show interest relative to the highest point in the chart, not search volume. Choose a topic rather than a search term when Trends offers one. eBay's sold listings show what actually sold recently and for how much."));
      sec.append(box);
    } else sec.append(el("p", "small muted", "Enter your ideas and press Show searches."));
    return finish(sec);
  }

  // --- AI tools: Claude inside the app, or the viewer's own AI
  const wr = { busy: false, text: "", err: "", ctl: null, prompt: "", tool: "" };
  function textToHtml(t) {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let out = "";
    t.trim().split(/\n\s*\n/).forEach((b) => {
      const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length && lines.every((l) => /^[-•*] /.test(l))) out += "<ul>" + lines.map((l) => "<li>" + esc(l.replace(/^[-•*] /, "")) + "</li>").join("") + "</ul>";
      else out += "<p>" + esc(lines.join(" ")) + "</p>";
    });
    return out;
  }
  function aiBar(sec) {
    const bar = el("div", "ai-bar");
    bar.append(el("span", "small", "Using: "), el("b", "small", aiLabel()));
    const b = el("button", "btn sm", "Change"); b.type = "button"; b.onclick = openAiSettings; bar.append(b);
    sec.append(bar);
  }
  function writerShell(sec, toolId, fields, buildPrompt, opts = {}) {
    if (wr.tool !== toolId) { wr.tool = toolId; wr.text = ""; wr.err = ""; wr.prompt = ""; }
    aiBar(sec);
    const { form, out } = calcLayout(sec);
    fields(form);
    const row = el("div", "row-gap field full");
    const external = aiMode() === "app";
    const go2 = el("button", "btn primary sm", wr.busy ? "Writing…" : external ? "Make the prompt" : "Write it"); go2.type = "button"; go2.disabled = wr.busy;
    const stop = el("button", "btn sm", "Stop"); stop.type = "button"; stop.hidden = !wr.busy; stop.onclick = () => wr.ctl && wr.ctl.abort();
    row.append(go2, stop); form.append(row);
    out.append(el("span", "label", (opts.outLabel || "Draft") + " · AI, check every fact before you use it"));
    if (external && wr.prompt) out.append(externalSteps(wr.prompt));
    const ta = el("textarea"); ta.id = "wOut"; ta.rows = 12; ta.value = wr.text; ta.setAttribute("aria-label", "AI answer");
    ta.placeholder = wr.busy ? "Thinking…" : external ? "Paste the answer from your AI here. You can edit it." : "Your draft appears here. You can edit it.";
    ta.oninput = () => (wr.text = ta.value);
    out.append(ta);
    if (wr.err) out.append(el("p", "small neg", wr.err));
    const r = el("div", "row-gap");
    const copy = el("button", "btn sm", "Copy"); copy.type = "button";
    copy.onclick = () => copyText(ta.value, ta).then((ok) => toast(ok ? "Copied." : "Press Ctrl+C or Cmd+C to copy."));
    r.append(copy); if (opts.extra) opts.extra(r, ta); out.append(r);
    go2.onclick = async () => {
      const prompt = buildPrompt(); if (!prompt) return;
      wr.prompt = prompt; wr.err = "";
      if (aiMode() === "app") { renderTool(); return; }
      wr.busy = true; wr.text = ""; wr.ctl = new AbortController(); renderTool();
      try {
        await sample(prompt, { signal: wr.ctl.signal, cache: false, onText: ({ text }) => { wr.text = text; const t = $("#wOut"); if (t) t.value = text; } });
      } catch (e) { wr.text = e.text || wr.text; wr.err = sampleErrCopy(e); }
      wr.busy = false; renderTool();
    };
  }
  const RULES_TEXT = "Use ONLY the facts provided. Do not invent specifications, materials, measurements, certifications, awards, health or safety claims, reviews, testimonials, statistics, discounts or shipping promises. If an important fact is missing, write [ADD: what's missing] instead of guessing.";
  function wText(form, key, label, opts = {}) {
    const f = el("div", "field" + (opts.full ? " full" : "")); const l = el("label", "label", label); l.htmlFor = "w-" + key;
    const i = el(opts.area ? "textarea" : "input"); if (!opts.area) i.type = "text"; else i.rows = opts.rows || 5; i.id = "w-" + key; i.value = CV[key] || ""; i.oninput = () => cvSet(key, i.value);
    f.append(l, i); if (opts.hint) f.append(el("span", "small muted", opts.hint)); form.append(f); return i;
  }
  function wSelect(form, key, label, options, def) {
    const f = el("div", "field"); const l = el("label", "label", label); l.htmlFor = "w-" + key;
    const s = el("select"); s.id = "w-" + key; fill(s, options); s.value = CV[key] || def; s.onchange = () => cvSet(key, s.value);
    f.append(l, s); form.append(f);
  }
  function toolDescribe() {
    const sec = toolCard("Description writer", "AI drafts a product or listing description from facts you paste in (from the supplier's listing, your sample or the item in front of you).");
    writerShell(sec, "describe", (form) => {
      wText(form, "wName", "Product name", { full: true });
      wText(form, "wFacts", "Facts about the product", { full: true, area: true, hint: "Specs, materials, sizes, condition, what's included. Only what you can confirm." });
      wText(form, "wWho", "Who it's for", { full: true });
      wSelect(form, "wTone", "Tone", [["friendly", "Friendly"], ["calm", "Calm and simple"], ["premium", "Premium"], ["playful", "Playful"]], "friendly");
    }, () => {
      if (!(CV.wFacts || "").trim()) { toast("Paste some facts about the product first."); return null; }
      return `Write a product page description for an online listing. ${RULES_TEXT}\n\nFormat: a 1-2 sentence opening paragraph, then a blank line, then 3-6 bullet lines each starting with "- ", then a blank line and one short closing sentence. Plain text only, no headings, no emojis, under 170 words. Tone: ${CV.wTone || "friendly"}.\n\nProduct name: ${CV.wName || "(not given)"}\nWho it's for: ${CV.wWho || "(not given)"}\nFacts:\n${(CV.wFacts || "").slice(0, 4000)}`;
    }, {
      extra: (r, ta) => {
        const h = el("button", "btn sm", "Copy as HTML"); h.type = "button";
        h.onclick = () => { if (/\[ADD:/i.test(ta.value)) toast("Fill in the [ADD: …] gaps first."); copyText(textToHtml(ta.value)).then((ok) => toast(ok ? "HTML copied. Paste it into your store's description editor (HTML view)." : "Couldn't copy.")); };
        r.append(h);
      },
    });
    return sec;
  }
  function toolHooks() {
    const sec = toolCard("Video hooks and captions", "AI drafts opening lines for short videos and captions to post with them, from the facts you give.");
    writerShell(sec, "hooks", (form) => {
      wText(form, "wName", "Product name", { full: true });
      wText(form, "wFacts", "Facts about the product", { full: true, area: true, hint: "What it does and the problem it solves. Only what you can confirm." });
      wText(form, "wWho", "Who it's for", { full: true });
      wSelect(form, "wPlat", "Platform", [["TikTok", "TikTok"], ["Instagram Reels", "Instagram Reels"], ["YouTube Shorts", "YouTube Shorts"], ["Pinterest", "Pinterest"]], "TikTok");
    }, () => {
      if (!(CV.wFacts || "").trim()) { toast("Paste some facts about the product first."); return null; }
      const aff = st.profile && st.profile.model === "affiliate";
      return `Write material for short ${CV.wPlat || "TikTok"} videos about one product. ${RULES_TEXT} Don't write fake customer reactions or pretend to be a customer.${aff ? " The creator earns affiliate commission, so include a short spoken disclosure line such as \"I earn a commission if you buy through my link\" and put \"#ad\" at the start of each caption." : ""}\n\nGive: 6 hooks (the first spoken line, each under 12 words, each starting with "- "), then a blank line, then 3 captions under 150 characters each starting with "- ", then a blank line, then one line of 5 relevant hashtags. Plain text, no headings.\n\nProduct name: ${CV.wName || "(not given)"}\nWho it's for: ${CV.wWho || "(not given)"}\nFacts:\n${(CV.wFacts || "").slice(0, 4000)}`;
    }, { outLabel: "Hooks and captions" });
    return sec;
  }
  function toolHelper() {
    const sec = toolCard("Ask AI about your plan", "Ask anything about your next steps. The AI gets your answers and your open tasks as context, and is told not to make up facts.");
    writerShell(sec, "helper", (form) => {
      wText(form, "wAsk", "Your question", { full: true, area: true, rows: 4 });
    }, () => {
      const q = (CV.wAsk || "").trim(); if (!q) { toast("Type a question first."); return null; }
      const p = st.profile;
      const open = st.tasks.filter((t) => t.status !== "done").sort(sortTasks).slice(0, 15).map((t) => "- " + t.title + (t.due ? " (due " + t.due + ")" : ""));
      const ctx = p ? `Way of making money: ${MODEL_NAME[p.model]}. Where: ${CHANNEL_NAME[p.channel]}. Stage: ${labelFor("level", p.level)}. Country: ${labelFor("country", p.country)}. Paid ads this week: ${p.ads === "some" ? "yes" : "no"}.` : "The person hasn't answered the setup questions yet.";
      return `You are a practical coach for someone starting a small online business. Answer the question below in plain language, in under 250 words, with concrete next steps. Don't promise income or results. Don't state prices, fees, rules or statistics unless you are sure; if they matter, tell the person to check the platform's own help pages. If the question is outside what you can answer reliably, say so.\n\nContext: ${ctx}\nToday: ${today()}\nOpen tasks:\n${open.join("\n") || "(none)"}\n\nQuestion: ${q.slice(0, 2000)}`;
    }, { outLabel: "Answer" });
    return sec;
  }

  // --- Directory
  function toolDirectory() {
    const p = st.profile; const box = el("section"); box.style.display = "grid"; box.style.gap = "10px";
    const head = el("div", "section-head"); head.append(el("h2", null, "Sites and apps"));
    if (p) {
      const lab = el("label", "toggle"); const cb = el("input"); cb.type = "checkbox"; cb.id = "allTools"; cb.checked = st.ui.allTools;
      cb.onchange = () => { st.ui.allTools = cb.checked; saveUi(); renderTool(); };
      lab.append(cb, document.createTextNode("Show all, not just my plan")); head.append(lab);
    }
    box.append(head, el("p", "small muted", "Costs checked " + CHECKED + ". Sites open in a new tab, because other sites can't be shown inside this page. The Sites tab has a quick launcher and your saved links."));
    const list = TOOLS.filter((t) => !p || st.ui.allTools || t.fit(p));
    [...new Set(list.map((t) => t.cat))].forEach((cat) => {
      box.append(el("h3", null, cat));
      const g = el("div", "grid");
      list.filter((t) => t.cat === cat).forEach((t) => {
        const c = el("article", "item");
        c.append(el("h3", null, t.name), el("p", "small", t.desc)); if (t.cost) c.append(el("span", "cost", t.cost));
        const f = el("div", "foot"); f.append(extLink({ label: "Open " + t.name, url: t.url, name: t.name }));
        c.append(f); g.append(c);
      });
      box.append(g);
    });
    return box;
  }

  // ----- Sites tab: a launcher for every site, plus saved and recent sites
  let siteQ = "";
  function renderSites() {
    const wrap = el("div"); wrap.style.display = "grid"; wrap.style.gap = "18px";
    const card = el("section", "card");
    card.append(el("h2", null, "Open a site"));
    card.append(el("p", "small muted", "Search every site in the app, type a web address, or search the web. Sites open in a new tab; this page can't show other websites inside it, because browsers and most sites block that for security. Come back to this tab when you're done."));
    const form = el("form", "launch"); form.autocomplete = "off";
    const inp = el("input"); inp.type = "search"; inp.id = "siteQ"; inp.placeholder = "Shopify, eBay, chatgpt.com…"; inp.value = siteQ; inp.setAttribute("aria-label", "Site name, web address or search");
    const res = el("div", "launch-results");
    form.append(inp); card.append(form, res);
    const drawRes = () => {
      res.textContent = "";
      const q = siteQ.trim().toLowerCase();
      if (!q) return;
      const items = [];
      const u = /\s/.test(q) ? null : (q.includes(".") ? safeUrl(siteQ.trim()) : null);
      if (u) items.push({ name: "Go to " + u.replace(/^https?:\/\//, "").replace(/\/$/, ""), url: u, desc: "Web address" });
      const pool = st.links.map((l) => ({ name: l.name, url: l.url, desc: "Saved site" })).concat(TOOLS.map((t) => ({ name: t.name, url: t.url, desc: t.desc })));
      pool.filter((x) => (x.name + " " + x.desc + " " + x.url).toLowerCase().includes(q)).slice(0, 8).forEach((x) => items.push(x));
      items.push({ name: "Search the web for “" + siteQ.trim() + "”", url: "https://www.google.com/search?q=" + encodeURIComponent(siteQ.trim()), desc: "Google" });
      items.forEach((x, i) => {
        const a = extLink({ label: x.name, url: x.url, name: x.name }, "launch-item" + (i === 0 ? " first" : ""));
        a.append(el("span", "small muted", x.desc)); res.append(a);
      });
    };
    inp.oninput = () => { siteQ = inp.value; drawRes(); };
    form.addEventListener("submit", (e) => { e.preventDefault(); const f = res.querySelector("a.first"); if (f) f.click(); });
    drawRes();
    wrap.append(card);

    // Saved sites
    const saved = el("section", "card");
    saved.append(el("h2", null, "My sites"));
    const sf = el("form", "add-site"); sf.autocomplete = "off"; sf.noValidate = true;
    const n = el("input"); n.type = "text"; n.id = "lnName"; n.placeholder = "Name"; n.setAttribute("aria-label", "Site name");
    const u = el("input"); u.type = "url"; u.id = "lnUrl"; u.placeholder = "https://"; u.setAttribute("aria-label", "Web address");
    const b = el("button", "btn primary", "Save site"); b.type = "submit";
    sf.append(n, u, b); saved.append(sf);
    sf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const url = safeUrl(u.value); if (!url) { toast("Enter a valid web address."); u.focus(); return; }
      const name = n.value.trim() || new URL(url).hostname.replace(/^www\./, "");
      n.value = ""; u.value = "";
      await putDoc("links", "l-" + uid2(), { name, url, addedAt: today() });
      toast("Saved " + name + ".");
    });
    if (!st.links.length) saved.append(el("p", "small muted", "Save the sites you use most, such as your store's dashboard or supplier, to open them from here."));
    else {
      const g = el("div", "site-list");
      st.links.slice().sort((a, b2) => a.name.localeCompare(b2.name)).forEach((l) => {
        const r = el("div", "site-row");
        const url = safeUrl(l.url);
        if (url) r.append(extLink({ label: l.name, url, name: l.name }, "site-link"));
        r.append(el("span", "small muted", (url || "").replace(/^https?:\/\//, "").slice(0, 60)));
        const d = el("button", "btn sm danger", "Remove"); d.type = "button"; d.setAttribute("aria-label", "Remove " + l.name); d.onclick = async () => { const data = strip(l); await delDoc("links", l.id); toast("Removed " + l.name + ".", { undo: () => putDoc("links", l.id, data) }); };
        r.append(d); g.append(r);
      });
      saved.append(g);
    }
    wrap.append(saved);

    if (recent.length) {
      const rc = el("section", "card"); rc.append(el("h2", null, "Recently opened"));
      const g = el("div", "chips"); recent.forEach((x) => g.append(extLink({ label: x.name, url: x.url, name: x.name }, "chip"))); rc.append(g);
      const clr = el("button", "btn sm", "Clear"); clr.type = "button"; clr.onclick = () => { recent.splice(0); lsSet("dd-recent", recent); render(); }; rc.append(clr);
      wrap.append(rc);
    }

    const p = st.profile;
    const forYou = p ? TOOLS.filter((t) => t.fit(p)) : TOOLS.filter((t) => t.cat === "Sell" && !t.dash);
    const fy = el("section", "card");
    fy.append(el("h2", null, p ? "Sites for your plan" : "Popular places to sell"));
    const g = el("div", "grid");
    forYou.forEach((t) => { const c = el("article", "item"); c.append(el("h3", null, t.name), el("p", "small", t.desc)); const f = el("div", "foot"); f.append(extLink({ label: "Open", url: t.url, name: t.name })); c.append(f); g.append(c); });
    fy.append(g);
    const all = el("button", "btn sm", "See every site and app"); all.type = "button"; all.onclick = () => openTool("directory"); fy.append(all);
    wrap.append(fy);
    return wrap;
  }
  // --- Delivery dates and holiday deadlines (US business days)
  function nthWeekday(y, m, wd, n) {
    if (n > 0) { const d = new Date(y, m, 1); return new Date(y, m, 1 + ((wd - d.getDay() + 7) % 7) + (n - 1) * 7); }
    const last = new Date(y, m + 1, 0); return new Date(y, m, last.getDate() - ((last.getDay() - wd + 7) % 7));
  }
  function observed(d) { const w = d.getDay(); return w === 6 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1) : w === 0 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) : d; }
  function usHolidays(y) {
    return [["New Year's Day", observed(new Date(y, 0, 1))], ["Martin Luther King Jr. Day", nthWeekday(y, 0, 1, 3)], ["Washington's Birthday", nthWeekday(y, 1, 1, 3)],
      ["Memorial Day", nthWeekday(y, 4, 1, -1)], ["Juneteenth", observed(new Date(y, 5, 19))], ["Independence Day", observed(new Date(y, 6, 4))],
      ["Labor Day", nthWeekday(y, 8, 1, 1)], ["Columbus Day", nthWeekday(y, 9, 1, 2)], ["Veterans Day", observed(new Date(y, 10, 11))],
      ["Thanksgiving Day", nthWeekday(y, 10, 4, 4)], ["Christmas Day", observed(new Date(y, 11, 25))]].map(([n, d]) => [n, iso(d)]);
  }
  const HOL = new Set(); [0, 1, 2].forEach((k) => usHolidays(new Date().getFullYear() - 1 + k).forEach(([, d]) => HOL.add(d)));
  usHolidays(new Date().getFullYear() + 2).forEach(([, d]) => HOL.add(d));
  const isBiz = (s) => { const w = parse(s).getDay(); return w !== 0 && w !== 6 && !HOL.has(s); };
  function addBiz(s, n) { let d = s; let k = 0; while (k < n) { d = addDays(d, 1); if (isBiz(d)) k++; } return d; }
  function bizBetween(a, b) { let n = 0, d = a; while (d < b) { d = addDays(d, 1); if (isBiz(d)) n++; } return n; }
  function deliverBy(order, handling, shipDays, unit) { const ship = addBiz(order, handling); return unit === "business" ? addBiz(ship, shipDays) : addDays(ship, shipDays); }

  function toolDelivery() {
    const sec = toolCard("Delivery dates and holiday deadlines", "Work out the delivery window to promise, and the last day to order for gift dates. Business days skip weekends and US federal holidays (the definition TikTok Shop US uses).",
      ["ftcMail", "ttsFulfill"]);
    const { form, out } = calcLayout(sec);
    const dateF = el("div", "field"); const dl = el("label", "label", "Order date"); dl.htmlFor = "dOrder";
    const di = el("input"); di.type = "date"; di.id = "dOrder"; di.value = CV.dOrder || today(); di.oninput = () => cvSet("dOrder", di.value);
    dateF.append(dl, di); form.append(dateF);
    numField(form, "handling", "Handling time (business days)", { step: "1", hint: "Days until the supplier ships." });
    numField(form, "shipMin", "Shipping time from (days)", { step: "1" });
    numField(form, "shipMax", "Shipping time to (days)", { step: "1" });
    const uf = el("div", "field"); const ul2 = el("label", "label", "Shipping days are"); ul2.htmlFor = "dUnit";
    const us = el("select"); us.id = "dUnit"; fill(us, [["calendar", "Calendar days"], ["business", "Business days"]]); us.value = CV.dUnit || "calendar"; us.onchange = () => { cvSet("dUnit", us.value); calc(); };
    uf.append(ul2, us); form.append(uf);
    const calc = () => {
      out.textContent = "";
      const order = CV.dOrder || today(), H = nv("handling") ?? 0, a = nv("shipMin"), b = nv("shipMax") ?? nv("shipMin"), unit = CV.dUnit || "calendar";
      if (a == null && b == null) { out.append(el("p", "muted", "Enter the supplier's shipping time to see your delivery window.")); return; }
      const lo = a ?? b, hi = b ?? a;
      const shipDate = addBiz(order, H), first = deliverBy(order, H, lo, unit), last = deliverBy(order, H, hi, unit);
      oLine(out, "Supplier ships by", fmtDay(shipDate));
      oBig(out, "Delivery window", fmtDay(first) + (first !== last ? " – " + fmtDay(last) : ""));
      const bd = bizBetween(order, last), cd = Math.round((parse(last) - parse(order)) / 864e5);
      oLine(out, "Promise customers", (lo === hi ? hi : lo + "–" + hi) + (unit === "business" ? " business" : "") + " days shipping + " + H + " business days handling");
      oLine(out, "Latest delivery after the order", bd + " business days (" + cd + " calendar days)");
      if (st.profile && st.profile.channel === "tiktok") {
        if (bd > 6) out.append(el("p", "small neg", "Too slow for TikTok Shop US: regular orders must be delivered within 6 business days of Awaiting Shipment."));
        else out.append(el("p", "small pos", "Within TikTok Shop US's 6-business-day delivery window."));
      }
      if (cd > 30) out.append(el("p", "small neg", "Over 30 days. Under the FTC's Mail Order Rule you must state this time clearly, because with no stated time you need a basis to ship within 30 days."));

      const y = parse(order).getFullYear(); const events = [];
      [y, y + 1].forEach((yy) => {
        const tg = nthWeekday(yy, 10, 4, 4);
        events.push(["Black Friday (sale event)", iso(new Date(yy, 10, tg.getDate() + 1)), false]);
        events.push(["Cyber Monday (sale event)", iso(new Date(yy, 10, tg.getDate() + 4)), false]);
        events.push(["Christmas Day", iso(new Date(yy, 11, 25)), true]);
        events.push(["Valentine's Day", iso(new Date(yy, 1, 14)), true]);
        events.push(["Mother's Day (US)", iso(nthWeekday(yy, 4, 0, 2)), true]);
        events.push(["Father's Day (US)", iso(nthWeekday(yy, 5, 0, 3)), true]);
      });
      const upcoming = events.filter(([, d]) => d >= order && d <= addDays(order, 366)).sort((p, q) => p[1].localeCompare(q[1]));
      const h = el("h3", null, "Gift dates and sale events (next 12 months)"); h.style.marginTop = "8px"; out.append(h);
      const t = el("table"); t.innerHTML = "<thead><tr><th>Date</th><th>Event</th><th>Last order date to arrive in time</th></tr></thead>";
      const tb = el("tbody");
      upcoming.forEach(([name, d, gift]) => {
        let lastOrder = "—";
        if (gift) {
          let o = d; let guard = 0;
          while (deliverBy(o, H, hi, unit) > d && guard < 200) { o = addDays(o, -1); guard++; }
          lastOrder = o < today() ? "Passed" : fmtDay(o);
        }
        const row = el("tr"); row.append(el("td", null, fmtDay(d)), el("td", null, name), el("td", lastOrder === "Passed" ? "neg" : "", gift ? lastOrder : "Plan stock and ads before this date"));
        tb.append(row);
      });
      t.append(tb); const tw = el("div", "tablewrap"); tw.append(t); out.append(tw);
      out.append(el("p", "small muted", "Uses your slowest shipping time. Carriers can be slower around holidays, so leave extra room."));
    };
    form.addEventListener("input", calc); calc();
    return finish(sec);
  }

  // --- Customer message templates
  function toolMessages() {
    const sec = toolCard("Customer message templates", "Fill in the details, then copy the message into your email or chat. The delay notice includes what the FTC's Mail Order Rule requires.", ["ftcMail"]);
    const { form, out } = calcLayout(sec);
    const tf = el("div", "field full"); const tl = el("label", "label", "Message"); tl.htmlFor = "mT";
    const ts = el("select"); ts.id = "mT"; fill(ts, [["delay", "Shipping delay notice (US rule)"], ["shipped", "Order shipped, with tracking"], ["wismo", "Reply: where is my order?"], ["refund", "Refund confirmation"], ["offer", "Reply to a low offer (reselling)"]]);
    ts.value = CV.mT || "delay"; ts.onchange = () => { cvSet("mT", ts.value); renderTool(); };
    tf.append(tl, ts); form.append(tf);
    const t = (key, label, opts = {}) => {
      const f = el("div", "field" + (opts.full ? " full" : "")); const l = el("label", "label", label); l.htmlFor = "m-" + key;
      const i = el("input"); i.type = opts.type || "text"; i.id = "m-" + key; i.value = CV[key] || (opts.def || ""); i.oninput = () => { cvSet(key, i.value); draw(); };
      f.append(l, i); if (opts.hint) f.append(el("span", "small muted", opts.hint)); form.append(f);
    };
    t("mName", "Customer first name"); t("mOrder", "Order number");
    t("mStore", "Your shop or store name");
    const kind = ts.value;
    if (kind === "delay") {
      t("mOrig", "Date you originally promised", { type: "date" });
      t("mNew", "New ship date", { type: "date", hint: "Leave empty if you can't give one." });
      t("mCancel", "How to cancel", { full: true, def: "reply to this email", hint: "Must cost the customer nothing." });
    }
    if (kind === "shipped" || kind === "wismo") { t("mCarrier", "Carrier"); t("mTrack", "Tracking link", { full: true }); t("mEta", "Expected delivery", { type: "date" }); }
    if (kind === "refund") { t("mAmount", "Refund amount"); }
    if (kind === "offer") { t("mCounter", "Your counter-offer"); }
    const draw = () => {
      out.textContent = "";
      const name = CV.mName || "there", ord = CV.mOrder ? "#" + String(CV.mOrder).replace(/^#/, "") : "your order", storeName = CV.mStore || "our store";
      let msg = "";
      if (kind === "delay") {
        const orig = CV.mOrig, nd = CV.mNew;
        const within30 = orig && nd && Math.round((parse(nd) - parse(orig)) / 864e5) <= 30;
        msg = `Hi ${name},\n\nWe're sorry: we can't ship ${ord} by ${orig ? fmtDay(orig) : "the date we promised"}.\n\n` +
          (nd ? `Our new expected ship date is ${fmtDay(nd)}.\n\n` : "We can't give you a new ship date yet.\n\n") +
          `You can choose to wait, or cancel your order and get a full refund. To cancel, ${CV.mCancel || "reply to this email"} at no cost to you.\n\n` +
          (within30 ? `If we don't hear from you, we'll take that as your agreement to wait until the new date.\n\n` : `Please reply to let us know you're happy to wait. If we haven't heard from you by ${orig ? fmtDay(orig) : "the original promised date"}, we'll cancel the order and refund you in full.\n\n`) +
          `Thank you for your patience,\n${storeName}`;
        out.append(el("p", "small muted", within30 ? "First delay with a definite new date within 30 days: the FTC lets you treat no reply as agreement, but only if the notice says so (it does)." : "No date, or more than 30 days later: the FTC requires the customer's actual agreement, so this version asks them to reply. Send it before the original promised date."));
      } else if (kind === "shipped") {
        msg = `Hi ${name},\n\nGood news: ${ord} has shipped${CV.mCarrier ? " with " + CV.mCarrier : ""}.\n\n` + (CV.mTrack ? `Track it here: ${CV.mTrack}\n\n` : "") + (CV.mEta ? `Expected delivery: ${fmtDay(CV.mEta)}.\n\n` : "") + `Thanks for your order,\n${storeName}`;
      } else if (kind === "wismo") {
        msg = `Hi ${name},\n\nThanks for checking in about ${ord}. It's on its way${CV.mCarrier ? " with " + CV.mCarrier : ""}.\n\n` + (CV.mTrack ? `You can follow it here: ${CV.mTrack}\n\n` : "") + (CV.mEta ? `It's expected to arrive by ${fmtDay(CV.mEta)}. ` : "") + `If it hasn't arrived by then, reply to this email and we'll sort it out.\n\n${storeName}`;
      } else if (kind === "offer") {
        msg = `Hi ${name},\n\nThanks for your offer. I can't go that low, but I can do ${CV.mCounter ? money(Number(String(CV.mCounter).replace(/[^0-9.]/g, ""))) : "[your price]"}. It's priced from recent sold listings for the same item and condition.\n\nLet me know if that works for you.\n${storeName}`;
      } else {
        msg = `Hi ${name},\n\nWe've refunded ${CV.mAmount ? money(Number(String(CV.mAmount).replace(/[^0-9.]/g, ""))) : "your payment"} for ${ord} to your original payment method. Your bank or card provider decides how long it takes to appear.\n\nIf there's anything else we can help with, just reply to this email.\n\n${storeName}`;
      }
      const ta = el("textarea"); ta.id = "mOut"; ta.rows = 12; ta.value = msg; ta.readOnly = true; ta.setAttribute("aria-label", "Message text");
      const copy = el("button", "btn primary sm", "Copy message"); copy.type = "button";
      copy.onclick = () => { navigator.clipboard.writeText(ta.value).then(() => toast("Copied."), () => { ta.focus(); ta.select(); toast("Press Ctrl+C or Cmd+C to copy."); }); };
      out.prepend(ta, copy);
    };
    draw();
    return finish(sec);
  }


  // ---------------------------------------------------------------------------
  // Motion: small, purposeful animations. All of it is skipped when the viewer
  // has asked their device for reduced motion.
  // ---------------------------------------------------------------------------
  const calm = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const fxHost = () => [...document.querySelectorAll("dialog[open]")].pop() || document.body;
  const FX_COLORS = ["var(--accent)", "var(--signal)", "var(--ok)", "var(--warn)"];
  function burst(from) {
    if (calm() || !from || !from.getBoundingClientRect) return;
    const r = from.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const layer = el("div", "fx-layer"); layer.setAttribute("aria-hidden", "true"); fxHost().append(layer);
    for (let i = 0; i < 12; i++) {
      const d = el("i", "fx-dot"); d.style.left = cx - 3 + "px"; d.style.top = cy - 3 + "px"; d.style.background = FX_COLORS[i % FX_COLORS.length];
      layer.append(d);
      const a = (i / 12) * Math.PI * 2, dist = 22 + (i % 3) * 8;
      d.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) scale(.3)`, opacity: 0 }], { duration: 560, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    setTimeout(() => layer.remove(), 650);
  }
  function celebrate(title, sub) {
    const host = fxHost();
    const card = el("div", "cheer"); card.setAttribute("role", "status"); card.append(el("b", null, title)); if (sub) card.append(el("span", "small muted", sub));
    host.append(card);
    if (!calm()) {
      card.animate([{ opacity: 0, transform: "translate(-50%, 16px) scale(.92)" }, { opacity: 1, transform: "translate(-50%, 0) scale(1)" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
      const layer = el("div", "fx-layer"); layer.setAttribute("aria-hidden", "true"); host.append(layer);
      const W = window.innerWidth;
      for (let i = 0; i < 46; i++) {
        const d = el("i", "fx-dot"); d.style.left = W / 2 + "px"; d.style.top = window.innerHeight * 0.26 + "px"; d.style.background = FX_COLORS[i % FX_COLORS.length];
        d.style.width = 6 + (i % 3) * 2 + "px"; d.style.height = 9 + (i % 2) * 4 + "px"; layer.append(d);
        const dx = (Math.random() - 0.5) * Math.min(W, 900), up = -80 - Math.random() * 140, down = 260 + Math.random() * 260, rot = (Math.random() - 0.5) * 720;
        d.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: `translate(${dx * 0.6}px, ${up}px) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.35 }, { transform: `translate(${dx}px, ${down}px) rotate(${rot}deg)`, opacity: 0 }], { duration: 1500 + Math.random() * 500, easing: "cubic-bezier(.25,.6,.3,1)" });
      }
      setTimeout(() => layer.remove(), 2100);
    }
    setTimeout(() => { if (!calm()) card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }); setTimeout(() => card.remove(), 290); }, 2300);
  }
  function countUp(node, to, fmt = (v) => String(Math.round(v)), from = 0) {
    if (calm() || to === from) { node.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 700;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); node.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
    node.textContent = fmt(from); requestAnimationFrame(step);
  }
  // Sets a style after first paint so CSS transitions play from the start value.
  function later(fn, animate) { if (animate && !calm()) requestAnimationFrame(() => requestAnimationFrame(fn)); else fn(); }
  function positionInk() {
    const tabs = $("#tabs"); if (!tabs) return;
    let ink = $("#tabInk"); if (!ink) { ink = el("span", "tab-ink"); ink.id = "tabInk"; ink.setAttribute("aria-hidden", "true"); tabs.append(ink); }
    const b = tabs.querySelector('button[aria-selected="true"]'); if (!b || !b.offsetWidth) return;
    ink.style.width = b.offsetWidth - 16 + "px"; ink.style.transform = "translateX(" + (b.offsetLeft + 8) + "px)";
  }
  window.addEventListener("resize", () => positionInk());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => positionInk());

  // ---------------------------------------------------------------------------
  // Milestones: earned from what people actually do; kept in their account.
  // ---------------------------------------------------------------------------
  const oneOffPlan = () => st.tasks.filter((t) => t.source === "plan" && STEP[t.step] && !STEP[t.step].ongoing);
  const BADGES = [
    ["first-step", "First step", "Finish any plan step", () => oneOffPlan().some((t) => t.status === "done")],
    ["day-one", "Day 1 done", "Finish every Day 1 step", () => { const d1 = oneOffPlan().filter((t) => t.day === 1); return d1.length > 0 && d1.every((t) => t.status === "done"); }],
    ["own-task", "Your own task", "Add a task of your own", () => st.tasks.some((t) => t.source === "custom")],
    ["toolkit", "Toolkit ready", "Choose 3 sites or tools for your steps", () => Object.keys((st.profile && st.profile.choices) || {}).length >= 3],
    ["three-days", "Three active days", "Finish tasks on 3 different days", () => new Set(st.tasks.filter((t) => t.status === "done" && t.doneAt).map((t) => t.doneAt)).size >= 3],
    ["researcher", "Product researcher", "Save a product in the evaluator", () => st.products.length > 0],
    ["reader", "Reader", "Read 3 lessons", () => Object.keys(st.learn).filter((k) => k.startsWith("lesson-")).length >= 3],
    ["finisher", "Plan finished", "Finish every step of your 7-day plan", () => { const one = oneOffPlan(); return one.length > 0 && one.every((t) => t.status === "done"); }],
  ];
  const BADGE_ICON = {
    "first-step": "M9 17l5 5 9-11", "day-one": "M12 10h4v13M12 23h8", "own-task": "M16 9v14M9 16h14", toolkit: "M10 12h12v10H10zM13 12v-2h6v2",
    "three-days": "M9 21l4-6 4 3 6-8", researcher: "M14 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M18 18l5 5", reader: "M9 10h6a3 3 0 0 1 3 3v10a2 2 0 0 0-2-2H9zM23 10h-5", finisher: "M11 23V9M11 9h11l-3 4 3 4H11",
  };
  let badgeReady = false, badgeTimer;
  function scheduleBadges() { clearTimeout(badgeTimer); badgeTimer = setTimeout(checkBadges, 500); }
  async function checkBadges() {
    if (!st.account || !st.tasksLoaded || !st.profileLoaded) return;
    const have = new Set(st.account.badges);
    const fresh = BADGES.filter(([id, , , test]) => !have.has(id) && test());
    if (!fresh.length) { badgeReady = true; return; }
    await saveAccount({ ...st.account, badges: st.account.badges.concat(fresh.map((b) => b[0])) });
    if (badgeReady) { justEarned = fresh.map((b) => b[0]); toast("Milestone reached: " + fresh.map((b) => b[1]).join(", ") + ". See it in your account."); }
    badgeReady = true;
  }
  let justEarned = [];
  function badgeEl([id, name, how]) {
    const won = st.account && st.account.badges.includes(id);
    const b = el("div", "badge" + (won ? " won" : "") + (won && justEarned.includes(id) ? " just" : ""));
    b.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle class="b-ring" cx="16" cy="16" r="15"/><path class="b-mark" d="' + BADGE_ICON[id] + '"/></svg>';
    b.append(el("b", null, name), el("span", "small", won ? "Done" : how));
    b.setAttribute("aria-label", name + (won ? ": reached" : ": " + how));
    return b;
  }
  // Day and plan completion get a moment of celebration.
  function maybeCelebrate(t) {
    if (t.source !== "plan" || !STEP[t.step] || STEP[t.step].ongoing) return;
    const one = oneOffPlan().map((x) => (x.id === t.id ? { ...x, status: "done" } : x));
    if (one.length && one.every((x) => x.status === "done")) { celebrate("You finished your 7-day plan", "Every step done. Keep the weekly tasks going and check your numbers."); return; }
    const day = one.filter((x) => x.day === t.day);
    if (day.length && day.every((x) => x.status === "done")) {
      const daysDone = [1, 2, 3, 4, 5, 6, 7].filter((d) => { const s = one.filter((x) => x.day === d); return s.length && s.every((x) => x.status === "done"); }).length;
      celebrate("Day " + t.day + " complete", daysDone + " of " + new Set(one.map((x) => x.day)).size + " days done");
    }
  }

  // ---------------------------------------------------------------------------
  // Account: who's signed in, your name, businesses, saves and milestones
  // ---------------------------------------------------------------------------
  let acctFocus = null;
  function openAccount(focus) {
    acctFocus = focus || null;
    ["guideDlg", "readDlg", "moreDlg", "palDlg", "setDlg"].forEach((id) => { const d = $("#" + id); if (d && d.open) d.close(); });
    drawAccount();
    if (!$("#acctDlg").open) $("#acctDlg").showModal();
    const target = focus && $("#acct-" + focus);
    if (target) { target.scrollIntoView({ block: "start" }); const f = target.querySelector("input, button"); if (f) f.focus({ preventScroll: true }); }
  }
  function drawAcctStatus() {
    const box = $("#acctStatus"); if (!box) return;
    box.textContent = "";
    const pill = el("span", "sync" + (sync.pending ? " saving" : sync.error ? " error" : "")); pill.append(el("i"), el("span", null, $("#syncText").textContent));
    box.append(pill);
    if (sync.last) box.append(el("span", "small muted", "Last saved at " + new Date(sync.last).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })));
  }
  function drawAccount() {
    const box = $("#acctBody"); if (!box || !st.account) return;
    const keepScroll = $("#acctDlg").scrollTop;
    box.textContent = "";
    const name = displayName();
    // Header
    const head = el("div", "acct-head");
    const av = el("span", "avatar lg", name ? initials(name) : null); if (!name) av.innerHTML = PERSON_SVG; av.setAttribute("aria-hidden", "true");
    const who = el("div"); who.style.display = "grid"; who.style.gap = "2px";
    const h = el("h2", null, name || "Your account"); h.id = "acctTitle"; h.tabIndex = -1; who.append(h);
    if (WEB) who.append(el("span", "small muted", mode === "db" ? "Signed in as " + (PLAT.email() || "you") + ". Your work is private to you and follows you to every device where you sign in." : ACCOUNTS ? "You're using Startline without an account, so your work is saved in this browser only. Create an account to keep it safe and use it on your other devices." : "Your work is saved in this browser only."));
    else who.append(el("span", "small muted", mode === "db" ? "Signed in with claude.ai. Your work is private to you and follows you to your other devices." : signedIn ? "Signed in, but this view can't save to your account, so your work stays in this browser." : "Not signed in, so your work is saved in this browser only. Sign in to claude.ai and open the app there to keep it in your account."));
    head.append(av, who); box.append(head);
    const status = el("div", "row-gap"); status.id = "acctStatus"; box.append(status); drawAcctStatus();
    if (WEB && ACCOUNTS) box.append(webAccountRow());
    // Name
    const ns = el("section", "acct-sec"); ns.id = "acct-name";
    const nh = el("div", "section-head"); nh.append(el("h3", null, "Your name")); ns.append(nh);
    const nf = el("form", "name-form"); nf.autocomplete = "off";
    const ni = el("input"); ni.type = "text"; ni.id = "acctName"; ni.maxLength = 60; ni.value = st.account.name || ""; ni.placeholder = viewerName || "What should the app call you?"; ni.setAttribute("aria-label", "Your name");
    const nb = el("button", "btn primary", "Save name"); nb.type = "submit";
    nf.append(ni, nb); ns.append(nf, el("p", "small muted", "Shown only to you, in your greeting and on your account button."));
    nf.addEventListener("submit", async (e) => { e.preventDefault(); await saveAccount({ ...st.account, name: ni.value }); toast(ni.value.trim() ? "Saved. Hi, " + ni.value.trim() + "." : "Name cleared."); drawAccount(); if (st.tab === "today") render(); });
    box.append(ns);
    // Businesses
    const bs = el("section", "acct-sec"); bs.id = "acct-biz";
    const bh = el("div", "section-head"); bh.append(el("h3", null, "Your businesses"), el("span", "small muted", st.account.businesses.length + (st.account.businesses.length === 1 ? " business" : " businesses"))); bs.append(bh);
    bs.append(el("p", "small muted", "Each business has its own plan, tasks, saved products and sites. Use one per idea you're working on."));
    const list = el("div", "biz-list");
    st.account.businesses.forEach((b) => {
      const cur = b.id === st.biz;
      const r = el("div", "biz-card" + (cur ? " current" : ""));
      const info = el("div");
      const top = el("div", "row-gap"); top.style.gap = "6px"; top.append(el("b", null, b.name)); if (cur) top.append(el("span", "pill ok", "Open now"));
      info.append(top, el("span", "small muted", (b.model ? MODEL_NAME[b.model] + (b.channel && CHANNEL_NAME[b.channel] ? " on " + CHANNEL_NAME[b.channel] : "") : "No plan yet") + " · started " + fmtDay(b.createdAt)));
      const act = el("div", "row-gap");
      if (!cur) { const o = el("button", "btn sm primary", "Open"); o.type = "button"; o.setAttribute("aria-label", "Open " + b.name); o.onclick = async () => { $("#acctDlg").close(); await switchBiz(b.id); }; act.append(o); }
      const rn = el("button", "btn sm", "Rename"); rn.type = "button"; rn.setAttribute("aria-label", "Rename " + b.name);
      rn.onclick = () => {
        const f = el("form", "name-form"); const i = el("input"); i.type = "text"; i.value = b.name; i.maxLength = 60; i.setAttribute("aria-label", "New name for " + b.name); i.id = "rn-" + b.id;
        const s2 = el("button", "btn sm primary", "Save"); s2.type = "submit"; f.append(i, s2);
        f.addEventListener("submit", async (e) => { e.preventDefault(); await renameBiz(b.id, i.value); toast("Renamed."); drawAccount(); });
        info.append(f); i.focus(); i.select(); rn.disabled = true;
      };
      act.append(rn);
      if (st.account.businesses.length > 1) {
        const del = el("button", "btn sm danger", "Delete"); del.type = "button"; del.setAttribute("aria-label", "Delete " + b.name);
        del.onclick = async () => {
          if (!del.classList.contains("armed")) { del.classList.add("armed"); del.textContent = "Delete its plan and tasks"; return; }
          del.disabled = true; del.textContent = "Deleting…"; await deleteBiz(b.id); toast("Deleted " + b.name + "."); drawAccount();
        };
        act.append(del);
      }
      r.append(info, act); list.append(r);
    });
    bs.append(list);
    const nfb = el("form", "name-form"); nfb.autocomplete = "off";
    const nbi = el("input"); nbi.type = "text"; nbi.id = "newBizName"; nbi.maxLength = 60; nbi.placeholder = "Name, e.g. Candle shop or Freelance writing"; nbi.setAttribute("aria-label", "New business name");
    const nbb = el("button", "btn", "Add business"); nbb.type = "submit"; nfb.append(nbi, nbb); bs.append(nfb);
    nfb.addEventListener("submit", async (e) => { e.preventDefault(); if (!nbi.value.trim()) { nbi.focus(); return; } $("#acctDlg").close(); await createBiz(nbi.value); });
    box.append(bs);
    // Saves
    const ss = el("section", "acct-sec"); ss.id = "acct-saves";
    const sh = el("div", "section-head"); sh.append(el("h3", null, "Saves"), el("span", "small muted", st.saves.length + " of " + (mode === "db" ? SAVE_MAX : SAVE_MAX_LOCAL))); ss.append(sh);
    ss.append(el("p", "small muted", "A save is a copy of a business's plan, tasks, products and sites at one moment. Restore it to go back; your current work is saved first, so restoring can't lose anything."));
    const sf = el("form", "name-form"); sf.autocomplete = "off";
    const si = el("input"); si.type = "text"; si.id = "saveName"; si.maxLength = 80; si.placeholder = "Name this save (optional)"; si.setAttribute("aria-label", "Save name");
    const sb = el("button", "btn primary", "Save a copy now"); sb.type = "submit"; sf.append(si, sb); ss.append(sf);
    sf.addEventListener("submit", async (e) => { e.preventDefault(); sb.disabled = true; const id = await makeSave(si.value); sb.disabled = false; if (id) { toast("Saved a copy of " + curBiz().name + "."); si.value = ""; burst(sb); drawAccount(); } });
    const sl = el("div", "save-list");
    if (!st.saves.length) sl.append(el("p", "small muted", "No saves yet. Save a copy before a big change, like switching to a different plan."));
    st.saves.forEach((sv) => {
      const r = el("div", "save-row");
      const info = el("div");
      const top = el("div", "row-gap"); top.style.gap = "6px"; top.append(el("b", null, sv.name)); if (sv.auto) top.append(el("span", "pill neutral", "Automatic"));
      const sum = sv.summary || {};
      info.append(top, el("span", "small muted", new Date(sv.at).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) + " · " + (sv.bizName || "Business") + " · " + (sum.tasks || 0) + " tasks, " + (sum.done || 0) + " done" + (sum.products ? ", " + sum.products + " products" : "")));
      const act = el("div", "row-gap");
      const rs = el("button", "btn sm", "Restore"); rs.type = "button"; rs.setAttribute("aria-label", "Restore " + sv.name);
      rs.onclick = async () => {
        if (!rs.classList.contains("armed")) { rs.classList.add("armed", "primary"); rs.textContent = "Restore into " + curBiz().name; return; }
        rs.disabled = true; rs.textContent = "Restoring…"; const ok = await restoreSave(sv); if (ok) { $("#acctDlg").close(); } else drawAccount();
      };
      const dl = el("button", "btn sm danger", "Delete"); dl.type = "button"; dl.setAttribute("aria-label", "Delete save " + sv.name);
      dl.onclick = async () => { await removeSave(sv.id); toast("Deleted the save.", { undo: () => putSaveBack(sv) }); drawAccount(); };
      act.append(rs, dl); r.append(info, act); sl.append(r);
    });
    ss.append(sl);
    const xr = el("div", "row-gap"); xr.append(el("span", "small muted", "Want a file instead?"));
    const ex = el("button", "btn sm", "Export or import a backup"); ex.type = "button"; ex.onclick = () => { $("#acctDlg").close(); openSettings("export"); }; xr.append(ex);
    ss.append(xr); box.append(ss);
    // Milestones
    const ms = el("section", "acct-sec"); ms.id = "acct-badges";
    const won = BADGES.filter(([id]) => st.account.badges.includes(id)).length;
    const mh = el("div", "section-head"); mh.append(el("h3", null, "Milestones"), el("span", "small muted", won + " of " + BADGES.length)); ms.append(mh);
    const bg = el("div", "badges"); BADGES.forEach((b) => bg.append(badgeEl(b))); ms.append(bg); justEarned = [];
    box.append(ms);
    // Danger zone
    const dz = el("section", "acct-sec");
    dz.append(el("h3", null, "Delete everything"));
    dz.append(el("p", "small muted", "Removes every business, save and milestone in your account. This can't be undone."));
    const dzs = el("p", "small"); dzs.setAttribute("aria-live", "polite");
    const dzb = el("button", "btn sm danger", "Delete everything…"); dzb.type = "button"; dzb.style.justifySelf = "start";
    dzb.onclick = async () => {
      if (!dzb.classList.contains("armed")) { dzb.classList.add("armed"); dzb.textContent = "Yes, delete everything"; dzs.textContent = "Export a backup first if you might want any of it back."; return; }
      dzb.disabled = true; dzs.textContent = "Deleting…"; await deleteEverything(); dzs.textContent = "Everything was deleted."; drawAccount();
    };
    dz.append(dzb, dzs); box.append(dz);
    if (WEB && mode === "db") box.append(deleteAccountSection());
    const act = el("div", "actions"); act.append(el("span")); const c = el("button", "btn", "Close"); c.type = "button"; c.onclick = () => $("#acctDlg").close(); act.append(c); box.append(act);
    $("#acctDlg").scrollTop = keepScroll;
  }

  // ----- Web app: signing in and out, deleting the account, bringing over
  // work saved in this browser before you had an account, installing.
  function webAccountRow() {
    const r = el("div", "row-gap acct-sign");
    if (mode === "db") {
      const so = el("button", "btn sm", "Sign out"); so.type = "button"; so.id = "signOutBtn";
      so.onclick = async () => { so.disabled = true; so.textContent = "Signing out…"; await PLAT.signOut(); };
      r.append(so);
      if (browserWork().businesses.length) { const bw = el("button", "btn sm", "Copy this browser's work into your account"); bw.type = "button"; bw.onclick = () => { $("#acctDlg").close(); offerBrowserWork(true); }; r.append(bw); }
    } else {
      const ca = el("button", "btn sm primary", "Create an account or sign in"); ca.type = "button"; ca.id = "createAcctBtn";
      ca.onclick = () => { $("#acctDlg").close(); PLAT.showAuth("signup"); };
      r.append(ca, el("span", "small muted", "Your work in this browser comes with you."));
    }
    return r;
  }
  function deleteAccountSection() {
    const sec = el("section", "acct-sec"); sec.id = "acct-delete";
    sec.append(el("h3", null, "Delete your account"));
    sec.append(el("p", "small muted", "Deletes your sign-in and everything saved in your account, on every device. This can't be undone."));
    const msg = el("p", "small"); msg.setAttribute("aria-live", "polite");
    const b = el("button", "btn sm danger", "Delete my account…"); b.type = "button"; b.id = "delAcctBtn"; b.style.justifySelf = "start";
    b.onclick = async () => {
      if (!b.classList.contains("armed")) { b.classList.add("armed"); b.textContent = "Yes, delete my account"; msg.textContent = "Export a backup first if you might want any of it back."; return; }
      b.disabled = true; msg.textContent = "Deleting your account…";
      try { await PLAT.deleteAccount(); }
      catch { b.disabled = false; msg.textContent = "Your account couldn't be deleted. Check your connection and try again."; }
    };
    sec.append(b, msg); return sec;
  }
  // Work saved in this browser without an account (the "local" keys).
  function browserWork() {
    const acc = lsGet(ACC_LOCAL, null);
    const list = acc && Array.isArray(acc.businesses) ? normAccount(acc).businesses : [newBizEntry("desk", "My business")];
    const out = { name: acc && typeof acc.name === "string" ? acc.name : "", badges: acc && Array.isArray(acc.badges) ? acc.badges : [], businesses: [], tasks: 0, products: 0, saves: lsGet(SAVES_LOCAL, []) };
    if (!Array.isArray(out.saves)) out.saves = [];
    list.forEach((b) => {
      const sfx = b.id === "desk" ? "" : ":" + b.id;
      const get = (k, d) => { const v = lsGet(LOCAL[k] + sfx, d); return v == null ? d : v; };
      const data = { app: "startline", profile: get("profile", null), tasks: get("tasks", []), learn: Object.entries(get("learn", {}) || {}).map(([id, v]) => ({ id, ...v })), products: get("products", []), links: get("links", []) };
      ["tasks", "products", "links"].forEach((k) => { if (!Array.isArray(data[k])) data[k] = []; });
      if (data.profile || data.tasks.length || data.products.length || data.links.length || data.learn.length) { out.businesses.push({ name: b.name, data }); out.tasks += data.tasks.length; out.products += data.products.length; }
    });
    return out;
  }
  const answeredKey = () => "sl-browser-work:" + uid;
  async function offerBrowserWork(asked) {
    if (mode !== "db" || !WEB || $("#moveDlg")) return;
    const w = browserWork();
    if (!w.businesses.length) return;
    if (!asked && lsGet(answeredKey(), null)) return;
    if (!asked && anyDialog()) { setTimeout(() => offerBrowserWork(), 4000); return; }
    const d = el("dialog"); d.id = "moveDlg"; d.setAttribute("aria-labelledby", "moveTitle");
    const box = el("div", "dlg");
    const h = el("h2", null, "Bring your work into your account?"); h.id = "moveTitle";
    const what = [w.businesses.length === 1 ? "1 business" : w.businesses.length + " businesses", w.tasks === 1 ? "1 task" : w.tasks + " tasks"];
    if (w.products) what.push(w.products === 1 ? "1 saved product" : w.products + " saved products");
    if (w.saves.length) what.push(w.saves.length === 1 ? "1 save" : w.saves.length + " saves");
    box.append(h, el("p", null, "This browser has work you saved without an account: " + what.join(", ") + "."), el("p", "small muted", "Copy it into your account to keep it safe and open it on your other devices. Each business is added next to the ones already in your account; nothing in your account is replaced. The copy in this browser stays where it is."));
    const msg = el("p", "small"); msg.setAttribute("aria-live", "polite");
    const act = el("div", "actions");
    const later = el("button", "btn", "Not now"); later.type = "button"; later.onclick = () => d.close();
    const never = el("button", "btn", "Don't ask again"); never.type = "button"; never.onclick = () => { lsSet(answeredKey(), "no"); d.close(); };
    const go = el("button", "btn primary", "Copy it into my account"); go.type = "button"; go.id = "moveGo";
    go.onclick = async () => {
      [go, later, never].forEach((b) => (b.disabled = true)); msg.textContent = "Copying…";
      try {
        const n = await copyBrowserWork(w);
        lsSet(answeredKey(), "copied"); d.close();
        toast(n === 1 ? "Copied 1 business into your account." : "Copied " + n + " businesses into your account."); celebrate();
      } catch { msg.textContent = "Some of it didn't copy. Check your connection and try again."; [go, later, never].forEach((b) => (b.disabled = false)); }
    };
    const left = el("div", "row-gap"); left.append(never); const right = el("div", "row-gap"); right.append(later, go);
    act.append(left, right); box.append(msg, act); d.append(box); document.body.append(d);
    d.addEventListener("close", () => d.remove());
    d.showModal(); go.focus();
  }
  async function copyBrowserWork(w) {
    let n = 0;
    for (const b of w.businesses) {
      await whenLoaded();
      const empty = !st.profile && !st.tasks.length && !st.products.length && !st.links.length && !Object.keys(st.learn).length;
      if (empty && st.account.businesses.length === 1 && n === 0) await renameBiz(st.biz, b.name);
      else {
        const id = "b_" + newId();
        await saveAccount({ ...st.account, businesses: st.account.businesses.concat(newBizEntry(id, b.name)) });
        await switchBiz(id, { quiet: true }); await whenLoaded();
      }
      await importData(b.data); n++;
    }
    for (const s of w.saves.slice(0, SAVE_MAX)) {
      if (!s || typeof s.id !== "string" || typeof s.data !== "string" || st.saves.some((x) => x.id === s.id) || st.saves.length >= SAVE_MAX) continue;
      await putSaveBack(s);
    }
    const badges = [...new Set(st.account.badges.concat(w.badges.filter((x) => typeof x === "string")))];
    await saveAccount({ ...st.account, name: st.account.name || String(w.name || "").slice(0, 60), badges });
    setTab("today"); render(true);
    return n;
  }
  async function installApp() {
    const r = await PLAT.install();
    if (r === "installed") toast("Installed. Open Startline from your home screen or app list.");
    else if (r === "ios") toast("In Safari, tap the Share button, then “Add to Home Screen”.");
    else if (r === "unavailable") openSettings("install");
  }

  // ---------------------------------------------------------------------------
  // Today: the 7-day track
  // ---------------------------------------------------------------------------
  function greeting() { const h = new Date().getHours(); return h < 5 ? "Working late" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }
  function trackCard(p, oneOff, dayN, animate) {
    const card = el("section", "track-card"); card.setAttribute("aria-label", "Your 7-day plan");
    const done = oneOff.filter((t) => t.status === "done").length;
    const top = el("div", "track-top");
    const left = el("div"); left.style.display = "grid"; left.style.gap = "4px";
    left.append(el("span", "label", dayN >= 1 && dayN <= 7 ? "Day " + dayN + " of 7" : dayN > 7 ? "Plan week finished" : "Starts " + fmtDay(p.start)));
    const big = el("b", "big"); const bigN = el("span"); big.append(bigN, el("span", "small muted", " / " + oneOff.length + " steps"));
    countUp(bigN, done, (v) => String(Math.round(v)), animate ? 0 : done);
    left.append(big);
    const flag = el("span", "flag"); flag.innerHTML = '<svg viewBox="0 0 14 14" aria-hidden="true"><path class="f-pole" d="M2 1v12"/><rect class="f-a" x="2.6" y="1" width="3.5" height="3"/><rect class="f-b" x="6.1" y="1" width="3.5" height="3"/><rect class="f-b" x="2.6" y="4" width="3.5" height="3"/><rect class="f-a" x="6.1" y="4" width="3.5" height="3"/></svg>';
    flag.append(Math.round(oneOff.length ? (done / oneOff.length) * 100 : 0) + "% to the finish");
    top.append(left, flag); card.append(top);
    const track = el("div", "track");
    const fill = el("span", "track-fill"); fill.setAttribute("aria-hidden", "true"); track.append(fill);
    const runner = el("span", "runner"); runner.setAttribute("aria-hidden", "true"); track.append(runner);
    const pct = oneOff.length ? done / oneOff.length : 0;
    for (let d = 1; d <= 7; d++) {
      const items = oneOff.filter((t) => t.day === d); const dd = items.filter((t) => t.status === "done").length;
      const full = items.length > 0 && dd === items.length;
      const lap = el("button", "lap" + (full ? " done" : "") + (d === dayN ? " now" : "")); lap.type = "button";
      lap.setAttribute("aria-label", "Day " + d + ": " + (items.length ? dd + " of " + items.length + " steps done" : "no new steps") + (d === dayN ? ", today" : "") + ". Show this day in your plan");
      const ring = el("span", "ring"); const inner = el("span", null, full ? "✓" : String(d)); ring.append(inner); lap.append(ring);
      lap.append(el("span", "lap-n", d === dayN ? "Today" : parse(addDays(p.start, d - 1)).toLocaleDateString(undefined, { weekday: "short" })));
      const target = items.length ? Math.round((dd / items.length) * 100) : 0;
      later(() => ring.style.setProperty("--p", target + "%"), animate);
      lap.onclick = () => { setTab("plan"); setTimeout(() => { const sec = $("#day-" + d); if (sec) { sec.scrollIntoView({ block: "start", behavior: calm() ? "auto" : "smooth" }); const b = sec.querySelector(".main"); if (b) b.focus({ preventScroll: true }); } }, 60); };
      track.append(lap);
    }
    const span = (100 - 100 / 7); // distance between the first and last day centres
    later(() => { fill.style.width = "calc(" + (span * pct).toFixed(2) + "%)"; runner.style.left = (100 / 14 + span * (Math.min(Math.max(dayN, 1), 7) - 1) / 6).toFixed(2) + "%"; }, animate);
    if (!animate || calm()) { fill.style.width = "calc(" + (span * pct).toFixed(2) + "%)"; runner.style.left = (100 / 14 + span * (Math.min(Math.max(dayN, 1), 7) - 1) / 6).toFixed(2) + "%"; }
    card.append(track);
    return card;
  }
  function skeleton() { const s = el("div", "skel"); s.setAttribute("aria-label", "Loading"); s.setAttribute("role", "status"); for (let i = 0; i < 3; i++) s.append(el("i")); return s; }

  // ---------------------------------------------------------------------------
  // Command palette (Ctrl/Cmd+K): jump to any tab, tool, lesson, task or site,
  // or run an action. Keyboard shortcuts: N new task, / or Ctrl+K search,
  // ? shortcuts, 1-6 tabs, Ctrl+Z undo.
  // ---------------------------------------------------------------------------
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
  function paletteItems() {
    const items = [];
    const add = (kind, label, run, extra = "") => items.push({ kind, label, run, hay: (label + " " + extra + " " + kind).toLowerCase() });
    TABS.forEach((t) => add("Go to", TAB_NAME[t], () => setTab(t), "tab page section"));
    add("Action", "Add a task", () => focusAdd(), "new todo create");
    add("Action", st.profile ? "Change my plan answers" : "Build my plan", () => { startSetup(!!st.profile); setTab("plan"); }, "setup onboarding questions model");
    add("Action", "Compare the 12 ways to earn", () => { startSetup(false); if (st.profile) { st.editingProfile = true; setup.draft = Object.assign({}, st.profile); } setup.step = 1; setup.compare = true; setTab("plan"); }, "models business types choose");
    if (st.profile) add("Action", "Restart plan dates from today", () => restartPlan(), "reschedule");
    const n = st.profile && nextStep(); if (n) add("Action", "Open the next plan step: " + n.title, () => openGuide(n), "continue guide");
    if (st.profile) planChoiceGroups(st.profile).forEach((g) => add("Choose", CHOICES[g].ask, () => openChoice(g), CHOICES[g].title + " " + CHOICES[g].items.map((id) => O[id][0]).join(" ")));
    add("Action", "Your account and saves", () => openAccount(), "profile name sign in");
    if (ACCOUNTS && mode !== "db") add("Action", "Create an account or sign in", () => PLAT.showAuth("signup"), "sign up register login");
    if (ACCOUNTS && mode === "db") add("Action", "Sign out", () => PLAT.signOut(), "log out logout");
    if (WEB && PLAT.canInstall()) add("Action", "Install Startline", () => installApp(), "app home screen download pwa");
    add("Action", "Save a copy of this business", () => openAccount("saves"), "snapshot backup version restore");
    add("Action", "Add a business", () => openAccount("biz"), "new workspace project");
    (st.account ? st.account.businesses : []).filter((b) => b.id !== st.biz).forEach((b) => add("Business", "Switch to " + b.name, () => switchBiz(b.id), "open business workspace"));
    add("Action", "Choose your AI", () => openAiSettings(), "chatgpt gemini claude copilot perplexity");
    add("Action", "Settings, theme and your data", () => openSettings(), "export import backup reset dark light");
    add("Action", "Export my data", () => openSettings("export"), "backup download json");
    add("Action", "Keyboard shortcuts", () => openSettings("keys"), "help hotkeys");
    TOOL_LIST.forEach((t) => add("Tool", t.name, () => openTool(t.id), t.group + " calculator"));
    LESSONS.forEach((l) => add("Lesson", l.title, () => openLesson(l.id), "learn read"));
    st.tasks.filter((t) => t.status !== "done").sort(sortTasks).forEach((t) => add(t.source === "plan" ? "Plan step" : "Task", t.title, () => (t.source === "plan" && STEP[t.step] ? openGuide(t) : openEdit(t)), (t.product || "") + " " + (t.supplier || "") + " " + (t.notes || "")));
    st.links.forEach((l) => { const u = safeUrl(l.url); if (u) add("My site", l.name, () => openUrl(l.name, u), u); });
    TOOLS.forEach((t) => add("Site", t.name, () => openUrl(t.name, t.url), t.desc + " " + t.url));
    return items;
  }
  // Opening a site from the palette: a real link click, so it opens in a new tab.
  function openUrl(name, url) { const a = extLink({ label: name, url, name }); a.hidden = true; document.body.append(a); a.click(); a.remove(); }
  function focusAdd() {
    const go2 = () => { const x = $("#quickAdd") || $("#addTitle"); if (x) { x.focus(); x.scrollIntoView({ block: "center" }); } };
    if (st.tab === "today" && st.profile) go2(); else if (st.tab === "tasks") go2(); else { setTab(st.profile ? "today" : "tasks"); setTimeout(go2, 0); }
  }
  const pal = { items: [], shown: [], sel: 0 };
  function openPalette() {
    const d = $("#palDlg"); if (d.open) return;
    ["guideDlg", "readDlg", "moreDlg", "setDlg", "aiDlg", "acctDlg"].forEach((id) => { const x = $("#" + id); if (x && x.open) x.close(); });
    pal.items = paletteItems(); $("#palIn").value = ""; pal.sel = 0; drawPalette();
    d.showModal(); $("#palIn").focus();
  }
  function drawPalette() {
    const q = $("#palIn").value.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    let shown = pal.items.filter((it) => words.every((w) => it.hay.includes(w)));
    if (q) {
      // Rank: label starts with the query, then a word in the label, then a word anywhere.
      const KW = { "Go to": 0.6, Tool: 0.5, Action: 0.4, Choose: 0.45, Business: 0.45, Lesson: 0.3, "Plan step": 0.3, Task: 0.3, "My site": 0.35, Site: 0.2 };
      const wb = words.map((w) => new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
      const score = (it) => (it.label.toLowerCase().startsWith(q) ? 4 : 0) + (wb.every((r) => r.test(it.label)) ? 2 : 0) + (wb.every((r) => r.test(it.hay)) ? 1 : 0) + (KW[it.kind] || 0);
      shown = shown.map((it, i) => [it, score(it), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]).map((x) => x[0]);
    }
    else shown = shown.filter((it) => it.kind === "Go to" || it.kind === "Action" || it.kind === "Plan step").slice(0, 16);
    shown = shown.slice(0, 40);
    if (q) {
      const raw = $("#palIn").value.trim();
      const u = !/\s/.test(raw) && raw.includes(".") ? safeUrl(raw) : null;
      if (u) shown.unshift({ kind: "Open", label: "Go to " + u.replace(/^https?:\/\//, "").replace(/\/$/, ""), run: () => openUrl(raw, u) });
      shown.push({ kind: "Web", label: "Search the web for “" + raw + "”", run: () => openUrl("Web search", "https://www.google.com/search?q=" + encodeURIComponent(raw)) });
    }
    pal.shown = shown; if (pal.sel >= shown.length) pal.sel = 0;
    const ul = $("#palList"); ul.textContent = "";
    shown.forEach((it, i) => {
      const li = el("li"); li.id = "pal-" + i; li.setAttribute("role", "option"); li.setAttribute("aria-selected", String(i === pal.sel));
      li.append(el("span", null, it.label), el("span", "k", it.kind));
      li.onmousemove = () => { if (pal.sel !== i) { pal.sel = i; markPal(); } };
      li.onclick = () => runPal(i);
      ul.append(li);
    });
    if (!shown.length) { const li = el("li"); li.setAttribute("role", "option"); li.setAttribute("aria-disabled", "true"); li.append(el("span", "muted", "No matches")); ul.append(li); }
    markPal();
  }
  function markPal() {
    $("#palList").querySelectorAll("li[id]").forEach((li, i) => li.setAttribute("aria-selected", String(i === pal.sel)));
    const cur = $("#pal-" + pal.sel); $("#palIn").setAttribute("aria-activedescendant", cur ? cur.id : "");
    if (cur) cur.scrollIntoView({ block: "nearest" });
  }
  function runPal(i) { const it = pal.shown[i]; if (!it) return; $("#palDlg").close(); it.run(); }
  $("#palIn").addEventListener("input", () => { pal.sel = 0; drawPalette(); });
  $("#palIn").addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); pal.sel = Math.min(pal.shown.length - 1, pal.sel + 1); markPal(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); pal.sel = Math.max(0, pal.sel - 1); markPal(); }
    else if (e.key === "Home" && e.ctrlKey) { e.preventDefault(); pal.sel = 0; markPal(); }
    else if (e.key === "Enter") { e.preventDefault(); runPal(pal.sel); }
  });
  $("#palDlg").addEventListener("click", (e) => { if (e.target === $("#palDlg")) $("#palDlg").close(); });
  $("#palBtn").onclick = openPalette;
  $("#palKbd").textContent = isMac ? "⌘ K" : "Ctrl K";

  const typing = (t) => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  const anyDialog = () => [...document.querySelectorAll("dialog")].some((d) => d.open);
  document.addEventListener("keydown", (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") { e.preventDefault(); if ($("#palDlg").open) $("#palDlg").close(); else openPalette(); return; }
    if (mod && !e.shiftKey && e.key.toLowerCase() === "z" && toastUndo && !typing(e.target)) { e.preventDefault(); runUndo(); return; }
    if (mod || e.altKey || typing(e.target) || anyDialog()) return;
    if (e.key === "/") { e.preventDefault(); openPalette(); }
    else if (e.key === "n" || e.key === "N") { e.preventDefault(); focusAdd(); }
    else if (e.key === "?") { e.preventDefault(); openSettings("keys"); }
    else if (/^[1-6]$/.test(e.key) && TABS[+e.key - 1]) { e.preventDefault(); setTab(TABS[+e.key - 1]); }
  });

  // ----- Mobile "More" menu
  function openMore() {
    const box = $("#moreBody"); box.textContent = "";
    const h = el("h2", null, "More"); h.id = "moreTitle"; box.append(h);
    const list = el("div", "more-list");
    const item = (label, fn) => { const b = el("button", "btn", label); b.type = "button"; b.onclick = () => { $("#moreDlg").close(); fn(); }; list.append(b); };
    item("Learn: lessons and courses", () => setTab("learn"));
    item("Sites: open any site", () => setTab("sites"));
    item("Account, businesses and saves", () => openAccount());
    item("Search everything", () => openPalette());
    item("Choose your AI", () => openAiSettings());
    item("Settings and your data", () => openSettings());
    if (WEB && PLAT.canInstall()) item("Install Startline", () => installApp());
    box.append(list);
    const c = el("button", "btn", "Close"); c.type = "button"; c.onclick = () => $("#moreDlg").close(); box.append(c);
    $("#moreDlg").showModal();
  }

  // ---------------------------------------------------------------------------
  // Settings: theme, your data (export, import, reset), shortcuts
  // ---------------------------------------------------------------------------
  let downloads = null;
  const THEME_KEY = "dd-theme";
  function applyTheme(v) { if (v === "light" || v === "dark") document.documentElement.dataset.theme = v; else delete document.documentElement.dataset.theme; }
  applyTheme(lsGet(THEME_KEY, "system"));
  function exportData() {
    return { app: "startline", format: 1, exportedAt: new Date().toISOString(), business: curBiz().name, profile: st.profile || null,
      tasks: st.tasks, learn: Object.entries(st.learn).map(([id, v]) => ({ id, ...v })), products: st.products, links: st.links, calculators: CV };
  }
  async function saveExport(status) {
    const json = JSON.stringify(exportData(), null, 1);
    const name = "startline-" + curBiz().name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) + "-" + today() + ".json";
    if (downloads) {
      try { await downloads.save({ filename: name, data: json }); status.textContent = "Saved " + name + "."; return; }
      catch (e) { if (e && e.code === "declined") { status.textContent = "Not saved."; return; } if (e && e.code === "rate_limited") { status.textContent = "A save prompt is already open."; return; } }
    }
    const ok = await navigator.clipboard.writeText(json).then(() => true, () => false);
    status.textContent = ok ? "This view can't save files, so your backup was copied. Paste it into a note or text file." : "This view can't save files or copy. Use the box below: select all and copy.";
    if (!ok) { const ta = el("textarea"); ta.rows = 6; ta.readOnly = true; ta.value = json; ta.className = "prompt-box"; ta.setAttribute("aria-label", "Backup data"); status.after(ta); ta.select(); }
  }
  const clean = (v, n = 2000) => (typeof v === "string" ? v.slice(0, n) : "");
  async function importData(obj) {
    if (!obj || (obj.app !== "startline" && obj.app !== "dropship-desk")) throw new Error("That file isn't a Startline backup.");
    let n = { tasks: 0, learn: 0, products: 0, links: 0 };
    const okId = (id) => typeof id === "string" && /^[\w-]{1,120}$/.test(id);
    for (const t of Array.isArray(obj.tasks) ? obj.tasks.slice(0, 2000) : []) {
      if (!t || !okId(t.id) || !clean(t.title)) continue;
      await putTask(t.id, { title: clean(t.title, 300), area: AREA[t.area] ? t.area : "orders", prio: PRIO_RANK[t.prio] != null ? t.prio : "med",
        due: /^\d{4}-\d{2}-\d{2}$/.test(t.due || "") ? t.due : null, status: STATUSES.some(([k]) => k === t.status) ? t.status : "todo",
        product: clean(t.product, 200), supplier: clean(t.supplier, 200), ref: clean(t.ref, 200), notes: clean(t.notes),
        repeat: ["none", "daily", "weekly", "monthly"].includes(t.repeat) ? t.repeat : "none", createdAt: Number(t.createdAt) || Date.now(),
        doneAt: /^\d{4}-\d{2}-\d{2}$/.test(t.doneAt || "") ? t.doneAt : null, source: t.source === "plan" && STEP[t.step] ? "plan" : "custom",
        ...(t.source === "plan" && STEP[t.step] ? { step: t.step, day: Number(t.day) || STEP[t.step].day } : {}) });
      n.tasks++;
    }
    for (const l of Array.isArray(obj.learn) ? obj.learn : []) { if (l && okId(l.id)) { await putDoc("learn", l.id, { done: true, at: /^\d{4}-\d{2}-\d{2}$/.test(l.at || "") ? l.at : today() }); n.learn++; } }
    for (const x of Array.isArray(obj.links) ? obj.links.slice(0, 500) : []) { const u = x && safeUrl(x.url); if (u && okId(x.id)) { await putDoc("links", x.id, { name: clean(x.name, 120) || new URL(u).hostname, url: u, addedAt: today() }); n.links++; } }
    const num = (v) => (v == null || v === "" || !isFinite(Number(v)) ? null : Number(v));
    for (const x of Array.isArray(obj.products) ? obj.products.slice(0, 500) : []) {
      if (!x || !okId(x.id) || !clean(x.name)) continue;
      await saveProduct(x.id, { name: clean(x.name, 200), link: safeUrl(x.link) || "", source: clean(x.source, 40), price: num(x.price), cost: num(x.cost), ship: num(x.ship), minDays: num(x.minDays), maxDays: num(x.maxDays),
        shipsFrom: clean(x.shipsFrom, 10), profit: num(x.profit), margin: num(x.margin), breakEven: num(x.breakEven), bad: num(x.bad) || 0, warn: num(x.warn) || 0, fee: clean(x.fee, 40), savedAt: /^\d{4}-\d{2}-\d{2}$/.test(x.savedAt || "") ? x.savedAt : today() });
      n.products++;
    }
    const p = obj.profile;
    if (p && MODEL_NAME[p.model] && (CHANNELS[p.model] || []).some((c) => c[0] === p.channel) && ["new", "store", "selling"].includes(p.level) && ["us", "uk", "other"].includes(p.country)) {
      const choices = {};
      Object.entries(p.choices && typeof p.choices === "object" ? p.choices : {}).forEach(([g, id]) => { if (CHOICES[g] && CHOICES[g].items.includes(id)) choices[g] = id; });
      await saveProfile({ level: p.level, model: p.model, channel: p.channel, country: p.country, ads: p.ads === "some" ? "some" : "none", start: /^\d{4}-\d{2}-\d{2}$/.test(p.start || "") ? p.start : today(), choices });
      n.profile = true;
    }
    return n;
  }
  async function resetAll() {
    for (const t of st.tasks.slice()) await delTask(t.id);
    for (const id of Object.keys(st.learn)) await delDoc("learn", id);
    for (const x of st.products.slice()) await deleteProduct(x.id);
    for (const x of st.links.slice()) await delDoc("links", x.id);
    await clearProfile();
  }
  function openSettings(focus) {
    const box = $("#setBody"); box.textContent = "";
    box.append(el("h2", null, "Settings"));
    // Appearance
    const ap = el("section", "set-sec"); ap.append(el("h3", null, "Appearance"));
    const seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Theme");
    const cur = lsGet(THEME_KEY, "system");
    [["system", "Match device"], ["light", "Light"], ["dark", "Dark"]].forEach(([k, l]) => { const b = el("button", null, l); b.type = "button"; b.setAttribute("aria-pressed", String(cur === k)); b.onclick = () => { lsSet(THEME_KEY, k); applyTheme(k); seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }; seg.append(b); });
    ap.append(seg); box.append(ap);
    // AI
    const ai = el("section", "set-sec"); ai.append(el("h3", null, "AI"), el("p", "small muted", "Using: " + aiLabel() + "."));
    const aib = el("button", "btn sm", "Choose your AI"); aib.type = "button"; aib.onclick = () => { $("#setDlg").close(); openAiSettings(); }; ai.append(aib); box.append(ai);
    // Data
    const da = el("section", "set-sec"); da.id = "set-export";
    da.append(el("h3", null, "Your data"));
    da.append(el("p", "small muted", (mode === "db" ? (WEB ? "Saved to your Startline account: private to you and available on every device where you sign in." : "Saved to your claude.ai account: private to you and available on your other devices where you're signed in.") : "Saved only in this browser.") + " Nobody else who opens this app sees it. A backup file holds the business that's open now: " + curBiz().name + "."));
    const acb = el("button", "btn sm", "Account, businesses and saves"); acb.type = "button"; acb.onclick = () => { $("#setDlg").close(); openAccount(); }; da.append(acb);
    const status = el("p", "small"); status.setAttribute("aria-live", "polite");
    const row = el("div", "row-gap");
    const ex = el("button", "btn sm primary", "Export a backup"); ex.type = "button"; ex.onclick = () => saveExport(status);
    const fileIn = el("input"); fileIn.type = "file"; fileIn.accept = ".json,application/json"; fileIn.id = "importFile"; fileIn.hidden = true;
    const im = el("button", "btn sm", "Import a backup"); im.type = "button"; im.onclick = () => fileIn.click();
    fileIn.onchange = async () => {
      const f = fileIn.files && fileIn.files[0]; if (!f) return;
      if (f.size > 5e6) { status.textContent = "That file is too big to be a backup."; return; }
      status.textContent = "Importing…";
      try {
        const n = await importData(JSON.parse(await f.text()));
        status.textContent = "Imported " + n.tasks + " tasks, " + n.products + " saved products, " + n.links + " sites and " + n.learn + " finished lessons and courses" + (n.profile ? ", plus your plan answers." : ".");
        render();
      } catch (e) { status.textContent = e && e.message && !/JSON/.test(e.message) ? e.message : "That file couldn't be read. Choose a backup exported from this app."; }
      fileIn.value = "";
    };
    row.append(ex, im, fileIn); da.append(row, status);
    const rs = el("button", "btn sm danger", "Delete this business's data…"); rs.type = "button";
    rs.onclick = async () => {
      if (!rs.classList.contains("armed")) { rs.classList.add("armed"); rs.textContent = "Yes, delete its plan, tasks, products and sites"; status.textContent = "This can't be undone. Save a copy or export a backup first if you might want it back."; return; }
      rs.disabled = true; status.textContent = "Deleting…"; await resetAll(); status.textContent = "Everything in " + curBiz().name + " was deleted."; startSetup(false); render();
    };
    da.append(rs); box.append(da);
    // Installing the web app
    if (WEB) {
      const ins = el("section", "set-sec"); ins.id = "set-install"; ins.append(el("h3", null, "Install the app"));
      ins.append(el("p", "small muted", "Startline works in any browser and can also be installed, so it opens in its own window and keeps working offline. On Android, or in Chrome or Edge on a computer, choose Install. On iPhone or iPad, open it in Safari, tap the Share button, then Add to Home Screen. In Safari on a Mac, choose File, then Add to Dock."));
      if (PLAT.canInstall()) { const ib = el("button", "btn sm primary", "Install Startline"); ib.type = "button"; ib.onclick = () => installApp(); ins.append(ib); }
      box.append(ins);
    }
    // Shortcuts
    const ks = el("section", "set-sec"); ks.id = "set-keys"; ks.append(el("h3", null, "Keyboard shortcuts"));
    const kg = el("div", "keys small");
    const mk = isMac ? "⌘" : "Ctrl";
    [[[mk, "K"], "Search and run commands (or press /)"], [["N"], "Add a task"], [["1", "–", "6"], "Switch tabs"], [[mk, "Z"], "Undo the last change"], [["?"], "Show these shortcuts"], [["Esc"], "Close a window"]].forEach(([keys, what]) => {
      const k = el("span"); keys.forEach((x, i) => { if (x === "–") k.append(" – "); else { if (i && keys[i - 1] !== "–") k.append(" "); k.append(el("kbd", null, x)); } }); kg.append(k, el("span", null, what));
    });
    ks.append(kg); box.append(ks);
    const ab = el("section", "set-sec"); ab.append(el("h3", null, "About"), el("p", "small muted", "Fees, rules and links were checked in " + CHECKED + ". Each guide step and lesson lists its sources; check them before big decisions, because platforms change their rules. " + (WEB ? "Your plan and tasks are yours alone: each account can only read its own work, and work saved without an account never leaves this browser." : "This app holds no personal details: your plan and tasks are yours alone.")));
    box.append(ab);
    const act = el("div", "actions"); act.append(el("span")); const c = el("button", "btn", "Close"); c.type = "button"; c.onclick = () => $("#setDlg").close(); act.append(c); box.append(act);
    $("#setDlg").showModal();
    const target = focus === "export" ? $("#set-export") : focus === "keys" ? $("#set-keys") : focus === "install" ? $("#set-install") : null;
    if (target) { target.scrollIntoView({ block: "start" }); const b = target.querySelector("button"); if (b) b.focus(); }
  }
  $("#setBtn").onclick = () => openSettings();

  // ---------------------------------------------------------------------------
  // Tabs and boot
  // ---------------------------------------------------------------------------
  document.querySelectorAll("#tabs button").forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $("#tabs").addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const vis = [...$("#tabs").querySelectorAll("button:not([hidden])")]; let i = vis.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault();
    i = e.key === "Home" ? 0 : e.key === "End" ? vis.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + vis.length) % vis.length;
    vis[i].focus(); setTab(vis[i].dataset.tab);
  });
  document.querySelectorAll("#bnav button").forEach((b) => (b.onclick = () => (b.dataset.tab === "more" ? openMore() : setTab(b.dataset.tab))));
  $("#aiBtn").onclick = openAiSettings;
  $("#acctBtn").onclick = () => openAccount();
  $("#bizBtn").onclick = () => openAccount("biz");
  updateAiBtn(); drawSync();
  if (WEB) document.addEventListener("startline:install", () => { if ($("#setDlg").open && !$("#set-install button")) openSettings("install"); });
  setTab(TABS.includes(st.tab) ? st.tab : "today");
  startStorage();
  claudeUse("sample").then((s) => { sample = s; updateAiBtn(); if (st.tab === "tools") renderTool(); });
  claudeUse("downloads").then((d) => { downloads = d; });
  // Test hook for the automated checks; inert unless a test sets the flag first.
  if (window.__ddTest) window.__dd = { S, GUIDE, STEP, LESSONS, COURSES, TOOLS, TOOL_LIST, CHANNELS, MODELS, QUESTIONS, FEES, DEFAULT_FEE, ADS_MODELS, val, parseQuick, today, addDays, applicable, O, CHOICES, STEP_CHOICE, choiceFor, optItems, planChoiceGroups };
  setInterval(() => { if (document.visibilityState === "visible" && (st.tab === "plan" || st.tab === "tasks" || st.tab === "today") && !anyDialog() && !typing(document.activeElement)) render(); }, 60 * 60 * 1000);
})();
