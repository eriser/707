import React from "react";
import createPersistedState from "use-persisted-state";

import MUIDataTable from "mui-datatables";

const datas = require("../datas.json");
const data = datas.filter((x) => x.type === "PCM-Sync Wave");

const useRowsPerPage = createPersistedState("pcmWaveSyncTableRowsPerPage");
const useSearch = createPersistedState("pcmWaveSyncSearch");

const columns = [
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

export default function Table() {
  const [rowsPerPage, setRowsPerPage] = useRowsPerPage(10);
  const [search, setSearch] = useSearch("");

  const options = {
    filterType: "multiselect",
    filter: false,
    download: false,
    expandableRows: false,
    expandableRowsHeader: false,
    selectableRows: "none",
    rowsPerPageOptions: [10, 15, 25, 50, 100, 200],
    rowsPerPage,
    searchText: search,
    tableBodyMaxHeight: "800px",
    fixedHeader: true,
    onChangeRowsPerPage: setRowsPerPage,
    onSearchChange: setSearch,
  };

  return (
    <MUIDataTable
      title={"PCM-Sync Wave List"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
