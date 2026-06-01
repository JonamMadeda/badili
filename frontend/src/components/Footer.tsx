import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 opacity-80 grayscale hover:grayscale-0 transition-all duration-300" />
            <span className="text-lg font-bold text-slate-800">Badili</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://github.com/badili" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              Terms
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Badili. All rights reserved.
          </p>
          <p className="text-sm font-medium text-slate-400">
            Developed by Jonam
          </p>
        </div>
      </div>
    </footer>
  );
}
