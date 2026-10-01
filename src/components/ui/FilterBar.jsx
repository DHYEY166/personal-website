export default function FilterBar({ categories, active, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className="filter-tab"
          aria-pressed={cat === active}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
