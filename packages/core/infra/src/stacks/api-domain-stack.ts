import * as cdk from 'aws-cdk-lib';
import { DomainName, EndpointType } from 'aws-cdk-lib/aws-apigateway';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

interface ApiGatewayDomainStackProps extends cdk.StackProps {
  stage: string;
  apiDomainName: string;
  rootDomainName: string;
}

export class ApiGatewayDomainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayDomainStackProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.rootDomainName,
    });

    const certificate = new Certificate(this, 'Certificate', {
      domainName: props.apiDomainName,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    const domain = new DomainName(this, 'ApiGatewayDomain', {
      certificate,
      domainName: props.apiDomainName,
      endpointType: EndpointType.EDGE,
    });

    new ARecord(this, 'ApiGatewayDomainAliasRecord', {
      zone: hostedZone,
      recordName: props.apiDomainName,
      target: RecordTarget.fromAlias(new ApiGatewayDomain(domain)),
    });

    new StringParameter(this, 'ApiGatewayDomainNameParam', {
      parameterName: `/${props.stage}/api-gateway/domain-name`,
      stringValue: domain.domainName,
    });

    new StringParameter(this, 'ApiGatewayDomainAliasHostedZoneParam', {
      parameterName: `/${props.stage}/api-gateway/alias-hosted-zone-id`,
      stringValue: domain.domainNameAliasHostedZoneId,
    });

    new StringParameter(this, 'ApiGatewayDomainAliasDomainNameParam', {
      parameterName: `/${props.stage}/api-gateway/alias-domain-name`,
      stringValue: domain.domainNameAliasDomainName,
    });
  }
}
