const records = [
  {
    id: "tool-lexia3",
    title: "DiagBox + Lexia 3",
    category: "OEM Diagnostic Stack",
    brands: ["Citroën", "Peugeot", "DS"],
    protocols: ["KWP2000", "UDS", "CAN"],
    license: "Commercial",
    offline: true,
    aliases: ["Lexia", "PSA XS Evolution", "Diagbox"],
    summary: "Dealer-grade diagnostics and telecoding workflow for most PSA platforms.",
    useCases: ["ECU identification", "BSI configuration", "Injector coding", "Add key"],
    compatibility: ["Windows 7/10", "VM-friendly"],
    knownLimitations: ["Clone interfaces vary heavily", "Some online functions need paid token access"],
    references: ["https://www.diagbox.com"],
    commandExample: "N/A GUI workflow"
  },
  {
    id: "tool-pyren",
    title: "PyRen + DDT4All",
    category: "Community Tooling",
    brands: ["Renault", "Dacia"],
    protocols: ["CAN", "K-Line", "UDS"],
    license: "Open Source",
    offline: true,
    aliases: ["DDT4All", "PyRen3"],
    summary: "Advanced Renault diagnostics and configuration with deep ECU parameter access.",
    useCases: ["Read hidden params", "Actuator tests", "Configuration backups"],
    compatibility: ["Windows", "Linux", "ELM327/STN adapters"],
    knownLimitations: ["Miswrites can brick configuration", "Needs exact ECU file mapping"],
    references: ["https://github.com/cedricp/ddt4all"],
    commandExample: "python3 pyren.py -p COM5 -m ALL"
  },
  {
    id: "tool-vcds",
    title: "VCDS (Ross-Tech)",
    category: "OEM-like Independent",
    brands: ["Volkswagen", "Audi", "Skoda", "SEAT"],
    protocols: ["KWP1281", "KWP2000", "UDS", "CAN"],
    license: "Commercial",
    offline: true,
    aliases: ["VAG-COM"],
    summary: "Stable diagnostics/coding suite for VAG vehicles with coding helper support.",
    useCases: ["Long coding", "Basic settings", "Service reset", "Output tests"],
    compatibility: ["Windows", "HEX-V2 interface"],
    knownLimitations: ["Official interface required", "Some SFD functions restricted"],
    references: ["https://www.ross-tech.com"],
    commandExample: "N/A GUI workflow"
  },
  {
    id: "proto-uds",
    title: "Unified Diagnostic Services (UDS) Essentials",
    category: "Protocol Knowledge",
    brands: ["Generic"],
    protocols: ["UDS", "CAN", "DoIP"],
    license: "Open Standard",
    offline: true,
    aliases: ["ISO 14229", "0x10 session", "0x27 security access"],
    summary: "Core diagnostic service architecture used on modern vehicles.",
    useCases: ["Session control", "DTC read/clear", "Routine control", "Data identifiers"],
    compatibility: ["Any UDS-compatible stack"],
    knownLimitations: ["Security access levels are OEM guarded"],
    references: ["https://en.wikipedia.org/wiki/Unified_Diagnostic_Services"],
    commandExample: "22 F1 90  # Read VIN DID"
  },
  {
    id: "hw-stn1170",
    title: "STN1170 Adapter Class",
    category: "Hardware",
    brands: ["Generic"],
    protocols: ["CAN", "K-Line", "J1850"],
    license: "Commercial",
    offline: true,
    aliases: ["OBDLink", "STN chip"],
    summary: "Higher quality interface class than many fake ELM327 clones.",
    useCases: ["Reliable scanning", "Logging", "Cross-platform scripting"],
    compatibility: ["USB", "Bluetooth", "Android", "Windows", "Linux"],
    knownLimitations: ["Not equivalent to OEM passthru for all tasks"],
    references: ["https://www.obdsol.com"],
    commandExample: "ATZ / ATI / ATSP0"
  },
  {
    id: "workflow-dpf",
    title: "DPF Regeneration Workflow",
    category: "Procedure",
    brands: ["Peugeot", "Citroën", "Renault", "Ford", "Volkswagen"],
    protocols: ["UDS", "KWP2000"],
    license: "Mixed",
    offline: true,
    aliases: ["FAP regen", "forced regeneration"],
    summary: "Decision tree: verify sensor sanity, load, oil dilution risk, then trigger managed regen.",
    useCases: ["Post-repair soot reset", "Road regen diagnostics"],
    compatibility: ["Tool supports routine control"],
    knownLimitations: ["Unsafe without temp/load prerequisites", "Fire hazard if performed incorrectly"],
    references: ["https://www.autodata-group.com"],
    commandExample: "RoutineControl 31 xx xx"
  },
  {
    id: "db-edc17",
    title: "EDC17 ECU Family Field Index",
    category: "ECU Dataset",
    brands: ["Volkswagen", "BMW", "Ford", "Mercedes", "Fiat"],
    protocols: ["UDS", "CAN", "Bootmode"],
    license: "Research",
    offline: true,
    aliases: ["Bosch EDC17", "TC1797", "TC1796"],
    summary: "Cross-reference of hardware IDs, software numbers, and flashing pathways.",
    useCases: ["Compatibility checks", "Read/write risk assessment", "Bench setup"],
    compatibility: ["Bench harness", "Chassis access"],
    knownLimitations: ["Not all variants pin-compatible", "Checksums vary by toolchain"],
    references: ["https://ecuconnections.com"],
    commandExample: "HW: 028101xxxx / SW: 1037xxxx"
  },
  {
    id: "reg-eu-r2r",
    title: "EU Right-to-Repair and SERMI Notes",
    category: "Legal/Policy",
    brands: ["EU Market"],
    protocols: ["N/A"],
    license: "Public",
    offline: true,
    aliases: ["SERMI", "EU 2018/858"],
    summary: "Overview of independent operator access model and constraints on security-relevant operations.",
    useCases: ["Compliance planning", "Business process setup"],
    compatibility: ["Independent workshops", "Diagnostic platforms"],
    knownLimitations: ["Country and OEM process differences"],
    references: ["https://single-market-economy.ec.europa.eu"],
    commandExample: "N/A"
  }
];

const indexableFields = [
  "id", "title", "category", "brands", "protocols", "license", "aliases", "summary",
  "useCases", "compatibility", "knownLimitations", "references", "commandExample"
];

const els = {
  searchInput: document.getElementById("searchInput"),
  searchBtn: document.getElementById("searchBtn"),
  results: document.getElementById("results"),
  detail: document.getElementById("detail"),
  stats: document.getElementById("stats"),
  brandFilter: document.getElementById("brandFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  protocolFilter: document.getElementById("protocolFilter"),
  licenseFilter: document.getElementById("licenseFilter"),
  offlineOnly: document.getElementById("offlineOnly"),
  clearFilters: document.getElementById("clearFilters"),
  template: document.getElementById("resultTemplate"),
  saveName: document.getElementById("saveName"),
  saveSearch: document.getElementById("saveSearch"),
  savedSearchList: document.getElementById("savedSearchList")
};

function normalize(value) {
  return String(value).toLowerCase();
}

function flattenForSearch(record) {
  return indexableFields
    .map((key) => record[key])
    .flat()
    .join(" ")
    .toLowerCase();
}

const prepared = records.map((r) => ({ ...r, __blob: flattenForSearch(r) }));

function uniqueValues(key) {
  return [...new Set(prepared.map((r) => r[key]).flat())].filter(Boolean).sort();
}

function populateFilter(selectEl, values) {
  values.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
  });
}

populateFilter(els.brandFilter, uniqueValues("brands"));
populateFilter(els.categoryFilter, uniqueValues("category"));
populateFilter(els.protocolFilter, uniqueValues("protocols"));
populateFilter(els.licenseFilter, uniqueValues("license"));

function scoreRecord(record, queryTokens) {
  let score = 0;
  for (const token of queryTokens) {
    if (record.title.toLowerCase().includes(token)) score += 5;
    if (record.aliases.join(" ").toLowerCase().includes(token)) score += 4;
    if (record.useCases.join(" ").toLowerCase().includes(token)) score += 3;
    if (record.__blob.includes(token)) score += 1;
  }
  return score;
}

function runSearch() {
  const q = normalize(els.searchInput.value).trim();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  const filtered = prepared.filter((record) => {
    if (els.brandFilter.value && !record.brands.includes(els.brandFilter.value)) return false;
    if (els.categoryFilter.value && record.category !== els.categoryFilter.value) return false;
    if (els.protocolFilter.value && !record.protocols.includes(els.protocolFilter.value)) return false;
    if (els.licenseFilter.value && record.license !== els.licenseFilter.value) return false;
    if (els.offlineOnly.checked && !record.offline) return false;

    if (!tokens.length) return true;
    return tokens.every((t) => record.__blob.includes(t));
  }).map((record) => ({ record, score: scoreRecord(record, tokens) }))
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title));

  renderResults(filtered.map((x) => x.record), q);
}

function renderResults(results, query) {
  els.results.innerHTML = "";
  els.stats.textContent = `${results.length} result(s) for "${query || "*"}"`;

  if (!results.length) {
    els.results.innerHTML = `<p class="hint">No match. Try fewer keywords or remove filters.</p>`;
    return;
  }

  for (const record of results) {
    const node = els.template.content.cloneNode(true);
    node.querySelector("h3").textContent = record.title;
    node.querySelector(".meta").textContent = `${record.category} • ${record.brands.join(", ")} • ${record.license}`;
    node.querySelector(".summary").textContent = record.summary;
    node.querySelector(".tags").textContent = `Protocols: ${record.protocols.join(", ")} | Aliases: ${record.aliases.join(", ")}`;
    node.querySelector(".view").addEventListener("click", () => renderDetail(record));
    els.results.appendChild(node);
  }
}

function renderDetail(record) {
  const keys = [
    ["ID", record.id],
    ["Title", record.title],
    ["Category", record.category],
    ["Brands", record.brands.join(", ")],
    ["Protocols", record.protocols.join(", ")],
    ["License", record.license],
    ["Offline", record.offline ? "Yes" : "No"],
    ["Aliases", record.aliases.join(", ")],
    ["Summary", record.summary],
    ["Use cases", record.useCases.join("\n• ")],
    ["Compatibility", record.compatibility.join("\n• ")],
    ["Known limitations", record.knownLimitations.join("\n• ")],
    ["References", record.references.join("\n")],
    ["Command example", record.commandExample]
  ];

  els.detail.innerHTML = `<h2>Record details</h2><div class="detail-grid"></div>`;
  const grid = els.detail.querySelector(".detail-grid");

  for (const [key, value] of keys) {
    const wrap = document.createElement("div");
    wrap.innerHTML = `<div class="key">${key}</div><div class="value">${value}</div>`;
    grid.appendChild(wrap);
  }
}

function getSearchState() {
  return {
    q: els.searchInput.value,
    brand: els.brandFilter.value,
    category: els.categoryFilter.value,
    protocol: els.protocolFilter.value,
    license: els.licenseFilter.value,
    offline: els.offlineOnly.checked
  };
}

function setSearchState(state) {
  els.searchInput.value = state.q || "";
  els.brandFilter.value = state.brand || "";
  els.categoryFilter.value = state.category || "";
  els.protocolFilter.value = state.protocol || "";
  els.licenseFilter.value = state.license || "";
  els.offlineOnly.checked = Boolean(state.offline);
  runSearch();
}

function loadSavedSearches() {
  return JSON.parse(localStorage.getItem("fv_saved_searches") || "[]");
}

function persistSavedSearches(entries) {
  localStorage.setItem("fv_saved_searches", JSON.stringify(entries));
}

function renderSavedSearches() {
  const entries = loadSavedSearches();
  els.savedSearchList.innerHTML = "";
  entries.forEach((entry, idx) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `🔍 ${entry.name}`;
    button.addEventListener("click", () => setSearchState(entry.state));

    const remove = document.createElement("button");
    remove.textContent = "✕";
    remove.addEventListener("click", () => {
      const next = loadSavedSearches().filter((_, i) => i !== idx);
      persistSavedSearches(next);
      renderSavedSearches();
    });

    li.style.display = "grid";
    li.style.gridTemplateColumns = "1fr auto";
    li.style.gap = "0.35rem";
    li.append(button, remove);
    els.savedSearchList.appendChild(li);
  });
}

els.searchBtn.addEventListener("click", runSearch);
els.searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});
[els.brandFilter, els.categoryFilter, els.protocolFilter, els.licenseFilter, els.offlineOnly]
  .forEach((el) => el.addEventListener("change", runSearch));

els.clearFilters.addEventListener("click", () => {
  setSearchState({});
});

els.saveSearch.addEventListener("click", () => {
  const name = els.saveName.value.trim();
  if (!name) return;
  const entries = loadSavedSearches();
  entries.push({ name, state: getSearchState() });
  persistSavedSearches(entries);
  els.saveName.value = "";
  renderSavedSearches();
});

renderSavedSearches();
runSearch();
