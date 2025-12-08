"use client";

import { useState, useMemo } from "react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowsUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

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
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // SORT STATE
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

  // FILTER
  const filteredData = useMemo(() => {
    if (!search || !searchKeys) return data;
    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data, searchKeys]);

  // SORT
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // string ise localeCompare
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal, "tr") // Türkçe karakterler için
          : bVal.localeCompare(aVal, "tr");
      }

      // number ise normal karşılaştır
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      // diğer tipler için fallback
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // PAGINATION
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const currentData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="relative bg-white p-5 rounded-xl shadow-md overflow-x-auto">
      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      )}

      {/* Table */}
      <table className="min-w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-blue-100 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left p-3 font-semibold text-gray-700 select-none ${
                  col.sortable ? "cursor-pointer hover:text-blue-600" : ""
                }`}
                onClick={() =>
                  col.sortable && col.key !== "actions"
                    ? handleSort(col.key as keyof T)
                    : null
                }
              >
                <div className="flex items-center gap-1">
                  {col.label}

                  {/* SORT ICON */}
                  {col.sortable && sortKey !== col.key && (
                    <ArrowsUpDownIcon className="w-4 h-4 text-gray-500" />
                  )}
                  {col.sortable && sortKey === col.key && (
                    <>
                      {sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-blue-600" />
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
              className={`border-b hover:bg-blue-50 transition ${
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
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
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
      <div className="mt-6 flex justify-center items-center gap-5">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Önceki
        </button>

        <span className="text-gray-700 font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
