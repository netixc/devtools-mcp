import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { fileTools } from './tools/fileTools.js';
import { bashTool } from './tools/bashTool.js';
import { notebookTools } from './tools/notebookTools.js';
import { webTools } from './tools/webTools.js';
import { taskTools } from './tools/taskTools.js';
import { guidanceTools } from './tools/guidanceTools.js';
import { SYSTEM_PROMPT } from './prompts.js';

const server = new Server(
  {
    name: 'devtools-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const allTools = [
  ...fileTools,
  ...bashTool,
  ...notebookTools,
  ...webTools,
  ...taskTools,
  ...guidanceTools,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = allTools.find(t => t.name === name);
  if (!tool) {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  }

  try {
    const result = await tool.handler(args);
    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// Note: Prompts are not yet standardized in MCP SDK, so we'll remove these handlers for now
// They can be added back when proper schemas are available

// server.setRequestHandler('prompts/list', async () => ({
//   prompts: [
//     {
//       name: 'claude-code-system',
//       description: 'Claude Code system prompt with all instructions and guidelines',
//       arguments: [],
//     },
//   ],
// }));

// server.setRequestHandler('prompts/get', async (request: any) => {
//   if (request.params.name === 'claude-code-system') {
//     return {
//       prompt: {
//         name: 'claude-code-system',
//         description: 'Claude Code system prompt with all instructions and guidelines',
//         messages: [
//           {
//             role: 'system',
//             content: {
//               type: 'text',
//               text: SYSTEM_PROMPT,
//             },
//           },
//         ],
//       },
//     };
//   }
//   
//   throw new McpError(
//     ErrorCode.MethodNotFound,
//     `Unknown prompt: ${request.params.name}`
//   );
// });

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);