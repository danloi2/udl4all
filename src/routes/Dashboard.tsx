import { Link } from 'react-router-dom';
import { LayoutGrid, BookOpen, PlayCircle, Search } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Dashboard() {
  const ui = useUI();

  const cards = [
    {
      label: ui.dashModelUdl,
      description: ui.dashModelUdlDesc,
      to: '/model',
      icon: LayoutGrid,
      color: '#078743',
      gradient: 'linear-gradient(135deg, #078743 0%, #0a9e50 100%)',
      printOrientation: 'portrait',
    },
    {
      label: ui.dashActivities,
      description: ui.dashActivitiesDesc,
      to: '/activities',
      icon: BookOpen,
      color: '#831682',
      gradient: 'linear-gradient(135deg, #831682 0%, #a01d9f 100%)',
    },
    {
      label: ui.dashVideos,
      description: ui.dashVideosDesc,
      to: '/videos',
      icon: PlayCircle,
      color: '#295e86',
      gradient: 'linear-gradient(135deg, #295e86 0%, #3578a8 100%)',
    },
    {
      label: ui.dashSearch,
      description: ui.dashSearchDesc,
      to: '/explore',
      icon: Search,
      color: '#475569',
      gradient: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
    },
  ];

  return (
    <div className="dashboard">
      <Header />

      {/* Grid of 4 cards */}
      <div className="dashboard__grid">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="dashboard__card"
            style={
              {
                '--card-color': card.color,
                '--card-gradient': card.gradient,
              } as React.CSSProperties
            }
          >
            <div className="dashboard__card-icon">
              <card.icon strokeWidth={1.5} />
            </div>
            <h2 className="dashboard__card-label">{card.label}</h2>
            <p className="dashboard__card-desc">{card.description}</p>
          </Link>
        ))}
      </div>

      <Footer />

      <style>{`
        .dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
          box-sizing: border-box;
        }

        /* Grid */
        .dashboard__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(1rem, 2vw, 1.5rem);
          width: 100%;
          max-width: 700px;
          margin: auto;
          padding: 2rem;
          box-sizing: border-box;
        }

        .dashboard__card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 2rem);
          border-radius: 20px;
          background: white;
          border: 2px solid #e2e8f0;
          text-decoration: none;
          color: #334155;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .dashboard__card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--card-gradient);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 18px;
        }

        .dashboard__card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: var(--card-color);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px var(--card-color);
        }

        .dashboard__card:hover::before {
          opacity: 1;
        }

        .dashboard__card:hover .dashboard__card-icon,
        .dashboard__card:hover .dashboard__card-label,
        .dashboard__card:hover .dashboard__card-desc {
          color: white;
          position: relative;
          z-index: 1;
        }

        .dashboard__card:active {
          transform: translateY(-2px) scale(0.98);
        }

        .dashboard__card-icon {
          width: clamp(2.5rem, 6vw, 4rem);
          height: clamp(2.5rem, 6vw, 4rem);
          color: var(--card-color);
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }

        .dashboard__card-icon svg {
          width: 100%;
          height: 100%;
        }

        .dashboard__card-label {
          font-size: clamp(1rem, 2.5vw, 1.375rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.375rem 0;
          color: #1e293b;
          transition: color 0.3s ease;
        }

        .dashboard__card-desc {
          font-size: clamp(0.7rem, 1.5vw, 0.8rem);
          color: #64748b;
          line-height: 1.4;
          margin: 0;
          transition: color 0.3s ease;
          max-width: 220px;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .dashboard__grid {
            gap: 0.75rem;
            padding: 1rem;
          }
          .dashboard__card {
            padding: 1.25rem 0.75rem;
          }
          .dashboard__card-desc {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
