---
title: AWS Project Templates
slug: templates-aws
---

<div class="not-prose my-8 ml-20 flex justify-center"><svg style="max-width:200px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 364.707 364.707" enable-background="new 0 0 364.707 364.707"
	 xml:space="preserve">
<path fill="#F37B21" d="M223.864,272.729l-38.608-97.848l-56.603,89.184H93.166l79.052-127.654l-8.875-25.229h-30.781V81.12h52.691
	l60.521,153.899l26.608-8.668l8.867,29.813L223.864,272.729z"/>
<path fill="none" stroke="#F37B21" stroke-width="34" d="M337.623,182.198c0,85.579-69.363,154.934-154.934,154.934
	c-85.571,0-154.936-69.354-154.936-154.934c0-85.569,69.363-154.933,154.936-154.933C268.259,27.265,337.623,96.629,337.623,182.198 z"/>
</svg></div>

.NET 6.0 Amazon AWS Lambda Container Project Template

## aws-lambda

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="8mpGNTsSlvE" style="background-image: url('https://img.youtube.com/vi/8mpGNTsSlvE/maxresdefault.jpg')"></lite-youtube>

> YouTube: [https://youtu.be/8mpGNTsSlvE](https://youtu.be/8mpGNTsSlvE)

This project lets you create a .NET 6 empty ServiceStack web project ready for deployment as a AWS Lambda Function wired with API GateWay and packaged via a Docker image.

Create new project with [x dotnet tool](/dotnet-new):

```bash
$ dotnet tool install -g x
$ x new aws-lambda ProjectName
```

### Prerequisites

- [.NET Core SDK 3.1 (runtime 5.0+) or higher](https://dotnet.microsoft.com/download/dotnet-core/3.1)
- [AWS .NET Core CLI](https://docs.aws.amazon.com/lambda/latest/dg/csharp-package-cli.html)
- [AWS account](https://aws.amazon.com/free/)

### Built with GitHub Actions

The above pre-requisites are setup ready to use with this template via GitHub Actions.

GitHub Actions need to authenticate with AWS required to deploy your application. To enable this you'll need to setup an IAM account specifically to enable this. This IAM account will need the permissions required to create and manage all the related AWS resources.

Below is an example of a IAM policy for a 'deploy' user that will be able to use the `serverless.template` CloudFormation file with AWS .NET Core CLI.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:TagResource",
        "lambda:AddPermission",
        "lambda:ListFunctions",
        "lambda:InvokeFunction",
        "lambda:InvokeAsync",
        "lambda:GetFunctionConfiguration",
        "lambda:GetFunction",
        "lambda:UpdateAlias",
        "lambda:UpdateFunctionCode",
        "lambda:DeleteAlias",
        "lambda:DeleteFunction",
        "lambda:PublishVersion",
        "lambda:CreateAlias",
        "iam:DeleteRole",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "iam:DetachRolePolicy",
        "cloudformation:*",
        "apigateway:*",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:DescribeRepositories",
        "ecr:BatchCheckLayerAvailability",
        "ecr:CreateRepository",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetAuthorizationToken",
        "ecr:PutImage",
        "ecr:SetRepositoryPolicy",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:GetRepositoryPolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

### Use Case for ServiceStack App on AWS Lambda
AWS Lambda Containers allows the use of standard docker tooling with AWS serverless offering which for low traffic volume applications or APIs can be an extremely cost effective way of hosting an application.

AWS provides a Lambda [free-tier of 1M requests and 400,000GB-seconds of compute time per month](https://aws.amazon.com/lambda/pricing/). This can be enough traffic for many full ServiceStack APIs or applications.

### Deployment process
The provided GitHub Action YAML configures a workflow to build, test, package and deploy your ServiceStack Application with AWS Lambda and API GateWay.

Additional configuration is needed to get your application accessible from a friendly name subdomain. This can be done with API GateWay Mapping and Route 53.

### Public access via custom subdomain
If you want to use this ServiceStack app external from AWS, you'll need create a "Custom Domain" within API GateWay and setup an `A` record in Route53 to a hosted zone.

 - Navigate to [API GateWay AWS Console](https://console.aws.amazon.com/apigateway/main/publish/domain-names).
 - Select "Create" and specify the domain name and provide associated TLS certificate. If you don't yet have one, one can be created via AWS Certificate Manager or provided directly to this UI.
 - Once created, configure an API Mapping.
 - Specify the API Gateway and Stage.
 - View configuration and look for `API Gateway domain name`, copy this value ready for use in Route 53 configuration.
 - Select the hosted zone related to your subdomain in Route 53
 - Create an `A` record pointing to your `API Gateway domain name` copied from previous step

Your application should now be viewable from your custom domain!

### AWS Lambda Cold starts
Just like any AWS Lambda application or function, the latency impacts of 'cold starts' are something that can impact user experience significantly depending on your expected traffic load. When your function hasn't received any traffic for while, AWS Lambda will stop your container. Once a new request comes in, AWS Lambda needs to start up your application and wait for it to be ready to take your request. This creates the cold start latency problem. This also happens when there are already too many concurrent requests, to handle the increased load AWS Lambda will create new instances of your container to handle those requests.

If your load is low and expected, you can use tools like uptimerobot or others to periodically hit your application endpoint to keep at least one container alive to reduce this cold start latency.

Alternatively [AWS Provisioned Capacity](https://aws.amazon.com/blogs/aws/new-provisioned-concurrency-for-lambda-functions/) can be used (at additional cost) to mitigate these limitations.
