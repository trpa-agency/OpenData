
let gridOptions;
let gridAPI;
// Column Definitions
const columnDefs = [
  { field: "Organization", headerName: "Organization", cellDataType: 'text', flex: 1 },
  { 
    headerName: "Website", 
    field: "Data_Portal_Name", // Use Portal Name for display
    flex: 1,
    cellRenderer: (params) => {
      // Render as clickable link
      return `<a href="${params.data.Data_Portal_URL}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
    }
  },
  { field: "Contact_Email", headerName: "Contact",    
    cellRenderer: (params) => {
      // Only render as a link if the value is not null
      if (params.value) {
        return `<a href="mailto:${params.value}">${params.value}</a>`;
      }
      return ""; // Return an empty string for null values
    }, 
    flex: 1 },
];

// Fetch data from the API
fetch(
  "https://services5.arcgis.com/fXXSUzHD5JjcOt1v/arcgis/rest/services/Public_Portals/FeatureServer/0/query?where=1%3D1&objectIds=&resultType=none&outFields=Organization%2C+Contact_Email%2CData_Portal_Name%2CData_Portal_URL%2CAvailable_Data&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&collation=&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson"  
)
  .then((response) => response.json())
  .then((data) => {
    // Map the results to the format needed for the grid
    const rowData = data.features.map((feature) => ({
                        Organization: feature.attributes.Organization,
                        Contact_Email: feature.attributes.Contact_Email,
                        Data_Portal_Name: feature.attributes.Data_Portal_Name,
                        Data_Portal_URL: feature.attributes.Data_Portal_URL,
                        Available_Data: feature.attributes.Available_Data
    }));

    console.log("Data fetched:", rowData); // Log the data to ensure it is correct

    // Grid Options with the fetched data as rowData
  gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData, // Use the fetched data
      suppressExcelExport: true,
      popupParent: document.body,
      onGridReady: (params) => {
        // Save the grid API reference for later use
        window.gridAPI = params.api; // Make API globally available if needed
      },
      defaultColDef: {
        sortable: true,
        resizable: true
      }
    };

    // Initialize the grid
    const gridDiv = document.querySelector("#myGrid");
    agGrid.createGrid(gridDiv, gridOptions); // This initializes the grid with the data

  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
  
  function onBtnExport() {
    if (window.gridAPI) {
      window.gridAPI.exportDataAsCsv();
    } else {
      console.error("Grid API is not initialized.");
    }

  }


  
  