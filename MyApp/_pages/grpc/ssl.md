---
slug: grpc-ssl
title: gRPC SSL Configuration
---

By default gRPC projects uses ASP.NET Core's trusted Development certificate (typically created on install), or can be configured with:

:::sh
dotnet dev-certs https --trust
:::

Many other languages requires this development certificate in order to establish a secure SSL connection, which can be exported with:

## Exporting your Development Certificate

Export your localhost self-signed .NET Core development certificate with:

:::sh
dotnet dev-certs https --export-path .
:::

If that fails see if you can diagnose and resolve the issue from the verbose output:

:::sh
dotnet dev-certs https --export-path . --verbose
:::

If you can't keep copy of the certificates **thumbprint**, then export it via Windows Certificate Manager:

:::sh
certmgr
:::

1. Go to `Personal > Certificates`
2. Select certificate **Issued To** `localhost`
    - If you have multiple certificates it's likely the one that expires the latest (double-check with thumbprint above to make sure)
3. Click on `Action > All Tasks > Export`
4. In the Export Wizard select **No, do not export the private key**
5. Select 2nd option **Base-64 encoded X.509 (.CER)**
6. Save to `localhost.cer`

### Generating a new Development Certificate

Should you prefer, you can create and use your own self-signed certificate using this OpenSSL script.

A quick way to download them is using the [mix tool](/mix-tool):

:::sh
x mix -name ProjectName gen.https.sh
:::

Otherwise you can create local text files and manually copy them with the contents below:

#### [gen-dev.https.sh](https://github.com/NetCoreTemplates/grpc/blob/master/scripts/gen-dev.https.sh)

```shell
PASSWORD=grpc
if [ $# -ge 1 ]
  then
    PASSWORD=$1
fi

cat <<EOT >>dev.config
[ req ]
default_bits       = 2048
default_md         = sha256
default_keyfile    = dev.key
prompt             = no
encrypt_key        = no

distinguished_name = dn
req_extensions     = v3_req
x509_extensions    = x509_req
string_mask        = utf8only

[ dn ]
commonName             = localhost dev cert
emailAddress           = test@localtest.me
countryName            = US
stateOrProvinceName    = DE
localityName           = Wilmington
organizationName       = Todo World

[ x509_req ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints       = critical, CA:false
keyUsage               = critical, keyEncipherment
subjectAltName         = @alt_names
# extendedKeyUsage  = serverAuth, clientAuth
nsComment              = "OpenSSL Generated Certificate"

[ v3_req ]
subjectKeyIdentifier   = hash
basicConstraints       = critical, CA:false
subjectAltName         = @alt_names
# extendedKeyUsage  = serverAuth, clientAuth
nsComment              = "OpenSSL Generated Certificate"

[ alt_names ]
DNS.1                  = localhost
EOT

openssl req -config dev.config -new -out dev.csr.pem
openssl x509 -req -days 365 -extfile dev.config -extensions v3_req -in dev.csr.pem -signkey dev.key -out dev.crt
openssl pkcs12 -export -out dev.pfx -inkey dev.key -in dev.crt -password pass:$PASSWORD
rm dev.config dev.csr.pem
# cp dev.pfx ../MyApp
```

Linux or WSL Bash:

:::sh
./gen-dev.https.sh
:::

Windows:

:::sh
bash gen-dev.https.sh
:::

Options:

:::sh
gen-dev.https.sh $PASSWORD
:::

### Trust Certificate on Windows

Import the pfx certificate:

```bash
powershell Import-PfxCertificate -FilePath dev.pfx Cert:\LocalMachine\My -Password (ConvertTo-SecureString grpc -asplaintext -force) -Exportable
```

Trust the certificate by importing the pfx certificate into your trusted root:

:::sh
powershell Import-Certificate -FilePath dev.crt -CertStoreLocation Cert:\CurrentUser\Root
:::

### Trust Certificate on Linux or macOS

See [Configuring HTTPS in ASP.NET Core across different platforms](https://devblogs.microsoft.com/aspnet/configuring-https-in-asp-net-core-across-different-platforms/) for examples of trusting SSL Certificates on different platforms.

Although recommended it's not necessary to trust self-signed certificates to enable secure gRPC SSL endpoints as servers and clients 
can be configured to use these OpenSSL generated self-signed certificates without out-of-band certificate registration.

## Generating a new Production Certificate

#### [gen-prod.https.sh](https://github.com/NetCoreTemplates/grpc/blob/master/scripts/gen-prod.https.sh)

```shell
DOMAIN=todoworld.servicestack.net
if [ $# -ge 1 ]
  then
    DOMAIN=$1
fi

PASSWORD=grpc
if [ $# -ge 2 ]
  then
    PASSWORD=$2
fi

cat <<EOT >>prod.config
[ req ]
default_bits       = 2048
default_md         = sha256
default_keyfile    = prod.key
prompt             = no
encrypt_key        = no
distinguished_name = dn
req_extensions     = v3_req
x509_extensions    = x509_req
string_mask        = utf8only
[ dn ]
commonName             = TodoWorld prod cert
emailAddress           = todoworld@servicestack.net
countryName            = US
stateOrProvinceName    = DE
localityName           = Wilmington
organizationName       = Todo World
[ x509_req ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints       = critical, CA:false
keyUsage               = critical, keyEncipherment
subjectAltName         = @alt_names
# extendedKeyUsage     = serverAuth, clientAuth
nsComment              = "OpenSSL Generated Certificate"
[ v3_req ]
subjectKeyIdentifier   = hash
basicConstraints       = critical, CA:false
subjectAltName         = @alt_names
# extendedKeyUsage     = serverAuth, clientAuth
nsComment              = "OpenSSL Generated Certificate"
[ alt_names ]
DNS.1                  = $DOMAIN
EOT

openssl req -config prod.config -new -out prod.csr.pem
openssl x509 -req -days 365 -extfile prod.config -extensions v3_req -in prod.csr.pem -signkey prod.key -out prod.crt
openssl pkcs12 -export -out prod.pfx -inkey prod.key -in prod.crt -password pass:$PASSWORD
rm prod.config prod.csr.pem
# cp prod.pfx ../MyApp
# cp prod.crt ../MyApp/wwwroot/grpc.crt
```

Either replace `DOMAIN=...` and `PASSWORD=...` with your domain and password or specify them as arguments, e.g:

Linux or WSL Bash:

:::sh
./gen-prod.https.sh $DOMAIN $PASSWORD
:::

Windows:

:::sh
bash gen-prod.https.sh $DOMAIN $PASSWORD
:::

### .NET Core Configuration

When configuring a custom SSL Certificate directly in a .NET Core App you'll need to configure the **GrpcSecure** endpoint 
with the combined [PKCS #12](https://en.wikipedia.org/wiki/PKCS_12) **.pfx** certificate, e.g:

```json
{
  "Kestrel": {
    "Endpoints": {
      "GrpcSecure": {
        "Url": "https://*:5051",
        "Protocols": "Http2",
        "Certificate": {
          "Path": "dev.pfx",
          "Password": "grpc"
        }
      }
    }
  }
}
```

### Nginx

When hosting public gRPC endpoints its HTTP/2 endpoints are generally incompatible with existing HTTP/1.1 gateways and proxies
that should effectively be treated as different channels and hosted on different ports.

Nginx added [native support for gRPC in v1.13.10](https://www.nginx.com/blog/nginx-1-13-10-grpc/) which works as well you'd expect
where you can proxy gRPC requests to downstream .NET Core gRPC SSL and plain-text endpoints, but it doesn't support proxying 
HTTP/2 requests on the same port as proxying standard HTTP/1.1 requests so you'll need to use a different port if you have
other standard HTTP websites you're proxying on the same server.

Below is the nginx configuration used in [https://todoworld.servicestack.net](https://todoworld.servicestack.net) which covers
the most popular gRPC hosting scenarios:

#### Plain text gRPC

```nginx
server {
    listen      50054 http2;
    server_name todoworld.servicestack.net;

    location / {
        grpc_pass grpc://127.0.0.1:5054;
    }
}
```

### SSL terminated gRPC endpoint

```nginx
server {
    listen      50051 http2 ssl;
    server_name todoworld.servicestack.net;

    location / {
        grpc_pass grpc://127.0.0.1:5054;
    }

    ssl_certificate /home/deploy/apps/certs/todoworld/prod.crt;
    ssl_certificate_key /home/deploy/apps/certs/todoworld/prod.key;
}
```

### Proxying Internal SSL gRPC Requests

```nginx
server {
    listen      50052 http2 ssl;
    server_name todoworld.servicestack.net;

    location / {
        grpc_pass grpcs://127.0.0.1:5051;
    }

    ssl_certificate /home/deploy/apps/certs/todoworld/prod.crt;
    ssl_certificate_key /home/deploy/apps/certs/todoworld/prod.key;
}
```

### Integration tests of different gRPC endpoints

You can quickly test each of these gRPC Endpoints by downloading the [C# Add ServiceStack Reference](/csharp-add-servicestack-reference) DTOs with:

:::sh
`x csharp https://todoworld.servicestack.net`
:::

Which can be used to test gRPC Services on each of the different gRPC endpoints below:

```csharp
public static GrpcServiceClient SecureProdClient(int port) => 
    new GrpcServiceClient($"https://todoworld.servicestack.net:{port}",
        new X509Certificate2("https://todoworld.servicestack.net/grpc.crt".GetBytesFromUrl()),
        GrpcUtils.AllowSelfSignedCertificatesFrom("todoworld.servicestack.net"));

public static GrpcServiceClient InsecureProdClient(int port)
{
    GrpcClientFactory.AllowUnencryptedHttp2 = true;
    return new GrpcServiceClient($"http://todoworld.servicestack.net:{port}");
}

// SSL Nginx -> plain-text .NET Core
var client = SecureProdClient(50051);

// SSL Nginx -> SSL .NET Core
var client = SecureProdClient(50052);

// Text Nginx -> Text .NET Core
var client = InsecureProdClient(50054);
```

You can also test directly against the gRPC endpoints on the .NET Core server:

```csharp
// SSL .NET Core
var client = SecureProdClient(5051);

// Text .NET Core
var client = InsecureProdClient(5054);
```

### Troubleshooting

If you're experiencing network connection issues trying to connect with your own gRPC hosted service, make sure you've opened
access to each of the non-standard ports used. Example using Ubuntu's UFW firewall:

:::sh
ufw allow 50051
:::

### Lets Encrypt

[Let's Encrypt](https://letsencrypt.org) has the nice property that it provides free, automated certificates from an open CA that's trusted
in most operating systems and browsers and whilst it's possible to use Lets Encrypt for public gRPC endpoints although it's generally discouraged
and not recommended for usage in internal applications, from [Jacob Hoffman-Andrews](https://twitter.com/j4cob) of Let's Encrypt:

> In general, I recommend that people don’t use Let’s Encrypt certificates for gRPC or other internal RPC services. In my opinion, it’s both easier and safer to generate a single-purpose internal CA using something like minica and generate both server and client certificates with it. That way you don’t have to open up your RPC servers to the outside internet, plus you limit the scope of trust to just what’s needed for your internal RPCs, plus you can have a much longer certificate lifetime, plus you can get revocation that works.

Whilst it's not recommended to use Let's Encrypts short-lived certificates for securing gRPC endpoints, the easiest way to use them is to 
have them SSL terminated at your reverse proxy fronting your .NET Core App and have it proxy gRPC Requests to an internal plain-text gRPC endpoint,
nginx example:

```nginx
server {
    listen      50051 http2 ssl;
    server_name $DOMAIN;

    location / {
        grpc_pass grpc://127.0.0.1:5054;
    }

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;   # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem; # managed by Certbot
}
```

They could also be used to secure the gRPC endpoint on your .NET Core App as well but that would require coordinating the re-creation of a **.pfx** certificate after Lets Encrypt certificates are renewed.
