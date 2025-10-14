const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { RegisterUser, checkIfExistUser, checkPermissions } =  require('../queries/authQueries')
const generateAccessToken = (IDUser) => {
    return jwt.sign({ IDUser }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
const encrypt = require('../helpers/crypt')

const { ejecutarStoredProcedure } = require('../queries/projects');
const { ejecutarVistaTools } = require('../queries/executeViews')
const { getCatalogs } = require('../queries/catalogs');


function getCtPositions(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_positions');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

// const generatePassword = async (req, res) => {
//   const password = req.body.password;

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   res.status(201).json({ message: "Password Generated!", password: hashedPassword });

// }

const register = async (req, res) => {
    const decryptUser = await encrypt.decryptObject(req.body.userData);
    const { Name, Email, password } = decryptUser;
    if (!Name || !Email || !password) {
      res
        .status(400)
        .json({ error: "Name, Email or Password fields cannot be empty!" });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      IDUser: uuidv4(),
      Name: Name,
      Email,
      password: hashedPassword,
    };
    try {
        // const userAlreadyExists = await checkRecordExists("users", "email", email);
        const userAlreadyExists = await checkIfExistUser(Email);
        if (userAlreadyExists) {
          res.status(409).json({ error: "Email already exists" });
        } else {
          const saveUser = await RegisterUser(user);
          if(saveUser.valido === 1){
            res.status(201).json({ message: "User created successfully!" });
          } else {
            res.status(500).json({ error: "Error to register" });
          }
        }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const login = async (req, res) => {
    
    const decryptUser = await encrypt.decryptObject(req.body.userData);
    const { Email, password } = decryptUser;
    if (!Email || !password) {
      res
        .status(400)
        .json({ error: "Email or Password fields cannot be empty!" });
      return;
    }
  
    try {
      const existingUser = await checkIfExistUser(Email);
  
      if (existingUser) {
        if (!existingUser.Password) {
          res.status(401).json({ error: "Invalid credentials" });
          return;
        }

        const checkP = await checkPermissions(existingUser.IDUser);
  
        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.Password
        );
        if (passwordMatch) {

          let dataresp = {
            userId: existingUser.IDUser,
            name: existingUser.Name,
            email: existingUser.Email,
            area: existingUser.Areas,
            access_token: generateAccessToken(existingUser.IDUser),
            permissions: checkP,
            positionId: existingUser.id_positions
          }

          const encryptUser = await encrypt.encryptObject(dataresp);
    
          res.status(200).json({ valido: 1, message: "Login success!", resp: encryptUser});
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        res.status(401).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
function setUsers(req, res){
  return new Promise(async function(resolve, reject){

    const decryptUser = await encrypt.decryptObject(req.body.userData);
    let Password
    
    const existingUser = await checkIfExistUser(decryptUser.Email);
    
    if(existingUser.Password === decryptUser.Password){
      Password = decryptUser.Password
    } else {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(decryptUser.Password, salt);
      Password = hashedPassword;
    }
    
    try {
      const resultados = await ejecutarStoredProcedure('sp_SETUsers',[
        decryptUser.userId,
        decryptUser.userName,
        decryptUser.Email,
        1,
        new Date().toISOString().split('T')[0],
        decryptUser.IDUserCreate,
        Password,
        decryptUser.idPosition
      ]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {

    }
  });
}

function getUsers(req, res){
  return new Promise(async (resolve, reject) => {
      try {
          const resultados = await ejecutarVistaTools('vw_users',[]);
          if(resultados.length > 0){
              res.status(201).json({valido: 1, result: resultados});
          } else {
              res.status(500).json({valido: 0, message: "Was an error, please, try again"});
          }
      } catch (error) {
      }
  });
}

  module.exports = {
    register,
    login,

    getCtPositions,
    setUsers,
    getUsers,
    // generatePassword
  };