const Project = require("../models/Project");


// Create Project

exports.createProject = async(req,res)=>{


    try{


        const project = await Project.create({

            name:req.body.name,

            description:req.body.description,

            status:req.body.status,

            user:req.user.id

        });



        res.status(201).json({

            success:true,

            project

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};





// Get Projects

exports.getProjects = async(req,res)=>{


    try{


        const projects = await Project.find({

            user:req.user.id

        });



        res.json({

            success:true,

            projects

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};