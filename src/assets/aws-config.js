
const aws_app_analytics = 'enable';
const aws_cognito_identity_pool_id = 'us-west-2:482c9454-7817-4c8e-842e-2468362e6ee4';
const aws_cognito_region = 'us-west-2';
const aws_content_delivery = 'enable';
const aws_content_delivery_bucket = 'adaapp-hosting-mobilehub-409092687';
const aws_content_delivery_bucket_region = 'us-west-2';
const aws_content_delivery_cloudfront = 'enable';
const aws_content_delivery_cloudfront_domain = 'djry501gon8lj.cloudfront.net';
const aws_dynamodb = 'enable';
const aws_dynamodb_all_tables_region = 'us-west-2';
const aws_dynamodb_table_schemas = [{"tableName":"ionic-mobile-hub-ada","attributes":[{"name":"userId","type":"S"},{"name":"taskId","type":"S"},{"name":"category","type":"S"},{"name":"created","type":"N"},{"name":"description","type":"S"}],"indexes":[{"indexName":"DateSorted","hashKey":"userId","rangeKey":"created"}],"region":"us-west-2","hashKey":"userId","rangeKey":"taskId"}];
const aws_mobile_analytics_app_id = '5387b320960e42a2b58efa48a1b797a6';
const aws_mobile_analytics_app_region = 'us-east-1';
const aws_project_id = '78440169-3f94-4e29-bc01-b58f55e865e6';
const aws_project_name = 'ada-app';
const aws_project_region = 'us-west-2';
const aws_resource_name_prefix = 'adaapp-mobilehub-409092687';
const aws_sign_in_enabled = 'enable';
const aws_user_files = 'enable';
const aws_user_files_s3_bucket = 'adaapp-userfiles-mobilehub-409092687';
const aws_user_files_s3_bucket_region = 'us-west-2';
const aws_user_pools = 'enable';
const aws_user_pools_id = 'us-west-2_t9mKvMEuE';
const aws_user_pools_mfa_type = 'OFF';
const aws_user_pools_web_client_id = '55ikbijqc0fute6d0cnna3hcbi';
const aws_user_settings = 'enable';

AWS.config.region = aws_project_region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: aws_cognito_identity_pool_id
  }, {
    region: aws_cognito_region
  });
AWS.config.update({customUserAgent: 'MobileHub v0.1'});
