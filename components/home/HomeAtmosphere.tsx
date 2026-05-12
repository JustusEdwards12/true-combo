/**
 * Decorative homepage layers only. All motion respects `.tc-anim-*` + prefers-reduced-motion in globals.css.
 */
export function HomeAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 min-h-full overflow-hidden"
      aria-hidden
    >
      <div className="tc-bg-base absolute inset-0" />
      <div className="tc-bg-aurora tc-anim-aurora absolute inset-0" />
      <div className="tc-bg-mesh absolute inset-0 opacity-80" />
      <div className="tc-bg-stage-lines absolute inset-0" />
      <div className="tc-bg-scan tc-anim-scan absolute inset-0" />
      <div className="tc-particles tc-anim-float absolute inset-0">
        <span className="tc-particle" />
        <span className="tc-particle" />
        <span className="tc-particle" />
        <span className="tc-particle" />
        <span className="tc-particle" />
        <span className="tc-particle" />
      </div>
      <div className="tc-bg-vignette absolute inset-0" />
    </div>
  );
}
