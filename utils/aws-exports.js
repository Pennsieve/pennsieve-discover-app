const awsConfig = {
  Auth: {
    region: process.env.region,
    userPoolId: process.env.userPoolId,
    userPoolWebClientId: process.env.userPoolWebClientId
  }
}
export default awsConfig
