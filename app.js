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
    shopCourse: ["Learn With Shopify: Dropshipping University (YouTube)", "https://www.youtube.com/playlist?list=PL1BMWTNEcBEoVNKsBNjKY7r4PfhwisM-L"],
    shopCourseBlog: ["Shopify Blog: best dropshipping courses", "https://www.shopify.com/blog/best-dropshipping-courses"],
    ytYppChanges: ["YouTube Help: changes to the YouTube Partner Program", "https://support.google.com/youtube/answer/12843009?hl=en"],
    ytBlog2027: ["YouTube Blog: new opportunities to earn and changes to the YouTube Partner Program", "https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/"],
    gumroadFees: ["Gumroad Help: Gumroad's fees", "https://gumroad.com/help/article/66-gumroads-fees"],
    etsyOffsite: ["Etsy Help: how Etsy's Offsite Ads work", "https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work"],
    cbpEcomFaq: ["CBP: e-commerce frequently asked questions", "https://www.cbp.gov/trade/basic-import-export/e-commerce/faqs"],
    cbpDeMinimisRule: ["Federal Register: indefinite suspension of the de minimis exemption (June 24, 2026)", "https://www.federalregister.gov/documents/full_text/html/2026/06/24/2026-12670.html"],
    shopPayoutsUS: ["Shopify Help: Shopify Payments payouts in the United States", "https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/united-states/payouts"],
    stripePricing: ["Stripe: pricing and fees", "https://stripe.com/pricing"],
    etsySearchHow: ["Etsy Seller Handbook: how Etsy search works", "https://www.etsy.com/seller-handbook/article/375461474487"],
    bankrate: ["Bankrate: side hustle survey (2025)", "https://www.bankrate.com/loans/small-business/side-hustles-survey/"],
    bankratePR: ["Bankrate: fewer Americans have a side hustle in 2025 (press release)", "https://www.bankrate.com/press-releases/fewer-americans-have-a-side-hustle-in-2025/"],
    linktreeReport: ["Linktree: 2022 Creator Report", "https://linktr.ee/creator-report/"],
    etsy10k: ["Etsy, Inc.: Form 10-K for 2025 (SEC)", "https://www.sec.gov/Archives/edgar/data/1370637/000137063726000019/etsy-20251231.htm"],
    ftcAutomators: ["FTC: Automators AI owners banned (Feb 2024)", "https://www.ftc.gov/news-events/news/press-releases/2024/02/ftc-action-leads-ban-owners-automators-ai-e-commerce-money-making-scheme"],
    ftcClickProfit: ["FTC: action to stop Click Profit (Mar 2025)", "https://www.ftc.gov/news-events/news/press-releases/2025/03/ftc-acts-stop-click-profit-online-business-opportunity-has-cost-consumers-least-14-million"],
    ftcClickProfitBan: ["FTC: e-commerce scheme operators banned from industry (Aug 2025)", "https://www.ftc.gov/news-events/news/press-releases/2025/08/ftc-case-against-e-commerce-business-opportunity-scheme-its-operators-results-permanent-ban-industry"],
    ftcEEB: ["FTC: action ends Ecommerce Empire Builders scheme (May 2025)", "https://www.ftc.gov/news-events/news/press-releases/2025/05/ftc-action-ends-ecommerce-empire-builders-online-business-opportunity-scam"],
    ftcAIComply: ["FTC: crackdown on deceptive AI claims and schemes (Sep 2024)", "https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes"],
    ftcFbaMachine: ["FTC: FBA Machine/Passive Scaling case", "https://www.ftc.gov/legal-library/browse/cases-proceedings/x240032-fba-machinepassive-scaling-ftc-v"],
    ftcFbaMachineBan: ["FTC: e-commerce business opportunity operator banned (Jul 2025)", "https://www.ftc.gov/news-events/news/press-releases/2025/07/ftc-obtains-permanent-ban-e-commerce-business-opportunity-scheme-operator"],
    ftcAscend: ["FTC: order banning Ascend Ecom (Jun 2025)", "https://www.ftc.gov/news-events/news/press-releases/2025/06/ftc-case-leads-order-banning-ascend-ecom-its-owners-business-opportunity-marketing"],
    ftcBizOppRule: ["FTC: selling a business opportunity? The Business Opportunity Rule", "https://www.ftc.gov/business-guidance/resources/selling-work-home-or-other-business-opportunity-revised-rule-may-apply-you-1"],
    ftcVetting: ["FTC: vetting a business or coaching opportunity before you buy in", "https://consumer.ftc.gov/consumer-alerts/2023/08/vetting-business-or-coaching-opportunity-you-buy"],
    ftcScammed: ["FTC: what to do if you were scammed", "https://consumer.ftc.gov/articles/what-do-if-you-were-scammed"],
    shopSEO: ["Shopify Help: adding keywords for SEO", "https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords"],
    shopReports: ["Shopify Help: behavior reports (conversion rate over time)", "https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/behaviour-reports"],
    shopEmail: ["Shopify: Shopify Messaging (email marketing)", "https://www.shopify.com/email-marketing"],
    shopEmailFaq: ["Shopify Help: Shopify Email FAQ", "https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-email/faq"],
    shopUsers: ["Shopify Help: users and permissions", "https://help.shopify.com/en/manual/your-account/users"],
    shopCollab: ["Shopify Help: collaborator accounts", "https://help.shopify.com/en/manual/your-account/staff-accounts/collaborator-accounts"],
    etsyTitles: ["Etsy Seller Handbook: new guidance for listing titles", "https://www.etsy.com/seller-handbook/article/1399426136697"],
    etsyAds: ["Etsy Help: set up and manage an Etsy Ads campaign", "https://help.etsy.com/hc/en-us/articles/360033701174-How-to-Set-Up-and-Manage-an-Etsy-Ads-Campaign"],
    etsyAdsPerf: ["Etsy Help: review the performance of your Etsy Ads", "https://help.etsy.com/hc/en-us/articles/360034223613-How-to-Review-the-Performance-of-Your-Etsy-Ads"],
    etsyDeposit: ["Etsy Help: why hasn't my money been deposited yet?", "https://help.etsy.com/hc/en-us/articles/360002080688-Why-Hasn-t-My-Money-Been-Deposited-Yet"],
    ebayPicPolicy: ["eBay: picture policy", "https://www.ebay.com/help/policies/listing-policies/picture-policy?id=4370"],
    ebayPhotos: ["eBay Seller Center: take great photos", "https://www.ebay.com/sellercenter/listings/photo-tips"],
    ebaySpecifics: ["eBay Seller Center: item specifics", "https://www.ebay.com/sellercenter/listings/item-specifics"],
    ebayOffers: ["eBay Help: Best Offer and sending offers to buyers", "https://www.ebay.com/help/selling/listings/selling-buy-now/adding-best-offer-listing?id=4144"],
    ebayPromoted: ["eBay Help: general campaign strategy (Promoted Listings)", "https://www.ebay.com/help/selling/ebay-advertising/promoted-listings/general-campaign-strategy?id=4164"],
    ebayLimits: ["eBay (international sellers site): selling limits", "https://export.ebay.com/sea-en/first-steps/rules-and-restrictions-in-selling/selling-limits/"],
    amzPhotos: ["Amazon: how to take product photos", "https://sell.amazon.com/blog/product-photos"],
    amzSEO: ["Amazon: 7 ways to improve your product's search rankings", "https://sell.amazon.com/blog/amazon-seo"],
    amzPayments: ["Amazon: how Amazon seller payments work", "https://sell.amazon.com/blog/amazon-seller-payments"],
    amzAdsFaq: ["Amazon Ads: FAQs", "https://advertising.amazon.com/resources/faq/"],
    amzSP: ["Amazon: Sponsored Products", "https://sell.amazon.com/advertising/sponsored-products"],
    amzAssoc180: ["Amazon Associates Help: application review and the 180-day window", "https://affiliate-program.amazon.com/help/node/topic/G7MJTPEP9NC3YKMG"],
    amzAssocWindow: ["Amazon Associates Help: the 24-hour window for qualifying purchases", "https://affiliate-program.amazon.com/help/node/topic/G9SMD8TQHFJ7728F"],
    amzAssocPay: ["Amazon Associates Help: payment thresholds", "https://affiliate-program.amazon.com/help/node/topic/GP8Z3AZ27ZFHTEUL"],
    awinPay: ["Awin: what are the payment thresholds?", "https://success.awin.com/s/article/What-are-the-payment-thresholds?language=en_US"],
    cjPay: ["CJ Junction: understanding CJ's publisher payment cycle", "https://junction.cj.com/article/cookie-dough-understanding-publisher-payment-cycle"],
    ttsListing: ["TikTok Shop US: Product Listing Policy", "https://seller-us.tiktok.com/university/essay?knowledge_id=3196690250417921&lang=en"],
    ttsQuality: ["TikTok Shop US: product detail pages and listing quality guidelines", "https://seller-us.tiktok.com/university/essay?knowledge_id=481891871868714"],
    ttsSettle: ["TikTok Shop US: Finance & Settlement 101", "https://seller-us.tiktok.com/university/essay?knowledge_id=1167036928444174&lang=en"],
    ttAnalytics: ["TikTok Creator Academy: analytics", "https://www.tiktok.com/creator-academy/en/article/tool-analytics-intro"],
    ytRejected: ["YouTube Help: my channel was rejected for monetization", "https://support.google.com/youtube/answer/9235730?hl=en"],
    ytFeatures: ["YouTube Help: get access to intermediate and advanced features", "https://support.google.com/youtube/answer/9891124?hl=en"],
    ytThumbs: ["YouTube Help: add custom thumbnails", "https://support.google.com/youtube/answer/72431?hl=en"],
    ytRetention: ["YouTube Help: measure key moments for audience retention", "https://support.google.com/youtube/answer/9314415?hl=en"],
    printfulTime: ["Printful Help: how long does fulfillment take?", "https://help.printful.com/hc/en-us/articles/360014007980-How-long-does-fulfillment-take"],
    gumroadPay: ["Gumroad Help: getting paid", "https://gumroad.com/help/article/13-getting-paid"],
    gumroadDiscover: ["Gumroad Help: Gumroad Discover", "https://gumroad.com/help/article/79-gumroad-discover"],
    payhipPaypal: ["Payhip Help: connect your PayPal account", "https://help.payhip.com/article/64-connecting-your-paypal-account"],
    mercariPaid: ["Mercari: getting paid (direct deposit, Instant Pay)", "https://www.mercari.com/us/help_center/article/6004/"],
    poshPaid: ["Poshmark: when do I get paid for a shipped order?", "https://support.poshmark.com/s/article/773838096?language=en_US"],
    fiverrAccount: ["Fiverr Help: creating your Fiverr account", "https://help.fiverr.com/hc/en-us/articles/360050063113-Creating-your-Fiverr-account"],
    fiverrKickstart: ["Fiverr Help: Seller Plus Kickstart", "https://help.fiverr.com/hc/en-us/articles/27291415082257-Seller-Plus-Kickstart-Start-your-freelance-journey-strong"],
    fiverrLevels: ["Fiverr Help: understanding Fiverr's freelancer levels", "https://help.fiverr.com/hc/en-us/articles/360010560118-Understanding-Fiverr-s-freelancer-levels"],
    fiverrGigBest: ["Fiverr Help: Gigs best practices", "https://help.fiverr.com/hc/en-us/articles/360010452317-Gigs-best-practices"],
    fiverrCreateGig: ["Fiverr Help: creating a Gig", "https://help.fiverr.com/hc/en-us/articles/360010451397-Creating-a-Gig"],
    fiverrGigImages: ["Fiverr Help: creating Gig images", "https://help.fiverr.com/hc/en-us/articles/15863342952977-Guidelines-for-selecting-Gig-images"],
    upworkProfile: ["Upwork Help: build a 100% complete profile", "https://support.upwork.com/hc/en-us/articles/34924882793107-Build-a-100-complete-profile"],
    upworkTitle: ["Upwork: why a great title and overview matter", "https://www.upwork.com/resources/upwork-profiles-why-a-great-title-and-overview-can-make-a-difference"],
    upworkProposal: ["Upwork: how to create a proposal that wins jobs", "https://www.upwork.com/resources/how-to-create-a-proposal-that-wins-jobs"],
    teachablePayouts: ["Teachable Help: payouts FAQ", "https://support.teachable.com/en/articles/12082041-payouts-faq"],
    teachableCoupons: ["Teachable Help: coupons", "https://support.teachable.com/en/articles/11682479-coupons"],
    thinkificPayouts: ["Thinkific Help: Thinkific Payments payouts", "https://support.thinkific.com/hc/en-us/articles/360058186954-Thinkific-Payments-Payouts"],
    thinkificBumps: ["Thinkific Help: sell more with order bumps", "https://support.thinkific.com/hc/en-us/articles/4410781476631-Sell-More-with-Order-Bumps"],
    thinkificCoupons: ["Thinkific Help: share links with coupons automatically applied", "https://support.thinkific.com/hc/en-us/articles/360035675974-Share-Links-with-Coupons-Automatically-Applied"],
    kdpKeywords: ["KDP Help: make your book more discoverable with keywords", "https://kdp.amazon.com/en_US/help/topic/G201298500"],
    kdpCategories: ["KDP Help: categories", "https://kdp.amazon.com/en_US/help/topic/G200652170"],
    kdpSelect: ["KDP Help: KDP Select", "https://kdp.amazon.com/en_US/help/topic/G200798990"],
    kdpFreePromo: ["KDP Help: Free Book Promotions", "https://kdp.amazon.com/en_US/help/topic/G201298240"],
    kdpCountdown: ["KDP Help: Kindle Countdown Deals", "https://kdp.amazon.com/en_US/help/topic/G201293780"],
    kdpThresholds: ["KDP Help: payment thresholds", "https://kdp.amazon.com/en_US/help/topic/G201207800"],
    kdpLimit: ["KDP Community: update on KDP title creation limits", "https://www.kdpcommunity.com/s/article/KDP-Title-Creation-Limits-Update?language=en_US"],
    kdpCreate: ["KDP Help: create a book", "https://kdp.amazon.com/en_US/help/topic/G202172740"],
    substackPaid: ["Substack Help: how do I set up a paid publication?", "https://support.substack.com/hc/en-us/articles/360037459952-How-do-I-set-up-a-paid-publication"],
    substackRecs: ["Substack Help: how can I recommend other publications?", "https://support.substack.com/hc/en-us/articles/5036794583828-How-can-I-recommend-other-publications-on-Substack"],
    substackFeatured: ["Substack Help: how do I get featured on Substack?", "https://support.substack.com/hc/en-us/articles/360037455112-How-do-I-get-featured-on-Substack"],
    substackEndorse: ["Substack Help: add an endorsement to your publication", "https://support.substack.com/hc/en-us/articles/7889090558996-How-do-I-add-an-endorsement-to-my-Substack-publication"],
    beehiivRecs: ["beehiiv Help: FAQs about the Recommendations Network", "https://www.beehiiv.com/support/article/14194737991319-The-5-keys-to-successful-Boosts-campaigns-plus-FAQs"],
    beehiivAds: ["beehiiv Help: Ad Network FAQ", "https://www.beehiiv.com/support/article/17507491038231-ad-network-faq"],
    amzAssocPolicies: ["Amazon Associates: Associates Program Policies", "https://affiliate-program.amazon.com/help/operating/policies"],
    etsyMinors: ["Etsy: Minors Policy", "https://www.etsy.com/legal/minors/"],
    shopTerms: ["Shopify: Terms of Service", "https://www.shopify.com/legal/terms"],
    ebayIdentity: ["eBay: identity policies", "https://www.ebay.com/help/policies/identity-policies/identity-policies?id=4218"],
    fiverrMinors: ["Fiverr Help: navigating Fiverr as a minor", "https://help.fiverr.com/hc/en-us/articles/32567580782609-Navigating-Fiverr-as-a-minor-How-to-stay-safe-and-compliant"],
    upworkEligible: ["Upwork Help: who's eligible to join and use Upwork?", "https://support.upwork.com/hc/en-us/articles/211067778-Who-s-eligible-to-join-and-use-Upwork"],
    adsenseAge: ["AdSense Help: age requirement for an AdSense account", "https://support.google.com/adsense/answer/14230?hl=en"],
    adsenseUnder18: ["AdSense Help: monetising videos when you're under 18", "https://support.google.com/adsense/answer/2533300?hl=en"],
    kdpTerms: ["KDP: Terms and Conditions", "https://kdp.amazon.com/terms-and-conditions"],
    shopTaxUS: ["Shopify Help: navigating US tax regulations", "https://help.shopify.com/en/manual/taxes/us/navigating-us-tax-regulations"],
    shopTaxLiability: ["Shopify Help: US tax liability", "https://help.shopify.com/en/manual/taxes/us/us-tax-liability"],
    sstMarketplace: ["Streamlined Sales Tax: marketplace facilitator state guidance", "https://www.streamlinedsalestax.org/for-businesses/marketplace-facilitator"],
    etsySalesTax: ["Etsy Help: how US state sales tax applies to Etsy orders", "https://help.etsy.com/hc/en-us/articles/360000343968-How-US-State-Sales-Tax-and-Fees-Applies-to-Etsy-Orders"],
    hmrcVatReg: ["GOV.UK: register for VAT", "https://www.gov.uk/register-for-vat"],
    // Countries (checked October 2026)
    euStart: ["Your Europe: starting a business", "https://europa.eu/youreurope/business/running-business/start-ups/starting-business/index_en.htm"],
    euSmeVat: ["European Commission: the domestic SME VAT scheme", "https://sme-vat-rules.ec.europa.eu/sme-scheme/domestic-sme-scheme_en"],
    euGpsr: ["EUR-Lex: General Product Safety Regulation (EU) 2023/988", "https://eur-lex.europa.eu/eli/reg/2023/988/oj/eng"],
    euDac7: ["European Commission: DAC7 reporting by digital platforms", "https://taxation-customs.ec.europa.eu/taxation/tax-transparency-cooperation/administrative-co-operation-and-mutual-assistance/dac7_en"],
    euReturns: ["Your Europe: returning goods bought online", "https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm"],
    euGuarantee: ["Your Europe: consumer guarantees", "https://europa.eu/youreurope/business/selling-in-eu/consumer-contracts-guarantees/consumer-guarantees/index_en.htm"],
    shopPayCountries: ["Shopify Help: Shopify Payments supported countries", "https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries"],
    shopPayoutCur: ["Shopify Help: supported payout currencies", "https://help.shopify.com/en/manual/payments/shopify-payments/store-currency/supported-payout-currencies"],
    stripeGlobal: ["Stripe: global availability", "https://stripe.com/global"],
    ttsEurope: ["TikTok Newsroom: TikTok Shop expands across Europe", "https://newsroom.tiktok.com/tiktok-shop-expands-across-europe?lang=en-150"],
    amzGlobal: ["Amazon Global Selling", "https://globalselling.amazon.com/"],
    caSoleProp: ["Canada.ca: register a sole proprietorship or partnership", "https://www.canada.ca/en/services/business/start/register-with-gov/register-sole-prop-partner.html"],
    caBN: ["CRA: do you need a business number?", "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/business-registration/business-number-program-account/need-bn.html"],
    caGst: ["CRA: when to register for and charge GST/HST", "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html"],
    caT2125: ["CRA: Form T2125, statement of business or professional activities", "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2125.html"],
    caConsumer: ["Office of Consumer Affairs: complaint roadmap", "https://ised-isde.canada.ca/site/office-consumer-affairs/en/complaint-roadmap"],
    auAbnSole: ["ABR: ABN entitlement for sole traders", "https://www.abr.gov.au/business-super-funds-charities/applying-abn/abn-entitlement/sole-trader"],
    auAbnApply: ["business.gov.au: register for an ABN", "https://business.gov.au/registrations/register-for-an-australian-business-number-abn"],
    auBizName: ["ASIC: register a business name", "https://www.asic.gov.au/for-business-and-companies/business-names/register-a-business-name"],
    auGst: ["ATO: registering for GST", "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst"],
    auIncome: ["ATO: business, partnership and trust income", "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare/business-partnership-and-trust-income"],
    auAccc: ["ACCC: repair, replace, refund, cancel", "https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-replace-refund-cancel"],
    inUdyam: ["Ministry of MSME: Udyam registration", "https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm"],
    inGstReg: ["GST Council: registration under GST law", "https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Registration_under_GST_Law_new.pdf"],
    inGstEcom: ["GST Council: notification 34/2023 (small sellers on e-commerce platforms)", "https://gstcouncil.gov.in/sites/default/files/2024-05/gst-ct-34-2023.pdf"],
    inCgst24: ["CBIC: CGST Act, section 24", "https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter6/section24_v1.00.html"],
    inGstServices: ["CBIC: GST, an update (services through e-commerce)", "https://cbic-gst.gov.in/pdf/01062019-GST-An-Update.pdf"],
    inItr: ["Income Tax Department: individuals with business or profession income", "https://www.incometax.gov.in/iec/foportal/help/individual-business-profession"],
    inEcomRules: ["Department of Consumer Affairs: Consumer Protection (E-Commerce) Rules 2020", "https://consumeraffairs.nic.in/theconsumerprotection/consumer-protection-e-commerce-rules-2020"],
    inStripe: ["Stripe Support: Stripe accounts are invite-only in India", "https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india"],
    inPaypal: ["PayPal India: receiving payments from Indian customers", "https://www.paypal.com/in/cshelp/article/can-i-use-paypal-to-receive-payments-from-indian-customers-help1049"],
    inEtsy: ["Etsy Help: accepting payments as a seller in India", "https://help.etsy.com/hc/en-in/articles/6742925359255-How-to-Accept-Payments-as-a-Seller-in-India"],
    inAppsBlocked: ["PIB: government blocks 59 mobile apps (June 2020)", "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=1635206"],
    phBirOnline: ["BIR: taxpayer's guide for online sellers", "https://bir-cdn.bir.gov.ph/BIR/pdf/TAXPAYERS%20GUIDE%20FOR%20ONLINE%20SELLERS.pdf"],
    phBir91: ["BIR: RMC No. 91-2024 digest", "https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2091-2024%20Digest.pdf"],
    phBir38: ["BIR: RMC No. 38-2026 digest (registration badge)", "https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2038-2026%20Digest.pdf"],
    phBir8: ["BIR: RMC No. 8-2024 (e-marketplace sellers)", "https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%208-2024.pdf"],
    phDti: ["DTI: Business Name Registration System", "https://bnrs.dti.gov.ph/about"],
    phVat: ["BIR: RR No. 3-2024", "https://bir-cdn.bir.gov.ph/BIR/pdf/RR%203-2024%20(final).pdf"],
    phVat2021: ["BIR: RR No. 4-2021", "https://bir-cdn.bir.gov.ph/local/pdf/RR%20No.%204-2021_copy.pdf"],
    ph8pct: ["BIR: RMO No. 23-2018 digest (8% income tax option)", "https://bir-cdn.bir.gov.ph/local/pdf/RMO_No.%2023-2018_digest.pdf"],
    phNoReturn: ["DTI: is a “no return, no exchange” policy allowed?", "https://fairtrade.dti.gov.ph/faq/is-no-return-no-exchange-policy-allowed/"],
    phIta: ["DTI: Internet Transactions Act of 2023", "https://ecommerce.dti.gov.ph/internet-transactions-act-of-2023/"],
    phPaypal: ["PayPal Philippines: withdrawing money from PayPal", "https://www.paypal.com/ph/cshelp/article/how-do-i-withdraw-money-from-my-paypal-account-help394"],
    phTts: ["TikTok Shop PH: individual seller requirements", "https://seller-ph.tiktok.com/university/essay?knowledge_id=1409396384466690"],
    ngTaxId: ["Nigeria Revenue Service: what is a Tax ID?", "https://taxid.nrs.gov.ng/what-is-a-tax-id"],
    ngCac: ["CAC: business name registration", "https://www.cac.gov.ng/services/business-name"],
    ngPit: ["Joint Revenue Board: 2026 personal income tax guidelines", "https://www.jrb.gov.ng/assets/2026-pit-guidelines-TJG3n9-T.pdf"],
    ngTaxAdmin: ["Nigeria Revenue Service: Nigeria Tax Administration Act", "https://www.nrs.gov.ng/tax-laws/nigeria-tax-administration-act"],
    ngFccpc: ["FCCPC: consumer rights and responsibilities", "https://fccpc.gov.ng/consumers/consumer-rights-responsibilities/rights-responsibilities/"],
    ngEtsy: ["Etsy Help: why can't I open a shop in my country?", "https://help.etsy.com/hc/en-us/articles/1500006519562-Why-Can-t-I-Open-a-Shop-in-My-Country"],
    ngPaypal: ["PayPal Nigeria: receiving money through PayPal", "https://www.paypal.com/ng/cshelp/article/how-do-i-receive-money-through-paypal-help667"],
    brCarne: ["Receita Federal: Carnê-Leão", "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf/carne-leao"],
    brMei: ["gov.br: register as a Microempreendedor Individual (MEI)", "https://www.gov.br/pt-br/servicos/realizar-registro-como-microempreendedor-individual-mei"],
    brMeiLimit: ["gov.br: the MEI revenue limit", "https://www.gov.br/memp/pt-br/teto-do-mei"],
    brDasn: ["Receita Federal: MEI annual declaration due by 31 May (2026)", "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/maio/microempreendedor-individual-mei-tem-ate-31-de-maio-para-entregar-declaracao-anual"],
    brArrep: ["gov.br: the right of withdrawal for online purchases", "https://www.gov.br/mj/pt-br/assuntos/noticias/consumidor-tem-direito-ao-arrependimento-em-compras-on-line"],
    ttsBrazil: ["TikTok Newsroom: TikTok Shop arrives in Brazil", "https://newsroom.tiktok.com/pt-br/tiktok-shop-chega-ao-brasil"],
    govReturns: ["GOV.UK: accepting returns and giving refunds", "https://www.gov.uk/accepting-returns-and-giving-refunds"],
    govDistance: ["GOV.UK: online and distance selling for businesses", "https://www.gov.uk/online-and-distance-selling-for-businesses"],
    ukCCRegs: ["legislation.gov.uk: Consumer Contracts Regulations 2013", "https://www.legislation.gov.uk/uksi/2013/3134"],
    hmrcPlatformSeller: ["GOV.UK: selling goods or services on a digital platform", "https://www.gov.uk/guidance/selling-goods-or-services-on-a-digital-platform"],
    hmrcExcluded: ["HMRC manual: excluded sellers (IEIM901630)", "https://www.gov.uk/hmrc-internal-manuals/international-exchange-of-information/ieim901630"],
    hmrcSellersNews: ["GOV.UK: information for online sellers", "https://www.gov.uk/government/news/information-for-online-sellers"],
    hmrc3000: ["GOV.UK: side hustlers to be taken out of tax returns (March 2025)", "https://www.gov.uk/government/news/boost-for-side-hustlers-as-300000-people-to-be-taken-out-of-tax-returns-government-announces"],
    taxHustles: ["HMRC: Tax Help for Hustles, selling online", "https://taxhelpforhustles.campaign.gov.uk/buying-or-making-things-to-sell-and-online-selling-tax-rules/"],
    etsyUKSell: ["Etsy UK: how to sell on Etsy (fees)", "https://www.etsy.com/uk/sell"],
    etsyUKFees: ["Etsy UK: Fees & Payments Policy", "https://www.etsy.com/uk/legal/fees/"],
    etsyProcessing: ["Etsy Help: payment processing fees", "https://help.etsy.com/hc/en-gb/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy"],
    etsyROF: ["Etsy Help: what is a Regulatory Operating Fee?", "https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee"],
    etsyVatFees: ["Etsy Help: how VAT is collected on seller fees", "https://help.etsy.com/hc/en-us/articles/360040584433-How-VAT-Is-Collected-on-Seller-Fees"],
    ebayUKPrivate: ["eBay UK: fees for private sellers", "https://www.ebay.co.uk/help/selling/fees-credits-invoices/fees-private-sellers-activated-managed-payments?id=4822"],
    ebayUKBPF: ["eBay UK: Buyer Protection fee", "https://www.ebay.co.uk/help/buying/paying-items/buyer-protection-fee?id=5594"],
    ebayUKBusiness: ["eBay UK: fees for business sellers", "https://www.ebay.co.uk/help/selling/fees-credits-invoices/fees-business-sellers-activated-managed-payments?id=4809"],
    ebayUKRateCard: ["eBay UK Seller Centre: rate card change (February 2026)", "https://www.ebay.co.uk/sellercentre/news/2026-january/rate-card-change"],
    ebayUKROF: ["eBay UK Seller Centre: regulatory operating fee", "https://www.ebay.co.uk/sellercentre/news/2024-february/regulatory-operating-fee"],
    euOss: ["European Commission: the VAT One Stop Shop", "https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en"],
    shopReserves: ["Shopify Help: Shopify Payments reserves", "https://help.shopify.com/en/manual/payments/shopify-payments/payouts/reserves"],
    shopHolds: ["Shopify Help: payout holds", "https://help.shopify.com/en/manual/payments/shopify-payments/payouts/account-holds"],
    etsyReserve: ["Etsy Help: what is a Payment account reserve?", "https://help.etsy.com/hc/en-us/articles/360058722214-What-is-a-Payment-Account-Reserve"],
    ebayHolds: ["eBay: transaction holds", "https://www.ebay.com/help/selling/getting-paid/getting-paid-items-youve-sold/payments-hold?id=4816"],
    paypalHolds: ["PayPal Help: new sellers, payments on hold", "https://www.paypal.com/us/cshelp/article/new-paypal-account-%E2%80%93-payments-on-hold-and-accessing-your-money-quicker-help848"],
    upworkFixed: ["Upwork Help: how payments for fixed-price contracts work", "https://support.upwork.com/hc/en-us/articles/211063718-How-payments-for-milestones-and-fixed-price-contracts-work"],
    upworkHourly: ["Upwork Help: how payments for hourly contracts work", "https://support.upwork.com/hc/en-us/articles/211063668-How-payments-for-hourly-contracts-work"],
    ttsTerms: ["TikTok Shop US: Seller Terms of Service", "https://seller-us.tiktok.com/university/essay?knowledge_id=1331308753078058&lang=en"],
    irsRecords: ["IRS: how long should I keep records?", "https://www.irs.gov/businesses/small-businesses-self-employed/how-long-should-i-keep-records"],
    hmrcRecords: ["GOV.UK: how long to keep your records if you're self-employed", "https://www.gov.uk/self-employed-records/how-long-to-keep-your-records"],
    shopChargeback: ["Shopify Help: the chargeback process", "https://help.shopify.com/en/manual/payments/chargebacks/chargeback-process"],
    stripeDisputes: ["Stripe Docs: respond to disputes", "https://docs.stripe.com/disputes/responding"],
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
    adobeStockContrib: ["Adobe Stock Contributor", "https://contributor.stock.adobe.com/"],
    adobeStockRoyalty: ["Adobe Stock Help: royalty rates for contributors", "https://helpx.adobe.com/stock/contributor/payments-earnings/royalties-pricing/royalty-rates-assets.html"],
    adobeStockRoyaltyEx: ["Adobe Stock Help: contributor payment guidelines", "https://helpx.adobe.com/stock/contributor/help/royalty-details.html"],
    adobeStockPayout: ["Adobe Stock Help: contributor payment requirements", "https://helpx.adobe.com/stock/contributor/help/getting-paid.html"],
    adobeStockPayoutReq: ["Adobe Stock Help: request a payment", "https://helpx.adobe.com/stock/contributor/payments-earnings/payment-taxes/request-payment-content.html"],
    adobeStockProviders: ["Adobe Stock Help: payment providers FAQ", "https://helpx.adobe.com/stock/contributor/payments-earnings/payment-taxes/payment-providers-payouts-faq.html"],
    adobeStockGuidelines: ["Adobe Stock Help: contributor guidelines", "https://helpx.adobe.com/stock/contributor/get-started/manage-your-account/account-submission-guidelines.html"],
    adobeStockSignup: ["Adobe Stock Help: sign up as a contributor", "https://helpx.adobe.com/stock/contributor/get-started/manage-your-account/sign-up-as-a-stock-contributor.html"],
    adobeStockAI: ["Adobe Stock Help: generative AI content guidelines", "https://helpx.adobe.com/stock/contributor/submit-your-content/submit-generative-ai-content/generative-ai-content-guidelines.html"],
    adobeStockAISubmit: ["Adobe Stock Help: submit AI-generated content", "https://helpx.adobe.com/stock/contributor/submit-your-content/submit-generative-ai-content/submit-generative-ai-content.html"],
    adobeStockModel: ["Adobe Stock Help: model release requirements", "https://helpx.adobe.com/stock/contributor/content-policies-guidelines/model-property-releases/model-release-requirements.html"],
    adobeStockProperty: ["Adobe Stock Help: property release requirements", "https://helpx.adobe.com/stock/contributor/content-policies-guidelines/model-property-releases/property-release-requirements.html"],
    adobeStockIP: ["Adobe Stock Help: intellectual property guidelines", "https://helpx.adobe.com/stock/contributor/get-started/manage-your-account/intellectual-property-violation.html"],
    adobeStockKeywords: ["Adobe Stock Help: titles and keywords", "https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/tips-effective-titles-keywords.html"],
    adobeStockReorder: ["Adobe Stock Help: reorder keywords", "https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/change-order-keywords.html"],
    adobeStockPhotoReq: ["Adobe Stock Help: photo submission requirements", "https://helpx.adobe.com/stock/contributor/submit-your-content/submit-photos/technical-legal-requirements-photo-submission.html"],
    adobeStockVideoReq: ["Adobe Stock Help: video submission requirements", "https://helpx.adobe.com/stock/contributor/submit-your-content/submit-videos/technical-requirements-for-video-submissions.html"],
    ssSubmit: ["Shutterstock Contributor", "https://submit.shutterstock.com/"],
    ssSignup: ["Shutterstock Help: how to sign up as a contributor", "https://submit.shutterstock.com/help/en/articles/10617443-how-do-i-sign-up-to-become-a-shutterstock-contributor"],
    ssSell: ["Shutterstock Help: how do I sell my work?", "https://submit.shutterstock.com/help/en/articles/10617495-how-do-i-sell-my-work-on-shutterstock"],
    ssAge: ["Shutterstock Help: is there a minimum age?", "https://submit.shutterstock.com/help/en/articles/10594572-is-there-a-minimum-age-for-contributors"],
    ssGuidelines: ["Shutterstock Help: account and content submission guidelines", "https://submit.shutterstock.com/help/en/articles/10594696-contributor-account-and-content-submission-guidelines"],
    ssLevels: ["Shutterstock Help: contributor earnings structure FAQ", "https://submit.shutterstock.com/help/en/articles/10594653-contributor-earnings-structure-faq"],
    ssPerDownload: ["Shutterstock Help: how much will I earn per download?", "https://submit.shutterstock.com/help/en/articles/10594609-how-much-will-i-earn-per-download"],
    ssPayouts: ["Shutterstock: contributor earnings schedule", "https://submit.shutterstock.com/payouts?language=en"],
    ssGetPaid: ["Shutterstock Help: how do I get paid?", "https://submit.shutterstock.com/help/en/articles/10617435-how-do-i-get-paid-for-my-work"],
    ssPaySettings: ["Shutterstock Help: change your payment settings", "https://submit.shutterstock.com/help/en/articles/10594632-how-do-i-change-my-payment-settings"],
    ssPayMethod: ["Shutterstock Help: set up your payment method", "https://submit.shutterstock.com/help/en/articles/12135709-how-do-i-set-up-or-fix-my-earnings-payment-method"],
    ssAI: ["Shutterstock Help: content policy update on AI-generated content", "https://submit.shutterstock.com/help/en/articles/10594622-content-policy-updates-ai-generated-content"],
    ssAIFaq: ["Shutterstock Help: AI-generated content contributor FAQ", "https://submit.shutterstock.com/help/en/articles/10594676-ai-generated-content-on-shutterstock-contributor-faq"],
    ssNonLicensable: ["Shutterstock Help: rejected as Non-Licensable Content", "https://submit.shutterstock.com/help/en/articles/10594633-why-was-my-content-rejected-as-non-licensable-content"],
    ssModel: ["Shutterstock Help: model release requirements", "https://submit.shutterstock.com/help/en/articles/12135904-what-are-the-requirements-for-model-releases"],
    ssProperty: ["Shutterstock Help: property release rejections", "https://submit.shutterstock.com/help/en/articles/12136608-why-was-my-content-rejected-for-property-release-issues"],
    ssWrongRelease: ["Shutterstock Help: rejected for Wrong Release", "https://submit.shutterstock.com/help/en/articles/10617500-why-was-my-content-rejected-for-wrong-release"],
    ssTrademark: ["Shutterstock Help: trademark rejections", "https://submit.shutterstock.com/help/en/articles/12136473-why-was-my-content-rejected-for-trademark-issues"],
    ssKeywords: ["Shutterstock Help: description and keyword best practices", "https://submit.shutterstock.com/help/en/articles/10594702-description-and-keyword-best-practices"],
    ssImageReq: ["Shutterstock Help: technical requirements for images", "https://submit.shutterstock.com/help/en/articles/10617390-what-are-the-technical-requirements-for-images"],
    ssVideoReq: ["Shutterstock Help: technical requirements for video", "https://submit.shutterstock.com/help/en/articles/10594637-what-are-the-technical-requirements-for-video"],
    canvaCreators: ["Canva: Canva Creators", "https://www.canva.com/creators/"],
    canvaCreatorsHelp: ["Canva Help: about the Canva Creators program", "https://www.canva.com/help/canva-creators-program/"],
    canvaCreatorsPay: ["Canva Help: setting up payments for Canva Creators", "https://www.canva.com/help/set-up-payout-details/"],
    canvaContribAgree: ["Canva: Contributor Agreement", "https://www.canva.com/policies/contributor-agreement/"],
    canvaContribUpdate: ["Canva Help: updates to the Contributor Agreement (Jan 2026)", "https://www.canva.com/help/updates-to-contributor-agreement-jan-2026/"],
    cmOpen: ["Creative Market Help: open a shop", "https://support.creativemarket.com/hc/en-us/articles/201251700-Open-a-Shop-on-Creative-Market"],
    cmSales: ["Creative Market Help: shop sales and analytics", "https://support.creativemarket.com/hc/en-us/articles/201193714-All-About-Shop-Sales-Analytics"],
    cmPayouts: ["Creative Market Help: taxes and payouts", "https://support.creativemarket.com/hc/en-us/articles/115004015634-Shop-Owner-Guide-to-Taxes-Payouts"],
    fbmSellerPolicy: ["Facebook: Marketplace Seller Protection Policy", "https://www.facebook.com/legal/merchant_policies"],
    fbmCommerce: ["Facebook: Commerce Policies", "https://www.facebook.com/policies_center/commerce/"],
    fbmPurchaseProt: ["Facebook Help: how Purchase Protection works on Marketplace", "https://www.facebook.com/help/228307904608701"],
    fbScams: ["Facebook Help: avoiding scams on Facebook", "https://www.facebook.com/help/1674717642789671"],
    offerupFree: ["OfferUp Help: what is OfferUp?", "https://help.offerup.com/hc/en-us/articles/360031989092-Is-OfferUp-free-to-use-"],
    offerupLimits: ["OfferUp Help: free listing limits", "https://help.offerup.com/hc/en-us/articles/13072929390228-About-free-listing-limits"],
    offerupShipEnd: ["OfferUp Help: nationwide shipping ending", "https://help.offerup.com/hc/en-us/articles/41043186552980-Nationwide-shipping-ending"],
    offerupTerms: ["OfferUp: Terms of Service", "https://offerup.com/terms"],
    offerupPosting: ["OfferUp Help: posting rules", "https://help.offerup.com/hc/en-us/articles/360031988292"],
    offerupSafety: ["OfferUp Help: safety tips for meeting up", "https://help.offerup.com/hc/en-us/articles/360032330891-Safety-tips-for-meeting-up"],
    offerupSpots: ["OfferUp Help: Community MeetUp Spots", "https://help.offerup.com/hc/en-us/articles/360032335691-About-Community-MeetUp-Spots"],
    offerupScams: ["OfferUp Help: common buying and selling scams", "https://help.offerup.com/hc/en-us/articles/360035054931-Common-buying-and-selling-scams"],
    vintedFree: ["Vinted Help: is using Vinted free?", "https://www.vinted.co.uk/help/373-is-selling-on-vinted-free"],
    vintedBP: ["Vinted Help: Buyer Protection", "https://www.vinted.co.uk/help/550-buyer-protection"],
    vintedPaid: ["Vinted Help: getting paid for a completed sale", "https://www.vinted.co.uk/help/4/235-getting-paid-for-a-completed-sale"],
    vintedWithdraw: ["Vinted Help: how to withdraw earnings", "https://www.vinted.co.uk/help/68-how-to-withdraw-earnings"],
    vintedAge: ["Vinted Help: verify your age", "https://www.vinted.co.uk/help/1057"],
    vintedTerms: ["Vinted: User Terms and Conditions", "https://www.vinted.co.uk/terms_and_conditions"],
    vintedHow: ["Vinted: how it works", "https://www.vinted.co.uk/how_it_works"],
    depopFees: ["Depop Help: seller fees and charges", "https://www.depop.com/help/seller-fees-and-charges/"],
    depopNewsUS: ["Depop: removing selling fees in the United States", "https://news.depop.com/company-news/depop-removes-selling-fees-in-the-united-states-evolves-fee-structure/"],
    depopNewsUK: ["Depop: zero selling fees on Depop", "https://news.depop.com/company-news/evolving-our-fee-structure-with-zero-selling-fees-on-depop/"],
    ebayUkSellerFees: ["eBay UK Seller Centre: seller fees", "https://www.ebay.co.uk/sellercentre/selling/start-selling/fees?targetgroup=C2C"],
    ebayUkBP: ["eBay UK: Buyer Protection, information for sellers", "https://www.ebay.co.uk/help/selling/selling/pricing-items/buyer-protection-information-sellers?id=5595"],
    ebayUkBizPolicy: ["eBay UK: business seller policy", "https://www.ebay.co.uk/help/policies/selling-policies/business-seller-policy?id=4710"],
    ebayUkBizAcct: ["eBay UK Seller Centre: business accounts", "https://www.ebay.co.uk/sellercentre/selling/start-selling/create-ebay-business-account"],
    ebayUnderage: ["eBay: underage user policy", "https://www.ebay.com/help/policies/identity-policies/underage-user-policy?id=4233"],
    ftcSelling: ["FTC: selling stuff online? Here's how to avoid a scam", "https://consumer.ftc.gov/consumer-alerts/2022/07/selling-stuff-online-heres-how-avoid-scam"],
    ftcFakeCheck: ["FTC: how to spot, avoid and report fake check scams", "https://consumer.ftc.gov/articles/how-spot-avoid-and-report-fake-check-scams"],
    irs1099kCommon: ["IRS: Form 1099-K FAQs, common situations", "https://www.irs.gov/newsroom/form-1099-k-faqs-common-situations"],
    irsHobby: ["IRS: hobby or business? What to know about that side hustle", "https://www.irs.gov/newsroom/hobby-or-business-heres-what-to-know-about-that-side-hustle"],
    hmrcPlatformData: ["GOV.UK: no tax changes for online sellers", "https://www.gov.uk/government/news/no-tax-changes-for-online-sellers"],
    ftcJobScams: ["FTC: job scams", "https://consumer.ftc.gov/articles/job-scams"],
    ftcReship: ["FTC: can you unbox the signs of a reshipping scam?", "https://consumer.ftc.gov/consumer-alerts/2025/12/can-you-unbox-signs-reshipping-scam"],
    ftcJobText: ["FTC: that job offer text is probably a scam", "https://consumer.ftc.gov/consumer-alerts/2026/04/job-offer-text-probably-scam"],
    ftcCoaching: ["FTC: how to spot and avoid business coaching scams", "https://consumer.ftc.gov/consumer-alerts/2026/04/how-spot-and-avoid-business-coaching-scams"],
    reportFraud: ["FTC: ReportFraud.ftc.gov", "https://reportfraud.ftc.gov/"],
    dolMinWage: ["US Department of Labor: questions and answers about the minimum wage", "https://www.dol.gov/agencies/whd/minimum-wage/faq"],
    dolStateMin: ["US Department of Labor: state minimum wage laws", "https://www.dol.gov/agencies/whd/minimum-wage/state"],
    dolOutside: ["US Department of Labor: Fact Sheet #17F, outside sales employees", "https://www.dol.gov/agencies/whd/fact-sheets/17f-overtime-outside-sales"],
    irsWorker: ["IRS: independent contractor (self-employed) or employee?", "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee"],
    irsTc762: ["IRS: Topic 762, independent contractor vs. employee", "https://www.irs.gov/taxtopics/tc762"],
    irsSS8: ["IRS: instructions for Form SS-8", "https://www.irs.gov/pub/irs-pdf/iss8.pdf"],
    ukNmwWho: ["GOV.UK: who gets the minimum wage", "https://www.gov.uk/national-minimum-wage/who-gets-the-minimum-wage"],
    ukNmwElig: ["GOV.UK: calculating the minimum wage, eligibility", "https://www.gov.uk/guidance/calculating-the-minimum-wage/eligibility-for-the-minimum-wage"],
    ukNmwCalc: ["GOV.UK: calculating the minimum wage", "https://www.gov.uk/guidance/calculating-the-minimum-wage"],
    hmrcNmwTime: ["HMRC manual: NMWM07040, time work", "https://www.gov.uk/hmrc-internal-manuals/national-minimum-wage-manual/nmwm07040"],
    blsSalesRep: ["BLS Occupational Outlook Handbook: wholesale and manufacturing sales representatives", "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm"],
    liScams: ["LinkedIn Help: recognize and report scams", "https://www.linkedin.com/help/linkedin/answer/a1336387"],
    liReportJob: ["LinkedIn Help: reporting jobs", "https://www.linkedin.com/help/linkedin/answer/a513290"],
    liVerify: ["LinkedIn Help: verification badge on job posts", "https://www.linkedin.com/help/linkedin/answer/a1492056"],
    liOpen: ["LinkedIn Help: let recruiters know you're Open to Work", "https://www.linkedin.com/help/linkedin/answer/a507508"],
    liAlerts: ["LinkedIn Help: job alerts", "https://www.linkedin.com/help/linkedin/answer/a511279"],
    indeedSafe: ["Indeed: guidelines for a safe job search", "https://support.indeed.com/hc/en-us/articles/216354123-Guidelines-for-a-Safe-Job-Search"],
    preplyCommission: ["Preply Help: Preply commission model", "https://help.preply.com/en/articles/4171383-preply-commission-model"],
    preplyPaid: ["Preply Help: when and how you get paid for lessons", "https://help.preply.com/en/articles/4171348-when-and-how-you-get-paid-for-lessons"],
    preplyRegister: ["Preply Help: register to teach on Preply", "https://help.preply.com/en/articles/4175138-register-to-teach-on-preply"],
    preplyId: ["Preply Help: identity verification guidelines", "https://help.preply.com/en/articles/4175176-identity-verification-guidelines"],
    preplyTeach: ["Preply: teach online", "https://preply.com/en/teach"],
    preplyTerms: ["Preply: Terms of Service", "https://termsofuse.preply.com/terms_of_use/en_TermsOfService.pdf"],
    preplyConduct: ["Preply: User Code of Conduct", "https://termsofuse.preply.com/terms_of_use/en_UserCodeOfConduct.pdf"],
    italkiCommission: ["italki Help: how does italki charge a commission?", "https://support.italki.com/hc/en-us/articles/206352068-How-does-italki-charge-a-commission"],
    italkiTypes: ["italki Help: Professional Teacher vs Community Tutor", "https://support.italki.com/hc/en-us/articles/900002978766-Difference-between-Professional-Teacher-and-Community-Tutor"],
    italkiPro: ["italki Help: how to become a Professional Teacher", "https://support.italki.com/hc/en-us/articles/206352058-How-do-I-become-a-Professional-Teacher-What-are-the-requirements-for-certificates"],
    italkiLang: ["italki Help: language requirements for teaching", "https://support.italki.com/hc/en-us/articles/206352078-What-are-the-language-requirements-for-teaching-on-italki-"],
    italkiOpen: ["italki Help: is my language open for application?", "https://support.italki.com/hc/en-us/articles/115001499873-What-is-the-Application-Process-"],
    italkiVideo: ["italki Help: introduction video guidelines", "https://support.italki.com/hc/en-us/articles/206352028-Introduction-video-guidelines-and-requirements"],
    italkiWithdraw: ["italki Help: how do I get paid and what's the withdrawal fee?", "https://support.italki.com/hc/en-us/articles/210002367-How-do-I-get-paid-and-what-s-the-withdrawal-fee"],
    italkiTos: ["italki: Terms of Service", "https://www.italki.com/en/tos"],
    italkiParents: ["italki Help: a guide for parents", "https://support.italki.com/hc/en-us/articles/6732554220825-For-parents-your-guide-to-kids-learning-on-italki"],
    italkiApply: ["italki: apply to teach", "https://teach.italki.com/en/application"],
    camblyTutors: ["Cambly: teach English online", "https://www.cambly.com/english/tutors"],
    camblyApply: ["Cambly Help: applying to become a tutor", "https://studentsupport.cambly.com/hc/en-us/articles/44522545417485-Applying-to-become-a-tutor"],
    camblyAddendum: ["Cambly: Tutor Addendum", "https://www.cambly.com/web/en/tutor/agreement_doc"],
    camblyKidsPrivacy: ["Cambly Kids Privacy Policy", "https://www.cambly.com/legal/kids_privacy_policy"],
    wyzantFee: ["Wyzant Support: fee structure for tutors", "https://support.wyzant.com/tutors/tutor-payments/what-is-the-fee-structure-for-tutors-listed-on-wyzant/"],
    wyzantStudentFee: ["Wyzant Support: the service fee charged to students", "https://support.wyzant.com/tutors/tutor-payments/what-is-the-service-fee-charged-to-students/"],
    wyzantPayPolicy: ["Wyzant Support: tutor payment policies", "https://support.wyzant.com/tutors/tutor-payments/tutor-payment-policies/"],
    wyzantWhenPaid: ["Wyzant Support: when will I be paid?", "https://support.wyzant.com/tutors/tutor-payments/when-will-i-be-paid/"],
    wyzantSchedule: ["Wyzant Support: tutor payment schedule update, July 2025", "https://support.wyzant.com/tutors/tutor-payments/tutor-payment-schedule-update-july-2025/"],
    wyzantCash: ["Wyzant Support: can I pay my tutor with cash?", "https://support.wyzant.com/hc/en-us/articles/115001993346-Can-I-pay-my-tutor-with-cash"],
    wyzantReg: ["Wyzant Support: tutor registration FAQs", "https://support.wyzant.com/tutors/tutor-account/tutor-registration-faqs/"],
    wyzantBg: ["Wyzant Support: background check policy", "https://support.wyzant.com/tutors/tutor-account/background-check-policy/"],
    wyzantVet: ["Wyzant Support: how does Wyzant vet tutors?", "https://support.wyzant.com/students-parents/find-a-tutor/how-does-wyzant-vet-tutors/"],
    wyzantHow: ["Wyzant: how it works for tutors", "https://www.wyzant.com/howitworks/tutors"],
    outschoolTeach: ["Outschool: teach online", "https://outschool.com/teach"],
    outschoolAddendum: ["Outschool: Teacher Addendum", "https://outschool.com/pages/teacher-addendum"],
    outschoolEarnings: ["Outschool Help: teacher earnings and payments policy", "https://support.outschool.com/en/articles/2382129-teacher-earnings-and-payments-policy"],
    outschoolRefunds: ["Outschool Help: refund policies for teachers", "https://support.outschool.com/en/articles/4626081-refund-policies-for-teachers"],
    outschoolProspective: ["Outschool Help: prospective educator FAQ", "https://support.outschool.com/en/articles/16057-prospective-educator-faq"],
    outschoolBecoming: ["Outschool Help: becoming an educator on Outschool", "https://support.outschool.com/en/articles/1638033-becoming-an-educator-on-outschool"],
    outschoolId: ["Outschool Help: teacher identity verification", "https://support.outschool.com/en/articles/4705479-teacher-identity-verification"],
    outschoolBg: ["Outschool Help: educator background checks", "https://support.outschool.com/en/articles/2701506-educator-background-checks"],
    outschoolSafety: ["Outschool: Trust & Safety", "https://outschool.com/safety"],
    outschoolPersonal: ["Outschool Help: when teachers may share personal information", "https://support.outschool.com/en/articles/9901053-when-teachers-may-share-their-personal-information"],
    outschoolRecordings: ["Outschool Help: sharing recorded classes", "https://support.outschool.com/en/articles/1746910-sharing-recorded-classes-with-learners-and-parents"],
    outschoolStrikes: ["Outschool Help: the Trust & Safety strike system for teachers", "https://support.outschool.com/en/articles/11084107-understanding-the-trust-safety-strike-system-for-teachers"],
    whopCrDocs: ["Whop Docs: Content Rewards", "https://docs.whop.com/memberships-and-access/third-party-apps/content-rewards"],
    whopDiscover: ["Whop: Content Rewards campaigns", "https://whop.com/discover/content-rewards/"],
    whopCrTerms: ["Content Rewards: creator terms of service", "https://b4e0vdqv6zgqeqj4pfgm.apps.whop.com/terms"],
    whopCrBrandTerms: ["Content Rewards: organization (brand) terms of service", "https://b4e0vdqv6zgqeqj4pfgm.apps.whop.com/brands-terms"],
    whopCrOldTerms: ["Whop: Content Rewards Terms of Service", "https://whop.com/content-rewards-terms-of-service/"],
    whopFtc: ["Whop: FTC guidelines for clippers", "https://whop.com/ftc/"],
    whopPayouts: ["Whop Docs: set up payouts", "https://docs.whop.com/manage-your-business/manage-payouts/set-up-payouts"],
    whopFees: ["Whop Docs: fees", "https://docs.whop.com/fees"],
    whopTos: ["Whop: Terms of Service", "https://whop.com/tos/"],
    twitchClips: ["Twitch Help: how to create, edit and share clips", "https://help.twitch.tv/s/article/how-to-use-clips?language=en_US"],
    twitchClipSettings: ["Twitch Help: clips settings", "https://help.twitch.tv/s/article/clips-settings?language=en_US"],
    twitchTos: ["Twitch: Terms of Service", "https://www.twitch.tv/p/en/legal/terms-of-service/"],
    twitchDmca: ["Twitch: DMCA Guidelines", "https://www.twitch.tv/p/en/legal/dmca-guidelines/"],
    twitchDmcaFaq: ["Twitch Help: DMCA & copyright FAQs", "https://help.twitch.tv/s/article/dmca-and-copyright-faqs?language=en_US"],
    twitchCopyCamp: ["Twitch Creator Camp: copyrights and your channel", "https://www.twitch.tv/creatorcamp/en/learn-the-basics/copyrights-and-your-channel/"],
    twitchCopyReport: ["Twitch Safety: 2024 Copyright Transparency Report", "https://safety.twitch.tv/s/article/2024-Copyright-Transparency-Report?language=en_US"],
    twitchAffJoin: ["Twitch Help: joining the Affiliate program", "https://help.twitch.tv/s/article/joining-the-affiliate-program?language=en_US"],
    twitchAffFaq: ["Twitch Help: Affiliate program FAQ", "https://help.twitch.tv/s/article/twitch-affiliate-program-faq?language=en_US"],
    twitchMonAll: ["Twitch Blog: Monetization for All (2026)", "https://blog.twitch.tv/en/2026/05/13/monetization-for-all/"],
    twitchOnboard: ["Twitch Help: Affiliate onboarding guide", "https://help.twitch.tv/s/article/affiliate-onboarding-guide?language=en_US"],
    twitchPaid: ["Twitch Help: when am I getting paid?", "https://help.twitch.tv/s/article/when-am-i-getting-paid?language=en_US"],
    twitchPartner: ["Twitch Help: Partner Program overview (revenue shares)", "https://help.twitch.tv/s/article/partner-program-overview?language=en_US"],
    twitchPlus: ["Twitch Help: Plus Program", "https://help.twitch.tv/s/article/plus-program?language=en_US"],
    twitchMonetization: ["Twitch Help: about monetization on Twitch", "https://help.twitch.tv/s/article/streamer-benefits?language=en_US"],
    twitchAdRev: ["Twitch Blog: the Ad Revenue Upgrade", "https://blog.twitch.tv/en/2022/06/14/bigger-ad-payouts-to-more-creators-the-ad-revenue-upgrade/"],
    twitchParents: ["Twitch Safety: guide for parents and educators", "https://safety.twitch.tv/s/article/Guide-Parents-Educators?language=en_US"],
    twitchMsa: ["Twitch: Monetized Streamer Agreement", "https://www.twitch.tv/p/en/legal/monetized-streamer-agreement/"],
    twitchSponsor: ["Twitch Blog: sponsorships are now available to Affiliates (Aug 2026)", "https://blog.twitch.tv/en/2026/08/20/sponsorships-are-now-available-to-affiliates/"],
    ytReused: ["YouTube Help: channel monetization policies (reused content)", "https://support.google.com/youtube/answer/1311392?hl=en"],
    ytShortsMon: ["YouTube Help: Shorts monetization policies", "https://support.google.com/youtube/answer/12504220?hl=en"],
    ytStrikes: ["YouTube Help: copyright strike basics", "https://support.google.com/youtube/answer/2814000?hl=en"],
    ytClaims: ["YouTube Help: learn about Content ID claims", "https://support.google.com/youtube/answer/6013276?hl=en"],
    ytRemix: ["YouTube Help: create Shorts with remixed content", "https://support.google.com/youtube/answer/10623810?hl=en"],
    ytEditShort: ["YouTube Help: create Shorts from your videos", "https://support.google.com/youtube/answer/12836917?hl=en"],
    ytPermissions: ["YouTube Help: channel permissions", "https://support.google.com/youtube/answer/9481328?hl=en"],
    ytPaidPromo: ["YouTube Help: add paid product placements, sponsorships and endorsements", "https://support.google.com/youtube/answer/154235?hl=en"],
    ytLiveStart: ["YouTube Help: get started with live streaming", "https://support.google.com/youtube/answer/2474026?hl=en"],
    ytLiveMobile: ["YouTube Help: create a live stream on mobile", "https://support.google.com/youtube/answer/9228390?hl=en"],
    ytLiveRestrict: ["YouTube Help: avoid restrictions on live streaming", "https://support.google.com/youtube/answer/2853834?hl=en"],
    ytEncoder: ["YouTube Help: create a live stream with an encoder", "https://support.google.com/youtube/answer/2907883?hl=en"],
    ytLiveTips: ["YouTube Help: live streaming tips", "https://support.google.com/youtube/answer/12917058?hl=en"],
    ytSuperElig: ["YouTube Help: Super Chat and Super Stickers eligibility", "https://support.google.com/youtube/answer/9277801?hl=en"],
    ytSuperManage: ["YouTube Help: manage Super Chat and Super Stickers", "https://support.google.com/youtube/answer/7288782?hl=en"],
    ytCommerce: ["YouTube Help: Commerce Products monetization policies", "https://support.google.com/youtube/answer/13195878?hl=en"],
    ttOriginality: ["TikTok Creator Academy: originality policy", "https://www.tiktok.com/creator-academy/article/tiktok-originality-policy"],
    ttIP: ["TikTok: Intellectual Property Policy", "https://www.tiktok.com/legal/page/global/copyright-policy/en"],
    ttBranded: ["TikTok: Branded Content Policy", "https://www.tiktok.com/legal/page/global/bc-policy/en"],
    ttDisclose: ["TikTok Ads Help: the commercial content disclosure setting", "https://ads.tiktok.com/help/article/about-the-content-disclosure-setting-for-creators"],
    ttOneSignup: ["TikTok Ads Help: how creators can sign up for TikTok One", "https://ads.tiktok.com/help/article/how-creators-can-sign-up-for-tiktok-one"],
    ttOneSupport: ["TikTok Support: TikTok One", "https://support.tiktok.com/en/business-and-creator/tiktok-one/creator-marketing"],
    ttOneAcademy: ["TikTok Creator Academy: TikTok One", "https://www.tiktok.com/creator-academy/article/tiktok-one"],
    ttOnePay: ["TikTok Ads Help: how creators set up payment for TikTok One", "https://ads.tiktok.com/help/article/how-creators-can-set-up-payment-for-tiktok-one"],
    ttOneTerms: ["TikTok One Creator Program Terms", "https://ads.tiktok.com/help/article/tiktok-one-creator-program-terms?lang=en"],
    ttSpark: ["TikTok Ads Help: Spark Ads creation guide", "https://ads.tiktok.com/help/article/spark-ads-creation-guide"],
    igRecs: ["Instagram Help: recommendations on Instagram", "https://help.instagram.com/313829416281232/"],
    igReach: ["Instagram for Creators: tips for improving your reach", "https://creators.instagram.com/blog/tips-for-improving-your-reach"],
    capcutShorts: ["CapCut: how to make a YouTube Short on PC", "https://www.capcut.com/resource/how-to-make-youtube-shorts-on-pc"],
    capcutReframe: ["CapCut: auto reframe", "https://www.capcut.com/tools/auto-reframe"],
    obs: ["OBS Studio", "https://obsproject.com/"],
    billoFaq: ["Billo: for creators", "https://billo.app/for-creators/"],
    billoStart: ["Billo Help: getting started guide for creators", "https://help.billo.app/en/articles/5766115-for-creators-getting-started-guide"],
    billoPaid: ["Billo Help: how and when you'll get paid", "https://help.billo.app/en/articles/5830098-for-creators-how-and-when-you-ll-get-paid"],
    billoPremium: ["Billo Help: becoming a Premium Creator", "https://help.billo.app/en/articles/6230554-for-creators-how-to-become-a-premium-creator"],
    billoTerms: ["Billo: Terms of Service for Creators", "https://billo.app/terms-of-service-creators/"],
    insenseCreators: ["Insense: for creators", "https://insense.pro/for-creators"],
    insenseFaq: ["Insense: FAQ", "https://insense.pro/faq"],
    insensePay: ["Insense Help: how payments work on Insense", "https://help-creators.insense.pro/4551"],
    insenseTerms: ["Insense: Terms of Service for Creators", "https://insense.pro/terms-of-service-for-creators"],
    amzInfInfo: ["Amazon: Influencer and Associate programs", "https://www.amazon.com/shop/info"],
    amzInfGuideAssoc: ["Amazon Associates: guide to the Amazon Influencer Program", "https://affiliate-program.amazon.com/resource-center/the-amazon-associates-guide-to-the-amazon-influencer-program"],
    amzInfUpload: ["Amazon Associates Help: uploading videos to your storefront", "https://affiliate-program.amazon.com/help/node/topic/GKZN7G85Q4XGX29C"],
    amzInfFaq: ["Amazon: Influencer FAQs, video shorts", "https://www.amazon.com/b?ie=UTF8&node=21423476011"],
    amzInfRules: ["Amazon: Influencer content guidelines, video shorts", "https://www.amazon.com/b?ie=UTF8&node=21423477011"],
    ftcGuides: ["FTC: Guides Concerning the Use of Endorsements and Testimonials", "https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf"],
    ftcReviewsRule: ["FTC: Consumer Reviews and Testimonials Rule, questions and answers", "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers"],
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
    ["stock", "Sell photos, videos and templates", "Stock sites license your work to many buyers"],
    ["declutter", "Sell your own things", "A quick, low-risk first sale from things you already own"],
    ["salesjob", "Remote sales jobs", "Get paid to sell a company's products online"],
    ["tutor", "Online tutoring", "Teach a subject or language over video"],
    ["clipping", "Stream clipping", "Short clips from creators' long videos, with permission"],
    ["ugc", "UGC creator", "Product videos brands use in their own ads"],
  ];
  const ADS_MODELS = ["supplier", "pod", "digital", "courses", "fba", "handmade"];
  const MODEL_NAME = Object.fromEntries(MODELS.map(([k, v]) => [k, v]));
  const CHANNEL_NAME = {
    shopify: "Shopify", etsy: "Etsy", tiktok: "TikTok Shop", ebay: "eBay", amazon: "Amazon",
    aff_amazon: "Amazon Associates", aff_tiktok: "TikTok Shop affiliate", aff_network: "Affiliate networks",
    gumroad: "Gumroad", payhip: "Payhip", mercari: "Mercari", poshmark: "Poshmark",
    fiverr: "Fiverr", upwork: "Upwork", direct: "Own clients", yt: "YouTube", tt_creator: "TikTok Creator Rewards",
    teachable: "Teachable", thinkific: "Thinkific", kdp: "Amazon KDP", substack: "Substack", beehiiv: "beehiiv", amz_fba: "Amazon FBA",
    adobe_stock: "Adobe Stock", shutterstock: "Shutterstock", canva_creators: "Canva Creators",
    fbm: "Facebook Marketplace", offerup: "OfferUp", vinted: "Vinted", depop: "Depop", ebay_own: "eBay",
    employee: "Employee role", contract: "Commission-based contract",
    preply: "Preply", italki: "italki", cambly: "Cambly", wyzant: "Wyzant", outschool: "Outschool",
    whop: "Content Rewards (Whop)", hire: "Clip editor for hire",
    billo: "Billo", insense: "Insense", tt_one: "TikTok One", amz_inf: "Amazon Influencer", ugc_direct: "Own brand clients",
    twitch: "Twitch", yt_live: "YouTube Live",
  };
  const CHANNELS = {
    supplier: [["shopify", "My own store (Shopify)", "Your website and checkout"], ["tiktok", "TikTok Shop", "US rules, fast shipping"], ["ebay", "eBay", "Wholesale supplier needed"], ["amazon", "Amazon", "You're seller of record"]],
    pod: [["shopify", "My own store (Shopify)", "Your website and checkout"], ["etsy", "Etsy", "Your own designs only"], ["tiktok", "TikTok Shop", "US rules"]],
    affiliate: [["aff_amazon", "Amazon Associates", "Links to Amazon products"], ["aff_tiktok", "TikTok Shop affiliate", "Promote products in TikTok videos"], ["aff_network", "Brand programs", "Awin, impact.com, CJ"]],
    digital: [["etsy", "Etsy", "Made or designed by you"], ["shopify", "My own store (Shopify)", "With a downloads app"], ["gumroad", "Gumroad", "No monthly fee"], ["payhip", "Payhip", "Free plan available"]],
    resell: [["ebay", "eBay", "Huge audience"], ["mercari", "Mercari", "No listing fees"], ["poshmark", "Poshmark", "Clothing and more"]],
    freelance: [["fiverr", "Fiverr", "Clients buy your packages"], ["upwork", "Upwork", "You send proposals"], ["direct", "My own clients", "Referrals, social, your own site"]],
    creator: [["yt", "YouTube", "Partner Program from 500 subscribers"], ["tt_creator", "TikTok Creator Rewards", "10,000 followers needed"], ["twitch", "Twitch (live)", "Affiliate from 25 followers"], ["yt_live", "YouTube Live", "16+; 50 subscribers on mobile"]],
    courses: [["teachable", "Teachable", "7-day free trial"], ["thinkific", "Thinkific", "30-day free trial"], ["payhip", "Payhip", "Free plan available"]],
    books: [["kdp", "Amazon KDP", "eBooks and paperbacks"]],
    newsletter: [["substack", "Substack", "Free; 10% of paid revenue"], ["beehiiv", "beehiiv", "Free up to 2,500 subscribers"]],
    fba: [["amz_fba", "Amazon FBA", "Professional plan needed"]],
    handmade: [["etsy", "Etsy", "Made by you, your own photos"], ["shopify", "My own store (Shopify)", "Your website and checkout"]],
    stock: [["adobe_stock", "Adobe Stock", "33% per photo licence, 35% per video"], ["shutterstock", "Shutterstock", "15% to 40% per download; no AI uploads"], ["canva_creators", "Canva Creators", "Apply first; paid from a royalty pool"]],
    declutter: [["fbm", "Facebook Marketplace", "Local pickup; shipping in the US"], ["offerup", "OfferUp", "Local pickup only (US)"], ["vinted", "Vinted", "No seller fees (UK and Europe)"], ["depop", "Depop", "No selling fee in the US and UK"], ["ebay_own", "eBay", "UK private sellers: no final value fee"]],
    salesjob: [["employee", "Employee role", "Salary or hourly pay, often plus commission"], ["contract", "Commission-based contract", "Self-employed; paid only when you sell"]],
    tutor: [["preply", "Preply", "You set your rate; 18% to 33% commission"], ["italki", "italki", "Languages; no commission on trials"], ["cambly", "Cambly", "English; set pay per minute"], ["wyzant", "Wyzant", "US residents; you keep 75%"], ["outschool", "Outschool", "Classes for children; you keep 70%"]],
    clipping: [["whop", "Clipping campaigns (Whop)", "Paid per 1,000 verified views; 18+"], ["hire", "Clip editor for a creator", "Fiverr, Upwork or direct"]],
    ugc: [["billo", "Billo", "US, Canada, UK; no following needed"], ["insense", "Insense", "Apply to brand briefs"], ["tt_one", "TikTok One", "18+; usually 1,000+ followers"], ["amz_inf", "Amazon Influencer videos", "Associates account and a following"], ["ugc_direct", "My own brand clients", "You pitch brands yourself"]],
  };
  const SHIP = (p) => p.model === "supplier" || p.model === "pod";
  // Countries with their own business-basics step. "eu" covers EU-wide rules;
  // registration and income tax still follow the member state.
  const COUNTRIES = [["us", "United States", ""], ["uk", "United Kingdom", ""], ["eu", "European Union", "EU-wide rules"], ["ca", "Canada", ""], ["au", "Australia", ""],
    ["in", "India", ""], ["ph", "Philippines", ""], ["ng", "Nigeria", ""], ["br", "Brazil", ""], ["other", "Somewhere else", ""]];
  const COUNTRY_IDS = COUNTRIES.map((c) => c[0]);
  const COUNTRY_NAME = Object.fromEntries(COUNTRIES.map((c) => [c[0], c[1]]));
  const COUNTRY_CUR = { us: "USD", uk: "GBP", eu: "EUR", ca: "CAD", au: "AUD", in: "INR", ph: "PHP", ng: "NGN", br: "BRL" };
  const CURRENCIES = ["USD", "GBP", "EUR", "CZK", "DKK", "HUF", "PLN", "RON", "SEK", "CAD", "AUD", "INR", "PHP", "NGN", "BRL"];
  const sellsGoods = (p) => SHIP(p) || ["handmade", "fba", "resell"].includes(p.model);
  const LEGAL_NOTE = (from) => '<p class="small muted">General information from ' + from + ', not legal or tax advice.</p>';
  const AGE_LINE = "Most selling and freelancing platforms need you to be 18, or the age of majority where you live if that's higher. Under 18, some let a parent or guardian own the account; they're then responsible for it, and the payouts go to them.";
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
    gumroad: "Gumroad: 10% + 50¢ per direct sale, plus card processing (2.9% + 30¢) or PayPal fees, and no monthly fee. Sales through Gumroad Discover cost a flat 30%, which includes processing.",
    payhip: "Payhip: Free plan takes 5% per sale, Plus ($29/month) 2%, Pro ($99/month) 0%. PayPal or Stripe processing is charged on top at their standard rates.",
    mercari: "Mercari: no listing fee; a 10% selling fee on the item price plus any shipping the buyer pays.",
    poshmark: "Poshmark (US): a flat $2.95 on sales under $15, and 20% on sales of $15 or more. No listing or monthly fees.",
    adobe_stock: "Adobe Stock pays contributors 33% of the net price for photos, vectors and illustrations, and 35% for videos. You can request a payout from US$25.",
    shutterstock: "Shutterstock pays 15% to 40% per download depending on your level for the calendar year (everyone restarts at level 1 on 1 January), and at least $0.10 per download.",
    canva_creators: "Canva pays Creators each month from a royalty pool, shared out by how often your templates or elements are used.",
    fbm: "Facebook Marketplace (US shipped sales): Meta's Seller Protection Policy lists 10% per transaction (minimum $0.80) on the full amount including shipping and tax; other Meta pages give a different rate, so check the fee shown when you list.",
    offerup: "OfferUp: no fees or commission on in-person sales. Most categories share 200 free listings a month; past the limits you'd need a paid subscription.",
    vinted: "Vinted: no fees for sellers to list or sell. Buyers pay a mandatory Buyer Protection fee at checkout.",
    depop: "Depop (US and UK sellers): no selling fee. Payment processing is 3.3% + $0.45 (US) or 2.9% + £0.30 (UK) on the item, shipping and tax.",
    ebay_uk: "eBay UK private sellers: no final value fee except in motors, and 300 free listings a month. Buyers pay a Buyer Protection fee on top.",
    preply: "Preply keeps 100% of your first (trial) lesson with each new student. On other lessons it keeps 33% of your rate at first, 28% after 20 hours taught, falling to 18% after 400 hours.",
    italki: "italki: no commission on trial lessons. Otherwise 21% on single lessons, 19% on 5-lesson packages, 17% on 10-lesson, 15% on 15- or 20-lesson, and 30% on group classes.",
    cambly: "Cambly pays a set rate: $0.17 a minute ($10.20 an hour) on Cambly, and $0.20 a minute ($12 an hour) on Cambly Kids.",
    wyzant: "Wyzant keeps a flat 25% platform fee, so you receive 75% of your hourly rate. There's no platform fee on students you refer yourself.",
    outschool: "Outschool keeps 30% of each enrollment, so you receive 70% of the class price. Listing classes is free.",
    whop: "Content Rewards: each campaign sets its pay per 1,000 views, its budget and any per-clip maximum. Brands pay the platform fee (10%, or 8% if verified). Some Whop withdrawal methods charge a fee, such as $2.50 per instant bank deposit.",
    hire: "Clip editing for a creator: no platform fee if they pay you directly (card processing still costs money). Fiverr keeps 20% of each order; Upwork's fee is 0% to 15% per contract.",
    billo: "Billo: each job shows a fixed payout before you apply, and it can't be negotiated. Approved videos are paid by PayPal twice a month.",
    insense: "Insense: the brand's payment is held when you're hired and released to your Insense wallet after approval. Insense may take a percentage when it transfers your fees; its terms don't state the rate.",
    twitch: "Twitch: subscriptions split 50/50 after taxes and payment fees (60/40 or 70/30 in the Plus Program), $0.01 per Bit cheered, and a share of ad revenue. Minimum payout $50 ($100 by wire).",
    yt_live: "YouTube Super Chat and Super Stickers: you keep 70% after local sales tax and iOS App Store fees; YouTube covers card fees.",
  };
  const FEE_SRC = { shopify: "shopPricing", etsy: "etsyFees", ebay: "ebayFees", tiktok: "ttsHome", amazon: "amzPricing", gumroad: "gumroad", payhip: "payhip", mercari: "mercariFees", poshmark: "poshFees", adobe_stock: "adobeStockRoyalty", shutterstock: "ssLevels", canva_creators: "canvaCreators", fbm: "fbmSellerPolicy", offerup: "offerupFree", vinted: "vintedFree", depop: "depopFees", ebay_uk: "ebayUKPrivate", preply: "preplyCommission", italki: "italkiCommission", cambly: "camblyTutors", wyzant: "wyzantFee", outschool: "outschoolAddendum", whop: "whopCrBrandTerms", hire: "fiverrVsUpwork", billo: "billoStart", insense: "insenseTerms", twitch: "twitchPartner", yt_live: "ytSuperManage" };
  // eBay fees differ for UK private sellers; the declutter steps use these.
  const dcFee = (p) => (p.channel === "ebay_own" ? FEE_TEXT[p.country === "uk" ? "ebay_uk" : "ebay"] : FEE_TEXT[p.channel]);
  const dcFeeSrc = (p) => (p.channel === "ebay_own" ? (p.country === "uk" ? ["ebayUKPrivate", "ebayUkBP"] : ["ebayFees"]) : [FEE_SRC[p.channel]]);
  const PICKUP = (p) => p.channel === "fbm" || p.channel === "offerup";

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
    { id: "d1-legal-us", day: 2, area: "legal", prio: "med", when: (p) => p.country === "us" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Sort out the business basics (US)",
      body: () => ul([
        "Most selling and freelancing platforms need you to be 18, or the age of majority where you live if that's higher. Under 18, some let a parent or guardian own the account; they're then responsible for it, and the payouts go to them.",
        "If you don't register another kind of business, you're a sole proprietor automatically and don't need to register the business with your state.",
        "Many states require a DBA (“doing business as”) filing if you trade under a name other than your own.",
        "Licenses and permits depend on your state, county and city. Your Secretary of State's website is the place to start.",
        "An EIN is free from the IRS and is issued online in minutes. Sole proprietors don't always need one, but you may need one to open a business bank account. Never pay a third-party site for it.",
        "Payment apps and marketplaces must send you a Form 1099-K when you pass $20,000 and 200 transactions in a year, and may send one below that. Either way, you must report all your income.",
        "Once your net self-employment earnings reach $400 in a year, you owe self-employment tax (15.3% on 92.35% of net earnings) and file Schedule SE. If you expect to owe $1,000 or more, pay estimated tax quarterly.",
      ]) + '<p class="small muted">General information from the SBA and IRS, not legal or tax advice.</p>',
      links: [link("sbaLicense", "Licenses and permits (SBA)"), link("irsEin", "Get an EIN (IRS)"), link("irsSE", "Self-employment tax")], src: ["sbaStructure", "sbaLicense", "irsEin", "irs1099kFaq", "irs1099k", "irsSE", "irsEst"] },

    { id: "d1-legal-uk", day: 2, area: "legal", prio: "med", when: (p) => p.country === "uk" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Check what HMRC needs from you (UK)",
      body: (p) => ul([
        "Most selling and freelancing platforms need you to be 18, or the age of majority where you live if that's higher. Under 18, some let a parent or guardian own the account; they're then responsible for it, and the payouts go to them.",
        "The trading allowance lets you earn up to £1,000 of gross trading income a year tax-free. It's measured before costs, not on profit, and covers all your side-hustle income together.",
        "If your gross trading income goes over £1,000 in a tax year, you must register for Self Assessment, by 5 October after that tax year ends.",
        "Buying goods to resell for a profit is usually treated as trading.",
        "The government has announced a £3,000 threshold for needing a Self Assessment return, but no start date is set. Until it changes, the £1,000 rule applies, and income above it must be reported.",
        "Platforms such as eBay, Vinted and Airbnb send HMRC your name, address, date of birth, National Insurance number and yearly earnings, and send you a copy by 31 January.",
        "You're left out of those reports only if you made fewer than 30 sales of goods and received €2,000 (about £1,700) or less in the year. Services are always reported. Being reported doesn't by itself mean you owe tax.",
        sellsGoods(p) ? "Online buyers can cancel within 14 days of receiving their goods, without giving a reason, and then have another 14 days to send them back. Refund within 14 days of getting the item back, including standard delivery." : "",
        sellsGoods(p) ? "If you don't tell buyers about this right, they can cancel for up to 12 months." : "",
      ]) + '<p class="small muted">General information from GOV.UK, not tax advice.</p>',
      links: [link("hmrcOnline", "Check if you need to tell HMRC"), link("hmrcAllow", "Trading allowance")],
      src: (p) => ["hmrcAllow", "hmrcOnline", "hmrc3000", "taxHustles", "hmrcPlatformSeller", "hmrcExcluded", "hmrcSellersNews"].concat(sellsGoods(p) ? ["govReturns", "govDistance", "ukCCRegs"] : []) },

    { id: "d1-legal-eu", day: 2, area: "legal", prio: "med", when: (p) => p.country === "eu" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Check the business basics in your EU country",
      body: (p) => ul([
        AGE_LINE,
        "Registration, taxes and legal forms follow your own country's rules. Each EU country has an online “Point of Single Contact” for setting up. As an EU citizen you can set up as a sole trader in any EU country.",
        "Income tax is reported in the country where you're based, under its rules.",
        "Each country sets its own VAT registration threshold, up to €85,000 (EU SME scheme since 1 January 2025).",
        "Platforms report sellers to tax authorities by 31 January (DAC7). You're left out only with fewer than 30 sales of goods and €2,000 or less received in the year.",
        sellsGoods(p) ? "Online buyers can withdraw within 14 days without a reason; for goods, the 14 days start at delivery. Refund within 14 days of the cancellation; you can wait until the goods, or proof of return, arrive. Exceptions include personalised goods and sales by private individuals." : "",
        sellsGoods(p) ? "Since 13 December 2024 (GPSR), each listing must show the manufacturer's name, postal and electronic address, and an EU responsible person if the manufacturer is outside the EU, plus a picture, the product type and any warnings." : "",
      ]) + LEGAL_NOTE("the European Commission"),
      links: [link("euStart", "Your Europe: starting a business")],
      src: (p) => ["euStart", "euSmeVat", "euDac7"].concat(sellsGoods(p) ? ["euReturns", "euGuarantee", "euGpsr"] : []) },

    { id: "d1-legal-ca", day: 2, area: "legal", prio: "med", when: (p) => p.country === "ca" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Sort out the business basics (Canada)",
      body: (p) => ul([
        AGE_LINE,
        "A sole proprietor trading under their own legal name generally doesn't need to register a business name. Other trade names are registered with your province or territory.",
        "You need a Business Number only when you open a CRA program account, such as GST/HST or payroll.",
        "Report self-employment income on Form T2125 with your personal tax return. It covers sales on online platforms and influencer income.",
        sellsGoods(p) ? "Cancellation and return rules for buyers vary by province and territory. Your provincial or territorial consumer affairs office has the details." : "",
      ]) + LEGAL_NOTE("the Government of Canada"),
      links: [link("caSoleProp", "Registering a sole proprietorship"), link("caT2125", "Form T2125")],
      src: (p) => ["caSoleProp", "caBN", "caT2125"].concat(sellsGoods(p) ? ["caConsumer"] : []) },

    { id: "d1-legal-au", day: 2, area: "legal", prio: "med", when: (p) => p.country === "au" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Sort out the business basics (Australia)",
      body: (p) => ul([
        AGE_LINE,
        "If you're carrying on a business as a sole trader, you can get an ABN for free through the Business Registration Service. Hobbies don't qualify.",
        "You don't need to register a business name if you trade under your own first name and surname only.",
        "Sole traders report business income in their individual tax return, using the business and professional items schedule.",
        sellsGoods(p) ? "Australian Consumer Law guarantees apply to online sales. For a major problem the buyer chooses a refund, replacement or repair. There's no legal change-of-mind right, but you must honour your own returns policy." : "",
      ]) + LEGAL_NOTE("the ATO, ABR and ASIC"),
      links: [link("auAbnApply", "Register for an ABN"), link("auBizName", "Business names (ASIC)")],
      src: (p) => ["auAbnSole", "auAbnApply", "auBizName", "auIncome"].concat(sellsGoods(p) ? ["auAccc"] : []) },

    { id: "d1-legal-in", day: 2, area: "legal", prio: "med", when: (p) => p.country === "in" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Sort out the business basics (India)",
      body: (p) => ul([
        AGE_LINE,
        "Udyam (MSME) registration is free and optional. You register with your own Aadhaar, and only on the official portal.",
        "Business income goes on your yearly income tax return. ITR-4 (Sugam) is an optional simplified form for presumptive income; otherwise you use ITR-3.",
        sellsGoods(p) ? "Under the Consumer Protection (E-Commerce) Rules 2020, marketplace sellers can't refuse returns or refunds for goods that are defective, deficient, spurious or not as described." : "",
      ]) + LEGAL_NOTE("Government of India sites"),
      links: [link("inUdyam", "Udyam registration"), link("inItr", "Income tax for business income")],
      src: (p) => ["inUdyam", "inItr"].concat(sellsGoods(p) ? ["inEcomRules"] : []) },

    { id: "d1-legal-ph", day: 2, area: "legal", prio: "med", when: (p) => p.country === "ph" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Register with the BIR (Philippines)",
      body: (p) => ul([
        AGE_LINE,
        "All self-employed people, including online sellers and content creators, must register with the BIR before their first sale, or within 30 days of getting a DTI business name or Mayor's permit.",
        "You can register online through ORUS with Form 1901 and ₱30 documentary stamp tax. Online sellers must show their BIR registration on their shop page.",
        "If you sell on an e-marketplace, give the platform your BIR Certificate of Registration before selling.",
        "Register any business name with the DTI online (BNRS). It's valid for 5 years and isn't a licence to operate.",
        "File quarterly (1701Q) and annual income tax returns. With ₱3,000,000 or less in sales you can choose a flat 8% instead of graduated rates; you choose each year.",
        sellsGoods(p) ? "“No return, no exchange” notices are banned. Buyers get a repair, replacement or refund for hidden defects, but not for a change of mind." : "",
      ]) + LEGAL_NOTE("the BIR and DTI"),
      links: [link("phBirOnline", "BIR guide for online sellers"), link("phDti", "DTI business names")],
      src: (p) => ["phBir91", "phBirOnline", "phBir38", "phBir8", "phDti", "ph8pct"].concat(sellsGoods(p) ? ["phNoReturn", "phIta"] : []) },

    { id: "d1-legal-ng", day: 2, area: "legal", prio: "med", when: (p) => p.country === "ng" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Sort out the business basics (Nigeria)",
      body: (p) => ul([
        AGE_LINE,
        "Since 1 January 2026, a 13-digit Tax ID from the Nigeria Revenue Service (formerly FIRS) replaces old TINs. Individuals get theirs through their NIN.",
        "To trade under a business name, register it with the CAC online. You don't need a lawyer or accountant to do this.",
        "Every taxable person files an annual return by 31 March. For business income you need audited accounts or a statement of accounts you sign off yourself.",
        sellsGoods(p) ? "Under the FCCPA, buyers can return goods within a reasonable time if they're in good condition, with limited exceptions." : "",
      ]) + LEGAL_NOTE("the NRS, CAC and FCCPC"),
      links: [link("ngTaxId", "Get a Tax ID"), link("ngCac", "Register a business name")],
      src: (p) => ["ngTaxId", "ngCac", "ngPit", "ngTaxAdmin"].concat(sellsGoods(p) ? ["ngFccpc"] : []) },

    { id: "d1-legal-br", day: 2, area: "legal", prio: "med", when: (p) => p.country === "br" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Sort out the business basics (Brazil)",
      body: (p) => ul([
        AGE_LINE,
        "If you sell regularly for profit as a private person (CPF), the Receita Federal treats you as an individual business for income tax, even without a CNPJ.",
        "Becoming an MEI is free on the Portal do Empreendedor and gives you a CNPJ. Your activity must be on the permitted list, you can't be a partner in another company, and you can have at most one employee.",
        "The MEI revenue limit is R$81,000 a year (R$6,750 a month in your first year). A bill to raise it isn't law yet.",
        sellsGoods(p) ? "Buyers have 7 days from receiving an online purchase to withdraw (CDC art. 49), and their payment must be refunded immediately." : "",
      ]) + LEGAL_NOTE("gov.br"),
      links: [link("brMei", "Register as an MEI")],
      src: (p) => ["brCarne", "brMei", "brMeiLimit"].concat(sellsGoods(p) ? ["brArrep"] : []) },

    { id: "d1-legal-other", day: 2, area: "legal", prio: "med", when: (p) => p.country === "other" && !(p.model === "salesjob" && p.channel === "employee"),
      title: "Check your country's rules for selling online",
      body: () => "<p>Look up how your country handles registering a small business and paying tax on online income. If you sell into the EU, VAT rules can differ from normal retail. Shopify recommends talking to a lawyer about the laws where you operate and sell.</p><p>Most selling and freelancing platforms need you to be 18, or the age of majority where you live if that's higher. Under 18, some let a parent or guardian own the account; they're then responsible for it, and the payouts go to them.</p>",
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
        "The person who opens the store must be 18, or the age of majority where they live if that's older.",
      ]) + checked,
      links: [link("shopTrial", "Start the free trial"), link("shopPricing", "Compare plans")], src: ["shopPricing", "shopTrial", "shopTerms"] },

    { id: "d1-etsy", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "etsy",
      title: "Open your Etsy shop",
      body: () => ul([
        "Listing fee: $0.20 per listing, charged whether or not it sells. Listings last 4 months and renew for another $0.20 if auto-renew is on.",
        "Transaction fee: 6.5% of the order total, including shipping and gift wrap.",
        "Payment processing (US bank account): 3% + $0.25 per order.",
        "Offsite Ads: if a shopper clicks an Etsy ad on another site and buys within 30 days, Etsy charges 15% of the order total, up to $100 per order. Shops under $10,000 in yearly sales can opt out. Once a shop reaches $10,000 in 365 days, the rate is 12% and the ads can't be turned off.",
        "Etsy may charge a one-time shop setup fee. It varies by location, shows during sign-up and isn't refundable.",
        "You must be 18 to own an Etsy account. Teens 13 to 17 can sell only through a parent's or guardian's account, with their permission and direct supervision; the account's name, email and billing details must be the adult's.",
      ]) + checked,
      links: [link("etsySell", "Open Etsy's seller sign-up")], src: ["etsyFees", "etsyOffsite", "etsyMinors"] },

    { id: "d1-tiktok", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "tiktok",
      title: "Register as a TikTok Shop seller",
      body: (p) => ul([
        "Individual sellers must be 18 or older and live in the US.",
        "You need a US passport or passport card, driver's license, state ID or permanent resident card, plus the last 4 digits of your SSN (or an ITIN) and a bank account for payouts.",
        "Business sellers (LLCs, corporations, partnerships) need a US business address and an EIN.",
        "TikTok Shop's US page lists no setup fee and a 6% commission per sale.",
        p.country !== "us" ? "<b>These are TikTok Shop US rules.</b> If you live elsewhere, use your country's TikTok Shop Seller Center; requirements differ." : "",
      ]) + checked,
      links: [link("ttsHome", "Open TikTok Shop sign-up"), link("ttsIndividual", "Registration guide")], src: ["ttsHome", "ttsIndividual", "ttsTerms"] },

    { id: "d1-ebay", day: 1, area: "store", prio: "high", when: (p) => p.level === "new" && p.channel === "ebay",
      title: "Create your eBay seller account",
      body: () => ul([
        "Most categories: final value fee of 13.6% on the total sale up to $7,500, plus $0.30 per order of $10 or less, or $0.40 per order over $10.",
        "Without an eBay Store subscription, your first 250 listings each month have no insertion fee; after that it's $0.35 per listing.",
        "Payment processing is included in eBay's fees.",
        "Members must be 18 or older, because listing is a contract. Someone under 18 can use an adult's account with the holder's permission, and the holder is responsible for everything on it.",
      ]) + checked,
      links: [link("ebayStart", "eBay's start-selling guide"), link("ebayFees", "Fee details")], src: ["ebayFees", "ebayStart", "ebayIdentity"] },

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
      title: (p) => ({ shopify: "Watch Shopify's Dropshipping University videos", etsy: "Skim Etsy's Seller Handbook", tiktok: "Start the TikTok Shop Academy registration course", ebay: "Read eBay's start-selling guide", amazon: "Read Amazon's dropshipping guide" })[p.channel],
      body: (p) => ({
        shopify: "<p>Shopify's <i>Dropshipping University</i> is a free video series on the Learn With Shopify YouTube channel, about 3.5 hours long. It covers setting up your first store, product research and TikTok dropshipping. Check that any app it names is still offered before you follow those steps.</p>",
        etsy: "<p>Etsy's Seller Handbook collects advice from Etsy staff and sellers, sorted by how far along your shop is.</p>",
        tiktok: "<p>TikTok Shop Academy is TikTok's learning site for sellers. Its registration course explains business types, the documents you need and each sign-up step.</p>",
        ebay: "<p>eBay's guide walks through creating a seller account, listing, and shipping your first order.</p>",
        amazon: "<p>Amazon's seller-education page explains how dropshipping works in its store and links to its Drop Shipping Policy.</p>",
      })[p.channel],
      links: (p) => [link(({ shopify: "shopCourse", etsy: "etsyHandbook", tiktok: "ttsAcademy", ebay: "ebayStart", amazon: "amzDrop" })[p.channel], "Open it")],
      src: (p) => [({ shopify: "shopCourseBlog", etsy: "etsyHandbook", tiktok: "ttsAcademy", ebay: "ebayStart", amazon: "amzDrop" })[p.channel]] },

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
        "Ask whether US orders ship from a US warehouse or from abroad. Orders shipped from abroad now owe US import duty at any value.",
      ]) + checked,
      links: [link("dsersApp", "DSers"), link("cj", "CJdropshipping"), link("spocket", "Spocket"), link("autods", "AutoDS"), link("collective", "Shopify Collective")],
      src: ["dsers", "cj", "spocket", "autods", "shopCollective", "cbpEcomFaq"] },

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
        "If an order for a US customer is printed outside the US, it can now owe US import duty. Check how your print partner handles it before you set prices.",
      ]) + checked,
      links: [link("printful", "Printful"), link("printify", "Printify")], src: ["printful", "printify", "cbpEcomFaq"] },

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
        p.country === "us" || p.channel === "tiktok" ? "US imports no longer enter duty-free at any value: since August 29, 2025, parcels worth $800 or less pay duties, taxes and fees by product type, country of origin and value, by post too. A 2025 law makes this permanent from July 1, 2027." : "",
        p.country === "us" || p.channel === "tiktok" ? "Ask your supplier who pays US duty on each order and how much it adds. Put it in your product cost, and say in your shipping policy if customers may be charged on delivery." : "",
      ]) + checked,
      action: { label: "Open the profit calculator", go: "tools:profit" }, src: (p) => [FEE_SRC[p.channel]].concat(p.country === "us" || p.channel === "tiktok" ? ["cbpEcomFaq", "cbpDeMinimisRule"] : []) },

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
        "US payouts usually reach your bank 3 to 5 business days after a customer's payment is captured. New stores start with a longer settlement time that shortens as you fulfil orders on time. Higher-risk accounts can be put on a 5 to 20 business day schedule.",
        "Adding or changing your bank account can pause payouts for 3 to 5 business days.",
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
        "Meta: most advertisers charged per impression need at least $1 a day per ad set. Ads Manager warns you if a budget is below the minimum, and may suggest more if it's too low for good results.",
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
          "From April 14, 2026, purchases from customers who arrive through paid or boosted ads linking to Amazon don't earn commission, with limited exceptions.",
          "Since April 14, 2026, a purchase only earns commission if the item is shipped, streamed or downloaded, and paid for, within 180 days of the purchase.",
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
      src: (p) => ({ aff_amazon: ["amzAssocPart", "amzAssocAgree", "amzAssocUpdates", "amzAssocPolicies"], aff_tiktok: ["ttsCreator"], aff_network: ["awinJoin", "impact", "cjAff"] })[p.channel] },

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
          "You must be 18. Teens 13 to 17 can use Fiverr only through a parent's or guardian's account, and some services (such as modelling and dance lessons) aren't allowed for under-18s.",
        ]),
        upwork: ul([
          "Joining is free. Upwork's freelancer service fee varies from 0% to 15% per contract; you see the rate before you send a proposal or accept an offer, and it's charged only when you're paid.",
          "Proposals cost Connects. Basic accounts may get 10 free Connects a month; extra Connects cost $0.15 each (minimum 10). New freelancers may get up to 50 free Connects once.",
          "Freelancer Plus costs $19.99 a month and includes 100 Connects.",
          "You must be 18, or the age of majority in your country if that's older.",
        ]),
        direct: ul([
          "No platform fee, but you find every client yourself.",
          "You need: one page that shows your work and how to contact you, a simple written agreement for each job, and a way to send invoices and take payment.",
          "Card payments through processors such as Stripe cost money too. Stripe charges 2.9% + 30¢ for US cards; international cards add 1.5%, and currency conversion adds 1%.",
        ]),
      })[p.channel] + checked,
      links: (p) => ({ fiverr: [link("fiverrHow", "How Fiverr works")], upwork: [link("upworkFee", "Upwork fees"), link("upworkConnects", "Connects")], direct: [] })[p.channel],
      src: (p) => ({ fiverr: ["fiverrVsUpwork", "fiverrOrders", "fiverrHow", "fiverrMinors"], upwork: ["upworkFee", "upworkConnects", "upworkFree", "upworkEligible"], direct: ["stripePricing"] })[p.channel] },

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
      action: (p) => ({ label: "Open the lesson", go: ["twitch", "yt_live"].includes(p.channel) ? "lesson:live" : "lesson:creator" }) },

    { id: "cr1-program", day: 1, area: "legal", prio: "high", when: (p) => p.model === "creator" && p.channel !== "twitch",
      title: (p) => (p.channel !== "tt_creator" ? "Know the YouTube Partner Program requirements" : "Know the TikTok Creator Rewards requirements"),
      body: (p) => (p.channel !== "tt_creator" ? ul([
        "Fan funding and Shopping: 500 subscribers, 3 public uploads in the last 90 days, and either 3,000 watch hours in 12 months or 3 million Shorts views in 90 days. This doesn't change in 2027.",
        "Ad revenue: 1,000 subscribers and either 4,000 watch hours in 12 months or 10 million Shorts views in 90 days.",
        "From February 1, 2027, new applicants for ad revenue need 1,000 subscribers and either 8,000 watch hours in the last 365 days or 20 million Shorts views in the last 90 days. Channels already in the program keep their place.",
        "From February 1, 2027, earning from ads and Premium on Shorts needs 10 million Shorts views in the last 90 days. Below that you stay in the program and keep earning on long videos.",
        "You also need 2-Step Verification, no active Community Guidelines strikes, an AdSense account, and to live where the program is available. Every channel is reviewed before it's accepted.",
        "YouTube shares 55% of ad revenue on long videos and 45% on Shorts.",
        "From February 1, 2027, channels must stay active: 1,000 watch hours in 365 days, 1 million Shorts views in 90 days, or 2 long videos or 5 Shorts uploaded every 90 days. Accept the new terms in YouTube Studio by January 31, 2027, or the affected features stop paying.",
        "AdSense needs you to be 18. If you're younger, you can still earn by linking your channel to a parent's or guardian's AdSense account; payments go to them.",
      ]) : ul([
        "You need at least 10,000 followers and 100,000 video views in the last 30 days, a personal account in good standing, and to be 18 or older in an eligible country.",
        "Only original videos at least 1 minute long, posted after you join, can earn. Duets, Stitches, Photo Mode and paid or sponsored posts don't count.",
        "A video starts earning after 1,000 qualified For You views. Payment is monthly once you pass $50 (US terms).",
        p.country === "eu" ? "In the EU, only Germany and France are on TikTok's list of eligible countries." : ["ca", "au", "in", "ph", "ng"].includes(p.country) ? COUNTRY_NAME[p.country] + " isn't on TikTok's list of eligible countries, so you can't join from there." : p.country === "other" ? "Check TikTok's list of eligible countries for where you live." : "",
      ])) + checked,
      links: (p) => (p.channel !== "tt_creator" ? [link("ytYppJoin", "YouTube Partner Program")] : [link("ttRewardsAcademy", "Creator Rewards Program")]),
      src: (p) => (p.channel !== "tt_creator" ? ["ytYpp", "ytBlog", "ytYppChanges", "ytBlog2027", "adsenseAge", "adsenseUnder18"] : ["ttRewards", "ttRewardsAcademy", "ttRewardsTerms"]) },

    { id: "cr2-niche", day: 2, area: "research", prio: "high", when: (p) => p.model === "creator" && p.level !== "selling",
      title: "Pick a topic and a format you can repeat every week",
      body: () => ul([
        "Choose a topic you can make many videos about, and one repeatable format, such as reviews, tutorials or day-in-the-life.",
        "Use the trend and demand check to compare topics, and watch the most popular recent videos in your topic.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "cr3-batch", day: 3, area: "content", prio: "high", when: (p) => p.model === "creator" && !["twitch", "yt_live"].includes(p.channel),
      title: "Plan and film 5 videos in one session",
      body: (p) => ul([
        "Write a hook, three points and an ending for each video, then film them together.",
        p.channel === "tt_creator" ? "For Creator Rewards, make them at least 1 minute long and fully your own." : "Mix Shorts with at least one longer video; Shorts-feed views don't count towards watch hours (4,000 now, 8,000 for new applicants from February 1, 2027).",
        "Use only music, clips and images you have the rights to use.",
      ]),
      action: { label: "Draft hooks with AI", go: "tools:hooks" }, src: (p) => (p.channel === "tt_creator" ? ["ttRewards"] : ["ytYpp"]) },

    { id: "cr4-post", day: 4, area: "marketing", prio: "high", when: (p) => p.model === "creator" && !["twitch", "yt_live"].includes(p.channel),
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

    { id: "cr7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "creator" && !["twitch", "yt_live"].includes(p.channel),
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
        "Since September 21, 2026, an account can create up to 2 new titles per format (eBook, paperback, hardcover) each week; the count resets on Sunday at 00:00 UTC.",
        "You must be 18, or the age of majority where you live if that's older. A parent or guardian can open the account and be the publisher of a minor's book.",
      ]) + checked,
      links: [link("kdp", "Open KDP")], src: ["kdpEbook", "kdpPaper", "kdpPrint", "kdpLimit", "kdpTerms"] },

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
    { id: "on-inbox", day: 7, ongoing: true, repeat: "daily", area: "support", prio: "med", when: (p) => !["affiliate", "creator", "books", "newsletter", "freelance", "stock", "salesjob", "tutor", "clipping", "ugc"].includes(p.model),
      title: "Answer customer messages", body: () => "<p>Reply to every message. For late orders, send a delay notice with a new date and the option to cancel for a full refund.</p>", action: { label: "Open message templates", go: "tools:messages" }, src: ["ftcMail"] },
    { id: "on-post", day: 7, ongoing: true, repeat: "daily", area: "content", prio: "high", when: (p) => p.model === "affiliate",
      title: "Post one piece of content with a clear disclosure", body: DISCLOSE_TEXT, src: ["ftcInfluencer"] },
    { id: "on-list", day: 7, ongoing: true, repeat: "daily", area: "listings", prio: "med", when: (p) => p.model === "resell",
      title: "List 3 new items", body: () => "<p>Consistent listing is how a reselling shop grows. Price each item from recent sold listings.</p>" },
    { id: "on-pitch", day: 7, ongoing: true, repeat: "daily", area: "marketing", prio: "high", when: (p) => p.model === "freelance",
      title: "Reply to clients and send new proposals or pitches", body: () => "<p>Reply to every client message the same day, and spend some time each day finding the next job.</p>" },
    { id: "on-create", day: 7, ongoing: true, repeat: "daily", area: "content", prio: "high", when: (p) => ["creator", "newsletter", "books", "courses"].includes(p.model) && !["twitch", "yt_live"].includes(p.channel),
      title: (p) => ({ creator: "Make or post today's video", newsletter: "Work on the next issue", books: "Write today's words", courses: "Make one piece of course or marketing content" })[p.model],
      body: () => "<p>Small, steady output beats occasional big pushes. Keep to the schedule you chose.</p>" },
    { id: "on-make", day: 7, ongoing: true, repeat: "weekly", area: "content", prio: "med", when: (p) => p.model === "digital" || p.model === "pod" || p.model === "handmade",
      title: "Add or improve one product", body: () => "<p>Add a new design or product, or improve the listing of one that gets views but few sales.</p>" },
    { id: "on-week", day: 7, ongoing: true, repeat: "weekly", area: "finance", prio: "med", when: () => true,
      title: "Weekly check: income, costs and profit",
      body: (p) => "<p>Re-run the calculators with this week's real numbers, and log any sales in Tools › Sales log.</p>" + ul([
        "Save every receipt, invoice and payout report as you go.",
        p.country === "us" ? "The IRS generally expects you to keep records for 3 years after you file, and 6 years if you left out more than 25% of your income." : "",
        p.country === "uk" ? "HMRC: keep your records for at least 5 years after the 31 January Self Assessment deadline for that tax year." : "",
        p.channel === "shopify" ? "Check for chargebacks. On Shopify Payments you get 7 to 21 days to respond; Shopify charges $15 per US chargeback and returns it if you win. Add your messages with the customer and the policies they agreed to." : "",
        p.channel === "direct" ? "Check for Stripe disputes. You usually have 5 to 21 days to send evidence, and if you miss the deadline the customer wins." : "",
      ]), action: (p) => {
        // No calculator fits a sales job or stock royalties.
        const t = { affiliate: "affiliate", freelance: "rate", books: "royalty", newsletter: "recurring", creator: "creator", resell: "maxbuy", tutor: "rate", clipping: "rate", ugc: "rate", stock: null, salesjob: null }[p.model];
        return t === null ? null : { label: "Open the calculator", go: "tools:" + (t || "profit") };
      },
      src: (p) => [].concat(p.country === "us" ? ["irsRecords"] : [], p.country === "uk" ? ["hmrcRecords"] : [], p.channel === "shopify" ? ["shopChargeback"] : [], p.channel === "direct" ? ["stripeDisputes", "stripePricing"] : []) },
    { id: "on-supplier", day: 7, ongoing: true, repeat: "weekly", area: "suppliers", prio: "low", when: (p) => SHIP(p),
      title: "Check supplier stock, prices and delivery times", body: () => "<p>Update your prices and the delivery time you show customers if anything changed.</p>" },
    // ======== Stock photos, videos and templates
    { id: "st1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "stock" && p.level === "new",
      title: "Read: how selling stock photos, videos and templates works",
      body: () => "<p>A short lesson in this app: how stock sites pay you, what they accept, and the release and AI rules that get files rejected.</p>",
      action: { label: "Open the lesson", go: "lesson:stock" } },

    { id: "st1-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "stock",
      title: (p) => ({ adobe_stock: "Check you can join Adobe Stock, then sign up", shutterstock: "Check you can join Shutterstock, then sign up", canva_creators: "Check what Canva Creators asks for before you apply" })[p.channel],
      body: (p) => ({
        adobe_stock: ul([
          "You must be 18 or older and accept the Contributor Agreement. You sign in with a free Adobe account (Adobe ID).",
          "Your name, email and country must be accurate and match your legal documents. Adobe warns you can't change your country later.",
          "Before you can use the Contributor portal, verify your email address and a phone number that no other account uses.",
          "Without a valid tax form, Adobe withholds up to 30% of your earnings, depending on where you live.",
        ]),
        shutterstock: ul([
          "You must be 18 or older. Parents can't open an account for a child or submit a child's work under their own name.",
          "Opening an account and submitting work is free. Register under your full legal or business name, not a nickname.",
          "You need a valid tax form on file before you can submit content or be paid.",
          "Upload only work you made or own the copyright to. Don't share a PayPal, Payoneer or Skrill account with another contributor.",
        ]),
        canva_creators: ul([
          "You have to apply and be approved. Canva's application is built around a portfolio of your best work.",
          "Canva said that as of 2025 it isn't taking new applications for Element Creators (photos, graphics, video, audio). Check which Creator types are open before you start.",
          "Contributors must be over 18, or the legal age to sign an agreement where they live.",
          "Everything you submit must be your own original work. AI-generated content isn't permitted.",
        ]),
      })[p.channel] + checked,
      links: (p) => ({ adobe_stock: [link("adobeStockContrib", "Adobe Stock Contributor")], shutterstock: [link("ssSubmit", "Shutterstock Contributor")], canva_creators: [link("canvaCreators", "Canva Creators")] })[p.channel],
      src: (p) => ({ adobe_stock: ["adobeStockGuidelines", "adobeStockSignup", "adobeStockPayout"], shutterstock: ["ssAge", "ssSignup", "ssSell", "ssGuidelines"], canva_creators: ["canvaCreators", "canvaCreatorsHelp", "canvaContribAgree", "canvaContribUpdate"] })[p.channel] },

    { id: "st1-realistic", day: 1, area: "learning", prio: "med", when: (p) => p.model === "stock",
      title: "Know what's realistic before you start",
      body: (p) => ({
        adobe_stock: ul([
          "You get 33% of the net price for photos, vectors and illustrations, and 35% for video.",
          "Adobe's own example: a $29.99 monthly plan that covers 10 photos pays the contributor about $0.99 per photo.",
          "You can ask for a payout once you have $25 and your first sale is at least 45 days old. Adobe says payouts usually take 8 to 10 business days.",
        ]),
        shutterstock: ul([
          "Everyone restarts at level 1 on 1 January. Levels pay 15% to 40% per download and rise with downloads in that calendar year.",
          "Level 2 starts at 101 image downloads in the year (11 for video). The top level needs more than 25,000.",
          "Each download pays at least $0.10. You're paid monthly once you pass your payout minimum ($25 is the lowest you can set).",
        ]),
        canva_creators: ul([
          "Canva pays from a monthly royalty pool, split by how often your designs are used. Templates earn from Free and Pro use; elements only from Pro use.",
          "Canva keeps the monthly pool figures confidential, so there's no official rate per use.",
          "Payouts go out by the 15th of the month once you reach US$10 (US$25 by wire transfer), always in US dollars.",
        ]),
      })[p.channel] + '<p class="small muted">Earnings per download are small and vary with what each buyer paid. Acceptance doesn\'t guarantee sales.</p>' + checked,
      src: (p) => ({ adobe_stock: ["adobeStockRoyalty", "adobeStockRoyaltyEx", "adobeStockPayout", "adobeStockProviders"], shutterstock: ["ssLevels", "ssPayouts", "ssPerDownload", "ssPaySettings"], canva_creators: ["canvaCreators", "canvaCreatorsHelp", "canvaCreatorsPay"] })[p.channel] },

    { id: "st2-ai", day: 2, area: "legal", prio: "high", when: (p) => p.model === "stock",
      title: (p) => ({ adobe_stock: "Know Adobe Stock's rules for AI-generated work", shutterstock: "Know that Shutterstock doesn't accept AI-generated work", canva_creators: "Know that Canva doesn't accept AI-generated content" })[p.channel],
      body: (p) => ({
        adobe_stock: ul([
          "Adobe accepts generative AI images, vectors and videos, but you must tick “Created using generative AI tools” on every one.",
          "Check that your AI tool's licence allows commercial stock use. Adobe says it can't advise you on this.",
          "Don't name artists, real people, fictional characters or brands in prompts, titles or keywords, and don't put “generative AI” in the title.",
          "AI content can't be submitted as editorial. If a generated person or place isn't based on a real one, tick “People and Property are fictional”.",
          "Many versions of the same prompt count as spam.",
        ]),
        shutterstock: ul([
          "Shutterstock's policy: it “will not allow AI-generated content to be submitted by contributors for licensing”.",
          "Files that appear to be made with AI are rejected as non-licensable content.",
          "Its reason: contributors must prove they own what they submit, and ownership of AI output can't be given to one person.",
          "Shutterstock's own AI image tool is for its customers. Contributors are paid from its Contributor Fund when their work is used to train AI.",
        ]),
        canva_creators: ul([
          "Canva's Contributor Agreement: what you submit must be your own original work, “with human authorship as the creative source”. AI-generated content isn't permitted.",
          "Canva's January 2026 update says content may be reviewed, including with automated tools.",
        ]),
      })[p.channel],
      links: (p) => ({ adobe_stock: [link("adobeStockAI", "Adobe's generative AI guidelines")], shutterstock: [link("ssAI", "Shutterstock's AI policy")], canva_creators: [link("canvaContribAgree", "Canva Contributor Agreement")] })[p.channel],
      src: (p) => ({ adobe_stock: ["adobeStockAI", "adobeStockAISubmit"], shutterstock: ["ssAI", "ssAIFaq", "ssNonLicensable"], canva_creators: ["canvaContribAgree", "canvaContribUpdate"] })[p.channel] },

    { id: "st2-releases", day: 2, area: "legal", prio: "high", when: (p) => p.model === "stock" && p.channel !== "canva_creators",
      title: "Know when you need a model or property release",
      body: (p) => (p.channel === "adobe_stock" ? ul([
        "Every identifiable person needs their own signed model release, even if their face isn't shown. Group releases aren't accepted; a parent or guardian signs for a child.",
        "Crowds where no one can be identified, and back views with no recognisable features, don't need one.",
        "Recognisable private property, modern buildings, artwork (including public murals and your own art) and distinctive products need a property release signed by the owner.",
        "A plain building with nothing distinctive, or a public landscape with nothing private in it, doesn't need a property release.",
        "Adobe's advice when in doubt: get a release, or edit out the protected part.",
      ]) : ul([
        "Every recognisable person in commercial content needs a valid model release, even if the model is you. Every release must include the model's date of birth.",
        "Upload each release as its own JPEG file, up to 20 MB.",
        "Artwork, designs and other recognisable intellectual property need a property release that includes a picture of the property.",
        "Some artwork isn't accepted even with a release. A wrong or unneeded release is also a reason for rejection.",
      ])),
      links: (p) => (p.channel === "adobe_stock" ? [link("adobeStockModel", "Model releases"), link("adobeStockProperty", "Property releases")] : [link("ssModel", "Model release requirements")]),
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockModel", "adobeStockProperty"] : ["ssModel", "ssProperty", "ssWrongRelease"]) },

    { id: "st3-research", day: 3, area: "research", prio: "high", when: (p) => p.model === "stock" && p.level !== "selling",
      title: "Choose subjects buyers search for",
      body: (p) => ul([
        p.channel === "canva_creators" ? "Browse Canva's template library for the kind of design you want to make, such as social posts or presentations, and note what's missing." : "Search the site as if you were a buyer. Note what already exists for your subject and where good, fresh files are missing.",
        "Pick subjects you can make without logos, famous buildings or people who haven't signed a release.",
        "Use the trend and demand check to compare a few subjects.",
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" } },

    { id: "st3-tech", day: 3, area: "content", prio: "high", when: (p) => p.model === "stock" && p.channel !== "canva_creators",
      title: "Check the file requirements before you shoot",
      body: (p) => (p.channel === "adobe_stock" ? ul([
        "Photos: JPEG in sRGB colour, between 4 and 100 megapixels (at least 1,600 × 2,400 pixels), up to 45 MB.",
        "No watermarks, timestamps or branding. Images should be sharp and well lit. Don't over-compress or enlarge files.",
        "Videos: 5 to 60 seconds long, up to 3.9 GB, at a standard size such as 1920 × 1080 or 3840 × 2160. Don't upscale from your camera's resolution.",
      ]) : ul([
        "Images: JPEG (recommended) or TIFF, at least 4 megapixels. Multiply width by height: 2,000 × 2,400 pixels is 4.8 MP.",
        "The browser upload limit for photos is 50 MB. Still frames taken from video generally aren't accepted.",
        "Videos: up to 4 GB, at one of Shutterstock's listed HD or 4K sizes.",
      ])),
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockPhotoReq", "adobeStockVideoReq"] : ["ssImageReq", "ssVideoReq"]) },

    { id: "st4-make", day: 4, area: "content", prio: "high", when: (p) => p.model === "stock",
      title: (p) => (p.channel === "canva_creators" ? "Make 3 to 5 portfolio templates" : "Shoot or make your first 10 files"),
      body: (p) => (p.channel === "canva_creators" ? ul([
        "Make a few templates that show your best design work in the area you chose.",
        "Use only your own work, and fonts and images you have the right to use. AI-generated content isn't permitted.",
        "Put them online, for example on Behance or Dribbble, so you can link to them in your application.",
      ]) : ul([
        "Shoot or create 10 files around your chosen subject. Vary angles and framing; many near-copies can count as spam.",
        "Get any model or property releases signed at the shoot, before you upload.",
        "Keep logos and brand names out of the frame, or plan to remove them when you edit.",
      ])),
      src: (p) => (p.channel === "canva_creators" ? ["canvaCreators", "canvaContribAgree"] : p.channel === "adobe_stock" ? ["adobeStockAI", "adobeStockModel", "adobeStockIP"] : ["ssModel", "ssTrademark"]) },

    { id: "st4-trademarks", day: 4, area: "legal", prio: "high", when: (p) => p.model === "stock" && p.channel !== "canva_creators",
      title: "Remove logos, brand names and other people's artwork",
      body: (p) => (p.channel === "adobe_stock" ? ul([
        "Adobe Stock doesn't accept content showing trademarks or trade dress. Remove logos, for example on shirts and shoes, before you submit.",
        "Some products are recognisable even without a logo and can't be accepted, such as Rubik's Cubes, Apple devices and Lego sets.",
        "Public transport often has trademarked signs, maps and logos; remove those too.",
        "Keep brand names, artist names and trademarks out of titles and keywords.",
      ]) : ul([
        "Shutterstock doesn't accept trademarks or logos in commercial content or in titles and keywords, because buyers may use your file in ads or product branding.",
        "Remove the mark before you submit. A file with a trademark can go in as editorial only if it meets Shutterstock's editorial standards.",
        "Editorial illustrations, vectors and animations can't contain trademarks at all.",
      ])),
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockIP", "adobeStockProperty", "adobeStockKeywords"] : ["ssTrademark"]) },

    { id: "st5-keywords", day: 5, area: "listings", prio: "high", when: (p) => p.model === "stock" && p.channel !== "canva_creators",
      title: "Write titles and keywords",
      body: (p) => (p.channel === "adobe_stock" ? ul([
        "Add up to 49 keywords. Adobe's search gives most weight to the first 10, so put your best ones first, including the main words from your title.",
        "Keep titles to about 70 characters or they may be cut. Write the title and keywords in one language.",
        "Leave out trademarked names, camera details, people's names and the type of file.",
        "Adobe can suggest up to 25 keywords automatically. Check them and add your own.",
      ]) : ul([
        "Add between 7 and 50 keywords, in English. Scientific names and place names are exceptions.",
        "Repeating keywords or adding unrelated ones counts as spam.",
        "Leave logos and brand names out of titles and keywords.",
      ])),
      action: { label: "Draft it with AI", go: "tools:describe" },
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockKeywords"] : ["ssKeywords", "ssTrademark"]) },

    { id: "st5-submit", day: 5, area: "listings", prio: "high", when: (p) => p.model === "stock",
      title: (p) => (p.channel === "canva_creators" ? "Send your Canva Creators application" : "Upload and submit your first batch"),
      body: (p) => ({
        adobe_stock: ul([
          "Upload in the Contributor portal, add titles and keywords, attach each release, and tick the AI label if it applies.",
          "Every file is reviewed before it goes on sale. You can reorder keywords later, but not while files are being reviewed.",
        ]),
        shutterstock: ul([
          "Upload your files, add descriptions and keywords, and attach the right release to each file that needs one.",
          "Every file is reviewed. A wrong or unneeded release, a visible trademark or AI-made content are all reasons for rejection.",
        ]),
        canva_creators: ul([
          "Apply on Canva's Creators page with links to your portfolio.",
          "Canva reviews every application. Once accepted, you get its Review Guidelines, and each design is reviewed before it's published.",
        ]),
      })[p.channel],
      links: (p) => ({ adobe_stock: [link("adobeStockContrib", "Adobe Stock Contributor")], shutterstock: [link("ssSubmit", "Shutterstock Contributor")], canva_creators: [link("canvaCreators", "Apply to Canva Creators")] })[p.channel],
      src: (p) => ({ adobe_stock: ["adobeStockAISubmit", "adobeStockReorder"], shutterstock: ["ssWrongRelease", "ssTrademark", "ssNonLicensable"], canva_creators: ["canvaCreators", "canvaCreatorsHelp"] })[p.channel] },

    { id: "st6-payout", day: 6, area: "finance", prio: "high", when: (p) => p.model === "stock",
      title: "Set up your tax form and payout method",
      body: (p) => ({
        adobe_stock: ul([
          "Link a PayPal, Payoneer or Skrill account. Payoneer is for contributors outside the US.",
          "You can request a payout once you have at least $25 and 45 days have passed since your first sale. Your balance then resets to zero.",
          "Without a valid tax form, Adobe withholds up to 30%, depending on your country.",
        ]),
        shutterstock: ul([
          "Choose PayPal, Skrill or Payoneer; bank transfers and cheques aren't offered. A new PayPal or Skrill account can take about 72 hours to be accepted.",
          "Earnings are added up at the start of each month and usually sent between the 7th and 15th. Balances under your minimum roll over.",
          "Payout changes made after the month ends apply from the next month.",
        ]),
        canva_creators: ul([
          "Once accepted, set up payouts in Settings › Payments. Payouts are handled by Trolley, by bank transfer, PayPal or Payoneer.",
          "Submit a W-8 or W-9 tax form. Canva can't pay you without it.",
          "Royalties are paid in US dollars by the 15th of each month once you reach US$10 (US$25 for wire transfers).",
        ]),
      })[p.channel] + checked,
      src: (p) => ({ adobe_stock: ["adobeStockPayout", "adobeStockPayoutReq", "adobeStockProviders"], shutterstock: ["ssGetPaid", "ssPayMethod", "ssPaySettings"], canva_creators: ["canvaCreatorsPay", "canvaCreatorsHelp"] })[p.channel] },

    { id: "st6-rejections", day: 6, area: "listings", prio: "med", when: (p) => p.model === "stock" && p.channel !== "canva_creators",
      title: "Read any rejection reasons and fix the cause",
      body: (p) => (p.channel === "adobe_stock" ? ul([
        "Check each rejected file against Adobe's rules on releases, trademarks and AI labels before you resubmit.",
        "When in doubt, Adobe advises getting a release or editing out the protected part.",
      ]) : ul([
        "Trademark: remove the logo and resubmit, or submit it as editorial if it meets the editorial rules.",
        "Property release: check the form is complete and readable, lists the property type and includes a picture of the property.",
        "Non-licensable content includes files that appear to be AI-made; don't resubmit those.",
      ])),
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockProperty", "adobeStockIP", "adobeStockAI"] : ["ssTrademark", "ssProperty", "ssNonLicensable"]) },

    { id: "st7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "stock",
      title: "Review what was accepted and plan your next batch",
      body: (p) => ul([
        ({ adobe_stock: "Click your available balance in the Contributor portal to open the Insights page with your sales.",
           shutterstock: "Check your level: it counts only this calendar year's downloads and resets to level 1 on 1 January.",
           canva_creators: "If your application is still being reviewed, keep adding to your portfolio. Once accepted, see which designs are used most." })[p.channel],
        "Make more of the subjects that were accepted; drop ones rejected for reasons you can't fix.",
      ]),
      src: (p) => ({ adobe_stock: ["adobeStockPayoutReq"], shutterstock: ["ssLevels"], canva_creators: ["canvaCreators"] })[p.channel] },

    // ongoing (add next to the other on-* steps)
    { id: "on-stock-batch", day: 7, ongoing: true, repeat: "weekly", area: "content", prio: "high", when: (p) => p.model === "stock",
      title: (p) => (p.channel === "canva_creators" ? "Make and submit a new template" : "Upload a new batch of files"),
      body: () => "<p>Regular uploads build your portfolio. Vary subjects and angles: near-identical files and keyword spam can be rejected.</p>",
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockAI"] : p.channel === "shutterstock" ? ["ssKeywords"] : []) },
    { id: "on-stock-keywords", day: 7, ongoing: true, repeat: "weekly", area: "listings", prio: "low", when: (p) => p.model === "stock" && p.channel !== "canva_creators",
      title: "Improve titles and keywords on files that don't sell",
      body: (p) => "<p>" + (p.channel === "adobe_stock" ? "You can reorder keywords after upload, so move your strongest ones into the first 10." : "Check each keyword describes what's in the file; unrelated keywords count as spam.") + "</p>",
      src: (p) => (p.channel === "adobe_stock" ? ["adobeStockReorder", "adobeStockKeywords"] : ["ssKeywords"]) },
    // ======== Sell your own things
    { id: "dc1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "declutter" && p.level === "new",
      title: "Read: selling your own things online",
      body: () => "<p>A short lesson in this app: what each platform charges, how to stay safe meeting buyers, and when selling turns into a business.</p>",
      action: { label: "Open the lesson", go: "lesson:declutter" } },

    { id: "dc1-account", day: 1, area: "store", prio: "high", when: (p) => p.model === "declutter" && p.level === "new",
      title: (p) => "Set up " + CHANNEL_NAME[p.channel] + " and check what it charges",
      body: (p) => ul(({
        fbm: [
          "For shipped sales, Meta's US Seller Protection Policy lists a fee of 10% per transaction, minimum $0.80, worked out on the whole amount including shipping and tax.",
          "Meta starts your payment for a shipped order 5 days after delivery is confirmed.",
          "Seller Protection is only available in the US, for items that sell for $500 or less.",
          "Local pickups and deals arranged in Messenger aren't covered by Marketplace Purchase Protection.",
        ],
        offerup: [
          "OfferUp doesn't charge fees or take a commission on in-person sales.",
          "Most categories share 200 free listings a month. Cars and trucks, and motorcycles, get 1 each; appliances and phones 15; furniture, jewelry and tools 25. More needs a paid subscription.",
          "OfferUp doesn't process payments in the app: the buyer pays you at the meetup.",
        ],
        vinted: [
          "Vinted charges sellers nothing to upload or sell an item. Buyers pay a mandatory Buyer Protection fee at checkout.",
          "An order completes when the buyer confirms it's fine, or 2 days after delivery if they don't report a problem. Then the money moves to your available balance.",
          "Withdrawing to your bank can take up to 5 business days, and Vinted may ask you to verify your identity first.",
        ],
        depop: [
          "Sellers based in the US or UK pay no Depop selling fee. Payment processing is 3.3% + $0.45 in the US, or 2.9% + £0.30 in the UK.",
          "Processing is charged on the item price plus shipping and any tax, and is taken before your money is paid out.",
          "Boosted listings are optional and cost 12% of the sale.",
          "Buyers pay their own marketplace fee of up to 5% plus up to $1 (US) or £1 (UK).",
        ],
        ebay_own: p.country === "uk" ? [
          "UK private sellers pay no final value fee or regulatory operating fee in any category except motors.",
          "You get 300 free listings a month. Fees apply beyond that, for optional listing upgrades, or when you post to an overseas address.",
          "Buyers pay a Buyer Protection fee on top of your price: £0.10 per item plus 7% of the price up to £20, 4% from £20 to £300, and 2% from £300 to £4,000.",
        ] : [
          FEE_TEXT.ebay,
          "Without an eBay Store subscription, your first 250 listings each month have no insertion fee; after that it's $0.35 per listing.",
          "Payment processing is included in eBay's fees.",
        ],
      })[p.channel]) + checked,
      links: (p) => ({ fbm: [link("fbmSellerPolicy")], offerup: [link("offerupFree"), link("offerupLimits")], vinted: [link("vintedFree"), link("vintedPaid")], depop: [link("depopFees")], ebay_own: [link(p.country === "uk" ? "ebayUkSellerFees" : "ebayFees")] })[p.channel],
      src: (p) => ({ fbm: ["fbmSellerPolicy", "fbmPurchaseProt"], offerup: ["offerupFree", "offerupLimits", "offerupSafety"], vinted: ["vintedFree", "vintedBP", "vintedPaid", "vintedWithdraw"], depop: ["depopFees", "depopNewsUS", "depopNewsUK"], ebay_own: p.country === "uk" ? ["ebayUkSellerFees", "ebayUKPrivate", "ebayUkBP"] : ["ebayFees"] })[p.channel] },

    { id: "dc1-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "declutter",
      title: (p) => "Check " + CHANNEL_NAME[p.channel] + "'s rules on who can sell and what",
      body: (p) => ul(({
        fbm: [
          "Marketplace is meant for people selling to each other. Services, subscriptions, digital products and rentals aren't allowed.",
          "Banned items include weapons, ammunition, alcohol, tobacco, drugs, prescription and medical products, supplements and animals.",
          "Also banned: used cosmetics, recalled products, counterfeits, and anything stolen.",
          "Event tickets, gift cards and vouchers can be sold only by approved sellers.",
        ],
        offerup: [
          "Since September 23, 2025, new OfferUp listings can't offer shipping, so every sale is local pickup. OfferUp says it has no plans to bring nationwide shipping back.",
          "Any attempt to avoid a fee OfferUp charges, such as a listing fee, is against its terms.",
          "Read OfferUp's posting rules for the items it doesn't allow before you list.",
        ],
        vinted: [
          "You must be 18 or older to have your own Vinted account, and Vinted may ask for ID to prove it. Under-18s need a parent or guardian to set up and oversee an account.",
          "Vinted can ban an account whose owner can't verify their age.",
        ],
        depop: [
          "The no-selling-fee offer covers sellers based in the US, UK and Australia. Sellers elsewhere still pay a 10% selling fee.",
          "Check Depop's terms and prohibited items before you list.",
        ],
        ebay_own: [
          "You must be at least 18 to use eBay, because buying and selling there forms a contract.",
          p.country === "uk" ? "A private account is for selling things you no longer want. If you buy items to resell, or make items to sell, eBay requires you to register as a business seller." : "",
          p.country === "uk" ? "If you agree a sale outside eBay with a buyer you met there, eBay can still charge you a final value fee." : "",
        ],
      })[p.channel]),
      links: (p) => ({ fbm: [link("fbmCommerce")], offerup: [link("offerupPosting"), link("offerupShipEnd")], vinted: [link("vintedAge")], depop: [link("depopFees")], ebay_own: p.country === "uk" ? [link("ebayUkBizPolicy")] : [link("ebayUnderage")] })[p.channel],
      src: (p) => ({ fbm: ["fbmCommerce"], offerup: ["offerupShipEnd", "offerupTerms"], vinted: ["vintedTerms", "vintedAge"], depop: ["depopFees"], ebay_own: p.country === "uk" ? ["ebayUnderage", "ebayUkBizPolicy", "ebayUkBizAcct", "ebayUKPrivate"] : ["ebayUnderage"] })[p.channel] },

    { id: "dc2-pick", day: 2, area: "research", prio: "high", when: (p) => p.model === "declutter" && p.level !== "selling",
      title: "Choose your first 5 to 10 things to sell",
      body: () => ul([
        "Start with things that are clean, complete and working, and that you're happy to let go of.",
        "Skip anything your platform bans, anything that might be fake, and anything that's been recalled.",
        "Choose a few items you can price easily because the same thing has sold recently.",
      ]) },

    { id: "dc2-price", day: 2, area: "research", prio: "high", when: (p) => p.model === "declutter",
      title: "Price each item from what similar items sold for",
      body: (p) => ul([
        "Search eBay and filter for sold items: sold prices are what buyers really paid, not what sellers hope for.",
        "Compare items in the same condition, and set the lowest price you'd accept before anyone makes an offer.",
        dcFee(p),
      ]),
      action: { label: "Open the trend and demand check", go: "tools:trends" }, src: (p) => dcFeeSrc(p) },

    { id: "dc3-photos", day: 3, area: "content", prio: "high", when: (p) => p.model === "declutter",
      title: "Photograph and measure each item",
      body: () => ul([
        "Use daylight and a plain background. Show every side, any labels, and any flaws.",
        "Use your own photos of the actual item, never pictures copied from elsewhere.",
        "Measure it and note the brand, model or size, colour and real condition.",
      ]) },

    { id: "dc3-list", day: 3, area: "listings", prio: "high", when: (p) => p.model === "declutter",
      title: "Write and publish your listings",
      body: (p) => ul([
        "Title: brand, item type, size or model, and colour. Description: condition, measurements, flaws, and how the buyer gets it.",
        "Mention every flaw, so the buyer knows exactly what they're getting.",
        PICKUP(p) ? "Give a general area for pickup, not your home address. OfferUp advises keeping your phone number, email and address out of messages." : "",
      ]),
      action: { label: "Write the description with AI", go: "tools:describe" }, src: (p) => (PICKUP(p) ? ["offerupSafety"] : []) },

    { id: "dc4-scams", day: 4, area: "support", prio: "high", when: (p) => p.model === "declutter",
      title: "Learn the scams that target sellers",
      body: (p) => ul([
        "<b>Overpayment</b>: a “buyer” pays more than your price, often by check, and asks you to send back the difference. The check bounces weeks later, and you lose the money and the item.",
        "A bank saying a check has “cleared” doesn't mean it's good. Cashier's and certified checks can be fake too.",
        "<b>Fake payment notices</b>: check the money is in your own account before you hand over or post anything. Don't follow payment links in emails; log in yourself.",
        "<b>Verification codes</b>: never share a code sent to your phone. Scammers use it to set up a Google Voice number linked to yours.",
        "Scammers rush you and try to move the chat to email or other apps. Keep messages in the platform's app.",
        p.channel === "offerup" ? "OfferUp says buyers who offer more than your price and want to pay through another app first are very likely scammers." : "",
        p.country === "us" ? "Report scams to the platform and to the FTC at ReportFraud.ftc.gov." : "Report scams to the platform.",
      ]),
      links: [link("ftcSelling", "FTC: avoid scams when selling online")],
      src: (p) => ["ftcSelling", "ftcFakeCheck", "fbScams"].concat(p.channel === "offerup" ? ["offerupSafety", "offerupScams"] : []) },

    { id: "dc4-meet", day: 4, area: "orders", prio: "high", when: (p) => p.model === "declutter" && PICKUP(p),
      title: "Plan safe meetups for local pickup",
      body: (p) => "<p>OfferUp's safety advice works for any local sale:</p>" + ul([
        "Meet in a busy, well-lit public place in the daytime, not at your home.",
        "OfferUp's Community MeetUp Spots have lighting and video cameras around the clock; most are outside local businesses or police stations.",
        "Bring a friend or family member. If you go alone, tell someone you trust where you're going.",
        "For large items, meet first at a public spot and share the pickup address only once you feel comfortable.",
        "Turn down last-minute changes of place; scammers use them to lure people somewhere unsafe.",
        "Get paid before you hand the item over. OfferUp advises sellers to accept cash only.",
        p.country === "us" ? "If you feel unsafe, don't go. In an emergency, call 911." : "If it doesn't feel safe, don't go.",
        p.channel === "fbm" ? "Local pickups aren't covered by Marketplace Purchase Protection." : "OfferUp doesn't check or monitor MeetUp Spots, so use your own judgment too.",
      ]),
      links: [link("offerupSafety", "OfferUp: safety tips for meeting up"), link("offerupSpots", "Community MeetUp Spots")],
      src: (p) => ["offerupSafety", "offerupSpots"].concat(p.channel === "fbm" ? ["fbmPurchaseProt"] : ["offerupTerms"]) },

    { id: "dc5-ship", day: 5, area: "orders", prio: "med", when: (p) => p.model === "declutter" && p.channel !== "offerup",
      title: (p) => (p.channel === "fbm" ? "Decide on local pickup, shipping, or both" : "Get ready to post sold items"),
      body: (p) => ul([
        p.channel === "fbm" ? "If you offer shipping (US), get the item to the carrier within 7 calendar days of the sale, or Meta may cancel the order." : "",
        p.channel === "vinted" ? "The buyer pays for postage. Use the prepaid label Vinted gives you when an item sells." : "",
        "Have packaging ready so you can post the day an item sells, and keep proof of postage and tracking.",
      ]),
      src: (p) => (p.channel === "fbm" ? ["fbmSellerPolicy"] : p.channel === "vinted" ? ["vintedHow"] : []) },

    { id: "dc5-reply", day: 5, area: "support", prio: "med", when: (p) => p.model === "declutter",
      title: "Reply to messages and offers quickly",
      body: () => "<p>Reply the same day, and know your lowest price for each item before an offer comes in. Keep the conversation in the app until the sale is done.</p>",
      action: { label: "Open message templates", go: "tools:messages" } },

    { id: "dc6-tax", day: 6, area: "legal", prio: "med", when: (p) => p.model === "declutter",
      title: "Know when selling becomes a business",
      body: (p) => ul(p.country === "us" ? [
        "Selling your own things for less than you paid isn't taxable income, even if a platform sends you a Form 1099-K. You can't deduct the loss either.",
        "If you sell a personal item for more than you paid for it, the profit is taxable.",
        "Platforms must send a Form 1099-K once you pass $20,000 and 200 transactions in a year, and may send one below that. Keep a note of what you paid for valuable items.",
        "Buying things to resell for profit is different: that profit is income, and the IRS looks at whether you run it like a business. The Reselling plan covers the business basics.",
      ] : p.country === "uk" ? [
        "Selling your own unwanted things usually means no Income Tax. If one item, or a set, sells for more than £6,000, you may owe Capital Gains Tax.",
        "Platforms send HMRC details of sellers with 30 or more sales, or about £1,700, in a year, and tell you when they do. That alone doesn't mean you owe tax.",
        "Buying things to resell for profit, or making things to sell, usually counts as trading. Over £1,000 of trading income in a tax year means telling HMRC.",
      ] : [
        "Check how your country taxes occasional sales of your own things compared with buying items to resell.",
      ]) + '<p class="small muted">General information from the IRS and HMRC, not tax advice.</p>',
      links: (p) => (p.country === "us" ? [link("irs1099kCommon", "IRS: Form 1099-K common situations"), link("irsHobby", "IRS: hobby or business")] : p.country === "uk" ? [link("hmrcOnline", "Check if you need to tell HMRC")] : []),
      src: (p) => (p.country === "us" ? ["irs1099kCommon", "irs1099kFaq", "irsHobby"] : p.country === "uk" ? ["hmrcOnline", "hmrcPlatformData", "hmrcAllow"] : []) },

    { id: "dc7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "declutter",
      title: "Review what sold and decide on the rest",
      body: () => ul([
        "Write down what each sale brought in after fees and postage.",
        "For items with views but no offers, lower the price or retake the main photo.",
        "Decide what to relist, donate or keep.",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" } },

    // Ongoing (add to the "Ongoing (repeat)" block)
    { id: "on-dc-handover", day: 7, ongoing: true, repeat: "daily", area: "orders", prio: "high", when: (p) => p.model === "declutter",
      title: (p) => (PICKUP(p) ? "Arrange pickups for sold items" : "Post sold items and add tracking"),
      body: (p) => "<p>" + (PICKUP(p) ? "Agree a public meeting place and time, and take payment before you hand anything over." : "Post each sold item promptly and keep proof of postage.") + "</p>" },
    { id: "on-dc-list", day: 7, ongoing: true, repeat: "weekly", area: "listings", prio: "med", when: (p) => p.model === "declutter",
      title: "List a few more things you don't use",
      body: () => "<p>Clear one cupboard or room a week. Price each item from recent sold listings.</p>" },
    // ======== Remote sales jobs
    { id: "sj1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "salesjob" && p.level === "new",
      title: "Read: how remote sales jobs work",
      body: () => "<p>A short lesson in this app: how sales pay works, employee versus contractor, and the scams that target people looking for remote work.</p>",
      action: { label: "Open the lesson", go: "lesson:salesjob" } },

    { id: "sj1-status", day: 1, area: "legal", prio: "high", when: (p) => p.model === "salesjob",
      title: "Know the difference between an employee and a contractor",
      body: (p) => ul(p.country === "us" ? [
        "The IRS decides from the real working relationship, not the job title or contract: who controls how you work, who pays your costs, and whether the work is ongoing.",
        "If it's unclear, you or the company can file Form SS-8 to ask the IRS. It's free, but a decision can take six months or more.",
        "Employees covered by federal law must get at least $7.25 an hour, or their state's minimum if it's higher.",
        "Federal law exempts “outside sales” staff from minimum wage, but selling by phone, mail or internet from a base doesn't count as outside sales.",
        p.channel === "contract" ? "As a contractor you're self-employed: self-employment tax applies once your net earnings reach $400 in a year." : "",
      ] : p.country === "uk" ? [
        "Workers must get at least the National Minimum Wage for the hours they work, even if they aren't paid by the hour. Genuinely self-employed people aren't entitled to it.",
        "HMRC treats commission-only work done to set hours as time work, which the minimum wage covers.",
        "Being called self-employed doesn't settle it. Signs of real self-employment include choosing who you work for and controlling your own hours, breaks and holidays.",
        p.channel === "contract" ? "If you're genuinely self-employed and your trading income goes over £1,000 in a tax year, you must tell HMRC." : "",
      ] : [
        "Check your country's rules on minimum pay, and on employee versus self-employed status, before you accept commission-only work.",
      ]) + '<p class="small muted">General information from government sources, not legal or tax advice.</p>',
      links: (p) => (p.country === "us" ? [link("irsWorker", "IRS: contractor or employee?"), link("dolStateMin", "State minimum wages")] : p.country === "uk" ? [link("ukNmwWho", "Who gets the minimum wage")] : []),
      src: (p) => (p.country === "us" ? ["irsWorker", "irsTc762", "irsSS8", "dolMinWage", "dolStateMin", "dolOutside"].concat(p.channel === "contract" ? ["irsSE"] : []) : p.country === "uk" ? ["ukNmwWho", "ukNmwElig", "ukNmwCalc", "hmrcNmwTime"].concat(p.channel === "contract" ? ["hmrcAllow"] : []) : []) },

    { id: "sj2-scams", day: 2, area: "legal", prio: "high", when: (p) => p.model === "salesjob",
      title: "Learn the job scams before you apply",
      body: (p) => ul([
        "Honest employers never ask you to pay to get a job: not for training, starter kits, certifications or equipment.",
        "If an “employer” sends a check and asks you to send some of it on, or buy gift cards with it, it's a scam. The check bounces, and your bank takes the full amount back from you.",
        "Receiving packages and reshipping them is never a real job. The goods are often bought with stolen cards.",
        "Ignore unexpected job texts and WhatsApp or Telegram messages. Recruiters generally email from a company address, not Gmail or Yahoo.",
        "Be careful if someone offers you a job without talking to you first, or only interviews by chat.",
        "Never send or receive money for an employer, and don't send bank or card details by email or chat.",
        p.country === "us" ? "Report job scams to the job site and to the FTC at ReportFraud.ftc.gov." : "Report job scams to the job site.",
      ]),
      links: [link("ftcJobScams", "FTC: job scams"), link("indeedSafe", "Indeed: safe job search"), link("liScams", "LinkedIn: recognize scams")],
      src: (p) => ["ftcJobScams", "ftcFakeCheck", "ftcReship", "ftcJobText", "indeedSafe", "liScams"].concat(p.country === "us" ? ["reportFraud"] : []) },

    { id: "sj2-courses", day: 2, area: "learning", prio: "high", when: (p) => p.model === "salesjob",
      title: "Be wary of paid “closing” courses and sales coaching",
      body: (p) => ul([
        "The FTC says programs that promise guaranteed income, big returns for little work, or a “proven system” to make money are likely scams.",
        "If a coach asks you to pay even more to succeed, stop and talk to someone you trust. Pressure to buy now is a very strong sign of a scam.",
        "Success stories and online reviews can be made up.",
        "Before you pay for any course, search its name with “complaint”, “review” or “scam”.",
        p.country === "us" ? "Anyone selling you a work-at-home business opportunity in the US must give you a one-page disclosure document at least 7 days before you sign or pay." : "",
      ]),
      action: { label: "Open the scams lesson", go: "lesson:scams" },
      src: (p) => ["ftcScam", "ftcCoaching"].concat(p.country === "us" ? ["ftcBizOppRule"] : []) },

    { id: "sj3-cv", day: 3, area: "content", prio: "high", when: (p) => p.model === "salesjob" && p.level !== "selling",
      title: "Write a one-page CV and update your LinkedIn profile",
      body: () => ul([
        "List any work where you dealt with customers, sold, or persuaded people: retail, hospitality, call centres, volunteering or clubs.",
        "Add results you can back up, such as targets met or customers helped. Never invent numbers.",
        "Use the same job titles and dates on your CV and on LinkedIn.",
        "LinkedIn's Open to Work setting can show recruiters only, or everyone, that you're looking. LinkedIn says it can't guarantee people at your current company won't see it.",
      ]),
      action: { label: "Draft your CV summary with AI", go: "tools:describe" },
      links: [link("liOpen", "LinkedIn: Open to Work")], src: ["liOpen"] },

    { id: "sj4-search", day: 4, area: "research", prio: "high", when: (p) => p.model === "salesjob",
      title: "Search for remote sales roles",
      body: (p) => ul([
        "Search job titles such as “sales development representative”, “inside sales”, “appointment setter” and “customer success”, together with “remote”.",
        "On LinkedIn, turn on a job alert for your search. Alerts are daily by default, and you can have up to 20.",
        p.channel === "employee" ? "Look for postings that state a base salary or hourly rate as well as commission." : "For commission-only roles, check what you'd sell, the commission rate, and when commission is paid.",
        "Check the job also appears on the company's own website, and contact the company using details you found yourself.",
        "Some LinkedIn job posts carry a verification badge. A badge doesn't mean the job is right for you, and no badge doesn't prove a job is fake.",
      ]),
      links: [link("liAlerts", "LinkedIn: job alerts"), link("indeedSafe", "Indeed: safe job search")],
      src: ["liAlerts", "liVerify", "indeedSafe", "ftcJobScams"] },

    { id: "sj5-practice", day: 5, area: "learning", prio: "med", when: (p) => p.model === "salesjob",
      title: "Practise a short sales call",
      body: () => ul([
        "Write a 30-second opening: who you are, why you're calling, and one question about the other person's needs.",
        "Practise asking open questions and listening more than you talk.",
        "Practise a polite reply to “not interested”, and ending with a clear next step, such as a booked follow-up.",
        "Record yourself or role-play with a friend, then improve one thing at a time.",
      ]),
      action: { label: "Role-play a call with AI", go: "tools:helper" } },

    { id: "sj6-apply", day: 6, area: "marketing", prio: "high", when: (p) => p.model === "salesjob",
      title: "Apply to 5 roles that pass your checks",
      body: () => ul([
        "Match the top of your CV to each posting's main requirements.",
        "Keep a simple list: company, role, how pay works, date applied, and next step.",
        "Indeed's warning signs during hiring: pressure to hand over your details today, or a request to download software.",
      ]),
      src: ["indeedSafe"] },

    { id: "sj6-offer", day: 6, area: "legal", prio: "high", when: (p) => p.model === "salesjob",
      title: "Check any offer before you say yes",
      body: (p) => ul([
        "Get it in writing: base pay or hourly rate, commission rate and when it's paid, hours, and whether you're an employee or a contractor.",
        "Real employers give you time to consider an offer. Pressure to decide now is a warning sign, so talk to someone you trust first.",
        p.channel === "contract" ? "If the company would set your hours and control how you work, check your status again: that's a sign of a worker or employee, not self-employment." : "",
      ]),
      src: (p) => ["ftcJobScams"].concat(p.channel === "contract" ? (p.country === "uk" ? ["ukNmwElig"] : p.country === "us" ? ["irsWorker"] : []) : []) },

    { id: "sj7-review", day: 7, area: "finance", prio: "med", when: (p) => p.model === "salesjob",
      title: "Review your applications and what to improve",
      body: () => "<p>Note which applications got replies and which job titles suit you best. Follow up once, politely, on applications older than a week, and drop any role that failed your scam checks.</p>" },

    // Ongoing (add to the "Ongoing (repeat)" block)
    { id: "on-sj-apply", day: 7, ongoing: true, repeat: "daily", area: "marketing", prio: "high", when: (p) => p.model === "salesjob",
      title: "Apply to one or two checked roles and reply to recruiters",
      body: () => "<p>Check each posting against the scam signs before you apply, and reply to genuine recruiters the same day.</p>" },
    { id: "on-sj-practice", day: 7, ongoing: true, repeat: "weekly", area: "learning", prio: "med", when: (p) => p.model === "salesjob",
      title: "Practise one call and update your CV",
      body: () => "<p>Role-play one call, and add anything new you've learned or achieved to your CV and LinkedIn profile.</p>",
      action: { label: "Role-play a call with AI", go: "tools:helper" } },
    // ======== Online tutoring
    { id: "tu1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "tutor" && p.level === "new",
      title: "Read: how online tutoring works",
      body: () => "<p>A short lesson in this app: what each platform keeps, when you get paid, and the rules for teaching children.</p>",
      action: { label: "Open the lesson", go: "lesson:tutor" } },

    { id: "tu1-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "tutor",
      title: (p) => "Check you can teach on " + CHANNEL_NAME[p.channel],
      body: (p) => ul(({
        preply: [
          "You must be at least 18. Preply reviews applications within 5 business days and may turn down subjects few students are looking for.",
          "Preply can't accept residents of Iran, Sudan, Cuba, Syria, North Korea or Crimea.",
          "Before you can withdraw earnings, you must verify your identity with a passport or other government ID.",
        ],
        italki: [
          "italki's terms say users must be 18 or older.",
          "You need native or C2-level ability in each language you teach. Applications open and close by language, so check yours is open first.",
          "Community Tutors need no teaching certificate and charge $5 to $120 a lesson. Professional Teachers must prove teaching training, such as CELTA or a 120-hour TEFL, and charge $10 to $120.",
          "A 1 to 3 minute introduction video is required, and you must speak every language you want to teach in it.",
        ],
        cambly: [
          "Cambly asks for native English speakers aged 18 or over with a strong internet connection. Teaching experience and certificates help but aren't required.",
          "You must apply on a laptop or desktop computer in Google Chrome, not on a phone or tablet.",
          "Cambly says it's temporarily limiting new tutors, so applications may take longer than usual.",
          "Tutors are independent contractors, and Cambly doesn't guarantee any number of students or amount of income.",
        ],
        wyzant: [
          "You must be at least 18, live in the United States and have a valid Social Security number. You don't need to be a certified teacher.",
          "Each subject needs a short quiz or written qualifications. Wyzant replies within 3 to 10 business days.",
          "No background check is needed to join, but a student or parent can order one. You then have 7 days to authorise it, and must pass to keep tutoring.",
        ],
        outschool: [
          "You must be at least 18 and live for at least 6 months a year in one of the 50 US states, Canada, Mexico, the UK, Australia, New Zealand, South Korea or Spain.",
          "No teaching credential is needed, but you need a PayPal account, reliable internet and good written and spoken English.",
          "Every educator must pass ID verification and a criminal background check before teaching, and renew the background check every year.",
        ],
      })[p.channel]) + checked,
      links: (p) => ({ preply: [link("preplyRegister")], italki: [link("italkiTypes"), link("italkiOpen")], cambly: [link("camblyApply")], wyzant: [link("wyzantReg")], outschool: [link("outschoolBecoming"), link("outschoolBg")] })[p.channel],
      src: (p) => ({ preply: ["preplyRegister", "preplyId"], italki: ["italkiTos", "italkiLang", "italkiOpen", "italkiTypes", "italkiPro", "italkiVideo"], cambly: ["camblyTutors", "camblyApply", "camblyAddendum"], wyzant: ["wyzantReg", "wyzantBg"], outschool: ["outschoolBecoming", "outschoolProspective", "outschoolId", "outschoolBg"] })[p.channel] },

    { id: "tu1-pay", day: 1, area: "finance", prio: "high", when: (p) => p.model === "tutor",
      title: (p) => "Understand how " + CHANNEL_NAME[p.channel] + " pays you",
      body: (p) => ul([FEE_TEXT[p.channel]].concat(({
        preply: [
          "Most lessons are confirmed automatically about 15 minutes after they end in the Preply Classroom, or 72 hours after outside it. Your share then goes to your Preply balance.",
          "You withdraw from your balance to Wise, Payoneer, PayPal or Skrill; how long it takes depends on the method.",
        ],
        italki: [
          "Earnings are held as italki Credits (10 credits = $1). The minimum withdrawal is $30.",
          "italki charges no withdrawal fee, but PayPal, Payoneer and the other providers may.",
        ],
        cambly: [
          "Cambly pays weekly once you're owed at least $20, unless you choose payouts every 2 or 4 weeks.",
          "Cambly doesn't withhold tax from your pay; you handle your own.",
        ],
        wyzant: [
          "Wyzant pays by direct deposit on the 1st and 15th of each month. Submit each lesson at least 5 business days before a payday, and within 14 days of the lesson.",
          "Wyzant doesn't allow taking payment directly from students: no cash, checks, payment apps or PayPal invoices.",
        ],
        outschool: [
          "Outschool pays you through PayPal after a class starts.",
          "If a family is refunded after you've been paid, Outschool asks you to return your 70% share.",
        ],
      })[p.channel])) + checked,
      src: (p) => ({ preply: ["preplyCommission", "preplyPaid"], italki: ["italkiCommission", "italkiWithdraw"], cambly: ["camblyTutors", "camblyAddendum"], wyzant: ["wyzantFee", "wyzantSchedule", "wyzantWhenPaid", "wyzantPayPolicy", "wyzantCash"], outschool: ["outschoolAddendum", "outschoolTeach", "outschoolEarnings", "outschoolRefunds"] })[p.channel] },

    { id: "tu2-subject", day: 2, area: "research", prio: "high", when: (p) => p.model === "tutor" && p.level !== "selling",
      title: "Choose what you'll teach, and to whom",
      body: (p) => ul([
        p.channel === "cambly" ? "On Cambly you teach English. Decide whether you'll teach adults, children on Cambly Kids, or both." : "Pick one subject or language and one group of learners, such as adult beginners, exam students or one school age range.",
        "Search the platform for tutors teaching the same thing. Note their prices, reviews and how they describe their lessons.",
        "Choose something you can teach well now, and back it up with qualifications or experience you can show.",
      ]) },

    { id: "tu2-children", day: 2, area: "legal", prio: "high", when: (p) => p.model === "tutor",
      title: "Know the rules for teaching children",
      body: (p) => ul(({
        preply: [
          "Preply's terms: learners aged 13 to 17 may use Preply only with a parent or guardian supervising, and no one under 13 may use it.",
          "Preply's code of conduct bans exploiting children and asking anyone under 18 for personal data.",
        ],
        italki: [
          "italki accounts must belong to adults. A parent can book lessons for a child and handles payment, scheduling and messages with the teacher.",
        ],
        cambly: [
          "Cambly Kids lessons are video-recorded, and messages between tutor and child are kept, so Cambly can review them.",
          "When a child starts a call, the tutor sees the child's first name. Don't ask for any more personal details.",
        ],
        wyzant: [
          "A student or parent can order a background check on you. It covers criminal convictions and the sex offender registry, and Wyzant only learns whether you passed.",
        ],
        outschool: [
          "Keep all contact on Outschool. Share personal details only in Outschool's listed exceptions, and then only with the parent, never the learner.",
          "Don't share Zoom links outside Outschool, take payment off the platform, or meet learners in person except at Outschool-sponsored events.",
          "Classes are recorded and kept for 90 days. Never download a recording or share it beyond enrolled families.",
          "All Outschool educators are mandatory reporters and must follow local rules on reporting suspected abuse or neglect.",
          "Inappropriate contact with a learner means immediate removal, and three Trust & Safety strikes also mean removal.",
        ],
      })[p.channel].concat(["Keep every lesson and message on the platform, and follow its rules for under-18s exactly."])),
      links: (p) => ({ preply: [link("preplyConduct")], italki: [link("italkiParents")], cambly: [link("camblyKidsPrivacy")], wyzant: [link("wyzantBg")], outschool: [link("outschoolSafety"), link("outschoolPersonal")] })[p.channel],
      src: (p) => ({ preply: ["preplyTerms", "preplyConduct"], italki: ["italkiTos", "italkiParents"], cambly: ["camblyKidsPrivacy"], wyzant: ["wyzantBg"], outschool: ["outschoolPersonal", "outschoolSafety", "outschoolRecordings", "outschoolStrikes"] })[p.channel] },

    { id: "tu3-profile", day: 3, area: "listings", prio: "high", when: (p) => p.model === "tutor",
      title: "Write your tutor profile",
      body: (p) => ul([
        "Lead with who you help and what they'll be able to do after your lessons. List only qualifications you can prove.",
        "Don't promise grades, exam passes, or fluency by a certain date.",
        p.channel === "preply" ? "Preply recommends a profile photo, uploaded certificates, a description, your calendar and time zone, and your rate." : "",
        p.channel === "italki" ? "In your video, look into the camera, don't read from a script, and film in landscape (16:9). Leave out contact details, adverts and unlicensed music." : "",
      ]),
      action: { label: "Draft your profile with AI", go: "tools:describe" },
      src: (p) => (p.channel === "preply" ? ["preplyRegister"] : p.channel === "italki" ? ["italkiVideo"] : []) },

    { id: "tu4-price", day: 4, area: "finance", prio: "high", when: (p) => p.model === "tutor",
      title: (p) => (p.channel === "cambly" ? "Plan the hours you'll teach" : "Set a rate that covers the platform's cut and tax"),
      body: (p) => ul([
        FEE_TEXT[p.channel],
        p.channel === "wyzant" ? "Students pay a 9% fee on top, so they see a higher price than the rate you set." : "",
        p.channel === "outschool" ? "Parents also pay a separate marketplace fee, which isn't part of your 70%." : "",
        p.channel === "cambly" ? "Cambly sets the pay per minute, so your income depends on how many minutes you teach." : "Count preparation and messages as working time when you work out your real hourly rate.",
        p.country === "us" && (p.channel === "cambly" || p.channel === "wyzant") ? "Cambly and Wyzant treat tutors as independent contractors, so US self-employment tax (15.3% on 92.35% of net earnings) applies on top of income tax." : "Set money aside for tax from every payout; check your country's rules for self-employed income.",
      ]),
      action: { label: "Open the freelance rate calculator", go: "tools:rate" },
      src: (p) => [FEE_SRC[p.channel]].concat(p.channel === "wyzant" ? ["wyzantStudentFee", "wyzantVet"] : p.channel === "outschool" ? ["outschoolAddendum"] : p.channel === "cambly" ? ["camblyAddendum"] : []).concat(p.country === "us" && (p.channel === "cambly" || p.channel === "wyzant") ? ["irsSE"] : []) },

    { id: "tu5-lesson", day: 5, area: "content", prio: "high", when: (p) => p.model === "tutor",
      title: (p) => (p.channel === "outschool" ? "Plan your first class" : "Plan a first lesson you can repeat"),
      body: (p) => ul([
        "Plan a quick check of the learner's level and goals, one useful thing they can do by the end, and a clear next step.",
        "Test your camera, microphone and internet connection before every lesson.",
        p.channel === "preply" ? "Your first lesson with each new student is a trial. Preply keeps all of it, and offers the student a free replacement if they aren't happy." : "",
        p.channel === "italki" ? "You can offer trial lessons; italki takes no commission on them." : "",
      ]),
      src: (p) => (p.channel === "preply" ? ["preplyCommission"] : p.channel === "italki" ? ["italkiCommission"] : []) },

    { id: "tu6-promote", day: 6, area: "marketing", prio: "med", when: (p) => p.model === "tutor",
      title: "Open your calendar and get your first bookings",
      body: (p) => ul([
        "Open times when your learners are free, in their time zone, and reply to messages and booking requests quickly.",
        p.channel === "wyzant" ? "For students you refer to Wyzant yourself, there's no platform fee: you get 100% of your rate." : "",
        p.channel === "outschool" ? "Listing classes is free; Outschool takes its 30% only when families enroll." : "",
        p.channel === "wyzant" || p.channel === "outschool" ? "Keep payment on the platform: " + CHANNEL_NAME[p.channel] + " doesn't allow taking payment from students or families directly." : "",
      ]),
      src: (p) => (p.channel === "wyzant" ? ["wyzantFee", "wyzantCash"] : p.channel === "outschool" ? ["outschoolTeach", "outschoolPersonal"] : []) },

    { id: "tu7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "tutor",
      title: "Review bookings, reviews and your real hourly rate",
      body: (p) => ul([
        "Add up the hours you spent teaching, preparing and messaging, and compare them with what reached your balance after the platform's cut.",
        "Ask regular learners what helps them most, and adjust your lessons.",
        p.channel === "preply" ? "Preply's commission falls as your total hours grow: 28% after 20 hours, down to 18% after 400." : "",
      ]),
      action: { label: "Open the freelance rate calculator", go: "tools:rate" },
      src: (p) => (p.channel === "preply" ? ["preplyCommission"] : []) },

    // Ongoing (add to the "Ongoing (repeat)" block)
    { id: "on-tu-teach", day: 7, ongoing: true, repeat: "daily", area: "support", prio: "high", when: (p) => p.model === "tutor",
      title: "Teach booked lessons and reply to learners",
      body: () => "<p>Be on time for every lesson, reply to messages the same day, and keep all contact on the platform.</p>" },
    { id: "on-tu-plan", day: 7, ongoing: true, repeat: "weekly", area: "content", prio: "med", when: (p) => p.model === "tutor",
      title: "Prepare next week's lessons and update your calendar",
      body: () => "<p>Plan materials for each regular learner, and open or close times so your calendar shows only hours you can really teach.</p>" },
    // ======== Stream clipping
    { id: "cl1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "clipping" && p.level === "new",
      title: "Read: how stream clipping works and what's allowed",
      body: () => "<p>A short lesson in this app: the two ways clippers get paid, why you need permission, and why platform payout programs rarely pay for clips of other people's videos.</p>",
      action: { label: "Open the lesson", go: "lesson:clipping" }, src: ["whopCrDocs", "ytReused", "ttRewards"] },

    { id: "cl1-permission", day: 1, area: "legal", prio: "high", when: (p) => p.model === "clipping",
      title: "Only clip creators who allow it or who hired you",
      body: () => ul([
        "A streamer's videos belong to them. Clip someone only if they run a clipping campaign, hired you, or told you in writing that you may post their clips.",
        "Twitch's Terms let other users reuse a streamer's content only as needed for Twitch's own sharing features. They don't say you may repost clips elsewhere to earn money, so ask.",
        "On Twitch, streamers choose who can clip them (everyone, followers, subscribers or nobody), and can delete every clip of their channel.",
        "Clipping campaigns make you promise your clip breaks nobody's rights, music included. Twitch deletes clips where it detects copyrighted audio.",
        "Copyright takedowns bring strikes. Three YouTube strikes within 90 days can get your channel terminated, and TikTok bans accounts that repeatedly infringe.",
      ]) + '<p class="small muted">General information from platform terms, not legal advice.</p>',
      links: [link("twitchClipSettings", "Twitch clip settings"), link("ytStrikes", "YouTube copyright strikes")],
      src: ["twitchTos", "twitchClipSettings", "whopCrTerms", "twitchCopyCamp", "ytStrikes", "ttIP"] },

    { id: "cl1-whop", day: 1, area: "store", prio: "high", when: (p) => p.model === "clipping" && p.channel === "whop",
      title: "Check you can join Content Rewards and connect your accounts",
      body: () => ul([
        "You must be 18 or older. Under-18s aren't allowed even with a parent's consent; accounts found to be under 18 are closed and pending money can be withheld.",
        "Content Rewards runs on Whop. You can connect Instagram (Professional or Creator accounts only), a Facebook Page you run, TikTok, YouTube and X.",
        "The connection is read-only: it proves a post is yours and reads its views. Some campaigns won't accept a clip without a connected account.",
        "To withdraw money from Whop you must pass identity checks: your details, a linked bank account and an ID upload.",
      ]) + checked,
      links: [link("whopDiscover", "Browse Content Rewards campaigns"), link("whopCrTerms", "Creator terms")],
      src: ["whopCrTerms", "whopPayouts", "whopTos"] },

    { id: "cl1-hire", day: 1, area: "store", prio: "high", when: (p) => p.model === "clipping" && p.channel === "hire",
      title: "Decide where you'll find creators to edit for",
      body: () => ul([
        "<b>Fiverr</b>: you must be 18 or legally able to sign a contract; 13 to 17-year-olds only through an account a parent or guardian owns and manages. Fiverr keeps 20% of each order.",
        "<b>Upwork</b>: you must be 18, or the age of majority where you live if that's higher. Its fee is 0% to 15% per contract.",
        "<b>Direct</b>: no platform fee, but you find every creator yourself and agree the work and payment in writing.",
      ]) + checked,
      links: [link("fiverrHow", "How Fiverr works"), link("upworkFee", "Upwork fees")],
      src: ["fiverrMinors", "fiverrVsUpwork", "upworkEligible", "upworkFee"] },

    { id: "cl2-payouts", day: 2, area: "legal", prio: "high", when: (p) => p.model === "clipping",
      title: "Know why platform payouts rarely pay for clips",
      body: () => ul([
        "YouTube doesn't share Shorts revenue on unedited clips of others' films or shows, reuploads of other creators' videos, or compilations with nothing original added.",
        "YouTube's reused-content rule applies even if the original creator gave permission, and breaking it can remove monetisation from your whole channel.",
        "TikTok Creator Rewards doesn't treat as original anything copied from others with only slight changes, such as speed-ups, filters, fixed text or stickers.",
        "Instagram may not recommend content that's mostly repurposed with minor edits, reposts, or videos carrying someone else's watermark.",
        "So in this model the campaign or the creator pays you, not the platform's payout program.",
      ]) + checked,
      links: [link("ytShortsMon", "YouTube Shorts monetization policies"), link("ttOriginality", "TikTok originality policy")],
      src: ["ytShortsMon", "ytReused", "ttRewards", "ttOriginality", "igRecs", "igReach"] },

    { id: "cl2-campaign", day: 2, area: "research", prio: "high", when: (p) => p.model === "clipping" && p.channel === "whop",
      title: "Pick 1 or 2 campaigns and read every rule",
      body: () => ul([
        "Each campaign sets its own pay per 1,000 views and a total budget, and chooses which platforms it accepts.",
        "Check the limits: a brand can set a minimum a clip must earn before it's paid, and the most one clip can earn.",
        "On per-post campaigns, if your clip misses the minimum views within the brand's monitoring period, that payout goes back to the budget.",
        "Read what the clip must show or say. The brand approves or rejects every submission.",
      ]),
      links: [link("whopDiscover", "Content Rewards campaigns")], src: ["whopCrDocs", "whopCrTerms"] },

    { id: "cl2-creators", day: 2, area: "research", prio: "high", when: (p) => p.model === "clipping" && p.channel === "hire" && p.level !== "selling",
      title: "List 10 creators you could edit clips for",
      body: () => ul([
        "Start with creators whose streams or videos you already watch, so you know what their best moments look like.",
        "Note whether they already post Shorts, TikToks or Reels, and how often.",
        "On Twitch, streamers decide who can clip them. If a channel has clipping turned off, treat that as a reason to ask before you touch their content.",
      ]),
      src: ["twitchClipSettings"] },

    { id: "cl3-tools", day: 3, area: "content", prio: "high", when: (p) => p.model === "clipping",
      title: "Set up your clipping tools",
      body: (p) => ul([
        "<b>Twitch Clips</b>: you can download clips you made, and streamers can download any clip of their channel, in landscape or portrait.",
        "<b>YouTube “Edit into a Short”</b>: turns up to 60 seconds of a public long video into a Short. Only the channel that uploaded the video can use it.",
        "<b>YouTube Remix › Cut</b>: adds a segment of another YouTube video to your Short. The Short credits and links the original.",
        "<b>CapCut</b>: the desktop app has “Long video to shorts”, auto captions, and auto reframe for vertical video (reframe isn't offered in every region).",
        p.channel === "hire" ? "Working on a creator's YouTube channel? Ask them to add you in YouTube Studio › Settings › Permissions rather than sharing a password." : "",
      ]),
      links: [link("twitchClips", "Twitch clips guide"), link("ytEditShort", "Make Shorts from your videos"), link("capcutShorts", "CapCut long video to shorts")],
      src: (p) => ["twitchClips", "ytEditShort", "ytRemix", "capcutShorts", "capcutReframe"].concat(p.channel === "hire" ? ["ytPermissions"] : []) },

    { id: "cl4-clips", day: 4, area: "content", prio: "high", when: (p) => p.model === "clipping",
      title: (p) => (p.channel === "whop" ? "Make your first 3 campaign clips" : "Make 3 sample clips"),
      body: (p) => ul([
        p.channel === "whop" ? "Follow the campaign brief exactly: what to show, captions, tags and length. A clip that misses the brief can be rejected." : "Use footage you're allowed to use: a creator who said yes, an open clipping campaign, or your own recordings.",
        "Make each clip stand on its own: start on the moment, add captions, and frame it vertically.",
        "Add your own editing, such as captions, context or commentary. Clips with nothing added can't earn platform payouts and may not be recommended.",
        "Use only music you have the rights to. Copyrighted audio can get a clip muted, claimed or removed.",
      ]),
      action: { label: "Draft hooks with AI", go: "tools:hooks" },
      src: (p) => (p.channel === "whop" ? ["whopCrDocs"] : []).concat(["ytShortsMon", "igRecs", "ytClaims", "twitchCopyCamp"]) },

    { id: "cl5-disclose", day: 5, area: "legal", prio: "high", when: (p) => p.model === "clipping",
      title: "Label paid clips as ads",
      body: (p) => ul([
        "If you're paid to post a clip on your own account, disclose it. Whop's guide says to do this whenever you're paid or expect to be.",
        "Say “Ad” or “Paid partnership” in the first seconds, show it as on-screen text, and put #Ad near the start of the caption.",
        "Turn on TikTok's “Disclose commercial content” setting; undisclosed branded videos may not be shown in For You. On YouTube, tick the paid-promotion box.",
        p.channel === "whop" ? "Content Rewards can reject a clip, and withhold its payment, if the disclosure is missing." : "If the creator posts your clips on their channel, any sponsor segment still needs their disclosure. Point those out when you deliver.",
      ]),
      links: [link("ftcInfluencer", "FTC: Disclosures 101"), link("whopFtc", "Whop's disclosure guide")],
      src: (p) => ["ftcInfluencer", "whopFtc", "ttBranded", "ttDisclose", "ytPaidPromo"].concat(p.channel === "whop" ? ["whopCrOldTerms", "whopCrTerms"] : []) },

    { id: "cl5-submit", day: 5, area: "marketing", prio: "high", when: (p) => p.model === "clipping" && p.channel === "whop",
      title: "Post your clips and submit the links",
      body: () => ul([
        "Post each clip publicly on a platform the campaign accepts, then submit its public link.",
        "Submissions go through automatic checks and the brand's review. Views are counted through the platforms' own systems, not from what you report.",
        "Never buy views, likes or followers, or team up with others to inflate them. The penalty is a permanent ban, with one appeal.",
        "When a brand approves your clip, you give it a permanent, worldwide licence to use it, including in paid ads.",
      ]),
      src: ["whopCrTerms", "whopCrBrandTerms"] },

    { id: "cl5-pitch", day: 5, area: "marketing", prio: "high", when: (p) => p.model === "clipping" && p.channel === "hire",
      title: "Offer your clipping service to 5 to 10 creators",
      body: (p) => ul([
        "Send a short message with one sample clip, what you'd deliver each week, and your price.",
        "Don't post a creator's content on your own account as a “free sample” without asking first.",
        "On Fiverr or Upwork, describe the package: clips per week, length, captions, revisions and delivery time.",
        p.country === "us" ? "If you email businesses, follow CAN-SPAM: an honest subject line, your postal address, and an opt-out you honour within 10 business days." : "",
      ]),
      src: (p) => (p.country === "us" ? ["canSpam"] : []) },

    { id: "cl6-agree", day: 6, area: "legal", prio: "high", when: (p) => p.model === "clipping" && p.channel === "hire",
      title: "Put the job and the permissions in writing",
      body: () => ul([
        "Agree in writing: how many clips, how long, where they're posted and by whom, revisions, deadlines and price.",
        "Get written permission to use their footage, and ask whether you may show the clips in your portfolio.",
        "For YouTube, ask to be added in Studio's Permissions. Editors can upload and publish but can't manage permissions; Editor (Limited) also can't see revenue.",
        "Get footage from the creator, or from clips of their channel that they download from Twitch.",
      ]),
      links: [link("ytPermissions", "YouTube channel permissions")], src: ["ytPermissions", "twitchClips"] },

    { id: "cl6-payout", day: 6, area: "finance", prio: "high", when: (p) => p.model === "clipping" && p.channel === "whop",
      title: "Set up withdrawals and know when money arrives",
      body: () => ul([
        "Approved payouts are held while views are checked for fraud. On per-1,000-views campaigns, views earn for 7 days, then there's a 3-day hold: about 10 days after approval.",
        "The money then reaches your balance. Withdrawing needs identity checks, and Whop's docs give a $10 minimum withdrawal where one applies.",
        "Withdrawal fees depend on the method; for example, $2.50 per instant bank deposit. Check the fee before you choose one.",
        "A clip that's removed, or found to use fake views, can have its payment stopped or reversed.",
      ]) + checked,
      links: [link("whopPayouts", "Whop: set up payouts")], src: ["whopCrBrandTerms", "whopCrTerms", "whopPayouts", "whopFees"] },

    { id: "cl7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "clipping",
      title: (p) => (p.channel === "whop" ? "Review approvals, views and earnings" : "Review replies, jobs and your hourly rate"),
      body: (p) => (p.channel === "whop"
        ? "<p>Note which clips were approved or rejected and why, the verified views on each, and what you earned for the hours spent. Make more of what got approved.</p>"
        : "<p>Count replies and jobs from your outreach. Compare what you earned with the hours you worked; if the hourly rate is too low, raise your price or tighten the package.</p>"),
      action: { label: "Open the freelance rate calculator", go: "tools:rate" } },

    // ongoing
    { id: "on-clip", day: 7, ongoing: true, repeat: "daily", area: "content", prio: "high", when: (p) => p.model === "clipping",
      title: (p) => (p.channel === "whop" ? "Make, post and submit today's clips" : "Make or deliver today's clips"),
      body: (p) => "<p>" + (p.channel === "whop" ? "Check each campaign still has budget left before you clip for it, and follow its latest rules." : "Deliver on the dates you agreed, and reply to creators' messages the same day.") + "</p>" },

    { id: "on-clip-check", day: 7, ongoing: true, repeat: "weekly", area: "legal", prio: "med", when: (p) => p.model === "clipping",
      title: "Check for copyright claims, strikes and rule changes",
      body: () => "<p>Look for claims or strikes in YouTube Studio and notices in TikTok and Instagram. Take down anything you no longer have permission to post, and re-read campaign rules, which can change.</p>",
      src: ["ytStrikes", "ytClaims", "ttIP"] },
    // ======== UGC creator
    { id: "u1-how", day: 1, area: "learning", prio: "high", when: (p) => p.model === "ugc" && p.level === "new",
      title: "Read: how UGC work pays and what's allowed",
      body: () => "<p>A short lesson in this app: who pays UGC creators, who owns the videos afterwards, and the honesty rules for product videos.</p>",
      action: { label: "Open the lesson", go: "lesson:ugc" }, src: ["billoStart", "insensePay", "ftcEndorse"] },

    { id: "u1-elig", day: 1, area: "legal", prio: "high", when: (p) => p.model === "ugc",
      title: (p) => (p.channel === "ugc_direct" ? "Know what you need before working with brands directly" : "Check you qualify for " + CHANNEL_NAME[p.channel]),
      body: (p) => ({
        billo: ul([
          "You must live in the United States, Canada or the United Kingdom and be at least 18. You don't need experience or a social media following.",
          "Brands ship the product to you at no cost. A standard job is a video you upload in the Billo app; posting it on your own accounts is an optional extra.",
          "Videos are due within 5 days of the product arriving.",
        ]),
        insense: ul([
          "You must be over the age of majority where you live and able to sign a binding contract.",
          "Insense's FAQ lists 22 countries where it works with creators, including the US, UK, Canada and Australia. Check it for yours.",
          "Insense looks for a portfolio of UGC videos showing you can speak on camera or do a voiceover, with good picture and sound.",
        ]),
        tt_one: ul([
          "You must be 18 or older (the age can differ by region), TikTok One must be available where you live, and you must follow TikTok's Community Guidelines and Branded Content Policy.",
          "TikTok One's help page gives 1,000 followers as the usual minimum and lets each project add more; an older TikTok page lists 10,000. The app shows whether you qualify.",
          "To check: Profile › TikTok Studio › Monetization › Creator Marketplace › Check eligibility, then Join.",
        ]),
        amz_inf: ul([
          "You need an Amazon Associates account first. The Influencer Program is open only in some countries, and you must meet Amazon's thresholds before you're accepted.",
          "Amazon's own guide says that without an established social media following the program probably isn't right for you yet; you can apply later.",
          "Accepted influencers get a storefront page on Amazon and can upload shoppable product videos.",
        ]),
        ugc_direct: ul([
          "No platform checks you or holds the money, so you write the agreement: what you'll make, how the brand may use it, the price, the deadline and revisions.",
          "Most brands pay against an invoice. Card payments through Stripe cost 2.9% + 30¢ for US cards.",
          "Many platforms and brands need you to be 18 or the age of majority. Check before you pitch.",
        ]),
      })[p.channel] + checked,
      links: (p) => ({ billo: [link("billoFaq", "Billo for creators")], insense: [link("insenseCreators", "Insense for creators")], tt_one: [link("ttOneSignup", "Sign up for TikTok One")], amz_inf: [link("amzInfInfo", "Amazon Influencer Program")], ugc_direct: [] })[p.channel],
      src: (p) => ({ billo: ["billoFaq", "billoStart"], insense: ["insenseTerms", "insenseFaq", "insenseCreators"], tt_one: ["ttOneSignup", "ttOneSupport", "ttOneAcademy"], amz_inf: ["amzAssocPolicies", "amzInfGuideAssoc", "amzInfInfo"], ugc_direct: ["stripePricing"] })[p.channel] },

    { id: "u2-rights", day: 2, area: "legal", prio: "high", when: (p) => p.model === "ugc",
      title: "Understand who can use your videos, where and for how long",
      body: (p) => ({
        billo: ul([
          "Once a brand accepts your video, the rights pass to the brand unless agreed otherwise. It can run it in paid ads, share it on social media and edit it.",
          "You can't repost it on your own channels without the brand's written consent. Billo may show it in your portfolio on its platform.",
        ]),
        insense: ul([
          "You keep ownership, but you give Insense a permanent licence to pass to the brand for organic and paid use in digital marketing and connected TV.",
          "Running your video as Meta Partnership Ads or TikTok Spark Ads is agreed between you and the brand. Put how long in writing.",
          "If a brand makes AI content from your video, you can withdraw the licence for it by objecting within 14 days.",
        ]),
        tt_one: ul([
          "A brand can ask to run your post as a Spark Ad. You create an authorization code in the post's ad settings, valid for 7, 30, 60 or 365 days.",
          "Agree how long the brand may use your post before you share a code. It can only be extended before it expires.",
        ]),
        amz_inf: ul([
          "Your videos appear on your storefront. Placement on product pages isn't guaranteed and depends on the video clearly featuring the product.",
          "Upload each video only once, and don't reuse the product page's own photos or videos.",
        ]),
        ugc_direct: ul([
          "Put usage rights in every deal: where the brand may use your content (its own pages, paid ads), for how long, and whether it may edit it.",
          "Price paid-ad use and longer usage separately rather than including them by default.",
        ]),
      })[p.channel],
      src: (p) => ({ billo: ["billoTerms"], insense: ["insenseTerms"], tt_one: ["ttSpark"], amz_inf: ["amzInfFaq", "amzInfRules"], ugc_direct: [] })[p.channel] },

    { id: "u2-honest", day: 2, area: "legal", prio: "high", when: (p) => p.model === "ugc",
      title: "Only say what's true, and disclose when you post",
      body: (p) => ul([
        "Endorsements must reflect your honest opinion and experience. If a video says or suggests you use the product, you must really have used it.",
        "The FTC's 2024 rule bans fake reviews and testimonials, including ones from people who never used the product. Businesses that knowingly break it can face penalties.",
        "The FTC's guides say that if paid actors are shown as real customers, that must be disclosed. Never pretend to be an ordinary customer if you aren't.",
        "If a deal includes posting on your own account, disclose it clearly in the video and caption, and turn on TikTok's commercial content setting.",
        p.channel === "amz_inf" ? "Amazon allows gifted products in your videos only if they're sold on Amazon and you clearly disclose the connection." : "",
      ]) + '<p class="small muted">Summary of FTC guidance and platform rules, not legal advice.</p>',
      links: [link("ftcEndorse", "FTC: Endorsement Guides Q&A"), link("ftcReviewsRule", "FTC: fake reviews rule Q&A")],
      src: (p) => ["ftcEndorse", "ftcGuides", "ftcReviewsRule", "ftcInfluencer", "ttBranded"].concat(p.channel === "billo" ? ["billoTerms"] : p.channel === "amz_inf" ? ["amzInfRules"] : []) },

    { id: "u2-ads", day: 2, area: "research", prio: "med", when: (p) => p.model === "ugc" && p.level !== "selling",
      title: "Watch 20 current ads in a category you'd like to film",
      body: () => ul([
        "Search a product type in the Meta Ad Library to see ads running now on Facebook and Instagram. It doesn't show spend or sales for normal product ads.",
        "Note how the best ones open, how long they show the product in use, and how they end. Use that as a pattern, not a script to copy.",
      ]),
      links: [link("metaLib", "Meta Ad Library")], src: ["metaLibHelp"] },

    { id: "u3-samples", day: 3, area: "content", prio: "high", when: (p) => p.model === "ugc" && p.level !== "selling",
      title: "Film 3 sample videos with products you already own",
      body: (p) => ul([
        "Pick products you've really used. Show the product in use, who it's for and one honest benefit, then end with a clear next step.",
        "Film vertically, in good light, with clear sound. Make one with you on camera and one with a voiceover.",
        p.channel === "amz_inf" ? "For Amazon, don't mention prices or ask viewers to follow, subscribe or comment; the video player doesn't support those actions." : "",
        p.channel === "insense" ? "Insense looks for samples that show you speaking on camera or doing a voiceover." : "",
      ]),
      action: { label: "Draft hooks with AI", go: "tools:hooks" },
      src: (p) => (p.channel === "amz_inf" ? ["amzInfRules"] : p.channel === "insense" ? ["insenseCreators"] : []) },

    { id: "u4-profile", day: 4, area: "listings", prio: "high", when: (p) => p.model === "ugc",
      title: (p) => ({ billo: "Finish your Billo profile", insense: "Finish your Insense profile and portfolio", tt_one: "Complete your TikTok One profile", amz_inf: "Set up your storefront and upload your first videos", ugc_direct: "Publish your portfolio page and rate card" })[p.channel],
      body: (p) => (p.channel === "amz_inf" ? ul([
        "Upload in Creator Hub on a computer or in the Amazon Shopping app: an .mp4 or .mov under 5GB, a title, the products you show (up to 10) and a thumbnail.",
        "Every video is reviewed first, which typically takes 2 business days. You can feature only products sold on Amazon.",
        "Onsite commissions (from shoppers who watch your video on a product page) need a separate sign-up after a minimum number of approved videos; Amazon's pages say 3, and one says 10.",
      ]) : ul([
        "Put your best samples first, then a short intro and the kinds of products you can film.",
        p.channel === "ugc_direct" ? "List what each package includes and what costs extra, such as paid-ad use, extra hooks or raw footage." : "Keep your profile details accurate; brands choose who they hire from them.",
      ])),
      src: (p) => (p.channel === "amz_inf" ? ["amzInfUpload", "amzInfFaq"] : []) },

    { id: "u5-apply", day: 5, area: "marketing", prio: "high", when: (p) => p.model === "ugc",
      title: (p) => ({ billo: "Apply to 5 jobs that suit you", insense: "Apply to 5 to 10 brand briefs", tt_one: "Apply to open campaigns", amz_inf: "Upload 3 more product videos", ugc_direct: "Pitch 10 brands" })[p.channel],
      body: (p) => ({
        billo: ul(["Each job shows its fixed payout before you apply, and you can't negotiate it.", "Read the brief: what to show and say, what to avoid, and how many videos, hooks or photos it includes."]),
        insense: ul(["Read each brief's deliverables and usage terms before you apply.", "When a brand hires you, its payment is taken from the brand's account and held by Insense until the brand approves your content."]),
        tt_one: ul(["Brands can also find you and invite you. Each project can add its own requirements on top of the basic ones.", "Don't invoice a brand or ask it to pay you outside TikTok One for a project."]),
        amz_inf: ul(["Tag only products that actually appear in the video.", "A video reaches a product's page only if it clearly features that product, so give each one real screen time."]),
        ugc_direct: ul(["Send a short, personal message with one relevant sample and your rate card.", p.country === "us" ? "If you email businesses, follow CAN-SPAM: an honest subject line, your postal address, and an opt-out you honour within 10 business days." : ""]),
      })[p.channel],
      src: (p) => ({ billo: ["billoStart"], insense: ["insensePay"], tt_one: ["ttOneSignup", "ttOneTerms"], amz_inf: ["amzInfUpload", "amzInfFaq"], ugc_direct: p.country === "us" ? ["canSpam"] : [] })[p.channel] },

    { id: "u6-deliver", day: 6, area: "orders", prio: "high", when: (p) => p.model === "ugc",
      title: "Deliver to the brief, on time",
      body: (p) => ul([
        "Confirm the brief before you film, and note the date the product arrived.",
        ({ billo: "Billo expects videos within 5 days of the product arriving, and rates you on on-time delivery.",
           insense: "Payment moves to your Insense wallet when the brand approves your content.",
           tt_one: "Base pay is earned once TikTok One approves your content; revenue-share pay starts when it runs as an ad.",
           amz_inf: "Check each upload passes review; videos that break the guidelines don't appear on Amazon.",
           ugc_direct: "Deliver the files with the usage terms you agreed, then send your invoice." })[p.channel],
      ]),
      src: (p) => ({ billo: ["billoStart", "billoPremium"], insense: ["insensePay"], tt_one: ["ttOneTerms"], amz_inf: ["amzInfUpload"], ugc_direct: [] })[p.channel] },

    { id: "u6-paid", day: 6, area: "finance", prio: "med", when: (p) => p.model === "ugc",
      title: "Set up how you get paid",
      body: (p) => ({
        billo: ul(["Billo pays only through PayPal: add your PayPal email to your profile.", "Approved videos are paid twice a month, in the middle and at the end of the month. Payouts can't be sped up."]),
        insense: ul(["Withdraw from your Insense wallet to PayPal (within 3 working days of asking) or a bank account (within 5 working days).", "Bank payouts may need a tax form such as a W-9 or W-8BEN. Amounts are in US dollars, and Insense may take a percentage for the transfer."]),
        tt_one: ul(["Set up a payment account in TikTok's Rewards Center: currency, tax information where required, and a bank account or other method. TikTok reviews it first.", "Payments for projects are handled through Stripe."]),
        amz_inf: ul(["Your earnings show in Creator Hub or the Reports tab of Associates Central.", "Amazon Associates pays about 60 days after the end of the month, once you're owed at least $10 by direct deposit."]),
        ugc_direct: ul(["Send an invoice for each job, with the usage terms on it.", "Card payments through Stripe cost 2.9% + 30¢ for US cards."]),
      })[p.channel] + checked,
      src: (p) => ({ billo: ["billoPaid"], insense: ["insenseTerms", "insensePay"], tt_one: ["ttOnePay", "ttOneTerms"], amz_inf: ["amzInfFaq", "amzAssocPay"], ugc_direct: ["stripePricing"] })[p.channel] },

    { id: "u7-review", day: 7, area: "finance", prio: "high", when: (p) => p.model === "ugc",
      title: "Review approvals, ratings and pay per hour",
      body: (p) => ul([
        "Compare what each job paid with the hours it took, including filming, editing and revisions.",
        p.channel === "billo" ? "Billo's Premium level needs 14 brand-approved videos, at least 5 rated, an average rating of 4.8 or higher, and an on-time score of 90% or more." : "Note which samples brands responded to, and make more like them.",
      ]),
      action: { label: "Open the freelance rate calculator", go: "tools:rate" }, src: (p) => (p.channel === "billo" ? ["billoPremium"] : []) },

    // ongoing
    { id: "on-ugc-apply", day: 7, ongoing: true, repeat: "daily", area: "marketing", prio: "high", when: (p) => p.model === "ugc",
      title: (p) => (p.channel === "amz_inf" ? "Film or upload one product video" : p.channel === "ugc_direct" ? "Reply to brands and send new pitches" : "Check new briefs and apply to the ones that suit you"),
      body: () => "<p>Reply to brand messages the same day, and only take jobs you can deliver on time.</p>" },

    { id: "on-ugc-sample", day: 7, ongoing: true, repeat: "weekly", area: "content", prio: "med", when: (p) => p.model === "ugc",
      title: "Add one new sample to your portfolio",
      body: () => "<p>Film a new product or a new style, such as an unboxing, a how-to or a before-and-after. Replace your weakest sample.</p>" },
    // ======== Live streaming (creator: twitch, yt_live)
    { id: "lv1-rules", day: 1, area: "legal", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: (p) => (p.channel === "twitch" ? "Know what it takes to be paid on Twitch" : "Know who can stream on YouTube and earn from Super Chat"),
      body: (p) => (p.channel === "twitch" ? ul([
        "To become an Affiliate, the first level Twitch pays, you need within the same 30 days: 25 followers, 4 hours streamed, streams on 4 different days, and an average of 3 viewers on 4 days.",
        "“3 viewers” means 3 people watching at the same time, on average. Days below that don't count against you.",
        "Twitch lowered these in June 2026 (from 50 followers, 8 hours and 7 days), so older guides are out of date.",
        "Without Affiliate or Partner status, Twitch can't pay you out.",
        "You must be 13 or older. Under the age of majority, a parent or guardian must supervise the account, and must accept the Monetized Streamer Agreement for you.",
      ]) : ul([
        "You must be 16 or older to live stream. Ages 13–15 can stream only with an adult visibly present and taking part.",
        "Streaming from a phone needs at least 50 subscribers, and mobile streams have a limited audience until 1,000. Lifting that can take several weeks.",
        "Every live stream needs a verified channel with no live-streaming restrictions in the past 90 days.",
        "Super Chat and Super Stickers (paid messages in chat) need the YouTube Partner Program, age 18 or older, a country where they're offered, and acceptance of the Commerce Product Module.",
        "They don't work on streams set as made for kids, age-restricted, unlisted or private.",
      ])) + checked,
      links: (p) => (p.channel === "twitch" ? [link("twitchAffJoin", "Twitch Affiliate requirements")] : [link("ytLiveStart", "YouTube live streaming"), link("ytSuperElig", "Super Chat eligibility")]),
      src: (p) => (p.channel === "twitch" ? ["twitchAffJoin", "twitchAffFaq", "twitchMonAll", "twitchParents", "twitchOnboard"] : ["ytLiveRestrict", "ytLiveMobile", "ytLiveStart", "ytSuperElig", "ytCommerce"]) },

    { id: "lv1-setup", day: 1, area: "store", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel) && p.level === "new",
      title: (p) => (p.channel === "twitch" ? "Secure your Twitch account and find your Achievements" : "Verify your channel and turn on live streaming"),
      body: (p) => (p.channel === "twitch" ? ul([
        "Turn on two-factor authentication now. Twitch requires it to start Affiliate onboarding and to receive payouts.",
        "Track your progress in the Achievements section of your Creator Dashboard. When you qualify, Twitch emails you and shows an invite in the dashboard, usually within 1–2 days.",
        "Onboarding has three parts: 2FA, your account details (your legal name must match your tax documents), then tax interviews and a payout method.",
      ]) : ul([
        "Verify your channel in YouTube Studio with your phone number, then turn on live streaming. The first time can take up to 24 hours, so do it today.",
        "There are three ways to go live: webcam, mobile (50+ subscribers) or streaming software (an encoder).",
        "If you're 13–17, new streams start as private on webcam and unlisted on mobile by default.",
      ])),
      src: (p) => (p.channel === "twitch" ? ["twitchOnboard", "twitchPaid", "twitchAffJoin", "twitchAffFaq"] : ["ytLiveStart", "ytFeatures", "ytLiveMobile", "ytLiveRestrict"]) },

    { id: "lv2-copyright", day: 2, area: "legal", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Know the music and copyright rules for live streams",
      body: (p) => (p.channel === "twitch" ? ul([
        "Don't play recorded music unless you own all the rights or have permission from every rights holder. Twitch mutes copyrighted audio it finds in past broadcasts.",
        "Copyright takedowns bring strikes, and at 3 strikes Twitch closes the account. Twitch's Copyright School can remove one strike, once every 12 months.",
        "Twitch can stop a live stream immediately if the claimed infringement is still going on.",
        "Most Twitch copyright strikes in 2024 were for broadcasting sports, TV shows and films. Stream only what you have the rights to.",
        "For game music, check the game's licence (EULA) on streaming.",
      ]) : ul([
        "If YouTube removes your live stream for copyright, you get a copyright strike and can't stream for 7 days; a further strike makes it 14 days.",
        "Three copyright strikes within 90 days and your channel can be terminated.",
        "Content ID claims, often for music, affect that video: the owner can block it, earn from it or just track it.",
        "If your account is restricted from live streaming, you may not use another channel to stream.",
      ])),
      src: (p) => (p.channel === "twitch" ? ["twitchDmca", "twitchDmcaFaq", "twitchCopyReport", "twitchCopyCamp"] : ["ytStrikes", "ytClaims", "ytLiveRestrict"]) },

    { id: "lv3-gear", day: 3, area: "content", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Set up your streaming software and do a test",
      body: (p) => ul([
        "OBS Studio is free, open-source software for streaming and recording from a computer.",
        p.channel === "yt_live" ? "YouTube suggests streaming software when you want to share your screen or use extra cameras and microphones, and recommends RTMPS for the connection." : "Decide who can clip your stream: Creator Dashboard › Settings › Stream › Clips Settings. Choose everyone, followers (with a minimum follow time), subscribers, or nobody.",
        p.channel === "yt_live" ? "For a planned event, YouTube suggests setting up your encoder at least 2 hours ahead and starting it 15 minutes before." : "",
        "Do a short test to check sound, picture and your internet connection before you tell anyone you're going live.",
      ]),
      links: (p) => [link("obs", "OBS Studio")].concat(p.channel === "yt_live" ? [link("ytEncoder", "Stream with an encoder")] : [link("twitchClipSettings", "Twitch clip settings")]),
      src: (p) => ["obs"].concat(p.channel === "yt_live" ? ["ytEncoder", "ytLiveTips"] : ["twitchClipSettings"]) },

    { id: "lv4-schedule", day: 4, area: "marketing", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Pick a streaming schedule you can keep",
      body: (p) => ul([
        "Choose days and times you can keep for months, and tell viewers when you'll be live next.",
        p.channel === "twitch" ? "Affiliate counts streams on 4 different days and 4 hours in total within 30 days, so several shorter streams on separate days get you there." : "Pick one repeatable format, such as a weekly Q&A, a game or a live tutorial.",
      ]),
      src: (p) => (p.channel === "twitch" ? ["twitchAffJoin"] : []) },

    { id: "lv5-first", day: 5, area: "content", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Do your first stream",
      body: (p) => ul([
        "Say hello to people in chat by name and tell them what's coming next.",
        "If a brand pays you or sends free products, say so out loud during the stream and repeat it from time to time. A note in your profile isn't enough.",
        p.channel === "yt_live" ? "For a sponsored stream, tick YouTube's paid-promotion box; it adds a disclosure label." : "",
      ]),
      src: (p) => ["ftcInfluencer"].concat(p.channel === "yt_live" ? ["ytPaidPromo"] : []) },

    { id: "lv6-clips", day: 6, area: "marketing", prio: "med", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Turn your best moments into short clips",
      body: (p) => ul([
        p.channel === "twitch" ? "You can download any clip of your channel, in landscape or portrait, and post it as a Short, TikTok or Reel." : "“Edit into a Short” turns up to 60 seconds of your own public long video into a Short.",
        "Clips follow the same music rules. Twitch deletes clips where it detects copyrighted audio.",
        "If other people want to clip you for money, it's your call. Agree terms with them in writing.",
      ]),
      action: { label: "Draft hooks with AI", go: "tools:hooks" },
      src: (p) => (p.channel === "twitch" ? ["twitchClips", "twitchCopyCamp"] : ["ytEditShort", "twitchCopyCamp"]) },

    { id: "lv7-money", day: 7, area: "finance", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Know how and when you'd be paid",
      body: (p) => (p.channel === "twitch" ? ul([
        "Affiliates earn from subscriptions (standard split 50/50 after taxes and fees), Bits ($0.01 per Bit cheered) and a share of ad revenue.",
        "The Plus Program gives qualifying Affiliates and Partners a better subscription split: 60/40 or 70/30.",
        "Twitch pays about 15 days after the end of each month once you're owed $50 ($100 by wire). Smaller balances roll over to the next month.",
        "The payment processor charges a fee for each payout; choose Hold Payouts if you'd rather be paid less often.",
        "Since 20 August 2026, Affiliates can also take sponsorships through Twitch's Sponsorship Portal, after a self-paced certification course.",
      ]) : ul([
        "Super Chat and Super Stickers: you keep 70% after local sales tax and iOS App Store fees. YouTube covers card fees.",
        "YouTube says Super Chat isn't a donation or crowdfunding tool, and money from it may be treated differently under the laws where you live.",
        "Super Chat needs the 500-subscriber tier of the Partner Program: 3 public uploads in 90 days and 3,000 watch hours in 12 months or 3 million Shorts views in 90 days.",
      ])) + checked,
      action: { label: "Open the creator income calculator", go: "tools:creator" },
      src: (p) => (p.channel === "twitch" ? ["twitchPartner", "twitchPlus", "twitchMonetization", "twitchAdRev", "twitchPaid", "twitchSponsor"] : ["ytSuperManage", "ytSuperElig", "ytYpp"]) },

    { id: "lv7-review", day: 7, area: "content", prio: "med", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Review your streams and decide what to change",
      body: (p) => "<p>In " + (p.channel === "twitch" ? "your Creator Dashboard" : "YouTube Studio") + ", see which streams kept viewers longest and when people left. Keep what worked and test one change next week.</p>" },

    // ongoing
    { id: "on-live", day: 7, ongoing: true, repeat: "weekly", area: "content", prio: "high", when: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      title: "Go live on your schedule",
      body: () => "<p>Keep to the days you chose. Afterwards, clip the best moments and check for any copyright notices.</p>" },
  ];
  GUIDE.push({ id: "d2-tax", day: 2, area: "legal", prio: "med", when: (p) => SHIP(p) || ["digital", "handmade", "fba", "courses"].includes(p.model),
    title: "Know when sales tax or VAT applies",
    body: (p) => (p.country === "us" ? ul([
      "Each US state sets its own sales tax rules. You must collect tax in a state where you have nexus: a physical presence there, or sales above that state's economic nexus threshold (often $100,000 a year). States have been able to set these thresholds since the Supreme Court's 2018 Wayfair decision.",
      "On Etsy, eBay, Amazon and TikTok Shop, the marketplace usually collects and pays sales tax for you. Some states still ask you to report those sales.",
      "On your own store, nobody does this for you. Register with the state before you collect, then add the registration in Shopify under Settings › Taxes and duties. Shopify's tax liability page flags states where you're near a threshold.",
      "Thresholds, what counts towards them and filing rules differ by state. Check the state's department of revenue, or the Streamlined Sales Tax site for its member states.",
    ]) : p.country === "uk" ? ul([
      "You must register for VAT if your VAT-taxable turnover goes over £90,000 in the last 12 months, or you expect it to go over £90,000 in the next 30 days alone. You can register voluntarily below that.",
      "Selling digital products or goods to customers in the EU can bring EU VAT rules into play, even if you're under the UK threshold.",
    ]) : ul([
      p.country === "eu" ? "Your country sets its own VAT registration threshold, up to €85,000. Check its tax authority before you pass it." : "",
      p.country === "ca" ? "You're a small supplier while your taxable sales stay at CA$30,000 or less, in one quarter and over the last four quarters. Above that, you must register for GST/HST within 29 days. You can register voluntarily." : "",
      p.country === "au" ? "You must register for GST within 21 days once your GST turnover, current or projected over 12 months, reaches A$75,000. Voluntary registration lasts at least 12 months." : "",
      p.country === "in" ? "GST: goods-only suppliers must register above ₹40 lakh turnover (₹20 lakh in some states); services or mixed suppliers above ₹20 lakh (₹10 lakh in some states). Inter-state suppliers of goods must register whatever their turnover." : "",
      p.country === "in" ? "Selling goods through a platform that collects TCS normally needs GST registration. Since 1 October 2023, small goods sellers may enrol without it if they stay under the threshold, sell in one state only, make no inter-state sales and hold a PAN." : "",
      p.country === "in" ? "Service suppliers selling through e-commerce platforms with turnover up to ₹20 lakh (₹10 lakh in special-category states) don't need to register." : "",
      p.country === "ph" ? "Businesses with gross sales of ₱3,000,000 a year or less are VAT-exempt but pay percentage tax instead." : "",
      p.country === "br" ? "As an MEI you pay a monthly DAS and file the yearly DASN-SIMEI declaration by 31 May, even with no revenue." : "",
      p.country === "ng" ? "Check with the Nigeria Revenue Service whether you need to register for VAT. This app hasn't confirmed the current threshold." : "",
      p.country === "eu" ? "Selling to consumers in other EU countries: once those sales pass €10,000 a year, you charge VAT at the buyer's country's rate. The One Stop Shop (OSS) lets you report it in one return." : "Selling to customers in the EU: a business set up in one EU country can charge its home VAT on cross-border sales to EU consumers until those sales (goods and digital services together) pass €10,000 a year. Above that, VAT is due at the customer's country's rate, and the One Stop Shop (OSS) lets you report it in one return.",
      p.country === "eu" ? "" : "Businesses outside the EU don't get the €10,000 threshold: VAT on digital services sold to EU consumers is due from the first sale, and can be reported through the non-Union OSS. Imported goods worth up to €150 use the Import OSS.",
      p.country === "other" ? "Your own country's sales tax, VAT or GST rules apply too; the business-basics step shows where to check." : "",
    ])) + '<p class="small muted">General information from official tax pages, not tax advice.</p>',
    src: (p) => (p.country === "us" ? ["shopTaxUS", "shopTaxLiability", "sstMarketplace", "etsySalesTax"] : p.country === "uk" ? ["hmrcVatReg", "euOss"] : ({ eu: ["euSmeVat"], ca: ["caGst"], au: ["auGst"], in: ["inGstReg", "inCgst24", "inGstEcom", "inGstServices"], ph: ["phVat", "phVat2021"], br: ["brDasn"], ng: ["ngTaxAdmin"] }[p.country] || []).concat(["euOss"])) });
  GUIDE.push({ id: "d1-scams", day: 1, area: "learning", prio: "med", when: () => true,
    title: "Read: how to spot a get-rich-quick scam",
    body: () => ul([
      "The FTC's warning signs: guaranteed income, earnings you can't check, vague answers about what you'd sell, pressure to pay now, and upsells for “mentoring”.",
      "Startline sells nothing. If someone asks for money or your store login to “make it work”, stop and check first.",
    ]),
    action: { label: "Open the lesson", go: "lesson:scams" }, src: ["ftcScam"] });
  const WEEK2 = [
    // ======== Shared: review week 1 (day 8, all 12 models)
    { id: "w2-supplier-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "supplier",
      title: "Put week 1's real numbers into the calculator",
      body: (p) => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: orders, revenue, product and shipping cost, fees, ad spend and refunds.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
        p.channel === "shopify" ? "In Analytics › Reports, “Conversion rate over time” is sessions that completed checkout ÷ sessions. Bot traffic can make it look low, so filter to human traffic." : "",
        p.ads === "some" ? "If you ran ads, check your ad spend against your break-even in the ads calculator too." : "",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" },
      links: (p) => [p.channel === "shopify" && link("shopReports", "Shopify: conversion rate report"), p.channel === "tiktok" && link("ttAnalytics", "TikTok: how analytics work")].filter(Boolean),
      src: (p) => ({ shopify: ["shopReports"], tiktok: ["ttAnalytics"] })[p.channel] || [] },

    { id: "w2-pod-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "pod",
      title: "Put week 1's real numbers into the calculator",
      body: (p) => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: orders, revenue, product and shipping cost, fees, ad spend and refunds.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
        p.channel === "shopify" ? "In Analytics › Reports, “Conversion rate over time” is sessions that completed checkout ÷ sessions. Bot traffic can make it look low, so filter to human traffic." : "",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" },
      links: (p) => [p.channel === "shopify" && link("shopReports", "Shopify: conversion rate report"), p.channel === "tiktok" && link("ttAnalytics", "TikTok: how analytics work")].filter(Boolean),
      src: (p) => ({ shopify: ["shopReports"], tiktok: ["ttAnalytics"] })[p.channel] || [] },

    { id: "w2-affiliate-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "affiliate",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: clicks, orders and earnings for each piece of content.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the affiliate calculator", go: "tools:affiliate" },
      links: (p) => [p.channel === "aff_tiktok" && link("ttAnalytics", "TikTok: how analytics work")].filter(Boolean),
      src: (p) => (p.channel === "aff_tiktok" ? ["ttAnalytics"] : []) },

    { id: "w2-digital-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "digital",
      title: "Put week 1's real numbers into the calculator",
      body: (p) => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: listing views, sales and fees.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
        p.channel === "shopify" ? "In Analytics › Reports, “Conversion rate over time” is sessions that completed checkout ÷ sessions. Bot traffic can make it look low, so filter to human traffic." : "",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" },
      links: (p) => [p.channel === "shopify" && link("shopReports", "Shopify: conversion rate report")].filter(Boolean),
      src: (p) => (p.channel === "shopify" ? ["shopReports"] : []) },

    { id: "w2-resell-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "resell",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: items sold, sold price, fees, shipping and what you paid.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the max buy price calculator", go: "tools:maxbuy" },
      links: () => [] },

    { id: "w2-freelance-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "freelance",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: hours worked against hours billed, and earnings after fees.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the freelance rate calculator", go: "tools:rate" },
      links: () => [] },

    { id: "w2-creator-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "creator",
      title: "Put week 1's real numbers into the calculator",
      body: (p) => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: views, watch time and followers gained.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
        p.channel === "yt" ? "Audience-retention “key moments” appear only for videos at least 60 seconds long with at least 100 views, and data takes 1–2 days to process." : "",
      ]),
      action: { label: "Open the creator income calculator", go: "tools:creator" },
      links: (p) => [p.channel === "yt" && link("ytRetention", "YouTube: audience retention"), p.channel === "tt_creator" && link("ttAnalytics", "TikTok: how analytics work")].filter(Boolean),
      src: (p) => ({ yt: ["ytRetention"], tt_creator: ["ttAnalytics"] })[p.channel] || [] },

    { id: "w2-courses-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "courses",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: sales-page visits, sign-ups and refunds.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the price calculator", go: "tools:price" },
      links: () => [] },

    { id: "w2-books-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "books",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: words written, price and royalty per copy.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the book royalty calculator", go: "tools:royalty" },
      links: () => [] },

    { id: "w2-newsletter-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "newsletter",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: subscribers, opens and paid subscribers.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the subscription income calculator", go: "tools:recurring" },
      links: () => [] },

    { id: "w2-fba-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "fba",
      title: "Put week 1's real numbers into the calculator",
      body: () => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: your supplier quotes, plus the fees from Amazon's own fee calculator.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" },
      links: () => [link("fbaCalc", "Amazon: fee calculator")],
      src: ["fbaCalc"] },

    { id: "w2-handmade-review", day: 8, area: "finance", prio: "high", when: (p) => p.model === "handmade",
      title: "Put week 1's real numbers into the calculator",
      body: (p) => ul([
        "Copy last week's real numbers from your dashboard into the calculator in place of any guesses.",
        "Count: hours per item, materials and sales.",
        "Look for the one number that hurts most, such as cost per order, views with no sales, or hours not billed. Change only that one thing this week, so you can tell what made the difference.",
        p.channel === "shopify" ? "In Analytics › Reports, “Conversion rate over time” is sessions that completed checkout ÷ sessions. Bot traffic can make it look low, so filter to human traffic." : "",
      ]),
      action: { label: "Open the profit calculator", go: "tools:profit" },
      links: (p) => [p.channel === "shopify" && link("shopReports", "Shopify: conversion rate report")].filter(Boolean),
      src: (p) => (p.channel === "shopify" ? ["shopReports"] : []) },

    // ======== Shared: capped ad test (day 12, ADS_MODELS, only if the user chose ads)
    { id: "w2-supplier-ads", day: 12, area: "marketing", prio: "med", when: (p) => p.model === "supplier" && p.ads === "some",
      title: "Run one small ad test with a hard spending cap",
      body: (p) => ul([
        "Decide the most you can afford to lose on this test before you start, and make that the budget.",
        "An ad test tells you what a sale costs you. It doesn't guarantee any sales. Stop or change the ad if cost per sale is above your break-even from the calculator.",
        p.channel === "shopify" ? "Meta's minimum is about $1 a day per ad set for most advertisers charged per impression. TikTok needs a campaign budget over $50 and an ad group daily budget over $20." : "",
        p.channel === "ebay" ? "With Promoted Listings' general strategy, you choose an ad rate, which is a percentage of the sale. You pay it only if the item sells within 30 days of someone clicking your ad." : "",
        p.channel === "amazon" ? "Sponsored Products charge per click. The minimum daily budget is $1, and the budget is averaged over the month and not paced through the day, so a small budget can go in minutes. Ads show only while the item is in stock." : "",
        p.channel === "tiktok" ? "TikTok's ad minimums are a campaign budget over $50 and an ad group budget over $20 a day. Check the cost shown in Seller Center before switching anything on." : "",
      ]),
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: (p) => ({ shopify: [link("metaAds", "Meta Ads Manager"), link("ttAds", "TikTok Ads Manager")], ebay: [link("ebayPromoted", "eBay: Promoted Listings")], amazon: [link("amzSP", "Amazon: Sponsored Products")] })[p.channel] || [],
      src: (p) => ({ shopify: ["metaBudget", "ttBudget"], ebay: ["ebayPromoted"], amazon: ["amzAdsFaq", "amzSP"], tiktok: ["ttBudget"] })[p.channel] || [] },

    { id: "w2-pod-ads", day: 12, area: "marketing", prio: "med", when: (p) => p.model === "pod" && p.ads === "some",
      title: "Run one small ad test with a hard spending cap",
      body: (p) => ul([
        "Decide the most you can afford to lose on this test before you start, and make that the budget.",
        "An ad test tells you what a sale costs you. It doesn't guarantee any sales. Stop or change the ad if cost per sale is above your break-even from the calculator.",
        p.channel === "shopify" ? "Meta's minimum is about $1 a day per ad set for most advertisers charged per impression. TikTok needs a campaign budget over $50 and an ad group daily budget over $20." : "",
        p.channel === "etsy" ? "Etsy Ads' minimum is $1 a day. You're charged only when someone clicks, Etsy sets the bid for you, and all sellers start with a maximum daily budget of $25." : "",
        p.channel === "tiktok" ? "TikTok's ad minimums are a campaign budget over $50 and an ad group budget over $20 a day. Check the cost shown in Seller Center before switching anything on." : "",
      ]),
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: (p) => ({ shopify: [link("metaAds", "Meta Ads Manager"), link("ttAds", "TikTok Ads Manager")], etsy: [link("etsyAds", "Etsy: set up Etsy Ads")] })[p.channel] || [],
      src: (p) => ({ shopify: ["metaBudget", "ttBudget"], etsy: ["etsyAds"], tiktok: ["ttBudget"] })[p.channel] || [] },

    { id: "w2-digital-ads", day: 12, area: "marketing", prio: "med", when: (p) => p.model === "digital" && p.ads === "some",
      title: "Run one small ad test with a hard spending cap",
      body: (p) => ul([
        "Decide the most you can afford to lose on this test before you start, and make that the budget.",
        "An ad test tells you what a sale costs you. It doesn't guarantee any sales. Stop or change the ad if cost per sale is above your break-even from the calculator.",
        ["shopify", "gumroad", "payhip"].includes(p.channel) ? "Meta's minimum is about $1 a day per ad set for most advertisers charged per impression. TikTok needs a campaign budget over $50 and an ad group daily budget over $20." : "",
        p.channel === "etsy" ? "Etsy Ads' minimum is $1 a day. You're charged only when someone clicks, Etsy sets the bid for you, and all sellers start with a maximum daily budget of $25." : "",
      ]),
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: (p) => (p.channel === "etsy" ? [link("etsyAds", "Etsy: set up Etsy Ads")] : [link("metaAds", "Meta Ads Manager"), link("ttAds", "TikTok Ads Manager")]),
      src: (p) => (p.channel === "etsy" ? ["etsyAds"] : ["metaBudget", "ttBudget"]) },

    { id: "w2-courses-ads", day: 12, area: "marketing", prio: "med", when: (p) => p.model === "courses" && p.ads === "some",
      title: "Run one small ad test with a hard spending cap",
      body: () => ul([
        "Decide the most you can afford to lose on this test before you start, and make that the budget.",
        "An ad test tells you what a sale costs you. It doesn't guarantee any sales. Stop or change the ad if cost per sale is above your break-even from the calculator.",
        "Meta's minimum is about $1 a day per ad set for most advertisers charged per impression. TikTok needs a campaign budget over $50 and an ad group daily budget over $20.",
      ]),
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: () => [link("metaAds", "Meta Ads Manager"), link("ttAds", "TikTok Ads Manager")],
      src: ["metaBudget", "ttBudget"] },

    { id: "w2-fba-ads", day: 12, area: "marketing", prio: "med", when: (p) => p.model === "fba" && p.ads === "some",
      title: "Run one small ad test with a hard spending cap",
      body: () => ul([
        "Start this test only once your stock is live at Amazon.",
        "Decide the most you can afford to lose on this test before you start, and make that the budget.",
        "An ad test tells you what a sale costs you. It doesn't guarantee any sales. Stop or change the ad if cost per sale is above your break-even from the calculator.",
        "Sponsored Products charge per click. The minimum daily budget is $1, and the budget is averaged over the month and not paced through the day, so a small budget can go in minutes. Ads show only while the item is in stock.",
      ]),
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: () => [link("amzSP", "Amazon: Sponsored Products")],
      src: ["amzAdsFaq", "amzSP"] },

    { id: "w2-handmade-ads", day: 12, area: "marketing", prio: "med", when: (p) => p.model === "handmade" && p.ads === "some",
      title: "Run one small ad test with a hard spending cap",
      body: (p) => ul([
        "Decide the most you can afford to lose on this test before you start, and make that the budget.",
        "An ad test tells you what a sale costs you. It doesn't guarantee any sales. Stop or change the ad if cost per sale is above your break-even from the calculator.",
        p.channel === "shopify" ? "Meta's minimum is about $1 a day per ad set for most advertisers charged per impression. TikTok needs a campaign budget over $50 and an ad group daily budget over $20." : "",
        p.channel === "etsy" ? "Etsy Ads' minimum is $1 a day. You're charged only when someone clicks, Etsy sets the bid for you, and all sellers start with a maximum daily budget of $25." : "",
      ]),
      action: { label: "Open the ads calculator", go: "tools:ads" },
      links: (p) => (p.channel === "etsy" ? [link("etsyAds", "Etsy: set up Etsy Ads")] : [link("metaAds", "Meta Ads Manager"), link("ttAds", "TikTok Ads Manager")]),
      src: (p) => (p.channel === "etsy" ? ["etsyAds"] : ["metaBudget", "ttBudget"]) },

    // ======== Dropshipping
    { id: "w2-supplier-listing", day: 9, area: "listings", prio: "high", when: (p) => p.model === "supplier",
      title: "Improve your product page using the platform's own guide",
      body: (p) => ul([
        ...(p.channel === "shopify" ? [
          "In the product's “Search engine listing” section, set a page title and meta description. Shopify says text over 70 characters (title) or 320 (description) may be cut off in results.",
          "Search engines can rewrite these, and changes can take a couple of weeks to show.",
          "Don't edit the URL handle often, or the product may drop out of search results.",
        ] : []),
        ...(p.channel === "ebay" ? [
          "You need at least one photo 500 pixels on its longest side; eBay recommends about 1600.",
          "No added text, borders or watermarks.",
          "Fill in every item specific you can. Buyers filter by them, and a listing without the matching specific is left out of filtered results.",
        ] : []),
        ...(p.channel === "amazon" ? [
          "Shoot on a white background (RGB 255, 255, 255).",
          "Amazon prefers images over 1,000 pixels on each side so shoppers can zoom, and recommends at least 6 images.",
        ] : []),
        ...(p.channel === "tiktok" ? [
          "Images must be at least 600 × 600 pixels, with a main image on white showing the front of the product.",
          "No added logos, text or watermarks.",
          "To reach a “Good” listing-quality rating, upload at least 5 images and fill in every required category detail.",
        ] : []),
      ]),
      action: { label: "Draft the description with AI", go: "tools:describe" },
      links: (p) => ({ shopify: [link("shopSEO", "Shopify: SEO for products")], ebay: [link("ebayPhotos", "eBay: photo tips"), link("ebaySpecifics", "eBay: item specifics")], amazon: [link("amzPhotos", "Amazon: product photo guide")], tiktok: [link("ttsQuality", "TikTok Shop: listing quality guide")] })[p.channel] || [],
      src: (p) => ({ shopify: ["shopSEO"], ebay: ["ebayPicPolicy", "ebayPhotos", "ebaySpecifics"], amazon: ["amzPhotos"], tiktok: ["ttsListing", "ttsQuality"] })[p.channel] || [] },

    { id: "w2-supplier-second", day: 10, area: "research", prio: "med", when: (p) => p.model === "supplier",
      title: "Check and add a second product",
      body: (p) => ul([
        "Put the idea through the product evaluator, then do Shopify's supplier checks again: read reviews and policies, message the supplier, and order a sample.",
        "Only list it if the delivery time works for your channel." + (p.channel === "tiktok" ? " TikTok Shop US orders must be delivered within 6 business days of Awaiting Shipment." : ""),
        p.channel === "ebay" ? "On eBay, the item must come from your own stock or your wholesale supplier agreement." : "",
      ]),
      action: { label: "Open the product evaluator", go: "tools:evaluate" },
      links: () => [link("shopSuppliers", "Shopify: choosing suppliers")],
      src: (p) => ["shopSuppliers"].concat(p.channel === "tiktok" ? ["ttsFulfill"] : [], p.channel === "ebay" ? ["ebayDrop"] : []) },

    { id: "w2-supplier-free", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "supplier",
      title: "Try one free way to reach buyers",
      body: (p) => ul([
        p.channel === "shopify" ? "Shopify Messaging (formerly Shopify Email) lets Basic and higher plans send 10,000 emails a month free; after that it's $1 per 1,000. Email only people who agreed to hear from you." : "",
        p.channel === "shopify" && p.country === "us" ? "Follow CAN-SPAM. Use honest subject lines, include your postal address, and honour opt-outs within 10 business days." : "",
        p.channel === "ebay" ? "Send an offer to interested buyers, meaning people watching the item or with it in their cart. It's free; the price must be at least 5% below Buy It Now, and eBay sends it to the 30 most recent interested buyers." : "",
        ["tiktok", "amazon"].includes(p.channel) ? "Post 3 more product videos. Then, in TikTok Studio, check “watched full video” and where viewers dropped off." : "",
      ]),
      action: { label: "Draft hooks and captions with AI", go: "tools:hooks" },
      links: (p) => ({ shopify: [link("shopEmail", "Shopify Messaging")], ebay: [link("ebayOffers", "eBay: send offers to buyers")], tiktok: [link("ttAnalytics", "TikTok: how analytics work")], amazon: [link("ttAnalytics", "TikTok: how analytics work")] })[p.channel] || [],
      src: (p) => [].concat(p.channel === "shopify" ? ["shopEmail", "shopEmailFaq"] : [], p.channel === "shopify" && p.country === "us" ? ["canSpam"] : [], p.channel === "ebay" ? ["ebayOffers"] : [], ["tiktok", "amazon"].includes(p.channel) ? ["ttAnalytics"] : []) },

    { id: "w2-supplier-cash", day: 13, area: "finance", prio: "high", when: (p) => p.model === "supplier",
      title: "Check when your money actually arrives",
      body: (p) => ul([
        "You pay the supplier when you order, but your platform pays you later. Make sure you can cover supplier bills until then.",
        p.channel === "shopify" ? "Shopify usually pays out in 3–5 business days in the US, with longer settlement for new merchants." : "",
        p.channel === "tiktok" ? "On TikTok Shop US, new sellers are on a 31-day settlement counted from delivery." : "",
        p.channel === "ebay" ? "eBay's holds on new or infrequent sellers are usually resolved within 30 days." : "",
        p.channel === "amazon" ? "Amazon settles about every two weeks and typically holds money 7 days after delivery." : "",
      ]),
      links: (p) => ({ tiktok: [link("ttsSettle", "TikTok Shop: settlement guide")], ebay: [link("ebayHolds", "eBay: payment holds")], amazon: [link("amzPayments", "Amazon: how seller payments work")] })[p.channel] || [],
      src: (p) => ({ shopify: ["shopPayouts"], tiktok: ["ttsSettle"], ebay: ["ebayHolds"], amazon: ["amzPayments"] })[p.channel] || [] },

    // ======== Print-on-demand
    { id: "w2-pod-listing", day: 9, area: "listings", prio: "high", when: (p) => p.model === "pod",
      title: (p) => (p.channel === "tiktok" ? "Improve your listings" : "Improve your listings with Etsy's or Shopify's guide"),
      body: (p) => ul([
        ...(p.channel === "etsy" ? [
          "Use all 13 tags, as natural multi-word phrases.",
          "Keep titles under 15 words and start with what the item is. Move words like “perfect” or “beautiful” to the description.",
          "Fill in every attribute that fits: a listing only appears in filtered searches if it has that attribute.",
          "Etsy ranks partly on “listing quality”, meaning how often views turn into favourites, add-to-carts and sales. It also counts your review rating, message response rate and case rate from the past 3 months.",
        ] : []),
        p.channel === "shopify" ? "In the product's “Search engine listing” section, set a page title and meta description. Shopify says text over 70 characters (title) or 320 (description) may be cut off in results." : "",
        p.channel === "tiktok" ? "Use at least 5 images, a white-background main image, and fill in every required category detail." : "",
      ]),
      action: { label: "Draft the description with AI", go: "tools:describe" },
      links: (p) => ({ etsy: [link("etsySearchHow", "Etsy: how search works"), link("etsyTitles", "Etsy: listing titles")], shopify: [link("shopSEO", "Shopify: SEO for products")], tiktok: [link("ttsQuality", "TikTok Shop: listing quality guide")] })[p.channel] || [],
      src: (p) => ({ etsy: ["etsySearchHow", "etsyTitles"], shopify: ["shopSEO"], tiktok: ["ttsQuality"] })[p.channel] || [] },

    { id: "w2-pod-second", day: 10, area: "content", prio: "med", when: (p) => p.model === "pod",
      title: "Add a second design you own",
      body: (p) => ul([
        "Use only artwork you made or have the rights to." + (p.channel === "etsy" ? " On Etsy, print-on-demand is allowed only for your original designs or buyer personalisation, and you must disclose the production partner." : ""),
        "Build production time into the delivery date you show. Printful says fulfilment averages 2–5 business days for most products before shipping, and knitwear takes 7–12.",
      ]),
      action: { label: "Work out your delivery dates", go: "tools:delivery" },
      links: (p) => [link("printfulTime", "Printful: fulfilment times"), p.channel === "etsy" && link("etsyDrop", "Etsy: print-on-demand rules")].filter(Boolean),
      src: (p) => [].concat(p.channel === "etsy" ? ["etsyDrop"] : [], ["shopIP", "printfulTime"]) },

    { id: "w2-pod-free", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "pod",
      title: (p) => (p.channel === "etsy" ? "Pick one free channel and decide on Etsy Offsite Ads" : "Pick one free channel"),
      body: (p) => ul([
        p.channel === "etsy" ? "Offsite Ads are free until they bring a sale; then Etsy charges 15% of the order total (capped at $100). While your shop has never made $10,000 in a 365-day period, you can opt out in Shop Manager › Settings › Offsite Ads." : "",
        "On Pinterest, Pins must be your own original content. Use links in moderation and avoid blocked link shorteners.",
        p.channel === "shopify" ? "Shopify Messaging gives Basic and higher plans 10,000 free emails a month." + (p.country === "us" ? " In the US, follow CAN-SPAM." : "") : "",
      ]),
      links: (p) => ({ etsy: [link("etsyOffsite", "Etsy: how Offsite Ads work")], shopify: [link("shopEmail", "Shopify Messaging")] })[p.channel] || [],
      src: (p) => [].concat(p.channel === "etsy" ? ["etsyOffsite"] : [], ["pinterestRules"], p.channel === "shopify" ? ["shopEmail"] : [], p.channel === "shopify" && p.country === "us" ? ["canSpam"] : []) },

    { id: "w2-pod-cash", day: 13, area: "finance", prio: "med", when: (p) => p.model === "pod",
      title: "Check when your money actually arrives",
      body: (p) => ul([
        p.channel === "etsy" ? "New sellers' funds are generally available 14 days after a sale. Etsy may hold a share of physical-item sales in a reserve, which for most sellers is removed within 90 days." : "",
        p.channel === "shopify" ? "Shopify usually pays out in 3–5 business days in the US, with longer settlement for new merchants." : "",
        p.channel === "tiktok" ? "On TikTok Shop US, new sellers are on a 31-day settlement counted from delivery." : "",
        "Printful and Printify charge you production costs when each order comes in. Keep enough in your account to cover them until payouts arrive.",
      ]),
      links: (p) => (p.channel === "etsy" ? [link("etsyDeposit", "Etsy: when deposits arrive"), link("etsyReserve", "Etsy: payment reserves")] : []),
      src: (p) => [].concat(({ etsy: ["etsyDeposit", "etsyReserve"], shopify: ["shopPayouts"], tiktok: ["ttsSettle"] })[p.channel] || [], ["printful"]) },

    // ======== Affiliate marketing
    { id: "w2-affiliate-improve", day: 9, area: "content", prio: "high", when: (p) => p.model === "affiliate",
      title: "Improve your best post using what got clicks",
      body: (p) => ul([
        p.channel === "aff_amazon" ? "You earn only on items a shopper adds to their cart within 24 hours of clicking your link. Put the link where people make their decision, not only at the end." : "",
        "Keep the disclosure right next to each link. A note only in your bio, or behind a “more” tap, isn't enough.",
        p.channel === "aff_tiktok" ? "In TikTok Studio, find where viewers stopped watching, and change the hook or that part of the video." : "",
      ]),
      action: { label: "Draft hooks and captions with AI", go: "tools:hooks" },
      links: (p) => ({ aff_amazon: [link("amzAssocWindow", "Amazon: the 24-hour window")], aff_tiktok: [link("ttAnalytics", "TikTok: how analytics work")] })[p.channel] || [],
      src: (p) => [].concat(p.channel === "aff_amazon" ? ["amzAssocWindow"] : [], ["ftcInfluencer"], p.channel === "aff_tiktok" ? ["ttAnalytics"] : []) },

    { id: "w2-affiliate-second", day: 10, area: "research", prio: "med", when: (p) => p.model === "affiliate",
      title: "Add a second product or program",
      body: (p) => ul([
        p.channel === "aff_amazon" ? "Check the product's category rate first; some categories pay 0%." : "",
        p.channel === "aff_network" ? "Apply to one more brand program. Joining Awin, impact.com or CJ isn't the same as being approved by a brand, and each brand sets its own commission." : "",
        p.channel === "aff_tiktok" ? "On TikTok Shop, promoting other sellers' products from the marketplace needs at least 5,000 followers." : "",
      ]),
      links: (p) => ({ aff_amazon: [link("amzAssocAgree", "Amazon Associates agreement")], aff_network: [link("awinJoin", "Awin: join as a publisher")], aff_tiktok: [link("ttsCreator", "TikTok Shop: becoming a creator")] })[p.channel] || [],
      src: (p) => ({ aff_amazon: ["amzAssocAgree"], aff_network: ["awinJoin", "impact", "cjAff"], aff_tiktok: ["ttsCreator"] })[p.channel] || [] },

    { id: "w2-affiliate-free", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "affiliate",
      title: "Share your best piece on one more free channel",
      body: (p) => ul([
        "On Pinterest, Pins must be your original content and use links in moderation, and some link shorteners are blocked.",
        "The disclosure rules apply on every platform: plain words like “I earn a commission”, next to the link.",
        p.channel === "aff_amazon" ? "Don't boost or pay for ads that send people straight to Amazon links. Since April 14, 2026 those purchases don't earn commission." : "",
      ]),
      links: () => [link("pinterestRules", "Pinterest: content guidelines"), link("ftcInfluencer", "FTC: disclosure basics")],
      src: (p) => ["pinterestRules", "ftcInfluencer", "ftcEndorse"].concat(p.channel === "aff_amazon" ? ["amzAssocUpdates"] : []) },

    // No payout facts for the TikTok Shop affiliate channel in the spec, so the step is skipped there.
    { id: "w2-affiliate-payout", day: 13, area: "finance", prio: "med", when: (p) => p.model === "affiliate" && p.channel !== "aff_tiktok",
      title: "Check when and how you'll be paid",
      body: (p) => ul([
        ...(p.channel === "aff_amazon" ? [
          "Amazon pays about 60 days after the end of the month.",
          "The minimum is $10 by direct deposit or gift card, or $100 by check with a $15 fee.",
          "You have 180 days from applying to refer sales; Amazon reviews the account after 3 qualifying sales.",
        ] : []),
        ...(p.channel === "aff_network" ? [
          "Awin pays twice a month once you reach the threshold, $20 for USD.",
          "CJ's minimum is $50 by direct deposit or $100 by check, after commissions lock. CJ says missing payment or tax details are a common reason publishers don't get paid.",
        ] : []),
      ]),
      links: (p) => ({ aff_amazon: [link("amzAssocPay", "Amazon Associates: payment thresholds")], aff_network: [link("awinPay", "Awin: payment thresholds"), link("cjPay", "CJ: payment cycle")] })[p.channel] || [],
      src: (p) => ({ aff_amazon: ["amzAssocAgree", "amzAssocPay", "amzAssoc180"], aff_network: ["awinPay", "cjPay"] })[p.channel] || [] },

    // ======== Digital products
    // No listing guide for Payhip in the spec, so the step is skipped there.
    { id: "w2-digital-listing", day: 9, area: "listings", prio: "high", when: (p) => p.model === "digital" && p.channel !== "payhip",
      title: "Improve your listing with the platform's own guide",
      body: (p) => ul([
        p.channel === "etsy" ? "Use all 13 tags, keep titles under 15 words starting with what the item is, and fill in every attribute. Listing photos must be your own." : "",
        p.channel === "gumroad" ? "To show in Discover, a product needs a category, ratings turned on and at least one sale. Your account also has to pass Gumroad's review." : "",
        p.channel === "shopify" ? "In the product's “Search engine listing” section, set a page title and meta description. Shopify says text over 70 characters (title) or 320 (description) may be cut off in results." : "",
      ]),
      action: { label: "Draft the description with AI", go: "tools:describe" },
      links: (p) => ({ etsy: [link("etsySearchHow", "Etsy: how search works")], gumroad: [link("gumroadDiscover", "Gumroad: Discover")], shopify: [link("shopSEO", "Shopify: SEO for products")] })[p.channel] || [],
      src: (p) => ({ etsy: ["etsySearchHow", "etsyTitles", "etsySellerPolicy"], gumroad: ["gumroadDiscover"], shopify: ["shopSEO"] })[p.channel] || [] },

    { id: "w2-digital-second", day: 10, area: "content", prio: "med", when: (p) => p.model === "digital",
      title: "Make a second product that goes with the first",
      body: (p) => ul([
        "Check the licence of every font, template and graphic you use for commercial use.",
        p.channel === "etsy" ? "On Etsy, items must be made or designed by you, and AI use must be disclosed." : "",
        "If you sell both together at a discount, check what the discount does to your profit first.",
      ]),
      action: { label: "Open the discount impact calculator", go: "tools:discount" },
      links: () => [link("canvaLicense", "Canva: licensing explained")],
      src: (p) => ["canvaLicense"].concat(p.channel === "etsy" ? ["etsySellerPolicy"] : []) },

    { id: "w2-digital-free", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "digital",
      title: "Share it on one free channel",
      body: (p) => ul([
        "On Pinterest, share only original content, and use links in moderation.",
        p.channel === "shopify" ? "Shopify Messaging gives 10,000 free emails a month on Basic and up." + (p.country === "us" ? " In the US, follow CAN-SPAM." : "") : "",
        p.channel === "gumroad" ? "Discover listing isn't instant. Your account needs payout settings, a minimum balance from real sales, and a review that takes about 3 weeks on average. Sales from Discover cost 30%." : "",
      ]),
      action: { label: "Draft posts with AI", go: "tools:hooks" },
      links: (p) => [link("pinterestRules", "Pinterest: content guidelines"), p.channel === "shopify" && link("shopEmail", "Shopify Messaging"), p.channel === "gumroad" && link("gumroadDiscover", "Gumroad: Discover")].filter(Boolean),
      src: (p) => ["pinterestRules"].concat(p.channel === "shopify" ? ["shopEmail"] : [], p.channel === "shopify" && p.country === "us" ? ["canSpam"] : [], p.channel === "gumroad" ? ["gumroadDiscover", "gumroad"] : []) },

    { id: "w2-digital-payout", day: 13, area: "finance", prio: "med", when: (p) => p.model === "digital",
      title: "Check when your money arrives",
      body: (p) => ul([
        p.channel === "gumroad" ? "Gumroad pays out only once your balance is at least $100 (higher in some countries). On weekly, monthly and quarterly schedules, sales are held at least 7 days." : "",
        p.channel === "payhip" ? "Your first PayPal sale goes through an approval that may delay that payout. By default, PayPal withdrawals are started by you." : "",
        p.channel === "etsy" ? "Digital sales aren't held in a reserve, but new sellers' funds are generally available 14 days after a sale." : "",
        p.channel === "shopify" ? "Shopify usually pays out in 3–5 business days in the US, with longer settlement for new merchants." : "",
      ]),
      links: (p) => ({ gumroad: [link("gumroadPay", "Gumroad: getting paid")], payhip: [link("payhipPaypal", "Payhip: connect PayPal")], etsy: [link("etsyDeposit", "Etsy: when deposits arrive")] })[p.channel] || [],
      src: (p) => ({ gumroad: ["gumroadPay"], payhip: ["payhipPaypal"], etsy: ["etsyReserve", "etsyDeposit"], shopify: ["shopPayouts"] })[p.channel] || [] },

    // ======== Reselling
    { id: "w2-resell-photos", day: 9, area: "listings", prio: "high", when: (p) => p.model === "resell",
      title: "Improve photos and details using eBay's guide",
      body: () => ul([
        "Use at least one photo 500 pixels on its longest side; eBay recommends about 1600. Add several angles and close-ups of any wear or flaws. You can add up to 24 photos.",
        "Stock photos aren't allowed for used items, and photos can't have added text, borders or watermarks.",
        "Fill in item specifics: buyers filter by them, and listings without them drop out of filtered results.",
        "The same photo habits help on Mercari and Poshmark.",
      ]),
      action: { label: "Draft the listing with AI", go: "tools:describe" },
      links: () => [link("ebayPhotos", "eBay: photo tips"), link("ebaySpecifics", "eBay: item specifics")],
      src: ["ebayPicPolicy", "ebayPhotos", "ebaySpecifics"] },

    { id: "w2-resell-offers", day: 10, area: "marketing", prio: "high", when: (p) => p.model === "resell",
      title: "Send offers to people already interested",
      body: (p) => ul([
        ...(p.channel === "ebay" ? [
          "In Seller Hub › Active Listings, filter “Send offers - eligible”. Offers must be at least 5% below Buy It Now and are valid for 96 hours. eBay sends them to the 30 most recent interested buyers.",
          "Offers can't include contact details such as an email address, phone number or URL.",
        ] : []),
        ["mercari", "poshmark"].includes(p.channel) ? "Reply to offers the same day, and know your lowest price before one comes in." : "",
      ]),
      action: { label: "Open message templates", go: "tools:messages" },
      links: (p) => ({ ebay: [link("ebayOffers", "eBay: send offers to buyers")], poshmark: [link("poshStart", "Poshmark: get started")] })[p.channel] || [],
      src: (p) => (p.channel === "ebay" ? ["ebayOffers"] : []) },

    { id: "w2-resell-source", day: 11, area: "suppliers", prio: "high", when: (p) => p.model === "resell",
      title: "Buy your next items using sold prices",
      body: (p) => ul([
        "Work out the most you'll pay for each item from its recent sold price before you go shopping.",
        p.channel === "ebay" ? "New accounts have monthly limits on how many items and how much in total you can list or sell. Check yours in Seller Hub before buying more than you can list. A Store subscription doesn't raise the limit." : "",
        "Skip anything that might be fake. Counterfeits break marketplace rules and the law.",
      ]),
      action: { label: "Open the max buy price calculator", go: "tools:maxbuy" },
      links: (p) => (p.channel === "ebay" ? [link("ebayLimits", "eBay: selling limits")] : []),
      src: (p) => (p.channel === "ebay" ? ["ebayLimits"] : []) },

    { id: "w2-resell-payout", day: 13, area: "finance", prio: "med", when: (p) => p.model === "resell",
      title: "Check when each sale's money reaches you",
      body: (p) => ul([
        p.channel === "ebay" ? "eBay's holds on new or infrequent sellers are usually resolved within 30 days. Shipping the same day with tracking helps." : "",
        p.channel === "mercari" ? "Mercari releases funds when the buyer rates, or 72 hours after delivery. Direct deposit is free but takes up to 5 business days; Instant Pay is $3." : "",
        p.channel === "poshmark" ? "Poshmark releases earnings within 3 days of delivery, then direct deposit takes 2–3 business days." : "",
      ]),
      links: (p) => ({ ebay: [link("ebayHolds", "eBay: payment holds")], mercari: [link("mercariPaid", "Mercari: getting paid")], poshmark: [link("poshPaid", "Poshmark: when you get paid")] })[p.channel] || [],
      src: (p) => ({ ebay: ["ebayHolds"], mercari: ["mercariPaid"], poshmark: ["poshPaid"] })[p.channel] || [] },

    // ======== Freelancing
    { id: "w2-freelance-profile", day: 9, area: "listings", prio: "high", when: (p) => p.model === "freelance",
      title: "Improve your profile or gig with the platform's guide",
      body: (p) => ul([
        ...(p.channel === "fiverr" ? [
          "The title starts “I will…”; finish it with exactly what you deliver.",
          "Add 1–3 Gig images, ideally 1280 × 769 px, that you have commercial rights to.",
          "The description can be up to 1,200 characters, with no contact details.",
        ] : []),
        ...(p.channel === "upwork" ? [
          "The title can be up to 70 characters, so be specific about the service.",
          "Only the first 250 characters of your overview show in search, so lead with what you do for clients.",
          "Aim for a 100% complete profile.",
          "Add a portfolio. Upwork says freelancers with a published portfolio are hired 9 times more often (Upwork's own figure).",
        ] : []),
        p.channel === "direct" ? "Make sure your one-page service page states the outcome, what's included, delivery time and price." : "",
      ]),
      action: { label: "Draft the description with AI", go: "tools:describe" },
      links: (p) => ({ fiverr: [link("fiverrGigBest", "Fiverr: Gig best practices")], upwork: [link("upworkProfile", "Upwork: complete your profile")] })[p.channel] || [],
      src: (p) => ({ fiverr: ["fiverrCreateGig", "fiverrGigImages", "fiverrGigBest"], upwork: ["upworkTitle", "upworkProfile"] })[p.channel] || [] },

    { id: "w2-freelance-offer", day: 10, area: "research", prio: "med", when: (p) => p.model === "freelance",
      title: "Sharpen your offer before adding another",
      body: (p) => ul([
        p.channel === "fiverr" ? "Fiverr suggests starting with one Gig and adding more only after it gets positive feedback and several sales. New sellers can have up to 4 active Gigs. This week, improve the packages in the Gig you have." : "",
        p.channel === "upwork" ? "Tailor each proposal. Open with the client's problem, because only the first couple of sentences show in their list. Answer the screening questions, and keep it short." : "",
        p.channel === "direct" ? "Add a smaller starter package so new clients can try you at lower risk." : "",
      ]),
      links: (p) => ({ fiverr: [link("fiverrGigBest", "Fiverr: Gig best practices")], upwork: [link("upworkProposal", "Upwork: writing proposals")] })[p.channel] || [],
      src: (p) => ({ fiverr: ["fiverrGigBest", "fiverrLevels"], upwork: ["upworkProposal"] })[p.channel] || [] },

    { id: "w2-freelance-reviews", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "freelance",
      title: "Ask happy clients for a review and a referral",
      body: (p) => ul([
        "Ask every client whose work you delivered on time for a review or a testimonial you can show.",
        p.channel === "upwork" ? "If clients view your proposals but don't invite you to interview, Upwork suggests working on your cover letter." : "",
        p.country === "us" ? "If you send cold emails, follow CAN-SPAM. Use an honest subject line, include your postal address, and honour opt-outs within 10 business days." : "",
      ]),
      action: { label: "Open message templates", go: "tools:messages" },
      links: (p) => (p.channel === "upwork" ? [link("upworkProposal", "Upwork: writing proposals")] : []),
      src: (p) => [].concat(p.channel === "upwork" ? ["upworkProposal"] : [], p.country === "us" ? ["canSpam"] : []) },

    // No payout facts for own clients outside the US in the spec, so the step is skipped there.
    { id: "w2-freelance-payout", day: 13, area: "finance", prio: "med", when: (p) => p.model === "freelance" && (p.channel !== "direct" || p.country === "us"),
      title: "Plan for when your earnings clear",
      body: (p) => ul([
        p.channel === "fiverr" ? "Earnings become available 14 days after an order is completed (7 for Top Rated, Pro and Seller Plus)." : "",
        p.channel === "upwork" ? "Hourly work is paid 10 days after the weekly billing period ends. For fixed-price work, the client has up to 14 days to review, then there's a 5-day security hold." : "",
        p.country === "us" ? "Set money aside from every payment for self-employment tax (15.3% on 92.35% of net earnings)." : "",
      ]),
      links: (p) => ({ fiverr: [link("fiverrOrders", "Fiverr: managing orders")], upwork: [link("upworkHourly", "Upwork: hourly payments")] })[p.channel] || [],
      src: (p) => [].concat(({ fiverr: ["fiverrOrders"], upwork: ["upworkHourly", "upworkFixed"] })[p.channel] || [], p.country === "us" ? ["irsSE"] : []) },

    // ======== Content creator
    { id: "w2-creator-improve", day: 9, area: "content", prio: "high", when: (p) => p.model === "creator" && !["twitch", "yt_live"].includes(p.channel),
      title: "Fix the first 30 seconds using your analytics",
      body: (p) => ul([
        ...(p.channel === "yt" ? [
          "The “Intro” key moment shows what share of viewers are still watching after 30 seconds. If it's low, YouTube suggests checking that your title and thumbnail match the video and trying a new opening.",
          "Verify your phone number in YouTube Studio to unlock intermediate features, including custom thumbnails. One phone number can verify up to 2 channels a year.",
        ] : []),
        p.channel === "tt_creator" ? "In TikTok Studio, find the drop-off points and what was on screen when people left. TikTok advises watching overall trends rather than one video's numbers." : "",
      ]),
      action: { label: "Draft hooks with AI", go: "tools:hooks" },
      links: (p) => ({ yt: [link("ytRetention", "YouTube: audience retention"), link("ytFeatures", "YouTube: unlock features")], tt_creator: [link("ttAnalytics", "TikTok: how analytics work")] })[p.channel] || [],
      src: (p) => ({ yt: ["ytRetention", "ytFeatures", "ytThumbs"], tt_creator: ["ttAnalytics"] })[p.channel] || [] },

    { id: "w2-creator-format", day: 10, area: "content", prio: "med", when: (p) => p.model === "creator" && !["twitch", "yt_live"].includes(p.channel),
      title: "Try a second format that counts toward the program",
      body: (p) => ul([
        ...(p.channel === "yt" ? [
          "Shorts-feed views don't count towards long-form watch hours, so mix in long videos if you're aiming for the watch-hour route.",
          "From 1 February 2027, new applicants need 1,000 subscribers plus 8,000 qualified watch hours in 365 days, or 20 million qualified Shorts views in 90 days.",
        ] : []),
        p.channel === "tt_creator" ? "Only original videos at least 1 minute long count for Creator Rewards." : "",
      ]),
      links: (p) => ({ yt: [link("ytYppChanges", "YouTube: Partner Program changes")], tt_creator: [link("ttRewards", "TikTok: Creator Rewards Program")] })[p.channel] || [],
      src: (p) => ({ yt: ["ytYpp", "ytYppChanges"], tt_creator: ["ttRewards"] })[p.channel] || [] },

    { id: "w2-creator-timeline", day: 13, area: "finance", prio: "med", when: (p) => p.model === "creator",
      title: "Know how long approval and payment take",
      body: (p) => ul([
        p.channel === "yt" ? "After you finish the sign-up steps (contract and AdSense), a review typically takes about a month. If you're rejected, you can reapply 30 days later." : "",
        p.channel === "tt_creator" ? "In the US, Creator Rewards pays monthly once you pass $50." : "",
        "Meanwhile, sponsorships and affiliate links must be clearly disclosed in the video itself.",
      ]),
      links: (p) => ({ yt: [link("ytRejected", "YouTube: if you're rejected")], tt_creator: [link("ttRewardsTerms", "TikTok: Creator Rewards terms (US)")] })[p.channel] || [],
      src: (p) => [].concat(({ yt: ["ytYpp", "ytRejected"], tt_creator: ["ttRewardsTerms"] })[p.channel] || [], ["ftcInfluencer"]) },

    // ======== Online courses
    { id: "w2-courses-coupon", day: 9, area: "listings", prio: "high", when: (p) => p.model === "courses",
      title: "Give your first students a coupon link",
      body: (p) => ul([
        p.channel === "teachable" ? "Add <b>?coupon_code=CODE</b> to a sales or checkout page link. Only one coupon works per checkout, and a paid product can't sell for less than $1." : "",
        p.channel === "thinkific" ? "Add <b>?coupon=CODE</b> to a course, bundle or checkout link and the coupon applies automatically." : "",
        "Describe what students will learn, and never promise income or results you can't back up.",
      ]),
      action: { label: "Open the discount impact calculator", go: "tools:discount" },
      links: (p) => ({ teachable: [link("teachableCoupons", "Teachable: coupons")], thinkific: [link("thinkificCoupons", "Thinkific: coupon links")] })[p.channel] || [],
      src: (p) => [].concat(({ teachable: ["teachableCoupons"], thinkific: ["thinkificCoupons"] })[p.channel] || [], ["ftcScam"]) },

    { id: "w2-courses-second", day: 10, area: "store", prio: "med", when: (p) => p.model === "courses",
      title: "Add a second offer: an order bump or a bundle",
      body: (p) => ul([
        p.channel === "thinkific" ? "Order bumps need Thinkific Payments, and each product can have only one bump. Coupons don't apply to the bump." : "",
        p.channel === "teachable" ? "Coupons don't apply to order bumps; set a sale price on the bump instead." : "",
        "Price the bump so it still makes a profit after fees.",
      ]),
      action: { label: "Open the price calculator", go: "tools:price" },
      links: (p) => ({ thinkific: [link("thinkificBumps", "Thinkific: order bumps")], teachable: [link("teachableCoupons", "Teachable: coupons")] })[p.channel] || [],
      src: (p) => ({ thinkific: ["thinkificBumps"], teachable: ["teachableCoupons"] })[p.channel] || [] },

    { id: "w2-courses-free", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "courses",
      title: "Email your waitlist and share one free lesson",
      body: (p) => ul([
        "Email the people who asked to hear about the course, and share one short lesson publicly so others can judge it.",
        p.country === "us" ? "Marketing emails must follow CAN-SPAM. Identify them as an ad unless people asked for them, include your postal address, and honour opt-outs within 10 business days." : "",
      ]),
      action: { label: "Draft posts with AI", go: "tools:hooks" },
      links: (p) => (p.country === "us" ? [link("canSpam", "FTC: CAN-SPAM guide")] : []),
      src: (p) => (p.country === "us" ? ["canSpam"] : []) },

    { id: "w2-courses-payout", day: 13, area: "finance", prio: "med", when: (p) => p.model === "courses",
      title: "Check when course sales reach your bank",
      body: (p) => ul([
        p.channel === "teachable" ? "You choose daily, weekly or monthly payouts. Reserves can hold part of a sale (Teachable's example: a Jan 1 purchase unlocks Jan 15). Payouts stop once earnings reach $500 without a tax form." : "",
        p.channel === "thinkific" ? "Your first payout comes 7–14 days after your first successful payment, then about 2 business days after each sale in the US." : "",
        p.channel === "payhip" ? "Your first PayPal sale goes through an approval that may delay it." : "",
      ]),
      links: (p) => ({ teachable: [link("teachablePayouts", "Teachable: payouts")], thinkific: [link("thinkificPayouts", "Thinkific: payouts")] })[p.channel] || [],
      src: (p) => ({ teachable: ["teachablePayouts"], thinkific: ["thinkificPayouts"], payhip: ["payhipPaypal"] })[p.channel] || [] },

    // ======== Self-publishing
    { id: "w2-books-metadata", day: 9, area: "listings", prio: "high", when: (p) => p.model === "books",
      title: "Improve your keywords and categories with KDP's guide",
      body: () => ul([
        "Use up to 7 keywords, ideally 2–3-word phrases in the order readers type them. Search Amazon with them before you save.",
        "Don't repeat words from your title or categories, and avoid praise or time-limited phrases. KDP has zero tolerance for misleading metadata.",
        "Choose up to 3 categories that match the book's main subject.",
      ]),
      action: { label: "Draft the description with AI", go: "tools:describe" },
      links: () => [link("kdpKeywords", "KDP: keywords"), link("kdpCategories", "KDP: categories")],
      src: ["kdpKeywords", "kdpCategories"] },

    { id: "w2-books-second", day: 10, area: "content", prio: "med", when: (p) => p.model === "books",
      title: "Add a second format or start book two",
      body: () => ul([
        "If you published only the eBook, consider a paperback. Its royalty is 60% of list price at $9.99 and up, minus printing, which depends on page count, trim size, ink and paper.",
        "From 21 September 2026, KDP allows up to 2 new titles per format per week, resetting Sunday at 00:00 UTC.",
      ]),
      action: { label: "Open the book royalty calculator", go: "tools:royalty" },
      links: () => [link("kdpPrint", "KDP: printing costs"), link("kdpLimit", "KDP: title limits")],
      src: ["kdpPaper", "kdpPrint", "kdpLimit", "kdpCreate"] },

    { id: "w2-books-promo", day: 11, area: "marketing", prio: "med", when: (p) => p.model === "books",
      title: "Decide whether KDP Select's free promotions suit you",
      body: () => ul([
        "KDP Select makes your eBook exclusive to Amazon for 90 days, renewing automatically. Print and audio versions can still be sold elsewhere.",
        "In each 90-day term you can run either up to 5 free-promotion days or one Kindle Countdown Deal. A Countdown Deal needs 30 days in Select and a list price of $2.99–$24.99 on Amazon.com.",
        "Tell the readers who asked about your book when it's free or discounted.",
      ]),
      links: () => [link("kdpSelect", "KDP Select"), link("kdpFreePromo", "KDP: free book promotions")],
      src: ["kdpSelect", "kdpFreePromo", "kdpCountdown"] },

    { id: "w2-books-payout", day: 13, area: "finance", prio: "low", when: (p) => p.model === "books",
      title: "Know when royalties are paid",
      body: () => ul([
        "Royalties are paid about 60 days after the end of the month of the sale.",
        "By direct deposit (EFT) there's no minimum; by wire the minimum is $100.",
      ]),
      links: () => [link("kdpThresholds", "KDP: payment thresholds")],
      src: ["kdpThresholds"] },

    // ======== Newsletter
    { id: "w2-newsletter-recs", day: 9, area: "marketing", prio: "high", when: (p) => p.model === "newsletter",
      title: "Recommend other newsletters your readers would like",
      body: (p) => ul([
        ...(p.channel === "substack" ? [
          "Add recommendations from your dashboard. The writers are notified and prompted to recommend you back, and the Recommendations tab shows how many free subscribers each one brought.",
          "Substack says the most powerful engine for growth on its platform is ongoing recommendations from fellow writers.",
        ] : []),
        p.channel === "beehiiv" ? "Free recommendations work on every plan, including Free." : "",
      ]),
      links: (p) => ({ substack: [link("substackRecs", "Substack: recommendations")], beehiiv: [link("beehiivRecs", "beehiiv: Recommendations Network")] })[p.channel] || [],
      src: (p) => ({ substack: ["substackRecs", "substackFeatured"], beehiiv: ["beehiivRecs"] })[p.channel] || [] },

    { id: "w2-newsletter-welcome", day: 10, area: "store", prio: "med", when: (p) => p.model === "newsletter",
      title: "Improve your sign-up and welcome page",
      body: (p) => ul([
        "Say who it's for, what readers get and how often.",
        p.channel === "substack" ? "You can add up to 3 endorsement blurbs from writers who recommend you to your Welcome page. Blurbs don't show on the mobile version." : "",
      ]),
      links: (p) => (p.channel === "substack" ? [link("substackEndorse", "Substack: add an endorsement")] : []),
      src: (p) => (p.channel === "substack" ? ["substackEndorse"] : []) },

    { id: "w2-newsletter-paid", day: 11, area: "finance", prio: "med", when: (p) => p.model === "newsletter",
      title: "Work out whether a paid tier makes sense yet",
      body: (p) => ul([
        ...(p.channel === "substack" ? [
          "The minimum price is $5 a month and $30 a year (US-dollar accounts). A yearly-only plan isn't possible, and price changes apply only to new subscribers.",
          "Substack keeps 10% of paid revenue, plus Stripe processing.",
        ] : []),
        p.channel === "beehiiv" ? "Paid subscriptions and the Ad Network are on paid plans only." : "",
      ]),
      action: { label: "Open the subscription income calculator", go: "tools:recurring" },
      links: (p) => ({ substack: [link("substackPaid", "Substack: set up paid")], beehiiv: [link("beehiivPlans", "beehiiv: plans")] })[p.channel] || [],
      src: (p) => ({ substack: ["substackPaid", "substackCost"], beehiiv: ["beehiivPlans", "beehiivAds"] })[p.channel] || [] },

    // ======== Amazon FBA
    { id: "w2-fba-images", day: 9, area: "listings", prio: "high", when: (p) => p.model === "fba",
      title: "Plan listing photos to Amazon's own guidance",
      body: () => ul([
        "Shoot on a white background (RGB 255, 255, 255). Amazon prefers images over 1,000 pixels on each side so shoppers can zoom.",
        "Every product needs at least one image, and Amazon recommends at least six.",
        "Amazon suggests the product fill 85% or more of the frame.",
        "Only show and claim what your samples actually do.",
      ]),
      action: { label: "Draft the listing with AI", go: "tools:describe" },
      links: () => [link("amzPhotos", "Amazon: product photo guide")],
      src: ["amzPhotos", "amzSEO"] },

    { id: "w2-fba-order", day: 10, area: "suppliers", prio: "high", when: (p) => p.model === "fba",
      title: "Place a stock order only if samples and numbers work",
      body: (p) => ul([
        "Re-run profit per unit with real quotes and Amazon's fee estimator. Only order stock you can afford to lose.",
        "New sellers who send eligible products to FBA within 90 days of their first listing get FBA New Selection benefits.",
        p.country === "us" ? "In the US, children's products (ages 12 and under) need third-party lab testing and a Children's Product Certificate." : "",
      ]),
      action: { label: "Open the product evaluator", go: "tools:evaluate" },
      links: () => [link("fbaCalc", "Amazon: fee calculator")],
      src: (p) => ["fbaCalc", "fbaGuide"].concat(p.country === "us" ? ["cpscCpc"] : []) },

    { id: "w2-fba-cash", day: 13, area: "finance", prio: "med", when: (p) => p.model === "fba",
      title: "Plan cash flow around Amazon's payout timing",
      body: () => ul([
        "Amazon settles seller accounts about every two weeks and typically holds each order's money for 7 days after delivery. A bank transfer can take up to 5 business days.",
        "Storage fees keep running on unsold stock, and items stored more than 181 days carry an aged-inventory fee.",
      ]),
      links: () => [link("amzPayments", "Amazon: how seller payments work")],
      src: ["amzPayments", "fbaGuide"] },

    // ======== Handmade
    { id: "w2-handmade-listing", day: 9, area: "listings", prio: "high", when: (p) => p.model === "handmade",
      title: (p) => (p.channel === "etsy" ? "Improve your listings with Etsy's search guide" : "Improve your listings"),
      body: (p) => ul([
        ...(p.channel === "etsy" ? [
          "Use all 13 tags as natural multi-word phrases, and fill in every attribute that fits. Filtered searches show only listings that have that attribute.",
          "Keep titles under 15 words and start with what the item is.",
          "Etsy ranks partly on listing quality (favourites, add-to-carts and sales after views) and on your review rating, response rate and case rate from the past 3 months.",
        ] : []),
        p.channel === "shopify" ? "In the product's “Search engine listing” section, set a page title and meta description. Shopify says text over 70 characters (title) or 320 (description) may be cut off in results." : "",
      ]),
      action: { label: "Draft the description with AI", go: "tools:describe" },
      links: (p) => ({ etsy: [link("etsySearchHow", "Etsy: how search works"), link("etsyTitles", "Etsy: listing titles")], shopify: [link("shopSEO", "Shopify: SEO for products")] })[p.channel] || [],
      src: (p) => ({ etsy: ["etsySearchHow", "etsyTitles"], shopify: ["shopSEO"] })[p.channel] || [] },

    { id: "w2-handmade-second", day: 10, area: "content", prio: "med", when: (p) => p.model === "handmade",
      title: "Add a second item or variation you can make well",
      body: (p) => ul([
        p.channel === "etsy" ? "On Etsy, listing photos must be your own photos of the finished item." : "",
        p.country === "us" ? "In the US, if it's made mainly for children 12 and under, it needs lab testing and a Children's Product Certificate." : "",
        "Price materials and your time before you list it.",
      ]),
      action: { label: "Open the price calculator", go: "tools:price" },
      links: (p) => (p.channel === "etsy" ? [link("etsyCreativity", "Etsy: Creativity Standards")] : []),
      src: (p) => [].concat(p.channel === "etsy" ? ["etsyCreativity"] : [], p.country === "us" ? ["cpscCpc"] : []) },

    { id: "w2-handmade-free", day: 11, area: "marketing", prio: "high", when: (p) => p.model === "handmade",
      title: (p) => (p.channel === "etsy" ? "Pick one free channel and decide on Offsite Ads" : "Pick one free channel"),
      body: (p) => ul([
        p.channel === "etsy" ? "Offsite Ads cost nothing until they bring a sale, then 15% of the order total (capped at $100). You can opt out while your shop has never made $10,000 in a 365-day period." : "",
        p.channel === "shopify" ? "Shopify Messaging gives 10,000 free emails a month on Basic and up." + (p.country === "us" ? " In the US, follow CAN-SPAM." : "") : "",
        "On Pinterest, share only original content, and use links in moderation.",
      ]),
      action: { label: "Draft posts with AI", go: "tools:hooks" },
      links: (p) => ({ etsy: [link("etsyOffsite", "Etsy: how Offsite Ads work")], shopify: [link("shopEmail", "Shopify Messaging")] })[p.channel] || [],
      src: (p) => [].concat(p.channel === "etsy" ? ["etsyOffsite"] : [], p.channel === "shopify" ? ["shopEmail"] : [], p.channel === "shopify" && p.country === "us" ? ["canSpam"] : [], ["pinterestRules"]) },

    { id: "w2-handmade-cash", day: 13, area: "finance", prio: "med", when: (p) => p.model === "handmade",
      title: "Check when your money actually arrives",
      body: (p) => ul([
        p.channel === "etsy" ? "New sellers' funds are generally available 14 days after a sale. A reserve may hold a share of physical-item sales; for most sellers it's removed within 90 days. Shipping with tracking can release reserved funds sooner." : "",
        p.channel === "shopify" ? "Shopify's US payouts usually take 3–5 business days, longer for new merchants." : "",
      ]),
      links: (p) => (p.channel === "etsy" ? [link("etsyDeposit", "Etsy: when deposits arrive"), link("etsyReserve", "Etsy: payment reserves")] : []),
      src: (p) => ({ etsy: ["etsyDeposit", "etsyReserve"], shopify: ["shopPayouts"] })[p.channel] || [] },
  ];

  const WEEK2_META = {
    "w2-supplier-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-pod-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-affiliate-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-digital-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-resell-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-freelance-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-creator-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-courses-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-books-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-newsletter-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-fba-review": { cost: "Free", gets: "Real quotes and Amazon fees in the profit calculator" },
    "w2-handmade-review": { cost: "Free", gets: "Week 1's real numbers, and one thing to change" },
    "w2-supplier-ads": { cost: "Your test budget, capped by you", gets: "One capped ad test, compared with your break-even" },
    "w2-pod-ads": { cost: "Your test budget, capped by you", gets: "One capped ad test, compared with your break-even" },
    "w2-digital-ads": { cost: "Your test budget, capped by you", gets: "One capped ad test, compared with your break-even" },
    "w2-courses-ads": { cost: "Your test budget, capped by you", gets: "One capped ad test, compared with your break-even" },
    "w2-fba-ads": { cost: "Your test budget, capped by you", gets: "One capped ad test, compared with your break-even" },
    "w2-handmade-ads": { cost: "Your test budget, capped by you", gets: "One capped ad test, compared with your break-even" },
    "w2-supplier-listing": { cost: "Free", gets: "A product page that follows the platform's own guide" },
    "w2-supplier-second": { cost: "What the supplier charges for a sample", gets: "A second product, checked before you list it" },
    "w2-supplier-free": { cost: "Free; Shopify emails past 10,000 a month cost extra", gets: "One free way to reach buyers, tried" },
    "w2-supplier-cash": { cost: "Free", gets: "A plan to cover supplier bills until you're paid" },
    "w2-pod-listing": { cost: "Free", gets: "Listings that follow your platform's own guide" },
    "w2-pod-second": { gets: "A second design you own, with an honest delivery date" },
    "w2-pod-free": { cost: "Free", gets: "One free channel picked to share your designs" },
    "w2-pod-cash": { cost: "Free", gets: "A plan to cover production costs until you're paid" },
    "w2-affiliate-improve": { cost: "Free", gets: "Your best post improved, with disclosure by each link" },
    "w2-affiliate-second": { cost: "Free", gets: "A second product or program, checked first" },
    "w2-affiliate-free": { cost: "Free", gets: "Your best piece shared on one more free channel" },
    "w2-affiliate-payout": { cost: "Free", gets: "A note of when and how you'll be paid" },
    "w2-digital-listing": { cost: "Free", gets: "A listing that follows your platform's own guide" },
    "w2-digital-second": { gets: "A second product, with every licence checked" },
    "w2-digital-free": { cost: "Free to post", gets: "Your product shared on one free channel" },
    "w2-digital-payout": { cost: "Free", gets: "A note of when your sales money arrives" },
    "w2-resell-photos": { cost: "Free", gets: "Listings with clear photos and full item specifics" },
    "w2-resell-offers": { cost: "Free", gets: "Offers handled fast, with your lowest price set" },
    "w2-resell-source": { cost: "What you pay for the items", gets: "Your next items, bought below your max price" },
    "w2-resell-payout": { cost: "Free", gets: "A note of when each sale's money reaches you" },
    "w2-freelance-profile": { cost: "Free", gets: "A clearer gig, profile or service page" },
    "w2-freelance-offer": { gets: "A sharper offer before you add another" },
    "w2-freelance-reviews": { cost: "Free", gets: "Reviews or testimonials asked for from happy clients" },
    "w2-freelance-payout": { cost: "Free", gets: "A plan for when your earnings clear" },
    "w2-creator-improve": { cost: "Free", gets: "A stronger opening for your next video" },
    "w2-creator-format": { cost: "Free", gets: "A second format that counts toward the program" },
    "w2-creator-timeline": { cost: "Free", gets: "A realistic timeline for approval and payment" },
    "w2-courses-coupon": { cost: "Free", gets: "A coupon link for your first students" },
    "w2-courses-second": { gets: "A second offer priced to profit after fees" },
    "w2-courses-free": { cost: "Free", gets: "Your waitlist emailed and one free lesson shared" },
    "w2-courses-payout": { cost: "Free", gets: "A note of when course sales reach your bank" },
    "w2-books-metadata": { cost: "Free", gets: "Up to 7 keywords and 3 categories that fit your book" },
    "w2-books-second": { gets: "A paperback planned, or book two started" },
    "w2-books-promo": { gets: "A decision on KDP Select and free promotions" },
    "w2-books-payout": { cost: "Free", gets: "A note of when your royalties will be paid" },
    "w2-newsletter-recs": { cost: "Free", gets: "Newsletters recommended to your readers" },
    "w2-newsletter-welcome": { cost: "Free", gets: "A welcome page that says who it's for and how often" },
    "w2-newsletter-paid": { cost: "Free", gets: "A decision on whether to add a paid tier yet" },
    "w2-fba-images": { gets: "A photo plan that follows Amazon's guidance" },
    "w2-fba-order": { cost: "Your stock order: only what you can afford to lose", gets: "A stock order placed only if the numbers work" },
    "w2-fba-cash": { cost: "Free", gets: "A cash plan around Amazon's payout timing" },
    "w2-handmade-listing": { cost: "Free", gets: "Listings that follow your platform's search guide" },
    "w2-handmade-second": { cost: "Your materials and time", gets: "A second item or variation, priced before you list it" },
    "w2-handmade-free": { cost: "Free", gets: "One free channel picked to share your work" },
    "w2-handmade-cash": { cost: "Free", gets: "A note of when your sales money arrives" },
  };
  WEEK2.forEach((s) => { const when = s.when; GUIDE.push({ ...s, when: (p) => !!p.week2 && when(p) }); });
  const hasWeek2 = (p) => GUIDE.some((s) => s.day > 7 && s.when({ ...p, week2: true }));
  const STEP = Object.fromEntries(GUIDE.map((s) => [s.id, s]));
  // What each plan step costs and what you will have when it is done (facts from the step and its sources).
  const STEP_META = {"d1-legal-us":{"cost":"Free to check; an EIN from the IRS is free","gets":"Notes on the US registrations, licenses and taxes you need"},
    "d1-legal-uk":{"cost":"Free to check on GOV.UK","gets":"A note of whether you must register for Self Assessment"},
    "d1-legal-other":{"cost":"Free to look up","gets":"Notes on your country's business and tax rules"},
    "d1-legal-eu":{"cost":"Free to look up","gets":"Notes on your country's registration, VAT and listing rules"},
    "d1-legal-ca":{"cost":"Free to check","gets":"Notes on registration, the Business Number and Form T2125"},
    "d1-legal-au":{"cost":"An ABN is free","gets":"Notes on the ABN, business names and your tax return"},
    "d1-legal-in":{"cost":"Udyam registration is free","gets":"Notes on Udyam and your income tax return"},
    "d1-legal-ph":{"cost":"₱30 documentary stamp tax to register","gets":"A plan to register with the BIR before your first sale"},
    "d1-legal-ng":{"cost":"Free to check","gets":"Notes on your Tax ID, business name and annual return"},
    "d1-legal-br":{"cost":"Registering as an MEI is free","gets":"Notes on MEI, its revenue limit and income tax"},
    "d1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of who's responsible and where the money goes"},
    "d1-shopify":{"cost":"Free 3-day trial; most plans then $1/month for 3 months","gets":"A Shopify store on the free trial"},
    "d1-etsy":{"cost":"Possible one-time setup fee; listings are $0.20 each","gets":"An Etsy shop, ready for your first listing"},
    "d1-tiktok":{"cost":"No setup fee (US); 6% commission per sale","gets":"A registered TikTok Shop seller account"},
    "d1-ebay":{"cost":"250 free listings a month; 13.6% + $0.30 or $0.40 per order","gets":"An eBay seller account"},
    "d1-amazon":{"cost":"$0.99 per unit sold or $39.99/month, plus referral fees","gets":"An Amazon selling plan chosen for your expected sales"},
    "d1-rules":{"cost":"Free","gets":"Your platform's dropshipping rules, read before you list"},
    "d1-course":{"cost":{"shopify":"About 2 hours of your time","*":"Free to read"},
    "gets":"Your platform's own beginner guide, started or read"},
    "d2-research":{"cost":"Free tools; TikTok Top Products needs a sign-in","gets":"3 to 5 product ideas on a shortlist"},
    "d2-designs":{"cost":"$0 on Canva Free; Pro elements need a licence or upgrade","gets":"3 to 5 designs you own the rights to"},
    "d2-supplier-app":{"cost":"Free with DSers, CJ or Collective; Spocket from $39.99/month","gets":"One supplier app connected to your store"},
    "d2-supplier-mkt":{"cost":"Depends on the supplier you pick","gets":{"ebay":"A wholesale supplier agreement to list their items","amazon":"A written agreement naming you the only seller of record","tiktok":"A supplier with US stock that can deliver in 6 business days","*":"A supplier that meets your marketplace's rules"}},
    "d2-pod-app":{"cost":"No monthly fee to start; you pay production per order","gets":"Printful or Printify connected to where you sell"},
    "d3-vet":{"cost":"Free to check; a sample costs what the supplier charges","gets":"A checked supplier and a delivery time you can promise"},
    "d3-sample":{"cost":"What the supplier charges for a sample order","gets":"A sample on order so you can check quality yourself"},
    "d3-price":{"cost":"Free; uses this app's profit calculator","gets":"A price and your break-even ad cost per order"},
    "d4-build":{"cost":"Free with a free theme and Canva's free plan","gets":"A store with a theme, logo, address and product page"},
    "d4-audit":{"cost":"Free","gets":"A store where contact, refund and delivery info are clear"},
    "d4-list":{"cost":{"etsy":"$0.20 per Etsy listing","ebay":"Free within 250 listings a month; $0.35 each after","tiktok":"6% commission when it sells","amazon":"Your plan's fees, plus a referral fee when it sells","*":"Your platform's listing and sales fees"},
    "gets":"Your first listing, with photos and specs you can back up"},
    "d4-policies":{"cost":"Free; Shopify can generate policy templates","gets":"Refund, privacy, terms and delivery policies on your store"},
    "d4-delivery":{"cost":"Free; uses this app's delivery date tool","gets":"Delivery promises you can keep, and a plan for delays"},
    "d5-payments":{"cost":"Free to set up; 2.9% + 30¢ per US card sale on Basic","gets":"Shopify Payments set up, with payouts to your bank"},
    "d5-test":{"cost":"Free in test mode; labels for test orders are charged","gets":"A tested checkout and a store open to customers"},
    "d5-google":{"cost":"Free app and free listings; ads are billed separately","gets":"Your products submitted to Google's free listings"},
    "d5-check":{"cost":"Free","gets":"A live listing that matches what your supplier can do"},
    "d6-organic":{"cost":"Free to post","gets":"Your first short videos posted, with a link to buy"},
    "d6-ads-learn":{"cost":"Free; about 35 minutes","gets":"The basics of Meta or TikTok ads, before you spend"},
    "d6-ads":{"cost":"Your budget: Meta from $1 a day, TikTok over $20 a day","gets":"One capped test ad, compared with your break-even"},
    "d7-fulfill":{"cost":"The supplier's or print partner's price for each order","gets":"Every new order passed to the supplier the same day"},
    "d7-support":{"cost":"Free","gets":"Every message answered with tracking and an honest date"},
    "d7-review":{"cost":"Free","gets":"The week's profit or loss and one change to try"},
    "af1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of commission, approval and disclosure"},
    "af1-join":{"cost":{"aff_amazon":"Free to join","aff_tiktok":"Free; needs 1,000+ followers","aff_network":"Free to join; Awin asks a small refundable deposit","*":"Free to join"},
    "gets":{"aff_amazon":"An Associates account, reviewed after 3 qualifying sales","aff_tiktok":"Confirmed eligibility for TikTok Shop affiliate","aff_network":"An account with one affiliate network","*":"An account with your affiliate program"}},
    "af1-disclose":{"cost":"Free","gets":"Disclosure wording to put next to every link"},
    "af2-niche":{"cost":"Free","gets":"One niche and 10 products you'd honestly recommend"},
    "af2-channel":{"cost":"Free for a social account; site builders have free plans","gets":"A public site or account of your own to post on"},
    "af3-calc":{"cost":"Free; uses this app's affiliate calculator","gets":"Your earnings per sale and per 100 clicks"},
    "af4-content":{"cost":"Free","gets":"3 pieces of content with the disclosure built in"},
    "af5-links":{"cost":"Free","gets":"Tracked links in your content, each with a disclosure"},
    "af6-post":{"cost":"Free","gets":"Your content published and every comment answered"},
    "af7-review":{"cost":"Free","gets":"Your real conversion rate and a list of what worked"},
    "dg1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of what sells, platform rules and licences"},
    "dg1-platform":{"cost":{"gumroad":"No monthly fee; 10% + 50¢ per direct sale","payhip":"Free plan: 5% per sale, plus PayPal or Stripe fees","*":"Free to start; fees come out of each sale"},
    "gets":"A seller account ready for your first product"},
    "dg1-shopify-app":{"cost":"Free app; your Shopify plan still applies","gets":"The Digital Downloads app installed on your store"},
    "dg1-etsy-rules":{"cost":"Free","gets":"Etsy's digital-item rules checked before you make anything"},
    "dg2-idea":{"cost":"Free","gets":"One product idea that solves a specific problem"},
    "dg3-make":{"cost":"$0 on Canva's Free plan; check every licence","gets":"The finished files, exported in formats buyers expect"},
    "dg4-list":{"cost":{"etsy":"$0.20 per Etsy listing","gumroad":"No monthly fee; 10% + 50¢ per direct sale","payhip":"Free plan: 5% per sale, plus processing","shopify":"Your Shopify plan; the Digital Downloads app is free","*":"Your platform's fees on each sale"},
    "gets":"A listing with clear contents, previews and a price"},
    "dg5-test":{"cost":"Free using your platform's preview","gets":"A download that opens on a phone and a computer"},
    "dg6-promote":{"cost":"Free","gets":"Previews and short videos posted where buyers look"},
    "dg7-review":{"cost":"Free","gets":"One change to test: a preview, title or price"},
    "rs1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of sourcing, sold prices and fees"},
    "rs1-account":{"cost":{"mercari":"No listing fee; 10% selling fee when an item sells","poshmark":"No listing or monthly fees; $2.95 or 20% per sale","*":"No listing fee; a fee when an item sells"},
    "gets":"Your marketplace seller account"},
    "rs2-research":{"cost":"Free","gets":"10 items you could find locally, with sold prices"},
    "rs3-maxbuy":{"cost":"Free; uses this app's max buy price calculator","gets":"A maximum buy price for each item"},
    "rs3-source":{"cost":"What you pay for the items, up to your max buy price","gets":"Your first 5 to 10 items, checked for condition"},
    "rs4-list":{"cost":{"ebay":"Free for your first 250 listings each month","mercari":"No listing fee on Mercari","poshmark":"No listing fee on Poshmark","*":"Depends on the marketplace's listing fees"},
    "gets":"Your items listed with clear photos, sizes and flaws"},
    "rs5-ship":{"cost":"The cost of mailers or boxes and a small scale","gets":"Packaging, a scale and shipping options ready"},
    "rs6-offers":{"cost":"Free","gets":"A lowest price for each item and same-day replies"},
    "rs7-review":{"cost":"Free","gets":"A list of what to reprice and what to buy more of"},
    "fr1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of platform fees, pay timing and rates"},
    "fr1-account":{"cost":{"fiverr":"Fiverr keeps 20% of every order, tips included","upwork":"Free to join; 0–15% per contract; extra Connects $0.15","direct":"No platform fee; card processing (Stripe 2.9% + 30¢)","*":"Depends on the platform's fees"},
    "gets":{"fiverr":"A Fiverr seller profile, ready for your first gig","upwork":"An Upwork profile, ready to send proposals","direct":"A work page, an agreement template and a way to get paid","*":"A profile clients can find and pay you through"}},
    "fr2-offer":{"cost":"Free","gets":"One service packaged with scope, revisions and timing"},
    "fr2-rate":{"cost":"Free; uses this app's freelance rate calculator","gets":"A rate that covers fees, tax and unpaid hours"},
    "fr3-portfolio":{"cost":"Free","gets":"3 portfolio samples with a one-line summary each"},
    "fr4-profile":{"cost":"Free to write; fees come out of what clients pay","gets":"Your offer published, with samples, outcome and price"},
    "fr5-outreach":{"cost":{"upwork":"Connects per proposal (varies by job); extras $0.15 each","*":"Free"},
    "gets":"Your first pitches sent to possible clients"},
    "fr6-deliver":{"cost":"Free","gets":"Work delivered on time and a review requested"},
    "fr7-review":{"cost":"Free","gets":"Your real hourly rate and a decision on pricing"},
    "cr1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of payouts, sponsorships and their rules"},
    "cr1-program":{"cost":"Free; the programs are free to apply to","gets":"The thresholds you need to reach before you apply"},
    "cr2-niche":{"cost":"Free","gets":"One topic and one format you can repeat weekly"},
    "cr3-batch":{"cost":"Free","gets":"5 videos planned and filmed in one session"},
    "cr4-post":{"cost":"Free","gets":"A posting schedule you can keep for months"},
    "cr5-deals":{"cost":"Free","gets":"Disclosure wording for sponsorships and affiliate links"},
    "cr6-income":{"cost":"Free; uses this app's creator income calculator","gets":"A map of the income sources you could add"},
    "cr7-review":{"cost":"Free","gets":"Your best videos found, and what to make next"},
    "co1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of platform costs and checking demand"},
    "co1-platform":{"cost":{"teachable":"7-day free trial; then from $29/month billed yearly","thinkific":"30-day free trial; then Basic $40/month billed yearly","payhip":"Free plan: 5% per sale, plus processing","*":"Depends on the course platform's plan"},
    "gets":"Your course platform set up on a trial or free plan"},
    "co2-validate":{"cost":"Free","gets":"A course promise tested with 10 people or a waitlist"},
    "co3-outline":{"cost":"Free","gets":"An outline of 5 to 10 short lessons"},
    "co4-record":{"cost":"Free with OBS or DaVinci Resolve's free version","gets":"The first module recorded, with captions"},
    "co5-sales":{"cost":"Free; uses this app's price calculator","gets":"A sales page and a price that covers platform fees"},
    "co6-launch":{"cost":"Free","gets":"Enrolment open to a small first group"},
    "co7-review":{"cost":"Free","gets":"A short list of fixes for the sales page and lessons"},
    "bk1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of royalties, printing costs and KDP rules"},
    "bk1-account":{"cost":"Free to publish on KDP","gets":"A KDP account and the royalty option that fits your price"},
    "bk1-rules":{"cost":"Free","gets":"A clear idea of the AI use you must disclose"},
    "bk2-idea":{"cost":"Free","gets":"A topic and one sentence on who the book is for"},
    "bk3-write":{"cost":"Free","gets":"A chapter outline and a first chapter"},
    "bk4-cover":{"cost":"Free with KDP's Cover Creator and Kindle Create","gets":"A cover plan and paperback specs that set printing cost"},
    "bk5-price":{"cost":"Free; uses this app's royalty calculator","gets":"eBook and paperback prices with royalty per copy"},
    "bk6-launch":{"cost":"Free","gets":"A book description and a launch message to first readers"},
    "bk7-review":{"cost":"Free","gets":"Next week's writing target and a plan for the next book"},
    "nl1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of subscriptions, sponsors and email rules"},
    "nl1-platform":{"cost":{"substack":"Free; 10% of paid subscriptions, plus Stripe fees","beehiiv":"Free up to 2,500 subscribers; no card needed","*":"Free plan available"},
    "gets":"Your newsletter set up on a free plan"},
    "nl1-email":{"cost":"Free","gets":"The email rules you'll follow: address, opt-out, disclosure"},
    "nl2-topic":{"cost":"Free","gets":"A one-sentence promise and a schedule you can keep"},
    "nl3-issues":{"cost":"Free","gets":"3 issues written and ready before launch"},
    "nl4-signup":{"cost":"Free on Substack or beehiiv's free plan","gets":"A sign-up page that says what readers get and how often"},
    "nl5-promote":{"cost":"Free","gets":"Social posts with a subscribe link, and swap requests"},
    "nl6-money":{"cost":"Free; uses this app's subscription income calculator","gets":"An estimate of paid-subscription income after fees"},
    "nl7-review":{"cost":"Free","gets":"A note of which posts and issues worked best"},
    "fb1-how":{"cost":"Free; a 5-minute lesson in this app","gets":"An overview of FBA fees, storage and stock costs"},
    "fb1-account":{"cost":"$39.99 a month plus selling fees","gets":"A Professional seller account with identity verified"},
    "fb2-research":{"cost":"Free; Jungle Scout and Helium 10 are paid options","gets":"Product ideas you could improve and brand"},
    "fb3-fees":{"cost":"Free; uses Amazon's fee estimator and the profit calculator","gets":"A full fee estimate per unit before you buy stock"},
    "fb3-supplier":{"cost":"Depends on each manufacturer's sample price","gets":"Quotes and samples from at least 3 manufacturers"},
    "fb4-brand":{"cost":"Brand Registry is free; it needs a trademark or application","gets":"A brand plan and what Brand Registry needs from you"},
    "fb5-listing":{"cost":"Free","gets":"A draft listing and images that answer buyers' questions"},
    "fb6-ship":{"cost":"Free to plan; the shipment has an inbound placement fee","gets":"A plan to label, pack and send stock to Amazon"},
    "fb7-review":{"cost":"Free","gets":"Profit per unit re-checked with real quotes and fees"},
    "hm1-how":{"cost":"Free; a 4-minute lesson in this app","gets":"An overview of pricing your time, rules and safety"},
    "hm1-rules":{"cost":"Free","gets":"Etsy's handmade rules checked against your items"},
    "hm1-safety":{"cost":"Free to check; lab testing, if needed, is a separate cost","gets":"The certificates and lab tests your products need"},
    "hm2-product":{"cost":"Free","gets":"1 to 3 products you can make consistently well"},
    "hm3-price":{"cost":"Free; uses this app's price calculator","gets":"A price per item covering materials, time and fees"},
    "hm4-photos":{"cost":"Free with a phone camera and daylight","gets":"Your own photos of each finished item"},
    "hm5-list":{"cost":"$0.20 per listing on Etsy; your plan on Shopify","gets":"Your first listings with materials, size, care and timing"},
    "hm6-promote":{"cost":"Free","gets":"Process videos posted with a link to your shop"},
    "hm7-review":{"cost":"Free","gets":"A decision on whether to raise prices or simplify"},
    "on-orders":{"cost":"Postage, supplier or production costs for each order","gets":"Every new order sent out, with tracking confirmed"},
    "on-inbox":{"cost":"Free","gets":"Every message answered; late orders get a delay notice"},
    "on-post":{"cost":"Free","gets":"One disclosed post published each day"},
    "on-list":{"cost":{"ebay":"Free within 250 listings a month; $0.35 each after","mercari":"No listing fee on Mercari","poshmark":"No listing fee on Poshmark","*":"Depends on the marketplace's listing fees"},
    "gets":"3 new items listed a day, priced from sold listings"},
    "on-pitch":{"cost":{"upwork":"Connects for Upwork proposals; extras $0.15 each","*":"Free"},
    "gets":"Same-day replies to clients and new pitches sent"},
    "on-create":{"cost":"Free","gets":"Steady daily progress on the schedule you chose"},
    "on-make":{"cost":"Free, apart from materials or any listing fee","gets":"One new or improved product each week"},
    "on-week":{"cost":"Free; uses this app's calculators","gets":"This week's real income, costs and profit"},
    "on-supplier":{"cost":"Free","gets":"Prices and delivery times that match your supplier"}};
  STEP_META["d2-tax"] = { cost: "Free to check", gets: "Whether you need to collect sales tax or VAT yet" };
  STEP_META["d1-scams"] = { cost: "Free; a 3-minute lesson in this app", gets: "The warning signs of a money-making scam" };
  function metaOf(id, p) {
    const m = STEP_META[id]; if (!m) return null;
    const pick = (v) => (v && typeof v === "object" ? v[p && p.channel] || v["*"] || "" : v || "");
    return { cost: pick(m.cost), gets: pick(m.gets) };
  }
  function stepFacts(id, p, cls) {
    const m = metaOf(id, p); if (!m || (!m.cost && !m.gets)) return null;
    const box = el("dl", "step-meta" + (cls ? " " + cls : ""));
    if (m.gets) box.append(el("dt", null, "You'll have"), el("dd", null, m.gets));
    if (m.cost) box.append(el("dt", null, "Cost"), el("dd", null, m.cost));
    return box;
  }
  const val = (v, p) => (typeof v === "function" ? v(p) : v);

  // ---------------------------------------------------------------------------
  // Lessons and courses
  // ---------------------------------------------------------------------------
  // What's realistic: published figures on income, waiting times and start-up
  // costs, per model. Every line has a source; nothing here is an estimate.
  const BANKRATE_LINE = "In Bankrate's 2025 survey of US adults, the typical (median) side hustle brought in <b>$200 a month</b>. The average was $885, pulled up by a small group of high earners.";
  const ETSY_SIZE = "Etsy is big and crowded: at the end of 2025 it had 5.6 million active sellers and 86.5 million active buyers (Etsy counts a seller as active after any sale or fee in 12 months).";
  const REALISTIC = {
    supplier: { items: [
      "“Done-for-you” stores mostly fail. In its 2025 case against Click Profit, the FTC said more than a fifth of the stores it sold earned nothing after Amazon's fees, another third made under $2,500 in lifetime sales, and Amazon blocked, suspended or ended about 95% of them. These are the FTC's allegations.",
      BANKRATE_LINE,
      "You pay the supplier when you place each order, but platform money arrives later: Shopify usually pays in 3–5 business days in the US (longer for new stores); TikTok Shop US starts new sellers on a 31-day settlement period counted from delivery; eBay holds for new sellers are usually resolved within 30 days; Amazon settles about every two weeks and typically holds each order's money for 7 days after delivery.",
      "<b>Money to start</b>: Shopify's 3-day trial, then most plans are $1 a month for 3 months, then Basic is $39 a month ($29 billed yearly). DSers has a free plan and the CJdropshipping app is free. TikTok Shop US has no setup fee; eBay's first 250 listings a month have no insertion fee; Amazon is $0.99 per item sold or $39.99 a month. Add the cost of a sample order.",
    ], src: ["ftcClickProfit", "bankrate", "bankratePR", "shopPayouts", "ttsSettle", "ebayHolds", "amzPayments", "shopPricing", "shopTrial", "dsers", "cj", "ttsHome", "ebayFees", "amzPricing"] },
    pod: { items: [
      ETSY_SIZE,
      "Printing comes before shipping. Printful says fulfilment takes 2–5 business days on average for most products, and knitwear 7–12, longer in November and December.",
      "New Etsy sellers wait for money: funds are generally available 14 days after a sale, and a reserve can hold part of each physical-item sale, usually for no more than 90 days.",
      "Etsy Offsite Ads: if a sale comes from one, Etsy charges 15% of the order total (up to $100) on top of other fees. You can opt out while your shop has never made $10,000 in a 365-day period.",
      "<b>Money to start</b>: Printful has no monthly fee and Printify has a free plan; you pay production per order. Etsy charges $0.20 per listing, plus a one-time setup fee in some places (shown during setup, non-refundable). Canva Free costs nothing.",
    ], src: ["etsy10k", "printfulTime", "etsyDeposit", "etsyReserve", "etsyOffsite", "printful", "printify", "etsyFees", "canva"] },
    affiliate: { items: [
      "Amazon gives you 180 days after applying to refer 3 qualifying sales. Your account is reviewed after that, and the application can be withdrawn if the sales don't happen.",
      "You earn on items a shopper adds to their cart within 24 hours of clicking your link, if the order is placed within 89 days of that click.",
      "Payment is slow and has minimums: Amazon pays about 60 days after the end of the month, once you're owed at least $10 by direct deposit or gift card ($100 by cheque, with a $15 fee). Awin pays twice a month once you reach its threshold ($20 for US-dollar accounts). CJ's own article gives $50 by direct deposit or $100 by cheque.",
      BANKRATE_LINE,
      "<b>Money to start</b>: Amazon Associates, impact.com and CJ are free to join. Awin takes a small refundable deposit when you sign up.",
    ], src: ["amzAssoc180", "amzAssocPart", "amzAssocWindow", "amzAssocAgree", "amzAssocPay", "awinPay", "cjPay", "bankrate", "amzAssoc", "impact", "cjAff", "awinJoin"] },
    digital: { items: [
      ETSY_SIZE,
      "Gumroad pays out once your balance reaches $100 (more in some countries), and on weekly, monthly or quarterly schedules each sale is held at least 7 days.",
      "Gumroad's Discover marketplace isn't instant: your account needs payout settings and a minimum balance from real sales, then a risk review that Gumroad says takes about 3 weeks on average. Discover sales cost 30%.",
      "Etsy doesn't hold digital sales in a reserve, but new sellers' funds are generally available 14 days after a sale. On Payhip, your first PayPal payment goes through an approval that can delay it.",
      "<b>Money to start</b>: Gumroad has no monthly fee (10% + 50¢ per direct sale plus processing). Payhip's free plan takes 5% per sale plus processing. Etsy is $0.20 per listing plus any setup fee. Canva Free costs nothing.",
    ], src: ["etsy10k", "gumroadPay", "gumroadDiscover", "gumroadFees", "etsyReserve", "etsyDeposit", "payhipPaypal", "payhip", "etsyFees", "canva"] },
    resell: { items: [
      "New eBay accounts have selling limits: a set number of items and a set total value each month. eBay reviews them monthly and you can ask for more; a Store subscription doesn't raise them. Seller Hub shows yours.",
      "eBay can hold money for new or infrequent sellers, usually for up to 30 days. Shipping on the day of payment, with tracking, helps.",
      "Mercari releases funds when the buyer rates the order, or 72 hours after delivery. Direct deposit is free but can take up to 5 business days; Instant Pay costs $3. Poshmark releases earnings within 3 days of delivery, then direct deposit takes 2–3 business days.",
      "<b>Money to start</b>: eBay's first 250 listings a month have no insertion fee; Mercari and Poshmark have no listing fees. You pay for the items you buy and for shipping supplies, and you choose how much.",
    ], src: ["ebayLimits", "ebayHolds", "mercariPaid", "poshPaid", "ebayFees", "mercariFees", "poshFees"] },
    freelance: { items: [
      "Fiverr keeps 20% of every order, and your earnings become available 14 days after an order is completed (7 days for Top Rated, Pro and Seller Plus).",
      "New Fiverr sellers can have up to 4 active Gigs. Level 1 needs 5 completed orders, 3 different clients, $400 earned, a 4.4+ rating, an 80% response rate and a Success Score of 5 or more.",
      "Upwork pays hourly work 10 days after the weekly billing period ends. For fixed-price work the client has up to 14 days to review, then there's a 5-day security hold.",
      BANKRATE_LINE,
      "<b>Money to start</b>: Fiverr and Upwork are free to join. Upwork proposals cost Connects; extra Connects are $0.15 each (10 minimum). Creating a Fiverr Gig needs a computer browser.",
    ], src: ["fiverrHow", "fiverrOrders", "fiverrLevels", "upworkHourly", "upworkFixed", "bankrate", "fiverrAccount", "upworkFree", "upworkConnects"] },
    creator: { items: [
      "YouTube's ad-revenue tier needs 1,000 subscribers plus 4,000 watch hours in 12 months or 10 million Shorts views in 90 days. From 1 February 2027, new applicants need 8,000 watch hours in 365 days or 20 million Shorts views in 90 days. Channels already in the program aren't affected.",
      "Approval takes time: YouTube says a review typically takes about a month. If you're turned down, you can reapply 30 days later.",
      "TikTok Creator Rewards needs 10,000 followers and 100,000 views in the last 30 days. Only original videos at least 1 minute long can earn, and US payouts happen monthly once you pass $50.",
      "Most part-time creators earn little: Linktree's 2022 Creator Report found 68% made under $1,000 a year. Linktree sells creator tools, so treat this as vendor data.",
      "Twitch Affiliate needs 25 followers, 4 hours streamed on 4 different days and an average of 3 viewers at once on 4 days, within 30 days. Twitch then pays about 15 days after each month ends, once you're owed $50 ($100 by wire).",
      "YouTube Live: 16+ to stream and 50 subscribers to stream from a phone. Super Chat needs the Partner Program and age 18+, and you keep 70% after sales tax and App Store fees.",
    ], src: ["ytYpp", "ytYppChanges", "ytRejected", "ttRewards", "ttRewardsTerms", "linktreeReport", "twitchAffJoin", "twitchPaid", "ytLiveMobile", "ytLiveRestrict", "ytSuperElig", "ytSuperManage"] },
    courses: { items: [
      "Teachable has no free plan. After a 7-day trial, Starter is $39 a month ($29 billed yearly) plus a 7.5% transaction fee; Builder ($89, or $69 yearly) and Growth ($189, or $139 yearly) have no transaction fee with Teachable Payments.",
      "Teachable can hold part of a sale for a while (its example: a purchase on 1 January unlocks on 15 January), and holds payouts at $500 until you file a tax form. Thinkific's first payout arrives 7–14 days after your first payment.",
      "The FTC lists guaranteed income, big returns and a “proven system” as signs of a scam. Your course mustn't promise them either.",
      BANKRATE_LINE,
      "<b>Money to start</b>: Teachable from $29 a month billed yearly after the trial. Thinkific has a 30-day trial, then Basic is $54 a month or $40 billed yearly. Payhip's free plan takes 5% per sale.",
    ], src: ["teachable", "teachablePayouts", "thinkificPayouts", "ftcScam", "bankrate", "thinkific", "thinkificFaq", "payhip"] },
    books: { items: [
      "Royalties are per copy: eBooks earn 35% or 70% (70% needs a list price of $2.99–$12.99 on Amazon.com, minus a delivery cost); paperbacks earn 60% at $9.99 and up, minus printing.",
      "Amazon pays about 60 days after the end of the month. Direct deposit has no minimum; wire transfers need $100.",
      "From 21 September 2026, an account can create up to 2 new titles per format (eBook, paperback, hardcover) each week. The count resets on Sunday at 00:00 UTC.",
      BANKRATE_LINE,
      "<b>Money to start</b>: publishing is free. For paperbacks, the printing cost comes out of your royalty.",
    ], src: ["kdpEbook", "kdpPaper", "kdpThresholds", "kdpLimit", "kdpCreate", "bankrate", "kdpPrint"] },
    newsletter: { items: [
      "Substack's lowest paid price is $5 a month and $30 a year (US-dollar accounts). You can't offer yearly only, and a price change applies to new subscribers only.",
      "Substack keeps 10% of paid subscriptions, and Stripe's processing fee comes on top.",
      "beehiiv's Ad Network is only on paid plans, so it isn't on the Free plan (up to 2,500 subscribers).",
      BANKRATE_LINE,
      "<b>Money to start</b>: Substack is free to publish; beehiiv's Free plan covers up to 2,500 subscribers with no card needed.",
    ], src: ["substackPaid", "substackCost", "beehiivAds", "beehiivPlans", "bankrate"] },
    fba: { items: [
      "“We run your Amazon store” schemes keep getting shut down. The FTC alleged people lost at least $15.9 million to FBA Machine/Passive Scaling, whose operator was banned in July 2025, and said Amazon blocked, suspended or ended about 95% of Click Profit's stores.",
      "Cash comes back slowly: Amazon settles about every two weeks and typically holds each order's money for 7 days after delivery, then a bank transfer can take up to 5 business days.",
      "Sponsored Products ads only show while your item is in stock, and the daily budget isn't spread through the day, so a small budget can go in minutes.",
      "<b>Money to start</b>: the Professional plan is $39.99 a month, plus your stock and samples, plus FBA fees for fulfilment, monthly storage and inbound placement. Brand Registry is free but needs a registered or pending trademark.",
    ], src: ["ftcFbaMachine", "ftcFbaMachineBan", "ftcClickProfit", "amzPayments", "amzSP", "amzAdsFaq", "amzPricing", "fbaGuide", "brandRegistry"] },
    handmade: { items: [
      ETSY_SIZE,
      "New Etsy sellers wait for money: funds are generally available 14 days after a sale, and a reserve can hold part of each sale.",
      "Etsy Offsite Ads cost 15% of the order total (up to $100) on sales they bring in. You can opt out while your shop has never made $10,000 in a 365-day period.",
      BANKRATE_LINE,
      "<b>Money to start</b>: Etsy charges $0.20 per listing, plus a one-time setup fee in some places (shown during setup, non-refundable). Shopify's trial, then $1 a month for 3 months, then Basic at $39 a month. Plus your materials. In the US, children's products need third-party lab testing.",
    ], src: ["etsy10k", "etsyDeposit", "etsyReserve", "etsyOffsite", "bankrate", "etsyFees", "shopPricing", "shopTrial", "cpscCpc"] },
    stock: { items: [
      "Adobe Stock pays 33% of the net price for photos, vectors and illustrations, and 35% for video. Adobe's own example: a $29.99 plan covering 10 photos pays about $0.99 per photo.",
      "Shutterstock pays 15% to 40% per download, at least $0.10, by level; everyone restarts at level 1 on 1 January. Level 2 starts at 101 image downloads in the year.",
      "Canva pays Creators from a monthly royalty pool it keeps confidential, so there's no official rate per use. Canva isn't taking new Element Creator applications.",
      "Payouts: Adobe from $25 and 45 days after your first sale; Shutterstock monthly from a minimum you set ($25 or more); Canva from US$10 (US$25 by wire).",
      "None of the three publishes typical earnings, and acceptance doesn't guarantee sales.",
    ], src: ["adobeStockRoyalty", "adobeStockRoyaltyEx", "ssLevels", "ssPayouts", "canvaCreators", "canvaCreatorsHelp", "adobeStockPayout", "ssPaySettings", "canvaCreatorsPay"] },
    declutter: { items: [
      "No stock to buy: your costs are platform fees, plus packaging and postage if you post items. OfferUp charges nothing on in-person sales, and Vinted charges sellers nothing.",
      "Depop charges US and UK sellers payment processing only: 3.3% + $0.45 (US) or 2.9% + £0.30 (UK). eBay UK private sellers pay no final value fee outside motors.",
      "eBay US charges 13.6% + $0.30/$0.40 per order in most categories. Meta's Seller Protection Policy lists 10% (minimum $0.80) for US shipped sales, though other Meta pages differ, and Meta starts payment 5 days after delivery is confirmed.",
      "Vinted pays into your balance when an order completes (the buyer confirms, or 2 days after delivery), and bank withdrawals take up to 5 business days.",
      "In the US, a personal item sold for less than you paid isn't taxable income, even with a Form 1099-K. In the UK, personal possessions usually aren't taxed unless one sells for over £6,000.",
    ], src: ["offerupFree", "vintedFree", "depopFees", "ebayUKPrivate", "ebayFees", "fbmSellerPolicy", "vintedPaid", "vintedWithdraw", "irs1099kCommon", "hmrcOnline"] },
    salesjob: { items: [
      "For wholesale and manufacturing sales representatives, the US Bureau of Labor Statistics says most employers pay salary plus commission, or salary plus bonuses. Commission is usually a percentage of sales.",
      "US employees covered by federal law must get at least $7.25 an hour, or the state's higher minimum. Selling by phone or internet from a base isn't “outside sales”, the exemption that removes minimum wage.",
      "UK workers paid by commission must still get at least the National Minimum Wage for their hours. Genuinely self-employed people aren't entitled to it.",
      "The FTC says honest employers never ask you to pay to get a job, and give you time to consider an offer.",
    ], src: ["blsSalesRep", "dolMinWage", "dolStateMin", "dolOutside", "ukNmwWho", "ukNmwCalc", "hmrcNmwTime", "ftcJobScams"] },
    tutor: { items: [
      "Preply keeps 100% of each new student's trial lesson, then 33% of your rate at first, falling to 18% after 400 hours taught.",
      "italki takes no commission on trial lessons, and 15% to 21% on other lessons (30% on group classes). You can withdraw once you have $30.",
      "Cambly pays $0.17 a minute ($10.20 an hour), or $0.20 on Cambly Kids, weekly once you're owed $20. It doesn't guarantee any number of students.",
      "Wyzant keeps 25% and pays on the 1st and 15th of each month. Outschool keeps 30% and asks for your share back if a family is refunded after you're paid.",
      "Being accepted isn't automatic: Preply may turn down low-demand subjects, italki closes languages when it has enough teachers, and Cambly is limiting new tutors.",
    ], src: ["preplyCommission", "italkiCommission", "italkiWithdraw", "camblyTutors", "camblyAddendum", "wyzantFee", "wyzantSchedule", "outschoolAddendum", "outschoolRefunds", "preplyRegister", "italkiOpen"] },
    clipping: { items: [
      "On Content Rewards you're paid only for verified views on clips the brand approves, at the rate each campaign sets. A campaign can cap what one clip earns, set a minimum before it pays, and stops paying when its budget runs out.",
      "Money arrives after checks: on per-1,000-views campaigns, views earn for 7 days and then there's a 3-day hold, so a payout settles about 10 days after approval. Withdrawing needs identity checks, and some methods charge a fee.",
      "Platform payouts rarely add to this. YouTube doesn't share Shorts revenue on unedited clips or reuploads of others' content, even with permission, and TikTok Creator Rewards doesn't count content copied with slight changes.",
      "As a hired clip editor on Fiverr, Fiverr keeps 20% and releases earnings 14 days after an order is completed (7 days for higher levels). Upwork's fee is 0% to 15% per contract.",
      BANKRATE_LINE,
      "<b>Money to start</b>: CapCut has a free plan and YouTube Studio is free. You must be 18 for Content Rewards and to sell on Upwork.",
    ], src: ["whopCrDocs", "whopCrTerms", "whopCrBrandTerms", "whopPayouts", "whopFees", "ytShortsMon", "ytReused", "ttRewards", "fiverrHow", "fiverrOrders", "upworkFee", "bankrate", "upworkEligible"] },
    ugc: { items: [
      "Billo shows a fixed payout on each job before you apply, and you can't negotiate it. Approved videos are paid by PayPal twice a month. Only people 18 and over in the US, Canada and the UK can join.",
      "Billo's Premium level needs 14 brand-approved videos, at least 5 rated with an average of 4.8 or more, and 90%+ on-time delivery.",
      "On Insense, money is released only after the brand approves your content. PayPal withdrawals take up to 3 working days and bank transfers up to 5.",
      "TikTok One usually needs 1,000+ followers and age 18+. Base pay is earned when TikTok One approves your content; revenue-share pay only when it runs as an ad.",
      "Amazon Influencer videos are reviewed first (typically 2 business days), and onsite commission needs its own sign-up. Associates pays about 60 days after the month ends, from $10.",
      BANKRATE_LINE,
      "<b>Money to start</b>: Billo brands ship products to you at no cost. For samples, use products you already own.",
    ], src: ["billoStart", "billoPaid", "billoFaq", "billoPremium", "insensePay", "insenseTerms", "ttOneSignup", "ttOneTerms", "amzInfUpload", "amzInfFaq", "amzAssocPay", "bankrate"] },
  };
  Object.assign(STEP_META, WEEK2_META);
  Object.assign(STEP_META, {
  "cl1-how": { cost: "Free; a 4-minute lesson in this app", gets: "How clippers get paid and what's allowed" },
  "cl1-permission": { cost: "Free to read", gets: "Whose content you may clip, and the risks if you don't ask" },
  "cl1-whop": { cost: "Free to check; 18+ only", gets: "Accounts connected and ready to submit clips" },
  "cl1-hire": { cost: { fiverr: "Fiverr keeps 20% of each order", upwork: "0–15% per contract on Upwork", "*": "Fiverr 20%, Upwork 0–15%, or no fee direct" }, gets: "Where you'll find creators to edit for" },
  "cl2-payouts": { cost: "Free to read", gets: "Why the campaign or creator pays you, not the platform" },
  "cl2-campaign": { cost: "Free", gets: "1 or 2 campaigns whose rules you understand" },
  "cl2-creators": { cost: "Free", gets: "A list of 10 creators to approach" },
  "cl3-tools": { cost: "Free tools; CapCut has paid extras", gets: "A working setup for making vertical clips" },
  "cl4-clips": { cost: "Your time", gets: "3 clips ready to submit or show" },
  "cl5-disclose": { cost: "Free", gets: "Paid clips labelled the way the FTC and platforms expect" },
  "cl5-submit": { cost: "Free", gets: "Your first clips submitted for review" },
  "cl5-pitch": { cost: "Free", gets: "5 to 10 creators contacted with a sample" },
  "cl6-agree": { cost: "Free", gets: "Written terms and safe access to the creator's channel" },
  "cl6-payout": { cost: "Some withdrawal methods charge a fee", gets: "Withdrawals set up and payout timing known" },
  "cl7-review": { cost: "Free", gets: "What to make more of next week" },
  "on-clip": { cost: "Your time", gets: "New clips every day" },
  "on-clip-check": { cost: "Free", gets: "Accounts kept clear of claims and strikes" },
  "u1-how": { cost: "Free; a 4-minute lesson in this app", gets: "How UGC work pays and who owns the videos" },
  "u1-elig": { cost: "Free to check", gets: "Whether you qualify, and how to join" },
  "u2-rights": { cost: "Free to read", gets: "Who can use your videos, where and for how long" },
  "u2-honest": { cost: "Free to read", gets: "The honesty and disclosure rules for product videos" },
  "u2-ads": { cost: "Free", gets: "Notes on what current ads in your category do" },
  "u3-samples": { cost: "Your time; products you already own", gets: "3 sample videos for your portfolio" },
  "u4-profile": { cost: "Free", gets: "A profile or page brands can hire you from" },
  "u5-apply": { cost: "Free", gets: "Your first applications, uploads or pitches sent" },
  "u6-deliver": { cost: "Your time", gets: "Work delivered to the brief and on time" },
  "u6-paid": { cost: { ugc_direct: "Stripe: 2.9% + 30¢ per US card payment", "*": "Free to set up" }, gets: "A way for the money to reach you" },
  "u7-review": { cost: "Free", gets: "Your real pay per hour, and what to change" },
  "on-ugc-apply": { cost: "Your time", gets: "A steady flow of applications" },
  "on-ugc-sample": { cost: "Your time", gets: "A portfolio that keeps improving" },
  "lv1-rules": { cost: "Free to read", gets: "The thresholds and age rules for getting paid" },
  "lv1-setup": { cost: "Free", gets: "An account that's ready to stream and be paid" },
  "lv2-copyright": { cost: "Free to read", gets: "The music and copyright rules that cause strikes" },
  "lv3-gear": { cost: "OBS Studio is free", gets: "Streaming software set up and tested" },
  "lv4-schedule": { cost: "Free", gets: "A streaming schedule you can keep" },
  "lv5-first": { cost: "Your time", gets: "Your first live stream done" },
  "lv6-clips": { cost: "Free", gets: "Short clips from your stream" },
  "lv7-money": { cost: { twitch: "Payout from $50; processor fee per payout", "*": "Free to read" }, gets: "How and when the platform would pay you" },
  "lv7-review": { cost: "Free", gets: "One change to test next week" },
  "on-live": { cost: "Your time", gets: "Streams on a steady schedule" },
  });
  const realisticBody = (p) => { const r = REALISTIC[p && p.model]; return r ? ul(r.items) : ""; };
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
        "<b>Gumroad</b>: 10% + 50¢ per direct sale plus card or PayPal processing; a flat 30%, processing included, for sales through its Discover marketplace.",
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
        "<b>YouTube Partner Program</b>: from 500 subscribers (with 3 recent uploads and 3,000 watch hours or 3 million Shorts views) for fan funding and Shopping; from 1,000 subscribers (with 4,000 watch hours or 10 million Shorts views) for ad revenue. From February 1, 2027, new applicants need 8,000 watch hours or 20 million Shorts views for ad revenue, and Shorts ad earnings need 10 million Shorts views every 90 days. YouTube shares 55% of ad revenue on long videos and 45% on Shorts.",
        "<b>TikTok Creator Rewards</b>: 10,000 followers and 100,000 views in 30 days, 18+, original videos at least 1 minute long. Paid monthly once you pass $50 (US).",
        "<b>Sponsorships</b>: brands pay for a mention or video. You must disclose them clearly, in the video itself.",
        "<b>Affiliate links and your own products</b>: often steadier than platform payouts.",
      ]) + "<p>Meeting a threshold starts a review; it doesn't guarantee approval or income.</p>" + checked,
      src: ["ytYpp", "ytBlog", "ytYppChanges", "ttRewards", "ttRewardsTerms", "ftcInfluencer"] },
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
    { id: "stock", title: "How selling stock photos, videos and templates works and what's allowed", mins: 5, fit: (p) => p.model === "stock",
      body: () => "<p>You upload photos, video clips or designs to a stock site. Buyers pay the site for a licence to use them, and the site pays you a share of each sale. You don't set the price.</p>" + ul([
        "<b>Adobe Stock</b>: 33% of the net price for photos, vectors and illustrations, 35% for video. Payout from $25, at least 45 days after your first sale. AI work must be labelled.",
        "<b>Shutterstock</b>: 15% to 40% per download, depending on your level; everyone restarts at level 1 on 1 January. At least $0.10 per download. No AI-generated uploads.",
        "<b>Canva Creators</b>: you apply with a portfolio. Canva pays monthly from a royalty pool shared by how often your designs are used. No AI-generated content.",
        "<b>Releases</b>: anyone identifiable needs a signed model release; recognisable private property, artwork and distinctive products need a property release.",
        "<b>Logos and brands</b>: remove them from the file, the title and the keywords. Some products can't be accepted even without a logo.",
        "<b>Keywords</b>: Adobe allows up to 49 and weighs the first 10 most; Shutterstock asks for 7 to 50, in English.",
        "<b>Age</b>: all three require you to be 18 or older.",
      ]) + "<p>Earnings per download are small and vary with what each buyer paid. Acceptance doesn't guarantee sales.</p>" + checked,
      src: ["adobeStockRoyalty", "adobeStockPayout", "adobeStockAI", "ssLevels", "ssAI", "canvaCreators", "canvaContribAgree", "adobeStockModel", "adobeStockIP", "ssTrademark", "adobeStockKeywords", "ssKeywords", "adobeStockGuidelines", "ssAge"] },
    { id: "declutter", title: "How selling your own things works and what's allowed", mins: 4, fit: (p) => p.model === "declutter",
      body: () => "<p>You sell things you already own and no longer need. There's no stock to buy, so your costs are platform fees and, if you post items, packaging and postage.</p>" + ul([
        "<b>Facebook Marketplace</b>: local pickup, or shipping with checkout in the US (Meta's Seller Protection Policy lists 10% per shipped sale, minimum $0.80; other Meta pages differ). Services, digital products and rentals aren't allowed.",
        "<b>OfferUp</b>: local pickup only since September 2025. No fees on in-person sales; most items post free up to monthly limits.",
        "<b>Vinted</b>: no seller fees; buyers pay a Buyer Protection fee. You must be 18 or older.",
        "<b>Depop</b>: no selling fee for US and UK sellers; payment processing is 3.3% + $0.45 (US) or 2.9% + £0.30 (UK).",
        "<b>eBay</b>: 18 or older. US: 13.6% + $0.30/$0.40 per order in most categories. UK private sellers: no final value fee except motors.",
        "<b>Safety</b>: meet in busy public places, get paid before you hand anything over, never refund an overpayment, and never share a verification code.",
        "<b>Tax</b>: selling your own things at a loss usually isn't taxed in the US or UK. Buying things to resell is different: it can be a business.",
      ]) + checked,
      src: ["fbmSellerPolicy", "fbmCommerce", "offerupShipEnd", "offerupFree", "vintedFree", "vintedAge", "depopFees", "ebayUnderage", "ebayFees", "ebayUKPrivate", "offerupSafety", "ftcSelling", "irs1099kCommon", "hmrcOnline"] },
    { id: "salesjob", title: "How remote sales jobs work and what's allowed", mins: 4, fit: (p) => p.model === "salesjob",
      body: () => "<p>You work for a company, selling its products or services by phone, video or online. It's a job, not your own business: there's no stock to buy and no platform fee. Common job titles include sales development representative (SDR), appointment setter, inside sales and customer success.</p>" + ul([
        "<b>Pay</b>: many sales jobs pay a salary plus commission, usually a percentage of what you sell. With commission-only pay, weeks without sales pay nothing.",
        "<b>Employee or contractor (US)</b>: the IRS decides from how the work really happens, not the job title. Covered employees are owed at least $7.25 an hour, or their state's higher rate.",
        "<b>UK</b>: workers on commission must still get at least the National Minimum Wage for their hours. The genuinely self-employed aren't covered.",
        "<b>Scams</b>: real employers never charge you to get hired. Fake checks, paid “training”, reshipping packages and job offers by text are all scams.",
        "<b>Courses</b>: the FTC says a program promising guaranteed income or a “proven system” to make money is likely a scam.",
      ]),
      src: ["blsSalesRep", "irsWorker", "dolMinWage", "dolOutside", "ukNmwWho", "ukNmwCalc", "ftcJobScams", "ftcReship", "ftcJobText", "ftcScam"] },
    { id: "tutor", title: "How online tutoring works and what's allowed", mins: 4, fit: (p) => p.model === "tutor",
      body: () => "<p>You teach a subject or language over video, usually through a platform that finds students, takes payment and keeps a share.</p>" + ul([
        "<b>Preply</b>: you set your rate. Preply keeps 100% of each new student's trial lesson, then 18% to 33% of regular lessons, falling as your hours grow.",
        "<b>italki</b> (languages): no commission on trial lessons; 21% on single lessons, down to 15% on 15- and 20-lesson packages.",
        "<b>Cambly</b> (English): fixed pay of $0.17 a minute, or $0.20 on Cambly Kids. No teaching certificate needed.",
        "<b>Wyzant</b> (US residents only): keeps a flat 25%, so you get 75% of your rate.",
        "<b>Outschool</b> (classes for children): keeps 30%. You need ID verification once, and a criminal background check renewed every year.",
        "<b>Children</b>: each platform has its own rules, such as parental supervision, recorded lessons and keeping all contact on the platform. Follow them exactly.",
        "<b>Tax</b>: Cambly and Wyzant treat tutors as independent contractors; Cambly doesn't withhold tax, so you handle your own.",
      ]) + checked,
      src: ["preplyCommission", "italkiCommission", "camblyTutors", "camblyApply", "wyzantFee", "wyzantReg", "outschoolAddendum", "outschoolBg", "preplyTerms", "camblyKidsPrivacy", "outschoolPersonal", "camblyAddendum", "wyzantVet"] },
    { id: "clipping", title: "How stream clipping works and what's allowed", mins: 4, fit: (p) => p.model === "clipping",
      body: () => "<p>You cut short vertical clips from a creator's long videos or streams and post them on TikTok, YouTube Shorts or Instagram Reels. The footage isn't yours, so you need the creator's permission, and someone has to pay you for the work.</p>" + ul([
        "<b>Clipping campaigns</b>: on Whop's Content Rewards, a creator or brand sets a rate per 1,000 views and a budget. You post, submit the link, and are paid for verified views on approved clips. You must be 18 or older.",
        "<b>Clip editor for hire</b>: a creator pays you per clip or per month, through Fiverr (20% fee), Upwork (0–15%) or directly.",
        "<b>Platform payouts</b>: YouTube and TikTok don't pay for clips of others' content with little added. YouTube's rule applies even with permission.",
        "<b>Copyright</b>: posting someone's content without permission can bring takedowns and strikes; 3 YouTube strikes in 90 days can end your channel.",
        "<b>Disclosure</b>: if you're paid to post a clip on your own account, label it as an ad.",
      ]) + "<p>Pay depends on views you can't control, budgets that run out and brands' approval.</p>" + checked,
      src: ["whopCrDocs", "whopCrTerms", "fiverrVsUpwork", "upworkFee", "ytShortsMon", "ytReused", "ttRewards", "ytStrikes", "whopFtc", "ftcInfluencer"] },

    { id: "ugc", title: "How UGC work pays and what's allowed", mins: 4, fit: (p) => p.model === "ugc",
      body: () => "<p>UGC (user-generated content) creators make product videos and photos that brands use in their own ads, product pages and social accounts. You're paid for the content itself, often without posting it to an audience of your own.</p>" + ul([
        "<b>Billo</b>: US, Canada or UK, 18+, no following needed. Each job shows a fixed payout, brands ship the product free, and PayPal pays twice a month.",
        "<b>Insense</b>: you apply to brand briefs. The brand's payment is held when you're hired and released after it approves your content.",
        "<b>TikTok One</b>: TikTok's marketplace for brand deals; 18+ and usually 1,000+ followers. Brands may run your posts as Spark Ads.",
        "<b>Amazon Influencer</b>: for Amazon Associates with a following; videos on product pages can earn commission when shoppers buy.",
        "<b>Usage rights</b>: the platform's terms or your contract decide who may use your video, where and for how long. On Billo the rights pass to the brand once it accepts.",
        "<b>Honesty</b>: only say what's true about products you've actually used. The FTC bans fake testimonials.",
      ]) + checked,
      src: ["billoFaq", "billoStart", "billoPaid", "insensePay", "ttOneSignup", "ttSpark", "amzAssocPolicies", "amzInfFaq", "billoTerms", "ftcEndorse", "ftcReviewsRule"] },

    { id: "live", title: "How live streaming pays and what's allowed", mins: 4, fit: (p) => p.model === "creator" && ["twitch", "yt_live"].includes(p.channel),
      body: () => "<p>You broadcast live while viewers watch and chat, and some can pay you during the stream. Platforms pay only once you meet their thresholds.</p>" + ul([
        "<b>Twitch</b>: Affiliate needs 25 followers, 4 hours streamed, 4 different days and an average of 3 viewers on 4 days, all within 30 days. Then subscriptions, Bits and ads can pay you.",
        "<b>Twitch payouts</b>: about 15 days after each month ends, from $50 ($100 by wire). Under 18, a parent or guardian must accept the Monetized Streamer Agreement.",
        "<b>YouTube Live</b>: 16 or older; 50 subscribers to stream from a phone. Super Chat needs the Partner Program and age 18+; you keep 70% after sales tax and App Store fees.",
        "<b>Copyright</b>: don't play recorded music you don't have rights to. Three copyright strikes end a Twitch account; a YouTube stream removed for copyright brings a strike and a 7-day streaming ban.",
        "<b>Sponsors</b>: say it out loud during the stream, and repeat it.",
      ]) + "<p>Meeting a threshold lets you join or apply; it doesn't guarantee income.</p>" + checked,
      src: ["twitchAffJoin", "twitchPaid", "twitchOnboard", "ytLiveRestrict", "ytLiveMobile", "ytSuperElig", "ytSuperManage", "twitchDmca", "ytStrikes", "ftcInfluencer"] },
    { id: "realistic", title: "What's realistic: income, payout waits and start-up costs", mins: 3, fit: (p) => !!REALISTIC[p.model],
      body: (p) => p && REALISTIC[p.model] ? "<p>Figures published by the platforms, regulators and surveys, for <b>" + MODEL_NAME[p.model].toLowerCase() + "</b>.</p>" + realisticBody(p)
        : "<p>" + BANKRATE_LINE + "</p><p>Build your plan to see the figures for the way you want to earn.</p>",
      src: (p) => p && REALISTIC[p.model] ? REALISTIC[p.model].src : ["bankrate", "bankratePR"] },
    { id: "holds", title: "Account holds, reserves and suspensions", mins: 4, fit: (p) => !["affiliate", "creator", "books"].includes(p.model),
      body: () => "<p>Platforms hold back money to cover refunds and chargebacks, especially for new sellers. Expect your first payouts to take longer than later ones.</p>" + ul([
        "<b>Shopify Payments</b>: payouts can be held while Shopify reviews your account, for example after chargebacks, complaints or missing tax details. A reserve holds back part of each sale for a set time (such as 10% for 120 days) to cover refunds and chargebacks; you can still take payments.",
        "<b>Etsy</b>: a reserve can hold a percentage of each physical-item sale, for example after your first sale, a jump in orders, late shipping or more refunds. Adding tracking releases money sooner, and for most sellers the reserve ends within 90 days. Digital sales aren't held.",
        "<b>eBay</b>: new or infrequent sellers have funds held until eBay confirms delivery. Holds usually end within 30 days; shipping quickly with tracking shortens them.",
        "<b>PayPal</b>: a new seller's first payments can be held for up to 21 days. Add tracking and the money is usually released about 24 hours after delivery; for services or digital items, mark the order completed and it's released after 7 days.",
        "<b>Fiverr and Upwork</b>: Fiverr earnings become available 14 days after an order is completed (7 days for Top Rated, Pro and Seller Plus). On Upwork, fixed-price payments sit in a 5-day security hold after approval, and hourly pay usually arrives 10 days after the work week ends.",
        "<b>What helps</b>: ship on time with tracking, answer customers fast, and reply to any request for information or ID quickly. Notices arrive by email and in your seller dashboard.",
      ]),
      src: ["shopReserves", "shopHolds", "etsyReserve", "ebayHolds", "paypalHolds", "fiverrOrders", "upworkFixed", "upworkHourly"] },
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
        "<tr><td>Gumroad</td><td>10% + 50¢ per direct sale plus processing; 30% via Discover (processing included)</td></tr>" +
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
      ]) + "<p>That's why this app doesn't promise income by the end of the week. It gets you set up and ready to sell, and shows your real numbers so you can decide what to change.</p>",
      src: ["ftcScam"] },
    { id: "traps", title: "Done-for-you stores and other traps", mins: 4, fit: () => true,
      body: () => ul([
        "<b>“Done-for-you” or “AI-powered” stores.</b> The FTC has banned the operators of several schemes that sold ready-made online stores, including Automators AI (2024), Ecommerce Empire Builders (2025) and Click Profit (2025). Ecommerce Empire Builders sold stores for as much as $35,000 while promising $10,000 a month. Click Profit charged a management fee of at least $45,000, and the FTC said Amazon blocked, suspended or ended about 95% of its stores.",
        "<b>“We'll take care of everything.”</b> The FTC warns that profitable “turnkey” businesses are rare, at best. Be wary of anyone who says you don't need to understand the business because their experts handle it.",
        "<b>Never hand over your store or seller login.</b> If someone really needs access, use the platform's own tools. On Shopify, staff and collaborator accounts give only the permissions a job needs, and you can remove them when it's done. If you already shared a password, change it (and anywhere you reused it), turn on two-factor authentication, and check your bank and card accounts.",
        "<b>Ask for the disclosure document.</b> Under the FTC's Business Opportunity Rule, a seller of a business opportunity must give you a one-page disclosure document at least 7 days before you sign or pay. If they claim earnings, they must also give you an earnings claim statement and have written proof. Not every course or coaching program is covered, but no paperwork plus big income promises is a red flag.",
        "<b>Contracts that gag reviews.</b> In the Automators and Click Profit cases, the FTC said the companies restricted or threatened customers over negative reviews. A contract that stops you posting an honest review is a warning sign.",
        "<b>Report it.</b> In the US, report scams at ReportFraud.ftc.gov and to your state attorney general.",
      ]),
      src: ["ftcAutomators", "ftcEEB", "ftcAIComply", "ftcClickProfit", "ftcClickProfitBan", "ftcVetting", "shopCollab", "shopUsers", "ftcScammed", "ftcBizOppRule", "ftcScam"] },
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
    { id: "c-shopify", title: "Dropshipping University", by: "Learn With Shopify (YouTube)", len: "About 3.5 hours", fit: (p) => SHIP(p) && p.channel === "shopify", url: S.shopCourse[1],
      note: "Free videos from Shopify on setting up a dropshipping store, product research and TikTok dropshipping." },
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
    { cat: "Digital products", name: "Gumroad", url: S.gumroad[1], cost: "10% + 50¢ per sale + processing", desc: "Sell downloads with no monthly fee.", fit: (p) => p.model === "digital" },
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
    { cat: "Business & legal", name: "FTC: disclosures for influencers", url: S.ftcInfluencer[1], cost: "Free guide", desc: "How to disclose affiliate links and sponsorships.", fit: (p) => ["affiliate", "creator", "clipping", "ugc"].includes(p.model) },
    { cat: "Business & legal", name: "IRS: self-employment tax", url: S.irsSE[1], cost: "Free guide", desc: "Tax on self-employment income in the US.", fit: (p) => p.country === "us" },
    { cat: "Business & legal", name: "FTC: CAN-SPAM guide", url: S.canSpam[1], cost: "Free guide", desc: "US rules for marketing emails.", fit: (p) => ["newsletter", "courses", "freelance"].includes(p.model) },
    { cat: "Business & legal", name: "CPSC: children's products", url: S.cpscCpc[1], cost: "Free guide", desc: "Testing and certificates for children's products.", fit: (p) => ["handmade", "fba", "pod"].includes(p.model) && p.country === "us" },
    { cat: "Business & legal", name: "HMRC: online selling", url: S.hmrcOnline[1], cost: "Free guide", desc: "When to tell HMRC about online income.", fit: (p) => p.country === "uk" },
    { cat: "Stock", name: "Adobe Stock Contributor", url: S.adobeStockContrib[1], cost: "33% photos, 35% video", desc: "Sell licences to your photos, videos, illustrations and vectors. AI work must be labelled.", fit: (p) => p.model === "stock" },
    { cat: "Stock", name: "Shutterstock Contributor", url: S.ssSubmit[1], cost: "Free; 15–40% per download", desc: "Sell photos, videos and illustrations. No AI-generated uploads.", fit: (p) => p.model === "stock" },
    { cat: "Stock", name: "Shutterstock earnings schedule", url: S.ssPayouts[1], cost: "", desc: "What each earnings level pays, and how many downloads it needs.", fit: (p) => p.channel === "shutterstock" },
    { cat: "Stock", name: "Canva Creators", url: S.canvaCreators[1], cost: "Apply; royalty pool", desc: "Publish templates in Canva's library once your application is approved.", fit: (p) => p.model === "stock" },
    { cat: "Stock", name: "Adobe Stock release rules", url: S.adobeStockModel[1], cost: "Free guide", desc: "Who needs a model release, and how to upload one.", fit: (p) => p.model === "stock" },
    { cat: "Stock", name: "Creative Market", url: "https://creativemarket.com/sell", cost: "Apply; shops earn 50% by default", desc: "Marketplace for templates, fonts and graphics. Payouts from $20.", fit: (p) => p.model === "stock" || p.model === "digital" },
    // Sell your own things
    { cat: "Sell", name: "Facebook Marketplace", url: "https://www.facebook.com/marketplace/", cost: "Fee on US shipped sales; check when you list", desc: "Sell locally, or ship in the US with checkout.", fit: (p) => p.channel === "fbm" },
    { cat: "Sell", name: "OfferUp", url: "https://offerup.com/", cost: "No fee on in-person sales", desc: "Local pickup only; shipping ended in 2025.", fit: (p) => p.channel === "offerup" },
    { cat: "Sell", name: "Vinted", url: "https://www.vinted.co.uk/", cost: "No seller fees", desc: "Secondhand marketplace; buyers pay Buyer Protection.", fit: (p) => p.channel === "vinted" },
    { cat: "Sell", name: "Depop", url: "https://www.depop.com/", cost: "No selling fee (US, UK); processing applies", desc: "Resale app popular for clothing.", fit: (p) => p.channel === "depop" },
    { cat: "Sell", name: "eBay UK (private seller)", url: S.ebayUKPrivate[1], cost: "No final value fee except motors", desc: "300 free listings a month for private sellers.", fit: (p) => p.channel === "ebay_own" && p.country === "uk" },
    { cat: "Sell", name: "eBay", url: S.ebayStart[1], cost: "13.6% + $0.30/$0.40 per order", desc: "Marketplace for new and used items.", fit: (p) => p.channel === "ebay_own" && p.country !== "uk" },
    { cat: "Safety", name: "OfferUp Community MeetUp Spots", url: S.offerupSpots[1], cost: "Free", desc: "Public places with lighting and cameras for local handovers.", fit: (p) => p.channel === "offerup" || p.channel === "fbm" },
    { cat: "Business & legal", name: "FTC: scams when selling online", url: S.ftcSelling[1], cost: "Free guide", desc: "Overpayment, fake payment and verification-code scams.", fit: (p) => p.model === "declutter" },
    { cat: "Business & legal", name: "IRS: Form 1099-K common situations", url: S.irs1099kCommon[1], cost: "Free guide", desc: "Selling personal items at a loss, and what to report.", fit: (p) => p.model === "declutter" && p.country === "us" },
    // Remote sales jobs
    { cat: "Jobs", name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/", cost: "Free to search", desc: "Search jobs, set alerts and apply.", fit: (p) => p.model === "salesjob" },
    { cat: "Jobs", name: "Indeed", url: "https://www.indeed.com/", cost: "Never pay to apply", desc: "Job search site; read its safe job search guide.", fit: (p) => p.model === "salesjob" },
    { cat: "Business & legal", name: "FTC: job scams", url: S.ftcJobScams[1], cost: "Free guide", desc: "Fake checks, paid training and reshipping scams.", fit: (p) => p.model === "salesjob" },
    { cat: "Business & legal", name: "ReportFraud.ftc.gov", url: S.reportFraud[1], cost: "Free", desc: "Report a job or selling scam to the FTC.", fit: (p) => ["salesjob", "declutter"].includes(p.model) && p.country === "us" },
    { cat: "Business & legal", name: "IRS: contractor or employee?", url: S.irsWorker[1], cost: "Free guide", desc: "How the IRS decides your work status.", fit: (p) => p.model === "salesjob" && p.country === "us" },
    { cat: "Business & legal", name: "DOL: state minimum wages", url: S.dolStateMin[1], cost: "Free guide", desc: "Minimum wage where you live.", fit: (p) => p.model === "salesjob" && p.country === "us" },
    { cat: "Business & legal", name: "GOV.UK: who gets the minimum wage", url: S.ukNmwWho[1], cost: "Free guide", desc: "Minimum wage rules, including commission work.", fit: (p) => p.model === "salesjob" && p.country === "uk" },
    // Online tutoring
    { cat: "Tutoring", name: "Preply", url: S.preplyTeach[1], cost: "18–33% commission; trials 100%", desc: "Set your own rate for any subject or language.", fit: (p) => p.channel === "preply" },
    { cat: "Tutoring", name: "italki", url: S.italkiApply[1], cost: "0% on trials; 15–21% on lessons", desc: "Teach languages as a Community Tutor or Professional Teacher.", fit: (p) => p.channel === "italki" },
    { cat: "Tutoring", name: "Cambly", url: S.camblyTutors[1], cost: "Pays $0.17/min ($0.20 Kids)", desc: "English tutoring; no certificate needed.", fit: (p) => p.channel === "cambly" },
    { cat: "Tutoring", name: "Wyzant", url: S.wyzantHow[1], cost: "25% platform fee", desc: "Tutoring marketplace for US residents.", fit: (p) => p.channel === "wyzant" },
    { cat: "Tutoring", name: "Outschool", url: S.outschoolTeach[1], cost: "30% service fee", desc: "Live online classes for children.", fit: (p) => p.channel === "outschool" },
    { cat: "Tutoring", name: "Outschool Trust & Safety", url: S.outschoolSafety[1], cost: "Free", desc: "Outschool's safety rules for teaching children.", fit: (p) => p.channel === "outschool" },
    // Clipping
    { cat: "Clipping", name: "Content Rewards (Whop)", url: S.whopDiscover[1], cost: "Paid per 1,000 views; 18+", desc: "Clipping campaigns that pay for verified views on approved clips.", fit: (p) => p.model === "clipping" },
    { cat: "Clipping", name: "Twitch Clips", url: S.twitchClips[1], cost: "Free", desc: "Make and download clips; streamers control who can clip.", fit: (p) => p.model === "clipping" || p.channel === "twitch" },
    { cat: "Clipping", name: "YouTube: Shorts from your videos", url: S.ytEditShort[1], cost: "Free", desc: "Turn up to 60 seconds of your own long video into a Short.", fit: (p) => p.model === "clipping" || p.channel === "yt_live" },
    { cat: "Clipping", name: "CapCut", url: S.capcutShorts[1], cost: "Free plan", desc: "Long video to shorts, auto captions and auto reframe.", fit: (p) => p.model === "clipping" || p.model === "ugc" },
    { cat: "Clipping", name: "YouTube channel permissions", url: S.ytPermissions[1], cost: "Free", desc: "Get Editor access to a creator's channel without their password.", fit: (p) => p.model === "clipping" && p.channel === "hire" },
    { cat: "Clipping", name: "YouTube reused-content rules", url: S.ytReused[1], cost: "Free guide", desc: "Why clips of others' content usually can't earn ad revenue.", fit: (p) => p.model === "clipping" },
    // UGC
    { cat: "UGC", name: "Billo", url: S.billoFaq[1], cost: "Fixed pay per job; US, CA, UK", desc: "UGC jobs for brands; products shipped to you.", fit: (p) => p.model === "ugc" },
    { cat: "UGC", name: "Insense", url: S.insenseCreators[1], cost: "Paid after brand approval", desc: "Apply to brand briefs for UGC and creator ads.", fit: (p) => p.model === "ugc" },
    { cat: "UGC", name: "TikTok One", url: S.ttOneSignup[1], cost: "18+; usually 1,000+ followers", desc: "TikTok's marketplace for paid brand projects.", fit: (p) => p.model === "ugc" },
    { cat: "UGC", name: "Amazon Influencer Program", url: S.amzInfInfo[1], cost: "Associates account needed", desc: "Storefront and shoppable product videos on Amazon.", fit: (p) => p.model === "ugc" },
    { cat: "Business & legal", name: "FTC: fake reviews and testimonials rule", url: S.ftcReviewsRule[1], cost: "Free guide", desc: "What the 2024 rule bans, in questions and answers.", fit: (p) => p.model === "ugc" },
    // Live streaming
    { cat: "Creators", name: "Twitch Affiliate", url: S.twitchAffJoin[1], cost: "Free; 25 followers + 3 avg viewers", desc: "Twitch's first paid level: subs, Bits and ads.", fit: (p) => p.channel === "twitch" },
    { cat: "Creators", name: "OBS Studio", url: S.obs[1], cost: "Free", desc: "Open-source software for streaming and recording.", fit: (p) => p.channel === "twitch" || p.channel === "yt_live" },
    { cat: "Creators", name: "YouTube Live", url: S.ytLiveStart[1], cost: "Free; 16+", desc: "Go live by webcam, phone (50+ subscribers) or encoder.", fit: (p) => p.channel === "yt_live" },
    { cat: "Creators", name: "Super Chat eligibility", url: S.ytSuperElig[1], cost: "YPP and 18+", desc: "Paid chat messages during your live streams.", fit: (p) => p.channel === "yt_live" },
  ];

  const FEES = {
    shopify: { label: "Shopify Payments, Basic (US online card)", pct: 2.9, fixed: 0.3 },
    shopify3p: { label: "Shopify Basic + another payment provider", pct: 2, fixed: 0, hint: "Shopify's 2% only. Add your provider's own fees." },
    etsyUK: { label: "Etsy (UK seller)", pct: 10.98, fixed: 0.2, cur: "GBP", hint: "6.5% transaction + 4% + £0.20 processing + 0.48% regulatory operating fee. Add the $0.20 listing fee (billed in US dollars) to other costs. Etsy adds VAT to its fees unless you've given it a VAT number." },
    ebayUKprivate: { label: "eBay UK, private seller", pct: 0, fixed: 0, cur: "GBP", hint: "No final value fee for UK-based private sellers (vehicles excepted); buyers pay eBay's Buyer Protection fee on top. Fees apply above 300 listings a month, for upgrades or for overseas delivery." },
    ebayUKbusiness: { label: "eBay UK, business seller (“Everything Else” category)", pct: 13.25, fixed: null, cur: "GBP", hint: "12.9% final value fee + 0.35% regulatory operating fee, plus £0.30 per order of £10 or less or £0.40 over £10. Other categories differ; fees exclude VAT." },
    etsy: { label: "Etsy (US)", pct: 9.5, fixed: 0.25, hint: "6.5% transaction + 3% + $0.25 processing. Add $0.20 per listing to other costs. Sales from Offsite Ads add 15% (12% once you pass $10,000 a year), up to $100 per order." },
    ebay: { label: "eBay, most categories", pct: 13.6, fixed: null, hint: "$0.30 per order of $10 or less, $0.40 over $10." },
    tiktok: { label: "TikTok Shop US", pct: 6, fixed: 0, hint: "Check your category's rate in Seller Center." },
    amazonI: { label: "Amazon, Individual plan", pct: null, fixed: 0.99, hint: "Enter your category's referral fee %." },
    amazonP: { label: "Amazon, Professional plan", pct: null, fixed: 0, hint: "Enter your category's referral fee %. Add $39.99 to monthly costs." },
    mercari: { label: "Mercari", pct: 10, fixed: 0, hint: "10% of the item price plus buyer-paid shipping." },
    poshmark: { label: "Poshmark (US)", pct: 20, fixed: 0, hint: "Under $15 it's a flat $2.95 instead; the calculators apply that automatically." },
    gumroad: { label: "Gumroad, direct sale (card)", pct: 12.9, fixed: 0.8, hint: "10% + 50¢ Gumroad fee + 2.9% + 30¢ card processing. PayPal fees differ." },
    gumroadDiscover: { label: "Gumroad, Discover sale", pct: 30, fixed: 0, hint: "Flat 30%; processing included." },
    payhipFree: { label: "Payhip, Free plan", pct: 5, fixed: 0, hint: "Add PayPal or Stripe processing at their standard rates." },
    payhipPlus: { label: "Payhip, Plus plan", pct: 2, fixed: 0, hint: "Add $29 to monthly costs, and PayPal or Stripe processing." },
    payhipPro: { label: "Payhip, Pro plan", pct: 0, fixed: 0, hint: "Add $99 to monthly costs, and PayPal or Stripe processing." },
    fiverr: { label: "Fiverr (freelancer side)", pct: 20, fixed: 0, hint: "Fiverr keeps 20% of every order, including tips." },
    upwork: { label: "Upwork (enter your contract's fee)", pct: null, fixed: 0, hint: "Between 0% and 15%; Upwork shows it before you accept." },
    stripeUS: { label: "Card payment via Stripe (US)", pct: 2.9, fixed: 0.3, hint: "Stripe's standard US card rate. International cards add 1.5%, and currency conversion adds 1%." },
    substack: { label: "Substack paid subscription (US cards)", pct: 13.6, fixed: 0.3, hint: "10% Substack + 2.9% + 30¢ Stripe + 0.7% Stripe Billing." },
    teachableStarter: { label: "Teachable Starter (US card)", pct: 10.4, fixed: 0.3, hint: "7.5% Teachable fee + 2.9% + 30¢ card processing. Add the plan to monthly costs." },
    teachablePaid: { label: "Teachable Builder or Growth (US card)", pct: 2.9, fixed: 0.3, hint: "0% Teachable fee with Teachable Payments + 2.9% + 30¢ card processing." },
    thinkific: { label: "Thinkific Payments", pct: 2.9, fixed: 0, hint: "No transaction fee; about 2.9% card processing. Check for a per-payment amount." },
    amazonFBA: { label: "Amazon FBA (enter your fees)", pct: null, fixed: null, hint: "Fee % = referral fee; fixed = FBA fulfilment fee per unit from Amazon's estimator." },
    custom: { label: "Custom", pct: null, fixed: null, hint: "" },
    fbmShip: { label: "Facebook Marketplace shipped sale (US)", pct: 10, fixed: 0, hint: "Meta's Seller Protection Policy: 10%, minimum $0.80, on the total including shipping and tax. Other Meta pages give a different rate; use the fee shown when you list." },
    offerup: { label: "OfferUp, in-person sale", pct: 0, fixed: 0, hint: "No fee on in-person sales. A paid subscription is needed only past the free listing limits." },
    vinted: { label: "Vinted (seller)", pct: 0, fixed: 0, hint: "Sellers pay no fee; buyers pay the Buyer Protection fee on top." },
    depopUS: { label: "Depop (US seller)", pct: 3.3, fixed: 0.45, hint: "Payment processing only; no selling fee. Add 12% if the sale came through a Boosted listing." },
    depopUK: { label: "Depop (UK seller)", pct: 2.9, fixed: 0.3, cur: "GBP", hint: "Payment processing (£0.30 fixed); no selling fee. Add 12% for Boosted listings." },
    preplyNew: { label: "Preply, new tutor", pct: 33, fixed: 0, hint: "28% after 20 hours taught, falling to 18% after 400. Trial lessons with new students: Preply keeps 100%." },
    preply400: { label: "Preply, after 400 hours taught", pct: 18, fixed: 0, hint: "Trial lessons with new students: Preply keeps 100%." },
    italkiSingle: { label: "italki, single lesson", pct: 21, fixed: 0, hint: "Packages: 19% (5 lessons), 17% (10), 15% (15 or 20). Trial lessons: 0%. Group classes: 30%." },
    italkiPkg: { label: "italki, 15- or 20-lesson package", pct: 15, fixed: 0, hint: "Trial lessons: 0%." },
    wyzant: { label: "Wyzant", pct: 25, fixed: 0, hint: "0% on students you refer yourself. Students pay a separate 9% fee." },
    outschool: { label: "Outschool", pct: 30, fixed: 0, hint: "Parents pay a separate marketplace fee that isn't part of your 70%." },
    twitchSub: { label: "Twitch subscription, standard split", pct: 50, fixed: 0, hint: "Worked out after taxes and payment fees. In the Plus Program Twitch keeps 40% or 30% instead." },
    ytSupers: { label: "YouTube Super Chat / Super Stickers", pct: 30, fixed: 0, hint: "You keep 70%, worked out after local sales tax and iOS App Store fees." },
  };
  const DEFAULT_FEE = { shopify: "shopify", etsy: "etsy", ebay: "ebay", tiktok: "tiktok", amazon: "amazonI", mercari: "mercari", poshmark: "poshmark", gumroad: "gumroad", payhip: "payhipFree", aff_amazon: "custom", aff_tiktok: "custom", aff_network: "custom", fiverr: "fiverr", upwork: "upwork", direct: "stripeUS", yt: "custom", tt_creator: "custom", teachable: "teachableStarter", thinkific: "thinkific", kdp: "custom", substack: "substack", beehiiv: "custom", amz_fba: "amazonFBA", adobe_stock: "custom", shutterstock: "custom", canva_creators: "custom", fbm: "fbmShip", offerup: "offerup", vinted: "vinted", depop: "depopUS", ebay_own: "ebay", employee: "custom", contract: "custom", preply: "preplyNew", italki: "italkiSingle", cambly: "custom", wyzant: "wyzant", outschool: "outschool", whop: "custom", hire: "custom", billo: "custom", insense: "custom", tt_one: "custom", amz_inf: "custom", ugc_direct: "stripeUS", twitch: "twitchSub", yt_live: "ytSupers" };

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
  // Monthly: same day next month, or the month's last day when it's shorter (31 Jan -> 28/29 Feb).
  const addMonth = (s, day) => { const [y, m, d] = s.split("-").map(Number); const last = new Date(y, m + 1, 0).getDate(); return iso(new Date(y, m, Math.min(day || d, last))); };
  const fmtDay = (s) => parse(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const fmtDue = (s) => {
    if (!s) return "";
    const t = today();
    if (s === t) return "Today";
    if (s === addDays(t, 1)) return "Tomorrow";
    if (s === addDays(t, -1)) return "Yesterday";
    return parse(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  const money = (n, cur = userCur()) => { try { return n.toLocaleString(undefined, { style: "currency", currency: cur }); } catch { return n.toFixed(2); } };
  // The calculators show amounts in the currency picked in Tools, or else the
  // one for the country in the plan.
  function userCur() {
    const pick = lsGet("dd-cur", "");
    if (pick && CURRENCIES.includes(pick)) return pick;
    const c = typeof st !== "undefined" && st.profile && st.profile.country;
    return COUNTRY_CUR[c] || "USD";
  }
  const curName = (c) => { try { return new Intl.DisplayNames(undefined, { type: "currency" }).of(c); } catch { return c; } };
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
  // signed-in viewers who can save get their own subtree in the database
  // (data/users/<their id>/...); everyone else saves in this browser.
  //   account                  your name
  //   account/biz/<id>         one document per business (name, plan type)
  //   account/badges/<id>      milestones reached
  //   account/saves/<id>       saved copies of a business, for restoring later
  //   profile, desk/<kind>     the first business ("desk")
  //   profile-b_x, b_x/<kind>  any other business
  // Every business and milestone is its own document, so two devices (or two
  // tabs) changing things at once never overwrite each other's lists. Which
  // business is open is remembered per device.
  // ---------------------------------------------------------------------------
  const st = {
    tab: lsGet("dd-tab6", "today"),
    profile: null, profileLoaded: false,
    tasks: [], tasksLoaded: false,
    learn: {}, products: [], links: [], sales: [],
    editingProfile: false,
    biz: "desk", account: null, accountLoaded: false, saves: [], savesLoaded: false,
    busy: 0, bulk: null, dirty: false,
    ui: Object.assign({ area: "all", view: "list", quick: null, q: "", showDone: false, allTools: false }, lsGet("dd-ui", {}), { quick: null, q: "" }),
  };
  const saveUi = () => lsSet("dd-ui", { area: st.ui.area, view: st.ui.view, showDone: st.ui.showDone, allTools: st.ui.allTools });
  const readOnly = false;
  let db = null, uid = null, mode = "loading", unsubs = [], accUnsubs = [], gen = 0, viewerName = "", signedIn = false;
  const LOCAL = { tasks: "dd-local-tasks", profile: "dd-local-profile", learn: "dd-local-learn", products: "dd-local-products", links: "dd-local-links", sales: "dd-local-sales" };
  const ACC_LOCAL = "dd-local-account", SAVES_LOCAL = "dd-local-saves";
  const KINDS = ["tasks", "learn", "products", "links", "sales"];
  const base = () => "data/users/" + uid;
  const bizDoc = () => (st.biz === "desk" ? "desk" : st.biz);
  const profPath = () => base() + "/" + (st.biz === "desk" ? "profile" : "profile-" + st.biz);
  const lkey = (kind) => LOCAL[kind] + (st.biz === "desk" ? "" : ":" + st.biz);
  const col = (kind) => db.doc(base() + "/" + bizDoc()).collection(kind);
  const emptyOf = (kind) => (kind === "learn" ? {} : kind === "profile" ? null : []);

  // ----- Save status in the header
  const sync = { pending: 0, last: null, error: false, failAt: 0, web: { pending: 0, offline: false } };
  function drawSync() {
    const box = $("#saveMode"); if (!box) return;
    const waiting = mode === "db" && sync.web.pending > 0, off = mode === "db" && sync.web.offline;
    box.classList.toggle("saving", sync.pending > 0 || (waiting && !off) || mode === "loading");
    box.classList.toggle("error", sync.error && !sync.pending);
    box.classList.toggle("offline", off && !sync.error);
    $("#syncText").textContent = mode === "loading" ? "Loading…" : sync.pending > 0 ? "Saving…" : sync.error ? "Not saved" : off ? (waiting ? "Offline · will sync" : "Offline") : waiting ? "Saving…" : mode === "db" ? "Saved to your account" : "Saved in this browser";
    box.title = (off ? "No connection. Your changes are kept on this device and sent to your account when you're back online."
      : mode === "db" ? (WEB ? "Private to you, on every device where you sign in." : "Private to you, on every device where you're signed in to claude.ai.")
      : WEB ? (ACCOUNTS ? "Kept only in this browser. Create a free account to keep it safe and use it on your other devices." : "Kept only in this browser.") : "Kept only in this browser. Sign in to claude.ai to keep it in your account.")
      + (sync.last ? " Last saved at " + new Date(sync.last).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + "." : "");
    if ($("#acctDlg") && $("#acctDlg").open) drawAcctStatus();
  }
  const noteLocalSave = () => { sync.last = Date.now(); sync.error = false; drawSync(); };
  document.addEventListener("startline:sync", (e) => { sync.web = e.detail || sync.web; if (!sync.web.pending && !sync.web.offline) sync.last = Date.now(); drawSync(); });
  document.addEventListener("startline:sync-error", (e) => {
    const c = e.detail && e.detail.code; sync.failAt = Date.now();
    toast(c === "quota_exceeded" ? "Your account's storage is full. Delete old saves or finished tasks, then try again." : "A change couldn't be saved to your account, so it was undone.", { error: true });
  });
  // Browser storage can be full; say so instead of pretending it saved.
  function lsWrite(k, v) {
    if (lsSet(k, v)) return true;
    sync.error = true; sync.failAt = Date.now(); drawSync();
    toast("This browser's storage is full, so that change wasn't saved. Delete old saves, export a backup" + (ACCOUNTS ? ", or create a free account." : "."), { error: true });
    return false;
  }
  function notReady() { toast("Still loading your work. Try again in a moment."); return false; }

  function loadLocal() {
    st.tasks = lsGet(lkey("tasks"), []); st.profile = lsGet(lkey("profile"), null);
    st.learn = lsGet(lkey("learn"), {}); st.products = lsGet(lkey("products"), []); st.links = lsGet(lkey("links"), []); st.sales = lsGet(lkey("sales"), []);
    KINDS.forEach((k) => { if (!st[k] || typeof st[k] !== "object") st[k] = emptyOf(k); });
    st.tasksLoaded = st.profileLoaded = true;
  }
  function saveLocalAll() {
    KINDS.concat("profile").forEach((k) => lsSet(lkey(k), st[k]));
    lsSet(ACC_LOCAL, { ...st.account, current: st.biz }); lsSet(SAVES_LOCAL, st.saves);
  }
  function stopSubs() { unsubs.concat(accUnsubs).forEach((u) => { try { u(); } catch {} }); unsubs = []; accUnsubs = []; }
  function switchToLocal(why) {
    if (mode === "local") return;
    mode = "local"; stopSubs();
    // Work already saved in this browser is never overwritten by the account's copy.
    if (lsGet(ACC_LOCAL, null) || lsGet(LOCAL.tasks, null) || lsGet(LOCAL.profile, null)) {
      st.account = normAccount(lsGet(ACC_LOCAL, null)); st.biz = st.account.current; st.saves = lsGet(SAVES_LOCAL, []); loadLocal(); render();
    } else saveLocalAll();
    drawSync(); drawHeader();
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
    } finally { sync.pending--; if (!sync.error) sync.last = Date.now(); drawSync(); }
  }
  function applyTo(kind, store, id, data) {
    if (kind === "learn") { if (data) store[id] = data; else delete store[id]; return store; }
    const i = store.findIndex((x) => x.id === id);
    if (data == null) { if (i >= 0) store.splice(i, 1); } else if (i >= 0) store[i] = { id, ...data }; else store.push({ id, ...data });
    return store;
  }
  function localPut(kind, id, data) {
    if (st.bulk) { applyTo(kind, st[kind], id, data); st.bulk.log.push([kind, lkey(kind), id, data]); return true; }
    // Re-read what's stored first, so changes made in another open tab are kept.
    const stored = lsGet(lkey(kind), emptyOf(kind));
    const fresh = applyTo(kind, stored && typeof stored === "object" ? stored : emptyOf(kind), id, data);
    if (!lsWrite(lkey(kind), fresh)) return false;
    st[kind] = fresh; noteLocalSave(); onData(kind); return true;
  }
  // Many changes at once (building a plan, importing, restoring, deleting):
  // the screen is redrawn once at the end, and in this browser everything is
  // written in one go. Switching business waits until it's finished.
  async function bulk(fn) {
    st.busy++;
    const own = !st.bulk && mode === "local";
    if (own) st.bulk = { log: [] };
    let failed = false, out;
    try { out = await fn(); }
    finally {
      if (own) {
        const b = st.bulk; st.bulk = null;
        const byKey = new Map();
        b.log.forEach(([kind, key, id, data]) => { if (!byKey.has(key)) byKey.set(key, { kind, ops: [] }); byKey.get(key).ops.push([id, data]); });
        byKey.forEach(({ kind, ops }, key) => {
          const stored = lsGet(key, emptyOf(kind));
          const fresh = stored && typeof stored === "object" ? stored : emptyOf(kind);
          ops.forEach(([id, data]) => applyTo(kind, fresh, id, data));
          if (!lsWrite(key, fresh)) failed = true;
        });
        loadLocal(); if (!failed && byKey.size) noteLocalSave();
      }
      st.busy--;
      if (!st.busy) { st.dirty = false; updateTabBadge(); render(); scheduleBadges(); }
    }
    if (failed) throw Object.assign(new Error("Some changes weren't saved"), { code: "quota_exceeded" });
    return out;
  }
  async function putDoc(kind, id, data) {
    if (mode === "loading") return notReady();
    if (mode === "db") { const ok = await dbTry(() => col(kind).doc(id).set(data)); if (ok !== false) return ok === true; }
    return localPut(kind, id, data);
  }
  async function delDoc(kind, id) {
    if (mode === "loading") return notReady();
    if (mode === "db") { const ok = await dbTry(() => col(kind).doc(id).delete()); if (ok !== false) return ok === true; }
    return localPut(kind, id, null);
  }
  const putTask = (id, data) => putDoc("tasks", id, data);
  const delTask = (id) => delDoc("tasks", id);
  async function clearProfile() {
    if (mode === "loading") return notReady();
    if (mode === "db") { const ok = await dbTry(() => db.doc(profPath()).delete()); if (ok !== false) return ok === true; }
    if (!lsWrite(lkey("profile"), null)) return false;
    st.profile = null; noteLocalSave(); onData("profile"); return true;
  }
  async function saveProfile(p) {
    if (mode === "loading") return notReady();
    if (mode === "db") { const ok = await dbTry(() => db.doc(profPath()).set(p)); if (ok !== false) { if (ok) noteBizPlan(p); return ok === true; } }
    if (!lsWrite(lkey("profile"), p)) return false;
    st.profile = p; noteLocalSave(); onData("profile"); noteBizPlan(p); return true;
  }
  const setLearn = (id, done) => (done ? putDoc("learn", id, { done: true, at: today() }) : delDoc("learn", id));
  const saveProduct = (id, data) => putDoc("products", id, data);
  const deleteProduct = (id) => delDoc("products", id);

  // ----- Account: your name, your businesses, milestones
  const okBizId = (id) => typeof id === "string" && /^(desk|b_[\w-]{4,40})$/.test(id);
  const newBizEntry = (id, name) => ({ id, name, createdAt: today(), model: "", channel: "", order: Date.now() });
  function cleanBiz(id, b) {
    b = b || {};
    return { id, name: String(b.name || "Business").trim().slice(0, 60) || "Business", createdAt: /^\d{4}-\d{2}-\d{2}$/.test(b.createdAt || "") ? b.createdAt : today(),
      model: MODEL_NAME[b.model] ? b.model : "", channel: typeof b.channel === "string" ? b.channel.slice(0, 30) : "", order: Number(b.order) || 0 };
  }
  const bizRank = (b) => (b.id === "desk" ? -1 : b.order || 0);
  // The browser's account record, and old single-document account records.
  function normAccount(a) {
    const out = { name: "", current: "desk", businesses: [], badges: [] };
    if (a && typeof a === "object") {
      out.name = typeof a.name === "string" ? a.name.trim().slice(0, 60) : "";
      out.badges = Array.isArray(a.badges) ? [...new Set(a.badges.filter((x) => typeof x === "string"))].slice(0, 50) : [];
      out.businesses = (Array.isArray(a.businesses) ? a.businesses : []).filter((b) => b && okBizId(b.id)).map((b, i) => cleanBiz(b.id, { order: i, ...b }));
      out.current = typeof a.current === "string" ? a.current : "desk";
    }
    if (!out.businesses.length) out.businesses.push(cleanBiz("desk", { name: "My business" }));
    out.businesses.sort((x, y) => bizRank(x) - bizRank(y));
    if (!out.businesses.some((b) => b.id === out.current)) out.current = out.businesses[0].id;
    return out;
  }
  // Signed in: the account is assembled from its separate documents.
  const acc = { name: "", biz: new Map(), badges: new Set() };
  function buildAccount() {
    const list = [...acc.biz.values()].sort((x, y) => bizRank(x) - bizRank(y));
    if (!list.length) list.push(cleanBiz("desk", { name: "My business" }));
    st.account = { name: acc.name || "", businesses: list, badges: [...acc.badges], current: st.biz };
  }
  const curBiz = () => (st.account && st.account.businesses.find((b) => b.id === st.biz)) || newBizEntry(st.biz, "My business");
  const currentKey = () => "dd-current:" + uid;
  async function accDoc(path, data) { return dbTry(() => (data === undefined ? db.doc(base() + "/" + path).delete() : db.doc(base() + "/" + path).set(data))); }
  function localAccount(fn) {
    if (mode === "loading") return notReady();
    const a = normAccount(lsGet(ACC_LOCAL, null)); fn(a);
    a.businesses.sort((x, y) => bizRank(x) - bizRank(y));
    if (!lsWrite(ACC_LOCAL, a)) return false;
    st.account = { ...a, current: st.biz }; noteLocalSave(); drawHeader(); return true;
  }
  async function setName(name) {
    const n = String(name || "").trim().slice(0, 60);
    if (mode === "db") { acc.name = n; buildAccount(); drawHeader(); const ok = await accDoc("account", { name: n, v: 2 }); if (ok !== false) return ok === true; }
    return localAccount((a) => { a.name = n; });
  }
  async function putBiz(id, patch) {
    if (mode === "db") {
      const b = cleanBiz(id, { ...(acc.biz.get(id) || {}), ...patch });
      acc.biz.set(id, b); buildAccount(); drawHeader();
      const { id: _, ...doc } = b;
      const ok = await accDoc("account/biz/" + id, doc); if (ok !== false) return ok === true;
    }
    return localAccount((a) => {
      const i = a.businesses.findIndex((x) => x.id === id);
      if (i >= 0) a.businesses[i] = cleanBiz(id, { ...a.businesses[i], ...patch }); else a.businesses.push(cleanBiz(id, patch));
    });
  }
  async function removeBiz(id) {
    if (mode === "db") { acc.biz.delete(id); buildAccount(); drawHeader(); const ok = await accDoc("account/biz/" + id, undefined); if (ok !== false) return ok === true; }
    return localAccount((a) => { a.businesses = a.businesses.filter((x) => x.id !== id); });
  }
  const track = (name) => { if (PLAT && PLAT.track) PLAT.track(name); };
  async function addBadges(ids) {
    if (!ids.length) return true;
    ids.forEach((id) => track("badge-" + id));
    if (mode === "db") {
      ids.forEach((id) => acc.badges.add(id)); buildAccount();
      let ok = true; for (const id of ids) ok = (await accDoc("account/badges/" + id, { at: Date.now() })) !== null && ok;
      return ok;
    }
    return localAccount((a) => { a.badges = [...new Set(a.badges.concat(ids))].slice(0, 50); });
  }
  function setCurrent(id) {
    if (mode === "db") { lsSet(currentKey(), id); return true; }
    return localAccount((a) => { a.current = id; });
  }
  function noteBizPlan(p) {
    if (!st.account) return;
    const b = curBiz(); const model = (p && p.model) || "", channel = (p && p.channel) || "";
    if (b.model === model && b.channel === channel) return;
    putBiz(st.biz, { model, channel });
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
    sub(col("sales"), (snap) => { st.sales = snap.docs.map((d) => ({ id: d.id, ...d.data() })); onData("sales"); });
    sub(db.doc(profPath()), (snap) => {
      const p = snap.exists ? snap.data() : null;
      const changed = JSON.stringify(p) !== JSON.stringify(st.profile) || !st.profileLoaded;
      st.profile = p; st.profileLoaded = true; if (changed) onData("profile");
    });
  }
  function subscribeAccount(first) {
    const sub = (ref, fn) => accUnsubs.push(ref.onSnapshot((snap) => { if (mode === "db") fn(snap); }, () => {}));
    sub(db.doc(base() + "/account"), (snap) => {
      const d = snap.exists ? snap.data() : null;
      acc.name = d && typeof d.name === "string" ? d.name.trim().slice(0, 60) : "";
      if (first) first("name", d); accountChanged();
    });
    sub(db.doc(base() + "/account").collection("biz"), (snap) => {
      acc.biz = new Map(snap.docs.filter((d) => okBizId(d.id)).map((d) => [d.id, cleanBiz(d.id, d.data())]));
      if (first) first("biz"); accountChanged();
    });
    sub(db.doc(base() + "/account").collection("badges"), (snap) => {
      acc.badges = new Set(snap.docs.map((d) => d.id));
      if (first) first("badges"); accountChanged();
    });
    sub(db.doc(base() + "/account").collection("saves"), (snap) => {
      st.saves = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((x, y) => (y.at || 0) - (x.at || 0)); st.savesLoaded = true; onData("saves");
    });
  }
  function accountChanged() {
    if (!st.accountLoaded) return;
    buildAccount();
    // The open business was deleted on another device.
    if (!st.busy && !st.account.businesses.some((b) => b.id === st.biz)) { switchBiz(st.account.businesses[0].id, { quiet: true, force: true }); toast("That business was deleted on another device."); }
    drawHeader(); onData("account");
  }
  // Older versions kept the whole account in one document; split it up once.
  async function migrateAccount(old) {
    const a = normAccount(old);
    for (const b of a.businesses) if (!acc.biz.has(b.id)) await putBiz(b.id, b);
    const missing = a.badges.filter((id) => !acc.badges.has(id));
    if (missing.length) await addBadges(missing);
    await accDoc("account", { name: a.name, v: 2 }); acc.name = a.name;
    if (a.current && !lsGet(currentKey(), null)) lsSet(currentKey(), a.current);
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
      st.saves = lsGet(SAVES_LOCAL, []); if (!Array.isArray(st.saves)) st.saves = []; st.savesLoaded = true; loadLocal(); afterStart(); return;
    }
    mode = "db";
    let old = null;
    await new Promise((resolve) => {
      const seen = new Set();
      subscribeAccount((part, data) => {
        seen.add(part);
        if (part === "name" && data && Array.isArray(data.businesses) && data.v !== 2) old = data;
        if (seen.size === 3) resolve();
      });
      setTimeout(resolve, 6000);
    });
    if (old) await migrateAccount(old);
    else if (!acc.biz.size) await putBiz("desk", { name: "My business", order: 0 });
    buildAccount();
    const saved = lsGet(currentKey(), null);
    st.biz = st.account.businesses.some((b) => b.id === saved) ? saved : st.account.businesses[0].id;
    st.account.current = st.biz; st.accountLoaded = true;
    subscribeBiz(); afterStart();
  }
  // Ask the browser not to clear this site's storage when space runs low.
  // (Firefox asks the person, so it's only requested once there's a plan worth keeping.)
  function keepStorage() {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then((yes) => { if (!yes) navigator.storage.persist(); }).catch(() => {}); } catch {}
  }
  function afterStart() {
    const out = $("#out"); if (out) out.inert = false;
    drawSync(); drawHeader(); updateTabBadge(); render(true);
    if (mode === "db" && WEB) setTimeout(offerBrowserWork, 900);
  }
  // Other tabs in this browser: show their changes instead of overwriting them.
  window.addEventListener("storage", (e) => {
    if (mode !== "local" || !e.key) return;
    if (e.key === ACC_LOCAL) {
      const a = normAccount(lsGet(ACC_LOCAL, null)); st.account = { ...a, current: st.biz };
      if (!a.businesses.some((b) => b.id === st.biz)) switchBiz(a.businesses[0].id, { quiet: true, force: true });
      drawHeader(); onData("account"); return;
    }
    if (e.key === SAVES_LOCAL) { st.saves = lsGet(SAVES_LOCAL, []); onData("saves"); return; }
    const kind = KINDS.concat("profile").find((k) => e.key === lkey(k)); if (!kind) return;
    const v = lsGet(e.key, emptyOf(kind));
    st[kind] = kind === "profile" ? v : v && typeof v === "object" ? v : emptyOf(kind);
    onData(kind);
  });

  // ----- Businesses
  const whenLoaded = () => new Promise((res) => { const t0 = Date.now(); const tick = () => ((st.tasksLoaded && st.profileLoaded) || Date.now() - t0 > 4000 ? res() : setTimeout(tick, 40)); tick(); });
  async function switchBiz(id, opts = {}) {
    if (!st.account || !st.account.businesses.some((b) => b.id === id)) return;
    if (st.busy && !opts.force) { toast("One moment: still finishing the last change."); return; }
    st.biz = id; st.account.current = id;
    st.tasks = []; st.learn = {}; st.products = []; st.links = []; st.sales = []; st.profile = null; st.tasksLoaded = st.profileLoaded = false;
    startSetup(false); st.editingProfile = false; ev.aiText = ""; ev.aiPrompt = "";
    if (mode === "db") subscribeBiz(); else loadLocal();
    setCurrent(id);
    updateTabBadge(); drawHeader();
    if (!opts.quiet) { setTab("today"); toast("Switched to " + curBiz().name + "."); }
  }
  async function createBiz(name) {
    const id = "b_" + newId();
    if (!(await putBiz(id, newBizEntry(id, name.trim().slice(0, 60) || "New business")))) return;
    await switchBiz(id, { quiet: true, force: true });
    setTab("today"); toast("Created " + curBiz().name + ". Answer five questions to build its plan.");
  }
  async function renameBiz(id, name) {
    const n = name.trim().slice(0, 60); if (!n) return false;
    return putBiz(id, { name: n });
  }
  async function deleteBiz(id) {
    const list = st.account.businesses; if (list.length < 2) return false;
    const back = st.biz === id ? list.find((b) => b.id !== id).id : st.biz;
    try {
      await bulk(async () => {
        if (st.biz !== id) await switchBiz(id, { quiet: true, force: true });
        await whenLoaded(); await resetAll();
      });
    } catch { await switchBiz(back, { quiet: true, force: true }); return false; }
    await removeBiz(id);
    await switchBiz(back, { quiet: true, force: true });
    render(true);
    return true;
  }

  // ----- Saves: copies of a business you can restore later
  const SAVE_MAX = 30, SAVE_MAX_LOCAL = 10, LOCAL_SAVE_BUDGET = 2000000;
  function saveSummary() { return { tasks: st.tasks.length, done: st.tasks.filter((t) => t.status === "done").length, products: st.products.length, links: st.links.length, sales: st.sales.length, model: (st.profile && st.profile.model) || "" }; }
  const localSaves = () => { const v = lsGet(SAVES_LOCAL, []); return Array.isArray(v) ? v : []; };
  async function makeSave(name, auto) {
    if (mode === "loading") return notReady() || null;
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
    const next = [{ id, ...doc }].concat(localSaves().filter((x) => x.id !== id)).slice(0, SAVE_MAX_LOCAL);
    if (JSON.stringify(next).length > LOCAL_SAVE_BUDGET) { toast("Saves kept in this browser are limited to about 2 MB in total. Delete an old save, or export a backup instead."); return null; }
    if (!lsWrite(SAVES_LOCAL, next)) return null;
    st.saves = next; noteLocalSave(); onData("saves"); return id;
  }
  async function removeSave(id) {
    if (mode === "db") { const ok = await dbTry(() => db.doc(base() + "/account").collection("saves").doc(id).delete()); if (ok !== false) return ok === true; }
    const next = localSaves().filter((x) => x.id !== id);
    if (!lsWrite(SAVES_LOCAL, next)) return false;
    st.saves = next; noteLocalSave(); onData("saves"); return true;
  }
  async function putSaveBack(s) {
    const { id, ...doc } = s;
    if (mode === "db") { const ok = await dbTry(() => db.doc(base() + "/account").collection("saves").doc(id).set(doc)); if (ok !== false) return ok === true; }
    const next = [s].concat(localSaves().filter((x) => x.id !== id)).sort((x, y) => (y.at || 0) - (x.at || 0)).slice(0, SAVE_MAX_LOCAL);
    if (!lsWrite(SAVES_LOCAL, next)) return false;
    st.saves = next; noteLocalSave(); onData("saves"); return true;
  }
  async function restoreSave(s) {
    let data; try { data = JSON.parse(s.data); } catch { toast("That save couldn't be read."); return false; }
    if (!(await makeSave("Before restoring “" + s.name + "”", true))) return false;
    try {
      await bulk(async () => { await whenLoaded(); await resetAll(); await importData(data); });
    } catch { toast("The restore couldn't finish because storage is full. Your work from before is kept as a save.", { error: true }); return false; }
    render(true); toast("Restored “" + s.name + "”. Your work from before is kept as a save.");
    return true;
  }
  async function deleteEverything() {
    const keep = st.account.businesses.slice();
    try {
      await bulk(async () => {
        for (const b of keep) { await switchBiz(b.id, { quiet: true, force: true }); await whenLoaded(); await resetAll(); }
      });
    } catch { return false; }
    for (const s of st.saves.slice()) await removeSave(s.id);
    if (mode === "db") {
      for (const b of keep) if (b.id !== "desk") await removeBiz(b.id);
      await putBiz("desk", { name: "My business", model: "", channel: "", order: 0 });
      for (const id of [...acc.badges]) await accDoc("account/badges/" + id, undefined);
      acc.badges = new Set();
      await setName("");
    } else if (!lsWrite(ACC_LOCAL, normAccount(null))) return false;
    st.account = mode === "db" ? (buildAccount(), st.account) : normAccount(null);
    await switchBiz("desk", { quiet: true, force: true });
    drawHeader(); render(true);
    return true;
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
  async function syncPlan(p) { return bulk(() => syncPlanNow(p)); }
  async function syncPlanNow(p) {
    const steps = applicable(p);
    const wanted = new Set(steps.map((s) => s.id));
    const have = new Set(st.tasks.filter((t) => t.source === "plan").map((t) => t.step));
    for (const s of steps) if (!have.has(s.id)) await putTask("plan-" + s.id + "-" + newId(), stepTask(s, p, p.start));
    for (const t of st.tasks.slice()) if (t.source === "plan" && !wanted.has(t.step) && t.status !== "done") await delTask(t.id);
    // Titles that depend on answers (e.g. the platform name) follow the current answers.
    for (const t of st.tasks.slice()) {
      if (t.source !== "plan" || !STEP[t.step] || !wanted.has(t.step)) continue;
      const title = val(STEP[t.step].title, p);
      if (t.title !== title && t.status !== "done") await putTask(t.id, { ...strip(t), title });
    }
  }
  async function catchUp() {
    const td = today();
    const left = planOrder().filter((t) => !STEP[t.step].ongoing && t.status !== "done");
    if (!left.length) return;
    const first = Math.min(...left.map((t) => t.day || 1));
    await bulk(async () => { for (const t of left) await putTask(t.id, { ...strip(t), due: addDays(td, (t.day || 1) - first) }); });
    lsSet("dd-catchup-hide", td + ":" + st.biz);
    toast("Done. Your next step is due today, and the rest follow at the same pace.");
  }
  async function restartPlan() {
    const p = { ...st.profile, start: today() };
    if (!(await saveProfile(p))) return;
    await bulk(async () => { for (const t of st.tasks.slice()) if (t.source === "plan" && t.status !== "done") await putTask(t.id, { ...strip(t), due: addDays(p.start, (t.day || 1) - 1) }); });
    toast("Plan dates now start today.");
  }

  // ---------------------------------------------------------------------------
  // Tasks: status changes and repeats
  // ---------------------------------------------------------------------------
  function nextDue(t) {
    const base = t.due && t.due > today() ? t.due : today();
    if (t.repeat === "daily") return addDays(base, 1);
    if (t.repeat === "weekly") return addDays(base, 7);
    if (t.repeat === "monthly") return addMonth(base, t.repeatDay || (t.due ? Number(t.due.slice(8)) : 0));
    return null;
  }
  async function setStatus(t, status, opts = {}) {
    if (readOnly) return;
    const was = t.status;
    const before = strip(st.tasks.find((x) => x.id === t.id) || t);
    let spawned = null, due = null;
    const repeats = status === "done" && was !== "done" && t.repeat && t.repeat !== "none";
    if (repeats) { due = nextDue(t); spawned = (t.source === "plan" ? "plan-" + t.step + "-" : "custom-") + newId(); }
    // Reopening a repeating task removes the next copy it made, if that copy hasn't been started.
    const made = was === "done" && status !== "done" && t.next ? st.tasks.find((x) => x.id === t.next && x.status === "todo") : null;
    const ok = await putTask(t.id, { ...strip(t), status, doneAt: status === "done" ? today() : null, next: spawned || (made ? null : t.next || null) });
    if (!ok) return false;
    if (made) await delTask(made.id);
    if (status === "done" && was !== "done") maybeCelebrate(t);
    if (repeats) await putTask(spawned, { ...strip(t), status: "todo", due, doneAt: null, next: null, createdAt: Date.now(), repeatDay: t.repeatDay || (t.due ? Number(t.due.slice(8)) : null) });
    const undo = async () => { await putTask(t.id, before); if (spawned) await delTask(spawned); if (made) await putTask(made.id, strip(made)); };
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
    if (st.busy) { st.dirty = true; return; }
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
    else if (kind === "sales" && (t === "today" || t === "tools")) render();
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
    const fk = !keep && a && a !== out && out.contains(a) ? focusKey(a) : null;
    // If that control disappears (a finished task leaves the list), the one now in its place gets focus.
    const nearSel = fk && a.classList && a.classList.length ? a.tagName.toLowerCase() + "." + CSS.escape(a.classList[0]) : null;
    const near = nearSel ? { sel: nearSel, i: [...out.querySelectorAll(nearSel)].indexOf(a) } : null;
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
    else if (fk) {
      let x = findByKey(out, fk);
      if (!x && near && near.i >= 0) { const list = [...out.querySelectorAll(near.sel)]; x = list.length ? list[Math.min(near.i, list.length - 1)] : null; }
      if (x) x.focus({ preventScroll: true }); else out.focus({ preventScroll: true });
    }
  }
  // A stable name for a control, so the same control gets focus back after the screen is rebuilt.
  function focusKey(x) {
    if (x.id) return "#" + x.id;
    if (x.dataset && x.dataset.fk) return "fk:" + x.dataset.fk;
    return x.tagName + "|" + (x.getAttribute("role") || "") + "|" + (x.getAttribute("aria-label") || "") + "|" + (x.textContent || "").trim().slice(0, 60);
  }
  function findByKey(root, k) {
    if (k.startsWith("#")) return root.querySelector(k.replace(/([^\w#-])/g, "\\$1"));
    if (k.startsWith("fk:")) return [...root.querySelectorAll("[data-fk]")].find((x) => x.dataset.fk === k.slice(3)) || null;
    return [...root.querySelectorAll("button, a[href], input, select, textarea, [tabindex]")].find((x) => focusKey(x) === k) || null;
  }

  // ----- Setup questions
  const QUESTIONS = [
    { key: "level", q: "How far along are you?", opts: () => [["new", "Haven't started", "Nothing set up yet"], ["store", "Set up, no sales yet", "Account or shop exists"], ["selling", "Already earning", "Getting orders or commissions"]] },
    { key: "model", q: "How do you want to make money?", opts: () => MODELS },
    { key: "channel", q: "Where will you do it?", opts: (a) => CHANNELS[a.model] || [] },
    { key: "country", q: "Where do you live?", opts: () => COUNTRIES },
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
    stock: ["Licences to your photos, videos and templates", "The stock site delivers the files to buyers", "No"],
    declutter: ["Things you already own", "You hand over or post each item", "No"],
    salesjob: ["A company's products or services", "The company provides what you sell", "No"],
    tutor: ["Lessons in a subject or language", "You teach live over video", "No"],
    clipping: ["Short clips cut from other creators' videos", "Nothing to ship", "No"],
    ugc: ["Product videos and photos for brands", "Nothing to ship; brands may send you the product", "No"],
  };
  const MODEL_FILTERS = [
    ["", "All"],
    ["nostock", "No stock to buy", (k) => MODEL_FACTS[k][2] === "No"],
    ["noship", "Nothing to ship", (k) => ["affiliate", "digital", "freelance", "creator", "courses", "newsletter", "stock", "salesjob", "tutor", "clipping", "ugc"].includes(k)],
    ["physical", "Physical products", (k) => ["supplier", "pod", "resell", "fba", "handmade", "declutter"].includes(k)],
    ["skill", "Uses a skill you have", (k) => ["pod", "freelance", "creator", "courses", "books", "newsletter", "handmade", "digital", "stock", "tutor", "clipping", "ugc"].includes(k)],
  ];
  const setup = { step: 0, draft: null, compare: false, filter: "", back: false };
  function startSetup(editing) { setup.draft = null; setup.step = editing ? 99 : 0; setup.compare = false; setup.filter = ""; setup.back = false; st.editingProfile = !!editing; }
  // After changing one answer from the review screen, go straight back to it.
  const advance = () => { setup.step = setup.back ? 99 : setup.step + 1; };
  // Where a platform isn't available, or only partly, in the chosen country.
  function availability(a) {
    const c = a.country, ch = a.channel, msgs = [];
    if (!c || !ch) return msgs;
    const name = COUNTRY_NAME[c];
    if (c === "in" && ["tiktok", "aff_tiktok", "tt_creator"].includes(ch)) msgs.push("<b>TikTok has been blocked in India since June 2020</b>, so the TikTok steps won't work from there.");
    if (ch === "tt_creator" && ["ca", "au", "ph", "ng"].includes(c)) msgs.push("<b>TikTok Creator Rewards isn't open in " + name + ".</b> TikTok's list of eligible countries is the US, UK, Germany, Japan, South Korea, France, Mexico and Brazil.");
    if (ch === "tt_creator" && c === "eu") msgs.push("<b>In the EU, TikTok Creator Rewards is open only in Germany and France.</b>");
    if (ch === "tiktok" && c === "eu") msgs.push("<b>TikTok Shop is open to sellers in only some EU countries:</b> France, Germany, Ireland, Italy and Spain, and since June 2026 Austria, Belgium, the Netherlands and Poland.");
    if (ch === "tiktok" && c === "ph") msgs.push("<b>TikTok Shop has a Philippine Seller Center.</b> Individual sellers there must be Philippine citizens aged 18 or over.");
    if (ch === "tiktok" && c === "br") msgs.push("<b>TikTok Shop launched in Brazil in May 2025</b> with its own Seller Center.");
    if (ch === "etsy" && c === "ng") msgs.push("<b>Etsy shops can't be opened in Nigeria</b>, because Etsy Payments isn't available there.");
    if (ch === "etsy" && c === "in") msgs.push("<b>New Etsy shops in India can sell internationally only</b> and must be paid through Payoneer.");
    if (["amazon", "amz_fba"].includes(ch) && ["ph", "ng"].includes(c)) msgs.push("<b>There's no Amazon marketplace in " + name + ".</b> Check Amazon Global Selling for whether you can register on another one.");
    if (ch === "aff_amazon" && ["ph", "ng"].includes(c)) msgs.push("<b>There's no Amazon Associates programme in " + name + "</b>, because there's no local Amazon store.");
    if (ch === "shopify" && ["in", "ph", "ng", "br"].includes(c)) msgs.push("<b>Shopify Payments isn't available in " + name + "</b>, so you'll need a third-party payment provider. Check Shopify's pricing for the extra fee that applies.");
    if (ch === "shopify" && c === "eu") msgs.push("<b>Shopify Payments is confirmed in Austria, Belgium, Czechia, Denmark, Finland, France, Germany, Ireland, Italy, the Netherlands, Poland, Portugal, Romania, Spain and Sweden.</b> Elsewhere, check Shopify's list.");
    if (ch === "direct" && c === "in") msgs.push("<b>New Stripe accounts in India are invite-only</b>, and PayPal India can receive payments from international customers only.");
    if (ch === "direct" && c === "ph") msgs.push("<b>Stripe isn't available in the Philippines.</b> PayPal can receive payments and withdraw to a local bank.");
    if (ch === "direct" && c === "ng") msgs.push("<b>Stripe doesn't offer standard accounts in Nigeria</b>, and new PayPal users there must link a partner bank to receive money.");
    return msgs;
  }
  const AVAIL_SRC = { in: ["inAppsBlocked", "inEtsy", "inStripe", "inPaypal"], eu: ["ttsEurope", "ttRewardsAcademy", "shopPayCountries"], ca: ["ttRewardsAcademy"], au: ["ttRewardsAcademy"],
    ph: ["ttRewardsAcademy", "phTts", "amzGlobal", "shopPayCountries", "stripeGlobal", "phPaypal"], ng: ["ttRewardsAcademy", "ngEtsy", "amzGlobal", "shopPayCountries", "stripeGlobal", "ngPaypal"], br: ["ttsBrazil", "shopPayCountries"] };
  function setupWarnings(a) {
    const msgs = availability(a);
    if (a.model === "clipping" && a.channel === "whop") msgs.push("<b>Content Rewards is for people 18 and older only</b>, even with a parent's permission.");
    if (a.model === "ugc" && a.channel === "billo" && a.country && !["us", "ca", "uk"].includes(a.country)) msgs.push("<b>Billo accepts creators only in the US, Canada and the UK.</b>");
    if (a.model === "creator" && a.channel === "yt_live") msgs.push("<b>You must be 16 or older to live stream on YouTube.</b> Ages 13–15 can take part only with an adult visibly in the stream.");
    if (a.channel === "tiktok" && a.country && a.country !== "us") msgs.push("<b>The TikTok Shop steps follow TikTok Shop US rules.</b> Sellers elsewhere should check their own country's Seller Center.");
    if (a.channel === "aff_tiktok" && a.country && a.country !== "us") msgs.push("<b>The TikTok Shop affiliate steps follow US rules.</b> Other countries have their own requirements.");
    if (a.model === "fba") msgs.push("<b>Amazon FBA means paying for stock before you sell anything.</b> Only invest what you can afford to lose; the plan has you check every fee first.");
    if (a.ads === "some" && ADS_MODELS.includes(a.model)) msgs.push("<b>Only spend what you can afford to lose.</b> The plan has you work out your break-even before any ad runs.");
    return msgs;
  }
  function compareTable(onPick) {
    const tw = el("div", "tablewrap"); const t = el("table", "compare");
    t.innerHTML = "<caption class=\"small muted\" style=\"text-align:left;padding-bottom:6px\">The " + MODELS.length + " ways to earn, side by side</caption><thead><tr><th scope=\"col\">Way to earn</th><th scope=\"col\">What you sell</th><th scope=\"col\">Who makes or ships it</th><th scope=\"col\">Stock to buy first</th><th scope=\"col\">Where (in this app)</th><th scope=\"col\"></th></tr></thead>";
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
      const prof = { level: a.level, model: a.model, channel: a.channel, country: a.country, ads: a.ads, start: (st.profile && st.profile.start) || today(), choices: (st.profile && st.profile.choices) || {}, week2: !!(st.profile && st.profile.week2) };
      save.disabled = true; save.textContent = "Building…";
      const first = !st.profile;
      if (!(await saveProfile(prof))) { save.disabled = false; save.textContent = first ? "Build my plan" : "Update my plan"; return; }
      st.profile = prof; st.editingProfile = false; setup.draft = null;
      try { await syncPlan(prof); } catch {}
      if (first) track("plan-built-" + prof.model);
      keepStorage();
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
    resell: "Days 1–3 set up and learn what sells; days 3–5 buy and list your first items; days 6–7 promote your listings and be ready to ship.",
    freelance: "Days 1–4 set up your offer, rate and profile; days 5–7 pitch your first clients.",
    creator: "Days 1–3 learn the program rules and plan your content; days 4–7 post on a schedule. Platform payouts start only after you qualify and are approved.",
    courses: "Days 1–3 set up and check demand; days 4–7 build the first module and open enrolment to a small group.",
    books: "Days 1–3 set up KDP and plan the book; days 4–7 work on the cover, pricing and description. Writing a book takes longer than a week; this sets you up.",
    newsletter: "Days 1–4 set up, learn the email rules and write ahead; days 5–7 find your first readers.",
    fba: "This week is research and numbers: account, fees, samples and brand. Stock usually takes weeks to make and ship, so don't order until the numbers work.",
    handmade: "Days 1–3 check the rules and price your work; days 4–7 photograph, list and promote.",
    stock: "Days 1–2 check you can join and learn the AI, release and trademark rules; days 3–5 make your first files and submit them; days 6–7 set up payouts and learn from rejections.",
    declutter: "Days 1–2 pick where to sell and check its rules; days 3–4 photograph, price and list your first items; days 5–7 hand over or post what sells and check your numbers.",
    salesjob: "This week is about finding a real role: how sales jobs pay, how to spot job scams, then your profile, search and first applications. It's a job, not a business, so there's nothing to buy.",
    tutor: "Days 1–3 check a platform's rules and apply; days 4–7 set up your profile, rate and first lessons. Acceptance can take time, and no platform guarantees students.",
    clipping: "Days 1–2 learn the permission and payout rules; days 3–5 set up your tools and make your first clips; days 6–7 submit or pitch and review. You're paid only for approved work: verified views on campaigns, or jobs a creator agrees to.",
    ugc: "Days 1–2 check you qualify and learn who owns your videos; days 3–4 make samples and finish your profile; days 5–7 apply to briefs and deliver. Brands choose who they hire, so the first job can take a while.",
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
    left.append(el("h2", null, p.week2 ? "Your 2-week plan" : "Your 7-day plan"));
    const chips = el("div", "chips");
    [MODEL_NAME[p.model], CHANNEL_NAME[p.channel], labelFor("level", p.level), labelFor("country", p.country), !ADS_MODELS.includes(p.model) ? null : p.ads === "some" ? "Paid ads" : "No paid ads"].filter(Boolean).forEach((c) => chips.append(el("span", "chip", c)));
    left.append(chips);
    const av = availability(p);
    if (av.length) { const n = html("div", "note", av.join("<br>")); const sb = sourcesBlock(AVAIL_SRC[p.country]); if (sb) n.append(sb); left.append(n); }
    left.append(html("p", "small muted", (SHIP(p) ? PLAN_INTRO.ship : PLAN_INTRO[p.model] || "") + " <b>No guide can promise income in a week</b>: that depends on what you sell, your price and whether people buy. Each step shows where its facts come from, and the calculators show your numbers before you spend money."));
    const real = REALISTIC[p.model];
    if (real) {
      const d = el("details", "fold realistic"); d.open = !!lsGet("dd-fold-real", false);
      d.addEventListener("toggle", () => lsSet("dd-fold-real", d.open));
      const sm = el("summary"); sm.append(el("b", null, "What's realistic"), el("span", "small muted", " · income, payout waits and start-up costs"));
      d.append(sm, html("div", "prose", realisticBody(p)));
      const sb = sourcesBlock(real.src); if (sb) d.append(sb);
      left.append(d);
    }
    const btns = el("div", "row-gap");
    const edit = el("button", "btn sm", "Change answers"); edit.type = "button"; edit.onclick = () => { startSetup(true); render(); };
    const restart = el("button", "btn sm", "Restart dates from today"); restart.type = "button"; restart.onclick = restartPlan;
    if (!readOnly) btns.append(edit, restart);
    if (!readOnly && !p.week2 && hasWeek2(p)) {
      const w2 = el("button", "btn sm primary", "Add week 2 (days 8–14)"); w2.type = "button";
      w2.onclick = async () => { const np = { ...p, week2: true }; if (await saveProfile(np)) { await syncPlan(np); track("week2-added"); toast("Week 2 added: review your numbers, improve what you have and grow."); } };
      btns.append(w2);
    }
    if (PLAT && downloads) { const cal = el("button", "btn sm", "Add to calendar"); cal.type = "button"; cal.onclick = saveIcs; btns.append(cal); }
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
    for (let d = 1; d <= 14; d++) {
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
    const c = el("button", "check"); c.type = "button"; c.setAttribute("role", "checkbox"); c.dataset.fk = "chk:" + t.id;
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
    dhl: ["DHL", "https://www.dhl.com/", "Parcel and express shipping in many countries."],
    canadaPost: ["Canada Post", "https://www.canadapost-postescanada.ca/", "Canada's national postal service.", "ca"],
    ausPost: ["Australia Post", "https://auspost.com.au/", "Australia's national postal service.", "au"],
    indiaPost: ["India Post", "https://www.indiapost.gov.in/", "India's national postal service.", "in"],
    phlPost: ["PHLPost", "https://www.phlpost.gov.ph/", "The Philippines' national postal service.", "ph"],
    nipost: ["NIPOST", "https://www.nipost.gov.ng/", "Nigeria's national postal service.", "ng"],
    correios: ["Correios", "https://www.correios.com.br/", "Brazil's national postal service.", "br"],
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
    adobeStock: ["Adobe Stock", "https://contributor.stock.adobe.com/", "Sell photos, videos and illustrations; AI work allowed if labelled."],
    shutterstock: ["Shutterstock", "https://submit.shutterstock.com/", "Sell photos, videos and illustrations; no AI-generated uploads."],
    canvaCreators: ["Canva Creators", "https://www.canva.com/creators/", "Publish templates in Canva once your application is approved."],
    creativeMarket: ["Creative Market", "https://creativemarket.com/sell", "Marketplace for templates, fonts and graphics; you apply to open a shop."],
    offerup: ["OfferUp", "https://offerup.com/", "Local buying and selling; pickup only since 2025.", "us"],
    preply: ["Preply", S.preplyTeach[1], "Tutoring marketplace where you set your own rate."],
    italki: ["italki", S.italkiApply[1], "Language tutoring marketplace."],
    cambly: ["Cambly", S.camblyTutors[1], "English tutoring paid per minute."],
    wyzant: ["Wyzant", S.wyzantHow[1], "Tutoring marketplace for US residents.", "us"],
    outschool: ["Outschool", S.outschoolTeach[1], "Live online classes for children."],
    linkedinJobs: ["LinkedIn Jobs", "https://www.linkedin.com/jobs/", "Search jobs, set alerts and apply."],
    indeed: ["Indeed", "https://www.indeed.com/", "Job search site."],
  };
  // def: the option this plan's own steps are written for. channel: the
  // choice overlaps the "Where will you do it?" answer.
  const DEF_BY_CHANNEL = { shopify: "shopify", etsy: "etsy", gumroad: "gumroad", payhip: "payhip", ebay: "ebay", mercari: "mercari", poshmark: "poshmark", fiverr: "fiverr", upwork: "upwork", teachable: "teachable", thinkific: "thinkific", kdp: "kdp", substack: "substack", beehiiv: "beehiiv", aff_amazon: "amzAssoc", aff_tiktok: "ttsAff", aff_network: "awin", tiktok: "ttShop", amazon: "amazonSell", adobe_stock: "adobeStock", shutterstock: "shutterstock", canva_creators: "canvaCreators", fbm: "fbMarket", offerup: "offerup", vinted: "vinted", depop: "depop", ebay_own: "ebay", preply: "preply", italki: "italki", cambly: "cambly", wyzant: "wyzant", outschool: "outschool" };
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
    shipping: { title: "Shipping labels", ask: "Where will you buy shipping labels?", items: ["pirateship", "usps", "ups", "dhl", "clickDrop", "evri", "parcel2go", "canadaPost", "ausPost", "indiaPost", "phlPost", "nipost", "correios"], note: "Marketplaces like eBay also sell labels inside their own site." },
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
    stockPlatform: { title: "Where you'll sell", ask: "Where will you sell your files?", items: ["adobeStock", "shutterstock", "canvaCreators", "creativeMarket"], def: byChannel, channel: true, note: "Each site has its own rules on AI-generated work and releases. Read them before you upload." },
    stockEdit: { title: "Editing", ask: "What will you edit your photos and clips with?", items: ["lightroom", "photopea", "davinci", "capcut"], note: "Edit only photos and clips you made yourself." },
    declutterMarket: { title: "Where you'll sell", ask: "Where will you sell your things?", items: ["fbMarket", "offerup", "vinted", "depop", "ebay"], def: byChannel, channel: true, note: "Fees and payout times differ; check each one's fee page before you list." },
    tutorPlatform: { title: "Tutoring platform", ask: "Where will you teach?", items: ["preply", "italki", "cambly", "wyzant", "outschool"], def: byChannel, channel: true, note: "Each platform has its own eligibility rules and takes a different share." },
    jobBoard: { title: "Job search", ask: "Where will you look for roles?", items: ["linkedinJobs", "indeed", "linkedin"], note: "Never pay to apply for a job." },
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
    "st1-rules": "stockPlatform", "st4-make": (p) => (p.channel === "canva_creators" ? null : "stockEdit"), "st7-review": "bookkeeping", "on-stock-batch": (p) => (p.channel === "canva_creators" ? null : "stockEdit"),
    "dc1-account": "declutterMarket", "dc3-photos": "photos", "dc5-ship": "shipping", "dc7-review": "bookkeeping", "on-dc-handover": (p) => (p.channel === "offerup" ? null : "shipping"),
    "sj4-search": "jobBoard", "sj6-apply": "jobBoard", "on-sj-apply": "jobBoard",
    "tu1-pay": "tutorPlatform", "tu5-lesson": "recording", "tu7-review": "bookkeeping",
    "cl1-hire": "freelancePlatform", "cl5-pitch": "freelancePlatform", "cl3-tools": "video", "cl4-clips": "video", "on-clip": "video", "cl6-agree": "invoicing", "cl7-review": "bookkeeping",
    "u2-ads": "productResearch", "u3-samples": "video", "u4-profile": (p) => (p.channel === "ugc_direct" ? "portfolio" : null), "u6-paid": (p) => (p.channel === "ugc_direct" ? "invoicing" : null), "u7-review": "bookkeeping", "on-ugc-sample": "video",
    "lv6-clips": "video",
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
  // Several channels can share one option (eBay for reselling and for your own things), so look at this model's channels.
  const MODEL_CHANNEL_HAS = (p, optId) => (CHANNELS[p.model] || []).some((c) => DEF_BY_CHANNEL[c[0]] === optId || (optId === "shopDigital" && c[0] === "shopify"));
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
    const card = el("details", "card tools-card"); card.open = lsGet("dd-tools-open", false);
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
    stock: ["trends", "describe"], declutter: ["profit", "describe", "trends"], salesjob: ["helper"], tutor: ["rate", "helper"],
    clipping: ["rate", "hooks", "helper"], ugc: ["rate", "describe", "helper"],
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
    const dayN = Math.round((parse(td) - parse(p.start)) / 864e5) + 1;

    const head = el("div", "hello");
    const h = el("div"); h.style.display = "grid"; h.style.gap = "4px";
    const nm = displayName().split(/\s+/)[0];
    h.append(el("h2", null, greeting() + (nm ? ", " + nm : "")), el("span", "small muted", parse(td).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + " · " + curBiz().name + " · " + MODEL_NAME[p.model] + " on " + (CHANNEL_NAME[p.channel] || "")));
    head.append(h); wrap.append(head);
    wrap.append(trackCard(p, oneOff, dayN, renderAnimate));

    const grid = el("div", "today-grid");
    const left = el("div", "col-stack"), right = el("div", "col-stack");

    // Behind schedule: offer to move what's left to start today.
    const overdue = oneOff.filter((t) => t.status !== "done" && t.due && t.due < td);
    if (overdue.length >= 2 && lsGet("dd-catchup-hide", "") !== td + ":" + st.biz) {
      const cu = el("section", "card catchup");
      const leftN = oneOff.filter((t) => t.status !== "done").length;
      cu.append(el("h3", null, "Pick up where you left off"));
      cu.append(el("p", "small muted", (dayN > 7 ? "Your plan week has passed" : "You're on day " + dayN) + " with " + leftN + (leftN === 1 ? " step" : " steps") + " to go. That's normal: most people need more than a week. Move what's left so it starts today, at the same pace."));
      const r = el("div", "row-gap");
      const mv = el("button", "btn primary", "Move my remaining steps to start today"); mv.type = "button"; mv.onclick = () => catchUp();
      const kp = el("button", "btn", "Keep the dates"); kp.type = "button"; kp.onclick = () => { lsSet("dd-catchup-hide", td + ":" + st.biz); render(); };
      r.append(mv, kp); cu.append(r); left.append(cu);
    }

    // Up next
    const n = oneOff.find((t) => t.status !== "done");
    const next = el("section", "card next");
    if (n) {
      const s = STEP[n.step];
      next.append(el("span", "up-tag", "Up next · Day " + n.day), el("span", "label", AREA[n.area] || ""));
      next.append(el("h3", null, n.title));
      const ml = stepFacts(s.id, p, "compact");
      if (ml) next.append(ml);
      else {
        const plain = el("div"); plain.innerHTML = val(s.body, p) || "";
        plain.querySelectorAll("p, li, br, tr, h3, h4").forEach((x) => x.append(" "));
        const txt = (plain.textContent || "").replace(/\s+/g, " ").trim();
        if (txt) next.append(el("p", "small muted", txt.length > 180 ? txt.slice(0, 177).replace(/\s+\S*$/, "") + "…" : txt));
      }
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

    // Account and install prompts, at moments they help (and never twice after "Not now").
    const doneAny = st.tasks.some((t) => t.status === "done");
    if (ACCOUNTS && mode === "local") {
      const seen = lsGet("dd-acct-prompt", 0);
      if (seen === 0 || (seen === 1 && doneAny)) {
        const ac = el("section", "card prompt");
        ac.append(el("h3", null, doneAny ? "Nice work. Keep it safe with a free account" : "Keep your plan safe with a free account"));
        ac.append(el("p", "small muted", "Right now your plan lives only in this browser. With an account it's saved for you and opens on your phone and computer. Your work so far comes with you."));
        const r = el("div", "row-gap");
        const go = el("button", "btn primary", "Create a free account"); go.type = "button"; go.onclick = () => PLAT.showAuth("signup");
        const no = el("button", "btn", "Not now"); no.type = "button"; no.onclick = () => { lsSet("dd-acct-prompt", doneAny ? 2 : 1); render(); };
        r.append(go, no); ac.append(r); left.append(ac);
      }
    }
    if (WEB && doneAny && PLAT.canInstall() && !lsGet("dd-install-prompt", false)) {
      const ic = el("section", "card prompt");
      ic.append(el("h3", null, "Put Startline on your home screen"));
      ic.append(el("p", "small muted", PLAT.isIOS() ? "In Safari, tap the Share button, then “Add to Home Screen”. It opens like an app and works offline." : "Install it to open it like an app, in its own window, even offline."));
      const r = el("div", "row-gap");
      if (!PLAT.isIOS()) { const go = el("button", "btn primary", "Install"); go.type = "button"; go.onclick = async () => { await installApp(); lsSet("dd-install-prompt", true); render(); }; r.append(go); }
      const no = el("button", "btn", PLAT.isIOS() ? "Got it" : "Not now"); no.type = "button"; no.onclick = () => { lsSet("dd-install-prompt", true); render(); };
      r.append(no); ic.append(r); left.append(ic);
    }

    const ckKey = "dd-checkin:" + st.biz;
    if (WEB && PLAT.canSendFeedback() && dayN >= 7 && !lsGet(ckKey, false)) {
      const ck = el("section", "card prompt");
      ck.append(el("h3", null, "Quick check-in: how's it going?"), el("p", "small muted", "One tap, anonymous: only your answer, the way you're earning and the plan day are sent. It helps make Startline better for everyone."));
      const r = el("div", "row-gap");
      [["earning", "I've made money"], ["not-yet", "Not yet"], ["stopped", "I've stopped"]].forEach(([k, l]) => {
        const b = el("button", "btn", l); b.type = "button";
        b.onclick = async () => { lsSet(ckKey, true); render(); try { await PLAT.sendFeedback({ kind: "checkin", model: p.model, day: Math.min(dayN, 400), answer: k }); toast("Thanks for letting us know."); } catch { toast("That couldn't be sent. No problem."); } };
        r.append(b);
      });
      const no = el("button", "btn", "Not now"); no.type = "button"; no.onclick = () => { lsSet(ckKey, true); render(); }; r.append(no);
      ck.append(r); left.append(ck);
    }

    // Today's list: the rest of today's plan steps, then anything else due, then quick add.
    const todays = dayN >= 1 && dayN <= (p.week2 ? 14 : 7) ? oneOff.filter((t) => t.day === dayN && (!n || t.id !== n.id)) : [];
    const shownIds = new Set(todays.map((t) => t.id).concat(n ? [n.id] : []));
    const dueList = st.tasks.filter((t) => t.status !== "done" && t.due && t.due <= td && !shownIds.has(t.id)).sort(sortTasks);
    const daySec = el("section", "card");
    const openToday = todays.filter((t) => t.status !== "done").length + dueList.length;
    const dh = el("div", "section-head"); dh.append(el("h3", null, "Today's list"), el("span", "small muted", openToday ? openToday + " to do" : todays.length ? "All done" : ""));
    daySec.append(dh);
    if (todays.length) { const list = el("div", "checklist"); todays.forEach((t) => list.append(stepRow(t))); daySec.append(list); }
    if (dueList.length) { const rows = el("div", "rows"); dueList.slice(0, 8).forEach((t) => rows.append(row(t))); daySec.append(rows); if (dueList.length > 8) { const more = el("button", "btn sm", "See all " + dueList.length); more.type = "button"; more.onclick = () => { st.ui.quick = null; setTab("tasks"); }; daySec.append(more); } }
    if (!todays.length && !dueList.length) daySec.append(el("p", "small muted", "Nothing else is due today. Work on the next step above, or add your own task."));
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
      const due = r.due || today();
      await putTask(id, { title: r.title, area: r.area || lsGet("dd-lastArea", "orders"), prio: r.prio || "med", due, status: "todo", product: "", supplier: "", ref: "", notes: "", repeat: "none", createdAt: Date.now(), doneAt: null, source: "custom" });
      toast("Added, due " + fmtDue(due).toLowerCase() + ".", { undo: () => delTask(id) });
      setTimeout(() => { const x = $("#quickAdd"); if (x) x.focus(); }, 0);
    });
    daySec.append(qf, qp);
    left.append(daySec);

    // This week: activity, gentle (no streak to lose). Shown once something has been finished.
    if (doneAny) {
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
      wk.append(dots, el("p", "small muted", "You finished tasks on " + active + " of the last 7 days. Any day you finish one counts."));
      right.append(wk);
    }

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
    c.append(el("h2", null, "Start an online business, one step at a time"));
    const names = MODELS.map((m) => m[1].replace(/ \(.*\)$/, "").toLowerCase());
    c.append(el("p", null, "Answer five quick questions and you'll get a 7-day plan for how you want to earn: " + names.slice(0, -1).join(", ") + " or " + names.slice(-1)[0] + ". Each step explains what to do, what it costs, links to the right site and shows its sources."));
    c.append(el("p", "small muted", "No guide can promise income in a week. What this app can do is show you the real steps, the real fees and your numbers before you spend money. It's general information, not financial, legal or tax advice."));
    const row = el("div", "row-gap");
    const go1 = el("button", "btn primary", "Build my plan"); go1.type = "button"; go1.onclick = () => { startSetup(false); setTab("plan"); };
    const go2 = el("button", "btn", "Compare the " + MODELS.length + " ways to earn"); go2.type = "button"; go2.onclick = () => { startSetup(false); setup.step = 1; setup.compare = true; setTab("plan"); };
    const go3 = el("button", "btn", "Just open the calculators"); go3.type = "button"; go3.onclick = () => openTool("profit");
    row.append(go1, go2, go3); c.append(row);
    if (ACCOUNTS && mode === "local") { const si = el("button", "linkish", "Already have an account? Sign in"); si.type = "button"; si.onclick = () => PLAT.showAuth("signin"); c.append(si); }
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
    const ml = stepFacts(s.id, p); if (ml) box.append(ml);
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
      const b = el("button", "chip"); b.type = "button"; b.setAttribute("aria-pressed", String(u.area === k)); b.dataset.fk = "area:" + k;
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
    const pw = ({ high: "High", med: "Medium", low: "Low" }[t.prio] || "Medium") + " priority";
    const p = el("span", "prio " + (t.prio || "med")); p.title = pw; p.append(el("span", "sr-only", pw)); m.append(p);
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
    const c = el("button", "check"); c.type = "button"; c.setAttribute("role", "checkbox"); c.dataset.fk = "chk:" + t.id;
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
    let ok;
    if (status !== t.status) ok = (await setStatus({ id: t.id, ...data }, status)) !== false;
    else { ok = await putTask(t.id, data); if (ok) toast("Saved."); }
    if (ok) $("#editDlg").close();
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
    const src = sourcesBlock(val(l.src, st.profile)); if (src) box.append(src);
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

  // ----- Learn: what fits your plan first, everything else folded away, with search.
  let learnQ = "";
  function renderLearn() {
    const p = st.profile;
    const wrap = el("div"); wrap.style.display = "grid"; wrap.style.gap = "18px";
    const readN = LESSONS.filter((l) => st.learn["lesson-" + l.id]).length + COURSES.filter((c) => st.learn[c.id]).length;
    const head = el("div", "section-head"); head.append(el("h2", null, "Learn"), el("span", "small muted", readN + " of " + (LESSONS.length + COURSES.length) + " done"));
    wrap.append(head);
    const sf = el("div", "field"); const sl = el("label", "label", "Search lessons and courses"); sl.htmlFor = "learnQ";
    const si = el("input"); si.type = "search"; si.id = "learnQ"; si.value = learnQ; si.placeholder = "e.g. fees, Etsy, taxes, video";
    si.oninput = () => { learnQ = si.value; render(); };
    sf.append(sl, si); wrap.append(sf);
    const lessonRow = (l) => {
      const isDone = !!st.learn["lesson-" + l.id];
      const r = el("div", "learn-row" + (isDone ? " isdone" : ""));
      const info = el("div"); info.append(el("b", null, l.title), el("span", "small muted", "Lesson in this app · about " + l.mins + " min"));
      const act = el("div", "row-gap");
      const bt = el("button", "btn sm" + (isDone ? "" : " primary"), isDone ? "Read again" : "Read"); bt.type = "button"; bt.setAttribute("aria-label", (isDone ? "Read again: " : "Read: ") + l.title); bt.onclick = () => openLesson(l.id);
      act.append(bt); if (isDone) act.append(el("span", "pill ok", "Read"));
      r.append(info, act); return r;
    };
    const courseRow = (c) => {
      const isDone = !!st.learn[c.id];
      const r = el("div", "learn-row" + (isDone ? " isdone" : ""));
      const info = el("div"); info.append(el("b", null, c.title), el("span", "small muted", c.by + " · " + c.len + (c.note ? " · " + c.note : "")));
      const act = el("div", "row-gap");
      act.append(extLink({ label: "Open course", url: c.url, name: c.title }, "btn sm"));
      if (!readOnly) {
        const lab = el("label", "toggle"); const cb = el("input"); cb.type = "checkbox"; cb.id = "course-" + c.id; cb.checked = isDone;
        cb.onchange = () => setLearn(c.id, cb.checked); lab.append(cb, document.createTextNode("Done")); act.append(lab);
      }
      r.append(info, act); return r;
    };
    const q = learnQ.trim().toLowerCase();
    if (q) {
      const words = q.split(/\s+/);
      const hit = (t) => words.every((w) => t.toLowerCase().includes(w));
      const ls = LESSONS.filter((l) => hit(l.title + " " + (val(l.body, p || {}) || "").replace(/<[^>]+>/g, " ")));
      const cs = COURSES.filter((c) => hit(c.title + " " + c.by + " " + (c.note || "")));
      const box = el("section", "card"); box.append(el("h3", null, ls.length + cs.length ? (ls.length + cs.length) + " found" : "Nothing found"));
      const list = el("div", "learn-list"); ls.forEach((l) => list.append(lessonRow(l))); cs.forEach((c) => list.append(courseRow(c)));
      box.append(list); wrap.append(box);
      return wrap;
    }
    const fitL = p ? LESSONS.filter((l) => l.fit(p)) : [], fitC = p ? COURSES.filter((c) => c.fit(p)) : [];
    if (fitL.length || fitC.length) {
      const sec = el("section", "card");
      sec.append(el("h3", null, "For your plan"), el("p", "small muted", "Short lessons with sourced facts, and free courses run by the platforms themselves (they open in a new tab)."));
      const list = el("div", "learn-list"); fitL.forEach((l) => list.append(lessonRow(l))); fitC.forEach((c) => list.append(courseRow(c)));
      sec.append(list); wrap.append(sec);
    } else wrap.append(el("p", "small muted", "Build your plan and the lessons and courses for it come first here."));
    const restL = LESSONS.filter((l) => !fitL.includes(l)), restC = COURSES.filter((c) => !fitC.includes(c));
    const fold = (title, key, rows) => {
      if (!rows.length) return;
      const d = el("details", "card fold"); d.open = !!lsGet(key, false);
      d.addEventListener("toggle", () => lsSet(key, d.open));
      const sm = el("summary"); sm.append(el("b", null, title), el("span", "small muted", " · " + rows.length)); d.append(sm);
      const list = el("div", "learn-list"); rows.forEach((r) => list.append(r)); d.append(list);
      wrap.append(d);
    };
    fold(p ? "More lessons" : "Lessons in this app", "dd-fold-lessons", restL.map(lessonRow));
    fold(p ? "More free courses from the platforms" : "Free courses from the platforms", "dd-fold-courses", restC.slice().sort((x, y) => x.by.localeCompare(y.by) || x.title.localeCompare(y.title)).map(courseRow));
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
    { id: "sales", group: "Records", name: "Sales log" },
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
      CV.fee = (st.profile && ((st.profile.country === "uk" && { etsy: "etsyUK" }[st.profile.channel]) || DEFAULT_FEE[st.profile.channel])) || "shopify";
      const f = FEES[CV.fee]; CV.pct = f.pct == null ? "" : f.pct; CV.fixed = f.fixed == null ? "" : f.fixed;
      lsSet("dd-calc2", CV);
    }
  }
  const FEE_SRC_KEY = { etsyUK: "etsyUKSell", ebayUKprivate: "ebayUKPrivate", ebayUKbusiness: "ebayUKBusiness", fiverr: "fiverrVsUpwork", upwork: "upworkFee", stripeUS: "stripePricing", substack: "substackCost", teachableStarter: "teachableFees", teachablePaid: "teachableFees", thinkific: "thinkific", amazonFBA: "fbaCalc", shopify: "shopPricing", shopify3p: "shopPricing", etsy: "etsyFees", ebay: "ebayFees", tiktok: "ttsHome", amazonI: "amzPricing", amazonP: "amzPricing", mercari: "mercariFees", poshmark: "poshFees", gumroad: "gumroadFees", gumroadDiscover: "gumroadFees", payhipFree: "payhip", payhipPlus: "payhip", payhipPro: "payhip" };
  function feeOf(price, key = CV.fee, pct = nv("pct"), fixed = nv("fixed")) {
    if (key === "poshmark" && price < 15) return 2.95;
    if ((key === "ebay" || key === "ebayUKbusiness") && fixed == null) fixed = price > 10 ? 0.4 : 0.3;
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
      const f = FEES[sel.value]; const fc = f.cur || "USD";
      hint.textContent = (f.hint || "") + (f.fixed !== 0 && sel.value !== "custom" && fc !== userCur() ? " The fixed fee here is in " + curName(fc) + "; convert it to your currency." : "");
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
    if (CALC_TOOLS.has(currentTool)) toolBody.append(currencyPicker());
    const fn = { profit: toolProfit, price: toolPrice, maxbuy: toolMaxBuy, affiliate: toolAffiliate, rate: toolRate, royalty: toolRoyalty, recurring: toolRecurring, creator: toolCreator, compare: toolCompare, ads: toolAds, discount: toolDiscount, sales: toolSales, evaluate: toolEvaluate,
      trends: toolTrends, delivery: toolDelivery, messages: toolMessages, helper: toolHelper, describe: toolDescribe, hooks: toolHooks, directory: toolDirectory }[currentTool] || toolProfit;
    toolBody.append(fn());
    if (CALC_TOOLS.has(currentTool)) toolBody.append(el("p", "small muted calc-note", "Estimates from the numbers you enter and the published fees shown. Fees change, so check them on each platform. Not financial or tax advice."));
  }
  function currencyPicker() {
    const f = el("div", "field cur-pick"); const l = el("label", "label", "Currency"); l.htmlFor = "calcCur";
    const sel = el("select"); sel.id = "calcCur";
    const home = COUNTRY_CUR[st.profile && st.profile.country] || "USD";
    fill(sel, [["", "Match my country (" + home + ")"]].concat(CURRENCIES.map((c) => [c, c + " · " + curName(c)])));
    sel.value = lsGet("dd-cur", "") || "";
    sel.onchange = () => { lsSet("dd-cur", sel.value); renderTool(); const s2 = $("#calcCur"); if (s2) s2.focus(); };
    f.append(l, sel); return f;
  }
  const CALC_TOOLS = new Set(["sales", "profit", "price", "maxbuy", "affiliate", "rate", "royalty", "recurring", "creator", "compare", "ads", "discount"]);
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
      const ebayLike = CV.fee === "ebay" || CV.fee === "ebayUKbusiness";
      let price = solve(fixedRaw == null && ebayLike ? 0.4 : fixedRaw || 0);
      if (price != null && ebayLike && fixedRaw == null && price <= 10) price = solve(0.3);
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
      oLine(out, "Rule of thumb: 10× break-even cost a day", money(before * 10) + "/day");
      out.append(el("p", "small muted", "A common rule of thumb, not a Meta rule: budget about 10 times your target cost per result each day. Meta's own minimum is about $1 a day per ad set for most advertisers charged per impression."));
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
  // Sales log: real numbers for the weekly check. Totals are kept per currency.
  function toolSales() {
    const sec = toolCard("Sales log", "Write down each sale as it happens, so your weekly check uses real numbers. Amounts are in the currency picked above.");
    const { form, out } = calcLayout(sec);
    const txt = (id, label, type) => { const f = el("div", "field"); const l = el("label", "label", label); l.htmlFor = id; const i = el("input"); i.id = id; i.type = type; f.append(l, i); form.append(f); return i; };
    const date = txt("n-sDate", "Date", "date"); date.value = today();
    const item = txt("n-sItem", "What sold", "text"); item.maxLength = 120;
    const amt = numField(form, "sAmount", "Amount the buyer paid");
    const fees = numField(form, "sFees", "Platform and payment fees");
    const costs = numField(form, "sCosts", "Your costs for this sale", { hint: "Product, shipping and packaging." });
    const n = (v) => (v === "" || !isFinite(Number(v)) ? null : Number(v));
    if (!readOnly) {
      const add = el("button", "btn primary", "Add sale"); add.type = "button"; form.append(add);
      add.onclick = async () => {
        const a = n(amt.value); if (a == null || !/^\d{4}-\d{2}-\d{2}$/.test(date.value)) { toast("Enter the date and the amount."); amt.focus(); return; }
        const ok = await putDoc("sales", newId(), { date: date.value, amount: a, fees: n(fees.value) || 0, costs: n(costs.value) || 0, qty: 1, item: item.value.trim().slice(0, 120),
          platform: (st.profile && CHANNEL_NAME[st.profile.channel]) || "", note: "", currency: userCur(), at: Date.now() });
        if (ok) { ["sAmount", "sFees", "sCosts"].forEach((k) => cvSet(k, "")); toast("Sale added."); }
      };
    }
    const rows = st.sales.slice().sort((x, y) => (y.date || "").localeCompare(x.date || "") || (y.at || 0) - (x.at || 0));
    if (!rows.length) { out.append(el("p", "muted", "No sales yet. Each one you add shows here, with totals for this month.")); return sec; }
    const month = today().slice(0, 7);
    const sum = (list) => { const t = {}; list.forEach((x) => { const c = x.currency || "USD"; const o = t[c] || (t[c] = { n: 0, got: 0, out: 0 }); o.n++; o.got += x.amount || 0; o.out += (x.fees || 0) + (x.costs || 0); }); return t; };
    [["This month", rows.filter((x) => (x.date || "").startsWith(month))], ["All time", rows]].forEach(([label, list]) => {
      Object.entries(sum(list)).forEach(([c, t]) => {
        oBig(out, label + " · " + t.n + (t.n === 1 ? " sale" : " sales"), money(t.got - t.out, c), t.got - t.out >= 0 ? "pos" : "neg");
        oLine(out, "Received", money(t.got, c)); oLine(out, "Fees and costs", "−" + money(t.out, c));
      });
    });
    out.append(el("span", "label", "Latest sales"));
    const list = el("ul", "sales-list");
    rows.slice(0, 30).forEach((x) => {
      const li = el("li"); li.append(el("span", null, fmtDay(x.date) + (x.item ? " · " + x.item : "")), el("b", null, money(x.amount || 0, x.currency || "USD")));
      if (!readOnly) {
        const del = el("button", "btn sm", "Delete"); del.type = "button"; del.setAttribute("aria-label", "Delete sale from " + fmtDay(x.date) + (x.item ? ", " + x.item : ""));
        del.onclick = async () => { const { id, ...data } = x; if (await delDoc("sales", id)) toast("Sale deleted.", { undo: () => putDoc("sales", id, data) }); };
        li.append(del);
      }
      list.append(li);
    });
    out.append(list);
    return sec;
  }
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
          // 60% from $9.99, 50% below: the lowest price is the printing cost divided by the rate that applies at that price.
          const m60 = Pc / 0.6, m50 = Pc / 0.5, lowest = m60 >= 9.99 ? m60 : m50 < 9.99 ? m50 : 9.99;
          oLine(out, "Lowest list price KDP allows", money(lowest));
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
        { name: "Gumroad (direct sale)", fee: (P) => P * 0.129 + 0.8, monthly: 0, note: "10% + 50¢ plus 2.9% + 30¢ card processing. A flat 30% (processing included) through Discover." },
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
      else add("ok", "Profit per order: " + money(profit), `Margin ${pct1(margin)}. Break-even ad cost: ${money(before)} per order. Meta's minimum is about $1 a day per ad set; set a test budget you can afford to lose.`, ["metaBudget"]);
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
    else if (p) sec.append(el("p", "small", "Checking against your plan: " + CHANNEL_NAME[p.channel] + ", " + (p.country !== "other" ? COUNTRY_NAME[p.country] || "outside the US and UK" : "outside the US/UK") + "."));
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
    const g = el("select"); g.id = "trGeo"; fill(g, GEOS); g.value = CV.trGeo ?? ({ us: "US", uk: "GB", ca: "CA", au: "AU" }[st.profile && st.profile.country] ?? (st.profile ? "" : "US")); fld("Country", g);
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
    const groups = {}; forYou.forEach((t) => { (groups[t.cat] = groups[t.cat] || []).push(t); });
    Object.entries(groups).forEach(([cat, list], i) => {
      const g = el("div", "site-rows");
      list.forEach((t) => { const a = extLink({ label: t.name, url: t.url, name: t.name }, "site-item"); a.append(el("span", "small muted", t.desc + (t.cost ? " · " + t.cost : ""))); g.append(a); });
      // The first groups (where you sell, suppliers, research) stay open; the rest fold away.
      if (i < 3) { fy.append(el("h3", "label site-group", cat), g); return; }
      const d = el("details", "fold site-fold"); d.open = !!lsGet("dd-fold-sites-" + cat, false);
      d.addEventListener("toggle", () => lsSet("dd-fold-sites-" + cat, d.open));
      const sm = el("summary"); sm.append(el("b", null, cat), el("span", "small muted", " · " + list.length)); d.append(sm, g); fy.append(d);
    });
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
      const days = (v) => (v == null ? v : Math.max(0, Math.min(365, Math.round(v))));
      const order = CV.dOrder || today(), H = days(nv("handling")) ?? 0, a = days(nv("shipMin")), b = days(nv("shipMax")) ?? a, unit = CV.dUnit || "calendar";
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
    await addBadges(fresh.map((b) => b[0]));
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
    if (one.length && one.every((x) => x.status === "done")) { { const p = st.profile || {}; celebrate(p.week2 ? "You finished your 2-week plan" : "You finished your 7-day plan", "Every step done. Keep the weekly tasks going and check your numbers." + (!p.week2 && hasWeek2(p) ? " Week 2 is ready on the Plan tab." : "")); } return; }
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
    // Redrawn when something changes in the background: keep what's being typed, and the focus.
    const typed = new Map([...box.querySelectorAll("input[id]")].map((i) => [i.id, i.value]));
    const focusId = document.activeElement && box.contains(document.activeElement) ? document.activeElement.id : "";
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
    nf.addEventListener("submit", async (e) => { e.preventDefault(); if (!(await setName(ni.value))) return; toast(ni.value.trim() ? "Saved. Hi, " + ni.value.trim() + "." : "Name cleared."); drawAccount(); if (st.tab === "today") render(); });
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
          del.disabled = true; del.textContent = "Deleting…"; const ok = await deleteBiz(b.id); toast(ok ? "Deleted " + b.name + "." : "Couldn't delete " + b.name + ". Try again.", ok ? {} : { error: true }); drawAccount();
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
      dzb.disabled = true; dzs.textContent = "Deleting…"; const ok = await deleteEverything(); dzs.textContent = ok ? "Everything was deleted." : "Not everything could be deleted. Try again."; drawAccount();
    };
    dz.append(dzb, dzs); box.append(dz);
    if (WEB && mode === "db") box.append(deleteAccountSection());
    const act = el("div", "actions"); act.append(el("span")); const c = el("button", "btn", "Close"); c.type = "button"; c.onclick = () => $("#acctDlg").close(); act.append(c); box.append(act);
    typed.forEach((v, id) => { const i = box.querySelector("#" + CSS.escape(id)); if (i && v && !i.value) i.value = v; else if (i && id === "acctName" && v !== undefined) i.value = v; });
    if (focusId) { const f = box.querySelector("#" + CSS.escape(focusId)); if (f) f.focus({ preventScroll: true }); }
    $("#acctDlg").scrollTop = keepScroll;
  }

  // ----- Web app: signing in and out, deleting the account, bringing over
  // work saved in this browser before you had an account, installing.
  function webAccountRow() {
    const r = el("div", "row-gap acct-sign");
    if (mode === "db") {
      const so = el("button", "btn sm", "Sign out"); so.type = "button"; so.id = "signOutBtn";
      so.onclick = async () => {
        const waiting = PLAT.pendingCount();
        if (waiting && !so.classList.contains("armed")) {
          so.classList.add("armed", "danger"); so.textContent = "Sign out anyway";
          toast((waiting === 1 ? "1 change hasn't" : waiting + " changes haven't") + " reached your account yet (no connection). Signing out now loses " + (waiting === 1 ? "it." : "them."), { error: true });
          return;
        }
        so.disabled = true; so.textContent = "Signing out…"; await PLAT.signOut({ force: true });
      };
      r.append(so);
      if (browserWork().businesses.length && lsGet(answeredKey(), null) !== "copied") { const bw = el("button", "btn sm", "Copy this browser's work into your account"); bw.type = "button"; bw.onclick = () => { $("#acctDlg").close(); offerBrowserWork(true); }; r.append(bw); }
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
    let n = 0, failed = 0;
    await bulk(async () => {
      for (const b of w.businesses) {
        await whenLoaded();
        const empty = !st.profile && !st.tasks.length && !st.products.length && !st.links.length && !st.sales.length && !Object.keys(st.learn).length;
        if (empty && st.account.businesses.length === 1 && n === 0) { if (!(await renameBiz(st.biz, b.name))) failed++; }
        else {
          const id = "b_" + newId();
          if (!(await putBiz(id, newBizEntry(id, b.name)))) { failed++; continue; }
          await switchBiz(id, { quiet: true, force: true }); await whenLoaded();
        }
        const r = await importData(b.data); failed += r.failed || 0; n++;
      }
      for (const s of w.saves.slice(0, SAVE_MAX)) {
        if (!s || typeof s.id !== "string" || typeof s.data !== "string" || st.saves.some((x) => x.id === s.id) || st.saves.length >= SAVE_MAX) continue;
        if (!(await putSaveBack(s))) failed++;
      }
      if (!st.account.name && w.name) await setName(String(w.name).slice(0, 60));
      await addBadges(w.badges.filter((x) => typeof x === "string" && !st.account.badges.includes(x)));
    });
    if (failed) throw new Error("Some of it didn't copy");
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
    const left7 = oneOff.length - done;
    const last = p.week2 ? 14 : 7, w0 = p.week2 && dayN > 7 ? 7 : 0;
    left.append(el("span", "label", dayN >= 1 && dayN <= last ? "Day " + dayN + " of " + last : dayN > last ? (left7 ? "Day " + dayN + " · " + left7 + (left7 === 1 ? " step" : " steps") + " to go" : "Plan finished") : "Starts " + fmtDay(p.start)));
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
    for (let d = 1 + w0; d <= 7 + w0; d++) {
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
    later(() => { fill.style.width = "calc(" + (span * pct).toFixed(2) + "%)"; runner.style.left = (100 / 14 + span * (Math.min(Math.max(dayN - w0, 1), 7) - 1) / 6).toFixed(2) + "%"; }, animate);
    if (!animate || calm()) { fill.style.width = "calc(" + (span * pct).toFixed(2) + "%)"; runner.style.left = (100 / 14 + span * (Math.min(Math.max(dayN - w0, 1), 7) - 1) / 6).toFixed(2) + "%"; }
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
      tasks: st.tasks, learn: Object.entries(st.learn).map(([id, v]) => ({ id, ...v })), products: st.products, links: st.links, sales: st.sales, calculators: CV };
  }
  // Plan steps as all-day calendar events with a 9am reminder (web only: claude.ai can't save .ics files).
  function planIcs() {
    const esc = (t) => String(t).replace(/[\\;,]/g, (c) => "\\" + c).replace(/\r?\n/g, "\\n");
    const enc = new TextEncoder();
    const fold = (line) => { let out = "", cur = ""; for (const ch of line) { if (enc.encode(cur + ch).length > 74) { out += cur + "\r\n "; cur = ""; } cur += ch; } return out + cur; };
    const d8 = (iso) => iso.replace(/-/g, "");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Startline//Plan//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:" + esc("Startline: " + curBiz().name)];
    planOrder().filter((t) => t.due && t.status !== "done" && !STEP[t.step].ongoing).forEach((t) => {
      lines.push("BEGIN:VEVENT", "UID:" + t.id + "@startline", "DTSTAMP:" + stamp, "DTSTART;VALUE=DATE:" + d8(t.due), "DTEND;VALUE=DATE:" + d8(addDays(t.due, 1)),
        "SUMMARY:" + esc(t.title), "DESCRIPTION:" + esc("Startline plan, day " + t.day + ". Open Startline for the steps and links."),
        "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(t.title), "TRIGGER:PT9H", "END:VALARM", "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return lines.map(fold).join("\r\n") + "\r\n";
  }
  async function saveIcs() {
    try { await downloads.save({ filename: "startline-plan.ics", data: planIcs() }); toast("Saved. Open the file to add your plan to your calendar."); }
    catch { toast("The calendar file couldn't be saved."); }
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
    let n = { tasks: 0, learn: 0, products: 0, links: 0, sales: 0, failed: 0 };
    const okId = (id) => typeof id === "string" && /^[\w-]{1,120}$/.test(id);
    const put = async (kind, id, data) => { if (await putDoc(kind, id, data)) return true; n.failed++; return false; };
    // A plan step that's already in this business isn't added twice; a finished one stays finished.
    const planHas = new Map(st.tasks.filter((x) => x.source === "plan" && x.step).map((x) => [x.step, x]));
    for (const t of Array.isArray(obj.tasks) ? obj.tasks.slice(0, 2000) : []) {
      if (!t || !okId(t.id) || !clean(t.title)) continue;
      const have = t.source === "plan" && STEP[t.step] ? planHas.get(t.step) : null;
      if (have && have.id !== t.id) {
        if (t.status === "done" && have.status !== "done") { if (await put("tasks", have.id, { ...strip(have), status: "done", doneAt: /^\d{4}-\d{2}-\d{2}$/.test(t.doneAt || "") ? t.doneAt : today() })) n.tasks++; }
        continue;
      }
      if (await put("tasks", t.id, { title: clean(t.title, 300), area: AREA[t.area] ? t.area : "orders", prio: PRIO_RANK[t.prio] != null ? t.prio : "med",
        due: /^\d{4}-\d{2}-\d{2}$/.test(t.due || "") ? t.due : null, status: STATUSES.some(([k]) => k === t.status) ? t.status : "todo",
        product: clean(t.product, 200), supplier: clean(t.supplier, 200), ref: clean(t.ref, 200), notes: clean(t.notes),
        repeat: ["none", "daily", "weekly", "monthly"].includes(t.repeat) ? t.repeat : "none", createdAt: Number(t.createdAt) || Date.now(),
        doneAt: /^\d{4}-\d{2}-\d{2}$/.test(t.doneAt || "") ? t.doneAt : null, source: t.source === "plan" && STEP[t.step] ? "plan" : "custom",
        ...(t.source === "plan" && STEP[t.step] ? { step: t.step, day: Number(t.day) || STEP[t.step].day } : {}) })) n.tasks++;
    }
    for (const l of Array.isArray(obj.learn) ? obj.learn.slice(0, 500) : []) { if (l && okId(l.id) && (await put("learn", l.id, { done: true, at: /^\d{4}-\d{2}-\d{2}$/.test(l.at || "") ? l.at : today() }))) n.learn++; }
    for (const x of Array.isArray(obj.links) ? obj.links.slice(0, 500) : []) { const u = x && safeUrl(x.url); if (u && okId(x.id) && (await put("links", x.id, { name: clean(x.name, 120) || new URL(u).hostname, url: u, addedAt: today() }))) n.links++; }
    const num = (v) => (v == null || v === "" || !isFinite(Number(v)) ? null : Number(v));
    for (const x of Array.isArray(obj.products) ? obj.products.slice(0, 500) : []) {
      if (!x || !okId(x.id) || !clean(x.name)) continue;
      if (await put("products", x.id, { name: clean(x.name, 200), link: safeUrl(x.link) || "", source: clean(x.source, 40), price: num(x.price), cost: num(x.cost), ship: num(x.ship), minDays: num(x.minDays), maxDays: num(x.maxDays),
        shipsFrom: clean(x.shipsFrom, 10), profit: num(x.profit), margin: num(x.margin), breakEven: num(x.breakEven), bad: num(x.bad) || 0, warn: num(x.warn) || 0, fee: clean(x.fee, 40), savedAt: /^\d{4}-\d{2}-\d{2}$/.test(x.savedAt || "") ? x.savedAt : today() })) n.products++;
    }
    for (const x of Array.isArray(obj.sales) ? obj.sales.slice(0, 5000) : []) {
      if (!x || !okId(x.id) || !/^\d{4}-\d{2}-\d{2}$/.test(x.date || "") || num(x.amount) == null) continue;
      if (await put("sales", x.id, { date: x.date, amount: num(x.amount), fees: num(x.fees) || 0, costs: num(x.costs) || 0, qty: Math.max(1, Math.round(num(x.qty) || 1)), item: clean(x.item, 120), platform: clean(x.platform, 40), note: clean(x.note, 500), currency: /^[A-Z]{3}$/.test(x.currency || "") ? x.currency : "", at: Number(x.at) || Date.now() })) n.sales++;
    }
    const p = obj.profile;
    if (p && MODEL_NAME[p.model] && (CHANNELS[p.model] || []).some((c) => c[0] === p.channel) && ["new", "store", "selling"].includes(p.level) && COUNTRY_IDS.includes(p.country)) {
      const choices = {};
      Object.entries(p.choices && typeof p.choices === "object" ? p.choices : {}).forEach(([g, id]) => { if (CHOICES[g] && CHOICES[g].items.includes(id)) choices[g] = id; });
      if (!(await saveProfile({ level: p.level, model: p.model, channel: p.channel, country: p.country, ads: p.ads === "some" ? "some" : "none", start: /^\d{4}-\d{2}-\d{2}$/.test(p.start || "") ? p.start : today(), week2: p.week2 === true, choices }))) n.failed++;
      else n.profile = true;
    }
    return n;
  }
  async function resetAll() {
    for (const t of st.tasks.slice()) await delTask(t.id);
    for (const id of Object.keys(st.learn)) await delDoc("learn", id);
    for (const x of st.products.slice()) await deleteProduct(x.id);
    for (const x of st.links.slice()) await delDoc("links", x.id);
    for (const x of st.sales.slice()) await delDoc("sales", x.id);
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
        const obj = JSON.parse(await f.text());
        if (!obj || (obj.app !== "startline" && obj.app !== "dropship-desk")) throw new Error("That file isn't a Startline backup.");
        if (st.tasks.length || st.profile) await makeSave("Before importing " + f.name.slice(0, 40), true);
        const n = await bulk(() => importData(obj));
        status.textContent = "Imported " + n.tasks + " tasks, " + n.products + " saved products, " + n.links + " sites, " + n.sales + " sales and " + n.learn + " finished lessons and courses" + (n.profile ? ", plus your plan answers." : ".") + (n.failed ? " " + n.failed + " couldn't be saved." : "") + (st.saves.some((x) => x.name.startsWith("Before importing")) ? " Your work from before is kept as a save." : "");
        render();
      } catch (e) { status.textContent = e && e.message && !/JSON/.test(e.message) ? e.message : "That file couldn't be read. Choose a backup exported from this app."; }
      fileIn.value = "";
    };
    row.append(ex, im, fileIn); da.append(row, status);
    const rs = el("button", "btn sm danger", "Delete this business's data…"); rs.type = "button";
    rs.onclick = async () => {
      if (!rs.classList.contains("armed")) { rs.classList.add("armed"); rs.textContent = "Yes, delete its plan, tasks, products and sites"; status.textContent = "This can't be undone. Save a copy or export a backup first if you might want it back."; return; }
      rs.disabled = true; status.textContent = "Deleting…"; try { await bulk(() => resetAll()); } catch { status.textContent = "Not everything could be deleted."; rs.disabled = false; return; } status.textContent = "Everything in " + curBiz().name + " was deleted."; startSetup(false); render();
    };
    da.append(rs); box.append(da);
    // Installing the web app
    if (WEB) {
      const ins = el("section", "set-sec"); ins.id = "set-install"; ins.append(el("h3", null, "Install the app"));
      ins.append(el("p", "small muted", "Startline works in any browser and can also be installed, so it opens in its own window and keeps working offline. On Android, or in Chrome or Edge on a computer, choose Install. On iPhone or iPad, open it in Safari, tap the Share button, then Add to Home Screen. In Safari on a Mac, choose File, then Add to Dock."));
      if (PLAT.canInstall()) { const ib = el("button", "btn sm primary", "Install Startline"); ib.type = "button"; ib.onclick = () => installApp(); ins.append(ib); }
      box.append(ins);
    }
    // Feedback
    if (WEB && (PLAT.canSendFeedback() || PLAT.contactEmail())) {
      const fb = el("section", "set-sec"); fb.id = "set-feedback"; fb.append(el("h3", null, "Send feedback"));
      if (PLAT.canSendFeedback()) {
        fb.append(el("p", "small muted", "What's missing, wrong or confusing? It's sent anonymously; add an email address in the message if you'd like a reply."));
        const ta = el("textarea"); ta.id = "fbText"; ta.rows = 3; ta.maxLength = 2000; ta.setAttribute("aria-label", "Your feedback");
        const st2 = el("p", "small muted"); st2.setAttribute("aria-live", "polite");
        const send = el("button", "btn sm primary", "Send"); send.type = "button";
        send.onclick = async () => {
          const msg = ta.value.trim(); if (!msg) { ta.focus(); return; }
          send.disabled = true;
          try { await PLAT.sendFeedback({ kind: "feedback", model: (st.profile && st.profile.model) || null, message: msg }); ta.value = ""; st2.textContent = "Sent. Thank you."; }
          catch { st2.textContent = "That couldn't be sent. Check your connection and try again."; }
          send.disabled = false;
        };
        fb.append(ta, send, st2);
      } else {
        const a = el("a", "btn sm", "Email feedback"); a.href = "mailto:" + PLAT.contactEmail() + "?subject=" + encodeURIComponent("Startline feedback"); fb.append(a);
      }
      box.append(fb);
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
  // Nothing can be changed until your saved work has loaded.
  $("#out").inert = true;
  // Every window gets a spoken name from its heading.
  document.querySelectorAll("dialog").forEach((d) => {
    const show = d.showModal.bind(d);
    d.showModal = () => { const h = d.querySelector("h2"); if (h) { if (!h.id) h.id = d.id + "-title"; d.setAttribute("aria-labelledby", h.id); } show(); };
  });
  setTab(TABS.includes(st.tab) ? st.tab : "today");
  startStorage();
  claudeUse("sample").then((s) => { sample = s; updateAiBtn(); if (st.tab === "tools") renderTool(); });
  claudeUse("downloads").then((d) => { downloads = d; });
  // Test hook for the automated checks; inert unless a test sets the flag first.
  if (window.__ddTest) window.__dd = { S, GUIDE, STEP, LESSONS, COURSES, TOOLS, TOOL_LIST, CHANNELS, MODELS, QUESTIONS, FEES, DEFAULT_FEE, ADS_MODELS, COUNTRY_IDS, REALISTIC, availability, val, parseQuick, today, addDays, addMonth, applicable, O, CHOICES, STEP_CHOICE, choiceFor, optItems, planChoiceGroups };
  setInterval(() => { if (document.visibilityState === "visible" && (st.tab === "plan" || st.tab === "tasks" || st.tab === "today") && !anyDialog() && !typing(document.activeElement)) render(); }, 60 * 60 * 1000);
})();
