import React from "react";
import createPersistedState from "use-persisted-state";

import MUIDataTable from "mui-datatables";

const datas = require("../datas.json");
const data = datas.filter((x) => x.type === "Drum Inst");

const useRowsPerPage = createPersistedState("drumInstRowsPerPage");
const useSearch = createPersistedState("drumInstSearch");
const useFilter = createPersistedState("drumInstFilter");

export default function Table() {
  const [rowsPerPage, setRowsPerPage] = useRowsPerPage(15);
  const [search, setSearch] = useSearch("");
  const [filter, setFilter] = useFilter([[], []]);

  const columns = [
    {
      name: "category",
      label: "Category",
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
      title={"Drum Inst List"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
