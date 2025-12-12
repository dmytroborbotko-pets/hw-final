import * as cdk from "aws-cdk-lib/core";
import { LambdaStack } from "../lib/lambda-stack";
import { DynamoDBStack } from "../lib/dynamodb-stack";
import { APIStack } from "../lib/api-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();

const bd = new DynamoDBStack(app, "DynamoDBStack");
const lambdas = new LambdaStack(app, "LambdaStack", {
  dbTable: bd.inboxTasksTable,
});
new APIStack(app, "APIStack", {
  createTask: lambdas.createTask,
  readTask: lambdas.readTask,
  updateTask: lambdas.updateTask,
  deleteTask: lambdas.deleteTask,
});

new FrontendStack(app, "FrontendStack");
