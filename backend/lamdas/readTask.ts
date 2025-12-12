import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async () => {
  const res = await ddb.send(
    new ScanCommand({
      TableName: "InboxTask"!,
    })
  );
  const items = (res.Items || []).map((i) => unmarshall(i));
  items.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(items),
  };
};
