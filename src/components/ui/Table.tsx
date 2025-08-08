import { ReactNode } from "react";
import clsx from "clsx";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        {children}
      </table>
    </div>
  );
}

export const THead = ({ children, className, ...props }:
  React.HTMLAttributes<HTMLTableSectionElement> & { children: ReactNode }) => (
  <thead {...props} className={clsx("bg-gray-100 text-left", className)}>{children}</thead>
);

export const TBody = ({ children, className, ...props }:
  React.HTMLAttributes<HTMLTableSectionElement> & { children: ReactNode }) => (
  <tbody {...props} className={clsx(className)}>{children}</tbody>
);

export const TR = ({ children, className, ...props }:
  React.HTMLAttributes<HTMLTableRowElement> & { children: ReactNode }) => (
  <tr {...props} className={clsx("border-b", className)}>{children}</tr>
);

export const TH = ({ children, className, ...props }:
  React.ThHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) => (
  <th {...props} className={clsx("px-3 py-2 font-medium", className)}>{children}</th>
);

export const TD = ({ children, className, title, ...props }:
  React.TdHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) => (
  <td {...props} title={title} className={clsx("px-3 py-2", className)}>{children}</td>
);
