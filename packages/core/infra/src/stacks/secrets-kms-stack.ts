import * as cdk from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

interface SecretsKmsStackProps extends cdk.StackProps {
  stage: string;
}

export class SecretsKmsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecretsKmsStackProps) {
    super(scope, id, props);

    // tool reference: https://pypi.org/project/aws-ssm-secrets-cli/
    const key = new Key(this, 'SecretsKms', {
      alias: `alias/aws-ssm-secrets-cli-${props.stage}`,
      description: `KMS key for encrypting secrets using aws-ssm-secrets-cli tool`,
    });

    new cdk.CfnOutput(this, 'KeyArn', {
      value: key.keyArn,
      description:
        'KMS key ARN for encrypting secrets using aws-ssm-secrets-cli tool',
    });
  }
}
