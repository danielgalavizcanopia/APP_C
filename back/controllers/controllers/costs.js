const { ejecutarVistaMAct } = require('../queries/executeViews')
const { ejecutarStoredProcedure } = require('../queries/projects');
const jwt = require('jsonwebtoken'); 

function catchUserLogged(req) {
    return new Promise(function (resolve, reject){
        const token = req.header('Authorization').split(" ")[1];
        if(!token){
            resolve({error: "no hay usuario logueado"})
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            resolve({IDUser: decoded.IDUser});
        }
    });
};

async function getCarbonEquivalentCertificates(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GETdesarrollocecsbyproyect', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getUpfrontCostsUSD(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GETUpfrontCostsByProject', [req.params.id]);

        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getUpFrontCostDeductionUSD(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetUcd_byProyect', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getAnnualOMCostsDeductionUSD(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GETaomcdbyproyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getAnnualOMCosts(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GETannualomctsbyproyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}


async function getAppendixERPAByProyect(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetAppendixERPAByProyect', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getSummaryCostbyProyecto(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('mon_GetSummaryCostbyProyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setApendicesERPActrl(req, res) {
let IDUser = await catchUserLogged(req);

    try {
        const resultados = await ejecutarStoredProcedure('sp_setApendicesERPActrl', [
            req.body.Idapendiceserpactrl,
            req.body.idprojects,
            req.body.erpa,
            new Date(req.body.anoFirmaErpa).getFullYear(),
            req.body.dateFinalizacionErpa.split("T")[0],
            new Date(req.body.ano_finalizacionErpa).getFullYear(),
            req.body.DateProjectApproval.split("T")[0],
            req.body.SpecificConditions,
            req.body.ProjectCoordinator,
            req.body.TasaCambio,
            req.body.TotalCERT_tenyrs_tCOdos,
            req.body.TotalCost,
            req.body.AnnualOyMCTSmxm,
            req.body.TotalUCD,
            req.body.Totalmxn,
            req.body.TotalUCDmxn,
            req.body.IdannualOMCts,
            req.body.IdAOMCD,
            req.body.Idcrts,
            req.body.IdUCD,
            req.body.Idupdfront,
            req.body.IdDesarrolloCECs,
            IDUser.IDUser,
            IDUser.IDUser,
            req.body.Status
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setUpfrontCostsUsd(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_setUpfrontCostsUsd', [
            req.body.Idupdfront,
            req.body.Idproject,
            req.body.CAROnsiteVerification,
            req.body.CCBSOnsiteVerification,
            req.body.MonitoringBaseline,
            req.body.OnsiteImplementation,
            req.body.ProjectManagement,
            req.body.PDDDevelopment,
            req.body.Registration,
            req.body.VerificationSupport,
            req.body.FiscalandLegalManagement,
            req.body.Contingency,
            req.body.total
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setUCD(req, res) {
    try {
        let total =  req.body.p_2022 + req.body.p_2023 + req.body.p_2024 + req.body.p_2025 + req.body.p_2026 + req.body.p_2027 + req.body.p_2028 + req.body.p_2029 + req.body.p_2030 + req.body.p_2031 + req.body.p_2032;
        const resultados = await ejecutarStoredProcedure('sp_setUcd', [
            req.body.p_IdUCD,
            req.body.p_idproject,
            req.body.p_2022,
            req.body.p_2023,
            req.body.p_2024,
            req.body.p_2025,
            req.body.p_2026,
            req.body.p_2027,
            req.body.p_2028,
            req.body.p_2029,
            req.body.p_2030,
            req.body.p_2031,
            req.body.p_2032,
            // req.body.p_2033,
            total
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setAOMCD(req, res) {
    try {
        let total =  req.body.AOyMCD2022 + req.body.AOyMCD2023 + req.body.AOyMCD2024 + req.body.AOyMCD2025 + req.body.AOyMCD2026 + req.body.AOyMCD2027 + req.body.AOyMCD2028 + req.body.AOyMCD2029 + req.body.AOyMCD2030 + req.body.AOyMCD2031 + req.body.AOyMCD2032 + req.body.AOyMCD2033;
        const resultados = await ejecutarStoredProcedure('sp_setAomcd', [
            req.body.IdAOMCD, 
            req.body.idprojects, 
            req.body.AOyMCD2022, 
            req.body.AOyMCD2023, 
            req.body.AOyMCD2024, 
            req.body.AOyMCD2025, 
            req.body.AOyMCD2026, 
            req.body.AOyMCD2027, 
            req.body.AOyMCD2028, 
            req.body.AOyMCD2029, 
            req.body.AOyMCD2030, 
            req.body.AOyMCD2031, 
            req.body.AOyMCD2032, 
            req.body.AOyMCD2033, 
            total
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setAnnualomCTS(req, res) {
    try {
        let total =  req.body.p_2022 + req.body.p_2023 + req.body.p_2024 + req.body.p_2025 + req.body.p_2026 + req.body.p_2027 + req.body.p_2028 + req.body.p_2029 + req.body.p_2030 + req.body.p_2031 + req.body.p_2032 + req.body.p_2033;
        const resultados = await ejecutarStoredProcedure('sp_setAnnualomcts', [
            req.body.IdannualOMCts, 
            req.body.idprojects, 
            req.body.p_2022, 
            req.body.p_2023, 
            req.body.p_2024, 
            req.body.p_2025, 
            req.body.p_2026, 
            req.body.p_2027, 
            req.body.p_2028, 
            req.body.p_2029, 
            req.body.p_2030, 
            req.body.p_2031, 
            req.body.p_2032, 
            req.body.p_2033, 
            total
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

/** NUEVOS SP */
async function getAnnualCosts(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetAnnualCostsOpexSummary', [
            req.params.id,
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setAnnualCosts(req, res) {
    try {

        let IDUser = await catchUserLogged(req);
        let costs = req.body.costs;

        if (!costs || !Array.isArray(costs)) {
            return res.status(400).json({ message: "Invalid request: costs must be an array" });
        }

        let index = 1;

        for (let x = 0; x < costs.length; x++) {
            let cost = costs[x];

            const resultados = await ejecutarStoredProcedure('sp_Setannual_costs_opex', [
                cost.IdAnnualoCostsopex ? cost.IdAnnualoCostsopex : 0,
                req.body.idprojects,
                cost.valor, 
                cost.idrpnumber, 
                req.body.idopexaccount, 
                IDUser.IDUser
            ]);
            if (resultados.length > 0) {
                if (resultados[0][0]?.result.includes("Duplicate RP: 0")) {
                    return res.status(400).json({ message: "❌ Error: Duplicate RP detected" });
                }

                if (index === costs.length) {
                    return res.status(200).json({ valido: 1, result: resultados[0] });
                } else {
                    index++;
                }
            } else {
                return res.status(404).json({ message: "No data found for the given project ID." });
            }
        }
    } catch (error) { 
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}



module.exports = {
    getCarbonEquivalentCertificates,
    getUpfrontCostsUSD,
    getUpFrontCostDeductionUSD,
    getAnnualOMCostsDeductionUSD,
    getAnnualOMCosts,
    getAppendixERPAByProyect,
    setApendicesERPActrl,
    setUpfrontCostsUsd,
    setUCD,
    setAOMCD,
    setAnnualomCTS,
    getSummaryCostbyProyecto,

    /** nuevos sp */
    getAnnualCosts,
    setAnnualCosts
}