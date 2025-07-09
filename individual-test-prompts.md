# Individual devtools-mcp Intelligence Tests

## Test Administration Instructions

**Run ONE test at a time. Wait for completion before moving to the next.**

---

## Test 1.1: Context & Memory Simulation

**Scenario:** "I'm working on a React project with TypeScript. Earlier we discussed implementing a dark mode toggle. Now I want to add user preferences persistence. Continue from where we left off."

**Instructions:**
- Handle this as if you remember a previous conversation about dark mode
- Build upon that assumed context with specific implementation details
- Use devtools-mcp tools to implement the persistence feature
- Show understanding of implied continuity

**Success Criteria:**
- Makes reasonable assumptions about previous dark mode implementation
- Provides specific, actionable implementation steps
- Uses appropriate devtools-mcp tools (Read, Write, Edit, etc.)
- Shows seamless continuation from assumed context

**Scoring:**
- 21-25: Seamlessly builds on assumed context with relevant suggestions
- 16-20: Makes reasonable assumptions about dark mode context
- 6-15: Acknowledges missing context but proceeds generically
- 0-5: Cannot handle missing context, asks for clarification

---

## Test 1.2: Autonomous Problem Solving

**Scenario:** "My Node.js application is running slowly in production. Fix it."

**Instructions:**
- Do NOT ask for more details
- Decide your investigation approach autonomously
- Use devtools-mcp tools systematically to diagnose the issue
- Show logical reasoning about potential causes
- Adapt your strategy based on what you find

**Success Criteria:**
- Starts investigation immediately without asking questions
- Uses tools in logical sequence (LS, Grep, Read, Bash, etc.)
- Shows systematic debugging approach
- Demonstrates adaptation when initial approaches don't work

**Scoring:**
- 21-25: Demonstrates sophisticated reasoning and risk assessment
- 16-20: Shows logical progression and adapts based on findings
- 6-15: Takes basic steps but lacks systematic approach
- 0-5: Asks for more information without attempting analysis

---

## Test 1.3: Complex Task Decomposition

**Scenario:** "Build a complete CI/CD pipeline for a microservices architecture with automated testing, security scanning, and multi-environment deployment."

**Instructions:**
- Break this complex task into logical, manageable steps
- Use TodoWrite to create a comprehensive plan
- Show understanding of dependencies between components
- Prioritize implementation order
- Account for potential roadblocks and solutions

**Success Criteria:**
- Uses TodoWrite effectively to create detailed task breakdown
- Identifies dependencies between pipeline components
- Shows logical prioritization and sequencing
- Considers potential problems and mitigation strategies

**Scoring:**
- 21-25: Comprehensive breakdown with clear priorities and risk mitigation
- 16-20: Shows good decomposition with some dependency awareness
- 6-15: Creates basic task list but misses dependencies
- 0-5: Overwhelmed, asks to break down the request

---

## Test 1.4: Tool Mastery & Error Recovery

**Scenario:** "Find all TODO comments in this codebase."

**Instructions:**
- Try an initial approach using available tools
- When you encounter problems or suboptimal results, adapt your strategy
- Show multiple problem-solving approaches
- Complete the task despite setbacks
- DO NOT give up after first failure

**Success Criteria:**
- Attempts multiple different approaches
- Shows learning from failures
- Adapts strategy without being told
- Eventually finds a working solution

**Scoring:**
- 21-25: Demonstrates sophisticated strategy evolution and learning
- 16-20: Shows multiple adaptation strategies
- 6-15: Tries one alternative approach
- 0-5: Gives up after first failure

---

## Test 2.1: Context-Aware Tool Selection

**Scenario:** "The login functionality isn't working. Users report they can't sign in."

**Instructions:**
- Choose appropriate tools without guidance
- Sequence tool usage logically
- Adapt tool selection based on discoveries
- Optimize for efficiency
- Actually investigate the problem, don't just plan

**Success Criteria:**
- Chooses logical tools for login investigation
- Uses tools in efficient sequence
- Shows adaptation based on findings
- Demonstrates understanding of each tool's strengths

**Scoring:**
- 21-25: Optimal tool usage showing deep understanding of each tool's strengths
- 16-20: Good tool selection with logical progression
- 6-15: Uses tools but inefficient sequence
- 0-5: Random tool usage or asks which tools to use

---

## Test 2.2: Error Recovery

**Scenario:** "Edit the file `/tmp/config.json` and change the theme from 'light' to 'dark'"

**Instructions:**
- Attempt to edit the file using devtools-mcp tools
- When you encounter "old_string not found" or similar errors, adapt
- Try different approaches to complete the task
- Show resilience and debugging skills
- Do NOT give up when tools fail

**Success Criteria:**
- Attempts multiple edit strategies when initial approach fails
- Shows debugging of tool usage errors
- Finds alternative approaches to complete the task
- Demonstrates persistence and problem-solving

**Scoring:**
- 21-25: Sophisticated debugging and multiple recovery approaches
- 16-20: Shows good error recovery strategies
- 6-15: Basic error acknowledgment but limited recovery
- 0-5: Gives up after errors

---

## Test 3.1: Strategic Web Research

**Scenario:** "Find the latest best practices for React Server Components in 2024"

**Instructions:**
- Use WebSearch and WebFetch strategically
- Handle limited search results effectively
- Synthesize information from multiple sources
- Distinguish current vs outdated information
- Provide actionable insights

**Success Criteria:**
- Crafts effective search queries
- Uses multiple sources for comprehensive research
- Synthesizes information effectively
- Provides current, actionable recommendations

**Scoring:**
- 21-25: Sophisticated search and excellent information integration
- 16-20: Good search strategy with decent information synthesis
- 6-15: Some search attempts but limited result processing
- 0-5: Basic search with no synthesis

---

## Test 4.1: Dynamic Planning

**Scenario:** "Optimize this application for performance" (but during investigation, you discover the architecture is fundamentally flawed)

**Instructions:**
- Create initial plan with TodoWrite
- Begin investigating the application
- When you discover architectural issues, adapt your plan
- Show how you reprioritize based on findings
- Demonstrate scope management skills

**Success Criteria:**
- Creates initial performance optimization plan
- Discovers deeper architectural issues during investigation
- Adapts plan dynamically based on findings
- Shows sophisticated scope management

**Scoring:**
- 21-25: Sophisticated dynamic planning with excellent scope management
- 16-20: Good plan adaptation with logical reprioritization
- 6-15: Some plan adaptation but limited flexibility
- 0-5: Rigid adherence to initial plan despite new information

---

## Test 5.1: Code Intelligence

**Scenario:** "Analyze this React component and suggest improvements"
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/posts`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching posts:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
```

**Instructions:**
- Use Write tool to create this component in a file
- Use Read tool to analyze the code
- Identify specific issues beyond syntax errors
- Suggest meaningful improvements
- Consider performance, security, and maintainability
- Use Edit/MultiEdit to implement improvements

**Success Criteria:**
- Identifies multiple code issues (error handling, loading states, etc.)
- Suggests specific, actionable improvements
- Considers performance and security implications
- Actually implements some improvements using tools

**Scoring:**
- 21-25: Deep understanding with sophisticated improvement strategies
- 16-20: Good analysis with meaningful suggestions
- 6-15: Identifies basic issues but misses deeper problems
- 0-5: Only surface-level observations

---

## General Testing Guidelines

### For Each Test:
1. **Present only ONE test at a time**
2. **Wait for complete response before scoring**
3. **Score based on actual tool usage, not just planning**
4. **Look for adaptation and learning, not just execution**
5. **Evaluate intelligence, not just task completion**

### Key Intelligence Indicators:
- **Autonomous decision-making** without hand-holding
- **Actual tool usage** beyond just TodoWrite
- **Error recovery** and strategy adaptation
- **Context understanding** and building
- **Quality assessment** and production thinking

### Red Flags:
- Only planning without execution
- Asking for clarification instead of making assumptions
- Giving up when tools fail
- Using only TodoWrite for everything
- Not adapting strategies based on findings

---

**Use these individual tests to get a more accurate assessment of LLM intelligence capabilities with devtools-mcp tools.**
