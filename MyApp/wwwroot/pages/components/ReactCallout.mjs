export default {
    template:`
<section class="not-prose py-20">
    <div class="w-full">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-900 shadow-xl ring-1 ring-white/10">
            
            <!-- React Logo Watermark -->
            <svg class="absolute -right-20 -top-20 h-[400px] w-[400px] text-cyan-500/10 animate-[spin_60s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="12" cy="12" r="2"></circle>
                <ellipse rx="10" ry="4.5" transform="rotate(60 12 12)"></ellipse>
                <ellipse rx="10" ry="4.5" transform="rotate(120 12 12)"></ellipse>
                <ellipse rx="10" ry="4.5"></ellipse>
            </svg>

            <div class="relative px-6 py-10 sm:px-10 lg:px-12">
                <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    AI-Ready React templates <span class="text-cyan-400">on a robust .NET backend</span>
                </h2>
                <p class="mt-4 max-w-2xl text-blue-100/80 text-sm sm:text-base">
                    Combine the React ecosystem with ServiceStack's feature-rich backend. 
                    Experience end-to-end type safety and declarative APIs in a frictionless environment.
                </p>
                
                <dl class="mt-8 grid gap-6 sm:grid-cols-3">
                    <!-- Item 1 -->
                    <div class="flex flex-col bg-white/5 p-5 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <dt class="font-semibold text-white">
                            <span class="block text-cyan-400 font-mono text-xs mb-1 opacity-70">01</span>
                            AI Ready
                        </dt>
                        <dd class="mt-2 text-sm text-blue-100/70 leading-relaxed">
                            Start from well-known React templates tuned for rich, data-driven and AI-assisted user interfaces.
                        </dd>
                    </div>
                    
                    <!-- Item 2 -->
                    <div class="flex flex-col bg-white/5 p-5 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <dt class="font-semibold text-white">
                            <span class="block text-cyan-400 font-mono text-xs mb-1 opacity-70">02</span>
                            End-to-end Type Safety
                        </dt>
                        <dd class="mt-2 text-sm text-blue-100/70 leading-relaxed">
                            Share DTOs between .NET and React for confident refactors without context switching.
                        </dd>
                    </div>
                    
                    <!-- Item 3 -->
                    <div class="flex flex-col bg-white/5 p-5 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <dt class="font-semibold text-white">
                            <span class="block text-cyan-400 font-mono text-xs mb-1 opacity-70">03</span>
                            Zero-Ambiguity APIs
                        </dt>
                        <dd class="mt-2 text-sm text-blue-100/70 leading-relaxed">
                            Consistent API integrations eliminates guesswork, giving AI the perfect context to generate accurate features.
                        </dd>
                    </div>
                </dl>

                <div class="mt-8 flex flex-wrap gap-3">
                    <a href="https://react.servicestack.net"
                       class="inline-flex items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-bold text-blue-950 shadow-sm hover:bg-cyan-400 transition-colors">
                        React Component Gallery
                    </a>
                    <a href="https://react-templates.net/docs"
                       class="inline-flex items-center justify-center rounded-md bg-blue-950/50 px-4 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-inset ring-cyan-500/30 hover:bg-blue-900 hover:ring-cyan-500/50 transition-all">
                        Read the Docs
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
    `,
}