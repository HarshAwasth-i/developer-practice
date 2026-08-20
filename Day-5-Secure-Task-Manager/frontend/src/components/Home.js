import { Link } from "react-router-dom";
import "../styles/Home.css";


function Home() {

    return (

        <div className="home-page">

            <div className="home-content">

                <div className="home-badge">
                    ⚡ Personal Productivity Manager
                </div>


                <h1>
                    Manage your tasks.
                    <br />
                    <span>Track your progress.</span>
                </h1>


                <p>
                    TaskPulse helps you organize your tasks,
                    monitor productivity, and stay focused on
                    what matters most.
                </p>


                <div className="home-buttons">

                    <Link
                        to="/dashboard"
                        className="primary-btn"
                    >
                        Go to Dashboard →
                    </Link>


                    <Link
                        to="/register"
                        className="secondary-btn"
                    >
                        Get Started
                    </Link>

                </div>

            </div>


            <div className="home-visual">

                <div className="visual-card">

                    <div className="visual-header">

                        <span>
                            📊
                        </span>

                        <h3>
                            Productivity
                        </h3>

                    </div>


                    <div className="visual-progress">

                        <div
                            className="visual-progress-fill"
                        ></div>

                    </div>


                    <div className="visual-stats">

                        <div>
                            <strong>
                                85%
                            </strong>

                            <span>
                                Completion
                            </span>
                        </div>


                        <div>
                            <strong>
                                12
                            </strong>

                            <span>
                                Tasks
                            </span>
                        </div>


                        <div>
                            <strong>
                                9
                            </strong>

                            <span>
                                Completed
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Home;