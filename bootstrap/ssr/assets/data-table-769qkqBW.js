import { jsxs, jsx } from "react/jsx-runtime";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CRcIHZD9.js";
import { Link } from "@inertiajs/react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
function DataTable({ data, columns }) {
  var _a;
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: data.last_page,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: data.current_page - 1,
        pageSize: data.per_page
      }
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsx(TableHead, { children: header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext()) }, header.id)) }, headerGroup.id)) }),
      /* @__PURE__ */ jsx(TableBody, { children: ((_a = table.getRowModel().rows) == null ? void 0 : _a.length) ? table.getRowModel().rows.map((row) => /* @__PURE__ */ jsx(TableRow, { children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(TableCell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id)) }, row.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: "No se encontraron resultados." }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-sm", children: [
        "Mostrando ",
        data.from,
        " a ",
        data.to,
        " de ",
        data.total,
        " registros"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        data.prev_page_url && /* @__PURE__ */ jsx(
          Link,
          {
            href: data.prev_page_url,
            className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-800",
            children: "Anterior"
          }
        ),
        data.next_page_url && /* @__PURE__ */ jsx(
          Link,
          {
            href: data.next_page_url,
            className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-800",
            children: "Siguiente"
          }
        )
      ] })
    ] })
  ] });
}
export {
  DataTable as D
};
