/**
 * translate-seo-h2s.mjs
 *
 * Scans all src/content/seoPages/*.json files and replaces any English H2 strings
 * found in non-English (fr/ar/es/de/it/pt) language sections with their proper
 * translations.
 *
 * Usage: node scripts/translate-seo-h2s.mjs
 */

import fs from 'fs';
import path from 'path';

const seoDir = path.join(process.cwd(), 'src', 'content', 'seoPages');
const files = fs.readdirSync(seoDir).filter(f => f.endsWith('.json'));

const translations = {
  "Available Channels": {
    fr: "Chaînes Disponibles",
    ar: "القنوات المتاحة",
    es: "Canales Disponibles",
    de: "Verfügbare Sender",
    it: "Canali Disponibili",
    pt: "Canais Disponíveis",
  },
  "French Channels Available": {
    fr: "Chaînes Françaises Disponibles",
    ar: "القنوات الفرنسية المتاحة",
    es: "Canales Franceses Disponibles",
    de: "Verfügbare Französische Sender",
    it: "Canali Francesi Disponibili",
    pt: "Canais Franceses Disponíveis",
  },
  "Australian Channels Available": {
    fr: "Chaînes Australiennes Disponibles",
    ar: "القنوات الأسترالية المتاحة",
    es: "Canales Australianos Disponibles",
    de: "Verfügbare Australische Sender",
    it: "Canali Australiani Disponibili",
    pt: "Canais Australianos Disponíveis",
  },
  "Brazilian Channels Available": {
    fr: "Chaînes Brésiliennes Disponibles",
    ar: "القنوات البرازيلية المتاحة",
    es: "Canales Brasileños Disponibles",
    de: "Verfügbare Brasilianische Sender",
    it: "Canali Brasiliani Disponibili",
    pt: "Canais Brasileiros Disponíveis",
  },
  "Canadian Channels Available": {
    fr: "Chaînes Canadiennes Disponibles",
    ar: "القنوات الكندية المتاحة",
    es: "Canales Canadienses Disponibles",
    de: "Verfügbare Kanadische Sender",
    it: "Canali Canadesi Disponibili",
    pt: "Canais Canadenses Disponíveis",
  },
  "Spanish Channels Available": {
    fr: "Chaînes Espagnoles Disponibles",
    ar: "القنوات الإسبانية المتاحة",
    es: "Canales Españoles Disponibles",
    de: "Verfügbare Spanische Sender",
    it: "Canali Spagnoli Disponibili",
    pt: "Canais Espanhóis Disponíveis",
  },
  "Greek Channels Available": {
    fr: "Chaînes Grecques Disponibles",
    ar: "القنوات اليونانية المتاحة",
    es: "Canales Griegos Disponibles",
    de: "Verfügbare Griechische Sender",
    it: "Canali Greci Disponibili",
    pt: "Canais Gregos Disponíveis",
  },
  "Indian Channels Available": {
    fr: "Chaînes Indiennes Disponibles",
    ar: "القنوات الهندية المتاحة",
    es: "Canales Indios Disponibles",
    de: "Verfügbare Indische Sender",
    it: "Canali Indiani Disponibili",
    pt: "Canais Indianos Disponíveis",
  },
  "Indonesian Channels Available": {
    fr: "Chaînes Indonésiennes Disponibles",
    ar: "القنوات الإندونيسية المتاحة",
    es: "Canales Indonesios Disponibles",
    de: "Verfügbare Indonesische Sender",
    it: "Canali Indonesiani Disponibili",
    pt: "Canais Indonésios Disponíveis",
  },
  "Kenyan Channels Available": {
    fr: "Chaînes Kényanes Disponibles",
    ar: "القنوات الكينية المتاحة",
    es: "Canales Kenianos Disponibles",
    de: "Verfügbare Kenianische Sender",
    it: "Canali Kenioti Disponibili",
    pt: "Canais Quenianos Disponíveis",
  },
  "Nigerian Channels Available": {
    fr: "Chaînes Nigérianes Disponibles",
    ar: "القنوات النيجيرية المتاحة",
    es: "Canales Nigerianos Disponibles",
    de: "Verfügbare Nigerianische Sender",
    it: "Canali Nigeriani Disponibili",
    pt: "Canais Nigerianos Disponíveis",
  },
  "Pakistani Channels Available": {
    fr: "Chaînes Pakistanaises Disponibles",
    ar: "القنوات الباكستانية المتاحة",
    es: "Canales Pakistaníes Disponibles",
    de: "Verfügbare Pakistanische Sender",
    it: "Canali pakistani Disponibili",
    pt: "Canais Paquistaneses Disponíveis",
  },
  "Filipino Channels Available": {
    fr: "Chaînes Philippines Disponibles",
    ar: "القنوات الفلبينية المتاحة",
    es: "Canales Filipinos Disponibles",
    de: "Verfügbare Philippinische Sender",
    it: "Canali Filippini Disponibili",
    pt: "Canais Filipinos Disponíveis",
  },
  "Belgian Channels Available": {
    fr: "Chaînes Belges Disponibles",
    ar: "القنوات البلجيكية المتاحة",
    es: "Canales Belgas Disponibles",
    de: "Verfügbare Belgische Sender",
    it: "Canali Belgi Disponibili",
    pt: "Canais Belgas Disponíveis",
  },
  "German Channels Available": {
    fr: "Chaînes Allemandes Disponibles",
    ar: "القنوات الألمانية المتاحة",
    es: "Canales Alemanes Disponibles",
    de: "Verfügbare Deutsche Sender",
    it: "Canali Tedeschi Disponibili",
    pt: "Canais Alemães Disponíveis",
  },
  "Italian Channels Available": {
    fr: "Chaînes Italiennes Disponibles",
    ar: "القنوات الإيطالية المتاحة",
    es: "Canales Italianos Disponibles",
    de: "Verfügbare Italienische Sender",
    it: "Canali Italiani Disponibili",
    pt: "Canais Italianos Disponíveis",
  },
  "Dutch Channels Available": {
    fr: "Chaînes Néerlandaises Disponibles",
    ar: "القنوات الهولندية المتاحة",
    es: "Canales Neerlandeses Disponibles",
    de: "Verfügbare Niederländische Sender",
    it: "Canali Olandesi Disponibili",
    pt: "Canais Holandeses Disponíveis",
  },
  "Norwegian Channels Available": {
    fr: "Chaînes Norvégiennes Disponibles",
    ar: "القنوات النرويجية المتاحة",
    es: "Canales Noruegos Disponibles",
    de: "Verfügbare Norwegische Sender",
    it: "Canali Norvegesi Disponibili",
    pt: "Canais Noruegueses Disponíveis",
  },
  "Portuguese Channels Available": {
    fr: "Chaînes Portugaises Disponibles",
    ar: "القنوات البرتغالية المتاحة",
    es: "Canales Portugueses Disponibles",
    de: "Verfügbare Portugiesische Sender",
    it: "Canali Portoghesi Disponibili",
    pt: "Canais Portugueses Disponíveis",
  },
  "Swiss Channels Available": {
    fr: "Chaînes Suisses Disponibles",
    ar: "القنوات السويسرية المتاحة",
    es: "Canales Suizos Disponibles",
    de: "Verfügbare Schweizer Sender",
    it: "Canali Svizzeri Disponibili",
    pt: "Canais Suíços Disponíveis",
  },
  "Swedish Channels Available": {
    fr: "Chaînes Suédoises Disponibles",
    ar: "القنوات السويدية المتاحة",
    es: "Canales Suecos Disponibles",
    de: "Verfügbare Schwedische Sender",
    it: "Canali Svedesi Disponibili",
    pt: "Canais Suecos Disponíveis",
  },
  "Moroccan Channels Available": {
    fr: "Chaînes Marocaines Disponibles",
    ar: "القنوات المغربية المتاحة",
    es: "Canales Marroquíes Disponibles",
    de: "Verfügbare Marokkanische Sender",
    it: "Canali Marocchini Disponibili",
    pt: "Canais Marroquinos Disponíveis",
  },
  "US Channels Available": {
    fr: "Chaînes Américaines Disponibles",
    ar: "القنوات الأمريكية المتاحة",
    es: "Canales Estadounidenses Disponibles",
    de: "Verfügbare US-Sender",
    it: "Canali Statunitensi Disponibili",
    pt: "Canais Americanos Disponíveis",
  },
  "UK Channels Available": {
    fr: "Chaînes Britanniques Disponibles",
    ar: "القنوات البريطانية المتاحة",
    es: "Canales Británicos Disponibles",
    de: "Verfügbare Britische Sender",
    it: "Canali Britannici Disponibili",
    pt: "Canais Britânicos Disponíveis",
  },
  "UAE Channels Available": {
    fr: "Chaînes des Émirats Disponibles",
    ar: "القنوات الإماراتية المتاحة",
    es: "Canales de EAU Disponibles",
    de: "Verfügbare VAE-Sender",
    it: "Canali degli Emirati Disponibili",
    pt: "Canais dos Emirados Disponíveis",
  },
  "Ligue 1 & Sports Coverage": {
    fr: "Ligue 1 et Couverture Sportive",
    ar: "الدوري الفرنسي والتغطية الرياضية",
    es: "Ligue 1 y Cobertura Deportiva",
    de: "Ligue 1 und Sportberichterstattung",
    it: "Ligue 1 e Copertura Sportiva",
    pt: "Ligue 1 e Cobertura Desportiva",
  },
  "AFL, NRL & Sports Coverage": {
    fr: "AFL, NRL et Couverture Sportive",
    ar: "AFL وNRL والتغطية الرياضية",
    es: "AFL, NRL y Cobertura Deportiva",
    de: "AFL, NRL und Sportberichterstattung",
    it: "AFL, NRL e Copertura Sportiva",
    pt: "AFL, NRL e Cobertura Desportiva",
  },
  "Serie A & Sports Coverage": {
    fr: "Serie A et Couverture Sportive",
    ar: "الدوري البرازيلي والتغطية الرياضية",
    es: "Serie A y Cobertura Deportiva",
    de: "Serie A und Sportberichterstattung",
    it: "Serie A e Copertura Sportiva",
    pt: "Brasileirão e Cobertura Desportiva",
  },
  "NHL & Sports Coverage": {
    fr: "LNH et Couverture Sportive",
    ar: "NHL والتغطية الرياضية",
    es: "NHL y Cobertura Deportiva",
    de: "NHL und Sportberichterstattung",
    it: "NHL e Copertura Sportiva",
    pt: "NHL e Cobertura Desportiva",
  },
  "LaLiga & Sports Coverage": {
    fr: "LaLiga et Couverture Sportive",
    ar: "لا ليغا والتغطية الرياضية",
    es: "LaLiga y Cobertura Deportiva",
    de: "LaLiga und Sportberichterstattung",
    it: "LaLiga e Copertura Sportiva",
    pt: "LaLiga e Cobertura Desportiva",
  },
  "Bundesliga & Sports Coverage": {
    fr: "Bundesliga et Couverture Sportive",
    ar: "البوندسليغا والتغطية الرياضية",
    es: "Bundesliga y Cobertura Deportiva",
    de: "Bundesliga und Sportberichterstattung",
    it: "Bundesliga e Copertura Sportiva",
    pt: "Bundesliga e Cobertura Desportiva",
  },
  "IPL & Sports Coverage": {
    fr: "IPL et Couverture Sportive",
    ar: "IPL والتغطية الرياضية",
    es: "IPL y Cobertura Deportiva",
    de: "IPL und Sportberichterstattung",
    it: "IPL e Copertura Sportiva",
    pt: "IPL e Cobertura Desportiva",
  },
  "Sports Channels Available": {
    fr: "Chaînes Sportives Disponibles",
    ar: "القنوات الرياضية المتاحة",
    es: "Canales Deportivos Disponibles",
    de: "Verfügbare Sportsender",
    it: "Canali Sportivi Disponibili",
    pt: "Canais Desportivos Disponíveis",
  },
  "Sports & Entertainment Coverage": {
    fr: "Couverture Sportive et Divertissement",
    ar: "التغطية الرياضية والترفيهية",
    es: "Cobertura Deportiva y Entretenimiento",
    de: "Sport- und Unterhaltungsberichterstattung",
    it: "Copertura Sportiva e Intrattenimento",
    pt: "Cobertura Desportiva e Entretenimento",
  },
  "How to Watch French TV with IPTV": {
    fr: "Comment Regarder la TV Française avec IPTV",
    ar: "كيفية مشاهدة التلفزيون الفرنسي عبر IPTV",
    es: "Cómo Ver TV Francesa con IPTV",
    de: "So sehen Sie französisches Fernsehen mit IPTV",
    it: "Come Guardare la TV Francese con IPTV",
    pt: "Como Ver TV Francesa com IPTV",
  },
  "How to Set Up IPTV on Android": {
    fr: "Comment Configurer IPTV sur Android",
    ar: "كيفية إعداد IPTV على أندرويد",
    es: "Cómo Configurar IPTV en Android",
    de: "So richten Sie IPTV auf Android ein",
    it: "Come Configurare IPTV su Android",
    pt: "Como Configurar IPTV no Android",
  },
  "How to Install IPTV on Firestick": {
    fr: "Comment Installer IPTV sur Firestick",
    ar: "كيفية تثبيت IPTV على Firestick",
    es: "Cómo Instalar IPTV en Firestick",
    de: "So installieren Sie IPTV auf Firestick",
    it: "Come Installare IPTV su Firestick",
    pt: "Como Instalar IPTV no Firestick",
  },
  "How to Watch Indonesian TV Abroad": {
    fr: "Comment Regarder la TV Indonésienne à l'Étranger",
    ar: "كيفية مشاهدة التلفزيون الإندونيسي في الخارج",
    es: "Cómo Ver TV Indonesia en el Extranjero",
    de: "So sehen Sie indonesisches Fernsehen im Ausland",
    it: "Come Guardare la TV Indonesiana all'Estero",
    pt: "Como Ver TV Indonésia no Estrangeiro",
  },
  "How to Set Up IPTV on iPhone": {
    fr: "Comment Configurer IPTV sur iPhone",
    ar: "كيفية إعداد IPTV على الآيفون",
    es: "Cómo Configurar IPTV en iPhone",
    de: "So richten Sie IPTV auf dem iPhone ein",
    it: "Come Configurare IPTV su iPhone",
    pt: "Como Configurar IPTV no iPhone",
  },
  "How to Use M3U Links": {
    fr: "Comment Utiliser les Liens M3U",
    ar: "كيفية استخدام روابط M3U",
    es: "Cómo Usar Enlaces M3U",
    de: "So verwenden Sie M3U-Links",
    it: "Come Usare i Link M3U",
    pt: "Como Usar Links M3U",
  },
  "How to Watch Nigerian TV Abroad": {
    fr: "Comment Regarder la TV Nigériane à l'Étranger",
    ar: "كيفية مشاهدة التلفزيون النيجيري في الخارج",
    es: "Cómo Ver TV Nigeriana en el Extranjero",
    de: "So sehen Sie nigerianisches Fernsehen im Ausland",
    it: "Come Guardare la TV Nigeriana all'Estero",
    pt: "Como Ver TV Nigeriana no Estrangeiro",
  },
  "How to Watch Kenyan TV Abroad": {
    fr: "Comment Regarder la TV Kényane à l'Étranger",
    ar: "كيفية مشاهدة التلفزيون الكيني في الخارج",
    es: "Cómo Ver TV Keniana en el Extranjero",
    de: "So sehen Sie kenianisches Fernsehen im Ausland",
    it: "Come Guardare la TV Keniota all'Estero",
    pt: "Como Ver TV Queniana no Estrangeiro",
  },
  "How to Watch Pakistani TV Abroad": {
    fr: "Comment Regarder la TV Pakistanaise à l'Étranger",
    ar: "كيفية مشاهدة التلفزيون الباكستاني في الخارج",
    es: "Cómo Ver TV Pakistaní en el Extranjero",
    de: "So sehen Sie pakistanisches Fernsehen im Ausland",
    it: "Come Guardare la TV Pakistana all'Estero",
    pt: "Como Ver TV Paquistanesa no Estrangeiro",
  },
  "How to Install IPTV on Samsung TV": {
    fr: "Comment Installer IPTV sur Samsung TV",
    ar: "كيفية تثبيت IPTV على تلفزيون سامسونج",
    es: "Cómo Instalar IPTV en Samsung TV",
    de: "So installieren Sie IPTV auf Samsung TV",
    it: "Come Installare IPTV su Samsung TV",
    pt: "Como Instalar IPTV na Samsung TV",
  },
  "How to Install IPTV on Smart TV": {
    fr: "Comment Installer IPTV sur Smart TV",
    ar: "كيفية تثبيت IPTV على التلفزيون الذكي",
    es: "Cómo Instalar IPTV en Smart TV",
    de: "So installieren Sie IPTV auf Smart TV",
    it: "Come Installare IPTV su Smart TV",
    pt: "Como Instalar IPTV na Smart TV",
  },
  "How to Set Up IPTV Smarters": {
    fr: "Comment Configurer IPTV Smarters",
    ar: "كيفية إعداد IPTV Smarters",
    es: "Cómo Configurar IPTV Smarters",
    de: "So richten Sie IPTV Smarters ein",
    it: "Come Configurare IPTV Smarters",
    pt: "Como Configurar o IPTV Smarters",
  },
  "Why IPTV is Growing in Greece": {
    fr: "Pourquoi l'IPTV se Développe en Grèce",
    ar: "لماذا ينمو IPTV في اليونان",
    es: "Por Qué el IPTV Está Creciendo en Grecia",
    de: "Warum IPTV in Griechenland wächst",
    it: "Perché l'IPTV Sta Crescendo in Grecia",
    pt: "Por Que a IPTV Está a Crescer na Grécia",
  },
  "Why IPTV is Popular in Indonesia": {
    fr: "Pourquoi l'IPTV est Populaire en Indonésie",
    ar: "لماذا IPTV شائع في إندونيسيا",
    es: "Por Qué el IPTV es Popular en Indonesia",
    de: "Warum IPTV in Indonesien beliebt ist",
    it: "Perché l'IPTV è Popolare in Indonesia",
    pt: "Por Que a IPTV é Popular na Indonésia",
  },
  "Why IPTV is Popular in Kenya": {
    fr: "Pourquoi l'IPTV est Populaire au Kenya",
    ar: "لماذا IPTV شائع في كينيا",
    es: "Por Qué el IPTV es Popular en Kenia",
    de: "Warum IPTV in Kenia beliebt ist",
    it: "Perché l'IPTV è Popolare in Kenya",
    pt: "Por Que a IPTV é Popular no Quénia",
  },
  "Why IPTV is Growing in Nigeria": {
    fr: "Pourquoi l'IPTV se Développe au Nigéria",
    ar: "لماذا ينمو IPTV في نيجيريا",
    es: "Por Qué el IPTV Está Creciendo en Nigeria",
    de: "Warum IPTV in Nigeria wächst",
    it: "Perché l'IPTV Sta Crescendo in Nigeria",
    pt: "Por Que a IPTV Está a Crescer na Nigéria",
  },
  "Why IPTV is Growing in Pakistan": {
    fr: "Pourquoi l'IPTV se Développe au Pakistan",
    ar: "لماذا ينمو IPTV في باكستان",
    es: "Por Qué el IPTV Está Creciendo en Pakistán",
    de: "Warum IPTV in Pakistan wächst",
    it: "Perché l'IPTV Sta Crescendo in Pakistan",
    pt: "Por Que a IPTV Está a Crescer no Paquistão",
  },
  "Why IPTV is Perfect for Filipinos": {
    fr: "Pourquoi l'IPTV est Parfait pour les Philippins",
    ar: "لماذا IPTV مثالي للفلبينيين",
    es: "Por Qué el IPTV es Perfecto para los Filipinos",
    de: "Warum IPTV perfekt für Filipinos ist",
    it: "Perché l'IPTV è Perfetto per i Filippini",
    pt: "Por Que a IPTV é Perfeita para os Filipinos",
  },
  "Why IPTV is Growing in South Africa": {
    fr: "Pourquoi l'IPTV se Développe en Afrique du Sud",
    ar: "لماذا ينمو IPTV في جنوب أفريقيا",
    es: "Por Qué el IPTV Está Creciendo en Sudáfrica",
    de: "Warum IPTV in Südafrika wächst",
    it: "Perché l'IPTV Sta Crescendo in Sudafrica",
    pt: "Por Que a IPTV Está a Crescer na África do Sul",
  },
  "Why IPTV is Popular in Morocco": {
    fr: "Pourquoi l'IPTV est Populaire au Maroc",
    ar: "لماذا IPTV شائع في المغرب",
    es: "Por Qué el IPTV es Popular en Marruecos",
    de: "Warum IPTV in Marokko beliebt ist",
    it: "Perché l'IPTV è Popolare in Marocco",
    pt: "Por Que a IPTV é Popular em Marrocos",
  },
  "Why Firestick is the Best Device for IPTV": {
    fr: "Pourquoi Firestick est le Meilleur Appareil pour IPTV",
    ar: "لماذا Firestick هو أفضل جهاز لـ IPTV",
    es: "Por Qué Firestick es el Mejor Dispositivo para IPTV",
    de: "Warum Firestick das beste Gerät für IPTV ist",
    it: "Perché Firestick è il Miglior Dispositivo per IPTV",
    pt: "Por Que o Firestick é o Melhor Dispositivo para IPTV",
  },
  "Why Samsung TV is Great for IPTV": {
    fr: "Pourquoi Samsung TV est Idéal pour IPTV",
    ar: "لماذا تلفزيون سامسونج رائع لـ IPTV",
    es: "Por Qué Samsung TV es Excelente para IPTV",
    de: "Warum Samsung TV großartig für IPTV ist",
    it: "Perché Samsung TV è Ottimo per IPTV",
    pt: "Por Que a Samsung TV é Ótima para IPTV",
  },
  "Why Choose IPTV 4K World for Smarters": {
    fr: "Pourquoi Choisir IPTV 4K World pour Smarters",
    ar: "لماذا تختار IPTV 4K World لـ Smarters",
    es: "Por Qué Elegir IPTV 4K World para Smarters",
    de: "Warum IPTV 4K World für Smarters wählen",
    it: "Perché Scegliere IPTV 4K World per Smarters",
    pt: "Por Que Escolher o IPTV 4K World para Smarters",
  },
  "Features to Look For": {
    fr: "Fonctionnalités à Rechercher",
    ar: "الميزات التي يجب البحث عنها",
    es: "Características a Buscar",
    de: "Worauf Sie achten sollten",
    it: "Caratteristiche da Cercare",
    pt: "Características a Procurar",
  },
  "Requirements for 4K Streaming": {
    fr: "Prérequis pour le Streaming 4K",
    ar: "متطلبات البث بدقة 4K",
    es: "Requisitos para Streaming 4K",
    de: "Voraussetzungen für 4K-Streaming",
    it: "Requisiti per lo Streaming 4K",
    pt: "Requisitos para Streaming 4K",
  },
  "Best IPTV Player for Android": {
    fr: "Meilleur Lecteur IPTV pour Android",
    ar: "أفضل مشغل IPTV للأندرويد",
    es: "Mejor Reproductor IPTV para Android",
    de: "Bester IPTV-Player für Android",
    it: "Miglior Lettore IPTV per Android",
    pt: "Melhor Leitor IPTV para Android",
  },
  "Android TV Box Compatibility": {
    fr: "Compatibilité avec Android TV Box",
    ar: "التوافق مع جهاز Android TV Box",
    es: "Compatibilidad con Android TV Box",
    de: "Kompatibilität mit Android TV Box",
    it: "Compatibilità con Android TV Box",
    pt: "Compatibilidade com Android TV Box",
  },
  "Best IPTV App for Firestick": {
    fr: "Meilleure Application IPTV pour Firestick",
    ar: "أفضل تطبيق IPTV لـ Firestick",
    es: "Mejor App IPTV para Firestick",
    de: "Beste IPTV-App für Firestick",
    it: "Migliore App IPTV per Firestick",
    pt: "Melhor App IPTV para Firestick",
  },
  "Best IPTV Player for iOS": {
    fr: "Meilleur Lecteur IPTV pour iOS",
    ar: "أفضل مشغل IPTV لنظام iOS",
    es: "Mejor Reproductor IPTV para iOS",
    de: "Bester IPTV-Player für iOS",
    it: "Miglior Lettore IPTV per iOS",
    pt: "Melhor Leitor IPTV para iOS",
  },
  "IPTV on Apple TV": {
    fr: "IPTV sur Apple TV",
    ar: "IPTV على Apple TV",
    es: "IPTV en Apple TV",
    de: "IPTV auf Apple TV",
    it: "IPTV su Apple TV",
    pt: "IPTV na Apple TV",
  },
  "Best Settings for IPTV on Samsung": {
    fr: "Meilleurs Réglages pour IPTV sur Samsung",
    ar: "أفضل الإعدادات لـ IPTV على سامسونج",
    es: "Mejores Ajustes para IPTV en Samsung",
    de: "Beste Einstellungen für IPTV auf Samsung",
    it: "Migliori Impostazioni per IPTV su Samsung",
    pt: "Melhores Configurações para IPTV na Samsung",
  },
  "Best Smart TV for IPTV": {
    fr: "Meilleure Smart TV pour IPTV",
    ar: "أفضل تلفزيون ذكي لـ IPTV",
    es: "Mejor Smart TV para IPTV",
    de: "Bester Smart TV für IPTV",
    it: "Miglior Smart TV per IPTV",
    pt: "Melhor Smart TV para IPTV",
  },
  "Smart TV Apps for IPTV": {
    fr: "Applications Smart TV pour IPTV",
    ar: "تطبيقات التلفزيون الذكي لـ IPTV",
    es: "Apps Smart TV para IPTV",
    de: "Smart-TV-Apps für IPTV",
    it: "App Smart TV per IPTV",
    pt: "Apps Smart TV para IPTV",
  },
  "What is an IPTV M3U Playlist": {
    fr: "Qu'est-ce qu'une Playlist M3U IPTV",
    ar: "ما هي قائمة تشغيل M3U لـ IPTV",
    es: "Qué es una Lista de Reproducción M3U IPTV",
    de: "Was ist eine IPTV M3U-Wiedergabeliste",
    it: "Cos'è una Playlist M3U IPTV",
    pt: "O Que é uma Playlist M3U IPTV",
  },
  "Best Players for M3U IPTV": {
    fr: "Meilleurs Lecteurs pour IPTV M3U",
    ar: "أفضل المشغلات لـ IPTV M3U",
    es: "Mejores Reproductores para IPTV M3U",
    de: "Beste Player für M3U IPTV",
    it: "Migliori Lettori per IPTV M3U",
    pt: "Melhores Leitores para IPTV M3U",
  },
  "What is IPTV Smarters Pro": {
    fr: "Qu'est-ce que IPTV Smarters Pro",
    ar: "ما هو IPTV Smarters Pro",
    es: "Qué es IPTV Smarters Pro",
    de: "Was ist IPTV Smarters Pro",
    it: "Cos'è IPTV Smarters Pro",
    pt: "O Que é o IPTV Smarters Pro",
  },
  "Premium Features Included": {
    fr: "Fonctionnalités Premium Incluses",
    ar: "الميزات المميزة المتضمنة",
    es: "Funciones Premium Incluidas",
    de: "Enthaltene Premium-Funktionen",
    it: "Funzionalità Premium Incluse",
    pt: "Funcionalidades Premium Incluídas",
  },
  "Premium IPTV vs Free IPTV": {
    fr: "IPTV Premium vs IPTV Gratuit",
    ar: "IPTV المميز مقابل IPTV المجاني",
    es: "IPTV Premium vs IPTV Gratuito",
    de: "Premium IPTV vs. Kostenloses IPTV",
    it: "IPTV Premium vs IPTV Gratuito",
    pt: "IPTV Premium vs IPTV Grátis",
  },
  "IPTV vs DStv — Save Money": {
    fr: "IPTV vs DStv — Économisez de l'Argent",
    ar: "IPTV مقابل DStv — وفر المال",
    es: "IPTV vs DStv — Ahorra Dinero",
    de: "IPTV vs. DStv — Geld sparen",
    it: "IPTV vs DStv — Risparmia Denaro",
    pt: "IPTV vs DStv — Poupe Dinheiro",
  },
  "Watch Greek TV from Abroad": {
    fr: "Regarder la TV Grecque depuis l'Étranger",
    ar: "مشاهدة التلفزيون اليوناني من الخارج",
    es: "Ver TV Griega desde el Extranjero",
    de: "Griechisches Fernsehen aus dem Ausland sehen",
    it: "Guarda la TV Greca dall'Estero",
    pt: "Ver TV Grega do Estrangeiro",
  },
  "Watch Kenyan TV from Abroad": {
    fr: "Regarder la TV Kényane depuis l'Étranger",
    ar: "مشاهدة التلفزيون الكيني من الخارج",
    es: "Ver TV Keniana desde el Extranjero",
    de: "Kenisches Fernsehen aus dem Ausland sehen",
    it: "Guarda la TV Keniota dall'Estero",
    pt: "Ver TV Queniana do Estrangeiro",
  },
  "Watch Pakistani TV Abroad": {
    fr: "Regarder la TV Pakistanaise depuis l'Étranger",
    ar: "مشاهدة التلفزيون الباكستاني من الخارج",
    es: "Ver TV Pakistaní desde el Extranjero",
    de: "Pakistanisches Fernsehen aus dem Ausland sehen",
    it: "Guarda la TV Pakistana dall'Estero",
    pt: "Ver TV Paquistanesa do Estrangeiro",
  },
  "IPTV for OFWs — Watch Home Channels Abroad": {
    fr: "IPTV pour les Travailleurs Philippins — Regardez vos Chaînes depuis l'Étranger",
    ar: "IPTV للعمال الفلبينيين في الخارج — شاهد قنوات بلدك من الخارج",
    es: "IPTV para Trabajadores Filipinos — Mira Canales de tu País en el Extranjero",
    de: "IPTV für philippinische Arbeitskräfte — Heimatsender aus dem Ausland sehen",
    it: "IPTV per Lavoratori Filippini — Guarda i Canali di Casa dall'Estero",
    pt: "IPTV para Trabalhadores Filipinos — Veja os Canais de Casa no Estrangeiro",
  },
};

// ── Processing ──────────────────────────────────────────────────────────

let total = 0;
let changed = 0;

for (const file of files) {
  const fp = path.join(seoDir, file);
  let raw = fs.readFileSync(fp, 'utf8');
  let data;
  try { data = JSON.parse(raw); } catch(e) {
    console.error('SKIP ' + file + ': invalid JSON');
    continue;
  }
  if (!data.languages) continue;

  let fileChanged = 0;
  const langs = Object.keys(data.languages).filter(l => l !== 'en');

  for (const lang of langs) {
    const section = data.languages[lang];
    if (!section || !Array.isArray(section.h2s)) continue;

    let sectionChanged = false;
    for (let i = 0; i < section.h2s.length; i++) {
      const h2 = section.h2s[i];
      if (translations[h2] && translations[h2][lang]) {
        section.h2s[i] = translations[h2][lang];
        sectionChanged = true;
        fileChanged++;
      }
    }
  }

  if (fileChanged > 0) {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log('OK ' + file + ': ' + fileChanged + ' H2(s) translated');
    total += fileChanged;
    changed++;
  }
}

console.log('\nDONE! ' + total + ' H2(s) translated across ' + changed + ' file(s)');

// ── Verification ────────────────────────────────────────────────────────

console.log('\nVerifying...');
let remaining = 0;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(seoDir, file), 'utf8'));
  const enH2s = new Set(data.languages.en?.h2s || []);
  for (const lang of Object.keys(data.languages).filter(l => l !== 'en')) {
    const section = data.languages[lang];
    if (!section || !section.h2s) continue;
    for (const h2 of section.h2s) {
      if (enH2s.has(h2)) {
        console.log('  WARN ' + file + ' [' + lang + ']: ' + h2);
        remaining++;
      }
    }
  }
}

if (remaining === 0) {
  console.log('  OK All English H2s translated!');
} else {
  console.log('  WARN ' + remaining + ' English H2(s) still need translation');
}
