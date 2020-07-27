const PdfReader = require("pdfreader");

let state = 0;
let prevState = 0;
let isParsingTone = false;
let isParsingDrumKit = false;
let isParsingDrumInst = false;
let isParsingDrumKitPadAssign = false;
let isParsingPCMWave = false;
let isParsingPCMSyncWave = false;

const READ_PAGE_NUMBER_PARSER_STATE = 10000;

const TONE_PARSER = 1; // TOP LEVEL PARSER STATE
const TONE_PARSER_BANK = 2;
const TONE_PARSER_NO = 3;
const TONE_PARSER_NAME = 4;
const TONE_PARSER_CATEGORY = 5;
const TONE_PARSER_PATCH_ID = 6;
const TONE_PARSER_PATCH_NAME = 7;
const TONE_PARSER_PATCH_CATEGORY = 8;

const DRUMKIT_PARSER = 101; // TOP LEVEL PARSER STATE
const DRUMKIT_PARSER_BANK = 102;
const DRUMKIT_PARSER_NO = 103;
const DRUMKIT_PARSER_NAME = 104;
const DRUMKIT_PARSER_PATCH_ID = 105;
const DRUMKIT_PARSER_PATCH_NAME = 106;

const DRUMINST_PARSER = 201; // TOP LEVEL PARSER STATE
const DRUMINST_PARSER_NO = 202;
const DRUMINST_PARSER_NAME = 203;
const DRUMINST_PARSER_CATEGORY = 204;
const DRUMINST_PARSER_PATCH_ID = 205;
const DRUMINST_PARSER_PATCH_NAME = 206;
const DRUMINST_PARSER_PATCH_CATEGORY = 207;

const DRUMKIT_PAD_ASSIGN_PARSER = 301; // TOP LEVEL PARSER STATE (SKIPPED)

const PCM_WAVE_PARSER = 401; // TOP LEVEL PARSER STATE
const PCM_WAVE_PARSER_BANK = 402;
const PCM_WAVE_PARSER_NO = 403;
const PCM_WAVE_PARSER_NAME = 404;
const PCM_WAVE_PARSER_PATCH_ID = 406;
const PCM_WAVE_PARSER_PATCH_NAME = 407;

const PCM_SYNC_WAVE_PARSER = 501; // TOP LEVEL PARSER STATE
const PCM_SYNC_WAVE_PARSER_NO = 502;
const PCM_SYNC_WAVE_PARSER_NAME = 503;
const PCM_SYNC_WAVE_PARSER_PATCH_ID = 504;
const PCM_SYNC_WAVE_PARSER_PATCH_NAME = 505;

function printParserState() {
  console.warn({
    state,
    prevState,
    isParsingTone,
    isParsingDrumInst,
    isParsingDrumKit,
    isParsingDrumKitPadAssign,
    isParsingPCMWave,
    isParsingPCMSyncWave,
  });
}

function setState(newState) {
  prevState = state;
  state = newState;

  // toplevel state
  if (
    state === TONE_PARSER ||
    state === DRUMKIT_PARSER ||
    state === DRUMINST_PARSER ||
    state === DRUMKIT_PAD_ASSIGN_PARSER ||
    state === PCM_WAVE_PARSER ||
    state === PCM_SYNC_WAVE_PARSER
  ) {
    isParsingTone = state >= TONE_PARSER && state <= TONE_PARSER_PATCH_CATEGORY;

    isParsingDrumKit =
      state >= DRUMKIT_PARSER && state <= DRUMKIT_PARSER_PATCH_NAME;

    isParsingDrumInst =
      state >= DRUMINST_PARSER && state <= DRUMINST_PARSER_PATCH_CATEGORY;

    isParsingDrumKitPadAssign = state == DRUMKIT_PAD_ASSIGN_PARSER;

    isParsingPCMWave =
      state >= PCM_WAVE_PARSER && state <= PCM_WAVE_PARSER_PATCH_NAME;

    isParsingPCMSyncWave =
      state >= PCM_SYNC_WAVE_PARSER && state <= PCM_SYNC_WAVE_PARSER_PATCH_NAME;
  }

 // printParserState();
}

let currentBank = "";
let currentPatchId = "";
let currentName = "";
let currentCategory = "";
let items = [];
 
function pushCurrentTone() {

  items.push({
    type: "Tone",
    bank: currentBank,
    patch: currentPatchId,
    name: currentName,
    category: currentCategory,
  });
}

function pushCurrentDrumKit() {
  items.push({
    type: "Drum Kit",
    bank: currentBank,
    patch: currentPatchId,
    name: currentName,
  });
}

function pushCurrentDrumInst() {
  items.push({
    type: "Drum Inst",
    patch: currentPatchId,
    name: currentName,
    category: currentCategory,
  });
}

function pushCurrentPCMWave() {
  items.push({
    type: "PCM Wave",
    bank: currentBank,
    patch: currentPatchId,
    name: currentName,
  });
}

function pushCurrentPCMSyncWave() {
  items.push({
    type: "PCM-Sync Wave",
    patch: currentPatchId,
    name: currentName,
  });
}


  new PdfReader.PdfReader().parseFileItems(
    "MC-707_SoundList_multi01_W.pdf",
    function (err, item) {
      if (err) {
        console.erroror(err);
        return;
      }

      if(!item) {
        console.log(JSON.stringify(items));
      }

      if (item && item.page) {
        setState(READ_PAGE_NUMBER_PARSER_STATE);
        return;
      }

      if (item && item.text) {
        const itemText = item.text.trim();

        if (itemText == "Tone") {
          setState(TONE_PARSER);
        } else if (itemText == "Drum Kit") {
          setState(DRUMKIT_PARSER);
        } else if (itemText == "Drum Inst") {
          setState(DRUMINST_PARSER);
        } else if (itemText.startsWith("Drum Kit Pad")) {
          setState(DRUMKIT_PAD_ASSIGN_PARSER);
        } else if (itemText.startsWith("PCM Wave")) {
          setState(PCM_WAVE_PARSER);
        } else if (itemText.startsWith("PCM-Sync Wave")) {
          setState(PCM_SYNC_WAVE_PARSER);
          setState(PCM_SYNC_WAVE_PARSER_NO);
        } else if (itemText.startsWith("Bank")) {
          currentBank = itemText;

          if (isParsingTone) {
            setState(TONE_PARSER_BANK);
          } else if (isParsingDrumKit) {
            setState(DRUMKIT_PARSER_BANK);
          } else if (isParsingPCMWave) {
            setState(PCM_WAVE_PARSER_BANK);
          } else if (isParsingDrumKitPadAssign) {
            return;
          } else {
            console.error("Bank: unknow state parser", itemText);
          }
        } else if (itemText === "© 2019 Roland Corporation") {
          return;
        } else if (itemText.startsWith("MC-707 Sound List")) {
          return;
        }

        switch (state) {
          case READ_PAGE_NUMBER_PARSER_STATE: {
            if (isParsingTone) {
              setState(TONE_PARSER_NO);
            } else if (isParsingDrumKit) {
              setState(DRUMKIT_PARSER_NO);
            } else if (isParsingDrumInst) {
              setState(DRUMINST_PARSER_NO);
            } else if (isParsingPCMWave) {
              setState(PCM_WAVE_PARSER_NO);
            } else if (isParsingPCMSyncWave) {
              setState(PCM_SYNC_WAVE_PARSER_NO);
            } else {
              if (isParsingDrumKitPadAssign) return;

              if (state != 0) {
                console.error(
                  "READ_PAGE_NUMBER_PARSER_STATE: unknow state parser",
                  itemText
                );
              }
            }
            break;
          }

          case TONE_PARSER_BANK: {
            if (isParsingTone) {
              setState(TONE_PARSER_NO);
            } else {
              console.error("TONE_PARSER_BANK: unknow state parser", itemText);
            }

            break;
          }

          case TONE_PARSER_NO: {
            if (itemText == "No.") {
              setState(TONE_PARSER_NAME);
            } else {
              console.error("ERROR TONE_PARSER_NO required No.", itemText);
            }

            break;
          }

          case TONE_PARSER_NAME: {
            if (itemText == "Tone Name") {
              setState(TONE_PARSER_CATEGORY);
            } else {
              console.error(
                "ERROR TONE_PARSER_NAME required Tone Name.",
                itemText
              );
            }
            break;
          }

          case TONE_PARSER_CATEGORY: {
            if (itemText == "Category") {
              setState(TONE_PARSER_PATCH_ID);
            } else {
              console.error(
                "ERROR TONE_PARSER_CATEGORY required Category.",
                itemText
              );
            }
            break;
          }

          case TONE_PARSER_PATCH_ID: {
            if (itemText === "No.") {
              setState(TONE_PARSER_NAME);
            } else {
              currentPatchId = itemText;
              setState(TONE_PARSER_PATCH_NAME);
            }

            break;
          }

          case TONE_PARSER_PATCH_NAME: {
            currentName = itemText;
            setState(TONE_PARSER_PATCH_CATEGORY);
            break;
          }

          case TONE_PARSER_PATCH_CATEGORY: {
            currentCategory = itemText;
            setState(TONE_PARSER_PATCH_ID);
            pushCurrentTone();
            break;
          }

          case DRUMKIT_PARSER_BANK: {
            if (isParsingDrumKit) {
              setState(DRUMKIT_PARSER_NO);
            } else {
              console.error("DRUMKIT_PARSER_BANK: unknow state parser");
            }
            break;
          }

          case DRUMKIT_PARSER_NO: {
            if (itemText == "No.") {
              setState(DRUMKIT_PARSER_NAME);
            } else {
              console.error("ERROR DRUMKIT_PARSER_NO required No.", itemText);
            }

            break;
          }

          case DRUMKIT_PARSER_NAME: {
            if (itemText == "Drum Kit Name") {
              setState(DRUMKIT_PARSER_PATCH_ID);
            } else {
              console.error(
                "ERROR DRUMKIT_PARSER_NAME required Drum Kit Name.",
                itemText
              );
            }
            break;
          }

          case DRUMKIT_PARSER_PATCH_ID: {
            if (itemText === "No.") {
              setState(DRUMKIT_PARSER_NAME);
            } else {
              currentPatchId = itemText;
              setState(DRUMKIT_PARSER_PATCH_NAME);
            }

            break;
          }

          case DRUMKIT_PARSER_PATCH_NAME: {
            currentName = itemText;
            setState(DRUMKIT_PARSER_PATCH_ID);
            pushCurrentDrumKit();
            break;
          }

          case DRUMINST_PARSER_NO: {
            if (itemText == "No.") {
              setState(DRUMINST_PARSER_NAME);
            } else {
              console.error(
                "ERROR DRUMINST_PARSER_NAME required No.",
                itemText
              );
            }

            break;
          }

          case DRUMINST_PARSER_NAME: {
            if (itemText == "Drum Inst Name") {
              setState(DRUMINST_PARSER_CATEGORY);
            } else {
              console.error(
                "ERROR DRUMINST_PARSER_NAME required Drum Inst Name.",
                itemText
              );
            }
            break;
          }

          case DRUMINST_PARSER_CATEGORY: {
            if (itemText == "Category") {
              setState(DRUMINST_PARSER_PATCH_ID);
            } else {
              console.error(
                "ERROR TONE_BANK_STATE_PARSER_TONE_NAME required Category.",
                itemText
              );
            }
            break;
          }

          case DRUMINST_PARSER_PATCH_ID: {
            if (itemText === "No.") {
              setState(DRUMINST_PARSER_NAME);
            } else {
              currentPatchId = itemText;
              setState(DRUMINST_PARSER_PATCH_NAME);
            }

            break;
          }

          case DRUMINST_PARSER_PATCH_NAME: {
            currentName = itemText;
            setState(DRUMINST_PARSER_PATCH_CATEGORY);
            break;
          }

          case DRUMINST_PARSER_PATCH_CATEGORY: {
            currentCategory = itemText;
            setState(DRUMINST_PARSER_PATCH_ID);
            pushCurrentDrumInst();
            break;
          }

          case PCM_WAVE_PARSER_BANK: {
            if (isParsingPCMWave) {
              setState(PCM_WAVE_PARSER_NO);
            } else {
              console.error(
                "PCM_WAVE_PARSER_BANK: unknow state parser",
                itemText
              );
            }

            break;
          }

          case PCM_WAVE_PARSER_NO: {
            if (itemText == "No.") {
              setState(PCM_WAVE_PARSER_NAME);
            } else {
              console.error("ERROR PCM_WAVE_PARSER_NO required No.", itemText);
            }

            break;
          }

          case PCM_WAVE_PARSER_NAME: {
            if (itemText == "WaveName") {
              setState(PCM_WAVE_PARSER_PATCH_ID);
            } else {
              console.error(
                "ERROR PCM_WAVE_PARSER_NAME required WaveName.",
                itemText
              );
            }
            break;
          }

          case PCM_WAVE_PARSER_PATCH_ID: {
            if (itemText === "No.") {
              setState(PCM_WAVE_PARSER_NAME);
            } else {
              currentPatchId = itemText;
              setState(PCM_WAVE_PARSER_PATCH_NAME);
            }

            break;
          }

          case PCM_WAVE_PARSER_PATCH_NAME: {
            currentName = itemText;
            setState(PCM_WAVE_PARSER_PATCH_ID);
            pushCurrentPCMWave();
            break;
          }

          case PCM_SYNC_WAVE_PARSER_NO: {
            if (itemText == "No.") {
              setState(PCM_SYNC_WAVE_PARSER_NAME);
            } else {
              console.error(
                "ERROR PCM_SYNC_WAVE_PARSER_NO required No.",
                itemText
              );
            }

            break;
          }

          case PCM_SYNC_WAVE_PARSER_NAME: {
            if (itemText == "WaveName") {
              setState(PCM_SYNC_WAVE_PARSER_PATCH_ID);
            } else {
              console.error(
                "ERROR PCM_SYNC_WAVE_PARSER_NAME required WaveName.",
                itemText
              );
            }
            break;
          }

          case PCM_SYNC_WAVE_PARSER_PATCH_ID: {
            if (itemText === "No.") {
              setState(PCM_SYNC_WAVE_PARSER_NAME);
            } else {
              currentPatchId = itemText;
              setState(PCM_SYNC_WAVE_PARSER_PATCH_NAME);
            }

            break;
          }

          case PCM_SYNC_WAVE_PARSER_PATCH_NAME: {
            currentName = itemText;
            setState(PCM_SYNC_WAVE_PARSER_PATCH_ID);
            pushCurrentPCMSyncWave();
            break;
          }
        }
      }
    }
  );


