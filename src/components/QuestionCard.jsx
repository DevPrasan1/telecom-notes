import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Bookmark, Tag, Share2, Check } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function QuestionCard({
  item,
  index,
  isBookmarked,
  onToggleBookmark,
  onTagClick,
  selectedTags = [],
  forceExpanded,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (typeof forceExpanded === 'boolean') {
      setIsExpanded(forceExpanded);
    }
  }, [forceExpanded]);

  // Clean title (remove leading '## ' if present)
  const cleanQuestion = (item.question || '').replace(/^##\s*/, '');

  const handleCopyQuestion = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${cleanQuestion}\n\n${item.answer}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <article className={`question-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <header className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-meta">
          <span className="card-number">#{index + 1}</span>
          {item.category && <span className="category-badge">{item.category}</span>}
        </div>

        <h2 className="question-title">
          {cleanQuestion}
        </h2>

        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`action-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => onToggleBookmark(item)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
            aria-label="Bookmark"
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            className="action-btn copy-q-btn"
            onClick={handleCopyQuestion}
            title="Copy Q&A text"
            aria-label="Copy Q&A text"
          >
            {copiedLink ? <Check size={18} className="success-icon" /> : <Share2 size={18} />}
          </button>

          <button
            type="button"
            className="action-btn toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse answer' : 'Expand answer'}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </header>

      {/* Tags section */}
      {item.tags && item.tags.length > 0 && (
        <div className="card-tags">
          <Tag size={13} className="tag-icon" />
          <div className="tags-list">
            {item.tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`card-tag-pill ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer content */}
      {isExpanded && (
        <div className="card-body">
          <MarkdownRenderer content={item.answer} />
        </div>
      )}
    </article>
  );
}
