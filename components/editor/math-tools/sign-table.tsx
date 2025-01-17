'use client';

interface SignTableProps {
  headers: string[];
  rows: {
    x: string;
    signs: ('+' | '-' | '0')[];
    values?: string[];
  }[];
}

export function SignTable({ headers, rows }: SignTableProps) {
  return (
    <table className="border-collapse border border-gray-300 my-4 mx-auto">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="border border-gray-300 px-4 py-2">{row.x}</td>
            {row.signs.map((sign, index) => (
              <td key={index} className="border border-gray-300 px-4 py-2 text-center">
                {sign}
              </td>
            ))}
            {row.values && row.values.map((value, index) => (
              <td key={`value-${index}`} className="border border-gray-300 px-4 py-2">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
