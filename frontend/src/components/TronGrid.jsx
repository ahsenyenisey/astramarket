export default function TronGrid({ tepede = false }) {
  return (
    <div className={`tron-grid ${tepede ? 'tepede' : ''}`} aria-hidden="true">
      <div className="tron-grid-icerik">
        <div className="tron-yatay" />
        <div className="tron-dikey" />
      </div>
      <div className="tron-fade" />
    </div>
  );
}
