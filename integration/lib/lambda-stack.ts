import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaStack extends cdk.Stack {
  public readonly createTask: NodejsFunction;
  public readonly readTask: NodejsFunction;
  public readonly updateTask: NodejsFunction;
  public readonly deleteTask: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: { dbTable: Table } & cdk.StackProps
  ) {
    super(scope, id, props);

    this.createTask = this.createTaskFunction(
      "CreateTaskFn",
      "createTask",
      props.dbTable
    );
    this.readTask = this.createTaskFunction(
      "ReadTaskFn",
      "readTask",
      props.dbTable
    );
    this.updateTask = this.createTaskFunction(
      "UpdateTaskFn",
      "updateTask",
      props.dbTable
    );
    this.deleteTask = this.createTaskFunction(
      "DeleteTaskFn",
      "deleteTask",
      props.dbTable
    );

    props.dbTable.grantReadData(this.readTask);
    props.dbTable.grantReadWriteData(this.createTask);
    props.dbTable.grantReadWriteData(this.updateTask);
    props.dbTable.grantReadWriteData(this.deleteTask);
  }

  private createTaskFunction(
    id: string,
    fileName: string,
    table: Table
  ): NodejsFunction {
    return new NodejsFunction(this, id, {
      entry: path.join(__dirname, `../lambda/${fileName}.ts`),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(10),
      environment: {
        NOTES_TABLE: table.tableName,
      },
    });
  }
}
