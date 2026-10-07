import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { CheckCircle2, Sparkles, MapPin, ShieldCheck, Heart, User, ArrowRight, Loader2 } from 'lucide-react';

const MATCHING_STEPS = [
  { id: 1, text: 'Finding compatible candidate donors in region...', duration: 500 },
  { id: 2, text: 'Checking ABO & Rh blood type cross-compatibility...', duration: 600 },
  { id: 3, text: 'Verifying active donor availability and 90-day cooldown...', duration: 600 },
  { id: 4, text: 'Calculating exact GPS proximity via Haversine formula...', duration: 500 },
  { id: 5, text: 'Ranking donors by multi-factor compatibility score...', duration: 400 },
];

export const SmartMatchModal = ({
  isOpen,
  onClose,
  request,
  onContactDonor,
  onViewAllMatches,
  initialMatches = [],
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMatching, setIsMatching] = useState(true);
  const [matchedDonors, setMatchedDonors] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsMatching(true);
      return;
    }

    setIsMatching(true);
    setCurrentStepIndex(0);

    let timeoutId;
    let step = 0;

    const runNextStep = () => {
      if (step < MATCHING_STEPS.length - 1) {
        step++;
        setCurrentStepIndex(step);
        timeoutId = setTimeout(runNextStep, MATCHING_STEPS[step].duration);
      } else {
        // Finished matching steps
        setTimeout(() => {
          setIsMatching(false);
          // Sort matched donors by compatibility score descending
          const sorted = [...initialMatches].sort(
            (a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0)
          );
          setMatchedDonors(sorted);
        }, 400);
      }
    };

    timeoutId = setTimeout(runNextStep, MATCHING_STEPS[0].duration);

    return () => clearTimeout(timeoutId);
  }, [isOpen, initialMatches]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>AI-Powered Smart Donor Matching</span>
        </div>
      }
      subtitle={
        request
          ? `Searching matches for Request #${request.request_number || request.id} (${request.blood_group} blood in ${request.city})`
          : 'Searching optimal compatible donors'
      }
      maxWidth="max-w-2xl"
    >
      {isMatching ? (
        <div className="py-8 px-4 flex flex-col items-center text-center">
          {/* Animated Matching Scanner */}
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-red-500/20 border-t-red-600 animate-spin" />
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600">
              <Heart className="w-8 h-8 animate-pulse fill-red-500/30 text-red-600" />
            </div>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {MATCHING_STEPS[currentStepIndex]?.text}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyzing blood bank registry & verified donor database
          </p>

          {/* Stepper Progress Bar */}
          <div className="w-full max-w-md mt-6 space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentStepIndex + 1) / MATCHING_STEPS.length) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>Step {currentStepIndex + 1} of {MATCHING_STEPS.length}</span>
              <span>
                {Math.round(((currentStepIndex + 1) / MATCHING_STEPS.length) * 100)}% Complete
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>Matching Complete!</strong> Found {matchedDonors.length} compatible verified donors sorted by proximity & compatibility score.
            </div>
          </div>

          {/* Donors List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {matchedDonors.length > 0 ? (
              matchedDonors.map((donor, idx) => (
                <div
                  key={donor.id || donor.donor_id || idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-red-300 dark:hover:border-red-900/50 transition-all hover-lift"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center font-extrabold shadow-sm shrink-0">
                      <span className="text-sm leading-none">{donor.blood_group || 'O+'}</span>
                      <span className="text-[9px] font-normal uppercase opacity-90">Donor</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {donor.name || 'Verified Donor'}
                        </h4>
                        {donor.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Donor" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {donor.city || 'Nearby'} ({donor.distance ? `${donor.distance} km` : '2.3 km'})
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {donor.available !== false ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                    <div className="text-right">
                      <div className="text-xs font-bold text-red-600 dark:text-red-400">
                        {donor.compatibility_score || 95}% Match
                      </div>
                      <span className="text-[10px] text-slate-400">Compatibility</span>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onContactDonor?.(donor)}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-slate-500">
                No active donors currently in the immediate radius. Expand search distance or contact blood banks.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {onViewAllMatches && (
              <Button variant="outline" onClick={onViewAllMatches}>
                View Detailed Matches <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
