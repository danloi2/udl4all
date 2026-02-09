import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight, Scale } from 'lucide-react';
import pkg from '../../package.json';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useUDLData } from '../contexts/UDLDataContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import questions from '../data/json/home-questions.json';

export default function Home() {
  const { language, t } = useLanguage();
  const ui = useUI();
  const { udlData } = useUDLData();

  const [displayedText, setDisplayedText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutRef = useRef<any>(null);
  const cursorIntervalRef = useRef<any>(null);

  // Reactively derive themes from udl-core.json data
  const themeMap = udlData.networks.reduce(
    (acc, network) => {
      const pId = network.principle.id;
      acc[pId] = { color: network.color || '#000000' };
      return acc;
    },
    {} as Record<string, { color: string }>
  );

  const [currentTheme, setCurrentTheme] = useState({ color: '#078743' });

  const getRandomQuestionIndex = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === currentQuestionIndex && questions.length > 1);
    return newIndex;
  };

  const typeWriterLoop = async () => {
    const questionIndex = getRandomQuestionIndex();
    setCurrentQuestionIndex(questionIndex);

    const question = questions[questionIndex];
    if (question.principle && themeMap[question.principle]) {
      setCurrentTheme(themeMap[question.principle]);
    }

    const fullText = t(question);
    setIsTyping(true);
    setDisplayedText('');

    // Type out
    for (let i = 0; i < fullText.length; i++) {
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, 20 + Math.random() * 30);
      });
      setDisplayedText(fullText.slice(0, i + 1));
    }

    setIsTyping(false);
    await new Promise((r) => {
      timeoutRef.current = setTimeout(r, 4500);
    });

    // Delete
    setIsTyping(true);
    for (let i = fullText.length; i > 0; i--) {
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, 10);
      });
      setDisplayedText(fullText.slice(0, i - 1));
    }
    setIsTyping(false);
    await new Promise((r) => {
      timeoutRef.current = setTimeout(r, 600);
    });

    typeWriterLoop();
  };

  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    typeWriterLoop();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, []);

  // Update text when language changes (if not typing)
  useEffect(() => {
    if (!isTyping && currentQuestionIndex !== -1) {
      setDisplayedText(t(questions[currentQuestionIndex]));
    }
  }, [language]);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-1000 theme-bg-gradient"
      style={
        {
          '--theme-color': currentTheme.color,
          '--theme-color-5': `${currentTheme.color}0D`,
          '--theme-color-10': `${currentTheme.color}1A`,
        } as React.CSSProperties
      }
    >
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-end">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 max-w-5xl relative z-10">
        <div className="min-h-[300px] flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl md:leading-tight font-black text-gray-800 tracking-tight drop-shadow-xs text-center">
            {displayedText}
            <span
              className={`theme-caret inline-block w-[3px] md:w-[5px] h-[30px] md:h-[48px] ml-1 align-middle ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-100`}
            ></span>
          </h1>
        </div>

        <div className="mt-20 flex justify-center fade-in">
          <Link
            to="/model"
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:brightness-110 hover:-translate-y-1 transition-all duration-300 theme-button"
          >
            <span>{ui.readyToTeach}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/30 blur-3xl mix-blend-overlay animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white/20 blur-3xl mix-blend-overlay"></div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center z-50">
        {/* Left: Branding & Version Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center font-black tracking-tight text-xl logo-elegant-hover transition-all duration-300">
            <span style={{ color: '#078743' }}>udl</span>
            <span style={{ color: '#831682' }}>4</span>
            <span style={{ color: '#295e86' }}>all</span>
          </div>
          <span className="px-2 py-0.5 bg-white/50 backdrop-blur-md text-gray-900 font-black text-[10px] rounded-md border border-white/40 shadow-sm uppercase tracking-tighter">
            v{pkg.version}
          </span>
        </div>

        {/* Right: Copyright & GitHub/License Icons */}
        <div className="flex items-center gap-4 text-gray-700 text-[11px] font-bold">
          <a
            href="https://ekoizpen-zientifikoa.ehu.eus/investigadores/130988/detalle"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block tracking-wide uppercase hover:text-black hover:underline transition-all"
          >
            © 2026 Daniel Losada
          </a>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/danloi2/udl/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/40 backdrop-blur-md rounded-full border border-white/30 shadow-xs hover:bg-white/60 hover:scale-110 hover:shadow-md transition-all duration-300 group"
              title="MIT License"
            >
              <Scale className="w-5 h-5 text-gray-800 group-hover:text-black transition-colors" />
            </a>

            <a
              href="https://github.com/danloi2/udl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/40 backdrop-blur-md rounded-full border border-white/30 shadow-xs hover:bg-white/60 hover:scale-110 hover:shadow-md transition-all duration-300 group"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5 text-gray-800 group-hover:text-black transition-colors" />
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        .theme-bg-gradient {
          background-image: linear-gradient(to bottom right, var(--theme-color-5), var(--theme-color-10), var(--theme-color-5));
        }
        .theme-button {
          background-color: var(--theme-color);
        }
        .theme-caret {
          background-color: var(--theme-color);
        }
        .fade-in {
          animation: fadeIn 1s ease-out;
        }
        .logo-elegant-hover:hover {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
          transform: scale(1.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
