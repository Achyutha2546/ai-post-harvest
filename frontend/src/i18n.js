import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "Market Intelligence",
      "tagline": "Predict, Plan, and Profit",
      "crop_strategy": "Crop Strategy",
      "select_harvest": "Select your harvest",
      "volume": "Volume (Qtl)",
      "date": "Date",
      "district": "District",
      "place": "Place / APMC",
      "search_district": "Search District...",
      "search_place": "Search Place...",
      "select_district_first": "Select District first",
      "generate_insights": "Generate Insights",
      "running_model": "Running AI Model...",
      "live_data": "Live Data",
      "download_report": "Download Report",
      "crop": "Crop",
      "quantity": "Quantity",
      "location": "Location",
      "why_this_decision": "Why this decision?",
      "reasoning": "Our AI engine analyzed historical patterns, current trends, and regional price variations.",
      "sell_now": "Prices might drop soon",
      "wait": "Prices are likely to recover",
      "transport": "Profit is higher than transport costs, so transport to {{mandi}} market",
      "back": "Go Back",
      "SELL": "Sell Now",
      "WAIT": "Wait",
      "TRAVEL": "Transport"
    }
  },
  te: {
    translation: {
      "app_name": "మార్కెట్ ఇంటెలిజెన్స్",
      "tagline": "ముందస్తు అంచనా, ప్రణాళిక మరియు లాభం",
      "crop_strategy": "పంట వ్యూహం",
      "select_harvest": "మీ పంటను ఎంచుకోండి",
      "volume": "పరిమాణం (క్వింటాళ్ళు)",
      "date": "తేదీ",
      "district": "జిల్లా",
      "place": "ప్రాంతం / APMC",
      "search_district": "జిల్లాను వెతకండి...",
      "search_place": "ప్రాంతాన్ని వెతకండి...",
      "select_district_first": "ముందుగా జిల్లాను ఎంచుకోండి",
      "generate_insights": "విశ్లేషణను పొందండి",
      "running_model": "AI మోడల్ రన్ అవుతోంది...",
      "live_data": "Live డేటా",
      "download_report": "రిపోర్ట్ డౌన్‌లోడ్",
      "crop": "పంట",
      "quantity": "పరిమాణం",
      "location": "ప్రాంతం",
      "why_this_decision": "ఈ నిర్ణయం ఎందుకు?",
      "reasoning": "మా AI ఇంజిన్ గతం నుండి సేకరించిన నమూనాలు, ప్రస్తుత పోకడలు మరియు ప్రాంతీయ ధరల వ్యత్యాసాలను విశ్లేషించింది.",
      "sell_now": "ధరలు త్వరలో పడిపోవచ్చు",
      "wait": "ధరలు కోలుకునే అవకాశం ఉంది",
      "transport": "రవాణా ఖర్చుల కంటే లాభం ఎక్కువగా ఉంటుంది కాబట్టి {{mandi}} మార్కెట్ కి రవాణా చేయండి",
      "back": "వెనక్కి వెళ్ళండి",
      "SELL": "అమ్మేయండి",
      "WAIT": "ఆగండి",
      "TRAVEL": "రవాణా చేయండి"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
