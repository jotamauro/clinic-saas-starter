import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        {children}
      </table>
    </div>
  );
}
export const THead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-100 text-left">{children}</thead>
);
export const TBody = ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>;
export const TR = ({ children }: { children: ReactNode }) => <tr className="border-b">{children}</tr>;
export const TH = ({ children }: { children: ReactNode }) => <th className="px-3 py-2 font-medium">{children}</th>;
export const TD = ({ children }: { children: ReactNode }) => <td className="px-3 py-2">{children}</td>;
