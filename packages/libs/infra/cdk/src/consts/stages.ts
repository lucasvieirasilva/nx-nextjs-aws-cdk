export const stages = [
  {
    accountId: '123456789012',
    stageName: 'prod',
    apiRootDomainName: 'api.example.com',
    rootDomainName: 'example.com',
    region: 'us-east-1',
    isProd: true,
    cidr: '10.0.0.0/16',
  },
  {
    accountId: '123456789012',
    stageName: 'dev',
    apiRootDomainName: 'api.dev.example.com',
    rootDomainName: 'dev.example.com',
    region: 'us-east-1',
    isProd: false,
    cidr: '11.0.0.0/16',
  },
  {
    accountId: '123456789012',
    stageName: 'test',
    apiRootDomainName: 'api.test.example.com',
    rootDomainName: 'test.example.com',
    region: 'us-east-1',
    isProd: false,
    cidr: '12.0.0.0/16',
  },
];

export const getStages = (env?: string) => {
  if (env) {
    return stages.filter((stage) => stage.stageName === env);
  }
  return stages;
};
