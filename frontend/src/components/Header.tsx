import Logo from './Logo';

interface HeaderProps {
  onHome: () => void;
}

export default function Header({ onHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Go to home page"
          >
            <Logo />
            <span className="text-xl font-bold text-foreground">Badili</span>
          </button>
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com/badili"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-foreground transition-colors"
              aria-label="GitHub repository"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
