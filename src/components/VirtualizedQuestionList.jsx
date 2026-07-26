import { useRef, useEffect } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import QuestionCard from './QuestionCard';

export default function VirtualizedQuestionList({
  questions,
  bookmarkedIds,
  onToggleBookmark,
  onTagClick,
  selectedTags,
  expandAll,
}) {
  const listRef = useRef(null);

  const virtualizer = useWindowVirtualizer({
    count: questions.length,
    estimateSize: () => 120,
    overscan: 6,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  // Remeasure list when expandAll or questions change
  useEffect(() => {
    virtualizer.measure();
  }, [expandAll, questions, virtualizer]);

  return (
    <div
      ref={listRef}
      className="virtual-list-container"
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const item = questions[virtualRow.index];
        if (!item) return null;

        return (
          <div
            key={item.question || virtualRow.index}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className="virtual-item-wrapper"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${
                virtualRow.start - virtualizer.options.scrollMargin
              }px)`,
              paddingBottom: '16px',
            }}
          >
            <QuestionCard
              item={item}
              index={virtualRow.index}
              isBookmarked={bookmarkedIds.includes(item.question)}
              onToggleBookmark={onToggleBookmark}
              onTagClick={onTagClick}
              selectedTags={selectedTags}
              forceExpanded={expandAll}
            />
          </div>
        );
      })}
    </div>
  );
}
