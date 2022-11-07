import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'; // L2
import * as rds from 'aws-cdk-lib/aws-rds';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const systemName = this.node.tryGetContext('systemName');
    const stageName = this.node.tryGetContext('stageName');

    // VPC(L2)
    const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: `${systemName}-${stageName}-vpc`,
//      cidr: '10.0.0.0/16',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${systemName}-${stageName}-subnet-public`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: `${systemName}-${stageName}-subnet-private`,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })

    // Raw overrides to L1 construct (Escape Hatching / Bypassing)
    const cfnPublicSubnet1 = vpc.publicSubnets[0].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet1.addPropertyOverride('CidrBlock', `10.0.11.0/24`)
    const cfnPublicSubnet2 = vpc.publicSubnets[1].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet2.addPropertyOverride('CidrBlock', `10.0.12.0/24`)
    const cfnPrivateSubnet1 = vpc.publicSubnets[0].node.defaultChild as ec2.CfnSubnet
    cfnPrivateSubnet1.addPropertyOverride('CidrBlock', `10.0.21.0/24`)
    const cfnPrivateSubnet2 = vpc.publicSubnets[1].node.defaultChild as ec2.CfnSubnet
    cfnPrivateSubnet2.addPropertyOverride('CidrBlock', `10.0.22.0/24`)

    // RDS
    // const cluster = new rds.DatabaseCluster(this, 'Database', {
    //   engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
    //   credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'), // Optional - will default to 'admin' username and generated password
    //   instanceProps: {
    //     // optional , defaults to t3.medium
    //     instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
    //     vpcSubnets: {
    //       subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    //     },
    //     vpc,
    //   },
    // });

    // ECS


  }
}
