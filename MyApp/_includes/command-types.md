To reduce the effort in creating commands with a `IRequest` context we've added a number ergonomic 
base classes to better capture the different call-styles a unit of logic can have including 
**Sync** or **Async** execution, whether they require **Input Arguments** or have **Result Outputs**.

Choosing the appropriate Abstract base class benefits from IDE tooling in generating the method
signature that needs to be implemented whilst Async commands with Cancellation Tokens in its method
signature highlights any missing async methods that are called without the token. 

### Sync Commands

 - `SyncCommand` - Requires No Arguments
 - `SyncCommand<TRequest>` - Requires TRequest Argument
 - `SyncCommandWithResult<TResult>` - Requires No Args and returns Result
 - `SyncCommandWithResult<TRequest,TResult>` - Requires Argument and returns Result

```csharp
public record MyArgs(int Id);
public record MyResult(string Message);

public class MyCommandNoArgs(ILogger<MyCommandNoArgs> log) : SyncCommand
{
    protected override void Run()
    {
        log.LogInformation("Called with No Args");
    }
}

public class MyCommandArgs(ILogger<MyCommandNoArgs> log) : SyncCommand<MyArgs>
{
    protected override void Run(MyArgs request)
    {
        log.LogInformation("Called with {Id}", request.Id);
    }
}

public class MyCommandWithResult(ILogger<MyCommandNoArgs> log) : SyncCommandWithResult<MyResult>
{
    protected override MyResult Run()
    {
        log.LogInformation("Called with No Args and returns Result");
        return new MyResult("Hello World");
    }
}

public class MyCommandWithArgsAndResult(ILogger<MyCommandNoArgs> log) 
    : SyncCommandWithResult<MyArgs,MyResult>
{
    protected override MyResult Run(MyArgs request)
    {
        log.LogInformation("Called with {Id} and returns Result", request.Id);
        return new MyResult("Hello World");
    }
}
```

### Async Commands

- `AsyncCommand` - Requires No Arguments
- `AsyncCommand<TRequest>` - Requires TRequest Argument
- `AsyncCommandWithResult<TResult>` - Requires No Args and returns Result
- `AsyncCommandWithResult<TReq,TResult>` - Requires Argument and returns Result

```csharp
public class MyAsyncCommandNoArgs(ILogger<MyCommandNoArgs> log) : AsyncCommand
{
    protected override async Task RunAsync(CancellationToken token)
    {
        log.LogInformation("Async called with No Args");
    }
}

public class MyAsyncCommandArgs(ILogger<MyCommandNoArgs> log) 
    : AsyncCommand<MyArgs>
{
    protected override async Task RunAsync(MyArgs request, CancellationToken token)
    {
        log.LogInformation("Async called with {Id}", request.Id);
    }
}

public class MyAsyncCommandWithResult(ILogger<MyCommandNoArgs> log) 
    : AsyncCommandWithResult<MyResult>
{
    protected override async Task<MyResult> RunAsync(CancellationToken token)
    {
        log.LogInformation("Async called with No Args and returns Result");
        return new MyResult("Hello World");
    }
}

public class MyAsyncCommandWithArgsAndResult(ILogger<MyCommandNoArgs> log) 
    : AsyncCommandWithResult<MyArgs,MyResult>
{
    protected override async Task<MyResult> RunAsync(
        MyArgs request, CancellationToken token)
    {
        log.LogInformation("Called with {Id} and returns Result", request.Id);
        return new MyResult("Hello World");
    }
}
```
