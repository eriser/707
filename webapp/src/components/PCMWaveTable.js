import React from "react";
import createPersistedState from "use-persisted-state";

import MUIDataTable from "mui-datatables";

const datas = require("../datas.json");
const data = datas.filter((x) => x.type === "PCM Wave");

const useRowsPerPage = createPersistedState("pcmWaveTableRowsPerPage");
const useSearch = createPersistedState("pcmWaveTableSearch");
const useFilter = createPersistedState("pcmWaveTableFilter");

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
    rowsPerPageOptions: [10, 15, 25, 50, 100, 200],
    rowsPerPage,
    searchText: search,
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "500px",
    responsive: "standard",
    fixedHeader: true,
    onChangeRowsPerPage: setRowsPerPage,
    onSearchChange: setSearch,
    onFilterChange,
  };

  return (
    <MUIDataTable
      title={"PCM Wave List"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
