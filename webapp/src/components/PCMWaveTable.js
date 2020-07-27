import React from "react";

import MUIDataTable from "mui-datatables";

const datas = require("../datas.json");
const data = datas.filter((x)=>x.type==="PCM Wave")

const columns = [
  {
    name: "bank",
    label: "Bank",
    options: {
      filter: true,
      sort: true,
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


const options = {
  filterType: "multiselect",
  download: false,
  expandableRows: false,
  expandableRowsHeader: false,
  selectableRows: "none",
  searchOpen: true,
  rowsPerPageOptions: [10, 15, 25, 50, 100, 200],
  rowsPerPage: 15,
};

export default function Table() {
    return (
      <MUIDataTable
        title={"PCM Wave List"}
        data={data}
        columns={columns}
        options={options}
      />
    );
}

