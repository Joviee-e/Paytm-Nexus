import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { CUSTOMER_SEGMENTS } from '../../data/mockData';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Users,
  Sparkles,
  ArrowRight,
  TrendingDown,
  UserCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const CustomerSegmenterDashboard: React.FC = () => {
  const { selectAgent, addToast } = useNexus();

  return (
    <div className="space-y-6">
      {/* Segment Insight Banner */}
      <div className="p-4 rounded-nexus bg-purple-50/60 border border-purple-200/80 shadow-nexus-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-nexus-purple text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-purple">
                Customer Intelligence Synthesis
              </span>
              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold">
                1,420 Inactive VIPs
              </span>
            </div>
            <h4 className="text-sm font-semibold text-nexus-navy mt-0.5">
              High-value inactive customers are a strong re-engagement audience.
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              1,420 top-tier repeat buyers encountered Friday checkout failures and have not returned.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => selectAgent('campaign-strategist')}
            className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Send to Campaign Strategist</span>
          </button>
        </div>
      </div>

      {/* Main Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Donut Chart */}
        <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-nexus-navy">Customer Behavioral Cohorts</h3>
            <p className="text-xs text-nexus-muted mt-0.5">
              Dynamic RFM clustering of 17,470 active store accounts
            </p>

            <div className="h-56 w-full mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CUSTOMER_SEGMENTS}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {CUSTOMER_SEGMENTS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E3EAF3',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} users`, 'Segment Size']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            {CUSTOMER_SEGMENTS.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                  <span className="font-medium text-nexus-navy">{seg.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">{seg.count.toLocaleString()} users ({seg.percentage}%)</span>
                  <span className="text-slate-700 font-semibold">{seg.aov} AOV</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Details & Actions */}
        <div className="space-y-3">
          <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-nexus-navy">High-Value VIP Cohort</span>
              <span className="text-[10px] font-semibold bg-blue-50 text-nexus-blue px-2 py-0.5 rounded">
                Tier 1
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Customers with &gt;3 orders and lifetime spend &gt;₹10,000. Generates 58% of overall merchant margin.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => addToast('Segment Focused', 'Showing 4,890 High-Value VIP cohort profiles.', 'info')}
                className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200 transition-colors"
              >
                View Segment Profiles
              </button>
              <button
                onClick={() => selectAgent('churn-predictor')}
                className="px-3 py-1 bg-nexus-lightblue hover:bg-blue-100 text-nexus-blue text-xs font-medium rounded-md transition-colors"
              >
                Predict Churn Risk →
              </button>
            </div>
          </div>

          <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-nexus-navy">At-Risk Drop-off Cohort</span>
              <span className="text-[10px] font-semibold bg-amber-50 text-nexus-amber px-2 py-0.5 rounded">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              1,420 high-value shoppers experienced UPI drop-offs between 7-10 PM. Churn risk currently at 38%.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-nexus-red">14-day lapse hazard: Elevated</span>
              <button
                onClick={() => selectAgent('campaign-strategist')}
                className="text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
              >
                <span>Generate Recovery Campaign</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
