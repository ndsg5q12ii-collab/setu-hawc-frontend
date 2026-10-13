import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { AdminLayout } from '../../layouts/AdminLayout';
import { BarChart, LineChart, Meter } from '../../components/charts';
import { mockAdminStats } from '../../services/mock/data';
import {
  Button,
  Badge,
  Input,
  Avatar,
  Rating,
  Modal,
  cx,
  useToast,
} from '../../components/ui';
import {
  Activity,
  Users,
  Briefcase,
  Video,
  DollarSign,
  ShieldAlert,
  Star,
  SlidersHorizontal,
  Settings,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Radio,
  FileText,
  Filter,
} from '../../components/icons';

export const AdminDashboardScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { transactions, disputes, bookings, technicians } = useAppState();

  const lineData = [
    { label: 'Mon', value: 142 },
    { label: 'Tue', value: 168 },
    { label: 'Wed', value: 180 },
    { label: 'Thu', value: 154 },
    { label: 'Fri', value: 195 },
    { label: 'Sat', value: 220 },
    { label: 'Sun', value: 181 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-up">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Marketplace Operations</h1>
            <p className="text-xs text-text-secondary mt-1">
              Live operational metrics for Delhi NCR technology support fleet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Cluster: Delhi NCR Live
            </span>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* GMV */}
          <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
              <span>Gross Marketplace GMV</span>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-text-primary mt-2">₹2,84,500</div>
            <div className="flex items-center gap-1 text-success text-xs font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this week</span>
            </div>
          </div>

          {/* Platform Revenue */}
          <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
              <span>Net Platform Revenue (20%)</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-primary mt-2">₹56,900</div>
            <div className="text-xs text-text-muted mt-1">Zero payment gateway leakage</div>
          </div>

          {/* Active Technicians */}
          <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
              <span>Technicians Online</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-text-primary mt-2">42</div>
            <div className="text-xs text-success font-medium mt-1">118 verified partners total</div>
          </div>

          {/* CSAT / Resolution Rate */}
          <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
              <span>Resolution Rate</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-text-primary mt-2">93.6%</div>
            <div className="text-xs text-text-muted mt-1">Average CSAT 4.88 ⭐</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Bar Chart */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-text-primary">Weekly Gross GMV (₹)</h3>
                <p className="text-xs text-text-muted">Daily remote session and doorstep billing totals</p>
              </div>
              <Badge variant="primary">Last 7 Days</Badge>
            </div>
            <BarChart
              data={mockAdminStats.weeklyRevenueChart.map((d) => ({
                label: d.day,
                value: d.revenue,
                subValue: d.sessions,
              }))}
              height={200}
            />
          </div>

          {/* Health Gauge & Utilization */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-soft flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-primary mb-1">Operational SLA Health</h3>
              <p className="text-xs text-text-muted mb-4">Target: Remote video connect under 90s</p>
            </div>
            <div className="space-y-3">
              <Meter percentage={94} label="Remote Fix Rate" subLabel="No home visit needed" color="#127A4B" />
              <Meter percentage={88} label="Fleet Utilization" subLabel="Delhi NCR technician capacity" color="#2B2F8F" />
            </div>
          </div>
        </div>

        {/* Sessions Volume Line Chart */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-text-primary">Diagnostic Session Volumes</h3>
              <p className="text-xs text-text-muted">Live incoming customer support requests across days</p>
            </div>
            <Badge variant="verified">1,240 Total Sessions</Badge>
          </div>
          <LineChart data={lineData} height={170} />
        </div>

        {/* Bottom Split: Recent Transactions & Active Disputes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions Ledger Excerpt */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-text-primary">Recent Transactions Ledger</h3>
              <button
                onClick={() => navigate('/admin/payments')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="p-3 rounded-lg bg-sunken flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-primary">{tx.invoiceNumber}</span>
                    <div className="text-text-secondary mt-0.5">{tx.customerName} → {tx.technicianName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-text-primary text-sm">₹{tx.grossAmount}</div>
                    <span className="text-[10px] text-text-muted font-mono">{tx.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Disputes Queue */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-text-primary">Dispute Resolution Queue</h3>
              <button
                onClick={() => navigate('/admin/disputes')}
                className="text-xs font-semibold text-error hover:underline"
              >
                Manage ({disputes.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {disputes.map((dsp) => (
                <div key={dsp.id} className="p-3 rounded-lg bg-red-50/50 border border-red-200/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-error">{dsp.id}</span>
                    <Badge variant={dsp.status === 'open' ? 'error' : 'success'}>
                      {dsp.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-text-secondary mt-1 font-medium">{dsp.reason}</p>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-text-muted pt-1 border-t border-red-200/40">
                    <span>Claim: ₹{dsp.claimedAmount}</span>
                    <span>{dsp.customerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminTechniciansScreen: React.FC = () => {
  const { technicians, toggleTechnicianVerification } = useAppState();
  const { addToast } = useToast();

  return (
    <AdminLayout activePath="/admin/technicians">
      <div className="space-y-5 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-text-primary">Technician Partner Fleet</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Vetting, Aadhaar KYC approval, and performance monitoring in Delhi NCR.
            </p>
          </div>
          <Badge variant="verified">118 Partners Active</Badge>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sunken border-b border-border font-bold text-text-muted uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Technician</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Rating & Jobs</th>
                  <th className="p-3.5">KYC Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {technicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-sunken/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar src={tech.avatar} name={tech.name} size="md" verified={tech.verified} />
                        <div>
                          <div className="font-bold text-text-primary">{tech.name}</div>
                          <div className="text-[11px] text-text-muted">{tech.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-text-secondary">{tech.location}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-amber-600">⭐ {tech.rating}</div>
                      <div className="text-[11px] text-text-muted">{tech.completedSessions} sessions</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={tech.verificationStatus === 'verified' ? 'success' : 'warning'}>
                        {tech.verificationStatus.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant={tech.verificationStatus === 'verified' ? 'outline' : 'primary'}
                        onClick={() => {
                          toggleTechnicianVerification(tech.id);
                          addToast({
                            title: 'Status Updated',
                            message: `${tech.name} status updated.`,
                            type: 'info',
                          });
                        }}
                      >
                        {tech.verificationStatus === 'verified' ? 'Suspend' : 'Approve KYC'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminBookingsScreen: React.FC = () => {
  const { bookings } = useAppState();

  return (
    <AdminLayout activePath="/admin/bookings">
      <div className="space-y-5 animate-fade-up">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary">Bookings Ledger</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Realtime customer support tickets, video diagnostic logs, and doorstep jobs.
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sunken border-b border-border font-bold text-text-muted uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Booking ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Technician</th>
                <th className="p-3.5">Device & Issue</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-sunken/40">
                  <td className="p-3.5 font-mono font-bold text-primary">{b.id}</td>
                  <td className="p-3.5 font-semibold text-text-primary">{b.customerName}</td>
                  <td className="p-3.5 text-text-secondary">{b.technician?.name || 'Unassigned'}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-text-primary">{b.deviceCategory.toUpperCase()}: </span>
                    <span className="text-text-muted line-clamp-1">{b.issueDescription}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-text-primary">₹{b.totalAmount}</td>
                  <td className="p-3.5">
                    <Badge variant={b.status === 'completed' ? 'success' : b.status === 'matched' ? 'primary' : 'warning'}>
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminSessionsScreen: React.FC = () => {
  const { bookings } = useAppState();

  return (
    <AdminLayout activePath="/admin/sessions">
      <div className="space-y-5 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-text-primary">Live Sessions Monitor</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Encrypted WebRTC peer metrics, bitrate, and active audio/video rooms in Delhi NCR.
            </p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Rooms: 12 Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-ink text-white border border-gray-800 shadow-raised space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="verified">Room #SETU-ROOM-8902</Badge>
              <span className="font-mono text-xs text-emerald-400">Duration: 04:12</span>
            </div>
            <div className="text-sm font-bold">Niladri Das ↔ Vikram Sharma</div>
            <p className="text-xs text-gray-400">Issue: MacBook Pro kernel panic and freeze troubleshooting</p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800 text-[11px] font-mono text-gray-300">
              <div>Bitrate: 1.8 Mbps</div>
              <div>Packet Loss: 0.1%</div>
              <div>Res: 1080p HD</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ink text-white border border-gray-800 shadow-raised space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="verified">Room #SETU-ROOM-7640</Badge>
              <span className="font-mono text-xs text-emerald-400">Duration: 12:45</span>
            </div>
            <div className="text-sm font-bold">Rohan Mehra ↔ Priya Nair</div>
            <p className="text-xs text-gray-400">Issue: iPhone iCloud restore loop</p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-gray-800 text-[11px] font-mono text-gray-300">
              <div>Bitrate: 2.1 Mbps</div>
              <div>Packet Loss: 0.0%</div>
              <div>Res: 1080p HD</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminPaymentsScreen: React.FC = () => {
  const { transactions } = useAppState();

  return (
    <AdminLayout activePath="/admin/payments">
      <div className="space-y-5 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-text-primary">Payments Ledger & Payouts</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Transaction breakdown: Customer paid, 20% platform commission, and 80% technician net payout.
            </p>
          </div>
          <Badge variant="verified">Razorpay Gateway Synchronized</Badge>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sunken border-b border-border font-bold text-text-muted uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Customer & Tech</th>
                <th className="p-3.5">Gross Billing</th>
                <th className="p-3.5">Platform Fee (20%)</th>
                <th className="p-3.5">Tech Payout (80%)</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-sunken/40">
                  <td className="p-3.5 font-mono font-bold text-primary">{tx.invoiceNumber}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-text-primary">{tx.customerName}</div>
                    <div className="text-[11px] text-text-muted">Tech: {tx.technicianName}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-text-primary">₹{tx.grossAmount}</td>
                  <td className="p-3.5 font-mono font-bold text-primary">₹{tx.platformCommission}</td>
                  <td className="p-3.5 font-mono font-bold text-success">₹{tx.technicianPayout}</td>
                  <td className="p-3.5 font-mono text-text-secondary">{tx.paymentMethod}</td>
                  <td className="p-3.5">
                    <Badge variant="success">Completed</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminDisputesScreen: React.FC = () => {
  const { disputes, resolveDispute } = useAppState();
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('Approved full refund to customer original payment source.');

  const selectedDispute = disputes.find((d) => d.id === activeModalId);

  return (
    <AdminLayout activePath="/admin/disputes">
      <div className="space-y-5 animate-fade-up">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary">Dispute Resolution Desk</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Handle customer refund requests for unresolved remote calls or missed technician visits.
          </p>
        </div>

        <div className="space-y-3">
          {disputes.map((dsp) => (
            <div key={dsp.id} className="p-4 rounded-xl bg-surface border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{dsp.id}</span>
                  <Badge variant={dsp.status === 'open' ? 'error' : 'success'}>
                    {dsp.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-text-muted">• {dsp.date}</span>
                </div>
                <h4 className="font-bold text-sm text-text-primary mt-1">
                  Customer: {dsp.customerName} vs Tech: {dsp.technicianName}
                </h4>
                <p className="text-xs text-text-secondary mt-1">{dsp.reason}</p>
                {dsp.resolutionNotes && (
                  <div className="mt-2 text-[11px] p-2 bg-sunken rounded border border-border text-text-muted">
                    <span className="font-semibold text-text-primary">Resolution: </span>
                    {dsp.resolutionNotes}
                  </div>
                )}
              </div>

              {dsp.status === 'open' && (
                <Button
                  size="sm"
                  onClick={() => setActiveModalId(dsp.id)}
                >
                  Review & Resolve
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Dispute Resolution Modal */}
        {selectedDispute && (
          <Modal
            isOpen={!!activeModalId}
            onClose={() => setActiveModalId(null)}
            title={`Resolve Dispute #${selectedDispute.id}`}
            description={`Claim amount: ₹${selectedDispute.claimedAmount} requested by ${selectedDispute.customerName}.`}
          >
            <div className="space-y-4 pt-2">
              <Input
                label="Resolution Notes"
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    resolveDispute(selectedDispute.id, resolutionText);
                    setActiveModalId(null);
                  }}
                >
                  Approve Refund (₹{selectedDispute.claimedAmount})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resolveDispute(selectedDispute.id, 'Dispute dismissed after reviewing call logs.');
                    setActiveModalId(null);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminCommissionScreen: React.FC = () => {
  const { addToast } = useToast();
  const [takeRate, setTakeRate] = useState(20);
  const [minRemoteRate, setMinRemoteRate] = useState(299);
  const [minVisitRate, setMinVisitRate] = useState(599);

  return (
    <AdminLayout activePath="/admin/commission">
      <div className="max-w-xl space-y-6 animate-fade-up">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary">Commission & Pricing Rules</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure marketplace split percentages, minimum floors, and surge policies.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border shadow-soft space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Standard Platform Take-Rate
              </label>
              <span className="font-mono font-bold text-primary text-base">{takeRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              value={takeRate}
              onChange={(e) => setTakeRate(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
              <span>10% (Low)</span>
              <span>20% (Standard)</span>
              <span>30% (High)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border space-y-3">
            <Input
              label="Minimum Remote Diagnostic Floor (₹)"
              type="number"
              value={minRemoteRate}
              onChange={(e) => setMinRemoteRate(Number(e.target.value))}
            />
            <Input
              label="Minimum Doorstep Inspection Floor (₹)"
              type="number"
              value={minVisitRate}
              onChange={(e) => setMinVisitRate(Number(e.target.value))}
            />
          </div>

          <Button
            size="md"
            className="w-full mt-4"
            onClick={() => addToast({ title: 'Pricing Updated', message: `Platform commission set to ${takeRate}%.`, type: 'success' })}
          >
            Save Pricing Configuration
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminSettingsScreen: React.FC = () => {
  const { addToast } = useToast();
  const [clusters, setClusters] = useState([
    { name: 'Nehru Place Hardware Hub', active: true },
    { name: 'Cyber City & DLF Phase 2, Gurgaon', active: true },
    { name: 'Sector 62 & Noida Electronic City', active: true },
    { name: 'Connaught Place & Central Delhi', active: true },
    { name: 'Saket & South Delhi Residential', active: true },
  ]);

  const toggleCluster = (idx: number) => {
    setClusters((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <AdminLayout activePath="/admin/settings">
      <div className="max-w-xl space-y-6 animate-fade-up">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary">Delhi NCR Market Launch Settings</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Active operational geographical hubs for in-person technician dispatch.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border shadow-soft space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">
            Delhi NCR Clusters
          </h4>
          {clusters.map((cluster, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sunken text-xs font-semibold">
              <span className="text-text-primary">{cluster.name}</span>
              <button
                onClick={() => toggleCluster(i)}
                className={cx(
                  'px-3 py-1 rounded-full text-xs font-bold transition-colors',
                  cluster.active ? 'bg-success text-white' : 'bg-gray-300 text-gray-700'
                )}
              >
                {cluster.active ? 'Active' : 'Paused'}
              </button>
            </div>
          ))}

          <Button
            size="md"
            className="w-full mt-4"
            onClick={() => addToast({ title: 'Clusters Saved', type: 'success' })}
          >
            Update Regional Fleet Zones
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};
