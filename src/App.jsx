import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Tag,
  Bookmark,
  Sun,
  Moon,
  X,
  Network,
  RotateCcw,
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import TagModal from './components/TagModal';
import VirtualizedQuestionList from './components/VirtualizedQuestionList';
import './index.css';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('5g_qa_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('5g_qa_theme') || 'dark';
  });
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Load questions via fetch API from /question.json
  const fetchQuestions = () => {
    setIsLoading(true);
    setLoadError(null);
    fetch('/question.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: Failed to load questions`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          throw new Error('Invalid data format in question.json');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoadError(err.message || 'Failed to fetch question data');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Sync theme with DOM root and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('5g_qa_theme', theme);
  }, [theme]);

  // Sync bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('5g_qa_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarkedIds]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleBookmark = (item) => {
    const qKey = item.question;
    setBookmarkedIds((prev) =>
      prev.includes(qKey) ? prev.filter((id) => id !== qKey) : [...prev, qKey]
    );
  };

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set();
    questions.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [questions]);

  // Derive tags with frequency counts
  const allTagsWithCounts = useMemo(() => {
    const tagMap = new Map();
    questions.forEach((q) => {
      if (Array.isArray(q.tags)) {
        q.tags.forEach((tag) => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [questions]);

  // Top 10 popular tags for quick horizontal scroll bar
  const topTags = useMemo(() => {
    return allTagsWithCounts.slice(0, 12).map((t) => t.tag);
  }, [allTagsWithCounts]);

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTags([]);
    setShowBookmarksOnly(false);
  };

  // Main filter engine
  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return questions.filter((q) => {
      // 1. Bookmarks filter
      if (showBookmarksOnly && !bookmarkedIds.includes(q.question)) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }

      // 3. Tags filter (must contain ALL selected tags)
      if (selectedTags.length > 0) {
        if (!q.tags || !Array.isArray(q.tags)) return false;
        const hasAllTags = selectedTags.every((st) => q.tags.includes(st));
        if (!hasAllTags) return false;
      }

      // 4. Text search filter (matches question title or answer text)
      if (query.length > 0) {
        const titleMatch = (q.question || '').toLowerCase().includes(query);
        const answerMatch = (q.answer || '').toLowerCase().includes(query);
        const categoryMatch = (q.category || '').toLowerCase().includes(query);
        const tagMatch = q.tags
          ? q.tags.some((t) => t.toLowerCase().includes(query))
          : false;

        if (!titleMatch && !answerMatch && !categoryMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [
    questions,
    searchQuery,
    selectedCategory,
    selectedTags,
    bookmarkedIds,
    showBookmarksOnly,
  ]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedTags.length > 0 ||
    showBookmarksOnly;

  const [expandAll, setExpandAll] = useState(false);

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <Network size={22} />
            </div>
            <div>
              <h1 className="brand-title">5G Notes</h1>
              <p className="brand-subtitle">Protocol Q&A Reference</p>
            </div>
          </div>

          <div className="header-controls">
            <button
              type="button"
              className={`icon-btn ${showBookmarksOnly ? 'active' : ''}`}
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              title={showBookmarksOnly ? 'Show all questions' : 'Show bookmarked only'}
              aria-label="Bookmarks"
            >
              <Bookmark
                size={18}
                fill={showBookmarksOnly ? 'currentColor' : 'none'}
              />
            </button>

            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-container">
        {/* Controls Section */}
        <section className="controls-section">
          {/* Search Box */}
          <div className="search-box">
            <Search className="search-icon-left" size={20} />
            <input
              type="text"
              placeholder="Search by text (call flow, protocol, NGAP, RRC...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-right"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="category-select-wrapper">
              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <Layers size={14} />
            </div>

            <div className="filter-actions">
              <button
                type="button"
                className={`tag-trigger-btn ${selectedTags.length > 0 ? 'has-active' : ''}`}
                onClick={() => setIsTagModalOpen(true)}
              >
                <Tag size={16} />
                <span>Filter Tags</span>
                {selectedTags.length > 0 && (
                  <span className="active-count">{selectedTags.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* Horizontal Tags Bar */}
          <div className="tags-scroll-bar">
            {topTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`horizontal-tag ${isSelected ? 'active' : ''}`}
                  onClick={() => handleToggleTag(tag)}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* Stats Summary */}
        <div className="stats-summary">
          <span className="results-count">
            Showing {filteredQuestions.length} of {questions.length} questions
            {showBookmarksOnly ? ' (Bookmarked)' : ''}
          </span>

          <div className="quick-actions">
            <button
              type="button"
              className="text-btn"
              onClick={() => setExpandAll(!expandAll)}
            >
              {expandAll ? 'Collapse all' : 'Expand all'}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="text-btn"
                onClick={handleClearAllFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Question Cards List / Loading / Error */}
        {isLoading ? (
          <div className="empty-state">
            <div className="empty-icon loading-spin">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h3>Loading Questions...</h3>
            <p>Fetching 5G Q&A notes from server</p>
          </div>
        ) : loadError ? (
          <div className="empty-state error-state">
            <div className="empty-icon error-icon">
              <AlertCircle size={28} />
            </div>
            <h3>Error Loading Questions</h3>
            <p>{loadError}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchQuestions}
            >
              Retry
            </button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <RotateCcw size={28} />
            </div>
            <h3>No Questions Found</h3>
            <p>
              No questions matched your search criteria. Try removing filters or searching for different keywords.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClearAllFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <VirtualizedQuestionList
            questions={filteredQuestions}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onTagClick={handleToggleTag}
            selectedTags={selectedTags}
            expandAll={expandAll}
          />
        )}
      </main>

      {/* Tag Modal / Bottom Sheet */}
      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        allTagsWithCounts={allTagsWithCounts}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onClearTags={() => setSelectedTags([])}
      />
    </div>
  );
}
