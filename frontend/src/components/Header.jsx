import { Bell, ChevronRight } from 'lucide-react';

const pageInfo = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your retail sales performance', breadcrumb: ['Dashboard'] },
  upload: { title: 'Upload & Data Cleaning', subtitle: 'Import your sales data and prepare it for intelligent insights', breadcrumb: ['Dashboard', 'Upload & Data Cleaning'] },
  trends: { title: 'Trends', subtitle: 'Analyze sales patterns and product performance over time', breadcrumb: ['Dashboard', 'Trends'] },
  segments: { title: 'Customer Segments', subtitle: 'Discover customer behavior and segment insights', breadcrumb: ['Dashboard', 'Segments'] },
  assistant: { title: 'AI Assistant', subtitle: 'Get intelligent insights powered by your data', breadcrumb: ['Dashboard', 'AI Assistant'] },
};

export default function Header({ currentView }) {
  const info = pageInfo[currentView] || pageInfo.dashboard;

  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1.5rem 2rem',
      marginLeft: '280px',
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            {info.breadcrumb.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: idx === info.breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                  {item}
                </span>
                {idx < info.breadcrumb.length - 1 && <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />}
              </div>
            ))}
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{info.title}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{info.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)',
          }}>
            <Bell size={18} />
          </button>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '0.875rem',
          }}>
            A
          </div>
        </div>
      </div>
    </header>
  );
}
