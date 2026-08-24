const Task = require("../models/Task");
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


        const projectsWithProgress = await Promise.all(

            projects.map(async(project)=>{


                const tasks = await Task.find({
                    project: project._id
                });


                const completedTasks = tasks.filter(
                    task=>task.completed
                ).length;


                const progress = tasks.length === 0
                    ? 0
                    : Math.round(
                        (completedTasks / tasks.length) * 100
                    );


                return {

                    ...project.toObject(),

                    totalTasks:tasks.length,

                    completedTasks,

                    progress

                };


            })

        );


        res.json({

            success:true,

            projects:projectsWithProgress

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};