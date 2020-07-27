import React from "react";
import createPersistedState from "use-persisted-state";

import MUIDataTable from "mui-datatables";

const datas = require("../datas.json");
const data = datas.filter((x) => x.type === "Drum Kit");

const useRowsPerPage = createPersistedState("drumKitRowsPerPage");
const useSearch = createPersistedState("drumKitSearch");
const useFilter = createPersistedState("drumKitFilter");

export default function Table() {
  const [rowsPerPage, setRowsPerPage] = useRowsPerPage(15);
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
    filterType: "multiselect",
    fixedHeader: true,
    download: false,
    expandableRows: false,
    expandableRowsHeader: false,
    selectableRows: "none",
    searchOpen: true,
    rowsPerPageOptions: [10, 15, 25, 50, 100, 200],
    rowsPerPage,
    searchText: search,
    onChangeRowsPerPage: setRowsPerPage,
    onSearchChange: setSearch,
    onFilterChange,
  };

  return (
    <MUIDataTable
      title={"Drum Kit List"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
