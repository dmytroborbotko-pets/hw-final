import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib/core";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export interface ApiStackProps extends cdk.StackProps {
  createTask: IFunction;
  readTask: IFunction;
  updateTask: IFunction;
  deleteTask: IFunction;
}

export class APIStack extends cdk.Stack {
  public readonly api: apigw.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    this.api = new apigw.RestApi(this, "InboxTaskApi", {
      restApiName: "Inbox Tasks Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    const tasks = this.api.root.addResource("tasks");

    tasks.addMethod("POST", new apigw.LambdaIntegration(props.createTask));
    tasks.addMethod("GET", new apigw.LambdaIntegration(props.readTask));
    tasks.addMethod("PUT", new apigw.LambdaIntegration(props.updateTask));
    tasks.addMethod("DELETE", new apigw.LambdaIntegration(props.deleteTask));

    new cdk.CfnOutput(this, "ApiUrl", {
      value: this.api.url,
    });
  }
}
