import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, MessageSquare, 
  Send, Clock, CheckCircle2, Zap 
} from 'lucide-react';
import { generateWhatsAppDirectUrl } from '../utils/notifications';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [voltage, setVoltage] = useState('48V');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const directWaUrl = generateWhatsAppDirectUrl(
    '+919820012345',
    'Hello SmartVolt Team, I would like to consult with an electrical engineer regarding battery and power equipment sizing for my project.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
          <Zap className="w-3.5 h-3.5" />
          <span>Technical Support & Custom Engineering Sizing</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Contact SmartVolt Engineers</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Need a custom battery pack configuration, assistance sizing your solar inverter, or verification of an industrial electrical load? Our in-house engineering team is available 6 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Info & Direct WhatsApp CTA */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
              Direct Engineering Hotlines
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Phone Consultation</span>
                  <span className="text-slate-400 font-mono">+91 98200 12345 / 022 2839 4400</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mon - Sat: 9:00 AM – 7:30 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Official WhatsApp Business</span>
                  <span className="text-slate-400 font-mono">+91 98200 12345</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Quick specs sizing & invoice re-sending</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Engineering Email</span>
                  <span className="text-slate-400 font-mono">support@smartvolt.in</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Technical datasheets & bulk supply RFQs</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Experience & Pickup Center</span>
                  <p className="text-slate-400 leading-relaxed">
                    SmartVolt Energy Park, Plot 14, MIDC Industrial Area, Central Road, Andheri East, Mumbai, Maharashtra 400069
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-2 border-t border-slate-800">
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly with an Engineer</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right: Technical Inquiry Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Submit Custom Electrical Sizing Query</h2>
            <p className="text-xs text-slate-400 mt-1">
              Have a custom voltage rail, marine battery requirement or off-grid solar installation? Tell us your parameters.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-center space-y-2 text-emerald-300">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="font-bold text-sm">Inquiry Dispatched Successfully!</p>
              <p className="text-xs text-slate-400">Our electrical engineering team will contact your WhatsApp within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target System Voltage</label>
                  <select
                    value={voltage}
                    onChange={e => setVoltage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="12V">12V / 12.8V DC</option>
                    <option value="24V">24V DC</option>
                    <option value="48V">48V DC (Standard Telecom/Solar)</option>
                    <option value="72V">72V DC (EV Motor)</option>
                    <option value="230V">230V AC Inverter</option>
                    <option value="Custom">Custom High Voltage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Details & Load Watts</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your load equipment, desired runtime hours, installation location and any constraints..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-sky-950"
              >
                <Send className="w-4 h-4" />
                <span>Submit Technical Request</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
