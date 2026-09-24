import { Department, Agent, Workflow, DemoState, DepartmentId } from '../types/nexus';

export const DEPARTMENTS: Department[] = [
  {
    id: 'payment-ops',
    name: 'Payment Operations',
    shortDescription: 'Monitor payment health, investigate failures, and coordinate payment incidents.',
    description: 'Autonomous payment supervision. Real-time telemetry monitoring, automated failure classification, gateway failover recommendations, and incident mitigation.',
    iconName: 'CreditCard',
    agentIds: ['payment-sentinel', 'failure-investigator', 'payment-health-analyst', 'incident-coordinator'],
    accentColor: '#00B9F5', // Paytm Cyan/Blue
    ambientColor: 'rgba(0, 185, 245, 0.15)',
  },
  {
    id: 'finance-recon',
    name: 'Finance & Reconciliation',
    shortDescription: 'Audit settlement exceptions, verify fee schedules, and track instant refunds.',
    description: 'Precision ledger surveillance. 3-way matching between bank settlement feeds, merchant orders, and gateway ledgers with automated exception dispute filing.',
    iconName: 'Scale',
    agentIds: ['settlement-investigator', 'refund-tracker', 'financial-analyst', 'reconciliation-coordinator'],
    accentColor: '#10B981', // Emerald
    ambientColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'merchant-growth',
    name: 'Merchant Growth',
    shortDescription: 'Forecast revenue trends, scout uncaptured demand, and prepare recovery campaigns.',
    description: 'Proactive revenue expansion. 14-day Bayesian revenue forecasting, opportunity scouting across dropped checkouts, and automated merchant campaign design.',
    iconName: 'TrendingUp',
    agentIds: ['revenue-forecaster', 'opportunity-scout', 'business-analyst', 'campaign-strategist', 'growth-coordinator'],
    accentColor: '#8B5CF6', // Purple/Violet
    ambientColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    shortDescription: 'Predict customer churn, analyze cohorts, and prioritize repeat buyer retention.',
    description: 'Autonomous buyer intelligence. Churn velocity prediction, RFM cohort segmentation, and autonomous resolution of merchant delivery & payment tickets.',
    iconName: 'Users',
    agentIds: ['customer-segmenter', 'churn-predictor', 'customer-support-agent', 'retention-coordinator'],
    accentColor: '#F59E0B', // Amber
    ambientColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'business-ops',
    name: 'Business Operations',
    shortDescription: 'Synthesize daily executive briefings, track merchant tasks, and verify documents.',
    description: 'Merchant operational nervous system. Morning executive briefs, automated task delegation, GST invoice verification, and cross-department orchestration.',
    iconName: 'Layers',
    agentIds: ['daily-briefing-agent', 'task-coordinator', 'document-assistant', 'operations-coordinator'],
    accentColor: '#38BDF8', // Sky
    ambientColor: 'rgba(56, 189, 248, 0.15)',
  },
  {
    id: 'intelligence-lab',
    name: 'Intelligence Lab',
    shortDescription: 'Core ML laboratory hosting neural engines, embeddings, and telemetry models.',
    description: 'Shared company brain. Underlying machine learning engines powering real-time anomaly isolation, graph customer vectors, and automated hypothesis testing.',
    iconName: 'Cpu',
    agentIds: ['anomaly-detection-engine', 'revenue-forecasting-engine', 'customer-intelligence-engine', 'merchant-profile-engine', 'insight-generator', 'model-evaluation-engine'],
    accentColor: '#EC4899', // Rose/Pink
    ambientColor: 'rgba(236, 72, 153, 0.15)',
  },
];

export const INITIAL_AGENTS: Record<string, Agent> = {
  // Payment Operations Agents
  'payment-sentinel': {
    id: 'payment-sentinel',
    name: 'Payment Sentinel',
    departmentId: 'payment-ops',
    departmentName: 'Payment Operations',
    subtitle: 'Real-time telemetry surveillance & failure spike detector.',
    description: 'Continuously monitors transaction streams across all gateway channels. Uses rolling adaptive baseline scoring to flag micro-degradations before they impact merchants.',
    status: 'idle',
    iconName: 'ShieldAlert',
    capabilities: ['Real-time telemetry ingestion', 'Baseline deviation detection', 'Spike alarm emission', 'Traffic routing telemetry'],
    currentTask: 'Supervising UPI, NetBanking, and Card gateway switch telemetry.',
    lastRun: '12 seconds ago',
    dataSources: ['Paytm Gateway API', 'NPCI Switch Feed', 'HDFC Core Bridge', 'Merchant SDK Logs'],
    intelligence: {
      model: 'Isolation Forest & Adaptive EWMA Change-Point Detector v4.2',
      confidence: 98.4,
      benchmarkComparison: 'Failure detection threshold set at 2.2 standard deviations above 30-day baseline.',
      metrics: [
        { label: 'Success Rate', value: '97.8%', change: '+0.2%', isPositive: true },
        { label: 'Avg Latency', value: '720ms', change: '-40ms', isPositive: true },
        { label: 'Active Alerts', value: '0', change: 'Normal', isPositive: true },
        { label: '24h Processed', value: '₹48.2L', change: '+12%', isPositive: true },
      ],
    },
    availableActions: ['Run Diagnosis', 'View Transactions', 'Prepare Incident Report', 'Escalate'],
  },
  'failure-investigator': {
    id: 'failure-investigator',
    name: 'Failure Investigator',
    departmentId: 'payment-ops',
    departmentName: 'Payment Operations',
    subtitle: 'Deep root-cause diagnostics down to error codes and bank switches.',
    description: 'Deconstructs failed transaction responses, maps error codes to bank gateway nodes, and isolates whether failures stem from device, network, or bank switches.',
    status: 'idle',
    iconName: 'Search',
    capabilities: ['Error taxonomy parsing', 'Bank switch telemetry correlation', 'Latency tracerouting', 'Root-cause attribution'],
    currentTask: 'Standby mode. Periodic hourly validation of error code distributions.',
    lastRun: '4 mins ago',
    dataSources: ['NPCI Return Codes', 'Bank Host Responses', 'Network Traceroutes', 'User Device Telemetry'],
    intelligence: {
      model: 'Hierarchical Bayesian Error Attribution & Failure Graph Engine',
      confidence: 96.1,
      benchmarkComparison: 'Identifies bank timeout patterns within 90 seconds of first cluster occurrence.',
      metrics: [
        { label: 'Error Classification', value: '99.4%', change: 'Precise', isPositive: true },
        { label: 'Mean TTD', value: '42s', change: '-15s', isPositive: true },
        { label: 'Bank Switch Coverage', value: '18 Banks', change: 'All active', isPositive: true },
      ],
    },
    availableActions: ['Analyze Error Logs', 'Test Gateway Switch', 'Generate Root-Cause Report'],
  },
  'payment-health-analyst': {
    id: 'payment-health-analyst',
    name: 'Payment Health Analyst',
    departmentId: 'payment-ops',
    departmentName: 'Payment Operations',
    subtitle: 'Longitudinal payment conversion metrics and health scoring.',
    description: 'Maintains rolling 30-day conversion models across payment modes (UPI, Cards, EMI, Wallets), evaluating funnel dropoffs and checkout UX frictions.',
    status: 'idle',
    iconName: 'Activity',
    capabilities: ['Checkout funnel conversion audit', 'Method-level health scoring', 'SLA conformance tracking'],
    currentTask: 'Aggregating hourly checkout conversion rates across mobile and web.',
    lastRun: '15 mins ago',
    dataSources: ['Merchant Checkout Telemetry', 'Payment Funnel Database', 'Device Browser Fingerprints'],
    intelligence: {
      model: 'Multivariate Conversion Propensity Estimator',
      confidence: 94.7,
      metrics: [
        { label: 'UPI Conversion', value: '88.4%', change: '+1.1%', isPositive: true },
        { label: 'Card Conversion', value: '82.1%', change: 'Steady', isPositive: true },
        { label: 'Wallet Conversion', value: '96.2%', change: '+0.5%', isPositive: true },
      ],
    },
    availableActions: ['View Funnel Breakdown', 'Export Health Audit', 'Compare Historical Quarters'],
  },
  'incident-coordinator': {
    id: 'incident-coordinator',
    name: 'Incident Coordinator',
    departmentId: 'payment-ops',
    departmentName: 'Payment Operations',
    subtitle: 'Automated alert routing, merchant mitigation, and partner escalation.',
    description: 'Coordinates rapid failover actions during payment outages, prepares mitigation playbooks, and queues automated failover routing for merchant authorization.',
    status: 'idle',
    iconName: 'BellRing',
    capabilities: ['Dynamic gateway rerouting', 'Merchant notification dispatch', 'Incident timeline synthesis', 'Partner SLA ticketing'],
    currentTask: 'All payment conduits nominal. Standby for incident triggers.',
    lastRun: '28 mins ago',
    dataSources: ['Paytm Routing Switch', 'Slack & Webhook Integrations', 'Merchant Incident Queue'],
    intelligence: {
      model: 'Automated Incident Orchestration & Multi-Criteria Decision Model',
      confidence: 99.0,
      metrics: [
        { label: 'Auto-Failover SLA', value: '< 30s', change: 'Ready', isPositive: true },
        { label: 'Active Incidents', value: '0', change: 'Clean', isPositive: true },
      ],
    },
    availableActions: ['Trigger Failover Drill', 'View Mitigation Runbooks', 'Audit Routing Rules'],
  },

  // Finance & Reconciliation Agents
  'settlement-investigator': {
    id: 'settlement-investigator',
    name: 'Settlement Investigator',
    departmentId: 'finance-recon',
    departmentName: 'Finance & Reconciliation',
    subtitle: 'Precision transaction matching against bank settlement files.',
    description: 'Executes automated 3-way reconciliation between order authorizations, gross settlement batch files, and nodal bank ledger deposits.',
    status: 'idle',
    iconName: 'Receipt',
    capabilities: ['3-way ledger reconciliation', 'Nodal file discrepancy detection', 'Fee schedule audit', 'Bank timing adjustment'],
    currentTask: 'Verifying nodal settlement batch #SET-20260924-04.',
    lastRun: '6 mins ago',
    dataSources: ['Nodal Bank MIS Files', 'Merchant Order DB', 'GST Tax Logs', 'Fee Schedule Tables'],
    intelligence: {
      model: 'Deterministic Constraint Satisfaction & Tolerance Matcher',
      confidence: 99.8,
      benchmarkComparison: '99.4% automated zero-touch matching rate on daily ledger files.',
      metrics: [
        { label: 'Matched Rate', value: '99.4%', change: '+0.2%', isPositive: true },
        { label: 'Exceptions', value: '32', change: '-8 vs yday', isPositive: true },
        { label: 'Pending Settl.', value: '₹14.8L', change: 'On schedule', isPositive: true },
        { label: 'Discrepancy Gap', value: '₹150', change: 'Actionable', isPositive: false },
      ],
    },
    availableActions: ['Audit Exceptions', 'Trigger Bank Resync', 'Auto-Adjust Verified Ledgers'],
  },
  'refund-tracker': {
    id: 'refund-tracker',
    name: 'Refund Tracker',
    departmentId: 'finance-recon',
    departmentName: 'Finance & Reconciliation',
    subtitle: 'End-to-end refund lifecycle tracking and turnaround monitoring.',
    description: 'Ensures customer refund requests are instantaneously routed, matched against reversal tokens, and credited within bank SLA windows.',
    status: 'idle',
    iconName: 'RotateCcw',
    capabilities: ['Refund queue monitoring', 'Reverse UTR verification', 'Customer credit SLA tracking'],
    currentTask: 'Monitoring 18 reverse transactions across ICICI and SBI endpoints.',
    lastRun: '10 mins ago',
    dataSources: ['Refund Processing Queue', 'Customer Bank Confirmation Feed', 'Paytm Wallet Ledgers'],
    intelligence: {
      model: 'Lifecycle Event State Machine & SLA Predictor',
      confidence: 97.5,
      metrics: [
        { label: 'Instant Refund SLA', value: '98.9%', change: '+0.4%', isPositive: true },
        { label: 'Avg Turnaround', value: '1.4 min', change: 'Optimal', isPositive: true },
      ],
    },
    availableActions: ['Inspect Stuck Refunds', 'Re-trigger Reversal', 'Generate Refund Digest'],
  },
  'financial-analyst': {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    departmentId: 'finance-recon',
    departmentName: 'Finance & Reconciliation',
    subtitle: 'Multi-channel fee analysis, tax auditing, and liquidity modeling.',
    description: 'Audits MDR deductions, GST breakdowns, interchange costs, and produces actionable merchant profitability insights.',
    status: 'idle',
    iconName: 'DollarSign',
    capabilities: ['MDR cost breakdown', 'GST tax validation', 'Cashflow liquidity forecast'],
    currentTask: 'Computing weekly interchange fee optimization matrix.',
    lastRun: '42 mins ago',
    dataSources: ['Paytm Settlement DB', 'GST Portal Data Feeds', 'Payment Channel Fee Tables'],
    intelligence: {
      model: 'Parametric Financial Flow Decomposition',
      confidence: 96.0,
      metrics: [
        { label: 'Effective MDR', value: '1.18%', change: '-0.04%', isPositive: true },
        { label: 'Tax Conformance', value: '100%', change: 'Verified', isPositive: true },
      ],
    },
    availableActions: ['View MDR Breakdown', 'Download Tax Summary', 'Simulate Fee Restructuring'],
  },
  'reconciliation-coordinator': {
    id: 'reconciliation-coordinator',
    name: 'Reconciliation Coordinator',
    departmentId: 'finance-recon',
    departmentName: 'Finance & Reconciliation',
    subtitle: 'Automated batch settlement adjustments and dispute filing.',
    description: 'Coordinates automated settlement clearing, dispute packet generation for chargebacks, and notifies merchant accountants of reconciled balances.',
    status: 'idle',
    iconName: 'CheckCircle2',
    capabilities: ['Chargeback evidence compiler', 'Batch reconciliation sealing', 'Accountant report generator'],
    currentTask: 'Preparing end-of-day settlement reconciliation certificate.',
    lastRun: '1 hour ago',
    dataSources: ['Dispute Management Portal', 'Merchant General Ledger', 'Bank Batch Confirmation API'],
    intelligence: {
      model: 'Automated Dispute Synthesis & Evidence Extraction Engine',
      confidence: 98.2,
      metrics: [
        { label: 'Dispute Win Rate', value: '87.4%', change: '+4.2%', isPositive: true },
        { label: 'Auto-Reconciled', value: '99.8%', change: 'Sealed', isPositive: true },
      ],
    },
    availableActions: ['Seal Daily Batch', 'Review Chargeback Defenses', 'Export ERP File'],
  },

  // Merchant Growth Agents
  'revenue-forecaster': {
    id: 'revenue-forecaster',
    name: 'Revenue Forecaster',
    departmentId: 'merchant-growth',
    departmentName: 'Merchant Growth',
    subtitle: '14-day Bayesian revenue forecasting and gap trajectory modeling.',
    description: 'Generates continuous probabilistic revenue projections based on merchant seasonality, day-of-week trends, basket sizes, and macro conversion variables.',
    status: 'idle',
    iconName: 'TrendingUp',
    capabilities: ['14-day forward sales projection', 'Revenue gap root-cause breakdown', 'Contributing factor sensitivity analysis'],
    currentTask: 'Calculating 14-day sales trajectory and baseline revenue delta.',
    lastRun: '8 mins ago',
    dataSources: ['Historical Order Ledger (365 days)', 'Real-time Cart Telemetry', 'Seasonal Demand Indices'],
    intelligence: {
      model: 'Hierarchical Bayesian Time-Series with Prophet Decomposition & Exogenous Regressors',
      confidence: 95.8,
      benchmarkComparison: 'Forecast variance within ±2.4% over rolling 7-day windows.',
      metrics: [
        { label: 'Projected Growth', value: '+18.4%', change: 'MoM', isPositive: true },
        { label: '14-Day Forecast', value: '₹34.6L', change: 'Normal', isPositive: true },
        { label: 'Expected Range', value: '₹32.8L - ₹36.2L', change: '95% CI', isPositive: true },
        { label: 'Current Deficit', value: '₹0', change: 'On track', isPositive: true },
      ],
    },
    availableActions: ['View Forecast', 'Compare Periods', 'Generate Business Explanation'],
  },
  'opportunity-scout': {
    id: 'opportunity-scout',
    name: 'Opportunity Scout',
    departmentId: 'merchant-growth',
    departmentName: 'Merchant Growth',
    subtitle: 'Uncaptured market demand and high-intent customer basket scouting.',
    description: 'Scans checkout drop-offs, inventory search spikes, and regional buyer demand to detect immediate uncaptured revenue opportunities.',
    status: 'idle',
    iconName: 'Compass',
    capabilities: ['Drop-off intent clustering', 'Cross-sell opportunity modeling', 'Affinity basket mining'],
    currentTask: 'Scouting repeat customer re-purchase intervals in electronics & apparel.',
    lastRun: '18 mins ago',
    dataSources: ['Paytm Commerce Search Index', 'Abandoned Checkout Stream', 'Merchant Inventory Catalog'],
    intelligence: {
      model: 'Association Rule Mining & High-Utility Itemset Pattern Detector',
      confidence: 93.2,
      metrics: [
        { label: 'Recoverable Opp.', value: '₹2.8L', change: 'Identified', isPositive: true },
        { label: 'High-Intent Leads', value: '2,420', change: '+320', isPositive: true },
      ],
    },
    availableActions: ['Explore Opportunities', 'Model Basket Lift', 'Transfer to Campaign Strategist'],
  },
  'business-analyst': {
    id: 'business-analyst',
    name: 'Business Analyst',
    departmentId: 'merchant-growth',
    departmentName: 'Merchant Growth',
    subtitle: 'Unit economics, basket size optimization, and seasonal trends.',
    description: 'Evaluates merchant margins, average order values (AOV), SKU velocity, and repeat purchase frequency to formulate strategic growth hypotheses.',
    status: 'idle',
    iconName: 'BarChart3',
    capabilities: ['AOV optimization analysis', 'Gross margin contribution breakdown', 'Cohort repurchase cycle calculation'],
    currentTask: 'Analyzing gross margin velocity across top 20 performing SKUs.',
    lastRun: '35 mins ago',
    dataSources: ['Merchant SKU Catalog', 'Order Profitability Ledger', 'Shipping & Fulfillment Data'],
    intelligence: {
      model: 'Cohort Margin Elasticity & Multi-Factor Profit Attribution',
      confidence: 94.0,
      metrics: [
        { label: 'Average Order Value', value: '₹1,480', change: '+₹110', isPositive: true },
        { label: 'Top SKU Margin', value: '34.2%', change: '+1.8%', isPositive: true },
      ],
    },
    availableActions: ['View SKU Matrix', 'Generate Profit Summary', 'Download Growth Model'],
  },
  'campaign-strategist': {
    id: 'campaign-strategist',
    name: 'Campaign Strategist',
    departmentId: 'merchant-growth',
    departmentName: 'Merchant Growth',
    subtitle: 'Personalized recovery campaigns and retention incentive design.',
    description: 'Designs targeted merchant re-engagement offers, evaluates ROI trade-offs, and prepares campaign parameters for explicit merchant review and approval.',
    status: 'idle',
    iconName: 'Sparkles',
    capabilities: ['Discount elasticity optimization', 'Channel budget simulation', 'Automated campaign copy generation', 'Merchant approval packaging'],
    currentTask: 'Monitoring merchant campaign performance and evaluating customer response cohorts.',
    lastRun: '12 mins ago',
    dataSources: ['Customer Response DB', 'SMS/WhatsApp Gateway API', 'Merchant Promotion Engine'],
    intelligence: {
      model: 'Reinforcement Learning with Human Feedback (RLHF) Offer Optimizer',
      confidence: 96.8,
      benchmarkComparison: 'Targeting calibrated to achieve minimum 4.8x ROAS with zero margin degradation.',
      metrics: [
        { label: 'Estimated ROAS', value: '5.2x', change: 'High return', isPositive: true },
        { label: 'Target Audience', value: '1,420 Users', change: 'Qualified', isPositive: true },
        { label: 'Est. Recovery', value: '₹2.8L', change: '+12% rev', isPositive: true },
        { label: 'Incentive Cost', value: '₹24,000', change: '8.5% margin', isPositive: true },
      ],
    },
    availableActions: ['Review Campaign', 'Edit Campaign', 'Approve', 'Reject'],
  },
  'growth-coordinator': {
    id: 'growth-coordinator',
    name: 'Growth Coordinator',
    departmentId: 'merchant-growth',
    departmentName: 'Merchant Growth',
    subtitle: 'Multi-channel merchant promotion launch and attribution tracking.',
    description: 'Executes approved marketing campaigns across Paytm Mini Apps, push notifications, and WhatsApp with real-time attribution and spend caps.',
    status: 'idle',
    iconName: 'Rocket',
    capabilities: ['Multi-channel delivery routing', 'Dynamic link attribution', 'Real-time burn rate caps'],
    currentTask: 'Idle. Ready to dispatch approved merchant campaigns upon confirmation.',
    lastRun: '2 hours ago',
    dataSources: ['Paytm Notification Hub', 'WhatsApp Business API', 'Merchant Ad Ledger'],
    intelligence: {
      model: 'Real-time Budget Pacing & Attribution Markov Chain Model',
      confidence: 97.4,
      metrics: [
        { label: 'Delivery Rate', value: '99.1%', change: 'Optimal', isPositive: true },
        { label: 'CTR Benchmark', value: '14.2%', change: '+3.8%', isPositive: true },
      ],
    },
    availableActions: ['Check Channel Health', 'Review Active Budgets', 'View Campaign Ledger'],
  },

  // Customer Success Agents
  'customer-segmenter': {
    id: 'customer-segmenter',
    name: 'Customer Segmenter',
    departmentId: 'customer-success',
    departmentName: 'Customer Success',
    subtitle: 'Behavioral RFM cohort classification and velocity mapping.',
    description: 'Continuously updates merchant customer segments into Champions, Loyalists, At-Risk, and Dormant cohorts using real-time transaction timestamps.',
    status: 'idle',
    iconName: 'UserCheck',
    capabilities: ['RFM dynamic clustering', 'Cohort transition velocity', 'LTV tier prediction'],
    currentTask: 'Re-clustering 24,000 merchant customer profiles into RFM percentiles.',
    lastRun: '14 mins ago',
    dataSources: ['Customer Transaction History', 'Merchant Loyalty Database', 'User Engagement Logs'],
    intelligence: {
      model: 'K-Means Gaussian Mixture Model with Recency-Frequency-Monetary Weighting',
      confidence: 96.5,
      metrics: [
        { label: 'Total Tracked', value: '24,800', change: '+840', isPositive: true },
        { label: 'VIP Champion Tier', value: '4,890', change: 'Active', isPositive: true },
        { label: 'Cohort Retention', value: '71.2%', change: '-4.8%', isPositive: false },
      ],
    },
    availableActions: ['Inspect Cohort Clusters', 'Export VIP Shopper List', 'Configure RFM Bands'],
  },
  'churn-predictor': {
    id: 'churn-predictor',
    name: 'Churn Predictor',
    departmentId: 'customer-success',
    departmentName: 'Customer Success',
    subtitle: 'Predictive early warning for repeat shopper abandonment.',
    description: 'Evaluates purchase intervals, cart abandonment velocity, and support sentiment to compute individual shopper churn probability scores.',
    status: 'idle',
    iconName: 'UserMinus',
    capabilities: ['Survival analysis modeling', 'Drop-off early warning alerts', 'High-value customer risk triage'],
    currentTask: 'Computing 30-day hazard rates across high-value repeat customer tiers.',
    lastRun: '11 mins ago',
    dataSources: ['Customer Order Cadence Logs', 'Payment Failure Intercepts', 'App Session Telemetry'],
    intelligence: {
      model: 'Cox Proportional Hazards Deep Neural Network (DeepSurv)',
      confidence: 94.6,
      benchmarkComparison: 'Identifies 82% of customer churn 18 days before complete order cessation.',
      metrics: [
        { label: 'At-Risk High-Tier', value: '1,420', change: '+340', isPositive: false },
        { label: 'Avg Inter-Order Gap', value: '24 days', change: '+7 days', isPositive: false },
        { label: 'Risk Threshold', value: '0.65', change: 'Critical trigger', isPositive: false },
      ],
    },
    availableActions: ['View Cohorts', 'Run Attrition Audit', 'Dispatch Retention Incentives'],
  },
  'customer-support-agent': {
    id: 'customer-support-agent',
    name: 'Customer Support Agent',
    departmentId: 'customer-success',
    departmentName: 'Customer Success',
    subtitle: 'Autonomous tier-1 merchant query triage and ticket resolution.',
    description: 'Resolves routine buyer inquiries regarding order delivery status, payment confirmations, and refunds with zero human intervention.',
    status: 'idle',
    iconName: 'MessageSquareHeart',
    capabilities: ['Natural language inquiry resolution', 'Order status lookups', 'Instant refund triggering'],
    currentTask: 'Triage queue empty. 0 pending tickets across chat and email.',
    lastRun: '7 mins ago',
    dataSources: ['Paytm Support Chat Stream', 'Courier Tracking Feeds', 'Merchant Order Management API'],
    intelligence: {
      model: 'Fine-tuned Customer Support Intent Transformer with Guardrails',
      confidence: 97.9,
      metrics: [
        { label: 'First Contact Res.', value: '91.4%', change: '+3.2%', isPositive: true },
        { label: 'Mean Response Time', value: '8.2s', change: 'Instant', isPositive: true },
        { label: 'CSAT Rating', value: '4.8/5.0', change: '+0.1', isPositive: true },
      ],
    },
    availableActions: ['View Resolved Inquiries', 'Update FAQ Knowledgebase', 'Escalate Complex Tickets'],
  },
  'retention-coordinator': {
    id: 'retention-coordinator',
    name: 'Retention Coordinator',
    departmentId: 'customer-success',
    departmentName: 'Customer Success',
    subtitle: 'Automated VIP shopper re-engagement workflows and concessions.',
    description: 'Coordinates retention playbooks, VIP loyalty perks, and personalized customer care outreaches to prevent high-value merchant customer loss.',
    status: 'idle',
    iconName: 'HeartHandshake',
    capabilities: ['VIP loyalty perk dispatch', 'Support escalation intervention', 'Automated merchant care outreach'],
    currentTask: 'Standby mode. Awaiting churn alerts or merchant loyalty triggers.',
    lastRun: '22 mins ago',
    dataSources: ['Merchant Loyalty API', 'Customer Feedback Stream', 'CRM Outreach Ledger'],
    intelligence: {
      model: 'Dynamic Customer Care Intervention Policy Engine',
      confidence: 95.1,
      metrics: [
        { label: 'Saved Customers', value: '640 / mo', change: '+18%', isPositive: true },
        { label: 'Retention ROI', value: '6.4x', change: 'High', isPositive: true },
      ],
    },
    availableActions: ['Review Retention Playbooks', 'Adjust Loyalty Thresholds', 'Audit Saved Cohorts'],
  },

  // Business Operations Agents
  'daily-briefing-agent': {
    id: 'daily-briefing-agent',
    name: 'Daily Briefing Agent',
    departmentId: 'business-ops',
    departmentName: 'Business Operations',
    subtitle: 'Morning executive briefing compilation and KPI synthesis.',
    description: 'Synthesizes daily merchant performance metrics into an executive 3-minute morning summary covering revenue, settlement, payment health, and urgent tasks.',
    status: 'idle',
    iconName: 'FileText',
    capabilities: ['Cross-department KPI synthesis', 'Natural language briefing generation', 'Executive audio briefing compilation'],
    currentTask: 'Compiling tomorrow morning 08:00 AM merchant briefing draft.',
    lastRun: '1 hour ago',
    dataSources: ['All Department Telemetry Feeds', 'Merchant KPI Data Warehouse', 'Pending Approval Ledger'],
    intelligence: {
      model: 'Multi-Modal Executive Briefing Summarization LLM',
      confidence: 98.7,
      metrics: [
        { label: 'Daily Accuracy', value: '99.8%', change: 'Verified', isPositive: true },
        { label: 'Synthesis Time', value: '1.2s', change: 'Fast', isPositive: true },
      ],
    },
    availableActions: ['Generate Instant Briefing', 'Customize Briefing Metrics', 'Schedule Delivery Channel'],
  },
  'task-coordinator': {
    id: 'task-coordinator',
    name: 'Task Coordinator',
    departmentId: 'business-ops',
    departmentName: 'Business Operations',
    subtitle: 'Autonomous operations task delegation and SLA tracking.',
    description: 'Tracks merchant operational obligations, manages inventory restock reminders, staff shift tasks, and ensures timely SLA fulfillment.',
    status: 'idle',
    iconName: 'CheckSquare',
    capabilities: ['Operational task prioritization', 'Staff shift reminders', 'SLA deadline alerting'],
    currentTask: 'Tracking 4 routine merchant operational checklist items.',
    lastRun: '25 mins ago',
    dataSources: ['Merchant Task Ledger', 'Staff Calendar API', 'Supplier Restock Feeds'],
    intelligence: {
      model: 'Operational Dependency Graph & Critical Path Scheduler',
      confidence: 96.3,
      metrics: [
        { label: 'On-Time Tasks', value: '98.2%', change: '+1.4%', isPositive: true },
        { label: 'Avg Task Latency', value: '9.4 min', change: '-28%', isPositive: true },
      ],
    },
    availableActions: ['View Operations Queue', 'Add Merchant Milestone', 'Re-balance Task Priorities'],
  },
  'document-assistant': {
    id: 'document-assistant',
    name: 'Document Assistant',
    departmentId: 'business-ops',
    departmentName: 'Business Operations',
    subtitle: 'Merchant invoice verification, GST filing, and agreement parser.',
    description: 'Automates document extraction from supplier bills, GST tax compliance filings, and supplier contract verifications using multimodal OCR.',
    status: 'idle',
    iconName: 'FileCheck',
    capabilities: ['GST invoice OCR & extraction', 'Supplier agreement parsing', 'Tax mismatch detection'],
    currentTask: 'Validating 12 supplier invoice PDFs against bank debit records.',
    lastRun: '30 mins ago',
    dataSources: ['Merchant Invoices Repository', 'GSTN Verification Gateway', 'Bank Debit Notices'],
    intelligence: {
      model: 'LayoutLMv3 Document Intelligence & Schema Entity Extractor',
      confidence: 99.2,
      metrics: [
        { label: 'Extraction Precision', value: '99.4%', change: 'High', isPositive: true },
        { label: 'GST Matching Rate', value: '100%', change: 'Clean', isPositive: true },
      ],
    },
    availableActions: ['Upload Invoices', 'Verify GST Records', 'Export Tax Ledger'],
  },
  'operations-coordinator': {
    id: 'operations-coordinator',
    name: 'Operations Coordinator',
    departmentId: 'business-ops',
    departmentName: 'Business Operations',
    subtitle: 'Cross-department operational harmony and process orchestration.',
    description: 'Serves as the operational glue between merchant store logistics, finance clearance, payment gateways, and executive decision-making.',
    status: 'idle',
    iconName: 'GitMerge',
    capabilities: ['Cross-department workflow routing', 'Operational bottleneck detection', 'Emergency procedure triggering'],
    currentTask: 'System operating at optimal operational efficiency index.',
    lastRun: '5 mins ago',
    dataSources: ['Paytm Nexus System Bus', 'Audit Logs', 'Merchant Store Telemetry'],
    intelligence: {
      model: 'Autonomous Multi-Agent Workflow Governor & Harmony Engine',
      confidence: 99.5,
      metrics: [
        { label: 'System Harmony', value: '100%', change: 'Optimal', isPositive: true },
        { label: 'Automations Run', value: '1,840', change: '+14% wk', isPositive: true },
      ],
    },
    availableActions: ['Inspect System Harmony', 'Review Audit Trail', 'Configure Workflow Rules'],
  },

  // Intelligence Lab Agents (Core ML Brain)
  'anomaly-detection-engine': {
    id: 'anomaly-detection-engine',
    name: 'Anomaly Detection Engine',
    departmentId: 'intelligence-lab',
    departmentName: 'Intelligence Lab',
    subtitle: 'Real-time unsupervised transaction anomaly scoring.',
    description: 'Underlying neural model scoring every incoming transaction vector for fraudulent velocity, gateway latency anomalies, and value outliers.',
    status: 'idle',
    iconName: 'Cpu',
    capabilities: ['High-throughput vector scoring', 'Unsupervised outlier isolation', 'Latent space clustering'],
    currentTask: 'Evaluating transaction latency vector tensors in 5ms inference batches.',
    lastRun: '1 second ago',
    dataSources: ['Paytm Low-Latency Kafka Bus', 'Vector Feature Store', 'Global Fraud Signatures'],
    intelligence: {
      model: 'Streaming Isolation Forest & Variational Autoencoder (VAE)',
      confidence: 99.6,
      benchmarkComparison: 'Latency < 4.2ms per inference across 10,000 TPS.',
      metrics: [
        { label: 'Scoring Latency', value: '3.8ms', change: '-0.4ms', isPositive: true },
        { label: 'False Positive Rate', value: '0.012%', change: 'Ultra-low', isPositive: true },
      ],
    },
    availableActions: ['Inspect Anomaly Vectors', 'Tune Latent Threshold', 'Run Stress Benchmark'],
  },
  'revenue-forecasting-engine': {
    id: 'revenue-forecasting-engine',
    name: 'Revenue Forecasting Engine',
    departmentId: 'intelligence-lab',
    departmentName: 'Intelligence Lab',
    subtitle: 'Time-series neural decomposition for cashflow and sales predictions.',
    description: 'Shared deep learning engine training spatial-temporal graph neural networks to forecast merchant volume across city clusters.',
    status: 'idle',
    iconName: 'TrendingUp',
    capabilities: ['Deep time-series decomposition', 'Exogenous trend embedding', 'Multi-horizon quantile forecasting'],
    currentTask: 'Pre-computing 90-day cashflow probability distributions.',
    lastRun: '10 mins ago',
    dataSources: ['Historical Volume Time-Series', 'City-level Economic Indices', 'Weather & Holiday Feeds'],
    intelligence: {
      model: 'Temporal Fusion Transformer (TFT) with Multi-Head Self-Attention',
      confidence: 97.1,
      metrics: [
        { label: 'Forecast MAPE', value: '2.1%', change: 'Accurate', isPositive: true },
        { label: 'Horizon Coverage', value: '90 Days', change: 'Active', isPositive: true },
      ],
    },
    availableActions: ['Export Model Weights', 'Benchmark Quantiles', 'Inspect Attention Maps'],
  },
  'customer-intelligence-engine': {
    id: 'customer-intelligence-engine',
    name: 'Customer Intelligence Engine',
    departmentId: 'intelligence-lab',
    departmentName: 'Intelligence Lab',
    subtitle: 'Graph neural network mapping customer lifetime value vectors.',
    description: 'Constructs merchant-customer bipartite graphs, generating dense embeddings that represent buyer affinity, churn risk, and price tolerance.',
    status: 'idle',
    iconName: 'Network',
    capabilities: ['Bipartite graph embeddings', 'Affinity node classification', 'Dynamic edge weighting'],
    currentTask: 'Updating 512-dimension customer embedding vectors.',
    lastRun: '15 mins ago',
    dataSources: ['Paytm Graph Store', 'Merchant Interaction Subgraphs', 'Category Purchase Vectors'],
    intelligence: {
      model: 'Graph Convolutional Network (GCN) with Inductive Node Embeddings',
      confidence: 95.8,
      metrics: [
        { label: 'Graph Density', value: '1.4M Edges', change: '+4%', isPositive: true },
        { label: 'Embedding Dim', value: '512-d', change: 'Standard', isPositive: true },
      ],
    },
    availableActions: ['Visualize Graph Subnets', 'Inspect Latent Neighbors', 'Re-index Vector Space'],
  },
  'merchant-profile-engine': {
    id: 'merchant-profile-engine',
    name: 'Merchant Profile Engine',
    departmentId: 'intelligence-lab',
    departmentName: 'Intelligence Lab',
    subtitle: 'Dynamic merchant behavioral vectorization and risk tiering.',
    description: 'Maintains an up-to-date representation of merchant business characteristics, seasonal liquidity needs, and risk health status.',
    status: 'idle',
    iconName: 'ShieldCheck',
    capabilities: ['Merchant vectorization', 'Liquidity risk modeling', 'Seasonal cluster classification'],
    currentTask: 'Calibrating merchant risk tiering baseline for current quarter.',
    lastRun: '20 mins ago',
    dataSources: ['Merchant Financial Records', 'Historical Repayment Feeds', 'KYC & Compliance Register'],
    intelligence: {
      model: 'Dynamic Merchant Behavioral Autoencoder',
      confidence: 98.4,
      metrics: [
        { label: 'Risk Health Index', value: '96.8 / 100', change: 'Optimal', isPositive: true },
        { label: 'Liquidity Buffer', value: 'High', change: 'Stable', isPositive: true },
      ],
    },
    availableActions: ['View Merchant Profile Vector', 'Review Risk Factors', 'Export Compliance Card'],
  },
  'insight-generator': {
    id: 'insight-generator',
    name: 'Insight Generator',
    departmentId: 'intelligence-lab',
    departmentName: 'Intelligence Lab',
    subtitle: 'Autonomous cross-domain correlation discovery and hypothesis testing.',
    description: 'Mines unexpected correlations across payments, customer sentiment, and inventory velocity to surface high-value merchant business insights.',
    status: 'idle',
    iconName: 'Sparkles',
    capabilities: ['Automated hypothesis discovery', 'Counterfactual simulation', 'Natural language insight synthesis'],
    currentTask: 'Testing causal correlation between evening UPI timeouts and repeat purchase drop.',
    lastRun: '3 mins ago',
    dataSources: ['All Department Data Streams', 'Causal Graph Engine', 'Merchant Historical Outcomes'],
    intelligence: {
      model: 'Causal Discovery Algorithm (Do-Calculus & Directed Acyclic Graph Inferrer)',
      confidence: 96.2,
      metrics: [
        { label: 'Causal Hypotheses', value: '14 Validated', change: 'Active', isPositive: true },
        { label: 'Signal-to-Noise', value: '94.6%', change: 'High clarity', isPositive: true },
      ],
    },
    availableActions: ['Inspect Causal Graph', 'Simulate Interventions', 'Generate Insight Report'],
  },
  'model-evaluation-engine': {
    id: 'model-evaluation-engine',
    name: 'Model Evaluation Engine',
    departmentId: 'intelligence-lab',
    departmentName: 'Intelligence Lab',
    subtitle: 'Continuous offline model drift monitoring and accuracy calibration.',
    description: 'Continuously monitors all production models for data drift, concept drift, bias, and calibration errors, ensuring robust AI workforce performance.',
    status: 'idle',
    iconName: 'Gauge',
    capabilities: ['Kolmogorov-Smirnov data drift tests', 'Calibration curve auditing', 'Automatic model rollback triggers'],
    currentTask: 'All 14 production workforce models operating within nominal calibration bounds.',
    lastRun: '5 mins ago',
    dataSources: ['Model Inference Logs', 'Ground Truth Verification Feeds', 'Model Registry Metrics'],
    intelligence: {
      model: 'Statistical Population Stability Index (PSI) & Drift Monitor',
      confidence: 99.9,
      metrics: [
        { label: 'Model Drift PSI', value: '0.04', change: '<0.10 Nominal', isPositive: true },
        { label: 'Active Models', value: '14 Models', change: '100% Healthy', isPositive: true },
      ],
    },
    availableActions: ['Run Drift Audit', 'Calibrate Confidence Bounds', 'Inspect Model Registry'],
  },
};

// Realistic Multi-Agent Collaborative Workflow Timeline (State 6)
export const MULTI_AGENT_WORKFLOW: Workflow = {
  id: 'wf-revenue-decline-investigation',
  title: 'Merchant Revenue Decline Investigation & Recovery',
  description: 'Cross-workforce autonomous diagnosis triggered by an evening revenue drop, isolating UPI switch failures and deploying a targeted recovery offer.',
  trigger: 'Evening revenue drop of ₹4.2L detected between 19:00 - 22:00',
  status: 'running',
  currentStepIndex: 3,
  steps: [
    {
      stepNumber: 1,
      agentId: 'merchant-request',
      agentName: 'System Trigger',
      departmentId: 'business-ops',
      role: 'Anomaly Trigger',
      task: 'Telemetry watcher identified a 22% downward deviation from projected evening revenue.',
      output: 'Revenue anomaly alert emitted. Initial deficit estimated at ₹4.2L.',
      status: 'completed',
      metric: '₹4.2L Gap',
      confidence: 99,
      timestamp: '19:42:10',
    },
    {
      stepNumber: 2,
      agentId: 'payment-sentinel',
      agentName: 'Payment Sentinel',
      departmentId: 'payment-ops',
      role: 'Telemetry Diagnosis',
      task: 'Ingested real-time transaction streams to determine if checkout failures drove the revenue decline.',
      output: 'Detected 3.4× surge in UPI transaction failures between 7 PM and 10 PM. Success rate dropped to 94.2%.',
      status: 'completed',
      metric: '3.4× UPI Failures',
      confidence: 98,
      timestamp: '19:42:25',
    },
    {
      stepNumber: 3,
      agentId: 'failure-investigator',
      agentName: 'Failure Investigator',
      departmentId: 'payment-ops',
      role: 'Root Cause Isolation',
      task: 'Deconstructed bank switch responses to isolate the exact technical failure point.',
      output: 'Pinpointed partner bank switch timeout (TIMEOUT_U16) on primary UPI conduit. Secondary switch remained 99.1% healthy.',
      status: 'completed',
      metric: 'Bank Error U16',
      confidence: 96,
      timestamp: '19:43:02',
    },
    {
      stepNumber: 4,
      agentId: 'revenue-forecaster',
      agentName: 'Revenue Forecaster',
      departmentId: 'merchant-growth',
      role: 'Impact Quantification',
      task: 'Quantified merchant revenue deficit and forecasted recovery trajectories under gateway failover.',
      output: 'Calculated exact net revenue deficit of ₹4.2L. Projected complete recovery within 48h if affected customers are re-engaged.',
      status: 'active',
      metric: '₹4.2L Net Deficit',
      confidence: 95,
      timestamp: '19:43:40',
    },
    {
      stepNumber: 5,
      agentId: 'opportunity-scout',
      agentName: 'Opportunity Scout',
      departmentId: 'merchant-growth',
      role: 'Demand Recovery Scouting',
      task: 'Identified 1,420 high-intent repeat customers who experienced dropped carts during the evening outage.',
      output: 'Segmented affected buyers with high historical basket sizes. ₹2.8L recoverable immediate demand isolated.',
      status: 'waiting',
      metric: '1,420 Buyers',
      confidence: 94,
      timestamp: 'Pending',
    },
    {
      stepNumber: 6,
      agentId: 'campaign-strategist',
      agentName: 'Campaign Strategist',
      departmentId: 'merchant-growth',
      role: 'Solution Formulation',
      task: 'Designed personalized recovery incentive (free express checkout + ₹100 instant Paytm cashback token).',
      output: 'Campaign package synthesized: 1,420 recipients, expected 5.2x ROAS, ₹24,000 incentive budget.',
      status: 'approval_required',
      metric: '5.2x Est. ROAS',
      confidence: 97,
      timestamp: 'Pending Approval',
    },
    {
      stepNumber: 7,
      agentId: 'merchant-approval',
      agentName: 'Merchant Confirmation',
      departmentId: 'merchant-growth',
      role: 'Human-in-the-Loop Gate',
      task: 'Requires merchant sign-off to authorize gateway routing failover and launch customer recovery campaign.',
      output: 'Awaiting merchant action to execute dual mitigation workflow.',
      status: 'waiting',
      metric: 'Action Required',
      timestamp: 'Awaiting Sign-off',
    },
  ],
};

// Function to generate agents for each demo state
export function getAgentsForDemoState(state: DemoState): Record<string, Agent> {
  // Deep clone initial agents
  const agents: Record<string, Agent> = JSON.parse(JSON.stringify(INITIAL_AGENTS));

  switch (state) {
    case 'calm':
      // All agents quiet and idle
      return agents;

    case 'payment_issue':
      // State 2: Payment Sentinel is blinking because payment failures increased
      agents['payment-sentinel'].status = 'attention';
      agents['payment-sentinel'].requiresHumanAction = true;
      agents['payment-sentinel'].alertSignal = 'Attention required: Payment failure rate is 3.4× above expected baseline.';
      agents['payment-sentinel'].currentTask = 'Investigating elevated evening payment failure rates on UPI routes.';
      agents['payment-sentinel'].evidence = [
        'Increased failures concentrated during evening hours (19:00 - 22:00)',
        'UPI transactions are disproportionately affected (82% of all drops)',
        'Error code distribution changed: TIMEOUT_U16 increased by 410%',
        'Secondary HDFC switch maintaining healthy 99.2% success rate',
      ];
      agents['payment-sentinel'].recommendedAction = {
        title: 'Apply Dynamic Failover to Secondary Gateway',
        description: 'Reroute incoming evening UPI traffic to the secondary bank switch to restore 99%+ conversion.',
        impact: 'Estimated to recover ₹3.8L in lost transaction volume.',
        type: 'investigation',
      };
      // Failure investigator is also working on root cause
      agents['failure-investigator'].status = 'working';
      agents['failure-investigator'].currentTask = 'Deconstructing error packets for partner bank switch timeout (TIMEOUT_U16).';
      return agents;

    case 'revenue_risk':
      // State 3: Revenue Forecaster becomes active after detecting downward trend
      agents['revenue-forecaster'].status = 'working';
      agents['revenue-forecaster'].currentTask = 'Forecasting revenue for the next 14 days and decomposing evening deficit.';
      agents['revenue-forecaster'].alertSignal = 'Active Forecast: Projected 14-day trajectory shows ₹4.2L revenue gap if evening drop continues.';
      agents['revenue-forecaster'].evidence = [
        'Projected 14-day revenue downward delta: -12.4%',
        'Evening checkout velocity dropped by 34% compared to 30-day moving average',
        'High-margin apparel category experiencing primary drop-off',
      ];
      agents['revenue-forecaster'].intelligence!.metrics = [
        { label: 'Projected Trend', value: 'Downward', change: '-12.4%', isPositive: false },
        { label: 'Revenue Deficit', value: '₹4.2L', change: 'Evening gap', isPositive: false },
        { label: 'Expected Range', value: '₹30.4L - ₹33.8L', change: '95% CI', isPositive: true },
        { label: 'Main Driver', value: 'UPI Dropoff', change: '74% factor', isPositive: false },
      ];
      return agents;

    case 'customer_risk':
      // State 4: Churn Predictor highlights customer segment requiring attention
      agents['churn-predictor'].status = 'attention';
      agents['churn-predictor'].requiresHumanAction = true;
      agents['churn-predictor'].alertSignal = 'Attention required: 1,420 high-value repeat customers at risk of churn.';
      agents['churn-predictor'].currentTask = 'Tracking repurchase velocity drop across Champion and Loyalist cohorts.';
      agents['churn-predictor'].evidence = [
        'High-value customer repurchase velocity down 32% compared to last month',
        '1,420 repeat buyers encountered checkout failures in the past 7 days',
        'Average order interval widened from 17 days to 24 days',
      ];
      agents['churn-predictor'].recommendedAction = {
        title: 'Deploy Priority Retention Outreach',
        description: 'Send high-value shoppers a personalized VIP re-checkout link with priority routing.',
        impact: 'Protects estimated ₹6.4L in 90-day repeat customer lifetime value.',
        type: 'investigation',
      };
      // Customer segmenter working in sync
      agents['customer-segmenter'].status = 'working';
      agents['customer-segmenter'].currentTask = 'Isolating 1,420 impacted buyer profiles and computing dynamic LTV scores.';
      return agents;

    case 'approval_required':
      // State 5: Campaign Strategist shows awaiting-approval state
      agents['campaign-strategist'].status = 'awaiting_approval';
      agents['campaign-strategist'].requiresHumanAction = true;
      agents['campaign-strategist'].alertSignal = 'Awaiting merchant approval: Recovery campaign for 1,420 dropped repeat customers.';
      agents['campaign-strategist'].currentTask = 'Preparing a recovery campaign for inactive repeat customers.';
      agents['campaign-strategist'].evidence = [
        'Target audience: 1,420 repeat customers with dropped checkouts',
        'Incentive proposed: ₹100 instant Paytm cashback token on next order',
        'Total campaign budget required: ₹24,000 (from marketing allocation)',
        'Estimated revenue recovery: ₹2.8L (Projected ROAS: 5.2x)',
      ];
      agents['campaign-strategist'].recommendedAction = {
        title: 'Approve Repeat Customer Recovery Campaign',
        description: 'Authorize one-click dispatch of personalized recovery incentive to 1,420 verified repeat shoppers.',
        impact: 'Projected net profit increase of ₹1.82L with 5.2x expected return on ad spend.',
        type: 'approval',
      };
      return agents;

    case 'multi_agent_workflow':
      // State 6: Multi-Agent Workflow active
      agents['payment-sentinel'].status = 'completed';
      agents['payment-sentinel'].currentTask = 'Completed telemetry diagnosis. Identified 3.4× UPI failure surge.';
      
      agents['failure-investigator'].status = 'completed';
      agents['failure-investigator'].currentTask = 'Completed error isolation. Bank timeout code U16 identified.';
      
      agents['revenue-forecaster'].status = 'working';
      agents['revenue-forecaster'].currentTask = 'Forecasting revenue recovery curves under gateway failover.';
      
      agents['opportunity-scout'].status = 'working';
      agents['opportunity-scout'].currentTask = 'Segmenting 1,420 high-intent buyers for immediate recovery.';
      
      agents['campaign-strategist'].status = 'awaiting_approval';
      agents['campaign-strategist'].requiresHumanAction = true;
      agents['campaign-strategist'].alertSignal = 'Awaiting approval to launch multi-agent recovery workflow.';
      
      return agents;

    default:
      return agents;
  }
}
