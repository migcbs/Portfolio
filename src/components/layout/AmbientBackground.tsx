export function AmbientBackground({ backgroundUrl }: { backgroundUrl?: string | null }) {
  return (
    <div className="ambient-bg" aria-hidden="true">
      {backgroundUrl ? (
        <div className="ambient-bg-photo" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      ) : (
        <div className="ambient-bg-stars" />
      )}
      <div className="ambient-bg-glow" />
    </div>
  );
}
