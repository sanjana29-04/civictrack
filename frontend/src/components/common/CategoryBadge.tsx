import React from 'react';
import { IncidentCategory } from '../../types';
import {
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Pipette,
  Footprints,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  category: IncidentCategory;
}

export const CategoryBadge: React.FC<Props> = ({ category }) => {
  const getCategoryInfo = () => {
    switch (category) {
      case 'ROADS_POTHOLES':
        return { label: 'Roads & Potholes', icon: Car, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'GARBAGE_SANITATION':
        return { label: 'Garbage & Sanitation', icon: Trash2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'STREETLIGHTS':
        return { label: 'Streetlights', icon: Lightbulb, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
      case 'DRAINAGE_WATERLOGGING':
        return { label: 'Drainage & Waterlogging', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'WATER_SUPPLY_LEAKAGE':
        return { label: 'Water Supply & Leakage', icon: Pipette, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' };
      case 'FOOTPATHS_ACCESSIBILITY':
        return { label: 'Footpaths & Access', icon: Footprints, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'PUBLIC_PROPERTY_DAMAGE':
        return { label: 'Property Damage', icon: Building2, color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'OTHER':
      default:
        return { label: 'Other Civic Issue', icon: HelpCircle, color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  const { label, icon: Icon, color } = getCategoryInfo();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
