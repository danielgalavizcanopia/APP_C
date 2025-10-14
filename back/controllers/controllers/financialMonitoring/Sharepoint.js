const axios = require('axios');
const qs = require('qs');

function getBearerToken(){
  return new Promise(async function(resolve, reject){
    let data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': process.env.APP_CLIENTID,
      'client_secret':process.env.SECRETVALUE,
      'scope': 'https://graph.microsoft.com/.default' 
    });
    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://login.microsoftonline.com/${process.env.TENANTID}/oauth2/v2.0/token`,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': 'fpc=ArcJS5f4fdZPgXGTpaHs793vQUcvAQAAAAemKd8OAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      console.log(error);
    });


    })
}

async function getSharepointRegisters(Folio_Project){
    try {
      let token = await getBearerToken();
      let ctas = [];
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.microsoft.com/v1.0/sites/canopiacarbon918.sharepoint.com,661f8102-fa5a-4dff-bf85-30247a3da20a, 0676e795-0d20-4f9a-958a-3a5ff2a224b9/lists/${process.env.LISTID}/items?expand=fields(select=id,Title,Created,ProjectName,NombredelColaborador,Detalledegastos,Divisa,RegistroFormatoCompaq,ImporteProrrateoFactura,Total_x0028_DetalleMontoFactura_,Cta_x0028_Ejido_x003a_CAPEX_x0020,Cta_x002e_Contpaq_x0028_Ejido_x0,Concepto_x0028_Ejido_x003a_CAPEX,Mes,ProjectID,IDAct,RP)&$filter=fields/ProjectID eq '${Folio_Project}'&$orderby=fields/Created desc`,
        headers: { 
          'Authorization': 'bearer ' + token.access_token
        }
      };
      
      return axios.request(config)
      .then((response) => {
          return response.data?.value;
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        return [];
      });

    } catch (error) {
      console.error("Error al obtener los sharepoint:", error);
    }
  
}



module.exports = {
  getBearerToken,
  getSharepointRegisters,
} 