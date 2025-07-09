export const TOOL_GUIDANCE = {
  // File System Tools Guidance
  fileSystem: {
    Read: {
      bestPractices: [
        "Always use absolute paths, not relative paths",
        "Use offset/limit for large files to avoid memory issues",
        "Check file existence with LS before reading if unsure",
        "Use line numbers in output to reference specific code locations"
      ],
      commonPatterns: [
        "Read before Edit: Always read a file before editing to understand its content",
        "Incremental reading: Use offset/limit for files > 2000 lines",
        "Error handling: Check if file exists before reading"
      ],
      examples: [
        { description: "Read entire file", code: '{"name": "Read", "arguments": {"file_path": "/path/to/file.txt"}}' },
        { description: "Read specific lines", code: '{"name": "Read", "arguments": {"file_path": "/path/to/file.txt", "offset": 100, "limit": 50}}' }
      ]
    },
    
    Write: {
      bestPractices: [
        "Creates parent directories automatically",
        "Always overwrites existing files - use Edit for modifications",
        "Use absolute paths only",
        "Prefer editing existing files over creating new ones"
      ],
      commonPatterns: [
        "Read → Edit pattern: Prefer editing existing files",
        "Backup before overwrite: Read file first if you need to preserve content",
        "Configuration files: Good for creating new config files"
      ],
      examples: [
        { description: "Create new file", code: '{"name": "Write", "arguments": {"file_path": "/path/to/new_file.txt", "content": "Hello World"}}' }
      ]
    },
    
    Edit: {
      bestPractices: [
        "old_string must match exactly (including whitespace)",
        "Use replace_all: true for global replacements",
        "Make old_string unique to avoid ambiguity",
        "Always Read the file first to understand context"
      ],
      commonPatterns: [
        "Variable renaming: Use replace_all: true",
        "Single occurrence: Default behavior finds unique matches",
        "Context matching: Include surrounding lines for uniqueness"
      ],
      examples: [
        { description: "Single replacement", code: '{"name": "Edit", "arguments": {"file_path": "/path/to/file.txt", "old_string": "old text", "new_string": "new text"}}' },
        { description: "Global replacement", code: '{"name": "Edit", "arguments": {"file_path": "/path/to/file.txt", "old_string": "oldVar", "new_string": "newVar", "replace_all": true}}' }
      ]
    },
    
    MultiEdit: {
      bestPractices: [
        "All edits are atomic - if one fails, none are applied",
        "Edits are applied sequentially - order matters",
        "Use for bulk refactoring operations",
        "Test with single Edit first for complex changes"
      ],
      commonPatterns: [
        "Refactoring: Multiple related changes in one operation",
        "Import updates: Change multiple import statements",
        "Bulk renaming: Multiple variable renames"
      ],
      examples: [
        { description: "Multiple related edits", code: '{"name": "MultiEdit", "arguments": {"file_path": "/path/to/file.txt", "edits": [{"old_string": "old1", "new_string": "new1"}, {"old_string": "old2", "new_string": "new2"}]}}' }
      ]
    },
    
    Glob: {
      bestPractices: [
        "Use specific patterns to avoid too many results",
        "Results are sorted by modification time (newest first)",
        "Cross-platform - works on Windows/Linux/Mac",
        "Use for file discovery before batch operations"
      ],
      commonPatterns: [
        "Language-specific files: '**/*.{js,ts,jsx,tsx}'",
        "Configuration files: '**/config.*'",
        "Test files: '**/*.test.*' or '**/*_test.*'"
      ],
      examples: [
        { description: "Find TypeScript files", code: '{"name": "Glob", "arguments": {"pattern": "**/*.ts", "path": "/project/src"}}' },
        { description: "Find config files", code: '{"name": "Glob", "arguments": {"pattern": "**/config.{json,yaml,yml}"}}' }
      ]
    },
    
    Grep: {
      bestPractices: [
        "Use regex patterns for flexible matching",
        "Combine with include parameter for file type filtering",
        "Results sorted by modification time",
        "Use for finding specific code patterns"
      ],
      commonPatterns: [
        "Function definitions: 'function\\s+\\w+'",
        "Import statements: 'import.*from'",
        "Error handling: 'try\\s*{'",
        "Class definitions: 'class\\s+\\w+'"
      ],
      examples: [
        { description: "Find function definitions", code: '{"name": "Grep", "arguments": {"pattern": "function\\s+\\w+", "include": "*.js"}}' },
        { description: "Find imports", code: '{"name": "Grep", "arguments": {"pattern": "import.*from", "include": "*.{js,ts}"}}' }
      ]
    },
    
    LS: {
      bestPractices: [
        "Use absolute paths only",
        "Shows file sizes and directory indicators",
        "Use ignore patterns to filter results",
        "Good for understanding directory structure"
      ],
      commonPatterns: [
        "Project exploration: Start with root directory",
        "File verification: Check if files exist",
        "Size checking: Identify large files"
      ],
      examples: [
        { description: "List directory", code: '{"name": "LS", "arguments": {"path": "/project/src"}}' },
        { description: "List with ignore", code: '{"name": "LS", "arguments": {"path": "/project", "ignore": ["node_modules", ".git"]}}' }
      ]
    }
  },
  
  // System Tools Guidance
  system: {
    Bash: {
      bestPractices: [
        "Always include a clear description",
        "Use timeout for long-running commands",
        "Quote paths with spaces properly",
        "Combine commands with && or ; for efficiency"
      ],
      commonPatterns: [
        "Testing: Run tests before committing changes",
        "Building: Compile/build projects",
        "Git operations: Status, add, commit, push",
        "Package management: npm install, pip install"
      ],
      examples: [
        { description: "Run tests", code: '{"name": "Bash", "arguments": {"command": "npm test", "description": "Run project tests"}}' },
        { description: "Git status", code: '{"name": "Bash", "arguments": {"command": "git status && git diff", "description": "Check git status and changes"}}' }
      ],
      securityNotes: [
        "Never execute untrusted commands",
        "Be careful with file permissions",
        "Validate paths before using in commands",
        "Use timeouts to prevent hanging"
      ]
    }
  },
  
  // Task Management Guidance
  taskManagement: {
    TodoWrite: {
      bestPractices: [
        "Use for complex multi-step tasks",
        "Mark tasks as in_progress before starting",
        "Complete tasks immediately after finishing",
        "Use priority levels appropriately"
      ],
      commonPatterns: [
        "Planning: Break down large tasks into smaller steps",
        "Progress tracking: Update status as you work",
        "Debugging: Track what you've tried"
      ],
      examples: [
        { description: "Create task list", code: '{"name": "TodoWrite", "arguments": {"todos": [{"id": "1", "content": "Implement feature X", "status": "pending", "priority": "high"}]}}' }
      ]
    },
    
    Task: {
      bestPractices: [
        "Use for complex autonomous operations",
        "Provide detailed prompts",
        "Current implementation is placeholder",
        "Good for delegating search/analysis tasks"
      ],
      limitations: [
        "Placeholder implementation in current version",
        "Would need autonomous agent framework for full functionality",
        "Use for planning what would be automated"
      ]
    }
  },
  
  // Web Tools Guidance
  web: {
    WebFetch: {
      bestPractices: [
        "Handles JSON and HTML content differently",
        "Content is truncated if too large",
        "HTTP URLs upgraded to HTTPS automatically",
        "Use specific prompts for content extraction"
      ],
      commonPatterns: [
        "API testing: Fetch JSON endpoints",
        "Documentation: Extract content from web pages",
        "Data gathering: Collect information from URLs"
      ],
      examples: [
        { description: "Fetch JSON API", code: '{"name": "WebFetch", "arguments": {"url": "https://api.example.com/data", "prompt": "Extract the JSON data"}}' },
        { description: "Fetch HTML content", code: '{"name": "WebFetch", "arguments": {"url": "https://example.com", "prompt": "Extract the main content"}}' }
      ]
    },
    
    WebSearch: {
      bestPractices: [
        "Current implementation is simplified",
        "Use domain filtering for better results",
        "Expect limited functionality",
        "Good for planning what to search for"
      ],
      limitations: [
        "Simplified implementation",
        "May return empty results",
        "Requires proper search API integration for production"
      ]
    }
  },
  
  // Notebook Tools Guidance
  notebook: {
    NotebookRead: {
      bestPractices: [
        "Auto-generates cell IDs if missing",
        "Shows all cell types (code, markdown)",
        "Displays outputs and execution counts",
        "Use cell_id parameter for specific cells"
      ],
      commonPatterns: [
        "Analysis: Understand notebook structure",
        "Debugging: Check cell contents and outputs",
        "Validation: Verify notebook format"
      ]
    },
    
    NotebookEdit: {
      bestPractices: [
        "Always specify cell_type for insert mode",
        "Use proper cell IDs (auto-generated if missing)",
        "Three modes: replace, insert, delete",
        "Maintains notebook structure integrity"
      ],
      commonPatterns: [
        "Code updates: Replace cell content",
        "Documentation: Insert markdown cells",
        "Cleanup: Delete unnecessary cells"
      ],
      examples: [
        { description: "Replace cell", code: '{"name": "NotebookEdit", "arguments": {"notebook_path": "/path/to/notebook.ipynb", "cell_id": "cell-1", "new_source": "print(\'Hello\')", "edit_mode": "replace"}}' },
        { description: "Insert cell", code: '{"name": "NotebookEdit", "arguments": {"notebook_path": "/path/to/notebook.ipynb", "new_source": "# Title", "edit_mode": "insert", "cell_type": "markdown"}}' }
      ]
    }
  }
};

export const WORKFLOW_GUIDANCE = {
  commonWorkflows: {
    "File Analysis": {
      steps: [
        "1. Use LS to explore directory structure",
        "2. Use Glob to find relevant files",
        "3. Use Read to examine file contents",
        "4. Use Grep to search for specific patterns"
      ],
      example: "Understanding a new codebase"
    },
    
    "Code Refactoring": {
      steps: [
        "1. Use TodoWrite to plan refactoring tasks",
        "2. Use Grep to find all occurrences",
        "3. Use Read to understand context",
        "4. Use Edit or MultiEdit to make changes",
        "5. Use Bash to run tests"
      ],
      example: "Renaming variables or functions"
    },
    
    "Bug Investigation": {
      steps: [
        "1. Use Grep to find error messages or patterns",
        "2. Use Read to examine problematic files",
        "3. Use Bash to reproduce the issue",
        "4. Use Edit to implement fixes",
        "5. Use Bash to verify the fix"
      ],
      example: "Debugging runtime errors"
    },
    
    "Project Setup": {
      steps: [
        "1. Use LS to understand project structure",
        "2. Use Read to check package.json/requirements",
        "3. Use Bash to install dependencies",
        "4. Use Bash to run build/test commands",
        "5. Use Write to create configuration files"
      ],
      example: "Setting up a new development environment"
    }
  },
  
  decisionMaking: {
    "When to use Read vs Grep": {
      "Use Read when": [
        "You know the specific file to examine",
        "You need to see the full context",
        "You want to understand file structure"
      ],
      "Use Grep when": [
        "You're searching across multiple files",
        "You're looking for specific patterns",
        "You don't know which files contain the content"
      ]
    },
    
    "When to use Edit vs MultiEdit": {
      "Use Edit when": [
        "Making single, simple changes",
        "Testing changes before bulk operations",
        "Unsure about the scope of changes"
      ],
      "Use MultiEdit when": [
        "Making multiple related changes",
        "Confident about all changes needed",
        "Performing bulk refactoring"
      ]
    },
    
    "When to use Write vs Edit": {
      "Use Write when": [
        "Creating new files",
        "Completely replacing file contents",
        "File doesn't exist yet"
      ],
      "Use Edit when": [
        "Modifying existing files",
        "Preserving most of the content",
        "Making targeted changes"
      ]
    }
  }
};

export const ERROR_HANDLING_GUIDANCE = {
  commonErrors: {
    "File not found": {
      error: "Error: File not found at /path/to/file",
      solutions: [
        "Use LS to check if file exists",
        "Verify the path is correct and absolute",
        "Check if file was moved or deleted"
      ]
    },
    
    "old_string not found": {
      error: "old_string not found in file",
      solutions: [
        "Use Read to see actual file contents",
        "Check for exact whitespace matching",
        "Use Grep to find similar patterns"
      ]
    },
    
    "Multiple occurrences": {
      error: "old_string appears X times in file",
      solutions: [
        "Use replace_all: true for global replacement",
        "Add more context to make old_string unique",
        "Use MultiEdit for different replacements"
      ]
    },
    
    "Permission denied": {
      error: "Permission denied",
      solutions: [
        "Check file permissions with Bash: ls -la",
        "Use Bash to change permissions if needed",
        "Verify you have write access to the directory"
      ]
    }
  }
};