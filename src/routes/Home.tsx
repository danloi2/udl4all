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
  
  // Refs para control de procesos
  const timeoutRef = useRef<any>(null);
  const cursorIntervalRef = useRef<any>(null);
  const isMounted = useRef(true);
  
  // Ref CRÍTICO: Mantiene siempre la versión más fresca de la función 't'
  // Esto evita que el bucle se quede "atrapado" con el idioma antiguo.
  const tRef = useRef(t);

  // Actualizamos tRef cada vez que cambia el idioma
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Mapeo de temas corregido con tipos para TS
  const themeMap = udlData.networks.reduce(
    (acc: Record<string, { color: string }>, network: any) => {
      const pId = network.principle.id;
      acc[pId] = { color: network.color || '#000000' };
      return acc;
    },
    {} as Record<string, { color: string }>
  );

  const [currentTheme, setCurrentTheme] = useState({ color: '#078743' });

  const getRandomQuestionIndex = (prevIndex: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === prevIndex && questions.length > 1);
    return newIndex;
  };

  const typeWriterLoop = async () => {
    if (!isMounted.current) return;

    const questionIndex = getRandomQuestionIndex(currentQuestionIndex);
    setCurrentQuestionIndex(questionIndex);

    const question = questions[questionIndex];
    if (question.principle && themeMap[question.principle]) {
      setCurrentTheme(themeMap[question.principle]);
    }

    // USAMOS tRef.current AQUÍ:
    // Esto asegura que cogemos la traducción del idioma ACTUAL, no del viejo.
    const fullText = tRef.current(question);
    
    setIsTyping(true);
    setDisplayedText('');

    // --- Escribir ---
    for (let i = 0; i <= fullText.length; i++) {
      if (!isMounted.current) return;
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, 20 + Math.random() * 30);
      });
      // Volvemos a chequear si se desmontó durante la espera
      if (!isMounted.current) return;
      setDisplayedText(fullText.slice(0, i));
    }

    setIsTyping(false);
    
    // Espera con la frase completa
    await new Promise((r) => {
      timeoutRef.current = setTimeout(r, 4500);
    });

    if (!isMounted.current) return;

    // --- Borrar ---
    setIsTyping(true);
    for (let i = fullText.length; i >= 0; i--) {
      if (!isMounted.current) return;
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, 10);
      });
      if (!isMounted.current) return;
      setDisplayedText(fullText.slice(0, i));
    }
    
    setIsTyping(false);
    
    await new Promise((r) => {
      timeoutRef.current = setTimeout(r, 600);
    });

    // Llamada recursiva
    if (isMounted.current) {
      typeWriterLoop();
    }
  };

  // Efecto de inicio (Mount/Unmount)
  useEffect(() => {
    isMounted.current = true;
    
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    typeWriterLoop();

    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, []);

  // Efecto para cambiar el texto INSTANTÁNEAMENTE si cambiamos de idioma
  // mientras la frase está quieta (no escribiéndose/borrándose)
  useEffect(() => {
    if (!isTyping && currentQuestionIndex !== -1) {
      setDisplayedText(t(questions[currentQuestionIndex]));
    }
  }, [language, t]);

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

      <footer className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end z-50">
        <div className="flex flex-col items-start leading-none gap-1.5">
          <div className="flex items-center font-black tracking-tighter text-2xl logo-elegant-hover transition-all duration-300">
            <span style={{ color: '#078743' }}>udl</span>
            <span style={{ color: '#831682' }}>4</span>
            <span style={{ color: '#295e86' }}>all</span>
          </div>
          <span className="px-1.5 py-0.5 border font-black text-xs rounded-sm uppercase tracking-widest flex items-center justify-center transition-all duration-300 version-badge-dynamic shadow-sm">
            v{pkg.version}
          </span>
        </div>

        <div className="flex flex-col items-end leading-none gap-1.5">
          <a
            href="https://ekoizpen-zientifikoa.ehu.eus/investigadores/130988/detalle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 text-base font-bold tracking-wider hover:text-black transition-all"
          >
            © 2026 Daniel Losada
          </a>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/danloi2/udl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white/40 backdrop-blur-md rounded-full border border-white/30 shadow-xs hover:bg-white/60 hover:scale-110 hover:shadow-md transition-all duration-300 group"
              title="GitHub Repository"
            >
              <Github className="w-6 h-6 text-gray-800 group-hover:text-black transition-colors" />
            </a>
            <a
              href="https://github.com/danloi2/udl/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white/40 backdrop-blur-md rounded-full border border-white/30 shadow-xs hover:bg-white/60 hover:scale-110 hover:shadow-md transition-all duration-300 group"
              title="MIT License"
            >
              <Scale className="w-6 h-6 text-gray-800 group-hover:text-black transition-colors" />
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
        @keyframes badge-cycle {
          0%, 100% { 
            background-color: rgba(7, 135, 67, 0.1); 
            border-color: rgba(7, 135, 67, 0.4); 
            color: #078743;
          }
          33% { 
            background-color: rgba(131, 22, 130, 0.1); 
            border-color: rgba(131, 22, 130, 0.4); 
            color: #831682;
          }
          66% { 
            background-color: rgba(41, 94, 134, 0.1); 
            border-color: rgba(41, 94, 134, 0.4); 
            color: #295e86;
          }
        }
        .version-badge-dynamic {
          animation: badge-cycle 9s infinite linear;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}