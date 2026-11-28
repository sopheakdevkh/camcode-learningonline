import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

/**
 * Accessible responsive table primitives aligned with Geist borders and surface hierarchy.
 */
export const Table: React.FC<TableProps> = ({
  wrapperClassName = '',
  className = '',
  children,
  ...props
}) => (
  <div className={`w-full overflow-x-auto ${wrapperClassName}`}>
    <table className={`w-full text-left border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <thead className={className} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tbody className={`divide-y divide-[var(--border-default)] text-[14px] ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tr
    className={`hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--ds-gray-200)]/50 transition-colors ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <th
    scope="col"
    className={`py-3.5 px-5 bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-[13px] font-semibold text-[var(--text-main)] ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <td className={`py-3.5 px-5 text-[var(--text-secondary)] ${className}`} {...props}>
    {children}
  </td>
);
