const awsConfig = {
  Auth: {
    region: process.env.region,
    userPoolId: process.env.userPoolId,
    userPoolWebClientId: process.env.userPoolWebClientId,
    authenticationFlowType: process.env.authenticationFlowType,
    oauth: {
      domain: process.env.oauthDomain,
      scope: process.env.oauthScope,
      redirectSignIn: process.env.oauthRedirectSignIn,
      redirectSignOut: process.env.oauthRedirectSignOut,
      responseType: process.env.oauthResponseType
    }
  }
}
export default awsConfig
