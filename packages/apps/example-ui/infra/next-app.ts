import { StackContext, NextjsSite } from 'sst/constructs';

export function ExampleUIApp({ stack, app }: StackContext) {
  // const domainName = process.env.DOMAIN_NAME as string;
  // const hostedZoneName = process.env.HOSTED_ZONE_NAME as string;

  // const hostedZone = HostedZone.fromLookup(stack, 'HostedZone', {
  //   domainName: hostedZoneName,
  // });

  // const certificate = new Certificate(stack, 'Certificate', {
  //   domainName,
  //   validation: CertificateValidation.fromDns(hostedZone),
  // });

  new NextjsSite(stack, 'site', {
    path: '.',
    edge: true,
    buildCommand: [
      'npx',
      '--yes',
      'open-next@2.3.4',
      'build',
      `--build-command 'cd $NX_WORKSPACE_ROOT; npx nx run frontend-example-ui:build:${app.stage}'`,
      '--minify',
    ].join(' '),
    // customDomain: {
    //   domainName,
    //   cdk: {
    //     certificate,
    //     hostedZone,
    //   },
    // },
  });

  // stack.addOutputs({
  //   SiteUrl: `https://${domainName}`,
  // });
}
