import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AccessLogFormat,
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  EndpointType,
  IResource,
  LambdaIntegration,
  LogGroupLogDestination,
  RestApi,
  SecurityPolicy,
  BasePathMapping,
  DomainName,
} from 'aws-cdk-lib/aws-apigateway';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export type ProxyRestApiProps = {
  restApiName: string;
  stage: string;
  handler: IFunction;
  hostedZone?: IHostedZone;
  apiDomainName?: string;
  basePath?: string;
  userPoolAuthorizer?: boolean;
  userPoolArn?: string;
};

export class ProxyRestApi extends Construct {
  public api: RestApi;
  public root: IResource;

  constructor(scope: Construct, id: string, props: ProxyRestApiProps) {
    super(scope, id);

    const corsOptions = {
      allowHeaders: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Headers',
      ],
      allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowCredentials: true,
      allowOrigins: Cors.ALL_ORIGINS,
    };

    const accessLogs = new LogGroup(this, 'LogGroup', {
      logGroupName: `/aws/api-gateway/${props.restApiName}`,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.TWO_WEEKS,
    });

    this.api = new RestApi(this, 'Rest', {
      restApiName: props.restApiName,
      deployOptions: {
        stageName: props.stage,
        tracingEnabled: true,
        metricsEnabled: true,
        dataTraceEnabled: true,
        accessLogDestination: new LogGroupLogDestination(accessLogs),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
      },
    });

    if (props.apiDomainName) {
      const certificate = new Certificate(this, 'Certificate', {
        domainName: props.apiDomainName,
        validation: CertificateValidation.fromDns(props.hostedZone),
      });

      this.api.addDomainName('DomainName', {
        certificate,
        domainName: props.apiDomainName,
        endpointType: EndpointType.EDGE,
        securityPolicy: SecurityPolicy.TLS_1_2,
      });
    }

    if (props.basePath) {
      new BasePathMapping(this, `BasePathMapping`, {
        restApi: this.api,
        domainName: DomainName.fromDomainNameAttributes(this, `Domain`, {
          domainNameAliasHostedZoneId: StringParameter.fromStringParameterName(
            this,
            `AliasHostedZoneId`,
            `/${props.stage}/api-gateway/alias-hosted-zone-id`,
          ).stringValue,
          domainNameAliasTarget: StringParameter.fromStringParameterName(
            this,
            `AliasDomainName`,
            `/${props.stage}/api-gateway/alias-domain-name`,
          ).stringValue,
          domainName: StringParameter.fromStringParameterName(
            this,
            `DomainName`,
            `/${props.stage}/api-gateway/domain-name`,
          ).stringValue,
        }),
        basePath: props.basePath,
        stage: this.api.deploymentStage,
      });
    }

    const authorizerEnabled =
      props.userPoolAuthorizer === undefined || props.userPoolAuthorizer;

    let methodOptions = {};

    if (authorizerEnabled && props.userPoolArn) {
      const userPool = UserPool.fromUserPoolArn(
        this,
        `UserPool`,
        props.userPoolArn,
      );

      const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
        cognitoUserPools: [userPool],
      });

      methodOptions = {
        authorizationType: AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: ['aws.cognito.signin.user.admin'],
      };
    }

    this.root = this.api.root;

    this.api.root.addCorsPreflight(corsOptions);
    this.api.root.addMethod(
      'ANY',
      new LambdaIntegration(props.handler, {
        proxy: true,
      }),
      methodOptions,
    );

    const proxy = this.api.root.addResource('{proxy+}');
    proxy.addCorsPreflight(corsOptions);
    proxy.addMethod(
      'ANY',
      new LambdaIntegration(props.handler, {
        proxy: true,
      }),
      methodOptions,
    );

    if (this.api.domainName && props.hostedZone) {
      new ARecord(this, 'AliasRecord', {
        zone: props.hostedZone,
        recordName: props.apiDomainName,
        target: RecordTarget.fromAlias(
          new ApiGatewayDomain(this.api.domainName),
        ),
      });
    }
  }
}
