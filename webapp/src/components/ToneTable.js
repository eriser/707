import React from "react";
import createPersistedState from "use-persisted-state";
import MUIDataTable from "mui-datatables";
import Options from "./Options";

const datas = require("../datas.json");
const data = datas.filter((x) => x.type === "Tone");

const useRowsPerPage = createPersistedState("toneRowsPerPage");
const useSearch = createPersistedState("toneSearch");
const useFilter = createPersistedState("toneFilter");

export default function Table() {
  const [rowsPerPage, setRowsPerPage] = useRowsPerPage(10);
  const [search, setSearch] = useSearch("");
  const [filter, setFilter] = useFilter([[], []]);

  const columns = [
    {
      name: "bank",
      label: "Bank",
      options: {
        filter: true,
        sort: true,
        filterList:
          typeof filter === typeof "" ? JSON.parse(filter)[0] : filter[0],
      },
    },
    {
      name: "category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        filterList:
          typeof filter === typeof "" ? JSON.parse(filter)[1] : filter[1],
      },
    },
    {
      name: "patch",
      label: "Patch",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const onFilterChange = (changedColumn, filterList) => {
    setFilter(JSON.stringify(filterList));
  };

  const options = {
    ...Options,
    rowsPerPage,
    searchText: search,
    onChangeRowsPerPage: setRowsPerPage,
    onSearchChange: setSearch,
    onFilterChange,
  };

  return (
    <MUIDataTable
      title={"Tone List"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
