import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuid } from "uuid";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || "{}");

  const item = {
    id: uuid(),
    title: body.title,
    content: body.content,
    createdAt: Date.now().toString(),
  };

  await ddb.send(
    new PutItemCommand({
      TableName: "InboxTask"!,
      Item: marshall(item),
    })
  );

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(item),
  };
};
