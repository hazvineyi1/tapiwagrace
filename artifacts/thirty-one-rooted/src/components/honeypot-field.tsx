/**
 * A decoy field. Automated submissions fill in everything they find; people
 * never see this one, and assistive technology never reaches it.
 *
 * It is moved off-screen rather than `display: none`, because some bots skip
 * fields that are explicitly hidden.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
