import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const id = event.pathParameters?.id;
  const createdAt = event.pathParameters?.createdAt;

  if (!id || !createdAt) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        error: "Missing required parameters: id and createdAt",
      }),
    };
  }

  const result = await ddb.send(
    new DeleteItemCommand({
      TableName: "InboxTask",
      Key: marshall({
        id,
        createdAt,
      }),
      ReturnValues: "ALL_OLD",
    })
  );

  if (!result.Attributes) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        error: "Task not found",
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(unmarshall(result.Attributes)),
  };
};
