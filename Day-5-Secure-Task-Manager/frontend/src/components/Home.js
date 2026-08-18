import "../styles/Home.css";
import { Link } from "react-router-dom";


function Home(){

    return(

        <div className="home">


            {/* Hero Section */}

            <section className="hero">


                <h1>
                    Welcome to DevSync 💻
                </h1>


                <p>
                    Manage your tasks, track productivity,
                    and organize your workflow in one place.
                </p>


                <div className="hero-buttons">


                    <Link to="/dashboard">

                        <button className="primary-btn">
                            Go To Dashboard
                        </button>

                    </Link>



                    <Link to="/dashboard">

                        <button className="secondary-btn">
                            View Tasks
                        </button>

                    </Link>


                </div>


            </section>





            {/* Features */}


            <section className="features">


                <h2>
                    Everything you need
                </h2>



                <div className="feature-grid">


                    <div className="feature-card">

                        <h3>
                            📋 Task Management
                        </h3>

                        <p>
                            Create, update and organize
                            your daily tasks easily.
                        </p>

                    </div>





                    <div className="feature-card">

                        <h3>
                            📊 Analytics
                        </h3>

                        <p>
                            Track completion rate,
                            productivity and progress.
                        </p>

                    </div>





                    <div className="feature-card">

                        <h3>
                            ⚡ Productivity
                        </h3>

                        <p>
                            Improve your workflow with
                            smart insights.
                        </p>

                    </div>


                </div>


            </section>





            {/* Workflow Section */}


            <section className="workflow">


                <h2>
                    How DevSync Works
                </h2>


                <div className="steps">


                    <div>
                        <span>1</span>
                        <h3>Create Tasks</h3>
                    </div>



                    <div>
                        <span>2</span>
                        <h3>Track Progress</h3>
                    </div>



                    <div>
                        <span>3</span>
                        <h3>Complete Goals</h3>
                    </div>


                </div>


            </section>





            {/* CTA */}


            <section className="cta">


                <h2>
                    Ready to boost productivity?
                </h2>


                <Link to="/dashboard">

                    <button className="primary-btn">
                        Start Now
                    </button>

                </Link>


            </section>



        </div>

    )

}


export default Home;