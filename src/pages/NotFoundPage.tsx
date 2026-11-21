import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="container" style={{ paddingBlock: 96, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <h1 className="display" style={{ fontSize: 44 }}>تاهت المركبة!</h1>
      <p className="soft" style={{ fontSize: 19 }}>لم نجد هذه الصفحة. لنعد إلى خريطة الكواكب.</p>
      <Link to="/map" className="btn btn-primary">إلى الخريطة</Link>
    </section>
  );
}
