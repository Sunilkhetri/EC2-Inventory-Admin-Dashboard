// models/ec2Model.js
import db from "../config/db.js";

/**
 * Data access functions for ec2_instances table
 */

export async function upsertInstance(instance) {
  const sql = `
    INSERT INTO ec2_instances (instance_id, name, state, region, public_ip, account_id)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      state = VALUES(state),
      region = VALUES(region),
      public_ip = VALUES(public_ip),
      account_id = VALUES(account_id),
      updated_at = NOW()
  `;
  const params = [
    instance.instance_id,
    instance.name || null,
    instance.state || null,
    instance.region || null,
    instance.public_ip || null,
    instance.account_id || null
  ];
  await db.query(sql, params);
}

export async function bulkUpsert(instances = []) {
  for (const inst of instances) {
    await upsertInstance(inst);
  }
}

export async function getInstances({ page = 1, limit = 10, state, region, search }) {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (state) {
    where.push("state = ?");
    params.push(state);
  }
  if (region) {
    where.push("region = ?");
    params.push(region);
  }
  if (search) {
    const s = `%${search}%`;
    where.push("(instance_id LIKE ? OR name LIKE ? OR public_ip LIKE ?)");
    params.push(s, s, s);
  }

  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM ec2_instances ${whereSQL}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const [rows] = await db.query(
    `SELECT * FROM ec2_instances ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

 return {
  instances: rows,                       // actual rows
  totalPages: Math.ceil(total / limit),  // total pages for frontend
  page: Number(page),                    // current page
};

}

export async function getInstancesSummaryByState() {
  const [rows] = await db.query(
    `SELECT state, COUNT(*) as count FROM ec2_instances GROUP BY state`
  );
  return rows;
}

export async function getAllRegions() {
  const [rows] = await db.query(`SELECT DISTINCT region FROM ec2_instances`);
  return rows.map(r => r.region).filter(Boolean);
}
