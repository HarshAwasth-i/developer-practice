import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/tasks/profile")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Unauthorized");
      });
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Dashboard</h1>

        {data ? (
          <>
            <h3>{data.message}</h3>

            <pre>{JSON.stringify(data.user, null, 2)}</pre>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;