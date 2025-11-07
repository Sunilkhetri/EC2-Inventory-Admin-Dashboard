// awsSync.js - fetch EC2 instances from real AWS using AWS SDK v3
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import dotenv from "dotenv";
dotenv.config();
import { bulkUpsert } from "./models/instanceModel.js";

export async function syncEC2InstancesFromAWS() {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials not set in .env");
  }

  const client = new EC2Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  let nextToken = undefined;
  const instances = [];

  do {
    const cmd = new DescribeInstancesCommand({ NextToken: nextToken });
    const res = await client.send(cmd);
    nextToken = res.NextToken;

    if (res.Reservations) {
      for (const r of res.Reservations) {
        for (const i of r.Instances || []) {
          const nameTag = (i.Tags || []).find(t => t.Key === "Name")?.Value || null;
          instances.push({
            instance_id: i.InstanceId,
            name: nameTag,
            state: i.State?.Name || null,
            region: process.env.AWS_REGION || null,
            public_ip: i.PublicIpAddress || null,
            account_id: i.OwnerId || null
          });
        }
      }
    }
  } while (nextToken);

  // upsert all
  await bulkUpsert(instances);
  return instances;
}
