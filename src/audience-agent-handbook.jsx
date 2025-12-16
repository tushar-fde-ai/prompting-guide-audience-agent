import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle, XCircle, AlertCircle, Send, TrendingUp, Sparkles, ChevronDown, Copy, Check, ArrowUp } from 'lucide-react';

const AudienceAgentHandbook = () => {
  const [language, setLanguage] = useState('en');
  const [quizPrompt, setQuizPrompt] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedPrompts, setCopiedPrompts] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Detect active section
      const sections = ['intro', 'section1', 'section2', 'section3', 'section4', 'section5', 'quickref', 'quiz'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const analyzePrompt = (prompt) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      let score = 50;
      let feedback = [];
      let positives = [];
      
      const lowerPrompt = prompt.toLowerCase();
      
      // Positive indicators
      if (lowerPrompt.includes('create') || lowerPrompt.includes('segment') || lowerPrompt.includes('analyze')) {
        score += 10;
        positives.push(language === 'en' ? 'Clear objective stated' : 'Objetivo claro establecido');
      }
      
      if (lowerPrompt.match(/\d+\s*(days?|weeks?|months?|años?|días?|meses?|semanas?)/)) {
        score += 10;
        positives.push(language === 'en' ? 'Specific timeframe included' : 'Marco temporal específico incluido');
      }
      
      if (lowerPrompt.match(/\$\d+|>\s*\d+|<\s*\d+|between\s+\d+/)) {
        score += 10;
        positives.push(language === 'en' ? 'Quantitative criteria specified' : 'Criterios cuantitativos especificados');
      }
      
      if ((lowerPrompt.match(/and|y/g) || []).length >= 2) {
        score += 10;
        positives.push(language === 'en' ? 'Multiple conditions defined' : 'Múltiples condiciones definidas');
      }
      
      if (lowerPrompt.includes('jeep') || lowerPrompt.includes('ram') || lowerPrompt.includes('dodge') || lowerPrompt.includes('chrysler') || lowerPrompt.includes('fiat') || lowerPrompt.includes('alfa romeo') || lowerPrompt.includes('maserati') || lowerPrompt.includes('peugeot') || lowerPrompt.includes('citroën') || lowerPrompt.includes('opel') || lowerPrompt.includes('stellantis') || lowerPrompt.includes('brand') || lowerPrompt.includes('marca') || lowerPrompt.match(/vehicle|vehiculo|car|auto/)) {
        score += 5;
        positives.push(language === 'en' ? 'Specific brand/vehicle mentioned' : 'Marca/vehículo específico mencionado');
      }

      if (lowerPrompt.includes('opt-in') || lowerPrompt.includes('optin') || lowerPrompt.includes('test drive') || lowerPrompt.includes('prueba de manejo') || lowerPrompt.includes('lead') || lowerPrompt.includes('prospect') || lowerPrompt.includes('customer')) {
        score += 5;
        positives.push(language === 'en' ? 'Lead/prospect status referenced' : 'Estado de lead/prospecto referenciado');
      }

      if (lowerPrompt.includes('email') || lowerPrompt.includes('correo') || lowerPrompt.includes('website') || lowerPrompt.includes('sitio') || lowerPrompt.includes('click') || lowerPrompt.includes('open') || lowerPrompt.includes('abrir') || lowerPrompt.includes('dealership') || lowerPrompt.includes('concesionario')) {
        score += 5;
        positives.push(language === 'en' ? 'Channel/engagement metrics specified' : 'Métricas de canal/engagement especificadas');
      }

      if (lowerPrompt.includes('bar chart') || lowerPrompt.includes('pie chart') || lowerPrompt.includes('gráfico') || lowerPrompt.includes('table') || lowerPrompt.includes('tabla') || lowerPrompt.includes('x-axis') || lowerPrompt.includes('y-axis') || lowerPrompt.includes('eje')) {
        score += 10;
        positives.push(language === 'en' ? 'Visualization type and format specified' : 'Tipo y formato de visualización especificado');
      }

      if (lowerPrompt.includes('profile') || lowerPrompt.includes('perfil') || lowerPrompt.includes('enriched') || lowerPrompt.includes('enriquecido') || lowerPrompt.includes('purchase intent') || lowerPrompt.includes('intención de compra') || lowerPrompt.includes('vehicle preference') || lowerPrompt.includes('preferencia de vehículo')) {
        score += 5;
        positives.push(language === 'en' ? 'Profile/enriched data fields referenced' : 'Campos de datos de perfil/enriquecidos referenciados');
      }
      
      // Negative indicators
      if (lowerPrompt.match(/maybe|perhaps|might|tal vez|quizás|posiblemente/)) {
        score -= 10;
        feedback.push(language === 'en' ? 'Remove uncertain language (maybe, perhaps)' : 'Eliminar lenguaje incierto (tal vez, quizás)');
      }
      
      if (lowerPrompt.match(/good|better|best|mejores?|buenos?/)) {
        score -= 10;
        feedback.push(language === 'en' ? 'Avoid vague qualifiers - be specific' : 'Evitar calificadores vagos - ser específico');
      }
      
      if (!lowerPrompt.match(/create|analyze|show|find|crea|analiza|muestra|encuentra/)) {
        score -= 15;
        feedback.push(language === 'en' ? 'Start with a clear action verb' : 'Comenzar con un verbo de acción claro');
      }
      
      if (prompt.length < 20) {
        score -= 15;
        feedback.push(language === 'en' ? 'Prompt is too short - add more detail' : 'Prompt muy corto - agregar más detalle');
      }
      
      if (prompt.split(' ').length > 100) {
        score -= 10;
        feedback.push(language === 'en' ? 'Prompt is too long - break into steps' : 'Prompt muy largo - dividir en pasos');
      }
      
      // Cap score between 0 and 100
      score = Math.max(0, Math.min(100, score));
      
      let rating = 'Poor';
      let color = 'red';
      
      if (score >= 80) {
        rating = language === 'en' ? 'Excellent' : 'Excelente';
        color = 'green';
      } else if (score >= 60) {
        rating = language === 'en' ? 'Good' : 'Bueno';
        color = 'blue';
      } else if (score >= 40) {
        rating = language === 'en' ? 'Fair' : 'Regular';
        color = 'yellow';
      } else {
        rating = language === 'en' ? 'Needs Improvement' : 'Necesita Mejora';
        color = 'red';
      }
      
      setQuizResult({
        score,
        rating,
        color,
        feedback,
        positives
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const copyPrompt = (promptId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompts(prev => ({ ...prev, [promptId]: true }));
    setTimeout(() => {
      setCopiedPrompts(prev => ({ ...prev, [promptId]: false }));
    }, 2000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const content = {
    en: {
      title: "Audience Agent Prompting Guide",
      subtitle: "Best Practices for Segment Creation & Analysis",
      company: "",
      toggle: "Español",
      toc: {
        title: "Table of Contents",
        items: [
          { id: 'intro', label: 'Introduction' },
          { id: 'section1', label: '1. Start Small' },
          { id: 'section2', label: '2. Add Rules' },
          { id: 'section3', label: '3. Complex Rules' },
          { id: 'section4', label: '4. Text Matching' },
          { id: 'section5', label: '5. Insights' },
          { id: 'quickref', label: 'Quick Reference' },
          { id: 'quiz', label: 'Test Your Skills' }
        ]
      },
      sections: {
        intro: {
          title: "Introduction",
          text: "The Audience Agent is a powerful tool for analyzing user data segments and creating new targeted segments. This guide will help you craft effective prompts to maximize its capabilities."
        },
        startSmall: {
          title: "1. Start with Simple Segment Rules",
          description: "Begin with basic, single-condition segments before adding complexity.",
          why: "Why this matters:",
          reasons: [
            "Easier to validate results and understand segment behavior",
            "Faster processing and clearer insights",
            "Provides a solid foundation for iterative refinement"
          ],
          goodExample: {
            title: "Good Prompt Example",
            prompt: "Create a segment of customers who currently own a Jeep vehicle and have indicated interest in electric vehicles, based on their profile data.",
            explanation: "Clear criteria targeting specific vehicle ownership and interest attributes. Single logical condition with two related profile fields."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Show me everyone who might be interested in cars or seems like they want a new vehicle.",
            explanation: "Too vague, multiple unclear conditions, uses uncertain language like 'might be' and 'seems'."
          }
        },
        addRules: {
          title: "2. Incrementally Add More Rules",
          description: "Once your basic segment works, layer on additional conditions strategically.",
          approach: "Recommended Approach:",
          steps: [
            "Start with your core defining criteria",
            "Test and verify the initial segment",
            "Add one additional rule at a time",
            "Validate after each addition to track impact"
          ],
          goodExample: {
            title: "Good Progressive Prompt",
            prompt: "Create a segment of high-intent Ram truck prospects where users meet ALL of these criteria: (1) have visited the Ram truck configurator page in the last 30 days, AND (2) have opened or clicked emails about truck promotions in the last 30 days, AND (3) have requested a test drive or dealer quote.",
            explanation: "Clear progression, numbered conditions, explicit AND relationship, specific timeframes, defines 'high-intent' with measurable criteria."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Find users who are interested in trucks and active recently.",
            explanation: "No specific criteria for 'interested' or 'active', no timeframes, vague qualifiers."
          }
        },
        complexRules: {
          title: "3. Handling Multiple Conditions (AND/OR Logic)",
          description: "When your segment requires complex logic, structure your prompt clearly.",
          bestPractices: "Best Practices:",
          tips: [
            "Explicitly state AND/OR relationships",
            "Use numbered lists for multiple conditions",
            "Group related conditions with parentheses",
            "Be specific about precedence when mixing AND/OR"
          ],
          goodExample: {
            title: "Good Complex Prompt",
            prompt: "Create an audience segment of customers interested in electric vehicles where users meet ANY of these criteria:\n1. Have indicated they own a hybrid or EV in their profile, OR\n2. Have visited the Jeep 4xe or Fiat 500e pages on the website, OR\n3. Have selected 'sustainability' or 'EV' in their 'Vehicle Preferences' survey responses.\nAND all users must be within 50 miles of a Stellantis dealership.",
            explanation: "Clear structure with explicit OR conditions grouped together, final AND condition clearly separated, references specific data sources (profile, web visits, survey)."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Find people who like electric cars or might be interested in eco-friendly vehicles.",
            explanation: "Ambiguous logic, unclear data sources, uses uncertain language like 'might be', no clear criteria for 'interested'."
          }
        },
        stringMatching: {
          title: "4. Using Text Matching for Filters",
          description: "When filtering by text fields like lead sources, enriched profile data, or brand interactions, be clear about what you're looking for.",
          guidelines: "Guidelines:",
          rules: [
            "Specify the exact field names or data sources when known",
            "For lead data, mention the specific brand or campaign source",
            "For enriched fields, reference the exact attribute (purchase intent, vehicle preference, etc.)",
            "When filtering by brand interactions, specify the channel (email, web, dealership, campaigns)"
          ],
          goodExample: {
            title: "Good Text Matching Prompt",
            prompt: "Create a segment of leads from the 'Dodge Hornet Launch' campaign who have a phone number on file AND have a purchase intent of 'high' or 'very high' in their enriched profile data AND own a vehicle older than 5 years.",
            explanation: "Clear campaign source specified, references specific enriched fields (phone number, purchase intent, vehicle age), explicit values for filtering."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Find leads who have contact info and seem ready to buy a car.",
            explanation: "Vague 'contact info', subjective term 'seem ready to buy', no reference to actual data fields or enrichment attributes."
          }
        },
        insights: {
          title: "5. Requesting Segment Insights & Visualizations",
          description: "When analyzing data or requesting visualizations, specify the exact chart type, metrics, and time period.",
          tips: "Effective Insight Requests:",
          points: [
            "Specify the visualization type (bar chart, pie chart, table, etc.)",
            "Define the exact metrics or data points for each axis",
            "Set clear timeframes for analysis",
            "Request comparisons or breakdowns when relevant"
          ],
          goodExample: {
            title: "Good Insight Prompt",
            prompt: "Create a bar chart showing the number of test drive requests for Jeep vehicles over the last 12 months. Each bar should represent one month on the X-axis, with the count of test drive requests on the Y-axis. Break down by model (Wrangler, Grand Cherokee, Compass) using stacked bars. Order chronologically from oldest to newest.",
            explanation: "Specific chart type, clear metric (test drive requests), defined timeframe (12 months), explicit axis definitions, breakdown by model, chronological ordering specified."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Show me test drive data for Jeep in a chart.",
            explanation: "No specific chart type, no timeframe, no model breakdown, no axis or ordering specifications."
          }
        },
        quickReference: {
          title: "Quick Reference: Prompt Structure Template",
          template: [
            "State your objective clearly (create segment / analyze segment)",
            "Define core criteria with explicit operators (AND/OR/CONTAINS/EQUALS)",
            "Use numbered lists for multiple conditions",
            "Specify quantitative thresholds precisely",
            "Include timeframes where relevant",
            "For insights: list specific metrics needed"
          ]
        },
        quiz: {
          title: "Test Your Prompt Skills",
          subtitle: "Enter a prompt below and get instant feedback on its quality",
          placeholder: "Example: Create a segment of customers who requested a Jeep test drive in the last 30 days...",
          buttonText: "Analyze Prompt",
          analyzing: "Analyzing...",
          scoreLabel: "Prompt Quality Score",
          strengthsLabel: "Strengths",
          improvementsLabel: "Areas for Improvement",
          noStrengths: "No specific strengths detected. Try including clear objectives, timeframes, and specific criteria.",
          noImprovements: "Great prompt! No major improvements needed.",
          tryAnother: "Try another prompt to practice!"
        }
      },
      footer: "For any support contact Tushar - Forward Deployed Engineering"
    },
    fr: {
      title: "Guide de Prompts pour l'Agent d'Audience",
      subtitle: "Meilleures Pratiques pour la Création et l'Analyse de Segments",
      company: "",
      toggle: "English",
      toc: {
        title: "Table des Matières",
        items: [
          { id: 'intro', label: 'Introduction' },
          { id: 'section1', label: '1. Commencer Simple' },
          { id: 'section2', label: '2. Ajouter des Règles' },
          { id: 'section3', label: '3. Règles Complexes' },
          { id: 'section4', label: '4. Correspondance de Texte' },
          { id: 'section5', label: '5. Insights' },
          { id: 'quickref', label: 'Référence Rapide' },
          { id: 'quiz', label: 'Testez vos Compétences' }
        ]
      },
      sections: {
        intro: {
          title: "Introduction",
          text: "L'Agent d'Audience est un outil puissant pour analyser les segments de données utilisateurs et créer de nouveaux segments ciblés. Ce guide vous aidera à créer des prompts efficaces pour maximiser ses capacités."
        },
        startSmall: {
          title: "1. Commencez avec des Règles de Segment Simples",
          description: "Commencez par des segments basiques à condition unique avant d'ajouter de la complexité.",
          why: "Pourquoi c'est important :",
          reasons: [
            "Plus facile de valider les résultats et comprendre le comportement du segment",
            "Traitement plus rapide et insights plus clairs",
            "Fournit une base solide pour l'amélioration itérative"
          ],
          goodExample: {
            title: "Exemple de Bon Prompt",
            prompt: "Créez un segment de clients qui possèdent actuellement un véhicule Jeep et ont indiqué un intérêt pour les véhicules électriques, basé sur leurs données de profil.",
            explanation: "Critères clairs ciblant des attributs spécifiques de propriété de véhicule et d'intérêt. Condition logique simple avec deux champs de profil liés."
          },
          badExample: {
            title: "Évitez Cette Approche",
            prompt: "Montrez-moi tous ceux qui pourraient être intéressés par les voitures ou semblent vouloir un nouveau véhicule.",
            explanation: "Trop vague, conditions multiples peu claires, utilise un langage incertain comme 'pourraient être' et 'semblent'."
          }
        },
        addRules: {
          title: "2. Ajoutez des Règles Progressivement",
          description: "Une fois votre segment de base fonctionnel, ajoutez des conditions supplémentaires stratégiquement.",
          approach: "Approche Recommandée :",
          steps: [
            "Commencez avec vos critères fondamentaux",
            "Testez et vérifiez le segment initial",
            "Ajoutez une règle supplémentaire à la fois",
            "Validez après chaque ajout pour suivre l'impact"
          ],
          goodExample: {
            title: "Bon Prompt Progressif",
            prompt: "Créez un segment de prospects à forte intention pour les camions Ram où les utilisateurs remplissent TOUS ces critères : (1) ont visité le configurateur de camions Ram dans les 30 derniers jours, ET (2) ont ouvert ou cliqué sur des emails de promotions camions dans les 30 derniers jours, ET (3) ont demandé un essai routier ou un devis concessionnaire.",
            explanation: "Progression claire, conditions numérotées, relation ET explicite, délais spécifiques, définit 'forte intention' avec des critères mesurables."
          },
          badExample: {
            title: "Évitez Cette Approche",
            prompt: "Trouvez les utilisateurs intéressés par les camions et actifs récemment.",
            explanation: "Pas de critères spécifiques pour 'intéressés' ou 'actifs', pas de délais, qualificatifs vagues."
          }
        },
        complexRules: {
          title: "3. Gestion des Conditions Multiples (Logique ET/OU)",
          description: "Lorsque votre segment nécessite une logique complexe, structurez votre prompt clairement.",
          bestPractices: "Meilleures Pratiques :",
          tips: [
            "Déclarez explicitement les relations ET/OU",
            "Utilisez des listes numérotées pour les conditions multiples",
            "Groupez les conditions liées avec des parenthèses",
            "Soyez précis sur la priorité lors du mélange ET/OU"
          ],
          goodExample: {
            title: "Bon Prompt Complexe",
            prompt: "Créez un segment d'audience de clients intéressés par les véhicules électriques où les utilisateurs remplissent N'IMPORTE LEQUEL de ces critères :\n1. Ont indiqué posséder un hybride ou VE dans leur profil, OU\n2. Ont visité les pages Jeep 4xe ou Fiat 500e sur le site web, OU\n3. Ont sélectionné 'durabilité' ou 'VE' dans leurs réponses au sondage 'Préférences Véhicule'.\nET tous les utilisateurs doivent être à moins de 80 km d'un concessionnaire Stellantis.",
            explanation: "Structure claire avec conditions OU explicites groupées, condition ET finale clairement séparée, référence des sources de données spécifiques (profil, visites web, sondage)."
          },
          badExample: {
            title: "Évitez Cette Approche",
            prompt: "Trouvez les personnes qui aiment les voitures électriques ou pourraient être intéressées par les véhicules écologiques.",
            explanation: "Logique ambiguë, sources de données peu claires, utilise un langage incertain comme 'pourraient être', pas de critères clairs pour 'intéressés'."
          }
        },
        stringMatching: {
          title: "4. Utilisation de la Correspondance de Texte pour les Filtres",
          description: "Lors du filtrage par champs de texte comme les sources de leads, données de profil enrichies ou interactions de marque, soyez clair sur ce que vous recherchez.",
          guidelines: "Directives :",
          rules: [
            "Spécifiez les noms exacts des champs ou sources de données lorsque vous les connaissez",
            "Pour les données de leads, mentionnez la marque ou source de campagne spécifique",
            "Pour les champs enrichis, référencez l'attribut exact (intention d'achat, préférence véhicule, etc.)",
            "Lors du filtrage par interactions de marque, spécifiez le canal (email, web, concessionnaire, campagnes)"
          ],
          goodExample: {
            title: "Bon Prompt de Correspondance de Texte",
            prompt: "Créez un segment de leads de la campagne 'Lancement Dodge Hornet' qui ont un numéro de téléphone enregistré ET ont une intention d'achat 'élevée' ou 'très élevée' dans leurs données de profil enrichies ET possèdent un véhicule de plus de 5 ans.",
            explanation: "Source de campagne claire spécifiée, référence des champs enrichis spécifiques (numéro de téléphone, intention d'achat, âge du véhicule), valeurs explicites pour le filtrage."
          },
          badExample: {
            title: "Évitez Cette Approche",
            prompt: "Trouvez les leads qui ont des informations de contact et semblent prêts à acheter une voiture.",
            explanation: "'Informations de contact' vague, terme subjectif 'semblent prêts à acheter', pas de référence aux champs de données réels ou attributs d'enrichissement."
          }
        },
        insights: {
          title: "5. Demander des Insights et Visualisations de Segments",
          description: "Lors de l'analyse de données ou de demandes de visualisations, spécifiez le type exact de graphique, les métriques et la période.",
          tips: "Demandes d'Insights Efficaces :",
          points: [
            "Spécifiez le type de visualisation (graphique à barres, camembert, tableau, etc.)",
            "Définissez les métriques ou points de données exacts pour chaque axe",
            "Établissez des délais clairs pour l'analyse",
            "Demandez des comparaisons ou ventilations lorsque pertinent"
          ],
          goodExample: {
            title: "Bon Prompt d'Insight",
            prompt: "Créez un graphique à barres montrant le nombre de demandes d'essai routier pour les véhicules Jeep sur les 12 derniers mois. Chaque barre doit représenter un mois sur l'axe X, avec le nombre de demandes d'essai routier sur l'axe Y. Ventiler par modèle (Wrangler, Grand Cherokee, Compass) en utilisant des barres empilées. Ordonner chronologiquement du plus ancien au plus récent.",
            explanation: "Type de graphique spécifique, métrique claire (demandes d'essai routier), délai défini (12 mois), définitions d'axes explicites, ventilation par modèle, ordre chronologique spécifié."
          },
          badExample: {
            title: "Évitez Cette Approche",
            prompt: "Montrez-moi les données d'essais routiers Jeep dans un graphique.",
            explanation: "Pas de type de graphique spécifique, pas de délai, pas de ventilation par modèle, pas de spécifications d'axes ou d'ordre."
          }
        },
        quickReference: {
          title: "Référence Rapide : Modèle de Structure de Prompt",
          template: [
            "Énoncez clairement votre objectif (créer segment / analyser segment)",
            "Définissez les critères principaux avec des opérateurs explicites (ET/OU/CONTIENT/ÉGAL)",
            "Utilisez des listes numérotées pour les conditions multiples",
            "Spécifiez les seuils quantitatifs avec précision",
            "Incluez des délais lorsque pertinent",
            "Pour les insights : listez les métriques spécifiques nécessaires"
          ]
        },
        quiz: {
          title: "Testez Vos Compétences en Prompts",
          subtitle: "Entrez un prompt et recevez un retour instantané sur sa qualité",
          placeholder: "Exemple : Créez un segment de clients qui ont demandé un essai routier Jeep dans les 30 derniers jours...",
          buttonText: "Analyser le Prompt",
          analyzing: "Analyse en cours...",
          scoreLabel: "Score de Qualité du Prompt",
          strengthsLabel: "Points Forts",
          improvementsLabel: "Axes d'Amélioration",
          noStrengths: "Aucun point fort spécifique détecté. Essayez d'inclure des objectifs clairs, des délais et des critères spécifiques.",
          noImprovements: "Excellent prompt ! Aucune amélioration majeure nécessaire.",
          tryAnother: "Essayez un autre prompt pour vous entraîner !"
        }
      },
      footer: "Pour tout support, contactez Tushar - Forward Deployed Engineering"
    },
    it: {
      title: "Guida ai Prompt per l'Agente Audience",
      subtitle: "Migliori Pratiche per la Creazione e l'Analisi di Segmenti",
      company: "",
      toggle: "English",
      toc: {
        title: "Indice",
        items: [
          { id: 'intro', label: 'Introduzione' },
          { id: 'section1', label: '1. Inizia Semplice' },
          { id: 'section2', label: '2. Aggiungi Regole' },
          { id: 'section3', label: '3. Regole Complesse' },
          { id: 'section4', label: '4. Corrispondenza Testo' },
          { id: 'section5', label: '5. Insights' },
          { id: 'quickref', label: 'Riferimento Rapido' },
          { id: 'quiz', label: 'Testa le tue Competenze' }
        ]
      },
      sections: {
        intro: {
          title: "Introduzione",
          text: "L'Agente Audience è uno strumento potente per analizzare i segmenti di dati utente e creare nuovi segmenti mirati. Questa guida ti aiuterà a creare prompt efficaci per massimizzare le sue capacità."
        },
        startSmall: {
          title: "1. Inizia con Regole di Segmento Semplici",
          description: "Inizia con segmenti base a condizione singola prima di aggiungere complessità.",
          why: "Perché è importante:",
          reasons: [
            "Più facile validare i risultati e comprendere il comportamento del segmento",
            "Elaborazione più veloce e insights più chiari",
            "Fornisce una base solida per il miglioramento iterativo"
          ],
          goodExample: {
            title: "Esempio di Buon Prompt",
            prompt: "Crea un segmento di clienti che attualmente possiedono un veicolo Jeep e hanno indicato interesse per i veicoli elettrici, basandosi sui loro dati di profilo.",
            explanation: "Criteri chiari mirati ad attributi specifici di proprietà veicolo e interesse. Condizione logica semplice con due campi di profilo correlati."
          },
          badExample: {
            title: "Evita Questo Approccio",
            prompt: "Mostrami tutti quelli che potrebbero essere interessati alle auto o sembrano volere un nuovo veicolo.",
            explanation: "Troppo vago, condizioni multiple poco chiare, usa linguaggio incerto come 'potrebbero essere' e 'sembrano'."
          }
        },
        addRules: {
          title: "2. Aggiungi Regole Progressivamente",
          description: "Una volta che il tuo segmento base funziona, aggiungi condizioni aggiuntive strategicamente.",
          approach: "Approccio Consigliato:",
          steps: [
            "Inizia con i tuoi criteri fondamentali",
            "Testa e verifica il segmento iniziale",
            "Aggiungi una regola aggiuntiva alla volta",
            "Valida dopo ogni aggiunta per monitorare l'impatto"
          ],
          goodExample: {
            title: "Buon Prompt Progressivo",
            prompt: "Crea un segmento di prospect ad alta intenzione per i camion Ram dove gli utenti soddisfano TUTTI questi criteri: (1) hanno visitato la pagina del configuratore camion Ram negli ultimi 30 giorni, E (2) hanno aperto o cliccato email sulle promozioni camion negli ultimi 30 giorni, E (3) hanno richiesto un test drive o preventivo concessionaria.",
            explanation: "Progressione chiara, condizioni numerate, relazione E esplicita, tempistiche specifiche, definisce 'alta intenzione' con criteri misurabili."
          },
          badExample: {
            title: "Evita Questo Approccio",
            prompt: "Trova gli utenti interessati ai camion e attivi di recente.",
            explanation: "Nessun criterio specifico per 'interessati' o 'attivi', nessuna tempistica, qualificatori vaghi."
          }
        },
        complexRules: {
          title: "3. Gestione di Condizioni Multiple (Logica E/O)",
          description: "Quando il tuo segmento richiede logica complessa, struttura il tuo prompt chiaramente.",
          bestPractices: "Migliori Pratiche:",
          tips: [
            "Dichiara esplicitamente le relazioni E/O",
            "Usa liste numerate per condizioni multiple",
            "Raggruppa le condizioni correlate con parentesi",
            "Sii preciso sulla precedenza quando mescoli E/O"
          ],
          goodExample: {
            title: "Buon Prompt Complesso",
            prompt: "Crea un segmento audience di clienti interessati ai veicoli elettrici dove gli utenti soddisfano QUALSIASI di questi criteri:\n1. Hanno indicato di possedere un ibrido o VE nel loro profilo, O\n2. Hanno visitato le pagine Jeep 4xe o Fiat 500e sul sito web, O\n3. Hanno selezionato 'sostenibilità' o 'VE' nelle risposte al sondaggio 'Preferenze Veicolo'.\nE tutti gli utenti devono essere entro 80 km da una concessionaria Stellantis.",
            explanation: "Struttura chiara con condizioni O esplicite raggruppate, condizione E finale chiaramente separata, riferimento a fonti dati specifiche (profilo, visite web, sondaggio)."
          },
          badExample: {
            title: "Evita Questo Approccio",
            prompt: "Trova le persone a cui piacciono le auto elettriche o potrebbero essere interessate ai veicoli ecologici.",
            explanation: "Logica ambigua, fonti dati poco chiare, usa linguaggio incerto come 'potrebbero essere', nessun criterio chiaro per 'interessati'."
          }
        },
        stringMatching: {
          title: "4. Utilizzo della Corrispondenza Testo per i Filtri",
          description: "Quando filtri per campi di testo come fonti lead, dati di profilo arricchiti o interazioni con il brand, sii chiaro su cosa stai cercando.",
          guidelines: "Linee Guida:",
          rules: [
            "Specifica i nomi esatti dei campi o fonti dati quando li conosci",
            "Per i dati lead, menziona il brand o la fonte campagna specifica",
            "Per i campi arricchiti, fai riferimento all'attributo esatto (intenzione d'acquisto, preferenza veicolo, ecc.)",
            "Quando filtri per interazioni brand, specifica il canale (email, web, concessionaria, campagne)"
          ],
          goodExample: {
            title: "Buon Prompt di Corrispondenza Testo",
            prompt: "Crea un segmento di lead dalla campagna 'Lancio Dodge Hornet' che hanno un numero di telefono registrato E hanno un'intenzione d'acquisto 'alta' o 'molto alta' nei loro dati di profilo arricchiti E possiedono un veicolo con più di 5 anni.",
            explanation: "Fonte campagna chiara specificata, riferimento a campi arricchiti specifici (numero di telefono, intenzione d'acquisto, età veicolo), valori espliciti per il filtraggio."
          },
          badExample: {
            title: "Evita Questo Approccio",
            prompt: "Trova i lead che hanno informazioni di contatto e sembrano pronti a comprare un'auto.",
            explanation: "'Informazioni di contatto' vago, termine soggettivo 'sembrano pronti a comprare', nessun riferimento a campi dati reali o attributi di arricchimento."
          }
        },
        insights: {
          title: "5. Richiedere Insights e Visualizzazioni dei Segmenti",
          description: "Quando analizzi dati o richiedi visualizzazioni, specifica il tipo esatto di grafico, le metriche e il periodo di tempo.",
          tips: "Richieste di Insights Efficaci:",
          points: [
            "Specifica il tipo di visualizzazione (grafico a barre, torta, tabella, ecc.)",
            "Definisci le metriche esatte o i punti dati per ogni asse",
            "Stabilisci tempistiche chiare per l'analisi",
            "Richiedi confronti o scomposizioni quando rilevante"
          ],
          goodExample: {
            title: "Buon Prompt di Insight",
            prompt: "Crea un grafico a barre che mostra il numero di richieste test drive per veicoli Jeep negli ultimi 12 mesi. Ogni barra deve rappresentare un mese sull'asse X, con il conteggio delle richieste test drive sull'asse Y. Scomporre per modello (Wrangler, Grand Cherokee, Compass) usando barre impilate. Ordinare cronologicamente dal più vecchio al più recente.",
            explanation: "Tipo di grafico specifico, metrica chiara (richieste test drive), tempistica definita (12 mesi), definizioni assi esplicite, scomposizione per modello, ordine cronologico specificato."
          },
          badExample: {
            title: "Evita Questo Approccio",
            prompt: "Mostrami i dati dei test drive Jeep in un grafico.",
            explanation: "Nessun tipo di grafico specifico, nessuna tempistica, nessuna scomposizione per modello, nessuna specifica di assi o ordine."
          }
        },
        quickReference: {
          title: "Riferimento Rapido: Modello di Struttura Prompt",
          template: [
            "Enuncia chiaramente il tuo obiettivo (crea segmento / analizza segmento)",
            "Definisci i criteri principali con operatori espliciti (E/O/CONTIENE/UGUALE)",
            "Usa liste numerate per condizioni multiple",
            "Specifica le soglie quantitative con precisione",
            "Includi tempistiche dove rilevante",
            "Per gli insights: elenca le metriche specifiche necessarie"
          ]
        },
        quiz: {
          title: "Testa le Tue Competenze sui Prompt",
          subtitle: "Inserisci un prompt e ricevi feedback istantaneo sulla sua qualità",
          placeholder: "Esempio: Crea un segmento di clienti che hanno richiesto un test drive Jeep negli ultimi 30 giorni...",
          buttonText: "Analizza Prompt",
          analyzing: "Analisi in corso...",
          scoreLabel: "Punteggio Qualità Prompt",
          strengthsLabel: "Punti di Forza",
          improvementsLabel: "Aree di Miglioramento",
          noStrengths: "Nessun punto di forza specifico rilevato. Prova a includere obiettivi chiari, tempistiche e criteri specifici.",
          noImprovements: "Ottimo prompt! Nessun miglioramento importante necessario.",
          tryAnother: "Prova un altro prompt per esercitarti!"
        }
      },
      footer: "Per qualsiasi supporto contatta Tushar - Forward Deployed Engineering"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/td-logo.png"
              alt="Treasure Data"
              className="h-12"
            />
            <div className="h-8 w-px bg-slate-300"></div>
            <h1 className="text-xl font-semibold text-slate-900">
              {t.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-slate-600" />
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === 'fr'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('it')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === 'it'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  IT
                </button>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300"></div>
            <img
              src="/stellantis_logo.png"
              alt="Stellantis"
              className="h-20"
            />
          </div>
        </div>
      </div>

      {/* Subtitle Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold">
            {t.subtitle}
          </h2>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Table of Contents Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
              {t.toc.title}
            </h3>
            <nav className="space-y-2">
              {t.toc.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === item.id
                      ? 'bg-emerald-600 text-white font-medium shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">

        {/* Introduction */}
        <section id="intro" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={28} />
            <h2 className="text-2xl font-semibold text-slate-900">
              {t.sections.intro.title}
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {t.sections.intro.text}
          </p>
        </section>

        {/* Section 1: Start Small */}
        <section id="section1" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.startSmall.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.startSmall.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-600" />
              {t.sections.startSmall.why}
            </h3>
            <ul className="space-y-2 ml-7">
              {t.sections.startSmall.reasons.map((reason, idx) => (
                <li key={idx} className="text-slate-700">{reason}</li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.startSmall.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200 relative group">
                <p className="text-sm text-slate-800 font-mono pr-8">
                  "{t.sections.startSmall.goodExample.prompt}"
                </p>
                <button
                  onClick={() => copyPrompt('start-good', t.sections.startSmall.goodExample.prompt)}
                  className="absolute top-2 right-2 p-1.5 rounded hover:bg-green-100 transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy prompt"
                >
                  {copiedPrompts['start-good'] ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.startSmall.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.startSmall.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.startSmall.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.startSmall.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Add Rules */}
        <section id="section2" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.addRules.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.addRules.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.addRules.approach}
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              {t.sections.addRules.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.addRules.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.addRules.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.addRules.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.addRules.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.addRules.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.addRules.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Complex Rules */}
        <section id="section3" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.complexRules.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.complexRules.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.complexRules.bestPractices}
            </h3>
            <ul className="space-y-2 bg-slate-50 rounded-lg p-4">
              {t.sections.complexRules.tips.map((tip, idx) => (
                <li key={idx} className="text-slate-700 flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.complexRules.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.complexRules.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.complexRules.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.complexRules.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.complexRules.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.complexRules.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: String Matching */}
        <section id="section4" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.stringMatching.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.stringMatching.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.stringMatching.guidelines}
            </h3>
            <ul className="space-y-2 bg-slate-50 rounded-lg p-4">
              {t.sections.stringMatching.rules.map((rule, idx) => (
                <li key={idx} className="text-slate-700 flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.stringMatching.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.stringMatching.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.stringMatching.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.stringMatching.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.stringMatching.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.stringMatching.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Insights */}
        <section id="section5" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.insights.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.insights.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.insights.tips}
            </h3>
            <ul className="space-y-2 bg-slate-50 rounded-lg p-4">
              {t.sections.insights.points.map((point, idx) => (
                <li key={idx} className="text-slate-700 flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.insights.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.insights.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.insights.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.insights.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.insights.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.insights.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section id="quickref" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">
            {t.sections.quickReference.title}
          </h2>
          <div className="space-y-3">
            {t.sections.quickReference.template.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start animate-slideIn" style={{animationDelay: `${idx * 0.1}s`}}>
                <span className="flex-shrink-0 w-7 h-7 bg-white text-slate-900 rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform">
                  {idx + 1}
                </span>
                <p className="text-slate-100 pt-1">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Quiz Section */}
        <section id="quiz" className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white hover-lift animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={28} className="animate-bounce-subtle" />
            <h2 className="text-2xl font-semibold">
              {t.sections.quiz.title}
            </h2>
          </div>
          <p className="text-emerald-100 mb-6">
            {t.sections.quiz.subtitle}
          </p>

          <div className="bg-white rounded-lg p-6 shadow-xl">
            <textarea
              value={quizPrompt}
              onChange={(e) => setQuizPrompt(e.target.value)}
              placeholder={t.sections.quiz.placeholder}
              className="w-full h-32 p-4 border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none transition-all"
            />

            <button
              onClick={() => analyzePrompt(quizPrompt)}
              disabled={!quizPrompt.trim() || isAnalyzing}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t.sections.quiz.analyzing}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t.sections.quiz.buttonText}
                </>
              )}
            </button>

            {quizResult && (
              <div className="mt-6 space-y-4 animate-fadeIn">
                {/* Score Display */}
                <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-700 font-medium">{t.sections.quiz.scoreLabel}</span>
                    <span className={`text-3xl font-bold ${
                      quizResult.color === 'green' ? 'text-green-600' : 
                      quizResult.color === 'blue' ? 'text-blue-600' : 
                      quizResult.color === 'yellow' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {quizResult.score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        quizResult.color === 'green' ? 'bg-green-600' : 
                        quizResult.color === 'blue' ? 'bg-blue-600' : 
                        quizResult.color === 'yellow' ? 'bg-yellow-600' : 
                        'bg-red-600'
                      }`}
                      style={{ width: `${quizResult.score}%` }}
                    ></div>
                  </div>
                  <p className={`text-center font-semibold ${
                    quizResult.color === 'green' ? 'text-green-700' : 
                    quizResult.color === 'blue' ? 'text-blue-700' : 
                    quizResult.color === 'yellow' ? 'text-yellow-700' : 
                    'text-red-700'
                  }`}>
                    {quizResult.rating}
                  </p>
                </div>

                {/* Strengths */}
                {quizResult.positives.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle size={20} />
                      {t.sections.quiz.strengthsLabel}
                    </h4>
                    <ul className="space-y-2">
                      {quizResult.positives.map((positive, idx) => (
                        <li key={idx} className="text-green-800 flex gap-2">
                          <span>✓</span>
                          <span>{positive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResult.positives.length === 0 && (
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-5">
                    <p className="text-slate-700">{t.sections.quiz.noStrengths}</p>
                  </div>
                )}

                {/* Improvements */}
                {quizResult.feedback.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={20} />
                      {t.sections.quiz.improvementsLabel}
                    </h4>
                    <ul className="space-y-2">
                      {quizResult.feedback.map((item, idx) => (
                        <li key={idx} className="text-amber-800 flex gap-2">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResult.feedback.length === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
                    <p className="text-green-800 font-medium">{t.sections.quiz.noImprovements}</p>
                  </div>
                )}

                <p className="text-center text-slate-600 text-sm pt-2">
                  {t.sections.quiz.tryAnother}
                </p>
              </div>
            )}
          </div>
        </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-3">
            <p className="text-center text-slate-600 text-sm">
              For any support contact{' '}
              <a
                href="mailto:tushar.badhwar@treasure-data.com"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline"
              >
                Tushar
              </a>
              {' '}- Forward Deployed Engineering
            </p>
            <img
              src="/td-logo.png"
              alt="Treasure Data"
              className="h-8"
            />
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 animate-fadeIn z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default AudienceAgentHandbook;