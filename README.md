POSTGRAM

https://auth0.com/blog/modern-full-stack-development-with-nestjs-react-typescript-and-mongodb-part-2/

https://dev.to/fullstack_to/use-auth0-to-secure-your-nestjs-application-mbo
Getting client token:
https://node-rpc.auth0.com/authorize?audience=postgram-api&scope=SCOPE&response_type=code&client_id=TbtKhEN6O6gJS6xuOGr0JZbbKB0NdVHQ&redirect_uri=http://localhost:7000&state=STATE?prompt=none

aKcXwVddgy3Gn-KR

curl -X POST -H 'content-type: application/json' -d '{
  "grant_type": "authorization_code",
  "client_id": "'TbtKhEN6O6gJS6xuOGr0JZbbKB0NdVHQ'",
  "client_secret": "'7BLr2XFHfkcke28MT782v_CnmRavOABL1tRroY0conJqok3fO05LWMhOmW9gEDWv'",
  "code": "'0IpALiRqs6r1R2PQ'",
  "redirect_uri": "http://localhost:7000"
}' https://node-rpc.auth0.com/oauth/token
