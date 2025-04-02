import React, { CSSProperties, ForwardedRef, ReactNode, forwardRef } from 'react';
import { FixedHeaderContent, TableVirtuoso } from 'react-virtuoso';
import './_table-virtuoso.scoped.scss';

const Table = (props, style) => (
  <table
    {...props}
    style={style}
  />
);
const TableFoot = forwardRef((props, ref: ForwardedRef<HTMLTableSectionElement>) => (
  <tfoot
    {...props}
    ref={ref}
  />
));

export default function TableVirtuosoReact({
  styles,
  className,
  headerContent,
  itemContent,
  data,
  endReached,
  loadingState,
  footer,
}: {
  styles?: CSSProperties;
  className?: string;
  headerContent: FixedHeaderContent;
  itemContent: (d: any, c: any) => void;
  data: any[];
  endReached: () => void;
  loadingState?: boolean;
  footer: () => ReactNode;
}) {
  return (
    <TableVirtuoso
      style={styles}
      className={className}
      fixedHeaderContent={headerContent}
      fixedFooterContent={() => footer()}
      itemContent={itemContent as any}
      data={data}
      endReached={endReached}
      components={{
        Table: Table,
        TableFoot: TableFoot,
      }}
    />
  );
}

