import * as React from "react";
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  ThemeTypings,
} from "@chakra-ui/react";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

import { usePagination } from "../hooks/usePagination";

import { DataType, EmptyMessage } from "../types/Table";
import { BasePagination } from "../types/Pagination";

import { NoContent } from "./NoContent";
import { Pagination } from "./Pagination";

interface TableProps extends BasePagination {
  /** List parsed data columns using string or custom component */
  columns: ColumnDef<DataType>[];
  /** Pass the array of Table Headers */
  data: DataType[];
  /** Custom color schemes using Chakra UI */
  colorScheme?: ThemeTypings["colorSchemes"];
  /** Fallback for empty data  */
  emptyData?: EmptyMessage;
}

export function Table({
  page,
  onPageChange,
  totalRegisters,
  data,
  columns,
  colorScheme = "teal",
  emptyData,
}: TableProps) {
  const pagination = usePagination({
    totalRegisters,
    page,
    items: data,
  });

  const table = useReactTable({
    columns,
    data: pagination.pageItems,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <NoContent
        {...emptyData}
        text={emptyData?.text ?? "Nenhum dado para ser exibido."}
      >
        {emptyData?.children}
      </NoContent>
    );
  }

  return (
    <Box py="6" px="8" borderRadius="8" w="full" h="100%" color="">
      <ChakraTable>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta: any = header.column.columnDef.meta;

                return (
                  <React.Fragment key={header.id}>
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  </React.Fragment>
                );
              })}
            </Tr>
          ))}
        </Thead>

        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell, index) => {
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <Td
                      key={cell.column.id + index}
                      isNumeric={meta?.isNumeric}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </ChakraTable>

      <Pagination
        {...pagination}
        colorScheme={colorScheme}
        onPageChange={onPageChange}
      />
    </Box>
  );
}
