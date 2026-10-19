import api from './api';
import { AiAnalysisResult, ApiResponse, IncidentCategory, IncidentPriority } from '../types';

export interface AiDraftResult {
  title: string;
  category: IncidentCategory;
  description: string;
  landmark: string;
  photoUrl?: string;
  analysis: AiAnalysisResult;
}

export interface QuickPrompt {
  id: string;
  label: string;
  emoji: string;
  category: IncidentCategory;
  prompt: string;
  title: string;
  description: string;
  landmark: string;
  photoUrl: string;
}

export const QUICK_CIVIC_PROMPTS: QuickPrompt[] = [
  {
    id: 'pothole',
    label: 'Road Crater / Pothole',
    emoji: '🕳️',
    category: 'ROADS_POTHOLES',
    prompt: 'Dangerous pothole crater causing two-wheelers to skid',
    title: 'Severe road crater on main transit corridor causing two-wheeler skids',
    description: 'Deep asphalt crater approximately 3 feet wide and 7 inches deep located directly in the center traffic lane. Two-wheelers are experiencing severe skidding and sudden swerves, posing an acute risk of vehicular accidents, especially during night hours and rain.',
    landmark: 'Near Metro Pillar 142 / Bus Shelter',
    photoUrl: '/incidents/pothole_real.jpg',
  },
  {
    id: 'garbage',
    label: 'Overflowing Garbage Dump',
    emoji: '🗑️',
    category: 'GARBAGE_SANITATION',
    prompt: 'Overflowing municipal garbage bin blocking pedestrian walkway',
    title: 'Municipal waste overflow rotting on public walkway and choking road',
    description: 'Uncollected community waste dump overflowing beyond container boundaries across 20 meters of pedestrian sidewalk. Organic decomposition has created intense foul odor, attracts stray cattle and rodents, and poses high dengue and infectious sanitation risks for nearby residents.',
    landmark: 'Opposite Vegetable Market Gate 2',
    photoUrl: '/incidents/garbage_real.jpg',
  },
  {
    id: 'waterlog',
    label: 'Monsoon Waterlogging',
    emoji: '🌊',
    category: 'DRAINAGE_WATERLOGGING',
    prompt: 'Blocked storm drain causing knee-deep waterlogging on main road',
    title: 'Stormwater drain choked causing knee-deep waterlogging on arterial road',
    description: 'Underground stormwater drain outlet choked with single-use plastics and construction silt, leading to 1.5 feet of stagnant sewage-mixed rainwater covering the carriageway. Multiple two-wheelers and auto-rickshaws stalled, completely paralyzing local commute.',
    landmark: 'Underpass Junction near Railway Bridge',
    photoUrl: '/incidents/waterlog_real.jpg',
  },
  {
    id: 'livewire',
    label: 'Live Wire / Broken Lamp',
    emoji: '⚡',
    category: 'STREETLIGHTS',
    prompt: 'Exposed live electric cable dangling from damaged streetlight pole',
    title: 'Damaged streetlight pole with dangling live electrical wire near school',
    description: 'Municipal streetlight fixture damaged during storm, leaving naked live wires dangling at 4.5 feet height right over the sidewalk. Poses critical electrocution hazard for school students, pedestrians, and domestic animals. Emergency power cutoff and pole replacement required immediately.',
    landmark: 'Near Govt High School Crossing',
    photoUrl: '/incidents/streetlight_real.jpg',
  },
  {
    id: 'waterpipe',
    label: 'Drinking Water Pipeline Burst',
    emoji: '🚰',
    category: 'WATER_SUPPLY_LEAKAGE',
    prompt: 'High pressure drinking water pipe burst flooding road',
    title: 'Major underground treated drinking water pipeline ruptured and gushing',
    description: 'Main potable water distribution line ruptured beneath asphalt, shooting high-pressure clean water onto roadway. Washing away road foundation subgrade and causing thousands of liters of treated drinking water wastage while reducing residential water pressure.',
    landmark: 'Outside Water Supply Distribution Pump Station',
    photoUrl: '/incidents/waterpipe_real.jpg',
  },
  {
    id: 'footpath',
    label: 'Caved-in Footpath / Manhole',
    emoji: '🚶',
    category: 'FOOTPATHS_ACCESSIBILITY',
    prompt: 'Broken footpath slabs exposing deep open stormwater drain',
    title: 'Broken and missing concrete footpath slabs exposing open 5ft drain trench',
    description: 'Multiple pedestrian walkway concrete slabs collapsed, leaving a 5-foot-deep open trench along a heavy walking corridor. Senior citizens and children are at immediate risk of falling into the drain. Pedestrians are forced to walk in oncoming high-speed traffic.',
    landmark: 'Adjacent to City Hospital Main Gate',
    photoUrl: '/incidents/manhole_real.jpg',
  },
];

export const aiService = {
  getQuickPrompts: (): QuickPrompt[] => QUICK_CIVIC_PROMPTS,

  draftFromPrompt: async (prompt: string, userCategory?: IncidentCategory): Promise<AiDraftResult> => {
    const text = prompt.toLowerCase();

    // Check if matches one of the presets closely
    const matchedPreset = QUICK_CIVIC_PROMPTS.find(p => 
      text.includes(p.id) || 
      text.includes(p.category.toLowerCase()) || 
      (p.id === 'pothole' && (text.includes('pothole') || text.includes('crater') || text.includes('road'))) ||
      (p.id === 'garbage' && (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('smell'))) ||
      (p.id === 'waterlog' && (text.includes('waterlog') || text.includes('drain') || text.includes('flood') || text.includes('gutter'))) ||
      (p.id === 'livewire' && (text.includes('wire') || text.includes('light') || text.includes('electric') || text.includes('shock') || text.includes('dark'))) ||
      (p.id === 'waterpipe' && (text.includes('pipe') || text.includes('water leak') || text.includes('leakage') || text.includes('burst'))) ||
      (p.id === 'footpath' && (text.includes('footpath') || text.includes('manhole') || text.includes('pavement') || text.includes('sidewalk')))
    );

    let category: IncidentCategory = userCategory || matchedPreset?.category || 'ROADS_POTHOLES';
    let title = matchedPreset ? matchedPreset.title : `Civic Hazard: ${prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1)}`;
    let description = matchedPreset ? matchedPreset.description : `Reported issue: ${prompt.trim()}. Poses significant public safety inconvenience and requires prompt municipal inspection and field crew dispatch.`;
    let landmark = matchedPreset?.landmark || 'Near main public corridor';
    let photoUrl = matchedPreset?.photoUrl || '/incidents/pothole_real.jpg';

    // Tailor if specific custom text
    if (!matchedPreset && prompt.trim().length > 0) {
      if (text.includes('manhole') || text.includes('open chamber')) {
        category = 'FOOTPATHS_ACCESSIBILITY';
        title = `Uncovered open manhole hazard: ${prompt.trim()}`;
        description = `Open manhole chamber without safety cover observed at location. Extreme risk of pedestrians or two-wheelers falling into the pit. Requires urgent barricading and cover installation.`;
        landmark = 'Near main street crossing';
        photoUrl = '/incidents/manhole_real.jpg';
      } else if (text.includes('light') || text.includes('dark') || text.includes('lamp')) {
        category = 'STREETLIGHTS';
        title = `Streetlight failure causing dark unsafe corridor: ${prompt.trim()}`;
        description = `Public streetlights completely non-operational, causing severe darkness along this stretch. Increases risk of accidents and impacts safety of pedestrians and women at night.`;
        landmark = 'Along main road stretch';
        photoUrl = '/incidents/streetlight_real.jpg';
      } else if (text.includes('garbage') || text.includes('waste') || text.includes('dump')) {
        category = 'GARBAGE_SANITATION';
        title = `Garbage accumulation and sanitary hazard: ${prompt.trim()}`;
        description = `Uncollected waste dumped in public open space, emitting foul stench and attracting stray animals and disease vectors. Immediate cleanup and sanitation required.`;
        landmark = 'Near residential/commercial block';
        photoUrl = '/incidents/garbage_real.jpg';
      } else if (text.includes('water') && (text.includes('leak') || text.includes('pipe') || text.includes('burst'))) {
        category = 'WATER_SUPPLY_LEAKAGE';
        title = `Drinking water pipeline leak: ${prompt.trim()}`;
        description = `Water distribution line actively leaking clean drinking water. Flooding nearby area and wasting vital public water reserves. Urgent pipe valve repair needed.`;
        landmark = 'Near water utility pipeline junction';
        photoUrl = '/incidents/waterpipe_real.jpg';
      } else if (text.includes('drain') || text.includes('waterlog') || text.includes('flood')) {
        category = 'DRAINAGE_WATERLOGGING';
        title = `Drainage overflow and waterlogging: ${prompt.trim()}`;
        description = `Storm drain blocked with debris leading to stagnant waterlogging on roadway. Disrupts pedestrian movement and creates mosquito breeding ground.`;
        landmark = 'Near storm drain channel';
        photoUrl = '/incidents/waterlog_real.jpg';
      }
    }

    const analysis = await aiService.analyze(title, description, category, photoUrl);

    return {
      title,
      category,
      description,
      landmark,
      photoUrl,
      analysis,
    };
  },

  expandDescription: (title: string, category: IncidentCategory): string => {
    const t = title.toLowerCase();
    if (category === 'ROADS_POTHOLES' || t.includes('pothole') || t.includes('road')) {
      return `Deep crater and asphalt damage observed at the site. The defect is directly in the path of vehicular traffic, forcing sudden deceleration and hazardous swerves. Poses severe skid risks for two-wheelers and potential suspension damage to vehicles. Needs urgent hot-mix bituminous filling.`;
    }
    if (category === 'GARBAGE_SANITATION' || t.includes('garbage') || t.includes('waste')) {
      return `Solid municipal waste accumulated on the public corridor, overflowing onto pedestrian pathways. Strong unpleasant odor and fly infestation present. Poses public hygiene risk and requires rapid municipal loader and sanitation crew deployment.`;
    }
    if (category === 'STREETLIGHTS' || t.includes('light') || t.includes('wire')) {
      return `Public lighting fixture is non-functional, leaving this stretch in pitch darkness after dusk. Commuters and pedestrians face severe safety hazards, with heightened vulnerability for women and seniors walking after dark. Urgent electrical ballast or bulb replacement needed.`;
    }
    if (category === 'DRAINAGE_WATERLOGGING' || t.includes('drain') || t.includes('waterlog')) {
      return `Stagnant waterlogged pool formed due to choked stormwater drain culvert. Impedes smooth vehicular flow, damages road surface, and creates foul mosquito-breeding puddle. Silt removal and suction clearing required immediately.`;
    }
    if (category === 'WATER_SUPPLY_LEAKAGE' || t.includes('pipe') || t.includes('leak')) {
      return `Significant water pipeline rupture spraying clean drinking water across the road. Causes soil erosion around foundation and massive loss of potable water supply to nearby homes. Urgent utility valve shutoff and pipe sleeve replacement needed.`;
    }
    if (category === 'FOOTPATHS_ACCESSIBILITY' || t.includes('footpath') || t.includes('pavement')) {
      return `Walkway concrete slabs are cracked, missing, or uneven, exposing deep underground trenches. Pedestrians, particularly elderly citizens and persons with disabilities, are at serious risk of tripping or falling into drain cavities.`;
    }
    return `Infrastructure defect requiring municipal inspection. Poses public convenience and safety concerns for daily commuters and residents in the immediate vicinity.`;
  },

  analyze: async (
    title: string,
    description: string,
    userSelectedCategory?: IncidentCategory,
    photoUrl?: string
  ): Promise<AiAnalysisResult> => {
    // Attempt backend first if both fields are reasonably present
    if (title && description && title.trim().length > 3 && description.trim().length > 5) {
      try {
        const res = await api.post<ApiResponse<AiAnalysisResult>>('/ai/analyze', {
          title: title.trim(),
          description: description.trim(),
          userSelectedCategory,
          photoUrl,
        });
        if (res.data?.data) {
          return res.data.data;
        }
      } catch {
        // Fall back gracefully to deterministic NLP
      }
    }

    const text = `${title || ''} ${description || ''}`.toLowerCase();
    let suggestedPriority: IncidentPriority = 'MEDIUM';
    let reason = 'Standard municipal maintenance triage schedule based on civic impact.';
    const safetyConcerns: string[] = [];

    if (
      text.includes('critical') ||
      text.includes('fatal') ||
      text.includes('hazard') ||
      text.includes('open manhole') ||
      text.includes('live wire') ||
      text.includes('electrocution') ||
      text.includes('accident') ||
      text.includes('sparking') ||
      text.includes('falling')
    ) {
      suggestedPriority = 'CRITICAL';
      reason = 'Severe safety hazard detected with acute risk of bodily harm, electrocution, or fatal traffic accidents.';
      safetyConcerns.push('Immediate risk to human life or bodily safety');
      safetyConcerns.push('Urgent 4-hour emergency response protocol recommended');
    } else if (
      text.includes('deep') ||
      text.includes('crater') ||
      text.includes('waterlog') ||
      text.includes('flood') ||
      text.includes('pipe burst') ||
      text.includes('drain') ||
      text.includes('skid') ||
      text.includes('hospital') ||
      text.includes('school')
    ) {
      suggestedPriority = 'HIGH';
      reason = 'Major public infrastructure disruption requiring rapid field response within 24 hours.';
      safetyConcerns.push('Two-wheeler skidding risk & traffic snarls');
      safetyConcerns.push('Pedestrian hazard during low visibility / monsoon');
    } else {
      safetyConcerns.push('Pedestrian inconvenience and public hygiene impact');
    }

    // Category deduction
    let deducedCategory: IncidentCategory = userSelectedCategory || 'ROADS_POTHOLES';
    if (text.includes('pothole') || text.includes('crater') || text.includes('road')) {
      deducedCategory = 'ROADS_POTHOLES';
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('smell')) {
      deducedCategory = 'GARBAGE_SANITATION';
    } else if (text.includes('light') || text.includes('wire') || text.includes('dark') || text.includes('pole')) {
      deducedCategory = 'STREETLIGHTS';
    } else if (text.includes('drain') || text.includes('waterlog') || text.includes('flood')) {
      deducedCategory = 'DRAINAGE_WATERLOGGING';
    } else if (text.includes('pipe') || text.includes('pipeline') || text.includes('drinking water')) {
      deducedCategory = 'WATER_SUPPLY_LEAKAGE';
    } else if (text.includes('footpath') || text.includes('manhole') || text.includes('pavement') || text.includes('slab')) {
      deducedCategory = 'FOOTPATHS_ACCESSIBILITY';
    }

    return {
      suggestedCategory: deducedCategory,
      suggestedPriority,
      priorityReasoning: reason,
      executiveSummary: 'AI analysis evaluated civic defect urgency, risk factors, and pedestrian vulnerability.',
      confidenceScore: 0.95,
      isSimulated: true,
      humanReviewRecommended: suggestedPriority === 'CRITICAL',
      providerName: 'SnapFix Pan-India Civic AI Engine',
      safetyConcerns,
      missingInformationSuggestions: [
        'Mentioning the exact nearest landmark or metro pillar speeds up crew arrival.',
      ],
    };
  },
};

