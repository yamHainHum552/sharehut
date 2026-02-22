"use client";

interface Column {
  key: string;
  label: string;
}

interface Props {
  columns: Column[];
  data: any[];
  renderActions?: (row: any) => React.ReactNode;
}

export default function DataTable({ columns, data, renderActions }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-neutral-800 text-neutral-400">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-left">
                {col.label}
              </th>
            ))}
            {renderActions && <th className="p-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-neutral-800 hover:bg-neutral-800/50"
            >
              {columns.map((col) => (
                <td key={col.key} className="p-4">
                  {row[col.key]}
                </td>
              ))}
              {renderActions && <td className="p-4">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
