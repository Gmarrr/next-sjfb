// Ported from the "Apply / Careers" panel in contact.php (static content).
export default function CareerPanel() {
  return (
    <>
      {/* ── HR Branding Header ── */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="h-px w-16 bg-orange-500"></span>
                    <span className="size-1.5 rounded-full bg-orange-500"></span>
                    <span className="h-px w-16 bg-orange-500"></span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-extrabold text-emerald-950 tracking-tight mb-2">HR BRANDING</h2>
                  <p className="text-sm md:text-base font-medium text-gray-500">
                    <span className="text-emerald-900 font-semibold">Built on Trust.</span>
                    <span className="text-orange-600 font-semibold">Strengthened by People.</span>
                    <span className="text-emerald-900 font-semibold">Defined by Legacy.</span>
                  </p>
                </div>

                {/* ── Two Column Cards ── */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                  {/* WHO WE ARE */}
                  <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                    <div className="flex items-center gap-3 bg-emerald-950 px-5 py-4">
                      <div className="size-9 rounded-full bg-emerald-900 border-2 border-emerald-700 flex items-center justify-center shrink-0">
                        <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                      </div>
                      <h3 className="text-white font-bold text-sm tracking-wide">WHO WE ARE</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-emerald-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">A <strong className="text-emerald-950">stable</strong> and <strong className="text-emerald-950">resilient</strong> organization</p>
                      </div>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-emerald-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4.13a4 4 0 100-8 4 4 0 000 8zm7 4c1.66 0 3-1.34 3-3a3 3 0 00-3-3m-14 0a3 3 0 00-3 3c0 1.66 1.34 3 3 3" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">Employees who are <strong className="text-emerald-950">pioneers</strong> — many have stayed with us for <strong className="text-emerald-950">over 30 years</strong></p>
                      </div>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-emerald-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 16.5 4 10.5C4 7.42 6.42 5 9.5 5C11.04 5 12.5 5.8 13.4 7.05C14.3 5.8 15.75 5 17.29 5C20.37 5 22.79 7.42 22.79 10.5C22.79 16.5 14.79 21 14.79 21H12Z" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5"><strong className="text-emerald-950">No layoffs</strong> even during the pandemic, because we value people beyond circumstances</p>
                      </div>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-emerald-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804zM15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">A workplace where careers last, with many employees proudly retiring at ages <strong className="text-emerald-950">60–65</strong></p>
                      </div>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-emerald-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">A company that believes in recognizing potential and <strong className="text-emerald-950">promoting from within</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* WHAT WE WANT TO BE */}
                  <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                    <div className="flex items-center gap-3 bg-orange-600 px-5 py-4">
                      <div className="size-9 rounded-full bg-orange-500 border-2 border-orange-300 flex items-center justify-center shrink-0">
                        <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                      </div>
                      <h3 className="text-white font-bold text-sm tracking-wide">WHAT WE WANT TO BE</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">A <strong className="text-orange-600">fun</strong> and <strong className="text-orange-600">engaging</strong> place to work</p>
                      </div>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9-9v9m0 9H3m11 0h5m-5 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">A workplace that feels like a <strong className="text-orange-600">second home</strong> — supportive, warm, and welcoming</p>
                      </div>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className="size-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                          <svg className="size-4 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pt-1.5">A culture where people <strong className="text-orange-600">grow, belong</strong>, and <strong className="text-orange-600">thrive</strong> together</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── HR Brand Promise Banner ── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 to-emerald-900 px-6 md:px-8 py-6 mb-10">
                  <svg className="absolute right-0 bottom-0 h-full opacity-15" viewBox="0 0 200 100" fill="none" preserveAspectRatio="xMaxYMax meet">
                    <path d="M10 80 L60 60 L110 75 L160 55 L195 65 L195 100 L10 100 Z" fill="white" />
                  </svg>
                  <div className="relative flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                    <div className="size-16 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0">
                      <svg className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 16.5 4 10.5C4 7.42 6.42 5 9.5 5C11.04 5 12.5 5.8 13.4 7.05C14.3 5.8 15.75 5 17.29 5C20.37 5 22.79 7.42 22.79 10.5C22.79 16.5 14.79 21 14.79 21H12Z" /></svg>
                    </div>
                    <div>
                      <span className="inline-block bg-orange-500 text-white text-[0.65rem] font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-2">Our HR Brand Promise</span>
                      <p className="text-lg md:text-xl font-extrabold text-white leading-tight">
                        Where <span className="text-orange-500">Careers</span> Last. Where <span className="text-orange-500">People Belong</span>.
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        Stability is not just our message — it is <strong className="text-white">our track record</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Hiring / Contact Card ── */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="size-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <svg className="size-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-gray-900 mb-1">We're always looking for people who stay.</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        We don't have a long list of open roles posted here — that's on purpose. We hire in small numbers, when we know a role is a real, lasting fit, not just a seat to fill.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-extrabold text-emerald-950">30+</div>
                      <div className="text-xs text-gray-500 mt-1">years, our longest-tenured teammates</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-extrabold text-emerald-950">0</div>
                      <div className="text-xs text-gray-500 mt-1">layoffs, even through the pandemic</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-extrabold text-emerald-950">60–65</div>
                      <div className="text-xs text-gray-500 mt-1">the age many of our team retire at, with us</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      If that sounds like the kind of place you want to build a career, not just take a job, send us your resume and a short note about what you're looking for. Our HR team reads every message personally.
                    </p>
                    <a href="mailto:hrd@fishbrokers.net?subject=Job%20Application%20-%20St.%20Joseph%20Fish%20Brokerage" className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-orange-600/25">
                      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Email hrd@fishbrokers.net
                    </a>
                    <p className="text-xs text-gray-400 mt-3">We typically respond within 3–5 business days.</p>
                  </div>
                </div>
    </>
  );
}
