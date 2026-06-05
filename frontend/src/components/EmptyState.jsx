export default function EmptyState({ ikon = '🛒', baslik, aciklama, cocuk }) {
  return (
    <div className="empty-state">
      <div className="icon">{ikon}</div>
      <h4>{baslik}</h4>
      {aciklama && <p>{aciklama}</p>}
      {cocuk}
    </div>
  );
}
