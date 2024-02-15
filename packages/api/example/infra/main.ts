#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExampleApiStack } from './stacks/api-stack';
import { getStages } from '@nx-example/backend/infra/cdk';

const app = new cdk.App();

for (const stage of getStages(app.node.tryGetContext('stage') ?? 'dev')) {
  new ExampleApiStack(app, `example-api-${stage.stageName}`, {
    rootDomainName: stage.apiRootDomainName,
    stage: stage.stageName,
    env: {
      account: stage.accountId,
      region: stage.region,
    },
  });
}
