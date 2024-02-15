import { Duration, Stack } from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import {
  Function,
  Architecture,
  Runtime,
  Tracing,
  Code,
  FunctionProps,
} from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path from 'path';

export interface NodeFunctionProps
  extends Omit<FunctionProps, 'code' | 'runtime' | 'handler'> {
  cwd?: string;
  basePath?: string;
  runtime?: Runtime;
  handler?: string;
  code?: Code;
  stage: string;
}

export class NodeFunction extends Construct {
  readonly lambda: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    { stage, basePath, ...props }: NodeFunctionProps,
  ) {
    super(scope, id);

    const role = new Role(this, 'FunctionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      roleName: `${props.functionName}-lambda-${Stack.of(this).region}`,
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });

    const vpcProps: Partial<FunctionProps> = {};
    const lambdaFn = new Function(this, 'Function', {
      ...props,
      ...vpcProps,
      handler: props.handler ?? 'main.handler',
      code:
        props.code ??
        Code.fromAsset(
          path.join(props.cwd ?? process.cwd(), basePath ?? './dist'),
        ),
      runtime: props.runtime ?? Runtime.NODEJS_18_X,
      functionName: props.functionName,
      tracing: props.tracing ?? Tracing.ACTIVE,
      architecture: props.architecture ?? Architecture.ARM_64,
      timeout: props.timeout ?? Duration.seconds(30),
      memorySize: props.memorySize ?? 512,
      role,
      logRetention: props.logRetention ?? RetentionDays.TWO_WEEKS,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        STAGE: stage,
        ...(props.environment ?? {}),
        ...(vpcProps.environment ?? {}),
      },
    });

    this.lambda = lambdaFn;
  }
}
