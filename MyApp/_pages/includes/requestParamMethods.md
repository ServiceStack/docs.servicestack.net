| Query Methods         |                | Description                                                          |
|-----------------------|----------------|----------------------------------------------------------------------|
| formQuery(name)       | -> string      | FormData[name] ?? QueryString[name]                                  |
| formQueryValues(name) | -> string[]    | FormData[name]                                                       |
| httpParam(name)       | -> string      | Headers[X-name] ?? QueryString[name] ?? FormData[name] ?? Item[name] |
| queryString           | -> string      | $"?{QueryString.ToString()}"                                         |
| queryDictionary       | -> Dictionary  | QueryString.ToObjectDictionary()                                     |
| formDictionary        | -> Dictionary  | FormData.ToObjectDictionary()                                        |
| formValue(name)       | -> string      | if (hasError) FormData[name] ?? QueryString[name]                    |
| formValues(name)      | -> string[]    | if (hasError) FormData[name] ?? QueryString[name]                    |
| formCheckValue(name)  | -> bool        | formValue(name) in [ "true", "t", "on", "1" ]                        |
