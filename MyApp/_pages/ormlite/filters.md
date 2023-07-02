---
title: OrmLite Filters
---

Similar to interceptors in some heavy ORMs, Insert and Update filters get fired just before any **INSERT** or **UPDATE** operation using OrmLite's typed API's (i.e. not dynamic SQL or partial updates using anon types). This functionality can be used for easily auto-maintaining Audit information for your POCO data models, e.g:

```csharp
public interface IAudit 
{
    DateTime CreatedDate { get; set; }
    DateTime ModifiedDate { get; set; }
    string ModifiedBy { get; set; }
}

OrmLiteConfig.InsertFilter = (dbCmd, row) => {
    if (row is IAudit auditRow)
        auditRow.CreatedDate = auditRow.ModifiedDate = DateTime.UtcNow;
};

OrmLiteConfig.UpdateFilter = (dbCmd, row) => {
    if (row is IAudit auditRow)
        auditRow.ModifiedDate = DateTime.UtcNow;
};
```

Which will ensure that the `CreatedDate` and `ModifiedDate` fields are populated on every insert and update.

## Validation Example

The filters can also be used for validation where throwing an exception will prevent the operation and bubble the exception, e.g:

```csharp
OrmLiteConfig.InsertFilter = OrmLiteConfig.UpdateFilter = (dbCmd, row) => {
    if (row is IAudit auditRow && auditRow.ModifiedBy == null)
        throw new ArgumentNullException("ModifiedBy");
};

try
{
    db.Insert(new AuditTable());
}
catch (ArgumentNullException) {
   //throws ArgumentNullException
}

db.Insert(new AuditTable { ModifiedBy = "Me!" }); //succeeds
```

