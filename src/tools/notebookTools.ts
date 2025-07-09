import fs from 'fs/promises';
import { Tool } from '../types.js';

interface NotebookCell {
  id: string;
  cell_type: 'code' | 'markdown';
  source: string[];
  outputs?: any[];
  execution_count?: number | null;
}

interface Notebook {
  cells: NotebookCell[];
  metadata: any;
  nbformat: number;
  nbformat_minor: number;
}

export const notebookTools: Tool[] = [
  {
    name: 'NotebookRead',
    description: 'Reads a Jupyter notebook (.ipynb file) and returns all of the cells with their outputs',
    inputSchema: {
      type: 'object',
      properties: {
        notebook_path: {
          type: 'string',
          description: 'The absolute path to the Jupyter notebook file to read (must be absolute, not relative)',
        },
        cell_id: {
          type: 'string',
          description: 'The ID of a specific cell to read. If not provided, all cells will be read.',
        },
      },
      required: ['notebook_path'],
    },
    handler: async (args: any) => {
      const content = await fs.readFile(args.notebook_path, 'utf-8');
      const notebook: Notebook = JSON.parse(content);
      
      // Ensure all cells have IDs
      notebook.cells.forEach((cell, index) => {
        if (!cell.id) {
          cell.id = `cell-${index + 1}`;
        }
      });
      
      const cells = args.cell_id 
        ? notebook.cells.filter(cell => cell.id === args.cell_id)
        : notebook.cells;
      
      if (args.cell_id && cells.length === 0) {
        throw new Error(`Cell with ID ${args.cell_id} not found`);
      }
      
      return cells.map((cell, index) => {
        let output = `Cell ${index + 1} (${cell.cell_type}):\n`;
        output += `ID: ${cell.id}\n`;
        output += `Source:\n${Array.isArray(cell.source) ? cell.source.join('') : cell.source}\n`;
        
        if (cell.outputs && cell.outputs.length > 0) {
          output += `Outputs:\n`;
          cell.outputs.forEach((out, i) => {
            output += `  Output ${i + 1}: ${JSON.stringify(out, null, 2)}\n`;
          });
        }
        
        return output;
      }).join('\n---\n');
    },
  },
  
  {
    name: 'NotebookEdit',
    description: 'Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source',
    inputSchema: {
      type: 'object',
      properties: {
        notebook_path: {
          type: 'string',
          description: 'The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)',
        },
        new_source: {
          type: 'string',
          description: 'The new source for the cell',
        },
        cell_id: {
          type: 'string',
          description: 'The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified.',
        },
        edit_mode: {
          type: 'string',
          enum: ['replace', 'insert', 'delete'],
          description: 'The type of edit to make (replace, insert, delete). Defaults to replace.',
        },
        cell_type: {
          type: 'string',
          enum: ['code', 'markdown'],
          description: 'The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required.',
        },
      },
      required: ['notebook_path', 'new_source'],
    },
    handler: async (args: any) => {
      const content = await fs.readFile(args.notebook_path, 'utf-8');
      const notebook: Notebook = JSON.parse(content);
      
      // Ensure all cells have IDs
      notebook.cells.forEach((cell, index) => {
        if (!cell.id) {
          cell.id = `cell-${index + 1}`;
        }
      });
      
      const editMode = args.edit_mode || 'replace';
      
      if (editMode === 'insert') {
        if (!args.cell_type) {
          throw new Error('cell_type is required when inserting a new cell');
        }
        
        const newCell: NotebookCell = {
          id: `cell-${Date.now()}`,
          cell_type: args.cell_type,
          source: args.new_source.split('\n').map((line: string) => line + '\n').slice(0, -1),
          outputs: args.cell_type === 'code' ? [] : undefined,
          execution_count: args.cell_type === 'code' ? null : undefined,
        };
        
        if (args.cell_id) {
          const index = notebook.cells.findIndex(cell => cell.id === args.cell_id);
          if (index === -1) {
            throw new Error(`Cell with ID ${args.cell_id} not found`);
          }
          notebook.cells.splice(index + 1, 0, newCell);
        } else {
          notebook.cells.unshift(newCell);
        }
        
        await fs.writeFile(args.notebook_path, JSON.stringify(notebook, null, 2));
        return `Successfully inserted new ${args.cell_type} cell with ID ${newCell.id}`;
      }
      
      if (editMode === 'delete') {
        if (!args.cell_id) {
          throw new Error('cell_id is required when deleting a cell');
        }
        
        const index = notebook.cells.findIndex(cell => cell.id === args.cell_id);
        if (index === -1) {
          throw new Error(`Cell with ID ${args.cell_id} not found`);
        }
        
        notebook.cells.splice(index, 1);
        await fs.writeFile(args.notebook_path, JSON.stringify(notebook, null, 2));
        return `Successfully deleted cell with ID ${args.cell_id}`;
      }
      
      // Replace mode
      if (!args.cell_id) {
        throw new Error('cell_id is required when replacing a cell');
      }
      
      const cell = notebook.cells.find(cell => cell.id === args.cell_id);
      if (!cell) {
        throw new Error(`Cell with ID ${args.cell_id} not found`);
      }
      
      cell.source = args.new_source.split('\n').map((line: string) => line + '\n').slice(0, -1);
      
      if (args.cell_type && args.cell_type !== cell.cell_type) {
        cell.cell_type = args.cell_type;
        if (args.cell_type === 'code') {
          cell.outputs = [];
          cell.execution_count = null;
        } else {
          delete cell.outputs;
          delete cell.execution_count;
        }
      }
      
      await fs.writeFile(args.notebook_path, JSON.stringify(notebook, null, 2));
      return `Successfully updated cell with ID ${args.cell_id}`;
    },
  },
];