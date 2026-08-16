const Activity = require("../models/Activity");



exports.getActivities = async(req,res)=>{


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

            message:error.message

        });


    }


};