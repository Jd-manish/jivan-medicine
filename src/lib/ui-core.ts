/**
 * Complete UI translation registry — curated locales.
 *
 * Every user-facing string on the site lives here (or in the component-level
 * copy already in i18n.ts). English content data (article bodies, catalog
 * clinical text) stays English deliberately; UI chrome is fully localized.
 *
 * Quality rule: hand-written native translations, never machine output.
 */
export const uiLocales = ["en", "de", "fr", "es", "it"] as const;
export type UiLocale = (typeof uiLocales)[number];

export type Entry = { en: string; de?: string; fr?: string; es?: string; it?: string };

export function ui(locale: string, entry: Entry): string {
  const l = locale as UiLocale;
  return entry[l] ?? entry.en;
}

export const U = {
  /* ------------------------------ HERO / HOME ------------------------------ */
  missionKicker: { en: "Our mission", de: "Unsere Mission", fr: "Notre mission", es: "Nuestra misión", it: "La nostra missione" },
  missionTitle: {
    en: "A humanitarian platform, not a storefront",
    de: "Eine humanitäre Plattform, kein Verkaufsportal",
    fr: "Une plateforme humanitaire, pas une boutique",
    es: "Una plataforma humanitaria, no una tienda",
    it: "Una piattaforma umanitaria, non un negozio",
  },
  missionP1: {
    en: "Every year, families in the United States and Europe abandon treatment they cannot afford. Not because the medicine does not exist, but because the same molecule is priced ten, fifty, sometimes a hundred times higher on one side of a border than the other.",
    de: "Jedes Jahr brechen Familien in den USA und Europa Behandlungen ab, die sie sich nicht leisten können. Nicht weil das Medikament nicht existiert, sondern weil dasselbe Molekül auf der einen Seite der Grenze zehn, fünfzig, manchmal hundert Mal teurer ist.",
    fr: "Chaque année, des familles aux États-Unis et en Europe abandonnent des traitements qu'elles ne peuvent pas payer. Non pas parce que le médicament n'existe pas, mais parce que la même molécule coûte dix, cinquante, parfois cent fois plus cher d'un côté de la frontière que de l'autre.",
    es: "Cada año, familias en Estados Unidos y Europa abandonan tratamientos que no pueden pagar. No porque el medicamento no exista, sino porque la misma molécula cuesta diez, cincuenta, a veces cien veces más a un lado de la frontera que al otro.",
    it: "Ogni anno, famiglie negli Stati Uniti e in Europa rinunciano a cure che non possono permettersi. Non perché il farmaco non esista, ma perché la stessa molecola costa dieci, cinquanta, a volte cento volte di più da un lato della frontiera rispetto all'altro.",
  },
  missionP2: {
    en: "Jivan exists to close that information gap. We are an independent, free, non-commercial transparency project. We do not sell medicine, we do not take commission on a sale, and we do not push anyone toward a supplier. What we do is show you the truth about pricing so that you can have an informed conversation with your doctor.",
    de: "Jivan existiert, um diese Informationslücke zu schließen. Wir sind ein unabhängiges, kostenloses, nicht-kommerzielles Transparenzprojekt. Wir verkaufen keine Medikamente, nehmen keine Provision und drängen niemanden zu einem Anbieter. Wir zeigen Ihnen die Wahrheit über Preise, damit Sie ein informiertes Gespräch mit Ihrem Arzt führen können.",
    fr: "Jivan existe pour combler ce fossé d'information. Nous sommes un projet indépendant, gratuit et non commercial de transparence. Nous ne vendons pas de médicaments, ne percevrons aucune commission et ne poussons personne vers un fournisseur. Nous vous montrons la vérité sur les prix pour que vous puissiez en parler en toute connaissance de cause avec votre médecin.",
    es: "Jivan existe para cerrar esa brecha de información. Somos un proyecto independiente, gratuito y no comercial de transparencia. No vendemos medicamentos, no cobramos comisiones y no empujamos a nadie hacia ningún proveedor. Te mostramos la verdad sobre los precios para que puedas hablar con tu médico con información real.",
    it: "Jivan esiste per colmare questa lacuna informativa. Siamo un progetto indipendente, gratuito e non commerciale per la trasparenza dei prezzi. Non vendiamo farmaci, non prendiamo commissioni e non spingiamo nessuno verso un fornitore. Ti mostriamo la verità sui prezzi perché tu possa parlarne con consapevolezza con il tuo medico.",
  },
  missionBold: {
    en: "No family should ration a life-saving drug because nobody told them an affordable equivalent existed.",
    de: "Keine Familie sollte ein lebensrettendes Medikament rationieren müssen, nur weil niemand ihr gesagt hat, dass es eine bezahlbare Alternative gibt.",
    fr: "Aucune famille ne devrait rationner un médicament vital simplement parce que personne ne lui a dit qu'une équivalence abordable existait.",
    es: "Ninguna familia debería racionar un medicamento vital simplemente porque nadie le dijo que existía una alternativa asequible.",
    it: "Nessuna famiglia dovrebbe razionare un farmaco salvavita solo perché nessuno le ha detto che esiste un'alternativa accessibile.",
  },
  missionCta: {
    en: "Read our full mission", de: "Lesen Sie unsere vollständige Mission", fr: "Lire notre mission complète",
    es: "Leer nuestra misión completa", it: "Leggi la nostra missione completa",
  },
  missionCardFreeT: { en: "Free forever", de: "Für immer kostenlos", fr: "Gratuit pour toujours", es: "Gratis para siempre", it: "Gratis per sempre" },
  missionCardFreeD: { en: "No paywall, no account required, no commission on any transaction.", de: "Keine Paywall, kein Konto, keine Provision.", fr: "Pas de paywall, pas de compte, aucune commission.", es: "Sin muro de pago, sin cuenta, sin comisiones.", it: "Nessun paywall, nessun account, nessuna commissione." },
  missionCardHonestT: { en: "Honest labelling", de: "Ehrliche Kennzeichnung", fr: "Étiquetage honnête", es: "Etiquetado honesto", it: "Etichettatura onesta" },
  missionCardHonestD: { en: "Referenced, derived or unavailable — we never disguise an estimate as a fact.", de: "Geprüft, abgeleitet oder nicht verfügbar — wir tarnen Schätzungen nie als Fakten.", fr: "Référencé, dérivé ou indisponible — une estimation n'est jamais présentée comme un fait.", es: "Referenciado, derivado o no disponible — una estimación nunca se presenta como un hecho.", it: "Referenziato, derivato o non disponibile — una stima non è mai spacciata per un fatto." },
  missionCardPhysT: { en: "Physician first", de: "Arzt zuerst", fr: "Le médecin d'abord", es: "El médico primero", it: "Prima il medico" },
  missionCardPhysD: { en: "Every page pushes you toward professional medical supervision, not away from it.", de: "Jede Seite führt Sie zur ärztlichen Aufsicht hin, nicht von ihr weg.", fr: "Chaque page vous rapproche de la supervision médicale, jamais ne vous en éloigne.", es: "Cada página te acerca a la supervisión médica, nunca te aleja de ella.", it: "Ogni pagina ti avvicina alla supervisione medica, mai ti allontana." },
  missionCardOpenT: { en: "Open sources", de: "Offene Quellen", fr: "Sources ouvertes", es: "Fuentes abiertas", it: "Fonti aperte" },
  missionCardOpenD: { en: "We cite RxNorm, openFDA and Wikipedia so you can verify everything yourself.", de: "Wir zitieren RxNorm, openFDA und Wikipedia, damit Sie alles selbst prüfen können.", fr: "Nous citons RxNorm, openFDA et Wikipédia pour que vous puissiez tout vérifier.", es: "Citamos RxNorm, openFDA y Wikipedia para que puedas verificar todo tú mismo.", it: "Citiamo RxNorm, openFDA e Wikipedia perché tu possa verificare ogni cosa." },
  editStripKicker: {
    en: "Written, reviewed and maintained by a real editorial process",
    de: "Von einem echten Redaktionsprozess geschrieben, geprüft und gepflegt",
    fr: "Rédigé, relu et entretenu par un véritable processus éditorial",
    es: "Escrito, revisado y mantenido por un verdadero proceso editorial",
    it: "Scritto, revisionato e mantenuto da un vero processo editoriale",
  },
  editStripPolicy: { en: "Editorial policy", de: "Redaktionsrichtlinien", fr: "Politique éditoriale", es: "Política editorial", it: "Politica editoriale" },
  editStripMethod: { en: "Price verification methodology", de: "Methodik der Preisprüfung", fr: "Méthodologie de vérification des prix", es: "Metodología de verificación de precios", it: "Metodologia di verifica dei prezzi" },
  editStripGuides: { en: "30 source-cited guides", de: "30 quellenbasierte Leitfäden", fr: "30 guides sourcés", es: "30 guías con fuentes", it: "30 guide con fonti" },
  editStripDisclaimer: { en: "Medical disclaimer", de: "Medizinischer Haftungsausschluss", fr: "Avertissement médical", es: "Aviso médico", it: "Esclusione medica" },

  /* ------------------------------ PRICE GAPS ------------------------------ */
  gapsKicker: { en: "Referenced price gaps", de: "Referenzierte Preislücken", fr: "Écarts de prix référencés", es: "Brechas de precios referenciadas", it: "Divari di prezzo referenziati" },
  gapsTitle: { en: "The gaps people do not believe until they see them", de: "Die Lücken, die niemand glaubt, bis man sie sieht", fr: "Des écarts auxquels personne ne croit avant de les voir", es: "Las brechas que nadie cree hasta que las ven", it: "I divari a cui nessuno crede finché non li vede" },
  gapsBody: {
    en: "These are real molecules where the Indian market price is a small fraction of the US or EU price. Every entry below is a referenced comparison, not an estimate.",
    de: "Echte Moleküle, bei denen der indische Marktpreis nur ein Bruchteil des US- oder EU-Preises beträgt. Jeder Eintrag ist eine referenzierte Gegenüberstellung, keine Schätzung.",
    fr: "De vraies molécules dont le prix du marché indien est une fraction du prix US ou UE. Chaque entrée est une comparaison référencée, pas une estimation.",
    es: "Moléculas reales cuyo precio de mercado indio es una fracción del precio de EE. UU. o la UE. Cada entrada es una comparación referenciada, no una estimación.",
    it: "Molecole reali il cui prezzo di mercato indiano è una frazione del prezzo USA o UE. Ogni voce è un confronto referenziato, non una stima.",
  },
  gapsCta: { en: "Browse the full catalog", de: "Vollständigen Katalog ansehen", fr: "Parcourir tout le catalogue", es: "Ver todo el catálogo", it: "Sfoglia tutto il catalogo" },
  gapUsEu: { en: "US / EU", de: "US / EU", fr: "US / UE", es: "EE. UU. / UE", it: "USA / UE" },
  gapIndia: { en: "India", de: "Indien", fr: "Inde", es: "India", it: "India" },

  /* ------------------------------ WHY CHEAPER ------------------------------ */
  whyKicker: { en: "The real explanation", de: "Die echte Erklärung", fr: "La vraie explication", es: "La verdadera explicación", it: "La vera spiegazione" },
  whyCheaperTitle: { en: "Why the identical molecule costs a fraction in India", de: "Warum das identische Molekül in Indien einen Bruchteil kostet", fr: "Pourquoi la même molécule coûte une fraction en Inde", es: "Por qué la misma molécula cuesta una fracción en India", it: "Perché la stessa molecola costa una frazione in India" },
  whyCheaperBody: {
    en: "This is not a quality difference and it is not a trick. It is the predictable result of patent status, market structure and cost base. Here are the six factors that actually drive the gap.",
    de: "Das ist kein Qualitätsunterschied und kein Trick. Es ist das vorhersehbare Ergebnis von Patentstatus, Marktstruktur und Kostenbasis. Das sind die sechs Faktoren, die die Lücke tatsächlich treiben.",
    fr: "Ce n'est ni une différence de qualité ni un stratagème. C'est le résultat prévisible du statut de brevet, de la structure du marché et de la base de coûts. Voici les six facteurs qui créent réellement l'écart.",
    es: "No es una diferencia de calidad ni un truco. Es el resultado predecible del estado de las patentes, la estructura del mercado y la base de costos. Estos son los seis factores que realmente impulsan la brecha.",
    it: "Non è una differenza di qualità né un trucco. È il risultato prevedibile dello stato dei brevetti, della struttura del mercato e della base di costi. Ecco i sei fattori che determinano davvero il divario.",
  },
  why1T: { en: "Patent monopoly versus open generic competition", de: "Patentmonopol gegen offenen Generika-Wettbewerb", fr: "Monopole du brevet contre concurrence des génériques", es: "Monopolio de patente frente a competencia de genéricos", it: "Monopolio di brevetto contro concorrenza dei generici" },
  why1B: {
    en: "In the US and EU a new medicine is protected by patents and regulatory exclusivity for roughly 20 years. During that window one company is the only legal seller, so it sets the price with no competitor. In India many of these molecules are off-patent or were never granted a product patent, so any qualified manufacturer may produce them. Twenty companies making the same salt must undercut each other, and the price collapses toward the cost of production.",
    de: "In den USA und der EU ist ein neues Medikament rund 20 Jahre durch Patente und Marktexklusivität geschützt. In diesem Zeitraum ist ein einziges Unternehmen der einzige legale Verkäufer und setzt den Preis ohne Wettbewerber fest. In Indien sind viele dieser Moleküle patentfrei oder wurden nie patentiert, sodass jeder qualifizierte Hersteller sie produzieren darf. Zwanzig Firmen mit demselben Wirkstoff müssen sich gegenseitig unterbieten — der Preis rutscht Richtung Produktionskosten.",
    fr: "Aux États-Unis et dans l'UE, un nouveau médicament est protégé environ 20 ans par des brevets et une exclusivité réglementaire. Durant cette période, une seule société est légalement vendeuse et fixe le prix sans concurrent. En Inde, beaucoup de ces molécules sont tombées dans le domaine public ou n'ont jamais été brevetées, donc tout fabricant qualifié peut les produire. Vingt entreprises vendant le même principe actif doivent se sous-enchérir — le prix chute vers le coût de production.",
    es: "En EE. UU. y la UE, un medicamento nuevo está protegido unos 20 años por patentes y exclusividad regulatoria. En ese período, una sola empresa es la única vendedora legal y fija el precio sin competencia. En India, muchas de estas moléculas no tienen patente o nunca la tuvieron, así que cualquier fabricante cualificado puede producirlas. Veinte empresas vendiendo la misma sal deben rebajarse entre sí: el precio cae hacia el costo de producción.",
    it: "Negli USA e nell'UE un nuovo farmaco è protetto per circa 20 anni da brevetti ed esclusività regolatoria. In quel periodo una sola azienda è l'unica venditrice legale e fissa il prezzo senza concorrenti. In India molte di queste molecole sono fuori brevetto o non sono mai state brevettate, quindi qualsiasi produttore qualificato può produrle. Venti aziende che vendono lo stesso principio attivo devono farsi concorrenza: il prezzo crolla verso il costo di produzione.",
  },
  why1H: { en: "One seller sets a price. Twenty sellers discover a price.", de: "Ein Verkäufer setzt den Preis. Zwanzig Verkäufer bilden den Preis.", fr: "Un vendeur fixe le prix. Vingt vendeurs le découvrent.", es: "Un vendedor fija el precio. Veinte vendedores lo descubren.", it: "Un venditore fissa il prezzo. Venti venditori lo rivelano." },
  why2T: { en: "Recovering research cost versus copying a known recipe", de: "Forschungskosten zurückgewinnen gegen Rezeptnachbau", fr: "Amortir la recherche contre copier une recette connue", es: "Recuperar I+D frente a copiar una receta conocida", it: "Recuperare R&S contro copiare una ricetta nota" },
  why2B: {
    en: "Originator companies spend enormous sums on discovery, failed candidates and multi-phase trials, and they load that recovery plus profit onto every pack sold. A generic manufacturer does not repeat the discovery. It proves the copy behaves the same in the body, so its cost base is manufacturing, quality control and distribution only. That is a fundamentally different pricing floor for a chemically identical tablet.",
    de: "Hersteller von Originalpräparaten investieren enorme Summen in Forschung, gescheiterte Kandidaten und mehrphasige Studien und schlagen diese Kosten plus Gewinn auf jede verkaufte Packung um. Ein Generikahersteller wiederholt die Forschung nicht. Er beweist, dass die Kopie im Körper gleich wirkt — seine Kostenbasis ist nur Produktion, Qualitätskontrolle und Vertrieb. Das ist eine völlig andere Preisuntergrenze für eine chemisch identische Tablette.",
    fr: "Les sociétés originelles dépensent des sommes énormes en découverte, en candidats échoués et en essais multi-phases, et elles répercutent ces coûts, plus leur marge, sur chaque boîte vendue. Un fabricant de génériques ne refait pas la découverte. Il prouve que sa copie se comporte identiquement dans le corps — sa base de coûts se limite à la fabrication, au contrôle qualité et à la distribution. C'est un plancher de prix fondamentalement différent pour un comprimé chimiquement identique.",
    es: "Las empresas originales gastan enormes sumas en descubrimiento, candidatos fallidos y ensayos multifase, y cargan esa recuperación más beneficio a cada caja vendida. Un fabricante de genéricos no repite el descubrimiento. Demuestra que la copia se comporta igual en el cuerpo: su base de costos es solo fabricación, control de calidad y distribución. Es un suelo de precios fundamentalmente distinto para una tableta químicamente idéntica.",
    it: "Le aziende originarie spendono somme enormi in ricerca, candidati falliti e studi multifase, e caricano questo recupero più il profitto su ogni confezione venduta. Un produttore di generici non ripete la scoperta. Dimostra che la copia si comporta identica nell'organismo: la sua base di costi è solo produzione, controllo qualità e distribuzione. È un fondo di prezzo fondamentalmente diverso per una compressa chimicamente identica.",
  },
  why2H: { en: "You are largely paying for R&D recovery, not for the molecule.", de: "Sie zahlen größtenteils für die Entwicklungskosten, nicht für das Molekül.", fr: "Vous payez surtout pour l'amortissement de la R&D, pas pour la molécule.", es: "Pagas sobre todo por recuperar la I+D, no por la molécula.", it: "Paghi soprattutto per il recupero della R&S, non per la molecola." },
  why3T: { en: "India's active ingredient manufacturing scale", de: "Indiens Produktionsmaßstab für Wirkstoffe", fr: "L'échelle de production indienne des principes actifs", es: "La escala de producción india de principios activos", it: "La scala produttiva indiana dei principi attivi" },
  why3B: {
    en: "India supplies a very large share of the world's generic medicine volume and produces many active pharmaceutical ingredients domestically. Enormous batch sizes spread fixed costs across millions of units, and vertical integration removes several import margins. The same plant may export to regulated markets while serving the domestic market at domestic pricing.",
    de: "Indien liefert einen sehr großen Anteil des weltweiten Generikavolumens und stellt viele Wirkstoffe selbst her. Riesige Chargen verteilen Fixkosten auf Millionen Einheiten, und vertikale Integration streicht mehrere Importmargen. Das gleiche Werk kann in regulierte Märkte exportieren und gleichzeitig den heimischen Markt zu Inlandspreisen beliefern.",
    fr: "L'Inde fournit une très grande part du volume mondial de génériques et produit elle-même de nombreux principes actifs. Des lots énormes répartissent les coûts fixes sur des millions d'unités, et l'intégration verticale supprime plusieurs marges d'importation. La même usine peut exporter vers des marchés régulés tout en servant le marché domestique à des prix locaux.",
    es: "India suministra una gran parte del volumen mundial de genéricos y produce muchos principios activos a nivel nacional. Los enormes lotes reparten los costos fijos entre millones de unidades, y la integración vertical elimina varios márgenes de importación. La misma planta puede exportar a mercados regulados mientras abastece el mercado nacional a precios locales.",
    it: "L'India fornisce una gran parte del volume mondiale di generici e produce molti principi attivi internamente. Gli enormi lotti distribuiscono i costi fissi su milioni di unità, e l'integrazione verticale elimina diversi margini d'importazione. Lo stesso stabilimento può esportare verso mercati regolati pur servendo il mercato interno a prezzi locali.",
  },
  why3H: { en: "Volume plus vertical integration crushes the unit cost.", de: "Volumen plus vertikale Integration drücken die Stückkosten.", fr: "Le volume plus l'intégration verticale écrase le coût unitaire.", es: "El volumen más la integración vertical aplasta el costo unitario.", it: "Volume più integrazione verticale schiacciano il costo unitario." },
  why4T: { en: "Price control and affordability regulation", de: "Preiskontrolle und Erschwinglichkeitsregulierung", fr: "Contrôle des prix et régulation de l'accessibilité", es: "Control de precios y regulación de accesibilidad", it: "Controllo dei prezzi e regolamentazione dell'accessibilità" },
  why4B: {
    en: "Essential medicines in India sit under a national price ceiling administered by the drug pricing authority, and public health programmes negotiate hard on volume. In the US there is no comparable ceiling for most drugs, and list prices pass through insurers and pharmacy benefit managers who each add margin before the patient sees a number.",
    de: "Essenzielle Medikamente in Indien unterliegen einer nationalen Preisobergrenze der Arzneimittelpreisbehörde, und öffentliche Gesundheitsprogramme verhandeln auf Volumen hart. In den USA gibt es für die meisten Medikamente keine vergleichbare Obergrenze, und Listenpreise laufen durch Versicherer und Pharmacy Benefit Manager, die jeweils eine Marge aufschlagen, bevor der Patient eine Zahl sieht.",
    fr: "En Inde, les médicaments essentiels sont soumis à un plafond national de prix géré par l'autorité de tarification pharmaceutique, et les programmes publics de santé négocient durement les volumes. Aux États-Unis, il n'existe pas de plafond comparable pour la plupart des médicaments, et les prix de liste passent par les assureurs et les gestionnaires de services pharmaceutiques qui ajoutent chacun leur marge avant que le patient ne voie le montant.",
    es: "En India, los medicamentos esenciales están sujetos a un techo nacional de precios gestionado por la autoridad de precios farmacéuticos, y los programas públicos de salud negocian duramente por volumen. En EE. UU. no existe un techo comparable para la mayoría de los medicamentos, y los precios de lista pasan por aseguradoras y gestores de beneficios farmacéuticos que añaden cada uno su margen antes de que el paciente vea la cifra.",
    it: "In India, i farmaci essenziali sono soggetti a un tetto nazionale di prezzo gestito dall'autorità di tariffazione farmaceutica, e i programmi sanitari pubblici negoziano duramente sui volumi. Negli USA non esiste un tetto comparabile per la maggior parte dei farmaci, e i prezzi di listino passano per assicuratori e gestori dei piani farmaceutici che aggiungono ciascuno il proprio margine prima che il paziente veda la cifra.",
  },
  why4H: { en: "A capped ceiling behaves very differently from an open list price.", de: "Eine gedeckelte Obergrenze verhält sich anders als ein offener Listenpreis.", fr: "Un plafond borné fonctionne très différemment d'un prix de liste libre.", es: "Un techo limitado se comporta muy diferente de un precio de lista abierto.", it: "Un tetto limitato si comporta molto diversamente da un prezzo di listino libero." },
  why5T: { en: "Lower operating, labour and compliance overhead", de: "Niedrigere Betriebs-, Arbeits- und Compliancekosten", fr: "Frais de fonctionnement, de main-d'œuvre et de conformité réduits", es: "Menores gastos operativos, laborales y de cumplimiento", it: "Minori costi operativi, di manodopera e di conformità" },
  why5B: {
    en: "Salaries, facilities, utilities, distribution and marketing all cost less in India. Originator pricing in Western markets also carries large sales, legal and insurance-negotiation overheads that a domestic Indian generic simply does not incur.",
    de: "Gehälter, Standorte, Energie, Vertrieb und Marketing kosten in Indien weniger. Die Preisgestaltung westlicher Originale trägt außerdem große Vertriebs-, Rechts- und Versicherungsverhandlungsaufwendungen, die ein indisches Inlandsgenerikum schlicht nicht hat.",
    fr: "Salaires, sites, énergie, distribution et marketing coûtent moins cher en Inde. La tarification des produits originaux sur les marchés occidentaux supporte également d'importants frais commerciaux, juridiques et de négociation d'assurance qu'un générique indien domestique n'a tout simplement pas.",
    es: "Salarios, instalaciones, servicios, distribución y marketing cuestan menos en India. La fijación de precios de los originales en mercados occidentales también carga grandes gastos de ventas, legales y de negociación con seguros que un genérico indio nacional simplemente no tiene.",
    it: "Stipendi, impianti, utenze, distribuzione e marketing costano meno in India. Il pricing dei prodotti originali nei mercati occidentali porta anche grandi oneri commerciali, legali e di negoziazione assicurativa che un generico indiano locale semplicemente non ha.",
  },
  why5H: { en: "Every layer of overhead eventually lands on the patient's bill.", de: "Jede Kostenstelle landet am Ende auf der Rechnung des Patienten.", fr: "Chaque couche de frais finit sur la facture du patient.", es: "Cada capa de gastos termina en la factura del paciente.", it: "Ogni strato di spese finisce sulla bolletta del paziente." },
  why6T: { en: "Voluntary licensing and compulsory licensing", de: "Freiwillige Lizenzierung und Zwangslizenzierung", fr: "Licences volontaires et licences obligatoires", es: "Licencias voluntarias y licencias obligatorias", it: "Licenze volontarie e licenze obbligatorie" },
  why6B: {
    en: "For several hepatitis C, HIV and cancer therapies, originators granted voluntary licences allowing Indian manufacturers to produce and supply lower-income markets. That is why a hepatitis C course priced in the tens of thousands in the US can be a few hundred dollars in India while remaining fully authorised.",
    de: "Bei mehreren Hepatitis-C-, HIV- und Krebstherapien erteilten Patentinhaber freiwillige Lizenzen, die es indischen Herstellern erlauben, für Märkte mit geringerem Einkommen zu produzieren und zu liefern. Deshalb kann ein Hepatitis-C-Kurs, der in den USA Zehntausende kostet, in Indien wenige Hundert Dollar kosten — vollständig autorisiert.",
    fr: "Pour plusieurs traitements de l'hépatite C, du VIH et du cancer, les titulaires de brevets ont accordé des licences volontaires permettant aux fabricants indiens de produire et d'approvisionner les marchés à revenus modestes. C'est pourquoi un traitement de l'hépatite C coûtant des dizaines de milliers de dollars aux États-Unis peut coûter quelques centaines de dollars en Inde, tout en restant pleinement autorisé.",
    es: "En varias terapias contra la hepatitis C, el VIH y el cáncer, los titulares otorgaron licencias voluntarias que permiten a los fabricantes indios producir y abastecer mercados de menores ingresos. Por eso un tratamiento de hepatitis C que cuesta decenas de miles en EE. UU. puede costar unos pocos cientos de dólares en India, permaneciendo totalmente autorizado.",
    it: "Per diverse terapie contro l'epatite C, l'HIV e il cancro, i titolari hanno concesso licenze volontarie che consentono ai produttori indiani di produrre e fornire i mercati a basso reddito. Ecco perché un ciclo contro l'epatite C che costa decine di migliaia di dollari negli USA può costare poche centinaia di dollari in India, restando pienamente autorizzato.",
  },
  why6H: { en: "Licensing is why some gaps are 100× rather than 3×.", de: "Lizenzen sind der Grund, warum manche Lücken 100-fach statt 3-fach sind.", fr: "Les licences expliquent pourquoi certains écarts sont de 100× plutôt que 3×.", es: "Las licencias explican por qué algunas brechas son de 100× en vez de 3×.", it: "Le licenze spiegano perché alcuni divari sono di 100× invece che 3×." },
  whyCheaperCautionTitle: { en: "What the price gap does not mean", de: "Was die Preislücke nicht bedeutet", fr: "Ce que l'écart de prix ne signifie pas", es: "Lo que la brecha de precios no significa", it: "Cosa il divario di prezzo non significa" },
  whyCheaperCautionBody: {
    en: "A lower price does not automatically mean an equivalent product for every therapy. Biologics and biosimilars, narrow-therapeutic-index drugs such as tacrolimus and warfarin, and modified-release formulations need specialist judgement before any switch. Manufacturing quality also varies between companies, which is why we always publish the manufacturer, salt, strength and pack size so you and your physician can evaluate the specific product.",
    de: "Ein niedrigerer Preis bedeutet nicht automatisch für jede Therapie ein gleichwertiges Produkt. Biologika und Biosimilars, Medikamente mit enger therapeutischer Breite wie Tacrolimus und Warfarin sowie Retardformulierungen erfordern vor jedem Wechsel fachärztliches Urteil. Die Fertigungsqualität variiert auch zwischen Unternehmen — deshalb veröffentlichen wir immer Hersteller, Wirkstoff, Stärke und Packungsgröße, damit Sie und Ihr Arzt das konkrete Produkt beurteilen können.",
    fr: "Un prix plus bas ne signifie pas automatiquement un produit équivalent pour chaque thérapie. Les produits biologiques et biosimilaires, les médicaments à marge thérapeutique étroite comme le tacrolimus et la warfarine, et les formulations à libération modifiée nécessitent un avis spécialisé avant tout changement. La qualité de fabrication varie aussi selon les entreprises — c'est pourquoi nous publions toujours le fabricant, le principe actif, le dosage et le format, pour que vous et votre médecin puissiez évaluer le produit précis.",
    es: "Un precio más bajo no significa automáticamente un producto equivalente para cada terapia. Los biológicos y biosimilares, los medicamentos de índice terapéutico estrecho como tacrolimus y warfarina, y las formulaciones de liberación modificada necesitan juicio especializado antes de cualquier cambio. La calidad de fabricación también varía entre empresas — por eso siempre publicamos el fabricante, la sal, la concentración y el formato, para que tú y tu médico podáis evaluar el producto concreto.",
    it: "Un prezzo più basso non significa automaticamente un prodotto equivalente per ogni terapia. Biologici e biosimilari, farmaci a indice terapeutico stretto come tacrolimus e warfarin e formulazioni a rilascio modificato richiedono un giudizio specialistico prima di qualsiasi cambio. Anche la qualità produttiva varia tra aziende — per questo pubblichiamo sempre produttore, principio attivo, dosaggio e formato, perché tu e il tuo medico possiate valutare il prodotto specifico.",
  },
} as const;

export type UiKey = keyof typeof U;
