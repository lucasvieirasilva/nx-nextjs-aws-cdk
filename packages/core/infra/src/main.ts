#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getStages } from '@nx-example/backend/infra/cdk';
import { SecretsKmsStack } from './stacks/secrets-kms-stack';
import { ApiGatewayDomainStack } from './stacks/api-domain-stack';

const app = new cdk.App();

for (const stage of getStages(app.node.tryGetContext('stage') ?? 'dev')) {
  const baseParams = {
    stage: stage.stageName,
    env: {
      account: stage.accountId,
      region: stage.region,
    },
  };

  new SecretsKmsStack(app, `secrets-kms-${stage.stageName}`, {
    ...baseParams,
  });

  const apiDomainName = stage.isProd
    ? stage.apiRootDomainName
    : `${stage.stageName}.${stage.apiRootDomainName}`;

  new ApiGatewayDomainStack(app, `api-gateway-domain-${stage.stageName}`, {
    ...baseParams,
    apiDomainName,
    rootDomainName: stage.apiRootDomainName,
  });
}
