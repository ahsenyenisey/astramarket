export default function StatusIndicator({ label = 'SISTEM AKTIF', renk = 'yesil' }) {
  return (
    <span className={`status-ind status-${renk}`}>
      <span className="status-nokta" />
      <span className="status-txt">{label}</span>
    </span>
  );
}
