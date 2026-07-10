import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { MessageSquare, HelpCircle, Mail, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface SupportProps {
  setPage: (page: string) => void;
}

export const Support: React.FC<SupportProps> = ({ setPage }) => {
  const { user } = useCartStore();

  // Form states
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'ORDER' | 'CUSTOM_BUILD' | 'TECHNICAL' | 'GENERAL'>('TECHNICAL');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/v1/tickets', {
        email,
        subject,
        category,
        message,
      });

      if (res.data?.data?.ticket) {
        setSuccess('Transmission dispatched. Your request has been emailed directly to our support desk via Resend.');
        setSubject('');
        setMessage('');
        if (user) {
          // If logged in, redirect to dashboard ticket tracker
          setTimeout(() => {
            setPage('dashboard');
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Ticket error:', err);
      setError(err.response?.data?.message || 'Error submitting ticket. Please check form fields.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What is the manufacturing turnaround time for custom lamps?',
      a: 'Bespoke OLED lamps require 4-7 business days for additive thermal sintering and post-processing finishing before flight shipping.',
    },
    {
      q: 'Do you ship CAD/STL files directly for local printing?',
      a: 'Yes! Standard catalog items include downloadable STL files on their specifications tab. For custom designs, you can download verified STEP files once the engineering queue completes manufacturing.',
    },
    {
      q: 'What grade carbon fiber is used in quadcopter frames?',
      a: 'We use high-modulus Toray T700 3K matte twill carbon plates. All parts are precision CNC wet-cut to ensure micro-millimeter tolerance margins.',
    },
    {
      q: 'Can I change my custom builder lighting colors after ordering?',
      a: 'Once a build enters the MANUFACTURING phase (typically 12 hours after payment), filament layers and electronic OLED assemblies are locked. Please contact our support team immediately if you need adjustments.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen text-[#111111] pt-24 pb-16 px-6 md:px-16 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Left: FAQ list */}
        <div className="w-full md:w-1/2 flex flex-col gap-8 text-left">
          <div>
            <span className="text-[10px] text-[#0057FF] tracking-widest font-semibold uppercase">Frequently Queried Logs</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl mt-1 text-[#111111]">TECHNICAL FAQ</h1>
          </div>

          <div className="flex flex-col gap-6 mt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-5 rounded-xl border border-black/5 flex flex-col gap-2">
                <h3 className="font-display font-bold text-xs text-[#0057FF] flex items-center gap-2">
                  <HelpCircle size={14} className="shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-[11px] text-black/50 leading-relaxed pl-5 font-sans">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Submit support ticket Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-6 md:p-8 rounded-2xl border border-black/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0057FF]/5 rounded-full filter blur-[60px]" />
            
            <div className="flex flex-col gap-1 mb-6">
              <span className="text-[10px] text-[#0057FF] tracking-widest font-semibold uppercase">OPERATOR HELPDESK</span>
              <h2 className="font-display font-bold text-xl text-[#111111]">OPEN SUPPORT TICKET</h2>
            </div>

            {error && (
              <div className="p-3 bg-red-500/5 border border-red-500/25 rounded-lg flex items-start gap-2 text-xs text-red-500 mb-5">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-[#0057FF]/5 border border-[#0057FF]/20 rounded-lg flex items-start gap-2 text-xs text-[#0057FF] mb-5 animate-pulse">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-black/60">Registered Contact Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="operator@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!user}
                    className="w-full bg-white border border-black/10 rounded-lg pl-10 pr-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] disabled:opacity-50"
                  />
                  <Mail className="absolute left-3.5 top-3.5 text-black/30" size={14} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-black/60">Ticket Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="bg-white border border-black/10 rounded-lg px-3.5 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] cursor-pointer"
                >
                  <option value="TECHNICAL">TECHNICAL (Sinter arm clearances / firmware)</option>
                  <option value="ORDER">ORDER SPECIFICS (Billing / shipping)</option>
                  <option value="CUSTOM_BUILD">CUSTOM BUILDER (Logo mappings / pricing)</option>
                  <option value="GENERAL">GENERAL QUERIES</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-black/60">Ticket Subject Summary</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Brief description of requirements"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full bg-white border border-black/10 rounded-lg pl-10 pr-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF]"
                  />
                  <FileText className="absolute left-3.5 top-3.5 text-black/30" size={14} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-black/60">Detailed Message Log</label>
                <textarea
                  placeholder="Detail your request (minimum 10 characters)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] min-h-[120px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] text-white hover:bg-[#333333] py-3.5 rounded-lg text-xs font-semibold tracking-wide mt-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Transmitting logs...' : 'SUBMIT TRANSMISSION'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Support;
