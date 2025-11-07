import React from "react";
import styles from "./InstanceTable.module.css";

const InstanceTable = ({ instances }) => {
  return (
    <table className={styles.instanceTable}>
      <thead>
        <tr>
          <th>Instance ID</th>
          <th>Name</th>
          <th>Public/Private</th>
          <th>State</th>
          <th>Region</th>
        </tr>
      </thead>
      <tbody>
        {instances.map((inst) => (
          <tr key={inst.instance_id}>
            <td>{inst.instance_id}</td>
            <td>{inst.name}</td>
            <td>{inst.public_ip_address ? "Public" : "Private"}</td>
            <td>{inst.state}</td>
            <td>{inst.region}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InstanceTable;
