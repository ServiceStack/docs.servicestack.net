---
slug: java
title: Java Resources
---

The `net.servicestack:client` package provides a typed `JsonServiceClient` for calling ServiceStack APIs from any
**Java 8+** JVM Application, whilst `net.servicestack:android` adds Android-specific Async APIs and Server Events
support:

```groovy
dependencies {
    implementation 'net.servicestack:client:1.1.5'
}
```

Generate the Typed DTOs for any ServiceStack API with [npx get-dtos](/npx-get-dtos):

:::sh
npx get-dtos java https://test.servicestack.net
:::

Then call APIs by sending populated Request DTOs:

```java
JsonServiceClient client = new JsonServiceClient("https://test.servicestack.net");

HelloResponse response = client.get(new Hello().setName("World"));
System.out.println(response.getResult()); //= Hello, World!
```

## Docs

 - [Java Add ServiceStack Reference](/java-add-servicestack-reference)
 - [Java Server Events Client](/java-server-events-client)
 - [Kotlin Add ServiceStack Reference](/kotlin-add-servicestack-reference)
 - [Release Notes for Java Support](/releases/v4_0_40#native-support-for-java-and-android-studio)

## Source and Packages

 - [ServiceStack.Java](https://github.com/ServiceStack/ServiceStack.Java) - Java Client, Server Events Client and IDE plugins
 - [net.servicestack:client](https://mvnrepository.com/artifact/net.servicestack/client) - pure Java client package
 - [net.servicestack:android](https://mvnrepository.com/artifact/net.servicestack/android) - Android client package
 - [Java Client Test Suite](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/AndroidClient/client/src/test/java/net/servicestack/client) - Live examples of all client features
 - [Java LINQ Examples](https://github.com/mythz/java-linq-examples) - C#'s 101 LINQ Samples in Java

## Live Demos

 - [TechStacks Android App](https://github.com/ServiceStackApps/TechStacksAndroidApp)
 - [Android Java Chat](https://github.com/ServiceStackApps/AndroidJavaChat)
