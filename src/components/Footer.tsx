import { Github, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__right">
        <a
          href="https://ekoizpen-zientifikoa.ehu.eus/investigadores/130988/detalle"
          target="_blank"
          rel="noopener noreferrer"
          className="app-footer__copyright"
        >
          © 2026 Daniel Losada
        </a>

        <div className="app-footer__icons">
          <a
            href="https://github.com/danloi2/udl"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__icon-link"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/danloi2/udl/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__icon-link"
            title="MIT License"
          >
            <Scale className="w-5 h-5" />
          </a>
        </div>
      </div>

      <style>{`
        .app-footer {
          padding: 1.5rem;
          align-items: center;
          margin-top: auto;
        }

        .app-footer__right {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-footer__copyright {
          color: #4b5563;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.025em;
          text-decoration: none;
          transition: color 0.2s;
        }

        .app-footer__copyright:hover {
          color: #111827;
        }

        .app-footer__icons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .app-footer__icon-link {
          padding: 0.375rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(4px);
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-footer__icon-link:hover {
          background: white;
          color: #111827;
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </footer>
  );
}
