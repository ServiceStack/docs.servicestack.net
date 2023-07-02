---
title: Contributing
---

## Ask a support question

The easiest way to ask support questions is on [Stack Overflow](http://stackoverflow.com/search?q=servicestack) using the #ServiceStack hash tag. ServiceStack Customers also have access to the customer support channels [listed on their support page](http://servicestack.net/account/support).

## Proposing a Feature 

Feature requests can be proposed on [ServiceStack's User Voice](https://servicestack.net/ideas). Proposals can also be made via code samples in GitHub pull-requests.

## Contributing code

Our source is developed & published on GitHub.com ([learn more](https://help.github.com/)). If you are new to [Git](http://git-scm.com), check out the [Pro Git Book](http://git-scm.com/book) online or at your bookseller of choice.

From any of the ServiceStack code repositories on GitHub, you can **Fork** the code to your own GitHub account.

To get the source on your local development machine, simply clone your local forked repo using Git:

:::sh
git clone https://github.com/USERNAME/PROJECT.git
:::

Each repository has a README that should be helpful to learn more about the specifics of the language, project and its development environment.

Please ensure any code contributions include tests that should verify the behavior of new features, verify the issue that a fix fixes and to prevent future regressions or even a reproducible failing tests if you want to report an issue.

## Contribution License Agreement (CLA)

In order to become a contributor to the ServiceStack projects on GitHub you must follow some legal requirements and [approve the ServiceStack Contributor License Agreement](https://docs.google.com/forms/d/16Op0fmKaqYtxGL4sg7w_g-cXXyCoWjzppgkuqzOeKyk/viewform).

Until you meet the legal requirements your pull requests / source contributions will not be considered or reviewed.

Please configure your Git client with a name and email address to use for your commits. This will also help the team validate your CLA status:

```bash
git config user.name Your Name
git config user.email YourAlias@YourEmailDomain
```

## Step-by-step guide

Checkout the latest code

In order to obtain the source code you need to become familiar with Git (see [progit.org/book/](http://progit.org/book/)) and Github (see [help.github.com/](http://help.github.com/)) and you need to have Git installed on your local machine. You can obtain the source code from Github by following the these steps on your local machine:

  1. Go to https://github.com/ServiceStack/[PROJECT]
  2. In GitHub Click on the **Fork** button
  3. Clone the repository on your local machine with the following Git command `git clone git@github.com:[USERNAME]/[PROJECT]`

### Create bug fixes and features

You can then start to make modifications to the code in your local Git repository. For commits to ServiceStack v3, this should be done in the `v3` branch. Note: all contributions must come with tests verifying the desired behavior.

You can commit your work with following commands:

  1. Switch to the master branch (or v3 branch) for ServiceStack v3.x
      `git checkout master`
  2. Add and commit your local changes
      `git commit -a -m 'commit message describing changes'`
  3. Push your changes from your local repository to your github fork
      `git push origin v3`

Once your code is in your github fork, you can then submit a pull request for the team's review. You can do so with the following commands:

  1. In GitHub click on the **Pull Request** button 
  2. In the pull request select your fork as source and `ServiceStack/[PROJECT]` as destination for the request
  3. Write detailed message describing the changes in the pull request
  4. Submit the pull requst for consideration by the Core Team

If there are conflicts between your fork and the main project one, github will warn you that the pull request cannot be merged. If that's the case, you can do the following:

  1. Add remote to your local repository using the following Git commands
    `git remote add upstream -f git@github.com:ServiceStack/[PROJECT]`
  2. Update your local repository with the changes from the remote repository by using the following Git commands (make sure you're in the branch you're submitting the code from)
    `git merge upstream/master`
  3. Resolve any conflicts locally and finally do another push with the command
    `git push origin master`

Please keep in mind that not all requests will be approved. Requests are reviewed by the Core Team on a regular basis and will be updated with the status at each review. If your request is accepted you will receive information about the next steps and when the request will be integrated in the main branch. If your request is rejected you will receive information about the reasons why it was rejected.

## Code Reviews

Feature requests should be proposed on [ServiceStack Ideas](https://servicestack.net/ideas), whilst general ServiceStack discussions can be posted on [ServiceStack/Discuss](https://servicestack.net/discuss) for submitting code reviews and discussing design changes, best practices, and other important topics. Any disruptive changes to any project should be discussed here before any code is contributed.

Expect a good amount of feedback as part of any pull request: not only which branch to merge to and from, but also consistency guidelines, matching existing code, and making targeted, smart changes when fixing bugs.

## Thank you

Huge thanks go to the contributors from the community who have been actively working with the ServiceStack community.

You can find a [list of contributors here](https://github.com/ServiceStack/ServiceStack#contributors).
