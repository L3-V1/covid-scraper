const express = require('express');

const { getWorldData, getCountryData } = require('../src/scraper');

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const world_data = await getWorldData();

        if(world_data.length > 0){
            res.status(200);
            res.json(world_data);
        }
        else{
            res.status(404);
            res.json({
                message:'No results found'
            });
        }
    }
    catch(error){
        res.status(500);
        res.json({
            message:error.message
        });
    }
});

router.get('/:country', async (req, res) => {
    try{
        const country_data = await getCountryData(req.params.country);

        if(country_data){
            res.status(200);
            res.json(country_data);
        }
        else{
            res.status(404);
            res.json({
                message:'Country not found'
            });
        }
    }
    catch(error){
        res.status(500);
        res.json({
            message:error.message
        });
    }
});

module.exports = router;