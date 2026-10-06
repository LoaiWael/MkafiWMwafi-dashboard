import type { PageSeo } from "@/features/content/types";

export const CONTENT_PAGES = {
  home: "home",
  about: "about",
  blogs: "blogs",
} as const;

export type ContentPageId = (typeof CONTENT_PAGES)[keyof typeof CONTENT_PAGES];

export const CONTENT_PAGE_IDS = [
  CONTENT_PAGES.home,
  CONTENT_PAGES.about,
  CONTENT_PAGES.blogs,
] as const;

export const SEO_PUBLIC_ORIGIN = "https://makfiwamufi.sa";

export const SEO_LIMITS = {
  title: 60,
  description: 160,
  ogTitle: 70,
  ogDescription: 200,
} as const;

export const TWITTER_CARD = {
  summary: "summary",
  summaryLargeImage: "summary_large_image",
} as const;

export const SITE_PREVIEW_NAV = [
  { id: CONTENT_PAGES.home, label: "الرئيسية" },
  { id: CONTENT_PAGES.about, label: "من نحن" },
  { id: CONTENT_PAGES.blogs, label: "المدونة" },
] as const;

export const HERO_VIDEO_SRC = "/home/hero.mp4";

export const HERO_COPY = {
  title: "بدون مكتب عقاري وخلال 25 دقيقة",
  highlight: "استلم عقد إيجارك الموثق.",
  description:
    "إذا كنت مالك عقار أو مستأجر أو وسيط عقاري تستطيع هنا إنشاء عقد إيجار موثق ومعتمد من إيجار.",
} as const;

export const HERO_STATS = [
  { id: "commercial", value: 0, label: "عقد تجاري" },
  { id: "residential", value: 0, label: "عقد سكني" },
  { id: "clients", value: 0, label: "عميل راضٍ" },
] as const;

export const REQUIREMENTS_COPY = {
  eyebrow: "قبل ان تبدأ",
  title: "رحلة عقدك تبدأ بأوراق جاهزة",
  description:
    "جهّز الأساسيات فقط، ونحن نوضح لك ما ينقص حسب نوع العقد ونمشي معك خطوة بخطوة",
  centerTitle: "كيف نُكمل عقدك؟",
  centerDescription: "خطوات واضحة وبدون مفاجآت في الطريق",
  centerIcon: "/icons/sheild-sheet.svg",
} as const;

export const REQUIREMENT_STEP_ICON = "/icons/group.svg";

export const REQUIREMENTS = [
  {
    step: 1,
    title: "هوية الأطراف",
    description: "هوية المؤجر والمستأجر أو بيانات المنشأة.",
    icon: REQUIREMENT_STEP_ICON,
  },
  {
    step: 2,
    title: "بيانات العقار",
    description: "العنوان، الوحدة، ونوع الاستخدام المطلوب.",
    icon: REQUIREMENT_STEP_ICON,
  },
  {
    step: 3,
    title: "إثبات الملكية",
    description: "صك الملكية أو الوكالة عند الحاجة.",
    icon: REQUIREMENT_STEP_ICON,
  },
  {
    step: 4,
    title: "رقم جوال موثق",
    description: "للتواصل وتأكيد الطلب واستكمال الخطوات.",
    icon: REQUIREMENT_STEP_ICON,
  },
  {
    step: 5,
    title: "بيانات الدفعات",
    description: "المدة، القيمة، وطريقة الدفع المتفق عليها.",
    icon: REQUIREMENT_STEP_ICON,
  },
  {
    step: 6,
    title: "للتجاري فقط",
    description: "السجل التجاري وبيانات النشاط للعقد.",
    icon: REQUIREMENT_STEP_ICON,
  },
] as const;

export const AUTHORITIES_COPY = {
  eyebrow: "الأنظمة والتراخيص",
  title: "متوافقون مع الأنظمة واللوائح",
  description:
    "نعمل وفق الأنظمة واللوائح، ويمكن الاطلاع على شهاداتنا وتراخيصنا الرسمية مباشرة.",
} as const;

export const AUTHORITIES = [
  {
    id: "business-center",
    src: "/home/saudi-buisness-center-logo.png",
    alt: "المركز السعودي للأعمال",
    width: 267,
    height: 64,
    certificate: "/certificates/saudia-business-center.pdf",
    certificateLabel: "عرض الشهادة",
  },
  {
    id: "ejar",
    src: "/home/ejar-logo.png",
    alt: "إيجار",
    width: 139,
    height: 64,
    certificate: "/certificates/ejar.pdf",
    certificateLabel: "عرض الشهادة",
  },
  {
    id: "rega",
    src: "/home/real-estate-authority-logo.png",
    alt: "الهيئة العامة للعقار",
    width: 235,
    height: 64,
    certificate: "/certificates/fal.pdf",
    certificateLabel: "رخصة فال",
  },
] as const;

export const ABOUT_HERO_IMAGE = {
  src: "/about/hero.png",
  width: 2064,
  height: 512,
} as const;

export const ABOUT_HERO_COPY = {
  label: "من نحن",
  eyebrow: "تعرّف علينا",
  heading: "نجعل توثيق عقد الإيجار أسهل مما تتوقع",
  description:
    "منصة إلكترونية تساعدك على إنشاء عقود الإيجار السكنية والتجارية وتوثيقها بكل سهولة خلال دقائق، ومن دون زيارة مكتب.",
} as const;

export const BLOGS_HERO_IMAGE = {
  src: "/about/hero.png",
  width: 2064,
  height: 512,
} as const;

export const BLOGS_HERO_COPY = {
  label: "المدونة",
  eyebrow: "المدونة والمعرفة العقارية",
  heading: "دليلك ومقالات متخصصة في عقود الإيجار والأنظمة",
  description:
    "مقالات دورية، تحليلات نظامية، وأدلة عملية لمساعدتك في فهم وتوثيق عقود الإيجار السكنية والتجارية بكل سهولة وأمان.",
} as const;

export const ABOUT_STORY_IMAGE = {
  src: "/about/about-story.jpg",
  alt: "مستخدم يوثق عقد إيجار عبر تطبيق مكفي وموفي بإطلالة على مدينة الرياض",
  width: 1200,
  height: 896,
} as const;

export const ABOUT_STORY_COPY = {
  eyebrow: "قصتنا",
  title: "نختصر عليك طريق توثيق عقد الإيجار",
  description:
    "مكفي وموفي منصة سعودية إلكترونية لتسهيل توثيق العقود، وُلدت من تجربة يعرفها كل مؤجر ومستأجر: مستندات متفرقة، ومراجعات مكتبية، وخطوات غير واضحة.",
  body: "لذلك بنينا تجربة رقمية تجمع كل ما تحتاجه في مكان واحد؛ نوضح لك المستندات المطلوبة حسب نوع العقد، ونتابع طلبك خطوة بخطوة حتى يصلك العقد موثقاً، من أي مكان في المملكة.",
  cta: "ابدأ توثيق عقدك",
  badgeTitle: "توثيق سريع وآمن",
  badgeDescription: "إجراءات رقمية 100%",
} as const;

export const ABOUT_VALUE_CARD_LIMIT = 5;

export const ABOUT_VALUE_ICONS = [
  { id: "mission", label: "هدف" },
  { id: "vision", label: "رؤية" },
  { id: "values", label: "قيم" },
  { id: "shield", label: "حماية" },
  { id: "timer", label: "سرعة" },
  { id: "receipt", label: "رسوم" },
  { id: "headset", label: "دعم" },
  { id: "badge", label: "اعتماد" },
  { id: "scale", label: "التزام" },
  { id: "sparkles", label: "تميّز" },
  { id: "building", label: "عقار" },
  { id: "lock", label: "أمان" },
] as const;

export const ABOUT_VALUE_ICON_IDS = ABOUT_VALUE_ICONS.map((icon) => icon.id);

export const ABOUT_VALUE_NEW_CARD = {
  title: "قيمة جديدة",
  description: "وصف مختصر يوضح هذه القيمة.",
  feature: "ميزة جديدة",
} as const;

export const ABOUT_VALUES_COPY = {
  eyebrow: "ما يحركنا",
  title: "رسالة واضحة وقيم نلتزم بها",
  description:
    "نؤمن أن توثيق عقد الإيجار حق بسيط يجب أن يكون متاحاً للجميع بثقة ووضوح وبأعلى معايير الأمان.",
  callout:
    "✨ نضع الشفافية والموثوقية في صميم كل عقد نوثقه لخدمة الأفراد والشركات في المملكة.",
} as const;

export const ABOUT_VALUES = [
  {
    id: "mission",
    title: "رسالتنا",
    description:
      "تمكين المؤجرين والمستأجرين من توثيق عقودهم بسهولة وثقة، دون تعقيد أو زيارات مكتبية.",
    features: [
      "إجراءات رقمية 100%",
      "توثيق سريع وموثوق",
      "توفير الوقت والجهد",
    ],
  },
  {
    id: "vision",
    title: "رؤيتنا",
    description: "أن نكون الخيار الأول في المملكة لتوثيق عقود الإيجار إلكترونياً.",
    features: [
      "الريادة في التوثيق الإلكتروني",
      "تغطية شاملة للمملكة",
      "حلول ذكية للمؤجر والمستأجر",
    ],
  },
  {
    id: "values",
    title: "قيمنا",
    description:
      "الوضوح في الأسعار والإجراءات، والأمانة في التعامل مع بياناتك، والالتزام بالأنظمة واللوائح.",
    features: [
      "شفافية كاملة في الرسوم",
      "حماية سرية البيانات",
      "توافق تام مع الأنظمة العقارية",
    ],
  },
] as const;

export const ABOUT_REASON_CARD_LIMIT = 5;

export const ABOUT_REASON_ICON_IDS = ["shield", "timer", "receipt", "headset"] as const;

export const ABOUT_REASON_NEW_CARD = {
  badge: "ميزة جديدة",
  title: "سبب جديد",
  description: "وصف مختصر يوضح هذا السبب.",
  highlight: "جملة توضح ما يميز هذا السبب.",
  statLabel: "الميزة الأساسية",
  stat: "ميزة أساسية",
} as const;

export const ABOUT_REASONS_COPY = {
  eyebrow: "لماذا نحن",
  title: "لماذا يختار عملاؤنا مكفي وموفي؟",
  description:
    "كل ما تحتاجه لتوثيق عقدك في منصة واحدة، بخطوات واضحة، أمان تام، وأسعار معلنة.",
} as const;

export const ABOUT_REASONS = [
  {
    id: "compliance",
    iconId: "shield",
    badge: "إجراءات نظامية 100%",
    title: "أمان وموثوقية",
    description:
      "نلتزم بأعلى معايير الأمان وحماية البيانات لضمان تعاملات سلسة.",
    highlight:
      "نعمل بتوافق كامل مع الأنظمة العقارية لضمان دقة الإجراءات وسرعة الإنجاز.",
    statLabel: "الميزة الأساسية",
    stat: "أمان وموثوقية",
  },
  {
    id: "speed",
    iconId: "timer",
    badge: "سرعة وإنجاز فوري",
    title: "توثيق خلال دقائق",
    description: "أكمل طلبك في أقل من 10 دقائق من جوالك.",
    highlight:
      "نموذج رقمي سهل يتيح لك رفع بياناتك وتأكيد العقد في أقل من 10 دقائق من جوالك.",
    statLabel: "الميزة الأساسية",
    stat: "أقل من 10 دقائق",
  },
  {
    id: "pricing",
    iconId: "receipt",
    badge: "شفافية مطلقة",
    title: "أسعار واضحة",
    description: "رسوم معلنة وشاملة للضريبة قبل تأكيد الطلب.",
    highlight:
      "رسوم معلنة بدقة وشاملة لضريبة القيمة المضافة، بدون أي رسوم خفية أو تكاليف غير متوقعة.",
    statLabel: "الميزة الأساسية",
    stat: "رسوم معلنة وثابتة",
  },
  {
    id: "support",
    iconId: "headset",
    badge: "خدمة عملاء مميزة",
    title: "دعم متواصل",
    description: "فريقنا معك من بداية الطلب حتى توثيق العقد.",
    highlight:
      "فريق دعم عقاري وتقني متاح للرد على استفساراتك ومساعدتك في كل خطوة حتى إصدار العقد.",
    statLabel: "الميزة الأساسية",
    stat: "متابعة مستمرة",
  },
] as const;

export const ABOUT_HIGHLIGHTS = [
  {
    id: "speed",
    text: "عقود سكنية وتجارية موثقة إلكترونياً وبأعلى سرعة",
  },
  {
    id: "tracking",
    text: "متابعة واضحة لحالة طلبك خطوة بخطوة",
  },
  {
    id: "support",
    text: "دعم باللغة العربية طوال أيام العمل",
  },
] as const;

export const PRICING_COPY = {
  eyebrow: "بداية الطلب",
  title: "وثق في أقل من 10 دقائق",
  description:
    "نوفر لك مزايا وخدمات تساعدك على إتمام إجراءات عقدك بكل سهولة ووضوح.",
  orderCta: "أطلب الآن",
  featuredLabel: "الأكثر طلباً",
  currencyLabel: "ريال سعودي",
  yearPriceNote: "للسنة الواحدة",
} as const;

export const HOME_PLAN_DEFAULT_ID = "1-year";

export const HOME_PLANS = [
  {
    id: "residential",
    tone: "primary",
    title: "عقد سكني",
    subtitle: "مناسب للإيجار الفردي والعائلي.",
    progressLabel: "تحديث البيانات",
    progress: 70,
    featured: false,
    features: [
      "خلال دقائق ينجز عقدك",
      "مناسب لحساب المواطن",
      "مناسب للضمان المطور",
      "يطلب لسكن العائلات",
    ],
  },
  {
    id: "commercial",
    tone: "secondary",
    title: "عقد تجاري",
    subtitle: "مناسب للمحلات التجارية ومكاتب ومصانع.",
    progressLabel: "مراجعة المستندات",
    progress: 58,
    featured: true,
    features: [
      "خلال دقائق ينجز عقدك",
      "متوافق مع وزارة التجارة",
      "توثيق عقد تجاري رسمي",
      "متوافق مع المركز السعودي للأعمال",
    ],
  },
] as const;

export type HomePlan = (typeof HOME_PLANS)[number];

export const FAQ_COPY = {
  eyebrow: "إجابات تهمك",
  title: "إجابات واضحة قبل إتمام عقدك",
  description:
    "نوضح لك أهم التفاصيل والإجراءات التي تحتاج إلى معرفتها لإتمام عقدك بكل سهولة ووضوح.",
} as const;

export const FAQS = [
  {
    id: "documents",
    question: "ما هي المستندات المطلوبة لتوثيق العقد؟",
    answer:
      "هوية الأطراف، بيانات العقار، وإثبات الملكية أو الوكالة، ويُضاف السجل التجاري للعقود التجارية.",
    open: false,
  },
  {
    id: "difference",
    question: "ما الفرق بين العقد السكني والتجاري؟",
    answer:
      "العقد السكني مخصص للشقق والفلل والغرف السكنية، بينما التجاري مخصص للمحلات والمكاتب والمصانع، ولكل منهما شروط ورسوم مختلفة.",
    open: true,
  },
  {
    id: "cancel",
    question: "هل يمكن إلغاء العقد بعد التوثيق؟",
    answer:
      "نعم، يمكن إلغاء العقد بعد التوثيق باتفاق الطرفين وفق الإجراءات والضوابط النظامية.",
    open: false,
  },
] as const;

export const APP_CTA_COPY = {
  eyebrow: "تطبيق مكفي وموفي",
  titleLead: "عقدك",
  titleMiddle: "الموثق.. بين",
  titleEnd: "يديك",
  description:
    "وثّق عقد إيجارك السكني أو التجاري بسهولة، ومن أي مكان في المملكة.",
} as const;

export const APP_CTA_STORES = {
  appStore: {
    href: "#",
    caption: "Download on the",
    name: "App Store",
    label: "تعديل رابط آب ستور",
  },
  playStore: {
    href: "#",
    caption: "GET IT ON",
    name: "Google Play",
    label: "تعديل رابط جوجل بلاي",
  },
} as const;

export const APP_CTA_PHONES = [
  {
    id: "contracts",
    src: "/home/contracts.png",
    alt: "شاشة العقود في تطبيق مكفي وموفي",
    label: "تغيير شاشة العقود",
    width: 270,
    height: 585,
  },
  {
    id: "home",
    src: "/home/home.png",
    alt: "شاشة الرئيسية في تطبيق مكفي وموفي",
    label: "تغيير الشاشة الرئيسية",
    width: 270,
    height: 585,
  },
] as const;

const HOME_DESCRIPTION =
  "أنشئ عقد إيجار سكني أو تجاري إلكترونياً وبكل سهولة، خلال دقائق ومن دون زيارة مكتب.";

const ABOUT_DESCRIPTION =
  "تعرّف على مكفي وموفي، منصتك لتوثيق وإدارة عقود الإيجار السكنية والتجارية إلكترونياً بكل سهولة وأمان خلال دقائق.";

const BLOGS_DESCRIPTION =
  "مقالات وأدلة شاملة حول توثيق عقود الإيجار السكنية والتجارية، والأنظمة العقارية في المملكة.";

export const PAGE_SEO = {
  [CONTENT_PAGES.home]: {
    title: "عقد إيجار إلكتروني موثق",
    description: HOME_DESCRIPTION,
    keywords: "عقد إيجار، توثيق عقد، إيجار سكني، إيجار تجاري، مكفي وموفي",
    canonicalPath: "/",
    indexable: true,
    followLinks: true,
    ogTitle: "عقد إيجار إلكتروني موثق، بلا تعقيد",
    ogDescription: HOME_DESCRIPTION,
    ogImage: "",
    ogImageAlt: "مكفي وموفي",
    twitterCard: TWITTER_CARD.summaryLargeImage,
    mirrorOpenGraph: true,
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  },
  [CONTENT_PAGES.about]: {
    title: "من نحن",
    description: ABOUT_DESCRIPTION,
    keywords: "من نحن، مكفي وموفي، توثيق عقود الإيجار",
    canonicalPath: "/about",
    indexable: true,
    followLinks: true,
    ogTitle: "من نحن",
    ogDescription: ABOUT_DESCRIPTION,
    ogImage: "",
    ogImageAlt: "مكفي وموفي",
    twitterCard: TWITTER_CARD.summaryLargeImage,
    mirrorOpenGraph: true,
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  },
  [CONTENT_PAGES.blogs]: {
    title: "المدونة",
    description: BLOGS_DESCRIPTION,
    keywords: "المدونة، مقالات عقارية، توثيق عقود، إيجار، مكفي وموفي",
    canonicalPath: "/blogs",
    indexable: true,
    followLinks: true,
    ogTitle: "المدونة",
    ogDescription: BLOGS_DESCRIPTION,
    ogImage: "",
    ogImageAlt: "مكفي وموفي",
    twitterCard: TWITTER_CARD.summaryLargeImage,
    mirrorOpenGraph: true,
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  },
} as const satisfies Record<ContentPageId, PageSeo>;
