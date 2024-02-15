import { NodeFunction, ProxyRestApi } from '@nx-example/backend/infra/cdk';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface ExampleApiStackProps extends cdk.StackProps {
  rootDomainName: string;
  stage: string;
}

export class ExampleApiStack extends cdk.Stack {
  readonly basePath = 'example';

  constructor(scope: Construct, id: string, props: ExampleApiStackProps) {
    super(scope, id, props);

    const { lambda } = new NodeFunction(this, 'HttpLambda', {
      functionName: `example-api-handler-${props.stage}`,
      stage: props.stage,
      environment: {
        BASE_PATH: this.basePath,
      },
    });

    new ProxyRestApi(this, 'Api', {
      restApiName: `example-api-${props.stage}`,
      stage: props.stage,
      handler: lambda,
      // hostedZone: HostedZone.fromLookup(this, 'HostedZone', {
      //   domainName: props.rootDomainName,
      // }),
      // basePath,
    });
  }
}
