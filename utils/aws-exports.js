const awsConfig = {
  Auth: {
    region: process.env.region,
    userPoolId: process.env.userPoolId,
    userPoolWebClientId: process.env.userPoolWebClientId,
    authenticationFlowType: process.env.authenticationFlowType
  }
}
export default awsConfig
