import { exec } from 'child_process';
import { promisify } from 'util';
import { Tool } from '../types.js';

const execAsync = promisify(exec);

export const bashTool: Tool[] = [
  {
    name: 'Bash',
    description: 'Executes a given bash command in a persistent shell session with optional timeout',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The command to execute',
        },
        description: {
          type: 'string',
          description: 'Clear, concise description of what this command does in 5-10 words',
        },
        timeout: {
          type: 'number',
          description: 'Optional timeout in milliseconds (max 600000)',
        },
      },
      required: ['command'],
    },
    handler: async (args: any) => {
      const timeout = Math.min(args.timeout || 120000, 600000);
      
      try {
        const { stdout, stderr } = await execAsync(args.command, {
          timeout,
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer
          shell: '/bin/bash',
        });
        
        let output = '';
        if (stdout) output += stdout;
        if (stderr) output += stderr;
        
        // Truncate output if too long
        if (output.length > 30000) {
          output = output.substring(0, 30000) + '\n... (output truncated)';
        }
        
        return output || 'Command executed successfully with no output';
      } catch (error: any) {
        if (error.killed && error.signal === 'SIGTERM') {
          throw new Error(`Command timed out after ${timeout}ms`);
        }
        
        let errorMessage = `Command failed: ${error.message}`;
        if (error.stdout) errorMessage += `\nStdout: ${error.stdout}`;
        if (error.stderr) errorMessage += `\nStderr: ${error.stderr}`;
        
        throw new Error(errorMessage);
      }
    },
  },
];