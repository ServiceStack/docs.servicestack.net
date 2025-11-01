# AI Search Feature Implementation Guide

## Overview

The AI Search feature has been successfully implemented using Typesense's conversational `multi_search` API. This feature allows users to ask questions to an AI assistant and receive both AI-generated answers and relevant search results from the documentation.

## Features

### 1. **Conversational Interface**
- Modal dialog that opens when clicking the AI Search button
- Clean, intuitive UI for asking questions
- Real-time message display with user and assistant messages
- Automatic scrolling to latest messages

### 2. **AI Assistant Responses**
- Powered by Typesense's conversational model (`conv-model-1`)
- Generates contextual answers based on documentation
- Displays answers prominently in the conversation

### 3. **Search Results Integration**
- Displays relevant search results alongside AI answers
- Shows document titles, snippets, and links
- Results are clickable and navigate to the full documentation

### 4. **Conversation Persistence**
- Maintains `conversation_id` across multiple messages
- Allows follow-up questions within the same conversation
- Context is preserved for coherent multi-turn conversations

## Component Structure

### TypesenseConversation.mjs

The main component file located at:
```
MyApp/wwwroot/mjs/components/TypesenseConversation.mjs
```

#### Key Components:

1. **AISearchDialog Component**
   - Modal dialog for the search interface
   - Manages conversation state and messages
   - Handles user input and API calls

2. **TypesenseConversation Component**
   - Main component exported as default
   - Renders the AI Search button
   - Manages dialog visibility
   - Initializes collection on mount

#### Key Functions:

- `ensureGlobals()` - Initializes global utilities (get, post, BaseUrl, H)
- `clean(s)` - Sanitizes text by removing zero-width spaces and normalizing whitespace
- `listCollections()` - Fetches available Typesense collections
- `multiSearch(collection, message, conversationId)` - Performs conversational search

## Usage

### For Users

1. **Opening AI Search**
   - Click the AI Search button (chat icon) in the header
   - The modal dialog will open with an input field

2. **Asking Questions**
   - Type your question in the input field
   - Press Enter or click the Send button
   - Wait for the AI assistant to respond

3. **Following Up**
   - Ask follow-up questions in the same conversation
   - The conversation_id is automatically maintained
   - Context from previous messages is preserved

4. **Viewing Results**
   - AI response appears in the conversation
   - Search results are displayed below the response
   - Click on any result to navigate to the full documentation

### For Developers

#### Integration Points

The component is already integrated into the main application:

1. **Header Component** (`Pages/Shared/Header.cshtml`)
   - The `<typesense></typesense>` component is rendered in the header
   - Includes both the regular search and AI search buttons

2. **App Initialization** (`wwwroot/mjs/app.mjs`)
   - TypesenseConversation is registered as a component
   - Automatically mounted when the page loads

#### API Configuration

The component uses the following Typesense configuration:

```javascript
const BaseUrl = "https://search.docs.servicestack.net"
const H = {
    search: {
        "accept": "application/json",
        "x-typesense-api-key": "N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo"
    },
    admin: {
        "accept": "application/json",
        "x-typesense-api-key": "N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo"
    }
}
```

#### Multi-Search API Call

The component makes POST requests to:
```
https://search.docs.servicestack.net/multi_search
```

With parameters:
- `q` - The user's question
- `conversation` - Set to `true` to enable conversation mode
- `conversation_model_id` - Set to `'conv-model-1'`
- `conversation_id` - (Optional) ID from previous message for follow-ups

Request body:
```json
{
    "searches": [{
        "collection": "typesense_docs_v1",
        "query_by": "embedding",
        "exclude_fields": "embedding"
    }]
}
```

## Response Structure

The API returns a response with the following structure:

```javascript
{
    conversation: {
        answer: "AI-generated answer text",
        conversation_id: "conv-123-456",
        query: "Original user query"
    },
    results: [{
        found: 2,
        out_of: 100,
        page: 1,
        hits: [
            {
                document: {
                    url: "/docs/page/",
                    anchor: "section",
                    content: "Full content",
                    hierarchy: {
                        lvl0: "Title",
                        lvl1: "Subtitle",
                        lvl2: null,
                        lvl3: null
                    }
                },
                vector_distance: 0.15,
                highlights: [{
                    snippet: "Relevant snippet..."
                }]
            }
        ]
    }]
}
```

## Styling

The component uses Tailwind CSS classes for styling:

- **Modal**: `fixed inset-0 z-50 flex bg-black/25`
- **Dialog**: `max-w-2xl rounded-lg shadow-lg`
- **Messages**: 
  - User: `bg-blue-500 text-white`
  - Assistant: `bg-gray-100 dark:bg-gray-700`
- **Results**: `bg-gray-50 dark:bg-gray-900 rounded-lg p-3`
- **Input**: `border border-gray-300 dark:border-gray-600 rounded-lg`

## Testing

A comprehensive test suite is included at:
```
MyApp/wwwroot/mjs/components/TypesenseConversation.test.mjs
```

Run tests with:
```bash
node MyApp/wwwroot/mjs/components/TypesenseConversation.test.mjs
```

Tests verify:
1. Global utilities initialization
2. Text cleaning function
3. Conversation ID preservation
4. Component structure

## Browser Compatibility

The component uses modern JavaScript features:
- ES6 modules
- Async/await
- Fetch API
- Vue 3 Composition API

Supported browsers:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## Performance Considerations

1. **Debouncing**: Messages are sent immediately on Enter or button click
2. **Scrolling**: Auto-scroll to latest message uses `nextTick()` for smooth UX
3. **Loading State**: Disabled input during API calls to prevent duplicate submissions
4. **Error Handling**: Graceful error messages displayed in conversation

## Future Enhancements

Potential improvements:
1. Add message editing/deletion
2. Implement conversation history/saving
3. Add typing indicators
4. Support for code snippets in responses
5. Conversation export functionality
6. User feedback (thumbs up/down) on responses
7. Rate limiting and usage analytics

## Troubleshooting

### Modal doesn't open
- Check browser console for errors
- Verify TypesenseConversation component is mounted
- Check that collection is initialized

### No search results
- Verify Typesense API key is valid
- Check network tab for API response
- Ensure collection name matches expected format

### Conversation_id not persisting
- Check that response includes `conversation_id`
- Verify it's being stored in component state
- Check that it's passed in subsequent requests

## Files Modified

1. **MyApp/wwwroot/mjs/components/TypesenseConversation.mjs**
   - Complete rewrite with AI Search modal
   - Added AISearchDialog component
   - Added global utility functions
   - Enhanced multiSearch function

2. **MyApp/wwwroot/mjs/components/TypesenseConversation.test.mjs** (New)
   - Comprehensive test suite
   - Tests for all major functions

## Support

For issues or questions about the AI Search feature, refer to:
- Typesense Documentation: https://typesense.org/docs/
- Vue 3 Documentation: https://vuejs.org/
- ServiceStack Documentation: https://docs.servicestack.net/

