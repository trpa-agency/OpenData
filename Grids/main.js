let gridOptions;

// Column Definitions
const columnDefs = [
  { field: "Organization", headerName: "Organization", cellDataType: 'text', flex: 1 },
  {
    headerName: "Website",
    field: "Data_Portal_Name",
    flex: 1,
    cellRenderer: (params) => {
      return params.data.Data_Portal_URL
        ? `<a href="${params.data.Data_Portal_URL}" target="_blank" rel="noopener noreferrer">${params.value}</a>`
        : params.value;
    }
  },
  {
    field: "Contact_Email",
    headerName: "Contact",
    flex: 1,
    cellRenderer: (params) => {
      return params.value
        ? `<a href="mailto:${params.value}">${params.value}</a>`
        : "";
    }
  }
];

// Fetch data from the ArcGIS API
fetch(
  "https://services5.arcgis.com/fXXSUzHD5JjcOt1v/arcgis/rest/services/Public_Portals/FeatureServer/0/query?where=1%3D1&outFields=Organization%2CContact_Email%2CData_Portal_Name%2CData_Portal_URL%2CAvailable_Data&f=pjson"
)
  .then((response) => response.json())
  .then((data) => {
    const rowData = data.features.map((feature) => ({
      Organization: feature.attributes.Organization,
      Contact_Email: feature.attributes.Contact_Email,
      Data_Portal_Name: feature.attributes.Data_Portal_Name,
      Data_Portal_URL: feature.attributes.Data_Portal_URL,
      Available_Data: feature.attributes.Available_Data
    }));

    console.log("Data fetched:", rowData);

    gridOptions = {
      columnDefs,
      rowData,
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
      },
      popupParent: document.body,
      onGridReady: (params) => {
        window.gridAPI = params.api;
        params.api.sizeColumnsToFit();
      }
    };

    const gridDiv = document.querySelector("#myGrid");
    agGrid.createGrid(gridDiv, gridOptions);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
