export default {
    template:`<div>
        <div class="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div class="text-center">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-gray-50 sm:text-5xl md:text-6xl">
                    <span class="block">
                        AutoQuery Examples
                    </span>
                </h1>
            </div>
        </div>
        
        <div class="mt-16 mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
            <div>
                <p class="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-4xl">
                    Database-first Example Locode App
                </p>
                <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500 dark:text-gray-400">
                    To demonstrate a database-first development workflow we've enabled 
                    <a class="text-indigo-600" href="/autoquery-autogen">AutoGen</a> on the <b>Northwind</b> 
                    sample database to generate 
                    <a class="text-indigo-600" href="/autoquery-rdbms">AutoQuery</a> &amp; 
                    <a class="text-indigo-600" href="/autoquery-crud">CRUD</a> 
                    APIs whose capabilities are used to power the custom Northwind Locode App 
                </p>
            </div>
        </div>
        
        <div class="bg-white pb-8 pb-12">
          <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
            <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
              <div>
                <div>
                  <img class="h-11 w-auto" src="/img/pages/locode/northwind/logo.svg" alt="Northwind Logo">
                </div>
                <div class="mt-20">
                  <div>
                    <a href="https://northwind.locode.dev/locode" class="inline-flex space-x-4">
                      <span class="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 tracking-wide uppercase"> What's new </span>
                      <span class="inline-flex items-center text-sm font-medium text-indigo-600 space-x-1">
                      <span>Open Northwind in Locode</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                      </span>
                    </a>
                  </div>
                  <div class="mt-6 sm:max-w-xl">
                    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-5xl">
                      Northwind Auto Locode
                    </h1>
                    <p class="mt-6 text-xl text-gray-500 dark:text-gray-400">
                      Northwind Auto is a customized database-first Northwind App using
                      <a class="text-indigo-600" href="/autoquery-autogen">AutoGen</a> to generate
                      <a class="text-indigo-600" href="/autoquery-rdbms">AutoQuery</a> &amp;
                      <a class="text-indigo-600" href="/autoquery-crud">CRUD</a> APIs
                      in less than <span class="font-semibold text-gray-900">120 Lines of Code</span> in
                      <a class="text-indigo-600" href="https://github.com/NetCoreApps/NorthwindAuto/blob/master/Configure.AppHost.cs">Configure.AppHost.cs</a>
                    </p>
                  </div>
                  <div class="mt-6">
                    <p class="text-2xl font-medium text-gray-900 dark:text-gray-50 mb-3">
                      Explore Features
                    </p>
                    <div class="flex items-center mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill="none"><path d="M4 5c0-1.007.875-1.755 1.904-2.223C6.978 2.289 8.427 2 10 2s3.022.289 4.096.777C15.125 3.245 16 3.993 16 5v4.758a4.485 4.485 0 0 0-1-.502V6.698a4.92 4.92 0 0 1-.904.525C13.022 7.711 11.573 8 10 8s-3.022-.289-4.096-.777A4.92 4.92 0 0 1 5 6.698V15c0 .374.356.875 1.318 1.313c.916.416 2.218.687 3.682.687c.22 0 .437-.006.65-.018c.447.367.966.65 1.534.822c-.68.127-1.417.196-2.184.196c-1.573 0-3.022-.289-4.096-.777C4.875 16.755 4 16.007 4 15V5zm1 0c0 .374.356.875 1.318 1.313C7.234 6.729 8.536 7 10 7s2.766-.27 3.682-.687C14.644 5.875 15 5.373 15 5c0-.374-.356-.875-1.318-1.313C12.766 3.271 11.464 3 10 3s-2.766.27-3.682.687C5.356 4.125 5 4.627 5 5zm8.5 12c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 13.5 17zm0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5z" fill="currentColor"></path></g></svg>
                      <a class="text-xl text-indigo-600" href="https://northwind.locode.dev/locode">Manage database with Locode</a>
                    </div>
                    <div class="flex items-center mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 32"><g fill="currentColor"><path d="M27.464 2.314a.501.501 0 0 0-.698-.257L14.86 8.339a.499.499 0 0 0-.233.621l.245.641l-6.873 3.769a.5.5 0 0 0-.222.63l.228.549l-7.299 3.488a.5.5 0 0 0-.246.643l1.498 3.61a.5.5 0 0 0 .629.28l7.625-2.701l.228.549a.5.5 0 0 0 .601.289l7.276-2.097l.218.569a.497.497 0 0 0 .612.299l13-4a.498.498 0 0 0 .317-.663l-5-12.501zM2.7 21.469l-1.134-2.734l6.823-3.261l1.439 3.47L2.7 21.469zm8.491-1.846l-.238-.574l-1.843-4.445l-.238-.573l6.336-3.475l2.374 6.134l.375.981l-6.766 1.952zm8.109-1.238l-.203-.531c-.003-.011-.001-.024-.006-.035l-.618-1.597l-2.754-7.206l11.023-5.815l4.592 11.48L19.3 18.385z"></path><path d="M28.964.314a.5.5 0 0 0-.929.371l6 15a.502.502 0 0 0 .651.279a.501.501 0 0 0 .279-.65l-6.001-15z"></path><path d="M18 21h-3c-1.14 0-2 .86-2 2v1.315l-5.879 6.859a.5.5 0 1 0 .758.651L13.73 25H16v6.5a.5.5 0 0 0 1 0V25h2.27l5.85 6.825a.497.497 0 0 0 .705.054a.5.5 0 0 0 .054-.705L20 24.315v-1.24C20 21.912 19.122 21 18 21zm1 3h-5v-1c0-.589.411-1 1-1h3c.57 0 1 .462 1 1.075V24z"></path></g></svg>
                      <a class="text-xl text-indigo-600" href="https://northwind.locode.dev/ui">Explore APIs in API Explorer</a>
                    </div>
                    <div class="mt-6 flex">
                      <div class="rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                        <a href="https://github.com/NetCoreApps/NorthwindAuto/archive/refs/heads/master.zip" class="flex hover:no-underline items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 dark:text-gray-50 bg-white hover:bg-gray-50">
                          Download Northwind.zip
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
              <div class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div class="hidden sm:block">
                  <div class="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full"></div>
                  <svg class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0" width="404" height="392" fill="none" viewBox="0 0 404 392"><defs><pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" /></pattern></defs><rect width="404" height="392" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" /></svg>
                </div>
                <div class="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                  <a href="https://northwind.locode.dev/locode">
                    <img class="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                         src="/img/pages/locode/northwind/screenshot.png" alt="">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
            <div>
                <p class="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-4xl">
                    Code-first Example Locode App
                </p>
                <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500 dark:text-gray-400">
                    For greater customizability we've exported AutoGen APIs of the <b>Chinook</b> sample database into typed AutoQuery APIs &amp; Data Models to unlock more flexible code-first declarative &amp; programmatic dev models that includes Custom UI components to showcase potential enhancements in Locode Apps 
                </p>
            </div>
        </div>
        
        
        <div class="bg-white pb-4">
          <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
            <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
              <div>
                <div>
                  <img class="h-11 w-auto" src="/img/pages/locode/chinook/logo.svg" alt="Chinook Logo">
                </div>
                <div class="mt-20">
                  <div>
                    <a href="https://chinook.locode.dev/locode" class="inline-flex space-x-4">
                      <span class="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500 tracking-wide uppercase"> What's new </span>
                      <span class="inline-flex items-center text-sm font-medium text-rose-500 space-x-1">
                      <span>Open Chinook in Locode</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                      </span>
                    </a>
                  </div>
                  <div class="mt-6 sm:max-w-xl">
                    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-5xl">
                      Chinook Locode
                    </h1>
                    <p class="mt-6 text-xl text-gray-500 dark:text-gray-400">
                      Chinook is a customized <a class="text-rose-500" href="/locode/code-first">Code-First</a> App using
                      <a class="text-rose-500" href="/autoquery-autogen">AutoGen</a> to
                      <a class="text-rose-500" href="/autoquery-autogen#export-code-first-dtos">export</a>
                      Chinook's RDBMS Tables into
                      <a class="text-rose-500" href="https://github.com/NetCoreApps/Chinook/blob/main/Chinook.ServiceModel/Types/Models.cs">Models.cs</a>
                      generating code-first
                      <a class="text-rose-500" href="/autoquery-rdbms">AutoQuery</a> APIs
                      &amp; Data Models that's further annotated to create a customized Locode App
                    </p>
                  </div>
                  <div class="mt-6">
                    <p class="text-2xl font-medium text-gray-900 dark:text-gray-50 mb-3">
                      Explore Features
                    </p>
                    <div class="flex items-center mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill="none"><path d="M4 5c0-1.007.875-1.755 1.904-2.223C6.978 2.289 8.427 2 10 2s3.022.289 4.096.777C15.125 3.245 16 3.993 16 5v4.758a4.485 4.485 0 0 0-1-.502V6.698a4.92 4.92 0 0 1-.904.525C13.022 7.711 11.573 8 10 8s-3.022-.289-4.096-.777A4.92 4.92 0 0 1 5 6.698V15c0 .374.356.875 1.318 1.313c.916.416 2.218.687 3.682.687c.22 0 .437-.006.65-.018c.447.367.966.65 1.534.822c-.68.127-1.417.196-2.184.196c-1.573 0-3.022-.289-4.096-.777C4.875 16.755 4 16.007 4 15V5zm1 0c0 .374.356.875 1.318 1.313C7.234 6.729 8.536 7 10 7s2.766-.27 3.682-.687C14.644 5.875 15 5.373 15 5c0-.374-.356-.875-1.318-1.313C12.766 3.271 11.464 3 10 3s-2.766.27-3.682.687C5.356 4.125 5 4.627 5 5zm8.5 12c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 13.5 17zm0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5z" fill="currentColor"></path></g></svg>
                      <a class="text-xl text-rose-500" href="https://chinook.locode.dev/locode">Manage database with Locode</a>
                    </div>
                    <div class="flex items-center mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 32"><g fill="currentColor"><path d="M27.464 2.314a.501.501 0 0 0-.698-.257L14.86 8.339a.499.499 0 0 0-.233.621l.245.641l-6.873 3.769a.5.5 0 0 0-.222.63l.228.549l-7.299 3.488a.5.5 0 0 0-.246.643l1.498 3.61a.5.5 0 0 0 .629.28l7.625-2.701l.228.549a.5.5 0 0 0 .601.289l7.276-2.097l.218.569a.497.497 0 0 0 .612.299l13-4a.498.498 0 0 0 .317-.663l-5-12.501zM2.7 21.469l-1.134-2.734l6.823-3.261l1.439 3.47L2.7 21.469zm8.491-1.846l-.238-.574l-1.843-4.445l-.238-.573l6.336-3.475l2.374 6.134l.375.981l-6.766 1.952zm8.109-1.238l-.203-.531c-.003-.011-.001-.024-.006-.035l-.618-1.597l-2.754-7.206l11.023-5.815l4.592 11.48L19.3 18.385z"></path><path d="M28.964.314a.5.5 0 0 0-.929.371l6 15a.502.502 0 0 0 .651.279a.501.501 0 0 0 .279-.65l-6.001-15z"></path><path d="M18 21h-3c-1.14 0-2 .86-2 2v1.315l-5.879 6.859a.5.5 0 1 0 .758.651L13.73 25H16v6.5a.5.5 0 0 0 1 0V25h2.27l5.85 6.825a.497.497 0 0 0 .705.054a.5.5 0 0 0 .054-.705L20 24.315v-1.24C20 21.912 19.122 21 18 21zm1 3h-5v-1c0-.589.411-1 1-1h3c.57 0 1 .462 1 1.075V24z"></path></g></svg>
                      <a class="text-xl text-rose-500" href="https://chinook.locode.dev/ui">Explore APIs in API Explorer</a>
                    </div>
                    <div class="mt-6 flex">
                      <div class="rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                        <a href="https://github.com/NetCoreApps/Chinook/archive/refs/heads/main.zip" class="flex hover:no-underline items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 dark:text-gray-50 bg-white hover:bg-gray-50">
                          Download Chinook.zip
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
              <div class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div class="hidden sm:block">
                  <div class="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full"></div>
                  <svg class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0" width="404" height="392" fill="none" viewBox="0 0 404 392"><defs><pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" /></pattern></defs><rect width="404" height="392" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" /></svg>
                </div>
                <div class="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                  <a href="https://chinook.locode.dev/locode">
                    <img class="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                         src="/img/pages/locode/chinook/screenshot.png" alt="">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
            <div>
                <p class="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-4xl">
                    Reuse typed APIs in Optimized UIs
                </p>
                <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500 dark:text-gray-400"> 
                    AutoQuery's declarative dev model lets you focus on your new App's business requirements where its data model, API capabilities, input validation &amp; multi-user Auth restrictions can be defined simply using annotated C# POCOs.<br> This provides immense value at the start of the development cycle where functional prototypes can be quickly iterated to gather business requirements <br><br> Once requirements have been solidified, the typed AutoQuery APIs can easily be reused to develop custom UIs to optimize important workflows. <br><br><a class="text-indigo-600" href="https://github.com/NetCoreApps/TalentBlazor">Talent Blazor</a> is a new App showcasing an example of this where its entire back-office functionality can be managed through Locode whilst an optimized <b>Blazor WASM</b> App is created to optimize its unique workflow requirements which also benefits from the superior productive dev model of its Typed APIs 
                </p>
            </div>
        </div>
        
        <div class="bg-white pb-8 pb-12">
          <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
            <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
              <div>
                <div>
                  <img class="h-11 w-auto" src="/img/pages/locode/talent/logo.svg" alt="Northwind Logo">
                </div>
                <div class="mt-20">
                  <div>
                    <a href="https://talent.locode.dev/locode" class="inline-flex space-x-4">
                      <span class="rounded bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600 tracking-wide uppercase"> What's new </span>
                      <span class="inline-flex items-center text-sm font-medium text-purple-600 space-x-1">
                      <span>Open Talent Blazor in Locode</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                      </span>
                    </a>
                  </div>
                  <div class="mt-6 sm:max-w-xl">
                    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-5xl">
                      Talent Blazor Locode
                    </h1>
                    <p class="mt-6 text-xl text-gray-500 dark:text-gray-400">
                      Talent Blazor is a Blazor WASM App built around a HR's unique workflow for processing Job Applications
                      from initial Application, through to Phone Screening and Interviews by multiple employees, capturing
                      relevant feedback at each application event, with successful Applicants awarded the Job
                      <br>
                      <br>
                      It's co-developed &amp; deployed with a customized Locode App that manages all other CRUD Database Access
                    </p>
                  </div>
                  <div class="mt-6">
                    <p class="text-2xl font-medium text-gray-900 dark:text-gray-50 mb-3">
                      Explore Features
                    </p>
                    <div class="flex items-center mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill="none"><path d="M4 5c0-1.007.875-1.755 1.904-2.223C6.978 2.289 8.427 2 10 2s3.022.289 4.096.777C15.125 3.245 16 3.993 16 5v4.758a4.485 4.485 0 0 0-1-.502V6.698a4.92 4.92 0 0 1-.904.525C13.022 7.711 11.573 8 10 8s-3.022-.289-4.096-.777A4.92 4.92 0 0 1 5 6.698V15c0 .374.356.875 1.318 1.313c.916.416 2.218.687 3.682.687c.22 0 .437-.006.65-.018c.447.367.966.65 1.534.822c-.68.127-1.417.196-2.184.196c-1.573 0-3.022-.289-4.096-.777C4.875 16.755 4 16.007 4 15V5zm1 0c0 .374.356.875 1.318 1.313C7.234 6.729 8.536 7 10 7s2.766-.27 3.682-.687C14.644 5.875 15 5.373 15 5c0-.374-.356-.875-1.318-1.313C12.766 3.271 11.464 3 10 3s-2.766.27-3.682.687C5.356 4.125 5 4.627 5 5zm8.5 12c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 13.5 17zm0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5z" fill="currentColor"></path></g></svg>
                      <a class="text-xl text-purple-600" href="https://talent.locode.dev/locode">Manage database with Locode</a>
                    </div>
                    <div class="flex items-center mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 32"><g fill="currentColor"><path d="M27.464 2.314a.501.501 0 0 0-.698-.257L14.86 8.339a.499.499 0 0 0-.233.621l.245.641l-6.873 3.769a.5.5 0 0 0-.222.63l.228.549l-7.299 3.488a.5.5 0 0 0-.246.643l1.498 3.61a.5.5 0 0 0 .629.28l7.625-2.701l.228.549a.5.5 0 0 0 .601.289l7.276-2.097l.218.569a.497.497 0 0 0 .612.299l13-4a.498.498 0 0 0 .317-.663l-5-12.501zM2.7 21.469l-1.134-2.734l6.823-3.261l1.439 3.47L2.7 21.469zm8.491-1.846l-.238-.574l-1.843-4.445l-.238-.573l6.336-3.475l2.374 6.134l.375.981l-6.766 1.952zm8.109-1.238l-.203-.531c-.003-.011-.001-.024-.006-.035l-.618-1.597l-2.754-7.206l11.023-5.815l4.592 11.48L19.3 18.385z"></path><path d="M28.964.314a.5.5 0 0 0-.929.371l6 15a.502.502 0 0 0 .651.279a.501.501 0 0 0 .279-.65l-6.001-15z"></path><path d="M18 21h-3c-1.14 0-2 .86-2 2v1.315l-5.879 6.859a.5.5 0 1 0 .758.651L13.73 25H16v6.5a.5.5 0 0 0 1 0V25h2.27l5.85 6.825a.497.497 0 0 0 .705.054a.5.5 0 0 0 .054-.705L20 24.315v-1.24C20 21.912 19.122 21 18 21zm1 3h-5v-1c0-.589.411-1 1-1h3c.57 0 1 .462 1 1.075V24z"></path></g></svg>
                      <a class="text-xl text-purple-600" href="https://talent.locode.dev/ui">Explore APIs in API Explorer</a>
                    </div>
                    <div class="flex items-center text-xl mb-2">
                      <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16 22.027v-2.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75a5.07 5.07 0 0 0-.09-3.77s-1.18-.35-3.91 1.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 5.797a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58v2.87"/><path d="M9 20.027c-3 .973-5.5 0-7-3"/></g></svg>
                      Browse
                      <a class="px-1 text-purple-600" href="https://github.com/NetCoreApps/TalentBlazor/tree/main/TalentBlazor.Client">Client</a>
                      and
                      <a class="px-1 text-purple-600" href="https://github.com/NetCoreApps/TalentBlazor/blob/main/TalentBlazor.ServiceInterface/TalentServices.cs">Server</a>
                      source code
                    </div>
                    <div class="mt-6 flex">
                      <div class="rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                        <a href="https://github.com/NetCoreApps/TalentBlazor/archive/refs/heads/main.zip" class="flex hover:no-underline items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 dark:text-gray-50 bg-white hover:bg-gray-50">
                          Download TalentBlazor.zip
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
              <div class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div class="hidden sm:block">
                  <div class="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full"></div>
                  <svg class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0" width="404" height="392" fill="none" viewBox="0 0 404 392"><defs><pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" /></pattern></defs><rect width="404" height="392" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" /></svg>
                </div>
                <div class="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                  <a href="https://talent.locode.dev">
                    <img class="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                         src="/img/pages/locode/talent/screenshot.png" alt="">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
            <div>
                <p class="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-4xl">
                    Use AutoQuery for most of your App's APIs
                </p>
                <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500 dark:text-gray-400"> 
                  AutoQuery enables a highly productive platform capable of rapidly developing a majority of App's CRUD functionality 
                  to enable a hybrid development model which can benefit from using customized
                  <a href="https://blazor-gallery.jamstacks.net/grid">AutoQueryGrid components</a>
                  to effortlessly implement the CRUD functionality to manage the Back office supporting tables, 
                  freeing up developers to focus a majority of their efforts where they 
                  add the most value - in the optimized customer-facing UI.
                </p>
            </div>
        </div>
        
        <div class="bg-white pb-8 pb-12">
            <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
                <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
                    <div>
                        <div>
                            <svg class="w-20 h-20 text-purple-600 mr-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15z" fill="currentColor"/></svg>
                        </div>
                        <div class="mt-20">
                            <div class="mt-6 sm:max-w-xl">
                                <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-5xl">
                                    Blazor Diffusion
                                </h1>
                                <p class="mt-6 text-xl text-gray-500 dark:text-gray-400">
                                    We’ve created 
                                    <a href="https://blazordiffusion.com">blazordiffusion.com</a>
                                    to best illustrate this potential
                                     - a new ServiceStack Blazor Tailwind App for 
                                    <a href="https://stability.ai/blog/stable-diffusion-public-release">Stable Diffusion</a> - a deep learning text-to-image model 
                                    that can generate quality images from a text prompt. It’s a great example of Hybrid Development where its entire user-facing UI 
                                    is a bespoke Blazor App optimized for creating and discovering Stable Diffusion generated images, whilst all its 
                                    <a href="https://github.com/NetCoreApps/BlazorDiffusion/tree/main/BlazorDiffusion/Pages/admin">supporting admin tasks</a>
                                    to manage the back office tables that power the UI were effortlessly implemented  with custom AutoQueryGrid components.
                                </p>
                            </div>
                            <div class="mt-6">
                                <p class="text-2xl font-medium text-gray-900 dark:text-gray-50 mb-3">
                                    Explore Features
                                </p>
                                <div class="flex items-center mb-2">
                                  <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 32"><g fill="currentColor"><path d="M27.464 2.314a.501.501 0 0 0-.698-.257L14.86 8.339a.499.499 0 0 0-.233.621l.245.641l-6.873 3.769a.5.5 0 0 0-.222.63l.228.549l-7.299 3.488a.5.5 0 0 0-.246.643l1.498 3.61a.5.5 0 0 0 .629.28l7.625-2.701l.228.549a.5.5 0 0 0 .601.289l7.276-2.097l.218.569a.497.497 0 0 0 .612.299l13-4a.498.498 0 0 0 .317-.663l-5-12.501zM2.7 21.469l-1.134-2.734l6.823-3.261l1.439 3.47L2.7 21.469zm8.491-1.846l-.238-.574l-1.843-4.445l-.238-.573l6.336-3.475l2.374 6.134l.375.981l-6.766 1.952zm8.109-1.238l-.203-.531c-.003-.011-.001-.024-.006-.035l-.618-1.597l-2.754-7.206l11.023-5.815l4.592 11.48L19.3 18.385z"></path><path d="M28.964.314a.5.5 0 0 0-.929.371l6 15a.502.502 0 0 0 .651.279a.501.501 0 0 0 .279-.65l-6.001-15z"></path><path d="M18 21h-3c-1.14 0-2 .86-2 2v1.315l-5.879 6.859a.5.5 0 1 0 .758.651L13.73 25H16v6.5a.5.5 0 0 0 1 0V25h2.27l5.85 6.825a.497.497 0 0 0 .705.054a.5.5 0 0 0 .054-.705L20 24.315v-1.24C20 21.912 19.122 21 18 21zm1 3h-5v-1c0-.589.411-1 1-1h3c.57 0 1 .462 1 1.075V24z"></path></g></svg>
                                  <a class="text-xl text-indigo-600" href="https://blazordiffusion.com/ui">Explore APIs in API Explorer</a>
                                </div>
                                <div class="flex items-center text-xl mb-2">
                                    <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g fill="none" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" stroke-width="1.5">
                                            <path
                                                d="M16 22.027v-2.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75a5.07 5.07 0 0 0-.09-3.77s-1.18-.35-3.91 1.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 5.797a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58v2.87" />
                                            <path d="M9 20.027c-3 .973-5.5 0-7-3" />
                                        </g>
                                    </svg>
                                    Browse
                                    <a class="px-1 text-purple-600"
                                        href="https://github.com/NetCoreApps/BlazorDiffusion">Blazor Server</a>
                                    source code
                                </div>
                                <div class="flex items-center text-xl mb-2">
                                    <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g fill="none" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" stroke-width="1.5">
                                            <path
                                                d="M16 22.027v-2.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75a5.07 5.07 0 0 0-.09-3.77s-1.18-.35-3.91 1.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 5.797a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58v2.87" />
                                            <path d="M9 20.027c-3 .973-5.5 0-7-3" />
                                        </g>
                                    </svg>
                                    Browse
                                    <a class="px-1 text-purple-600"
                                        href="https://github.com/NetCoreApps/BlazorDiffusionWasm">Blazor WASM</a>
                                    source code
                                </div>
        
                                <div class="mt-6 flex">
                                    <div class="rounded-md shadow">
                                        <a href="https://github.com/NetCoreApps/BlazorDiffusion/archive/refs/heads/main.zip"
                                            target="_blank"
                                            class="flex hover:no-underline px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 dark:text-gray-50 bg-white hover:bg-gray-50">
                                            Download BlazorDiffusion.zip
                                        </a>
                                    </div>
                                </div>
        
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
                    <div class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <div class="hidden sm:block">
                            <div
                                class="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full">
                            </div>
                            <svg class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0" width="404" height="392"
                                fill="none" viewBox="0 0 404 392">
                                <defs>
                                    <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20"
                                        height="20" patternUnits="userSpaceOnUse">
                                        <rect x="0" y="0" width="4" height="4" class="text-gray-200"
                                            fill="currentColor" />
                                    </pattern>
                                </defs>
                                <rect width="404" height="392" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
                            </svg>
                        </div>
                        <div
                            class="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                            <a href="https://blazordiffusion.com">
                                <img class="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/img/pages/blazor/blazordiffusion.com_splash.png" alt="">
                            </a>
                        </div>
                    </div>
                </div>
        
            </div>
        </div>
        
        <h3 class="mt-8 text-lg font-medium tracking-tight text-gray-900 dark:text-gray-50 dark:text-gray-50">More AutoQuery Source Code Examples</h3>
        <ul class="ul-circle list-disc mx-auto ml-5 mt-5 text-xl text-gray-500 dark:text-gray-400">
            <li class="mt-2"><a class="text-blue-600" href="https://github.com/NetCoreApps/BookingsCrud">NetCoreApps/BookingsCrud</a></li>
            <li class="mt-2"><a class="text-blue-600" href="https://github.com/NetCoreApps/TechStacks">NetCoreApps/TechStacks</a></li>
            <li class="mt-2"><a class="text-blue-600" href="https://github.com/NetCoreApps/StackApis/tree/master/src/StackApis.ServiceModel">NetCoreApps/StackApis</a></li>
            <li class="mt-2"><a class="text-blue-600" href="https://github.com/ServiceStackApps/GitHubAutoQuery/blob/master/src/GitHubAutoQuery/GitHubAutoQuery.ServiceModel/GitHubAutoQueries.cs">ServiceStackApps/GitHubAutoQuery</a></li>
        </ul>
    </div>`,
    setup() {
    }
}
