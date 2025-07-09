import { Tool } from '../types.js';
import { TOOL_GUIDANCE, WORKFLOW_GUIDANCE, ERROR_HANDLING_GUIDANCE } from '../guidance.js';

export const guidanceTools: Tool[] = [
  {
    name: 'GetToolGuidance',
    description: 'Get comprehensive guidance on how to use specific tools effectively, including best practices, common patterns, and examples',
    inputSchema: {
      type: 'object',
      properties: {
        tool_name: {
          type: 'string',
          description: 'The name of the tool to get guidance for (e.g., "Read", "Edit", "Bash")',
        },
        guidance_type: {
          type: 'string',
          enum: ['all', 'best_practices', 'patterns', 'examples', 'security'],
          description: 'Type of guidance to retrieve (default: all)',
          default: 'all',
        },
      },
      required: ['tool_name'],
    },
    handler: async (args: any) => {
      const toolName = args.tool_name;
      const guidanceType = args.guidance_type || 'all';
      
      // Find the tool guidance
      let toolGuidance: any = null;
      for (const category of Object.values(TOOL_GUIDANCE)) {
        if ((category as any)[toolName]) {
          toolGuidance = (category as any)[toolName];
          break;
        }
      }
      
      if (!toolGuidance) {
        return `No guidance found for tool: ${toolName}. Available tools: ${Object.keys(TOOL_GUIDANCE).map(cat => Object.keys((TOOL_GUIDANCE as any)[cat]).join(', ')).join(', ')}`;
      }
      
      let output = `# ${toolName} Tool Guidance\n\n`;
      
      if (guidanceType === 'all' || guidanceType === 'best_practices') {
        if (toolGuidance.bestPractices) {
          output += `## Best Practices\n`;
          toolGuidance.bestPractices.forEach((practice: string) => {
            output += `- ${practice}\n`;
          });
          output += '\n';
        }
      }
      
      if (guidanceType === 'all' || guidanceType === 'patterns') {
        if (toolGuidance.commonPatterns) {
          output += `## Common Patterns\n`;
          toolGuidance.commonPatterns.forEach((pattern: string) => {
            output += `- ${pattern}\n`;
          });
          output += '\n';
        }
      }
      
      if (guidanceType === 'all' || guidanceType === 'examples') {
        if (toolGuidance.examples) {
          output += `## Examples\n`;
          toolGuidance.examples.forEach((example: any) => {
            output += `**${example.description}:**\n\`\`\`json\n${example.code}\n\`\`\`\n\n`;
          });
        }
      }
      
      if (guidanceType === 'all' || guidanceType === 'security') {
        if (toolGuidance.securityNotes) {
          output += `## Security Notes\n`;
          toolGuidance.securityNotes.forEach((note: string) => {
            output += `⚠️ ${note}\n`;
          });
          output += '\n';
        }
        
        if (toolGuidance.limitations) {
          output += `## Limitations\n`;
          toolGuidance.limitations.forEach((limitation: string) => {
            output += `- ${limitation}\n`;
          });
          output += '\n';
        }
      }
      
      return output;
    },
  },
  
  {
    name: 'GetWorkflowGuidance',
    description: 'Get guidance on common workflows and decision-making patterns for complex tasks',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_type: {
          type: 'string',
          enum: ['common_workflows', 'decision_making', 'all'],
          description: 'Type of workflow guidance to retrieve',
          default: 'all',
        },
        specific_workflow: {
          type: 'string',
          description: 'Specific workflow to get guidance for (e.g., "File Analysis", "Code Refactoring")',
        },
      },
      required: [],
    },
    handler: async (args: any) => {
      const workflowType = args.workflow_type || 'all';
      const specificWorkflow = args.specific_workflow;
      
      let output = '# Workflow Guidance\n\n';
      
      if (specificWorkflow) {
        const workflow = (WORKFLOW_GUIDANCE.commonWorkflows as any)[specificWorkflow];
        if (workflow) {
          output += `## ${specificWorkflow}\n\n`;
          output += `**Example Use Case:** ${workflow.example}\n\n`;
          output += `**Steps:**\n`;
          workflow.steps.forEach((step: string) => {
            output += `${step}\n`;
          });
          return output;
        } else {
          return `Workflow "${specificWorkflow}" not found. Available workflows: ${Object.keys(WORKFLOW_GUIDANCE.commonWorkflows).join(', ')}`;
        }
      }
      
      if (workflowType === 'all' || workflowType === 'common_workflows') {
        output += `## Common Workflows\n\n`;
        Object.entries(WORKFLOW_GUIDANCE.commonWorkflows).forEach(([name, workflow]: [string, any]) => {
          output += `### ${name}\n`;
          output += `**Use Case:** ${workflow.example}\n`;
          output += `**Steps:**\n`;
          workflow.steps.forEach((step: string) => {
            output += `${step}\n`;
          });
          output += '\n';
        });
      }
      
      if (workflowType === 'all' || workflowType === 'decision_making') {
        output += `## Decision Making Guidelines\n\n`;
        Object.entries(WORKFLOW_GUIDANCE.decisionMaking).forEach(([decision, guidance]: [string, any]) => {
          output += `### ${decision}\n`;
          Object.entries(guidance).forEach(([condition, items]: [string, any]) => {
            output += `**${condition}:**\n`;
            items.forEach((item: string) => {
              output += `- ${item}\n`;
            });
          });
          output += '\n';
        });
      }
      
      return output;
    },
  },
  
  {
    name: 'GetErrorHelp',
    description: 'Get help with common errors and troubleshooting guidance',
    inputSchema: {
      type: 'object',
      properties: {
        error_message: {
          type: 'string',
          description: 'The error message you encountered',
        },
        tool_name: {
          type: 'string',
          description: 'The tool that generated the error (optional)',
        },
      },
      required: [],
    },
    handler: async (args: any) => {
      const errorMessage = args.error_message;
      const toolName = args.tool_name;
      
      let output = '# Error Help\n\n';
      
      if (errorMessage) {
        // Try to match the error message to known errors
        const matchedError = Object.entries(ERROR_HANDLING_GUIDANCE.commonErrors).find(([key, errorInfo]: [string, any]) => {
          return errorMessage.toLowerCase().includes(key.toLowerCase()) || 
                 errorMessage.toLowerCase().includes(errorInfo.error.toLowerCase());
        });
        
        if (matchedError) {
          const [errorType, errorInfo] = matchedError;
          output += `## Identified Error: ${errorType}\n\n`;
          output += `**Error Pattern:** ${errorInfo.error}\n\n`;
          output += `**Solutions:**\n`;
          errorInfo.solutions.forEach((solution: string) => {
            output += `- ${solution}\n`;
          });
        } else {
          output += `## Error Analysis\n\n`;
          output += `**Your Error:** ${errorMessage}\n\n`;
          output += `**General Troubleshooting Steps:**\n`;
          output += `1. Check the tool documentation with GetToolGuidance\n`;
          output += `2. Verify file paths are absolute and correct\n`;
          output += `3. Check file permissions and existence\n`;
          output += `4. Review the exact parameters you're using\n`;
          output += `5. Try a simpler version of the command first\n\n`;
        }
      }
      
      output += `## All Common Errors\n\n`;
      Object.entries(ERROR_HANDLING_GUIDANCE.commonErrors).forEach(([errorType, errorInfo]: [string, any]) => {
        output += `### ${errorType}\n`;
        output += `**Error:** ${errorInfo.error}\n`;
        output += `**Solutions:**\n`;
        errorInfo.solutions.forEach((solution: string) => {
          output += `- ${solution}\n`;
        });
        output += '\n';
      });
      
      return output;
    },
  },
  
  {
    name: 'GetQuickStart',
    description: 'Get a quick start guide for using Claude Code tools effectively',
    inputSchema: {
      type: 'object',
      properties: {
        task_type: {
          type: 'string',
          enum: ['file_operations', 'code_analysis', 'debugging', 'project_setup', 'general'],
          description: 'Type of task you want to accomplish',
          default: 'general',
        },
      },
      required: [],
    },
    handler: async (args: any) => {
      const taskType = args.task_type || 'general';
      
      let output = '# Quick Start Guide\n\n';
      
      const quickStarts = {
        file_operations: {
          title: 'File Operations Quick Start',
          steps: [
            '1. **Explore**: Use LS to see directory structure',
            '2. **Find**: Use Glob to find files by pattern',
            '3. **Search**: Use Grep to find content across files',
            '4. **Read**: Use Read to examine specific files',
            '5. **Modify**: Use Edit for single changes, MultiEdit for multiple',
            '6. **Create**: Use Write only for new files'
          ],
          tips: [
            'Always use absolute paths',
            'Read files before editing them',
            'Use Grep to find what you need to change'
          ]
        },
        
        code_analysis: {
          title: 'Code Analysis Quick Start',
          steps: [
            '1. **Structure**: Use LS to understand project layout',
            '2. **Dependencies**: Read package.json/requirements files',
            '3. **Find patterns**: Use Grep to find functions, classes, imports',
            '4. **Examine code**: Use Read to understand implementation',
            '5. **Test**: Use Bash to run tests and builds'
          ],
          tips: [
            'Start with configuration files',
            'Look for main entry points',
            'Check test files for usage examples'
          ]
        },
        
        debugging: {
          title: 'Debugging Quick Start',
          steps: [
            '1. **Find errors**: Use Grep to search for error messages',
            '2. **Trace code**: Use Read to examine problem areas',
            '3. **Check logs**: Use Bash to view log files',
            '4. **Test changes**: Use Edit to try fixes',
            '5. **Verify**: Use Bash to run tests'
          ],
          tips: [
            'Use TodoWrite to track what you\'ve tried',
            'Make small changes and test each one',
            'Use GetErrorHelp for common error patterns'
          ]
        },
        
        project_setup: {
          title: 'Project Setup Quick Start',
          steps: [
            '1. **Explore**: Use LS to see project structure',
            '2. **Dependencies**: Read package.json/requirements',
            '3. **Install**: Use Bash to install dependencies',
            '4. **Configure**: Use Write to create config files',
            '5. **Test**: Use Bash to run build/test commands'
          ],
          tips: [
            'Check README files first',
            'Look for setup scripts',
            'Verify all dependencies are installed'
          ]
        },
        
        general: {
          title: 'General Quick Start',
          steps: [
            '1. **Plan**: Use TodoWrite for complex tasks',
            '2. **Explore**: Use LS and Glob to understand the codebase',
            '3. **Search**: Use Grep to find relevant code',
            '4. **Read**: Use Read to understand context',
            '5. **Modify**: Use Edit/MultiEdit to make changes',
            '6. **Test**: Use Bash to verify changes',
            '7. **Iterate**: Repeat as needed'
          ],
          tips: [
            'Use GetToolGuidance for specific tool help',
            'Use GetWorkflowGuidance for complex workflows',
            'Use GetErrorHelp when things go wrong'
          ]
        }
      };
      
      const guide = (quickStarts as any)[taskType];
      output += `## ${guide.title}\n\n`;
      
      output += `### Steps\n`;
      guide.steps.forEach((step: string) => {
        output += `${step}\n`;
      });
      
      output += `\n### Tips\n`;
      guide.tips.forEach((tip: string) => {
        output += `💡 ${tip}\n`;
      });
      
      output += `\n### Need More Help?\n`;
      output += `- Use **GetToolGuidance** for specific tool documentation\n`;
      output += `- Use **GetWorkflowGuidance** for complex workflows\n`;
      output += `- Use **GetErrorHelp** when you encounter errors\n`;
      
      return output;
    },
  },
];