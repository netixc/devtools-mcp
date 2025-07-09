# DevTools MCP Server

A Model Context Protocol (MCP) server providing comprehensive development tools and AI assistant capabilities. This server offers 17 powerful tools for file operations, system commands, web access, task management, and intelligent guidance - perfect for integrating advanced development capabilities into any MCP client.

## 🚀 Quick Start

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/netixc/devtools-mcp.git
   cd devtools-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

### Running the Server

**Start the MCP server:**
```bash
npm start
```

**For development with auto-reload:**
```bash
npm run dev
```

### Adding to MCP Client Configuration

Add this server to your MCP client's configuration file. Here's how to configure it:

```json
{
  "mcpServers": {
    "devtools": {
      "description": "Development tools and AI assistant capabilities for software engineering",
      "command": "node",
      "args": [
        "/path/to/devtools-mcp/dist/index.js"
      ],
      "init_timeout": 10,
      "tool_timeout": 300
    }
  }
}
```

**Alternative configuration for development:**
```json
{
  "mcpServers": {
    "devtools": {
      "description": "Development tools and AI assistant capabilities for software engineering",
      "command": "npm",
      "args": [
        "run",
        "dev"
      ],
      "cwd": "/path/to/devtools-mcp",
      "init_timeout": 10,
      "tool_timeout": 300
    }
  }
}
```

## 🛠️ Available Tools

### File System Tools
- **Read**: Read file contents with line numbers and optional offset/limit
  - Support for large files with pagination
  - Line numbering for easy navigation
  - Automatic content truncation for very long lines

- **Write**: Create or overwrite files
  - Automatic directory creation
  - UTF-8 encoding support
  - Absolute path validation

- **Edit**: Perform exact string replacements in files
  - Single or multiple occurrence replacement
  - Exact string matching to prevent unintended changes
  - Validation to ensure old_string exists and is unique

- **MultiEdit**: Make multiple edits to a single file in one operation
  - Atomic operations (all edits succeed or none apply)
  - Sequential processing of edits
  - Efficient for bulk file modifications

- **Glob**: Find files using glob patterns
  - Support for complex patterns like `**/*.{js,ts}`
  - Results sorted by modification time
  - Cross-platform path handling

- **Grep**: Search file contents using regex patterns
  - Fast content search across codebases
  - Optional file type filtering
  - Regular expression support

- **LS**: List directory contents with file sizes
  - File size information
  - Directory indicators (trailing `/`)
  - Optional ignore patterns

### System Tools
- **Bash**: Execute bash commands with timeout and output capture
  - Configurable timeout (up to 10 minutes)
  - Combined stdout/stderr output
  - Output truncation for large results
  - Error handling and reporting

### Notebook Tools
- **NotebookRead**: Read Jupyter notebook cells and outputs
  - Support for all cell types (code, markdown)
  - Output display including execution results
  - Individual cell selection by ID

- **NotebookEdit**: Edit, insert, or delete notebook cells
  - Replace existing cell contents
  - Insert new cells at any position
  - Delete cells by ID
  - Maintain notebook structure integrity

### Web Tools
- **WebFetch**: Fetch and process web content
  - HTTP to HTTPS upgrade
  - HTML to text conversion
  - Content truncation for large pages
  - Redirect handling

- **WebSearch**: Search the web (simplified implementation)
  - Domain filtering (allow/block lists)
  - Result extraction and formatting
  - Note: Requires proper search API integration for production use

### Task Management Tools
- **TodoWrite**: Create and manage structured task lists
  - Track pending, in-progress, and completed tasks
  - Priority levels (high, medium, low)
  - Progress monitoring and reporting

- **Task**: Launch autonomous agents for complex tasks
  - Autonomous task execution framework
  - Note: Placeholder implementation - requires agent framework

- **exit_plan_mode**: Exit planning mode and begin implementation
  - Transition from planning to execution
  - Plan presentation and approval workflow

### Guidance Tools (NEW!)
- **GetToolGuidance**: Get comprehensive help for specific tools
  - Best practices and common patterns
  - Detailed examples and usage scenarios
  - Security notes and limitations

- **GetWorkflowGuidance**: Get guidance on common workflows
  - Step-by-step workflows for common tasks
  - Decision-making guidelines
  - When to use which tools

- **GetErrorHelp**: Get help with troubleshooting
  - Common error patterns and solutions
  - Tool-specific troubleshooting
  - General debugging guidance

- **GetQuickStart**: Get quick start guides
  - Task-specific quick start guides
  - Essential tips and best practices
  - Links to additional help resources

## 📋 Available Prompts

### system-prompts
Comprehensive system prompts for intelligent AI assistance including:
- Tone and style guidelines
- Security and defensive coding practices
- Task management approaches
- Tool usage policies
- Code style and conventions

*Note: Enhanced system prompts are available in `/root/agent-zero-dev/prompts/personal/` and can be integrated with your AI system for improved intelligence and reasoning capabilities.*

## 🔧 Configuration Features

The server provides intelligent development assistance including:
- **Concise Communication**: Direct, minimal responses
- **Proactive Task Management**: Automatic TodoWrite usage
- **Security Focus**: Defensive coding practices
- **Extensive Tool Usage**: File operations, system commands, web access
- **Markdown Support**: Rich formatting for responses

## 📝 Usage Examples

### Getting Help (NEW!)
```json
{
  "name": "GetToolGuidance",
  "arguments": {
    "tool_name": "Read",
    "guidance_type": "all"
  }
}
```

```json
{
  "name": "GetWorkflowGuidance",
  "arguments": {
    "workflow_type": "common_workflows",
    "specific_workflow": "Code Refactoring"
  }
}
```

```json
{
  "name": "GetErrorHelp",
  "arguments": {
    "error_message": "old_string not found in file"
  }
}
```

### File Operations
```json
{
  "name": "Read",
  "arguments": {
    "file_path": "/path/to/file.txt",
    "offset": 0,
    "limit": 100
  }
}
```

```json
{
  "name": "Edit",
  "arguments": {
    "file_path": "/path/to/file.txt",
    "old_string": "old text",
    "new_string": "new text",
    "replace_all": false
  }
}
```

```json
{
  "name": "Glob",
  "arguments": {
    "pattern": "**/*.{js,ts,tsx}",
    "path": "/project/src"
  }
}
```

### Task Management
```json
{
  "name": "TodoWrite",
  "arguments": {
    "todos": [
      {
        "id": "1",
        "content": "Implement user authentication",
        "status": "pending",
        "priority": "high"
      },
      {
        "id": "2",
        "content": "Add unit tests",
        "status": "in_progress",
        "priority": "medium"
      }
    ]
  }
}
```

### System Operations
```json
{
  "name": "Bash",
  "arguments": {
    "command": "npm run test",
    "description": "Run project tests",
    "timeout": 120000
  }
}
```

## 🏗️ Development

### Project Structure
```
src/
├── index.ts          # Main server setup and request handling
├── types.ts          # TypeScript type definitions
├── prompts.ts        # Claude Code system prompt
└── tools/
    ├── fileTools.ts  # File system operations
    ├── bashTool.ts   # Bash command execution
    ├── notebookTools.ts # Jupyter notebook support
    ├── webTools.ts   # Web content fetching
    └── taskTools.ts  # Task management tools
```

### Scripts
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled server
- `npm run dev`: Run in development mode with auto-reload

## ⚠️ Important Notes

- **Web Search**: Simplified implementation included. For production use, integrate with proper search APIs (Google Custom Search, Bing, etc.)
- **Task Agent**: Placeholder implementation. Requires autonomous agent framework for full functionality
- **Security**: All file operations include validation and security checks
- **Error Handling**: Comprehensive error handling and user-friendly error messages
- **Performance**: Optimized for large codebases with efficient file searching and processing

## 🔒 Security Features

- Path validation for file operations
- Timeout protection for long-running commands
- Input sanitization and validation
- Defensive coding practices throughout
- No execution of arbitrary code without explicit user commands

## 👤 Author

**Jawad Boulyou**
- Email: jboulyou@gmail.com
- GitHub: https://github.com/netixc

## 📄 License

MIT License

---

**Ready to supercharge your development workflow with intelligent AI-powered tools!**
