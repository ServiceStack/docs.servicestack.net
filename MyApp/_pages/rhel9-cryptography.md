---
title: Support for RHEL 9's hardened cryptography policy
---

A consequence of RedHat Enterprise Linux 9's hardened 
[system-wide cryptographic policies](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/using-the-system-wide-cryptographic-policies_security-hardening) 
is that it's incompatible with ServiceStack's current licensing mechanism which uses RSA encryption and SHA1 hashing algorithm
to protect and validate license keys.

Unfortunately this makes it no longer possible to use License Keys to run unrestricted ServiceStack Apps on default 
installs of RHEL 9 or any of its variants including [Rocky Linux 9](https://rockylinux.org).

![](/img/pages/release-notes/v8.3/bg-redhat.webp)

### Use Legacy Cryptography Policy

As it only affected a small number of users initially we recommend 
that they just switch to use
[RHEL's Legacy Cryptography Policy](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/using-the-system-wide-cryptographic-policies_security-hardening)
which allows for maximum compatibility with existing software.

### Support for RHEL 9 Default Cryptography Policy

As more customers upgraded to RHEL 9 and started experiencing the same issue, we've invested efforts to 
address this issue starting with adding support for a configurable Hashing algorithm when creating and validating
License Keys. 

Since this issue only affected a minority of our Customers we decided to go with providing a way for customers
affected by this to regenerate their License Key to support RHEL 9's hardened cryptography policy to avoid inflicting any 
additional complexity on the majority of our Customers who are unaffected by this issue.

### Generate License Key for RHEL 9+

Starting from **ServiceStack v8.3+** Customers can regenerate a new License Key with a stronger **SHA512** Hash Algorithm 
that's compatible with RHEL 9's default hardened cryptography policy by visiting:

:::{.text-3xl .text-indigo-600}
https://account.servicestack.net/regenerate-license
:::

### Future

We'll need to wait at least 1-2 years before we can make the stronger Hash Algorithm the default in order to reduce the
impact of not being able to use new License Keys on versions of ServiceStack prior to **v8.2**.

After the switch is made regenerating license keys will no longer be necessary.