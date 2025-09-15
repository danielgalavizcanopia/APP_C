const { ejecutarStoredProcedure } = require('../queries/projects')
const multer = require('multer');
const { ejecutarVistaMAct } = require('../queries/executeViews');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'media/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });


const upload = multer({ storage: storage });
// Función para manejar la subida de archivos
function handleFileUpload(req, res) {
    return new Promise(async function(resolve, reject){
        if (req.file) {
            const filePath = req.file.path;
            const fileName = req.file.filename;
            const fileOriginalName = req.file.originalname;
        
            const resultados = await ejecutarStoredProcedure('insert_file', [/** AQUI IRÁN LOS PARAMS Y EL PATH DONDE SE GUARDA EL ARCHIVO */]);
            if(resultados[0][0].result == 1 || resultados[0][0].message == 'valido'){
                resolve({mesage: "Se ha guardado el archivo", valido: 1})
            } else {
                reject({message: "Was an error, please, try again:" + resultados.sqlmessage, valido: 0})
            }
          } else {
            res.status(400).send('No file uploaded.');
          }
    })
  }

  function testView(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarVistaMAct('t_vista_monitoractivities', req.params.id);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
        
      }
    });
  }

module.exports = {
    handleFileUpload,
    upload,
    testView
}