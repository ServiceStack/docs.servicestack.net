# AI Search Feature - Quick Start Guide

## For Users

### How to Use AI Search

1. **Open AI Search**
   - Look for the chat icon button in the header (next to the regular search)
   - Click it to open the AI Assistant modal

2. **Ask a Question**
   - Type your question in the input field
   - Press Enter or click the Send button
   - Wait for the AI to respond

3. **View Results**
   - AI response appears in the conversation
   - Search results are shown as clickable cards below the response
   - Click any result to read the full documentation

4. **Follow Up**
   - Ask another question in the same conversation
   - The AI remembers the context from previous messages
   - Continue the conversation naturally

### Example Questions

- "What is ServiceStack?"
- "How do I create an API?"
- "Tell me about authentication"
- "How do I use OrmLite?"
- "What are the best practices?"

## For Developers

### File Locations

```
MyApp/wwwroot/mjs/components/TypesenseConversation.mjs    # Main component
MyApp/wwwroot/mjs/components/TypesenseConversation.test.mjs # Tests
AI_SEARCH_FEATURE_GUIDE.md                                  # Full documentation
IMPLEMENTATION_SUMMARY.md                                   # What was built
QUICK_START.md                                              # This file
```

### Component Usage

The component is already integrated. It's automatically rendered in the header:

```html
<!-- In Pages/Shared/Header.cshtml -->
<typesense></typesense>
```

### API Endpoint

```
POST https://search.docs.servicestack.net/multi_search
```

### Key Functions

#### multiSearch(collection, message, conversationId)
Performs a conversational search and returns AI answer + results.

```javascript
const result = await multiSearch(
    'typesense_docs_v1',
    'What is ServiceStack?',
    null  // null for first message, conversation_id for follow-ups
)

// Returns:
{
    answer: "AI response text",
    conversation_id: "conv-xxx-xxx",
    hits: [
        {
            url: "/docs/page/",
            title: "Page Title",
            snippet: "Relevant excerpt..."
        }
    ]
}
```

#### clean(text)
Sanitizes text by removing zero-width spaces and normalizing whitespace.

```javascript
clean("Hello  &ZeroWidthSpace;World") // "Hello World"
```

### Component Props

**AISearchDialog:**
- `open` (Boolean) - Whether modal is visible
- `collection` (String) - Typesense collection name

**TypesenseConversation:**
- No props required (uses global state)

### Component Events

**AISearchDialog:**
- `@hide` - Emitted when user closes modal

### State Management

The component manages:
- `messages` - Array of user and assistant messages
- `inputMessage` - Current input text
- `loading` - Whether API call is in progress
- `conversationId` - ID for maintaining conversation context

### Styling

Uses Tailwind CSS classes. Key classes:
- `.search-dialog` - Modal container
- `.dialog` - Dialog box
- `.bg-blue-500` - User messages
- `.bg-gray-100` - Assistant messages
- `.bg-gray-50` - Search results

### Testing

Run the test suite:
```bash
node MyApp/wwwroot/mjs/components/TypesenseConversation.test.mjs
```

Expected output:
```
✓ Global utilities initialization
✓ Clean function (4/4 tests)
✓ Conversation ID preservation
✓ Component structure
✓ All tests completed!
```

### Debugging

1. **Check browser console** for errors
2. **Verify API connectivity**:
   ```javascript
   fetch('https://search.docs.servicestack.net/stats.json')
   ```
3. **Check collection name**:
   ```javascript
   console.log(globalThis.collection)
   ```
4. **Monitor network tab** for API requests

### Common Issues

**Modal doesn't open**
- Check if TypesenseConversation component is mounted
- Verify no JavaScript errors in console

**No search results**
- Verify Typesense API key is valid
- Check network tab for API response
- Ensure collection name is correct

**Conversation context lost**
- Verify conversation_id is being returned
- Check that it's passed in follow-up requests
- Look at network tab to confirm

### Customization

To customize the component:

1. **Change model ID**:
   ```javascript
   // In multiSearch function
   conversation_model_id: 'your-model-id'
   ```

2. **Change API endpoint**:
   ```javascript
   globalThis.BaseUrl = 'your-typesense-url'
   ```

3. **Modify styling**:
   - Edit Tailwind classes in template
   - Add custom CSS to `app.css`

4. **Add features**:
   - Message editing
   - Conversation history
   - Export functionality
   - User feedback

### Performance Tips

1. **Lazy load** - Component loads collection on first use
2. **Debounce** - Messages sent immediately (no debounce needed)
3. **Caching** - Collection name cached in globalThis
4. **Cleanup** - Component properly unmounts

### Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

### Security

- Uses search-only API key (no admin access)
- No sensitive data in client code
- CORS-enabled for cross-origin requests
- Proper error handling

## Architecture

```
TypesenseConversation (Main Component)
├── AISearchDialog (Modal Component)
│   ├── Messages Display
│   ├── Search Results
│   └── Input Area
└── Button (Opens Modal)

Global Utilities
├── get() - HTTP GET
├── post() - HTTP POST
├── BaseUrl - API endpoint
└── H - Headers

Helper Functions
├── multiSearch() - API integration
├── listCollections() - Get collections
└── clean() - Text sanitization
```

## Next Steps

1. **Monitor Usage** - Track how users interact with AI Search
2. **Gather Feedback** - Ask users about response quality
3. **Optimize** - Refine prompts and model settings
4. **Enhance** - Add new features based on feedback

## Support

- **Documentation**: See `AI_SEARCH_FEATURE_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Code**: See `TypesenseConversation.mjs`
- **Tests**: See `TypesenseConversation.test.mjs`

## Version

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: 2025-11-01

