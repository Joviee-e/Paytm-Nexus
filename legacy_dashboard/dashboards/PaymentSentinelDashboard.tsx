import React from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  PAYMENT_SUCCESS_HOURLY,
  PAYMENT_METHOD_BREAKDOWN,
  GATEWAY_HEALTH_DATA,
} from '../../data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Search,
  CheckCircle2,
  TrendingDown,
  Server,
  Zap,
} from 'lucide-react';

export const PaymentSentinelDashboard: React.FC = () => {
  const { selectAgent, addToast, navigateTo } = useNexus();

  return (
    <div className="space-y-6">
      {/* Prominent Anomaly Alert Card */}
      <div className="p-4 rounded-nexus bg-amber-50/70 border border-amber-200/80 shadow-nexus-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-nexus-amber" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-amber">
                Critical Telemetry Anomaly
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                Evening Spike
              </span>
            </div>
            <h4 className="text-sm font-semibold text-nexus-navy mt-0.5">
              Payment failures increased by 3.4× between 7 PM and 10 PM.
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Primary impact isolated to UPI Intent flows across partner bank gateway switches.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => selectAgent('failure-investigator')}
            className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle transition-all"
          >
            <Search className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Investigate Anomaly</span>
          </button>
          <button
            onClick={() => selectAgent('incident-coordinator')}
            className="px-3 py-1.5 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <BellRing className="w-3.5 h-3.5 text-slate-500" />
            <span>Notify Coordinator</span>
          </button>
        </div>
      </div>

      {/* Main 24h Success Rate Trend Chart */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-nexus-navy">Payment Success Rate (Rolling 24 Hours)</h3>
              <span className="text-xs font-semibold text-nexus-red flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> -3.1% vs baseline
              </span>
            </div>
            <p className="text-xs text-nexus-muted mt-0.5">
              Noticeable failure concentration highlighted during peak evening sales hours (19:00 - 22:00)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast('Telemetry Synced', 'Live checkout stream synced with core bank nodes.', 'info')}
              className="px-2.5 py-1 text-[11px] font-medium text-nexus-blue bg-nexus-lightblue rounded-md hover:bg-blue-100 transition-colors"
            >
              Sync Gateway Telemetry
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PAYMENT_SUCCESS_HOURLY}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis domain={[80, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E3EAF3',
                  boxShadow: '0 4px 12px rgba(16, 36, 92, 0.08)',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val}%`, 'Success Rate']}
              />
              <Area
                type="monotone"
                dataKey="successRate"
                stroke="#0066FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#successGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Grid: Payment Methods & Gateway Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Method Distribution */}
        <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-nexus-navy">Failed Transactions by Payment Method</h3>
            <p className="text-xs text-nexus-muted mt-0.5">
              68% of total failed attempts trace directly to UPI Intent requests
            </p>

            <div className="h-48 w-full mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PAYMENT_METHOD_BREAKDOWN}
                    dataKey="percentage"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {PAYMENT_METHOD_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E3EAF3',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {PAYMENT_METHOD_BREAKDOWN.map((item) => (
              <div key={item.method} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                <div className="text-[11px] truncate">
                  <span className="font-semibold text-nexus-navy">{item.percentage}%</span>{' '}
                  <span className="text-slate-500">{item.method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gateway Health Monitor */}
        <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-nexus-navy">Gateway Health Status</h3>
              <span className="text-[10px] font-semibold text-nexus-blue uppercase tracking-wider">
                Live Ping 3s
              </span>
            </div>
            <p className="text-xs text-nexus-muted mt-0.5">
              Individual acquiring and switch node latency benchmarks
            </p>

            <div className="mt-4 space-y-2.5">
              {GATEWAY_HEALTH_DATA.map((gw) => {
                const isDegraded = gw.status === 'Degraded';
                return (
                  <div
                    key={gw.gateway}
                    className={`p-3 rounded-nexus border flex items-center justify-between transition-colors ${
                      isDegraded
                        ? 'bg-red-50/50 border-red-200 text-nexus-navy'
                        : 'bg-slate-50/50 border-nexus-border'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Server
                        className={`w-4 h-4 ${isDegraded ? 'text-nexus-red' : 'text-slate-500'}`}
                      />
                      <div>
                        <div className="text-xs font-semibold text-nexus-navy">{gw.gateway}</div>
                        <div className="text-[10px] text-slate-500">Latency: {gw.latency}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-xs font-bold ${
                          isDegraded ? 'text-nexus-red' : 'text-nexus-green'
                        }`}
                      >
                        {gw.successRate}%
                      </div>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                          isDegraded
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {gw.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">Failover route standby ready</span>
            <button
              onClick={() => navigateTo('approvals')}
              className="text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
            >
              <span>View Route Policy</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
