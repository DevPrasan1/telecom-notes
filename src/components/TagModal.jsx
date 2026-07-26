import { useState } from 'react';
import { X, Search, Tag, Check } from 'lucide-react';

export default function TagModal({
  isOpen,
  onClose,
  allTagsWithCounts,
  selectedTags,
  onToggleTag,
  onClearTags,
}) {
  const [tagSearch, setTagSearch] = useState('');

  if (!isOpen) return null;

  const filteredTags = allTagsWithCounts.filter(({ tag }) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container tag-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Tag size={20} className="accent-icon" />
            <h3>Filter by Tags</h3>
            {selectedTags.length > 0 && (
              <span className="selected-count-badge">
                {selectedTags.length} active
              </span>
            )}
          </div>
          <button
            type="button"
            className="icon-btn modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            autoFocus
          />
          {tagSearch && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setTagSearch('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="tags-grid-container">
          {filteredTags.length === 0 ? (
            <div className="no-tags-found">No tags matching "{tagSearch}"</div>
          ) : (
            filteredTags.map(({ tag, count }) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`tag-pill-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggleTag(tag)}
                >
                  <span className="tag-name">{tag}</span>
                  <span className="tag-count">{count}</span>
                  {isSelected && <Check size={14} className="tag-check" />}
                </button>
              );
            })
          )}
        </div>

        <div className="modal-footer">
          {selectedTags.length > 0 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClearTags}
            >
              Clear All ({selectedTags.length})
            </button>
          ) : (
            <span className="footer-hint">Select tags to filter questions</span>
          )}
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
