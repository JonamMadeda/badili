import Header from '../components/Header';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

interface LandingPageProps {
  onStart: () => void;
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 text-base leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header onHome={() => {}} />

      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Badili is now live
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl">
            Markdown to PDF, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">
              beautifully simple.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
            Write or paste your markdown, see the live preview, and download a professionally formatted PDF document instantly. No sign-up required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button onClick={onStart} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Open Editor
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <a
              href="#features"
              className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Minimal Features Section */}
        <section id="features" className="w-full bg-white border-t border-slate-200/50 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="⚡"
                title="Instant Preview"
                description="See your document render in real-time. What you see is exactly what you get in the final PDF."
              />
              <FeatureCard
                icon="🎨"
                title="Professional Styling"
                description="Built-in typography defaults ensure your documents look clean, modern, and ready for publication."
              />
              <FeatureCard
                icon="🔒"
                title="100% Private"
                description="Your markdown is processed securely. No documents are saved or stored on our servers."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
