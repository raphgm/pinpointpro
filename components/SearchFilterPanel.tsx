import React, { useMemo, useState } from 'react';
import type { Pin } from '../types';

interface SearchFilterPanelProps {
  pins: Pin[];
  onOpen: (id: string) => void;
}

const UNCATEGORISED = 'Uncategorised';

// Searches the user's real pins by title, content, URL and tab titles, filtered by category.
// Archived pins are left out; clicking a result opens that pin.
export default function SearchFilterPanel({ pins, onOpen }: SearchFilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activePins = useMemo(() => pins.filter((p) => !p.isArchived), [pins]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(activePins.map((p) => p.category || UNCATEGORISED))).sort()],
    [activePins],
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredPins = activePins.filter((pin) => {
    const haystack = [pin.title, pin.content, pin.url ?? '', ...(pin.tabs ?? []).map((t) => t.title ?? '')]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const matchesCategory = selectedCategory === 'All' || (pin.category || UNCATEGORISED) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search your pins by title, note, URL or tab..."
          aria-label="Search pins"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
        />
        <select
          value={selectedCategory}
          aria-label="Filter by category"
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000' }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Results ({filteredPins.length})</h3>
        {filteredPins.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>{activePins.length === 0 ? 'You have no pins yet.' : 'No pins match your search.'}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredPins.map((pin) => (
              <li key={pin.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <button
                  type="button"
                  onClick={() => onOpen(pin.id)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <strong style={{ fontSize: '1.1em' }}>{pin.title}</strong>
                  <div style={{ marginTop: '5px' }}>
                    <span style={{ fontSize: '0.8em', background: '#e0e0e0', color: '#000', padding: '3px 8px', borderRadius: '12px', marginRight: '5px' }}>
                      {pin.category || UNCATEGORISED}
                    </span>
                    <span style={{ fontSize: '0.8em', color: '#4dabff', marginRight: '5px' }}>#{pin.type}</span>
                    {pin.isPinned && <span style={{ fontSize: '0.8em', color: '#fbbf24' }}>pinned</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
