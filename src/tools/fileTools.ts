import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { Tool } from '../types.js';

export const fileTools: Tool[] = [
  {
    name: 'Read',
    description: 'Reads a file from the local filesystem. You can access any file directly by using this tool.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'The absolute path to the file to read',
        },
        offset: {
          type: 'number',
          description: 'The line number to start reading from. Only provide if the file is too large to read at once',
        },
        limit: {
          type: 'number',
          description: 'The number of lines to read. Only provide if the file is too large to read at once.',
        },
      },
      required: ['file_path'],
    },
    handler: async (args: any) => {
      try {
        const content = await fs.readFile(args.file_path, 'utf-8');
        const lines = content.split('\n');
        
        const offset = args.offset || 0;
        const limit = args.limit || 2000;
        
        const selectedLines = lines.slice(offset, offset + limit);
        
        const numberedLines = selectedLines.map((line, idx) => {
          const lineNum = offset + idx + 1;
          const spaces = ' '.repeat(Math.max(0, 6 - lineNum.toString().length));
          const truncatedLine = line.length > 2000 ? line.substring(0, 2000) + '...' : line;
          return `${spaces}${lineNum}\t${truncatedLine}`;
        });
        
        return numberedLines.join('\n');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          return `Error: File not found at ${args.file_path}`;
        }
        throw error;
      }
    },
  },
  
  {
    name: 'Write',
    description: 'Writes a file to the local filesystem.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'The absolute path to the file to write (must be absolute, not relative)',
        },
        content: {
          type: 'string',
          description: 'The content to write to the file',
        },
      },
      required: ['file_path', 'content'],
    },
    handler: async (args: any) => {
      const dir = path.dirname(args.file_path);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(args.file_path, args.content, 'utf-8');
      return `File created successfully at: ${args.file_path}`;
    },
  },
  
  {
    name: 'Edit',
    description: 'Performs exact string replacements in files.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'The absolute path to the file to modify',
        },
        old_string: {
          type: 'string',
          description: 'The text to replace',
        },
        new_string: {
          type: 'string',
          description: 'The text to replace it with (must be different from old_string)',
        },
        replace_all: {
          type: 'boolean',
          description: 'Replace all occurences of old_string (default false)',
          default: false,
        },
      },
      required: ['file_path', 'old_string', 'new_string'],
    },
    handler: async (args: any) => {
      const content = await fs.readFile(args.file_path, 'utf-8');
      
      if (args.old_string === args.new_string) {
        throw new Error('old_string and new_string must be different');
      }
      
      let newContent: string;
      if (args.replace_all) {
        newContent = content.split(args.old_string).join(args.new_string);
      } else {
        const index = content.indexOf(args.old_string);
        if (index === -1) {
          throw new Error('old_string not found in file');
        }
        const occurrences = content.split(args.old_string).length - 1;
        if (occurrences > 1) {
          throw new Error(`old_string appears ${occurrences} times in file. Use replace_all or provide more context.`);
        }
        newContent = content.replace(args.old_string, args.new_string);
      }
      
      await fs.writeFile(args.file_path, newContent, 'utf-8');
      return `Successfully edited ${args.file_path}`;
    },
  },
  
  {
    name: 'MultiEdit',
    description: 'This is a tool for making multiple edits to a single file in one operation.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'The absolute path to the file to modify',
        },
        edits: {
          type: 'array',
          description: 'Array of edit operations to perform sequentially on the file',
          items: {
            type: 'object',
            properties: {
              old_string: {
                type: 'string',
                description: 'The text to replace',
              },
              new_string: {
                type: 'string',
                description: 'The text to replace it with',
              },
              replace_all: {
                type: 'boolean',
                description: 'Replace all occurences of old_string (default false)',
                default: false,
              },
            },
            required: ['old_string', 'new_string'],
          },
          minItems: 1,
        },
      },
      required: ['file_path', 'edits'],
    },
    handler: async (args: any) => {
      let content = await fs.readFile(args.file_path, 'utf-8');
      
      for (const edit of args.edits) {
        if (edit.old_string === edit.new_string) {
          throw new Error('old_string and new_string must be different');
        }
        
        if (edit.replace_all) {
          content = content.split(edit.old_string).join(edit.new_string);
        } else {
          const index = content.indexOf(edit.old_string);
          if (index === -1) {
            throw new Error(`old_string not found: "${edit.old_string}"`);
          }
          const occurrences = content.split(edit.old_string).length - 1;
          if (occurrences > 1) {
            throw new Error(`old_string "${edit.old_string}" appears ${occurrences} times. Use replace_all or provide more context.`);
          }
          content = content.replace(edit.old_string, edit.new_string);
        }
      }
      
      await fs.writeFile(args.file_path, content, 'utf-8');
      return `Successfully applied ${args.edits.length} edits to ${args.file_path}`;
    },
  },
  
  {
    name: 'Glob',
    description: 'Fast file pattern matching tool that works with any codebase size',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'The glob pattern to match files against',
        },
        path: {
          type: 'string',
          description: 'The directory to search in. If not specified, the current working directory will be used.',
        },
      },
      required: ['pattern'],
    },
    handler: async (args: any) => {
      const cwd = args.path || process.cwd();
      const matches = await glob(args.pattern, { cwd, absolute: true });
      
      const stats = await Promise.all(
        matches.map(async (file) => {
          const stat = await fs.stat(file);
          return { file, mtime: stat.mtime };
        })
      );
      
      stats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      return stats.map(s => s.file).join('\n');
    },
  },
  
  {
    name: 'Grep',
    description: 'Fast content search tool that works with any codebase size',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'The regular expression pattern to search for in file contents',
        },
        path: {
          type: 'string',
          description: 'The directory to search in. Defaults to the current working directory.',
        },
        include: {
          type: 'string',
          description: 'File pattern to include in the search (e.g. "*.js", "*.{ts,tsx}")',
        },
      },
      required: ['pattern'],
    },
    handler: async (args: any) => {
      const cwd = args.path || process.cwd();
      const pattern = args.include || '**/*';
      const files = await glob(pattern, { cwd, absolute: true, nodir: true });
      
      const regex = new RegExp(args.pattern);
      const matches: string[] = [];
      
      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          if (regex.test(content)) {
            matches.push(file);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
      
      const stats = await Promise.all(
        matches.map(async (file) => {
          const stat = await fs.stat(file);
          return { file, mtime: stat.mtime };
        })
      );
      
      stats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      return stats.map(s => s.file).join('\n');
    },
  },
  
  {
    name: 'LS',
    description: 'Lists files and directories in a given path.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The absolute path to the directory to list (must be absolute, not relative)',
        },
        ignore: {
          type: 'array',
          description: 'List of glob patterns to ignore',
          items: {
            type: 'string',
          },
        },
      },
      required: ['path'],
    },
    handler: async (args: any) => {
      const entries = await fs.readdir(args.path, { withFileTypes: true });
      
      const results = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(args.path, entry.name);
          
          if (args.ignore) {
            for (const pattern of args.ignore) {
              if (await glob(pattern, { cwd: args.path }).then(matches => matches.includes(entry.name))) {
                return null;
              }
            }
          }
          
          if (entry.isDirectory()) {
            return `${entry.name}/`;
          } else {
            const stat = await fs.stat(fullPath);
            return `${entry.name} (${stat.size} bytes)`;
          }
        })
      );
      
      return results.filter(Boolean).join('\n');
    },
  },
];