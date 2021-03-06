import React from "react";
import { AppBar } from "@material-ui/core";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ToneTable from "./components/ToneTable";
import DrumKitTable from "./components/DrumKitTable";
import DrumInstTable from "./components/DrumInstTable";
import PCMWaveTable from "./components/PCMWaveTable";
import PCMSyncWaveTable from "./components/PCMSyncWaveTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={1}>{children}</Box>}
      </div>
  );
}

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar color="primary" position="static">
        <Tabs centered value={value} onChange={handleChange}>
          <Tab label="Tone" />
          <Tab label="Drum Kit" />
          <Tab label="Drum Inst" />
          <Tab label="PCM Wave" />
          <Tab label="PCM-Sync Wave" />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <ToneTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DrumKitTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DrumInstTable />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PCMWaveTable />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PCMSyncWaveTable />
      </TabPanel>
    </div>
  );
}

export default App;
