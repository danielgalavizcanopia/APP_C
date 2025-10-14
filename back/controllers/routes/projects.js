const express = require("express");
const authMiddleware = require('../middlewares/Middleware')
const router = express.Router();
const { insertProjects, getProjects, updateProjects, getProjectDetailById, insertHistoricProjects, DeclineUpdateProject, getProjectDetailHist, getMunStateByAgrarianCore } = require('../controllers/projects');


router.get('/get_projects', authMiddleware, getProjects);
router.post('/post_projects', authMiddleware, insertProjects);
router.put('/putprojects/:id', authMiddleware, updateProjects);
router.get('/projectsByiddetaill/:id', authMiddleware, getProjectDetailById);
router.get('/setprojecthist/:id', authMiddleware, getProjectDetailById);
router.get('/stateandmuni/:id', authMiddleware, getMunStateByAgrarianCore);

/** HISTORICO PROYECTOS */
router.post('/spprojectshist', authMiddleware, insertHistoricProjects);
router.get('/setprojecthist/:id', authMiddleware, getProjectDetailHist);
router.post('/spdeclineput', authMiddleware, DeclineUpdateProject);



module.exports = router;
