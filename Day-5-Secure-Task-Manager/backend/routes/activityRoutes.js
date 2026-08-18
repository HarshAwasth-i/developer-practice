const express = require("express");

const router = express.Router();

const Activity = require("../models/Activity");

const protect = require("../middleware/authMiddleware");



router.get("/", protect, async(req,res)=>{

    try{

        const activities = await Activity.find({
            user:req.user.id
        })
        .sort({
            createdAt:-1
        })
        .limit(10);


        res.json({

            success:true,

            activities

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

});


module.exports = router;