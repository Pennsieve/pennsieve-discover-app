const awsConfig = {
  Auth: {
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID
  }
}
export default awsConfig
