---
slug: servicestack-in-fastcgi-hosted-on-nginx
title: Run ServiceStack in FastCGI hosted on nginx
---

FastCGI is a protocol for interfacing programs with a web server. In this case we're going to interface with nginx. This guide will show you how to host a simple hello world application in nginx.

## Install prerequisites 

The tutorial is written using Ubuntu 12.04. At the time of writing I using the following versions.

* nginx - 1.1.19-1
* mono - 2.10.8.1
* mono-fastcgi-server4 - 2.10.0.0

The easiest way to get started is using apt-get

```bash
sudo apt-get install mono
sudo apt-get install mono-fastcgi-server4
sudo apt-get install nginx
```

## Service example

The earlier example of [Create your first webservice](/create-your-first-webservice) provides us with everything we need for this demo. If you're feeling very lazy you can [grab one of the examples.](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/ServiceStack.Hello)

## nginx configuration
First start by editing your nginx config

``` bash
sudo vim /etc/nginx/sites-available/default 
```

replace the server tag with the following config

```
server {
  listen 80; ## listen for ipv4
  location / {
    root /var/www;
      index index.html index.htm;
      fastcgi_pass unix:/tmp/SOCK-ServiceStack;
      include /etc/nginx/fastcgi_params;
  }
}
```

then restart nginx

```
sudo /etc/init.d/nginx restart 
```

## Fast CGI

You need to launch fastcgi from within the directory that has your web.config. 
You can run fastcgi with the following command

```
fastcgi-mono-server4 /applications=/:. /filename=/tmp/SOCK-ServiceStack /socket=unix
```

Alternatively you can provide the path /applications=/:/path/to/web_config_directory

This will run fastcgi-mono-server4 as the current user and will change the permissions on the socket to be that of the current user. You will need to setup your permissions so that the www-data group/user has read-write access to /tmp/SOCK-ServiceStack. To get up and running you can do the following

```
sudo chgrp www-data /tmp/SOCK-ServiceStack
sudo chmod g+rw /tmp/SOCK-ServiceStack
```

And that's it you should be up and running. You can now visit your site running on [localhost](http://localhost/hello/service%20stack%20running%20in%20mono%20on%20nginx) 

## References

* [Mono Fast Cgi] (http://www.mono-project.com/FastCGI)
* [Mono Fast Cgi with Nginx] (http://www.mono-project.com/FastCGI_Nginx)
* [nginx] (http://wiki.nginx.org/Main)
* [What is the best way to run ServiceStack on Linux / Mono?](http://stackoverflow.com/questions/12188356/what-is-the-best-way-to-run-servicestack-on-linux-mono) answered on [StackOverflow](http://stackoverflow.com)
