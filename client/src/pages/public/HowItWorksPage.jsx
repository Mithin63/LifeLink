import React from 'react';
import { Navbar } from '../../components/Navbar.jsx';
import { Footer } from '../../components/Footer.jsx';
import { Link } from 'react-router-dom';
export const HowItWorksPage = () => {
    return (<div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Platform Walkthrough</span>
          <h1 className="text-3xl sm:text-5xl font-black">How LifeLink Works</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            From emergency request creation to smart matching and verified fulfillment — learn how LifeLink saves precious time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        {/* Step-by-Step Breakdown */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
                01
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-slate-900">User Registration & Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Donors, patients, hospitals, and blood banks register on the platform. Donors provide their blood group, last donation date, and live availability. GPS coordinates are securely recorded to assist with distance sorting.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-rose-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-rose-600/30">
                02
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Create Emergency Blood Request</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When blood is urgently required for surgery, trauma, or medical therapy, the requester submits the required blood group, hospital address, required date & time, and priority level (Normal, Urgent, or Emergency). A unique Tracking ID (e.g. <code>BR-2026-0001</code>) is instantly generated.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                03
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Smart Donor Matching Algorithm</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The algorithm scores potential donors using <strong>Matching Score = Blood Compatibility + Availability + Distance (Haversine) + Eligibility</strong>. Compatible donors receive in-app alerts and SMS notifications.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                04
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Live Request Tracking & Donation Completion</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Requesters follow their request status across the 6-stage lifecycle: <em>Request Created → Donors Being Matched → Donor Contacted → Donor Confirmed → Blood Arranged → Completed</em>. The donor is awarded a digital donation certificate and credits.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">How often can I donate blood?</h4>
              <p className="text-slate-600 text-xs">
                A healthy adult can safely donate whole blood once every 90 days (3 months). Our platform automatically factors this into matching.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Who is the universal blood donor?</h4>
              <p className="text-slate-600 text-xs">
                O-negative (O-) donors are universal red cell donors, while AB-positive (AB+) individuals are universal blood recipients.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link to="/emergency-request" className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md transition">
            Create Emergency Request Now
          </Link>
        </div>
      </div>

      <Footer />
    </div>);
};
