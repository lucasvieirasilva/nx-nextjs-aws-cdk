import { SSTConfig } from 'sst';
import { ExampleUIApp } from './infra/next-app';

export default {
  config({ stage }) {
    return {
      name: `example-ui-${stage}`,
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(ExampleUIApp, {
      stackName: `example-ui-nextjs-app-${app.stage}`,
    });
  },
} satisfies SSTConfig;
