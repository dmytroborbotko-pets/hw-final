import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || "{}");

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

  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  if (body.title !== undefined) {
    updateExpressions.push("#title = :title");
    expressionAttributeNames["#title"] = "title";
    expressionAttributeValues[":title"] = body.title;
  }

  if (body.content !== undefined) {
    updateExpressions.push("#content = :content");
    expressionAttributeNames["#content"] = "content";
    expressionAttributeValues[":content"] = body.content;
  }

  if (updateExpressions.length === 0) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        error: "No fields to update. Provide title and/or content.",
      }),
    };
  }

  const result = await ddb.send(
    new UpdateItemCommand({
      TableName: "InboxTask",
      Key: marshall({
        id,
        createdAt,
      }),
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ReturnValues: "ALL_NEW",
    })
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(unmarshall(result.Attributes!)),
  };
};
