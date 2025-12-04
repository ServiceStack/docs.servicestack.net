---
title: Troubleshooting
---

### x: command not found

If after installing any of the `dotnet` tools it fails with `bash: x: command not found` you'll need to add **dotnet tools** to your `PATH` 
which you can do in Linux Bash with:

```bash
$ echo "export PATH=\$HOME/.dotnet/tools:\$PATH" >> ~/.bashrc
$ . ~/.bashrc
```

### SSL Connection Errors

To resolve SSL Connection errors you can try [commenting out ssl_conf = ssl_sect](https://github.com/dotnet/corefx/issues/33179#issuecomment-435118249), e.g:

```bash
$ sudo vi /etc/ssl/openssl.cnf
```

Comment out line in `vi` using a `#` prefix, write changes and quit:

```
:%s/^ssl_conf/#&/
:wq
```

If that doesn't resolve the issue you can try [updating the local ca-certificates](https://github.com/dotnet/corefx/issues/30147#issuecomment-410526404):

```bash
$ sudo update-ca-certificates --fresh
```

Or try [updating the SSL_CERT Environment variables](https://github.com/dotnet/core/issues/1941#issuecomment-421387136) before running the tool again:

```bash
export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
export SSL_CERT_DIR=/dev/null
```

Finally you can try running the `x` tool with the `--ignore-ssl-errors` switch, e.g:

```bash
$ npx create-net vue-lite VueLite --ignore-ssl-errors
```
