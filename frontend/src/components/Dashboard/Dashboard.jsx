import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/apiConfig";
import InstanceTable from "../InstanceTable/InstanceTable";
import InstanceChart from "../InstanceChart/InstanceChart";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [instances, setInstances] = useState([]); // ensure array
  const [summary, setSummary] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInstances();
    fetchSummary();
  }, [page, search, region, state]);

  const fetchInstances = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/instances`, {
        params: { page, search, region, state },
      });
      setInstances(data.instances || []); // fallback to empty array
      setTotalPages(data.totalPages || 1); // fallback to 1 page
    } catch (err) {
      console.error("Error fetching instances:", err);
      setInstances([]); // fallback in case of error
      setTotalPages(1);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/instances/summary`);
      setSummary(data || []); // fallback to empty array
    } catch (err) {
      console.error("Error fetching summary:", err);
      setSummary([]);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h2>EC2 Instances Dashboard</h2>

      {/* Summary cards */}
      <div className={styles.summaryContainer}>
        <div className={styles.card}>
          <h3>{instances?.length || 0}</h3>
          <p>Total Instances</p>
        </div>
        <div className={`${styles.card} ${styles.alert}`}>
          <h3>{instances?.filter(i => i?.public_ip_address)?.length || 0}</h3>
          <p>Publicly Accessible</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">All Regions</option>
          <option value="us-east-1">us-east-1</option>
          <option value="us-west-1">us-west-1</option>
          <option value="ap-south-1">ap-south-1</option>
        </select>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">All States</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {/* Instance Table */}
      <InstanceTable instances={instances || []} />

      {/* Pagination */}
      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span>Page {page} / {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>

      {/* Chart */}
      <InstanceChart data={summary || []} />
    </div>
  );
};

export default Dashboard;
