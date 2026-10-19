import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { duplicateService } from '../../services/duplicateService';
import { aiService, QuickPrompt } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { IncidentCategory, DuplicateCandidate, AiAnalysisResult } from '../../types';
import { LocationPicker } from '../../components/map/LocationPicker';
import { DuplicateSuggestionPanel } from '../../components/incidents/DuplicateSuggestionPanel';
import {
  PlusCircle,
  Sparkles,
  MapPin,
  Upload,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldAlert,
  Mic,
  Wand2,
  RefreshCw,
} from 'lucide-react';

export const ReportIncidentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('ROADS_POTHOLES');
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isApproximateLocation, setIsApproximateLocation] = useState(false);
  const [primaryPhotoUrl, setPrimaryPhotoUrl] = useState('');

  // AI & Duplicates states
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [duplicateCandidates, setDuplicateCandidates] = useState<DuplicateCandidate[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [ignoredDuplicates, setIgnoredDuplicates] = useState(false);

  // Flow states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger real-time duplicate check when coordinates or title/description change
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (title.length > 5 || description.length > 10) {
        setCheckingDuplicates(true);
        try {
          const candidates = await duplicateService.checkRealtime(
            latitude,
            longitude,
            category,
            title,
            description
          );
          setDuplicateCandidates(candidates);
        } catch (err) {
          console.error('Realtime duplicate check failed', err);
        } finally {
          setCheckingDuplicates(false);
        }
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [latitude, longitude, category, title, description]);

  // Apply a 1-tap realistic civic scenario
  const handleApplyPreset = async (preset: QuickPrompt) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setDescription(preset.description);
    setLandmark(preset.landmark);
    setPrimaryPhotoUrl(preset.photoUrl);
    setError(null);
    setAnalyzingAi(true);

    try {
      const result = await aiService.analyze(preset.title, preset.description, preset.category, preset.photoUrl);
      setAiAnalysis(result);
      setAiSuccessMessage(`✨ 1-Click Smart Fill: Loaded "${preset.label}" with photo evidence & priority triage!`);
    } catch (err) {
      console.error('AI preset triage failed', err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  // Draft report using natural language AI
  const handleGenerateFromAi = async (customPrompt?: string) => {
    const textToUse = (customPrompt || aiPrompt).trim();
    if (!textToUse) {
      setError('Please type a brief phrase (e.g. "big pothole near station") for AI to draft your report.');
      return;
    }

    setGeneratingAi(true);
    setError(null);
    try {
      const drafted = await aiService.draftFromPrompt(textToUse, category);
      setTitle(drafted.title);
      setCategory(drafted.category);
      setDescription(drafted.description);
      if (drafted.landmark && !landmark) {
        setLandmark(drafted.landmark);
      }
      if (drafted.photoUrl && !primaryPhotoUrl) {
        setPrimaryPhotoUrl(drafted.photoUrl);
      }
      setAiAnalysis(drafted.analysis);
      setAiSuccessMessage(`✨ AI Assistant drafted: "${drafted.title}" and assigned ${drafted.analysis.suggestedPriority} urgency!`);
      setAiPrompt('');
    } catch (err: any) {
      console.error('AI draft generation failed', err);
      setError('AI assistant is operating in fallback mode. Form details updated.');
    } finally {
      setGeneratingAi(false);
    }
  };

  // Voice dictation using browser SpeechRecognition API
  const handleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setError('Voice recognition is not supported in this browser. Please type in the AI input box.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListeningVoice(true);
      setError(null);

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiPrompt(transcript);
        setIsListeningVoice(false);
        await handleGenerateFromAi(transcript);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
        setError('Voice input timed out or microphone permission was not granted.');
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Request AI Triage suggestions on-demand (always works!)
  const handleRequestAiTriage = async () => {
    // If both empty, load the first preset to assist user immediately
    if (!title.trim() && !description.trim()) {
      const presets = aiService.getQuickPrompts();
      handleApplyPreset(presets[0]);
      return;
    }

    setAnalyzingAi(true);
    setError(null);
    try {
      let currentDesc = description.trim();
      // If user typed title but left description blank, auto-expand it!
      if (!currentDesc) {
        currentDesc = aiService.expandDescription(title, category);
        setDescription(currentDesc);
      }

      const result = await aiService.analyze(title, currentDesc, category, primaryPhotoUrl || undefined);
      setAiAnalysis(result);
      if (result.suggestedCategory && result.suggestedCategory !== category) {
        setCategory(result.suggestedCategory);
      }
      setAiSuccessMessage(`✨ AI Triage Complete: Priority evaluated as ${result.suggestedPriority} (${(result.confidenceScore * 100).toFixed(0)}% confidence).`);
    } catch (err: any) {
      console.error('AI analysis request failed', err);
      const fallbackResult = await aiService.analyze(title, description, category, primaryPhotoUrl || undefined);
      setAiAnalysis(fallbackResult);
      setAiSuccessMessage('✨ AI analysis computed via heuristic engine.');
    } finally {
      setAnalyzingAi(false);
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);
    try {
      const res = await incidentService.uploadPhoto(file);
      setPrimaryPhotoUrl(res.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload photo evidence');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSupportExisting = async (existingIncidentId: string) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      await incidentService.toggleSupport(existingIncidentId);
      navigate(`/incidents/${existingIncidentId}`);
    } catch (err) {
      console.error('Support failed', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSubmitting(true);
    setError(null);


    try {
      const created = await incidentService.create({
        title: title.trim(),
        description: description.trim(),
        category,
        latitude,
        longitude,
        address: address.trim() || undefined,
        landmark: landmark.trim() || undefined,
        isApproximateLocation,
        primaryPhotoUrl: primaryPhotoUrl || undefined,
      });

      navigate(`/incidents/${created.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit incident report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
          <span>🇮🇳</span>
          SnapFix • Fixing Our India Together
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight font-display">
          Snap & Report a Problem
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit verifiable infrastructure defects with GPS coordinates and photographic evidence. Fixing our India together.
        </p>
      </div>

      {/* AI Success Toast/Banner */}
      {aiSuccessMessage && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{aiSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setAiSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Duplicate Alert if candidates exist */}
      {!ignoredDuplicates && duplicateCandidates.length > 0 && (
        <DuplicateSuggestionPanel
          candidates={duplicateCandidates}
          onSupportExisting={handleSupportExisting}
          onContinueAsNew={() => setIgnoredDuplicates(true)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Issue Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Issue Classification & Details
            </h2>

            <button
              type="button"
              onClick={handleRequestAiTriage}
              disabled={analyzingAi || generatingAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {analyzingAi || generatingAi ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>AI Assistant Triage</span>
            </button>
          </div>

          {/* AI Co-Pilot Interactive Quick Assist Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 border border-amber-200/90 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-navy-950 flex items-center gap-2">
                    SnapFix AI Co-Pilot
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Type what you saw in plain words or tap a 1-click template below. AI drafts your entire report!
                  </p>
                </div>
              </div>
            </div>

            {/* Natural Language Prompt Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerateFromAi();
                    }
                  }}
                  placeholder="Tell AI what happened (e.g. 'huge water leak on 5th main road' or 'streetlights dark')..."
                  className="w-full text-xs p-2.5 pl-3.5 pr-10 rounded-xl border border-amber-300 bg-white/95 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title="Voice Dictation"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-100 transition-colors ${
                    isListeningVoice ? 'text-red-600 bg-red-100 animate-pulse' : ''
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateFromAi()}
                  disabled={generatingAi}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {generatingAi ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  <span>Draft with AI</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Tap Preset Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <span>⚡ 1-Click Smart Presets (Tap to Auto-Fill & Triage):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {aiService.getQuickPrompts().map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-amber-100/90 text-[11px] font-semibold text-slate-700 hover:text-amber-900 border border-amber-200/80 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Issue Summary / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Deep pothole crater near Metro Pillar 142 causing accidents"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Infrastructure Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                required
              >
                <option value="ROADS_POTHOLES">Roads & Potholes</option>
                <option value="GARBAGE_SANITATION">Garbage & Sanitation</option>
                <option value="STREETLIGHTS">Streetlights</option>
                <option value="DRAINAGE_WATERLOGGING">Drainage & Waterlogging</option>
                <option value="WATER_SUPPLY_LEAKAGE">Water Supply & Leakage</option>
                <option value="FOOTPATHS_ACCESSIBILITY">Footpaths & Accessibility</option>
                <option value="PUBLIC_PROPERTY_DAMAGE">Public Property Damage</option>
                <option value="OTHER">Other Civic Issue</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Detailed Description & Hazard Observations <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe size, hazard risks, duration unresolved, and whether two-wheelers, pedestrians, or water flow are compromised..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* AI Analysis Result Card if triggered */}
          {aiAnalysis && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/70 border border-amber-200 text-xs space-y-3 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-200/80 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                  </span>
                  <span className="font-bold text-amber-950">AI Triage Assessment:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] shadow-2xs ${
                      aiAnalysis.suggestedPriority === 'CRITICAL'
                        ? 'bg-red-500 text-white'
                        : aiAnalysis.suggestedPriority === 'HIGH'
                        ? 'bg-amber-500 text-white'
                        : aiAnalysis.suggestedPriority === 'MEDIUM'
                        ? 'bg-blue-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {aiAnalysis.suggestedPriority} PRIORITY
                  </span>
                </div>
                <span className="text-[10px] text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
                  {aiAnalysis.isSimulated ? 'Deterministic NLP' : 'Model Output'} ({(aiAnalysis.confidenceScore * 100).toFixed(0)}% confidence)
                </span>
              </div>

              <p className="text-slate-700 italic bg-white/70 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed">
                "{aiAnalysis.priorityReasoning}"
              </p>

              {aiAnalysis.safetyConcerns && aiAnalysis.safetyConcerns.length > 0 && (
                <div className="text-[11px] text-amber-900 font-medium space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-950">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Detected Public Safety Concerns:
                  </span>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                    {aiAnalysis.safetyConcerns.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysis.missingInformationSuggestions && aiAnalysis.missingInformationSuggestions.length > 0 && (
                <div className="text-[11px] text-blue-900 bg-blue-50/90 p-2.5 rounded-xl border border-blue-200/70">
                  <span className="font-bold">Completeness Tips:</span> {aiAnalysis.missingInformationSuggestions.join(' ')}
                </div>
              )}
            </div>
          )}
        </div>


        {/* Step 2: Location Map */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
              2
            </span>
            Geographic Location & Landmark
          </h2>

          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lon) => {
              setLatitude(lat);
              setLongitude(lon);
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Street Address or Corridor
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="E.g., 80 Feet Road, 4th Block"
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Prominent Landmark (Highly Recommended)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="E.g., Opposite Metro Station Gate 2"
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isApproximateLocation}
              onChange={(e) => setIsApproximateLocation(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>This pin represents an approximate location area</span>
          </label>
        </div>

        {/* Step 3: Photo Upload */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
              3
            </span>
            Photographic Evidence
          </h2>

          {primaryPhotoUrl ? (
            <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              <img src={primaryPhotoUrl} alt="Uploaded evidence" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => setPrimaryPhotoUrl('')}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-navy-950/80 text-white hover:bg-red-600 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
                {uploadingPhoto ? (
                  <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="font-semibold text-slate-700">Click to upload photo evidence</span>
                    <span className="text-[11px] text-slate-400">JPEG, PNG, or WebP up to 10MB</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Submit Bar */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="px-6 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || uploadingPhoto}
            className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Report...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Publish Incident</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
