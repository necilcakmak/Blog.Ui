import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { useMemo, useState } from "react";
interface Column<T> {
  key: keyof T | "actions";
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchKeys?: (keyof T)[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  title?: string; // Tablo başlığı
  actions?: React.ReactNode; // Sağ üst köşeye butonlar
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pageSize = 10,
  searchKeys,
  loading = false,
  onEdit,
  onDelete,
  onView,
  title,
  actions,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // SORT HANDLER
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (!search || !searchKeys) return data;
    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal, "tr")
          : bVal.localeCompare(aVal, "tr");
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const currentData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="relative bg-white p-5 rounded-xl shadow-md overflow-x-auto">
      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Header (Title + Actions) */}
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {actions && <div>{actions}</div>}
        </div>
      )}

      {/* Search */}
      {searchKeys && (
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Arama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-indigo-500 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      )}

      {/* Table */}
      <table className="min-w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-indigo-100 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left p-3 font-semibold text-gray-700 select-none ${
                  col.sortable ? "cursor-pointer hover:text-indigo-600" : ""
                }`}
                onClick={() =>
                  col.sortable && col.key !== "actions"
                    ? handleSort(col.key as keyof T)
                    : null
                }
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey !== col.key && (
                    <ArrowsUpDownIcon className="w-4 h-4 text-gray-500" />
                  )}
                  {col.sortable && sortKey === col.key && (
                    <>
                      {sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-indigo-500" />
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 && !loading && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                Sonuç bulunamadı.
              </td>
            </tr>
          )}

          {currentData.map((item, idx) => (
            <tr
              key={item.id}
              className={`border-b hover:bg-indigo-50 transition ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {columns.map((col) => {
                if (col.key === "actions") {
                  return (
                    <td key="actions" className="p-3 flex gap-2 items-center">
                      {onView && (
                        <EyeIcon
                          className="w-5 h-5 text-green-600 hover:text-green-800 cursor-pointer"
                          onClick={() => onView(item)}
                        />
                      )}
                      {onEdit && (
                        <PencilIcon
                          className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          onClick={() => onEdit(item)}
                        />
                      )}
                      {onDelete && (
                        <TrashIcon
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => onDelete(item)}
                        />
                      )}
                    </td>
                  );
                }

                return (
                  <td key={String(col.key)} className="p-3">
                    {col.render ? col.render(item) : (item[col.key] as any)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700">
                {Math.min(page * pageSize, sortedData.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {sortedData.length}
              </span>{" "}
              results
            </p>
          </div>

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    aria-current={pNum === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-gray-300 ${
                      pNum === page
                        ? "z-10 bg-indigo-500 text-white hover:bg-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pNum}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
